---
title: "Biome Atlas — Emberbark Woods"
description: "Iris biome atlas entry for estranged/emberbark-woods in Overworld 4011 and Underworld 1013"
published: true
date: 2026-09-20T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`estranged/emberbark-woods` is a directly selected land biome in the current Overworld 4011 and Underworld 1013 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

Estranged cave decoration includes Frostspar with three to five tapered shards, each five to nine blocks long, on continuous organic supports. Overworld uses solid quartz and calcite. Underworld retains its separate base and crying-obsidian tips.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4011 | `estranged` (Estranged) | 1 | 3 | 0.3333 | 7.04% |
| Underworld 1013 | `estranged` (Estranged) | 1 | 3 | 0.3333 | 7.04% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

The referenced terrain generators retain 50% of their detail between six-block grid anchors through `surfaceDetail: 0.5`. Anchor heights, biome height ranges, and large terrain features retain their settings. See [Generators and noise](/iris/14-generators-noise).

Both packs use the same generator links: `smooth-dunes` (5..12), `rare-hills` (0..38); combined authored contribution `5..50` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## 3D terrain

Overworld 4011 and Underworld 1013 share these `terrain3D` settings. Amplitude, feature scales, and crack dimensions use blocks.
The slope gate uses rise divided by horizontal distance. Strength reaches its configured value at the full slope.

| Biome | Treatment | Amplitude | Horizontal / vertical scale | Crack depth / width / scale | Slope start / full | Density noise / Crack noise |
|---|---|---:|---|---|---|---|
| `estranged/emberbark-woods` | Hills | 18 | 160 / 40 | None | 0.28 / 0.68 | `IRIS_HALF` / None |
| `estranged/emberbark-poplar-grove` | Hills | 18 | 160 / 40 | None | 0.28 / 0.68 | `IRIS_HALF` / None |

The table lists each profile’s density and crack noise. Active deformation starts above fluid level plus 8 blocks and fades across 24 blocks of base elevation.
Each pack retains its own materials, decoration, objects, and ores. Floating islands keep their separate shape settings.

## Overworld 4011 treatment

- **Minecraft identity:** derivative `minecraft:forest`; native-structure derivative `minecraft:forest`; custom identities `estranged_emberbark`.
- **Surface:** 1 block(s): `minecraft:grass_block`, `minecraft:coarse_dirt`, `minecraft:podzol`; 2 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:dirt`, `minecraft:stone`. Wall palette: `minecraft:stone`, `minecraft:andesite`, `minecraft:cobblestone`, `minecraft:mossy_cobblestone`.
- **Content:** 5 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:short_grass`, `minecraft:fern`, `minecraft:red_mushroom`. Procedural content: 2 trees (emberbark, emberbark-tall).

## Underworld 1013 treatment

- **Minecraft identity:** derivative `minecraft:warped_forest`; native-structure derivative `minecraft:warped_forest`; custom identities `underworld_estranged_emberbark_woods_0131e3ea`.
- **Surface:** 1 block(s): `minecraft:warped_nylium`, `minecraft:netherrack`; 2 block(s): `minecraft:netherrack`; 1-3 block(s): `minecraft:netherrack`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`, `minecraft:blackstone`.
- **Content:** 6 decorator rule(s) (3 shared snippet reference(s)) using `minecraft:nether_sprouts`, `minecraft:warped_fungus`. Procedural content: 2 trees (emberbark, emberbark-tall).
- **Entity spawners:** `nether/surface/warped-forest`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

### Emberbark Poplar Grove

`estranged/emberbark-poplar-grove` is a complete child biome introduced in Overworld 4011 and Underworld 1013. Its Underworld display name is **Warpedcap Hyphae Grove**. The existing `estranged/emberbark-woods` region memberships make it naturally reachable.

Its rarity is `3`. In the immediate parent selection it receives `1` of `2` slots (50.00%). Both packs retain the same child-list order and use a shrink factor of `2`. These weights describe selection slots, not a guaranteed percentage of terrain area.

**Shared terrain:** `smooth-dunes` (5..12), `rare-hills` (0..38), relative to fluid height. The 3D profile uses amplitude `18`, horizontal scale `160`, vertical scale `40`, and `IRIS_HALF` density noise. Crack depth is `0`. The slope gate starts at `0.28` and fades across `0.4`. Terrain, layer thicknesses, and selection settings match between packs.

**Overworld:** surface materials are `minecraft:grass_block`, `minecraft:coarse_dirt`, `minecraft:podzol`. Ground cover includes `minecraft:leaf_litter`, `minecraft:red_shrub`, `minecraft:fern`, `minecraft:short_grass`, `minecraft:poppy`, `minecraft:allium`, `minecraft:brown_mushroom`, `minecraft:red_mushroom`. The custom identity is `estranged_emberbark_poplar_grove`, with temperature `0.8` and humidity `0.7`. The `minecraft:forest` derivative supplies native ecology, and `minecraft:forest` governs native structure biome matching.

**Underworld:** surface materials are `minecraft:warped_nylium`, `minecraft:netherrack`. Ground cover includes `minecraft:warped_roots`, `minecraft:nether_sprouts`, `minecraft:warped_fungus`, `minecraft:crimson_fungus`. Its custom identity is `underworld_estranged_emberbark_poplar_grove`, with `minecraft:warped_forest` as both derivatives. It has temperature `2`, humidity `0`, no precipitation, and `minecraft:warped_spore` particles. Spawners are `nether/surface/warped-forest`, `nether/cave`.

Both files contain their object placements, procedural trees, and decorators directly. Authored living trees mix young, mature, leaning, forked, and broken forms. Four procedural definitions provide young, mature, leaning, and forked forms, each with 16 seeded variants. Shelf mushrooms decorate Overworld trunks. Shroomlights occupy corresponding positions in Underworld.

| Placement group | Chance | Density |
|-----------------|-------:|--------:|
| Authored living trees | 0.95 | 3 |
| Fallen trunks | 0.08 | 1 |
| Stumps | 0.07 | 1 |
| Rock clutter | 0.09 | 1 |
| Procedural young | 0.18 | 1 |
| Procedural mature | 0.42 | 1 |
| Procedural leaning | 0.22 | 1 |
| Procedural forked | 0.18 | 1 |

Living-tree settings total `3.85` nominal attempts per chunk before biome coverage, terrain support, and placement rejection. Both packs use the same settings. Roots, support checks, and quarter-turn rotations apply to tree placement. Stilt settings exclude wart canopies and accents.

```text
/iris find biome estranged/emberbark-poplar-grove
```

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome estranged/emberbark-woods
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
