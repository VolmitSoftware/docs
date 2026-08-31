---
title: "Biome Atlas — Hot Oasis"
description: "Iris biome atlas entry for hot/oasis in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`hot/oasis` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `hot` (Hot) | 1 | 1 | 1 | 5.83% |
| Underworld 1005 | `hot` (Underworld Hot) | 1 | 1 | 1 | 5.83% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `plain` (-2..7); combined authored contribution `-2..7` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:desert`; native-structure derivative `minecraft:desert`; no custom or scatter identities.
- **Surface:** 5 block(s): `minecraft:grass_block`, `minecraft:moss_block`. Wall palette: none.
- **Content:** 3 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:cactus`, `minecraft:dead_bush`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:nether_wastes`; native-structure derivative `minecraft:nether_wastes`; custom identities `underworld_hot_oasis_4941ce39`.
- **Surface:** 5 block(s): `minecraft:netherrack`, `minecraft:nether_wart_block`. Wall palette: none.
- **Content:** 4 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:crimson_stem`, `minecraft:crimson_fungus`.
- **Entity spawners:** `nether/surface/nether-wastes`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome hot/oasis
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
