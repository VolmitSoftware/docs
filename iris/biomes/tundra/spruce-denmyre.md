---
title: "Biome Atlas — Tundra Spruce Denmyre"
description: "Iris biome atlas entry for tundra/spruce-denmyre in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`tundra/spruce-denmyre` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `tundra` (Tundra) | 1 | 1 | 1 | 6.12% |
| Underworld 1005 | `tundra` (Underworld Tundra) | 1 | 1 | 1 | 6.12% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `plain` (42..37); combined authored contribution `42..37` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:stony_peaks`; native-structure derivative `minecraft:windswept_hills`; custom identities `tundra_spruce_denmyre`.
- **Surface:** 1 block(s): `minecraft:grass_block`; 1 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 4 object placement rule(s) drawing from 24 object key(s), including `clutter/bincluster1`, `trees/acacia/denmyre1`, `trees/acacia/denmyre2`, `trees/acacia/denmyre3`, `trees/acacia/denmyre4`, `trees/acacia/denmyre5`, `trees/acacia/denmyre6`, and 17 more. 7 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:white_tulip`, `minecraft:cornflower`, `minecraft:blue_orchid`, `minecraft:lily_of_the_valley`, `minecraft:sweet_berry_bush`, `minecraft:short_grass`, `minecraft:fern`, `minecraft:stone_button`, `minecraft:tall_grass`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:soul_sand_valley`; native-structure derivative `minecraft:soul_sand_valley`; custom identities `underworld_tundra_spruce_denmyre_ab3d20d1`.
- **Surface:** 1 block(s): `minecraft:soul_soil`; 1 block(s): `minecraft:soul_soil`; 1-3 block(s): `minecraft:soul_soil`; 6-18 block(s): `minecraft:basalt`. Wall palette: `minecraft:basalt`.
- **Content:** 4 object placement rule(s) drawing from 24 object key(s), including `underworld/soul/clutter/bincluster1`, `underworld/soul/trees/acacia/denmyre1`, `underworld/soul/trees/acacia/denmyre2`, `underworld/soul/trees/acacia/denmyre3`, `underworld/soul/trees/acacia/denmyre4`, `underworld/soul/trees/acacia/denmyre5`, `underworld/soul/trees/acacia/denmyre6`, and 17 more. 8 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:soul_fire`, `minecraft:crimson_roots`, `minecraft:polished_blackstone_button`, `minecraft:nether_sprouts`.
- **Entity spawners:** `nether/surface/soul-sand-valley`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome tundra/spruce-denmyre
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
