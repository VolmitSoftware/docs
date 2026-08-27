---
title: "Biome Atlas — Tundra Taiga"
description: "Iris biome atlas entry for tundra/taiga in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`tundra/taiga` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `tundra` (Tundra) | 1 | 1 | 1 | 6.12% |
| Underworld 1005 | `tundra` (Underworld Tundra) | 1 | 1 | 1 | 6.12% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

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

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

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

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
