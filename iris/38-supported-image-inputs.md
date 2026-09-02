---
title: "Supported Image Inputs"
description: "Canonical PNG formats, channel layouts, bit depths, and size limits for Iris image maps"
published: true
date: 2026-08-24T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-24T00:00:00.000Z
---
Iris image maps use PNG as their only canonical source format. Images may be square or rectangular, but every source must satisfy the dimension, pixel-count, channel-layout, and bit-depth contract on this page.

## File contract

Place source files under the pack's `images/` folder and reference them without `.png`:

```text
packs/example/images/maps/height.png
```

```json
{
  "source": "maps/height"
}
```

JPEG, WebP, TIFF, BMP, and other formats are not image-map inputs. Convert them to PNG before import. Renaming another format to `.png` does not convert it and fails validation.

## Size limits

| Limit | Accepted value |
|---|---|
| Width | 1 through 16,384 pixels |
| Height | 1 through 16,384 pixels |
| Total pixels | At most 16,777,216 |
| Shape | Square or rectangular |

Both the per-axis and total-pixel limits apply. A `4096 × 4096` or `16384 × 1024` image has exactly 16,777,216 pixels and is valid; `4097 × 4096` exceeds the total even though each axis is individually legal.

Keep the image only as detailed as the world requires. Increase `blocksPerPixel` when one source pixel should cover several blocks.

## Channel and bit-depth matrix

| Declared type | Accepted source data |
|---|---|
| `GRAYSCALE_HEIGHT` | Single-channel grayscale PNG, 8-bit or 16-bit |
| `RGB_HEIGHT` | RGB or RGBA PNG, exactly 8 bits per color channel |
| `COLOR_MAP` | RGB or RGBA PNG, exactly 8 bits per color channel |
| `BINARY_MASK` | Single-channel grayscale PNG, 8-bit or 16-bit |
| `GRAYSCALE_MASK` | Single-channel grayscale PNG, 8-bit or 16-bit |
| `ALPHA_MASK` | RGBA PNG with an alpha channel |

Indexed palette PNGs and layouts outside this matrix are rejected rather than silently converted into a different data model. An alpha channel is handled only by the configured `alpha` policy or by `ALPHA_MASK`; it never changes RGB values implicitly.

## Raw sample rules

Iris reads raster samples as data:

- Grayscale samples retain their native 8-bit or 16-bit integer precision.
- RGB and RGBA color channels are unsigned 8-bit values in red, green, blue order.
- RGB values are interpreted as raw sRGB channel numbers. Iris does not apply gamma expansion, ICC profile conversion, display color correction, or perceptual color-space conversion.
- Metadata and embedded color profiles do not alter decoded numbers.
- Alpha is a separate normalized channel. It is ignored, used as a mask, treated as fallback, or rejected according to the map's `alpha` setting.

An image editor that performs color-profile conversion, dithering, palette quantization, or lossy export can change data pixels even when the picture looks the same. Export data maps with those operations disabled.

## Inspection checklist

Before configuring a map, Image Map Studio reports:

- width, height, format, and total pixels;
- grayscale, RGB, or RGBA layout;
- bit depth per color channel;
- alpha presence and transparency range;
- embedded color-profile metadata;
- whether the declared map type accepts the source.

The profile is reported so the author can identify an editor conversion, but it is not applied to raw samples.

## Validation failures

| Error | Resolution |
|---|---|
| Unsupported or corrupt image | Re-export as a valid PNG and import again |
| Width, height, or total pixels outside the limits | Crop, resample, split the authored area, or raise `blocksPerPixel` |
| Grayscale height source is RGB | Export a real single-channel grayscale PNG or declare the correct type |
| RGB height source is 16-bit per channel | Export exactly 8-bit RGB/RGBA; the canonical encoding is 24-bit total |
| Alpha map has no alpha channel | Export RGBA or select a grayscale/binary mask type |
| Indexed/palette source | Expand the source to canonical RGB/RGBA before import |
| File looks correct but colors do not match | Disable profile conversion, antialiasing, and dithering, then inspect raw `#RRGGBB` values |

Continue with [37 - Image Map Concepts](/iris/37-image-map-concepts) or the type-specific guides.
