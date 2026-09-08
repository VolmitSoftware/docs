---
title: "Biome Atlas — Mesa Valley"
description: "Iris biome atlas entry for mesa/valleys in Overworld 4007 and Underworld 1010"
published: true
date: 2026-09-08T07:09:46.981Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`mesa/valleys` is a directly selected land biome in the current Overworld 4007 and Underworld 1010 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4007 | `hot` (Hot) | 2 | 1 | 2 | 11.65% |
| Underworld 1010 | `hot` (Underworld Hot) | 2 | 1 | 2 | 11.65% |

Each repeated entry contributes another `1 / rarity` weight.

The `hot` region intentionally lists `mesa/valleys` twice. Those two direct occurrences produce the combined raw weight `2` and the `11.65%` conditional land-list share shown above. `mesa/valleys` is also a child option of [`mesa/mesa`](/iris/biomes/mesa/mesa), but child resolution happens after root selection and does not create a third region-list occurrence.

## Shared terrain

Both packs use the same generator links: `smooth-dunes` (5..15); combined authored contribution `5..15` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## 3D terrain

Overworld 4007 and Underworld 1010 share these `terrain3D` settings. Amplitude, feature scales, and crack dimensions use blocks.
The slope gate uses rise divided by horizontal distance. Strength reaches its configured value at the full slope.

| Biome | Treatment | Amplitude | Horizontal / vertical scale | Crack depth / width / scale | Slope start / full |
|---|---|---:|---|---|---|
| `mesa/valleys` | Sandstone | 26 | 112 / 18 | 18 / 2.5 / 176 | 0.24 / 0.56 |

Active profiles use Simplex density and crack noise. Deformation starts above fluid level plus 8 blocks and fades across 24 blocks of base elevation.
Each pack retains its own materials, decoration, objects, and ores. Floating islands keep their separate shape settings.

## Overworld 4007 treatment

- **Minecraft identity:** derivative `minecraft:savanna`; native-structure derivative `minecraft:badlands`; no custom or scatter identities.
- **Surface:** 1 block(s) at slope 2-10: `minecraft:terracotta`; 1 block(s) at slope 0-2: `minecraft:red_sand`, `minecraft:orange_terracotta`, `minecraft:grass_block`; 1 block(s): `minecraft:light_gray_terracotta`; 1 block(s): `minecraft:terracotta`, `minecraft:light_gray_terracotta`; 1 block(s): `minecraft:terracotta`; 2 block(s): `minecraft:orange_terracotta`; 1 block(s): `minecraft:terracotta`; 1 block(s): `minecraft:terracotta`, `minecraft:light_gray_terracotta`; 1 block(s): `minecraft:light_gray_terracotta`; 1 block(s): `minecraft:terracotta`. Wall palette: none.
- **Content:** 6 object placement rule(s) drawing from 33 object key(s), including `trees/acacia/vexed1`, `trees/acacia/vexed2`, `trees/acacia/vexed3`, `clutter/camp1`, `clutter/bincluster1`, `trees/acacia/savannad1`, `trees/acacia/savannad2`, and 26 more. 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:white_tulip`, `minecraft:red_tulip`, `minecraft:orange_tulip`, `minecraft:dandelion`, `minecraft:poppy`, `minecraft:tall_grass`, `minecraft:short_grass`.

## Underworld 1010 treatment

- **Minecraft identity:** derivative `minecraft:basalt_deltas`; native-structure derivative `minecraft:basalt_deltas`; custom identities `underworld_mesa_valleys_4ba9014b`.
- **Surface:** 1 block(s) at slope 2-10: `minecraft:netherrack`; 1 block(s) at slope 0-2: `minecraft:blackstone`, `minecraft:magma_block`, `minecraft:basalt`; 1 block(s): `minecraft:quartz_bricks`; 1 block(s): `minecraft:netherrack`, `minecraft:quartz_bricks`; 1 block(s): `minecraft:netherrack`; 2 block(s): `minecraft:magma_block`; 1 block(s): `minecraft:netherrack`; 1 block(s): `minecraft:netherrack`, `minecraft:quartz_bricks`; 1 block(s): `minecraft:quartz_bricks`; 1 block(s): `minecraft:netherrack`. Wall palette: none.
- **Content:** 6 object placement rule(s) drawing from 33 object key(s), including `underworld/basalt/trees/acacia/vexed1`, `underworld/basalt/trees/acacia/vexed2`, `underworld/basalt/trees/acacia/vexed3`, `underworld/basalt/clutter/camp1`, `underworld/basalt/clutter/bincluster1`, `underworld/basalt/trees/acacia/savannad1`, `underworld/basalt/trees/acacia/savannad2`, and 26 more. 5 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:fire`, `minecraft:crimson_fungus`, `minecraft:nether_sprouts`.
- **Entity spawners:** `nether/surface/basalt-deltas`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome mesa/valleys
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
