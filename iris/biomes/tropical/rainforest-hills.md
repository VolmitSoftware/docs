---
title: "Biome Atlas — Rainforest Hills"
description: "Iris biome atlas entry for tropical/rainforest-hills in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`tropical/rainforest-hills` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `tropical` (Tropical) | 1 | 1 | 1 | 8.33% |
| Underworld 1005 | `tropical` (Underworld Tropical) | 1 | 1 | 1 | 8.33% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

## Shared terrain

Both packs use the same generator links: `plain-cliffs` (32..65); combined authored contribution `32..65` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:jungle`; native-structure derivative `minecraft:jungle`; no custom or scatter identities.
- **Surface:** 1 block(s): `minecraft:grass_block`; 2-4 block(s): `minecraft:dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stripped_jungle_wood`, `minecraft:jungle_leaves`.
- **Content:** 6 object placement rule(s) drawing from 37 object key(s), including `clutter/bincluster1`, `trees/jungle/cocogeneric2`, `trees/jungle/cocogeneric3`, `trees/jungle/cocogeneric4`, `trees/jungle/cocogeneric5`, `trees/jungle/spire1`, `trees/jungle/spire2`, and 30 more. 5 decorator rule(s) using `minecraft:tall_grass`, `minecraft:short_grass`, `minecraft:jungle_leaves`, `minecraft:fern`, `minecraft:jungle_sapling`, `minecraft:dead_bush`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:crimson_forest`; native-structure derivative `minecraft:crimson_forest`; custom identities `underworld_tropical_rainforest_hills_d8d03778`.
- **Surface:** 1 block(s): `minecraft:crimson_nylium`; 2-4 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`. Wall palette: `minecraft:stripped_crimson_hyphae`, `minecraft:nether_wart_block`.
- **Content:** 6 object placement rule(s) drawing from 37 object key(s), including `underworld/crimson/clutter/bincluster1`, `underworld/crimson/trees/jungle/cocogeneric2`, `underworld/crimson/trees/jungle/cocogeneric3`, `underworld/crimson/trees/jungle/cocogeneric4`, `underworld/crimson/trees/jungle/cocogeneric5`, `underworld/crimson/trees/jungle/spire1`, `underworld/crimson/trees/jungle/spire2`, and 30 more. 6 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:crimson_fungus`, `minecraft:nether_sprouts`, `minecraft:nether_wart_block`.
- **Entity spawners:** `nether/surface/crimson-forest`, `nether/cave`.

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.


## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome tropical/rainforest-hills
/iris what biome
/iris what region
```

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
