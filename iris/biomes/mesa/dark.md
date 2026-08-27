---
title: "Biome Atlas — Mesa Dark"
description: "Iris biome atlas entry for mesa/dark in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`mesa/dark` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `hot` (Hot) | 1 | 1 | 1 | 5.83% |
| Underworld 1005 | `hot` (Underworld Hot) | 1 | 1 | 1 | 5.83% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

This biome also appears twice in [`mesa/mesa`](/iris/biomes/mesa/mesa) child list, where the repeated entries contribute `4` of `19` immediate child slots (21.05%). That child share is evaluated only after `mesa/mesa` wins root selection; it is separate from `mesa/dark` own direct `hot` region-list occurrence and conditional share above.

## Shared terrain

Both packs use the same generator links: `highplains` (50..70), `mountain` (73..101); combined authored contribution `123..171` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:windswept_savanna`; native-structure derivative `minecraft:eroded_badlands`; no custom or scatter identities.
- **Surface:** 2-3 block(s): `minecraft:terracotta`; 2-3 block(s): `minecraft:brown_terracotta`; 2-3 block(s): `minecraft:gray_terracotta`; 2-3 block(s): `minecraft:black_terracotta`; 2-3 block(s): `minecraft:gray_terracotta`; 2-3 block(s): `minecraft:brown_terracotta`. Wall palette: `minecraft:brown_terracotta`, `minecraft:gray_terracotta`, `minecraft:black_terracotta`.
- **Content:** 3 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:stone_button`, `minecraft:dead_bush`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:basalt_deltas`; native-structure derivative `minecraft:basalt_deltas`; custom identities `underworld_mesa_dark_fb4fe10e`.
- **Surface:** 2-3 block(s): `minecraft:netherrack`; 2-3 block(s): `minecraft:soul_soil`; 2-3 block(s): `minecraft:polished_blackstone`; 2-3 block(s): `minecraft:blackstone`; 2-3 block(s): `minecraft:polished_blackstone`; 2-3 block(s): `minecraft:soul_soil`. Wall palette: `minecraft:soul_soil`, `minecraft:polished_blackstone`, `minecraft:blackstone`.
- **Content:** 4 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:polished_blackstone_button`, `minecraft:crimson_fungus`.
- **Entity spawners:** `nether/surface/basalt-deltas`, `nether/cave`.

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

## Children

### Mesa Cliffs (`mesa/cliffs`)

This child-only biome is selected from `mesa/dark`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `1` of `5` slots (20.00%); later child hops are resolved separately.

**Shared terrain:** `mountain` (9..30), `plain-cliffs` (41..110); combined authored contribution `50..140` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:windswept_savanna` identity; surface 4-2 block(s): `minecraft:terracotta`; 2-3 block(s): `minecraft:brown_terracotta`; 2-3 block(s): `minecraft:gray_terracotta`; 2-3 block(s): `minecraft:black_terracotta`; 2-3 block(s): `minecraft:gray_terracotta`; 2-3 block(s): `minecraft:brown_terracotta`; 3 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:stone_button`, `minecraft:dead_bush`.
- **Underworld 1005:** `minecraft:basalt_deltas` identity; surface 4-2 block(s): `minecraft:netherrack`; 2-3 block(s): `minecraft:soul_soil`; 2-3 block(s): `minecraft:polished_blackstone`; 2-3 block(s): `minecraft:blackstone`; 2-3 block(s): `minecraft:polished_blackstone`; 2-3 block(s): `minecraft:soul_soil`; 4 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:polished_blackstone_button`, `minecraft:crimson_fungus`.

### Mesa Red (`mesa/red`)

This child-only biome is selected from `mesa/dark`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `1` of `5` slots (20.00%); later child hops are resolved separately.

**Shared terrain:** `highplains` (50..70), `mountain` (70..110); combined authored contribution `120..180` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:windswept_savanna` identity; surface 2-3 block(s): `minecraft:pink_terracotta`; 2-3 block(s): `minecraft:red_terracotta`; 2-3 block(s): `minecraft:terracotta`; 2-3 block(s): `minecraft:light_gray_terracotta`; 2-3 block(s): `minecraft:brown_terracotta`; 3 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:stone_button`, `minecraft:dead_bush`. 1 deposit rule(s).
- **Underworld 1005:** `minecraft:basalt_deltas` identity; surface 2-3 block(s): `minecraft:crimson_nylium`; 2-3 block(s): `minecraft:nether_bricks`; 2-3 block(s): `minecraft:netherrack`; 2-3 block(s): `minecraft:quartz_bricks`; 2-3 block(s): `minecraft:soul_soil`; 4 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:polished_blackstone_button`, `minecraft:crimson_fungus`. 1 deposit rule(s).

### Mesa Green (`mesa/green`)

This child-only biome is selected from `mesa/dark`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `1` of `5` slots (20.00%); later child hops are resolved separately.

**Shared terrain:** `highplains` (50..70), `mountain` (70..110); combined authored contribution `120..180` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:windswept_savanna` identity; surface 2-3 block(s): `minecraft:lime_terracotta`; 2-3 block(s): `minecraft:green_terracotta`; 2-3 block(s): `minecraft:terracotta`; 2-3 block(s): `minecraft:brown_terracotta`; 3 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:stone_button`, `minecraft:dead_bush`.
- **Underworld 1005:** `minecraft:basalt_deltas` identity; surface 2-3 block(s): `minecraft:warped_nylium`; 2-3 block(s): `minecraft:warped_nylium`; 2-3 block(s): `minecraft:netherrack`; 2-3 block(s): `minecraft:soul_soil`; 4 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:polished_blackstone_button`, `minecraft:crimson_fungus`.

### Mesa Blue (`mesa/blue`)

This child-only biome is selected from `mesa/dark`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `1` of `5` slots (20.00%); later child hops are resolved separately.

**Shared terrain:** `highplains` (50..70), `mountain` (70..110); combined authored contribution `120..180` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:windswept_savanna` identity; surface 2-3 block(s): `minecraft:cyan_terracotta`; 2-3 block(s): `minecraft:blue_terracotta`; 2-3 block(s): `minecraft:light_blue_terracotta`; 2-3 block(s): `minecraft:magenta_terracotta`; 3 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:stone_button`, `minecraft:dead_bush`.
- **Underworld 1005:** `minecraft:basalt_deltas` identity; surface 2-3 block(s): `minecraft:warped_nylium`; 2-3 block(s): `minecraft:warped_wart_block`; 2-3 block(s): `minecraft:warped_wart_block`; 2-3 block(s): `minecraft:nether_wart_block`; 4 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:polished_blackstone_button`, `minecraft:crimson_fungus`.

## Floating variants

No floating child biomes are declared.


## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome mesa/dark
/iris what biome
/iris what region
```

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
