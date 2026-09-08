---
title: "Biome Atlas — Ancient Sands"
description: "Iris biome atlas entry for terralost/ancient-sands in Overworld 4007 and Underworld 1010"
published: true
date: 2026-09-08T16:43:54.130Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`terralost/ancient-sands` is a directly selected land biome in the current Overworld 4007 and Underworld 1010 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4007 | `terralost` (Terralost) | 1 | 1 | 1 | 20.00% |
| Underworld 1010 | `terralost` (Underworld Terralost) | 1 | 1 | 1 | 20.00% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `smooth-dunes` (30..35), `mountain` (0..20), `rare-hills` (0..20); combined authored contribution `30..75` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## 3D terrain

Overworld 4007 and Underworld 1010 share these `terrain3D` settings. Amplitude, feature scales, and crack dimensions use blocks.
The slope gate uses rise divided by horizontal distance. Strength reaches its configured value at the full slope.

| Biome | Treatment | Amplitude | Horizontal / vertical scale | Crack depth / width / scale | Slope start / full |
|---|---|---:|---|---|---|
| `terralost/ancient-sands` | Sandstone | 26 | 144 / 24 | 14 / 2.5 / 240 | 0.24 / 0.56 |

Active profiles use Simplex density and crack noise. Deformation starts above fluid level plus 8 blocks and fades across 24 blocks of base elevation.
Each pack retains its own materials, decoration, objects, and ores. Floating islands keep their separate shape settings.

## Overworld 4007 treatment

- **Minecraft identity:** derivative `minecraft:desert`; native-structure derivative `minecraft:desert`; custom identities `terralost_ancientsands`.
- **Surface:** 3-10 block(s): `minecraft:orange_terracotta`, `minecraft:red_sand`, `minecraft:sandstone`, `minecraft:sand`; 5 block(s): `minecraft:red_sand`; 3-10 block(s) at slope 4.5-20: `minecraft:sandstone`; 5 block(s): `minecraft:sand`. Wall palette: none.
- **Content:** 1 object placement rule(s) drawing from 2 object key(s), including `clutter/rsphinx1`, `clutter/rbrksphinx1`. 3 decorator rule(s) using `minecraft:cactus`, `minecraft:cactus_flower`, `minecraft:dead_bush`.

## Underworld 1010 treatment

- **Minecraft identity:** derivative `minecraft:soul_sand_valley`; native-structure derivative `minecraft:soul_sand_valley`; custom identities `underworld_terralost_ancient_sands_e96a9b24`.
- **Surface:** 3-10 block(s): `minecraft:magma_block`, `minecraft:soul_sand`, `minecraft:smooth_basalt`; 5 block(s): `minecraft:soul_sand`; 3-10 block(s) at slope 4.5-20: `minecraft:smooth_basalt`; 5 block(s): `minecraft:soul_sand`. Wall palette: none.
- **Content:** 1 object placement rule(s) drawing from 2 object key(s), including `underworld/soul/clutter/rsphinx1`, `underworld/soul/clutter/rbrksphinx1`. 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:warped_stem`, `minecraft:nether_sprouts`.
- **Entity spawners:** `nether/surface/soul-sand-valley`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome terralost/ancient-sands
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
