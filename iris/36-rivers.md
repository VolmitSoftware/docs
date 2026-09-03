---
title: "Rivers"
description: "Valley-first surface rivers, underground rivers, grottos, deep fluids, river policy, and the tooling that inspects an accepted plan"
published: true
date: 2026-09-03T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-22T00:00:00.000Z
---
Iris hydrology plans surface rivers that sit in eroded valleys, independently sourced underground rivers, coastal and inland grottos, and independent deep-fluid bodies. The planner resolves each course once: its route, water head, channel and bank shape, segment labels, outlet, fluid profile, and biome ownership. Terrain generation, mantle carving, biome selection, decorators, Vision, and feature locators all read that immutable accepted plan. `hydrology.rivers.enabled` defaults to `false`.

A surface river never raises terrain and never writes the ocean. It cuts a channel into the natural surface, holds its water flush with the ground beside it unless `channel.sink` lowers it, and blends the cut back out to natural terrain across a valley whose width grows with the depth of the cut. Water flows downhill in one-block steps; where the land falls faster than the channel can follow, the reach becomes rapids, and where a natural cliff is tall enough, a waterfall. A river reaches the sea through an inlet: its last `mouths.inletLength` blocks are held at sea level, widened toward `mouths.flareRatio` and cut into the coast up to `mouths.maximumIncision`, so the sea visibly reaches inland through a drowned, widening valley instead of the river stopping at the shoreline. Underground rivers, grottos and deep fluids are contained features validated against carved cave matter.

Hydrology is a persistent terrain contract. Its canonical persistent matter store is `mantle-hydrology/`. Create a new world or fully regenerate the affected world whenever its hydrology or river policies change; generated chunks are not retrofitted with a different accepted plan.

Related:

- [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas)
- [11 - Dimensions](/iris/11-dimensions)
- [12 - Regions](/iris/12-regions)
- [13 - Biomes](/iris/13-biomes)
- [15 - Caves & Carving](/iris/15-caves-carving)
- [25 - Pack Management](/iris/25-pack-management)
- [31 - Operator Runbooks](/iris/31-operator-runbooks)
- [32 - Determinism & Goldenhash](/iris/32-determinism-goldenhash)
- [33 - Performance Tuning](/iris/33-performance-tuning)

## Complete hydrology example

The dimension owns the physical system under `hydrology` and supplies its default `riverPolicy`. Region and biome files may contain only their own `riverPolicy` overrides.

This is the managed Overworld shape with every physical section written explicitly:

```json
{
  "hydrology": {
    "rivers": {
      "enabled": true,
      "routing": {
        "tileSize": 1024,
        "sampleSpacing": 64,
        "maximumRouteLength": 16384,
        "minimumSurfaceCourseLength": 384,
        "minimumUndergroundCourseLength": 384,
        "maximumOutletsPerTile": 1,
        "maximumCoastalOutletsPerTile": 2,
        "oceanOutlets": true,
        "inlandOutlets": ["SINKHOLE_GROTTO"],
        "valleyPreference": 1.5,
        "uphillPenalty": 24,
        "slopePenalty": 2,
        "confluenceAttraction": 0.2,
        "lengthPreference": 1,
        "tributaries": 1
      },
      "geometry": {
        "meanders": {
          "primaryWavelength": 192,
          "detailWavelength": 48,
          "primaryStrength": 0.55,
          "detailStrength": 0.18,
          "maximumOffsetRatio": 0.45,
          "smoothingPasses": 2,
          "maximumTurnDegrees": 20
        },
        "surface": {
          "bedRoundness": 2.0,
          "bedRoughness": 0.25,
          "wallRoughness": 0.25,
          "roughnessWavelength": 16
        },
        "underground": {
          "bedRoundness": 3.0,
          "bedRoughness": 0.36,
          "wallRoughness": 0.32,
          "roughnessWavelength": 9,
          "radialBase": 0.86,
          "radialMinimum": 0.58,
          "radialMaximum": 1.18,
          "primaryLobeStrength": 0.08,
          "detailLobeStrength": 0.06,
          "ceilingRoughness": 0.0
        },
        "grottos": {
          "bedRoundness": 3.2,
          "bedRoughness": 0.38,
          "wallRoughness": 0.34,
          "roughnessWavelength": 11,
          "radialBase": 0.86,
          "radialMinimum": 0.58,
          "radialMaximum": 1.18,
          "primaryLobeStrength": 0.08,
          "detailLobeStrength": 0.06,
          "ceilingRoughness": 0.0,
          "aspectMinimum": 0.62,
          "aspectRange": 0.2
        },
        "drops": {
          "cascadeRunPerBlock": 2,
          "cascadeExponent": 1.4,
          "maximumCascadeStep": 2,
          "flowWidthRatio": 0.45,
          "maximumFlowDepth": 2,
          "basinWidthRatio": 1.8,
          "maximumBasinDepth": 8,
          "undergroundCascadeRunPerBlock": 0
        }
      },
      "surface": {
        "enabled": true,
        "sources": {
          "density": 1.75,
          "minimumElevation": 64,
          "minimumPerTile": 0,
          "minimumSpacing": 384
        },
        "channel": {
          "width": {
            "min": 4,
            "max": 8,
            "style": {"style": "IRIS", "zoom": 384}
          },
          "depth": {
            "min": 2,
            "max": 4,
            "style": {"style": "IRIS", "zoom": 320, "exponent": 2}
          },
          "sink": 0,
          "maximumIncision": 16,
          "roughness": 0.25,
          "roughnessWavelength": 16,
          "springWidthRatio": 2.5,
          "springLength": 24,
          "smoothingRadius": 16,
          "outlineMinimumRatio": 0.6,
          "outlineMaximumRatio": 1.4,
          "springExtraDepth": 1.0
        },
        "banks": {
          "shoreWidth": 1.5,
          "shoreRise": 0.0,
          "blendSlope": 3,
          "blendBaseWidth": 0.0,
          "minimumBlendWidth": 4,
          "maximumBlendWidth": 32,
          "exposeCutStrata": true,
          "shoreMaterial": {"enabled": false, "palette": {"palette": [{"block": "minecraft:stone"}]}, "depth": 1},
          "bankMaterial": {"enabled": false, "palette": {"palette": [{"block": "minecraft:stone"}]}, "depth": 1}
        },
        "erosion": {
          "enabled": true,
          "smoothingRadius": 12,
          "thalwegFraction": 0.45,
          "blendCurve": 1.0,
          "bedNoise": 0.5,
          "style": "SMOOTH",
          "terraceSteps": 4,
          "cliffFraction": 0.5,
          "bedProfile": "BOWL"
        },
        "ponds": {
          "source": {"enabled": true, "minimumRadius": 6, "maximumRadius": 12, "depth": 3},
          "terminal": {"enabled": true, "minimumRadius": 4, "maximumRadius": 7, "depth": 3}
        },
        "bed": {
          "allowGravityBlocks": false,
          "padding": 2,
          "paddingPalette": {
            "palette": [{"block": "minecraft:clay"}, {"block": "minecraft:dirt"}]
          },
          "material": {"enabled": false, "palette": {"palette": [{"block": "minecraft:stone"}]}, "depth": 1}
        },
        "flow": {
          "cascadeRun": 2,
          "waterfallMinimumDrop": 6,
          "waterfallThalwegFraction": 0.65,
          "plungeBasinMinimumDrop": 2,
          "plungeBasinLengthRatio": 2.0,
          "plungeBasinDepth": 1
        },
        "mouths": {
          "flareRatio": 2.5,
          "maximumOceanApron": 8,
          "inletLength": 64,
          "inletDepth": 3,
          "maximumIncision": 32,
          "inletCourseFraction": 0.5,
          "inletRampSlope": 1.0
        }
      },
      "underground": {
        "enabled": true,
        "sources": {
          "density": 1.5,
          "minimumPerTile": 0,
          "minimumSpacing": 640
        },
        "fluidLevel": {
          "min": -48,
          "max": 32,
          "style": {"style": "IRIS", "zoom": 512}
        },
        "channelWidth": {
          "min": 3,
          "max": 8,
          "style": {"style": "IRIS", "zoom": 384}
        },
        "depth": {
          "min": 1,
          "max": 3,
          "style": {"style": "IRIS", "zoom": 320}
        },
        "headroom": {
          "min": 6,
          "max": 14,
          "style": {"style": "IRIS", "zoom": 384}
        },
        "connectToExistingCaves": true,
        "mouthLevelingDistance": 128,
        "tributaries": 1,
        "minimumRockCover": 1,
        "minimumFloorCover": 1,
        "wideningSources": 8,
        "bedMaterial": {"enabled": false, "palette": {"palette": [{"block": "minecraft:stone"}]}, "depth": 1}
      },
      "grottos": {
        "coastal": {
          "enabled": true,
          "poolLevel": "SEA_LEVEL",
          "horizontalRadius": 12,
          "verticalRadius": 7,
          "headroom": 10,
          "maximumVolume": 16384,
          "cliffMinimumHeight": 7,
          "cliffSlopeFactor": 0.5,
          "seaCaves": {
            "enabled": true,
            "maximumPerTile": 3,
            "minimumSpacing": 160,
            "minimumCoastHeight": 8,
            "depth": 12,
            "sweepJitterDegrees": 25.0
          }
        },
        "inland": {
          "enabled": true,
          "connectSurfaceRivers": true,
          "horizontalRadius": 10,
          "verticalRadius": 6,
          "headroom": 10,
          "maximumVolume": 16384
        }
      },
      "profiles": [
        {
          "id": "water",
          "fluidPalette": {
            "palette": [{"block": "minecraft:water"}]
          }
        }
      ]
    },
    "deepFluids": [
      {
        "id": "deep_lava",
        "fluidPalette": {
          "palette": [{"block": "minecraft:lava"}]
        },
        "height": {
          "min": -192,
          "max": 32,
          "style": {"style": "IRIS", "zoom": 1024}
        },
        "density": 0.5,
        "spacing": 1024,
        "horizontalRadius": 12,
        "verticalRadius": 5,
        "channelWidth": 3,
        "depth": 1,
        "headroom": 6,
        "containedPools": true,
        "shortChannels": false
      }
    ]
  },
  "riverPolicy": {
    "placement": "NATURAL",
    "routing": "ALLOW",
    "outletAdmission": true,
    "profiles": ["water"],
    "surfaceBiomes": ["temperate/sea/river"],
    "mouthBiomes": ["temperate/sea/ocean"],
    "shoreBiomes": ["temperate/shore/beach"],
    "bankBiomes": ["temperate/plains"],
    "floodedCaveBiomes": ["carving/rocky-cavebiome"],
    "widthMultiplier": 1.0,
    "depthMultiplier": 1.0,
    "routingMultiplier": 1.0,
    "bankMultiplier": 1.0
  }
}
```

Every object with `min` and `max` is an `IrisStyledRange`. `style` is optional; when present it selects a deterministic value between the endpoints in world space. Channel width and depth are resolved at every station along an accepted course, underground fluid level, headroom and deep-fluid elevation are resolved only for selected geometry, and all resolved values are stored in the immutable accepted plan rather than resampled later.

## Physical configuration

### `hydrology.rivers.routing`

| Field | Default | Contract |
|-------|---------|----------|
| `tileSize` | `2048` | Accepted-plan tile width in blocks, `256..8192` |
| `sampleSpacing` | `64` | Coarse terrain and policy lattice spacing; one of `8`, `16`, `32`, `64`, and it must divide `tileSize` |
| `maximumRouteLength` | `16384` | Maximum source-to-outlet route length, `256..32768` blocks |
| `minimumSurfaceCourseLength` | `384` | Minimum exposed length of a complete surface course, `0..32768` and no greater than `maximumRouteLength` |
| `minimumUndergroundCourseLength` | `192` | Minimum complete underground route, `0..32768` and no greater than `maximumRouteLength` |
| `maximumOutletsPerTile` | `4` | Maximum inland drainage roots (sinkhole grottos) selected in one plan tile, `1..256`; unused when no inland outlet kind is enabled |
| `maximumCoastalOutletsPerTile` | `2` | Maximum sea outlets (mouths and coastal grottos) selected in one plan tile, `0..64`, budgeted separately from the inland roots; taken by type in turn (the best mouth, the best coastal grotto, the next mouth, ...), each at least two sample spacings from the others, with the tile's own coast ranked ahead of a neighbour's |
| `oceanOutlets` | `true` | Allows direct sea mouths; qualifying coastal cliffs select an enabled coastal grotto instead, and the coastal budget alternates between the two kinds so a coast with both cliffs and beaches gets both |
| `inlandOutlets` | empty | Allowed inland terminal types; the current value is `SINKHOLE_GROTTO` |
| `valleyPreference` | `1.5` | Weight on natural height when routing, `0..8`; higher values pull routes into the lowest ground |
| `uphillPenalty` | `24` | Cost added per block of climb between lattice samples, `0..128` |
| `slopePenalty` | `2` | Cost multiplied by the local terrain slope, `0..16`; higher values keep routes off hillsides |
| `confluenceAttraction` | `0.2` | Discount for joining ground another route already drains, `0..1` |
| `lengthPreference` | `1` | How strongly longer source-to-outlet routes win when sources are chosen, `0..8`; `0` ranks sources by elevation alone |
| `tributaries` | `1` | Extra surface courses an outlet may accept as tributaries of its main river, `0..4`, budgeted on top of `sources.density`; a tributary is cut where it first comes within a stem width of the stem (or enters drainage the stem owns), joins the lowest stem water it can reach there, and is graded down to the river's level where the two channels touch so its mouth never stands above the stem's shore; a tail up to three blocks below the stem backs up to the stem's level, a deeper shortfall slides the junction downstream, and a tributary reach may bend once where it leaves its own valley for the stem's |

At least one outlet family must be enabled. `tileSize`, `sampleSpacing`, route length, and both source budgets form a bounded planning envelope; see [Validation](#validation).

### `hydrology.rivers.geometry`

Geometry shapes what routing and the surface and underground sections have already sized. `meanders` decides how far a centerline wanders from its solved route. `surface`, `underground` and `grottos` carry the same cross-section fields with their own values, for a carved waterfall throat, a contained passage and a chamber respectively. `drops` shapes descending flow and the basin that receives it.

#### `geometry.meanders`

| Field | Default | Purpose |
|-------|---------|---------|
| `primaryWavelength` | `64` | Broad meander wavelength in blocks, `8..512` |
| `detailWavelength` | `12` | Fine worm wavelength in blocks, `4..128`; smaller values change direction more often |
| `primaryStrength` | `0.34` | Strength of the broad meanders, `0..2` |
| `detailStrength` | `0.42` | Strength of the fine worm movement, `0..2` |
| `maximumOffsetRatio` | `0.48` | Largest lateral displacement from the solved route as a fraction of one drainage edge, `0..1` |
| `smoothingPasses` | `1` | Terrain-safe centerline smoothing passes after route solving, `0..4` |
| `maximumTurnDegrees` | `82` | Largest retained centerline turn angle in degrees, `10..150` |

#### `geometry.surface`, `geometry.underground` and `geometry.grottos`

The three sections share one set of fields. `geometry.surface` shapes the carved throat of a surface waterfall or cascade and the walls the erosion compiler reads, `geometry.underground` shapes contained passages, and `geometry.grottos` shapes chambers. The three roughness fields of `geometry.surface` are nullable and fall back to `surface.channel`; the underground and grotto sections always carry a value.

| Field | Surface default | Underground and grotto default | Purpose |
|-------|-----------------|--------------------------------|---------|
| `bedRoundness` | `2` | `2.4` | Cross-section exponent of the bed, `1..6`; larger values broaden the rounded U-shaped bed |
| `bedRoughness` | `surface.channel.roughness` | `0.28` | Coherent vertical variation of the bed as a fraction of the depth, `0..1`; null on the surface section uses `surface.channel.roughness` |
| `wallRoughness` | `surface.channel.roughness` | `0.24` | Coherent radial variation of the carved walls, `0..1`; null on the surface section uses `surface.channel.roughness` |
| `roughnessWavelength` | `surface.channel.roughnessWavelength` | `11` | Wavelength in blocks of the bed and wall variation, `3..128`; null on the surface section uses `surface.channel.roughnessWavelength` |
| `radialBase` | `0.86` | `0.86` | Base radial scale of the organic outline before the lobes are added, `0.4..1.2`; `1` keeps the nominal radius and lower values carve a narrower passage |
| `radialMinimum` | `0.58` | `0.58` | Narrowest the outline may pinch after the lobes, as a fraction of the nominal radius, `0.2..1` |
| `radialMaximum` | `1.18` | `1.18` | Widest the outline may bulge after the lobes, as a fraction of the nominal radius, `1..2` |
| `primaryLobeStrength` | `0.08` | `0.08` | Strength of the broad lobes that bulge and pinch the outline along its length, `0..0.5`; `0` leaves the outline circular |
| `detailLobeStrength` | `0.06` | `0.06` | Strength of the fine lobes layered over the broad ones for small-scale wall detail, `0..0.5` |
| `ceilingRoughness` | `0` | `0` | Coherent variation of the carved ceiling height as a fraction of the headroom, `0..1`; `0` keeps the ceiling smooth and evaluates no extra noise |
| `aspectMinimum` | `0.62` | `0.62` | Narrowest plan aspect of a chamber, the short axis as a fraction of the long axis, `0.2..1`; `1` makes every chamber circular in plan |
| `aspectRange` | `0.2` | `0.2` | How far the plan aspect may vary above `aspectMinimum` from one chamber to the next, `0..0.8`; `0` gives every chamber the same aspect |

`aspectMinimum` and `aspectRange` are read for grotto chambers only, and `ceilingRoughness` for carved passages and chambers. The surface section carries all three so that the three sections share one shape, but an exposed river has no carved roof and no chamber plan for them to act on.

#### `geometry.drops`

| Field | Default | Purpose |
|-------|---------|---------|
| `cascadeRunPerBlock` | `2` | Preferred horizontal cascade run per block of head loss, `1..16` |
| `cascadeExponent` | `1.4` | Exponent of the graded cascade profile, `0.25..6`; above `1` it accelerates toward the receiver |
| `maximumCascadeStep` | `2` | Largest head loss between adjacent underground drop faces, `1..4`; exposed cascades always use one-block steps |
| `flowWidthRatio` | `0.45` | Drop-flow width as a fraction of the connected channel width, `0.25..1` |
| `maximumFlowDepth` | `2` | Largest wetted depth along a descending flow path, `1..16` |
| `basinWidthRatio` | `1.8` | Receiving-basin width as a fraction of the descending flow width, `1..4` |
| `maximumBasinDepth` | `8` | Largest receiving-basin depth after drop-scaled erosion, `1..32` |
| `undergroundCascadeRunPerBlock` | `0` | Horizontal run in blocks an underground drop spreads over per block of head loss, `0..16`, so a tall drop becomes a long cascade instead of a single face; `0` keeps every underground drop at its shortest run |

### `hydrology.rivers.surface`

`surface.enabled` controls only exposed, terrain-following courses. It does not control the independent underground or deep-fluid budgets.

#### `surface.sources`

| Field | Default | Purpose |
|-------|---------|---------|
| `density` | `0.5` | Expected surface sources per plan tile, `0..64` |
| `minimumElevation` | `88` | Minimum absolute world Y for a surface source, `-2048..2048` and below the dimension maximum |
| `minimumPerTile` | `0` | Source quota enforced only when a qualifying `REQUIRED_HEADWATER` policy candidate can reach a legal outlet, `0..64` |
| `minimumSpacing` | `384` | Minimum separation between natural surface headwaters, `0..8192`; required headwaters may override it |

#### `surface.channel`

The channel is the wet part of the river. Its cross-section is a broad bowl: nearly level across the middle of the width, then curving up into the banks.

| Field | Default | Purpose |
|-------|---------|---------|
| `width` | `4..8` | Wet channel width in blocks, endpoints in `1..64`; resolved along the course, so a river widens and narrows as it goes |
| `depth` | `2..4` | Water depth at the channel center, endpoints in `1..32` |
| `sink` | `0` | How far the water surface sinks below the lowest natural ground beside the channel, `0..3`; `0` keeps the water flush with the ground, and the bank beside the water always meets it at its own height |
| `maximumIncision` | `10` | Deepest cut the channel may make into a hillside before the course is rejected, `1..32` |
| `roughness` | `0.25` | Strength of the coherent wobble applied to the channel outline, `0..1`; `0` gives a perfectly smooth outline |
| `roughnessWavelength` | `16` | Wavelength of that wobble in blocks, `4..64` |
| `springWidthRatio` | `2.5` | Width of the spring pool at the headwater relative to the channel width, `1..4`; `1` starts the river at its normal width |
| `springLength` | `24` | Blocks over which the pool narrows back to the channel, `4..96` |
| `smoothingRadius` | `16` | Stations along the course the sampled width and depth are averaged over, `0..64`, so the channel changes size gradually; `0` follows the sampled values exactly at every station |
| `outlineMinimumRatio` | `0.6` | Narrowest the roughened waterline may pinch, as a fraction of the channel half-width, `0.2..1`; `1` stops the outline from ever narrowing below the nominal width |
| `outlineMaximumRatio` | `1.4` | Widest the roughened waterline may bulge, as a fraction of the channel half-width, `1..3`; `1` stops the outline from ever widening beyond the nominal width |
| `springExtraDepth` | `1` | Extra bed depth in blocks at the headwater spring, fading to nothing over `springLength`, `0..8`; `0` keeps the spring pool as deep as the channel |

#### `surface.banks`

The banks are everything the river erodes outside the wet channel. Their shape follows the depth of the cut, so a river crossing flat ground makes a shallow dip and a river crossing a hillside makes a real valley.

| Field | Default | Purpose |
|-------|---------|---------|
| `shoreWidth` | `1.5` | Width of the flattened shore bench beside the water, cut level with the bank top, `0..16` blocks; it is also the default width of the shore biome band, and `0` removes the bench so the eroded valley side begins at the waterline |
| `shoreRise` | `0` | Blocks the bench rises from the waterline to its landward edge, `0..4`, so the beach climbs instead of lying level; `0` keeps a flat bench, and the valley side starts from the raised edge |
| `blendSlope` | `3` | Horizontal run per block of rise from the bank top back to natural terrain, `0.5..12`; the blend width is `cut x blendSlope` |
| `blendBaseWidth` | `0` | Blocks added to every valley width before the blend limits apply, `0..32`, so even a shallow cut erodes this far beyond the shore; `0` leaves the width proportional to the cut alone |
| `minimumBlendWidth` | `4` | Narrowest blend band even for a shallow cut, `1..maximumBlendWidth` |
| `maximumBlendWidth` | `32` | Widest blend band even for a deep cut, up to `64`; this also bounds how far a river can affect terrain from its centerline |
| `exposeCutStrata` | `true` | Show the biome's deeper layers on eroded banks instead of repeating the surface layer, so a cut through grassland shows dirt and stone |
| `shoreMaterial` | disabled | Palette painted over the shore bench columns instead of the biome's own layers; `enabled`, a `palette` of solid blocks and a `depth` of `1..8` layers |
| `bankMaterial` | disabled | Palette painted over the eroded bank columns outside the bench instead of the biome's own layers; same three fields |

`bankMultiplier` in a region or biome policy scales `blendSlope` locally: values below `1` make steeper, narrower valleys and values above `1` make wider, gentler ones. `riverPolicy.shoreWidth` replaces `shoreWidth` per area, so one region can carry a wide bench and a biome inside it none.

`shoreMaterial` and `bankMaterial` paint over the layers the shore and bank biomes would otherwise supply, down `depth` blocks from the surface, and change nothing while `enabled` is `false`. The bed padding rule still runs after the paint, so a falling block from one of these palettes is replaced by `bed.paddingPalette` unless `bed.allowGravityBlocks` is set. Content that should vary with the surrounding terrain belongs in `shoreBiomes` or `bankBiomes` instead; these palettes are for one fixed material along every river in the dimension.

#### `surface.erosion`

Erosion shapes the valley the banks describe. The reach of the valley comes from `banks.blendSlope` and the blend widths; these fields shape what happens inside that reach. The defaults reproduce the valley Iris has always cut, so a pack that omits the section changes nothing.

| Field | Default | Purpose |
|-------|---------|---------|
| `enabled` | `true` | Erode the ground beyond the shore band into a valley; `false` keeps only the wet channel, the shore band and the bank that holds the water |
| `smoothingRadius` | `12` | Stations along the course the blend width is averaged over, `0..64`, so the valley widens and narrows gradually; `0` follows the local cut exactly |
| `thalwegFraction` | `0.45` | Share of the channel half-width that stays at full bed depth before the bed rises to the edge, `0..0.95`; higher is a flatter, broader bed |
| `blendCurve` | `1` | Exponent on the blend from the bank top out to natural terrain, `0.25..4`; below `1` hollows the valley sides, above `1` keeps them steep near the shore and eases them out further away |
| `bedNoise` | `0.5` | Share of `channel.roughness` applied to the bed as depth variation, `0..2`; `0` leaves a smooth bed |
| `style` | `SMOOTH` | Shape of the valley side between the shore bench and natural terrain; `SMOOTH`, `LINEAR`, `CONCAVE`, `TERRACED` or `CLIFF`, described below |
| `terraceSteps` | `4` | Number of level steps the valley side is cut into when `style` is `TERRACED`, `2..16`; ignored by every other style |
| `cliffFraction` | `0.5` | Share of the eroded band kept level at the bank top before the vertical wall when `style` is `CLIFF`, `0..1`; ignored by every other style |
| `bedProfile` | `BOWL` | Cross-section of the wet channel bed from the centerline out to the waterline; `BOWL`, `FLAT`, `V` or `U`, described below |

`riverPolicy.erosion` turns the valley off for one area without touching the rest of the dimension: a river crossing it keeps its channel and its shore bench and leaves the ground beyond them alone.

#### `surface.ponds`

Every surface river rises from a round pond and, when it ends inland, drains into one. A pond is a bowl holding the river's water level at that end, with the same shore band and eroded rim as the channel. Its radius is chosen per river within the configured range and shrinks where the ground around the rim falls below the water, so a pond never sits above the bank that has to hold it; where even the smallest radius does not fit, the river simply starts or ends as a channel. A river that reaches the ocean gets no terminal pond.

| Field | Default | Purpose |
|-------|---------|---------|
| `source.enabled` | `true` | Dig the spring pond at the headwater |
| `source.minimumRadius` | `6` | Smallest spring pond radius in blocks, `1..32` |
| `source.maximumRadius` | `12` | Largest spring pond radius in blocks, `1..32` |
| `source.depth` | `3` | Depth of the spring pond below its water surface at the centre, `1..8` |
| `terminal.enabled` | `true` | Dig the pond a river that ends inland drains into |
| `terminal.minimumRadius` | `4` | Smallest terminal pond radius in blocks, `1..32` |
| `terminal.maximumRadius` | `7` | Largest terminal pond radius in blocks, `1..32` |
| `terminal.depth` | `3` | Depth of the terminal pond below its water surface at the centre, `1..8` |

#### `surface.bed`

The bed is what sits under and beside the water. Falling blocks under a river collapse when a cave, a player or a fluid update touches them, so by default they are replaced.

| Field | Default | Purpose |
|-------|---------|---------|
| `allowGravityBlocks` | `false` | Keep sand, gravel and concrete powder from the biome layers in the bed, shore and eroded banks; set it when you want a gravel river on purpose |
| `padding` | `2` | Blocks below the bed surface that are also kept free of falling blocks, `0..8` |
| `paddingPalette` | clay and dirt | Blocks used in place of falling blocks; any solid palette |
| `material` | disabled | Palette painted over the wet channel bed under the water instead of the biome's own layers; `enabled`, a `palette` of solid blocks and a `depth` of `1..8` layers |

Without `material`, `banks.shoreMaterial` and `banks.bankMaterial`, the river channel keeps the layers of the channel biome (`surfaceBiomes`), the shore keeps `shoreBiomes` and the eroded bank keeps `bankBiomes`, and the bed rule only swaps the blocks that would fall. A biome override remains the way to make a river bottom or beach follow the terrain it crosses; the three material palettes are the way to give every river in the dimension the same bed, shore or bank blocks regardless of biome. Both routes may be used together: the palette wins for its top `depth` layers and the biome supplies everything below.

#### `surface.flow`

Water heads only ever descend. Each step downstream is at most one block unless the terrain forms a cliff.

| Field | Default | Purpose |
|-------|---------|---------|
| `cascadeRun` | `2` | Horizontal blocks per one-block head drop before a reach is labelled rapids rather than a pool, `1..8` |
| `waterfallMinimumDrop` | `6` | Smallest natural cliff, in blocks between adjacent stations, that produces a single-step waterfall drop, `2..32` |
| `waterfallThalwegFraction` | `0.65` | Share of the half-width that stays at full bed depth in the carved throat of a waterfall or cascade before the bed rises to the edge, `0..0.95`; higher is a flatter, broader throat |
| `plungeBasinMinimumDrop` | `2` | Smallest drop in blocks that scours a plunge basin into the bed below it, `1..8`; shorter drops leave the bed untouched |
| `plungeBasinLengthRatio` | `2` | Length of the basin downstream of a drop as a multiple of the channel half-width, `0..8`, never shorter than two stations |
| `plungeBasinDepth` | `1` | Extra bed depth in blocks scoured inside a plunge basin, `0..8`; `0` marks the basin without deepening it |

#### `surface.mouths`

| Field | Default | Purpose |
|-------|---------|---------|
| `flareRatio` | `1.6` | Channel width at the coast relative to the width upstream, reached over the inlet, `1..4` |
| `maximumOceanApron` | `8` | Maximum non-owning accepted connection apron in ocean columns, `0..32` |
| `inletLength` | `64` | Blocks of river before the coast held at sea level and widened toward `flareRatio`; `0` ends the river at the shoreline with no inlet, `0..256`, never more than `routing.minimumSurfaceCourseLength` |
| `inletDepth` | `3` | Extra bed depth reached at the shoreline over the inlet, so the estuary is deeper than the river above it, `0..16` |
| `maximumIncision` | `32` | Deepest cut allowed in the inlet and its approach ramp, replacing `channel.maximumIncision` there, so the coast may be cut down to sea level through a rise of this height; a taller rise ends the inlet where it starts, `0..128` |
| `inletCourseFraction` | `0.5` | Largest share of the river's exposed course the drowned inlet may occupy, `0.05..1`, so a short river keeps most of its length above sea level; the inlet is the shorter of `inletLength` and this share |
| `inletRampSlope` | `1` | Blocks of head gained per station on the approach ramp climbing from the inlet back to the river's natural profile, `0.1..4`; `1` climbs one block per station and higher values grade the approach faster |

An ocean apron owns no terrain, fluid, shore, or bank writes. It records the accepted connection for rendering and inspection while the ocean reservoir remains authoritative. The inlet is the drowned end of the river: over `inletLength` blocks its water is sea level, its channel grows to `flareRatio` times the river width and its bed sinks `inletDepth` below the river bed, and the banks beside it are cut to sea level and eroded back up to the natural valley. The inlet reaches inland from the shoreline only as far as the ground can be cut to sea level within `maximumIncision`: on a low coast it runs the full `inletLength`, against a bluff it stops at the foot of the bluff, and on a cliff coast there is no inlet and the river falls into the sea as before. It never takes more than `inletCourseFraction` of a river's exposed course, so the headwater always keeps its natural head. Above the inlet the water grades down `inletRampSlope` blocks per station over half the inlet length wherever that cut fits, so a river on a coastal plateau reaches the estuary through rapids rather than a wall. Lower `mouths.maximumIncision` where that approach cuts a deeper gorge than the coast should show.

### `hydrology.rivers.underground`

Underground courses use their own `enabled`, `sources.density`, and `sources.minimumPerTile`. Their minimum is likewise a `REQUIRED_HEADWATER` quota, and a rejected or absent surface source does not consume the underground budget.

| Field | Default | Purpose |
|-------|---------|---------|
| `sources.density` | `0.25` | Expected underground sources per plan tile, `0..64` |
| `sources.minimumSpacing` | `512` | Minimum separation between natural underground sources, `0..8192` |
| `fluidLevel` | `-48..50` | Absolute world-Y range for underground heads; each endpoint is within `-2048..2048` and the optional style chooses locally |
| `channelWidth` | `3..8` | Contained channel width; endpoints in `1..64` |
| `depth` | `1..3` | Bed depth below the local head; endpoints in `1..32` |
| `headroom` | `6..14` | Dry space above the local head; endpoints in `1..128` |
| `connectToExistingCaves` | `true` | Lets accepted dry headroom open into suitable existing cave matter where the two touch; the course does not require a pre-existing cave |
| `mouthLevelingDistance` | `64` | Landward distance over which an underground mouth levels into the sea, `16..512` and no greater than the route length |
| `tributaries` | `1` | Extra underground courses an outlet may accept as tributaries joining its main passage, `0..4`, budgeted on top of `sources.density`; a tributary passage is cut where its route first shares the stem's drainage and solved with the stem's fluid level there as its outlet level |
| `minimumRockCover` | `1` | Blocks of solid rock kept between the top of a passage's headroom and the surface above it, `1..64`; a passage that cannot keep this much cover is lowered, and rejected if it cannot be lowered far enough |
| `minimumFloorCover` | `1` | Blocks of solid rock kept between the bottom of a passage's bed and the world floor below it, `1..32` |
| `wideningSources` | `8` | Number of joined tributary sources at which a passage reaches its full sampled width, `1..64`; fewer contributing sources carve a proportionally narrower passage, and `1` gives every passage its full width |
| `bedMaterial` | disabled | Palette painted over the floor layers under an underground river instead of the cave biome's own layers; `enabled`, a `palette` of solid blocks and a `depth` of `1..8` layers |

Fluid level, depth, basin depth, and headroom must fit strictly inside `dimensionHeight`. Underground heads remain non-rising downstream, but each routed point resolves its preferred fluid level before the non-rising constraint is applied, so a course can occupy multiple level terraces rather than one globally flattened height. Drops become narrow graded `UNDERGROUND_DROP` features with receiving basins; level runs become `UNDERGROUND_POOL`.

Ordinary underground runs are compiled as continuous course-aligned passages. Their deterministic irregular outline is evaluated against the nearest centerline position, and the cross-section uses an arched ceiling and bowl-shaped bed with coherent longitudinal variation bounded by the configured depth and headroom. `geometry.underground` and `geometry.grottos` set the bed, wall and outline shape of those passages and chambers, and `geometry.drops` shapes underground drops, sinkholes and receiving basins.

### Grottos

`grottos.coastal` and `grottos.inland` have separate admission and geometry:

| Field | Coastal default | Inland default | Contract |
|-------|-----------------|----------------|----------|
| `enabled` | `true` | `true` | Allows this outlet chamber type |
| `poolLevel` | `SEA_LEVEL` | not present | Coastal value must be `SEA_LEVEL` |
| `connectSurfaceRivers` | not present | `false` | Lets eligible surface courses continue through an explicit falling sinkhole into the contained pool; requires the inland grotto and `SINKHOLE_GROTTO` routing outlet |
| `horizontalRadius` | `12` | `10` | `1..128` |
| `verticalRadius` | `7` | `6` | `1..64` |
| `headroom` | `10` | `10` | `1..63` and less than the full chamber height |
| `maximumVolume` | `8192` | `8192` | `1..1048576` distinct accepted mutation positions owned by that grotto segment |
| `cliffMinimumHeight` | unset | not present | Blocks the coast must stand above the sea at the outlet for a river to end in a coastal grotto instead of an open mouth, `0..128`; unset uses the larger of `4` and `verticalRadius` |
| `cliffSlopeFactor` | `0.5` | not present | Share of `cliffMinimumHeight` the coast's slope must reach at the outlet before a grotto is chosen over an open mouth, `0..4`; `0` ignores the slope and decides on height alone |

A coastal grotto is admitted only at a proven coastal land/ocean boundary, either as the outlet of a river or as a standalone sea cave. Its pool is at sea level, and its ocean face is the only opening: the chamber is roofed and walled by the coast everywhere else, and its ocean apron reaches at least `horizontalRadius` from the chamber and covers every sea column beside a chamber column, so the whole sea face is an accepted opening rather than a breach of containment. An inland grotto is available only when `routing.inlandOutlets` includes `SINKHOLE_GROTTO`. Within each transit-connected routing component, proven ocean mouths and coastal grottos have priority only when their sea-level connection fits the requesting course's legal head range. An underground course whose maximum head is below sea level receives an inland grotto plan instead of being routed to an impossible coastal outlet.

When `grottos.inland.connectSurfaceRivers` is `true`, an eligible surface source keeps one course through a `SINKHOLE` falling throat and into its terminal `INLAND_GROTTO` receiving pool. The sinkhole starts at the final surface centerline cell, narrows by at most one configured block at the contained throat, and keeps fluid and carving continuous into the receiving chamber. The accepted link includes dry headroom and is validated and published as one containment transaction. When the field is `false`, surface sources cannot route to inland grotto outlets, while independently sourced underground courses remain eligible for them.

Both forms are bounded, contained features. `maximumVolume` bounds the grotto segment itself; an attached underground course or surface sinkhole remains part of the same all-or-nothing containment transaction without counting its non-grotto positions against that cap.

#### Sea caves

`grottos.coastal.seaCaves` plans coastal grottos that need no river: the sea itself opens into the coast. Every owned shoreline point on a tile is a site. Sites are ranked by how high the coast stands over the sea, so cliffs are taken before low shores, and each accepted site becomes its own `COASTAL_GROTTO` course: the chamber ellipsoid is swept `depth` blocks inland from the shoreline with the water at sea level, `verticalRadius` of flooded floor below it, `headroom` of air above it, and the open sea as its mouth. Sea caves keep clear of every river mouth and grotto already planned on the tile, and the chamber size, headroom and `maximumVolume` are the coastal grotto's own. A sea cave needs `grottos.coastal.enabled` as well as `seaCaves.enabled`.

| Field | Default | Contract |
|-------|---------|----------|
| `enabled` | `true` | Plan sea caves along the coast |
| `maximumPerTile` | `3` | `0..64` sea caves accepted per planning tile; the steepest owned coast is taken first |
| `minimumSpacing` | `160` | `16..8192` blocks between two sea caves, and at least twice `horizontalRadius` |
| `minimumCoastHeight` | `8` | `1..128`; the coast must stand this many blocks above the sea at the shoreline, at the back of the chamber and along its flanks |
| `depth` | `12` | `0..128` blocks the chamber is swept inland from the shoreline; `0` leaves a single chamber at the shore |
| `sweepJitterDegrees` | `25` | `0..90`, the largest angle the inland sweep may turn away from straight inland, chosen per cave; `0` sweeps every sea cave straight in from the shore |

A site that fails a rule is reported as an `OUTLET` candidate of type `COASTAL_GROTTO` in the tile diagnostics: `SURFACE_HEAD_RANGE` for a coast that is too low, `SOURCE_SPACING` for a site too close to another sea cave or to a river outlet, `VOLUME_LIMIT` when the swept chamber cannot fit `maximumVolume`, `SOURCE_QUOTA` once the tile has its `maximumPerTile`, and `CAVE_CONTAINMENT` when the chamber would break out of the coast anywhere but its ocean face.

### River profiles

`hydrology.rivers.profiles` is an array of at most 64 objects:

```json
{
  "profiles": [
    {
      "id": "water",
      "fluidPalette": {
        "palette": [{"block": "minecraft:water"}]
      }
    }
  ]
}
```

Each `id` is unique and each `fluidPalette` must resolve to at least one fluid block. Policies reference profile IDs. If the effective policy profile list is empty, the runtime selects the first configured river profile. Omitting `hydrology.rivers` still materializes its implicit `default` profile, so a deep-fluid entry may not use `default` as its ID. Fluid is resolved from the accepted layer profile with `resolveHydrologyFluid(profileKey, x, z)`; the dimension ocean `fluidPalette` does not replace it.

### `hydrology.deepFluids`

Deep fluids are independent of both river source budgets and do not join the surface drainage graph. Each entry has:

| Field | Purpose |
|-------|---------|
| `id` | Unique deep-fluid profile ID; it cannot duplicate a river profile ID or a built-in locator selector |
| `fluidPalette` | Fluid-only palette for this deep feature |
| `height` | Styled absolute world-Y range; endpoints in `-2048..2048` |
| `density` | Expected sites per tile, `0..64` |
| `spacing` | Site lattice spacing, `16..8192` |
| `horizontalRadius` / `verticalRadius` | Contained pool envelope, respectively `2..128` and `2..64` |
| `channelWidth` / `depth` / `headroom` | Short-channel and interior geometry, respectively `1..32`, `1..32`, and `1..63` |
| `containedPools` | Enables `DEEP_POOL` features |
| `shortChannels` | Enables `DEEP_CHANNEL` features |

Spacing must contain the complete horizontal footprint, depth plus headroom must fit inside the vertical diameter, and the height envelope must fit inside the dimension. A short channel has no separate authored length: its maximum length is `spacing / 3`, capped to half `routing.tileSize`, and its derived containment-volume bound may shorten it further. Contained pools use one connected deterministic multi-lobed basin with an ellipsoid bowl. The managed Overworld uses a denser `deep_lava` entry independently of its water river profile.

### `hydrology.surfacePools`

Standing pools are bowls cut into open ground and filled with their own fluid: lava pools in a badland, a tar pit, a hot spring. They are independent of the river budgets and never touch a river. Each entry has:

| Field | Default | Purpose |
|-------|---------|---------|
| `id` | `lava_pool` | Unique pool id; policies opt in with it and `/iris find river type=<id>` locates it |
| `fluidPalette` | lava | Fluid filling the pool |
| `density` | `0.75` | Expected pools per tile where the policy allows them, `0..64` |
| `spacing` | `384` | Candidate site spacing in blocks, `32..8192`; sites are jittered inside their cell |
| `minimumRadius` / `maximumRadius` | `4` / `7` | Pool radius range in blocks, `2..16` |
| `depth` | `2` | Fluid depth at the centre, `1..8` |
| `biome` | empty | Biome applied to the bowl and its rim; empty keeps the surrounding biome |

A pool is shaped like a river reach with no course: the fluid sits `channel.sink` below the lowest ground around the bowl, the rim holds it level with the ground beside it, the bowl is a broad basin with the configured outline roughness, and the cut blends back out to natural ground the same way a river bank does. A site is skipped where the ground falls away more than `channel.maximumIncision` allows, on or below sea level, where the policy does not list the pool, or within one river width plus the bank blend of an accepted course. The bed padding rule applies to pools as well.

```json
{
  "surfacePools": [
    {
      "id": "lava_pool",
      "fluidPalette": {"palette": [{"block": "minecraft:lava"}]},
      "density": 0.75,
      "spacing": 384,
      "minimumRadius": 4,
      "maximumRadius": 7,
      "depth": 2
    }
  ]
}
```

## `riverPolicy`

The effective policy is resolved in this order:

1. dimension
2. selected region
3. selected natural biome

A non-null field at the later scope replaces the inherited value. Omitted or `null` fields inherit. An explicitly empty array clears an inherited profile or biome pool.

```json
{
  "riverPolicy": {
    "placement": "PREFERRED_HEADWATER",
    "routing": "ALLOW",
    "outletAdmission": true,
    "profiles": ["water"],
    "surfaceBiomes": ["tundra/sea/river"],
    "mouthBiomes": ["ocean/deep"],
    "shoreBiomes": ["tundra/shore/snow"],
    "bankBiomes": ["tundra/frosted-peaks"],
    "floodedCaveBiomes": ["carving/ice-cave"],
    "surfacePools": [],
    "widthMultiplier": 0.8,
    "depthMultiplier": 1.1,
    "routingMultiplier": 0.7,
    "bankMultiplier": 1.5,
    "shoreBiomeWidth": 6,
    "shoreWidth": 4,
    "erosion": true,
    "confined": false
  }
}
```

### Placement and routing modes

| `placement` | Source and transit behavior |
|-------------|-----------------------------|
| `DISABLED` | No source, transit, or outlet through this policy area |
| `TRANSIT_ONLY` | May carry an accepted route but cannot begin one |
| `NATURAL` | Ordinary deterministic source admission |
| `PREFERRED_HEADWATER` | Eligible source sites receive higher priority |
| `REQUIRED_HEADWATER` | Enforces a deterministic minimum when a qualifying site can reach a physically legal outlet |

| `routing` | Route behavior |
|-----------|----------------|
| `BLOCK` | Prohibits transit |
| `AVOID` | Adds a strong route cost |
| `ALLOW` | Uses ordinary terrain-guided cost |

`outletAdmission` is a nullable Boolean independent of transit. `false` prevents a coastal or inland outlet from being anchored in that policy area without necessarily blocking a course through it.

A viable `REQUIRED_HEADWATER` policy site intrinsically requests at least one source. `sources.minimumPerTile` may raise that required quota and may override ordinary source spacing when enough policy-owned routes remain legal; it does not impose a floor on tiles that contain only natural candidates. Density selects the bounded accepted-source target. When containment or route publication rejects a selected course, Iris tries the remaining admitted candidates until that target is restored or no viable candidate remains.

### Content and geometry fields

| Field | Meaning |
|-------|---------|
| `profiles` | Permitted river fluid-profile IDs |
| `surfaceBiomes` | Content of the wet channel |
| `mouthBiomes` | Sea mouth and coastal-grotto content |
| `shoreBiomes` | Content of the shore band beside the water |
| `bankBiomes` | Content of the eroded bank and valley blend outside the shore; leave it empty to keep the parent biome |
| `floodedCaveBiomes` | Underground, grotto, and deep-fluid content |
| `surfacePools` | Standing pool ids from `hydrology.surfacePools` allowed in this area; an empty list disables them |
| `widthMultiplier` | Channel-width scale, greater than zero through `16` |
| `depthMultiplier` | Channel-depth scale, greater than zero through `16` |
| `incisionMultiplier` | Local scale on `channel.maximumIncision`, `0..16`; it may tighten the permitted cut but cannot exceed the configured maximum |
| `routingMultiplier` | Local route-cost scale, `0..64` |
| `bankMultiplier` | Local scale on `banks.blendSlope`, `0..4` |
| `shoreBiomeWidth` | Width in blocks of the shore biome band beside the water, `0..32`; unset areas use `banks.shoreWidth` |
| `shoreWidth` | Width in blocks of the flattened shore bench beside the water, `0..16`; unset areas use `banks.shoreWidth`, and `0` starts the eroded valley side at the waterline |
| `erosion` | `false` stops rivers eroding a valley in this area, leaving only the channel and the bench; unset areas follow `surface.erosion.enabled` |
| `confined` | `true` keeps rivers inside this region (or biome): see below |

`shoreBiomeWidth` sizes the band of `shoreBiomes` content beside the water for one area without touching the geometry: the flattened shore and the eroded valley keep following `banks.shoreWidth` and the bank settings, while the shore biome reaches as far as the policy says, over untouched ground when the band is wider than the valley, and not at all when it is `0`, which leaves the geometric shore with the bank biome. A region with wide beaches and a biome inside it with none is two policies. The widest band any policy of the dimension configures is part of the publication envelope, so a very wide band costs planning reach.

`shoreWidth` is the geometry the band sits on: the flattened bench cut level with the bank top. It is the same measurement as `banks.shoreWidth` and replaces it for one area, so a desert region can be given a four-block beach while a jungle biome inside it is given none and its valley side starts at the waterline. The two fields are independent: a wide `shoreWidth` with `shoreBiomeWidth` at `0` gives a broad bench made of the bank biome, and a narrow `shoreWidth` with a wide `shoreBiomeWidth` gives a thin bench with shore content running out over untouched ground. Like the biome band, the widest bench any policy of the dimension configures widens the publication envelope, so a wide bench costs planning reach.

`erosion` is the per-area form of `surface.erosion.enabled`. Where it resolves to `false`, a station's valley band is dropped entirely: the river crosses the area in a bare cut with its channel and its bench and nothing beyond them, and the terrain outside the bench keeps its natural height. Everything else about the course is unchanged, so a river may erode a valley across one region and cross the next in a slot.

`confined` turns an area into a closed drainage basin. A course whose source lies in a confined region keeps its whole route inside that region, up to and including its outlet: a sea it reaches must lie in the same region, an inland outlet must sit inside it, and a source with no outlet reachable inside the area is rejected with the `CONFINED_NO_OUTLET` diagnostic instead of borrowing an outlet elsewhere. Set on a biome, the confines are that biome. The rule is enforced on the routing lattice and on the refined route between lattice nodes, so a course follows the area boundary to the resolution of `routing.sampleSpacing` and its refinement, and it applies to underground courses as well. Water that enters a confined area from outside stays there too: an unconfined river may flow into a confined region, but from that point it must end at one of the region's own outlets, so an area with no outlet also blocks rivers from passing through it.

The planner selects and stores the exact profile and biome keys in each accepted column layer. Later generation stages do not reselect them. Referenced biomes, their children, and carving references join the active dimension reachable closure, so retained river-only surface content is available to biome find/goto commands.

## How the planner works

For each bounded hydrology tile Iris:

1. samples natural height, slope, ocean classification, cave suitability, and effective policy on the coarse lattice;
2. selects up to `maximumCoastalOutletsPerTile` sea outlets from the coast, the tile's own shoreline before a neighbour's and mouths and coastal grottos in turn, then up to `maximumOutletsPerTile` permitted inland grottos for the ground no coast can drain; the two budgets are independent, and a sea outlet an underground river cannot reach because the sea sits above `underground.fluidLevel` is reported as `OUTLET_LEVEL`;
3. builds one acyclic drainage potential toward accepted outlets;
4. admits surface and underground sources from separate budgets;
5. routes toward valleys using `valleyPreference`, `uphillPenalty`, `slopePenalty`, policy cost, and `confluenceAttraction`; a surface route never climbs more than the cut the channel may make (`channel.maximumIncision` less the inset and depth) between two lattice samples, so ground behind a ridge drains to an inland grotto instead of an impossible sea mouth;
6. refines each accepted coarse route into a terrain-following centerline with the configured meanders;
7. shapes every surface course as a valley (below) and every underground course as a contained passage;
8. compiles exact terrain, fluid, shore, bank, biome, cave, render, and locator footprints;
9. validates every course with a subterranean footprint as one containment transaction against authoritative carved mantle matter;
10. prunes any rejected course and publishes the remaining immutable `HydrologyTile`.

The tile contains sorted drainage nodes, edges, outlets, courses, features, accepted cave actions and baseline preconditions, and a `RiverFootprint`. Surface and underground courses are grouped by outlet before publication; the longest viable route becomes the outlet's main stem and, up to `routing.tributaries` (surface) or `underground.tributaries` (underground), the next longest routes to the same outlet become its tributaries. A surface tributary is cut where its centerline first comes within a stem width of the stem or first enters drainage the stem already owns, joins the lowest stem water it can reach there, and is graded down to the river's level where the two channels touch, so its mouth sits at the river's level and never above the stem's shore; a tail that arrives up to three blocks below the stem backs up to the stem's level as a still reach, a deeper shortfall slides the junction downstream to the first stem station whose water is low enough and the course is shaped again, and the last hop onto the stem is graded like any in-course drop; an underground tributary is cut at the first node its route shares with the stem's and solved to the stem's fluid level there. A tributary owns only the drainage upstream of its junction, so the stem's discharge and width below the junction include it. A later draft that cannot be joined (no junction within reach, too short a reach, or arriving below the stem) is reported as a `TRIBUTARY` candidate rejection. Every drainage edge lowers potential, so accepted graphs are acyclic.

Before any surface course is published, cross-tile arbitration compares its complete mouth and centerline claim with the bounded owner set. Only the deterministic winning owner may publish an overlapping claim. This prevents tile request order from creating duplicate mouths, stacked main stems, or detached edge fragments.

### How a surface river is shaped

A surface course is shaped in four steps, all of them working on the refined centerline one block at a time.

1. **Channel profile.** Width and depth are resolved at every station from `channel.width` and `channel.depth`, the effective policy multipliers, and the coherent outline wobble from `channel.roughness`. The headwater opens as a spring pool `springWidthRatio` times the channel width and one block deeper, narrowing to the cruise width over `springLength` blocks. Over the last `mouths.inletLength` blocks before a coast the width grows toward `mouths.flareRatio` times the upstream width and the depth grows by `mouths.inletDepth`.
2. **Water head.** For each station the planner reads the natural ground on a ring just outside the channel outline on both banks, takes the lowest bank sample across that station and the two after it, and subtracts `channel.sink`. Heads are then made non-rising downstream: a value that would rise is held at the previous head, and a value that would fall is limited to one block per `flow.cascadeRun` blocks of run unless the pair straddles a natural cliff of at least `flow.waterfallMinimumDrop`, where the head drops by the cliff in one step. Heads inside the inlet are sea level as far inland as the ground can be cut to sea level within `mouths.maximumIncision`, and the reach above it, half the inlet length long, grades down one block per station into the inlet wherever that cut fits. A station whose head would need a cut deeper than `channel.maximumIncision` rejects the course, except in the inlet and its approach, where `mouths.maximumIncision` is the limit; there are no bores under ridges for surface rivers, so a route that cannot stay open on the surface is not published.
3. **Erosion field.** Every column near the centerline receives a target height. Inside the channel the target is the bed below the head, shaped by `erosion.bedProfile`. The bank top on both sides sits at `head + channel.sink`, so with the default sink the ground beside the water is level with its surface. The shore bench runs from the waterline out to `banks.shoreWidth`, or to `riverPolicy.shoreWidth` where the area sets one, climbing `banks.shoreRise` blocks over that distance. From the landward edge of the bench the target rises back to the natural height across a blend band whose width is `cut x banks.blendSlope + banks.blendBaseWidth`, clamped to `minimumBlendWidth..maximumBlendWidth`, where `cut` is how far the bench edge sits below natural ground at that station, and the shape of that rise is `erosion.style`. The published terrain is `min(natural, target)`: the field only ever lowers ground. Water is published only where the bed sits below the head and the surrounding bank tops contain it.
4. **Labels.** Each reach is labelled from its head gradient: a level reach is a `SURFACE_POOL`, a single one-block step is a `RIFFLE`, consecutive one-block steps are a `CASCADE`, and a cliff-sized step is a `WATERFALL`. Labels do not change the geometry; they drive Vision, locators, and rendering.

The head is derived from the banks rather than the centerline so a river running along a hillside is cut into the slope with the bank on the uphill side, instead of sitting on a shelf above the downhill side. Because every step is one block, a river descending a hill leaves no chips, ledges, or floating water. Because the blend width follows the depth of the cut, a shallow crossing of flat ground erodes only a few blocks either side, while a deep cut through a ridge opens into a wide valley.

`erosion.style` decides the shape of the valley side across the blend band. `SMOOTH` is an eased S-curve, flat at the shore and at the top and steepest across the middle, and it is the shape Iris cut before the field existed. `LINEAR` is a straight slope with a sharp shoulder at the shore and a sharp lip at the top. `CONCAVE` climbs fast beside the shore and flattens toward natural terrain, hollowing the valley. `TERRACED` cuts the eased curve into `terraceSteps` level steps. `CLIFF` holds the band level at the bank top for `cliffFraction` of its width and then rises in one vertical wall. `blendCurve` skews all of them except `CLIFF`.

`erosion.bedProfile` decides the cross-section of the wet bed. `BOWL` holds full depth over `thalwegFraction` of the half-width and eases up to a one-block edge, and it is the profile Iris cut before the field existed. `FLAT` holds full depth to the waterline, so the channel edge drops straight to the bed. `V` slopes straight from full depth at the centerline to one block at the edge and ignores `thalwegFraction`. `U` holds the thalweg deep almost to the edge and then rises steeply, giving a trough with steep sides.

When `banks.exposeCutStrata` is `true`, eroded bank columns use the biome layer that would naturally sit at that depth, so a cut through grassland shows dirt and then stone rather than repeating the surface layer down the whole bank.

Each accepted column layer records its exact `bedY`, `fluidHeadY`, `ceilingY`, ownership flags, connected/falling/receiving state, profile key, and selected content keys. `IrisComplex` uses that footprint for final terrain height, surface biome, and fluid selection. Cave and decorator stages consume the same ownership rather than estimating a channel from nearby coordinates.

The runtime exposes accepted-plan queries through `IrisHydrologyRuntime.sample(x, z)`, `renderSample(x, z)`, `tile(HydrologyTileKey)`, and `nearestFeature(...)`. Column and render queries compose overlapping immutable tile footprints before returning the final sample. The plan cache is bounded to 64 tiles.

## Accepted feature types

| Feature | Meaning |
|---------|---------|
| `SURFACE_POOL` | Level exposed reach |
| `RIFFLE` | A single one-block step |
| `CASCADE` | Rapids: consecutive one-block steps |
| `WATERFALL` | A single drop across a natural cliff of at least `flow.waterfallMinimumDrop` |
| `SINKHOLE` | Falling surface-to-underground throat into a contained inland grotto pool |
| `UNDERGROUND_POOL` | Level independently sourced cave river |
| `UNDERGROUND_DROP` | Required descending underground transition |
| `COASTAL_GROTTO` | Sea-level contained coastal chamber, at a river outlet or as a standalone sea cave opening from the ocean |
| `INLAND_GROTTO` | Permitted sinkhole outlet chamber |
| `MOUTH` | Surface or underground connection into the ocean reservoir |
| `DEEP_POOL` | Independent contained deep-fluid pool |
| `DEEP_CHANNEL` | Independent short deep-fluid channel |
| `STANDING_POOL` | Independent standing surface pool |

Feature references also carry stable feature, course, and segment IDs, coordinates, flow direction, and a source marker. Vision and locator commands consume these accepted references.

## Terrain, oceans, caves, and decoration

### Surface shaping and banks

Every surface write is carve-only: no column is ever raised above its natural height, whether by the channel, the shore, or the bank blend. Every dry column touching water is kept at or above the water surface plus `channel.sink`, never above its natural height, so water only ever meets solid ground at its own level and never spreads. Where the natural ground beside the channel is already lower than the intended bank top, the planner lowers the head instead of building a bank, so the river always follows the land down.

The post-generation passes that place slabs, fill potholes, remove floating nibs, and dress walls skip every column inside a river footprint and its immediate neighbours, so the channel, shore and bank blend are published exactly as planned. Automatic surface object placement is rejected when any transformed support column intersects an accepted river channel or shore band, even with `forcePlace`, `underwater`, or `onwater`; this stops biome and region scatter from bridging a channel or standing in the shore. Explicit-Y object placement, including `/iris object paste`, remains available for intentional authoring inside a river.

The shore bench beside the water is `banks.shoreWidth` wide, or `riverPolicy.shoreWidth` where the area sets one, and it rises by `banks.shoreRise` from the waterline to its landward edge. Its content comes from `shoreBiomes` out to `riverPolicy.shoreBiomeWidth`, which is a separate band and may be wider or narrower than the bench. The bank blend uses `bankBiomes` when the policy sets it and otherwise keeps the natural parent biome, so decorators and surfaces there stay consistent with the surrounding land. `banks.shoreMaterial`, `banks.bankMaterial` and `bed.material` paint over the top layers of the bench, the bank and the channel bed when they are enabled, ahead of whichever biome supplied them. The final channel width and depth include the effective region and biome multipliers and vary continuously along the course.

### Ocean boundary

The accepted plan resolves the first true natural land/ocean crossing. An exposed river keeps its terrain-supported head and continuous wet channel until the inlet begins, up to `mouths.inletLength` blocks before that crossing, wherever the coast can be cut to sea level within `mouths.maximumIncision`. From there the water is already sea level: the channel broadens through the configured flare, its bed sinks by `mouths.inletDepth`, the shore beside it is cut to sea level and the valley sides are eroded back up to the natural ground, so the sea reads as reaching inland through a drowned valley. At the crossing the ocean reservoir takes over. River-owned terrain and fluid stop on the landward side, with at most `maximumOceanApron` blocks of non-owning accepted connection footprint in the ocean; there are no writes at or below natural sea level and no ocean channel. With `inletLength` at `0` the head instead drops to sea level across the last station. Underground mouths may use `underground.mouthLevelingDistance` to reach sea level.

Ocean classification is conservative: either the route classifier or the sampled natural terrain may veto ownership. Independently of biome classification, any surface column whose natural height is at or below sea level rejects river-owned terrain, fluid, shore content, and bank writes. Only the bounded non-owning mouth apron may remain. These guards apply to exposed hydrology only, so independently contained underground and deep-fluid features remain legal below sea level. A mouth or coastal grotto cannot turn along the coastline, raise the sea, place a wall across it, or excavate an ocean channel.

### Mantle and cave containment

Any active river or deep-fluid configuration requires:

- `useMantle: true`
- `carvingEnabled: true`
- `CARVED` absent from `disabledComponents`
- `RIVER_HYDROLOGY` absent from `disabledComponents`

Before an immutable tile becomes visible, its cave view lazily generates every prerequisite `CARVED` chunk and reads the resulting `MatterCavern` plus any platform fluid state. Iris validates the complete subterranean footprint of each underground course, surface course with a sinkhole continuation, grotto course, and deep-fluid body as one candidate. A surface sinkhole's falling throat, receiving wet pool, and dry headroom therefore succeed or fail with the rest of that same course. An unapproved opening to the surface or another cavern, a world-boundary or volume escape, existing or incompatible fluid, or overlap with a winning plan rejects the entire course; its graph references and footprint are removed before terrain, Vision, or locators can observe it.

Each all-or-nothing cave transaction is limited to 262,144 planned mutation positions across its complete course, including attached non-grotto sections. A larger candidate receives `VOLUME_LIMIT` before Iris materializes cave positions or reads voxel state. The configured grotto `maximumVolume` remains the smaller, feature-specific chamber limit.

An accepted cave plan stores every bed, wet source, falling throat, dry-headroom, and seal-guard action together with the exact baseline cave preconditions used for admission. The mantle pass rechecks all relevant preconditions before compiling a chunk and publishes nothing from that chunk when any check differs, so it cannot write a partial local subset after its proof becomes invalid. When `connectToExistingCaves` is enabled, a planned dry boundary may open into suitable cave air without exposing the wet volume. Hydrology-owned cells and seal guards remain protected from later object or structure writes that would break containment; the cave network never becomes a shared reservoir. Dry headroom above an underground river uses the `floodedCaveBiomes` content of the course.

### Decorators and freezing

River decorators use the final accepted connected-fluid state. Shore-line and sea-surface passes use the accepted local head for a wet river column and the dimension sea level for an ordinary ocean. Rejected waterloggable placements restore their prior block state atomically. A non-water river profile clears waterlogging instead of introducing water into that fluid.

Exposed water is published as ordinary water. The standard exposed-water freezing pass decides where ice forms after hydrology, so frozen rivers do not carry a prebuilt moving surface pattern.

## Vision and feature location

The normal **Biome** view composites accepted surface hydrology content over the natural biome field. The **River network** view reads the accepted feature footprint and labels it `headwater / source`, `surface pool`, `riffle`, `cascade`, `waterfall`, `sinkhole`, `underground pool`, `underground drop`, `coastal grotto`, `inland grotto`, `mouth`, `deep pool`, or `deep channel`. Each accepted headwater carries a compact arrow aligned to the signed X/Z flow vector stored in that accepted feature reference. Rejected candidates use visibly separate `projected source`, `projected outlet`, and `projected deep fluid` colors. The immutable diagnostic plan retains each projected feature type and its rejection reason, while the current Vision legend groups them by candidate kind. They are absent from accepted footprints, biome samples, normal render samples, and locators.

Locate accepted features from an Iris world:

```text
# Bukkit
/iris find river type=surface teleport=false
/iris find river type=waterfall
/iris find river type=sinkhole
/iris find river type=underground
/iris find river type=grotto
/iris find river type=deep_lava

# Fabric, Forge, NeoForge
/iris goto river surface
/iris goto river waterfall
/iris goto river sinkhole
/iris goto river underground
/iris goto river grotto
/iris goto river deep_lava
```

Bukkit optional arguments use Director `key=value`, so the explicit non-teleporting form is `teleport=false`. Supported type selectors are `surface`, `waterfall`, `sinkhole`, `underground`, `grotto`, `coastal_grotto`, `inland_grotto`, `mouth`, `deep`, and `pool`. Any other value is treated as a deep-fluid or surface-pool ID and matches only the deep or standing pool features with that profile. Bukkit and modded completion append the active dimension's configured deep-fluid IDs to those built-ins; `deep_lava` appears only when the pack declares it. Built-in selector names are reserved and cannot be deep-fluid IDs.

The search is bounded to the smaller of 8,192 blocks and fifteen routing tiles. It searches accepted immutable plans, not candidate cells, and it has to plan every tile it visits: each ring of tiles is planned together on the hydrology planning pool and the command reports the tile count after every ring, but a feature type the pack rarely produces can still take minutes per ring once the search leaves already-planned terrain. Search for a type the pack actually configures (`/iris pack validate` lists the hydrology coverage a pack reaches) before searching far. `/iris find biome` and `/iris goto biome` remain available for reachable surface river-content biomes.

## Validation

Run the shared pack validator after every hydrology or policy edit:

```text
# Bukkit
/iris pack validate pack=<pack-key>

# Fabric, Forge, NeoForge
/iris pack validate <pack-key>
```

The hydrology validator checks:

- current object types and numeric bounds for every routing, channel, bank, flow, mouth, underground, grotto, and deep-fluid field;
- exact routing divisibility and at most 65,536 coarse lattice nodes;
- complete surface and underground course floors that do not exceed `maximumRouteLength`;
- at least one enabled outlet family;
- canonical inland surface-sinkhole enablement and outlet selection;
- ordered styled ranges and dimension-height fit;
- `minimumBlendWidth` no greater than `maximumBlendWidth`;
- unique river-profile and deep-fluid IDs with nonempty fluid palettes, and no deep-fluid ID that collides with a built-in feature selector;
- deep-fluid spacing, footprint, depth, headroom, and height relationships;
- valid policy enums, nullable Boolean and numeric fields, unique references, and known profile IDs;
- existing biome references, including `bankBiomes`, and the complete reachable policy/child/carving closure;
- required mantle and carving capabilities.

The validator permits at most 64 river profiles, 64 deep-fluid entries, and 128 references in each policy profile or biome list. Validation failure is blocking for world construction, Studio admission, and packaging.

To look at the rivers of a pack without a server, run the probes with Java 25 against the real pack:

```bash
./gradlew --no-daemon :probe:genProbe \
  -PprobePack=/absolute/path/to/pack \
  -PprobeDimension=<dimension-key>

./gradlew --no-daemon :probe:riverTransectProbe \
  -PprobePack=/absolute/path/to/pack \
  -PprobeDimension=<dimension-key> \
  -PprobeSeed=77 \
  -PprobeTileX=3 \
  -PprobeTileZ=-2 \
  -PprobeOutput=/absolute/path/to/output

./gradlew --no-daemon :probe:hydrologyPackProbe \
  -PprobePack=/absolute/path/to/pack \
  -PprobeDimension=<dimension-key> \
  -PprobeSeeds=1,19,331,1337 \
  -PprobeMinimumTileX=8 \
  -PprobeMaximumTileX=23 \
  -PprobeMinimumTileZ=8 \
  -PprobeMaximumTileZ=23 \
  -PprobeRequiredCoverage=<feature@profile,...> \
  -PprobeStudio=true

./gradlew --no-daemon :probe:generationOrderProbe \
  -PprobePack=/absolute/path/to/pack \
  -PprobeDimension=<dimension-key> \
  -PprobeSeed=77 \
  -PprobeMinimumChunkX=2048 \
  -PprobeMaximumChunkX=2051 \
  -PprobeMinimumChunkZ=2048 \
  -PprobeMaximumChunkZ=2051 \
  -PprobeParallelism=4 \
  -PprobeShuffleSeed=1337 \
  -PprobeMulticore=false \
  -PprobeStudio=true
```

The generation probe constructs the real engine and generates chunks into buffers. The river transect probe plans one tile and writes, for every surface course, a top-down plan image (natural height in gray, eroded banks darker, water in blue, shore in tan), a cross-section image with five transects along the course (natural profile, planned profile, water level), and a summary listing the cut range, the largest step between adjacent bank columns, ocean writes, and channel cells whose water is not contained by their banks. It exits non-zero when any course writes the ocean or spills. The hydrology pack probe scans explicit seed-tile combinations and fails unless every feature/profile selector required by that pack's enabled outlet topology is present for every seed; it also checks that no land column near a mouth has river writes below sea level, that exposed courses cut at least one block into the ground on average, and that adjacent bank columns never step by more than one block except across the water edge. The generation-order probe hashes complete block and biome output across forward, reverse, shuffled, and bounded-parallel generation. Pack publication should validate the exact candidate tree, package the canonical closure, extract and validate the exact archive, and run the probes before moving a release tag.

## Managed pack profiles

The managed Overworld and Underworld use 1,024-block watersheds and 64-block coarse samples. Both managed packs require 384 exposed blocks per surface course and 384 blocks per underground course. Surface density is `1.75`, underground density is `1.5`, neither has an ordinary per-tile quota, and source spacing is 384/640 blocks. Each tile selects at most one outlet network, and each surface outlet publishes one complete main stem plus up to `routing.tributaries` tributaries joining it.

The refined route uses 192/48-block meander wavelengths, strengths `0.55`/`0.18`, a `0.45` offset ratio, and a 20-degree authored turn limit. Managed surface channels are 4 to 8 blocks wide and 2 to 4 blocks deep, sit flush with the lowest bank (`channel.sink` is 0), and may cut up to 16 blocks (Overworld) or 10 blocks (Underworld) into a hillside; an Overworld river meets the sea through a 64-block inlet flared to 2.5 times its width and cut up to 32 blocks into the coast. Banks carry a 1.5-block shore, and a blend that runs three blocks for every block of cut between 4 and 32 blocks wide, showing the biome's deeper layers where it cuts. Rapids start where the land drops faster than one block in two, and a cliff of six blocks or more between adjacent stations makes a waterfall. Overworld mouths keep an eight-block non-owning ocean apron, and underground mouths level into the sea across 128 blocks. Underground passages connect to suitable existing caves and both grotto forms retain 10 blocks of dry headroom. Deep lava uses density `0.5`, 1,024-block spacing, and isolated contained pools without channel offshoots. Overworld enables direct mouths and coastal grottos; Underworld disables both and uses contained inland lava grottos and surface sinkholes.

Their fluid profiles differ:

Overworld:

```json
{
  "profiles": [
    {
      "id": "water",
      "fluidPalette": {"palette": [{"block": "minecraft:water"}]}
    }
  ]
}
```

Underworld:

```json
{
  "profiles": [
    {
      "id": "lava",
      "fluidPalette": {"palette": [{"block": "minecraft:lava"}]}
    }
  ]
}
```

Both managed packs also carry the independent `deep_lava` entry from the complete example. Underworld river policies reference `lava`; Overworld river policies reference `water`. Region policies tune headwater and transit preference, while biome policies provide specific source, routing, profile, and content behavior without duplicating the dimension physical solver.

## Adding rivers to a pack

1. Enable `hydrology.rivers` on the dimension and set `routing.tileSize`, `sampleSpacing`, and at least one outlet family. Start from the complete example above and keep the defaults for everything you do not have an opinion about yet.
2. Give the dimension a `riverPolicy` with `placement: NATURAL`, `routing: ALLOW`, a profile, and the content pools you want everywhere by default.
3. In regions and biomes, override only what differs: `placement: DISABLED` for deserts that should stay dry, `routing: AVOID` for terrain rivers should skirt, `PREFERRED_HEADWATER` on mountain biomes, `bankBiomes` and `shoreBiomes` where the valley should read differently from its surroundings, and `bankMultiplier` above `1` for soft, wide valleys or below `1` for gorges.
4. Run `/iris pack validate`, then the river transect probe on a few tiles to look at the valleys before opening a world.
5. Create a new world; rivers are not retrofitted into existing chunks.

## Performance and determinism

Cold accepted-plan work is controlled by `tileSize`, `sampleSpacing`, `maximumRouteLength`, both source budgets and spacing floors, complete-course floors, and the maximum channel, blend, basin, and grotto envelope. Smaller spacings, longer routes, more sources, and wider blend or containment envelopes increase planner and footprint work. `banks.maximumBlendWidth` bounds how far a course can affect terrain from its centerline, which in turn bounds the cross-tile publication radius. A warm column query reuses an immutable cached tile; the runtime retains at most 64 tiles.

Hydrology output is a deterministic function of pack bytes, world seed, and coordinates. The coarse graph, source quotas, outlet choice, refined centerlines, heads, segment labels, profile/content selection, and compiled footprint use stable identities and ordering. Tile, chunk, platform, and worker order must not change the accepted result. Use GoldenHash plus fresh-world feature inspection to verify that contract.

## Troubleshooting

| Symptom | Check |
|---------|-------|
| No surface features | `hydrology.rivers.enabled`, `surface.enabled`, source density/floor, `minimumElevation`, effective placement/routing policy, and legal outlets |
| No underground features | `underground.enabled`, its independent source budget, fluid-level fit, effective policy, and a legal coastal or inland outlet within that head range |
| A route through hills is absent | The course needed a cut deeper than `channel.maximumIncision`; raise it, raise `routing.slopePenalty` so routes stay in valleys, or accept that the source has no open-air path |
| Valleys look too wide or too narrow | `banks.blendSlope` and the per-area `bankMultiplier`; the blend width is the cut depth times the slope |
| Water sits below the bank instead of flush with it | `channel.sink` is above `0`; set it to `0` |
| Banks repeat the surface layer down the cut | `banks.exposeCutStrata` is `false` |
| No inland grotto | Include `SINKHOLE_GROTTO` in `routing.inlandOutlets` and keep `grottos.inland.enabled` true |
| No coastal grotto | It needs a coastal cliff candidate (`grottos.coastal.enabled` and ground at least the grotto's vertical radius above the sea), outlet admission, and `routing.maximumCoastalOutletsPerTile` of at least `2` when the same coast also has beaches, since the first sea slot goes to a mouth |
| Unexpected content | Check effective dimension → region → biome policy inheritance and whether an empty array cleared a pool |
| Missing biome in find/goto | Reference it from a reachable policy and ensure every child/carving key exists |
| No deep lava | Check the `deepFluids` entry density, height envelope, spacing/footprint relationship, and both `containedPools` / `shortChannels` switches |
| No sea caves | `grottos.coastal.enabled` and `grottos.coastal.seaCaves.enabled` must both be true; the coast must stand `seaCaves.minimumCoastHeight` above the sea across the whole chamber (lower it on gentle coasts, or shrink `horizontalRadius`); `seaCaves.minimumSpacing` and the clearance from river mouths must leave room on the tile's coast; the swept chamber must fit `maximumVolume`; `CAVE_CONTAINMENT` rejections mean the chamber breaks out of the coast somewhere other than its ocean face, so lower `depth` or `headroom` |
| Hard boundary between generated areas | Use a new or fully regenerated world for the changed hydrology contract |
| `Hydrology tile x,z failed to plan` in the log | Terrain there generated without rivers. The error report names the column and lists the region, biome, fluid height, overlay, and every interpolator's bounds and generator heights, so check the generator or biome it names; the world stays usable |
