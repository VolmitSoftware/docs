---
title: "Concepts"
description: "React documentation: Concepts"
published: true
date: 2026-08-25T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
React groups its tools into features, tweaks, actions, and samplers.

| Kind | Config path | Use |
|---|---|---|
| Feature | `plugins/React/feature/<id>.toml` | Optional performance or gameplay system |
| Tweak | `plugins/React/tweak/<id>.toml` | Small behavior or performance adjustment |
| Action | `plugins/React/action/<id>.toml` | Operator-run job |
| Sampler | `plugins/React/sampler/<id>.toml` when configurable | Metric used by monitors, maps, placeholders, and integrations |

## Enable or disable content

Features, tweaks, and actions use an `enabled` setting. Some stay inactive when the server lacks a required API, bridge, or plugin. React reports that state in commands and logs.

Disabling content keeps its config file. It stops future work but does not undo world changes already made.

## Monitoring-only mode

`/react monitoring-only` pauses non-renderer features and tweaks without changing their config files. Monitoring, maps, samplers, integrations, and manual actions remain available. The mode resets after a full restart.

## Protection

Entity operations respect React protection rules for stacking, trimming, purging, sleeping, and despawning. Plugin developers can add rules through the [Entity Protection API](/react/17-api-entity-protection).

## Bridges

Some features need a bridge for the current Minecraft version. If a bridge is unavailable, the feature stays passive or measurement-only. Check `/react bridge status`.

## Incident mode

The `incident-score` sampler drives automated and manual incident responses. See [Incident Mode & Playbooks](/react/12-incident-mode-playbooks).
