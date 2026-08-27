---
title: "Biome Atlas — Savanna"
description: "Iris biome atlas entry for savanna/savanna in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`savanna/savanna` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `hot` (Hot) | 1 | 1 | 1 | 5.83% |
| Underworld 1005 | `hot` (Underworld Hot) | 1 | 1 | 1 | 5.83% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

## Shared terrain

Both packs use the same generator links: `plain` (10..20); combined authored contribution `10..20` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:savanna`; native-structure derivative `minecraft:savanna`; custom identities `savanna`; underground scatter `minecraft:savanna`, `minecraft:desert`; sky scatter `minecraft:desert`, `minecraft:savanna`.
- **Surface:** 3-5 block(s) at slope >= 6.9: `minecraft:granite`; 3-5 block(s) at slope >= 4.6: `minecraft:coarse_dirt`, `minecraft:gravel`; 1 block(s): `minecraft:grass_block`; 2-4 block(s): `minecraft:dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 6 object placement rule(s) drawing from 38 object key(s), including `clutter/camp1`, `clutter/bincluster1`, `trees/acacia/savannaD1`, `trees/acacia/savannaD2`, `trees/acacia/savannaD3`, `trees/acacia/savannaF1`, `trees/acacia/savannaF2`, and 31 more. 6 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:dead_bush`, `minecraft:cactus`, `minecraft:cactus_flower`, `minecraft:short_grass`, `minecraft:tall_grass`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:nether_wastes`; native-structure derivative `minecraft:nether_wastes`; custom identities `underworld_savanna_savanna_45d027e0`.
- **Surface:** 3-5 block(s) at slope >= 6.9: `minecraft:magma_block`; 3-5 block(s) at slope >= 4.6: `minecraft:netherrack`, `minecraft:gravel`; 1 block(s): `minecraft:netherrack`; 2-4 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`.
- **Content:** 6 object placement rule(s) drawing from 38 object key(s), including `underworld/wastes/clutter/camp1`, `underworld/wastes/clutter/bincluster1`, `underworld/wastes/trees/acacia/savannaD1`, `underworld/wastes/trees/acacia/savannaD2`, `underworld/wastes/trees/acacia/savannaD3`, `underworld/wastes/trees/acacia/savannaF1`, `underworld/wastes/trees/acacia/savannaF2`, and 31 more. 7 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:crimson_fungus`, `minecraft:crimson_stem`, `minecraft:fire`.
- **Entity spawners:** `nether/surface/nether-wastes`, `nether/cave`.

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

## Children

### Savanna Cliffs (`savanna/cliff`)

This child-only biome is selected from `savanna/savanna`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `1` of `2` slots (50.00%); later child hops are resolved separately.

**Shared terrain:** `plain-cliffs` (35..65); combined authored contribution `35..65` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:savanna` identity; surface 3-5 block(s) at slope >= 6.9: `minecraft:sandstone`, `minecraft:sand`; 3-5 block(s) at slope >= 4.6: `minecraft:sand`, `minecraft:coarse_dirt`, `minecraft:gravel`; 1 block(s): `minecraft:grass_block`; 2-4 block(s): `minecraft:dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`; 4 object placement rule(s) drawing from 36 object key(s), including `trees/acacia/savannaD1`, `trees/acacia/savannaD2`, `trees/acacia/savannaD3`, `trees/acacia/savannaF1`, `trees/acacia/savannaF2`, `trees/acacia/savannaF3`, `trees/acacia/savannaF4`, and 29 more. 6 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:dead_bush`, `minecraft:cactus`, `minecraft:cactus_flower`, `minecraft:short_grass`, `minecraft:tall_grass`.
- **Underworld 1005:** `minecraft:nether_wastes` identity; surface 3-5 block(s) at slope >= 6.9: `minecraft:smooth_basalt`, `minecraft:netherrack`; 3-5 block(s) at slope >= 4.6: `minecraft:netherrack`, `minecraft:gravel`; 1 block(s): `minecraft:netherrack`; 2-4 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`; 4 object placement rule(s) drawing from 36 object key(s), including `underworld/wastes/trees/acacia/savannaD1`, `underworld/wastes/trees/acacia/savannaD2`, `underworld/wastes/trees/acacia/savannaD3`, `underworld/wastes/trees/acacia/savannaF1`, `underworld/wastes/trees/acacia/savannaF2`, `underworld/wastes/trees/acacia/savannaF3`, `underworld/wastes/trees/acacia/savannaF4`, and 29 more. 7 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:crimson_fungus`, `minecraft:crimson_stem`, `minecraft:fire`.

Direct-root children continue on their own pages: [`savanna/acacia-denmyre`](/iris/biomes/savanna/acacia-denmyre).

### Savanna Cliffs (`savanna/cliff-extended`)

This child-only biome is selected from `savanna/cliff`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `1` of `3` slots (33.33%); later child hops are resolved separately.

**Shared terrain:** `plain-cliffs` (55..85); combined authored contribution `55..85` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:savanna` identity; surface 3-5 block(s) at slope >= 6.9: `minecraft:sandstone`, `minecraft:sand`; 3-5 block(s) at slope >= 4.6: `minecraft:sand`, `minecraft:coarse_dirt`, `minecraft:gravel`; 1 block(s): `minecraft:grass_block`; 2-4 block(s): `minecraft:dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`; 4 object placement rule(s) drawing from 36 object key(s), including `trees/acacia/savannaD1`, `trees/acacia/savannaD2`, `trees/acacia/savannaD3`, `trees/acacia/savannaF1`, `trees/acacia/savannaF2`, `trees/acacia/savannaF3`, `trees/acacia/savannaF4`, and 29 more. 6 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:dead_bush`, `minecraft:cactus`, `minecraft:cactus_flower`, `minecraft:short_grass`, `minecraft:tall_grass`.
- **Underworld 1005:** `minecraft:nether_wastes` identity; surface 3-5 block(s) at slope >= 6.9: `minecraft:smooth_basalt`, `minecraft:netherrack`; 3-5 block(s) at slope >= 4.6: `minecraft:netherrack`, `minecraft:gravel`; 1 block(s): `minecraft:netherrack`; 2-4 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`; 4 object placement rule(s) drawing from 36 object key(s), including `underworld/wastes/trees/acacia/savannaD1`, `underworld/wastes/trees/acacia/savannaD2`, `underworld/wastes/trees/acacia/savannaD3`, `underworld/wastes/trees/acacia/savannaF1`, `underworld/wastes/trees/acacia/savannaF2`, `underworld/wastes/trees/acacia/savannaF3`, `underworld/wastes/trees/acacia/savannaF4`, and 29 more. 7 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:crimson_fungus`, `minecraft:crimson_stem`, `minecraft:fire`.

Direct-root children continue on their own pages: [`savanna/acacia-denmyre`](/iris/biomes/savanna/acacia-denmyre).

## Floating variants

No floating child biomes are declared.


## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome savanna/savanna
/iris what biome
/iris what region
```

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
