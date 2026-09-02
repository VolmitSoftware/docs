---
title: "Biome Atlas — Osaka Violet Forest"
description: "Iris biome atlas entry for temperate/osaka-violet-forest in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`temperate/osaka-violet-forest` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `temperate` (Temperate) | 1 | 4 | 0.25 | 1.54% |
| Underworld 1005 | `temperate` (Underworld Temperate) | 1 | 4 | 0.25 | 1.54% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `plain` (4..7); combined authored contribution `4..7` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:flower_forest`; native-structure derivative `minecraft:forest`; custom identities `sakura_pink`, `sakura_child_forest`; underground scatter `minecraft:forest`.
- **Surface:** 1 block(s): `minecraft:grass_block`; 1 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 6 object placement rule(s) drawing from 43 object key(s), including `trees/oak/hoakgeneric3`, `trees/oak/hoakgeneric4`, `trees/oak/hoakgeneric5`, `trees/oak/hoakgeneric6`, `trees/oak/hoakgeneric7`, `trees/oak/hoakgeneric8`, `trees/oak/hoakgeneric9`, and 36 more. 7 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:short_grass`, `minecraft:oak_leaves`, `minecraft:tall_grass`, `minecraft:allium`, `minecraft:cobblestone_slab`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:nether_wastes`; native-structure derivative `minecraft:nether_wastes`; custom identities `underworld_temperate_osaka_violet_forest_ac174e2d`.
- **Surface:** 1 block(s): `minecraft:netherrack`; 1 block(s): `minecraft:netherrack`; 1-3 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`.
- **Content:** 6 object placement rule(s) drawing from 43 object key(s), including `underworld/wastes/trees/oak/hoakgeneric3`, `underworld/wastes/trees/oak/hoakgeneric4`, `underworld/wastes/trees/oak/hoakgeneric5`, `underworld/wastes/trees/oak/hoakgeneric6`, `underworld/wastes/trees/oak/hoakgeneric7`, `underworld/wastes/trees/oak/hoakgeneric8`, `underworld/wastes/trees/oak/hoakgeneric9`, and 36 more. 8 decorator rule(s) (3 shared snippet reference(s)) using `minecraft:fire`, `minecraft:nether_wart_block`, `minecraft:crimson_fungus`, `minecraft:nether_sprouts`, `minecraft:blackstone_slab`.
- **Entity spawners:** `nether/surface/nether-wastes`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome temperate/osaka-violet-forest
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
