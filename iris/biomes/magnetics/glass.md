---
title: "Biome Atlas — Magnetics Glass"
description: "Iris biome atlas entry for magnetics/glass in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`magnetics/glass` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `magnetics` (The Magnetics) | 1 | 1 | 1 | 16.67% |
| Underworld 1005 | `magnetics` (Underworld The Magnetics) | 1 | 1 | 1 | 16.67% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

## Shared terrain

Both packs use the same generator links: `magnetics/glass` (-3..16); combined authored contribution `-3..16` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:meadow`; native-structure derivative `minecraft:meadow`; no custom or scatter identities.
- **Surface:** 1 block(s): `minecraft:calcite`, `minecraft:smooth_quartz`; 1-3 block(s): `minecraft:quartz_block`, `minecraft:smooth_quartz`, `minecraft:calcite`; 3-6 block(s): `minecraft:calcite`, `minecraft:andesite`, `minecraft:stone`; 6-16 block(s): `minecraft:stone`, `minecraft:andesite`, `minecraft:calcite`, `minecraft:deepslate`. Wall palette: `minecraft:calcite`, `minecraft:smooth_quartz`, `minecraft:quartz_block`, `minecraft:andesite`.
- **Content:** 2 object placement rule(s) drawing from 10 object key(s), including `clutter/amethyst-cluster1`, `clutter/amethyst-cluster2`, `clutter/amethyst-cluster3`, `clutter/amethyst-cluster4`, `clutter/amethyst-cluster5`, `clutter/stoneboulder1`, `clutter/stoneboulder2`, and 3 more. 1 decorator rule(s) using `minecraft:amethyst_cluster`, `minecraft:small_amethyst_bud`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:basalt_deltas`; native-structure derivative `minecraft:basalt_deltas`; custom identities `underworld_magnetics_glass_670bb5e0`.
- **Surface:** 1 block(s): `minecraft:blackstone`, `minecraft:smooth_quartz`; 1-3 block(s): `minecraft:quartz_block`, `minecraft:smooth_quartz`, `minecraft:blackstone`; 3-6 block(s): `minecraft:blackstone`, `minecraft:basalt`; 6-16 block(s): `minecraft:blackstone`, `minecraft:basalt`. Wall palette: `minecraft:blackstone`, `minecraft:smooth_quartz`, `minecraft:quartz_block`, `minecraft:basalt`.
- **Content:** 2 object placement rule(s) drawing from 10 object key(s), including `underworld/basalt/clutter/amethyst-cluster1`, `underworld/basalt/clutter/amethyst-cluster2`, `underworld/basalt/clutter/amethyst-cluster3`, `underworld/basalt/clutter/amethyst-cluster4`, `underworld/basalt/clutter/amethyst-cluster5`, `underworld/basalt/clutter/stoneboulder1`, `underworld/basalt/clutter/stoneboulder2`, and 3 more. 2 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:crying_obsidian`.
- **Entity spawners:** `nether/surface/basalt-deltas`, `nether/cave`.

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

- **Overworld 4002 — `magnetics/glass-shard`:** rarity `1`, altitude `125..175` blocks above the surface, top mode `NOISE`, maximum thickness `76`, carving biome `carving/amethyst-child`; decorators inherit and objects do not inherit.
- **Underworld 1005 — `magnetics/glass-shard`:** rarity `1`, altitude `125..175` blocks above the surface, top mode `NOISE`, maximum thickness `76`, carving biome `carving/amethyst-child`; decorators inherit and objects do not inherit.


### Magnetics Glass Shard (`magnetics/glass-shard`)

This biome is reached as a floating-island target, not from a region list. Its rarity is `1`.

**Shared terrain:** `plain` (0..8); combined authored contribution `0..8` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:plains` identity; surface 1 block(s): `minecraft:light_blue_stained_glass`; 1-3 block(s): `minecraft:glass`, `minecraft:light_blue_stained_glass`; 3-5 block(s): `minecraft:tinted_glass`, `minecraft:glass`; 5-12 block(s): `minecraft:glass`, `minecraft:light_blue_stained_glass`, `minecraft:tinted_glass`; 1 object placement rule(s) drawing from 5 object key(s), including `clutter/amethyst-cluster1`, `clutter/amethyst-cluster2`, `clutter/amethyst-cluster3`, `clutter/amethyst-cluster4`, `clutter/amethyst-cluster5`. 1 decorator rule(s) using `minecraft:amethyst_cluster`, `minecraft:large_amethyst_bud`, `minecraft:medium_amethyst_bud`, `minecraft:small_amethyst_bud`.
- **Underworld 1005:** `minecraft:basalt_deltas` identity; surface 1 block(s): `minecraft:glowstone`; 1-3 block(s): `minecraft:crying_obsidian`, `minecraft:glowstone`; 3-5 block(s): `minecraft:crying_obsidian`; 5-12 block(s): `minecraft:crying_obsidian`, `minecraft:glowstone`; 1 object placement rule(s) drawing from 5 object key(s), including `underworld/basalt/clutter/amethyst-cluster1`, `underworld/basalt/clutter/amethyst-cluster2`, `underworld/basalt/clutter/amethyst-cluster3`, `underworld/basalt/clutter/amethyst-cluster4`, `underworld/basalt/clutter/amethyst-cluster5`. 2 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:crying_obsidian`.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome magnetics/glass
/iris what biome
/iris what region
```

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
