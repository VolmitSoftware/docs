---
title: "Biome Atlas — Tundra Forest"
description: "Iris biome atlas entry for tundra/forest in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`tundra/forest` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `forests` (Forests) | 1 | 1 | 1 | 11.46% |
| Overworld 4002 | `tundra` (Tundra) | 1 | 1 | 1 | 6.12% |
| Underworld 1005 | `forests` (Underworld Forests) | 1 | 1 | 1 | 11.46% |
| Underworld 1005 | `tundra` (Underworld Tundra) | 1 | 1 | 1 | 6.12% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `smooth-dunes` (37..56); combined authored contribution `37..56` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:windswept_hills`; native-structure derivative `minecraft:old_growth_spruce_taiga`; custom identities `tundra_forest`; underground scatter `minecraft:old_growth_pine_taiga`, `minecraft:windswept_hills`.
- **Surface:** 3-5 block(s) at slope >= 6.9: `minecraft:stone`, `minecraft:andesite`, `minecraft:gravel`; 3-5 block(s) at slope >= 5.3: `minecraft:dirt`, `minecraft:coarse_dirt`, `minecraft:gravel`; 1 block(s): `minecraft:grass_block`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 5 object placement rule(s) drawing from 38 object key(s), including `clutter/gravelsplotch1`, `clutter/gravelsplotch2`, `clutter/gravelsplotch3`, `clutter/gravelsplotch4`, `trees/spruce/levergreen1`, `trees/spruce/levergreen2`, `trees/spruce/levergreen3`, and 31 more. 5 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:white_tulip`, `minecraft:blue_orchid`, `minecraft:poppy`, `minecraft:sweet_berry_bush`, `minecraft:short_grass`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:soul_sand_valley`; native-structure derivative `minecraft:soul_sand_valley`; custom identities `underworld_tundra_forest_bd598b3e`.
- **Surface:** 3-5 block(s) at slope >= 6.9: `minecraft:basalt`, `minecraft:soul_sand`; 3-5 block(s) at slope >= 5.3: `minecraft:soul_soil`, `minecraft:soul_sand`; 1 block(s): `minecraft:soul_soil`; 6-18 block(s): `minecraft:basalt`. Wall palette: `minecraft:basalt`.
- **Content:** 5 object placement rule(s) drawing from 38 object key(s), including `underworld/soul/clutter/gravelsplotch1`, `underworld/soul/clutter/gravelsplotch2`, `underworld/soul/clutter/gravelsplotch3`, `underworld/soul/clutter/gravelsplotch4`, `underworld/soul/trees/spruce/levergreen1`, `underworld/soul/trees/spruce/levergreen2`, `underworld/soul/trees/spruce/levergreen3`, and 31 more. 6 decorator rule(s) (3 shared snippet reference(s)) using `minecraft:soul_fire`, `minecraft:crimson_roots`.
- **Entity spawners:** `nether/surface/soul-sand-valley`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

### Tundra Forest Cliffs (`tundra/forest-extended-cliffs`)

This child-only biome is selected from `tundra/forest`, not from a region list. Its rarity is `3`.
In that immediate child choice it contributes `1` of `4` slots (25.00%); later child hops are resolved separately.

**Shared terrain:** `smooth-dunes` (97..132), `mountain` (8..14); combined authored contribution `105..146` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:windswept_hills` identity; surface 3-5 block(s) at slope >= 6.9: `minecraft:stone`, `minecraft:andesite`, `minecraft:gravel`; 3-5 block(s) at slope >= 5.2: `minecraft:dirt`, `minecraft:coarse_dirt`, `minecraft:gravel`; 1 block(s): `minecraft:grass_block`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`; 7 object placement rule(s) drawing from 54 object key(s), including `clutter/gravelsplotch1`, `clutter/gravelsplotch2`, `clutter/gravelsplotch3`, `clutter/gravelsplotch4`, `trees/spruce/levergreen1`, `trees/spruce/mevergreen1`, `trees/spruce/mevergreen2`, and 47 more. 5 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:white_tulip`, `minecraft:blue_orchid`, `minecraft:poppy`, `minecraft:cornflower`, `minecraft:lily_of_the_valley`, `minecraft:sweet_berry_bush`, `minecraft:short_grass`.
- **Underworld 1005:** `minecraft:soul_sand_valley` identity; surface 3-5 block(s) at slope >= 6.9: `minecraft:basalt`, `minecraft:soul_sand`; 3-5 block(s) at slope >= 5.2: `minecraft:soul_soil`, `minecraft:soul_sand`; 1 block(s): `minecraft:soul_soil`; 6-18 block(s): `minecraft:basalt`; 7 object placement rule(s) drawing from 54 object key(s), including `underworld/soul/clutter/gravelsplotch1`, `underworld/soul/clutter/gravelsplotch2`, `underworld/soul/clutter/gravelsplotch3`, `underworld/soul/clutter/gravelsplotch4`, `underworld/soul/trees/spruce/levergreen1`, `underworld/soul/trees/spruce/mevergreen1`, `underworld/soul/trees/spruce/mevergreen2`, and 47 more. 6 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:soul_fire`, `minecraft:crimson_roots`.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome tundra/forest
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
