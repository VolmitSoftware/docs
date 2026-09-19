---
title: "Samplers & Metrics"
description: "React documentation: Samplers & Metrics"
published: true
date: 2026-09-19T00:00:00.000Z
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
- A sampler that cannot measure reports unavailable rather than a healthy-looking zero.
- Samplers for other Volmit plugins are registered even when that plugin is absent. They render
  `---` until data arrives, then keep the last value.
- Gloss can read any global sampler as `react.sampler.<id>` in a conditional document, for example
  `metric('react.sampler.ticks-per-second', 20) < 18`. See
  [Gloss Expressions & Placeholders](/gloss/13-expressions-placeholders#conditional-documents).

## Built-in samplers

About 195 samplers ship built in, listed below by group. One internal `unknown` fallback is not
listed: it backs unresolved monitor configuration, reads zero, and renders `---`.

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

| Sampler id |
|---|
| `chunk-gen-ms` |
| `chunk-load-ms` |
| `chunk-tickets` |
| `chunk-unloads` |
| `chunks` |
| `chunks-force-loaded` |
| `chunks-generated` |
| `chunks-loaded` |

### entities

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

### gloss

| Sampler id |
|---|
| `gloss-animations` |
| `gloss-boards` |
| `gloss-bubbles` |
| `gloss-builder-server` |
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

### memory

| Sampler id |
|---|
| `memory-free` |
| `memory-garbage` |
| `memory-pressure` |
| `memory-used` |
| `memory-used-after-gc` |

### processor

| Sampler id |
|---|
| `processor-outside` |
| `processor-process-load` |
| `processor-system-load` |

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

### tick

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

### wormholes

| Sampler id |
|---|
| `wormholes-block-changes` |
| `wormholes-compression` |
| `wormholes-packets` |
| `wormholes-peer-rtt` |
| `wormholes-peers` |
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

## Sampler configuration

Package-scanned sampler configuration lives at `plugins/React/sampler/<id>.toml`. Controller-owned runtime telemetry samplers create no sampler TOML. Fields not listed here have no sampler-specific setting. Non-positive history and averaging lengths are clamped to one; rate windows are clamped to at least 1000 ms.

| Sampler id(s) | Field | Default | Meaning |
|---|---|---:|---|
| `chunk-unloads`, `chunks-generated`, `chunks-loaded`, `commands`, `entities-spawns`, `fluid`, `hopper`, `physics`, `redstone`, `spawner-spawns` | `rollingAverageSamples` | `5` | Number of rate samples in the rolling mean. |
| `chunks`, `entities` | `realityCheckMS` | `10000` | Interval for correcting the event-maintained total from world counters. |
| `chunk-load-ms`, `chunk-gen-ms` | `maxHistory` | `48` | Completed event durations retained in the rolling mean. |
| `chunk-load-ms`, `chunk-gen-ms` | `staleStartMS` | `10000` | Age after which an unmatched event start is discarded. Negative values act as zero. |
| `backlog-growth-rate` | `averagingSamples` | `12` | Queue-growth samples in the rolling mean. |
| `ping-jitter` | `averagingSamples` | `20` | Player-jitter samples in the rolling mean. |
| `tick-ms-p50`, `tick-ms-p95`, `tick-ms-p99` | `historyTicks` | `1200` | Tick durations retained for percentile calculation. |
| `tick-spike-rate` | `spikeThresholdMS` | `50` | Minimum elapsed tick time counted as a spike; clamped to at least 1 ms. |
| `tick-spike-rate` | `windowMS` | `60000` | Rolling spike-rate window. |
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

Mirrored metric renderers show `---` while the owning plugin has never supplied data. Raw `%react_sampler.<id>%` reads return `0` before the first value. They retain the last value afterward. Mirrored values lag the source's publish interval. The owning plugin's PlaceholderAPI key is canonical when both plugins expose the same metric.

## Dynamic plugin-cost samplers

React registers `plugin-<normalized-plugin-name>` for each enabled plugin except React. It also skips peers represented by built-in integration samplers. The id lowercases the plugin name. It replaces characters outside letters, digits, `_`, and `-` with `-`. The value is a five-sample rolling mean of event-handler time in `ms/s`. React removes the sampler when that plugin disables.

## Publishing your own metrics

See [18 - API - Metric Publishing](/react/18-api-metric-publishing). Do not implement React’s internal `Sampler` type from outside the plugin.
