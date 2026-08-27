---
title: "Biome Atlas — Swamp Roofed Forest"
description: "Iris biome atlas entry for swamp/roofed-forest in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`swamp/roofed-forest` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `swamp` (Swamp) | 1 | 1 | 1 | 11.67% |
| Underworld 1005 | `swamp` (Underworld Swamp) | 1 | 1 | 1 | 11.67% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

## Shared terrain

Both packs use the same generator links: `plain` (4..11); combined authored contribution `4..11` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:swamp`; native-structure derivative `minecraft:dark_forest`; no custom or scatter identities.
- **Surface:** 1 block(s): `minecraft:grass_block`, `minecraft:podzol`; 2-4 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 8 object placement rule(s) drawing from 53 object key(s), including `trees/oak/mroofed1`, `trees/oak/mroofed2`, `trees/oak/mroofed3`, `trees/oak/mroofed4`, `trees/oak/mroofed5`, `trees/oak/mroofed6`, `trees/oak/mroofed7`, and 46 more. 4 decorator rule(s) using `minecraft:dead_bush`, `minecraft:brown_mushroom`, `minecraft:red_mushroom`, `minecraft:crimson_fungus`, `minecraft:dark_oak_button`, `minecraft:short_grass`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:warped_forest`; native-structure derivative `minecraft:warped_forest`; custom identities `underworld_swamp_roofed_forest_23165d44`.
- **Surface:** 1 block(s): `minecraft:warped_nylium`; 2-4 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`.
- **Content:** 8 object placement rule(s) drawing from 53 object key(s), including `underworld/warped/trees/oak/mroofed1`, `underworld/warped/trees/oak/mroofed2`, `underworld/warped/trees/oak/mroofed3`, `underworld/warped/trees/oak/mroofed4`, `underworld/warped/trees/oak/mroofed5`, `underworld/warped/trees/oak/mroofed6`, `underworld/warped/trees/oak/mroofed7`, and 46 more. 5 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:warped_fungus`, `minecraft:crimson_fungus`, `minecraft:warped_button`, `minecraft:nether_sprouts`.
- **Entity spawners:** `nether/surface/warped-forest`, `nether/cave`.

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

## Children

Children that are also direct land roots have their own atlas pages: [`swamp/sea/lake`](/iris/biomes/swamp/sea/lake).

### Swamp Roofed Forest (`swamp/roofed-forest-extended`)

This child-only biome is selected from `swamp/roofed-forest`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `1` of `3` slots (33.33%); later child hops are resolved separately.

**Shared terrain:** `mountain` (45..61); combined authored contribution `45..61` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:swamp` identity; surface 1 block(s): `minecraft:grass_block`, `minecraft:podzol`; 2-4 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`; 8 object placement rule(s) drawing from 53 object key(s), including `trees/oak/mroofed1`, `trees/oak/mroofed2`, `trees/oak/mroofed3`, `trees/oak/mroofed4`, `trees/oak/mroofed5`, `trees/oak/mroofed6`, `trees/oak/mroofed7`, and 46 more. 4 decorator rule(s) using `minecraft:dead_bush`, `minecraft:brown_mushroom`, `minecraft:red_mushroom`, `minecraft:crimson_fungus`, `minecraft:dark_oak_button`, `minecraft:short_grass`.
- **Underworld 1005:** `minecraft:warped_forest` identity; surface 1 block(s): `minecraft:warped_nylium`; 2-4 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`; 8 object placement rule(s) drawing from 53 object key(s), including `underworld/warped/trees/oak/mroofed1`, `underworld/warped/trees/oak/mroofed2`, `underworld/warped/trees/oak/mroofed3`, `underworld/warped/trees/oak/mroofed4`, `underworld/warped/trees/oak/mroofed5`, `underworld/warped/trees/oak/mroofed6`, `underworld/warped/trees/oak/mroofed7`, and 46 more. 5 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:warped_fungus`, `minecraft:crimson_fungus`, `minecraft:warped_button`, `minecraft:nether_sprouts`.

Direct-root children continue on their own pages: [`swamp/sea/lake`](/iris/biomes/swamp/sea/lake).

## Floating variants

No floating child biomes are declared.


## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome swamp/roofed-forest
/iris what biome
/iris what region
```

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
