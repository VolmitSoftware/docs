---
title: "Surfaces, Decorators & Deposits"
description: "Iris documentation: Surfaces, Decorators & Deposits"
published: true
date: 2026-09-03T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Three systems dress the terrain once its shape exists. Biome `layers` decide what the top few blocks of each column are made of. The dimension `rockPalette` fills everything below. Decorators scatter a single block or stack on top of a surface: grass, flowers, cane, lily pads, cave vines. Deposits stamp shaped clumps of ore and stone into existing solid hosts.

Related:

- [11 - Dimensions](/iris/11-dimensions)
- [12 - Regions](/iris/12-regions)
- [13 - Biomes](/iris/13-biomes)
- [14 - Generators & Noise](/iris/14-generators-noise)
- [15 - Caves & Carving](/iris/15-caves-carving)
- [17 - Trees, Fungi, Coral, Crystals, Formations, Ruins](/iris/17-trees-fungi-coral-crystals-formations-ruins)
- [19 - Objects](/iris/19-objects)
- [20 - Object Placement](/iris/20-object-placement)
- [24 - Pack Mods & Snippets](/iris/24-pack-mods-snippets)
- [35 - Vanilla Passthrough](/iris/35-vanilla-passthrough)

## The mental model

The terrain actuator walks each column downward from `max(fluidHeight, terrainHeight)` to bedrock and asks, at every Y:

1. Does a **surface ore** generator claim this cell? If so it wins outright, above or below the waterline.
2. Is this cell above the terrain but below the fluid level? Fill from `seaLayers`, indexed by distance down from the water surface. Fall through to the dimension `fluidPalette`.
3. Otherwise it is inside the terrain. Fill from the biome `layers` stack, indexed by distance down from the surface. Once the stack runs out, try **underground ore** generators. Failing that, use the dimension `rockPalette`.

Layers are therefore a *depth-indexed list*, not a set of absolute Y bands. The first layer covers the topmost block. The second covers whatever depth the first did not. And so on.

Everything else lands in later stages. Using the `OVERWORLD` pipeline order:

| Stage | What runs |
|---|---|
| 1 | biome actuator, mantle generation, **terrain actuator** (layers, sea layers, ores, rock) |
| 2 | carve modifier — cave biome floor/ceiling/wall materials and cave decorators ([15 - Caves & Carving](/iris/15-caves-carving)) |
| 3 | post modifier — biome `slab` and `wall` on surface terrain |
| 4 | floating child biome solids |
| 5 | **deposit modifier**, mantle object insertion, **surface decorator actuator** — these three run concurrently |
| 6 | floating decoration, perfection, custom |

Two consequences worth internalising. Deposits go in *after* caves are cut and skip any cell carrying a cavern mark. Veins never hang in open air. Decorators run after carving. A cave that broke the surface does not get flowers planted over the hole.

A cold `derivative` tints grass and can freeze water. It does not stamp snow layers. Snow layers come from Iris decorators, object `snow`, or `importedFeatures` with `TOP_LAYER_MODIFICATION`. Iris `postProcessing` only paints slabs and walls. See [35 - Vanilla Passthrough](/iris/35-vanilla-passthrough).

## Walkthrough: a surface, a flower scatter, and an ore vein

Start from the flat generator in [26 - Example - Minimal Dimension](/iris/26-example-minimal-dimension). Save this as `biomes/tutorial/surface-test.json`. List `tutorial/surface-test` in one region `landBiomes`. Set the dimension `focus` to the same key so it is the only biome generated.

```json
{
  "name": "Surface Test",
  "derivative": "minecraft:plains",
  "vanillaDerivative": "minecraft:plains",
  "generators": [
    { "generator": "flat", "min": 16, "max": 16 }
  ],
  "layers": [
    {
      "minHeight": 1,
      "maxHeight": 1,
      "palette": [{ "block": "minecraft:grass_block" }]
    },
    {
      "minHeight": 3,
      "maxHeight": 3,
      "palette": [{ "block": "minecraft:dirt" }]
    }
  ],
  "decorators": [
    {
      "chance": 0.05,
      "palette": [{ "block": "minecraft:dandelion" }]
    }
  ],
  "deposits": [
    {
      "minHeight": 0,
      "maxHeight": 96,
      "minSize": 3,
      "maxSize": 6,
      "minPerChunk": 1,
      "maxPerChunk": 2,
      "palette": [{ "block": "minecraft:coal_ore" }],
      "varience": 2
    }
  ]
}
```

1. Validate the pack and open Studio on seed `1337`.
2. Generate fresh chunks and cut a cross-section. Success is exactly one grass block over three dirt blocks over stone. Dandelions scatter on the grass. Coal clumps appear only in the lower part of the column.
3. If the column is wrong, delete `decorators` and `deposits` and get `layers` right first. Layer thickness is noise-fit between `minHeight` and `maxHeight` per column. Equal min and max is the way to get a guaranteed thickness while debugging.
4. If flowers never appear, raise `chance` to `0.5` temporarily. Confirm the dimension has `decorate: true` (the default). `chance` is a noise-field cutoff, not a dice roll. A low value can produce nothing within one chunk.
5. If deposits never appear, check the Y band. Deposit `minHeight` and `maxHeight` are **engine-local Y** (0 = bottom of the world). They do not automatically rescale when dimension height changes. `CLIPPED_UNIFORM` clips the origin band to the configured terrain clearance. `UNIFORM` and `TRIANGLE` sample the authored band first and discard cells outside the world or terrain.
6. Remove `focus` once the biome behaves. Then tune each system on its own.

Keep the code spelling `varience`. It is the field name.

## Surfaces and material layers

### Biome-level fields

| Field | What it controls |
|-------|------------------|
| `layers` | The land column, top down. Grass, then dirt, then whatever. Stone below is the dimension `rockPalette` |
| `seaLayers` | The water column above the seafloor, indexed down from the water surface. Empty means plain fluid |
| `caveCeilingLayers` | Roof materials inside carved space. Applied by the carve modifier, not the terrain actuator |
| `slab` | Palette used by the post pass to soften single-block steps. An empty palette (the default) means no slabs |
| `wall` | Painted onto exposed vertical faces. Used twice: by the post pass on surface cliffs, and by the carve modifier on cave walls. An empty palette (the default) disables both |
| `lockLayers` | Switches to mesa banding, described below |
| `lockLayersMax` | Caps how many blocks deep the banded stack goes. Default `7` |

`layers` defaults to a single grass-block layer. `caveCeilingLayers` defaults to empty. Omitting it leaves carved ceiling blocks unchanged instead of introducing a surface material underground.

### Palette layer (`IrisBiomePaletteLayer`)

Snippet key: `biome-palette`.

| Field | Type | Default | What it does |
|-------|------|---------|--------------|
| `palette` | `IrisBlockData[]` | grass block | Blocks this layer may use. With more than one entry, `style` and `zoom` decide which appears where. `weight` on an entry duplicates it in the pick list |
| `minHeight` | int 0..2032 | `1` | Thinnest this layer can be in any column |
| `maxHeight` | int 1..2032 | `1` | Thickest it can be. Iris noise-fits per column between the two, so unequal values give a wandering soil depth |
| `style` | `IrisGeneratorStyle` | `STATIC` | Picks between palette entries. `STATIC` scatters per block. Wispy or cellular styles produce visible patches of one material |
| `zoom` | double >= 0.0001 | `5` | Scale of that pick. Larger zoom means larger single-material patches |
| `slopeCondition` | `IrisSlopeClip` | 0..10 | Where the slope is outside this range, the layer is **skipped entirely** for that column. It does not thin gradually. The block below takes over. Use it to strip grass off cliff faces |

`IrisSlopeClip` (snippet `slope-clip`) has `minimumSlope` (default `0`) and `maximumSlope` (default `10`). The default clip accepts every slope and short-circuits before the slope stream is sampled. Slope is measured over a 3-block radius.

`caveCeilingLayers` ignores `slopeCondition`. Cave roofs have no meaningful slope.

**`lockLayers` (mesa mode).** Instead of indexing the stack from the surface, Iris builds the full expanded layer stack once. It then reads it with an offset derived from the column own terrain height. Bands therefore stay at fixed world heights across the whole biome and line up horizontally into stripes. The stack repeats cyclically rather than running out. `lockLayersMax` limits how deep the banded region goes before the rock palette takes over.

### Material palette (`IrisMaterialPalette`)

Snippet key: `palette`. The general-purpose weighted palette used for rock and fluid on the dimension, tree trunks and leaves, formation strata, ruin weathering, and procedural accents.

| Field | Type | Default | What it does |
|-------|------|---------|--------------|
| `palette` | `IrisBlockData[]` | stone | The blocks. Each entry is repeated `weight` times in the pick list |
| `style` | `IrisGeneratorStyle` | `STATIC` | How the pick varies through space. Sampled in 3D, so a palette can band vertically as well as horizontally |
| `zoom` | double >= 0.0001 | `5` | Scale of that variation |

Dimension-level palettes:

| Field | Default | What it does |
|-------|---------|--------------|
| `rockPalette` | stone | Fills every land cell below the biome layer stack. Swap it for deepslate or a stone/granite/andesite blend to change the entire underground |
| `fluidPalette` | water | Ocean columns and cave aquifers when `allowFluid` is on. River and deep-fluid material comes from the accepted hydrology profile `fluidPalette` |

### Block data and reusable `blocks/*.json`

`IrisBlockData` is the entry type used by every palette, plus decorators, deposits, drop filters, and object replacement rules. A vanilla id works with or without the `minecraft:` prefix.

```json
{
  "block": "minecraft:oak_log",
  "weight": 2,
  "data": { "axis": "y" },
  "backup": { "block": "minecraft:spruce_log" },
  "debug": false
}
```

| Field | Default | What it does |
|-------|---------|--------------|
| `block` | `air` | A block id, or the load key of a file under `blocks/`. Required by the schema |
| `weight` | `1` (1–1000) | How many times this entry appears in the containing palette pick list. Weight 3 against weight 1 is a 3:1 split |
| `data` | `{}` | Block-state properties such as `axis`, `waterlogged`, `facing`, `half` |
| `backup` | `null` | The entry used when `block` does not exist on the running Minecraft version. Works on every platform and counts as a declared fallback, so the content still generates and the substitution is reported. Without one — and with no dimension `blockFallbacks` entry — the biome, decorator, deposit, or placement that owns the palette is excluded on that version |
| `debug` | `false` | Prints the resolved state to console when general debug logging is on. Use it when a palette silently produces air |
| `tileData` | `{}` | Block-entity payload, applied only when the resolved state actually has a tile entity |

A `backup` is resolved through the same chain as `block`: live registry, legacy rename table, dimension `blockFallbacks`, then this `backup`. A backup that is itself missing on the running server counts as missing. A missing palette block no longer becomes air with its weight retained; the unit that composes it is left out of generation instead, and the decision is listed at startup and by `/iris pack compat`. See [25 - Pack Management](/iris/25-pack-management) and [11 - Dimensions](/iris/11-dimensions).

Files under `blocks/<key>.json` use the same shape and act as reusable aliases. Reference one with `"block": "<key>"`. Properties on the referencing entry override properties from the alias. Aliases may chain but must not form cycles.

`tileData` is read from the entry being placed. It does **not** inherit from a referenced alias. Put block-entity data on the referencing entry. For spawners, a legacy `data.entitySpawn` value is converted into `tileData.SpawnData.entity.id` before placement. Invalid tile data, or tile data on a block with no tile entity, produces no payload rather than an error.

### Surface example

```json
{
"layers": [
  {
    "minHeight": 1,
    "maxHeight": 1,
    "palette": [{ "block": "minecraft:grass_block" }]
  },
  {
    "minHeight": 1,
    "maxHeight": 3,
    "palette": [
      { "block": "minecraft:dirt" },
      { "block": "minecraft:coarse_dirt" }
    ]
  }
],
"wall": {
  "palette": [
    { "block": "minecraft:stone" },
    { "block": "minecraft:andesite" }
  ]
}
}
```

## Decorators (`IrisDecorator`)

Snippet key: `decorator`. Biome field: `decorators`. The dimension must have `decorate: true` (the default).

### How a decorator is chosen

Decorators are bucketed by `partOf`. Each bucket is evaluated independently per column. Within a bucket:

1. Every decorator noise field is sampled at that column. It passes when `noise(x/zoom, z/zoom)` fitted to 0..1 is at or below `chance`.
2. Among all decorators that passed, **exactly one** is chosen, uniformly, seeded per column.

So `chance` is a share of the noise field, not an independent probability. Two decorators in the same bucket compete rather than stacking. Ten flower decorators at `chance: 0.1` do not carpet the ground. They subdivide roughly the same 10% of columns between them. Give distinct plants distinct `style` fields when you want them in visibly different patches.

### Where the block lands

The block is written one above the surface block (`height + 1`), and only into air. A palette entry carrying a `half` property is treated as a two-block plant. Both `height + 1` and `height + 2` must be air or nothing is placed.

By default the surface block must have a sturdy full up-face and satisfy the placed block platform support rule. For example, cactus accepts sand, red sand, or another cactus, but not stone. `forcePlace: true` skips that test entirely. `forceBlock` replaces the surface block with the given block first and implies `forcePlace`. When not force-placing, `whitelist` and `blacklist` are matched against the surface block. An explicitly empty `whitelist` matches nothing and blocks all placement. Omit the field rather than setting it to `[]`.

Vines get their attachment faces recomputed against surrounding blocks. Stacked weeping and twisting vines use the corresponding `_plant` state for their body and retain one vine tip at the free end. `minecraft:pointed_dripstone` and `minecraft:sulfur_spike` receive native direction and taper states for both single decorations and stacks. One-block spikes are tips; two-block spikes are frustum plus tip; longer columns add base and middle segments. Placement stops at occupied blocks and world bounds, then rebuilds the taper using the actual length. Adjacent opposing tips of the same material become `tip_merge`; sulfur and dripstone do not merge with each other.

Spikes require a full sturdy support face in their growth direction or another matching spike behind them, including when force-placed. Ceiling spikes check the underside of the ceiling. Stacked floor and ceiling decorators honor surface whitelists and blacklists. Authored waterlogging is preserved, and spikes replacing water in an underwater decoration are waterlogged automatically; spikes never replace lava. Cave decoration still skips fluid targets. After objects and pools are inserted, the final cleanup removes unsupported spike chains, restores water from waterlogged segments, and normalizes surviving tapers and merged tips. Exposed tips receive native post-load updates on Bukkit and modded platforms. Sulfur spikes require Minecraft 26.2.

| Field | Type | Default | What it does |
|-------|------|---------|--------------|
| `chance` | double 0..1 | `0.1` | Fraction of the noise field that qualifies. Raise it while debugging, then dial back |
| `palette` | `IrisBlockData[]` | grass | Blocks to place. Pack validation requires the field and at least one entry. An empty resolved snippet places nothing and never tests the gate |
| `topPalette` | `IrisBlockData[]` | `[]` | Used for the upper part of a stack — bamboo tips, cactus flowers. Empty falls back to `palette` |
| `topThreshold` | double 0.01..1 | `1` | Normalized stack position where `topPalette` takes over. `0.8` gives a tip roughly a fifth of the stack tall |
| `style` | `IrisGeneratorStyle` | `STATIC` | The field that gates `chance`. `STATIC` gives even scatter. Wispy or cellular styles give meadows and bare patches |
| `variance` | `IrisGeneratorStyle` | `STATIC` | Chooses between palette entries once a column has passed. Scattered variance mixes flowers per block. Wispy variance gives single-species drifts |
| `heightVariance` | `IrisGeneratorStyle` | `STATIC` | Shapes stack height across the terrain when `stackMin` and `stackMax` differ |
| `stackMin` / `stackMax` | int 1..2032 | `1` / `1` | Inclusive stack-height range in blocks. `1..4` produces stacks from 1 to 4 blocks tall |
| `scaleStack` | boolean | `false` | Reinterprets `stackMin`/`stackMax` as a percentage of the available vertical space instead of a block count. Meant for cave stalagmites that should scale with cavern height |
| `absoluteMaxStack` | int | `30` | Hard cap when `scaleStack` is on, so a huge cavern does not produce a 60-block column |
| `partOf` | `IrisDecorationPart` | `NONE` | Which pass places this decorator. See the table below |
| `forcePlace` | boolean | `false` | Ignores the sturdy-surface test, the slope clip, the whitelist, and the blacklist |
| `forceBlock` | `IrisBlockData` | `null` | Replaces the surface block before placing. Implies `forcePlace` |
| `whitelist` / `blacklist` | `IrisBlockData[]` | `null` | Allow/deny lists matched against the surface block. Omit rather than empty |
| `slopeCondition` | `IrisSlopeClip` | 0..10 | Rejects columns outside the slope range. Not applied on the sea-surface or ceiling passes |

### Decoration parts (`IrisDecorationPart`)

| Value | Pass, and exactly when it fires |
|-------|--------------------------------|
| `NONE` | The ordinary surface pass, on every column. Also reused by the carve modifier for cave floors |
| `SHORE_LINE` | Only where terrain equals the column's solved fluid head and at least one cardinal neighbor is below its own head. Ordinary coasts use `fluidHeight`; an accepted wet hydrology layer uses its exact `fluidHeadY`. Dry footprints never run this part |
| `SEA_SURFACE` | Where terrain is below the column's solved fluid head and connected fluid is directly above the floor. Places at local head `+ 1`, so lily pads sit on oceans or accepted river pools but not dry grades or non-water profiles |
| `SEA_FLOOR` | Same gate as `SEA_SURFACE`, but writes into the first water block above the seafloor, replacing it. Use it for kelp, seagrass, and coral fans |
| `CEILING` | Applied by the carve modifier at cave and overhang ceilings, stacking downward |

### Examples

Flower scatter with patchy dispersion:

```json
{
  "chance": 0.2,
  "variance": {
    "style": "CELLULAR",
    "zoom": 0.25,
    "fracture": { "style": "SIMPLEX", "zoom": 0.2, "multiplier": 10 }
  },
  "style": {
    "style": "SIMPLEX",
    "zoom": 0.2,
    "fracture": { "style": "STATIC", "multiplier": 8 }
  },
  "palette": [
    { "block": "minecraft:dandelion" },
    { "block": "minecraft:poppy" }
  ]
}
```

Shore cane, 2 to 5 blocks tall:

```json
{
  "partOf": "SHORE_LINE",
  "chance": 0.18,
  "stackMin": 1,
  "stackMax": 4,
  "palette": [{ "block": "minecraft:sugar_cane" }],
  "style": { "style": "NOWHERE", "zoom": 0.65 }
}
```

A reusable snippet at `snippet/decorator/bush.json`, using an air-weighted palette to thin the result without lowering `chance`:

```json
{
  "chance": 0.03,
  "style": {
    "style": "CLOVER_HERMITE",
    "zoom": 0.52,
    "exponent": 2.5,
    "axialFracturing": true
  },
  "slopeCondition": { "maximumSlope": 5 },
  "palette": [
    { "block": "minecraft:bush", "weight": 1 },
    { "block": "minecraft:air", "weight": 4 }
  ]
}
```

Weighting air into the palette is a useful trick. The column still wins the bucket contest. It just places nothing. That lets one decorator hold a patch against competing decorators while still reading as sparse.

## Deposits (`IrisDepositGenerator`)

Snippet key: `deposit`. Declared on **dimension**, **region**, and **biome**. All three lists run. Biome deposits add to regional and global ones rather than replacing them.

### What a deposit actually does

For each generator, once per chunk:

1. Roll `spawnChance` for the whole generator.
2. Pick a clump count between `minPerChunk` and `maxPerChunk`. Each clump then rolls `perClumpSpawnChance` on its own.
3. Build the selected `shape`. `IRIS` picks one of `varience` cached fixed-block-count clumps. Either vanilla shape is generated fresh from its configured vein size.
4. Pick a random position in the chunk and sample the center Y using `heightDistribution`.
5. Apply the placement scope, biome filter, host-block filter and air-exposure rule while stamping the clump.

A block is written only when the target is solid host rock. It must not be air, fluid, or a cavern mark, and it must be inside the selected placement scope. Buried and cave-wall candidates use `replaceableBlocks`. When an ore candidate occupies the terrain top or touches exterior ordinary air, `surfaceReplaceableBlocks` replaces that buried-host rule. `minecraft:cave_air` does not identify a terrain surface, so cave walls retain the normal host rules. The surface biome at each candidate may replace the deposit's surface list through `surfaceOreReplaceableBlocks`. Unless `replaceBedrock` is set, the target must not be bedrock. Deposits therefore never overwrite cave air or water. `ABOVE_TERRAIN` still requires an existing solid host. It can mineralize a floating island without creating a floating ore block.

**Legacy depth limits remain the default.** `placementScope: TERRAIN`, `heightDistribution: CLIPPED_UNIFORM` and `surfaceClearance: 7` preserve the old behavior. The center band is clipped to terrain and individual cells stay below their column surface limit. Vanilla-like definitions normally use `UNIFORM` or `TRIANGLE` with clearance `0`. Those sample the authored band before rejecting out-of-world cells. A distribution can taper naturally into the build floor.

Every height is engine-local. Convert an absolute world Y with `localY = worldY - dimensionMinY`. Keep an `above_bottom` value unchanged. Convert `below_top: n` to `dimensionHeight - 1 - n`. Negative local bounds are valid for unclipped distributions. They deliberately put part of the probability below the build floor.

**Deepslate conversion is automatic and host-aware.** When no `depositVariants` rule matches, Iris converts a normal ore to its deepslate form exactly when the replaced block is deepslate. It converts a deepslate ore back when the host is ordinary stone. A vanilla pack should not use a fixed-Y remap. `depositVariants` is for modded ores and deliberate substitutions.

| Field | Type | Default | What it does |
|-------|------|---------|--------------|
| `minHeight` / `maxHeight` | int -8192..8192 | `1` / `75` | Inclusive engine-local center band. Negative values are useful with an unclipped bottom-relative distribution |
| `heightDistribution` | `CLIPPED_UNIFORM`, `UNIFORM`, `TRIANGLE` | `CLIPPED_UNIFORM` | Legacy terrain-clipped uniform sampling, authored-band uniform sampling, or a midpoint-peaked triangular distribution |
| `placementScope` | `TERRAIN`, `ABOVE_TERRAIN`, `FULL_HEIGHT` | `TERRAIN` | Restricts cells below terrain, above terrain, or only by the full build-height and host rules. `FULL_HEIGHT` is useful for Nether-style solid ceilings |
| `surfaceClearance` | int 0..256 | `7` | Distance from the terrain surface enforced by `TERRAIN` and `ABOVE_TERRAIN`. Ignored by `FULL_HEIGHT` |
| `minSize` / `maxSize` | int 0..8192 | `0` / `128` | Fixed block count for `IRIS`, or the configured vein-size parameter for either vanilla shape |
| `shape` | `IRIS`, `VANILLA_ELLIPSOID`, `VANILLA_SCATTERED` | `IRIS` | Cached Iris clump, Minecraft-style chained ellipsoids, or the sparse candidate pattern used by ancient debris |
| `minPerChunk` / `maxPerChunk` | int 0..2048 | `0` / `3` | Clumps attempted per chunk. This is the main frequency knob |
| `spawnChance` | double 0..1 | `1` | Rolled once per chunk for the whole generator. Use it for rare deposits that should be absent from most chunks entirely |
| `perClumpSpawnChance` | double 0..1 | `1` | Rolled per clump, thinning within a chunk rather than between chunks |
| `discardChanceOnAirExposure` | double 0..1 | `0` | Discards this fraction of candidates touching orthogonal air. Chunk-edge neighbors outside the current generation buffer are treated as covered |
| `palette` | `IrisBlockData[]` | required | Clump materials, picked uniformly per block. **`weight` is ignored here**, unlike every other palette. List a block twice to double it |
| `replaceableBlocks` | block-id array | `[]` | Exact solid host materials this deposit may replace. Empty preserves the legacy any-solid rule |
| `surfaceReplaceableBlocks` | block-id array | `[]` | Host allowlist for ore candidates at the terrain top or touching exterior ordinary air. Empty adds no surface restriction. Cave-air walls and non-ore deposits are unaffected |
| `biomeScope` | `SURFACE`, `CAVE` | `CAVE` | Which biome lookup the include/exclude lists inspect |
| `includedBiomes` / `excludedBiomes` | biome-key array | `[]` | Iris biome load keys or vanilla derivative ids. Inclusion is checked before exclusion |
| `varience` | int 1..64 | `3` | Number of cached `IRIS` silhouettes. It does not affect either vanilla shape. The field name is spelled this way in code |
| `replaceBedrock` | boolean | `false` | Allows overwriting bedrock |

### Biome ore controls

| Field | Range | Default | What it does |
|-------|-------|---------|--------------|
| `surfaceOreReplaceableBlocks` | block-id array, omitted, or `[]` | omitted | Replaces the deposit surface host list in this surface biome. Omitted inherits, `[]` forbids all terrain-surface ore, and a nonempty list permits exactly those hosts |
| `oreDepositFrequencyMultiplier` | 0..1 | `1` | Drops that fraction of ore clumps whose center lands in this biome. `0.4` keeps 40%. It cannot increase frequency. The range stops at 1 |
| `oreDepositSizeMultiplier` | 0.01..16 | `1` | Rescales ore clump block counts in this biome. This one can go up, to 16x |

All three controls apply only to deposits whose palette resolves to at least one ore block. The two multipliers are read from the **cave**-biome lookup at the clump position, which falls back to the surface biome above `caveMinDepthBelowSurface`. A deep cave biome can therefore enrich or starve ore at depth independently of the biome on the surface. The surface host override instead uses the surface biome at each candidate block, so one clump crossing a biome boundary follows each side's surface policy.

### Deposit variants (`IrisDepositVariant`)

Snippet key: `deposit-variant`. Rewrites ore ids at placement time inside an absolute world-Y band. Available on dimension, region, and biome. Order is biome rules, then region, then dimension. The first band that contains the block world Y and has a matching source id wins.

| Field | Type | Default | What it does |
|-------|------|---------|--------------|
| `minHeight` / `maxHeight` | int -2048..8192 | `0` / `0` | Inclusive **absolute world Y**, not engine-local. This differs from the deposit own band |
| `remap` | map string→string | `{}` | Source block id to replacement block id. Source matching is by material only, so properties on the source key are ignored. Unresolvable ids on either side are dropped silently |

```json
{
"depositVariants": [
  {
    "minHeight": -64,
    "maxHeight": 0,
    "remap": {
      "yourmod:iron_ore": "yourmod:deepslate_iron_ore"
    }
  }
]
}
```

The dimension also exposes `hideOresForHiddenOre`. When true, every ore the generator would place is emitted as its base material instead. That includes terrain ores, deposits, and ores inside objects. A drop-control plugin such as HiddenOre then owns ore rewards. See [28 - Integrations](/iris/28-integrations).

## Noise ores (`IrisOreGenerator`)

Separate from deposits and much cheaper. No clumps, no per-chunk budget, just a 3D noise test per cell during the terrain pass. Declared as `ores` on **dimension, region, and biome** (all three, despite the older docs listing only the dimension).

| Field | Default | What it does |
|-------|---------|--------------|
| `palette` | empty | Material palette for the ore. An empty palette makes the generator inert |
| `chanceStyle` | `STATIC` | The 3D field tested against `threshold`. Cellular styles give clustered pockets. Static gives evenly sprinkled specks |
| `threshold` | `0.5` | The cell becomes ore when the noise value is at or below this. Higher means more ore |
| `range` | `30..80` | Engine-local Y band. Cells outside it are skipped before the noise sample |
| `generateSurface` | `false` | `false` runs the generator in the underground pass, after the biome layer stack has been exhausted, so it replaces rock. `true` runs it in a pass that executes **before** layers and fluid at every Y in the column. It can overwrite soil, water, and anything else |

Precedence within a pass is biome, then region, then dimension. The first generator that returns a block wins. Y bands are precomputed, so generators outside the current Y are skipped without evaluating noise.

## Post-processing slabs and walls

The post modifier (stage 3) reads the biome `slab` and `wall` palettes. It is gated by the dimension `postProcessingSlabs` and `postProcessingWalls` flags, both true by default.

- **Slabs** are added where at least one cardinal neighbor column is exactly one block higher and that neighbor top block is a solid non-slab. The `slab` palette `slopeCondition` is honored. A resolved air block cancels the placement. A snow slab is suppressed at or below the fluid line.
- **Walls** are painted where a cardinal neighbor is three or more blocks lower, running down the exposed face until it hits air or water. This is the same `wall` palette the carve modifier uses for cave walls. A biome that wants different cliff and cave rock needs a dedicated cave biome.

Both palettes default to empty, which disables the corresponding effect for that biome.

## Tuning order

Do these one at a time, on a focused biome that already produces correct height. Each stage makes a wrong palette, filter, or Y band independently visible.

**Surface.** Define one to three `layers` covering soil down to subsoil and leave stone to `rockPalette`. Add `wall` for cliff biomes and `seaLayers` for oceans. Use `lockLayers` only for mesa stripes. Inspect flat ground, a steep slope, an exposed cliff face, and an underwater column before you move on.

**Decorators.** Start with a single decorator, `STATIC` style, low `chance`. Confirm it appears, then switch to a wispy or cellular style to get patches. Add `partOf` variants for shore, sea, and ceiling content. Set `stackMin`/`stackMax` and `topPalette` for cane, cactus, and bamboo. The configured bounds are the actual inclusive block-count bounds. Extract repeated definitions into `snippet/decorator/*.json` (see [24 - Pack Mods & Snippets](/iris/24-pack-mods-snippets)). Always check somewhere the filter should *reject* the decorator, not just somewhere it should accept it.

**Deposits.** Put broad stone blobs and common ores on the dimension, regional minerals on regions, signature ores on biomes. Translate vanilla absolute, bottom-relative and top-relative anchors into engine-local Y before you tune counts. When a dimension stretches the vanilla vertical span, normalize each vanilla anchor. Use the same fraction of the custom span. Do not copy the raw world Y. Use `replaceableBlocks` for the complete buried and cave-wall host set, `surfaceReplaceableBlocks` when exterior terrain needs a narrower set, and biome `surfaceOreReplaceableBlocks` for local overrides such as sand-bearing deserts. Raise `varience` only for `IRIS` shapes. Add `depositVariants` last, and only for ids automatic host-aware deepslate conversion does not handle.

## Practical notes

- Decorators place blocks only. Trees, boulders, and structures come from object placements ([20 - Object Placement](/iris/20-object-placement)) and procedural objects ([17 - Trees, Fungi, Coral, Crystals, Formations, Ruins](/iris/17-trees-fungi-coral-crystals-formations-ruins)).
- One decorator per `partOf` bucket places per column. More decorators in a bucket means each appears less often, not more total coverage.
- Deposit `varience` is not `variance`. Generator styles use `multiplicitive`, not `multiplicative`. Both spellings are the actual field names.
- Deposit palettes ignore `weight`. Every other palette in the pack honors it.
- The dimension `explodeBiomePalettes` flag inserts barrier blocks between layer groups so you can count layer boundaries in a cross-section. It is a debug aid and should never be enabled in production.
