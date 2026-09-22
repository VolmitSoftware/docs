---
title: "Platform Differences"
description: "Iris documentation: Platform Differences"
published: true
date: 2026-09-21T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Iris supports Bukkit-family servers, Fabric, Forge and NeoForge. Pack content is shared, while commands, file locations and authoring tools differ. Use the tables below when choosing a platform or moving a pack.

## What actually differs

- Bukkit commands use `key=value` options; mod-loader commands use positional arguments.
- Bukkit offers additional authoring tools, including Jigsaw Studio, WorldEdit import, structure capture and inventory GUIs.
- Bukkit requires `iris.all` for `/iris` commands. Mod loaders allow inspection commands for all players and require gamemaster access for changes.
- Packs and settings use different directories on mod loaders.

## Data directories

| Item | Bukkit | Fabric / Forge / NeoForge |
|------|--------|---------------------------|
| Settings | `plugins/Iris/iris.json` | `<configDir>/iris/iris.json` |
| Packs | `plugins/Iris/packs/` | `<configDir>/irisworldgen/packs/` |
| Mod config | — | `<configDir>/irisworldgen/modded.json` |
| GoldenHash baselines | `plugins/Iris/golden/` | `<configDir>/irisworldgen/golden/` |
| Studio pack exports | `plugins/Iris/packs/exports/` | `<configDir>/irisworldgen/exports/` |
| Generated datapack | World `datapacks/` | `<configDir>/irisworldgen/generated/datapack/` |
| Persistent dynamic-world registry | `<level-root>/iris/worlds.json` | `<world-root>/iris/iris-dimensions.json` |
| Managed dimension storage | Paper-family: `<level-root>/dimensions/iris/<key>/`. Plain Spigot: `<world-container>/<level-name>_iris_<key>/dimensions/iris/<key>/` | Minecraft's dimension storage under the world save |

On mod loaders, edit shared settings under `iris/` and install packs under `irisworldgen/packs/`. Both are under the loader config directory.

Both platforms support `iris.json` hotload and Studio pack hotload. Use `/iris reload` to reload settings manually.

## World model

| Concern | Bukkit | Modded |
|---------|--------|--------|
| Create | `/iris create` creates a new managed `iris:*` world | `/iris create` or `/iris world enable` creates or enables an Iris dimension |
| Update generation | `/iris dev update-world world=<world> pack=<pack> confirm=true`, then restart | `/iris world update <dimension> <pack>`, then restart |
| Replace | `/iris replace` (aliases `override`, `overwrite`) replaces a supported Iris or vanilla dimension after restart. Keeps its seed unless you specify another | Not available |
| Load / unload | `/iris load` (alias `import`), `/iris unload` | `/iris world disable` unloads. There is no separate load command |
| Remove / delete | `/iris remove`, optionally deleting the folder | `/iris world delete` wipes chunk and mantle data |
| Primary / main world | `/iris replace minecraft:overworld type=<pack>` replaces the selected save's existing main slot without changing `level-name` | `modded.json` `primaryWorld` plus `routePlayersToPrimaryWorld`. `/iris world mainworld` (and `mainworld off`), `/iris world replace-overworld` |
| Evacuate | `/iris evacuate <world>` — world argument required, player-only origin | `/iris evacuate [dimension]` — defaults to the sender's current level. Destination is always the vanilla overworld, and evacuating the overworld itself is refused |
| Studio world | Temporary Studio world. Jigsaw Studio is also available | Studio dimension under `irisworldgen:studio_*`. No Jigsaw Studio authoring tree |
| Folia | Supported; pregeneration automatically uses Folia mode | Not applicable |

Install packs with `/iris download` before creating worlds; startup does not download them. See [04 - Commands & Permissions](/iris/04-commands-permissions) for each platform's syntax.

Replacement is available on Paper, Purpur, Leaf and Folia and requires a manual restart. You can stage several distinct targets before restarting. World creation and replacement commands are covered in [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle).

Folia 26.2 cannot run some functions supplied by Dungeons & Taverns 5.3.0. Custom packs importing it may report function-load errors. See [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks).

## Commands and permissions

| Concern | Bukkit | Modded |
|---------|--------|--------|
| Syntax | `key=value` options in any order | Positional arguments and bare flag literals |
| Root aliases | `iris`, `ir`, `irs` | `iris`, `ir`, `irs` |
| Staff gate | `iris.all` (default `op`) — required for every `/iris` subcommand | Gamemaster access for anything that mutates, downloads, opens Studio, or starts a pregen |
| Open to any player | Nothing | All players: `help`, `version`, `info`, `worlds`, `height`, `metrics` (alias `measure`), and the whole `what` subtree |
| Deliberately gated reads | — | `seed` and `accesslist` stay at gamemaster level even though `worlds` shows similar output without the seed field |
| Tree feller | `iris.treefeller` (default `op`) | Fabric `irisworldgen:treefeller`. Forge and NeoForge node `irisworldgen.treefeller`, defaulting to gamemaster level |
| Help | Clickable command menu | Clickable help pages |

Full command tables: [04 - Commands & Permissions](/iris/04-commands-permissions).

## Feature matrix

| Feature | Bukkit | Fabric | Forge | NeoForge |
|---------|--------|--------|-------|----------|
| Terrain / hydrology / biomes / objects / jigsaw | yes | yes | yes | yes |
| Version content gating and `/iris pack compat` | yes | yes | yes | yes |
| Typed image maps / validation / packaging | yes | yes | yes | yes |
| Image-map desktop authoring and Vision layers | graphical host | graphical host | graphical host | graphical host |
| Dimension `worldBoundary` | native border | native border | native border | native border |
| Saved planar/spatial Iris jigsaws | yes | yes | yes | yes |
| Jigsaw Studio (`/iris jigsaw` authoring tree) | yes | not registered | not registered | not registered |
| Pack validate / cleanup / restore / status | yes | yes | yes | yes |
| Pack download (`/iris download`, root-level on both) | yes | yes | yes | yes |
| Existing-world pack updates and terrain transitions | yes | yes | yes | yes |
| Replacement of supported Iris or vanilla dimensions after restart | Paper/Purpur/Leaf/Folia | no | no | no |
| Pregen | yes (Paper-like / Folia modes) | yes (`moddedPregenInFlight`) | yes | yes |
| Studio open / close / vscode / package | yes | yes | yes | yes |
| Studio importvanilla | yes | message: run on Bukkit | same | same |
| Studio loot GUI / entity spawn / profile / objects report | yes | message only | message only | message only |
| Object wand / paste / save / undo | yes | yes | yes | yes |
| Object contract / shift selection | yes | yes | yes | yes |
| Object expand selection | no | yes | yes | yes |
| Object WorldEdit import (`we`) | with WorldEdit installed | message only | message only | message only |
| Object studio world | yes | message only | message only | message only |
| Schematic convert (`.schem` → `.iob`) | yes | message only | message only | message only |
| Structure import / capture | yes | message only | message only | message only |
| Structure list / info / place / verify | yes | yes | yes | yes |
| Datapack HTTP(S), `file:`, and local drop-folder ingest / list / remove | yes | message only | message only | message only |
| Dimension-type datapack install / status | not applicable | yes | yes | yes |
| PlaceholderAPI | optional | no | no | no |
| Multiverse-Core | optional | no | no | no |
| Item plugins (ItemsAdder, Mythic, and similar) | supported integrations | loader-specific / limited | limited | limited |
| Integration API | [Plugin API](/iris/90-api-getting-started) | [Modded API](/iris/94-api-modded) | same | same |
| Client HUD / protocol | optional client mod | optional client mod | optional | optional |
| Tree feller | settings + `iris.treefeller` | settings + loader permission | same | same |
| Auto Spigot/Paper timeout and watchdog config | yes | no | no | no |
| Custom biome restart prompts | yes (`iris.all` / op) | different datapack flow | same | same |

"Message only" means the command exists and prints an explanation of where to run it instead. It is not a silent failure.

Jigsaw structures run on every platform; the authoring tools require Bukkit. Only the session owner can edit the active Jigsaw Studio world. A `VANILLA_PORTABLE` export targets Minecraft 26.3 on 26.3 servers and Minecraft 26.2 on earlier supported servers.

## Platform-sensitive settings

| Setting | Where it matters |
|---------|------------------|
| `pregen.runtimeSchedulerMode` | Bukkit only. Leave `AUTO` for automatic platform selection |
| `pregen.paperLikeBackendMode` | Bukkit only. Selects the non-Folia pregeneration backend |
| `pregen.moddedPregenInFlight` | Mod loaders only. Concurrent pregen chunk budget |
| `autoConfiguration.*` | Bukkit only. Configures Spigot and Paper timeout settings |
| `general.autoIngestDatapacks` / `general.autoImportDatapackStructures` | Bukkit datapack importing |
| `gui.useServerLaunchedGuis` | Both. Allows desktop windows on the server machine |

`modded.json` keys exist only on mod loaders.

## Integrations

| Integration | Bukkit | Modded |
|-------------|--------|--------|
| WorldEdit | Optional; enables object `we` import | Unavailable |
| Multiverse-Core | Supported | Unavailable |
| PlaceholderAPI | `%iris_…%` | no |
| MythicMobs and item plugins | Optional supported integrations | Loader-specific; see integration documentation |
| Tree feller | plugin permission | loader permission node |

See [28 - Integrations](/iris/28-integrations) and [09 - PlaceholderAPI](/iris/09-placeholderapi).

## Determinism and version gating

Run `/iris pack compat` to check which pack content your server supports. Missing mods or differences in Minecraft versions can affect available content. See [25 - Pack Management](/iris/25-pack-management).

For generation comparisons, use [32 - Determinism & Goldenhash](/iris/32-determinism-goldenhash).

## Moving a pack between platform families

1. Validate and package the source pack. Keep the same seed when comparing worlds.
2. Finish Bukkit-only authoring work before copying, including imports, conversions and Jigsaw Studio edits.
3. Copy the complete pack folder to the destination's packs directory, including referenced images and image-map resources. Do not copy world saves between platform families.
4. Install the required mods or datapacks, then restart and follow any additional datapack restart prompts.
5. Review the destination's [configuration](/iris/03-configuration).
6. Validate the pack and run `/iris pack compat` on the destination. On mod loaders, also check `/iris datapack status`.
7. Create a new world with `/iris create`, using the destination platform's argument syntax.

## Related

- [01 - Installation & Platforms](/iris/01-installation-platforms)
- [03 - Configuration](/iris/03-configuration)
- [04 - Commands & Permissions](/iris/04-commands-permissions)
- [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle)
- [07 - Pregeneration](/iris/07-pregeneration)
- [21 - Jigsaw Structures](/iris/21-jigsaw-structures)
- [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks)
- [28 - Integrations](/iris/28-integrations)
- [29 - Client HUD & Protocol](/iris/29-client-hud-protocol)
- [32 - Determinism & Goldenhash](/iris/32-determinism-goldenhash)
- [37 - Image Maps](/iris/37-image-maps)
- [43 - Image Map Configuration & Coordinates](/iris/43-image-map-config-coordinates)
- [94 - API - Modded](/iris/94-api-modded)
