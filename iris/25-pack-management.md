---
title: "Pack Management"
description: "Iris documentation: Pack Management"
published: true
date: 2026-08-22T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
This page covers the lifecycle of a pack outside the editor. Pull one down from GitHub. Validate it. Clear out resources nothing references. Package it for distribution. Carefully swap the pack snapshot inside a world that already exists. Authoring packs live under the platform packs root. Production worlds hold their own copy at `<world>/iris/pack`.

See also:

- [03 - Configuration](/iris/03-configuration)
- [04 - Commands & Permissions](/iris/04-commands-permissions)
- [05 - Concepts & Pack Layout](/iris/05-concepts-pack-layout)
- [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle)
- [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas)
- [24 - Pack Mods & Snippets](/iris/24-pack-mods-snippets)
- [27 - Example - Configuring Overworld](/iris/27-example-configuring-overworld)

## The mental model

A pack exists in up to three places at once. Confusing them is the usual source of "my edit did nothing":

- **The authoring copy**, at `packs/<key>/`. This is what Studio edits and what `/iris create` copies from.
- **The world snapshot**, at `<world>/iris/pack`. Every Iris world holds a full copy of the pack it was created with. It is frozen at creation time. Editing the authoring copy never touches an existing world.
- **The export**, at `exports/<key>.iris`. A zip of the dimension dependency closure, for handing to somebody else.

Validation runs against a directory, not a key. A pack can be valid in the workspace and stale in a world. Iris caches startup validation results. It re-uses them only when the pack bytes, the visible pack set, the platform, and the relevant game registries all still match. Otherwise it revalidates. Fresh validation rechecks the content fingerprint after parsing. If files keep changing, Iris retries once and then refuses the unstable result until writes stop.

When Iris atomically copies a validated source pack into a new world snapshot, it may transfer that exact validation result. It does so only after a strong content fingerprint proves the copied tree matches the source. Root-level hidden metadata such as `.git/`, `.iris/`, and `.idea/`, plus `*.code-workspace` files, is not copied into production snapshots or included in that proof. Hidden resources inside active pack folders remain covered. A mismatch or unreadable fingerprint runs the full semantic validator against the snapshot root instead.

## Walkthrough: take a pack from workspace to release

Run this after the pack works in Studio and before you create or update a production world.

**1. Place the authoring tree.** `packs/<key>/` must contain at least one `dimensions/*.json`. On Bukkit that is the plugin data folder `packs/`. On Fabric/Forge/NeoForge it is `config/irisworldgen/packs/`.

**2. Validate and read the result.**

```
# Bukkit
/iris pack validate pack=<key>
/iris pack status pack=<key>

# Modded
/iris pack validate <key>
/iris pack status <key>
```

`validate` re-runs every check and republishes the result. `status` prints the currently published result, which may be a reused startup result. Run `validate` first if you have edited files. Continue only when the pack reports loadable with zero blocking errors. Warnings are informational, but read them. Unresolved content keys become blocking the moment strict content mode is on.

**3. Preview cleanup without writing anything.**

```
# Bukkit
/iris pack cleanup <key> mode=preview

# Modded
/iris pack cleanup <key>
```

Preview is the default on both platforms and touches nothing. Read every candidate. Cleanup finds resources with no inbound reference. That includes resources you load dynamically or reference from something it does not scan. If a candidate is intentional, stop here and leave cleanup unapplied.

**4. Apply cleanup only if the preview was clean.**

```
# Bukkit
/iris pack cleanup <key> mode=apply

# Modded
/iris pack cleanup <key> apply
```

Files move into `<pack>/.iris-trash/<timestamp>/` rather than being deleted. The pack cached validation result is dropped. Validate again afterwards. If cleanup took something you needed, `/iris pack restore <key> mode=apply` (Bukkit) or `/iris pack restore <key> apply` (modded) moves the most recent quarantine dump back.

**5. Package the closure.**

```
# Bukkit
/iris studio package dimension=<key>

# Modded
/iris studio package <key>
```

Success is `exports/<key>.iris` plus a completion message. The source pack and every world snapshot are untouched.

**6. Test on a disposable world.** Create a fresh world from the release pack. Walk it. Restart the server. Walk it again. For breaking pack changes, ship a new world rather than updating an old one.

**7. Only then consider replacing an existing world snapshot.** Take a backup first and use the update-world procedure at the bottom of this page.

The loop passes when the source closure validates. The package command must produce the expected export. A fresh world from that export must reload cleanly. The world snapshot must match what you intended to ship. If your release process distributes the `.iris` file rather than the source tree, unpack it and validate it separately. The packager output is not automatically validated.

## Pack workspace

| Item | Rule |
|------|------|
| Packs root | Bukkit: plugin data folder `packs/`. Modded: `config/irisworldgen/packs/` |
| Visible packs | Non-hidden directories directly under the packs root |
| "Present" | The directory resolves inside the packs root. It passes a safe-tree check (no symlinks escaping). It has a real `dimensions/` directory. It contains at least one regular `.json` file in it. Content is never parsed, so a pack with broken JSON is still "present" and will not be re-downloaded |
| Safe key | Download destination folder names must match `[a-z0-9_-]+` |

## Download

| Command | Syntax |
|---------|--------|
| Bukkit and modded | `/iris download pack=overworld`, `/iris download pack=underworld`, or `/iris download link=<http(s)-zip-url>` (alias `/iris dl`) |

| Param | Default | What it does |
|-------|---------|--------------|
| `pack` | mutually exclusive with `link` | Accepts exactly `overworld` or `underworld`. Values are case-insensitive |
| `link` | mutually exclusive with `pack` | Direct HTTP(S) URL whose path ends in `.zip` |

`overworld` and `underworld` are built-in packs whose beta-release URLs are embedded in Iris for now.

| Pack | Source |
|------|--------|
| `overworld` | `https://github.com/IrisDimensions/overworld/releases/download/beta/overworld.zip` |
| `underworld` | `https://github.com/IrisDimensions/underworld/releases/download/beta/underworld.zip` |

There is no listing lookup, arbitrary repository-name lookup, Git branch selector, positional source, overwrite option, or implicit download from world and Studio commands. For a direct ZIP with multiple dimensions, Iris uses the shortest dimension key, then alphabetical order, as the destination folder.

A successful download performs registry-independent pack validation and atomically publishes the pack on disk. It then asks the operator to restart. The command reports connecting, transfer, unpacking, validation, and publication as styled phases. Bukkit players receive an arbitrated large title and a rate-limited labeled bottom action-bar meter with percentage, transferred size, total size, and transfer rate when the server supplies a content length; pack downloads do not use a boss bar. Unknown-length transfers and non-transfer phases use an indeterminate percentage animation. Console progress is limited to 10-percent boundaries or five-second intervals. Success, failure, cancellation, already-installed, and restart-required outcomes remain in chat or console history. On Fabric, Forge, and NeoForge, phase and terminal feedback runs through Minecraft server task queue rather than Iris tick queue. Completion is still delivered after an empty dedicated server enters its vanilla paused state. Direct-link output identifies a Remote ZIP without echoing the URL or any signed query parameters. The command does not compile into the running registry, deny later logins, stop the server, or restart it automatically. Bootstrap validation proves the pack tree is structurally sound. It does not prove that external keys referenced through `datapackImports` exist in the current live registry.

The shipping Overworld declares Towns & Towers 26.1 and Dungeons & Taverns 5.3.0. Use this deterministic Paper-family sequence (plain Spigot supports managed `/iris create`, but not exact-slot `/iris replace`):

```text
/iris download pack=overworld
/iris download pack=underworld
```

Wait for each download to complete before issuing the next command. The download slot never queues a second request. With the default `general.autoIngestDatapacks=true`, restart after both finish. On that boot Iris installs the Overworld two external dependencies and leaves startup admission restart-required. Complete the ensuing clean restart so Minecraft loads those dependencies, the downloaded packs dimension types, and their custom biomes into the live registries. After that server return:

```text
/iris replace minecraft:overworld type=overworld seed=123456789
/iris replace minecraft:the_nether type=underworld seed=-987654321
```

Restart once after both replacements report staged. The default automatic-ingest route therefore uses three restart boundaries. First is discovery and installation of the declared external datapacks. Second is registry loading. Third is cold publication of both exact replacements with the two independently selected seeds. Omit a `seed=` argument to preserve that slot existing saved seed. With automatic ingest disabled, complete the explicit workflow in [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks). Full replacement validation rejects unresolved external structure keys rather than freezing a world pack that cannot load.

On Fabric, Forge, and NeoForge, `/iris datapack ingest` cannot install these dependencies. Put the exact compatible Towns & Towers 26.1 and Dungeons & Taverns 5.3.0 archives in the target save `datapacks/` directory before the shipping Iris Overworld loads. Then restart with the Iris pack and both external datapacks already present.

### Install pipeline (`PackDownloader`)

1. Acquire the one server-wide download slot. If any explicit pack download is already active, Iris rejects the new request immediately before network or staging work. Repeated requests for the same pack, requests for another pack, and direct-link requests are never queued.
2. If a built-in pack is already present, return without touching the network. Direct links are fetched before their dimension key is known, but publication still refuses an existing target.
3. Download the zip under hard limits. The archive is at most 512 MiB. It has at most 100,000 entries. Total uncompressed size is at most 2 GiB. Each file is at most 256 MiB. Exceeding any of these aborts the install.
4. Unpack into a temporary staging directory and identify one pack home containing `dimensions/`. Repository metadata beside that directory is ignored.
5. Open the staging tree with the datapack-compiler loader and pick the dimension. A `link=` download uses the shortest key, then alphabetical order, when the archive has multiple dimensions. A built-in download names its expected key, requires exactly one dimension matching it, and keeps any additional dimension resources in the pack.
6. Run `PackValidator.validateForDatapackBootstrap` against the staging tree. Structural blocking errors abort the install and print the errors. Live-registry checks wait until the restart, after external datapacks are registered.
7. Publish atomically into `packs/<key>/`, refusing symlinked targets and refusing a key that conflicts with a different folder dimension key. The validation result is published to the registry as part of the same step.

Only one explicit pack download runs at a time on Bukkit and modded. The slot is released after success or failure. Existing complete packs and symbolic-link sources are retained. This command surface has no overwrite mode.

## Validate

| Command | Syntax |
|---------|--------|
| Bukkit | `/iris pack validate [pack=<key>]` (alias `v`) |
| Modded | `/iris pack validate [<pack>]` (alias `v`) |
| Bukkit | `/iris pack status [pack=<key>]` (alias `s`) |
| Modded | `/iris pack status [<pack>]` (alias `s`) |

Omitting the pack validates every visible pack and reports how many are broken. `status` reads the published result instead of re-running anything. After editing files `status` can be stale until you run `validate`.

### What gets checked (`PackValidator`)

| Check | Blocking or warning |
|-------|---------------------|
| Pack folder missing, `dimensions/` missing, or no dimension JSON in it | Blocking, and stops the rest of validation |
| Dimension JSON integrity | Blocking errors and warnings, as emitted |
| Legacy cave-profile field names, in dimensions/regions/biomes and in `snippet/cave-profile/` | Blocking, with the replacement name named |
| Loot graph — every referenced loot table resolves | Blocking |
| Removed worldgen fields (currently `fluidBodies`) | Blocking |
| River topology, incision, water-head, biome-pool, override, and cave-containment contracts | Invalid or over-budget derived topology footprints, recursive final/river stream dependencies, missing river biome keys, impossible grotto envelopes, inconsistent terraced drops, and reachable sinkhole terminals without active mantle carving, cave hydrology, or a positive entry cap are blocking; authored biome-role mismatches are warnings |
| Object surface support | Blocking |
| `rotation` / `translate` / `scale` on surfaces that do not support them | Blocking |
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
- the validator own schema version,
- strict-content mode,
- the platform name, Minecraft version, and Iris version,
- the sorted key sets of the live block, biome, item, and entity registries,
- the sorted key sets of the live structure, jigsaw-structure, template-pool, structure-set, and object-feature hooks.

Any mismatch discards the cache. That includes changed bytes. It also includes a mod added or removed, a version bump, or a missing or extra
pack. It includes a malformed or oversized cache file, or a manual `validate`. Cached *failures* stay blocking. A pack that failed validation at startup will not authorize world or Studio creation until it validates clean.

## Cleanup (unused resources)

| Command | Mode | Behavior |
|---------|------|-----------|
| Bukkit `/iris pack cleanup <pack> [mode=preview]` (alias `c`) | `preview` (default) | List candidates. No writes |
| | `apply` | Move candidates to quarantine |
| Modded `/iris pack cleanup <pack> [apply]` (alias `c`) | no literal (default) | Preview |
| | `apply` | Move candidates to quarantine |

Folders scanned for unreferenced JSON: `biomes`, `regions`, `entities`, `spawners`, `loot`, `generators`, `expressions`, `markers`, `blocks`, `mods`.

Excluded from the reference corpus entirely: `.iris-trash`, `datapack-imports`, `externaldatapacks`, `internaldatapacks`, `datapacks`, `cache`, `objects`, `.iris`.

Applying re-scans from scratch rather than trusting an earlier preview. A preview you ran an hour ago cannot quarantine something you have since started using. Quarantined files land under `<pack>/.iris-trash/<yyyyMMdd-HHmmss-SSS>/`. A failed apply rolls back what it can and reports any paths that are still quarantined so you can restore them by hand. A successful apply drops the pack cached validation result.

## Restore

| Command | Mode | Behavior |
|---------|------|-----------|
| Bukkit `/iris pack restore <pack> [mode=preview]` (alias `r`) | `preview` (default) | List the files in the most recent quarantine dump, plus any destination conflicts |
| | `apply` | Move them back |
| Modded `/iris pack restore <pack> [apply]` (alias `r`) | no literal (default) | Preview |
| | `apply` | Move them back |

Restore operates on the **latest** dump only. It refuses the whole operation when any destination path already exists and reports the conflict list instead of merging. Resolve those by hand first. With no quarantine dump present, nothing is restored and nothing is reported as an error.

## Package (export)

| Command | Syntax |
|---------|--------|
| Bukkit | `/iris studio package [dimension=default] [obfuscate=false] [minify=true]` (method alias `pkg`) |
| Modded | `/iris studio package [<pack>]` (alias `pkg`) |

| Param | Default | What it does |
|-------|---------|--------------|
| `dimension` | contextual, else `default` | The dimension to package. The closure is walked from here |
| `obfuscate` | `false` | Rename every object to a random UUID in the export and rewrite placement references to match. Bukkit only |
| `minify` | `true` | Write JSON with no indentation. Bukkit only. The modded packager always minifies |

Output is `exports/<dimensionKey>.iris` — under the plugin data folder on Bukkit, under `config/irisworldgen/exports/` on modded. The staging folder is deleted after zipping (compression level 9). Neither the source pack nor any world snapshot is modified.

### What the package actually contains

Both compilers walk the dimension, its regions, their biomes, and collect generators, loot tables, entity keys, object keys, and the structure closure. Both write `package.json` with a content hash, a timestamp, and the dimension `version`.

Written to the export:

`dimensions/`, `regions/`, `biomes/`, `generators/`, `blocks/` (all block definitions in the pack, not just referenced ones), `loot/`, `entities/`, `objects/`, the structure closure, `package.json`.

The ambient-spawning graph is exported in full. `spawners/` and `markers/` are written. Object placements on regions as well as biomes are followed (markers on those placements pull in their spawners). Spawner entities are collected from both `spawns` and `initialSpawns`. Entity loot tables land in `loot/`. Adding spawner or marker files changes `package.json` hash, so re-exported packages hash differently than older ones.

**Not written by either compiler:**

- `mods/` — never collected or written. Harmless, since nothing applies them (see [24 - Pack Mods & Snippets](/iris/24-pack-mods-snippets)).
- `expressions/`, `caves/`, `images/` and other folders outside the collected set.

One platform difference beyond that: Bukkit re-serializes from the loaded object graph, which inlines snippet references. Modded copies the source JSON verbatim and does not copy `snippet/`, so snippet references in a modded export dangle. Validate the unpacked tree before you publish an `.iris` artifact.

## Developer update-world (unsafe)

| Command |
|---------|
| `/iris developer update-world world=<world> pack=<dimension> confirm=true` |

Aliases: the command group is `/iris developer` or `/iris dev`. The subcommand is `update-world` or `^world`. `pack` also accepts the alias `dimension`, and `confirm` accepts `c`.

| Param | Default | What it does |
|-------|---------|--------------|
| `world` | contextual | The world whose `iris/pack` snapshot gets replaced |
| `pack` | contextual | The source dimension, resolved from the live packs root |
| `confirm` | `false` | Required. Without it the command only prints the warning and exits |

What it does:

1. Refuse unless `confirm=true`.
2. Take a `PACK_MUTATION` / `PACK_PUBLISH` lease, so it cannot race another pack publish. If the lease is busy it reports that and stops.
3. Copy the pack into a staging directory next to the target. Confirm the dimension loads from staging. Then publish atomically over `<world>/iris/pack`.
4. Invalidate the previous validation result for that exact root and validate the newly published snapshot. **If validation fails, the publication rolls back** and the world keeps its old pack.
5. If an engine is still holding the old pack data, restart the server with the reason `"An active Iris world pack was replaced."`

This is unsafe for production without a backup for reasons the command cannot fix. Chunks that already exist keep their old terrain. Only future generation and pack-driven systems — loot, spawners, effects, block drops — see the new content. A pack change that alters terrain shape leaves a visible seam at the edge of the generated region. Prefer staging a new world whenever the pack terrain contract changes.

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
6. Replace an existing world snapshot only after a backup, with `/iris dev update-world world=<world> pack=<dimension> confirm=true`.
