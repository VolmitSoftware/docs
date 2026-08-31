---
title: "Biome Atlas — Swamp Marsh"
description: "Iris biome atlas entry for swamp/marsh in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`swamp/marsh` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `swamp` (Swamp) | 1 | 1 | 1 | 11.67% |
| Underworld 1005 | `swamp` (Underworld Swamp) | 1 | 1 | 1 | 11.67% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `mountain` (3..10); combined authored contribution `3..10` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:swamp`; native-structure derivative `minecraft:swamp`; custom identities `swamp_marsh_rotten`.
- **Surface:** 1 block(s): `minecraft:grass_block`, `minecraft:podzol`; 1 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 2 object placement rule(s) drawing from 11 object key(s), including `trees/jungle/lgeneric1`, `trees/jungle/lgeneric2`, `trees/jungle/lgeneric3`, `trees/jungle/lgeneric4`, `trees/jungle/lgeneric5`, `trees/jungle/lgeneric7`, `trees/jungle/lgeneric8`, and 4 more. 3 decorator rule(s) using `minecraft:brown_mushroom`, `minecraft:red_mushroom`, `minecraft:large_fern`, `minecraft:tall_grass`, `minecraft:short_grass`, `minecraft:fern`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:warped_forest`; native-structure derivative `minecraft:warped_forest`; custom identities `underworld_swamp_marsh_e05fcd66`.
- **Surface:** 1 block(s): `minecraft:warped_nylium`; 1 block(s): `minecraft:netherrack`; 1-3 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`.
- **Content:** 2 object placement rule(s) drawing from 11 object key(s), including `underworld/warped/trees/jungle/lgeneric1`, `underworld/warped/trees/jungle/lgeneric2`, `underworld/warped/trees/jungle/lgeneric3`, `underworld/warped/trees/jungle/lgeneric4`, `underworld/warped/trees/jungle/lgeneric5`, `underworld/warped/trees/jungle/lgeneric7`, `underworld/warped/trees/jungle/lgeneric8`, and 4 more. 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:warped_fungus`, `minecraft:nether_sprouts`.
- **Entity spawners:** `nether/surface/warped-forest`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

### Swamp Marsh Rotten (`swamp/marsh-rotten`)

This child-only biome is selected from `swamp/marsh`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `1` of `2` slots (50.00%); later child hops are resolved separately.

**Shared terrain:** `plain` (-5..4); combined authored contribution `-5..4` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:swamp` identity; surface 1 block(s): `minecraft:grass_block`, `minecraft:podzol`, `minecraft:mud`; 1 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`; 3 object placement rule(s) drawing from 19 object key(s), including `trees/oak/dead1`, `trees/oak/dead2`, `trees/oak/dead3`, `trees/oak/dead4`, `trees/oak/dead5`, `trees/oak/dead6`, `clutter/shrub1`, and 12 more. 3 decorator rule(s) using `minecraft:brown_mushroom`, `minecraft:red_mushroom`, `minecraft:large_fern`, `minecraft:tall_grass`, `minecraft:dead_bush`, `minecraft:fern`.
- **Underworld 1005:** `minecraft:warped_forest` identity; surface 1 block(s): `minecraft:warped_nylium`, `minecraft:netherrack`; 1 block(s): `minecraft:netherrack`; 1-3 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`; 3 object placement rule(s) drawing from 19 object key(s), including `underworld/warped/trees/oak/dead1`, `underworld/warped/trees/oak/dead2`, `underworld/warped/trees/oak/dead3`, `underworld/warped/trees/oak/dead4`, `underworld/warped/trees/oak/dead5`, `underworld/warped/trees/oak/dead6`, `underworld/warped/clutter/shrub1`, and 12 more. 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:warped_fungus`, `minecraft:nether_sprouts`.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome swamp/marsh
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
