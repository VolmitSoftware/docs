---
title: "API - Modded"
description: "Iris documentation: API - Modded"
published: true
date: 2026-10-01T18:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Mods can use `art.arcane.iris.modded.api` on Fabric, Forge, and NeoForge. This API is not present in the Bukkit plugin jar.

## Detect Iris and start pregeneration

Wrap a loaded server level in `ModdedPlatformWorld` to obtain the `NativeWorld` accepted by the API. Start pregeneration on the server thread.

```java
import art.arcane.iris.modded.api.IrisModdedAPI;
import art.arcane.volmlib.nativelib.minecraft26_2.modded.ModdedPlatformWorld;
import art.arcane.volmlib.nativelib.terrain.NativeWorld;

NativeWorld world = new ModdedPlatformWorld(serverLevel);
if (IrisModdedAPI.isIrisLevel(world)) {
    IrisModdedAPI.pregenerate(world, 4096);
}
```

Common methods:

```java
boolean isIrisLevel(NativeWorld level);
boolean isStudioLevel(NativeWorld level);
boolean pregenerate(NativeWorld level, int radiusBlocks);
<T> T getMantleData(NativeWorld level, int x, int y, int z, Class<T> type);
<T> void setMantleData(NativeWorld level, int x, int y, int z, T value);
<T> void deleteMantleData(NativeWorld level, int x, int y, int z, Class<T> type);
void registerProvider(ModdedDataProvider provider);
```

Pregeneration allows one active job. Mantle coordinates are world coordinates. Reads return `null` when absent; writes may access disk. Use your own retained mantle type and delete values you no longer need.

## Supply modded content

Implement `ModdedDataProvider` so Iris packs can reference your blocks, items, and entities:

```java
public interface ModdedDataProvider {
    String modId();
    Collection<String> getTypes(ModdedDataType type);
    boolean isValidProvider(String id, ModdedDataType type);
    default ModdedBlockData getBlockData(String id, Map<String, String> state);
    default void processBlockPlacement(ModdedBlockPlacementContext context);
    default NativeSpawnedEntity spawnMob(NativeEntityRuntime.CustomSpawn request);
}
```

`isValidProvider` and `getBlockData` may run concurrently during generation. Keep them fast and do not mutate the world. `processBlockPlacement` and `spawnMob` run on the server thread. A spawned entity must be added to the level by your provider. Keys are canonical `namespace:path` strings. Return block answers with `ModdedBlockData.direct(ModdedBlockState)` or `ModdedBlockData.deferred(ModdedBlockState)`; resolve state strings with `NativeBlockResolver.strictParse(String)`.

`ModdedBlockPlacementContext.placement()` provides the captured position, level, and block state through `NativeBlockPlacement`. A spawn request provides `runtime()`, `position()`, and `key()`; return the spawned entity as `NativeSpawnedEntity`. These native handle types are in `art.arcane.volmlib.nativelib.minecraft26_2.modded`.

Register the provider during mod setup with `IrisModdedAPI.registerProvider(provider)`, or list it for `ServiceLoader` under:

```text
META-INF/services/art.arcane.iris.modded.api.ModdedDataProvider
```

Use the mod ID `irisworldgen` for optional dependency checks. Poll `isIrisLevel` when needed; the modded API does not expose the Bukkit event surface.

## Transform natural terrain

Implement `TerrainTransformProvider` from `art.arcane.iris.generation.terrain.transform` and list the implementation in `META-INF/services/art.arcane.iris.generation.terrain.transform.TerrainTransformProvider`. A dimension opts in with `terrainTransform`, containing the provider's `id`, exact `version`, and string-valued `settings`. Missing providers or version mismatches prevent that runtime from loading.

The provider creates one immutable, thread-safe `TerrainTransformer` per generation runtime. Its `radius()` declares how many blocks beyond the target chunk it reads, from zero through sixteen. `transform(TerrainTransformContext)` runs after natural terrain and boundary blending, before cave decoration, content mantle placement, deposits, objects, and surface decoration. Terrain carving and hydrology run before the transform.

`original(worldX, worldY, worldZ)` reads immutable natural block states within the declared horizontal radius. Reads outside build height return air. `set(localX, localY, localZ, state)` writes only the target chunk; local Y is relative to `minY()`. Writes do not change subsequent `original` reads, and saved historical columns remain protected. Do not retain the context or request live chunks from the callback. Calls for different chunks can run concurrently.

Iris uses the transformed terrain for content heights, cavity queries, and saved natural geometry. Change the provider version whenever its output rules change, and include all generation-affecting settings in the dimension descriptor. Providers must not read mutable global configuration during generation.

For transforms that can calculate one column independently, return a `TerrainColumnTransformer` from `columnTransformer()`. Iris uses it for sparse height and cavity queries without transforming the entire chunk. The callback receives the same context and target local X/Z, and may write only that column. Its solid occupancy, fluid occupancy, and heights must match the full transform; material-only changes can be omitted. Returning null uses the full transform for these queries.

Mods with their own later terrain pass can inspect `NativeModdedChunkGenerator.hasTerrainTransformer()` within the chunk's terrain generation scope and retain the result with that chunk. Use the retained result to suppress duplicate smoothing during later generation phases; the generator's current configuration may change between phases.
