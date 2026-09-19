---
title: "Components & Hitboxes"
description: "Build menu buttons, decorations, toggles, and their click areas"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

The `components` array holds a menu's buttons, decorations and toggles. See [Hologram Menus](/gloss/09-menus), [Icons](/gloss/11-icons) and [Actions](/gloss/12-actions).

## The component entry

| Key | Type | Required | Notes |
|---|---|---|---|
| `id` | string | yes | Identifier within this menu. Used as the key for API icon updates and click handlers, and in click and error log lines |
| `offset` | `vector3` | yes | Offset from the menu center |
| `data` | object | yes | The type-discriminated component body |
| `show` | boolean or expression | no | Defaults to `true`; combines with menu and panel visibility |

`vector3` is always a three-element JSON array of numbers, `[x, y, z]`. The object form is not accepted. A missing `offset` or `data` value is reported when the menu opens.

`show` applies to buttons, decorations and toggles. A hidden component has no visible icon and no active click target, and returns when its condition passes during a session tick. See [Show conditions](/gloss/13-expressions-placeholders#show-conditions).

Component offsets use menu-relative axes: positive X moves to the viewer's right, positive Y up, and positive Z away from the viewer. Personal menus scale them by `[menus] uiScale`; panels multiply their own scale by `uiScale`. Only component offsets, icon geometry and hitbox geometry scale — the menu-level `offset` does not.

Duplicate ids do not reject the file. Gloss keeps the first component, logs each later duplicate, and the dropped one neither renders nor receives clicks.

### The `data` discriminator

`data.type` is exact and case-sensitive. A missing, non-string or unrecognised value rejects the menu file with `Missing type`, `Type must be a string` or `Unknown type: <value>`.

| `type` | Clickable |
|---|---|
| `button` | yes |
| `decoration` | no |
| `toggle` | yes |

Icons and actions use their own `type` fields inside `data`.

## Button

```json
{
  "id": "confirm",
  "offset": [0.5, 0.0, 0.0],
  "data": {
    "type": "button",
    "highlightModifier": 0.05,
    "hoverDurationTicks": 4,
    "hoverEasing": "ease_out_cubic",
    "icon": { "type": "text", "text": "&aConfirm" },
    "actions": [
      { "type": "command", "command": "say confirmed", "source": "player" }
    ]
  }
}
```

| Key | Type | Required | Default when absent |
|---|---|---|---|
| `highlightModifier` | number | no | `0.0` |
| `hoverDurationTicks` | integer from 0 to 40 | no | `4`; `0` is instant |
| `hoverEasing` | `linear`, `ease_out_cubic`, `ease_in_out_cubic` or `back_out` | no | `ease_out_cubic` |
| `icon` | icon object | yes in the schema | `null` |
| `actions` | array of action objects | yes in the schema | `null` |
| `hitbox` | hitbox object | no | `null`, meaning a fully automatic hitbox |

The `Required` column reflects the advisory `schema/gloss.schema.json`; a button decoded with no `hitbox` simply has a null one. `highlightModifier` must be finite and `hoverDurationTicks`, when present, must be 0 to 40, or the document is rejected.

An invalid action is dropped with a log line naming the menu and component, and the rest of the list still runs. A missing action list creates a button that does nothing. An icon that fails to resolve becomes the missing-icon checkerboard rather than dropping the component.

A click runs matching actions in list order. `any` matches every supported click, and a `navigate` action stops the rest of that chain.

## Decoration

```json
{
  "id": "title",
  "offset": [0.0, 0.6, 0.0],
  "data": {
    "type": "decoration",
    "icon": { "type": "textImage", "path": "logo.png" }
  }
}
```

| Key | Type | Required | Default when absent |
|---|---|---|---|
| `icon` | icon object | yes in the schema | `null` |

A decoration is not clickable and has no hitbox or hover effect. Animated images and dynamic text still update.

## Toggle

```json
{
  "id": "flight",
  "offset": [-0.5, 0.0, 0.0],
  "data": {
    "type": "toggle",
    "highlightModifier": 0.05,
    "hoverDurationTicks": 6,
    "hoverEasing": "ease_in_out_cubic",
    "condition": "%player_gamemode%",
    "expectedValue": "CREATIVE",
    "trueIcon": { "type": "text", "text": "&aOn" },
    "falseIcon": { "type": "text", "text": "&cOff" },
    "hitbox": { "width": 0.8, "height": 0.3 },
    "trueActions": [{ "type": "command", "command": "gamemode creative", "source": "server" }],
    "falseActions": [{ "type": "command", "command": "gamemode survival", "source": "server" }]
  }
}
```

| Key | Type | Required | Default when absent |
|---|---|---|---|
| `highlightModifier` | number | no | `0.0` |
| `hoverDurationTicks` | integer from 0 to 40 | no | `4`; `0` is instant |
| `hoverEasing` | `linear`, `ease_out_cubic`, `ease_in_out_cubic` or `back_out` | no | `ease_out_cubic` |
| `condition` | string | yes in the schema | `null` |
| `expectedValue` | string | yes in the schema | `null` |
| `trueActions` | array of action objects | yes in the schema | `null` |
| `falseActions` | array of action objects | yes in the schema | `null` |
| `trueIcon` | icon object | yes in the schema | `null` |
| `falseIcon` | icon object | yes in the schema | `null` |
| `hitbox` | hitbox object | no | `null`, meaning the active icon supplies the automatic plane |

An explicit `hitbox` gives both states one stable click plane even when the true and false icons differ in size. Without one, each state uses its active icon's automatic geometry.

Toggle state is per player and lasts only for the open session; reopening the menu evaluates the initial state again. `condition` is expanded through PlaceholderAPI against the viewing player and compared case-insensitively to `expectedValue`. It is never re-evaluated on tick, so an external change to the underlying placeholder does not update an open toggle.

> Omitting `condition` prevents the menu from opening. Omitting only `expectedValue` starts the toggle in the false state.
{.is-warning}

`trueActions` and `trueIcon` belong to the state being **entered**, not the one being left: clicking a toggle that is currently false runs `trueActions` and shows `trueIcon`. Switching state replaces the icon and updates the click area. If a matching `navigate` action runs, the toggle does not change state.

## The hitbox system

Buttons and toggles use a rectangular hitbox, sized from the icon unless the component supplies a `hitbox` object.

| Key | Type | Required | Default when absent |
|---|---|---|---|
| `width` | number | no. Required if `height` is present | `null`, meaning automatic sizing from the icon |
| `height` | number | no. Required if `width` is present | `null`, meaning automatic sizing from the icon |
| `offset` | `vector3` | no | `null`, treated as `[0, 0, 0]` |
| `anchor` | `"button"` or `"menu"` | no | `null`, treated as `button` |

`width` and `height` are blocks at scale 1, multiplied by the live effective scale when the plane is built. `offset` is likewise a pre-scale value on the same menu-relative axes. A hitbox with only `offset` or `anchor` keeps automatic dimensions and moves the click area.

```json
{
  "hitbox": {
    "width": 0.6,
    "height": 0.25,
    "offset": [0.0, -0.1, 0.0],
    "anchor": "button"
  }
}
```

Invalid hitbox values reject the file:

| Condition | Message |
|---|---|
| Exactly one of `width` / `height` supplied | `Button hitbox width and height must be supplied together.` |
| `width` non-finite or `<= 0` | `Button hitbox width must be finite and greater than zero.` |
| `height` non-finite or `<= 0` | `Button hitbox height must be finite and greater than zero.` |
| Any component of `offset` non-finite | `Button hitbox offset must contain only finite values.` |

### Anchor

| Value | Origin the `offset` is measured from |
|---|---|
| `button` | The center of the collision plane the icon produced at this component's location. Moves with the component |
| `menu` | The menu origin resolved through the session's current anchor, facing and offset. Independent of where the icon is drawn |

### Automatic sizing

Without a `hitbox`, or with one that has no `width`, the plane's size and center are measured from the icon: text and image icons from their rendered lines and rows, item, block and custom-item icons from a fixed square, and entity icons from their declared `width` and `height`.

Automatic dimensions are multiplied by the icon's `style.scaleX` and `style.scaleY`. **An explicitly sized hitbox is not** — only the effective session scale applies to it. Entity icons have no display style, so their planes use the declared `width` and `height`, defaulting to `1` and bounded to `(0, 64]`.

## Hover highlighting

`highlightModifier` sets how far the icon moves along its plane normal when a player looks at it, over `hoverDurationTicks` and shaped by `hoverEasing`. The click area does not move. Hover selection is visual only and is not required for a click.

## Click routing

Gloss accepts uncancelled main-hand clicks:

| Main-hand input | Bukkit `Action` | Trigger |
|---|---|---|
| Left click, not sneaking | `LEFT_CLICK_AIR`, `LEFT_CLICK_BLOCK` | `left_click` |
| Right click, not sneaking | `RIGHT_CLICK_AIR`, `RIGHT_CLICK_BLOCK` | `right_click` |
| Left click, sneaking | `LEFT_CLICK_AIR`, `LEFT_CLICK_BLOCK` | `shift_left_click` |
| Right click, sneaking | `RIGHT_CLICK_AIR`, `RIGHT_CLICK_BLOCK` | `shift_right_click` |

Off-hand and physical interactions are ignored. Solid blocks between the player and the component block the click; passable blocks, fluids and entities do not. An accepted menu click does not also perform the vanilla interaction.

## Debug overlays

Two `gloss.toml` settings draw debug particles. Both default to `false` and apply on reload.

| Key | What it draws |
|---|---|
| `[debug] hitbox` | For every clickable component of every open session: the four edges and four corners of its collision plane in blue, plus a red segment from the plane center out along the normal for two blocks |
| `[debug] position` | For every open session: the menu center in yellow, and each component's resolved location in orange |

Debug overlays cover personal menus only, and everyone nearby can see their particles, so leave them off during normal use. Without `[debug] hitbox` the only feedback that a component is selected is its `highlightModifier` displacement. Menu particle layers are a separate feature; see [Particle Layers](/gloss/25-particle-layers).
