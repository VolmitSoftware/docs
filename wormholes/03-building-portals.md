---
title: "Building Portals"
description: "Wand, runes, construction, skins, and vanilla portal replace"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Frame portals are coplanar apertures. Build them with the Portal Wand (box
select) or by placing and activating matching runes. Construction always makes
a flat structure. Wormholes rejects a non-flat rune set before it consumes the
blocks. Surface skins, menu access, and optional vanilla nether/end replacement
attach after the portal exists.

## Tools and recipes

| Item | Material | Craft recipe registered? |
|------|----------|--------------------------|
| Portal Wand | Enchanted blaze rod | Yes — `portal_wand` |
| Portal rune | Enchanted prismarine | Yes — `portal_rune` (yields 4) |
| Wormhole rune | Enchanted dark prismarine | Yes — `wormhole_rune` (yields 4) |
| Gateway rune | Enchanted black stained glass | No — admin supply only |

### Craft shapes

**Portal wand** (`portal_wand`):

```
d d
 r
 d
```

`d` = glowstone dust, `r` = blaze rod.

**Portal rune** (`portal_rune`, 4):

```
p b p
b d b
p b p
```

`p` = ender pearl, `b` = prismarine crystals, `d` = blaze powder.

**Wormhole rune** (`wormhole_rune`, 4):

```
p b p
b d b
p b p
```

`p` = eye of ender, `b` = prismarine shard, `d` = nether star.

Admin give remains available for all runes.

### Admin supply

Permission: `wormholes.admin.items`.

| Command | Result |
|---------|--------|
| `/wormholes wand` | One Portal Wand + one wormhole rune |
| `/wormholes wand rune=portal count=N` | Portal runes (N clamped 1–64) |
| `/wormholes wand rune=wormhole count=N` | Wormhole runes |
| `/wormholes wand rune=gateway count=N` | Gateway runes |

Aliases: `/wh`, `/wormhole`. Full command list:
[09 - Commands & Permissions](/wormholes/09-commands-permissions).

## Wand box construction

1. Hold the Portal Wand in the main hand.
2. **Left-click** a block for corner A. **Right-click** a block for corner B
   (or the reverse order).
3. The selection must be one cell thick on one axis (flat wall, floor, or
   ceiling plane). Max **4096** cells.
4. If the selection is valid and complete, **left-click** the selection to
   open the portal. Click a block inside the box, or aim at the selection pane
   within 64 blocks.
5. The aperture is the live world blocks currently in that box
   (`world.getBlockAt` for every cell). Construction always creates
   `PortalType.PORTAL` owned by the player UUID. Change type later in the type
   menu ([04 - Portal Types Menus & Settings](/wormholes/04-portal-types-menus-settings)).

The selection UI is a light-blue pane while valid. The pane is red when the
selection is not flat or is too large. If you change world, drop or swap off
the wand, or change hotbar away from the wand, Wormholes clears the selection.

If a wand interaction aims at an existing portal, Wormholes opens that portal’s
menu instead of editing the selection. See Menu access.

## Rune construction

1. Place portal, wormhole, or gateway runes. Any 6-face-connected shape of the
   **same** rune type works (rectangles, lines, L-shapes, single blocks, and
   similar). Diagonal contact alone does not connect sets.
2. All runes of the connected set must be **coplanar** (one flat axis-aligned
   surface).
3. Hold the Portal Wand and **left-click** any rune block in the set.
4. Wormholes reserves connected same-type runes, consumes them to air, and
   opens a portal of that rune’s type, owned by the clicking player.

| Rune type | Resulting `PortalType` |
|-----------|------------------------|
| Portal | `PORTAL` |
| Wormhole | `WORMHOLE` |
| Gateway | `GATEWAY` |

There is no RTP rune product. Wand and rune construction create `PORTAL`,
`WORMHOLE`, or `GATEWAY` only. Switch a finished portal to RTP from the type
menu.

Wormholes rejects non-coplanar connected sets before consumption. The placed,
tracked runes stay in the world. If construction fails after a valid set has
been reserved and consumed, rollback restores or refunds the matching runes
and releases their reservations. Breaking a placed rune in survival returns
the matching rune item. Breaking with the wand is cancelled.

## Surface skin

While you look at a portal, operators and owners may apply a skin:

- Main hand holds a **non-tool** item (not the wand or a portal, wormhole, or
  gateway rune).
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

Config: `[main] replace-nether-and-end-portals` in `config/wormholes.toml`
(default `true`). Hot-reloads with other main gameplay settings.

If this is enabled, lighting a vanilla nether portal converts the nether
portal cells into managed Wormholes portals with dimensional pairing. Related
create reasons the replacer handles follow the same conversion. End portal
windows are intercepted the same way. Vanilla portal events are cancelled when
the Wormholes index covers them.
Travel is cancelled as soon as create or eye-place registers pending cells
(`VanillaPortalIndex` pending coverage), before the pairing pass finishes.
Managed portals use `DimensionalPortalKind` (`NETHER`, `END_SOURCE`,
`END_ARRIVAL`) and lock manual destination, type, and travel edits. Nether
pairs travel both ways. An End source is outbound-only. Its fixed arrival
receiver is inbound-only with projection off.

Set `replace-nether-and-end-portals = false` to leave vanilla portals alone.

Conversion is player-authorized. Lighting a Nether portal or inserting the
completing Ender Eye produces a managed Wormholes portal only when that player
may construct `PORTAL` portals. Otherwise the vanilla portal stays unmanaged.
Automatic Nether counterpart creation is accepted only when the responsible
player carries the same permission.

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

## Quick path

1. Admin: `/wormholes wand` (or craft wand + runes).
2. Place coplanar runes **or** box-select with the wand and left-click to open.
3. Open the menu (wand look-click or sneak empty-hand right-click on the frame).
4. Set type if needed. Pick a destination (or RTP editor / gateway codes). Then
   walk through.

Related: types and settings in
[04 - Portal Types Menus & Settings](/wormholes/04-portal-types-menus-settings).
Projection in
[05 - Projection Modes & Settings](/wormholes/05-projection-modes-settings).
