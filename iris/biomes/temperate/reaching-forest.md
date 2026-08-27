---
title: "Biome Atlas — Tundra Magic Forest"
description: "Iris biome atlas entry for temperate/reaching-forest in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`temperate/reaching-forest` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `temperate` (Temperate) | 1 | 7 | 0.1429 | 0.88% |
| Underworld 1005 | `temperate` (Underworld Temperate) | 1 | 7 | 0.1429 | 0.88% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

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

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

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

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
