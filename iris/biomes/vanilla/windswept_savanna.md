---
title: "Biome Atlas — Windswept Savanna"
description: "Iris biome atlas entry for vanilla/windswept_savanna in Overworld 4007 and Underworld 1010"
published: true
date: 2026-09-08T23:35:09.010Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`vanilla/windswept_savanna` is a directly selected land biome in the current Overworld 4007 and Underworld 1010 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4007 | `hot` (Hot) | 1 | 1 | 1 | 5.83% |
| Underworld 1010 | `hot` (Underworld Hot) | 1 | 1 | 1 | 5.83% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `plain` (4..7); combined authored contribution `4..7` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## 3D terrain

Overworld 4007 and Underworld 1010 share these `terrain3D` settings. Amplitude, feature scales, and crack dimensions use blocks.
The slope gate uses rise divided by horizontal distance. Strength reaches its configured value at the full slope.

| Biome | Treatment | Amplitude | Horizontal / vertical scale | Crack depth / width / scale | Slope start / full | Density noise / Crack noise |
|---|---|---:|---|---|---|---|
| `vanilla/windswept_savanna` | Lowland | 10 | 192 / 24 | None | 0.18 / 0.48 | `PERLIN` / None |

The table lists each profile’s density and crack noise. Active deformation starts above fluid level plus 8 blocks and fades across 24 blocks of base elevation.
Each pack retains its own materials, decoration, objects, and ores. Floating islands keep their separate shape settings.

## Overworld 4007 treatment

- **Minecraft identity:** derivative `minecraft:windswept_savanna`; native-structure derivative `minecraft:windswept_savanna`; custom identities `windswept_savanna`.
- **Surface:** 1 block(s): `minecraft:grass_block`; 1 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 1 object placement rule(s) drawing from 7 object key(s), including `trees/acacia/denmyre1`, `trees/acacia/denmyre2`, `trees/acacia/denmyre3`, `trees/acacia/denmyre4`, `trees/acacia/denmyre5`, `trees/acacia/denmyre6`, `trees/acacia/denmyre7`. 7 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:dead_bush`, `minecraft:brown_mushroom`, `minecraft:cactus`, `minecraft:cactus_flower`, `minecraft:short_grass`, `minecraft:stone_button`, `minecraft:tall_grass`.

## Underworld 1010 treatment

- **Minecraft identity:** derivative `minecraft:basalt_deltas`; native-structure derivative `minecraft:basalt_deltas`; custom identities `underworld_vanilla_windswept_savanna_d7a5c2fe`.
- **Surface:** 1 block(s): `minecraft:basalt`; 1 block(s): `minecraft:blackstone`; 1-3 block(s): `minecraft:blackstone`; 6-18 block(s): `minecraft:blackstone`, `minecraft:basalt`. Wall palette: `minecraft:blackstone`, `minecraft:basalt`.
- **Content:** 1 object placement rule(s) drawing from 7 object key(s), including `underworld/basalt/trees/acacia/denmyre1`, `underworld/basalt/trees/acacia/denmyre2`, `underworld/basalt/trees/acacia/denmyre3`, `underworld/basalt/trees/acacia/denmyre4`, `underworld/basalt/trees/acacia/denmyre5`, `underworld/basalt/trees/acacia/denmyre6`, `underworld/basalt/trees/acacia/denmyre7`. 8 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:crimson_fungus`, `minecraft:basalt`, `minecraft:fire`, `minecraft:polished_blackstone_button`.
- **Entity spawners:** `nether/surface/basalt-deltas`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome vanilla/windswept_savanna
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
