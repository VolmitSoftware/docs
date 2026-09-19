---
title: "Wormholes"
description: "Live portals, random teleport, Dimensional Doors, and cross-server travel"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

![Wormholes](/home-assets/wormholes.png =112x){.align-center .radius-16}

Wormholes adds portals with live destination views, random teleportation, Dimensional Doors, pocket dimensions, and cross-server travel.

[Overview](/wormholes/00-overview) ·
[Install](/wormholes/01-installation-configuration) ·
[Build a portal](/wormholes/03-building-portals) ·
[Commands](/wormholes/09-commands-permissions)
{.text-center}

## Start in three steps

1. [Install Wormholes](/wormholes/01-installation-configuration) and start the
   server once to create `plugins/Wormholes/wormholes.toml`.
2. Craft a Portal Wand, or have an administrator run `/wormholes wand`.
3. [Form a portal](/wormholes/03-building-portals), open its menu, and choose a
   destination.

> Static Wormholes permissions default to `op`. Grant the appropriate portal,
> door, and gateway permissions before non-operators try to build or craft.
{.is-warning}

## What you can build

| Feature | What it does | Guide |
|---|---|---|
| Linked portal | Shows and travels to another portal on the same server | [Portal menus and settings](/wormholes/04-portal-types-menus-settings) |
| Random teleport portal | Searches for a safe destination using world, radius, height, and biome rules | [Random teleport](/wormholes/06-random-teleport-portals) |
| Dimensional Door | Creates paired, personal, or public doors and trapdoors | [Dimensional Doors](/wormholes/07-dimensional-doors) |
| Pocket dimension | Gives personal and public doors a managed room with a return exit | [Pocket dimensions](/wormholes/08-pocket-dimensions) |
| Cross-server gateway | Shows a remote server destination and transfers travelers | [Cross-server networking](/wormholes/10-cross-server-networking) |

To manage a portal, use the Portal Wand while looking at it, or sneak with an empty main hand and right-click it. Every control is on [Portal menus and settings](/wormholes/04-portal-types-menus-settings).

## Server setup

| Item | Value |
|---|---|
| Java | 25 |
| Servers | Paper and Folia, with a Spigot 26.2 compatibility build |
| Config | `plugins/Wormholes/wormholes.toml`, schema `3` |
| Command | `/wormholes`, `/wh`, or `/wormhole` |
| Optional plugins | PlaceholderAPI, Iris, Vault, Citizens, and WorldGuard for RTP entry checks |

## More documentation

- [Core concepts](/wormholes/02-concepts)
- [Projection and performance](/wormholes/05-projection-modes-settings)
- [Commands and permissions](/wormholes/09-commands-permissions)
- [Localization](/wormholes/11-localization)
- [PlaceholderAPI](/wormholes/12-placeholderapi)
- [Integrations](/wormholes/15-integrations)
- [Developer API documentation](/wormholes/20-api-getting-started)
{.grid-list}

## Support and source

- [Discord *Support and development chat*](https://volmitsoftware.com/discord)
- [GitHub *Wormholes source repository*](https://github.com/VolmitSoftware/Wormholes)
{.links-list}
