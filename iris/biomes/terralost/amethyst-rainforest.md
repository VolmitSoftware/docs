---
title: "Biome Atlas — Amethyst Rainforest"
description: "Iris biome atlas entry for terralost/amethyst-rainforest in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`terralost/amethyst-rainforest` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `terralost` (Terralost) | 1 | 1 | 1 | 20.00% |
| Underworld 1005 | `terralost` (Underworld Terralost) | 1 | 1 | 1 | 20.00% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `mountain` (65..99), `highplains` (15..22), `vascular-cracked-cliffs` (5..10); combined authored contribution `85..131` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:jungle`; native-structure derivative `minecraft:jungle`; custom identities `terralost_amethyst_rainforest1`, `terralost_amethyst_rainforest2`.
- **Surface:** 1 block(s): `minecraft:grass_block`, `minecraft:stone`, `minecraft:coarse_dirt`, `minecraft:diorite`; 2-4 block(s): `minecraft:dirt`; 1 block(s): `minecraft:stone`. Wall palette: none.
- **Content:** 4 object placement rule(s) drawing from 39 object key(s), including `trees/mixed/AmyLarge1`, `trees/mixed/AmyLarge2`, `trees/mixed/AmyLarge3`, `trees/mixed/AmyLarge4`, `trees/mixed/AmyLarge5`, `trees/mixed/AmyLarge7`, `trees/mixed/AmyLarge8`, and 32 more. 2 decorator rule(s) using `minecraft:allium`, `minecraft:tall_grass`, `minecraft:short_grass`, `minecraft:fern`, `minecraft:large_fern`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:soul_sand_valley`; native-structure derivative `minecraft:soul_sand_valley`; custom identities `underworld_terralost_amethyst_rainforest_56058a4a`.
- **Surface:** 1 block(s): `minecraft:soul_soil`, `minecraft:basalt`, `minecraft:quartz_block`; 2-4 block(s): `minecraft:soul_soil`; 1 block(s): `minecraft:basalt`. Wall palette: none.
- **Content:** 4 object placement rule(s) drawing from 39 object key(s), including `underworld/soul/trees/mixed/AmyLarge1`, `underworld/soul/trees/mixed/AmyLarge2`, `underworld/soul/trees/mixed/AmyLarge3`, `underworld/soul/trees/mixed/AmyLarge4`, `underworld/soul/trees/mixed/AmyLarge5`, `underworld/soul/trees/mixed/AmyLarge7`, `underworld/soul/trees/mixed/AmyLarge8`, and 32 more. 3 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:crimson_roots`, `minecraft:nether_sprouts`, `minecraft:soul_fire`.
- **Entity spawners:** `nether/surface/soul-sand-valley`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome terralost/amethyst-rainforest
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
