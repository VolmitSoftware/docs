---
title: "Integrations"
description: "Iris documentation: Integrations"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Every integration is optional, and Iris checks that a plugin is enabled before using it. A soft-depend only sets load order; it does not make the plugin present. Tree felling is a separate feature that runs on Bukkit and on the mod loaders.

See also [04 - Commands & Permissions](/iris/04-commands-permissions), [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle), [09 - PlaceholderAPI](/iris/09-placeholderapi), [19 - Objects](/iris/19-objects), and [93 - API - Tree Feller](/iris/93-api-tree-feller).

## Install an integration

Install the integration and its dependencies, then restart the server. External data providers log `Enabled ExternalDataProvider for <Plugin>.` when they load. If an integration is unavailable, check both plugin versions, dependencies, and startup errors before changing the pack.

## WorldEdit

| Use | Behavior |
|---|---|
| Reading a selection | Returns an Iris `Cuboid` for the player's current WorldEdit selection **in the world they stand in**. Returns `null` if WorldEdit is absent, the player has no session, or there is no selection in that world |
| Wand commands and outlines | Require an Iris wand in the main hand. WorldEdit wands and selections do not activate Iris selection commands or automatic particle outlines |
| `/iris object we` | Checks WorldEdit is enabled, reads your current selection, and puts a **new Iris object wand into your inventory** already carrying those two corners |
| After import | Hold the new Iris wand to edit, preview, or save its selection. Later WorldEdit selection changes do not change the copied corners |

Enabling WorldEdit after Iris works without a restart. WorldEdit is not needed to import `.schem` files — Iris parses schematic NBT itself. See [19 - Objects](/iris/19-objects).

## Multiverse-Core

Read [34 - Multiverse](/iris/34-multiverse) before you run any Multiverse command against an Iris world.

The short version: Multiverse can list, inspect, teleport to, and configure Iris worlds. It cannot create, delete, regenerate, or clone them. Those are refused, because an Iris world is a dimension inside the level carrying world-local generation history, not a folder in the world container, and Multiverse's folder operations would destroy that history.

| Operation | Behavior |
|---|---|
| World create or update | Iris registers the world with Multiverse itself, with generator `Iris:<pack>`, `auto-load` off, and spawn-adjust off. It re-asserts those values on every startup |
| World remove | `/iris remove` clears the Multiverse entry along with the folder, the `bukkit.yml` entry, and the Iris registry entry |
| Destructive Multiverse commands | `/mv delete`, `/mv regen`, and `/mv clone` are refused with the Iris command to use instead |
| `/mv load` | Iris performs the load and hands the world back to Multiverse |
| Multiverse absent or disabled | Every Multiverse call is a no-op. Iris world creation and removal work normally |

`auto-load = false` is deliberate: Iris owns the load lifecycle of its worlds, and if Multiverse also loaded them at startup the two would race.

## PlotSquared

PlotSquared probes every enabled plugin for a generator using the synthetic world name `CheckingPlotSquaredGenerator`. Iris recognizes that probe and returns no generator, so Iris is not offered as a base generator in PlotSquared's setup wizard. Create Iris worlds with `/iris create` and plot worlds through PlotSquared; the two can own separate worlds on the same server.

## External item, block, and entity plugins

A provider is created for each supported plugin that is enabled, and a plugin that enables after Iris is still picked up. Packs then reference external content by namespaced id. Block lookups accept a native key or an explicit provider key; item and entity lookups keep their provider-specific identifier formats.

| Plugin id | Provider class | Claims | Types |
|---|---|---|---|
| CraftEngine | `CraftEngineDataProvider` | Exact registered item, block, and furniture keys in any namespace. Registries refresh on `CraftEngineReloadEvent` | ITEM, BLOCK |
| Nexo | `NexoDataProvider` | Registered items, blocks, and furniture under namespace `nexo` | ITEM, BLOCK |
| Oraxen | `OraxenDataProvider` | Registered items and blocks under namespace `oraxen`. Furniture is excluded | ITEM, BLOCK |
| ItemsAdder | `ItemAdderDataProvider` | Exact registered block keys. Item namespaces come from the item registry. Both refresh on `ItemsAdderLoadDataEvent` | ITEM, BLOCK |
| ExecutableItems | `ExecutableItemsDataProvider` | Namespace `executable_items` | ITEM |
| MMOItems | `MMOItemsDataProvider` | Items: `mmoitems_<type>:<item-id>`, for example `mmoitems_sword:excalibur`. Blocks: `mmoitems:<numeric-id>` | ITEM, BLOCK |
| EcoItems | `EcoItemsDataProvider` | Namespace `ecoitems` | ITEM |
| MythicMobs | `MythicMobsDataProvider` | Namespace `mythicmobs` | ENTITY |
| MythicCrucible | `MythicCrucibleDataProvider` | Items under `crucible`. Blocks require a registered block or furniture context | ITEM, BLOCK |
| KGenerators | `KGeneratorsDataProvider` | Items under `kgenerators`. Blocks require a registered generator ID | ITEM, BLOCK |

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

Iris generates the backing block state first, then calls the provider's placement API during chunk updates near players or for force-loaded chunks, which requires the surrounding 3x3 chunks to be loaded. Pack `blocks/` aliases and object serialization retain custom IDs and provider properties, and fractional properties such as furniture yaw keep their precision.

An unresolved block uses the normal dimension fallback chain and the entry's `backup`. A direct unresolved entry without a fallback returns air with a warning.

> Load provider content before creating a new Iris world. Iris binds its generator from the frozen dimension contract, validates the saved pack, and starts the engine when provider content is ready, rejecting generation during the wait. **A provider that remains unavailable for 120 seconds leaves generation locked and triggers shutdown.** See [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle).
{.is-warning}

Clients need the provider's resource pack to display its custom textures and models.

### CraftEngine

Iris targets the CraftEngine 26.8.2 API. Use the named key from CraftEngine's content configuration; blocks also accept the qualified form `craftengine:namespace/block`, items use their native `namespace:item` key.

```json
{
  "block": "craftengine:default/palm_log",
  "data": { "axis": "x" }
}
```

Unknown properties and invalid values fail resolution instead of silently using the default state, and Studio schemas list installed blocks and their allowed properties. Wand saves, including imported WorldEdit selections, store CraftEngine's named block ID and complete properties. Object rotation updates standard orientation properties such as `axis` and `facing`. Direct block paste, object previews, and block undo use CraftEngine's placement API, and work in vanilla worlds with CraftEngine installed. Other providers and native-structure terrain preparation use carrier states in those direct paths instead.

Use furniture IDs in generated palettes or objects with `variant`, `yaw`, `pitch`, `randomYaw`, and `randomPitch`. Angles must be finite, at least zero, and below 360 degrees. Random angles depend on the world seed and placement coordinates, and an omitted variant selects the first variant in sorted order. Furniture is placed during deferred generation updates; furniture entities are not captured by the wand or spawned by direct paste and previews.

### Per-provider caveats

| Provider | Caveat |
|---|---|
| CraftEngine | Numbered native states such as `craftengine:custom_18` resolve only while CraftEngine has that state loaded in that runtime. They are **not portable pack identifiers** — save objects with named content keys, because Iris cannot identify an old numbered state once its original mapping is gone |
| Oraxen | Oraxen 1.218.0 unconditionally loads its own Iris integration against the old `com.volmit.iris` API and fails during startup with this Iris build. Use an Oraxen build that removes that embedded integration; the stock release has no setting to disable the hook, and Iris ships no old-package shim ([source](https://github.com/oraxen/oraxen/blob/v1.218.0/src/main/java/io/th0rgal/oraxen/compatibilities/CompatibilitiesManager.java), [block API](https://docs.oraxen.com/developers/api)) |
| ItemsAdder | Its glitched-block repair can reset generated `REAL_NOTE` states before Iris registers their custom identity. The block corrects itself when Iris's deferred placement pass reaches the chunk, which can take seconds or longer for a chunk outside the nearby-player or force-loaded area. Fix below |
| Any custom-block carrier | Unrelated custom blocks can break on the first attempt in Creative and Survival when no loaded pack drop rule can match the material. A potentially matching rule or an unloaded historical pack still requires the saved-biome check ([Custom block drops](/iris/23-loot)). ItemsAdder retains control of its own break and drop handling |

To stop the ItemsAdder note-block reset, update these keys in `plugins/ItemsAdder/config.yml` and restart:

```yaml
blocks:
  fix-glitched-blocks:
    enabled: false
```

This disables the repair across the server, including cleanup of old vanilla note blocks that use custom model states. `only-new-chunks: true` still runs repair on newly generated Iris chunks. See [ItemsAdder's repair configuration](https://wiki.itemsadder.com/faq/glitched-blocks/). Already-reset chunks still need Iris's placement pass once to restore their states.

> A custom block in `rockPalette` fills the solid terrain beneath the surface, so even a flat world can require thousands of provider placements per chunk. With `dimensionHeight.min: -64`, `fluidHeight: -64`, and a flat generator whose `min` and `max` are both `64`, the surface is at world Y=0 and the fill is 65 layers x 16 x 16 = 16,640 custom blocks per chunk. Use the biome's surface layers when only the surface needs that block — a surface layer does not remove the rock fill underneath it.
{.is-warning}

### Add another provider

A developer extension point. Implement `ExternalDataProvider` and register it through `ExternalDataSVC#registerProvider`.

| Method | Contract |
|---|---|
| `isValidProvider(id, BLOCK)` | Return exact ownership |
| `getTypes(BLOCK)` | Enumerate native IDs. The service qualifies them with the registered plugin name |
| `isReady()` | Readiness for a provider with delayed content loading. Call `ExternalDataSVC#notifyContentChanged()` once the registry is ready or changes |
| `getBlockData` | Must resolve without touching world state. Return ordinary `BlockData` when the state alone is enough, otherwise `IrisCustomData.of(base, nativeId)` with supported properties in the deferred native ID, and implement `processUpdate` to call the placement API. Let placement failures propagate so pending data survives |
| `identifyBlock(BlockData)` | Return a named native ID with its properties when capturing a placed block, or an empty optional for unrecognized states |
| `placeBlock(Block, Identifier)` | Optional direct placement hook for object paste, previews and undo. Return `true` only after placement succeeds, `false` when the content needs deferred placement |

Registration rejects a plugin ID that belongs to a built-in provider or one already registered. A provider implementing `Listener` registers its event handlers automatically, and an activation failure logs its stack trace without taking down other providers.

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

Expansion id `iris`, soft-depended. Registration timing, all twenty-nine keys, and the pre-2.0 migration table are in [09 - PlaceholderAPI](/iris/09-placeholderapi).

## React and Wormholes

Both integrations live in the consuming plugin, not in Iris's optional-dependency list.

- **React** reads Iris's registered integration contract for engine, world, chunk-generation, cache, mantle, and pregeneration metrics, and uses them in Iris dashboards, samplers, pressure overlays, and surge guards. Without Iris, those metrics and features are never registered. Configuration in [React — Iris, Adapt & Integrations](/react/07-features-iris-adapt-integrations).
- **Wormholes** asks an open Iris engine for reachable pack biomes, the biome at a candidate, authored terrain height, and fluid state before loading a random-teleport destination chunk. Without Iris it falls back to chunk-backed biome and landing-safety checks. Details in [Wormholes — Integrations](/wormholes/15-integrations).

## HiddenOre

HiddenOre needs no code link; it is a pack setting. Set `hideOresForHiddenOre` to `true` on the dimension and Iris writes no vanilla ore blocks, leaving HiddenOre to pay ore rewards when a player mines plain rock.

| Stage | Behavior when the flag is on |
|---|---|
| Terrain | Dimension, region, and biome ore generators are skipped outright, so they cost nothing to run |
| Deposits, objects, vanilla passthrough | Any vanilla ore they still write is rewritten in the perfection pass to its host rock: stone, deepslate, netherrack, and blackstone for gilded blackstone. Modded and custom ore blocks are outside that set and pass through unchanged |

The flag applies to chunks Iris generates after you set it. Terrain already on disk keeps its ores, so regenerate or pregenerate the world to see the change.

Leave HiddenOre's own `[ore-removal]` disabled for an Iris world — it is a block populator that rescans every generated chunk column for ores Iris has already replaced. HiddenOre's bundled `[blocks.stone]` and `[blocks.deepslate]` tables match what an overworld dimension writes; a dimension whose rock is netherrack or blackstone needs a matching `[blocks.<material>]` table, or mining it pays nothing. HiddenOre's `min_y` and `max_y` are world Y, while an Iris ore `range` is engine-local Y where 0 is the bottom of the dimension, so the two sets of numbers do not carry across.

See [11 - Dimensions](/iris/11-dimensions), [16 - Surfaces, Decorators & Deposits](/iris/16-surfaces-decorators-deposits), and [HiddenOre — Configuration](/hiddenore/configuration).

## Tree feller

Break one log of an Iris-generated tree while sneaking with an axe and Iris removes the whole tree. This runs on Bukkit-family **and** on Fabric/Forge/NeoForge; only the permission plumbing differs.

### Settings (`iris.json`)

| Key | Default | Meaning |
|---|---|---|
| `treeFeller.enabled` | `false` | Turns the player-facing feature on. Does not affect other plugins driving the feller through the API |
| `treeFeller.durabilityPreservationChance` | `0` | Percent chance that felling a log costs no axe durability. Clamped to `0..100` when read, so an out-of-range value in the file is harmless |

### Permission

| Platform | Node | Default |
|---|---|---|
| Bukkit-family | `iris.treefeller` | `op` |
| Fabric | `irisworldgen:treefeller` | Permission level GAMEMASTERS (op level 2) |
| Forge / NeoForge | `irisworldgen:treefeller` (Forge `PermissionNode`) | Permission level GAMEMASTERS (op level 2) |

### What has to be true to fell a tree

All of these, on every platform:

- `treeFeller.enabled` is `true`
- The player has the platform's tree-feller permission
- The player is in survival mode
- The player is sneaking
- The broken block is in the vanilla logs tag
- The main-hand item is in the axes tag
- The block carries Iris tree provenance in the mantle, and that provenance is not part of a structure

That last condition separates a generated tree from a player-planted one: Iris stamps trees it places and clears the stamp when a player places a block, so saplings grown by players and hand-built trunks are never felled.

On Bukkit, other plugins can drive a fell with `TreeFellerAccess.INTEGRATION_OVERRIDE` through `IrisTreeFellerService`. That bypasses the `enabled` switch and the permission check only — every provenance and block-state requirement still applies — and an override request supersedes a standalone one on the same event. Bukkit-only. See [93 - API - Tree Feller](/iris/93-api-tree-feller).

### Runtime notes for operators

- Discovery is bounded at 131,072 members, 1,000,000 visited positions, and 256 blocks on any axis from the broken block. A tree that exceeds any bound degrades to removing only the block the player broke. An unusually large custom tree that behaves like vanilla is this, not a bug.
- Removal is paced across ticks and does not stall the main thread on a large tree.
- A run ends early if the player stops sneaking, changes hotbar slot, swaps hands, leaves survival or the world, breaks the axe, or swaps to a different axe item.
- Logs consume axe durability, one point each, subject to the preservation chance and to unbreakable items. Leaves cost nothing.
- A tree already being felled cannot be claimed twice. A second player who breaks into the same tree has their break cancelled with no drops.

## Platforms

WorldEdit, Multiverse-Core, the external data providers, the Mythic conditions, and PlaceholderAPI are Bukkit-family only; mod loaders do not use these plugin declarations. The tree feller is the exception and runs on every platform. See [30 - Platform Differences](/iris/30-platform-differences).
