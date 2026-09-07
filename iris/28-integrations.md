---
title: "Integrations"
description: "Iris documentation: Integrations"
published: true
date: 2026-09-07T23:15:21.846Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Iris can use these Bukkit plugins and coexist with PlotSquared. WorldEdit
supplies selections for explicit import. Multiverse-Core handles world management. Ten item,
block, or entity plugins handle pack content. MythicMobs handles skill
conditions. PlaceholderAPI handles scoreboard values. PlotSquared's own
generator discovery calls Iris without becoming an Iris integration. React
consumes Iris's published runtime metrics, and Wormholes consults Iris before
it loads random-teleport destination chunks.
All integrations are optional. Iris checks that a plugin is enabled before
it uses that plugin. A soft-depend only sets load order. It does not make
sure the plugin is present. Tree felling is a separate feature. It runs on
Bukkit and on the mod loaders. See also
[04 - Commands & Permissions](/iris/04-commands-permissions),
[06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle),
[09 - PlaceholderAPI](/iris/09-placeholderapi),
[19 - Objects](/iris/19-objects), and
[93 - API - Tree Feller](/iris/93-api-tree-feller).

## Confirm an integration is live

Add integrations one at a time. Prove each one before you add the next. Iris
often stays silent when it does not link a plugin. No error is not proof of
success.

1. Start from a server where Iris alone generates a fresh world cleanly.
2. Install one integration and its own dependencies. Then do a **full
   restart**. A plugin-manager reload does not copy real enable order. It
   gives a false result.
3. Watch the startup log. Each external data provider logs
   `<Plugin> found, loading <Provider>...` and then
   `Enabled ExternalDataProvider for <Plugin>.` The other links log nothing
   on success.
4. Run the positive proof for that boundary from the table below. Then run
   the negative control. The negative control shows if Iris gates on the
   plugin or only happens to work.

| Boundary | Positive proof | Negative control |
|---|---|---|
| WorldEdit | Make a cuboid selection with WorldEdit, run `/iris object we`, hold the new Iris wand, and save a disposable object | Hold the WorldEdit wand. Iris must not draw its selection or accept it for an object save. Clear the WorldEdit selection and run `/iris object we` again. Iris must report no selection in this world |
| Multiverse-Core | Create a disposable Iris world and confirm Multiverse lists it with generator `Iris:<pack>` | On a separate disposable copy, restart without Multiverse installed. Iris world creation must still succeed |
| Item/block/entity provider | Reference one exact namespaced key from a pack and generate a fresh chunk containing it | Reference a key that does not exist. Iris reports missing content and applies the configured fallback or refuses an unusable pack |
| MythicMobs conditions | `irisbiome{b=<load key>}` returns true inside that biome | The same condition returns false in a vanilla world |
| PlaceholderAPI | Run the parse sequence in [09 - PlaceholderAPI](/iris/09-placeholderapi) | A player outside an Iris world gets `world.available` = `false` |
| Tree feller | A sneaking survival player with the permission and an axe fells an Iris-generated tree | A tree the player grew from a sapling stays intact. Only the broken log drops |

5. Restart and repeat the positive proof once. Some link failures show only
   on the second boot, when caches are warm and enable order shifts.

When something fails, collect both plugin versions and the enable order from
the log. Do this before you edit pack JSON. Most integration failures are
version or ordering problems, not pack problems.
## WorldEdit

`WorldEditLink` reaches into WorldEdit only by reflection. Iris compiles and
runs without WorldEdit on the classpath.

| Use | Behavior |
|---|---|
| Reading a selection | Returns an Iris `Cuboid` for the player's current WorldEdit selection **in the world they stand in**. Returns `null` if WorldEdit is absent, the player has no session, or there is no selection in that world |
| Wand commands and outlines | Require an Iris wand in the main hand. WorldEdit wands and selections do not activate Iris selection commands or automatic particle outlines |
| `/iris object we` | Checks WorldEdit is enabled, reads your current selection, and puts a **new Iris object wand into your inventory** already carrying those two corners |
| After import | Hold the new Iris wand to edit, preview, or save its selection. Later WorldEdit selection changes do not change the copied corners |

Two behaviors matter. First, Iris caches only a *positive* WorldEdit
detection. If WorldEdit is absent or not yet enabled, Iris checks again on
each use. If you enable WorldEdit later, Iris finds it without a restart.
Second, if a reflective call throws, Iris logs `Could not get selection`
(throttled to once a minute) and clears the cached answer. The next call
detects again. The link does not stay off for the rest of the process.

WorldEdit is not needed to import `.schem` files. Iris parses schematic NBT
itself. See [19 - Objects](/iris/19-objects).

## Multiverse-Core

Multiverse gets its own page. Read [34 - Multiverse](/iris/34-multiverse)
before you run any Multiverse command against an Iris world.

The short version: Multiverse can list, inspect, teleport to, and configure
Iris worlds. It cannot create, delete, regenerate, or clone them. Those
commands are refused, because an Iris world is a dimension inside the level
carrying world-local generation history, not a folder in the world container,
and Multiverse's folder operations would destroy that history.

| Operation | Behavior |
|---|---|
| World create or update | Iris registers the world with Multiverse itself, with generator `Iris:<pack>`, `auto-load` off, and spawn-adjust off. It re-asserts those values on every startup |
| World remove | `/iris remove` clears the Multiverse entry along with the folder, the `bukkit.yml` entry, and the Iris registry entry |
| Destructive Multiverse commands | `/mv delete`, `/mv regen`, and `/mv clone` are refused with the Iris command to use instead |
| `/mv load` | Iris performs the load and hands the world back to Multiverse |
| Multiverse absent or disabled | Every Multiverse call is a no-op. Iris world creation and removal work normally |

`auto-load = false` is deliberate. Iris owns the load lifecycle of its
worlds. If Multiverse also loaded them at startup, the two would race.

Parts of this link use reflection, because Multiverse's public API has no
setter for the state Iris must correct. If a Multiverse update moves it,
Iris logs one warning and continues rather than failing.

World creation, removal, and Studio open/close all use this same link. See
[06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle).

## PlotSquared

PlotSquared asks every enabled plugin for a generator using the synthetic
world name `CheckingPlotSquaredGenerator`. Iris recognizes that exact empty-ID
probe and returns no generator. It does not resolve world storage, load a pack,
or request a server shutdown.

Iris is therefore not offered as a base generator in PlotSquared's setup
wizard. Create Iris worlds with `/iris create`; create plot worlds through
PlotSquared. The two plugins can own separate worlds on the same server.

## External item, block, and entity plugins

`ExternalDataSVC` makes a provider for each supported plugin that is
enabled. It also listens for `PluginEnableEvent`. A plugin that enables
after Iris is still picked up. Packs then reference external content by
namespaced id. Block lookups accept a native key or an explicit provider key.
Item and entity lookups retain their provider-specific identifier formats.

| Plugin id | Provider class | Claims | Types |
|---|---|---|---|
| CraftEngine | `CraftEngineDataProvider` | Any namespace, but only if CraftEngine actually has an item, block, or furniture with that exact key | ITEM, BLOCK |
| Nexo | `NexoDataProvider` | Registered items, blocks, and furniture under namespace `nexo` | ITEM, BLOCK |
| Oraxen | `OraxenDataProvider` | Registered items and blocks under namespace `oraxen`. Furniture is excluded | ITEM, BLOCK |
| ItemsAdder | `ItemAdderDataProvider` | Exact registered block keys. Item namespaces come from the item registry. Both refresh on `ItemsAdderLoadDataEvent` | ITEM, BLOCK |
| ExecutableItems | `ExecutableItemsDataProvider` | Namespace `executable_items` | ITEM |
| MMOItems | `MMOItemsDataProvider` | Items: `mmoitems_<type>:<item-id>`, for example `mmoitems_sword:excalibur`. Blocks: `mmoitems:<numeric-id>` | ITEM, BLOCK |
| EcoItems | `EcoItemsDataProvider` | Namespace `ecoitems` | ITEM |
| MythicMobs | `MythicMobsDataProvider` | Namespace `mythicmobs` | ENTITY |
| MythicCrucible | `MythicCrucibleDataProvider` | Items under `crucible`. Blocks require a registered block or furniture context | ITEM, BLOCK |
| KGenerators | `KGeneratorsDataProvider` | Items under `kgenerators`. Blocks require a registered generator ID | ITEM, BLOCK |

### ItemsAdder note-block pop-in

ItemsAdder's glitched-block repair can reset generated `REAL_NOTE` states before
Iris registers their custom identity. The block then changes to its intended
state when Iris's deferred placement pass reaches the chunk.

With players present, Iris checks eligible chunks roughly every three seconds.
This can produce a visible delay of several seconds after the reset. A loaded
chunk outside the nearby-player or force-loaded update area can retain the
reset state until it becomes eligible; server load can extend the wait.

For Iris-generated `REAL_NOTE` terrain, update these existing keys in
`plugins/ItemsAdder/config.yml`, then restart the server:

```yaml
blocks:
  fix-glitched-blocks:
    enabled: false
```

This disables ItemsAdder's glitched-block repair across the server, including
cleanup of old vanilla note blocks that use custom model states. Setting
`only-new-chunks: true` still runs repair on newly generated Iris chunks.
See [ItemsAdder's repair configuration](https://wiki.itemsadder.com/faq/glitched-blocks/).

Check a fresh chunk after restarting. Its generated note-block state should
remain intact while provider registration is pending. Already reset chunks
still need Iris's placement pass once to restore their states. Provider
metadata and behavior still depend on that pass, which runs near players or
for force-loaded chunks with their surrounding 3×3 chunks loaded.

A custom block in `rockPalette` fills the solid terrain beneath the surface,
so even a flat world can require thousands of provider placements per chunk.
Use the biome's surface layers when only the surface needs that block.

For example, with `dimensionHeight.min: -64`, `fluidHeight: -64`, and a flat
generator whose `min` and `max` are both `64`, the surface is at world Y=0.
Using the custom block for both rock and surface fills Y=-64 through Y=0:
65 layers × 16 × 16 = 16,640 custom blocks per chunk. A single surface layer
does not remove the rock fill underneath it.

### Oraxen release requirement

Oraxen 1.218.0 unconditionally loads its own Iris integration against the
old `com.volmit.iris` API. That integration fails during Oraxen startup with
this Iris build. Use an Oraxen build that removes its embedded Iris
integration before using Iris's provider. The stock release has no setting
to disable that hook. Iris does not supply an old-package compatibility shim.

See the [Oraxen compatibility registration source](https://github.com/oraxen/oraxen/blob/v1.218.0/src/main/java/io/th0rgal/oraxen/compatibilities/CompatibilitiesManager.java)
and the [Oraxen block API](https://docs.oraxen.com/developers/api).

### Use a custom block in a pack

Install the provider and its required dependencies before loading the Iris pack.
Wait for the provider to finish loading its content registry.

1. Confirm the provider can place the block with its own command.
2. Put its ID in an Iris palette entry. For an ItemsAdder block named `forest:amber_ore`, use:

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

The explicit format is `<plugin-id-lowercase>:<native-namespace>/<native-key>`.
The native key can contain more slashes. A matching explicit form takes
precedence. If that form does not name a block, the selected provider can
still recognize the original ID as a native key containing a slash.

A native ID resolves only when one active provider claims that exact block.
If two providers claim it, Iris logs the qualified alternatives and leaves
the native ID unresolved. Use an explicit ID to select the intended provider.
An explicit ID for an unavailable provider does not route to another plugin.
Installed blocks and their qualified forms appear in Studio schema completion.

Block properties use the palette entry's `data` object or a state suffix,
`namespace:key[property=value]`. Only properties supported by that provider
have meaning. ItemsAdder and Oraxen blocks expose no Iris property overrides
and reject nonempty property maps. CraftEngine exposes its block properties
and furniture properties. Nexo exposes its existing furniture properties.
Malformed suffixes and duplicate properties fail resolution.

Iris generates the backing block state first. It retains the selected
provider ID and calls that provider's placement API during chunk updates
near players or for force-loaded chunks, on the owning server context.
Pending placement reads the chunk’s recorded generation storage across pack
and Iris updates. The surrounding 3×3 chunks must be loaded for this pass.
This step supplies provider metadata
and behavior that a vanilla block state cannot represent. Pack `blocks/`
aliases and object serialization retain custom IDs and provider properties.
Terrain transitions also retain the custom ID while using the backing state
for geometry and fluid checks. Fractional properties such as furniture yaw
retain their precision. Property names and text values retain their case.

An unresolved block uses the normal dimension fallback chain and the entry's
`backup`. Pack compatibility validation can exclude content with missing
blocks or refuse a pack that cannot generate. A direct unresolved entry
without a fallback returns air with a warning. Provider lookup failures
include their stack trace. Placement failures keep pending chunk metadata
for a later materialization attempt.

Iris validates installed packs after its services initialize. When a provider
activates, or ItemsAdder or Oraxen reports loaded content, Iris refreshes
authoring-pack caches and revalidates them asynchronously. An early missing
block result therefore does not stay cached after that provider becomes
available. These refreshes preserve active engines and immutable generation
snapshots. Reload an affected Studio pack or restart to replace those loaded
runtime definitions after changing provider content.

Load provider content before creating a new Iris world. Saved Iris dimensions
can wait for installed providers during startup. Iris binds its generator from
the frozen dimension contract, then validates the saved pack and starts the
engine when provider content is ready. It rejects generation during the wait.
A missing provider fails validation; a provider that remains unavailable for
120 seconds leaves generation locked and triggers shutdown. See
[06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle). Clients need the provider's
resource pack to display its custom textures and models.

The normal terrain, decorator, and object generation paths support deferred
placement. Object and jigsaw Studio previews, direct command paste, and
native-structure terrain preparation still write carrier states only.
These paths do not prove provider placement. Capturing an arbitrary existing
world selection does not discover a custom ID from its carrier state.
Oraxen furniture is outside this block integration.

### Add another provider

Third parties can implement `ExternalDataProvider` and register it through
`ExternalDataSVC#registerProvider`. Return exact ownership from
`isValidProvider(id, BLOCK)` and enumerate native IDs through `getTypes(BLOCK)`.
The service also exposes qualified IDs using the registered plugin name.
A provider with delayed content loading reports readiness through `isReady()`
and calls `ExternalDataSVC#notifyContentChanged()` after its registry is ready or changes.

`getBlockData` must resolve without touching world state. Return ordinary
`BlockData` when the state alone is sufficient. Otherwise return
`IrisCustomData.of(base, nativeId)` and implement `processUpdate` to call the
provider's placement API. Include supported properties in the deferred
native ID. The service qualifies it for storage and restores the native ID
before placement. Let placement failures propagate so pending data survives.

Registration rejects a plugin ID that belongs to a built-in provider or one
already registered. A provider that implements `Listener` registers its
event handlers automatically. Optional providers are loaded only when their
plugin is enabled. An activation failure logs its stack trace and leaves
other providers available.

## MythicMobs skill conditions

When MythicMobs is active, its `MythicConditionLoadEvent` gives Iris two
location conditions.

| Condition | Fields | What it checks |
|---|---|---|
| `irisbiome` | `biome` / `b` — comma-separated biome load keys. `surface` / `s` — boolean, default `false` | With `s=true`, the surface biome at the target's X/Z. With the default `s=false`, the biome at the target's actual Y, which includes cave and mantle biomes |
| `irisregion` | `region` / `r` — comma-separated region load keys | The region load key at the target's X/Z |

Both compare against **load keys**, not display names. Both return `false`
when the target world is not an Iris world or its engine is unavailable.
A condition can fail quietly while a world is still booting. Do not make a
mob's only spawn gate an Iris condition during startup.

## PlaceholderAPI

Expansion id `iris`, soft-depended. Registration timing, all sixteen keys,
and the pre-2.0 migration table are in
[09 - PlaceholderAPI](/iris/09-placeholderapi).

## React and Wormholes

These integrations live in the consuming Volmit plugin rather than in Iris's
optional-dependency list.

| Plugin | Verified Iris use | If Iris is absent |
|---|---|---|
| React | Reads Iris's registered integration contract for engine, world, chunk-generation, cache, mantle, and pregeneration metrics. It uses those values in Iris dashboards, samplers, pressure overlays, and surge guards | Iris-gated metrics and features are not registered or activated |
| Wormholes | Soft-depends on Iris. Its random-teleport search asks an open Iris engine for reachable pack biomes, the biome at a candidate, authored terrain height, and fluid state before loading the destination chunk | Falls back to its ordinary chunk-backed biome and landing-safety checks |

React configuration and gates are documented in
[React — Iris, Adapt & Integrations](/react/07-features-iris-adapt-integrations).
Wormholes behavior and fallback rules are documented in
[Wormholes — Integrations](/wormholes/15-integrations).

## Tree feller

If you break one log of an Iris-generated tree while you sneak with an axe,
Iris removes the whole tree. This runs on Bukkit-family **and** on
Fabric/Forge/NeoForge. The settings and the traversal code are the same.
Only the permission plumbing differs.

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

That last condition separates a generated tree from a player-planted one.
Iris stamps trees it places. It clears the stamp when a player places a
block. Saplings grown by players and hand-built trunks are never felled.

On Bukkit, Iris listens for `BlockBreakEvent` at `EventPriority.HIGHEST` to
register the request. It finalizes at `MONITOR`. There it cancels the
vanilla break, suppresses its drops and XP, and starts its own paced run.

On Bukkit, other plugins can drive a fell with
`TreeFellerAccess.INTEGRATION_OVERRIDE` through `IrisTreeFellerService`.
That bypasses the `enabled` switch and the permission check only. Every
provenance and block-state requirement still applies. An override request
supersedes a standalone one on the same event. That API is Bukkit-only.
See [93 - API - Tree Feller](/iris/93-api-tree-feller).

### Runtime notes for operators

- Discovery is a flood fill over matching mantle provenance markers. It is
  bounded at 131,072 members, 1,000,000 visited positions, and 256 blocks
  on any axis from the broken block. If a tree exceeds any bound, the run
  degrades to removing only the block the player broke. An unusually large
  custom tree that behaves like vanilla is this, not a bug.
- Removal is paced across ticks and dispatched per region. It is Folia-safe
  and does not stall the main thread on a large tree.
- A run ends early if the player stops sneaking, changes hotbar slot, or
  swaps hands. It also ends if they leave survival or the world, break the
  axe, or swap to a different axe item.
- Logs consume axe durability, one point each, subject to the preservation
  chance and to unbreakable items. Leaves cost nothing and skip the
  durability path entirely.
- A tree already being felled cannot be claimed twice. A second player who
  breaks into the same tree has their break cancelled with no drops. A
  competing run does not start.

## Platforms

WorldEdit, Multiverse-Core, the external data providers, the Mythic
conditions, and PlaceholderAPI are Bukkit-family only. Mod loaders do not
use these plugin declarations. The tree feller is the exception. It runs
on every platform. See
[30 - Platform Differences](/iris/30-platform-differences).
