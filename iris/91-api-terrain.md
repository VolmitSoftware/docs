---
title: "API - Terrain"
description: "Iris documentation: API - Terrain"
published: true
date: 2026-10-04T13:00:54.342Z
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
Optional<IrisBiomeInfo> surfaceBiomeInfo(World world, int x, int z);
Optional<String> biomeKey(World world, int x, int y, int z);
Optional<String> regionKey(World world, int x, int z);
Optional<String> regionName(World world, int x, int z);
```

Keys are stable pack IDs suitable for storage. Names are display text and may change with the pack.

## Surface biome metadata

`surfaceBiomeInfo(world, x, z)` returns an immutable snapshot of the surface biome. `IrisBiomeInfo` contains `key`, `name`, `regionKey`, `regionName`, `derivativeKey`, `vanillaDerivativeKey`, `type`, and `customDerivatives`. The type is lowercase `land`, `sea`, `shore`, or `cave`, or an empty string when unclassified. Saved biome records do not preserve this inferred category, so retained definitions can report an empty type.

Each `IrisCustomBiomeInfo` entry contains the authored `customDerivitives[].id` and its namespaced `registryKey`. The list preserves definition order and is immutable. It is empty for a biome without custom derivatives. These are all configured derivatives, not the randomly selected physical biome at an exact Y.

Saved columns resolve their biome, region, and custom registry mappings from the retained generation definitions. A missing registry mapping preserves the authored ID with an empty `registryKey` and reports the failure through the terrain API's rate-limited logger. Missing string metadata is normalized to an empty string; failure to resolve the surface environment returns an empty optional.

`IrisWorldInfo` also supplies absolute `minHeight`, exclusive `maxHeight`, `height()` as their difference, and absolute `fluidHeight`. The fluid level describes dimension configuration, not the current water block at a location.

## Batch reads

Use `sampleColumns(world, query, sink)` for rectangular scans. Respect `maxSampleColumns()` and `maxSampleChunks()`. The sink receives each requested field without allocating a result list.

Terrain reads are thread-safe and return inline. Empty optionals mean the world is not active in Iris, the requested value does not exist, or saved biome data is still loading. Pending saved reads return the method's unavailable result without logging a fault; retry on a later refresh. A batch that encounters pending data returns `false` and may have already delivered earlier columns. Actual read failures still use the rate-limited error logger.

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

For biome [`terrain3D`](/iris/47-volumetric-terrain), natural-height queries return the highest solid block after volumetric shaping. `surfaceHeight` remains a single height per column. It does not enumerate lower ledges. River-owned columns report the accepted bed. Biome queries within a natural overhang gap and at its exposed floors retain the surface biome. A lower Y alone does not select a cave biome.

## River policy resolution

`RiverPolicyResolver.resolveWithStatus(dimension, region, biome)` returns the inherited policy and a `complete` flag. The flag is false if a declared river-biome reference returns null during that resolution. Filtering and inheritance match `resolve(...)`.

`IrisRiverPolicy.compatBiomes(declared, data, field, onUnresolvedReference)` calls the callback for each reference that the loader cannot resolve.

## Authored subterrain sampling and locate

`Engine.getSubterrainCell(x, internalY, z)` returns the composed authored feature cell. Engine Y is measured above the dimension build floor; convert an absolute world Y by subtracting `engine.getWorld().minHeight()`. The result kind is `OUTSIDE`, `SOLID`, `AIR`, `WATER` or `LAVA`. Fluid kind and block material reflect the feature's selected `fluid`, independently of its geometry family. `occupied()` includes only air and fluid; `owned()` also includes solid boundaries. `Engine.getSubterrainBiome` returns the configured biome only for occupied cells, or null otherwise.

Each owned cell has `room()` context containing its stable feature instance ID, family and biome, center and path coordinates, solid `floorY` and `ceilingY`, boundary distance, fluid head, occupancy and reserved passage/solid flags. These context Y coordinates are absolute world Y. `vaultHeight()` is the open height between the floor and ceiling.

For `SOLID` cells, `material()` reports the feature's structural `solid` fallback. Generated exposed boundaries can use the owning biome's safe floor, ceiling or wall palette; interior solids keep the fallback. Air and fluid materials directly match their planned kinds.

Procedural placement implementations receive room context through `getVariantObject(IrisData data, RNG rng, SubterrainRoom room)`. Cave placement resolves the room before baking a variant; ordinary placements pass null. Implementations use the three-argument contract. The two-argument interface method has been removed.

For floor-aligned object placement, use `IrisObject.placeOnFloor(int x, int firstAirY, int z, IObjectPlacer placer, IrisObjectPlacement config, RNG rng, BiConsumer<BlockPosition, NativeBlockState> listener, IrisData data)`, which returns the placement result Y. Supply the first open internal Y above the chosen supporting floor. The object's lowest rotated non-air block aligns to that Y before configured translation and random Y offsets. The supplied placer continues to govern placement guards; the method does not search for a floor. Use an explicit nonnegative Y and a floor placement mode; ceiling-hung and structure-piece placements use `place`.

```java
int resultY = object.placeOnFloor(
        blockX, firstOpenInternalY, blockZ, placer, placement, rng, listener, data);
```

For retained generation definitions and XYZ locate:

```java
SubterrainLocator.Query query = new SubterrainLocator.Query(
        "", IrisSubterrainFamily.CENOTE, "subterrain/cenote");
Optional<SubterrainLocator.Result> result = GenerationSemanticQueries.nearestSubterrain(
        engine, query, blockX, absoluteWorldY, blockZ, 8192);
```

Query filters can use a feature definition ID, family or biome; empty strings and a null family leave that filter unset. A result contains the stable instance `featureId`, `family`, `biome` and an occupied `x`, absolute `y`, `z` anchor. Searches use bounded candidates without generating chunks or mantle data and verify occupied ownership before reporting a result. Run wide searches on a worker thread. A search exceeding its bounded candidate budget reports an error; reduce the radius. Search duration depends on radius, density and configured feature count.

Use `IrisTerrainService.biomeKey(world, x, absoluteY, z)` for the saved-aware biome key at a world coordinate. Engine feature reads use retained generation definitions for generated chunks and the active plan for eligible ungenerated coordinates. Saved logical biome queries preserve exact per-block XYZ ownership inside authored feature chunks. Minecraft physical biomes remain 4×4×4 cells, which can cover adjacent solids at a feature boundary. They do not inspect player changes. Saved biome and generation-history APIs remain authoritative for existing generated chunks.

## Engine biome previews

`Engine.getBiomeOrMantleEnvironment(x, y, z)` returns the region, biome, and defining data together. It includes mantle cave and flooded-biome overrides where saved records do not apply. Saved records remain authoritative. A pending saved read throws `SavedBiomeUnavailableException` with `isLoading()` set; callers that display status should retry later without blocking the gameplay thread.

`Engine.drawForPreview(x, z)` is an interruptible background-rendering operation. Iris waits for a bounded saved surface-biome read and retains its historical definitions until the color is computed. Call it from a renderer worker, never from a gameplay callback. The ordinary `draw(x, z)` path keeps its immediate-query behavior.

## Engine generation-history queries

`Engine.getObjectsAt(chunkX, chunkZ)` returns object keys recorded for a sealed chunk. `Engine.getPOIsAt(chunkX, chunkZ)` returns recorded POI keys and positions. These reads do not open an archived runtime or require its pack. A sealed empty record returns an empty set.

POI positions use world X/Z and internal Y. Add the dimension minimum height to internal Y when converting to an absolute world height. The current mantle fallback uses the same coordinates for chunks without sealed records.
