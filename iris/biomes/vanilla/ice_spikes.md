---
title: "Biome Atlas — Ice Spikes"
description: "Iris biome atlas entry for vanilla/ice_spikes in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`vanilla/ice_spikes` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `frozen` (Frozen) | 1 | 1 | 1 | 5.69% |
| Underworld 1005 | `frozen` (Underworld Frozen) | 1 | 1 | 1 | 5.69% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

## Shared terrain

Both packs use the same generator links: `smooth-dunes` (20..30), `mountain` (1..5); combined authored contribution `21..35` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:ice_spikes`; native-structure derivative `minecraft:ice_spikes`; custom identities `ice_spikes`.
- **Surface:** 1 block(s) at slope 0-3.3: `minecraft:snow_block`; 3 block(s) at slope 0-3: `minecraft:dirt`; 3 block(s) at slope 0-3: `minecraft:dirt`, `minecraft:stone`. Wall palette: `minecraft:stone`, `minecraft:andesite`, `minecraft:gravel`, `minecraft:cyan_terracotta`.
- **Content:** 2 object placement rule(s) drawing from 25 object key(s), including `clutter/sbush1`, `clutter/sbush2`, `clutter/sbush3`, `clutter/stone1`, `clutter/stone2`, `clutter/stone3`, `clutter/stone4`, and 18 more. 4 decorator rule(s) using `minecraft:dandelion`, `minecraft:poppy`, `minecraft:blue_orchid`, `minecraft:allium`, `minecraft:azure_bluet`, `minecraft:red_tulip`, `minecraft:orange_tulip`, `minecraft:white_tulip`, `minecraft:pink_tulip`, and 6 more.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:soul_sand_valley`; native-structure derivative `minecraft:soul_sand_valley`; custom identities `underworld_vanilla_ice_spikes_f6daedb4`.
- **Surface:** 1 block(s) at slope 0-3.3: `minecraft:soul_soil`; 3 block(s) at slope 0-3: `minecraft:soul_soil`; 3 block(s) at slope 0-3: `minecraft:soul_soil`, `minecraft:basalt`. Wall palette: `minecraft:basalt`, `minecraft:soul_sand`, `minecraft:warped_nylium`.
- **Content:** 2 object placement rule(s) drawing from 25 object key(s), including `underworld/soul/clutter/sbush1`, `underworld/soul/clutter/sbush2`, `underworld/soul/clutter/sbush3`, `underworld/soul/clutter/stone1`, `underworld/soul/clutter/stone2`, `underworld/soul/clutter/stone3`, `underworld/soul/clutter/stone4`, and 18 more. 5 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:nether_sprouts`, `minecraft:crimson_roots`, `minecraft:soul_fire`.
- **Entity spawners:** `nether/surface/soul-sand-valley`, `nether/cave`.

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

## Children

### Mountain Forest (`frozen/fields/mountain-spruce-frosty`)

This child-only biome is selected from `vanilla/ice_spikes`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `1` of `2` slots (50.00%); later child hops are resolved separately.

**Shared terrain:** `smooth-dunes` (20..30), `mountain` (1..5); combined authored contribution `21..35` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:snowy_plains` identity; surface 1 block(s) at slope 0-3.3: `minecraft:grass_block`, `minecraft:snow_block`; 3 block(s) at slope 0-3: `minecraft:dirt`; 3 block(s) at slope 0-3: `minecraft:dirt`, `minecraft:stone`; 5 object placement rule(s) drawing from 39 object key(s), including `clutter/camp1`, `clutter/camp2`, `clutter/camp3`, `clutter/camp4`, `clutter/camp5`, `clutter/sbush1`, `clutter/sbush2`, and 32 more. 10 decorator rule(s) using `minecraft:white_tulip`, `minecraft:cornflower`, `minecraft:blue_orchid`, `minecraft:lily_of_the_valley`, `minecraft:sweet_berry_bush`, `minecraft:snow`, `minecraft:stone_button`, `minecraft:tall_grass`, `minecraft:short_grass`, and 3 more.
- **Underworld 1005:** `minecraft:basalt_deltas` identity; surface 1 block(s) at slope 0-3.3: `minecraft:basalt`, `minecraft:blackstone`; 3 block(s) at slope 0-3: `minecraft:blackstone`; 3 block(s) at slope 0-3: `minecraft:blackstone`; 5 object placement rule(s) drawing from 39 object key(s), including `underworld/basalt/clutter/camp1`, `underworld/basalt/clutter/camp2`, `underworld/basalt/clutter/camp3`, `underworld/basalt/clutter/camp4`, `underworld/basalt/clutter/camp5`, `underworld/basalt/clutter/sbush1`, `underworld/basalt/clutter/sbush2`, and 32 more. 11 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:fire`, `minecraft:nether_sprouts`, `minecraft:blackstone`, `minecraft:polished_blackstone_button`, `minecraft:crimson_fungus`, `minecraft:blackstone_slab`.

### Mountain Forest (`frozen/fields/mountain-spruce-frosty-extended`)

This child-only biome is selected from `frozen/fields/mountain-spruce-frosty`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `1` of `2` slots (50.00%); later child hops are resolved separately.

**Shared terrain:** `smooth-dunes` (50..70), `mountain` (1..5); combined authored contribution `51..75` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:snowy_plains` identity; surface 1 block(s) at slope 0-3.3: `minecraft:grass_block`, `minecraft:snow_block`; 3 block(s) at slope 0-3: `minecraft:dirt`; 3 block(s) at slope 0-3: `minecraft:dirt`, `minecraft:stone`; 5 object placement rule(s) drawing from 39 object key(s), including `clutter/camp1`, `clutter/camp2`, `clutter/camp3`, `clutter/camp4`, `clutter/camp5`, `clutter/sbush1`, `clutter/sbush2`, and 32 more. 10 decorator rule(s) using `minecraft:white_tulip`, `minecraft:cornflower`, `minecraft:blue_orchid`, `minecraft:lily_of_the_valley`, `minecraft:sweet_berry_bush`, `minecraft:snow`, `minecraft:stone_button`, `minecraft:tall_grass`, `minecraft:short_grass`, and 3 more.
- **Underworld 1005:** `minecraft:basalt_deltas` identity; surface 1 block(s) at slope 0-3.3: `minecraft:basalt`, `minecraft:blackstone`; 3 block(s) at slope 0-3: `minecraft:blackstone`; 3 block(s) at slope 0-3: `minecraft:blackstone`; 5 object placement rule(s) drawing from 39 object key(s), including `underworld/basalt/clutter/camp1`, `underworld/basalt/clutter/camp2`, `underworld/basalt/clutter/camp3`, `underworld/basalt/clutter/camp4`, `underworld/basalt/clutter/camp5`, `underworld/basalt/clutter/sbush1`, `underworld/basalt/clutter/sbush2`, and 32 more. 11 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:fire`, `minecraft:nether_sprouts`, `minecraft:blackstone`, `minecraft:polished_blackstone_button`, `minecraft:crimson_fungus`, `minecraft:blackstone_slab`.

## Floating variants

No floating child biomes are declared.


## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome vanilla/ice_spikes
/iris what biome
/iris what region
```

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
