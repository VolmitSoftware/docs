---
title: "Frost Vaults - Cave Biome"
description: "Paired Overworld and Underworld atlas entry for carving/frost-vaults"
published: true
date: 2026-10-04T12:29:38.588Z
tags: "iris, biome-atlas, cave, subterrain"
editor: markdown
dateCreated: 2026-10-04T12:29:38.588Z
---

`carving/frost-vaults` is selected through dimension `subterrainFeatures` in both built-in packs. A dry, pale dome contains hanging icicles, split crystal ridges, low snow terraces and narrow ice bridges. Continuous mineral pillars and local roof drips frame the interior.

## Selection and shape

The feature ID is `frost-vaults`. Room frequency comes from its placement probability and spacing; biome rarity does not control these rooms. Both packs use the same room geometry and absolute Y band.

| Setting | Both packs |
|---|---|
| Geometry | `CENOTE` |
| Absolute world Y band | `-104..-20` |
| Placement spacing | `512 blocks` |
| Placement probability | `0.28` |
| Vault height | `54 blocks` |
| Radius | `46 blocks` |
| Continuous pillar spacing | `28 blocks` |
| Roof and floor formation fraction | `0.16` |

| Treatment | Overworld | Underworld |
|---|---|---|
| Retained fluid | Dry | Dry |
| Solid room boundary | `minecraft:calcite` | `minecraft:quartz_block` |
| Derivative | `minecraft:frozen_peaks` | `minecraft:soul_sand_valley` |

Floors, roofs and retaining boundaries remain solid. Decorations fit within the room and leave its protected passages available.

## Overworld treatment

Packed ice, blue ice, calcite, diorite and snow form the walls and ledges. Linear tapering icicles hang from the ceiling, separated crystal ridges retain open cracks, snow terraces form broad low steps, and irregular ice arches bridge small gaps. Sparse glow lichen and ceiling lights provide local highlights.

## Underworld treatment

Quartz, smooth basalt, basalt and soul soil replace the ice and snow palette. Glowstone and shroomlights provide the corresponding ceiling highlights, with white-ash ambience and the soul-sand-valley derivative.

## Formation settings

The placement chance is per chunk; density is the number of attempts after that chance passes. Vault fractions size formations to their available authored room. Placement still depends on support and clearance.

| Formation | Form | Chance | Density | Vault fraction | Authored height |
|---|---|---:|---:|---:|---|
| `frost-vault-icicles` | `SPIRE` | `0.46` | `3` | `0.32` | 5–18 blocks |
| `frost-vault-crystal-ridges` | `FISSURE` | `0.2` | `1` | `0.24` | 4–12 blocks |
| `frost-vault-snow-terraces` | `ICEBERG` | `0.38` | `2` | `0.12` | 3–7 blocks |
| `frost-vault-ice-bridge` | `ARCH` | `0.09` | `1` | `0.26` | 6–12 blocks |

## Ecology

The `carving/frost-vaults` CAVE pool selects strays and bats in Overworld, or skeletons and endermen in Underworld. It caps each chunk at three entities and permits one attempt per chunk every 40 seconds, within light levels `0..7`. The registered biome declares an empty native spawn table.

## Find the room

On Bukkit-family servers:

```text
/iris find subterrain frost-vaults radius=8192 teleport=false
/iris find underground-biome carving/frost-vaults radius=8192 teleport=false
/iris what biome
```

Generate fresh chunks to see the configured room. See [Authored Subterrain Features](/iris/15b-subterrain-features) for room settings and [Procedural Objects](/iris/17-procedural-objects) for formation settings.
