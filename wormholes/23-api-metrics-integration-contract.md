---
title: "API - Metrics & Integration Contract"
description: "Discover Wormholes metrics through the VolmLib integration service"
published: true
date: 2026-09-06T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Wormholes publishes metrics through VolmLib's `IntegrationServiceContract`. Use that contract when building a monitor. Use PlaceholderAPI for text displays.

## Common metrics

| Key | Value |
|---|---|
| `wormholes.portals` | Managed portals |
| `wormholes.projections-active` | Active projections |
| `wormholes.block-changes-per-second` | Projection block changes per second |
| `wormholes.traversals-per-minute` | Recent traversal rate |
| `wormholes.peers-connected` | Connected network peers |
| `wormholes.transfers-in-flight` | Pending admissions, dispatched players awaiting destination receipts, and non-player entity transfers in progress |
| `wormholes.transfers-failed-total` | Cumulative traversal failures, including denied admissions and unconfirmed arrivals |

Player transfers remain in flight until an arrival receipt or the 60-second confirmation deadline. Only confirmed arrivals increment the network traversal service's completed count.

Look up `IntegrationServiceContract` through Bukkit's `ServicesManager`, select the provider whose `pluginId()` is `wormholes`, complete its handshake, then request the keys you need with `sampleMetrics(keys)`.

An unavailable metric is different from numeric zero. Preserve the contract's availability flag in your display.

This type belongs to VolmLib, so follow [VolmLib API](/volmlib/api) dependency and relocation guidance.
