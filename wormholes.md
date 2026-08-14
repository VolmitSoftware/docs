---
title: "Wormholes"
description: "Wormholes through-portal projection and traversal"
published: true
date: 2026-08-14T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

# Wormholes

Frame portals that render a live view of the destination instead of an opaque surface, plus
random-teleport portals, survival Dimensional Doors with pocket dimensions, and cross-server
gateways.

| | |
|---|---|
| Command | `/wormholes` (`wh`, `wormhole`) |
| Folia | Supported (via `paper-plugin.yml`) |
| Permissions | 14 declared yml nodes plus dynamic `wormholes.portal.<sanitized-name>` |
| Integrations | PlaceholderAPI, Iris, Vault |

> Wormholes ships two descriptors that disagree on load order. Paper reads
> `paper-plugin.yml` and bootstraps at `STARTUP`; Spigot falls back to `plugin.yml` at
> `POSTWORLD`. Worth knowing before debugging a load-order problem.
{.is-info}

> All static permission nodes default to `op`. Non-operators need an explicit frame-portal
> type permission to construct or change portals, `wormholes.doors.craft` to craft or
> reskin Dimensional Doors, and `wormholes.doors.place` to place them.
{.is-info}

### Getting started

- [Overview](/wormholes/00-overview)
- [Installation & Configuration](/wormholes/01-installation-configuration)
- [Concepts](/wormholes/02-concepts)
- [Building Portals](/wormholes/03-building-portals)
{.links-list}

### Portals and projection

- [Portal Types Menus & Settings](/wormholes/04-portal-types-menus-settings)
- [Projection Modes & Settings](/wormholes/05-projection-modes-settings)
- [Random Teleport Portals](/wormholes/06-random-teleport-portals)
- [Dimensional Doors](/wormholes/07-dimensional-doors)
- [Pocket Dimensions](/wormholes/08-pocket-dimensions)
{.links-list}

### Commands, networking and operations

- [Commands & Permissions](/wormholes/09-commands-permissions)
- [Cross-Server Networking](/wormholes/10-cross-server-networking)
- [Localization](/wormholes/11-localization)
- [PlaceholderAPI](/wormholes/12-placeholderapi)
- [Runtime Architecture](/wormholes/13-runtime-architecture)
- [Operator Runbooks & Smoke Tests](/wormholes/14-operator-runbooks-smoke-tests)
- [Integrations](/wormholes/15-integrations)
- [Maintainer Component & Build Reference](/wormholes/16-maintainer-component-build-reference)
{.links-list}

### Developer API

- [API - Getting Started](/wormholes/20-api-getting-started)
- [API - Traversal Cost & Events](/wormholes/21-api-traversal-cost-events)
- [API - PlaceholderAPI](/wormholes/22-api-placeholderapi)
- [API - Metrics & Integration Contract](/wormholes/23-api-metrics-integration-contract)
{.links-list}


## Support

- [Discord *Support and development chat*](https://volmitsoftware.com/discord)
- [Source *github.com/VolmitSoftware/WormholesPlugin*](https://github.com/VolmitSoftware/WormholesPlugin)
{.links-list}
