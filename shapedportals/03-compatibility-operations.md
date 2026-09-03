---
title: "Shaped Portals: Compatibility and operations"
description: "Server requirements, Folia limits, React integration, and server checks"
published: true
date: 2026-09-03T04:58:11.006Z
tags: "shapedportals, compatibility, java, folia"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

<nav aria-label="Breadcrumb" style="display:flex;align-items:center;gap:.45rem;margin:0 0 1.5rem;padding:0 0 .85rem;border-bottom:1px solid rgba(127,127,127,.25);font-size:.9rem"><a href="/shapedportals" style="font-weight:700;text-underline-offset:.18em">Shaped Portals</a><span aria-hidden="true" style="opacity:.45">/</span><span aria-current="page" style="opacity:.72">Compatibility and diagnostics</span></nav>

Shaped Portals supports Spigot 1.20.1 and newer compatible servers. It does not require a client mod or resource pack.

- [Requirements](#platform-matrix)
- [Java](#java-runtime-floors)
- [Native portals](#native-portal-compatibility)
- [Diagnostics](#diagnostic-reports)
- [React](#react-plugin-api-pack)
{.grid-list}

## Platform matrix

| Platform | Requirement or limit |
|---|---|
| Spigot, Paper, and compatible servers | Version 1.20.1 or newer |
| Folia | Supported; a portal cannot cross independently owned regions |
| Client | No mod or resource pack required |

## Java runtime floors

| Minecraft server range | Java requirement |
|---|---|
| 1.20.1 to 1.20.4 | Java 17 or the version required by your server |
| 1.20.5 to 1.21.11 | Java 21 or newer as required by your server |
| 26.1 to 26.2 | Java 25 |

Check [Paper's system requirements](https://docs.papermc.io/paper/getting-started/) and the [Minecraft 1.20.5 release notes](https://www.minecraft.net/article/minecraft-java-edition-1-20-5) for server runtime requirements.

## Folia and chunk loading

Creation needs the whole shape to belong to one active region. This is not the same as a one-chunk size limit.

Integrity checks skip unloaded chunks. Administrative teleport commands can prepare destination and nearby landing chunks, then check them on their owning regions.

## Native portal compatibility

Shaped Portals writes ordinary `NETHER_PORTAL` and `END_PORTAL` blocks. Minecraft controls travel, Nether coordinate scaling, destination search, and generated destination frames. The plugin does not use NMS, packets, or a client mod.

Nether proposals fire a cancellable `PortalCreateEvent` with reason `FIRE`. Shaped End creation respects the Eye of Ender interaction and asks `BlockCanBuildEvent` about every proposed cell because Bukkit has no End-activation `PortalCreateEvent` reason. See [Ignition and protection plugins](/shapedportals/02-portal-behavior-events#ignition-and-protection-plugins) for the event sequence.

## Diagnostic reports

`/sp debugdump [upload=true]` requires `shapedportals.debugdump` (default `op`) independently of other command permissions and saves a timestamped report atomically under `plugins/ShapedPortals/debug/`. The shared report includes installed plugins, server and world counts, scheduler state, TPS and MSPT when available, Java and operating-system data, memory pools, CPU load, garbage collectors, buffer pools, storage, bounded known-file hashes, and plugin artifact identity. ShapedPortals adds its service state, effective settings, registry records by portal type and axis, and creation and rejection counts. Known-file inspection records metadata and hashes rather than copying file contents.

The local report is written before upload. Uploads to public mclo.gs are enabled by default; `/sp debugdump upload=false` saves a local-only report. `debug.uploadEnabled = false` suppresses uploads even when the command requests one. An upload failure retains the local file. Players receive controls to copy the relative report path and open or copy the upload link; console receives plain text.

See [Shared diagnostic reports](/volmlib/api/diagnostics) for the common report and service contract.

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
