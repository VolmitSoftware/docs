---
title: "Performance Tuning"
description: "Iris documentation: Performance Tuning"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Iris throughput is bounded by four things: how many chunks the platform will let Iris generate at once, how much mantle stays resident in heap, how often pack resources are reloaded from disk, and whether the JVM has the incubator Vector API. This page is organized by symptom, not by settings file order.

Iris settings live in `iris.json` ([03 - Configuration](/iris/03-configuration)), which carries the full `performance` and `pregen` key reference. Platform settings live in the server configuration. Pregeneration operations are in [07 - Pregeneration](/iris/07-pregeneration).

## Change one setting at a time

Compare chunk rate, tick latency, and memory use under the same workload. Thread-pool, cache, and SIMD changes require a restart. Restore the previous value if a change causes errors or worse performance.

Generation waits for cache warming to finish. A warming failure logs its cause and blocks generation for that engine; correct the reported pack or resource error and reopen the world.

## Symptom: pregeneration is slow

Work through these in order. The first two are free; the rest trade something.

1. **Give Paper enough chunk workers.** Paper sizes its chunk-system worker pool automatically and often lands on 4 threads even on a 16-core machine; the startup log prints `Paper is using N worker threads`. Every chunk generation runs on one of those workers, so a small pool caps pregeneration long before the CPU is busy. Set `chunk-system.worker-threads` in `config/paper-global.yml` to about the number of physical cores for a pregeneration box and restart.
2. **Check whether the platform is the limit, not Iris.** On Fabric, Forge, and NeoForge without a parallel chunk system, pregeneration uses the vanilla main-thread chunk pipeline and throughput is capped there regardless of settings. Iris logs this at pregeneration start and names the fix: install C2ME on Fabric, or run Paper. No Iris setting recovers that gap.
3. **Confirm SIMD is on.** The Bukkit startup log prints a `SIMD:` line. If it says scalar kernels are active, add `--add-modules jdk.incubator.vector` and restart. Mod loaders never print this line, so check the JVM flag directly there. See [SIMD](#simd) for how small that surface actually is.
4. **Leave concurrency alone unless it is warning at you.** Bukkit pregeneration concurrency is derived from the detected chunk-system and world-gen pools, not configured, and the adaptive limiter lowers it when requests stay pending or mantle backpressure engages. Raising it is not an option. The only concurrency lever on Bukkit is `serial=true`, which drops to one chunk in flight — an isolation tool for profiling and determinism, never a throughput setting.
5. **On mod loaders, size `pregen.moddedPregenInFlight` to the chunk system.** Default `0` resolves to `clamp(16, cpu*2, 48)`, floored at 8, and positive values cap at 512. Raise it only if the loader has a parallel chunk system and the CPU is not saturated. Lower it if you see chunk-load timeouts.
6. **Raise the object cache if the same objects keep reloading.** `performance.objectLoaderCacheSize` (default 4096) bounds the loader caches for `.iob` objects, matter objects, and images. Object-heavy packs on large pregenerations hit this. The tradeoff is retained heap.
7. **Give the process more heap before touching mantle caps.** Resident mantle plates are budgeted against process memory, so a bigger heap raises the effective plate count without any settings change.

`performance.noiseCacheSize` controls terrain noise retention; larger caches reduce repeated hydrology terrain sampling at the cost of heap. Starting a pregeneration raises it to at least 4096 in memory for the life of the process and does not lower it again. Normal worlds also expand their biome, region, ocean-classification, and natural-height caches when uncached hydrology planning begins, within a shared allowance of one eighth of the maximum JVM heap; explicit configured capacities are kept as written.

### Hydrology-heavy packs

A cold hydrology tile is the expensive unit: the planner samples the tile's natural terrain and its neighbours, routes every candidate river, and resolves the neighbouring tiles its rivers and caves reach into. Warm generation reuses accepted column footprints from a cache bounded to 64 tiles, and Standard Studio also persists completed entry tiles. A planner revision starts a fresh cache scope, so its first visit is cold again.

Cold work grows with:

| Setting | Effect on cold planning cost |
|---|---|
| `hydrology.rivers.routing.tileSize` / `sampleSpacing` | Smaller source spacing means more lattice nodes per tile |
| `maximumRouteLength` | Longer routes search further |
| Surface and underground source budgets | More sources, more routes. The two budgets are independent |
| Surface valley, grotto, drop-basin, and deep-fluid footprints | Wider envelopes touch more neighbouring tiles |
| `surface.banks.maximumBlendWidth` | Bounds how far a surface course affects terrain, and therefore the cross-tile publication radius |
| `routing.minimumSurfaceCourseLength` / `minimumUndergroundCourseLength` | Reject short complete routes before their footprints are retained |

A deep-fluid short channel derives its maximum length from `spacing / 3`, capped at half `tileSize` and possibly shorter from the containment-volume bound. Validation caps the coarse lattice at 65,536 nodes and enforces footprint, spacing, and containment relationships before generation.

**To cut hydrology cost, reduce density, route length, resolution, or footprint.** Do not weaken outlet proof, ocean ownership, falling-fluid continuity, receiving basins, or containment — those are what keep rivers physically valid.

## Symptom: the first chunks pause while strongholds initialize

Minecraft 26.2 prepares its concentric stronghold rings before ordinary structure generation can settle. Iris answers that ring search at chunk-center granularity — 225 biome evaluations per task instead of 3,249 quart-column evaluations — while other biome searches keep their normal resolution. In a live bundled-Overworld test an 81-chunk cold frontier fell from 27–33 seconds to 9–10 seconds with zero failed chunks.

> This is a generation-contract change. The same seed, pack, and Iris build stays deterministic, but **stronghold ring coordinates can differ from earlier Iris builds.** Strongholds already stored in generated chunks remain physically present, while current `/locate` results and Eyes of Ender follow the newly computed rings and may not lead back to those older starts. Iris does not retain or reconstruct the earlier ring layout.
{.is-warning}

## Symptom: TPS dips or chunk-load timeouts while generating

Generation competing with the server tick shows up as timeout warnings, region scheduler complaints, or players reporting lag near the pregeneration frontier.

| Do this | Effect | Cost |
|---|---|---|
| Run pregen with `serial=true` (Bukkit, Paper-compatible) or `sync` (modded) | One chunk in flight at a time. The tick thread stops competing with a wide generation front | Much slower pregeneration. This is an isolation tool, not a production mode |
| Lower `pregen.moddedPregenInFlight` (modded only) | Fewer concurrent chunk generations, so the chunk system keeps headroom for player chunks | Proportionally slower pregeneration |
| Raise `pregen.chunkLoadTimeoutSeconds` (default 15, clamped 5–120) | On Bukkit, waits longer before a still-pending Paper request warns and lowers adaptive admission. The request is never failed at this threshold | Hides a real stall instead of fixing it. Try it last. On modded this remains a terminal timeout and anything below 120 seconds is ignored |
| Raise `pregen.timeoutWarnIntervalMs` (default 500, minimum 250) | Spaces out repeated slow-request warnings in console | Log noise only. Changes nothing about the stall |
| Raise `pregen.saveIntervalMs` (default 30000, clamped 5000–900000) | Less frequent pregeneration state flushing, so less periodic IO | More work replayed if the job is interrupted |

Iris sizes its generation, hydrology, and IO pools from the CPU count and there is no `concurrency` section in `iris.json` to override that. `pregen.runtimeSchedulerMode` (`AUTO`, `PAPER_LIKE`, `FOLIA`) and `pregen.paperLikeBackendMode` (`AUTO`, `TICKET`, `SERVICE`) exist for platform mismatches, not throughput — change them only when diagnosing a scheduler-specific defect.

## Symptom: heap pressure, long GC pauses, or OOM risk

Mantle is the largest thing Iris keeps in heap, and Iris already reacts to heap pressure on its own. As used heap climbs from 82% to 92%, the idle window before a mantle plate is trimmed shrinks linearly to zero. At 92% pregeneration pauses, trims mantle, and starts one reclaim episode; generation resumes at 82%, or after heap stays below 92% for 60 seconds. If you are seeing pressure, that machinery is already running and you are deciding how much less mantle to hold.

> First make sure the JVM fits inside its container. Pterodactyl charges the Java heap, metaspace, code cache, thread stacks, native buffers, memory-mapped files, and often the OS overhead against the same limit. **Do not set `-Xmx` or `MaxRAMPercentage` to 95% of that limit.** Leave at least 20–25%, and at least 1.5–2 GiB on a large Iris server, outside the Java heap. For a 10,000 MiB container start around `-Xmx7G` to `-Xmx7500M`, measure peak resident memory, and adjust from evidence. `-XX:+AlwaysPreTouch` makes the committed heap visible in resident memory immediately, so a process can look close to the panel limit while most of that heap is empty.
{.is-warning}

1. **Raise heap first if the machine has it.** The resident-plate budget is roughly 60% of the heap, and each plate costs about 48 MB at a 384-block world height, scaled by your actual dimension height. More heap means more plates without changing a setting.
2. **Lower `pregen.maxResidentTectonicPlates`** (default 96). A soft cap on resident mantle plates; the effective number is the smaller of that cap, a height-scaled version of it, and the heap budget, with a hard floor of 16. Taller worlds get fewer plates automatically. Lowering it cuts retained heap at the cost of more mantle reload work.
3. **Lower `performance.mantleKeepAlive`** (default 30). Seconds an idle mantle plate survives before maintenance trims it. Lower means memory comes back sooner and recently-touched regions get re-read more often.
4. **Lower the loader caches** if a heap dump shows retained pack data rather than mantle: `performance.objectLoaderCacheSize` (default 4096) and `performance.resourceLoaderCacheSize` (default 1024).
5. **Slow the pregeneration down.** `pregen.mantleBackpressureWaitMs` (default 25, clamped 5–1000) is the upper bound on one wait when the plate budget is full; it ends early as soon as a chunk completes. `pregen.mantleBackpressureTimeoutMs` (default 60000, clamped 5000–600000) is how long the wait can accumulate before Iris warns, lowers the adaptive in-flight limit, and proceeds with the chunk anyway. Nothing is failed and the run never deadlocks. Neither knob reduces memory use.

`performance.engineSVC.forceMulticoreWrite` (default false) unloads mantle plates on the parallel path all the time instead of only under heap pressure, and makes every world fan chunk generation across the burst pool, which otherwise happens only during a pregeneration. Both cost CPU that would otherwise go to the rest of the server.

## Symptom: entering a fresh world or a new Studio takes tens of seconds

The first chunks of a hydrology world cannot generate until their hydrology tiles are planned, and a spawn on a tile corner needs four tiles at once. Iris plans only the exact entry columns first and defers speculative neighbour tiles until the initial teleport finishes; a pregeneration keeps a bounded one-tile lookahead that advances with the generation front rather than planning the whole area up front.

With `debug` on in `iris.json`, every tile and every owner draft logs its timing:

```text
Hydrology tile -1,-1 planned in 20155ms: owners=8 resolve=20151ms materialize=3ms courses=2 on Iris Hydrology 2
Hydrology owner -1,-2 rank=1 drafted in 9420ms: context=3635ms select=155ms settle=1077ms publish=4551ms deps=2 wait=2739ms admissions=2 on Iris 8
```

| Field | Meaning |
|---|---|
| `context` | Terrain sampling and routing. A large value means the tile is bounded by terrain sampling, which scales with the burst pool |
| `select` / `settle` | Source selection |
| `publish` | The publication passes |
| `wait` / `deps` | Time spent waiting for lower-ranked neighbour drafts, and how many. A large `wait` means the tile is bounded by its neighbours |
| `earlyOwners`, `routes`, `reuses`, `routeSolve`, `rasters`, `raster`, `filters`, `filter` | Early neighbouring drafts, centerline solve counts and time, validation raster counts and time, cave-filter counts and time |

A plugin that asks Iris for heights or biomes on the server thread (map overlays, statistics, teleport helpers) never waits for planning: for a column whose tiles are not planned yet it gets the natural terrain answer and the tiles are planned in the background, so a later query returns the river-shaped answer. With `debug` on, the first such query per tile logs `Hydrology tile x,z queried before it was planned`. Chunk generation always waits for the real plan, so this never changes the world itself.

## Symptom: Studio memory keeps growing during editing

Studio worlds skip routine mantle maintenance by default, so a long authoring session can retain more data than a normal world. Emergency maintenance still runs after heap crosses Iris's high-water threshold — Studio cannot disable that safety path. Set `performance.trimMantleInStudio` to `true` to run routine maintenance as well. The cost is that hotloaded pack edits regenerate more from scratch because less remains cached. A/B this in Studio only; it has no effect on production worlds.

## Symptom: Studio entry is slow or times out

Studio has no fixed arrival deadline, so cold pack preparation and hydrology planning can delay arrival well beyond ten seconds.

Benchmark with one artifact, pack, seed, player, and machine, and record cold and warm library, pack, and chunk-cache states separately. On Bukkit use the `Studio player <name> arrived in <milliseconds>` line together with the `[Studio timing]` phase lines; on modded, measure command admission to the observed dimension change. `generation_cache_warm` must report `skipped=false`. Treat overlapping phase durations as one wall-clock interval rather than adding them.

Object and Jigsaw Studio use flat authoring floors and a plains biome, and skip generation-cache warmup, spawn hydrology prefetch, native structure activation, and imported-feature placement. Those modes and `OBJECT_BUFFET` derive native heightmaps from actual blocks. Measure them separately from Standard Studio without `OBJECT_BUFFET`, which retains full pack generation.

Standard Studio stores successfully completed entry and initial-pregeneration hydrology tiles under `packs/<key>/.iris/studio-hydrology/<identity>/`. The identity covers the visible pack snapshot, validation context, dimension, seed, height, and hydrology settings, so a process-cold reopen of an unchanged identity loads those final tiles instead of repeating the cross-tile plan. A changed pack or seed is cold again.

Iris never changes a player's view distance, and never changes a world's view or simulation distance. Capture JProfiler around any slow pack preparation, runtime construction, structure activation, destination-chunk generation, or scheduler queue. **Do not accelerate entry by changing its output** — Standard Studio must generate the same blocks, biomes, structures, and terrain as a normal world with the same pack and seed, without blank chunks or a landing pad.

## Symptom: the same pack resources reload constantly

`performance.resourceLoaderCacheSize` (default 1024) bounds the cache of parsed JSON pack resources. `performance.objectLoaderCacheSize` (default 4096) bounds `.iob`, matter, and image loaders. If profiling shows repeated parse or disk work for resources in use, raise the cache that is actually missing, one at a time. Both trade heap for fewer reloads, and neither changes generation output.

Iris also keeps a first-access prefetch file for generic JSON loaders, keyed to the exact pack root, seed, dimension version and key, and loader folder. Old cache identities are ignored, not migrated. `.iob`, image, and matter bodies do not use this history.

## LEAF entity RNG

On LEAF 26.2-99 with the faster random generator disabled, set `world-settings.default.settings.entity.shared-random: false` in `purpur.yml` before parallel pregeneration and restart. The enabled shared RNG uses an unsynchronized seed update when entity constructors generate UUIDs, so concurrent creation can repeat UUIDs and cause entities to be rejected. Disabling sharing gives each entity its own RNG without disabling spawns or structures. Check world-specific overrides if present.

## SIMD

The vector kernel surface is small. The kernel interface has three operations — `roundToInt`, `sum`, and `max` — and generation calls two of them, from the array rounding path in the chunked double data cache and one array max in mantle carving. **There are no vector noise kernels** — a 2D fractal noise vector kernel measured at 0.07x scalar on 2-lane NEON and was removed, so do not size hardware around noise SIMD. On a 2-lane CPU such as Apple Silicon NEON the array kernels are roughly a wash: rounding is slower, max is faster.

Selection happens once at class initialization. `performance.simdKernels` false selects scalar; otherwise vector kernels are used when `jdk.incubator.vector` is present and the vector kernel class loads. The Bukkit startup log prints exactly one line, in this precedence order:

| Line | Meaning |
|---|---|
| `SIMD: vector kernels enabled (<description>)` | Working |
| `SIMD: scalar kernels active; add --add-modules jdk.incubator.vector to JVM flags to enable vectorized generation kernels` | The JVM module is missing. Reported even when `performance.simdKernels` is also false |
| `SIMD: scalar kernels active; vector kernel initialization failed: <class>: <message>` | The module is present but the kernel class did not load |
| `SIMD: vector kernels disabled (performance.simdKernels=false)` | Turned off in `iris.json` |
| `SIMD: scalar kernels active; the Vector API reported no usable vector shape on this CPU` | Hardware has no usable vector shape |

Mod loaders never print this line.

## JVM properties

These are command-line properties, not `iris.json` keys.

| Property | Default | What it does |
|---|---|---|
| `iris.cache.fast` | set automatically by the Bukkit plugin | Enables the fast cache path. Mod loaders never set it, so pass `-Diris.cache.fast=true` on the JVM command line there if you want it |
| `iris.mantle.componentTimeout` | `120000` ms | How long a mantle component wait runs before Iris reports the timeout and requests cancellation. A running component keeps its writer until it exits, so work that never exits leaves generation and shutdown incomplete rather than releasing storage beneath active writes |

Full `performance` and `pregen` key reference: [03 - Configuration](/iris/03-configuration). Related: `world.globalPregenCache` (default `false`), and [07 - Pregeneration](/iris/07-pregeneration).
