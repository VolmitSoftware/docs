---
title: "Image Map Concepts"
description: "How Iris turns typed PNG resources into deterministic world-generation inputs"
published: true
date: 2026-08-24T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-24T00:00:00.000Z
---
Image maps let a pack author supply spatial generation data as pixels. Iris treats the image as data, not artwork: the map type, decoding rules, coordinate transform, sampling filter, legend, and masks are explicit pack configuration and are compiled before chunk generation begins.

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
- `image-maps/<map>.json` is a reusable typed resource. It declares how to decode and place the source.
- A dimension `imageMaps` entry gives one map a unique binding `key`, selects its generation `application`, and composes optional masks.
- A generator style can reference a scalar `image-maps` resource key directly through `imageMap`. Because style and caller transforms can sample an unbounded domain, these direct references must use `FALLBACK`, `CLAMP`, `REPEAT`, or `MIRROR`, not `ERROR`.

Definitions are reusable. Two dimensions may bind the same image-map resource to different applications, and multiple bindings may reference one named mask. Binding keys must be unique within a dimension.

The complete JSON shape is in [43 - Image Map Configuration & Coordinates](/iris/43-image-map-config-coordinates).

## Map types

| Type | Pixel meaning | Typical application |
|---|---|---|
| `GRAYSCALE_HEIGHT` | One 8-bit or 16-bit grayscale scalar | `TERRAIN_HEIGHT` or generator noise |
| `RGB_HEIGHT` | One 24-bit unsigned scalar encoded red, green, blue | `TERRAIN_HEIGHT` or generator noise |
| `COLOR_MAP` | Exact or tolerance-matched `#RRGGBB` legend entry | `BIOME`, `REGION`, or `SURFACE_BLOCK` |
| `BINARY_MASK` | On or off after thresholding | `MASK` |
| `GRAYSCALE_MASK` | Continuous grayscale weight | `MASK` |
| `ALPHA_MASK` | Continuous alpha weight | `MASK` |

The map type is never inferred from its filename or appearance. Select it explicitly. Iris rejects a source whose channel layout or bit depth cannot represent the declared type.

## Applications

Dimension bindings use one of these applications:

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

Studio preview, `/iris pack validate`, hotload, packaging preflight, and world generation use the same image-map compiler. A preview is therefore the runtime interpretation of the exported resource, including raw channel decoding, coordinates, out-of-bounds behavior, legends, and masks. There is no separate editor simulation contract.

The compiler reads and validates a source once during load or reload. Chunk generation samples the resulting immutable data and does not reopen image files or invoke general-purpose image processing. The same pack bytes, seed, and coordinates produce the same result on Bukkit, Fabric, Forge, and NeoForge.

Invalid input is a load-time blocking error. Unsupported formats, excessive dimensions, incompatible channel layouts, malformed legends, ambiguous color matches, invalid mask graphs, missing resources, and uncovered coordinates configured as `ERROR` do not degrade into a flat or arbitrary world.

## Authoring path

1. Confirm the file meets [38 - Supported Image Inputs](/iris/38-supported-image-inputs).
2. Choose a type and follow [39 - Grayscale Heightmaps](/iris/39-grayscale-heightmaps), [40 - RGB Heightmaps](/iris/40-rgb-heightmaps), or [41 - Color Maps & Masks](/iris/41-color-maps-masks).
3. Import, inspect, preview, and export through [42 - Image Map Studio Workflow](/iris/42-image-map-studio-workflow).
4. Validate the pack before opening Studio or creating a world.
5. Check the interpreted image layer in the Vision map, then generate fresh chunks on a fixed seed.

The workflow passes when validation reports no blocking errors, the Studio preview and Vision layer agree at named world coordinates, and the same seed reproduces the same generated result after a close and reopen.
