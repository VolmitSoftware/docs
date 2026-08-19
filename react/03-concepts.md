---
title: "Concepts"
description: "React documentation: Concepts"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
React content is registered into four primary catalogs: **features**, **tweaks**, **actions**, and **samplers**. Every registered object has a stable string id and may have a TOML config under `plugins/React/<category>/<id>.toml`. Features, tweaks, and actions have an `enabled` flag. Samplers do not.

## Categories

| Kind | Config category | Role | Lifecycle |
|------|-----------------|------|-----------|
| Feature | `feature` | Optional performance/gameplay systems, maps, governors | Activate or deactivate. Optional tick interval |
| Tweak | `tweak` | Lighter event or NMS accelerations | Activate or deactivate. Optional tick |
| Action | `action` | Operator-invoked one-shot jobs | Create ticket → run with params |
| Sampler | `sampler` | Metrics | Sample on demand or on schedule. Feed monitors, maps, and PlaceholderAPI |

Controllers under `art.arcane.react.core.controller` own the content registries. They also own protection, map, player, job, integration, event, hotload, and configuration lifecycles. Controller configuration uses `plugins/React/core/<controller-id>.toml`.

## Config loading

`Registered.loadConfiguration()` loads:

1. Canonical: `plugins/React/<category>/<id>.toml`
2. Legacy: `plugins/React/<category>/<id>.json` (migration)

React creates missing files from Java field defaults. Fields are documented with `@ConfigDoc` (value + impact). Those fields surface in the in-game config GUI.

## Enable model

- Base classes `ReactFeature`, `ReactTweak`, and `ReactAction` define `enabled`. The field default is `true`.
- Exception: tweak `shorthands` calls `setEnabled(false)` in its constructor. It stays off until you set `enabled = true` in TOML. React still forces it off at activation when EssentialsX or CMI is installed. The configured value does not override that guard.
- Some features call `setEnabled(false)` at runtime when required platform APIs or NMS bridges are missing. Examples include pathfinder budget without navigation bridges, dynamic view distance without Paper world distance setters, and AFK view shedding without send-view-distance methods.
- Disabling keeps the config file. The component does not activate. Actions do not appear in normal queues.
- Capability-gated secret features also require peer plugins and `integrationSecretsEnabled`.

## Observation and sampling

- Samplers that nothing consumes can remain idle (sleep-when-unobserved).
- Monitors, maps, and PlaceholderAPI mark samplers live after first use. PlaceholderAPI publishes demanded values on its one-second snapshot cadence.
- Features often call `sample(samplerId)` with a fallback when reading pressure. Pressure examples include tick time, incident score, and entity counts.

## Protection

Entity mutation paths consult the protection controller. Those paths include stack, trim, purge, sleep, and despawn. Third parties declare rules via `ReactProtection` / `ReactProtectionProvider`. See [17 - API - Entity Protection](/react/17-api-entity-protection). React does not call plugins per-entity for protection decisions on the hot path.

## NMS bridges

Some features and tweaks require version-specific NMS hooks from `bridge-api`. If a bridge does not resolve, the component fails closed or stays passive to vanilla behavior. React logs that failure once. Operators check `/react bridge status`. Details: [14 - NMS Bridges & Platform Notes](/react/14-nms-bridges-platform-notes).

## Incident score

Sampler `incident-score` aggregates pressure. Feature `incident-mode` and action `action-incident-playbook` use it. They support automated or operator-driven response. See [12 - Incident Mode & Playbooks](/react/12-incident-mode-playbooks).


## Naming

Ids are lowercase kebab-case (`mob-stacking`, `fast-fluids`). Display names are humanized from the id. Action ids sometimes keep an `action-` prefix in the registry. CLI subcommands use the short name. Example: `quarantine-hot-chunks` for `action-quarantine-hot-chunks`.
