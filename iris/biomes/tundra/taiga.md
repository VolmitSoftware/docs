---
title: "Biome Atlas — Tundra Taiga"
description: "Iris biome atlas entry for tundra/taiga in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`tundra/taiga` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `tundra` (Tundra) | 1 | 1 | 1 | 6.12% |
| Underworld 1005 | `tundra` (Underworld Tundra) | 1 | 1 | 1 | 6.12% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `plain` (34..42); combined authored contribution `34..42` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:old_growth_spruce_taiga`; native-structure derivative `minecraft:taiga`; custom identities `tundra_taiga`.
- **Surface:** 1 block(s): `minecraft:grass_block`; 2-4 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 6 object placement rule(s) drawing from 35 object key(s), including `clutter/grave1`, `clutter/stoneclutt1`, `clutter/stoneclutt2`, `clutter/stoneclutt3`, `clutter/stoneclutt4`, `clutter/stoneclutt5`, `clutter/stoneclutt6`, and 28 more. 7 decorator rule(s) using `minecraft:white_tulip`, `minecraft:blue_orchid`, `minecraft:short_grass`, `minecraft:poppy`, `minecraft:sweet_berry_bush`, `minecraft:wither_rose`, `minecraft:oxeye_daisy`, `minecraft:pink_tulip`, `minecraft:large_fern`, and 2 more.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:soul_sand_valley`; native-structure derivative `minecraft:soul_sand_valley`; custom identities `underworld_tundra_taiga_f3883e8a`.
- **Surface:** 1 block(s): `minecraft:soul_soil`; 2-4 block(s): `minecraft:soul_soil`; 6-18 block(s): `minecraft:basalt`. Wall palette: `minecraft:basalt`.
- **Content:** 6 object placement rule(s) drawing from 35 object key(s), including `underworld/soul/clutter/grave1`, `underworld/soul/clutter/stoneclutt1`, `underworld/soul/clutter/stoneclutt2`, `underworld/soul/clutter/stoneclutt3`, `underworld/soul/clutter/stoneclutt4`, `underworld/soul/clutter/stoneclutt5`, `underworld/soul/clutter/stoneclutt6`, and 28 more. 8 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:soul_fire`, `minecraft:crimson_roots`, `minecraft:nether_sprouts`.
- **Entity spawners:** `nether/surface/soul-sand-valley`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome tundra/taiga
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
