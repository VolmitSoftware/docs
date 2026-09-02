---
title: "Biome Atlas — Frozen Plains"
description: "Iris biome atlas entry for frozen/plains in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`frozen/plains` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `frozen` (Frozen) | 1 | 1 | 1 | 5.69% |
| Underworld 1005 | `frozen` (Underworld Frozen) | 1 | 1 | 1 | 5.69% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `plain` (6..14); combined authored contribution `6..14` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:snowy_taiga`; native-structure derivative `minecraft:snowy_taiga`; custom identities `frozen_plains`.
- **Surface:** 0-1 block(s): `minecraft:snow_block`; 1 block(s): `minecraft:grass_block`; 4-7 block(s): `minecraft:dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 4 object placement rule(s) drawing from 18 object key(s), including `clutter/grave1`, `clutter/obelisk1`, `clutter/obelisk2`, `clutter/obelisk3`, `clutter/obelisk4`, `clutter/obelisk5`, `clutter/obelisk6`, and 11 more. 1 decorator rule(s) using `minecraft:snow`, `minecraft:air`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:soul_sand_valley`; native-structure derivative `minecraft:soul_sand_valley`; custom identities `underworld_frozen_plains_268470e8`.
- **Surface:** 0-1 block(s): `minecraft:soul_soil`; 1 block(s): `minecraft:soul_soil`; 4-7 block(s): `minecraft:soul_soil`; 6-18 block(s): `minecraft:basalt`. Wall palette: `minecraft:basalt`.
- **Content:** 4 object placement rule(s) drawing from 18 object key(s), including `underworld/soul/clutter/grave1`, `underworld/soul/clutter/obelisk1`, `underworld/soul/clutter/obelisk2`, `underworld/soul/clutter/obelisk3`, `underworld/soul/clutter/obelisk4`, `underworld/soul/clutter/obelisk5`, `underworld/soul/clutter/obelisk6`, and 11 more. 2 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:soul_soil`, `minecraft:air`.
- **Entity spawners:** `nether/surface/soul-sand-valley`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome frozen/plains
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
