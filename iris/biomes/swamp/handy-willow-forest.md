---
title: "Biome Atlas — Swamp Haunted Hands Forest"
description: "Iris biome atlas entry for swamp/handy-willow-forest in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`swamp/handy-willow-forest` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `swamp` (Swamp) | 1 | 1 | 1 | 11.67% |
| Underworld 1005 | `swamp` (Underworld Swamp) | 1 | 1 | 1 | 11.67% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `mountain` (10..30); combined authored contribution `10..30` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:swamp`; native-structure derivative `minecraft:dark_forest`; no custom or scatter identities.
- **Surface:** 1 block(s): `minecraft:grass_block`, `minecraft:podzol`; 2-4 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 5 object placement rule(s) drawing from 30 object key(s), including `trees/darkoak/generic1`, `trees/darkoak/generic2`, `trees/darkoak/generic3`, `trees/darkoak/generic5`, `trees/darkoak/generic6`, `trees/darkoak/generic7`, `trees/darkoak/generic8`, and 23 more. 3 decorator rule(s) using `minecraft:dead_bush`, `minecraft:crimson_fungus`, `minecraft:brown_mushroom`, `minecraft:red_mushroom`, `minecraft:short_grass`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:warped_forest`; native-structure derivative `minecraft:warped_forest`; custom identities `underworld_swamp_handy_willow_forest_61591713`.
- **Surface:** 1 block(s): `minecraft:warped_nylium`; 2-4 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`.
- **Content:** 5 object placement rule(s) drawing from 30 object key(s), including `underworld/warped/trees/darkoak/generic1`, `underworld/warped/trees/darkoak/generic2`, `underworld/warped/trees/darkoak/generic3`, `underworld/warped/trees/darkoak/generic5`, `underworld/warped/trees/darkoak/generic6`, `underworld/warped/trees/darkoak/generic7`, `underworld/warped/trees/darkoak/generic8`, and 23 more. 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:warped_fungus`, `minecraft:crimson_fungus`, `minecraft:nether_sprouts`.
- **Entity spawners:** `nether/surface/warped-forest`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome swamp/handy-willow-forest
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
