---
title: "Biome Atlas — Tropical Mountain Extreme"
description: "Iris biome atlas entry for tropical/mountain-extreme in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`tropical/mountain-extreme` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `tropical` (Tropical) | 1 | 1 | 1 | 8.33% |
| Underworld 1005 | `tropical` (Underworld Tropical) | 1 | 1 | 1 | 8.33% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `mountain` (112..195); combined authored contribution `112..195` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:sparse_jungle`; native-structure derivative `minecraft:jungle`; custom identities `tropical_mountain_extreme`.
- **Surface:** 1 block(s) at slope 0-4.5: `minecraft:grass_block`; 2 block(s) at slope 0-4.5: `minecraft:dirt`. Wall palette: none.
- **Content:** 3 object placement rule(s) drawing from 24 object key(s), including `clutter/sbush1`, `clutter/sbush2`, `clutter/sbush3`, `trees/jungle/lgeneric1`, `trees/jungle/lgeneric2`, `trees/jungle/lgeneric3`, `trees/jungle/lgeneric4`, and 17 more. 4 decorator rule(s) using `minecraft:short_grass`, `minecraft:tall_grass`, `minecraft:dandelion`, `minecraft:poppy`, `minecraft:blue_orchid`, `minecraft:allium`, `minecraft:azure_bluet`, `minecraft:red_tulip`, `minecraft:orange_tulip`, and 6 more.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:basalt_deltas`; native-structure derivative `minecraft:basalt_deltas`; custom identities `underworld_tropical_mountain_extreme_b321353c`.
- **Surface:** 1 block(s) at slope 0-4.5: `minecraft:basalt`; 2 block(s) at slope 0-4.5: `minecraft:blackstone`. Wall palette: none.
- **Content:** 3 object placement rule(s) drawing from 24 object key(s), including `underworld/basalt/clutter/sbush1`, `underworld/basalt/clutter/sbush2`, `underworld/basalt/clutter/sbush3`, `underworld/basalt/trees/jungle/lgeneric1`, `underworld/basalt/trees/jungle/lgeneric2`, `underworld/basalt/trees/jungle/lgeneric3`, `underworld/basalt/trees/jungle/lgeneric4`, and 17 more. 5 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:fire`, `minecraft:crimson_fungus`, `minecraft:nether_sprouts`, `minecraft:nether_wart_block`.
- **Entity spawners:** `nether/surface/basalt-deltas`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

### Tropical Mountain Water (`tropical/mountain-water`)

This child-only biome is selected from `tropical/mountain-extreme`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `1` of `2` slots (50.00%); later child hops are resolved separately.

**Shared terrain:** `mountain` (2..5); combined authored contribution `2..5` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:jungle` identity; surface 0-2 block(s): `minecraft:cave_air`; 1 block(s): `minecraft:water`; 1-4 block(s): `minecraft:water`; 2-4 block(s): `minecraft:gravel`; 3 decorator rule(s) using `minecraft:dandelion`, `minecraft:poppy`, `minecraft:blue_orchid`, `minecraft:allium`, `minecraft:azure_bluet`, `minecraft:red_tulip`, `minecraft:orange_tulip`, `minecraft:white_tulip`, `minecraft:pink_tulip`, and 5 more.
- **Underworld 1005:** `minecraft:basalt_deltas` identity; surface 0-2 block(s): `minecraft:cave_air`; 1 block(s): `minecraft:lava`; 1-4 block(s): `minecraft:lava`; 2-4 block(s): `minecraft:gravel`; 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:crimson_fungus`, `minecraft:nether_sprouts`, `minecraft:fire`.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome tropical/mountain-extreme
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
