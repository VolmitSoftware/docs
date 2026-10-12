---
title: "Shaped Portals: Compatibility and operations"
description: "Server requirements, Folia limits, React integration, and server checks"
published: true
date: 2026-10-12T23:36:43.102Z
tags: "shapedportals, compatibility, java, folia"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

<nav class="doc-breadcrumb" aria-label="Breadcrumb"><a href="/shapedportals">Shaped Portals</a><span aria-hidden="true">/</span><span aria-current="page">Compatibility and diagnostics</span></nav>

The current Shaped Portals jar supports Bukkit-compatible Minecraft 26.1 through 26.3 servers on Java 25. It does not require a client mod or resource pack.

- [Requirements](#platform-matrix)
- [Java](#java-runtime-floors)
- [Native portals](#native-portal-compatibility)
- [Update notices](#update-notifications)
- [Diagnostics](#diagnostic-reports)
- [React](#react-plugin-api-pack)
{.grid-list}

## Platform matrix

| Platform | Requirement or limit |
|---|---|
| Spigot, Paper, and compatible servers | Minecraft 26.1 through 26.3 |
| Folia | Supported; a portal cannot cross independently owned regions |
| Client | No mod or resource pack required |

## Java runtime floors

| Minecraft server range | Java requirement |
|---|---|
| 26.1 to 26.3 | Java 25 |

Use Java 25 for this distribution. See [Paper's system requirements](https://docs.papermc.io/paper/getting-started/) for server setup.

## Folia and chunk loading

Creation needs the whole shape to belong to one active region. This is not the same as a one-chunk size limit.

Integrity checks skip unloaded chunks. Administrative teleport commands can prepare destination and nearby landing chunks, then check them on their owning regions.

## Native portal compatibility

In standalone use, Shaped Portals writes ordinary `NETHER_PORTAL` and `END_PORTAL` blocks. Minecraft controls travel, Nether coordinate scaling, destination search, and generated destination frames. The plugin does not use NMS, packets, or a client mod.

With Wormholes installed, accepted Nether shapes use its projection and bidirectional travel instead of native portal blocks. Shaped Portals supplies only the interior coordinates and axis; Wormholes owns pairing and the portal lifecycle. Enable Wormholes `replace-nether-and-end-portals` to use this integration.

Protection plugins can cancel creation through `PortalCreateEvent`, `BlockPlaceEvent`, `BlockMultiPlaceEvent`, and `BlockCanBuildEvent`. See [Ignition and protection plugins](/shapedportals/02-portal-behavior-events#ignition-and-protection-plugins).

## Update notifications

`general.updateNotifications` defaults to `true`. Shaped Portals then checks [its GitHub releases](https://github.com/VolmitSoftware/ShapedPortals/releases) at startup, caches the answer for an hour, and tells operators and anyone with `shapedportals.update` on join. The message carries the installed version, the new version, and a link.

It reads release metadata from `api.github.com` and never downloads or replaces a jar. Install the update yourself.

Only a higher numeric plugin version counts. Drafts and prereleases are skipped, and the Minecraft suffix is ignored: `2.0.0-1.20.1-26.2` compares as `2.0.0`, so a rebuild for a different Minecraft range is not an update.

Set `updateNotifications = false`, or turn it off under General in `/sp config`, to stop the checks and clear pending notices.

## Diagnostic reports

`/sp debug dump [upload=true]` requires `shapedportals.debug` (default `op`) and saves a report under `plugins/ShapedPortals/debug/`. The report includes server, Java, performance, plugin, configuration, portal, and creation statistics. File contents are not copied into the report.

Reports upload to the public mclo.gs service by default. Use `upload=false` for one local-only report or set `debug.uploadEnabled = false` to block all uploads. The local file remains available if an upload fails.

Use `/volmit plugins debug ShapedPortals [upload=true|false]` for the same report through VolmLib. `/volmit plugins debug all [upload=true|false]` requests reports from every provider the sender can use. See [Shared diagnostic reports](/volmlib/api/diagnostics) for the common report format.

## React Plugin API pack

React is optional. The **ShapedPortals Runtime** pack adds these samplers:

| Sampler | Reports |
|---|---|
| Managed Portals | Number of registered portals |
| Portal Interior Cells | Number of managed interior cells |
| Portal Creation Attempts | Creation attempts per second |
| Created Portals | Successful creations per second |
| Rejected Portal Attempts | Rejections per second |
| Portal Creation Success | Percentage of attempts that succeeded |

### Install the pack

1. Extract `react-api-packs/shapedportals-runtime.toml` from the Shaped Portals jar.
2. Copy it into `plugins/React/plugin-apis/`, or install it through React Web.
3. Run `/react plugin-api reload`.

See [React Plugin API Packs](/react/20-api-plugin-api-packs) for pack setup and status.

These measurements stay on your server and are separate from bStats. Rates need two samples, and session totals reset when Shaped Portals restarts.

## Related pages

- [Troubleshooting *Portal creation, integrity, and travel checks*](/shapedportals/02-portal-behavior-events#troubleshooting)
- [Developer reference *Geometry, threading, persistence, and builds*](/shapedportals/04-architecture-limits)
- [Discord *Community support and development chat*](https://volmitsoftware.com/discord)
{.links-list}
