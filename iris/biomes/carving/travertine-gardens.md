---
title: "Travertine Gardens - Cave Biome"
description: "Paired Overworld and Underworld atlas entry for carving/travertine-gardens"
published: true
date: 2026-10-04T12:29:38.588Z
tags: "iris, biome-atlas, cave, subterrain"
editor: markdown
dateCreated: 2026-10-04T12:29:38.588Z
---

`carving/travertine-gardens` is selected through dimension `subterrainFeatures` in both built-in packs. Seven stepped mineral basins descend through a long gallery with solid retaining rims and raised side paths. Hanging mineral curtains, capped columns and bank arches surround the pools.

## Selection and shape

The feature ID is `travertine-gardens`. Room frequency comes from its placement probability and spacing; biome rarity does not control these rooms. Both packs use the same room geometry and absolute Y band.

| Setting | Both packs |
|---|---|
| Geometry | `TRAVERTINE_TERRACES` |
| Absolute world Y band | `-150..-52` |
| Placement spacing | `448 blocks` |
| Placement probability | `0.34` |
| Vault height | `42 blocks` |
| Radius | `23 blocks` |
| Continuous pillar spacing | `32 blocks` |
| Roof and floor formation fraction | `0.12` |
| Passage length | `168 blocks` |
| Basin count | `7` |

| Treatment | Overworld | Underworld |
|---|---|---|
| Retained fluid | water; 3 blocks deep | lava; 3 blocks deep |
| Solid room boundary | `minecraft:calcite` | `minecraft:quartz_block` |
| Derivative | `minecraft:lush_caves` | `minecraft:warped_forest` |

Floors, roofs and retaining boundaries remain solid. Decorations fit within the room and leave its protected passages available.

## Overworld treatment

Calcite, diorite and clay form the pale mineral banks, with moss carpet and glowing cave vines on the supported edges. Moss caps crown pinched hoodoo columns; irregular arches and low rounded rocks interrupt the terraces. Glow squid use the contained water and bats occupy dry space.

## Underworld treatment

Quartz, basalt and soul soil line the coordinate-matched lava terraces. Warped nylium caps replace the moss caps; warped-wart ground clumps, weeping vines and glowstone provide the corresponding vegetation and light. Striders use the contained lava and occasional endermen occupy dry space.

## Formation settings

The placement chance is per chunk; density is the number of attempts after that chance passes. Vault fractions size formations to their available authored room. Placement still depends on support and clearance.

| Formation | Form | Chance | Density | Vault fraction | Authored height |
|---|---|---:|---:|---:|---|
| `travertine-mineral-curtains` | `SPIRE` | `0.32` | `2` | `0.3` | 5–14 blocks |
| `travertine-mineral-columns` | `HOODOO` | `0.2` | `1` | `0.26` | 6–12 blocks |
| `travertine-bank-arches` | `ARCH` | `0.14` | `1` | `0.28` | 6–12 blocks |
| `travertine-basin-knuckles` | `BOULDER` | `0.28` | `2` | `0.1` | 2–4 blocks |

## Ecology

The `carving/travertine-gardens` CAVE spawner caps each chunk at three entities and permits one attempt every 40 seconds within light levels `0..12`. Its swimmer template requires water in Overworld or lava in Underworld, while the roamer template uses land. The registered biome declares an empty native spawn table.

## Find the room

On Bukkit-family servers:

```text
/iris find subterrain travertine-gardens radius=8192 teleport=false
/iris find underground-biome carving/travertine-gardens radius=8192 teleport=false
/iris what biome
```

Generate fresh chunks to see the configured room. See [Authored Subterrain Features](/iris/15b-subterrain-features) for room settings and [Procedural Objects](/iris/17-procedural-objects) for formation settings.
