---
title: "API - Metrics & Integration Contract"
description: "Discover Wormholes metrics through the VolmLib integration service"
published: true
date: 2026-09-30T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Wormholes serves authenticated HTTP metrics on Bukkit, Fabric, Forge, and NeoForge. Bukkit integrations can also query VolmLib's `IntegrationServiceContract` or use PlaceholderAPI for text displays.

## HTTP endpoint

Enable `[ops.console]` in `wormholes.toml` and set a nonempty bearer token:

```toml
[ops.console]
enabled = true
bind = "127.0.0.1"
port = 8905
token = "replace-with-a-secret-token"
history-minutes = 30
```

The endpoint is disabled by default. Apply changes with `/wh reload`. `GET /metrics` returns OpenMetrics text; `GET /snapshot` returns JSON with `generatedAtMillis`, `metrics`, `peers`, `failures`, and `history`. Send `Authorization: Bearer <token>` on every request. Missing or incorrect credentials return HTTP 401. History contains one sample per second, retained for the configured 1–1440 minutes.

```sh
curl -H "Authorization: Bearer $WORMHOLES_METRICS_TOKEN" http://127.0.0.1:8905/snapshot
```

Native loaders publish portal count, active projections, connected player count (`wormholes.players`), mean tick duration (`wormholes.tick-milliseconds`), and connected peer count when networking is active. Peer entries include transport, compression, connection state, and RTT. Failure entries report travel-cost failures. Metrics unavailable on the active platform are omitted.

## Bukkit integration metrics

| Key | Value |
|---|---|
| `wormholes.portals` | Managed portals |
| `wormholes.projections-active` | Active projections |
| `wormholes.projection-observers` | Distinct players currently watching at least one projection |
| `wormholes.block-changes-per-second` | Projection block changes per second |
| `wormholes.traversals-per-minute` | Portal traversals completed in the last 60 seconds |
| `wormholes.peers-connected` | Connected network peers |
| `wormholes.peer-rtt-max-ms` | Highest round-trip time among handshaken peers; unavailable when no peer has completed a handshake |
| `wormholes.compression-ratio-out` | Outbound wire-to-raw byte ratio over the most recent second; unavailable while nothing is sent |
| `wormholes.plate-builds-per-second` | Projection view plates built per second |
| `wormholes.plate-bytes` | Estimated memory held by cached projection view plates |
| `wormholes.block-entities-per-second` | Projected block-entity updates sent to viewers per second |
| `wormholes.transfers-in-flight` | Pending admissions, dispatched players awaiting destination receipts, and non-player entity transfers in progress |
| `wormholes.transfers-failed-total` | Cumulative traversal failures, including denied admissions and unconfirmed arrivals |

Player transfers remain in flight until an arrival receipt or the 60-second confirmation deadline. Only confirmed arrivals increment the network traversal service's completed count.

Look up `IntegrationServiceContract` through Bukkit's `ServicesManager`, select the provider whose `pluginId()` is `wormholes`, complete its handshake, then request the keys you need with `sampleMetrics(keys)`.

An unavailable metric is different from numeric zero. Preserve the contract's availability flag in your display.

This type belongs to VolmLib, so follow [VolmLib API](/volmlib/api) dependency and relocation guidance.
