---
title: "Ember Vaults - Cave Biome"
description: "Paired Overworld and Underworld atlas entry for carving/ember-vaults"
published: true
date: 2026-10-05T16:28:23.269830+00:00
tags: "iris, biome-atlas, cave, subterrain"
editor: markdown
dateCreated: 2026-10-04T12:29:38.588Z
---

`carving/ember-vaults` is selected through dimension `subterrainFeatures` in both built-in packs. Dry basalt chambers have asymmetric lobed outlines, uneven ceilings and shallow mineral banks. Crimson growth, bent mushrooms, hanging vines and patches of light accompany the broken stone.

## Selection and shape

The feature ID is `ember-vaults`. Room frequency comes from its placement probability and spacing; biome rarity does not control these rooms. Both packs use the same room geometry and absolute Y band.

| Setting | Both packs |
|---|---|
| Geometry | `CENOTE` |
| Absolute world Y band | `-158..-60` |
| Placement spacing | `1024 blocks` |
| Placement probability | `0.2` |
| Vault height | `34 blocks` |
| Radius | `31 blocks` |
| Continuous pillar spacing | `0` |
| Roof and floor formation fraction | `0` |
| Shape variation (`shapeWarp`) | `0.96` |

| Treatment | Overworld | Underworld |
|---|---|---|
| Retained fluid | Dry | Dry |
| Solid room boundary | `minecraft:deepslate` | `minecraft:blackstone` |
| Derivative | `minecraft:dripstone_caves` | `minecraft:crimson_forest` |

Floors, roofs and retaining boundaries remain solid. Decorations fit within the room and leave its protected passages available.

## Overworld treatment

Smooth basalt and deepslate carry muted red terracotta and occasional magma patches. Brown and red mushrooms, crimson roots and fungi, dry scrub and glow lichen cover the floor among partly embedded scree. Weeping vines hang up to seven blocks, accompanied by short dripstone and occasional shroomlights. Small flat and funnel mushrooms have bent stems and scattered luminous gills.

## Underworld treatment

Blackstone and netherrack replace the deepslate and red terracotta. Crimson nylium supports roots and fungi; warped stems and Nether-wart caps form the larger mushrooms. Matching rubble, weeping vines, dripstone and lighting retain the same placement rates and dimensions.

## Decoration settings

Decorator `chance` controls the scatter rate with `STATIC` and acts as a noise threshold with `SIMPLEX`. A noise threshold is not a percentage of surfaces. Eligible decorators share each surface, and support, clearance and fluid requirements affect placement.

Procedural `chance` is a per-chunk placement roll; `density` is the number of attempts after that roll succeeds. Attempts can fail, so these settings do not guarantee an object count. Rubble is embedded one block into its support. Objects keep their authored sizes in larger rooms.

| Placement | Kind | Surface | Chance | Density | Authored size |
|---|---|---|---:|---:|---|
| `ember-fallen-scree` | BOULDER | Floor | `0.85` | `3` | 3–4 blocks high |
| `ember-cinder-fragments` | BOULDER | Floor | `0.85` | `2` | 3–4 blocks high |
| `ember-cinder-fungi` | FLAT fungus | Floor | `0.7` | `2` | 2–4-block stem; 1–2-block cap radius |
| `ember-small-shelf-fungi` | FUNNEL fungus | Floor | `0.55` | `2` | 1–2-block stem; 1–2-block cap radius |

## Ecology

The `carving/ember-vaults` CAVE pool selects skeletons and bats in Overworld, or skeletons and magma cubes in Underworld. It caps each chunk at three entities and permits one attempt per three minutes per chunk. Its light range is `0..7` in Overworld and `0..12` in Underworld.

## Find the room

On Bukkit-family servers:

```text
/iris find subterrain ember-vaults radius=8192 teleport=false
/iris find underground-biome carving/ember-vaults radius=8192 teleport=false
/iris what biome
```

Generate fresh chunks to see the configured room. See [Authored Subterrain Features](/iris/15b-subterrain-features) for room settings and [Procedural Objects](/iris/17-procedural-objects) for formation settings.
