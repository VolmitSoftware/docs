---
title: "Biome Atlas — Calcite Peaks"
description: "Iris biome atlas entry for mountain/calcite-base in Overworld 4007 and Underworld 1010"
published: true
date: 2026-09-08T23:35:09.010Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`mountain/calcite-base` is a directly selected land biome in the current Overworld 4007 and Underworld 1010 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4007 | `tundra` (Tundra) | 1 | 1 | 1 | 6.12% |
| Underworld 1010 | `tundra` (Underworld Tundra) | 1 | 1 | 1 | 6.12% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `mountain` (143..220); combined authored contribution `143..220` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## 3D terrain

Overworld 4007 and Underworld 1010 share these `terrain3D` settings. Amplitude, feature scales, and crack dimensions use blocks.
The slope gate uses rise divided by horizontal distance. Strength reaches its configured value at the full slope.

| Biome | Treatment | Amplitude | Horizontal / vertical scale | Crack depth / width / scale | Slope start / full | Density noise / Crack noise |
|---|---|---:|---|---|---|---|
| `mountain/calcite-base` | Mountain | 52 | 256 / 36 | 11 / 2.25 / 416 | 0.18 / 0.5 | `IRIS_HALF` / `SIMPLEX` |

The table lists each profile’s density and crack noise. Active deformation starts above fluid level plus 8 blocks and fades across 24 blocks of base elevation.
Each pack retains its own materials, decoration, objects, and ores. Floating islands keep their separate shape settings.

## Overworld 4007 treatment

- **Minecraft identity:** derivative `minecraft:windswept_hills`; native-structure derivative `minecraft:windswept_hills`; no custom or scatter identities.
- **Surface:** 2 block(s) at slope 0-3.6: `minecraft:grass_block`; 2 block(s) at slope 3.6-13.6: `minecraft:calcite`. Wall palette: `minecraft:stone`.
- **Content:** No biome-local object, decorator, procedural, deposit, or effect rules.

## Underworld 1010 treatment

- **Minecraft identity:** derivative `minecraft:basalt_deltas`; native-structure derivative `minecraft:basalt_deltas`; custom identities `underworld_mountain_calcite_base_2bae18be`.
- **Surface:** 2 block(s) at slope 0-3.6: `minecraft:basalt`; 2 block(s) at slope 3.6-13.6: `minecraft:blackstone`. Wall palette: `minecraft:blackstone`.
- **Content:** 1 decorator rule(s) (1 shared snippet reference(s)).
- **Entity spawners:** `nether/surface/basalt-deltas`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome mountain/calcite-base
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
