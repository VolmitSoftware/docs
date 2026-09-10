---
title: "Biome Atlas — Savanna"
description: "Iris biome atlas entry for savanna/savanna in Overworld 4007 and Underworld 1010"
published: true
date: 2026-09-08T23:35:09.010Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`savanna/savanna` is a directly selected land biome in the current Overworld 4007 and Underworld 1010 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4007 | `hot` (Hot) | 1 | 1 | 1 | 5.83% |
| Underworld 1010 | `hot` (Underworld Hot) | 1 | 1 | 1 | 5.83% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `plain` (10..20); combined authored contribution `10..20` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## 3D terrain

Overworld 4007 and Underworld 1010 share these `terrain3D` settings. Amplitude, feature scales, and crack dimensions use blocks.
The slope gate uses rise divided by horizontal distance. Strength reaches its configured value at the full slope.

| Biome | Treatment | Amplitude | Horizontal / vertical scale | Crack depth / width / scale | Slope start / full | Density noise / Crack noise |
|---|---|---:|---|---|---|---|
| `savanna/savanna` | Lowland | 10 | 192 / 24 | None | 0.18 / 0.48 | `PERLIN` / None |
| `savanna/cliff` | Cliff | 56 | 224 / 30 | 14 / 2.25 / 336 | 0.12 / 0.4 | `NOWHERE` / `SIMPLEX` |
| `savanna/cliff-extended` | Cliff | 56 | 224 / 30 | 14 / 2.25 / 336 | 0.12 / 0.4 | `NOWHERE` / `SIMPLEX` |

The table lists each profile’s density and crack noise. Active deformation starts above fluid level plus 8 blocks and fades across 24 blocks of base elevation.
Each pack retains its own materials, decoration, objects, and ores. Floating islands keep their separate shape settings.

## Overworld 4007 treatment

- **Minecraft identity:** derivative `minecraft:savanna`; native-structure derivative `minecraft:savanna`; custom identities `savanna`; underground scatter `minecraft:savanna`, `minecraft:desert`; sky scatter `minecraft:desert`, `minecraft:savanna`.
- **Surface:** 3-5 block(s) at slope >= 6.9: `minecraft:granite`; 3-5 block(s) at slope >= 4.6: `minecraft:coarse_dirt`, `minecraft:gravel`; 1 block(s): `minecraft:grass_block`; 2-4 block(s): `minecraft:dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 6 object placement rule(s) drawing from 38 object key(s), including `clutter/camp1`, `clutter/bincluster1`, `trees/acacia/savannad1`, `trees/acacia/savannad2`, `trees/acacia/savannad3`, `trees/acacia/savannaf1`, `trees/acacia/savannaf2`, and 31 more. 6 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:dead_bush`, `minecraft:cactus`, `minecraft:cactus_flower`, `minecraft:short_grass`, `minecraft:tall_grass`.

## Underworld 1010 treatment

- **Minecraft identity:** derivative `minecraft:nether_wastes`; native-structure derivative `minecraft:nether_wastes`; custom identities `underworld_savanna_savanna_45d027e0`.
- **Surface:** 3-5 block(s) at slope >= 6.9: `minecraft:magma_block`; 3-5 block(s) at slope >= 4.6: `minecraft:netherrack`, `minecraft:gravel`; 1 block(s): `minecraft:netherrack`; 2-4 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`.
- **Content:** 6 object placement rule(s) drawing from 38 object key(s), including `underworld/wastes/clutter/camp1`, `underworld/wastes/clutter/bincluster1`, `underworld/wastes/trees/acacia/savannad1`, `underworld/wastes/trees/acacia/savannad2`, `underworld/wastes/trees/acacia/savannad3`, `underworld/wastes/trees/acacia/savannaf1`, `underworld/wastes/trees/acacia/savannaf2`, and 31 more. 7 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:crimson_fungus`, `minecraft:crimson_stem`, `minecraft:fire`.
- **Entity spawners:** `nether/surface/nether-wastes`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

### Savanna Cliffs (`savanna/cliff`)

This child-only biome is selected from `savanna/savanna`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `1` of `2` slots (50.00%); later child hops are resolved separately.

**Shared terrain:** `plain-cliffs` (35..65); combined authored contribution `35..65` blocks relative to fluid height.

- **Overworld 4007:** `minecraft:savanna` identity; surface 3-5 block(s) at slope >= 6.9: `minecraft:sandstone`, `minecraft:sand`; 3-5 block(s) at slope >= 4.6: `minecraft:sand`, `minecraft:coarse_dirt`, `minecraft:gravel`; 1 block(s): `minecraft:grass_block`; 2-4 block(s): `minecraft:dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`; 4 object placement rule(s) drawing from 36 object key(s), including `trees/acacia/savannad1`, `trees/acacia/savannad2`, `trees/acacia/savannad3`, `trees/acacia/savannaf1`, `trees/acacia/savannaf2`, `trees/acacia/savannaf3`, `trees/acacia/savannaf4`, and 29 more. 6 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:dead_bush`, `minecraft:cactus`, `minecraft:cactus_flower`, `minecraft:short_grass`, `minecraft:tall_grass`.
- **Underworld 1010:** `minecraft:nether_wastes` identity; surface 3-5 block(s) at slope >= 6.9: `minecraft:smooth_basalt`, `minecraft:netherrack`; 3-5 block(s) at slope >= 4.6: `minecraft:netherrack`, `minecraft:gravel`; 1 block(s): `minecraft:netherrack`; 2-4 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`; 4 object placement rule(s) drawing from 36 object key(s), including `underworld/wastes/trees/acacia/savannad1`, `underworld/wastes/trees/acacia/savannad2`, `underworld/wastes/trees/acacia/savannad3`, `underworld/wastes/trees/acacia/savannaf1`, `underworld/wastes/trees/acacia/savannaf2`, `underworld/wastes/trees/acacia/savannaf3`, `underworld/wastes/trees/acacia/savannaf4`, and 29 more. 7 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:crimson_fungus`, `minecraft:crimson_stem`, `minecraft:fire`.

Direct-root children continue on their own pages: [`savanna/acacia-denmyre`](/iris/biomes/savanna/acacia-denmyre).

### Savanna Cliffs (`savanna/cliff-extended`)

This child-only biome is selected from `savanna/cliff`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `1` of `3` slots (33.33%); later child hops are resolved separately.

**Shared terrain:** `plain-cliffs` (55..85); combined authored contribution `55..85` blocks relative to fluid height.

- **Overworld 4007:** `minecraft:savanna` identity; surface 3-5 block(s) at slope >= 6.9: `minecraft:sandstone`, `minecraft:sand`; 3-5 block(s) at slope >= 4.6: `minecraft:sand`, `minecraft:coarse_dirt`, `minecraft:gravel`; 1 block(s): `minecraft:grass_block`; 2-4 block(s): `minecraft:dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`; 4 object placement rule(s) drawing from 36 object key(s), including `trees/acacia/savannad1`, `trees/acacia/savannad2`, `trees/acacia/savannad3`, `trees/acacia/savannaf1`, `trees/acacia/savannaf2`, `trees/acacia/savannaf3`, `trees/acacia/savannaf4`, and 29 more. 6 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:dead_bush`, `minecraft:cactus`, `minecraft:cactus_flower`, `minecraft:short_grass`, `minecraft:tall_grass`.
- **Underworld 1010:** `minecraft:nether_wastes` identity; surface 3-5 block(s) at slope >= 6.9: `minecraft:smooth_basalt`, `minecraft:netherrack`; 3-5 block(s) at slope >= 4.6: `minecraft:netherrack`, `minecraft:gravel`; 1 block(s): `minecraft:netherrack`; 2-4 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`; 4 object placement rule(s) drawing from 36 object key(s), including `underworld/wastes/trees/acacia/savannad1`, `underworld/wastes/trees/acacia/savannad2`, `underworld/wastes/trees/acacia/savannad3`, `underworld/wastes/trees/acacia/savannaf1`, `underworld/wastes/trees/acacia/savannaf2`, `underworld/wastes/trees/acacia/savannaf3`, `underworld/wastes/trees/acacia/savannaf4`, and 29 more. 7 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:crimson_fungus`, `minecraft:crimson_stem`, `minecraft:fire`.

Direct-root children continue on their own pages: [`savanna/acacia-denmyre`](/iris/biomes/savanna/acacia-denmyre).

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome savanna/savanna
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
