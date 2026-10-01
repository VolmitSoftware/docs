---
title: "Building Portals"
description: "Wand, runes, construction, skins, and vanilla portal replace"
published: true
date: 2026-10-01T10:06:50.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Build a flat frame portal with a Portal Wand selection or a connected set of matching runes. Non-flat rune sets are rejected before the blocks are consumed.

Build the surrounding physical frame from ordinary blocks, such as deepslate tiles or cut sandstone. Both methods below create the opening inside that frame and leave its border in place. The border is decorative: Wormholes does not generate one or require a particular frame material.

## Tools and recipes

| Item | Material | Craft recipe registered? |
|------|----------|--------------------------|
| Portal Wand | Enchanted blaze rod | Yes, `portal_wand` |
| Portal Rune | Enchanted prismarine | No; recognized only for legacy placed items |
| Wormhole Rune | Enchanted dark prismarine | No; supplied by an administrator |

Runes are not craftable. `/wormholes wand` gives one Portal Wand and one Wormhole Rune; it does not supply other rune types.
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

To supply nine runes for a 3×3 opening in survival, an administrator can run `/wormholes wand` nine times and distribute the nine rune items.

## Wand box construction

<div class="wormholes-demo" data-demo="wand-creation">
<div class="wormholes-demo-variant" data-client="standard">
<p>WITHOUT Wormholes mod</p>
<video src="/wormholes-assets/demos/wand-creation-standard-pov.webm" aria-label="WITHOUT Wormholes mod, first person demonstration" muted loop playsinline controls preload="none"></video>
<video src="/wormholes-assets/demos/wand-creation-standard-observer.webm" aria-label="WITHOUT Wormholes mod, third person demonstration" muted loop playsinline controls preload="none"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>WITH Wormholes mod</p>
<video src="/wormholes-assets/demos/wand-creation-clientview-pov.webm" aria-label="WITH Wormholes mod, first person demonstration" muted loop playsinline controls preload="none"></video>
<video src="/wormholes-assets/demos/wand-creation-clientview-observer.webm" aria-label="WITH Wormholes mod, third person demonstration" muted loop playsinline controls preload="none"></video>
</div>
</div>

Left-click sets one corner. Right-click sets the other. Either order works. The selection must be one cell thick and at most 4096 cells. A valid selection is a light-blue pane. An invalid one is red. Left-click a block inside the box, or left-click air while aiming at the pane within 64 blocks, to open a `PORTAL` owned by that player. Change the type in the [portal menu](/wormholes/04-portal-types-menus-settings).

For a framed 3×3 opening:

1. Build a complete border around an opening three blocks wide and three blocks high.
2. Put temporary glass blocks in the bottom-left and top-right cells of the opening, in the same plane. These mark the opening's corners; do not select the outer frame.
3. Hold the Portal Wand. **Left-click** the bottom-left marker, then **right-click** the top-right marker. The light-blue pane covers the nine cells of the opening.
4. **Left-click** while aiming at the selected pane to form the portal.
5. Switch away from the wand and remove the two glass markers. Ordinary selection blocks remain until you break them; leave the surrounding frame intact.

The portal can show its destination after you [link it to another portal](/wormholes/04-portal-types-menus-settings#destination-menu). `PORTAL` and `WORMHOLE` both support projection.

Changing world, dropping the wand, or leaving it off the hotbar clears the selection.

Container previews do not select wand corners, open portal menus, apply skins, or unpack door kits. These actions require a player click.

On Bukkit, Fabric, Forge, and NeoForge, left- or right-clicking while aiming the wand at an existing portal opens its menu instead of editing the selection. The aperture can be empty air; a solid block behind it is not required. See Menu access.

Looking at a portal while holding a portal tool shows a short route subtitle
with the portal name and linked destination, or active progress text. Each
portal's Settings menu can enable **Public Look Label** so nearby players without
a portal tool see the portal name when they look at it. Public labels are off by
default and do not expose the linked destination.

## Rune construction

<div class="wormholes-demo" data-demo="rune-creation">
<div class="wormholes-demo-variant" data-client="standard">
<p>WITHOUT Wormholes mod</p>
<video src="/wormholes-assets/demos/rune-creation-standard-pov.webm" aria-label="WITHOUT Wormholes mod, first person demonstration" muted loop playsinline controls preload="none"></video>
<video src="/wormholes-assets/demos/rune-creation-standard-observer.webm" aria-label="WITHOUT Wormholes mod, third person demonstration" muted loop playsinline controls preload="none"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>WITH Wormholes mod</p>
<video src="/wormholes-assets/demos/rune-creation-clientview-pov.webm" aria-label="WITH Wormholes mod, first person demonstration" muted loop playsinline controls preload="none"></video>
<video src="/wormholes-assets/demos/rune-creation-clientview-observer.webm" aria-label="WITH Wormholes mod, third person demonstration" muted loop playsinline controls preload="none"></video>
</div>
</div>

Place Wormhole Runes, or an already placed Portal Rune. A set connects by full faces of the same rune type. Diagonal contact does not connect. The set must be one flat axis-aligned surface. Left-click any rune in the set with the Portal Wand. Wormholes consumes the connected runes and opens a portal of that rune's type, owned by the clicking player.

For a framed 3×3 opening:

1. Obtain a Portal Wand and nine **Wormhole Runes**. These are the named, enchanted items supplied by an administrator; ordinary dark prismarine blocks do not create a portal.
2. Build a complete border around the 3×3 opening, then fill its nine cells with Wormhole Runes in one flat plane. Use temporary backing blocks if you need a face to place against.
3. Hold the Portal Wand and **left-click any of the nine runes**. The runes draw inward and are consumed as the opening forms; the surrounding frame stays in place.
4. Remove any temporary backing blocks and [choose a destination](/wormholes/04-portal-types-menus-settings#destination-menu).

The same gesture works for a flat 2×2 set of four matching runes; the recordings use a 3×3 opening.

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

Destroy: home menu **Delete Portal** control, **shift-left-click** (not a normal left
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
