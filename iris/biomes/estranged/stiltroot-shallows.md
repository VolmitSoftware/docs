---
title: "Biome Atlas — Stiltroot Shallows"
description: "Iris biome atlas entry for estranged/stiltroot-shallows in Overworld 4007 and Underworld 1010"
published: true
date: 2026-09-08T23:35:09.010Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`estranged/stiltroot-shallows` is a directly selected land biome in the current Overworld 4007 and Underworld 1010 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4007 | `estranged` (Estranged) | 1 | 5 | 0.2 | 4.23% |
| Underworld 1010 | `estranged` (Underworld Estranged) | 1 | 5 | 0.2 | 4.23% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `plain` (2..5); combined authored contribution `2..5` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## 3D terrain

Overworld 4007 and Underworld 1010 share these `terrain3D` settings. Amplitude, feature scales, and crack dimensions use blocks.
The slope gate uses rise divided by horizontal distance. Strength reaches its configured value at the full slope.

| Biome | Treatment | Amplitude | Horizontal / vertical scale | Crack depth / width / scale | Slope start / full | Density noise / Crack noise |
|---|---|---:|---|---|---|---|
| `estranged/stiltroot-shallows` | Protected | 0 | None | None | None | None / None |

The table lists each profile’s density and crack noise. Active deformation starts above fluid level plus 8 blocks and fades across 24 blocks of base elevation.
Each pack retains its own materials, decoration, objects, and ores. Floating islands keep their separate shape settings.

- `estranged/stiltroot-shallows`: Shallow water and rooted banks retain their current terrain.

## Overworld 4007 treatment

- **Minecraft identity:** derivative `minecraft:mangrove_swamp`; native-structure derivative `minecraft:mangrove_swamp`; custom identities `estranged_stiltroot`.
- **Surface:** 1 block(s): `minecraft:grass_block`, `minecraft:mud`, `minecraft:dirt`; 2-3 block(s): `minecraft:mud`, `minecraft:dirt`. Wall palette: `minecraft:stone`, `minecraft:mossy_cobblestone`.
- **Content:** 4 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:short_grass`, `minecraft:fern`, `minecraft:brown_mushroom`. Procedural content: 1 trees (stiltroot).

## Underworld 1010 treatment

- **Minecraft identity:** derivative `minecraft:warped_forest`; native-structure derivative `minecraft:warped_forest`; custom identities `underworld_estranged_stiltroot_shallows_8e684f5a`.
- **Surface:** 1 block(s): `minecraft:warped_nylium`, `minecraft:netherrack`; 2-3 block(s): `minecraft:netherrack`. Wall palette: `minecraft:netherrack`, `minecraft:blackstone`.
- **Content:** 5 decorator rule(s) (3 shared snippet reference(s)) using `minecraft:nether_sprouts`, `minecraft:warped_fungus`. Procedural content: 1 trees (stiltroot).
- **Entity spawners:** `nether/surface/warped-forest`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome estranged/stiltroot-shallows
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
