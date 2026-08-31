---
title: "Biome Atlas — Cherry Grove"
description: "Iris biome atlas entry for vanilla/cherry_grove in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`vanilla/cherry_grove` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `temperate` (Temperate) | 1 | 1 | 1 | 6.15% |
| Underworld 1005 | `temperate` (Underworld Temperate) | 1 | 1 | 1 | 6.15% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `magnetics/glass` (-3..16); combined authored contribution `-3..16` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:cherry_grove`; native-structure derivative `minecraft:cherry_grove`; custom identities `cherry_grove`.
- **Surface:** 1 block(s): `minecraft:calcite`, `minecraft:smooth_quartz`; 1-3 block(s): `minecraft:quartz_block`, `minecraft:smooth_quartz`, `minecraft:calcite`; 3-6 block(s): `minecraft:calcite`, `minecraft:andesite`, `minecraft:stone`; 6-16 block(s): `minecraft:stone`, `minecraft:andesite`, `minecraft:calcite`, `minecraft:deepslate`. Wall palette: `minecraft:calcite`, `minecraft:smooth_quartz`, `minecraft:quartz_block`, `minecraft:andesite`.
- **Content:** 2 object placement rule(s) drawing from 10 object key(s), including `clutter/amethyst-cluster1`, `clutter/amethyst-cluster2`, `clutter/amethyst-cluster3`, `clutter/amethyst-cluster4`, `clutter/amethyst-cluster5`, `clutter/stoneboulder1`, `clutter/stoneboulder2`, and 3 more. 1 decorator rule(s) using `minecraft:amethyst_cluster`, `minecraft:small_amethyst_bud`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:soul_sand_valley`; native-structure derivative `minecraft:soul_sand_valley`; custom identities `underworld_vanilla_cherry_grove_bf20030b`.
- **Surface:** 1 block(s): `minecraft:basalt`, `minecraft:smooth_quartz`; 1-3 block(s): `minecraft:quartz_block`, `minecraft:smooth_quartz`, `minecraft:basalt`; 3-6 block(s): `minecraft:basalt`; 6-16 block(s): `minecraft:basalt`. Wall palette: `minecraft:basalt`, `minecraft:smooth_quartz`, `minecraft:quartz_block`.
- **Content:** 2 object placement rule(s) drawing from 10 object key(s), including `underworld/soul/clutter/amethyst-cluster1`, `underworld/soul/clutter/amethyst-cluster2`, `underworld/soul/clutter/amethyst-cluster3`, `underworld/soul/clutter/amethyst-cluster4`, `underworld/soul/clutter/amethyst-cluster5`, `underworld/soul/clutter/stoneboulder1`, `underworld/soul/clutter/stoneboulder2`, and 3 more. 2 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:glowstone`.
- **Entity spawners:** `nether/surface/soul-sand-valley`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

- **Overworld 4002: `magnetics/glass-shard`:** rarity `1`, altitude `125..175` blocks above the surface, top mode `NOISE`, maximum thickness `40`, carving biome `carving/amethyst-child`; decorators inherit and objects do not inherit.
- **Underworld 1005: `magnetics/glass-shard`:** rarity `1`, altitude `125..175` blocks above the surface, top mode `NOISE`, maximum thickness `40`, carving biome `carving/amethyst-child`; decorators inherit and objects do not inherit.

### Magnetics Glass Shard (`magnetics/glass-shard`)

This biome is reached as a floating-island target, not from a region list. Its rarity is `1`.

**Shared terrain:** `plain` (0..8); combined authored contribution `0..8` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:plains` identity; surface 1 block(s): `minecraft:light_blue_stained_glass`; 1-3 block(s): `minecraft:glass`, `minecraft:light_blue_stained_glass`; 3-5 block(s): `minecraft:tinted_glass`, `minecraft:glass`; 5-12 block(s): `minecraft:glass`, `minecraft:light_blue_stained_glass`, `minecraft:tinted_glass`; 1 object placement rule(s) drawing from 5 object key(s), including `clutter/amethyst-cluster1`, `clutter/amethyst-cluster2`, `clutter/amethyst-cluster3`, `clutter/amethyst-cluster4`, `clutter/amethyst-cluster5`. 1 decorator rule(s) using `minecraft:amethyst_cluster`, `minecraft:large_amethyst_bud`, `minecraft:medium_amethyst_bud`, `minecraft:small_amethyst_bud`.
- **Underworld 1005:** `minecraft:basalt_deltas` identity; surface 1 block(s): `minecraft:glowstone`; 1-3 block(s): `minecraft:crying_obsidian`, `minecraft:glowstone`; 3-5 block(s): `minecraft:crying_obsidian`; 5-12 block(s): `minecraft:crying_obsidian`, `minecraft:glowstone`; 1 object placement rule(s) drawing from 5 object key(s), including `underworld/basalt/clutter/amethyst-cluster1`, `underworld/basalt/clutter/amethyst-cluster2`, `underworld/basalt/clutter/amethyst-cluster3`, `underworld/basalt/clutter/amethyst-cluster4`, `underworld/basalt/clutter/amethyst-cluster5`. 2 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:crying_obsidian`.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome vanilla/cherry_grove
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
