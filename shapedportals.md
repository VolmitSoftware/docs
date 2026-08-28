---
title: "Shaped Portals"
description: "Managed non-rectangular Nether portals with safe live configuration"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "shapedportals, portals, folia, configuration"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Shaped Portals creates vertical Nether portal surfaces inside closed frames of
almost any connected shape. Version 2.0 is a full replacement of the 2021
implementation, with bounded geometry, persistent portal ownership, repair-based
integrity, live typed configuration, localized commands, and Folia-aware scheduling.

| | |
|---|---|
| Current version | 2.0.0 |
| API floor | Bukkit/Spigot 1.20.1 |
| Java artifact | Java 17 bytecode |
| Commands | `/shapedportals`, `/shapedportal`, `/sp` |
| Configuration | `plugins/ShapedPortals/config.toml` |
| Language | `plugins/ShapedPortals/languages/<locale>.toml` |
| Managed portal store | `plugins/ShapedPortals/portals.json` |
| Folia metadata | Declared; region-owned implementation |

> Shaped Portals manages native `NETHER_PORTAL` blocks. It does not implement
> End portals, horizontal portal planes, custom destinations, or linked portal
> networks. Vanilla Minecraft still controls travel and destination creation.
{.is-info}

### Start here

- [Overview *Shape rules, lifecycle, commands, and permissions*](/shapedportals/00-overview)
- [Installation & Configuration *Install, live reload, GUI, and every setting*](/shapedportals/01-installation-configuration)
- [Portal Behavior & Events *Creation, persistence, repairs, and integrations*](/shapedportals/02-portal-behavior-events)
- [Compatibility & Operations *Version matrix, safety limits, and production checks*](/shapedportals/03-compatibility-operations)
- [Architecture & Limits *Why persistence is required and where native portals stop*](/shapedportals/04-architecture-limits)
{.links-list}

## Support and source

- [Source *github.com/VolmitSoftware/ShapedPortals*](https://github.com/VolmitSoftware/ShapedPortals)
- [Spigot resource *Published plugin page*](https://www.spigotmc.org/resources/shaped-portals.95595/)
- [Discord *Community and development chat*](https://volmitsoftware.com/discord)
{.links-list}
