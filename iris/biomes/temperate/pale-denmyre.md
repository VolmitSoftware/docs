---
title: "Biome Atlas — Pale Denmyre"
description: "Iris biome atlas entry for temperate/pale-denmyre in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`temperate/pale-denmyre` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `temperate` (Temperate) | 1 | 5 | 0.2 | 1.23% |
| Underworld 1005 | `temperate` (Underworld Temperate) | 1 | 5 | 0.2 | 1.23% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

## Shared terrain

Both packs use the same generator links: `plain` (4..8), `rare-hills` (0..12); combined authored contribution `4..20` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:dark_forest`; native-structure derivative `minecraft:pale_garden`; custom identities `pale_denmyre`.
- **Surface:** 1 block(s): `minecraft:pale_moss_block`, `minecraft:mud`, `minecraft:rooted_dirt`; 2-4 block(s): `minecraft:dirt`, `minecraft:mud`, `minecraft:calcite`; 6-18 block(s): `minecraft:stone`, `minecraft:tuff`, `minecraft:calcite`. Wall palette: `minecraft:stone`, `minecraft:calcite`, `minecraft:tuff`.
- **Content:** 2 object placement rule(s) drawing from 22 object key(s), including `trees/darkoak/denmyre1`, `trees/darkoak/denmyre2`, `trees/darkoak/denmyre3`, `trees/darkoak/denmyre4`, `trees/darkoak/denmyre5`, `trees/darkoak/denmyre6`, `trees/darkoak/denmyre7`, and 15 more. 3 decorator rule(s) using `minecraft:pale_moss_carpet`, `minecraft:air`, `minecraft:closed_eyeblossom`, `minecraft:open_eyeblossom`, `minecraft:brown_mushroom`, `minecraft:red_mushroom`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:warped_forest`; native-structure derivative `minecraft:warped_forest`; custom identities `underworld_temperate_pale_denmyre_33ec4b0d`.
- **Surface:** 1 block(s): `minecraft:warped_wart_block`, `minecraft:netherrack`; 2-4 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`. Wall palette: `minecraft:netherrack`.
- **Content:** 2 object placement rule(s) drawing from 22 object key(s), including `underworld/warped/trees/darkoak/denmyre1`, `underworld/warped/trees/darkoak/denmyre2`, `underworld/warped/trees/darkoak/denmyre3`, `underworld/warped/trees/darkoak/denmyre4`, `underworld/warped/trees/darkoak/denmyre5`, `underworld/warped/trees/darkoak/denmyre6`, `underworld/warped/trees/darkoak/denmyre7`, and 15 more. 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:nether_sprouts`, `minecraft:air`, `minecraft:warped_roots`, `minecraft:warped_fungus`.
- **Entity spawners:** `nether/surface/warped-forest`, `nether/cave`.

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.


## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome temperate/pale-denmyre
/iris what biome
/iris what region
```

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
