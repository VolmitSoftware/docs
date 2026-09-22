---
title: "Biome Atlas — Tundra Autumn"
description: "Iris biome atlas entry for tundra/autumn in Overworld 4011 and Underworld 1013"
published: true
date: 2026-09-20T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`tundra/autumn` is a directly selected land biome in the current Overworld 4011 and Underworld 1013 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4011 | `forests` (Forests) | 1 | 1 | 1 | 11.46% |
| Overworld 4011 | `tundra` (Tundra) | 1 | 1 | 1 | 6.12% |
| Underworld 1013 | `forests` (Forests) | 1 | 1 | 1 | 11.46% |
| Underworld 1013 | `tundra` (Tundra) | 1 | 1 | 1 | 6.12% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

The referenced terrain generators retain 50% of their detail between six-block grid anchors through `surfaceDetail: 0.5`. Anchor heights, biome height ranges, and large terrain features retain their settings. See [Generators and noise](/iris/14-generators-noise).

Both packs use the same generator links: `smooth-dunes` (48..86); combined authored contribution `48..86` blocks relative to fluid height.

Biome identity scatter uses `STATIC` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## 3D terrain

Overworld 4011 and Underworld 1013 share these `terrain3D` settings. Amplitude, feature scales, and crack dimensions use blocks.
The slope gate uses rise divided by horizontal distance. Strength reaches its configured value at the full slope.

| Biome | Treatment | Amplitude | Horizontal / vertical scale | Crack depth / width / scale | Slope start / full | Density noise / Crack noise |
|---|---|---:|---|---|---|---|
| `tundra/autumn` | Forest | 30 | 280 / 36 | None | 0.2 / 0.55 | `PERLIN` / None |
| `tundra/autumn-extended` | Hills | 22 | 256 / 30 | None | 0.18 / 0.5 | `PERLIN` / None |
| `tundra/redwood-extended-cliffs` | Cliff | 56 | 224 / 30 | 14 / 2.25 / 336 | 0.12 / 0.4 | `IRIS_HALF` / `SIMPLEX` |
| `tundra/amber-poplar-forest` | Forest | 30 | 280 / 36 | None | 0.2 / 0.55 | `PERLIN` / None |

The table lists each profile’s density and crack noise. Active deformation starts above fluid level plus 8 blocks and fades across 24 blocks of base elevation.
Each pack retains its own materials, decoration, objects, and ores. Floating islands keep their separate shape settings.

## Overworld 4011 treatment

- **Minecraft identity:** derivative `minecraft:taiga`; native-structure derivative `minecraft:dark_forest`; custom identities `tundra_autumn_red`, `tundra_autumn_orange`, `tundra_autumn_yellow`.
- **Surface:** 1 block(s): `minecraft:coarse_dirt`, `minecraft:grass_block`, `minecraft:podzol`; 2 block(s): `minecraft:dirt`; 1 block(s): `minecraft:dirt`, `minecraft:stone`. Wall palette: `minecraft:diorite`, `minecraft:stone`.
- **Content:** 10 object placement rule(s) drawing from 53 object key(s), including `clutter/boulder1`, `clutter/boulder2`, `clutter/boulder3`, `clutter/boulder4`, `clutter/boulder5`, `clutter/boulder6`, `clutter/boulder7`, and 46 more. 10 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:white_tulip`, `minecraft:cornflower`, `minecraft:blue_orchid`, `minecraft:lily_of_the_valley`, `minecraft:sweet_berry_bush`, `minecraft:tall_grass`, `minecraft:short_grass`, `minecraft:fern`, `minecraft:brown_mushroom`, and 3 more.

## Underworld 1013 treatment

- **Minecraft identity:** derivative `minecraft:soul_sand_valley`; native-structure derivative `minecraft:soul_sand_valley`; custom identities `underworld_tundra_autumn_58e71fce`.
- **Surface:** 1 block(s): `minecraft:soul_soil`; 2 block(s): `minecraft:soul_soil`; 1 block(s): `minecraft:soul_soil`, `minecraft:basalt`. Wall palette: `minecraft:quartz_block`, `minecraft:basalt`.
- **Content:** 10 object placement rule(s) drawing from 53 object key(s), including `underworld/soul/clutter/boulder1`, `underworld/soul/clutter/boulder2`, `underworld/soul/clutter/boulder3`, `underworld/soul/clutter/boulder4`, `underworld/soul/clutter/boulder5`, `underworld/soul/clutter/boulder6`, `underworld/soul/clutter/boulder7`, and 46 more. 11 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:soul_fire`, `minecraft:crimson_roots`, `minecraft:nether_sprouts`, `minecraft:warped_fungus`, `minecraft:blackstone_slab`.
- **Entity spawners:** `nether/surface/soul-sand-valley`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

### Tundra Redwood Cliffs (`tundra/redwood-extended-cliffs`)

This child-only biome is selected from `tundra/autumn`, not from a region list. Its rarity is `3`.
In that immediate child choice it contributes `1` of `8` slots (12.50%); later child hops are resolved separately.

**Shared terrain:** `smooth-dunes` (97..132), `mountain` (8..14); combined authored contribution `105..146` blocks relative to fluid height.

- **Overworld 4011:** `minecraft:taiga` identity; surface 1 block(s): `minecraft:coarse_dirt`, `minecraft:grass_block`, `minecraft:podzol`; 2 block(s): `minecraft:dirt`; 1 block(s): `minecraft:dirt`, `minecraft:stone`; 10 object placement rule(s) drawing from 59 object key(s), including `clutter/boulder1`, `clutter/boulder2`, `clutter/boulder3`, `clutter/boulder4`, `clutter/boulder5`, `clutter/boulder6`, `clutter/boulder7`, and 52 more. 10 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:white_tulip`, `minecraft:cornflower`, `minecraft:blue_orchid`, `minecraft:lily_of_the_valley`, `minecraft:sweet_berry_bush`, `minecraft:tall_grass`, `minecraft:short_grass`, `minecraft:fern`, `minecraft:brown_mushroom`, and 3 more.
- **Underworld 1013:** `minecraft:soul_sand_valley` identity; surface 1 block(s): `minecraft:soul_soil`; 2 block(s): `minecraft:soul_soil`; 1 block(s): `minecraft:soul_soil`, `minecraft:basalt`; 10 object placement rule(s) drawing from 59 object key(s), including `underworld/soul/clutter/boulder1`, `underworld/soul/clutter/boulder2`, `underworld/soul/clutter/boulder3`, `underworld/soul/clutter/boulder4`, `underworld/soul/clutter/boulder5`, `underworld/soul/clutter/boulder6`, `underworld/soul/clutter/boulder7`, and 52 more. 11 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:soul_fire`, `minecraft:crimson_roots`, `minecraft:nether_sprouts`, `minecraft:warped_fungus`, `minecraft:blackstone_slab`.

### Tundra Autumn (`tundra/autumn-extended`)

This child-only biome is selected from `tundra/autumn`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `3` of `8` slots (37.50%); later child hops are resolved separately.

**Shared terrain:** `smooth-dunes` (34..42); combined authored contribution `34..42` blocks relative to fluid height.

- **Overworld 4011:** `minecraft:taiga` identity; surface 1 block(s): `minecraft:coarse_dirt`, `minecraft:grass_block`, `minecraft:podzol`; 2 block(s): `minecraft:dirt`; 1 block(s): `minecraft:dirt`, `minecraft:stone`; 10 object placement rule(s) drawing from 53 object key(s), including `clutter/boulder1`, `clutter/boulder2`, `clutter/boulder3`, `clutter/boulder4`, `clutter/boulder5`, `clutter/boulder6`, `clutter/boulder7`, and 46 more. 10 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:white_tulip`, `minecraft:cornflower`, `minecraft:blue_orchid`, `minecraft:lily_of_the_valley`, `minecraft:sweet_berry_bush`, `minecraft:tall_grass`, `minecraft:short_grass`, `minecraft:fern`, `minecraft:brown_mushroom`, and 3 more.
- **Underworld 1013:** `minecraft:soul_sand_valley` identity; surface 1 block(s): `minecraft:soul_soil`; 2 block(s): `minecraft:soul_soil`; 1 block(s): `minecraft:soul_soil`, `minecraft:basalt`; 10 object placement rule(s) drawing from 53 object key(s), including `underworld/soul/clutter/boulder1`, `underworld/soul/clutter/boulder2`, `underworld/soul/clutter/boulder3`, `underworld/soul/clutter/boulder4`, `underworld/soul/clutter/boulder5`, `underworld/soul/clutter/boulder6`, `underworld/soul/clutter/boulder7`, and 46 more. 11 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:soul_fire`, `minecraft:crimson_roots`, `minecraft:nether_sprouts`, `minecraft:warped_fungus`, `minecraft:blackstone_slab`.

### Amber Poplar Forest

`tundra/amber-poplar-forest` is a complete child biome introduced in Overworld 4011 and Underworld 1013. Its Underworld display name is **Sable Hyphae Forest**. The existing `tundra/autumn` region memberships make it naturally reachable.

Its rarity is `3`. In the immediate parent selection it receives `1` of `8` slots (12.50%). Both packs retain the same child-list order and use a shrink factor of `2.4`. These weights describe selection slots, not a guaranteed percentage of terrain area.

**Shared terrain:** `smooth-dunes` (48..86), relative to fluid height. The 3D profile uses amplitude `30`, horizontal scale `280`, vertical scale `36`, and `PERLIN` density noise. Crack depth is `0`. The slope gate starts at `0.2` and fades across `0.35`. Terrain, layer thicknesses, and selection settings match between packs.

**Overworld:** surface materials are `minecraft:grass_block`, `minecraft:coarse_dirt`, `minecraft:podzol`. Ground cover includes `minecraft:leaf_litter`, `minecraft:red_shrub`, `minecraft:fern`, `minecraft:short_grass`, `minecraft:lily_of_the_valley`, `minecraft:white_tulip`, `minecraft:brown_mushroom`, `minecraft:red_mushroom`. The custom identity is `tundra_amber_poplar_forest`, with temperature `0.6` and humidity `0.55`. The `minecraft:taiga` derivative supplies native ecology, and `minecraft:dark_forest` governs native structure biome matching.

**Underworld:** surface materials are `minecraft:soul_soil`, `minecraft:soul_sand`, `minecraft:warped_nylium`. Ground cover includes `minecraft:crimson_roots`, `minecraft:warped_roots`, `minecraft:warped_fungus`, `minecraft:nether_sprouts`, `minecraft:soul_fire`. Its custom identity is `underworld_tundra_amber_poplar_forest`, with `minecraft:soul_sand_valley` as both derivatives. It has temperature `2`, humidity `0`, no precipitation, and `minecraft:white_ash` particles. Spawners are `nether/surface/soul-sand-valley`, `nether/cave`.

Both files contain their object placements, procedural trees, and decorators directly. Authored living trees mix young, mature, leaning, forked, and broken forms. Four procedural definitions provide young, mature, leaning, and forked forms, each with 16 seeded variants. Shelf mushrooms decorate Overworld trunks. Shroomlights occupy corresponding positions in Underworld.

| Placement group | Chance | Density |
|-----------------|-------:|--------:|
| Authored living trees | 0.95 | 3 |
| Fallen trunks | 0.11 | 1 |
| Stumps | 0.07 | 1 |
| Rock clutter | 0.1 | 1 |
| Procedural young | 0.15 | 1 |
| Procedural mature | 0.4 | 1 |
| Procedural leaning | 0.18 | 1 |
| Procedural forked | 0.12 | 1 |

Living-tree settings total `3.7` nominal attempts per chunk before biome coverage, terrain support, and placement rejection. Both packs use the same settings. Roots, support checks, and quarter-turn rotations apply to tree placement. Stilt settings exclude wart canopies and accents.

```text
/iris find biome tundra/amber-poplar-forest
```

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
