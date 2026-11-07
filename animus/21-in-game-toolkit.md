---
title: "Animus: In-Game Toolkit"
description: "A chest-GUI tool palette and a selection wand for managing NPCs by clicking"
published: true
date: 2026-11-07T00:00:00.000Z
tags: "animus, gui, tools, wand, selection"
editor: markdown
dateCreated: 2026-11-07T00:00:00.000Z
---

The toolkit lets an administrator pick NPCs with a wand and manage them from chest windows: spawn, despawn, clone, delete, trait groups, folders, routes, skins and teleports. It works the same on Paper, Spigot, Folia, Fabric, NeoForge and Forge. Every change it saves is a transaction, so the chat line it sends has the transaction id and **[Undo]**.

| Command | Effect |
|---|---|
| `/animus tools` | Open the tool palette. Same as `/animus tools open` |
| `/animus tools wand` | Put a selection wand in your inventory |
| `/animus tools manage` | Open the manage screen for your selection |

All three need `animus.admin` and a player. Every item in a toolkit window says in its lore what a left click, a right click and a sneak click do.

## The wand

The wand is a blaze rod named **Animus wand**. The server knows it by a marker on the item, not by its name, so renaming it keeps it a wand and a renamed blaze rod is not one. On Paper, Spigot and Folia the marker is the persistent data key `animus:tool` with the value `wand`; on mod servers it is the same key in the item's `minecraft:custom_data`.

| With the wand in your main hand | Does |
|---|---|
| Click an NPC | Select only that NPC |
| Sneak and click an NPC | Add it to the selection, or remove it |
| Tap sneak during a route capture | Drop a route point where you stand |

The last NPC you add also becomes your `@selected` NPC, so commands that take `@selected` act on it. While you have a selection, small particles mark the corners of each selected NPC within 48 blocks; only you see them. Clearing the selection or leaving the server stops them. The selection is forgotten when you leave.

Without the wand, a click on an NPC opens its shop, GUI or hire window as usual.

## Palette

`/animus tools` shows the selection count and one button per tool. Sneak-click the selection button to clear the selection. Right-click **Routes** to drop a route point where you stand, and right-click **Skins** to put your own skin on the selection.

## Manage

The manage screen acts on the whole selection.

| Button | Does |
|---|---|
| Spawn | Checks that each NPC can run on this server, then spawns them in one transaction |
| Despawn | Despawns them; the definitions stay |
| Clone | Saves dormant copies named `<id>-copy`, numbered when that id is taken |
| Delete | Asks first: the first click arms it and the button turns red, the second click deletes. Any other button disarms it. One transaction, so **[Undo]** brings every NPC back |
| Teleport to it | Shown when one NPC is selected |
| Inspect | Closes the window and prints what `/animus inspect` prints for the first selected NPC |
| Open in editor | Closes the window and sends a pairing link for the [web editor](/animus/14-web-editor), the same as `/animus editor pair` |
| Trait groups, Folder, Route, Skin | Open those tools |
| Clear selection | Empties the selection |

## Trait groups

Lists every [trait group](/animus/18-trait-groups) with its member count and how many selected NPCs have it. A left click assigns the group to every selected NPC; a right or sneak click removes it. Either way it is one transaction, refused whole if any NPC would become invalid.

## Folders

Lists the folders under `npcs/` that hold NPCs, and `npcs/` itself. A click moves every selected NPC into that folder in one transaction. New folders are made in the web editor.

## Routes

Lists the files in `routes/`. A left click puts the route on the selection: it writes `modules["animus:navigation"]` as `{"enabled": true, "route": "<id>"}`, replacing the NPC's own route settings, and the NPC starts walking it. A right click walks the route now without saving it. **Start route** restarts each NPC's saved route; **Stop moving** stops them.

To record a new route:

1. Click **Capture a route**, or right-click **Routes** in the palette. The first point is where you stand.
2. Walk to the next place. Hold the wand and tap sneak to drop a point there. Each point shows as green particles while you capture. Sneak-click **Capture** to remove the last point.
3. Click **Save route**. It saves `routes/wp-<your name>.json`, or `wp-<your name>-2.json` when that file exists, as a looping walk through the points. Right-click **Save route** to also put it on the selection.

Points snap to the center of the block you stand on and must stay in one world; a route holds at most 256 points. Rename the file to rename the route. **Discard capture** drops the points.

## Skins

Lists the skin files in `skins/`, labelled by the NPCs and trait groups that use them. A click puts that skin on every selected NPC and saves the `skin` field. **Use my skin** saves your own signed skin as a skin file and puts it on the selection; offline-mode servers have no signed skins, so it says so. **Remove skin** takes the skin off.

Skins only show on `minecraft:player` bodies. Other bodies in the selection are skipped and the chat line counts them.

## Find

Lists the active NPCs in your world, nearest first, with the distance in the lore. A left click teleports you to the NPC. A right click selects only that NPC. A sneak click brings the NPC to you and saves its new position.

On Folia the NPC moves when its definition reloads, a moment after the position is saved, instead of at once.
