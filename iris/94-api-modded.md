---
title: "API - Modded"
description: "Iris documentation: API - Modded"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Mods can use `art.arcane.iris.modded.api` on Fabric, Forge, and NeoForge. This API is not present in the Bukkit plugin jar.

## Detect Iris and start pregeneration

```java
if (IrisModdedAPI.isIrisLevel(level)) {
    IrisModdedAPI.pregenerate(level, 4096);
}
```

Common methods:

```java
boolean isIrisLevel(ServerLevel level);
boolean isStudioLevel(ServerLevel level);
boolean pregenerate(ServerLevel level, int radiusBlocks);
<T> T getMantleData(ServerLevel level, int x, int y, int z, Class<T> type);
void setMantleData(ServerLevel level, int x, int y, int z, T value);
void deleteMantleData(ServerLevel level, int x, int y, int z, Class<T> type);
void registerProvider(ModdedDataProvider provider);
```

Pregeneration allows one active job. Mantle coordinates are world coordinates. Reads return `null` when absent; writes may access disk. Use your own retained mantle type and delete values you no longer need.

## Supply modded content

Implement `ModdedDataProvider` so Iris packs can reference your blocks, items, and entities:

```java
public interface ModdedDataProvider {
    String modId();
    Collection<Identifier> getTypes(ModdedDataType type);
    boolean isValidProvider(Identifier id, ModdedDataType type);
    default ModdedBlockData getBlockData(Identifier id, Map<String, String> state);
    default void processBlockPlacement(ModdedBlockPlacementContext context);
    default Entity spawnMob(ServerLevel level, double x, double y, double z, Identifier id);
}
```

`isValidProvider` and `getBlockData` may run concurrently during generation. Keep them fast and do not mutate the world. `processBlockPlacement` and `spawnMob` run on the server thread. A spawned entity must be added to the level by your provider.

Register the provider during mod setup with `IrisModdedAPI.registerProvider(provider)`, or list it for `ServiceLoader` under:

```text
META-INF/services/art.arcane.iris.modded.api.ModdedDataProvider
```

Use the mod ID `irisworldgen` for optional dependency checks. Poll `isIrisLevel` when needed; the modded API does not expose the Bukkit event surface.
