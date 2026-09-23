---
title: "Caves & Carving"
description: "Iris documentation: Caves & Carving"
published: true
date: 2026-09-23T11:12:42.385Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Configure cave shape with `caveProfile` on a dimension, region or biome. Cave biomes provide floor, ceiling and wall materials, decorations and objects. Iris uses these settings instead of vanilla carvers; there are no separate `caves/` or `ravines/` resource folders.

Related:

- [11 - Dimensions](/iris/11-dimensions)
- [12 - Regions](/iris/12-regions)
- [13 - Biomes](/iris/13-biomes)
- [14 - Generators & Noise](/iris/14-generators-noise)
- [16 - Surfaces, Decorators & Deposits](/iris/16-surfaces-decorators-deposits)
- [17 - Procedural Objects](/iris/17-procedural-objects)
- [20 - Object Placement](/iris/20-object-placement)
- [21 - Jigsaw Structures](/iris/21-jigsaw-structures)
- [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks)
- [35 - Vanilla Passthrough](/iris/35-vanilla-passthrough)
- [47 - Volumetric Terrain](/iris/47-volumetric-terrain)

The current built-in pack sources include [Sulfur Galleries and Hollows](/iris/biomes/carving/sulfur), a 26.2 cave family derived from the dripstone profiles with sulfur spikes, banded mineral formations and contained pools. The paired Underworld uses the same shapes with lava and Nether ecology.

## Biome overhangs and cave carving

Dimension `focus` preserves the owning region when targeting a child or cave biome, including flooded cave targets. Its regional cave profile remains active in focused Studio previews.

Biome [`terrain3D`](/iris/47-volumetric-terrain) creates solid spans and open gaps during terrain generation. It works independently of `carvingEnabled` and can add volume as well as remove it. Cave profiles operate on the resulting terrain. Natural gaps beneath overhangs retain their surface biome and receive surface decoration on their ledges. Cave aquifers do not fill these gaps. Hydrology channels keep their terrain and fluids.

## Cave shape and content

A cave profile controls the shape, depth, surface openings and liquids of caves. Cave biomes supply `layers` and floor decorators, `caveCeilingLayers` and `CEILING` decorators, and the `wall` palette. Floors, ceilings and walls can use different cave biomes where a cave crosses a biome boundary.

Deposits do not fill carved openings, and surface decorators require ground beneath them.

### Two different Y coordinates

Some settings measure height from the build floor; others use absolute world Y:

| Height above the build floor | Absolute world Y |
|---|---|
| `caveProfile.verticalRange` | `carving[].worldYRange` |
| `IrisCaveFieldModule.verticalRange` | structure placement `minHeight` / `maxHeight` |
| dimension `caveLavaHeight` | dimension `fluidHeight`; `depositVariants[].minHeight` / `maxHeight` |

With the default `dimensionHeight` of `-64..320`, height `0` above the build floor is world Y `-64`, and height `64` is world Y `0`. A profile `verticalRange` of `{ "min": 0, "max": 64 }` therefore covers the deepslate band, not the surface.

## Walkthrough: create caves

Start from an `OVERWORLD` pack with `carvingEnabled` and `useMantle` enabled. Do not list `CARVED` in `disabledComponents`.

1. Record seed `1337` and a surface coordinate in Studio before you touch anything. You can then compare the same spot afterwards.
2. Add this to the root object of `dimensions/<key>.json`. It uses production density defaults but seals the surface and disables both liquids:

```json
{
  "carvingEnabled": true,
  "caveProfile": {
    "enabled": true,
    "verticalRange": { "min": 16, "max": 96 },
    "allowSurfaceBreak": false,
    "surfaceClearance": 8,
    "allowFluid": false,
    "allowLava": false
  }
}
```

3. Validate the pack and reopen Studio. Only **freshly generated** chunks change. Fly out past your previously generated area or use a new Studio world.
4. Dig down between world Y `-48` and `32` (engine-local 16 to 96 with the default height range). Success is open cave volume with intact grass overhead, no water pockets, and no lava at the bottom of the band.

## Walkthrough: give one biome its own cave shape

Profiles resolve per column. The **last enabled profile in the chain wins**:

```
dimension.caveProfile → region.caveProfile → surface biome.caveProfile → cave biome.caveProfile
```

A disabled profile (`enabled: false`, the default) is skipped entirely rather than blocking the level above it. A biome only overrides the dimension when its own profile is explicitly enabled.

To give one surface biome tight, dense tunnels while the rest of the world keeps the dimension caverns, put an enabled profile on that biome:

```json
{
  "caveProfile": {
    "enabled": true,
    "verticalRange": { "min": 8, "max": 110 },
    "baseDensityStyle": { "style": "SIMPLEX_VASCULAR", "zoom": 0.9 },
    "detailDensityStyle": { "style": "SIMPLEX", "zoom": 0.6 },
    "baseWeight": 1,
    "detailWeight": 0.2,
    "densityThreshold": { "min": -0.22, "max": -0.14 },
    "thresholdBias": 0.16,
    "allowSurfaceBreak": false,
    "allowFluid": false
  }
}
```

Iris blends profiles across the biome edge instead of cutting them off, so a strong profile fades out over roughly three blocks rather than ending on a chunk-shaped seam.

At most **two** blended profiles run per chunk. When more than two are present, the lowest-weight ones are folded into whichever kept profile dominates each column. Profiles pulled in by dimension `carving` entries are added on top of that limit and are not subject to it.

## Walkthrough: paint the inside of a cave

Carving produces empty space and nothing else. Materials, plants, and props come from a **cave biome**. That is an ordinary biome JSON that Iris happens to look up underground.

1. Write `biomes/carving/mossy.json` as a normal biome. Omit height generators; they have no effect on cave terrain.

```json
{
  "name": "Mossy Caverns",
  "derivative": "minecraft:lush_caves",
  "vanillaDerivative": "minecraft:lush_caves",
  "layers": [
    { "minHeight": 1, "maxHeight": 1, "palette": [{ "block": "minecraft:moss_block" }] },
    { "minHeight": 1, "maxHeight": 2, "palette": [{ "block": "minecraft:dirt" }] }
  ],
  "caveCeilingLayers": [
    { "minHeight": 1, "maxHeight": 1, "palette": [{ "block": "minecraft:moss_block" }] }
  ],
  "wall": {
    "palette": [
      { "block": "minecraft:stone" },
      { "block": "minecraft:mossy_cobblestone" }
    ]
  },
  "decorators": [
    { "chance": 0.25, "palette": [{ "block": "minecraft:moss_carpet" }] },
    {
      "partOf": "CEILING",
      "chance": 0.12,
      "palette": [{ "block": "minecraft:cave_vines" }]
    }
  ]
}
```

2. List it in a region `caveBiomes` pool:

```json
{ "caveBiomes": ["carving/mossy"] }
```

3. Regenerate and look inside a cave in that region. Success is a moss floor, a moss ceiling, mixed stone walls, carpets on the floor and vines on the roof.

Two rules decide whether any of this appears:

- **A cave opening must be at least 3 blocks tall to receive cave materials and decoration.** Two-block-tall crawlspaces keep raw stone.
- **Floor layers only overwrite solid blocks.** They descend from the block below the lowest carved cell. Where the layer stack runs into existing air, it stops. Ore blocks in the floor are converted to the deepslate variant matching the layer instead of being erased. An iron vein exposed in a deepslate cave floor stays iron.

### How Iris picks the cave biome at a point

For a given `(x, y, z)`, in order:

1. If an enabled dimension `carving[]` entry `worldYRange` contains the absolute world Y, its biome wins outright. Child entries subdivide that band into patches.
2. Otherwise the region `caveBiomes` pool is sampled by `caveBiomeStyle` and biome `rarity`, zoomed by the dimension `biomeZoom` multiplied by the region `caveBiomeZoom`. An omitted or empty pool uses the surface biome for biome queries and saved generation history. It does not enable cave generation.
3. If the sampled cave biome `caveMinDepthBelowSurface` is deeper than the point, the **surface** biome is used instead. The same fallback applies if the point is at or above the surface.

Neighboring cave biomes blend through a speckled transition band.

`carvingBiome` on a surface biome does not select underground cave content. Use region `caveBiomes` or a dimension `carving` band instead.

A biome used by an enabled dimension `carving` band does not also need to appear in a region list.

## Fluids and lava inside caves

Aquifers and deep lava are two independent mechanisms. Neither changes cave geometry.

Both packs disable standalone aquifers in dimension, region, and biome cave profiles. Contained hydrology and natural surface fluids remain active, using water in Overworld and lava in Underworld. Deep lava retains its separate controls.

**Deep lava** fills profile-carved space at or below `caveLavaHeight`, measured above the build floor (default `8`). Set the profile's `allowLava` to false to keep those caves dry. This setting does not prevent other features, such as structure boring, from creating lava-filled openings below that height.

**Aquifers** use the dimension `fluidPalette`, which defaults to water and accepts a weighted block palette. Change it to lava for lava aquifers. Aquifers stay below both `fluidHeight` and the depth required by `fluidMinDepthBelowSurface`, do not replace deep lava, and become less frequent at greater depths. With `fluidRequiresFloor: true`, they require a supported, mostly enclosed pocket.

Caves preserve the seabed and the solid boundaries of generated surface water. They can continue below those boundaries or open above the waterline.

Underground rivers, grottos and deep-fluid bodies remain contained and protected from object and structure placements. Their settings are separate from cave aquifers. See [36 - Rivers](/iris/36-rivers).

Set `allowFluid: false` to disable generated cave aquifers. It does not remove natural surface bodies or player-placed fluid. Combine it with `allowLava: false` when the generated cave interior itself must contain neither aquifers nor deep lava. Use `allowFluid`, `fluidMinDepthBelowSurface` and `fluidRequiresFloor`; the former `allowWater`, `waterMinDepthBelowSurface` and `waterRequiresFloor` names are rejected by validation.

## Surface openings

Set `allowSurfaceBreak: true` to allow cave mouths. `surfaceBreakStyle` controls their distribution; lower `surfaceBreakNoiseThreshold` values create more openings. `surfaceBreakDepth` and `surfaceBreakThresholdBoost` control how widely caves open near the surface.

Elsewhere, `surfaceClearance` sets the minimum roof thickness. Oceans and lakes retain a solid boundary so surface openings do not drain them.

After materials are applied, an ore block sitting on the surface directly above a carved, unsupported cell is deleted. That prevents a floating ore cap over a cave mouth. Supported surface ores and underground ores are untouched.

For sealed caves: `allowSurfaceBreak: false` plus a larger `surfaceClearance`. For more openings: lower `surfaceBreakNoiseThreshold` (it is a signed noise cutoff, so `0.4` opens far more columns than `0.62`).

## Dimension gates

| Field | Type | Default | What it does |
|-------|------|---------|--------------|
| `carvingEnabled` | boolean | `true` | Master switch. Set false to disable cave carving throughout the dimension |
| `caveProfile` | `IrisCaveProfile` | disabled | The fallback profile for every column no region or biome overrides. This is where most packs put their cave system |
| `carving` | `IrisDimensionCarvingEntry[]` | `[]` | Absolute-world-Y bands that force a specific cave biome regardless of surface biome. Use for a global deep dark or a magma layer |
| `caveBiomeStyle` | `IrisGeneratorStyle` | cellular iris double | Shape of the patches that pick between a region `caveBiomes`. Cellular gives blobby cave regions. Wispy styles give streaks |
| `caveLavaHeight` | int 0..318 | `8` | Height above the build floor at or below which caves fill with lava when `allowLava` is true |
| `requireObjectSurfaceSupport` | boolean | `true` | Refuses to place surface objects and trees over a carve opening. Turn off only if you want trees hanging over cave mouths |
| `objectSurfaceSupportBuffer` | int 0..16 | `2` | Blocks of solid ground required around a surface object footprint. A placement can ask for more but never less |
| `upperDimensionCarving` | boolean | `false` | Lets caves cut into the inverted ceiling terrain of an `upperDimension`. Off leaves the canopy a solid slab |
| `useMantle` | boolean | `true` | Turning this off disables carving, objects, and structures together |

## Cave profile (`IrisCaveProfile`)

Snippet key: `cave-profile`. Valid on **dimension**, **region**, and **biome**.

### Extent and shape

| Field | Type | Default | What it does |
|-------|------|---------|--------------|
| `enabled` | boolean | `false` | Set true to enable this profile. Disabled profiles do not override enabled dimension, region or biome profiles |
| `verticalRange` | `IrisRange` | `0..384` | Engine-local Y window this profile may carve in. Clamp it to keep caves out of the deepslate floor or the sky |
| `verticalEdgeFade` | int 0..128 | `20` | Blocks of smoothstep taper at both ends of `verticalRange`. Without it caves are sliced off flat at the boundary |
| `verticalEdgeFadeStrength` | double 0..1 | `0.18` | How hard the taper pushes toward solid. Raise it if the top and bottom of your cave band still look cut |
| `baseDensityStyle` | `IrisGeneratorStyle` | cellular iris double | The field that decides overall cave layout. Cellular reads as chambers and connecting tunnels. Simplex reads as sponge |
| `detailDensityStyle` | `IrisGeneratorStyle` | simplex | Added on top of the base field to roughen walls. Keep its weight low or it dissolves the base structure |
| `warpStyle` | `IrisGeneratorStyle` | flat | Domain warp applied to the sample coordinates. Only has an effect when `warpStrength` is above zero |
| `baseWeight` | double >= 0 | `1` | Contribution of the base field. All weights are normalized, so raising this is equivalent to lowering the others |
| `detailWeight` | double >= 0 | `0.35` | Contribution of the detail field. Above about `0.5` the base layout stops being readable |
| `warpStrength` | double >= 0 | `0` | Block distance the warp displaces samples. Small values (0.2 to 1) bend straight tunnels. Large values create more distorted cave shapes |
| `densityThreshold` | `IrisStyledRange` | `-0.2..0.2`, cellular iris double | The carve cutoff, itself noise-varied across the world so cave size differs region to region. Set `min` equal to `max` for a constant threshold. Writing `{}` is rejected by validation. It would resolve to the shared 16..32 default and hollow the whole vertical range |
| `thresholdBias` | double 0..1 | `0.16` | Subtracted from the sampled threshold before the test. Lower it for more carved space. Raise it for less. This is the single knob to reach for when caves are globally too big or too small |

### Sampling

| Field | Type | Default | What it does |
|-------|------|---------|--------------|
| `sampleStep` | int 1..8 | `1` | Keep at 1 or 2 for detailed cave shapes. Values of 3 or higher produce blocky 2x2 walls and uncarved horizontal bands |
| `adaptiveSampling` | boolean | `true` | Reduces generation work when `sampleStep` is 1 or 2. Leave enabled for normal use |
| `adaptiveSampleStep` | int 2..4 | `2` | Controls how conservatively adaptive sampling preserves detail: 2 favors detail, while 4 permits more approximation |
| `adaptiveThresholdMargin` | double 0..1 | `0.04` | Raise to preserve more detail near cave edges when adaptive sampling clips thin tunnels |

### Surface interaction

| Field | Type | Default | What it does |
|-------|------|---------|--------------|
| `surfaceClearance` | int 0..64 | `4` | Minimum solid roof thickness below terrain in non-breaking columns. A 12-block density taper below that limit closes large caves without a flat clipped ceiling |
| `allowSurfaceBreak` | boolean | `true` | Master switch for cave mouths. False makes every column obey `surfaceClearance` |
| `surfaceBreakStyle` | `IrisGeneratorStyle` | simplex, zoom `0.08` | 2D field that decides which columns may break through. Its zoom sets how large a single opening is |
| `surfaceBreakNoiseThreshold` | double -1..1 | `0.62` | Signed cutoff on that field. Lower means more and wider openings |
| `surfaceBreakDepth` | int 0..64 | `18` | How far below the surface the relaxed threshold applies. Too small and openings pinch shut just under the grass |
| `surfaceBreakThresholdBoost` | double 0..1 | `0.2` | How much easier carving gets inside that depth window |

### Cave object anchoring

These apply to `.iob` placements and procedural objects marked `carvingSupport: CARVING_ONLY`. See [20 - Object Placement](/iris/20-object-placement) and [17 - Procedural Objects](/iris/17-procedural-objects).

Biome-owned cave objects anchor only in cells owned by that exact cave biome. Region-owned cave objects intentionally span the region cave biomes. Unless the placement sets `underwater: true`, candidate anchors must be dry cavern cells above `caveLavaHeight`. Explicit fluid, explicit lava, and default-lava cells are skipped.

| Field | Type | Default | What it does |
|-------|------|---------|--------------|
| `objectMinDepthBelowSurface` | int 0..64 | `6` | Cave objects will not anchor closer than this to the surface, so props do not appear inside a cave mouth |
| `defaultObjectAnchor` | `IrisCaveAnchorMode` | `FLOOR` | Anchor used by any cave placement that leaves its own anchor at `PROFILE_DEFAULT` |
| `defaultObjectPlaceMode` | `ObjectPlaceMode` | unset | Overrides the place mode of cave placements, **but only for placements still on the default `CENTER_HEIGHT`**. Set it to `FAST_MIN_STILT` or `ORGANIC_STILT` so props tile down to the cave floor instead of hovering |
| `anchorScanStep` | int 1..8 | `1` | Vertical step while scanning a column for anchors. Above 1 it can step over one-block ledges |
| `anchorSearchAttempts` | int 1..64 | `6` | Random columns tried per chunk before giving up on a cave placement. Raise it when caves are sparse and props rarely appear |

### Liquids

| Field | Type | Default | What it does |
|-------|------|---------|--------------|
| `allowFluid` | boolean | `true` | Enables generated cave aquifers from the dimension `fluidPalette`. It does not control natural surface bodies |
| `fluidMinDepthBelowSurface` | int 0..64 | `12` | Aquifers stay at least this far below the terrain surface, which keeps water from bleeding out of a hillside |
| `fluidRequiresFloor` | boolean | `true` | Requires a supported, mostly enclosed pocket. Turning it off allows more aquifer fluid, including flows down shafts |
| `allowLava` | boolean | `true` | When false, caves carved by this profile remain dry below `caveLavaHeight` |

### Density module (`IrisCaveFieldModule`)

Snippet key: `cave-field-module`. Modules are extra density layers summed into the base and detail fields inside their own Y window. Adding a module with a distinct style is how you get two *kinds* of cave in one profile. Wide chambers from the base field plus a wormy tunnel network from a module. Raising `detailWeight` alone cannot do that.

| Field | Type | Default | What it does |
|-------|------|---------|--------------|
| `style` | `IrisGeneratorStyle` | cellular iris double | The module own field. Pick something structurally different from `baseDensityStyle` or the module just adds noise |
| `weight` | double >= 0 | `1` | Contribution relative to the base and detail fields. Start around `0.1` |
| `threshold` | double -1..1 | `0` | Offset subtracted from the module sample before weighting, shifting the module toward carving or toward solid |
| `verticalRange` | `IrisRange` | `0..384` | Engine-local Y window where the module contributes at all. Use it for a tunnel layer that exists only in the mid-depths |
| `invert` | boolean | `false` | Flips the module sign, so it *fills* where it would have carved. Useful for punching solid pillars and ribs through an otherwise open cavern |

### Anchor modes (`IrisCaveAnchorMode`)

| Value | Anchor it selects |
|-------|-------------------|
| `PROFILE_DEFAULT` | Defer to the active profile `defaultObjectAnchor`. Resolves to `FLOOR` if that is also unset |
| `FLOOR` | Carved cell with solid directly below. Standing props, stalagmites, chests |
| `CEILING` | Carved cell with solid directly above. Hanging roots, stalactites, `CEILING_HANG` objects |
| `CENTER` | Carved cell with no solid immediately above or below. Floating props in open air |
| `ANY` | Any carved cell |

A placement using `ObjectPlaceMode.CEILING_HANG` is forced to the `CEILING` anchor regardless of what its anchor field says.

## Dimension carving entries (`IrisDimensionCarvingEntry`)

Snippet key: `dimension-carving-entry`. These override the cave biome inside an absolute world-Y band, independent of what the surface biome above is. If the selected biome has an enabled `caveProfile`, that profile also shapes caves within the band, in addition to the surrounding profiles.

Cave biomes excluded on the running Minecraft version do not generate or enable their associated native structures. Other cave biomes remain available.

| Field | Type | Default | What it does |
|-------|------|---------|--------------|
| `id` | string | `""` | Stable identifier. Other entries reference it through `children`, and floating child biomes can reference it by id |
| `enabled` | boolean | `true` | Set false to disable this cave-biome band |
| `biome` | biome key | `""` | The cave biome applied throughout the band |
| `worldYRange` | `IrisRange` | `-64..320` | **Absolute** world Y, unlike everything else on the profile |
| `children` | string[] | `[]` | Ids of entries that carve patches inside this one. Cycles back to a parent id are allowed and bounded by depth |
| `childShrinkFactor` | double | `1.5` | Larger values make child patches smaller relative to the parent band |
| `childStyle` | `IrisGeneratorStyle` | cellular iris double | Shape of the child patches |
| `childRecursionDepth` | int | `3` | How many levels of children are resolved before the walk stops |

```json
{
  "carving": [
    {
      "id": "global-deepdark-band",
      "enabled": true,
      "biome": "carving/standard-deepdark",
      "worldYRange": { "min": -250, "max": -175 }
    }
  ]
}
```

## Cave biome content reference

| Mechanism | Lives on | What it contributes |
|-----------|----------|---------------------|
| `caveBiomes` | region | The pool `caveBiomeStyle` samples from, weighted by biome `rarity` |
| `caveBiomeZoom` | region | Multiplies the dimension `biomeZoom` for cave patches only, so cave regions can be a different size from surface biomes |
| `caveMinDepthBelowSurface` | cave biome | Above this depth the surface biome is used instead, keeping cave materials out of shallow overhangs |
| `caveProfile` | any biome | Local density override, only when enabled |
| `layers` | cave biome | Floor materials, applied downward from the block below the lowest carved cell |
| `caveCeilingLayers` | cave biome | Roof materials, applied upward from the block above the highest carved cell |
| `wall` | cave biome | Painted onto every solid block horizontally adjacent to carved space that is below the terrain surface. The same palette also paints surface cliffs in the post pass, so a cave biome usually wants its own `wall` |
| `decorators` | cave biome | Default-part decorators land on the cave floor. `partOf: CEILING` decorators hang from the roof |
| `objects` / `proceduralObjects` | cave biome | Props, gated by `carvingSupport: CARVING_ONLY` and the profile anchor settings |

Ceiling layers use their own thickness generators and can contain more entries than the floor layers. Their requested depth still limits how many blocks are painted.

Cave biomes still accept height generators, but nothing reads them underground. Leave them out or use a trivial filler.

Gravity-affected cave-floor layers are written only when the block beneath them is solid. Floor decorators also require stable support. A one-block shell above a second cave cannot turn into falling sand and leave its decorator suspended.

## Cave-anchored jigsaw structures

Editable Iris jigsaws can be placed on cave floors, ceilings or within open cave space. Put the placement in `structures[]` on a dimension, region, surface biome, or cave biome and use one of the explicit cave anchors. A cave-biome `structures[]` list contributes cave anchors only.

```json
{
  "structures": [
    {
      "structures": ["stronghold/demo"],
      "placementId": "stronghold-demo-cave-floor",
      "distribution": "RANDOM_SPREAD",
      "spacing": 24,
      "separation": 8,
      "salt": 984211,
      "anchor": "CAVE_FLOOR",
      "minHeight": -48,
      "maxHeight": 80,
      "caveBiomes": ["carving/deep"],
      "caveAnchorAttempts": 12,
      "caveAnchorScanStep": 1,
      "caveMinimumClearance": 5,
      "terrain": {"mode": "PRESERVE"}
    }
  ]
}
```

| Field | Default | Runtime behavior |
|---|---|---|
| `anchor` | `LEGACY` | `CAVE_FLOOR`, `CAVE_CEILING`, `CAVE_CENTER`, or `CAVE_ANY` search carved cells instead of terrain height |
| `minHeight` / `maxHeight` | `-2032` / `2032` | Inclusive absolute world-Y scan band, clipped to one block inside the dimension usable height |
| `caveBiomes` | empty | Allowlist rechecked against the cave biome at each candidate anchor. Keys are trimmed, case-normalized, and may include or omit the namespace |
| `caveAnchorAttempts` | `8` | Number of locations checked inside the start chunk, clamped to `1..64` |
| `caveAnchorScanStep` | `1` | Vertical scan increment, clamped to `1..16`. Above one it can skip valid single-block anchors |
| `caveMinimumClearance` | `3` | Required contiguous vertical carved run, clamped to `1..64` |
| `underwater` | `false` | False requires a dry cave location, including caves kept dry by `allowLava: false`. True also permits locations containing cave fluid |

Geometry and alignment:

| Anchor | Candidate test | Alignment after assembly |
|---|---|---|
| `CAVE_FLOOR` | Candidate is carved, the cell below is not, and the clearance run continues upward | Lowest structure bound shifted to the anchor Y |
| `CAVE_CEILING` | Candidate is carved, the cell above is not, and the clearance run continues downward | Highest structure bound shifted to the anchor Y |
| `CAVE_CENTER` | Candidate is a midpoint of its contiguous carved run, and that run meets the clearance requirement | Bounding-box midpoint shifted to the anchor Y |
| `CAVE_ANY` | A clearance-sized carved run is centered on the candidate | Bounding-box midpoint shifted to the anchor Y |

When no location meets the cave-anchor requirements, the placement is skipped. It does not fall back to a surface or height-band placement.

> `caveMinimumClearance` applies at the anchor and does not guarantee room for the whole structure. `SOURCE` and `PRESERVE` can leave pieces embedded in surrounding rock. Use `BORE` or `FORCE_CARVE` when the structure must clear its own space.
{.is-warning}

Scope is decided at chunk center, and surface-biome, cave-biome, region, and dimension lists all contribute candidates there. A locator cannot resolve a distant ungenerated cave anchor until terrain generation has produced that carved space.

Cave anchors place structures underground without surface burial adjustments or tree clearing. Authored `ORGANIC_STILT` and `CEILING_HANG` placement modes remain active. The `anchor` field is unavailable for `nativeStructures`. Full authoring detail is in [21 - Jigsaw Structures](/iris/21-jigsaw-structures).

## Vanilla carvers never run

**Vanilla and datapack carvers have no effect on Iris terrain.** Use `caveProfile` and cave biomes instead. See [30 - Platform Differences](/iris/30-platform-differences).
