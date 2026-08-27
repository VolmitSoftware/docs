---
title: "Biome Atlas — Birch Thin Forest"
description: "Iris biome atlas entry for temperate/birch-thin in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`temperate/birch-thin` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `temperate` (Temperate) | 1 | 4 | 0.25 | 1.54% |
| Underworld 1005 | `temperate` (Underworld Temperate) | 1 | 4 | 0.25 | 1.54% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

## Shared terrain

Both packs use the same generator links: `highplains` (5..15), `rare-hills` (0..40); combined authored contribution `5..55` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:birch_forest`; native-structure derivative `minecraft:birch_forest`; no custom or scatter identities.
- **Surface:** 1 block(s): `minecraft:grass_block`, `minecraft:coarse_dirt`; 1 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 5 object placement rule(s) drawing from 23 object key(s), including `clutter/bincluster1`, `clutter/camp1`, `trees/birch/antioch3`, `trees/birch/antioch4`, `trees/birch/antioch5`, `trees/birch/antioch6`, `trees/birch/antioch7`, and 16 more. 5 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:short_grass`, `minecraft:allium`, `minecraft:poppy`, `minecraft:dandelion`, `minecraft:azure_bluet`, `minecraft:pink_tulip`, `minecraft:lily_of_the_valley`, `minecraft:fern`, `minecraft:tall_grass`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:nether_wastes`; native-structure derivative `minecraft:nether_wastes`; custom identities `underworld_temperate_birch_thin_ccdb300e`.
- **Surface:** 1 block(s): `minecraft:netherrack`; 1 block(s): `minecraft:netherrack`; 1-3 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`.
- **Content:** 5 object placement rule(s) drawing from 23 object key(s), including `underworld/wastes/clutter/bincluster1`, `underworld/wastes/clutter/camp1`, `underworld/wastes/trees/birch/antioch3`, `underworld/wastes/trees/birch/antioch4`, `underworld/wastes/trees/birch/antioch5`, `underworld/wastes/trees/birch/antioch6`, `underworld/wastes/trees/birch/antioch7`, and 16 more. 6 decorator rule(s) (3 shared snippet reference(s)) using `minecraft:fire`, `minecraft:nether_sprouts`, `minecraft:crimson_fungus`.
- **Entity spawners:** `nether/surface/nether-wastes`, `nether/cave`.

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.


## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome temperate/birch-thin
/iris what biome
/iris what region
```

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
