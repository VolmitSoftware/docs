---
title: "RGB Heightmaps"
description: "The canonical raw 24-bit RGB height encoding used by Iris"
published: true
date: 2026-08-24T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-24T00:00:00.000Z
---
An RGB heightmap stores one unsigned 24-bit elevation across three 8-bit channels. Iris uses one fixed red-green-blue formula and raw sRGB channel numbers; it does not guess alternative encodings or color-correct the source.

## Canonical formula

For red, green, and blue values from 0 through 255:

```text
encoded = (red << 16) | (green << 8) | blue
normalized = encoded / 16777215
height = minimumHeight + normalized × (maximumHeight - minimumHeight)
```

Red is the most significant byte, green is the middle byte, and blue is the least significant byte. `0x000000` is the minimum, `0xFFFFFF` is the maximum, and the encoding has 16,777,216 representable values.

Only this unsigned normalized encoding is accepted by `RGB_HEIGHT`. Signed displacement, little-endian BGR, Mapbox Terrain-RGB, Terrarium, meters encoded with a scale and bias, and any other formula require an explicitly different map type; Iris does not identify them from pixel values.

## Minimal resource

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

## Raw data behavior

- Channel values are read in red, green, blue order directly from the PNG raster.
- Iris does not apply gamma, ICC, display, or perceptual color conversion.
- An RGB profile does not change the numbers used by the formula.
- RGBA sources use the same RGB formula. The separate `alpha` setting decides what alpha does.
- The scalar is decoded per source pixel. Bilinear and bicubic filters interpolate decoded scalar values, not the three color channels independently.

Decoding before interpolation prevents channel carry boundaries from producing false elevations. For example, adjacent encoded values `0x00FFFF` and `0x010000` are numerically consecutive even though all three displayed channels change.

## Alpha choices

| `alpha` | Behavior |
|---|---|
| `IGNORE` | RGB alone supplies height |
| `MASK` | Normalized alpha weights the decoded value |
| `TRANSPARENT_IS_FALLBACK` | Transparent samples use `fallbackValue` or `fallbackTarget` as applicable |
| `ERROR` | Any transparency is a validation error |

An RGB source without alpha behaves as fully opaque. Use a separate named mask when its transform, reuse, threshold, or composition needs to be configured independently.

## Known-value check

With `minimumHeight: -64` and `maximumHeight: 320`:

| Raw RGB | Encoded | Result |
|---|---:|---:|
| `#000000` | 0 | -64 |
| `#7FFFFF` | 8,388,607 | just below 128 |
| `#800000` | 8,388,608 | just above 128 |
| `#FFFFFF` | 16,777,215 | 320 |

Use these four pixels as an import test when an external terrain tool claims to export compatible data. Image Map Studio must report the same values before you bind the source to terrain.

## Editor and export rules

- Export lossless PNG with no palette quantization, dithering, color adjustment, or profile conversion.
- Do not resize an RGB heightmap with ordinary color-image filters. They interpolate channels rather than the encoded 24-bit integer and can introduce discontinuities.
- Use Iris `sampling` for world-space interpolation after decoding.
- Keep `clamp: true` unless values outside the configured range are an intentional downstream input.
- Treat any visual preview produced by a conventional image viewer as illustrative only. The Studio interpreted-height preview is authoritative.

The common transform, range, curve, smoothing, out-of-bounds, and mask fields are listed in [43 - Image Map Configuration & Coordinates](/iris/43-image-map-config-coordinates).
