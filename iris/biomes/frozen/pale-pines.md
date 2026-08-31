---
title: "Biome Atlas — Pale Pines"
description: "Iris biome atlas entry for frozen/pale-pines in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`frozen/pale-pines` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `frozen` (Frozen) | 1 | 6 | 0.1667 | 0.95% |
| Underworld 1005 | `frozen` (Underworld Frozen) | 1 | 6 | 0.1667 | 0.95% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `mountain` (10..26); combined authored contribution `10..26` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:snowy_taiga`; native-structure derivative `minecraft:snowy_taiga`; custom identities `frozen_pale_pines`.
- **Surface:** 0-1 block(s): `minecraft:snow_block`; 1 block(s): `minecraft:pale_moss_block`, `minecraft:grass_block`; 3-6 block(s): `minecraft:dirt`, `minecraft:calcite`, `minecraft:packed_ice`; 6-18 block(s): `minecraft:stone`, `minecraft:calcite`. Wall palette: `minecraft:stone`, `minecraft:calcite`, `minecraft:packed_ice`.
- **Content:** 1 object placement rule(s) drawing from 10 object key(s), including `trees/spruce/levergreen1`, `trees/spruce/mevergreen1`, `trees/spruce/mevergreen2`, `trees/spruce/mevergreen3`, `trees/spruce/vgeneric1`, `trees/spruce/vgeneric2`, `trees/spruce/vgeneric3`, and 3 more. 2 decorator rule(s) using `minecraft:snow`, `minecraft:air`, `minecraft:pale_moss_carpet`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:soul_sand_valley`; native-structure derivative `minecraft:soul_sand_valley`; custom identities `underworld_frozen_pale_pines_3ea25f8c`.
- **Surface:** 0-1 block(s): `minecraft:soul_soil`; 1 block(s): `minecraft:warped_wart_block`, `minecraft:soul_soil`; 3-6 block(s): `minecraft:soul_soil`, `minecraft:basalt`; 6-18 block(s): `minecraft:basalt`. Wall palette: `minecraft:basalt`, `minecraft:soul_soil`.
- **Content:** 1 object placement rule(s) drawing from 10 object key(s), including `underworld/soul/trees/spruce/levergreen1`, `underworld/soul/trees/spruce/mevergreen1`, `underworld/soul/trees/spruce/mevergreen2`, `underworld/soul/trees/spruce/mevergreen3`, `underworld/soul/trees/spruce/vgeneric1`, `underworld/soul/trees/spruce/vgeneric2`, `underworld/soul/trees/spruce/vgeneric3`, and 3 more. 3 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:soul_soil`, `minecraft:air`, `minecraft:soul_fire`.
- **Entity spawners:** `nether/surface/soul-sand-valley`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome frozen/pale-pines
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
