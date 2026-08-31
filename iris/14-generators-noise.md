---
title: "Generators, Noise & Expressions"
description: "Iris documentation: Generators, Noise & Expressions"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Generators are the shape of your terrain. A generator file composites one or more noise layers into a single 0..1 value per column. It can then quantise that value into cliffs and crack it into cells. It also declares how it blends across biome borders. Biomes reference generators by key and supply the height band the 0..1 value is mapped into. Styles, expressions and PNG image maps are the three things that can supply the raw noise.

Related:

- [11 - Dimensions](/iris/11-dimensions)
- [12 - Regions](/iris/12-regions)
- [13 - Biomes](/iris/13-biomes)
- [15 - Caves & Carving](/iris/15-caves-carving)
- [16 - Surfaces, Decorators & Deposits](/iris/16-surfaces-decorators-deposits)
- [05 - Concepts & Pack Layout](/iris/05-concepts-pack-layout)
- [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas)

## Where files live

| Path | Class | Role |
|------|-------|------|
| `generators/<key>.json` | `IrisGenerator` | Height-map composite that biomes reference |
| `expressions/<key>.json` | `IrisExpression` | Math expression usable anywhere a style is accepted |
| `images/<key>.png` | `IrisImage` | PNG sampled through `IrisImageMap` |
| `snippet/style/<key>.json` | reusable `IrisGeneratorStyle` fragment | Shared style definitions (`snippet/style/bedrock.json` is a plain `STATIC`) |

Generators are never embedded in biome JSON. A biome links them:

```json
{ "generators": [{ "generator": "plain", "min": 4, "max": 14 }] }
```

## How a noise number becomes a block height

Understand this mapping before changing any field. The named generator alone does not determine the final shape.

### Step 1 — a generator produces 0..1 for a column

Each `composite` entry is sampled at the column, then combined:

- **Additive** (default): sum the layers outputs, divide by the sum of their `opacity` values, multiply by the generator `opacity`.
- **Multiplicative** (`"multiplicitive": true`): start at 1, multiply each layer output, then multiply by the generator `opacity`.

An empty `composite` returns 0 for every column. That is a flat world at the bottom of the biome band. That is the silent failure mode when a generator file is malformed.

Then two optional post-passes:

- **Cliffs** run when `cliffHeightMax > 0`. The value is quantised to steps of a per-column cliff height drawn between `cliffHeightMin` and `cliffHeightMax`. That turns smooth slopes into terraces and mesa walls.
- **Cell fracture** runs when `cellFractureHeight` is non-zero. A cell distance field is sampled. Outside the cell cores the value is multiplied by `cellFractureHeight`, cutting canyon-like veins between plateaus.

### Step 2 — generators are grouped by interpolator, and averaged within a group

Iris collects every generator referenced by every biome the dimension can reach. It buckets them by `interpolator`: the pair of `function` and `horizontalScale`. **Two generators with the same function and the same `horizontalScale` land in the same bucket.**

For each bucket, at each column:

1. The interpolator samples the surrounding columns and blends their biomes height bands for that bucket. That gives a smoothed low and high.
2. Every generator in the bucket is evaluated at the column and mapped into that smoothed low..high range.
3. The results are averaged.

Bucket results are then added together to give the column height. `fluidHeight` plus any dimension `overlayNoise` is added on top before the final clamp to the dimension usable range.

Two practical consequences:

- **Generators that share an interpolator blend into one averaged shape.** If `plain` and `rare-hills` both use `BILINEAR_STARCAST_9` with `horizontalScale: 12`, they share a bucket. A biome that references only `plain` still gets the average of both shapes inside its own band. The shipping overworld deliberately spreads generators across distinct `horizontalScale` values (`12`, `15`, `23`, `26`, `52`, ...) so that most of them stay independent.
- **Generators with distinct interpolators stack additively.** That is why a biome can use one link for rolling dunes and another for rare hills and get the sum of both bands.

If you want a new generator to be its own independent layer, give it an interpolator nobody else uses. If you want it to blend with an existing one, match the existing one exactly.

### Step 3 — the biome maps it into blocks

The biome link clamps the generator output to 0..1 and lerps it into `min`..`max`, in blocks relative to the dimension `fluidHeight`. Negative bands put the surface under water. See [13 - Biomes](/iris/13-biomes).

Generators control shape and smoothing radius; biomes control the height range. Share one generator across many biomes, then vary `min` and `max` per biome to create continuous terrain across height bands.

## Walkthrough: add a generator and prove it is wired

Prerequisites: a validating pack, one biome you can `focus`, and a fixed seed.

1. Save this as `generators/tutorial-hills.json`:

```json
{
  "interpolator": { "function": "NONE", "horizontalScale": 1 },
  "seed": 310,
  "composite": [
    { "seed": 310, "style": { "style": "FLAT" } }
  ]
}
```

2. Point the focused biome at it. This is a field in the biome file, not a new file:

```json
{ "generators": [{ "generator": "tutorial-hills", "min": 16, "max": 48 }] }
```

3. Validate. Open Studio on seed `1337`. Fly into new chunks.

Observable result: a dead-flat surface at exactly 48 blocks above `fluidHeight`. `FLAT` returns 1.0 for every coordinate, so the link maps to `max`. Seeing 48 and not 16 or 32 proves the file path, the biome link and the band are all live.

4. Change only `style.style` from `FLAT` to `IRIS`. Then generate a fresh area. Keep the seeds and the band fixed so any change in relief is attributable to the style.

Observable result: rolling terrain filling the whole 16-48 band.

5. Tune the generator `zoom` for feature size. Higher `zoom` divides the sample coordinates, so features get wider and smoother. Lower `zoom` packs more detail into the same space. Do not change the band in the same comparison.
6. Add a second biome using the same generator with a different band. Look at the border. Only after both biomes look right on their own should you tune `interpolator.horizontalScale`.
7. Add composite layers, `fracture`, expressions or image maps one at a time. Re-check chunk generation time after any nested fracture.

The tutorial passes when seed `1337` reproduces the same terrain after a Studio restart. Borders must blend the way you intended. Validation must resolve every generator, expression and image key.

If it is still flat after switching to `IRIS`, the biome is not actually using this generator. Check the key. If terrain drops to void, restore the baseline above and read validation output before you change noise values again.

## Walkthrough: make the mountains taller

Do not touch the generator. Raise the band on the biome:

```json
{ "generators": [{ "generator": "mountain", "min": 8, "max": 160 }] }
```

Observable result: the same mountain shape, stretched vertically, with the valley floors at 8 and the peaks at 160.

To make peaks sharper rather than taller, change the shape instead. Add `"exponent": 2` to the composite layer. That pushes mid values down and leaves the highs alone. Or raise `interpolator.horizontalScale` so the height band blends over a wider radius and gives long approach slopes.

To make the mountains rarer without shrinking them, split them into a second link with a low-probability shape and a wide band. `temperate/oak-forest` does this with `rare-hills` at `0..40`.

## Walkthrough: flatten an area

Two different jobs, two different tools:

- **Flat biome, natural borders**: set the biome `min` equal to its `max`. The band collapses to one value, so the generator shape has nowhere to go. The edges still blend into neighbors across the interpolation radius.
- **Flat generator, reused anywhere**: build a generator whose composite is a single `FLAT` style, as `generators/flat.json` does. Any biome linking it gets a constant surface at its `max`.

Prefer the first when only one biome needs to be flat. Prefer the second when you are building a flat dimension.

## Generator file (`IrisGenerator`)

| Field | Type | Default | What it does |
|-------|------|---------|--------------|
| `seed` | long | `1` | Required. Mixed with the engine height seed. Changing it re-rolls the terrain of every biome using this generator. |
| `interpolator` | `IrisInterpolator` | `BILINEAR_STARCAST_6`, scale `7` | Required. Both the border smoothing and the bucket key. See "Step 2" above. |
| `composite` | `IrisNoiseGenerator[]` | `[]` | The noise layers. Empty gives 0 everywhere. |
| `zoom` | double >= 0.001 | `1` | Divides the sample coordinates before the layers see them. Higher values give larger, smoother features across the whole generator. |
| `opacity` | double >= 0 | `1` | Multiplies the combined result. Below 1 compresses the generator into the bottom of the biome band. Above 1 pushes it past the top and clips. |
| `multiplicitive` | boolean | `false` | Multiplies the composite layers instead of averaging them. Useful for masking one shape with another (a ridge times a mask leaves ridges only inside the mask). The field spelling is code-authoritative. The JSON must match. |
| `offsetX` / `offsetZ` | double | `0` | Shifts where this generator samples the world. Use it to break the alignment between two generators that would otherwise peak in the same places. |
| `cliffHeightMin` | double 0..8192 | `0` | Lower bound of the per-column cliff step height. |
| `cliffHeightMax` | double 0..8192 | `0` | Upper bound. Cliffs are active whenever this is above 0. `cliffHeightMin` alone does nothing. Larger steps give taller terraces. |
| `cliffHeightGenerator` | `IrisNoiseGenerator` | default layer | Picks the step height between min and max per column, so terrace heights can vary across the map. `CELLULAR_HEIGHT` is the usual choice because it gives one height per cell. |
| `cellFractureHeight` | double | `0` | `0` disables cell cracks. Non-zero multiplies the height outside cell cores. `0.2` drops the veins to a fifth of the plateau height and carves canyons. |
| `cellFractureZoom` | double >= 0.001 | `1` | Size of the cells. |
| `cellFractureShuffle` | double >= 0 | `12` | Randomizes the cell centers. Low values give a regular lattice. High values look organic. |
| `cellPercentSize` | double 0..1 | `0.75` | How much of a cell is core versus vein. `0.1` means thick veins and small plateaus. |

### Interpolator (`IrisInterpolator`)

| Field | Type | Default | What it does |
|-------|------|---------|--------------|
| `function` | `InterpolationMethod` | `BILINEAR_STARCAST_6` | The kernel used to blend neighboring columns height bands. Required. |
| `horizontalScale` | double 1..8192 | `7` | Radius, in blocks, of that blend. Small values keep detail but make biome borders abrupt. Large values give long smooth transitions and wash out small features. Required. |

Available methods: `NONE`, `BILINEAR`, `STARCAST_3/6/9/12`, `BILINEAR_STARCAST_3/6/9/12`, `HERMITE_STARCAST_3/6/9/12`, `BILINEAR_BEZIER`, `BILINEAR_PARAMETRIC_1_5/2/4`, `BICUBIC`, `HERMITE`, `CATMULL_ROM_SPLINE`, `HERMITE_TENSE`, `HERMITE_LOOSE`, and the four `HERMITE_LOOSE_HALF/FULL_POSITIVE/NEGATIVE_BIAS` variants.

The shipping overworld uses `BILINEAR_STARCAST_9` almost everywhere and varies `horizontalScale` from 6 to 200. Higher starcast numbers cost more per column. `NONE` with scale `1` is the cheapest and gives hard borders, which is what `generators/flat.json` wants.

### Noise layer (`IrisNoiseGenerator`)

Available as the `generator` snippet.

| Field | Type | Default | What it does |
|-------|------|---------|--------------|
| `style` | `IrisGeneratorStyle` | `IRIS` | Where the raw noise comes from. Required. |
| `seed` | long | `0` | Required. Offsets this layer noise independently of the generator seed. |
| `enabled` | boolean | `true` | When false the layer returns `offsetY` and nothing else. That is a cheap way to mute a layer while comparing. |
| `zoom` | double >= 0.0001 | `1` | Divides this layer sample coordinates. Give each octave-like layer a different zoom to build detail on top of large forms. |
| `opacity` | double 0..1 | `1` | This layer amplitude and its weight in the additive average. Two layers at `1` and `0.25` combine roughly 4:1. |
| `negative` | boolean | `false` | Turns the output into `-noise + opacity`, mirroring the shape. Ridges become valleys. |
| `offsetX` / `offsetZ` | double | `0` | Shifts the sample position after the zoom divide, so the unit is style space rather than blocks. |
| `offsetY` | double | `0` | Added to the output, not the coordinates. Avoid it in terrain generators. It pushes the layer outside 0..1 and skews the average. |
| `exponent` | double | `1` | Power curve on the output, sign-preserving. Above 1 pushes mid values down (flat basins, sharp peaks). Below 1 lifts them (plateaus with narrow valleys). |
| `octaves` | int >= 1 | `1` | Stacks the style at successively finer scales. Cheap way to add detail without more layers. |
| `parametric` | boolean | `false` | S-curve remap. Steepens the middle and softens both ends. |
| `bezier` | boolean | `false` | Softer S-curve remap. `generators/plain.json` uses it to keep lowlands gentle. |
| `sinCentered` | boolean | `false` | Maps 0 and 1 to 0 and 0.5 to 1 with a sine shape, turning a gradient into a ridge. |
| `fracture` | `IrisNoiseGenerator[]` | `[]` | Child layers whose output warps this layer input coordinates, producing the swirled, non-grid look. Each child costs a full extra noise evaluation, and children can nest. |

Remap order inside a layer: sample the style, multiply by `opacity`, apply `negative`, apply `exponent`, add `offsetY`, then `parametric`, `bezier`, `sinCentered` in that order.

## Generator style (`IrisGeneratorStyle`)

Available as the `style` snippet, and accepted anywhere Iris configures noise: generator layers, decorators, deposit palettes, cave profiles, biome child shapes, dimension placement noise.

| Field | Type | Default | What it does |
|-------|------|---------|--------------|
| `style` | `NoiseStyle` | `FLAT` | The built-in algorithm. Used only when neither `expression` nor `imageMap` produced a usable source. |
| `zoom` | double >= 0.00001 | `1` | Feature scale. Applied as a coordinate multiplier of `1/zoom`, so larger zoom means larger features. |
| `exponent` | double 0.01562..64 | `1` | Power curve on the style output before anything else consumes it. |
| `multiplier` | double >= 0.00001 | `1` | Only read when this style is somebody `fracture` child. It scales the coordinate displacement applied to the parent, roughly plus or minus half this value. `18` gives noticeable swirls. `55` heavily distorts. |
| `fracture` | `IrisGeneratorStyle` | `null` | Warps the coordinates fed into this style. This is the main tool for making cellular and vascular styles look organic instead of geometric. |
| `cellularFrequency` | double | `0` | Above 0, post-processes the style into cells, so continuous noise becomes flat-valued patches. |
| `cellularZoom` | double | `1` | Cell size after cellularising. Ignored when `cellularFrequency` is 0. |
| `expression` | expression key | `null` | Use `expressions/<key>.json` as the noise source instead of `style`. |
| `imageMap` | image-map key | `null` | Use a typed resource under `image-maps/` as the noise source instead of `style`. |
| `cacheSize` | int 0..8192 | `0` | Above 0, the built noise is cached to a `.cnm` file under the pack `.cache` folder. Worth it for expensive expression or heavily fractured styles that are sampled repeatedly. Wasted on cheap styles. |

Source priority: if `expression` is set, Iris loads it and uses it. If the expression fails to load, the style falls straight back to `NoiseStyle`; `imageMap` is not tried. `imageMap` is consulted only when `expression` is unset. A missing or invalid image-map resource is a blocking pack error before world generation.

### Choosing a `NoiseStyle`

There are 171 constants. The Studio schema lists all of them. These are the ones that matter for terrain work:

| Purpose | Styles | Notes |
|---------|--------|-------|
| General terrain | `IRIS`, `IRIS_DOUBLE`, `IRIS_THICK`, `IRIS_HALF`, `SIMPLEX`, `PERLIN`, `PERLIN_IRIS` | `IRIS*` are pre-fractured signature noises and are the default choice for land. |
| Large dramatic forms | `FRACTAL_SMOKE`, `FRACTAL_WATER`, `FRACTAL_FBM_SIMPLEX`, `FRACTAL_BILLOW_PERLIN` | `FRACTAL_SMOKE` at a large `horizontalScale` is what the shipping `mountain` generator uses. |
| Coordinate warping (as a `fracture` child) | `NOWHERE`, `NOWHERE_CELLULAR`, `STATIC` | `NOWHERE` with a small zoom and a large `multiplier` is the standard swirl recipe. |
| Plateaus and cliffs | `GLOB`, `CELLULAR_HEIGHT` | `CELLULAR_HEIGHT` gives one constant value per cell, which is what a cliff-height generator wants. |
| Cells and veins | `CELLULAR`, `CELLULAR_IRIS_DOUBLE`, `CELLULAR_IRIS_THICK`, `VASCULAR`, `VASCULAR_THIN`, `SIMPLEX_VASCULAR`, `CLOVER`, the `HEX*` family | Used for region and biome placement more often than for height. |
| Scatter and flat | `STATIC` (white noise), `STATIC_BILINEAR`, `FLAT` | `STATIC` is for per-block palette scatter, never terrain relief. `FLAT` returns 1.0 at every coordinate. |

## Expressions (`IrisExpression`)

An expression file is a Paralithic 0.8.1 formula that can supply the raw value anywhere an `IrisGeneratorStyle` is accepted. It is still a live pack resource on every Iris platform. Put the file under `expressions/<key>.json`, then reference that key from a style's `expression` field.

This complete 2D example produces concentric 0..1 rings around world origin. In `expressions/tutorial/rings.json`:

```json
{
  "expression": "0.5 + sin(sqrt(x*x + y*y) / 16) * 0.5"
}
```

Reference it anywhere a style is accepted:

```json
{
  "expression": "tutorial/rings",
  "zoom": 1
}
```

In a terrain generator, place that style in a layer exactly as you would a built-in `style`. Generate fresh Studio chunks around `0,0`; the terrain band should alternate through smooth rings. The formula itself returns arbitrary doubles and Iris does not clamp it to 0..1. Keep values in the range the consuming field expects unless extrapolation is deliberate.

| Field | Type | What it does |
|-------|------|--------------|
| `expression` | string | Required. The formula. `x`, `y` and `z` are pre-declared. Do not redeclare them as variables. |
| `variables` | `IrisExpressionLoad[]` | Optional named values bound before evaluation. Omit this field when unused; the schema requires at least one element when the array is present. |
| `functions` | `IrisExpressionFunction[]` | Optional named noise functions available inside the formula. Omit this field when unused; the schema requires at least one element when the array is present. |

### Coordinates

The inherited coordinate names depend on how the consuming style samples the expression:

| Sampling form | `x` | `y` | `z` |
|---|---|---|---|
| 1D | input X | `-1` | `-1` |
| 2D | world X | world Z | `-1` |
| 3D | world X | world Y | world Z |

Terrain-height and map-placement styles normally use 2D sampling. Write those expressions against `x` and `y`; `y` is the horizontal world-Z axis there. A 3D cave or density style receives the ordinary X/Y/Z axes. The outer style's `zoom` scales coordinates before the formula runs, and nested variable/function styles can apply their own zoom again.

### Numbers, constants, and names

Expressions are numeric only and evaluate as Java `double` values. Integer, decimal, and scientific literals such as `12`, `0.25`, and `1e-3` are accepted. Names are case-sensitive. An identifier starts with a letter and then uses letters, digits, or `_`.

Two constants are always present:

| Constant | Value |
|---|---:|
| `pi` | 3.141592653589793 |
| `euler` | 2.718281828459045 |

An expression cannot declare local variables. Paralithic has a `let` syntax, but Iris constructs the parser with that feature disabled. Values must come from `x`, `y`, `z`, the two constants, or the expression file's `variables` list.

### Operators

Operators bind in the following order, highest first. Operators in the same row have equal precedence. Binary chains are left-associative, including power and the two logical operators.

| Binding | Syntax | Result |
|---|---|---|
| Grouping / absolute value | `(a)`, `|a|` | Group a subexpression, or return its absolute value |
| Unary | `+a`, `-a` | Pass through or negate `a` |
| Power | `a ^ b`, `a ** b` | Raise `a` to `b`; `^` is the conventional Iris spelling |
| Product | `a * b`, `a / b`, `a % b` | Multiply, divide, or take the remainder |
| Sum | `a + b`, `a - b` | Add `b`, or subtract `b` from `a` |
| Comparison | `a < b`, `a <= b`, `a > b`, `a >= b`, `a = b`, `a != b` | Return 1 when true, otherwise 0 |
| Logical | `a && b`, `a || b` | Numeric AND or OR; return 1 or 0 |

Zero is false. Every nonzero value, including a negative value, is true. `&&`, `||`, and `if` short-circuit, so an unused right side or branch is not evaluated.

The precedence differs from Java in several places:

- Equality is one `=`, not `==`.
- `&&` and `||` have the same precedence. `1 || 0 && 0` is read left-to-right as `(1 || 0) && 0` and returns 0. Parenthesize mixed logical tests.
- Power is left-associative. `2 ^ 3 ^ 2` returns 64, not 512.
- Unary minus binds before power. `-2 ^ 2` returns 4; write `-(2 ^ 2)` for -4.

### Built-in functions

Trigonometric inputs and inverse-function outputs are radians unless `rad` or `deg` converts them.

| Function | Arguments | Runtime behavior |
|---|---:|---|
| `floor(a)` | 1 | Greatest integer less than or equal to `a` |
| `ceil(a)` | 1 | Least integer greater than or equal to `a` |
| `round(a)` | 1 | Java nearest-integer rounding |
| `pow(a,b)` | 2 | `a` raised to `b` |
| `min(a,b)` / `max(a,b)` | 2 | Smaller / larger argument |
| `sqrt(a)` | 1 | Square root |
| `sin(a)` / `cos(a)` / `tan(a)` | 1 | Trigonometric functions |
| `sinh(a)` / `cosh(a)` / `tanh(a)` | 1 | Hyperbolic functions |
| `asin(a)` / `acos(a)` / `atan(a)` | 1 | Inverse trigonometric functions |
| `atan2(y,x)` | 2 | Signed angle from the positive X axis to `(x,y)` |
| `rad(a)` / `deg(a)` | 1 | Degrees to radians / radians to degrees |
| `abs(a)` | 1 | Absolute value; equivalent to `|a|` |
| `log(a)` / `ln(a)` | 1 | Base-10 / natural logarithm |
| `exp(a)` | 1 | `euler` raised to `a` |
| `sign(a)` | 1 | -1 below zero, 0 at zero, 1 above zero |
| `sigmoid(a,b)` | 2 | Exactly `1 / exp(-a*b)`, which equals `exp(a*b)`; despite the name, this is not a conventional logistic sigmoid |
| `if(test,yes,no)` | 3 | Evaluate and return only `yes` when `test` is nonzero, otherwise only `no` |

The legacy expression guide had several incorrect labels: it reversed `floor` and `ceil`, listed `atan` with two arguments, described `<` backwards, and described subtraction backwards. The table above follows the parser Iris uses.

### Variable (`IrisExpressionLoad`)

Available as the `expression-load` snippet.

| Field | Default | What it does |
|-------|---------|--------------|
| `name` | `""` | The identifier used in the formula. Required. Must be unique and must not be `x`, `y`, `z`, `pi`, or `euler`. |
| `engineValue` | `null` | An engine scalar (`IrisEngineValueType`). Highest priority. Requires an active engine. |
| `engineStreamValue` | `null` | An engine procedural stream (`IrisEngineStreamType`) sampled at the coordinates. Second priority. Requires an active engine. |
| `styleValue` | `null` | A nested `IrisGeneratorStyle` sampled at the coordinates. Third priority. |
| `staticValue` | `-1` | A constant. Used only when none of the above are set. Note the default is `-1`, not `0`. |

The engine-backed choices are:

| `engineValue` | Meaning |
|---|---|
| `ENGINE_HEIGHT` | Engine height span |
| `ENGINE_MIN_HEIGHT` | Engine minimum build Y |
| `ENGINE_MAX_HEIGHT` | Engine maximum build Y |
| `FLUID_HEIGHT` | Dimension fluid level |

| `engineStreamValue` | Sampled engine field |
|---|---|
| `SLOPE` | Terrain slope |
| `HEIGHT` | Terrain height |
| `HEIGHT_OR_FLUID` | Greater of terrain and fluid surface |
| `OVERLAY_NOISE` | Surface-overlay noise |
| `REGION_STYLE` | Region-selection style value |
| `REGION_IDENTITY` | Region identity value |

Use engine-backed variables only where the expression runs inside an active world engine. Offline or registry-only tooling has no engine and throws if it tries to evaluate one.

### Function (`IrisExpressionFunction`)

Available as the `expression-function` snippet.

| Field | Default | What it does |
|-------|---------|--------------|
| `name` | none | The identifier called in the formula. Required. Keep it unique and do not reuse a built-in function name. Later duplicate registrations replace earlier ones. |
| `styleValue` | `null` | Backs the function with a noise style, so `myNoise(a, b)` samples that style at `a, b`. Two arguments sample it in 2D; three sample it in 3D. Arguments beyond the third are accepted when `args` is larger but are not consumed by the underlying style. |
| `engineStreamValue` | `null` | Backs it with an engine stream instead. Takes priority over `styleValue`. |
| `args` | `2` (minimum 2) | Argument count. Ignored when `engineStreamValue` is set, which always takes exactly 2. |

A function with neither `styleValue` nor `engineStreamValue` is skipped at parse time. Calling it fails to parse.

### Failure behavior and validation limits

A missing or unloadable expression resource makes the containing style fall back to its `NoiseStyle`. A malformed formula is different: Iris logs `Script load failed` when the formula is first sampled, caches no usable expression, and generation can then fail while evaluating it. Fix the formula; do not expect the style fallback to rescue a parse error.

Pack validation resolves expression keys and follows their nested styles so it can find image-map dependencies. It does not parse the formula itself. A successful `/iris pack validate` therefore does not prove expression syntax. Exercise the expression in Studio, watch the console for the first sample, and generate fresh chunks in every sampling context that uses it.

## Image-map styles

A style references a reusable typed resource by its key under `image-maps/`:

```json
{
  "style": {
    "imageMap": "terrain/height",
    "zoom": 1,
    "exponent": 1
  }
}
```

The resource selects its PNG source, scalar map type, coordinate transform, raw decoding, sampling, height range, alpha, and out-of-bounds behavior. PNGs remain under `images/`; generator JSON does not embed those settings. `COLOR_MAP` is not a scalar source and is rejected here. Direct generator styles may transform coordinates before callers transform them again, so their map must use `FALLBACK`, `CLAMP`, `REPEAT`, or `MIRROR`; `ERROR` is rejected because a finite sampling domain cannot be proved. Studio, validation, runtime generation, and packaging preflight compile the same resource definition.

Use [37 - Image Map Concepts](/iris/37-image-map-concepts) for the model, [38 - Supported Image Inputs](/iris/38-supported-image-inputs) for source limits, and [43 - Image Map Configuration & Coordinates](/iris/43-image-map-config-coordinates) for the complete reference.

## Dimension-level noise

Dimensions use styles for placement rather than height. These are listed here because they use the same `IrisGeneratorStyle` type. Their behavior belongs to [11 - Dimensions](/iris/11-dimensions).

| Dimension field | Role |
|-----------------|------|
| `regionStyle` + `regionZoom` | Which region owns a column |
| `continentalStyle` + `continentZoom` + `landChance` | Land versus sea |
| `landBiomeStyle` / `seaBiomeStyle` / `shoreBiomeStyle` / `caveBiomeStyle` | Which biome within the region list for that role |
| `biomeZoom`, `landZoom`, `seaZoom` | Global biome size multipliers applied before the region own zooms |
| `overlayNoise` | `IrisShapedGeneratorStyle[]` height offsets added on top of every column, each with its own `generator` style and `min`/`max` |
| `coordFractureDistance` / `coordFractureZoom` | Global coordinate warp, the source of the large-scale "Iris swirls" |
| `rockPalette` / `fluidPalette` | Fill materials below the biome layers and in water. See [16 - Surfaces, Decorators & Deposits](/iris/16-surfaces-decorators-deposits) |

## Overworld examples

`generators/plain.json`: smooth lowlands, one warped layer softened by a bezier curve:

```json
{
  "interpolator": { "function": "BILINEAR_STARCAST_9", "horizontalScale": 12 },
  "seed": 7246661,
  "composite": [{
    "style": {
      "style": "IRIS_DOUBLE",
      "zoom": 0.87,
      "fracture": { "style": "NOWHERE", "zoom": 0.195, "multiplier": 18 }
    },
    "seed": 10056,
    "bezier": true
  }]
}
```

`generators/mountain.json`: a single large-scale fractal with a very wide blend radius, so mountains have long approaches:

```json
{
  "interpolator": { "horizontalScale": 52, "function": "BILINEAR_STARCAST_9" },
  "seed": 53551,
  "composite": [{
    "style": { "style": "FRACTAL_SMOKE", "zoom": 1 },
    "seed": 3356
  }]
}
```

`generators/cracked-cliffs.json`: inverted glob shape quantised into terraces between 35 and 80 units, with the step height chosen per cell:

```json
{
  "interpolator": { "function": "BILINEAR_STARCAST_9", "horizontalScale": 12 },
  "seed": 7246661,
  "composite": [{
    "style": {
      "style": "GLOB",
      "zoom": 0.4,
      "exponent": 0.7,
      "fracture": { "style": "NOWHERE", "zoom": 0.1, "multiplier": 5 }
    },
    "negative": true,
    "seed": 10056
  }],
  "cliffHeightMax": 80,
  "cliffHeightMin": 35,
  "cliffHeightGenerator": {
    "seed": 2348,
    "style": { "style": "CELLULAR_HEIGHT" },
    "zoom": 0.4
  }
}
```

The shipping overworld uses neither `expression` nor `imageMap` in any generator.

## Practical notes

- Share one generator across many biomes and vary `min`/`max` per biome. That is what makes a mountain range and its foothills look like the same landform.
- Match `interpolator.horizontalScale` between neighboring biomes you want to blend smoothly. Deliberately mismatch it where you want a visible change in character.
- Give a generator its own `horizontalScale` if you want its shape kept independent. Reuse an existing one only when you want the shapes averaged together.
- Do not deploy two generator files whose settings are byte-for-byte identical, including `seed`. Generators are deduplicated by content when they are bucketed. Only one key survives. Biomes that reference the other key silently get a zero height band. `/iris pack validate` warns when it finds content-identical generators that are both referenced.
- Nested `fracture` multiplies cost. Keep fracture chains short on generators that run for every column. Reach for `cacheSize` before you add a third level.
- `STATIC` is white noise. Use it for palette scatter, never for terrain relief.
- `multiplicitive` and the deposit field `varience` are intentional code spellings. The JSON must match them exactly.
- Terrain changes only apply to newly generated chunks. Always compare in fresh territory on a fixed seed.
