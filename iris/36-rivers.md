---
title: "Rivers"
description: "Valley-first surface rivers, underground rivers, grottos, deep fluids, and standing pools: the physical configuration"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-22T00:00:00.000Z
---
Iris hydrology plans surface rivers that sit in eroded valleys, independently sourced underground rivers, coastal and inland grottos, and independent deep-fluid bodies. Each course is resolved once — route, water head, channel and bank shape, segment labels, outlet, fluid profile, and biome ownership — and terrain, mantle carving, biome selection, decorators, Vision, and feature locators all read that immutable accepted plan. `hydrology.rivers.enabled` defaults to `false`.

A surface river never raises terrain and never writes the ocean. It cuts a channel into the natural surface, holds its water flush with the ground beside it unless `channel.sink` lowers it, and blends the cut back out to natural terrain across a valley whose width grows with the depth of the cut. Water flows downhill in one-block steps; where the land falls faster than the channel can follow the reach becomes rapids, and where a natural cliff is tall enough, a waterfall. It reaches the sea through a drowned inlet rather than stopping at the shoreline. Underground rivers, grottos and deep fluids are contained features validated against carved cave matter.

Hydrology is per-activation state: each production activation keeps its own plan, so a staged pack update never retrofits generated chunks and surface hydrology tapers inside the transition band beside saved terrain.

This page is the physical configuration the dimension owns. The other two:

- [36b - River Policy](/iris/36b-river-policy) — `riverPolicy`, which decides where rivers may start, transit, and end, and what content they carry.
- [36c - River Inspection](/iris/36c-river-inspection) — Vision, `/iris find river`, rejection reasons, validation, probes, and troubleshooting.

Related:

- [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas)
- [11 - Dimensions](/iris/11-dimensions)
- [12 - Regions](/iris/12-regions)
- [13 - Biomes](/iris/13-biomes)
- [15 - Caves & Carving](/iris/15-caves-carving)
- [25 - Pack Management](/iris/25-pack-management)
- [32 - Determinism & Goldenhash](/iris/32-determinism-goldenhash)
- [33 - Performance Tuning](/iris/33-performance-tuning)

The dimension owns the physical system under `hydrology` and supplies the default `riverPolicy`. Region and biome files may contain only their own `riverPolicy` overrides. A [complete worked example](#complete-hydrology-example) is at the end of this page.

Every object with `min` and `max` is an `IrisStyledRange`. `style` is optional; when present it selects a deterministic value between the endpoints in world space. Channel width and depth are resolved at every station along an accepted course, underground fluid level, headroom and deep-fluid elevation are resolved only for selected geometry, and every resolved value is stored in the accepted plan rather than resampled later.

## `hydrology.rivers.routing`

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
| `tributaries` | `1` | Extra surface courses an outlet may accept as tributaries of its main river, `0..4`, budgeted on top of `sources.density`. See [Tributaries](#tributaries) |

At least one outlet family must be enabled. `tileSize`, `sampleSpacing`, route length, and both source budgets form a bounded planning envelope, and cold planning cost scales with all of them — see [33 - Performance Tuning](/iris/33-performance-tuning#hydrology-heavy-packs).

### Tributaries

An outlet's longest viable route becomes its main stem, and the next longest routes to the same outlet become its tributaries up to `routing.tributaries` (surface) or `underground.tributaries` (underground).

A surface tributary is cut where its centerline first comes within a stem width of the stem, or first enters drainage the stem already owns. It joins the lowest stem water it can reach there and is graded down to the river's level where the two channels touch, so its mouth never stands above the stem's shore. A tail arriving up to three blocks below the stem backs up to the stem's level as a still reach; a deeper shortfall slides the junction downstream to the first stem station whose water is low enough. A tributary reach may bend once where it leaves its own valley for the stem's.

An underground tributary is cut at the first node its route shares with the stem's and solved to the stem's fluid level there.

A tributary owns only the drainage upstream of its junction, so the stem's discharge and width below the junction include it.

## `hydrology.rivers.geometry`

Geometry shapes what routing and the surface and underground sections have already sized. `meanders` decides how far a centerline wanders from its solved route; `surface`, `underground` and `grottos` carry the same cross-section fields with their own values, for a carved waterfall throat, a contained passage and a chamber respectively; `drops` shapes descending flow and the basin that receives it.

### `geometry.meanders`

| Field | Default | Purpose |
|-------|---------|---------|
| `primaryWavelength` | `64` | Broad meander wavelength in blocks, `8..512` |
| `detailWavelength` | `12` | Fine worm wavelength in blocks, `4..128`; smaller values change direction more often |
| `primaryStrength` | `0.34` | Strength of the broad meanders, `0..2` |
| `detailStrength` | `0.42` | Strength of the fine worm movement, `0..2` |
| `maximumOffsetRatio` | `0.48` | Largest lateral displacement from the solved route as a fraction of one drainage edge, `0..1` |
| `smoothingPasses` | `1` | Terrain-safe centerline smoothing passes after route solving, `0..4` |
| `maximumTurnDegrees` | `82` | Largest retained centerline turn angle in degrees, `10..150` |

Valley anchors stay within the local permitted cut, and steep surface routes can make bounded sideways detours. Terrain admission and rendered-channel containment still apply.

### `geometry.surface`, `geometry.underground` and `geometry.grottos`

The three sections share one set of fields. The three roughness fields of `geometry.surface` are nullable and fall back to `surface.channel`; the underground and grotto sections always carry a value.

| Field | Surface default | Underground and grotto default | Purpose |
|-------|-----------------|--------------------------------|---------|
| `bedRoundness` | `2` | `2.4` | Cross-section exponent of the bed, `1..6`; larger values broaden the rounded U-shaped bed |
| `bedRoughness` | `surface.channel.roughness` | `0.28` | Coherent vertical variation of the bed as a fraction of the depth, `0..1` |
| `wallRoughness` | `surface.channel.roughness` | `0.24` | Coherent radial variation of the carved walls, `0..1` |
| `roughnessWavelength` | `surface.channel.roughnessWavelength` | `11` | Wavelength in blocks of the bed and wall variation, `3..128` |
| `radialBase` | `0.86` | `0.86` | Base radial scale of the organic outline before the lobes are added, `0.4..1.2`; `1` keeps the nominal radius and lower values carve a narrower passage |
| `radialMinimum` | `0.58` | `0.58` | Narrowest the outline may pinch after the lobes, as a fraction of the nominal radius, `0.2..1` |
| `radialMaximum` | `1.18` | `1.18` | Widest the outline may bulge after the lobes, as a fraction of the nominal radius, `1..2` |
| `primaryLobeStrength` | `0.08` | `0.08` | Strength of the broad lobes that bulge and pinch the outline along its length, `0..0.5`; `0` leaves the outline circular |
| `detailLobeStrength` | `0.06` | `0.06` | Strength of the fine lobes layered over the broad ones for small-scale wall detail, `0..0.5` |
| `ceilingRoughness` | `0` | `0` | Coherent variation of the carved ceiling height as a fraction of the headroom, `0..1`; `0` keeps the ceiling smooth and evaluates no extra noise |
| `aspectMinimum` | `0.62` | `0.62` | Narrowest plan aspect of a chamber, the short axis as a fraction of the long axis, `0.2..1`; `1` makes every chamber circular in plan |
| `aspectRange` | `0.2` | `0.2` | How far the plan aspect may vary above `aspectMinimum` from one chamber to the next, `0..0.8`; `0` gives every chamber the same aspect |

The surface section carries every field so the three sections share one shape, but an exposed river has no carved roof and no chamber plan, so `ceilingRoughness`, `aspectMinimum` and `aspectRange` do nothing there.

### `geometry.drops`

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

## `hydrology.rivers.surface`

`surface.enabled` controls only exposed, terrain-following courses. It does not control the independent underground or deep-fluid budgets.

### `surface.sources`

| Field | Default | Purpose |
|-------|---------|---------|
| `density` | `0.5` | Expected surface sources per plan tile, `0..64` |
| `minimumElevation` | `88` | Minimum absolute world Y for a surface source, `-2048..2048` and below the dimension maximum |
| `minimumPerTile` | `0` | Source quota enforced only when a qualifying `REQUIRED_HEADWATER` policy candidate can reach a legal outlet, `0..64` |
| `minimumSpacing` | `384` | Minimum separation between natural surface headwaters, `0..8192`; required headwaters may override it |

### `surface.channel`

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

### `surface.banks`

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
| `shoreMaterial` | enabled, sand, depth 2 | Palette painted over the shore bench columns instead of the biome's own layers; `enabled`, a `palette` of solid blocks and a `depth` of `1..8` layers |
| `bankMaterial` | disabled | Palette painted over the eroded bank columns outside the bench instead of the biome's own layers; same three fields |

> Increasing `channel.sink` lowers the head and leaves less of `channel.maximumIncision` available for the bed, so a route near that limit can disappear when sink increases. A wider `shoreWidth` expands the bank probe band but does not guarantee more accepted rivers. **Accepted river counts need not increase with either setting.**
{.is-info}

`shoreMaterial` and `bankMaterial` paint over the layers the shore and bank biomes would otherwise supply, down `depth` blocks from the surface, and change nothing while `enabled` is `false`. The bed padding rule still runs after the paint, so a falling block from one of these palettes is replaced by `bed.paddingPalette` unless `bed.allowGravityBlocks` is set. Content that should vary with the surrounding terrain belongs in policy `shoreBiomes` or `bankBiomes` instead; these palettes are for one fixed material along every river in the dimension.

Per-area overrides for `blendSlope` and `shoreWidth` live on [36b - River Policy](/iris/36b-river-policy).

### `surface.erosion`

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

`erosion.style` decides the shape of the valley side across the blend band. `SMOOTH` is an eased S-curve, flat at the shore and at the top and steepest across the middle, and it is the shape Iris cut before the field existed. `LINEAR` is a straight slope with a sharp shoulder at the shore and a sharp lip at the top. `CONCAVE` climbs fast beside the shore and flattens toward natural terrain, hollowing the valley. `TERRACED` cuts the eased curve into `terraceSteps` level steps. `CLIFF` holds the band level at the bank top for `cliffFraction` of its width and then rises in one vertical wall. `blendCurve` skews all of them except `CLIFF`.

`erosion.bedProfile` decides the cross-section of the wet bed. `BOWL` holds full depth over `thalwegFraction` of the half-width and eases up to a one-block edge, and it is the profile Iris cut before the field existed. `FLAT` holds full depth to the waterline, so the channel edge drops straight to the bed. `V` slopes straight from full depth at the centerline to one block at the edge and ignores `thalwegFraction`. `U` holds the thalweg deep almost to the edge and then rises steeply, giving a trough with steep sides.

To turn the valley off for one area without touching the rest of the dimension, use `riverPolicy.erosion` on [36b](/iris/36b-river-policy).

### `surface.ponds`

Every surface river rises from a round pond and, when it ends inland, drains into one. A pond is a bowl holding the river's water level at that end, with the same shore band and eroded rim as the channel. Its radius is chosen per river within the configured range and shrinks where the ground around the rim falls below the water; where even the smallest radius does not fit, the river starts or ends as a channel. A river that reaches the ocean gets no terminal pond.

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

### `surface.bed`

The bed is what sits under and beside the water. Falling blocks under a river collapse when a cave, a player or a fluid update touches them, so by default they are replaced.

| Field | Default | Purpose |
|-------|---------|---------|
| `allowGravityBlocks` | `true` | Keep sand, gravel and concrete powder from the biome layers in the bed, shore and eroded banks; set it to `false` when those blocks should use `paddingPalette` instead |
| `padding` | `2` | Blocks below the bed surface that are also kept free of falling blocks, `0..8` |
| `paddingPalette` | clay and dirt | Blocks used in place of falling blocks; any solid palette |
| `material` | disabled | Palette painted over the wet channel bed under the water instead of the biome's own layers; `enabled`, a `palette` of solid blocks and a `depth` of `1..8` layers |

Without an explicit `material` or `banks.bankMaterial`, the channel keeps the layers of the channel biome (`surfaceBiomes`) and the eroded bank keeps `bankBiomes`, with the default shore palette supplying two sand layers before the biome continues below. Biome overrides make a river bottom or beach follow the terrain it crosses; the material palettes give every river in the dimension the same blocks regardless of biome. Both may be used together — the palette wins for its top `depth` layers and the biome supplies everything below.

### `surface.flow`

Water heads only ever descend. Each step downstream is at most one block unless the terrain forms a cliff.

| Field | Default | Purpose |
|-------|---------|---------|
| `cascadeRun` | `2` | Horizontal blocks per one-block head drop before a reach is labelled rapids rather than a pool, `1..8` |
| `waterfallMinimumDrop` | `6` | Smallest natural cliff, in blocks between adjacent stations, that produces a single-step waterfall drop, `2..32` |
| `waterfallThalwegFraction` | `0.65` | Share of the half-width that stays at full bed depth in the carved throat of a waterfall or cascade before the bed rises to the edge, `0..0.95`; higher is a flatter, broader throat |
| `plungeBasinMinimumDrop` | `2` | Smallest drop in blocks that scours a plunge basin into the bed below it, `1..8`; shorter drops leave the bed untouched |
| `plungeBasinLengthRatio` | `2` | Length of the basin downstream of a drop as a multiple of the channel half-width, `0..8`, never shorter than two stations |
| `plungeBasinDepth` | `1` | Extra bed depth in blocks scoured inside a plunge basin, `0..8`; `0` marks the basin without deepening it |

### `surface.mouths`

| Field | Default | Purpose |
|-------|---------|---------|
| `flareRatio` | `1.6` | Channel width at the coast relative to the width upstream, reached over the inlet, `1..4` |
| `maximumOceanApron` | `8` | Maximum non-owning accepted connection apron in ocean columns, `0..32` |
| `inletLength` | `64` | Blocks of river before the coast held at sea level and widened toward `flareRatio`; `0` ends the river at the shoreline with no inlet, `0..256`, never more than `routing.minimumSurfaceCourseLength` |
| `inletDepth` | `3` | Extra bed depth reached at the shoreline over the inlet, so the estuary is deeper than the river above it, `0..16` |
| `maximumIncision` | `32` | Deepest cut allowed in the inlet and its approach ramp, replacing `channel.maximumIncision` there, so the coast may be cut down to sea level through a rise of this height; a taller rise ends the inlet where it starts, `0..128` |
| `inletCourseFraction` | `0.5` | Largest share of the river's exposed course the drowned inlet may occupy, `0.05..1`, so a short river keeps most of its length above sea level; the inlet is the shorter of `inletLength` and this share |
| `inletRampSlope` | `1` | Blocks of head gained per station on the approach ramp climbing from the inlet back to the river's natural profile, `0.1..4`; `1` climbs one block per station and higher values grade the approach faster |

The inlet reaches inland only as far as the ground can be cut to sea level within `maximumIncision`: on a low coast it runs the full `inletLength`, against a bluff it stops at the foot of the bluff, and on a cliff coast there is no inlet and the river falls into the sea. Above it the water grades down `inletRampSlope` blocks per station over half the inlet length wherever that cut fits, so a river on a coastal plateau reaches the estuary through rapids rather than a wall. Lower `mouths.maximumIncision` where that approach cuts a deeper gorge than the coast should show. An ocean apron owns no writes — it records the accepted connection for rendering and inspection while the ocean reservoir stays authoritative.

## `hydrology.rivers.underground`

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
| `tributaries` | `1` | Extra underground courses an outlet may accept as tributaries joining its main passage, `0..4`, budgeted on top of `sources.density`. See [Tributaries](#tributaries) |
| `minimumRockCover` | `1` | Blocks of solid rock kept between the top of a passage's headroom and the surface above it, `1..64`; a passage that cannot keep this much cover is lowered, and rejected if it cannot be lowered far enough |
| `minimumFloorCover` | `1` | Blocks of solid rock kept between the bottom of a passage's bed and the world floor below it, `1..32` |
| `wideningSources` | `8` | Number of joined tributary sources at which a passage reaches its full sampled width, `1..64`; fewer contributing sources carve a proportionally narrower passage, and `1` gives every passage its full width |
| `bedMaterial` | disabled | Palette painted over the floor layers under an underground river instead of the cave biome's own layers; `enabled`, a `palette` of solid blocks and a `depth` of `1..8` layers |

Fluid level, depth, basin depth, and headroom must fit strictly inside `dimensionHeight`. Underground heads are non-rising downstream, but each routed point resolves its preferred fluid level before that constraint is applied, so a course can occupy several level terraces rather than one globally flattened height. Drops become narrow graded `UNDERGROUND_DROP` features with receiving basins; level runs become `UNDERGROUND_POOL`. `geometry.underground` and `geometry.grottos` set the bed, wall and outline shape of passages and chambers, and `geometry.drops` shapes underground drops, sinkholes and receiving basins.

## Grottos

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

A coastal grotto is admitted only at a proven coastal land/ocean boundary, either as a river outlet or as a standalone sea cave. Its pool is at sea level and its ocean face is the only opening — the chamber is roofed and walled by the coast everywhere else. An inland grotto is available only when `routing.inlandOutlets` includes `SINKHOLE_GROTTO`, and an underground course whose maximum head is below sea level gets an inland grotto plan rather than being routed to an impossible coastal outlet.

With `grottos.inland.connectSurfaceRivers` set to `true`, an eligible surface source keeps one course through a `SINKHOLE` falling throat into its terminal `INLAND_GROTTO` receiving pool, with fluid and carving continuous into the chamber. With it `false`, surface sources cannot route to inland grotto outlets while independently sourced underground courses still can.

`maximumVolume` bounds the grotto segment itself; an attached underground course or surface sinkhole belongs to the same all-or-nothing containment transaction without counting its non-grotto positions against that cap.

### Sea caves

`grottos.coastal.seaCaves` plans coastal grottos that need no river: the sea itself opens into the coast. Sites are ranked by how high the coast stands over the sea, so cliffs are taken before low shores, and each accepted site becomes its own `COASTAL_GROTTO` course — a chamber swept `depth` blocks inland from the shoreline with the water at sea level, `verticalRadius` of flooded floor below it, `headroom` of air above it, and the open sea as its mouth. Sea caves keep clear of every river mouth and grotto already planned on the tile, and need `grottos.coastal.enabled` as well as `seaCaves.enabled`.

| Field | Default | Contract |
|-------|---------|----------|
| `enabled` | `true` | Plan sea caves along the coast |
| `maximumPerTile` | `3` | `0..64` sea caves accepted per planning tile; the steepest owned coast is taken first |
| `minimumSpacing` | `160` | `16..8192` blocks between two sea caves, and at least twice `horizontalRadius` |
| `minimumCoastHeight` | `8` | `1..128`; the coast must stand this many blocks above the sea at the shoreline, at the back of the chamber and along its flanks |
| `depth` | `12` | `0..128` blocks the chamber is swept inland from the shoreline; `0` leaves a single chamber at the shore |
| `sweepJitterDegrees` | `25` | `0..90`, the largest angle the inland sweep may turn away from straight inland, chosen per cave; `0` sweeps every sea cave straight in from the shore |

## River profiles

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

Each `id` is unique and each `fluidPalette` must resolve to at least one fluid block. Policies reference profile IDs. A surface route requires one common permitted profile along the complete route and outlet, and tributaries retain their stem's profile, so disjoint profile lists separate drainage networks, including at coasts. An empty effective policy profile list selects the first configured profile.

> Omitting `hydrology.rivers` still materializes an implicit `default` profile, so **a deep-fluid entry cannot use `default` as its ID.**
{.is-warning}

## `hydrology.deepFluids`

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

Spacing must contain the complete horizontal footprint, depth plus headroom must fit inside the vertical diameter, and the height envelope must fit inside the dimension. A short channel has no authored length: its maximum is `spacing / 3`, capped to half `routing.tileSize`, and its derived containment-volume bound may shorten it further.

## `hydrology.surfacePools`

Standing pools are bowls cut into open ground and filled with their own fluid: lava pools in a badland, a tar pit, a hot spring. They are independent of the river budgets and never touch a river.

| Field | Default | Purpose |
|-------|---------|---------|
| `id` | `lava_pool` | Unique pool id; policies opt in with it and `/iris find river type=<id>` locates it |
| `fluidPalette` | lava | Fluid filling the pool |
| `density` | `0.75` | Expected pools per tile where the policy allows them, `0..64` |
| `spacing` | `384` | Candidate site spacing in blocks, `32..8192`; sites are jittered inside their cell |
| `minimumRadius` / `maximumRadius` | `4` / `7` | Pool radius range in blocks, `2..16` |
| `depth` | `2` | Fluid depth at the centre, `1..8` |
| `biome` | empty | Biome applied to the bowl and its rim; empty keeps the surrounding biome |

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

A pool is shaped like a river reach with no course: the fluid sits `channel.sink` below the lowest ground around the bowl, the rim holds it level with the ground beside it, and the cut blends back out to natural ground the same way a river bank does. A site is skipped where the ground falls away more than `channel.maximumIncision` allows, on or below sea level, where the policy does not list the pool, or within one river width plus the bank blend of an accepted course. The bed padding rule applies to pools as well.

Named probe selectors use `STANDING_POOL@<pool-id>` for these pools and `SURFACE_POOL@<river-profile>` for river reaches.

## How a surface river is shaped

A surface course is shaped in four steps, all working on the refined centerline one block at a time.

1. **Channel profile.** Width and depth are resolved at every station from `channel.width` and `channel.depth`, the effective policy multipliers, and the coherent outline wobble from `channel.roughness`. The headwater opens as a spring pool `springWidthRatio` times the channel width and one block deeper, narrowing to the cruise width over `springLength` blocks. Over the last `mouths.inletLength` blocks before a coast the width grows toward `mouths.flareRatio` times the upstream width and the depth grows by `mouths.inletDepth`.
2. **Water head.** For each station the planner reads the natural ground on a ring just outside the channel outline on both banks, takes the lowest bank sample across that station and the two after it, and subtracts `channel.sink`. Heads are then made non-rising downstream: a value that would rise is held at the previous head, and a value that would fall is limited to one block per `flow.cascadeRun` blocks of run unless the pair straddles a natural cliff of at least `flow.waterfallMinimumDrop`, where the head drops by the cliff in one step. Heads inside the inlet are sea level as far inland as the ground can be cut to sea level within `mouths.maximumIncision`, and the reach above it grades down one block per station into the inlet wherever that cut fits. A station whose head would need a cut deeper than `channel.maximumIncision` rejects the course, except in the inlet and its approach where `mouths.maximumIncision` is the limit. There are no bores under ridges for surface rivers, so a route that cannot stay open on the surface is not published.
3. **Erosion field.** Every column near the centerline receives a target height. Inside the channel the target is the bed below the head, shaped by `erosion.bedProfile`. The bank top on both sides sits at `head + channel.sink`, so with the default sink the ground beside the water is level with its surface. The shore bench runs from the waterline out to `banks.shoreWidth`, or to `riverPolicy.shoreWidth` where the area sets one, climbing `banks.shoreRise` blocks over that distance. From the landward edge of the bench the target rises back to the natural height across a blend band whose width is `cut x banks.blendSlope + banks.blendBaseWidth`, clamped to `minimumBlendWidth..maximumBlendWidth`, and the shape of that rise is `erosion.style`. The published terrain is `min(natural, target)` — the field only ever lowers ground. Water is published only where the bed sits below the head and the surrounding bank tops contain it.
4. **Labels.** Each reach is labelled from its head gradient: a level reach is a `SURFACE_POOL`, a single one-block step is a `RIFFLE`, consecutive one-block steps are a `CASCADE`, and a cliff-sized step is a `WATERFALL`. Labels do not change the geometry; they drive Vision, locators, and rendering.

The head is derived from the banks rather than the centerline so a river running along a hillside is cut into the slope with the bank on the uphill side, instead of sitting on a shelf above the downhill side. Because every step is one block, a river descending a hill leaves no chips, ledges, or floating water. Because the blend width follows the depth of the cut, a shallow crossing of flat ground erodes only a few blocks either side while a deep cut through a ridge opens into a wide valley.

When `banks.exposeCutStrata` is `true`, eroded bank columns offset the biome palette by the erosion depth. The offset stops at the deepest authored layer, so a cut deeper than the layer stack repeats that last material within the original stack thickness; below that thickness, dimension rock and ore rules resume. Uncut columns keep their original layers.

## Terrain, oceans, caves, and decoration

### Surface shaping and banks

Every surface write is carve-only: no column is ever raised above its natural height. Water only ever meets solid ground at its own level and never spreads, and where the natural ground beside the channel is already lower than the intended bank top the planner lowers the head instead of building a bank.

The post-generation passes that place slabs, fill potholes, remove floating nibs, and dress walls skip every column inside a river footprint and its immediate neighbours. Automatic surface object placement is rejected when any transformed support column intersects an accepted river channel or shore band, **even with `forcePlace`, `underwater`, or `onwater`**, so biome and region scatter cannot bridge a channel or stand in the shore. Explicit-Y placement, including `/iris object paste`, still works for intentional authoring inside a river.

### Ocean boundary

The accepted plan resolves the first true natural land/ocean crossing, and at that crossing the ocean reservoir takes over. River-owned terrain and fluid stop on the landward side, with at most `maximumOceanApron` blocks of non-owning connection footprint in the ocean: there are no writes at or below natural sea level and no ocean channel. With `inletLength` at `0` the head drops to sea level across the last station instead. Underground mouths may use `underground.mouthLevelingDistance` to reach sea level.

Ocean classification is conservative. Any surface column whose natural height is at or below sea level rejects river-owned terrain, fluid, shore content, and bank writes; only the bounded non-owning mouth apron may remain. This applies to exposed hydrology only, so contained underground and deep-fluid features stay legal below sea level. A mouth or coastal grotto cannot turn along the coastline, raise the sea, place a wall across it, or excavate an ocean channel.

### Mantle and cave containment

Any active river or deep-fluid configuration requires:

- `useMantle: true`
- `carvingEnabled: true`
- `CARVED` absent from `disabledComponents`
- `RIVER_HYDROLOGY` absent from `disabledComponents`

Iris validates the complete subterranean footprint of each underground course, surface course with a sinkhole continuation, grotto course, and deep-fluid body as **one all-or-nothing containment transaction** against carved mantle matter. A surface sinkhole's falling throat, receiving wet pool, and dry headroom therefore succeed or fail with the rest of that course. An unapproved opening to the surface or another cavern, a world-boundary or volume escape, existing or incompatible fluid, or overlap with a winning plan rejects the entire course before terrain, Vision, or locators can observe it.

Each transaction is limited to 262,144 planned mutation positions across its complete course. A larger candidate receives `VOLUME_LIMIT`. The configured grotto `maximumVolume` remains the smaller, feature-specific chamber limit.

With `connectToExistingCaves` enabled, a planned dry boundary may open into suitable cave air without exposing the wet volume. Hydrology-owned cells and their seal guards stay protected from later object or structure writes, so the cave network never becomes a shared reservoir. Dry headroom above an underground river uses the `floodedCaveBiomes` content of the course.

A generation update preserves accepted underground and deep-fluid layer coordinates while surface layers taper toward natural terrain height. See [generation update limits](/iris/06-worlds-lifecycle#generation-updates-and-retained-terrain).

### Decorators and freezing

Shore-line and sea-surface decorator passes use the accepted local head for a wet river column and the dimension sea level for an ordinary ocean. A non-water river profile clears waterlogging instead of introducing water into that fluid.

Exposed water is published as ordinary water, and the standard freezing pass decides where ice forms after hydrology, so frozen rivers carry no prebuilt surface pattern.

## Adding rivers to a pack

1. Enable `hydrology.rivers` on the dimension and set `routing.tileSize`, `sampleSpacing`, and at least one outlet family. Start from the [complete example](#complete-hydrology-example) and keep the defaults for everything you do not have an opinion about yet.
2. Give the dimension a `riverPolicy` with `placement: NATURAL`, `routing: ALLOW`, a profile, and the content pools you want everywhere by default.
3. In regions and biomes, override only what differs. See [36b - River Policy](/iris/36b-river-policy).
4. Run `/iris pack validate`, then the river transect probe on a few tiles to look at the valleys before opening a world ([36c](/iris/36c-river-inspection#probes)).
5. Create a new world, or stage an existing-world pack update and restart. **Existing chunks are never retrofitted.** New terrain reconciles with saved natural boundaries within the finite transition band.

Hydrology output is a deterministic function of pack bytes, world seed, and coordinates — tile, chunk, platform, and worker order must not change the accepted result. Use GoldenHash plus fresh-world feature inspection to verify that contract. Planning cost and its knobs are in [33 - Performance Tuning](/iris/33-performance-tuning#hydrology-heavy-packs).

## Managed pack profiles

Both managed packs disable regional rivers and three-dimensional river banks, use matching local geometry and excavation limits, and allow gravity blocks in river beds. River shores get two layers of sand in Overworld and blackstone in Underworld.

| Setting | Managed value |
|---|---|
| `tileSize` / `sampleSpacing` | 1024 / 64 |
| Course minima (surface, underground) | 384 / 384 blocks |
| Source density (surface, underground) | `1.75` / `1.5`, both minima zero |
| Source spacing (surface, underground) | 384 / 640 blocks |
| Outlet budgets | 1 inland, 2 coastal per tile |
| Meanders | 192/48-block wavelengths, strengths `0.55`/`0.18`, `0.45` offset ratio, 20-degree turn limit |
| Channel | 4–8 wide, 2–4 deep, 16-block incision cap, `sink` `0` |
| Banks | 1.5-block shore bench, blend 3 per block of cut within 4–32 blocks, `exposeCutStrata` on |
| Flow | Rapids past one block in two; waterfall at a six-block cliff |
| Mouths | 64-block inlet, `2.5` flare, 32-block incision cap, eight-block ocean apron; underground mouths level over 128 blocks |
| Grottos | Coastal, inland, and surface sinkholes all enabled, 10 blocks of dry headroom |
| `deep_lava` | density `0.5`, spacing 1024, contained pools, no channels |
| `deep_lava_small` | density `1.5`, spacing 320, Y `-160..40`, radii 6/4, depth 1, headroom 4, no channels |

Local policies replace those defaults: tropical regions use density `8`, spacing `160`, three tributaries, three inland and four coastal outlets, a 64-block course minimum and a 32-block incision cap; volcanic biomes use density `6`, spacing `128`, two tributaries, three inland and no coastal outlets, a 128-block course minimum and a 24-block incision cap. Mixed tiles scale local budgets by eligible area.

Ambient profiles differ: Overworld policies reference a `water` profile, Underworld policies a `lava` one, and volcanic policies in both packs reference `volcanic_lava`.

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

## Complete hydrology example

The managed Overworld shape with every physical section written explicitly:

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
          "shoreMaterial": {"enabled": true, "palette": {"palette": [{"block": "minecraft:sand"}]}, "depth": 2},
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
          "allowGravityBlocks": true,
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
