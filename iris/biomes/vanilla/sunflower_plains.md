---
title: "Biome Atlas — Sunflower Plains"
description: "Iris biome atlas entry for vanilla/sunflower_plains in Overworld 4007 and Underworld 1010"
published: true
date: 2026-09-08T23:35:09.010Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`vanilla/sunflower_plains` is a directly selected land biome in the current Overworld 4007 and Underworld 1010 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4007 | `temperate` (Temperate) | 1 | 1 | 1 | 6.15% |
| Underworld 1010 | `temperate` (Underworld Temperate) | 1 | 1 | 1 | 6.15% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `mountain-large` (4..64); combined authored contribution `4..64` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## 3D terrain

Overworld 4007 and Underworld 1010 share these `terrain3D` settings. Amplitude, feature scales, and crack dimensions use blocks.
The slope gate uses rise divided by horizontal distance. Strength reaches its configured value at the full slope.

| Biome | Treatment | Amplitude | Horizontal / vertical scale | Crack depth / width / scale | Slope start / full | Density noise / Crack noise |
|---|---|---:|---|---|---|---|
| `vanilla/sunflower_plains` | Forest | 30 | 280 / 36 | None | 0.2 / 0.55 | `PERLIN` / None |

The table lists each profile’s density and crack noise. Active deformation starts above fluid level plus 8 blocks and fades across 24 blocks of base elevation.
Each pack retains its own materials, decoration, objects, and ores. Floating islands keep their separate shape settings.

## Overworld 4007 treatment

- **Minecraft identity:** derivative `minecraft:sunflower_plains`; native-structure derivative `minecraft:sunflower_plains`; custom identities `sunflower_plains`.
- **Surface:** 3-4 block(s) at slope <= 4: `minecraft:snow_block`, `minecraft:powder_snow`. Wall palette: `minecraft:stone`, `minecraft:andesite`, `minecraft:gravel`.
- **Content:** No biome-local object, decorator, procedural, deposit, or effect rules.

## Underworld 1010 treatment

- **Minecraft identity:** derivative `minecraft:nether_wastes`; native-structure derivative `minecraft:nether_wastes`; custom identities `underworld_vanilla_sunflower_plains_f6e27994`.
- **Surface:** 3-4 block(s) at slope <= 4: `minecraft:netherrack`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`, `minecraft:gravel`.
- **Content:** 1 decorator rule(s) (1 shared snippet reference(s)).
- **Entity spawners:** `nether/surface/nether-wastes`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome vanilla/sunflower_plains
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
