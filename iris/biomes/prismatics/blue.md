---
title: "Biome Atlas — Prismatics Blue"
description: "Iris biome atlas entry for prismatics/blue in Overworld 4007 and Underworld 1010"
published: true
date: 2026-09-08T23:35:09.010Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`prismatics/blue` is a directly selected land biome in the current Overworld 4007 and Underworld 1010 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4007 | `prismatics` (Prismatics) | 1 | 1 | 1 | 6.25% |
| Underworld 1010 | `prismatics` (Underworld Prismatics) | 1 | 1 | 1 | 6.25% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `plain` (24..52), `highplains` (52..72); combined authored contribution `76..124` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## 3D terrain

Overworld 4007 and Underworld 1010 share these `terrain3D` settings. Amplitude, feature scales, and crack dimensions use blocks.
The slope gate uses rise divided by horizontal distance. Strength reaches its configured value at the full slope.

| Biome | Treatment | Amplitude | Horizontal / vertical scale | Crack depth / width / scale | Slope start / full | Density noise / Crack noise |
|---|---|---:|---|---|---|---|
| `prismatics/blue` | Prismatic | 36 | 256 / 24 | 8 / 2 / 392 | 0.14 / 0.42 | `HEXAGON` / `SIMPLEX` |

The table lists each profile’s density and crack noise. Active deformation starts above fluid level plus 8 blocks and fades across 24 blocks of base elevation.
Each pack retains its own materials, decoration, objects, and ores. Floating islands keep their separate shape settings.

## Overworld 4007 treatment

- **Minecraft identity:** derivative `minecraft:plains`; native-structure derivative `minecraft:plains`; no custom or scatter identities.
- **Surface:** 2-3 block(s): `minecraft:blue_concrete_powder`; 4-8 block(s): `minecraft:blue_concrete`. Wall palette: `minecraft:blue_concrete`.
- **Content:** 5 object placement rule(s) drawing from 34 object key(s), including `clutter/concretelith1`, `clutter/concretelith2`, `clutter/concretelith3`, `clutter/concretelith4`, `clutter/concretelith5`, `clutter/concretelith6`, `clutter/concretelith7`, and 27 more.

## Underworld 1010 treatment

- **Minecraft identity:** derivative `minecraft:basalt_deltas`; native-structure derivative `minecraft:basalt_deltas`; custom identities `underworld_prismatics_blue_30d00b90`.
- **Surface:** 2-3 block(s): `minecraft:warped_wart_block`; 4-8 block(s): `minecraft:warped_wart_block`. Wall palette: `minecraft:warped_wart_block`.
- **Content:** 5 object placement rule(s) drawing from 34 object key(s), including `underworld/basalt/clutter/concretelith1`, `underworld/basalt/clutter/concretelith2`, `underworld/basalt/clutter/concretelith3`, `underworld/basalt/clutter/concretelith4`, `underworld/basalt/clutter/concretelith5`, `underworld/basalt/clutter/concretelith6`, `underworld/basalt/clutter/concretelith7`, and 27 more. 1 decorator rule(s) (1 shared snippet reference(s)).
- **Entity spawners:** `nether/surface/basalt-deltas`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome prismatics/blue
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
