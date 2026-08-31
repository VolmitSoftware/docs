---
title: "Biome Atlas — Hot Desert Dunes Red"
description: "Iris biome atlas entry for hot/desert-dunes-red in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`hot/desert-dunes-red` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `hot` (Hot) | 1 | 1 | 1 | 5.83% |
| Underworld 1005 | `hot` (Underworld Hot) | 1 | 1 | 1 | 5.83% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `smooth-dunes` (30..35); combined authored contribution `30..35` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:desert`; native-structure derivative `minecraft:desert`; no custom or scatter identities.
- **Surface:** 3-10 block(s) at slope 4.5-20: `minecraft:orange_terracotta`; 5 block(s): `minecraft:red_sand`. Wall palette: none.
- **Content:** 2 object placement rule(s) drawing from 5 object key(s), including `clutter/rdesertpost1`, `clutter/rdesertpost2`, `clutter/rdesertpost3`, `clutter/rsphinx1`, `clutter/rbrksphinx1`. 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:cactus`, `minecraft:cactus_flower`, `minecraft:dead_bush`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:nether_wastes`; native-structure derivative `minecraft:nether_wastes`; custom identities `underworld_hot_desert_dunes_red_87daec3a`.
- **Surface:** 3-10 block(s) at slope 4.5-20: `minecraft:magma_block`; 5 block(s): `minecraft:netherrack`. Wall palette: none.
- **Content:** 2 object placement rule(s) drawing from 5 object key(s), including `underworld/wastes/clutter/rdesertpost1`, `underworld/wastes/clutter/rdesertpost2`, `underworld/wastes/clutter/rdesertpost3`, `underworld/wastes/clutter/rsphinx1`, `underworld/wastes/clutter/rbrksphinx1`. 5 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:crimson_stem`, `minecraft:crimson_fungus`.
- **Entity spawners:** `nether/surface/nether-wastes`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

### Hot Mountain Cliffs (`hot/mountain-cliffs`)

This child-only biome is selected from `hot/desert-dunes-red`, not from a region list. Its rarity is `3`.
In that immediate child choice it contributes `1` of `4` slots (25.00%); later child hops are resolved separately.

**Shared terrain:** `cracked-cliffs` (59..123); combined authored contribution `59..123` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:desert` identity; surface 1 block(s) at slope 0-3: `minecraft:red_sand`; 2-4 block(s) at slope >= 3.95: `minecraft:brown_terracotta`, `minecraft:gray_terracotta`; 2-3 block(s): `minecraft:brown_terracotta`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`; No biome-local object, decorator, procedural, deposit, or effect rules.
- **Underworld 1005:** `minecraft:basalt_deltas` identity; surface 1 block(s) at slope 0-3: `minecraft:blackstone`; 2-4 block(s) at slope >= 3.95: `minecraft:soul_soil`, `minecraft:polished_blackstone`; 2-3 block(s): `minecraft:soul_soil`; 6-18 block(s): `minecraft:blackstone`, `minecraft:basalt`; 1 decorator rule(s) (1 shared snippet reference(s)).

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome hot/desert-dunes-red
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
