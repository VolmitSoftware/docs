---
title: "Lava Lamp Caves - Cave Biome"
description: "Paired Overworld and Underworld atlas entry for carving/lava-lamp"
published: true
date: 2026-10-04T12:47:19.912Z
tags: "iris, biome-atlas, cave, subterrain"
editor: markdown
dateCreated: 2026-10-04T12:29:38.588Z
---

`carving/lava-lamp` is selected through dimension `subterrainFeatures` in both built-in packs. Glowing mineral bodies rise from the walkways and hang above a retained lava channel. The chamber combines rounded pendants, narrow waists and tapered drips, with broad raised side shelves supporting the floor columns.

## Selection and shape

The feature ID is `lava-lamp-tubes`. Room frequency comes from its placement probability and spacing; biome rarity does not control these rooms. Both packs use the same room geometry and absolute Y band.

| Setting | Both packs |
|---|---|
| Geometry | `LAVA_TUBE` |
| Absolute world Y band | `-172..-68` |
| Placement spacing | `544 blocks` |
| Placement probability | `0.42` |
| Vault height | `38 blocks` |
| Radius | `24 blocks` |
| Continuous pillar spacing | Disabled (`0`) |
| Roof and floor formation fraction | `0.06` |
| Passage length | `240 blocks` |
| Underground chimney height | `22 blocks` |

| Treatment | Overworld | Underworld |
|---|---|---|
| Retained fluid | lava; 5 blocks deep | lava; 5 blocks deep |
| Solid room boundary | `minecraft:yellow_terracotta` | `minecraft:smooth_basalt` |
| Derivative | `minecraft:dripstone_caves` | `minecraft:basalt_deltas` |

Floors, roofs and retaining boundaries remain solid. Decorations fit within the room and leave its protected passages available.

## Overworld treatment

Yellow, orange and red terracotta surround the passage, with smooth basalt breaking up the warm mineral bands. Ochre froglight crowns illuminate the floor columns and hanging droplets. Pointed dripstone supplies smaller floor and ceiling spikes; sparse magma floor accents accompany these formations.

## Underworld treatment

Smooth basalt and blackstone dominate the passage, with orange terracotta, netherrack and magma in the bands. Glowstone replaces the froglight crowns. Both packs use the same pendant, column and drip dimensions. Ceiling formations begin from a narrow attachment and widen below the curved roof.

## Formation settings

The placement chance is per chunk; density is the number of attempts after that chance passes. Vault fractions size formations to their available authored room. Placement still depends on support and clearance.

| Formation | Form | Chance | Density | Vault fraction | Authored height |
|---|---|---:|---:|---:|---|
| `lava-lamp-waisted-columns` | `SPIRE` | `0.24` | `1` | `0.38` | 10–20 blocks |
| `lava-lamp-pendant-bulbs` | `SPIRE` | `0.42` | `1` | `0.3` | 8–16 blocks |
| `lava-lamp-mineral-drips` | `SPIRE` | `0.48` | `1` | `0.24` | 6–13 blocks |

## Ecology

The room-specific `carving/lava-lamp` CAVE pool selects bats and zombies in Overworld, or magma cubes and skeletons in Underworld. Its chunk cap is three entities, with one spawn attempt per three minutes per chunk and light levels `0..12`.

## Find the room

On Bukkit-family servers:

```text
/iris find subterrain lava-lamp-tubes radius=8192 teleport=false
/iris find underground-biome carving/lava-lamp radius=8192 teleport=false
/iris what biome
```

Generate fresh chunks to see the configured room. See [Authored Subterrain Features](/iris/15b-subterrain-features) for room settings and [Procedural Objects](/iris/17-procedural-objects) for formation settings.
