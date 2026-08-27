---
title: "Biome Atlas — Pale Oak Forest"
description: "Iris biome atlas entry for temperate/pale-oak-forest in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`temperate/pale-oak-forest` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `temperate` (Temperate) | 1 | 6 | 0.1667 | 1.02% |
| Underworld 1005 | `temperate` (Underworld Temperate) | 1 | 6 | 0.1667 | 1.02% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

## Shared terrain

Both packs use the same generator links: `smooth-dunes` (5..14), `rare-hills` (0..36); combined authored contribution `5..50` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:forest`; native-structure derivative `minecraft:pale_garden`; custom identities `temperate_pale_oak_forest`.
- **Surface:** 1 block(s): `minecraft:grass_block`, `minecraft:pale_moss_block`, `minecraft:coarse_dirt`; 2-3 block(s): `minecraft:dirt`, `minecraft:rooted_dirt`; 2-5 block(s): `minecraft:stone`, `minecraft:calcite`. Wall palette: `minecraft:stone`, `minecraft:andesite`, `minecraft:calcite`.
- **Content:** 1 object placement rule(s) drawing from 9 object key(s), including `vanilla/trees/pale_oak`, `vanilla/trees/pale_oak_2`, `vanilla/trees/pale_oak_3`, `vanilla/trees/pale_oak_bonemeal`, `vanilla/trees/pale_oak_bonemeal_2`, `vanilla/trees/pale_oak_bonemeal_3`, `vanilla/trees/pale_oak_creaking`, and 2 more. 2 decorator rule(s) using `minecraft:pale_moss_carpet`, `minecraft:short_grass`, `minecraft:air`, `minecraft:closed_eyeblossom`, `minecraft:open_eyeblossom`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:nether_wastes`; native-structure derivative `minecraft:nether_wastes`; custom identities `underworld_temperate_pale_oak_forest_b7eb343c`.
- **Surface:** 1 block(s): `minecraft:netherrack`, `minecraft:nether_wart_block`; 2-3 block(s): `minecraft:netherrack`; 2-5 block(s): `minecraft:netherrack`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`.
- **Content:** 1 object placement rule(s) drawing from 9 object key(s), including `underworld/wastes/vanilla/trees/pale_oak`, `underworld/wastes/vanilla/trees/pale_oak_2`, `underworld/wastes/vanilla/trees/pale_oak_3`, `underworld/wastes/vanilla/trees/pale_oak_bonemeal`, `underworld/wastes/vanilla/trees/pale_oak_bonemeal_2`, `underworld/wastes/vanilla/trees/pale_oak_bonemeal_3`, `underworld/wastes/vanilla/trees/pale_oak_creaking`, and 2 more. 3 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:fire`, `minecraft:air`, `minecraft:nether_sprouts`.
- **Entity spawners:** `nether/surface/nether-wastes`, `nether/cave`.

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.


## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome temperate/pale-oak-forest
/iris what biome
/iris what region
```

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
