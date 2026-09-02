---
title: "Biome Atlas — The Creaks"
description: "Iris biome atlas entry for swamp/creaks in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`swamp/creaks` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `swamp` (Swamp) | 1 | 15 | 0.0667 | 0.78% |
| Underworld 1005 | `swamp` (Underworld Swamp) | 1 | 15 | 0.0667 | 0.78% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `plain` (18..24); combined authored contribution `18..24` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:swamp`; native-structure derivative `minecraft:dark_forest`; custom identities `pale_garden1`, `pale_garden2`, `pale_garden3`, `pale_garden4`, and 2 more.
- **Surface:** 1 block(s): `minecraft:grass_block`, `minecraft:pale_moss_block`; 2-4 block(s): `minecraft:dirt`, `minecraft:pale_moss_block`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 8 object placement rule(s) drawing from 53 object key(s), including `trees/oak/troofed1`, `trees/oak/troofed2`, `trees/oak/troofed3`, `trees/oak/troofed4`, `trees/oak/troofed5`, `trees/oak/troofed6`, `trees/oak/troofed7`, and 46 more. 5 decorator rule(s) using `minecraft:pale_oak_sapling`, `minecraft:closed_eyeblossom`, `minecraft:open_eyeblossom`, `minecraft:brown_mushroom`, `minecraft:red_mushroom`, `minecraft:pale_moss_carpet`, `minecraft:crimson_fungus`, `minecraft:dead_bubble_coral_fan`, `minecraft:dead_tube_coral`, and 1 more.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:warped_forest`; native-structure derivative `minecraft:warped_forest`; custom identities `underworld_swamp_creaks_f436feb9`.
- **Surface:** 1 block(s): `minecraft:warped_nylium`, `minecraft:warped_wart_block`; 2-4 block(s): `minecraft:netherrack`, `minecraft:warped_wart_block`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`.
- **Content:** 8 object placement rule(s) drawing from 53 object key(s), including `underworld/warped/trees/oak/troofed1`, `underworld/warped/trees/oak/troofed2`, `underworld/warped/trees/oak/troofed3`, `underworld/warped/trees/oak/troofed4`, `underworld/warped/trees/oak/troofed5`, `underworld/warped/trees/oak/troofed6`, `underworld/warped/trees/oak/troofed7`, and 46 more. 6 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:warped_fungus`, `minecraft:nether_sprouts`, `minecraft:warped_roots`, `minecraft:crimson_fungus`, `minecraft:warped_wart_block`.
- **Entity spawners:** `nether/surface/warped-forest`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome swamp/creaks
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
