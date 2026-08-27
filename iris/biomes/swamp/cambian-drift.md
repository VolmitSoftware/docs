---
title: "Biome Atlas — Swamp Cambian Drift"
description: "Iris biome atlas entry for swamp/cambian-drift in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`swamp/cambian-drift` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `swamp` (Swamp) | 1 | 1 | 1 | 11.67% |
| Underworld 1005 | `swamp` (Underworld Swamp) | 1 | 1 | 1 | 11.67% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

## Shared terrain

Both packs use the same generator links: `mountain` (-3..15); combined authored contribution `-3..15` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:dark_forest`; native-structure derivative `minecraft:dark_forest`; custom identities `swamp_cambian_drift`.
- **Surface:** 1 block(s): `minecraft:grass_block`, `minecraft:podzol`, `minecraft:coarse_dirt`; 1 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 7 object placement rule(s) drawing from 40 object key(s), including `trees/darkoak/talldrift1`, `trees/darkoak/talldrift2`, `trees/darkoak/talldrift3`, `trees/darkoak/talldrift4`, `trees/darkoak/talldrift5`, `trees/darkoak/talldrift6`, `trees/darkoak/talldrift7`, and 33 more. 3 decorator rule(s) using `minecraft:dead_bush`, `minecraft:brown_mushroom`, `minecraft:red_mushroom`, `minecraft:crimson_fungus`, `minecraft:short_grass`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:warped_forest`; native-structure derivative `minecraft:warped_forest`; custom identities `underworld_swamp_cambian_drift_2b80960d`.
- **Surface:** 1 block(s): `minecraft:warped_nylium`, `minecraft:netherrack`; 1 block(s): `minecraft:netherrack`; 1-3 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`.
- **Content:** 7 object placement rule(s) drawing from 40 object key(s), including `underworld/warped/trees/darkoak/talldrift1`, `underworld/warped/trees/darkoak/talldrift2`, `underworld/warped/trees/darkoak/talldrift3`, `underworld/warped/trees/darkoak/talldrift4`, `underworld/warped/trees/darkoak/talldrift5`, `underworld/warped/trees/darkoak/talldrift6`, `underworld/warped/trees/darkoak/talldrift7`, and 33 more. 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:warped_fungus`, `minecraft:crimson_fungus`, `minecraft:nether_sprouts`.
- **Entity spawners:** `nether/surface/warped-forest`, `nether/cave`.

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

## Children

### Swamp Cambian Drift (`swamp/cambian-drift-extended`)

This child-only biome is selected from `swamp/cambian-drift`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `1` of `2` slots (50.00%); later child hops are resolved separately.

**Shared terrain:** `mountain` (55..95); combined authored contribution `55..95` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:dark_forest` identity; surface 1 block(s): `minecraft:grass_block`, `minecraft:podzol`, `minecraft:coarse_dirt`; 1 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`; 7 object placement rule(s) drawing from 40 object key(s), including `trees/darkoak/talldrift1`, `trees/darkoak/talldrift2`, `trees/darkoak/talldrift3`, `trees/darkoak/talldrift4`, `trees/darkoak/talldrift5`, `trees/darkoak/talldrift6`, `trees/darkoak/talldrift7`, and 33 more. 3 decorator rule(s) using `minecraft:dead_bush`, `minecraft:brown_mushroom`, `minecraft:red_mushroom`, `minecraft:crimson_fungus`, `minecraft:short_grass`.
- **Underworld 1005:** `minecraft:warped_forest` identity; surface 1 block(s): `minecraft:warped_nylium`, `minecraft:netherrack`; 1 block(s): `minecraft:netherrack`; 1-3 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`; 7 object placement rule(s) drawing from 40 object key(s), including `underworld/warped/trees/darkoak/talldrift1`, `underworld/warped/trees/darkoak/talldrift2`, `underworld/warped/trees/darkoak/talldrift3`, `underworld/warped/trees/darkoak/talldrift4`, `underworld/warped/trees/darkoak/talldrift5`, `underworld/warped/trees/darkoak/talldrift6`, `underworld/warped/trees/darkoak/talldrift7`, and 33 more. 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:warped_fungus`, `minecraft:crimson_fungus`, `minecraft:nether_sprouts`.

## Floating variants

No floating child biomes are declared.


## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome swamp/cambian-drift
/iris what biome
/iris what region
```

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
