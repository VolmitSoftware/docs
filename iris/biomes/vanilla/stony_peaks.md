---
title: "Biome Atlas — Stony Peaks"
description: "Iris biome atlas entry for vanilla/stony_peaks in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`vanilla/stony_peaks` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `temperate` (Temperate) | 1 | 12 | 0.0833 | 0.51% |
| Underworld 1005 | `temperate` (Underworld Temperate) | 1 | 12 | 0.0833 | 0.51% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `spikes` (23..200); combined authored contribution `23..200` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:stony_peaks`; native-structure derivative `minecraft:stony_peaks`; custom identities `stony_peaks`.
- **Surface:** 1 block(s) at slope 0-2.6: `minecraft:blue_ice`, `minecraft:packed_ice`. Wall palette: `minecraft:blue_ice`, `minecraft:packed_ice`.
- **Content:** No biome-local object, decorator, procedural, deposit, or effect rules.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:nether_wastes`; native-structure derivative `minecraft:nether_wastes`; custom identities `underworld_vanilla_stony_peaks_fcd80798`.
- **Surface:** 1 block(s) at slope 0-2.6: `minecraft:netherrack`. Wall palette: `minecraft:netherrack`.
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
/iris find biome vanilla/stony_peaks
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
