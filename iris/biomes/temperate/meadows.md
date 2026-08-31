---
title: "Biome Atlas — Meadows"
description: "Iris biome atlas entry for temperate/meadows in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`temperate/meadows` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `temperate` (Temperate) | 1 | 4 | 0.25 | 1.54% |
| Underworld 1005 | `temperate` (Underworld Temperate) | 1 | 4 | 0.25 | 1.54% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `highplains` (5..12); combined authored contribution `5..12` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:forest`; native-structure derivative `minecraft:forest`; custom identities `meadow`.
- **Surface:** 1 block(s): `minecraft:grass_block`; 2 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:dirt`, `minecraft:stone`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 3 object placement rule(s) drawing from 41 object key(s), including `clutter/camp1`, `clutter/camp3`, `clutter/camp4`, `clutter/camp5`, `clutter/camp2`, `trees/oak/hoakgeneric3`, `trees/oak/hoakgeneric4`, and 34 more. 7 decorator rule(s) (3 shared snippet reference(s)) using `minecraft:cornflower`, `minecraft:allium`, `minecraft:poppy`, `minecraft:pink_tulip`, `minecraft:lily_of_the_valley`, `minecraft:tall_grass`, `minecraft:short_grass`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:nether_wastes`; native-structure derivative `minecraft:nether_wastes`; custom identities `underworld_temperate_meadows_186c624d`.
- **Surface:** 1 block(s): `minecraft:netherrack`; 2 block(s): `minecraft:netherrack`; 1-3 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`.
- **Content:** 3 object placement rule(s) drawing from 41 object key(s), including `underworld/wastes/clutter/camp1`, `underworld/wastes/clutter/camp3`, `underworld/wastes/clutter/camp4`, `underworld/wastes/clutter/camp5`, `underworld/wastes/clutter/camp2`, `underworld/wastes/trees/oak/hoakgeneric3`, `underworld/wastes/trees/oak/hoakgeneric4`, and 34 more. 8 decorator rule(s) (4 shared snippet reference(s)) using `minecraft:fire`, `minecraft:nether_sprouts`, `minecraft:crimson_fungus`.
- **Entity spawners:** `nether/surface/nether-wastes`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome temperate/meadows
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
