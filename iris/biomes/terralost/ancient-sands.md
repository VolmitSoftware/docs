---
title: "Biome Atlas — Ancient Sands"
description: "Iris biome atlas entry for terralost/ancient-sands in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`terralost/ancient-sands` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `terralost` (Terralost) | 1 | 1 | 1 | 20.00% |
| Underworld 1005 | `terralost` (Underworld Terralost) | 1 | 1 | 1 | 20.00% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

## Shared terrain

Both packs use the same generator links: `smooth-dunes` (30..35), `mountain` (0..20), `rare-hills` (0..20); combined authored contribution `30..75` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:desert`; native-structure derivative `minecraft:desert`; custom identities `terralost_ancientsands`.
- **Surface:** 3-10 block(s): `minecraft:orange_terracotta`, `minecraft:red_sand`, `minecraft:sandstone`, `minecraft:sand`; 5 block(s): `minecraft:red_sand`; 3-10 block(s) at slope 4.5-20: `minecraft:sandstone`; 5 block(s): `minecraft:sand`. Wall palette: none.
- **Content:** 1 object placement rule(s) drawing from 2 object key(s), including `clutter/rsphinx1`, `clutter/rbrksphinx1`. 3 decorator rule(s) using `minecraft:cactus`, `minecraft:cactus_flower`, `minecraft:dead_bush`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:soul_sand_valley`; native-structure derivative `minecraft:soul_sand_valley`; custom identities `underworld_terralost_ancient_sands_e96a9b24`.
- **Surface:** 3-10 block(s): `minecraft:magma_block`, `minecraft:soul_sand`, `minecraft:smooth_basalt`; 5 block(s): `minecraft:soul_sand`; 3-10 block(s) at slope 4.5-20: `minecraft:smooth_basalt`; 5 block(s): `minecraft:soul_sand`. Wall palette: none.
- **Content:** 1 object placement rule(s) drawing from 2 object key(s), including `underworld/soul/clutter/rsphinx1`, `underworld/soul/clutter/rbrksphinx1`. 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:warped_stem`, `minecraft:nether_sprouts`.
- **Entity spawners:** `nether/surface/soul-sand-valley`, `nether/cave`.

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.


## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome terralost/ancient-sands
/iris what biome
/iris what region
```

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
