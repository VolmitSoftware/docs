---
title: "Biome Atlas — Mushroom Plains"
description: "Iris biome atlas entry for mushroom/plains in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`mushroom/plains` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `mushroom` (Mushroom) | 1 | 1 | 1 | 25.00% |
| Underworld 1005 | `mushroom` (Underworld Mushroom) | 1 | 1 | 1 | 25.00% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

## Shared terrain

Both packs use the same generator links: `plain` (6..14); combined authored contribution `6..14` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:mushroom_fields`; native-structure derivative `minecraft:mushroom_fields`; custom identities `mushroom_plains`.
- **Surface:** 1 block(s): `minecraft:mycelium`; 2-4 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 4 object placement rule(s) drawing from 15 object key(s), including `trees/mushroom/mushclut1`, `trees/mushroom/mushclut2`, `trees/mushroom/mushclut3`, `trees/mushroom/mushclut4`, `trees/mushroom/mushclut5`, `trees/mushroom/mushclut6`, `trees/mushroom/mushclut7`, and 8 more. 2 decorator rule(s) using `minecraft:stone_button`, `minecraft:red_mushroom`, `minecraft:brown_mushroom`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:warped_forest`; native-structure derivative `minecraft:warped_forest`; custom identities `underworld_mushroom_plains_b788c088`.
- **Surface:** 1 block(s): `minecraft:warped_nylium`; 2-4 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`.
- **Content:** 4 object placement rule(s) drawing from 15 object key(s), including `underworld/warped/trees/mushroom/mushclut1`, `underworld/warped/trees/mushroom/mushclut2`, `underworld/warped/trees/mushroom/mushclut3`, `underworld/warped/trees/mushroom/mushclut4`, `underworld/warped/trees/mushroom/mushclut5`, `underworld/warped/trees/mushroom/mushclut6`, `underworld/warped/trees/mushroom/mushclut7`, and 8 more. 3 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:polished_blackstone_button`, `minecraft:warped_fungus`.
- **Entity spawners:** `nether/surface/warped-forest`, `nether/cave`.

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.


## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome mushroom/plains
/iris what biome
/iris what region
```

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
