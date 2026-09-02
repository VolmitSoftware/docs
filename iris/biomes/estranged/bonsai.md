---
title: "Biome Atlas — Bonsai Hollow"
description: "Iris biome atlas entry for estranged/bonsai in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`estranged/bonsai` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `estranged` (Estranged) | 1 | 3 | 0.3333 | 7.04% |
| Underworld 1005 | `estranged` (Underworld Estranged) | 1 | 3 | 0.3333 | 5.88% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `plain` (2..6), `smooth-dunes` (0..6); combined authored contribution `2..12` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:forest`; native-structure derivative `minecraft:forest`; custom identities `estranged_bonsai`.
- **Surface:** 1 block(s): `minecraft:grass_block`, `minecraft:moss_block`, `minecraft:gravel`; 2 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:dirt`, `minecraft:stone`. Wall palette: `minecraft:stone`, `minecraft:andesite`, `minecraft:cobblestone`.
- **Content:** 5 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:short_grass`, `minecraft:moss_carpet`, `minecraft:oxeye_daisy`, `minecraft:azure_bluet`. Procedural content: 2 trees (bonsai-green, bonsai-blossom).

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:warped_forest`; native-structure derivative `minecraft:warped_forest`; custom identities `underworld_estranged_bonsai_4b4035b5`.
- **Surface:** 1 block(s): `minecraft:warped_nylium`, `minecraft:warped_wart_block`, `minecraft:gravel`; 2 block(s): `minecraft:netherrack`; 1-3 block(s): `minecraft:netherrack`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`, `minecraft:blackstone`.
- **Content:** 6 decorator rule(s) (3 shared snippet reference(s)) using `minecraft:nether_sprouts`, `minecraft:warped_roots`, `minecraft:warped_fungus`. Procedural content: 2 trees (bonsai-green, bonsai-blossom).
- **Entity spawners:** `nether/surface/warped-forest`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome estranged/bonsai
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
