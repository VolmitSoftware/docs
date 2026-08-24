---
title: "Platform Differences"
description: "Iris documentation: Platform Differences"
published: true
date: 2026-08-24T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Iris runs the same generation core on Bukkit-family servers and on Fabric,
Forge, and NeoForge. Terrain output is identical. Everything around it
differs. This page is the reference matrix for those differences. Shared
configuration is `iris.json`. Mod loaders add `modded.json`. Related
detail lives in
[01 - Installation & Platforms](/iris/01-installation-platforms),
[03 - Configuration](/iris/03-configuration), and
[04 - Commands & Permissions](/iris/04-commands-permissions).

## What actually differs

Five categories cover almost everything an operator runs into:

- **Command syntax.** Bukkit uses VolmLib Director. Optional arguments are
  `key=value` in any order. Mod loaders use Brigadier. Arguments are
  positional and options are bare literals. The same feature reads very
  differently on each.
- **World lifecycle.** Bukkit creates managed `iris:*` worlds. It can stage
  a cold replacement of an existing safe Iris world or exact vanilla slot
  on restart. Mod loaders register dimension ids and enable or disable
  them.
- **Authoring tools that need Bukkit.** Anything built on NMS, WorldEdit,
  or inventory GUIs is Bukkit-only. That includes Jigsaw Studio, structure
  import and capture, vanilla import, schematic conversion, and the Studio
  loot and entity GUIs. Packs authored there run fine everywhere.
- **Permissions.** Bukkit gates the entire `/iris` tree behind one
  permission. Mod loaders gate mutating commands at gamemaster level but
  leave inspection open to any player.
- **File locations.** Both platforms have an Iris data directory. The
  modded side splits it. Settings live under one root and packs under
  another.

Terrain, typed image maps, native world boundaries, connected rivers and their contained cave hydrology, biomes,
objects, jigsaw runtime, caves, and structures behave the same on all four.
If generated terrain differs between platforms, that is
a determinism defect, not a platform difference. See
[32 - Determinism & Goldenhash](/iris/32-determinism-goldenhash).

## Artifacts and entry points

| Surface | Artifact | Bootstrap |
|---------|----------|-----------|
| Bukkit / Paper / Folia | CraftBukkit-shaded plugin jar | `plugin.yml` / `paper-plugin.yml`, `folia-supported: true`, load `STARTUP` |
| Fabric | Fabric mod jar | `IrisFabricBootstrap` registers commands and services |
| Forge | Forge mod jar | `IrisForgeBootstrap` |
| NeoForge | NeoForge mod jar | `IrisNeoForgeBootstrap` |

Core engine: `core/`. Shared modded logic: `adapters/modded-common/`.
SPI: `spi/`.

## Data directories

| Item | Bukkit | Fabric / Forge / NeoForge |
|------|--------|---------------------------|
| Settings | `plugins/Iris/iris.json` | `<configDir>/iris/iris.json` |
| Packs | `plugins/Iris/packs/` | `<configDir>/irisworldgen/packs/` |
| Mod config | — | `<configDir>/irisworldgen/modded.json` |
| GoldenHash baselines | `plugins/Iris/golden/` | `<configDir>/irisworldgen/golden/` |
| Studio pack exports | `plugins/Iris/packs/exports/` | `<configDir>/irisworldgen/exports/` |
| Generated datapack | world `datapacks/` + Iris ingest | `<configDir>/irisworldgen/generated/datapack/`. Dimension-type pack name `iris` under `data/irisworldgen/dimension_type/` |
| Parity / developer dumps | under plugin data folder | `<configDir>/iris/parity/` |
| Persistent dynamic-world registry | `<level-root>/iris/worlds.json`, plus exact save-filtered `bukkit.yml` startup bindings | `<world-root>/iris/iris-dimensions.json` |
| Managed dimension storage | Paper-family: `<level-root>/dimensions/iris/<key>/`. Plain Spigot: `<world-container>/<level-name>_iris_<key>/dimensions/iris/<key>/` | Minecraft's dynamic-dimension storage under the save, registered through `iris-dimensions.json` |

On mod loaders only `iris.json` and the parity dumps use the `iris/`
root. Every pack, config, and generated artifact uses `irisworldgen/`.
Both roots sit under the loader config directory.

Both platforms use native filesystem events with content reconciliation, stable snapshots, and a completion-anchored 3-second latest-state queue. Their host check rates differ:

| Watcher | Bukkit | Modded |
|---------|--------|--------|
| Pack / studio content | About 1 s shared reactive-folder checks; 4 s during maintenance | 250 ms eligibility sweep and about 1 s per-pack checks, with a 2 s hold-off after recent generation and a pregeneration hold-off |
| `iris.json` | Native events drain about every 500 ms; bounded exact-content reconciliation begins about every 2.5 s | Native events drain about every 500 ms; bounded exact-content reconciliation begins about every 2.5 s |

Both parse automatic settings changes from immutable bytes without rewriting the operator's file. Locale override native events drain on the same 500 ms coordinator cadence, with bounded exact-content reconciliation beginning about every 2.5 seconds. Manual reload remains immediate.

## World model

| Concern | Bukkit | Modded |
|---------|--------|--------|
| Create | `/iris create` → absent managed `iris:*` world with an explicit creation seed | `/iris create` or `/iris world enable` → dimension id plus pack injection |
| Replace | `/iris replace` (aliases `override`, `overwrite`) → existing safe `iris:*` world or exact Overworld/Nether/End slot, preserving the target's saved world-generation seed by default or accepting an explicit replacement seed, then publishing on restart | Not available |
| Load / unload | `/iris load` (alias `import`), `/iris unload` | `/iris world disable` unloads. There is no separate load command |
| Remove / delete | `/iris remove`, optionally deleting the folder | `/iris world delete` wipes chunk and mantle data |
| Primary / main world | `/iris replace minecraft:overworld type=<pack>` replaces the selected save's existing main slot without changing `level-name`. Fresh whole-save selection is external server provisioning | `modded.json` `primaryWorld` plus `routePlayersToPrimaryWorld`. `/iris world mainworld` (and `mainworld off`), `/iris world replace-overworld` |
| Evacuate | `/iris evacuate <world>` — world argument required, player-only origin | `/iris evacuate [dimension]` — defaults to the sender's current level. Destination is always the vanilla overworld, and evacuating the overworld itself is refused |
| Studio world | Transient studio world via StudioSVC. `/iris jigsaw` can select the Jigsaw Studio generator for one activation | Studio dimension under `irisworldgen:studio_*`. No Jigsaw Studio authoring tree |
| Folia | Regionized schedulers. Pregen `runtimeSchedulerMode` always resolves to `FOLIA` on a regionized runtime | Not applicable |

Startup never downloads packs. Paper bootstrap compiles the aggregate
datapack from installed and world-local packs. It accepts an empty pack
set. Plain Bukkit and modded startup likewise use only pack bytes already
on disk. Operators use `/iris download pack=overworld`,
`/iris download pack=underworld`, or `/iris download link=<zip-url>`, then
restart manually.

Modded startup quarantines a corrupt persistent-dimension registry as
`iris-dimensions.json.broken-<timestamp>` and continues without those
dynamic worlds. Recovery:
[06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle).

Cold replacement requires a full Paper-family plugin bootstrap. Without it
the staging call fails outright. This is why replacement is
Paper/Purpur/Leaf/Folia only. Several distinct targets can be staged and
published with one manual restart.

Folia's engine startup is region-safe but otherwise follows the same
published runtime contract. Iris exposes the runtime and generation
session as running before it starts the world manager. Startup messages
that reject `bukkit_world_manager_loop` or say a newly loaded engine is
closing are defects or evidence of an outdated build. They are not
expected Folia noise.

There is one current third-party datapack exception. Folia 26.2's command
dispatcher omits or restricts commands used by Dungeons & Taverns 5.3.0.
This causes 35 `nova_structures:*` function-load failures for the shipping
Overworld dependency. The same bytes load on Paper, Leaf, and Canvas. The
absent commands reproduce on Folia without Iris installed. Iris world
loading and pregeneration still complete, but the affected Dungeons &
Taverns functions do not. See
[22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks).

## Commands and permissions

| Concern | Bukkit | Modded |
|---------|--------|--------|
| Parser | VolmLib Director. `key=value` optionals in any order | Brigadier. Positional arguments and bare flag literals |
| Root aliases | `iris`, `ir`, `irs` | `iris`, with `ir` and `irs` registered as redirects |
| Staff gate | `iris.all` (declared in `plugin.yml` and `paper-plugin.yml`, default `op`) — required for every `/iris` subcommand | `LEVEL_GAMEMASTERS` for anything that mutates, downloads, opens Studio, or starts a pregen |
| Open to any player | Nothing | `LEVEL_ALL`: `help`, `version`, `info`, `worlds`, `height`, `metrics` (alias `measure`), and the whole `what` subtree |
| Deliberately gated reads | — | `seed` and `accesslist` stay at gamemaster level even though `worlds` shows similar output without the seed field |
| Tree feller | `iris.treefeller` (`plugin.yml` and `paper-plugin.yml`, default `op`) | Fabric `irisworldgen:treefeller`. Forge and NeoForge PermissionAPI node `irisworldgen.treefeller`, defaulting to gamemaster level |
| Help | Director mini-menu | `ModdedCommandHelp` sections with clickable pages |

Full command tables and stubs:
[04 - Commands & Permissions](/iris/04-commands-permissions).

## Feature matrix

| Feature | Bukkit | Fabric | Forge | NeoForge |
|---------|--------|--------|-------|----------|
| Core terrain / rivers / cave hydrology / biomes / objects / jigsaw | yes | yes | yes | yes |
| Typed image-map runtime / validation / packaging | yes | yes | yes | yes |
| Image-map desktop authoring and Vision layers | graphical host | graphical host | graphical host | graphical host |
| Dimension `worldBoundary` | native border | native border | native border | native border |
| Saved planar/spatial Iris jigsaw runtime | yes | yes | yes | yes |
| Jigsaw Studio (`/iris jigsaw` authoring tree) | yes | not registered | not registered | not registered |
| Pack validate / cleanup / restore / status | yes | yes | yes | yes |
| Pack download (`/iris download`, root-level on both) | yes | yes | yes | yes |
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
| Datapack Modrinth ingest / list / remove | yes | message only | message only | message only |
| Dimension-type datapack install / status | not applicable | yes | yes | yes |
| PlaceholderAPI | soft depend | no | no | no |
| Multiverse-Core | soft depend / loadbefore | no | no | no |
| Item plugins (ItemsAdder, Mythic, and similar) | paper soft deps | loader-specific / limited | limited | limited |
| Public API package `art.arcane.iris.api` | plugin jar | see [94 - API - Modded](/iris/94-api-modded) | same | same |
| Client HUD / protocol | optional client mod | optional client mod | optional | optional |
| Tree feller | settings + `iris.treefeller` | settings + loader permission | same | same |
| Auto Spigot/Paper timeout and watchdog config | yes | no | no | no |
| Custom biome restart prompts | yes (`iris.all` / op) | different datapack flow | same | same |

"Message only" means the command exists and prints an explanation of where
to run it instead. It is not a silent failure.

Jigsaw pack resources are shared runtime data. Only the in-game authoring
surface is Bukkit-only. Bukkit exposes one global Studio project and world
and one owning Jigsaw session. Non-owner block, inventory, interaction,
and mutating-command changes are cancelled across that Studio world.
Autosave and graph-operation barriers serialize the owner's changes. On
Folia a save schedules every intersecting chunk snapshot on its owning
region and writes only after the complete capture validates. These
protections have automated coverage but still need the live multi-region
runbook in [31 - Operator Runbooks](/iris/31-operator-runbooks). A strict
`VANILLA_PORTABLE` export targets unmodded Minecraft 26.2 and is a
separate compatibility gate.

## Platform-sensitive settings

| Setting | Where it matters |
|---------|------------------|
| `pregen.runtimeSchedulerMode` | Bukkit only. Resolved from Bukkit/Folia detection, and a regionized runtime always resolves to Folia |
| `pregen.paperLikeBackendMode` | Bukkit only. Ticket versus service chunk acquisition |
| `pregen.moddedPregenInFlight` | Mod loaders only. Concurrent pregen chunk budget |
| `autoConfiguration.*` | Bukkit only. Spigot keep-alive, Paper watchdog, custom-biome restart |
| `world.worldEditWandCUI` | Bukkit only. Requires WorldEdit |
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

See [28 - Integrations](/iris/28-integrations) and
[09 - PlaceholderAPI](/iris/09-placeholderapi).

## NMS and version binding

- The Bukkit plugin binds to a specific Paper/CraftBukkit revision (the
  in-tree v26 NMS module).
- Structure import and capture, and the vanilla import studio path, require
  that binding. This is why they cannot be ported to mod loaders as-is.
- Mod adapters use Minecraft mappings for the same game version line,
  without the Bukkit plugin APIs.

## Determinism and parity

GoldenHash exists on both surfaces. Only the command placement differs
(Bukkit under `developer`, modded at the root). Use disposable worlds.
Bukkit exposes mantle-reset and deep-dump options that modded does not.
Modded always resets mantle. Cross-platform comparisons always emit a
Minecraft-version warning because the two platforms report the version
string differently. Full procedure:
[32 - Determinism & Goldenhash](/iris/32-determinism-goldenhash).

Image maps use the same compiler, raw PNG channel rules, floor-based coordinates, and compiled sampling data on all platforms. A difference in decoded height, legend target, mask weight, image coverage, or applied boundary for identical pack bytes is a parity defect.

## Moving a pack between platform families

1. Freeze the pack bytes and seed. Validate and package on the source
   platform.
2. Finish anything Bukkit-only first: structure and vanilla imports,
   schematic conversion, WorldEdit imports, and Jigsaw Studio work.
   Complete the atomic saves before copying.
3. Copy only `packs/<key>/` into the destination packs root. Never copy a
   Bukkit world folder into a modded world or the reverse.
   Include referenced `images/` PNGs and `image-maps/` JSON resources; pack validation and packaging reject an incomplete image-map closure.
4. Restart so destination registries and forced datapacks are built before
   any world is created.
5. Align the `iris.json` keys that affect generation (`generator`,
   `performance`, `treeFeller`). Bukkit-only `autoConfiguration` keys can
   be ignored.
6. On mod loaders, set `modded.json` `primaryWorld` if you need overworld
   replacement.
7. Re-run `/iris pack validate`. Then run `/iris datapack status` on
   modded or the ingest flow on Bukkit.
8. Create a disposable world with the same seed. Run the same small
   GoldenHash inputs plus the platform's fresh-install runbook.

The move passes when validation, world creation, restart, and the
deterministic comparison all pass. Matching screenshots are useful
context. The hash comparison is what counts.

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
- [31 - Operator Runbooks](/iris/31-operator-runbooks)
- [32 - Determinism & Goldenhash](/iris/32-determinism-goldenhash)
- [37 - Image Map Concepts](/iris/37-image-map-concepts)
- [43 - Image Map Configuration & Coordinates](/iris/43-image-map-config-coordinates)
- [94 - API - Modded](/iris/94-api-modded)
