---
title: "Biome Atlas — Cold Spines"
description: "Iris biome atlas entry for frozen/fields/cold-spines in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`frozen/fields/cold-spines` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `frozen` (Frozen) | 1 | 1 | 1 | 5.69% |
| Underworld 1005 | `frozen` (Underworld Frozen) | 1 | 1 | 1 | 5.69% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `smooth-dunes` (20..30), `mountain` (1..5); combined authored contribution `21..35` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:snowy_plains`; native-structure derivative `minecraft:snowy_plains`; custom identities `winter_mountain_forest1`, `winter_mountain_forest2`, `winter_mountain_forest3`.
- **Surface:** 1 block(s) at slope 0-3.3: `minecraft:snow_block`; 3 block(s) at slope 0-3: `minecraft:dirt`; 3 block(s) at slope 0-3: `minecraft:dirt`, `minecraft:stone`. Wall palette: `minecraft:stone`, `minecraft:andesite`, `minecraft:gravel`, `minecraft:cyan_terracotta`.
- **Content:** 4 object placement rule(s) drawing from 24 object key(s), including `clutter/sbush1`, `clutter/sbush2`, `clutter/sbush3`, `trees/spruce/lfrostgeneric1`, `trees/spruce/lfrostgeneric2`, `trees/spruce/lfrostgeneric3`, `trees/spruce/lfrostgeneric4`, and 17 more. 4 decorator rule(s) using `minecraft:dandelion`, `minecraft:poppy`, `minecraft:blue_orchid`, `minecraft:allium`, `minecraft:azure_bluet`, `minecraft:red_tulip`, `minecraft:orange_tulip`, `minecraft:white_tulip`, `minecraft:pink_tulip`, and 6 more.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:soul_sand_valley`; native-structure derivative `minecraft:soul_sand_valley`; custom identities `underworld_frozen_fields_cold_spines_b4b44f68`.
- **Surface:** 1 block(s) at slope 0-3.3: `minecraft:soul_soil`; 3 block(s) at slope 0-3: `minecraft:soul_soil`; 3 block(s) at slope 0-3: `minecraft:soul_soil`, `minecraft:basalt`. Wall palette: `minecraft:basalt`, `minecraft:soul_sand`, `minecraft:warped_nylium`.
- **Content:** 4 object placement rule(s) drawing from 24 object key(s), including `underworld/soul/clutter/sbush1`, `underworld/soul/clutter/sbush2`, `underworld/soul/clutter/sbush3`, `underworld/soul/trees/spruce/lfrostgeneric1`, `underworld/soul/trees/spruce/lfrostgeneric2`, `underworld/soul/trees/spruce/lfrostgeneric3`, `underworld/soul/trees/spruce/lfrostgeneric4`, and 17 more. 5 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:nether_sprouts`, `minecraft:soul_fire`.
- **Entity spawners:** `nether/surface/soul-sand-valley`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome frozen/fields/cold-spines
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
