---
title: "Biome Atlas — Lush Plains"
description: "Iris biome atlas entry for temperate/lush-plains in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`temperate/lush-plains` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `temperate` (Temperate) | 1 | 2 | 0.5 | 3.07% |
| Underworld 1005 | `temperate` (Underworld Temperate) | 1 | 2 | 0.5 | 3.07% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

## Shared terrain

Both packs use the same generator links: `plain` (4..7); combined authored contribution `4..7` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:flower_forest`; native-structure derivative `minecraft:flower_forest`; no custom or scatter identities.
- **Surface:** 1 block(s): `minecraft:grass_block`; 2 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:dirt`, `minecraft:stone`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 4 object placement rule(s) drawing from 53 object key(s), including `clutter/camp1`, `clutter/camp3`, `clutter/camp4`, `clutter/camp5`, `clutter/camp2`, `trees/oak/hoakgeneric3`, `trees/oak/hoakgeneric4`, and 46 more. 6 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:orange_tulip`, `minecraft:white_tulip`, `minecraft:dandelion`, `minecraft:poppy`, `minecraft:blue_orchid`, `minecraft:azure_bluet`, `minecraft:red_tulip`, `minecraft:allium`, `minecraft:pink_tulip`, and 9 more.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:nether_wastes`; native-structure derivative `minecraft:nether_wastes`; custom identities `underworld_temperate_lush_plains_9430edfe`.
- **Surface:** 1 block(s): `minecraft:netherrack`; 2 block(s): `minecraft:netherrack`; 1-3 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`.
- **Content:** 4 object placement rule(s) drawing from 53 object key(s), including `underworld/wastes/clutter/camp1`, `underworld/wastes/clutter/camp3`, `underworld/wastes/clutter/camp4`, `underworld/wastes/clutter/camp5`, `underworld/wastes/clutter/camp2`, `underworld/wastes/trees/oak/hoakgeneric3`, `underworld/wastes/trees/oak/hoakgeneric4`, and 46 more. 7 decorator rule(s) (3 shared snippet reference(s)) using `minecraft:fire`, `minecraft:crimson_fungus`, `minecraft:nether_sprouts`, `minecraft:nether_wart_block`.
- **Entity spawners:** `nether/surface/nether-wastes`, `nether/cave`.

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

## Children

### Lush Plains Yellow (`temperate/lush-plains-yellow`)

This child-only biome is selected from `temperate/lush-plains`, not from a region list. Its rarity is `3`.
In that immediate child choice it contributes `1` of `6` slots (16.67%); later child hops are resolved separately.

**Shared terrain:** `plain` (4..7); combined authored contribution `4..7` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:flower_forest` identity; surface 1 block(s): `minecraft:grass_block`; 2 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:dirt`, `minecraft:stone`; 4 object placement rule(s) drawing from 53 object key(s), including `clutter/camp1`, `clutter/camp3`, `clutter/camp4`, `clutter/camp5`, `clutter/camp2`, `trees/oak/hoakgeneric3`, `trees/oak/hoakgeneric4`, and 46 more. 6 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:dandelion`, `minecraft:sunflower`, `minecraft:tall_grass`, `minecraft:short_grass`, `minecraft:fern`, `minecraft:oak_leaves`.
- **Underworld 1005:** `minecraft:nether_wastes` identity; surface 1 block(s): `minecraft:netherrack`; 2 block(s): `minecraft:netherrack`; 1-3 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`; 4 object placement rule(s) drawing from 53 object key(s), including `underworld/wastes/clutter/camp1`, `underworld/wastes/clutter/camp3`, `underworld/wastes/clutter/camp4`, `underworld/wastes/clutter/camp5`, `underworld/wastes/clutter/camp2`, `underworld/wastes/trees/oak/hoakgeneric3`, `underworld/wastes/trees/oak/hoakgeneric4`, and 46 more. 7 decorator rule(s) (3 shared snippet reference(s)) using `minecraft:crimson_fungus`, `minecraft:fire`, `minecraft:nether_wart_block`.

### Lush Plains Red (`temperate/lush-plains-red`)

This child-only biome is selected from `temperate/lush-plains`, not from a region list. Its rarity is `3`.
In that immediate child choice it contributes `1` of `6` slots (16.67%); later child hops are resolved separately.

**Shared terrain:** `plain` (4..7); combined authored contribution `4..7` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:flower_forest` identity; surface 1 block(s): `minecraft:grass_block`; 2 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:dirt`, `minecraft:stone`; 4 object placement rule(s) drawing from 53 object key(s), including `clutter/camp1`, `clutter/camp3`, `clutter/camp4`, `clutter/camp5`, `clutter/camp2`, `trees/oak/hoakgeneric3`, `trees/oak/hoakgeneric4`, and 46 more. 5 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:rose_bush`, `minecraft:poppy`, `minecraft:tall_grass`, `minecraft:short_grass`, `minecraft:fern`, `minecraft:oak_leaves`.
- **Underworld 1005:** `minecraft:nether_wastes` identity; surface 1 block(s): `minecraft:netherrack`; 2 block(s): `minecraft:netherrack`; 1-3 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`; 4 object placement rule(s) drawing from 53 object key(s), including `underworld/wastes/clutter/camp1`, `underworld/wastes/clutter/camp3`, `underworld/wastes/clutter/camp4`, `underworld/wastes/clutter/camp5`, `underworld/wastes/clutter/camp2`, `underworld/wastes/trees/oak/hoakgeneric3`, `underworld/wastes/trees/oak/hoakgeneric4`, and 46 more. 6 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:crimson_fungus`, `minecraft:nether_sprouts`, `minecraft:fire`, `minecraft:nether_wart_block`.

### Overflowed (`temperate/overflowed`)

This child-only biome is selected from `temperate/lush-plains`, not from a region list. Its rarity is `2`.
In that immediate child choice it contributes `2` of `6` slots (33.33%); later child hops are resolved separately.

**Shared terrain:** `mountain` (-10..-5); combined authored contribution `-10..-5` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:plains` identity; surface 1 block(s): `minecraft:grass_block`; 2 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:dirt`, `minecraft:stone`; 7 object placement rule(s) drawing from 47 object key(s), including `clutter/camp1`, `clutter/camp3`, `clutter/camp4`, `clutter/camp5`, `clutter/camp2`, `trees/oak/hoakgeneric3`, `trees/oak/hoakgeneric4`, and 40 more. 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:dandelion`, `minecraft:poppy`, `minecraft:blue_orchid`, `minecraft:allium`, `minecraft:azure_bluet`, `minecraft:red_tulip`, `minecraft:orange_tulip`, `minecraft:white_tulip`, `minecraft:pink_tulip`, and 5 more.
- **Underworld 1005:** `minecraft:nether_wastes` identity; surface 1 block(s): `minecraft:netherrack`; 2 block(s): `minecraft:netherrack`; 1-3 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`; 7 object placement rule(s) drawing from 47 object key(s), including `underworld/wastes/clutter/camp1`, `underworld/wastes/clutter/camp3`, `underworld/wastes/clutter/camp4`, `underworld/wastes/clutter/camp5`, `underworld/wastes/clutter/camp2`, `underworld/wastes/trees/oak/hoakgeneric3`, `underworld/wastes/trees/oak/hoakgeneric4`, and 40 more. 5 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:crimson_fungus`, `minecraft:nether_sprouts`, `minecraft:fire`.

## Floating variants

No floating child biomes are declared.


## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome temperate/lush-plains
/iris what biome
/iris what region
```

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
