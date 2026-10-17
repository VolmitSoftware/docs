---
title: "Uninstalling Iris"
description: "Remove Iris with its worlds, datapacks, and files, or reinstall it from a clean state"
published: true
date: 2026-10-17T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-10-17T00:00:00.000Z
---
These steps remove Iris and the worlds, datapacks, and files it created from a Bukkit-family server, a Fabric, Forge, or NeoForge server, or a client. Only Iris can generate an Iris world, so remove or replace those worlds before you delete the jar. To reinstall without any earlier state, see [Starting fresh](#starting-fresh).

> Uninstalling deletes every Iris world, its terrain, and the packs you installed or wrote. Stop the server and back up the complete server folder, including every world and the Iris data folder, before you start.
{.is-danger}

`<level-root>` is the world folder named by `level-name` in `server.properties`, `world` by default. On Fabric, Forge, and NeoForge it is the save folder, and `config/` is the loader's configuration folder. [Installation & Platforms](/iris/01-installation-platforms#data-directories) and [Worlds & Lifecycle](/iris/06-worlds-lifecycle#world-folders-and-backups) describe these locations.

## Bukkit-family servers

These steps apply to Paper, Purpur, Leaf, Canvas, Folia, and Spigot.

### Before you remove the plugin

While Iris is still installed:

1. Stop pregeneration with `/iris pregen stop` and close Studio with `/iris studio close`. Players with an open Jigsaw Studio run `/iris jigsaw close`.
2. Run `/iris datapack list` and write down the id of each installed datapack. You delete those folders later.
3. Remove each Iris world. `/iris worlds` lists the loaded ones by their Bukkit names, such as `world_iris_example_world`. Every `bukkit.yml` entry with an `Iris` generator names a registered one, loaded or not.

   ```none
   /iris remove example_world
   ```

   `/iris remove` accepts the plain name, `iris:example_world`, or the Bukkit name. It moves players out, unloads the world, deletes its folder, and removes its entries from `bukkit.yml`, the Iris world registry, and Multiverse-Core. Wait for each result before removing the next world. `DELETE_QUEUED` means the folder is deleted at the next startup; delete it by hand in the next procedure instead.
4. If `/iris worlds` lists your main world, `<level-name>_nether`, or `<level-name>_the_end` as an Iris world, `/iris replace` made Iris its generator. `/iris remove` refuses these worlds. Handle them after you stop the server; see [Main world, Nether, and End](#main-world-nether-and-end).

### Remove the plugin and its files

1. Stop the server and wait for the Java process to exit.
2. Delete the Iris jar from `plugins/`.
3. If the start command contains `-javaagent:plugins/Iris/agent.jar`, remove that option. The JVM does not start while it names a missing file. Also remove options you added only for Iris, such as `-XX:+EnableDynamicAgentLoading`, `--enable-native-access=ALL-UNNAMED`, `-Diris.durability`, and `-Diris.strictContent`.
4. Delete the files and folders in the table below.
5. In `bukkit.yml`, delete each entry under `worlds:` whose `generator` is `Iris` or starts with `Iris:`:

   ```yaml
   worlds:
     world_iris_example_world:
       generator: Iris:overworld
       seed: 1337
   ```

6. If Multiverse-Core is installed, remove any remaining entry whose generator starts with `Iris:`. Edit its `worlds.yml` while the server is stopped, or run `/mv remove <world>` after it starts. Worlds removed with `/iris remove` have no entry left.
7. Iris raises two server timeouts at startup and does not lower them again: `settings.timeout-time` in `spigot.yml`, to at least `300` seconds, and `watchdog.early-warning-delay` in `config/paper-global.yml`, to at least `180000` milliseconds. Iris logs the previous value when it changes one. Set them back if you want the previous values; see [Configuration](/iris/03-configuration#autoconfiguration).
8. Remove `iris.` permission grants, such as `iris.all` and `iris.treefeller`, from your permissions plugin.
9. Remove `%iris_…%` placeholders from other plugins' configuration. Without Iris, PlaceholderAPI leaves them unreplaced. Iris registers its expansion from the jar, so there is no expansion file to delete.
10. Leave `plugins/bStats/` in place unless no remaining plugin uses bStats; that folder is shared.

| Delete | Contents |
|---|---|
| `plugins/Iris/` | Settings (`iris.json`, `compat.json`), installed packs and Studio projects (`packs/`, with backups from `overwrite=true` downloads in `packs/.backups/`), packaged exports (`exports/`), external datapack imports and records (`datapacks/`), downloaded libraries and caches (`cache/`), language files and players' language choices (`languages/`), the Java agent (`agent.jar`), and queued world deletions and replacements |
| `<level-root>/datapacks/iris/` | The datapack Iris builds from installed packs: custom biomes, biome tags, dimension types, and the dimension entries of Iris worlds. Keep it if you keep a main world, Nether, or End that Iris generated; see [Main world, Nether, and End](#main-world-nether-and-end) |
| `<level-root>/datapacks/<id>/`, for each id from `/iris datapack list` | External datapacks Iris installed for packs. Kept without Iris, they are ordinary datapacks, and nothing limits their structures to the Iris dimensions that declared them |
| `<level-root>/iris/` | The Iris world registry (`worlds.json`) and empty world folders Iris set aside (`husks/`) |
| `<level-root>/dimensions/iris/` | Iris worlds on Paper-family servers, leftover Studio worlds, and world folders waiting for deletion |
| `<level-name>_iris_*` folders next to `<level-root>` | Iris worlds and leftover Studio worlds on Spigot and CraftBukkit |
| `<level-root>/dimensions/minecraft/.iris-replace-*` | Folders of a replacement that has not finished. A `.backup` folder holds the terrain the replacement moved aside |

### Main world, Nether, and End

`/iris replace` makes Iris generate the main world, `<level-name>_nether`, or `<level-name>_the_end` in place. Their folders stay under `<level-root>/dimensions/minecraft/`. After you remove the plugin, choose one:

- **Start over.** Restore the backup you made before running `/iris replace`, or delete `<level-root>` so the server creates a new world. Deleting `<level-root>` also deletes player data and everything else in that folder.
- **Keep the terrain.** Remove the world's `bukkit.yml` entry as in step 5. Delete the `iris/` and `mantle-hydrology/` folders inside its dimension folder, such as `<level-root>/dimensions/minecraft/overworld/`. They hold Iris generation data, and a later Iris installation refuses to start while a vanilla dimension has an `iris/` folder but no `Iris` generator in `bukkit.yml`. Keep `<level-root>/datapacks/iris/`, which defines the custom biomes stored in the existing chunks and, when `general.adjustVanillaHeight` was on, the height of the vanilla dimensions. Delete its `data/iris/dimension/` folder, which defines the Iris worlds you removed.

  The server generates new chunks with vanilla terrain, so the terrain changes abruptly where new chunks meet Iris terrain.

## Fabric, Forge, and NeoForge servers

These steps also apply to Youer.

### Before you remove the mod

While Iris is still installed:

1. Stop pregeneration with `/iris pregen stop` and close Studio with `/iris studio close`.
2. Delete each Iris dimension, including `irisworldgen:primary` if you used `/iris world replace-overworld`. `/iris world list` lists the loaded ones; `<level-root>/iris/iris-dimensions.json` lists every saved one.

   ```none
   /iris world delete irisworldgen:example_world
   ```

   Deleting the primary world also clears player routing in `modded.json`.
3. If `dimensionReplacements` in `config/irisworldgen/modded.json` lists any dimension, turn off each replacement, then restart the server once with Iris still installed:

   ```none
   /iris replace minecraft:overworld off
   ```

   On that restart the dimension returns to its own generator, and Iris moves the Iris terrain to `config/irisworldgen/replacement-recovery-<id>/`. Earlier terrain is not restored. See [Worlds & Lifecycle](/iris/06-worlds-lifecycle#replace-on-fabric-forge-and-neoforge).
4. If you used `/iris world mainworld`, plan to restore the earlier world or start a new one; see [Main world preset](#main-world-preset).

### Remove the mod and its files

1. Stop the server.
2. Delete the Iris jar from `mods/`.
3. If you used `/iris world mainworld`, complete [Main world preset](#main-world-preset) before you delete `config/irisworldgen/`.
4. Delete the files and folders in the table below.
5. Delete external datapacks that you placed in `<level-root>/datapacks/` only for a custom Iris pack.
6. Remove the tree feller permission node from your permissions mod: `irisworldgen:treefeller` on Fabric 26.1.2, 26.2, and 26.3, or `irisworldgen.treefeller` on Fabric 1.21.1, Forge, and NeoForge.

| Delete | Contents |
|---|---|
| `config/iris/` | Engine settings (`iris.json`), language files, and caches |
| `config/irisworldgen/` | Packs, the generated datapack and world presets, `modded.json`, the worldgen catalog, exports, and the `mainworld-recovery-<id>/` and `replacement-recovery-<id>/` folders with terrain Iris moved aside |
| `<level-root>/iris/` | The Iris dimension registry (`iris-dimensions.json`) and other Iris data for the save |
| `<level-root>/mantle-hydrology/` | Iris generation data of an Overworld that Iris generated, when present |
| `<level-root>/data/irisworldgen/` | The record of applied dimension replacements |
| `<level-root>/dimensions/irisworldgen/` | Iris dimensions, including Studio dimensions |
| `<level-root>/datapacks/iris/` | Iris dimension types, present only if you ran `/iris datapack install` |

### Main world preset

`/iris world mainworld` sets `level-type` in `server.properties` to an Iris world preset and regenerates the Overworld, Nether, and End. The save records the Iris generator for its Overworld, so the server cannot load that save without Iris.

1. In `server.properties`, set `level-type` back to `minecraft\:normal`. If you passed a seed to `/iris world mainworld`, Iris also wrote it to `level-seed`.
2. Restore the earlier world or start a new one:
   - To restore it, delete these items from the save folder: `level.dat`, `level.dat_old`, `region/`, `entities/`, `poi/`, `mantle-hydrology/`, `dimensions/minecraft/`, `DIM-1/`, and `DIM1/`. Then move everything inside `config/irisworldgen/mainworld-recovery-<id>/` into the save folder. The recovery folder keeps the save's layout and holds those items as they were before the preset was applied. If the preset was applied more than once, the recovery folder created first holds the world from before Iris.
   - To start a new world, delete the save folder.

> The recovery folders under `config/irisworldgen/` are the only copy of the terrain Iris moved aside. Copy them out before you delete `config/irisworldgen/` if you may need that terrain.
{.is-warning}

## Clients

Players who installed the Iris mod on a client remove it the same way for every server platform:

1. Delete the Iris jar from the client's `mods/` folder.
2. Delete `config/iris/` and `config/irisworldgen/` in the game folder. They hold the packs and settings used in singleplayer.
3. A singleplayer world created with an `IRIS:` World Type records the Iris generator and cannot be opened without Iris. Delete it from `saves/`, or keep it to open after reinstalling Iris.

Joining a multiplayer server does not copy packs, settings, or world data to the client.

## What stays in the world

| Leftover | After removal | Clean up |
|---|---|---|
| Terrain, objects, structures, and container loot in worlds you keep | Ordinary blocks and items | Inert. Delete or regenerate the world to remove them |
| Chunk data keys `iris:natural_terrain` and `iris:structure_activation` on Bukkit-family servers | Stored with each chunk Iris generated | Inert. Deleted with the world |
| Mobs that Iris spawned | Ordinary mobs with the names, equipment, and attribute modifiers from their pack. Mobs kept by the entity's `keepEntity` field or by `world.forcePersistEntities` do not despawn | Remove them like other mobs |
| Wand of Iris (blaze rod) and Dust of Revealing (glowstone dust) | Unbreakable items. On Bukkit-family servers they keep Fire Aspect I and the data keys `iris:wand` and `iris:dust`; on mod loaders they keep the custom data flags `iris_wand` and `iris_dust` | Remove them from inventories |
| Jigsaw Studio tools on Bukkit-family servers | Sticks with `iris:jigsaw_tool_*` data keys | Inert. Discard them |
| Biome and region potion effects on players | Expire after their duration | Inert |

## Removing only the jar

When only the jar is deleted, Iris files and world registrations stay behind:

- **Bukkit-family servers.** The server generates vanilla terrain into new chunks of a main world, Nether, or End that Iris generated. Iris worlds, the `iris` datapack, and the Iris entries in `bukkit.yml` and Multiverse-Core stay in place. Complete the steps above to remove them.
- **Fabric, Forge, and NeoForge.** Nothing creates the Iris dimensions at startup, and their folders stay in the save. A save whose main world came from `/iris world mainworld` or an `IRIS:` World Type cannot be loaded. Dimensions that `/iris replace` regenerated keep their Iris terrain; turn replacements off with Iris installed, as described above.

## Starting fresh

To reinstall Iris with no earlier state:

1. Copy any packs you wrote out of `plugins/Iris/packs/` or `config/irisworldgen/packs/`, and any `.iris` exports you want to keep.
2. Uninstall Iris completely with the steps above.
3. Install the jar as described in [Installation & Platforms](/iris/01-installation-platforms) and start the server. Iris creates a new data folder with default settings. A Bukkit-family server downloads the Iris libraries again and needs network access.
4. Download the packs again, one at a time, then restart:

   ```none
   /iris download pack=overworld
   /iris download pack=underworld
   ```

   Copy your own packs back into the packs folder before the restart.
5. Create worlds with [Getting Started](/iris/02-getting-started), or make Iris generate the main world with [`/iris replace`](/iris/06-worlds-lifecycle#exact-world-slot-replacement).

Smaller resets keep Iris installed:

| Reset | How |
|---|---|
| An installed pack | `/iris download pack=overworld overwrite=true`, or `link=<zip-url> overwrite=true` for another pack. Existing worlds keep their saved pack. See [Pack Management](/iris/25-pack-management) |
| Settings | Stop the server, delete `iris.json`, and start it. Iris writes the defaults |
| One world | `/iris remove <world>` on Bukkit-family servers, or `/iris world delete <dimension>` on Fabric, Forge, and NeoForge |
