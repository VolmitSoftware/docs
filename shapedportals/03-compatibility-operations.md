---
title: "Shaped Portals: Compatibility and operations"
description: "Server requirements, Folia limits, React integration, and server checks"
published: true
date: 2026-09-11T16:41:06.000Z
tags: "shapedportals, compatibility, java, folia"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

<nav class="doc-breadcrumb" aria-label="Breadcrumb"><a href="/shapedportals">Shaped Portals</a><span aria-hidden="true">/</span><span aria-current="page">Compatibility and diagnostics</span></nav>

Shaped Portals supports Spigot 1.20.1 and newer compatible servers. It does not require a client mod or resource pack.

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

Nether proposals fire a cancellable `PortalCreateEvent` with reason `FIRE`. Shaped End creation starts only after the Eye of Ender's `BlockPlaceEvent` or `BlockMultiPlaceEvent` is accepted, then asks `BlockCanBuildEvent` about every proposed cell. Bukkit has no End-activation `PortalCreateEvent` reason; `END_PLATFORM` identifies the End arrival platform instead. See [Ignition and protection plugins](/shapedportals/02-portal-behavior-events#ignition-and-protection-plugins) for the event sequence.

## Update notifications

With `general.updateNotifications = true` (the default), Shaped Portals checks the latest stable release published in [VolmitSoftware/ShapedPortals on GitHub](https://github.com/VolmitSoftware/ShapedPortals/releases). It checks asynchronously at startup and caches the result for one hour. Joining players share that result rather than each making a network request.

When a newer version is available, operators and players with `shapedportals.update` receive a localized chat message when they join. The message includes the installed version, the release version, and a clickable release link. The notifier does not send announcements to everyone already online.

Only a newer numeric plugin version triggers a notice. Drafts and prereleases are excluded. Minecraft compatibility suffixes do not affect the comparison: an installed version of `2.0.0-1.20.1-26.2` compares as `2.0.0`, so a release with the same plugin version and a different compatibility range does not trigger an update notice.

The notifier needs outbound HTTPS access to `api.github.com`. It reads release metadata only and never downloads release assets, replaces jars, or installs updates. Install any chosen update manually after reviewing its release notes and server compatibility.

If GitHub is unavailable, rate-limits the request, or returns an invalid response, the check produces no update notice and retries after an hour. The console logs the first failure with its cause; repeated failures stay quiet until a successful check.

Set `updateNotifications = false` under `[general]` in `config.toml`, or turn off GitHub update notifications in `/sp config` under General. The change takes effect as soon as the configuration applies, stops further checks, and clears cached and pending notices. Turning it on starts a fresh check.

## Diagnostic reports

`/sp debug dump [upload=true]` requires `shapedportals.debug` (default `op`) and saves a report under `plugins/ShapedPortals/debug/`. The report includes server, Java, performance, plugin, configuration, portal, and creation statistics. File contents are not copied into the report.

Reports upload to the public mclo.gs service by default. Use `upload=false` for one local-only report or set `debug.uploadEnabled = false` to block all uploads. The local file remains available if an upload fails.

Use `/volmit plugins debug ShapedPortals [upload=true|false]` for the same report through VolmLib. `/volmit plugins debug all [upload=true|false]` requests reports from every provider the sender can use. See [Shared diagnostic reports](/volmlib/api/diagnostics) for the common report format.

Diagnostic feedback uses the `debug.*` entries in the Shaped Portals language catalog, including requests made through `/volmit plugins debug all`. The individual dump menu renders the selected language's prefix and message formatting in progress, saved, uploaded, and error rows. Copy and open controls retain exact file paths and URLs, including literal backslashes and color-like text. Missing translations use English defaults.

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
