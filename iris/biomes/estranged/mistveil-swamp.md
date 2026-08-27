---
title: "Biome Atlas — Mistveil Swamp"
description: "Iris biome atlas entry for estranged/mistveil-swamp in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`estranged/mistveil-swamp` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `estranged` (Estranged) | 1 | 4 | 0.25 | 5.28% |
| Underworld 1005 | `estranged` (Underworld Estranged) | 1 | 2 | 0.5 | 8.82% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

## Shared terrain

Both packs use the same generator links: `plain` (2..8), `rare-hills` (0..24); combined authored contribution `2..32` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:swamp`; native-structure derivative `minecraft:swamp`; custom identities `estranged_mistveil`.
- **Surface:** 1 block(s): `minecraft:grass_block`, `minecraft:podzol`, `minecraft:mud`; 2-3 block(s): `minecraft:dirt`, `minecraft:mud`. Wall palette: `minecraft:stone`, `minecraft:mossy_cobblestone`.
- **Content:** 5 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:fern`, `minecraft:short_grass`, `minecraft:brown_mushroom`, `minecraft:red_mushroom`. Procedural content: 2 trees (mistveil-spire, mistveil-young).

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:warped_forest`; native-structure derivative `minecraft:warped_forest`; custom identities `underworld_estranged_mistveil_swamp_eb0851e8`.
- **Surface:** 1 block(s): `minecraft:warped_nylium`, `minecraft:netherrack`; 2-3 block(s): `minecraft:netherrack`. Wall palette: `minecraft:netherrack`, `minecraft:blackstone`.
- **Content:** 6 decorator rule(s) (3 shared snippet reference(s)) using `minecraft:nether_sprouts`, `minecraft:warped_fungus`. Procedural content: 2 trees (mistveil-spire, mistveil-young).
- **Entity spawners:** `nether/surface/warped-forest`, `nether/cave`.

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.


## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome estranged/mistveil-swamp
/iris what biome
/iris what region
```

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
