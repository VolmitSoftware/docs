---
title: "Sculk Cathedral - Cave Biome"
description: "Paired Overworld and Underworld atlas entry for carving/sculk-cathedral"
published: true
date: 2026-10-09T16:52:52.000Z
tags: "iris, biome-atlas, cave, subterrain"
editor: markdown
dateCreated: 2026-10-04T12:29:38.588Z
---

`carving/sculk-cathedral` is selected through dimension `subterrainFeatures` in both built-in packs. A tall, irregular dark chamber opens around uneven stone banks. Creeping sculk, small amethyst clusters, pale mushrooms and hanging roots decorate its exposed surfaces.

## Selection and shape

The feature ID is `sculk-cathedrals`. Room frequency comes from its placement probability and spacing; biome rarity does not control these rooms. Both packs use the same room geometry and absolute Y band.

| Setting | Both packs |
|---|---|
| Geometry | `CENOTE` |
| Absolute world Y band | `-168..-68` |
| Placement spacing | `1280 blocks` |
| Placement probability | `0.18` |
| Vault height | `40 blocks` |
| Radius | `36 blocks` |
| Continuous pillar spacing | `0` |
| Roof and floor formation fraction | `0` |
| Shape variation (`shapeWarp`) | `1.0` |

| Treatment | Overworld | Underworld |
|---|---|---|
| Retained fluid | Dry | Dry |
| Solid room boundary | `minecraft:deepslate` | `minecraft:blackstone` |
| Derivative | `minecraft:deep_dark` | `minecraft:soul_sand_valley` |

Floors, roofs and retaining boundaries remain solid. Decorations fit within the room and leave its protected passages available.

## Overworld treatment

Deepslate and tuff dominate the rock, with sculk patches and occasional amethyst. Sculk veins and glow lichen spread across floor and ceiling patches; buds range from small growth to clusters, with occasional sculk sensors on the floor. Irregular amethyst clumps grow from both surfaces among low rock fragments, small pale mushrooms, hanging roots and short berry vines.

## Underworld treatment

Blackstone and basalt carry warped-wart and crying-obsidian patches. Glow lichen, glowstone accents, fungi on nylium and short weeping vines supply the smaller growth. Crying-obsidian clusters and warped fungi retain the matching irregular dimensions and placement rates.

## Decoration settings

Decorator `chance` controls the scatter rate with `STATIC` and acts as a noise threshold with `SIMPLEX`. A noise threshold is not a percentage of surfaces. Eligible decorators share each surface, and support, clearance and fluid requirements affect placement.

Procedural `chance` is a per-chunk placement roll; `density` is the number of attempts after that roll succeeds. Attempts can fail, so these settings do not guarantee an object count. Rubble is embedded one block into its support. Objects keep their authored sizes in larger rooms; crystal clusters use random shard directions.

| Placement | Kind | Surface | Chance | Density | Authored size |
|---|---|---|---:|---:|---|
| `sculk-buried-fragments` | BOULDER | Floor | `0.85` | `3` | 3–4 blocks high |
| `sculk-amethyst-clumps` | Random crystal cluster | Floor | `0.8` | `3` | 2–4 shards, 2–4 blocks long |
| `sculk-hanging-crystals` | Random crystal cluster | Ceiling | `0.75` | `2` | 2–4 shards, 2–4 blocks long |
| `sculk-pale-fungi` | FUNNEL fungus | Floor | `0.55` | `2` | 1–2-block stem; 1–2-block cap radius |

## Ecology

The `carving/sculk-cathedral` CAVE pool selects bats and occasional cave spiders in Overworld, or endermen and occasional skeletons in Underworld. It caps each chunk at three entities and allows one attempt per chunk every 45 seconds at light levels `0..12`. Dimension and region spawner scopes also apply.

## Find the room

On Bukkit-family servers:

```none
/iris find subterrain sculk-cathedrals radius=8192 teleport=false
/iris find underground-biome carving/sculk-cathedral radius=8192 teleport=false
/iris what biome
```

Generate fresh chunks to see the configured room. See [Authored Subterrain Features](/iris/15b-subterrain-features) for room settings and [Procedural Objects](/iris/17-procedural-objects) for formation settings.
