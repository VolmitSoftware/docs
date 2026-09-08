---
title: "Biome Atlas — Mountain Plains"
description: "Iris biome atlas entry for mountain/plains in Overworld 4007 and Underworld 1010"
published: true
date: 2026-09-08T16:43:54.130Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`mountain/plains` is a directly selected land biome in the current Overworld 4007 and Underworld 1010 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4007 | `forests` (Forests) | 1 | 1 | 1 | 11.46% |
| Overworld 4007 | `temperate` (Temperate) | 1 | 1 | 1 | 6.15% |
| Overworld 4007 | `tundra` (Tundra) | 1 | 1 | 1 | 6.12% |
| Underworld 1010 | `forests` (Underworld Forests) | 1 | 1 | 1 | 11.46% |
| Underworld 1010 | `temperate` (Underworld Temperate) | 1 | 1 | 1 | 6.15% |
| Underworld 1010 | `tundra` (Underworld Tundra) | 1 | 1 | 1 | 6.12% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `mountain` (45..53); combined authored contribution `45..53` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## 3D terrain

Overworld 4007 and Underworld 1010 share these `terrain3D` settings. Amplitude, feature scales, and crack dimensions use blocks.
The slope gate uses rise divided by horizontal distance. Strength reaches its configured value at the full slope.

| Biome | Treatment | Amplitude | Horizontal / vertical scale | Crack depth / width / scale | Slope start / full |
|---|---|---:|---|---|---|
| `mountain/plains` | Hills | 22 | 144 / 24 | 6 / 2.5 / 240 | 0.18 / 0.5 |
| `mountain/mplain-extended` | Forest | 30 | 160 / 28 | 8 / 3 / 256 | 0.2 / 0.55 |
| `mountain/plain-extended` | Forest | 30 | 160 / 28 | 8 / 3 / 256 | 0.2 / 0.55 |

Active profiles use Simplex density and crack noise. Deformation starts above fluid level plus 8 blocks and fades across 24 blocks of base elevation.
Each pack retains its own materials, decoration, objects, and ores. Floating islands keep their separate shape settings.

## Overworld 4007 treatment

- **Minecraft identity:** derivative `minecraft:old_growth_spruce_taiga`; native-structure derivative `minecraft:old_growth_spruce_taiga`; no custom or scatter identities.
- **Surface:** 1 block(s) at slope 0-3.3: `minecraft:grass_block`; 2-4 block(s) at slope >= 4: `minecraft:gravel`, `minecraft:cyan_terracotta`; 2-4 block(s) at slope >= 4: `minecraft:stone`, `minecraft:cobblestone`; 1 block(s) at slope 0-4: `minecraft:grass_block`; 3 block(s) at slope 0-3: `minecraft:dirt`. Wall palette: `minecraft:stone`, `minecraft:andesite`, `minecraft:gravel`, `minecraft:cyan_terracotta`.
- **Content:** 4 object placement rule(s) drawing from 9 object key(s), including `trees/sproak/sp1`, `trees/sproak/sp2`, `trees/sproak/sp3`, `trees/sproak/sp4`, `trees/sproak/sp5`, `trees/sproak/sp6`, `clutter/sbush1`, and 2 more. 5 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:dandelion`, `minecraft:poppy`, `minecraft:blue_orchid`, `minecraft:allium`, `minecraft:azure_bluet`, `minecraft:red_tulip`, `minecraft:orange_tulip`, `minecraft:white_tulip`, `minecraft:pink_tulip`, and 7 more.

## Underworld 1010 treatment

- **Minecraft identity:** derivative `minecraft:basalt_deltas`; native-structure derivative `minecraft:basalt_deltas`; custom identities `underworld_mountain_plains_fdad7c68`.
- **Surface:** 1 block(s) at slope 0-3.3: `minecraft:basalt`; 2-4 block(s) at slope >= 4: `minecraft:gravel`, `minecraft:warped_nylium`; 2-4 block(s) at slope >= 4: `minecraft:blackstone`; 1 block(s) at slope 0-4: `minecraft:basalt`; 3 block(s) at slope 0-3: `minecraft:blackstone`. Wall palette: `minecraft:blackstone`, `minecraft:basalt`, `minecraft:gravel`, `minecraft:warped_nylium`.
- **Content:** 4 object placement rule(s) drawing from 9 object key(s), including `underworld/basalt/trees/sproak/sp1`, `underworld/basalt/trees/sproak/sp2`, `underworld/basalt/trees/sproak/sp3`, `underworld/basalt/trees/sproak/sp4`, `underworld/basalt/trees/sproak/sp5`, `underworld/basalt/trees/sproak/sp6`, `underworld/basalt/clutter/sbush1`, and 2 more. 6 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:crimson_fungus`, `minecraft:nether_sprouts`, `minecraft:fire`, `minecraft:basalt`.
- **Entity spawners:** `nether/surface/basalt-deltas`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

### Mountain Plains Hills (`mountain/plain-extended`)

This child-only biome is selected from `mountain/plains`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `1` of `3` slots (33.33%); later child hops are resolved separately.

**Shared terrain:** `smooth-dunes` (50..70), `mountain` (1..5); combined authored contribution `51..75` blocks relative to fluid height.

- **Overworld 4007:** `minecraft:plains` identity; surface 1 block(s): `minecraft:grass_block`; 2 block(s): `minecraft:dirt`; 1 block(s): `minecraft:dirt`, `minecraft:stone`; 1 object placement rule(s) drawing from 4 object key(s), including `trees/oak/truegeneric1`, `trees/oak/truegeneric3`, `trees/oak/truegeneric4`, `trees/oak/truegeneric5`. 4 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:dandelion`, `minecraft:poppy`, `minecraft:blue_orchid`, `minecraft:allium`, `minecraft:azure_bluet`, `minecraft:red_tulip`, `minecraft:orange_tulip`, `minecraft:white_tulip`, `minecraft:pink_tulip`, and 5 more.
- **Underworld 1010:** `minecraft:basalt_deltas` identity; surface 1 block(s): `minecraft:basalt`; 2 block(s): `minecraft:blackstone`; 1 block(s): `minecraft:blackstone`; 1 object placement rule(s) drawing from 4 object key(s), including `underworld/basalt/trees/oak/truegeneric1`, `underworld/basalt/trees/oak/truegeneric3`, `underworld/basalt/trees/oak/truegeneric4`, `underworld/basalt/trees/oak/truegeneric5`. 5 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:crimson_fungus`, `minecraft:nether_sprouts`, `minecraft:fire`.

### Mountain Plains Hills (`mountain/mplain-extended`)

This child-only biome is selected from `mountain/plains`, not from a region list. Its rarity is `1`.
In that immediate child choice it contributes `1` of `3` slots (33.33%); later child hops are resolved separately.

**Shared terrain:** `smooth-dunes` (50..70), `mountain` (1..5); combined authored contribution `51..75` blocks relative to fluid height.

- **Overworld 4007:** `minecraft:plains` identity; surface 1 block(s): `minecraft:grass_block`; 2 block(s): `minecraft:dirt`; 1 block(s): `minecraft:dirt`, `minecraft:stone`; 3 object placement rule(s) drawing from 23 object key(s), including `trees/oak/truegeneric1`, `trees/oak/truegeneric3`, `trees/oak/truegeneric4`, `trees/oak/truegeneric5`, `trees/oak/lponderosa1`, `trees/oak/lponderosa2`, `trees/oak/lponderosa3`, and 16 more. 6 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:dandelion`, `minecraft:poppy`, `minecraft:blue_orchid`, `minecraft:allium`, `minecraft:azure_bluet`, `minecraft:red_tulip`, `minecraft:orange_tulip`, `minecraft:white_tulip`, `minecraft:pink_tulip`, and 6 more.
- **Underworld 1010:** `minecraft:basalt_deltas` identity; surface 1 block(s): `minecraft:basalt`; 2 block(s): `minecraft:blackstone`; 1 block(s): `minecraft:blackstone`; 3 object placement rule(s) drawing from 23 object key(s), including `underworld/basalt/trees/oak/truegeneric1`, `underworld/basalt/trees/oak/truegeneric3`, `underworld/basalt/trees/oak/truegeneric4`, `underworld/basalt/trees/oak/truegeneric5`, `underworld/basalt/trees/oak/lponderosa1`, `underworld/basalt/trees/oak/lponderosa2`, `underworld/basalt/trees/oak/lponderosa3`, and 16 more. 7 decorator rule(s) (3 shared snippet reference(s)) using `minecraft:crimson_fungus`, `minecraft:nether_sprouts`, `minecraft:fire`, `minecraft:nether_wart_block`.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome mountain/plains
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
