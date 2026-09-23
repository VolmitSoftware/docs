---
title: "Biome Atlas — Birch Forest"
description: "Iris biome atlas entry for temperate/birch-forest in Overworld and Underworld"
published: true
date: 2026-09-23T11:12:42.385Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`temperate/birch-forest` is a directly selected land biome in the Overworld and Underworld packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld | `temperate` (Temperate) | 1 | 6 | 0.1667 | 1.02% |
| Underworld | `temperate` (Temperate) | 1 | 6 | 0.1667 | 1.02% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

The terrain generators use `surfaceDetail: 0.5` to smooth small surface variations. See [Generators and noise](/iris/14-generators-noise).

Both packs use the same generator links: `highplains` (5..12), `rare-hills` (0..50); combined authored contribution `5..62` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## 3D terrain

Overworld and Underworld share these `terrain3D` settings. Amplitude, feature scales, and crack dimensions use blocks.
The slope gate uses rise divided by horizontal distance. Strength reaches its configured value at the full slope.

| Biome | Treatment | Amplitude | Horizontal / vertical scale | Crack depth / width / scale | Slope start / full | Density noise / Crack noise |
|---|---|---:|---|---|---|---|
| `temperate/birch-forest` | Forest | 30 | 280 / 36 | None | 0.2 / 0.55 | `PERLIN` / None |
| `temperate/birch-forest-extended` | Forest | 30 | 280 / 36 | None | 0.2 / 0.55 | `PERLIN` / None |
| `temperate/golden-poplar-grove` | Forest | 30 | 280 / 36 | None | 0.2 / 0.55 | `PERLIN` / None |

The table lists each profile’s density and crack noise. Active deformation starts above fluid level plus 8 blocks and fades across 24 blocks of base elevation.
Each pack retains its own materials, decoration, objects, and ores. Floating islands keep their separate shape settings.

## Overworld treatment

- **Minecraft identity:** derivative `minecraft:birch_forest`; native-structure derivative `minecraft:birch_forest`; no custom or scatter identities.
- **Surface:** 1 block(s): `minecraft:grass_block`, `minecraft:gravel`; 1 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 6 object placement rule(s) drawing from 27 object key(s), including `clutter/bincluster1`, `clutter/camp1`, `trees/birch/antioch3`, `trees/birch/antioch4`, `trees/birch/antioch5`, `trees/birch/antioch6`, `trees/birch/antioch7`, and 20 more. 5 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:allium`, `minecraft:poppy`, `minecraft:dandelion`, `minecraft:azure_bluet`, `minecraft:pink_tulip`, `minecraft:cornflower`, `minecraft:lily_of_the_valley`, `minecraft:short_grass`, `minecraft:tall_grass`.

## Underworld treatment

- **Minecraft identity:** derivative `minecraft:nether_wastes`; native-structure derivative `minecraft:nether_wastes`; custom identities `underworld_temperate_birch_forest_020baae5`.
- **Surface:** 1 block(s): `minecraft:netherrack`, `minecraft:gravel`; 1 block(s): `minecraft:netherrack`; 1-3 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`.
- **Content:** 6 object placement rule(s) drawing from 27 object key(s), including `underworld/wastes/clutter/bincluster1`, `underworld/wastes/clutter/camp1`, `underworld/wastes/trees/birch/antioch3`, `underworld/wastes/trees/birch/antioch4`, `underworld/wastes/trees/birch/antioch5`, `underworld/wastes/trees/birch/antioch6`, `underworld/wastes/trees/birch/antioch7`, and 20 more. 6 decorator rule(s) (3 shared snippet reference(s)) using `minecraft:nether_sprouts`, `minecraft:crimson_fungus`, `minecraft:fire`.
- **Entity spawners:** `nether/surface/nether-wastes`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

Children that are also direct land roots have their own atlas pages: [`temperate/birch-thin`](/iris/biomes/temperate/birch-thin).

### Birch Forest (`temperate/birch-forest-extended`)

This child-only biome is selected from `temperate/birch-forest`, not from a region list. Its rarity is `3`.
In that immediate child choice it contributes `4` of `12` slots (33.33%); later child hops are resolved separately.

**Shared terrain:** `mountain` (5..12), `rare-hills` (43..71); combined authored contribution `48..83` blocks relative to fluid height.

- **Overworld:** `minecraft:birch_forest` identity; surface 1 block(s): `minecraft:grass_block`, `minecraft:gravel`; 1 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`; 6 object placement rule(s) drawing from 27 object key(s), including `clutter/bincluster1`, `clutter/camp1`, `trees/birch/antioch3`, `trees/birch/antioch4`, `trees/birch/antioch5`, `trees/birch/antioch6`, `trees/birch/antioch7`, and 20 more. 5 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:allium`, `minecraft:poppy`, `minecraft:dandelion`, `minecraft:azure_bluet`, `minecraft:pink_tulip`, `minecraft:cornflower`, `minecraft:lily_of_the_valley`, `minecraft:short_grass`, `minecraft:tall_grass`.
- **Underworld:** `minecraft:nether_wastes` identity; surface 1 block(s): `minecraft:netherrack`, `minecraft:gravel`; 1 block(s): `minecraft:netherrack`; 1-3 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`; 6 object placement rule(s) drawing from 27 object key(s), including `underworld/wastes/clutter/bincluster1`, `underworld/wastes/clutter/camp1`, `underworld/wastes/trees/birch/antioch3`, `underworld/wastes/trees/birch/antioch4`, `underworld/wastes/trees/birch/antioch5`, `underworld/wastes/trees/birch/antioch6`, `underworld/wastes/trees/birch/antioch7`, and 20 more. 6 decorator rule(s) (3 shared snippet reference(s)) using `minecraft:nether_sprouts`, `minecraft:crimson_fungus`, `minecraft:fire`.

Direct-root children continue on their own pages: [`temperate/birch-thin`](/iris/biomes/temperate/birch-thin).

### Golden Poplar Grove

`temperate/golden-poplar-grove` is a complete child biome introduced in Overworld and Underworld. Its Underworld display name is **Crimson Spire Grove**. The existing `temperate/birch-forest` region memberships make it naturally reachable.

Its rarity is `3`. In the immediate parent selection it receives `4` of `12` slots (33.33%). Both packs retain the same child-list order and use a shrink factor of `1.5`. These weights describe selection slots, not a guaranteed percentage of terrain area.

**Shared terrain:** `highplains` (5..12), `rare-hills` (0..50), relative to fluid height. The 3D profile uses amplitude `30`, horizontal scale `280`, vertical scale `36`, and `PERLIN` density noise. Crack depth is `0`. The slope gate starts at `0.2` and fades across `0.35`. Terrain, layer thicknesses, and selection settings match between packs.

**Overworld:** surface materials are `minecraft:grass_block`, `minecraft:coarse_dirt`, `minecraft:podzol`. Ground cover includes `minecraft:leaf_litter`, `minecraft:red_shrub`, `minecraft:fern`, `minecraft:short_grass`, `minecraft:dandelion`, `minecraft:oxeye_daisy`, `minecraft:azure_bluet`, `minecraft:brown_mushroom`, `minecraft:red_mushroom`. The custom identity is `temperate_golden_poplar_grove`, with temperature `0.7` and humidity `0.65`. The `minecraft:birch_forest` derivative supplies native ecology, and `minecraft:birch_forest` governs native structure biome matching.

**Underworld:** surface materials are `minecraft:crimson_nylium`, `minecraft:netherrack`, `minecraft:gravel`. Ground cover includes `minecraft:crimson_roots`, `minecraft:crimson_fungus`, `minecraft:warped_fungus`. Its custom identity is `underworld_temperate_golden_poplar_grove`, with `minecraft:nether_wastes` as both derivatives. It has temperature `2`, humidity `0`, no precipitation, and `minecraft:ash` particles. Spawners are `nether/surface/nether-wastes`, `nether/cave`.

Both files contain their object placements, procedural trees, and decorators directly. Authored living trees mix young, mature, leaning, forked, and broken forms. Four procedural definitions provide young, mature, leaning, and forked forms, each with 16 seeded variants. Shelf mushrooms decorate Overworld trunks. Shroomlights occupy corresponding positions in Underworld.

| Placement group | Chance | Density |
|-----------------|-------:|--------:|
| Authored living trees | 0.8 | 2 |
| Fallen trunks | 0.08 | 1 |
| Stumps | 0.07 | 1 |
| Rock clutter | 0.07 | 1 |
| Procedural young | 0.15 | 1 |
| Procedural mature | 0.28 | 1 |
| Procedural leaning | 0.12 | 1 |
| Procedural forked | 0.1 | 1 |

Living-tree settings total `2.25` nominal attempts per chunk before biome coverage, terrain support, and placement rejection. Both packs use the same settings. Roots, support checks, and quarter-turn rotations apply to tree placement. Stilt settings exclude wart canopies and accents.

```text
/iris find biome temperate/golden-poplar-grove
```

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome temperate/birch-forest
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
