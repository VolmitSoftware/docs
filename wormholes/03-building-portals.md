---
title: "Building Portals"
description: "Build portals with a wand or runes, apply skins, and replace vanilla portals"
published: true
date: 2026-10-29T19:18:51.000Z
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
| Portal Rune | Enchanted prismarine | No; recognized only when already placed in a world |
| Wormhole Rune | Enchanted dark prismarine | No; supplied by an administrator |

Runes are not craftable. `/wormholes wand` gives one Portal Wand and one Wormhole Rune; it does not supply other rune types.
Breaking a tracked Portal or Wormhole rune block returns the matching item in
survival. A tracked Gateway rune block returns a Wormhole Rune; a tracked
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
<p>No client mod</p>
<video src="https://media.volmitsoftware.com/wormholes-assets/demos/wand-creation-standard-pov.webm" aria-label="Portal creation with the wand, no client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Client mod</p>
<video src="https://media.volmitsoftware.com/wormholes-assets/demos/wand-creation-clientview-pov.webm" aria-label="Portal creation with the wand, client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
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

For a floor/ceiling falling loop, select a horizontal opening at each end and choose **Link and return**. New horizontal portals use the same downward normal and northward screen-up direction regardless of your heading during construction, so an unrotated pair preserves vertical momentum, yaw, and pitch. The Orientation menu can rotate or flip either frame; an existing pair with opposing normals needs one frame flipped to preserve the falling direction. For a previously rotated pair, select `look` in each portal's Transit Orientation setting to keep your absolute look direction.

With the client mod on Fabric, Forge, NeoForge, or singleplayer, a horizontal portal can sit in a solid floor or ceiling. Once its seamless route is ready, a player can pass through the selected cells and supporting blocks behind the opening without removing them, and crosses when their eye passes the portal plane. A player who comes to rest inside an open floor opening, standing on the block under it, or who is stopped by the block above an open ceiling opening, crosses from where they stand and arrives where their eye would have passed the plane. Blocks around the opening remain solid, and solid obstacles at the destination still stop movement. When an arrival would put the player inside the blocks behind a floor or ceiling destination, the player arrives just beyond that opening instead: just above a floor portal's cells, or with their head just below a ceiling portal's cells; if that space is blocked too, the crossing does not happen. With Lithium or another mod that replaces Minecraft's entity collision, players cannot move into the selected cells or the blocks behind the opening, so keep the selected cells open: a player who steps into an open floor opening crosses as soon as they stand on the block under it, and a jump into an open ceiling opening crosses once it lifts the eye past the portal plane, for example from a floor two blocks below the opening's cells. On Paper, Purpur, Folia, or without the client mod, clear the physical opening for ordinary travel. Converted End entry portals are the exception on every platform: they send a player or entity on contact with the portal cells, even with a solid floor beneath them.

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
<p>No client mod</p>
<video src="https://media.volmitsoftware.com/wormholes-assets/demos/rune-creation-standard-pov.webm" aria-label="Portal creation with runes, no client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Client mod</p>
<video src="https://media.volmitsoftware.com/wormholes-assets/demos/rune-creation-clientview-pov.webm" aria-label="Portal creation with runes, client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
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

## Aperture shape

Any built frame can carry an aperture shape set afterwards. The shape outlines the opening inside the built rectangle: cells outside it neither show the destination nor admit travel, while the cells you built stay stored unchanged, so resetting the shape to `full` restores the whole opening. Set it from the portal's Settings menu or with `/wormholes admin portals shape`; see [Aperture shape](/wormholes/04-portal-types-menus-settings#aperture-shape).

## Surface skin

Block skins cover the full selected opening, including its outer cell edges. Non-fluid skins form a thin surface centered on the portal plane.

Applying or clearing a surface skin requires `wormholes.admin`. While looking at a portal, apply a skin as follows:

- Main hand holds a **non-tool** item (not the wand or a portal or wormhole
  rune).
- **Right-click** air or a block with that hand.

| Held item | Skin applied |
|-----------|--------------|
| Water bucket | `minecraft:water` |
| Lava bucket | `minecraft:lava` |
| Any block material | That block’s `BlockData` string |

Sneak and right-click with an empty main hand while looking at a skinned portal to clear it. This takes priority over opening its menu. Opaque skins **block projection** through the surface. Transparent and non-occluding skins (glass, ice, water, slime, honey, barrier, and similar) do not. The settings cosmetics control can also clear the skin and requires the same permission. See
[04 - Portal Types Menus & Settings](/wormholes/04-portal-types-menus-settings).

## Menu access

Only the portal owner, ops, or players with `wormholes.admin` may open
management menus.

| Gesture | Action |
|---------|--------|
| Portal Wand, looking at portal, left or right click | Open portal home menu |
| Sneak + empty main hand + right-click a block that is part of or adjoins the portal structure | Clear an applied skin with `wormholes.admin`; otherwise open the portal home menu |

Destroy: home menu **Delete Portal** control, **shift-left-click** (not a normal left
click).

## Vanilla nether and end portals

Config: `[main] replace-nether-and-end-portals` in `wormholes.toml`
(default `true`). Hot-reloads with other main gameplay settings.

When enabled, lighting a Nether portal or completing an End portal converts it into a managed Wormholes portal. These portals lock destination and type. Native Nether pairs allow directional gravity and traveller scale through the Transit menu. Nether pairs work both ways. Generated Nether counterparts prefer nearby supported ground with clear headroom and avoid hazardous blocks and the roof. If no suitable ground is found within the search area, Wormholes builds a landing platform.

End portals lead both ways by default. An End entry portal delivers travelers just below the End arrival portal, a 3×3 opening ten blocks above safe ground near the center of the main End island, and they fall to the ground beneath it. Like vanilla End portals, an End entry portal sends a player or entity as soon as its body touches the portal cells, whether it walks or drops in from the frame, stands inside the portal when it is completed, or arrives inside it by teleport. Solid blocks directly under the portal cells do not prevent travel. The End arrival portal shows the Overworld above the End entry portal, and a player or entity that rises up through it from below, for example by jumping from a block placed under it or by flying, returns to the Overworld and lands on the End entry portal’s frame beside its cells. Passing down through the arrival portal from above does not travel. With the client mod on Fabric, Forge, NeoForge, or singleplayer, a player crosses back seamlessly when their eye rises past the arrival portal’s plane; on Paper, Purpur, and Folia, when their feet do.

Set `[main] two-way-end-portals = false` to make End travel one way. The End arrival portal then only receives: it has no reverse travel route and shows no view back to the Overworld. The setting hot-reloads and applies to End portals that already exist.

In both modes the central exit fountain, which defeating the Ender Dragon activates, is a separate way back to the Overworld. Its view shows each player’s valid bed or respawn-anchor destination, or the world spawn when no valid personal destination exists. Entering the fountain keeps vanilla return routing, credits, and progression. Ender dragons never travel through any Wormholes portal or dimensional door.

A converted vanilla portal keeps its original physical frame when its view direction, quarter-turn rotation or aperture shape changes. Keep the original obsidian border intact; breaking it removes the linked Nether pair. On native loaders, directional gravity and traveller scale are shared through Settings sync at both linked ends. See the [Transit menu](/wormholes/04-portal-types-menus-settings#transit-menu).

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
