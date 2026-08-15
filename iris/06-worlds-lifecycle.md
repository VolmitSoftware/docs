---
title: "Worlds & Lifecycle"
description: "Iris documentation: Worlds & Lifecycle"
published: true
date: 2026-08-15T21:07:31.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Creating an Iris world copies the pack into the world folder, registers the world so the server rebuilds it on every boot, and hands generation to the Iris engine. This page covers the full lifecycle on Bukkit-family servers and on Fabric, Forge, and NeoForge: create, load, unload, remove, and cold replacement of an existing world slot. Iris worlds are managed under the level root as `dimensions/iris/<key>/` on Bukkit; mod loaders keep theirs in `iris-dimensions.json`.

See also: [02 - Getting Started](/iris/02-getting-started), [04 - Commands & Permissions](/iris/04-commands-permissions), [05 - Concepts & Pack Layout](/iris/05-concepts-pack-layout), [07 - Pregeneration](/iris/07-pregeneration), [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas), [30 - Platform Differences](/iris/30-platform-differences).

## Create a world you intend to keep

The difference between a throwaway world and one you will still be running in six months is that you decide the pack, seed, and height **before** the first chunk generates. None of those are editable afterwards without regenerating terrain.

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
/iris create release_candidate type=overworld seed=1337
```

On Folia, this stages files and automatically requests a controlled restart after staging succeeds. Wait for the server to return, then the world loads on boot. On every other Bukkit-family server the world is created immediately.

```text
/iris worlds
/iris tp release_candidate
```

**Success looks like:** `release_candidate` appears in `/iris worlds` as a loaded Iris world, you spawn in it, and chunks generate as you fly.

When a player runs the create command, Iris waits up to 60 seconds for the entry chunk, a safe position, and the automatic teleport. A failure or timeout is non-terminal: Iris cancels only that entry attempt, keeps the successfully created world loaded and registered, and does not request a restart. Wait for initial generation to settle and run `/iris tp release_candidate` again.

Now prove it survives a restart, because a world that only works in the session that created it is not actually created:

```text
/iris pregen start 352 world=release_candidate center=0,0 gui=false
```

Wait for it to finish (see [07 - Pregeneration](/iris/07-pregeneration)), restart the server cleanly, teleport back in, and fly past the pregenerated boundary. New terrain must still appear.

**The world is now committed.** It generates from `<world>/iris/pack`, its own frozen copy. Continuing to edit `packs/overworld/` affects Studio only. Never delete or replace that snapshot while the world is loaded. To ship pack changes into it later, use the deliberate path in [25 - Pack Management](/iris/25-pack-management); for anything that changes height or dimension type, create a new world instead.

### Fabric / Forge / NeoForge

```text
/iris pack validate overworld
/iris world enable irisworldgen:release_candidate overworld 1337
/iris world status
/iris tp irisworldgen:release_candidate
```

The seed argument is optional and defaults to `1337`. `enable` also accepts the alias `create`, and the whole group is reachable as `/iris w`.

```text
/iris pregen start 352 irisworldgen:release_candidate at 0 0
```

Restart the server when it finishes.

**Success looks like:** `/iris world status` lists the same dimension with the same pack after restart, and `/iris info irisworldgen:release_candidate` as a gamemaster reports seed `1337` read back from `iris-dimensions.json`.

From here, `/iris world disable <dimension>` unloads it and keeps the files; `/iris world delete <dimension>` is the destructive path. Both require the dimension argument.

## Remove a world without losing anything else

Removal is the operation most likely to cost you data, so the order matters.

1. **Back up first.** Nothing below is undoable.
2. **Get everyone out.** `/iris evacuate <world>` moves players to another loaded world, or kicks them if there is nowhere to go. Removal does this for you, but doing it deliberately means you see who was in there.
3. **Unload it.** `/iris unload <world>`. This marks the world for maintenance, evacuates, unloads through the lifecycle service, and closes the generator.
4. **Remove it.** `/iris remove <world>` deletes the files. `/iris remove <world> delete=false` keeps them and only unregisters — use this when you want the directory back later.
5. **Read the status Iris prints.** It tells you what actually happened; see the status table below.

**Success looks like:** `UNREGISTERED` (files kept) or `DELETED` (files gone), the world is absent from `/iris worlds`, and its directory under `<levelRoot>/dimensions/iris/` matches what you asked for.

`DELETE_QUEUED` means the files could not be deleted now and were quarantined for deletion at next startup. Restart and confirm the target is gone before reusing that name.

On mod loaders the equivalent is `/iris world delete <dimension>`, which disables and then wipes chunk and mantle data.

### If unload hangs

Unload has a hard 150-second ceiling. If the world, generator, or scheduler work has not settled by then, Iris marks a terminal timeout, requests a server restart, and fails the command. Let the restart happen. Do not delete a live world directory to force the issue.

## Lifecycle recovery

| Symptom | What it means | What to do |
|---|---|---|
| "busy" response | Another lifecycle operation holds the coordinator. It is one global mutex, so a pack download or publish blocks world create just as much as another create does | Wait for the running operation. Retrying concurrently will not help |
| Startup validation pending / failed / restart-required on login or create | External datapack ingestion or dimension-pack validation has not reached a safe state | Fix the first logged failure, or complete the requested restart. Do not hand-create world folders or hand-edit `bukkit.yml` |
| Folia create succeeded but teleport says no such world | Folia create only stages files and registration | Restart, then load or teleport |
| Create reports that automatic teleport failed | The world was created, but the 60-second entry attempt failed, returned false, or did not finish | The world remains valid and no restart is requested solely for this failure. Wait for initial generation, then run `/iris tp <world>` |
| Load reports missing or inconsistent data | The dimension root, the `bukkit.yml` registration, or the `iris/pack` snapshot is incomplete | Keep the directory and restore from backup. Load never re-downloads a snapshot |
| Unload hits its terminal timeout | Work did not drain in 150 s | Allow the restart. Do not force-delete the live directory |
| Remove returns `DELETE_QUEUED` | Files were quarantined for startup deletion | Restart, confirm the target is gone, then reuse the name |
| Modded registry renamed to `.broken-<timestamp>` | The whole `iris-dimensions.json` failed to parse | Keep the backup. Iris logs whatever ids it could salvage from the raw text; recreate each with its original pack, dimension, and seed, then verify with `/iris world status` |

## Identity and storage

| Item | Rule |
|---|---|
| Managed namespace | The safe/managed API accepts `iris` only, so create, load, and remove can never touch a `minecraft:` or third-party dimension folder |
| Logical name | For `iris:foo` the logical name is `foo` — that is what you type in commands |
| Storage root | `Server#getLevelDirectory` on Paper. If that method is missing, Iris latches a permanent fallback to `<world-container>/<level-name>` read from `server.properties` (default `world`) |
| Dimension folder | `<levelRoot>/dimensions/iris/<key>/` |
| Pack snapshot | `<dimensionRoot>/iris/pack/` |
| Pregen cache | `<dimensionRoot>/iris/pregen/` |
| Registry | `<level-root>/iris/worlds.json` (a save-scoped flat `worldIdentity → dimensionType` map, written atomically) plus the global `worlds:` section of `bukkit.yml`, which stores `generator: "Iris:<dimension>"` and the seed |
| Name normalization | The name is lowercased and spaces become `_` before validation, so `My World` becomes `my_world` rather than being rejected |
| Name constraints | After normalization the key must match `[a-z0-9_-]+`; `/`, `\`, and `..` are rejected as unsafe path segments, and symlinks on any component of the dimension root are refused |
| Reserved names | `/iris create` rejects `iris` and `benchmark` case-insensitively. This is a create-time check only; the storage layer does not enforce it |

The vanilla main, Nether, and End worlds have the canonical keys `minecraft:overworld`, `minecraft:the_nether`, and `minecraft:the_end`. They are not Iris-managed dimension folders and are only reachable through the exact-slot replacement path below.

Paper's startup configuration name is separate from both identity and display name. An `iris:moon` dimension in level root `world` is displayed as `moon`, stored at `world/dimensions/iris/moon`, and bound in `bukkit.yml` as `world_iris_moon`. Iris parses that startup name back to the canonical key. Because `bukkit.yml` is server-global, Iris only imports entries whose exact canonical dimension directory is a real non-symlink directory in the currently selected level root; switching `level-name` cannot silently reinterpret another save's Iris registry.

Only that exact current-format startup name is accepted. Iris does not migrate, translate, or rewrite former short custom-world entries; noncanonical entries are ignored.

## Command surface (Bukkit)

| Command | What it does |
|---|---|
| `/iris create <name> [type=default] [seed=1337]` | Create an absent managed `iris:*` world now, or stage it for Folia's next boot |
| `/iris replace <target> [type=default] [seed=preserve]` | Stage a cold replacement of an existing safe Iris world or exact vanilla dimension slot; aliases `override`, `overwrite` |
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
| `name` (`world-name`) | required | Becomes `iris:<logical>`; create never resolves a vanilla dimension slot |
| `type` (`dimension`, `pack`) | `default` | Which pack and dimension to generate from. `default` resolves to `settings.generator.defaultWorldType` (`overworld`); otherwise a pack name or `pack:dimensionKey` |
| `seed` | `1337` | The new managed world's seed |

Create refuses to run on the primary thread. Before it takes a lifecycle lease it requires startup datapack validation to be ready and the chosen pack to have a loadable validation result; then the `WORLD_MUTATION` / `WORLD_CREATE` lease must be free or the command fails busy. A refusal at any of those gates leaves no dimension folder and no registration behind.

On an unchanged create, Iris reuses the compiler-input fingerprint already produced while recovering external datapacks instead of hashing the same inputs again. Compiler discovery enumerates the canonical Iris authoring-pack and world-snapshot roots directly; it does not recursively scan saved region, entity, POI, or other chunk-storage trees.

## What create actually does (non-Folia)

1. Resolve the managed key and dimension. No directory is created yet.
2. Require startup datapack readiness and a loadable validation result for the owning pack.
3. Install datapacks for the dimension types. If the types are not loaded yet, queue a restart.
4. Copy the pack into `<world>/iris/pack` through `StudioSVC.installIntoWorld` — staged into a temp directory and published atomically. Iris may reuse the source's exact validation result only when a strong content fingerprint of the copied snapshot matches the validated source; otherwise it runs full semantic validation at the new root. A validation failure rolls the publication back.
5. Build a `WorldCreator` with the Iris generator and `studio=false`.
6. Create the world through `WorldLifecycleService` / NMS async create, with a 120-second timeout. A timeout triggers a server restart rather than leaving a half-created world.
7. Register the world in `bukkit.yml` with the Iris generator, dimension key, and seed. Update the Multiverse link if Multiverse is present — that step has its own 30-second budget and also escalates to a restart.
8. For a player-issued create, request the entry chunk and safe location, then attempt the automatic teleport. This step has a 60-second limit; failure cancels the teleport only and retains the created world without requesting a restart.
9. Run creation-time pregen if the caller attached a `PregenTask` through the API.

Rollback phases carry the same 120-second budget.

## Folia staging

Folia cannot create worlds at runtime, so `/iris create` becomes a staging operation:

1. Require startup datapack readiness and a loadable pack validation result.
2. Acquire the `WORLD_CREATE` lease.
3. Install datapacks if they changed.
4. Abort if the dimension folder already exists.
5. Build a hidden sibling stage in Paper 26.2's current per-dimension format. Iris copies the selected save's Overworld `world_gen_settings.dat` and replaces only its authoritative `data.seed`, then uses Paper's own saved-data codecs to write a fresh world UUID and uninitialized level overrides from the live root data. On Folia, only that small live-data snapshot runs on the global region thread; encoding, validation, and filesystem I/O remain on the asynchronous command worker.
6. Freeze and validate the selected Iris pack inside that complete stage.
7. Atomically publish the stage only while the exact `dimensions/iris/<key>` target remains absent, then register its canonical Paper startup name `<level-name>_iris_<key>` in `bukkit.yml`. Registration failure rolls the published target back.
8. Report successful staging, release the lifecycle lease, and automatically request a controlled restart. During that boot, the aggregate Iris datapack emits the matching `iris:<key>` LevelStem before Paper loads the world. The published directory is already complete current-format storage, so Paper does not enter a legacy or vanilla-import migration path.

`WorldLifecycleStaging` holds the staged generator and biome provider for the backend that picks them up at load.

Iris dispatches the server's restart command only after the frozen pack, world files, and `bukkit.yml` entry have all succeeded. The restart waits for active lifecycle work to drain and falls back to stopping the server if the restart command does not complete. Iris cannot launch a new JVM itself: configure a restart script or external supervisor, or start the stopped server manually. Failed staging does not request a restart. `/iris replace` remains a manual, batchable restart boundary so several distinct slots can be staged before one restart.

## Exact world-slot replacement

`/iris replace <target> [type=default] [seed=preserve]` puts Iris generation into a slot that already exists, including the vanilla Overworld, Nether, or End. The command aliases are `override` and `overwrite`. It preserves that canonical identity in place, uses lifecycle kind `WORLD_REPLACE`, and always stages for a full restart. There is no live generator swap or old/new chunk merge.

It requires a Paper-family early bootstrap, which plain Spigot never runs; on Spigot the command fails closed. The target dimension folder must already exist — ordinary create is still the path for a new world.

Accepted targets are safe `iris:*` keys and exactly three canonical vanilla slots: `minecraft:overworld`, `minecraft:the_nether`, and `minecraft:the_end`. Friendly aliases `main`/`overworld`, `nether`/`the_nether`, and `end`/`the_end` resolve to those slots. The selected save's Bukkit aliases `<level-name>`, `<level-name>_nether`, and `<level-name>_the_end` also resolve to those slots and take priority over friendly aliases; other bare names resolve to `iris:<name>`. A vanilla slot additionally requires:

- a pack whose environment matches the slot (`NORMAL`, `NETHER`, or `THE_END`), checked both before staging and after install;
- `allow-nether` or `allow-end` enabled in the server config for those two slots.

Foreign namespaces, other `minecraft:*` keys, path traversal, symlinks, and special filesystem entries all fail closed.

With the default `seed=preserve`, replacement preserves the authoritative seed stored in that target's Paper `world_gen_settings.dat`. An explicit `seed=<signed-64-bit-integer>` clones the target's complete current-format settings into the hidden stage and changes only `data.seed`; the retained live target and rollback backup are not modified. Iris never derives one dimension's seed from another dimension or rewrites the current value of `server.properties`.

### Shipping Overworld and Nether pair

For the supported main-world route, initialize both vanilla target folders first and keep `allow-nether=true`, then run these commands on Paper, Purpur, Leaf, or Folia:

```text
/iris download pack=overworld
/iris download pack=underworld
```

Downloads are single-flight, so wait for the Overworld download to finish before starting Underworld, then wait for Underworld to finish. The shipping Overworld declares no external datapacks and uses Minecraft's registered vanilla structures. Manually restart once so the downloaded packs' dimension types and custom biomes enter the live registries.

After the server returns, stage both exact slots:

```text
/iris replace minecraft:overworld type=overworld seed=123456789
/iris replace minecraft:the_nether type=underworld seed=-987654321
```

Restart once after both replacements report staged. A fresh install therefore has one downloaded-pack registration restart followed by one replacement-publication restart; both replacements still publish together in the second cold reconcile. If a customized pack declares `datapackImports`, complete the optional workflow in [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks) before staging it.

The `type=` values select the Iris pack/dimension; the replacement targets select the Minecraft identities being retained; and each optional `seed=` applies only to that target. There is no main-world, overwrite, force, or portal-routing flag. `override` and `overwrite` are command aliases for `replace`, not behavior switches. After cold publication, vanilla portal mechanics continue to route between `minecraft:overworld` and `minecraft:the_nether`; a separately created or replaced `iris:*` world remains outside that canonical pair.

### How the transaction is made safe

The stage copies and validates a fresh frozen pack on the same filesystem, fingerprints it, binds a journal to the canonical level root and logical world name, records the original target, effective world-generation seed, and existing `bukkit.yml` definition, then compare-and-swaps that one configuration entry. Several distinct slots with independent effective seeds can be queued before a single restart.

At the next boot, Paper's bootstrap reconciles each authorized transaction before Iris compiles its aggregate datapack and before Minecraft builds registries: it atomically moves the old dimension directory to a retained sibling backup and publishes the stage. The filesystem must support atomic replacement for the world directories, the journal, and `bukkit.yml`; without it Iris refuses rather than falling back to a destructive move.

Publication retains Paper's per-world `data/paper/metadata.dat` and `data/paper/level_overrides.dat`. It uses a verified clone of `data/minecraft/world_gen_settings.dat`, preserving every current-format field while applying the selected seed to `data.seed`. Old `region`, `entities`, `poi`, and Iris runtime data are never merged — they stay in the backup, and the replacement starts from the staged snapshot.

The backup is only eligible for deletion after `WorldLoad` proves the exact namespaced identity, Iris generator, selected dimension, seed, vanilla-slot environment, and an unchanged pack fingerprint. A failed check journals a rollback and requests another restart, after which cold bootstrap restores the retained directory and the prior `bukkit.yml` entry. A crash between any move, config write, or journal phase is retried idempotently. Finder may create a regular `.DS_Store` file anywhere in the staged pack without invalidating the transaction; symbolic links, special files, and authored pack changes remain protected and fail closed. Conflicting manual configuration, changed roots or names, changed staged bytes, unsafe storage, or a duplicate or corrupt journal aborts early bootstrap and preserves the artifacts rather than guessing.

## Studio create

Studio worlds use `IrisCreator.studio(true)` and differ from production worlds in ways that matter:

- Startup datapack validation and the pack's own validation must both be loadable before any Studio folder, snapshot, generator, or Bukkit world is created. Missing validation fails closed.
- The pack is **not** copied into the world folder, except for benchmark runs. The engine reads the live pack directly, which is what enables hotload.
- Studio worlds are transient. Unloaded Studio worlds are cleaned up, and their `bukkit.yml` entries are removed during shutdown cleanup.
- Open and close go through the `StudioSVC` transition queue ([10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas)).
- Biome Buffet prepares a changed focus before opening the chunk generation session; its exclusive fair-stage admission downgrades straight to the retained chunk permit so no other transition can slip in between the focus hotload and that chunk.
- Ordinary Studio suppresses native structure starts only while the initial FULL entry chunk loads, then restores them for later preview chunks.
- A failed open never unloads or closes the generator while that asynchronous entry request is still active. Another Studio open is rejected in the meantime; cleanup starts once it settles, and if it is still active 120 seconds later the transient world is queued for deletion at the next clean startup.

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

There are two timers in play: the inner `WorldLifecycleService` unload has its own 120-second budget, and the command wraps the whole sequence in the 150-second ceiling.

`WorldUnloadEvent` stops Iris engine maintenance immediately, but Iris does not treat it as proof that Paper's chunk scheduler has drained. Generator close waits for the raw world-lifecycle backend to confirm a successful unload, and the 26.2 noise pipeline holds one generation lease through terrain generation and worldgen-heightmap priming.

On a true server stop, Iris first drains Jigsaw Studio autosaves while Paper's region access is still available, then quiesces its own producers but keeps generators, generation-facing services, and shared pools alive while Paper closes the world and drains its chunk system. Destructive generator teardown and final Mantle persistence begin only after that authoritative boundary, so already-queued Paper generation cannot encounter a closed Mantle or a generator that has started rejecting generation stages.

## Evacuate

`/iris evacuate <world>` moves every player out of an Iris world into another loaded world, or kicks them when there is nowhere else to go. It runs as a step inside both unload and removal, and is worth running on its own first so you can see who was affected.

## Remove

`/iris remove <name> [delete=true]` delegates to `IrisWorldRemovalService`, which reports one of 18 statuses.

| Status | Meaning |
|---|---|
| `UNREGISTERED` | Unloaded and unregistered; files kept. This is success for `delete=false` |
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
| `GENERATOR_CLOSE_FAILED` | The Iris generator did not close cleanly; the world may still hold resources |
| `UNLOAD_FAILED` | The server refused or failed to unload the world |
| `CONFIGURATION_FAILED` | The `bukkit.yml` entry could not be updated |
| `REGISTRY_FAILED` | The `worlds.json` registry could not be updated |
| `QUARANTINE_FAILED` | The world directory could not be moved to the quarantine name |
| `DELETE_FAILED` | Quarantine succeeded but deletion did not |
| `INTERNAL_FAILURE` | An unexpected error; read the logged cause |

Any status other than `UNREGISTERED`, `DELETED`, or `DELETE_QUEUED` means the registry may have changed without the files being removed, and a quarantine directory may still exist. Check the world directory before retrying.

Only safe `iris` namespace dimension paths are mutable. Each phase has a 120-second timeout and can request a restart when it gets stuck.

With `delete=true`, Iris records the exact quarantine name in a durable startup queue **before** moving the directory, so a crash mid-delete still gets cleaned up on the next boot. Both immediate cleanup and the startup retry snapshot every directory's direct children before deleting, reject symlinks and special filesystem entries, and keep the queue entry with the full error when a concurrent writer or filesystem failure leaves content behind.

## Main world and level-root selection

The server's main world is the `minecraft:overworld` dimension inside the save root selected by `server.properties` `level-name`. To make Iris generate that existing main slot, stage this replacement and restart:

```text
/iris replace minecraft:overworld type=overworld seed=123456789
```

The replacement keeps `level-name` unchanged, so the save-wide player data, datapacks, global data, Nether, End, and custom dimensions remain in the same level root. Only the existing Overworld dimension folder, staged seed, and generator registration participate in the journaled replacement. Omit `seed=` to preserve the current Overworld seed.

Iris no longer promotes an `iris:*` world into another level root, copies save-wide data into a new root, or rewrites `server.properties`. The old `main` / `main-world` and `overwrite` / `force` parameters were removed from `/iris create`; `/iris overwrite` is now an alias of the separate replacement command. Selecting a fresh whole-save `level-name` is a server-provisioning operation and must be completed outside Iris before managing dimensions in that save.

## Modded persistent-dimension registry

Fabric, Forge, and NeoForge persist dynamic Iris worlds in `<world-root>/iris/iris-dimensions.json`:

```json
{
  "dimensions": [
    { "id": "irisworldgen:myworld", "pack": "overworld", "dimension": "overworld", "seed": 1337 }
  ]
}
```

All four fields are required per entry: `id` is the registered dimension id, `pack` is the installed pack folder, `dimension` is its dimension load key, and `seed` is the generation seed. Writes go to a sibling `iris-dimensions.json.tmp`, get an fsync, and are moved into place with `ATOMIC_MOVE` where the filesystem supports it.

Entries that are individually invalid are logged, kept verbatim, and re-appended on the next write — Iris never silently drops one. Duplicate ids keep the first valid entry and warn.

If the whole file fails to parse, only the startup load path quarantines it as `iris-dimensions.json.broken-<timestamp>`, salvages whatever ids it can from the raw text into the log, and continues with no persistent Iris dimensions. Every other code path throws rather than discard persistent worlds. Keep the quarantined file, recreate each reported world with `/iris world create`, verify pack, dimension, and seed, then delete the backup.

## Pack snapshot vs studio

| Operation | Effect on the pack |
|---|---|
| Production create | Full pack tree installed under the world's `iris/pack` and frozen there |
| Studio open | Engine reads the live packs root; nothing is installed into the world |
| `/iris studio package` | Exports an archive; no world is touched |
| `/iris dev update-world` | Replaces a world's `iris/pack`. Unsafe, and restarts the server if an engine still holds that pack |
| Hotload | Studio only. A production snapshot never changes underneath a running world |

## Concurrent lifecycle guards

`LifecycleOperationCoordinator` is a **single global mutex** shared by the `WORLD_MUTATION` and `PACK_MUTATION` domains. It is not one lock per domain: a pack download or publish will make a world create report busy, and vice versa. A third domain, `SERVER_LIFECYCLE`, is reserved and cannot be acquired.

Twelve operation kinds run under it: `WORLD_CREATE`, `WORLD_LOAD`, `WORLD_UNLOAD`, `WORLD_REMOVE`, `WORLD_REPLACE`, `STUDIO_OPEN`, `STUDIO_CLOSE`, `PACK_CREATE`, `PACK_DOWNLOAD`, `PACK_PUBLISH`, `DATAPACK_COMPILE`, and `SERVER_RESTART`.

Ordinary create also refuses when the dimension root already exists or the world is already loaded. Exact replacement runs as a separately journaled restart transaction and never relaxes the removal-path protections.
