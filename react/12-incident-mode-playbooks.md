---
title: "Incident Mode & Playbooks"
description: "React documentation: Incident Mode & Playbooks"
published: true
date: 2026-10-07T13:18:48.707Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
The `incident-score` sampler combines eight pressure signals into a 0–100 value. `incident-mode` applies event-rate limits while that pressure lasts. `action-incident-playbook` runs relevant mitigations sequentially while pressure persists.

## Incident score

Each input is scaled between its listed minimum and maximum, clamped to 0–1, and multiplied by its weight. An unavailable sampler is dropped and the remaining weights are renormalized, so a missing reading never scores as healthy. Only positive backlog growth counts.

| Sampler | Normalization range | Weight |
|---|---:|---:|
| `tick-ms-p95` | 50–150 ms | 30% |
| `tick-spike-rate` | 5–120 spikes/min | 15% |
| `gc-time-percent` | 2–25% | 10% |
| `scheduler-backlog` | 10–300 jobs | 12% |
| `backlog-growth-rate` | 1–80 jobs/s | 8% |
| `player-ping-p95` | 80–350 ms | 10% |
| `top-chunk-cost` | 2–25 ms | 8% |
| `redstone-burst-rate` | 2–80 bursts/min | 7% |

`%react_health%` is `100 - incident-score`, clamped to 0–100.

## Feature `incident-mode`

The feature waits for its 60-second startup grace. It then enters when `incident-score >= 58` or `tick-time >= 60 ms`. It stays active for at least eight seconds. It exits only when tick time is at most 46 ms and incident score is at most 35.

During each one-second rate window it allows the configured number of events. It then applies these limits:

| Path | Default limit | Enforcement | Near-player bypass |
|---|---:|---|---|
| Spawner and trial-spawner spawns | 28 | Cancel excess spawns | No |
| Natural, nether-portal, reinforcement, jockey, patrol, and raid spawns | 70 | Cancel excess spawns | No |
| Player and entity portal events | 18 | Cancel excess events | Yes, 14 blocks by default |
| Hopper inventory moves | 120 | Cancel excess moves | Yes, 14 blocks by default |
| Redstone transitions | 220 | Restore the old current | Yes, 14 blocks by default |

The complete field and default table is in [06 - Features - Governors & Mechanics](/react/06-features-governors-mechanics). Incident mode is its own limiter. Other governors continue to evaluate their own pressure gates.

Incident entry stores the exact score evidence, tick-time trigger, thresholds, strongest measured contributor, severity, and activated guardrails. Resolution stores whether the feature recovered or was disabled and the counts of blocked spawns, portal events, hopper moves, and redstone transitions. These counters are atomic runtime aggregates; React does not allocate or persist one record per blocked event.

## Structured incident history

The `incident` controller retains up to 256 structured events and atomically persists them to `plugins/React/incidents.json` by default. `plugins/React/core/incident.toml` controls persistence and retention. Startup loads the current canonical file; there is no legacy timeline migration.

`GET /api/v1/incidents?limit=20` returns newest events first together with the current atomic score snapshot and Incident Mode state. Each event includes its incident and event IDs, kind, phase, severity, occurrence and start time, source, title, summary, cause, optional world location, evidence, mitigation actions, and context values. Circuit Manager records its selected component, bounds, current-window events, global redstone event span, threshold, and fixed throttle. Trinity coordination records engagement, recovery, Iris and Adapt trigger evidence, guard activation, and playbook queue or terminal status.

React Web's Incident Center refreshes this endpoint every five seconds. Its current diagnosis ranks available contributors by actual score points, its factor bars show normalized pressure rather than static configured weight, and its history cards render the stored cause, location, evidence, action outcome, and context without parsing console text.

## Action `action-incident-playbook`

Run `/react action incident-playbook [include-gc=false] [tier=-1] [world=ALL]` (alias `aip`). The auto tier is severe (`2`) at incident score 70 or tick time 75 ms. The auto tier is medium (`1`) at score 45 or tick time 58 ms. The auto tier is mild (`0`) otherwise.

With default parameters, the playbook continues only while incident score is at least 35 or tick time is at least 48 ms. It selects enabled stages in order: hopper normalization where hopper activity meets the tier threshold, entity trimming where a chunk holds at least 80 entities, then quarantine where chunk cost meets the tier threshold. With `world=ALL`, each stage targets the world with the strongest matching evidence. Each stage runs at most once.

The parent ticket waits for the active stage to finish, then waits at least two seconds and for available incident telemetry to refresh before selecting another stage. Recovery or unavailable pressure ends the playbook without further mitigation. A stage failure, cancellation, or 60-second timeout stops escalation; stopping the parent also stops its child. The completion count includes successful stages only.

Hopper normalization does not unload chunks, and quarantine does not cull entities or expand to neighboring chunks. Prewarming is excluded. Garbage collection is disabled by default; `include-gc=true` permits it only when heap use is at least 90%, estimated reclaimable heap is at least 10% of maximum heap, and GC time is below 2%.

| Tier | Quarantine | Entity trim | Hopper normalize |
|---|---|---|---|
| 0 mild | 16 chunks, score 100, player radius 64 | 300 total, 8/chunk, age 8 min | 12 chunks, 30 updates/chunk, 36 merges |
| 1 medium | 28 chunks, score 80, player radius 56 | 600 total, 12/chunk, age 5 min | 20 chunks, 25 updates/chunk, 48 merges |
| 2 severe | 42 chunks, score 60, player radius 48 | 1,000 total, 16/chunk, age 3 min | 32 chunks, 18 updates/chunk, 64 merges |

The action defaults and full parameter objects are in [09 - Actions Catalog](/react/09-actions-catalog).

## Trinity coordination

The secret `feature-trinity-incident-mode` requires registered Iris and Adapt capabilities. Its trigger and dependent-feature behavior are in [07 - Features - Iris Adapt & Integrations](/react/07-features-iris-adapt-integrations).
