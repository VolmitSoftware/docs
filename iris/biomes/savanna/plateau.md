---
title: "Biome Atlas — Savanna Plateau"
description: "Iris biome atlas entry for savanna/plateau in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`savanna/plateau` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `hot` (Hot) | 1 | 1 | 1 | 5.83% |
| Underworld 1005 | `hot` (Underworld Hot) | 1 | 1 | 1 | 5.83% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `mountain` (13..26); combined authored contribution `13..26` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:savanna_plateau`; native-structure derivative `minecraft:savanna`; custom identities `savanna_plateau`; underground scatter `minecraft:savanna`, `minecraft:desert`; sky scatter `minecraft:desert`, `minecraft:savanna`.
- **Surface:** 3-5 block(s) at slope >= 6.9: `minecraft:granite`; 3-5 block(s) at slope >= 4.6: `minecraft:coarse_dirt`, `minecraft:gravel`; 1 block(s): `minecraft:grass_block`; 2-4 block(s): `minecraft:dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 6 object placement rule(s) drawing from 38 object key(s), including `clutter/camp1`, `clutter/bincluster1`, `trees/acacia/savannaD1`, `trees/acacia/savannaD2`, `trees/acacia/savannaD3`, `trees/acacia/savannaF1`, `trees/acacia/savannaF2`, and 31 more. 6 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:dead_bush`, `minecraft:cactus`, `minecraft:cactus_flower`, `minecraft:short_grass`, `minecraft:tall_grass`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:nether_wastes`; native-structure derivative `minecraft:nether_wastes`; custom identities `underworld_savanna_plateau_f5a10088`.
- **Surface:** 3-5 block(s) at slope >= 6.9: `minecraft:magma_block`; 3-5 block(s) at slope >= 4.6: `minecraft:netherrack`, `minecraft:gravel`; 1 block(s): `minecraft:netherrack`; 2-4 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`.
- **Content:** 6 object placement rule(s) drawing from 38 object key(s), including `underworld/wastes/clutter/camp1`, `underworld/wastes/clutter/bincluster1`, `underworld/wastes/trees/acacia/savannaD1`, `underworld/wastes/trees/acacia/savannaD2`, `underworld/wastes/trees/acacia/savannaD3`, `underworld/wastes/trees/acacia/savannaF1`, `underworld/wastes/trees/acacia/savannaF2`, and 31 more. 7 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:crimson_fungus`, `minecraft:crimson_stem`, `minecraft:fire`.
- **Entity spawners:** `nether/surface/nether-wastes`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome savanna/plateau
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
