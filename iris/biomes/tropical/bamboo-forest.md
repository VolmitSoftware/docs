---
title: "Biome Atlas — Tropical Bamboo Forest"
description: "Iris biome atlas entry for tropical/bamboo-forest in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`tropical/bamboo-forest` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `tropical` (Tropical) | 1 | 1 | 1 | 8.33% |
| Underworld 1005 | `tropical` (Underworld Tropical) | 1 | 1 | 1 | 8.33% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `plain` (5..9); combined authored contribution `5..9` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:desert`; native-structure derivative `minecraft:bamboo_jungle`; custom identities `tropical_bamboo_forest`; underground scatter `minecraft:bamboo_jungle`; sky scatter `minecraft:bamboo_jungle`.
- **Surface:** 1 block(s): `minecraft:grass_block`; 1 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 4 object placement rule(s) drawing from 29 object key(s), including `clutter/boulder1`, `clutter/boulder2`, `clutter/boulder4`, `clutter/boulder5`, `clutter/boulder6`, `clutter/boulder7`, `clutter/boulder8`, and 22 more. 2 decorator rule(s) using `minecraft:short_grass`, `minecraft:tall_grass`, `minecraft:bamboo`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:crimson_forest`; native-structure derivative `minecraft:crimson_forest`; custom identities `underworld_tropical_bamboo_forest_30a304a6`.
- **Surface:** 1 block(s): `minecraft:crimson_nylium`; 1 block(s): `minecraft:netherrack`; 1-3 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`.
- **Content:** 4 object placement rule(s) drawing from 29 object key(s), including `underworld/crimson/clutter/boulder1`, `underworld/crimson/clutter/boulder2`, `underworld/crimson/clutter/boulder4`, `underworld/crimson/clutter/boulder5`, `underworld/crimson/clutter/boulder6`, `underworld/crimson/clutter/boulder7`, `underworld/crimson/clutter/boulder8`, and 22 more. 3 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:nether_sprouts`, `minecraft:crimson_fungus`, `minecraft:crimson_stem`.
- **Entity spawners:** `nether/surface/crimson-forest`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

Children that are also direct land roots have their own atlas pages: [`tropical/wilds`](/iris/biomes/tropical/wilds).

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome tropical/bamboo-forest
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
