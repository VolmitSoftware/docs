---
title: "Concepts"
description: "Portal types, projection, tunnels, travel, and doors"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Wormholes models frame portals as typed apertures. Each portal can have a
destination tunnel, through-portal projection, and a separate travel and access
policy. Local portals live on this server, and remote gateway portals are
peer-replicated for cross-server pairing. Dimensional Doors and pocket worlds
are a survival path that does not use frame-portal menus.

## Portal types

| `PortalType` | Role |
|--------------|------|
| `PORTAL` | Linkable frame portal. Default type for wand box construction. |
| `WORMHOLE` | Linkable frame portal (same projection capability as `PORTAL`). |
| `GATEWAY` | Cross-server capable type. Pairs with other gateway locals and remote gateways. Uses export/import codes. |
| `RTP` | Random teleport portal. No destination tunnel. The RTP service samples the destination. |

`LocalPortal.supportsProjections()` is `true` for every type. A normal portal
projects only when projection mode is `ON` and the portal is open. The surface
must not block projection. The portal must have a tunnel or mirror mode. An RTP
portal also needs an authorized READY destination view for that observer. The
menu may describe `PORTAL` as basic and `WORMHOLE` as viewport projection. Both
types can project under the same conditions. See
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

- **PanOptic:** full aperture sample. No buried-cell culling or observer
  occlusion path that Venticular uses.
- **Venticular:** uses buried-cell culling and observer occlusion
  (`usesBuriedCellCulling` / `usesObserverOcclusion`).

Projection detail, budgets, and global ranges:
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
- Managed dimensional portals (`DimensionalPortalKind` ≠ `NONE`) refuse manual
  re-linking.

## Mirror mode

Mirror mode reflects the local world through the portal. Travel is locked. The
menu shows travel locked. If you enable mirror:

- Wormholes clears any tunnel.
- Managed-portal mirror is disabled for dimensional kinds.
- If the portal was `RTP`, Wormholes converts the type to `PORTAL`.

Mirror rotation is `0` / `90` / `180` / `270` degrees. Quarter turns (90/270)
apply only when the portal frame normal is vertical. Non-vertical frames coerce
90 to 0 and 270 to 180.

## Travel modes

Travel is stored as two booleans (`outgoingTraversalsEnabled`,
`incomingTraversalsEnabled`) and shown as:

| Mode | Outgoing | Incoming |
|------|----------|----------|
| `BOTH` | yes | yes |
| `OUTBOUND` | yes | no |
| `INBOUND` | no | yes |
| `LOCKED` | no | no |

A new portal defaults to both directions enabled (`BOTH`). Mirror mode and
managed dimensional kinds override or freeze this control in the menu.
Vanilla-managed nether/end portals keep fixed travel rules. See
[03 - Building Portals](/wormholes/03-building-portals) and vanilla replace.

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

Operators (`isOp`) always pass the portal permission check. Menu management
(open settings, destroy, skin) needs a portal owner UUID match, op, or
`wormholes.admin`.
