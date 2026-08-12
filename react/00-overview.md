---
title: "Overview"
description: "React documentation: Overview"
published: true
date: 2026-08-12T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
React is a runtime performance and monitoring plugin for Paper, Purpur, and Folia. It samples the server, runs optional features and tweaks that bound lag sources, exposes operator actions for incidents, and renders monitors and maps in-game.

## Feature Map

- **Samplers** — metrics for tick time, entities, hoppers, redstone, memory, cross-plugin integrations, and more. See [10 - Samplers & Metrics](/react/10-samplers-metrics).
- **Features** — optional systems covering entities, maps, governors, world mechanics, and integrations. See [04 - Features - Entity Systems](/react/04-features-entity-systems), [05 - Features - Maps & Overlays](/react/05-features-maps-overlays), [06 - Features - Governors & Mechanics](/react/06-features-governors-mechanics), and [07 - Features - Iris Adapt & Integrations](/react/07-features-iris-adapt-integrations).
- **Tweaks** — lighter event/NMS accelerations (fluids, fire, shorthands, hardstops). See [08 - Tweaks Catalog](/react/08-tweaks-catalog).
- **Actions** — operator one-shots (purge, quarantine, incident playbook). See [09 - Actions Catalog](/react/09-actions-catalog).
- **Monitors and maps** — action bar, map GUI, heatmaps. See [11 - Monitors Maps & In-Game GUI](/react/11-monitors-maps-in-game-gui).
- **Incident mode** — score-driven posture and playbooks. See [12 - Incident Mode & Playbooks](/react/12-incident-mode-playbooks).
- **Public plugin API** — entity protection, metric publishing, and PlaceholderAPI. See [16 - API - Getting Started](/react/16-api-getting-started), [17 - API - Entity Protection](/react/17-api-entity-protection), [18 - API - Metric Publishing](/react/18-api-metric-publishing), and [19 - API - PlaceholderAPI](/react/19-api-placeholderapi).

## Documentation Index

| File | Covers |
|------|--------|
| [00 - Overview](/react/00-overview) | This file |
| [01 - Installation & Configuration](/react/01-installation-configuration) | Install, data folder, global config |
| [02 - Commands & Permissions](/react/02-commands-permissions) | `/react` tree, permissions, shorthands |
| [03 - Concepts](/react/03-concepts) | Registries, TOML layout, enable model |
| [04 - Features - Entity Systems](/react/04-features-entity-systems) | Entity features |
| [05 - Features - Maps & Overlays](/react/05-features-maps-overlays) | Map/overlay features |
| [06 - Features - Governors & Mechanics](/react/06-features-governors-mechanics) | Governors and world mechanics |
| [07 - Features - Iris Adapt & Integrations](/react/07-features-iris-adapt-integrations) | Capability-gated features |
| [08 - Tweaks Catalog](/react/08-tweaks-catalog) | All tweaks |
| [09 - Actions Catalog](/react/09-actions-catalog) | All actions |
| [10 - Samplers & Metrics](/react/10-samplers-metrics) | Sampler ids and observation model |
| [11 - Monitors Maps & In-Game GUI](/react/11-monitors-maps-in-game-gui) | Action bar, maps, in-game config UI |
| [12 - Incident Mode & Playbooks](/react/12-incident-mode-playbooks) | Incident score and response |
| [13 - Localization](/react/13-localization) | Locales and overrides |
| [14 - NMS Bridges & Platform Notes](/react/14-nms-bridges-platform-notes) | Bridges, Folia, jar workflow |
| [15 - Operator Runbooks & Smoke Tests](/react/15-operator-runbooks-smoke-tests) | Manual checklists |
| [16 - API - Getting Started](/react/16-api-getting-started) | Third-party dependency setup |
| [17 - API - Entity Protection](/react/17-api-entity-protection) | Protection API |
| [18 - API - Metric Publishing](/react/18-api-metric-publishing) | Metrics API |
| [19 - API - PlaceholderAPI](/react/19-api-placeholderapi) | `%react_…%` keys |

Docs `00`–`15` are for operators; `16`–`19` are for plugin developers.

## Project Layout

| Path | Contents |
|------|----------|
| `React/React/src/main/java/art/arcane/react/` | Plugin main, content, controllers, API |
| `content/feature`, `tweak`, `action`, `sampler` | Registered content |
| `content/directorcommand` | `/react` command tree |
| `core/controller` | Lifecycle controllers |
| `api/protect`, `api/metric` | Public third-party API |
| `bridge-api/`, `nms/` | NMS bridge interfaces and version impls |

## Building

From `React/React/`, use Java 25:

```
./gradlew build
./gradlew test
./gradlew shadowJar
```

The shaded plugin jar is written under `React/React/build/libs/`. The version suffix tracks the Minecraft API React was built against (for example `2.0.0-26.2`).
