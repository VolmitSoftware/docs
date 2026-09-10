---
title: "Underworld 1010"
description: "Dimension-wide context for the Iris Underworld biome atlas"
published: true
date: 2026-09-09T00:23:13.301Z
tags: "iris, biomes, underworld"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
Underworld 1010 reuses the Overworld terrain graph at the same seed and coordinates, then replaces its presentation and ecology with Nether-safe content. It is an open, full-height world rather than a vanilla enclosed Nether, so its biome names describe recognizable terrain families rendered through a Nether material language.

| Property | Current value |
|---|---|
| Built-in pack | Underworld 1010 |
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

The preceding Underworld 1009 update normalized 148 resource paths and 273 references to lowercase. Lower Mountain uses `mountain/cute_cliffs`, and Mountain Middle uses `mountain/cute_cliffs+`. Underworld 1010 adds the paired 3D profiles and aligns terrain-selection drift. Materials, ecology, and the independent ore and deposit tables remain unchanged.

## 3D terrain

The paired packs configure 197 active biome profiles and 23 explicit protected identities. Mountain and cliff profiles add shelves, undercuts, and fissures. Wetlands, water basins, and loose dunes retain their current terrain. Tropical rivers and volcanic lava courses use hydrology, with matching geometry and separate fluid palettes in the paired packs.

Every reachable land root and ordinary child has an explicit setting. [Terrain shaping](/iris/biomes/terrain-shaping) lists the profile families and protected identities. The per-biome tables give exact amplitudes, feature scales, crack dimensions, and slope gates.


## Foundation and fluids

The dimension rock palette is weighted toward netherrack, with blackstone, basalt, and soul soil mixed through a Simplex distribution. Lava replaces water as the dimension fluid. Underworld retains its single deep-lava profile and disables ordinary cave-fluid admission. Overworld also has a smaller deep-lava profile. Individual biomes can override their surface, wall, cave, and object materials; the paired atlas entries list those local treatments rather than reducing every biome to the dimension defaults.

## Biomes and ecology

Underworld keeps the paired biome load keys and terrain geometry, but it changes display names, Minecraft derivatives, custom biome color and ambience, surface palettes, objects, decorators, spawners, loot context, and other ecology. Most surface entries add Nether surface and cave spawners. The actual derivative and owned content are recorded per page because a generic “Nether version” label would hide meaningful differences.

The twelve regions and the global Deep Dark band remain recognizable at the same coordinates as Overworld. Floating islands also keep their geometry. Nine floating entries belong to Magnetics, two to Rough Plains, and one to Cherry Grove; their materials and decoration are translated for Underworld.

## Structures and terrain parity

Underworld does not copy Overworld ores, deposits, native structures, palettes, or object assets blindly. Those systems are intentionally independent. Only terrain shape, selection geometry, child layout, cave shapes, and floating-island geometry are synchronized.

The active biome keys, region selector lists, and rarity weights match Overworld. Estranged now uses the same shore heights, shore scale, and shore list. Coastal river geometry and Hot and Magnetics lava pools also match.

Return to [44 - Biome Catalog](/iris/44-biome-catalog) or compare [Overworld 4007](/iris/biomes/overworld).
