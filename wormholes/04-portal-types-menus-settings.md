---
title: "Portal Types Menus & Settings"
description: "Types, menus, travel, access, costs, and cosmetics"
published: true
date: 2026-08-21T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Each local frame portal has a home menu and nested type, orientation,
destination, settings, cost, and cosmetics screens. Defaults below match a
newly constructed portal (`LocalPortalSettings` constructor). Concepts:
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

- `0` — global projection range from config (`projection.range`, default 48
  blocks).
- Positive values are clamped to **8–256** blocks.

### Settings sync

If settings sync is enabled, Wormholes broadcasts setting changes through the
portal sync service. Linked locals and gateway peers receive those changes when
they apply. If settings sync is disabled, local edits stay local. Gateway
portals also emit a settings-toggle broadcast on enable and disable.

## Per-portal permission node

Node: `wormholes.portal.<sanitizedName>`.

Sanitization works as follows:

1. Convert the portal name to lower case.
2. Keep `a-z`, `0-9`, `.`, `-`, and `_`.
3. Collapse other characters to `_`.
4. If the result is empty, use `unnamed`.

| Mode | Effect for non-op players |
|------|---------------------------|
| `BLACKLIST` | Holding the node **blocks** use |
| `WHITELIST` | Holding the node **allows** use |

Ops always pass. Cycle mode in Settings. The whitelist/blacklist node is
**players only**. Non-player entities always pass the portal permission check.

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
| Travel cost | Opens cost menu |
| Fallback block | Chat block-state string (custom quality layout / advanced) |

Custom quality expands the window to show depth, full-refresh ticks, entity
interval, and view grace editors.

## Travel cost menu

| Mode | How to set | Requirement |
|------|------------|-------------|
| Free | Select free | Default |
| Vanilla item | Capture held item template. Set quantity | Quantity adjustable ±1 / ±8 |
| Vault | Chat amount | Soft-depend Vault economy available |

Invalid stored travel cost loads as free and logs a warning. Third-party
`TraversalCostProvider` is separate
([21 - API - Traversal Cost & Events](/wormholes/21-api-traversal-cost-events))
and gated by `traversalApiEnabled`.

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

| Ambient style | Icon material (menu) |
|---------------|----------------------|
| `SPARKS` | Firework star |
| `OUTLINE` | Blaze rod |
| `CORNERS` | End rod |
| `OFF` | Glass |

Ambient RGB controls change a channel by 8 per click or 32 while shifting. The
color picker also provides 16 dye presets. Left-click the surface-skin control
to clear the skin. Right-click it to open the Glass/Clear choices.

Blackout builds a concrete display seal from the farthest valid slice of the
projected volume. That seal stops the client from seeing beyond the sampled
view. If that display cannot be sent safely, projection continues without the
seal. Opaque surface skins block projection entirely (`blocksProjection`).

## Behavior notes

- Destroy needs **shift-left-click** on the destroy element. A normal
  left-click does not delete.
- Wand box construction always starts as type `PORTAL` regardless of intent.
  Change type in the type menu or build with the matching rune.
- There is no gateway rune. Build with either rune and switch the portal to
  `GATEWAY` in the type menu.
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
