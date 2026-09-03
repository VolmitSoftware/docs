---
title: "Pack Management"
description: "Iris documentation: Pack Management"
published: true
date: 2026-09-03T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Download, validate, clean, package, or update an Iris pack. Authoring packs live under the platform pack root; production worlds use `<world>/iris/pack`.

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

`validate` re-runs every check and republishes the result. `status` prints the currently published result, which may be a reused startup result. Run `validate` first if you have edited files. Continue only when the pack reports loadable with zero blocking errors. Warnings are informational, but read them. Unresolved content keys become blocking the moment strict content mode is on. If the console names content unavailable on this Minecraft version, run `/iris pack compat` and decide whether to accept the loss or declare a fallback before you release.

To generate chunks without a server, run the generation probe from the Iris repository with Java 25:

```bash
./gradlew --no-daemon :probe:genProbe \
  -PprobePack=/absolute/path/to/pack \
  -PprobeDimension=<dimension-key>
```

The probe builds the real engine and generates chunks into memory. Run it against the pack tree you intend to package, then again on the extracted archive.

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
/iris pack package dimension=<key>

# Modded
/iris studio package <key>
```

Success is `exports/<key>.iris` plus a completion message. The source pack and every world snapshot are untouched.

**6. Test on a disposable world.** Create a fresh world from the release pack. Walk it. Restart the server. Walk it again. A hydrology or `riverPolicy` change requires a new or fully regenerated world because accepted terrain, fluid, biome, and mantle ownership is fixed into generated chunks.

**7. Only then consider replacing an existing world snapshot.** Take a backup first and use the update-world procedure at the bottom of this page.

The loop passes when the source closure validates. Both package commands automatically run the shared read-only pack validator and image-map compiler before clearing staging or copying files. The package command must still produce the expected export, and a fresh world from that export must reload cleanly. If your release process distributes the `.iris` file rather than the source tree, unpack and validate that final closure separately; source preflight does not replace artifact verification.

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

`overworld` and `underworld` are built-in packs whose immutable stable-release URLs are embedded in Iris. Updating a release on GitHub does not change an existing Iris jar; the jar must be rebuilt with the new versioned URL.

| Pack | Source |
|------|--------|
| `overworld` | `https://github.com/IrisDimensions/overworld/releases/download/4002/overworld.zip` |
| `underworld` | `https://github.com/IrisDimensions/underworld/releases/download/1005/underworld.zip` |

There is no listing lookup, arbitrary repository-name lookup, Git branch selector, positional source, overwrite option, or implicit download from world and Studio commands. For a direct ZIP with multiple dimensions, Iris uses the shortest dimension key, then alphabetical order, as the destination folder.

After downloading a pack, restart before creating a world or opening ordinary Studio. Use `/iris pack validate <pack>` to check it first.

Each network attempt has a 10-second connection timeout and a 10-second no-data timeout. Iris retries transient connection, timeout, truncated-response, HTTP 408/425/429, and server-error failures up to three total attempts with one- and two-second backoffs. Permanent client errors such as HTTP 404 and archive size violations fail immediately. A terminal failure reports the actual network or HTTP cause, removes its incomplete transfer stage, preserves any prior complete cache entry, and releases the download slot so the command can be retried after connectivity is stable.

The current built-in Overworld and Underworld declare no external datapack imports. Use this deterministic Paper-family sequence (plain Spigot supports managed `/iris create`, but not exact-slot `/iris replace`):

```text
/iris download pack=overworld
/iris download pack=underworld
```

Wait for each download to complete before issuing the next command. The download slot never queues a second request. Restart after both finish so Minecraft loads the downloaded packs' dimension types and custom biomes into the live registries. After that server return:

```text
/iris replace minecraft:overworld type=overworld seed=123456789
/iris replace minecraft:the_nether type=underworld seed=-987654321
```

Restart once after both replacements report staged. The built-in route therefore uses two restart boundaries: registry loading, then cold publication of both exact replacements with the two independently selected seeds. Omit a `seed=` argument to preserve that slot's existing saved seed. Custom packs that declare `datapackImports` must first complete the explicit workflow in [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks). Full replacement validation rejects unresolved external structure keys rather than freezing a world pack that cannot load.

On Fabric, Forge, and NeoForge, the built-in packs need no external datapacks. For a custom pack that declares `datapackImports`, `/iris datapack ingest` cannot install those dependencies; put compatible archives in the target save's `datapacks/` directory before the Iris pack loads, then restart with every input already present.
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
| Rivers (`hydrology` and `riverPolicy`) | Routing, channel, bank, bed, flow, mouth, pool, grotto, and deep-fluid bounds, unique profile and pool IDs, biome and profile references, and dimension-height fit are blocking. See [36 - Rivers](/iris/36-rivers) |
| Object surface support | Blocking |
| `rotation` / `translate` / `scale` on surfaces that do not support them | Blocking |
| Structure graph and compiled structure graph | Errors blocking, warnings advisory |
| Native structure replacement envelopes | Blocking |
| Spawner entries pointing at entities that exist, across both `spawns` and `initialSpawns` | Blocking |
| Custom biome spawn category resolution | Blocking |
| Content keys and block properties | Blocking when `general.strictContentKeys` is on or `-Diris.strictContent` is set, otherwise warnings. Palette-sourced findings stay advisory either way |
| Version content compatibility | Advisory, except when the cascade reaches the dimension (no regions left, or the dimension itself composes missing content), which is blocking. See [Version content compatibility](#version-content-compatibility) |

A pack is loadable when it has zero blocking errors. `status` prints the blocking count and up to ten warnings plus a "more" count.

## Version content compatibility

Iris ships one Bukkit jar for several Minecraft versions, and pack authors build against whatever version they run. A pack that references a block, item, entity, biome, structure, enchantment, or potion effect the running server does not have is gated: the content that composes the missing key is left out of generation, everything else in the pack keeps generating, and the full set of decisions is printed once at startup.

Detection is automatic and there are no version fields anywhere. Iris asks the live platform registry whether each key exists. No resource carries a `since` or `minVersion`, and nothing compares version numbers, so mods that add or remove registry content are covered the same way. Because the answer comes from the registry rather than a version string, the same pack gates identically on Bukkit and on Fabric, Forge, and NeoForge for the same Minecraft version.

### The three actions

| Action | Meaning |
|--------|---------|
| `excluded` | The unit composes the missing content and is removed from every pool that could pick it. An excluded biome never generates, an excluded object is never placed, an excluded entity never spawns |
| `dropped` | One entry or reference is removed and its container keeps generating. A dropped biome scatter entry falls back to the derivative, a dropped loot entry leaves the rest of the table intact |
| `substituted` | A declared fallback replaced the missing key and the content still generates |

Exclusion cascades. A container that referenced an excluded unit drops the reference, and if that empties a required pool the container is excluded in turn: an object placement with no placeable object left, a jigsaw pool with no pieces left, a structure whose start pool is excluded, a spawner with no spawns left, a loot table with no entries left, a region with no land biomes left. If the cascade reaches the dimension — no regions remain, or the dimension itself composes missing content — the pack is unusable on that version: a blocking validation error, and world and studio creation are refused.

Legacy block renames (`minecraft:grass` to `minecraft:short_grass`, `grass_path` to `dirt_path`, and the rest of the rename table) are applied before anything is called missing, and are not reported. The rename table now applies on the mod loaders as well as on Bukkit, and a block entry's `backup` works on every platform. The full resolution order for a block key is the live registry, the rename table, the dimension `blockFallbacks`, then the entry's `backup`. Sounds and particles are not checked; an unknown effect already plays nothing.

Lists that only select blocks which already exist are never gated: `edit[].find` and `markers[].mark` on an object placement, loot `filter` lists, `blockDrops[].blocks`, and decorator whitelists and blacklists. A missing key in one of those matches nothing and is not reported.

### The startup listing

After the pack validation lines, each pack with findings prints one block. Findings are grouped by key and capped at three subjects per key, with a `+N more` tail:

```text
Pack 'overworld': content unavailable on Minecraft 26.1.2
  minecraft:sulfur (block): excluded biome cave/sulfur-grotto; excluded biome desert/sulfur-flats; dropped object cave/sulfur-vent at cave/sulfur-grotto objects[0]; +2 more
  minecraft:camel (entity): excluded entity camel; dropped spawn from spawner desert
  Update the server to a newer Minecraft to restore this content, or declare fallbacks (dimension blockFallbacks, block backup). /iris pack compat overworld lists everything.
```

Nothing is printed when a pack has no findings. Each engine also logs the summary once when its world pack finishes loading.

When the platform registry cannot be consulted while the pack loads — an early-boot condition on the mod loaders — the report carries an `(incomplete: …)` line and nothing is excluded. An unreadable registry never counts as missing content.

### `/iris pack compat`

| Command | Syntax |
|---------|--------|
| Bukkit | `/iris pack compat [pack=<key>]` |
| Modded | `/iris pack compat [<pack>]` |

Prints every finding for the pack, grouped by key, with no per-key cap. It reads the published validation report and does not reload the pack, so it is safe on a live server. Omitting the pack covers every visible pack. Full syntax in [04 - Commands & Permissions](/iris/04-commands-permissions).

### How this relates to validate and status

`/iris pack validate` performs the gate. It force-loads every registrant of every loader type and every object placement pool so the report is complete, then stores the findings alongside the validation result. `/iris pack status` reprints the published result including the compat summary, without re-running anything:

```text
Pack 'overworld' validated (2 warnings). 3 content keys unavailable on Minecraft 26.1.2: 2 excluded, 5 dropped, 1 substituted.
```

`/iris pack compat` prints the detail behind that summary line. The validation cache fingerprint already covers the Minecraft version and the relevant registry key sets, so a pack carried to a different version revalidates instead of reusing a report from the other version.

Compat findings are never duplicated as unresolved-content-key warnings. A key that produced a compat finding is suppressed in the content-key check, so `general.strictContentKeys` cannot turn a gated key into a second, blocking error. See [03 - Configuration](/iris/03-configuration).

### Remedies

| Remedy | Effect |
|--------|--------|
| Update the server to a Minecraft version that has the content | Everything generates and the report goes empty |
| `blockFallbacks` on the dimension | Pack-wide map from a base block key to the full block state to generate instead. Substitutes rather than excludes. See [11 - Dimensions](/iris/11-dimensions) |
| `backup` on a block entry | Per-entry replacement for one block definition, resolved through the same chain, so a backup can itself be covered by a dimension fallback. See [16 - Surfaces, Decorators & Deposits](/iris/16-surfaces-decorators-deposits) |
| A type-replace in an object placement | An `edit` rule with `chance: 1` that matches the missing block rewrites it before placement, keeping the object in the pool. See [20 - Object Placement](/iris/20-object-placement) |
| Accept the loss | The gate is not an error state. A pack that loses a cave biome on an older version still generates everything else |

A fallback that is itself missing on the running server counts as missing and is reported.

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
| Bukkit | `/iris pack package [dimension=default] [obfuscate=false] [minify=true]` (method alias `pkg`) |
| Modded | `/iris studio package [<pack>]` (alias `pkg`) |

| Param | Default | What it does |
|-------|---------|--------------|
| `dimension` | contextual, else `default` | The dimension to package. The closure is walked from here |
| `obfuscate` | `false` | Rename every object to a random UUID in the export and rewrite placement references to match. Bukkit only |
| `minify` | `true` | Write JSON with no indentation. Bukkit only. The modded packager always minifies |

Output is `exports/<dimensionKey>.iris`: under the plugin data folder on Bukkit and under `config/irisworldgen/exports/` on modded. Before touching an existing staging tree, both adapters run the shared read-only pack validator, including image-map source decoding and compilation. A blocking error leaves staging and the prior archive untouched. Successful staging is deleted after zipping (compression level 9). Neither the source pack nor any world snapshot is modified.

### What the package actually contains

Both compilers walk the dimension, its regions, their biomes, and collect generators, loot tables, entity keys, object keys, and the structure closure. Both write `package.json` with a content hash, a timestamp, and the dimension `version`.

Written to the export:

`dimensions/`, `regions/`, `biomes/`, `generators/`, `blocks/` (all block definitions in the pack, not just referenced ones), `loot/`, `entities/`, `objects/`, `spawners/`, `markers/`, `image-maps/`, referenced `images/` PNGs, the structure closure, and `package.json`.

The ambient-spawning graph is exported in full. `spawners/` and `markers/` are written. Object placements on regions as well as biomes are followed (markers on those placements pull in their spawners). Spawner entities are collected from both `spawns` and `initialSpawns`. Entity loot tables land in `loot/`. Adding spawner or marker files changes `package.json` hash, so re-exported packages hash differently than older ones.

**Not written by either compiler:**

- `mods/`: never collected or written. Harmless, since nothing applies them (see [24 - Pack Mods & Snippets](/iris/24-pack-mods-snippets)).
- `expressions/`, `caves/`, and other folders outside the collected set.

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

This is unsafe for production without a backup for reasons the command cannot fix. Chunks that already exist keep their old terrain. Only future generation and pack-driven systems (loot, spawners, effects, and block drops) see the new content. A pack change that alters terrain shape leaves a visible seam at the edge of the generated region. Prefer staging a new world whenever the pack terrain contract changes.

## Related operations

| Task | Where |
|------|-------|
| Create a studio project from a template | `/iris studio create` — [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas) |
| Open VSCode with generated schemas | `/iris studio vscode` — [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas) |
| Import vanilla objects and structures into a pack | `/iris studio importvanilla` — [19 - Objects](/iris/19-objects) |
| Structure import and conversion | `/iris structure …` — [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks) |
| Strict content key enforcement | `settings.general.strictContentKeys` — [03 - Configuration](/iris/03-configuration) |
| List content unavailable on this Minecraft version | `/iris pack compat` — [Version content compatibility](#version-content-compatibility) |
| Datapack bootstrap and install | `/iris datapack` — [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks) |

## Checklist

1. Place or download the pack under `packs/<key>/` with at least one `dimensions/*.json`.
2. Validate until loadable: `/iris pack validate pack=<key>` on Bukkit, `/iris pack validate <key>` on modded.
3. Run the generation probe for the selected dimension.
4. Optionally preview cleanup, review every candidate, then apply and validate again. Restore if it took something needed.
5. Create a new world with `/iris create …`, which copies the pack into the world, or open Studio for live editing.
6. Package with `/iris pack package dimension=<key>` (Bukkit) or `/iris studio package <key>` (modded), then extract and validate the exact archive.
7. Replace an existing world snapshot only after a backup, with `/iris dev update-world world=<world> pack=<dimension> confirm=true`. A changed river configuration needs a new world; replacing a snapshot does not regenerate chunks.
