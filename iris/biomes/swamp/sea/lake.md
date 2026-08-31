---
title: "Biome Atlas — Swampy Marsh"
description: "Iris biome atlas entry for swamp/sea/lake in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`swamp/sea/lake` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `swamp` (Swamp) | 1 | 1 | 1 | 11.67% |
| Underworld 1005 | `swamp` (Underworld Swamp) | 1 | 1 | 1 | 11.67% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `mountain` (-32..-10); combined authored contribution `-32..-10` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:swamp`; native-structure derivative `minecraft:swamp`; no custom or scatter identities.
- **Surface:** 1 block(s): `minecraft:grass_block`, `minecraft:podzol`; 1 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 1 object placement rule(s) drawing from 3 object key(s), including `clutter/oakclutt1`, `clutter/oakclutt2`, `clutter/oakclutt3`. 3 decorator rule(s) using `minecraft:brown_mushroom`, `minecraft:red_mushroom`, `minecraft:large_fern`, `minecraft:tall_grass`, `minecraft:short_grass`, `minecraft:fern`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:basalt_deltas`; native-structure derivative `minecraft:basalt_deltas`; custom identities `underworld_swamp_sea_lake_ddf0ed8f`.
- **Surface:** 1 block(s): `minecraft:basalt`; 1 block(s): `minecraft:blackstone`; 1-3 block(s): `minecraft:blackstone`; 6-18 block(s): `minecraft:blackstone`, `minecraft:basalt`. Wall palette: `minecraft:blackstone`, `minecraft:basalt`.
- **Content:** 1 object placement rule(s) drawing from 3 object key(s), including `underworld/basalt/clutter/oakclutt1`, `underworld/basalt/clutter/oakclutt2`, `underworld/basalt/clutter/oakclutt3`. 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:crimson_fungus`, `minecraft:fire`.
- **Entity spawners:** `nether/surface/basalt-deltas`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

Children that are also direct land roots have their own atlas pages: [`swamp/marsh`](/iris/biomes/swamp/marsh).

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome swamp/sea/lake
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
