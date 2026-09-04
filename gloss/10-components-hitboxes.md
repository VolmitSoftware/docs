---
title: "Components & Hitboxes"
description: "Build menu buttons, decorations, toggles, and their click areas"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

The `components` array holds a menu's buttons, decorations, and toggles. See [Hologram Menus](/gloss/09-menus), [Icons](/gloss/11-icons), and [Actions](/gloss/12-actions).

## The component entry

Every entry of `components` is an object with three keys.

| Key | Type | Required | Notes |
|---|---|---|---|
| `id` | string | yes | Identifier within this menu. Used as the key for API icon updates and click handlers, and in click and error log lines |
| `offset` | `vector3` | yes | Offset from the menu center |
| `data` | object | yes | The type-discriminated component body |

`vector3` is always a three-element JSON array of numbers, `[x, y, z]`. The object form is not accepted.

All three keys are required. A missing `offset` or `data` value is reported when the menu opens.

Gloss transforms each local component offset into the menu's position, scale, and rotation:

```java
Vector worldOffset = new Vector(-offset.getX() * scale, offset.getY() * scale, offset.getZ() * scale)
    .rotateAroundZ(Math.toRadians(roll))
    .rotateAroundX(Math.toRadians(pitch))
    .rotateAroundY(Math.toRadians(-facingYaw));
Location componentPosition = menuOrigin.clone().add(worldOffset);
```

Personal menus use `[menus] uiScale`. Panels multiply their own scale by `uiScale`. Positive X moves toward the viewer's right.

The menu-level `offset` is mirrored on X the same way but is **not** scaled. Only component offsets, icon geometry and hitbox geometry scale.

### Duplicate ids

Duplicate IDs do not reject the file. Gloss keeps the first component and logs each later duplicate with

```
Menu "<menuId>" declares duplicate component id "<componentId>"; keeping the first component.
```

A duplicate that is dropped does not render or receive clicks.

### The `data` discriminator

The `data.type` value is exact and case-sensitive.

| Failure | Message |
|---|---|
| No `type` key | `Missing type` |
| `type` is not a string | `Type must be a string` |
| Unrecognised `type` | `Unknown type: <value>` |

Any of these errors rejects the menu file and logs the reason.

| `type` | Java record | Clickable |
|---|---|---|
| `button` | `ButtonComponentData` | yes |
| `decoration` | `DecoComponentData` | no |
| `toggle` | `ToggleComponentData` | yes |

The JSON spelling is `decoration`. The enum constant is `DECO`.

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

The `Required` column reflects `schema/gloss.schema.json`, which is advisory. A button decoded with no `hitbox` simply has a null hitbox. Parsed `highlightModifier` must be finite and `hoverDurationTicks`, when present, must be between 0 and 40 or the document is rejected.

Gloss drops an invalid action, logs the menu and component, and keeps the rest of the action list. A missing action list creates a button that does nothing.

`icon` is resolved through the icon factory. A failure logs the exception and uses the built-in "missing" icon, an eight-row black and magenta checkerboard, instead of dropping the component.

### Click behavior

A click runs matching actions in list order. `any` matches every supported click. A `navigate` action stops the rest of that action chain.

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

A toggle accepts the same optional hitbox as a button. An explicit size gives both states one stable click plane even when the true and false icons have different dimensions. Without one, each state uses the active icon automatic geometry.

### State

Toggle state is per player and lasts only for the open session. Reopening the menu evaluates the initial state again.

`condition` is expanded through PlaceholderAPI against the viewing player and compared case-insensitively to `expectedValue`. It is never re-evaluated on tick. An external change to the underlying placeholder does not update an open toggle.

> Omitting `condition` prevents the menu from opening. Omitting only `expectedValue` starts the toggle in the false state.
{.is-warning}

### Click behavior

`trueActions` and `trueIcon` belong to the state being **entered**, not the state being left. If you click a toggle that is currently false, Gloss runs `trueActions` and shows `trueIcon`.

Switching state replaces the icon and updates the click area.

If a matching `navigate` action runs, the toggle does not change state.

## The hitbox system

Buttons and toggles use a rectangular hitbox. Gloss sizes it from the icon unless the component supplies a `hitbox` object.

### `hitbox` keys

Buttons and toggles accept these hitbox fields:

| Key | Type | Required | Default when absent |
|---|---|---|---|
| `width` | number | no. Required if `height` is present | `null`, meaning automatic sizing from the icon |
| `height` | number | no. Required if `width` is present | `null`, meaning automatic sizing from the icon |
| `offset` | `vector3` | no | `null`, treated as `[0, 0, 0]` |
| `anchor` | `"button"` or `"menu"` | no | `null`, treated as `button` |

`width` and `height` are blocks at scale 1. They are multiplied by the live effective scale when the plane is built. `offset` is likewise a pre-scale value. It goes through the same local-vector transform as everything else.

Invalid hitbox values reject the file:

| Condition | Message |
|---|---|
| Exactly one of `width` / `height` supplied | `Button hitbox width and height must be supplied together.` |
| `width` non-finite or `<= 0` | `Button hitbox width must be finite and greater than zero.` |
| `height` non-finite or `<= 0` | `Button hitbox height must be finite and greater than zero.` |
| Any component of `offset` non-finite | `Button hitbox offset must contain only finite values.` |

A hitbox with only `offset` or `anchor` keeps automatic dimensions and moves the click area.

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

### Anchor

| Value | Origin the `offset` is measured from |
|---|---|
| `button` | The center of the collision plane the icon produced at this component's location. Moves with the component |
| `menu` | The menu origin resolved through the session's current anchor, facing and offset. Independent of where the icon is drawn |

`button` anchors the hitbox to the component. `menu` anchors it to the menu origin, independently of the icon.

### Offset axis convention

```java
new Vector(-offset.x * scale, offset.y * scale, offset.z * scale)
    .rotateAroundZ(Math.toRadians(roll))
    .rotateAroundX(Math.toRadians(pitch))
    .rotateAroundY(Math.toRadians(-facingYaw))
```

Hitbox offsets use menu-relative axes: positive X moves right, positive Y moves up, and positive Z moves away from the viewer.

### Automatic sizing

When `hitbox` is absent, or present without `width`, the plane dimensions and center come entirely from the icon bounding box. With `S` the effective scale, `X = style.scaleX`, `Y = style.scaleY` and `NAMETAG_SIZE = 3.5 / 16 = 0.21875`, so that `lineWidth = NAMETAG_SIZE * S * X` and `lineHeight = NAMETAG_SIZE * S * Y`:

| Icon type | Plane width | Plane height | Plane center |
|---|---|---|---|
| `text` | `max over lines of (plainTextLength * lineWidth / 2)` | `lineCount * lineHeight` | `location - (0, 0.325 * S * Y, 0)` |
| `textImage` | same formula, over the rendered rows | `rowCount * lineHeight` | same as `text` |
| `animatedTextImage` | same formula, over the first frame | `firstFrameRowCount * lineHeight` | same as `text` |
| `item`, `customItem`, `itemStack` | `0.75 * S * X` | `0.75 * S * Y` | `location - (0, 0.05 * S, 0)` |
| `block` | `0.75 * S * X` | `0.75 * S * Y` | `location - (0, 0.05 * S, 0)` |
| `entity` | `width * S` | `height * S` | `location + (0, (height / 2) * S, 0)` |

For image icons the line length is the rendered row width in characters. The plane width tracks image width. A one-row image is one line tall, not zero. Entity icons have no display style. Their planes use the declared `width` and `height`, which default to `1`, are bounded to `(0, 64]`, and are not multiplied by a style scale.

Automatic dimensions multiply by the icon `style.scaleX` and `style.scaleY`. **An explicitly sized hitbox does not.** `width` and `height` are configured plane dimensions. Only the effective scale applies to them.
## Hover highlighting

Highlighting runs once per tick per open clickable component:

1. The plane is re-oriented for the live eye position, following the icon billboard.
2. The ray test decides whether the component is selected.
3. Hover progress advances toward 1 while selected and retreats toward 0 after exit over `hoverDurationTicks`. Zero changes state instantly.
4. The selected easing curve converts that progress into visual travel: `plane.normal * highlightModifier * effectiveScale * easing(progress)`.

`highlightModifier` controls how far the icon moves on hover. The hitbox stays in place. Easing options are `linear`, `ease_out`, `ease_in_out`, and `back_out`.

Hover selection is visual only and is not required for a click.

## Click routing

### Which inputs reach components

Gloss accepts uncancelled main-hand clicks:

| Main-hand input | Bukkit `Action` | Trigger |
|---|---|---|
| Left click, not sneaking | `LEFT_CLICK_AIR`, `LEFT_CLICK_BLOCK` | `left_click` |
| Right click, not sneaking | `RIGHT_CLICK_AIR`, `RIGHT_CLICK_BLOCK` | `right_click` |
| Left click, sneaking | `LEFT_CLICK_AIR`, `LEFT_CLICK_BLOCK` | `shift_left_click` |
| Right click, sneaking | `RIGHT_CLICK_AIR`, `RIGHT_CLICK_BLOCK` | `shift_right_click` |

Off-hand and physical interactions are ignored. Entity icons use the same hitbox and obstruction checks as other icons.

### Obstruction

Solid blocks between the player and component block the click. Passable blocks, fluids, and entities do not. An accepted menu click does not also perform the vanilla interaction.

## Debug overlays

Menu particle layers are separate from debug overlays. See [Particle Layers](/gloss/25-particle-layers).

Two `gloss.toml` settings draw debug particles. Both default to `false` and apply on reload.

| Key | What it draws |
|---|---|
| `[debug] hitbox` | For every clickable component of every open session: the four edges and four corners of its collision plane in blue, plus a red segment from the plane center out along the normal for two blocks |
| `[debug] position` | For every open session: the menu center in yellow, and each component's resolved location in orange |

Debug overlays cover personal menus only. Everyone nearby can see their particles, so leave them off during normal use.

There is no hover outline in normal operation. Without `[debug] hitbox` the only feedback that a component is selected is its `highlightModifier` displacement.
