---
title: "Biome Atlas — Tropical Volcanic Plains"
description: "Iris biome atlas entry for tropical/volcanic-plains in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`tropical/volcanic-plains` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `tropical` (Tropical) | 1 | 1 | 1 | 8.33% |
| Underworld 1005 | `tropical` (Underworld Tropical) | 1 | 1 | 1 | 8.33% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

## Shared terrain

Both packs use the same generator links: `mountain` (120..190); combined authored contribution `120..190` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:the_void`; native-structure derivative `minecraft:the_void`; custom identities `tropical_volcanic_plains`.
- **Surface:** 1-5 block(s): `minecraft:magma_block`, `minecraft:basalt`, `minecraft:tuff`; 2 block(s): `minecraft:basalt`; 3-10 block(s): `minecraft:blackstone`. Wall palette: none.
- **Content:** 1 object placement rule(s) drawing from 1 object key(s), including `clutter/lava-basin-1`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:basalt_deltas`; native-structure derivative `minecraft:basalt_deltas`; custom identities `underworld_tropical_volcanic_plains_e2a8de66`.
- **Surface:** 1-5 block(s): `minecraft:magma_block`, `minecraft:basalt`, `minecraft:blackstone`; 2 block(s): `minecraft:basalt`; 3-10 block(s): `minecraft:blackstone`. Wall palette: none.
- **Content:** 1 object placement rule(s) drawing from 1 object key(s), including `underworld/basalt/clutter/lava-basin-1`. 1 decorator rule(s) (1 shared snippet reference(s)).
- **Entity spawners:** `nether/surface/basalt-deltas`, `nether/cave`.

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

## Children

### Tropical Volcanoes (`tropical/volcanoes`)

This child-only biome is selected from `tropical/volcanic-plains`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `1` of `2` slots (50.00%); later child hops are resolved separately.

**Shared terrain:** `mountain` (30..180); combined authored contribution `30..180` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:the_void` identity; surface 1 block(s): `minecraft:basalt`; 2 block(s): `minecraft:basalt`; 3-10 block(s): `minecraft:blackstone`; 1-2 block(s): `minecraft:tuff`; No biome-local object, decorator, procedural, deposit, or effect rules.
- **Underworld 1005:** `minecraft:basalt_deltas` identity; surface 1 block(s): `minecraft:basalt`; 2 block(s): `minecraft:basalt`; 3-10 block(s): `minecraft:blackstone`; 1-2 block(s): `minecraft:blackstone`; 1 decorator rule(s) (1 shared snippet reference(s)).

### Tropical Volcanoes Lava (`tropical/volcanoes-lava`)

This child-only biome is selected from `tropical/volcanoes`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `1` of `2` slots (50.00%); later child hops are resolved separately.

**Shared terrain:** `mountain` (3..180); combined authored contribution `3..180` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:the_void` identity; surface 2-3 block(s): `minecraft:cave_air`; 1 block(s): `minecraft:lava`; 1-3 block(s): `minecraft:lava`; No biome-local object, decorator, procedural, deposit, or effect rules.
- **Underworld 1005:** `minecraft:basalt_deltas` identity; surface 2-3 block(s): `minecraft:cave_air`; 1 block(s): `minecraft:lava`; 1-3 block(s): `minecraft:lava`; 1 decorator rule(s) (1 shared snippet reference(s)).

## Floating variants

No floating child biomes are declared.


## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome tropical/volcanic-plains
/iris what biome
/iris what region
```

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
