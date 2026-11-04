---
title: "Hydrology"
description: "Rivers, streams, ponds, lakes, sea inlets, grottos and cave pools that follow the terrain: the dimension's hydrology settings, wet and dry climate zones, terrain shaping, bank styles and materials"
published: true
date: 2026-11-04T01:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-22T00:00:00.000Z
---
Iris hydrology places water where rain would collect. Every hollow in the terrain fills until it spills, every column drains downhill to the sea, and the flow gathers into streams, rivers and major rivers that step down through every elevation. Hollows become ponds and lakes at their own height, streams link ponds into chains, the ground is reshaped into beds, shores and banks that hold the water in, and below the surface the sea runs inland through cliff coasts as flooded inlets while carved caves collect pools on their floors. The dimension owns the settings under `hydrology`, described on this page; regions and biomes adjust them with [`hydrologyPolicy`](/iris/36b-river-policy), and [36c - Water Inspection](/iris/36c-river-inspection) covers `/iris find river`, the Studio water view and validation.

## Workflow

Turn the system on with `hydrology.enabled: true` in the dimension file. The defaults give a dimension streams, rivers and major rivers filled with water, natural and seeded ponds, lakes, banks reshaped around the water, sea inlets on its low coasts and pools in its caves. Then adjust:

1. **Make a pond-heavy biome.** Give the biome a `hydrologyPolicy` with `"pondDensity": 2.5` and `"rainfall": 1.6`. More cups are seeded in it, along its streams and elsewhere, and its ponds stay full. Natural hollows already keep their ponds at the default `ponds.natural.keep` of `1`; lower `keep`, or a `pondDensity` below `1`, thins them. Nothing in `hydrology` itself changes.
2. **Add a chained-pond valley.** Keep `ponds.seeded.alongChannels: true` and shorten `ponds.seeded.channelSpacing` to `[64, 128]`. Streams in that dimension then pass through a cup every 64 to 128 blocks, each one spilling into the next at a lower level. Give one region a higher `pondDensity` in its policy to concentrate the chains there; `ponds.seeded.density` adds free-standing cups, not chain cups.
3. **Gather water into wet zones.** Set `hydrology.climate.enabled: true`. A noise field splits the land into wet and dry zones: wet zones keep the configured streams and ponds, dry zones start none of their own, and rivers from the wet zones still run on through the dry land. Raise `climate.dryness` to dry out more of the land and `climate.style.zoom` for larger zones. Give a swamp biome a policy `"wetness": {"min": 0.7}` to keep it wet inside dry zones.
4. **Switch a biome to lava.** Add a fluid profile named `lava` to `hydrology.fluids`, then give the biome `"hydrologyPolicy": { "fluid": "lava" }`. Ponds and lakes whose floor lies in that biome fill with lava, and every stretch of stream or river that starts in the biome runs as lava all the way to the next confluence, pond or estuary, even where it leaves the biome; streams that start elsewhere keep their tier's fluid while they cross it. The rest of the dimension keeps water. A cave biome with the same policy gets lava cave pools. Give the `lava` profile a `seam` such as obsidian to line its edges where it meets water or the sea.
5. **Shape and plant the banks.** Set `bankBand` and `bankStyle` per tier, and `deformation.bankSlope` for the base slope. Paint the water's surroundings with `tiers[].materials` and `ponds.materials`, and grow seagrass, lily pads and reeds with `tiers[].decorators` and `ponds.decorators`.
6. **Tune the underground water.** Sea inlets and cave pools are on by default. `underground.seaInlets.spacing` and `maximumBankHeight` decide how many coasts get an inlet, `underground.cavePools.density` how many pool sites each chunk tries, and either `enabled: false` turns the feature off. `underground.cavePools.deepFluid` fills the deep pools with another fluid, such as lava, and `underground.caveSprings` adds seep points in cave walls that really flow.
7. Run `/iris pack validate`, open Studio and look at the **Rivers** view, then walk the water with `/iris find river` ([36c - Water Inspection](/iris/36c-river-inspection)).

A complete dimension block is at the [end of this page](#complete-example).

Set `hydrology.density` to control how many eligible water features are placed across the dimension. `0.5` keeps half the candidate sources, ponds, lakes, sea inlets and cave-pool sites after local placement probabilities; retained rivers continue downstream. This controls feature frequency, so the resulting water-covered area varies with terrain and connected waterways. The built-in Overworld and Underworld packs both use `0.5`, with their configured widths, depths, rainfall and fluids preserved.

## `hydrology`

| Field | Default | Purpose |
|-------|---------|---------|
| `enabled` | `false` | Turns rivers, streams, ponds, lakes and underground water on for this dimension |
| `density` | `1` | Fraction of eligible water-feature candidates retained after local placement probabilities, `0..1`; `0.5` halves candidate frequency and `0` places no hydrology features |
| `climate` | off, defaults below | Wet and dry zones across the dimension that decide where streams and ponds gather |
| `drainage` | defaults below | How water drains across the terrain before rivers and ponds are placed |
| `tiers` | stream, river, major (below) | Size classes of flowing water, from the smallest stream to the largest river; at least one |
| `ponds` | defaults below | Standing water at or above sea level: natural hollows, seeded cups, dams and inland hollows below sea level |
| `lakes` | defaults below | Large lakes that fill the biggest hollows in the terrain |
| `deformation` | defaults below | How the ground around water is reshaped |
| `underground` | defaults below | Sea inlets and grottos on the coast, and water below the surface: cave pools and cave springs |
| `fluids` | one profile, `water` | Named fluids that tiers, ponds, cave pools and hydrology policies fill their water with; at least one |
| `prefetchRings` | `1` | Rings of 512-block planning windows prepared ahead around each window that chunk generation asks for, `0..4`; during pregeneration, only windows the pregeneration area still needs are prepared ahead |
| `persist` | `true` | Saves finished water plans with the world, so they are not planned again after a restart |

### `hydrology.climate`

Climate zones lay a noise field over the dimension and split the land into wet and dry zones. The rainfall and pond density that each column takes from its [`hydrologyPolicy`](/iris/36b-river-policy) are multiplied by the wetness of its zone: `1` in a wet zone, `dryRainfall` in a dry zone, eased between the two across the `transition` band. At the default `dryRainfall` of `0`, dry zones start no streams and form no ponds of their own, while wet zones keep the configured density, so streams and ponds gather in clusters instead of reaching every hill. Water that drains in from a wet zone keeps its flow, so a river that rises in a wet zone runs on through dry land. Dry zones do not remove lakes. Inside the zones, the zone wetness at a pond or lake floor sets how far its surface drops below its freeboard, whatever the area's rainfall: `ponds.dryDrawdown` times one minus the wetness, rounded. A lake whose floor lies in a dry zone sits up to `dryDrawdown` blocks lower, and a pond in a wet zone stays full unless a policy `wetness` max holds the area lower. An area whose policy sets `"climateZones": false` keeps its full rainfall and pond density inside dry zones, and its ponds drop by its [`rainfall`](/iris/36b-river-policy#rainfall) as they do with the zones off. A policy [`wetness`](/iris/36b-river-policy#wetness) holds the zone wetness of an area between its `min` and `max`, so a swamp stays wet inside a dry zone and a desert stays mostly dry inside a wet one, and its ponds drop by the bounded wetness.

| Field | Default | Purpose |
|-------|---------|---------|
| `enabled` | `false` | Turns wet and dry zones on. When off, rainfall and pond density follow the hydrology policies alone |
| `style` | `SIMPLEX`, zoom `24` | Noise that lays out the zones. Land where its value is below `dryness` is dry; a larger `zoom` makes larger zones |
| `dryness` | `0.5` | Noise value below which land is dry, `0..1`; `0` keeps all land wet, and higher values dry out more of it |
| `transition` | `0.1` | Width of the noise band, centered on `dryness`, over which rainfall eases from dry to wet, `0..1`; `0` gives sharp zone edges |
| `dryRainfall` | `0` | Share of the area's rainfall and pond density kept in dry zones, `0..1`; `0` lets dry zones start no streams or ponds of their own |

```json
{
  "climate": {
    "enabled": true,
    "style": { "style": "SIMPLEX", "zoom": 24 },
    "dryness": 0.5,
    "transition": 0.15,
    "dryRainfall": 0
  }
}
```

A `dryRainfall` above `0`, such as `0.2`, lets dry zones keep a few small streams and ponds of their own.

### `hydrology.drainage`

| Field | Default | Purpose |
|-------|---------|---------|
| `fillEpsilon` | `0.001` | Height step in blocks added across filled flats, so water on level ground still has a downhill path, `0.00001..0.1` |
| `breachDepth` | `24` | Hollows deeper than this many blocks are drained by a cut through their lowest rim instead of filling with water, `0..256` |
| `wetnessThinning` | `true` | Removes some stream heads in dry areas, so dry biomes have fewer streams than wet ones |
| `minHeadKeep` | `0.25` | Smallest share of stream heads kept in the driest areas when wetness thinning is on, `0..1` |
| `headRelief` | `1` | A stream only starts where the ground falls by at least this many blocks within 64 blocks downhill, so level ground does not sprout streams; `0` lets streams start anywhere, `0..64` |
| `saturationCatchment` | `4194304` | Catchment in square blocks at which flow stops growing, which caps the width of rivers far downstream, `1024..1073741824` |

### `hydrology.tiers[]`

Each tier is one size class of flowing water. The tiers are ranked by `minCatchment`, and every tier needs its own `minCatchment`. A tier's `name` sets what `/iris find river`, the Studio map and history call its channels: `stream`, `river`, or `major` (also `major_river`) for a major river. A tier with any other name takes the type of its rank: the lowest tier is a stream, the highest a major river, and every tier between them a river.

| Field | Default | Purpose |
|-------|---------|---------|
| `name` | `"stream"` | Channel type of this tier for locate, maps and history: `stream`, `river` or `major` (also `major_river`); any other name takes the type of its rank by `minCatchment`. Configuration error messages also use the name |
| `minCatchment` | `1500` | Upstream catchment in square blocks a channel needs to belong to this tier, `0..1073741824` |
| `halfWidth` | `[0.5, 2]` | Smallest and largest half-width of the water surface in blocks, written as `[min, max]`; the smallest is above `0` and the largest is at most `64` |
| `widthFactor` | `1` | How fast the half-width grows from its smallest value, per unit of the square root of catchment divided by 2500, `0..16` |
| `depthRatio` | `0.4` | Water depth at the middle of the channel as a fraction of the half-width, `0.05..2`; every channel is at least one block deep |
| `inset` | `1` | Blocks the water surface sits below the ground it flows through, `0..16` |
| `cascades` | `true` | Groups the drops of a run into step-pools: the drops within 2.5 to 5 channel widths, from 6 to 32 blocks, join into one step. A step that starts with a cascade is at most `waterfallMinDrop` plus 2 blocks, and that limit ends the group early on steep ground. A step that starts with a waterfall is that waterfall plus the small drops it gathers below it. See [cascades and waterfalls](#what-appears-in-the-world). When false, drops are spread into a gentler slope where the terrain allows, including the step where a channel joins lower water; drops that cannot be spread, such as a junction right below a pond outlet, stay as small cascades below the waterfall minimum |
| `waterfallMinDrop` | `6` | Smallest drop in blocks that becomes a waterfall, `2..64` |
| `stepHeight` | `2` | Smallest step in blocks between this tier's water surfaces, `1..2`. `2` keeps channel surfaces on every second height above the sea. `1` is experimental: it lets a channel fall one block at a time, and works best with `cascades` false. **Warning:** on slanted steps, water at inner corners converts to source blocks, so terraces can rise a block and water can reach dry banks once the game updates those cells. Falls and plunge pools are unchanged. Ponds and lakes always use `2`. A tier cannot use a larger step than the next larger tier |
| `bankBand` | `0` | Width in blocks of the band beside the water where the ground is reshaped into banks, `0..64`; `0` leaves the ground beside the channel as it is |
| `bankStyle` | `SMOOTH` | Shape of the banks inside the bank band; see [bank styles](#bank-styles) |
| `estuary.length` | `48` | Most blocks upstream of the mouth that the channel runs as an estuary, `0..256`; the estuary stops where the lower bank rises more than `deformation.maxFill` blocks above sea level, and `0` ends the channel in a plain mouth. See [mouths and estuaries](#what-appears-in-the-world) |
| `estuary.flare` | `2.5` | Half-width at the mouth of a full-length estuary as a multiple of the channel's own half-width, `1..4`; `1` keeps the channel's width |
| `delta.channels` | `0` | Delta channels that branch from each estuary of this tier and fan out to the sea, `0` for no delta or `2..4`; each has the half-width of the channel where its estuary starts divided by the square root of this count. See [deltas](#what-appears-in-the-world) |
| `delta.spreadDegrees` | `35` | Largest angle in degrees between a delta channel and its estuary, `10..80` |
| `delta.length` | `64` | Most blocks a delta channel runs from its estuary to the sea, `8..384`; this length, plus the tier's `halfWidth` max, plus `bankBand`, plus `3` must not exceed `512` |
| `materials` | all unset | Blocks painted on the bed, shore and banks of this tier; see [materials](#materials) |
| `decorators` | empty | Plants for this tier's channels and their banks and shores; see [water plants](#water-plants) |
| `fluid` | `"water"` | Name of the fluid profile that fills this tier's channels; a stretch of channel whose upstream end lies in an area whose `hydrologyPolicy` sets a `fluid` takes that fluid for its whole length |

The default tiers:

| Tier | `minCatchment` | `halfWidth` | `depthRatio` | `inset` | `bankBand` |
|------|---------------:|-------------|-------------:|--------:|-----------:|
| `stream` | `1500` | `[0.5, 2]` | `0.4` | `1` | `0` |
| `river` | `20000` | `[2, 8]` | `0.45` | `2` | `32` |
| `major` | `320000` | `[8, 16]` | `0.5` | `3` | `48` |

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

Submerged hydrology soil uses dirt for grass blocks, mycelium, dirt paths and farmland, including layers below the bed palette. Crimson and warped nylium use netherrack. Dry banks and shores keep their authored soils.

Use a `SIMPLEX` palette style for material patches or `STATIC` for scattered blocks. Set the palette's `zoom` and its `style.zoom` to control patch size. These settings select materials without changing bed heights.

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
- Dam, mouth and sea inlet columns get no water plants; mouths keep the sea biome's decoration. The banks of a sea inlet take the plants of the second tier, and shallow cuts in them keep the biome's surface layer.
- Changing the plant lists does not rebuild the stored hydrology plans.

Set each decorator's `chance` to control its density. Use `stackMin` and `stackMax` for kelp height, with `kelp_plant` in `palette` and `kelp` in `topPalette`. Set the kelp top's `data.age` to `25` to stop further growth. Set `hydrologyPolicy.decorators` to `[]` on a biome, region or dimension to leave its water unplanted.

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

Connected ponds receive their upstream streams and spill into outlets at the same or a lower elevation. A pond that touches a lower channel settles to that channel's water level, including contact along the sides of a wide river. Its shoreline follows the surrounding terrain at the resulting level, and natural ponds retain only water enclosed by the terrain. Regional lakes retain their own water level.

| Field | Default | Purpose |
|-------|---------|---------|
| `natural` | defaults below | Ponds that fill hollows already present in the terrain |
| `seeded` | defaults below | Ponds cut into the terrain as bowls where the land has few hollows of its own |
| `dams` | defaults below | Raised rims that hold ponds above their natural spill height |
| `freeboard` | `[1, 3]` | Blocks the pond or lake surface sits below its spill point, written as `[min, max]`, not below `0`; each pond and lake picks a value in this range |
| `dryDrawdown` | `6` | Extra blocks a pond or lake surface drops in the driest areas, `0..32`, times the dryness at its floor: one minus the zone wetness inside [climate zones](#hydrologyclimate), and elsewhere one minus its rainfall, or `0` at rainfall `1` and above; ponds in wet areas stay full |
| `shore` | defaults below | Shape of pond shores and floors; lakes take only its `roundness` |
| `materials` | all unset | Blocks painted on pond and lake floors and shores; see [materials](#materials) |
| `decorators` | empty | Plants for ponds and lakes and their shores; see [water plants](#water-plants) |
| `fluid` | `"water"` | Name of the fluid profile that fills ponds and lakes; the `hydrologyPolicy.fluid` of the area that holds a pond or lake floor replaces it |

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
| `roundness` | `0.5` | Strength of the noise that rounds and roughens pond and lake outlines, `0..4`; `0` follows the terrain exactly |
| `shelf` | `6` | Width in blocks of the shallow shelf along the shore before the floor reaches full depth, `0..64` |
| `taper` | `14` | Width in blocks of the ground outside the shore that slopes down to the water, `0..64` |
| `maxDepth` | `8` | Deepest pond floor below the water surface, in blocks, `1..64` |

### `hydrology.lakes`

| Field | Default | Purpose |
|-------|---------|---------|
| `enabled` | `true` | Turns large hollows into lakes |
| `minArea` | `65536` | Smallest lake surface in square blocks, `1024..4194304` |
| `maxArea` | `4194304` | Largest lake surface in square blocks, `1024..4194304`, the area of 2048 by 2048 blocks; larger hollows are drained by a cut through their rim |

A hollow becomes a lake only when it is also at least `ponds.natural.minDepth` deep and no more than 2,048 blocks across. A wider hollow is drained, whatever its area, so a very high `minDepth` removes lakes as well as ponds. Lakes also take their `freeboard`, `dryDrawdown`, `shore.roundness`, `materials`, `decorators` and `fluid` from [`hydrology.ponds`](#hydrologyponds).

### `hydrology.deformation`

| Field | Default | Purpose |
|-------|---------|---------|
| `maxFill` | `6` | Most blocks the ground may be raised to hold water in, such as a berm beside a perched stream, `0..32`. Where a pond's outlet leaves at the pond's level over ground that falls away, the outlet's edge is raised to the water's surface, even past this limit |
| `bankSlope` | `0.2` | Base slope of banks, as rise over run, `0..4` |
| `bankSteepFactor` | `3.5` | How much steeper a bank stays where the natural ground between it and the water is steep, `0..16` |
| `bankNoise` | `0.2` | Strength of the smooth noise that roughens bank edges, `0..2` |
| `caveMask` | `true` | Keeps caves from opening under water, so rivers and ponds never drain into them |

### `hydrology.underground`

| Field | Default | Purpose |
|-------|---------|---------|
| `seaInlets` | defaults below | Tidal arms of the sea that wind inland from low coasts at sea level |
| `grottos` | defaults below | Sea caves: winding water passages at sea level that run from the sea into tall coastal rock |
| `cavePools` | defaults below | Standing water on the floors of carved caves |
| `caveSprings` | defaults below | Seep points in cave walls that the game's fluid physics spreads |

#### `underground.seaInlets`

A sea inlet is a winding arm of the sea open to the sky, flat at sea level, wide at the coast and narrowing inland between shaped banks. `length` max plus 12, plus the meander (`2.5 x (meanderWidth + 1)`, at most 16), plus `mouthHalfWidth` max (rounded up), plus `bankBand` must not exceed 512. The defaults reach 328.

| Field | Default | Purpose |
|-------|---------|---------|
| `enabled` | `true` | Cuts sea inlets into low coasts |
| `spacing` | `160` | Size in blocks of the square cells of the site grid, `32..4096`; each cell holds at most one inlet, and inlets in neighboring cells keep their banks apart |
| `length` | `[64, 256]` | Length of an inlet in blocks along its center line, written as `[min, max]`, above `0`; an arm that cannot reach the min is left out |
| `maximumBankHeight` | `44` | Highest ground in blocks above sea level an inlet may run beside, `2..128`, and also held to about 1.7 times `bankBand` so banks can grade back; ground up to half again as high is allowed at the outer edge of the band. An arm routes around or stops short of higher ground and of cliffs in the band, so lower values keep inlets out of hills |
| `mouthHalfWidth` | `[13, 15]` | Half-width of the water at the sea in blocks, written as `[min, max]`, each from `2` to `32`; the min must not be below `headHalfWidth` max |
| `headHalfWidth` | `[2.5, 3]` | Half-width of the water at the inland end in blocks, written as `[min, max]`, each from `1` to `8` |
| `taper` | `1.4` | How the width falls from mouth to head, `0.5..4`; `1` narrows evenly, above `1` stays narrow further from the head and widens late near the sea, below `1` widens early |
| `widthVariation` | `0.18` | Slow change in width along the arm as a fraction of the width at that point, `0..0.5` |
| `meanderWidth` | `4` | Half-width in blocks that sets the size of the bends, `1..16`; short arms use smaller bends so they still wind |
| `depth` | `[2, 5]` | Water depth at the middle of the arm in blocks, written as `[min, max]`, each from `2` to `16`; it runs from min at the head to max toward the sea and shoals to `1` at both ends |
| `bankBand` | `32` | Width in blocks of the band of ground beside the water that is shaped into banks, `4..64` |
| `bankStyle` | `SMOOTH` | Profile of the banks across `bankBand`; the styles are those of [bank styles](#bank-styles) |

#### `underground.grottos`

A grotto is a sea cave: a water passage at sea level that runs from the sea into coastal rock, winding like a river under an irregular natural roof and opening out into caverns. Grottos form where tall rock meets the coast, which are the coasts sea inlets leave alone, and need no pack settings beyond `enabled`.

| Field | Default | Purpose |
|-------|---------|---------|
| `enabled` | `true` | Cuts grottos into tall coasts |
| `spacing` | `176` | Size in blocks of the square cells of the site grid, at least `64`; each cell holds at most one grotto |
| `radius` | `[4, 7]` | Half-width of the passage in blocks, written as `[min, max]`, each from `2` to `16`. Caverns open wider, and the rock around a passage can pinch it narrower |
| `headroom` | `[5, 10]` | Height of the roof above the water in blocks, written as `[min, max]`, each from `3` to `32`. Caverns rise higher, and a roof stays under the ground above it |
| `mouthWidth` | `[7, 11]` | Half-width of the opening at the sea in blocks, written as `[min, max]`, each from `3` to `24` |
| `length` | `[64, 240]` | Length in blocks along the winding center line, written as `[min, max]`, with a max of at most `384`. A passage that cannot reach the min is left out |
| `roughness` | `0.6` | How irregular the walls, roof and floor are, `0..1`. `0` leaves smooth arched tubes; `1` gives deep overhangs, hanging rock and pockets |

#### `underground.cavePools`

| Field | Default | Purpose |
|-------|---------|---------|
| `enabled` | `true` | Fills dips in cave floors with standing water |
| `density` | `0.15` | Candidate pool sites per chunk, `0..8` |
| `minArea` | `6` | Smallest pool surface in square blocks, `1..961` |
| `maxArea` | `400` | Largest pool surface in square blocks, `1..961`, the area of the 31 by 31 block box of the widest `radius` |
| `maxDepth` | `4` | Deepest pool in blocks, `1..16` |
| `radius` | `15` | Half-size in blocks of the square box, centered on the site column, inside which a pool settles and spreads, `1..15`, so a pool stays within one chunk of the chunk that holds its site |
| `freeboard` | `[0, 1]` | Blocks the pool surface sits below the highest level the cave holds, written as `[min, max]`, not below `0`, with `max` below `maxDepth` |
| `fluid` | `"water"` | Name of the fluid profile that fills cave pools; the `hydrologyPolicy.fluid` of the cave biome at the pool, else of its region, else of the dimension, replaces it |
| `deepFluid` | unset | Name of the fluid profile that fills pools at or below `deepFluidMaxY`; unset keeps `fluid` at every depth, and a `hydrologyPolicy.fluid` still replaces it |
| `deepFluidMaxY` | `-128` | Highest world Y that `deepFluid` fills, `-2032..2031` and inside the world while `deepFluid` is set; no pool crosses this height |

#### `underground.caveSprings`

| Field | Default | Purpose |
|-------|---------|---------|
| `enabled` | `false` | Places springs in cave walls |
| `density` | `0.05` | Candidate spring sites per chunk, `0..2`; `hydrology.density` thins them as it does pool sites |
| `fluid` | `"lava"` | Name of the fluid profile a spring runs with; the `hydrologyPolicy.fluid` of the cave biome at the seep, else of its region, else of the dimension, replaces it |
| `minDepthBelowSurface` | `16` | Fewest blocks of ground between the surface and a spring, its opening and the cave it runs into, `0..256` |

### `hydrology.fluids[]`

Tiers, ponds, cave pools and hydrology policies pick a fluid by its name. Every name must be unique, every palette needs at least one block, and every `fluid` reference in the dimension must name a profile in this list.

| Field | Default | Purpose |
|-------|---------|---------|
| `name` | `"water"` | Name that tiers, ponds, cave pools and hydrology policies use to pick this fluid |
| `palette` | `minecraft:water` | Blocks that fill the water feature; only fluid blocks, except on a seam profile |
| `seam` | none | Name of another profile that lines this fluid's edge where it touches a different fluid or the sea |

World generation places fluids without block updates, so lava that meets water or the sea stays lava beside water. A `seam` replaces the edge of the fluid instead: every column of the fluid that touches a column of a different fluid, or a dry column whose ground lies below the dimension's `fluidHeight`, diagonals included, is filled with the seam profile from its bed to its surface, and so are about 60% of the columns next to those, which makes the seam a ragged band rather than a straight line. A profile named as a seam may hold solid blocks, such as obsidian, magma and basalt for a cooled crust, and is used only as a seam: it cannot be the `fluid` of a tier, of `ponds`, of `cavePools` or of a `hydrologyPolicy`, and it cannot name a seam of its own. Falling water keeps the fluid of the water above it, except that a fluid with a seam falls as its seam where it lands on a different fluid, such as lava stepping down into the sea water of its estuary or into a water river. `/iris pack validate` warns about a river fluid that can meet a different fluid without a seam ([36c - Water Inspection](/iris/36c-river-inspection#validation)). Cave pools of two fluids share only sealed rock, never a face of fluid, so a seam never applies to them. A cave spring is the one fluid that moves after generation, so where its flow reaches a different fluid the game's own rules decide, and lava that flows onto water turns to stone.

```json
{
  "fluids": [
    { "name": "water", "palette": { "palette": [{ "block": "minecraft:water" }] } },
    { "name": "lava", "palette": { "palette": [{ "block": "minecraft:lava" }] }, "seam": "crust" },
    { "name": "crust", "palette": { "palette": [{ "block": "minecraft:obsidian" }, { "block": "minecraft:magma_block" }] } }
  ]
}
```

## How water is placed

Hydrology works in 512-block planning windows on the natural terrain, before caves, objects and decoration; cave pools alone are placed after the caves are carved.

1. **Drainage.** Hollows fill until they spill (`drainage.fillEpsilon` keeps a downhill path across the filled flats). Hollows deeper than `drainage.breachDepth`, and hollows wider than `ponds.natural.maxArea` that no lake holds, are drained by a cut through their lowest rim instead of filling. A hollow on land that dips below the dimension's `fluidHeight` keeps its rim instead, and its ground below `fluidHeight` holds water at that level (step 3). A hollow whose ground below `fluidHeight` covers more than about 1,000,000 square blocks, or stretches so far that its bounding box widened by 512 blocks on every side passes 8,192 by 8,192 blocks in area, drains like any other hollow. Every column then drains downhill to the sea along the steepest drop to a neighbouring column, and where two drops are equal the seed and the column's position choose between them. The flow accumulates with the rainfall of the area it crosses, multiplied by the wetness of the climate zone when `climate` is on. The sea is ground below `fluidHeight` where the dimension places sea biomes. Low land beside the sea that lies below `fluidHeight` drains across to the sea, while an inland hollow below `fluidHeight`, ringed by higher land, is not the sea.
2. **Channels.** A stream starts where the accumulated catchment reaches the lowest tier's `minCatchment`, the ground falls by `drainage.headRelief` within 64 blocks downhill and the area's policy allows streams. `drainage.wetnessThinning` removes some heads in dry areas, and a dry climate zone at the default `dryRainfall` of `0` adds no flow of its own, so no stream starts there. Each channel takes the highest tier whose `minCatchment` it reaches, so a stream becomes a river and then a major river as tributaries join it. Catchment stops growing at `drainage.saturationCatchment`. Channels curve to a scale set by their half-width: bends swing to each side by up to 2.5 × (half-width + 1) blocks, kept between 2 and 16, and repeat about every 12 channel widths, kept between 24 and 192 blocks. On slopes of 1 block in 5 and steeper the swing drops to 40 percent, easing down over about 32 blocks on either side, so steep channels still bend and a cliff does not jerk the channel sideways. A channel holds its line beside a pond or lake, and it settles into the low ground of a valley floor.
3. **Ponds and lakes.** A hollow whose surface is within `ponds.natural.minArea` to `maxArea` and at least `minDepth` deep becomes a pond. A hollow within `lakes.minArea` to `maxArea`, at least `minDepth` deep and no more than 2,048 blocks across becomes a lake with one level across its whole surface; larger hollows are drained. Where the land has few hollows, `ponds.seeded` cuts bowls into the terrain, and `alongChannels` places chains of them down a stream. A pond's surface sits `ponds.freeboard` blocks below its spill point, lower still in dry areas (`dryDrawdown`), and never below `fluidHeight`. `ponds.dams` raises the downhill rim to hold more water. An inland hollow whose floor lies below `fluidHeight` and that is too deep or too wide to fill to its rim holds a pond at exactly `fluidHeight` over the ground below that level, whatever its size and depth, wherever the area's policy allows ponds; the pond has no outlet, so the water that reaches it stays there. Where the policy at the hollow's floor blocks ponds, streams end at the hollow's edge.
4. **Terrain shaping.** Channel beds and pond floors are cut, banks are sloped across the tier's `bankBand` in its `bankStyle`, low edges are raised by up to `deformation.maxFill` to hold the water (where a pond's outlet leaves at the pond's level over ground that falls away, the outlet's edge is raised to the water's surface), and `deformation.caveMask` keeps caves out from under the water.
5. **Sea inlets.** Each `spacing` cell of a low coast tries one inlet. The arm walks inland from the sea, away from the coast and along the lowest ground, around rivers, ponds and lakes, and stops at its length, at ground above `maximumBankHeight` or where the coast no longer falls behind it. The water stands at sea level the whole way.
6. **Grottos.** Each `spacing` cell with tall rock on its coast tries one grotto. The passage starts in the sea and walks into the rock, away from the coast and uphill, swinging from side to side, around rivers, ponds, lakes and sea inlets, and stops at its length or where the rock above it runs out.
7. **Cave pools.** After the caves are carved, each chunk tries `cavePools.density` sites. Inside a square box of `radius` blocks around the site column, the site settles downhill to the lowest floor that water poured on it would reach, and the pool rises from there, level by level up to `maxDepth`, as long as the surrounding rock holds it and it stays inside the box.
7. **Cave springs.** After the pools, each chunk tries `caveSprings.density` sites. A site picks one seep in a rock wall of its column, with rock above and below and an opening over a drop to the side. The block holds one fluid source and is marked for a block update. The game's fluid physics moves it once that update runs, when a player comes within one chunk of it.

## What appears in the world

**Channels.** The water surface of a channel sits approximately `inset` blocks below the ground it flows through. Its half-width grows with the square root of the catchment between the tier's `halfWidth` bounds, and `depthRatio` sets its maximum carved depth relative to the half-width, at least one block. Bed depth and cross-section vary gradually along the channel. Surface levels descend in steps of at least the tier's `stepHeight`, with water continuing through bends and outlets. Pond and lake surfaces, and channel surfaces at the default `stepHeight` of `2`, can sit one block below their planned elevation to align these steps with sea level; mouths meet the sea at its exact level. An outlet with a `stepHeight` of `1` starts at its pond's surface. Where channels join, the joining channel meets the receiving water at its surface from the junction up to where it first falls into it: inside the receiving channel, and just outside the receiving bank where it runs at most 5 blocks above that surface. The receiving channel's bed continues under the junction. The junction where the joining channel itself starts keeps its level when it stands more than one block above the receiving surface, so the channels that meet there are not lowered with it and the joining channel steps down from it as a cascade or waterfall; a junction at most one block above that surface is lowered to it. When the receiving channel is planned in the same planning window, the channels that meet at the lowered junction join the receiving water in turn; when it is planned in a neighbouring window, they keep their level, and a step that shows where they meet the lowered junction is a cascade. Below a junction, the channel's half-width changes evenly over its first 16 blocks, from the width of the widest joining channel to its own width, so water that enters a wider tier at a junction widens gradually. An outlet leaves its pond or lake at its own width, even where a channel joins at its exit.

**Cascades and waterfalls.** A drop of two or more blocks that is smaller than the tier's `waterfallMinDrop` is a cascade when `cascades` is true, and is spread into a gentler slope where the terrain allows when it is false. A drop of `waterfallMinDrop` or more is a waterfall. Where a cliff of `waterfallMinDrop` or more crosses the channel square-on, the water along the channel's sides keeps its upper level until within about 5 blocks of the cliff's edge, or about 6 on channels of half-width 12 or more, and does not run past that edge. Where the cliff is angled or the channel lies on a side slope, the fall can sit further back. A step of 4 blocks or more curves across the channel: it stays on the straight line across the channel at the sides and at the banks, and between them it bows downstream as a tongue or upstream as a horseshoe, chosen for each step from the seed and the step's position. The centre moves by 25 to 60 percent of the half-width less one block, at least 1 block and at most 11, and by less where another step, an estuary, a pond outlet's first stretch or the end of the channel lies closer. A tongue can carry the upper level past the cliff's edge in the middle of a wide channel, where its bed is raised to one block below the upper surface. Where that would lift the bed more than `deformation.maxFill` blocks above the natural ground, the step stays straight instead, so at the default limit a tongue passes a cliff's edge only on a low fall, and a tall fall at a cliff is straight or a horseshoe. A pond settles to the lower water of a horseshoe that touches it. A brink stays straight on a channel of half-width under 2, in the first stretch below a pond outlet, on every step from the pond's own level, on a joining channel's last step onto its final level and on any step it gains where it settles into a lower channel, and on a step in or into an estuary. When `cascades` is true, a run down a slope forms step-pools: starting at a drop, the drops within the next 2.5 to 5 channel widths, from 6 to 32 blocks and varying from step to step, join into one step with level water behind it. A step that starts with a cascade is at most `waterfallMinDrop` plus 2 blocks, and reaching that limit ends the group early, so on a slope of 1 at the default minimum a step comes about every 8 blocks whatever the channel's width. On gentle ground the water can stand level for longer, because the next drop is further away. Grouping only ever lowers the water, stops at backwater and lake levels, stays out of the first stretch below a pond outlet, and never lowers the water above an estuary to sea level. A waterfall gathers the small drops within three quarters of its height, from 6 to 16 blocks below it, so the water stays level for up to that length. It stops gathering before the gathered drops total `waterfallMinDrop`, so on a steep run-out the level stretch is shorter and the next drop stays its own step or fall. A waterfall of at least twice `waterfallMinDrop` rounds its brink: the last 4 to 12 blocks above it, 1.5 channel widths, sit up to 2 blocks lower. Around a step of less than 6 blocks, beds rise gradually toward shallow crests on both sides and return to their deeper profiles beyond the transition, with water at least one block deep over each crest. These shallow transitions also form where ponds meet lower channels, but where one channel steps down into another, the lower channel keeps its own bed below the step. Below a step of 6 blocks or more, only the brink keeps its crest: the bed at the foot sinks into a plunge pool up to half as deep as the drop, from 2 to 8 blocks, deepest under the falling water and rising back to the channel's own bed within three quarters of the drop, from 3 to 12 blocks away. Below a waterfall the channel also widens by half at the foot, up to the tier's largest `halfWidth`, and narrows back to its own width over three quarters of the drop, from 6 to 16 blocks, so the falling water lands with water on both sides. This does not happen in the first stretch below a pond outlet, at the last point of a channel or in an estuary, and it does not change the width of the channels downstream. Where the next step down comes sooner, the pool rises to that step's crest at its brink, so the water over the brink is one block deep. Plunge pools form only in channels: a step of 6 blocks or more into a pond, a lake or the sea leaves the bed below it unchanged. Falling water fills the face from the lower surface up to the upper one. A step where one channel's water stands above the edge of another channel's water is a cascade, or a waterfall when it is at least the higher channel's `waterfallMinDrop`, and every step that shows where an outlet leaves its pond is a cascade or waterfall. Where a joining channel arrives above the receiving water, a difference smaller than the tier's `waterfallMinDrop` is graded over its approach where the ground allows, so with a `waterfallMinDrop` above 6 the approach can lower the channel just outside the bank by up to one block less than that minimum. A larger step stays at the bank as a cascade or waterfall into the receiving channel and follows the same cascade, spread and waterfall rules as any other drop. Falling water is written through the mantle, so it needs `useMantle: true` and `RIVER_HYDROLOGY` absent from `disabledComponents`. Still surface water does not depend on the mantle.

**Mouths and estuaries.** A channel that reaches the sea ends in an estuary. A channel that crosses low land below `fluidHeight` on its way to the sea continues across it to the sea. A channel that runs into an inland hollow below `fluidHeight` ends in the hollow's pond, and one that crosses a narrow strip of sea keeps its course and level across it, so neither has an estuary. Up to `estuary.length` blocks upstream of the mouth, as far as the lower bank lies at most `deformation.maxFill` blocks above sea level, the water drops to sea level and the banks are cut down toward it. Above the estuary the surface comes down to it gradually: within about 128 blocks the channel lowers one step at a time, at a slope of at most one block in eight (gentler on wider channels, steeper only where rising ground leaves no room), and it arrives one step above the sea, so the last drop is `stepHeight` blocks. Feeders of a short mouth reach lower with it. Waterfalls farther than 64 blocks from the estuary keep their place and their top; a fall nearer the estuary is absorbed unless its top stands 16 blocks or more above the sea, in which case it stays and falls to the lowered water below it. A coast keeps its fall into the sea where the ground on both sides of the estuary's start rises 16 blocks or more above the sea within 16 blocks, and water beside a pond or lake keeps its level, as does a pond or lake outlet. Over the estuary the channel widens toward the sea, slowly at first and fastest near the mouth, to `estuary.flare` times its own half-width when the estuary runs its full length; an estuary cut short by higher banks widens less, and a half-width never passes `64`. Over the same stretch the channel's depth tapers to one block at the mouth, so its bed meets the natural sea floor there. An outlet leaves its pond or lake at the water's own level, so an estuary never reaches into a pond or lake. Estuary water is the dimension's sea fluid, whatever fluid the channel carries, and the sea's surface layers, such as the ice of a frozen sea, continue across it, except under a fall: where water drops into the estuary, the sea below it stays open. A lava river meets the sea where its estuary begins, and a `seam` on the lava profile lines the lava there, including any fall into the estuary. Estuary columns carry the `MOUTH` [water role](#engine-streams).

**Deltas.** A tier with `delta.channels` splits each of its estuaries that crosses low coastal ground into a delta. The delta channels branch from the estuary just below where it starts, far enough that their water stays clear of the channel above the estuary, and fan out to the sea on both sides of it: they share the angles up to `delta.spreadDegrees`, each turned a little at random for every mouth, and bend gently back toward the sea. Each delta channel has the half-width of the channel where the estuary starts divided by the square root of `delta.channels`. Like the estuary, it holds the sea's fluid at sea level, its depth tapers to one block where it reaches the sea, and its columns carry the `MOUTH` water role; it has the banks, materials and plants of its tier. A delta channel shares the estuary's water until it leaves the estuary's banks, so a delta shows as separate channels only with a wider `delta.spreadDegrees` or a smaller `estuary.flare`; at the default spread and flare, most of a wide river's delta lies inside its estuary. A delta channel is left out where it would cross ground more than `deformation.maxFill` blocks above sea level, a pond or lake, or another channel, or where it does not reach the sea within `delta.length` blocks, and sea inlets keep clear of delta channels.

**Ponds, chains and lakes.** Each pond has its own level. Chained cups along a stream sit at descending heights, each spilling into the next. Lakes fill the largest hollows at one level. A dammed pond has a raised rim on its downhill side.

**Biomes under the water.** A pond, lake, stream or river in a land area keeps the land biome of its area at any surface height, including water at `fluidHeight` whose bed is cut below it, such as a river crossing low land or a pond in an inland hollow. Mouths and sea inlets take the sea biome.

**Banks and shores.** The bank band is reshaped in the tier's `bankStyle` and roughened by `deformation.bankNoise`. A bank column keeps a steeper profile when the natural ground anywhere between it and the water is steep (`deformation.bankSteepFactor`), so a bank never dips below the ground nearer the water. Smooth, linear and concave banks vary gradually along the water; cliff and terraced styles retain their explicit benches and steps. Pond shores have a shallow shelf, a sloped taper outside the water and an uneven floor carved to at most `ponds.shore.maxDepth`. Shelf width, floor depth and the shore taper vary across each pond, while naturally deeper ground remains. Columns within two blocks of water are always solid, so `terrain3D` overhangs do not open into the water. Where a bank or shore is cut below the natural surface, the biome's deeper layers show on the cut. Banks never raise ground that lies below sea level: the sea floor beside a mouth, an estuary or a sea inlet keeps its natural height, and only the column at the very edge of water that stands above the sea is raised to hold that water in.

**Surface.** Banks reshaped around water keep the biome's layers from their new height, so a cut bank has its grass or other biome surface, then soil, then rock, the same as uncut ground.

**Materials.** `tiers[].materials` and `ponds.materials` paint the bed under the water, the shore strip along the water's edge and on dam rims (to `shoreDepth` layers) and the reshaped banks. A palette left unset keeps the biome's layers, with submerged living soils replaced as described under [Materials](#materials). With `allowGravityBlocks: false`, sand, gravel and other falling blocks in every bed, shore, bank and dam column are replaced by the column's rock.

**Sea inlets.** An inlet forms on a low coast and shapes the land like a river does: its center line winds on the river fit, the water narrows from `mouthHalfWidth` at the sea to `headHalfWidth` at its end, and `bankBand` blocks of ground beside it ease up to the natural surface in `bankStyle`. The water is the dimension's sea fluid at sea level everywhere, open to the sky, with the top sea layer of the biome over it and shoaling to one block at both ends. Each inlet keeps clear of rivers, ponds, lakes and other inlets, and is routed around or shortened where its banks would pass `maximumBankHeight`, meet a cliff or meet low ground. An arm that cannot stop short of such ground and still reach `length` min is left out, so tall coasts hold none. Where its band meets another water's bank, the arm's bank eases up to that bank halfway between them.

**Grottos.** A grotto is carved out of the rock after the terrain is built, so the land above it keeps its shape, and it runs on its own: no river or sea inlet moves for it. From the water a grotto is a natural opening in the shore. Where the ground at the coast is low, the water first runs in as an open channel, then goes under the rock. Inside, the width, roof and floor change along the passage and bulge out into one or more caverns, and the walls and roof are shaped in three dimensions, so they lean, overhang and hang down in places. The water is the dimension's sea fluid at sea level and is joined to the sea all the way. Most grottos end in a shelf of rock rising out of the water, and some have a small hole in the roof open to the sky. Solid rock two blocks thick is kept around the water, so caves cannot drain it, while caves above the water can open into the passage. A grotto never joins another grotto, and any part of one that would reach a river, pond, lake or sea inlet stays rock. Next to chunks that were generated before the grotto was planned, its edge stays sealed rock.

**Cave pools.** A pool settles into a low point of a carved cave and fills it up to the highest level the surrounding rock holds, at most `maxDepth` deep and inside a square box of `radius` blocks around its site column, with its surface `freeboard` blocks below that level. The pool stops rising one level below where it would open to the sky, drain into a lower cave, come within three blocks of the surface, leave the box or spread past `maxArea` columns, and a dip whose lowest level already does gets no pool. A pool needs at least `minArea` columns.

The fluid comes from the `hydrologyPolicy.fluid` of the cave biome at the site, then of its region, then of the dimension, and is `cavePools.fluid` when none of them sets one. A surface biome's policy never fills a cave pool: near the surface, above the cave biome's `caveMinDepthBelowSurface`, and in a region without cave biomes, caves use the surface biome, but their pools take the region's or the dimension's fluid, or `cavePools.fluid`. A pool never mixes fluids: it stops rising one level below where it would span two cave fluids or touch cave lava, an aquifer or a room's cells, and a dip whose lowest level already does gets no pool. Pools stay out of sea inlet space. Every solid block touching the pool at or below its level is sealed and shows the column's rock, and deposits, objects and later carving leave the pool and its walls alone.

With `deepFluid` set, a pool with no policy fluid takes `deepFluid` when its cells lie at or below world Y `deepFluidMaxY`. The height counts as a change of fluid, so a pool rising from below stops at `deepFluidMaxY`, and a pool with `cavePools.fluid` above it never reaches below the line.

**Cave springs.** A spring is a single source block in a rock wall, with `caveSprings.fluid` or the policy fluid of the cave biome at the seep. Generation places only the source, and it stays still until its block update runs: a player must be within one chunk of its chunk at any height, or the chunk must be force-loaded, with `world.postLoadBlockUpdates` on (the default) and no pregeneration running in that world. The stream down the wall and across the floor then appears as fluid ticks run, about 7 blocks per level for water and 3 for overworld lava. Water runs further, and both keep falling as long as the cave drops. A spring is left out when the air beside it has no rock above it up to the surface; when its flow, followed down and sideways for 15 blocks, meets ground closer than `minDepthBelowSurface` to the surface, cave lava, an aquifer, a room, sea inlet space or a chunk generated earlier; when a placement in the dimension, a region or a biome can start a structure within 8 chunks; when a piece of a structure added through `importedStructures` lies within 32 blocks to the side, anywhere from the bottom of the world to one block above the seep; or when its block is part of a pool wall. The 15-block check stops after 4,096 open blocks, so in a very large room it can end early. Flow past those 15 blocks is not checked, and flow past those 32 blocks can still reach an imported structure. Lava springs set fire to flammable blocks they reach.

**Decoration and objects.** Biome decorators skip channel, pond, cascade and waterfall columns; the plants in and beside the water come from the hydrology decorator lists ([water plants](#water-plants)), which run on every water column before the biome's own decorators. Mouth columns and the open mouths of sea inlets are decorated like the sea they join. Shore columns also run the biome's `SHORE_LINE` decorators ([16 - Surfaces](/iris/16-surfaces-decorators-deposits)). Automatically placed surface objects stay off water, shore, dam and inlet-mouth columns unless they set `underwater`, `onwater` or `forcePlace`; banks are open to them. An `underwater` object seats on the bed below the water and an `onwater` object on its surface, as in the sea, as long as its footprint stays on flat water clear of dams, cascades and waterfalls ([20 - Object Placement](/iris/20-object-placement#4-surface-support)). A `forcePlace` object places at any coordinate, even in the middle of a river, seats on the water surface and writes its blocks through the water, except in the cells of cave pools: a surface object has holes there and still counts as placed, and a cave object that touches one is rejected. Generated objects never fill that water: a solid block that would land above the floor of river, stream, pond, lake or sea inlet water is left out unless the object sets `underwater` or `onwater`, so the canopy of a tree on the bank stops at the water while the rest of the tree stands. This holds for objects scattered on the surface and in caves and for objects on floating islands. Open blocks such as plants, and the air of a bore, never replace the water or the bank below its surface unless the object sets `forcePlace`. Static objects at fixed positions (`staticObjects[]`) write every block whatever water is planned there, and explicit placements such as `/iris object paste` build in the water without these flags.

**Structures.** A surface structure placement, Iris or native, is skipped when more than 10% of the columns its assembled pieces cover are channel, pond, cascade, waterfall or sea inlet water. `BORE` and `FORCE_CARVE` cut neither a water column from two blocks below its floor upward nor the two blocks of bank beside it up to the water surface. `SOURCE` and `FLATTEN` lower a stream together with the ground cut beside it, or keep its banks where lowering cannot work; see [22 - Native Structures](/iris/22-native-structures-datapacks). An Iris structure within the limit always places, and leaves the water alone: its pieces and stilts keep their solid blocks out of the water and their air never replaces it. `allowWater: true` on the placement lifts the limit and lets Iris structure pieces fill the water. A force placed Iris structure, a single surface piece with a `placeMode` other than `STRUCTURE_PIECE` or `FLOATING`, ignores the limit and places at any coordinate, writing through river, pond and sea water except the cells of cave pools, where it has holes and still counts as placed. `BORE` and `FORCE_CARVE` still leave the water uncut around it. See [21b - Jigsaw Resources](/iris/21b-jigsaw-resources#natural-placement) and [22 - Native Structures](/iris/22-native-structures-datapacks#31-entry-fields).

**Caves.** Caves stay at least two solid blocks below river beds and pond floors, under sea inlets, and never open within two blocks of water sideways. Authored subterrain features keep the same distance. Cave decoration under the water continues as normal. See [15 - Caves & Carving](/iris/15-caves-carving#caves-under-water).

**Shore biomes.** A `hydrologyPolicy` can place biomes along the water's edge once it sets a `shoreBiomeWidth`; see [36b - Hydrology Policy](/iris/36b-river-policy#shore-biomes).

## Engine streams

Expressions can read the water through two engine streams ([14 - Generators & Noise](/iris/14-generators-noise#variable)):

| Stream | Value |
|--------|-------|
| `WATER_HEAD` | The height of the water surface: the river, stream, pond or sea inlet surface where water stands, otherwise the dimension fluid height |
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
| `7` | `MOUTH` | The estuary and delta channels where a channel meets the sea, with the sea's fluid at sea level |
| `8` | `CASCADE` | A stepped drop in a channel, including a step down onto another channel's water |
| `9` | `WATERFALL` | A drop of `waterfallMinDrop` or more |
| `10` | `INLET` | A sea inlet, with water at sea level |

Cave pools lie under the surface and have no column role. An engine stream name that Iris does not know fails the pack load, and the error lists the known names.

## Plans and existing worlds

Hydrology plans are stored per world under `<world>/iris/hydrology/<dimension>/`. They are keyed by the seed, the whole pack content, the world height, the generator version and the hydrology settings, and rebuilt when any of those changes, so editing any biome, generator or policy starts a fresh set of plans. The two most recent sets are kept. With `persist: false` the plans stay in memory and are planned again after a restart. Sea inlets are part of the plans; cave pools and cave springs are not planned ahead, because they follow the carved caves of each chunk.

Chunks generated earlier keep their water. Where a chunk generated later meets one generated earlier, water is held back by a one-block earth wall, and the ground blends into the older terrain as in any other pack update ([06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle)). Cave pools and cave springs read chunks generated earlier as off limits, so a pool never reaches into them and a spring within 15 blocks of one stays out. A sea inlet passage that runs into a chunk generated earlier ends two blocks short of it in a rock seal, so its water and air never touch the older chunk.

## Validation

Invalid hydrology settings are rejected by `/iris pack validate` and again when a world or Studio starts, where a failure makes the engine refuse to start with the same message.

`/iris pack validate` first checks the settings it can read without compiling them, and reports every failure of this kind at once:

- a range (`halfWidth`, `freeboard`, `radius`, `depth`, `channelSpacing`, `length`, `headroom`) that is not written as `[min, max]` of two finite numbers with `min` at or below `max`, that holds fractions where whole numbers are required, a `freeboard` or `headroom` below `0`, or another range that starts at `0` or below;
- a tier `halfWidth` above `64`;
- a `fluid` on a tier, on `ponds`, on `cavePools` or on the `hydrologyPolicy` of the dimension, a region or a reachable biome that `fluids` does not define, or a `cavePools.deepFluid` or the `caveSprings.fluid` of enabled springs that it does not define;
- a `hydrologyPolicy.fluid` that names a seam profile;
- a `hydrologyPolicy.rainfall` or `pondDensity` on the dimension, a region or a reachable biome outside `0..16`;
- a `hydrologyPolicy.wetness` on the dimension, a region or a reachable biome with a bound outside `0..1` or a `min` above its `max`.

When those pass, the validator compiles the settings exactly as a starting world does. The compile stops at its first problem and names the field, so one compile error is reported per dimension; fix it and run the validator again. The compile rejects:

- `hydrology` with no tier, or two tiers sharing a `minCatchment`;
- a `prefetchRings` outside `0..4`;
- a `climate.dryness`, `climate.transition` or `climate.dryRainfall` outside `0..1`;
- a `drainage.fillEpsilon` that is not above `0`;
- a `bankBand` outside `0..64`, a `widthFactor` or `depthRatio` below `0`, a `waterfallMinDrop` below `2`, or a `stepHeight` outside `1..2` or above that of a larger tier;
- an `estuary.length` outside `0..256` or an `estuary.flare` outside `1..4`;
- a `delta.channels` other than `0`, `2`, `3` or `4`, a `delta.spreadDegrees` outside `10..80`, a `delta.length` outside `8..384`, or a delta whose `length`, plus the tier's `halfWidth` max, plus `bankBand`, plus `3` exceeds `512`;
- a `minArea` above its `maxArea`, on `ponds.natural`, `lakes` or `cavePools`, or a `lakes.maxArea` above `4194304`;
- a `ponds.seeded.density` outside `0..64`, or a `deformation.maxFill` below `0`;
- a `materials` palette (`bed`, `shore` or `bank`, on a tier or on `ponds`) whose `palette` list is missing, misspelled or empty, or a `materials.shoreDepth` below `1`; a palette written as a single block, such as `{ "palette": [{ "block": "minecraft:stone" }] }`, loads;
- a fluid profile name that is duplicated, or a profile with an empty palette;
- a `seam` that names no profile, a seam profile that names a seam of its own, or a seam profile used as the `fluid` of a tier, of `ponds` or of `cavePools`, as `cavePools.deepFluid` or as the `fluid` of enabled springs;
- `seaInlets.spacing` below `1`, `mouthHalfWidth` outside `2..32` or below `headHalfWidth` max, `headHalfWidth` outside `1..8`, `depth` outside `2..16`, `maximumBankHeight` outside `2..128`, `taper` outside `0.5..4`, `widthVariation` outside `0..0.5`, `meanderWidth` outside `1..16`, `bankBand` outside `4..64`, an inlet floor below the world bottom, or an inlet reach above 512 blocks;
- `cavePools.radius` outside `1..15`, `maxDepth` below `1`, a `freeboard` max at or above `maxDepth`, a `maxArea` above `961`, or a set `deepFluid` with `deepFluidMaxY` outside the dimension's height, while cave pools are enabled, and `caveSprings.density` outside `0..2` or `minDepthBelowSurface` outside `0..256` while springs are enabled;
- a `decorators` entry, on a tier, on `ponds` or on a policy, with a `partOf` other than `SEA_FLOOR`, `SEA_SURFACE` or `SHORE_LINE`, a missing, misspelled or empty `palette`, an unknown block name, a `forceBlock`, a `chance` outside `0..1`, or `stackMin` and `stackMax` out of order.

A starting world runs the same compile, and also checks the `fluid` of every tier, of `ponds` and of `cavePools`. A fluid profile that holds a solid block stops the engine unless it is a seam profile. It also resolves every plant block in the tier, pond and policy decorator lists, so an unknown block, a fluid, a `SEA_FLOOR` block that cannot stand in water, or a `SEA_SURFACE` or `SHORE_LINE` block that holds water stops the engine; `/iris pack validate` resolves the same blocks. A `hydrologyPolicy.fluid` on the dimension, a region or any biome the dimension reaches that `fluids` does not define, or that names a seam profile, stops the engine at start. A known field with the wrong type fails the pack load even when `enabled` is `false`. See [36c - Water Inspection](/iris/36c-river-inspection#validation).

`/iris pack validate` also warns, without blocking the pack, about settings that load but are often unintended:

- a key the settings do not define, at any depth of `hydrology` or of a `hydrologyPolicy` on the dimension, a region or a reachable biome, including inside `tiers[]`, `fluids[]`, `decorators[]` and the `snippet/` files they reference, so its value is ignored and the setting keeps its default. The warning gives the full path of the key, such as `Dimension 'overworld'.hydrology.tiers[2].estuary.flair`, and lists the keys accepted there. Key names are case-sensitive. The `data` and `tileData` maps of a block accept any key. A disabled `hydrology` block gets the `hydrology` check; policies are checked only while it is enabled;
- a tier written in `tiers` that leaves out `halfWidth` or `bankBand`, so it takes the stream default `[0.5, 2]` or `0` whatever its size;
- `useMantle: false`, or `RIVER_HYDROLOGY` in `disabledComponents`, while hydrology is enabled, so the falling water at waterfalls and cascades, cave pools and cave springs are not generated;
- a `hydrologyPolicy.shoreBiomes` list that no `shoreBiomeWidth` above `0` applies to, so it places no shore biomes ([36b - Hydrology Policy](/iris/36b-river-policy#shore-biomes));
- a fluid profile that is not plain water and has no `seam`, when its rivers can meet the sea or another river fluid, so the two fluids lie side by side. A river takes a profile from the `fluid` of a tier, or from a `hydrologyPolicy.fluid` on the dimension, a region or a land or sea biome; cave pools and `ponds.fluid` do not count. The sea counts when `fluidHeight` lies above the bottom of the dimension and `fluidPalette` holds different blocks, and another river fluid counts when it holds different blocks and has no `seam` of its own. The check reads the settings alone, so it also warns about a river that the terrain keeps from the sea. The warning names the profile, what it can meet, and the tier or policy each river comes from.

## Managed packs

The Overworld and Underworld packs share one hydrology configuration. Underworld names a single `lava` profile and fills every tier, pond and cave pool with it; Overworld defines `water` and `lava` and fills the tiers, ponds and cave pools with water, with lava in the streams, rivers, ponds and lakes of the volcanic biomes through their policies. Sea inlets carry each dimension's sea fluid.

| Setting | Managed value |
|---|---|
| `climate` | enabled, `SIMPLEX` zones at zoom `24`, dryness `0.5`, transition `0.15`, dry rainfall `0` |
| `drainage.minHeadKeep` | `0.6` |
| `stream` tier | catchment `900`, half-width `[0.5, 2.5]`, width factor `1.2`, inset `1`, bank band `8` |
| `river` tier | catchment `5000`, half-width `[2.5, 9]`, width factor `1.2`, depth ratio `0.45`, inset `2`, bank band `32` |
| `major` tier | catchment `200000`, half-width `[9, 18]`, width factor `1.2`, depth ratio `0.5`, inset `3`, waterfall drop `8`, bank band `48` |
| `ponds.natural` | min area `128`, min depth `1.5` |
| `ponds.seeded` | density `10`, radius `[6, 22]`, max slope `0.7`, chain spacing `[80, 192]` |
| `ponds.freeboard` / `dryDrawdown` | `[1, 2]` / `3` |
| `underground.seaInlets` | every field at its default |
| `underground.cavePools` | density `0.3`, radius `15`, fluid `water` (Overworld) or `lava` (Underworld), every other field at its default |
| `lakes`, `deformation`, `prefetchRings`, `persist` | defaults |

The dimension policies set rainfall `1.2` and pond density `1.5`, and list the temperate beaches as shore biomes without a `shoreBiomeWidth`, so the shore biome band is off. The per-region and per-biome policies are listed on [36b - Hydrology Policy](/iris/36b-river-policy#managed-pack-policies).

Overworld beds use gravel, sand, clay and coarse dirt with weights `4`, `3`, `2` and `1`. Underworld beds use blackstone, basalt, netherrack and soul soil with the same weights. Both use `SIMPLEX` material patches with palette `zoom: 1` and `style.zoom: 0.125`. River and pond floors also have small-scale height variation within their depth limits.

Overworld water grows seagrass, tall seagrass and short kelp. These are configurable `SEA_FLOOR` decorators on each tier and on `ponds`. Plants need enough depth and water sources, so the chances below do not guarantee the same share of planted columns. Underworld has no aquatic decorators.

| Water feature | Seagrass chance | Tall seagrass chance | Kelp chance | Kelp stack range |
|---|---|---|---|---|
| Stream | `0.18` | `0.035` | `0.02` | `2..3` |
| River | `0.22` | `0.05` | `0.035` | `2..4` |
| Major river | `0.22` | `0.06` | `0.045` | `2..5` |
| Pond or lake | `0.25` | `0.07` | `0.04` | `2..5` |

## Complete example

The managed Overworld settings, written explicitly:

```json
{
  "hydrology": {
    "enabled": true,
    "density": 0.5,
    "climate": {
      "enabled": true,
      "style": { "style": "SIMPLEX", "zoom": 24 },
      "dryness": 0.5,
      "transition": 0.15,
      "dryRainfall": 0.0
    },
    "drainage": {
      "fillEpsilon": 0.001,
      "breachDepth": 24,
      "wetnessThinning": true,
      "minHeadKeep": 0.6,
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
        "waterfallMinDrop": 6,
        "bankBand": 8,
        "bankStyle": "SMOOTH",
        "estuary": { "length": 48, "flare": 2.5 },
        "delta": { "channels": 0, "spreadDegrees": 35, "length": 64 },
        "fluid": "water",
        "materials": {"bed": {"style": {"style": "SIMPLEX", "zoom": 0.125}, "zoom": 1, "palette": [{"block": "minecraft:gravel", "weight": 4}, {"block": "minecraft:sand", "weight": 3}, {"block": "minecraft:clay", "weight": 2}, {"block": "minecraft:coarse_dirt", "weight": 1}]}},
        "decorators": [
          {"partOf": "SEA_FLOOR", "chance": 0.18, "style": {"style": "STATIC"}, "palette": [{"block": "minecraft:seagrass"}]},
          {"partOf": "SEA_FLOOR", "chance": 0.035, "style": {"style": "STATIC"}, "palette": [{"block": "minecraft:tall_seagrass", "data": {"half": "lower"}}], "topPalette": [{"block": "minecraft:tall_seagrass", "data": {"half": "upper"}}]},
          {"partOf": "SEA_FLOOR", "chance": 0.02, "style": {"style": "STATIC"}, "stackMin": 2, "stackMax": 3, "heightVariance": {"style": "STATIC"}, "palette": [{"block": "minecraft:kelp_plant"}], "topPalette": [{"block": "minecraft:kelp", "data": {"age": "25"}}]}
        ]
      },
      {
        "name": "river",
        "minCatchment": 5000,
        "halfWidth": [2.5, 9],
        "widthFactor": 1.2,
        "depthRatio": 0.45,
        "inset": 2,
        "cascades": true,
        "waterfallMinDrop": 6,
        "bankBand": 32,
        "bankStyle": "SMOOTH",
        "estuary": { "length": 48, "flare": 2.5 },
        "delta": { "channels": 0, "spreadDegrees": 35, "length": 64 },
        "fluid": "water",
        "materials": {"bed": {"style": {"style": "SIMPLEX", "zoom": 0.125}, "zoom": 1, "palette": [{"block": "minecraft:gravel", "weight": 4}, {"block": "minecraft:sand", "weight": 3}, {"block": "minecraft:clay", "weight": 2}, {"block": "minecraft:coarse_dirt", "weight": 1}]}},
        "decorators": [
          {"partOf": "SEA_FLOOR", "chance": 0.22, "style": {"style": "STATIC"}, "palette": [{"block": "minecraft:seagrass"}]},
          {"partOf": "SEA_FLOOR", "chance": 0.05, "style": {"style": "STATIC"}, "palette": [{"block": "minecraft:tall_seagrass", "data": {"half": "lower"}}], "topPalette": [{"block": "minecraft:tall_seagrass", "data": {"half": "upper"}}]},
          {"partOf": "SEA_FLOOR", "chance": 0.035, "style": {"style": "STATIC"}, "stackMin": 2, "stackMax": 4, "heightVariance": {"style": "STATIC"}, "palette": [{"block": "minecraft:kelp_plant"}], "topPalette": [{"block": "minecraft:kelp", "data": {"age": "25"}}]}
        ]
      },
      {
        "name": "major",
        "minCatchment": 200000,
        "halfWidth": [9, 18],
        "widthFactor": 1.2,
        "depthRatio": 0.5,
        "inset": 3,
        "cascades": true,
        "waterfallMinDrop": 8,
        "bankBand": 48,
        "bankStyle": "SMOOTH",
        "estuary": { "length": 48, "flare": 2.5 },
        "delta": { "channels": 0, "spreadDegrees": 35, "length": 64 },
        "fluid": "water",
        "materials": {"bed": {"style": {"style": "SIMPLEX", "zoom": 0.125}, "zoom": 1, "palette": [{"block": "minecraft:gravel", "weight": 4}, {"block": "minecraft:sand", "weight": 3}, {"block": "minecraft:clay", "weight": 2}, {"block": "minecraft:coarse_dirt", "weight": 1}]}},
        "decorators": [
          {"partOf": "SEA_FLOOR", "chance": 0.22, "style": {"style": "STATIC"}, "palette": [{"block": "minecraft:seagrass"}]},
          {"partOf": "SEA_FLOOR", "chance": 0.06, "style": {"style": "STATIC"}, "palette": [{"block": "minecraft:tall_seagrass", "data": {"half": "lower"}}], "topPalette": [{"block": "minecraft:tall_seagrass", "data": {"half": "upper"}}]},
          {"partOf": "SEA_FLOOR", "chance": 0.045, "style": {"style": "STATIC"}, "stackMin": 2, "stackMax": 5, "heightVariance": {"style": "STATIC"}, "palette": [{"block": "minecraft:kelp_plant"}], "topPalette": [{"block": "minecraft:kelp", "data": {"age": "25"}}]}
        ]
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
      "dryDrawdown": 3,
      "shore": { "roundness": 0.5, "shelf": 6, "taper": 14, "maxDepth": 8 },
      "fluid": "water",
      "materials": {"bed": {"style": {"style": "SIMPLEX", "zoom": 0.125}, "zoom": 1, "palette": [{"block": "minecraft:gravel", "weight": 4}, {"block": "minecraft:sand", "weight": 3}, {"block": "minecraft:clay", "weight": 2}, {"block": "minecraft:coarse_dirt", "weight": 1}]}},
      "decorators": [
        {"partOf": "SEA_FLOOR", "chance": 0.25, "style": {"style": "STATIC"}, "palette": [{"block": "minecraft:seagrass"}]},
        {"partOf": "SEA_FLOOR", "chance": 0.07, "style": {"style": "STATIC"}, "palette": [{"block": "minecraft:tall_seagrass", "data": {"half": "lower"}}], "topPalette": [{"block": "minecraft:tall_seagrass", "data": {"half": "upper"}}]},
        {"partOf": "SEA_FLOOR", "chance": 0.04, "style": {"style": "STATIC"}, "stackMin": 2, "stackMax": 5, "heightVariance": {"style": "STATIC"}, "palette": [{"block": "minecraft:kelp_plant"}], "topPalette": [{"block": "minecraft:kelp", "data": {"age": "25"}}]}
      ]
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
        "enabled": true
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
