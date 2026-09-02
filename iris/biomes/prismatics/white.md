---
title: "Biome Atlas — Prismatics White"
description: "Iris biome atlas entry for prismatics/white in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`prismatics/white` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `prismatics` (Prismatics) | 1 | 1 | 1 | 6.25% |
| Underworld 1005 | `prismatics` (Underworld Prismatics) | 1 | 1 | 1 | 6.25% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `plain` (24..52), `highplains` (52..72); combined authored contribution `76..124` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:plains`; native-structure derivative `minecraft:plains`; no custom or scatter identities.
- **Surface:** 2-3 block(s): `minecraft:white_concrete_powder`; 4-8 block(s): `minecraft:white_concrete`. Wall palette: `minecraft:white_concrete`.
- **Content:** 5 object placement rule(s) drawing from 34 object key(s), including `clutter/concretelith1`, `clutter/concretelith2`, `clutter/concretelith3`, `clutter/concretelith4`, `clutter/concretelith5`, `clutter/concretelith6`, `clutter/concretelith7`, and 27 more.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:basalt_deltas`; native-structure derivative `minecraft:basalt_deltas`; custom identities `underworld_prismatics_white_83c7a04c`.
- **Surface:** 2-3 block(s): `minecraft:quartz_block`; 4-8 block(s): `minecraft:quartz_block`. Wall palette: `minecraft:quartz_block`.
- **Content:** 5 object placement rule(s) drawing from 34 object key(s), including `underworld/basalt/clutter/concretelith1`, `underworld/basalt/clutter/concretelith2`, `underworld/basalt/clutter/concretelith3`, `underworld/basalt/clutter/concretelith4`, `underworld/basalt/clutter/concretelith5`, `underworld/basalt/clutter/concretelith6`, `underworld/basalt/clutter/concretelith7`, and 27 more. 1 decorator rule(s) (1 shared snippet reference(s)).
- **Entity spawners:** `nether/surface/basalt-deltas`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome prismatics/white
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
