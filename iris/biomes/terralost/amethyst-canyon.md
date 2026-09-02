---
title: "Biome Atlas — Amethyst Rainforest"
description: "Iris biome atlas entry for terralost/amethyst-canyon in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`terralost/amethyst-canyon` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `terralost` (Terralost) | 1 | 1 | 1 | 20.00% |
| Underworld 1005 | `terralost` (Underworld Terralost) | 1 | 1 | 1 | 20.00% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `vascular-cracked-cliffs` (50..70); combined authored contribution `50..70` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:jungle`; native-structure derivative `minecraft:jungle`; custom identities `terralost_amethyst_rainforest1`, `terralost_amethyst_rainforest2`.
- **Surface:** 1-3 block(s): `minecraft:calcite`, `minecraft:smooth_basalt`; 2-5 block(s): `minecraft:tuff`. Wall palette: none.
- **Content:** 4 object placement rule(s) drawing from 40 object key(s), including `trees/mixed/AmyLarge1`, `trees/mixed/AmyLarge2`, `trees/mixed/AmyLarge3`, `trees/mixed/AmyLarge4`, `trees/mixed/AmyLarge5`, `trees/mixed/AmyLarge6`, `trees/mixed/AmyLarge7`, and 33 more. 2 decorator rule(s) using `minecraft:allium`, `minecraft:tall_grass`, `minecraft:short_grass`, `minecraft:fern`, `minecraft:large_fern`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:basalt_deltas`; native-structure derivative `minecraft:basalt_deltas`; custom identities `underworld_terralost_amethyst_canyon_e70dc85c`.
- **Surface:** 1-3 block(s): `minecraft:blackstone`, `minecraft:smooth_basalt`; 2-5 block(s): `minecraft:blackstone`. Wall palette: none.
- **Content:** 4 object placement rule(s) drawing from 40 object key(s), including `underworld/basalt/trees/mixed/AmyLarge1`, `underworld/basalt/trees/mixed/AmyLarge2`, `underworld/basalt/trees/mixed/AmyLarge3`, `underworld/basalt/trees/mixed/AmyLarge4`, `underworld/basalt/trees/mixed/AmyLarge5`, `underworld/basalt/trees/mixed/AmyLarge6`, `underworld/basalt/trees/mixed/AmyLarge7`, and 33 more. 3 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:nether_sprouts`, `minecraft:crimson_fungus`, `minecraft:fire`.
- **Entity spawners:** `nether/surface/basalt-deltas`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

Children that are also direct land roots have their own atlas pages: [`terralost/amethyst-rainforest`](/iris/biomes/terralost/amethyst-rainforest).

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome terralost/amethyst-canyon
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
