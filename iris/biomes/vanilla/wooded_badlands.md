---
title: "Biome Atlas — Wooded Badlands"
description: "Iris biome atlas entry for vanilla/wooded_badlands in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`vanilla/wooded_badlands` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `hot` (Hot) | 1 | 1 | 1 | 5.83% |
| Underworld 1005 | `hot` (Underworld Hot) | 1 | 1 | 1 | 5.83% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `mountain` (20..75); combined authored contribution `20..75` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:wooded_badlands`; native-structure derivative `minecraft:wooded_badlands`; custom identities `wooded_badlands`.
- **Surface:** 1 block(s) at slope 2-10: `minecraft:terracotta`; 1 block(s) at slope 0-2: `minecraft:red_sand`, `minecraft:orange_terracotta`, `minecraft:grass_block`; 1 block(s): `minecraft:light_gray_terracotta`; 1 block(s): `minecraft:terracotta`, `minecraft:light_gray_terracotta`; 1 block(s): `minecraft:terracotta`; 2 block(s): `minecraft:orange_terracotta`; 1 block(s): `minecraft:terracotta`; 1 block(s): `minecraft:terracotta`, `minecraft:light_gray_terracotta`; 1 block(s): `minecraft:light_gray_terracotta`; 1 block(s): `minecraft:terracotta`. Wall palette: none.
- **Content:** 6 object placement rule(s) drawing from 33 object key(s), including `trees/acacia/vexed1`, `trees/acacia/vexed2`, `trees/acacia/vexed3`, `clutter/camp1`, `clutter/bincluster1`, `trees/acacia/savannaD1`, `trees/acacia/savannaD2`, and 26 more. 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:white_tulip`, `minecraft:red_tulip`, `minecraft:orange_tulip`, `minecraft:dandelion`, `minecraft:poppy`, `minecraft:tall_grass`, `minecraft:short_grass`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:basalt_deltas`; native-structure derivative `minecraft:basalt_deltas`; custom identities `underworld_vanilla_wooded_badlands_29c5759d`.
- **Surface:** 1 block(s) at slope 2-10: `minecraft:netherrack`; 1 block(s) at slope 0-2: `minecraft:blackstone`, `minecraft:magma_block`, `minecraft:basalt`; 1 block(s): `minecraft:quartz_bricks`; 1 block(s): `minecraft:netherrack`, `minecraft:quartz_bricks`; 1 block(s): `minecraft:netherrack`; 2 block(s): `minecraft:magma_block`; 1 block(s): `minecraft:netherrack`; 1 block(s): `minecraft:netherrack`, `minecraft:quartz_bricks`; 1 block(s): `minecraft:quartz_bricks`; 1 block(s): `minecraft:netherrack`. Wall palette: none.
- **Content:** 6 object placement rule(s) drawing from 33 object key(s), including `underworld/basalt/trees/acacia/vexed1`, `underworld/basalt/trees/acacia/vexed2`, `underworld/basalt/trees/acacia/vexed3`, `underworld/basalt/clutter/camp1`, `underworld/basalt/clutter/bincluster1`, `underworld/basalt/trees/acacia/savannaD1`, `underworld/basalt/trees/acacia/savannaD2`, and 26 more. 5 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:fire`, `minecraft:crimson_fungus`, `minecraft:nether_sprouts`.
- **Entity spawners:** `nether/surface/basalt-deltas`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome vanilla/wooded_badlands
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
