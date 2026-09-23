---
title: "Image Maps"
description: "Drive Iris generation from PNG data: the resource model, accepted source images, and the Image Map Studio workflow"
published: true
date: 2026-09-23T11:12:42.385Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-24T00:00:00.000Z
---
Image maps let a pack author supply spatial generation data as pixels. Set the map type, height or color rules, coordinates, sampling, and masks in the pack configuration.

- **This page** — the model, what PNG files Iris accepts, and the Studio workflow.
- [38 - Image Map Encodings](/iris/38-image-map-encodings) — how each map type decodes its pixels.
- [43 - Image Map Configuration & Coordinates](/iris/43-image-map-config-coordinates) — every field, the coordinate contract, and `worldBoundary`.

## Resource model

An image-driven pack has three separate layers:

```text
images/<source>.png
        ↓ source
image-maps/<map>.json
        ↓ map
dimensions/<dimension>.json imageMaps[]
        ↓ application
terrain height, biome, region, surface block, mask, or custom lookup
```

- `images/<source>.png` contains canonical source pixels.
- `image-maps/<map>.json` is a reusable typed resource declaring how to decode and place the source.
- A dimension `imageMaps` entry gives one map a unique binding `key`, selects its generation `application`, and composes optional masks.
- A generator style can reference a scalar `image-maps` resource key directly through `imageMap`. Because style and caller transforms can sample an unbounded domain, these direct references must use `FALLBACK`, `CLAMP`, `REPEAT`, or `MIRROR`, not `ERROR`.

Definitions are reusable: two dimensions may bind the same image-map resource to different applications, and multiple bindings may reference one named mask. Binding keys must be unique within a dimension.

## Map types

| Type | Pixel meaning | Typical application |
|---|---|---|
| `GRAYSCALE_HEIGHT` | One 8-bit or 16-bit grayscale scalar | `TERRAIN_HEIGHT` or generator noise |
| `RGB_HEIGHT` | One 24-bit unsigned scalar encoded red, green, blue | `TERRAIN_HEIGHT` or generator noise |
| `COLOR_MAP` | Exact or tolerance-matched `#RRGGBB` legend entry | `BIOME`, `REGION`, or `SURFACE_BLOCK` |
| `BINARY_MASK` | On or off after thresholding | `MASK` |
| `GRAYSCALE_MASK` | Continuous grayscale weight | `MASK` |
| `ALPHA_MASK` | Continuous alpha weight | `MASK` |

**The map type is never inferred from its filename or appearance.** Select it explicitly. Iris rejects a source whose channel layout or bit depth cannot represent the declared type.

## Applications

| Application | Meaning |
|---|---|
| `TERRAIN_HEIGHT` | Supplies the dimension's mapped terrain height input |
| `BIOME` | Resolves color targets as Iris biome keys |
| `REGION` | Resolves color targets as Iris region keys |
| `SURFACE_BLOCK` | Resolves color targets as Minecraft or Iris block keys |
| `MASK` | Makes the binding available to other bindings as a named mask |
| `CUSTOM` | Exposes the compiled map by binding key without assigning a built-in generation role |

Each binding names the image-map resource in `map`; the binding `key` is the stable name shown in Studio previews and used by mask references and custom lookups.

## Source images

PNG is the only canonical source format. Place files under the pack's `images/` folder and reference them without `.png`:

```text
packs/example/images/maps/height.png
```

```json
{
  "source": "maps/height"
}
```

JPEG, WebP, TIFF, BMP, and other formats are not image-map inputs. Convert them to PNG before import — renaming another format to `.png` does not convert it and fails validation.

### Size limits

| Limit | Accepted value |
|---|---|
| Width | 1 through 16,384 pixels |
| Height | 1 through 16,384 pixels |
| Total pixels | At most 16,777,216 |
| Shape | Square or rectangular |

Both the per-axis and total-pixel limits apply. A `4096 x 4096` or `16384 x 1024` image has exactly 16,777,216 pixels and is valid; `4097 x 4096` exceeds the total even though each axis is individually legal. Keep the image only as detailed as the world requires, and raise `blocksPerPixel` when one source pixel should cover several blocks.

### Channel and bit-depth matrix

| Declared type | Accepted source data |
|---|---|
| `GRAYSCALE_HEIGHT` | Single-channel grayscale PNG, 8-bit or 16-bit |
| `RGB_HEIGHT` | RGB or RGBA PNG, exactly 8 bits per color channel |
| `COLOR_MAP` | RGB or RGBA PNG, exactly 8 bits per color channel |
| `BINARY_MASK` | Single-channel grayscale PNG, 8-bit or 16-bit |
| `GRAYSCALE_MASK` | Single-channel grayscale PNG, 8-bit or 16-bit |
| `ALPHA_MASK` | RGBA PNG with an alpha channel |

Indexed palette PNGs and layouts outside this matrix are rejected rather than silently converted into a different data model. An alpha channel is handled only by the configured `alpha` policy or by `ALPHA_MASK`; it never changes RGB values implicitly.

### Raw sample rules

- Grayscale samples retain their native 8-bit or 16-bit integer precision.
- RGB and RGBA color channels are unsigned 8-bit values in red, green, blue order.
- RGB values are interpreted as raw sRGB channel numbers. **Iris does not apply gamma expansion, ICC profile conversion, display color correction, or perceptual color-space conversion.**
- Metadata and embedded color profiles do not alter decoded numbers.
- Alpha is a separate normalized channel. It is ignored, used as a mask, treated as fallback, or rejected according to the map's `alpha` setting.

> An image editor that performs color-profile conversion, dithering, palette quantization, antialiasing, or lossy export can change data pixels even when the picture looks the same. **Export data maps with all of those disabled**, and do not resize an encoded heightmap with ordinary color-image filters — use `blocksPerPixel` and `sampling` instead.
{.is-warning}

## Image Map Studio

The guided desktop workflow writes canonical PNG assets, `image-maps` resources, and dimension bindings as one project update.

Use a graphical server host with `gui.useServerLaunchedGuis` enabled. Edit the authoring pack under the platform's `packs/` directory. On a headless server, edit the JSON described in [Image Map Configuration & Coordinates](/iris/43-image-map-config-coordinates).

1. Import the PNG to a key under `images/`.
2. Inspect its dimensions, bit depth, channels, and alpha data.
3. Choose the map type, dimension binding key, and application.
4. Set `origin`, `sourceOrigin`, `blocksPerPixel`, rotation, mirroring, sampling, and out-of-bounds behavior.
5. Configure the height range, color legend, or mask threshold for the selected type.
6. Add any named mask bindings and set their composition order.
7. Preview the interpreted heights, resource keys, or mask weights.
8. Resolve the reported invalid pixels, ambiguous colors, and uncovered coordinates.
9. Export the PNG, image-map resource, and dimension binding to the authoring pack.
10. Open Vision and generate fresh chunks to view the result. Reopen Studio for a fresh world if you need to replace previously generated terrain.

Export requires valid image maps and pack references. A failed export leaves the previous project intact.

### Preview modes

| Map type | Interpreted preview |
|---|---|
| Grayscale or RGB height | Minecraft Y palette, hover Y, and an exact clipped-source-pixel count |
| Color map | Resolved biome, region, or block colors; unknown pixels are counted and ambiguous matches block preview |
| Binary mask | Threshold footprint, falloff, and configured smoothing |
| Grayscale or alpha mask | Continuous zero-through-one weight; composed threshold and falloff are visible on the target preview |

Previews show the map's effect on generation. Biome, region, and surface-block targets use the mapped value at a final mask weight of at least `0.5` and normal generation below it. Terrain-height masks blend from normal terrain at weight `0` to the mapped height at weight `1`.

### Grid and coverage overlays

- Source pixel grid shows authored cells when the source view is zoomed far enough; the interpreted view shows the transformed coverage perimeter.
- Block coordinates show the world X/Z under the pointer.
- Chunk grid follows 16x16 Minecraft chunk boundaries.
- Region grid follows 32x32 chunks, or 512x512 blocks.
- Boundary overlay uses the dimension's native world-border center and full diameter.
- Coverage shading distinguishes valid source samples from coordinates handled by `FALLBACK`, `CLAMP`, `REPEAT`, `MIRROR`, or `ERROR`.

Studio warns when the image covers only part of the configured boundary, extends far beyond it, is substantially smaller than it, or is offset unexpectedly. A source whose sampling footprint exactly reaches every boundary edge is a fit and does not warn. **A warning does not replace the configured out-of-bounds rule.**

### Presets and Replace Image

A **preset** saves reusable type, transform, decoding, legend, alpha, sampling, out-of-bounds, and mask settings. Save one after the transform and decoding are accepted, then apply it to another compatible PNG. A preset never turns a source into an implicitly different type.

**Replace Image** changes the source asset while retaining the image-map resource, dimension binding, legend, masks, and preset association. The replacement must match the retained type, bit depth, dimensions, legend, and alpha settings. The previous source and configuration stay active after a failed replacement.

### Exported pack shape

```text
images/maps/terrain.png
image-maps/terrain.json
dimensions/example.json
```

Pack archives include referenced PNG files and image-map resources. Validate the pack before packaging it.

See [Studio & VSCode Schemas](/iris/10-studio-vscode-schemas) for opening, saving, and closing a Studio session.
