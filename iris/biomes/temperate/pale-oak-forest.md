---
title: "Biome Atlas — Pale Oak Forest"
description: "Iris biome atlas entry for temperate/pale-oak-forest in Overworld 4007 and Underworld 1010"
published: true
date: 2026-09-08T16:43:54.130Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`temperate/pale-oak-forest` is a directly selected land biome in the current Overworld 4007 and Underworld 1010 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4007 | `temperate` (Temperate) | 1 | 6 | 0.1667 | 1.02% |
| Underworld 1010 | `temperate` (Underworld Temperate) | 1 | 6 | 0.1667 | 1.02% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `smooth-dunes` (5..14), `rare-hills` (0..36); combined authored contribution `5..50` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## 3D terrain

Overworld 4007 and Underworld 1010 share these `terrain3D` settings. Amplitude, feature scales, and crack dimensions use blocks.
The slope gate uses rise divided by horizontal distance. Strength reaches its configured value at the full slope.

| Biome | Treatment | Amplitude | Horizontal / vertical scale | Crack depth / width / scale | Slope start / full |
|---|---|---:|---|---|---|
| `temperate/pale-oak-forest` | Hills | 22 | 144 / 24 | 6 / 2.5 / 240 | 0.18 / 0.5 |

Active profiles use Simplex density and crack noise. Deformation starts above fluid level plus 8 blocks and fades across 24 blocks of base elevation.
Each pack retains its own materials, decoration, objects, and ores. Floating islands keep their separate shape settings.

## Overworld 4007 treatment

- **Minecraft identity:** derivative `minecraft:forest`; native-structure derivative `minecraft:pale_garden`; custom identities `temperate_pale_oak_forest`.
- **Surface:** 1 block(s): `minecraft:grass_block`, `minecraft:pale_moss_block`, `minecraft:coarse_dirt`; 2-3 block(s): `minecraft:dirt`, `minecraft:rooted_dirt`; 2-5 block(s): `minecraft:stone`, `minecraft:calcite`. Wall palette: `minecraft:stone`, `minecraft:andesite`, `minecraft:calcite`.
- **Content:** 1 object placement rule(s) drawing from 9 object key(s), including `vanilla/trees/pale_oak`, `vanilla/trees/pale_oak_2`, `vanilla/trees/pale_oak_3`, `vanilla/trees/pale_oak_bonemeal`, `vanilla/trees/pale_oak_bonemeal_2`, `vanilla/trees/pale_oak_bonemeal_3`, `vanilla/trees/pale_oak_creaking`, and 2 more. 2 decorator rule(s) using `minecraft:pale_moss_carpet`, `minecraft:short_grass`, `minecraft:air`, `minecraft:closed_eyeblossom`, `minecraft:open_eyeblossom`.

## Underworld 1010 treatment

- **Minecraft identity:** derivative `minecraft:nether_wastes`; native-structure derivative `minecraft:nether_wastes`; custom identities `underworld_temperate_pale_oak_forest_b7eb343c`.
- **Surface:** 1 block(s): `minecraft:netherrack`, `minecraft:nether_wart_block`; 2-3 block(s): `minecraft:netherrack`; 2-5 block(s): `minecraft:netherrack`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`.
- **Content:** 1 object placement rule(s) drawing from 9 object key(s), including `underworld/wastes/vanilla/trees/pale_oak`, `underworld/wastes/vanilla/trees/pale_oak_2`, `underworld/wastes/vanilla/trees/pale_oak_3`, `underworld/wastes/vanilla/trees/pale_oak_bonemeal`, `underworld/wastes/vanilla/trees/pale_oak_bonemeal_2`, `underworld/wastes/vanilla/trees/pale_oak_bonemeal_3`, `underworld/wastes/vanilla/trees/pale_oak_creaking`, and 2 more. 3 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:fire`, `minecraft:air`, `minecraft:nether_sprouts`.
- **Entity spawners:** `nether/surface/nether-wastes`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome temperate/pale-oak-forest
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
