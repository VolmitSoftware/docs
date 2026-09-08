---
title: "Biome Atlas — Mesa Plateau High"
description: "Iris biome atlas entry for mesa/plateau-high in Overworld 4007 and Underworld 1010"
published: true
date: 2026-09-08T07:09:46.981Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`mesa/plateau-high` is a directly selected land biome in the current Overworld 4007 and Underworld 1010 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4007 | `hot` (Hot) | 1 | 3 | 0.3333 | 1.94% |
| Underworld 1010 | `hot` (Underworld Hot) | 1 | 3 | 0.3333 | 1.94% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `cracked-cliffs` (70..110); combined authored contribution `70..110` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## 3D terrain

Overworld 4007 and Underworld 1010 share these `terrain3D` settings. Amplitude, feature scales, and crack dimensions use blocks.
The slope gate uses rise divided by horizontal distance. Strength reaches its configured value at the full slope.

| Biome | Treatment | Amplitude | Horizontal / vertical scale | Crack depth / width / scale | Slope start / full |
|---|---|---:|---|---|---|
| `mesa/plateau-high` | Mesa | 48 | 112 / 16 | 32 / 2.5 / 160 | 0.14 / 0.42 |
| `mesa/plateau-dirt-high` | Mesa | 48 | 112 / 16 | 32 / 2.5 / 160 | 0.14 / 0.42 |

Active profiles use Simplex density and crack noise. Deformation starts above fluid level plus 8 blocks and fades across 24 blocks of base elevation.
Each pack retains its own materials, decoration, objects, and ores. Floating islands keep their separate shape settings.

## Overworld 4007 treatment

- **Minecraft identity:** derivative `minecraft:badlands`; native-structure derivative `minecraft:badlands`; underground scatter `minecraft:badlands`, `minecraft:eroded_badlands`.
- **Surface:** 5 block(s): `minecraft:red_terracotta`, `minecraft:terracotta`; 3-8 block(s): `minecraft:terracotta`; 2-8 block(s): `minecraft:orange_terracotta`; 1-8 block(s): `minecraft:white_terracotta`; 4-8 block(s): `minecraft:terracotta`; 3-8 block(s): `minecraft:yellow_terracotta`; 3-8 block(s): `minecraft:brown_terracotta`. Wall palette: none.
- **Content:** 1 decorator rule(s) using `minecraft:tall_grass`.

## Underworld 1010 treatment

- **Minecraft identity:** derivative `minecraft:basalt_deltas`; native-structure derivative `minecraft:basalt_deltas`; custom identities `underworld_mesa_plateau_high_112cc4be`.
- **Surface:** 5 block(s): `minecraft:nether_bricks`, `minecraft:netherrack`; 3-8 block(s): `minecraft:netherrack`; 2-8 block(s): `minecraft:magma_block`; 1-8 block(s): `minecraft:quartz_block`; 4-8 block(s): `minecraft:netherrack`; 3-8 block(s): `minecraft:glowstone`; 3-8 block(s): `minecraft:soul_soil`. Wall palette: none.
- **Content:** 2 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:crimson_fungus`.
- **Entity spawners:** `nether/surface/basalt-deltas`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

### Mesa Plateau Dirt high (`mesa/plateau-dirt-high`)

This child-only biome is selected from `mesa/plateau-high`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `3` of `4` slots (75.00%); later child hops are resolved separately.

**Shared terrain:** `canyon-steep` (70..110), `smooth-dunes` (2..3), `cracked-cliffs` (2..6); combined authored contribution `74..119` blocks relative to fluid height.

- **Overworld 4007:** `minecraft:badlands` identity; surface 5 block(s): `minecraft:grass_block`, `minecraft:coarse_dirt`, `minecraft:dirt`; 3-8 block(s): `minecraft:terracotta`; 2-8 block(s): `minecraft:orange_terracotta`; 1-8 block(s): `minecraft:white_terracotta`; 4-8 block(s): `minecraft:terracotta`; 3-8 block(s): `minecraft:yellow_terracotta`; 3-8 block(s): `minecraft:brown_terracotta`; 1 object placement rule(s) drawing from 3 object key(s), including `trees/acacia/vexed1`, `trees/acacia/vexed2`, `trees/acacia/vexed3`. 1 decorator rule(s) using `minecraft:tall_grass`.
- **Underworld 1010:** `minecraft:basalt_deltas` identity; surface 5 block(s): `minecraft:basalt`, `minecraft:blackstone`; 3-8 block(s): `minecraft:netherrack`; 2-8 block(s): `minecraft:magma_block`; 1-8 block(s): `minecraft:quartz_block`; 4-8 block(s): `minecraft:netherrack`; 3-8 block(s): `minecraft:glowstone`; 3-8 block(s): `minecraft:soul_soil`; 1 object placement rule(s) drawing from 3 object key(s), including `underworld/basalt/trees/acacia/vexed1`, `underworld/basalt/trees/acacia/vexed2`, `underworld/basalt/trees/acacia/vexed3`. 2 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:crimson_fungus`.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome mesa/plateau-high
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
