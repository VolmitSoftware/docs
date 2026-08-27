---
title: "Biome Atlas — Birchglass Heath"
description: "Iris biome atlas entry for estranged/birchglass-heath in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`estranged/birchglass-heath` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `estranged` (Estranged) | 1 | 3 | 0.3333 | 7.04% |
| Underworld 1005 | `estranged` (Underworld Estranged) | 1 | 3 | 0.3333 | 5.88% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

## Shared terrain

Both packs use the same generator links: `smooth-dunes` (4..10), `rare-hills` (0..30); combined authored contribution `4..40` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:birch_forest`; native-structure derivative `minecraft:birch_forest`; custom identities `estranged_birchglass`.
- **Surface:** 1 block(s): `minecraft:grass_block`; 2 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:dirt`, `minecraft:stone`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 4 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:short_grass`, `minecraft:oxeye_daisy`, `minecraft:lily_of_the_valley`, `minecraft:white_tulip`. Procedural content: 2 trees (birchglass, birchglass-wide).

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:warped_forest`; native-structure derivative `minecraft:warped_forest`; custom identities `underworld_estranged_birchglass_heath_90308537`.
- **Surface:** 1 block(s): `minecraft:warped_nylium`; 2 block(s): `minecraft:netherrack`; 1-3 block(s): `minecraft:netherrack`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`.
- **Content:** 5 decorator rule(s) (3 shared snippet reference(s)) using `minecraft:nether_sprouts`. Procedural content: 2 trees (birchglass, birchglass-wide).
- **Entity spawners:** `nether/surface/warped-forest`, `nether/cave`.

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.


## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome estranged/birchglass-heath
/iris what biome
/iris what region
```

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
