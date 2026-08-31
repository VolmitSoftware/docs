---
title: "API - Terrain"
description: "Iris documentation: API - Terrain"
published: true
date: 2026-08-26T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

`IrisTerrainService` reports what Iris would generate at a coordinate. It does not load chunks or include player edits and placed structures.

## Get the service

```java
RegisteredServiceProvider<IrisTerrainService> registration =
    Bukkit.getServicesManager().getRegistration(IrisTerrainService.class);

if (registration == null) {
    return;
}

IrisTerrainService terrain = registration.getProvider();
```

## Query a coordinate

```java
if (!terrain.isIrisWorld(world)) {
    return;
}

OptionalInt height = terrain.surfaceHeight(world, blockX, blockZ);
Optional<String> biome = terrain.surfaceBiomeKey(world, blockX, blockZ);
Optional<String> region = terrain.regionKey(world, blockX, blockZ);
IrisSurfaceKind kind = terrain.surfaceKind(world, blockX, blockZ);
```

Available reads:

```java
boolean isIrisWorld(World world);
Optional<IrisWorldInfo> worldInfo(World world);
OptionalInt surfaceHeight(World world, int x, int z);
IrisSurfaceKind surfaceKind(World world, int x, int z);
Optional<String> surfaceBiomeKey(World world, int x, int z);
Optional<String> surfaceBiomeName(World world, int x, int z);
Optional<String> biomeKey(World world, int x, int y, int z);
Optional<String> regionKey(World world, int x, int z);
Optional<String> regionName(World world, int x, int z);
```

Keys are stable pack IDs suitable for storage. Names are display text and may change with the pack.

## Batch reads

Use `sampleColumns(world, query, sink)` for rectangular scans. Respect `maxSampleColumns()` and `maxSampleChunks()`. The sink receives each requested field without allocating a result list.

Terrain reads are thread-safe and return inline. Empty optionals mean the world is not active in Iris or the requested value does not exist.
