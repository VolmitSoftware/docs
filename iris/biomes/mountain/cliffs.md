---
title: "Biome Atlas — Mountain Cliffs"
description: "Iris biome atlas entry for mountain/cliffs in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`mountain/cliffs` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `tundra` (Tundra) | 1 | 3 | 0.3333 | 2.04% |
| Underworld 1005 | `tundra` (Underworld Tundra) | 1 | 3 | 0.3333 | 2.04% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

Both packs use the same generator links: `cracked-cliffs` (26..90); combined authored contribution `26..90` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:old_growth_spruce_taiga`; native-structure derivative `minecraft:old_growth_spruce_taiga`; no custom or scatter identities.
- **Surface:** 1 block(s) at slope 0-2.6: `minecraft:grass_block`; 1-2 block(s) at slope >= 3.95: `minecraft:gravel`, `minecraft:cyan_terracotta`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`. Wall palette: `minecraft:stone`, `minecraft:andesite`, `minecraft:gravel`, `minecraft:cyan_terracotta`.
- **Content:** No biome-local object, decorator, procedural, deposit, or effect rules.

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:basalt_deltas`; native-structure derivative `minecraft:basalt_deltas`; custom identities `underworld_mountain_cliffs_cf669059`.
- **Surface:** 1 block(s) at slope 0-2.6: `minecraft:basalt`; 1-2 block(s) at slope >= 3.95: `minecraft:gravel`, `minecraft:warped_nylium`; 6-18 block(s): `minecraft:blackstone`, `minecraft:basalt`. Wall palette: `minecraft:blackstone`, `minecraft:basalt`, `minecraft:gravel`, `minecraft:warped_nylium`.
- **Content:** 1 decorator rule(s) (1 shared snippet reference(s)).
- **Entity spawners:** `nether/surface/basalt-deltas`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

### Mountain Cliffs (`mountain/cliffs-extended`)

This child-only biome is selected from `mountain/cliffs`, not from a region list. Its rarity is `3`.
In that immediate child choice it contributes `1` of `2` slots (50.00%); later child hops are resolved separately.

**Shared terrain:** `cracked-cliffs` (106..185); combined authored contribution `106..185` blocks relative to fluid height.

- **Overworld 4002:** `minecraft:old_growth_spruce_taiga` identity; surface 1 block(s) at slope 0-2.6: `minecraft:grass_block`; 1-2 block(s) at slope >= 3.95: `minecraft:gravel`, `minecraft:cyan_terracotta`; 6-18 block(s): `minecraft:stone`, `minecraft:andesite`; No biome-local object, decorator, procedural, deposit, or effect rules.
- **Underworld 1005:** `minecraft:basalt_deltas` identity; surface 1 block(s) at slope 0-2.6: `minecraft:basalt`; 1-2 block(s) at slope >= 3.95: `minecraft:gravel`, `minecraft:warped_nylium`; 6-18 block(s): `minecraft:blackstone`, `minecraft:basalt`; 1 decorator rule(s) (1 shared snippet reference(s)).

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome mountain/cliffs
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
