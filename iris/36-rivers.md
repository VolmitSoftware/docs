---
title: "Rivers"
description: "Terrain-first surface and underground hydrology, outlets, biome policy, deep fluids, and accepted-plan tooling"
published: true
date: 2026-08-26T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-22T00:00:00.000Z
---
Iris hydrology plans terrain-guided surface rivers, independently sourced underground rivers, coastal and inland grottos, and independent deep-fluid bodies. The planner resolves the route, non-rising hydraulic head, segment type, terrain and fluid footprint, outlet, fluid profile, and biome ownership once. Terrain generation, mantle carving, biome selection, decorators, Vision, and feature locators consume that immutable accepted plan. `hydrology.rivers.enabled` defaults to `false`.

Hydrology is a persistent terrain contract. Create a new world or fully regenerate the affected world whenever its hydrology or river policies change. Generated chunks are not retrofitted with a different accepted plan.

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
        "tileSize": 2048,
        "sampleSpacing": 64,
        "refinementSpacing": 8,
        "maximumRouteLength": 16384,
        "oceanOutlets": true,
        "inlandOutlets": ["SINKHOLE_GROTTO"]
      },
      "surface": {
        "enabled": true,
        "sources": {
          "density": 0.5,
          "minimumElevation": 88,
          "minimumPerTile": 1
        },
        "channel": {
          "width": {
            "min": 4,
            "max": 32,
            "style": {"style": "IRIS", "zoom": 1024}
          },
          "depth": {
            "min": 2,
            "max": 5,
            "style": {"style": "IRIS", "zoom": 768}
          },
          "maximumIncision": 12,
          "shoreWidth": 2.0,
          "terrainBlendWidth": {
            "min": 4,
            "max": 10,
            "style": {"style": "IRIS", "zoom": 1024}
          }
        },
        "hydraulics": {
          "targetPoolLength": {
            "min": 48,
            "max": 160,
            "style": {"style": "IRIS", "zoom": 1024}
          },
          "riffleDrop": 1,
          "maximumGradualDrop": 3,
          "maximumGradualLength": 10,
          "waterfallMinimumDrop": 4
        },
        "ridgeTunnels": {
          "enabled": true,
          "maximumLength": 192,
          "headroom": 10
        },
        "mouths": {
          "levelingDistance": 64,
          "maximumOceanApron": 2
        }
      },
      "underground": {
        "enabled": true,
        "sources": {
          "density": 0.5,
          "minimumPerTile": 1
        },
        "fluidLevel": {
          "min": -48,
          "max": 50,
          "style": {"style": "IRIS", "zoom": 1024}
        },
        "channelWidth": {
          "min": 4,
          "max": 18,
          "style": {"style": "IRIS", "zoom": 768}
        },
        "depth": {
          "min": 2,
          "max": 5,
          "style": {"style": "IRIS", "zoom": 768}
        },
        "headroom": {
          "min": 6,
          "max": 14,
          "style": {"style": "IRIS", "zoom": 768}
        },
        "connectToExistingCaves": true
      },
      "grottos": {
        "coastal": {
          "enabled": true,
          "poolLevel": "SEA_LEVEL",
          "horizontalRadius": 12,
          "verticalRadius": 7,
          "headroom": 4,
          "maximumVolume": 8192
        },
        "inland": {
          "enabled": true,
          "connectSurfaceRivers": true,
          "horizontalRadius": 10,
          "verticalRadius": 6,
          "headroom": 4,
          "maximumVolume": 8192
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
        "density": 0.15,
        "spacing": 1024,
        "horizontalRadius": 28,
        "verticalRadius": 11,
        "channelWidth": 4,
        "depth": 2,
        "headroom": 5,
        "containedPools": true,
        "shortChannels": true
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

Every object with `min` and `max` is an `IrisStyledRange`. `style` is optional; when present it selects a deterministic value between the endpoints in world space. Width and depth are resolved along selected course pairs before confluence flow widens them toward their configured maxima; pool length is resolved at the accepted course origin; terrain blend and underground headroom are resolved along accepted centerlines; and underground or deep-fluid elevation is resolved only for selected outlet, course, or deep-source geometry. Those resolved values are stored in the immutable accepted plan rather than resampled by generation, rendering, or inspection.

## Physical configuration

### `hydrology.rivers.routing`

| Field | Default | Contract |
|-------|---------|----------|
| `tileSize` | `2048` | Accepted-plan tile width in blocks, `256..8192` |
| `sampleSpacing` | `64` | Coarse terrain/policy lattice spacing, `8..512`; must divide `tileSize` |
| `refinementSpacing` | `8` | Refined centerline spacing, `1..64`; must divide `sampleSpacing` |
| `maximumRouteLength` | `16384` | Maximum source-to-outlet route length, `256..32768` blocks |
| `oceanOutlets` | `true` | Allows direct sea mouths; qualifying coastal cliffs can instead select an enabled coastal grotto |
| `inlandOutlets` | empty | Allowed inland terminal types; the current value is `SINKHOLE_GROTTO` |

At least one outlet family must be enabled. `tileSize`, both spacings, route length, and both source budgets also form a bounded planning envelope; see [Validation](#validation).

### `hydrology.rivers.surface`

`surface.enabled` controls only exposed, terrain-following courses. It does not control the independent underground or deep-fluid budgets.

| Section or field | Default | Purpose |
|------------------|---------|---------|
| `sources.density` | `0.5` | Expected surface sources per plan tile, `0..64` |
| `sources.minimumElevation` | `88` | Minimum absolute world Y for a surface source, `-2048..2048` and below the dimension maximum |
| `sources.minimumPerTile` | `1` | Deterministic source floor when legal candidates and outlets exist, `0..64` |
| `channel.width` | `4..32` | Full channel width, with both endpoints in `1..64` |
| `channel.depth` | `2..5` | Bed depth below the solved local head, endpoints in `1..32` |
| `channel.maximumIncision` | `12` | Maximum permitted surface cut before the course needs a ridge bore, `0..64` |
| `channel.shoreWidth` | `2` | River-specific shore content band, `1..2` blocks |
| `channel.terrainBlendWidth` | `4..10` | Outer physical grading band; each endpoint must remain in `4..10` and outside `shoreWidth` |

Shore content and physical grading are independent. The narrow shore band may select `shoreBiomes`; the wider outer grade retains the exact parent biome and its surface layers.

### Hydraulic transitions

Minecraft fluid surfaces are level per pool, so the planner converts every downstream head loss into an explicit transition.

| Field | Default | Purpose |
|-------|---------|---------|
| `targetPoolLength` | `48..160` | Preferred level-pool length, endpoints in `8..4096` |
| `riffleDrop` | `1` | Largest drop classified as a riffle, `0..16` |
| `maximumGradualDrop` | `3` | Largest drop eligible for a gradual cascade, `0..64` |
| `maximumGradualLength` | `10` | Maximum horizontal length for that gradual transition, `1..1024` |
| `waterfallMinimumDrop` | `4` | First drop classified as a waterfall, `1..128` |

`riffleDrop` cannot exceed `maximumGradualDrop`; `waterfallMinimumDrop` equals `maximumGradualDrop + 1`; `maximumGradualLength` is at least `maximumGradualDrop`; and `targetPoolLength.min` is at least `maximumGradualLength`.

There is no occurrence gate. A positive head loss always becomes a riffle, cascade, waterfall, or underground drop. Falling segments own an upstream source-fluid lip, a continuous falling-fluid throat with the platform fluid-update state, and a lower receiving pool in the accepted footprint.

### Ridge tunnels and mouths

| Section or field | Default | Purpose |
|------------------|---------|---------|
| `ridgeTunnels.enabled` | `true` | Lets one surface course bore through excessive local relief and reopen |
| `ridgeTunnels.maximumLength` | `192` | Maximum continuous bore length, `1..4096` and no greater than the route length |
| `ridgeTunnels.headroom` | `10` | Dry clearance above the fluid head, `1..128` |
| `mouths.levelingDistance` | `64` | Landward distance used to reach sea level before the ocean boundary, `0..2048` and no greater than the route length |
| `mouths.maximumOceanApron` | `2` | Maximum non-owning accepted connection apron in ocean columns, `0..64` |

An ocean apron owns no terrain, fluid, shore, or grading writes. It records the accepted connection for rendering and inspection while the ocean reservoir remains authoritative.

### `hydrology.rivers.underground`

Underground courses use their own `enabled`, `sources.density`, and `sources.minimumPerTile`. A rejected or absent surface source does not consume the underground budget.

| Field | Default | Purpose |
|-------|---------|---------|
| `fluidLevel` | `-48..50` | Absolute world-Y range for underground heads; each endpoint is within `-2048..2048` and the optional style chooses locally |
| `channelWidth` | `4..18` | Contained channel width; endpoints in `1..64` |
| `depth` | `2..5` | Bed depth below the local head; endpoints in `1..32` |
| `headroom` | `6..14` | Dry space above the local head; endpoints in `1..128` |
| `connectToExistingCaves` | `true` | Lets accepted dry headroom open into suitable existing cave matter where the two touch; the course does not require a pre-existing cave |

Fluid level, depth, and headroom must fit strictly inside `dimensionHeight`. Underground heads remain non-rising downstream. Drops become `UNDERGROUND_DROP` features with falling fluid and a receiving pool; level runs become `UNDERGROUND_POOL`.

### Grottos

`grottos.coastal` and `grottos.inland` have separate admission and geometry:

| Field | Coastal default | Inland default | Contract |
|-------|-----------------|----------------|----------|
| `enabled` | `true` | `true` | Allows this outlet chamber type |
| `poolLevel` | `SEA_LEVEL` | not present | Coastal value must be `SEA_LEVEL` |
| `connectSurfaceRivers` | not present | `false` | Lets eligible surface courses continue through an explicit falling sinkhole into the contained pool; requires the inland grotto and `SINKHOLE_GROTTO` routing outlet |
| `horizontalRadius` | `12` | `10` | `1..128` |
| `verticalRadius` | `7` | `6` | `1..64` |
| `headroom` | `4` | `4` | `1..63` and less than the full chamber height |
| `maximumVolume` | `8192` | `8192` | `1..1048576` distinct accepted mutation positions owned by that grotto segment |

A coastal grotto is admitted only at a proven coastal land/ocean boundary. Its pool is at sea level and opens directly into the ocean reservoir. An inland grotto is available only when `routing.inlandOutlets` includes `SINKHOLE_GROTTO`. Proven ocean mouths and coastal grottos have tile-wide priority; inland candidates are considered only when no legal coastal outlet exists.

When `grottos.inland.connectSurfaceRivers` is `true`, an eligible surface source retains one course through a `SINKHOLE` falling throat and into its terminal `INLAND_GROTTO` receiving pool. The accepted link includes dry headroom and is validated and published as one containment transaction. When the field is `false`, surface sources cannot route to inland grotto outlets, while independently sourced underground courses remain eligible for them.

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

Spacing must contain the complete horizontal footprint, depth plus headroom must fit inside the vertical diameter, and the height envelope must fit inside the dimension. A short channel has no separate authored length: its maximum length is `max(refinementSpacing, spacing / 3)`, capped to half `routing.tileSize`, and its derived containment-volume bound may shorten it further. The half-tile cap keeps neighboring-plan publication work bounded even when `spacing` is much larger than the tile. The managed Overworld uses a `deep_lava` entry independently of its water river profile.

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
| `incisionMultiplier` | Local surface-incision scale, `0..16` |
| `routingMultiplier` | Local route-cost scale, `0..64` |

The planner selects and stores the exact profile and biome keys in each accepted column layer. Later generation stages do not reselect them. Referenced biomes, their children, and carving references join the active dimension reachable closure, so retained river-only surface content is available to biome find/goto commands.

## How the planner works

For each bounded hydrology tile Iris:

1. samples natural height, slope, ocean classification, cave suitability, and effective policy on the coarse lattice;
2. proves coastal mouths or grottos first, then permitted inland grottos when needed;
3. builds one acyclic drainage potential toward accepted outlets;
4. admits surface and underground sources from separate budgets;
5. routes toward valleys with uphill and slope penalties, policy cost, and confluence attraction;
6. refines accepted coarse edges at `refinementSpacing`;
7. solves a non-rising head from each source to its outlet and pools it to the target lengths;
8. classifies every segment from its solved head and terrain relationship;
9. compiles exact terrain, fluid, shore, grading, biome, cave, render, and locator footprints;
10. validates every course with a subterranean footprint as one containment transaction against authoritative carved mantle matter;
11. prunes any rejected course and publishes the remaining immutable `HydrologyTile`.

The tile contains sorted drainage nodes, edges, outlets, courses, features, accepted cave actions and baseline preconditions, and a `RiverFootprint`. A course cannot rise hydraulically downstream. Every drainage edge lowers potential, so accepted graphs are acyclic and tributaries converge rather than split downstream.

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
| `MOUTH` | Surface or underground course leveled into the ocean |
| `DEEP_POOL` | Independent contained deep-fluid pool |
| `DEEP_CHANNEL` | Independent short deep-fluid channel |

Feature references also carry stable feature, course, and segment IDs, coordinates, flow direction, and a source marker. Vision and locator commands consume these accepted references.

## Terrain, oceans, caves, and decoration

### Surface shaping and banks

The surface bed is derived from natural terrain and the solved local fluid head. A rolling route grades smoothly across the configured outer band. A steep natural wall retains a sharper signed-distance transition. If a required cut exceeds the effective incision limit, the same course may enter a contained ridge bore and reopen after the obstruction; it is not replaced by a disconnected surface trace.

Only the inner `shoreWidth` can use river-shore content. The rest of the grade retains the natural parent biome. The final channel width and depth include source-contribution growth plus effective region/biome multipliers, so confluences can widen and deepen downstream.

### Ocean boundary

The accepted plan resolves the first true natural land/ocean crossing. It reaches the dimension sea level across `mouths.levelingDistance`, stops river-owned terrain and fluid on the landward side, and records at most `maximumOceanApron` blocks of non-owning accepted connection footprint in the ocean.

Ocean columns reject river-owned solids, elevated fluid, shore content, and grading. A mouth or coastal grotto cannot turn along the coastline, raise the sea, place a wall across it, or excavate an ocean channel.

### Mantle and cave containment

Any active river or deep-fluid configuration requires:

- `useMantle: true`
- `carvingEnabled: true`
- `CARVED` absent from `disabledComponents`
- `RIVER_HYDROLOGY` absent from `disabledComponents`

Before an immutable tile becomes visible, its cave view lazily generates every prerequisite `CARVED` chunk and reads the resulting `MatterCavern` plus any platform fluid state. Iris validates the complete subterranean footprint of each underground course, surface course with a ridge bore or sinkhole continuation, grotto course, and deep-fluid body as one candidate. A surface sinkhole's falling throat, receiving wet pool, and dry headroom therefore succeed or fail with the rest of that same course. An unapproved opening to the surface or another cavern, a world-boundary or volume escape, existing or incompatible fluid, or overlap with a winning plan rejects the entire course; its graph references and footprint are removed before terrain, Vision, or locators can observe it.

An accepted cave plan stores every bed, wet source, falling throat, dry-headroom, and seal-guard action together with the exact baseline cave preconditions used for admission. The mantle pass rechecks all relevant preconditions before compiling a chunk and publishes nothing from that chunk when any check differs, so it cannot write a partial local subset after its proof becomes invalid. When `connectToExistingCaves` is enabled, a planned dry boundary may open into suitable cave air without exposing the wet volume. Hydrology-owned cells and seal guards remain protected from later object or structure writes that would break containment; the cave network never becomes a shared reservoir.

### Decorators and freezing

River decorators use the final accepted connected-fluid state. Shore-line and sea-surface passes use the accepted local head for a wet river column and the dimension sea level for an ordinary ocean. Rejected waterloggable placements restore their prior block state atomically. A non-water river profile clears waterlogging instead of introducing water into that fluid.

Exposed water is published as ordinary water. The standard exposed-water freezing pass decides where ice forms after hydrology, so frozen rivers do not carry a prebuilt moving surface pattern.

## Vision and feature location

The normal **Biome** view composites accepted surface hydrology content over the natural biome field. The **River network** view reads the accepted feature footprint and labels it `headwater / source`, `surface pool`, `riffle`, `cascade`, `waterfall`, `sinkhole`, `ridge bore`, `underground pool`, `underground drop`, `coastal grotto`, `inland grotto`, `mouth`, `deep pool`, or `deep channel`. Each accepted headwater carries a compact arrow aligned to the signed X/Z flow vector stored in that accepted feature reference; Vision does not infer direction from nearby pixels. Rejected candidates use visibly separate `projected source`, `projected outlet`, and `projected deep fluid` colors. The immutable diagnostic plan retains each projected feature type and no-outlet/path, route, quota, spacing, outlet-limit, ridge, outlet-level, cave, or volume rejection reason, while the current Vision legend groups them by candidate kind. They are absent from accepted footprints, biome samples, normal render samples, and locators.

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
```

The probe constructs the real engine and generates chunks into buffers. Pack publication should validate the exact candidate tree, package the canonical closure, extract and validate the exact archive, and run this probe before moving a release tag. A source-tree validation does not replace final-archive verification.

## Managed pack profiles

The managed Overworld and Underworld use the same bounded physical tuning shown in the complete example: 2,048-block tiles, 64-block coarse samples, 8-block refinement, independent `0.5` surface and underground source densities, one minimum source per eligible tile, 4–32-block surface widths, a 2-block content shore, 4–10-block parent-terrain grading, automatic hydraulic transitions, ridge bores, both grotto types, and surface continuation through contained inland sinkholes when no legal ocean outlet exists.

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

Cold accepted-plan work is controlled by `tileSize`, `sampleSpacing`, `refinementSpacing`, `maximumRouteLength`, both source budgets, and the physical footprint widths. Smaller spacings, longer routes, more sources, and wider containment envelopes increase planner work. A warm column query reuses an immutable cached tile; the runtime retains at most 64 tiles.

Hydrology output is a deterministic function of pack bytes, world seed, and coordinates. The coarse graph, source quotas, outlet choice, refined centerlines, hydraulic segments, profile/content selection, and compiled footprint use stable identities and ordering. Tile, chunk, platform, and worker order must not change the accepted result. Use GoldenHash plus fresh-world feature inspection to verify that contract.

## Troubleshooting

| Symptom | Check |
|---------|-------|
| No surface features | `hydrology.rivers.enabled`, `surface.enabled`, source density/floor, `minimumElevation`, effective placement/routing policy, and legal outlets |
| No underground features | `underground.enabled`, its independent source budget, fluid-level fit, effective policy, and legal outlets |
| A high route is absent | Effective incision may require a ridge bore longer than `ridgeTunnels.maximumLength`; inspect the accepted River network footprint |
| No inland grotto | Include `SINKHOLE_GROTTO` in `routing.inlandOutlets` and keep `grottos.inland.enabled` true |
| No coastal grotto | It needs an accepted coastal cliff/solid-terrain candidate, outlet admission, and `grottos.coastal.enabled` |
| Unexpected content | Check effective dimension → region → biome policy inheritance and whether an empty array cleared a pool |
| Missing biome in find/goto | Reference it from a reachable policy and ensure every child/carving key exists |
| No deep lava | Check the `deepFluids` entry density, height envelope, spacing/footprint relationship, and both `containedPools` / `shortChannels` switches |
| Hard boundary between generated areas | Use a new or fully regenerated world for the changed hydrology contract |
