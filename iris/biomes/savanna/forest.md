---
title: "Biome Atlas — Savanna Forest"
description: "Iris biome atlas entry for savanna/forest in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`savanna/forest` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `hot` (Hot) | 1 | 3 | 0.3333 | 1.94% |
| Underworld 1005 | `hot` (Underworld Hot) | 1 | 3 | 0.3333 | 1.94% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

## Shared terrain

Both packs use the same generator links: `plain` (7..10); combined authored contribution `7..10` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:savanna`; native-structure derivative `minecraft:savanna`; custom identities `savanna_forest`; underground scatter `minecraft:savanna`, `minecraft:desert`; sky scatter `minecraft:desert`.
- **Surface:** 1 block(s): `minecraft:grass_block`, `minecraft:brown_concrete_powder`; 2-4 block(s): `minecraft:dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 5 object placement rule(s) drawing from 15 object key(s), including `clutter/bincluster1`, `clutter/hay1`, `clutter/hay3`, `clutter/hay2`, `trees/oak/dadwood1`, `trees/oak/dadwood2`, `trees/oak/dadwood3`, and 8 more. 5 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:stone_button`, `minecraft:dead_bush`, `minecraft:short_grass`, `minecraft:tall_grass`, `minecraft:air`, `minecraft:pumpkin`, `minecraft:carved_pumpkin`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:nether_wastes`; native-structure derivative `minecraft:nether_wastes`; custom identities `underworld_savanna_forest_0e6dfdc3`.
- **Surface:** 1 block(s): `minecraft:netherrack`, `minecraft:soul_soil`; 2-4 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`.
- **Content:** 5 object placement rule(s) drawing from 15 object key(s), including `underworld/wastes/clutter/bincluster1`, `underworld/wastes/clutter/hay1`, `underworld/wastes/clutter/hay3`, `underworld/wastes/clutter/hay2`, `underworld/wastes/trees/oak/dadwood1`, `underworld/wastes/trees/oak/dadwood2`, `underworld/wastes/trees/oak/dadwood3`, and 8 more. 6 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:polished_blackstone_button`, `minecraft:crimson_fungus`, `minecraft:fire`, `minecraft:air`, `minecraft:magma_block`.
- **Entity spawners:** `nether/surface/nether-wastes`, `nether/cave`.

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.


## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome savanna/forest
/iris what biome
/iris what region
```

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
