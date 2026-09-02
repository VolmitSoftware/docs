---
title: "Biome Atlas — Tundra Magic Forest"
description: "Iris biome atlas entry for tundra/magic-forest in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`tundra/magic-forest` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `tundra` (Tundra) | 1 | 7 | 0.1429 | 0.87% |
| Underworld 1005 | `tundra` (Underworld Tundra) | 1 | 7 | 0.1429 | 0.87% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `smooth-dunes` (22..34); combined authored contribution `22..34` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:windswept_hills`; native-structure derivative `minecraft:old_growth_spruce_taiga`; custom identities `tunmagforest`; underground scatter `minecraft:old_growth_pine_taiga`, `minecraft:windswept_hills`.
- **Surface:** 3-5 block(s) at slope >= 6.9: `minecraft:stone`, `minecraft:andesite`, `minecraft:gravel`; 3-5 block(s) at slope >= 5.3: `minecraft:dirt`, `minecraft:coarse_dirt`, `minecraft:gravel`; 1 block(s): `minecraft:grass_block`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 3 object placement rule(s) drawing from 21 object key(s), including `clutter/gravelsplotch1`, `clutter/gravelsplotch2`, `clutter/gravelsplotch3`, `clutter/gravelsplotch4`, `trees/mixed/dotree1`, `trees/mixed/dotree2`, `trees/mixed/dotree3`, and 14 more. 3 decorator rule(s) using `minecraft:white_tulip`, `minecraft:blue_orchid`, `minecraft:poppy`, `minecraft:sweet_berry_bush`, `minecraft:short_grass`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:soul_sand_valley`; native-structure derivative `minecraft:soul_sand_valley`; custom identities `underworld_tundra_magic_forest_87f352cf`.
- **Surface:** 3-5 block(s) at slope >= 6.9: `minecraft:basalt`, `minecraft:soul_sand`; 3-5 block(s) at slope >= 5.3: `minecraft:soul_soil`, `minecraft:soul_sand`; 1 block(s): `minecraft:soul_soil`; 6-18 block(s): `minecraft:basalt`. Wall palette: `minecraft:basalt`.
- **Content:** 3 object placement rule(s) drawing from 21 object key(s), including `underworld/soul/clutter/gravelsplotch1`, `underworld/soul/clutter/gravelsplotch2`, `underworld/soul/clutter/gravelsplotch3`, `underworld/soul/clutter/gravelsplotch4`, `underworld/soul/trees/mixed/dotree1`, `underworld/soul/trees/mixed/dotree2`, `underworld/soul/trees/mixed/dotree3`, and 14 more. 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:soul_fire`, `minecraft:crimson_roots`.
- **Entity spawners:** `nether/surface/soul-sand-valley`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

### Tundra Magic Forest (`tundra/magic-forest-extended`)

This child-only biome is selected from `tundra/magic-forest`, not from a region list. Its rarity is `7`.
In that immediate child choice it contributes `1` of `2` slots (50.00%); later child hops are resolved separately.

**Shared terrain:** `smooth-dunes` (97..132), `mountain` (34..42); combined authored contribution `131..174` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:windswept_hills` identity; surface 3-5 block(s) at slope >= 6.9: `minecraft:stone`, `minecraft:andesite`, `minecraft:gravel`; 3-5 block(s) at slope >= 5.3: `minecraft:dirt`, `minecraft:coarse_dirt`, `minecraft:gravel`; 1 block(s): `minecraft:grass_block`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`; 3 object placement rule(s) drawing from 21 object key(s), including `clutter/gravelsplotch1`, `clutter/gravelsplotch2`, `clutter/gravelsplotch3`, `clutter/gravelsplotch4`, `trees/mixed/dotree1`, `trees/mixed/dotree2`, `trees/mixed/dotree3`, and 14 more. 3 decorator rule(s) using `minecraft:white_tulip`, `minecraft:blue_orchid`, `minecraft:poppy`, `minecraft:sweet_berry_bush`, `minecraft:short_grass`.
- **Underworld 1005:** `minecraft:soul_sand_valley` identity; surface 3-5 block(s) at slope >= 6.9: `minecraft:basalt`, `minecraft:soul_sand`; 3-5 block(s) at slope >= 5.3: `minecraft:soul_soil`, `minecraft:soul_sand`; 1 block(s): `minecraft:soul_soil`; 6-18 block(s): `minecraft:basalt`; 3 object placement rule(s) drawing from 21 object key(s), including `underworld/soul/clutter/gravelsplotch1`, `underworld/soul/clutter/gravelsplotch2`, `underworld/soul/clutter/gravelsplotch3`, `underworld/soul/clutter/gravelsplotch4`, `underworld/soul/trees/mixed/dotree1`, `underworld/soul/trees/mixed/dotree2`, `underworld/soul/trees/mixed/dotree3`, and 14 more. 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:soul_fire`, `minecraft:crimson_roots`.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome tundra/magic-forest
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
