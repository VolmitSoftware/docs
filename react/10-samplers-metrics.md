---
title: "Samplers & Metrics"
description: "React documentation: Samplers & Metrics"
published: true
date: 2026-08-23T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Samplers are React's measurement units. They feed monitors, map renderers, and PlaceholderAPI. Every sampler also implements the React map-renderer contract. The complete meaning and unit table for every operator-facing built-in id is in [19 - API - PlaceholderAPI](/react/19-api-placeholderapi).

## Observation model

- Registered samplers start with the sample controller. Cached samplers perform their measurement when sampled. They reuse that measurement for their cache interval. Ticked samplers update on their own schedule.
- PlaceholderAPI demand controls which sampler values its once-per-second publisher requests. It does not enable or disable sampler objects.
- Built-in cross-plugin samplers are registered even when their source plugin is absent. Their renderer formatting is `---` until data arrives. Raw sampler reads return zero before the first value. They retain the last received value afterward.
- Metrics published through `ReactMetrics` create dynamic samplers while their source is registered. They disappear when that source unregisters or its plugin disables.
- A sampler's `sample(Chunk)` path uses observer data when the metric has chunk samples. Otherwise it resolves to zero. Its map renderer graphs the sampler history.
- Observer chunk samples retain only immutable world UUID, canonical world key, and chunk X/Z identity. `SampledChunk` and `SampledWorld` retain no Bukkit `Chunk` or `World` handle, and coordinate lookup never calls `World#getChunkAt` or loads a chunk. Worst-chunk maps, commands, and action queue builders consume that identity; any later live world or chunk access is resolved at dispatch and performed through the owning chunk scheduler.
- `entities` and `chunks` use event-maintained totals corrected from Paper's per-world counters every ten seconds. They do not fan out one scan per player. Entity chunk attribution follows load, spawn, explicit movement, teleport, unload, and removal events; the shared census also reconciles entities that cross a chunk without a Bukkit move event so later removal closes the current bucket instead of leaving a source-chunk residue.
- The seven category samplers (`ground-items`, `entities-hostile`, `entities-animals`, `villagers`, `projectiles`, `physics-entities`, and `entity-ai-active-count`) share UUID-deduplicated event-maintained counts across loaded worlds. Paper and Spigot reconcile at most 128 weakly referenced entities per world during each two-second refresh instead of copying whole-world entity arrays. Their startup repair consumes one loaded coordinate and at most 256 entities per tick until the event-maintained index converges. Folia rotates through the observer's immutable loaded-coordinate index, including chunks without players, with a limit of 32 owned chunks and 128 entities per chunk per refresh. The observer captures each world's startup loaded-chunk array once and converts at most 256 entries per one-second wave into coordinates; unload events suppress late seed entries, and the temporary arrays are released when drained or stopped. After seeding, the nominal Folia rotation for 1,000 loaded chunks is 64 seconds; a chunk above 128 entities needs one additional full chunk rotation per 128-entity slice. Reads never wait for reconciliation and receive the latest event-maintained value.

## Built-in sampler count

The package scan registers **155** built-in sampler ids: the **154** operator-facing ids below plus the internal `unknown` fallback. `unknown` backs unresolved monitor configuration, returns zero as a raw sample, renders `---`, and is omitted from the sampler picker and public metric catalog.

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
| `jvm-threads` |
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
| `world-save-duration` |
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

### react-internal

| Sampler id |
|---|
| `react-async-tick-time` |
| `react-job-budget` |
| `react-job-queue-time` |
| `react-jobs-queue` |
| `react-sync-tick-time` |

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
| `fluid-tick-time` |
| `hopper` |
| `hopper-chain-coalescing` |
| `hopper-tick-time` |
| `physics` |
| `physics-entities` |
| `physics-tick-time` |
| `redstone` |
| `redstone-burst-rate` |
| `redstone-tick-time` |

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

Sampler configuration lives at `plugins/React/sampler/<id>.toml`. Fields not listed here have no sampler-specific setting. Non-positive history and averaging lengths are clamped to one; rate windows are clamped to at least 1000 ms.

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
| `fluid-tick-time`, `hopper-tick-time`, `physics-tick-time`, `redstone-tick-time` | `tickAverage` | `15` | Timing samples in the rolling mean; clamped to at least one. |

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
