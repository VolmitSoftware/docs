---
title: "Biome Atlas — Oak Forest"
description: "Iris biome atlas entry for temperate/oak-forest-flat in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`temperate/oak-forest-flat` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `temperate` (Temperate) | 1 | 3 | 0.3333 | 2.05% |
| Underworld 1005 | `temperate` (Underworld Temperate) | 1 | 3 | 0.3333 | 2.05% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

## Shared terrain

Both packs use the same generator links: `plain` (4..10); combined authored contribution `4..10` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:forest`; native-structure derivative `minecraft:forest`; custom identities `oak_forest`.
- **Surface:** 1 block(s): `minecraft:grass_block`, `minecraft:coarse_dirt`, `minecraft:gravel`; 2 block(s): `minecraft:dirt`; 1 block(s): `minecraft:dirt`, `minecraft:stone`. Wall palette: `minecraft:stone`, `minecraft:andesite`, `minecraft:cobblestone`, `minecraft:mossy_cobblestone`.
- **Content:** 4 object placement rule(s) drawing from 35 object key(s), including `trees/oak/hoakgeneric1`, `trees/oak/hoakgeneric2`, `trees/oak/hoakgeneric3`, `trees/oak/hoakgeneric4`, `trees/oak/hoakgeneric5`, `trees/oak/shoakgeneric1`, `trees/oak/shoakgeneric2`, and 28 more. 9 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:dandelion`, `minecraft:poppy`, `minecraft:blue_orchid`, `minecraft:allium`, `minecraft:azure_bluet`, `minecraft:red_tulip`, `minecraft:orange_tulip`, `minecraft:white_tulip`, `minecraft:pink_tulip`, and 9 more.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:nether_wastes`; native-structure derivative `minecraft:nether_wastes`; custom identities `underworld_temperate_oak_forest_flat_6d19c87f`.
- **Surface:** 1 block(s): `minecraft:netherrack`, `minecraft:gravel`; 2 block(s): `minecraft:netherrack`; 1 block(s): `minecraft:netherrack`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`, `minecraft:blackstone`.
- **Content:** 4 object placement rule(s) drawing from 35 object key(s), including `underworld/wastes/trees/oak/hoakgeneric1`, `underworld/wastes/trees/oak/hoakgeneric2`, `underworld/wastes/trees/oak/hoakgeneric3`, `underworld/wastes/trees/oak/hoakgeneric4`, `underworld/wastes/trees/oak/hoakgeneric5`, `underworld/wastes/trees/oak/shoakgeneric1`, `underworld/wastes/trees/oak/shoakgeneric2`, and 28 more. 10 decorator rule(s) (3 shared snippet reference(s)) using `minecraft:crimson_fungus`, `minecraft:nether_sprouts`, `minecraft:fire`, `minecraft:blackstone_slab`.
- **Entity spawners:** `nether/surface/nether-wastes`, `nether/cave`.

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.


## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome temperate/oak-forest-flat
/iris what biome
/iris what region
```

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
