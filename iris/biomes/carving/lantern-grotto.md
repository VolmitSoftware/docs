---
title: "Lantern Grotto - Cave Biome"
description: "Paired Overworld and Underworld atlas entry for carving/lantern-grotto"
published: true
date: 2026-10-05T16:28:23.269830+00:00
tags: "iris, biome-atlas, cave, subterrain"
editor: markdown
dateCreated: 2026-10-04T12:29:38.588Z
---

`carving/lantern-grotto` is selected through dimension `subterrainFeatures` in both built-in packs. An irregular planted chamber surrounds a shallow contained pool. Mossy banks, small mushrooms and calcite growth sit beneath leaf clusters, roots and berry vines.

## Selection and shape

The feature ID is `lantern-grottos`. Room frequency comes from its placement probability and spacing; biome rarity does not control these rooms. Both packs use the same room geometry and absolute Y band.

| Setting | Both packs |
|---|---|
| Geometry | `CENOTE` |
| Absolute world Y band | `-110..-24` |
| Placement spacing | `896 blocks` |
| Placement probability | `0.22` |
| Vault height | `28 blocks` |
| Radius | `28 blocks` |
| Continuous pillar spacing | `0` |
| Roof and floor formation fraction | `0` |
| Shape variation (`shapeWarp`) | `0.92` |

| Treatment | Overworld | Underworld |
|---|---|---|
| Retained fluid | water; 3 blocks deep | lava; 3 blocks deep |
| Solid room boundary | `minecraft:moss_block` | `minecraft:warped_nylium` |
| Derivative | `minecraft:lush_caves` | `minecraft:warped_forest` |

Floors, roofs and retaining boundaries remain solid. Decorations fit within the room and leave its protected passages available.

## Overworld treatment

Stone, moss and clay form the banks, with occasional calcite. Moss carpet, grass, ferns, azaleas, flowering azaleas and dripleaves grow beside mushrooms and partly embedded rubble. Berry vines hang up to eight blocks, with hanging roots, short persistent azalea-leaf clusters, spore blossoms and glow lichen. Bent mushrooms with small caps and luminous gills occur alongside compact calcite clusters.

## Underworld treatment

Blackstone, warped nylium, soul soil and quartz line the matching lava basin. Roots, sprouts and fungi grow on nylium patches, with warped and Nether-wart clusters above them. Weeping vines replace berry vines, while shroomlights replace spore blossoms; warped-stem mushrooms and quartz growth share the Overworld object dimensions.

## Decoration settings

Decorator `chance` controls the scatter rate with `STATIC` and acts as a noise threshold with `SIMPLEX`. A noise threshold is not a percentage of surfaces. Eligible decorators share each surface, and support, clearance and fluid requirements affect placement.

Procedural `chance` is a per-chunk placement roll; `density` is the number of attempts after that roll succeeds. Attempts can fail, so these settings do not guarantee an object count. Rubble is embedded one block into its support. Objects keep their authored sizes in larger rooms; crystal clusters use random shard directions.

| Placement | Kind | Surface | Chance | Density | Authored size |
|---|---|---|---:|---:|---|
| `lantern-mossy-rubble` | BOULDER | Floor | `0.85` | `3` | 3–4 blocks high |
| `lantern-moss-fungi` | FLAT fungus | Floor | `0.85` | `2` | 2–4-block stem; 1–2-block cap radius |
| `lantern-red-fungi` | FUNNEL fungus | Floor | `0.6` | `2` | 1–2-block stem; 1–2-block cap radius |
| `lantern-calcite-growth` | Random crystal cluster | Floor | `0.5` | `1` | 2–4 shards, 2–4 blocks long |

## Ecology

The `subterrain/lantern-grotto` CAVE spawner supplies glow squid and bats in Overworld, or striders and endermen in Underworld. It caps each chunk at four entities and allows one attempt per chunk every 45 seconds at light levels `0..15`. Aquatic templates require the corresponding water or lava; bats and endermen use land placements.

## Find the room

On Bukkit-family servers:

```text
/iris find subterrain lantern-grottos radius=8192 teleport=false
/iris find underground-biome carving/lantern-grotto radius=8192 teleport=false
/iris what biome
```

Generate fresh chunks to see the configured room. See [Authored Subterrain Features](/iris/15b-subterrain-features) for room settings and [Procedural Objects](/iris/17-procedural-objects) for formation settings.
