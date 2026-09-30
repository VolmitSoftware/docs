---
title: "NMS Bridges & Platform Notes"
description: "React documentation: NMS Bridges & Platform Notes"
published: true
date: 2026-09-30T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Some React features need a bridge for the running Minecraft version. If no compatible bridge is available, those features stay passive or measurement-only.

Minecraft 26.1.2, 26.2, and 26.3 have bundled bridges. The server version selects the matching bridge automatically. Furnace and brewing batching, hopper coalescing, falling-block handling, and explosion batching remain available on 26.3.

## Check bridge status

Run `/react bridge status` to inspect native capability availability. Startup logs also report whether React found a compatible bridge. An available version does not guarantee that every optional capability is present.

On Folia, `chunk-tickets` uses the native bridge to count a locked ticket snapshot without chunk access. It needs no bytecode instrumentation. An unavailable bridge leaves this metric unavailable. See [10 - Samplers & Metrics](/react/10-samplers-metrics).

## Entity chunk tracking

On Paper and Paper-based servers, the per-chunk `entities` sampler follows mobs across chunk borders as they move. Spigot has no entity move event, so a mob that walks into another chunk is moved to its new chunk by the entity census pass, which rechecks a bounded batch of entities in each world every 2 seconds. The census pass reads each mob's chunk from its position and skips mobs whose chunk is not loaded, so it never loads chunks. Spawns, removals, chunk loads, players, vehicles, and teleports update immediately on every platform. The `entities-hostile`, `entities-animals`, and `entity-ai-active-count` counts work the same on both. The server-wide `entities` total differs only for bodies of mobs killed outside the simulation distance: Spigot leaves them out and Paper-based servers include them. See [10 - Samplers & Metrics](/react/10-samplers-metrics#entities).

## Spigot servers

Spigot has no asynchronous teleport. On Spigot, `/react chunk worst`, React Web player teleports, and delayed portal traversals from `portal-traffic-smoother` teleport synchronously on the server thread. Paper and Folia use asynchronous teleports for the same operations. Plugin API packs read the target plugin version from its `plugin.yml` or `paper-plugin.yml` on every platform.

Spigot has no world border change events. On Spigot, the world border shown on React Web heatmaps is read when a world loads or its spawn changes, so a border moved or resized with `/worldborder` appears after the next restart or spawn change. Paper and Folia update it as soon as the border changes.

Spigot does not expose creeper ignition, enderman screaming and stared-at state, chicken jockey and egg timers, or cow, chicken, and pig sound variants. On Spigot, `mob-stacking` compares the remaining state, including fuse ticks, targets, passengers, saddles, and visual variants. Mobs restored from a stack keep the server defaults for the fields Spigot does not expose.

On Spigot, `entity-trimmer` reads each world's entity total from React's entity index, which the `entities` sampler maintains, because Spigot has no world entity count.

## Thread names

React runs its own work on named threads, so profilers such as JFR, async-profiler, and Spark attribute that cost to React directly.

| Thread name | Purpose |
|---|---|
| `React Ticker` | The 50 ms tick loop that hands due tasks to the `react-tick-N` pool. Daemon. |
| `React Entity Controller` | Entity controller loop that runs every 50 ms and schedules React's entity scans and entity tick listeners. Daemon. |
| `react-tick-N` | Sampler, feature, tweak, monitor, and player runtime ticks. Fixed pool sized to the CPU core count, daemon, minimum priority. |
| `react-async-N` | Background work started through React's async scheduler: chat and color prompts, file and network IO, hotload processing, runtime setting changes. Grows to four threads per core (at least eight) while work blocks and releases idle threads after 60 seconds. |

The tick loop runs every 50 ms. A task is due once its interval has elapsed to within half a loop, so a task with a 50 ms interval runs on every loop, and a task that is still running when it comes due again is skipped until it finishes instead of delaying the other tasks. The `react-async-tick-time` sampler reports the summed execution time of the React ticks completed during each loop, added across all tick threads, so it can exceed 50 ms per loop on a busy server.

## Tick work time on Spigot and Folia

Spigot has no server API for per-tick work time. React reads the vanilla server's record of the last 100 tick durations instead and logs `Tick work time: vanilla MinecraftServer tick times` at startup. Folia publishes no per-tick work times, so `tick-time`, `tick-ms-p50`, `tick-ms-p95`, and `tick-ms-p99` report unavailable there and React logs a warning shortly after startup. TPS and spike rate work on every platform. See [10 - Samplers & Metrics](/react/10-samplers-metrics#tick).
