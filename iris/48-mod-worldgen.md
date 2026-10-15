---
title: "Mod Worldgen"
description: "Use mod biomes, features, structures, dimension types, and dimensions with Iris on Fabric, Forge, and NeoForge"
published: true
date: 2026-10-15T01:53:36.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-10-15T01:53:36.000Z
---
On Fabric, Forge, and NeoForge, Iris packs can present mod biomes, run mod features and structures over Iris terrain, and generate a mod's own dimension. The worldgen catalog lists what the loaded mods register, mod ingest builds a pack that adopts that content, and a dimension takeover hands an existing dimension to an Iris pack. The catalog, mod ingest, borrowed dimension types, and takeovers are not available on Bukkit-family servers.

## Pick a task

| Goal | Go to |
|---|---|
| Find the biome, feature, structure, and dimension keys a mod registers | [Read the worldgen catalog](#read-the-worldgen-catalog) |
| Present a mod biome from a pack biome you write | [Adopt a mod biome](#adopt-a-mod-biome) |
| Build a pack that places every mod biome and converts mod ores and plants | [Build a pack with mod ingest](#build-a-pack-with-mod-ingest) |
| Keep a mod dimension's sky, fog, and lighting | [Borrow a dimension type](#borrow-a-dimension-type) |
| Generate an existing mod dimension with an Iris pack | [Take over a dimension](#take-over-a-dimension) |

## How mod worldgen reaches Iris terrain

Iris always picks biomes from the pack. Mod content enters through these controls:

| Mod content | Control |
|---|---|
| Biomes | A pack biome whose `derivative` names the mod biome |
| Placed features: ores, trees, plants | `importedFeatures`, off by default. See [35 - Vanilla Passthrough](/iris/35-vanilla-passthrough) |
| Structures | Generate by default in biomes that present as an eligible biome. Deny them with `importedStructures`. See [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks) |
| Dimension types | Dimension `borrowedDimensionType` |
| Dimensions | `/iris world takeover` or `modded.json` `dimensionTakeovers` |
| Carvers and surface rules | Never used. The pack supplies caves and surfaces |

## Read the worldgen catalog

Iris captures the catalog each time the server starts. It records every registered biome, placed feature, structure, dimension type, and level stem, including vanilla entries, and writes them to `config/irisworldgen/catalog/worldgen-catalog.json`. Use it to find the exact keys for `derivative`, `importedFeatures`, `importedStructures`, `borrowedDimensionType`, and takeovers.

| Command | Shows |
|---|---|
| `/iris catalog` | Totals, then one line per namespace with worldgen content: version, biomes, placed features with their three most common feature types, structures, dimension types, and level stems. Loaded mods without worldgen content are counted on one line |
| `/iris catalog <namespace>` | Up to 24 keys per category for one namespace. Placed features are grouped by feature type |
| `/iris catalog refresh` | Captures the catalog again and reports the duration and file path |

These commands require gamemaster level. If Iris reports that no catalog has been captured, run `/iris catalog refresh`.

The file holds the full detail for every entry:

| Section | Fields |
|---|---|
| `namespaces` | `namespace`, `displayName`, `version` |
| `biomes` | `key`, `temperature`, `downfall`, `hasPrecipitation`, `tags`, `featureSteps` (placed feature keys per decoration step), `spawns`, `definition` |
| `placedFeatures` | `key`, `configuredFeature`, `featureType`, `config`, `placement` |
| `structures` | `key`, `type`, `step`, `terrainAdaptation`, `biomeTag`, `biomes`, `structureSets` |
| `dimensionTypes` | `key`, `minY`, `height`, `logicalHeight`, `definition` |
| `levelStems` | `key`, `dimensionType`, `generatorType`, `biomeSourceType`, `generator` |

A level stem is a dimension. Its `dimensionType` names the type that dimension uses, and that type's `minY` and `height` give the range a borrowing pack must fit.

## Adopt a mod biome

Set a pack biome's `derivative` to the mod biome key. The biome then presents as the mod biome: grass and water tint, sounds, mob spawns, and biome tags. Mod structures that target that biome become eligible there, and with `importedFeatures` enabled the mod biome's placed features run there.

```json
{
  "name": "Amber Forest",
  "derivative": "examplemod:amber_forest"
}
```

Add the biome to a region's `landBiomes`, `seaBiomes`, `shoreBiomes`, or `caveBiomes` like any other biome. Terrain, layers, and Iris decoration still come from the biome file. See [13 - Biomes](/iris/13-biomes).

To grow the mod's trees and plants only in its own biomes, enable feature passthrough, deny vanilla features, and deny the mod's features in vanilla biomes:

```json
{
  "importedFeatures": {
    "enabled": true,
    "disabled": ["minecraft:"],
    "biomeRules": [
      { "biomes": ["minecraft:"], "disabled": ["examplemod:"] }
    ]
  }
}
```

`"minecraft:"` in `disabled` turns off vanilla ores and plants everywhere, so the pack's own deposits and decorators stay in charge. The rule leaves `examplemod` features running only in biomes outside the `minecraft` namespace. Field reference: [35 - Vanilla Passthrough](/iris/35-vanilla-passthrough).

## Build a pack with mod ingest

Mod ingest copies an installed pack into a new pack and adds the worldgen of loaded mods to the copy. It uses the catalog captured by the running server and never changes the source pack.

```none
/iris ingest mods <source> <target> [dimension=<key>] [namespaces=<a,b>] [excludeRegions=<a,b>] [replace=true]
```

| Argument | Default | Use |
|---|---|---|
| `<source>` | Required | Installed pack to copy |
| `<target>` | Required | New pack name. Letters, digits, `_`, and `-` only, and different from the source |
| `dimension=` | The source pack name | Dimension file in the source pack to copy. The copied dimension takes the target name |
| `namespaces=` | Every catalog namespace that is not reserved | Comma-separated mod namespaces to ingest |
| `excludeRegions=` | None | Comma-separated regions of the dimension that receive no mod biomes |
| `replace=true` | `false` | Rebuild a target that an earlier ingest wrote |

Options may appear in any order after the two pack names. Ingest runs in the background and requires gamemaster level. `minecraft`, `c`, `iris`, `irisworldgen`, and the dimension keys of installed packs are reserved, unless a loaded mod uses the same namespace.

### What the target pack contains

| Mod content | Result in the target pack |
|---|---|
| Biomes | Each mod biome becomes `biomes/ingest/<namespace>/<path>.json` with `derivative` set to the mod biome, and joins one region's `landBiomes`, `seaBiomes`, `shoreBiomes`, or `caveBiomes` |
| Ores (`minecraft:ore`, `minecraft:scattered_ore` features) | Converted to Iris `deposits`. An ore that only mod biomes declare goes on those biomes. An ore that a mod adds to vanilla biomes goes on the dimension, limited to the biomes that declare it |
| Simple block patches (`minecraft:simple_block`, `minecraft:random_patch`, `minecraft:flower`, `minecraft:no_bonemeal_flower` features) | Converted to Iris `decorators` on the adopted biomes and on existing pack biomes whose `derivative` declares the patch |
| Other placed features | Generate natively through `importedFeatures`. Tree features that a mod adds to vanilla biomes the pack uses are denied in `minecraft:` biomes with a `biomeRules` entry, so they grow in mod biomes without doubling the pack's own trees |
| Structures | No file changes. Mod structures generate natively in their biomes unless the dimension's `importedStructures` denies them |

Ingest classifies each mod biome by its biome tags. Ocean biomes go to `seaBiomes`, beaches to `shoreBiomes`, cave and underground biomes to `caveBiomes`, and the rest to `landBiomes`. It copies the existing pack biome in the same role that best matches the mod biome's temperature, downfall, and tags, then sets `derivative` and removes `customDerivitives`, `vanillaDerivative`, `biomeScatter`, `biomeSkyScatter`, and `children` from the copy. Regions much rarer than the rest of the dimension are used only when they fit clearly better. When the mod biome declares vegetation of its own, the copy also drops its `objects` and procedural trees so the mod's trees replace them.

Ingest skips river biomes, because Iris hydrology owns rivers. It also skips biomes that are not tagged for the copied dimension's `environment`, such as a biome without `minecraft:is_overworld` in a `NORMAL` dimension, and biomes no region can accept.

The copied dimension's `importedFeatures` is updated:

- `enabled` is set to `true`.
- If the source pack left `importedFeatures` off, `disabled` gains `minecraft:` and `<namespace>:` for every mod with placed features that was not ingested. A source that already enabled it keeps its own `disabled` list.
- `disabledExact` gains every converted ore and patch, so they do not also generate natively.
- `biomeRules` gains the tree denial described above.
- `steps` and `disabledSteps` are kept.

### Read the result

Chat shows one line for the pack and one line per ingested namespace:

```none
pack <target>: <n> generated files, <n> modified files
<namespace>: <n> native, <n> adopted, <n> passthrough, <n> skipped
```

`ingest/manifest.json` in the target records the run:

| Field | Content |
|---|---|
| `catalogFingerprint`, `catalogCapturedAt`, `minecraftVersion`, `platform` | The catalog the ingest used |
| `sourceDimension`, `dimension` | Source dimension key and target dimension key |
| `namespaces` | Ingested namespaces that produced items |
| `generatedFiles`, `modifiedFiles` | Pack files the ingest created or changed |
| `items` | One entry per mod biome, feature, and structure: `namespace`, `sourceKey`, `kind`, `tier`, `target`, `reason` |

| `tier` | Meaning |
|---|---|
| `NATIVE` | Converted to Iris deposits or decorators |
| `ADOPTED` | A biome placed in a region, or a structure that generates in its biomes |
| `PASSTHROUGH` | A placed feature that generates natively through `importedFeatures` |
| `SKIPPED` | Not used. `reason` says why |

### Target and replace rules

- The target is built in a temporary folder and appears only when the ingest succeeds.
- An existing target is refused. Add `replace=true` to rebuild it. Replace works only on a pack that contains `ingest/manifest.json`.
- The source cannot be a pack that ingest wrote. Ingest again from the original pack.
- `excludeRegions` must name regions that the copied dimension lists.

> `replace=true` rebuilds the whole target from the source and discards every edit made inside the target. Make lasting changes in the source pack.
{.is-warning}

### Create a world from the target

Restart so the new pack loads, then validate it and create a dimension:

```none
/iris pack validate <target>
/iris world enable irisworldgen:<name> <target> [seed]
```

After adding, removing, or updating mods, restart so the catalog is captured again, then repeat the ingest with `replace=true`. Existing worlds keep their saved pack until you stage `/iris world update`. See [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle).

### Ingest example

A server runs a mod with the namespace `examplemod`. It adds the biome `examplemod:amber_forest`, the ore `examplemod:ore_amber`, the flower patch `examplemod:patch_amber_bloom`, and the tree feature `examplemod:trees_amber`, which it also adds to vanilla forests.

1. Check what the mod registers:

```none
/iris catalog examplemod
```

2. Build a copy of the bundled Overworld pack that adopts only that mod:

```none
/iris ingest mods overworld overworld-examplemod namespaces=examplemod
```

3. Restart, then validate and create the dimension:

```none
/iris pack validate overworld-examplemod
/iris world enable irisworldgen:amberlands overworld-examplemod 1337
```

The target pack places `biomes/ingest/examplemod/amber_forest.json` in the region whose biomes best match its climate. The amber ore becomes a deposit. The flower patch becomes a decorator on the amber forest and on any pack biome whose `derivative` declares it. Amber trees grow in the amber forest but not in the pack's vanilla forests. The dimension file contains:

```json
{
  "importedFeatures": {
    "enabled": true,
    "disabled": ["minecraft:"],
    "disabledExact": ["examplemod:ore_amber", "examplemod:patch_amber_bloom"],
    "biomeRules": [
      { "biomes": ["minecraft:"], "disabledExact": ["examplemod:trees_amber"] }
    ]
  }
}
```

If other loaded mods register placed features, `disabled` also lists their namespaces.

## Borrow a dimension type

Set the dimension's `borrowedDimensionType` to a registered dimension type, such as a mod's, to use its sky, fog, lighting, and other dimension-type settings instead of a type Iris generates. `dimensionHeight.min` must equal the type's `minY`, and `dimensionHeight.max` must not exceed `minY + height`. Read both values from the catalog's `dimensionTypes`. Rules and examples: [11 - Dimensions](/iris/11-dimensions#borrow-an-existing-dimension-type).

## Take over a dimension

A takeover makes an existing dimension, such as one a mod adds, generate from an Iris pack after the next restart. Takeovers apply on dedicated servers only. Use `/iris world enable` instead to add a new Iris dimension.

```none
/iris world takeover <dimension> <pack|pack:dimensionKey>
/iris world takeover <dimension> off
```

The command checks that the pack is installed and loads, stores the entry in `modded.json`, and reports that a restart is required. `off` removes the entry, and the dimension's own generator returns on the next restart. Both forms require gamemaster level. You can also edit `config/irisworldgen/modded.json` and restart:

```json
{
  "dimensionTakeovers": {
    "examplemod:skylands": "skylands"
  }
}
```

Each key is the dimension's full `namespace:path`. Each value is `pack` or `pack:dimensionKey`; pack names and dimension keys are case-sensitive. The dimension uses the pack's `borrowedDimensionType` when it sets one, otherwise the dimension type Iris generates for the pack. Borrow the dimension's own type to keep its sky, fog, and lighting.

> When a takeover is added, changed, or removed, the next start moves that dimension's `region`, `entities`, and `poi` folders, its Iris Mantle data, and its Iris generation history to `config/irisworldgen/takeover-recovery-<id>/`. The dimension then regenerates. Player data stays in the save. Back up the complete save first, and keep the recovery folder until you have checked the result.
{.is-warning}

If the dimension already holds Iris generation history from the configured pack and dimension, Iris records the takeover and keeps the data. A takeover configured before the world exists applies to the new world. Iris records applied takeovers in `<world>/data/irisworldgen/dimension-takeovers.json`; include it in world backups.

Keep every takeover entry valid and its pack installed:

- If a `dimensionTakeovers` entry cannot be read while the world records applied takeovers, the server refuses to start. Iris never treats an unreadable entry as removed, and Iris commands do not rewrite `modded.json` until the entry is fixed.
- If an applied takeover is changed to a pack or dimension that is not installed, the server refuses to start before moving any data. Install the pack or restore the previous entry.
- If the pack of a dimension with an applied takeover or Iris generation history is missing or fails validation, and the dimension has no saved Iris pack, the server refuses to start. Restore the pack or remove the entry.
- A new takeover whose pack is missing or fails validation is skipped with a logged error. The dimension keeps its own generator until the pack is installed.
- If a dimension does not generate from its configured pack after startup, the takeover stays unapplied and Iris logs a warning. If Iris cannot record applied takeovers, it stops the server.

### Takeover example

A mod with the namespace `examplemod` adds the dimension `examplemod:skylands`. The catalog shows that its dimension type `examplemod:skylands` has `minY` 0 and `height` 256.

1. In an installed pack named `skylands`, set `dimensions/skylands.json` to borrow that type and fit its range:

```json
{
  "borrowedDimensionType": "examplemod:skylands",
  "dimensionHeight": { "min": 0, "max": 256 }
}
```

2. Restart so the pack loads, then validate it:

```none
/iris pack validate skylands
```

3. Back up the save, then stage the takeover:

```none
/iris world takeover examplemod:skylands skylands
```

4. Restart. The previous Skylands terrain moves to the recovery folder, and the dimension regenerates from the `skylands` pack under the mod's sky and fog.

To return the dimension to the mod's generator, run `/iris world takeover examplemod:skylands off` and restart. The Iris terrain then moves to a recovery folder in the same way.

## Related

- [01 - Installation & Platforms](/iris/01-installation-platforms)
- [03 - Configuration](/iris/03-configuration)
- [04 - Commands & Permissions](/iris/04-commands-permissions)
- [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle)
- [11 - Dimensions](/iris/11-dimensions)
- [12 - Regions](/iris/12-regions)
- [13 - Biomes](/iris/13-biomes)
- [16 - Surfaces, Decorators & Deposits](/iris/16-surfaces-decorators-deposits)
- [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks)
- [30 - Platform Differences](/iris/30-platform-differences)
- [35 - Vanilla Passthrough](/iris/35-vanilla-passthrough)
