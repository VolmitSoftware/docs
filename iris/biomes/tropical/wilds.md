---
title: "Biome Atlas — Tropical Wilds"
description: "Iris biome atlas entry for tropical/wilds in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`tropical/wilds` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `tropical` (Tropical) | 1 | 1 | 1 | 8.33% |
| Underworld 1005 | `tropical` (Underworld Tropical) | 1 | 1 | 1 | 8.33% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

## Shared terrain

Both packs use the same generator links: `mountain` (10..20); combined authored contribution `10..20` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:jungle`; native-structure derivative `minecraft:jungle`; custom identities `tropical_wilds`; underground scatter `minecraft:jungle`.
- **Surface:** 1 block(s): `minecraft:grass_block`; 1 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 9 object placement rule(s) drawing from 39 object key(s), including `clutter/oakshrub1`, `clutter/oakshrub2`, `clutter/oakshrub3`, `clutter/obelisk1`, `clutter/obelisk2`, `clutter/obelisk3`, `clutter/obelisk4`, and 32 more. 7 decorator rule(s) using `minecraft:tall_grass`, `minecraft:short_grass`, `minecraft:fern`, `minecraft:oxeye_daisy`, `minecraft:pink_tulip`, `minecraft:lily_of_the_valley`, `minecraft:dandelion`, `minecraft:poppy`, `minecraft:rose_bush`, and 3 more.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:crimson_forest`; native-structure derivative `minecraft:crimson_forest`; custom identities `underworld_tropical_wilds_bad3e830`.
- **Surface:** 1 block(s): `minecraft:crimson_nylium`; 1 block(s): `minecraft:netherrack`; 1-3 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`.
- **Content:** 9 object placement rule(s) drawing from 39 object key(s), including `underworld/crimson/clutter/oakshrub1`, `underworld/crimson/clutter/oakshrub2`, `underworld/crimson/clutter/oakshrub3`, `underworld/crimson/clutter/obelisk1`, `underworld/crimson/clutter/obelisk2`, `underworld/crimson/clutter/obelisk3`, `underworld/crimson/clutter/obelisk4`, and 32 more. 8 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:crimson_fungus`, `minecraft:nether_sprouts`, `minecraft:crimson_roots`.
- **Entity spawners:** `nether/surface/crimson-forest`, `nether/cave`.

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

## Children

### Tropical Highlands (`tropical/highlands`)

This child-only biome is selected from `tropical/wilds`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `1` of `2` slots (50.00%); later child hops are resolved separately.

**Shared terrain:** `mountain` (99..164); combined authored contribution `99..164` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:jungle` identity; surface 1 block(s): `minecraft:grass_block`, `minecraft:podzol`; 1 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`; 1 object placement rule(s) drawing from 10 object key(s), including `clutter/oakclutt1`, `clutter/oakclutt2`, `clutter/oakclutt3`, `clutter/oakclutt4`, `clutter/oakclutt5`, `clutter/birchclutt1`, `clutter/birchclutt2`, and 3 more. 4 decorator rule(s) using `minecraft:wither_rose`, `minecraft:oxeye_daisy`, `minecraft:pink_tulip`, `minecraft:lily_of_the_valley`, `minecraft:sunflower`, `minecraft:dandelion`, `minecraft:poppy`, `minecraft:rose_bush`, `minecraft:large_fern`, and 3 more.
- **Underworld 1005:** `minecraft:crimson_forest` identity; surface 1 block(s): `minecraft:crimson_nylium`; 1 block(s): `minecraft:netherrack`; 1-3 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`; 1 object placement rule(s) drawing from 10 object key(s), including `underworld/crimson/clutter/oakclutt1`, `underworld/crimson/clutter/oakclutt2`, `underworld/crimson/clutter/oakclutt3`, `underworld/crimson/clutter/oakclutt4`, `underworld/crimson/clutter/oakclutt5`, `underworld/crimson/clutter/birchclutt1`, `underworld/crimson/clutter/birchclutt2`, and 3 more. 5 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:crimson_fungus`, `minecraft:nether_sprouts`, `minecraft:crimson_roots`.

## Floating variants

No floating child biomes are declared.


## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome tropical/wilds
/iris what biome
/iris what region
```

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
