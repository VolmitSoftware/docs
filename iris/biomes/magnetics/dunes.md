---
title: "Biome Atlas — Magnetics Dunes"
description: "Iris biome atlas entry for magnetics/dunes in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`magnetics/dunes` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `magnetics` (The Magnetics) | 1 | 1 | 1 | 16.67% |
| Underworld 1005 | `magnetics` (Underworld The Magnetics) | 1 | 1 | 1 | 16.67% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `magnetics/dunes` (-3..18); combined authored contribution `-3..18` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:desert`; native-structure derivative `minecraft:desert`; no custom or scatter identities.
- **Surface:** 1 block(s): `minecraft:sandstone`, `minecraft:smooth_sandstone`; 1-4 block(s): `minecraft:sandstone`, `minecraft:cut_sandstone`; 4-8 block(s): `minecraft:smooth_sandstone`, `minecraft:sandstone`, `minecraft:terracotta`; 8-18 block(s): `minecraft:sandstone`, `minecraft:smooth_sandstone`, `minecraft:stone`, `minecraft:terracotta`. Wall palette: `minecraft:sandstone`, `minecraft:smooth_sandstone`, `minecraft:cut_sandstone`, `minecraft:chiseled_sandstone`.
- **Content:** 4 object placement rule(s) drawing from 25 object key(s), including `clutter/desertpost1`, `clutter/desertpost2`, `clutter/desertpost3`, `clutter/boulder1`, `clutter/boulder2`, `clutter/boulder3`, `clutter/boulder4`, and 18 more. 1 decorator rule(s) using `minecraft:dead_bush`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:basalt_deltas`; native-structure derivative `minecraft:basalt_deltas`; custom identities `underworld_magnetics_dunes_a5367b36`.
- **Surface:** 1 block(s): `minecraft:smooth_basalt`; 1-4 block(s): `minecraft:smooth_basalt`; 4-8 block(s): `minecraft:smooth_basalt`, `minecraft:netherrack`; 8-18 block(s): `minecraft:smooth_basalt`, `minecraft:blackstone`, `minecraft:netherrack`. Wall palette: `minecraft:smooth_basalt`.
- **Content:** 4 object placement rule(s) drawing from 25 object key(s), including `underworld/basalt/clutter/desertpost1`, `underworld/basalt/clutter/desertpost2`, `underworld/basalt/clutter/desertpost3`, `underworld/basalt/clutter/boulder1`, `underworld/basalt/clutter/boulder2`, `underworld/basalt/clutter/boulder3`, `underworld/basalt/clutter/boulder4`, and 18 more. 2 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:crimson_fungus`.
- **Entity spawners:** `nether/surface/basalt-deltas`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

- **Overworld 4002: [`magnetics/dunes`](/iris/biomes/magnetics/dunes):** rarity `1`, altitude `90..130` blocks above the surface, top mode `NOISE`, maximum thickness `72`, carving biome `carving/sand-hollows-child`; decorators inherit and objects do not inherit.
- **Underworld 1005: [`magnetics/dunes`](/iris/biomes/magnetics/dunes):** rarity `1`, altitude `90..130` blocks above the surface, top mode `NOISE`, maximum thickness `72`, carving biome `carving/sand-hollows-child`; decorators inherit and objects do not inherit.

This is an intentional floating self-target: the island reuses `magnetics/dunes` terrain and biome treatment above columns already owned by that biome. Floating-island evaluation is separate from ordinary child recursion and region selection, so the self-target does not add a land-list occurrence or change the direct `16.67%` conditional share above.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome magnetics/dunes
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
