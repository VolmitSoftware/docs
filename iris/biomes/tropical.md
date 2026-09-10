---
title: "Tropical Biomes"
description: "Navigation for the built-in tropical biomes across Overworld and Underworld"
published: true
date: 2026-09-09T01:34:05.711Z
tags: "iris, biomes, overworld, underworld, tropical"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
Rainforests, bamboo forests, islands, volcanic terrain, tropical waters, and distinct tropical shores.

This family has **7 child-only reachable variants**. Those variants are documented with the parent pages that reach them.

## Direct roots

| Page | Load key | Role | Region membership |
|---|---|---|---|
| [Bamboo Forest](/iris/biomes/tropical/bamboo-forest) | `tropical/bamboo-forest` | Land | Tropical |
| [Shorelines](/iris/biomes/shorelines) | `tropical/beach` | Shore | Tropical |
| [Shorelines](/iris/biomes/shorelines) | `tropical/beach-bamboo` | Shore | Tropical |
| [Shorelines](/iris/biomes/shorelines) | `tropical/beach-charred` | Shore | Tropical |
| [Shorelines](/iris/biomes/shorelines) | `tropical/island-beach` | Shore | Tropical |
| [Mountain](/iris/biomes/tropical/mountain) | `tropical/mountain` | Land | Tropical |
| [Mountain Extreme](/iris/biomes/tropical/mountain-extreme) | `tropical/mountain-extreme` | Land | Tropical |
| [Mountain Plains](/iris/biomes/tropical/mountain-plains) | `tropical/mountain-plains` | Land | Tropical |
| [Plains](/iris/biomes/tropical/plains) | `tropical/plains` | Land | Tropical |
| [Plains Hills](/iris/biomes/tropical/plains-hills) | `tropical/plains-hills` | Land | Tropical |
| [Rainforest](/iris/biomes/tropical/rainforest) | `tropical/rainforest` | Land | Tropical |
| [Rainforest Hills](/iris/biomes/tropical/rainforest-hills) | `tropical/rainforest-hills` | Land | Tropical |
| [Rainforest Island](/iris/biomes/tropical/rainforest-island) | `tropical/rainforest-island` | Land | Tropical |
| [Rainforest Wicked](/iris/biomes/tropical/rainforest-wicked) | `tropical/rainforest-wicked` | Land | Tropical |
| [Sea / Ocean](/iris/biomes/tropical/sea/ocean) | `tropical/sea/ocean` | Sea | Tropical |
| [Sea / River Soft](/iris/biomes/tropical/sea/river-soft) | `tropical/sea/river-soft` | Hydrology channel | Tropical river policy |
| [Sea / River Steep](/iris/biomes/tropical/sea/river-steep) | `tropical/sea/river-steep` | Hydrology channel | Tropical river policy |
| [Submerged Volcanic](/iris/biomes/tropical/submerged-volcanic) | `tropical/submerged-volcanic` | Sea | Tropical |
| [Volcanic Plains](/iris/biomes/tropical/volcanic-plains) | `tropical/volcanic-plains` | Land | Tropical |
| [Wilds](/iris/biomes/tropical/wilds) | `tropical/wilds` | Land | Tropical |

Return to [44 - Biome Catalog](/iris/44-biome-catalog).

## 3D terrain coverage

The paired packs explicitly configure 17 terrain identities in this family: 2 cliff, 2 forest, 2 hills, 4 lowland, 5 mountain, 2 volcanic. Each entry lists the numeric `terrain3D` settings for its root and children.

## Hydrology

The regional surface policy uses density 8, source spacing 160 blocks, three tributaries per outlet, three inland outlets, and four coastal outlets per fully covered tile. Budgets shrink with the area covered in mixed tiles; route length, terrain, and containment still decide which candidates survive. Courses may be as short as 64 blocks and cut up to 32 blocks into terrain. Channel width is multiplied by 0.65 and depth by 1.15; bank blend uses 1.0 with a 1-block shore bench.

`tropical_lake` adds standing pools with 8–16-block radii, depth 3, density 8, and 160-block candidate spacing. Overworld fills tropical channels and lakes with water; Underworld uses lava with matching shape settings. Mountain rivers use the regional policy instead of a fluid-painted child.

[Volcanic Plains](/iris/biomes/tropical/volcanic-plains) and its volcano child override this policy with separate lava courses and pools.
