---
title: "Biome Atlas — Pale Oak Highlands"
description: "Iris biome atlas entry for mountain/pale-oak-highlands in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`mountain/pale-oak-highlands` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `tundra` (Tundra) | 1 | 6 | 0.1667 | 1.02% |
| Underworld 1005 | `tundra` (Underworld Tundra) | 1 | 6 | 0.1667 | 1.02% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

## Shared terrain

Both packs use the same generator links: `mountain` (16..34), `vascular-cracked-cliffs` (0..12); combined authored contribution `16..46` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:old_growth_spruce_taiga`; native-structure derivative `minecraft:pale_garden`; custom identities `pale_oak_highlands`.
- **Surface:** 1 block(s) at slope 0-3.3: `minecraft:pale_moss_block`, `minecraft:grass_block`; 2-4 block(s) at slope >= 3.4: `minecraft:calcite`, `minecraft:diorite`, `minecraft:tuff`; 3-5 block(s) at slope 0-3.3: `minecraft:dirt`, `minecraft:rooted_dirt`. Wall palette: `minecraft:calcite`, `minecraft:stone`, `minecraft:tuff`, `minecraft:diorite`.
- **Content:** 1 object placement rule(s) drawing from 12 object key(s), including `trees/spruce/vgeneric1`, `trees/spruce/vgeneric2`, `trees/spruce/vgeneric3`, `trees/spruce/vgeneric4`, `trees/spruce/vgeneric5`, `trees/spruce/vgeneric6`, `trees/spruce/vgeneric7`, and 5 more. 2 decorator rule(s) using `minecraft:pale_moss_carpet`, `minecraft:air`, `minecraft:closed_eyeblossom`, `minecraft:open_eyeblossom`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:basalt_deltas`; native-structure derivative `minecraft:basalt_deltas`; custom identities `underworld_mountain_pale_oak_highlands_887ab35a`.
- **Surface:** 1 block(s) at slope 0-3.3: `minecraft:nether_wart_block`, `minecraft:basalt`; 2-4 block(s) at slope >= 3.4: `minecraft:blackstone`, `minecraft:quartz_block`; 3-5 block(s) at slope 0-3.3: `minecraft:blackstone`. Wall palette: `minecraft:blackstone`, `minecraft:quartz_block`.
- **Content:** 1 object placement rule(s) drawing from 12 object key(s), including `underworld/basalt/trees/spruce/vgeneric1`, `underworld/basalt/trees/spruce/vgeneric2`, `underworld/basalt/trees/spruce/vgeneric3`, `underworld/basalt/trees/spruce/vgeneric4`, `underworld/basalt/trees/spruce/vgeneric5`, `underworld/basalt/trees/spruce/vgeneric6`, `underworld/basalt/trees/spruce/vgeneric7`, and 5 more. 3 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:fire`, `minecraft:air`, `minecraft:nether_sprouts`.
- **Entity spawners:** `nether/surface/basalt-deltas`, `nether/cave`.

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.


## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome mountain/pale-oak-highlands
/iris what biome
/iris what region
```

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
