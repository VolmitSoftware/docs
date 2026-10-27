---
title: "Underworld"
description: "Dimension-wide context for the Iris Underworld biome atlas"
published: true
date: 2026-10-26T18:35:44.000Z
tags: "iris, biomes, underworld"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
Underworld reuses the Overworld terrain graph at the same seed and coordinates, then replaces its presentation and ecology with Nether-safe content. It is an open, full-height world rather than a vanilla enclosed Nether, so its biome names describe recognizable terrain families rendered through a Nether material language.

| Property | Value |
|---|---|
| Built-in pack | Underworld |
| Environment | `NETHER` |
| Terrain mode | `OVERWORLD` |
| Coordinate scale | 1:1 with the paired Overworld seed |
| Build range | Y `-256..512` |
| Logical height | `512` |
| Fluid level | Y `50`, using lava |
| Lighting | Fullbright |
| Upper dimension / Nether roof | None; `upperDimension` is empty |
| Regions | Frozen, Hot, Terralost, Mushroom, Forests, Tundra, Magnetics, Temperate, Estranged, Tropical, Swamp, Prismatics |
| Dimension carving | `carving/standard-deepdark` from Y `-250..-175` |
| Dimension ores / deposits | 11 independent ore definitions and 12 deposit passes |
| External datapacks | None |

Both packs use `surfaceDetail: 0.5` on nonflat terrain generators to smooth small surface variations.

## 3D terrain

The paired packs configure 197 active biome profiles and 23 explicit protected identities. Mountain and cliff profiles add shelves, undercuts, and fissures. Wetlands, water basins, and loose dunes keep their height-based terrain. Rivers, ponds and lakes come from hydrology, with the same settings in both packs and each dimension's own fluid.

Every reachable land root and ordinary child has an explicit setting. [Terrain shaping](/iris/biomes/terrain-shaping) lists the profile families and protected identities. The per-biome tables give exact amplitudes, feature scales, crack dimensions, and slope gates.

Underworld uses the same hydrology tier, pond, and lake geometry as Overworld, filled with lava. Both dimensions use `hydrology.density: 0.5` to retain half the eligible water-feature candidates without changing their configured sizes. Shores and banks keep each biome's own layers.

## Foundation and fluids

The dimension rock palette is weighted toward netherrack, with blackstone, basalt, and soul soil mixed through a Simplex distribution. Lava replaces water as the dimension fluid. Both packs disable standalone cave aquifers. Underworld defines a single `lava` hydrology fluid and fills every stream, river, pond and lake with it. Individual biomes can override their surface, wall, cave, and object materials; the paired atlas entries list those local treatments rather than reducing every biome to the dimension defaults.

Stream, river, pond, and lake beds use blackstone, basalt, netherrack, and soul soil with weights `4`, `3`, `2`, and `1`. Their bed palettes use `SIMPLEX` with `style.zoom: 0.125` and `zoom: 1`. Edit `tiers[].materials.bed` and `ponds.materials.bed` to configure the mix and patch pattern. Lava beds have no aquatic decorators. See [Hydrology](/iris/36-rivers#materials).

## Biomes and ecology

Underworld keeps the paired biome load keys and terrain geometry, but it changes display names, Minecraft derivatives, custom biome color and ambience, surface palettes, objects, decorators, spawners, loot context, and other ecology. Most surface entries add Nether surface and cave spawners. The actual derivative and owned content are recorded per page because a generic “Nether version” label would hide meaningful differences.

The twelve regions and the global Deep Dark band remain recognizable at the same coordinates as Overworld. Floating islands also keep their geometry. Nine floating entries belong to Magnetics, two to Rough Plains, and one to Cherry Grove; their materials and decoration are translated for Underworld.

## Structures and terrain parity

Underworld does not copy Overworld ores, deposits, native structures, palettes, or object assets blindly. Those systems are intentionally independent. Terrain shape, selection geometry, child layout, cave shapes, and floating-island geometry follow Overworld. Procedural shapes, chances, seeds, support settings, and paired object placement controls also match, with Nether materials and assets.

Frozen surface decorations use compact crooked spires, drift boulders, shard fans, frost blooms, and sprigs. Soul forms use soul soil and bone. Blackstone forms use blackstone and crying obsidian. Frozen cave rocks and Jungle cave trees use `scale.size: 0.375`. The tree placements in Jungle, Lush, Moss Pillars, and Swamp caves use `density: 2`, as do Mushroom cave fungi placements.

The active biome keys, region display names, selector lists, and rarity weights match Overworld. Estranged uses the same shore heights, shore scale, and shore list. Hydrology geometry and rainfall policies also match. Fluids, bed materials, and aquatic plants retain their dimension-specific settings.

Return to [44 - Biome Catalog](/iris/44-biome-catalog) or compare [Overworld](/iris/biomes/overworld).
