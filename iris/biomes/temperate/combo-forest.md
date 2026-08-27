---
title: "Biome Atlas — Combo Forest"
description: "Iris biome atlas entry for temperate/combo-forest in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`temperate/combo-forest` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `forests` (Forests) | 1 | 2 | 0.5 | 5.73% |
| Overworld 4002 | `temperate` (Temperate) | 1 | 2 | 0.5 | 3.07% |
| Underworld 1005 | `forests` (Underworld Forests) | 1 | 2 | 0.5 | 5.73% |
| Underworld 1005 | `temperate` (Underworld Temperate) | 1 | 2 | 0.5 | 3.07% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

## Shared terrain

Both packs use the same generator links: `plain` (5..12); combined authored contribution `5..12` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:forest`; native-structure derivative `minecraft:forest`; no custom or scatter identities.
- **Surface:** 1 block(s): `minecraft:grass_block`; 1 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 8 object placement rule(s) drawing from 66 object key(s), including `trees/oak/hoakgeneric3`, `trees/oak/hoakgeneric4`, `trees/oak/hoakgeneric5`, `trees/oak/hoakgeneric6`, `trees/oak/hoakgeneric7`, `trees/oak/hoakgeneric8`, `trees/oak/hoakgeneric9`, and 59 more. 10 decorator rule(s) (3 shared snippet reference(s)) using `minecraft:short_grass`, `minecraft:oak_leaves`, `minecraft:tall_grass`, `minecraft:rose_bush`, `minecraft:red_mushroom`, `minecraft:poppy`, `minecraft:cobblestone_slab`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:nether_wastes`; native-structure derivative `minecraft:nether_wastes`; custom identities `underworld_temperate_combo_forest_859c40da`.
- **Surface:** 1 block(s): `minecraft:netherrack`; 1 block(s): `minecraft:netherrack`; 1-3 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`.
- **Content:** 8 object placement rule(s) drawing from 66 object key(s), including `underworld/wastes/trees/oak/hoakgeneric3`, `underworld/wastes/trees/oak/hoakgeneric4`, `underworld/wastes/trees/oak/hoakgeneric5`, `underworld/wastes/trees/oak/hoakgeneric6`, `underworld/wastes/trees/oak/hoakgeneric7`, `underworld/wastes/trees/oak/hoakgeneric8`, `underworld/wastes/trees/oak/hoakgeneric9`, and 59 more. 11 decorator rule(s) (4 shared snippet reference(s)) using `minecraft:fire`, `minecraft:nether_wart_block`, `minecraft:crimson_fungus`, `minecraft:nether_sprouts`, `minecraft:blackstone_slab`.
- **Entity spawners:** `nether/surface/nether-wastes`, `nether/cave`.

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

## Children

### Oak Denmyre (`temperate/oak-denmyre`)

This child-only biome is selected from `temperate/combo-forest`, not from a region list. Its rarity is `4`.
In that immediate child choice it contributes `1` of `7` slots (14.29%); later child hops are resolved separately.

**Shared terrain:** `plain` (5..12); combined authored contribution `5..12` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:forest` identity; surface 1 block(s): `minecraft:grass_block`; 1 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`; 4 object placement rule(s) drawing from 20 object key(s), including `clutter/camp1`, `trees/acacia/denmyre1`, `trees/acacia/denmyre2`, `trees/acacia/denmyre3`, `trees/acacia/denmyre4`, `trees/acacia/denmyre5`, `trees/acacia/denmyre6`, and 13 more. 10 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:short_grass`, `minecraft:lily_of_the_valley`, `minecraft:allium`, `minecraft:poppy`, `minecraft:oak_leaves`, `minecraft:tall_grass`, `minecraft:rose_bush`, `minecraft:red_mushroom`, `minecraft:cobblestone_slab`.
- **Underworld 1005:** `minecraft:nether_wastes` identity; surface 1 block(s): `minecraft:netherrack`; 1 block(s): `minecraft:netherrack`; 1-3 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`; 4 object placement rule(s) drawing from 20 object key(s), including `underworld/wastes/clutter/camp1`, `underworld/wastes/trees/acacia/denmyre1`, `underworld/wastes/trees/acacia/denmyre2`, `underworld/wastes/trees/acacia/denmyre3`, `underworld/wastes/trees/acacia/denmyre4`, `underworld/wastes/trees/acacia/denmyre5`, `underworld/wastes/trees/acacia/denmyre6`, and 13 more. 11 decorator rule(s) (3 shared snippet reference(s)) using `minecraft:fire`, `minecraft:nether_sprouts`, `minecraft:nether_wart_block`, `minecraft:crimson_fungus`, `minecraft:blackstone_slab`.

### Combo Forest (`temperate/combo-forest-extended`)

This child-only biome is selected from `temperate/combo-forest`, not from a region list. Its rarity is `2`.
In that immediate child choice it contributes `3` of `7` slots (42.86%); later child hops are resolved separately.

**Shared terrain:** `mountain` (45..62); combined authored contribution `45..62` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:forest` identity; surface 1 block(s): `minecraft:grass_block`; 1 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`; 8 object placement rule(s) drawing from 66 object key(s), including `trees/oak/hoakgeneric3`, `trees/oak/hoakgeneric4`, `trees/oak/hoakgeneric5`, `trees/oak/hoakgeneric6`, `trees/oak/hoakgeneric7`, `trees/oak/hoakgeneric8`, `trees/oak/hoakgeneric9`, and 59 more. 10 decorator rule(s) (3 shared snippet reference(s)) using `minecraft:short_grass`, `minecraft:oak_leaves`, `minecraft:tall_grass`, `minecraft:rose_bush`, `minecraft:red_mushroom`, `minecraft:poppy`, `minecraft:cobblestone_slab`.
- **Underworld 1005:** `minecraft:nether_wastes` identity; surface 1 block(s): `minecraft:netherrack`; 1 block(s): `minecraft:netherrack`; 1-3 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`; 8 object placement rule(s) drawing from 66 object key(s), including `underworld/wastes/trees/oak/hoakgeneric3`, `underworld/wastes/trees/oak/hoakgeneric4`, `underworld/wastes/trees/oak/hoakgeneric5`, `underworld/wastes/trees/oak/hoakgeneric6`, `underworld/wastes/trees/oak/hoakgeneric7`, `underworld/wastes/trees/oak/hoakgeneric8`, `underworld/wastes/trees/oak/hoakgeneric9`, and 59 more. 11 decorator rule(s) (4 shared snippet reference(s)) using `minecraft:fire`, `minecraft:nether_wart_block`, `minecraft:crimson_fungus`, `minecraft:nether_sprouts`, `minecraft:blackstone_slab`.

## Floating variants

No floating child biomes are declared.


## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome temperate/combo-forest
/iris what biome
/iris what region
```

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
