---
title: "Sculk Cathedral - Cave Biome"
description: "Paired Overworld and Underworld atlas entry for carving/sculk-cathedral"
published: true
date: 2026-10-04T12:29:38.588Z
tags: "iris, biome-atlas, cave, subterrain"
editor: markdown
dateCreated: 2026-10-04T12:29:38.588Z
---

`carving/sculk-cathedral` is selected through dimension `subterrainFeatures` in both built-in packs. A tall, dry dome combines sculk ground cover, purple crystal rosettes and cyan tendrils beneath hanging canopy patches. Solid pillars continue from the floor to the roof.

## Selection and shape

The feature ID is `sculk-cathedrals`. Room frequency comes from its placement probability and spacing; biome rarity does not control these rooms. Both packs use the same room geometry and absolute Y band.

| Setting | Both packs |
|---|---|
| Geometry | `CENOTE` |
| Absolute world Y band | `-168..-68` |
| Placement spacing | `512 blocks` |
| Placement probability | `0.3` |
| Vault height | `52 blocks` |
| Radius | `48 blocks` |
| Continuous pillar spacing | `28 blocks` |
| Roof and floor formation fraction | `0.12` |

| Treatment | Overworld | Underworld |
|---|---|---|
| Retained fluid | Dry | Dry |
| Solid room boundary | `minecraft:deepslate` | `minecraft:blackstone` |
| Derivative | `minecraft:deep_dark` | `minecraft:soul_sand_valley` |

Floors, roofs and retaining boundaries remain solid. Decorations fit within the room and leave its protected passages available.

## Overworld treatment

Sculk, deepslate, moss and amethyst form the floor and walls. Floor and ceiling rosettes use three to six amethyst shards, each three to six blocks long, with occasional sea-lantern tips. Low sculk mounds, short room-scaled spires, dry cyan warped-wart tendrils and patchy azalea-leaf curtains occupy the interior.

## Underworld treatment

Blackstone, warped wart, warped nylium and crying obsidian supply the equivalent habitat. Obsidian bases support the crying-obsidian rosettes, and sparse shroomlight tips replace the sea lanterns. Soul particles and the soul-sand-valley derivative retain the Nether treatment.

## Formation settings

The placement chance is per chunk; density is the number of attempts after that chance passes. Vault fractions size formations to their available authored room. Placement still depends on support and clearance.

| Formation | Form | Chance | Density | Vault fraction | Authored height |
|---|---|---:|---:|---:|---|
| `cathedral-sculk-spire` | `SPIRE` | `0.16` | `1` | `0.2` | 5–10 blocks |
| `cathedral-sculk-mound` | `BOULDER` | `0.22` | `2` | `0` | 1–2 blocks |

## Ecology

Native derivatives are `minecraft:deep_dark` in Overworld and `minecraft:soul_sand_valley` in Underworld. Dimension and region spawner scopes continue to apply.

## Find the room

On Bukkit-family servers:

```text
/iris find subterrain sculk-cathedrals radius=8192 teleport=false
/iris find underground-biome carving/sculk-cathedral radius=8192 teleport=false
/iris what biome
```

Generate fresh chunks to see the configured room. See [Authored Subterrain Features](/iris/15b-subterrain-features) for room settings and [Procedural Objects](/iris/17-procedural-objects) for formation settings.
