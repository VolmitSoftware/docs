---
title: "Biome Atlas — Magnetics Noise"
description: "Iris biome atlas entry for magnetics/noise in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`magnetics/noise` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `magnetics` (The Magnetics) | 1 | 1 | 1 | 16.67% |
| Underworld 1005 | `magnetics` (Underworld The Magnetics) | 1 | 1 | 1 | 16.67% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `magnetics/noise` (-3..22); combined authored contribution `-3..22` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:plains`; native-structure derivative `minecraft:plains`; no custom or scatter identities.
- **Surface:** 1 block(s): `minecraft:andesite`, `minecraft:coarse_dirt`, `minecraft:granite`, `minecraft:diorite`; 1-3 block(s): `minecraft:coarse_dirt`, `minecraft:andesite`, `minecraft:dirt`; 3-7 block(s): `minecraft:granite`, `minecraft:diorite`, `minecraft:andesite`; 7-18 block(s): `minecraft:granite`, `minecraft:diorite`, `minecraft:stone`, `minecraft:deepslate`, `minecraft:andesite`. Wall palette: `minecraft:granite`, `minecraft:diorite`, `minecraft:andesite`, `minecraft:stone`.
- **Content:** 4 object placement rule(s) drawing from 34 object key(s), including `trees/oak/antioch1`, `trees/oak/antioch2`, `trees/oak/antioch4`, `trees/oak/antioch5`, `trees/oak/antioch6`, `trees/oak/antioch7`, `trees/oak/antioch8`, and 27 more. 2 decorator rule(s) using `minecraft:short_grass`, `minecraft:dandelion`, `minecraft:poppy`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:basalt_deltas`; native-structure derivative `minecraft:basalt_deltas`; custom identities `underworld_magnetics_noise_5791b146`.
- **Surface:** 1 block(s): `minecraft:basalt`, `minecraft:blackstone`, `minecraft:magma_block`, `minecraft:quartz_block`; 1-3 block(s): `minecraft:blackstone`, `minecraft:basalt`; 3-7 block(s): `minecraft:magma_block`, `minecraft:quartz_block`, `minecraft:basalt`; 7-18 block(s): `minecraft:magma_block`, `minecraft:quartz_block`, `minecraft:blackstone`, `minecraft:basalt`. Wall palette: `minecraft:magma_block`, `minecraft:quartz_block`, `minecraft:basalt`, `minecraft:blackstone`.
- **Content:** 4 object placement rule(s) drawing from 34 object key(s), including `underworld/basalt/trees/oak/antioch1`, `underworld/basalt/trees/oak/antioch2`, `underworld/basalt/trees/oak/antioch4`, `underworld/basalt/trees/oak/antioch5`, `underworld/basalt/trees/oak/antioch6`, `underworld/basalt/trees/oak/antioch7`, `underworld/basalt/trees/oak/antioch8`, and 27 more. 3 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:fire`, `minecraft:crimson_fungus`, `minecraft:nether_sprouts`.
- **Entity spawners:** `nether/surface/basalt-deltas`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

- **Overworld 4002: [`temperate/plains`](/iris/biomes/temperate/plains):** rarity `1`, altitude `125..165` blocks above the surface, top mode `NOISE`, maximum thickness `72`, carving biome `carving/rocky-cavebiome-child`; decorators inherit and objects inherit.
- **Underworld 1005: [`temperate/plains`](/iris/biomes/temperate/plains):** rarity `1`, altitude `125..165` blocks above the surface, top mode `NOISE`, maximum thickness `72`, carving biome `carving/rocky-cavebiome-child`; decorators inherit and objects inherit.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome magnetics/noise
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
