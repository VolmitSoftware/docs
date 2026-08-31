---
title: "Biome Atlas — Tundra Sequoia Redwoods"
description: "Iris biome atlas entry for tundra/sequia-redwoods in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`tundra/sequia-redwoods` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `tundra` (Tundra) | 1 | 1 | 1 | 6.12% |
| Underworld 1005 | `tundra` (Underworld Tundra) | 1 | 1 | 1 | 6.12% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `plain` (17..19); combined authored contribution `17..19` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:taiga`; native-structure derivative `minecraft:windswept_hills`; custom identities `tundra_sequoia_redwoods`.
- **Surface:** 1 block(s): `minecraft:podzol`, `minecraft:coarse_dirt`; 2-4 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:coarse_dirt`.
- **Content:** 7 object placement rule(s) drawing from 45 object key(s), including `clutter/gravelsplotch1`, `clutter/gravelsplotch2`, `clutter/gravelsplotch3`, `clutter/gravelsplotch4`, `clutter/camp1`, `clutter/bincluster1`, `trees/spruce/sup-pine-1`, and 38 more. 7 decorator rule(s) using `minecraft:stone_button`, `minecraft:white_tulip`, `minecraft:cornflower`, `minecraft:blue_orchid`, `minecraft:lily_of_the_valley`, `minecraft:fern`, `minecraft:sweet_berry_bush`, `minecraft:orange_tulip`, `minecraft:dead_bush`, and 1 more.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:soul_sand_valley`; native-structure derivative `minecraft:soul_sand_valley`; custom identities `underworld_tundra_sequia_redwoods_f7d32b0b`.
- **Surface:** 1 block(s): `minecraft:soul_soil`; 2-4 block(s): `minecraft:soul_soil`; 6-18 block(s): `minecraft:basalt`. Wall palette: `minecraft:soul_soil`.
- **Content:** 7 object placement rule(s) drawing from 45 object key(s), including `underworld/soul/clutter/gravelsplotch1`, `underworld/soul/clutter/gravelsplotch2`, `underworld/soul/clutter/gravelsplotch3`, `underworld/soul/clutter/gravelsplotch4`, `underworld/soul/clutter/camp1`, `underworld/soul/clutter/bincluster1`, `underworld/soul/trees/spruce/sup-pine-1`, and 38 more. 8 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:polished_blackstone_button`, `minecraft:soul_fire`, `minecraft:crimson_roots`, `minecraft:nether_sprouts`.
- **Entity spawners:** `nether/surface/soul-sand-valley`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

### Tundra Sequoia Redwoods (`tundra/sequia-redwoods-extended`)

This child-only biome is selected from `tundra/sequia-redwoods`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `1` of `2` slots (50.00%); later child hops are resolved separately.

**Shared terrain:** `smooth-dunes` (97..132), `mountain` (8..14); combined authored contribution `105..146` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:taiga` identity; surface 1 block(s): `minecraft:podzol`, `minecraft:coarse_dirt`; 2-4 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`; 7 object placement rule(s) drawing from 45 object key(s), including `clutter/gravelsplotch1`, `clutter/gravelsplotch2`, `clutter/gravelsplotch3`, `clutter/gravelsplotch4`, `clutter/camp1`, `clutter/bincluster1`, `trees/spruce/sup-pine-1`, and 38 more. 7 decorator rule(s) using `minecraft:stone_button`, `minecraft:white_tulip`, `minecraft:cornflower`, `minecraft:blue_orchid`, `minecraft:lily_of_the_valley`, `minecraft:fern`, `minecraft:sweet_berry_bush`, `minecraft:orange_tulip`, `minecraft:dead_bush`, and 1 more.
- **Underworld 1005:** `minecraft:soul_sand_valley` identity; surface 1 block(s): `minecraft:soul_soil`; 2-4 block(s): `minecraft:soul_soil`; 6-18 block(s): `minecraft:basalt`; 7 object placement rule(s) drawing from 45 object key(s), including `underworld/soul/clutter/gravelsplotch1`, `underworld/soul/clutter/gravelsplotch2`, `underworld/soul/clutter/gravelsplotch3`, `underworld/soul/clutter/gravelsplotch4`, `underworld/soul/clutter/camp1`, `underworld/soul/clutter/bincluster1`, `underworld/soul/trees/spruce/sup-pine-1`, and 38 more. 8 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:polished_blackstone_button`, `minecraft:soul_fire`, `minecraft:crimson_roots`, `minecraft:nether_sprouts`.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome tundra/sequia-redwoods
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
