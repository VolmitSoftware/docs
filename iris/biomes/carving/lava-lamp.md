---
title: "Ochre Hollows - Cave Biome"
description: "Paired Overworld and Underworld atlas entry for carving/lava-lamp"
published: true
date: 2026-10-09T16:52:52.000Z
tags: "iris, biome-atlas, cave, subterrain"
editor: markdown
dateCreated: 2026-10-04T12:29:38.588Z
---

`carving/lava-lamp` is selected through dimension `subterrainFeatures` beneath the Hot region in both built-in packs. A narrow lava stream runs through a winding passage with uneven banks, changing widths and an irregular roof. Dripstone, mushrooms, mineral clusters and hanging growth decorate the ochre rock.

## Selection and shape

The feature ID is `lava-lamp-tubes`. Its `allowedRegions: ["hot"]` restriction selects the Hot region in both packs. Room frequency comes from its placement probability and spacing; biome rarity does not control these rooms. Both packs use the same room geometry and absolute Y band.

| Setting | Both packs |
|---|---|
| Geometry | `LAVA_TUBE` |
| Allowed regions | `hot` |
| Absolute world Y band | `-172..-68` |
| Placement spacing | `1280 blocks` |
| Placement probability | `0.2` |
| Vault height | `29 blocks` |
| Radius | `19 blocks` |
| Continuous pillar spacing | `0` |
| Roof and floor formation fraction | `0` |
| Shape variation (`shapeWarp`) | `0.94` |
| Passage length | `152 blocks` |
| Underground chimney height | `0` |

| Treatment | Overworld | Underworld |
|---|---|---|
| Retained fluid | lava; 3 blocks deep | lava; 3 blocks deep |
| Solid room boundary | `minecraft:yellow_terracotta` | `minecraft:smooth_basalt` |
| Derivative | `minecraft:dripstone_caves` | `minecraft:basalt_deltas` |

Floors, roofs and retaining boundaries remain solid. Decorations fit within the room and leave its protected passages available.

## Overworld treatment

Dripstone and muted terracotta form the walls, with orange mineral patches and occasional basalt. The banks carry fallen mineral fragments, small calcite clusters, brown and red mushrooms, dry scrub and glow lichen. Pointed dripstone reaches three blocks from the floor and five from the ceiling; roots, weeping vines and occasional shroomlights hang between the mineral growth. Small funnel mushrooms provide scattered luminous gills.

## Underworld treatment

Smooth basalt and netherrack carry ochre terracotta patches. Quartz clusters and basalt rubble occupy the banks, with crimson roots on nylium and small warped fungi. Hanging roots become weeping vines; the shared dripstone, lichen and lighting rates preserve the scale of the Overworld treatment.

## Decoration settings

Decorator `chance` controls the scatter rate with `STATIC` and acts as a noise threshold with `SIMPLEX`. A noise threshold is not a percentage of surfaces. Eligible decorators share each surface, and support, clearance and fluid requirements affect placement.

Procedural `chance` is a per-chunk placement roll; `density` is the number of attempts after that roll succeeds. Attempts can fail, so these settings do not guarantee an object count. Rubble is embedded one block into its support. Objects keep their authored sizes in larger rooms; crystal clusters use random shard directions.

| Placement | Kind | Surface | Chance | Density | Authored size |
|---|---|---|---:|---:|---|
| `ochre-fallen-mineral` | BOULDER | Floor | `0.85` | `3` | 3–4 blocks high |
| `ochre-weathered-drips` | SPIRE | Ceiling | `0.8` | `2` | 3–5 blocks high |
| `ochre-mineral-fungi` | FUNNEL fungus | Floor | `0.65` | `2` | 1–2-block stem; 1–2-block cap radius |
| `ochre-mineral-flowers` | Random crystal cluster | Floor | `0.6` | `2` | 2–4 shards, 2–4 blocks long |

## Ecology

The room-specific `carving/lava-lamp` CAVE pool selects bats and zombies in Overworld, or magma cubes and skeletons in Underworld. Its chunk cap is three entities, with one spawn attempt per three minutes per chunk and light levels `0..12`.

## Find the room

On Bukkit-family servers:

```none
/iris find subterrain lava-lamp-tubes radius=8192 teleport=false
/iris find underground-biome carving/lava-lamp radius=8192 teleport=false
/iris what biome
```

Generate fresh chunks to see the configured room. See [Authored Subterrain Features](/iris/15b-subterrain-features) for room settings and [Procedural Objects](/iris/17-procedural-objects) for formation settings.
