---
title: "Lantern Grotto - Cave Biome"
description: "Paired Overworld and Underworld atlas entry for carving/lantern-grotto"
published: true
date: 2026-10-04T12:29:38.588Z
tags: "iris, biome-atlas, cave, subterrain"
editor: markdown
dateCreated: 2026-10-04T12:29:38.588Z
---

`carving/lantern-grotto` is selected through dimension `subterrainFeatures` in both built-in packs. A planted dome surrounds a contained pool beneath berry vines and hanging canopy patches. Low arches and dangling roots give the banks their shape.

## Selection and shape

The feature ID is `lantern-grottos`. Room frequency comes from its placement probability and spacing; biome rarity does not control these rooms. Both packs use the same room geometry and absolute Y band.

| Setting | Both packs |
|---|---|
| Geometry | `CENOTE` |
| Absolute world Y band | `-110..-24` |
| Placement spacing | `448 blocks` |
| Placement probability | `0.3` |
| Vault height | `40 blocks` |
| Radius | `42 blocks` |
| Continuous pillar spacing | `28 blocks` |
| Roof and floor formation fraction | `0.08` |

| Treatment | Overworld | Underworld |
|---|---|---|
| Retained fluid | water; 5 blocks deep | lava; 5 blocks deep |
| Solid room boundary | `minecraft:moss_block` | `minecraft:warped_nylium` |
| Derivative | `minecraft:lush_caves` | `minecraft:warped_forest` |

Floors, roofs and retaining boundaries remain solid. Decorations fit within the room and leave its protected passages available.

## Overworld treatment

Moss, prismarine, calcite and clay line the banks. Moss carpet, grass, azaleas and flowering azaleas occur on moss support. Berry cave vines hang up to twelve blocks, leaf curtains up to nine, and sparse spore blossoms add canopy detail. Submerged blue tube-coral fans grow in actual water; moss arches occupy 26% of a room vault and dangling root overhangs 18%.

## Underworld treatment

Warped nylium, warped wart, soul soil and blackstone line the matching lava basin. Roots, sprouts and warped fungi supply the ground cover, while weeping vines and shroomlights hang above the fluid. Warped-wart fans with sparse shroomlight tips replace the submerged coral.

## Formation settings

The placement chance is per chunk; density is the number of attempts after that chance passes. Vault fractions size formations to their available authored room. Placement still depends on support and clearance.

| Formation | Form | Chance | Density | Vault fraction | Authored height |
|---|---|---:|---:|---:|---|
| `lantern-moss-arch` | `ARCH` | `0.055` | `1` | `0.26` | 5–10 blocks |
| `lantern-hanging-root` | `OVERHANG` | `0.1` | `1` | `0.18` | 5–10 blocks |

## Ecology

The `subterrain/lantern-grotto` CAVE spawner supplies glow squid in Overworld water and striders in Underworld lava. It caps each chunk at two entities and allows one attempt per chunk every 45 seconds. The entity templates require the corresponding actual fluid.

## Find the room

On Bukkit-family servers:

```text
/iris find subterrain lantern-grottos radius=8192 teleport=false
/iris find underground-biome carving/lantern-grotto radius=8192 teleport=false
/iris what biome
```

Generate fresh chunks to see the configured room. See [Authored Subterrain Features](/iris/15b-subterrain-features) for room settings and [Procedural Objects](/iris/17-procedural-objects) for formation settings.
