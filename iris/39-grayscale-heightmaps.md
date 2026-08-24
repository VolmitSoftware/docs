---
title: "Grayscale Heightmaps"
description: "Decode 8-bit and 16-bit grayscale PNGs into Iris terrain heights"
published: true
date: 2026-08-24T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-24T00:00:00.000Z
---
A grayscale heightmap stores one normalized elevation per pixel. Black maps to `minimumHeight`, white maps to `maximumHeight`, and Iris preserves native 8-bit or 16-bit source precision before applying the configured curve and spatial sampling.

## Minimal resource

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

Bind it to the dimension as shown in [43 - Image Map Configuration & Coordinates](/iris/43-image-map-config-coordinates). Preview at known world coordinates before generating chunks.

## Decoding formula

For a source bit depth `b`, Iris reads the unsigned grayscale sample without color correction:

```text
maximumSample = 2^b - 1
normalized = sample / maximumSample
height = minimumHeight + normalized × (maximumHeight - minimumHeight)
```

The exact endpoints are:

| Source | 8-bit sample | 16-bit sample | Normalized |
|---|---:|---:|---:|
| Black | 0 | 0 | 0 |
| Mid gray | 128 | 32768 | approximately 0.5 |
| White | 255 | 65535 | 1 |

For `minimumHeight: -64` and `maximumHeight: 320`, black is Y -64 and white is Y 320. The integer midpoint sample lies just above the mathematical midpoint because both unsigned ranges contain an even number of representable values.

## Evaluation order

Iris compiles and samples grayscale height data in this order:

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

Interpolation acts on decoded scalar values, not packed image bytes or final rounded block heights. This preserves continuous slopes while keeping the height-range mapping explicit.

## Precision choice

| Source | Levels | Use it for |
|---|---:|---|
| 8-bit grayscale | 256 | Broad terrain where each source step spans less than a visible block after mapping |
| 16-bit grayscale | 65,536 | Tall ranges, subtle grades, erosion data, or sources that otherwise show terracing |

An 8-bit map spanning 384 blocks has steps of about 1.506 blocks before interpolation. A 16-bit map over the same range has steps of about 0.00586 blocks. Bilinear or bicubic sampling smooths spatial transitions but cannot restore precision removed during export.

## Height controls

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

`minimumHeight` and `maximumHeight` are absolute world Y values for a `TERRAIN_HEIGHT` binding. Validation evaluates the effective endpoints after `verticalOffset` and the configured `clamp`; an output outside the owning dimension's build range is a blocking error rather than being silently clipped to that dimension. Studio's clipped-pixel count instead identifies source pixels whose offset result was clamped to the map's own configured height interval.

## Avoid common artifacts

- Export genuine grayscale, not an RGB picture that merely looks gray.
- Use 16-bit source data when 8-bit steps are visible across a tall height range.
- Do not blur in an editor unless the changed pixels are intentional data. Prefer `smoothingRadius` so the transformation stays in configuration.
- Use `NEAREST` for authored terraces and cell boundaries, `BILINEAR` for ordinary slopes, and `BICUBIC` only when its wider smooth reconstruction is intended.
- Preview source pixels clipped by the map's own offset/clamp settings and the world boundary overlay before export.
- Compare only fresh chunks after a change; existing chunks retain their generated blocks.

For higher precision encoded across color channels, use [40 - RGB Heightmaps](/iris/40-rgb-heightmaps).
