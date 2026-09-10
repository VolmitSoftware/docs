---
title: "Pack Management"
description: "Iris documentation: Pack Management"
published: true
date: 2026-09-09T05:57:10.311Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Download, validate, clean, package, or update an Iris pack. Authoring packs live under the platform pack root. Production worlds retain immutable pack epochs under `<dimensionRoot>/iris/generation/`.

See also:

- [03 - Configuration](/iris/03-configuration)
- [04 - Commands & Permissions](/iris/04-commands-permissions)
- [05 - Concepts & Pack Layout](/iris/05-concepts-pack-layout)
- [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle)
- [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas)
- [24 - Pack Mods & Snippets](/iris/24-pack-mods-snippets)
- [27 - Example - Configuring Overworld](/iris/27-example-configuring-overworld)

## The mental model

A pack can exist in three forms. Confusing them is the usual source of "my edit did nothing":

- **The authoring copy**, at `packs/<key>/`. This is what Studio edits and what `/iris create` copies from.
- **Generation snapshots**, at `<world>/iris/generation/epochs/<epoch>/pack/`. Production worlds and Bukkit Studio retain immutable definitions for historical, active, and pending epochs. Saved biome environments use the pack from their owning activation. Authoring edits automatically update ordinary Bukkit Studio, while production updates require explicit staging.
- **The export**, at `exports/<key>.iris`. A zip of the dimension dependency closure, for handing to somebody else.

Validation runs against a directory, not a key. A pack can be valid in the workspace and stale in a world. Iris caches startup validation results. Reuse requires matching pack bytes, the visible pack set, the platform, relevant game registries, and the loaded Iris generation build revision. Validator and model changes therefore invalidate saved results even when the Iris version number stays the same. An unavailable build revision disables cache reuse. Fresh validation rechecks the content fingerprint after parsing. If files keep changing, Iris retries once and then refuses the unstable result until writes stop.

When Iris atomically copies a validated source pack into a world epoch, it may transfer that exact validation result. It does so only after a strong content fingerprint proves the copied tree matches the source. Production epochs and their fingerprints exclude root-level hidden metadata such as `.git/`, `.iris/`, and `.idea/`, plus `*.code-workspace` files.

New generation epochs use fingerprint version 2, which excludes Finder `.DS_Store` files at every depth. Other hidden resources inside active pack folders remain covered. Existing epochs retain their recorded fingerprint version and do not need resealing. A mismatch or unreadable fingerprint runs the full semantic validator against the epoch root instead.

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

Success is `exports/<key>.iris` plus a completion message. The source pack and every world epoch are untouched.

**6. Test on a disposable world.** Create a fresh world from the release pack. Walk it. Restart the server. Walk it again. Test changed hydrology and locators beyond the generated boundary. A compatible hydrology or `riverPolicy` update affects future chunks. Saved terrain and recorded generation facts retain their provenance. New terrain uses the current generator within the world's fixed physical layout.

**7. Stage the production update.** Back up the complete world, including generation history, then use the update-world procedure below.

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

`overworld` and `underworld` are built-in packs whose embedded URLs follow each repository's latest GitHub release asset. A fresh install therefore receives the newest stable V+ release available when the command runs without requiring a new Iris jar. An existing pack directory is never overwritten by this command; preserve or remove it yourself before intentionally installing another release.

| Pack | Source |
|------|--------|
| `overworld` | `https://github.com/IrisDimensions/overworld/releases/latest/download/overworld.zip` |
| `underworld` | `https://github.com/IrisDimensions/underworld/releases/latest/download/underworld.zip` |

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
| Biome `terrain3D` profiles and `snippet/terrain-3d/` files — unknown fields, wrong types, out-of-range numbers, unknown noise styles, style nesting past 32 levels, and snippet references that escape the pack | Blocking. See [47 - Volumetric Terrain](/iris/47-volumetric-terrain) |
| Loot graph — every referenced loot table resolves | Blocking |
| Removed worldgen fields (currently `fluidBodies`) | Blocking |
| Rivers (`hydrology` and `riverPolicy`) | Routing, channel, bank, bed, flow, mouth, pool, grotto, and deep-fluid bounds, unique profile and pool IDs, biome and profile references, and dimension-height fit are blocking. See [36 - Rivers](/iris/36-rivers) |
| Object surface support | Blocking |
| `rotation` / `translate` / `scale` on surfaces that do not support them | Blocking |
| Structure graph and compiled structure graph | Errors blocking, warnings advisory. Dimension, region, and biome placements require exactly one non-empty backend. Native placements allow only an omitted, null, or `LEGACY` anchor |
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

The pack validation line carries the summary, and each pack with findings then prints one block. Findings are grouped by key, ordered inside a key as exclusions, then drops, then substitutions, and capped at three subjects per key with a `+N more` tail. This is the shipped Overworld pack on Minecraft 26.1.2:

```text
Pack 'overworld' validated. 6 content keys unavailable on Minecraft 26.1.2: 11 excluded, 14 dropped.
Pack 'overworld': content unavailable on Minecraft 26.1.2
  minecraft:sulfur_cube (entity): excluded entity standard/passive/sulfur-cube at type
  minecraft:sulfur_caves (biome): excluded biome carving/sulfur-hollows at derivative; excluded biome carving/sulfur at derivative; dropped biome carving/sulfur-hollows at vanillaDerivative; +1 more
  minecraft:sulfur (block): excluded biome carving/sulfur-hollows at wall.palette[0]; excluded biome carving/sulfur at wall.palette[0]; dropped object carving/sulfur/pool-3 at carving/sulfur/pool-3 place[0]; +2 more
  minecraft:cinnabar (block): excluded biome carving/sulfur-hollows at wall.palette[1]; excluded biome carving/sulfur at wall.palette[1]; excluded placement carving/sulfur/pool-3 at no objects remain; +4 more
  minecraft:sulfur_spike (block): excluded biome carving/sulfur-hollows at decorators[0].palette[0]; excluded biome carving/sulfur at decorators[0].palette[0]; dropped object carving/sulfur/pool-3 at carving/sulfur/pool-3 place[0]; +2 more
  minecraft:potent_sulfur (block): dropped object carving/sulfur/pool-3 at carving/sulfur/pool-3 place[0]; dropped object carving/sulfur/pool-1 at carving/sulfur/pool-1, carving/sulfur/pool-2 place[0]; dropped object carving/sulfur/pool-2 at carving/sulfur/pool-1, carving/sulfur/pool-2 place[1]
  Update the server to a newer Minecraft to restore this content, or declare fallbacks (dimension blockFallbacks, block backup). /iris pack compat overworld lists everything.
```

Each subject reads `<action> <unit> <key> at <detail>`. The unit is the registrant type (`biome`, `region`, `dimension`, `entity`, `spawner`, `loot`, `jigsaw piece`, `jigsaw pool`, `structure`, `mod`), `placement` for an object placement (named by its `place` list), or `object` for one object dropped from a placement. The detail is the JSON field path that composes the key (`layers[0].palette[1]`, `edit[0].replace.palette[0]`, `type`), the cascade reason (`no land biomes remain`, `no objects remain`, `no entity spawns remain`), or the reference that was dropped (`regions[2] cave-region`). A substitution names what was generated instead: `(backup minecraft:sand)` or `(fallback minecraft:stone)`. A dropped object lists every missing key in its palette, each on that key's line. A registrant that is dropped from several pools is listed once per pool owner, not once per pool.

Nothing is printed when a pack has no findings. Each engine also logs one line when its world runtime is built, `World '<world>' pack '<dimension>' 6 content keys unavailable on Minecraft 26.1.2: 16 excluded, 16 dropped, 6 substituted.`, taking the counts from the published validation result when the pack has one and otherwise from what that engine gated while loading its dimension, regions and biomes.

When the platform registry cannot be consulted while the pack loads — an early-boot condition on the mod loaders — the report carries an `(incomplete: …)` line and nothing is excluded. An unreadable registry never counts as missing content.

### `/iris pack compat`

| Command | Syntax |
|---------|--------|
| Bukkit | `/iris pack compat [pack=<key>]` |
| Modded | `/iris pack compat [<pack>]` |

Prints every finding for the pack, grouped by key and ordered the same way as the startup block, with no per-key cap; on Bukkit each key line is prefixed with `!`. It reads the published validation report and does not reload the pack, so it is safe on a live server, and it works from the console. Omitting the pack (or passing `*` on Bukkit) covers every pack that has a published validation result; a pack without one prints a hint to run `/iris pack validate` first. Full syntax in [04 - Commands & Permissions](/iris/04-commands-permissions).

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

Output is `exports/<dimensionKey>.iris`: under the plugin data folder on Bukkit and under `config/irisworldgen/exports/` on modded. Before touching an existing staging tree, both adapters run the shared read-only pack validator, including image-map source decoding and compilation. A blocking error leaves staging and the prior archive untouched. Successful staging is deleted after zipping (compression level 9). Neither the source pack nor any world epoch is modified.

### What the package actually contains

Both compilers walk the dimension, its regions, their biomes, and collect generators, loot tables, entity keys, object keys, and the structure closure. Both write `package.json` with a content hash, a timestamp, and the dimension `version`.

Written to the export:

`dimensions/`, `regions/`, `biomes/`, `generators/`, `expressions/`, `blocks/` (all block definitions in the pack, not just referenced ones), `loot/`, `entities/`, `objects/`, `spawners/`, `markers/`, `image-maps/`, referenced `images/` PNGs, the structure closure, and `package.json`.

The ambient-spawning graph is exported in full. `spawners/` and `markers/` are written. Object placements on regions as well as biomes are followed (markers on those placements pull in their spawners). Spawner entities are collected from both `spawns` and `initialSpawns`. Entity loot tables land in `loot/`. Adding spawner or marker files changes `package.json` hash, so re-exported packages hash differently than older ones.

**Not written by either compiler:**

- `mods/`: never collected or written. Harmless, since nothing applies them (see [24 - Pack Mods & Snippets](/iris/24-pack-mods-snippets)).
- `caves/` and other folders outside the collected set.

The Bukkit compiler inlines resolved snippets into the exported objects. The modded compiler preserves references and copies the complete `snippet/` JSON tree, including terrain profiles and nested styles. Both export all expression resources, including expressions used only by terrain styles. Validate the unpacked tree before you publish an `.iris` artifact.

## Stage a production world update

| Platform | Command |
|---|---|
| Bukkit | `/iris developer update-world world=<world> pack=<dimension> confirm=true` |
| Fabric / Forge / NeoForge | `/iris world update <dimension> <pack-or-pack:dimension>` |

On Bukkit, the command group is `/iris developer` or `/iris dev`; `update-world` also has alias `^world`. `pack` accepts alias `dimension`, and `confirm` accepts `c`.

| Param | Default | What it does |
|-------|---------|--------------|
| `world` | contextual | The world that receives a pending generation epoch |
| `pack` | contextual | The source dimension, resolved from the live packs root |
| `confirm` | `false` | Required. Without it the command only prints the warning and exits |

Back up the complete world before this operation, including its `iris/generation` directory.

1. On Bukkit, run the command with `confirm=true`. On modded, use the positional world-update form above.
2. Iris validates the source pack, captures an immutable snapshot, and stages a pending epoch under the world history.
3. A changed activation requests a server restart. The running world keeps its active generation until restart.
4. Before activation, Iris checkpoints native chunks and freezes their saved natural boundary.
5. New chunks use the current generator and active pack, with a finite transition beside that boundary.

Updates must preserve the world seed, physical heights, environment, dimension type, and coordinate scale. Generation mode, fluid baseline, terrain content, and upper-terrain settings can change within that layout. New custom registry definitions can require a server restart.

Iris retains registry definitions, generation metadata, saved biome identities, and the immutable pack definitions used by historical chunks. These definitions preserve the original environment for position inspection, ambient spawns, and effects. Historical generator code is not bundled. Retained data consumes additional disk space as the world expands and packs change.

Staging an older pack creates another activation for future terrain. It does not undo saved blocks or recreate existing entities. Missing historical biome records permit only [unambiguous single-biome recovery](/iris/06-worlds-lifecycle#saved-biome-environments). Other unknown positions remain unavailable. History format 6 remains valid, with biome records in a separate versioned store.

Ordinary Bukkit Studio uses the same history model and activates compatible authoring edits while the world remains open. It does not require the production update command. See [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas).

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
5. Create a new world with `/iris create …`, which records the first immutable epoch, or open Studio for live editing.
6. Package with `/iris pack package dimension=<key>` (Bukkit) or `/iris studio package <key>` (modded), then extract and validate the exact archive.
7. Stage a production update after a complete backup with `/iris dev update-world world=<world> pack=<dimension> confirm=true` on Bukkit or `/iris world update <dimension> <pack>` on modded. Restart, then verify old chunks, the transition band, new content, and locate results. Compatible river changes affect future chunks, with existing terrain preserved.
