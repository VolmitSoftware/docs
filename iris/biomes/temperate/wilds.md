---
title: "Biome Atlas — Temperate Wilds"
description: "Iris biome atlas entry for temperate/wilds in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`temperate/wilds` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `temperate` (Temperate) | 1 | 1 | 1 | 6.15% |
| Underworld 1005 | `temperate` (Underworld Temperate) | 1 | 1 | 1 | 6.15% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `plain` (4..7); combined authored contribution `4..7` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:plains`; native-structure derivative `minecraft:plains`; custom identities `wilds`.
- **Surface:** 1 block(s): `minecraft:grass_block`; 1 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 4 object placement rule(s) drawing from 18 object key(s), including `clutter/oakshrub1`, `clutter/oakshrub2`, `clutter/oakshrub3`, `clutter/obelisk1`, `clutter/obelisk2`, `clutter/obelisk3`, `clutter/obelisk4`, and 11 more. 8 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:tall_grass`, `minecraft:short_grass`, `minecraft:fern`, `minecraft:oxeye_daisy`, `minecraft:pink_tulip`, `minecraft:lily_of_the_valley`, `minecraft:dandelion`, `minecraft:poppy`, `minecraft:rose_bush`, and 3 more.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:nether_wastes`; native-structure derivative `minecraft:nether_wastes`; custom identities `underworld_temperate_wilds_130639fb`.
- **Surface:** 1 block(s): `minecraft:netherrack`; 1 block(s): `minecraft:netherrack`; 1-3 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`.
- **Content:** 4 object placement rule(s) drawing from 18 object key(s), including `underworld/wastes/clutter/oakshrub1`, `underworld/wastes/clutter/oakshrub2`, `underworld/wastes/clutter/oakshrub3`, `underworld/wastes/clutter/obelisk1`, `underworld/wastes/clutter/obelisk2`, `underworld/wastes/clutter/obelisk3`, `underworld/wastes/clutter/obelisk4`, and 11 more. 9 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:crimson_fungus`, `minecraft:fire`, `minecraft:nether_sprouts`.
- **Entity spawners:** `nether/surface/nether-wastes`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

### Temperate Highlands (`temperate/highlands`)

This child-only biome is selected from `temperate/wilds`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `1` of `3` slots (33.33%); later child hops are resolved separately.

**Shared terrain:** `mountain` (15..20); combined authored contribution `15..20` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:forest` identity; surface 1 block(s): `minecraft:grass_block`, `minecraft:podzol`; 1 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`; 1 object placement rule(s) drawing from 10 object key(s), including `clutter/oakclutt1`, `clutter/oakclutt2`, `clutter/oakclutt3`, `clutter/oakclutt4`, `clutter/oakclutt5`, `clutter/birchclutt1`, `clutter/birchclutt2`, and 3 more. 5 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:wither_rose`, `minecraft:oxeye_daisy`, `minecraft:pink_tulip`, `minecraft:lily_of_the_valley`, `minecraft:sunflower`, `minecraft:dandelion`, `minecraft:poppy`, `minecraft:rose_bush`, `minecraft:large_fern`, and 3 more.
- **Underworld 1005:** `minecraft:nether_wastes` identity; surface 1 block(s): `minecraft:netherrack`; 1 block(s): `minecraft:netherrack`; 1-3 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`; 1 object placement rule(s) drawing from 10 object key(s), including `underworld/wastes/clutter/oakclutt1`, `underworld/wastes/clutter/oakclutt2`, `underworld/wastes/clutter/oakclutt3`, `underworld/wastes/clutter/oakclutt4`, `underworld/wastes/clutter/oakclutt5`, `underworld/wastes/clutter/birchclutt1`, `underworld/wastes/clutter/birchclutt2`, and 3 more. 6 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:crimson_fungus`, `minecraft:fire`, `minecraft:nether_sprouts`.

### Temperate Wilds (`temperate/wilds-extended`)

This child-only biome is selected from `temperate/wilds`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `1` of `3` slots (33.33%); later child hops are resolved separately.

**Shared terrain:** `plain` (24..37); combined authored contribution `24..37` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:plains` identity; surface 1 block(s): `minecraft:grass_block`; 1 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`; 4 object placement rule(s) drawing from 18 object key(s), including `clutter/oakshrub1`, `clutter/oakshrub2`, `clutter/oakshrub3`, `clutter/obelisk1`, `clutter/obelisk2`, `clutter/obelisk3`, `clutter/obelisk4`, and 11 more. 8 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:tall_grass`, `minecraft:short_grass`, `minecraft:fern`, `minecraft:oxeye_daisy`, `minecraft:pink_tulip`, `minecraft:lily_of_the_valley`, `minecraft:dandelion`, `minecraft:poppy`, `minecraft:rose_bush`, and 3 more.
- **Underworld 1005:** `minecraft:nether_wastes` identity; surface 1 block(s): `minecraft:netherrack`; 1 block(s): `minecraft:netherrack`; 1-3 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`; 4 object placement rule(s) drawing from 18 object key(s), including `underworld/wastes/clutter/oakshrub1`, `underworld/wastes/clutter/oakshrub2`, `underworld/wastes/clutter/oakshrub3`, `underworld/wastes/clutter/obelisk1`, `underworld/wastes/clutter/obelisk2`, `underworld/wastes/clutter/obelisk3`, `underworld/wastes/clutter/obelisk4`, and 11 more. 9 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:crimson_fungus`, `minecraft:fire`, `minecraft:nether_sprouts`.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome temperate/wilds
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
