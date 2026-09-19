---
title: "Procedural Trees"
description: "Iris documentation: Procedural Trees"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-09-19T00:00:00.000Z
---
`IrisProceduralTree` builds trees from JSON: a trunk, a canopy, optional branches, roots and forks. Entries live in `proceduralObjects.trees` on a biome or region.

The shared bake/place model, the fields every procedural family has (`chance`, `density`, `variants`, `seed`, `mode`, `carvingSupport` and the rest), and the other five families are on [17 - Procedural Objects](/iris/17-procedural-objects). Sapling replacement is a different system, also documented there.

Snippet key: `procedural-tree`.

## Walkthrough: procedural trees in a biome

Use a validating `OVERWORLD` pack with `useMantle` and `decorate` on. Save this as `biomes/tutorial/tree-test.json`, list `tutorial/tree-test` as a region land biome, and temporarily set the dimension `focus` to the same key.

```json
{
  "name": "Procedural Tree Test",
  "derivative": "minecraft:plains",
  "vanillaDerivative": "minecraft:plains",
  "layers": [
    { "palette": [{ "block": "minecraft:grass_block" }] }
  ],
  "generators": [
    { "generator": "flat", "min": 16, "max": 16 }
  ],
  "proceduralObjects": {
    "trees": [
      {
        "name": "tutorial-oak",
        "chance": 1,
        "density": 2,
        "variants": 4,
        "seed": 9001,
        "trunk": "minecraft:oak_log",
        "leaves": "minecraft:oak_leaves",
        "profile": "OAK",
        "heightMin": 7,
        "heightMax": 11,
        "plausible": true
      }
    ]
  }
}
```

1. Reuse `generators/flat.json` from [26 - Example - Minimal Dimension](/iris/26-example-minimal-dimension). Validate the pack. Open Studio on seed `1337`.
2. Fly out and generate fresh chunks. Success is two oaks per chunk, drawn from four distinct silhouettes, rooted on the grass, with leaves carrying normal decay distances.
3. If nothing appears: confirm the biome is focused and the chunks are new, confirm `useMantle` is true, and check the console for bake failures. Keep `chance: 1` until you have seen a tree.
4. Break a leaf block and watch the canopy. With `plausible: true`, leaves more than six blocks from wood are permanently persistent; everything closer decays normally when you cut the trunk.
5. Tune height, profile, trunk shape, and canopy before you touch `chance` and `density`. Reopen Studio and confirm the same seed reproduces the same four shapes, then drop `chance` to something forest-like and remove `focus`.

Variant heights are not random per variant. Iris spreads them evenly across `heightMin..heightMax` and adds up to +/- 30% of one step of jitter, so four variants over `7..11` give roughly 7, 8, 10, 11 rather than four coin flips. Raising `variants` fills in the height range rather than just adding randomness.

## Materials and size

| Field | Default | What it does |
|-------|---------|--------------|
| `trunk` | `minecraft:oak_log` | The log block. Ignored entirely when `trunkPalette` is set |
| `trunkPalette` | unset | Noise-driven palette for the trunk, for streaked or mixed-species wood |
| `leaves` | `minecraft:oak_leaves` | The leaf block. Ignored when `leavesPalette` is set |
| `leavesPalette` | unset | Noise-driven leaf palette. Only entries that are genuinely leaves receive decay distances |
| `plausible` | `true` | See below |
| `heightMin` / `heightMax` | `8` / `12` | Trunk height range spread across the variant pool. Heights below 2 are clamped up |
| `trunkWidth` | `1` | Base thickness. 1 is a single column, 2 is a 2x2, 3 a 3x3 |
| `profile` | `OAK` | Named silhouette driving default crown radii and layer placement |

`IrisTreeProfile`: `OAK`, `BIRCH`, `SPRUCE`, `JUNGLE`, `ACACIA`, `DARK_OAK`, `DARK_OAK_FLAT`, `DARK_OAK_FLAT_WIDE`, `CHERRY`, `PALM`, `WILLOW`, `COLUMNAR`, `BUSH`, `MEGA_SPRUCE`.

**What `plausible` actually does.** With `true`, leaves within 6 steps of wood get `persistent=false` and their real `distance`, so vanilla decay works exactly as it would on a grown tree; leaves 7 or more steps away, or unreachable entirely, get `persistent=true` and `distance=7` so they never vanish. A support pass also prunes orphaned leaf clumps. With `false`, every leaf is forced `persistent=true, distance=1`, which never decays and reads as built rather than grown.

## Trunk shaping

| Field | Default | What it does |
|-------|---------|--------------|
| `trunkShape` | `CONSTANT` | Function mapping normalized height to a trunk width multiplier. `TAPER`-like effects come from `LINEAR` with `shapeEnd` below 1 |
| `shapeStart` / `shapeEnd` | `1` / `1` | Width multipliers at base and top for `LINEAR` |
| `shapeSteepness` | `5` | Transition sharpness for `SIGMOID` |
| `shapeBase` | `2.718281828` | Logarithm base for `LOG` |
| `shapePeriod` / `shapeAmplitude` | `1` / `0.2` | Wobble frequency and depth for `SINE`, for lumpy or knotted trunks |
| `shapePeakOffset` / `shapeFloor` | `0.5` / `0.5` | For `PARABOLIC`: where the waist sits (0 base, 1 top) and how thin it gets |
| `leanAngle` | `0` | Degrees off vertical. Non-zero produces a leaning trunk. Combine with rotation for wind-swept stands |
| `leanAzimuth` | `0` | Compass direction of the lean |
| `trunkCurve` | `LINEAR` | How lean accumulates over height. `SIGMOID` bends mostly in the middle. `CONSTANT` shears uniformly |
| `curveSteepness` | `8` | Sharpness of that bend for `SIGMOID` |
| `leanAzimuthMode` | `CONSTANT` | Lets the lean *direction* change with height, which is what turns a lean into a spiral or a wander |
| `azimuthStart` / `azimuthEnd` | `0` / `0` | Endpoints for `LINEAR` azimuth |
| `azimuthTurns` | `1` | Full rotations over the trunk for `SPIRAL` |
| `azimuthAmplitude` / `azimuthPeriod` / `azimuthOffset` | `90` / `1` / `0` | Sine azimuth wobble controls, for S-curved trunks |
| `azimuthScale` | `1` | Noise scale for `NOISE` azimuth |
| `azimuthWhorlCount` | `5` | Positions per ring for `WHORL` azimuth |
| `trunkForks` | `1` (1–6) | Splits the trunk into this many limbs above `forkHeight`. Each limb gets its own canopy |
| `forkHeight` | `0.5` | Normalized height of the split |
| `forkAngle` | `25` | Degrees each fork leans outward |
| `secondaryTrunk` | unset | Optional second wood block for a banded trunk. Ignored when `secondaryTrunkPalette` is set |
| `secondaryTrunkPalette` | unset | Noise palette for that band |
| `secondaryTrunkStart` / `secondaryTrunkEnd` | `0.5` / `1` | Normalized band bounds |
| `roots` | `true` | Builds a root system so the tree meets uneven ground instead of hovering |
| `rootStyle` | `BUTTRESS` | `TAPROOT` drives one thick root down. `BUTTRESS` flares several out at the base. `STILT` lifts the trunk on legs |
| `rootDepth` | `0` | Explicit reach in blocks. 0 scales automatically with tree height |
| `rootFlare` | `0` | Explicit flare radius. 0 scales automatically |

`IrisTreeFunction`: `CONSTANT`, `LINEAR`, `SIGMOID`, `LOG`, `SINE`, `PARABOLIC`, `EXPONENTIAL`, `SQRT`, `STEP`, `BELL`, `EASE_IN_OUT`.

`IrisTreeAzimuthMode`: `CONSTANT`, `LINEAR`, `SPIRAL`, `SINE`, `NOISE`, `RANDOM`, `GOLDEN_ANGLE`, `ALTERNATING`, `WHORL`, `ZIGZAG`.

## Canopy (`IrisTreeCanopy`)

Snippet key: `tree-canopy`. Stacked discs, sized by the profile unless you override them.

| Field | Default | What it does |
|-------|---------|--------------|
| `startAngle` | `90` | Elevation of each disc in degrees. Exactly 90 is a flat disc. Below 90 domes downward toward a sphere. Above 90 flares out into an umbrella |
| `squish` | `1` | Vertical scale of the crown volume. Below 1 flattens it |
| `mode` | `TRIMMED` | How each disc fills with leaves |
| `leafDensity` | `0.85` | Fill probability for the `DENSITY` and `NOISE` modes |
| `crownStretchX` / `crownStretchZ` | `1` / `1` | Elliptical crowns for wind-shaped or asymmetric trees |
| `layers` | `[]` | Explicit discs. Any entry here replaces the profile-driven layers entirely |
| `branches` | unset | When set, branches build most of the canopy and only the topmost profile disc is still placed |

`IrisTreeLayer` (snippet `tree-layer`) is `yOffset` (blocks above the trunk base, default `0`) and `radius` (default `2`).

`IrisTreeLeafMode`: `TRIMMED`, `FILLED`, `DENSITY`, `NOISE`, `HOLLOW`, `GRADIENT`, `CLUMPED`, `TATTERED`, `SPARSE`.

## Branches (`IrisTreeBranches`)

Snippet key: `tree-branches`. Adding a `branches` object switches the tree from a stack of leaf discs to real limbs with leaf balls at their tips. That is the difference between a vanilla oak and an old-growth silhouette.

| Field | Default | What it does |
|-------|---------|--------------|
| `probabilityFunction` | `TOP_HEAVY` | Where branches spawn along the trunk. `TOP_HEAVY` for a crown, `PERIODIC` for conifer whorls, `BAND` for a single tier |
| `probabilityConstant` | `0.5` | Chance for `CONSTANT` |
| `probabilityBase` / `probabilityCrown` | `0` / `1` | Endpoints for `LINEAR` |
| `probabilitySteepness` / `probabilityMidpoint` | `10` / `0.7` | `SIGMOID` sharpness and where the crown starts |
| `probabilityExponent` | `2` | `TOP_HEAVY` bias. Higher pushes branches further up |
| `probabilityMean` / `probabilityStd` | `0.7` / `0.15` | `GAUSSIAN` center and spread, for a single dense tier |
| `probabilityScale` | `1` | Noise scale for `NOISE` |
| `probabilityPeriods` | `5` | Number of whorl rings for `PERIODIC` |
| `lengthFunction` | `LINEAR` | How branch length varies with height. `LINEAR` with a large `lengthCrown` gives the classic wide top |
| `lengthBase` / `lengthCrown` | `1` / `4` | Endpoints for `LINEAR` |
| `lengthConstant` / `lengthMax` | `3` / `4` | Value for `CONSTANT`, and the ceiling for `SIGMOID`, `LOG` and `PARABOLIC` |
| `lengthSteepness` | `5` | `SIGMOID` length sharpness |
| `azimuthMode` | `RANDOM` | Compass distribution of branches. `GOLDEN_ANGLE` gives even spiral phyllotaxis. `WHORL` gives rings |
| `azimuth` | `0` | Fixed direction when `azimuthMode` is `CONSTANT` |
| `elevation` | `0` | Starting angle from horizontal. Positive points up. Negative droops |
| `sag` | `0` | Catenary droop along the branch. Small values read as weight. Large values give willow arcs |
| `branchDepth` | `1` (0–6) | Recursion levels. 2 and above produce fractal branching and a much larger block count |
| `leafStartUp` | `false` | Clamps primary branches so they never droop below horizontal |
| `clusterRadius` | `2` | Leaf ball radius at each branch tip |
| `clusterMode` | `TRIMMED` | Fill mode for that ball |
| `clusterDensity` | `0.85` | Fill probability when `clusterMode` is density- or noise-based |
| `subBranches` | unset | One extra level of sub-branches from each tip |

`IrisTreeBranchProbability`: `CONSTANT`, `LINEAR`, `SIGMOID`, `TOP_HEAVY`, `GAUSSIAN`, `NOISE`, `BOTTOM_HEAVY`, `PERIODIC`, `BAND`, `INVERSE_GAUSSIAN`, `EXPONENTIAL_DECAY`.

`IrisTreeSubBranches` (snippet `tree-sub-branches`) fields: `count` (`1`), `pitchDelta` (`0`, positive bends up), `yawDelta` (`45`, horizontal fan spread), `lengthScale` (`0.5` of the parent), `sag` (`0`), `clusterRadius` (`1`), `clusterMode` (`TRIMMED`), `clusterDensity` (`0.85`).

## Accents

| Field | Default | What it does |
|-------|---------|--------------|
| `secondaryLeaves` | unset | A single accent block scattered through the canopy — blossoms, shroomlight, berries |
| `weightedSecondaryLeaves` | `[]` | Weighted list of accent blocks (`block` plus `weight`), overriding the single block |
| `secondaryLeavesPalette` | unset | Noise palette, overriding both of the above |
| `secondaryLeafFraction` | `0.35` | Share of leaves replaced by the accent. Values near 1 recolour the whole crown |
| `decorators` | `[]` | `IrisTreeDecorator` entries applied after the tree is built |

## Tree decorator (`IrisTreeDecorator`)

Snippet key: `tree-decorator`.

| Field | Default | What it does |
|-------|---------|--------------|
| `target` | `BRANCH_TIP` | Which set of positions is eligible |
| `block` | required | Block id to place. Ignored when `palette` is set |
| `palette` | unset | Noise palette, wins over `block` |
| `chance` | `0.5` | Per eligible position. Use low values for sparse fruit, 1 for full coverage such as snow on the crown |
| `length` | `1` | Maximum downward strand length for `CANOPY_HANG`. Each column picks 1 to `length` |
| `axisAware` | `false` | Orients the block facing away from the trunk, for fences, gates and banners mounted on wood |

Targets: `BRANCH_TIP`, `TRUNK_SURFACE`, `CANOPY_TOP`, `CANOPY_BOTTOM`, `TRUNK_BASE`, `LEAF_SURFACE`, `CANOPY_HANG`, `BRANCH_SURFACE`, `TRUNK_TOP`, `GROUND_SCATTER`.

An empty `decorators` list costs nothing, because branch endpoints are only collected when at least one decorator exists. `BRANCH_TIP` accents occupy the first free block outside the terminal leaf cluster in the branch's outward direction, preserving branch wood and leaves; repeated application stops at an existing accent instead of extending a chain.

## A complete tree

```json
{
  "name": "oak-plains",
  "chance": 0.35,
  "density": 2,
  "variants": 8,
  "seed": 9001,
  "trunk": "minecraft:oak_log",
  "leaves": "minecraft:oak_leaves",
  "profile": "OAK",
  "heightMin": 7,
  "heightMax": 11,
  "plausible": true,
  "roots": true,
  "rootStyle": "BUTTRESS",
  "canopy": {
    "mode": "TRIMMED",
    "startAngle": 88,
    "squish": 0.9
  }
}
```
