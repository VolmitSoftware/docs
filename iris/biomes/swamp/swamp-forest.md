---
title: "Biome Atlas — Swamp Forest"
description: "Iris biome atlas entry for swamp/swamp-forest in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`swamp/swamp-forest` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `swamp` (Swamp) | 1 | 2 | 0.5 | 5.84% |
| Underworld 1005 | `swamp` (Underworld Swamp) | 1 | 2 | 0.5 | 5.84% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

## Shared terrain

Both packs use the same generator links: `plain` (1..4); combined authored contribution `1..4` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:swamp`; native-structure derivative `minecraft:swamp`; custom identities `k530forestswamp`.
- **Surface:** 1 block(s): `minecraft:grass_block`, `minecraft:brown_concrete_powder`, `minecraft:dirt`, `minecraft:coarse_dirt`; 3 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 3 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`, `minecraft:stone`. Wall palette: none.
- **Content:** 3 object placement rule(s) drawing from 19 object key(s), including `trees/mixed/dotree1`, `trees/mixed/dotree2`, `trees/mixed/dotree3`, `trees/mixed/dotree4`, `trees/mixed/dotree5`, `trees/mixed/dotree6`, `trees/mixed/dotree7`, and 12 more. 6 decorator rule(s) using `minecraft:dark_oak_leaves`, `minecraft:short_grass`, `minecraft:fern`, `minecraft:blue_orchid`, `minecraft:brown_mushroom`, `minecraft:red_mushroom`, `minecraft:large_fern`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:warped_forest`; native-structure derivative `minecraft:warped_forest`; custom identities `underworld_swamp_swamp_forest_d10481fa`.
- **Surface:** 1 block(s): `minecraft:warped_nylium`, `minecraft:soul_soil`, `minecraft:netherrack`; 3 block(s): `minecraft:netherrack`; 3 block(s): `minecraft:netherrack`, `minecraft:nether_quartz_ore`. Wall palette: none.
- **Content:** 3 object placement rule(s) drawing from 19 object key(s), including `underworld/warped/trees/mixed/dotree1`, `underworld/warped/trees/mixed/dotree2`, `underworld/warped/trees/mixed/dotree3`, `underworld/warped/trees/mixed/dotree4`, `underworld/warped/trees/mixed/dotree5`, `underworld/warped/trees/mixed/dotree6`, `underworld/warped/trees/mixed/dotree7`, and 12 more. 7 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:warped_wart_block`, `minecraft:nether_sprouts`, `minecraft:warped_roots`, `minecraft:warped_fungus`.
- **Entity spawners:** `nether/surface/warped-forest`, `nether/cave`.

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

## Children

### Swamp Puddle (`swamp/swamp-puddle`)

This child-only biome is selected from `swamp/swamp-forest`, not from a region list. Its rarity is `2`.
In that immediate child choice it contributes `1` of `2` slots (50.00%); later child hops are resolved separately.

**Shared terrain:** `plain` (-6..-7); combined authored contribution `-6..-7` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:swamp` identity; surface 1 block(s): `minecraft:grass_block`, `minecraft:brown_concrete_powder`, `minecraft:dirt`, `minecraft:coarse_dirt`; 3 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 3 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`, `minecraft:stone`; 1 object placement rule(s) drawing from 12 object key(s), including `trees/willow/t1`, `trees/willow/t2`, `trees/willow/t3`, `trees/willow/t4`, `trees/willow/t5`, `trees/willow/t6`, `trees/willow/t7`, and 5 more. 4 decorator rule(s) using `minecraft:short_grass`, `minecraft:fern`, `minecraft:blue_orchid`, `minecraft:large_fern`.
- **Underworld 1005:** `minecraft:warped_forest` identity; surface 1 block(s): `minecraft:warped_nylium`, `minecraft:soul_soil`, `minecraft:netherrack`; 3 block(s): `minecraft:netherrack`; 3 block(s): `minecraft:netherrack`, `minecraft:nether_quartz_ore`; 1 object placement rule(s) drawing from 12 object key(s), including `underworld/warped/trees/willow/t1`, `underworld/warped/trees/willow/t2`, `underworld/warped/trees/willow/t3`, `underworld/warped/trees/willow/t4`, `underworld/warped/trees/willow/t5`, `underworld/warped/trees/willow/t6`, `underworld/warped/trees/willow/t7`, and 5 more. 5 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:nether_sprouts`, `minecraft:warped_roots`, `minecraft:warped_fungus`.

## Floating variants

No floating child biomes are declared.


## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome swamp/swamp-forest
/iris what biome
/iris what region
```

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
