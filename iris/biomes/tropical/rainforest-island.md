---
title: "Biome Atlas — Tropical Rainforest Island"
description: "Iris biome atlas entry for tropical/rainforest-island in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`tropical/rainforest-island` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `tropical` (Tropical) | 1 | 1 | 1 | 8.33% |
| Underworld 1005 | `tropical` (Underworld Tropical) | 1 | 1 | 1 | 8.33% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `mountain` (25..65); combined authored contribution `25..65` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:jungle`; native-structure derivative `minecraft:sparse_jungle`; custom identities `tropical_rainforest_island`.
- **Surface:** 1 block(s): `minecraft:grass_block`; 2-4 block(s): `minecraft:dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stripped_jungle_wood`, `minecraft:jungle_leaves`.
- **Content:** 7 object placement rule(s) drawing from 35 object key(s), including `clutter/bincluster1`, `clutter/camp1`, `trees/jungle/cocogeneric2`, `trees/jungle/cocogeneric3`, `trees/jungle/cocogeneric4`, `trees/jungle/cocogeneric5`, `trees/jungle/lgeneric6`, and 28 more. 3 decorator rule(s) using `minecraft:jungle_leaves`, `minecraft:tall_grass`, `minecraft:short_grass`, `minecraft:jungle_wood`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:crimson_forest`; native-structure derivative `minecraft:crimson_forest`; custom identities `underworld_tropical_rainforest_island_8cd1e4bd`.
- **Surface:** 1 block(s): `minecraft:crimson_nylium`; 2-4 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`. Wall palette: `minecraft:stripped_crimson_hyphae`, `minecraft:nether_wart_block`.
- **Content:** 7 object placement rule(s) drawing from 35 object key(s), including `underworld/crimson/clutter/bincluster1`, `underworld/crimson/clutter/camp1`, `underworld/crimson/trees/jungle/cocogeneric2`, `underworld/crimson/trees/jungle/cocogeneric3`, `underworld/crimson/trees/jungle/cocogeneric4`, `underworld/crimson/trees/jungle/cocogeneric5`, `underworld/crimson/trees/jungle/lgeneric6`, and 28 more. 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:nether_wart_block`, `minecraft:crimson_fungus`, `minecraft:nether_sprouts`, `minecraft:crimson_hyphae`.
- **Entity spawners:** `nether/surface/crimson-forest`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome tropical/rainforest-island
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
