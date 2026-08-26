---
title: "API - Terrain"
description: "Iris documentation: API - Terrain"
published: true
date: 2026-08-26T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
`art.arcane.iris.api.terrain` answers what the Iris generator says about
a coordinate. It reports whether a world is Iris-generated, which biome
and region the pack places, the natural and final surface heights, and the
accepted surface-hydrology state, footprint-band code, directional-flow flag, and local fluid head. It also reports whether
that surface is land, shore, river, river shore, dry channel, ocean, or void. It reads the **generator**, not the world. No chunk load,
no forced generation, no placed-block read, and no knowledge of player
edits. Natural-only reads evaluate procedural terrain. Accepted-plan-dependent reads may synchronously build a cold bounded hydrology tile; warm reads reuse the immutable plan.

Use it when you need the pack's intent for a coordinate without paying to
generate it. Examples: picking a base or settlement site, rendering a map
or minimap, or planning a pregeneration region. Also use it to gate a
feature on whether the world is Iris, or to label a HUD with the pack
biome. If you need the
blocks a player can actually see — including objects, structures, and
edits — you want Bukkit's world API instead.

Build and service acquisition:
[90 - API - Getting Started](/iris/90-api-getting-started). Service:
`IrisTerrainService`, registered at `ServicePriority.Normal` for Iris's
enabled lifetime.

```java
package com.example.integration;

import art.arcane.iris.api.terrain.IrisTerrainService;
import org.bukkit.Bukkit;
import org.bukkit.plugin.RegisteredServiceProvider;

public final class TerrainAccess {
    private TerrainAccess() {
    }

    public static IrisTerrainService service() {
        RegisteredServiceProvider<IrisTerrainService> provider =
                Bukkit.getServicesManager().getRegistration(IrisTerrainService.class);
        return provider == null ? null : provider.getProvider();
    }
}
```

Missing registration means Iris is absent or not enabled yet. `null`, not
an exception. There is no static `Iris` accessor for this surface.

---

## The read surface

```java
public interface IrisTerrainService {
    boolean isIrisWorld(World world);

    Optional<IrisWorldInfo> worldInfo(World world);

    OptionalInt surfaceHeight(World world, int blockX, int blockZ);

    IrisSurfaceKind surfaceKind(World world, int blockX, int blockZ);

    Optional<String> surfaceBiomeKey(World world, int blockX, int blockZ);

    Optional<String> surfaceBiomeName(World world, int blockX, int blockZ);

    Optional<String> biomeKey(World world, int blockX, int blockY, int blockZ);

    Optional<String> regionKey(World world, int blockX, int blockZ);

    Optional<String> regionName(World world, int blockX, int blockZ);

    int maxSampleColumns();

    int maxSampleChunks();

    boolean sampleColumns(World world, IrisColumnQuery query, IrisColumnSink sink);
}
```

All coordinates are **absolute block coordinates in world space**,
including `blockY` and `surfaceHeight`. There is no engine-space offset
for the caller.

`*Key` returns a pack load key (`desert/hot-dunes`, `overworld`). Stable,
lowercase, store this. `*Name` returns the author's display string
(`Hot Desert Dunes`). For display. It can change when the pack author
edits it. Both are empty when the value is absent or the empty string.

---

## Cost and blocking

Iris's generator is procedural. Natural terrain reads evaluate the stack for one column and memoise in a shared per-chunk noise cache. When hydrology is active, final height, final surface biome, surface kind, and river fields also consume the immutable accepted plan. The first such query in a routing tile can build that tile synchronously; a concurrent query for the same tile can wait for its in-flight result. The runtime retains at most 64 hydrology tiles. Nothing here reads chunk storage, loads a region file, or asks the server to generate.

| Call | Cost when cold | Cost when warm | Forces generation | Can wait | When data is absent |
|---|---|---|---|---|---|
| `isIrisWorld` | `World#getGenerator()` + `instanceof` | same | No | No | `false` |
| `worldInfo` | field reads off live engine/dimension | same | No | No | `Optional.empty()` |
| `surfaceHeight` | final terrain sample; may build an accepted hydrology tile | accepted column lookup | No | Cold CPU / same-tile in-flight plan | `OptionalInt.empty()` |
| `surfaceKind` | final height and accepted surface layer; surface biome only when needed | accepted column lookup | No | Cold CPU / same-tile in-flight plan | `IrisSurfaceKind.UNKNOWN` |
| `surfaceBiomeKey` / `surfaceBiomeName` | natural biome plus accepted surface content | array/plan lookup | No | Cold CPU / same-tile in-flight plan | `Optional.empty()` |
| `biomeKey` at/near surface | as surface biome + height to choose surface vs cave | array/plan lookup | No | Cold CPU / same-tile in-flight plan | `Optional.empty()` |
| `biomeKey` well below surface | final height first to choose surface versus cave, then cave-biome stream and carving resolution | array/plan lookup | No | Cold CPU / same-tile in-flight plan | `Optional.empty()` |
| `regionKey` / `regionName` | region sample (cheapest biome-family call) | array read | No | No | `Optional.empty()` |
| `maxSampleColumns` / `maxSampleChunks` | settings fields | same | No | No | positive number always |
| `sampleColumns` | requested fields per column; may cross cold hydrology tiles | array/plan lookups | No | Cold CPU / same-tile in-flight plan | `false`, sink untouched |

**Do not run wide cold scans on a tick or region thread.** They can build multiple accepted plans and evict both the hydrology tile cache and the generator's noise-cache working set shared with live chunk generation. Use `sampleColumns` from an appropriate async worker for anything wider than a handful of columns.

**Values are the generator's opinion, not the world's.** `surfaceHeight`
is the topmost generated terrain block Y. It excludes objects,
decorations, structures, trees, snow, and player edits. For real blocks
use Bukkit `World#getHighestBlockYAt` (chunk load cost). For pack intent
(pregeneration planners, map renderers, spawn pickers) use this API.

### Surface height, precisely

`surfaceHeight` returns absolute Y of the **topmost generated terrain
block**, including an accepted hydrology bed where that layer owns terrain. Standing height is `surfaceHeight + 1`.
Fluid is ignored: under an ocean or river you get the bed. Compare with
`IrisWorldInfo.fluidHeight()` only for the dimension sea level; an accepted
river layer may have a different exact per-column head. Request
`RIVER_WATER_SURFACE_Y` or use `surfaceKind` for river-aware work.

---

## Threading

**Every read may be called from any thread, including async.** Plan cold hydrology work accordingly.

- Only Bukkit call on your behalf: `World#getGenerator()` on the world
  object. No chunk, block state, entity, or world-list walk.
- After that: engine-internal natural sampling and immutable accepted-plan
  lookup. No region-owned Bukkit state.
- A cold hydrology query plans on the calling thread. Concurrent callers
  for the same key share one in-flight tile and may wait for its completion.
  The API does not schedule that work onto a server thread for you.

Wide scans belong on your own async executor. On Folia there is no single
correct region thread for a multi-region scan.

**`IrisColumnSink.accept` runs on the thread that called `sampleColumns`,
inline, once per column.** If that thread is async, the sink must not
touch Bukkit state. Collect locally, hop afterward.

---

## Column sampling

`sampleColumns` walks a rectangle at a stride, chunk by chunk, into your
sink.

```java
public record IrisColumnQuery(
        int minBlockX,
        int minBlockZ,
        int maxBlockX,
        int maxBlockZ,
        int strideBlocks,
        EnumSet<IrisColumnField> fields) {

    public static IrisColumnQuery rect(
            int minBlockX,
            int minBlockZ,
            int maxBlockX,
            int maxBlockZ,
            int strideBlocks,
            EnumSet<IrisColumnField> fields);

    public long columnCount();

    public long chunkCount();

    public EnumSet<IrisColumnField> fields();
}
```

Bounds are **inclusive on both ends**. Lattice anchors at
`(minBlockX, minBlockZ)` and steps by `strideBlocks`.

Constructor rejects with `IllegalArgumentException`:

- empty `fields`
- `maxBlockX < minBlockX` or `maxBlockZ < minBlockZ`
- `strideBlocks < 1`

Null `fields` throws `NullPointerException`.

`fields` is defensively copied on construction and on every `fields()`
call. `fields()` allocates a fresh `EnumSet` each call. Hoist it out of
loops.

`columnCount()` and `chunkCount()` saturate at `Long.MAX_VALUE` on
overflow.

### Hard limits

```
maxSampleChunks  = max(64, noiseCacheSize / 4)
maxSampleColumns = maxSampleChunks * 256   (capped at Integer.MAX_VALUE)
```

Default `performance.noiseCacheSize` is `1024` → **256 chunks and
65 536 columns**. One API query may not consume more than a quarter of
the live generator cache.

**A query over either limit returns `false` and never calls the sink.**
No partial answer, truncation, exception, or log line.

Limits are independent. Example: stride 64 over a 6400×6400 block
rectangle can pass the column limit and fail the chunk limit.
**`chunkCount()` is the chunk span of the rectangle, not sampled
columns.** Stride does not reduce it. Tile large areas.

Ask `maxSampleColumns()` / `maxSampleChunks()` every time. They change
when the operator edits settings and reloads.

### The sink

```java
@FunctionalInterface
public interface IrisColumnSink {
    void accept(IrisColumnSample sample);
}
```

Every column produces one immutable typed sample:

```java
public record IrisColumnSample(
        int blockX,
        int blockZ,
        int surfaceHeight,
        int naturalHeight,
        IrisSurfaceKind surfaceKind,
        String biomeKey,
        IrisRiverState riverState,
        double riverDistance,
        int riverFlow,
        int riverWaterSurfaceY) {

    public static final int UNAVAILABLE_HEIGHT = Integer.MIN_VALUE;
    public static final double UNAVAILABLE_RIVER_DISTANCE = Double.NaN;
    public static final int UNAVAILABLE_RIVER_FLOW = -1;
}
```

| Field requested | Accessor | If requested | If unavailable or not requested |
|---|---|---|---|
| `SURFACE_HEIGHT` | `surfaceHeight()` | absolute world Y of final topmost terrain | `UNAVAILABLE_HEIGHT` |
| `NATURAL_HEIGHT` | `naturalHeight()` | absolute world Y before accepted hydrology shaping | `UNAVAILABLE_HEIGHT` |
| `SURFACE_KIND` | `surfaceKind()` | any concrete `IrisSurfaceKind` | `UNKNOWN` |
| `BIOME_KEY` | `biomeKey()` | final surface-biome load key | `null` |
| `RIVER_STATE` | `riverState()` | `WET`, `DRY`, or `NONE` from the primary accepted surface layer | `NONE` |
| `RIVER_DISTANCE` | `riverDistance()` | categorical footprint band: `0` channel, `1` shore, or `2` outer grade | `NaN` |
| `RIVER_FLOW` | `riverFlow()` | `1` when a connected accepted surface layer has a nonzero flow vector, otherwise `0` | `-1` |
| `RIVER_WATER_SURFACE_Y` | `riverWaterSurfaceY()` | absolute `fluidHeadY` for a connected accepted surface layer | `UNAVAILABLE_HEIGHT` |

Use the sample's `hasSurfaceHeight()`, `hasNaturalHeight()`,
`hasSurfaceKind()`, `hasBiomeKey()`, `hasRiverDistance()`,
`hasRiverFlow()`, and `hasRiverWaterSurfaceY()` helpers rather than
comparing ordinary world values to sentinels. `hasRiverState()` means the
sample is inside a wet or dry river footprint; `NONE` covers both an
unrequested field and a requested column without a river.

The sink's `biomeKey` is the **surface** biome. The same value
`surfaceBiomeKey` returns for that column, never a cave biome. There is
no 3D equivalent of `biomeKey(world, x, y, z)` in a column walk.

Fewer fields cost less. `NATURAL_HEIGHT` alone skips accepted hydrology sampling.
River state, footprint band, directional-flow flag, and local head share one accepted column sample.
`SURFACE_KIND` samples the primary accepted surface layer and skips the biome stream when an
explicit hydrology role or fluid/void result already determines the kind.
`BIOME_KEY` pays for the final surface-biome stream every column.

### Visit order

Columns arrive **grouped by chunk**. Chunk walk: Z outer, X inner. Within
a chunk: lattice Z outer, X inner. Deterministic for a given query.
**Not** a pure row-major sweep of the rectangle. Sort or index by
`(blockX, blockZ)` if you need raster order.

### Return value

`true` iff every column was delivered. `false` when:

- `world`, `query`, or `sink` is null, or no live Iris engine — sink
  untouched
- a limit was exceeded — sink untouched
- **your sink threw** — walk stops at that column
- **engine closed mid-walk** — walk stops at that column

In the last two cases, already-delivered columns stay delivered. Treat
`false` as incomplete. Discard partial results if completeness is
required.

---

## Worked example: flattest buildable spot

Async sample, then hop to the player's entity scheduler (correct on Paper
and Folia).

```java
package com.example.settlement;

import art.arcane.iris.api.terrain.IrisColumnField;
import art.arcane.iris.api.terrain.IrisColumnQuery;
import art.arcane.iris.api.terrain.IrisColumnSample;
import art.arcane.iris.api.terrain.IrisColumnSink;
import art.arcane.iris.api.terrain.IrisSurfaceKind;
import art.arcane.iris.api.terrain.IrisTerrainService;
import art.arcane.iris.api.terrain.IrisWorldInfo;
import org.bukkit.Location;
import org.bukkit.World;
import org.bukkit.entity.Player;
import org.bukkit.plugin.Plugin;
import org.bukkit.plugin.RegisteredServiceProvider;

import java.util.EnumSet;
import java.util.Optional;
import java.util.concurrent.Executor;

public final class SettlementSiteFinder {
    private static final int RADIUS_BLOCKS = 512;
    private static final int STRIDE_BLOCKS = 8;

    private final Plugin plugin;
    private final Executor background;

    public SettlementSiteFinder(Plugin plugin, Executor background) {
        this.plugin = plugin;
        this.background = background;
    }

    public void findFor(Player player) {
        World world = player.getWorld();
        Location origin = player.getLocation();
        int centreX = origin.getBlockX();
        int centreZ = origin.getBlockZ();

        background.execute(() -> {
            String result = search(world, centreX, centreZ);
            player.getScheduler().run(plugin, task -> player.sendMessage(result), null);
        });
    }

    private String search(World world, int centreX, int centreZ) {
        IrisTerrainService terrain = service();

        if (terrain == null || !terrain.isIrisWorld(world)) {
            return "That world is not generated by Iris.";
        }

        Optional<IrisWorldInfo> info = terrain.worldInfo(world);

        if (info.isEmpty()) {
            return "The Iris engine for that world is not available right now.";
        }

        IrisColumnQuery query = IrisColumnQuery.rect(
                centreX - RADIUS_BLOCKS,
                centreZ - RADIUS_BLOCKS,
                centreX + RADIUS_BLOCKS,
                centreZ + RADIUS_BLOCKS,
                STRIDE_BLOCKS,
                EnumSet.of(IrisColumnField.SURFACE_HEIGHT, IrisColumnField.SURFACE_KIND));

        if (query.columnCount() > terrain.maxSampleColumns()
                || query.chunkCount() > terrain.maxSampleChunks()) {
            return "That search area is larger than this server allows.";
        }

        int fluidHeight = info.get().fluidHeight();
        Best best = new Best();

        IrisColumnSink sink = (IrisColumnSample sample) -> {
            if (sample.surfaceKind() != IrisSurfaceKind.LAND
                    || sample.surfaceHeight() <= fluidHeight) {
                return;
            }

            long score = (long) Math.abs(sample.surfaceHeight() - fluidHeight) * 1024L
                    + Math.abs(sample.blockX() - centreX) + Math.abs(sample.blockZ() - centreZ);

            if (score < best.score) {
                best.score = score;
                best.x = sample.blockX();
                best.y = sample.surfaceHeight();
                best.z = sample.blockZ();
            }
        };

        if (!terrain.sampleColumns(world, query, sink)) {
            return "The terrain scan did not complete. Try again.";
        }

        if (best.score == Long.MAX_VALUE) {
            return "No dry land within " + RADIUS_BLOCKS + " blocks.";
        }

        return "Best site: " + best.x + ", " + (best.y + 1) + ", " + best.z;
    }

    private IrisTerrainService service() {
        RegisteredServiceProvider<IrisTerrainService> provider =
                plugin.getServer().getServicesManager().getRegistration(IrisTerrainService.class);
        return provider == null ? null : provider.getProvider();
    }

    private static final class Best {
        private long score = Long.MAX_VALUE;
        private int x;
        private int y;
        private int z;
    }
}
```

`Best` needs no synchronisation: the sink runs inline on the
`sampleColumns` caller thread.

`Player#getScheduler()` is Paper/Folia only. On Spigot, hop back with
`Bukkit.getScheduler().runTask(plugin, () -> player.sendMessage(result))`.

---

## The minimum: one coordinate

```java
IrisTerrainService terrain = service();

String biome = terrain == null
        ? "unknown"
        : terrain.surfaceBiomeName(player.getWorld(), player.getLocation().getBlockX(),
                player.getLocation().getBlockZ()).orElse("unknown");
```

`surfaceBiomeName` returns empty for non-Iris worlds, null worlds,
closing engines, or disabled Iris. Call `isIrisWorld` only when you need
to distinguish "not Iris" from "Iris has no answer".

---

## What `IrisWorldInfo` tells you

```java
public record IrisWorldInfo(
        String dimensionKey,
        String worldIdentity,
        long seed,
        int minHeight,
        int maxHeight,
        int fluidHeight,
        boolean studio) {

    public int height();
}
```

| Component | Meaning |
|---|---|
| `dimensionKey` | Pack load key of the dimension (e.g. `overworld`) |
| `worldIdentity` | World's namespaced key as string (e.g. `minecraft:overworld`) |
| `seed` | Raw generator seed |
| `minHeight` | Absolute world floor Y (e.g. `-64`) |
| `maxHeight` | Absolute world ceiling Y, exclusive (e.g. `320`) |
| `fluidHeight` | Absolute pack sea level Y (`pack fluid height + minHeight`) |
| `studio` | `true` only for a transient studio world |
| `height()` | `maxHeight - minHeight` |

All height fields are absolute world Y, comparable with `surfaceHeight`
and `blockY`. Constructor rejects null `dimensionKey`/`worldIdentity` and
non-positive height range.

`worldIdentity` is what Iris persists per-world state under. Outside the
three vanilla dimensions the server derives the key from the world
folder. Renaming the folder changes `worldIdentity` and
`World#getName()`.

`studio` worlds exist briefly for pack authoring. Skip them for
persistence.

`seed` reproduces the entire world offline. Iris does not expose it via
PlaceholderAPI ([09 - PlaceholderAPI](/iris/09-placeholderapi)). Do not
put it where players can read it.

---

## Failure policy

| Situation | Behavior |
|---|---|
| `world` is `null` | Queries answer absent. `sampleColumns` returns `false` |
| World has no Iris generator | Same |
| Iris disabled, or disabled between calls | Same. Nothing throws |
| Generator closing, or engine closed | `isIrisWorld` still **`true`**. Other queries absent |
| Query throws inside engine | Counted, logged with stack, answered absent |
| `query` or `sink` null | `sampleColumns` returns `false` |
| Query exceeds sample limits | `false`, sink never called, nothing logged |
| Sink throws | Walk aborts, fault logged (throttled), `false`. Prior columns delivered |
| Engine closes mid-walk | Walk stops, `false` |

**`isIrisWorld` does not check liveness.** It answers "created by Iris",
not "can answer right now". During unload/shutdown you can see
`isIrisWorld == true` with empty `worldInfo`. Use `Optional` carefully.

**No caller quarantine.** Fault counters only throttle log lines to at
most one report per minute per category. The count is cumulative.

No checked exceptions. Unchecked throws only from `IrisColumnQuery` /
`IrisWorldInfo` construction validation.

---

## Configuration

`plugins/Iris/iris.json`:

| Key | Default | Effect |
|---|---|---|
| `performance.noiseCacheSize` | `1024` | Shared noise cache chunk capacity. `maxSampleChunks = max(64, this / 4)`. `maxSampleColumns = maxSampleChunks * 256` |

No on/off switch for the terrain API. Answers for every world with a live
Iris engine. Absent otherwise.

---

## Enum reference

### `IrisSurfaceKind`

| Constant | Meaning | Test applied (engine space, then reported in absolute terms) |
|---|---|---|
| `LAND` | Dry ground | Surface above fluid height. Biome not shore |
| `SHORE` | Beach or bank | Surface above fluid. Pack classifies biome as shore |
| `RIVER` | Wet channel or mouth | Primary accepted surface layer owns a channel with connected fluid |
| `RIVER_SHORE` | Wet river shore | Primary accepted surface layer marks the narrow shore-content band |
| `DRY_CHANNEL` | Dry channel bed | Primary accepted surface channel has no connected fluid; dry grades remain `LAND` |
| `OCEAN` | Under water / sea floor at sea level | Surface at or below fluid height (and above void floor) |
| `VOID` | Nothing generated | Engine surface height ≤ 0 → absolute surface ≤ `minHeight()` |
| `UNKNOWN` | No answer | Not Iris / unavailable / fault / `SURFACE_KIND` not requested |

**`VOID` wins first.** An explicit accepted surface-hydrology role follows, then the
ordinary fluid check and shore-versus-land classification. The values are
mutually exclusive.

`OCEAN` is inclusive at fluid height. Compare `surfaceHeight` to
`fluidHeight` yourself if the one-block boundary matters.

### `IrisColumnField`

| Constant | Fills | Extra work |
|---|---|---|
| `SURFACE_HEIGHT` | `surfaceHeight` | one height sample per column |
| `NATURAL_HEIGHT` | `naturalHeight` | natural height sample before accepted hydrology shaping |
| `SURFACE_KIND` | `surfaceKind` | final height and accepted surface-layer sample; biome only when hydrology/fluid/void does not decide the kind |
| `BIOME_KEY` | `biomeKey` | biome sample per column, always |
| `RIVER_STATE` | `riverState` | shared accepted column sample |
| `RIVER_DISTANCE` | `riverDistance` | shared accepted column sample |
| `RIVER_FLOW` | `riverFlow` | shared accepted column sample |
| `RIVER_WATER_SURFACE_Y` | `riverWaterSurfaceY` | shared accepted column sample; available only for connected surface fluid |

`SURFACE_HEIGHT` and `SURFACE_KIND` share the final height sample when
both are requested. All river fields and `SURFACE_KIND` share one accepted
hydrology column sample.

Write a `default` arm when switching enums:
[90 - API - Getting Started](/iris/90-api-getting-started).
