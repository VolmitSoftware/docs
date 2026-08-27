---
title: "Biome Atlas — Mesa"
description: "Iris biome atlas entry for mesa/mesa in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`mesa/mesa` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `hot` (Hot) | 1 | 2 | 0.5 | 2.91% |
| Underworld 1005 | `hot` (Underworld Hot) | 1 | 2 | 0.5 | 2.91% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

## Shared terrain

Both packs use the same generator links: `highplains` (50..70), `highplains` (95..190); combined authored contribution `145..260` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:badlands`; native-structure derivative `minecraft:badlands`; underground scatter `minecraft:badlands`, `minecraft:eroded_badlands`.
- **Surface:** 2-3 block(s): `minecraft:clay`, `minecraft:light_gray_concrete_powder`, `minecraft:andesite`, `minecraft:stone`, `minecraft:light_gray_concrete`, `minecraft:orange_terracotta`, and 2 more; 2-3 block(s): `minecraft:light_gray_terracotta`; 2-3 block(s): `minecraft:terracotta`, `minecraft:light_gray_terracotta`; 2-3 block(s): `minecraft:terracotta`; 2-3 block(s): `minecraft:orange_terracotta`; 3-4 block(s): `minecraft:terracotta`; 2-3 block(s): `minecraft:terracotta`, `minecraft:light_gray_terracotta`; 1 block(s): `minecraft:light_gray_terracotta`; 1 block(s): `minecraft:terracotta`. Wall palette: none.
- **Content:** 2 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:stone_button`.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:basalt_deltas`; native-structure derivative `minecraft:basalt_deltas`; custom identities `underworld_mesa_mesa_d10b8dba`.
- **Surface:** 2-3 block(s): `minecraft:blackstone`, `minecraft:quartz_bricks`, `minecraft:basalt`, `minecraft:magma_block`, `minecraft:netherrack`; 2-3 block(s): `minecraft:quartz_bricks`; 2-3 block(s): `minecraft:netherrack`, `minecraft:quartz_bricks`; 2-3 block(s): `minecraft:netherrack`; 2-3 block(s): `minecraft:magma_block`; 3-4 block(s): `minecraft:netherrack`; 2-3 block(s): `minecraft:netherrack`, `minecraft:quartz_bricks`; 1 block(s): `minecraft:quartz_bricks`; 1 block(s): `minecraft:netherrack`. Wall palette: none.
- **Content:** 3 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:polished_blackstone_button`.
- **Entity spawners:** `nether/surface/basalt-deltas`, `nether/cave`.

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

## Children

The child list intentionally repeats several keys. Child occurrences use the child-slot calculation independently of the direct region-list weighting above:

| Child choice | Child-list occurrences | Combined slots | Immediate child-choice share | Reachability |
|---|---:|---:|---:|---|
| Parent `mesa/mesa` | 1 implicit parent option | 1 | 5.26% | Current root |
| `mesa/valleys` | 1 | 2 | 10.53% | Also a direct land root |
| `mesa/dark` | 2 | 4 | 21.05% | Also a direct land root |
| `mesa/red` | 2 | 4 | 21.05% | Child-only |
| `mesa/blue` | 2 | 4 | 21.05% | Child-only |
| `mesa/green` | 1 | 2 | 10.53% | Child-only |
| `mesa/yellow` | 1 | 2 | 10.53% | Child-only |

The 19 slots describe only the immediate child choice after `mesa/mesa` has already won the `hot` region land pick. Repeated child keys increase their share inside this parent; they do not increase `mesa/mesa` own direct region weight or create unbounded recursion.

Children that are also direct land roots have their own atlas pages: [`mesa/dark`](/iris/biomes/mesa/dark), [`mesa/valleys`](/iris/biomes/mesa/valleys).

### Mesa Red (`mesa/red`)

This child-only biome is selected from `mesa/mesa`, not from a region list. Its rarity is `1`.
Its two repeated child-list occurrences contribute `4` of `19` slots (21.05%) in the immediate choice; later child hops are resolved separately.

**Shared terrain:** `highplains` (50..70), `mountain` (70..110); combined authored contribution `120..180` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:windswept_savanna` identity; surface 2-3 block(s): `minecraft:pink_terracotta`; 2-3 block(s): `minecraft:red_terracotta`; 2-3 block(s): `minecraft:terracotta`; 2-3 block(s): `minecraft:light_gray_terracotta`; 2-3 block(s): `minecraft:brown_terracotta`; 3 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:stone_button`, `minecraft:dead_bush`. 1 deposit rule(s).
- **Underworld 1005:** `minecraft:basalt_deltas` identity; surface 2-3 block(s): `minecraft:crimson_nylium`; 2-3 block(s): `minecraft:nether_bricks`; 2-3 block(s): `minecraft:netherrack`; 2-3 block(s): `minecraft:quartz_bricks`; 2-3 block(s): `minecraft:soul_soil`; 4 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:polished_blackstone_button`, `minecraft:crimson_fungus`. 1 deposit rule(s).

### Mesa Blue (`mesa/blue`)

This child-only biome is selected from `mesa/mesa`, not from a region list. Its rarity is `1`.
Its two repeated child-list occurrences contribute `4` of `19` slots (21.05%) in the immediate choice; later child hops are resolved separately.

**Shared terrain:** `highplains` (50..70), `mountain` (70..110); combined authored contribution `120..180` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:windswept_savanna` identity; surface 2-3 block(s): `minecraft:cyan_terracotta`; 2-3 block(s): `minecraft:blue_terracotta`; 2-3 block(s): `minecraft:light_blue_terracotta`; 2-3 block(s): `minecraft:magenta_terracotta`; 3 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:stone_button`, `minecraft:dead_bush`.
- **Underworld 1005:** `minecraft:basalt_deltas` identity; surface 2-3 block(s): `minecraft:warped_nylium`; 2-3 block(s): `minecraft:warped_wart_block`; 2-3 block(s): `minecraft:warped_wart_block`; 2-3 block(s): `minecraft:nether_wart_block`; 4 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:polished_blackstone_button`, `minecraft:crimson_fungus`.

### Mesa Green (`mesa/green`)

This child-only biome is selected from `mesa/mesa`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `2` of `19` slots (10.53%); later child hops are resolved separately.

**Shared terrain:** `highplains` (50..70), `mountain` (70..110); combined authored contribution `120..180` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:windswept_savanna` identity; surface 2-3 block(s): `minecraft:lime_terracotta`; 2-3 block(s): `minecraft:green_terracotta`; 2-3 block(s): `minecraft:terracotta`; 2-3 block(s): `minecraft:brown_terracotta`; 3 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:stone_button`, `minecraft:dead_bush`.
- **Underworld 1005:** `minecraft:basalt_deltas` identity; surface 2-3 block(s): `minecraft:warped_nylium`; 2-3 block(s): `minecraft:warped_nylium`; 2-3 block(s): `minecraft:netherrack`; 2-3 block(s): `minecraft:soul_soil`; 4 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:polished_blackstone_button`, `minecraft:crimson_fungus`.

### Mesa Yellow (`mesa/yellow`)

This child-only biome is selected from `mesa/mesa`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `2` of `19` slots (10.53%); later child hops are resolved separately.

**Shared terrain:** `highplains` (50..70), `mountain` (70..110); combined authored contribution `120..180` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:windswept_savanna` identity; surface 2-3 block(s): `minecraft:terracotta`; 2-3 block(s): `minecraft:white_terracotta`; 2-3 block(s): `minecraft:terracotta`; 2-3 block(s): `minecraft:red_terracotta`; 4 block(s): `minecraft:terracotta`; 2-3 block(s): `minecraft:yellow_terracotta`; 2-3 block(s): `minecraft:terracotta`; 2-3 block(s): `minecraft:brown_terracotta`; 3 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:stone_button`, `minecraft:dead_bush`.
- **Underworld 1005:** `minecraft:basalt_deltas` identity; surface 2-3 block(s): `minecraft:netherrack`; 2-3 block(s): `minecraft:quartz_block`; 2-3 block(s): `minecraft:netherrack`; 2-3 block(s): `minecraft:nether_bricks`; 4 block(s): `minecraft:netherrack`; 2-3 block(s): `minecraft:glowstone`; 2-3 block(s): `minecraft:netherrack`; 2-3 block(s): `minecraft:soul_soil`; 4 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:polished_blackstone_button`, `minecraft:crimson_fungus`.

Direct-root children continue on their own pages: [`mesa/dark`](/iris/biomes/mesa/dark).

## Floating variants

No floating child biomes are declared.


## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome mesa/mesa
/iris what biome
/iris what region
```

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
