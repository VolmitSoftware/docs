---
title: "Biome Catalog"
description: "Paired atlas of the built-in Iris Overworld and Underworld biomes"
published: true
date: 2026-09-03T04:14:00.000Z
tags: "iris, biomes, overworld, underworld"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
This atlas documents the current sources of the built-in Overworld and Underworld packs. Each entry treats the shared terrain identity once, then records how the two packs render and populate it differently. Only reachable content is included. An installed world keeps its pack snapshot until the operator updates it; source changes are not automatically present in previously downloaded releases.

> **Pack maintenance requirement:** any update to either built-in pack that changes biome files, region selectors, dimension carving, children, floating biomes, terrain, materials, decoration, ecology, or reachability must update this atlas in the same workstream. A pack update with stale atlas pages is incomplete.
{.is-warning}

## Catalog scope

The paired catalog contains 375 reachable biome keys:

| Kind | Count | Documentation treatment |
|---|---:|---|
| Direct land roots | 164 | One paired page per root |
| Direct sea roots | 31 | One paired page per root |
| Direct shore roots | 19 | Consolidated in [Shorelines](/iris/biomes/shorelines), with distinct variants called out |
| Region-selected cave roots | 47 | One paired page per root, except the 16-color Prismatic family |
| Dimension-carving roots | 1 | The global Deep Dark page includes its descendants |
| Child-only and floating-only variants | 113 | Included with a parent root rather than given an orphan page |

The Overworld repository contains seven unreachable files. They are not active catalog entries. Underworld 1005 has no unreachable biome files.

## Family navigation

| Family | Direct roots | Child-only variants | Scope |
|---|---:|---:|---|
| [Carving](/iris/biomes/carving) | 48 | 49 | Region cave selectors and the dimension-level Deep Dark band |
| [Estranged](/iris/biomes/estranged) | 15 | 0 | Surreal woodlands, wetlands, and sculptural terrain |
| [Frozen](/iris/biomes/frozen) | 21 | 8 | Snow, ice, spruce, mountains, cold water, and shores |
| [Hot](/iris/biomes/hot) | 10 | 2 | Dunes, desert mountains, oases, warm water, and shores |
| [Magnetics](/iris/biomes/magnetics) | 6 | 1 | Metallic, glassy, frozen, fungal, and noise-driven terrain |
| [Mesa](/iris/biomes/mesa) | 7 | 7 | Plateaus, valleys, badlands, rivers, and shores |
| [Mountain](/iris/biomes/mountain) | 12 | 5 | Mountains, cliffs, highlands, forests, rivers, and shores |
| [Mushroom](/iris/biomes/mushroom) | 8 | 2 | Fungal land, water, and shoreline biomes |
| [Ocean](/iris/biomes/ocean) | 5 | 1 | Shared deep, dark, rich, warm, and shoreline roots |
| [Prismatics](/iris/biomes/prismatics) | 18 | 0 | Sixteen color families plus shared sea and shore roots |
| [Savanna](/iris/biomes/savanna) | 5 | 2 | Acacia, savanna, plateau, forest, and shore roots |
| [Swamp](/iris/biomes/swamp) | 13 | 7 | Marshes, mangroves, forests, lakes, oceans, and shores |
| [Temperate](/iris/biomes/temperate) | 32 | 11 | Plains, meadows, forests, waters, and shared shores |
| [Terralost](/iris/biomes/terralost) | 5 | 0 | Alpine, amethyst, and ancient-sand terrain |
| [Tropical](/iris/biomes/tropical) | 20 | 9 | Rainforests, islands, volcanoes, waters, and distinct shores |
| [Tundra](/iris/biomes/tundra) | 17 | 9 | Taiga, redwoods, alpine terrain, mountains, water, and shores |
| [Vanilla](/iris/biomes/vanilla) | 20 | 0 | Vanilla-compatible roots mixed into Iris selectors |

The [Sulfur Galleries and Hollows](/iris/biomes/carving/sulfur) require Minecraft 26.2. They add a regional cave root and one child to the current pack sources, with ordinary short sulfur spikes, occasional taller clusters, tiny mineral pools, and rare banded spires. Overworld uses native sulfur cubes and water pools with occasional geysers; Underworld keeps the same geometry with lava pools and Nether ecology.

## Read the atlas

- [Overworld 4002](/iris/biomes/overworld) explains the normal-world environment, selection graph, terrain scale, water, ores, and native structure policy.
- [Underworld 1005](/iris/biomes/underworld) explains the coordinate-compatible Nether treatment, lava, lighting, materials, ecology, and lack of a Nether roof.
- [Shorelines](/iris/biomes/shorelines) collects the short transition biomes that do not need individual pages.
- Individual entries live at `/iris/biomes/<load-key>`. For example, `temperate/plains` is [Temperate Plains](/iris/biomes/temperate/plains), while `carving/standard-deepdark` is [the global Deep Dark family](/iris/biomes/carving/standard-deepdark).

An atlas page lists every region and selection role that can choose the root. Repeated entries are reported as effective weighting because repeated keys in a region or child list are intentional selection weight, not harmless duplication. Child cycles and self-references are described without expanding them forever.

## What counts as in use

Reachability begins at the active dimension file. It follows region land, sea, shore, and cave lists; dimension-level carving entries; ordinary children; floating-biome targets; and the relevant carving references. A file that cannot be reached by that graph is omitted even if it parses successfully.

This distinction matters when editing a pack. An authored biome can validate yet never generate because nothing selects it. Use [13 - Biomes](/iris/13-biomes) for the configuration contract and [27 - Example - Configuring Overworld](/iris/27-example-configuring-overworld) for the editing workflow.

## Inspect a biome in game

On Bukkit-family servers:

```text
/iris find biome <load-key>
/iris what biome
```

On Fabric, Forge, and NeoForge, `/iris goto biome <load-key>` is the equivalent locator alias. Generate fresh chunks before judging a pack edit; existing chunks keep their previous terrain and biome data.
