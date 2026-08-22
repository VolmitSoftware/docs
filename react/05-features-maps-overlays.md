---
title: "Features - Maps & Overlays"
description: "React documentation: Features - Maps & Overlays"
published: true
date: 2026-08-21T00:00:00.000Z
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
| `rotateWithPlayer` | boolean | `true` | Rotate with player heading. |
| `drawCenterMarker` | boolean | `true` | Crosshair at anchor. |
| `drawLabel` | boolean | `true` | Title in header. |
| `minSignificantScore` | double | `0.001` | Below peak score → quiet map (no noise-scale colors). |

Scan uses loaded chunks in a circular chunk radius. Rotation with player yaw is optional. Scan cache is 45 ms. Megamap wall support is included.

## Shared pie base (`FeatureIrisChunkSharePieBase`)

Donut pie plus legend. Cap slices by legend height (3–32). Overflow goes to “Other”. Bucket cache is 45 ms. Iris helpers can resolve Iris biome names via reflection. Otherwise they use vanilla biomes. Pie subclasses in this set typically add **no** keys beyond `enabled`.

## Heatmaps

### `chunk-load-gen-cost-map`

Weighted load and gen cost per loaded chunk: `loadMS*1.0 + genMS*1.35 + loadRate*0.4 + genRate*0.7` from samplers `chunk-load-ms`, `chunk-gen-ms`, `chunks-loaded`, `chunks-generated`.

- **Class:** `FeatureChunkLoadGenCostMap` · Config: base heatmap keys only.

### `chunk-sampler-map`

Observer aggregate cost: `SampledChunk.totalScore()` per chunk.

- **Class:** `FeatureChunkSamplerMap` · Config: base only.

### `entity-pressure-heatmap`

Score: per-chunk `entities` sampler.

- **Class:** `FeatureEntityPressureHeatmap` · Config: base only.

### `redstone-activity-heatmap`

Score: per-chunk `redstone` sampler.

- **Class:** `FeatureRedstoneActivityHeatmap` · Config: base only.

### `hopper-container-throughput-map`

Score: per-chunk `hopper` sampler.

- **Class:** `FeatureHopperContainerThroughputMap` · Config: base only.

### `player-impact-overlay`

Chunk score: `totalScore + entities*0.5 + redstone*0.3 + hopper*0.2`. Overlay draws up to `maxPlayersDrawn` ranked players.

- **Class:** `FeaturePlayerImpactOverlay`

| Field | Type | Default | Description |
|---|---|---|---|
| *(base heatmap keys)* | | | |
| `maxPlayersDrawn` | int | `24` | Max players drawn on overlay. |
| `showPlayerInitials` | boolean | `true` | Show player initial letters. |

### `tick-spike-origin-replay-map`

This feature captures spike origins when `tick-time` is at or above the threshold. Heat decays over time. The Folia path region-schedules capture. It does not apply per-chunk total-score weighting.

- **Class:** `FeatureTickSpikeOriginReplayMap`

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

- **Class:** `FeaturePluginEventImpactListMap`

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `maxRowsPerTile` | int | `0` | `0` = fill height. Else rows × grid height. |

### `adapt-ability-impact-list-map`

Ranks Adapt ability detail metrics. An ability needs measured execution time to receive a row; operation count is display and tie-break metadata, not a substitute for performance cost. The feature object registers normally. `MapController` omits the renderer until the Adapt capability is present.

- **Class:** `FeatureAdaptAbilityImpactListMap`

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `maxRowsPerTile` | int | `0` | `0` = fill height. |

## Pie maps

### `plugin-event-impact-pie-map`

Pie of rolling measured plugin event-handler time. Call volume without measured time contributes no slice. Config: `enabled` only.

- **Class:** `FeaturePluginEventImpactPieMap`

### `iris-biome-chunk-share-pie-map`

Loaded chunks in the map world by biome label. `MapController` currently hard-disables this renderer id. It is not selectable. Config: `enabled` only.

- **Class:** `FeatureIrisBiomeChunkSharePieMap`

### `iris-world-chunk-share-pie-map`

Buckets Iris world groups by loaded chunks. `MapController` omits the renderer until the Iris capability is present. Config: `enabled` only.

- **Class:** `FeatureIrisWorldChunkSharePieMap`

## Capability-gated overlays

### `adapt-runtime-pressure-overlay`

Requires capability `adapt` (not a secret bundle). Score blends chunk total score with Adapt session load and measured guard-check timing-budget use. Raw ability-operation volume does not add pressure.

- **Class:** `FeatureAdaptRuntimePressureOverlay`
- **Notes:** Activated when Adapt capability is present. Config: base heatmap keys only.

### `iris-generation-pressure-overlay`

Requires capability `iris` (not secret). Scores chunks only in worlds with an Iris remote metric group.

- **Class:** `FeatureIrisGenerationPressureOverlay`
- **Notes:** Config: base heatmap keys only.

See [07 - Features - Iris Adapt & Integrations](/react/07-features-iris-adapt-integrations) for registration vs activation gating.
