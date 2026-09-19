---
title: "Pregeneration"
description: "Iris documentation: Pregeneration"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Pregeneration forces chunks to generate ahead of time so players never wait on terrain generation when they explore. You give it a block radius and a center. Iris walks the square area region by region in a spiral and generates every chunk in it. One pregen job runs at a time per server.

The driver is `/iris pregen` on Bukkit-family and the same subcommand tree on mod loaders.

See also: [02 - Getting Started](/iris/02-getting-started), [03 - Configuration](/iris/03-configuration), [04 - Commands & Permissions](/iris/04-commands-permissions), [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle), [29 - Client HUD & Protocol](/iris/29-client-hud-protocol), [33 - Performance Tuning](/iris/33-performance-tuning).

## Pregenerate 10,000 blocks around spawn

This is the common production task: generate a large area once, up front, so the server never generates terrain during play.

Before you start you need a world whose ordinary chunk generation already works. You also need free disk space for the area, a backup or a world you can afford to lose, and no other pregen job running.

**Radius is in blocks, not chunks and not regions.** A radius of `10000` covers 20,000 blocks across, which is 1,251 chunks per axis and **1,565,001 chunks total**. That is hours of work and tens of gigabytes. Do not type it first.

### 1. Prove the pipeline with a small run

```text
/iris pregen start radius=352 world=myworld center=0,0 gui=false
```

That is 2,025 chunks and finishes in a minute or two. Watch it:

```text
/iris pregen status
```

You should see the world name, `2,025` total chunks, a rising generated count, a chunks-per-second rate, an ETA, and the method name. **Failed count must stay at zero.** If failures accumulate, stop now. A big run will only produce more of them.

### 2. Run the real thing

```text
/iris pregen start radius=10000 world=myworld center=0,0 gui=false
```

If your spawn is not at `0,0`, stand at spawn and use `center=me` instead. That token only works for a player sender. From console, pass explicit coordinates.

Drop `gui=false` only if the server has a desktop and you want the visual renderer.

### 3. Know when it is done

Poll `/iris pregen status`. The job is finished when:

- generated equals total (1,565,001 for this run),
- failed is still `0`,
- and `/iris pregen status` reports no active task after it ends.

Iris publishes final progress after active chunk requests finish. Check the final generated and failed counts before treating the run as complete. No active task alone does not prove success: cancelled and failed runs also release the job.

Then restart the server cleanly and fly to the edge of the generated area. Chunks inside must load without generating. Chunks past the boundary must generate normally.

### Pausing and stopping

```text
/iris pregen pause
```

`pause` is a **toggle**, and `resume` is just an alias for the same command. Running `/iris pregen resume` on a job that is currently running will pause it. The command echoes the resulting state, so read the reply rather than assuming.

```text
/iris pregen stop
```

Stop lets in-flight chunks finish, then cancels. Wait for it to actually close before starting another job. Starting a new one while the old job still exists is rejected outright — Iris never kills a running job to make room, because the old job's teardown would overlap the new job's generation.

Unloading or removing a world also stops a pregen targeting that world. That path blocks for up to 200 seconds waiting for the job to close and throws if it does not.

### Fabric / Forge / NeoForge

```text
/iris pregen start 352 irisworldgen:myworld at 0 0
/iris pregen start 10000 irisworldgen:myworld at 0 0 nocache
```

The dimension argument comes after the radius, `at <x> <z>` after that, and `gui`, `sync`, and `nocache` are order-free literal flags you can combine. Radius accepts `1`–`100000`. Modded pregen shows a boss bar automatically unless the player is running the Iris client mod, which draws its own HUD instead.

## Recovery

| Symptom | Check | What to do |
|---|---|---|
| Start reports an active job | There is one pregen job server-wide, not one per world | Check `/iris pregen status`. Finish or stop it, and wait for closure before retrying |
| Total chunk count is not what you expected | Bounds are inclusive and round outward to whole chunks, so the area is slightly larger than `radius × 2` | Recompute: chunks per axis is `ceil(radius/16) - floor(-radius/16) + 1` centered on your center chunk |
| Failed count climbing | A real chunk-future exception, disk failure, or lifecycle interruption | Stop, fix the first logged failure, confirm ordinary generation works, then retry the same small area. A Bukkit slow-request warning by itself does not increment this count |
| Start rejects the coordinate limit | At least one `center ± radius` edge is outside Minecraft's safe ±29,999,984 block range | Choose a smaller radius or move the center inward. Iris rejects the complete request before starting a job, taking tickets, changing the cache profile, or writing pregen files |
| `serial=true` rejected | Strict serial generation needs a Paper-compatible server | Use the normal method, or run the diagnostic on Paper |
| Desktop GUI never opens | The server is headless, or `gui.useServerLaunchedGuis` is off | Use `gui=false` and watch status, console, or the client HUD |
| Progress repeatedly stalls | Heap high-water or mantle plate backpressure is engaging | Stop the job before tuning. Lower resident plates and in-flight work before raising anything heap-sensitive |
| Restart regenerates work you already did | The cache wrapper was off — Folia routing disables it, `nocache` was passed, the world has no engine access, or the files under `iris/pregen` were deleted | Treat the rerun as uncached. Regeneration alone is not evidence of corruption |
| "world may not be fully loaded" warning | A player sender started pregen in a world Iris has no engine access to | Confirm the world is loaded and its engine initialized before trusting the run |

## Commands

| Command | What it does |
|---|---|
| `/iris pregen start radius=<radius> [world=<world>] [center=0,0] [gui=true] [serial=false]` | Start a job. Director completes every configurable Bukkit value as `key=value`. A bare positional radius remains accepted |
| `/iris pregen stop` (alias `x`) | Request stop. In-flight chunks finish, then the job cancels asynchronously |
| `/iris pregen pause` (alias `resume`) | Toggle pause. One command, two names — it flips whatever state the job is in |
| `/iris pregen status` | Print a progress snapshot for the active job, or report that none exists |

The command root is `/iris pregen` with alias `/iris pregenerate`.

### `start` parameters

| Param | Default | What it controls |
|---|---|---|
| `radius` (`size`) | required | Blocks from center on both X and Z. Must be greater than zero, and every `center ± radius` edge must remain within ±29,999,984. The chat confirmation reports the span as `radius × 2` blocks, which slightly understates the real area because bounds round outward to whole chunks |
| `world` | contextual | Which world to generate. Falls back to your current world. A non-Iris world runs the hybrid method with no engine, so no engine-backed cache wrapper |
| `center` (`middle`) | `0,0` | Block X/Z the square is centered on. Accepts `me`/`here`/`self` for your position, `look`/`cursor` for your look target, and `player:<name>` — all player-sender only |
| `gui` | `true` | Open the desktop renderer when the host supports it. Headless servers log and carry on |
| `serial` | `false` | Generate one chunk at a time through the strict serial hybrid method. **Requires Paper**. Rejected elsewhere. For diagnosing instability, not for throughput |

## Area model

Every block edge at `center ± radius` is validated against Minecraft's safe ±29,999,984 limit before anything is started, then regions are walked in a spiral from the center so nearby playable terrain completes first.

Bounds are inclusive on both edges: the minimum block floors to a chunk and the maximum ceils. For radius 352 at `0,0` that gives chunks `-22..22` on each axis — 45 per axis, 2,025 total.

| Limit | Value |
|---|---|
| Safe block edge | ±29,999,984 inclusive for every `center ± radius` result |
| Maximum region span per axis | 117,189 regions across that safe block range |
| Oversized or non-positive request | `IllegalArgumentException` at construction, so the command fails immediately instead of hanging |
| Modded radius argument range | 1 to 100,000 |

## Generation methods

Generation is always chunk by chunk, never region at a time. Paper-family servers use an asynchronous path; everything else uses a slower synchronous one. `serial=true` forces strict one-at-a-time generation and requires Paper. A cache wrapper is added when caching is enabled, the world has an engine, and the scheduler is not Folia.

Concurrency is sized from the server's own chunk-system pool, not from anything you pass to the command. Tune it through the settings in [33 - Performance Tuning](/iris/33-performance-tuning).

## Cache

The cache records completed chunks and regions as skip hints. Cached chunks must have saved native `FULL` status before Iris skips them. A region skip requires all 1,024 chunks to pass that check. Missing or partially generated chunks go through the normal generation backend.

| Piece | Where | Behavior |
|---|---|---|
| Per-world skip cache | `<dimensionRoot>/iris/pregen/` | Created through `GlobalCacheSVC.createDefault`. Records generated chunks and regions. Only consulted when the `CachedPregenMethod` wrapper is active |
| `world.globalPregenCache` | `iris.json`, default `false` | When true, Iris also maintains the cache during ordinary play. It creates the cache at world init and marks chunks on every `ChunkLoadEvent`. Normal exploration counts toward it. When false, the pregen job still gets a real on-disk cache. It just is not fed by ordinary chunk loads |
| Folia | Resolved runtime scheduler is Folia | The cached wrapper is disabled entirely for pregen |
| No engine | Non-Iris world | The wrapper is skipped, since the cache is keyed to the engine's world identity |

The pregen cache is saved with the world and reused when caching is enabled.

Modded pregen keeps its cache in the equivalent `<worldFolder>/iris/pregen`.

## Mantle and heap caps

Pregen generates faster than chunks get saved, so Iris throttles itself against tectonic plate residency and heap use. These are the knobs that decide whether a large run finishes or thrashes.

Marker spawn points and tree-feller materials survive in pregenerated chunks exactly as they do in normally generated ones, so ambient marker spawning and custom tree drops work identically there. That retained data lives in the mantle region files, which grow accordingly.

| Control | Default and rule | Why you would change it |
|---|---|---|
| `pregen.maxResidentTectonicPlates` | `96`, floored at `16` | The headline speed/memory tradeoff. Raise it to keep more mantle in RAM and cut re-reads. Lower it when the run is pushing the heap |
| Effective plate cap | `max(16, min(baseCap, heightScaledCap, heapBudgetCap))` | Computed, not configured. `heightScaledCap` scales the base cap by `384 / worldHeight`, so tall worlds automatically hold fewer plates. `heapBudgetCap` allows about 60% of max heap against a 48 MB reference plate |
| `mantleBackpressureWaitMs` | `25`, clamped 5–1000 | Upper bound on one backpressure wait. The wait ends as soon as a chunk finishes and frees mantle pressure, so this is a ceiling, not a fixed sleep. Rarely worth changing |
| `mantleBackpressureTimeoutMs` | `60000`, clamped 5s–600s | How long backpressure waits before giving up. On timeout Iris logs and proceeds anyway — it never deadlocks the run |
| Hard cap trigger | Loaded plates greater than `effectiveCap × 2` | Forces a wait-and-evict cycle. Seeing this in logs means the cap is too high for your heap |
| Heap pressure gate | Pause at 92% used. Release at 82%, or after 60 seconds continuously below 92% | The bounded hysteresis prevents flapping without wedging a run whose collector settles between the two thresholds. Returning to 92% resets the 60-second release window |
| Automatic pressure reclaim | Trim mantle and request a normal GC when a 92% pressure episode begins. If pressure remains after 10 seconds, request the current HotSpot JVM's diagnostic full GC | Successful diagnostic attempts are at least 60 seconds apart. An unavailable or failed diagnostic path logs its stack trace and backs off from 1 to 15 minutes. Iris remains pressure-limited rather than risking an OOM |
| `pregen.saveIntervalMs` | `30000`, clamped 5s–900s | How often the pregen loop flushes. Shorter means less lost work on a crash and more I/O |

Full settings reference: [03 - Configuration](/iris/03-configuration). Tuning guidance: [33 - Performance Tuning](/iris/33-performance-tuning).

## Other `pregen` settings

| Key | Default | What it controls |
|---|---|---|
| `runtimeSchedulerMode` | `AUTO` | Whether Iris treats the server as Folia or Paper-like. This is what decides if the pregen cache wrapper is available. `AUTO` probes the server. A regionized server always resolves to `FOLIA`, and configuring `FOLIA` on a non-regionized server is forced back to `PAPER_LIKE` |
| `paperLikeBackendMode` | `AUTO` | Which Paper-like lifecycle backend loads chunks. `AUTO` resolves to `TICKET` |
| `chunkLoadTimeoutSeconds` | `15`, clamped 5–120 | On Bukkit, how old a still-pending Paper chunk request must be before Iris warns and lowers adaptive admission. The original future remains authoritative and may complete normally. It is not failed or omitted. On mod loaders this remains a terminal timeout and is floored at 120 seconds |
| `timeoutWarnIntervalMs` | `500`, minimum 250 | How often slow or failed loads warn. Purely log volume |
| `moddedPregenInFlight` | `0` | In-flight chunk budget for modded pregen. `0` auto-resolves to `max(16, min(48, cpu × 2))`. An explicit value is capped at 512 and floored at 8 |

## Pause, stop, and status

| Action | What happens |
|---|---|
| Pause | Flips the paused flag. The loop also spins while the heap high-water gate is engaged |
| Stop | Requests cancellation asynchronously. Active chunk work settles, then Iris flushes chunk I/O, saves mantle plates, and releases the job |
| Status | Percent, generated, total and remaining chunks, ETA, elapsed time, method name, paused flag, failed count, and world. Rates include overall plus 10-, 30-, and 60-second chunk rates |

**Failed chunks are counted separately from generated ones and only appear in the status line when the count is above zero.** A traversal can finish with failures, so check the failed count as well as the final generated total.

Console progress is emitted every 30 seconds, followed by a completion or cancellation summary that includes chunks finished during shutdown.

## HUD, GUI, and protocol

| Surface | Behavior |
|---|---|
| Desktop GUI | Opens on Bukkit and mod loaders when `gui=true` and a GUI host is available. Closing it disposes only the renderer; generation and the server continue |
| Boss bar | **`/iris pregen` on Bukkit shows no boss bar.** Only creation-time pregen retains a Bukkit boss bar, and it stays up for the whole run — it is persistent background status, not an overflow surface. Modded pregen does show a boss bar — green while running, yellow while paused — and skips it entirely for players running the Iris client mod |
| Client HUD | Progress is sent once per second to connected Iris client sessions. This is the only path a client HUD is fed, on any platform |

GUI toggles live at `settings.gui.useServerLaunchedGuis` and `settings.gui.maximumPregenGuiFPS`. Client HUD detail: [29 - Client HUD & Protocol](/iris/29-client-hud-protocol).

The desktop window shows the world name, current phase, completed and total chunks, percentage, and a progress bar. Click **Pause** or press **P** to toggle. The metrics panel shows the 10-second, overall, 30- and 60-second rates, remaining and elapsed time, heap usage, allocation rate, and generation method; remaining time stays **Pending** until an estimate exists.

The map legend identifies waiting chunks, amber generating chunks, green ready chunks, dark-green existing chunks, and purple network work. On an Iris world finished chunks are recoloured by biome and height once saved biome data is ready. Normal completion and requested cancellation close the window automatically; a startup failure leaves an error window open with the cause in its tooltip.

The public API, PlaceholderAPI value, boss bar, and client protocol carry the 10-second average only. The desktop window, status commands, console progress, and terminal summary expose all four rates.

## Performance profile

Starting a job raises `performance.noiseCacheSize` to at least 4096 in memory for the rest of the process's life, and temporarily raises the shared worker pool's parallelism, returning it when the last job finishes.

Stopping or completing a job unloads its tracked chunks with saving enabled and waits for the chunk I/O flush. Iris never issues a whole-world save, so servers with automatic saving do not see the manual-save performance warning during pregen cleanup.

## Operator notes

Before a large pregeneration on Paper, Purpur, or Leaf, check the startup line `Paper is using N worker threads`. Paper's automatic pool is often 4 threads regardless of the machine; set `chunk-system.worker-threads` in `config/paper-global.yml` to about the physical core count and restart, or the workers cap throughput while the CPU sits idle. See [33 - Performance Tuning](/iris/33-performance-tuning).

- Radius is in **blocks**. Every mistake in this area is someone typing a chunk count.
- Re-running over the same area is fast only when the cache wrapper was active and the files under `iris/pregen` still exist.
- Serial mode is a diagnostic. Use it to reproduce a generation failure deterministically, not to go faster.
- Stop a job before tuning mantle or heap settings. Changing them mid-run makes the before/after meaningless.
- Change one setting at a time against the 352-block baseline before scaling back up. See [33 - Performance Tuning](/iris/33-performance-tuning).
