---
title: "Biome Atlas — Magnetics Frozen"
description: "Iris biome atlas entry for magnetics/frozen in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`magnetics/frozen` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `magnetics` (The Magnetics) | 1 | 1 | 1 | 16.67% |
| Underworld 1005 | `magnetics` (Underworld The Magnetics) | 1 | 1 | 1 | 16.67% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `magnetics/frozen` (8..36); combined authored contribution `8..36` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:frozen_peaks`; native-structure derivative `minecraft:frozen_peaks`; no custom or scatter identities.
- **Surface:** 1 block(s): `minecraft:snow_block`, `minecraft:powder_snow`; 1-3 block(s): `minecraft:packed_ice`, `minecraft:snow_block`; 3-6 block(s): `minecraft:blue_ice`, `minecraft:ice`, `minecraft:packed_ice`; 6-18 block(s): `minecraft:diorite`, `minecraft:stone`, `minecraft:andesite`, `minecraft:blue_ice`. Wall palette: `minecraft:packed_ice`, `minecraft:blue_ice`, `minecraft:ice`, `minecraft:diorite`.
- **Content:** 2 object placement rule(s) drawing from 18 object key(s), including `trees/sproak/generic1`, `trees/sproak/generic2`, `trees/sproak/generic3`, `trees/sproak/generic4`, `trees/sproak/generic5`, `trees/sproak/generic6`, `trees/sproak/generic7`, and 11 more. 1 decorator rule(s) using `minecraft:snow`, `minecraft:air`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:basalt_deltas`; native-structure derivative `minecraft:basalt_deltas`; custom identities `underworld_magnetics_frozen_f3cc3252`.
- **Surface:** 1 block(s): `minecraft:blackstone`; 1-3 block(s): `minecraft:blackstone`; 3-6 block(s): `minecraft:blackstone`; 6-18 block(s): `minecraft:quartz_block`, `minecraft:blackstone`, `minecraft:basalt`. Wall palette: `minecraft:blackstone`, `minecraft:quartz_block`.
- **Content:** 2 object placement rule(s) drawing from 18 object key(s), including `underworld/basalt/trees/sproak/generic1`, `underworld/basalt/trees/sproak/generic2`, `underworld/basalt/trees/sproak/generic3`, `underworld/basalt/trees/sproak/generic4`, `underworld/basalt/trees/sproak/generic5`, `underworld/basalt/trees/sproak/generic6`, `underworld/basalt/trees/sproak/generic7`, and 11 more. 2 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:blackstone`, `minecraft:air`.
- **Entity spawners:** `nether/surface/basalt-deltas`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

- **Overworld 4002: [`frozen/vander`](/iris/biomes/frozen/vander):** rarity `1`, altitude `150..185` blocks above the surface, top mode `NOISE`, maximum thickness `76`, carving biome `carving/ice-child`; decorators inherit and objects inherit.
- **Overworld 4002: [`frozen/vander`](/iris/biomes/frozen/vander):** rarity `1`, altitude `110..145` blocks above the surface, top mode `NOISE`, maximum thickness `72`, carving biome `carving/glacial-child`; decorators inherit and objects inherit.
- **Overworld 4002: [`frozen/vander`](/iris/biomes/frozen/vander):** rarity `1`, altitude `220..270` blocks above the surface, top mode `NOISE`, maximum thickness `80`, carving biome `carving/frost-shards-child`; decorators inherit and objects inherit.
- **Underworld 1005: [`frozen/vander`](/iris/biomes/frozen/vander):** rarity `1`, altitude `150..185` blocks above the surface, top mode `NOISE`, maximum thickness `76`, carving biome `carving/ice-child`; decorators inherit and objects inherit.
- **Underworld 1005: [`frozen/vander`](/iris/biomes/frozen/vander):** rarity `1`, altitude `110..145` blocks above the surface, top mode `NOISE`, maximum thickness `72`, carving biome `carving/glacial-child`; decorators inherit and objects inherit.
- **Underworld 1005: [`frozen/vander`](/iris/biomes/frozen/vander):** rarity `1`, altitude `220..270` blocks above the surface, top mode `NOISE`, maximum thickness `80`, carving biome `carving/frost-shards-child`; decorators inherit and objects inherit.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome magnetics/frozen
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
