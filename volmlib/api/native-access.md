---
title: "Native server access"
description: "Select versioned native capabilities for plugin integrations"
published: true
date: 2026-09-23T05:32:41.849Z
tags: "volmlib, api, native"
editor: markdown
dateCreated: 2026-09-20T00:00:00.000Z
---

VolmLib provides typed interfaces for native server operations. Bundle the interfaces and provide the implementations for each server version your plugin supports.

## Dependencies

Use the same VolmLib release for every module:

```groovy
dependencies {
    implementation('com.github.VolmitSoftware.VolmLib:native-api:<version>')
    implementation('com.github.VolmitSoftware.VolmLib:native-common:<version>')
    implementation('com.github.VolmitSoftware.VolmLib:native-v26_2_R1:<version>')
    implementation('com.github.VolmitSoftware.VolmLib:native-v26_3_R1:<version>')
}
```

Native implementations require Java 25. Keep Bukkit, Paper, and Minecraft classes as server-provided dependencies. Relocate `art.arcane.volmlib` consistently with your plugin's other VolmLib dependencies.

The Volmit packaging plugin retains bundled version providers from their `NativeBinding` capability declarations, including relocated packages. With another shrinker, preserve those annotations, provider constructors, capability methods, and their dependencies.

Each plugin pins its own VolmLib release. Updating one plugin does not update another plugin's native code.

Implementations can be bundled or provisioned as runtime dependencies. Runtime loading must share the bundled API types with `native-common` and the selected version provider, keep API package names consistent, and retain bundled API members referenced by those external jars. Keep server-owned types used by native method signatures unrelocated. Use the original provider artifacts; a shrink pass against a different Minecraft version can remove required native overrides. Iris uses this runtime dependency option with build-pinned coordinates and SHA-256 checksums. Publish the provider modules at the pinned VolmLib revision before building the Iris plugin jar. Its provider checksums and retained API members come from the published JitPack artifacts, including when compilation uses a local VolmLib checkout.

For a separate provider loader, use the loader that owns `NativeAdapters` as its parent and call `NativeAdapters.registerProviderLoader(loader)` before resolving capabilities. After the owning worlds and hooks have stopped, call `releaseProviderLoader(loader)` and close the provider loader. Bundled integrations need no registration.

## Version selection

| Server release | Module |
| --- | --- |
| 1.21.11 | `native-v1_21_R7` |
| 26.1.2 and 26.2 | `native-v26_2_R1` |
| 26.3 | `native-v26_3_R1` |

`NativeVersion.resolve(...)` accepts declared releases and their Bukkit build suffixes. Unknown releases remain unsupported. A version module can provide a subset of the available interfaces.

Resolve a capability once for the service that owns it:

```java
Optional<BlockEntityAccess> blocks = NativeAdapters.find(BlockEntityAccess.class);
```

`find(...)` returns an empty result when the server version or implementation is unavailable. Initialization and linkage failures throw `IllegalStateException` with the original cause. Handle these failures through your plugin's normal logging and feature lifecycle.

Use `NativeAdapters.require(...)` when your feature cannot run without the capability. It throws `UnsupportedOperationException` when no implementation exists. Both methods also accept an explicit Minecraft version string.

`NativeAdapters.available(capability, version)` checks whether an implementation class exists without initializing it. This does not prove that a server supports every operation.

## Capabilities

All packages below are under `art.arcane.volmlib.nativelib`.

| Interface | Operations |
| --- | --- |
| `block.BlockEntityAccess` | Capture block-entity NBT and evaluate native container locks |
| `chunk.ChunkPacketAccess` | Send a loaded chunk to a player |
| `chunk.ChunkSendRateAccessor` | Read and change server chunk send and load rates |
| `map.MapPixelsAccess` | Capture vanilla map pixels and metadata |
| `entity.EntityVisibilityAccess` | Evaluate per-viewer entity visibility |
| `entity.EntityGlowAccess` | Create viewer-specific glow controls |
| `entity.VirtualPlayerAccess` | Create and control virtual player entities |
| `player.PlayerClientAccess` | Access client block tags and player motion |
| `advancement.AdvancementAccess` | Create advancement wrappers |
| `scoreboard.ScoreboardPackets` | Create and send scoreboard updates through opaque handles |
| `monitor.NativeMonitor` | Install native tick hooks and read native metrics |
| `monitor.NativeWorldAccess` | Access hopper, navigation, and fluid-tick operations |
| `protection.SpawnProtectionAccess` | Create native spawn-protection checks |
| `proxy.ProxyForwardingAccess` | Read the active Velocity forwarding key |

`ChunkSendRateAccessor` reads and writes live server limits. Consumers own rate validation and change policy. A missing field returns an empty read or a failed write.

`ProxyForwardingAccess.velocityKey()` returns the active forwarding key, or null when forwarding is unavailable or disabled. Keep the returned key private.

`MapPixelsAccess.capture(...)` returns an optional `NativeMapSnapshot`. Snapshots copy their pixel arrays on construction and access. Custom map renderers can make a vanilla pixel snapshot unavailable.

See [Native spawn protection](/volmlib/api/spawn-protection) for the protection decision contract.

## Terrain and world generation

Add `native-terrain-api` and `shared` at the same VolmLib release for terrain integrations. The 26.2 and 26.3 modules provide `terrain.NativeTerrainAccess` for block, biome, registry, palette, chunk, tile, and structure operations:

```java
NativeTerrainAccess terrain = NativeAdapters.require(NativeTerrainAccess.class);
```

Pass bulk data through `BukkitTerrainBuffer` and `NativeBlockVolume`. Use `NativeBlockState` and `NativeBiome` at interface boundaries. Keep your generator's dimension settings, terrain decisions, and feature selection in your plugin.

`NativeBlockProperties.canPlaceOnto` checks substrate compatibility. It accepts crimson and warped roots on soul soil or either nylium type, and Nether sprouts on either nylium type. Placement code must also enforce its clearance and surface-support rules.

`NativeGenerationRegistry.canonicalDefinition(...)` creates a typed registry definition from its registry key, entry key, and JSON. Resolve the registry through `NativeAdapters.require(NativeGenerationRegistry.class)`.

`NativeWorldGeneration.inject(world, context)` installs the selected version’s generator using your `NativeBukkitGeneratorContext`. The context supplies terrain, biome, structure, spawn, and generation-history policy through typed contracts. `lifecycle(policy)` creates its lifecycle controller; retain the controller and close its hooks during shutdown. Use `completeBootstrap(world)` after initial generation and `abandonBootstrap(world)` when creation fails.

`NativeWorldRuntime` inspects runtime world-loading capabilities, creates worlds from `WorldRuntimeOptions`, and unloads worlds asynchronously. Check `available()` before runtime creation. Supply a `WorldRuntimeExecution` implementation for global-thread scheduling, background work, and failure reporting. Dimension keys, the Bukkit generator identifier, persistence, seed selection, and storage paths are explicit options. Leave `dimensionTypeKey` null to use the configured overworld generation settings.

`NativeWorldRuntime.clock()` reads and writes runtime day time, tests whether the dimension has a mutable clock, and synchronizes time with players. `workers()` reads and adjusts the server generation worker count. Schedule these operations in the appropriate server context; consumers own temporary changes and restoration.

`server.NativeServerDiagnostics` identifies Canvas runtime support, native world-creation rejection, and raid-persistence log messages. It reports facts; consumers choose their diagnostics and filtering policy.

## Modded server integrations

The shared mod-loader sources provide `NativeModdedServer` for server scheduling, loaded-world lookup, player lookup, dimension storage paths, and datapack selection. `NativeWorld` identifies a loaded world and provides block, biome, height, and weather access. Use live-world lookup only on the server thread; `worlds()` uses the published world snapshot.

`NativeRegistryAccess` accepts a `Configuration` containing registry and reloadable-registry suppliers plus a warning consumer. Supply `HolderLookup.Provider` instances with the required datapacks already loaded. Live integrations can use `NativeModdedServer.registryAccess()` and `reloadableRegistries()`; offline integrations can supply their own loaded registries. `NativeTileReader` likewise accepts a registry-provider supplier. Keep these providers available until the owning integration closes.

`NativeCommandRegistration` registers Brigadier trees with `NativeCommandSource`. Read the command's world, player, position, and permission context through that source. Build formatted responses with `NativeCommandText`; `NativeCommandArguments` resolves native player, dimension, and identifier arguments.

`NativeChunkGeneratorDefinition` associates a generator key with a factory. Implement `NativeGeneratorOwner` and supply `NativeModdedGeneratorPolicy` to `NativeModdedChunkGenerator`; terrain buffers, generation leases, biome selection, structure ownership, and completion callbacks use typed contracts. Resolve your bound owner with `NativeWorldGenerators.find(world, ownerType)`.

`NativeDimensionRuntime` constructs and publishes runtime dimensions. Supply a registered dimension type, seed, generator key, and generator factory. The consumer owns pack selection, persistence, engine binding, loader-event publication, and rollback. Close a removed world and release its engine resources before deleting its storage.

`NativeWorldTeleport.teleport(...)` accepts a player and a `Destination` with the target server, world, coordinates, and an optional absolute `System.nanoTime()` deadline. A zero deadline leaves the operation unbounded. Pass `Double.MIN_VALUE` as Y to select a safe height from the terrain. The returned future reports success, disappearance of the player or world, or a failure. Chunk warming and ticket cleanup run on the server thread.

`NativeModdedPregenRuntime.from(world)` provides chunk requests, ticket release, saves, worker information, and empty-server pause controls through `terrain.NativePregenRuntime`. The consumer owns concurrency limits, completion tracking, cancellation, and restoration of temporary settings.

`NativeStructureOperations` enumerates registered structures, pools, and configured features, and captures placements into a world. Set the placement chunk limit and supply error and warning handlers. World writes require the owning server thread.

`NativeModdedLoader` exposes the current typed server and its world-access service. Register lifecycle callbacks with `NativeModdedCallbacks`; server, world, player, command, and block-interaction callbacks provide typed VolmLib contexts.

## Modded client integrations

The `native-minecraft26_2-sources` artifact supplies Minecraft implementation sources for mod-loader builds. Its root contains common terrain code; `modded/` contains shared mod code, and `fabric/`, `forge/`, and `neoforge/` contain loader-specific code. Compile the common sources, the sources under `versions/<minecraft-version>/`, and your selected loader sources against that loader's Minecraft dependencies. Select exactly one matching version directory, such as `versions/26.2/` or `versions/26.3/`, and strip that directory prefix when extracting its sources. The artifact also supplies `resources/modded` and `resources/<loader>`; include those directories as resources. Register `volmlib.entity.mixins.json` and `volmlib.client.mixins.json`, plus `volmlib.fabric.mixins.json` on Fabric. Fabric uses `volmlib.accesswidener`; Forge and NeoForge use the supplied `META-INF/accesstransformer.cfg`.

The neutral client contracts live under `nativelib.client`. `ClientGraphics`, `ClientScreen`, `ClientTexture`, and `ClientKeyBinding` support plugin-owned display behavior without Minecraft types in that behavior. Register a `ClientHudBinding` with the selected loader's native client hooks. Close uploaded textures when they leave your cache or the screen closes.

`ClientWorldPolicies.register(...)` associates a preset namespace and generator type with preset labels and world-creation behavior. Set the structure requirement and experimental-warning policy explicitly. Register client policies during client initialization and keep all native client calls on the client thread.

## Thread and lifecycle ownership

Call world and block operations on the owning region thread. Call player and entity operations on their owning entity thread. Native access does not transfer thread ownership or schedule work for callers.

Retain each capability for its owning service's lifetime. Close or remove hooks and virtual resources when that service stops. Apply your plugin's permissions, protection events, chunk availability, and gameplay rules before native operations.

## Native build metadata

The published `packaging` artifact provides `NativeDevelopmentTargets.require(adapter)` for each adapter’s Paper development bundle and Java version. Choose the adapters your plugin supports, then use this metadata to configure native integration tests.

Mod-loader builds can call `NativeAccessRules.prepare("minecraft26_2", loader, directory)` during configuration to obtain the matching access-widener or access-transformer file from the same published metadata artifact. Use a directory under your build output; unchanged rules retain their file timestamp. The native source artifact supplies the matching rules for the runtime jar.
