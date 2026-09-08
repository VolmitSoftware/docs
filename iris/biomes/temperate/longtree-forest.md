---
title: "Biome Atlas — Long tree forest"
description: "Iris biome atlas entry for temperate/longtree-forest in Overworld 4007 and Underworld 1010"
published: true
date: 2026-09-08T07:09:46.981Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`temperate/longtree-forest` is a directly selected land biome in the current Overworld 4007 and Underworld 1010 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4007 | `temperate` (Temperate) | 1 | 7 | 0.1429 | 0.88% |
| Underworld 1010 | `temperate` (Underworld Temperate) | 1 | 7 | 0.1429 | 0.88% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `smooth-dunes` (4..10); combined authored contribution `4..10` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## 3D terrain

Overworld 4007 and Underworld 1010 share these `terrain3D` settings. Amplitude, feature scales, and crack dimensions use blocks.
The slope gate uses rise divided by horizontal distance. Strength reaches its configured value at the full slope.

| Biome | Treatment | Amplitude | Horizontal / vertical scale | Crack depth / width / scale | Slope start / full |
|---|---|---:|---|---|---|
| `temperate/longtree-forest` | Lowland | 10 | 96 / 16 | None | 0.18 / 0.48 |
| `temperate/longtree-forest-extended` | Forest | 30 | 128 / 20 | 12 / 3 / 192 | 0.2 / 0.55 |

Active profiles use Simplex density and crack noise. Deformation starts above fluid level plus 8 blocks and fades across 24 blocks of base elevation.
Each pack retains its own materials, decoration, objects, and ores. Floating islands keep their separate shape settings.

## Overworld 4007 treatment

- **Minecraft identity:** derivative `minecraft:forest`; native-structure derivative `minecraft:forest`; custom identities `longtree_forest`.
- **Surface:** 1 block(s): `minecraft:grass_block`, `minecraft:gravel`; 1 block(s): `minecraft:dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: none.
- **Content:** 6 object placement rule(s) drawing from 32 object key(s), including `clutter/stoneclutt1`, `clutter/stoneclutt2`, `clutter/stoneclutt3`, `clutter/stoneclutt4`, `clutter/stoneclutt5`, `clutter/stoneclutt6`, `clutter/stoneclutt7`, and 25 more. 11 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:sugar_cane`, `minecraft:stone_button`, `minecraft:sunflower`, `minecraft:bamboo`, `minecraft:short_grass`, `minecraft:oak_leaves`, `minecraft:tall_grass`, `minecraft:rose_bush`, `minecraft:peony`, and 4 more.

## Underworld 1010 treatment

- **Minecraft identity:** derivative `minecraft:nether_wastes`; native-structure derivative `minecraft:nether_wastes`; custom identities `underworld_temperate_longtree_forest_7c38d192`.
- **Surface:** 1 block(s): `minecraft:netherrack`, `minecraft:gravel`; 1 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`. Wall palette: none.
- **Content:** 6 object placement rule(s) drawing from 32 object key(s), including `underworld/wastes/clutter/stoneclutt1`, `underworld/wastes/clutter/stoneclutt2`, `underworld/wastes/clutter/stoneclutt3`, `underworld/wastes/clutter/stoneclutt4`, `underworld/wastes/clutter/stoneclutt5`, `underworld/wastes/clutter/stoneclutt6`, `underworld/wastes/clutter/stoneclutt7`, and 25 more. 12 decorator rule(s) (3 shared snippet reference(s)) using `minecraft:crimson_stem`, `minecraft:polished_blackstone_button`, `minecraft:crimson_fungus`, `minecraft:fire`, `minecraft:nether_wart_block`, `minecraft:nether_sprouts`.
- **Entity spawners:** `nether/surface/nether-wastes`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

### Long tree forest (`temperate/longtree-forest-extended`)

This child-only biome is selected from `temperate/longtree-forest`, not from a region list. Its rarity is `3`.
In that immediate child choice it contributes `5` of `6` slots (83.33%); later child hops are resolved separately.

**Shared terrain:** `smooth-dunes` (44..98); combined authored contribution `44..98` blocks relative to fluid height.

- **Overworld 4007:** `minecraft:forest` identity; surface 1 block(s): `minecraft:grass_block`, `minecraft:gravel`; 1 block(s): `minecraft:dirt`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`; 6 object placement rule(s) drawing from 32 object key(s), including `clutter/stoneclutt1`, `clutter/stoneclutt2`, `clutter/stoneclutt3`, `clutter/stoneclutt4`, `clutter/stoneclutt5`, `clutter/stoneclutt6`, `clutter/stoneclutt7`, and 25 more. 11 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:sugar_cane`, `minecraft:stone_button`, `minecraft:sunflower`, `minecraft:bamboo`, `minecraft:short_grass`, `minecraft:oak_leaves`, `minecraft:tall_grass`, `minecraft:rose_bush`, `minecraft:peony`, and 4 more.
- **Underworld 1010:** `minecraft:nether_wastes` identity; surface 1 block(s): `minecraft:netherrack`, `minecraft:gravel`; 1 block(s): `minecraft:netherrack`; 6-18 block(s): `minecraft:netherrack`, `minecraft:basalt`; 6 object placement rule(s) drawing from 32 object key(s), including `underworld/wastes/clutter/stoneclutt1`, `underworld/wastes/clutter/stoneclutt2`, `underworld/wastes/clutter/stoneclutt3`, `underworld/wastes/clutter/stoneclutt4`, `underworld/wastes/clutter/stoneclutt5`, `underworld/wastes/clutter/stoneclutt6`, `underworld/wastes/clutter/stoneclutt7`, and 25 more. 12 decorator rule(s) (3 shared snippet reference(s)) using `minecraft:crimson_stem`, `minecraft:polished_blackstone_button`, `minecraft:crimson_fungus`, `minecraft:fire`, `minecraft:nether_wart_block`, `minecraft:nether_sprouts`.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome temperate/longtree-forest
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
