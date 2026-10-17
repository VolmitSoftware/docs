---
title: "Samplers & Metrics"
description: "Metric IDs, measurement units, availability, and history behavior"
published: true
date: 2026-10-17T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Samplers are React's measurement units. They feed monitors, map renderers, and PlaceholderAPI. Every sampler also implements the React map-renderer contract. Use any registered sampler through [PlaceholderAPI](/react/19-api-placeholderapi).

## Observation model

- Live capture runs every 500 ms by default and reads each source at its own refresh interval.
  Sampler caches feed the HUD, web clients, graphs, and stored history. A capture can reuse
  the same source reading; its source timestamp does not advance until the source refreshes.
- Live metrics include `sampledAtMs`, `intervalMs`, `windowMs`, `quality`, `unit`, and
  `unavailableReason`. Quality is `MEASURED`, `ESTIMATED`, or `UNKNOWN`. `intervalMs` and
  `windowMs` describe the declared refresh interval and aggregation window. A zero value means
  that interval or window is unspecified. Source detail endpoints can also report the actual
  elapsed window when it differs from the declared window.
  `unit` describes the numeric value, independently of a display suffix such as MiB or percent.
- One-second history retains the first, minimum, maximum, sum, last, and count of all available
  captures in that second, including intervening half-second spikes. History points retain the
  first and last source timestamps. Repeated cached readings remain separate captures.
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

Built-in samplers are listed below by group. One internal `unknown` fallback is not
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

| Sampler id | Unit | Meaning |
|---|---|---|
| `physical-memory-used` | bytes | Physical Memory Used |
| `physical-memory-free` | bytes | Physical Memory Available |
| `disk-usable` | bytes | Disk Usable |
| `disk-read-rate` | bytes/s | Disk Read Rate |
| `disk-write-rate` | bytes/s | Disk Write Rate |
| `disk-read-operations-rate` | operations/s | Disk Read Operations |
| `disk-write-operations-rate` | operations/s | Disk Write Operations |
| `disk-queue-length` | operations | Disk Queue Length |
| `disk-transfer-time-rate` | ms/s | Disk Transfer Time Rate |
| `network-receive-rate` | bytes/s | Network Receive Rate |
| `network-send-rate` | bytes/s | Network Send Rate |
| `network-receive-drops` | drops | Network Receive Drops |
| `network-receive-errors` | errors | Network Receive Errors |
| `network-send-errors` | errors | Network Send Errors |
| `network-receive-packets-rate` | packets/s | Network Receive Packets |
| `network-send-packets-rate` | packets/s | Network Send Packets |
| `network-collisions` | collisions | Network Collisions |
| `process-resident-memory` | bytes | Process Resident Memory |
| `process-io-read-rate` | bytes/s | Process I/O Read Rate |
| `process-io-write-rate` | bytes/s | Process I/O Write Rate |
| `process-minor-faults-rate` | faults/s | Process Minor Fault Rate |
| `process-major-faults-rate` | faults/s | Process Major Fault Rate |
| `process-page-faults-rate` | faults/s | Process Page Fault Rate |
| `process-open-files` | files | Process Open Files |
| `process-file-limit` | files | Process File Limit |
| `process-file-headroom` | files | Process File Headroom |
| `process-file-utilization` | % | Process File Utilization |
| `swap-total` | bytes | Swap Total |
| `swap-used` | bytes | Swap Used |
| `swap-pages-in-rate` | pages/s | Swap Pages In |
| `swap-pages-out-rate` | pages/s | Swap Pages Out |

Disk counters, mount space, and file descriptor counts refresh every 30 seconds. Network counters refresh every 10 seconds. Physical memory, swap, and process counters refresh every five seconds. Rates divide counter differences by the actual elapsed time. A new source or a reset counter requires a new baseline before its rate becomes available. Each source retains its own timestamp. A periodic reading becomes unavailable after three missed refresh intervals. GC event readings remain available until replaced by another collection.

Disk and network values cover the host devices that the operating system exposes. Network drop, error, and collision readings are cumulative counters. Disk transfer time reports cumulative transfer milliseconds per elapsed second, summed across devices. It can exceed 1000 ms/s and does not measure request latency. Disk queue length is unavailable on macOS. Network collisions are unavailable on Windows.

Process I/O and page faults cover the server process. Their accounting depends on the operating system. Resident memory is an operating-system estimate. Windows exposes a total page-fault rate without separate minor and major rates. Solaris exposes combined process I/O through the read counter and has no separate write rate. File headroom is the current soft file limit minus the open count, floored at zero. Limits, headroom, and utilization are unavailable when the operating system cannot supply a positive limit. Swap page rates count pages. Unsupported counters report unavailable.

### jvm

| Sampler id | Unit | Meaning |
|---|---|---|
| `jvm-heap-max` | bytes | JVM Heap Max |
| `jvm-heap-committed` | bytes | JVM Heap Committed |
| `jvm-heap-utilization` | % | JVM Heap Utilization |
| `jvm-nonheap-used` | bytes | JVM Non-Heap Used |
| `jvm-direct-buffer-bytes` | bytes | JVM Direct Buffer Memory |
| `jvm-direct-buffer-count` | buffers | JVM Direct Buffer Count |
| `jvm-gc-collections-rate` | collections/min | JVM GC Collections |
| `jvm-loaded-classes` | classes | JVM Loaded Classes |
| `jvm-process-uptime` | ms | JVM Process Uptime |
| `jvm-threads` | threads | JVM Platform Threads |
| `jvm-threads-daemon` | threads | JVM Daemon Threads |
| `jvm-threads-peak` | threads | JVM Peak Threads |
| `jvm-thread-start-rate` | threads/s | JVM Thread Starts |
| `jvm-threads-runnable` | threads | JVM Runnable Threads |
| `jvm-threads-blocked` | threads | JVM Blocked Threads |
| `jvm-threads-waiting` | threads | JVM Waiting Threads |
| `jvm-virtual-parallelism` | threads | Virtual Thread Parallelism |
| `jvm-virtual-carriers` | threads | Virtual Thread Carriers |
| `jvm-virtual-mounted` | threads | Mounted Virtual Threads |
| `jvm-virtual-queued` | threads | Queued Virtual Threads |

Heap, buffer, class, uptime, and GC-rate metrics refresh once per second. Direct-buffer memory is the JVM's estimate of memory used by that pool. `jvm-gc-collections-rate` is collections per minute over the last 60 seconds. During the first minute, it uses the elapsed JVM lifetime until a complete 60-second window exists. Concurrent-cycle collector beans are excluded.

Thread metrics refresh every five seconds. The `jvm-threads` family counts platform threads, and waiting includes timed waiting. `jvm-virtual-parallelism` is the virtual-thread scheduler's target parallelism. `jvm-virtual-carriers` counts platform threads in its pool. Mounted and queued virtual-thread counts are estimates and may overestimate the current count. A scheduler counter that the JVM cannot supply is unavailable.

### memory

| Sampler id | Unit | Meaning |
|---|---|---|
| `memory-free` | bytes | Remaining heap headroom |
| `memory-garbage` | bytes | Heap growth above the latest completed-GC heap reading, floored at zero |
| `memory-pressure` | bytes/s | Estimated JVM allocation rate from the JVM's cumulative allocation counter |
| `memory-used` | bytes | Current used heap |
| `memory-used-after-gc` | bytes | Memory Used After GC |
| `gc-reclaimed-bytes` | bytes | Latest GC Reclaimed Heap |
| `gc-pause-latest` | ms | Latest GC Pause |
| `gc-pause-max` | ms | Maximum GC Pause |

`memory-pressure` samples once per second and divides the allocation-counter increase by actual elapsed time. Collection does not erase allocations from this counter. It is unavailable during warm-up, after a counter reset, or when allocation measurement is unsupported or disabled. React does not enable allocation measurement when the JVM has it disabled. `memory-garbage` does not measure unreachable objects and remains unavailable until the first completed-GC heap reading.

Completed-GC metrics use collector notifications. `memory-used-after-gc` is the sum of heap-pool usage after the latest completed collection. `gc-reclaimed-bytes` is its before-minus-after difference, floored at zero. `gc-pause-latest` is the latest completed pause notification's duration. Concurrent collector cycle beans contribute heap readings but are excluded from pause values. These readings remain unavailable until their first event. Their timestamps remain the event time until another event occurs.

`gc-pause-max` is the largest pause within the last five minutes, limited to the latest 4096 pause notifications. It refreshes once per second and reports zero when that window contains no pauses. It is unavailable if the JVM exposes no pause notification source.

### processor

| Sampler id | Unit | Meaning |
|---|---|---|
| `processor-system-load` | ratio | System CPU Load |
| `processor-process-load` | ratio | Process CPU Load |
| `processor-io-wait` | % | CPU I/O Wait |
| `processor-steal` | % | CPU Steal |
| `jvm-available-processors` | processors | JVM Available Processors |
| `processor-effective-load` | % | Process CPU Capacity Load |
| `processor-outside` | ratio | CPU use outside the server process |

Processor sources refresh once per second. `processor-system-load`, `processor-process-load`, and `processor-outside` are fractions of total host CPU, formatted as percentages. `processor-outside` estimates system load minus process load, floored at zero. `processor-effective-load` divides process CPU use by the JVM's current available processor count and uses percent units. That denominator reflects the JVM's reported capacity, including any configured processor override. `processor-io-wait` and `processor-steal` are host CPU counter percentages. I/O wait is available on Linux, AIX, and Solaris. Steal is available on Linux and AIX. Unsupported counters and the first rate interval report unavailable.

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

Observation counters refresh once per second. Duration rates sum elapsed work across all contributing threads, so they can exceed 1000 ms/s. Nearby candidates count entities returned by native neighborhood queries before the selection quota; samples count entities selected by consumers. Reusing a query can produce several selections from the same candidates.

| Sampler id | Unit | Meaning |
|---|---|---|
| `react-nearby-queries` | /s | Nearby Entity Queries |
| `react-nearby-candidates` | /s | Nearby Entity Candidates |
| `react-nearby-samples` | /s | Nearby Entity Samples |
| `react-nearby-cache-hits` | /s | Nearby Entity Cache Hits |
| `react-nearby-query-ms` | ms/s | Nearby Entity Query Time |
| `react-heatmap-scans` | /s | Heatmap Scans |
| `react-heatmap-cache-hits` | /s | Heatmap Cache Hits |
| `react-heatmap-cells` | /s | Heatmap Chunks Inspected |
| `react-heatmap-scan-ms` | ms/s | Heatmap Scan Time |
| `react-map-renders` | /s | Map Renders |
| `react-map-render-ms` | ms/s | Map Render Time |
| `react-map-flush-ms` | ms/s | Map Flush Time |
| `react-map-throttle-skips` | /s | Map Throttle Skips |
| `react-map-busy-skips` | /s | Map Busy Skips |
| `react-map-failures` | /s | Map Render Failures |
| `react-entity-scan-skips` | /s | Entity Scan Busy Skips |
| `react-entity-scan-completed` | /s | Entity Scan Anchors Completed |

Sampler and ticker diagnostics refresh once per second. Rates divide counter changes by the actual elapsed interval. Duration rates sum work across contributing threads and can exceed 1000 ms/s. Maximum-duration metrics report the largest value recorded by the current sampler or ticker instances. Diagnostic readings are unavailable during their initial measurement interval and expire after five seconds without a refresh.

| Sampler id | Unit | Meaning |
|---|---|---|
| `react-sampler-refreshes` | /s | Refresh attempts across registered samplers |
| `react-sampler-refresh-failures` | /s | Failed sampler refreshes |
| `react-sampler-cache-hits` | /s | Reads served from an unexpired sampler cache |
| `react-sampler-refresh-skips` | /s | Refresh requests skipped while another refresh is in flight |
| `react-sampler-refresh-ms` | ms/s | Total sampler refresh execution time |
| `react-sampler-queue-ms` | ms/s | Total wait before queued sampler refreshes start |
| `react-sampler-max-refresh-ms` | ms | Largest recorded refresh duration among registered samplers |
| `react-sampler-max-queue-ms` | ms | Largest recorded queue wait among registered samplers |
| `react-sampler-oldest-age-ms` | ms | Age of the oldest retained source timestamp in the live snapshot |
| `react-sampler-stale` | count | Available readings older than three seconds or three declared refresh intervals, whichever is longer |
| `react-ticker-submitted` | /s | Ticker tasks accepted by its executor |
| `react-ticker-executed` | /s | Ticker callbacks that started, including failed callbacks |
| `react-ticker-failed` | /s | Ticker callbacks that threw an error |
| `react-ticker-skipped` | /s | Due ticker work skipped because that task is already in flight |
| `react-ticker-rejected` | /s | Ticker submissions rejected by its executor |
| `react-ticker-backoff` | /s | Accepted tasks deferred by thread-ownership backoff |
| `react-ticker-runtime-ms` | ms/s | Total callback execution time, including failed callbacks |
| `react-ticker-queue-ms` | ms/s | Total wait before accepted ticker tasks start |
| `react-ticker-max-queue-ms` | ms | Largest recorded ticker queue wait |
| `react-ticker-active` | count | Ticker executions active at capture time |

`react-sampler-oldest-age-ms` includes retained timestamps from unavailable readings. `react-sampler-stale` counts only available readings with a declared refresh interval. Samplers with local refresh instrumentation expose a live `diagnostics` object with refresh attempts, successes, failures, cache hits, in-flight skips, latest and maximum execution duration, latest and maximum queue wait, last successful refresh time, and cumulative execution and queue time. Durations in this object use nanoseconds; the last-success timestamp uses epoch milliseconds. Host and native samplers omit this object. Supported zero counters remain present.

### regional and pathfinding

| Sampler id | Unit | Meaning |
|---|---|---|
| `region-tps-lowest` | TPS | Lowest five-second TPS among recently observed player locations |
| `region-players-below-18-tps` | players | Observed players at locations below 18 TPS |
| `region-players-below-15-tps` | players | Observed players at locations below 15 TPS |
| `region-player-coverage` | % | Online players with an observation no older than five seconds |
| `pathfinding-decisions-rate` | /s | Paper pathfinding decisions observed per second |
| `pathfinding-cancelled-rate` | /s | Pathfinding decisions marked cancelled when observed at monitor priority |

Folia regional telemetry samples a rotating set of cached player locations each second without loading chunks. It counts players and player locations, not distinct regions or the entire server. TPS uses Folia's five-second region window. A player who changes chunk or world, or disconnects, loses the old observation; the remaining observations expire after five seconds. Regional readings are unavailable when disabled or when the server lacks the public region TPS API. TPS is unavailable without a valid observation. Coverage is zero when online players have no observations, and 100% when nobody is online. With nobody online, both affected-player counts are zero. Pathfinding rates count decisions, not path computation time or successful routes.

### JFR event summaries

JFR telemetry is disabled by default. Enable it in [runtime telemetry settings](/react/01-installation-configuration#runtime-telemetry). Available event schemas depend on the server and JVM. An unsupported or disabled source reports unavailable.

| Sampler id or family | Meaning |
|---|---|
| `jfr-chunk-generation-rate`, `jfr-chunk-generation-mean-ms`, `jfr-chunk-generation-max-ms` | Completed generation stages per second and their mean/maximum elapsed duration |
| `jfr-region-read-rate`, `jfr-region-write-rate` | Observed chunk storage operations per second |
| `jfr-region-read-bytes-rate`, `jfr-region-write-bytes-rate` | Observed chunk storage bytes per second |
| `jfr-network-sent-rate`, `jfr-network-received-packets-rate` | Observed Minecraft protocol packets per second |
| `jfr-network-sent-bytes-rate`, `jfr-network-received-bytes-rate` | Observed Minecraft protocol bytes per second |
| `jfr-slow-file-read-*`, `jfr-slow-file-write-*` | File events meeting the threshold: `rate`, `mean-ms`, `max-ms`, and `bytes-rate` |
| `jfr-slow-monitor-enter-*`, `jfr-slow-monitor-wait-*`, `jfr-slow-thread-park-*` | Wait events meeting the threshold: `rate`, `mean-ms`, and `max-ms` |
| `jfr-data-loss-rate`, `jfr-data-loss-bytes-rate` | JFR-reported event-loss occurrences and bytes per second |
| `jfr-delivery-delay-ms` | Largest delay between event completion and delivery in the published interval |

Summaries use the events delivered during each roughly one-second interval. Delivery can lag the underlying work. Slow JVM events include only observations meeting `jfrSlowThresholdMs`; they do not describe the complete latency distribution. Chunk generation counts stages, not complete chunks. Storage event counts and bytes do not measure disk or save latency. Protocol totals do not measure physical network traffic. Duration metrics are unavailable when the interval contains no matching observation; a supported event count can be zero. Event loss makes affected summaries unavailable for that interval.

`GET /api/v1/metrics/runtime` supplies the regional coverage snapshot and JFR capabilities, threshold, actual window, completeness, and bounded per-level/category summaries. It uses the configured read authentication. No file paths, peer addresses, or stack traces are included. Grouped summaries retain at most 64 series per interval; excess groups contribute to an `other` group. Level labels come from the server event and can identify a dimension rather than a unique Bukkit world. Generation categories identify stages; storage categories identify storage types. Missing event labels appear as `unknown` and mark the interval incomplete. Its aggregate counts and timings remain valid unless events were lost.

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
