---
title: "Samplers & Metrics"
description: "React documentation: Samplers & Metrics"
published: true
date: 2026-09-30T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Samplers are React's measurement units. They feed monitors, map renderers, and PlaceholderAPI. Every sampler also implements the React map-renderer contract. The complete meaning and unit table for every operator-facing built-in id is in [19 - API - PlaceholderAPI](/react/19-api-placeholderapi).

## Observation model

- Every sampler is evaluated once per 500 ms. That one reading feeds the HUD, the web UI, graphs,
  and stored history, so a faster web refresh does not cost extra sampling.
- History is kept on disk under `plugins/React/history/`. Retention per tier is in
  [01 - Installation & Configuration](/react/01-installation-configuration#metric-history).
- A sampler that cannot measure reports unavailable rather than a healthy-looking zero. Samplers
  that read main-thread state report unavailable until their first main-thread reading completes,
  and each completed reading is served immediately. `event-time`, `events-listeners`,
  `event-handles-per-tick`, and the `plugin-<name>` samplers are unavailable while event
  instrumentation is not installed, so history keeps a gap instead of zeros for those periods. See
  [01 - Installation & Configuration](/react/01-installation-configuration#event-instrumentation).
- Samplers for other Volmit plugins are registered even when that plugin is absent. They render
  `---` until data arrives, then keep the last value.
- Gloss can read any global sampler as `react.sampler.<id>` in a conditional document, for example
  `metric('react.sampler.ticks-per-second', 20) < 18`. While the sampler reports unavailable, the
  expression receives its fallback value. See
  [Gloss Expressions & Placeholders](/gloss/13-expressions-placeholders#conditional-documents).
- Per-chunk sampler values, which feed the chunk heatmaps, `top-chunk-cost`, `top-world-mspt`, and
  `/react chunk worst`, are halved once per second whether or not the chunk is still active. A value
  that falls below 0.01 is dropped, and a chunk with no values left is removed from the sample set, so
  the event counts of a chunk that goes quiet drop out of the rankings within a few seconds.
- The per-chunk `entities` value is a live count of the entities tracked in that chunk. It does not
  decay; it changes only when entities spawn, move between chunks, or are removed. It counts toward the
  chunk's score, so a chunk holding entities stays in the chunk heatmaps, `top-chunk-cost`,
  `top-world-mspt`, `/react chunk worst`, and the chunk ranking used by
  `action-quarantine-hot-chunks`, `action-prewarm-critical-chunks`, and
  `action-trim-entities-by-age-priority`.

## Built-in samplers

About 195 samplers ship built in, listed below by group. One internal `unknown` fallback is not
listed: it backs unresolved monitor configuration, always reports unavailable, and renders `---`.

### adapt

| Sampler id |
|---|
| `adapt-ability-checks-per-tick` |
| `adapt-ability-ops` |
| `adapt-cache-hit-ratio` |
| `adapt-check-latency` |
| `adapt-event-ops` |
| `adapt-fx-packets` |
| `adapt-fx-shed-band` |
| `adapt-fx-timelines` |
| `adapt-learned-adaptations` |
| `adapt-minions` |
| `adapt-persistence-queue` |
| `adapt-player-sessions` |
| `adapt-provenance-ops` |
| `adapt-session-load` |
| `adapt-spatial-tickets` |
| `adapt-timing-budget` |
| `adapt-world-policy-latency` |
| `adapt-xp-payouts` |
| `adapt-xp-rate` |

`adapt-ability-ops` is throughput telemetry for displays, samplers, and alert context; operation volume alone is not treated as performance pressure. `adapt-timing-budget` is the rolling 60-second guard-check cost expressed as a percentage of a 50 ms/s budget, so `100` means Adapt guard checks averaged 50 milliseconds of work per second across that window. React's Adapt pressure features and alerts use measured timing rather than the operation-rate setting.

`adapt-session-load` is the share of the last 60 seconds Adapt spent ticking its runtime objects. `adapt-ability-checks-per-tick` divides the last minute of ability checks by the server ticks that actually ran in that minute. `adapt-check-latency` is the mean uncached guard-check time at 0.1 µs resolution. `adapt-fx-packets` is the average number of particle packets consumed per FX budget tick during the last completed second.

### biletools

| Sampler id |
|---|
| `biletools-dirty-plugins` |
| `biletools-reload-ms` |
| `biletools-reloads` |
| `biletools-remote-slave` |
| `biletools-watched-jars` |

### chunks

`chunk-tickets` counts plugin ticket memberships across all worlds. Two plugins that hold the same chunk count as two tickets. On Folia, the native bridge counts a locked ticket snapshot without creating Bukkit chunk objects or loading chunks. The sampler caches results for five seconds. If the bridge is unavailable or a query fails, the metric reports unavailable until its sampler restarts.

`chunk-load-listener-ms` and `chunk-gen-listener-ms` measure the main-thread milliseconds that other plugins' `ChunkLoadEvent` listeners spend on each chunk load event, averaged over the most recent `maxHistory` events. The `gen` variant counts only newly generated chunks. They do not measure how long the server took to load or generate the chunk itself. When no matching chunk load completes for 10 seconds, the value drops to `0` and the next chunk load starts a fresh average.

| Sampler id |
|---|
| `chunk-gen-listener-ms` |
| `chunk-load-listener-ms` |
| `chunk-tickets` |
| `chunk-unloads` |
| `chunks` |
| `chunks-force-loaded` |
| `chunks-generated` |
| `chunks-loaded` |

### entities

`entities` counts loaded entities, including players. The category samplers `entities-animals`, `entities-hostile`, `entity-ai-active-count`, `villagers`, `ground-items`, `projectiles`, and `physics-entities` count only entities that are still alive; `entity-ai-active-count` counts non-player mobs with AI enabled. A mob leaves every category count when it dies. A mob killed in a loaded chunk outside the simulation distance leaves a body that stays in its chunk, across unloads and reloads, until that chunk ticks entities; category counts never include it. On Spigot, `entities` also excludes these bodies; on Paper-based servers it reports the server's own loaded-entity count, which includes them.

| Sampler id |
|---|
| `entities` |
| `entities-animals` |
| `entities-hostile` |
| `entities-spawns` |
| `entity-ai-active-count` |

### general

| Sampler id |
|---|
| `backlog-growth-rate` |
| `block-entities` |
| `block-entities-ticking` |
| `bukkit-pending-tasks` |
| `commands` |
| `crop-fast-forward` |
| `event-handles-per-tick` |
| `event-time` |
| `events-listeners` |
| `explosion-packet-reduction` |
| `gc-pause-p95` |
| `gc-time-percent` |
| `ground-items` |
| `incident-score` |
| `lazy-gravity-skipped` |
| `pdc-write-batcher` |
| `per-world-tick-time` |
| `ping-jitter` |
| `player-ping-p95` |
| `players` |
| `projectiles` |
| `scheduler-backlog` |
| `spawner-light-cache-skipped` |
| `spawner-spawns` |
| `top-chunk-cost` |
| `top-world-mspt` |
| `villagers` |
| `world-save-event-interval` |
| `worlds` |

`event-time` reports exclusive handler time in milliseconds per second of measured wall time: when a handler fires another event, the nested handlers' time is charged to them and subtracted from the outer handler. Handlers invoked for asynchronous events run unmeasured and are excluded from `event-time` and `event-handles-per-tick`. `event-handles-per-tick` divides measured synchronous handler calls by the server ticks observed in the same window.

`gc-time-percent` is the share of the last 60 seconds spent in stop-the-world collector pauses.
During the first minute after React starts, the window reaches back to JVM start, so the reading is
the lifetime share until 60 seconds of samples exist. `gc-pause-p95` is the 95th percentile pause
duration over the last five minutes.
Both skip concurrent-cycle collector beans whose names end in ` Cycles` (ZGC and Shenandoah), which
time work that runs alongside the server rather than pauses. `explosion-packet-reduction` is
`1 - clusters / explosions` summed over the last five one-second windows that saw explosion
batching; windows without explosions are skipped and windows older than one minute are dropped.
The sampler reports unavailable until the first batched explosion and again after a minute with no
batched explosions.

### gloss

| Sampler id |
|---|
| `gloss-animations` |
| `gloss-boards` |
| `gloss-bubbles` |
| `gloss-display-entities` |
| `gloss-emoji` |
| `gloss-holograms` |
| `gloss-indicators` |
| `gloss-menu-definitions` |
| `gloss-menus` |
| `gloss-packets` |
| `gloss-panels` |
| `gloss-preview-refresh` |
| `gloss-previews` |
| `gloss-sessions` |
| `gloss-spawns` |
| `gloss-tablist-players` |
| `gloss-tick-ms` |
| `gloss-visible-entities` |

`gloss-boards` counts players currently shown a Gloss sidebar. `gloss-holograms` counts persistent holograms currently spawned for nearby players. `gloss-animations` counts hologram text targets currently animating, one per shared display or per viewer of a personalized display, including clips at or below 20 fps that refresh on the hologram tick. `gloss-tick-ms` is reported in `ms/s`: milliseconds per second Gloss spends on menu and preview session work, measured where that work runs, including on Folia region threads.

### hiddenore

| Sampler id |
|---|
| `hiddenore-breaks` |
| `hiddenore-drop-rules` |
| `hiddenore-drops` |
| `hiddenore-ore-removal` |
| `hiddenore-ore-removal-rate` |
| `hiddenore-pdc-reads` |
| `hiddenore-pdc-writes` |
| `hiddenore-reloads` |
| `hiddenore-seeded-mode` |
| `hiddenore-vein-cache` |
| `hiddenore-vein-computes` |
| `hiddenore-vein-discoveries` |

### iris

| Sampler id |
|---|
| `iris-chunks-per-second` |
| `iris-generation-total-ms` |
| `iris-pregen-queue` |
| `iris-pregen-throughput` |

`iris-pregen-queue` (Iris Pregen In Flight) is the number of chunk requests the pregenerator currently has in flight. The Iris dashboards show the chunks left in the job as **Remaining**. `iris-generation-total-ms` reads unavailable once a world has generated no chunks for 10 seconds.

### host

| Sampler id |
|---|
| `disk-read-rate` |
| `disk-usable` |
| `disk-write-rate` |
| `network-receive-drops` |
| `network-receive-errors` |
| `network-receive-rate` |
| `network-send-errors` |
| `network-send-rate` |
| `physical-memory-free` |
| `physical-memory-used` |

React reads disk counters and mount space every 30 seconds and network counters every 10 seconds. `disk-read-rate` and `disk-write-rate` are averages over the last 30 seconds, and `network-receive-rate` and `network-send-rate` are averages over the last 10 seconds. A newly attached disk, mount, or network interface appears within 30 seconds. `disk-usable` refreshes on every host sample.

### jvm

| Sampler id |
|---|
| `jvm-direct-buffer-bytes` |
| `jvm-direct-buffer-count` |
| `jvm-gc-collections-rate` |
| `jvm-heap-committed` |
| `jvm-heap-max` |
| `jvm-heap-utilization` |
| `jvm-loaded-classes` |
| `jvm-nonheap-used` |
| `jvm-process-uptime` |
| `jvm-threads` |

`jvm-gc-collections-rate` is the number of garbage collections per minute over the last 60 seconds. During the first minute after React starts, the window reaches back to JVM start, so the reading is the lifetime average until 60 seconds of samples exist.

### memory

| Sampler id |
|---|
| `memory-free` |
| `memory-garbage` |
| `memory-pressure` |
| `memory-used` |
| `memory-used-after-gc` |

`memory-pressure` is the heap allocation rate in bytes per second, measured between consecutive
readings over the real elapsed time and averaged over the last 20 readings. The first reading after
the sampler resumes from idle re-baselines and reports zero, and a heap drop caused by garbage
collection reads as zero.

### processor

| Sampler id |
|---|
| `processor-outside` |
| `processor-process-load` |
| `processor-system-load` |

All three processor samplers are fractions of total host CPU, formatted as percentages, measured over the same interval of at least one second. `processor-system-load` is host-wide CPU use from the operating system's CPU counters. `processor-process-load` is the server process's CPU time as a share of all logical processors. `processor-outside` is system load minus process load: CPU used by everything outside the server process. They report unavailable until the first full interval after React starts.

### player-activity

| Sampler id |
|---|
| `player-joins-rate` |
| `player-quits-rate` |
| `players-unique-24h` |

### react-internal

| Sampler id |
|---|
| `react-async-tick-time` |
| `react-job-budget` |
| `react-job-queue-time` |
| `react-jobs-queue` |
| `react-sync-tick-time` |
| `react-history-capture-ms` |
| `react-history-disk-bytes` |
| `react-history-drop-rate` |
| `react-history-dropped-snapshots` |
| `react-history-persist-lag` |
| `react-history-storage-error` |
| `react-history-storage-operational` |
| `react-history-wal-bytes` |
| `react-history-write-ms` |
| `react-history-writer-capacity` |
| `react-history-writer-queue` |
| `react-published-metrics-accepted` |
| `react-published-metrics-dropped` |
| `react-samplers-available` |
| `react-samplers-failed` |
| `react-samplers-registered` |
| `react-samplers-unavailable` |
| `react-websocket-coalesced-frames` |
| `react-websocket-sessions` |

`react-sync-tick-time` is the mean main-thread time, over the last 20 server ticks, that React
spends running queued jobs; ticks with no queued work count as zero. `react-job-budget` is job time
carried over beyond the per-tick target and drains by the controller's maximum compute time every
tick, including idle ticks. `react-async-tick-time` is the summed execution time of the React ticks
completed during each 50 ms tick loop, added across all `react-tick-N` threads, so it can exceed
50 ms per loop on a busy server. See
[14 - NMS Bridges & Platform Notes](/react/14-nms-bridges-platform-notes#thread-names).

### tick

All tick samplers read one shared tick recorder that listens to React's server tick event and reads the server's per-tick work time: how long each tick ran, excluding the wait before the next tick. Paper-based servers supply the trailing five seconds of work times; Spigot supplies the last 100 completed ticks.

- `tick-time` is the mean tick work time over that window, shown with two decimals (for example `0.28 ms`).
- `tick-ms-p50`, `tick-ms-p95` and `tick-ms-p99` are percentiles of tick work time over that window.
- `tick-spike-rate` counts each completed tick whose work time exceeds `spikeThresholdMS` once, reported per minute over `windowMS`.
- `ticks-per-second` is the number of ticks completed in the trailing five seconds divided by the time those ticks took, capped at 20. During a stall it decays toward zero and the formatted value switches to the time since the last tick once `countUpTickTimeThresholdMS` passes.

On servers without per-tick work times, such as Folia, `tick-time` and the three percentiles report unavailable. `ticks-per-second` and `tick-spike-rate` keep working from the interval between ticks; a spike is then an interval longer than `spikeThresholdMS` plus one nominal 50 ms tick. React logs a warning shortly after startup when no work-time source is available. See [14 - NMS Bridges & Platform Notes](/react/14-nms-bridges-platform-notes#tick-work-time-on-spigot-and-folia).

| Sampler id |
|---|
| `tick-ms-p50` |
| `tick-ms-p95` |
| `tick-ms-p99` |
| `tick-spike-rate` |
| `tick-time` |
| `ticks-per-second` |

### world-systems

| Sampler id |
|---|
| `fluid` |
| `fluid-event-span` |
| `hopper` |
| `hopper-chain-coalescing` |
| `hopper-event-span` |
| `physics` |
| `physics-entities` |
| `physics-event-span` |
| `redstone` |
| `redstone-burst-rate` |
| `redstone-event-span` |

`hopper` counts item moves per second whose source or destination is a hopper block. Each move counts once and is charged to that hopper's chunk, or to the source hopper's chunk when both ends are hoppers. Moves cancelled by React or another plugin still count. Block updates next to hoppers and moves into or out of hopper minecarts are not counted.

### wormholes

| Sampler id |
|---|
| `wormholes-block-changes` |
| `wormholes-block-entities` |
| `wormholes-compression` |
| `wormholes-packets` |
| `wormholes-peer-rtt` |
| `wormholes-peers` |
| `wormholes-plate-builds` |
| `wormholes-plate-bytes` |
| `wormholes-portals` |
| `wormholes-projection-observers` |
| `wormholes-projection-render-ms` |
| `wormholes-projections-active` |
| `wormholes-remote-portals` |
| `wormholes-replicated-blocks` |
| `wormholes-resyncs` |
| `wormholes-sideband-drops` |
| `wormholes-sideband-queue` |
| `wormholes-spoofed-entities` |
| `wormholes-transfers` |
| `wormholes-transfers-failed` |
| `wormholes-traversals` |
| `wormholes-view-entities` |
| `wormholes-view-subscriptions` |
| `wormholes-wire-in` |
| `wormholes-wire-out` |

`wormholes-projection-observers` counts distinct players currently watching at least one projection. `wormholes-traversals` counts portal traversals completed in the last 60 seconds. `wormholes-compression` is the outbound wire-to-raw byte ratio of the most recent second of traffic and reads unavailable while nothing is sent. `wormholes-peer-rtt` reads unavailable until at least one peer has completed its handshake. `wormholes-plate-builds` counts projection view plates built per second, `wormholes-plate-bytes` is the estimated memory held by cached view plates, and `wormholes-block-entities` counts projected block-entity updates sent to viewers per second.

## Sampler configuration

Package-scanned sampler configuration lives at `plugins/React/sampler/<id>.toml`. Controller-owned runtime telemetry samplers create no sampler TOML. Fields not listed here have no sampler-specific setting. Non-positive history and averaging lengths are clamped to one; rate windows are clamped to at least 1000 ms.

| Sampler id(s) | Field | Default | Meaning |
|---|---|---:|---|
| `chunk-unloads`, `chunks-generated`, `chunks-loaded`, `commands`, `entities-spawns`, `fluid`, `hopper`, `physics`, `redstone`, `spawner-spawns` | `rollingAverageSamples` | `5` | Number of readings in the rolling mean. Each reading divides the events counted since the previous reading (or since the sampler started) by the elapsed time, with a one-second minimum. |
| `chunks`, `entities` | `realityCheckMS` | `10000` | Interval for correcting the event-maintained total from world counters. |
| `chunk-load-listener-ms`, `chunk-gen-listener-ms` | `maxHistory` | `48` | Completed event durations retained in the rolling mean. |
| `chunk-load-listener-ms`, `chunk-gen-listener-ms` | `staleStartMS` | `10000` | Age after which an unmatched event start is discarded. Negative values act as zero. |
| `backlog-growth-rate` | `averagingSamples` | `12` | Queue-growth samples in the rolling mean. |
| `ping-jitter` | `averagingSamples` | `20` | Player-jitter samples in the rolling mean. |
| `tick-spike-rate` | `spikeThresholdMS` | `50` | Tick work time above which a completed tick counts as a spike; clamped to at least 1 ms. Without per-tick work times the threshold applies to the interval between ticks minus one nominal 50 ms tick. |
| `tick-spike-rate` | `windowMS` | `60000` | Rolling spike-rate window; clamped to at least 1000 ms and limited by the 1200-tick history (60 s at 20 TPS). |
| `redstone-burst-rate` | `burstThresholdPerTick` | `64` | Redstone updates in one tick required to record a burst; clamped to at least one. |
| `redstone-burst-rate` | `windowMS` | `60000` | Rolling redstone-burst window. |
| `ticks-per-second` | `countUpTickTimeThresholdMS` | `3000` | Stall duration before formatted output changes from TPS to elapsed time; clamped to at least 1 ms. |
| `fluid-event-span`, `hopper-event-span`, `physics-event-span`, `redstone-event-span` | `tickAverage` | `15` | Within-tick event-span samples in the rolling mean; clamped to at least one. These spans measure the elapsed wall time between the first and last matching event in a tick, not engine subsystem CPU time. |

The event-span ids and `world-save-event-interval` are hard replacements for the former tick-time and save-duration ids. Old sampler TOML filenames and saved monitor ids are not read or migrated.

## Convenience PlaceholderAPI keys

Short keys such as `%react_tps%` and `%react_mspt%` map to specific samplers. Full table: [19 - API - PlaceholderAPI](/react/19-api-placeholderapi). Any sampler is also `%react_sampler.<id>%`.

## Cross-plugin prefixes

| Prefix | Source plugin |
|---|---|
| `adapt-` | Adapt |
| `iris-` | Iris |
| `wormholes-` | Wormholes |
| `gloss-` | Gloss |
| `hiddenore-` | HiddenOre |
| `biletools-` | BileTools |

Mirrored metric renderers and raw `%react_sampler.<id>%` reads show `---` while the owning plugin has never supplied data or reports the metric unavailable. Otherwise they keep the last value the plugin supplied. Mirrored values lag the source's publish interval. The owning plugin's PlaceholderAPI key is canonical when both plugins expose the same metric.

## Dynamic plugin-cost samplers

React registers `plugin-<normalized-plugin-name>` for each enabled plugin except React. It also skips peers represented by built-in integration samplers. The id lowercases the plugin name. It replaces characters outside letters, digits, `_`, and `-` with `-`. The value is a five-sample rolling mean of the plugin's exclusive synchronous event-handler time in `ms/s`, normalized by the measured length of each instrumentation window. The sampler is unavailable while event instrumentation is not installed. React removes the sampler when that plugin disables.

## Publishing your own metrics

See [18 - API - Metric Publishing](/react/18-api-metric-publishing). Do not implement React’s internal `Sampler` type from outside the plugin.
