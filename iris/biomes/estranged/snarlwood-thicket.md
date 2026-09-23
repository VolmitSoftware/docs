---
title: "Biome Atlas — Snarlwood Thicket"
description: "Iris biome atlas entry for estranged/snarlwood-thicket in Overworld and Underworld"
published: true
date: 2026-09-23T11:12:42.385Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`estranged/snarlwood-thicket` is a directly selected land biome in the Overworld and Underworld packs. Overworld and Underworld use the same terrain with different materials, Minecraft biome identities, decorations, and ecology.

Estranged cave decoration includes Frostspar with three to five tapered shards, each five to nine blocks long, on continuous organic supports. Overworld uses solid quartz and calcite. Underworld retains its separate base and crying-obsidian tips.

## Selection and weighting

The percentage is this biome's weighted share after Iris selects its region and the land role. Region distribution and selection noise still control world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld | `estranged` (Estranged) | 1 | 3 | 0.3333 | 7.04% |
| Underworld | `estranged` (Estranged) | 1 | 3 | 0.3333 | 7.04% |

Each repeated entry contributes another `1 / rarity` weight.

## Shared terrain

The terrain generators use `surfaceDetail: 0.5` to smooth small surface variations. See [Generators and noise](/iris/14-generators-noise).

Both packs use the same generator links: `smooth-dunes` (4..9), `rare-hills` (0..36); combined authored contribution `4..45` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## 3D terrain

Overworld and Underworld share these `terrain3D` settings. Amplitude, feature scales, and crack dimensions use blocks.
The slope gate uses rise divided by horizontal distance. Strength reaches its configured value at the full slope.

| Biome | Treatment | Amplitude | Horizontal / vertical scale | Crack depth / width / scale | Slope start / full | Density noise / Crack noise |
|---|---|---:|---|---|---|---|
| `estranged/snarlwood-thicket` | Hills | 22 | 256 / 30 | None | 0.18 / 0.5 | `IRIS_HALF` / None |

The table lists each profile’s density and crack noise. Active deformation starts above fluid level plus 8 blocks and fades across 24 blocks of base elevation.
Each pack retains its own materials, decoration, objects, and ores. Floating islands keep their separate shape settings.

## Overworld treatment

- **Minecraft identity:** derivative `minecraft:dark_forest`; native-structure derivative `minecraft:dark_forest`; custom identities `estranged_snarlwood`.
- **Surface:** 1 block(s): `minecraft:grass_block`, `minecraft:podzol`, `minecraft:coarse_dirt`; 2 block(s): `minecraft:dirt`; 1-3 block(s): `minecraft:dirt`, `minecraft:stone`. Wall palette: `minecraft:stone`, `minecraft:mossy_cobblestone`, `minecraft:cobblestone`.
- **Content:** 5 decorator rule(s) (2 shared snippet reference(s)) using `minecraft:fern`, `minecraft:short_grass`, `minecraft:red_mushroom`, `minecraft:brown_mushroom`. Procedural content: 1 trees (snarlwood).

## Underworld treatment

- **Minecraft identity:** derivative `minecraft:warped_forest`; native-structure derivative `minecraft:warped_forest`; custom identities `underworld_estranged_snarlwood_thicket_ac2e8269`.
- **Surface:** 1 block(s): `minecraft:warped_nylium`, `minecraft:netherrack`; 2 block(s): `minecraft:netherrack`; 1-3 block(s): `minecraft:netherrack`. Wall palette: `minecraft:netherrack`, `minecraft:blackstone`.
- **Content:** 6 decorator rule(s) (3 shared snippet reference(s)) using `minecraft:nether_sprouts`, `minecraft:warped_fungus`. Procedural content: 1 trees (snarlwood).
- **Entity spawners:** `nether/surface/warped-forest`, `nether/cave`.

Underworld keeps the terrain links but uses its Nether derivative, materials, objects, and surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.

## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome estranged/snarlwood-thicket
/iris what biome
/iris what region
```

The first command locates the biome. The other commands confirm its load key and region at your position. Pack edits do not change existing chunks.
