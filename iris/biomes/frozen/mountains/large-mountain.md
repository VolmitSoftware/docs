---
title: "Biome Atlas — Large Mountain"
description: "Iris biome atlas entry for frozen/mountains/large-mountain in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`frozen/mountains/large-mountain` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `frozen` (Frozen) | 1 | 1 | 1 | 5.69% |
| Underworld 1005 | `frozen` (Underworld Frozen) | 1 | 1 | 1 | 5.69% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `mountain` (60..103); combined authored contribution `60..103` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:snowy_taiga`; native-structure derivative `minecraft:snowy_taiga`; custom identities `frozen_hills`.
- **Surface:** 0-2 block(s) at slope <= 3.5: `minecraft:snow_block`; 1 block(s) at slope <= 3.5: `minecraft:grass_block`; 7-18 block(s) at slope <= 3.5: `minecraft:dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 2 object placement rule(s) drawing from 16 object key(s), including `trees/spruce/pine1`, `trees/spruce/pine2`, `trees/spruce/pine3`, `trees/spruce/pine4`, `trees/spruce/pine5`, `trees/spruce/pine6`, `trees/spruce/pine7`, and 9 more. 1 decorator rule(s) using `minecraft:snow`, `minecraft:air`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:basalt_deltas`; native-structure derivative `minecraft:basalt_deltas`; custom identities `underworld_frozen_mountains_large_mountain_a4760c1e`.
- **Surface:** 0-2 block(s) at slope <= 3.5: `minecraft:blackstone`; 1 block(s) at slope <= 3.5: `minecraft:basalt`; 7-18 block(s) at slope <= 3.5: `minecraft:blackstone`; 6-18 block(s): `minecraft:blackstone`, `minecraft:basalt`. Wall palette: `minecraft:blackstone`, `minecraft:basalt`.
- **Content:** 2 object placement rule(s) drawing from 16 object key(s), including `underworld/basalt/trees/spruce/pine1`, `underworld/basalt/trees/spruce/pine2`, `underworld/basalt/trees/spruce/pine3`, `underworld/basalt/trees/spruce/pine4`, `underworld/basalt/trees/spruce/pine5`, `underworld/basalt/trees/spruce/pine6`, `underworld/basalt/trees/spruce/pine7`, and 9 more. 2 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:blackstone`, `minecraft:air`.
- **Entity spawners:** `nether/surface/basalt-deltas`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

### Large Mountain Top (`frozen/mountains/large-mountain-top`)

This child-only biome is selected from `frozen/mountains/large-mountain`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `1` of `2` slots (50.00%); later child hops are resolved separately.

**Shared terrain:** `mountain` (106..210); combined authored contribution `106..210` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:snowy_taiga` identity; surface 0-2 block(s) at slope <= 3.5: `minecraft:snow_block`; 1 block(s) at slope <= 3.5: `minecraft:grass_block`; 7-18 block(s) at slope <= 3.5: `minecraft:dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`; 2 object placement rule(s) drawing from 16 object key(s), including `trees/spruce/pine1`, `trees/spruce/pine2`, `trees/spruce/pine3`, `trees/spruce/pine4`, `trees/spruce/pine5`, `trees/spruce/pine6`, `trees/spruce/pine7`, and 9 more. 1 decorator rule(s) using `minecraft:snow`, `minecraft:air`.
- **Underworld 1005:** `minecraft:basalt_deltas` identity; surface 0-2 block(s) at slope <= 3.5: `minecraft:blackstone`; 1 block(s) at slope <= 3.5: `minecraft:basalt`; 7-18 block(s) at slope <= 3.5: `minecraft:blackstone`; 6-18 block(s): `minecraft:blackstone`, `minecraft:basalt`; 2 object placement rule(s) drawing from 16 object key(s), including `underworld/basalt/trees/spruce/pine1`, `underworld/basalt/trees/spruce/pine2`, `underworld/basalt/trees/spruce/pine3`, `underworld/basalt/trees/spruce/pine4`, `underworld/basalt/trees/spruce/pine5`, `underworld/basalt/trees/spruce/pine6`, `underworld/basalt/trees/spruce/pine7`, and 9 more. 2 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:blackstone`, `minecraft:air`.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome frozen/mountains/large-mountain
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
