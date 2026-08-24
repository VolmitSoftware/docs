---
title: "Color Maps & Masks"
description: "Exact legends, raw sRGB tolerance, alpha rules, and composable masks for Iris image maps"
published: true
date: 2026-08-24T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-24T00:00:00.000Z
---
Color maps assign authored raw RGB values to Iris resources or Minecraft blocks. Masks produce zero-through-one weights that restrict another binding. Exact nearest-neighbor matching is the default, and any unknown or ambiguous color configured as an error blocks the pack before generation.

## Exact color map

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

Legend keys are six-digit `#RRGGBB` raw sRGB values. The target namespace is interpreted by the dimension application: biome keys for `BIOME`, region keys for `REGION`, and block keys for `SURFACE_BLOCK`.

`COLOR_MAP` requires `NEAREST`. Bilinear and bicubic filters create colors that are absent from the legend and fail validation for categorical maps.

## Tolerant matching

`colorTolerance` is a radius in raw 8-bit sRGB channel space. It ranges from 0 through approximately 441.672956, the distance between black and white. For a source color `(r, g, b)` and legend color `(R, G, B)`:

```text
distance = sqrt((r - R)^2 + (g - G)^2 + (b - B)^2)
```

- `0` requires an exact RGB match and is the default.
- An exact legend match wins immediately.
- When there is no exact match and tolerance is above zero, a legend color is eligible when its Euclidean distance is at most the configured tolerance.
- No eligible entry is an unknown color.
- More than one eligible entry is ambiguous and is a blocking validation error. Iris never chooses one by map order, hash order, or platform behavior.

Tolerance uses raw sRGB channel values. It is not Delta E, HSV distance, gamma-linear distance, or a display-profile comparison. Keep it at zero for authored data maps whenever possible.

## Unknown colors

| `unknownColor` | Result |
|---|---|
| `ERROR` | Any unmatched pixel blocks validation |
| `FALLBACK` | The pixel resolves to `fallbackTarget` |
| `IGNORE` | The map contributes no target at that pixel |

When `FALLBACK` is selected, `fallbackTarget` must be valid for the binding application. Studio reports the unknown-pixel count. Ambiguous tolerance matches are blocking compiler diagnostics that identify their source pixel coordinates, so the source or legend can be repaired without searching visually.

## Alpha behavior

The `alpha` policy applies independently from RGB matching:

| Value | Result |
|---|---|
| `IGNORE` | Alpha does not affect decoded data |
| `MASK` | Multiplies scalar map data by normalized alpha. On a color map, alpha must be binary: zero uses `fallbackTarget`, one resolves RGB normally, and an intermediate value is invalid |
| `TRANSPARENT_IS_FALLBACK` | Fully transparent pixels use the configured fallback |
| `ERROR` | Transparency is invalid |

Use `ALPHA_MASK` when alpha is a named reusable mask rather than an attribute of one map.

## Mask types

| Type | Decoded value |
|---|---|
| `BINARY_MASK` | Thresholded grayscale: hard 0/1 when `falloff` is zero, or a continuous transition across the configured falloff |
| `GRAYSCALE_MASK` | Raw grayscale normalized from its 8-bit or 16-bit range |
| `ALPHA_MASK` | Alpha normalized from transparent 0 to opaque 1 |

For a `BINARY_MASK` resource, `threshold` is the lower edge and `falloff` is the soft transition width above it. `falloff: 0` creates a hard edge. `smoothingRadius` may average the compiled result afterward; keep it at zero for an exact binary footprint. Resource-level `inverted: true` exchanges 0 and 1 before the map is compiled.

Every dimension mask reference has its own `threshold`, `falloff`, and `inverted` controls. Those apply to the referenced compiled mask without changing the reusable resource. `ALPHA_MASK` requires 8-bit RGBA and `alpha: IGNORE` because alpha itself is the map data.

Exact binary boundaries require `NEAREST`. Continuous grayscale and alpha masks may use `BILINEAR` or `BICUBIC` when a spatially smooth weight is intended.

## Named mask composition

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

A mask reference must name a dimension binding whose application is `MASK`. A `MASK` binding cannot itself contain mask references. Missing keys, duplicate binding keys, references to non-mask applications, and nested mask composition are blocking errors.

## Authoring rules

- Disable antialiasing, feathering, color adjustment, and dithering for exact categorical maps.
- Keep legend colors far enough apart that the selected tolerance cannot overlap their acceptance radii.
- Use a separate mask resource when several maps share the same footprint.
- Preview unknown, ambiguous, transparent, and uncovered pixels before export.
- Validate target keys against the live pack and platform registries. Region targets must load from the pack; biome targets must load and occur in exactly one land, sea, or shore role across the dimension; surface-block targets must exist in the live block registry.

Coordinate placement and out-of-bounds behavior are defined in [43 - Image Map Configuration & Coordinates](/iris/43-image-map-config-coordinates).
