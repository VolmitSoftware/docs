---
title: "Integrations"
description: "Wormholes documentation: Integrations"
published: true
date: 2026-08-21T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Wormholes soft-depends on PlaceholderAPI, Iris, and Vault. It finds WorldGuard
by plugin name for RTP destination admission. PacketEvents and bStats are
internal runtime dependencies, not separate server plugins. React and other
monitors read Wormholes through VolmLib `IntegrationServiceContract` with no
hard dependency either way.

Public third-party surfaces are summarized in
[20 - API - Getting Started](/wormholes/20-api-getting-started). Operator
PlaceholderAPI keys are in [12 - PlaceholderAPI](/wormholes/12-placeholderapi).

## Soft dependencies

`plugin.yml` declares `softdepend: [ PlaceholderAPI, Iris, Vault ]`.
`paper-plugin.yml` lists them as optional server dependencies with
`load: BEFORE`, `required: false`, and `join-classpath: true`.

| Plugin | Role when present | When absent |
|--------|-------------------|-------------|
| PlaceholderAPI | Registers `%wormholes_…%` expansion | No placeholders |
| Vault (+ economy provider) | Portal menu travel cost type **Vault Economy** | Vault cost mode is unavailable. Free and item costs still work |
| Iris | Pre-load RTP fluid and biome probes | RTP falls back to ordinary chunk-backed biome and landing-safety checks |

None of these are required to enable Wormholes.

## WorldGuard

WorldGuard is not declared as a soft dependency. The RTP environment finds it by
plugin name and calls its API reflectively. For each player's prepared RTP
destination, WorldGuard bypass allows access and `Flags.ENTRY` decides normal
access. Missing WorldGuard allows the destination. An installed-but-disabled
WorldGuard, or an incompatible reflective path, surfaces as an RTP integration
failure. See
[06 - Random Teleport Portals](/wormholes/06-random-teleport-portals).

## Vault travel costs

Portals can require a travel cost of type **vanilla item** or **Vault economy**.
That choice is in the per-portal menu. Free is the default when no cost is set.
Vault costs use VolmLib `VaultEconomy` built at Wormholes enable
(`Wormholes.vaultEconomy`).

- Amount is a positive `BigDecimal`, max `1000000000000`, scale capped at 8.
- Status is `AVAILABLE` if the economy is up and the player can afford the cost.
  Status is `INSUFFICIENT` if the player cannot afford the cost. Status is
  `UNAVAILABLE` if Vault or the economy is missing. Status is `FAILED` on
  transaction failure.
- Reserve withdraws with reason `Wormholes portal travel for <uuid>`. Commit
  finalizes the charge. Refund reverses it if traversal aborts after reserve.
- Messages cover insufficient funds, Vault unavailable, and failed transactions.
  Selecting Vault mode in the menu without Vault and an economy is rejected with
  a notice.

Vault costs are the built-in per-portal price path. Third-party plugins that
price or veto travel should use `TraversalCostProvider`
([21 - API - Traversal Cost & Events](/wormholes/21-api-traversal-cost-events)).
That path is independent of the portal menu cost types.

## Iris

Soft-depend only. When Iris is enabled and its world engine is open, Wormholes
probes the terrain model for fluid columns and the biome model for pack load
keys and vanilla derivative keys before loading a candidate chunk. Fluid
columns and enforced biome mismatches are rejected before generation.

If Iris is missing, disabled, unloading, or a probe is unavailable, Wormholes
falls back to its ordinary chunk-backed biome and landing-safety checks. This
fallback also applies to an Iris world whose engine is unavailable.

No Iris world-gen or pack APIs are exposed to third parties through Wormholes.

## PlaceholderAPI

See [12 - PlaceholderAPI](/wormholes/12-placeholderapi) for keys, selection, and
formats. See [22 - API - PlaceholderAPI](/wormholes/22-api-placeholderapi) for
integrator notes. Expansion identifier: `wormholes`.

## React / IntegrationServiceContract

Wormholes registers VolmLib
`art.arcane.volmlib.integration.IntegrationServiceContract` at
`ServicePriority.Normal` with `pluginId()` `wormholes`. Typed consumers must
share the registered VolmLib class identity. React can also adapt equivalent
registrations reflectively across plugin classloaders. Full metric keys,
acquisition rules, unavailable reasons, and protocol details live in
[23 - API - Metrics & Integration Contract](/wormholes/23-api-metrics-integration-contract).

No direct React API dependency exists inside Wormholes.

## PacketEvents (internal, shaded)

PacketEvents is relocated into the shaded plugin jar
(`com.github.retrooper.packetevents` / `io.github.retrooper.packetevents` →
plugin-internal packages). Operators do not install PacketEvents separately.

Used for:

- Projection rendering and client chunk tracking
- Entity spoof / identity packets for through-portal views
- **TransferGate**: On handshake receive, if the network is enabled and
  `autoAcceptTransfers` is true, TransferGate rewrites the client `TRANSFER`
  intention to `LOGIN`. Paper and Folia then accept cross-server transfer
  handoffs.
- Network status-bridge packet listeners when networking is active

There is no public PacketEvents integration surface for third-party plugins.

## bStats

Wormholes starts its relocated bStats client with plugin ID **33193**. The
charts are `total_portals`, `portals_by_type`, `cross_server`,
`wire_compression`, and `connected_peers`. Callbacks read volatile values or
immutable snapshots. They skip a chart cycle when its manager is unavailable.
Standard bStats collection can be disabled through the server-wide bStats
configuration.

## What has no soft-depend integration

Projection internals, portal CRUD, wire protocol, RTP destination selection, and
dimensional-door pocket APIs are not exposed. See "What has no API" in
[20 - API - Getting Started](/wormholes/20-api-getting-started).
