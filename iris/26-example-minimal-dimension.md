---
title: "Example - Minimal Dimension"
description: "Iris documentation: Example - Minimal Dimension"
published: true
date: 2026-09-23T11:12:42.385Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Create a pack with one dimension, one region, one biome, and one generator. This example produces a flat grass world at Y 159.

Related:

- [05 - Concepts & Pack Layout](/iris/05-concepts-pack-layout)
- [02 - Getting Started](/iris/02-getting-started)
- [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas)
- [11 - Dimensions](/iris/11-dimensions)
- [12 - Regions](/iris/12-regions)
- [13 - Biomes](/iris/13-biomes)
- [14 - Generators & Noise](/iris/14-generators-noise)
- [25 - Pack Management](/iris/25-pack-management)
- [04 - Commands & Permissions](/iris/04-commands-permissions)

Prerequisites: Iris running with its data folders present, operator access on Bukkit or gamemaster on a mod loader, no existing pack or world using the keys `minimal` or `minimal-test`, and a console you can watch.

## 1. Create the pack root

Make this tree under the platform packs root:

```
minimal/
  dimensions/minimal.json
  regions/starter.json
  biomes/starter.json
  generators/flat.json
```

- Bukkit-family packs root: `plugins/Iris/packs/`
- Fabric / Forge / NeoForge packs root: `config/irisworldgen/packs/`

The folder name is the pack key. The dimension file name without `.json` is the dimension load key. Here both are `minimal`, which is the convention worth keeping because commands take the key, not the path. Every other resource is keyed by its path under its type folder: `biomes/starter.json` is biome key `starter`, `biomes/plains/dry.json` is key `plains/dry`.

Iris can write the skeleton for you:

| Platform / method | Command or action |
|-------------------|-------------------|
| Bukkit starter (no template) | `/iris studio create name=minimal` |
| Bukkit template copy | `/iris studio create name=minimal template=overworld` |
| Modded (always uses a template. `example` by default) | `/iris studio create minimal` |
| Modded template copy | `/iris studio create minimal overworld` |

The Bukkit starter writes the same four resource types below. Modded studio create always copies a template, so build the tree by hand when you want exactly this baseline on a mod loader.

## 2. Write the dimension

`dimensions/minimal.json`:

```json
{
  "name": "minimal",
  "version": 1,
  "mode": { "type": "OVERWORLD" },
  "regions": ["starter"],
  "environment": "NORMAL",
  "dimensionHeight": { "min": -64, "max": 320 },
  "logicalHeight": 384,
  "fluidHeight": 63
}
```

| Field | Why |
|-------|-----|
| `name` | Display name used by commands and the studio scoreboard. Marked required in the schema. The file name is what actually identifies the dimension |
| `regions` | The only mandatory content link. Without at least one loadable region key, no biome can ever be selected |
| `mode` | `OVERWORLD` is the only mode that registers caves, objects, decoration and deposits. The other three register terrain and biome only. Omitting the field also yields `OVERWORLD`, but writing it out makes the choice visible |
| `environment` | Picks the vanilla dimension template the generated dimension type is built from: sky, fog and gameplay attributes, not terrain |
| `dimensionHeight` | Build floor -64, ceiling 320. The span (384) and the minimum (-64) are both multiples of 16, which Minecraft requires |
| `logicalHeight` | 384, equal to the total height. It must not exceed the total height or dimension-type construction throws |
| `fluidHeight` | World Y of sea level: 63, the vanilla value. Biome generator heights are measured from here |
| `version` | A stamp you control so pack generations are distinguishable. Iris never acts on it |

> `dimensionHeight`, `logicalHeight`, `environment`, `dimensionOptions`, `fullbright`, and the file name form the world contract. Once a world exists on this pack, changing the file-derived type key, the environment, or the effective dimension type means **recreating the world** — Studio hotload refuses the change. Everything else in this guide is safe to iterate on.
{.is-warning}

Useful while testing, removed before release: `"focus": "starter"` forces a single biome and `"focusRegion": "starter"` forces a single region.

## 3. Write the region

`regions/starter.json`:

```json
{
  "name": "Starter",
  "landBiomes": ["starter"],
  "seaBiomes": ["starter"],
  "shoreBiomes": ["starter"]
}
```

A region is the biome pool for one area of the world. Iris decides land versus sea first, then picks from the matching list, so a region with an empty `seaBiomes` cannot fill an ocean column. Listing the same biome in all three lists means every column resolves no matter which category the terrain lands in.

| Field | Why |
|-------|-----|
| `name` | Required display name |
| `landBiomes` | Required. Root-level biome keys only |
| `seaBiomes` / `shoreBiomes` | Optional for genuinely land-only packs. Included here so no column can fail to resolve |
| `caveBiomes` | Optional. Not needed until caves are enabled |

List only root parents here. Child biomes are declared on their parent biome `children`, not on the region.

## 4. Write the biome

`biomes/starter.json`:

```json
{
  "name": "Starter Plains",
  "derivative": "minecraft:plains",
  "vanillaDerivative": "minecraft:plains",
  "layers": [
    {
      "palette": [{ "block": "minecraft:grass_block" }]
    }
  ],
  "generators": [
    {
      "generator": "flat",
      "min": 96,
      "max": 96
    }
  ]
}
```

The biome supplies two things: a height, from its generator links, and a surface material stack, from its layers.

| Field | Why |
|-------|-----|
| `name` | Required display name. `/iris what biome` prints it |
| `derivative` | Required. The vanilla biome this maps to for client-side coloring, mob spawning tables and vanilla feature eligibility. The engine default is `minecraft:the_void`, which generates nothing useful, so always set it |
| `vanillaDerivative` | The derivative used for native structure selection. Falls back to `derivative` when undefined. Set it when a biome should look like one thing and attract another thing's structures |
| `layers` | Required. The surface stack from the top down. Each layer `minHeight`/`maxHeight` are **thickness in blocks**, not Y coordinates, and default to 1. Everything below the declared layers is filled with the dimension rock palette |
| `generators` | Links to `generators/<key>.json` with a height band. `min` and `max` are offsets **from `fluidHeight`**, not absolute Y |

With `fluidHeight` 63 and `min` = `max` = 96, every column resolves to 96 above sea level — a flat plateau at world Y 159 with the ocean far below. That is deliberate: it makes the terrain obviously generated rather than accidentally matching vanilla. For plains near sea level use small values instead; the bundled overworld plains biome uses `min` 4 / `max` 10 on generator `plain`.

## 5. Write the generator

`generators/flat.json`:

```json
{
  "interpolator": { "function": "NONE", "horizontalScale": 1 },
  "seed": 310,
  "composite": [
    {
      "seed": 310,
      "style": { "style": "FLAT" }
    }
  ]
}
```

A generator turns coordinates into a 0-to-1 noise value, which the biome `min`/`max` band maps into a height. `FLAT` returns a constant, and because `min` equals `max` the mapping is constant anyway, so the surface is perfectly level. The interpolator controls how neighboring biomes blend their heights; `NONE` gives hard edges, which keeps this example flat. This file matches the bundled overworld `generators/flat.json` byte for byte.

| Field | Why |
|-------|-----|
| `seed` | Required. Changing it re-rolls this generator noise independently of the world seed |
| `interpolator` | Required. `NONE` for a hard flat baseline. Swap to a bilinear or starcast function once real terrain matters |
| `composite` | The noise layers summed into the final value. One `FLAT` layer here |

## 6. Validate

- Bukkit: `/iris pack validate pack=minimal`
- Modded: `/iris pack validate minimal`

The pack must validate without blocking errors before Studio can open it.

Expect no blocking errors. A missing region or biome means the key in the parent file and the file path under the type folder disagree — compare them character for character, including the folder prefix. Validation also checks that structure placements fit inside the declared height range, that both dimension-height values satisfy Minecraft's bounds and multiple-of-16 rules, and that `logicalHeight` fits inside the span.

## 7. Preview in Studio

1. Open: Bukkit `/iris studio open minimal seed=1337`, modded `/iris studio open minimal 1337`.
2. Run `/iris what region` and `/iris what biome`.

Expect a uniform grass surface at world Y 159, region `Starter`, and biome `Starter Plains`. Studio reads `packs/minimal/`; save edits there and generate new chunks to see them.

## 8. Create the world

1. Create: Bukkit `/iris create name=minimal-test type=minimal seed=1337`, modded `/iris create minimal-test minimal 1337`.
2. Teleport: Bukkit `/iris tp minimal-test`, modded `/iris tp irisworldgen:minimal-test`.

The world uses a saved copy of the pack. To apply later edits, use [Pack Management](/iris/25-pack-management#stage-a-production-world-update).

## 9. Add content

Add one thing at a time and re-validate after each, so a broken key is always attributable to the last edit.

| Add | Where |
|-----|-------|
| Second biome | New `biomes/*.json`, then append its key to `regions/starter.json` → `landBiomes` |
| Sea and shore variety | Distinct biome keys on `seaBiomes` / `shoreBiomes` |
| Real terrain | Replace `generators/flat.json` with a composite noise generator, or add a second generator and give the biome a wider `min`/`max` band ([14 - Generators & Noise](/iris/14-generators-noise)) |
| Caves | `caveProfile` on the dimension, plus cave biomes on the region `caveBiomes` ([15 - Caves & Carving](/iris/15-caves-carving)) |
| Decorators | Biome `decorators` array, inline or `snippet/decorator/...` ([16 - Surfaces, Decorators & Deposits](/iris/16-surfaces-decorators-deposits)) |
| Loot | `loot/*.json` plus a `loot` reference on the dimension, region or biome ([23 - Loot](/iris/23-loot)) |
| Objects | Biome or region `objects` placements plus `objects/*.iob` ([19 - Objects](/iris/19-objects), [20 - Object Placement](/iris/20-object-placement)) |
| Entity spawning | `entities/`, `spawners/`, then `entitySpawners` on the dimension, region or biome |

## Pack requirements

| Item | Required value or reference |
|------|-----------------------------|
| Pack directory | `minimal/` under the platform's packs root, containing `dimensions/minimal.json` |
| Dimension region | `starter`, matching `regions/starter.json` |
| Region biomes | File keys relative to `biomes/`, without `.json`; include any folder prefix |
| Biome generator | `flat`, matching `generators/flat.json`. Set the biome's `min` and `max` as offsets from `fluidHeight` |
| Biome derivative | Use the example's `minecraft:plains` rather than `minecraft:the_void` |
| Dimension height | Minimum and total span must be multiples of 16; `logicalHeight` must not exceed that span |

Inspect edits in new Studio chunks. Close and reopen Studio after changing height or dimension type, and follow any restart prompt. To apply pack edits to an existing production world, use [Pack Management](/iris/25-pack-management).

## Next steps

- Full dimension field reference: [11 - Dimensions](/iris/11-dimensions)
- Region zooms, deposits, caves: [12 - Regions](/iris/12-regions)
- Layers, decorators, children: [13 - Biomes](/iris/13-biomes)
- Noise composites and interpolators: [14 - Generators & Noise](/iris/14-generators-noise)
- Editing the full bundled overworld: [27 - Example - Configuring Overworld](/iris/27-example-configuring-overworld)
