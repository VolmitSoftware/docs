---
title: "Biome Atlas — Tundra Taiga"
description: "Iris biome atlas entry for tundra/taiga in Overworld and Underworld"
published: true
date: 2026-09-23T11:12:42.385Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`tundra/taiga` is a directly selected land biome in the Overworld and Underworld packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld | `tundra` (Tundra) | 1 | 1 | 1 | 6.12% |
| Underworld | `tundra` (Tundra) | 1 | 1 | 1 | 6.12% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

The terrain generators use `surfaceDetail: 0.5` to smooth small surface variations. See [Generators and noise](/iris/14-generators-noise).

Both packs use the same generator links: `plain` (34..42); combined authored contribution `34..42` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## 3D terrain

Overworld and Underworld share these `terrain3D` settings. Amplitude, feature scales, and crack dimensions use blocks.
The slope gate uses rise divided by horizontal distance. Strength reaches its configured value at the full slope.

| Biome | Treatment | Amplitude | Horizontal / vertical scale | Crack depth / width / scale | Slope start / full | Density noise / Crack noise |
|---|---|---:|---|---|---|---|
| `tundra/taiga` | Hills | 22 | 256 / 30 | None | 0.18 / 0.50 | `PERLIN` / None |
| `tundra/russet-poplar-woods` | Hills | 22 | 256 / 30 | None | 0.18 / 0.50 | `PERLIN` / None |

The table lists each profile’s density and crack noise. Active deformation starts above fluid level plus 8 blocks and fades across 24 blocks of base elevation.
Each pack retains its own materials, decoration, objects, and ores. Floating islands keep their separate shape settings.

## Overworld treatment

- **Minecraft identity:** derivative `minecraft:old_growth_spruce_taiga`; native-structure derivative `minecraft:taiga`; custom identities `tundra_taiga`.
- **Surface:** 1 block(s): `minecraft:grass_block`; 2-4 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 6 object placement rule(s) drawing from 35 object key(s), including `clutter/grave1`, `clutter/stoneclutt1`, `clutter/stoneclutt2`, `clutter/stoneclutt3`, `clutter/stoneclutt4`, `clutter/stoneclutt5`, `clutter/stoneclutt6`, and 28 more. 7 decorator rule(s) using `minecraft:white_tulip`, `minecraft:blue_orchid`, `minecraft:short_grass`, `minecraft:poppy`, `minecraft:sweet_berry_bush`, `minecraft:wither_rose`, `minecraft:oxeye_daisy`, `minecraft:pink_tulip`, `minecraft:large_fern`, and 2 more.

## Underworld treatment

- **Minecraft identity:** derivative `minecraft:soul_sand_valley`; native-structure derivative `minecraft:soul_sand_valley`; custom identities `underworld_tundra_taiga_f3883e8a`.
- **Surface:** 1 block(s): `minecraft:soul_soil`; 2-4 block(s): `minecraft:soul_soil`; 6-18 block(s): `minecraft:basalt`. Wall palette: `minecraft:basalt`.
- **Content:** 6 object placement rule(s) drawing from 35 object key(s), including `underworld/soul/clutter/grave1`, `underworld/soul/clutter/stoneclutt1`, `underworld/soul/clutter/stoneclutt2`, `underworld/soul/clutter/stoneclutt3`, `underworld/soul/clutter/stoneclutt4`, `underworld/soul/clutter/stoneclutt5`, `underworld/soul/clutter/stoneclutt6`, and 28 more. 8 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:soul_fire`, `minecraft:crimson_roots`, `minecraft:nether_sprouts`.
- **Entity spawners:** `nether/surface/soul-sand-valley`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

### Russet Poplar Woods

`tundra/russet-poplar-woods` is a complete child biome introduced in Overworld and Underworld. Its Underworld display name is **Sallow Hyphae Woods**. The existing `tundra/taiga` region memberships make it naturally reachable.

Its rarity is `3`. In the immediate parent selection it receives `1` of `4` slots (25.00%). Both packs retain the same child-list order and use a shrink factor of `2.4`. These weights describe selection slots, not a guaranteed percentage of terrain area.

**Shared terrain:** `plain` (34..42), relative to fluid height. The 3D profile uses amplitude `22`, horizontal scale `256`, vertical scale `30`, and `PERLIN` density noise. Crack depth is `0`. The slope gate starts at `0.18` and fades across `0.32`. Terrain, layer thicknesses, and selection settings match between packs.

**Overworld:** surface materials are `minecraft:grass_block`, `minecraft:coarse_dirt`, `minecraft:podzol`. Ground cover includes `minecraft:leaf_litter`, `minecraft:red_shrub`, `minecraft:fern`, `minecraft:short_grass`, `minecraft:lily_of_the_valley`, `minecraft:cornflower`, `minecraft:brown_mushroom`, `minecraft:red_mushroom`. The custom identity is `tundra_russet_poplar_woods`, with temperature `0.45` and humidity `0.65`. The `minecraft:old_growth_spruce_taiga` derivative supplies native ecology, and `minecraft:taiga` governs native structure biome matching.

**Underworld:** surface materials are `minecraft:soul_soil`, `minecraft:soul_sand`, `minecraft:warped_nylium`. Ground cover includes `minecraft:crimson_roots`, `minecraft:warped_roots`, `minecraft:warped_fungus`, `minecraft:nether_sprouts`, `minecraft:soul_fire`. Its custom identity is `underworld_tundra_russet_poplar_woods`, with `minecraft:soul_sand_valley` as both derivatives. It has temperature `2`, humidity `0`, no precipitation, and `minecraft:white_ash` particles. Spawners are `nether/surface/soul-sand-valley`, `nether/cave`.

Both files contain their object placements, procedural trees, and decorators directly. Authored living trees mix young, mature, leaning, forked, and broken forms. Four procedural definitions provide young, mature, leaning, and forked forms, each with 16 seeded variants. Shelf mushrooms decorate Overworld trunks. Shroomlights occupy corresponding positions in Underworld.

| Placement group | Chance | Density |
|-----------------|-------:|--------:|
| Authored living trees | 0.9 | 2 |
| Fallen trunks | 0.11 | 1 |
| Stumps | 0.07 | 1 |
| Rock clutter | 0.14 | 1 |
| Procedural young | 0.12 | 1 |
| Procedural mature | 0.3 | 1 |
| Procedural leaning | 0.15 | 1 |
| Procedural forked | 0.08 | 1 |

Living-tree settings total `2.45` nominal attempts per chunk before biome coverage, terrain support, and placement rejection. Both packs use the same settings. Roots, support checks, and quarter-turn rotations apply to tree placement. Stilt settings exclude wart canopies and accents.

```text
/iris find biome tundra/russet-poplar-woods
```

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
