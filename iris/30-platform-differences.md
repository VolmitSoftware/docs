---
title: "Platform Differences"
description: "Iris documentation: Platform Differences"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Iris runs the same generation core on Bukkit-family servers and on Fabric, Forge, and NeoForge. Terrain output is identical; everything around it differs. Shared configuration is `iris.json`, and mod loaders add `modded.json`. See also [01 - Installation & Platforms](/iris/01-installation-platforms), [03 - Configuration](/iris/03-configuration), and [04 - Commands & Permissions](/iris/04-commands-permissions).

## What actually differs

Five categories cover almost everything an operator runs into:

- **Command syntax.** Bukkit uses VolmLib Director: optional arguments are `key=value` in any order. Mod loaders use Brigadier: arguments are positional and options are bare literals.
- **World lifecycle.** Bukkit creates managed `iris:*` worlds and can stage a cold replacement of an existing safe Iris world or exact vanilla slot on restart. Mod loaders register dimension ids and enable or disable them.
- **Authoring tools that need Bukkit.** Anything built on NMS, WorldEdit, or inventory GUIs is Bukkit-only: Jigsaw Studio, structure import and capture, vanilla import, schematic conversion, and the Studio loot and entity GUIs. Packs authored there run fine everywhere.
- **Permissions.** Bukkit gates the entire `/iris` tree behind one permission. Mod loaders gate mutating commands at gamemaster level but leave inspection open to any player.
- **File locations.** Both platforms have an Iris data directory. The modded side splits it: settings under one root, packs under another.

Terrain, typed image maps, native world boundaries, accepted-plan hydrology, biomes, objects, jigsaw runtime, caves, and structures behave the same on all four. **If generated terrain differs between platforms, that is a determinism defect, not a platform difference** — see [32 - Determinism & Goldenhash](/iris/32-determinism-goldenhash). The same applies to image maps: a difference in decoded height, legend target, mask weight, image coverage, or applied boundary for identical pack bytes is a parity defect.

## Data directories

| Item | Bukkit | Fabric / Forge / NeoForge |
|------|--------|---------------------------|
| Settings | `plugins/Iris/iris.json` | `<configDir>/iris/iris.json` |
| Runtime-library cache | `plugins/Iris/cache/libraries/` | Not used; each mod jar is self-contained |
| Packs | `plugins/Iris/packs/` | `<configDir>/irisworldgen/packs/` |
| Mod config | — | `<configDir>/irisworldgen/modded.json` |
| GoldenHash baselines | `plugins/Iris/golden/` | `<configDir>/irisworldgen/golden/` |
| Studio pack exports | `plugins/Iris/packs/exports/` | `<configDir>/irisworldgen/exports/` |
| Generated datapack | world `datapacks/` + Iris ingest | `<configDir>/irisworldgen/generated/datapack/`. Dimension-type pack name `iris` under `data/irisworldgen/dimension_type/` |
| Parity / developer dumps | under plugin data folder | `<configDir>/iris/parity/` |
| Persistent dynamic-world registry | `<level-root>/iris/worlds.json`, plus exact save-filtered `bukkit.yml` startup bindings | `<world-root>/iris/iris-dimensions.json` |
| Managed dimension storage | Paper-family: `<level-root>/dimensions/iris/<key>/`. Plain Spigot: `<world-container>/<level-name>_iris_<key>/dimensions/iris/<key>/` | Minecraft's dynamic-dimension storage under the save, registered through `iris-dimensions.json` |

On mod loaders only `iris.json` and the parity dumps use the `iris/` root; every pack, config, and generated artifact uses `irisworldgen/`. Both roots sit under the loader config directory.

Both platforms watch pack content and `iris.json` for edits and reconcile changes within a few seconds without rewriting your file. Manual reload is immediate.

## World model

| Concern | Bukkit | Modded |
|---------|--------|--------|
| Create | `/iris create` → absent managed `iris:*` world with an explicit creation seed | `/iris create` or `/iris world enable` → dimension id plus pack injection |
| Update generation | `/iris dev update-world world=<world> pack=<pack> confirm=true` → pending immutable activation and restart | `/iris world update <dimension> <pack>` → the same pending activation and restart |
| Replace | `/iris replace` (aliases `override`, `overwrite`) → existing safe `iris:*` world or exact Overworld/Nether/End slot, preserving the target's saved seed by default or accepting an explicit replacement seed, then publishing on restart | Not available |
| Load / unload | `/iris load` (alias `import`), `/iris unload` | `/iris world disable` unloads. There is no separate load command |
| Remove / delete | `/iris remove`, optionally deleting the folder | `/iris world delete` wipes chunk and mantle data |
| Primary / main world | `/iris replace minecraft:overworld type=<pack>` replaces the selected save's existing main slot without changing `level-name` | `modded.json` `primaryWorld` plus `routePlayersToPrimaryWorld`. `/iris world mainworld` (and `mainworld off`), `/iris world replace-overworld` |
| Evacuate | `/iris evacuate <world>` — world argument required, player-only origin | `/iris evacuate [dimension]` — defaults to the sender's current level. Destination is always the vanilla overworld, and evacuating the overworld itself is refused |
| Studio world | Transient studio world. `/iris jigsaw` can select the Jigsaw Studio generator for one activation | Studio dimension under `irisworldgen:studio_*`. No Jigsaw Studio authoring tree |
| Folia | Regionized schedulers. Pregen `runtimeSchedulerMode` always resolves to `FOLIA` on a regionized runtime | Not applicable |

Startup never downloads packs on either platform. Operators run `/iris download pack=overworld`, `/iris download pack=underworld`, or `/iris download link=<zip-url>`, then restart manually.

Cold replacement requires a full Paper-family plugin bootstrap, which is why it is Paper/Purpur/Leaf/Folia only. Several distinct targets can be staged and published with one manual restart.

Modded startup quarantines a corrupt persistent-dimension registry as `iris-dimensions.json.broken-<timestamp>` and continues without those dynamic worlds. Recovery: [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle).

> **Known Folia defect, not Iris.** Folia 26.2's command dispatcher omits or restricts commands used by Dungeons & Taverns 5.3.0, causing 35 `nova_structures:*` function-load failures. The built-in Iris packs do not import Dungeons & Taverns, but a custom pack may. The same bytes load on Paper, Leaf, and Canvas, and the absent commands reproduce on Folia without Iris installed. Iris world loading and pregeneration still complete; the affected functions do not. See [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks).
{.is-warning}

## Commands and permissions

| Concern | Bukkit | Modded |
|---------|--------|--------|
| Parser | VolmLib Director. `key=value` optionals in any order | Brigadier. Positional arguments and bare flag literals |
| Root aliases | `iris`, `ir`, `irs` | `iris`, with `ir` and `irs` registered as redirects |
| Staff gate | `iris.all` (default `op`) — required for every `/iris` subcommand | `LEVEL_GAMEMASTERS` for anything that mutates, downloads, opens Studio, or starts a pregen |
| Open to any player | Nothing | `LEVEL_ALL`: `help`, `version`, `info`, `worlds`, `height`, `metrics` (alias `measure`), and the whole `what` subtree |
| Deliberately gated reads | — | `seed` and `accesslist` stay at gamemaster level even though `worlds` shows similar output without the seed field |
| Tree feller | `iris.treefeller` (default `op`) | Fabric `irisworldgen:treefeller`. Forge and NeoForge PermissionAPI node `irisworldgen.treefeller`, defaulting to gamemaster level |
| Help | Director mini-menu | `ModdedCommandHelp` sections with clickable pages |

Full command tables and stubs: [04 - Commands & Permissions](/iris/04-commands-permissions).

## Feature matrix

| Feature | Bukkit | Fabric | Forge | NeoForge |
|---------|--------|--------|-------|----------|
| Core terrain / accepted hydrology / biomes / objects / jigsaw | yes | yes | yes | yes |
| Version content gating and `/iris pack compat` | yes | yes | yes | yes |
| Typed image-map runtime / validation / packaging | yes | yes | yes | yes |
| Image-map desktop authoring and Vision layers | graphical host | graphical host | graphical host | graphical host |
| Dimension `worldBoundary` | native border | native border | native border | native border |
| Saved planar/spatial Iris jigsaw runtime | yes | yes | yes | yes |
| Jigsaw Studio (`/iris jigsaw` authoring tree) | yes | not registered | not registered | not registered |
| Pack validate / cleanup / restore / status | yes | yes | yes | yes |
| Pack download (`/iris download`, root-level on both) | yes | yes | yes | yes |
| Existing-world generation history and blended pack/kernel updates | yes | yes | yes | yes |
| Cold restart replacement of existing safe Iris or exact Overworld/Nether/End slots | Paper/Purpur/Leaf/Folia | no | no | no |
| Pregen | yes (Paper-like / Folia modes) | yes (`moddedPregenInFlight`) | yes | yes |
| Studio open / close / vscode / package | yes | yes | yes | yes |
| Studio importvanilla | yes | message: run on Bukkit | same | same |
| Studio loot GUI / entity spawn / profile / objects report | yes | message only | message only | message only |
| Object wand / paste / save / undo | yes | yes | yes | yes |
| Object contract / shift selection | yes | yes | yes | yes |
| Object expand selection | no | yes | yes | yes |
| Object WorldEdit import (`we`) | yes (WorldEdit soft depend) | message only | message only | message only |
| Object studio world | yes | message only | message only | message only |
| Schematic convert (`.schem` → `.iob`) | yes | message only | message only | message only |
| Structure import / capture | yes (v26 NMS binding) | message only | message only | message only |
| Structure list / info / place / verify | yes | yes | yes | yes |
| Datapack HTTP(S), `file:`, and local drop-folder ingest / list / remove | yes | message only | message only | message only |
| Dimension-type datapack install / status | not applicable | yes | yes | yes |
| PlaceholderAPI | soft depend | no | no | no |
| Multiverse-Core | soft depend / loadbefore | no | no | no |
| Item plugins (ItemsAdder, Mythic, and similar) | paper soft deps | loader-specific / limited | limited | limited |
| Public API package `art.arcane.iris.api` | plugin jar | see [94 - API - Modded](/iris/94-api-modded) | same | same |
| Client HUD / protocol | optional client mod | optional client mod | optional | optional |
| Tree feller | settings + `iris.treefeller` | settings + loader permission | same | same |
| Auto Spigot/Paper timeout and watchdog config | yes | no | no | no |
| Custom biome restart prompts | yes (`iris.all` / op) | different datapack flow | same | same |

"Message only" means the command exists and prints an explanation of where to run it instead. It is not a silent failure.

Jigsaw pack resources are shared runtime data; only the in-game authoring surface is Bukkit-only. Bukkit exposes one global Studio project and world and one owning Jigsaw session, and non-owner block, inventory, interaction, and mutating-command changes are cancelled across that Studio world. A strict `VANILLA_PORTABLE` export targets unmodded Minecraft 26.2.

## Platform-sensitive settings

| Setting | Where it matters |
|---------|------------------|
| `pregen.runtimeSchedulerMode` | Bukkit only. Resolved from Bukkit/Folia detection, and a regionized runtime always resolves to Folia |
| `pregen.paperLikeBackendMode` | Bukkit only. Ticket versus service chunk acquisition |
| `pregen.moddedPregenInFlight` | Mod loaders only. Concurrent pregen chunk budget |
| `autoConfiguration.*` | Bukkit only. Spigot keep-alive, Paper watchdog, custom-biome restart |
| `general.autoIngestDatapacks` / `general.autoImportDatapackStructures` | Bukkit datapack ingest pipeline is the primary consumer |
| `gui.useServerLaunchedGuis` | Both, but the host implementation differs (`BukkitGuiHost` versus `ModdedGuiHost`) |

`modded.json` keys exist only on mod loaders.

## Integrations

| Integration | Bukkit | Modded |
|-------------|--------|--------|
| WorldEdit | soft depend. Object `we` import | not wired |
| Multiverse-Core | load order / link | not used |
| PlaceholderAPI | `%iris_…%` | no |
| MythicMobs and item plugins | paper-plugin optional deps | not the Bukkit pipeline |
| Tree feller | plugin permission | loader permission node |

See [28 - Integrations](/iris/28-integrations) and [09 - PlaceholderAPI](/iris/09-placeholderapi).

## Determinism and version gating

Both exist identically on every platform and are documented elsewhere:

- GoldenHash — procedure and caveats in [32 - Determinism & Goldenhash](/iris/32-determinism-goldenhash). Only the command placement differs (Bukkit under `developer`, modded at the root), and Bukkit exposes mantle-reset and deep-dump options that modded does not. A cross-platform comparison always warns about the Minecraft version because the two platforms format the version string differently.
- Version content gating — commands and remedies in [25 - Pack Management](/iris/25-pack-management). The gate asks the live platform registry rather than comparing version numbers, so the same pack on the same Minecraft version excludes, drops, and substitutes exactly the same content on every loader, and mod-added registry content is covered for free.

## Moving a pack between platform families

1. Freeze the pack bytes and seed. Validate and package on the source platform.
2. Finish anything Bukkit-only first: structure and vanilla imports, schematic conversion, WorldEdit imports, and Jigsaw Studio work. Complete the atomic saves before copying.
3. Copy only `packs/<key>/` into the destination packs root, including referenced `images/` PNGs and `image-maps/` JSON resources — validation and packaging reject an incomplete image-map closure. **Never copy a Bukkit world folder into a modded world or the reverse.**
4. Restart so destination registries and forced datapacks are built before any world is created.
5. Align the `iris.json` keys that affect generation (`generator`, `performance`, `treeFeller`). Bukkit-only `autoConfiguration` keys can be ignored.
6. On mod loaders, set `modded.json` `primaryWorld` if you need overworld replacement.
7. Re-run `/iris pack validate`, then `/iris datapack status` on modded or the ingest flow on Bukkit. Compare `/iris pack compat` on both platforms: on the same Minecraft version the two reports must match.
8. Create a new world on the destination platform with `/iris create`.

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
