---
title: "Biome Atlas — Ice Spikes"
description: "Iris biome atlas entry for frozen/ice-spikes in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`frozen/ice-spikes` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `frozen` (Frozen) | 1 | 1 | 1 | 5.69% |
| Underworld 1005 | `frozen` (Underworld Frozen) | 1 | 1 | 1 | 5.69% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `mountain` (15..43), `highplains` (40..50); combined authored contribution `55..93` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:snowy_plains`; native-structure derivative `minecraft:snowy_plains`; custom identities `winter_mountain_forest1`, `winter_mountain_forest2`, `winter_mountain_forest3`.
- **Surface:** 1 block(s) at slope 0-3.3: `minecraft:snow_block`; 3 block(s) at slope 0-3: `minecraft:dirt`; 3 block(s) at slope 0-3: `minecraft:dirt`, `minecraft:stone`. Wall palette: `minecraft:stone`, `minecraft:andesite`, `minecraft:gravel`.
- **Content:** No biome-local object, decorator, procedural, deposit, or effect rules.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:soul_sand_valley`; native-structure derivative `minecraft:soul_sand_valley`; custom identities `underworld_frozen_ice_spikes_bb184866`.
- **Surface:** 1 block(s) at slope 0-3.3: `minecraft:soul_soil`; 3 block(s) at slope 0-3: `minecraft:soul_soil`; 3 block(s) at slope 0-3: `minecraft:soul_soil`, `minecraft:basalt`. Wall palette: `minecraft:basalt`, `minecraft:soul_sand`.
- **Content:** 1 decorator rule(s) (1 shared snippet reference(s)).
- **Entity spawners:** `nether/surface/soul-sand-valley`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome frozen/ice-spikes
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
