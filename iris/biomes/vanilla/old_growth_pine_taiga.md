---
title: "Biome Atlas — Old Growth Pine Taiga"
description: "Iris biome atlas entry for vanilla/old_growth_pine_taiga in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`vanilla/old_growth_pine_taiga` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `forests` (Forests) | 1 | 1 | 1 | 11.46% |
| Underworld 1005 | `forests` (Underworld Forests) | 1 | 1 | 1 | 11.46% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `mountain` (106..175); combined authored contribution `106..175` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:old_growth_pine_taiga`; native-structure derivative `minecraft:old_growth_pine_taiga`; custom identities `old_growth_pine_taiga`.
- **Surface:** 1 block(s) at slope 0-2.6: `minecraft:grass_block`; 2-4 block(s) at slope >= 3.95: `minecraft:gravel`, `minecraft:cyan_terracotta`; 2-4 block(s) at slope >= 3.95: `minecraft:stone`, `minecraft:cobblestone`; 1 block(s) at slope 0-4: `minecraft:grass_block`; 3 block(s) at slope 0-3: `minecraft:dirt`. Wall palette: `minecraft:stone`, `minecraft:andesite`, `minecraft:gravel`, `minecraft:cyan_terracotta`.
- **Content:** 3 decorator rule(s) using `minecraft:dandelion`, `minecraft:poppy`, `minecraft:blue_orchid`, `minecraft:allium`, `minecraft:azure_bluet`, `minecraft:red_tulip`, `minecraft:orange_tulip`, `minecraft:white_tulip`, `minecraft:pink_tulip`, and 5 more.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:nether_wastes`; native-structure derivative `minecraft:nether_wastes`; custom identities `underworld_vanilla_old_growth_pine_taiga_8fd8bce2`.
- **Surface:** 1 block(s) at slope 0-2.6: `minecraft:netherrack`; 2-4 block(s) at slope >= 3.95: `minecraft:gravel`, `minecraft:warped_nylium`; 2-4 block(s) at slope >= 3.95: `minecraft:netherrack`, `minecraft:blackstone`; 1 block(s) at slope 0-4: `minecraft:netherrack`; 3 block(s) at slope 0-3: `minecraft:netherrack`. Wall palette: `minecraft:netherrack`, `minecraft:basalt`, `minecraft:gravel`, `minecraft:warped_nylium`.
- **Content:** 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:crimson_fungus`, `minecraft:nether_sprouts`, `minecraft:fire`.
- **Entity spawners:** `nether/surface/nether-wastes`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

### Mountain Middle (`mountain/Cute_Cliffs+`)

This child-only biome is selected from `vanilla/old_growth_pine_taiga`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `1` of `2` slots (50.00%); later child hops are resolved separately.
`mountain/Cute_Cliffs+` then intentionally lists itself as its own child. Its explicit self entry and implicit current-biome option both resolve to the same biome through Iris's bounded four-hop child recursion; this preserves reachability without adding region-list weight.

**Shared terrain:** `mountain` (106..185); combined authored contribution `106..185` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:old_growth_spruce_taiga` identity; surface 1 block(s) at slope 0-2.6: `minecraft:grass_block`; 2-4 block(s) at slope >= 3.95: `minecraft:gravel`, `minecraft:cyan_terracotta`; 2-4 block(s) at slope >= 3.95: `minecraft:stone`, `minecraft:cobblestone`; 1 block(s) at slope 0-4: `minecraft:grass_block`; 3 block(s) at slope 0-3: `minecraft:dirt`; 3 decorator rule(s) using `minecraft:dandelion`, `minecraft:poppy`, `minecraft:blue_orchid`, `minecraft:allium`, `minecraft:azure_bluet`, `minecraft:red_tulip`, `minecraft:orange_tulip`, `minecraft:white_tulip`, `minecraft:pink_tulip`, and 5 more.
- **Underworld 1005:** `minecraft:basalt_deltas` identity; surface 1 block(s) at slope 0-2.6: `minecraft:basalt`; 2-4 block(s) at slope >= 3.95: `minecraft:gravel`, `minecraft:warped_nylium`; 2-4 block(s) at slope >= 3.95: `minecraft:blackstone`; 1 block(s) at slope 0-4: `minecraft:basalt`; 3 block(s) at slope 0-3: `minecraft:blackstone`; 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:crimson_fungus`, `minecraft:nether_sprouts`, `minecraft:fire`.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome vanilla/old_growth_pine_taiga
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
