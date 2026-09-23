---
title: "Vanilla Passthrough"
description: "Iris documentation: Vanilla Passthrough"
published: true
date: 2026-09-23T11:12:42.385Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-20T00:00:00.000Z
---
Iris replaces the chunk generator, not every vanilla system. Native structures still generate unless you deny them, placed features stay off unless you opt in, carvers never run, and mob spawning, loot, saplings, and dimension-type gameplay each have their own default. Use these settings to select vanilla features, mobs, loot, sapling growth, and dimension gameplay.

Related:

- [11 - Dimensions](/iris/11-dimensions)
- [13 - Biomes](/iris/13-biomes)
- [16 - Surfaces, Decorators & Deposits](/iris/16-surfaces-decorators-deposits)
- [17 - Procedural Objects](/iris/17-procedural-objects)
- [17b - Procedural Trees](/iris/17b-procedural-trees)
- [18 - Structures Overview](/iris/18-structures-overview)
- [20 - Object Placement](/iris/20-object-placement)
- [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks)
- [23 - Loot](/iris/23-loot)
- [23b - Entities & Spawners](/iris/23b-entities-spawners)

Generation changes apply to new chunks. For a production world, stage edits with `/iris developer update-world world=<w> pack=<dim> confirm=true`, then restart, or open a fresh world.

## Pick a task

| Goal | Go to |
|---|---|
| Stop a vanilla structure, or place one only where you choose | [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks) Tasks 3 and 4 |
| Import vanilla ores, geodes, springs, or snow without vanilla trees | Task 1 |
| Stop vanilla mobs, add pack mobs, or run both | Task 2 |
| Keep vanilla chest loot, replace it, or fill only empty chests | Task 3 |
| Make grown saplings become pack trees | Task 4 |
| Change beds, raids, piglins, portals, compasses, or clouds | Task 5 |
## What vanilla still does

Vanilla and mod worldgen run only where Iris runs them.

| System | Default | Control |
|---|---|---|
| Structures (vanilla, datapack, mod) | **On** | `importedStructures.disabled` / `disabledExact`. Re-place with `nativeStructures`. See [22](/iris/22-native-structures-datapacks) |
| Placed features: ores, trees, plants, springs, geodes, monster rooms, lakes, snow layers | **Off** | `importedFeatures.enabled`, then `steps` / `disabledSteps` / `disabled` |
| Carvers (caves, canyons, mod carvers) | **Never** | No pack switch. Use `caveProfile` and `carving[]` |
| Surface builders and surface rules | **Never** | Pack palettes |
| Vanilla natural mob spawning | **On** via `vanillaDerivative`, else `derivative` | There is no deny list. Custom `spawns` merge with vanilla. Iris `entitySpawners` are a second loop |
| Vanilla sapling growth | **On** | `treeSettings.enabled` plus object `trees[]` |
| Dimension-type gameplay | Inherited from `environment` | `dimensionOptions` |
| Native structure loot | **Kept** | Iris `loot` `FALLBACK` does not overwrite a chest that already has a vanilla table |
| Entity drops | Vanilla until an Iris entity `loot` is set | Entity loot **replaces** vanilla drops |
| Block drops | Vanilla plus any `blockDrops` | `replaceVanillaDrops: true` suppresses vanilla |

The bundled overworld leaves `importedFeatures` off, keeps native structures on with terrain `adjustments`, and replaces only ancient cities. It reimplements ores as Iris `deposits` and caves as `caveProfile`.

## Task 1: Import selected vanilla features

Use this when Iris terrain should also run Minecraft's placed-feature pass: ores, geodes, monster rooms, lava lakes, freeze/snow layers. The pass is **off** until you set `enabled: true`. Features come from the biome's `vanillaDerivative`, not from Iris biome files, and carvers are never imported.

### Keep Iris trees, import vanilla ores and snow

1. Merge this into the dimension JSON:

```json
{
  "importedFeatures": {
    "enabled": true,
    "steps": ["UNDERGROUND_ORES", "FLUID_SPRINGS", "TOP_LAYER_MODIFICATION"],
    "disabledSteps": ["VEGETAL_DECORATION"],
    "disabled": ["minecraft:ore_diamond"]
  }
}
```

2. Confirm every biome that should receive those features has a matching `vanillaDerivative` (or `derivative`). A plains derivative receives plains ores. A void derivative receives nothing useful.
3. Validate the pack, stage a world activation or open a fresh world, restart, and generate new chunks.

**Success:** diamond ore is absent if you denied it, other vanilla ores and snow layers appear, and Iris procedural trees and `objects[]` trees are not doubled by vanilla tree features.

| Field | Default | Meaning |
|---|---|---|
| `enabled` | `false` | Master switch. Absent or false leaves chunk output identical to a pack without this block |
| `steps` | empty = all | Allow-list of decoration steps |
| `disabledSteps` | empty | Deny-list applied after `steps`. `VEGETAL_DECORATION` is the usual cut for packs that grow their own trees |
| `disabled` | `[]` | Placed-feature key deny list. Prefix matching is the same as `importedStructures.disabled`: `"minecraft:ore"` covers every vanilla ore, `"minecraft:trees"` covers every tree placement |

Vanilla step order: `RAW_GENERATION`, `LAKES`, `LOCAL_MODIFICATIONS`, `UNDERGROUND_STRUCTURES`, `SURFACE_STRUCTURES`, `STRONGHOLDS`, `UNDERGROUND_ORES`, `UNDERGROUND_DECORATION`, `FLUID_SPRINGS`, `VEGETAL_DECORATION`, `TOP_LAYER_MODIFICATION`.

The pass runs after Iris structures, so early-step features can cut into placed structures.

A cold `derivative` tints grass and can freeze water but does **not** stamp snow layers. Snow layers need Iris decorators, object `snow`, or this task with `TOP_LAYER_MODIFICATION`. Iris `postProcessing` only paints slabs and walls from biome palettes.

The bundled overworld does not enable this. It places ores with `deposits` using `shape: VANILLA_ELLIPSOID`. Deposit `minHeight` / `maxHeight` are engine-local Y (`worldY - dimensionHeight.min`), `depositVariants` bands are absolute world Y, and `biomeScope` defaults to `CAVE`. Palette `weight` is ignored on deposits; duplicate the block entry instead.

## Task 2: Control mob spawning

These three sources can spawn mobs together. Configuring one does not disable the others.

| Source | Default | What it does |
|---|---|---|
| Vanilla natural spawning | **On** | Spawn tables of `vanillaDerivative`, else `derivative` |
| `customDerivitives.spawns` | Empty | **Merged** with vanilla when both lists are nonempty. An empty custom list leaves vanilla in charge |
| `entitySpawners` | Empty unless listed | Additional pack spawns; requires `world.ambientEntitySpawningSystem` (default true) |

There is no `importedStructures.disabled` equivalent for mobs.

### Replace vanilla mobs with a custom list

1. Give the biome a derivative whose vanilla spawn table is empty, such as `minecraft:the_void`. `vanillaDerivative` also drives structures, imported features, and tag inheritance, so a plains `vanillaDerivative` still injects plains mobs even if `derivative` is void.
2. Put the mobs you want on `customDerivitives` (that spelling). `customDerivatives` is ignored.

```json
{
  "derivative": "minecraft:the_void",
  "customDerivitives": [
    {
      "id": "meadow",
      "category": "plains",
      "spawnRarity": 7,
      "spawns": [
        { "type": "minecraft:cow", "minCount": 2, "maxCount": 4, "weight": 8, "group": "CREATURE" },
        { "type": "minecraft:zombie", "minCount": 1, "maxCount": 4, "weight": 10, "group": "MONSTER" }
      ]
    }
  ]
}
```

3. If you also list `entitySpawners`, those Iris mobs still appear on top of the custom table. Omit the list when the custom table should be the only pack source.
4. Validate, stage and restart the world activation or open a fresh world, and wait through a night and a day in new chunks.

**Success:** the vanilla derivative's cows and zombies are gone. Only the listed custom entries (and any Iris spawners you kept) appear.

Adding custom colors or fog without `spawns` does **not** stop vanilla mobs, and Iris spawners never replace vanilla. `maxEntitiesPerChunk` on an Iris spawner defaults to `1`. `world.forcePersistEntities` (default true) marks Iris-spawned mobs persistent, so they do not despawn like vanilla.

Studio worlds freeze noon and clear weather when `studio.disableTimeAndWeather` is true (the default). Night and storm Iris spawners never fire there until you set that false or test in a production world.

## Task 3: Keep or replace vanilla loot

Loot ownership depends on what created the container.

| Source | Default | How to change it |
|---|---|---|
| Native / datapack structure chest | Vanilla loot table stays | Iris dimension/region/biome `loot` does not overwrite a table already on the block. `FALLBACK` only fills when nothing claimed it |
| Iris object chest | Pack tables, plus any `vanillaLoot` | Placement `loot` / `vanillaLoot` / `overrideGlobalLoot` |
| Iris-spawned mob | Vanilla drops until entity `loot` is set | Entity `loot` **replaces** vanilla drops. `mode` and `multiplier` on an entity are ignored |
| Broken block | Vanilla drops, plus `blockDrops` | `replaceVanillaDrops: true` suppresses vanilla. `skipParents: true` on a biome provider stops region and dimension providers |

### Keep village loot, fill Iris clutter chests, replace one dungeon

1. Leave native structures generating, or place them with `nativeStructures`. Do not put `overrideGlobalLoot` on those placements. Village chests keep `minecraft:chests/village_*`.
2. Use dimension `loot.mode: FALLBACK` for pack clutter, which is what the bundled overworld does:

```json
{
  "loot": {
    "mode": "FALLBACK",
    "tables": ["global-clutter"]
  }
}
```

3. On the Iris object that should ignore pack tables and roll a vanilla dungeon table:

```json
{
  "place": ["tutorial/dungeon"],
  "overrideGlobalLoot": true,
  "vanillaLoot": [
    { "name": "minecraft:chests/simple_dungeon", "weight": 1 }
  ]
}
```

4. Open a native village chest, an Iris clutter chest with no baked table, and the dungeon object. Chests fill during `world.postLoadBlockUpdates` (default true); with that setting off, generated chests stay empty.

**Success:** the village chest still has vanilla village loot. The clutter chest rolled `global-clutter`. The dungeon chest rolled the vanilla dungeon table and nothing from the dimension fallback.

`CLEAR` drops parent pack tables and contributes nothing even if `tables` is filled. `REPLACE` drops parent pack tables and then adds these. Neither mode strips a native loot table already stored on the block.

## Task 4: Replace grown saplings with pack trees

Vanilla sapling growth continues until you opt in. Pack procedural trees and `objects[]` trees do not change what a player grows.

1. Enable the dimension gate:

```json
{
  "treeSettings": {
    "enabled": true,
    "mode": "FIRST"
  }
}
```

2. On a biome or region object placement, map Bukkit `TreeType` names and sapling footprints to that placement's objects:

```json
{
  "place": ["trees/oak/large"],
  "trees": [
    {
      "treeTypes": ["TREE", "BIG_TREE"],
      "sizes": [{ "width": 1, "depth": 1 }, { "width": 2, "depth": 2 }]
    }
  ]
}
```

3. Grow an oak sapling in a freshly generated chunk of that biome.

**Success:** the sapling becomes one of the placement objects, not a vanilla oak.

`mode: FIRST` uses biome matches and falls back to region matches only when the biome has none; `ALL` pools both and picks randomly. Dimension-level object placements are never consulted. Matching is case-insensitive on `treeTypes` only.

This is unrelated to the tree feller (`iris.json` `treeFeller.enabled`, permission `iris.treefeller`).

## Task 5: Dimension-type gameplay

`environment` picks the vanilla dimension template (`NORMAL`, `NETHER`, `THE_END`); `CUSTOM` uses the overworld template. `dimensionOptions` then overrides individual attributes. None of these change terrain.

```json
{
  "environment": "NORMAL",
  "dimensionOptions": {
    "bedWorks": "FALSE",
    "raids": "FALSE",
    "piglinSafe": "TRUE",
    "natural": "TRUE",
    "coordinateScale": 1,
    "cloudHeight": null
  }
}
```

| Field | Default | Effect |
|---|---|---|
| `ultrawarm` | `DEFAULT` | Water evaporates, sponges dry, snow golems melt, lava spreads fast |
| `natural` | `DEFAULT` | False: compasses spin, beds cannot set spawn. True: nether portals spawn zombified piglins |
| `piglinSafe` | `DEFAULT` | False: piglins and hoglins zombify here |
| `respawnAnchorWorks` | `DEFAULT` | False: the anchor explodes |
| `bedWorks` | `DEFAULT` | False: beds explode |
| `raids` | `DEFAULT` | Whether Bad Omen can start a raid |
| `skylight` | `DEFAULT` | False: permanently dark, regardless of terrain |
| `ceiling` | `DEFAULT` | Logical bedrock ceiling for the client and gameplay. Independent of actual terrain |
| `coordinateScale` | `-1` (unset) | Portal coordinate multiplier leaving this dimension. `8` is nether compression |
| `ambientLight` | `-1` (unset) | 0 to 1 light floor. A resolved `1` also forces white ambient light color |
| `fixedTime` | `-1` (unset) | Locks the day cycle to this tick |
| `cloudHeight` | `-1` (unset) | Cloud Y. `null` disables clouds |
| `monsterSpawnBlockLightLimit` | `-1` (unset) | Maximum block light at which hostile mobs may spawn |

Tri-state values are `DEFAULT`, `TRUE`, or `FALSE`. `DEFAULT` inherits from the template. Numeric `-1` means unset. `fullbright: true` sets `ambientLight` to `1.0`.

`logicalHeight` is what nether-portal search and chorus fruit respect. The bundled overworld is 768 blocks tall (`-256` to `512`) with `logicalHeight: 512`.

`/iris replace` of `minecraft:overworld` keeps vanilla portal pairing with `minecraft:the_nether`. A separately created `iris:*` world is outside that pair. See [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle).

## Related reference

See [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks). Mod authors can find the `importedFeatures` API contract on [94 - API - Modded](/iris/94-api-modded).
