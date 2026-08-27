---
title: "Biome Atlas — Frozen Spruce Plains"
description: "Iris biome atlas entry for frozen/spruce-plains in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`frozen/spruce-plains` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `frozen` (Frozen) | 1 | 1 | 1 | 5.69% |
| Underworld 1005 | `frozen` (Underworld Frozen) | 1 | 1 | 1 | 5.69% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

## Shared terrain

Both packs use the same generator links: `smooth-dunes` (4..10); combined authored contribution `4..10` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:snowy_taiga`; native-structure derivative `minecraft:snowy_taiga`; custom identities `frozen_spruce_plains`.
- **Surface:** 0-1 block(s): `minecraft:snow_block`; 1 block(s): `minecraft:grass_block`; 4-7 block(s): `minecraft:dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 1 object placement rule(s) drawing from 4 object key(s), including `trees/spruce/levergreen1`, `trees/spruce/mevergreen1`, `trees/spruce/mevergreen2`, `trees/spruce/mevergreen3`. 1 decorator rule(s) using `minecraft:snow`, `minecraft:air`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:soul_sand_valley`; native-structure derivative `minecraft:soul_sand_valley`; custom identities `underworld_frozen_spruce_plains_b590ed84`.
- **Surface:** 0-1 block(s): `minecraft:soul_soil`; 1 block(s): `minecraft:soul_soil`; 4-7 block(s): `minecraft:soul_soil`; 6-18 block(s): `minecraft:basalt`. Wall palette: `minecraft:basalt`.
- **Content:** 1 object placement rule(s) drawing from 4 object key(s), including `underworld/soul/trees/spruce/levergreen1`, `underworld/soul/trees/spruce/mevergreen1`, `underworld/soul/trees/spruce/mevergreen2`, `underworld/soul/trees/spruce/mevergreen3`. 2 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:soul_soil`, `minecraft:air`.
- **Entity spawners:** `nether/surface/soul-sand-valley`, `nether/cave`.

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

## Children

### Frozen Spruce Hills (`frozen/spruce-hills`)

This child-only biome is selected from `frozen/spruce-plains`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `1` of `2` slots (50.00%); later child hops are resolved separately.

**Shared terrain:** `smooth-dunes` (6..20); combined authored contribution `6..20` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:snowy_taiga` identity; surface 0-2 block(s): `minecraft:snow_block`; 1 block(s): `minecraft:grass_block`; 6-28 block(s): `minecraft:dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`; 1 object placement rule(s) drawing from 4 object key(s), including `trees/spruce/levergreen1`, `trees/spruce/mevergreen1`, `trees/spruce/mevergreen2`, `trees/spruce/mevergreen3`. 1 decorator rule(s) using `minecraft:snow`, `minecraft:air`.
- **Underworld 1005:** `minecraft:soul_sand_valley` identity; surface 0-2 block(s): `minecraft:soul_soil`; 1 block(s): `minecraft:soul_soil`; 6-28 block(s): `minecraft:soul_soil`; 6-18 block(s): `minecraft:basalt`; 1 object placement rule(s) drawing from 4 object key(s), including `underworld/soul/trees/spruce/levergreen1`, `underworld/soul/trees/spruce/mevergreen1`, `underworld/soul/trees/spruce/mevergreen2`, `underworld/soul/trees/spruce/mevergreen3`. 2 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:soul_soil`, `minecraft:air`.

### Frozen Spruce Hills (`frozen/spruce-hills-extended`)

This child-only biome is selected from `frozen/spruce-hills`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `1` of `2` slots (50.00%); later child hops are resolved separately.

**Shared terrain:** `smooth-dunes` (50..112); combined authored contribution `50..112` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:snowy_taiga` identity; surface 0-2 block(s): `minecraft:snow_block`; 1 block(s): `minecraft:grass_block`; 6-28 block(s): `minecraft:dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`; 1 object placement rule(s) drawing from 4 object key(s), including `trees/spruce/levergreen1`, `trees/spruce/mevergreen1`, `trees/spruce/mevergreen2`, `trees/spruce/mevergreen3`. 1 decorator rule(s) using `minecraft:snow`, `minecraft:air`.
- **Underworld 1005:** `minecraft:soul_sand_valley` identity; surface 0-2 block(s): `minecraft:soul_soil`; 1 block(s): `minecraft:soul_soil`; 6-28 block(s): `minecraft:soul_soil`; 6-18 block(s): `minecraft:basalt`; 1 object placement rule(s) drawing from 4 object key(s), including `underworld/soul/trees/spruce/levergreen1`, `underworld/soul/trees/spruce/mevergreen1`, `underworld/soul/trees/spruce/mevergreen2`, `underworld/soul/trees/spruce/mevergreen3`. 2 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:soul_soil`, `minecraft:air`.

## Floating variants

No floating child biomes are declared.


## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome frozen/spruce-plains
/iris what biome
/iris what region
```

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
