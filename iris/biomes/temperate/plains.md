---
title: "Biome Atlas — Plains"
description: "Iris biome atlas entry for temperate/plains in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`temperate/plains` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `temperate` (Temperate) | 1 | 2 | 0.5 | 3.07% |
| Underworld 1005 | `temperate` (Underworld Temperate) | 1 | 2 | 0.5 | 3.07% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `plain` (4..10); combined authored contribution `4..10` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:plains`; native-structure derivative `minecraft:plains`; no custom or scatter identities.
- **Surface:** 1 block(s): `minecraft:grass_block`; 2 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:dirt`, `minecraft:stone`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 7 object placement rule(s) drawing from 47 object key(s), including `clutter/camp1`, `clutter/camp3`, `clutter/camp4`, `clutter/camp5`, `clutter/camp2`, `trees/oak/hoakgeneric3`, `trees/oak/hoakgeneric4`, and 40 more. 5 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:dandelion`, `minecraft:poppy`, `minecraft:blue_orchid`, `minecraft:allium`, `minecraft:azure_bluet`, `minecraft:red_tulip`, `minecraft:orange_tulip`, `minecraft:white_tulip`, `minecraft:pink_tulip`, and 5 more.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:nether_wastes`; native-structure derivative `minecraft:nether_wastes`; custom identities `underworld_temperate_plains_5f3a692b`.
- **Surface:** 1 block(s): `minecraft:netherrack`; 2 block(s): `minecraft:netherrack`; 1-3 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`.
- **Content:** 7 object placement rule(s) drawing from 47 object key(s), including `underworld/wastes/clutter/camp1`, `underworld/wastes/clutter/camp3`, `underworld/wastes/clutter/camp4`, `underworld/wastes/clutter/camp5`, `underworld/wastes/clutter/camp2`, `underworld/wastes/trees/oak/hoakgeneric3`, `underworld/wastes/trees/oak/hoakgeneric4`, and 40 more. 6 decorator rule(s) (3 shared snippet reference(s)) using `minecraft:crimson_fungus`, `minecraft:nether_sprouts`, `minecraft:fire`.
- **Entity spawners:** `nether/surface/nether-wastes`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome temperate/plains
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
