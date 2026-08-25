---
title: "Incident Mode & Playbooks"
description: "React documentation: Incident Mode & Playbooks"
published: true
date: 2026-08-25T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
The `incident-score` sampler combines eight pressure signals into a 0–100 value. `incident-mode` applies event-rate limits while that pressure lasts. `action-incident-playbook` queues a separate set of cleanup and recovery actions.

## Incident score

React captures all eight inputs once into one immutable score snapshot. The API score, current contributor list, and incident entry decision use that same snapshot. Each available input is linearly normalized between the listed minimum and maximum, clamped to 0–1, and multiplied by its effective weight. If a sampler is unavailable, React marks it unavailable and renormalizes the remaining weights instead of treating an unsupported value as a healthy zero. React uses positive backlog growth; negative growth contributes zero.

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

Run `/react action incident-playbook [include-gc=true] [tier=-1] [world=ALL]` (alias `aip`). The auto tier is severe (`2`) at incident score 70 or tick time 75 ms. The auto tier is medium (`1`) at score 45 or tick time 58 ms. The auto tier is mild (`0`) otherwise.

The playbook tries to queue registered quarantine, trim, hopper-normalization, prewarm, and optional GC tickets. It then completes its own ticket at once. The action controller ignores disabled child actions. The playbook still counts that queue attempt in its completion total. Accepted child actions may overlap. This is queue orchestration, not a sequential transaction.

| Tier | Quarantine | Entity trim | Hopper normalize | Prewarm |
|---|---|---|---|---|
| 0 mild | 16 chunks, score 100, player radius 64 | 300 total, 8/chunk, age 8 min | 12 chunks, 30 updates/chunk, 36 merges | 20 chunks, radius 1 |
| 1 medium | 28 chunks, score 80, player radius 56 | 600 total, 12/chunk, age 5 min | 20 chunks, 25 updates/chunk, 48 merges | 32 chunks, radius 1 |
| 2 severe | 42 chunks, score 60, player radius 48 | 1,000 total, 16/chunk, age 3 min | 32 chunks, 18 updates/chunk, 64 merges | 48 chunks, radius 2 |

The action defaults and full parameter objects are in [09 - Actions Catalog](/react/09-actions-catalog).

## Trinity coordination

The secret `feature-trinity-incident-mode` requires registered Iris and Adapt capabilities. Its trigger and dependent-feature behavior are in [07 - Features - Iris Adapt & Integrations](/react/07-features-iris-adapt-integrations).
