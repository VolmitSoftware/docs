---
title: "Overview"
description: "Wormholes portal types and where each system is configured"
published: true
date: 2026-09-28T20:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

A frame portal has a type, a destination or mirror, a projection mode, a travel direction, and an access policy. Projection changes one player's view through the aperture. Travel is a separate check: direction, access, cooldown, cost, destination readiness, and any API veto.

| Type | Use | Construction permission |
|---|---|---|
| `PORTAL` | Linked frame. Wand selections start as this type | `wormholes.portals.portal` |
| `WORMHOLE` | Linked frame created from a Wormhole Rune, or selected in the menu | `wormholes.portals.wormhole` |
| `GATEWAY` | Cross-server portal. Uses import and export codes | `wormholes.gateway` |
| `RTP` | Random teleport. No tunnel | `wormholes.portals.portal` |

Dimensional Doors are a separate system. They do not use frame types, names, or destinations. Personal and public doors open rooms in `wormholes:pockets`. Pair doors link two placed endpoints.

Rules: [Concepts](/wormholes/02-concepts). Files and keys: [Installation and configuration](/wormholes/01-installation-configuration).
