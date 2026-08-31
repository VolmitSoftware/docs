---
title: "Biome Atlas — Glacial"
description: "Iris biome atlas entry for frozen/mountains/extreem-ice-spikes in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`frozen/mountains/extreem-ice-spikes` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `frozen` (Frozen) | 1 | 12 | 0.0833 | 0.47% |
| Underworld 1005 | `frozen` (Underworld Frozen) | 1 | 12 | 0.0833 | 0.47% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `spikes` (23..225); combined authored contribution `23..225` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:frozen_peaks`; native-structure derivative `minecraft:frozen_peaks`; no custom or scatter identities.
- **Surface:** 1 block(s) at slope 0-2.6: `minecraft:blue_ice`, `minecraft:packed_ice`. Wall palette: `minecraft:blue_ice`, `minecraft:packed_ice`.
- **Content:** No biome-local object, decorator, procedural, deposit, or effect rules.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:basalt_deltas`; native-structure derivative `minecraft:basalt_deltas`; custom identities `underworld_frozen_mountains_extreem_ice_spikes_9d844e62`.
- **Surface:** 1 block(s) at slope 0-2.6: `minecraft:blackstone`. Wall palette: `minecraft:blackstone`.
- **Content:** 1 decorator rule(s) (1 shared snippet reference(s)).
- **Entity spawners:** `nether/surface/basalt-deltas`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome frozen/mountains/extreem-ice-spikes
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
