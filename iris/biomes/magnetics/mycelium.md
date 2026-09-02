---
title: "Biome Atlas — Magnetics Mycelium"
description: "Iris biome atlas entry for magnetics/mycelium in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`magnetics/mycelium` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `magnetics` (The Magnetics) | 1 | 1 | 1 | 16.67% |
| Underworld 1005 | `magnetics` (Underworld The Magnetics) | 1 | 1 | 1 | 16.67% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `magnetics/mycelium` (-3..15); combined authored contribution `-3..15` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:mushroom_fields`; native-structure derivative `minecraft:mushroom_fields`; no custom or scatter identities.
- **Surface:** 1 block(s): `minecraft:mycelium`, `minecraft:podzol`; 1-3 block(s): `minecraft:rooted_dirt`, `minecraft:dirt`, `minecraft:muddy_mangrove_roots`; 3-6 block(s): `minecraft:mud`, `minecraft:packed_mud`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:tuff`, `minecraft:deepslate`, `minecraft:cobbled_deepslate`, `minecraft:stone`. Wall palette: `minecraft:tuff`, `minecraft:cobbled_deepslate`, `minecraft:deepslate`, `minecraft:mud`.
- **Content:** 2 object placement rule(s) drawing from 17 object key(s), including `trees/mushroom/browngeneric1`, `trees/mushroom/browngeneric2`, `trees/mushroom/redgeneric3`, `trees/mushroom/redgeneric4`, `trees/mushroom/redgeneric5`, `trees/mushroom/redgeneric6`, `trees/mushroom/redgeneric7`, and 10 more. 2 decorator rule(s) using `minecraft:red_mushroom`, `minecraft:brown_mushroom`, `minecraft:mycelium`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:basalt_deltas`; native-structure derivative `minecraft:basalt_deltas`; custom identities `underworld_magnetics_mycelium_84a68fb4`.
- **Surface:** 1 block(s): `minecraft:basalt`; 1-3 block(s): `minecraft:blackstone`; 3-6 block(s): `minecraft:blackstone`; 6-18 block(s): `minecraft:blackstone`. Wall palette: `minecraft:blackstone`.
- **Content:** 2 object placement rule(s) drawing from 17 object key(s), including `underworld/basalt/trees/mushroom/browngeneric1`, `underworld/basalt/trees/mushroom/browngeneric2`, `underworld/basalt/trees/mushroom/redgeneric3`, `underworld/basalt/trees/mushroom/redgeneric4`, `underworld/basalt/trees/mushroom/redgeneric5`, `underworld/basalt/trees/mushroom/redgeneric6`, `underworld/basalt/trees/mushroom/redgeneric7`, and 10 more. 3 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:crimson_fungus`, `minecraft:basalt`.
- **Entity spawners:** `nether/surface/basalt-deltas`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

- **Overworld 4002: [`mushroom/forest`](/iris/biomes/mushroom/forest):** rarity `1`, altitude `95..145` blocks above the surface, top mode `NOISE`, maximum thickness `72`, carving biome `carving/mushroom`; decorators inherit and objects inherit.
- **Underworld 1005: [`mushroom/forest`](/iris/biomes/mushroom/forest):** rarity `1`, altitude `95..145` blocks above the surface, top mode `NOISE`, maximum thickness `72`, carving biome `carving/mushroom`; decorators inherit and objects inherit.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome magnetics/mycelium
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
