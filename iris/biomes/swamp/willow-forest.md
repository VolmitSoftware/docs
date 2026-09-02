---
title: "Biome Atlas — Swamp Willow Forest"
description: "Iris biome atlas entry for swamp/willow-forest in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`swamp/willow-forest` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `swamp` (Swamp) | 1 | 1 | 1 | 11.67% |
| Underworld 1005 | `swamp` (Underworld Swamp) | 1 | 1 | 1 | 11.67% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `mountain` (4..11); combined authored contribution `4..11` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:swamp`; native-structure derivative `minecraft:dark_forest`; no custom or scatter identities.
- **Surface:** 1 block(s): `minecraft:grass_block`, `minecraft:podzol`; 2-4 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 6 object placement rule(s) drawing from 32 object key(s), including `trees/darkoak/generic1`, `trees/darkoak/generic2`, `trees/darkoak/generic3`, `trees/darkoak/generic5`, `trees/darkoak/generic6`, `trees/darkoak/generic7`, `trees/darkoak/generic8`, and 25 more. 3 decorator rule(s) using `minecraft:dead_bush`, `minecraft:crimson_fungus`, `minecraft:brown_mushroom`, `minecraft:red_mushroom`, `minecraft:short_grass`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:warped_forest`; native-structure derivative `minecraft:warped_forest`; custom identities `underworld_swamp_willow_forest_9ec04f6f`.
- **Surface:** 1 block(s): `minecraft:warped_nylium`; 2-4 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`.
- **Content:** 6 object placement rule(s) drawing from 32 object key(s), including `underworld/warped/trees/darkoak/generic1`, `underworld/warped/trees/darkoak/generic2`, `underworld/warped/trees/darkoak/generic3`, `underworld/warped/trees/darkoak/generic5`, `underworld/warped/trees/darkoak/generic6`, `underworld/warped/trees/darkoak/generic7`, `underworld/warped/trees/darkoak/generic8`, and 25 more. 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:warped_fungus`, `minecraft:crimson_fungus`, `minecraft:nether_sprouts`.
- **Entity spawners:** `nether/surface/warped-forest`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

The authored child list contains `swamp/denmyre` once, `swamp/marsh` once and `swamp/willow-forest-extended` three times; the parent itself is the sixth implicit option. All four biomes have rarity `1`, so the repeated extended key intentionally receives `3` of `6` immediate child slots (50%), while the parent, denmyre and marsh each receive `1` of `6` (16.67%). This affects selection inside an already-selected willow-forest root and does not add region-list weight.

Children that are also direct land roots have their own atlas pages: [`swamp/marsh`](/iris/biomes/swamp/marsh).

### Swamp Denmyre (`swamp/denmyre`)

This child-only biome is selected from `swamp/willow-forest`, not from a region list. Its rarity is `1`.
Its single child-list occurrence contributes `1` of `6` slots (16.67%) in the immediate choice; later child hops are resolved separately.

**Shared terrain:** `plain` (4..7); combined authored contribution `4..7` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:swamp` identity; surface 1 block(s): `minecraft:grass_block`; 1 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`; 4 object placement rule(s) drawing from 25 object key(s), including `clutter/bincluster1`, `trees/acacia/denmyre1`, `trees/acacia/denmyre2`, `trees/acacia/denmyre3`, `trees/acacia/denmyre4`, `trees/acacia/denmyre5`, `trees/acacia/denmyre6`, and 18 more. 4 decorator rule(s) using `minecraft:dead_bush`, `minecraft:brown_mushroom`, `minecraft:short_grass`, `minecraft:dark_oak_button`, `minecraft:tall_grass`.
- **Underworld 1005:** `minecraft:warped_forest` identity; surface 1 block(s): `minecraft:warped_nylium`; 1 block(s): `minecraft:netherrack`; 1-3 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`; 4 object placement rule(s) drawing from 25 object key(s), including `underworld/warped/clutter/bincluster1`, `underworld/warped/trees/acacia/denmyre1`, `underworld/warped/trees/acacia/denmyre2`, `underworld/warped/trees/acacia/denmyre3`, `underworld/warped/trees/acacia/denmyre4`, `underworld/warped/trees/acacia/denmyre5`, `underworld/warped/trees/acacia/denmyre6`, and 18 more. 5 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:warped_fungus`, `minecraft:nether_sprouts`, `minecraft:warped_button`.

### Swamp Willow Forest (`swamp/willow-forest-extended`)

This child-only biome is selected from `swamp/willow-forest`, not from a region list. Its rarity is `1`.
Its three repeated child-list occurrences contribute `3` of `6` slots (50%) in the immediate choice; later child hops are resolved separately.

**Shared terrain:** `mountain` (34..51); combined authored contribution `34..51` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:swamp` identity; surface 1 block(s): `minecraft:grass_block`, `minecraft:podzol`; 2-4 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`; 6 object placement rule(s) drawing from 32 object key(s), including `trees/darkoak/generic1`, `trees/darkoak/generic2`, `trees/darkoak/generic3`, `trees/darkoak/generic5`, `trees/darkoak/generic6`, `trees/darkoak/generic7`, `trees/darkoak/generic8`, and 25 more. 3 decorator rule(s) using `minecraft:dead_bush`, `minecraft:crimson_fungus`, `minecraft:brown_mushroom`, `minecraft:red_mushroom`, `minecraft:short_grass`.
- **Underworld 1005:** `minecraft:warped_forest` identity; surface 1 block(s): `minecraft:warped_nylium`; 2-4 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`; 6 object placement rule(s) drawing from 32 object key(s), including `underworld/warped/trees/darkoak/generic1`, `underworld/warped/trees/darkoak/generic2`, `underworld/warped/trees/darkoak/generic3`, `underworld/warped/trees/darkoak/generic5`, `underworld/warped/trees/darkoak/generic6`, `underworld/warped/trees/darkoak/generic7`, `underworld/warped/trees/darkoak/generic8`, and 25 more. 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:warped_fungus`, `minecraft:crimson_fungus`, `minecraft:nether_sprouts`.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome swamp/willow-forest
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
