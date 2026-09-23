---
title: "Concepts & Pack Layout"
description: "Iris documentation: Concepts & Pack Layout"
published: true
date: 2026-09-23T11:12:42.385Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
A pack is a folder of JSON files, binary objects, and images that describes one or more worlds. Edit the authoring folder in Studio, then stage a pack update to apply those changes to new chunks in a production world.

See also: [00 - Overview](/iris/00-overview), [01 - Installation & Platforms](/iris/01-installation-platforms), [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas), [11 - Dimensions](/iris/11-dimensions), [24 - Snippets](/iris/24-pack-mods-snippets), [25 - Pack Management](/iris/25-pack-management).

## Pack files

There is no manifest file, no registry, and no build step. A pack is a directory whose subfolder names tell Iris what type each file is. `biomes/plains.json` is a biome because it sits in `biomes/`. Move that same file to `regions/` and Iris will try to parse it as a region.

The pack folder's own name is the pack key. A folder called `packs/myworld/` is the pack `myworld`. Rename the folder and you have renamed the pack.

The only hard requirement is at least one `.json` file directly inside `dimensions/`. Everything else is optional. A folder you never create simply has no resources of that type.

## Pack example

```text
packs/myworld/
  dimensions/
    myworld.json        -> key "myworld"
  regions/
    main.json           -> key "main"
  biomes/
    plains.json         -> key "plains"
    hills/
      rolling.json      -> key "hills/rolling"
  generators/
    plain.json          -> key "plain"
```

Five files. `dimensions/myworld.json` lists `"main"` in its `regions` array. `regions/main.json` lists `"plains"` and `"hills/rolling"` in `landBiomes`. Each biome names `"plain"` as a generator. That chain is the whole pack.

Note `hills/rolling`. Subfolders are yours to organize however you like. They become part of the key, and nothing else changes.

## Resource keys

**A key is the file's path under its type folder, with the extension removed.**

| File on disk | Type folder | Key you write in JSON |
|---|---|---|
| `biomes/plains.json` | `biomes/` | `plains` |
| `biomes/temperate/plains.json` | `biomes/` | `temperate/plains` |
| `objects/trees/oak/big.iob` | `objects/` | `trees/oak/big` |
| `snippet/style/soft.json` | (snippets, see below) | `snippet/style/soft` |

There is no namespace and no type prefix. You never write `biomes/plains` or `iris:plains`. The field you fill in already knows it wants a biome, so it searches `biomes/` for you. Cross-references everywhere (region biome lists, object placements, spawner entity ids, structure piece pools) use exactly these keys.

### Filenames

Use exact filenames, including for nested resources. At the type-folder root, a file such as `plains.disabled.json` can still match the key `plains`; adding `.disabled` does not disable it. Keep one canonical filename per key and avoid `null.json`.

## How the pieces relate

The dimension selected during world creation connects the pack resources:

```text
dimension  ->  regions  ->  biomes  ->  generators   (terrain height/noise)
                                    ->  objects      (.iob models)
                                    ->  decorators   (surface clutter)
                                    ->  structures   (jigsaw / native)
                                    ->  spawners     -> entities
                                    ->  loot
```

- **Dimension** — the root. Sets world height, environment, seed behavior, and which regions exist. One dimension equals one world type.
- **Region** — a spatial zone. Regions decide which biomes can appear where, and can carry their own objects and structures that span biome edges.
- **Biome** — the workhorse. Block layers, surface treatment, decorations, object placements, structures, and mob spawns.
- **Generator** — noise and height math. Biomes reference generators to get terrain shape. Several biomes can share one.
- **Object** — a `.iob` block model with its own placement rules.
- **Structure / jigsaw pool / jigsaw piece** — multi-piece assemblies, either Iris-native or bridged to vanilla structures.

A resource must be referenced by the selected dimension, directly or through its regions and biomes, to generate.

## Snippets

A snippet is a JSON fragment you write once and reference from many places. Fields that support snippets accept an inline object or a string pointing at a snippet file. Studio schemas show which fields support them.

```json
"style": "snippet/style/soft-hills"
```

resolves to `<packRoot>/snippet/style/soft-hills.json`.

| Rule | Actual behavior |
|---|---|
| Reference form | Use a JSON string in a snippet-compatible field, or supply the object inline |
| Required prefix | Use `snippet/<type>/<name>`; a string without `snippet/` does not select a snippet |
| Re-rooting | If the string starts with `snippet/` but not `snippet/<thisType>/`, Iris strips `snippet/` and re-roots the remainder under this field's own type. So `snippet/decorator/foo` on a style field becomes `snippet/style/decorator/foo`, not an error |
| On-disk path | `<packRoot>/snippet/<type>/<name>.json`, resolved from the pack root, not from the type folder |
| Subfolders | Allowed. `<name>` may contain `/` |
| Schema | Studio writes `.iris/schema/snippet/<type>-schema.json` so the editor offers completions for `snippet/<type>/…` |

The bundled overworld uses `snippet/decorator/*` and `snippet/style/*`.

## Authoring and production worlds

Edit the source pack under `packs/<key>/`. Studio applies valid edits to new chunks. Production worlds use their saved pack until you stage an update and restart.

Include the complete `iris/generation` directory in world backups. Do not edit its saved pack files.

| Mode | Generation source | How changes apply |
|---|---|---|
| Ordinary Bukkit Studio | Saved world-local pack copies | Watches authoring JSON, IOB, and PNG files. Accepted edits activate for new chunks with a boundary transition |
| Modded Studio | Live authoring pack | Uses the modded Studio hotload path |
| Production | Saved world-local pack copies | Explicit update staging and restart |

Invalid Studio edits leave the current pack active.

Existing chunks keep their saved terrain. New chunks use the updated pack, with a transition beside existing terrain.

See [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas) for the edit loop and [25 - Pack Management](/iris/25-pack-management) for production updates. Physical height, dimension type, and coordinate-scale changes require a new world. Generation modes, fluid baselines, and upper-terrain content can change within that fixed layout.

## Where packs live

| What | Bukkit-family | Fabric / Forge / NeoForge |
|---|---|---|
| Packs you author and download into | `plugins/Iris/packs/<key>/` | `config/irisworldgen/packs/<key>/` |
| Platform data dir (`iris.json`, languages, caches) | `plugins/Iris/` | `config/iris/` |
| A world's generation snapshots | `<dimensionRoot>/iris/generation/epochs/<epoch>/pack/` | same, under the modded world root |
| Studio schemas | `<packRoot>/.iris/schema/` | same |

On mod loaders the pack root and the platform data dir are two different folders. Packs go under `config/irisworldgen/`. Everything else goes under `config/iris/`. If you are hand-placing a pack on a modded server, `config/irisworldgen/packs/` is the one that matters.

Folders whose names start with `.` are skipped when Iris lists packs, which is why `.iris/` inside a pack is invisible to the listing. Listing follows symbolic links, but installing a pack into a world uses a stricter check that refuses a symlinked root, any symlink in the tree, and any non-regular file. It also skips hidden subtrees.

## Registrant folders

Use these folders and file extensions for pack resources.

| Folder | Extension | What lives here and when you touch it |
|---|---|---|
| `dimensions/` | `.json` | World roots. Height, environment, region list, imports. **Required** — a pack with none is not loadable |
| `regions/` | `.json` | Which biomes appear in which climate zone, plus region-wide objects and structures |
| `biomes/` | `.json` | Where most authoring time goes: layers, surface, decorators, objects, structures, spawns |
| `generators/` | `.json` | Reusable noise/height math that biomes point at. Edit here to change terrain shape across many biomes at once |
| `objects/` | `.iob` | Binary block models saved from the wand or imported from schematics. Referenced by placements, never edited as text |
| `structures/` | `.json` | Structure graphs, including the `minecraft_*` graphs that bridge vanilla structures |
| `jigsaw-pools/` | `.json` | Weighted sets of pieces a jigsaw connector can pick from |
| `jigsaw-pieces/` | `.json` | One placeable piece: its object, its connectors, its rules |
| `entities/` | `.json` | Entity definitions with equipment, attributes, and custom data, used by spawners and markers |
| `spawners/` | `.json` | When and where entities spawn — time, block, biome, and rate rules |
| `markers/` | `.json` | Named points Iris records during generation so spawners and other systems can find them later |
| `loot/` | `.json` | Iris loot tables applied to generated containers |
| `blocks/` | `.json` | Named custom block states you can reference instead of repeating long block data strings |
| `expressions/` | `.json` | Math expressions callable from generators and placement rules |
| `images/` | `.png` | PNG maps sampled as noise or as direct biome/height input |
| `matter/` | `.mat` | Reserved; does not affect generation |
| `mods/` | `.json` | Does not affect generation. Use [snippets](/iris/24-pack-mods-snippets) for reusable definitions |

## What makes a pack loadable

A pack needs all three of the following:

1. A pack directory.
2. A `dimensions/` subdirectory.
3. At least one `*.json` file **directly inside** `dimensions/`. Nested dimension files do not meet this requirement.

Run `/iris pack validate` before creating a world. The pack must have zero blocking errors. See [25 - Pack Management](/iris/25-pack-management) for validation commands and content requirements.

### Download key rules

Downloaded pack keys must match `[a-z0-9_-]+`. The check applies both to a caller-supplied expected key and to the key Iris derives from the archive.

An archive installed through `link=` has no expected key. Iris uses its shortest dimension key, then alphabetical order, as the install folder name while preserving every dimension in the pack. The built-in `overworld` and `underworld` downloads carry their exact expected key. That key picks the folder name. The whole pack is validated before publication.

After adding resources, refresh Studio completions with `/iris studio update dimension=<pack>` on Bukkit or `/iris studio update <pack>` on modded.

## The bundled overworld pack

For orientation when reading `packs/overworld/`:

| Path | What is in it |
|---|---|
| `dimensions/overworld.json` | The single root dimension |
| `regions/*.json` | Climate zones that partition the biome set |
| `biomes/**` | Nested biome sets — temperate, hot, frozen, ocean, and so on |
| `generators/**` | Shared terrain generators |
| `objects/**` | `.iob` trees, structures, clutter, and vanilla imports |
| `structures/*.json` | Structure graphs, including `minecraft_*` bridges |
| `jigsaw-pieces/**`, `jigsaw-pools/**` | Jigsaw assembly data |
| `entities/standard/**`, `spawners/**`, `loot/**` | Mob and loot content |
| `images/*.png` | Noise and map images |
| `snippet/decorator/**`, `snippet/style/**` | Shared fragments referenced across biomes |

Feature-level detail: [12 - Regions](/iris/12-regions), [13 - Biomes](/iris/13-biomes), [14 - Generators & Noise](/iris/14-generators-noise), [18 - Structures Overview](/iris/18-structures-overview), [19 - Objects](/iris/19-objects), [21 - Jigsaw Structures](/iris/21-jigsaw-structures), [23 - Loot](/iris/23-loot), [23b - Entities & Spawners](/iris/23b-entities-spawners).
