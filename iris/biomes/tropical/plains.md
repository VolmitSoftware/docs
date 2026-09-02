---
title: "Biome Atlas — Tropical Plains"
description: "Iris biome atlas entry for tropical/plains in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`tropical/plains` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `tropical` (Tropical) | 1 | 1 | 1 | 8.33% |
| Underworld 1005 | `tropical` (Underworld Tropical) | 1 | 1 | 1 | 8.33% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `smooth-dunes` (-10..20); combined authored contribution `-10..20` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:jungle`; native-structure derivative `minecraft:jungle`; custom identities `tropical_plains`.
- **Surface:** 1 block(s): `minecraft:grass_block`; 2 block(s): `minecraft:dirt`; 1 block(s): `minecraft:dirt`, `minecraft:stone`. Wall palette: none.
- **Content:** 4 object placement rule(s) drawing from 22 object key(s), including `trees/jungle/cocogeneric2`, `trees/jungle/cocogeneric3`, `trees/jungle/cocogeneric4`, `trees/jungle/cocogeneric5`, `clutter/sbush1`, `clutter/sbush2`, `clutter/sbush3`, and 15 more. 2 decorator rule(s) using `minecraft:short_grass`, `minecraft:tall_grass`, `minecraft:dandelion`, `minecraft:poppy`, `minecraft:blue_orchid`, `minecraft:allium`, `minecraft:azure_bluet`, `minecraft:red_tulip`, `minecraft:orange_tulip`, and 5 more.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:crimson_forest`; native-structure derivative `minecraft:crimson_forest`; custom identities `underworld_tropical_plains_5cc9cfa9`.
- **Surface:** 1 block(s): `minecraft:crimson_nylium`; 2 block(s): `minecraft:netherrack`; 1 block(s): `minecraft:netherrack`. Wall palette: none.
- **Content:** 4 object placement rule(s) drawing from 22 object key(s), including `underworld/crimson/trees/jungle/cocogeneric2`, `underworld/crimson/trees/jungle/cocogeneric3`, `underworld/crimson/trees/jungle/cocogeneric4`, `underworld/crimson/trees/jungle/cocogeneric5`, `underworld/crimson/clutter/sbush1`, `underworld/crimson/clutter/sbush2`, `underworld/crimson/clutter/sbush3`, and 15 more. 3 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:nether_sprouts`, `minecraft:crimson_fungus`, `minecraft:crimson_roots`.
- **Entity spawners:** `nether/surface/crimson-forest`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

Children that are also direct land roots have their own atlas pages: [`tropical/plains-hills`](/iris/biomes/tropical/plains-hills).

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome tropical/plains
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
