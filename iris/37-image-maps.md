---
title: "Image Maps"
description: "Drive Iris generation from PNG data: the resource model, accepted source images, and the Image Map Studio workflow"
published: true
date: 2026-09-21T10:36:56.240Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-24T00:00:00.000Z
---
Image maps let a pack author supply spatial generation data as pixels. Iris treats the image as data, not artwork: the map type, decoding rules, coordinate transform, sampling filter, legend, and masks are explicit pack configuration, compiled before chunk generation begins.

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

## One compiler defines behavior

Studio preview, `/iris pack validate`, hotload, packaging preflight, and world generation all use the same image-map compiler, so a preview is the runtime interpretation of the exported resource — there is no separate editor simulation contract. The same pack bytes, seed, and coordinates produce the same result on every platform.

Invalid input is a load-time blocking error. Unsupported formats, excessive dimensions, incompatible channel layouts, malformed legends, ambiguous color matches, invalid mask graphs, missing resources, and uncovered coordinates configured as `ERROR` **do not degrade into a flat or arbitrary world.**

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

### Validation failures

| Error | Resolution |
|---|---|
| Unsupported or corrupt image | Re-export as a valid PNG and import again |
| Width, height, or total pixels outside the limits | Crop, resample, split the authored area, or raise `blocksPerPixel` |
| Grayscale height source is RGB | Export a real single-channel grayscale PNG or declare the correct type |
| RGB height source is 16-bit per channel | Export exactly 8-bit RGB/RGBA; the canonical encoding is 24-bit total |
| Alpha map has no alpha channel | Export RGBA or select a grayscale/binary mask type |
| Indexed/palette source | Expand the source to canonical RGB/RGBA before import |
| File looks correct but colors do not match | Disable profile conversion, antialiasing, and dithering, then inspect raw `#RRGGBB` values |

## Image Map Studio

The guided desktop workflow writes canonical PNG assets, `image-maps` resources, and dimension bindings as one project update.

**Prerequisites:** a graphical desktop host with `gui.useServerLaunchedGuis` enabled, work in the live pack under the platform packs directory (never a production world's immutable generation epoch), the server console visible, and a fixed Studio seed. On a headless server everything except the desktop window still works — author on a graphical Iris host or edit the typed JSON directly with [43 - Image Map Configuration & Coordinates](/iris/43-image-map-config-coordinates).

1. **Import the PNG** to a destination key under `images/`. PNG stays the canonical asset; no lossy conversion is hidden.
2. **Inspect the source.** Studio reports width, height, pixel count, format, bit depth, channel layout, alpha presence and transparency range, and embedded color-profile metadata before type compatibility is compiled. The profile is reported so you can spot an editor conversion; it is never applied to raw samples.
3. **Choose the map type and the role** — a dimension binding key and application. Studio does not infer semantics from appearance.
4. **Place the image.** Configure `origin`, `sourceOrigin`, `blocksPerPixel`, rotation, mirroring, sampling, and out-of-bounds behavior, using named Minecraft coordinates as checkpoints.
5. **Configure decoding.** Height range, inversion, curve, smoothing and clamp; or a color legend and unknown-color policy; or a binary resource's threshold and falloff. Continuous grayscale and alpha thresholds belong to composed-mask rows so a reusable mask keeps its full weight range.
6. **Compose masks.** Add named `MASK` bindings in the composed-mask table, choose each operation, inversion, threshold and falloff, and order the rows exactly as they should execute.
7. **Preview interpreted data** — decoded Minecraft elevations, resolved target keys, or mask weights, not only the source picture — with the overlays below enabled.
8. **Resolve diagnostics.** Unknown-pixel and clipped-height counts stay visible; ambiguous tolerance matches are blocking compiler errors that name their source pixel coordinates. Invalid pixels, transparent fallbacks, out-of-bounds samples, and uncovered boundary areas must be fixed or explicitly handled.
9. **Export.** The PNG, typed image-map resource, dimension binding, and any preset updates commit atomically, and only when the project has no blocking image-map or pack-graph errors. A failed write leaves the previous project intact. A successful export writes the authoring pack and requests a Studio generation update; it never edits a retained generation snapshot.
10. **Verify in Vision and terrain.** Select Height or Biome mode in the Vision map, compare checkpoint coordinates against the final runtime field, then generate fresh chunks on the same seed.

> The interpreted preview shows the current authored map. **Existing world chunks retain their saved terrain.** Fresh boundary chunks include three-dimensional reconciliation against it, so compare checkpoints beyond the finite transition band, or reopen Studio for a fresh world that uses only the latest pack.
{.is-info}

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

A **preset** is reusable configuration, not copied runtime code: type, transform, decoding, legend, alpha, sampling, out-of-bounds, and mask settings. Save one after the transform and decoding are accepted, then apply it to another compatible PNG. A preset never turns a source into an implicitly different type.

**Replace Image** changes the source asset while retaining the image-map resource, dimension binding, legend, masks, and preset association. Studio reinspects the new file and recompiles the complete map, and refuses the replacement when the new channel layout, bit depth, dimensions, legend coverage, or transparency violates the retained settings. The previous source and configuration stay active after a failed replacement.

### Exported pack shape

```text
images/maps/terrain.png
image-maps/terrain.json
dimensions/example.json
```

Packaging runs the shared pack validator and image-map compiler before it clears staging or copies closure files, and includes every referenced PNG and image-map resource. Missing indirect mask resources, invalid maps, or missing image sources fail before an incomplete archive can be staged.

### Recovery

| Symptom | Action |
|---|---|
| Desktop tool does not open | Confirm a graphical host, `gui.useServerLaunchedGuis`, and platform GUI availability; use typed JSON on headless hosts |
| Preview differs from an image editor | Trust raw Studio values; disable editor profile conversion, antialiasing, dithering, and resampling |
| Unknown or ambiguous colors remain | Repair pixels or legend colors, reduce tolerance, or deliberately set the unknown fallback |
| Terrain is shifted or mirrored | Check `origin`, `sourceOrigin`, axes, rotation, and mirror order against the coordinate checkpoints |
| Export validation fails | Fix the first blocking diagnostic and export again; the previous project remains intact |
| Existing terrain did not change | Generate chunks beyond the transition band, or reopen Studio for a fresh world. Hotload preserves existing chunks |

See [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas) for opening, saving, and closing a Studio session.

## Authoring path

1. Confirm the file meets [Source images](#source-images).
2. Choose a type and follow [38 - Image Map Encodings](/iris/38-image-map-encodings).
3. Import, inspect, preview, and export through [Image Map Studio](#image-map-studio).
4. Validate the pack before opening Studio or creating a world.
5. Check the interpreted image layer in the Vision map, then generate fresh chunks on a fixed seed.

The workflow passes when validation reports no blocking errors, the Studio preview and Vision layer agree at named world coordinates, and the same seed reproduces the same generated result after a close and reopen.
