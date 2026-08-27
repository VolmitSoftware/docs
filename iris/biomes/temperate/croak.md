---
title: "Biome Atlas — Croak"
description: "Iris biome atlas entry for temperate/croak in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`temperate/croak` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `temperate` (Temperate) | 1 | 1 | 1 | 6.15% |
| Underworld 1005 | `temperate` (Underworld Temperate) | 1 | 1 | 1 | 6.15% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

## Shared terrain

Both packs use the same generator links: `highplains` (20..35); combined authored contribution `20..35` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:plains`; native-structure derivative `minecraft:plains`; no custom or scatter identities.
- **Surface:** 1 block(s): `minecraft:grass_block`; 2-3 block(s): `minecraft:dirt`. Wall palette: none.
- **Content:** 2 object placement rule(s) drawing from 24 object key(s), including `trees/oak/croak1`, `trees/oak/croak2`, `trees/oak/croak3`, `trees/oak/croak4`, `trees/oak/croak5`, `trees/oak/croak6`, `trees/oak/croak7`, and 17 more. 6 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:pointed_dripstone`, `minecraft:bamboo`, `minecraft:short_grass`, `minecraft:tall_grass`, `minecraft:red_tulip`, `minecraft:dandelion`, `minecraft:oxeye_daisy`, `minecraft:air`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:nether_wastes`; native-structure derivative `minecraft:nether_wastes`; custom identities `underworld_temperate_croak_db29333b`.
- **Surface:** 1 block(s): `minecraft:netherrack`; 2-3 block(s): `minecraft:netherrack`. Wall palette: none.
- **Content:** 2 object placement rule(s) drawing from 24 object key(s), including `underworld/wastes/trees/oak/croak1`, `underworld/wastes/trees/oak/croak2`, `underworld/wastes/trees/oak/croak3`, `underworld/wastes/trees/oak/croak4`, `underworld/wastes/trees/oak/croak5`, `underworld/wastes/trees/oak/croak6`, `underworld/wastes/trees/oak/croak7`, and 17 more. 7 decorator rule(s) (3 shared snippet reference(s)) using `minecraft:basalt`, `minecraft:crimson_stem`, `minecraft:fire`, `minecraft:crimson_fungus`, `minecraft:air`.
- **Entity spawners:** `nether/surface/nether-wastes`, `nether/cave`.

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.


## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome temperate/croak
/iris what biome
/iris what region
```

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
