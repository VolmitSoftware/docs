---
title: "Biome Atlas — Calm Plains"
description: "Iris biome atlas entry for temperate/calmplains in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`temperate/calmplains` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `temperate` (Temperate) | 1 | 1 | 1 | 6.15% |
| Underworld 1005 | `temperate` (Underworld Temperate) | 1 | 1 | 1 | 6.15% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `mountain` (-15..10); combined authored contribution `-15..10` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:plains`; native-structure derivative `minecraft:plains`; no custom or scatter identities.
- **Surface:** 1 block(s) at slope <= 4: `minecraft:grass_block`. Wall palette: `minecraft:andesite`, `minecraft:stone`, `minecraft:cobblestone`.
- **Content:** 1 object placement rule(s) drawing from 12 object key(s), including `trees/mixed/pollup1`, `trees/mixed/pollup2`, `trees/mixed/pollup4`, `trees/mixed/pollup5`, `trees/mixed/pollup6`, `trees/mixed/pollup7`, `trees/mixed/pollup8`, and 5 more. 6 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:dandelion`, `minecraft:poppy`, `minecraft:blue_orchid`, `minecraft:allium`, `minecraft:azure_bluet`, `minecraft:red_tulip`, `minecraft:orange_tulip`, `minecraft:white_tulip`, `minecraft:pink_tulip`, and 6 more.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:nether_wastes`; native-structure derivative `minecraft:nether_wastes`; custom identities `underworld_temperate_calmplains_58839d0c`.
- **Surface:** 1 block(s) at slope <= 4: `minecraft:netherrack`. Wall palette: `minecraft:basalt`, `minecraft:netherrack`, `minecraft:blackstone`.
- **Content:** 1 object placement rule(s) drawing from 12 object key(s), including `underworld/wastes/trees/mixed/pollup1`, `underworld/wastes/trees/mixed/pollup2`, `underworld/wastes/trees/mixed/pollup4`, `underworld/wastes/trees/mixed/pollup5`, `underworld/wastes/trees/mixed/pollup6`, `underworld/wastes/trees/mixed/pollup7`, `underworld/wastes/trees/mixed/pollup8`, and 5 more. 7 decorator rule(s) (3 shared snippet reference(s)) using `minecraft:crimson_fungus`, `minecraft:nether_sprouts`, `minecraft:fire`, `minecraft:crimson_stem`.
- **Entity spawners:** `nether/surface/nether-wastes`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome temperate/calmplains
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
