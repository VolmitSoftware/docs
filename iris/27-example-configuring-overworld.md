---
title: "Example - Configuring Overworld"
description: "Iris documentation: Example - Configuring Overworld"
published: true
date: 2026-09-14T01:41:00.322Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
The built-in `overworld` pack is what most Iris servers generate from after an operator installs it with `/iris download pack=overworld` and restarts. This is a guided build. You will fork it, add one visible biome, prove the biome in Studio and in a disposable world, and leave the original pack untouched. It exercises references, hotload, immutable world epochs, and rollback. It does not touch height or registries.

Related:

- [05 - Concepts & Pack Layout](/iris/05-concepts-pack-layout)
- [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle)
- [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas)
- [11 - Dimensions](/iris/11-dimensions)
- [12 - Regions](/iris/12-regions)
- [13 - Biomes](/iris/13-biomes)
- [14 - Generators & Noise](/iris/14-generators-noise)
- [23 - Loot, Entities, Spawners, Markers](/iris/23-loot-entities-spawners-markers)
- [35 - Vanilla Passthrough](/iris/35-vanilla-passthrough)
- [44 - Biome Catalog](/iris/44-biome-catalog)
- [24 - Pack Mods & Snippets](/iris/24-pack-mods-snippets)
- [25 - Pack Management](/iris/25-pack-management)
- [04 - Commands & Permissions](/iris/04-commands-permissions)
- [02 - Getting Started](/iris/02-getting-started)

Prerequisites:

- The `overworld` pack is installed and validates.
- Operator access on Bukkit, or gamemaster access on a mod loader.
- The keys `my-overworld`, `overworld-test`, and `tutorial/meadow` are unused.
- The fork is in source control or has a filesystem backup before you rely on it.

The current pack sets nonflat terrain generators to `surfaceDetail: 0.5` to reduce local surface roughness. This retains half the variation around an interpolated six-block grid without changing generator seeds or broad terrain settings. Mirror this control into the paired Underworld generators.

## Where everything lives before you start

| Platform | Authoritative packs root |
|----------|--------------------------|
| Bukkit / Paper / Folia / Purpur | `plugins/Iris/packs/overworld/` |
| Fabric / Forge / NeoForge | `config/irisworldgen/packs/overworld/` |

A world created from a pack stores its first immutable epoch under `<dimensionRoot>/iris/generation/`. Normal world generation reads the active epoch and never looks at the global `packs/` tree. Later updates add epochs instead of replacing them. Studio worlds run directly off `packs/<key>/`, which is why Studio is where authoring happens.

Iris does not download packs at startup. `/iris download pack=overworld` installs the latest stable Overworld release ZIP into `packs/`. Restart afterward before you open Studio or create a world (see [02 - Getting Started](/iris/02-getting-started), [25 - Pack Management](/iris/25-pack-management)).

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

**What you do.**

- Bukkit: `/iris studio create name=my-overworld template=overworld`
- Modded: `/iris studio create my-overworld overworld`

Wait for the command to report the completed project path. Pack creation runs asynchronously and may report that a restart is required before the new pack can be opened.

Then validate and open:

- Bukkit: `/iris pack validate pack=my-overworld`, then `/iris studio open my-overworld seed=1337`
- Modded: `/iris pack validate my-overworld`, then `/iris studio open my-overworld 1337`

**Why.** Forking copies the whole tree under a new pack key so upstream Overworld updates cannot clobber your work. A mistake is then one folder deletion away from being undone. Create your worlds from the fork, not from `overworld`.

**What you should see.** A `my-overworld` folder next to `overworld` with the same structure, a loadable validation result, and a Studio world that looks exactly like the bundled overworld.

## 2. Add the biome file

**What you do.** Save this complete biome as `packs/my-overworld/biomes/tutorial/meadow.json`:

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

**Why.** Every piece of this is chosen so the result is unmistakable in game:

- `generators` reuses the fork existing `generators/plain.json`. That file is an `IRIS_DOUBLE` composite behind a `BILINEAR_STARCAST_9` interpolator. This biome uses `min` 18 / `max` 24 instead of the 4-to-10 band the bundled plains uses. Those numbers are offsets from `fluidHeight`, which the overworld sets to 50. This meadow sits roughly 68 to 74 blocks up while ordinary plains sit around 54 to 60. The height difference is what makes it visible from a distance.
- `layers` are **thicknesses**, not Y coordinates: one block of grass over three blocks of dirt, with the dimension rock palette filling everything below.
- `decorators` uses a snippet reference. Any field whose type is a snippet type accepts the string form `snippet/<type>/<name>`. Iris loads `snippet/decorator/wildflowers.json` in its place at parse time. The fork already contains that file.
- `rarity` 1 makes it as common as the region other biomes so you do not have to search for it later.

Do not copy this file into the original `overworld` folder.

**What you should see.** With the workspace open, the editor should autocomplete `generator` values against the fork real generator keys and flag a typo in `derivative` immediately. If it does not, run `/iris studio update dimension=my-overworld` (see [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas)).

## 3. Attach it and focus on it

**What you do.** Append `"tutorial/meadow"` to `landBiomes` in `regions/temperate.json`. Then merge these two fields into the existing object in `dimensions/my-overworld.json`:

```json
{
  "focusRegion": "temperate",
  "focus": "tutorial/meadow"
}
```

These are field excerpts. Merge them into the existing files. Do not replace either file with the fragment. Validate again after both edits.

**Why.** A biome file that no region lists never generates. Nothing warns you about it. It just never gets picked. `regions/temperate.json` already carries 28 land biomes, so a new one would be rare enough to be annoying to find. The two focus fields force the entire world to that region and biome. You can confirm the biome itself is correct before worrying about selection frequency.

**What you should see.** Validation still loadable. If it cannot resolve the biome, compare `tutorial/meadow` against the actual path and the region entry character for character. The folder prefix is part of the key.

## 4. Prove the authoring result

**What you do.** Generate untouched Studio chunks and run `/iris what region` and `/iris what biome`.

**What you should see.** Region `Temperate`, biome `Tutorial Meadow`, a grass-over-dirt surface, terrain visibly higher than the surrounding bundled plains, wildflower decoration, and no missing-key errors in console.

If terrain is empty, confirm `generators/plain.json` still exists in the fork. If flowers are missing, confirm `snippet/decorator/wildflowers.json` exists and remove the decorator reference until the terrain baseline passes. One variable at a time.

## 5. Prove natural selection and restart behavior

**What you do.**

1. Remove `focus` and `focusRegion`. Close Studio. Reopen on seed `1337`.
2. Locate the biome naturally: `/iris find biome tutorial/meadow` (available on Bukkit and on mod loaders. `/iris goto biome <key>` is the same command on modded).
3. Create a disposable world: Bukkit `/iris create name=overworld-test type=my-overworld seed=1337`, modded `/iris create overworld-test my-overworld 1337`.
4. Teleport: Bukkit `/iris tp overworld-test`, modded `/iris tp irisworldgen:overworld-test`. Folia creates the world in the current process, so it is immediately available for teleport after creation completes.
5. Generate new chunks. Stop the server cleanly. Restart. Verify another new area.

**Why.** Focus mode proves the biome renders. Only unfocused generation proves it is reachable through region selection. The disposable world proves the immutable epoch works outside Studio. The restart proves the generated dimension type and custom biomes survive a registry reload.

**What you should see.** The meadow appearing naturally in temperate regions, `iris/generation/` present in the dimension root, and a clean restart with no pack or registry errors.

## 6. Package or recover

**What you do.** Package with Bukkit `/iris pack package dimension=my-overworld` or modded `/iris studio package my-overworld`.

**Why.** The validated fork under `packs/` is the authoring source. The `.iris` export and each immutable world epoch are outputs with exact content fingerprints.

| Failure | Recovery |
|---------|----------|
| Fork creation fails or is partial | Move only the newly created incomplete `my-overworld` folder aside, confirm the source pack validates, then rerun |
| Studio still shows old content | Generate untouched chunks. Close and reopen after a dimension-contract or registry change |
| Natural selection cannot find the biome | Confirm it is still in `regions/temperate.json`, that both focus fields are gone, and sample a broader new area |
| Disposable world differs from Studio | Inspect the active epoch and its manifest fingerprint. Recreate the disposable world from the current validated fork |
| A production update would change seed, height, environment, or dimension type | Create a new world and migrate deliberately |

## What the bundled dimension actually sets

From `dimensions/overworld.json`:

| Field | Default value | Why it matters when you edit |
|-------|----------------|------------------------------|
| `name` / `version` | `"Overworld"` / `4000` | Bump `version` on your fork so pack generations stay distinguishable |
| `dimensionHeight` | `min` -256, `max` 512 | 768 blocks tall. Contract field. Do not change it on a fork that already has worlds |
| `logicalHeight` | `512` | Contract field |
| `fluidHeight` | `50` | World Y of sea level, and the baseline every biome generator band is measured from. Change it and every biome apparent height moves |
| `environment` | `NORMAL` | Contract field |
| `landChance` | `0.69` | Land-heavy world |
| `regionZoom` | `16.15` | Continent-sized climate regions |
| `coordFractureZoom` | `0.15` | Aggressive coordinate warping. This is the source of the swirled borders |
| `dimensionAngleDeg` | `69` | Off-axis rotation that hides grid artifacts |
| `regions` | `frozen`, `hot`, `terralost`, `mushroom`, `forests`, `tundra`, `magnetics`, `temperate`, `estranged`, `tropical`, `swamp`, `prismatics` | The twelve climate regions your biome must be attached to one of |
| `loot` | mode `FALLBACK`, tables `["global-clutter"]` | Fallback only. Objects that declare their own loot keep it |
| `preventLeafDecay` | `true` | Custom trees keep their canopies |
| `useMantle` / `carvingEnabled` / `decorate` | `true` | All content passes on |
| `caveProfile` | enabled | Dimension-wide 3D caves, overridden per region |
| `carving` | one deep-dark band at world Y -250 to -175 | Depth-banded cave biome |
| `mode` | omitted | Runs `OVERWORLD` |

Also present: region/continental/biome noise styles, 11 terrain-band generators, and 23 dimension deposits. Ore height bands preserve Minecraft 26.2 normalized vertical positions by mapping its 384-block Overworld span into the pack 768-block span. Vein shapes, exposure rules and biome exceptions remain vanilla-shaped. Every subterranean ore pass keeps 70% of its configured clump attempts. Specialized high, ultra-low, badlands, and mountain passes therefore average 1.4 times vanilla attempts, while the 13 ordinary passes intersecting world Y -175 through 0 average 2.8 times vanilla attempts. All ore passes set `surfaceReplaceableBlocks` to `minecraft:stone`: buried and cave-wall candidates retain their full host lists, but an exterior terrain-surface candidate cannot replace soil, themed stone, glass, ice, or decorative strata. A biome may replace that list through `surfaceOreReplaceableBlocks`; `["minecraft:stone", "minecraft:sand"]`, for example, permits sand exposure only in that biome. Magnetics uses seven full-height-ratio above-terrain ore families across engine-local Y 224–736, plus a frozen-island emerald pass. Their authored attempt counts are unchanged, but their exterior terrain cells follow the same stone-only rule. Rough Plains owns the same seven-family above-terrain suite for its two floating-biome forms. Magnetics selects between the redesigned vascular `magnetic-hollows`, warped `flux-crystal-caverns`, and narrower `polarity-grotto` below its terrain. Magnetic Hollows now forms connected narrow galleries with occasional cellular polarity vaults, calcite and amethyst accents, and sparse crystal or monolith landmarks instead of broad merged rooms. Its nine floating entries use variable vascular or crystalline tails, coherently varied edge taper and restrained wall warp instead of fixed-depth slabs. The managed Underworld mirrors those terrain and cave shapes at the same seed. It uses Nether-safe palettes, derivatives, and object keys. It retains its independent ore table. Host-aware automatic deepslate conversion, imported-structure adjustments for stronghold, trial chambers, mineshaft and village, and one ancient-city structure placement with `nativeSuppression: REPLACE_SOURCE` are also configured here.

Frozen surface and cave biomes use deterministic procedural formations in place of the former fixed ice-cluster library. Surface pools contain compact crooked spires, drift boulders, separated shard fans, frost blooms, and sprigs. Icebergs, fissures, spirals, overhangs, and arches add larger forms.

Ice Spikes uses the denser pool. Its crooked spires are 14 to 24 blocks tall at `chance: 0.3` and `density: 1`. Its drift boulders are 3 to 5 blocks tall at `chance: 0.4` and `density: 2`. Every entry has a chance below one. Large forms use organic supports with a 96-block terrain scan.

Overworld supplies the geometry, chances, variant seeds, placement modes, and support settings. Underworld applies soul-soil and bone palettes, or blackstone and crying obsidian palettes. Magnetic glass formations and frozen cave formations retain their separate procedural pools.

Both packs use `scale.size: 0.375` for rocks and boulders in five frozen cave families: `ice`, `ice-lite`, `ice-ravine`, `frost-shards`, and `glacial`. Their procedural formations bake directly at cave scale. Those cave formations require an anchor owned by their exact frozen cave biome. They reject fluid or default-lava cells. They cannot leak into the global Deep Dark band or its lava layer.

Pallid Necropolis contains no Denmyre objects. It places only a broad, cohesive procedural willow at `chance: 0.24` and a narrow clustered spindle at `chance: 0.14`. Both use `density: 1`. The pale-oak Denmyre object family instead belongs exclusively to `temperate/pale-denmyre`. The Underworld keeps the same biome placement and tree geometry with warped materials.

Swamp Beach uses one `chance: 0.004` turtle-egg decorator. The decorator has weighted one-, two-, and three-egg nest states. It averages about one compact nest per full biome chunk instead of three independent default-chance carpets. Field-by-field meanings are in [11 - Dimensions](/iris/11-dimensions).

Both packs disable standalone cave aquifers and retain contained hydrology, natural surface fluids, and separate deep-lava controls. They share the `deep_lava` and `deep_lava_small` profiles. The smaller profile uses density `1.5`, spacing `320`, and contained lava pools across Y `-160..40`.

Jungle cave trees use `scale.size: 0.375` and `density: 2`. Lush, Moss Pillars, and Swamp cave trees use `density: 2`, as do the two Mushroom cave fungi placements. These settings also apply to each child. Amethyst Rainforest large trees use `FAST_STILT` in both packs, with no random vertical translation.

The 13 compensated ordinary ore passes use Iris's unrestricted solid-host mode while buried or facing `minecraft:cave_air`: themed sandstone, organic, ice, amethyst, volcanic, and prismatic cave bodies can receive ore, while air and fluids remain ineligible. The independent surface allowlist narrows only exterior terrain candidates to exact `minecraft:stone`. Specialized high, ultra-low, badlands, and mountain passes retain their explicit stone-family host allowlists.

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

## Editing safely

### Author in Studio, on a fork

1. Confirm `overworld` exists under `packs/overworld/`.
2. Fork it: `/iris studio create name=my-overworld template=overworld`.
3. Open Studio: `/iris studio open my-overworld seed=1337`.
4. Edit under `packs/my-overworld/` with the generated VSCode workspace and schemas ([10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas)).
5. Save. Hotload picks the change up. Generate new chunks to see it. Existing blocks are never rewritten.
6. Isolate with `"focus": "temperate/plains"` or `"focusRegion": "temperate"` while testing. Remove both afterwards.
7. Make one small change at a time. Nudge `biomes/temperate/plains.json` generator `min`/`max` by a few blocks. Validate. Compare the same seed in fresh chunks.
8. Close Studio. Create a disposable world from the fork. Restart-test it before touching anything real.

### Do not edit world epochs

Files below `<dimensionRoot>/iris/generation/` are immutable runtime state. Never edit or replace them. Author under `packs/`, validate there, and stage an activation.

## Practical recipes

### Change sea level

Set `fluidHeight` in `dimensions/my-overworld.json`. Default value `50`. It is world Y. Every biome generator band is measured from it. Lowering it lowers the sea while leaving relative terrain heights intact. Raising it drowns low biomes. Existing chunks remain unchanged; a staged update blends new surface terrain from the frozen edge and starts new hydrology outside the protected band.

### Add a biome to a region

1. Create `biomes/temperate/my-biome.json` with at least `name`, `derivative`, `layers`, and `generators` ([26 - Example - Minimal Dimension](/iris/26-example-minimal-dimension), [13 - Biomes](/iris/13-biomes)).
2. Append `"temperate/my-biome"` to the appropriate list in `regions/temperate.json`: `landBiomes`, `seaBiomes`, `shoreBiomes`, or `caveBiomes`.
3. Hotload, then sample with `/iris what biome` and `/iris find biome`.

Region lists must match real biome load keys. A key that does not resolve is a blocking validation error. A biome file that no region lists is silently dead.

### Change plains height

Edit `generators` `min`/`max` on `biomes/temperate/plains.json` to affect only that biome. Or edit `generators/plain.json` to affect every biome that references `plain`, which is a lot of them. Prefer the biome-level change unless you mean the global one.

### Loot

- Dimension fallback: `dimensions/overworld.json` → `loot.tables`
- Region: `regions/temperate.json` → `loot`
- Tables live under `loot/` (`global-clutter`, `global-treasure`, `temperate/food`, …)

Mode `FALLBACK` only supplies tables when the object itself declared none. `ADD` stacks onto the parent scopes. `CLEAR` and `REPLACE` drop them.

### Decorators via snippets

Reuse `snippet/decorator/*` and `snippet/style/*` by string reference as in [24 - Pack Mods & Snippets](/iris/24-pack-mods-snippets). Existing examples: `biomes/vanilla/old_growth_birch_forest.json` and the dimension ore `chanceStyle` fields.

### Entities and spawners

The pack includes `entities/standard/**` and `spawners/**`. Ambient Iris spawning requires listing spawner keys on `entitySpawners` at dimension, region or biome scope. Marker-based spawning needs markers plus a `markers` array on an object placement. See [23 - Loot, Entities, Spawners, Markers](/iris/23-loot-entities-spawners-markers).

## Pushing changes into an existing world

World creation records the first pack epoch. Changing `packs/` does **not** update an existing world until you stage and restart it.

### `/iris dev update-world` (Bukkit)

```
/iris dev update-world world=<world> pack=my-overworld confirm=true
```

1. Without `confirm=true` it prints the warning and does nothing.
2. Adds a content-addressed immutable epoch and pending activation. It never overwrites an epoch that owns chunks.
3. Requests a restart. Already generated chunks keep their old activation; new chunks blend to the new pack. Back up the complete dimension root first.

On Fabric, Forge, and NeoForge use `/iris world update <dimension> my-overworld`. It stages the same history transition and keeps the current runtime active until restart.

### Choosing between update-world and a new world

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

## Update an existing world

Back up the complete target dimension, including `iris/generation/`, then stage the pack and restart. See [Pack Management](/iris/25-pack-management) for the platform-specific commands.

## Cross-links

- Minimal greenfield pack: [26 - Example - Minimal Dimension](/iris/26-example-minimal-dimension)
- Dimension field reference: [11 - Dimensions](/iris/11-dimensions)
- Commands and permissions: [04 - Commands & Permissions](/iris/04-commands-permissions)
- Download, validate, package: [25 - Pack Management](/iris/25-pack-management)
