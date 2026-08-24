---
title: "Image Map Studio Workflow"
description: "Import, inspect, configure, preview, export, and validate image-driven Iris generation"
published: true
date: 2026-08-24T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-24T00:00:00.000Z
---
This page defines the guided desktop authoring contract for typed image maps. The workflow uses the same compiled interpretation as pack validation and world generation and produces canonical PNG assets, `image-maps` resources, and dimension bindings as one project update.

## Prerequisites

- Run Iris on a machine with a graphical desktop and enable `gui.useServerLaunchedGuis`.
- Work in the live pack under the platform packs directory, not a production world's frozen pack snapshot.
- Keep the server console visible and use a fixed Studio seed.
- Start with a PNG that satisfies [38 - Supported Image Inputs](/iris/38-supported-image-inputs).

On a headless server the runtime, schemas, validation, packaging, and image-driven generation remain available, but the desktop window cannot open. Author the same pack on a graphical Iris host or edit its typed JSON directly with [43 - Image Map Configuration & Coordinates](/iris/43-image-map-config-coordinates).

## Workflow contract

1. **Import the PNG.** Select a source file and a destination key under `images/`. The import keeps PNG as the canonical asset and does not hide a lossy conversion.
2. **Inspect the source.** Studio displays source pixels plus width, height, pixel count, format, bit depth, channel layout, alpha, transparency range, and color-profile metadata immediately after import, before semantic type compatibility is compiled. Use that inspection to select and correct the intended type.
3. **Choose the map type.** Select `GRAYSCALE_HEIGHT`, `RGB_HEIGHT`, `COLOR_MAP`, `BINARY_MASK`, `GRAYSCALE_MASK`, or `ALPHA_MASK`. Studio does not infer semantics from appearance.
4. **Choose the role.** Assign a dimension binding key and application: terrain height, biome, region, surface block, mask, or custom.
5. **Place the image.** Configure `origin`, `sourceOrigin`, `blocksPerPixel`, rotation, mirroring, sampling, and out-of-bounds behavior. Use named Minecraft coordinates as checkpoints.
6. **Configure decoding.** Set the height range, inversion, curve, smoothing, and clamp; create a color legend and unknown-color policy; or set a binary resource's threshold and falloff. Continuous grayscale and alpha thresholds belong to composed-mask rows so a reusable mask retains its full weight range.
7. **Compose masks.** Add named `MASK` bindings in the composed-mask table, choose each operation, inversion, threshold, and falloff, then order the rows exactly as they should execute on the target binding.
8. **Preview interpreted data.** Inspect decoded Minecraft elevations, resolved target keys, or mask weights rather than only the source picture. A target binding preview uses the same ordered mask sampler as generation.
9. **Inspect overlays.** Enable block coordinates, source pixels, chunks, regions, the origin, the configured world boundary, and source coverage. Pan and zoom to both positive and negative coordinates.
10. **Resolve diagnostics.** Unknown-pixel and clipped-height counts remain visible; ambiguous tolerance matches are blocking compiler errors with source pixel coordinates. Invalid pixels, transparent fallbacks, out-of-bounds samples, and uncovered boundary areas must be fixed or explicitly handled.
11. **Save or apply a preset.** Presets retain type, transform, decoding, legend, alpha, sampling, out-of-bounds, and mask settings. They do not turn a source into an implicitly different type.
12. **Export.** Commit the PNG, typed image-map resource, dimension binding, and any preset updates atomically. A failed write leaves the previous project intact. A successful export invalidates cached presets and hotloads the active engine so preview and runtime use the new bytes.
13. **Validate.** Run the exported project through the same runtime compiler and pack validator. Export succeeds only when there are no blocking image-map or pack-graph errors.
14. **Verify in Vision and terrain.** Select Height or Biome mode in the Vision map, compare checkpoint coordinates against the final runtime field, then generate fresh chunks on the same seed.

The workflow passes when the interpreted preview, Vision layer, and fresh generated chunks agree at the checkpoints; the pack validates; and closing and reopening Studio reproduces the same result.

## Required preview modes

| Map type | Interpreted preview |
|---|---|
| Grayscale or RGB height | Minecraft Y palette, hover Y, and an exact clipped-source-pixel count |
| Color map | Resolved biome, region, or block colors; unknown pixels are counted and ambiguous matches block preview |
| Binary mask | Threshold footprint, falloff, and configured smoothing |
| Grayscale or alpha mask | Continuous zero-through-one weight; composed threshold and falloff are visible on the target preview |

The source-image view is useful for visual orientation but does not prove decoding. Use the interpreted view for acceptance.

Composed previews follow runtime application semantics. Biome, region, and surface-block targets select the mapped value at a final mask weight of at least `0.5` and leave the ordinary pipeline in control below it. Terrain-height masks blend from the active engine's procedural height baseline at weight `0` to the mapped height at weight `1`; they are not previewed against a synthetic zero-height plane.

## Required grid and coverage overlays

- Source pixel grid shows authored cells when the source view is zoomed far enough; the interpreted view shows the transformed coverage perimeter.
- Block coordinates show the world X/Z under the pointer.
- Chunk grid follows 16×16 Minecraft chunk boundaries.
- Region grid follows 32×32 chunks, or 512×512 blocks.
- Boundary overlay uses the dimension's native world-border center and full diameter.
- Coverage shading distinguishes valid source samples from coordinates handled by `FALLBACK`, `CLAMP`, `REPEAT`, `MIRROR`, or `ERROR`.

Studio warns when the image covers only part of the configured boundary, extends far beyond it, is substantially smaller than it, or is offset unexpectedly. A source whose sampling footprint exactly reaches every boundary edge is a fit and does not warn. A warning does not replace the configured out-of-bounds rule.

## Preset and source-replacement contract

A preset is reusable configuration, not copied runtime code. Save one after the transform and decoding are accepted, then apply it to another compatible PNG.

**Replace Image** changes the source asset while retaining the image-map resource, dimension binding, legend, masks, and preset association. Studio reinspects the new file and recompiles the complete map. It refuses the replacement when the new channel layout, bit depth, dimensions, legend coverage, or transparency violates the retained settings. The previous source and configuration remain active after a failed replacement.

## Exported pack shape

```text
images/maps/terrain.png
image-maps/terrain.json
dimensions/example.json
```

Packaging runs the shared pack validator and image-map compiler before it clears staging or copies closure files. It includes every referenced PNG and image-map resource; missing indirect mask resources, invalid maps, or missing image sources fail before an incomplete archive can be staged.

## Recovery

| Symptom | Action |
|---|---|
| Desktop tool does not open | Confirm a graphical host, `gui.useServerLaunchedGuis`, and platform GUI availability; use typed JSON on headless hosts |
| Preview differs from an image editor | Trust raw Studio values; disable editor profile conversion, antialiasing, dithering, and resampling |
| Unknown or ambiguous colors remain | Repair pixels or legend colors, reduce tolerance, or deliberately set the unknown fallback |
| Terrain is shifted or mirrored | Check `origin`, `sourceOrigin`, axes, rotation, and mirror order against the coordinate checkpoints |
| Export validation fails | Fix the first blocking diagnostic and export again; the previous project remains intact |
| Existing terrain did not change | Generate fresh chunks or recreate the disposable world; image-map hotload does not rewrite generated chunks |

Use [31 - Operator Runbooks](/iris/31-operator-runbooks) for the acceptance pass and [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas) for the broader Studio lifecycle.
