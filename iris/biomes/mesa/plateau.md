---
title: "Biome Atlas — Mesa Plateau"
description: "Iris biome atlas entry for mesa/plateau in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`mesa/plateau` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `hot` (Hot) | 1 | 1 | 1 | 5.83% |
| Underworld 1005 | `hot` (Underworld Hot) | 1 | 1 | 1 | 5.83% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

## Shared terrain

Both packs use the same generator links: `cracked-cliffs` (70..98); combined authored contribution `70..98` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:badlands`; native-structure derivative `minecraft:badlands`; underground scatter `minecraft:badlands`, `minecraft:eroded_badlands`.
- **Surface:** 5 block(s) at slope 0-3: `minecraft:red_terracotta`, `minecraft:terracotta`; 3-10 block(s) at slope 3-255: `minecraft:terracotta`; 2-10 block(s) at slope 3-255: `minecraft:orange_terracotta`; 1-10 block(s) at slope 3-255: `minecraft:white_terracotta`; 4-10 block(s) at slope 3-255: `minecraft:terracotta`; 3-10 block(s) at slope 3-255: `minecraft:yellow_terracotta`; 1-10 block(s) at slope 3-255: `minecraft:orange_terracotta`; 5-10 block(s) at slope 3-255: `minecraft:terracotta`; 3-10 block(s) at slope 3-255: `minecraft:brown_terracotta`; 2-10 block(s) at slope 3-255: `minecraft:terracotta`; 3-10 block(s) at slope 3-255: `minecraft:red_terracotta`; 3-10 block(s) at slope 3-255: `minecraft:terracotta`. Wall palette: none.
- **Content:** 1 decorator rule(s) using `minecraft:tall_grass`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:basalt_deltas`; native-structure derivative `minecraft:basalt_deltas`; custom identities `underworld_mesa_plateau_3e90d30f`.
- **Surface:** 5 block(s) at slope 0-3: `minecraft:nether_bricks`, `minecraft:netherrack`; 3-10 block(s) at slope 3-255: `minecraft:netherrack`; 2-10 block(s) at slope 3-255: `minecraft:magma_block`; 1-10 block(s) at slope 3-255: `minecraft:quartz_block`; 4-10 block(s) at slope 3-255: `minecraft:netherrack`; 3-10 block(s) at slope 3-255: `minecraft:glowstone`; 1-10 block(s) at slope 3-255: `minecraft:magma_block`; 5-10 block(s) at slope 3-255: `minecraft:netherrack`; 3-10 block(s) at slope 3-255: `minecraft:soul_soil`; 2-10 block(s) at slope 3-255: `minecraft:netherrack`; 3-10 block(s) at slope 3-255: `minecraft:nether_bricks`; 3-10 block(s) at slope 3-255: `minecraft:netherrack`. Wall palette: none.
- **Content:** 2 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:crimson_fungus`.
- **Entity spawners:** `nether/surface/basalt-deltas`, `nether/cave`.

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

## Children

### Mesa Plateau Dirt (`mesa/plateau-dirt`)

This child-only biome is selected from `mesa/plateau`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `1` of `2` slots (50.00%); later child hops are resolved separately.

**Shared terrain:** `cracked-cliffs` (73..98); combined authored contribution `73..98` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:badlands` identity; surface 5 block(s): `minecraft:grass_block`, `minecraft:coarse_dirt`, `minecraft:dirt`; 3-8 block(s): `minecraft:terracotta`; 2-8 block(s): `minecraft:orange_terracotta`; 1-8 block(s): `minecraft:white_terracotta`; 4-8 block(s): `minecraft:terracotta`; 3-8 block(s): `minecraft:yellow_terracotta`; 3-8 block(s): `minecraft:brown_terracotta`; 1 object placement rule(s) drawing from 3 object key(s), including `trees/acacia/vexed1`, `trees/acacia/vexed2`, `trees/acacia/vexed3`. 1 decorator rule(s) using `minecraft:tall_grass`.
- **Underworld 1005:** `minecraft:basalt_deltas` identity; surface 5 block(s): `minecraft:basalt`, `minecraft:blackstone`; 3-8 block(s): `minecraft:netherrack`; 2-8 block(s): `minecraft:magma_block`; 1-8 block(s): `minecraft:quartz_block`; 4-8 block(s): `minecraft:netherrack`; 3-8 block(s): `minecraft:glowstone`; 3-8 block(s): `minecraft:soul_soil`; 1 object placement rule(s) drawing from 3 object key(s), including `underworld/basalt/trees/acacia/vexed1`, `underworld/basalt/trees/acacia/vexed2`, `underworld/basalt/trees/acacia/vexed3`. 2 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:crimson_fungus`.

## Floating variants

No floating child biomes are declared.


## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome mesa/plateau
/iris what biome
/iris what region
```

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
