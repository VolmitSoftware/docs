---
title: "Tropical Biomes"
description: "Navigation for the built-in tropical biomes across Overworld and Underworld"
published: true
date: 2026-10-24T00:00:00.000Z
tags: "iris, biomes, overworld, underworld, tropical"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
Rainforests, bamboo forests, islands, volcanic terrain, tropical waters, and distinct tropical shores.

This family has **7 child-only reachable variants**. Those variants are documented with the parent pages that reach them.

## Ecology

Overworld tropical land, water, and shore biomes inherit their configured Minecraft derivative spawn tables. Minecraft controls the population and placement of their wildlife and hostile mobs.

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
| [Submerged Volcanic](/iris/biomes/tropical/submerged-volcanic) | `tropical/submerged-volcanic` | Sea | Tropical |
| [Volcanic Plains](/iris/biomes/tropical/volcanic-plains) | `tropical/volcanic-plains` | Land | Tropical |
| [Wilds](/iris/biomes/tropical/wilds) | `tropical/wilds` | Land | Tropical |

Return to [44 - Biome Catalog](/iris/44-biome-catalog).

## 3D terrain coverage

The paired packs explicitly configure 17 terrain identities in this family: 2 cliff, 2 forest, 2 hills, 4 lowland, 5 mountain, 2 volcanic. Each entry lists the numeric `terrain3D` settings for its root and children.

## Hydrology

The tropical region's `hydrologyPolicy` sets pond density `2.5`, the highest of any region in either pack, and rainfall `1.77`, near the top (only Swamp is higher), so tropical terrain carries more seeded cups than any other region and its ponds stay full. It lists `tropical/island-beach`, `tropical/beach`, `tropical/beach-bamboo` and `tropical/beach-charred` as shore biomes; no `shoreBiomeWidth` is set, so the band is off. Overworld fills the water with water and Underworld with lava.

[Volcanic Plains](/iris/biomes/tropical/volcanic-plains) and its volcano child set rainfall `1.8`, pond density `3` and `fluid: lava`, so their ponds and lakes are lava in both packs. See [36b - Hydrology Policy](/iris/36b-river-policy).
