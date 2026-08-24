---
title: "Integrations"
description: "Iris documentation: Integrations"
published: true
date: 2026-08-24T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Iris can use these Bukkit plugins and coexist with PlotSquared. WorldEdit
handles selections. Multiverse-Core handles world management. Nine item,
block, or entity plugins handle pack content. MythicMobs handles skill
conditions. PlaceholderAPI handles scoreboard values. PlotSquared's own
generator discovery calls Iris without becoming an Iris integration.
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
| WorldEdit | Make a cuboid selection with the WorldEdit wand, run `/iris object we`, and save a disposable object | Clear the selection and run `/iris object we` again. Iris must say you have no WorldEdit selection in this world |
| Multiverse-Core | Create a disposable Iris world and confirm Multiverse lists it with generator `Iris:<pack>` | On a separate disposable copy, restart without Multiverse installed. Iris world creation must still succeed |
| Item/block/entity provider | Reference one exact namespaced key from a pack and generate a fresh chunk containing it | Reference a key that does not exist. Iris must log `No matching Provider found` or a missing-resource error and keep generating |
| MythicMobs conditions | `irisbiome{b=<load key>}` returns true inside that biome | The same condition returns false in a vanilla world |
| PlaceholderAPI | Run the parse sequence in [09 - PlaceholderAPI](/iris/09-placeholderapi) | A player outside an Iris world gets `world.available` = `false` |
| Tree feller | A sneaking survival player with the permission and an axe fells an Iris-generated tree | A tree the player grew from a sapling stays intact. Only the broken log drops |

5. Restart and repeat the positive proof once. Some link failures show only
   on the second boot, when caches are warm and enable order shifts.

When something fails, collect both plugin versions and the enable order from
the log. Do this before you edit pack JSON. Most integration failures are
version or ordering problems, not pack problems.

## Load order declarations

Iris ships a legacy `plugin.yml` and a Paper `paper-plugin.yml`. Paper
servers use the latter. The two declare the same relationships in different
syntax.

| Plugin | Relation | Role in Iris |
|---|---|---|
| PlaceholderAPI | softdepend | The `%iris_...%` expansion |
| CraftEngine | softdepend | External blocks and items |
| Nexo | softdepend | External blocks and items |
| ItemsAdder | softdepend | External blocks and items |
| SCore | softdepend | Runtime dependency of the ExecutableItems ecosystem. Iris has no provider class for it |
| ExecutableItems | softdepend | External items |
| MythicLib | softdepend | Runtime dependency of the MMOItems ecosystem. Iris has no provider class for it |
| MMOItems | softdepend | External blocks and items |
| eco | softdepend | Runtime dependency of EcoItems. Iris has no provider class for it |
| EcoItems | softdepend | External items |
| MythicMobs | softdepend | External entities, plus the two skill conditions |
| MythicCrucible | softdepend | External blocks and items |
| KGenerators | softdepend | External blocks and items |
| WorldEdit | softdepend | Selection reading for the object and wand workflows |
| Multiverse-Core | `loadbefore` | Iris enables *before* Multiverse so Multiverse can see Iris as a registered generator plugin |

In `paper-plugin.yml` the softdepends appear as `load: BEFORE, required: false`
and Multiverse-Core as `load: AFTER`. Every entry joins the classpath except
ExecutableItems, which does not.

## WorldEdit

`WorldEditLink` reaches into WorldEdit only by reflection. Iris compiles and
runs without WorldEdit on the classpath.

| Use | Behavior |
|---|---|
| Reading a selection | Returns an Iris `Cuboid` for the player's current WorldEdit selection **in the world they stand in**. Returns `null` if WorldEdit is absent, the player has no session, or there is no selection in that world |
| Accepting a selection | With `world.worldEditWandCUI` (default `true`), a WorldEdit selection satisfies Iris anywhere Iris asks for one, without the Iris wand |
| `/iris object we` | Checks WorldEdit is enabled, reads your current selection, and puts a **new Iris object wand into your inventory** already carrying those two corners |
| Limitation | `position2` will not operate on a WorldEdit-only selection. Run `/iris object we` first so a real Iris wand exists |

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
carrying a world-local pack snapshot, not a folder in the world container,
and Multiverse's folder operations would destroy that snapshot.

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
namespaced id. Iris routes each lookup to the first active provider that
claims that namespace for that data type (`ITEM`, `BLOCK`, or `ENTITY`).

| Plugin id | Provider class | Claims | Types |
|---|---|---|---|
| CraftEngine | `CraftEngineDataProvider` | Any namespace, but only if CraftEngine actually has an item, block, or furniture with that exact key | ITEM, BLOCK |
| Nexo | `NexoDataProvider` | Namespace `nexo` | ITEM, BLOCK |
| ItemsAdder | `ItemAdderDataProvider` | The item and block namespaces ItemsAdder reports at init, tracked separately | ITEM, BLOCK |
| ExecutableItems | `ExecutableItemsDataProvider` | Namespace `executable_items` | ITEM |
| MMOItems | `MMOItemsDataProvider` | Blocks: namespace `mmoitems`. Items: any namespace containing one `_`, read as `<type>_<subtype>` | ITEM, BLOCK |
| EcoItems | `EcoItemsDataProvider` | Namespace `ecoitems` | ITEM |
| MythicMobs | `MythicMobsDataProvider` | Namespace `mythicmobs` | ENTITY |
| MythicCrucible | `MythicCrucibleDataProvider` | Namespace `crucible` | ITEM, BLOCK |
| KGenerators | `KGeneratorsDataProvider` | Namespace `kgenerators` | ITEM, BLOCK |

Block ids may carry a vanilla-style state suffix,
`namespace:key[facing=north,waterlogged=true]`. A malformed state entry
logs and resolves to nothing. It does not throw into generation.

Failures stay contained. An unresolvable key logs
`No matching Provider found for modded material "<key>"` or a
missing-resource error that names the namespace and key. The caller gets
an empty result. Generation continues. A provider that throws during
activation is logged and skipped. The rest still load.

Third parties can add their own with `ExternalDataSVC#registerProvider`.
It throws `IllegalArgumentException` if the plugin id belongs to a built-in
provider or one already registered. You cannot silently displace an
existing one. A provider that also implements `Listener` is registered as
one automatically.

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
