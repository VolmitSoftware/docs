---
title: "Integrations"
description: "Optional plugin support and metrics"
published: true
date: 2026-09-30T20:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Every integration is optional. Placeholder keys are in [PlaceholderAPI](/wormholes/12-placeholderapi). The Java surfaces are in [API](/wormholes/20-api-getting-started).

## Soft dependencies

These plugin integrations apply to the Bukkit distribution. PlaceholderAPI, Iris, Vault, and Citizens are optional. Native loader integrations register permission and currency providers through the [native API](/wormholes/20-api-getting-started).

| Plugin | Role when present | When absent |
|--------|-------------------|-------------|
| PlaceholderAPI | Registers `%wormholes_…%` expansion | No placeholders |
| Vault (+ economy provider) | Portal menu travel cost type **Vault Economy** | Vault cost mode is unavailable. Free and item costs still work |
| Iris | Pre-load RTP fluid and biome probes | RTP falls back to ordinary chunk-backed biome and landing-safety checks |
| Citizens | Prevents standard tracked NPCs from relinking while a portal projection occludes their real local entity | Ordinary Bukkit entities still use the same local-occlusion path; no Citizens event hook is registered |

## Wormholes client mod

The Fabric, Forge, and NeoForge jars also act as a client mod for [ClientView](/wormholes/05-projection-modes-settings#clientview). A Paper, Purpur, or Folia server with the Bukkit plugin talks to the client mod over the `wormholes:v1` plugin channel, so a modded client receives ClientView there as it does on a Fabric, Forge, or NeoForge server. The server needs no extra plugin for this. Installation: [Client mod](/wormholes/01-installation-configuration#client-mod).

The client mod adds no rendering hooks. It has been tested with Sodium, Lithium, and C2ME.

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

When Iris is active, Wormholes can reject fluid columns and biome mismatches before loading an RTP candidate chunk. Without Iris, it uses normal chunk-backed biome and landing-safety checks. RTP biome menus also use the active Iris dimension to list reachable pack biomes by name.

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



## HTTP metrics and web maps

The authenticated [metrics and snapshot endpoint](/wormholes/23-api-metrics-integration-contract) supports Bukkit, Fabric, Forge, and NeoForge. Dynmap, BlueMap, Pl3xMap, and squaremap marker integrations require their Bukkit plugins and apply to the Bukkit distribution.
