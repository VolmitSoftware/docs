---
title: "Biome Atlas — Mangrove Swamp"
description: "Iris biome atlas entry for vanilla/mangrove_swamp in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`vanilla/mangrove_swamp` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `swamp` (Swamp) | 1 | 1 | 1 | 11.67% |
| Underworld 1005 | `swamp` (Underworld Swamp) | 1 | 1 | 1 | 11.67% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `plain` (-5..4); combined authored contribution `-5..4` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:mangrove_swamp`; native-structure derivative `minecraft:mangrove_swamp`; custom identities `mangrove_swamp`.
- **Surface:** 1 block(s): `minecraft:grass_block`, `minecraft:podzol`, `minecraft:mud`; 1 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 3 object placement rule(s) drawing from 19 object key(s), including `trees/oak/dead1`, `trees/oak/dead2`, `trees/oak/dead3`, `trees/oak/dead4`, `trees/oak/dead5`, `trees/oak/dead6`, `clutter/shrub1`, and 12 more. 3 decorator rule(s) using `minecraft:brown_mushroom`, `minecraft:red_mushroom`, `minecraft:large_fern`, `minecraft:tall_grass`, `minecraft:dead_bush`, `minecraft:fern`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:soul_sand_valley`; native-structure derivative `minecraft:soul_sand_valley`; custom identities `underworld_vanilla_mangrove_swamp_df7ec4c6`.
- **Surface:** 1 block(s): `minecraft:soul_soil`; 1 block(s): `minecraft:soul_soil`; 1-3 block(s): `minecraft:soul_soil`; 6-18 block(s): `minecraft:basalt`. Wall palette: `minecraft:basalt`.
- **Content:** 3 object placement rule(s) drawing from 19 object key(s), including `underworld/soul/trees/oak/dead1`, `underworld/soul/trees/oak/dead2`, `underworld/soul/trees/oak/dead3`, `underworld/soul/trees/oak/dead4`, `underworld/soul/trees/oak/dead5`, `underworld/soul/trees/oak/dead6`, `underworld/soul/clutter/shrub1`, and 12 more. 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:warped_fungus`, `minecraft:nether_sprouts`, `minecraft:soul_fire`.
- **Entity spawners:** `nether/surface/soul-sand-valley`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome vanilla/mangrove_swamp
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
