---
title: "Snippets"
description: "Reuse palettes, decorators, noise styles, and other JSON definitions across an Iris pack."
published: true
date: 2026-09-23T11:12:42.385Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Snippets let you reuse nested JSON values by referencing files under `snippet/<type>/`. Supported fields accept an inline object or a snippet path.

Related:

- [05 - Concepts & Pack Layout](/iris/05-concepts-pack-layout)
- [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas)
- [11 - Dimensions](/iris/11-dimensions)
- [12 - Regions](/iris/12-regions)
- [13 - Biomes](/iris/13-biomes)
- [14 - Generators & Noise](/iris/14-generators-noise)
- [20 - Object Placement](/iris/20-object-placement)
- [25 - Pack Management](/iris/25-pack-management)
- [47 - Volumetric Terrain](/iris/47-volumetric-terrain)

## Reusing a definition

A decorator, noise style, or palette used in several places can live in one snippet file. Each reference uses the same definition, so you only need to edit it once.

Use Studio hotload to apply edits to new chunks while authoring. Production worlds require the [pack update workflow](/iris/25-pack-management#stage-a-production-world-update). Saved or exported JSON can contain the snippet's contents directly; see [Packaging and snippets](#packaging-and-snippets).

## Walkthrough: share a palette across biomes

The goal is one decorator definition placing wildflowers in several biomes, with a single file to edit. Prerequisites: a validating pack and a biome that already generates.

**1. Write the snippet.** The folder name must match the field's snippet type. A decorator field wants `snippet/decorator/`. Save `snippet/decorator/tutorial-wildflowers.json`:

```json
{
  "chance": 0.08,
  "style": {
    "style": "CLOVER_HERMITE",
    "zoom": 0.52,
    "exponent": 2.5
  },
  "slopeCondition": { "maximumSlope": 4 },
  "palette": [
    { "block": "minecraft:dandelion", "weight": 2 },
    { "block": "minecraft:poppy", "weight": 1 },
    { "block": "minecraft:air", "weight": 4 }
  ]
}
```

**2. Reference it.** In the biome, replace the inline decorator with the path. No `.json` suffix:

```json
{
  "decorators": ["snippet/decorator/tutorial-wildflowers"]
}
```

**3. Validate the pack.** If the snippet cannot load, compare the reported path with the file on disk.

**4. Reuse the snippet.** Add the same path to another biome's `decorators` list. Changes to the snippet apply to every reference after hotload, in newly generated chunks.

Generate the VSCode workspace (`/iris studio vscode`) so schema completion offers valid snippet paths for each field. See [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas).

## Reference format

Use `snippet/<type>/<name>` without `.json`, matching the field's type in the table below. The file belongs at `<pack>/snippet/<type>/<name>.json`. The folder is singular `snippet/`.

References must begin with `snippet/`. Use the correct type: `snippet/style/bedrock` in a decorator field looks for `snippet/decorator/style/bedrock.json`, not the style file. Missing or incorrect references leave the field without a value.

Subfolders are allowed, using `/` in the reference. A snippet can contain further snippet references in its nested fields. Studio completions list the available files for each supported field.

### Disk layout

```
pack/
  snippet/
    decorator/
      bush.json
      dry_grass.json
      forest/
        fern.json
    style/
      bedrock.json
      deepslate.json
```

The folder is singular `snippet/`, not `snippets/`. Type folder names must match the table below exactly.

### Overworld usage

Dimension ore deposits reference a style snippet:

```json
{
  "chanceStyle": "snippet/style/bedrock"
}
```

`snippet/style/bedrock.json`:

```json
{ "style": "STATIC" }
```

Biome decorator lists take snippet strings as array elements, mixed freely with inline objects:

```json
{
  "decorators": [
    "snippet/decorator/wildflowers",
    "snippet/decorator/bush",
    { "chance": 0.01, "palette": [{ "block": "minecraft:sweet_berry_bush" }] }
  ]
}
```

`biomes/temperate/plains.json` in the built-in Overworld uses the same pattern, mixing inline flower and grass decorators with the shared `leaf` and `bush` snippets.

## When to use a snippet

Use a snippet when the same value appears in several places and should change in lockstep. The bundled Overworld pack uses them for decorators shared by several climate biomes, noise styles reused by several generators, and the palette that defines pack stone.

Inline JSON is simpler for a value used once. Validate the pack after adding or moving snippet files.

## Packaging and snippets

Exports include snippet content differently on each platform:

- **Bukkit `/iris pack package`** includes snippet contents directly in dimension, region, biome, and generator JSON. The export has no `snippet/` folder and does not need one.
- **Modded `/iris studio package`** preserves source references and copies all JSON files under `snippet/`, including subfolders. Terrain profiles and their nested style snippets remain available in the exported pack. See [47 - Volumetric Terrain](/iris/47-volumetric-terrain).

See [25 - Pack Management](/iris/25-pack-management) for the full export contents.

## Snippet type names

Each value is the folder name under `snippet/` and the required prefix for references to that field.

| Snippet type | Content |
|---------------|-------|
| `attribute-modifier` | Attribute modifier |
| `axis-rotation` | Axis rotation clamp |
| `biome-palette` | Biome palette layer |
| `block-drops` | Block drops |
| `cave-field-module` | Cave field module |
| `cave-profile` | Cave profile |
| `color` | Color |
| `command` | Command |
| `command-registry` | Command registry |
| `coral` | Coral |
| `crystal` | Crystal |
| `custom-biome` | Biome custom |
| `custom-biome-particle` | Biome custom particle |
| `custom-biome-spawn` | Biome custom spawn |
| `decorator` | Decorator |
| `deposit` | Deposit generator |
| `deposit-variant` | Deposit variant |
| `dimension-carving-entry` | Dimension carving entry |
| `dimension-mode` | Dimension mode |
| `duration` | Duration |
| `effect` | Effect |
| `enchantment` | Enchantment |
| `entity-spawn` | Entity spawn |
| `expression-function` | Expression function |
| `expression-load` | Expression load |
| `floating-child-biome` | Floating child biomes |
| `formation` | Formation |
| `fungus` | Fungus |
| `generator` | Noise layer |
| `generator-layer` | Biome generator entry |
| `image-map` | Image map |
| `loot` | Loot |
| `loot-registry` | Loot reference |
| `object-block-replacer` | Object replace |
| `object-limit` | Object limit |
| `object-loot` | Object loot |
| `object-marker` | Object marker |
| `object-placer` | Object placement |
| `object-rotator` | Object rotation |
| `object-scale` | Object scale |
| `object-translator` | Object translate |
| `object-vanilla-loot` | Object vanilla loot |
| `palette` | Material palette |
| `position-3d` | Position |
| `potion-effect` | Potion effect |
| `procedural-objects` | Procedural objects |
| `procedural-tree` | Procedural tree |
| `range` | Range |
| `rate` | Rate |
| `ruin` | Ruin |
| `ruin-decorator` | Ruin decorator |
| `shaped-style` | Shaped generator style |
| `slope-clip` | Slope clip |
| `stilt-settings` | Stilt settings |
| `style` | Generator style |
| `style-range` | Styled range |
| `terrain-3d` | Terrain3d — see [47 - Volumetric Terrain](/iris/47-volumetric-terrain) |
| `time-block` | Time block |
| `tree` | Tree |
| `tree-branches` | Tree branches |
| `tree-canopy` | Tree canopy |
| `tree-decorator` | Tree decorator |
| `tree-layer` | Tree layer |
| `tree-secondary-leaf` | Tree secondary leaf |
| `tree-settings` | Tree settings |
| `tree-size` | Tree size |
| `tree-sub-branches` | Tree sub branches |
| `vacuum-settings` | Vacuum settings |

Whole-file resources (dimensions, regions, biomes, generators, loot tables, entities, spawners, markers, objects, and structures) are not snippet types. They already have their own folders and are referenced by key. Only nested field types appear above.

## Related commands

- Pack validation: `/iris pack validate`: see [25 - Pack Management](/iris/25-pack-management) and [04 - Commands & Permissions](/iris/04-commands-permissions).
- Studio open, hotload, and VSCode schema generation: [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas).
