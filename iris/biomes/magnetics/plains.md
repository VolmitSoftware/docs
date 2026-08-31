---
title: "Biome Atlas — Magnetics Plains"
description: "Iris biome atlas entry for magnetics/plains in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`magnetics/plains` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `magnetics` (The Magnetics) | 1 | 1 | 1 | 16.67% |
| Underworld 1005 | `magnetics` (Underworld The Magnetics) | 1 | 1 | 1 | 16.67% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `magnetics/plains` (-3..14); combined authored contribution `-3..14` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:plains`; native-structure derivative `minecraft:plains`; no custom or scatter identities.
- **Surface:** 1 block(s) at slope <= 4: `minecraft:grass_block`, `minecraft:moss_block`; 1-3 block(s): `minecraft:dirt`, `minecraft:rooted_dirt`, `minecraft:coarse_dirt`; 3-6 block(s): `minecraft:mossy_cobblestone`, `minecraft:cobblestone`, `minecraft:stone`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`, `minecraft:deepslate`, `minecraft:cobblestone`. Wall palette: `minecraft:mossy_cobblestone`, `minecraft:cobblestone`, `minecraft:stone`, `minecraft:moss_block`.
- **Content:** 1 object placement rule(s) drawing from 12 object key(s), including `trees/oak/antioch1`, `trees/oak/antioch2`, `trees/oak/antioch4`, `trees/oak/antioch5`, `trees/oak/antioch6`, `trees/oak/antioch7`, `trees/oak/antioch8`, and 5 more. 2 decorator rule(s) using `minecraft:dandelion`, `minecraft:poppy`, `minecraft:blue_orchid`, `minecraft:allium`, `minecraft:azure_bluet`, `minecraft:cornflower`, `minecraft:lily_of_the_valley`, `minecraft:short_grass`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:basalt_deltas`; native-structure derivative `minecraft:basalt_deltas`; custom identities `underworld_magnetics_plains_af987ab6`.
- **Surface:** 1 block(s) at slope <= 4: `minecraft:basalt`, `minecraft:nether_wart_block`; 1-3 block(s): `minecraft:blackstone`; 3-6 block(s): `minecraft:blackstone`; 6-18 block(s): `minecraft:blackstone`, `minecraft:basalt`. Wall palette: `minecraft:blackstone`, `minecraft:nether_wart_block`.
- **Content:** 1 object placement rule(s) drawing from 12 object key(s), including `underworld/basalt/trees/oak/antioch1`, `underworld/basalt/trees/oak/antioch2`, `underworld/basalt/trees/oak/antioch4`, `underworld/basalt/trees/oak/antioch5`, `underworld/basalt/trees/oak/antioch6`, `underworld/basalt/trees/oak/antioch7`, `underworld/basalt/trees/oak/antioch8`, and 5 more. 3 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:crimson_fungus`, `minecraft:nether_sprouts`, `minecraft:fire`.
- **Entity spawners:** `nether/surface/basalt-deltas`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

- **Overworld 4002: [`mushroom/forest`](/iris/biomes/mushroom/forest):** rarity `1`, altitude `115..155` blocks above the surface, top mode `NOISE`, maximum thickness `72`, carving biome `carving/mushroom`; decorators inherit and objects inherit.
- **Overworld 4002: [`tropical/wilds`](/iris/biomes/tropical/wilds):** rarity `1`, altitude `75..115` blocks above the surface, top mode `NOISE`, maximum thickness `72`, carving biome `carving/lush-child`; decorators inherit and objects inherit.
- **Underworld 1005: [`mushroom/forest`](/iris/biomes/mushroom/forest):** rarity `1`, altitude `115..155` blocks above the surface, top mode `NOISE`, maximum thickness `72`, carving biome `carving/mushroom`; decorators inherit and objects inherit.
- **Underworld 1005: [`tropical/wilds`](/iris/biomes/tropical/wilds):** rarity `1`, altitude `75..115` blocks above the surface, top mode `NOISE`, maximum thickness `72`, carving biome `carving/lush-child`; decorators inherit and objects inherit.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome magnetics/plains
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
