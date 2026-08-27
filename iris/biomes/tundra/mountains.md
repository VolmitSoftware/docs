---
title: "Biome Atlas — Tundra Mountains"
description: "Iris biome atlas entry for tundra/mountains in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`tundra/mountains` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `tundra` (Tundra) | 2 | 1 | 2 | 12.25% |
| Underworld 1005 | `tundra` (Underworld Tundra) | 2 | 1 | 2 | 12.25% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

The `tundra` region intentionally lists `tundra/mountains` twice. Those two direct list occurrences produce the combined raw weight `2` and the `12.25%` conditional land-list share shown above. Its child link to [`tundra/mountains-extended-cliffs`](/iris/biomes/tundra/mountains-extended-cliffs) is resolved only after a root has been selected; that recursive reachability does not add another region-list occurrence.

## Shared terrain

Both packs use the same generator links: `mountain` (66..89); combined authored contribution `66..89` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:windswept_hills`; native-structure derivative `minecraft:old_growth_spruce_taiga`; custom identities `tundra_mountains`; underground scatter `minecraft:plains`, `minecraft:old_growth_pine_taiga`, `minecraft:windswept_hills`, `minecraft:swamp`; sky scatter `minecraft:snowy_taiga`, `minecraft:frozen_peaks`.
- **Surface:** 3-5 block(s) at slope >= 6.9: `minecraft:stone`, `minecraft:andesite`, `minecraft:gravel`; 3-5 block(s) at slope >= 5.3: `minecraft:dirt`, `minecraft:coarse_dirt`, `minecraft:gravel`; 1 block(s): `minecraft:grass_block`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 5 object placement rule(s) drawing from 38 object key(s), including `clutter/gravelsplotch1`, `clutter/gravelsplotch2`, `clutter/gravelsplotch3`, `clutter/gravelsplotch4`, `trees/spruce/levergreen1`, `trees/spruce/levergreen2`, `trees/spruce/levergreen3`, and 31 more. 3 decorator rule(s) using `minecraft:white_tulip`, `minecraft:blue_orchid`, `minecraft:poppy`, `minecraft:sweet_berry_bush`, `minecraft:short_grass`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:basalt_deltas`; native-structure derivative `minecraft:basalt_deltas`; custom identities `underworld_tundra_mountains_9c1ed867`.
- **Surface:** 3-5 block(s) at slope >= 6.9: `minecraft:blackstone`, `minecraft:basalt`, `minecraft:gravel`; 3-5 block(s) at slope >= 5.3: `minecraft:blackstone`, `minecraft:gravel`; 1 block(s): `minecraft:basalt`; 6-18 block(s): `minecraft:blackstone`, `minecraft:basalt`. Wall palette: `minecraft:blackstone`, `minecraft:basalt`.
- **Content:** 5 object placement rule(s) drawing from 38 object key(s), including `underworld/basalt/clutter/gravelsplotch1`, `underworld/basalt/clutter/gravelsplotch2`, `underworld/basalt/clutter/gravelsplotch3`, `underworld/basalt/clutter/gravelsplotch4`, `underworld/basalt/trees/spruce/levergreen1`, `underworld/basalt/trees/spruce/levergreen2`, `underworld/basalt/trees/spruce/levergreen3`, and 31 more. 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:fire`, `minecraft:nether_sprouts`.
- **Entity spawners:** `nether/surface/basalt-deltas`, `nether/cave`.

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

## Children

Children that are also direct land roots have their own atlas pages: [`tundra/mountains-extended-cliffs`](/iris/biomes/tundra/mountains-extended-cliffs).

## Floating variants

No floating child biomes are declared.


## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome tundra/mountains
/iris what biome
/iris what region
```

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
