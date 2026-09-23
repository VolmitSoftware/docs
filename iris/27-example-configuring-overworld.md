---
title: "Example - Configuring Overworld"
description: "Iris documentation: Example - Configuring Overworld"
published: true
date: 2026-09-23T11:12:42.385Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Copy the built-in `overworld` pack, add a meadow biome, and create a world from your edited pack.

Related:

- [05 - Concepts & Pack Layout](/iris/05-concepts-pack-layout)
- [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle)
- [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas)
- [11 - Dimensions](/iris/11-dimensions)
- [12 - Regions](/iris/12-regions)
- [13 - Biomes](/iris/13-biomes)
- [14 - Generators & Noise](/iris/14-generators-noise)
- [23 - Loot](/iris/23-loot)
- [23b - Entities & Spawners](/iris/23b-entities-spawners)
- [23c - Markers](/iris/23c-markers)
- [35 - Vanilla Passthrough](/iris/35-vanilla-passthrough)
- [44 - Biome Catalog](/iris/44-biome-catalog)
- [24 - Snippets](/iris/24-pack-mods-snippets)
- [25 - Pack Management](/iris/25-pack-management)
- [04 - Commands & Permissions](/iris/04-commands-permissions)
- [02 - Getting Started](/iris/02-getting-started)

Prerequisites: the `overworld` pack installed and validating, operator access on Bukkit or gamemaster on a mod loader, the keys `my-overworld`, `overworld-test` and `tutorial/meadow` unused, and the fork under source control or backed up.

## Where everything lives before you start

| Platform | Authoritative packs root |
|----------|--------------------------|
| Bukkit / Paper / Folia / Purpur | `plugins/Iris/packs/overworld/` |
| Fabric / Forge / NeoForge | `config/irisworldgen/packs/overworld/` |

A world created from a pack stores its first immutable epoch under `<dimensionRoot>/iris/generation/` and generates from that, never from the global `packs/` tree. Later updates add epochs instead of replacing them. Studio worlds run directly off `packs/<key>/`, which is why Studio is where authoring happens.

Iris does not download packs at startup. `/iris download pack=overworld` installs the latest stable Overworld release ZIP into `packs/`; restart afterwards before you open Studio or create a world.

The pack shape:

```
overworld/
  dimensions/overworld.json      # root dimension, load key: overworld
  regions/*.json                 # frozen, hot, temperate, tropical, ...
  biomes/<folder>/*.json         # temperate/, hot/, carving/, vanilla/, ...
  generators/*.json              # plain, mountain, ocean, flat, ...
  loot/...                       # global-clutter, temperate/food, ...
  entities/standard/...
  spawners/<climate>/...
  objects/...                    # .iob schematics
  structures/, jigsaw-*, ...
  snippet/decorator/, snippet/style/
```

## 1. Fork the pack

- Bukkit: `/iris studio create name=my-overworld template=overworld`
- Modded: `/iris studio create my-overworld overworld`

Pack creation is asynchronous and may report that a restart is required before the new pack can be opened. Then validate and open:

- Bukkit: `/iris pack validate pack=my-overworld`, then `/iris studio open my-overworld seed=1337`
- Modded: `/iris pack validate my-overworld`, then `/iris studio open my-overworld 1337`

Forking copies the whole tree under a new pack key so upstream Overworld updates cannot clobber your work, and a mistake is one folder deletion away from being undone. Create your worlds from the fork, not from `overworld`.

Expect a `my-overworld` folder next to `overworld` with the same structure, a loadable validation result, and a Studio world identical to the bundled overworld.

## 2. Add the biome file

Save this complete biome as `packs/my-overworld/biomes/tutorial/meadow.json`:

```json
{
  "name": "Tutorial Meadow",
  "rarity": 1,
  "derivative": "minecraft:plains",
  "vanillaDerivative": "minecraft:plains",
  "layers": [
    {
      "minHeight": 1,
      "maxHeight": 1,
      "palette": [{ "block": "minecraft:grass_block" }]
    },
    {
      "minHeight": 3,
      "maxHeight": 3,
      "palette": [{ "block": "minecraft:dirt" }]
    }
  ],
  "generators": [
    { "generator": "plain", "min": 18, "max": 24 }
  ],
  "decorators": ["snippet/decorator/wildflowers"]
}
```

Every piece of this is chosen so the result is unmistakable in game:

- `generators` reuses the fork's existing `generators/plain.json`, an `IRIS_DOUBLE` composite behind a `BILINEAR_STARCAST_9` interpolator. `min` 18 / `max` 24 instead of the 4-to-10 band the bundled plains uses. Those are offsets from `fluidHeight`, which the overworld sets to 50, so this meadow sits roughly 68 to 74 blocks up against ordinary plains at 54 to 60. The height difference is what makes it visible from a distance.
- `layers` are **thicknesses**, not Y coordinates: one block of grass over three blocks of dirt, with the dimension rock palette filling everything below.
- `decorators` uses a snippet reference. Any field whose type is a snippet type accepts the string form `snippet/<type>/<name>`, and the fork already contains `snippet/decorator/wildflowers.json`.
- `rarity` 1 makes it as common as the region's other biomes so you do not have to search for it later.

Do not copy this file into the original `overworld` folder.

With the workspace open, the editor should autocomplete `generator` values against the fork's real generator keys and flag a typo in `derivative` immediately. If it does not, run `/iris studio update dimension=my-overworld` ([10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas)).

## 3. Attach it and focus on it

Append `"tutorial/meadow"` to `landBiomes` in `regions/temperate.json`. Then merge these two fields into the existing object in `dimensions/my-overworld.json`:

```json
{
  "focusRegion": "temperate",
  "focus": "tutorial/meadow"
}
```

These are field excerpts. Merge them into the existing files; do not replace either file with the fragment. Validate again after both edits.

**A biome file that no region lists never generates, and nothing warns you about it.** `regions/temperate.json` already carries 28 land biomes, so a new one would be rare enough to be annoying to find — the two focus fields force the entire world to that region and biome so you can confirm the biome is correct before worrying about selection frequency.

## 4. Preview the biome

Generate untouched Studio chunks and run `/iris what region` and `/iris what biome`. Expect region `Temperate`, biome `Tutorial Meadow`, a grass-over-dirt surface, terrain visibly higher than the surrounding bundled plains, wildflower decoration, and no missing-key errors.

## 5. Create a world

1. Remove `focus` and `focusRegion` from the dimension.
2. Close Studio.
3. Create: Bukkit `/iris create name=overworld-test type=my-overworld seed=1337`, modded `/iris create overworld-test my-overworld 1337`.
4. Teleport: Bukkit `/iris tp overworld-test`, modded `/iris tp irisworldgen:overworld-test`.
5. Locate the biome with `/iris find biome tutorial/meadow`.

## 6. Package the pack

Export with Bukkit `/iris pack package dimension=my-overworld` or modded `/iris studio package my-overworld`. The `.iris` export can be distributed while the authoring files remain in `packs/my-overworld/`.

## What the bundled dimension actually sets

From `dimensions/overworld.json`:

| Field | Default value | Why it matters when you edit |
|-------|----------------|------------------------------|
| `name` / `version` | `"Overworld"` / `4000` | Bump `version` on your fork so pack generations stay distinguishable |
| `dimensionHeight` | `min` -256, `max` 512 | 768 blocks tall. Contract field. Do not change it on a fork that already has worlds |
| `logicalHeight` | `512` | Contract field |
| `fluidHeight` | `50` | World Y of sea level, and the baseline every biome generator band is measured from. Change it and every biome's apparent height moves |
| `environment` | `NORMAL` | Contract field |
| `landChance` | `0.69` | Land-heavy world |
| `regionZoom` | `16.15` | Continent-sized climate regions |
| `coordFractureZoom` | `0.15` | Aggressive coordinate warping. The source of the swirled borders |
| `dimensionAngleDeg` | `69` | Off-axis rotation that hides grid artifacts |
| `regions` | `frozen`, `hot`, `terralost`, `mushroom`, `forests`, `tundra`, `magnetics`, `temperate`, `estranged`, `tropical`, `swamp`, `prismatics` | The twelve climate regions your biome must be attached to one of |
| `loot` | mode `FALLBACK`, tables `["global-clutter"]` | Fallback only. Objects that declare their own loot keep it |
| `preventLeafDecay` | `true` | Custom trees keep their canopies |
| `useMantle` / `carvingEnabled` / `decorate` | `true` | All content passes on |
| `caveProfile` | enabled | Dimension-wide 3D caves, overridden per region |
| `carving` | one deep-dark band at world Y -250 to -175 | Depth-banded cave biome |
| `mode` | omitted | Runs `OVERWORLD` |

Also present: region/continental/biome noise styles, 11 terrain-band generators, 23 dimension deposits, the `deep_lava` and `deep_lava_small` deep-fluid profiles, and a large body of per-biome tuning. Non-flat terrain generators set `surfaceDetail: 0.5` to halve local surface roughness without touching generator seeds; mirror that into the paired Underworld generators if you fork both.

Ore passes set `surfaceReplaceableBlocks` to `minecraft:stone`, so buried and cave-wall candidates keep their full host lists but an exterior terrain-surface candidate cannot replace soil, themed stone, glass, ice, or decorative strata. A biome can widen that with `surfaceOreReplaceableBlocks` — `["minecraft:stone", "minecraft:sand"]` permits sand exposure in that biome only.

The managed Underworld mirrors the Overworld's terrain and cave shapes at the same seed with Nether-safe palettes, derivatives and object keys, and its own ore table. Per-biome content, including the procedural frozen and magnetic formation pools, is listed in [44 - Biome Catalog](/iris/44-biome-catalog) and the per-biome pages under `/iris/biomes`.

Do not invent region or biome keys. List the directories under `regions/` and `biomes/` and use what is actually there.

## Reading the region and biome graph

`regions/temperate.json` is a representative region:

- `landBiomes`: 29 keys including `temperate/plains`, `temperate/oak-forest`, `temperate/pale-denmyre`, `mountain/plains`, `vanilla/cherry_grove`
- `shoreBiomes`: `temperate/shore/beach`, `ocean/shore/beach`, `vanilla/stony_shore`, others
- `seaBiomes`: `ocean/deep`, `temperate/sea/ocean`, `temperate/sea/river`, others
- `caveBiomes`: `carving/rocky-cavebiome`, `carving/drip`, `carving/deep`, others
- `loot`: mode `FALLBACK`, multiplier `0.5`, tables `temperate/clutter` and `temperate/food`
- Per-category zooms (`landBiomeZoom` 3.5, `seaBiomeZoom` 6, `shoreBiomeZoom` 0.15, `caveBiomeZoom` 3.3) and its own enabled `caveProfile`

`biomes/temperate/plains.json` is a representative biome:

- `derivative` and `vanillaDerivative` are both `minecraft:plains`
- `generators` is `[{ "generator": "plain", "min": 4, "max": 10 }]`: 4 to 10 blocks above sea level
- `layers` is one block of grass over two blocks of dirt. The dimension rock palette fills below
- `objects` places `clutter/...` keys in `PAINT` mode at fractions of a percent per column
- `decorators` place flowers with a `TRIOCTAVE_SIMPLEX` variance and a fractured `STATIC` style

`generators/plain.json` is the height source both that biome and your meadow use: a single `IRIS_DOUBLE` composite layer behind a `BILINEAR_STARCAST_9` interpolator at horizontal scale 12.

## Edit terrain and content

### Change sea level

Set `fluidHeight` in `dimensions/my-overworld.json`. Default `50`, in world Y, and every biome generator band is measured from it. Lowering it lowers the sea while leaving relative terrain heights intact; raising it drowns low biomes. Existing chunks are unchanged; a staged update blends new surface terrain from the frozen edge and starts new hydrology outside the protected band.

### Add a biome to a region

1. Create `biomes/temperate/my-biome.json` with at least `name`, `derivative`, `layers`, and `generators` ([26 - Example - Minimal Dimension](/iris/26-example-minimal-dimension), [13 - Biomes](/iris/13-biomes)).
2. Append `"temperate/my-biome"` to the appropriate list in `regions/temperate.json`: `landBiomes`, `seaBiomes`, `shoreBiomes`, or `caveBiomes`.
3. Hotload, then sample with `/iris what biome` and `/iris find biome`.

Region lists must match real biome load keys. A key that does not resolve is a blocking validation error. A biome file that no region lists is silently dead.

### Change plains height

Edit `generators` `min`/`max` on `biomes/temperate/plains.json` to affect only that biome, or edit `generators/plain.json` to affect every biome that references `plain`, which is a lot of them. Prefer the biome-level change unless you mean the global one.

### Loot

- Dimension fallback: `dimensions/overworld.json` → `loot.tables`
- Region: `regions/temperate.json` → `loot`
- Tables live under `loot/` (`global-clutter`, `global-treasure`, `temperate/food`, …)

Mode `FALLBACK` only supplies tables when the object itself declared none. `ADD` stacks onto the parent scopes. `CLEAR` and `REPLACE` drop them.

### Decorators via snippets

Reuse `snippet/decorator/*` and `snippet/style/*` by string reference as in [24 - Snippets](/iris/24-pack-mods-snippets). Existing examples: `biomes/vanilla/old_growth_birch_forest.json` and the dimension ore `chanceStyle` fields.

### Entities and spawners

The pack includes `entities/standard/**` and `spawners/**`. Ambient Iris spawning requires listing spawner keys on `entitySpawners` at dimension, region or biome scope. Marker-based spawning needs markers plus a `markers` array on an object placement. See [23b - Entities & Spawners](/iris/23b-entities-spawners) and [23c - Markers](/iris/23c-markers).

## Pushing changes into an existing world

World creation records the first pack epoch. Changing `packs/` does **not** update an existing world until you stage and restart it.

```
/iris dev update-world world=<world> pack=my-overworld confirm=true
```

Without `confirm=true` it prints the warning and does nothing. The selected pack takes effect after a restart. Existing chunks keep their blocks, and new chunks use the updated pack. **Back up the complete dimension root, including `iris/generation/`, first.**

On Fabric, Forge, and NeoForge use `/iris world update <dimension> my-overworld`, which stages the same transition and keeps the current runtime active until restart.

| Goal | Approach |
|------|----------|
| Live design iteration | Studio open on `packs/` |
| Deploy pack changes into an existing survival world | Back up, then `update-world … confirm=true` |
| One generation era with no historical transition | New world from the updated pack |
| Experimental or partial changes | Fork the pack with `studio create` |

An in-place update cannot change the seed, `dimensionHeight`, `logicalHeight`, `environment`, coordinate scale, dimension type, or dimension file key. Iris rejects a candidate that changes that world contract.

## Validation and packaging

| Task | Command |
|------|---------|
| Validate | Bukkit `/iris pack validate pack=my-overworld`. Modded `/iris pack validate my-overworld` |
| Preview unused-resource cleanup | Bukkit `/iris pack cleanup my-overworld mode=preview`, then `mode=apply`. Modded uses the same `preview`/`apply` literals |
| Package for distribution | Bukkit `/iris pack package dimension=my-overworld`. Modded `/iris studio package my-overworld` |
| Version stamp | The dimension `version` field. The bundled pack uses large integers such as `4000` |

## Cross-links

- Minimal greenfield pack: [26 - Example - Minimal Dimension](/iris/26-example-minimal-dimension)
- Dimension field reference: [11 - Dimensions](/iris/11-dimensions)
- Commands and permissions: [04 - Commands & Permissions](/iris/04-commands-permissions)
- Download, validate, package: [25 - Pack Management](/iris/25-pack-management)
