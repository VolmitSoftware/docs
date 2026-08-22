---
title: "Rivers"
description: "Connected river routing, terrain incision, terraced water, river biomes, and contained cave hydrology"
published: true
date: 2026-08-22T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-22T00:00:00.000Z
---
Iris rivers are deterministic connected routes laid over the dimension's natural terrain. They can incise wet or dry channels, choose separate channel, bank, mouth, and dry biomes, use sea-level or terraced water, and make bounded connections to caves without enabling a dimension-wide cave flood.

Rivers are disabled by default. Enabling them changes only newly generated chunks; enabling or reshaping a network in an existing world leaves seams where old and new chunks meet.

## Start with one river network

Add `rivers` to a dimension JSON. This example deliberately uses fairly frequent, visible channels before adding cave entries:

```json
{
  "rivers": {
    "enabled": true,
    "topology": {
      "cellSize": 768,
      "tileCells": 4,
      "siteJitter": 0.35,
      "maxRouteReaches": 4,
      "sinkSearchReaches": 4,
      "source": {
        "chance": 0.03,
        "style": {"style": "IRIS", "zoom": 4096},
        "influence": 0.02
      },
      "continuation": {
        "chance": 0.9,
        "style": {"style": "VASCULAR", "zoom": 2048},
        "influence": 0.2
      },
      "routingStyle": {"style": "IRIS", "zoom": 2048},
      "routingNoiseWeight": 24,
      "terrainHeightWeight": 0.7,
      "terrainSlopeWeight": 0.35,
      "oceanAttraction": 1,
      "requireOcean": true
    },
    "terrain": {
      "channelWidth": {
        "min": 8,
        "max": 20,
        "style": {"style": "IRIS", "zoom": 1024}
      },
      "bankWidth": {
        "min": 5,
        "max": 18,
        "style": {"style": "IRIS", "zoom": 1024}
      },
      "depth": {
        "min": 2,
        "max": 7,
        "style": {"style": "IRIS", "zoom": 768}
      },
      "incision": {
        "chance": 1,
        "style": {"style": "FLAT"},
        "influence": 0
      },
      "maxIncision": 48,
      "bankExponent": 2,
      "meanderStyle": {"style": "IRIS", "zoom": 512},
      "meanderStrength": 72,
      "meanderSubdivisions": 8,
      "bedRoughnessStyle": {"style": "IRIS", "zoom": 96},
      "bedRoughness": 0.75,
      "terminalMode": "DRY_CHANNEL",
      "terminalTaper": 64,
      "dryContinuationChance": 1
    },
    "water": {
      "mode": "SEA_LEVEL"
    },
    "biomes": {
      "selectionStyle": {"style": "CELLULAR_IRIS_DOUBLE", "zoom": 512},
      "channel": [],
      "bank": [],
      "mouth": [],
      "dry": [],
      "floodedCave": []
    },
    "caves": {
      "mode": "SEALED"
    }
  }
}
```

Create a dedicated authoring pack with `/iris studio create name=river-test`, or add the configuration to an existing pack dimension and open it with `/iris studio open <dimension-key> seed=1337`. Move far enough to generate untouched chunks. In Iris Vision, select **River network**: blue is a wet channel, cyan is a mouth, green is a bank, brown is a dry channel or bank, and dark gray has no river footprint.

The normal biome and height views show the final generated result. The river view shows the routing footprint directly, which is the better first check when a river is absent because of source chance, routing, maximum incision, or terminal policy.

## How the network stays connected

Iris creates one jittered graph node per routing cell, joins neighboring nodes with a stable planar graph, and directs each candidate reach strictly downhill by natural terrain rank. A source gate selects complete routes, not isolated pixels. A continuation failure ends or suppresses the route; it never removes a middle segment and leaves two disconnected wet pieces.

Each reach is bent into a deterministic meandering polyline without moving its graph endpoints. Route feasibility is checked at every block crossed by that final centerline. A reach is rejected or rerouted when its wet core would enter a `BLOCK` area, require more incision than the local limit permits, or contain a dry block after the exact bed roughness and block-height rounding are applied. Width, banks, meanders, and stream-order growth are included in the cache halo, so sampling the same coordinate from neighboring tiles returns the same reach.

`requireOcean: true` admits a wet route only when its own bounded trace reaches natural sea within `maxRouteReaches`. Converging traces still share the same deterministic downstream edges, but Iris does not assume that a route beyond the configured proof horizon reaches an outlet. A route that cannot prove an outlet follows `terminalMode`. With `requireOcean: false`, ordinary failed terminals remain wet unless a region or biome explicitly overrides terminal behavior.

Topology is dimension-owned. Region and biome overrides can permit, avoid, or block routing and can scale geometry, but they do not create a second graph with incompatible cell boundaries.

### Topology fields

| Field | Default | Meaning |
|---|---:|---|
| `cellSize` | `768` | Routing-cell width in blocks. Smaller cells create more turns and more network work |
| `tileCells` | `4` | Routing cells grouped into one immutable cache tile |
| `siteJitter` | `0.35` | Fractional displacement of a graph node from its cell center, `0`–`0.49` |
| `maxRouteReaches` | `4` | Maximum reaches followed while proving one source route |
| `sinkSearchReaches` | `4` | Alternate downstream candidates considered per routing step when the cheapest reach is invalid, from `0` to `7` |
| `source` | `0.03` chance | Noise-modulated probability that a graph node begins a route |
| `continuation` | `0.9` chance | Noise-modulated probability for each complete continuation reach |
| `routingStyle` | `IRIS`, zoom `2048` | Stable cost variation used to avoid ruler-straight routing choices |
| `routingNoiseWeight` | `24` | Maximum contribution of `routingStyle` to route cost |
| `terrainHeightWeight` | `0.7` | Preference for lower natural terrain |
| `terrainSlopeWeight` | `0.35` | Additional cost for steep natural terrain |
| `oceanAttraction` | `1` | Preference for a natural sea outlet |
| `requireOcean` | `true` | Require a proven sea outlet for ordinary wet routes |

`source`, `continuation`, `incision`, and cave `entry` use the same contract:

```json
{
  "chance": 0.4,
  "style": {"style": "VASCULAR", "zoom": 2048},
  "influence": 0.25
}
```

Iris samples the configured noise once at the stable graph-event anchor, maps it to `-influence..+influence`, adds it to `chance`, and clamps the result to `0..1`. The final yes/no roll is derived from the world seed and graph identity. Changing chunk order, generation thread count, or platform does not change it.

## Terrain incision and dry channels

River terrain is a second surface derived from the natural height. Iris never raises terrain for a river. It blends downward toward the river bed across the channel and bank footprint, clamps the cut to `maxIncision`, and leaves the natural height available to diagnostics and expressions as `NATURAL_HEIGHT`.

| Field | Default | Meaning |
|---|---:|---|
| `channelWidth` | `8..20` | Wet-channel width before stream-order scaling |
| `bankWidth` | `5..18` | Transition outside the channel |
| `depth` | `2..7` | Wet-bed depth below the solved water head, or dry-channel depth below natural terrain |
| `orderWidthFactor` | `0.35` | Width growth for merged upstream flow order |
| `orderDepthFactor` | `0.2` | Depth growth for merged upstream flow order |
| `incision` | chance `1` | Noise gate deciding whether a complete reach may cut terrain |
| `maxIncision` | `48` | Maximum cut below natural terrain, before local multipliers |
| `bankExponent` | `2` | Cross-section curve from channel to natural bank |
| `meanderStyle` | `IRIS`, zoom `512` | Signed perpendicular bend along each reach |
| `meanderStrength` | `72` | Maximum bend displacement in blocks, also limited by reach length |
| `meanderSubdivisions` | `8` | Segments used to flatten the bent reach |
| `bedRoughnessStyle` | `IRIS`, zoom `96` | Small-scale bed variation |
| `bedRoughness` | `0.75` | Maximum bed variation in blocks |
| `terminalMode` | `DRY_CHANNEL` | `SUPPRESS`, `DRY_CHANNEL`, or `SINKHOLE_GROTTO` |
| `terminalTaper` | `64` | Actual along-reach distance used to return a non-sinkhole terminal channel to natural terrain |
| `dryContinuationChance` | `1` | Probability that a failed route is retained as a dry channel |

`SUPPRESS` removes a route that cannot satisfy its outlet policy. `DRY_CHANNEL` keeps a waterless erosion channel and tapers it back to natural terrain. `SINKHOLE_GROTTO` keeps full channel incision through its guaranteed fluid-bearing cave anchor, bypassing terminal taper only for that reach. It remains wet only while the mantle cave-hydrology pass is active. If mantle, carving, `CARVED`, `RIVER_HYDROLOGY`, the cave mode, or the per-reach cap disables that pass, runtime suppresses the terminal instead of leaving a wet dead end.

Dry channels expose no surface fluid. They do not run shoreline or underwater decorators and do not make an object or native structure count as submerged.

## Water heads

`SEA_LEVEL` uses the dimension `fluidHeight` for every wet reach. `TERRACED` makes flat upstream pools separated by controlled drops:

```json
"water": {
  "mode": "TERRACED",
  "poolLength": 96,
  "maximumPoolRise": 8,
  "dropHeight": 1
}
```

| Field | Default | Meaning |
|---|---:|---|
| `mode` | `SEA_LEVEL` | `SEA_LEVEL` or `TERRACED` |
| `poolLength` | `96` | Target along-river length of a flat pool |
| `maximumPoolRise` | `4` | Greatest permitted upstream head above dimension sea level |
| `dropHeight` | `1` | Height of each controlled drop; cannot exceed `maximumPoolRise` in terraced mode |

The water head is per column. Terrain fill, underwater decorators, shore checks, object placement, native-structure placement, cave reservoir protection, Vision, and the Bukkit terrain API all read that same local value. A terraced head above sea level does not raise the dimension's global cave aquifer or seal unrelated cave columns.

The actual block comes from the dimension `fluidPalette`, normally water. Inside an accepted river-cave overlay, waterloggable blocks become waterlogged only when their final cell contains river water, while dry and seal-guard cells are cleared. Baseline caves outside that overlay retain their existing aquifer and waterlogging behavior, including when rivers are disabled or sealed.

## River biomes

The optional pools select visual and behavioral biomes after routing and terrain are solved:

| Pool | Applied to | Inferred role |
|---|---|---|
| `channel` | Wet channel | sea |
| `bank` | Wet bank transition | shore |
| `mouth` | Reach meeting natural sea | sea |
| `dry` | Dry channel and dry bank | land |
| `floodedCave` | Accepted river-fed cave cells | cave biome lookup |

`selectionStyle` chooses inside the active pool. Empty surface pools use the natural biome with the correct river role: a wet channel or mouth remains aquatic even above global sea level, a bank resolves against its local river head, and a dry channel remains land. River-only pools are not inserted into natural biome generation, so adding a river biome cannot make it appear away from the network.

Biome keys referenced by these pools must exist. Validation warns when the authored biome's ordinary role disagrees with the role Iris will infer for that pool.

## Region and biome overrides

Add `riverOverride` to a region or natural biome. Biome values win over region values, which win over the dimension network. `null` inherits; an explicitly empty biome list disables that pool at the selected scope.

```json
"riverOverride": {
  "allowSources": false,
  "routingPolicy": "AVOID",
  "routingCostMultiplier": 3,
  "widthMultiplier": 0.7,
  "bankWidthMultiplier": 0.8,
  "depthMultiplier": 0.6,
  "maxIncisionMultiplier": 0.5,
  "continuationChanceMultiplier": 0.8,
  "caveEntryMultiplier": 0,
  "terminalMode": "SUPPRESS",
  "channelBiomes": ["river/cold-channel"],
  "bankBiomes": ["river/cold-bank"],
  "mouthBiomes": null,
  "dryBiomes": [],
  "floodedCaveBiomes": ["cave/flooded-cold"]
}
```

| Field | Meaning |
|---|---|
| `allowSources` | Permit new sources in this area; an established trunk may still pass through |
| `routingPolicy` | `ALLOW`, costly `AVOID`, or `BLOCK` for the routing centerline |
| `routingCostMultiplier` | Scales local route cost |
| `widthMultiplier`, `bankWidthMultiplier`, `depthMultiplier` | Scale reach geometry |
| `maxIncisionMultiplier` | Scales the local cut limit |
| `continuationChanceMultiplier` | Scales continuation probability |
| `caveEntryMultiplier` | Scales cave-entry probability |
| `terminalMode` | Local failed-route behavior |
| `*Biomes` | Replaces the corresponding dimension pool |

Overrides cannot change `cellSize`, graph identity, water mode, or containment proof bounds. Those remain dimension-owned so adjacent regions cannot disagree about the location or safety envelope of the same reach.

## River-fed caves

River cave hydrology requires `useMantle: true`, `carvingEnabled: true`, enabled `CARVED` and `RIVER_HYDROLOGY` mantle flags, a `caves.mode` other than `SEALED`, and `maximumPerReach` above zero. An ordinary candidate begins at a stable anchor on a wet river bed, applies the configured entry chance and local multiplier, respects `minimumSpacing`, and searches downward no farther than `maxBoreDepth`. The earliest noise-eligible anchors up to `maximumPerReach` receive deterministic containment attempts; a failed proof does not promote a later anchor, so chunk order cannot change which candidates were tried.

Iris never turns ordinary cave aquifers on to make this connection. It plans a separate persistent overlay after baseline caves are carved and before cave objects and structures are placed. Baseline cave matter is not mutated. Accepted wet cells and their seal guards reject later object or structure stamps that could open the containment boundary.

```json
"caves": {
  "mode": "GROTTO_OR_CLOSED_COMPONENT",
  "entry": {
    "chance": 0.12,
    "style": {"style": "IRIS", "zoom": 1024},
    "influence": 0.4
  },
  "minimumSpacing": 128,
  "maximumPerReach": 1,
  "maxBoreDepth": 48,
  "throatRadius": 2,
  "waterLevelOffset": 0,
  "dryHeadroom": 4,
  "grottoHorizontalRadius": 12,
  "grottoVerticalRadius": 7,
  "grottoShapeStyle": {"style": "IRIS", "zoom": 24},
  "grottoWarpStyle": {"style": "IRIS", "zoom": 48},
  "grottoWarpStrength": 2,
  "maxFloodRadius": 48,
  "maxFloodDepth": 32,
  "maxFloodVolume": 8192,
  "fallback": "SEALED",
  "existingFluidPolicy": "REJECT"
}
```

### Modes

| Mode | Result |
|---|---|
| `SEALED` | Keep all surface river reservoirs isolated from caves |
| `FLOOD_CLOSED_COMPONENT` | Bore into and fill only a complete existing cave component that passes closure proof |
| `GENERATE_GROTTO` | Carve a bounded noisy chamber with a proven solid shell |
| `GROTTO_OR_CLOSED_COMPONENT` | Use a proven existing component when present; otherwise try a bounded generated grotto |
| `WATERFALL_POOL` | Keep a dry falling shaft above a contained pool and emit falling fluid down the controlled throat |

A `SINKHOLE_GROTTO` terminal is a forced generated-grotto connection, not an ordinary random entry. It uses that terminal reach exclusively, bypasses ordinary entry-noise, local multiplier, and spacing gates, and suppresses every ordinary anchor on the same reach even when `maximumPerReach` is greater than one. Pack validation therefore requires active mantle carving, a non-`SEALED` cave mode, `maximumPerReach` above zero, and a valid generated-grotto proof envelope even when the selected cave mode normally floods existing components and has `fallback: SEALED`. Region and biome sinkhole overrides are checked against every enabled river dimension that can reach that resource, including child-biome paths.

### Containment proof

For an existing cave, Iris performs a six-neighbor flood proof from the target. The entire fluid-reachable component must remain inside `maxFloodRadius`, `maxFloodDepth`, and `maxFloodVolume`. It is rejected if the proof touches the world boundary, an opening to the surface, lava, an incompatible existing fluid under the selected policy, or any unprovable cell.

For a generated grotto, `grottoShapeStyle` perturbs the chamber boundary and `grottoWarpStyle` displaces its coordinate field by at most `grottoWarpStrength`. The complete warped chamber, throat, and surrounding solid shell must still fit inside the proof limits. `dryHeadroom` retains air above `river head + waterLevelOffset`; `throatRadius` controls the inlet bore.

`existingFluidPolicy` has three distinct outcomes:

| Policy | Existing contained fluid |
|---|---|
| `REJECT` | Any existing fluid rejects the candidate |
| `ALLOW_SAME` | Only fluid compatible with the river's selected fluid is retained/accepted |
| `REPLACE` | Proven contained non-lava fluid may be replaced by the river fluid; lava still rejects |

If proof fails, `fallback: SEALED` writes nothing. `fallback: GENERATE_GROTTO` may attempt a fresh bounded grotto, but that fallback must independently pass the same world, hazard, volume, and shell checks. No rejected plan publishes a partial throat, pool, guard, or biome.

When multiple sources directly overlap, Iris chooses the stable local-priority minimum and accepts one complete plan for those cells. Immediately before publication it rechecks every baseline precondition. Each chunk publishes only its own overlay cells from the same deterministic plan, so generation order and parallel generation do not change the result.

## Expressions and diagnostics

Engine expressions expose:

| Stream | Value |
|---|---|
| `NATURAL_HEIGHT` | Terrain height before river incision |
| `HEIGHT` | Final terrain height after river incision |
| `RIVER_DISTANCE` | Distance to the active reach centerline inside the river footprint |
| `RIVER_FLOW` | Merged upstream flow count |
| `RIVER_CARVE_WEIGHT` | Normalized cross-section incision weight |
| `RIVER_WATER_SURFACE` | Local solved river/ocean head |

River configuration noise may use `NATURAL_HEIGHT`. Validation rejects recursive dependencies on final `HEIGHT`, `HEIGHT_OR_FLUID`, `SLOPE`, or river-derived streams from inside the river configuration itself.

The Bukkit terrain API adds `RIVER`, `RIVER_SHORE`, and `DRY_CHANNEL` surface kinds plus batch fields for natural height, river state, river distance, river flow, and river water-surface Y. See [91 - API - Terrain](/iris/91-api-terrain).

## Performance and determinism

River tiles are immutable and cached. A cold default-shape tile performs graph routing and reach indexing and can take seconds on first touch; warm column samples are direct spatial-index lookups, and one default tile covers 3,072 by 3,072 blocks. Wider channels, stronger meanders, smaller cells or tiles, more route reaches, and higher source chance increase cold-tile work or repeat it more often. Pack validation and runtime construction reject derived routing footprints outside the bounded work envelope even when every individual setting is within its numeric range. Pregeneration amortizes accepted work naturally because nearby chunks share tiles.

Do not use final river-derived engine streams inside river configuration noise. Besides being rejected by validation, that would make topology depend on the result it is currently building. Use natural height, ordinary generator styles, region/biome identity, and fixed authored multipliers instead.

River output is a pure function of pack bytes, world seed, and coordinates. Tile build order, chunk generation order, platform, and worker count do not change graph identity, source gates, route arbitration, cave source arbitration, or overlay publication.

## Validation and recovery

Run `/iris pack validate pack=<pack-key>` before opening a studio or production world. Validation checks numeric bounds, malformed styles, recursive stream dependencies, missing biome keys, impossible grotto proof envelopes, terraced drop consistency, and sinkhole terminals without active cave hydrology.

| Symptom | Check |
|---|---|
| No rivers in the normal biome view | Confirm `enabled: true`, then inspect the River network Vision mode before changing biome pools |
| Routes appear but no terrain cuts | Check `incision`, `maxIncision`, local `maxIncisionMultiplier`, and `BLOCK` overrides |
| Most sources disappear | `requireOcean` needs a provable outlet; raise `maxRouteReaches`, reduce blocking areas, or choose an explicit terminal policy |
| Dry channels contain water or run shoreline plants | Regenerate untouched chunks with the same build; dry channels have no surface-fluid head |
| Elevated river uses land content | Check the channel pool and inferred role; empty pools still force wet channel/mouth fallback to sea behavior |
| Cave entry never appears | Enable a non-`SEALED` cave mode, raise `entry.chance`, confirm `maximumPerReach > 0`, and check `caveEntryMultiplier` |
| Cave candidate remains sealed | The containment proof rejected it. Increase bounds only when the larger memory/work envelope is acceptable; never disable the surface/world/lava checks |
| Existing world has a hard seam | Restore the previous river config or regenerate the affected chunks/world from backup. River topology is not retrofitted into old chunks |
