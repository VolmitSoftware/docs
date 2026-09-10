---
title: "Biome Atlas — Windswept Gravelly Hills"
description: "Iris biome atlas entry for vanilla/windswept_gravelly_hills in Overworld 4007 and Underworld 1010"
published: true
date: 2026-09-08T23:35:09.010Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`vanilla/windswept_gravelly_hills` is a directly selected land biome in the current Overworld 4007 and Underworld 1010 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4007 | `temperate` (Temperate) | 1 | 1 | 1 | 6.15% |
| Underworld 1010 | `temperate` (Underworld Temperate) | 1 | 1 | 1 | 6.15% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `plain-cliffs` (4..30), `mountain` (93..145); combined authored contribution `97..175` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## 3D terrain

Overworld 4007 and Underworld 1010 share these `terrain3D` settings. Amplitude, feature scales, and crack dimensions use blocks.
The slope gate uses rise divided by horizontal distance. Strength reaches its configured value at the full slope.

| Biome | Treatment | Amplitude | Horizontal / vertical scale | Crack depth / width / scale | Slope start / full | Density noise / Crack noise |
|---|---|---:|---|---|---|---|
| `vanilla/windswept_gravelly_hills` | Cliff | 56 | 224 / 30 | 14 / 2.25 / 336 | 0.12 / 0.4 | `IRIS_HALF` / `SIMPLEX` |

The table lists each profile’s density and crack noise. Active deformation starts above fluid level plus 8 blocks and fades across 24 blocks of base elevation.
Each pack retains its own materials, decoration, objects, and ores. Floating islands keep their separate shape settings.

## Overworld 4007 treatment

- **Minecraft identity:** derivative `minecraft:windswept_gravelly_hills`; native-structure derivative `minecraft:windswept_gravelly_hills`; custom identities `windswept_gravelly_hills`.
- **Surface:** 1 block(s) at slope 0-2.6: `minecraft:grass_block`; 2-4 block(s) at slope >= 3.95: `minecraft:gravel`; 2-3 block(s): `minecraft:stone`, `minecraft:andesite`, `minecraft:gravel`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 3 decorator rule(s) using `minecraft:dandelion`, `minecraft:poppy`, `minecraft:blue_orchid`, `minecraft:allium`, `minecraft:azure_bluet`, `minecraft:red_tulip`, `minecraft:orange_tulip`, `minecraft:white_tulip`, `minecraft:pink_tulip`, and 5 more.

## Underworld 1010 treatment

- **Minecraft identity:** derivative `minecraft:basalt_deltas`; native-structure derivative `minecraft:basalt_deltas`; custom identities `underworld_vanilla_windswept_gravelly_hills_544268e5`.
- **Surface:** 1 block(s) at slope 0-2.6: `minecraft:basalt`; 2-4 block(s) at slope >= 3.95: `minecraft:gravel`; 2-3 block(s): `minecraft:blackstone`, `minecraft:basalt`, `minecraft:gravel`; 6-18 block(s): `minecraft:blackstone`, `minecraft:basalt`. Wall palette: `minecraft:blackstone`, `minecraft:basalt`.
- **Content:** 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:crimson_fungus`, `minecraft:nether_sprouts`, `minecraft:fire`.
- **Entity spawners:** `nether/surface/basalt-deltas`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

### Mountain Middle

Both packs use `mountain/cute_cliffs+`; the `+` is part of the child key.

This child-only biome is selected from `vanilla/windswept_gravelly_hills`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `1` of `2` slots (50.00%); later child hops are resolved separately.
Each pack’s Mountain Middle biome intentionally lists its own key as its child. Its explicit self entry and implicit current-biome option both resolve to the same biome through Iris's bounded four-hop child recursion; this preserves reachability without adding region-list weight.

**Shared terrain:** `mountain` (106..185); combined authored contribution `106..185` blocks relative to fluid height.

- **Overworld 4007:** `minecraft:old_growth_spruce_taiga` identity; surface 1 block(s) at slope 0-2.6: `minecraft:grass_block`; 2-4 block(s) at slope >= 3.95: `minecraft:gravel`, `minecraft:cyan_terracotta`; 2-4 block(s) at slope >= 3.95: `minecraft:stone`, `minecraft:cobblestone`; 1 block(s) at slope 0-4: `minecraft:grass_block`; 3 block(s) at slope 0-3: `minecraft:dirt`; 3 decorator rule(s) using `minecraft:dandelion`, `minecraft:poppy`, `minecraft:blue_orchid`, `minecraft:allium`, `minecraft:azure_bluet`, `minecraft:red_tulip`, `minecraft:orange_tulip`, `minecraft:white_tulip`, `minecraft:pink_tulip`, and 5 more.
- **Underworld 1010:** `minecraft:basalt_deltas` identity; surface 1 block(s) at slope 0-2.6: `minecraft:basalt`; 2-4 block(s) at slope >= 3.95: `minecraft:gravel`, `minecraft:warped_nylium`; 2-4 block(s) at slope >= 3.95: `minecraft:blackstone`; 1 block(s) at slope 0-4: `minecraft:basalt`; 3 block(s) at slope 0-3: `minecraft:blackstone`; 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:crimson_fungus`, `minecraft:nether_sprouts`, `minecraft:fire`.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome vanilla/windswept_gravelly_hills
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
