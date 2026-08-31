---
title: "Biome Atlas — Mountain Hills"
description: "Iris biome atlas entry for mountain/hills in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`mountain/hills` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `tundra` (Tundra) | 1 | 1 | 1 | 6.12% |
| Underworld 1005 | `tundra` (Underworld Tundra) | 1 | 1 | 1 | 6.12% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `smooth-dunes` (15..33); combined authored contribution `15..33` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:old_growth_spruce_taiga`; native-structure derivative `minecraft:old_growth_spruce_taiga`; no custom or scatter identities.
- **Surface:** 1 block(s) at slope 0-3.3: `minecraft:grass_block`; 2-4 block(s) at slope >= 4: `minecraft:gravel`, `minecraft:cyan_terracotta`; 2-4 block(s) at slope >= 4: `minecraft:stone`, `minecraft:cobblestone`; 1 block(s) at slope 0-4: `minecraft:grass_block`; 3 block(s) at slope 0-3: `minecraft:dirt`. Wall palette: `minecraft:stone`, `minecraft:andesite`, `minecraft:gravel`, `minecraft:cyan_terracotta`.
- **Content:** 3 object placement rule(s) drawing from 3 object key(s), including `clutter/sbush1`, `clutter/sbush2`, `clutter/sbush3`. 3 decorator rule(s) using `minecraft:dandelion`, `minecraft:poppy`, `minecraft:blue_orchid`, `minecraft:allium`, `minecraft:azure_bluet`, `minecraft:red_tulip`, `minecraft:orange_tulip`, `minecraft:white_tulip`, `minecraft:pink_tulip`, and 5 more.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:basalt_deltas`; native-structure derivative `minecraft:basalt_deltas`; custom identities `underworld_mountain_hills_7f1ea284`.
- **Surface:** 1 block(s) at slope 0-3.3: `minecraft:basalt`; 2-4 block(s) at slope >= 4: `minecraft:gravel`, `minecraft:warped_nylium`; 2-4 block(s) at slope >= 4: `minecraft:blackstone`; 1 block(s) at slope 0-4: `minecraft:basalt`; 3 block(s) at slope 0-3: `minecraft:blackstone`. Wall palette: `minecraft:blackstone`, `minecraft:basalt`, `minecraft:gravel`, `minecraft:warped_nylium`.
- **Content:** 3 object placement rule(s) drawing from 3 object key(s), including `underworld/basalt/clutter/sbush1`, `underworld/basalt/clutter/sbush2`, `underworld/basalt/clutter/sbush3`. 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:crimson_fungus`, `minecraft:nether_sprouts`, `minecraft:fire`.
- **Entity spawners:** `nether/surface/basalt-deltas`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

Children that are also direct land roots have their own atlas pages: [`mountain/forest`](/iris/biomes/mountain/forest).

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome mountain/hills
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
