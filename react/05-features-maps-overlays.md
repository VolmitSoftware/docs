---
title: "Features - Maps & Overlays"
description: "React documentation: Features - Maps & Overlays"
published: true
date: 2026-08-25T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Heatmaps, pie maps, list maps, and pressure overlays render on Minecraft maps. Open with `/react map`. Config: `plugins/React/feature/<id>.toml`.

Most chunk heatmaps share `FeatureChunkHeatmapBase`. That base implements `ReactRenderer` and `ChunkGridExporter` for grid export. Pie charts share `FeatureIrisChunkSharePieBase`. List maps implement `ReactRenderer` directly.

## Shared heatmap base (`FeatureChunkHeatmapBase`)

All heatmaps and overlays below inherit these fields unless noted.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Feature on/off. |
| `chunkPixelSize` | int | `5` | Pixels per chunk cell (zoom). |
| `mapRadiusChunks` | int | `0` | `0` = derive from view distance. Else a fixed radius. |
| `drawCenterMarker` | boolean | `true` | Crosshair at anchor. |
| `drawLabel` | boolean | `true` | Title in header. |
| `minSignificantScore` | double | `0.001` | Below peak score → quiet map (no noise-scale colors). |

In-game heatmaps are fixed north-up coordinate grids. X increases east/right and Z increases south/down. Every visible chunk has a complete perimeter; unloaded chunks, loaded quiet chunks, measured chunks, the center chunk, and MCA 32×32 boundaries remain visually distinct. Scans use the event-maintained loaded-coordinate index over the exact rectangular grid bounds and are cached across the render cadence.

React Web renders one selected exported heatmap as a pan-and-zoom absolute coordinate plane. At close zoom each square is one chunk. Wider views automatically use aligned power-of-two buckets while keeping the response near 33 cells per axis; a 32-chunk cell is exactly one MCA region. Sparse cells carry peak, average, and loaded-sample count, so loaded zero activity remains distinct from a coordinate with no current sample. The server also returns immutable spawn and world-border metadata for recenter and fit-to-border controls. Web requests do not enumerate worlds or call Bukkit world or chunk APIs from the HTTP thread.

Selecting a square exposes its exact cell-center position as `world X Z`. For an aggregate square this is the center of the represented aligned area, not the coordinate of its peak sample. Copying is browser-local and available to every role. React Web never fabricates a Y coordinate or teleports on cell selection; an admin must choose an online player and approve a separate confirmation dialog. The server rechecks the canonical world and border, permits only one in-flight request per target player, resolves solid non-hazardous footing with two open blocks inside the selected chunk, and then uses the owning schedulers and asynchronous teleport path. Destination lookup may load or generate that chunk, and HTTP 202 reports queue acceptance rather than completion.

The coordinate-grid API is a clean break. Detail queries use `centerChunkX`, `centerChunkZ`, and `radius`; the former ambiguous `centerX` and `centerZ` parameters are not accepted. `radius` is bounded to 1–1,875,000 chunks, and invalid requests receive HTTP 400 instead of being silently clamped.

## Shared pie base (`FeatureIrisChunkSharePieBase`)

Donut pie plus legend. Cap slices by legend height (3–32). Overflow goes to “Other”. Bucket cache is 45 ms. Iris helpers can resolve Iris biome names via reflection. Otherwise they use vanilla biomes. Pie subclasses in this set typically add **no** keys beyond `enabled`.

## Heatmaps

### `chunk-load-gen-cost-map`

Weighted load and gen cost per loaded chunk: `loadMS*1.0 + genMS*1.35 + loadRate*0.4 + genRate*0.7` from samplers `chunk-load-ms`, `chunk-gen-ms`, `chunks-loaded`, `chunks-generated`.

### `chunk-sampler-map`

Observer aggregate cost: `SampledChunk.totalScore()` per chunk.

### `entity-pressure-heatmap`

Score: per-chunk `entities` sampler.

### `redstone-activity-heatmap`

Score: per-chunk `redstone` sampler.

### `hopper-container-throughput-map`

Score: per-chunk `hopper` sampler.

### `player-impact-overlay`

Chunk score: `totalScore + entities*0.5 + redstone*0.3 + hopper*0.2`. Overlay draws up to `maxPlayersDrawn` ranked players.

| Field | Type | Default | Description |
|---|---|---|---|
| *(base heatmap keys)* | | | |
| `maxPlayersDrawn` | int | `24` | Max players drawn on overlay. |
| `showPlayerInitials` | boolean | `true` | Show player initial letters. |

### `tick-spike-origin-replay-map`

This feature captures spike origins when `tick-time` is at or above the threshold. Heat decays over time. The worst sample supplies only immutable world UUID/key and chunk X/Z identity. Paper queries immutable Observer coordinates only inside the configured radius instead of sweeping every loaded chunk; the Folia path resolves the live world by UUID and dispatches the capture to that chunk's owning scheduler. Neither path carries Bukkit `Chunk` handles across region boundaries, and the map does not apply per-chunk total-score weighting.

| Field | Type | Default | Description |
|---|---|---|---|
| *(base heatmap keys)* | | | |
| `tickIntervalMS` | int | `250` | Tick interval (ms). |
| `spikeThresholdMS` | double | `50` | Tick-time spike threshold (ms). |
| `spikeCaptureCooldownMS` | int | `350` | Cooldown between captures (ms). |
| `captureRadiusChunks` | int | `3` | Capture ring radius (chunks). |
| `maxTrackedChunks` | int | `4096` | Max tracked heat cells. |
| `staleChunkMS` | int | `120000` | Stale heat expiry (ms). |
| `decayEveryMS` | int | `500` | Decay cadence (ms). |
| `decayFactor` | double | `0.90` | Heat multiplier each decay. |
| `minimumHeat` | double | `0.15` | Drop heat below this. |

## List maps

### `plugin-event-impact-list-map`

Ranked plugin event cost from `PluginEventImpactSeries`. Ranking uses measured event-handler milliseconds only; call counts remain display metadata and cannot create an impact row by themselves.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `maxRowsPerTile` | int | `0` | `0` = fill height. Else rows × grid height. |

### `adapt-ability-impact-list-map`

Ranks Adapt ability detail metrics. An ability needs measured execution time to receive a row; operation count is display and tie-break metadata, not a substitute for performance cost. The feature object registers normally. `MapController` omits the renderer until the Adapt capability is present.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `maxRowsPerTile` | int | `0` | `0` = fill height. |

## Pie maps

### `plugin-event-impact-pie-map`

Pie of rolling measured plugin event-handler time. Call volume without measured time contributes no slice. Config: `enabled` only.

### `iris-biome-chunk-share-pie-map`

Loaded chunks in the map world by biome label. The feature incrementally samples immutable Observer world/chunk coordinates at the owning region, using the world's clamped sea level as a deterministic Y coordinate. Each one-second pass schedules at most 32 chunk-owner samples, reserves up to 16 of those slots for chunk-load lifecycle work, caps queued lifecycle coordinates at 8,192 and outstanding owner tasks at 128, and removes counts immediately on chunk or world unload. Rendering copies only the per-biome counters; it does not enumerate the loaded-chunk index or retain Bukkit `Chunk` handles. The distribution converges as the bounded rotation covers the loaded coordinates and remains current through load/unload events.

The feature and renderer require the live `iris` capability, so non-Iris servers schedule no biome sampling and do not show the map. With Iris available, the renderer is selectable. Config: `enabled` only.

### `iris-world-chunk-share-pie-map`

Buckets Iris world groups by loaded chunks. `MapController` omits the renderer until the Iris capability is present. Config: `enabled` only.

## Capability-gated overlays

### `adapt-runtime-pressure-overlay`

Requires capability `adapt` (not a secret bundle). Score blends chunk total score with Adapt session load and measured guard-check timing-budget use. Raw ability-operation volume does not add pressure.

### `iris-generation-pressure-overlay`

Requires capability `iris` (not secret). Scores chunks only in worlds with an Iris remote metric group.

See [07 - Features - Iris Adapt & Integrations](/react/07-features-iris-adapt-integrations) for registration vs activation gating.
