---
title: "Volumetric Terrain"
description: "Iris documentation: Volumetric Terrain"
published: true
date: 2026-09-19T00:00:00.000Z
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
- [24 - Pack Mods & Snippets](/iris/24-pack-mods-snippets)
- [25 - Pack Management](/iris/25-pack-management)
- [36 - Rivers](/iris/36-rivers)
- [Biome Terrain Shaping](/iris/biomes/terrain-shaping)

## What it does

With no biome declaring an enabled profile, nothing is built and every terrain query answers exactly as before.

Where a profile is active, a signed displacement field and a signed fissure field push the solid/air boundary around the generator height, so one column can carry several `ceiling..floor` pairs. Solid mass that never connects to the ground and totals 512 blocks or fewer is dropped, which is what stops isolated rock floating in the air. The highest solid block of the resolved column becomes the natural terrain height; the unshaped generator height stays available on its own stream and is what the profile is evaluated against.

Shaping is bounded vertically. **Nothing below the fluid line is touched**, and the sampled band never reaches above `densityHeight + amplitude` or below `densityHeight - amplitude - crackDepth`. A column whose band is empty is returned unshaped.

Two gates fade the effect in rather than switching it on. Both use a smoothstep curve over the interval you configure, and they multiply:

| Gate | Measured from | Fades over |
|---|---|---|
| Elevation | Base height minus dimension fluid level minus `fluidClearance` | `fluidFade` blocks |
| Slope | Base-terrain rise over run, taken four blocks east and four blocks south, minus `minimumSlope` | `slopeFade` |

A profile with `minimumSlope` at `0` skips the slope gate entirely and keeps full strength.

## The `terrain3D` object

Add the object to a biome, or point the field at a snippet. Every numeric field is range-checked before the runtime compiles it, and **a value outside its range is a blocking pack error rather than a clamp.**

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
| `enabled` | boolean | — | `true` | Turns this profile off without deleting it. A disabled profile contributes nothing, and a dimension whose profiles are all disabled skips the runtime | — |
| `seed` | long | any 64-bit integer | `0` | Mixed into the engine terrain seed with XOR, then salted separately for each field, so two biomes can share a shape or deliberately differ | both |
| `amplitude` | double | `0`–`128` | `32` | Maximum positive or negative density displacement in blocks. `0` leaves only the fissure field | `densityStyle` |
| `horizontalScale` | double | `8`–`4096` | `96` | Horizontal feature size in blocks at the style's default zoom. The runtime samples the density field at `64 / horizontalScale` per block in X and Z | `densityStyle` |
| `verticalScale` | double | `8`–`4096` | `24` | Vertical feature size in blocks, sampled at `64 / verticalScale` per block in Y. Short vertical scales relative to `amplitude` are what produce overlapping ledges and overhangs | `densityStyle` |
| `densityStyle` | `IrisGeneratorStyle` | — | `SIMPLEX` | Signed 3D noise that displaces density. Style `zoom` multiplies the configured feature sizes | itself |
| `crackDepth` | double | `0`–`128` | `0` | Maximum additional fissure depth in blocks. `0` disables fissures and the fissure noise is never created | `crackStyle` |
| `crackWidth` | double | `0.25`–`64` | `4` | Approximate fissure half-width in blocks around the fissure field's zero crossings. Falloff is quadratic from the crossing outward | `crackStyle` |
| `crackScale` | double | `8`–`4096` | `96` | Horizontal fissure feature size in blocks, sampled at `64 / crackScale`. The vertical rate is a quarter of that, so fissures stretch to four times this scale in Y | `crackStyle` |
| `crackStyle` | `IrisGeneratorStyle` | — | `SIMPLEX` | Signed 3D noise whose zero crossings define tall narrow fissures | itself |
| `minimumSlope` | double | `0`–`16` | `0.15` | Minimum base-terrain slope, as rise over horizontal distance, before shaping starts. `0` disables the slope gate | — |
| `slopeFade` | double | `0.001`–`16` | `0.35` | Slope interval above `minimumSlope` over which shaping reaches full strength | — |
| `fluidClearance` | double | `0`–`128` | `8` | Height above the dimension fluid level below which terrain stays solid and unchanged | — |
| `fluidFade` | double | `1`–`128` | `24` | Vertical distance over which shaping grows from zero above `fluidClearance` | — |

Fourteen fields in total. `amplitude` and `crackDepth` are interpolated between lattice anchors, so a biome without a profile contributes zero displacement at its own anchors and shaped terrain fades across the boundary instead of ending at a seam. When `amplitude + crackDepth` resolves to zero for a column, that column is returned unshaped.

Both style fields accept the whole `IrisGeneratorStyle` shape — `style`, `zoom`, `multiplier`, `exponent`, `cellularFrequency`, `cellularZoom`, `cacheSize`, `expression`, `imageMap`, and a nested `fracture`. They are seeded independently from the same profile seed, so changing `crackStyle` does not move the density shape.

## Snippets

`IrisTerrain3D` is annotated `@Snippet("terrain-3d")`, so the field takes either an inline object or a string path:

```json
{
  "terrain3D": "snippet/terrain-3d/cliff"
}
```

The file is `<pack>/snippet/terrain-3d/cliff.json` and contains the profile object at the top level. Subfolders are allowed; the path in the reference is everything after `snippet/terrain-3d/`. The `densityStyle` and `crackStyle` fields inside it can themselves be `snippet/style/<key>` references, nesting further through `fracture`. Studio schema generation offers the field as an object-or-string `anyOf` with the string branch enumerating the snippet files that exist. See [24 - Pack Mods & Snippets](/iris/24-pack-mods-snippets).

The modded `/iris studio package` export copies the entire `snippet/` tree so terrain profiles and the style snippets they reference survive; the Bukkit `/iris pack package` compiler inlines them instead.

## Interaction with the rest of the engine

**Heights.** Height queries still return one value per column, so a lower ledge under an overhang is not reachable through a height query — see [91 - API - Terrain](/iris/91-api-terrain).

**Terrain writing.** Blocks in the gaps are written as air and ores cannot claim those cells. Each exposed ledge floor restarts the layer stack with a fresh surface palette generated for that floor's own height. Under an overhang, the bottom two blocks of the covering span use the biome's `caveCeilingLayers`, falling back to dimension rock when the biome declares none. The top two blocks of a span always win, so a ledge two blocks thick keeps its surface layers rather than becoming a ceiling, and the lowest span in a column never takes ceiling layers.

**Slope.** Surface slope is measured between neighbouring ledge floors rather than off the flat heightmap, so a steep upper cap does not force a flat ledge below it to use steep-slope materials. Layer slope clips and decorator `slopeCondition` both read that per-ledge slope.

**Decorators.** Where a span floor is solid and has at least one block of headroom, the surface decorator runs on that floor with the headroom as its available space; where the span above is solid, the ceiling decorator runs on its underside. See [16 - Surfaces, Decorators & Deposits](/iris/16-surfaces-decorators-deposits).

**Caves.** Shaped openings are treated as surface, not cave: cave carving cannot widen or re-fill them, cave zone markers are suppressed inside them, and the boundary biome resolves from the surface biome stream. This is independent of `carvingEnabled` — profiles add volume as well as remove it, and cave profiles then operate on the resulting terrain. See [15 - Caves & Carving](/iris/15-caves-carving).

**Mantle and object placement.** Mantle carve queries and carved-column reads include shaped openings, so objects and structures see them as open space. On a floating island, both the carve query and the surface-solid query are answered from the island's own solid mask rather than the terrain below it.

**Hydrology.** Where hydrology owns the terrain it keeps its continuous bed and no volumetric column is returned for that position. See [36 - Rivers](/iris/36-rivers).

**Dimension stack and upper dimensions.** Each stacked layer and the referenced upper terrain carry their own column, so stack top heights, solidity and surface lookups follow the spans, and each exposed face draws its palette from its own source height and slope. See [11 - Dimensions](/iris/11-dimensions).

## Validation

`terrain3D` is a blocking pack error, so a pack with a bad profile is not loadable and world and studio creation are refused. The validator reads `biomes/**.json` and every file under `snippet/terrain-3d/**.json` directly from disk before any of it is deserialized.

| Error | Cause | Fix |
|---|---|---|
| `… is not a terrain3D field.` | A key that is not one of the fourteen fields or `$schema` | Remove the key or correct the spelling |
| `… must be a JSON boolean.` | `enabled` given a non-boolean | Use `true` or `false` |
| `… must be a finite JSON number.` | A numeric field given a string, object, or a non-finite value | Supply a plain finite number |
| `… must be an integer in the signed 64-bit range.` | `seed` or a style `cacheSize` with a fractional or oversized value | Use a whole number that fits a signed 64-bit integer |
| `… must be between <min> and <max>.` | A style number outside its range | The style ranges are `exponent` `0.01562`–`64`, `cacheSize` `0`–`8192`, `cellularFrequency` `0` upward, and `0.00001` upward for `zoom`, `cellularZoom` and `multiplier` |
| `terrain3D.<field> must be finite and between <min> and <max>` | A profile number outside the range in the field table above | Bring it into range |
| `… is not a generator style field.` | An unknown key inside `densityStyle` or `crackStyle` | Remove it; the accepted keys are `style`, `zoom`, `multiplier`, `exponent`, `cellularFrequency`, `cellularZoom`, `cacheSize`, `expression`, `imageMap`, `fracture`, `$schema` |
| `… is not a known noise style.` | A `style` value that is not a `NoiseStyle` constant | Use a name from [45 - Noise Atlas](/iris/45-noise-atlas) |
| `… must be a JSON string.` / `… must be a JSON string or null.` | `$schema`, `expression` or `imageMap` given a non-string | Quote the value, or use `null` for `expression` and `imageMap` |
| `… exceeds the maximum style nesting depth of 32.` | More than 32 chained `fracture` levels | Flatten the chain |
| `terrain3D.<path> must use a known style with at most 32 nested fractures` | The compiled style has no `style` set, or nests past 32 levels | Give the style a `style` value and shorten the chain |
| `terrain3D densityStyle and crackStyle must be style objects or snippets` | Either style field resolved to null | Supply an object or a valid `snippet/style/…` reference |
| `… must be an object or snippet reference.` | The profile or a style is a string that does not start with `snippet/` | Write the object inline or use a full `snippet/` path |
| `… references an unavailable terrain-3d snippet '…'.` / `… style snippet '…'.` | The resolved snippet file does not exist, or the path escapes the pack folder | Create the file, or remove `../` segments and absolute paths from the reference |
| `… must contain a JSON object.` | A snippet file whose top-level value is an array, string or number | Wrap the profile in `{ }` |
| `… contains unreadable JSON: …` | Malformed JSON or an unreadable file | Fix the syntax named in the message |

A snippet reference written as `"snippet/cliff"` is rewritten to `snippet/terrain-3d/cliff` before resolution, so the short and full forms both work for the profile field. Unknown-field and type errors are reported first and the profile is only range-checked once those pass, so fix the reported errors and revalidate rather than expecting every problem in one run.

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

## Cost

The runtime is built only when a profile is enabled, per engine. Where it is active, density and fissure samples are taken on a four-block lattice in all three axes and interpolated, so the field is evaluated at roughly one sixty-fourth of the block count, and resolved columns are held in a bounded cache sized from `performance.noiseCacheSize`.

**Larger `amplitude` and `crackDepth` values widen the sampled vertical band, which is the main lever on how much a profile costs.**
