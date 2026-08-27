---
title: "Biome Atlas — Alpine Grove"
description: "Iris biome atlas entry for terralost/alpine-grove in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`terralost/alpine-grove` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `terralost` (Terralost) | 1 | 1 | 1 | 20.00% |
| Underworld 1005 | `terralost` (Underworld Terralost) | 1 | 1 | 1 | 20.00% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

## Shared terrain

Both packs use the same generator links: `plain` (42..51); combined authored contribution `42..51` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:frozen_peaks`; native-structure derivative `minecraft:old_growth_spruce_taiga`; custom identities `terralost_alpine_grove1`, `terralost_alpine_grove2`; underground scatter `minecraft:old_growth_pine_taiga`, `minecraft:windswept_hills`.
- **Surface:** 3-5 block(s): `minecraft:powder_snow`, `minecraft:snow_block`; 1-2 block(s): `minecraft:snow_block`; 1 block(s): `minecraft:packed_ice`. Wall palette: none.
- **Content:** 2 object placement rule(s) drawing from 23 object key(s), including `trees/mixed/pollup1`, `trees/mixed/pollup2`, `trees/mixed/pollup3`, `trees/mixed/pollup4`, `trees/mixed/pollup5`, `trees/mixed/pollup6`, `trees/mixed/pollup7`, and 16 more.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:soul_sand_valley`; native-structure derivative `minecraft:soul_sand_valley`; custom identities `underworld_terralost_alpine_grove_81a1a327`.
- **Surface:** 3-5 block(s): `minecraft:soul_soil`; 1-2 block(s): `minecraft:soul_soil`; 1 block(s): `minecraft:soul_soil`. Wall palette: none.
- **Content:** 2 object placement rule(s) drawing from 23 object key(s), including `underworld/soul/trees/mixed/pollup1`, `underworld/soul/trees/mixed/pollup2`, `underworld/soul/trees/mixed/pollup3`, `underworld/soul/trees/mixed/pollup4`, `underworld/soul/trees/mixed/pollup5`, `underworld/soul/trees/mixed/pollup6`, `underworld/soul/trees/mixed/pollup7`, and 16 more. 1 decorator rule(s) (1 shared snippet reference(s)).
- **Entity spawners:** `nether/surface/soul-sand-valley`, `nether/cave`.

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.


## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome terralost/alpine-grove
/iris what biome
/iris what region
```

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
