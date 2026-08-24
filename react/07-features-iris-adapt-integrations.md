---
title: "Features - Iris Adapt & Integrations"
description: "React documentation: Features - Iris Adapt & Integrations"
published: true
date: 2026-08-23T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
This page covers capability-gated surge guards and multi-plugin incident coordination. Iris and Adapt **map** overlays are in [05 - Features - Maps & Overlays](/react/05-features-maps-overlays).

Use `/react integration status` for live capability status. Global `integrationSecretsEnabled` (default `false`) gates **secret** feature bundles.

## Integration model

- `IntegrationController` / `ReactIntegrationService` discover peer plugins and publish mirrored metrics. Prefixes: `iris-`, `adapt-`, `wormholes-`, `gloss-`, `hiddenore-`, `biletools-`. See [10 - Samplers & Metrics](/react/10-samplers-metrics).
- `CapabilityGatedFeature` declares `requiredCapabilities()` and optional `isSecretBundle()`.
- `ReactCapabilityFeature.autoRegister()`:
  - secret + `!integrationSecretsEnabled` → do not register
  - missing required plugin install → do not register
- `FeatureController` re-checks activation every two seconds. With a live integration controller, capability requires an accepting or healthy metrics node. Installed-plugin detection is only the fallback when that controller is unavailable.
- Secret features only appear under `plugins/React/feature/` after they successfully register. That requires secrets on and the plugins present.
- Adapt ability-operation volume remains neutral telemetry and never creates an integration-timeline alert by itself. React alerts only after three consecutive samples where Adapt's measured rolling guard-check timing budget is at least 100 percent and server MSPT is at least 50 milliseconds; either signal recovering resets the streak. The current operation rate remains in the alert as context, not as a trigger.

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

- **Class:** `FeatureAdaptRuntimeSurgeGuard`
- **Listener:** yes

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

Requires `iris`. Secret: yes. When surging, this feature limits moves and teleports into ungenerated chunks. Bypass: `react.secret.iris.bypass`.

- **Class:** `FeatureIrisTerrainSurgeGuard`
- **Listener:** yes

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `tickIntervalMS` | int | `1000` | Evaluation interval (ms). |
| `triggerTickMS` | double | `56` | Tick-time trigger (ms). |
| `triggerIrisPregenQueue` | double | `280` | Iris pregen queue trigger. |
| `triggerIrisGenerationMS` | double | `24` | Iris generation ms trigger. |
| `windowMS` | int | `2500` | Rate window (ms). |
| `maxUngeneratedChunkMovesPerWindow` | int | `10` | Max ungenerated chunk moves per window. |
| `maxUngeneratedChunkTeleportsPerWindow` | int | `4` | Max ungenerated chunk teleports per window. |
| `messageCooldownMS` | long | `2500` | Message cooldown (ms). |
| `bypassPermission` | String | `react.secret.iris.bypass` | Bypass permission. |

### `feature-trinity-incident-mode`

Requires `iris` **and** `adapt`. Secret: yes. It enters when either Iris or Adapt reports pressure. It also needs tick time or incident score at the configured threshold. On entry it activates each enabled incident, quarantine, and surge-guard feature. It queues `action-incident-playbook` on a cooldown. Each activated feature still evaluates its own engagement gates.

- **Class:** `FeatureTrinityIncidentMode`

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `tickIntervalMS` | int | `1000` | Evaluation interval (ms). |
| `enterIncidentScore` | double | `62` | Incident score enter threshold. |
| `enterTickMS` | double | `62` | Tick ms enter threshold. |
| `enterIrisQueue` | double | `340` | Iris pregen queue pressure threshold. |
| `enterAdaptSessionLoad` | double | `72` | Adapt session-load pressure threshold. |
| `enterAdaptAbilityTimingBudgetPercent` | double | `100` | Adapt measured guard-check timing-budget pressure threshold. |
| `minimumEngageMS` | int | `12000` | Minimum engage duration (ms). |
| `playbookCooldownMS` | int | `20000` | Min time between playbook queues (ms). |
| `verboseTransitions` | boolean | `true` | Log engage/release transitions. |

## Operator enable checklist (secret path)

1. Install and enable Iris and/or Adapt as needed.
2. Set `integrationSecretsEnabled = true` in global React config.
3. Restart React or run a full `/react reload` so the feature registry is rebuilt.
4. Confirm TOMLs under `plugins/React/feature/` and `enabled = true`.
5. Confirm integration metrics healthy via `/react integration status`.
6. Trinity needs **both** Iris and Adapt. Single-cap surge guards need their own plugin.
