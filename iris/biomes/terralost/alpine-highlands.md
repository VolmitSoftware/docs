---
title: "Biome Atlas — Alpine Highlands"
description: "Iris biome atlas entry for terralost/alpine-highlands in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`terralost/alpine-highlands` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `terralost` (Terralost) | 1 | 1 | 1 | 20.00% |
| Underworld 1005 | `terralost` (Underworld Terralost) | 1 | 1 | 1 | 20.00% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `mountain` (48..60), `rare-hills` (5..15); combined authored contribution `53..75` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:taiga`; native-structure derivative `minecraft:taiga`; custom identities `terralost_alpine_highlands1`, `terralost_alpine_highlands2`.
- **Surface:** 1 block(s): `minecraft:grass_block`, `minecraft:stone`, `minecraft:coarse_dirt`, `minecraft:diorite`; 2-4 block(s): `minecraft:dirt`; 1 block(s): `minecraft:stone`. Wall palette: `minecraft:diorite`, `minecraft:stone`.
- **Content:** 5 object placement rule(s) drawing from 38 object key(s), including `clutter/boulder1`, `clutter/boulder2`, `clutter/boulder3`, `clutter/boulder4`, `clutter/boulder5`, `clutter/boulder6`, `clutter/boulder7`, and 31 more. 2 decorator rule(s) using `minecraft:cornflower`, `minecraft:tall_grass`, `minecraft:short_grass`, `minecraft:fern`, `minecraft:large_fern`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:soul_sand_valley`; native-structure derivative `minecraft:soul_sand_valley`; custom identities `underworld_terralost_alpine_highlands_485bb1e4`.
- **Surface:** 1 block(s): `minecraft:soul_soil`, `minecraft:basalt`, `minecraft:quartz_block`; 2-4 block(s): `minecraft:soul_soil`; 1 block(s): `minecraft:basalt`. Wall palette: `minecraft:quartz_block`, `minecraft:basalt`.
- **Content:** 5 object placement rule(s) drawing from 38 object key(s), including `underworld/soul/clutter/boulder1`, `underworld/soul/clutter/boulder2`, `underworld/soul/clutter/boulder3`, `underworld/soul/clutter/boulder4`, `underworld/soul/clutter/boulder5`, `underworld/soul/clutter/boulder6`, `underworld/soul/clutter/boulder7`, and 31 more. 3 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:soul_fire`, `minecraft:nether_sprouts`.
- **Entity spawners:** `nether/surface/soul-sand-valley`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome terralost/alpine-highlands
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
