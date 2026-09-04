---
title: "Worlds & Lifecycle"
description: "Iris documentation: Worlds & Lifecycle"
published: true
date: 2026-09-03T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Creating an Iris world copies the pack into the world folder. Iris registers the world so the server rebuilds it on every boot, then hands generation to the Iris engine. This page covers the full lifecycle on Bukkit-family servers and on Fabric, Forge, and NeoForge. The steps are create, load, unload, remove, and cold replacement of an existing world slot.

Paper-family servers keep managed worlds under the selected level root as `dimensions/iris/<key>/`. Plain Spigot uses a configured outer world root with the same canonical dimension tree nested inside it. Mod loaders keep their registry in `iris-dimensions.json`.

See also: [02 - Getting Started](/iris/02-getting-started), [04 - Commands & Permissions](/iris/04-commands-permissions), [05 - Concepts & Pack Layout](/iris/05-concepts-pack-layout), [07 - Pregeneration](/iris/07-pregeneration), [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas), [30 - Platform Differences](/iris/30-platform-differences).

## Create a world you intend to keep

The difference between a throwaway world and one you will still run in six months is the setup. You decide the pack, seed, and height **before** the first chunk generates. None of those are editable afterwards without regenerating terrain.

Before you start: a pack that validates, a seed you have written down, a current backup, and no other lifecycle command running.

### Bukkit-family

```text
/iris pack validate pack=overworld
/iris studio open overworld seed=1337
```

Fly around, look at the terrain, then close the studio:

```text
/iris studio close
```

Now create the real world. This is the step that freezes the pack:

```text
/iris create name=release_candidate type=overworld seed=1337
```

The managed `iris:*` world is created immediately on every supported Bukkit-family server. Folia uses Iris's Paper-like runtime lifecycle backend and does not restart for ordinary creation; Spigot uses the public Bukkit path.

The immediate path starts its lifecycle progress presentation before validation, rather than waiting for spawn chunks. Players receive an arbitrated large title and a labeled action-bar meter published into the shared cooperative compositor; ordinary world creation does not use a boss bar, regardless of `general.progressBossBar`. The meter merges beside other plugins' HUD content and expires after the terminal update. Console receives a throttled colored text bar. The percentage advances only when create crosses a real phase boundary, with live generated/required counts during spawn generation. Completion or failure remains in chat, while detailed lifecycle and exception diagnostics continue to go to the console separately. Optional creation-time pregeneration retains its dedicated long-running boss bar.

```text
/iris worlds
/iris tp release_candidate
```

**Expected result:** `release_candidate` appears in `/iris worlds` as a loaded Iris world, you spawn in it, and chunks generate as you fly.

When a player runs the create command, Iris first generates the resolved entry chunk, searches the generated column area for a collision-free supported position, and only then delegates Paper's asynchronous teleport. The operation has a 60-second watchdog. A failure or timeout is non-terminal: Iris cancels only that entry attempt, keeps the successfully created world loaded and registered, and does not request a restart. Wait for initial generation to settle and run `/iris tp release_candidate` again.

Now prove it survives a restart. A world that only works in the session that created it is not actually created:

```text
/iris pregen start radius=352 world=release_candidate center=0,0 gui=false
```

Wait for it to finish (see [07 - Pregeneration](/iris/07-pregeneration)). Restart the server cleanly. Teleport back in, and fly past the pregenerated boundary. New terrain must still appear.

**The world is now committed.** It generates from `<world>/iris/pack`, its own frozen copy. Continuing to edit `packs/overworld/` affects Studio only. Never delete or replace that snapshot while the world is loaded. To deploy pack changes into it later, use the deliberate path in [25 - Pack Management](/iris/25-pack-management). For anything that changes height or dimension type, create a new world instead.

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

## Remove a world without losing anything else

Removal is the operation most likely to cost you data, so the order matters.

1. **Back up first.** Nothing below is undoable.
2. **Get everyone out.** `/iris evacuate <world>` moves players to another loaded world, or kicks them if there is nowhere to go. Removal does this for you, but doing it deliberately means you see who was in there.
3. **Unload it.** `/iris unload <world>`. This marks the world for maintenance, evacuates, unloads through the lifecycle service, and closes the generator.
4. **Remove it.** `/iris remove <world>` deletes the files. `/iris remove <world> delete=false` keeps them and only unregisters. Use this when you want the directory back later.
5. **Read the status Iris prints.** It tells you what actually happened. See the status table below.

**Expected result:** `UNREGISTERED` (files kept) or `DELETED` (files gone). The world is absent from `/iris worlds`. Its platform-specific dimension root described below matches what you asked for.

`DELETE_QUEUED` means the files could not be deleted now and were quarantined for deletion at next startup. Restart and confirm the target is gone before reusing that name.

On mod loaders the equivalent is `/iris world delete <dimension>`, which disables and then wipes chunk and mantle data.

### If unload hangs

Unload has a hard 150-second ceiling. If the world, generator, or scheduler work has not settled by then, Iris marks a terminal timeout, requests a server restart, and fails the command. Let the restart happen. Do not delete a live world directory to force the issue.

## Lifecycle recovery

| Symptom | What it means | What to do |
|---|---|---|
| "busy" response | Another lifecycle operation holds the coordinator. It is one global mutex, so a pack download or publish blocks world create just as much as another create does | Wait for the running operation. Retrying concurrently will not help |
| Startup validation pending / failed / restart-required on login or create | External datapack ingestion or dimension-pack validation has not reached a safe state | Fix the first logged failure, or complete the requested restart. Do not hand-create world folders or hand-edit `bukkit.yml` |
| A configured startup world is reported as generation-locked | The immediate startup restart or shutdown did not complete, or startup validation failed before world loading. Iris bound a non-generating safety generator so Bukkit cannot fall back to vanilla terrain | Fix the first logged restart or validation failure, then restart. Do not force chunk generation while the lock remains |
| Folia create reports `paper_like_runtime` unavailable | Iris cannot prove a safe runtime world-creation backend and refuses before invoking Folia's unsupported public path | Update to a compatible Folia/Iris build, then retry without hand-editing world storage |
| Create fails during initial-spawn preparation | The spawn chunk returned null or failed, its owning-region task was rejected, spawn placement failed, or the 120-second initial-spawn wait expired | Treat the create as failed and follow the logged reconciliation or restart instruction. Do not start another lifecycle mutation until Iris releases or fences the operation |
| Create reports that automatic teleport failed | The world was created, but entry-chunk generation, safe-position resolution, or Paper's asynchronous teleport failed or did not finish within 60 seconds | The world remains valid and no restart is requested solely for this failure. Wait for initial generation, then run `/iris tp <world>` |
| Load reports missing or inconsistent data | The dimension root, the `bukkit.yml` registration, or the `iris/pack` snapshot is incomplete | Keep the directory and restore from backup. Load never re-downloads a snapshot |
| Unload hits its terminal timeout | Work did not drain in 150 s | Allow the restart. Do not force-delete the live directory |
| Remove returns `DELETE_QUEUED` | Files were quarantined for startup deletion | Restart, confirm the target is gone, then reuse the name |
| Modded registry renamed to `.broken-<timestamp>` | The whole `iris-dimensions.json` failed to parse | Keep the backup. Iris logs whatever ids it could salvage from the raw text. Recreate each with its original pack, dimension, and seed, then verify with `/iris world status` |

## Identity and storage

| Item | Rule |
|---|---|
| Managed namespace | The safe/managed API accepts `iris` only, so create, load, and remove can never touch a `minecraft:` or third-party dimension folder |
| Logical name | For `iris:foo` the logical name is `foo` — that is what you type in commands |
| Selected level root | `Server#getLevelDirectory` on Paper-family servers. If that method is missing, Iris latches `<world-container>/<level-name>` from `server.properties` (default `world`) for save-scoped registry and datapack work |
| Paper-family dimension folder | `<levelRoot>/dimensions/iris/<key>/` |
| Spigot dimension folder | `<world-container>/<level-name>_iris_<key>/dimensions/iris/<key>/`. The outer name is CraftBukkit's configured world root, while chunks, `iris/pack`, and `iris/pregen` all remain under the canonical nested dimension root |
| Pack snapshot | `<dimensionRoot>/iris/pack/` |
| Pregen cache | `<dimensionRoot>/iris/pregen/` |
| Registry | `<level-root>/iris/worlds.json` (a save-scoped flat `worldIdentity → dimensionType` map, written atomically) plus the global `worlds:` section of `bukkit.yml`, which stores `generator: "Iris:<dimension>"` and the seed |
| Name normalization | The name is lowercased and spaces become `_` before validation, so `My World` becomes `my_world` rather than being rejected |
| Name constraints | After normalization the key must match `[a-z0-9_-]+`. `/`, `\`, and `..` are rejected as unsafe path segments, and symlinks on any component of the dimension root are refused |
| Reserved names | `/iris create` rejects `iris` and `benchmark` case-insensitively. This is a create-time check only. The storage layer does not enforce it |

The vanilla main, Nether, and End worlds have the canonical keys `minecraft:overworld`, `minecraft:the_nether`, and `minecraft:the_end`. They are not Iris-managed dimension folders and are only reachable through the exact-slot replacement path below.

The startup configuration name is separate from both identity and display name. On Paper-family servers, an `iris:moon` dimension in level root `world` is displayed as `moon`, stored at `world/dimensions/iris/moon`, and bound in `bukkit.yml` as `world_iris_moon`. Plain Spigot uses the same startup name and identity but configures the outer root `world_iris_moon`, with the persistent dimension at `world_iris_moon/dimensions/iris/moon`. Iris parses the startup name back to the canonical key. Because `bukkit.yml` is server-global, Iris imports an entry only when its exact platform-specific canonical dimension directory is a real non-symlink directory for the selected save. Switching `level-name` cannot silently reinterpret another save's Iris registry.

Only that exact current-format startup name is accepted. Iris does not migrate, translate, or rewrite former short custom-world entries. Noncanonical entries are ignored.

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

Create refuses to run on the primary thread. Before it takes a lifecycle lease it requires startup datapack validation to be ready and the chosen pack to have a loadable validation result. Then the `WORLD_MUTATION` / `WORLD_CREATE` lease must be free or the command fails busy. A refusal at any of those gates leaves no dimension folder and no registration behind.

On an unchanged create, Iris reuses the compiler-input fingerprint already produced while recovering external datapacks instead of hashing the same inputs again. Compiler discovery enumerates the canonical Iris authoring-pack and world-snapshot roots directly. It does not recursively scan saved region, entity, POI, or other chunk-storage trees.

## What create actually does

1. Resolve the managed key and dimension. No directory is created yet.
2. Require startup datapack readiness and a loadable validation result for the owning pack.
3. Install datapacks for the dimension types. A changed compiler-input fingerprint does not itself require a restart when the loaded runtime already satisfies every current dimension-type, custom-biome, and biome-tag requirement. A new or changed required registry entry still queues the normal restart.
4. Copy the pack into `<world>/iris/pack` through `StudioSVC.installIntoWorld`, staged into a temp directory and published atomically. Iris may reuse the source's exact validation result only when a strong content fingerprint of the copied snapshot matches the validated source. Otherwise it runs full semantic validation at the new root. A validation failure rolls the publication back. The lifecycle reporter identifies this as the `Preparing world pack` phase; Iris does not emit a separate synthetic snapshot ID such as `overworld:overworld`.
5. Build a `WorldCreator` with the Iris generator and `studio=false`.
6. Create the world through `WorldLifecycleService` / NMS async create, with a 120-second timeout. A timeout triggers a server restart rather than leaving a half-created world.
7. Wait up to 10 minutes for the production generator's initial-spawn future. The actual spawn chunk must resolve and spawn placement must complete on that chunk's owning region. A null chunk future or result, scheduling rejection, generation failure, placement failure, or timeout fails creation. Iris does not register the world, report success, or release lifecycle admission early. Studio and benchmark worlds do not use this production-spawn barrier.
8. Register the world in `bukkit.yml` with the Iris generator, dimension key, and seed. Update the Multiverse link if Multiverse is present. That step has its own 30-second budget and also escalates to a restart.
9. For a player-issued create, resolve a supported collision-free entry position and delegate one asynchronous teleport there. The operation has a 60-second watchdog. Failure cancels the teleport only and retains the created world without requesting a restart.
10. Run creation-time pregen if the caller attached a `PregenTask` through the API.

Rollback phases carry the same 120-second budget.

## Folia runtime creation

Folia follows the same transaction above, but `WorldLifecycleService` requires the Paper-like runtime backend and runs the world mutation through the global region scheduler. It fails closed if that backend is unavailable instead of falling through to Folia's unsupported public `createWorld` path. A successful `/iris create` loads and registers the world in the current process. `/iris replace` remains a manual, batchable restart boundary because replacing an existing world slot is intentionally a cold operation.

A newly built Folia engine publishes its runtime, generation session, running state, and background-task admission before its world-manager thread starts. Runtime creation must not report `Iris lifecycle rejected bukkit_world_manager_loop`, `GenerationSessionException`, or that a newly loaded engine is closing. Those messages indicate an outdated or broken build, not a normal regionized-server transition.

## Exact world-slot replacement

`/iris replace <target> [type=default] [seed=preserve]` puts Iris generation into a slot that already exists, including the vanilla Overworld, Nether, or End. The command aliases are `override` and `overwrite`. It preserves that canonical identity in place, uses lifecycle kind `WORLD_REPLACE`, and always stages for a full restart. There is no live generator swap or old/new chunk merge.

It requires a Paper-family early bootstrap, which plain Spigot never runs. On Spigot the command fails closed. The target dimension folder must already exist. Spigot still supports ordinary `/iris create` for a new managed `iris:*` world.

Accepted targets are safe `iris:*` keys and exactly three canonical vanilla slots: `minecraft:overworld`, `minecraft:the_nether`, and `minecraft:the_end`. Friendly aliases `main`/`overworld`, `nether`/`the_nether`, and `end`/`the_end` resolve to those slots. The selected save's Bukkit aliases `<level-name>`, `<level-name>_nether`, and `<level-name>_the_end` also resolve to those slots and take priority over friendly aliases. Other bare names resolve to `iris:<name>`. A vanilla slot also requires:

- a pack whose environment matches the slot (`NORMAL`, `NETHER`, or `THE_END`), checked both before staging and after install.
- `allow-nether` or `allow-end` enabled in the server config for those two slots.

Foreign namespaces, other `minecraft:*` keys, path traversal, symlinks, and special filesystem entries all fail closed.

With the default `seed=preserve`, replacement preserves the authoritative seed stored in that target's Paper `world_gen_settings.dat`. An explicit `seed=<signed-64-bit-integer>` clones the target's complete current-format settings into the hidden stage and changes only `data.seed`. The retained live target and rollback backup are not modified. Iris never derives one dimension's seed from another dimension or rewrites the current value of `server.properties`.

### Bundled Overworld and Nether pair

For the supported main-world route, initialize both vanilla target folders first and keep `allow-nether=true`, then run these commands on Paper, Purpur, Leaf, or Folia:

```text
/iris download pack=overworld
/iris download pack=underworld
```

Downloads are single-flight, so wait for the Overworld download to finish before starting Underworld, then wait for Underworld to finish. The current built-in packs declare no external datapack imports. Restart once so Minecraft loads the downloaded packs' dimension types and custom biomes.

After the server returns, stage both exact slots:

```text
/iris replace minecraft:overworld type=overworld seed=123456789
/iris replace minecraft:the_nether type=underworld seed=-987654321
```

Restart once after both replacements report staged. A fresh built-in-pair installation therefore crosses two restart boundaries: the first loads the Iris registry data, and the second cold-publishes both replacements together. A custom pack that declares `datapackImports` must complete the explicit workflow in [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks) before staging.

The `type=` values select the Iris pack/dimension. The replacement targets select the Minecraft identities being retained. Each optional `seed=` applies only to that target. There is no main-world, overwrite, force, or portal-routing flag. `override` and `overwrite` are command aliases for `replace`, not behavior switches. After cold publication, vanilla portal mechanics continue to route between `minecraft:overworld` and `minecraft:the_nether`. A separately created or replaced `iris:*` world remains outside that canonical pair.

### How the transaction is made safe

The stage copies and validates a fresh frozen pack on the same filesystem and fingerprints it. It binds a journal to the canonical level root and logical world name. It records the original target, effective world-generation seed, and existing `bukkit.yml` definition. Then it compare-and-swaps that one configuration entry. Several distinct slots with independent effective seeds can be queued before a single restart.

At the next boot, Paper's bootstrap reconciles each authorized transaction before Iris compiles its aggregate datapack and before Minecraft builds registries. It atomically moves the old dimension directory to a retained sibling backup and publishes the stage. The filesystem must support atomic replacement for the world directories, the journal, and `bukkit.yml`. Without it Iris refuses rather than falling back to a destructive move.

Publication retains Paper's per-world `data/paper/metadata.dat` and `data/paper/level_overrides.dat`. It uses a verified clone of `data/minecraft/world_gen_settings.dat`, preserving every current-format field while applying the selected seed to `data.seed`. Old `region`, `entities`, `poi`, and Iris runtime data are never merged. They stay in the backup, and the replacement starts from the staged snapshot.

The backup is only eligible for deletion after `WorldLoad` proves the replacement. That proof is the exact namespaced identity, Iris generator, selected dimension, seed, vanilla-slot environment, and an unchanged pack fingerprint. A failed check journals a rollback and requests another restart. Cold bootstrap then restores the retained directory and the prior `bukkit.yml` entry. A crash between any move, config write, or journal phase is retried idempotently. Finder may create a regular `.DS_Store` file anywhere in the staged pack without invalidating the transaction. Symbolic links, special files, and authored pack changes remain protected and fail closed. Conflicting manual configuration, changed roots or names, changed staged bytes, unsafe storage, or a duplicate or corrupt journal aborts early bootstrap. Iris preserves the artifacts rather than guessing.

### Safe entry after an Overworld replacement

Replacing `minecraft:overworld` also replaces the terrain underneath saved player positions and the old world spawn. Before Iris retires that replacement's entry guard, it generates the new initial-spawn chunk at urgent priority. It searches only inside that Folia-owned chunk for a dry collision-supporting floor with two collision-free, fluid-free body blocks. It applies the result as the canonical world spawn and makes that verified position available for login. The next normal world save confirms persistence before guard retirement; Iris does not force a whole-world save. Water, waterlogged blocks, leaves, powder snow, magma, cactus, and fire are not accepted as the floor or body space. Portals, cobwebs, pointed dripstone, berry bushes, and wither roses are also refused. Other explicit collision hazards are also refused. If no candidate can be verified, Iris keeps the guard active and refuses guarded login instead of guessing an unsafe position.

The staged replacement records every player whose current data file exists in the selected save. On that player's first post-replacement login, Iris leaves a saved Overworld location alone when its replacement chunk already exists and both body blocks are still passable. Iris never generates a missing chunk only to preserve an old coordinate. A missing, slow, failed, or obstructed saved-location check instead redirects the player to the verified safe spawn while preserving yaw and pitch. Cold safe-spawn generation may use the same ten-minute allowance as production-world initial spawn generation, while persistence waits for the normal autosave without holding the login open. After the join succeeds, Iris saves the redirected player data and atomically removes that player's durable receipt. The marker retires only after the world spawn is persisted and every recorded player has either entered safely or logged in from another dimension. A crash or restart cannot turn the one-time rescue into an untracked partial operation. New players also use the verified replacement spawn while the guard is active.

## Studio create

Studio worlds use `IrisCreator.studio(true)` and differ from production worlds in ways that matter:

- Startup datapack validation and the pack's own validation must both be loadable before any Studio folder, snapshot, generator, or Bukkit world is created. Missing validation fails closed.
- The pack is **not** copied into the world folder, except for benchmark runs. The engine reads the live pack directly, which is what enables hotload.
- Studio worlds are transient. They are never written into Iris's persistent world registry. Unloaded Studio worlds are cleaned up, and their `bukkit.yml` entries are removed during shutdown cleanup.
- Standard Studio uses the same engine contract as production generation. With identical pack bytes and seed it generates the same blocks, biomes, structures, and terrain; it does not replace terrain with blank chunks or a landing pad.
- Opening Studio after creating a persistent world from the same pack reuses the already-loaded matching dimension type and custom biomes. The new frozen world snapshot and its `bukkit.yml` LevelStem binding are boot-time persistence inputs. They are not a reason to restart the current server solely to open Studio. New or changed registry content still requires the normal restart boundary.
- Open and close go through the `StudioSVC` transition queue ([10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas)).
- Biome Buffet prepares a changed focus before opening the chunk generation session. Its exclusive fair-stage admission downgrades straight to the retained chunk permit so no other transition can slip in between the focus hotload and that chunk.
- Ordinary Studio activates its native structure state, then delegates the fixed spectator anchor directly to Paper's asynchronous teleport. Iris performs no entry-area precompute, separate chunk request, or surface lookup.
- A failed open cleans up its transient world immediately unless a terminal server lifecycle operation is already active. In that case Iris queues any materialized transient state for startup deletion instead of competing for the live lifecycle lease.

## Load

`/iris load` (alias `/iris import`) reconciles a world that already exists on disk:

1. Parse the managed key and require the dimension root directory to exist.
2. Run `BukkitWorldReconciler.loadWorld(bukkit.yml, worldKey)`.
3. Report success, busy, restart-required, or failure.

Load never downloads a pack. The world must already have `iris/pack` content and registration data consistent with Iris. Reconciliation checks startup readiness and then lazily validates that world's exact snapshot root before it touches `bukkit.yml` or calls a world backend. Validation results are path-scoped, so two worlds whose snapshot folders are both named `pack` cannot authorize or reject one another.

## Unload

`/iris unload` runs synchronously from a player origin:

1. Require an Iris world and acquire the `WORLD_UNLOAD` lease.
2. Mark the world for maintenance.
3. `IrisToolbelt.evacuateAsync` → `WorldLifecycleService.unloadAsync(world, true)` → `generator.closeAsync()`.
4. On a 150-second terminal timeout, mark the timeout, request a server restart, and fail the future.

There are two timers in play. The inner `WorldLifecycleService` unload has its own 120-second budget. The command wraps the whole sequence in the 150-second ceiling.

Wait for `/iris unload` to finish before moving, replacing, or deleting a world. If unloading fails, Iris leaves the world and its generator active.

On a true server stop, Iris first drains Jigsaw Studio autosaves while Paper's region access is still available. It then quiesces its own producers. Generators, generation-facing services, and shared pools stay alive while Paper closes the world and drains its chunk system. Destructive generator teardown and final Mantle persistence begin only after that authoritative boundary. Already-queued Paper generation cannot encounter a closed Mantle. It also cannot meet a generator that has started rejecting generation stages.

## Evacuate

`/iris evacuate <world>` moves every player out of an Iris world into another loaded world, or kicks them when there is nowhere else to go. It runs as a step inside both unload and removal, and is worth running on its own first so you can see who was affected.

## Remove

`/iris remove <name> [delete=true]` delegates to `IrisWorldRemovalService`, which reports one of 18 statuses.

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

Any status other than `UNREGISTERED`, `DELETED`, or `DELETE_QUEUED` means the registry may have changed without the files being removed. A quarantine directory may still exist. Check the world directory before retrying.

Only safe `iris` namespace dimension paths are mutable. Each phase has a 120-second timeout and can request a restart when it gets stuck.

With `delete=true`, Iris records the exact quarantine name in a durable startup queue **before** moving the directory. A crash mid-delete still gets cleaned up on the next boot. Both immediate cleanup and the startup retry snapshot every directory's direct children before deleting. They reject symlinks and special filesystem entries. They keep the queue entry with the full error when a concurrent writer or filesystem failure leaves content behind.

## Main world and level-root selection

### Bukkit-family

The server's main world is the `minecraft:overworld` dimension inside the save root selected by `server.properties` `level-name`. To make Iris generate that existing main slot, stage this replacement and restart:

```text
/iris replace minecraft:overworld type=overworld seed=123456789
```

The replacement keeps `level-name` unchanged, so the save-wide player data, datapacks, global data, Nether, End, and custom dimensions remain in the same level root. Only the existing Overworld dimension folder, staged seed, and generator registration participate in the journaled replacement. Omit `seed=` to preserve the current Overworld seed.

Iris no longer promotes an `iris:*` world into another level root, copies save-wide data into a new root, or rewrites `server.properties`. The old `main` / `main-world` and `overwrite` / `force` parameters were removed from `/iris create`. `/iris overwrite` is now an alias of the separate replacement command. Selecting a fresh whole-save `level-name` is a server-provisioning operation and must be completed outside Iris before managing dimensions in that save.

### Fabric / Forge / NeoForge

Install and registry-load the pack before changing the vanilla main world. Then stage the pack's world preset and restart cleanly:

```text
/iris world mainworld overworld 1337
```

This is the command that changes the actual `minecraft:overworld` generator. It writes the Iris preset to `server.properties` `level-type`, stores the selection in `config/irisworldgen/modded.json`, and places a pending marker. During the next early boot Iris moves the prior vanilla Overworld, Nether, End, `level.dat`, and `level.dat_old` into `config/irisworldgen/mainworld-recovery-<id>/`, then Minecraft creates fresh vanilla slots from the selected Iris preset. Save-wide player data, advancements, statistics, datapacks, the Iris persistent-dimension registry, and non-vanilla dimension folders remain in the selected level root.

`/iris world replace-overworld overworld 1337` is a different operation. It creates a persistent `irisworldgen:primary` dimension and routes players there; it does not replace the generator of `minecraft:overworld`. Use `/iris world mainworld off` to stop forcing the preset on later boots. That command does not restore the quarantined vanilla terrain or change the generator already recorded in the current save.

After the replacement restart, require the selected preset in `server.properties`, a non-empty `<level-name>/dimensions/minecraft/overworld/data/minecraft/world_gen_settings.dat`, the expected custom entries in `<level-name>/iris/iris-dimensions.json`, and a second clean restart without another pending marker. Keep the recovery directory until the new main world and every retained dimension have been verified.

## Modded persistent-dimension registry

Fabric, Forge, and NeoForge persist dynamic Iris worlds in `<world-root>/iris/iris-dimensions.json`:

```json
{
  "dimensions": [
    { "id": "irisworldgen:myworld", "pack": "overworld", "dimension": "overworld", "seed": 1337 }
  ]
}
```

All four fields are required per entry. `id` is the registered dimension id. `pack` is the installed pack folder. `dimension` is its dimension load key. `seed` is the generation seed. Writes go to a sibling `iris-dimensions.json.tmp`, get an fsync, and are moved into place with `ATOMIC_MOVE` where the filesystem supports it.

Entries that are individually invalid are logged, kept verbatim, and re-appended on the next write. Iris never silently drops one. Duplicate ids keep the first valid entry and warn.

If the whole file fails to parse, only the startup load path quarantines it as `iris-dimensions.json.broken-<timestamp>`. It salvages whatever ids it can from the raw text into the log. It continues with no persistent Iris dimensions. Every other code path throws rather than discard persistent worlds. Keep the quarantined file, recreate each reported world with `/iris world create`, verify pack, dimension, and seed, then delete the backup.

Runtime enable and removal publish each loader's normal level lifecycle. Fabric fires `ServerLevelEvents.LOAD` and `UNLOAD`; Forge and NeoForge post `LevelEvent.Load` and `Unload`. Unload is published before Iris unbinds and removes the dynamic level. If removal fails after that boundary and Iris restores the retained level, rollback publishes the matching load event again.

## Pack snapshot vs studio

| Operation | Effect on the pack |
|---|---|
| Production create | Full pack tree installed under the world's `iris/pack` and frozen there |
| Studio open | Engine reads the live packs root. Nothing is installed into the world |
| Bukkit `/iris pack package`; modded `/iris studio package` | Exports an archive. No world is touched |
| `/iris dev update-world` | Replaces a world's `iris/pack`. Unsafe, and restarts the server if an engine still holds that pack |
| Hotload | Studio only. A production snapshot never changes underneath a running world |

## Concurrent lifecycle guards

`LifecycleOperationCoordinator` is a **single global mutex** shared by the `WORLD_MUTATION` and `PACK_MUTATION` domains. It is not one lock per domain: a pack download or publish will make a world create report busy, and vice versa. A third domain, `SERVER_LIFECYCLE`, is reserved and cannot be acquired.

Twelve operation kinds run under it: `WORLD_CREATE`, `WORLD_LOAD`, `WORLD_UNLOAD`, `WORLD_REMOVE`, `WORLD_REPLACE`, `STUDIO_OPEN`, `STUDIO_CLOSE`, `PACK_CREATE`, `PACK_DOWNLOAD`, `PACK_PUBLISH`, `DATAPACK_COMPILE`, and `SERVER_RESTART`.

Ordinary create also refuses when the dimension root already exists or the world is already loaded. Exact replacement runs as a separately journaled restart transaction and never relaxes the removal-path protections.
