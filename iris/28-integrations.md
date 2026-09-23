---
title: "Integrations"
description: "Iris documentation: Integrations"
published: true
date: 2026-09-23T11:12:42.385Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Install supported integrations separately to use their items, blocks, entities and tools in Iris. Tree felling is included in Iris and works on Bukkit and mod loaders.

See also [04 - Commands & Permissions](/iris/04-commands-permissions), [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle), [09 - PlaceholderAPI](/iris/09-placeholderapi), [19 - Objects](/iris/19-objects), and [93 - API - Tree Feller](/iris/93-api-tree-feller).

## Install an integration

Install the integration and its dependencies, load its content, then restart the server before opening the Iris pack.

## WorldEdit

| Use | Behavior |
|---|---|
| Selection | Select both corners with WorldEdit in the world where you run the import command |
| Wand commands and outlines | Require an Iris wand in the main hand. WorldEdit wands and selections do not activate Iris selection commands or automatic particle outlines |
| `/iris object we` | Checks WorldEdit is enabled, reads your current selection, and puts a **new Iris object wand into your inventory** already carrying those two corners |
| After import | Hold the new Iris wand to edit, preview, or save its selection. Later WorldEdit selection changes do not change the copied corners |

Enabling WorldEdit after Iris works without a restart. WorldEdit is not required to import `.schem` files. See [19 - Objects](/iris/19-objects).

## Multiverse-Core

Read [34 - Multiverse](/iris/34-multiverse) before you run any Multiverse command against an Iris world.

Use Multiverse to list, inspect, teleport to and configure Iris worlds. Use Iris commands to create, delete or replace them. Multiverse creation, deletion, regeneration and cloning are not supported for Iris worlds.

| Operation | Behavior |
|---|---|
| World create or update | Iris registers the world with Multiverse itself, with generator `Iris:<pack>`, `auto-load` off, and spawn-adjust off. It re-asserts those values on every startup |
| World remove | `/iris remove` clears the Multiverse entry along with the folder, the `bukkit.yml` entry, and the Iris registry entry |
| Destructive Multiverse commands | `/mv delete`, `/mv regen`, and `/mv clone` are refused with the Iris command to use instead |
| `/mv load` | Iris performs the load and hands the world back to Multiverse |
| Multiverse absent or disabled | Every Multiverse call is a no-op. Iris world creation and removal work normally |

Keep Multiverse `auto-load` disabled for Iris worlds.

## PlotSquared

Create Iris worlds with `/iris create` and plot worlds through PlotSquared. Both can run on the same server in separate worlds. Iris is not a base generator option in PlotSquared's setup wizard.

## External item, block, and entity plugins

Reference installed custom content by its namespaced ID. Blocks accept the plugin's native ID or an explicit provider ID as shown below.

| Plugin | Content IDs | Types |
|---|---|---|
| CraftEngine | Named item, block and furniture keys in any namespace | ITEM, BLOCK |
| Nexo | Registered items, blocks, and furniture under namespace `nexo` | ITEM, BLOCK |
| Oraxen | Registered items and blocks under namespace `oraxen`. Furniture is excluded | ITEM, BLOCK |
| ItemsAdder | Registered block and item keys | ITEM, BLOCK |
| ExecutableItems | Namespace `executable_items` | ITEM |
| MMOItems | Items: `mmoitems_<type>:<item-id>`, for example `mmoitems_sword:excalibur`. Blocks: `mmoitems:<numeric-id>` | ITEM, BLOCK |
| EcoItems | Namespace `ecoitems` | ITEM |
| MythicMobs | Namespace `mythicmobs` | ENTITY |
| MythicCrucible | Items under `crucible`. Blocks require a registered block or furniture context | ITEM, BLOCK |
| KGenerators | Items under `kgenerators`. Blocks require a registered generator ID | ITEM, BLOCK |

### Use a custom block in a pack

Install the provider and its dependencies before loading the Iris pack, and wait for the provider to finish loading its content registry.

1. Confirm the provider can place the block with its own command.
2. Put its ID in an Iris palette entry. For an ItemsAdder block named `forest:amber_ore`:

   ```json
   {
     "block": "itemsadder:forest/amber_ore",
     "backup": { "block": "minecraft:stone" }
   }
   ```

3. Validate the pack with `/iris pack validate pack=<pack>`.
4. Generate a fresh chunk that uses that palette.
5. Confirm the provider recognizes the placed block and supplies its configured drops.

| Provider | Native block ID in Iris | Explicit provider ID in Iris |
|---|---|---|
| ItemsAdder | `forest:amber_ore` | `itemsadder:forest/amber_ore` |
| CraftEngine | `forest:amber_ore` | `craftengine:forest/amber_ore` |
| Oraxen | `oraxen:amber_ore` | `oraxen:oraxen/amber_ore` |
| Nexo | `nexo:amber_ore` | `nexo:nexo/amber_ore` |
| MMOItems | `mmoitems:1` | `mmoitems:mmoitems/1` |

The explicit format is `<plugin-id-lowercase>:<native-namespace>/<native-key>`, and the native key can contain more slashes. A matching explicit form takes precedence.

A native ID resolves only when one active provider claims that exact block. If two providers claim it, Iris logs the qualified alternatives and leaves the native ID unresolved — use an explicit ID to select the intended provider. An explicit ID for an unavailable provider does not route to another plugin. Installed blocks and their qualified forms appear in Studio schema completion.

Block properties use the palette entry's `data` object or a state suffix, `namespace:key[property=value]`. Only properties supported by that provider have meaning: ItemsAdder and Oraxen blocks expose none and reject nonempty property maps, CraftEngine exposes its block and furniture properties, Nexo exposes its furniture properties. Malformed suffixes and duplicate properties fail resolution.

Custom blocks finish placement when players approach or chunks are force-loaded. Keep the surrounding 3×3 chunks loaded while inspecting them. Pack aliases and saved objects retain custom IDs and properties.

An unresolved block uses the normal dimension fallback chain and the entry's `backup`. A direct unresolved entry without a fallback returns air with a warning.

> Load custom content before creating an Iris world. If a required provider remains unavailable for 120 seconds, Iris leaves generation locked and shuts down. See [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle).
{.is-warning}

Clients need the provider's resource pack to display its custom textures and models.

### CraftEngine

Use CraftEngine 26.8.2. Use the named key from CraftEngine's content configuration; blocks also accept the qualified form `craftengine:namespace/block`, items use their native `namespace:item` key.

```json
{
  "block": "craftengine:default/palm_log",
  "data": { "axis": "x" }
}
```

Unknown properties and invalid values fail resolution instead of silently using the default state, and Studio schemas list installed blocks and their allowed properties. Wand saves, including imported WorldEdit selections, store CraftEngine's named block ID and complete properties. Object rotation updates standard orientation properties such as `axis` and `facing`. CraftEngine block paste, object previews and undo also work in vanilla worlds with CraftEngine installed.

Use furniture IDs in generated palettes or objects with `variant`, `yaw`, `pitch`, `randomYaw`, and `randomPitch`. Angles must be finite, at least zero, and below 360 degrees. Random angles depend on the world seed and placement coordinates, and an omitted variant selects the first variant in sorted order. Furniture appears after chunk generation; furniture entities are not captured by the wand or spawned by direct paste and previews.

### Per-provider caveats

| Provider | Caveat |
|---|---|
| CraftEngine | Numbered native states such as `craftengine:custom_18` resolve only while CraftEngine has that state loaded in that runtime. They are **not portable pack identifiers** — save objects with named content keys, because Iris cannot identify an old numbered state once its original mapping is gone |
| Oraxen | Oraxen 1.218.0 is incompatible with this Iris build and has no setting to disable its conflicting integration. Use a compatible Oraxen build ([Oraxen integration source](https://github.com/oraxen/oraxen/blob/v1.218.0/src/main/java/io/th0rgal/oraxen/compatibilities/CompatibilitiesManager.java)) |
| ItemsAdder | Its glitched-block repair can reset generated `REAL_NOTE` states before Iris registers their custom identity. The block corrects itself when Iris's deferred placement pass reaches the chunk, which can take seconds or longer for a chunk outside the nearby-player or force-loaded area. Fix below |

To stop the ItemsAdder note-block reset, update these keys in `plugins/ItemsAdder/config.yml` and restart:

```yaml
blocks:
  fix-glitched-blocks:
    enabled: false
```

This disables the repair across the server, including cleanup of old vanilla note blocks that use custom model states. `only-new-chunks: true` still runs repair on newly generated Iris chunks. See [ItemsAdder's repair configuration](https://wiki.itemsadder.com/faq/glitched-blocks/). Already-reset chunks still need Iris's placement pass once to restore their states.

### Add another provider

Adding an unsupported provider requires a plugin integration. See [90 - API - Getting Started](/iris/90-api-getting-started).

## MythicMobs skill conditions

When MythicMobs is active it gives Iris two location conditions.

| Condition | Fields | What it checks |
|---|---|---|
| `irisbiome` | `biome` / `b` — comma-separated biome load keys. `surface` / `s` — boolean, default `false` | With `s=true`, the surface biome at the target's X/Z. With the default `s=false`, the biome at the target's actual Y, which includes cave and mantle biomes |
| `irisregion` | `region` / `r` — comma-separated region load keys | The region load key at the target's X/Z |

Both compare against **load keys**, not display names, and both return `false` when the target world is not an Iris world or its engine is unavailable. A condition can fail quietly while a world is still booting, so do not make a mob's only spawn gate an Iris condition during startup.

### RandomSpawns by Iris biome

Use `irisbiome` in a RandomSpawn's `Conditions` list to check the proposed spawn location. This example assumes an existing `ForestWolf` MythicMob, an Iris world named `example_world`, and a pack biome at `biomes/forest/pines.json`.

```yaml
PineWolves:
  Type: ForestWolf
  Worlds: example_world
  Action: ADD
  Chance: 0.02
  PositionType: LAND
  Conditions:
    - irisbiome{b=forest/pines;s=false} true
```

For `Action: ADD`, enable `GenerateSpawnPoints` in `plugins/MythicMobs/config/config-spawning.yml`. See the [MythicMobs RandomSpawns reference](https://wiki.mythiccraft.io/mythicmobs/Random-Spawns).

Multiple biome load keys use commas with no surrounding spaces, such as `b=forest/pines,forest/birch`. Matches are exact and case-sensitive, and the condition does not support wildcards.

| Biome identity | Use in a spawn rule |
|---|---|
| Pack load key, such as `forest/pines` | Accepted by `irisbiome{b=forest/pines}`. Omit `biomes/` and `.json` |
| Biome `name`, such as `Pine Forest` | Display text. `irisbiome` does not match it |
| Authored `customDerivitives[].id`, such as `pine_forest` | Identifies an authored custom derivative. `irisbiome` does not match it or distinguish derivatives within one pack biome |
| Physical Minecraft registry key | Used by MythicMobs' ordinary `Biomes:` filter and `biome` condition. Iris custom biomes use generated namespaced keys that include hashes |

Do not use an Iris player PlaceholderAPI value with `stringequals` as a RandomSpawn location filter. Player placeholders read the evaluated player's location, not the proposed spawn location, and `Action: ADD` provides no entity context ([MythicMobs PlaceholderAPI parsing rules](https://wiki.mythiccraft.io/mythicmobs/Skills/Placeholders#placeholderapi-parsing)).

If MythicMobs reports an unknown `irisbiome` condition, check that its Iris integration is active before loading the spawn rule again.

## PlaceholderAPI

Use the `iris` expansion placeholders listed in [09 - PlaceholderAPI](/iris/09-placeholderapi).

## React and Wormholes

- React provides Iris performance dashboards and controls. See [React — Iris, Adapt & Integrations](/react/07-features-iris-adapt-integrations).
- Wormholes supports biome-aware random teleportation in Iris worlds. See [Wormholes — Integrations](/wormholes/15-integrations).

## HiddenOre

Enable HiddenOre support in the pack dimension. Set `hideOresForHiddenOre` to `true` on the dimension and Iris writes no vanilla ore blocks, leaving HiddenOre to pay ore rewards when a player mines plain rock.

| Stage | Behavior when the flag is on |
|---|---|
| Terrain | Disables dimension, region and biome ore generation |
| Deposits, objects, vanilla passthrough | Replaces vanilla ores with their host rock: stone, deepslate, netherrack or blackstone. Modded and custom ores remain unchanged |

The flag applies to chunks Iris generates after you set it. Previously generated chunks keep their ores; inspect newly generated terrain to see the change.

Leave HiddenOre's own `[ore-removal]` disabled for an Iris world — Iris already replaces the vanilla ores. HiddenOre's bundled `[blocks.stone]` and `[blocks.deepslate]` tables match what an overworld dimension writes; a dimension whose rock is netherrack or blackstone needs a matching `[blocks.<material>]` table, or mining it pays nothing. HiddenOre's `min_y` and `max_y` are world Y, while an Iris ore `range` is engine-local Y where 0 is the bottom of the dimension, so the two sets of numbers do not carry across.

See [11 - Dimensions](/iris/11-dimensions), [16 - Surfaces, Decorators & Deposits](/iris/16-surfaces-decorators-deposits), and [HiddenOre — Configuration](/hiddenore/configuration).

## Tree feller

Enable tree felling, then break a log of an Iris-generated tree while sneaking with an axe. Iris removes the tree. This works on Bukkit, Fabric, Forge and NeoForge.

### Settings (`iris.json`)

| Key | Default | Meaning |
|---|---|---|
| `treeFeller.enabled` | `false` | Enables tree felling for players |
| `treeFeller.durabilityPreservationChance` | `0` | Percentage chance that a log costs no axe durability. Range: 0–100 |

### Permission

| Platform | Node | Default |
|---|---|---|
| Bukkit-family | `iris.treefeller` | `op` |
| Fabric | `irisworldgen:treefeller` | Permission level GAMEMASTERS (op level 2) |
| Forge / NeoForge | `irisworldgen:treefeller` | Permission level GAMEMASTERS (op level 2) |

### What has to be true to fell a tree

All of these, on every platform:

- `treeFeller.enabled` is `true`
- The player has the platform's tree-feller permission
- The player is in survival mode
- The player is sneaking
- The broken block is in the vanilla logs tag
- The main-hand item is in the axes tag
- The log belongs to an Iris-generated tree outside a structure

Player-grown trees and hand-built trunks are not eligible.

Bukkit plugins can also provide tree-felling integrations. See [93 - API - Tree Feller](/iris/93-api-tree-feller).

### Limits and cancellation

- Trees exceeding 131,072 members, 1,000,000 searched positions or 256 blocks on any axis from the broken block fall back to a normal single-block break.
- Removal happens gradually. Keep sneaking with the same axe until it finishes.
- Felling stops if you stop sneaking, change hotbar slots, swap hands or axes, leave survival mode or the world, or break the axe.
- Each log costs one durability point, subject to the preservation setting and unbreakable items. Leaves cost none.
- A second player cannot fell the same tree simultaneously; their overlapping break is cancelled without drops.

## Platforms

WorldEdit, Multiverse-Core, the external data providers, the Mythic conditions, and PlaceholderAPI are Bukkit-family only; mod loaders do not use these plugin declarations. The tree feller is the exception and runs on every platform. See [30 - Platform Differences](/iris/30-platform-differences).
