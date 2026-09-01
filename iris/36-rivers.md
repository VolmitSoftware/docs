---
title: "Rivers"
description: "Terrain-first surface and underground hydrology, outlets, biome policy, deep fluids, and accepted-plan tooling"
published: true
date: 2026-09-01T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-22T00:00:00.000Z
---
Iris hydrology plans terrain-guided surface rivers, independently sourced underground rivers, coastal and inland grottos, and independent deep-fluid bodies. The planner resolves the route, non-rising hydraulic head, segment type, terrain and fluid footprint, outlet, fluid profile, and biome ownership once. Terrain generation, mantle carving, biome selection, decorators, Vision, and feature locators consume that immutable accepted plan. `hydrology.rivers.enabled` defaults to `false`.

Surface routing selects exactly one terrain-refined main stem for each outlet. The complete source-to-outlet centerline is solved as one curvature-aware route inside the selected terrain corridor, and that exact route drives hydraulic segmentation and carving. Surface tributaries are not published. If the initial outlet selection publishes no surface course, Iris tries a bounded, deterministically ranked set of alternate legal mouths and enabled inland grottos. Each alternate first uses the normal terrain-following solver and may then use the stricter contained solver; fallback stops after the first accepted surface course.

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
        "refinementSpacing": 4,
        "branching": {
          "minimumSurfaceCourseLength": 384,
          "minimumUndergroundCourseLength": 384
        },
        "maximumRouteLength": 16384,
        "maximumOutletsPerTile": 1,
        "oceanOutlets": true,
        "inlandOutlets": ["SINKHOLE_GROTTO"]
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
          "bedRoundness": 2.8,
          "bedRoughness": 0.32,
          "wallRoughness": 0.08,
          "roughnessWavelength": 24
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
            "min": 1,
            "max": 3,
            "style": {"style": "IRIS", "zoom": 320, "exponent": 2}
          },
          "surfaceInset": {
            "min": 2,
            "max": 2,
            "style": {"style": "IRIS", "zoom": 384, "exponent": 2}
          },
          "maximumIncision": 6,
          "shoreWidth": 1.0,
          "terrainBlendWidth": {
            "min": 12,
            "max": 24,
            "style": {"style": "IRIS", "zoom": 512}
          }
        },
        "hydraulics": {
          "targetPoolLength": {
            "min": 80,
            "max": 180,
            "style": {"style": "IRIS", "zoom": 384}
          },
          "riffleDrop": 1,
          "maximumGradualDrop": 7,
          "maximumGradualLength": 24,
          "waterfallMinimumDrop": 8
        },
        "ridgeTunnels": {
          "enabled": true,
          "maximumLength": 384,
          "headroom": 10
        },
        "mouths": {
          "levelingDistance": 128,
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
        "connectToExistingCaves": true
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
    "dryBiomes": ["temperate/plains"],
    "floodedCaveBiomes": ["carving/rocky-cavebiome"],
    "widthMultiplier": 1.0,
    "depthMultiplier": 1.0,
    "incisionMultiplier": 1.0,
    "routingMultiplier": 1.0
  }
}
```

Every object with `min` and `max` is an `IrisStyledRange`. `style` is optional; when present it selects a deterministic value between the endpoints in world space. Width, depth, and surface inset are resolved along selected course pairs; pool length is resolved at the accepted course origin; terrain blend and underground headroom are resolved along accepted centerlines; and underground or deep-fluid elevation is resolved only for selected outlet, course, or deep-source geometry. Those resolved values are stored in the immutable accepted plan rather than resampled by generation, rendering, or inspection.

## Physical configuration

### `hydrology.rivers.routing`

| Field | Default | Contract |
|-------|---------|----------|
| `tileSize` | `2048` | Accepted-plan tile width in blocks, `256..8192` |
| `sampleSpacing` | `64` | Coarse terrain/policy lattice spacing, `8..512`; must divide `tileSize` |
| `refinementSpacing` | `8` | Refined centerline spacing, `1..64`; must divide `sampleSpacing` |
| `branching.minimumSurfaceCourseLength` | `384` | Minimum total exposed surface length in a complete source-to-outlet course, `0..32768` and no greater than `maximumRouteLength`; configured courses must start exposed and retain a continuous exposed reach of up to two routing samples |
| `branching.minimumUndergroundCourseLength` | `192` | Minimum complete underground source-to-outlet route, `0..32768` and no greater than `maximumRouteLength` |
| `maximumRouteLength` | `16384` | Maximum source-to-outlet route length, `256..32768` blocks |
| `maximumOutletsPerTile` | `4` | Maximum drainage roots selected in one plan tile, `1..256` |
| `oceanOutlets` | `true` | Allows direct sea mouths; qualifying coastal cliffs can instead select an enabled coastal grotto |
| `inlandOutlets` | empty | Allowed inland terminal types; the current value is `SINKHOLE_GROTTO` |

At least one outlet family must be enabled. `tileSize`, both spacings, route length, and both source budgets also form a bounded planning envelope; see [Validation](#validation).

### `hydrology.rivers.surface`

`surface.enabled` controls only exposed, terrain-following courses. It does not control the independent underground or deep-fluid budgets.

| Section or field | Default | Purpose |
|------------------|---------|---------|
| `sources.density` | `0.5` | Expected surface sources per plan tile, `0..64` |
| `sources.minimumElevation` | `88` | Minimum absolute world Y for a surface source, `-2048..2048` and below the dimension maximum |
| `sources.minimumPerTile` | `0` | Source quota enforced only when a qualifying `REQUIRED_HEADWATER` policy candidate can reach a legal outlet, `0..64` |
| `sources.minimumSpacing` | `384` | Minimum separation between natural surface headwaters, `0..8192`; required headwaters may override it |
| `channel.width` | `4..8` | Full channel width, with both endpoints in `1..64` |
| `channel.depth` | `1..4` | Bed depth below the solved local head, endpoints in `1..32` |
| `channel.surfaceInset` | `3..7` | One course-wide vertical recession below the exact natural terrain along the routed centerline, endpoints in `1..64` |
| `channel.maximumIncision` | `6` | Maximum permitted surface cut before the course needs a contained bore, `0..64` |
| `channel.shoreWidth` | `2` | River-specific shore content band, `1..2` blocks |
| `channel.terrainBlendWidth` | `10..24` | Outer dry physical grading band; each endpoint must remain in `4..64` and outside `shoreWidth` |

Shore content and physical grading are independent. The narrow shore band may select `shoreBiomes`; the wider outer grade retains the exact parent biome and its surface layers.

Every exposed run is rasterized as one continuous variable-width sweep. The configured width is a true minimum footprint; coherent bank variation may broaden it but cannot squeeze it into a thread. Adjacent hydraulic segments do not receive independent end caps. Headwaters open through a tapered 48-to-64-block spring profile instead of a radial source basin; a shorter exposed run tapers across all of its available length, but must remain at least twice its cruise width before entering a contained transition. Exposed mouths use a bounded soft transition at the downstream end. Sinkholes instead preserve the upstream channel through a full-width bore portal while only the shore and outer grade taper into the roof. Mid-course receiving pools spread their width and depth change across a 32-block envelope, so a pool cannot create a transverse T-shaped spur at a bend or segment boundary.

### Hydraulic transitions

Minecraft fluid surfaces are level per pool, so the planner converts every downstream head loss into an explicit transition.

| Field | Default | Purpose |
|-------|---------|---------|
| `targetPoolLength` | `80..180` | Preferred level-pool length, endpoints in `8..4096` |
| `riffleDrop` | `1` | Largest drop classified as a riffle, `0..16` |
| `maximumGradualDrop` | `7` | Largest drop eligible for a gradual cascade, `0..64` |
| `maximumGradualLength` | `24` | Maximum horizontal length for that gradual transition, `1..1024` |
| `waterfallMinimumDrop` | `8` | First drop classified as a waterfall, `1..128` |

`riffleDrop` cannot exceed `maximumGradualDrop`; `waterfallMinimumDrop` equals `maximumGradualDrop + 1`; `maximumGradualLength` is at least `maximumGradualDrop`; and `targetPoolLength.min` is at least `maximumGradualLength`.

There is no random occurrence gate. A terrain-supported positive head loss becomes a riffle, cascade, waterfall, or underground drop; flat or rising surface terrain cannot manufacture one. Before segment classification, nearby losses without a complete `targetPoolLength` recovery are normalized into one bounded transition. Unsupported loss is removed from the upstream pool, a feasible combined loss occurs on the actual routed descent, suppressed intermediate drops become one level continuation, and only the terminal endpoint receives a basin. A full target-length pool is required before another independent transition can begin. Riffles, cascades, and underground drops are narrow, shallow graded flows, but a surface-course descent never narrows below `channel.width.min`. Every exposed cascade advances in one-block vertical steps along the same terrain-refined centerline as the adjoining pools. Its head is recessed below the exact natural height of the centerline and all four cardinal neighbors, and its complete graded run is assigned only where that terrain can contain the solved head. When excessive terrain relief intersects the channel rather than forming a proven natural cliff, the course becomes an arched, organically widened contained `RIDGE_BORE` or `UNDERGROUND_DROP` and reopens downstream instead of excavating an open vertical slot. The coastal approach uses that same final centerline through the proven landward crossing; it is not re-meandered, smoothed, or bent by a second mouth pass. Any remaining reservoir-level cliff is pinned to the final shoreline pair before the sea-level mouth instead of being projected backward onto flat land. A surface waterfall additionally requires a natural local cliff large enough for its fall. Its falling curtain owns fluid only; the approach and receiver own the terrain, so the fall cannot excavate a full-height vertical trench. The dry grading envelope erodes the surrounding terrain independently from the narrower wet footprint; neither grading nor fluid may raise a surface column above its natural terrain.

`geometry.drops` controls that shape: `cascadeRunPerBlock` (`2`), `cascadeExponent` (`1.4`), `maximumCascadeStep` (`2`, underground drops only), `flowWidthRatio` (`0.45`), `maximumFlowDepth` (`2`), `basinWidthRatio` (`1.8`), and `maximumBasinDepth` (`8`). Exposed cascades always use one-block steps. Width ratios are applied before basin expansion, so descent paths carry materially less fluid than the connected pool while the receiver still carves a recognizable basin.

### Ridge tunnels and mouths

| Section or field | Default | Purpose |
|------------------|---------|---------|
| `ridgeTunnels.enabled` | `true` | Lets one surface course bore through excessive local relief and reopen |
| `ridgeTunnels.maximumLength` | `192` | Maximum continuous bore length, `1..4096` and no greater than the route length |
| `ridgeTunnels.headroom` | `10` | Dry clearance above the fluid head, `1..128` |
| `mouths.levelingDistance` | `64` | Landward distance used to level underground mouths into the sea, `0..2048` and no greater than the route length; exposed rivers retain terrain-supported heads to the coastal crossing. The managed packs set this to `128` |
| `mouths.maximumOceanApron` | `8` | Maximum non-owning accepted connection apron in ocean columns, `0..64` |

An ocean apron owns no terrain, fluid, shore, or grading writes. It records the accepted connection for rendering and inspection while the ocean reservoir remains authoritative.

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

Fluid level, depth, basin depth, and headroom must fit strictly inside `dimensionHeight`. Underground heads remain non-rising downstream, but each routed point resolves its preferred fluid level before the non-rising constraint is applied, so a course can occupy multiple level terraces rather than one globally flattened height. Drops become narrow graded `UNDERGROUND_DROP` features with receiving basins; level runs become `UNDERGROUND_POOL`.

Ordinary underground runs are compiled as continuous course-aligned passages instead of overlapping radial cells. Their deterministic irregular outline is evaluated against the nearest centerline position, and the cross-section uses an arched ceiling and bowl-shaped bed with coherent longitudinal variation bounded by the configured depth and headroom. This avoids circular seams, checkerboard floors, and flat rectangular ceilings while preserving a connected fluid route.

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

A coastal grotto is admitted only at a proven coastal land/ocean boundary. Its pool is at sea level and opens directly into the ocean reservoir. An inland grotto is available only when `routing.inlandOutlets` includes `SINKHOLE_GROTTO`. Within each transit-connected routing component, proven ocean mouths and coastal grottos have priority only when their sea-level connection fits the requesting course's legal head range. An underground course whose maximum head is below sea level receives an inland grotto plan instead of being routed to an impossible coastal outlet. A surface tile with a positive source target tries a bounded set of inland candidates only after all selected coastal courses fail exact admission; each candidate must still prove its complete bank-supported centerline, transitions, sinkhole clearance, receiving chamber, and cave transaction.

When `grottos.inland.connectSurfaceRivers` is `true`, an eligible surface source retains one course through a `SINKHOLE` falling throat and into its terminal `INLAND_GROTTO` receiving pool. The sinkhole starts at the final surface centerline cell without a singleton surface pool or rounded terminal cap, narrows by at most one configured block at the contained throat, and keeps fluid and carving continuous into the receiving chamber. The accepted link includes dry headroom and is validated and published as one containment transaction. When the field is `false`, surface sources cannot route to inland grotto outlets, while independently sourced underground courses remain eligible for them.

Both forms are bounded, contained features. `maximumVolume` bounds the grotto segment itself; an attached underground course or surface sinkhole remains part of the same all-or-nothing containment transaction without counting its non-grotto positions against that cap. Their headroom must fit inside the configured vertical extent, and the mantle publication owns only the accepted chamber, throat, fluid, and containment cells.

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

Spacing must contain the complete horizontal footprint, depth plus headroom must fit inside the vertical diameter, and the height envelope must fit inside the dimension. A short channel has no separate authored length: its maximum length is `max(refinementSpacing, spacing / 3)`, capped to half `routing.tileSize`, and its derived containment-volume bound may shorten it further. The half-tile cap keeps neighboring-plan publication work bounded even when `spacing` is much larger than the tile. Contained pools use one connected deterministic multi-lobed basin with an ellipsoid bowl, rather than a circular pool plus a detached line. The managed Overworld uses a denser `deep_lava` entry independently of its water river profile.

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
    "routing": "PREFER",
    "outletAdmission": true,
    "profiles": ["water"],
    "surfaceBiomes": ["tundra/sea/river"],
    "mouthBiomes": ["ocean/deep"],
    "shoreBiomes": ["tundra/shore/snow"],
    "dryBiomes": ["tundra/frosted-peaks"],
    "floodedCaveBiomes": ["carving/ice-cave"],
    "widthMultiplier": 0.8,
    "depthMultiplier": 1.1,
    "incisionMultiplier": 1.0,
    "routingMultiplier": 0.7
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
| `PREFER` | Reduces local route cost |

`outletAdmission` is a nullable Boolean independent of transit. `false` prevents a coastal or inland outlet from being anchored in that policy area without necessarily blocking a course through it.

A viable `REQUIRED_HEADWATER` policy site intrinsically requests at least one source. `sources.minimumPerTile` may raise that required quota and may override ordinary source spacing when enough policy-owned routes remain legal; it does not impose a floor on tiles that contain only natural candidates. Density selects the bounded accepted-source target. When containment or route publication rejects a selected course, Iris lazily tries the remaining globally admitted candidates until that target is restored or no viable candidate remains. Required candidates still backfill their guaranteed minimum even when ordinary source spacing would reject them.

### Content and geometry fields

| Field | Meaning |
|-------|---------|
| `profiles` | Permitted river fluid-profile IDs |
| `surfaceBiomes` | Surface-channel content |
| `mouthBiomes` | Sea mouth and coastal-grotto content |
| `shoreBiomes` | Narrow river-shore content |
| `dryBiomes` | Dry accepted-channel content |
| `floodedCaveBiomes` | Underground, grotto, and deep-fluid content |
| `widthMultiplier` | Channel-width scale, greater than zero through `16` |
| `depthMultiplier` | Channel-depth scale, greater than zero through `16` |
| `incisionMultiplier` | Local surface-incision scale, `0..16`; it may tighten the permitted cut but cannot exceed `channel.maximumIncision` |
| `routingMultiplier` | Local route-cost scale, `0..64` |

The planner selects and stores the exact profile and biome keys in each accepted column layer. Later generation stages do not reselect them. Referenced biomes, their children, and carving references join the active dimension reachable closure, so retained river-only surface content is available to biome find/goto commands.

## How the planner works

For each bounded hydrology tile Iris:

1. samples natural height, slope, ocean classification, cave suitability, and effective policy on the coarse lattice;
2. proves coastal mouths or grottos first, then permitted inland grottos when needed;
3. builds one acyclic drainage potential toward accepted outlets;
4. admits surface and underground sources from separate budgets;
5. routes toward valleys with uphill and slope penalties, policy cost, and confluence attraction;
6. refines accepted coarse edges at `refinementSpacing` and keeps that terrain-refined centerline as the final surface route;
7. solves a non-rising head from each source to its outlet and pools it to the target lengths;
8. classifies every segment from its solved head and terrain relationship;
9. compiles exact terrain, fluid, shore, grading, biome, cave, render, and locator footprints;
10. validates every course with a subterranean footprint as one containment transaction against authoritative carved mantle matter;
11. prunes any rejected course and publishes the remaining immutable `HydrologyTile`.

The tile contains sorted drainage nodes, edges, outlets, courses, features, accepted cave actions and baseline preconditions, and a `RiverFootprint`. Surface courses are grouped by outlet before publication, and the longest viable route becomes the outlet's only complete main stem. A course cannot rise hydraulically downstream. Every drainage edge lowers potential, so accepted graphs are acyclic.

Before any surface course is published, cross-tile arbitration compares its complete mouth and centerline claim with the bounded owner set. Only the deterministic winning owner may publish an overlapping claim. This prevents tile request order from creating duplicate mouths, stacked main stems, or detached edge fragments.

Each accepted column layer records its exact `bedY`, `fluidHeadY`, `ceilingY`, ownership flags, connected/falling/receiving state, profile key, and selected content keys. `IrisComplex` uses that footprint for final terrain height, surface biome, and fluid selection. Cave and decorator stages consume the same ownership rather than estimating a channel from nearby coordinates.

The runtime exposes accepted-plan queries through `IrisHydrologyRuntime.sample(x, z)`, `renderSample(x, z)`, `tile(HydrologyTileKey)`, and `nearestFeature(...)`. Column and render queries compose overlapping immutable tile footprints before returning the final sample. The plan cache is bounded to 64 tiles.

## Accepted feature types

| Feature | Meaning |
|---------|---------|
| `SURFACE_POOL` | Level exposed reach |
| `RIFFLE` | Small required head loss |
| `CASCADE` | Gradual stepped head loss |
| `WATERFALL` | Drop beyond gradual-transition capacity |
| `SINKHOLE` | Falling surface-to-underground throat into a contained inland grotto pool |
| `RIDGE_BORE` | Level contained section beneath excessive relief |
| `UNDERGROUND_POOL` | Level independently sourced cave river |
| `UNDERGROUND_DROP` | Required descending underground transition |
| `COASTAL_GROTTO` | Sea-level contained coastal outlet chamber |
| `INLAND_GROTTO` | Permitted sinkhole outlet chamber |
| `MOUTH` | Surface or underground connection into the ocean reservoir |
| `DEEP_POOL` | Independent contained deep-fluid pool |
| `DEEP_CHANNEL` | Independent short deep-fluid channel |

Feature references also carry stable feature, course, and segment IDs, coordinates, flow direction, and a source marker. Vision and locator commands consume these accepted references.

## Terrain, oceans, caves, and decoration

### Surface shaping and banks

The planner resolves `surfaceInset` once per course and caps each exposed head below the exact natural terrain on its routed centerline. Pool holding may make a downstream reach shallower, but it cannot invent a drop: every head loss is bounded by the natural descent of that route pair, and a waterfall additionally needs a local cliff at least as tall as the fall. Water depth is resolved independently below the recessed head, and the compiled bed is always clamped to natural terrain, making every surface write carve-only. The managed packs use a fixed two-block centerline inset and a strict six-block open-channel incision cap. Policy multipliers may reduce that local cap but cannot deepen an exposed cut beyond the configured maximum. A deeper routed centerline becomes a contained ridge bore or underground drop instead of an exposed vertical cut. Every horizontal wet raster cell requires exact natural terrain above its head at that cell and all four cardinal neighbors; an unsupported styled edge is omitted instead of publishing a spill path. Every dry cardinal bank adjacent to owned surface fluid likewise resolves at least one block above that local fluid head while remaining at or below its exact natural height. The footprint retains a non-writing one-cell natural-terrain collar so every wet edge is validated against its real bank rather than an absent sample. Falling curtains remain fluid-only and do not carve terrain. Non-falling reaches are swept once along the nearest centerline position. Their wet bed has a broad, nearly level thalweg across the inner 65 percent of the radius and eased organic shoulders into the banks instead of a narrow U-shaped trough. Parent terrain then blends smoothly to its exact natural height across the shore and grading envelope and is never raised. This removes overlapping-disc minima, checkerboard floors, flat shelves, thin center threads, spill edges, and sheer stamped walls while retaining slow deterministic variation in width and outline.

Cascades grade across the actual routed run rather than an independently invented side path, and each adjacent routed cell descends by zero or one block. Short transition clusters are consolidated before containment and classification, so the renderer receives one descent and one terminal basin rather than adjacent waterfall, cascade, and pool shelves. A waterfall localizes that combined head change at the proven natural cliff, narrows to a terrain-backed throat, and blends a compact receiving reach separately into surrounding terrain instead of stamping a full-width vertical cylinder or circular pool. Within one course and column, the compiled footprint publishes only one connected non-falling surface head; receiving water wins where transition geometry overlaps. If a required cut exceeds the effective incision limit, or the final curved centerline reaches naturally submerged terrain before its mouth, the same course enters a contained ridge bore or underground drop and may reopen downstream. Surface-course bore descents use the complete routed run without injecting independent approach, pause, or outflow pools. The adjoining surface sweeps retain the configured wet width while their shore and outer grade taper into the portal; internal seams use clipped joins rather than rounded caps, and a re-emergence never receives another headwater marker. Ridge-bore and underground-drop ceilings clamp beneath adjacent planned terrain, and every transition centerline cell must publish connected owned fluid for the same segment or the whole surface course is rejected. Only the outer boundaries of the complete underground run are intentional surface openings, so an internal type change cannot excuse a clipped roof or open vertical trench.

Only the inner `shoreWidth` can use river-shore content. The rest of the grade retains the natural parent biome. The final channel width and depth include effective region/biome multipliers and are interpolated continuously along the surface sweep.

### Ocean boundary

The accepted plan resolves the first true natural land/ocean crossing. An exposed river keeps its terrain-supported head and continuous wet sweep until that exact crossing instead of stopping at the midpoint of its final route edge. Its landward bed shallows, the banks reach exact parent terrain, and the channel broadens through a proportional terminal flare before handing off to the ocean reservoir. A direct mouth drop cannot bypass the incision classifier: excessive relief enters a contained bore before its sea-level connection. A coastal grotto places its contained pool at sea level and adds a falling connection only across the proven adjacent coastal cliff. River-owned terrain and fluid stop on the landward side, with at most `maximumOceanApron` blocks of non-owning accepted connection footprint in the ocean. Underground mouths may use `mouths.levelingDistance` to reach sea level.

Ocean classification is conservative: either the route classifier or the sampled natural terrain may veto ownership. Independently of biome classification, any surface column whose exact natural height is at or below sea level rejects river-owned terrain, fluid, shore content, and grading; any non-apron surface channel column also requires exact natural terrain strictly above its fluid head. Only the bounded non-owning mouth apron may remain. These geometric guards apply to exposed hydrology only, so independently contained underground and deep-fluid features remain legal below sea level. A mouth or coastal grotto cannot turn along the coastline, raise the sea, place a wall across it, or excavate an ocean channel.

### Mantle and cave containment

Any active river or deep-fluid configuration requires:

- `useMantle: true`
- `carvingEnabled: true`
- `CARVED` absent from `disabledComponents`
- `RIVER_HYDROLOGY` absent from `disabledComponents`

Before an immutable tile becomes visible, its cave view lazily generates every prerequisite `CARVED` chunk and reads the resulting `MatterCavern` plus any platform fluid state. Iris validates the complete subterranean footprint of each underground course, surface course with a ridge bore or sinkhole continuation, grotto course, and deep-fluid body as one candidate. A surface sinkhole's falling throat, receiving wet pool, and dry headroom therefore succeed or fail with the rest of that same course. An unapproved opening to the surface or another cavern, a world-boundary or volume escape, existing or incompatible fluid, or overlap with a winning plan rejects the entire course; its graph references and footprint are removed before terrain, Vision, or locators can observe it.

Each all-or-nothing cave transaction is limited to 262,144 planned mutation positions across its complete course, including attached non-grotto sections. A larger candidate receives `VOLUME_LIMIT` before Iris materializes cave positions or reads voxel state. The configured grotto `maximumVolume` remains the smaller, feature-specific chamber limit.

An accepted cave plan stores every bed, wet source, falling throat, dry-headroom, and seal-guard action together with the exact baseline cave preconditions used for admission. Actions and preconditions are immutable views over one packed position store, so the accepted plan does not retain a second per-voxel map. When an intentional cave opening and a composed surface footprint occupy the same voxel, containment admits only their single exact action and fluid profile; changing a cave action to its surface counterpart is allowed only when both layers belong to the same course. An incompatible profile or non-intentional opening rejects that cave course. Surface fluid from a lower overlapping layer is not published beneath the final composed terrain bed. The mantle pass rechecks all relevant preconditions before compiling a chunk and publishes nothing from that chunk when any check differs, so it cannot write a partial local subset after its proof becomes invalid. When `connectToExistingCaves` is enabled, a planned dry boundary may open into suitable cave air without exposing the wet volume. Hydrology-owned cells and seal guards remain protected from later object or structure writes that would break containment; the cave network never becomes a shared reservoir.

Automatic surface object attempts are rejected when any transformed support column intersects an accepted surface-river fluid footprint. This veto applies even when that placement uses `forcePlace`, `underwater`, or `onwater`; it prevents biome and region scatter from bridging a channel. Explicit-Y object placement, including `/iris object paste`, remains available for intentional authoring inside a river.

### Decorators and freezing

River decorators use the final accepted connected-fluid state. Shore-line and sea-surface passes use the accepted local head for a wet river column and the dimension sea level for an ordinary ocean. Rejected waterloggable placements restore their prior block state atomically. A non-water river profile clears waterlogging instead of introducing water into that fluid.

Exposed water is published as ordinary water. The standard exposed-water freezing pass decides where ice forms after hydrology, so frozen rivers do not carry a prebuilt moving surface pattern.

## Vision and feature location

The normal **Biome** view composites accepted surface hydrology content over the natural biome field. The **River network** view reads the accepted feature footprint and labels it `headwater / source`, `surface pool`, `riffle`, `cascade`, `waterfall`, `sinkhole`, `ridge bore`, `underground pool`, `underground drop`, `coastal grotto`, `inland grotto`, `mouth`, `deep pool`, or `deep channel`. Each accepted headwater carries a compact arrow aligned to the signed X/Z flow vector stored in that accepted feature reference; Vision does not infer direction from nearby pixels. Rejected candidates use visibly separate `projected source`, `projected outlet`, and `projected deep fluid` colors. The immutable diagnostic plan retains each projected feature type and no-outlet/path, route-limit, short-course, quota, spacing, outlet-limit, ridge-length, exposed-length, outlet-level, cave, or volume rejection reason, while the current Vision legend groups them by candidate kind. They are absent from accepted footprints, biome samples, normal render samples, and locators.

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

Bukkit optional arguments use Director `key=value`, so the explicit non-teleporting form is `teleport=false`. Supported type selectors are `surface`, `waterfall`, `sinkhole`, `underground`, `grotto`, `coastal_grotto`, `inland_grotto`, `mouth`, `ridge_tunnel`, and `deep`. Any other value is treated as a deep-fluid ID and matches only `DEEP_POOL` or `DEEP_CHANNEL` features with that profile. Bukkit and modded completion append the active dimension's configured deep-fluid IDs to those built-ins; `deep_lava` appears only when the pack declares it. Built-in selector names, including hyphen-equivalent spellings such as `ridge-tunnel`, are reserved and cannot be deep-fluid IDs.

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

- current object types and numeric bounds;
- exact routing divisibility and at most 65,536 coarse lattice nodes;
- at most 262,144 derived refined route samples per tile across both independent source budgets;
- complete surface and underground course floors that do not exceed `maximumRouteLength`;
- at least one enabled outlet family;
- canonical inland surface-sinkhole enablement and outlet selection;
- ordered styled ranges and dimension-height fit;
- hydraulic threshold relationships;
- independent `shoreWidth` and `terrainBlendWidth` bounds;
- unique river-profile and deep-fluid IDs with nonempty fluid palettes, and no deep-fluid ID that collides with a built-in feature selector;
- deep-fluid spacing, footprint, depth, headroom, and height relationships;
- valid policy enums, nullable Boolean and numeric fields, unique references, and known profile IDs;
- existing biome references and the complete reachable policy/child/carving closure;
- required mantle and carving capabilities.

The validator permits at most 64 river profiles, 64 deep-fluid entries, and 128 references in each policy profile or biome list. Validation failure is blocking for world construction, Studio admission, and packaging.

For an offline generation gate, run Iris with Java 25 against the real pack:

```bash
./gradlew --no-daemon :probe:genProbe \
  -PprobePack=/absolute/path/to/pack \
  -PprobeDimension=<dimension-key>

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

The generation probe constructs the real engine and generates chunks into buffers. The hydrology probe scans explicit seed-tile combinations and fails unless every feature/profile selector required by that pack's enabled outlet topology is present for every seed. Its aggregate rendered-course gate checks broad-window curvature, alignment, turns, sinuosity, deviation, width continuity, hydraulic transitions, receiving basins, and one complete surface main stem per outlet. It also writes a top-down owned-water PNG and JSON morphology report for every seed. Each complete owned surface course rejects a cardinal or diagonal heading within 5 degrees across more than half its measured planform or for a continuous run longer than 64 blocks, an isolated turn above 35 degrees, a 95th-percentile turn above 35 degrees, a hard exposed endpoint, a widened source basin, a terminal cap shorter than two blocks or 20 percent of its width, an interior cross-section below `channel.width.min`, a sustained 32-block width collapse, a falling curtain that owns terrain, a missing or low cardinal bank edge, excessive centerline incision, or a meaningful off-center branch leaf. Any ocean ownership, ocean-floor mutation, or exposed hydrology ownership or mutation on naturally submerged terrain is also a blocking failure. Every published surface course is checked, and every required seed must publish its own witness; one seed cannot mask another seed's missing surface course. The generation-order probe hashes complete block and biome output across forward, reverse, shuffled, and bounded-parallel generation. Pack publication should validate the exact candidate tree, package the canonical closure, extract and validate the exact archive, and run all three probes before moving a release tag. A source-tree validation does not replace final-archive verification.

## Managed pack profiles

The managed Overworld and Underworld use 1,024-block watersheds, 64-block coarse samples, and 4-block refinement. Both managed packs require 384 exposed blocks per surface course and 384 blocks per underground course. Surface density is `1.75`, underground density is `1.5`, neither has an ordinary per-tile quota, and source spacing is 384/640 blocks. Each tile selects at most one outlet network, and each surface outlet publishes exactly one complete main stem with no tributary courses. When strict terrain, exposure, cave, or ocean admission rejects an optional surface source, the bounded replacement search may evaluate up to eight alternatives per requested course before moving to another legal outlet. Replacement surface sources retain the same deterministic global spacing rule even when their accepted courses immediately diverge.

The final terrain-refined route uses 192/48-block meander wavelengths, strengths `0.55`/`0.18`, a `0.45` offset ratio, and a 20-degree authored turn limit. It is not passed through a second broad coastal curve. Managed surface channels are 4–8 blocks wide and 1–3 blocks deep; managed underground channels are 3–8 blocks wide. Surface channels retain a fixed two-block centerline inset, at most six blocks of open incision, and `incisionMultiplier: 1.0` throughout the managed region and biome policies. A one-block content shore is surrounded by a 12–24-block carve-only parent-terrain grade; surface wall roughness `0.08` at wavelength `24` keeps that grade coherent instead of shattering the banks. Headwaters taper from the configured minimum width across a 48–64-block spring profile, or across the full available exposed run when it is shorter, without a radial source basin. A course whose initial exposed run is shorter than twice its cruise width is rejected instead of publishing a hard spring cutoff. Pools target 80–180 blocks between transitions; nearby drops without that recovery distance collapse into one terrain-feasible descent and one compact receiver. Exposed gradients advance in one-block steps unless the sampled terrain proves a waterfall-scale cliff, while excessive relief becomes one continuous contained arched mini-grotto before reopening. Overworld permits a continuous contained passage up to 384 blocks; Underworld retains its 192-block cap. Managed mouths use a 128-block leveling distance and an eight-block non-owning ocean apron, while the exposed route retains terrain-supported head to the proven coast and blends through a proportional flare. Underground passages connect to suitable existing caves and both grotto forms retain 10 blocks of dry headroom. Deep lava uses density `0.5`, 1,024-block spacing, and isolated contained pools without channel offshoots. Overworld enables direct mouths and coastal grottos; Underworld disables both and uses contained inland lava grottos and surface sinkholes.

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

## Performance and determinism

Cold accepted-plan work is controlled by `tileSize`, `sampleSpacing`, `refinementSpacing`, `maximumRouteLength`, both source budgets and spacing floors, complete-course floors, and the maximum channel, basin, grotto, and grading envelope. Smaller spacings, longer routes, more sources, and wider receiving or containment envelopes increase planner and raster work. Course floors reject low-value routes before publication; narrower wet channels reduce both accepted fluid volume and footprint work. Inland grotto connection direction is derived from its already-sampled legal outlet node, so outlet selection does not perform a second dense pass of one-block terrain samples. During one owner-plan settlement, reusable cave-candidate geometry is bounded to 256 entries and 262,144 retained positions; cave-validation observations use the same entry and position bounds. A warm column query reuses an immutable cached tile; the runtime retains at most 64 tiles.

Hydrology output is a deterministic function of pack bytes, world seed, and coordinates. The coarse graph, source quotas, outlet choice, refined centerlines, hydraulic segments, profile/content selection, and compiled footprint use stable identities and ordering. Tile, chunk, platform, and worker order must not change the accepted result. Use GoldenHash plus fresh-world feature inspection to verify that contract.

## Troubleshooting

| Symptom | Check |
|---------|-------|
| No surface features | `hydrology.rivers.enabled`, `surface.enabled`, source density/floor, `minimumElevation`, effective placement/routing policy, and legal outlets |
| No underground features | `underground.enabled`, its independent source budget, fluid-level fit, effective policy, and a legal coastal or inland outlet within that head range |
| A high route is absent | Effective incision may require a ridge bore longer than `ridgeTunnels.maximumLength`; inspect the accepted River network footprint |
| No inland grotto | Include `SINKHOLE_GROTTO` in `routing.inlandOutlets` and keep `grottos.inland.enabled` true |
| No coastal grotto | It needs an accepted coastal cliff/solid-terrain candidate, outlet admission, and `grottos.coastal.enabled` |
| Unexpected content | Check effective dimension → region → biome policy inheritance and whether an empty array cleared a pool |
| Missing biome in find/goto | Reference it from a reachable policy and ensure every child/carving key exists |
| No deep lava | Check the `deepFluids` entry density, height envelope, spacing/footprint relationship, and both `containedPools` / `shortChannels` switches |
| Hard boundary between generated areas | Use a new or fully regenerated world for the changed hydrology contract |
