---
title: "Native server access"
description: "Select versioned native capabilities for plugin integrations"
published: true
date: 2026-10-18T00:00:00.000Z
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

Implementations can be bundled or provisioned as runtime dependencies. Runtime loading must share the bundled API types with `native-common` and the selected version provider, keep API package names consistent, and retain bundled API members referenced by those external jars. Keep server-owned types used by native method signatures unrelocated. Use the original provider artifacts; a shrink pass against a different Minecraft version can remove required native overrides. Iris uses this runtime dependency option with build-pinned coordinates and SHA-256 checksums. Its provider checksums and retained API members come from the published JitPack artifacts, including when compilation uses a local VolmLib checkout.

For a separate provider loader, use the loader that owns `NativeAdapters` as its parent and call `NativeAdapters.registerProviderLoader(loader)` before resolving capabilities. After the owning worlds and hooks have stopped, call `releaseProviderLoader(loader)` and close the provider loader. Bundled integrations need no registration.

## Version selection

| Server release | Module |
| --- | --- |
| 1.21.11 | `native-v1_21_R7` |
| 26.1 and 26.1.1 | `native-v26_1_R1` (spawn protection only) |
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
| `chunk.ChunkPacketAccess` | Send loaded chunks, capture native chunk packets, and read world metadata |
| `chunk.GeneratedChunkStructures` | Read a loaded chunk's structure starts and referenced start-chunk positions |
| `chunk.ChunkSendRateAccessor` | Read and change server chunk send and load rates |
| `item.ItemStackAccess` | Encode and decode complete vanilla item data |
| `map.MapPixelsAccess` | Capture vanilla map pixels and metadata |
| `entity.EntityVisibilityAccess` | Evaluate per-viewer entity visibility |
| `entity.EntityMetadataAccess` | Fingerprint current synchronized entity metadata |
| `entity.EntityGlowAccess` | Create viewer-specific glow controls |
| `entity.VirtualPlayerAccess` | Create and control virtual player entities |
| `player.PlayerClientAccess` | Access client block tags and player motion |
| `player.PlayerRespawnAccess` | Snapshot player respawn policy, validate personal spawns without consuming anchors, and resolve shared spawn positions |
| `player.NativePlayerEffects` | Prepare and apply complete player effect chains through normal Paper effect events |
| `player.NativePlayerAdvancements` | Flush current player advancement changes without completion toasts |
| `advancement.AdvancementAccess` | Create advancement wrappers |
| `scoreboard.ScoreboardPackets` | Create and send scoreboard updates through opaque handles |
| `monitor.NativeMonitor` | Install native tick hooks and read native metrics |
| `environment.WorldEnvironmentAccess` | Sample world sky, fog, lighting, clouds, weather, and dimension properties |
| `monitor.NativeWorldAccess` | Access hopper, navigation, and fluid-tick operations |
| `storage.NativeWorldStorageConverter` | Convert a staged legacy CraftBukkit world through Paper's native file converter |
| `storage.NativeWorldStorageFork` | Flush a Paper world and replace the UUID in a staged dimension copy |
| `storage.NativeSavedWorldGeneration` | Read authenticated saved generation settings without loading a world |
| `protection.SpawnProtectionAccess` | Create native spawn-protection checks |
| `proxy.ProxyForwardingAccess` | Read the active Velocity forwarding key |

`ChunkPacketAccess.snapshotSupported()` checks whether the binding can encode native chunk snapshots. On supported 26.1.2, 26.2, and 26.3 bindings, `snapshot(world, new ChunkPosition(x, z))` returns an optional `ChunkPacketSnapshot` for an already-loaded column, including its block, biome, block-entity, and light data. The snapshot copies its bytes on construction and access, with a 2 MiB limit. `context(world)` returns an optional immutable `ChunkWorldContext` with separate world and dimension-type keys, the normal client spawn seed, dimension bounds, and time and weather values. Call both methods in the destination region's owning context; they do not load chunks or send packets. Snapshots are unavailable while native packet preparation is incomplete or the world uses a chunk anti-xray controller. `registryFingerprint(world)` returns a SHA-256 digest of biome registry IDs and block-state IDs for matching the client’s decoder. Consumers must also match the Minecraft protocol and preserve any filtering applied by other plugins; ordinary packet delivery remains appropriate when those guarantees are unavailable.

`ChunkPacketAccess.prepare(world, position)` captures an already-loaded chunk on its owning region and returns an optional `PreparedChunkPacket`. Check `ready()` before calling `send(player)` from the player’s owning context. The returned completion stage reports whether the normal connection write completed. Consumers retain any required chunk lease, reject stale captures, and handle unsuccessful writes. Preparation does not load chunks or move the player’s view center.

`ChunkSendRateAccessor` reads and writes live server limits. Consumers own rate validation and change policy. A missing field returns an empty read or a failed write.

`GeneratedChunkStructures` supports Paper and Folia 26.1.2, 26.2, and 26.3. Call `read(chunk)` on the chunk's owning region to obtain a `Snapshot` containing valid structure-start `Entry` values and referenced `ChunkPosition` values. Each entry has `NamespacedKey` structure and type keys plus immutable `Bounds` coordinates; the snapshot copies both lists. An unloaded chunk returns empty lists. Reading never loads or generates chunks and does not read the referenced chunks. Consumers own scheduling and loading any referenced start chunks before inspecting them.

`ProxyForwardingAccess.velocityKey()` returns the active forwarding key, or null when forwarding is unavailable or disabled. Keep the returned key private.

`MapPixelsAccess.capture(...)` returns an optional `NativeMapSnapshot`. Snapshots copy their pixel arrays on construction and access. Custom map renderers can make a vanilla pixel snapshot unavailable.

`ItemStackAccess.encode(ItemStack)` returns compressed vanilla item NBT with its Minecraft data version. `decode(byte[])` restores Bukkit items through the current registry and data fixer, with a 16 MiB decompressed-data limit. Names, lore, enchantments, and custom components are retained. Empty items are rejected. Use the owning server context when converting live inventory items. The same bytes can be exchanged with native Minecraft item codecs on compatible Minecraft versions.

`EntityMetadataAccess.fingerprint(entity)` is available on 26.2 and 26.3. Call it on the entity’s owning thread to read an opaque fingerprint of its current synchronized metadata without serialization or world and chunk loading. Unchanged data keeps the same fingerprint after vanilla sends its dirty fields; the value is not monotonic and must not be persisted as an entity revision.

`WorldEnvironmentAccess.sample(world, position)` returns an immutable `WorldEnvironment` snapshot at the supplied position. The 26.1.2, 26.2, and 26.3 providers include biome-dependent environment attributes, the eye medium (`NONE`, `WATER`, `LAVA`, or `POWDER_SNOW`), and dimension settings including `logicalHeight`, `hasCeiling`, `ambientLight`, and `hasFixedTime`; sky angles are in degrees. Call it in the owning world context with the sample chunk loaded. Consumers own chunk retention, scheduling, and handling unavailable capabilities.

`PlayerRespawnAccess` is available on 26.2 and 26.3. `snapshot(player)` returns an immutable `RespawnPolicy` containing a nullable personal `RespawnPoint`, the forced-spawn flag, and a required shared point. Each point stores its world, block coordinates, yaw, and pitch; `location()` returns a fresh Bukkit location. A null personal point means no configured personal destination is available in a loaded world.

Call `snapshot` on the player’s owning thread. After loading the surrounding destination chunks, call `validate(policy)` on the personal destination’s owning region; its optional location preserves vanilla orientation and does not consume respawn-anchor charges. For shared spawn, initiate `findSharedSpawn(policy.shared())` on the shared point’s owning region and compose its returned future before applying the result on the player’s owning thread. These methods do not schedule player mutations; the caller owns chunk loading and scheduling.

`NativePlayerAdvancements` supports Paper 26.1.2, 26.2, and 26.3. Capture a `Context` on the current Paper server thread and call `flushWithoutToast(player)` after changing awarded criteria through Bukkit. The context requires the same server, registry resources, owning thread, and online player session. Use `validateCurrent()` to check the captured owner. `sameEntry(expected, actual)` verifies that two Bukkit advancement wrappers refer to the same current registry entry. It refuses Folia and changed owners; it does not award criteria or change chat messages.

`NativePlayerEffects` supports Paper 26.1.2, 26.2, and 26.3. Capture a `Context` on the current Paper server thread, then call `prepare(player, effects)` to decode up to 256 distinct active effects before mutation. Each immutable `Effect` retains its key, duration, amplifier, ambient, particle and icon flags, and a hidden chain with at most 32 total nodes. Unknown keys, mismatched hidden keys, unsupported numeric values, Folia, stale registries, and unavailable player identities refuse preparation.

Call `context.apply(player, prepared)` on the same owner thread with the same registered player and world identity. The private receipt is single-use; clearing and adding use normal `PLUGIN` effect events, and cancellation reports failure. Consumers own restoration after a partial application and should prepare their source-effect receipt before changing the player.

See [Native spawn protection](/volmlib/api/spawn-protection) for the protection decision contract.

## Saved world generation

`NativeSavedWorldGeneration` supports Paper 26.1.2, 26.2, and 26.3. Call `capture(server, CaptureOptions.standard())` on the Paper server thread to obtain an immutable `InspectionContext`. Folia capture is unavailable. Call `context.inspect(request)` on an IO executor; it reads saved files without loading worlds, requesting generators, creating session locks, or changing source bytes.

A `Request` supplies the exact directory, namespaced world key, expected UUID, storage format, stem selection, and an optional expected seed. `PAPER_DIMENSION` reads `data/paper/metadata.dat` and `data/minecraft/world_gen_settings.dat`. Declared-environment requests require the matching `dimensions/<namespace>/<key>` directory. A context-issued loaded-world receipt also permits that world's exact native storage root, including the primary overworld directory. `LEGACY_LEVEL_DATA` reads `uid.dat` and `level.dat`. Canonical files accept the selected native release's DataVersion and the verified 4903 format; legacy files accept DataVersions 3465, 4189, and 4671. Supported older data is upgraded in memory. Unknown and future formats fail with `IOException`.

Select a vanilla stem with `DeclaredEnvironment(NORMAL)`, `DeclaredEnvironment(NETHER)`, or `DeclaredEnvironment(THE_END)`. A saved file can contain all three stems, so the world key alone does not select one. For a currently loaded world, call `context.capture(world)` on the Paper server thread and use `CapturedStem(receipt)`. The receipt authenticates that context, registered world UUID, key, directory, and native stem. `contextId()` identifies the capture and is included in every snapshot. Call `context.validateCurrent()` on the Paper server thread before using a result for publication; it rejects a replaced native registry access or resource-reload holder. Generator-provider reload epochs require separate provider evidence.

`Snapshot` includes the selected stem, selection evidence, seed, structure and bonus-chest flags, dimension and generator identifiers, raw selected-stem SNBT, and SHA-256 fingerprints with DataVersions for the files read. Its terrain is `VanillaNoise` for known normal, amplified, or large-biome presets, `Flat` for validated codec-canonical flat settings, or `Unrepresentable` with a reason. Flat settings retain layers, biome, features, lakes, and structure overrides. Unknown generators, inline noise settings, and additional generation fields remain unrepresentable; callers must retain the raw plan or refuse an operation that cannot reproduce it.

`fixedBiome` is present only for an explicitly saved fixed biome source. A flat world's biome does not imply a Bukkit biome-provider override. `context.normalizeFlatSettings(json)` returns `Flat` using the same native codec and registry context as saved flat settings. Valid omitted fields receive codec defaults; blank input, duplicate properties, unknown fields, invalid references, and malformed or excessive JSON fail with `IOException`. Equivalent settings produce the same canonical JSON. Generator-plugin and biome-provider overrides outside saved vanilla settings require independent provider evidence. The default limits bound compressed bytes, inflated bytes, NBT depth, collection sizes, and strings; `CaptureOptions` accepts validated custom `Limits`. Symbolic links, mismatched identities, malformed data, and files that change during inspection fail with `IOException`.

## World storage conversion

`NativeWorldStorageConverter` supports Paper 26.2 and 26.3. Its `convert(server, request)` method converts a staged legacy CraftBukkit folder into current Paper dimension storage. It does not create or load a Bukkit world or request a generator.

`Conversion` contains the staged source directory, staging container, target namespaced key, environment, and expected UUID. Copy the complete source before calling it. The source copy must be a direct child of the staging container. Paper consumes that copy during conversion.

The converter uses Paper's data fixers to retain saved world settings and persistent data. It refuses existing output, unsupported custom dimension stems, and a changed UUID. The returned path remains inside the staging container.

Run conversion on an IO executor. The caller owns source backups, chunk verification, publication, and staging cleanup. Keep original source files outside the staging container.

`NativeWorldStorageFork` supports Paper 26.2 and 26.3. Call `flush(world)` on the Paper server thread to save the world and flush pending storage writes. `fork(new Fork(stagedDimension, expectedUuid, replacementUuid))` validates the copied dimension's current UUID and atomically replaces it with a distinct UUID while retaining other metadata. Call `fork` on an IO executor, and pass a staged copy rather than live world storage. The caller owns the complete dimension copy, chunk verification, publication, and cleanup.

## Terrain and world generation

Add `native-terrain-api` and `shared` at the same VolmLib release for terrain integrations. The 26.2 and 26.3 modules provide `terrain.NativeTerrainAccess` for block, biome, registry, palette, chunk, tile, and structure operations:

```java
NativeTerrainAccess terrain = NativeAdapters.require(NativeTerrainAccess.class);
```

`terrain.RegistryClientNames.register(registryKey, physicalKey, clientKey)` assigns a client-visible registry name. Register names before players connect. Biome registry synchronization applies these names on Bukkit 26.2/26.3 and the modded terrain bindings; entry order and definition data are preserved. Server lookups and saved palettes continue using their physical keys. `resolve(registryKey, physicalKeys)` returns the corresponding names in the supplied order, retaining unmapped entries and assigning numbered namespaces to conflicting client names.

Pass bulk data through `BukkitTerrainBuffer` and `NativeBlockVolume`. Use `NativeBlockState` and `NativeBiome` at interface boundaries. Keep your generator's dimension settings, terrain decisions, and feature selection in your plugin.

`NativeBlockProperties.canPlaceOnto` checks substrate compatibility. It accepts crimson and warped roots on soul soil or either nylium type, and Nether sprouts on either nylium type. Placement code must also enforce its clearance and surface-support rules.

`NativeGenerationRegistry.canonicalDefinition(...)` creates a typed registry definition from its registry key, entry key, and JSON. Resolve the registry through `NativeAdapters.require(NativeGenerationRegistry.class)`.

`NativeWorldGeneration.inject(world, context)` installs the selected version’s generator using your `NativeBukkitGeneratorContext`. The context supplies terrain, biome, structure, spawn, and generation-history policy through typed contracts. Native structure stages respect the world’s Generate Structures setting: disabled worlds skip starts, references, placement, native locate predictions, and structure-volume prediction while terrain and feature stages continue. `lifecycle(policy)` creates its lifecycle controller; retain the controller and close its hooks during shutdown. Use `completeBootstrap(world)` after initial generation and `abandonBootstrap(world)` when creation fails.

Implement the block-change callbacks when your generator retains deferred content at generated positions. `StructureStagePolicy.trackBlockChanges` returns `NativeBlockChangeSet.create(bounds)` when that area contains such content, or `NativeBlockChangeSet.disabled()` when tracking is unnecessary. `NativeImportedFeaturePolicy.trackedBlockPositions` returns a set populated with the positions of retained content, allowing the feature pass to detect direct chunk-section writes as well as world writes. Both policies receive `invalidateBlockChanges` after placement, including partial writes when placement fails. Use `forEachChunk` and `forEachPosition` to discard superseded content; structure terrain fitting also records the air cell above a `FLATTEN` cut. Callbacks run in the generation context, so schedule any live entity cleanup on its owning thread.

`NativeBlockChangeSnapshot.capture(positions, reader)` samples only the supplied positions. Call `collectChanges(changes, reader)` afterward to add positions whose sampled values differ. Readers receive world X, Y, and Z; return immutable block-type values when neighbour-induced property changes must remain valid. Native world-access factories take an explicit `guarded` argument: `true` applies their generation-boundary and protected-position checks, while `false` retains the delegate's access rules while recording writes.

`NativeWorldLifecycleFactory.Controller.createServerShutdownBoundary()` captures the server's completed world-shutdown signal. Call `ServerShutdownBoundary.await(timeout, unit)` from a background thread before releasing resources needed by native chunk workers. A terminated server thread alone does not satisfy this boundary. A `false` result means dependent resources must remain available.

`NativeTerrainSnapshots.capture(request, policy)` captures a saved terrain column, and `flush(world, policy)` checkpoints pending terrain writes. Await these futures outside the tick thread and keep the world loaded until they finish. Snapshot requests use their chunk's owning context, can complete during synchronous chunk waits, and expire after 30 seconds.

`NativeWorldRuntime` inspects runtime world-loading capabilities, creates worlds from `WorldRuntimeOptions`, and unloads worlds asynchronously. Check `available()` before runtime creation. Supply a `WorldRuntimeExecution` implementation for global-thread scheduling, background work, and failure reporting. Dimension keys, the Bukkit generator identifier, persistence, seed selection, and storage paths are explicit options. Leave `dimensionTypeKey` null to use the configured overworld generation settings.

`NativeWorldRuntime.clock()` reads and writes runtime day time, tests whether the dimension has a mutable clock, and synchronizes time with players. `workers()` reads and adjusts the server generation worker count. Schedule these operations in the appropriate server context; consumers own temporary changes and restoration.

`server.NativeServerDiagnostics` identifies Canvas runtime support, native world-creation rejection, and raid-persistence log messages. It reports facts; consumers choose their diagnostics and filtering policy.

## Modded server integrations

The shared mod-loader sources support Fabric, Forge, and NeoForge on Minecraft 1.21.1 and 26.3. The 1.21.1 target uses Java 21 and the 26.3 target uses Java 25. They provide `NativeModdedServer` for server scheduling, loaded-world lookup, player lookup, dimension storage paths, and datapack selection. `NativeWorld` identifies a loaded world and provides block, biome, height, and weather access. Use live-world lookup only on the server thread; `worlds()` uses the published world snapshot.

`NativeRegistryAccess` accepts a `Configuration` containing a `Supplier<NativeModdedServer>` and a warning consumer. Return the current server after its datapacks have loaded, or null while no server is available. Registry lookups resolve against the supplied server on each call, including loot tables after datapack reloads. `NativeTileReader.forServer(serverSupplier)` uses the current server for live block-entity reads. The `NativeTileReader` constructor also accepts a registry-provider supplier for offline use. Keep the supplied context available until the owning integration closes.

`NativeProtocolPlayer.isGameMaster()` checks command permission level, while `isServerOwner()` identifies the singleplayer host independently of cheats. Use the owner check to deliver local maintenance notices without granting command permissions; it is false for dedicated-server players.

`NativeCommandRegistration` registers Brigadier trees with `NativeCommandSource`. Read the command's world, player, position, and permission context through that source. Build formatted responses with `NativeCommandText`; `NativeCommandArguments` resolves native player, dimension, and identifier arguments.

`NativeChunkGeneratorDefinition` associates a generator key with a factory. Implement `NativeGeneratorOwner` and supply `NativeModdedGeneratorPolicy` to `NativeModdedChunkGenerator`; terrain buffers, generation leases, biome selection, structure ownership, and completion callbacks use typed contracts. Resolve your bound owner with `NativeWorldGenerators.find(world, ownerType)`.

`NativeModdedGeneratorPolicy.terrainTransformed()` defaults to false. Return true when your generator applies a configured terrain transform before content placement. Other mods can read `NativeModdedChunkGenerator.hasTerrainTransformer()` within that chunk's terrain generation scope and retain the result with the chunk to suppress a duplicate terrain pass in later phases. Do not read the generator's current configuration as a substitute for the retained result after a runtime reload.

Call `NativeModdedChunkGenerator.initializeStructureState(world)` after publishing the bound generation runtime and before admitting chunk generation. Native generators defer structure-position initialization during world construction so biome queries use the bound runtime. Apply the same ordering when initially binding a replacement runtime.

`NativeDimensionRuntime` constructs and publishes runtime dimensions. Supply a registered dimension type, seed, generator key, and generator factory. The consumer owns pack selection, persistence, engine binding, loader-event publication, and rollback. Close a removed world and release its engine resources before deleting its storage.

`NativeWorldTeleport.teleport(...)` accepts a player and a `Destination` with the target server, world, coordinates, and an optional absolute `System.nanoTime()` deadline. A zero deadline leaves the operation unbounded. Pass `Double.MIN_VALUE` as Y to select a safe height from the terrain. The returned future reports success, disappearance of the player or world, or a failure. Chunk warming and ticket cleanup run on the server thread.

`NativeModdedPregenRuntime.from(world)` provides chunk requests, ticket release, saves, worker information, and empty-server pause controls through `terrain.NativePregenRuntime`. The consumer owns concurrency limits, completion tracking, cancellation, and restoration of temporary settings.

`NativeStructureOperations` enumerates registered structures, pools, and configured features, and captures placements into a world. Set the placement chunk limit and supply error and warning handlers. World writes require the owning server thread.

The Bukkit and modded generation stages apply overlapping starts of each native structure in origin-chunk coordinate order. Persisting and reloading structure references preserves the placement sequence used for seeded choices and terrain adjustments.

`NativeSpawnQueries.livingEntityCategories(world, chunkX, chunkZ)` returns native-category counts for living entities whose positions belong to the requested chunk, excluding players. Use it on the owning server thread when applying category-specific population limits. Native spawned entities save normally; their persistence flag controls distance despawning separately from saving.

`NativeModdedLoader` exposes the current typed server and its world-access service. Register lifecycle callbacks with `NativeModdedCallbacks`. Server, world, player, command, and block-interaction callbacks provide typed VolmLib contexts.

`start` runs before vanilla loads the worlds. Forge and NeoForge call `aboutToStart` immediately before `start`. `levelsReady` runs on the server thread after vanilla loads all worlds, before the dedicated-server watchdog starts. Use this callback to restore persistent dimensions. `started` runs after server initialization completes.

`NativeProtocolWorld.generator(type)` resolves the installed generator or its `NativeGeneratorOwner` by the requested type. It returns null when neither matches.

## Modded client integrations

The `native-minecraft26_2-sources` artifact supplies Minecraft implementation sources for mod-loader builds. Its root contains common terrain code; `modded/` contains shared mod code, and `fabric/`, `forge/`, and `neoforge/` contain loader-specific code. Compile the common and selected loader sources against that loader's Minecraft dependencies. Select `versions/1.21.1/` or `versions/26.3/` and strip that prefix when extracting its files; version files replace common files with the same relative path. When present, apply `source-replacements.json` rules to common Java sources before replacement: ordered `global` regular expressions followed by the rules for the file's relative archive path under `files`. Version replacement files already use their target APIs. The artifact also supplies `resources/modded` and `resources/<loader>`; include those directories as resources and apply matching version resource replacements. At Gradle configuration time, `NativeAccessRules.prepare` selects `minecraft1_21_1` access rules for 1.21.1 or `minecraft26_2` rules for 26.3. Register `volmlib.entity.mixins.json` and `volmlib.client.mixins.json`, plus `volmlib.fabric.mixins.json` on Fabric. Fabric uses `volmlib.accesswidener`; Forge and NeoForge use the supplied `META-INF/accesstransformer.cfg`.

The neutral client contracts live under `nativelib.client`. `ClientGraphics`, `ClientScreen`, `ClientTexture`, and `ClientKeyBinding` support plugin-owned display behavior without Minecraft types in that behavior. Register a `ClientHudBinding` with the selected loader's native client hooks. Close uploaded textures when they leave your cache or the screen closes.

`ClientWorldPolicies.register(...)` associates a preset namespace and generator type with preset labels and world-creation behavior. Set the structure requirement and experimental-warning policy explicitly. Register client policies during client initialization and keep all native client calls on the client thread.

## Thread and lifecycle ownership

Call world and block operations on the owning region thread. Call player and entity operations on their owning entity thread. Native access does not transfer thread ownership or schedule work for callers.

Retain each capability for its owning service's lifetime. Close or remove hooks and virtual resources when that service stops. Apply your plugin's permissions, protection events, chunk availability, and gameplay rules before native operations.

## Native build metadata

The published `packaging` artifact provides `NativeDevelopmentTargets.require(adapter)` for each adapter’s Paper development bundle and Java version. Choose the adapters your plugin supports, then use this metadata to configure native integration tests.

Mod-loader builds can call `NativeAccessRules.prepare("minecraft26_2", loader, directory)` during configuration to obtain the matching access-widener or access-transformer file from the same published metadata artifact. Use a directory under your build output; unchanged rules retain their file timestamp. The native source artifact supplies the matching rules for the runtime jar.
