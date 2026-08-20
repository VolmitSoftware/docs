---
title: "Overview"
description: "Iris documentation: Overview"
published: true
date: 2026-08-20T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Iris replaces the vanilla chunk generator. Terrain, biomes, caves, structures, objects, and entities come from editable JSON packs. The same engine ships as a Bukkit plugin and as a Fabric, Forge, or NeoForge mod. This branch targets Minecraft 26.2 and requires Java 25.

The four platforms generate identical chunks when artifacts, pack bytes, seed, and area match. This page maps the documentation set. Find the page you need, then leave.

## Who this documentation is for

There are three audiences. The page numbers reflect them. Pages `00`–`35` are for **server operators** who install Iris and **pack authors** who write dimensions. Read them in the order a newcomer needs. Pages `85`–`87` are **maintainer** checklists for a release. Pages `90`–`94` are for **Java developers** who use the Iris API from a plugin or mod.

Do not read the set from front to back. Pick the outcome you want from the table below. Follow only that row.

## Choose a learning path

| You want to | Read, in order |
|---|---|
| Get Iris running and make one world | [01 - Installation & Platforms](/iris/01-installation-platforms) → [02 - Getting Started](/iris/02-getting-started) → [31 - Operator Runbooks](/iris/31-operator-runbooks) |
| Write a pack from scratch | [05 - Concepts & Pack Layout](/iris/05-concepts-pack-layout) → [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas) → [26 - Example - Minimal Dimension](/iris/26-example-minimal-dimension) |
| Shape terrain and lay out biomes | [11 - Dimensions](/iris/11-dimensions) → [12 - Regions](/iris/12-regions) → [13 - Biomes](/iris/13-biomes) → [14 - Generators & Noise](/iris/14-generators-noise) |
| Add caves, surface detail, and vegetation | [15 - Caves & Carving](/iris/15-caves-carving) → [16 - Surfaces, Decorators & Deposits](/iris/16-surfaces-decorators-deposits) → [17 - Trees, Fungi, Coral, Crystals, Formations, Ruins](/iris/17-trees-fungi-coral-crystals-formations-ruins) |
| Place a building or structure | [18 - Structures Overview](/iris/18-structures-overview) → [19 - Objects](/iris/19-objects) → [20 - Object Placement](/iris/20-object-placement) → [21 - Jigsaw Structures](/iris/21-jigsaw-structures) → [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks) |
| Control what vanilla still generates | [35 - Vanilla Passthrough](/iris/35-vanilla-passthrough) → [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks) for structures |
| Ship a pack to a production server | [25 - Pack Management](/iris/25-pack-management) → [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle) → [07 - Pregeneration](/iris/07-pregeneration) → [31 - Operator Runbooks](/iris/31-operator-runbooks) |
| Make another plugin or mod work with Iris | [28 - Integrations](/iris/28-integrations) → [30 - Platform Differences](/iris/30-platform-differences). If you write Java against Iris, start at [90 - API - Getting Started](/iris/90-api-getting-started) |

Each tutorial page ends with something you can observe. That can be a world that loads, a chunk that generates, or a hotload that lands. Confirm that result before you open the next page.

Iris failures cascade in a misleading way. A biome key you type wrong in step two can show up three systems later as a cave, decorator, or structure that does not work. You then debug the wrong thing.

## Platforms

One plugin jar covers the whole Bukkit family. Each mod loader gets its own jar. Pick by what your server runs, not by feature set. The generator is the same code on all of them.

| Platform | Artifact | Minecraft | What is different |
|---|---|---|---|
| Paper / Purpur / Leaf / Canvas | plugin jar | 26.1.2 – 26.2 | Nothing. This is the reference plugin target |
| Spigot / CraftBukkit | plugin jar | 26.1.2 – 26.2 | Managed `iris:*` creation and generation. Exact vanilla-slot `/iris replace` is unavailable |
| Folia | plugin jar | 26.1.2 – 26.2 | Region-safe scheduling. `/iris create` cannot build a live world at runtime, so it stages the world and automatically requests a restart. See [01 - Installation & Platforms](/iris/01-installation-platforms) and [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle) |
| Fabric | mod jar | 26.2 | Server worldgen plus an optional client HUD. Current acceptance target is Fabric Loader 0.19.3 on Java 25 |
| Forge | mod jar | 26.2 | Same. Current acceptance target is Forge 26.2-65.1.1 |
| NeoForge | mod jar | 26.2 | Same. Current acceptance target is NeoForge 26.2.0.59 |

The plugin registers as `Iris` with command `/iris` (aliases `/ir`, `/irs`). It sets `folia-supported: true`, `load: STARTUP`, and `api-version: 26.1`. The low api-version is deliberate so one jar loads on both 26.1.2 and 26.2.

The descriptor declares two permissions. `iris.all` covers the whole command tree. `iris.treefeller` covers survival tree felling only. Both default to op.

Optional soft-dependencies load before Iris. Multiverse-Core is ordered *after* Iris so Multiverse sees Iris generators once they exist. The full list is in [01 - Installation & Platforms](/iris/01-installation-platforms).

All three mod loaders use mod id `irisworldgen`. They register `/ir` and `/irs` as command redirects the same way the plugin does.

## Feature map

Every Iris feature is on exactly one page. Find the subject, then go there.

| Area | What it covers | Doc |
|---|---|---|
| Install and platforms | Plugin vs mod jars, data dirs, first boot, native worldgen matrix | [01 - Installation & Platforms](/iris/01-installation-platforms) |
| First steps | Create, load, teleport, pregen, studio | [02 - Getting Started](/iris/02-getting-started) |
| Configuration | `settings.json` keys, defaults, hotload | [03 - Configuration](/iris/03-configuration) |
| Commands and permissions | Full `/iris` tree, Bukkit vs modded argument style | [04 - Commands & Permissions](/iris/04-commands-permissions) |
| Pack layout | Roots, keys, snippets, world snapshot vs studio | [05 - Concepts & Pack Layout](/iris/05-concepts-pack-layout) |
| Worlds | create / load / unload / remove, main world, Folia, pack copy | [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle) |
| Pregeneration | Jobs, cache, mantle, HUD | [07 - Pregeneration](/iris/07-pregeneration) |
| Localization | Locales, overrides, client lang | [08 - Localization](/iris/08-localization) |
| PlaceholderAPI | `%iris_…%` keys and migration | [09 - PlaceholderAPI](/iris/09-placeholderapi) |
| Studio and schemas | Studio worlds, VSCode workspace, hotload | [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas) |
| Dimensions | Dimension JSON, modes, height, imports | [11 - Dimensions](/iris/11-dimensions) |
| Regions | Region-level content | [12 - Regions](/iris/12-regions) |
| Biomes | Biome JSON, layers, custom biomes, spawns | [13 - Biomes](/iris/13-biomes) |
| Generators and noise | Generators, styles, expressions, images | [14 - Generators & Noise](/iris/14-generators-noise) |
| Caves and carving | Cave profiles, field modules | [15 - Caves & Carving](/iris/15-caves-carving) |
| Surfaces | Decorators, deposits, palettes | [16 - Surfaces, Decorators & Deposits](/iris/16-surfaces-decorators-deposits) |
| Procedural decoration | Trees, fungi, coral, crystals, formations, ruins | [17 - Trees, Fungi, Coral, Crystals, Formations, Ruins](/iris/17-trees-fungi-coral-crystals-formations-ruins) |
| Structures overview | Objects vs jigsaw vs native | [18 - Structures Overview](/iris/18-structures-overview) |
| Objects | Creating and importing `.iob` | [19 - Objects](/iris/19-objects) |
| Object placement | Placing objects in biomes and regions | [20 - Object Placement](/iris/20-object-placement) |
| Jigsaw | Iris multi-piece structures | [21 - Jigsaw Structures](/iris/21-jigsaw-structures) |
| Native structures | Vanilla / datapack structures on Iris | [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks) |
| Vanilla passthrough | Enable, deny, or replace vanilla features, mobs, loot, saplings, and gameplay | [35 - Vanilla Passthrough](/iris/35-vanilla-passthrough) |
| Loot and entities | Pack entities, loot, spawners, markers | [23 - Loot, Entities, Spawners, Markers](/iris/23-loot-entities-spawners-markers) |
| Pack extensions | Reusable snippets and the inactive pack-mod schema | [24 - Pack Mods & Snippets](/iris/24-pack-mods-snippets) |
| Pack management | Download, validate, cleanup, package, update-world | [25 - Pack Management](/iris/25-pack-management) |
| Minimal pack example | Walkthrough | [26 - Example - Minimal Dimension](/iris/26-example-minimal-dimension) |
| Overworld example | Editing the shipping overworld | [27 - Example - Configuring Overworld](/iris/27-example-configuring-overworld) |
| Integrations | WorldEdit, Multiverse, Mythic, item plugins, tree feller | [28 - Integrations](/iris/28-integrations) |
| Client HUD | Client mod HUD and protocol channel | [29 - Client HUD & Protocol](/iris/29-client-hud-protocol) |
| Platform matrix | Bukkit vs Fabric / Forge / NeoForge differences | [30 - Platform Differences](/iris/30-platform-differences) |
| Operator checks | Manual verification | [31 - Operator Runbooks](/iris/31-operator-runbooks) |
| Determinism | Goldenhash cross-platform gate | [32 - Determinism & Goldenhash](/iris/32-determinism-goldenhash) |
| Performance | Threads, mantle, SIMD, pregen caps | [33 - Performance Tuning](/iris/33-performance-tuning) |
| Multiverse | What Multiverse may and may not do with Iris worlds | [34 - Multiverse](/iris/34-multiverse) |
| Maintainer — MC version bump | Version bump procedure | [85 - Maintainer - MC Version Bump](/iris/85-maintainer-mc-version-bump) |
| Maintainer — release | Release steps | [86 - Maintainer - Release Checklist](/iris/86-maintainer-release-checklist) |
| Maintainer — readiness | Living readiness tracker | [87 - Maintainer - Release Readiness](/iris/87-maintainer-release-readiness) |
| API — setup | Bukkit public API dependency | [90 - API - Getting Started](/iris/90-api-getting-started) |
| API — terrain | Terrain query service | [91 - API - Terrain](/iris/91-api-terrain) |
| API — events | Engine and pregen events | [92 - API - World Events](/iris/92-api-world-events) |
| API — tree feller | Tree feller service | [93 - API - Tree Feller](/iris/93-api-tree-feller) |
| API — modded | Modded public API (`art.arcane.iris.modded.api`) | [94 - API - Modded](/iris/94-api-modded) |

## Content model

Six terms carry most of the documentation. Learn them here. The rest of the set then reads faster.

| Term | What it is |
|---|---|
| Pack | A folder of JSON and `.iob` files under `packs/<key>/`. It needs at least one `dimensions/*.json` to count as a pack at all — a folder without one is treated as absent and will be re-downloaded |
| Dimension | The root config for one world type: height range, generation modes, which regions it uses, what native content it imports. One dimension file is one world's ruleset |
| Region / biome / generator | The authoring units under a dimension. Regions divide the map, biomes fill regions, generators produce the actual heightmap noise |
| Object / structure | Placed content. An object is a single saved build (`.iob`). A structure is either an Iris jigsaw of several objects, or a vanilla/datapack/mod structure Iris allows through |
| Studio | A throwaway authoring world that reads the live pack folder and hotloads your edits into new chunks. Deleted when you close it, and any leftovers are purged at startup |
| World pack snapshot | A production world copies the pack into `<world>/iris/pack` at creation and reads only that copy forever after. This is the single most common source of "my edits did nothing" — see [05 - Concepts & Pack Layout](/iris/05-concepts-pack-layout) |

## Project layout

This section is for you if you build Iris or file a bug against a specific subsystem.

| Path | Role |
|---|---|
| `core/` | The engine: pack loader, generation pipeline, pregen, studio services, localization catalogs. Pure JVM, no platform types |
| `core/agent/` | Java instrumentation agent (premain/agent-class jar) consumed by the core build |
| `spi/` | The platform contract (`IrisPlatform`, protocol types) that lets `core/` stay platform-free |
| `adapters/bukkit/plugin/` | Bukkit plugin main class, the Director command tree, the public Bukkit API, and both plugin descriptors |
| `adapters/bukkit/nms/v26_2_R1/` | NMS bindings for the current Minecraft line |
| `adapters/minecraft-common/` | Source shared by the Bukkit and mod-loader adapters |
| `adapters/modded-common/` | Source shared by Fabric, Forge, and NeoForge: worldgen hooks, Brigadier commands, services |
| `adapters/client-common/` | Client-dist source: HUD, keybinds, world-type screens |
| `adapters/fabric/`, `adapters/forge/`, `adapters/neoforge/` | The three loader builds. Each is a standalone Gradle build with its own `settings.gradle` |
| `probe/` | Offline tooling and a stub platform for running the engine without a server |
| `buildSrc/` | Gradle helpers: artifact verification, NMS bindings, API generation |
| `dist/` | Where `buildAllToOut` drops the finished consumer jars |
| `docs/` | This documentation set, which is the authority over any hosted copy |

`minecraft-common`, `modded-common`, and `client-common` are source trees only. They have no `build.gradle` and are not Gradle projects. The loader builds pull them in as extra source directories.

## Developer build check

Set `JAVA_HOME` to a JDK 25. Then from the Iris root:

```text
java -version
./gradlew build
./gradlew buildAllToOut
```

The check passes when `build` finishes with no failed tasks. `buildAllToOut` must leave one current jar per platform in `dist/`. `build` already runs the tests. Use `./gradlew test` only when you want to rerun tests without reassembling every artifact.

At version `4.0.0-26.2` the four jars are named like this. The CraftBukkit one carries the supported Minecraft *range*. The loader jars carry `<mc>+<loader>`:

```text
Iris v4.0.0-26.2 [CraftBukkit] 26.1.2-26.2.jar
Iris v4.0.0-26.2 [Fabric] 26.2+0.19.3.jar
Iris v4.0.0-26.2 [Forge] 26.2+65.1.1.jar
Iris v4.0.0-26.2 [NeoForge] 26.2+26.2.0.59.jar
```

Build one platform at a time with `./gradlew buildBukkit`, `buildFabric`, `buildForge`, or `buildNeoforge`. The SPI jar comes from `./gradlew :spi:jar` and lands in `spi/build/libs/`.

To iterate on a loader adapter, drive it from its own project root. These are separate Gradle builds. A root-level invocation does not reach them:

```text
./gradlew -p adapters/fabric   runServer
./gradlew -p adapters/forge    runServer
./gradlew -p adapters/neoforge runServer
```

`-PincludeModdedAdapters=true` surfaces those builds in the root composite for IDE import. It is off by default. Each adapter includes the root build back for `core`/`spi` substitution, which closes a composite cycle.

A passing Bukkit jar proves nothing about the loaders. Loom, ForgeGradle, and ModDevGradle each fail in their own ways. If a loader build breaks while the root build is green, rerun that adapter from its own root. Fix its first error. Do not rerun the root build.

The current version lives in `gradle.properties` as `irisVersion=4.0.0-26.2`.

Next: install Iris with [01 - Installation & Platforms](/iris/01-installation-platforms).
