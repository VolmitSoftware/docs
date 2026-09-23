---
title: "Biome Catalog"
description: "Paired atlas of the built-in Iris Overworld and Underworld biomes"
published: true
date: 2026-09-22T00:00:00.000Z
tags: "iris, biomes, overworld, underworld"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
This atlas documents the current sources of the built-in Overworld and Underworld packs. Each entry treats the shared terrain identity once, then records how the two packs render and populate it differently. Only reachable content is included. An installed world keeps its active immutable epoch until the operator stages an update; source changes are not automatically present in previously downloaded releases.

Overworld 4009 and Underworld 1011 configure 197 land biomes and children for 3D terrain. Another 23 identities explicitly protect wetlands, dunes, water basins or existing floating geometry. The profiles vary from small lowland recesses to deep cliff undercuts, projecting mountain shelves, and narrow rock fissures.

The profiles retain displacement amplitudes from 10 to 56 blocks. Horizontal density scales range from 144 to 280 blocks, and vertical scales range from 24 to 36 blocks.
The five density styles vary by terrain family: `PERLIN`, `NOWHERE`, `IRIS_HALF`, `HEXAGON`, and `SIMPLEX`. Most profiles use larger feature scales for broader shelves and recesses.
Stony Peaks keeps its original `SIMPLEX` density pattern and scales to avoid new detached formations. Its crack field uses reduced depth and greater spacing.
Cracks remain active in 73 profiles, with depths from 7 to 14 blocks and horizontal scales from 336 to 416 blocks. Lowland, Hills, Forest, Fungal, and Magnetic treatments disable the separate crack field.

The paired terrain tables give each biome's density amplitude, feature scales, crack dimensions, slope gate, and exact density and crack noise styles. See [Terrain shaping](/iris/biomes/terrain-shaping) for family defaults, coverage, and exclusions. Seas, shorelines, and cave biomes retain their separate terrain systems.

Overworld 4004 reduces every subterranean ore pass by 30% and permits ore on exterior terrain surfaces only in exact `minecraft:stone`. Cave-air walls retain normal deposit host rules, and individual surface biomes can replace the exterior host list. Underworld retains its independent ore table and exposure behavior.

The `trees/mixed/dotree1` through `trees/mixed/dotree10` objects use connected fences at matching positions in both packs. Overworld uses oak, spruce, and dark oak fences. Underworld uses warped fences in soul and warped assets. Wastes assets use both crimson and warped fences to match their branch materials. Seven biome identities share these objects, including [Tundra Magic Violet Forest](/iris/biomes/temperate/reaching-forest-violet).

Overworld [Pale Oak Forest](/iris/biomes/temperate/pale-oak-forest), [Pale Denmyre](/iris/biomes/temperate/pale-denmyre), [Pale Oak Highlands](/iris/biomes/mountain/pale-oak-highlands), and [Pale Pines](/iris/biomes/frozen/pale-pines) include natural heart-bearing pale oak trees. Their Creakings appear at night near players when monster spawning is enabled; destroying a heart removes its linked Creaking. Highlands and Pines add an occasional pale oak encounter tree alongside their existing trees.

> **Pack maintenance requirement:** any update to either built-in pack that changes biome files, region selectors, dimension carving, children, floating biomes, terrain, materials, decoration, ecology, or reachability must update this atlas in the same workstream. A pack update with stale atlas pages is incomplete.
{.is-warning}

Both packs disable standalone aquifers in dimension, region, and biome cave profiles. Contained hydrology and natural surface fluids remain active, using water in Overworld and lava in Underworld. Deep lava retains its separate controls.

Amethyst clutter retains its native block scale. Overworld glass-shard islands in [Magnetics Glass](/iris/biomes/magnetics/glass) and [Cherry Grove](/iris/biomes/vanilla/cherry_grove) also use native-size amethyst clutter, with buds and clusters attached to their amethyst blocks. Frostspar uses fewer solid tapered shards. Frozen surface formations share compact spires, drift boulders, shard fans, frost blooms, and sprigs, with matching seeds and support settings. Underworld uses the corresponding Nether palettes.

Both packs declare `deep_lava` and `deep_lava_small` as contained lava pools with matching placement settings. Frozen cave rocks use `scale.size: 0.375`. Jungle cave trees use the same scale and `density: 2`. Lush, Moss Pillars, Swamp, and Mushroom caves also share their reduced tree or fungi densities. Amethyst Rainforest large trees share `FAST_STILT` placement. Croak omits surface pointed dripstone in Overworld and its basalt counterpart in Underworld.

Both packs use the same twelve region display names because each name’s length contributes to shoreline noise. This keeps shoreline sampling aligned at the same seed and coordinates.

Both packs set nonflat terrain generators to `surfaceDetail: 0.5`. This halves the variation between original six-block grid heights and their interpolated surface. Generator seeds, broad feature scales, height bands, and 3D terrain amplitudes and scales retain their settings.

Mesa land biomes in both packs use unwarped `PERLIN` density noise. Their height generators and 3D amplitude, scale, and crack settings retain their values; cliff details change with the density field. See [Mesa biomes](/iris/biomes/mesa).

[Lush Plains](/iris/biomes/temperate/lush-plains) and its yellow child use a 1% wildflower placement chance in Overworld, a 60% reduction. Other biomes retain the shared wildflower setting.


[Calm Plains](/iris/biomes/temperate/calmplains), [Fancy Plains](/iris/biomes/temperate/fancyplains), and [Rough Plains](/iris/biomes/temperate/roughplains) share ungated lower-layer thicknesses in both packs. Overworld uses dirt and mixed soil. Underworld uses netherrack. Steep columns retain these layers when the slope-gated surface is rejected.

Both packs disable regional rivers and three-dimensional river banks, and share excavation limits and two-layer river shores. Overworld uses sand shores. Underworld uses blackstone. Temperate and Estranged share their coastal and river-shore selector lists.

Overworld 4011 and Underworld 1013 add four reachable poplar biome pairs within Birch Forest, Autumn, Taiga, and Emberbark Woods. Each biome contains authored and procedural trees, deadwood, ground cover, climate, and ecology. Nether counterparts keep the terrain and tree shapes with native Nether materials. See [Poplar biomes](/iris/17b-procedural-trees#poplar-biomes).

## Catalog scope

The paired catalog contains 375 reachable biome identities:

| Kind | Count | Documentation treatment |
|---|---:|---|
| Direct land roots | 164 | One paired page per root |
| Direct sea roots | 31 | One paired page per root |
| Direct shore roots | 17 | Consolidated in [Shorelines](/iris/biomes/shorelines), with distinct variants called out |
| Region-selected cave roots | 47 | One paired page per root, except the 16-color Prismatic family |
| Dimension-carving roots | 1 | The global Deep Dark page includes its descendants |
| Child-only and floating-only variants | 115 | Included with a parent root rather than given an orphan page |

The Overworld repository contains nine unreachable biome files, while Underworld contains two. The shared unselected assets are `mountain/shore/beach` and `vanilla/stony_shore`. They remain documented under Shorelines but are not active catalog entries. River-policy references account for ten roots and two additional children in this total.

## Family navigation

| Family | Direct roots | Child-only variants | Scope |
|---|---:|---:|---|
| [Carving](/iris/biomes/carving) | 48 | 49 | Region cave selectors and the dimension-level Deep Dark band |
| [Estranged](/iris/biomes/estranged) | 15 | 1 | Surreal woodlands, wetlands, and sculptural terrain |
| [Frozen](/iris/biomes/frozen) | 21 | 8 | Snow, ice, spruce, mountains, cold water, and shores |
| [Hot](/iris/biomes/hot) | 10 | 2 | Dunes, desert mountains, oases, warm water, and shores |
| [Magnetics](/iris/biomes/magnetics) | 6 | 1 | Metallic, glassy, frozen, fungal, and noise-driven terrain |
| [Mesa](/iris/biomes/mesa) | 7 | 7 | Plateaus, valleys, badlands, rivers, and shores |
| [Mountain](/iris/biomes/mountain) | 11 | 5 | Mountains, cliffs, highlands, forests, rivers, and shores |
| [Mushroom](/iris/biomes/mushroom) | 8 | 2 | Fungal land, water, and shoreline biomes |
| [Ocean](/iris/biomes/ocean) | 5 | 1 | Shared deep, dark, rich, warm, and shoreline roots |
| [Prismatics](/iris/biomes/prismatics) | 18 | 0 | Sixteen color families plus shared sea and shore roots |
| [Savanna](/iris/biomes/savanna) | 5 | 2 | Acacia, savanna, plateau, forest, and shore roots |
| [Swamp](/iris/biomes/swamp) | 13 | 7 | Marshes, mangroves, forests, lakes, oceans, and shores |
| [Temperate](/iris/biomes/temperate) | 32 | 12 | Plains, meadows, forests, waters, and shared shores |
| [Terralost](/iris/biomes/terralost) | 5 | 0 | Alpine, amethyst, and ancient-sand terrain |
| [Tropical](/iris/biomes/tropical) | 20 | 7 | Rainforests, islands, volcanoes, waters, and distinct shores |
| [Tundra](/iris/biomes/tundra) | 17 | 11 | Taiga, redwoods, alpine terrain, mountains, water, and shores |
| [Vanilla](/iris/biomes/vanilla) | 19 | 0 | Vanilla-compatible roots mixed into Iris selectors |

The [Sulfur Galleries and Hollows](/iris/biomes/carving/sulfur) require Minecraft 26.2. They add a regional cave root and one child to the current pack sources, with ordinary short sulfur spikes, occasional taller clusters, tiny mineral pools, and rare banded spires. Overworld uses native sulfur cubes and water pools with occasional geysers; Underworld keeps the same geometry with lava pools and Nether ecology.

Overworld 4006 and Underworld 1009 use lowercase resource paths. Underworld 1009 corrects the casing of 148 resource paths and 273 references. Both packs use `mountain/cute_cliffs` for Lower Mountain and `mountain/cute_cliffs+` for Mountain Middle; the `+` remains part of the child key. This casing update preserves terrain settings, selection weights, materials, ecology, and the independent Underworld ore table. See [Lower Mountain](/iris/biomes/mountain/cute_cliffs) for the paired treatments.

## Read the atlas

- [Overworld 4009](/iris/biomes/overworld) explains the normal-world environment, selection graph, terrain scale, water, ores, and native structure policy.
- [Underworld 1011](/iris/biomes/underworld) explains the coordinate-compatible Nether treatment, lava, lighting, materials, ecology, and lack of a Nether roof.
- [Shorelines](/iris/biomes/shorelines) collects the short transition biomes that do not need individual pages.
- Individual entries live at `/iris/biomes/<load-key>`. For example, `temperate/plains` is [Temperate Plains](/iris/biomes/temperate/plains), while `carving/standard-deepdark` is [the global Deep Dark family](/iris/biomes/carving/standard-deepdark).

An atlas page lists every region and selection role that can choose the root. Repeated entries are reported as effective weighting because repeated keys in a region or child list are intentional selection weight, not harmless duplication. Child cycles and self-references are described without expanding them forever.

## What counts as in use

Reachability begins at the active dimension file. It follows region land, sea, shore, and cave lists, dimension carving, children, floating targets, carving references, and hydrology biome references. River policies can select surface, mouth, shore, bank, and flooded-cave biomes. A file outside this graph is omitted even if it parses successfully.

This distinction matters when editing a pack. An authored biome can validate yet never generate because nothing selects it. Use [13 - Biomes](/iris/13-biomes) for the configuration contract and [27 - Example - Configuring Overworld](/iris/27-example-configuring-overworld) for the editing workflow.

## Inspect a biome in game

On Bukkit-family servers:

```text
/iris find biome <load-key>
/iris what biome
```

On Fabric, Forge, and NeoForge, `/iris goto biome <load-key>` is the equivalent locator alias. Generate fresh chunks before judging a pack edit; existing chunks keep their previous terrain and biome data.
