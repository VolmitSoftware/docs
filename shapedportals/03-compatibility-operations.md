---
title: "Shaped Portals: Compatibility and operations"
description: "Server requirements, Folia limits, React integration, and server checks"
published: true
date: 2026-10-14T00:00:00.000Z
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

The plugin declares API 26.1 and emits Java 25 bytecode. Builds compile against Spigot 26.1, Paper 26.1.2, Spigot 26.2, and Paper 26.3 APIs. Paper 26.3 uses an alpha API; compilation alone does not verify runtime behavior on every platform. Earlier Minecraft versions and releases after 26.3 are outside this distribution's support range.

## Folia and chunk loading

Creation needs the whole shape to belong to one active region. This is not the same as a one-chunk size limit.

Integrity checks skip unloaded chunks. Administrative teleport commands can prepare destination and nearby landing chunks, then check them on their owning regions.

## Native portal compatibility

In standalone use, Shaped Portals writes ordinary `NETHER_PORTAL` and `END_PORTAL` blocks. Minecraft controls travel, Nether coordinate scaling, destination search, and generated destination frames. The plugin does not use NMS, packets, or a client mod.

With Wormholes installed, accepted Nether shapes use its projection and bidirectional travel instead of native portal blocks. Shaped Portals supplies only the interior coordinates and axis; Wormholes owns pairing and the portal lifecycle. Enable Wormholes `replace-nether-and-end-portals` to use this integration.

Protection plugins can cancel creation through `PortalCreateEvent`, `BlockPlaceEvent`, `BlockMultiPlaceEvent`, and `BlockCanBuildEvent`. See [Ignition and protection plugins](/shapedportals/02-portal-behavior-events#ignition-and-protection-plugins).

## Update notifications

`general.updateNotifications` defaults to `true`. Shaped Portals registers [its GitHub releases](https://github.com/VolmitSoftware/ShapedPortals/releases) with VolmLib's shared update service. Operators and players with `volmit.update` or `shapedportals.update` receive one combined join notice listing permitted registered plugins with updates.

Run `/volmit plugins updates`, or click the notice, to see installed and newer versions with release links. Checks run at startup and roughly hourly; repeated commands share active requests and respect cooldowns. Failed checks retain previous release metadata as cached. Only registered plugins appear in the combined report.

The service reads release metadata from `api.github.com`; installing an update remains manual. The shared join notice and report currently use English.

Only stable GitHub releases qualify. The service compares the numeric plugin version, ignoring a recognized Minecraft compatibility suffix. A stable release also supersedes an installed prerelease with the same numeric core, such as `2.0.0-rc.1`. Unrecognized suffixes are reported as incomparable.

Set `updateNotifications = false`, or turn it off under General in `/sp config`, to stop ShapedPortals checks and clear its pending notices. The shared command reports it as disabled and does not override the setting. Other plugins retain their own settings. See [Shared GitHub release checks](/volmlib/api/github-releases) for retry and permission behavior.

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
