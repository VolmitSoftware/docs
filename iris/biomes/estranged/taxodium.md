---
title: "Biome Atlas — Taxodium Stand"
description: "Iris biome atlas entry for estranged/taxodium in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`estranged/taxodium` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `estranged` (Estranged) | 1 | 4 | 0.25 | 5.28% |
| Underworld 1005 | `estranged` (Underworld Estranged) | 1 | 3 | 0.3333 | 5.88% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

## Shared terrain

Both packs use the same generator links: `plain` (2..7), `rare-hills` (0..28); combined authored contribution `2..35` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:savanna`; native-structure derivative `minecraft:savanna`; custom identities `estranged_taxodium`.
- **Surface:** 1 block(s): `minecraft:grass_block`, `minecraft:coarse_dirt`, `minecraft:gravel`, `minecraft:podzol`; 2-3 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`. Wall palette: `minecraft:stone`, `minecraft:andesite`, `minecraft:cobblestone`.
- **Content:** 3 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:short_grass`, `minecraft:dead_bush`, `minecraft:brown_mushroom`. Procedural content: 1 trees (taxodium).

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:warped_forest`; native-structure derivative `minecraft:warped_forest`; custom identities `underworld_estranged_taxodium_218d7d2e`.
- **Surface:** 1 block(s): `minecraft:warped_nylium`, `minecraft:netherrack`, `minecraft:gravel`; 2-3 block(s): `minecraft:netherrack`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`, `minecraft:blackstone`.
- **Content:** 4 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:nether_sprouts`, `minecraft:warped_fungus`. Procedural content: 1 trees (taxodium).
- **Entity spawners:** `nether/surface/warped-forest`, `nether/cave`.

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.


## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome estranged/taxodium
/iris what biome
/iris what region
```

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
