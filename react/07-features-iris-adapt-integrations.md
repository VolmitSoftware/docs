---
title: "Features - Iris Adapt & Integrations"
description: "React documentation: Features - Iris Adapt & Integrations"
published: true
date: 2026-09-30T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
React coordinates capability-gated surge guards and multi-plugin incidents. Iris and Adapt **map** overlays are in [05 - Features - Maps & Overlays](/react/05-features-maps-overlays).

Use `/react integration status` for live capability status. Global `integrationSecretsEnabled` (default `false`) gates **secret** feature bundles.

## Integration model

A feature that needs Iris or Adapt registers only when that plugin is present, and React rechecks
every two seconds. Secret bundles also need `integrationSecretsEnabled = true`; saving that setting
applies it without a restart. Their config files appear under `plugins/React/feature/` as soon as
the required plugin is installed, even while secrets are off.

Adapt's ability-operation rate is telemetry and never raises an alert on its own. React alerts only
after three consecutive samples where Adapt's measured guard-check timing budget is at or above 100
percent *and* server MSPT is at or above 50 ms. Either signal recovering resets the streak.

## Map overlays (cross-ref)

| Id | Capability | Secret |
|----|------------|--------|
| `adapt-runtime-pressure-overlay` | `adapt` | no |
| `iris-generation-pressure-overlay` | `iris` | no |
| `adapt-ability-impact-list-map` | `adapt` renderer availability | no |
| `iris-biome-chunk-share-pie-map` | `iris` | no |
| `iris-world-chunk-share-pie-map` | `iris` renderer availability | no |

## Secret gated features

### `feature-adapt-runtime-surge-guard`

Requires `adapt`. Secret: yes. While surging, this feature rate-limits player interact, combat, and consume events. Bypass: `react.secret.adapt.bypass`.

Container previews and remote-access permission checks do not consume the player's interaction allowance.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `tickIntervalMS` | int | `1000` | Evaluation interval (ms). |
| `triggerTickMS` | double | `58` | Tick-time surge trigger (ms). |
| `triggerSessionLoadPercent` | double | `70` | Adapt session-load surge trigger. |
| `triggerAbilityTimingBudgetPercent` | double | `100` | Measured Adapt guard-check timing-budget trigger. |
| `windowMS` | int | `1800` | Rate-limit window (ms). |
| `maxInteractionsPerWindow` | int | `8` | Max interactions per window. |
| `maxCombatOpsPerWindow` | int | `10` | Max combat ops per window. |
| `maxConsumeOpsPerWindow` | int | `4` | Max consume ops per window. |
| `messageCooldownMS` | long | `2200` | Throttle message cooldown (ms). |
| `bypassPermission` | String | `react.secret.adapt.bypass` | Bypass permission. |

### `feature-iris-terrain-surge-guard`

Requires `iris`. Secret: yes. A world is surging while tick time reaches `triggerTickMS`, while that world's Iris generation time reaches `triggerIrisGenerationMS`, or while an Iris pregeneration of that world has at least `triggerIrisPregenInFlight` chunk requests in flight and tick time reaches `triggerIrisPregenTickMS`. A pregeneration on a server that keeps up with its ticks never makes a world surge. While a world is surging, this feature limits moves and teleports into its ungenerated chunks. Movement inside one chunk is never checked. Each world's surge state is re-evaluated at most once per second. Bypass: `react.secret.iris.bypass`.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `tickIntervalMS` | int | `1000` | Evaluation interval (ms). |
| `triggerTickMS` | double | `56` | Tick-time trigger (ms). |
| `triggerIrisPregenInFlight` | int | `4` | Iris pregeneration chunk requests in flight for this world that make it surge while tick time also reaches `triggerIrisPregenTickMS`. Clamped to `1`-`256`. |
| `triggerIrisPregenTickMS` | double | `50` | Tick time in milliseconds that must also be reached before `triggerIrisPregenInFlight` makes a world surge. Clamped to `1`-`1000`. |
| `triggerIrisGenerationMS` | double | `24` | Iris generation ms trigger. |
| `windowMS` | int | `2500` | Rate window (ms). |
| `maxUngeneratedChunkMovesPerWindow` | int | `10` | Max ungenerated chunk moves per window. |
| `maxUngeneratedChunkTeleportsPerWindow` | int | `4` | Max ungenerated chunk teleports per window. |
| `messageCooldownMS` | long | `2500` | Message cooldown (ms). |
| `bypassPermission` | String | `react.secret.iris.bypass` | Bypass permission. |

### `feature-trinity-incident-mode`

Requires `iris` **and** `adapt`. Secret: yes. It enters when Iris or Adapt pressure coincides with server pressure. Iris pressure is a pregeneration with at least `enterIrisPregenInFlight` chunk requests in flight. Adapt pressure is session load at `enterAdaptSessionLoad` or a guard-check timing budget at `enterAdaptAbilityTimingBudgetPercent`. Server pressure is tick time at `enterTickMS` or incident score at `enterIncidentScore`. On entry it activates each enabled incident, quarantine, and surge-guard feature. It queues `action-incident-playbook` on a cooldown. Each activated feature still evaluates its own engagement gates.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `tickIntervalMS` | int | `1000` | Evaluation interval (ms). |
| `enterIncidentScore` | double | `62` | Incident score enter threshold. |
| `enterTickMS` | double | `62` | Tick ms enter threshold. |
| `enterIrisPregenInFlight` | int | `4` | Iris pregeneration chunk requests in flight that count as Iris pressure. Clamped to `1`-`256`. |
| `enterAdaptSessionLoad` | double | `72` | Adapt session-load pressure threshold. |
| `enterAdaptAbilityTimingBudgetPercent` | double | `100` | Adapt measured guard-check timing-budget pressure threshold. |
| `minimumEngageMS` | int | `12000` | Minimum engage duration (ms). |
| `playbookCooldownMS` | int | `20000` | Min time between playbook queues (ms). |
| `verboseTransitions` | boolean | `true` | Log engage/release transitions. |

Iris keeps at least 4 chunk requests in flight while a pregeneration runs on a server with 1 GB of heap or more, even when it slows the pregeneration down because chunks load slowly. A paused or stopped pregeneration has none. The default `4` for `enterIrisPregenInFlight` and `triggerIrisPregenInFlight` therefore counts any running pregeneration and ignores a paused one. Raise them to count only a pregeneration running at higher concurrency; Iris allows up to 256 requests in flight on Paper and up to 192 on Folia, and at most one request per 256 MB of heap.

## Enable secret integrations

1. Install Iris and/or Adapt as needed, then start the server with those plugins enabled.
2. Set `integrationSecretsEnabled = true` in `react.toml`.
3. Save the file. React applies the setting automatically.
4. Set `enabled = true` in the relevant TOML files under `plugins/React/feature/`.

Use `/react integration status` to see whether the required integrations are available. Trinity needs both Iris and Adapt. Each surge guard needs its corresponding plugin.
