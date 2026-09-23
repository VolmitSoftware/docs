---
title: "Biome Catalog"
description: "Paired atlas of the built-in Iris Overworld and Underworld biomes"
published: true
date: 2026-09-23T11:12:42.385Z
tags: "iris, biomes, overworld, underworld"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
Use this atlas to choose and configure biomes in the built-in Overworld and Underworld packs. Each entry lists its load key, selection weights, terrain settings, materials, decoration, and creatures. Paired entries show how the two packs use the same terrain with different materials and ecology.

For biome configuration, see [13 - Biomes](/iris/13-biomes). To edit the built-in pack, see [27 - Configuring Overworld](/iris/27-example-configuring-overworld). The [terrain shaping reference](/iris/biomes/terrain-shaping) compares the shared 3D terrain profiles.

## Catalog scope

The paired catalog contains 375 reachable biome identities:

| Kind | Count | Documentation treatment |
|---|---:|---|
| Direct land roots | 164 | One paired page per root |
| Direct sea roots | 31 | One paired page per root |
| Direct shore roots | 17 | Consolidated in [Shorelines](/iris/biomes/shorelines), with distinct variants called out |
| Region-selected cave roots | 47 | One paired page per root, except the 16-color Prismatic family |
| Dimension-carving roots | 1 | The global Deep Dark page includes its descendants |
| Child-only and floating-only variants | 115 | Included with a parent root rather than given an orphan page |

`mountain/shore/beach` and `vanilla/stony_shore` are available in both packs but are not selected by the built-in region lists. See [Shorelines](/iris/biomes/shorelines) for their materials and settings.

## Family navigation

| Family | Direct roots | Child-only variants | Scope |
|---|---:|---:|---|
| [Carving](/iris/biomes/carving) | 48 | 49 | Region cave selectors and the dimension-level Deep Dark band |
| [Estranged](/iris/biomes/estranged) | 15 | 1 | Surreal woodlands, wetlands, and sculptural terrain |
| [Frozen](/iris/biomes/frozen) | 21 | 8 | Snow, ice, spruce, mountains, cold water, and shores |
| [Hot](/iris/biomes/hot) | 10 | 2 | Dunes, desert mountains, oases, warm water, and shores |
| [Magnetics](/iris/biomes/magnetics) | 6 | 1 | Metallic, glassy, frozen, fungal, and noise-driven terrain |
| [Mesa](/iris/biomes/mesa) | 7 | 7 | Plateaus, valleys, badlands, rivers, and shores |
| [Mountain](/iris/biomes/mountain) | 11 | 5 | Mountains, cliffs, highlands, forests, rivers, and shores |
| [Mushroom](/iris/biomes/mushroom) | 8 | 2 | Fungal land, water, and shoreline biomes |
| [Ocean](/iris/biomes/ocean) | 5 | 1 | Shared deep, dark, rich, warm, and shoreline roots |
| [Prismatics](/iris/biomes/prismatics) | 18 | 0 | Sixteen color families plus shared sea and shore roots |
| [Savanna](/iris/biomes/savanna) | 5 | 2 | Acacia, savanna, plateau, forest, and shore roots |
| [Swamp](/iris/biomes/swamp) | 13 | 7 | Marshes, mangroves, forests, lakes, oceans, and shores |
| [Temperate](/iris/biomes/temperate) | 32 | 12 | Plains, meadows, forests, waters, and shared shores |
| [Terralost](/iris/biomes/terralost) | 5 | 0 | Alpine, amethyst, and ancient-sand terrain |
| [Tropical](/iris/biomes/tropical) | 20 | 7 | Rainforests, islands, volcanoes, waters, and distinct shores |
| [Tundra](/iris/biomes/tundra) | 17 | 11 | Taiga, redwoods, alpine terrain, mountains, water, and shores |
| [Vanilla](/iris/biomes/vanilla) | 19 | 0 | Vanilla-compatible roots mixed into Iris selectors |

The [Sulfur Galleries and Hollows](/iris/biomes/carving/sulfur) require Minecraft 26.2. The cave root and its child contain ordinary short sulfur spikes, occasional taller clusters, tiny mineral pools, and rare banded spires. Overworld uses native sulfur cubes and water pools with occasional geysers; Underworld keeps the same geometry with lava pools and Nether ecology.

## Read the atlas

- [Overworld](/iris/biomes/overworld) explains the normal-world environment, selection graph, terrain scale, water, ores, and native structure policy.
- [Underworld](/iris/biomes/underworld) explains the coordinate-compatible Nether treatment, lava, lighting, materials, ecology, and lack of a Nether roof.
- [Shorelines](/iris/biomes/shorelines) collects the short transition biomes that do not need individual pages.
- Individual entries live at `/iris/biomes/<load-key>`. For example, `temperate/plains` is [Temperate Plains](/iris/biomes/temperate/plains), while `carving/standard-deepdark` is [the global Deep Dark family](/iris/biomes/carving/standard-deepdark).

An atlas page lists every region and selection role that can choose the root. Repeated entries are reported as effective weighting because repeated keys in a region or child list are intentional selection weight, not harmless duplication. Child cycles and self-references are described without expanding them forever.

## What counts as in use

Reachability begins at the active dimension file. It follows region land, sea, shore, and cave lists, dimension carving, children, floating targets, carving references, and hydrology biome references. River policies can select surface, mouth, shore, bank, and flooded-cave biomes. A file outside this graph is omitted even if it parses successfully.

This distinction matters when editing a pack. An authored biome can validate yet never generate because nothing selects it. Use [13 - Biomes](/iris/13-biomes) for the configuration contract and [27 - Example - Configuring Overworld](/iris/27-example-configuring-overworld) for the editing workflow.

## Inspect a biome in game

On Bukkit-family servers:

```text
/iris find biome <load-key>
/iris what biome
```

On Fabric, Forge, and NeoForge, `/iris goto biome <load-key>` is the equivalent locator alias. Generate fresh chunks before judging a pack edit; existing chunks keep their previous terrain and biome data.
