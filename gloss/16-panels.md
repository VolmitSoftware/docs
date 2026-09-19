---
title: "Panels"
description: "Place persistent hologram menus in the world"
published: true
date: 2026-09-19T00:00:00.000Z
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

A panel stores placement, visibility and a `rootMenuId`. Several panels can share a menu, and
editing that menu updates all of them. See [Hologram Menus](/gloss/09-menus).

A panel is not a personal menu session: `/gloss menu open` puts a menu in front of one player and
closes when they walk away, while a panel is placed once and stays until it is deleted.

## The panel document

Each `.json` file defines one panel. `panels/spawn/shops.json` has the id `spawn/shops`. Nested
folders are allowed; symbolic links and noncanonical paths are rejected.

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
| `show` | no | Boolean or expression; defaults to `true` |

The panel `show`, the current menu's `show` and a component's `show` must all pass for that
component to appear, and a hidden component cannot receive clicks. See
[Show conditions](/gloss/13-expressions-placeholders#show-conditions).

Panels are the one Gloss document kind that carries its own `id` inside the JSON, and a mismatch
with the file path rejects the file rather than picking a winner. Panel ids are lowercase, at most
255 characters, split into segments of at most 64 characters that each match `[a-z0-9][a-z0-9._-]*`.
`rootMenuId` follows the same path limits but keeps its case.

The panel document has no `particleLayers` field. Its `rootMenuId` supplies the menu's particle
layers, delivered through the same transform, follow behavior, scale and audience gates as the
display components. See [Particle Layers](/gloss/25-particle-layers).

### Revisions and reload failures

Gloss bumps `revision` on every write it makes, so a hand-edited file must raise it too. A document
whose content changed without a revision increase is rejected with `panel content changed without a
revision increment`, as is a revision that moved backwards. A rejected reload keeps the last working
definition and logs the failure by filename; a broken file on first startup does not load at all.

> Deleting the file removes the panel once Gloss detects the stable deletion. Deleting a panel never touches its menu
> document, and deleting a menu leaves panels pointing at a menu that no longer resolves.
{.is-warning}

## Browser authoring

In a menu flow map, use **Create world panel** to supply an id, root menu, world key and world UUID.
**Import world panel** reads a runtime panel file; **Export world panel** writes that definition
without the local flow layout. The inspector edits placement, world binding, follow behavior,
visibility and `show`. Duplicating a linked panel assigns a new runtime id and UUID while copying
its settings, and applied edits support undo and redo.

## Placement, rotation and scale

`transform` stores `worldKey` and `worldUuid`, and both must match a loaded world before the panel
renders. Panels in unloaded worlds stay editable.

`yaw`, `pitch` and `roll` are degrees, normalized into `[-180, 180)` on load and on every write.
`scale` is validated to `[0.05, 16.0]`, and the rendered scale is `scale × [menus] uiScale`. A
change to `uiScale` rebuilds open panel views in place.

Transform commands work on the panel's **effective** world pose, not the stored numbers. A bare
number is absolute, `~` keeps the current value, `~2.5` adds 2.5, and a bare `~` changes nothing.

```
/gloss panel move shop ~ ~1.5 ~
/gloss panel rotate shop 180 ~ ~
/gloss panel scale shop ~0.25
/gloss panel align shop kiosk xz
```

`align` copies the selected position axes from a reference panel and refuses if the two are in
different worlds. Valid axis sets are `x`, `y`, `z`, `xy`, `xz`, `yz` and `xyz`.

## Visibility, ranges and permissions

| Mode | Who sees the panel |
|---|---|
| `public` | Everyone in range |
| `permission` | Players holding `viewPermission`. The node is required for this mode |
| `hidden` | Nobody. The panel stays loaded and editable but is never rendered |

`viewPermission` is only valid in `permission` mode, and a `hidden` panel may not declare an
`interactPermission`. Permission values are lowercased and must match `[a-z0-9][a-z0-9._-]*`; a `-`
argument clears one. `interactPermission` is independent of viewing, so a public panel with an
interact permission is visible to everybody and clickable only by the holders.

| Range | Default | Cap | Checked against |
|---|---|---|---|
| `viewRange` | `64.0` | `256.0` | Full 3D distance from the viewer to the panel anchor |
| `interactionRange` | `8.0` | `32.0` | Both the eye-to-panel distance and the ray intersection distance |

Both must be finite and greater than zero, and `interactionRange` may not exceed `viewRange`.

Panel visibility is the admission rule for the root menu, so a viewer does not also need
`gloss.open.<rootMenuId>`. Navigating from the panel into any other menu does require
`gloss.open.<menuId>` for that target. A menu action that closes the view dismisses the panel for
that viewer only, and it returns the next time they leave and re-enter view range.

Clicks are main-hand left or right clicks, air or block, with the sneaking variants distinguished. A
solid block between the eye and the component blocks the click. When a menu and a panel overlap, the
nearer one gets the click, and an exact tie goes to the personal menu.

## Following a player

A panel can follow an online player, and its stored transform becomes an offset from that player.

| Rotation | Offset behavior | Facing |
|---|---|---|
| `fixed` | Offset is translated with the target, never rotated | Stored yaw and pitch |
| `yaw` | Horizontal offset rotates with the target's yaw | Target yaw plus stored yaw |
| `full` | Offset rotates with the target's yaw and pitch | Target yaw and pitch plus stored values |

```
/gloss panel follow tutorial Notch yaw
/gloss panel unfollow tutorial
```

`follow` converts the current absolute pose into relative storage, so switching a panel to follow
does not move it. `unfollow` writes the current effective pose back as an absolute transform and
clears the follow block. `move`, `here`, `rotate` and `align` on a following panel are re-encoded
against a fresh target location, which is why `~` is relative to the effective pose.

While the target is offline the panel keeps its last sampled pose and can still be edited or
unfollowed. After a restart, a following panel whose target has not been online has no effective
pose and does not render; effective-pose commands report the target as unavailable until that
player logs in.

## Command reference

Every node below requires `gloss.panels`, except `web`. Bare `/gloss panel` runs `list`, and
`/gloss panels` is an alias for the whole subtree. Required arguments are positional in the order
shown; optional arguments are written `key=value`. Trailing text, icon, style and image values are
joined automatically and need no quotes.

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

`create` captures your world, position, yaw and pitch, sets roll `0` and scale `1`, and writes a
public panel with the default ranges at revision 1. The `menu` argument must name an already loaded
menu; when it is omitted the panel id is used as the menu id, and creation fails if no such menu
exists.

`copy` keeps `rootMenuId`, so the copy and the original share content until one is pointed at
another menu.

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

`permissions` picks the mode for you: a view permission switches the panel to `permission`, clearing
both on a hidden panel leaves it hidden, and anything else becomes `public`. Use `visibility` to
state the mode explicitly.

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
and `entity`; image and animated values must resolve to readable files under `plugins/Gloss/images`,
and an animated value is a comma-separated frame list. `style` sets one display property and treats
`*` as removal. `image` replaces the whole component list with one centered image decoration.

`menu` (`root`) changes the panel document's `rootMenuId` and is staged like any other panel change.
The content nodes always write the menu document immediately. Icons, styles and actions are
documented in [Icons](/gloss/11-icons), [Components & Hitboxes](/gloss/10-components-hitboxes) and
[Actions](/gloss/12-actions).

## Staged edit sessions

`/gloss panel edit <panel>` opens a private preview. Panel changes stay staged until you save.

```
/gloss panel edit shop
/gloss panel move shop ~ ~0.5 ~
/gloss panel rotate shop ~45 ~ ~
/gloss panel save
```

- The preview is forced visible and interactable for you alone, ignoring the panel's own visibility
  mode and ranges, so you can position a hidden or permission-gated panel.
- One session per player. `delete` and `rename` are refused while you hold a session on that panel.
- `info` shows the staged state and labels it as such.
- Other players and the console keep seeing and editing the published panel.
- Root-menu content commands are not staged: `addrow`, `seticon`, `image` and the rest write the
  menu document immediately, even mid-session.

`/gloss panel save` performs one revision-checked write and clears the preview only after it
succeeds. If the panel changed underneath you, the save reports a revision conflict and the session
stays open. `/gloss panel cancel` discards the staged state and clears the preview.

> An unsaved session is lost on disconnect and on server shutdown. Quitting discards the snapshot and
> clears the preview. Shutdown clears every staged session before the panel runtime stops. Nothing is
> written to disk in either case.
{.is-danger}

## Opening a panel in the web editor

```
/gloss web edit panel <panel>
```

This needs `gloss.web.edit` and opens the panel, its reachable menus and their images. Browser
autosave stays local, and **Publish to Server** applies the project after revision checks.
`/gloss web workspace` opens every editable Gloss document and image instead of one panel graph.
See [Web Editor & Sync](/gloss/18-web-editor).

## Configuration

| Key | Default | Effect |
|---|---|---|
| `[features] panels` | `true` | Loads and renders panels |
| `[menus] uiScale` | `1.0` | Multiplies every panel's `scale`, clamped `0.25` to `4.0` |

With `[features] panels = false`, panels do not load or render, and turning the feature back on
requires a restart. `[features] menus` governs `/gloss menu open` and API menus, not panel
rendering.

## Hot reload

Gloss watches `panels/` and the menu documents they use. Valid additions and edits update live
panels automatically; deleting a file removes its panel. An invalid edit keeps the last working
definition and logs the failure with the filename. Panel files must be UTF-8 JSON no larger than
2 MiB.

## Permissions

| Node | Default | Grants |
|---|---|---|
| `gloss.panels` | op | Every `/gloss panel` node, plus `/gloss menu create` |
| `gloss.web.edit` | op | `/gloss web edit panel <panel>` |
| `gloss.web.workspace` | op | `/gloss web workspace` |
| `gloss.open.<menuId>` | op | Navigating from a panel into a non-root menu |

`gloss.panels` also covers `/gloss menu create`, which writes a menu document and a panel document
together in one transaction. See [Hologram Menus](/gloss/09-menus) for that command and for
`/gloss menu new`, which creates a menu document alone. The full tree is on
[Commands & Permissions](/gloss/17-commands-permissions).
