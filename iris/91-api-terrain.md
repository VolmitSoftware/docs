---
title: "API - Terrain"
description: "Iris documentation: API - Terrain"
published: true
date: 2026-09-02T00:00:00.000Z
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

## River fields

Columns inside an accepted river footprint carry the river plan as well as the terrain:

| Field | Value |
|---|---|
| `NATURAL_HEIGHT` | Terrain height before the river valley was cut |
| `RIVER_STATE` | `WET` for a channel with water, `DRY` for a dry bed, `NONE` outside a river |
| `RIVER_DISTANCE` | `0` in the channel, `1` on the shore, `2` on the eroded bank, `NaN` outside a river |
| `RIVER_FLOW` | `1` when the water has a flow direction, `0` for still water, `-1` when unavailable |
| `RIVER_WATER_SURFACE_Y` | Absolute Y of the water surface for a wet channel |

`surfaceKind` reports `RIVER`, `RIVER_SHORE`, or `DRY_CHANNEL` inside a footprint, and `surfaceHeight` under a river is the bed. A cold read may plan the river tile on the calling thread, so keep wide scans off tick threads. See [36 - Rivers](/iris/36-rivers).
