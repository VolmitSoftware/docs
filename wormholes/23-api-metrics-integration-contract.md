---
title: "API - Metrics & Integration Contract"
description: "Discover Wormholes metrics through the VolmLib integration service"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Wormholes publishes metrics through VolmLib's `IntegrationServiceContract`. Use that contract when building a monitor; use PlaceholderAPI for text displays.

## Common metrics

| Key | Value |
|---|---|
| `wormholes.portals` | Managed portals |
| `wormholes.projections` | Active projections |
| `wormholes.projected-blocks` | Currently projected blocks |
| `wormholes.traversals-per-minute` | Recent traversal rate |
| `wormholes.peers-connected` | Connected network peers |
| `wormholes.transfers-sent` | Cross-server transfers sent |
| `wormholes.transfers-received` | Cross-server transfers received |

Look up `IntegrationServiceContract` through Bukkit's `ServicesManager`, select the provider whose `pluginId()` is `wormholes`, complete its handshake, then request the keys you need with `sampleMetrics(keys)`.

An unavailable metric is different from numeric zero. Preserve the contract's availability flag in your display.

This type belongs to VolmLib, so follow [VolmLib API](/volmlib/api) dependency and relocation guidance.
