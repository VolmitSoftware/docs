---
title: "Building Portals"
description: "Wand, runes, construction, skins, and vanilla portal replace"
published: true
date: 2026-09-28T20:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Build a flat frame portal with a Portal Wand selection or a connected set of matching runes. Non-flat rune sets are rejected before the blocks are consumed.

## Tools and recipes

| Item | Material | Craft recipe registered? |
|------|----------|--------------------------|
| Portal Wand | Enchanted blaze rod | Yes, `portal_wand` |
| Portal Rune | Enchanted prismarine | No; recognized only for legacy placed items |
| Wormhole Rune | Enchanted dark prismarine | No; supplied by an administrator |

Runes are not craftable. `/wormholes wand` supplies only a Wormhole Rune.
Breaking a tracked Portal or Wormhole rune block returns the matching item in
survival. A tracked legacy Gateway rune block returns a Wormhole Rune; a tracked
RTP rune block returns nothing.

### Craft shapes

**Portal wand** (`portal_wand`):

```
d d
 r
 d
```

`d` = glowstone dust, `r` = blaze rod.

The wand is the only Wormholes recipe outside the Dimensional Door set. Its shape is not configurable. It is in every player's recipe book on join.

### Admin supply

Permission: `wormholes.admin.items`.

| Command | Result |
|---------|--------|
| `/wormholes wand` | One Portal Wand + one wormhole rune |
| `/wormholes wand rune=false` | One Portal Wand only |

`/wormholes wand` is the only source of new Wormhole Runes. It has no rune-type or count argument. Portal type is set later in the type menu.

## Wand box construction

Left-click sets one corner. Right-click sets the other. Either order works. The selection must be one cell thick and at most 4096 cells. A valid selection is a light-blue pane. An invalid one is red. Left-click a block inside the box, or left-click air while aiming at the pane within 64 blocks, to open a `PORTAL` owned by that player. Change the type in the [portal menu](/wormholes/04-portal-types-menus-settings).

Changing world, dropping the wand, or leaving it off the hotbar clears the selection.

Container previews do not select wand corners, open portal menus, apply skins, or unpack door kits. These actions require a player click.

If a wand interaction aims at an existing portal, Wormholes opens that portal’s
menu instead of editing the selection. See Menu access.

Looking at a portal while holding a portal tool shows a short route subtitle
with the portal name and linked destination, or active progress text. Each
portal's Settings menu can enable **Public Look Label** so nearby players without
a portal tool see the portal name when they look at it. Public labels are off by
default and do not expose the linked destination.

## Rune construction

Place Wormhole Runes, or an already placed Portal Rune. A set connects by full faces of the same rune type. Diagonal contact does not connect. The set must be one flat axis-aligned surface. Left-click any rune in the set with the Portal Wand. Wormholes consumes the connected runes and opens a portal of that rune's type, owned by the clicking player.

| Rune type | Resulting `PortalType` |
|-----------|------------------------|
| Portal | `PORTAL` |
| Wormhole | `WORMHOLE` |

There is no Gateway or RTP rune product. Switch a finished portal to `GATEWAY`
or `RTP` from the type menu.

Wormholes rejects non-coplanar sets without consuming them. If a later construction step fails, it restores or refunds the runes. Breaking a placed rune in survival follows the drop policy above; breaking one with the wand is cancelled.

## Surface skin

While you look at a portal, operators and owners may apply a skin:

- Main hand holds a **non-tool** item (not the wand or a portal or wormhole
  rune).
- **Right-click** air or a block with that hand.

| Held item | Skin applied |
|-----------|--------------|
| Water bucket | `minecraft:water` |
| Lava bucket | `minecraft:lava` |
| Any block material | That block’s `BlockData` string |

An empty hand does not apply a skin. Opaque skins **block projection** through
the surface. Transparent and non-occluding skins (glass, ice, water, slime,
honey, barrier, and similar) do not. Clear skins with the settings cosmetics
control. See
[04 - Portal Types Menus & Settings](/wormholes/04-portal-types-menus-settings).

## Menu access

Only the portal owner, ops, or players with `wormholes.admin` may open
management menus.

| Gesture | Action |
|---------|--------|
| Portal Wand, looking at portal, left or right click | Open portal home menu |
| Sneak + empty main hand + right-click a block that is part of or adjoins the portal structure | Open portal home menu |

Destroy: home menu **Destroy** control, **shift-left-click** (not a normal left
click).

## Vanilla nether and end portals

Config: `[main] replace-nether-and-end-portals` in `wormholes.toml`
(default `true`). Hot-reloads with other main gameplay settings.

When enabled, lighting a Nether portal or completing an End portal converts it into a managed Wormholes portal. These portals lock destination, type, and travel settings. Nether pairs work both ways. End sources are outbound-only, with a hidden inbound receiver at the destination.

Shaped Portals can supply irregular Nether openings directly. Wormholes preserves their exact interior shape, creates or reuses a counterpart, and owns projection and travel in both directions. Shaped Portals does not refill these openings with native Nether portal blocks. The source boundary may use Shaped Portals frame materials; generated counterparts use obsidian.

Set `replace-nether-and-end-portals = false` to leave vanilla portals alone and use Shaped Portals standalone behavior.

Conversion needs the player who lit the portal to hold `wormholes.portals.portal`. Without it the
vanilla portal is left unmanaged.

## Permissions used during build

| Node | Default | Role |
|------|---------|------|
| `wormholes.portals` | op | Parent that grants both non-gateway type nodes |
| `wormholes.portals.portal` | op | Construct and type-switch to Portal/RTP |
| `wormholes.portals.wormhole` | op | Construct and type-switch to Wormhole |
| `wormholes.gateway` | op | Create/modify gateway portals |
| `wormholes.admin.items` | op | `/wormholes wand` supplies |

Non-operators cannot construct or type-switch frame portals unless a matching
leaf or its parent is explicitly granted. See
[09 - Commands & Permissions](/wormholes/09-commands-permissions) for the full
tree.

Menus and settings: [Portal types, menus, and settings](/wormholes/04-portal-types-menus-settings). Projection: [Projection modes and settings](/wormholes/05-projection-modes-settings).
