---
title: "Biome Atlas — Tundra Ether"
description: "Iris biome atlas entry for tundra/ether in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`tundra/ether` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `tundra` (Tundra) | 1 | 13 | 0.0769 | 0.47% |
| Underworld 1005 | `tundra` (Underworld Tundra) | 1 | 13 | 0.0769 | 0.47% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

## Shared terrain

Both packs use the same generator links: `smooth-dunes` (52..60); combined authored contribution `52..60` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:windswept_hills`; native-structure derivative `minecraft:old_growth_spruce_taiga`; custom identities `tunether`; underground scatter `minecraft:old_growth_pine_taiga`, `minecraft:windswept_hills`.
- **Surface:** 3-5 block(s) at slope >= 6.9: `minecraft:stone`, `minecraft:andesite`, `minecraft:gravel`; 3-5 block(s) at slope >= 5.3: `minecraft:dirt`, `minecraft:coarse_dirt`, `minecraft:gravel`; 1 block(s): `minecraft:grass_block`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 3 object placement rule(s) drawing from 21 object key(s), including `clutter/gravelsplotch1`, `clutter/gravelsplotch2`, `clutter/gravelsplotch3`, `clutter/gravelsplotch4`, `trees/mixed/dotree1`, `trees/mixed/dotree2`, `trees/mixed/dotree3`, and 14 more. 3 decorator rule(s) using `minecraft:white_tulip`, `minecraft:blue_orchid`, `minecraft:poppy`, `minecraft:sweet_berry_bush`, `minecraft:short_grass`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:soul_sand_valley`; native-structure derivative `minecraft:soul_sand_valley`; custom identities `underworld_tundra_ether_74965f92`.
- **Surface:** 3-5 block(s) at slope >= 6.9: `minecraft:basalt`, `minecraft:soul_sand`; 3-5 block(s) at slope >= 5.3: `minecraft:soul_soil`, `minecraft:soul_sand`; 1 block(s): `minecraft:soul_soil`; 6-18 block(s): `minecraft:basalt`. Wall palette: `minecraft:basalt`.
- **Content:** 3 object placement rule(s) drawing from 21 object key(s), including `underworld/soul/clutter/gravelsplotch1`, `underworld/soul/clutter/gravelsplotch2`, `underworld/soul/clutter/gravelsplotch3`, `underworld/soul/clutter/gravelsplotch4`, `underworld/soul/trees/mixed/dotree1`, `underworld/soul/trees/mixed/dotree2`, `underworld/soul/trees/mixed/dotree3`, and 14 more. 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:soul_fire`, `minecraft:crimson_roots`.
- **Entity spawners:** `nether/surface/soul-sand-valley`, `nether/cave`.

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

## Children

### Tundra Taiga (`tundra/taiga-extended`)

This child-only biome is selected from `tundra/ether`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `13` of `14` slots (92.86%); later child hops are resolved separately.

**Shared terrain:** `smooth-dunes` (45..97), `mountain` (8..14); combined authored contribution `53..111` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:old_growth_spruce_taiga` identity; surface 1 block(s): `minecraft:grass_block`; 2-4 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`; 6 object placement rule(s) drawing from 35 object key(s), including `clutter/grave1`, `clutter/stoneclutt1`, `clutter/stoneclutt2`, `clutter/stoneclutt3`, `clutter/stoneclutt4`, `clutter/stoneclutt5`, `clutter/stoneclutt6`, and 28 more. 8 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:white_tulip`, `minecraft:blue_orchid`, `minecraft:short_grass`, `minecraft:poppy`, `minecraft:sweet_berry_bush`, `minecraft:wither_rose`, `minecraft:oxeye_daisy`, `minecraft:pink_tulip`, `minecraft:large_fern`, and 2 more.
- **Underworld 1005:** `minecraft:soul_sand_valley` identity; surface 1 block(s): `minecraft:soul_soil`; 2-4 block(s): `minecraft:soul_soil`; 6-18 block(s): `minecraft:basalt`; 6 object placement rule(s) drawing from 35 object key(s), including `underworld/soul/clutter/grave1`, `underworld/soul/clutter/stoneclutt1`, `underworld/soul/clutter/stoneclutt2`, `underworld/soul/clutter/stoneclutt3`, `underworld/soul/clutter/stoneclutt4`, `underworld/soul/clutter/stoneclutt5`, `underworld/soul/clutter/stoneclutt6`, and 28 more. 9 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:soul_fire`, `minecraft:crimson_roots`, `minecraft:nether_sprouts`.

## Floating variants

No floating child biomes are declared.


## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome tundra/ether
/iris what biome
/iris what region
```

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
