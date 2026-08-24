---
title: "Dimensions"
description: "Iris documentation: Dimensions"
published: true
date: 2026-08-24T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
A dimension is the root object of a pack. It sets world height, sea level, the regions that supply biomes, and the engine stages that run. The file lives at `dimensions/<loadKey>.json`. Every other pack resource hangs off this file. Some fields form a permanent contract with the world folder. Other fields can change on every save. This page splits those two groups and shows what each field does to generated terrain.

Related:

- [05 - Concepts & Pack Layout](/iris/05-concepts-pack-layout)
- [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas)
- [12 - Regions](/iris/12-regions)
- [14 - Generators & Noise](/iris/14-generators-noise)
- [15 - Caves & Carving](/iris/15-caves-carving)
- [36 - Rivers](/iris/36-rivers)
- [37 - Image Map Concepts](/iris/37-image-map-concepts)
- [43 - Image Map Configuration & Coordinates](/iris/43-image-map-config-coordinates)
- [18 - Structures Overview](/iris/18-structures-overview)
- [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks)
- [35 - Vanilla Passthrough](/iris/35-vanilla-passthrough)
- [26 - Example - Minimal Dimension](/iris/26-example-minimal-dimension)

## Decide these before you create a world

When a world binds to an engine, Iris pins the dimension type key, the exact `environment`, and the effective generated dimension type. The generated type contains the minimum Y, total height (`max - min`), `logicalHeight`, every `dimensionOptions` value after base-template resolution, and the `fullbright` ambient-light override. Hotload compares that contract before every pack reload and refuses a change. Close and reopen Studio after a contract edit in a running Studio world. On a production world, Minecraft stores the generated type in its registry. If you change the contract, recreate the world.

| Field | Why it is a contract |
|-------|----------------------|
| Dimension file name (load key) | Becomes the dimension type key `iris:<sanitized load key>`. If you rename the file, the world looks for a dimension type that no longer exists |
| `dimensionHeight` | Min Y and total height go into the Minecraft dimension type and into every stored mantle and chunk coordinate |
| `logicalHeight` | Written into the same dimension type |
| `environment` | Selects the vanilla dimension template and the Bukkit world environment. `NORMAL` and `CUSTOM` share an Overworld type template but remain distinct world environments |
| `dimensionOptions` | Overrides the generated type's portal scale, light, time, clouds, spawning limits, and gameplay flags |
| `fullbright` | Forces the generated type's effective ambient light to `1.0` |

Everything outside that registry contract reloads live in Studio and applies to newly generated chunks. That set includes regions, zooms, noise styles, image-map resources and bindings, palettes, ores, deposits, caves, structures, decoration, loot, and `worldBoundary`. Iterate on those freely. Already generated chunks keep the content they were built with. A boundary reload updates the native border but does not regenerate terrain. An edit from an inherited `dimensionOptions` value to the same explicit effective value does not change the contract.

## File location and load key

The load key is the path under `dimensions/` with `.json` removed. `dimensions/overworld.json` is key `overworld`. `dimensions/foo/bar.json` is key `foo/bar`. The world create and studio open commands take that key.

Iris also sanitizes the key into the dimension type key. It lowercases the key. It replaces path separators and any character outside `a-z0-9_-./` with `_`. Two dimensions whose keys sanitize to the same string collide on the same generated dimension type. Keep keys distinct in more than punctuation.

`/iris studio create name=mypack` writes `dimensions/mypack.json` with a matching `name`. Keep the file name and the load key stable once a world exists.

## Role in the pack graph

```
Dimension → regions[] → Region → land/sea/shore/cave biomes[] → Biome → generators[]
          → ores, deposits, depositVariants, overlayNoise
          → imageMaps[] → image-maps/<key>.json → images/<source>.png
          → caveProfile, carving[], structures[], importedStructures, importedFeatures
          → loot, entitySpawners, blockDrops
```

The dimension never names a biome directly, except in `focus` and carving entries. Biomes are reached through regions. An unreferenced region file is dead weight. A biome that is missing from every region list never generates.

## Engine mode

`mode.type` picks which stages the engine registers. This is the largest behavioral switch in the file. Three of the four modes register only a terrain pass and a biome pass. Caves, objects, decorations, deposits, and post-processing do not run in those modes. Do not pick `ISLANDS` or `ENCLOSURE` for a themed world. Today they generate exactly what `SUPERFLAT` does.

```json
{
  "mode": { "type": "OVERWORLD" }
}
```

| Type | Stages actually registered | Use it when |
|------|----------------------------|-------------|
| `OVERWORLD` | Biome, mantle matter generation, terrain, carve, post-process, floating child biome solids, deposits, matter insert, decoration, floating child biome decoration, perfection, custom modifiers | Any world that needs caves, objects, structures, decorations or entities. This is the only complete mode |
| `SUPERFLAT` | Terrain and biome only | Fast noise or biome-layout previews, or a genuinely bare world. Nothing else generates |
| `ENCLOSURE` | Terrain and biome only | Nothing yet. The nether-style ceiling and floor treatment is not implemented |
| `ISLANDS` | Terrain and biome only | Nothing yet. Floating-island terrain comes from biome `floatingChildBiomes` in `OVERWORLD` mode, not from this |

`mode` is marked required in the schema. Gson supplies a default `IrisDimensionMode` when the field is absent. An omitted `mode` runs `OVERWORLD`. The shipping overworld pack omits it. If the mode factory throws, the engine logs the failure once. It warns that it is falling back. It then builds `OVERWORLD` instead.

`IrisDimensionMode` is a snippet type (`dimension-mode`). `"mode": "snippet/dimension-mode/overworld"` is also valid.

## Vertical layout: height, sea level, bedrock

Iris generates internally from `0` to `dimensionHeight.max - dimensionHeight.min`. It then shifts the finished chunk down by `dimensionHeight.min` on output. Almost every Y number the engine handles internally is in that shifted space. The numbers you write in the dimension JSON are not all in the same space. That is the most common source of confusion in this file.

- `dimensionHeight.min` / `dimensionHeight.max` are **world Y**.
- `fluidHeight` is **world Y**. `IrisDimension.getFluidHeight()` returns `fluidHeight - dimensionHeight.min`. That is what the engine uses internally. Sea level ends up back at the world Y you wrote. The shipping overworld sets `fluidHeight` 50 with `min` -256. Its ocean surface is at world Y 50.
- `caveLavaHeight` is **internal Y**. World Y = `caveLavaHeight + dimensionHeight.min`. The default 8 with a min of -64 puts the cave lava ceiling at world Y -56.
- Bedrock is written at internal Y 0, which is world Y `dimensionHeight.min`.

Biome generator heights are relative to sea level. A biome generator entry with `min` 4 / `max` 10 produces terrain 4 to 10 blocks above `fluidHeight`. Iris clamps the result to the dimension height range.

```json
{
  "dimensionHeight": { "min": -64, "max": 320 },
  "logicalHeight": 384,
  "fluidHeight": 63,
  "bedrock": true,
  "caveLavaHeight": 8
}
```

That fragment is a vanilla-shaped world. The build floor is at -64. The ceiling is at 320. The sea is at 63. Bedrock is at -64. Cave lava is below -56.

Minecraft imposes hard rules on the generated dimension type. Iris fails when they are broken. Iris does not clamp them.

- `dimensionHeight.max - dimensionHeight.min` must be a multiple of 16, and between 16 and 4064.
- `dimensionHeight.min` must be a multiple of 16, and between -2032 and 2031.
- `logicalHeight` must be between 0 and the total height.

`/iris pack validate` checks all three rules and reports them as blocking errors before world creation or Studio open. Dimension-type compilation enforces the same contract again as a runtime safeguard.

| Field | Type | Default | What it does and when to change it |
|-------|------|---------|------------------------------------|
| `dimensionHeight` | `IrisRange` | `{ "min": -64, "max": 320 }` | The world build floor and ceiling in world Y. Raise `max` for tall mountain packs. Lower `min` for deep-cave packs. Contract field: pick it once per world |
| `logicalHeight` | int | `256` | The vanilla logical height of the generated dimension type. Gameplay teleports respect this ceiling (nether portal search, chorus fruit). Usually set it equal to the total height. Contract field |
| `fluidHeight` | int | `63` | World Y of the ocean surface. Every biome generator height is measured from this baseline. If you lower it, the same biome generators produce taller land. If you raise it, low biomes drown. Not a contract field. A change on a live world leaves a visible seam between old and new chunks |
| `bedrock` | boolean | `true` | Writes a bedrock layer at the build floor. Turn it off for void-bottom or stacked-dimension packs |
| `caveLavaHeight` | int | `8` | Internal Y at or below which carved cave space fills with lava instead of air. Raise it to flood deep caves. Set it to 0 for dry caves. Explicit fluid intent from a carver overrides this |
| `name` | string | `"A Dimension"` | Display name shown by commands and the studio scoreboard. Cosmetic |
| `version` | int | `1` | A stamp you control. Iris does not act on it. It exists so pack updates can be recognized. It also helps operators avoid a silent swap of incompatible pack generations under an existing world |

## Environment and dimension-type options

`environment` picks which vanilla dimension template Iris starts from when it generates this dimension type. `dimensionOptions` then overrides individual attributes of that template. Together they control sky, fog, ambient light, portal scale, whether beds work, whether raids can start, and the rest of the dimension-type surface. They do not change terrain. Pack-author recipes are in [35 - Vanilla Passthrough](/iris/35-vanilla-passthrough).

```json
{
  "environment": "NETHER",
  "dimensionOptions": {
    "ultrawarm": "TRUE",
    "skylight": "FALSE",
    "ceiling": "TRUE",
    "coordinateScale": 8,
    "ambientLight": 0.1
  }
}
```

| `environment` | Base template |
|---------------|---------------|
| `NORMAL` | Overworld |
| `NETHER` | Nether |
| `THE_END` | End |
| `CUSTOM` | Overworld. The enum value exists but resolves through the same default branch as `NORMAL` |

`fullbright` is a shortcut. When true, Iris copies `dimensionOptions` and forces `ambientLight` to `1.0` before it generates the type. On both supported Minecraft versions (26.1.2 and 26.2 share the same datapack fixer) a resolved ambient light of `1` also emits `minecraft:visual/ambient_light_color` `#ffffff`. A fullbright world reads as flat white, not merely bright.

Tri-state options are `DEFAULT`, `TRUE`, or `FALSE`. `DEFAULT` inherits from the base template. Numeric options use `-1` as "unset".

| `dimensionOptions` field | Default | Effect |
|--------------------------|---------|--------|
| `ultrawarm` | `DEFAULT` | Water evaporates, sponges dry, snow golems melt, lava spreads fast and thin, dripstone drips lava. Set `TRUE` for nether-like packs |
| `natural` | `DEFAULT` | When false, compasses spin and beds cannot set spawn or be slept in. When true, nether portals spawn zombified piglins and creaking hearts activate |
| `piglinSafe` | `DEFAULT` | When false, piglins and hoglins zombify here |
| `respawnAnchorWorks` | `DEFAULT` | When false, a respawn anchor explodes instead of setting spawn |
| `bedWorks` | `DEFAULT` | When false, beds explode instead of sleeping |
| `raids` | `DEFAULT` | Whether Bad Omen can start a raid here |
| `skylight` | `DEFAULT` | Whether the dimension receives sky light at all. `FALSE` makes a permanently dark world regardless of the terrain ceiling |
| `ceiling` | `DEFAULT` | Declares a logical bedrock ceiling to the client and to gameplay rules. Independent of whether terrain actually has a roof |
| `coordinateScale` | `-1` (unset) | Portal coordinate multiplier when travelling out of this dimension. `8` reproduces nether-style compression |
| `ambientLight` | `-1` (unset) | 0 to 1. Raises the light floor so caves are never fully black. A resolved `1` also forces white ambient light color |
| `fixedTime` | `-1` (unset) | Locks the time of day to this tick value. Leave unset for a normal day cycle |
| `cloudHeight` | `-1` (unset) | Y of the cloud layer, between -2032 and 2031. `null` disables clouds |
| `monsterSpawnBlockLightLimit` | `-1` (unset) | 0 to 15. Maximum block light at which hostile mobs may spawn |

## Regions and spatial layout

`regions` is the only mandatory content link in the file. Region selection happens first, per column. `regionStyle` picks the region. `continentalStyle` and `landChance` decide land versus sea inside it. Then the land, sea, shore, and cave biome styles pick a biome from that region's lists. The zoom fields scale the noise inputs. Higher zoom means larger, slower-changing features.

```json
{
  "regions": ["temperate", "frozen", "tropical"],
  "landChance": 0.69,
  "regionZoom": 16.15,
  "biomeZoom": 1.0,
  "coordFractureDistance": 20,
  "coordFractureZoom": 8,
  "dimensionAngleDeg": 12
}
```

Tune this group in Studio with a fixed seed. Compare the same coordinates between reloads. Every field here is safe to hotload.

| Field | Type | Default | What it does and when to change it |
|-------|------|---------|------------------------------------|
| `regions` | string[] | empty | The region load keys this dimension may place. Required. An empty list produces a world with no biomes to select. Add a region here after you create its file, or the file never generates |
| `landChance` | double | `0.625` | Fraction of continental noise that becomes land. Push toward 1.0 for a continental world. Push toward 0.0 for an archipelago or ocean world |
| `regionZoom` | double | `1` | Scales region cells. Small values give many small climate patches. The shipping overworld uses `16.15` for continent-sized climate bands |
| `landZoom` | double | `1` | Scales the land-biome selection space independently of regions. Raise it to make each land biome patch bigger without changing where regions sit |
| `seaZoom` | double | `1` | Same, for ocean biomes |
| `continentZoom` | double | `1` | Scales the land/sea mask. Raise it for fewer, larger continents |
| `biomeZoom` | double | `1` | Global multiplier over every biome selection stream. The quickest way to make all biomes uniformly bigger or smaller |
| `regionStyle` | `IrisGeneratorStyle` | `CELLULAR_IRIS_DOUBLE` | Noise style that shapes region borders. Change it when region edges look too regular or too noisy |
| `continentalStyle` | `IrisGeneratorStyle` | `CELLULAR_IRIS_DOUBLE` | Noise style for the land/sea mask. This is what coastlines look like |
| `landBiomeStyle` / `seaBiomeStyle` / `shoreBiomeStyle` / `caveBiomeStyle` | `IrisGeneratorStyle` | `CELLULAR_IRIS_DOUBLE` | Per-category biome border shapes. Cellular styles give patchwork borders. Simplex-family styles give organic blobs |
| `coordFractureDistance` | double | `20` | How far, in blocks, coordinate warping can displace a sample. This produces Iris characteristic swirls. Set to 0 for straight, unwarped borders |
| `coordFractureZoom` | double | `8` | Frequency of that warping. Lower values warp more rapidly and more violently. The shipping overworld uses `0.15` |
| `dimensionAngleDeg` | double | `0` | Rotates every input coordinate by this angle. Breaks up axis-aligned artifacts. Pick something off 45 and 90. The shipping overworld uses 69 |
| `focus` | string | `""` | Forces the whole world to one biome load key, in the **land** role. A sea biome under `focus` generates as land, so sea and shore structure eligibility never runs. Testing only. Remove before packaging |
| `focusRegion` | string | `""` | Forces the whole world to one region load key. Testing only. Remove before packaging |

## Rock, fluid, and overlay noise

`rockPalette` is the material the terrain column is filled with below the biome own surface layers. `fluidPalette` is what fills ocean columns and any cave aquifer that allows fluid. Both are full weighted palettes. "Stone" can be a blend of stone, andesite and tuff. "Water" can be lava, or a custom mod fluid.

```json
{
  "rockPalette": {
    "palette": [
      { "block": "minecraft:stone", "weight": 6 },
      { "block": "minecraft:andesite", "weight": 2 },
      { "block": "minecraft:tuff" }
    ]
  },
  "fluidPalette": { "palette": [{ "block": "minecraft:water" }] }
}
```

| Field | Type | Default | What it does and when to change it |
|-------|------|---------|------------------------------------|
| `rockPalette` | `IrisMaterialPalette` | `stone` | Subsurface fill for every column that a biome layer does not claim. Change it for a themed world (deepslate planet, sandstone desert world). Biomes and regions can override it locally |
| `fluidPalette` | `IrisMaterialPalette` | `water` | Blocks used for ocean columns and for cave aquifers that allow fluid. Set it to lava for a magma world |
| `overlayNoise` | `IrisShapedGeneratorStyle[]` | empty | Extra height noise summed on top of the interpolated biome height, everywhere, ignoring biome boundaries. Use it for a global roughness or a world-wide swell that must not follow biome edges |
| `rivers` | `IrisRiverNetwork` | disabled | Dimension-owned connected routing, incision, local water heads, river biome pools, and optional contained cave connections. See [36 - Rivers](/iris/36-rivers) |

## Ores and deposits

Iris has two independent ways to put ore in the ground. They behave differently.

**Ores** (`ores`) are noise-threshold generators. Iris evaluates them per block while it writes terrain. Each generator declares its own Y `range` and a `generateSurface` flag. Iris keeps two separate lists and only consults the matching one. A generator with `generateSurface: false` never appears in the exposed surface layer. Ores also exist at region and biome scope. All three scopes are consulted. Dimension is last.

**Deposits** (`deposits`) are blob placements written through the mantle. They are closer to vanilla ore veins. They have per-chunk counts and sizes.

**Deposit variants** (`depositVariants`) rewrite the block that any of the above would have placed inside a world-Y band. The shipping pack instead relies on automatic host-aware conversion. An ordinary ore becomes its deepslate form exactly when it replaces deepslate. Variants remain available for modded ores and deliberate substitutions.

```json
{
  "ores": [
    {
      "palette": { "palette": [{ "block": "minecraft:bedrock" }] },
      "chanceStyle": { "style": "FLAT" },
      "threshold": 1,
      "range": { "min": 0, "max": 0 }
    }
  ],
  "depositVariants": [
    {
      "minHeight": -64,
      "maxHeight": 0,
      "remap": { "minecraft:iron_ore": "minecraft:deepslate_iron_ore" }
    }
  ]
}
```

| Field | Type | Default | What it does and when to change it |
|-------|------|---------|------------------------------------|
| `ores` | `IrisOreGenerator[]` | empty | Noise-driven ore placement across the whole dimension. Each entry has a palette, a `chanceStyle`, a `threshold`, a Y `range`, and `generateSurface`. Use dimension scope for ores that must exist everywhere regardless of biome |
| `deposits` | `IrisDepositGenerator[]` | empty | Blob deposits with per-chunk min/max counts and blob sizes. The shipping pack uses these for granite, andesite, diorite, gravel and the classic ores |
| `depositVariants` | `IrisDepositVariant[]` | empty | Source-to-replacement block remaps inside a world-Y band, applied after biome and region rules. The first matching dimension rule wins. Source matching ignores block properties |
| `hideOresForHiddenOre` | boolean | `false` | Replaces every ore the generator would write with the surrounding base material. That includes terrain ores, deposits, and ores baked into objects. Turn it on only when a drop-control plugin such as HiddenOre supplies ores at break time instead |

## Caves and carving

Three fields at dimension scope decide whether caves exist and what they look like.

`caveProfile` is the 3D cave configuration. The same object exists on regions and biomes. The most specific enabled profile wins: dimension, then region, then surface biome, then cave biome. A dimension-level profile is the default cave system. A region can replace it wholesale for its own climate.

`carving` maps absolute world-Y bands to cave biomes. That is how the shipping pack puts a deep-dark biome between Y -250 and -175 without touching surface biome selection. Entries can nest through `children` for patchy sub-regions, bounded by `childRecursionDepth`.

`carvingEnabled: false` is implemented by adding the `CARVED` mantle flag to the disabled set. It is exactly equivalent to listing `CARVED` in `disabledComponents`.

```json
{
  "carvingEnabled": true,
  "caveProfile": { "enabled": true },
  "carving": [
    {
      "id": "global-deepdark-band",
      "enabled": true,
      "biome": "carving/standard-deepdark",
      "worldYRange": { "min": -250, "max": -175 }
    }
  ]
}
```

| Field | Type | Default | What it does and when to change it |
|-------|------|---------|------------------------------------|
| `carvingEnabled` | boolean | `true` | Master switch for carving. Setting it false disables the `CARVED` mantle component. No cave, canyon or carver output is written anywhere. Use it to isolate a terrain problem from a cave problem |
| `caveProfile` | `IrisCaveProfile` | disabled default object | The dimension default 3D cave system: density styles, vertical range, threshold, surface clearance. Regions and biomes override it when they enable their own. Full field reference in [15 - Caves & Carving](/iris/15-caves-carving) |
| `carving` | `IrisDimensionCarvingEntry[]` | empty | Cave-biome overrides keyed to absolute world-Y bands. Each has a stable `id`, a `biome`, a `worldYRange`, optional `children`, `childStyle`, `childShrinkFactor`, and `childRecursionDepth`. Use it for depth-banded cave themes such as a deep dark layer |
| `useMantle` | boolean | `true` | Disables the entire mantle when false. No objects, jigsaw structures, features, entities or deferred block updates. Terrain and decoration still run. Only useful for isolating mantle cost or debugging |
| `disabledComponents` | mantle flag strings | empty | Turns off individual mantle components by flag. The registered generation components include `OBJECT`, `JIGSAW`, `CARVED`, `RIVER_HYDROLOGY`, and `FLOATING_OBJECT`. Cheaper than `useMantle: false` when you only need to silence one subsystem |

## Objects, decoration, and post-processing

These fields gate the passes that run after terrain and carving. All of them hotload.

```json
{
  "decorate": true,
  "postProcessing": true,
  "postProcessingSlabs": true,
  "postProcessingWalls": true,
  "requireObjectSurfaceSupport": true,
  "objectSurfaceSupportBuffer": 2,
  "preventLeafDecay": false
}
```

| Field | Type | Default | What it does and when to change it |
|-------|------|---------|------------------------------------|
| `decorate` | boolean | `true` | Runs the decorator pass (grass, flowers, seafloor clutter, ceiling growths). Turn it off to look at bare terrain shape |
| `postProcessing` | boolean | `true` | Master switch for the post pass that smooths block-level artifacts |
| `postProcessingSlabs` | boolean | `true` | Lets the post pass place slabs to soften one-block terrain steps |
| `postProcessingWalls` | boolean | `true` | Lets the post pass paint wall blocks against exposed faces |
| `requireObjectSurfaceSupport` | boolean | `true` | Refuses to place surface objects and trees that would hang over a carved opening. If you turn it off, floating buildings appear above caves. The per-placement flag can only opt out further. It never overrides this on |
| `objectSurfaceSupportBuffer` | int | `2` | Minimum solid blocks required beneath a surface placement, 0 to 16. The effective value is the larger of this and the placement own buffer. Raising it hardens every placement in the dimension at once |
| `preventLeafDecay` | boolean | `false` | Marks generated leaves persistent so they never decay when the supporting log is removed. Turn it on for packs whose custom trees have unusual leaf-to-log distances |
| `treeSettings` | `IrisTreeSettings` | disabled default | Overrides vanilla sapling growth with pack objects. Off until `enabled` is true. Recipe in [35 - Vanilla Passthrough](/iris/35-vanilla-passthrough). Fields in [17 - Trees, Fungi, Coral, Crystals, Formations, Ruins](/iris/17-trees-fungi-coral-crystals-formations-ruins) |

## Structures and datapacks

Dimension-level `structures` entries are Iris placements considered everywhere in the dimension. They are independent of any biome or region placement. `importedStructures` and `importedFeatures` control what vanilla, mod, and ingested-datapack content is allowed to generate on top of Iris terrain.

`anchor` is what makes a placement vertical contract explicit. `LEGACY` preserves the historical `underground` boolean. The named anchors do not depend on it. Cave anchors read Iris carved-space data. They apply only to editable `structures`. They never apply to the `nativeStructures` backend.

```json
{
  "structures": [
    {
      "placementId": "ancient-city-native",
      "nativeStructures": [{ "structure": "minecraft:ancient_city" }],
      "nativeSuppression": "REPLACE_SOURCE",
      "minHeight": -220,
      "maxHeight": -220
    }
  ],
  "importedStructures": {
    "datapackOverrides": true,
    "disabled": [],
    "adjustments": [
      { "match": ["minecraft:mineshaft"], "preserveSourceY": true }
    ]
  }
}
```

| Field | Type | Default | What it does and when to change it |
|-------|------|---------|------------------------------------|
| `structures` | `IrisStructurePlacement[]` | empty | Iris structure placements at dimension scope. Use this for content that must exist regardless of biome, such as a global stronghold analogue or a native structure you are re-anchoring |
| `importedStructures` | `IrisImportedStructureControl` | default | Allow/deny and Y-adjustment rules for every registered native structure. Every registered structure generates by default. Deny families with `disabled`, one complete key with `disabledExact`. `adjustments` can shift, band, encase, or stilt a structure into Iris terrain. Recipes in [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks) |
| `importedFeatures` | `IrisImportedFeatureControl` | disabled | Off by default. If you leave it out, Iris generates exactly the terrain it always has. Setting `enabled` true runs the vanilla placed-feature decoration pass (ores, trees, plants, springs, geodes, snow layers) over Iris terrain. Filter by `disabled` keys, `steps`, and `disabledSteps`. Carvers are never imported. Recipe in [35 - Vanilla Passthrough](/iris/35-vanilla-passthrough) |
| `datapackImports` | string[] | empty | External datapack URLs this dimension owns. Their structure sets and definitions generate and locate only in dimensions that declare the same source. Replacing native generation still requires a placement with `nativeSuppression: REPLACE_SOURCE`. Declaring the source alone never disables anything |

Anchor values for editable placements: `LEGACY`, `SURFACE`, `HEIGHT_BAND`, `CAVE_FLOOR`, `CAVE_CEILING`, `CAVE_CENTER`, `CAVE_ANY`. Details in [18 - Structures Overview](/iris/18-structures-overview), [21 - Jigsaw Structures](/iris/21-jigsaw-structures), and [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks).

## Upper dimension (inverted ceiling terrain)

Set `upperDimension` to another dimension load key (or this dimension own key). Iris generates that dimension terrain upside-down against the world ceiling, nether-style. `"none"` or an empty string disables it. The shipping overworld ships with `""`.

```json
{
  "upperDimension": "overworld",
  "upperDimensionGap": 32,
  "upperDimensionCarving": false,
  "upperDimensionObjects": false
}
```

If the referenced key cannot be loaded, Iris warns and skips upper terrain. It does not fail the world.

| Field | Type | Default | What it does and when to change it |
|-------|------|---------|------------------------------------|
| `upperDimension` | string | `"none"` | Load key of the dimension whose terrain becomes the ceiling. Self-reference is allowed and produces a mirrored world |
| `upperDimensionGap` | int | `32` | Minimum air blocks kept between the lower surface and the upper surface, 0 to 256. Raise it if the two halves close up in high terrain |
| `upperDimensionCarving` | boolean | `false` | Lets cave carving cut through the ceiling mass. False leaves it solid |
| `upperDimensionObjects` | boolean | `false` | Lets mantle objects place in the upper zone. False protects the ceiling from trees and structures |
| `upperObjectsForcePlace` | boolean | `false` | Upper objects ignore slope, underwater, clamp, collision, and carving restrictions. Lower-dimension objects always place first. If you enable this, upper objects can clip through them |

## Loot, spawners, and block drops

These are dimension-wide fallbacks. Regions and biomes layer on top of them.

```json
{
  "loot": { "mode": "FALLBACK", "tables": ["global-clutter"] },
  "entitySpawners": ["swamp/passive"],
  "blockDrops": []
}
```

| Field | Type | Default | What it does and when to change it |
|-------|------|---------|------------------------------------|
| `loot` | `IrisLootReference` | empty, mode `ADD`, multiplier `1` | Loot tables applied to containers generated anywhere in the dimension. `ADD` stacks this scope tables onto the parent list. `CLEAR` and `REPLACE` both drop the parent tables first. `FALLBACK` supplies tables only when the object itself declared none. `multiplier` scales item counts 0 to 16. Use dimension scope for global clutter. Use region scope for climate flavor |
| `entitySpawners` | string[] | empty | `IrisSpawner` load keys that continually replenish mobs like vanilla does. Dimension scope means "everywhere in this world" |
| `blockDrops` | `IrisBlockDrops[]` | empty | Custom drop overrides for specific blocks in this dimension |

## Image maps

`imageMaps` is a typed list of named bindings. Each entry has a unique `key`, references one reusable resource under `image-maps/` through `map`, selects an `application`, and may compose named mask bindings in order.

```json
{
  "imageMaps": [
    { "key": "land", "map": "masks/land", "application": "MASK" },
    {
      "key": "terrain-height",
      "map": "terrain/height",
      "application": "TERRAIN_HEIGHT",
      "masks": [{ "map": "land", "operation": "MULTIPLY" }]
    }
  ]
}
```

Applications are `TERRAIN_HEIGHT`, `BIOME`, `REGION`, `SURFACE_BLOCK`, `MASK`, and `CUSTOM`. A mask reference names another binding key in this same list, and that binding must use `MASK`. Missing resources, duplicate keys, incompatible map types, invalid targets, and cyclic or non-mask references are blocking validation errors.

Generator styles reference the first-class `image-maps` resource key directly through `imageMap`; the resource is not embedded in the style. The source PNG remains under `images/`. Read [37 - Image Map Concepts](/iris/37-image-map-concepts) before authoring and use [43 - Image Map Configuration & Coordinates](/iris/43-image-map-config-coordinates) for every field and coordinate rule.

## World boundary

`worldBoundary` configures Minecraft's native world border for worlds using this dimension:

```json
{
  "worldBoundary": {
    "center": { "x": 0, "z": 0 },
    "size": 16384,
    "warningDistance": 16,
    "damageBuffer": 5,
    "damageAmount": 0.2
  }
}
```

`size` is the full diameter. Iris applies the boundary at initialization and after a successful reload on the platform's correct scheduling context. Omitting `worldBoundary` leaves the world's current native border unchanged, including operator changes or a boundary applied by an earlier pack revision.

The border does not crop, clamp, or repeat an image map. Configure the map's `outOfBounds` rule separately. Image Map Studio and Vision display the border over source coverage. Complete limits and extent calculations are in [43 - Image Map Configuration & Coordinates](/iris/43-image-map-config-coordinates).

## Studio and debug fields

These exist to help you look at the generator, not to ship. `studioMode` is applied only by the Bukkit chunk generator. On Fabric, Forge and NeoForge the field is ignored.

| Field | Type | Default | What it does and when to change it |
|-------|------|---------|------------------------------------|
| `studioMode` | `StudioMode` | `NORMAL` | Swaps in a debug generator. `BIOME_BUFFET_1x1`, `_3x3`, `_5x5`, `_9x9`, `_18x18`, `_36x36` lay every biome out in a grid of that cell size. `OBJECT_BUFFET` lays out objects. `REGION_BUFFET` currently installs no generator and behaves exactly like `NORMAL`. Remove before packaging |
| `debugChunkCrossSections` | boolean | `false` | Deletes whole chunks on a grid so you can walk up and read the terrain column like a diagram |
| `debugCrossSectionsMod` | int | `3` | The X/Z modulus that decides which chunks get cut, 2 to 16. Larger values cut fewer chunks |
| `explodeBiomePalettes` | boolean | `false` | Inserts air gaps between palette layers so you can count and identify them visually |
| `explodeBiomePaletteSize` | int | `3` | Size of those gaps, 1 to 16 |
| `debugSmartBore` | boolean | `false` | Fills the air volume objects carve for themselves with cobweb, making object footprints visible |

## Annotations are editor hints, not runtime validation

`@Required`, `@MinNumber`, and `@MaxNumber` do not enforce themselves at load time. A subsystem needs an explicit validator. Dimension-type constraints, `worldBoundary`, rivers, and image maps have runtime validators and fail before generation when their enforced contract is invalid. For other fields, treat the ranges in the tables above as design guidance backed by editor warnings and verify unusual values in Studio.

## A complete minimal dimension

```json
{
  "name": "mypack",
  "version": 1,
  "mode": { "type": "OVERWORLD" },
  "regions": ["starter"],
  "environment": "NORMAL",
  "dimensionHeight": { "min": -64, "max": 320 },
  "logicalHeight": 384,
  "fluidHeight": 63
}
```

This is the studio starter with `mode`, `environment` and `fluidHeight` written out. It needs `regions/starter.json`, a biome, and a generator to actually produce terrain. The four-file walkthrough is in [26 - Example - Minimal Dimension](/iris/26-example-minimal-dimension).

## What the shipping overworld sets

Path: `packs/overworld/dimensions/overworld.json` under the platform data directory. The same file ships in the Fabric, Forge and NeoForge run configs.

| Field | Overworld value | Why it is interesting |
|-------|-----------------|-----------------------|
| `name` / `version` | `"Overworld"` / `4000` | Large version stamp so pack generations are distinguishable |
| `environment` | `"NORMAL"` | Overworld base template |
| `dimensionHeight` | `{ "min": -256, "max": 512 }` | 768 blocks tall, both bounds multiples of 16 |
| `logicalHeight` | `512` | Below the 768 total, so it is a legal contract |
| `fluidHeight` | `50` | Sea level at world Y 50, well below the vanilla 63. Biome generator values are measured from here |
| `landChance` | `0.69` | Land-heavy world |
| `regionZoom` | `16.15` | Continent-sized climate regions |
| `coordFractureZoom` | `0.15` | Aggressive coordinate warping. This is where the swirl comes from |
| `dimensionAngleDeg` | `69` | Off-axis rotation to break up straight borders |
| `regions` | `frozen`, `hot`, `terralost`, `mushroom`, `forests`, `tundra`, `magnetics`, `temperate`, `estranged`, `tropical`, `swamp`, `prismatics` | Twelve climate regions |
| `mode` | omitted | Runs `OVERWORLD` by default |
| `preventLeafDecay` | `true` | Custom trees keep their canopies |
| `caveProfile` | `enabled: true` | 3D caves on by default, overridden per region |
| `carving` | one deep-dark band, world Y -250 to -175 | Depth-banded cave biome |
| `ores` / `deposits` / `depositVariants` | 11 / 23 / 0 | Bedrock and stone bands plus Minecraft 26.2 ore shapes. Height providers and biome exceptions are normalized from the vanilla 384-block span into this dimension 768-block span. Attempt counts are twice vanilla. Host-aware automatic deepslate conversion applies |
| `importedStructures` | adjustments for stronghold, trial chambers, mineshaft, village | Native structures re-fitted to Iris terrain |
| `structures` | ancient city with `nativeSuppression: REPLACE_SOURCE` | Vanilla placement replaced by an Iris-anchored one |

## Build a dimension, step by step

1. Create the pack. `/iris studio create name=mypack` on Bukkit writes a four-file starter skeleton. `/iris studio create mypack` on a mod loader copies the `example` template instead. Either way you get a loadable pack to edit.
2. Open `dimensions/mypack.json`. Set the contract fields deliberately: `dimensionHeight`, `logicalHeight`, `environment`, `dimensionOptions`, and `fullbright`. Set terrain fields such as `fluidHeight` and `mode.type` for the world you want. Check the multiple-of-16 rules now, not after the world exists.
3. Make sure every key in `regions` has a file under `regions/`. That region must have at least one land biome with at least one generator ([12 - Regions](/iris/12-regions), [13 - Biomes](/iris/13-biomes)).
4. Validate. Use `/iris pack validate pack=mypack` on Bukkit. Use `/iris pack validate mypack` on modded. Fix blocking errors before you open Studio. Studio refuses to open a pack whose validation is not loadable.
5. Open Studio on a fixed seed. Use `/iris studio open mypack seed=1337` on Bukkit. Use `/iris studio open mypack 1337` on modded.
6. Walk into fresh chunks and check the baseline. Confirm solid terrain and the build floor where you put it. Confirm fluid at the right Y. Confirm the expected biome from `/iris what biome`. Confirm no unresolved-key errors in the console. Fix this before you touch noise.
7. Isolate while you tune. Set `"focusRegion": "starter"` or `"focus": "starter"`. Save. Generate a new area. Remove both before packaging.
8. Tune land/sea and zoom. Then add subsystems one at a time: caves, then ores and deposits, then objects, then structures. Validate after each new resource edge so a broken key is attributable.
9. Close and reopen Studio after you edit `dimensionHeight`, `logicalHeight`, `environment`, `dimensionOptions`, `fullbright`, or the dimension file name in a way that changes the effective contract. Hotload rejects those changes by design.
10. Create the production world only after Studio is clean: `/iris create name=mypack-test type=mypack seed=1337`. Recreate the world rather than edit its height contract later.

The baseline passes when Studio opens clean. Validation must report no blocking errors. The same seed must reproduce the same terrain after a close and reopen.

## Common author mistakes

| Mistake | What actually happens |
|---------|-----------------------|
| Empty or unresolvable `regions` | No biome can be selected, so the dimension has nothing to place |
| Region file exists but is not listed in `regions` | It never generates. Nothing warns you |
| Treating `fluidHeight` as an offset from the build floor | It is world Y. The engine converts it to internal Y by subtracting `dimensionHeight.min` |
| `dimensionHeight` span or `min` not a multiple of 16 | Blocked by `pack validate` (the same bounds the dimension-type compiler enforces) |
| `logicalHeight` greater than `max - min` | Rejected when the dimension type is constructed |
| Editing height, logical height, environment, effective dimension options, `fullbright`, or the dimension file name mid-Studio | Hotload is refused by the runtime contract. Close and reopen |
| Treating `worldBoundary.size` as a radius | It is Minecraft's full border diameter. Each edge is half the size from the center |
| Expecting `worldBoundary` to crop an image | Border and image coverage are separate. Set the image map `outOfBounds` policy |
| Embedding image-map settings inside a generator style | `imageMap` is a first-class resource key under `image-maps/` |
| Expecting decoration or caves from `SUPERFLAT`, `ENCLOSURE`, or `ISLANDS` | Those modes register only terrain and biome stages |
| Leaving `focus` or `focusRegion` set when packaging | The shipped pack generates exactly one biome or region |
| Changing pack files and expecting an existing world to change | Production worlds run from `<world>/iris/pack/`. See [27 - Example - Configuring Overworld](/iris/27-example-configuring-overworld) |
