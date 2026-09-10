---
title: "Biome Atlas — Tropical Volcanic Plains"
description: "Iris biome atlas entry for tropical/volcanic-plains in Overworld 4007 and Underworld 1010"
published: true
date: 2026-09-09T01:34:05.712Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`tropical/volcanic-plains` is a directly selected land biome in the current Overworld 4007 and Underworld 1010 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4007 | `tropical` (Tropical) | 1 | 1 | 1 | 8.33% |
| Underworld 1010 | `tropical` (Underworld Tropical) | 1 | 1 | 1 | 8.33% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `mountain` (120..190); combined authored contribution `120..190` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## 3D terrain

Overworld 4007 and Underworld 1010 share these `terrain3D` settings. Amplitude, feature scales, and crack dimensions use blocks.
The slope gate uses rise divided by horizontal distance. Strength reaches its configured value at the full slope.

| Biome | Treatment | Amplitude | Horizontal / vertical scale | Crack depth / width / scale | Slope start / full | Density noise / Crack noise |
|---|---|---:|---|---|---|---|
| `tropical/volcanic-plains` | Volcanic | 44 | 192 / 24 | 9 / 2 / 336 | 0.22 / 0.52 | `HEXAGON` / `SIMPLEX` |
| `tropical/volcanoes` | Volcanic | 44 | 192 / 24 | 9 / 2 / 336 | 0.22 / 0.52 | `HEXAGON` / `SIMPLEX` |

The table lists each profile’s density and crack noise. Active deformation starts above fluid level plus 8 blocks and fades across 24 blocks of base elevation.
Each pack retains its own materials, decoration, objects, and ores. Floating islands keep their separate shape settings.


## Lava hydrology

Both `tropical/volcanic-plains` and its `tropical/volcanoes` child select the `volcanic_lava` river profile and `volcanic_pool` standing pools. Their surface source density is 6 with 128-block spacing, two tributaries per outlet, and up to three inland outlets per fully covered tile. Coastal outlets are disabled. Courses require at least 128 blocks, may cut up to 24 blocks, and use half-width channels with a 1.25 depth multiplier.

The shared profile keeps lava routes within volcanic terrain and separate from ambient river profiles. Volcanic channels retain the local basalt, blackstone, magma, and tuff treatment. Pools have 6–12-block radii and depth 3; they replace the fluid-painted lava child. Both packs use lava here.

## Overworld 4007 treatment

- **Minecraft identity:** derivative `minecraft:the_void`; native-structure derivative `minecraft:the_void`; custom identities `tropical_volcanic_plains`.
- **Surface:** 1-5 block(s): `minecraft:magma_block`, `minecraft:basalt`, `minecraft:tuff`; 2 block(s): `minecraft:basalt`; 3-10 block(s): `minecraft:blackstone`. Wall palette: none.
- **Content:** 1 object placement rule(s) drawing from 1 object key(s), including `clutter/lava-basin-1`.

## Underworld 1010 treatment

- **Minecraft identity:** derivative `minecraft:basalt_deltas`; native-structure derivative `minecraft:basalt_deltas`; custom identities `underworld_tropical_volcanic_plains_e2a8de66`.
- **Surface:** 1-5 block(s): `minecraft:magma_block`, `minecraft:basalt`, `minecraft:blackstone`; 2 block(s): `minecraft:basalt`; 3-10 block(s): `minecraft:blackstone`. Wall palette: none.
- **Content:** 1 object placement rule(s) drawing from 1 object key(s), including `underworld/basalt/clutter/lava-basin-1`. 1 decorator rule(s) (1 shared snippet reference(s)).
- **Entity spawners:** `nether/surface/basalt-deltas`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

### Tropical Volcanoes (`tropical/volcanoes`)

This child-only biome is selected from `tropical/volcanic-plains`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `1` of `2` slots (50.00%); later child hops are resolved separately.

**Shared terrain:** `mountain` (30..180); combined authored contribution `30..180` blocks relative to fluid height.

- **Overworld 4007:** `minecraft:the_void` identity; surface 1 block(s): `minecraft:basalt`; 2 block(s): `minecraft:basalt`; 3-10 block(s): `minecraft:blackstone`; 1-2 block(s): `minecraft:tuff`; No biome-local object, decorator, procedural, deposit, or effect rules.
- **Underworld 1010:** `minecraft:basalt_deltas` identity; surface 1 block(s): `minecraft:basalt`; 2 block(s): `minecraft:basalt`; 3-10 block(s): `minecraft:blackstone`; 1-2 block(s): `minecraft:blackstone`; 1 decorator rule(s) (1 shared snippet reference(s)).

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome tropical/volcanic-plains
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
