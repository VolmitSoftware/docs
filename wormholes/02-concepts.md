---
title: "Concepts"
description: "Portal types, projection, tunnels, travel, and doors"
published: true
date: 2026-10-08T12:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Each frame portal has a type, destination, projection mode, travel direction, and access policy. Gateways connect servers. Dimensional Doors and pockets use a separate system.

## Portal types

| `PortalType` | Role |
|--------------|------|
| `PORTAL` | Linkable frame portal. Default type for wand box construction. |
| `WORMHOLE` | Linkable frame portal (same projection capability as `PORTAL`). |
| `GATEWAY` | Connects local or discovered remote gateways. Supports pairing with signed gateway codes. |
| `RTP` | Random teleport portal. No destination tunnel. The RTP service samples the destination. |

Every frame type can project when the portal is open, projection is on, and its surface does not block the view. A normal portal needs a destination or mirror mode; an RTP portal needs a ready destination. `PORTAL` and `WORMHOLE` follow the same projection rules. See
[05 - Projection Modes & Settings](/wormholes/05-projection-modes-settings).

RTP cannot be a tunnel destination. If you switch a portal to `RTP` or away
from `RTP`, Wormholes force-closes it and clears the tunnel. The portal stays
closed until RTP is READY or a new tunnel is set. There is no RTP or Gateway
rune product. Wand box construction creates `PORTAL`; Wormhole Runes create
`WORMHOLE`; already-placed legacy Portal Runes can still create `PORTAL`.
Choose `GATEWAY` or `RTP` later in the type menu.

## Projection mode vs render mode

| Control | Values | Meaning |
|---------|--------|---------|
| `ProjectionMode` | `ON`, `OFF` | Whether this portal produces a through-view for interested observers. Default `ON`. |
| `ProjectionRenderMode` | `PANOPTIC`, `VENTICULAR` | How the projector samples and culls cells. Default `VENTICULAR`. |

PanOptic samples the aperture without buried-cell culling or observer occlusion. Venticular uses both.

Projection budgets and ranges:
[05 - Projection Modes & Settings](/wormholes/05-projection-modes-settings).

## Tunnels and destinations

A tunnel binds a portal to a destination. Tunnel kinds in storage:

| `TunnelType` | Use |
|--------------|-----|
| `LOCAL` | Same-world portal-to-portal link |
| `UNIVERSAL` | Cross-server gateway link (peer server name on the tunnel) |
| `DIMENSIONAL` | Cross-world same-server link. Also used by managed vanilla nether/end pairs |

Linking rules for operators:

- Destination lists are same-class portals in any loaded world (non-gateway vs
  gateway). Same-world links store `LOCAL`. Cross-world same-server links store
  `DIMENSIONAL`. Gateways also list remote `GATEWAY` entries when the remote
  registry is live (`UNIVERSAL`).
- Links are one-way. If you set A’s destination to B, Wormholes does not create
  B→A.
- If mirror mode is enabled, it rejects destination linking and clears any
  existing tunnel.
- A managed Nether or End portal refuses manual re-linking.

## Mirror mode

Mirror mode reflects the local world through the portal. Travel is locked. The
menu shows travel locked. If you enable mirror:

- Wormholes clears any tunnel.
- Managed-portal mirror is disabled for dimensional kinds.
- If the portal was `RTP`, Wormholes converts the type to `PORTAL`.

Floor and ceiling mirrors rotate in 90-degree steps. Wall mirrors switch between `0` and `180` degrees for every player, including players running the client mod.

## Travel modes

The menu offers these travel modes:

| Mode | Outgoing | Incoming |
|------|----------|----------|
| `BOTH` | yes | yes |
| `OUTBOUND` | yes | no |
| `INBOUND` | no | yes |
| `LOCKED` | no | no |

A new portal defaults to both directions enabled (`BOTH`). Mirror mode and
managed dimensional kinds override or freeze this control in the menu.
Operators bypass the outgoing and incoming direction flags during player
travel, but mirror mode remains a hard travel lock. Vanilla-managed nether/end
portals keep fixed travel rules. See
[03 - Building Portals](/wormholes/03-building-portals) and vanilla replace.

## Traversal modes

Frame portals and dimensional doors check direction, access, cooldown, cost, and destination readiness before moving a traveler, then teleport it. A player with the [client mod](/wormholes/01-installation-configuration#client-mod) gets one of two smoother transitions. On Paper, Purpur, and Folia the client prepares the arrival area before the crossing, so a ready crossing shows no loading screen while the server still teleports the player. On Fabric, Forge, and NeoForge servers and in singleplayer the player crosses seamlessly: the client predicts the crossing, the server checks it, and there is no teleport, respawn, loading screen, or frame-portal cooldown, so the player can cross straight back. Players with the mod on those servers also see entities pass smoothly through frame portals within the same world. Players riding or carrying a passenger, random teleport, and cross-server travel use the ordinary teleport. Details: [Travel with the client mod](/wormholes/05-projection-modes-settings#travel-with-the-client-mod).

## Size ratios and traveller scale

Linked portals may differ in size. The size ratio of a pair is the destination's cell count divided by the source's along each axis of the link; a 3×3 portal linked to a 9×9 has a ratio of 3. By default the ratio changes nothing: position and velocity carry over 1:1. The entered portal's **Traveller scale** rule in its Transit menu can instead map position and velocity by the ratio (`motion`), or also multiply the traveller's size by it within a clamp (`ratio`), so a player who walks through the small portal comes out three times larger and three times faster and returns to normal by walking back through a pair that uses the same rule. Random teleport portals and cross-server gateways never scale. See [Transit menu](/wormholes/04-portal-types-menus-settings#transit-menu).

## Local vs remote portals

| Kind | Storage / identity | Destination use |
|------|--------------------|-----------------|
| Local | This server’s portal files and runtime registry | Link target for same type (gateway vs non-gateway) |
| Remote | Replicated gateway metadata from a peer | Appears in gateway destination menus. Traversal is `CROSS_SERVER` |

A portal is a gateway when `type == GATEWAY`. Remote entries are only
gateway-typed.

## Dimensional doors vs frame portals

| | Frame portals | Dimensional doors |
|--|---------------|-------------------|
| Construction | Wand box or coplanar runes. Menus | Crafted door/trapdoor items |
| Surface | Block aperture with optional surface skin | Vanilla door/trapdoor threshold while OpenState matches |
| Menus | Full portal home/settings/type menus | Compact access + OpenState UI on sneak empty-hand |
| Config gate | Always available | `[main] dimensional-doors-enabled` (default true) |

Doors do not become frame `PortalType` entries. Details:
[07 - Dimensional Doors](/wormholes/07-dimensional-doors).

## Pocket dimensions (summary)

Personal and public dimensional doors resolve into a shared pocket void
dimension with a return door. Layout, rescue, and retention are in
[08 - Pocket Dimensions](/wormholes/08-pocket-dimensions). Pair doors link two
overworld endpoints without a pocket.

## Traversal kinds (API)

Public `TraversalKind` values for cost providers and events
([21 - API - Traversal Cost & Events](/wormholes/21-api-traversal-cost-events)):

| Kind | Meaning |
|------|---------|
| `LOCAL` | Same-server frame portal traversal |
| `CROSS_SERVER` | Gateway handoff to another server |
| `RANDOM_TELEPORT` | RTP portal trip |
| `DIMENSIONAL_DOOR` | Dimensional door / pocket transit |

If `[main] traversal-api-enabled` is false, new traversals skip third-party cost
providers and the pre-traversal event. Tickets opened before the switch still
settle or expire on their traveler owner and may fire the completion event.

## Access policy (frame portals)

Per-portal permission node: `wormholes.portal.<sanitizedName>`. See
[04 - Portal Types Menus & Settings](/wormholes/04-portal-types-menus-settings).

| `PortalPermissionMode` | Rule (non-op players) |
|------------------------|------------------------|
| `BLACKLIST` (default) | Players **with** the node are blocked |
| `WHITELIST` | Players need the node to use the portal |

Operators always pass the portal permission and travel-direction
checks. Mirror state, portal topology, cooldowns, safety validation, configured
travel costs, and external integration decisions still apply. Opening settings and destroying a portal require ownership, operator status, or `wormholes.admin`. Setting or clearing a surface skin requires the exact `wormholes.admin` permission, including through menus.
