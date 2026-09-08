---
title: "API - Terrain"
description: "Iris documentation: API - Terrain"
published: true
date: 2026-09-08T07:30:00.000Z
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

## Volumetric terrain queries

For biome `terrain3D`, natural-height queries return the highest solid block after volumetric shaping. `surfaceHeight` remains a single height per column. It does not enumerate lower ledges. River-owned columns report the accepted bed. Biome queries within a natural overhang gap and at its exposed floors retain the surface biome. A lower Y alone does not select a cave biome.

Engine terrain-column queries expose the shaped solid spans in internal Y. Solidity and carving queries include their open gaps. Object-placement transactions use the same density openings in prerequisite carving queries, with saved geometry and hydrology overrides retaining precedence. Additional stacked, inverted or floating terrain supplies its own support volume. Generation-history records remain authoritative for saved terrain.

## River policy resolution

`RiverPolicyResolver.resolveWithStatus(dimension, region, biome)` returns the inherited policy and a `complete` flag. The flag is false if a declared river-biome reference returns null during that resolution. Filtering and inheritance match `resolve(...)`.

`IrisRiverPolicy.compatBiomes(declared, data, field, onUnresolvedReference)` calls the callback for each reference that the loader cannot resolve. The three-argument overload keeps its existing filtering behavior.

## Engine biome previews

`Engine.getBiomeOrMantleEnvironment(x, y, z)` returns the region, biome, and defining data together. It includes mantle cave and flooded-biome overrides where saved records do not apply. Saved records remain authoritative. A pending saved read throws `SavedBiomeUnavailableException` with `isLoading()` set; callers that display status should retry later without blocking the gameplay thread.

`Engine.drawForPreview(x, z)` is an interruptible background-rendering operation. Iris waits for a bounded saved surface-biome read and retains its historical definitions until the color is computed. Call it from a renderer worker, never from a gameplay callback. The ordinary `draw(x, z)` path keeps its immediate-query behavior.

## Engine generation-history queries

`Engine.getObjectsAt(chunkX, chunkZ)` returns object keys recorded for a sealed chunk. `Engine.getPOIsAt(chunkX, chunkZ)` returns recorded POI keys and positions. These reads do not open an archived runtime or require its pack. A sealed empty record returns an empty set.

POI positions use world X/Z and internal Y. Add the dimension minimum height to internal Y when converting to an absolute world height. The current mantle fallback uses the same coordinates for chunks without sealed records.

Recorded cave facts include only cells that remain open after terrain reconciliation. These are generation facts, not a live inventory of player edits. Terrain placement queries in the transition band use resolved natural geometry. Speculative queries do not record generated ownership or native terrain capsules.

## Engine terrain journals

`TerrainMatterView.getComposedCavern(chunk, x, y, z)` reads cave intent under one chunk lock, using internal Y and chunk-local X/Z coordinates. It honors captured original values from object placement; non-null hydrology overrides the baseline cavern, including a seal guard that returns `null`. Missing chunks, sections, and out-of-range Y return `null`.

## Engine mantle cleanup

`EngineMantle.cleanupChunk(x, z)` and `forceCleanupChunk(x, z)` validate coverage before removing temporary slices. `cleanupChunksCoveredBy(x, z, force, callback)` visits candidates affected by a completed chunk and calls back only for newly cleaned chunks. Coordinates are chunk coordinates.

`cleanupCoveredChunk(x, z, force)` requires the caller to have already verified the complete coverage halo. It performs the atomic cleaned-flag and slice update without checking coverage itself. Prefer the coverage-checking methods for ordinary callers. Retained mantle slices survive both normal and forced cleanup.
