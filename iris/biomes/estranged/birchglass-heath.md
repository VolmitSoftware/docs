---
title: "Biome Atlas — Birchglass Heath"
description: "Iris biome atlas entry for estranged/birchglass-heath in Overworld 4007 and Underworld 1010"
published: true
date: 2026-09-08T23:35:09.010Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`estranged/birchglass-heath` is a directly selected land biome in the current Overworld 4007 and Underworld 1010 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4007 | `estranged` (Estranged) | 1 | 3 | 0.3333 | 7.04% |
| Underworld 1010 | `estranged` (Underworld Estranged) | 1 | 3 | 0.3333 | 7.04% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `smooth-dunes` (4..10), `rare-hills` (0..30); combined authored contribution `4..40` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## 3D terrain

Overworld 4007 and Underworld 1010 share these `terrain3D` settings. Amplitude, feature scales, and crack dimensions use blocks.
The slope gate uses rise divided by horizontal distance. Strength reaches its configured value at the full slope.

| Biome | Treatment | Amplitude | Horizontal / vertical scale | Crack depth / width / scale | Slope start / full | Density noise / Crack noise |
|---|---|---:|---|---|---|---|
| `estranged/birchglass-heath` | Hills | 22 | 256 / 30 | None | 0.18 / 0.5 | `IRIS_HALF` / None |

The table lists each profile’s density and crack noise. Active deformation starts above fluid level plus 8 blocks and fades across 24 blocks of base elevation.
Each pack retains its own materials, decoration, objects, and ores. Floating islands keep their separate shape settings.

## Overworld 4007 treatment

- **Minecraft identity:** derivative `minecraft:birch_forest`; native-structure derivative `minecraft:birch_forest`; custom identities `estranged_birchglass`.
- **Surface:** 1 block(s): `minecraft:grass_block`; 2 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:dirt`, `minecraft:stone`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 4 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:short_grass`, `minecraft:oxeye_daisy`, `minecraft:lily_of_the_valley`, `minecraft:white_tulip`. Procedural content: 2 trees (birchglass, birchglass-wide).

## Underworld 1010 treatment

- **Minecraft identity:** derivative `minecraft:warped_forest`; native-structure derivative `minecraft:warped_forest`; custom identities `underworld_estranged_birchglass_heath_90308537`.
- **Surface:** 1 block(s): `minecraft:warped_nylium`; 2 block(s): `minecraft:netherrack`; 1-3 block(s): `minecraft:netherrack`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`.
- **Content:** 5 decorator rule(s) (3 shared snippet reference(s)) using `minecraft:nether_sprouts`. Procedural content: 2 trees (birchglass, birchglass-wide).
- **Entity spawners:** `nether/surface/warped-forest`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome estranged/birchglass-heath
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
