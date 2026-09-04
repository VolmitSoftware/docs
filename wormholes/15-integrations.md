---
title: "Integrations"
description: "Optional plugin support and metrics"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Wormholes works without any of the plugins on this page. Install them only for the integration you need.

Public third-party surfaces are summarized in
[20 - API - Getting Started](/wormholes/20-api-getting-started). Operator
PlaceholderAPI keys are in [12 - PlaceholderAPI](/wormholes/12-placeholderapi).

## Soft dependencies

PlaceholderAPI, Iris, Vault, and Citizens are optional.

| Plugin | Role when present | When absent |
|--------|-------------------|-------------|
| PlaceholderAPI | Registers `%wormholes_…%` expansion | No placeholders |
| Vault (+ economy provider) | Portal menu travel cost type **Vault Economy** | Vault cost mode is unavailable. Free and item costs still work |
| Iris | Pre-load RTP fluid and biome probes | RTP falls back to ordinary chunk-backed biome and landing-safety checks |
| Citizens | Prevents standard tracked NPCs from relinking while a portal projection occludes their real local entity | Ordinary Bukkit entities still use the same local-occlusion path; no Citizens event hook is registered |

## WorldGuard

WorldGuard checks apply to prepared RTP destinations. Bypass access is accepted; otherwise the `ENTRY` flag decides whether the player may arrive. If WorldGuard is not installed, the destination is allowed. See [06 - Random Teleport Portals](/wormholes/06-random-teleport-portals).

## Vault travel costs

Portals can charge a vanilla item or a Vault economy amount. Configure the cost in the portal menu. Travel is free when no cost is set.

- Amount is a positive `BigDecimal`, max `1000000000000`, scale capped at 8.
- Status is `AVAILABLE` if the economy is up and the player can afford the cost.
  Status is `INSUFFICIENT` if the player cannot afford the cost. Status is
  `UNAVAILABLE` if Vault or the economy is missing. Status is `FAILED` on
  transaction failure.
- The charge is reserved before travel, committed after success, and refunded when travel fails.
- Messages cover insufficient funds, Vault unavailable, and failed transactions.
  Selecting Vault mode in the menu without Vault and an economy is rejected with
  a notice.

Vault costs are the built-in per-portal price path. Third-party plugins that
price or veto travel should use `TraversalCostProvider`
([21 - API - Traversal Cost & Events](/wormholes/21-api-traversal-cost-events)).
That path is independent of the portal menu cost types.

## Iris

When Iris is active, Wormholes can reject fluid columns and biome mismatches before loading an RTP candidate chunk. Without Iris, it uses normal chunk-backed biome and landing-safety checks.

## Citizens

Wormholes keeps standard Citizens NPCs hidden when a portal projection occludes their local entity. Packet-mode NPCs that bypass Bukkit entity tracking are not changed.

## PlaceholderAPI

See [12 - PlaceholderAPI](/wormholes/12-placeholderapi) for keys, selection, and
formats. See [22 - API - PlaceholderAPI](/wormholes/22-api-placeholderapi) for
integrator notes. Expansion identifier: `wormholes`.

## React / IntegrationServiceContract

React and other monitors can read Wormholes metrics through VolmLib without a direct dependency. Metric keys and integration details are in [23 - API - Metrics & Integration Contract](/wormholes/23-api-metrics-integration-contract).

## bStats

Wormholes uses bStats plugin ID **33193**. It reports `total_portals`, `portals_by_type`, `cross_server`, `wire_compression`, and `connected_peers`. Disable collection through the server-wide bStats configuration.

## What has no soft-depend integration

Projection internals, portal CRUD, wire protocol, RTP destination selection, and
dimensional-door pocket APIs are not exposed. See "What has no API" in
[20 - API - Getting Started](/wormholes/20-api-getting-started).
