---
title: "Biome Atlas — Tundra Autumn"
description: "Iris biome atlas entry for tundra/autumn in Overworld 4007 and Underworld 1010"
published: true
date: 2026-09-08T23:35:09.010Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`tundra/autumn` is a directly selected land biome in the current Overworld 4007 and Underworld 1010 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4007 | `forests` (Forests) | 1 | 1 | 1 | 11.46% |
| Overworld 4007 | `tundra` (Tundra) | 1 | 1 | 1 | 6.12% |
| Underworld 1010 | `forests` (Underworld Forests) | 1 | 1 | 1 | 11.46% |
| Underworld 1010 | `tundra` (Underworld Tundra) | 1 | 1 | 1 | 6.12% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `smooth-dunes` (48..86); combined authored contribution `48..86` blocks relative to fluid height.

Biome identity scatter uses `STATIC` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## 3D terrain

Overworld 4007 and Underworld 1010 share these `terrain3D` settings. Amplitude, feature scales, and crack dimensions use blocks.
The slope gate uses rise divided by horizontal distance. Strength reaches its configured value at the full slope.

| Biome | Treatment | Amplitude | Horizontal / vertical scale | Crack depth / width / scale | Slope start / full | Density noise / Crack noise |
|---|---|---:|---|---|---|---|
| `tundra/autumn` | Forest | 30 | 280 / 36 | None | 0.2 / 0.55 | `PERLIN` / None |
| `tundra/autumn-extended` | Hills | 22 | 256 / 30 | None | 0.18 / 0.5 | `PERLIN` / None |
| `tundra/redwood-extended-cliffs` | Cliff | 56 | 224 / 30 | 14 / 2.25 / 336 | 0.12 / 0.4 | `IRIS_HALF` / `SIMPLEX` |

The table lists each profile’s density and crack noise. Active deformation starts above fluid level plus 8 blocks and fades across 24 blocks of base elevation.
Each pack retains its own materials, decoration, objects, and ores. Floating islands keep their separate shape settings.

## Overworld 4007 treatment

- **Minecraft identity:** derivative `minecraft:taiga`; native-structure derivative `minecraft:dark_forest`; custom identities `tundra_autumn_red`, `tundra_autumn_orange`, `tundra_autumn_yellow`.
- **Surface:** 1 block(s): `minecraft:coarse_dirt`, `minecraft:grass_block`, `minecraft:podzol`; 2 block(s): `minecraft:dirt`; 1 block(s): `minecraft:dirt`, `minecraft:stone`. Wall palette: `minecraft:diorite`, `minecraft:stone`.
- **Content:** 10 object placement rule(s) drawing from 53 object key(s), including `clutter/boulder1`, `clutter/boulder2`, `clutter/boulder3`, `clutter/boulder4`, `clutter/boulder5`, `clutter/boulder6`, `clutter/boulder7`, and 46 more. 10 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:white_tulip`, `minecraft:cornflower`, `minecraft:blue_orchid`, `minecraft:lily_of_the_valley`, `minecraft:sweet_berry_bush`, `minecraft:tall_grass`, `minecraft:short_grass`, `minecraft:fern`, `minecraft:brown_mushroom`, and 3 more.

## Underworld 1010 treatment

- **Minecraft identity:** derivative `minecraft:soul_sand_valley`; native-structure derivative `minecraft:soul_sand_valley`; custom identities `underworld_tundra_autumn_58e71fce`.
- **Surface:** 1 block(s): `minecraft:soul_soil`; 2 block(s): `minecraft:soul_soil`; 1 block(s): `minecraft:soul_soil`, `minecraft:basalt`. Wall palette: `minecraft:quartz_block`, `minecraft:basalt`.
- **Content:** 10 object placement rule(s) drawing from 53 object key(s), including `underworld/soul/clutter/boulder1`, `underworld/soul/clutter/boulder2`, `underworld/soul/clutter/boulder3`, `underworld/soul/clutter/boulder4`, `underworld/soul/clutter/boulder5`, `underworld/soul/clutter/boulder6`, `underworld/soul/clutter/boulder7`, and 46 more. 11 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:soul_fire`, `minecraft:crimson_roots`, `minecraft:nether_sprouts`, `minecraft:warped_fungus`, `minecraft:blackstone_slab`.
- **Entity spawners:** `nether/surface/soul-sand-valley`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

### Tundra Redwood Cliffs (`tundra/redwood-extended-cliffs`)

This child-only biome is selected from `tundra/autumn`, not from a region list. Its rarity is `3`.
In that immediate child choice it contributes `1` of `7` slots (14.29%); later child hops are resolved separately.

**Shared terrain:** `smooth-dunes` (97..132), `mountain` (8..14); combined authored contribution `105..146` blocks relative to fluid height.

- **Overworld 4007:** `minecraft:taiga` identity; surface 1 block(s): `minecraft:coarse_dirt`, `minecraft:grass_block`, `minecraft:podzol`; 2 block(s): `minecraft:dirt`; 1 block(s): `minecraft:dirt`, `minecraft:stone`; 10 object placement rule(s) drawing from 59 object key(s), including `clutter/boulder1`, `clutter/boulder2`, `clutter/boulder3`, `clutter/boulder4`, `clutter/boulder5`, `clutter/boulder6`, `clutter/boulder7`, and 52 more. 10 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:white_tulip`, `minecraft:cornflower`, `minecraft:blue_orchid`, `minecraft:lily_of_the_valley`, `minecraft:sweet_berry_bush`, `minecraft:tall_grass`, `minecraft:short_grass`, `minecraft:fern`, `minecraft:brown_mushroom`, and 3 more.
- **Underworld 1010:** `minecraft:soul_sand_valley` identity; surface 1 block(s): `minecraft:soul_soil`; 2 block(s): `minecraft:soul_soil`; 1 block(s): `minecraft:soul_soil`, `minecraft:basalt`; 10 object placement rule(s) drawing from 59 object key(s), including `underworld/soul/clutter/boulder1`, `underworld/soul/clutter/boulder2`, `underworld/soul/clutter/boulder3`, `underworld/soul/clutter/boulder4`, `underworld/soul/clutter/boulder5`, `underworld/soul/clutter/boulder6`, `underworld/soul/clutter/boulder7`, and 52 more. 11 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:soul_fire`, `minecraft:crimson_roots`, `minecraft:nether_sprouts`, `minecraft:warped_fungus`, `minecraft:blackstone_slab`.

### Tundra Autumn (`tundra/autumn-extended`)

This child-only biome is selected from `tundra/autumn`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `3` of `7` slots (42.86%); later child hops are resolved separately.

**Shared terrain:** `smooth-dunes` (34..42); combined authored contribution `34..42` blocks relative to fluid height.

- **Overworld 4007:** `minecraft:taiga` identity; surface 1 block(s): `minecraft:coarse_dirt`, `minecraft:grass_block`, `minecraft:podzol`; 2 block(s): `minecraft:dirt`; 1 block(s): `minecraft:dirt`, `minecraft:stone`; 10 object placement rule(s) drawing from 53 object key(s), including `clutter/boulder1`, `clutter/boulder2`, `clutter/boulder3`, `clutter/boulder4`, `clutter/boulder5`, `clutter/boulder6`, `clutter/boulder7`, and 46 more. 10 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:white_tulip`, `minecraft:cornflower`, `minecraft:blue_orchid`, `minecraft:lily_of_the_valley`, `minecraft:sweet_berry_bush`, `minecraft:tall_grass`, `minecraft:short_grass`, `minecraft:fern`, `minecraft:brown_mushroom`, and 3 more.
- **Underworld 1010:** `minecraft:soul_sand_valley` identity; surface 1 block(s): `minecraft:soul_soil`; 2 block(s): `minecraft:soul_soil`; 1 block(s): `minecraft:soul_soil`, `minecraft:basalt`; 10 object placement rule(s) drawing from 53 object key(s), including `underworld/soul/clutter/boulder1`, `underworld/soul/clutter/boulder2`, `underworld/soul/clutter/boulder3`, `underworld/soul/clutter/boulder4`, `underworld/soul/clutter/boulder5`, `underworld/soul/clutter/boulder6`, `underworld/soul/clutter/boulder7`, and 46 more. 11 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:soul_fire`, `minecraft:crimson_roots`, `minecraft:nether_sprouts`, `minecraft:warped_fungus`, `minecraft:blackstone_slab`.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome tundra/autumn
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
