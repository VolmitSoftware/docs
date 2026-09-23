---
title: "Overview"
description: "Iris documentation: Overview"
published: true
date: 2026-09-23T11:12:42.385Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Iris replaces the vanilla chunk generator. Terrain, biomes, caves, structures, objects, and entities come from editable JSON packs. The same engine is available as a Bukkit plugin and as a Fabric, Forge, or NeoForge mod. Java 25 is required.

The guides cover server operation and pack authoring. Pages `90`–`94` cover the Java API.

## Choose a learning path

| You want to | Read, in order |
|---|---|
| Get Iris running and make one world | [01 - Installation & Platforms](/iris/01-installation-platforms) → [02 - Getting Started](/iris/02-getting-started) |
| Write a pack from scratch | [05 - Concepts & Pack Layout](/iris/05-concepts-pack-layout) → [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas) → [26 - Example - Minimal Dimension](/iris/26-example-minimal-dimension) |
| Shape terrain and lay out biomes | [11 - Dimensions](/iris/11-dimensions) → [12 - Regions](/iris/12-regions) → [13 - Biomes](/iris/13-biomes) → [14 - Generators & Noise](/iris/14-generators-noise) → [47 - Volumetric Terrain](/iris/47-volumetric-terrain) |
| Drive generation from PNG data | [37 - Image Maps](/iris/37-image-maps) → [38 - Image Map Encodings](/iris/38-image-map-encodings) → [43 - Image Map Configuration & Coordinates](/iris/43-image-map-config-coordinates) |
| Browse every active built-in biome | [44 - Biome Catalog](/iris/44-biome-catalog) |
| Add caves, surface detail, and vegetation | [15 - Caves & Carving](/iris/15-caves-carving) → [16 - Surfaces, Decorators & Deposits](/iris/16-surfaces-decorators-deposits) → [17 - Procedural Objects](/iris/17-procedural-objects) |
| Place a building or structure | [18 - Structures Overview](/iris/18-structures-overview) → [19 - Objects](/iris/19-objects) → [20 - Object Placement](/iris/20-object-placement) → [21 - Jigsaw Structures](/iris/21-jigsaw-structures) → [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks) |
| Control what vanilla still generates | [35 - Vanilla Passthrough](/iris/35-vanilla-passthrough) → [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks) for structures |
| Deploy a pack to a production server | [25 - Pack Management](/iris/25-pack-management) → [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle) → [07 - Pregeneration](/iris/07-pregeneration) |
| Make another plugin or mod work with Iris | [28 - Integrations](/iris/28-integrations) → [30 - Platform Differences](/iris/30-platform-differences). If you write Java against Iris, start at [90 - API - Getting Started](/iris/90-api-getting-started) |

## Platforms

One plugin jar covers the Bukkit family. Each mod loader has its own jar.

| Platform | Artifact | Minecraft | What is different |
|---|---|---|---|
| Paper / Purpur / Leaf / Canvas | plugin jar | 26.1.2 – 26.2 | Nothing. This is the reference plugin target |
| Spigot / CraftBukkit | plugin jar | 26.1.2 – 26.2 | Managed `iris:*` creation and generation. Exact vanilla-slot `/iris replace` is unavailable |
| Folia | plugin jar | 26.1.2 – 26.2 | `/iris create` creates managed worlds without a restart. See [01 - Installation & Platforms](/iris/01-installation-platforms) and [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle) |
| Fabric | mod jar | 26.2 | Server worldgen plus an optional client HUD. Requires Fabric Loader 0.19.3+ and Java 25 |
| Forge | mod jar | 26.2 | Same. Forge 65.x |
| NeoForge | mod jar | 26.2 | Same. NeoForge 26.2.x |

Use `/iris`, `/ir`, or `/irs`. Most commands require `iris.all`; survival tree felling uses `iris.treefeller`.

## Feature map

| Area | What it covers | Doc |
|---|---|---|
| Install and platforms | Plugin vs mod jars, data dirs, first boot, native worldgen matrix | [01 - Installation & Platforms](/iris/01-installation-platforms) |
| First steps | Create, load, teleport, pregen, studio | [02 - Getting Started](/iris/02-getting-started) |
| Configuration | `iris.json` keys, defaults, hotload | [03 - Configuration](/iris/03-configuration) |
| Commands and permissions | Full `/iris` tree, Bukkit vs modded argument style | [04 - Commands & Permissions](/iris/04-commands-permissions) |
| Pack layout | Roots, keys, snippets, generation history vs Studio | [05 - Concepts & Pack Layout](/iris/05-concepts-pack-layout) |
| Worlds | create / update / load / unload / remove, main world, Folia, generation history | [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle) |
| Pregeneration | Starting, pausing, stopping, and viewing jobs | [07 - Pregeneration](/iris/07-pregeneration) |
| Localization | Locales, overrides, client lang | [08 - Localization](/iris/08-localization) |
| PlaceholderAPI | `%iris_…%` keys and display formats | [09 - PlaceholderAPI](/iris/09-placeholderapi) |
| Studio and schemas | Studio worlds, VSCode workspace, hotload | [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas) |
| Dimensions | Dimension JSON, modes, height, imports | [11 - Dimensions](/iris/11-dimensions) |
| Regions | Region-level content | [12 - Regions](/iris/12-regions) |
| Biomes | Biome JSON, layers, custom biomes, spawns | [13 - Biomes](/iris/13-biomes) |
| Generators and noise | Generators, styles, expressions, images | [14 - Generators & Noise](/iris/14-generators-noise) |
| Volumetric terrain | Biome `terrain3D` profiles, spans, and ledges | [47 - Volumetric Terrain](/iris/47-volumetric-terrain) |
| Noise atlas | All style previews, 3D slices, zoom and octave comparisons, PDF | [45 - Noise Atlas](/iris/45-noise-atlas) |
| Caves and carving | Cave profiles, field modules | [15 - Caves & Carving](/iris/15-caves-carving) |
| Rivers | River layout, waterfalls, caves, and deep fluids | [36 - Rivers](/iris/36-rivers) |
| River policy | Where rivers start, transit and end, local budgets, and river content | [36b - River Policy](/iris/36b-river-policy) |
| River inspection | Vision and `/iris find river` | [36c - River Inspection](/iris/36c-river-inspection) |
| Image maps | Typed resources, applications, accepted PNG inputs, and the Image Map Studio workflow | [37 - Image Maps](/iris/37-image-maps) |
| Image-map encodings | Grayscale and RGB heights, color legends, tolerance, alpha, and mask composition | [38 - Image Map Encodings](/iris/38-image-map-encodings) |
| Image-map reference | Complete JSON, axes, transforms, sampling, and `worldBoundary` | [43 - Image Map Configuration & Coordinates](/iris/43-image-map-config-coordinates) |
| Surfaces | Decorators, deposits, palettes | [16 - Surfaces, Decorators & Deposits](/iris/16-surfaces-decorators-deposits) |
| Procedural decoration | Fungi, coral, crystals, formations, ruins | [17 - Procedural Objects](/iris/17-procedural-objects) |
| Procedural trees | Trunk, canopy, branches, roots | [17b - Procedural Trees](/iris/17b-procedural-trees) |
| Structures overview | Objects vs jigsaw vs native | [18 - Structures Overview](/iris/18-structures-overview) |
| Objects | Creating and importing `.iob` | [19 - Objects](/iris/19-objects) |
| Object placement | Placing objects in biomes and regions | [20 - Object Placement](/iris/20-object-placement) |
| Jigsaw | Iris multi-piece structures | [21 - Jigsaw Structures](/iris/21-jigsaw-structures) |
| Native structures | Vanilla / datapack structures on Iris | [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks) |
| Vanilla passthrough | Enable, deny, or replace vanilla features, mobs, loot, saplings, and gameplay | [35 - Vanilla Passthrough](/iris/35-vanilla-passthrough) |
| Loot and entities | Pack entities, loot, spawners, markers | [23 - Loot](/iris/23-loot), [23b - Entities & Spawners](/iris/23b-entities-spawners), [23c - Markers](/iris/23c-markers) |
| Pack extensions | Reusable JSON snippets | [24 - Snippets](/iris/24-pack-mods-snippets) |
| Pack management | Download, validate, cleanup, package, update-world | [25 - Pack Management](/iris/25-pack-management) |
| Minimal pack example | Walkthrough | [26 - Example - Minimal Dimension](/iris/26-example-minimal-dimension) |
| Overworld example | Editing the bundled overworld | [27 - Example - Configuring Overworld](/iris/27-example-configuring-overworld) |
| Integrations | WorldEdit, Multiverse, Mythic, item plugins, tree feller | [28 - Integrations](/iris/28-integrations) |
| Client HUD | Client HUD controls and maps | [29 - Client HUD & Maps](/iris/29-client-hud-protocol) |
| Platform matrix | Bukkit vs Fabric / Forge / NeoForge differences | [30 - Platform Differences](/iris/30-platform-differences) |
| Multiverse | What Multiverse may and may not do with Iris worlds | [34 - Multiverse](/iris/34-multiverse) |
| API — setup | Bukkit public API dependency | [90 - API - Getting Started](/iris/90-api-getting-started) |
| API — terrain | Terrain query service | [91 - API - Terrain](/iris/91-api-terrain) |
| API — events | Engine and pregen events | [92 - API - World Events](/iris/92-api-world-events) |
| API — tree feller | Tree feller service | [93 - API - Tree Feller](/iris/93-api-tree-feller) |
| API — modded | Modded public API (`art.arcane.iris.modded.api`) | [94 - API - Modded](/iris/94-api-modded) |

## Content model

Seven terms carry most of the documentation.

| Term | What it is |
|---|---|
| Pack | A folder of JSON and `.iob` files under `packs/<key>/`. It needs at least one `dimensions/*.json` file |
| Dimension | The root config for one world type: height range, generation modes, which regions it uses, what native content it imports. One dimension file is one world's ruleset |
| Region / biome / generator | The authoring units under a dimension. Regions divide the map, biomes fill regions, generators produce the actual heightmap noise |
| Object / structure | Placed content. An object is a single saved build (`.iob`). A structure is either an Iris jigsaw of several objects, or a vanilla/datapack/mod structure Iris allows through |
| Image map | A typed `image-maps/<key>.json` resource that decodes and places one canonical PNG as height, categorical, or mask data. Dimensions bind maps to generation applications |
| Studio | A throwaway authoring world that reads the live pack folder and hotloads your edits into new chunks. Deleted when you close it, and any leftovers are purged at startup |
| Generation history | A production world stores its pack history under `<dimensionRoot>/iris/generation/`. Include it in backups. Staged pack updates apply to new chunks after restart. See [05 - Concepts & Pack Layout](/iris/05-concepts-pack-layout) |
