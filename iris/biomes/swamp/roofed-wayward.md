---
title: "Biome Atlas — Swamp Roofed Wayward"
description: "Iris biome atlas entry for swamp/roofed-wayward in Overworld 4007 and Underworld 1010"
published: true
date: 2026-09-08T16:43:54.130Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`swamp/roofed-wayward` is a directly selected land biome in the current Overworld 4007 and Underworld 1010 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4007 | `swamp` (Swamp) | 1 | 1 | 1 | 11.67% |
| Underworld 1010 | `swamp` (Underworld Swamp) | 1 | 1 | 1 | 11.67% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `plain` (4..11); combined authored contribution `4..11` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## 3D terrain

Overworld 4007 and Underworld 1010 share these `terrain3D` settings. Amplitude, feature scales, and crack dimensions use blocks.
The slope gate uses rise divided by horizontal distance. Strength reaches its configured value at the full slope.

| Biome | Treatment | Amplitude | Horizontal / vertical scale | Crack depth / width / scale | Slope start / full |
|---|---|---:|---|---|---|
| `swamp/roofed-wayward` | Protected | 0 | None | None | None |
| `swamp/roofed-wayward-extended` | Forest | 30 | 160 / 28 | 8 / 3 / 256 | 0.2 / 0.55 |

Active profiles use Simplex density and crack noise. Deformation starts above fluid level plus 8 blocks and fades across 24 blocks of base elevation.
Each pack retains its own materials, decoration, objects, and ores. Floating islands keep their separate shape settings.

- `swamp/roofed-wayward`: Low wetland forest retains its floor. Its elevated child supplies rock shelves.

## Overworld 4007 treatment

- **Minecraft identity:** derivative `minecraft:swamp`; native-structure derivative `minecraft:dark_forest`; no custom or scatter identities.
- **Surface:** 1 block(s): `minecraft:grass_block`, `minecraft:coarse_dirt`; 2-4 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`.
- **Content:** 8 object placement rule(s) drawing from 53 object key(s), including `trees/oak/troofed1`, `trees/oak/troofed2`, `trees/oak/troofed3`, `trees/oak/troofed4`, `trees/oak/troofed5`, `trees/oak/troofed6`, `trees/oak/troofed7`, and 46 more. 3 decorator rule(s) using `minecraft:dead_bush`, `minecraft:brown_mushroom`, `minecraft:red_mushroom`, `minecraft:crimson_fungus`, `minecraft:short_grass`.

## Underworld 1010 treatment

- **Minecraft identity:** derivative `minecraft:warped_forest`; native-structure derivative `minecraft:warped_forest`; custom identities `underworld_swamp_roofed_wayward_0dc9dae2`.
- **Surface:** 1 block(s): `minecraft:warped_nylium`, `minecraft:netherrack`; 2-4 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`.
- **Content:** 8 object placement rule(s) drawing from 53 object key(s), including `underworld/warped/trees/oak/troofed1`, `underworld/warped/trees/oak/troofed2`, `underworld/warped/trees/oak/troofed3`, `underworld/warped/trees/oak/troofed4`, `underworld/warped/trees/oak/troofed5`, `underworld/warped/trees/oak/troofed6`, `underworld/warped/trees/oak/troofed7`, and 46 more. 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:warped_fungus`, `minecraft:crimson_fungus`, `minecraft:nether_sprouts`.
- **Entity spawners:** `nether/surface/warped-forest`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

Children that are also direct land roots have their own atlas pages: [`swamp/sea/lake`](/iris/biomes/swamp/sea/lake).

### Swamp Roofed Wayward (`swamp/roofed-wayward-extended`)

This child-only biome is selected from `swamp/roofed-wayward`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `1` of `3` slots (33.33%); later child hops are resolved separately.

**Shared terrain:** `mountain` (50..71); combined authored contribution `50..71` blocks relative to fluid height.

- **Overworld 4007:** `minecraft:swamp` identity; surface 1 block(s): `minecraft:grass_block`, `minecraft:coarse_dirt`; 2-4 block(s): `minecraft:dirt`, `minecraft:coarse_dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`; 8 object placement rule(s) drawing from 53 object key(s), including `trees/oak/troofed1`, `trees/oak/troofed2`, `trees/oak/troofed3`, `trees/oak/troofed4`, `trees/oak/troofed5`, `trees/oak/troofed6`, `trees/oak/troofed7`, and 46 more. 3 decorator rule(s) using `minecraft:dead_bush`, `minecraft:brown_mushroom`, `minecraft:red_mushroom`, `minecraft:crimson_fungus`, `minecraft:short_grass`.
- **Underworld 1010:** `minecraft:warped_forest` identity; surface 1 block(s): `minecraft:warped_nylium`, `minecraft:netherrack`; 2-4 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`; 8 object placement rule(s) drawing from 53 object key(s), including `underworld/warped/trees/oak/troofed1`, `underworld/warped/trees/oak/troofed2`, `underworld/warped/trees/oak/troofed3`, `underworld/warped/trees/oak/troofed4`, `underworld/warped/trees/oak/troofed5`, `underworld/warped/trees/oak/troofed6`, `underworld/warped/trees/oak/troofed7`, and 46 more. 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:warped_fungus`, `minecraft:crimson_fungus`, `minecraft:nether_sprouts`.

Direct-root children continue on their own pages: [`swamp/sea/lake`](/iris/biomes/swamp/sea/lake).

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome swamp/roofed-wayward
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
