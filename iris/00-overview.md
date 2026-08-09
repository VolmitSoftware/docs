---
title: Overview
description: Iris documentation: Overview
published: true
date: 2026-08-09T00:00:00.000Z
tags: iris
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Iris is a world generation engine for Minecraft servers and mod loaders. It builds terrain, biomes, caves, structures, objects, and entities from editable JSON packs, exposes an in-game studio authoring workflow, and runs as a Bukkit-family plugin or as a Fabric, Forge, or NeoForge server mod. Cross-platform generation is designed and tested for deterministic parity when artifacts, pack bytes, seeds, and test areas are identical; verify release candidates with GoldenHash. This branch targets Minecraft 26.2; Java 25 is required everywhere.

## Platforms

| Platform | Artifact | Minecraft | Notes |
|---|---|---|---|
| Paper / Purpur / Leaf / Canvas | plugin jar | 26.1.2 – 26.2 | Full plugin feature set |
| Folia | plugin jar | 26.1.2 – 26.2 | Region-safe scheduling; runtime world create is staged for restart (see [Installation & Platforms](/iris/01-installation-platforms), [Worlds & Lifecycle](/iris/06-worlds-lifecycle)) |
| Spigot / CraftBukkit | plugin jar | 26.1.2 – 26.2 | Full plugin feature set |
| Fabric | mod jar | 26.2 | Server worldgen + client HUD; Fabric Loader 0.19.3+ |
| Forge | mod jar | 26.2 | Server worldgen + client HUD; Forge 65.0.4+ |
| NeoForge | mod jar | 26.2 | Server worldgen + client HUD; NeoForge 26.2.0.12-beta+ |

Plugin identity: name `Iris` (from root project name), command `iris` with aliases `ir` / `irs`, `folia-supported: true`, `load: STARTUP`, `api-version` 26.1 (loads on 26.1.2 and 26.2). Soft-depends include PlaceholderAPI, WorldEdit, item plugins, MythicMobs; Multiverse-Core is ordered after Iris (`loadbefore` / paper `load: AFTER`).

Mod id on all three loaders: `irisworldgen`.

## Feature map

| Area | What it covers | Doc |
|---|---|---|
| Install and platforms | Plugin vs mod jars, data dirs, first boot, native worldgen matrix | [Installation & Platforms](/iris/01-installation-platforms) |
| First steps | Create, load, teleport, pregen, studio | [Getting Started](/iris/02-getting-started) |
| Configuration | `settings.json` keys, defaults, hotload | [Configuration](/iris/03-configuration) |
| Commands and permissions | Full `/iris` tree, Bukkit vs modded argument style | [Commands & Permissions](/iris/04-commands-permissions) |
| Pack layout | Roots, keys, snippets, world snapshot vs studio | [Concepts & Pack Layout](/iris/05-concepts-pack-layout) |
| Worlds | create / load / unload / remove, main world, Folia, pack copy | [Worlds & Lifecycle](/iris/06-worlds-lifecycle) |
| Pregeneration | Jobs, cache, mantle, HUD | [Pregeneration](/iris/07-pregeneration) |
| Localization | Locales, overrides, client lang | [Localization](/iris/08-localization) |
| PlaceholderAPI | `%iris_…%` keys and migration | [PlaceholderAPI](/iris/09-placeholderapi) |
| Studio and schemas | Studio worlds, VSCode workspace, hotload | [Studio & VSCode Schemas](/iris/10-studio-vscode-schemas) |
| Dimensions | Dimension JSON, modes, height, imports | [Dimensions](/iris/11-dimensions) |
| Regions | Region-level content | [Regions](/iris/12-regions) |
| Biomes | Biome JSON, layers, custom biomes, spawns | [Biomes](/iris/13-biomes) |
| Generators and noise | Generators, styles, expressions, images | [Generators & Noise](/iris/14-generators-noise) |
| Caves and carving | Cave profiles, field modules | [Caves & Carving](/iris/15-caves-carving) |
| Surfaces | Decorators, deposits, palettes | [Surfaces, Decorators & Deposits](/iris/16-surfaces-decorators-deposits) |
| Procedural decoration | Trees, fungi, coral, crystals, formations, ruins | [Trees, Fungi, Coral, Crystals, Formations, Ruins](/iris/17-trees-fungi-coral-crystals-formations-ruins) |
| Structures overview | Objects vs jigsaw vs native | [Structures Overview](/iris/18-structures-overview) |
| Objects | Creating and importing `.iob` | [Objects](/iris/19-objects) |
| Object placement | Placing objects in biomes and regions | [Object Placement](/iris/20-object-placement) |
| Jigsaw | Iris multi-piece structures | [Jigsaw Structures](/iris/21-jigsaw-structures) |
| Native structures | Vanilla / datapack structures on Iris | [Native Structures & Datapacks](/iris/22-native-structures-datapacks) |
| Loot and entities | Pack entities, loot, spawners, markers | [Loot, Entities, Spawners, Markers](/iris/23-loot-entities-spawners-markers) |
| Pack extensions | Reusable snippets and the inactive pack-mod schema | [Pack Mods & Snippets](/iris/24-pack-mods-snippets) |
| Pack management | Download, validate, cleanup, package, update-world | [Pack Management](/iris/25-pack-management) |
| Minimal pack example | Walkthrough | [Example - Minimal Dimension](/iris/26-example-minimal-dimension) |
| Overworld example | Editing the shipping overworld | [Example - Configuring Overworld](/iris/27-example-configuring-overworld) |
| Integrations | WorldEdit, Multiverse, Mythic, item plugins, tree feller | [Integrations](/iris/28-integrations) |
| Client HUD | Client mod HUD and protocol channel | [Client HUD & Protocol](/iris/29-client-hud-protocol) |
| Platform matrix | Bukkit vs Fabric / Forge / NeoForge differences | [Platform Differences](/iris/30-platform-differences) |
| Operator checks | Manual verification | [Operator Runbooks & Smoke Tests](/iris/31-operator-runbooks-smoke-tests) |
| Determinism | Goldenhash cross-platform gate | [Determinism & Goldenhash](/iris/32-determinism-goldenhash) |
| Performance | Threads, mantle, SIMD, pregen caps | [Performance Tuning](/iris/33-performance-tuning) |
| Maintainer — MC version bump | Version bump procedure | [Maintainer - MC Version Bump](/iris/85-maintainer-mc-version-bump) |
| Maintainer — release | Release steps | [Maintainer - Release Checklist](/iris/86-maintainer-release-checklist) |
| Maintainer — readiness | Living readiness tracker | [Maintainer - Release Readiness](/iris/87-maintainer-release-readiness) |
| API — setup | Bukkit public API dependency | [API - Getting Started](/iris/90-api-getting-started) |
| API — terrain | Terrain query service | [API - Terrain](/iris/91-api-terrain) |
| API — events | Engine and pregen events | [API - World Events](/iris/92-api-world-events) |
| API — tree feller | Tree feller service | [API - Tree Feller](/iris/93-api-tree-feller) |
| API — modded | Modded public API (`art.arcane.iris.modded.api`) | [API - Modded](/iris/94-api-modded) |

Docs `00`–`33` are for operators and pack authors in reading order. `85`–`87` are maintainer checklists. `90`–`94` are for plugin and mod developers.

## Content model (brief)

| Term | Meaning |
|---|---|
| Pack | Directory of JSON and `.iob` under `packs/<key>/` with at least `dimensions/*.json` |
| Dimension | Root config for a world type (height, modes, regions, imports) |
| Region / biome / generator | Spatial and terrain authoring units |
| Object / structure | Placed content (`.iob`, Iris jigsaw, native or datapack structures) |
| Studio | Transient authoring world with live pack hotload and VSCode schemas; deleted on close and purged at startup |
| World pack snapshot | Production worlds copy the pack into `<world>/iris/pack` and read that copy (see [Concepts & Pack Layout](/iris/05-concepts-pack-layout)) |

## Project layout

| Path | Role |
|---|---|
| `core/` | Pure-JVM engine, pack loader, pregen, studio services, localization catalogs |
| `core/agent/` | Agent helper module used by the core build |
| `spi/` | Platform SPI and pure-JVM contracts (`IrisPlatform`, protocol types) |
| `adapters/bukkit/plugin/` | Bukkit plugin main, commands, public Bukkit API, Paper plugin descriptor |
| `adapters/bukkit/nms/v26_2_R1/` | NMS bindings for the current Minecraft line |
| `adapters/minecraft-common/` | Shared adapter code used by Bukkit and mod loaders |
| `adapters/modded-common/` | Shared Fabric / Forge / NeoForge worldgen, commands, services |
| `adapters/client-common/` | Client HUD and world-type screens |
| `adapters/fabric/`, `adapters/forge/`, `adapters/neoforge/` | Standalone loader builds (own `settings.gradle`) |
| `probe/` | Offline tooling and stub platform |
| `buildSrc/` | Shared Gradle helpers (artifact verification, API generation) |
| `dist/` | Built consumer jars after `buildAllToOut` |
| `docs/` | Authoritative product and API documentation |

## Building

Requirements: JDK 25 (`JAVA_HOME` set). From the Iris repo root:

```
./gradlew build
./gradlew test
./gradlew buildAllToOut
```

`buildAllToOut` writes every platform jar into `dist/`:

```
Iris v<version> [CraftBukkit] <mc>.jar
Iris v<version> [Fabric] <mc>+<loader>.jar
Iris v<version> [Forge] <mc>+<loader>.jar
Iris v<version> [NeoForge] <mc>+<loader>.jar
```

Per-platform: `./gradlew buildBukkit`, `buildFabric`, `buildForge`, `buildNeoforge`. SPI jar: `./gradlew :spi:jar` → `spi/build/libs/`.

Modded adapters are driven with their own project root when developing:

```
./gradlew -p adapters/fabric   runServer
./gradlew -p adapters/forge    runServer
./gradlew -p adapters/neoforge runServer
```

`-PincludeModdedAdapters=true` can surface those builds in the root composite for IDE import only; it is off by default because each adapter includes the root build back for `core`/`spi` substitution.

Current version property: `irisVersion=4.0.0-26.2` in `gradle.properties`.
