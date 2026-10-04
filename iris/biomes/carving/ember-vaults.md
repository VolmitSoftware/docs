---
title: "Ember Vaults - Cave Biome"
description: "Paired Overworld and Underworld atlas entry for carving/ember-vaults"
published: true
date: 2026-10-04T12:47:19.912Z
tags: "iris, biome-atlas, cave, subterrain"
editor: markdown
dateCreated: 2026-10-04T12:29:38.588Z
---

`carving/ember-vaults` is selected through dimension `subterrainFeatures` in both built-in packs. Dry, domed black-and-red galleries contain irregular arches, basalt ribs and hanging cinder formations. Continuous room pillars frame the open floor. Rock arches and basalt ribs extend supported feet to the cave floor, while cinder drips use narrow roof attachments.

## Selection and shape

The feature ID is `ember-vaults`. Room frequency comes from its placement probability and spacing; biome rarity does not control these rooms. Both packs use the same room geometry and absolute Y band.

| Setting | Both packs |
|---|---|
| Geometry | `CENOTE` |
| Absolute world Y band | `-158..-60` |
| Placement spacing | `448 blocks` |
| Placement probability | `0.24` |
| Vault height | `50 blocks` |
| Radius | `44 blocks` |
| Continuous pillar spacing | `30 blocks` |
| Roof and floor formation fraction | `0.08` |

| Treatment | Overworld | Underworld |
|---|---|---|
| Retained fluid | Dry | Dry |
| Solid room boundary | `minecraft:deepslate` | `minecraft:blackstone` |
| Derivative | `minecraft:dripstone_caves` | `minecraft:crimson_forest` |

Floors, roofs and retaining boundaries remain solid. Decorations fit within the room and leave its protected passages available.

## Overworld treatment

Deepslate and smooth basalt walls carry red terracotta and sparse magma patches. Basalt ribs terminate in magma, while red hanging mineral drips, weeping vines, crimson roots and occasional red mushrooms populate the edges.

## Underworld treatment

Blackstone, smooth basalt and netherrack replace the Overworld rock treatment. The matching arches, ribs and drips retain their dimensions, with magma highlights and crimson vegetation.

## Formation settings

The placement chance is per chunk; density is the number of attempts after that chance passes. Vault fractions size formations to their available authored room. Placement still depends on support and clearance.

| Formation | Form | Chance | Density | Vault fraction | Authored height |
|---|---|---:|---:|---:|---|
| `ember-vault-organic-arches` | `ARCH` | `0.075` | `1` | `0.38` | 9–17 blocks |
| `ember-vault-basalt-ribs` | `BASALT_COLUMN` | `0.16` | `1` | `0.27` | 6–13 blocks |
| `ember-vault-hanging-cinders` | `SPIRE` | `0.23` | `1` | `0.19` | 4–10 blocks |

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
