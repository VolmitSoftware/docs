---
title: "Biome Atlas — Frosted Peaks"
description: "Iris biome atlas entry for tundra/frosted-peaks in Overworld 4007 and Underworld 1010"
published: true
date: 2026-09-08T16:43:54.130Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`tundra/frosted-peaks` is a directly selected land biome in the current Overworld 4007 and Underworld 1010 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4007 | `tundra` (Tundra) | 1 | 5 | 0.2 | 1.22% |
| Underworld 1010 | `tundra` (Underworld Tundra) | 1 | 5 | 0.2 | 1.22% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `mountain` (90..180); combined authored contribution `90..180` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## 3D terrain

Overworld 4007 and Underworld 1010 share these `terrain3D` settings. Amplitude, feature scales, and crack dimensions use blocks.
The slope gate uses rise divided by horizontal distance. Strength reaches its configured value at the full slope.

| Biome | Treatment | Amplitude | Horizontal / vertical scale | Crack depth / width / scale | Slope start / full |
|---|---|---:|---|---|---|
| `tundra/frosted-peaks` | Glacial | 48 | 152 / 28 | 24 / 3 / 240 | 0.18 / 0.5 |
| `tundra/frosted-peaks-extended` | Glacial | 48 | 152 / 28 | 24 / 3 / 240 | 0.18 / 0.5 |

Active profiles use Simplex density and crack noise. Deformation starts above fluid level plus 8 blocks and fades across 24 blocks of base elevation.
Each pack retains its own materials, decoration, objects, and ores. Floating islands keep their separate shape settings.

## Overworld 4007 treatment

- **Minecraft identity:** derivative `minecraft:old_growth_spruce_taiga`; native-structure derivative `minecraft:old_growth_spruce_taiga`; custom identities `frosted-peaks`.
- **Surface:** 1 block(s) at slope 0.1-1.65: `minecraft:snow_block`; 2-4 block(s) at slope 3.95-6: `minecraft:diorite`, `minecraft:stone`; 2-4 block(s) at slope >= 2.5: `minecraft:smooth_basalt`, `minecraft:stone`, `minecraft:gray_concrete_powder`, `minecraft:gravel`; 2-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`, `minecraft:gravel`, `minecraft:basalt`.
- **Content:** 4 decorator rule(s) using `minecraft:tall_grass`, `minecraft:short_grass`, `minecraft:fern`.

## Underworld 1010 treatment

- **Minecraft identity:** derivative `minecraft:soul_sand_valley`; native-structure derivative `minecraft:soul_sand_valley`; custom identities `underworld_tundra_frosted_peaks_9714b1d0`.
- **Surface:** 1 block(s) at slope 0.1-1.65: `minecraft:soul_soil`; 2-4 block(s) at slope 3.95-6: `minecraft:quartz_block`, `minecraft:basalt`; 2-4 block(s) at slope >= 2.5: `minecraft:smooth_basalt`, `minecraft:basalt`, `minecraft:polished_blackstone`, `minecraft:soul_sand`; 2-18 block(s): `minecraft:basalt`. Wall palette: `minecraft:basalt`, `minecraft:soul_sand`.
- **Content:** 5 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:nether_sprouts`, `minecraft:soul_fire`.
- **Entity spawners:** `nether/surface/soul-sand-valley`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

### Frosted Peaks (`tundra/frosted-peaks-extended`)

This child-only biome is selected from `tundra/frosted-peaks`, not from a region list. Its rarity is `5`.
In that immediate child choice it contributes `1` of `2` slots (50.00%); later child hops are resolved separately.

**Shared terrain:** `mountain` (170..220); combined authored contribution `170..220` blocks relative to fluid height.

- **Overworld 4007:** `minecraft:old_growth_spruce_taiga` identity; surface 1 block(s) at slope 0.1-1.65: `minecraft:snow_block`; 2-4 block(s) at slope 3.95-6: `minecraft:diorite`, `minecraft:stone`; 2-4 block(s) at slope >= 2.5: `minecraft:smooth_basalt`, `minecraft:stone`, `minecraft:gray_concrete_powder`, `minecraft:gravel`; 2-18 block(s): `minecraft:stone`, `minecraft:andesite`; 4 decorator rule(s) using `minecraft:tall_grass`, `minecraft:short_grass`, `minecraft:fern`.
- **Underworld 1010:** `minecraft:soul_sand_valley` identity; surface 1 block(s) at slope 0.1-1.65: `minecraft:soul_soil`; 2-4 block(s) at slope 3.95-6: `minecraft:quartz_block`, `minecraft:basalt`; 2-4 block(s) at slope >= 2.5: `minecraft:smooth_basalt`, `minecraft:basalt`, `minecraft:polished_blackstone`, `minecraft:soul_sand`; 2-18 block(s): `minecraft:basalt`; 5 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:nether_sprouts`, `minecraft:soul_fire`.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome tundra/frosted-peaks
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
