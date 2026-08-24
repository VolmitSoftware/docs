---
title: "Rivers"
description: "Connected river routing, terrain incision, terraced water, river biomes, and contained cave hydrology"
published: true
date: 2026-08-23T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-22T00:00:00.000Z
---
Iris rivers are deterministic branching routes laid over the dimension's natural terrain. Sparse sources grow into long, coherently turning trunks, converge into wider downstream reaches, and may stop at an authored dry channel or contained sinkhole instead of requiring every route to reach an ocean. They can incise wet or dry channels, pass through high terrain in sealed water-bearing bores, choose separate channel, bank, mouth, dry, and flooded-cave biomes, use sea-level or terraced water, and make bounded connections to caves without enabling a dimension-wide cave flood.

Rivers are disabled by default. Enabling them changes only newly generated chunks; enabling or reshaping a network in an existing world leaves seams where old and new chunks meet.

## Start with one river network

Add `rivers` to a dimension JSON. This example deliberately uses fairly frequent, visible channels before adding cave entries:

```json
{
  "rivers": {
    "enabled": true,
    "topology": {
      "cellSize": 1700,
      "tileCells": 3,
      "siteJitter": 0.48,
      "maxRouteReaches": 8,
      "minimumSourcesPerTile": 9,
      "sinkSearchReaches": 5,
      "routingBasinCells": 112,
      "routingDeviationScaleCells": 24,
      "routingDeviationStrengthCells": 8,
      "routingPlateauHeight": 1.5,
      "source": {
        "chance": 0.08,
        "style": {"style": "IRIS", "zoom": 18432},
        "influence": 0.035
      },
      "continuation": {
        "chance": 0.997,
        "style": {"style": "VASCULAR_IRIS", "zoom": 18432},
        "influence": 0.002
      },
      "routingStyle": {
        "style": "VASCULAR_IRIS",
        "zoom": 6144,
        "fracture": {"style": "IRIS", "zoom": 2048, "multiplier": 768}
      },
      "routingNoiseWeight": 96,
      "flowAlignmentWeight": 32,
      "confluenceWeight": 192,
      "branchSoftCap": 4,
      "branchChildShrinkFactor": 0.35,
      "terrainHeightWeight": 0,
      "terrainSlopeWeight": 0,
      "oceanAttraction": 8,
      "requireOcean": false
    },
    "terrain": {
      "channelWidth": {
        "min": 1,
        "max": 7,
        "style": {
          "style": "IRIS",
          "zoom": 768,
          "fracture": {"style": "SIMPLEX", "zoom": 1920, "multiplier": 160}
        }
      },
      "bankWidth": {
        "min": 0.75,
        "max": 2.75,
        "style": {"style": "IRIS", "zoom": 512}
      },
      "depth": {
        "min": 1.5,
        "max": 8.5,
        "style": {"style": "SIMPLEX", "zoom": 896}
      },
      "maxChannelWidth": 7,
      "maxBankWidth": 3,
      "maxDepth": 10,
      "orderWidthFactor": 0.18,
      "orderDepthFactor": 0.16,
      "incision": {
        "chance": 1,
        "style": {"style": "IRIS", "zoom": 3072},
        "influence": 0
      },
      "maxIncision": 15,
      "bankExponent": 1.05,
      "tunnelMouthBlend": 2,
      "tunnelWidthMultiplier": {
        "min": 2,
        "max": 4,
        "style": {"style": "IRIS", "zoom": 96}
      },
      "tunnelFloorStyle": {"style": "IRIS", "zoom": 48},
      "tunnelFloorVariation": 2,
      "tunnelRoofStyle": {"style": "IRIS", "zoom": 64},
      "tunnelRoofVariation": 3,
      "meanderStyle": {
        "style": "IRIS",
        "zoom": 384,
        "fracture": {"style": "IRIS", "zoom": 1024, "multiplier": 160}
      },
      "meanderStrength": 384,
      "meanderSubdivisions": 48,
      "bedRoughnessStyle": {
        "style": "IRIS",
        "zoom": 96,
        "fracture": {"style": "SIMPLEX", "zoom": 256, "multiplier": 32}
      },
      "bedRoughness": 1,
      "terminalMode": "DRY_CHANNEL",
      "terminalTaper": 112,
      "dryContinuationChance": 0.3
    },
    "water": {
      "mode": "SEA_LEVEL",
      "poolLength": 128,
      "maximumPoolRise": 0,
      "dropHeight": 1
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
      "mode": "GENERATE_GROTTO",
      "entry": {
        "chance": 0.35,
        "style": {"style": "IRIS", "zoom": 2048},
        "influence": 0.2
      },
      "minimumSpacing": 384,
      "maximumPerReach": 1,
      "maxBoreDepth": 64,
      "throatRadius": 2,
      "waterLevelOffset": -16,
      "dryHeadroom": 4,
      "grottoHorizontalRadius": 10,
      "grottoVerticalRadius": 6,
      "grottoShapeStyle": {"style": "IRIS", "zoom": 28},
      "grottoWarpStyle": {"style": "IRIS", "zoom": 56},
      "grottoWarpStrength": 1.5,
      "maxFloodRadius": 16,
      "maxFloodDepth": 64,
      "maxFloodVolume": 8192,
      "fallback": "SEALED",
      "existingFluidPolicy": "REJECT"
    }
  }
}
```

Create a dedicated authoring pack with `/iris studio create name=river-test`, or add the configuration to an existing pack dimension and open it with `/iris studio open <dimension-key> seed=1337`. Move far enough to generate untouched chunks. In Iris Vision, select **River network**: blue is a wet channel, cyan is a mouth, green is a bank, brown is a dry channel or bank, and dark gray has no river footprint.

The normal biome and height views show the final generated result. The river view shows the routing footprint directly, which is the better first check when a river is absent because of source chance, routing, maximum incision, or terminal policy. At coarse zoom it tests each complete output-pixel footprint against the river curve, so a narrow reach remains continuous instead of turning into dashes when its centerline falls between sample points.

## How the network stays connected

Iris creates one jittered graph node per routing cell and joins neighboring nodes with a stable planar graph. A second coarse lattice places deterministic jittered drainage sinks `routingBasinCells` apart; every node measures its distance to the nearest sink. Before that distance is measured, a smooth low-frequency domain warp displaces the node by up to `routingDeviationStrengthCells`, with `routingDeviationScaleCells` controlling the wavelength. A downstream edge must reduce this single warped distance, while the configured natural-height and slope weights, alignment with the low-frequency routing field, ocean attraction, local routing cost, and `confluenceWeight` choose among the inward candidates. Confluence attraction is a node-stable preference shared by nearby upstream reaches, so it forms repeated Y branches and dominant trunks instead of unrelated parallel squiggles. Each node admits its first `branchSoftCap` upstream children, then applies `branchChildShrinkFactor` multiplicatively to later children. That local rule repeats at every generation, allowing arbitrarily deep recursive tributary trees while making three or four immediate branches the common visual limit. The warped potential produces long directional changes across several reaches without abandoning convergence. Basin distance plus stable node identity remains a strict total order, so every node has at most one downstream edge and the graph cannot cycle; visual splits are upstream tributary branches that merge in the direction of flow.

Terraced hydraulic heads are derived from the same decreasing basin distance. `routingPlateauHeight` is the horizontal basin-distance span per one block of upstream water rise, so a permitted reach remains level or descends even when exact incision carries it across a local natural rise. Terrain never rises to meet the route. When reaching the solved head would cut farther than `maxIncision`, the wet reach becomes a sealed subterranean bore until surface incision is sufficient again.

A sparse source gate selects complete routes, not isolated pixels. With the normal 512-block cells and 16-reach horizon, one accepted route can persist for several kilometres. `minimumSourcesPerTile` selects stable eligible nodes from the routing tile's outer drainage shell, with seeded identity breaking near-ties; it does not force `source.chance: 0` back on. Nearby sources independently follow the same node-owned downstream edge, causing tributaries to merge into a shared suffix whose flow, order, width, and depth grow deterministically. A continuation or incision failure ends or suppresses the route; it never removes a middle segment and leaves two disconnected wet pieces.

Each reach is bent into a deterministic cubic curve without moving its graph endpoints. Its endpoint tangents follow the low-frequency routing field at shared nodes. An edge-stable personality chooses among quiet leans, broad one-sided sweeps, early or late hooks, S-curves, coils, nonperiodic wandering, paired oxbow lobes, and accelerating chirps. Each personality independently varies handedness, amplitude, frequency, phase, and longitudinal skew, so adjacent reaches do not repeat one sinusoidal stamp. World-space `meanderStyle` noise warps the active personality's spacing and amplitude, and every displacement follows the cubic curve's changing local normal instead of one fixed chord normal. Iris samples that authored noise at no more than twelve stable knots per reach and interpolates it across the flattened curve, preserving organic variation without paying one generator evaluation per curve vertex. A quartic envelope removes added displacement and its derivative at both endpoints, so connected reaches keep shared positions and tangents while retaining long turns, asymmetric shapes, and occasional fine curls. Route feasibility uses deterministic centerline probes at roughly one-block spacing for short reaches and at most 65 evenly spaced probes for long reaches. A sampled `BLOCK` area or failed incision gate rejects or reroutes the reach; high solid terrain can instead carry the route in a contained bore. Width, banks, meanders, and stream-order growth are included in the cache halo, so sampling the same coordinate from neighboring tiles returns the same reach.

Physical alternatives and organic stopping are separate decisions. Iris tries another ranked downstream candidate only when the preferred reach is physically invalid. Once it finds the first valid reach, a failed `continuation` roll stops that route instead of silently trying every alternate until one passes.

`requireOcean: true` admits a wet route only when its own bounded trace reaches a sea outlet within `maxRouteReaches`. Ocean intent is only a prefilter: the natural surface at that node must also be below the solved fluid head, so an elevated cliff inside an ocean-intent biome cannot terminate a route before its bore is planned. Converging traces still share the same deterministic downstream edges, but Iris does not assume that a route beyond the configured proof horizon reaches an outlet. A route that cannot prove an outlet follows `terminalMode`. With `requireOcean: false`, reaching `maxRouteReaches` is only the end of that source's evaluation window, not a physical river terminal; overlapping source traces continue the same node-owned graph. Only a real sink, failed continuation, or authored terminal policy ends it.

Topology is dimension-owned. Region and biome overrides can permit, avoid, or block routing and can scale geometry, but they do not create a second graph with incompatible cell boundaries.

### Topology fields

| Field | Default | Meaning |
|---|---:|---|
| `cellSize` | `512` | Routing-cell width in blocks. Smaller cells create more turns and more network work |
| `tileCells` | `4` | Routing cells grouped into one immutable cache tile |
| `siteJitter` | `0.35` | Fractional displacement of a graph node from its cell center, `0`–`0.49` |
| `maxRouteReaches` | `16` | Maximum reaches followed while proving one source route. Larger values grow longer trunks and enlarge the cold routing halo |
| `minimumSourcesPerTile` | `0` | Minimum stable outer-shell headwaters selected from each routing tile while source chance is above zero. `1` prevents blank regional tiles without filling every graph node; `0` allows complete local gaps |
| `sinkSearchReaches` | `4` | Alternate downstream candidates considered per routing step when the cheapest reach is invalid, from `0` to `7` |
| `routingBasinCells` | `64` | Spacing of jittered drainage sinks in routing cells. Larger values create wider trees and longer trunks before a basin terminal |
| `routingDeviationScaleCells` | `24` | Wavelength in routing cells of the smooth drainage-domain warp |
| `routingDeviationStrengthCells` | `0` | Maximum drainage-domain displacement in routing cells. Nonzero values produce long multi-reach directional deviations while preserving one acyclic rank |
| `routingPlateauHeight` | `8` | Horizontal basin-distance span in routing cells per one block of terraced water rise |
| `source` | `0.05` chance | Noise-modulated probability that a graph node begins a route |
| `continuation` | `0.99` chance | Noise-modulated probability for each complete continuation reach |
| `routingStyle` | `VASCULAR`, zoom `8192` | Low-frequency stable field whose tangent guides long creeping corridors and convergent branches |
| `routingNoiseWeight` | `24` | Maximum candidate routing-cost contribution sampled from `routingStyle` |
| `flowAlignmentWeight` | `24` | Penalty for candidates that do not follow the local `routingStyle` tangent |
| `confluenceWeight` | `0` | Stable attraction toward shared downstream nodes. Higher values form more visible tributary branches and trunk junctions without permitting cycles |
| `branchSoftCap` | `4` | Number of upstream children admitted at a node before probabilistic branch shrinking begins |
| `branchChildShrinkFactor` | `0.35` | Multiplicative survival probability for each child beyond the soft cap. The rule repeats independently at every branch generation |
| `terrainHeightWeight` | `0.7` | Preference for lower natural terrain |
| `terrainSlopeWeight` | `0.35` | Additional cost for steep natural terrain |
| `oceanAttraction` | `1` | Preference for a natural sea outlet |
| `requireOcean` | `false` | Require a proven sea outlet for ordinary wet routes |

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

River terrain is a second surface derived from the natural height. Iris never raises terrain for a river. It blends downward toward the river bed across the channel and bank footprint, clamps the cut to `maxIncision`, and leaves the natural height available to diagnostics and expressions as `NATURAL_HEIGHT`. Channel-width noise is sampled into a compact profile along each reach and interpolated per column, so the same tube can narrow and widen organically without evaluating generator noise for every block. The profile maximum owns spatial indexing while the local width controls channel section, incision, and bore radius. Final local channel width is at least one block and channel width, bank width, and depth retain their authored caps after stream-order, region, and biome scaling. After local depth scaling, wet depth is also clamped above bed roughness by one block so a shallow authored style cannot round its entire wet core back to the water surface.

| Field | Default | Meaning |
|---|---:|---|
| `channelWidth` | `8..20` | Wet-channel width before stream-order scaling |
| `bankWidth` | `5..18` | Transition outside the channel |
| `depth` | `2..7` | Wet-bed depth below the solved water head, or dry-channel depth below natural terrain |
| `maxChannelWidth` | `10` | Final wet-channel width cap after every multiplier and stream-order increase |
| `maxBankWidth` | `4` | Final bank-transition cap on each side after local multipliers |
| `maxDepth` | `10` | Final depth cap after every multiplier and stream-order increase |
| `orderWidthFactor` | `0.35` | Width growth for merged upstream flow order |
| `orderDepthFactor` | `0.2` | Depth growth for merged upstream flow order |
| `incision` | chance `1` | Noise gate deciding whether a complete reach may cut terrain |
| `maxIncision` | `48` | Maximum cut below natural terrain, before local multipliers |
| `bankExponent` | `2` | Cross-section curve from channel to natural bank |
| `tunnelMouthBlend` | `2` | Extra lateral bore blend on each side of a surface-to-solid entrance or exit |
| `tunnelWidthMultiplier` | `1..1` | Noise-styled subterranean width multiplier. It does not change the capped surface channel |
| `tunnelFloorStyle` | `IRIS`, zoom `48` | Noise shaping the submerged floor of a contained river tunnel |
| `tunnelFloorVariation` | `2` | Maximum tunnel-floor displacement in blocks |
| `tunnelRoofStyle` | `IRIS`, zoom `64` | Noise shaping the dry roof of a contained river tunnel |
| `tunnelRoofVariation` | `3` | Maximum tunnel-roof displacement in blocks |
| `meanderStyle` | `IRIS`, zoom `512` | Warps the spacing and amplitude inside each reach's deterministic shape personality |

Pack validation derives the tunnel-planning footprint from `maxChannelWidth`, `tunnelWidthMultiplier.max`, and `tunnelMouthBlend`. A configuration that could require more than 65,536 tunnel-column samples for one generated chunk is rejected as a blocking hydrology-budget error even when each individual field is inside its documented numeric range.
| `meanderStrength` | `72` | Total bend envelope in blocks, shared by the endpoint spline and varied noise-driven personality and also limited by reach length |
| `meanderSubdivisions` | `8` | Segments used to flatten the bent reach; higher values permit the coil and chirp personalities to resolve more complex bends |
| `bedRoughnessStyle` | `IRIS`, zoom `96` | Small-scale bed variation |
| `bedRoughness` | `0.75` | Maximum bed variation in blocks |
| `terminalMode` | `DRY_CHANNEL` | `SUPPRESS`, `DRY_CHANNEL`, or `SINKHOLE_GROTTO` |
| `terminalTaper` | `64` | Actual along-reach distance used to return a non-sinkhole terminal channel to natural terrain |
| `dryContinuationChance` | `1` | Probability that a failed route is retained as a dry channel |

`SUPPRESS` removes a route that cannot satisfy its outlet policy. `DRY_CHANNEL` keeps a waterless erosion channel and tapers it back to natural terrain. `SINKHOLE_GROTTO` keeps full channel incision through its guaranteed fluid-bearing cave anchor, bypassing terminal taper only for that reach. It remains wet only while the mantle cave-hydrology pass is active. If mantle, carving, `CARVED`, `RIVER_HYDROLOGY`, the cave mode, or the per-reach cap disables that pass, runtime suppresses the terminal instead of leaving a wet dead end.

Dry channels expose no surface fluid. They do not run shoreline or underwater decorators and do not make an object or native structure count as submerged.

### Surface incision and ridge bores

A wet column remains a surface river while its own capped terrain result rounds below its local water head. If it would require more incision, that column leaves the surface: natural terrain and its biome, decorators, structures, and public surface classification remain unchanged above it, while the River network Vision view and river expression streams still expose the connected route. This decision is column-local, so low/open shoreline cells remain valid surface mouths beside high columns that become a bore. At each surface-to-solid transition, `tunnelMouthBlend` widens the aperture laterally without widening the complete surface river.

The mantle pass carves a rounded lower and upper bore with river fluid from bed to head and `caves.dryHeadroom` above it. `tunnelWidthMultiplier` varies the subterranean radius independently of the capped surface channel; the managed Overworld and Underworld use a smooth IRIS range from two to four times the local channel width. Independent floor and roof styles modulate the profile without flattening either surface; their displacement collapses toward the tube sides. A bore may cut through a closed baseline cave: wet-side cave-air contacts become a one-block solid guard sleeve, while dry-headroom contacts remain walkable apertures into the cave. This produces cave-wall and grotto intersections without authorizing water to spread through the complete cave. Surface-open cave air, lava, existing fluid, a world boundary, or an unproved neighbor still caps the bore. The complete wet core and dry roof may transition into the adjacent surface river reservoir, preventing a one-column terrain plug at the portal. Every cave-air aperture and guard records its exact baseline precondition, so a concurrent baseline change aborts publication. Each chunk plans against the underlying carved-terrain baseline while reading already-published river actions separately, then iteratively stabilizes its contained column set and publishes only its owned cells. Cross-chunk order therefore cannot make one part of a bore or grotto invalidate another.

Ridge bores require mantle and carving plus the `CARVED` and `RIVER_HYDROLOGY` components, but they do not require optional cave flooding. `caves.mode: SEALED` therefore disables random cave entries while still allowing a river to pass safely under high terrain.

## Water heads

`SEA_LEVEL` uses the dimension `fluidHeight` as the highest filled water block for every wet reach, so river water cannot sit above the ocean surface. `TERRACED` intentionally permits flat upstream pools above that level, separated by controlled drops:

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

The water head is per column. Terrain fill, underwater decorators, shore checks, object placement, native-structure placement, cave reservoir protection, Vision, and the Bukkit terrain API all read that same local value. A terraced head above sea level does not raise the dimension's global cave aquifer or seal unrelated cave columns. As soon as a mouth footprint enters a natural ocean column, its head is clamped to the dimension `fluidHeight`; a terraced river can approach from above but cannot form a raised ribbon over ocean water.

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

Optional river-to-cave connections require `useMantle: true`, `carvingEnabled: true`, enabled `CARVED` and `RIVER_HYDROLOGY` mantle flags, a `caves.mode` other than `SEALED`, and `maximumPerReach` above zero. An ordinary candidate begins at a stable anchor on either a wet surface river bed or the floor of a contained subterranean bore, applies the configured entry chance and local multiplier, respects `minimumSpacing`, and searches downward no farther than `maxBoreDepth`. Anchors that cannot physically source a surface or tunnel inlet do not consume the per-reach cap. The earliest noise-eligible, sourceable anchors up to `maximumPerReach` receive deterministic containment attempts; a failed proof does not promote a later anchor, so chunk order cannot change which candidates were tried.

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
  "parentBiomeInheritance": 0.5,
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
| `SEALED` | Disable optional cave entries; contained ridge bores may still pass through solid terrain |
| `FLOOD_CLOSED_COMPONENT` | Bore into and fill only a complete existing cave component that passes closure proof |
| `GENERATE_GROTTO` | Carve a bounded noisy chamber with a proven solid shell and pour the river through its throat into the lower pool |
| `GROTTO_OR_CLOSED_COMPONENT` | Use a proven existing component when present; otherwise try a bounded generated grotto |
| `WATERFALL_POOL` | Emit falling fluid through a bounded throat into a proven closed pool; a direct surface-connected pit receives only the throat water and its connected cave component is not pre-filled |

A `SINKHOLE_GROTTO` terminal is a forced generated-grotto connection, not an ordinary random entry. It uses that terminal reach exclusively, bypasses ordinary entry-noise, local multiplier, and spacing gates, and suppresses every ordinary anchor on the same reach even when `maximumPerReach` is greater than one. Pack validation therefore requires active mantle carving, a non-`SEALED` cave mode, `maximumPerReach` above zero, and a valid generated-grotto proof envelope even when the selected cave mode normally floods existing components and has `fallback: SEALED`. Region and biome sinkhole overrides are checked against every enabled river dimension that can reach that resource, including child-biome paths.

### Containment proof

For an existing cave, Iris performs a six-neighbor flood proof from the target. The entire fluid-reachable component must remain inside `maxFloodRadius`, `maxFloodDepth`, and `maxFloodVolume`. It is rejected if the proof touches the world boundary, an opening to the surface, lava, an incompatible existing fluid under the selected policy, or any unprovable cell. `WATERFALL_POOL` is the narrow exception for an opening already connected to the surface: Iris validates and publishes only the vertical throat, uses falling fluid above the configured pool head, and does not turn the open cave component into source water.

For a generated grotto, `grottoShapeStyle` perturbs the chamber boundary and `grottoWarpStyle` displaces its coordinate field by at most `grottoWarpStrength`. The complete warped chamber, throat, and surrounding solid shell must still fit inside the proof limits. Iris constrains the chamber roof below the river bed; if the configured pool head and `dryHeadroom` cannot both fit beneath that roof, the candidate is rejected instead of intersecting the open surface channel. Throat cells above the pool head contain falling river fluid, while the chamber retains dry air above the pool. `throatRadius` controls the inlet bore.

`parentBiomeInheritance` selects the fraction of four-by-four boundary columns whose floor and ceiling layers come from the naturally resolved parent instead of the selected `floodedCave` biome. Deep columns inherit the effective cave biome, including dimension carving entries; shallow columns inherit the pre-river natural surface biome. The choice is deterministic and shared by the floor and roof of a column, producing coherent patches rather than block speckle. The remaining columns use the flooded-cave override. Iris may replace a containment guard only with a solid, non-fluid layer, and rejects gravity-affected roof layers, so palette inheritance cannot puncture or destabilize the shell.

The managed Overworld and Underworld use `GENERATE_GROTTO` at 35% base entry chance with 20% IRIS modulation, at most one accepted candidate per reach, and 384-block spacing. Their pool head is 16 blocks below the river surface, leaving four blocks of contained headroom beneath channels up to the authored 10-block depth cap. A 64-block bore search and an 8,192-cell transaction budget allow the chamber to fit without authorizing a flood search through unrelated caves. The complete configured river-facing throat aperture is the only permitted open boundary; contact elsewhere with existing air, fluid, lava, or an open shell still seals the attempt completely.

Mantle dependencies are sized to the active cave behavior. A generated-grotto-only network depends on its grotto, throat, warp, and shell envelope instead of inheriting `maxFloodRadius`; modes that can enter an existing cave retain the larger closed-component proof radius. Sinkhole terminals and generated fallbacks remain included in the envelope whenever their configured mode can select them.

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

River tiles are immutable and cached. A cold tile performs graph routing and reach indexing; warm column samples are direct spatial-index lookups, and one default tile covers 2,048 by 2,048 blocks. Candidate ranking keeps meander geometry lazy, accumulated reaches outside the requested tile are discarded before curve and dimension sampling, and long feasibility proofs are capped at 65 deterministic centerline probes. When no reachable region or biome can block routing, contained-bore feasibility bypasses those local policy probes entirely. Effective region/biome settings are cached by resource identity, unreachable biome overrides do not trigger natural-biome sampling, node and source inputs are resolved once, and zero-weight height and slope streams are not evaluated. Ocean intent short-circuits non-ocean nodes; only possible outlet nodes sample natural height to reject elevated false oceans. Per-column bore classification reuses the height, bed, head, and incision values already resolved for that column instead of repeating centerline sampling. Widened tunnel candidates reject expanded-radius misses before sampling natural height, region, biome, floor, or roof data, and a fixed tunnel-width multiplier bypasses noise evaluation. Reach routing cost resolves its regional multiplier once at the reach midpoint. Each source tile orders partial floor candidates by stable identity; a full floor skips sorting and directly tests each node once. Every non-winner is still rejected against the dimension-wide maximum source multiplier before natural height or region/biome settings are sampled. Empty river footprints also skip the mantle tunnel-column scan entirely.

Cold work grows quickly with `maxRouteReaches` because that value expands both the source window and the number of steps traced from each candidate source. `meanderSubdivisions` increases curve and spatial-index work for every accepted reach. The shipped Overworld and Underworld use 1,700-block cells, three cells per cache tile, `maxRouteReaches: 8`, all nine cell nodes admitted as guaranteed sources, `routingBasinCells: 112`, and `meanderSubdivisions: 48`. This retains the 2.999-times headwater density of the immediately preceding 2,944-block setup and raises its curve sampling density to 6.927 times that setup. A 6,144-block VASCULAR_IRIS routing field guides multi-reach flow, the 24-cell drainage warp supplies long directional changes, and one- and two-cycle macro bends sit beneath the six locally noise-warped curls. The 384-block total bend envelope prevents either layer from escaping its reach's deterministic cache halo. One source proves 13,600 blocks, while dense overlapping sources and physically equivalent roughly 190,000-block drainage basins preserve long global trunks. Shipping routes intentionally set terrain height and slope routing weights to zero: topology crosses mountain chains according to the cached continental mask and routing field, while actual columns bend terrain down by up to 15 blocks and then pass through higher relief in sealed water-bearing bores. Regional incision and continuation multipliers no longer shorten those mountain crossings, and ordinary regional dry or suppressed terminals now inherit the wet dimension behavior; Terralost retains its intentional sinkhole grotto. The full source floor remains cheap because it bypasses sorting and samples each candidate once. The topology's pessimistic 134,832 spatial-index writes per reach remain well below the enforced 1,048,576 limit. Generated grottos use one sparse candidate per reach and never run a component flood through unrelated cave air. Increase the route or subdivision limits only after profiling representative cold generation. Wider channels, stronger meanders, smaller cells or tiles, a larger source floor, and higher source chance also increase cold-tile work or repeat it more often. Pack validation and runtime construction reject derived routing footprints outside the bounded work envelope even when every individual setting is within its numeric range. Pregeneration amortizes accepted work naturally because nearby chunks share tiles.

Do not use final river-derived engine streams inside river configuration noise. Besides being rejected by validation, that would make topology depend on the result it is currently building. Use natural height, ordinary generator styles, region/biome identity, and fixed authored multipliers instead.

River output is a pure function of pack bytes, world seed, and coordinates. Tile build order, chunk generation order, platform, and worker count do not change graph identity, source gates, route arbitration, cave source arbitration, or overlay publication.

## Validation and recovery

Run `/iris pack validate pack=<pack-key>` before opening a studio or production world. Validation checks numeric bounds, malformed styles, recursive stream dependencies, missing biome keys, impossible grotto proof envelopes, terraced drop consistency, and sinkhole terminals without active cave hydrology. River-role derivative warnings apply to `NORMAL` dimensions where native Overworld structure selection consumes SEA and SHORE roles. `NETHER` and `THE_END` dimensions retain their environment-specific derivatives without Overworld-role warnings; Iris still validates that every referenced biome exists.

| Symptom | Check |
|---|---|
| No rivers in the normal biome view | Confirm `enabled: true`, inspect the River network Vision mode at a regional zoom, then set `minimumSourcesPerTile: 1` or raise `source.chance` if complete local gaps are not intended |
| Rivers look like short scattered arcs | Use `routingBasinCells` well above `maxRouteReaches`, keep continuation and incision chances near `1`, and set a positive source floor. For one-bow curves, use signed `IRIS` meander noise, raise `meanderSubdivisions`, and keep fracture displacement below the parent noise wavelength |
| Routes appear but no terrain cuts | A high route may be a hidden ridge bore. Check River network Vision, then check `incision`, `maxIncision`, local `maxIncisionMultiplier`, and `BLOCK` overrides |
| Most sources disappear | `requireOcean` needs a provable outlet; raise `maxRouteReaches`, reduce blocking areas, or choose an explicit terminal policy |
| Dry channels contain water or run shoreline plants | Regenerate untouched chunks with the same build; dry channels have no surface-fluid head |
| Elevated river uses land content | Check the channel pool and inferred role; empty pools still force wet channel/mouth fallback to sea behavior |
| Cave entry never appears | Enable a non-`SEALED` cave mode, raise `entry.chance`, confirm `maximumPerReach > 0`, and check `caveEntryMultiplier` |
| Cave candidate remains sealed | The containment proof rejected it. Increase bounds only when the larger memory/work envelope is acceptable; never disable the surface/world/lava checks |
| Existing world has a hard seam | Restore the previous river config or regenerate the affected chunks/world from backup. River topology is not retrofitted into old chunks |
