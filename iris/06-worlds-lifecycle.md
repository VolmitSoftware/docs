---
title: "Worlds & Lifecycle"
description: "Iris documentation: Worlds & Lifecycle"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Creating an Iris world starts an immutable generation history in the world folder. Iris registers the world so the server rebuilds it on every boot, then hands generation to the Iris engine. This page covers create, update, load, unload, remove, and cold replacement on Bukkit-family servers and on Fabric, Forge, and NeoForge.

Paper-family servers keep managed worlds under the selected level root as `dimensions/iris/<key>/`. Plain Spigot uses a configured outer world root with the same canonical dimension tree nested inside it. Mod loaders keep their registry in `iris-dimensions.json`.

See also: [02 - Getting Started](/iris/02-getting-started), [04 - Commands & Permissions](/iris/04-commands-permissions), [05 - Concepts & Pack Layout](/iris/05-concepts-pack-layout), [07 - Pregeneration](/iris/07-pregeneration), [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas), [30 - Platform Differences](/iris/30-platform-differences).

## Create a world you intend to keep

The difference between a throwaway world and one you will still run in six months is the setup. Choose the seed and dimension layout before the first chunk generates. Compatible pack updates can change future terrain while generation history preserves existing chunks.

Before you start: a pack that validates, a seed you have written down, a current backup, and no other lifecycle command running.

### Bukkit-family

World creation requires successful Java agent loading and server code injection. Iris refuses creation when runtime initialization has failed. Resolve the startup failure using [Java agent recovery](/iris/01-installation-platforms#recover-from-a-java-agent-failure), then restart completely.

```text
/iris pack validate pack=overworld
/iris studio open overworld seed=1337
```

Fly around, look at the terrain, then close the studio:

```text
/iris studio close
```

Now create the real world. This records the first immutable pack epoch:

```text
/iris create name=release_candidate type=overworld seed=1337
```

The managed `iris:*` world is created immediately on every supported Bukkit-family server. Folia does not restart for ordinary creation; Spigot uses the public Bukkit path.

Progress appears as a title and an action-bar meter for players and a text bar in the console. Ordinary world creation does not use a boss bar regardless of `general.progressBossBar`; only optional creation-time pregeneration does.

```text
/iris worlds
/iris tp release_candidate
```

**Expected result:** `release_candidate` appears in `/iris worlds` as a loaded Iris world, you spawn in it, and chunks generate as you fly.

A player-issued create also generates the entry chunks and teleports you in, under a 60-second watchdog. That watchdog is non-terminal: on failure or timeout Iris cancels only the teleport, keeps the created world loaded and registered, and does not request a restart. Wait for initial generation to settle and run `/iris tp release_candidate` again.

The world generates from its active immutable epoch under `<world>/iris/generation/epochs/<epoch>/pack/`. Authoring edits do not automatically update production worlds. Preserve the complete generation history with the world backup. Use [25 - Pack Management](/iris/25-pack-management) for compatible updates. Height and dimension-layout changes require a new world.

### Fabric / Forge / NeoForge

The current built-in Overworld and Underworld declare no external datapack imports. Restart with the Iris packs already installed so their registry data loads. For a custom pack that declares `datapackImports`, place every external datapack in the target save's `datapacks/` directory before that pack loads; modded `/iris datapack ingest` does not perform this Bukkit-only installation.

```text
/iris pack validate overworld
/iris world enable irisworldgen:release_candidate overworld 1337
/iris world status
/iris tp irisworldgen:release_candidate
```

The seed argument is optional and defaults to `1337`. `enable` also accepts the alias `create`. The whole group is reachable as `/iris w`.

```text
/iris pregen start 352 irisworldgen:release_candidate at 0 0
```

Restart the server when it finishes.

**Expected result:** `/iris world status` lists the same dimension with the same pack after restart. `/iris info irisworldgen:release_candidate` as a gamemaster reports seed `1337` from `iris-dimensions.json`.

From here, `/iris world disable <dimension>` unloads it and keeps the files. `/iris world delete <dimension>` is the destructive path. Both require the dimension argument.

## Update a world without regenerating it

Validate and test the authoring pack first, then take a complete world backup. On Bukkit, stage it with:

```text
/iris developer update-world world=<world> pack=<pack> confirm=true
```

On Fabric, Forge, or NeoForge:

```text
/iris world update <dimension> <pack-or-pack:dimension>
```

The running world stays on its current pack until restart. **Updating a pack changes only newly generated chunks. Existing terrain keeps the pack it was generated with.** New terrain reconciles against the frozen boundary over `generator.generationTransitionWidthBlocks`, so a large edit can still leave a visible seam.

Selecting an earlier authoring pack creates another activation for future chunks; it does not undo saved terrain. Preserve the complete world backup, including its generation history.

## Remove a world without losing anything else

Removal is the operation most likely to cost you data, so the order matters.

1. **Back up first.** Nothing below is undoable.
2. **Get everyone out.** `/iris evacuate <world>` moves players to another loaded world, or kicks them if there is nowhere to go. Removal does this for you, but doing it deliberately means you see who was in there.
3. **Unload it.** `/iris unload <world>`. This marks the world for maintenance, evacuates, unloads, and closes the generator.
4. **Remove it.** `/iris remove <world>` deletes the files. `/iris remove <world> delete=false` keeps them and only unregisters. Use this when you want the directory back later.
5. **Read the status Iris prints.** It tells you what actually happened. See the status table below.

**Expected result:** `UNREGISTERED` (files kept) or `DELETED` (files gone). The world is absent from `/iris worlds`.

`DELETE_QUEUED` means the files could not be deleted now and were quarantined for deletion at next startup. Restart and confirm the target is gone before reusing that name.

On mod loaders the equivalent is `/iris world delete <dimension>`, which disables and then wipes chunk and mantle data.

### If unload hangs

Unload has a hard 150-second ceiling. If the world, generator, or scheduler work has not settled by then, Iris marks a terminal timeout, requests a server restart, and fails the command. Let the restart happen. **Do not delete a live world directory to force the issue.**

## Lifecycle recovery

| Symptom | What it means | What to do |
|---|---|---|
| "busy" response | Another lifecycle operation holds the coordinator. It is one global mutex, so a pack download or publish blocks world create just as much as another create does | Wait for the running operation. Retrying concurrently will not help |
| Startup validation pending / failed / restart-required on login or create | Runtime initialization, external datapack ingestion, or dimension-pack validation has not reached a safe state | Fix the first logged failure, or complete the requested restart. Do not hand-create world folders or hand-edit `bukkit.yml` |
| Java Agent or Code Injection failure at startup | Iris cannot install the server hooks needed for world creation and dimension heights | Follow [Java agent recovery](/iris/01-installation-platforms#recover-from-a-java-agent-failure). Restart completely and confirm injection succeeds before retrying |
| A configured startup world is reported as generation-locked | The startup restart or shutdown did not complete, or startup validation failed before world loading. Iris bound a non-generating safety generator so Bukkit cannot fall back to vanilla terrain | Fix the first logged restart or validation failure, then restart. Do not force chunk generation while the lock remains |
| Folia create reports `paper_like_runtime` unavailable | Iris cannot prove a safe runtime world-creation backend and refuses rather than using Folia's unsupported public path | Update to a compatible Folia/Iris build, then retry without hand-editing world storage |
| Create fails during initial-spawn preparation | A required entry chunk failed, spawn placement failed, or the 10-minute initial-spawn wait expired | Treat the create as failed and follow the logged instruction. Do not start another lifecycle mutation until Iris releases the operation |
| Create reports that automatic teleport failed | The world was created, but entry-chunk generation, safe-position resolution, or the teleport did not finish within 60 seconds | The world remains valid and no restart is requested for this alone. Wait for initial generation, then run `/iris tp <world>` |
| Load reports missing or inconsistent data | The dimension root, the `bukkit.yml` registration, or the active generation snapshot is incomplete | Keep the directory and restore from backup. Load never re-downloads a snapshot |
| Unload hits its terminal timeout | Work did not drain in 150 s | Allow the restart. Do not force-delete the live directory |
| Remove returns `DELETE_QUEUED` | Files were quarantined for startup deletion | Restart, confirm the target is gone, then reuse the name |
| Modded registry renamed to `.broken-<timestamp>` | The whole `iris-dimensions.json` failed to parse | Keep the backup. Iris logs whatever ids it could salvage from the raw text. Recreate each with its original pack, dimension, and seed, then verify with `/iris world status` |

## Identity and storage

| Item | Rule |
|---|---|
| Managed namespace | The safe/managed API accepts `iris` only, so create, load, and remove can never touch a `minecraft:` or third-party dimension folder |
| Logical name | For `iris:foo` the logical name is `foo` — that is what you type in commands |
| Selected level root | `Server#getLevelDirectory` on Paper-family servers. If that method is missing, Iris latches `<world-container>/<level-name>` from `server.properties` (default `world`) |
| Paper-family dimension folder | `<levelRoot>/dimensions/iris/<key>/` |
| Spigot dimension folder | `<world-container>/<level-name>_iris_<key>/dimensions/iris/<key>/`. The outer name is CraftBukkit's configured world root, while chunks, `iris/pack`, and `iris/pregen` all remain under the canonical nested dimension root |
| Pack snapshots | `<dimensionRoot>/iris/generation/epochs/<epoch>/pack/`, selected by the generation manifest |
| Pregen cache | `<dimensionRoot>/iris/pregen/` |
| Registry | `<level-root>/iris/worlds.json` (a save-scoped flat `worldIdentity → dimensionType` map, written atomically) plus the global `worlds:` section of `bukkit.yml`, which stores `generator: "Iris:<dimension>"` and the seed |
| Name normalization | The name is lowercased and spaces become `_` before validation, so `My World` becomes `my_world` rather than being rejected |
| Name constraints | After normalization the key must match `[a-z0-9_-]+`. `/`, `\`, and `..` are rejected as unsafe path segments, and symlinks on any component of the dimension root are refused |
| Reserved names | `/iris create` rejects `iris` and `benchmark` case-insensitively. This is a create-time check only |

The vanilla main, Nether, and End worlds have the canonical keys `minecraft:overworld`, `minecraft:the_nether`, and `minecraft:the_end`. They are not Iris-managed dimension folders and are only reachable through the exact-slot replacement path below.

The startup configuration name is separate from both identity and display name. On Paper-family servers, an `iris:moon` dimension in level root `world` is displayed as `moon`, stored at `world/dimensions/iris/moon`, and bound in `bukkit.yml` as `world_iris_moon`. Plain Spigot configures the outer root `world_iris_moon`, with the persistent dimension at `world_iris_moon/dimensions/iris/moon`. Because `bukkit.yml` is server-global, Iris imports an entry only when its exact canonical dimension directory is a real non-symlink directory for the selected save, so switching `level-name` cannot reinterpret another save's Iris registry. Only the current-format startup name is accepted; noncanonical entries are ignored.

## Command surface (Bukkit)

| Command | What it does |
|---|---|
| `/iris create name=<name> [type=<installed-pack-or-dimension>] [seed=1337]` | Create an absent managed `iris:*` world now on every supported Bukkit-family runtime. Omitting `type` uses `generator.defaultWorldType` |
| `/iris replace <target> [type=default] [seed=preserve]` | Stage a cold replacement of an existing safe Iris world or exact vanilla dimension slot. Aliases `override`, `overwrite` |
| `/iris load <name>` / `/iris import <name>` | Reconcile a world that already exists on disk back into the server. Never downloads anything |
| `/iris unload <world>` | Evacuate, unload, close the generator. The safe first half of removal |
| `/iris remove <name> [delete=true]` | Unregister the world, and by default delete its files |
| `/iris evacuate <world>` | Move every player out of an Iris world, or kick them if no other world is loaded |
| `/iris tp <world> [player=<name>]` | Teleport yourself, or a named player, to the world spawn |
| `/iris worlds` | List which loaded worlds are Iris worlds and which are not |

Aliases and permissions: [04 - Commands & Permissions](/iris/04-commands-permissions).

### Create parameters

| Param | Default | What it controls |
|---|---|---|
| `name` (`world-name`) | required | Becomes `iris:<logical>`. Create never resolves a vanilla dimension slot |
| `type` (`dimension`, `pack`) | `default` | Which pack and dimension to generate from. `default` resolves to `settings.generator.defaultWorldType` (`overworld`). Otherwise a pack name or `pack:dimensionKey` |
| `seed` | `1337` | The new managed world's seed |

Create refuses to run on the primary thread. It requires startup datapack validation to be ready and the chosen pack to have a loadable validation result, then a free lifecycle lease. A refusal at any of those gates leaves no dimension folder and no registration behind. Create also refuses when the dimension root already exists or the world is already loaded.

Creation reuses the loaded datapack runtime when it already supplies the selected dimension type and all required registry definitions; new or changed required registry entries force datapack installation and a restart. Reusing the loaded runtime does not apply unrelated external datapack edits — use `/iris datapack ingest restart=true` as described in [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks).

Create has a 120-second budget for the world itself, 10 minutes for the initial spawn chunk, and 30 seconds for the `bukkit.yml` registration. A timeout in the first or last of those escalates to a server restart rather than leaving a half-created world.

## Exact world-slot replacement

`/iris replace <target> [type=default] [seed=preserve]` puts Iris generation into a slot that already exists, including the vanilla Overworld, Nether, or End. The aliases are `override` and `overwrite`. It preserves that canonical identity in place and **always stages for a full restart**. There is no live generator swap and no old/new chunk merge.

It requires a Paper-family early bootstrap, which plain Spigot never runs, so on Spigot the command fails closed. The target dimension folder must already exist. Spigot still supports ordinary `/iris create` for a new managed `iris:*` world.

Accepted targets are safe `iris:*` keys and exactly three canonical vanilla slots: `minecraft:overworld`, `minecraft:the_nether`, and `minecraft:the_end`. Friendly aliases `main`/`overworld`, `nether`/`the_nether`, and `end`/`the_end` resolve to those slots. The selected save's Bukkit aliases `<level-name>`, `<level-name>_nether`, and `<level-name>_the_end` also resolve to those slots and take priority over friendly aliases. Other bare names resolve to `iris:<name>`. A vanilla slot also requires:

- a pack whose environment matches the slot (`NORMAL`, `NETHER`, or `THE_END`), checked both before staging and after install.
- `allow-nether` or `allow-end` enabled in the server config for those two slots.

Foreign namespaces, other `minecraft:*` keys, path traversal, symlinks, and special filesystem entries all fail closed.

With the default `seed=preserve`, replacement preserves the authoritative seed stored in that target's Paper `world_gen_settings.dat`. An explicit `seed=<signed-64-bit-integer>` clones the target's complete current-format settings and changes only `data.seed`. Iris never derives one dimension's seed from another dimension or rewrites `server.properties`.

> The old dimension directory is moved to a retained sibling backup at the next boot, and the replacement starts from the staged snapshot. Old `region`, `entities`, `poi`, and Iris runtime data are **never merged** — they stay in the backup. The backup is only eligible for deletion after the replacement is proven at `WorldLoad`; a failed check journals a rollback, requests another restart, and restores the retained directory. Iris preserves artifacts rather than guessing, so a conflicting manual edit aborts early bootstrap instead of continuing.
{.is-warning}

### Bundled Overworld and Nether pair

For the supported main-world route, initialize both vanilla target folders first and keep `allow-nether=true`, then run these commands on Paper, Purpur, Leaf, or Folia:

```text
/iris download pack=overworld
/iris download pack=underworld
```

Downloads are single-flight, so wait for the Overworld download to finish before starting Underworld. The built-in packs declare no external datapack imports. Restart once so Minecraft loads the downloaded packs' dimension types and custom biomes.

After the server returns, stage both exact slots:

```text
/iris replace minecraft:overworld type=overworld seed=123456789
/iris replace minecraft:the_nether type=underworld seed=-987654321
```

Each replacement reports progress and then a staged-success message. A second replacement request reports busy while the first is active. Wait for each staged-success message before issuing the next replacement or restarting.

Restart once after both replacements report staged. A fresh built-in-pair installation therefore crosses two restart boundaries: the first loads the Iris registry data, the second cold-publishes both replacements together. A custom pack that declares `datapackImports` must complete the explicit workflow in [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks) before staging.

The `type=` values select the Iris pack/dimension; the targets select the Minecraft identities being retained. Each optional `seed=` applies only to that target. There is no main-world, overwrite, force, or portal-routing flag. After cold publication, vanilla portal mechanics continue to route between `minecraft:overworld` and `minecraft:the_nether`. A separately created or replaced `iris:*` world stays outside that canonical pair.

### Safe entry after an Overworld replacement

Replacing `minecraft:overworld` also replaces the terrain underneath saved player positions and the old world spawn. Before Iris retires the replacement's entry guard it generates the new spawn chunk, searches it for a dry collision-supporting floor with two clear body blocks, and applies that as the canonical world spawn. Water, waterlogged blocks, leaves, powder snow, magma, cactus, fire, portals, cobwebs, pointed dripstone, berry bushes, wither roses, and other collision hazards are refused. **If no safe candidate can be verified, Iris keeps the guard active and refuses guarded login rather than guessing.**

On each recorded player's first post-replacement login, Iris leaves a saved Overworld location alone when its replacement chunk already exists and both body blocks are still passable. It never generates a missing chunk just to preserve an old coordinate: a missing, slow, failed, or obstructed check redirects that player to the verified safe spawn, preserving yaw and pitch. The guard retires only after the world spawn is persisted and every recorded player has entered safely or logged in from another dimension, so a crash cannot turn the one-time rescue into a partial operation.

## Studio create

Studio worlds differ from production worlds in ways that matter:

- Startup datapack validation and the pack's own validation must both be loadable before any Studio folder, snapshot, generator, or Bukkit world is created. Missing validation fails closed.
- Bukkit Studio captures its initial immutable pack before world creation, and a separate watcher reads the editable authoring folder.
- **Studio worlds are transient.** They are never written into Iris's persistent world registry, and their `bukkit.yml` entries are removed during shutdown cleanup. `packs/<key>/` is the source of truth, not the world folder.
- Standard Studio uses the production generation contract. With identical pack bytes, seed, and history it produces the same terrain. Accepted edits activate a new pack for future chunks and blend the boundary; existing chunks retain their earlier generation.
- Opening Studio after creating a persistent world from the same pack reuses the already-loaded dimension type and custom biomes; that is not a reason to restart. New or changed registry content still requires the normal restart boundary.
- A failed open cleans up its transient world immediately, unless a terminal server lifecycle operation is already active, in which case cleanup is queued for startup.

See [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas).

## Load

`/iris load` (alias `/iris import`) reconciles a world that already exists on disk. It never downloads a pack: the world must already have its active generation snapshot and consistent registration data. Validation is path-scoped, so two worlds whose snapshot folders are both named `pack` cannot authorize or reject one another.

On Bukkit, a saved dimension that needs an installed custom-block provider waits for that provider's content registry during startup. Iris binds its generator immediately, checks the frozen dimension contract, and starts the engine only after the saved pack passes content validation; generation requests during the wait are rejected before writing terrain. A provider that does not become ready within 120 seconds leaves generation locked and triggers shutdown. See [28 - Integrations](/iris/28-integrations) for supported providers and block IDs.

## Unload

`/iris unload` runs synchronously from a player origin: it requires an Iris world, marks it for maintenance, evacuates, unloads, and closes the generator. There are two timers — the inner unload has a 120-second budget, and the command wraps the whole sequence in a 150-second ceiling. On that terminal timeout Iris requests a server restart and fails the future.

Wait for `/iris unload` to finish before moving, replacing, or deleting a world. A failure before world removal leaves it loaded; if generator cleanup fails afterward, the world can already be unloaded and a later close retries the release.

On a true server stop, Iris drains Jigsaw Studio autosaves while region access is still available, then closes generators after the server has finished draining its chunk system.

## Evacuate

`/iris evacuate <world>` moves every player out of an Iris world into another loaded world, or kicks them when there is nowhere else to go. It runs as a step inside both unload and removal, and is worth running on its own first so you can see who was affected.

## Remove

`/iris remove <name> [delete=true]` reports one of 18 statuses.

| Status | Meaning |
|---|---|
| `UNREGISTERED` | Unloaded and unregistered. Files kept. This is success for `delete=false` |
| `DELETED` | Unregistered and files deleted. Success for the default |
| `DELETE_QUEUED` | Files could not be deleted now and were quarantined for deletion at next startup. Restart and confirm before reusing the name |
| `BUSY` | Another world or pack mutation holds the coordinator |
| `INVALID_IDENTIFIER` | The name is not a parseable managed key |
| `PROTECTED_WORLD` | The target is a world Iris refuses to remove |
| `NOT_IRIS_WORLD` | The target exists but is not Iris-managed |
| `UNSAFE_PATH` | The resolved directory failed a path-safety check (traversal, symlink, wrong namespace) |
| `NOT_FOUND` | No such managed world |
| `RESOLUTION_FAILED` | Iris could not resolve the world identity to a directory |
| `TELEPORT_FAILED` | Players could not be evacuated, so removal stopped before touching files |
| `GENERATOR_CLOSE_FAILED` | The Iris generator did not close cleanly. The world may still hold resources |
| `UNLOAD_FAILED` | The server refused or failed to unload the world |
| `CONFIGURATION_FAILED` | The `bukkit.yml` entry could not be updated |
| `REGISTRY_FAILED` | The `worlds.json` registry could not be updated |
| `QUARANTINE_FAILED` | The world directory could not be moved to the quarantine name |
| `DELETE_FAILED` | Quarantine succeeded but deletion did not |
| `INTERNAL_FAILURE` | An unexpected error. Read the logged cause |

> Any status other than `UNREGISTERED`, `DELETED`, or `DELETE_QUEUED` means the registry may have changed without the files being removed, and a quarantine directory may still exist. Check the world directory before retrying.
{.is-warning}

Only safe `iris` namespace dimension paths are mutable. Each phase has a 120-second timeout and can request a restart when it gets stuck. With `delete=true`, Iris records the exact quarantine name in a durable startup queue **before** moving the directory, so a crash mid-delete is still cleaned up on the next boot. Symlinks and special filesystem entries are rejected, and a queue entry is kept with the full error when content is left behind.

## Main world and level-root selection

### Bukkit-family

The server's main world is the `minecraft:overworld` dimension inside the save root selected by `server.properties` `level-name`. To make Iris generate that existing main slot, stage this replacement and restart:

```text
/iris replace minecraft:overworld type=overworld seed=123456789
```

The replacement keeps `level-name` unchanged, so save-wide player data, datapacks, global data, Nether, End, and custom dimensions remain in the same level root. Only the existing Overworld dimension folder, staged seed, and generator registration participate. Omit `seed=` to preserve the current Overworld seed.

Iris no longer promotes an `iris:*` world into another level root, copies save-wide data into a new root, or rewrites `server.properties`. The old `main` / `main-world` and `overwrite` / `force` parameters were removed from `/iris create`; `/iris overwrite` is now an alias of `replace`. Selecting a fresh whole-save `level-name` is a server-provisioning operation and must be done outside Iris.

### Fabric / Forge / NeoForge

Install and registry-load the pack before changing the vanilla main world. Then stage the pack's world preset and restart cleanly:

```text
/iris world mainworld overworld 1337
```

This is the command that changes the actual `minecraft:overworld` generator. It writes the Iris preset to `server.properties` `level-type`, stores the selection in `config/irisworldgen/modded.json`, and places a pending marker. During the next early boot Iris moves the prior vanilla Overworld, Nether, End, `level.dat`, and `level.dat_old` into `config/irisworldgen/mainworld-recovery-<id>/`, then Minecraft creates fresh vanilla slots from the selected Iris preset. Save-wide player data, advancements, statistics, datapacks, the Iris persistent-dimension registry, and non-vanilla dimension folders remain in the selected level root.

`/iris world replace-overworld overworld 1337` is a different operation: it creates a persistent `irisworldgen:primary` dimension and routes players there without replacing the generator of `minecraft:overworld`. Use `/iris world mainworld off` to stop forcing the preset on later boots; that does not restore the quarantined vanilla terrain or change the generator already recorded in the current save.

After the replacement restart, verify the selected preset in `server.properties`, a non-empty `<level-name>/dimensions/minecraft/overworld/data/minecraft/world_gen_settings.dat`, the expected entries in `<level-name>/iris/iris-dimensions.json`, and a second clean restart without another pending marker. **Keep the recovery directory until the new main world and every retained dimension have been verified.**

## Modded persistent-dimension registry

Fabric, Forge, and NeoForge persist dynamic Iris worlds in `<world-root>/iris/iris-dimensions.json`:

```json
{
  "dimensions": [
    { "id": "irisworldgen:myworld", "pack": "overworld", "dimension": "overworld", "seed": 1337 }
  ]
}
```

All four fields are required per entry. `id` is the registered dimension id, `pack` is the installed pack folder, `dimension` is its dimension load key, `seed` is the generation seed. Writes go to a sibling `iris-dimensions.json.tmp` and are moved into place atomically.

Entries that are individually invalid are logged, kept verbatim, and re-appended on the next write. Iris never silently drops one. Duplicate ids keep the first valid entry and warn.

If the whole file fails to parse, the startup load path quarantines it as `iris-dimensions.json.broken-<timestamp>` and continues with no persistent Iris dimensions, salvaging whatever ids it can into the log. Every other code path throws rather than discard persistent worlds. Keep the quarantined file, recreate each reported world with `/iris world create`, verify pack, dimension, and seed, then delete the backup.

## Generation updates and retained terrain

**The one rule an operator acts on: updating a pack changes only newly generated chunks. Existing terrain keeps the pack it was generated with.**

A world records which pack generated each chunk, so a jar or pack update never rewrites saved blocks or recreates existing entities. New terrain reconciles against the frozen boundary over `generator.generationTransitionWidthBlocks`; beyond that width the new pack applies alone. Repeated edits do not shift an earlier boundary.

Within the transition band, terrain reconciliation covers solid volume, cave openings, materials, and fluids, and objects and structures can populate it as long as their complete footprints stay outside historical chunks. Local fluid banks replace exposed liquid cells beside air with stable solid material. None of this simulates every partial-block or fluid interaction, so a large edit can still produce an abrupt shape or a cave change.

The world seed, physical height bounds, logical height, environment, dimension type, and coordinate scale stay fixed for the life of the world. Generation mode, fluid baseline, materials, caves, and upper-terrain settings can change within those bounds. New or changed registry content can require a restart before activation.

### Retained world data

Iris keeps the immutable pack definitions for historical activations as well as the active and pending epochs, plus registry metadata for custom biomes, tags, dimension types, and renderer identities the saved chunks need. Saved biome environments — the three-dimensional biome identity, the surface and cave biome, and the region for each column — resolve through those definitions, so position inspection, ambient spawns, and effects stay consistent with the terrain around them. A feature removed from the running jar cannot execute merely because its old configuration is still on disk.

Chunks generated before biome recording may lack an exact environment. Iris does not replay old noise or substitute the current biome; unresolved positions report unavailable and dependent ambient behavior skips them.

> History grows as chunks, biome records, retained packs, and activations accumulate. **Back up the complete dimension directory, including native chunks and `iris/generation`.** Generation history format 6 remains valid and saved biome records do not require a world reset.
{.is-warning}

### Pack and Studio operations

| Operation | Effect on the pack |
|---|---|
| Production create | Captures the initial immutable generation epoch and pack |
| Bukkit Studio open | Captures an initial world-local epoch and watches the separate authoring pack |
| Bukkit `/iris pack package`; modded `/iris studio package` | Exports an archive. No world is touched |
| `/iris pack update-world` | Stages a validated installed pack for activation after restart. Existing chunks retain their recorded generation. `/iris dev update-world` also runs this operation |
| Ordinary Bukkit Studio hotload | Activates accepted edits for new chunks with a terrain transition. Saved terrain, biome environments, and their pack definitions remain intact |

## Concurrent lifecycle guards

Iris uses a **single global mutex** across world and pack operations. It is not one lock per domain: a pack download or publish makes a world create report busy, and vice versa. Wait for the running operation rather than retrying.

The operations it covers are `WORLD_CREATE`, `WORLD_LOAD`, `WORLD_UNLOAD`, `WORLD_REMOVE`, `WORLD_REPLACE`, `STUDIO_OPEN`, `STUDIO_CLOSE`, `PACK_CREATE`, `PACK_DOWNLOAD`, `PACK_PUBLISH`, `DATAPACK_COMPILE`, and `SERVER_RESTART`.
