---
title: "Panels"
description: "Place persistent hologram menus in the world"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---
A panel places a persistent hologram menu at a world location. Panel documents live in
`plugins/Gloss/panels/` and point to a menu document for their content.

## Panels, holograms, menus and boards

| Feature | What it is | Where it lives | Command |
|---|---|---|---|
| Hologram | Lines of text on a `TextDisplay` | `holograms/` | `/gloss hologram` |
| Hologram menu | A layout of components, icons and actions | `menus/` | `/gloss menu` |
| Panel | A menu anchored in the world, persistent and interactive | `panels/` | `/gloss panel` |
| Scoreboard | A sidebar objective | `boards/` | `/gloss board` |

A panel stores placement, visibility, and a `rootMenuId`. Multiple panels can share a menu; editing
that menu updates all of them. See [Hologram Menus](/gloss/09-menus).

Panels are also not personal menu sessions. `/gloss menu open` opens a menu in front of the player
who ran it. That menu closes when they walk away or log out. A panel is placed once and stays until
it is deleted.

## The panel document

Each `.json` file defines one panel. For example, `panels/spawn/shops.json` has the id `spawn/shops`.
Nested folders are allowed. Symbolic links and noncanonical paths are rejected.

```json
{
  "schemaVersion": 1,
  "id": "spawn/shops",
  "uuid": "1f0b6a54-7a6f-4a2e-9c31-88b0c1f3d2ab",
  "revision": 7,
  "rootMenuId": "shops/Main",
  "transform": {
    "worldKey": "minecraft:overworld",
    "worldUuid": "6b8f2c10-4d3a-4a51-9f5e-1c9a7d0e4b22",
    "x": 128.5,
    "y": 71.0,
    "z": -44.5,
    "yaw": 90.0,
    "pitch": 0.0,
    "roll": 0.0,
    "scale": 1.0
  },
  "follow": {
    "mode": "none",
    "targetPlayerUuid": null,
    "rotation": "fixed"
  },
  "visibility": {
    "mode": "public",
    "viewPermission": null,
    "interactPermission": null,
    "viewRange": 64.0,
    "interactionRange": 8.0
  }
}
```

| Key | Required | Notes |
|---|---|---|
| `schemaVersion` | yes | Must be `1`. Any other version is silently ignored |
| `id` | yes | Canonical lowercase path. Must equal the file path under `panels/` with `.json` removed |
| `uuid` | yes | Stable identity. Cannot change across an update or a reload, and no two panels may share one |
| `revision` | yes | `1` to `9007199254740991`. Gloss owns it and bumps it by one on every write it makes |
| `rootMenuId` | yes | Id of a menu document. Case is preserved, unlike the panel id |
| `transform` | yes | World, position, rotation and scale |
| `follow` | yes | Follow mode, target player and rotation mode |
| `visibility` | yes | Visibility mode, permissions and ranges |

The panel document stays at schema 1 and has no `particleLayers` field of its own. Its
`rootMenuId` supplies the menu's particle layers. Each eligible viewer receives those particles
through the same panel transform, follow behavior, scale and audience gates as the display
components. See [Particle Layers](/gloss/25-particle-layers).

Panels are the one Gloss document kind that carries its own `id` inside the JSON. The file path and
the `id` key must agree. A mismatch rejects the file rather than picking a winner.

Panel ids are lowercase, at most 255 characters, and split into segments of at most 64 characters.
Each segment must match `[a-z0-9][a-z0-9._-]*`. `rootMenuId` follows the same path limits but keeps
its case.

### Revisions and reload failures

Gloss increments `revision` on each command or editor write. A stale write fails with a conflict.

A hand-edited file must therefore raise `revision` itself. On reload, a document whose content
changed but whose revision did not is rejected with `board content changed without a revision
increment`. A revision that moved backwards is rejected too.

A rejected reload keeps the last working definition. `/gloss panel reload` reports loaded, retained,
removed, and failed counts, with each failure logged by filename. A broken file on first startup does
not load.

> Deleting the file removes the panel on the next reload. Deleting a panel never touches its menu
> document, and deleting a menu leaves panels pointing at a menu that no longer resolves.
{.is-warning}

## Placement, rotation and scale

`transform` stores `worldKey` and `worldUuid`. Both must match a loaded world before the panel can
render. Panels in unloaded worlds remain editable.

`yaw`, `pitch` and `roll` are degrees. They are normalized into `[-180, 180)` on load and on every
write. `scale` is validated to `[0.05, 16.0]`. The rendered scale is `scale` multiplied by
`[menus] uiScale`. Raising `uiScale` grows every panel and every menu at once. A change to
`uiScale` rebuilds open panel views in place. It does not wait for the viewer to walk away.

Transform commands work on the panel's **effective** world pose, not on the stored numbers. A bare
number is absolute. `~` keeps the current value. `~2.5` adds 2.5. A bare `~` changes nothing.

```
/gloss panel move shop ~ ~1.5 ~
/gloss panel rotate shop 180 ~ ~
/gloss panel scale shop ~0.25
/gloss panel align shop kiosk xz
```

`align` copies the selected position axes from a reference panel. It refuses if the two panels are
in different worlds. Valid axis sets are `x`, `y`, `z`, `xy`, `xz`, `yz` and `xyz`.

## Visibility, ranges and permissions

| Mode | Who sees the panel |
|---|---|
| `public` | Everyone in range |
| `permission` | Players holding `viewPermission`. The node is required for this mode |
| `hidden` | Nobody. The panel stays loaded and editable but is never rendered |

`viewPermission` is only valid in `permission` mode. A `hidden` panel may not declare an
`interactPermission`. Permission values are lowercased and must match `[a-z0-9][a-z0-9._-]*`. A `-`
argument clears one.

`interactPermission` is independent of viewing. A public panel with an interact permission is
visible to everybody and clickable only by the holders.

| Range | Default | Cap | Checked against |
|---|---|---|---|
| `viewRange` | `64.0` | `256.0` | Full 3D distance from the viewer to the panel anchor |
| `interactionRange` | `8.0` | `32.0` | Both the eye-to-panel distance and the ray intersection distance |

Both must be finite and greater than zero. `interactionRange` may not exceed `viewRange`.

Panel visibility is the admission rule for the root menu. A viewer does not also need
`gloss.open.<rootMenuId>`. Navigating from the panel into any other menu does require
`gloss.open.<menuId>` for that target. A menu action that closes the view dismisses the panel for
that viewer only. It reappears the next time they leave and re-enter view range.

Clicks are main-hand left or right clicks, air or block, with the sneaking variants distinguished. A
solid block between the eye and the component blocks the click. When a personal menu session and a
panel both have a candidate under the crosshair, the nearer one fires. An exact tie goes to the
personal menu.

## Following a player

A panel can follow an online player. Its stored transform becomes an offset from that player.

| Rotation | Offset behavior | Facing |
|---|---|---|
| `fixed` | Offset is translated with the target, never rotated | Stored yaw and pitch |
| `yaw` | Horizontal offset rotates with the target's yaw | Target yaw plus stored yaw |
| `full` | Offset rotates with the target's yaw and pitch | Target yaw and pitch plus stored values |

```
/gloss panel follow tutorial Notch yaw
/gloss panel unfollow tutorial
```

`follow` converts the current absolute pose into relative storage. Switching a panel to follow does
not move it. `unfollow` does the reverse. It writes the current effective pose back as an absolute
transform and clears the follow block.

`move`, `here`, `rotate` and `align` on a following panel are re-encoded against a freshly captured
target location. That is why `~` is relative to the effective pose and not to the stored offset.

While the target is offline the last sampled pose stays in memory. The panel keeps its last world
position. It can still be edited or unfollowed. After a restart a following panel whose target has
not been online has no effective pose at all. It does not render. Effective-pose commands report the
target as unavailable until that player logs in.

## Command reference

Every node below requires `gloss.panels`, except `web`. Bare `/gloss panel` runs `list`.
`/gloss panels` is an accepted alias for the whole subtree. Required arguments are positional in
the order shown. Optional arguments are written `key=value`.

`list`, `near`, and `create` also accept their older positional forms. Trailing text, icon, style, and
image values are joined automatically and do not need quotes.

### Managing panels

| Node | Arguments | Notes |
|---|---|---|
| `list` | `[page=1]` | Ids, root menus and revisions in id order, 15 per page |
| `near` | `[radius=64]` `[page=1]` | Panels within a horizontal radius of the player, 15 per page. Player only |
| `info` | `<panel>` | Identity, effective transform, visibility, ranges and follow state |
| `create` | `<panel> [menu=<id>]` | Creates the panel at your feet. Player only |
| `delete` (`remove`) | `<panel>` | Removes only the panel document |
| `rename` | `<panel> <newPanel>` | Keeps the uuid, moves the file, bumps the revision |
| `copy` | `<panel> <newPanel>` | New uuid at revision 1, same `rootMenuId`, no menu file copied |
| `reload` | none | Re-reads `panels/` and reports loaded, retained, removed and failed counts |

`create` captures your world, position, yaw and pitch. It sets roll `0` and scale `1`. It writes a
public panel with the default ranges at revision 1. The `menu` argument must name an already loaded
menu. When it is omitted the panel id is used as the menu id. Creation fails if no such menu exists.

`copy` reads the staged definition when you have an edit session open on the source panel. Otherwise
it reads the published one. Because it keeps `rootMenuId`, the copy and the original share content
until one of them is pointed at another menu.

### Moving panels

| Node | Arguments | Notes |
|---|---|---|
| `move` | `<panel> <x> <y> <z>` | Absolute or `~`-relative effective coordinates |
| `here` (`movehere`, `tphere`) | `<panel>` | Moves to your world and feet position, keeping rotation and scale. Player only |
| `teleport` (`tp`) | `<panel>` | Teleports you to the effective position, yaw and pitch. Player only |
| `rotate` | `<panel> <yaw> <pitch> <roll>` | Absolute or `~`-relative angles |
| `scale` | `<panel> <scale>` | Absolute or `~`-relative, clamped to `[0.05, 16.0]` |
| `align` | `<panel> <reference> <axes>` | `x`, `y`, `z`, `xy`, `xz`, `yz` or `xyz` |

### Visibility and follow

| Node | Arguments | Notes |
|---|---|---|
| `ranges` | `<panel> <viewRange> <interactionRange>` | Both positive. Interaction may not exceed view |
| `visibility` | `<panel> <mode> <viewPermission> <interactPermission>` | `public`, `permission` or `hidden`. `-` clears a permission |
| `permissions` | `<panel> <viewPermission> <interactPermission>` | Changes the nodes and derives the mode |
| `follow` | `<panel> <player> <rotation>` | Online player name or uuid. `fixed`, `yaw` or `full` |
| `unfollow` | `<panel>` | Materializes the effective pose and clears follow |

`permissions` picks the mode for you. Giving a view permission switches the panel to `permission`.
Clearing both on a hidden panel leaves it hidden. Anything else becomes `public`. Use `visibility`
when you want to state the mode explicitly.

### Editing the root menu in game

These nodes edit the panel's root **menu** document and require `gloss.panels`.

| Node | Arguments |
|---|---|
| `menu` (`root`) | `<panel> <menu>` |
| `addrow` | `<panel> <text>` |
| `insertrow` | `<panel> <row> <text>` |
| `setrow` | `<panel> <row> <text>` |
| `removerow` | `<panel> <row>` |
| `offsetrow` | `<panel> <row> <x> <y> <z>` |
| `seticon` | `<panel> <row> <type> <value>` |
| `style` | `<panel> <row> <property> <value>` |
| `image` | `<panel> <path>` |

Row numbers are one-based indexes into the menu's component list. `offsetrow` takes absolute or
`~`-relative offsets. `seticon` accepts `text`, `image`, `animated`, `item`, `block`, `customItem`
and `entity`. Image and animated values must resolve to readable files under `plugins/Gloss/images`.
An animated value is a comma-separated frame list. `style` sets one display property and treats `*`
as removal. `image` replaces the whole component list with one centered image decoration.

`menu` (`root`) is the exception in this group. It changes the panel document's `rootMenuId`. It is
staged like any other panel change when an edit session is open. The content nodes always write the
menu document immediately. Icons, styles and actions are documented in [Icons](/gloss/11-icons),
[Components & Hitboxes](/gloss/10-components-hitboxes) and [Actions](/gloss/12-actions).

## Staged edit sessions

`/gloss panel edit <panel>` opens a private preview. Panel changes remain staged until you save.

```
/gloss panel edit shop
/gloss panel move shop ~ ~0.5 ~
/gloss panel rotate shop ~45 ~ ~
/gloss panel save
```

- The preview is forced visible and interactable for you alone. It ignores the panel's own
  visibility mode, view range and interaction range. You can then position a hidden or
  permission-gated panel.
- One session per player. Starting a second `edit` reports the panel you already have open.
- `delete` and `rename` are refused while you hold a session on that panel.
- `info` shows the staged state and labels it as such.
- Other players and the console keep seeing and editing the published panel. A console sender never has a
  session, so console commands always write straight through.
- Root-menu content commands are not staged. `addrow`, `seticon`, `image` and the rest write the menu
  document immediately, even mid-session.

`/gloss panel save` performs one revision-checked write. It clears the preview only after it
succeeds. If the panel changed underneath you, the save reports a revision conflict. The session
stays open. You can re-run it or cancel.

`/gloss panel cancel` discards the staged state and clears the preview.

> An unsaved session is lost on disconnect and on server shutdown. Quitting discards the snapshot and
> clears the preview. Shutdown clears every staged session before the panel runtime stops. Nothing is
> written to disk in either case.
{.is-danger}

## Opening a panel in the web editor

```
/gloss web edit panel <panel>
```

This command requires `gloss.web.edit` and opens the panel, its reachable menus, and their images.
Browser autosave stays local. **Publish to Server** applies the project after revision checks.

See [Web Editor & Sync](/gloss/18-web-editor) for the sync session lifecycle, size limits and the
`/gloss web sessions` management commands. `/gloss web workspace` opens every editable
Gloss document and image instead of one panel graph.

## Configuration

| Key | Default | Effect |
|---|---|---|
| `[features] panels` | `true` | Loads and renders panels |
| `[menus] uiScale` | `1.0` | Multiplies every panel's `scale`, clamped `0.25` to `4.0` |

With `[features] panels = false`, panels do not load or render. Turning the feature back on requires
a restart.

Panel views are built directly from menu documents rather than through the personal-session manager.
`[features] menus` governs `/gloss menu open` and API menus, not panel rendering.

## Reload behavior

`panels/` is not watched. Run `/gloss panel reload` after editing a panel file. `/gloss reload` does
not reread this folder.

Menu documents are watched at `[hotload] watchIntervalTicks`. Menu content changes appear without a
panel reload; panel placement changes do not.

## Permissions

| Node | Default | Grants |
|---|---|---|
| `gloss.panels` | op | Every `/gloss panel` node, plus `/gloss menu create` |
| `gloss.web.edit` | op | `/gloss web edit panel <panel>` |
| `gloss.web.workspace` | op | `/gloss web workspace` |
| `gloss.open.<menuId>` | op | Navigating from a panel into a non-root menu |

`gloss.panels` also covers `/gloss menu create`. That command writes a menu document and a panel
document together in one transaction. A new hologram menu is placed in the world in a single step.
See [Hologram Menus](/gloss/09-menus) for that command and for `/gloss menu new`, which creates a
menu document alone.

The full tree is on [Commands & Permissions](/gloss/17-commands-permissions).
