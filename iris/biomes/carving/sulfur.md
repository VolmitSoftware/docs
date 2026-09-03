---
title: "Sulfur Galleries — Cave Biome"
description: "Sulfur Galleries and Sulfur Hollows, with native sulfur pools, spikes and cube ecology"
published: true
date: 2026-09-03T04:14:00.000Z
tags: "iris, biome-atlas, cave, sulfur"
editor: markdown
dateCreated: 2026-09-03T00:00:00.000Z
---

`carving/sulfur` is a regional cave root in the current Overworld and Underworld pack sources, with `carving/sulfur-hollows` as its child. Both require Minecraft 26.2. Existing worlds need the updated pack snapshot and fresh chunks; updating Iris alone does not add this content.

## Selection and shape

| Pack | Regional slots | Biome rarity | Relative biome weight |
|---|---|---|---|
| Overworld | Estranged 1/6; Hot 1/7; Temperate 1/6; Tropical 1/6 | `1` | `1/1` |
| Underworld | Estranged 1/6; Hot 1/7; Temperate 1/6; Tropical 1/6 | `1` | `1/1` |

Slot fractions describe the regional lists, not whole-world probabilities. The root has one child selected with Simplex noise at zoom `0.62` and shrink factor `1.3`. The new selector entries change cave selection in newly generated areas of those regions.

Both caves use dripstone-derived profiles with a declared engine-local vertical range `12..620`, sample step `2`, minimum surface depth `18`, surface clearance `12`, and surface breaks disabled. The root retains the larger dripstone profile; the hollows use the companion child profile. Profiles, child layout, regional selectors, formation dimensions and pool silhouettes match across both packs.

## Overworld treatment

Sulfur supplies the dominant yellow rock, cinnabar introduces red mineral patches and spire bands, and tuff and smooth basalt break up the palette. The shared `expressions/sulfur-strata.json` cycles sulfur, cinnabar, sulfur and smooth basalt in two-block horizontal bands on the spires. The baked spire height ranges are 6–12 blocks in the galleries and 3–6 in the hollows, with placement chances `0.035` and `0.015` respectively. Cave placement centers them at its sampled anchor with a one-block downward translation, burying the lower body and leaving shorter exposed crowns.

Native sulfur spikes require sulfur or cinnabar support. Ordinary short spikes use `STATIC` style; secondary taller clusters use `SIMPLEX` at zoom `0.7`. All four decorators use fixed block ranges with `scaleStack: false`. The table lists configured chances and heights; support and available cave space still constrain placement.

| Spike decorator | Style | Galleries chance | Galleries height | Hollows chance | Hollows height |
|---|---|---|---|---|---|
| Ordinary floor | `STATIC` | `0.12` | 1–3 | `0.065` | 1–2 |
| Ordinary ceiling | `STATIC` | `0.17` | 1–4 | `0.10` | 1–3 |
| Clustered floor | `SIMPLEX`, zoom `0.7` | `0.025` | 4–6 | `0.012` | 3–4 |
| Clustered ceiling | `SIMPLEX`, zoom `0.7` | `0.04` | 4–7 | `0.02` | 3–5 |

Sparse floor glow lichen provides light. Registered biomes `overworld:sulfur_galleries` and `overworld:sulfur_hollows` tint water yellow-green (`#a6ba42`) with olive underwater fog (`#535d21`) and muted mineral fog (`#777a48`). Native `minecraft:sulfur_caves` supplies the derivative and spawn table.

### Pools and geysers

Three authored objects provide sealed, irregular mineral pools. The ordinary pockets expose five or nine source-water cells in a single shallow layer; the larger geyser bowl has stepped depths of one or two blocks. Each includes a solid floor and rim, sparse sulfur spikes around the edge, and one potent sulfur block under the water.

| Object | Dimensions (width × height × depth) | Source-water cells | Water depth | Use |
|---|---|---|---|---|
| `carving/sulfur/pool-1` | 5 × 5 × 5 | 5 | 1 | Tiny irregular pocket |
| `carving/sulfur/pool-2` | 7 × 5 × 5 | 9 | 1 | Elongated shallow pocket |
| `carving/sulfur/pool-3` | 11 × 5 × 9 | 55 | 1–2 | Rare magma-heated geyser bowl |

Ordinary pool placements attempt at chance `0.12` in galleries and `0.34` in hollows; geyser placements use `0.025` and `0.06`. Each successful roll attempts one object, subject to cave anchor and placement checks. These values do not guarantee a pool in every selected chunk. Pools anchor to dry cave floors, with `bottom: false` and `translate.y: -2`: their lowest bed is four blocks below the sampled anchor, their water surface and rim are one below it, and their rim spikes reach the anchor.

The ordinary bowls store potent sulfur in its native `wet` state. The magma-backed bowl stores it in `dormant`, which allows the native countdown to begin. Minecraft supplies the gas, nausea and geyser behavior; Iris does not run an additional hazard task. Underlying source water is contained by the object even when its surrounding cave opens into a larger space. Final cave cleanup removes spike chains whose support was replaced by a pool, leaving the water pocket clear.

### Sulfur cubes

Both cave variants inherit the native sulfur-cave spawn table, including sulfur cubes and cave spiders. There is no additional Iris ambient spawner multiplying that table. Natural spawning still obeys Minecraft's mob caps, difficulty, light and placement rules.

`entities/standard/passive/sulfur-cube.json` defines a reusable unmodified `minecraft:sulfur_cube`. Pack objects, markers and spawners may reference this entity key where explicit placement is desired. On Bukkit, a player can check the template with:

```text
/iris studio spawn standard/passive/sulfur-cube
```

Feeding, block absorption, shearing, buckets, splitting and physics are the native Minecraft behaviors. No pre-fed block, custom name or artificial combat ability is imposed.

## Underworld treatment

The same cave geometry and spike distributions use sulfur, cinnabar, blackstone and smooth basalt, sparse shroomlights, and sealed source-lava pools. The object keys are `underworld/carving/sulfur/pool-1` through `pool-3`; their dimensions and occupied coordinates match the Overworld objects, with lava replacing every water cell. Potent sulfur becomes magma, so this half has lava hazards rather than water geysers.

The derivative is `minecraft:basalt_deltas`, retaining native Nether ecology including magma cubes. Custom ids are `underworld:underworld_sulfur_galleries` and `underworld:underworld_sulfur_hollows`, with warm brown fog. The Overworld sulfur cube template is not copied into this lava habitat.

## Inspect and validate

Use an updated local pack on a 26.2 server. Validate it before opening a studio or creating a world, then inspect fresh chunks:

```text
/iris find biome carving/sulfur
/iris what biome
/iris edit biome carving/sulfur
```

Descend to the selected cave volume if the locator leaves the player above it. Inspect both the galleries and hollows; the latter have fewer floor spikes and more pool attempts. If a custom biome id is missing, restart after installing the pack so its biome registrations are available before world creation.

For the general placement and ecology contracts, see [15 - Caves & Carving](/iris/15-caves-carving), [16 - Surfaces, Decorators, Deposits](/iris/16-surfaces-decorators-deposits), and [23 - Loot, Entities, Spawners, Markers](/iris/23-loot-entities-spawners-markers).
