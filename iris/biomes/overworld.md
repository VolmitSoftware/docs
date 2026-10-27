---
title: "Overworld"
description: "Dimension-wide context for the Iris Overworld biome atlas"
published: true
date: 2026-10-26T18:35:44.000Z
tags: "iris, biomes, overworld"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
Overworld is the normal-environment half of the paired biome atlas. It supplies the shared terrain geometry used by Underworld, then renders that geometry with normal-world water, stone, soil, vegetation, structures, mobs, and climate derivatives.

| Property | Value |
|---|---|
| Built-in pack | Overworld |
| Environment | `NORMAL` |
| Build range | Y `-256..512` |
| Logical height | `512` |
| Fluid level | Y `50` |
| Lighting | Normal; `fullbright` is false |
| Upper dimension / roof | None |
| Regions | Frozen, Hot, Terralost, Mushroom, Forests, Tundra, Magnetics, Temperate, Estranged, Tropical, Swamp, Prismatics |
| Dimension carving | `carving/standard-deepdark` from Y `-250..-175` |
| Dimension ores / deposits | 11 ore definitions and 23 deposit passes |
| Dimension structures | One Ancient City placement with source replacement |
| External datapacks | None |

All 19 subterranean ore passes retain 70% of their configured clump attempts. Across dimension, region, and Rough Plains biome deposits, ore on exterior terrain surfaces may replace only exact `minecraft:stone`; buried and cave-wall ore retains each pass's broader host rules. Individual surface biomes can override the exterior host list. Underworld ore configuration remains independent.

Both packs disable standalone aquifers in dimension, region, and biome cave profiles. Cave pools on the cave floors, and the rivers, ponds and lakes above the caves, are water in Overworld and lava in Underworld. Deep lava retains its separate controls.

Both packs use `surfaceDetail: 0.5` on nonflat terrain generators to smooth small surface variations.

## 3D terrain

The paired packs configure 197 active biome profiles and 23 explicit protected identities. Mountain and cliff profiles add shelves, undercuts, and fissures. Wetlands, water basins, and loose dunes keep their height-based terrain. Rivers, ponds and lakes come from hydrology, with the same settings in both packs and each dimension's own fluid. Both dimensions use `hydrology.density: 0.5` to retain half the eligible water-feature candidates without changing their configured sizes.

Every reachable land root and ordinary child has an explicit setting. [Terrain shaping](/iris/biomes/terrain-shaping) lists the profile families and protected identities. The per-biome tables give exact amplitudes, feature scales, crack dimensions, and slope gates.

## How selection works

The dimension first chooses one of twelve regions. Each region supplies independent land, sea, shore, and cave pools. The chosen role selects a root biome by its effective rarity, then the biome may resolve through children or contribute a floating biome above the column.

The global Deep Dark band is different from an ordinary regional cave. Between Y `-250` and `-175`, the dimension carving entry selects `carving/standard-deepdark`, whose family reaches City Basin and Dark Depths variants independently of the surface region.

## Water beds and plants

The stream, river, and major tiers and the pond settings use the same submerged bed palette. It mixes gravel, sand, clay, and coarse dirt with weights `4`, `3`, `2`, and `1`. The palette uses `SIMPLEX` with `style.zoom: 0.125` and `zoom: 1`. Shores and banks retain each biome's own layers.

Each tier and `hydrology.ponds` has three `SEA_FLOOR` decorators with `STATIC` distribution:

| Setting | Seagrass chance | Tall seagrass chance | Kelp chance | Kelp stack |
|---|---:|---:|---:|---|
| `tiers` stream | `0.18` | `0.035` | `0.02` | `2..3` |
| `tiers` river | `0.22` | `0.05` | `0.035` | `2..4` |
| `tiers` major | `0.22` | `0.06` | `0.045` | `2..5` |
| `ponds` | `0.25` | `0.07` | `0.04` | `2..5` |

The decorators compete for each bed column, so their chances do not add together. Plants need source water and enough depth. Kelp height follows `STATIC` noise and stays below the top water cell. Its top uses `age: 25` to keep the configured height. Lava pools do not grow these plants.

Edit `materials.bed.palette` for block weights and `materials.bed.style` or `materials.bed.zoom` for the patch pattern. Edit each decorator's `chance` or kelp `stackMin` and `stackMax` for plant cover and height. Set `hydrologyPolicy.decorators` on a biome or region to replace these plants locally. An empty list disables them. See [Hydrology](/iris/36-rivers#water-plants).

## Regional ecology

Ordinary wildlife and hostile mobs follow the native spawn tables of the selected biome's `vanillaDerivative`, or `derivative` when unset. Minecraft controls population limits, light, placement, and spawning conditions. Native structures supply their configured inhabitants. Each biome retains its authored plants, objects, and decoration.

## Relationship to Underworld

Overworld is the geometry authority. Shape changes to its dimension transforms, region and biome selection, terrain generators, cave profiles, children, or floating islands are mirrored into Underworld so equal seeds remain coordinate-compatible. Procedural geometry, placement chances, seeds, support settings, and paired object placement controls also follow Overworld. Materials, derivatives, ambience, ecology, object assets, ores, deposits, and structures keep their dimension-specific treatment.

Overworld and Underworld share lowercase active terrain keys, including `mountain/cute_cliffs` and `mountain/cute_cliffs+`. Their terrain selector lists match, including Estranged shores and wetland rarity weights.

Return to [44 - Biome Catalog](/iris/44-biome-catalog) or compare [Underworld](/iris/biomes/underworld).
