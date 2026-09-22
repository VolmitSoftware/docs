---
title: "Image Map Encodings"
description: "How each Iris image-map type decodes its pixels: grayscale height, RGB height, color legends, and masks"
published: true
date: 2026-09-21T10:36:56.240Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-24T00:00:00.000Z
---
What each map type does with its pixels. The resource model and accepted PNG formats are on [37 - Image Maps](/iris/37-image-maps); every field and the coordinate contract are on [43 - Image Map Configuration & Coordinates](/iris/43-image-map-config-coordinates).

Iris reads raw sRGB channel numbers with no gamma, ICC, display, or perceptual conversion, so export your source with profile conversion, dithering, antialiasing, and palette quantization disabled. See [Raw sample rules](/iris/37-image-maps#raw-sample-rules).

## Grayscale heightmaps

A grayscale heightmap stores one normalized elevation per pixel. Black maps to `minimumHeight`, white maps to `maximumHeight`, and Iris preserves native 8-bit or 16-bit source precision before applying the configured curve and spatial sampling.

Save `images/maps/terrain.png`, then create `image-maps/terrain.json`:

```json
{
  "source": "maps/terrain",
  "type": "GRAYSCALE_HEIGHT",
  "minimumHeight": -64,
  "maximumHeight": 320,
  "blocksPerPixel": 1,
  "sampling": "BILINEAR"
}
```

### Decoding formula

For a source bit depth `b`, Iris reads the unsigned grayscale sample without color correction:

```text
maximumSample = 2^b - 1
normalized = sample / maximumSample
height = minimumHeight + normalized × (maximumHeight - minimumHeight)
```

| Source | 8-bit sample | 16-bit sample | Normalized |
|---|---:|---:|---:|
| Black | 0 | 0 | 0 |
| Mid gray | 128 | 32768 | approximately 0.5 |
| White | 255 | 65535 | 1 |

For `minimumHeight: -64` and `maximumHeight: 320`, black is Y -64 and white is Y 320. The integer midpoint sample lies just above the mathematical midpoint because both unsigned ranges contain an even number of representable values.

### Evaluation order

1. Read the raw unsigned grayscale sample and normalize it to 0 through 1.
2. Apply `inverted` as `1 - normalized` when enabled.
3. Apply `curveExponent` as a power curve.
4. Apply the configured alpha policy.
5. Apply load-time box smoothing when `smoothingRadius` is above zero.
6. Spatially sample the decoded scalar with `NEAREST`, `BILINEAR`, or `BICUBIC`.
7. Map the scalar into `minimumHeight` through `maximumHeight`.
8. Add `verticalOffset`.
9. Clamp to the configured height interval when `clamp` is true.
10. Apply the dimension binding's composed masks.

Interpolation acts on decoded scalar values, not packed image bytes or final rounded block heights, which preserves continuous slopes while keeping the height-range mapping explicit.

### Height controls

| Field | Default | Effect |
|---|---:|---|
| `minimumHeight` | `-64` | Height produced by normalized 0 |
| `maximumHeight` | `320` | Height produced by normalized 1 |
| `verticalOffset` | `0` | Blocks added after range mapping |
| `clamp` | `true` | Constrains the offset result to the configured min/max interval |
| `inverted` | `false` | Exchanges valleys and peaks before the curve |
| `curveExponent` | `1` | Above 1 lowers middle values; below 1 raises them |
| `smoothingRadius` | `0` | Load-time box radius in source pixels, 0 through 32 |
| `sampling` | `NEAREST` | World-space filter between source pixels |

`minimumHeight` and `maximumHeight` are absolute world Y values for a `TERRAIN_HEIGHT` binding. Validation evaluates the effective endpoints after `verticalOffset` and `clamp`; **an output outside the owning dimension's build range is a blocking error rather than being silently clipped.** Studio's clipped-pixel count instead identifies source pixels whose offset result was clamped to the map's own configured height interval.

### Precision choice

| Source | Levels | Use it for |
|---|---:|---|
| 8-bit grayscale | 256 | Broad terrain where each source step spans less than a visible block after mapping |
| 16-bit grayscale | 65,536 | Tall ranges, subtle grades, erosion data, or sources that otherwise show terracing |

An 8-bit map spanning 384 blocks has steps of about 1.506 blocks before interpolation; a 16-bit map over the same range has steps of about 0.00586 blocks. Bilinear or bicubic sampling smooths spatial transitions but cannot restore precision removed during export.

### Avoiding artifacts

- Export a grayscale image, not an RGB image that only looks gray.
- Use 16-bit source data when 8-bit steps are visible across a tall height range.
- Do not blur in an editor unless the changed pixels are intentional data. Prefer `smoothingRadius` so the transformation stays in configuration.
- Use `NEAREST` for authored terraces and cell boundaries, `BILINEAR` for ordinary slopes, and `BICUBIC` only when its wider smooth reconstruction is intended.
- Preview source pixels clipped by the map's own offset/clamp settings and the world boundary overlay before export.
- Compare only fresh chunks after a change; existing chunks retain their generated blocks.

## RGB heightmaps

An RGB heightmap stores one unsigned 24-bit elevation across three 8-bit channels, using one fixed red-green-blue formula.

```text
encoded = (red << 16) | (green << 8) | blue
normalized = encoded / 16777215
height = minimumHeight + normalized × (maximumHeight - minimumHeight)
```

Red is the most significant byte, green the middle, blue the least. `0x000000` is the minimum, `0xFFFFFF` the maximum, and the encoding has 16,777,216 representable values.

> Only this unsigned normalized encoding is accepted by `RGB_HEIGHT`. Signed displacement, little-endian BGR, Mapbox Terrain-RGB, Terrarium, meters encoded with a scale and bias, and any other formula require an explicitly different map type — **Iris does not identify them from pixel values.**
{.is-warning}

Save an 8-bit RGB or RGBA PNG at `images/maps/terrain-rgb.png`, then create `image-maps/terrain-rgb.json`:

```json
{
  "source": "maps/terrain-rgb",
  "type": "RGB_HEIGHT",
  "minimumHeight": -64,
  "maximumHeight": 320,
  "blocksPerPixel": 1,
  "sampling": "BILINEAR",
  "alpha": "IGNORE",
  "clamp": true
}
```

An RGB source must have exactly 8 bits per color channel. A 16-bit-per-channel RGB PNG is not a larger version of this encoding and is rejected.

The scalar is decoded per source pixel, so bilinear and bicubic filters interpolate decoded scalars rather than the three color channels independently. That prevents channel carry boundaries from producing false elevations: adjacent encoded values `0x00FFFF` and `0x010000` are numerically consecutive even though all three displayed channels change.

RGBA sources use the same RGB formula, and the separate `alpha` setting decides what alpha does. An RGB source without alpha behaves as fully opaque.

### Known-value check

With `minimumHeight: -64` and `maximumHeight: 320`:

| Raw RGB | Encoded | Result |
|---|---:|---:|
| `#000000` | 0 | -64 |
| `#7FFFFF` | 8,388,607 | just below 128 |
| `#800000` | 8,388,608 | just above 128 |
| `#FFFFFF` | 16,777,215 | 320 |

Use these four pixels as an import test when an external terrain tool claims to export compatible data. Image Map Studio must report the same values before you bind the source to terrain. Treat any preview from a conventional image viewer as illustrative only — the Studio interpreted-height preview is authoritative.

Keep `clamp: true` unless values outside the configured range are an intentional downstream input.

## Color maps

Color maps assign authored raw RGB values to Iris resources or Minecraft blocks. Exact nearest-neighbor matching is the default, and any unknown or ambiguous color configured as an error blocks the pack before generation.

Create `image-maps/biomes.json`:

```json
{
  "source": "maps/biomes",
  "type": "COLOR_MAP",
  "sampling": "NEAREST",
  "outOfBounds": "CLAMP",
  "colorTolerance": 0,
  "unknownColor": "ERROR",
  "colors": {
    "#2D6A4F": "iris:temperate_forest",
    "#DDB892": "iris:desert",
    "#1D4ED8": "iris:ocean"
  }
}
```

Legend keys are six-digit `#RRGGBB` raw sRGB values. The target namespace is interpreted by the dimension application: biome keys for `BIOME`, region keys for `REGION`, block keys for `SURFACE_BLOCK`.

**`COLOR_MAP` requires `NEAREST`.** Bilinear and bicubic filters create colors that are absent from the legend and fail validation for categorical maps.

### Tolerant matching

`colorTolerance` is a radius in raw 8-bit sRGB channel space, from 0 through approximately 441.672956 — the distance between black and white. For a source color `(r, g, b)` and legend color `(R, G, B)`:

```text
distance = sqrt((r - R)^2 + (g - G)^2 + (b - B)^2)
```

- `0` requires an exact RGB match and is the default.
- An exact legend match wins immediately.
- With no exact match and tolerance above zero, a legend color is eligible when its distance is at most the configured tolerance.
- No eligible entry is an unknown color.
- **More than one eligible entry is a blocking validation error.** Configure exactly one matching entry.

Tolerance uses raw sRGB channel values. It is not Delta E, HSV distance, gamma-linear distance, or a display-profile comparison. Keep it at zero for authored data maps whenever possible, and keep legend colors far enough apart that the selected tolerance cannot overlap their acceptance radii.

### Unknown colors

| `unknownColor` | Result |
|---|---|
| `ERROR` | Any unmatched pixel blocks validation |
| `FALLBACK` | The pixel resolves to `fallbackTarget` |
| `IGNORE` | The map contributes no target at that pixel |

With `FALLBACK`, `fallbackTarget` must be valid for the binding application. Studio reports the unknown-pixel count, and ambiguous tolerance matches are blocking compiler diagnostics that identify their source pixel coordinates, so the source or legend can be repaired without searching visually.

### Alpha behavior

The `alpha` policy applies independently from RGB matching:

| Value | Result |
|---|---|
| `IGNORE` | Alpha does not affect decoded data |
| `MASK` | Multiplies scalar map data by normalized alpha. On a color map, alpha must be binary: zero uses `fallbackTarget`, one resolves RGB normally, and an intermediate value is invalid |
| `TRANSPARENT_IS_FALLBACK` | Fully transparent pixels use the configured fallback |
| `ERROR` | Transparency is invalid |

Use `ALPHA_MASK` when alpha is a named reusable mask rather than an attribute of one map, or when its transform, reuse, threshold, or composition needs to be configured independently.

### Target validation

Region targets must load from the pack. Biome targets must load and occur in exactly one land, sea, or shore role across the dimension. Surface-block targets must exist in the live block registry.

## Masks

Masks produce zero-through-one weights that restrict another binding.

| Type | Decoded value |
|---|---|
| `BINARY_MASK` | Thresholded grayscale: hard 0/1 when `falloff` is zero, or a continuous transition across the configured falloff |
| `GRAYSCALE_MASK` | Raw grayscale normalized from its 8-bit or 16-bit range |
| `ALPHA_MASK` | Alpha normalized from transparent 0 to opaque 1 |

For a `BINARY_MASK` resource, `threshold` is the lower edge and `falloff` is the soft transition width above it; `falloff: 0` creates a hard edge. `smoothingRadius` may average the compiled result afterward, so keep it at zero for an exact binary footprint. Resource-level `inverted: true` exchanges 0 and 1 before the map is compiled.

`ALPHA_MASK` requires 8-bit RGBA and `alpha: IGNORE`, because alpha itself is the map data.

Exact binary boundaries require `NEAREST`. Continuous grayscale and alpha masks may use `BILINEAR` or `BICUBIC` when a spatially smooth weight is intended.

### Named mask composition

Add mask bindings to the dimension, then reference their binding keys from another entry:

```json
{
  "imageMaps": [
    {
      "key": "land",
      "map": "masks/land",
      "application": "MASK"
    },
    {
      "key": "exclude",
      "map": "masks/exclude",
      "application": "MASK"
    },
    {
      "key": "terrain-height",
      "map": "terrain/height",
      "application": "TERRAIN_HEIGHT",
      "masks": [
        { "map": "land", "operation": "MULTIPLY" },
        { "map": "exclude", "operation": "SUBTRACT", "inverted": false }
      ]
    }
  ]
}
```

Masks are sampled and combined in declaration order after the primary map's scalar or target has been decoded. Each reference may apply its own `inverted`, `threshold`, and `falloff` without changing the reusable mask resource.

| Operation | Composition |
|---|---|
| `MULTIPLY` | Multiply the accumulated weight by this mask |
| `MINIMUM` | Keep the lower value |
| `MAXIMUM` | Keep the higher value |
| `ADD` | Add this mask, constrained to the normalized mask domain |
| `SUBTRACT` | Subtract this mask, constrained to the normalized mask domain |

The final weight has application-specific meaning. `TERRAIN_HEIGHT` linearly blends from the ordinary procedural height at weight 0 to the mapped height at weight 1. `BIOME`, `REGION`, and `SURFACE_BLOCK` use the mapped categorical target at weights of at least 0.5 and leave the ordinary pipeline in control below 0.5.

A mask reference must name a dimension binding whose application is `MASK`, and a `MASK` binding cannot itself contain mask references. Missing keys, duplicate binding keys, references to non-mask applications, and nested mask composition are blocking errors.

Use a separate mask resource when several maps share the same footprint, and preview unknown, ambiguous, transparent, and uncovered pixels before export.
