---
title: "Frost Vaults - Cave Biome"
description: "Paired Overworld and Underworld atlas entry for carving/frost-vaults"
published: true
date: 2026-10-09T16:52:52.000Z
tags: "iris, biome-atlas, cave, subterrain"
editor: markdown
dateCreated: 2026-10-04T12:29:38.588Z
---

`carving/frost-vaults` is selected through dimension `subterrainFeatures` in both built-in packs. Asymmetric pale chambers have uneven ice-lined roofs and banks. Layered snow, broken ice, small mineral growth and isolated thaw vegetation decorate the rock.

## Selection and shape

The feature ID is `frost-vaults`. Room frequency comes from its placement probability and spacing; biome rarity does not control these rooms. Both packs use the same room geometry and absolute Y band.

| Setting | Both packs |
|---|---|
| Geometry | `CENOTE` |
| Absolute world Y band | `-104..-20` |
| Placement spacing | `1152 blocks` |
| Placement probability | `0.2` |
| Vault height | `36 blocks` |
| Radius | `32 blocks` |
| Continuous pillar spacing | `0` |
| Roof and floor formation fraction | `0` |
| Shape variation (`shapeWarp`) | `0.96` |

| Treatment | Overworld | Underworld |
|---|---|---|
| Retained fluid | Dry | Dry |
| Solid room boundary | `minecraft:calcite` | `minecraft:quartz_block` |
| Derivative | `minecraft:frozen_peaks` | `minecraft:soul_sand_valley` |

Floors, roofs and retaining boundaries remain solid. Decorations fit within the room and leave its protected passages available.

## Overworld treatment

Calcite, packed ice and stone form broad muted patches with small blue-ice accents. Snow varies from one to three layers, with glow lichen and amethyst buds across the exposed surfaces. Partly embedded fragments, short icicles and irregular ice clusters occur on the floor and ceiling. Small mushrooms, grass and ferns occupy mossy thaw patches; roots and short berry vines hang above them.

## Underworld treatment

Quartz, blackstone, smooth basalt and soul soil replace the ice and snow palette. Nylium patches support sprouts, roots and small fungi, while glowstone and glow lichen provide light. Quartz and basalt clusters, short mineral pendants and weeping vines accompany the white-ash ambience.

## Decoration settings

Decorator `chance` controls the scatter rate with `STATIC` and acts as a noise threshold with `SIMPLEX`. A noise threshold is not a percentage of surfaces. Eligible decorators share each surface, and support, clearance and fluid requirements affect placement.

Procedural `chance` is a per-chunk placement roll; `density` is the number of attempts after that roll succeeds. Attempts can fail, so these settings do not guarantee an object count. Rubble is embedded one block into its support. Objects keep their authored sizes in larger rooms; crystal clusters use random shard directions.

| Placement | Kind | Surface | Chance | Density | Authored size |
|---|---|---|---:|---:|---|
| `frost-thaw-fragments` | BOULDER | Floor | `0.85` | `3` | 3–4 blocks high |
| `frost-short-icicles` | SPIRE | Ceiling | `0.8` | `2` | 3–5 blocks high |
| `frost-shattered-ice` | Random crystal cluster | Floor | `0.7` | `2` | 2–4 shards, 2–4 blocks long |
| `frost-hanging-ice-splinters` | Random crystal cluster | Ceiling | `0.7` | `2` | 2–4 shards, 2–4 blocks long |
| `frost-thaw-fungi` | FUNNEL fungus | Floor | `0.4` | `1` | 1–2-block stem; 1–2-block cap radius |

## Ecology

The `carving/frost-vaults` CAVE pool selects strays and bats in Overworld, or skeletons and endermen in Underworld. It caps each chunk at three entities and permits one attempt per chunk every 40 seconds, within light levels `0..7`. The registered biome declares an empty native spawn table.

## Find the room

On Bukkit-family servers:

```none
/iris find subterrain frost-vaults radius=8192 teleport=false
/iris find underground-biome carving/frost-vaults radius=8192 teleport=false
/iris what biome
```

Generate fresh chunks to see the configured room. See [Authored Subterrain Features](/iris/15b-subterrain-features) for room settings and [Procedural Objects](/iris/17-procedural-objects) for formation settings.
