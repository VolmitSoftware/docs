---
title: "Portal Types, Menus, and Settings"
description: "Types, menus, travel, access, costs, and cosmetics"
published: true
date: 2026-09-17T06:30:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Each frame portal has menus for its type, orientation, destination, settings, cost, and appearance. The defaults below apply to new portals. Concepts:
[02 - Concepts](/wormholes/02-concepts). Construction:
[03 - Building Portals](/wormholes/03-building-portals).

## Default settings

| Setting | Default | Notes |
|---------|---------|-------|
| `projectionMode` | `ON` | Toggle on home menu |
| `renderMode` | `VENTICULAR` | PanOptic / Venticular cycle |
| `mirrorMode` | `false` | Set from type menu |
| `mirrorRotation` | `0°` | 90° steps. Vertical frames only for 90/270 |
| `permissionMode` | `BLACKLIST` | See Access |
| `outgoingTraversalsEnabled` | `true` | Travel mode `BOTH` |
| `incomingTraversalsEnabled` | `true` | Travel mode `BOTH` |
| Network view quality | `STANDARD` | Depth 64, heartbeat 60, entity interval 10, grace 30s |
| `networkViewLateralPad` | `48` | Clamped 0–64 (not in preset table. Persists) |
| `networkViewFallbackBlock` | `minecraft:air` | Invalid chat input resets to air |
| `blackoutBackground` | `false` | |
| `blackoutColor` | `BLACK` | Concrete color enum |
| `activationRange` | `0` | `0` = use global `Settings.PROJECTION_RANGE` (default 48) |
| `ambientStyle` | `SPARKS` | `SPARKS` / `OUTLINE` / `CORNERS` / `OFF` |
| `ambientColor` | `0xB969FF` | RGB 0–0xFFFFFF |
| `surfaceSkin` | empty | No skin |
| `publicLookLabel` | `false` | Off keeps look subtitles portal-tool only |
| `travelCost` | free (`null`) | Free / vanilla item / Vault |
| `settingsSyncEnabled` | `true` | Broadcast settings to linked/remote when applicable |

### Network view quality presets

Cycle order: Standard → Performance → Balanced → Cinematic → Custom → Standard.

| Preset | Depth | Heartbeat (ticks) | Entity interval (ticks) | Unsubscribe grace (s) |
|--------|-------|-------------------|-------------------------|------------------------|
| `STANDARD` | 64 | 60 | 10 | 30 |
| `PERFORMANCE` | 32 | 100 | 20 | 10 |
| `BALANCED` | 64 | 40 | 5 | 30 |
| `CINEMATIC` | 96 | 20 | 2 | 45 |
| `CUSTOM` | operator-set | operator-set | operator-set | operator-set |

Custom clamps when you edit numbers: depth 1–128, heartbeat 2–600, entity
interval 2–600, grace 5–600. Menu step controls use smaller UI steps (for
example depth ±4/±16).

If you select a non-custom preset, Wormholes overwrites depth, heartbeat,
entity interval, and grace to that preset. Values that match no preset resolve
as `CUSTOM` on load.

### Activation range

- `0` means the global projection range from config (`projection.range`, default 48
  blocks).
- Positive values are clamped to **8–256** blocks.

### Settings sync

Settings Sync copies supported changes to linked local portals and gateways. When disabled, edits stay local. `publicLookLabel` is never copied.

## Per-portal permission node

Node: `wormholes.portal.<key>`. The access key starts from the sanitized portal name and remains stable when the portal is renamed. Set it with `/wh access key <portal> <key>` or the Access menu. With `[access] legacy-name-node-enabled = true` (default), the current name-derived node is also accepted as an alias.

Sanitization works as follows:

1. Convert the portal name to lower case.
2. Keep `a-z`, `0-9`, `.`, `-`, and `_`.
3. Collapse other characters to `_`.
4. Trim leading and trailing underscores. If the result is empty, use `unnamed`.

| Mode | Effect without OP or `*` bypass |
|------|---------------------------|
| `BLACKLIST` | Holding the node **blocks** use |
| `WHITELIST` | Holding the node **allows** use |

When the name alias is enabled, either node counts. A scoped wildcard grant that matches the node can block an ordinary player in `BLACKLIST` mode. The literal `*` permission bypasses this check. Public portals normally use `BLACKLIST` without granting the matching nodes to ordinary travelers. Restricted portals use `WHITELIST` with explicit grants. Check effective permissions on both backends for cross-server travel.

Access roles and groups add another gate. A `DENIED` role refuses the player. Adding a trusted player role makes the role list a whitelist. Trusted players, the owner, and players with an allowed group node pass that gate. These access grants also satisfy the frame permission gate. Direction checks still apply. Land-claim and integration checks can also reject travel.

OP players and holders of the literal `*` permission bypass portal roles, permission mode, and outgoing/incoming direction restrictions. A gateway carries source-side privilege for that crossing, even when the destination grants neither OP nor `*`. It does not change destination permissions. The return trip uses permissions on the server the player leaves. Mirror mode remains travel locked. Portal topology, cooldowns, RTP safety, configured travel costs, and
external integration decisions are not bypassed. Cycle permission mode in
Settings. The whitelist/blacklist node is **players only**. Non-player entities
always pass the portal permission check.

## Home menu

Open the home menu with a wand look-click, or sneak and right-click the frame
with an empty hand
([03 - Building Portals](/wormholes/03-building-portals)). You must be owner
or admin.

| Control | Action |
|---------|--------|
| Placard | Name, type/mode, facing, destination or RTP summary |
| Destination | Local destination list. Gateway pair submenu. Or RTP editor when type is RTP |
| Rename | Chat name prompt |
| Projection | Cycle `ON` / `OFF` |
| Settings | Opens settings menu |
| Orientation | Facing / flip / rotate submenu |
| Type | Type and mirror submenu |
| Destroy | **Shift-left-click** to destroy the portal |

Managed dimensional portals refuse destination and type changes with managed
notices.

## Destination menu

Blocked for RTP, mirror mode, and managed dimensional portals.

The list is paged: 45 destinations per page across five rows. The bottom row
holds a Sort button and a page indicator with the total destination count.
Previous Page and Next Page arrows appear only when another page exists.
Left-clicking Sort cycles the ordering:

| Sort mode | Order |
|-----------|-------|
| Smart | Linked destination first, then locals by distance, then remote gateways (open first) |
| Name | Portal name A-Z |
| World | World or server name, then portal name |
| Distance | Nearest first. Remote and cross-world entries sort last |

Smart is the default. Sort mode and page reset each time the menu opens.

**Non-gateway:** lists other non-gateway local portals that are generic
destinations, in any loaded world. Left-click links or unlinks this portal
only.

**Gateway:** lists other local gateways in any loaded world, then remote
gateway entries (server name, coords, open/closed). Gateway home destination
control opens a pair menu:

| Pair control | Action |
|--------------|--------|
| Export | Print invite/export code to chat |
| Choose destination | Open destination list (local gateways + remotes) |
| Import | Chat prompt for peer invite code |

Same-world links store `LOCAL`. Cross-world same-server links store
`DIMENSIONAL`. Remotes store `UNIVERSAL`. Links are one-way. A→B does not
create B→A.

Cross-server handoff detail:
[10 - Cross-Server Networking](/wormholes/10-cross-server-networking).

Linked frame arrivals place the traveler 1.25 blocks clear of the exit plane along its normal. Jumping, falling, or strafing does not change that clearance axis. The configured momentum policy still controls the outgoing velocity.

Player capture checks the movement segment since the previous portal check, including players who have just left its capture area. Several movement packets in one slow tick cannot skip a straight crossing. Teleports, reconnects, respawns, portal closure, and destination changes invalidate that history. The outgoing momentum uses the latest movement packet rather than the accumulated capture distance.

## Type menu

Options: `PORTAL`, `WORMHOLE`, `GATEWAY`, `RTP`, and **Mirror**.

| Choice | Effect |
|--------|--------|
| Portal / Wormhole / Gateway / RTP | Sets type and disables mirror mode if it was on. Switching to or from `RTP` force-closes the portal until RTP is READY or a new tunnel is set. |
| Mirror | Enables mirror mode (travel locked. Tunnel cleared). Right-click rotates the mirror image clockwise. Shift-right-click rotates counterclockwise. |

RTP editor entry lives on the home destination control when type is RTP
([06 - Random Teleport Portals](/wormholes/06-random-teleport-portals)).

Menu descriptions (localized): Portal = basic linkable. Wormhole = linkable
with viewport projection. Gateway = cross-network. RTP = local random teleport.
Mirror = reflect local world with travel locked. Runtime projection capability
is still ON/OFF for all types
([02 - Concepts](/wormholes/02-concepts)).

## Settings menu

| Control | Behavior |
|---------|----------|
| Permission mode | Cycle blacklist/whitelist. Shows node |
| Travel direction | Cycle BOTH / OUTBOUND / INBOUND / LOCKED (disabled under mirror / managed) |
| Stream quality | Cycle network view presets. Shift-left opens advanced layout with custom numbers |
| Settings sync | Toggle on/off |
| Blackout | Left toggles background. Right opens color picker (16 concrete colors) |
| Ambient particles | Left cycles style. Right opens RGB/dye color menu |
| Surface skin | Menu control for skin display/clear (in-world apply in `03`) |
| Activation range | ±8 / ±32 steps. Below 8 snaps to global (`0`) |
| Render mode | Cycle PanOptic / Venticular |
| Public look label | Toggle whether nearby players without a portal tool see this portal's name while looking at it. Off by default |
| Travel cost | Opens cost menu |
| Fallback block | Chat block-state string (custom quality layout / advanced) |
| More settings | Opens portal extension controls, including Access |

Select More settings, then Access, to edit player roles, allowed groups, the stable permission key, and public-directory visibility.

Custom quality expands the window to show depth, full-refresh ticks, entity
interval, and view grace editors.

Portal-tool holders always retain the route subtitle, including the linked
destination or active progress text. A player without a portal tool sees only
the portal name, and only when Public Look Label is On.

## Travel cost menu

| Mode | How to set | Requirement |
|------|------------|-------------|
| Free | Select free | Default |
| Vanilla item | Capture held item template. Set quantity | Quantity adjustable ±1 / ±8 |
| Vault | Chat amount | Soft-depend Vault economy available |

Invalid stored travel cost loads as free and logs a warning. Third-party
`TraversalCostProvider` is separate
([21 - API - Traversal Cost & Events](/wormholes/21-api-traversal-cost-events))
and gated by `[main] traversal-api-enabled`.

Vanilla-item and Vault charges commit only after successful travel. Failed travel refunds the reserved item or balance.

## Orientation menu

| Control | Effect |
|---------|--------|
| Direction | Cycle facing |
| Flip face | Invert portal face |
| Rotate CCW | Separate button. Rotates the frame counter-clockwise |
| Rotate CW | Separate button. Rotates the frame clockwise |

These controls affect which way travelers face and how projection maps space.
Mirror image rotation is on the type-menu Mirror control (right / shift-right),
not these buttons.

## Cosmetics and blackout

Active portal surfaces do not emit repeating portal or lava ambience. Projection synchronization is silent. Deliberate open, close, and traversal effects retain their sounds.

| Ambient style | Icon material (menu) |
|---------------|----------------------|
| `SPARKS` | Firework star |
| `OUTLINE` | Blaze rod |
| `CORNERS` | End rod |
| `OFF` | Glass |

Ambient RGB controls change a channel by 8 per click or 32 while shifting. The
color picker also provides 16 dye presets. Left-click the surface-skin control
to clear the skin. Right-click it to open the Glass/Clear choices.

Blackout adds a concrete-colored background behind the projected view. The far boundary and the exposed floor, ceiling, and sides of the view are sent as concrete blocks through the same block updates as the rest of the projection, so the shell is present from the first frame and while the viewer moves. Destination blocks that are already opaque are left as they are. Opaque surface skins block projection.

## Behavior notes

- Destroy needs **shift-left-click** on the destroy element. A normal
  left-click does not delete.
- Wand box construction always starts as type `PORTAL` regardless of intent.
  Wormhole Runes form `WORMHOLE`; already-placed legacy Portal Runes can still
  form `PORTAL`.
- There is no Gateway rune. Switch an existing portal to `GATEWAY` in the type
  menu.
- All frame types can project. Use projection mode OFF to disable the view.
  Construction and type changes need `wormholes.portals.portal` (PORTAL/RTP),
  `wormholes.portals.wormhole` (WORMHOLE), or `wormholes.gateway` (GATEWAY).
  Traversal uses the portal's dynamic access policy instead.
- If you enable mirror while type is RTP, Wormholes converts the portal to
  `PORTAL`.
- RTP and gateway destination menus are mutually exclusive paths. RTP cannot
  tunnel-link.
- Per-portal permission blacklist is the default. The node denies. It does not
  grant. That policy applies to players only.
