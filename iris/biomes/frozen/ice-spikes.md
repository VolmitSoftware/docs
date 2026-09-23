---
title: "Biome Atlas — Ice Spikes"
description: "Iris biome atlas entry for frozen/ice-spikes in Overworld and Underworld"
published: true
date: 2026-09-23T11:12:42.385Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`frozen/ice-spikes` is a directly selected land biome in the Overworld and Underworld packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

Both packs use matching compact crooked spires, drift boulders, shard fans, frost blooms, and sprigs. Placement chances, variant seeds, dimensions, and support settings match. Large formations use continuous organic supports with a 96-block terrain scan. Underworld uses soul soil and bone for these forms.

This biome uses the denser frozen pool. Crooked spires are 14 to 24 blocks tall with `chance: 0.3` and `density: 1`. Drift boulders are 3 to 5 blocks tall with `chance: 0.4` and `density: 2`. Every formation and crystal entry has a chance below one.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld | `frozen` (Frozen) | 1 | 1 | 1 | 5.69% |
| Underworld | `frozen` (Frozen) | 1 | 1 | 1 | 5.69% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

The terrain generators use `surfaceDetail: 0.5` to smooth small surface variations. See [Generators and noise](/iris/14-generators-noise).

Both packs use the same generator links: `mountain` (15..43), `highplains` (40..50); combined authored contribution `55..93` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## 3D terrain

Overworld and Underworld share these `terrain3D` settings. Amplitude, feature scales, and crack dimensions use blocks.
The slope gate uses rise divided by horizontal distance. Strength reaches its configured value at the full slope.

| Biome | Treatment | Amplitude | Horizontal / vertical scale | Crack depth / width / scale | Slope start / full | Density noise / Crack noise |
|---|---|---:|---|---|---|---|
| `frozen/ice-spikes` | Glacial | 48 | 264 / 36 | 12 / 2.25 / 416 | 0.18 / 0.5 | `SIMPLEX` / `SIMPLEX` |

The table lists each profile’s density and crack noise. Active deformation starts above fluid level plus 8 blocks and fades across 24 blocks of base elevation.
Each pack retains its own materials, decoration, objects, and ores. Floating islands keep their separate shape settings.

## Overworld treatment

- **Minecraft identity:** derivative `minecraft:snowy_plains`; native-structure derivative `minecraft:snowy_plains`; custom identities `winter_mountain_forest1`, `winter_mountain_forest2`, `winter_mountain_forest3`.
- **Surface:** 1 block(s) at slope 0-3.3: `minecraft:snow_block`; 3 block(s) at slope 0-3: `minecraft:dirt`; 3 block(s) at slope 0-3: `minecraft:dirt`, `minecraft:stone`. Wall palette: `minecraft:stone`, `minecraft:andesite`, `minecraft:gravel`.
- **Content:** The frozen procedural snippet contains eight formation entries and two crystal entries.

## Underworld treatment

- **Minecraft identity:** derivative `minecraft:soul_sand_valley`; native-structure derivative `minecraft:soul_sand_valley`; custom identities `underworld_frozen_ice_spikes_bb184866`.
- **Surface:** 1 block(s) at slope 0-3.3: `minecraft:soul_soil`; 3 block(s) at slope 0-3: `minecraft:soul_soil`; 3 block(s) at slope 0-3: `minecraft:soul_soil`, `minecraft:basalt`. Wall palette: `minecraft:basalt`, `minecraft:soul_sand`.
- **Content:** The paired soul-material snippet contains eight formation entries and two crystal entries. One shared decorator snippet supplies surface details.
- **Entity spawners:** `nether/surface/soul-sand-valley`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome frozen/ice-spikes
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
