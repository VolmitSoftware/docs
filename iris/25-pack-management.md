---
title: "Pack Management"
description: "Iris documentation: Pack Management"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Download, validate, clean, package, or update an Iris pack.

See also:

- [03 - Configuration](/iris/03-configuration)
- [04 - Commands & Permissions](/iris/04-commands-permissions)
- [05 - Concepts & Pack Layout](/iris/05-concepts-pack-layout)
- [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle)
- [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas)
- [24 - Pack Mods & Snippets](/iris/24-pack-mods-snippets)
- [27 - Example - Configuring Overworld](/iris/27-example-configuring-overworld)

## The mental model

A pack exists in three forms, and confusing them is the usual source of "my edit did nothing":

- **The authoring copy**, at `packs/<key>/`. What Studio edits and what `/iris create` copies from.
- **Generation snapshots**, at `<world>/iris/generation/epochs/<epoch>/pack/`. Immutable. Ordinary Bukkit Studio picks up authoring edits automatically; a production world needs an explicit update.
- **The export**, at `exports/<key>.iris`. A zip of the dimension dependency closure, for handing to somebody else.

Validation runs against a directory, not a key, so a pack can be valid in the workspace and stale in a world. Iris caches validation results and reuses one only when the pack bytes, platform, registries and Iris build all match, so an Iris update can force a revalidation even when the pack did not change.

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

`validate` re-runs every check and republishes the result. `status` prints the last published result, which can be stale after an edit. Continue only when the pack reports loadable with zero blocking errors. Warnings are informational, but read them — unresolved content keys become blocking the moment strict content mode is on. If the console names content unavailable on this Minecraft version, run `/iris pack compat` and decide whether to accept the loss or declare a fallback before you release.

**3. Preview cleanup without writing anything.**

```
# Bukkit
/iris pack cleanup <key> mode=preview

# Modded
/iris pack cleanup <key>
```

Preview is the default on both platforms and touches nothing. Read every candidate. Cleanup finds resources with no inbound reference, which includes resources you load dynamically or reference from something it does not scan. If a candidate is intentional, stop here and leave cleanup unapplied.

**4. Apply cleanup only if the preview was clean.**

```
# Bukkit
/iris pack cleanup <key> mode=apply

# Modded
/iris pack cleanup <key> apply
```

Files move into `<pack>/.iris-trash/<timestamp>/` rather than being deleted. The cached validation result is dropped, so validate again afterwards. If cleanup took something you needed, `/iris pack restore <key> mode=apply` (Bukkit) or `/iris pack restore <key> apply` (modded) moves the most recent quarantine dump back.

**5. Package the closure.**

```
# Bukkit
/iris pack package dimension=<key>

# Modded
/iris studio package <key>
```

Success is `exports/<key>.iris` plus a completion message. The source pack and every world epoch are untouched. Both package commands run the pack validator and image-map compiler first and stop on a blocking error.

**6. Update an existing world.** Back up the complete world, including generation history, then use [Stage a production world update](#stage-a-production-world-update).

## Pack workspace

| Item | Rule |
|------|------|
| Packs root | Bukkit: plugin data folder `packs/`. Modded: `config/irisworldgen/packs/` |
| Visible packs | Non-hidden directories directly under the packs root |
| "Present" | Resolves inside the packs root, passes a safe-tree check (no symlinks escaping), has a real `dimensions/` directory with at least one `.json` in it. Content is never parsed, so a pack with broken JSON is still "present" and will not be re-downloaded |
| Safe key | Download destination folder names must match `[a-z0-9_-]+` |

## Download

| Command | Syntax |
|---------|--------|
| Bukkit and modded | `/iris download pack=overworld`, `/iris download pack=underworld`, or `/iris download link=<http(s)-zip-url>` (alias `/iris dl`) |

| Param | Default | What it does |
|-------|---------|--------------|
| `pack` | mutually exclusive with `link` | Accepts exactly `overworld` or `underworld`. Case-insensitive |
| `link` | mutually exclusive with `pack` | Direct HTTP(S) URL whose path ends in `.zip` |
| `overwrite` | `false` | Replace an installed authoring pack and retain its previous directory in `packs/.backups/<key>-<id>/` |

`overworld` and `underworld` follow each repository's latest stable GitHub release asset, so a download gets the current release without a new Iris jar. Existing directories are left alone unless you pass `overwrite=true`.

| Pack | Source |
|------|--------|
| `overworld` | `https://github.com/IrisDimensions/overworld/releases/latest/download/overworld.zip` |
| `underworld` | `https://github.com/IrisDimensions/underworld/releases/latest/download/underworld.zip` |

There is no listing lookup, repository-name lookup, branch selector, or implicit download from world and Studio commands. A GitHub branch archive works through `link=https://github.com/<owner>/<repository>/archive/refs/heads/<branch>.zip`. For a direct ZIP with multiple dimensions, Iris uses the shortest dimension key, then alphabetical order, as the destination folder.

### Update an installed pack

Close Studio before replacing its authoring pack.

```text
/iris download pack=overworld overwrite=true
/iris download pack=underworld overwrite=true
/iris download link=https://packs.example.test/custom.zip overwrite=true
```

Run one command at a time and wait for completion — the download slot never queues a second request. Iris validates the new pack before replacement and prints the retained backup path; a failed publication restores the previous directory. Replacement uses the complete downloaded pack, so **local edits survive only in the backup.**

Restart after downloading an update, then run `/iris pack validate <pack>`. Existing production worlds keep their current pack until you run the world-update command below.

### Startup update notices

Startup checks installed `overworld` and `underworld` packs against their latest stable GitHub releases:

```text
[Iris]: Custom Dimensions: 2
[Iris]:   overworld v4010 -> v4011 available
[Iris]:   underworld v1012
[Iris]: Update overworld: /iris download pack=overworld overwrite=true
```

These version numbers are examples. The list shows authoring pack versions, which can differ from the packs active in existing worlds. The check never downloads anything, and shows `(update check unavailable)` beside the installed version when it cannot reach GitHub. Custom packs have no release check.

### Replacing the vanilla dimensions

The built-in Overworld and Underworld declare no external datapack imports. On the Paper family (plain Spigot supports managed `/iris create` but not exact-slot `/iris replace`):

```text
/iris download pack=overworld
/iris download pack=underworld
```

Restart so Minecraft loads the downloaded packs' dimension types and custom biomes into the live registries, then:

```text
/iris replace minecraft:overworld type=overworld seed=123456789
/iris replace minecraft:the_nether type=underworld seed=-987654321
```

Restart once more after both replacements report staged. Omit `seed=` to keep that slot's existing saved seed. Custom packs that declare `datapackImports` must first complete the workflow in [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks); replacement validation rejects unresolved external structure keys rather than freezing a world pack that cannot load.

On Fabric, Forge, and NeoForge the built-in packs need no external datapacks. For a custom pack that declares `datapackImports`, `/iris datapack ingest` cannot install those dependencies — put compatible archives in the target save's `datapacks/` directory before the Iris pack loads, then restart with every input already present.

## Validate

| Command | Syntax |
|---------|--------|
| Bukkit | `/iris pack validate [pack=<key>]` (alias `v`) |
| Modded | `/iris pack validate [<pack>]` (alias `v`) |
| Bukkit | `/iris pack status [pack=<key>]` (alias `s`) |
| Modded | `/iris pack status [<pack>]` (alias `s`) |

Omitting the pack validates every visible pack and reports how many are broken. `status` reads the published result instead of re-running anything. A pack is loadable when it has zero blocking errors; `status` prints the blocking count and up to ten warnings plus a "more" count.

### What blocks a pack

| Check | Blocking or warning |
|-------|---------------------|
| Pack folder missing, `dimensions/` missing, or no dimension JSON in it | Blocking, stops the rest of validation |
| Dimension JSON integrity | As emitted |
| Legacy cave-profile field names, in dimensions/regions/biomes and in `snippet/cave-profile/` | Blocking, names the replacement |
| Biome `terrain3D` profiles and `snippet/terrain-3d/` files: unknown fields, wrong types, out-of-range numbers, unknown noise styles, nesting past 32 levels, snippet references that escape the pack | Blocking. See [47 - Volumetric Terrain](/iris/47-volumetric-terrain) |
| Loot graph: every referenced loot table resolves | Blocking |
| Removed worldgen fields (currently `fluidBodies`) | Blocking |
| Rivers (`hydrology` and `riverPolicy`): routing, channel, bank, bed, flow, mouth, pool, grotto and deep-fluid bounds, unique profile and pool IDs, biome and profile references, dimension-height fit | Blocking. See [36 - Rivers](/iris/36-rivers) |
| Object surface support | Blocking |
| `rotation` / `translate` / `scale` on surfaces that do not support them | Blocking |
| Structure graph. Dimension, region and biome placements need exactly one non-empty backend; native placements allow only an omitted, null or `LEGACY` anchor | Errors blocking, warnings advisory |
| Native structure replacement envelopes | Blocking |
| Spawner entries pointing at entities that exist, across `spawns` and `initialSpawns` | Blocking |
| Custom biome spawn category resolution | Blocking |
| Content keys and block properties | Blocking when `general.strictContentKeys` is on or `-Diris.strictContent` is set, otherwise warnings. Palette-sourced findings stay advisory either way |
| Version content compatibility | Advisory, unless the cascade reaches the dimension, which is blocking |

## Version content compatibility

Iris ships one Bukkit jar for several Minecraft versions, and pack authors build against whatever version they run. A pack that references a block, item, entity, biome, structure, enchantment or potion effect the running server does not have is gated: the content that composes the missing key is left out, everything else keeps generating, and the decisions are printed once at startup.

Detection is automatic. Iris asks the live platform registry whether each key exists — no resource carries a `since` or `minVersion` and nothing compares version numbers, so mods that add or remove registry content are covered the same way, and the same pack gates identically on Bukkit and on the mod loaders for the same Minecraft version.

| Action | Meaning |
|--------|---------|
| `excluded` | The unit composes the missing content and is removed from every pool that could pick it. An excluded biome never generates, an excluded object is never placed, an excluded entity never spawns |
| `dropped` | One entry or reference is removed and its container keeps generating. A dropped biome scatter entry falls back to the derivative, a dropped loot entry leaves the rest of the table intact |
| `substituted` | A declared fallback replaced the missing key and the content still generates |

Exclusion cascades. A container that referenced an excluded unit drops the reference, and if that empties a required pool the container is excluded in turn: an object placement with no placeable object left, a jigsaw pool with no pieces left, a structure whose start pool is excluded, a spawner with no spawns left, a loot table with no entries left, a region with no land biomes left. **If the cascade reaches the dimension the pack is unusable on that version** — a blocking validation error, and world and studio creation are refused.

Legacy block renames (`minecraft:grass` to `minecraft:short_grass`, `grass_path` to `dirt_path`, and the rest of the rename table) are applied on every platform before anything is called missing, and are not reported. The full resolution order for a block key is the live registry, the rename table, the dimension `blockFallbacks`, then the entry's `backup`. Sounds and particles are not checked; an unknown effect already plays nothing.

Lists that only select blocks which already exist are never gated: `edit[].find` and `markers[].mark` on an object placement, loot `filter` lists, `blockDrops[].blocks`, and decorator whitelists and blacklists. A missing key in one of those matches nothing and is not reported.

### Reading the report

The pack validation line carries the summary, and each pack with findings prints one block, grouped by key and capped at three subjects per key with a `+N more` tail:

```text
Pack 'overworld' validated. 6 content keys unavailable on Minecraft 26.1.2: 11 excluded, 14 dropped.
Pack 'overworld': content unavailable on Minecraft 26.1.2
  minecraft:sulfur_cube (entity): excluded entity standard/passive/sulfur-cube at type
  minecraft:sulfur_caves (biome): excluded biome carving/sulfur-hollows at derivative; excluded biome carving/sulfur at derivative; dropped biome carving/sulfur-hollows at vanillaDerivative; +1 more
  minecraft:sulfur (block): excluded biome carving/sulfur-hollows at wall.palette[0]; excluded biome carving/sulfur at wall.palette[0]; dropped object carving/sulfur/pool-3 at carving/sulfur/pool-3 place[0]; +2 more
  Update the server to a newer Minecraft to restore this content, or declare fallbacks (dimension blockFallbacks, block backup). /iris pack compat overworld lists everything.
```

Each subject reads `<action> <unit> <key> at <detail>`. The unit is the registrant type (`biome`, `region`, `dimension`, `entity`, `spawner`, `loot`, `jigsaw piece`, `jigsaw pool`, `structure`, `mod`), `placement` for an object placement, or `object` for one object dropped from a placement. The detail is either the JSON field path that composes the key (`layers[0].palette[1]`, `edit[0].replace.palette[0]`, `type`), the cascade reason (`no land biomes remain`, `no objects remain`, `no entity spawns remain`), or the reference that was dropped (`regions[2] cave-region`). A substitution names what ran instead: `(backup minecraft:sand)` or `(fallback minecraft:stone)`.

Nothing is printed when a pack has no findings. Each world logs one equivalent line when its runtime is built. When the platform registry cannot be consulted while the pack loads — an early-boot condition on the mod loaders — the report carries an `(incomplete: …)` line and nothing is excluded. An unreadable registry never counts as missing content.

For the full list with no per-key cap:

| Command | Syntax |
|---------|--------|
| Bukkit | `/iris pack compat [pack=<key>]` |
| Modded | `/iris pack compat [<pack>]` |

It reads the published validation report and does not reload the pack, so it is safe on a live server and works from the console. Omitting the pack (or passing `*` on Bukkit) covers every pack with a published result; a pack without one prints a hint to run `/iris pack validate` first. A key that produced a compat finding is suppressed in the content-key check, so `general.strictContentKeys` cannot turn a gated key into a second, blocking error.

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

Applying re-scans from scratch rather than trusting an earlier preview, so a preview you ran an hour ago cannot quarantine something you have since started using. Quarantined files land under `<pack>/.iris-trash/<yyyyMMdd-HHmmss-SSS>/`. A failed apply rolls back what it can and reports any paths still quarantined so you can restore them by hand. A successful apply drops the cached validation result.

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

Output is `exports/<dimensionKey>.iris`, under the plugin data folder on Bukkit and under `config/irisworldgen/exports/` on modded. A blocking validation error leaves staging and the prior archive untouched. Neither the source pack nor any world epoch is modified.

**Written to the export:** `dimensions/`, `regions/`, `biomes/`, `generators/`, `expressions/`, `blocks/` (all block definitions in the pack, not just referenced ones), `loot/`, `entities/`, `objects/`, `spawners/`, `markers/`, `image-maps/`, referenced `images/` PNGs, the structure closure, and `package.json` (content hash, timestamp, dimension `version`). The ambient-spawning graph is exported in full — object placements on regions as well as biomes are followed, and spawner entities are collected from both `spawns` and `initialSpawns`.

**Not written by either compiler:** `mods/` (harmless, nothing applies them — see [24 - Pack Mods & Snippets](/iris/24-pack-mods-snippets)), `caves/`, and other folders outside the collected set.

The Bukkit compiler inlines resolved snippets into exported objects. The modded compiler preserves references and copies the complete `snippet/` JSON tree. Validate the unpacked tree before you publish an `.iris` artifact.

## Stage a production world update

| Platform | Command |
|---|---|
| Bukkit | `/iris pack update-world world=<world> pack=<dimension> confirm=true` |
| Fabric / Forge / NeoForge | `/iris world update <dimension> <pack-or-pack:dimension>` |

On Bukkit, `/iris developer update-world` and `/iris dev update-world` also run this operation. `pack` accepts alias `dimension`, and `confirm` accepts `c`. Select a loaded production Iris world; Studio worlds use their authoring workflow instead.

| Param | Default | What it does |
|-------|---------|--------------|
| `world` | contextual | The world that receives a pending generation epoch |
| `pack` | contextual | The source dimension, resolved from the live packs root |
| `confirm` | `false` | Required. Without it the command only prints the warning and exits |

> Back up the complete world before this operation, including its `iris/generation` directory.
{.is-warning}

Iris validates the source pack, stages a pending epoch, and asks for a restart. The running world keeps its active generation until then. New chunks use the current generator and active pack, with a finite transition beside the saved natural boundary of existing chunks.

Updates must preserve the world seed, physical heights, environment, dimension type, and coordinate scale. Generation mode, fluid baseline, terrain content, and upper-terrain settings can change within that layout. New custom registry definitions can require a server restart.

Staging an older pack creates another activation for future terrain. **It does not undo saved blocks or recreate existing entities.** Missing historical biome records permit only [unambiguous single-biome recovery](/iris/06-worlds-lifecycle#retained-world-data); other unknown positions stay unavailable. Iris retains the immutable pack definitions used by historical chunks so position inspection, ambient spawns and effects still work there, and that retained data grows as the world expands and packs change.

Ordinary Bukkit Studio uses the same history model and activates compatible authoring edits while the world is open, with no production update command. See [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas).

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
