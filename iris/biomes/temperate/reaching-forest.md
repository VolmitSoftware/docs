---
title: "Biome Atlas — Tundra Magic Forest"
description: "Iris biome atlas entry for temperate/reaching-forest in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`temperate/reaching-forest` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `temperate` (Temperate) | 1 | 7 | 0.1429 | 0.88% |
| Underworld 1005 | `temperate` (Underworld Temperate) | 1 | 7 | 0.1429 | 0.88% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `mountain` (20..44); combined authored contribution `20..44` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:windswept_hills`; native-structure derivative `minecraft:old_growth_spruce_taiga`; custom identities `tunmagforest`; underground scatter `minecraft:old_growth_pine_taiga`, `minecraft:windswept_hills`.
- **Surface:** 3-5 block(s) at slope >= 6.9: `minecraft:stone`, `minecraft:andesite`, `minecraft:gravel`; 3-5 block(s) at slope >= 5.3: `minecraft:dirt`, `minecraft:coarse_dirt`, `minecraft:gravel`; 1 block(s): `minecraft:grass_block`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 3 object placement rule(s) drawing from 21 object key(s), including `clutter/gravelsplotch1`, `clutter/gravelsplotch2`, `clutter/gravelsplotch3`, `clutter/gravelsplotch4`, `trees/mixed/dotree1`, `trees/mixed/dotree2`, `trees/mixed/dotree3`, and 14 more. 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:white_tulip`, `minecraft:blue_orchid`, `minecraft:poppy`, `minecraft:sweet_berry_bush`, `minecraft:short_grass`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:nether_wastes`; native-structure derivative `minecraft:nether_wastes`; custom identities `underworld_temperate_reaching_forest_6d4bc948`.
- **Surface:** 3-5 block(s) at slope >= 6.9: `minecraft:netherrack`, `minecraft:basalt`, `minecraft:gravel`; 3-5 block(s) at slope >= 5.3: `minecraft:netherrack`, `minecraft:gravel`; 1 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`.
- **Content:** 3 object placement rule(s) drawing from 21 object key(s), including `underworld/wastes/clutter/gravelsplotch1`, `underworld/wastes/clutter/gravelsplotch2`, `underworld/wastes/clutter/gravelsplotch3`, `underworld/wastes/clutter/gravelsplotch4`, `underworld/wastes/trees/mixed/dotree1`, `underworld/wastes/trees/mixed/dotree2`, `underworld/wastes/trees/mixed/dotree3`, and 14 more. 5 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:fire`, `minecraft:nether_sprouts`.
- **Entity spawners:** `nether/surface/nether-wastes`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome temperate/reaching-forest
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
