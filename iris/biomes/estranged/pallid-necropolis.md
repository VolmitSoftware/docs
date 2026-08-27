---
title: "Biome Atlas — Pallid Necropolis"
description: "Iris biome atlas entry for estranged/pallid-necropolis in Overworld 4002 and Underworld 1005"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
`estranged/pallid-necropolis` is a directly selected land biome in the pinned Overworld 4002 and Underworld 1005 packs. The two packs preserve its terrain identity while applying different materials, Minecraft biome identities, decoration and ecology.

## Selection and weighting

This page records direct land selection. The percentage is the biome weighted share after its region and the land role have already been selected; region distribution and selection noise still determine its world-scale coverage.

| Pack | Region | List occurrences | Rarity divisor | Combined raw weight | Effective land-list share |
|---|---|---:|---:|---:|---:|
| Overworld 4002 | `estranged` (Estranged) | 1 | 4 | 0.25 | 5.28% |
| Underworld 1005 | `estranged` (Underworld Estranged) | 1 | 4 | 0.25 | 4.41% |

Repeated entries contribute repeated `1 / rarity` weights. They are retained above instead of being silently deduplicated.

## Shared terrain

Both packs use the same generator links: `smooth-dunes` (8..20), `vascular-cracked-cliffs` (2..28), `spikes` (0..14); combined authored contribution `10..62` blocks relative to fluid height.

Biome identity scatter uses `SIMPLEX` noise in the Overworld configuration. Generator minima and maxima are contributions relative to each dimension fluid height; stacked links add together.

## Overworld 4002 treatment

- **Minecraft identity:** derivative `minecraft:dark_forest`; native-structure derivative `minecraft:pale_garden`; custom identities `estranged_pallid_necropolis`.
- **Surface:** 1 block(s): `minecraft:pale_moss_block`, `minecraft:calcite`, `minecraft:diorite`, `minecraft:bone_block`; 2-5 block(s): `minecraft:calcite`, `minecraft:diorite`, `minecraft:rooted_dirt`; 8-20 block(s): `minecraft:tuff`, `minecraft:calcite`, `minecraft:stone`. Wall palette: `minecraft:calcite`, `minecraft:diorite`, `minecraft:tuff`, `minecraft:bone_block`.
- **Content:** 2 object placement rule(s) drawing from 2 object key(s), including `clutter/grave1`, `clutter/genericgrave1`. 2 decorator rule(s) using `minecraft:pale_moss_carpet`, `minecraft:air`, `minecraft:closed_eyeblossom`, `minecraft:open_eyeblossom`. Procedural content: 2 trees (pallid-willow, pallid-spindle), 1 formations (ossuary-spire), 1 ruins (pallid-marker).

## Underworld 1005 treatment

- **Minecraft identity:** derivative `minecraft:warped_forest`; native-structure derivative `minecraft:warped_forest`; custom identities `underworld_estranged_pallid_necropolis_8bcbe4bc`.
- **Surface:** 1 block(s): `minecraft:warped_wart_block`, `minecraft:netherrack`, `minecraft:quartz_block`, `minecraft:bone_block`; 2-5 block(s): `minecraft:netherrack`, `minecraft:quartz_block`; 8-20 block(s): `minecraft:netherrack`. Wall palette: `minecraft:netherrack`, `minecraft:quartz_block`, `minecraft:bone_block`.
- **Content:** 2 object placement rule(s) drawing from 2 object key(s), including `underworld/warped/clutter/grave1`, `underworld/warped/clutter/genericgrave1`. 3 decorator rule(s) (1 shared snippet reference(s)) using `minecraft:nether_sprouts`, `minecraft:air`, `minecraft:warped_roots`. Procedural content: 2 trees (pallid-willow, pallid-spindle), 1 formations (ossuary-spire), 1 ruins (pallid-marker).
- **Entity spawners:** `nether/surface/warped-forest`, `nether/cave`.

The Underworld treatment keeps the same terrain links but uses its Nether derivative, Nether material conversion, Nether objects and explicit Nether surface/cave spawners.

## Children

No ordinary child biomes are declared.

## Floating variants

No floating child biomes are declared.


## Inspect in game

Run these in an Iris world and inspect freshly generated terrain:

```text
/iris find biome estranged/pallid-necropolis
/iris what biome
/iris what region
```

The first command locates the biome. The other two confirm the exact biome load key and owning region at the current position. Existing chunks do not change when pack files are edited.
