---
title: "Biome Atlas — Extreme mountains"
description: "Iris biome atlas entry for tropical/mountain in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`tropical/mountain` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `tropical` (Tropical) | 1 | 1 | 1 | 8.33% |
| Underworld 1005 | `tropical` (Underworld Tropical) | 1 | 1 | 1 | 8.33% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

## Shared terrain

Both packs use the same generator links: `mountain` (75..150); combined authored contribution `75..150` blocks relative to fluid height.

Biome identity scatter uses `NOWHERE` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:jungle`; native-structure derivative `minecraft:jungle`; custom identities `tropical_mountain`.
- **Surface:** 1 block(s): `minecraft:grass_block`; 1 block(s): `minecraft:dirt`, `minecraft:rooted_dirt`. Wall palette: none.
- **Content:** 3 object placement rule(s) drawing from 18 object key(s), including `clutter/sbush1`, `clutter/sbush2`, `clutter/sbush3`, `trees/jungle/lgeneric1`, `trees/jungle/lgeneric2`, `trees/jungle/lgeneric3`, `trees/jungle/lgeneric4`, and 11 more. 4 decorator rule(s) using `minecraft:short_grass`, `minecraft:tall_grass`, `minecraft:dandelion`, `minecraft:poppy`, `minecraft:blue_orchid`, `minecraft:allium`, `minecraft:azure_bluet`, `minecraft:red_tulip`, `minecraft:orange_tulip`, and 5 more.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:basalt_deltas`; native-structure derivative `minecraft:basalt_deltas`; custom identities `underworld_tropical_mountain_9e00c594`.
- **Surface:** 1 block(s): `minecraft:basalt`; 1 block(s): `minecraft:blackstone`. Wall palette: none.
- **Content:** 3 object placement rule(s) drawing from 18 object key(s), including `underworld/basalt/clutter/sbush1`, `underworld/basalt/clutter/sbush2`, `underworld/basalt/clutter/sbush3`, `underworld/basalt/trees/jungle/lgeneric1`, `underworld/basalt/trees/jungle/lgeneric2`, `underworld/basalt/trees/jungle/lgeneric3`, `underworld/basalt/trees/jungle/lgeneric4`, and 11 more. 5 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:fire`, `minecraft:crimson_fungus`, `minecraft:nether_sprouts`.
- **Entity spawners:** `nether/surface/basalt-deltas`, `nether/cave`.

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

## Children

### Tropical Mountain Middle (`tropical/mountain-middle`)

This child-only biome is selected from `tropical/mountain`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `1` of `2` slots (50.00%); later child hops are resolved separately.

**Shared terrain:** `mountain` (75..190); combined authored contribution `75..190` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:jungle` identity; surface 2 block(s) at slope 0-3: `minecraft:grass_block`; 6-10 block(s) at slope 3-255: `minecraft:terracotta`; 6-10 block(s) at slope 3-255: `minecraft:orange_terracotta`; 6-10 block(s) at slope 3-255: `minecraft:red_terracotta`; 3 object placement rule(s) drawing from 18 object key(s), including `clutter/sbush1`, `clutter/sbush2`, `clutter/sbush3`, `trees/jungle/lgeneric1`, `trees/jungle/lgeneric2`, `trees/jungle/lgeneric3`, `trees/jungle/lgeneric4`, and 11 more. 4 decorator rule(s) using `minecraft:short_grass`, `minecraft:tall_grass`, `minecraft:dandelion`, `minecraft:poppy`, `minecraft:blue_orchid`, `minecraft:allium`, `minecraft:azure_bluet`, `minecraft:red_tulip`, `minecraft:orange_tulip`, and 5 more.
- **Underworld 1005:** `minecraft:basalt_deltas` identity; surface 2 block(s) at slope 0-3: `minecraft:basalt`; 6-10 block(s) at slope 3-255: `minecraft:netherrack`; 6-10 block(s) at slope 3-255: `minecraft:magma_block`; 6-10 block(s) at slope 3-255: `minecraft:nether_bricks`; 3 object placement rule(s) drawing from 18 object key(s), including `underworld/basalt/clutter/sbush1`, `underworld/basalt/clutter/sbush2`, `underworld/basalt/clutter/sbush3`, `underworld/basalt/trees/jungle/lgeneric1`, `underworld/basalt/trees/jungle/lgeneric2`, `underworld/basalt/trees/jungle/lgeneric3`, `underworld/basalt/trees/jungle/lgeneric4`, and 11 more. 5 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:fire`, `minecraft:crimson_fungus`, `minecraft:nether_sprouts`.

Direct-root children continue on their own pages: [`tropical/plains`](/iris/biomes/tropical/plains).

## Floating variants

No floating child biomes are declared.


## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome tropical/mountain
/iris what biome
/iris what region
```

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
