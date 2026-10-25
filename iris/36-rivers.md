---
title: "Hydrology"
description: "Rivers, streams, ponds, lakes, sea inlets and cave pools that follow the terrain: the dimension's hydrology settings, terrain shaping, bank styles and materials"
published: true
date: 2026-10-24T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-22T00:00:00.000Z
---
Iris hydrology places water where rain would collect. Every hollow in the terrain fills until it spills, every column drains downhill to the sea, and the flow gathers into streams, rivers and major rivers that step down through every elevation. Hollows become ponds and lakes at their own height, streams link ponds into chains, the ground is reshaped into beds, shores and banks that hold the water in, and below the surface the sea runs inland through cliff coasts as flooded inlets while carved caves collect pools on their floors. The dimension owns the settings under `hydrology`, described on this page; regions and biomes adjust them with [`hydrologyPolicy`](/iris/36b-river-policy), and [36c - Water Inspection](/iris/36c-river-inspection) covers `/iris find river`, the Studio water view and validation.

## Workflow

Turn the system on with `hydrology.enabled: true` in the dimension file. The defaults give a dimension streams, rivers and major rivers filled with water, natural and seeded ponds, lakes, banks reshaped around the water, sea inlets on its cliff coasts and pools in its caves. Then adjust:

1. **Make a pond-heavy biome.** Give the biome a `hydrologyPolicy` with `"pondDensity": 2.5` and `"rainfall": 1.6`. More cups are seeded in it, along its streams and elsewhere, and its ponds stay full. Natural hollows already keep their ponds at the default `ponds.natural.keep` of `1`; lower `keep`, or a `pondDensity` below `1`, thins them. Nothing in `hydrology` itself changes.
2. **Add a chained-pond valley.** Keep `ponds.seeded.alongChannels: true` and shorten `ponds.seeded.channelSpacing` to `[64, 128]`. Streams in that dimension then pass through a cup every 64 to 128 blocks, each one spilling into the next at a lower level. Give one region a higher `pondDensity` in its policy to concentrate the chains there; `ponds.seeded.density` adds free-standing cups, not chain cups.
3. **Switch a biome to lava ponds.** Add a fluid profile named `lava` to `hydrology.fluids`, then give the biome `"hydrologyPolicy": { "fluid": "lava" }`. Ponds and lakes whose floor lies in that biome fill with lava while the rest of the dimension keeps water; channels keep their tier's fluid. A cave biome with the same policy gets lava cave pools.
4. **Shape and plant the banks.** Set `bankBand` and `bankStyle` per tier, and `deformation.bankSlope` for the base slope. Paint the water's surroundings with `tiers[].materials` and `ponds.materials`, and grow seagrass, lily pads and reeds with `tiers[].decorators` and `ponds.decorators`.
5. **Tune the underground water.** Sea inlets and cave pools are on by default. `underground.seaInlets.spacing` and `minimumCliffHeight` decide how many coasts get an inlet, `underground.cavePools.density` how many pool sites each chunk tries, and either `enabled: false` turns the feature off.
6. Run `/iris pack validate`, open Studio and look at the **River network** view, then walk the water with `/iris find river` ([36c - Water Inspection](/iris/36c-river-inspection)).

A complete dimension block is at the [end of this page](#complete-example).

## `hydrology`

| Field | Default | Purpose |
|-------|---------|---------|
| `enabled` | `false` | Turns rivers, streams, ponds, lakes and underground water on for this dimension |
| `drainage` | defaults below | How water drains across the terrain before rivers and ponds are placed |
| `tiers` | stream, river, major (below) | Size classes of flowing water, from the smallest stream to the largest river; at least one |
| `ponds` | defaults below | Standing water above sea level: natural hollows, seeded cups and dams |
| `lakes` | defaults below | Large lakes that fill the biggest hollows in the terrain |
| `deformation` | defaults below | How the ground around water is reshaped |
| `underground` | defaults below | Water below the surface: flooded sea inlets and cave pools |
| `fluids` | one profile, `water` | Named fluids that tiers, ponds, cave pools and hydrology policies fill their water with; at least one |
| `prefetchRings` | `1` | Rings of 512-block planning windows prepared ahead around each window that chunk generation asks for, `0..4` |
| `persist` | `true` | Saves finished water plans with the world, so they are not planned again after a restart |

### `hydrology.drainage`

| Field | Default | Purpose |
|-------|---------|---------|
| `fillEpsilon` | `0.001` | Height step in blocks added across filled flats, so water on level ground still has a downhill path, `0.00001..0.1` |
| `breachDepth` | `24` | Hollows deeper than this many blocks are drained by a cut through their lowest rim instead of filling with water, `0..256` |
| `wetnessThinning` | `true` | Removes some stream heads in dry areas, so dry biomes have fewer streams than wet ones |
| `minimumHeadKeep` | `0.25` | Smallest share of stream heads kept in the driest areas when wetness thinning is on, `0..1` |
| `headRelief` | `1` | A stream only starts where the ground falls by at least this many blocks within 64 blocks downhill, so level ground does not sprout streams; `0` lets streams start anywhere, `0..64` |
| `saturationCatchment` | `4194304` | Catchment in square blocks at which flow stops growing, which caps the width of rivers far downstream, `1024..1073741824` |

### `hydrology.tiers[]`

Each tier is one size class of flowing water. The tiers are ranked by `minCatchment`, and every tier needs its own `minCatchment`. The lowest tier is what `/iris find river stream`, the Studio map and history call a stream, the highest tier is the major river, and every tier between them is a river.

| Field | Default | Purpose |
|-------|---------|---------|
| `name` | `"stream"` | Label for this tier in configuration error messages; locate, maps and history rank tiers by `minCatchment` and do not use it |
| `minCatchment` | `1500` | Upstream catchment in square blocks a channel needs to belong to this tier, `0..1073741824` |
| `halfWidth` | `[0.5, 2]` | Smallest and largest half-width of the water surface in blocks, written as `[min, max]`; the smallest is above `0` and the largest is at most `64` |
| `widthFactor` | `1` | How fast the half-width grows from its smallest value, per unit of the square root of catchment divided by 2500, `0..16` |
| `depthRatio` | `0.4` | Water depth at the middle of the channel as a fraction of the half-width, `0.05..2`; every channel is at least one block deep |
| `inset` | `1` | Blocks the water surface sits below the ground it flows through, `0..16` |
| `cascades` | `true` | Keeps drops shorter than a waterfall as stepped cascades. When false, drops are spread into a gentler slope where the terrain allows; drops that cannot be spread stay as small cascades below the waterfall minimum |
| `waterfallMinimumDrop` | `6` | Smallest drop in blocks that becomes a waterfall, `2..64` |
| `bankBand` | `0` | Width in blocks of the band beside the water where the ground is reshaped into banks, `0..64`; `0` leaves the ground beside the channel as it is |
| `bankStyle` | `SMOOTH` | Shape of the banks inside the bank band; see [bank styles](#bank-styles) |
| `deltas` | `false` | Spreads the channel into a delta where it reaches the sea |
| `materials` | all unset | Blocks painted on the bed, shore and banks of this tier; see [materials](#materials) |
| `decorators` | empty | Plants for this tier's channels and their banks and shores; see [water plants](#water-plants) |
| `fluid` | `"water"` | Name of the fluid profile that fills this tier's channels |

The default tiers:

| Tier | `minCatchment` | `halfWidth` | `depthRatio` | `inset` | `bankBand` | `deltas` |
|------|---------------:|-------------|-------------:|--------:|-----------:|----------|
| `stream` | `1500` | `[0.5, 2]` | `0.4` | `1` | `0` | `false` |
| `river` | `20000` | `[2, 8]` | `0.45` | `2` | `32` | `false` |
| `major` | `320000` | `[8, 16]` | `0.5` | `3` | `48` | `true` |

Every other field of the default tiers keeps the value in the table above.

### Bank styles

`bankStyle` shapes the ground between the water's edge and the natural ground, across the tier's `bankBand`.

| Style | Shape |
|-------|-------|
| `SMOOTH` | An eased curve from the water's edge up to the natural ground, flat at both ends and steepest across the middle of the band |
| `LINEAR` | A straight slope from the water's edge to the natural ground, with a sharp shoulder at the shore and a sharp lip at the top |
| `CONCAVE` | A hollowed bank that climbs fast beside the water and flattens out toward the natural ground |
| `TERRACED` | The eased curve cut into level steps between the water's edge and the natural ground |
| `CLIFF` | A level bench beside the water, then a steep wall up to the natural ground |

### Materials

`tiers[].materials` and `ponds.materials` share one shape. A palette left unset keeps the biome's own layers. The bed and bank palettes paint one layer; the shore palette paints `shoreDepth` layers. A palette that is set must list at least one block, written as `{ "palette": [{ "block": "minecraft:sand" }] }`; a palette whose `palette` list is missing, misspelled or empty is rejected.

| Field | Default | Purpose |
|-------|---------|---------|
| `bed` | unset | Palette painted on the ground under the water |
| `shore` | unset | Palette painted on the strip of ground along the water's edge, and on the rim of a dammed pond |
| `shoreDepth` | `2` | Layers of the shore palette painted downward from the surface, in blocks, `1..8` |
| `bank` | unset | Palette painted on the reshaped banks beyond the shore |
| `allowGravityBlocks` | `true` | Allows sand, gravel and other falling blocks in the bed, shore and banks. When false, falling blocks in every column with a water role (bed, shore, bank and dam) are replaced by the column's rock, so nothing can collapse into the water |

```json
{
  "materials": {
    "bed": { "palette": [{ "block": "minecraft:gravel" }] },
    "shore": { "palette": [{ "block": "minecraft:sand" }] },
    "shoreDepth": 2,
    "allowGravityBlocks": false
  }
}
```

### Water plants

`tiers[].decorators` plants a tier's channels and their banks and shores; `ponds.decorators` plants ponds and lakes and their shores. Both lists are written exactly like biome decorators ([16 - Surfaces](/iris/16-surfaces-decorators-deposits#decorators)), snippet references included, and both are empty by default. A `hydrologyPolicy.decorators` list on a biome, region or dimension replaces both lists for every water column in that area ([36b - Hydrology Policy](/iris/36b-river-policy#decorators)). `partOf` chooses where a decorator grows:

| `partOf` | Where | Rules |
|----------|-------|-------|
| `SEA_FLOOR` | The bed under the water of channels, cascades, waterfalls, ponds and lakes | Only where the water is at least two blocks deep. The stack is clamped to the depth minus one, so the top water cell stays water. Every block must hold water (seagrass, kelp, coral, sea pickles, waterlogged blocks), and a two-block plant such as tall seagrass needs room for both halves |
| `SEA_SURFACE` | The air cell directly above still water on channel, pond and lake columns | Never on falls, cascades, waterfalls or flowing water: the top cell must be a still source with air above it and every neighboring water cell at the same height |
| `SHORE_LINE` | The dry bank, shore and pond shore columns beside the water | Into air on solid ground, never into a cell with water beside it. Sugar cane needs water beside its ground, across chunk edges too |

- No vegetation grows in lava: floor and surface plants need water sources.
- Surface and shore palettes, `topPalette` included, may not contain blocks that hold water (water, lava, waterlogged states, seagrass, kelp, sea pickles, coral); those parts grow in air.
- Every decorator needs a written `palette`. A missing or misspelled palette is rejected rather than growing the default `grass`; name grass as `minecraft:short_grass`.
- `forceBlock` is not allowed, `chance` stays within `0..1`, and `1 <= stackMin <= stackMax`.
- Dam, mouth and inlet-mouth columns get no water plants; mouths keep the sea biome's decoration.
- Changing the plant lists does not rebuild the stored hydrology plans.

```json
{
  "tiers": [
    {
      "name": "river",
      "minCatchment": 20000,
      "decorators": [
        { "partOf": "SEA_FLOOR", "chance": 0.25, "palette": [{ "block": "minecraft:seagrass" }] },
        { "partOf": "SEA_FLOOR", "chance": 0.08, "stackMin": 2, "stackMax": 8,
          "palette": [{ "block": "minecraft:kelp_plant" }], "topPalette": [{ "block": "minecraft:kelp" }] },
        { "partOf": "SEA_FLOOR", "chance": 0.05, "palette": [{ "block": "minecraft:tall_seagrass", "data": { "half": "lower" } }] },
        { "partOf": "SEA_SURFACE", "chance": 0.05, "palette": [{ "block": "minecraft:lily_pad" }] },
        { "partOf": "SHORE_LINE", "chance": 0.1, "stackMin": 1, "stackMax": 3, "palette": [{ "block": "minecraft:sugar_cane" }] },
        { "partOf": "SHORE_LINE", "chance": 0.15, "palette": [{ "block": "minecraft:fern" }, { "block": "minecraft:short_grass" }] }
      ]
    }
  ],
  "ponds": {
    "decorators": [
      { "partOf": "SEA_FLOOR", "chance": 0.3, "palette": [{ "block": "minecraft:seagrass" }] },
      { "partOf": "SEA_SURFACE", "chance": 0.15, "palette": [{ "block": "minecraft:lily_pad" }] },
      { "partOf": "SHORE_LINE", "chance": 0.2, "stackMin": 1, "stackMax": 3, "palette": [{ "block": "minecraft:sugar_cane" }] }
    ]
  }
}
```

### `hydrology.ponds`

| Field | Default | Purpose |
|-------|---------|---------|
| `natural` | defaults below | Ponds that fill hollows already present in the terrain |
| `seeded` | defaults below | Ponds cut into the terrain as bowls where the land has few hollows of its own |
| `dams` | defaults below | Raised rims that hold ponds above their natural spill height |
| `freeboard` | `[1, 3]` | Blocks the pond surface sits below its spill point, written as `[min, max]`, not below `0`; each pond picks a value in this range |
| `climateDrawdown` | `6` | Extra blocks a pond surface drops in the driest climate, `0..32`; ponds in wet areas stay full |
| `shore` | defaults below | Shape of pond shores and floors |
| `materials` | all unset | Blocks painted on pond floors and shores; see [materials](#materials) |
| `decorators` | empty | Plants for ponds and lakes and their shores; see [water plants](#water-plants) |
| `fluid` | `"water"` | Name of the fluid profile that fills ponds and lakes |

#### `ponds.natural`

| Field | Default | Purpose |
|-------|---------|---------|
| `enabled` | `true` | Fills natural hollows with water |
| `keep` | `1` | Share of qualifying hollows that become ponds, before the area's pond density multiplier, `0..1` |
| `minArea` | `256` | Smallest pond surface in square blocks, `16..16777216` |
| `maxArea` | `65536` | Largest pond surface in square blocks, `16..16777216`; larger hollows become lakes or are drained |
| `minDepth` | `2` | Smallest hollow depth in blocks that holds a pond, `0.5..64`; lakes use the same floor |

#### `ponds.seeded`

On a slope the bowl spills downhill, so the pond sits perched above the ground below it.

| Field | Default | Purpose |
|-------|---------|---------|
| `enabled` | `true` | Cuts seeded cups into the terrain |
| `density` | `4` | Expected free-standing cups per 512 by 512 block window, before the area's pond density multiplier, `0..64` |
| `radius` | `[6, 24]` | Cup radius in blocks, written as `[min, max]`, above `0` |
| `depth` | `[3, 8]` | Cup depth in blocks, written as `[min, max]`, above `0` |
| `maxSlope` | `0.6` | Steepest ground slope, as rise over run, that accepts a cup, `0..4` |
| `alongChannels` | `true` | Places chains of cups along streams, each one spilling into the next one downstream at a lower level |
| `channelSpacing` | `[96, 256]` | Distance in blocks between chained cups along a stream, written as `[min, max]`, above `0` |

#### `ponds.dams`

| Field | Default | Purpose |
|-------|---------|---------|
| `enabled` | `false` | Raises the downhill rim of ponds to hold more water |
| `maxRaise` | `4` | Most blocks a dam raises a pond rim, `1..16` |

#### `ponds.shore`

| Field | Default | Purpose |
|-------|---------|---------|
| `roundness` | `0.5` | Strength of the noise that rounds and roughens pond outlines, `0..4`; `0` follows the terrain exactly |
| `shelf` | `6` | Width in blocks of the shallow shelf along the shore before the floor reaches full depth, `0..64` |
| `taper` | `14` | Width in blocks of the ground outside the shore that slopes down to the water, `0..64` |
| `maxDepth` | `8` | Deepest pond floor below the water surface, in blocks, `1..64` |

### `hydrology.lakes`

| Field | Default | Purpose |
|-------|---------|---------|
| `enabled` | `true` | Turns large hollows into lakes |
| `minArea` | `65536` | Smallest lake surface in square blocks, `1024..134217728` |
| `maxArea` | `4194304` | Largest lake surface in square blocks, `1024..134217728`; larger hollows are drained by a cut through their rim |

A hollow becomes a lake only when it is also at least `ponds.natural.minDepth` deep and no more than 2,048 blocks across. A wider hollow is drained, whatever its area, so a very high `minDepth` removes lakes as well as ponds.

### `hydrology.deformation`

| Field | Default | Purpose |
|-------|---------|---------|
| `maxFill` | `6` | Most blocks the ground may be raised to hold water in, such as a berm beside a perched stream, `0..32` |
| `bankSlope` | `0.2` | Base slope of banks, as rise over run, `0..4` |
| `bankSteepFactor` | `3.5` | How much steeper banks become on steep terrain, `0..16` |
| `bankNoise` | `0.2` | Strength of the noise that roughens bank edges, `0..2` |
| `caveMask` | `true` | Keeps caves from opening under water, so rivers and ponds never drain into them |

### `hydrology.underground`

| Field | Default | Purpose |
|-------|---------|---------|
| `seaInlets` | defaults below | Flooded passages at sea level that run inland from coastal cliffs |
| `cavePools` | defaults below | Standing water on the floors of carved caves |

#### `underground.seaInlets`

An inlet, its chamber and its seal stay within 512 blocks of the coast: `length` max plus 12, plus the larger of `halfWidth` max (rounded up) and `chamberRadius` max, plus 3 must not exceed 512. The defaults reach 283.

| Field | Default | Purpose |
|-------|---------|---------|
| `enabled` | `true` | Cuts sea inlets into coastal cliffs |
| `spacing` | `192` | Size in blocks of the square cells of the site grid, `32..4096`; each cell holds at most one inlet, and inlets in neighboring cells can lie closer than this |
| `minimumCliffHeight` | `8` | Height in blocks the coastal land must rise above sea level to be a site, `1..128`; the passage also needs ground at least `headroom` min plus `roofClearance` plus 2 blocks above sea level within about 16 blocks of the coast, so gentle coasts hold no inlets |
| `length` | `[64, 256]` | Length of an inlet in blocks, written as `[min, max]`, above `0` |
| `halfWidth` | `[2, 5]` | Half-width of the passage in blocks, written as `[min, max]`, each from `1` to `16`; the passage narrows toward its inland end |
| `depth` | `[2, 5]` | Water depth below sea level in blocks, written as `[min, max]`, each from `1` to `16` |
| `headroom` | `[4, 10]` | Air space above the water in blocks, written as `[min, max]`, each from `0` to `32`; it varies smoothly along the passage and shrinks where the ground above is thin |
| `roofClearance` | `6` | Least solid ground in blocks kept between the passage roof and the surface, `1..64` |
| `chamberRadius` | `[6, 12]` | Radius in blocks of the pool chamber at the inland end, written as `[min, max]`, each from `1` to `32` |

#### `underground.cavePools`

| Field | Default | Purpose |
|-------|---------|---------|
| `enabled` | `true` | Fills dips in cave floors with standing water |
| `density` | `0.15` | Candidate pool sites per chunk, `0..8` |
| `minArea` | `6` | Smallest pool surface in square blocks, `1..4096` |
| `maxArea` | `400` | Largest pool surface in square blocks, `1..65536` |
| `maxDepth` | `4` | Deepest pool in blocks, `1..16` |
| `radius` | `15` | Half-size in blocks of the square box, centered on the site column, inside which a pool settles and spreads, `1..15`, so a pool stays within one chunk of the chunk that holds its site |
| `freeboard` | `[0, 1]` | Blocks the pool surface sits below the highest level the cave holds, written as `[min, max]`, not below `0` |
| `fluid` | `"water"` | Name of the fluid profile that fills cave pools; a cave biome's `hydrologyPolicy.fluid` replaces it |

### `hydrology.fluids[]`

Tiers, ponds, cave pools and hydrology policies pick a fluid by its name. Every name must be unique, every palette needs at least one block, and every `fluid` reference in the dimension must name a profile in this list.

| Field | Default | Purpose |
|-------|---------|---------|
| `name` | `"water"` | Name that tiers, ponds, cave pools and hydrology policies use to pick this fluid |
| `palette` | `minecraft:water` | Blocks that fill the water feature |

```json
{
  "fluids": [
    { "name": "water", "palette": { "palette": [{ "block": "minecraft:water" }] } },
    { "name": "lava", "palette": { "palette": [{ "block": "minecraft:lava" }] } }
  ]
}
```

## How water is placed

Hydrology works in 512-block planning windows on the natural terrain, before caves, objects and decoration; cave pools alone are placed after the caves are carved.

1. **Drainage.** Hollows fill until they spill (`drainage.fillEpsilon` keeps a downhill path across the filled flats). Hollows deeper than `drainage.breachDepth` are drained by a cut through their lowest rim instead of filling. Every column then drains downhill to the sea, and the flow accumulates with the rainfall of the area it crosses.
2. **Channels.** A stream starts where the accumulated catchment reaches the lowest tier's `minCatchment`, the ground falls by `drainage.headRelief` within 64 blocks downhill and the area's policy allows streams. `drainage.wetnessThinning` removes some heads in dry areas. Each channel takes the highest tier whose `minCatchment` it reaches, so a stream becomes a river and then a major river as tributaries join it. Catchment stops growing at `drainage.saturationCatchment`.
3. **Ponds and lakes.** A hollow whose surface is within `ponds.natural.minArea` to `maxArea` and at least `minDepth` deep becomes a pond. A hollow within `lakes.minArea` to `maxArea`, at least `minDepth` deep and no more than 2,048 blocks across becomes a lake with one level across its whole surface; larger hollows are drained. Where the land has few hollows, `ponds.seeded` cuts bowls into the terrain, and `alongChannels` places chains of them down a stream. A pond's surface sits `ponds.freeboard` blocks below its spill point, lower still in dry climates (`climateDrawdown`). `ponds.dams` raises the downhill rim to hold more water.
4. **Terrain shaping.** Channel beds and pond floors are cut, banks are sloped across the tier's `bankBand` in its `bankStyle`, low edges are raised by up to `deformation.maxFill` to hold the water, and `deformation.caveMask` keeps caves out from under the water.
5. **Sea inlets.** Each `spacing` cell of the coast with land at least `minimumCliffHeight` above the sea tries one inlet. The passage runs inland from the sea, up the valleys where the drainage allows and onward under higher ground, as long as enough rock stays above it, and ends in a chamber. Its water is held at sea level the whole way.
6. **Cave pools.** After the caves are carved, each chunk tries `cavePools.density` sites. Inside a square box of `radius` blocks around the site column, the site settles downhill to the lowest floor that water poured on it would reach, and the pool rises from there, level by level up to `maxDepth`, as long as the surrounding rock holds it and it stays inside the box.

## What appears in the world

**Channels.** The water surface of a channel sits `inset` blocks below the ground it flows through. Its half-width grows with the square root of the catchment between the tier's `halfWidth` bounds, and its depth is `depthRatio` times the half-width, at least one block. Channels descend in one-block steps. Where a step turns a corner, the corner column becomes a dry rim ledge instead of water, so the flow stays in its bed.

**Cascades and waterfalls.** A drop of two or more blocks that is smaller than the tier's `waterfallMinimumDrop` is a cascade of steps when `cascades` is true, and is spread into a gentler slope where the terrain allows when it is false. A drop of `waterfallMinimumDrop` or more is a waterfall. In both cases the upper water pours over a one-block lip: the column above the drop holds water only in its top block, and falling water fills the face from the lower surface up to the upper one. Falling water is written through the mantle, so it needs `useMantle: true` and `RIVER_HYDROLOGY` absent from `disabledComponents`. Still surface water does not depend on the mantle.

**Mouths and deltas.** A channel that reaches the sea ends in a mouth. A tier with `deltas: true` spreads its channel into a delta there.

**Ponds, chains and lakes.** Each pond has its own level. Chained cups along a stream sit at descending heights, each spilling into the next. Lakes fill the largest hollows at one level. A dammed pond has a raised rim on its downhill side.

**Banks and shores.** The bank band is reshaped in the tier's `bankStyle`, steeper on steep ground (`deformation.bankSteepFactor`) and roughened by `deformation.bankNoise`. Pond shores have a shallow shelf, a sloped taper outside the water and a floor no deeper than `ponds.shore.maxDepth`. Columns within two blocks of water are always solid, so `terrain3D` overhangs do not open into the water. Where a bank or shore is cut below the natural surface, the biome's deeper layers show on the cut.

**Materials.** `tiers[].materials` and `ponds.materials` paint the bed under the water, the shore strip along the water's edge and on dam rims (to `shoreDepth` layers) and the reshaped banks. A palette left unset keeps the biome's own layers. With `allowGravityBlocks: false`, sand, gravel and other falling blocks in every bed, shore, bank and dam column are replaced by the column's rock.

**Sea inlets.** An inlet forms only on a cliff coast. Its mouth is an open cove cut down to the sea through the cliff, about 16 to 24 blocks long. From there the passage runs covered, inland and under higher ground, narrowing toward a domed chamber at its end. The water is the dimension's sea fluid and stays at sea level the whole way, with `depth` blocks of water below it, `headroom` blocks of air above it and at least `roofClearance` blocks of rock to the surface.

A seal keeps the inlet watertight. Every block within two blocks of the passage below sea level, from two blocks under the bed, becomes rock where it was air, loose or not solid, so beds and walls hold. The sea floor in the open mouth keeps its sand, on two blocks of sealed rock.

Caves stay at least two blocks from the inlet water, though cave air may meet the air above it. Authored subterrain rooms never take an inlet cell, and room fluid within two blocks of the inlet air is sealed as rock. The open mouth is painted and decorated like the sea floor of its biome, and no surface object stands on it.

**Cave pools.** A pool settles into a low point of a carved cave and fills it up to the highest level the surrounding rock holds, at most `maxDepth` deep and inside a square box of `radius` blocks around its site column, with its surface `freeboard` blocks below that level. A dip that would open to the sky, drain into a lower cave, come within three blocks of the surface or spread past `maxArea` columns gets no pool, and a pool needs at least `minArea` columns.

The fluid is `cavePools.fluid`, or the `hydrologyPolicy.fluid` set on the cave biome at the site. A pool never mixes fluids: a dip that spans two cave fluids, or touches cave lava, an aquifer or a room's fluid, gets no pool. Pools stay out of sea inlet space. Every solid block touching the pool at or below its level is sealed and shows the column's rock, and deposits, objects and later carving leave the pool and its walls alone.

**Decoration and objects.** Biome decorators skip channel, pond, cascade and waterfall columns; the plants in and beside the water come from the hydrology decorator lists ([water plants](#water-plants)), which run on every water column before the biome's own decorators. Mouth columns and the open mouths of sea inlets are decorated like the sea they join. Shore columns also run the biome's `SHORE_LINE` decorators ([16 - Surfaces](/iris/16-surfaces-decorators-deposits)). Automatically placed surface objects never stand on water, shore, dam or inlet-mouth columns; banks are open to them. Use an explicit placement such as `/iris object paste` to build in the water.

**Caves.** Caves stay at least two solid blocks below river beds and pond floors, under the open mouths of sea inlets, and never open within two blocks of water sideways. Authored subterrain features keep the same distance. Cave decoration under the water continues as normal. See [15 - Caves & Carving](/iris/15-caves-carving#caves-under-water).

**Shore biomes.** A `hydrologyPolicy` can place biomes along the water's edge once it sets a `shoreBiomeWidth`; see [36b - Hydrology Policy](/iris/36b-river-policy#shore-biomes).

## Engine streams

Expressions can read the water through two engine streams ([14 - Generators & Noise](/iris/14-generators-noise#variable)):

| Stream | Value |
|--------|-------|
| `WATER_HEAD` | The height of the water surface: the river, stream, pond or inlet-mouth surface where water stands, otherwise the dimension fluid height |
| `WATER_ROLE` | What hydrology made of the column, as a number |

`WATER_ROLE` values are stable codes:

| Code | Role | Column |
|-----:|------|--------|
| `0` | `NONE` | Dry ground that hydrology left alone |
| `1` | `CHANNEL` | Flowing water of a stream or river |
| `2` | `BANK` | The reshaped bank band beside a channel, or the sloped ground that tapers down to a pond or lake |
| `3` | `SHORE` | The strip of ground along a channel's edge |
| `4` | `POND` | Standing water of a pond or lake |
| `5` | `POND_SHORE` | The strip of ground along a pond or lake |
| `6` | `DAM` | The raised rim of a dammed pond |
| `7` | `MOUTH` | Where a channel meets the sea |
| `8` | `CASCADE` | A stepped drop in a channel |
| `9` | `WATERFALL` | A drop of `waterfallMinimumDrop` or more |
| `10` | `INLET` | The open mouth of a sea inlet, with water at sea level |

The covered passage and chamber of a sea inlet, and cave pools, lie under the surface and have no column role. An engine stream name that Iris does not know fails the pack load, and the error lists the known names.

## Plans and existing worlds

Hydrology plans are stored per world under `<world>/iris/hydrology/<dimension>/`. They are keyed by the seed, the whole pack content, the world height, the generator version and the hydrology settings, and rebuilt when any of those changes, so editing any biome, generator or policy starts a fresh set of plans. The two most recent sets are kept. With `persist: false` the plans stay in memory and are planned again after a restart. Sea inlets are part of the plans; cave pools are not planned ahead, because they follow the carved caves of each chunk.

Chunks generated earlier keep their water. Where a chunk generated later meets one generated earlier, water is held back by a one-block earth wall, and the ground blends into the older terrain as in any other pack update ([06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle)). Cave pools read chunks generated earlier as off limits, so a pool never reaches into them.

## Validation

Invalid hydrology settings are rejected by `/iris pack validate` and again when a world or Studio starts, where a failure makes the engine refuse to start with the same message.

`/iris pack validate` first checks the settings it can read without compiling them, and reports every failure of this kind at once:

- a range (`halfWidth`, `freeboard`, `radius`, `depth`, `channelSpacing`, `length`, `headroom`, `chamberRadius`) that is not written as `[min, max]` of two finite numbers with `min` at or below `max`, that holds fractions where whole numbers are required, a `freeboard` or `headroom` below `0`, or another range that starts at `0` or below;
- a tier `halfWidth` above `64`;
- a `fluid` on a tier, on `ponds`, on `cavePools` or on the `hydrologyPolicy` of the dimension, a region or a reachable biome that `fluids` does not define.

When those pass, the validator compiles the settings exactly as a starting world does. The compile stops at its first problem and names the field, so one compile error is reported per dimension; fix it and run the validator again. The compile rejects:

- `hydrology` with no tier, or two tiers sharing a `minCatchment`;
- a `bankBand` outside `0..64`;
- a `minArea` above its `maxArea`, on `ponds.natural`, `lakes` or `cavePools`;
- a `materials` palette (`bed`, `shore` or `bank`, on a tier or on `ponds`) whose `palette` list is missing, misspelled or empty; a palette written as a single block, such as `{ "palette": [{ "block": "minecraft:stone" }] }`, loads;
- a fluid profile name that is duplicated, or a profile with an empty palette;
- `seaInlets.halfWidth` outside `1..16`, `depth` max above `16`, `headroom` max above `32`, `chamberRadius` max above `32`, an inlet floor and seal that would lie below the world bottom, or an inlet reach above 512 blocks;
- `cavePools.radius` outside `1..15` or `maxDepth` below `1` while cave pools are enabled;
- a `decorators` entry, on a tier, on `ponds` or on a policy, with a `partOf` other than `SEA_FLOOR`, `SEA_SURFACE` or `SHORE_LINE`, a missing, misspelled or empty `palette`, an unknown block name, a `forceBlock`, a `chance` outside `0..1`, or `stackMin` and `stackMax` out of order.

A starting world runs the same compile, and also checks the `fluid` of every tier, of `ponds` and of `cavePools`. It also resolves every plant block in the tier, pond and policy decorator lists, so an unknown block, a fluid, a `SEA_FLOOR` block that cannot stand in water, or a `SEA_SURFACE` or `SHORE_LINE` block that holds water stops the engine; `/iris pack validate` resolves the same blocks. A `hydrologyPolicy.fluid` that `fluids` does not define is caught at start for biomes while cave pools are enabled; set on the dimension or a region, or on a biome with cave pools off, it fails generation when the first chunk that resolves to it is made. A known field with the wrong type fails the pack load even when `enabled` is `false`. See [36c - Water Inspection](/iris/36c-river-inspection#validation).

## Managed packs

The Overworld and Underworld packs share one hydrology configuration. Underworld names a single `lava` profile and fills every tier, pond and cave pool with it; Overworld defines `water` and `lava` and fills the tiers, ponds and cave pools with water, with lava in the ponds and lakes of the volcanic biomes through their policies. Sea inlets carry each dimension's sea fluid.

| Setting | Managed value |
|---|---|
| `drainage.minimumHeadKeep` | `0.6` |
| `stream` tier | catchment `900`, half-width `[0.5, 2.5]`, width factor `1.2`, inset `1`, bank band `8` |
| `river` tier | catchment `5000`, half-width `[2.5, 9]`, width factor `1.2`, depth ratio `0.45`, inset `2`, bank band `32` |
| `major` tier | catchment `200000`, half-width `[9, 18]`, width factor `1.2`, depth ratio `0.5`, inset `3`, waterfall drop `8`, bank band `48`, deltas |
| `ponds.natural` | min area `128`, min depth `1.5` |
| `ponds.seeded` | density `10`, radius `[6, 22]`, max slope `0.7`, chain spacing `[80, 192]` |
| `ponds.freeboard` / `climateDrawdown` | `[1, 2]` / `3` |
| `underground.seaInlets` | spacing `160`, every other field at its default |
| `underground.cavePools` | density `0.3`, radius `15`, fluid `water` (Overworld) or `lava` (Underworld), every other field at its default |
| `lakes`, `deformation`, `prefetchRings`, `persist` | defaults |

The dimension policies set rainfall `1.2` and pond density `1.5`, and list the temperate beaches as shore biomes without a `shoreBiomeWidth`, so the shore biome band is off. The per-region and per-biome policies are listed on [36b - Hydrology Policy](/iris/36b-river-policy#managed-pack-policies).

## Complete example

The managed Overworld settings, written explicitly:

```json
{
  "hydrology": {
    "enabled": true,
    "drainage": {
      "fillEpsilon": 0.001,
      "breachDepth": 24,
      "wetnessThinning": true,
      "minimumHeadKeep": 0.6,
      "headRelief": 1,
      "saturationCatchment": 4194304
    },
    "tiers": [
      {
        "name": "stream",
        "minCatchment": 900,
        "halfWidth": [0.5, 2.5],
        "widthFactor": 1.2,
        "depthRatio": 0.4,
        "inset": 1,
        "cascades": true,
        "waterfallMinimumDrop": 6,
        "bankBand": 8,
        "bankStyle": "SMOOTH",
        "deltas": false,
        "fluid": "water"
      },
      {
        "name": "river",
        "minCatchment": 5000,
        "halfWidth": [2.5, 9],
        "widthFactor": 1.2,
        "depthRatio": 0.45,
        "inset": 2,
        "cascades": true,
        "waterfallMinimumDrop": 6,
        "bankBand": 32,
        "bankStyle": "SMOOTH",
        "deltas": false,
        "fluid": "water"
      },
      {
        "name": "major",
        "minCatchment": 200000,
        "halfWidth": [9, 18],
        "widthFactor": 1.2,
        "depthRatio": 0.5,
        "inset": 3,
        "cascades": true,
        "waterfallMinimumDrop": 8,
        "bankBand": 48,
        "bankStyle": "SMOOTH",
        "deltas": true,
        "fluid": "water"
      }
    ],
    "ponds": {
      "natural": { "enabled": true, "keep": 1.0, "minArea": 128, "maxArea": 65536, "minDepth": 1.5 },
      "seeded": {
        "enabled": true,
        "density": 10.0,
        "radius": [6, 22],
        "depth": [3, 8],
        "maxSlope": 0.7,
        "alongChannels": true,
        "channelSpacing": [80, 192]
      },
      "dams": { "enabled": false, "maxRaise": 4 },
      "freeboard": [1, 2],
      "climateDrawdown": 3,
      "shore": { "roundness": 0.5, "shelf": 6, "taper": 14, "maxDepth": 8 },
      "fluid": "water"
    },
    "lakes": { "enabled": true, "minArea": 65536, "maxArea": 4194304 },
    "deformation": {
      "maxFill": 6,
      "bankSlope": 0.2,
      "bankSteepFactor": 3.5,
      "bankNoise": 0.2,
      "caveMask": true
    },
    "underground": {
      "seaInlets": {
        "enabled": true,
        "spacing": 160,
        "minimumCliffHeight": 8,
        "length": [64, 256],
        "halfWidth": [2.0, 5.0],
        "depth": [2, 5],
        "headroom": [4, 10],
        "roofClearance": 6,
        "chamberRadius": [6, 12]
      },
      "cavePools": {
        "enabled": true,
        "density": 0.3,
        "minArea": 6,
        "maxArea": 400,
        "maxDepth": 4,
        "radius": 15,
        "freeboard": [0, 1],
        "fluid": "water"
      }
    },
    "fluids": [
      { "name": "water", "palette": { "palette": [{ "block": "minecraft:water" }] } },
      { "name": "lava", "palette": { "palette": [{ "block": "minecraft:lava" }] } }
    ],
    "prefetchRings": 1,
    "persist": true
  },
  "hydrologyPolicy": {
    "rainfall": 1.2,
    "pondDensity": 1.5,
    "shoreBiomes": ["temperate/shore/beach", "temperate/shore/oak-beach"]
  }
}
```

The policy lists shore biomes but sets no `shoreBiomeWidth`, so the band is off; add `"shoreBiomeWidth": 4` to place the beaches along the water.

Related:

- [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas)
- [11 - Dimensions](/iris/11-dimensions)
- [12 - Regions](/iris/12-regions)
- [13 - Biomes](/iris/13-biomes)
- [15 - Caves & Carving](/iris/15-caves-carving)
- [25 - Pack Management](/iris/25-pack-management)
- [36b - Hydrology Policy](/iris/36b-river-policy)
- [36c - Water Inspection](/iris/36c-river-inspection)
