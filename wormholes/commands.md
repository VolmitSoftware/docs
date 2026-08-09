---
title: Wormholes — Commands & Permissions
description: The /wormholes command tree and full permission node reference
published: true
date: 2026-08-09T00:00:00.000Z
tags: wormholes, commands, permissions
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Wormholes registers the root command `/wormholes`, aliased `wh` and `wormhole`.

## /wormholes

*Wormholes command root*

| Command | Description |
|---|---|
| `/wormholes wand` | Give yourself the portal wand, or runes with rune=<type> |
| `/wormholes door` | Give a survival Dimensional Door item |
| `/wormholes reload` | Reload Wormholes configuration and language files |
| `/wormholes debug` | Toggle verbose console logs and one-second telemetry |
| `/wormholes stats` | Print the live stats-snapshot file path, optionally force a refresh with now=true |
| `/wormholes info` | Show portal building instructions |

## /wormholes server

*Cross-server travel: connect to, list, and exchange linked servers*

| Command | Description |
|---|---|
| `/wormholes server export` | Export this server as a code other servers can import |
| `/wormholes server import` | Import a server or portal code exported by another server |
| `/wormholes server list` | List linked servers and their connection state |

## /wormholes network

*Cross-server wormhole network*

| Command | Description |
|---|---|
| `/wormholes network status` | Show peer connection status |
| `/wormholes network doctor` | Explain why network peers are not connecting |

## /wormholes admin

*Destructive Wormholes maintenance commands*

| Command | Description |
|---|---|
| `/wormholes admin deleteallportals` | Delete every local portal and saved portal link |
| `/wormholes admin deleteeverything` | Reset Wormholes data, config, trust, identity, and network state |
| `/wormholes admin flush` | Revert every observer's projected blocks to ground truth and rebuild them |


> **`/wormholes admin` is destructive.** `deleteallportals` removes every local portal and
> saved link; `deleteeverything` resets portal data, config, trust, identity, and network
> state. Neither is undoable. Back up `plugins/Wormholes/` first, and keep
> `wormholes.admin.reset` off your staff groups.


## Permissions

Wormholes ships a grouped permission tree. Grant the parent to imply its children.

| Node | Default | Description |
|---|---|---|
| `wormholes.*` | `op` | Gives access to all Wormholes permissions. |
| &nbsp;&nbsp;&nbsp;&nbsp;`wormholes.admin` | `op` | Gives access to all Wormholes admin permissions. |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`wormholes.admin.reload` | `op` | Allows reloading Wormholes configuration. |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`wormholes.admin.items` | `op` | Allows spawning in Wormholes items (wand, runes). |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`wormholes.admin.network` | `op` | Allows managing Wormholes network links. |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`wormholes.admin.projection` | `op` | Allows freezing and flushing portal projection state. |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`wormholes.admin.reset` | `op` | Allows deleting portals and resetting Wormholes data. |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`wormholes.doors.bypass` | `op` | Bypass dimensional door access restrictions. |
| &nbsp;&nbsp;&nbsp;&nbsp;`wormholes.gateway` | `op` | Allows creating and modifying gateway portals. |
| &nbsp;&nbsp;&nbsp;&nbsp;`wormholes.portals` | `True` | Allows creating and modifying non-gateway frame portal types. |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`wormholes.portals.wormhole` | `True` | Allows creating and modifying wormhole-type frame portals. |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`wormholes.portals.portal` | `True` | Allows creating and modifying portal-type and RTP frame portals. |


### Defaults worth noting

Most nodes default to `op`, but **`wormholes.portals` and its children default to `true`** —
every player can build wormhole-type and portal-type frame portals out of the box. If you
want portal construction gated, revoke `wormholes.portals` explicitly rather than assuming
op-only access.

`wormholes.gateway` defaults to `op`, so cross-server gateway portals are staff-only unless
you grant it.

### Grouping

| Node | Implies |
|---|---|
| `wormholes.*` | `wormholes.admin`, `wormholes.portals`, `wormholes.gateway` |
| `wormholes.admin` | all `wormholes.admin.*` plus `wormholes.doors.bypass` |
| `wormholes.portals` | `wormholes.portals.wormhole`, `wormholes.portals.portal` |
