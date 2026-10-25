---
title: "Water Inspection"
description: "Find rivers, ponds, lakes, sea inlets and cave pools with /iris find river, view them in the Studio map, and validate hydrology settings"
published: true
date: 2026-10-24T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-09-19T00:00:00.000Z
---
Use `/iris find river` to reach the water of an Iris world, the Studio map's **River network** view to see it from above, and `/iris pack validate` to check the settings before a world is created. The settings are on [36 - Hydrology](/iris/36-rivers) and the per-area policy on [36b - Hydrology Policy](/iris/36b-river-policy).

## Workflow

1. Edit `hydrology` or a `hydrologyPolicy`, then run `/iris pack validate`.
2. Open the pack in Studio and switch the map (`/iris studio map`) to **River network**. Zoom in to 16 blocks per pixel or closer to see the water.
3. Walk the water: `/iris find river pond`, `/iris find river waterfall`, `/iris find river sea_inlet`.

## Feature types

| Type | Meaning |
|------|---------|
| `stream` | A channel of the lowest tier |
| `river` | A channel of a middle tier |
| `major_river` | A channel of the highest tier |
| `cascade` | A stepped drop in a channel shorter than the tier's `waterfallMinimumDrop` |
| `waterfall` | A drop of `waterfallMinimumDrop` or more |
| `mouth` | Where a channel meets the sea |
| `pond` | A natural, seeded or chained pond |
| `lake` | A lake |
| `dam` | A pond held up by a raised rim |
| `sea_inlet` | A flooded passage running inland from a cliff coast at sea level, from its open mouth to its chamber |
| `cave_pool` | A pool on the floor of a carved cave |

A cascade, waterfall or mouth is also found by the type of the channel it belongs to, and a dammed pond is found as both `pond` and `dam`. The type is parsed without regard to case, and `-` or a space may stand in for `_`.

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

## Studio map

The Studio map (`/iris studio map`) has a **River network** render mode. Its legend lists what the map draws: waterfall, cascade, mouth, major river, river, stream, sea inlet, lake, pond, dam and cave pool, each in its own color. Where several surface features share a pixel, the strongest one is drawn, in that order; cave pools are drawn beneath them.

- At 2 blocks per pixel or closer, the map draws the planned water of each chunk, including the dam rings of dammed ponds and the open mouths of sea inlets.
- Between 2 and 16 blocks per pixel, the map draws the channel center lines, pond outlines, lake outlines and the passages and chambers of sea inlets from the plans that are already in memory. Dam rings are not drawn at these zooms.
- Beyond 16 blocks per pixel the map draws no water.
- Cave pools are drawn only where generated chunks recorded them, at every zoom that draws water.

A tile whose water plan is still being made shows dry and is drawn again when the plan is ready; wait a moment after panning. The **Biome** view shows the shore biomes a `hydrologyPolicy` places along the water.

## Validation

Run the pack validator after every hydrology or policy edit:

```none
# Bukkit
/iris pack validate pack=<pack-key>

# Fabric, Forge, NeoForge
/iris pack validate <pack-key>
```

For every dimension with `hydrology.enabled: true`, the validator works in two steps. A dimension with hydrology absent or disabled is skipped, and a `hydrology` value that is not an object is reported on its own.

First it checks the settings it can read without compiling them, and reports every failure of this kind at once as a blocking error:

- a range (`tiers[].halfWidth`, `ponds.freeboard`, `ponds.seeded.radius`, `ponds.seeded.depth`, `ponds.seeded.channelSpacing`, `underground.seaInlets.length`, `halfWidth`, `depth`, `headroom`, `chamberRadius`, `underground.cavePools.freeboard`) that is not `[min, max]` of two finite numbers with `min` at or below `max`, that holds fractions where whole numbers are required, or that goes below its floor (`freeboard` and `headroom` not below `0`, the others above `0`);
- a tier `halfWidth` above `64`;
- a `fluid` on a tier, on `ponds`, on `cavePools`, or on the `hydrologyPolicy` of the dimension, a region or a reachable biome that `hydrology.fluids` does not define.

When those pass, it compiles the settings exactly as a starting world does. The compile stops at its first problem, so one compile error is reported per dimension, naming the field; fix it and run the validator again. The compile rejects:

- no tier, or two tiers sharing a `minCatchment`;
- a `bankBand` outside `0..64`, or a `minArea` above its `maxArea`;
- a `materials` palette on a tier or on `ponds` whose `palette` list is missing, misspelled or empty;
- a duplicated fluid profile name, or a profile with an empty palette;
- sea inlet bounds (`halfWidth` outside `1..16`, `depth` max above `16`, `headroom` max above `32`, `chamberRadius` max above `32`, a floor and seal below the world bottom, a reach above 512 blocks) and cave pool bounds (`radius` outside `1..15`, `maxDepth` below `1`);
- a water `decorators` entry with a `partOf` other than `SEA_FLOOR`, `SEA_SURFACE` or `SHORE_LINE`, a missing, misspelled or empty `palette`, an unknown block, a `forceBlock`, a `chance` outside `0..1`, or `stackMin` and `stackMax` out of order; the validator also resolves every plant block and rejects fluids, floor plants that cannot stand in water, and surface or shore plants that hold water.

Settings that pass the validator also pass when the world starts. Settings that fail the compile, or name an undefined `fluid` on a tier, on `ponds` or on `cavePools`, make the engine refuse to start with the same message. An undefined `hydrologyPolicy.fluid` on a biome also stops the engine at start while cave pools are enabled; on the dimension or a region, or on a biome with cave pools off, it fails generation when the first chunk that resolves to it is made. **Fix validation errors before creating a world, opening Studio, or packaging the pack.**
