---
title: "Biome Terrain Shaping"
description: "Shared 3D terrain profiles and protected terrain in the built-in Iris packs"
published: true
date: 2026-09-09T00:23:13.301Z
tags: "iris, biomes, terrain, overworld, underworld"
editor: markdown
dateCreated: 2026-09-08T07:14:15.291Z
---
Overworld 4007 and Underworld 1010 explicitly configure 220 terrain identities. There are 197 active profiles and 23 protected identities.
The audit covers every region-selected land biome, its ordinary children, and the floating-only Glass Shard child. Each paired atlas entry gives its dimensions and exact density and crack noise styles.

## Terrain profiles

The original height generators supply broad mountains and valleys. Biome `terrain3D` settings add or remove rock around that shape.
Horizontal scale controls feature width. Vertical scale controls how quickly density changes with height, which permits shelves with air beneath them.

| Profile | Biomes | Default density noise | Intended terrain |
|---|---:|---|---|
| Cliff | 15 | `IRIS_HALF` | Pronounced overhangs and narrow cracks through steep cliffs. |
| Forest | 28 | `PERLIN` | Broad undercuts beneath elevated forests and their taller children, without a separate crack field. |
| Fungal | 6 | `NOWHERE` | Rounded shelves beneath fungal forests and their raised variants, without separate cracks. |
| Glacial | 8 | `SIMPLEX` | Ice and rock shelves with crevasses in cold peaks. |
| Hills | 43 | `PERLIN` | Broad rock shelves on wooded hills, without separate cracks. |
| Lowland | 41 | `PERLIN` | Small recesses on dry slopes, without separate cracks. Broad plains retain low relief. |
| Magnetic | 6 | `HEXAGON` | Ground-level recesses below the independent floating-island system, without separate cracks. |
| Mesa | 12 | `NOWHERE` | Undercut plateau rims and fractures through layered badlands. |
| Mountain | 12 | `IRIS_HALF` | Large projecting shelves and sparse fissures across mountain faces. |
| Prismatic | 16 | `HEXAGON` | Projecting terraces and cracks across all sixteen color families. |
| Sandstone | 4 | `NOWHERE` | Rocky desert benches and occasional incised cuts. |
| Sculptural | 4 | `IRIS_HALF` | Large recesses and shelves in Estranged and amethyst terrain. |
| Volcanic | 2 | `HEXAGON` | Broken volcanic slopes with recesses and narrow fissures. |

Hills and Forest profiles use `NOWHERE` in tropical and swamp biomes, and `SIMPLEX` in frozen biomes. Their Estranged, Ether, and Magic Forest variants use `IRIS_HALF`.
Cliff and Mountain profiles use `NOWHERE` in Hot, Savanna, and Tropical biomes.
Stony Peaks keeps its original `SIMPLEX` density pattern at horizontal scale 144 and vertical scale 28 to avoid new detached formations. Its crack field uses reduced depth and greater spacing.
Magnetic Noise uses `IRIS_HALF`, and Magnetic Mycelium uses `NOWHERE`. The paired biome tables list each override.

`PERLIN` supplies 79 density profiles, `NOWHERE` 43, and `IRIS_HALF` 31. `HEXAGON` and `SIMPLEX` each supply 22.
Density amplitudes range from 10 blocks for Lowland profiles to 56 blocks for Cliff profiles.
Horizontal density scales range from 144 to 280 blocks, and vertical scales range from 24 to 36 blocks. Most profiles use longer scales for broad shelves and recesses while retaining their displacement amplitudes.

The separate crack field remains active in 73 profiles. All 124 Lowland, Hills, Forest, Fungal, and Magnetic profiles disable it.
The 16 Mesa and Sandstone profiles use `PERLIN` crack noise. The other 57 active crack fields use `SIMPLEX`.
Active crack depths range from 7 to 14 blocks, with horizontal scales from 336 to 416 blocks and half-widths from 2 to 2.25 blocks.

Every active profile starts its elevation fade above fluid level plus 8 blocks. Full elevation strength starts 24 blocks above that threshold.
The slope gate further reduces deformation on gentle terrain. The atlas tables give both the starting slope and the slope for full strength.

Surface palettes and slope-gated vegetation on lower ledges use neighboring ledge heights. A steep upper cap does not force a flat lower ledge to use steep-slope materials. These surface rules retain the existing three-block slope metric, separate from the density profile's rise/run gate.

## Protected terrain

Sea, shore, and cave biomes do not enable `terrain3D`. They retain their existing ocean, shore, and cave systems.
The following land or floating identities explicitly set `enabled` to false. An elevated child can use 3D terrain while its wet parent stays protected.

| Biome | Reason |
|---|---|
| `estranged/mistveil-swamp` | Wetland water and soft banks retain their current terrain. |
| `estranged/stiltroot-shallows` | Shallow water and rooted banks retain their current terrain. |
| `estranged/taxodium` | Wetland floors and tree supports retain their current terrain. |
| `estranged/weeping-mire` | Mire pools and low banks retain their current terrain. |
| `frozen/fields/hilly-plains` | Low river-shaped terrain retains its current channels. |
| `hot/desert-dunes` | Loose sand dunes retain their smooth surface. |
| `hot/desert-dunes-red` | Loose sand dunes retain their smooth surface. The mountain-cliffs child supplies rock overhangs. |
| `hot/oasis` | Oasis pools and their banks retain their current terrain. |
| `magnetics/glass-shard` | This floating-only child keeps its existing floating-island geometry. |
| `swamp/cambian-drift` | Low wetland terrain retains its water. Its elevated child supplies rock shelves. |
| `swamp/denmyre` | Low wetland terrain retains its water and tree supports. |
| `swamp/marsh` | Marsh floors and banks retain their current terrain. |
| `swamp/marsh-rotten` | Flooded marsh floors retain their current terrain. |
| `swamp/roofed-forest` | Low wetland forest retains its floor. Its elevated child supplies rock shelves. |
| `swamp/roofed-wayward` | Low wetland forest retains its floor. Its elevated child supplies rock shelves. |
| `swamp/sea/lake` | Lake beds retain their current terrain. |
| `swamp/swamp-forest` | Low wetland forest retains its floor and tree supports. |
| `swamp/swamp-puddle` | Puddle beds retain their current terrain. |
| `swamp/willow-forest` | Low wetland forest retains its floor. Its elevated child supplies rock shelves. |
| `temperate/calmplains` | Low wet plains retain their smooth terrain. |
| `temperate/fancyplains` | Low wet plains retain their smooth terrain. |
| `temperate/overflowed` | Flooded terrain retains its current floor and water. |
| `vanilla/mangrove_swamp` | Mangrove water and rooted banks retain their current terrain. |

## Paired geometry and materials

Both packs use identical terrain profiles, height generators, biome weights, ordinary children, and floating geometry. Each pack keeps its existing surface materials, objects, decoration, ecology, and ore settings.
Underworld keeps lava river profiles and its own deep-fluid configuration. Its cave profile continues to disable ordinary cave-fluid admission. These are intentional environmental differences.
Underworld 1010 aligns Estranged rarity and shore selection with Overworld. It also aligns river incision, coastal outlets, coastal grottos, sea-cave geometry, and mouth width.
Hot and Magnetics now select the shared lava-pool geometry in both packs. The pools use lava in each pack.

## Coverage validation

The atlas validator follows hydrology references as well as region lists, children, floating targets, and carving entries. Both packs have 373 reachable biome identities.
It checks paired terrain geometry and requires an explicit profile for each reachable land identity. It checks each configured profile's atlas row against its dimensions and exact noise styles. Disabled profiles show `None / None`, and disabled crack fields show `None`.

```text
ruby tools/validate_iris_biome_atlas.rb
```

Run the command from the central docs repository. JSON validation and atlas checks do not establish generation speed or in-game appearance.
Generate fresh chunks to inspect changed terrain. Existing chunks retain their previous terrain until regenerated.

Return to [Biome Catalog](/iris/44-biome-catalog), [Overworld](/iris/biomes/overworld), or [Underworld](/iris/biomes/underworld).
