---
title: "Operator Runbooks & Smoke Tests"
description: "Repeatable checks for install, portals, projection, RTP, doors, networking, and recovery"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Use these checks after installing or updating Wormholes.

## First portal

1. Build a supported frame and create a portal.
2. Confirm `/wormholes list` shows it.
3. Link or configure its destination.
4. Walk through it and confirm the destination is safe and correct.

See [Building Portals](/wormholes/03-building-portals) and [Commands & Permissions](/wormholes/09-commands-permissions).

## Projection

Stand where the source view should be visible and confirm the selected projection mode updates. If it does not, check the portal's mode, quality preset, distance limits, and required packet integration.

## Cross-server travel

Confirm both servers can reach each other's configured endpoint, use matching codes, and trust the same network. Test with a non-production player before opening the route to everyone.

See [Cross-Server Networking](/wormholes/10-cross-server-networking).

## Recovery

Back up Wormholes data before resets or manual restoration. If a reload leaves portals, projections, or tasks in an inconsistent state, restart the server instead of repeating the reload.
