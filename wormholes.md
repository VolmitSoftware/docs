---
title: Wormholes
description: Wormholes through-portal projection plugin — overview
published: true
date: 2026-08-09T00:00:00.000Z
tags: wormholes
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Wormholes is a through-portal projection and traversal plugin for Paper and Folia. Frame
portals show a **live view of the destination** and move travelers through it. Around that sit
random-teleport portals, survival Dimensional Doors with pocket dimensions, and cross-server
gateways.

**Root command:** `/wormholes` (aliases `wh`, `wormhole`)
**Soft dependencies:** PlaceholderAPI, Iris, Vault
**Folia:** supported (via `paper-plugin.yml`)

## Load order

Wormholes ships both descriptors, and they differ:

| Descriptor | Used by | `load` |
|---|---|---|
| `paper-plugin.yml` | Paper and forks | `STARTUP`, with a bootstrapper |
| `plugin.yml` | Spigot fallback | `POSTWORLD` |

On Paper the plugin bootstraps before worlds load. On Spigot it loads after. If you are
debugging a startup-ordering problem, check which descriptor your server actually picked up.

## Feature map

| Area | Summary |
|---|---|
| Frame portals | Wand and rune construction, portal types, menus, skins |
| Projection | ON/OFF, PanOptic vs Venticular modes, render budgets |
| Random teleport | RTP portal type with an in-game editor |
| Dimensional doors | Pair, Personal, and Public doors and trapdoors |
| Pocket dimensions | Shared void pocket world with return doors |
| Cross-server | Gateway codes, trust exchange, player handoff |
| PlaceholderAPI | Operator `%wormholes_…%` keys |
| Traversal API | Public pricing and event API for other plugins |

## Documentation

| Page |
|---|
| [Commands & Permissions](/wormholes/commands) |
| [Overview](/wormholes/00-overview) |
| [Installation & Configuration](/wormholes/01-installation-configuration) |
| [Concepts](/wormholes/02-concepts) |
| [Building Portals](/wormholes/03-building-portals) |
| [Portal Types Menus & Settings](/wormholes/04-portal-types-menus-settings) |
| [Projection Modes & Settings](/wormholes/05-projection-modes-settings) |
| [Random Teleport Portals](/wormholes/06-random-teleport-portals) |
| [Dimensional Doors](/wormholes/07-dimensional-doors) |
| [Pocket Dimensions](/wormholes/08-pocket-dimensions) |
| [Commands & Permissions](/wormholes/09-commands-permissions) |
| [Cross-Server Networking](/wormholes/10-cross-server-networking) |
| [Localization](/wormholes/11-localization) |
| [PlaceholderAPI](/wormholes/12-placeholderapi) |
| [Runtime Architecture](/wormholes/13-runtime-architecture) |
| [Operator Runbooks & Smoke Tests](/wormholes/14-operator-runbooks-smoke-tests) |
| [Integrations](/wormholes/15-integrations) |
| [Maintainer Component & Build Reference](/wormholes/16-maintainer-component-build-reference) |
| [API - Getting Started](/wormholes/20-api-getting-started) |
| [API - Traversal Cost & Events](/wormholes/21-api-traversal-cost-events) |
| [API - PlaceholderAPI](/wormholes/22-api-placeholderapi) |
| [API - Metrics & Integration Contract](/wormholes/23-api-metrics-integration-contract) |

## Support

[Discord](https://discord.gg/volmit) · [Source](https://github.com/VolmitSoftware/WormholesPlugin)
