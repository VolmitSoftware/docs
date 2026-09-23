---
title: "Volumetric Terrain"
description: "Iris documentation: Volumetric Terrain"
published: true
date: 2026-09-23T11:12:42.385Z
tags: "iris"
editor: markdown
dateCreated: 2026-09-08T12:00:00.000Z
---
`terrain3D` is an optional per-biome profile that shapes solid volume around the height a biome's `generators` already produce. It is off unless a biome declares it. A column that would otherwise hold one solid run from the world floor to a single top can hold several solid spans separated by air, so a surface gains projecting rock, undercuts, covered ledges and narrow fissures. The height generators still decide the broad landform; the profile only displaces density around it.

Related:

- [13 - Biomes](/iris/13-biomes)
- [14 - Generators, Noise & Expressions](/iris/14-generators-noise)
- [15 - Caves & Carving](/iris/15-caves-carving)
- [16 - Surfaces, Decorators & Deposits](/iris/16-surfaces-decorators-deposits)
- [24 - Snippets](/iris/24-pack-mods-snippets)
- [25 - Pack Management](/iris/25-pack-management)
- [36 - Rivers](/iris/36-rivers)
- [Biome Terrain Shaping](/iris/biomes/terrain-shaping)

## What it does

With no enabled profiles, the pack keeps its ordinary height-based terrain.

Where a profile is active, a signed displacement field and a signed fissure field push the solid/air boundary around the generator height, so one column can carry several `ceiling..floor` pairs. Solid mass that never connects to the ground and totals 512 blocks or fewer is dropped, which is what stops isolated rock floating in the air. The highest solid block becomes the natural terrain height.

Shaping is bounded vertically. **Nothing below the fluid line is touched**, and the sampled band never reaches above `densityHeight + amplitude` or below `densityHeight - amplitude - crackDepth`. A column whose band is empty is returned unshaped.

Two gates fade the effect in rather than switching it on. Both use a smoothstep curve over the interval you configure, and they multiply:

| Gate | Measured from | Fades over |
|---|---|---|
| Elevation | Base height minus dimension fluid level minus `fluidClearance` | `fluidFade` blocks |
| Slope | Base-terrain rise over run, taken four blocks east and four blocks south, minus `minimumSlope` | `slopeFade` |

A profile with `minimumSlope` at `0` skips the slope gate entirely and keeps full strength.

## The `terrain3D` object

Add the object to a biome, or point the field at a snippet. Keep numeric fields within the listed ranges; **out-of-range values prevent the pack from loading.**

```json
{
  "terrain3D": {
    "enabled": true,
    "seed": 0,
    "amplitude": 40,
    "horizontalScale": 72,
    "verticalScale": 20,
    "densityStyle": { "style": "SIMPLEX" },
    "crackDepth": 20,
    "crackWidth": 3,
    "crackScale": 96,
    "crackStyle": { "style": "SIMPLEX" },
    "minimumSlope": 0.15,
    "slopeFade": 0.35,
    "fluidClearance": 8,
    "fluidFade": 24
  }
}
```

| Field | Type | Range | Default | Effect | Style consumed |
|---|---|---|---|---|---|
| `enabled` | boolean | — | `true` | Turns this profile off without deleting it | — |
| `seed` | long | any 64-bit integer | `0` | Changes the profile shape. Use the same seed and settings to share a shape across biomes, or different seeds to vary it | both |
| `amplitude` | double | `0`–`128` | `32` | Maximum positive or negative density displacement in blocks. `0` leaves only the fissure field | `densityStyle` |
| `horizontalScale` | double | `8`–`4096` | `96` | Horizontal feature size in blocks at the style's default zoom | `densityStyle` |
| `verticalScale` | double | `8`–`4096` | `24` | Vertical feature size in blocks. Short vertical scales relative to `amplitude` are what produce overlapping ledges and overhangs | `densityStyle` |
| `densityStyle` | style object | — | `SIMPLEX` | Signed 3D noise that displaces density. Style `zoom` multiplies the configured feature sizes | itself |
| `crackDepth` | double | `0`–`128` | `0` | Maximum additional fissure depth in blocks. `0` disables fissures | `crackStyle` |
| `crackWidth` | double | `0.25`–`64` | `4` | Approximate fissure half-width in blocks around the fissure field's zero crossings. Falloff is quadratic from the crossing outward | `crackStyle` |
| `crackScale` | double | `8`–`4096` | `96` | Horizontal fissure feature size in blocks. Fissures stretch to four times this scale vertically | `crackStyle` |
| `crackStyle` | style object | — | `SIMPLEX` | Signed 3D noise whose zero crossings define tall narrow fissures | itself |
| `minimumSlope` | double | `0`–`16` | `0.15` | Minimum base-terrain slope, as rise over horizontal distance, before shaping starts. `0` disables the slope gate | — |
| `slopeFade` | double | `0.001`–`16` | `0.35` | Slope interval above `minimumSlope` over which shaping reaches full strength | — |
| `fluidClearance` | double | `0`–`128` | `8` | Height above the dimension fluid level below which terrain stays solid and unchanged | — |
| `fluidFade` | double | `1`–`128` | `24` | Vertical distance over which shaping grows from zero above `fluidClearance` | — |

Shaping fades across biome boundaries. Where both `amplitude` and `crackDepth` are zero, terrain stays unchanged.

Both style fields accept a [generator style](/iris/14-generators-noise#generator-style): `style`, `zoom`, `multiplier`, `exponent`, `cellularFrequency`, `cellularZoom`, `cacheSize`, `expression`, `imageMap`, and a nested `fracture`. They are seeded independently from the same profile seed, so changing `crackStyle` does not move the density shape.

## Snippets

The field accepts an inline object or a snippet path:

```json
{
  "terrain3D": "snippet/terrain-3d/cliff"
}
```

The file is `<pack>/snippet/terrain-3d/cliff.json` and contains the profile object at the top level. Subfolders are allowed; the path in the reference is everything after `snippet/terrain-3d/`. The `densityStyle` and `crackStyle` fields inside it can themselves be `snippet/style/<key>` references, nesting further through `fracture`. Studio completions list available snippet files. See [24 - Snippets](/iris/24-pack-mods-snippets).

The modded `/iris studio package` export copies the entire `snippet/` tree so terrain profiles and the style snippets they reference survive; Bukkit `/iris pack package` includes their contents directly in the exported JSON.

## Interaction with other settings

**Heights.** Height queries still return one value per column, so a lower ledge under an overhang is not reachable through a height query — see [91 - API - Terrain](/iris/91-api-terrain).

**Terrain writing.** Blocks in the gaps are written as air and ores cannot claim those cells. Each exposed ledge floor restarts the layer stack with a fresh surface palette generated for that floor's own height. Under an overhang, the bottom two blocks of the covering span use the biome's `caveCeilingLayers`, falling back to dimension rock when the biome declares none. The top two blocks of a span always win, so a ledge two blocks thick keeps its surface layers rather than becoming a ceiling, and the lowest span in a column never takes ceiling layers.

**Slope.** Surface slope is measured between neighbouring ledge floors rather than off the flat heightmap, so a steep upper cap does not force a flat ledge below it to use steep-slope materials. Layer slope clips and decorator `slopeCondition` both read that per-ledge slope.

**Decorators.** Where a span floor is solid and has at least one block of headroom, the surface decorator runs on that floor with the headroom as its available space; where the span above is solid, the ceiling decorator runs on its underside. See [16 - Surfaces, Decorators & Deposits](/iris/16-surfaces-decorators-deposits).

**Caves.** Shaped openings are treated as surface, not cave: cave carving cannot widen or re-fill them, they do not receive cave markers, and their edges use the surface biome. This is independent of `carvingEnabled` — profiles add volume as well as remove it, and cave profiles then operate on the resulting terrain. See [15 - Caves & Carving](/iris/15-caves-carving).

**Object placement.** Objects and structures treat shaped openings as empty space. On floating islands, placement checks use the island's surfaces and openings.

**Hydrology.** River channels keep their continuous bed without volumetric shaping. See [36 - Rivers](/iris/36-rivers).

**Dimension stack and upper dimensions.** Each stacked layer and the referenced upper terrain carry their own column, so stack top heights, solidity and surface lookups follow the spans, and each exposed face draws its palette from its own source height and slope. See [11 - Dimensions](/iris/11-dimensions).

## Validation

Invalid profiles prevent world and Studio creation. These requirements apply to biome `terrain3D` fields and files under `snippet/terrain-3d/`:

- Use only the fields listed above, plus an optional `$schema`. `enabled` must be a JSON boolean; numeric fields must contain finite numbers within their listed ranges.
- Use a whole signed 64-bit integer for `seed`. Style `cacheSize` must be a whole number from `0` to `8192`.
- Style ranges are `exponent: 0.01562..64`, `cellularFrequency >= 0`, and `zoom`, `cellularZoom`, and `multiplier >= 0.00001`.
- `densityStyle` and `crackStyle` must be style objects or valid snippets. Supported fields are `style`, `zoom`, `multiplier`, `exponent`, `cellularFrequency`, `cellularZoom`, `cacheSize`, `expression`, `imageMap`, `fracture`, and `$schema`.
- Use a style name from the [Noise Atlas](/iris/45-noise-atlas). Nested `fracture` chains may be at most 32 levels deep.
- `$schema` must be a string. `expression` and `imageMap` accept strings or `null`.
- Snippet files must contain a JSON object and stay inside the pack folder. Use relative `snippet/` paths; absolute paths and paths escaping the pack are invalid.

The short reference `"snippet/cliff"` also selects `snippet/terrain-3d/cliff` for the profile field.

Run the checks with `/iris pack validate <key>` and read the result as described in [25 - Pack Management](/iris/25-pack-management).

## Example: stacked ledges

This biome uses a flat generator at Y 128. The profile adds ledges above that height and cuts covered gaps into the terrain.

```json
{
  "name": "Ledges",
  "layers": [{ "palette": [{ "block": "minecraft:stone" }] }],
  "generators": [{ "generator": "flat", "min": 128, "max": 128 }],
  "terrain3D": {
    "amplitude": 64,
    "horizontalScale": 96,
    "verticalScale": 16,
    "minimumSlope": 0,
    "slopeFade": 1,
    "fluidClearance": 0,
    "fluidFade": 1,
    "crackDepth": 0
  }
}
```

`minimumSlope: 0` allows shaping on flat ground. `fluidClearance: 0` and `fluidFade: 1` remove the elevation fade. The smaller vertical scale creates several folds within the 64-block displacement band.
