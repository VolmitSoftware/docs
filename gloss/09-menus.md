---
title: "Hologram Menus"
description: "Build private hologram menus from JSON, commands, or the Gloss API"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

A menu is a JSON document under `plugins/Gloss/menus/`. It can contain text, images, items, buttons and particle layers. Personal menus are visible only to the player who opens them; panels can show the same menu in the world.

## Where menu documents live

```
plugins/Gloss/menus/     menu documents
plugins/Gloss/images/    image assets referenced by textImage and animatedTextImage icons
```

When menus are enabled, Gloss creates `menus/default.json` if it is missing. The `images/` folder appears when you add an image or import one through the editor.

Menus are discovered recursively. Anything that is not a plain `.json` file inside `menus/` is ignored, including files under a dot-folder and anything reached through a symbolic link.

### The menu id

The id is the file path relative to `menus/` with `.json` removed, using `/` as the separator. Case is preserved and ids are case-sensitive.

| File | Menu id |
|---|---|
| `menus/shop.json` | `shop` |
| `menus/main_menu.json` | `main_menu` |
| `menus/Shop.JSON` | `Shop` |
| `menus/shops/weapons/main.json` | `shops/weapons/main` |

There is no `id` key in the document, so renaming or moving the file changes the menu id. Commands, panels, navigation actions and the API all use this path-based id.

An id may be at most 255 characters, in slash-separated segments of at most 64 characters that each match `[A-Za-z0-9][A-Za-z0-9._-]*`. A file with an invalid id is skipped and logged, so use plain ASCII names without spaces.

Menu files have no `schemaVersion` or `revision`, but Gloss still rejects a stale write when another editor changed the same menu first.

## The menu document

`plugins/Gloss/menus/hello.json`, menu id `hello`:

```json
{
  "offset": [0, 1.5, 2],
  "particleLayers": [],
  "components": [
    {
      "id": "greeting",
      "offset": [0, 0, 0],
      "data": {
        "type": "decoration",
        "icon": {
          "type": "text",
          "text": "&aHello, %player_name%"
        }
      }
    }
  ]
}
```

`vector3` throughout the format is a JSON array of exactly three numbers, `[x, y, z]`. The object form `{"x": …}` is not accepted.

| Key | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `show` | boolean or expression | no | `true` | Visibility for the session viewer |
| `offset` | `vector3` | yes | none | Position of the menu center relative to the session anchor. Never scaled by `uiScale` |
| `components` | array of component | yes | none | The elements of the menu. A single component object is accepted in place of a one-element array |
| `particleLayers` | array of particle layer | no | `[]` | Viewer-targeted particles attached to the projection, components or marked text ranges |
| `lockPosition` | boolean | no | `false` | Freeze the viewer in place while the menu is open |
| `followPlayer` | boolean | no | `false` | Re-anchor the menu to the viewer on every accepted move, adopting their yaw |
| `maxDistance` | number | no | `6.0E7` | Blocks between viewer and menu center before the menu closes. Clamped to `[0, 6.0E7]`. `null` or absent gives `6.0E7` |
| `closeOnDeath` | boolean | no | `false` | Close on `PlayerDeathEvent` |
| `closeOnTeleport` | boolean | no | `false` | Close on `PlayerTeleportEvent` |

`offset` and `components` are required to open the menu; a missing value is logged when the menu is opened.

### Visibility

Document-level `show` and `components[].show` use the session viewer and are reevaluated during session ticks. A hidden menu keeps its session but hides its components and particles, blocks clicks, and releases `lockPosition` while hidden. See [Show conditions](/gloss/13-expressions-placeholders#show-conditions).

### Offset semantics

`offset` is read in the menu's own frame, not in world axes:

| Axis | Direction |
|---|---|
| `+X` | to the viewing side's right |
| `+Y` | up |
| `+Z` | forward, away from the viewing side |

A personal menu starts at the player's feet and uses their view direction; a panel supplies its stored position and rotation.

The menu `offset` is **not** multiplied by `uiScale`, but component offsets are. Raising `uiScale` spreads the components apart around a center that does not move.

### Range, freezing and following

`lockPosition` constrains the player; `followPlayer` constrains the menu. They are independent, and a document may set neither, either or both. A locked player can still look around and is never closed for distance.

With neither flag set the menu stays where it is while the player walks away, up to `maxDistance`. Crossing that limit or changing worlds closes the menu, as do `closeOnDeath` and `closeOnTeleport` for their events.

`/gloss menu move` re-anchors an open session to your current position. It is translation only: it does not change the facing, either flag, or the file.

These lifecycle settings apply only to personal menus. Panels use their own placement and range settings. See [Panels](/gloss/16-panels).

## The session model

Each player can have one personal menu open, and opening another replaces it. Personal menu displays are sent only to that player and are never saved in the world.

Navigation keeps a per-player history stack and a recorded root menu. A `navigate` action can push, replace, go back or go home, and `/gloss menu back` reopens the previous entry. Quitting closes the session and clears the history.

With `[features] menus = false`, personal menus cannot open. Documents stay editable, and panels keep their separate feature switch.

## Text inside menus

Menu and panel text runs through the shared viewer-aware pipeline — functions, inline expressions, PlaceholderAPI, emoji, colors, then MiniMessage — before the menu subsystem converts it to a component. Each line of a text icon's `text` is split on `\n`. See [Emoji, Text & Animations](/gloss/07-emoji-text-animations#the-text-pipeline).

Text resolves for each viewer. `refreshTicks` controls dynamic refreshes from `0` to `1200`, and `0` disables them. A failed refresh keeps the previous text and logs the error.

A text icon also accepts `box`, using the shared [display style and box contract](/gloss/11-icons#display-style-and-boxes). The box surrounds the text block, resizes after text or animation changes, and follows menu movement, rotation, scale, component visibility and session closure.

```json
"icon": {
  "type": "text",
  "text": "&aWelcome\n&7%player_name%",
  "style": {"billboard": "fixed", "scaleX": 1.2, "scaleY": 1.2},
  "box": {"enabled": true, "padding": 6, "borderWidth": 2,
          "backgroundArgb": "#B31B1B22", "borderArgb": "#FFAAAAAA"}
}
```

A toggle `condition` uses the same renderer, but only once when the session is constructed. A `message` action renders through the pipeline each time it fires. See [Components & Hitboxes](/gloss/10-components-hitboxes).

## Particle layers

The top-level `particleLayers` field can target the full menu, one component, text, a line, a named span, or local coordinates. Each layer is visible only to that menu or panel viewer. See [Particle Layers](/gloss/25-particle-layers).

## Parsing

Use standard JSON. Unknown keys are ignored, so a `"$schema"` member added for editor tooling is harmless. A single object is accepted where an array is expected, so `"components": {…}` parses the same as `"components": [{…}]`; the same holds for `actions`, `trueActions` and `falseActions`.

Gloss validates ids, type values, hitboxes, refresh intervals, icon dimensions and display styles at load. Some missing required fields are reported only when the menu opens. An invalid edit never replaces the working menu — Gloss logs the file and the reason.

## Hot reload

Gloss watches `menus/` and `images/`. A changed menu file is re-parsed and replaces its registry entry: matching personal sessions close with `DEFINITION_RELOADED` and an action-bar notice, and any panel showing that menu reloads it. A changed, added or removed image refreshes open sessions and panel views without reloading the menu document. Successful reloads notify online administrators, and `[commands] sounds` controls the chime.

> If you delete a menu file, Gloss waits 3 seconds before unregistering it and closing anyone viewing it. Restoring the path during that grace cancels the unload; after the grace there is no backup for a hand-deleted file.
{.is-warning}

## Configuration

| Key | Default | Effect |
|---|---|---|
| `[features] menus` | `true` | When `false`, no menu can be opened by command, action or API |
| `[menus] uiScale` | `1.0` | Global render scale multiplier for menus and panels. Clamped to `0.25` – `4.0` |

`uiScale` multiplies component offsets, icon geometry and hitbox dimensions, but not the menu-level `offset`. Changing it in `gloss.toml` applies on the next hot reload without reopening; open sessions and panel views rebuild in place.

`[debug] hitbox` and `[debug] position` draw particle overlays for open sessions and also apply live. See [Components & Hitboxes](/gloss/10-components-hitboxes) and [Configuration](/gloss/02-configuration).

## Editing menus in game

Use `/gloss menu` or `/gloss menus`. See [Commands & Permissions](/gloss/17-commands-permissions) for permissions.

```
/gloss menu new shops/weapons
/gloss menu addrow shops/weapons &6Buy a sword
/gloss menu seticon shops/weapons 1 item minecraft:iron_sword
/gloss menu style shops/weapons 1 billboard vertical
/gloss menu offsetrow shops/weapons 1 0 ~0.25 0
```

| Node | What it writes |
|---|---|
| `new <menu>` | Creates a new file from the default blank file. Fails if the id already exists |
| `copy <menu> <newMenu>` | Copies an existing document to a new id |
| `addrow <menu> <text>` | Appends a text decoration component, offset one row spacing below the last |
| `insertrow <menu> <row> <text>` | Inserts a text decoration at a one-based row |
| `setrow <menu> <row> <text>` | Replaces that row's text. Only `button` and `decoration` rows have one editable icon |
| `removerow <menu> <row>` | Deletes the row |
| `offsetrow <menu> <row> <x> <y> <z>` | Rewrites that component's `offset`. Each coordinate is absolute, or `~`-relative to the current value |
| `seticon <menu> <row> <type> <value>` | Replaces the row's icon. Types: `text`, `image`, `animated`, `item`, `block`, `customItem`, `entity` |
| `style <menu> <row> <property> <value>` | Sets one display-style property on the row's icon. `value=*` clears it. Entity icons have no display style |
| `image <menu> <path>` | Replaces the entire component list with one centered image component |
| `create <hologram> [text=]` | Creates a **panel** plus a same-id menu at your position |
| `list`, `open`, `back`, `close`, `move` | Session and navigation control. They do not write |

Row numbers are one-based and count components in document order. `seticon` with an image type verifies the file exists under `images/` before writing. `style` writes into the icon `style` object and removes the object entirely when the last property is cleared. If the file changes between reading and saving, Gloss reports a revision conflict and writes nothing.

`/gloss web edit menu <menu>` opens one menu in a restricted live web session. `/gloss web workspace` opens every editable runtime document and image.

> `/gloss menu create` and `/gloss menu new` are different commands. `create` makes a persistent world-anchored panel plus its root menu, is player only, and is gated by `gloss.panels`. `new` makes a blank menu document only and is gated by `gloss.menus.edit`.
{.is-info}

### The default and creation baseline

Gloss extracts `plugins/Gloss/menus/default.json` when menus are enabled and the file is missing. `/gloss menu new` uses the same starter.

```json
{
  "offset": [0.0, 1.7, 2.5],
  "lockPosition": false,
  "followPlayer": false,
  "closeOnDeath": true,
  "closeOnTeleport": true,
  "components": [
    {
      "id": "title",
      "offset": [0.0, 0.35, 0.0],
      "data": {
        "type": "decoration",
        "icon": { "type": "text", "text": "&6&lGloss Menu" }
      }
    },
    {
      "id": "body",
      "offset": [0.0, 0.05, 0.0],
      "data": {
        "type": "decoration",
        "icon": { "type": "text", "text": "&7Edit menus/default.json or use the web editor." }
      }
    },
    {
      "id": "close",
      "offset": [0.0, -0.35, 0.0],
      "data": {
        "type": "button",
        "highlightModifier": 0.05,
        "icon": { "type": "text", "text": "&cClose" },
        "actions": [
          { "type": "sound", "sound": "ui.button.click", "source": "master", "volume": 1.0, "pitch": 1.0 },
          { "type": "navigate", "mode": "close" }
        ]
      }
    }
  ]
}
```

`/gloss menu create` does not use this baseline. It writes a smaller document with one vertical-billboard decoration at `offset` `[0, 1.7, 0]`, because a panel supplies its own placement. With no `text=`, the label is `&f` followed by the panel id.

## Permissions

| Node | Checked when |
|---|---|
| `gloss.menus.list` | `/gloss menu list`, and the `menu open menu=*` form which falls through to it |
| `gloss.menus.open` | `/gloss menu open` with a real id |
| `gloss.menus.back` / `.close` / `.move` | The matching command |
| `gloss.menus.edit` | `new`, `copy` and every content node |
| `gloss.menus.create` and `gloss.panels` | `/gloss menu create` |
| `gloss.open.<menuId>` | Opening that specific menu |

### `gloss.open.<menuId>`

Opening a menu also requires `gloss.open.<menuId>`, which defaults to operators. A menu id containing `/` produces a node such as `gloss.open.shops/weapons/main`.

It is checked on `/gloss menu open` (after `gloss.menus.open`), on a `navigate` action in a personal session or on a panel, on `GlossAPI` open calls, and when opening a submenu from a panel. It is not checked by `/gloss menu list` or for a panel's own root menu.

Grant `gloss.open.*` to let a group open everything, or grant individual nodes to gate menus one by one.

## The JSON schema

`schema/gloss.schema.json` is an editor schema with `$id` `https://volmit.com/gloss/schema.json`. The server does not read it — map it in your IDE or add a `"$schema"` key, which the runtime ignores. `schema/gloss-preview.schema.json` sits beside it and describes [Container Previews](/gloss/15-container-previews) instead.

## Migrating from HoloUi

The document format is unchanged: menu files copied out of `plugins/holoui/menus/` load in Gloss as they are, and `/gloss import holoui` copies them into `plugins/Gloss/menus/` for you.

What changed around them:

- the folder is `plugins/Gloss/menus/`, not `plugins/holoui/menus/`
- the commands are `/gloss menu …`, and `/holoui menu create` is now `/gloss menu new`
- the permissions are `gloss.menus.*` and `gloss.open.<menuId>`
- `uiScale` is `[menus] uiScale` in `gloss.toml`, not `UI_SCALE` in `settings.json`
- HoloUi world-anchored **boards** are Gloss **panels**. `/gloss board` is the scoreboard tree and has nothing to do with menus
- the id contract is enforced at load, so a menu path that HoloUi tolerated may now be refused

The command and permission mapping tables are in [Commands & Permissions](/gloss/17-commands-permissions).
