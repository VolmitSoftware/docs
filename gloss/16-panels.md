---
title: "Panels"
description: "Gloss documentation: Panels"
published: true
date: 2026-08-23T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---
A panel is a hologram menu anchored in the world instead of in front of one player. It lives as a
JSON document in `plugins/Gloss/panels/`. It points at a menu document as its root.

Every player who comes within its view range gets a private copy of that menu. The copy is rendered
at the panel's world transform. Panels are what HoloUi called boards. In Gloss the name `board`
belongs to scoreboards.

## Panels, holograms, menus and boards

| Feature | What it is | Where it lives | Command |
|---|---|---|---|
| Hologram | Lines of text on a `TextDisplay` | `holograms/` | `/gloss hologram` |
| Hologram menu | A layout of components, icons and actions | `menus/` | `/gloss menu` |
| Panel | A menu anchored in the world, persistent and interactive | `panels/` | `/gloss panel` |
| Scoreboard | A sidebar objective | `boards/` | `/gloss board` |

A panel holds no content of its own. It holds a placement, a visibility policy and a `rootMenuId`.
The content comes from the menu document that id names. Two panels can share one menu. Editing that
menu changes both. See [Hologram Menus](/gloss/09-menus) for the menu document itself.

Panels are also not personal menu sessions. `/gloss menu open` opens a menu in front of the player
who ran it. That menu closes when they walk away or log out. A panel is placed once and stays until
it is deleted.

## The panel document

One file is one panel. `plugins/Gloss/panels/spawn/shops.json` is the panel `spawn/shops`. Nested
folders are allowed. Each `/` in the id is one directory level. Only `.json` files are read.
Symbolic links are refused for reads, writes and deletes. A file whose path is not the canonical
form of its id is rejected.

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
| `schemaVersion` | yes | Must be `1`. Anything else rejects the file with `unsupported board schemaVersion: <n>` |
| `id` | yes | Canonical lowercase path. Must equal the file path under `panels/` with `.json` removed |
| `uuid` | yes | Stable identity. Cannot change across an update or a reload, and no two panels may share one |
| `revision` | yes | `1` to `9007199254740991`. Gloss owns it and bumps it by one on every write it makes |
| `rootMenuId` | yes | Id of a menu document. Case is preserved, unlike the panel id |
| `transform` | yes | World, position, rotation and scale |
| `follow` | yes | Follow mode, target player and rotation mode |
| `visibility` | yes | Visibility mode, permissions and ranges |

Panels are the one Gloss document kind that carries its own `id` inside the JSON. The file path and
the `id` key must agree. A mismatch rejects the file rather than picking a winner.

Panel ids are canonicalized to lowercase. The whole id is at most 255 characters. Each `/`-separated
segment is at most 64 characters and must match `[a-z0-9][a-z0-9._-]*`. Empty, `.`, `..` and
backslash-separated segments are rejected. `rootMenuId` follows the same length and traversal rules
but keeps its case. A menu named `shops/Main` is referenced exactly as written.

### Revisions and reload failures

`revision` is server-owned. Every command edit and every editor-sync publication reads the revision
it expects. It writes `revision + 1`. It fails with a conflict message if the panel moved on in
between.

A hand-edited file must therefore raise `revision` itself. On reload, a document whose content
changed but whose revision did not is rejected with `board content changed without a revision
increment`. A revision that moved backwards is rejected too.

A rejected file does not delete a working panel. `/gloss panel reload` reports four numbers —
loaded, retained, removed, failed. Each failure is logged with the file name and reason. Where the
panel was already published, the last good definition is retained. It stays live until the file
parses again. On a cold start there is no last good value. A broken file simply does not load.

Writes go to a temporary file in the same directory, are flushed, replace the target with an atomic
move, and flush the parent directory. A failed write never reaches the in-memory registry.

> Deleting the file removes the panel on the next reload. Deleting a panel never touches its menu
> document, and deleting a menu leaves panels pointing at a menu that no longer resolves.
{.is-warning}

## Placement, rotation and scale

`transform` stores both `worldKey` (an explicit lowercase `namespace:key`) and `worldUuid`. Both
must match a loaded world for the panel to render. The repository treats them as opaque values. It
never asks the server to resolve a world. A panel for an unloaded world stays loadable and editable.

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

Panel visibility is the admission rule for the root menu. A viewer does not additionally need
`gloss.open.<rootMenuId>`. Navigating from the panel into any other menu does require
`gloss.open.<menuId>` for that target. A menu action that closes the view dismisses the panel for
that viewer only. It reappears the next time they leave and re-enter view range.

Clicks are main-hand left or right clicks, air or block, with the sneaking variants distinguished. A
solid block between the eye and the component blocks the click. When a personal menu session and a
panel both have a candidate under the crosshair, the nearer one fires. An exact tie goes to the
personal menu.

## Following a player

A panel can be pinned to an online player. The stored transform then holds a target-relative offset
rather than an absolute position. The runtime resamples the target on their own scheduler. It
publishes a resolved absolute pose. One target movement resolves only panels following that player
and updates only their old and new spatial buckets; unrelated panel definitions and distant viewer
candidate caches stay untouched.

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

The panel subtree keeps a few legacy positional forms. A bare page on `list`, a bare radius on
`near` and a bare menu id on `create` are rewritten to their keyed forms. The trailing text, icon
value, style value or image path on the row commands is joined into one argument. You do not have
to quote it.

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
| `visibility` | `<panel> <mode> <viewPermission> <interactPermission>` | `public`, `permission` or `hidden`.`-` clears a permission |
| `permissions` | `<panel> <viewPermission> <interactPermission>` | Changes the nodes and derives the mode |
| `follow` | `<panel> <player> <rotation>` | Online player name or uuid.`fixed`, `yaw` or `full` |
| `unfollow` | `<panel>` | Materializes the effective pose and clears follow |

`permissions` picks the mode for you. Giving a view permission switches the panel to `permission`.
Clearing both on a hidden panel leaves it hidden. Anything else becomes `public`. Use `visibility`
when you want to state the mode explicitly.

### Editing the root menu in game

These nodes edit the panel's root **menu** document, not the panel. They are the same mutations as
`/gloss menu addrow` and friends. They are addressed by panel id instead of menu id. They check
`gloss.panels`.

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

`/gloss panel edit <panel>` snapshots the published definition, its revision and its effective
transform. It gives you a private preview of the panel. From then on your panel-document changes go
into that snapshot instead of to disk.

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
/gloss panel web <panel>
```

Aliases `editweb` and `webedit`. This node requires `gloss.panels.editweb` instead of
`gloss.panels`.

When editor sync is enabled and available and the sender also holds `gloss.sync`, Gloss opens a live
sync session for the whole panel project. That project is the panel document, every menu reachable
from its root menu, and the images those menus use. Edits made in the browser are pulled back and
applied under the same revision checks as a command edit.

Otherwise — sync disabled, the relay unavailable, `gloss.sync` missing, or session creation failed —
the command falls back to a one-way handoff link. That link carries only the root menu source. It is
an export. Nothing it produces comes back to the server on its own. If the panel's root menu cannot
be resolved at all, the command reports the menu as unavailable and does nothing.

See [Web Editor & Sync](/gloss/18-web-editor) for the sync session lifecycle, size limits and the
`/gloss sync` management commands.

## Configuration

| Key | Default | Effect |
|---|---|---|
| `[features] panels` | `true` | Loads and renders panels |
| `[menus] uiScale` | `1.0` | Multiplies every panel's `scale`, clamped `0.25` to `4.0` |

With `[features] panels = false` the panel service never starts. No documents are loaded. Nothing
renders. The panel commands find no panels to act on. That includes `/gloss panel reload`, which
cannot start a service that was never enabled. Turning the feature back on requires a restart.

Panel views are built directly from menu documents rather than through the personal-session manager.
`[features] menus` governs `/gloss menu open` and API menus, not panel rendering.

## Reload behavior

`panels/` is not watched. Editing a panel file on disk does nothing until `/gloss panel reload`
runs. `/gloss reload` reloads `config.toml` and the config-driven services without re-reading
`panels/`. This is deliberate. Panel writes are revision-checked. A watcher that republished
half-written or revision-stale files would fight the editor sync and staged-edit paths.

Menu documents are the opposite. `menus/` is watched as one entry on the shared data watchdog, at
`[hotload] watchIntervalTicks`. A menu edit rebuilds every open panel view that currently shows
that menu. Each rebuild runs on that viewer's own scheduler. Content edits appear without a reload.
Placement edits need one.

## Permissions

| Node | Default | Grants |
|---|---|---|
| `gloss.panels` | op | Every `/gloss panel` node except `web`, plus `/gloss menu create` |
| `gloss.panels.editweb` | op | `/gloss panel web` |
| `gloss.sync` | op | Upgrades `/gloss panel web` from a one-way handoff to a live sync session |
| `gloss.open.<menuId>` | op | Navigating from a panel into a non-root menu |

`gloss.panels` also covers `/gloss menu create`. That command writes a menu document and a panel
document together in one transaction. A new hologram menu is placed in the world in a single step.
See [Hologram Menus](/gloss/09-menus) for that command and for `/gloss menu new`, which creates a
menu document alone.

Panel writes share one write permit with editor sync and the in-game writers, so they queue behind
each other rather than interleaving. A panel publication that cannot get the permit within 30
seconds fails instead of blocking, and a transaction abandoned by its owner is force-aborted after
two minutes with a `SEVERE` line naming the abandoned lease. Either way the store is never left
locked. See [Web Editor](/gloss/18-web-editor).

The full tree is on [Commands & Permissions](/gloss/17-commands-permissions).
