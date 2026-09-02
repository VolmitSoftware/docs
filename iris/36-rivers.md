---
title: "Rivers"
description: "Valley-first surface rivers, underground rivers, grottos, deep fluids, river policy, and the tooling that inspects an accepted plan"
published: true
date: 2026-09-02T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-22T00:00:00.000Z
---
Iris hydrology plans surface rivers that sit in eroded valleys, independently sourced underground rivers, coastal and inland grottos, and independent deep-fluid bodies. The planner resolves each course once: its route, water head, channel and bank shape, segment labels, outlet, fluid profile, and biome ownership. Terrain generation, mantle carving, biome selection, decorators, Vision, and feature locators all read that immutable accepted plan. `hydrology.rivers.enabled` defaults to `false`.

A surface river never raises terrain and never touches the ocean. It cuts a channel into the natural surface, holds its water one block or more below a lip on both banks, and blends the cut back out to natural terrain across a valley whose width grows with the depth of the cut. Water flows downhill in one-block steps; where the land falls faster than the channel can follow, the reach becomes rapids, and where a natural cliff is tall enough, a waterfall. Underground rivers, grottos and deep fluids are contained features validated against carved cave matter.

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
        "underground": {
          "bedRoundness": 3.0,
          "bedRoughness": 0.36,
          "wallRoughness": 0.32,
          "roughnessWavelength": 9
        },
        "grottos": {
          "bedRoundness": 3.2,
          "bedRoughness": 0.38,
          "wallRoughness": 0.34,
          "roughnessWavelength": 11
        },
        "drops": {
          "cascadeRunPerBlock": 2,
          "cascadeExponent": 1.4,
          "maximumCascadeStep": 2,
          "flowWidthRatio": 0.45,
          "maximumFlowDepth": 2,
          "basinWidthRatio": 1.8,
          "maximumBasinDepth": 8
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
          "inset": 1,
          "maximumIncision": 10,
          "roughness": 0.25,
          "roughnessWavelength": 16,
          "springWidthRatio": 2.5,
          "springLength": 24
        },
        "banks": {
          "freeboard": 1,
          "shoreWidth": 1.5,
          "blendSlope": 3,
          "minimumBlendWidth": 4,
          "maximumBlendWidth": 32,
          "exposeCutStrata": true
        },
        "bed": {
          "allowGravityBlocks": false,
          "padding": 2,
          "paddingPalette": {
            "palette": [{"block": "minecraft:clay"}, {"block": "minecraft:dirt"}]
          }
        },
        "flow": {
          "cascadeRun": 2,
          "waterfallMinimumDrop": 6
        },
        "mouths": {
          "flareRatio": 1.6,
          "maximumOceanApron": 8
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
        "mouthLevelingDistance": 128
      },
      "grottos": {
        "coastal": {
          "enabled": true,
          "poolLevel": "SEA_LEVEL",
          "horizontalRadius": 12,
          "verticalRadius": 7,
          "headroom": 10,
          "maximumVolume": 16384
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
| `maximumOutletsPerTile` | `4` | Maximum drainage roots selected in one plan tile, `1..256` |
| `oceanOutlets` | `true` | Allows direct sea mouths; qualifying coastal cliffs can instead select an enabled coastal grotto |
| `inlandOutlets` | empty | Allowed inland terminal types; the current value is `SINKHOLE_GROTTO` |
| `valleyPreference` | `1.5` | Weight on natural height when routing, `0..8`; higher values pull routes into the lowest ground |
| `uphillPenalty` | `24` | Cost added per block of climb between lattice samples, `0..128` |
| `slopePenalty` | `2` | Cost multiplied by the local terrain slope, `0..16`; higher values keep routes off hillsides |
| `confluenceAttraction` | `0.2` | Discount for joining ground another route already drains, `0..1` |
| `lengthPreference` | `1` | How strongly longer source-to-outlet routes win when sources are chosen, `0..8`; `0` ranks sources by elevation alone |
| `tributaries` | `1` | Extra surface courses an outlet may accept as tributaries of its main river, `0..4`; a tributary is cut where its drainage joins the stem and must meet it at or above the stem's water |

At least one outlet family must be enabled. `tileSize`, `sampleSpacing`, route length, and both source budgets form a bounded planning envelope; see [Validation](#validation).

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
| `inset` | `1` | How far the water surface sits below the lowest natural ground beside the channel, `0..3`; the eroded lip comes from `banks.freeboard`, not from a deeper inset |
| `maximumIncision` | `10` | Deepest cut the channel may make into a hillside before the course is rejected, `1..32` |
| `roughness` | `0.25` | Strength of the coherent wobble applied to the channel outline, `0..1`; `0` gives a perfectly smooth outline |
| `roughnessWavelength` | `16` | Wavelength of that wobble in blocks, `4..64` |
| `springWidthRatio` | `2.5` | Width of the spring pool at the headwater relative to the channel width, `1..4`; `1` starts the river at its normal width |
| `springLength` | `24` | Blocks over which the pool narrows back to the channel, `4..96` |

#### `surface.banks`

The banks are everything the river erodes outside the wet channel. Their shape follows the depth of the cut, so a river crossing flat ground makes a shallow dip and a river crossing a hillside makes a real valley.

| Field | Default | Purpose |
|-------|---------|---------|
| `freeboard` | `1` | Height of the lip above the water surface on both banks, `0..4`; `1` keeps water one block below the bank top |
| `shoreWidth` | `1.5` | Width of the shore band beside the water that may use `shoreBiomes`, `0.5..6` blocks |
| `blendSlope` | `3` | Horizontal run per block of rise from the bank top back to natural terrain, `0.5..12`; the blend width is `cut x blendSlope` |
| `minimumBlendWidth` | `4` | Narrowest blend band even for a shallow cut, `1..maximumBlendWidth` |
| `maximumBlendWidth` | `32` | Widest blend band even for a deep cut, up to `64`; this also bounds how far a river can affect terrain from its centerline |
| `exposeCutStrata` | `true` | Show the biome's deeper layers on eroded banks instead of repeating the surface layer, so a cut through grassland shows dirt and stone |

`bankMultiplier` in a region or biome policy scales `blendSlope` locally: values below `1` make steeper, narrower valleys and values above `1` make wider, gentler ones.

#### `surface.bed`

The bed is what sits under and beside the water. Falling blocks under a river collapse when a cave, a player or a fluid update touches them, so by default they are replaced.

| Field | Default | Purpose |
|-------|---------|---------|
| `allowGravityBlocks` | `false` | Keep sand, gravel and concrete powder from the biome layers in the bed, shore and eroded banks; set it when you want a gravel river on purpose |
| `padding` | `2` | Blocks below the bed surface that are also kept free of falling blocks, `0..8` |
| `paddingPalette` | clay and dirt | Blocks used in place of falling blocks; any solid palette |

The river channel keeps the layers of the channel biome (`surfaceBiomes`) and the shore keeps `shoreBiomes`, so a biome override is the way to change what a river bottom or beach is made of; the bed rule only swaps the blocks that would fall.

#### `surface.flow`

Water heads only ever descend. Each step downstream is at most one block unless the terrain forms a cliff.

| Field | Default | Purpose |
|-------|---------|---------|
| `cascadeRun` | `2` | Horizontal blocks per one-block head drop before a reach is labelled rapids rather than a pool, `1..8` |
| `waterfallMinimumDrop` | `6` | Smallest natural cliff, in blocks between adjacent stations, that produces a single-step waterfall drop, `2..32` |

#### `surface.mouths`

| Field | Default | Purpose |
|-------|---------|---------|
| `flareRatio` | `1.6` | Channel width at the coast relative to the width upstream, `1..4` |
| `maximumOceanApron` | `8` | Maximum non-owning accepted connection apron in ocean columns, `0..32` |

An ocean apron owns no terrain, fluid, shore, or bank writes. It records the accepted connection for rendering and inspection while the ocean reservoir remains authoritative.

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

Fluid level, depth, basin depth, and headroom must fit strictly inside `dimensionHeight`. Underground heads remain non-rising downstream, but each routed point resolves its preferred fluid level before the non-rising constraint is applied, so a course can occupy multiple level terraces rather than one globally flattened height. Drops become narrow graded `UNDERGROUND_DROP` features with receiving basins; level runs become `UNDERGROUND_POOL`.

Ordinary underground runs are compiled as continuous course-aligned passages. Their deterministic irregular outline is evaluated against the nearest centerline position, and the cross-section uses an arched ceiling and bowl-shaped bed with coherent longitudinal variation bounded by the configured depth and headroom. `geometry.underground` and `geometry.grottos` set the bed roundness and roughness of those passages, and `geometry.drops` shapes underground drops, sinkholes and receiving basins.

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

A coastal grotto is admitted only at a proven coastal land/ocean boundary. Its pool is at sea level and opens directly into the ocean reservoir. An inland grotto is available only when `routing.inlandOutlets` includes `SINKHOLE_GROTTO`. Within each transit-connected routing component, proven ocean mouths and coastal grottos have priority only when their sea-level connection fits the requesting course's legal head range. An underground course whose maximum head is below sea level receives an inland grotto plan instead of being routed to an impossible coastal outlet.

When `grottos.inland.connectSurfaceRivers` is `true`, an eligible surface source keeps one course through a `SINKHOLE` falling throat and into its terminal `INLAND_GROTTO` receiving pool. The sinkhole starts at the final surface centerline cell, narrows by at most one configured block at the contained throat, and keeps fluid and carving continuous into the receiving chamber. The accepted link includes dry headroom and is validated and published as one containment transaction. When the field is `false`, surface sources cannot route to inland grotto outlets, while independently sourced underground courses remain eligible for them.

Both forms are bounded, contained features. `maximumVolume` bounds the grotto segment itself; an attached underground course or surface sinkhole remains part of the same all-or-nothing containment transaction without counting its non-grotto positions against that cap.

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

A pool is shaped like a river reach with no course: the fluid sits `channel.inset` below the lowest ground around the bowl, the rim carries `banks.freeboard`, the bowl is a broad basin with the configured outline roughness, and the cut blends back out to natural ground the same way a river bank does. A site is skipped where the ground falls away more than `channel.maximumIncision` allows, on or below sea level, where the policy does not list the pool, or within one river width plus the bank blend of an accepted course. The bed padding rule applies to pools as well.

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
    "bankMultiplier": 1.5
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

The planner selects and stores the exact profile and biome keys in each accepted column layer. Later generation stages do not reselect them. Referenced biomes, their children, and carving references join the active dimension reachable closure, so retained river-only surface content is available to biome find/goto commands.

## How the planner works

For each bounded hydrology tile Iris:

1. samples natural height, slope, ocean classification, cave suitability, and effective policy on the coarse lattice;
2. proves coastal mouths or grottos first, then permitted inland grottos when needed;
3. builds one acyclic drainage potential toward accepted outlets;
4. admits surface and underground sources from separate budgets;
5. routes toward valleys using `valleyPreference`, `uphillPenalty`, `slopePenalty`, policy cost, and `confluenceAttraction`; a surface route never climbs more than the cut the channel may make (`channel.maximumIncision` less the inset and depth) between two lattice samples, so ground behind a ridge drains to an inland grotto instead of an impossible sea mouth;
6. refines each accepted coarse route into a terrain-following centerline with the configured meanders;
7. shapes every surface course as a valley (below) and every underground course as a contained passage;
8. compiles exact terrain, fluid, shore, bank, biome, cave, render, and locator footprints;
9. validates every course with a subterranean footprint as one containment transaction against authoritative carved mantle matter;
10. prunes any rejected course and publishes the remaining immutable `HydrologyTile`.

The tile contains sorted drainage nodes, edges, outlets, courses, features, accepted cave actions and baseline preconditions, and a `RiverFootprint`. Surface courses are grouped by outlet before publication; the longest viable route becomes the outlet's main stem, and up to `routing.tributaries` further routes to the same outlet are kept as tributaries, each cut at the confluence where its drainage joins the stem. A tributary needs at least half the minimum course length above the confluence and must arrive at or above the stem's water there, so it steps down into the river rather than pooling below it. Every drainage edge lowers potential, so accepted graphs are acyclic.

Before any surface course is published, cross-tile arbitration compares its complete mouth and centerline claim with the bounded owner set. Only the deterministic winning owner may publish an overlapping claim. This prevents tile request order from creating duplicate mouths, stacked main stems, or detached edge fragments.

### How a surface river is shaped

A surface course is shaped in four steps, all of them working on the refined centerline one block at a time.

1. **Channel profile.** Width and depth are resolved at every station from `channel.width` and `channel.depth`, the effective policy multipliers, and the coherent outline wobble from `channel.roughness`. The headwater opens as a spring pool `springWidthRatio` times the channel width and one block deeper, narrowing to the cruise width over `springLength` blocks. Near a coast the width grows toward `mouths.flareRatio` times the upstream width.
2. **Water head.** For each station the planner reads the natural ground on a ring just outside the channel outline on both banks, takes the lowest bank sample, and subtracts `channel.inset`. Heads are then made non-rising downstream: a value that would rise is held at the previous head, and a value that would fall is limited to one block per `flow.cascadeRun` blocks of run unless the pair straddles a natural cliff of at least `flow.waterfallMinimumDrop`, where the head drops by the cliff in one step. A station whose head would need a cut deeper than `channel.maximumIncision` rejects the course; there are no bores under ridges for surface rivers, so a route that cannot stay open on the surface is not published.
3. **Erosion field.** Every column near the centerline receives a target height. Inside the channel the target is the bowl-shaped bed below the head. The bank top on both sides sits at `head + banks.freeboard`. From the shore outward the target rises along a smooth curve back to the natural height across a blend band whose width is `cut x banks.blendSlope`, clamped to `minimumBlendWidth..maximumBlendWidth`, where `cut` is how far the bank top sits below natural ground at that station. The published terrain is `min(natural, target)`: the field only ever lowers ground. Water is published only where the bed sits below the head and the surrounding bank tops contain it.
4. **Labels.** Each reach is labelled from its head gradient: a level reach is a `SURFACE_POOL`, a single one-block step is a `RIFFLE`, consecutive one-block steps are a `CASCADE`, and a cliff-sized step is a `WATERFALL`. Labels do not change the geometry; they drive Vision, locators, and rendering.

The head is derived from the banks rather than the centerline so a river running along a hillside is cut into the slope with a lip on the uphill side, instead of sitting on a shelf above the downhill side. Because every step is one block, a river descending a hill leaves no chips, ledges, or floating water. Because the blend width follows the depth of the cut, a shallow crossing of flat ground erodes only a few blocks either side, while a deep cut through a ridge opens into a wide valley.

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
| `COASTAL_GROTTO` | Sea-level contained coastal outlet chamber |
| `INLAND_GROTTO` | Permitted sinkhole outlet chamber |
| `MOUTH` | Surface or underground connection into the ocean reservoir |
| `DEEP_POOL` | Independent contained deep-fluid pool |
| `DEEP_CHANNEL` | Independent short deep-fluid channel |
| `STANDING_POOL` | Independent standing surface pool |

Feature references also carry stable feature, course, and segment IDs, coordinates, flow direction, and a source marker. Vision and locator commands consume these accepted references.

## Terrain, oceans, caves, and decoration

### Surface shaping and banks

Every surface write is carve-only: no column is ever raised above its natural height, whether by the channel, the shore, or the bank blend. Water is held below the lip by `banks.freeboard` on both sides. Where the natural ground beside the channel is already lower than the intended bank top, the planner lowers the head instead of building a bank, so the river always follows the land down.

The post-generation passes that place slabs, fill potholes, remove floating nibs, and dress walls skip every column inside a river footprint and its immediate neighbours, so the channel, shore and bank blend are published exactly as planned. Automatic surface object placement is rejected when any transformed support column intersects an accepted river channel or shore band, even with `forcePlace`, `underwater`, or `onwater`; this stops biome and region scatter from bridging a channel or standing in the shore. Explicit-Y object placement, including `/iris object paste`, remains available for intentional authoring inside a river.

Only the inner `shoreWidth` can use `shoreBiomes`. The bank blend uses `bankBiomes` when the policy sets it and otherwise keeps the natural parent biome, so decorators and surfaces there stay consistent with the surrounding land. The final channel width and depth include the effective region and biome multipliers and vary continuously along the course.

### Ocean boundary

The accepted plan resolves the first true natural land/ocean crossing. An exposed river keeps its terrain-supported head and continuous wet channel until that exact crossing. Its channel broadens through the configured flare, its head drops to sea level across the last station, and the ocean reservoir takes over. River-owned terrain and fluid stop on the landward side, with at most `maximumOceanApron` blocks of non-owning accepted connection footprint in the ocean. Underground mouths may use `underground.mouthLevelingDistance` to reach sea level.

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

The search is bounded to the smaller of 8,192 blocks and fifteen routing tiles. It searches accepted immutable plans, not candidate cells. `/iris find biome` and `/iris goto biome` remain available for reachable surface river-content biomes.

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

The managed Overworld and Underworld use 1,024-block watersheds and 64-block coarse samples. Both managed packs require 384 exposed blocks per surface course and 384 blocks per underground course. Surface density is `1.75`, underground density is `1.5`, neither has an ordinary per-tile quota, and source spacing is 384/640 blocks. Each tile selects at most one outlet network, and each surface outlet publishes exactly one complete main stem with no tributary courses.

The refined route uses 192/48-block meander wavelengths, strengths `0.55`/`0.18`, a `0.45` offset ratio, and a 20-degree authored turn limit. Managed surface channels are 4 to 8 blocks wide and 2 to 4 blocks deep, sit one block below the lowest bank, and may cut up to 10 blocks into a hillside. Banks carry a one-block lip, a 1.5-block shore, and a blend that runs three blocks for every block of cut between 4 and 32 blocks wide, showing the biome's deeper layers where it cuts. Rapids start where the land drops faster than one block in two, and a cliff of six blocks or more between adjacent stations makes a waterfall. Managed mouths flare to 1.6 times the upstream width with an eight-block non-owning ocean apron, and underground mouths level into the sea across 128 blocks. Underground passages connect to suitable existing caves and both grotto forms retain 10 blocks of dry headroom. Deep lava uses density `0.5`, 1,024-block spacing, and isolated contained pools without channel offshoots. Overworld enables direct mouths and coastal grottos; Underworld disables both and uses contained inland lava grottos and surface sinkholes.

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
| Water sits flush with the bank | `banks.freeboard` is `0`; set it to `1` or more |
| Banks repeat the surface layer down the cut | `banks.exposeCutStrata` is `false` |
| No inland grotto | Include `SINKHOLE_GROTTO` in `routing.inlandOutlets` and keep `grottos.inland.enabled` true |
| No coastal grotto | It needs an accepted coastal cliff/solid-terrain candidate, outlet admission, and `grottos.coastal.enabled` |
| Unexpected content | Check effective dimension → region → biome policy inheritance and whether an empty array cleared a pool |
| Missing biome in find/goto | Reference it from a reachable policy and ensure every child/carving key exists |
| No deep lava | Check the `deepFluids` entry density, height envelope, spacing/footprint relationship, and both `containedPools` / `shortChannels` switches |
| Hard boundary between generated areas | Use a new or fully regenerated world for the changed hydrology contract |
