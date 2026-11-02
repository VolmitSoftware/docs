---
title: "Datapack Export"
description: "Compile an Iris pack into a vanilla worldgen datapack for Minecraft 26.3 and later"
published: true
date: 2026-11-02T09:08:50.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-10-28T00:00:00.000Z
---
`/iris datapack export` compiles one dimension of an installed Iris pack into a worldgen datapack that Minecraft 26.3 and later loads without Iris. The datapack rebuilds the pack's biome layout, terrain, rivers, caves, surface, decoration, and objects with Minecraft's own generator. [Limits](#limits) lists every difference from the Iris world.

## Export a world and start a server with it

This workflow exports the `overworld` pack for Minecraft 26.3 and creates a new server world from it. The export command is the same on Bukkit, Fabric, Forge, and NeoForge.

1. Validate the pack. Export refuses a pack with blocking validation errors. See [25 - Pack Management](/iris/25-pack-management#validate).

```none
/iris pack validate pack=overworld     # Bukkit
/iris pack validate overworld          # modded
```

2. Export the dimension:

```none
/iris datapack export overworld
```

The export runs in the background and reports each stage and the number of resources written. When it finishes, Iris lists each diagnostic and reports the output path. A diagnostic reads `<limit> <resource>: <message>`, where the resource is the pack file or datapack path it concerns. Warnings show in yellow and notes in gray. [Limits](#limits) explains each limit name. The datapack is written to the export folder:

| Platform | Export folder | Default file |
|---|---|---|
| Bukkit-family | `plugins/Iris/exports/datapacks/` | `overworld-26.3.zip` |
| Fabric, Forge, NeoForge | `config/irisworldgen/exports/datapacks/` | `overworld-26.3.zip` |

3. On the server that will host the world, create `world/datapacks/` before its first start and copy `overworld-26.3.zip` into it. `world` is the `level-name` value in `server.properties`. Leave `level-type` at its default.

4. Start the server. Minecraft creates the world, and the Overworld generates from the datapack. The Nether and the End generate as in vanilla Minecraft. The server needs neither Iris nor the pack.

In single-player, open **Data Packs** on the Create New World screen, drag `overworld-26.3.zip` into the window, and move it to the **Selected** column. Keep **Default** in the Selected column, because the export builds on the vanilla data pack. Keep the default world type.

Each pack biome exports as the biome `<namespace>:<biome key>`. The key is lowercased, and characters that Minecraft ids do not accept are replaced. Use these ids with `/locate biome`.

## Choose a mode

`mode=` decides how the datapack attaches to a world.

| `mode=` | Adds | Install |
|---|---|---|
| `overworld` (default) | A replacement Overworld in `data/minecraft/dimension/overworld.json` | Copy into `world/datapacks/` before the first start and leave `level-type` at its default. In single-player, add it through **Data Packs** on the Create New World screen and keep **Default** selected. Added to an existing world, it generates every new chunk from the datapack while chunks that already exist keep their terrain, so the terrain changes abruptly at that border |
| `preset` | The world preset `<namespace>:<dimension>` in `data/<namespace>/worldgen/world_preset/<dimension>.json`, listed among the standard world types through `data/minecraft/tags/worldgen/world_preset/normal.json` | Copy into `world/datapacks/` before the first start and set `level-type=<namespace>:<dimension>`. In single-player, add it through **Data Packs** on the Create New World screen, keep **Default** selected, and pick the preset as the world type. A world created with another world type keeps its own Overworld |
| `dimension` | The dimension `<namespace>:<dimension>` in `data/<namespace>/dimension/<dimension>.json` | Copy into the `datapacks/` folder of any new or existing world, then start or restart the server. Players reach `<namespace>:<dimension>` by command, such as `/execute in iris_export:overworld run tp @s 0 200 0`, or through a portal from another plugin or mod |

All three modes also write the noise settings, density functions, noises, biomes, and dimension type under the export namespace. The noise settings set Minecraft's sea level one block above the dimension's `fluidHeight`, so water surfaces sit at the same Y as in the Iris world. Every export also carries the Iris logo as `pack.png`, which the **Data Packs** screen shows next to the pack.

## Choose a Minecraft version

`version=` sets the Minecraft version the datapack targets. The export supports Minecraft 26.3 and later.

| `version=` | Target |
|---|---|
| Blank (default) | The latest supported version, Minecraft 26.3 |
| `26.3` | Minecraft 26.3 |

A patch spelling such as `26.3.0` selects the same target. Any other value, including an older Minecraft version, is refused, and the message lists the supported versions. The datapack declares only its target's pack format, so load it on that Minecraft version.

## Arguments

```none
/iris datapack export <dimension> [version=] [mode=overworld] [namespace=iris_export] [output=] [format=zip] [objects=true] [replace=false]
```

Both Bukkit and mod loaders take the options as `key=value` after the dimension, in any order.

| Argument | Default | Use |
|---|---|---|
| `<dimension>` | Required | Installed pack dimension to export, such as `overworld` |
| `version=` | Latest supported, `26.3` | Target Minecraft version, 26.3 or later. Blank uses the latest |
| `mode=` | `overworld` | `overworld`, `preset`, or `dimension`. See [Choose a mode](#choose-a-mode) |
| `namespace=` | `iris_export` | Namespace of every exported resource. The preset or dimension id is `<namespace>:<dimension>` |
| `output=` | `<dimension>-<version>` | Name of the zip or folder in the export folder. One name of 1–128 characters that starts with a letter, number, `_`, or `-`, followed by letters, numbers, `.`, `_`, or `-`. Paths and slashes are refused |
| `format=` | `zip` | `zip` writes a zip and adds `.zip` to the name when needed. `directory` (aliases `dir`, `folder`) writes an unpacked folder |
| `objects=` | `true` | `false` leaves the pack's objects out of the datapack |
| `replace=` | `false` | `true` replaces an existing output. Without it, an existing output is refused and left unchanged |

A second export to an output that another export is still writing is refused. Bukkit requires `iris.all`. Fabric, Forge, and NeoForge require gamemaster level.

## Limits

Each diagnostic names one of the limits below. The table lists every difference from an Iris world generated from the same pack, with the limit name the export reports for it. Rows without a limit name describe behavior that the export does not report. Hydrology limits are reported only for features the pack uses, once for each dimension, region, or biome whose settings use them.

| Area | Limit | Behavior |
|---|---|---|
| World | | The exported world is a statistical likeness of the Iris world. The same seed gives a different layout, with matching proportions of biomes, regions, land and sea, terrain heights and caves |
| World | | Realms cannot load worldgen datapacks |
| World | | Minecraft shows an experimental-features warning when a world is created with a worldgen datapack |
| World | `DIMENSION_HEIGHT` | The dimension's minimum Y and height align to multiples of 16. The height is at most 4064 blocks, and minimum Y plus height is at most 2032 |
| Image maps | `IMAGE_MAP` | [Image maps](/iris/37-image-maps) are not exported. A dimension that uses them generates from its procedural layers alone. A generator style that uses one exports as its base noise style |
| Noise | | Minecraft noise replaces Iris noise. Each noise style is fitted to Minecraft noise at its configured scale |
| Noise | `NOISE_STYLE` | A style that Minecraft noise cannot reproduce loses part of its shape. Pattern styles such as `CRATER` and `VORTEX` export as fitted smooth noise. `cellularFrequency` is ignored. Cellular styles in cave density modules export as smooth noise. Generator `cellFractureHeight` and noise layer `octaves` multipliers are ignored |
| Noise | | Cellular, glob, vascular, and hexagon styles export as cellular noise in the same style family |
| Terrain | | Terrain blends between biomes over a grid of cells. The cell size follows each generator's interpolator `horizontalScale` |
| Terrain | `FLOATING_ISLAND` | Floating islands export without wall warp, interior carving, and island water |
| Terrain | | Biome [`terrain3D`](/iris/47-volumetric-terrain) overhangs follow each biome's own terrain height, without the slope that blending adds between biomes. Overhangs under plateau edges are shallower than in Iris, and steep blended slopes have more overhang air |
| Biomes | `BIOME_VARIANT` | A biome with several `customDerivitives` or `biomeScatter` entries exports as one Minecraft biome built from the first entry |
| Biomes | `VANILLA_BIOME_DATA` | Each biome copies music, ambience, mob spawns, and structure tags from its vanilla derivative. Iris reads that data from the running server, so it is available only when the server runs the target Minecraft version. Without it, or when the derivative does not exist in the target version, the biome is built from its Iris fields alone |
| Biomes | `SHORE_WIDTH` | `shoreMinimumWidth` is not exported. The shore band follows the shore height only |
| Biomes | | Sea, shore, and underground biome edges follow the terrain height before biome blending. Where terrain blends down to the sea, sea biomes reach further inland and shore bands are narrower than in Iris |
| Rivers | `RIVER_DRAINAGE` | Rivers are valleys calculated from the seed, with water only up to the dimension's `fluidHeight`. They do not follow drainage, so tributaries cross instead of joining, and river width follows elevation |
| Rivers | `RIVER_FLUID` | Rivers fill with the first block of the dimension's `fluidPalette`. A tier `fluid` or [hydrology policy](/iris/36b-river-policy#fluid) `fluid` made of other blocks, such as lava rivers in a water dimension, is not exported. A [`seam`](/iris/36-rivers#hydrologyfluids) on a river fluid's profile is not exported either, including a seam on a fluid made of the dimension fluid's block. The warning names the fluid and its seam, if it has one. A fluid made only of the dimension fluid's block that has no seam exports unchanged |
| Rivers | `RIVER_POLICY` | [Hydrology policy](/iris/36b-river-policy) `rainfall` other than `1` and `streams: BLOCK` are not exported, so rivers form at the same density in every biome and region |
| Rivers | `RIVER_CLIMATE` | [Wet and dry zones](/iris/36-rivers#hydrologyclimate) are not exported, so rivers start in dry zones as they do in wet ones. Hydrology policy [`wetness`](/iris/36b-river-policy#wetness) bounds are not exported either; the warning names the biome, region or dimension that sets them |
| Rivers | `RIVER_SHORE_BIOME` | Hydrology policy [shore biomes](/iris/36b-river-policy#shore-biomes) are not exported. The ground along the water keeps its own biome |
| Rivers | `RIVER_DECORATOR` | Tier and hydrology policy `decorators` are not exported, so rivers grow no [water plants](/iris/36-rivers#water-plants) of their own |
| Water | `ELEVATED_WATER` | [Hydrology](/iris/36-rivers) ponds, lakes, and waterfalls are not exported, and river valleys above `fluidHeight` are dry. Hydrology bed, shore, and bank materials are not exported |
| Water | `SEA_INLET` | Hydrology [sea inlets](/iris/36-rivers#undergroundseainlets) are not exported, so coastal cliffs have no flooded passages |
| Water | `CAVE_POOL` | Hydrology [cave pools](/iris/36-rivers#undergroundcavepools) are not exported, so cave floors hold no standing water of their own |
| Water | | Water below `fluidHeight` is placed in cells of 16 × 12 × 16 blocks, so some low ground beside shores and cliffs stays dry. Caves within 8 blocks of the terrain surface in ground less than 8 blocks above `fluidHeight`, and caves near coasts, fill with the dimension fluid up to `fluidHeight` |
| Caves | `LAVA_HEIGHT` | Cave lava fills carved space up to the dimension's `caveLavaHeight` when that level is at or below world Y -10. A higher lava level exports without lava |
| Caves | `WALL_PALETTE` | Each cave wall palette keeps its 3 most common materials, and a dimension uses at most 8 wall palettes, or 7 when it has the deep caves described under `DEEP_CAVE_LAYERS`. A cave biome over that limit uses the kept palette that shares the most blocks with its own |
| Caves | `DEEP_CAVE_LAYERS` | Caves below Y -54, or at and below `fluidHeight` if that is lower, are open air. These deep caves keep their wall palettes but have no floor or ceiling surface layers. The pack's own deep lava band stays lava |
| Caves | `SUBTERRAIN_VARIANT` | [Authored subterrain features](/iris/15b-subterrain-features) export as underground structures. Each room exports as up to 3 fixed shapes, and every placement uses one of them with a random quarter turn instead of a new shape |
| Caves | `SUBTERRAIN_TERRAIN` | Subterrain rooms are placed after terrain and caves. A room's walls, floor, and ceiling are placed only where solid ground remains, so caves that cross them stay open. Rooms also generate below oceans, rivers, and cave pools, overlapping rooms ignore `priority`, and later decoration can overlap a room |
| Caves | `SUBTERRAIN_BIOME` | A room's `biome` is not exported. The room keeps the surrounding biome with its mob spawns, ambience, decorators, and objects. The room biome's floor, ceiling, and wall blocks are built into the room |
| Caves | | The export adds no Minecraft carvers or ore veins |
| Surface | `BLOCK_STATE` | A layer, palette, decorator, or deposit block that is not a Minecraft block is left out. A block whose properties the target version rejects exports in its default state |
| Surface | `LAYER_THICKNESS` | Layer thickness varies with Minecraft's surface noise, so stacked layers in one biome vary together. Locked layers use each layer's mean thickness |
| Surface | `SLOPE` | Slope-dependent layers, decorators, and object placements measure slope over 3 blocks in the four cardinal directions. Objects wider than 32 blocks ignore `slopeCondition` |
| Surface | `SEA_LAYER` | `seaLayers` are not exported |
| Surface | | Post-processing terrain smoothing, which removes one-block bumps and fills one-block pits, is not exported |
| Decoration | `DECORATOR_STYLE` | A decorator whose `style` is not `STATIC` covers the same share of columns as in the Iris world. Where the style forms patches, a Minecraft noise with the same patch size and coverage replaces it, so patches keep their size and spacing but not their exact shapes. Stacked decorators, decorators with a `forceBlock` or `topPalette`, underwater decorators, and cave ceiling decorators keep the coverage without the patches. A `variance` style that is not `STATIC` is not exported, so palette blocks are picked at random by weight |
| Decoration | | Two-block plants such as `tall_seagrass` place both halves, including on the sea floor, where Iris places only the palette half |
| Decoration | `CAVE_DECORATOR` | Cave ceiling decorators place at an estimated density instead of on every cave ceiling |
| Decoration | `SCALE_STACK` | Decorators with `scaleStack` use their fixed stack range instead of scaling to the space available |
| Decoration | `DEPOSIT_SCOPE` | Deposits with `placementScope: ABOVE_TERRAIN` also generate inside overhangs and floating terrain within their height band |
| Decoration | `DEPOSIT_SIZE` | Deposit clumps export at their average size. A clump holds at most 64 blocks, and a deposit places at most 256 clumps per chunk |
| Objects | `WIDE_OBJECT` | Objects up to 32 blocks wide export as features. Wider objects export as single-piece structures that generate at most once per chunk for each `objects[]` entry, on a chunk-aligned grid, without the `requireSurfaceSupport` check |
| Objects | `OBJECT_VARIANT` | Rotations other than multiples of 90 degrees, scale variations, and warps export as up to 32 pre-built variants |
| Objects | | [Procedural objects](/iris/17-procedural-objects) export as their pre-built `variants`. Procedural tree roots do not check for caves or Minecraft structures below them. Trees wider than 32 blocks keep their built roots |
| Objects | `OBJECT_VACUUM` | Vacuum terrain shaping is not exported. Objects in a vacuum mode place at their center height |
| Objects | | Surface objects place at the terrain height under their center. `MIN_HEIGHT`, `MAX_HEIGHT`, their `FAST_` forms, and the stilt modes built on them take the lowest or highest terrain across every rotation the placement allows, not only the rotation that is placed. The object moves at most 32 blocks from the terrain height under its center, and placements that need more are skipped. Objects wider than 32 blocks place at the terrain height under their center. `requireSurfaceSupport` checks the corners of the object's lowest row, widened by `surfaceSupportBuffer`, instead of every column under it. Each corner needs `surfaceSupportDepth` blocks of solid ground within 16 blocks below the object's anchor height, so objects are skipped where the ground falls more than 16 blocks across their footprint. Stilted placements skip this check and stilt down to the ground |
| Objects | | Leaves and other waterloggable object blocks fill with water where they replace water or touch it from the side or above, and the water spreads through connected leaves. Iris keeps them dry unless the placement sets `waterloggable` or `underwater` |
| Objects | | Sea pickles, coral plants, and coral fans with nothing under them in the object, and coral wall fans with nothing behind them, are left out |
| Objects | `STRUCTURE_AVOIDANCE` | Objects do not avoid Minecraft structures |
| Objects | `OBJECT_BOUNDS` | Subterrain room blocks more than 128 blocks from the room's center are left out |
| Objects | `CUSTOM_BLOCK` | Object blocks that are not Minecraft blocks, such as blocks from plugins or mods, are left out |
| Objects | `TILE_ENTITY` | Object tile data that has no Minecraft block entity form is dropped, and the block exports as a plain block |
| Objects | | Noise-styled object `edit` rules apply per placement, without continuity across the world |
| Entities | `CUSTOM_ENTITY` | Object markers and `entitySpawners` rules are not exported. Mob spawning comes from the exported biome spawn settings |
| Loot | `LOOT_RARITY` | Loot tables convert to Minecraft loot tables. Each entry's `rarity` becomes a proportional weight |
| Loot | `CUSTOM_ITEM` | Loot entries for items that are not Minecraft items are left out |
| Datapacks | | Datapacks in the dimension's `datapackImports` are bundled into the export, and their structures keep their own placements. With `datapackOverrides: false`, bundled files that replace `minecraft:` structures are left out |
| Datapacks | `DATAPACK_VERSION` | A bundled datapack whose supported pack formats exclude the target version, or that declares none, is bundled as is |
| Datapacks | `DATAPACK_COLLISION` | When two imports contain the same file, the later entry in `datapackImports` wins. A bundled file in the export namespace, or at a path the export writes, is left out. Tag files from all imports are merged |
| Datapacks | `DATAPACK_FILE` | A bundled file whose path is not a valid resource location, or a tag file that cannot be read, is left out |
| Structures | `STRUCTURE_PLACEMENT` | A structure placement exports with Minecraft's placement rules. A placement is left out when its region or biome scope has no exported biome, when its underground height band lies outside the dimension, or when its `RANDOM_SPREAD` values break `0 <= separation < spacing <= 4096`. A native entry with an invalid structure id is left out. A subterrain room is left out when no exported biome lies in its `allowedRegions`, when its `probability` is 0, or when it does not fit its `worldYRange` inside the dimension. Terrain modes other than `SOURCE` and `PRESERVE`, `stilt` foundations, the `minHeight` and `maxHeight` gate of surface placements, and jigsaw overrides or height bands on non-jigsaw structures are not exported. Cave `anchor` modes export as a height band between `minHeight` and `maxHeight`. Concentric ring values are clamped to Minecraft's range. A placement or subterrain room scoped to a region also generates in other regions that share its biomes |
| Structures | `STRUCTURE_ADJUSTMENT` | `importedStructures` adjustments export only where Minecraft has an equivalent: `yShift` on jigsaw structures and the `PRESERVE` terrain mode. `yBand`, `stilt`, other terrain modes, and `yShift` on other structures are not exported. A stronghold with a `yBand`, for example, generates at Minecraft's own height |
| Structures | `VANILLA_STRUCTURE_DATA` | Native structures that the bundled datapacks do not define, and `importedStructures` rules for vanilla structures, need the target version's vanilla structure data. Iris reads it from the running server, so it is available only when the server runs the target Minecraft version. Without it, those native entries are left out, and disabled structures and adjustments apply only to structures from bundled datapacks |
| Structures | `JIGSAW_STRUCTURE` | Iris jigsaw structures export as Minecraft jigsaw structures. A structure that Minecraft's jigsaw system cannot represent is left out, and the warning lists the reasons. Structure graph issues that do not block the export are reported as notes |
| Export | `TRIMMED_CONTENT` | Content that nothing in the exported world uses is left out, such as objects, structures, noises, and features that nothing places. Gameplay files from bundled datapacks, such as functions, advancements, and recipes, are kept. The note reports how many files and bytes were removed. A bundled file that cannot be read is kept, along with every resource it might name |
| Export | `GENERATION_COST` | Part of the exported world is expensive for Minecraft to compute, and the work that uses it slows down in proportion. The warning names the part. A climate value such as `noise_settings/<dimension>/temperature` slows biome lookups, which `/locate`, structure placement, and lookups outside generated chunks use. `noise_settings/<dimension>/final_density` slows chunk generation and terrain height lookups. `worldgen/density_function` means the density function files are large, so the world loads more slowly and uses more memory |

## Related

- [04 - Commands & Permissions](/iris/04-commands-permissions)
- [11 - Dimensions](/iris/11-dimensions)
- [15 - Caves & Carving](/iris/15-caves-carving)
- [16 - Surfaces, Decorators & Deposits](/iris/16-surfaces-decorators-deposits)
- [20 - Object Placement](/iris/20-object-placement)
- [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks)
- [25 - Pack Management](/iris/25-pack-management)
- [30 - Platform Differences](/iris/30-platform-differences)
- [36 - Hydrology](/iris/36-rivers)
- [37 - Image Maps](/iris/37-image-maps)
