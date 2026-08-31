---
title: "Biome Atlas — Tundra Magic Forest Cliffs"
description: "Iris biome atlas entry for tundra/mountains-extended-cliffs in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`tundra/mountains-extended-cliffs` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `tundra` (Tundra) | 1 | 1 | 1 | 6.12% |
| Underworld 1005 | `tundra` (Underworld Tundra) | 1 | 1 | 1 | 6.12% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `smooth-dunes` (97..132), `mountain` (8..14); combined authored contribution `105..146` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:windswept_hills`; native-structure derivative `minecraft:old_growth_spruce_taiga`; custom identities `tundra_magical_forest_cliffs`; underground scatter `minecraft:plains`, `minecraft:old_growth_pine_taiga`, `minecraft:windswept_hills`, `minecraft:swamp`; sky scatter `minecraft:snowy_taiga`, `minecraft:frozen_peaks`.
- **Surface:** 3-5 block(s) at slope >= 6.9: `minecraft:stone`, `minecraft:andesite`, `minecraft:gravel`; 3-5 block(s) at slope >= 5.2: `minecraft:dirt`, `minecraft:coarse_dirt`, `minecraft:gravel`; 1 block(s): `minecraft:grass_block`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 6 object placement rule(s) drawing from 53 object key(s), including `clutter/gravelsplotch1`, `clutter/gravelsplotch2`, `clutter/gravelsplotch3`, `clutter/gravelsplotch4`, `trees/spruce/levergreen1`, `trees/spruce/levergreen2`, `trees/spruce/levergreen3`, and 46 more. 4 decorator rule(s) using `minecraft:white_tulip`, `minecraft:blue_orchid`, `minecraft:poppy`, `minecraft:cornflower`, `minecraft:lily_of_the_valley`, `minecraft:sweet_berry_bush`, `minecraft:short_grass`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:basalt_deltas`; native-structure derivative `minecraft:basalt_deltas`; custom identities `underworld_tundra_mountains_extended_cliffs_ed27a1aa`.
- **Surface:** 3-5 block(s) at slope >= 6.9: `minecraft:blackstone`, `minecraft:basalt`, `minecraft:gravel`; 3-5 block(s) at slope >= 5.2: `minecraft:blackstone`, `minecraft:gravel`; 1 block(s): `minecraft:basalt`; 6-18 block(s): `minecraft:blackstone`, `minecraft:basalt`. Wall palette: `minecraft:blackstone`, `minecraft:basalt`.
- **Content:** 6 object placement rule(s) drawing from 53 object key(s), including `underworld/basalt/clutter/gravelsplotch1`, `underworld/basalt/clutter/gravelsplotch2`, `underworld/basalt/clutter/gravelsplotch3`, `underworld/basalt/clutter/gravelsplotch4`, `underworld/basalt/trees/spruce/levergreen1`, `underworld/basalt/trees/spruce/levergreen2`, `underworld/basalt/trees/spruce/levergreen3`, and 46 more. 5 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:fire`, `minecraft:nether_sprouts`.
- **Entity spawners:** `nether/surface/basalt-deltas`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome tundra/mountains-extended-cliffs
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
