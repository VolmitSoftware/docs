---
title: "Biome Atlas — Swamp Forest"
description: "Iris biome atlas entry for swamp/swamp-forest in Overworld 4007 and Underworld 1010"
published: true
date: 2026-09-09T05:29:01.778Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`swamp/swamp-forest` is a directly selected land biome in the current Overworld 4007 and Underworld 1010 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4007 | `swamp` (Swamp) | 1 | 2 | 0.5 | 5.84% |
| Underworld 1010 | `swamp` (Underworld Swamp) | 1 | 2 | 0.5 | 5.84% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `plain` (1..4); combined authored contribution `1..4` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## 3D terrain

Overworld 4007 and Underworld 1010 share these `terrain3D` settings. Amplitude, feature scales, and crack dimensions use blocks.
The slope gate uses rise divided by horizontal distance. Strength reaches its configured value at the full slope.

| Biome | Treatment | Amplitude | Horizontal / vertical scale | Crack depth / width / scale | Slope start / full | Density noise / Crack noise |
|---|---|---:|---|---|---|---|
| `swamp/swamp-forest` | Protected | 0 | None | None | None | None / None |
| `swamp/swamp-puddle` | Protected | 0 | None | None | None | None / None |

The table lists each profile’s density and crack noise. Active deformation starts above fluid level plus 8 blocks and fades across 24 blocks of base elevation.
Each pack retains its own materials, decoration, objects, and ores. Floating islands keep their separate shape settings.

- `swamp/swamp-forest`: Low wetland forest retains its floor and tree supports.
- `swamp/swamp-puddle`: Puddle beds retain their current terrain.

## Overworld 4007 treatment

- **Minecraft identity:** derivative `minecraft:swamp`; native-structure derivative `minecraft:swamp`; custom identities `k530forestswamp`.
- **Surface:** 1 block(s): `minecraft:grass_block`, `minecraft:brown_concrete_powder`, `minecraft:dirt`, `minecraft:coarse_dirt`; 3 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 3 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`, `minecraft:stone`. Wall palette: none.
- **Content:** 3 object placement rule(s) drawing from 19 object key(s), including `trees/mixed/dotree1`, `trees/mixed/dotree2`, `trees/mixed/dotree3`, `trees/mixed/dotree4`, `trees/mixed/dotree5`, `trees/mixed/dotree6`, `trees/mixed/dotree7`, and 12 more. 6 decorator rule(s) using `minecraft:dark_oak_leaves`, `minecraft:short_grass`, `minecraft:fern`, `minecraft:blue_orchid`, `minecraft:brown_mushroom`, `minecraft:red_mushroom`, `minecraft:large_fern`.

- **Tree materials:** The shared `trees/mixed/dotree1` through `trees/mixed/dotree10` objects use their original oak, spruce, and dark oak fences and connections.

## Underworld 1010 treatment

- **Minecraft identity:** derivative `minecraft:warped_forest`; native-structure derivative `minecraft:warped_forest`; custom identities `underworld_swamp_swamp_forest_d10481fa`.
- **Surface:** 1 block(s): `minecraft:warped_nylium`, `minecraft:soul_soil`, `minecraft:netherrack`; 3 block(s): `minecraft:netherrack`; 3 block(s): `minecraft:netherrack`, `minecraft:nether_quartz_ore`. Wall palette: none.
- **Content:** 3 object placement rule(s) drawing from 19 object key(s), including `underworld/warped/trees/mixed/dotree1`, `underworld/warped/trees/mixed/dotree2`, `underworld/warped/trees/mixed/dotree3`, `underworld/warped/trees/mixed/dotree4`, `underworld/warped/trees/mixed/dotree5`, `underworld/warped/trees/mixed/dotree6`, `underworld/warped/trees/mixed/dotree7`, and 12 more. 7 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:warped_wart_block`, `minecraft:nether_sprouts`, `minecraft:warped_roots`, `minecraft:warped_fungus`.
- **Entity spawners:** `nether/surface/warped-forest`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

### Swamp Puddle (`swamp/swamp-puddle`)

This child-only biome is selected from `swamp/swamp-forest`, not from a region list. Its rarity is `2`.
In that immediate child choice it contributes `1` of `2` slots (50.00%); later child hops are resolved separately.

**Shared terrain:** `plain` (-6..-7); combined authored contribution `-6..-7` blocks relative to fluid height.

- **Overworld 4007:** `minecraft:swamp` identity; surface 1 block(s): `minecraft:grass_block`, `minecraft:brown_concrete_powder`, `minecraft:dirt`, `minecraft:coarse_dirt`; 3 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 3 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`, `minecraft:stone`; 1 object placement rule(s) drawing from 12 object key(s), including `trees/willow/t1`, `trees/willow/t2`, `trees/willow/t3`, `trees/willow/t4`, `trees/willow/t5`, `trees/willow/t6`, `trees/willow/t7`, and 5 more. 4 decorator rule(s) using `minecraft:short_grass`, `minecraft:fern`, `minecraft:blue_orchid`, `minecraft:large_fern`.
- **Underworld 1010:** `minecraft:warped_forest` identity; surface 1 block(s): `minecraft:warped_nylium`, `minecraft:soul_soil`, `minecraft:netherrack`; 3 block(s): `minecraft:netherrack`; 3 block(s): `minecraft:netherrack`, `minecraft:nether_quartz_ore`; 1 object placement rule(s) drawing from 12 object key(s), including `underworld/warped/trees/willow/t1`, `underworld/warped/trees/willow/t2`, `underworld/warped/trees/willow/t3`, `underworld/warped/trees/willow/t4`, `underworld/warped/trees/willow/t5`, `underworld/warped/trees/willow/t6`, `underworld/warped/trees/willow/t7`, and 5 more. 5 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:nether_sprouts`, `minecraft:warped_roots`, `minecraft:warped_fungus`.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome swamp/swamp-forest
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
