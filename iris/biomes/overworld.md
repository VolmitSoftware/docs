---
title: "Overworld 4009"
description: "Dimension-wide context for the Iris Overworld biome atlas"
published: true
date: 2026-09-14T01:38:38.181Z
tags: "iris, biomes, overworld"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
Overworld 4009 is the normal-environment half of the paired biome atlas. It supplies the shared terrain geometry used by Underworld, then renders that geometry with normal-world water, stone, soil, vegetation, structures, mobs, and climate derivatives.

| Property | Current value |
|---|---|
| Built-in pack | Overworld 4009 |
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

Both packs disable standalone aquifers in dimension, region, and biome cave profiles. Contained hydrology and natural surface fluids remain active, using water in Overworld and lava in Underworld. Deep lava retains its separate controls.

Both packs set nonflat terrain generators to `surfaceDetail: 0.5`. This halves the variation between original six-block grid heights and their interpolated surface. Generator seeds, broad feature scales, height bands, and 3D terrain profiles retain their settings.

## 3D terrain

The paired packs configure 197 active biome profiles and 23 explicit protected identities. Mountain and cliff profiles add shelves, undercuts, and fissures. Wetlands, water basins, and loose dunes retain their current terrain. Tropical rivers and volcanic lava courses use hydrology, with matching geometry and separate fluid palettes in the paired packs.

Every reachable land root and ordinary child has an explicit setting. [Terrain shaping](/iris/biomes/terrain-shaping) lists the profile families and protected identities. The per-biome tables give exact amplitudes, feature scales, crack dimensions, and slope gates.


## How selection works

The dimension first chooses one of twelve regions. Each region supplies independent land, sea, shore, and cave pools. The chosen role selects a root biome by its effective rarity, then the biome may resolve through children or contribute a floating biome above the column.

The global Deep Dark band is different from an ordinary regional cave. Between Y `-250` and `-175`, the dimension carving entry selects `carving/standard-deepdark`, whose family reaches City Basin and Dark Depths variants independently of the surface region.

## Relationship to Underworld

Overworld is the geometry authority. Shape changes to its dimension transforms, region and biome selection, terrain generators, cave profiles, children, or floating islands are mirrored into Underworld so equal seeds remain coordinate-compatible. Procedural geometry, placement chances, seeds, support settings, and paired object placement controls also follow Overworld. Materials, derivatives, ambience, ecology, object assets, ores, deposits, and structures keep their dimension-specific treatment.

Overworld 4009 and Underworld 1011 share lowercase active terrain keys, including `mountain/cute_cliffs` and `mountain/cute_cliffs+`. Their terrain selector lists now match, including Estranged shores and wetland rarity weights.

Return to [44 - Biome Catalog](/iris/44-biome-catalog) or compare [Underworld 1011](/iris/biomes/underworld).
