---
title: "Image Map Configuration & Coordinates"
description: "Complete Iris image-map, binding, coordinate, sampling, and world-boundary reference"
published: true
date: 2026-08-24T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-24T00:00:00.000Z
---
Image maps are typed JSON resources under `image-maps/`, bound to dimensions through an `imageMaps` list, and optionally referenced by generator styles. This page is the complete field and coordinate contract, including native world-boundary configuration.

## Complete example

`image-maps/terrain/height.json`:

```json
{
  "source": "maps/height",
  "type": "GRAYSCALE_HEIGHT",
  "blocksPerPixel": 2,
  "origin": { "x": 0, "z": 0 },
  "sourceOrigin": { "x": 1024, "z": 1024 },
  "rotation": "DEG_0",
  "mirrorX": false,
  "mirrorZ": false,
  "sampling": "BILINEAR",
  "outOfBounds": "FALLBACK",
  "fallbackValue": 0,
  "alpha": "IGNORE",
  "minimumHeight": -64,
  "maximumHeight": 320,
  "verticalOffset": 0,
  "clamp": true,
  "inverted": false,
  "curveExponent": 1,
  "smoothingRadius": 0
}
```

`image-maps/masks/land.json`:

```json
{
  "source": "maps/land-mask",
  "type": "GRAYSCALE_MASK",
  "sampling": "BILINEAR"
}
```

The relevant part of `dimensions/example.json`:

```json
{
  "imageMaps": [
    {
      "key": "land",
      "map": "masks/land",
      "application": "MASK",
      "masks": []
    },
    {
      "key": "terrain-height",
      "map": "terrain/height",
      "application": "TERRAIN_HEIGHT",
      "masks": [
        {
          "map": "land",
          "operation": "MULTIPLY",
          "inverted": false,
          "threshold": 0.35,
          "falloff": 0.15
        }
      ]
    }
  ],
  "worldBoundary": {
    "center": { "x": 0, "z": 0 },
    "size": 16384,
    "warningDistance": 16,
    "damageBuffer": 5,
    "damageAmount": 0.2
  }
}
```

A generator style references the first-class resource key, not an embedded object:

```json
{
  "style": {
    "imageMap": "terrain/height",
    "zoom": 1,
    "exponent": 1
  }
}
```

## Image-map fields

| Field | Type | Default | Contract |
|---|---|---|---|
| `source` | image key | `""` | PNG under `images/`, without `.png` |
| `type` | `IrisImageMapType` | `GRAYSCALE_HEIGHT` | `GRAYSCALE_HEIGHT`, `RGB_HEIGHT`, `COLOR_MAP`, `BINARY_MASK`, `GRAYSCALE_MASK`, or `ALPHA_MASK` |
| `blocksPerPixel` | double 0.000001 or greater | `1` | World blocks represented by one source pixel |
| `origin` | `{x,z}` | `0,0` | Minecraft X/Z position mapped to `sourceOrigin` |
| `sourceOrigin` | `{x,z}` | `0,0` | Source pixel X/Y coordinate placed at `origin`; JSON uses `z` for source image Y |
| `rotation` | enum | `DEG_0` | `DEG_0`, `DEG_90`, `DEG_180`, or `DEG_270`, clockwise around `sourceOrigin` |
| `mirrorX` | boolean | `false` | Mirrors source image X around `sourceOrigin` before rotation |
| `mirrorZ` | boolean | `false` | Mirrors source image Y/south axis around `sourceOrigin` before rotation |
| `sampling` | enum | `NEAREST` | `NEAREST`, `BILINEAR`, or `BICUBIC` |
| `outOfBounds` | enum | `FALLBACK` | `FALLBACK`, `CLAMP`, `REPEAT`, `MIRROR`, or `ERROR` |
| `fallbackValue` | double 0..1 | `0` | Scalar used by `FALLBACK` |
| `fallbackTarget` | string | `""` | Categorical legend target used by fallback or unknown pixels |
| `alpha` | enum | `IGNORE` | `IGNORE`, `MASK`, `TRANSPARENT_IS_FALLBACK`, or `ERROR` |
| `minimumHeight` | double | `-64` | Absolute height for normalized 0 |
| `maximumHeight` | double | `320` | Absolute height for normalized 1 |
| `verticalOffset` | double | `0` | Added after height decoding |
| `clamp` | boolean | `true` | Clamps height to the configured min/max after offset |
| `inverted` | boolean | `false` | Applies `1 - value` before curve evaluation |
| `curveExponent` | double 0.000001 or greater | `1` | Power curve; 1 is linear |
| `smoothingRadius` | int 0..32 | `0` | Load-time box smoothing radius in source pixels |
| `threshold` | double 0..1 | `0.5` | Binary-mask threshold |
| `falloff` | double 0..1 | `0` | Soft transition width above threshold |
| `colorTolerance` | double 0..441.672956 | `0` | Euclidean raw sRGB legend-match radius |
| `unknownColor` | enum | `ERROR` | `ERROR`, `FALLBACK`, or `IGNORE` |
| `colors` | object | `{}` | Exact `#RRGGBB` to Iris resource or Minecraft block key map |

Fields that do not apply to the selected `type` remain inert, but they must still be well formed. Validation enforces type-specific combinations such as `COLOR_MAP` plus `NEAREST` and `ALPHA_MASK` plus an alpha-bearing source.

## Dimension binding fields

| Field | Type | Default | Contract |
|---|---|---|---|
| `key` | string | `""` | Unique binding name used by Studio, masks, and custom lookup |
| `map` | image-map key | `""` | Resource under `image-maps/` |
| `application` | enum | `CUSTOM` | `TERRAIN_HEIGHT`, `BIOME`, `REGION`, `SURFACE_BLOCK`, `MASK`, or `CUSTOM` |
| `masks` | mask reference[] | `[]` | Named `MASK` bindings composed in order |

Each mask reference has these fields:

| Field | Type | Default | Contract |
|---|---|---|---|
| `map` | binding key | `""` | Another entry in the same dimension whose application is `MASK` |
| `operation` | enum | `MULTIPLY` | `MULTIPLY`, `MINIMUM`, `MAXIMUM`, `ADD`, or `SUBTRACT` |
| `inverted` | boolean | `false` | Inverts this mask before composition |
| `threshold` | double 0..1 | `0` | Values below this become zero |
| `falloff` | double 0..1 | `0` | Soft transition above the reference threshold |

A dimension may declare multiple `MASK` and `CUSTOM` bindings, but at most one binding for each built-in generation application: `TERRAIN_HEIGHT`, `BIOME`, `REGION`, and `SURFACE_BLOCK`. A `MASK` binding cannot contain additional mask references.

## Axes and anchor

Iris uses these directions:

```text
source +X  ─────────────► Minecraft +X (east)
source +Y / JSON +Z      Minecraft +Z (south)
```

`origin` is a Minecraft block-space X/Z coordinate. `sourceOrigin` is the source pixel-space X/Y anchor written with `x` and `z`. With no mirror or rotation, world `origin` samples exactly source `sourceOrigin`.

At `blocksPerPixel: 4`, moving four blocks east advances one source X unit; moving four blocks south advances one source Y unit. Rectangular images retain their authored width and height.

## Transform order

The configured placement is evaluated in one fixed order:

1. Translate source coordinates so `sourceOrigin` is zero.
2. Apply `mirrorX` and `mirrorZ` around that anchor.
3. Apply the configured clockwise quarter-turn.
4. Multiply by `blocksPerPixel`.
5. Translate into Minecraft space by `origin`.

Runtime sampling applies the exact inverse of that placement from world X/Z back into continuous source coordinates. A `DEG_90` forward rotation maps a source-relative vector `(x,z)` to `(-z,x)` in the east/south coordinate plane.

`NEAREST` uses mathematical floor to choose the containing source pixel. This matters west or north of the anchor: `floor(-0.25)` is `-1`, never `0`. Bilinear and bicubic sampling use the same floor-based cell and neighboring decoded scalar values. Negative coordinates therefore reach the configured out-of-bounds policy deterministically instead of being truncated toward zero.

## Sampling rules

| Sampling | Behavior |
|---|---|
| `NEAREST` | Preserves exact source values and category boundaries; required for color maps and exact binary data |
| `BILINEAR` | Interpolates four neighboring decoded scalar samples |
| `BICUBIC` | Smoothly reconstructs from a wider decoded scalar neighborhood |

Height and continuous-mask pixels are decoded to scalar values before interpolation. Dimension binding masks are sampled and composed afterward. Categorical target keys are never interpolated.

## Out-of-bounds rules

| Value | Behavior outside the source rectangle |
|---|---|
| `FALLBACK` | Use `fallbackValue` or `fallbackTarget` |
| `CLAMP` | Use the closest edge pixel |
| `REPEAT` | Wrap by source width and height |
| `MIRROR` | Reflect at each image edge |
| `ERROR` | Report uncovered coordinates as a blocking validation/runtime configuration error |

Out-of-bounds handling occurs after the inverse transform and before pixel decoding. For bilinear and bicubic sampling it applies to every required neighboring sample.

For dimension generation bindings, `outOfBounds: ERROR` requires `worldBoundary`; validation proves that the complete nearest, bilinear, or bicubic sampling kernel covers every boundary edge. An upper dimension is checked against every parent dimension's enforced boundary and, when declared, its own `worldBoundary`; omission of its own boundary does not cause a separate standalone failure. Direct generator-style `imageMap` references cannot use `ERROR`, because style and caller coordinate transforms do not provide a finite domain that pack validation can prove; use one of the four safe out-of-bounds policies instead.

For `TERRAIN_HEIGHT`, validation also calculates the minimum and maximum output after `verticalOffset` and `clamp`. Both endpoints must remain inside the owning dimension's `dimensionHeight`; this applies to an upper dimension's own vertical range even when its horizontal coverage is checked against a parent boundary.

## World boundary

`worldBoundary` is an optional typed dimension field. When present, Iris applies it during world initialization and after a successful reload on the platform's correct server or region scheduling context.

| Field | Type | Present-key default | Contract |
|---|---|---:|---|
| `center.x` | double | `0` | -29,999,984 through 29,999,984 |
| `center.z` | double | `0` | -29,999,984 through 29,999,984 |
| `size` | double | `16384` | Full border diameter, 1 through 59,999,968 |
| `warningDistance` | int | `16` | Non-negative client warning distance |
| `damageBuffer` | double | `5` | Non-negative safe distance beyond the border |
| `damageAmount` | double | `0.2` | Non-negative damage per block beyond the buffer |

`size` is the full diameter, matching Minecraft terminology. The covered interval is `center - size/2` through `center + size/2` on each axis.

When `worldBoundary` is absent, Iris does not apply or reset the native world border during initialization or reload. The world's current native border remains unchanged, including operator changes or a boundary applied by an earlier pack revision.

The boundary limits player movement; it does not change image-map out-of-bounds behavior. Configure both explicitly. Studio overlays the boundary and warns when source coverage and the border do not align.

## Validation checklist

- Every `source`, `map`, target, and mask binding key resolves.
- Binding keys are unique, mask references point to `MASK`, and the mask graph is acyclic.
- Type, channel layout, bit depth, alpha, sampling, legend, and tolerance combinations are valid.
- Height ranges, curves, smoothing, thresholds, falloff, dimensions, and boundary numbers are finite and within their documented limits.
- Exact and tolerant color matching has no unknown or ambiguous pixels under the selected policy.
- Dimension bindings configured with `ERROR` have kernel-complete coverage for the enforced generation boundary; generator-style references use a safe out-of-bounds policy.

Use [42 - Image Map Studio Workflow](/iris/42-image-map-studio-workflow) to create this configuration and [31 - Operator Runbooks](/iris/31-operator-runbooks) to verify it on a disposable world.
