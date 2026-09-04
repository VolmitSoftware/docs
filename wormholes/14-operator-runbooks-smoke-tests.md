---
title: "Operator Runbooks & Smoke Tests"
description: "Repeatable checks for install, portals, projection, RTP, doors, networking, and recovery"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Use these checks after installing or updating Wormholes.

## First portal

1. Build a supported frame and create a portal.
2. Open its menu with the Portal Wand and confirm its name and type.
3. Link or configure its destination.
4. Walk through it and confirm the destination is safe and correct.

See [Building Portals](/wormholes/03-building-portals) and [Commands & Permissions](/wormholes/09-commands-permissions).

## Operator access bypass

1. Set a linked portal to `LOCKED` and use a blacklist or whitelist state that
   rejects an ordinary player.
2. Confirm the ordinary player is rejected.
3. Op that player and confirm local travel succeeds in both directions.
4. For gateways, repeat against an incoming-disabled remote destination and
   confirm the op is admitted.
5. Enable mirror mode and confirm travel remains locked for the op.

## Projection

Stand where the source view should be visible and confirm the selected projection mode updates. If it does not, check the portal's mode, quality preset, distance limits, and required packet integration.

## Cross-server travel

Confirm both servers can reach each other's configured endpoint, use matching codes, and trust the same network. Test with a non-production player before opening the route to everyone.

See [Cross-Server Networking](/wormholes/10-cross-server-networking).

## Recovery

Back up Wormholes data before resets or manual restoration. If a reload leaves portals, projections, or tasks in an inconsistent state, restart the server instead of repeating the reload.

To check persistence, stop a server with at least one saved portal. Restart it and confirm the portal loads with the same destination and settings.
