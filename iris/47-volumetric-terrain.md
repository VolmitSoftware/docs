---
title: "Volumetric Terrain"
description: "Iris documentation: Volumetric Terrain"
published: true
date: 2026-09-09T06:54:00.000Z
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

Iris builds the volumetric runtime once per engine, and only when at least one biome reachable from the dimension declares a profile with `enabled` true. With no such biome the runtime is never constructed and every terrain query answers exactly as before.

When it is active, each column is resolved like this:

1. The biome's blended generator height is sampled as the base height. That value stays available on its own stream, separate from the shaped height.
2. The density base height, signed displacement field, and signed fissure field use the same four-block lattice: the surrounding grid corners in X and Z, and every fourth Y for the noise fields. The density base blends toward the interpolated anchor heights using the existing elevation and slope strength. This prevents individual base-height peaks from becoming tall, one-block-wide spires. The original generator-height stream remains unchanged.
3. A column is solid at `y` when `densityHeight + 0.5 - y + displacement - fissure >= 0`. Crossings of that test become the span boundaries, so one column can carry many `ceiling..floor` pairs.
4. Span components are flood-filled across the four cardinal neighbour columns. A component that never connects to a ground span and totals 512 blocks or fewer is dropped; a larger connected mass is kept. This is what stops isolated rock from floating in the air.
5. The highest solid block of the resolved column becomes the natural terrain height.

Shaping is bounded vertically. The sampled band starts at the higher of `floor(fluidHeight) + 1` and `floor(densityHeight - amplitude - crackDepth)`, and ends at the lower of `height - 1` and `ceil(densityHeight + amplitude)`. Nothing below the fluid line is touched, and a column whose band is empty is returned unshaped.

Two gates fade the effect in rather than switching it on. Both use a smoothstep curve over the interval you configure, and they multiply:

| Gate | Measured from | Fades over |
|---|---|---|
| Elevation | Base height minus dimension fluid level minus `fluidClearance` | `fluidFade` blocks |
| Slope | Base-terrain rise over run, taken four blocks east and four blocks south, minus `minimumSlope` | `slopeFade` |

A profile with `minimumSlope` at `0` skips the slope gate entirely and keeps full strength. The elevation gate is applied twice: once per lattice anchor against the base height, and again per sampled Y so the field itself thins out toward the fluid line.

## The `terrain3D` object

Add the object to a biome, or point the field at a snippet. Every numeric field is range-checked before the runtime compiles it, and a value outside its range is a blocking pack error rather than a clamp.

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

Fourteen fields in total. `amplitude` and `crackDepth` are interpolated between the four lattice anchors, so a biome without a profile contributes zero displacement at its own anchors and shaped terrain fades across the boundary instead of ending at a seam. When `amplitude + crackDepth` resolves to zero for a column, that column is returned unshaped.

Both style fields accept the whole `IrisGeneratorStyle` shape — `style`, `zoom`, `multiplier`, `exponent`, `cellularFrequency`, `cellularZoom`, `cacheSize`, `expression`, `imageMap`, and a nested `fracture`. The two fields are seeded independently from the same profile seed, so changing `crackStyle` does not move the density shape.

## Snippets

`IrisTerrain3D` is annotated `@Snippet("terrain-3d")`, so the field takes either an inline object or a string path:

```json
{
  "terrain3D": "snippet/terrain-3d/cliff"
}
```

The file is `<pack>/snippet/terrain-3d/cliff.json` and contains the profile object at the top level. Subfolders are allowed; the path in the reference is everything after `snippet/terrain-3d/`. The `densityStyle` and `crackStyle` fields inside it can themselves be `snippet/style/<key>` references, and those may nest further through `fracture`.

Studio schema generation emits `.iris/schema/snippet/terrain-3d-schema.json` and offers the field as an object-or-string `anyOf`, with the string branch enumerating the snippet files that currently exist. See [24 - Pack Mods & Snippets](/iris/24-pack-mods-snippets) for the resolution rules that apply to every snippet type.

The modded `/iris studio package` export copies the entire `snippet/` tree, so terrain profiles and the style snippets they reference survive the export. The Bukkit `/iris pack package` compiler re-serializes the loaded object graph and inlines them instead.

## Interaction with the rest of the engine

**Heights.** The shaped column top is reported as the natural terrain height. The unshaped generator height remains available as its own stream and is what the profile itself is evaluated against, which keeps the shaped height from feeding back into the field that produced it. Height queries still return one value per column, so a lower ledge under an overhang is not reachable through a height query — see [91 - API - Terrain](/iris/91-api-terrain).

**Terrain writing.** The normal terrain actuator walks the spans from the top down. Blocks in the gaps are written as air, and ores cannot claim those cells. Each exposed ledge floor restarts the layer stack with a fresh surface palette generated for that floor's own height. Under an overhang, the bottom two blocks of the covering span use the biome's `caveCeilingLayers`, falling back to dimension rock when the biome declares none. The top two blocks of a span always win, so a ledge two blocks thick keeps its surface layers rather than becoming a ceiling, and the lowest span in a column never takes ceiling layers.

**Slope.** Surface slope is measured between neighbouring ledge floors rather than off the flat heightmap: the nearest solid surface three blocks east and three blocks south of the ledge being generated. A steep upper cap therefore does not force a flat ledge below it to use steep-slope materials. Layer slope clips and decorator `slopeCondition` both read that per-ledge slope. Columns with no shaped span, and any Y that is not itself a span floor, fall back to the ordinary slope stream.

**Decorators.** The decorant pass walks every span pair in the column. Where the floor is solid and there is at least one block of headroom, the surface decorator runs on that floor with the headroom as its available space; where the span above is solid, the ceiling decorator runs on its underside. See [16 - Surfaces, Decorators & Deposits](/iris/16-surfaces-decorators-deposits).

**Caves.** Shaped openings are treated as surface, not cave. The carve modifier skips them so cave carving cannot widen or re-fill them, cave zone markers are suppressed inside them, and the boundary biome for such a column resolves from the surface biome stream instead of the cave biome resolver. This is independent of `carvingEnabled`; profiles add volume as well as remove it, and cave profiles then operate on the resulting terrain. See [15 - Caves & Carving](/iris/15-caves-carving).

**Mantle and object placement.** Mantle carve queries and carved-column reads include shaped openings, so objects and structures see them as open space. Surface-solid checks across the normal, stacked and upper terrain paths fall back to terrain solidity when no boundary signature is resolved.

**Floating islands.** When an object is placed on a floating island, both the carve query and the surface-solid query are answered from the island's own solid mask rather than the terrain below it.

**Hydrology.** A river's planned surface now reports whether it owns a column. Where hydrology owns the terrain, it keeps its continuous bed and no volumetric column is returned for that position; where it does not, the cave voxel view consults natural terrain solidity instead. See [36 - Rivers](/iris/36-rivers).

**Dimension stack and upper dimensions.** Each stacked layer and the referenced upper terrain carry their own column, so stack top heights, solidity and surface lookups follow the spans. Each exposed face draws its palette from its own source height and slope. Regions reachable only through an image map are enumerated when biomes are collected for stacked and upper terrain, and compat-excluded regions are skipped. See [11 - Dimensions](/iris/11-dimensions).

## Validation

`terrain3D` is validated as a blocking pack error by `PackValidator`, so a pack with a bad profile is not loadable and world and studio creation are refused. The validator reads `biomes/**.json` and every file under `snippet/terrain-3d/**.json` directly from disk, before any of it is deserialized.

| Error | Cause | Fix |
|---|---|---|
| `… is not a terrain3D field.` | A key that is not one of the fourteen fields or `$schema` | Remove the key or correct the spelling |
| `… must be a JSON boolean.` | `enabled` given a non-boolean | Use `true` or `false` |
| `… must be a finite JSON number.` | A numeric field given a string, object, or a non-finite value | Supply a plain finite number |
| `… must be an integer in the signed 64-bit range.` | `seed` or a style `cacheSize` with a fractional or oversized value | Use a whole number that fits a signed 64-bit integer |
| `… must be between <min> and <max>.` | A style number outside its range | Bring it into range; the style ranges are `exponent` `0.01562`–`64`, `cacheSize` `0`–`8192`, `cellularFrequency` `0` upward, and `0.00001` upward for `zoom`, `cellularZoom` and `multiplier` |
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

A snippet reference written as `"snippet/cliff"` is rewritten to `snippet/terrain-3d/cliff` before resolution, so the short form and the full form both work for the profile field. Unknown-field and type errors are reported first; the profile is only deserialized and range-checked once those pass, so fix the reported errors and revalidate rather than expecting every problem in one run.

Run the checks with `/iris pack validate <key>` and read the result as described in [25 - Pack Management](/iris/25-pack-management).

## The terrain probe

The probe generates real chunks from a real pack, compares the geometry the runtime predicts against the blocks that were actually written, and exports cross-sections. It runs from the Iris source tree, not from a server.

```
./gradlew :probe:terrain3DProbe \
  -PprobePack=/absolute/path/to/pack \
  -PprobeDimension=overworld \
  -PprobeSeed=1337 \
  -PprobeMinimumChunkX=-4 -PprobeMaximumChunkX=4 \
  -PprobeMinimumChunkZ=-4 -PprobeMaximumChunkZ=4 \
  -PprobeRequiredCoverage=ledges \
  -PprobeOutput=/absolute/path/to/output
```

| Property | Required | Meaning |
|---|---|---|
| `probePack` | Yes | Absolute path to the pack folder |
| `probeDimension` | Yes | Dimension load key, no whitespace |
| `probeSeed` | Yes | World seed |
| `probeMinimumChunkX`, `probeMaximumChunkX` | Yes | Chunk X range, ordered, at most 64 chunks wide |
| `probeMinimumChunkZ`, `probeMaximumChunkZ` | Yes | Chunk Z range, same limits |
| `probeRequiredCoverage` | Yes | Comma-separated biome load keys that must produce both retained added terrain and retained covered gaps, or `-` for none |
| `probeOutput` | Yes | Absolute output directory, created if missing |
| `probeStrictGeometry` | No, `false` | Also fails when the final chunk differs from the terrain actuator's own output, which catches later passes overwriting shaped terrain |
| `probeStudio` | No, `false` | Opens the engine in studio mode |
| `probeJfr` | No | Absolute recording path outside the repository; adds a Flight Recorder profile recording |

The task exits `0` when there are no failures, `1` when there are, and `2` when the probe itself threw before producing a result. It prints one `IRIS_TERRAIN3D_RESULT` line carrying the status and the resolved arguments, then a per-biome line with the shaped column count, retained added blocks, retained covered gaps, maximum gap height and geometry error count.

It fails when a biome's generated blocks disagree with the predicted spans or with the height query, when strict mode is on and the final chunk differs from the actuator output, when the rectangle produced no shaped columns at all, or when a biome named in `probeRequiredCoverage` did not produce both retained added terrain and retained covered air gaps.

### Output

`terrain3d-summary.json` holds `status`, the resolved `configuration`, `generatedChunks`, `worldMinimumY`, per-biome `biomes` counters, a `topology` block, the `failures` list, `sections` with the absolute paths of the focused cross-section images, and a `metricDefinitions` block that spells out the histogram bin ranges and how to normalize the counters. Gap-height and thickness bins are `1`, `2–3`, `4–7`, `8–15`, `16+`; detached-component size bins are `1–8`, `9–64`, `65–512`, `513+`. Per-biome counts are normalized by dividing by `sampledColumns`, which includes unshaped columns.

The topology block counts grounded, censored and detached components, the detached and retained-detached block totals, and how many small components survived fully. Components that touch the rectangle edge, the world ceiling, or terrain owned by another layer are censored rather than counted as detached, and examples are given as local `X,Y,Z` relative to the rectangle and the world minimum Y.

Per chunk row the probe writes four PNGs, named with the world Z of the slice: `section-z-<z>-full.png` and `section-z-<z>.png` for the row's highest-scoring Z slice, and `fixed-section-z-<z>-full.png` and `fixed-section-z-<z>.png` for the fixed slice at local Z 8. The `-full` images show the whole world height in two stacked panels — terrain actuator output above, complete generated chunk below. The other two crop to the shaped band with a margin and scale up. Gold marks blocks added above the base height, mauve marks shaped air, green marks vegetation, blue and orange mark water and lava. The colors identify categories, not Minecraft rendering.

### Worked example

The repository carries a minimal fixture pack at `probe/src/test/resources/terrain3d-pack/`. It is a flat 256-block dimension with fluid level 0 and caves disabled, one region, and one biome whose generator is pinned flat at 128 so every effect on screen comes from the profile:

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

Both gates are opened deliberately: `minimumSlope` at `0` removes the slope gate that flat ground would otherwise fail, and `fluidClearance` at `0` with `fluidFade` at `1` removes the elevation fade. A 16-block vertical scale against a 64-block amplitude puts several folds inside the displacement band, which is what produces stacked ledges. Point `probeRequiredCoverage` at `ledges` to require that this biome actually generates both added rock and covered gaps.

The same trick is worth borrowing when tuning a real profile: temporarily flatten the generator and open the gates so you can see the field itself, then restore them.

## Cost

The runtime is built only when a profile is enabled, and the enabled check is per engine. Where it is active:

- Density and fissure samples are taken on a four-block lattice in all three axes and interpolated, so the field is evaluated at roughly one sixty-fourth of the block count.
- Resolved columns and lattice anchors are held in bounded caches, striped sixteen ways, with least-recently-used eviction per stripe. The column cache holds the larger of 4096 entries and the engine's noise cache size, which is `performance.noiseCacheSize` in a production world and a raised floor in a studio world; the anchor cache holds a quarter of that.
- Each generation thread also memoizes its most recent column, so repeated queries against the same position on one thread skip the cache entirely. Clearing the runtime invalidates that reuse across all threads.
- Anchor samples are stored per lattice Y and filled with a compare-and-set, so concurrent generation threads share work rather than duplicating it.
- Larger `amplitude` and `crackDepth` values widen the sampled vertical band, which is the main lever on how much work a profile costs.

Fragment removal walks at most 512 blocks of span per component before it stops and keeps the component, and it reuses per-thread scratch arrays, so the flood fill does not allocate per column.
