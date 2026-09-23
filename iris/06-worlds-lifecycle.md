---
title: "Worlds & Lifecycle"
description: "Iris documentation: Worlds & Lifecycle"
published: true
date: 2026-09-23T10:46:58.590Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Use Iris commands to create, load, unload, update, and remove worlds. Back up the complete world before updating, replacing, or deleting it. If a command reports that Iris is busy, wait for the current operation to finish.

## Create a world

### Bukkit-family

Install and validate the pack, then choose a world name and seed:

```text
/iris pack validate pack=overworld
/iris create name=myworld type=overworld seed=1337
/iris worlds
/iris tp myworld
```

| Parameter | Default | Use |
|---|---|---|
| `name` | Required | New world name; use letters, numbers, `_`, or `-` |
| `type` | `generator.defaultWorldType` | Installed pack name or `pack:dimensionKey` |
| `seed` | `1337` | World generation seed |

Names are lowercased and spaces become underscores. `iris` and `benchmark` are reserved. Creation requires an unused world name.

Creation reuses validation for unchanged packs and automatically checks changed content or validation settings before generation. It prepares the entry area’s hydrology before generating its terrain, reusing matching saved plans when available. On Bukkit, initial entry automatically uses multicore generation. A player who creates a world is teleported into it. If automatic teleport fails, the world remains loaded; wait for initial generation and use `/iris tp <world>` again. Complete any restart Iris requests before using the world.

You can preview a pack before creating a permanent world:

```text
/iris studio open overworld seed=1337
/iris studio close
```

Studio worlds are temporary. Keep your edits in the pack folder. See [Studio & VSCode Schemas](/iris/10-studio-vscode-schemas).

### Fabric, Forge, and NeoForge

Install the pack and restart before creating its dimension. For custom packs with external datapacks, follow [Native Structures & Datapacks](/iris/22-native-structures-datapacks) first.

```text
/iris pack validate overworld
/iris world enable irisworldgen:myworld overworld 1337
/iris world status
/iris tp irisworldgen:myworld
```

`enable` also accepts the alias `create`. The seed is optional and defaults to `1337`; the command group also accepts `/iris w`.

## Load, unload, and remove

### Bukkit-family

| Command | Action |
|---|---|
| `/iris worlds` | List loaded worlds |
| `/iris tp <world> [player=<name>]` | Teleport yourself or another player to the world's spawn |
| `/iris load <name>` | Load an existing Iris world from disk; alias `/iris import` |
| `/iris evacuate <world>` | Move its players to another loaded world, or disconnect them if none is available |
| `/iris unload <world>` | Unload the world and evacuate its players; keep its files |
| `/iris remove <name> delete=false` | Unload and unregister the world; keep its files |
| `/iris remove <name>` | Unregister the world and delete its files |

Loading requires the world's saved pack and registration data. Restore the complete backup if these are missing. Unloading and server shutdown wait for admitted generation and river planning to finish before releasing the world's generation data. Iris verifies the world's saved generation state before generation resumes. Chunk generation remains paused until these startup checks finish. Startup checks adapt to the server's available processors and Java heap without additional configuration; existing terrain remains unchanged.

> `/iris remove` deletes world data by default. Back up first, and wait for unload or removal to finish before moving or deleting any world directory. If Iris requests a restart, complete it before retrying.
{.is-warning}

Removal reports `UNREGISTERED` when files are kept and `DELETED` when they are deleted. `DELETE_QUEUED` means deletion will finish at startup; restart and confirm the directory is gone before reusing the name. For any failure, check the reported result before retrying.

### Fabric, Forge, and NeoForge

```text
/iris world disable irisworldgen:myworld
/iris world delete irisworldgen:myworld
```

`disable` unloads the dimension and keeps its files. `delete` removes its terrain and Iris world data. Back up before deleting.

## Update a world's pack

Validate and preview the edited pack, then back up the complete world. On Bukkit:

```text
/iris pack update-world world=myworld pack=overworld confirm=true
```

On Fabric, Forge, or NeoForge:

```text
/iris world update irisworldgen:myworld overworld
```

Restart to apply the update. Editing the installed pack alone does not update a production world. See [Pack Management](/iris/25-pack-management).

## Generation updates and retained terrain

Pack updates affect newly generated chunks. Existing terrain remains unchanged, including when you select an older pack again. `generator.generationTransitionWidthBlocks` controls the transition width between old and new terrain; large terrain changes can still leave visible seams.

The world seed, height bounds, logical height, environment, dimension type, and coordinate scale cannot change through a pack update. Create a new world for those changes. New custom biomes or other registry content may require a restart.

### Retained world data

Back up the complete dimension directory, including `iris/generation`. Keep the saved pack definitions with the terrain they generated; do not edit or delete files inside the world's generation history.

Older chunks without a recorded biome identity may report that biome information is unavailable.

## World folders and backups

| Data | Location |
|---|---|
| Paper-family Iris world | `<levelRoot>/dimensions/iris/<name>/` |
| Spigot Iris world | `<world-container>/<level-name>_iris_<name>/dimensions/iris/<name>/` |
| Saved world packs | `<dimensionRoot>/iris/generation/epochs/<epoch>/pack/` |
| Bukkit world registration | `<level-root>/iris/worlds.json` and the `worlds` section of `bukkit.yml` |
| Modded world registration | `<world-root>/iris/iris-dimensions.json` |

`level-name` in `server.properties` selects the save root. Include the registration files when backing up your server, and stop the server before restoring world files.

## Exact world-slot replacement

On Paper, Purpur, Leaf, or Folia, use `/iris replace` to replace an existing Iris world or a vanilla dimension:

```text
/iris replace minecraft:overworld type=overworld seed=123456789
```

Replacement requires a full restart. The target must already exist. Plain Spigot supports creating new Iris worlds but does not support this replacement command.

| Parameter | Use |
|---|---|
| Target | `iris:<name>`, `minecraft:overworld`, `minecraft:the_nether`, or `minecraft:the_end` |
| `type` | Installed pack or dimension; defaults to `generator.defaultWorldType` |
| `seed` | Omit it to preserve the target's seed, or supply a new signed 64-bit integer |

The pack's environment must match the target. Keep `allow-nether` or `allow-end` enabled when replacing those dimensions. `/iris override` and `/iris overwrite` are aliases of `/iris replace`.

> Replacement starts fresh terrain in the selected dimension. Existing terrain is moved to a sibling backup and is not merged into the replacement. Take your own complete backup before staging, and keep it until you have checked the replacement world.
{.is-warning}

### Bundled Overworld and Nether pair

Start with both vanilla world folders already created and `allow-nether=true`. Download each pack and wait for it to finish before starting the next:

```text
/iris download pack=overworld
/iris download pack=underworld
```

Restart after both downloads finish. Then stage each replacement, waiting for its success message before issuing the next:

```text
/iris replace minecraft:overworld type=overworld seed=123456789
/iris replace minecraft:the_nether type=underworld seed=-987654321
```

Restart again after both replacements are staged. The first restart loads the packs; the second applies the replacements. Vanilla portals continue to connect this Overworld and Nether pair. A separately created `iris:*` world is outside that pair.

After an Overworld replacement, players whose old positions are unsafe or unavailable are moved to the new safe spawn. If Iris cannot establish a safe spawn, it blocks entry and reports the problem.

## Main world on mod loaders

> This replaces the vanilla Overworld, Nether, and End with fresh terrain. Back up the complete save before using it.
{.is-warning}

Install the pack and restart to load it, then run:

```text
/iris world mainworld overworld 1337
```

Restart again to apply it. This replaces the vanilla Overworld, Nether, and End with fresh terrain from the selected preset. The previous terrain is retained under `config/irisworldgen/mainworld-recovery-<id>/`. Keep that directory and your complete backup until you have checked the new worlds. Player data, advancements, statistics, datapacks, and non-vanilla dimensions remain in the save.

`/iris world mainworld off` stops forcing the preset on later boots; it does not restore previous terrain. `/iris world replace-overworld overworld 1337` instead creates a separate `irisworldgen:primary` dimension and sends players there.

See [Commands & Permissions](/iris/04-commands-permissions) for access requirements and [Pregeneration](/iris/07-pregeneration) to generate terrain before players explore it.
