---
title: "Biome Atlas — Savanna Plateau"
description: "Iris biome atlas entry for savanna/plateau in Overworld 4007 and Underworld 1010"
published: true
date: 2026-09-08T07:09:46.981Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`savanna/plateau` is a directly selected land biome in the current Overworld 4007 and Underworld 1010 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4007 | `hot` (Hot) | 1 | 1 | 1 | 5.83% |
| Underworld 1010 | `hot` (Underworld Hot) | 1 | 1 | 1 | 5.83% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `mountain` (13..26); combined authored contribution `13..26` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## 3D terrain

Overworld 4007 and Underworld 1010 share these `terrain3D` settings. Amplitude, feature scales, and crack dimensions use blocks.
The slope gate uses rise divided by horizontal distance. Strength reaches its configured value at the full slope.

| Biome | Treatment | Amplitude | Horizontal / vertical scale | Crack depth / width / scale | Slope start / full |
|---|---|---:|---|---|---|
| `savanna/plateau` | Hills | 22 | 112 / 18 | 8 / 2.5 / 176 | 0.18 / 0.5 |

Active profiles use Simplex density and crack noise. Deformation starts above fluid level plus 8 blocks and fades across 24 blocks of base elevation.
Each pack retains its own materials, decoration, objects, and ores. Floating islands keep their separate shape settings.

## Overworld 4007 treatment

- **Minecraft identity:** derivative `minecraft:savanna_plateau`; native-structure derivative `minecraft:savanna`; custom identities `savanna_plateau`; underground scatter `minecraft:savanna`, `minecraft:desert`; sky scatter `minecraft:desert`, `minecraft:savanna`.
- **Surface:** 3-5 block(s) at slope >= 6.9: `minecraft:granite`; 3-5 block(s) at slope >= 4.6: `minecraft:coarse_dirt`, `minecraft:gravel`; 1 block(s): `minecraft:grass_block`; 2-4 block(s): `minecraft:dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 6 object placement rule(s) drawing from 38 object key(s), including `clutter/camp1`, `clutter/bincluster1`, `trees/acacia/savannad1`, `trees/acacia/savannad2`, `trees/acacia/savannad3`, `trees/acacia/savannaf1`, `trees/acacia/savannaf2`, and 31 more. 6 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:dead_bush`, `minecraft:cactus`, `minecraft:cactus_flower`, `minecraft:short_grass`, `minecraft:tall_grass`.

## Underworld 1010 treatment

- **Minecraft identity:** derivative `minecraft:nether_wastes`; native-structure derivative `minecraft:nether_wastes`; custom identities `underworld_savanna_plateau_f5a10088`.
- **Surface:** 3-5 block(s) at slope >= 6.9: `minecraft:magma_block`; 3-5 block(s) at slope >= 4.6: `minecraft:netherrack`, `minecraft:gravel`; 1 block(s): `minecraft:netherrack`; 2-4 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`.
- **Content:** 6 object placement rule(s) drawing from 38 object key(s), including `underworld/wastes/clutter/camp1`, `underworld/wastes/clutter/bincluster1`, `underworld/wastes/trees/acacia/savannad1`, `underworld/wastes/trees/acacia/savannad2`, `underworld/wastes/trees/acacia/savannad3`, `underworld/wastes/trees/acacia/savannaf1`, `underworld/wastes/trees/acacia/savannaf2`, and 31 more. 7 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:crimson_fungus`, `minecraft:crimson_stem`, `minecraft:fire`.
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
