---
title: "Biome Atlas — Frozen Vander"
description: "Iris biome atlas entry for frozen/vander in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`frozen/vander` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `frozen` (Frozen) | 1 | 4 | 0.25 | 1.42% |
| Underworld 1005 | `frozen` (Underworld Frozen) | 1 | 4 | 0.25 | 1.42% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `mountain` (15..34); combined authored contribution `15..34` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:frozen_peaks`; native-structure derivative `minecraft:frozen_peaks`; custom identities `frozen_vander`; underground scatter `minecraft:snowy_taiga`, `minecraft:old_growth_pine_taiga`, `minecraft:windswept_hills`, `minecraft:ice_spikes`.
- **Surface:** 1-3 block(s): `minecraft:snow_block`; 2-4 block(s): `minecraft:ice`; 2-4 block(s): `minecraft:dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 3 object placement rule(s) drawing from 29 object key(s), including `trees/mushroom/ice1`, `trees/mushroom/ice2`, `trees/mushroom/ice3`, `trees/mushroom/ice4`, `trees/mushroom/ice5`, `trees/mushroom/ice6`, `trees/mushroom/ice7`, and 22 more. 1 decorator rule(s) using `minecraft:snow`, `minecraft:air`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:soul_sand_valley`; native-structure derivative `minecraft:soul_sand_valley`; custom identities `underworld_frozen_vander_65e30be1`.
- **Surface:** 1-3 block(s): `minecraft:soul_soil`; 2-4 block(s): `minecraft:soul_soil`; 2-4 block(s): `minecraft:soul_soil`; 6-18 block(s): `minecraft:basalt`. Wall palette: `minecraft:basalt`.
- **Content:** 3 object placement rule(s) drawing from 29 object key(s), including `underworld/soul/trees/mushroom/ice1`, `underworld/soul/trees/mushroom/ice2`, `underworld/soul/trees/mushroom/ice3`, `underworld/soul/trees/mushroom/ice4`, `underworld/soul/trees/mushroom/ice5`, `underworld/soul/trees/mushroom/ice6`, `underworld/soul/trees/mushroom/ice7`, and 22 more. 2 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:soul_soil`, `minecraft:air`.
- **Entity spawners:** `nether/surface/soul-sand-valley`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome frozen/vander
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
