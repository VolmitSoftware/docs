---
title: "Overview"
description: "Iris documentation: Overview"
published: true
date: 2026-09-02T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Iris replaces the vanilla chunk generator. Terrain, biomes, caves, structures, objects, and entities come from editable JSON packs. The same engine is available as a Bukkit plugin and as a Fabric, Forge, or NeoForge mod. This branch targets Minecraft 26.2 and requires Java 25.

The four platforms generate identical chunks when the Iris version, pack, seed, and area match. Choose the guide for your task below.

## Who this documentation is for

Pages `00`–`44` cover server operation and pack authoring. Pages `90`–`94` cover the Java API. Pick the outcome you need below.

## Choose a learning path

| You want to | Read, in order |
|---|---|
| Get Iris running and make one world | [01 - Installation & Platforms](/iris/01-installation-platforms) → [02 - Getting Started](/iris/02-getting-started) → [31 - Operator Runbooks](/iris/31-operator-runbooks) |
| Write a pack from scratch | [05 - Concepts & Pack Layout](/iris/05-concepts-pack-layout) → [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas) → [26 - Example - Minimal Dimension](/iris/26-example-minimal-dimension) |
| Shape terrain and lay out biomes | [11 - Dimensions](/iris/11-dimensions) → [12 - Regions](/iris/12-regions) → [13 - Biomes](/iris/13-biomes) → [14 - Generators & Noise](/iris/14-generators-noise) |
| Drive generation from PNG data | [37 - Image Map Concepts](/iris/37-image-map-concepts) → [38 - Supported Image Inputs](/iris/38-supported-image-inputs) → the relevant type guide → [42 - Image Map Studio Workflow](/iris/42-image-map-studio-workflow) → [43 - Image Map Configuration & Coordinates](/iris/43-image-map-config-coordinates) |
| Browse every active built-in biome | [44 - Biome Catalog](/iris/44-biome-catalog) |
| Add caves, surface detail, and vegetation | [15 - Caves & Carving](/iris/15-caves-carving) → [16 - Surfaces, Decorators & Deposits](/iris/16-surfaces-decorators-deposits) → [17 - Trees, Fungi, Coral, Crystals, Formations, Ruins](/iris/17-trees-fungi-coral-crystals-formations-ruins) |
| Place a building or structure | [18 - Structures Overview](/iris/18-structures-overview) → [19 - Objects](/iris/19-objects) → [20 - Object Placement](/iris/20-object-placement) → [21 - Jigsaw Structures](/iris/21-jigsaw-structures) → [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks) |
| Control what vanilla still generates | [35 - Vanilla Passthrough](/iris/35-vanilla-passthrough) → [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks) for structures |
| Deploy a pack to a production server | [25 - Pack Management](/iris/25-pack-management) → [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle) → [07 - Pregeneration](/iris/07-pregeneration) → [31 - Operator Runbooks](/iris/31-operator-runbooks) |
| Make another plugin or mod work with Iris | [28 - Integrations](/iris/28-integrations) → [30 - Platform Differences](/iris/30-platform-differences). If you write Java against Iris, start at [90 - API - Getting Started](/iris/90-api-getting-started) |

Each tutorial page ends with something you can observe. That can be a world that loads, a chunk that generates, or a hotload that lands. Confirm that result before you open the next page.

Iris failures cascade in a misleading way. A biome key you type wrong in step two can show up three systems later as a cave, decorator, or structure that does not work. You then debug the wrong thing.

## Platforms

One plugin jar covers the whole Bukkit family. Each mod loader gets its own jar. Pick by what your server runs, not by feature set. The generator is the same code on all of them.

| Platform | Artifact | Minecraft | What is different |
|---|---|---|---|
| Paper / Purpur / Leaf / Canvas | plugin jar | 26.1.2 – 26.2 | Nothing. This is the reference plugin target |
| Spigot / CraftBukkit | plugin jar | 26.1.2 – 26.2 | Managed `iris:*` creation and generation. Exact vanilla-slot `/iris replace` is unavailable |
| Folia | plugin jar | 26.1.2 – 26.2 | Region-safe scheduling. `/iris create` builds the managed world live through Iris's Paper-like runtime backend without an ordinary restart. See [01 - Installation & Platforms](/iris/01-installation-platforms) and [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle) |
| Fabric | mod jar | 26.2 | Server worldgen plus an optional client HUD. Current acceptance target is Fabric Loader 0.19.3 on Java 25 |
| Forge | mod jar | 26.2 | Same. Current acceptance target is Forge 26.2-65.1.1 |
| NeoForge | mod jar | 26.2 | Same. Current acceptance target is NeoForge 26.2.0.59 |

Use `/iris`, `/ir`, or `/irs`. Most commands require `iris.all`; survival tree felling uses `iris.treefeller`.

## Feature map

Every Iris feature is on exactly one page. Find the subject, then go there.

| Area | What it covers | Doc |
|---|---|---|
| Install and platforms | Plugin vs mod jars, data dirs, first boot, native worldgen matrix | [01 - Installation & Platforms](/iris/01-installation-platforms) |
| First steps | Create, load, teleport, pregen, studio | [02 - Getting Started](/iris/02-getting-started) |
| Configuration | `iris.json` keys, defaults, hotload | [03 - Configuration](/iris/03-configuration) |
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
| Rivers | Terrain-first routing, hydraulic transitions, caves, deep fluids, and river policy | [36 - Rivers](/iris/36-rivers) |
| Image-map concepts | Typed resources, applications, runtime compiler, deterministic behavior | [37 - Image Map Concepts](/iris/37-image-map-concepts) |
| Supported image inputs | PNG dimensions, channel layouts, bit depths, and raw sample rules | [38 - Supported Image Inputs](/iris/38-supported-image-inputs) |
| Grayscale heightmaps | 8-bit and 16-bit scalar terrain decoding | [39 - Grayscale Heightmaps](/iris/39-grayscale-heightmaps) |
| RGB heightmaps | Canonical raw 24-bit height encoding | [40 - RGB Heightmaps](/iris/40-rgb-heightmaps) |
| Color maps and masks | Legends, raw sRGB tolerance, alpha, and mask composition | [41 - Color Maps & Masks](/iris/41-color-maps-masks) |
| Image Map Studio | Import, inspection, interpreted preview, presets, export, and validation | [42 - Image Map Studio Workflow](/iris/42-image-map-studio-workflow) |
| Image-map reference | Complete JSON, axes, transforms, sampling, and `worldBoundary` | [43 - Image Map Configuration & Coordinates](/iris/43-image-map-config-coordinates) |
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
| Overworld example | Editing the bundled overworld | [27 - Example - Configuring Overworld](/iris/27-example-configuring-overworld) |
| Integrations | WorldEdit, Multiverse, Mythic, item plugins, tree feller | [28 - Integrations](/iris/28-integrations) |
| Client HUD | Client mod HUD and protocol channel | [29 - Client HUD & Protocol](/iris/29-client-hud-protocol) |
| Platform matrix | Bukkit vs Fabric / Forge / NeoForge differences | [30 - Platform Differences](/iris/30-platform-differences) |
| Operator checks | Manual verification | [31 - Operator Runbooks](/iris/31-operator-runbooks) |
| Determinism | Goldenhash cross-platform gate | [32 - Determinism & Goldenhash](/iris/32-determinism-goldenhash) |
| Performance | Threads, mantle, SIMD, pregen caps | [33 - Performance Tuning](/iris/33-performance-tuning) |
| Multiverse | What Multiverse may and may not do with Iris worlds | [34 - Multiverse](/iris/34-multiverse) |
| API — setup | Bukkit public API dependency | [90 - API - Getting Started](/iris/90-api-getting-started) |
| API — terrain | Terrain query service | [91 - API - Terrain](/iris/91-api-terrain) |
| API — events | Engine and pregen events | [92 - API - World Events](/iris/92-api-world-events) |
| API — tree feller | Tree feller service | [93 - API - Tree Feller](/iris/93-api-tree-feller) |
| API — modded | Modded public API (`art.arcane.iris.modded.api`) | [94 - API - Modded](/iris/94-api-modded) |

## Content model

Seven terms carry most of the documentation. Learn them here. The rest of the set then reads faster.

| Term | What it is |
|---|---|
| Pack | A folder of JSON and `.iob` files under `packs/<key>/`. It needs at least one `dimensions/*.json` to count as a pack at all — a folder without one is treated as absent and will be re-downloaded |
| Dimension | The root config for one world type: height range, generation modes, which regions it uses, what native content it imports. One dimension file is one world's ruleset |
| Region / biome / generator | The authoring units under a dimension. Regions divide the map, biomes fill regions, generators produce the actual heightmap noise |
| Object / structure | Placed content. An object is a single saved build (`.iob`). A structure is either an Iris jigsaw of several objects, or a vanilla/datapack/mod structure Iris allows through |
| Image map | A typed `image-maps/<key>.json` resource that decodes and places one canonical PNG as height, categorical, or mask data. Dimensions bind maps to generation applications |
| Studio | A throwaway authoring world that reads the live pack folder and hotloads your edits into new chunks. Deleted when you close it, and any leftovers are purged at startup |
| World pack snapshot | A production world copies the pack into `<world>/iris/pack` at creation and reads only that copy forever after. This is the single most common source of "my edits did nothing" — see [05 - Concepts & Pack Layout](/iris/05-concepts-pack-layout) |
