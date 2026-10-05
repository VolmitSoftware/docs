---
title: "Travertine Gardens - Cave Biome"
description: "Paired Overworld and Underworld atlas entry for carving/travertine-gardens"
published: true
date: 2026-10-05T16:28:23.269830+00:00
tags: "iris, biome-atlas, cave, subterrain"
editor: markdown
dateCreated: 2026-10-04T12:29:38.588Z
---

`carving/travertine-gardens` is selected through dimension `subterrainFeatures` in both built-in packs. Four shallow mineral basins descend through a winding gallery with uneven roofs and curved retaining edges. Mossy banks, dripleaves, mushrooms and calcite growth surround the pools beneath hanging roots and vines.

## Selection and shape

The feature ID is `travertine-gardens`. Room frequency comes from its placement probability and spacing; biome rarity does not control these rooms. Both packs use the same room geometry and absolute Y band.

| Setting | Both packs |
|---|---|
| Geometry | `TRAVERTINE_TERRACES` |
| Absolute world Y band | `-150..-52` |
| Placement spacing | `1152 blocks` |
| Placement probability | `0.2` |
| Vault height | `30 blocks` |
| Radius | `19 blocks` |
| Continuous pillar spacing | `0` |
| Roof and floor formation fraction | `0` |
| Shape variation (`shapeWarp`) | `0.9` |
| Passage length | `112 blocks` |
| Basin count | `4` |

| Treatment | Overworld | Underworld |
|---|---|---|
| Retained fluid | water; 2 blocks deep | lava; 2 blocks deep |
| Solid room boundary | `minecraft:calcite` | `minecraft:quartz_block` |
| Derivative | `minecraft:lush_caves` | `minecraft:warped_forest` |

Floors, roofs and retaining boundaries remain solid. Decorations fit within the room and leave its protected passages available.

## Overworld treatment

Calcite, dripstone and clay form the pale mineral banks. Moss carpet, grass, ferns, azaleas, dripleaves and mushrooms occupy patches beside low bank fragments and irregular calcite clusters. Pointed dripstone reaches two blocks from the floor and four from the ceiling. Berry vines hang up to seven blocks among roots, spore blossoms and glow lichen; small bent mushrooms carry scattered luminous gills.

## Underworld treatment

Quartz, smooth basalt and soul soil line the coordinate-matched lava basins. Warped roots, sprouts and fungi grow on nylium patches, with small warped-stem mushrooms and quartz clusters. Weeping vines and shroomlights accompany the matching dripstone and glow-lichen decoration.

## Decoration settings

Decorator `chance` controls the scatter rate with `STATIC` and acts as a noise threshold with `SIMPLEX`. A noise threshold is not a percentage of surfaces. Eligible decorators share each surface, and support, clearance and fluid requirements affect placement.

Procedural `chance` is a per-chunk placement roll; `density` is the number of attempts after that roll succeeds. Attempts can fail, so these settings do not guarantee an object count. Rubble is embedded one block into its support. Objects keep their authored sizes in larger rooms; crystal clusters use random shard directions.

| Placement | Kind | Surface | Chance | Density | Authored size |
|---|---|---|---:|---:|---|
| `travertine-weathered-banks` | BOULDER | Floor | `0.85` | `3` | 3–4 blocks high |
| `travertine-short-pendants` | SPIRE | Ceiling | `0.8` | `2` | 3–4 blocks high |
| `travertine-bank-fungi` | FLAT fungus | Floor | `0.7` | `2` | 2–4-block stem; 1–2-block cap radius |
| `travertine-small-fungi` | FUNNEL fungus | Floor | `0.5` | `1` | 1–2-block stem; 1–2-block cap radius |
| `travertine-calcite-blossoms` | Random crystal cluster | Floor | `0.65` | `2` | 2–4 shards, 2–4 blocks long |

## Ecology

The `carving/travertine-gardens` CAVE spawner caps each chunk at three entities and permits one attempt every 40 seconds within light levels `0..12`. Overworld selects glow squid in water and bats on land; Underworld selects striders in lava and endermen on land. The registered biome declares an empty native spawn table.

## Find the room

On Bukkit-family servers:

```text
/iris goto biome biome=carving/travertine-gardens
/iris find subterrain travertine-gardens radius=8192 teleport=false
/iris find underground-biome carving/travertine-gardens radius=8192 teleport=false
/iris what biome
```

Generate fresh chunks to see the configured room. See [Authored Subterrain Features](/iris/15b-subterrain-features) for room settings and [Procedural Objects](/iris/17-procedural-objects) for formation settings.
