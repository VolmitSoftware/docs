---
title: "Performance Tuning"
description: "Iris documentation: Performance Tuning"
published: true
date: 2026-08-16T02:05:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Iris throughput is bounded by four things: how many chunks the platform will let Iris generate at once, how much mantle stays resident in heap, how often pack resources are reloaded from disk, and whether the JVM has the incubator Vector API. This page is organized by the symptom you are looking at, not by settings file order. Every knob lives in `settings.json` under the Iris data directory ([03 - Configuration](/iris/03-configuration)); pregen operations are in [07 - Pregeneration](/iris/07-pregeneration). Tuning must leave GoldenHash unchanged; a deliberate generation-contract change must be documented and re-baselined instead ([32 - Determinism & Goldenhash](/iris/32-determinism-goldenhash)).

## Before you turn any knob

Most bad tuning comes from changing three things, seeing a better number once, and keeping all three. Do this instead:

1. Freeze the inputs: Iris artifact, pack bytes, seed, center, radius, JVM flags, and server population.
2. Run one warmup, then three measured runs. Record the overall, 10-second, 30-second, and 60-second chunk rates, wall time, peak heap, GC behavior, and failed chunk count.
3. Change exactly one setting. Restart if the setting is read once at startup — thread pools, caches, and SIMD kernel selection all are.
4. Repeat the warmup and three runs over the same area. A comparison across different terrain is not a comparison.
5. Keep the change only if the median improves with no determinism mismatch, no new failures, no unacceptable heap growth, and no worse tick latency.
6. Restore the old value before testing the next knob.

Reach for JProfiler when the numbers move without an obvious cause: stalls, allocation pressure, or scheduler behavior. A faster pregen status line on its own doesn't tell you why.

## Symptom: pregen is slow

Work through these in order. The first two are free; the rest trade something.

1. **Check whether the platform is the limit, not Iris.** On Fabric, Forge, and NeoForge without a parallel chunk system, pregen runs through the vanilla main-thread chunk pipeline and throughput is capped there regardless of settings. Iris logs this at pregen start and names the fix: install C2ME on Fabric, or run Paper if you want Bukkit-level throughput. No Iris setting recovers that gap.
2. **Confirm SIMD is on.** On Bukkit, the startup log prints one of `SIMD: vector kernels enabled (…)`, `SIMD: scalar kernels active; add --add-modules jdk.incubator.vector …`, or `SIMD: vector kernels disabled (performance.simdKernels=false)`. If you see the scalar message, add the JVM flag and restart. See the SIMD section for what it actually accelerates and how small that surface is. Mod loaders never print this line, so check the JVM flag directly there.
3. **Leave concurrency alone unless it is warning at you.** Bukkit pregen concurrency is derived, not configured. Paper-like admission uses the larger of the detected chunk-system pool and the world-gen pool Iris provisions during initialization; Folia also includes its broader runtime capacity. The effective worker count is multiplied by 8 and clamped to 16–128 on Paper-like servers or 64–192 on Folia. Raising it is not an option, and the adaptive limiter lowers it when requests stay pending or mantle backpressure engages. The only concurrency lever on Bukkit is `serial=true`, which drops to one chunk in flight — use it for profiling and determinism isolation, never for throughput.
4. **On mod loaders, size `pregen.moddedPregenInFlight` to the chunk system.** Default `0` resolves to `clamp(16, cpu*2, 48)`, and whatever value comes out is floored at 8. Raise it only if the loader has a parallel chunk system and the CPU is not saturated; lower it if you see chunk-load timeouts. Positive values are capped at 512.
5. **Raise the object cache if the same objects keep reloading.** `performance.objectLoaderCacheSize` (default 4096) bounds the loader caches for `.iob` objects, matter objects, and images. Object-heavy packs on large pregens hit this. The tradeoff is retained heap, so only do this if heap has room — see the memory section.
6. **Give the process more heap before touching mantle caps.** Resident mantle plates are budgeted against process memory, so a bigger heap raises the effective plate count without any settings change.

`performance.noiseCacheSize` is not worth tuning for pregen: starting a pregen raises it to at least 4096 in memory, hotloads the engine, and sets `iris.cache.fast` as a system property. Neither is lowered again for the life of the process. The Bukkit plugin already sets `iris.cache.fast` during startup; on mod loaders it only comes on with the first pregen, so pass `-Diris.cache.fast=true` on the JVM command line there if you want it covering ordinary generation too.

## Symptom: the first chunks pause while strongholds initialize

Minecraft 26.2 prepares its concentric stronghold rings before ordinary structure generation can settle. Iris answers that exact ring search at chunk-center granularity: 225 biome evaluations per task instead of 3,249 quart-column evaluations. Other biome searches keep their normal resolution. In a live shipping-Overworld test, an 81-chunk cold frontier fell from 27–33 seconds to 9–10 seconds with zero failed chunks.

This is a current generation-contract change, not a migration. The same seed, pack, and Iris build remains deterministic, but stronghold ring coordinates can differ from earlier Iris builds because each candidate chunk now has one vote and the random selection sequence is shorter. Strongholds already stored in generated chunks remain physically present; current `/locate` results and Eyes of Ender follow the newly computed rings and may not lead back to those older starts. Iris does not retain or reconstruct the earlier ring layout.

## Symptom: TPS dips or chunk-load timeouts while generating

Generation competing with the server tick shows up as timeout warnings, region scheduler complaints, or players reporting lag near the pregen frontier.

| Do this | Effect | Cost |
|---|---|---|
| Run pregen with `serial=true` (Bukkit, Paper-compatible) or `sync` (modded) | One chunk in flight at a time; the tick thread stops competing with a wide generation front | Much slower pregen; this is an isolation tool, not a production mode |
| Lower `pregen.moddedPregenInFlight` (modded only) | Fewer concurrent chunk generations, so the chunk system keeps headroom for player chunks | Proportionally slower pregen |
| Raise `pregen.chunkLoadTimeoutSeconds` (default 15, clamped 5–120) | On Bukkit, waits longer before a still-pending Paper request warns and lowers adaptive admission; the request is never failed at this threshold | Hides a real stall instead of fixing it; try it last. On modded this remains a terminal timeout and anything below 120 seconds is ignored |
| Raise `pregen.timeoutWarnIntervalMs` (default 500, minimum 250) | Spaces out repeated slow-request warnings in console | Log noise only; changes nothing about the stall |
| Raise `pregen.saveIntervalMs` (default 30000, clamped 5000–900000) | Less frequent pregen state flushing, so less periodic IO | More work replayed if the job is interrupted |

`pregen.runtimeSchedulerMode` (`AUTO`, `PAPER_LIKE`, `FOLIA`) and `pregen.paperLikeBackendMode` (`AUTO`, `TICKET`, `SERVICE`) exist for platform mismatches, not throughput. A Folia runtime always resolves to Folia scheduling regardless of the setting, and `AUTO` on Paper-like servers resolves to the ticket backend. Change these only when diagnosing a scheduler-specific defect.

## Symptom: heap pressure, long GC pauses, or OOM risk

Mantle is the largest thing Iris keeps in heap. Iris already reacts to heap pressure on its own: as used heap climbs from 82% to 92%, the idle window before a mantle plate is trimmed shrinks linearly to zero. At 92% pregeneration pauses, trims mantle, and begins one reclaim episode with a normal GC request. If pressure remains after 10 seconds, Iris asks the current HotSpot JVM for a diagnostic full GC; successful diagnostic attempts are at least 60 seconds apart, and failures back off from 1 to 15 minutes with a full error report. Generation resumes immediately at 82% or after heap remains continuously below 92% for 60 seconds, so a collector that settles between the thresholds cannot wedge the run indefinitely. If you are seeing pressure, that machinery is already running — you are deciding how much less mantle to hold.

First make sure the JVM fits inside its container. Pterodactyl charges the Java heap, metaspace, code cache, thread stacks, native buffers, memory-mapped files, and often the operating-system overhead against the same memory limit. Do not set `-Xmx` or `MaxRAMPercentage` to 95% of that limit. Leave at least 20–25%, and at least 1.5–2 GiB on a large Iris server, outside the Java heap as a starting point. For a 10,000 MiB container, start around `-Xmx7G` to `-Xmx7500M`, measure peak resident memory, and adjust from evidence. `-XX:+AlwaysPreTouch` makes the committed heap visible in resident memory immediately, so a process can appear close to the panel limit even while most of that heap is empty.

1. **Raise heap first if the machine has it.** The resident-plate budget is computed from process memory: roughly 60% of the heap, against a per-plate cost of about 48 MB at a 384-block world height, scaled by your actual dimension height. More heap means more plates without changing a setting.
2. **Lower `pregen.maxResidentTectonicPlates`** (default 96). This is a soft cap on how many mantle tectonic plates stay resident. The effective number is the smaller of that cap, a height-scaled version of it, and the heap budget above — with a hard floor of 16. Taller worlds get fewer plates automatically. Lowering it cuts retained heap at the cost of more mantle reload work.
3. **Lower `performance.mantleKeepAlive`** (default 30). This is how many seconds an idle mantle plate survives before maintenance trims it. Lower means memory comes back sooner; it also means recently-touched regions get re-read more often.
4. **Lower the loader caches** if a heap dump shows retained pack data rather than mantle: `performance.objectLoaderCacheSize` (default 4096) and `performance.resourceLoaderCacheSize` (default 1024).
5. **Slow the pregen down.** Backpressure knobs decide how long a generation thread waits when the mantle plate budget is full: `pregen.mantleBackpressureWaitMs` (default 25, clamped 5–1000) is the wait between retries, and `pregen.mantleBackpressureTimeoutMs` (default 60000, clamped 5000–600000) is how long it waits before giving up on that chunk. Raising the timeout buys a slow job time to finish instead of failing chunks; it does not reduce memory use.

`performance.engineSVC.forceMulticoreWrite` (default false) makes mantle plate unloading use the parallel path all the time instead of only under heap pressure. It returns memory faster during sustained generation and costs CPU that would otherwise go to generating.

## Symptom: Studio memory keeps growing during editing

Studio worlds skip routine mantle maintenance by default, so a long authoring session can retain more data than a normal world. Emergency maintenance still runs after heap crosses Iris's high-water threshold; Studio no longer disables that safety path. Set `performance.trimMantleInStudio` to `true` to run routine maintenance as well. The cost is that hotloaded pack edits regenerate more from scratch because less remains cached. A/B this in Studio only; it has no effect on production worlds.

## Symptom: the same pack resources reload constantly

`performance.resourceLoaderCacheSize` (default 1024) bounds the cache of parsed JSON pack resources; `performance.objectLoaderCacheSize` (default 4096) bounds `.iob`, matter, and image loaders. If profiling shows repeated parse or disk work for resources you know are in use, raise the one that is actually missing, one at a time. Both trade heap for fewer reloads, and neither changes generation output.

Iris also keeps a current-format first-access prefetch file for generic JSON loaders. Each loader admits at most the smaller of its cache capacity and 1,024 resource keys; an overflowing history is skipped instead of being replayed at the next startup. Entries and loaders are admitted sequentially to bound parse-time memory, and the identity includes the exact pack root, seed, dimension version/key, and loader folder. Old cache identities are ignored, not migrated. `.iob`, image, and matter bodies do not use this history.

## Reference: `performance` section

| Key | Default | What it does |
|-----|---------|--------------|
| `performance.simdKernels` | `true` | Allows vector kernels when `jdk.incubator.vector` is on the module path; `false` forces scalar. Read once at class initialization, so a restart is required |
| `performance.mantleKeepAlive` | `30` | Seconds an idle mantle plate survives before maintenance trims it. Shrinks toward zero as used heap climbs from 82% to 92% |
| `performance.mantleCleanupDelay` | `200` | Ticks a loaded chunk waits before its mantle cleanup runs (200 = 10 s). Raising it keeps mantle data resident longer after chunk loads; see "03 - Configuration.md" |
| `performance.trimMantleInStudio` | `false` | Whether studio worlds get routine mantle maintenance; emergency high-water maintenance runs regardless |
| `performance.noiseCacheSize` | `1024` | Noise sample cache capacity per engine. Starting a pregen raises it to at least 4096 for the rest of the process |
| `performance.resourceLoaderCacheSize` | `1024` | Parsed pack resource entries held before eviction |
| `performance.objectLoaderCacheSize` | `4096` | `.iob`, matter, and image loader entries held before eviction |
| `performance.engineSVC.useVirtualThreads` | `true` | Maintenance workers run on virtual threads; `false` uses platform threads |
| `performance.engineSVC.forceMulticoreWrite` | `false` | Always unload mantle plates on the parallel path instead of only under heap pressure |
| `performance.engineSVC.priority` | `5` (`Thread.NORM_PRIORITY`) | Priority of maintenance platform threads, clamped to the legal Java range. Ignored entirely when virtual threads are on |
| `performance.engineSVC.parallelism` | `-1` | Size of the engine maintenance worker pool. A positive value is capped at `2 × CPU`; zero or negative means `ceil(sqrt(CPU))` |

`engineSVC` sizes the maintenance service — mantle trimming, plate unloading, periodic saves — not chunk generation. Raising `parallelism` will not generate chunks faster; it makes mantle housekeeping finish sooner and take more CPU while it does. Generation parallelism is derived separately (see below).

## Reference: `pregen` section

| Key | Default | What it does |
|-----|---------|--------------|
| `pregen.runtimeSchedulerMode` | `AUTO` | Which scheduler the Bukkit pregen driver uses: `AUTO`, `PAPER_LIKE`, `FOLIA`. A Folia runtime always resolves to Folia |
| `pregen.paperLikeBackendMode` | `AUTO` | How Paper-like pregen acquires chunks: `AUTO`, `TICKET`, `SERVICE`. `AUTO` resolves to `TICKET` |
| `pregen.chunkLoadTimeoutSeconds` | `15` | Bukkit slow-request warning and adaptive-throttle age; it does not terminate the Paper future. Clamped 5–120. Modded pregen uses it as a terminal timeout and raises anything below 120 to 120 |
| `pregen.timeoutWarnIntervalMs` | `500` | Minimum gap between repeated slow-request warnings. Minimum 250 |
| `pregen.saveIntervalMs` | `30000` | Gap between pregen progress flushes. Clamped 5000–900000 |
| `pregen.maxResidentTectonicPlates` | `96` | Ceiling on resident mantle plates before the height and heap budgets narrow it further. Never drops below 16 |
| `pregen.mantleBackpressureWaitMs` | `25` | Pause between retries when the plate budget is full. Clamped 5–1000 |
| `pregen.mantleBackpressureTimeoutMs` | `60000` | How long a chunk waits on backpressure before failing. Clamped 5000–600000 |
| `pregen.moddedPregenInFlight` | `0` | Concurrent pregen chunks on mod loaders. `0` resolves to `clamp(16, cpu*2, 48)`; positive values cap at 512; the result is floored at 8 |

Related: `world.globalPregenCache` (default `false`) — see [03 - Configuration](/iris/03-configuration) and [07 - Pregeneration](/iris/07-pregeneration).

## Reference: derived concurrency

There is no `concurrency` section in `settings.json`. The values are computed from CPU count at runtime and cannot be overridden from the file:

- Generation burst pool: `max(2, availableProcessors)`
- IO burst pool: `max(2, availableProcessors / 2)`
- Bukkit pregen in-flight cap: effective worker threads × 8, clamped 16–128 on Paper-like servers and 64–192 on Folia. Paper-like effective workers are the larger of the detected chunk-system pool and the world-gen pool provisioned during initialization; CPU is the fallback when detection is unavailable. The cap is then lowered adaptively for slow requests or mantle backpressure down to `max(4, min(16, cap / 4))`

If you need less generation concurrency, use `serial=true` (Bukkit) or `sync` (modded) rather than looking for a knob that does not exist.

## SIMD

What actually uses vector kernels today is narrow: an array rounding path in the chunked double data cache, and array operations in mantle carving. The 2D fractal noise vector kernels (`VectorNoiseKernels2D`) exist and are correct, but nothing in the production worldgen path calls `SimdSupport.noiseKernels2D()` yet. Treat noise SIMD as unfinished and do not size hardware around it.

Selection happens once, at class initialization:

1. `performance.simdKernels` false → scalar kernels.
2. Otherwise, if the `jdk.incubator.vector` module is present and the vector kernel class loads → vector kernels.
3. Otherwise → scalar kernels, with a startup log line telling you to add the flag.

The 2D noise kernels add one more gate: they are only selected when the preferred `double` and `long` vector species have matching lane counts and at least 4 double lanes. Apple Silicon NEON, at 2 lanes, does not qualify.

The JVM flag is required for any vector path:

```
--add-modules jdk.incubator.vector
```

The Iris Gradle build passes it for core compilation and tests and for every `probe` task, and `tools/simd-bench/` passes it in its own scripts. Nothing adds it to a production server's start script — a server operator must add it there.

To A/B on a real server: set `performance.simdKernels` false, restart, measure pregen chunks/second, set it true, restart, measure again, and confirm GoldenHash is unchanged ([32 - Determinism & Goldenhash](/iris/32-determinism-goldenhash)). `tools/simd-bench/` (`./run.sh` or `run.bat`) measures kernels in isolation and deliberately ignores the profitability gate, so its speedups do not predict end-to-end pregen gains.

## Measurement checklist

Record for every experiment: pack identity, seed, radius, serial/sync flags, JVM version and flags, heap size, CPU, the `performance` and `pregen` excerpts you changed, overall/10-second/30-second/60-second chunk rates, duration, failed chunks, peak heap, and the GoldenHash combined value. Reject any optimization that changes the hash unless the behavior change was intended and is documented. Release-scale baselines (5k–10k chunks with JProfiler) are tracked in [87 - Maintainer - Release Readiness](/iris/87-maintainer-release-readiness).

Never tune by editing pack content. Pack edits change terrain, which changes the hash, which means you are no longer comparing the same thing.

## Offline tools

| Tool | Command | Use |
|------|---------|-----|
| Generation probe | `./gradlew :probe:genProbe -PprobePack=…` | Headless engine generation; a correctness signal, not a throughput benchmark |
| Classload probe | `./gradlew :probe:run` | Core-purity gate; fails if `org.bukkit` leaks into engine classes |
| SIMD microbench | `tools/simd-bench/run.sh` | Kernel-only scalar versus vector timing |

Runbooks that combine pregen and GoldenHash: [31 - Operator Runbooks](/iris/31-operator-runbooks).
