---
title: "Features - Maps & Overlays"
description: "React documentation: Features - Maps & Overlays"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Heatmaps, pie maps, list maps, and pressure overlays render on Minecraft maps. Open with `/react map`. Config: `plugins/React/feature/<id>.toml`.

## Shared heatmap settings

All heatmaps and overlays below inherit these fields unless noted.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Feature on/off. |
| `chunkPixelSize` | int | `5` | Pixels per chunk cell (zoom). |
| `mapRadiusChunks` | int | `0` | `0` = derive from view distance. Else a fixed radius. |
| `drawCenterMarker` | boolean | `true` | Crosshair at anchor. |
| `drawLabel` | boolean | `true` | Title in header. |
| `minSignificantScore` | double | `0.001` | Below peak score → quiet map (no noise-scale colors). |

In-game heatmaps face north. X increases east/right and Z increases south/down. Unloaded, quiet, measured, center, and MCA-boundary chunks use distinct markings.

React Web shows the selected heatmap on a pan-and-zoom coordinate plane. Close views show individual chunks; wider views group them into larger cells. Spawn and world-border controls can recenter the map.

Selecting a square shows its center as `world X Z`; grouped cells use the center of the represented area. Admins can choose an online player and confirm a safe teleport inside that chunk. The destination may load or generate the chunk.

The coordinate-grid API is a clean break. Detail queries use `centerChunkX`, `centerChunkZ`, and `radius`; the former ambiguous `centerX` and `centerZ` parameters are not accepted. `radius` is bounded to 1–1,875,000 chunks, and invalid requests receive HTTP 400 instead of being silently clamped.

## Shared pie settings

Pie maps use a donut chart and a 3–32-row legend. Extra slices are grouped as “Other”. Iris biome names are used when available; otherwise the map uses vanilla names.

## Heatmaps

### `chunk-load-gen-cost-map`

Where chunk loading and generation is costing the most time. Built from the `chunk-load-ms`,
`chunk-gen-ms`, `chunks-loaded`, and `chunks-generated` samplers.

### `chunk-sampler-map`

Observer aggregate cost: `SampledChunk.totalScore()` per chunk.

### `entity-pressure-heatmap`

Score: per-chunk `entities` sampler.

### `redstone-activity-heatmap`

Score: per-chunk `redstone` sampler.

### `hopper-container-throughput-map`

Score: per-chunk `hopper` sampler.

### `player-impact-overlay`

Chunk cost with the ranked players drawn on top, so you can see who is standing in the expensive
part of the world.

| Field | Type | Default | Description |
|---|---|---|---|
| *(base heatmap keys)* | | | |
| `maxPlayersDrawn` | int | `24` | Max players drawn on overlay. |
| `showPlayerInitials` | boolean | `true` | Show player initial letters. |

### `tick-spike-origin-replay-map`

Captures where tick spikes originate whenever `tick-time` crosses the threshold, and draws them as decaying heat, so a repeated spike shows up as a hot chunk rather than a number in a log.

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

Share of loaded chunks by Iris biome. The distribution fills in as React samples loaded chunks and
stays current as they load and unload.

The feature and renderer require the live `iris` capability, so non-Iris servers schedule no biome sampling and do not show the map. With Iris available, the renderer is selectable. Config: `enabled` only.

### `iris-world-chunk-share-pie-map`

Buckets Iris world groups by loaded chunks. `MapController` omits the renderer until the Iris capability is present. Config: `enabled` only.

## Capability-gated overlays

### `adapt-runtime-pressure-overlay`

Requires capability `adapt` (not a secret bundle). Score blends chunk total score with Adapt session load and measured guard-check timing-budget use. Raw ability-operation volume does not add pressure.

### `iris-generation-pressure-overlay`

Requires capability `iris` (not secret). Scores chunks only in worlds with an Iris remote metric group.

See [07 - Features - Iris Adapt & Integrations](/react/07-features-iris-adapt-integrations) for registration vs activation gating.
