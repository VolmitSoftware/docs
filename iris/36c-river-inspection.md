---
title: "Water Inspection"
description: "Find rivers, ponds, lakes, sea inlets, grottos and cave pools with /iris find river, view them in the Studio map, and validate hydrology settings"
published: true
date: 2026-11-04T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-09-19T00:00:00.000Z
---
Use `/iris find river` to reach the water of an Iris world, the Studio map's **Rivers** view to see it from above, and `/iris pack validate` to check the settings before a world is created. The settings are on [36 - Hydrology](/iris/36-rivers) and the per-area policy on [36b - Hydrology Policy](/iris/36b-river-policy).

## Workflow

1. Edit `hydrology` or a `hydrologyPolicy`, then run `/iris pack validate`.
2. Open the pack in Studio and switch the map (`/iris studio map`) to **Rivers**. Zoom in to 16 blocks per pixel or closer to see the water.
3. Walk the water: `/iris find river pond`, `/iris find river waterfall`, `/iris find river sea_inlet`.

## Feature types

| Type | Meaning |
|------|---------|
| `stream` | A channel of a stream tier |
| `river` | A channel of a river tier |
| `major_river` | A channel of a major river tier |
| `cascade` | A stepped drop in a channel, or a step down onto another channel's water, shorter than the higher channel's `waterfallMinDrop` |
| `waterfall` | A drop of `waterfallMinDrop` or more |
| `mouth` | Where a channel meets the sea, across its estuary and delta channels |
| `pond` | A natural, seeded or chained pond |
| `lake` | A lake |
| `dam` | A pond held up by a raised rim |
| `sea_inlet` | A tidal arm of the sea winding inland from a low coast at sea level; a search lands over its water in the half toward the sea |
| `grotto` | A sea cave running from the sea into coastal rock; a search lands at its mouth, at the edge of the water |
| `cave_pool` | A pool on the floor of a carved cave |

A tier's `name` sets the type of its channels: `stream`, `river`, or `major` (also `major_river`). A tier with any other name takes the type of its rank by `minCatchment`: the lowest tier is a stream, the highest a major river, and every tier between them a river. A one-tier dimension whose tier keeps the default name `stream` has streams only. Generated chunks keep the channel type they recorded when they generated: their water is found by that type even after the pack's tier names or tier count change, while chunks generated later record the type the current tiers give. A cascade, waterfall or mouth is also found by the type of the channel it belongs to, and a dammed pond is found as both `pond` and `dam`. The type is parsed without regard to case, and `-` or a space may stand in for `_`.

## `/iris find river`

The search covers 7,168 blocks around the player. For every type except `cave_pool` it combines the water recorded in generated chunks with the water planned for chunks that are not generated, so it can send a player to terrain that generates on arrival; a sea inlet is found at any point along its planned passage. In chunks that hold terrain from a different pack version or hydrology plan, only the water those chunks recorded when they generated is found.

`cave_pool` searches generated chunks only, because pools follow the carved caves of each chunk and are not planned ahead. When no pool is recorded within range, the command says so: "No cave pool found in generated chunks within 7168 blocks. Cave pools form in carved caves, so only chunks that have already generated can hold one."

| Platform | Command | Arguments |
|----------|---------|-----------|
| Bukkit (Paper, Spigot, Folia) | `/iris find river type=<type> [teleport=true]`, alias `/iris goto river` | `type` is one of the eleven types above, tab-completed. `teleport=false` prints the position instead of teleporting. Player only |
| Fabric, Forge, NeoForge | `/iris find river <type>` or `/iris goto river <type>` | Same types, suggested. Always teleports, landing two blocks above the water. Player only |

```none
# Bukkit
/iris find river type=pond teleport=false
/iris find river type=waterfall
/iris goto river type=sea_inlet
/iris find river type=cave_pool

# Fabric, Forge, NeoForge
/iris goto river pond
/iris goto river waterfall
/iris find river sea_inlet
/iris find river cave_pool
```

An unknown type is rejected before any search, with the list of accepted types. A search that finds nothing within range says so. A search that fails while planning reports the failure as an error; it is never reported as "not found". On Bukkit the teleport stays tied to the world the search started in, and changing worlds cancels it.

Each player has one search at a time. A new `/iris find river` or `/iris goto river` replaces the player's running search, which stops without a message. A search stops after 30 seconds. It then reports the nearest water it found by that point, recorded or planned, and does not teleport; because the search did not finish, nearer water may exist within range. The message gives the position, for example "Stopped searching for the nearest river after 30 seconds. The nearest river found so far is at 120, 63, -480; a nearer one may exist." When it found none, it says "Stopped searching for the nearest river after 30 seconds without finding one."

When the dimension cannot form the requested type, the command answers at once, without planning any water, and names the setting, for example "No dam forms in this dimension: hydrology.ponds.dams is disabled." Water of that type recorded in generated chunks within range is still found.

| Type | Cannot form when |
|------|------------------|
| Every type | `hydrology.enabled` is `false` or `hydrology.density` is `0` |
| `stream`, `river`, `major_river` | No tier has that type |
| `pond` | `hydrology.ponds.natural.enabled` and `hydrology.ponds.seeded.enabled` are both `false` |
| `dam` | As for `pond`, or `hydrology.ponds.dams.enabled` is `false` |
| `lake` | `hydrology.lakes.enabled` is `false` |
| `sea_inlet` | `hydrology.underground.seaInlets.enabled` is `false` |
| `grotto` | `hydrology.underground.grottos.enabled` is `false` |
| `cave_pool` | `hydrology.underground.cavePools.enabled` is `false` |

## Studio map

The Studio map (`/iris studio map`) has a **Rivers** view in the World group. Its legend lists what the map draws: waterfall, cascade, mouth, major river, river, stream, sea inlet, pond, lake, dam and cave pool, with the color used for each feature. Where several surface features share a pixel, the strongest one is drawn, in that order; cave pools are drawn beneath them.

- At 2 blocks per pixel or closer, the map draws the planned water of each chunk, including the dam rings of dammed ponds and sea inlets. While chunk detail is preparing, cached water plans remain visible.
- Between 2 and 16 blocks per pixel, the map draws the channel center lines, pond outlines, lake outlines and sea inlets from the plans that are already in memory. Dam rings are not drawn at these zooms.
- Beyond 16 blocks per pixel the map draws no water.
- Cave pools are drawn only where generated chunks recorded them, at every zoom that draws water. At 4 blocks per pixel or closer, pools that chunks record later are added to tiles already on screen. Beyond 4 blocks per pixel, they appear after **Refresh** (`R`) redraws the map.

Previews refresh as water plans become available. Resizing, panning, and zooming retain cached coverage while additional detail loads. Completed river coverage stays visible while a different zoom level prepares its water detail. The **3D world** terrain preview also refreshes as hydrology plans finish. Disabled hydrology leaves the water overlay empty.

The **Biomes** view shows base biome colors. Its **Water** toggle is enabled by default and overlays the same hydrology, including recorded cave pools; press `W` to switch it off or on. The inspector's **Noise** and **Both** displays keep their selection visualizations clear of the water overlay.

## Validation

Run the pack validator after every hydrology or policy edit:

```none
# Bukkit
/iris pack validate pack=<pack-key>

# Fabric, Forge, NeoForge
/iris pack validate <pack-key>
```

For every dimension with `hydrology.enabled: true`, the validator works in two steps. A dimension with hydrology absent is skipped, a disabled `hydrology` block gets only the unknown-key warning below, and a `hydrology` value that is not an object is reported on its own.

First it checks the settings it can read without compiling them, and reports every failure of this kind at once as a blocking error:

- a range (`tiers[].halfWidth`, `ponds.freeboard`, `ponds.seeded.radius`, `ponds.seeded.depth`, `ponds.seeded.channelSpacing`, `underground.seaInlets.length`, `mouthHalfWidth`, `headHalfWidth`, `depth`, `underground.cavePools.freeboard`) that is not `[min, max]` of two finite numbers with `min` at or below `max`, that holds fractions where whole numbers are required, or that goes below its floor (`freeboard` and `headroom` not below `0`, the others above `0`);
- a tier `halfWidth` above `64`;
- a `fluid` on a tier, on `ponds`, on `cavePools`, or on the `hydrologyPolicy` of the dimension, a region or a reachable biome that `hydrology.fluids` does not define;
- a `hydrologyPolicy.fluid` that names a seam profile;
- a `hydrologyPolicy.rainfall` or `pondDensity` on the dimension, a region or a reachable biome outside `0..16`;
- a `hydrologyPolicy.wetness` on the dimension, a region or a reachable biome with a bound outside `0..1` or a `min` above its `max`.

When those pass, it compiles the settings exactly as a starting world does. The compile stops at its first problem, so one compile error is reported per dimension, naming the field; fix it and run the validator again. The compile rejects:

- no tier, or two tiers sharing a `minCatchment`;
- a `prefetchRings` outside `0..4`;
- a `climate.dryness`, `climate.transition` or `climate.dryRainfall` outside `0..1`, or a `drainage.fillEpsilon` that is not above `0`;
- a `bankBand` outside `0..64`, a `widthFactor` or `depthRatio` below `0`, a `waterfallMinDrop` below `2`, or a `stepHeight` outside `1..2` or above that of a larger tier;
- an `estuary.length` outside `0..256`, an `estuary.flare` outside `1..4`, a `delta.channels` other than `0` or `2..4`, a `delta.spreadDegrees` outside `10..80`, or a `delta.length` outside `8..384` or reaching more than 512 blocks with the tier's widest half-width and bank band;
- a `minArea` above its `maxArea`, or a `lakes.maxArea` above `4194304`;
- a `ponds.seeded.density` outside `0..64`, or a `deformation.maxFill` below `0`;
- a `materials` palette on a tier or on `ponds` whose `palette` list is missing, misspelled or empty, or a `shoreDepth` below `1`;
- a duplicated fluid profile name, or a profile with an empty palette;
- a `seam` that names no profile, a seam profile that names a seam of its own, or a seam profile used as the `fluid` of a tier, of `ponds` or of `cavePools`;
- sea inlet bounds (`spacing` below `1`, `mouthHalfWidth` outside `2..32` or below `headHalfWidth` max, `headHalfWidth` outside `1..8`, `depth` outside `2..16`, `maximumBankHeight` outside `2..128`, `taper` outside `0.5..4`, `widthVariation` outside `0..0.5`, `meanderWidth` outside `1..16`, `bankBand` outside `4..64`, a floor below the world bottom, a reach above 512 blocks), grotto bounds (`spacing` below `64`, `radius` outside `2..16`, `headroom` outside `3..32`, `mouthWidth` outside `3..24`, `length` max above `384`, `roughness` outside `0..1`) and, while cave pools are enabled, cave pool bounds (`radius` outside `1..15`, `maxDepth` below `1`, a `freeboard` max at or above `maxDepth`, a `maxArea` above `961`);
- a water `decorators` entry with a `partOf` other than `SEA_FLOOR`, `SEA_SURFACE` or `SHORE_LINE`, a missing, misspelled or empty `palette`, an unknown block, a `forceBlock`, a `chance` outside `0..1`, or `stackMin` and `stackMax` out of order; the validator also resolves every plant block and rejects fluids, floor plants that cannot stand in water, and surface or shore plants that hold water.

Settings that pass the validator also pass when the world starts. Settings that fail the compile, or name an undefined `fluid` on a tier, on `ponds` or on `cavePools`, make the engine refuse to start with the same message. An undefined or seam-profile `hydrologyPolicy.fluid` on the dimension, a region or any biome the dimension reaches also stops the engine at start. **Fix validation errors before creating a world, opening Studio, or packaging the pack.**

The validator also reports warnings, which do not block the pack:

- a key the settings do not define, at any depth of `hydrology` or of a `hydrologyPolicy` on the dimension, a region or a reachable biome, including inside `tiers[]`, `fluids[]`, `decorators[]` and the `snippet/` files they reference, so its value is ignored and the setting keeps its default. The warning gives the full path of the key, such as `Dimension 'overworld'.hydrology.tiers[2].estuary.flair`, and lists the keys accepted there. Key names are case-sensitive. The `data` and `tileData` maps of a block accept any key. A disabled `hydrology` block gets the `hydrology` check; policies are checked only while it is enabled;
- a tier written in `tiers` that leaves out `halfWidth` or `bankBand`, so it takes the stream default `[0.5, 2]` or `0` whatever its size;
- `useMantle: false`, or `RIVER_HYDROLOGY` in `disabledComponents`, while hydrology is enabled, so the falling water at waterfalls and cascades and cave pools are not generated;
- a `hydrologyPolicy.shoreBiomes` list on the dimension, a region or a biome that no `shoreBiomeWidth` above `0` applies to, so none of its shore biomes are placed. The warning names the policy that lists them.
- a fluid profile that is not plain water and has no `seam`, when its rivers can meet the sea or another river fluid, so the two fluids lie side by side. A river takes a profile from the `fluid` of a tier, or from a `hydrologyPolicy.fluid` on the dimension, a region or a land or sea biome; cave pools and `ponds.fluid` do not count. The sea counts when `fluidHeight` lies above the bottom of the dimension and `fluidPalette` holds different blocks, and another river fluid counts when it holds different blocks and has no `seam` of its own. The check reads the settings alone, so it also warns about a river that the terrain keeps from the sea. The warning names the profile, what it can meet, and the tier or policy each river comes from.
