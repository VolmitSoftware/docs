---
title: "Pack Management"
description: "Iris documentation: Pack Management"
published: true
date: 2026-08-15T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
This page covers the lifecycle of a pack outside the editor: pulling one down from GitHub, validating it, clearing out resources nothing references, packaging it for distribution, and — carefully — swapping the pack snapshot inside a world that already exists. Authoring packs live under the platform packs root; production worlds hold their own copy at `<world>/iris/pack`.

See also: [03 - Configuration](/iris/03-configuration), [04 - Commands & Permissions](/iris/04-commands-permissions), [05 - Concepts & Pack Layout](/iris/05-concepts-pack-layout), [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle), [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas), [24 - Pack Mods & Snippets](/iris/24-pack-mods-snippets), [27 - Example - Configuring Overworld](/iris/27-example-configuring-overworld).

## The mental model

A pack exists in up to three places at once, and confusing them is the usual source of "my edit did nothing":

- **The authoring copy**, at `packs/<key>/`. This is what Studio edits and what `/iris create` copies from.
- **The world snapshot**, at `<world>/iris/pack`. Every Iris world holds a full copy of the pack it was created with. It is frozen at creation time. Editing the authoring copy never touches an existing world.
- **The export**, at `exports/<key>.iris`. A zip of the dimension's dependency closure, for handing to somebody else.

Validation runs against a directory, not a key, so a pack can be valid in the workspace and stale in a world. Iris caches startup validation results and re-uses them only when the pack bytes, the visible pack set, the platform, and the relevant game registries all still match — otherwise it revalidates. Fresh validation rechecks the content fingerprint after parsing; if files keep changing, Iris retries once and then refuses the unstable result until writes stop.

When Iris atomically copies a validated source pack into a new world snapshot, it may transfer that exact validation result only after a strong content fingerprint proves the copied tree matches the source. Root-level hidden metadata such as `.git/`, `.iris/`, and `.idea/`, plus `*.code-workspace` files, is not copied into production snapshots or included in that proof; hidden resources inside active pack folders remain covered. A mismatch or unreadable fingerprint runs the full semantic validator against the snapshot root instead.

## Walkthrough: take a pack from workspace to release

Run this after the pack works in Studio and before you create or update a production world.

**1. Place the authoring tree.** `packs/<key>/` must contain at least one `dimensions/*.json`. On Bukkit that's the plugin data folder's `packs/`; on Fabric/Forge/NeoForge it's `config/irisworldgen/packs/`.

**2. Validate and read the result.**

```
# Bukkit
/iris pack validate pack=<key>
/iris pack status pack=<key>

# Modded
/iris pack validate <key>
/iris pack status <key>
```

`validate` re-runs every check and republishes the result. `status` prints the currently published result, which may be a reused startup result — run `validate` first if you've edited files. Continue only when the pack reports loadable with zero blocking errors. Warnings are informational, but read them: unresolved content keys become blocking the moment strict content mode is on.

**3. Preview cleanup without writing anything.**

```
# Bukkit
/iris pack cleanup <key> mode=preview

# Modded
/iris pack cleanup <key>
```

Preview is the default on both platforms and touches nothing. Read every candidate. Cleanup finds resources with no inbound reference, which includes resources you load dynamically or reference from something it doesn't scan — if a candidate is intentional, stop here and leave cleanup unapplied.

**4. Apply cleanup only if the preview was clean.**

```
# Bukkit
/iris pack cleanup <key> mode=apply

# Modded
/iris pack cleanup <key> apply
```

Files move into `<pack>/.iris-trash/<timestamp>/` rather than being deleted, and the pack's cached validation result is dropped. Validate again afterwards. If cleanup took something you needed, `/iris pack restore <key> mode=apply` (Bukkit) or `/iris pack restore <key> apply` (modded) moves the most recent quarantine dump back.

**5. Package the closure.**

```
# Bukkit
/iris studio package dimension=<key>

# Modded
/iris studio package <key>
```

Success is `exports/<key>.iris` plus a completion message. The source pack and every world snapshot are untouched.

**6. Test on a disposable world.** Create a fresh world from the release pack, walk it, restart the server, and walk it again. For breaking pack changes, ship a new world rather than updating an old one.

**7. Only then consider replacing an existing world's snapshot.** Take a backup first and use the update-world procedure at the bottom of this page.

The loop passes when the source closure validates, the package command produces the expected export, a fresh world from that export reloads cleanly, and the world's snapshot matches what you intended to ship. If your release process distributes the `.iris` file rather than the source tree, unpack it and validate it separately — the packager's output is not automatically validated.

## Pack workspace

| Item | Rule |
|------|------|
| Packs root | Bukkit: plugin data folder `packs/`. Modded: `config/irisworldgen/packs/` |
| Visible packs | Non-hidden directories directly under the packs root |
| "Present" | The directory resolves inside the packs root, passes a safe-tree check (no symlinks escaping), has a real `dimensions/` directory, and contains at least one regular `.json` file in it. Content is never parsed, so a pack with broken JSON is still "present" and will not be re-downloaded |
| Safe key | Download destination folder names must match `[a-z0-9_-]+` |

## Download

| Command | Syntax |
|---------|--------|
| Bukkit and modded | `/iris download pack=overworld`, `/iris download pack=underworld`, or `/iris download link=<http(s)-zip-url>` (alias `/iris dl`) |

| Param | Default | What it does |
|-------|---------|--------------|
| `pack` | mutually exclusive with `link` | Accepts exactly `overworld` or `underworld`; values are case-insensitive |
| `link` | mutually exclusive with `pack` | Direct HTTP(S) URL whose path ends in `.zip` |

`overworld` and `underworld` are built-in packs whose beta-release URLs are embedded in Iris for now.

| Pack | Source |
|------|--------|
| `overworld` | `https://github.com/IrisDimensions/overworld/releases/download/beta/overworld.zip` |
| `underworld` | `https://github.com/IrisDimensions/underworld/releases/download/beta/underworld.zip` |

There is no listing lookup, arbitrary repository-name lookup, Git branch selector, positional source, overwrite option, or implicit download from world and Studio commands. For a direct ZIP with multiple dimensions, Iris uses the shortest dimension key, then alphabetical order, as the destination folder.

A successful download performs registry-independent pack validation and atomically publishes the pack on disk, then asks the operator to restart. The command reports connecting, transfer, unpacking, validation, and publication as styled phases. Bukkit players receive a rate-limited 24-cell HUD progress display with percentage, transferred size, total size, and transfer rate when the server supplies a content length; it uses the action bar when that Iris HUD slot is free and a stacked boss bar otherwise. Unknown-length transfers and non-transfer phases use a moving indeterminate bar. Console progress is limited to 10-percent boundaries or five-second intervals, and success, failure, cancellation, already-installed, and restart-required outcomes remain in chat or console history. Direct-link output identifies a Remote ZIP without echoing the URL or any signed query parameters. The command does not compile into the running registry, deny later logins, stop the server, or restart it automatically. Bootstrap validation proves the pack tree is structurally sound; it does not prove that external keys referenced through `datapackImports` exist in the current live registry.

The shipping Overworld declares Towns & Towers and Dungeons & Taverns and references their registered structures. Use this deterministic Paper-family sequence:

```text
/iris download pack=overworld
/iris download pack=underworld
/iris datapack ingest restart=true
```

Wait for each download to complete before issuing the next command; the download slot never queues a second request. The ingest installs declared external datapacks and restarts the server when new registry content was published. After the server returns:

```text
/iris replace minecraft:overworld type=overworld seed=123456789
/iris replace minecraft:the_nether type=underworld seed=-987654321
```

Restart once after both replacements report staged. The first restart registers external dependencies; the second cold reconcile publishes both exact replacements together with the two independently selected seeds. Omit a `seed=` argument to preserve that slot's existing saved seed. Full replacement validation must reject an external structure key that is still absent rather than freezing a world pack that cannot load.

### Install pipeline (`PackDownloader`)

1. Acquire the one server-wide download slot. If any explicit pack download is already active, Iris rejects the new request immediately before network or staging work; repeated requests for the same pack, requests for another pack, and direct-link requests are never queued.
2. If a built-in pack is already present, return without touching the network. Direct links are fetched before their dimension key is known, but publication still refuses an existing target.
3. Download the zip under hard limits: archive at most 512 MiB, at most 100,000 entries, at most 2 GiB total uncompressed, at most 256 MiB per file. Exceeding any of these aborts the install.
4. Unpack into a temporary staging directory and identify one pack home containing `dimensions/`; repository metadata beside that directory is ignored.
5. Open the staging tree with the datapack-compiler loader and pick the dimension. A `link=` download uses the shortest key, then alphabetical order, when the archive has multiple dimensions. A built-in download names its expected key, requires exactly one dimension matching it, and keeps any additional dimension resources in the pack.
6. Run `PackValidator.validateForDatapackBootstrap` against the staging tree. Structural blocking errors abort the install and print the errors; live-registry checks wait until the restart, after external datapacks are registered.
7. Publish atomically into `packs/<key>/`, refusing symlinked targets and refusing a key that conflicts with a different folder's dimension key. The validation result is published to the registry as part of the same step.

Only one explicit pack download runs at a time on Bukkit and modded, and the slot is released after success or failure. Existing complete packs and symbolic-link sources are retained; this command surface has no overwrite mode.

## Validate

| Command | Syntax |
|---------|--------|
| Bukkit | `/iris pack validate [pack=<key>]` (alias `v`) |
| Modded | `/iris pack validate [<pack>]` (alias `v`) |
| Bukkit | `/iris pack status [pack=<key>]` (alias `s`) |
| Modded | `/iris pack status [<pack>]` (alias `s`) |

Omitting the pack validates every visible pack and reports how many are broken. `status` reads the published result instead of re-running anything, so after editing files `status` can be stale until you run `validate`.

### What gets checked (`PackValidator`)

| Check | Blocking or warning |
|-------|---------------------|
| Pack folder missing, `dimensions/` missing, or no dimension JSON in it | Blocking, and stops the rest of validation |
| Dimension JSON integrity | Blocking errors and warnings, as emitted |
| Legacy cave-profile field names, in dimensions/regions/biomes and in `snippet/cave-profile/` | Blocking, with the replacement name named |
| Loot graph — every referenced loot table resolves | Blocking |
| Removed worldgen fields (currently `fluidBodies`) | Blocking |
| Object surface support | Blocking |
| `rotation` / `translate` / `scale` on surfaces that don't support them | Blocking |
| Structure graph and compiled structure graph | Errors blocking, warnings advisory |
| Native structure replacement envelopes | Blocking |
| Spawner entries pointing at entities that exist, across both `spawns` and `initialSpawns` | Blocking |
| Custom biome spawn category resolution | Blocking |
| Content keys and block properties | Blocking when `general.strictContentKeys` is on or `-Diris.strictContent` is set, otherwise warnings. Palette-sourced findings stay advisory either way |

A pack is loadable when it has zero blocking errors. `status` prints the blocking count and up to ten warnings plus a "more" count.

### The validation cache

Bukkit persists both successful and failed startup validation results and reuses them only when everything below still matches:

- the exact set of visible pack names,
- a content fingerprint over the pack bytes,
- the validator's own schema version,
- strict-content mode,
- the platform name, Minecraft version, and Iris version,
- the sorted key sets of the live block, biome, item, and entity registries,
- the sorted key sets of the live structure, jigsaw-structure, template-pool, structure-set, and object-feature hooks.

Any mismatch — changed bytes, a mod added or removed, a version bump, a missing or extra pack, a malformed or oversized cache file, or a manual `validate` — discards the cache. Cached *failures* stay blocking, so a pack that failed validation at startup will not authorize world or Studio creation until it validates clean.

## Cleanup (unused resources)

| Command | Mode | Behaviour |
|---------|------|-----------|
| Bukkit `/iris pack cleanup <pack> [mode=preview]` (alias `c`) | `preview` (default) | List candidates. No writes |
| | `apply` | Move candidates to quarantine |
| Modded `/iris pack cleanup <pack> [apply]` (alias `c`) | no literal (default) | Preview |
| | `apply` | Move candidates to quarantine |

Folders scanned for unreferenced JSON: `biomes`, `regions`, `entities`, `spawners`, `loot`, `generators`, `expressions`, `markers`, `blocks`, `mods`.

Excluded from the reference corpus entirely: `.iris-trash`, `datapack-imports`, `externaldatapacks`, `internaldatapacks`, `datapacks`, `cache`, `objects`, `.iris`.

Applying re-scans from scratch rather than trusting an earlier preview, so a preview you ran an hour ago can't quarantine something you've since started using. Quarantined files land under `<pack>/.iris-trash/<yyyyMMdd-HHmmss-SSS>/`. A failed apply rolls back what it can and reports any paths that are still quarantined so you can restore them by hand. A successful apply drops the pack's cached validation result.

## Restore

| Command | Mode | Behaviour |
|---------|------|-----------|
| Bukkit `/iris pack restore <pack> [mode=preview]` (alias `r`) | `preview` (default) | List the files in the most recent quarantine dump, plus any destination conflicts |
| | `apply` | Move them back |
| Modded `/iris pack restore <pack> [apply]` (alias `r`) | no literal (default) | Preview |
| | `apply` | Move them back |

Restore operates on the **latest** dump only. It refuses the whole operation when any destination path already exists and reports the conflict list instead of merging — resolve those by hand first. With no quarantine dump present, nothing is restored and nothing is reported as an error.

## Package (export)

| Command | Syntax |
|---------|--------|
| Bukkit | `/iris studio package [dimension=default] [obfuscate=false] [minify=true]` (method alias `pkg`) |
| Modded | `/iris studio package [<pack>]` (alias `pkg`) |

| Param | Default | What it does |
|-------|---------|--------------|
| `dimension` | contextual, else `default` | The dimension to package. The closure is walked from here |
| `obfuscate` | `false` | Rename every object to a random UUID in the export and rewrite placement references to match. Bukkit only |
| `minify` | `true` | Write JSON with no indentation. Bukkit only; the modded packager always minifies |

Output is `exports/<dimensionKey>.iris` — under the plugin data folder on Bukkit, under `config/irisworldgen/exports/` on modded. The staging folder is deleted after zipping (compression level 9). Neither the source pack nor any world snapshot is modified.

### What the package actually contains

Both compilers walk the dimension, its regions, their biomes, and collect generators, loot tables, entity keys, object keys, and the structure closure. Both write `package.json` with a content hash, a timestamp, and the dimension's `version`.

Written to the export:

`dimensions/`, `regions/`, `biomes/`, `generators/`, `blocks/` (all block definitions in the pack, not just referenced ones), `loot/`, `entities/`, `objects/`, the structure closure, `package.json`.

The ambient-spawning graph is exported in full: `spawners/` and `markers/` are written, object placements on regions as well as biomes are followed (markers on those placements pull in their spawners), spawner entities are collected from both `spawns` and `initialSpawns`, and entity loot tables land in `loot/`. Adding spawner or marker files changes `package.json`'s hash, so re-exported packages hash differently than older ones.

**Not written by either compiler:**

- `mods/` — never collected or written. Harmless, since nothing applies them (see [24 - Pack Mods & Snippets](/iris/24-pack-mods-snippets)).
- `expressions/`, `caves/`, `images/` and other folders outside the collected set.

One platform difference beyond that: Bukkit re-serializes from the loaded object graph, which inlines snippet references. Modded copies the source JSON verbatim and does not copy `snippet/`, so snippet references in a modded export dangle. Validate the unpacked tree before you publish an `.iris` artifact.

## Developer update-world (unsafe)

| Command |
|---------|
| `/iris developer update-world world=<world> pack=<dimension> confirm=true` |

Aliases: the command group is `/iris developer` or `/iris dev`; the subcommand is `update-world` or `^world`. `pack` also accepts the alias `dimension`, and `confirm` accepts `c`.

| Param | Default | What it does |
|-------|---------|--------------|
| `world` | contextual | The world whose `iris/pack` snapshot gets replaced |
| `pack` | contextual | The source dimension, resolved from the live packs root |
| `confirm` | `false` | Required. Without it the command only prints the warning and exits |

What it does:

1. Refuse unless `confirm=true`.
2. Take a `PACK_MUTATION` / `PACK_PUBLISH` lease, so it can't race another pack publish. If the lease is busy it reports that and stops.
3. Copy the pack into a staging directory next to the target, confirm the dimension loads from staging, then publish atomically over `<world>/iris/pack`.
4. Invalidate the previous validation result for that exact root and validate the newly published snapshot. **If validation fails, the publication rolls back** and the world keeps its old pack.
5. If an engine is still holding the old pack data, restart the server with the reason `"An active Iris world pack was replaced."`

This is unsafe for production without a backup for reasons the command can't fix: chunks that already exist keep their old terrain. Only future generation and pack-driven systems — loot, spawners, effects, block drops — see the new content. A pack change that alters terrain shape leaves a visible seam at the edge of the generated region. Prefer staging a new world whenever the pack's terrain contract changes.

## Related operations

| Task | Where |
|------|-------|
| Create a studio project from a template | `/iris studio create` — [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas) |
| Open VSCode with generated schemas | `/iris studio vscode` — [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas) |
| Import vanilla objects and structures into a pack | `/iris studio importvanilla` — [19 - Objects](/iris/19-objects) |
| Structure import and conversion | `/iris structure …` — [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks) |
| Strict content key enforcement | `settings.general.strictContentKeys` — [03 - Configuration](/iris/03-configuration) |
| Datapack bootstrap and install | `/iris datapack` — [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks) |

## Checklist

1. Place or download the pack under `packs/<key>/` with at least one `dimensions/*.json`.
2. Validate until loadable: `/iris pack validate pack=<key>` on Bukkit, `/iris pack validate <key>` on modded.
3. Optionally preview cleanup, review every candidate, then apply and validate again. Restore if it took something needed.
4. Create a world with `/iris create …`, which copies the pack into the world, or open Studio for live editing.
5. Package with `/iris studio package dimension=<key>` (Bukkit) or `/iris studio package <key>` (modded).
6. Replace an existing world's snapshot only after a backup, with `/iris dev update-world world=<world> pack=<dimension> confirm=true`.
