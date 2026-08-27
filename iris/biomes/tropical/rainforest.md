---
title: "Biome Atlas — Tropical Rainforest"
description: "Iris biome atlas entry for tropical/rainforest in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`tropical/rainforest` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `tropical` (Tropical) | 1 | 1 | 1 | 8.33% |
| Underworld 1005 | `tropical` (Underworld Tropical) | 1 | 1 | 1 | 8.33% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

## Shared terrain

Both packs use the same generator links: `mountain` (20..45); combined authored contribution `20..45` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:jungle`; native-structure derivative `minecraft:jungle`; custom identities `tropical_rainforest`.
- **Surface:** 1 block(s): `minecraft:grass_block`; 2-4 block(s): `minecraft:dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stripped_jungle_wood`, `minecraft:jungle_leaves`.
- **Content:** 7 object placement rule(s) drawing from 35 object key(s), including `clutter/bincluster1`, `clutter/camp1`, `trees/jungle/cocogeneric2`, `trees/jungle/cocogeneric3`, `trees/jungle/cocogeneric4`, `trees/jungle/cocogeneric5`, `trees/jungle/lgeneric6`, and 28 more. 3 decorator rule(s) using `minecraft:jungle_leaves`, `minecraft:tall_grass`, `minecraft:short_grass`, `minecraft:stone_button`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:crimson_forest`; native-structure derivative `minecraft:crimson_forest`; custom identities `underworld_tropical_rainforest_7326fe1f`.
- **Surface:** 1 block(s): `minecraft:crimson_nylium`; 2-4 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`. Wall palette: `minecraft:stripped_crimson_hyphae`, `minecraft:nether_wart_block`.
- **Content:** 7 object placement rule(s) drawing from 35 object key(s), including `underworld/crimson/clutter/bincluster1`, `underworld/crimson/clutter/camp1`, `underworld/crimson/trees/jungle/cocogeneric2`, `underworld/crimson/trees/jungle/cocogeneric3`, `underworld/crimson/trees/jungle/cocogeneric4`, `underworld/crimson/trees/jungle/cocogeneric5`, `underworld/crimson/trees/jungle/lgeneric6`, and 28 more. 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:nether_wart_block`, `minecraft:crimson_fungus`, `minecraft:nether_sprouts`, `minecraft:polished_blackstone_button`.
- **Entity spawners:** `nether/surface/crimson-forest`, `nether/cave`.

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

## Children

Children that are also direct land roots have their own atlas pages: [`tropical/rainforest-hills`](/iris/biomes/tropical/rainforest-hills), [`tropical/rainforest-wicked`](/iris/biomes/tropical/rainforest-wicked).

### Tropical Jungle Denmyre (`tropical/jungle-denmyre`)

This child-only biome is selected from `tropical/rainforest`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `1` of `4` slots (25.00%); later child hops are resolved separately.

**Shared terrain:** `plain` (4..7); combined authored contribution `4..7` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:jungle` identity; surface 1 block(s): `minecraft:grass_block`; 1 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`; 2 object placement rule(s) drawing from 17 object key(s), including `trees/acacia/denmyre1`, `trees/acacia/denmyre2`, `trees/acacia/denmyre3`, `trees/acacia/denmyre4`, `trees/acacia/denmyre5`, `trees/acacia/denmyre6`, `trees/acacia/denmyre7`, and 10 more. 3 decorator rule(s) using `minecraft:short_grass`, `minecraft:stone_button`, `minecraft:tall_grass`.
- **Underworld 1005:** `minecraft:crimson_forest` identity; surface 1 block(s): `minecraft:crimson_nylium`; 1 block(s): `minecraft:netherrack`; 1-3 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`; 2 object placement rule(s) drawing from 17 object key(s), including `underworld/crimson/trees/acacia/denmyre1`, `underworld/crimson/trees/acacia/denmyre2`, `underworld/crimson/trees/acacia/denmyre3`, `underworld/crimson/trees/acacia/denmyre4`, `underworld/crimson/trees/acacia/denmyre5`, `underworld/crimson/trees/acacia/denmyre6`, `underworld/crimson/trees/acacia/denmyre7`, and 10 more. 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:nether_sprouts`, `minecraft:polished_blackstone_button`, `minecraft:crimson_fungus`.

## Floating variants

No floating child biomes are declared.


## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome tropical/rainforest
/iris what biome
/iris what region
```

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
