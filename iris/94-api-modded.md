---
title: "API - Modded"
description: "Iris documentation: API - Modded"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
`art.arcane.iris.modded.api` is the surface a **mod** compiles against on
Fabric, Forge, and NeoForge. Use it to detect Iris levels, drive
pregeneration and mantle storage, and supply custom blocks, items, and
mobs to packs. Use it when your mod's content has to appear in
Iris-generated terrain. Use it when the mod needs to know whether a
`ServerLevel` is Iris at all. It ships only in the mod jars. It is absent
from the Bukkit plugin jar. It shares no types with `art.arcane.iris.api`.

Assumes Minecraft 26.2, Java 25, and Fabric, Forge, or NeoForge. Mod id
is `irisworldgen` on all three.

The Bukkit terrain, world-event, pregeneration-event, and tree-feller
**services** have no counterpart here. See
[90 - API - Getting Started](/iris/90-api-getting-started) through
[93 - API - Tree Feller](/iris/93-api-tree-feller) for that surface. The
tree feller itself does run on mod loaders as a player-facing feature
(settings plus the `irisworldgen:treefeller` node), but exposes no
integration hooks.

| Goal | Entry |
|---|---|
| Detect Iris, read engine token, start pregen, mantle R/W | `IrisModdedAPI` |
| Have Iris place your blocks/items/mobs | `ModdedDataProvider` |
| Alias one custom key onto a fixed vanilla state | `IrisModdedAPI.registerCustomBlockData` |

---

## Depending on Iris

**No published Maven artifact for the mod jars.** Root build has no
`maven-publish` for them. JitPack for this repo resolves Bukkit-oriented
sources, not the modded adapters. Build from source:

```bash
./gradlew buildFabric     # -> ../PluginOuts/Iris v<version> [Fabric] <mc>+<loader>.jar
./gradlew buildForge      # -> ../PluginOuts/Iris v<version> [Forge] <mc>+<loader>.jar
./gradlew buildNeoforge   # -> ../PluginOuts/Iris v<version> [NeoForge] <mc>+<loader>.jar
```

Each task shells out to the adapter's own wrapper and copies the jar into
the workspace-level `../PluginOuts/` directory. The loader segment is that adapter's loader version verbatim.
For example `26.2+0.19.3` on Fabric and `26.2+26.2.0.59` on NeoForge.

Each adapter is a standalone Gradle build
(`adapters/<loader>/settings.gradle` `includeBuild('../..')` plus a
dependency substitution for `art.arcane:core` and `art.arcane:spi`).
Compile against the jar you run:

```gradle
dependencies {
    compileOnly(files('libs/Iris-fabric.jar'))
}
```

Adapters are not in root `settings.gradle` by default.
`-PincludeModdedAdapters=true` is for IDE import only and can close a
composite-build cycle Gradle rejects.

### Soft dependency

Fabric (`fabric.mod.json`) — `suggests`, not hard `depends`:

```json
{
  "suggests": { "irisworldgen": "*" }
}
```

NeoForge (`META-INF/neoforge.mods.toml`):

```toml
[[dependencies.yourmod]]
modId = "irisworldgen"
type = "optional"
ordering = "AFTER"
side = "BOTH"
```

Forge (`META-INF/mods.toml`): same with `mandatory = false` instead of
`type`.

Do not rely on load order for ServiceLoader discovery. Iris discovers
providers itself.

### Detecting Iris

| Question | How |
|---|---|
| Is the mod present? | `FabricLoader.getInstance().isModLoaded("irisworldgen")` or `ModList.get().isLoaded("irisworldgen")` |
| Are Iris classes loadable? | Keep imports behind a presence check / separate class, or `Class.forName("art.arcane.iris.modded.api.IrisModdedAPI")` |
| Is **this** level Iris? | `IrisModdedAPI.isIrisLevel(level)` |

Do not gate on version strings. Probe for the class or method you need.
Servers mix Iris and vanilla dimensions freely.

```java
private static final boolean IRIS_PRESENT = irisPresent();

private static boolean irisPresent() {
    try {
        Class.forName("art.arcane.iris.modded.api.IrisModdedAPI");
        return true;
    } catch (Throwable absent) {
        return false;
    }
}
```

---

## Dynamic level lifecycle events

Iris publishes the loader's normal lifecycle events when `/iris create`,
`/iris world enable|disable|delete`, or Studio injects or removes a dynamic
level. Fabric listeners receive `ServerLevelEvents.LOAD` and `UNLOAD`.
Forge and NeoForge listeners receive `LevelEvent.Load` and `Unload` on
their normal event bus. Integrations should use those native events rather
than polling Iris's persistent registry.

Unload is published while the retained `ServerLevel` and its bound Iris
engine are still available, before Iris removes the level from the server.
If removal fails after that event and Iris restores the retained level,
rollback publishes the matching load event again. Listeners must therefore
treat a load after an attempted unload as a valid restoration, not a
duplicate startup notification.

---

## `IrisModdedAPI`

All static, null-tolerant: null or non-Iris `ServerLevel` → `false`,
`null`, or no-op.

| Method | Behavior |
|---|---|
| `isIrisLevel(ServerLevel)` | Chunk generator is `IrisModdedChunkGenerator`. Cheapest check |
| `isStudioLevel(ServerLevel)` | Throwaway pack-authoring world. Persist nothing |
| `getEngine(ServerLevel)` | Internal `Engine` or null. See stability note |
| `pregenerate(ServerLevel, int radiusBlocks)` | Cached async pregen around origin |
| `pregenerate(ServerLevel, int, int centerBlockX, int centerBlockZ, boolean sync, boolean cached)` | Same with center and write mode |
| `getMantleData(ServerLevel, int x, int y, int z, Class<T>)` | Read per-block mantle |
| `setMantleData(ServerLevel, int x, int y, int z, T)` | Write (creates region. Can touch disk) |
| `deleteMantleData(ServerLevel, int x, int y, int z, Class<T>)` | Remove type at position (creates region) |
| `retainMantleDataForSlice(Class<?>)` | Mark a mantle slice type as retained |
| `registerProvider(ModdedDataProvider)` | Imperative provider registration |
| `registerCustomBlockData(String namespace, String key, String state)` | Static block-state alias |

### Threading (API entry)

| Method | Thread guidance |
|---|---|
| `isIrisLevel` | Any thread. A reference read on the chunk source |
| `isStudioLevel`, `getEngine` | Any thread, but not free — see below |
| Mantle get/set/delete | Safe off server thread but touch engine storage. Writes can disk I/O |
| `pregenerate`, `registerProvider` | Server thread / mod setup / command |
| `retainMantleDataForSlice`, `registerCustomBlockData` | Mod setup |

### `Engine` is internal

`getEngine` returns `art.arcane.iris.engine.framework.Engine`. Internal.
Changes without deprecation. Treat as an opaque token to hand back to
Iris. Prefer the wrappers on this class.

`getEngine` is **not** a plain field read. For a level whose engine is
not bound yet it binds one. That bind loads the pack and builds the biome
complex under the generator's monitor. `isIrisLevel` is the cheap probe.
Use it first and call `getEngine` only when you need the token.
`isStudioLevel` and every mantle accessor route through `getEngine` and
inherit this.

Never cache an `Engine`. Pack hotload or level unload replaces it.
`getEngine` returns null while binding fails and during shutdown.

### Pregeneration

Returns as soon as the job is queued. Progress is Iris logging and boss
bar only. No caller callback (no modded equivalent of
`IrisPregenerationEvent`. See limitations). One job server-wide. Returns
`false` if a job is already active **or** the level is not Iris. Check
`isIrisLevel` first to distinguish. Call on the server thread.

`radiusBlocks` is the half-extent of a square measured from the center.
`cached = true` uses the on-disk pregen cache under `<world>/iris/pregen`
for resume. `sync = true` writes chunks synchronously (slower. Bypasses
async write queue). The simple overload is
`pregenerate(level, radius, 0, 0, false, true)`.

Operator pregeneration concepts:
[07 - Pregeneration](/iris/07-pregeneration). Platform matrix:
[30 - Platform Differences](/iris/30-platform-differences).

### Mantle data

The mantle is Iris's per-block sidecar, independent of chunk NBT.

1. **Coordinates are world-space.** `y` is translated by engine min
   height internally. Out-of-range `y` reads null / writes no-op.
2. **Reads never create storage. Writes do.** `getMantleData` returns
   null when no mantle region exists for that column. `set`/`delete`
   create the region (possible disk).
3. **Value types are fixed.** The mantle stores values in typed slices,
   and only registered slice types exist. A type with no slice raises
   `IllegalArgumentException: Unsupported matter slice type <name>` —
   from `set`/`delete` always, and from `get` once a mantle region exists
   for that column. Iris's own slice types are internal and must not be
   written by a mod.

Types a mod can use:

| Type | Survives normal generation | Survives pregeneration |
|---|---|---|
| `Boolean`, `Integer`, `Long` | Yes | Yes |
| `String` | Yes | **No** — pregen's chunk cleanup deletes the `String` slice |

`retainMantleDataForSlice(Class<?>)` records a canonical class name in a
process-wide, irreversible set. Both cleanup paths honor that set. The
per-chunk trim after generation and pregeneration's forced cleanup skip
retained slice types. Retained values persist into the mantle region
files and unload with them, so region files grow with what you retain.
The block-state slice can never be retained, and your mod owns deleting
values it no longer needs.

All three mantle accessors throw `IllegalStateException` if the engine
mantle is already closed.

### Worked example: setup, pregen, mantle

```java
package com.example.yourmod.iris;

import art.arcane.iris.modded.api.IrisModdedAPI;
import net.minecraft.server.level.ServerLevel;

public final class IrisBridge {
    private IrisBridge() {
    }

    /** Mod setup, before any level resolves a pack key. */
    public static void onModSetup() {
        IrisModdedAPI.registerProvider(new YourIrisProvider());
        IrisModdedAPI.registerCustomBlockData("yourmod", "fancy_log", "minecraft:oak_log[axis=y]");
        IrisModdedAPI.retainMantleDataForSlice(Integer.class);
    }

    /** Server thread. False when the level is not Iris or a pregen job is already running. */
    public static boolean warmUp(ServerLevel level, int radiusBlocks) {
        if (!IrisModdedAPI.isIrisLevel(level)) {
            return false;
        }

        return IrisModdedAPI.pregenerate(level, radiusBlocks);
    }

    public static void markShrineTier(ServerLevel level, int x, int y, int z, int tier) {
        IrisModdedAPI.setMantleData(level, x, y, z, tier);
    }

    public static int shrineTier(ServerLevel level, int x, int y, int z) {
        Integer tier = IrisModdedAPI.getMantleData(level, x, y, z, Integer.class);
        return tier == null ? 0 : tier;
    }
}
```

---

## `ModdedDataProvider`

```java
public interface ModdedDataProvider {
    String modId();
    default boolean isReady();                                    // default true
    Collection<Identifier> getTypes(ModdedDataType type);
    boolean isValidProvider(Identifier id, ModdedDataType type);
    default ModdedBlockData getBlockData(Identifier blockId, Map<String, String> state);   // default null
    default void processBlockPlacement(ModdedBlockPlacementContext context);               // default no-op
    default Entity spawnMob(ServerLevel level, double x, double y, double z, Identifier entityId); // default null
    default void init();                                          // default no-op
}
```

`Identifier` is `net.minecraft.resources.Identifier`. `ModdedDataType`:
`BLOCK`, `ITEM`, `ENTITY`. May gain constants. Use `default` in switch
expressions.

### Contract

- `modId()` — identity for de-duplication and logging. Non-null and
  stable. Null aborts discovery.
- `isValidProvider` — gate before every resolution callback on
  generation threads. Namespace or set lookup only.
- `isReady()` — late registries: Iris **skips** false rather than
  treating as absent.
- `getTypes` — suggestions/tooling only. Empty collection, never null.
- `getBlockData` — `state` is the parsed `[prop=value]` map, never null,
  possibly empty. Null return declines (next provider, then air).
  `ModdedBlockData.direct(state)` for final. `deferred(placeholder)` for
  a second pass.
- `processBlockPlacement` — finishes deferred placement on the server
  thread with the chunk loaded. Only the first **ready** provider
  claiming the id runs for a position. The placeholder should match the
  final block's shape and occlusion.
- `spawnMob` — server thread. **You must add the entity to the level
  yourself.** Iris uses the returned reference as-is and does not call
  `addFreshEntity`. Null declines. Iris applies pack entity settings
  (name, attributes, loot, passengers) to the result only when the pack
  sets `applySettingsToCustomMobAnyways`.
- `init()` — once after accept.

`ModdedBlockPlacementContext` record: `engine`, `level`, `position`,
`blockId`, `state` (defensive copy, unmodifiable), `blockState` (state
currently at the position). Immutable. Constructed by Iris. Every
component non-null. `engine` is internal.

`ModdedBlockData`: `direct(BlockState)` / `deferred(BlockState)`. Null
state rejected.

### Provider threading

| Callback | Thread | Notes |
|---|---|---|
| `isValidProvider`, `getBlockData` | Generation threads, concurrent | Fast. No world mutation |
| `processBlockPlacement` | Server thread, chunk loaded | Safe block/entity writes |
| `spawnMob` | Server thread | |
| `init` | Discovering/registering thread | No server/level assumed |
| `modId`, `isReady`, `getTypes` | Any | |

### Worked example: provider

```java
package com.example.yourmod.iris;

import art.arcane.iris.modded.api.ModdedBlockData;
import art.arcane.iris.modded.api.ModdedBlockPlacementContext;
import art.arcane.iris.modded.api.ModdedDataProvider;
import art.arcane.iris.modded.api.ModdedDataType;
import net.minecraft.core.BlockPos;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.resources.Identifier;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.world.entity.Entity;
import net.minecraft.world.entity.EntitySpawnReason;
import net.minecraft.world.entity.EntityType;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.Blocks;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public final class YourIrisProvider implements ModdedDataProvider {
    private static final String NAMESPACE = "yourmod";
    private static final Identifier ALTAR = Identifier.parse("yourmod:altar");

    @Override
    public String modId() {
        return NAMESPACE;
    }

    @Override
    public Collection<Identifier> getTypes(ModdedDataType type) {
        return type == ModdedDataType.BLOCK ? List.of(ALTAR) : List.of();
    }

    @Override
    public boolean isValidProvider(Identifier id, ModdedDataType type) {
        return NAMESPACE.equals(id.getNamespace());
    }

    @Override
    public ModdedBlockData getBlockData(Identifier blockId, Map<String, String> state) {
        if (!ALTAR.equals(blockId)) {
            return null;
        }

        // The altar carries a block entity, so write a solid placeholder now and
        // finish once the chunk is loaded.
        return ModdedBlockData.deferred(Blocks.COBBLESTONE.defaultBlockState());
    }

    @Override
    public void processBlockPlacement(ModdedBlockPlacementContext context) {
        Block altar = BuiltInRegistries.BLOCK.getValue(ALTAR);

        context.level().setBlock(
                context.position(),
                altar.defaultBlockState(),
                Block.UPDATE_CLIENTS | Block.UPDATE_KNOWN_SHAPE);
    }

    @Override
    public Entity spawnMob(ServerLevel level, double x, double y, double z, Identifier entityId) {
        EntityType<?> type = BuiltInRegistries.ENTITY_TYPE.getValue(entityId);

        if (type == null) {
            return null;
        }

        // EntityType.spawn adds the entity to the level and returns it.
        return type.spawn(level, BlockPos.containing(x, y, z), EntitySpawnReason.NATURAL);
    }
}
```

### ServiceLoader registration

`META-INF/services/art.arcane.iris.modded.api.ModdedDataProvider` —
binary names, one per line. Nested classes use `$`. Public no-arg
constructor required.

Iris loads with **its** class loader:
`ServiceLoader.load(ModdedDataProvider.class, ModdedCustomContentRegistry.class.getClassLoader())`.
If the registration log never appears, fall back to `registerProvider`.

### When discovery runs

`ModdedCustomContentRegistry.discover()` runs inside
`ModdedEngineBootstrap.bind()`, which `ModdedEngineBootstrap.bootCommon(...)`
calls at loader entry (`IrisFabricBootstrap.onInitialize`, the Forge and
NeoForge bootstrap constructors). Before chunk-generator registration and
long before a server starts.

- ServiceLoader providers are available before any world resolves
  blocks.
- Discovery once per process. A second `discover()` is a no-op returning
  an inert handle.
- `init()` must not assume a server, level, or full game registry. Gate
  late work with `isReady()`.

### Imperative registration

`IrisModdedAPI.registerProvider(provider)` any time during setup.
Providers registered after Iris's ServiceLoader pass are fine. After a
world has generated, already-resolved blocks are not revisited. Duplicate
`modId()` logged and ignored. `init()` runs during the call. Throwables
from imperative `init` are logged (provider stays registered).

### Logging

Under the `Iris` logger:

```
Iris registered custom content provider 'yourmod'
Iris registered custom block data yourmod:fancy_log -> minecraft:oak_log[axis=y]
```

Duplicates: `already registered; ignoring duplicate`.

Per-callback failures are caught, logged against `modId()`, and
generation continues:

```
Iris custom content provider 'yourmod' failed resolving block yourmod:thing
Iris custom content provider 'yourmod' failed post-placement for yourmod:thing at BlockPos{...}
Iris custom content provider 'yourmod' failed spawning mob yourmod:critter
Iris custom content provider 'yourmod' failed listing BLOCK types
Iris custom content provider 'yourmod' failed to initialize
```

A deferred placement with no ready provider, or an unparseable key, warns
and is skipped:

```
Iris deferred custom block placement has no provider for yourmod:thing
Iris deferred custom block placement rejected invalid id yourmod:Thing
```

ServiceLoader `init` failure is all-or-nothing: aborts discovery, rolls
back that pass, and rethrows. A `RuntimeException` or `Error` propagates
unchanged. Anything else is wrapped in `IllegalStateException`.

```
Iris custom content provider discovery failed at provider 'yourmod' (com.example.yourmod.iris.YourIrisProvider)
```

### Static aliases

```java
IrisModdedAPI.registerCustomBlockData("yourmod", "fancy_log", "minecraft:oak_log[axis=y]");
```

`state` is parsed immediately with the vanilla block-state parser against
the block registry, so call it after blocks are registered. An invalid
identifier or unparseable state is logged and the registration dropped at
startup rather than showing up as missing blocks. Aliases match on the
identifier alone and win over providers for the same key.
`[prop=value]` in a pack key is ignored for an aliased block. The
alias's fixed state is what gets written. Null arguments are ignored.

Go through `IrisModdedAPI`, not `ModdedCustomContentRegistry` resolution
methods. `hasProviders()`, `aliasBlockKeys()`, and
`providerKeys(ModdedDataType)` on that class are read-only snapshots
intended for pack tooling. Everything else on it is Iris internal and
public only because the adapter's generation code lives in another
package.

---

## Pack paths and forced datapack (modded)

Paths relative to the loader config directory (`config/`):

| Path | Role |
|---|---|
| `config/irisworldgen/packs/<pack>/` | Installed packs (`dimensions/<dimension>.json` required) |
| `config/irisworldgen/generated/datapack/iris/` | Generated forced datapack — Iris-owned |
| `config/irisworldgen/modded.json` | Default pack and primary world routing |
| `config/iris/` | Engine data: `iris.json` and `worlds.json` |

Pack install root is `config/irisworldgen/packs`, not `config/iris`.
Per-level engine state that must travel with the save
(`iris-dimensions.json`) lives in the world folder under `<world>/iris/`,
not in `config/`. Missing pack at world open is a hard failure with the
expected absolute path (no silent vanilla terrain).

`modded.json` keys: `defaultPack`, `primaryWorld`,
`routePlayersToPrimaryWorld`, `mainWorldPack`, `mainWorldSeed`,
`mainWorldAutoRestart`.

Modded startup never downloads a pack. `/iris download pack=overworld`
and `/iris download pack=underworld` resolve version-pinned stable-release ZIP
URLs. `/iris download link=<http(s)-zip-url>` installs a custom ZIP. No
branch, listing, arbitrary-name, overwrite, or implicit-download form
exists. Successful commands publish only to disk and ask for a manual
restart before the forced datapack can expose the pack's dimension types,
presets, and biomes.

Forced datapack id is `iris_worldgen`. It contributes presets, dimension
types, and biomes under the `irisworldgen` namespace (ids derived from
pack/dimension names). Regenerated on pack change / studio hotload.
Failure to inject (mixin/event not applied) logs once at startup:

```
Iris forced datapack 'iris_worldgen' was never loaded by this server.
```

That is a loader/environment problem, not a pack problem.

### Commands (modded)

`/iris` (`/ir`, `/irs`). The root literal is ungated. Each subcommand
carries its own check. Read-only nodes (`version`, `info`, `what`,
`height`, `worlds`, `help`) require `LEVEL_ALL`. Everything else
`LEVEL_GAMEMASTERS` (op level 2 or the equivalent permission). Full tree:
[04 - Commands & Permissions](/iris/04-commands-permissions). Notable:

| Command | Role |
|---|---|
| `/iris pack validate [pack]` | Validate packs on a worker. Blank validates all |
| `/iris pack status [pack]` | Recorded validation results |
| `/iris pack cleanup <pack> [apply]` / `restore <pack>` | Unused resource preview/apply |
| `/iris datapack status` | Active vs pack dimension-type heights |
| `/iris datapack install` | Write pack dimension type override into world datapacks |
| `/iris datapack list` | Configured and installed world datapacks |
| `/iris download pack=overworld\|pack=underworld\|link=<zip-url>` | Install pack (`dl` alias) |
| `/iris version` | Version and loader |

`/iris datapack ingest` (`pull`) and `remove` (`rm`) exist but always
refuse on modded. The Modrinth tooling is Bukkit-only. Native/datapack
structure placement still works: install into `<world>/datapacks/` and
restart. Structures overview:
[22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks).

---

## Native worldgen passthrough over Iris terrain

Iris replaces the chunk generator. Vanilla/mod worldgen runs only if Iris
runs it:

| System | Over Iris? | Notes |
|---|---|---|
| Structures (vanilla, datapack, mod) | **Yes**, on by default | Vertical fit, stilts, vegetation clear. Deny families with `importedStructures.disabled`, one complete key with `disabledExact`, or scale an exact structure set with `frequencyOverrides` |
| Placed features (ores, trees, plants, …) | **Yes**, **off** by default | Dimension `importedFeatures.enabled` |
| Carvers | **Never** | `applyCarvers` is an empty override. No noise router or aquifer for vanilla carvers |
| Mod biomes as sources | Only as derivative / scatter targets | Iris chooses biomes from the pack |
| Mob spawning (incl. mod mobs) | **Yes** | Pack biome table merged ahead of the vanilla derivative's |
| Surface builders / rules | **Never** | `buildSurface` is an empty override. Pack palettes decide |

`importedStructures.frequencyOverrides` has Bukkit parity on all three
mod loaders. Entries use
`{ "structureSet": "namespace:path", "multiplier": 0.01..16 }`. Keys are
exact registered structure-set keys, last duplicate wins, and changes
affect new chunks only. Random-spread sets scale probability first
(clamped at 1) and then derive the nearest legal integer spacing, while
concentric rings can scale probability only. Sets outside the affected
override and exclusion-zone graph are returned untouched. An unsupported
placement type that must be copied throws during level structure-state
construction, so binding fails rather than a partial override being
applied. Full semantics and the Nether `1.1` example are in
[22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks).

Pack-author recipes for this control, including “keep Iris trees, import vanilla ores”, live in [35 - Vanilla Passthrough](/iris/35-vanilla-passthrough). The rest of this section is the loader-level contract.

### `importedFeatures`

Disabled by default. Absent or `enabled: false` → no feature table.
Terrain matches long-standing Iris-only output. Biome tags of the vanilla
derivative are always inherited on custom biomes (not gated on this
flag). Structure tags `#minecraft:has_structure/*` are **not** inherited.

```json
{
  "importedFeatures": {
    "enabled": true,
    "steps": ["UNDERGROUND_ORES"],
    "disabledSteps": ["VEGETAL_DECORATION"],
    "disabled": ["minecraft:ore_diamond", "minecraft:trees"]
  }
}
```

| Field | Meaning |
|---|---|
| `enabled` | Master switch. Default `false` |
| `steps` | Allow-list of decoration steps. Empty = all |
| `disabledSteps` | Deny-list after `steps` |
| `disabled` | Placed-feature key deny-list. Prefix match on namespace/`/`/`_` boundaries |

Vanilla step order: `RAW_GENERATION`, `LAKES`, `LOCAL_MODIFICATIONS`,
`UNDERGROUND_STRUCTURES`, `SURFACE_STRUCTURES`, `STRONGHOLDS`,
`UNDERGROUND_ORES`, `UNDERGROUND_DECORATION`, `FLUID_SPRINGS`,
`VEGETAL_DECORATION`, `TOP_LAYER_MODIFICATION`.

Features come from the biome's **vanilla derivative**. Feature seeds
match vanilla derivation so denying one feature does not shift another's
seed. The feature pass runs on the worldgen thread owning the chunk (not
the Iris gen pool), after Iris structures. Early-step features can cut
into placed structures. A feature-order cycle detected at bind degrades
`importedFeatures` to off with an ERROR log rather than failing the
chunk. Same control exists on Bukkit with the same semantics.

### Carvers

`applyCarvers` is empty by design. Use pack `caves` / `carvings`:
[15 - Caves & Carving](/iris/15-caves-carving).

### 26.2 note: `pointed_dripstone` / `speleothem`

| Registry | 26.2 key |
|---|---|
| Block | `minecraft:pointed_dripstone` unchanged |
| Configured / placed feature | `minecraft:pointed_dripstone` unchanged |
| Feature **type** | `minecraft:speleothem` |

Pack palette / object / `importedFeatures.disabled` keys using the block
or placed-feature id remain correct. Only code registering or matching a
feature *type* sees the new name.

### Biome tags

Custom biomes inherit derivative tag membership plus pack `tags`. Files
use `"replace": false`. Details: [13 - Biomes](/iris/13-biomes).

---

## What is not supported

- **No published mod artifact** — build from source.
- **Core packages internal** — `engine.*`, `core.*`, `util.*`, `spi.*`.
  `Engine` is the only internal type exposed (as a token) via
  `getEngine` / placement context.
- **No event bus** — `ModdedPlatform.callEvent` is an empty method on
  mod loaders. No modded `IrisWorldEngineEvent` /
  `IrisPregenerationEvent`. Poll `isIrisLevel` / `getEngine`.
- **No `art.arcane.iris.api`** in mod jars (verified: zero classes under
  that package in each loader jar). No modded terrain-query service, and
  no tree-feller integration API.
- **No PlaceholderAPI** —
  [09 - PlaceholderAPI](/iris/09-placeholderapi) is Bukkit-only.
- **Datapack ingest/remove commands** Bukkit-only.
- **Vanilla carvers and surface rules never run.**
- **No custom mantle slice types** — the mantle accepts only registered
  value types.

Install and platform notes:
[01 - Installation & Platforms](/iris/01-installation-platforms),
[30 - Platform Differences](/iris/30-platform-differences).
