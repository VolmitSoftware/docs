---
title: "Biome Atlas — Crimson Mushroom Swamp"
description: "Iris biome atlas entry for mushroom/crimson-forest in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`mushroom/crimson-forest` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `mushroom` (Mushroom) | 1 | 2 | 0.5 | 12.50% |
| Underworld 1005 | `mushroom` (Underworld Mushroom) | 1 | 2 | 0.5 | 12.50% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `plain-cliffs` (4..25); combined authored contribution `4..25` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:crimson_forest`; native-structure derivative `minecraft:mushroom_fields`; custom identities `mushroom_crimson_forest`.
- **Surface:** 1 block(s): `minecraft:crimson_nylium`; 8-9 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:crimson_hyphae`.
- **Content:** 6 object placement rule(s) drawing from 27 object key(s), including `trees/mushroom/mushclut1`, `trees/mushroom/mushclut2`, `trees/mushroom/mushclut3`, `trees/mushroom/mushclut4`, `trees/mushroom/mushclut5`, `trees/mushroom/mushclut6`, `trees/mushroom/mushclut7`, and 20 more. 3 decorator rule(s) using `minecraft:polished_blackstone_button`, `minecraft:crimson_button`, `minecraft:crimson_fungus`, `minecraft:crimson_roots`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:crimson_forest`; native-structure derivative `minecraft:crimson_forest`; custom identities `underworld_mushroom_crimson_forest_e2558e59`.
- **Surface:** 1 block(s): `minecraft:crimson_nylium`; 8-9 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`. Wall palette: `minecraft:crimson_hyphae`.
- **Content:** 6 object placement rule(s) drawing from 27 object key(s), including `underworld/crimson/trees/mushroom/mushclut1`, `underworld/crimson/trees/mushroom/mushclut2`, `underworld/crimson/trees/mushroom/mushclut3`, `underworld/crimson/trees/mushroom/mushclut4`, `underworld/crimson/trees/mushroom/mushclut5`, `underworld/crimson/trees/mushroom/mushclut6`, `underworld/crimson/trees/mushroom/mushclut7`, and 20 more. 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:polished_blackstone_button`, `minecraft:crimson_button`, `minecraft:crimson_fungus`, `minecraft:crimson_roots`.
- **Entity spawners:** `nether/surface/crimson-forest`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

### Crimson Mushroom Swamp (`mushroom/crimson-forest-extended`)

This child-only biome is selected from `mushroom/crimson-forest`, not from a region list. Its rarity is `2`.
In that immediate child choice it contributes `1` of `2` slots (50.00%); later child hops are resolved separately.

**Shared terrain:** `plain-cliffs` (54..95); combined authored contribution `54..95` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:crimson_forest` identity; surface 1 block(s): `minecraft:crimson_nylium`; 8-9 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`; 6 object placement rule(s) drawing from 27 object key(s), including `trees/mushroom/mushclut1`, `trees/mushroom/mushclut2`, `trees/mushroom/mushclut3`, `trees/mushroom/mushclut4`, `trees/mushroom/mushclut5`, `trees/mushroom/mushclut6`, `trees/mushroom/mushclut7`, and 20 more. 3 decorator rule(s) using `minecraft:polished_blackstone_button`, `minecraft:crimson_button`, `minecraft:crimson_fungus`, `minecraft:crimson_roots`.
- **Underworld 1005:** `minecraft:crimson_forest` identity; surface 1 block(s): `minecraft:crimson_nylium`; 8-9 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`; 6 object placement rule(s) drawing from 27 object key(s), including `underworld/crimson/trees/mushroom/mushclut1`, `underworld/crimson/trees/mushroom/mushclut2`, `underworld/crimson/trees/mushroom/mushclut3`, `underworld/crimson/trees/mushroom/mushclut4`, `underworld/crimson/trees/mushroom/mushclut5`, `underworld/crimson/trees/mushroom/mushclut6`, `underworld/crimson/trees/mushroom/mushclut7`, and 20 more. 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:polished_blackstone_button`, `minecraft:crimson_button`, `minecraft:crimson_fungus`, `minecraft:crimson_roots`.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome mushroom/crimson-forest
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
