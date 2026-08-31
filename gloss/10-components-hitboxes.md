---
title: "Components & Hitboxes"
description: "Gloss documentation: Components & Hitboxes"
published: true
date: 2026-08-26
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

A menu `components` array holds the individual elements a player sees and clicks. This page covers the three component types, their JSON keys, runtime behavior, hitboxes, click routing, and the two debug overlays. See [Hologram Menus](/gloss/09-menus) for the parent document. See [Icons](/gloss/11-icons) and [Actions](/gloss/12-actions) for the payloads.

## The component entry

Every entry of `components` is an object with three keys.

| Key | Type | Required | Notes |
|---|---|---|---|
| `id` | string | yes | Identifier within this menu. Used as the key for API icon updates and click handlers, and in click and error log lines |
| `offset` | `vector3` | yes | Offset from the menu center |
| `data` | object | yes | The type-discriminated component body |

`vector3` is always a three-element JSON array of numbers, `[x, y, z]`. The object form is not accepted.

All three keys are required at open time, not at load time. A component missing `offset` or `data` registers with the file and throws when a player opens the menu.

Each component keeps its raw offset and resolves it through the session
transform. The transform mirrors X and multiplies all three axes by the
effective scale. It then applies roll around Z, pitch around X, and the
negated menu facing yaw around Y:

```java
Vector worldOffset = new Vector(-offset.getX() * scale, offset.getY() * scale, offset.getZ() * scale)
    .rotateAroundZ(Math.toRadians(roll))
    .rotateAroundX(Math.toRadians(pitch))
    .rotateAroundY(Math.toRadians(-facingYaw));
Location componentPosition = menuOrigin.clone().add(worldOffset);
```

The effective scale is `[menus] uiScale` for a personal session, and the panel own scale multiplied by `uiScale` for a panel view. A positive `offset[0]` therefore puts the component to the viewing side right. Personal sessions have zero pitch and roll. Panels can use all three rotations. The resulting location carries the display yaw (`facingYaw + 180`) and the transform pitch. The click plane also carries the roll.

The menu-level `offset` is mirrored on X the same way but is **not** scaled. Only component offsets, icon geometry and hitbox geometry scale.

### Duplicate ids

Duplicate `id` values do not reject the file. When the session is constructed the components go into an insertion-ordered map with a first-wins insert. The first component with a given id is kept. Every later one is dropped with

```
Menu "<menuId>" declares duplicate component id "<componentId>"; keeping the first component.
```

A dropped duplicate does not render. It does not tick. It cannot be clicked.

### The `data` discriminator

`data` is decoded on its `type` string. The adapter removes `type` from the object before it hands the remainder to the concrete body. `type` never collides with a payload key. The adapter re-inserts it on serialisation. Matching is exact and case sensitive.

| Failure | Message |
|---|---|
| No `type` key | `Missing type` |
| `type` is not a string | `Type must be a string` |
| Unrecognised `type` | `Unknown type: <value>` |

Any of the three aborts the whole file. The file is then skipped with a logged stack trace.

| `type` | Java record | Clickable |
|---|---|---|
| `button` | `ButtonComponentData` | yes |
| `decoration` | `DecoComponentData` | no |
| `toggle` | `ToggleComponentData` | yes |

The JSON spelling is `decoration`. The enum constant is `DECO`.

The same mechanism runs at two further levels nested inside `data`.
Icon `type` sits on `data.icon` for buttons and decorations, and on
`data.trueIcon` and `data.falseIcon` for toggles. Action `type` sits on
each entry of `data.actions`, `data.trueActions` and `data.falseActions`.

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

`actions` are resolved when the document is parsed and again when the
component is built. An action whose payload is unusable is dropped.
Examples include an empty command, an unresolvable sound, a teleport
with no destination, a connect with no server name, or a navigate with
no target. Gloss logs a one-time warning naming the menu and component.
The rest of the list still runs. A null or absent `actions` list yields
an empty list. The button does nothing when clicked.

`icon` is resolved through the icon factory. A failure logs the exception and uses the built-in "missing" icon, an eight-row black and magenta checkerboard, instead of dropping the component.

### Click behavior

A click scans the resolved actions in list order. It executes only
those whose `trigger` is `any`, which is the default. It also executes
those whose `trigger` is exactly the interaction that occurred. There is
no per-component cooldown, debounce or re-entrancy guard. A `navigate`
action stops the remainder of the chain.

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

A decoration is not clickable. It has no collision plane. It is never ray-tested. It never enters the selected state. It has no highlight. It is skipped when the click candidate list is built. It accepts neither `highlightModifier` nor `hitbox`. Its open, tick and close hooks are no-ops.

It still ticks its icon. Animated images advance. Text placeholders refresh. It still accepts API icon replacement.

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

State is a single transient boolean on the component instance. It is per player and per session. Gloss builds the component with the session and discards it when the session closes. It does not persist the state to PDC, a file, or a database, and never writes it back to the placeholder named in `condition`. Reopening the menu evaluates the initial state again.

The initial state is evaluated once, in the constructor:

```java
state = Placeholders.setPlaceholders(session.getPlayer(), condition).equalsIgnoreCase(expected);
```

`condition` is expanded through PlaceholderAPI against the viewing player and compared case-insensitively to `expectedValue`. It is never re-evaluated on tick. An external change to the underlying placeholder does not update an open toggle.

> If you omit `condition`, the constructor throws and aborts the whole open. There is nothing to compare. If you omit only `expectedValue`, the comparison returns false. The toggle starts in the false state.
{.is-warning}

### Click behavior

```java
if (state) { falseActions...; swapIcon(falseIcon); state = false; }
else       { trueActions...;  swapIcon(trueIcon);  state = true; }
```

`trueActions` and `trueIcon` belong to the state being **entered**, not the state being left. If you click a toggle that is currently false, Gloss runs `trueActions` and shows `trueIcon`.

Both icons are constructed eagerly in the constructor. Both are
teleported whenever the component moves. The inactive one stays
positionally in sync without being spawned. The icon swap removes the
current icon display entities and teleports the replacement. It then
rebuilds the collision plane from the new icon bounding box or shared custom hitbox, applies the current hover progress to the replacement visual, and spawns it. A state change therefore does not snap an already-hovered toggle back to its base position.

Like buttons, toggles have no cooldown. If a matching `navigate` action is reached, the method returns before the icon and state change. The toggle does not flip. Navigation bound to a different trigger is skipped and does not block the transition.

## The hitbox system

Every clickable component owns a `CollisionPlane`: a rectangle with a center, a width, a height and a basis of up, right and normal vectors. Hover selection and click targeting are both ray tests against that rectangle. The plane is derived from the icon bounding box unless a `hitbox` object overrides it.

### `hitbox` keys

`hitbox` is accepted on buttons and toggles. The schema constrains it with `minProperties: 1`, `additionalProperties: false`, and a mutual `dependentRequired` binding between `width` and `height`.

| Key | Type | Required | Default when absent |
|---|---|---|---|
| `width` | number | no. Required if `height` is present | `null`, meaning automatic sizing from the icon |
| `height` | number | no. Required if `width` is present | `null`, meaning automatic sizing from the icon |
| `offset` | `vector3` | no | `null`, treated as `[0, 0, 0]` |
| `anchor` | `"button"` or `"menu"` | no | `null`, treated as `button` |

`width` and `height` are blocks at scale 1. They are multiplied by the live effective scale when the plane is built. `offset` is likewise a pre-scale value. It goes through the same local-vector transform as everything else.

Validation runs in the record compact constructor and throws during deserialisation. That aborts the file:

| Condition | Message |
|---|---|
| Exactly one of `width` / `height` supplied | `Button hitbox width and height must be supplied together.` |
| `width` non-finite or `<= 0` | `Button hitbox width must be finite and greater than zero.` |
| `height` non-finite or `<= 0` | `Button hitbox height must be finite and greater than zero.` |
| Any component of `offset` non-finite | `Button hitbox offset must contain only finite values.` |

A hitbox object that carries only `offset` and/or `anchor` keeps the automatic icon-derived dimensions while it relocates the plane. Round-tripping is symmetric. `offset` serialises back to a three-element array. `anchor` serialises back to its lowercase form.

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

A button-anchored plane translates when the button origin moves. A menu-anchored plane center does not. With `anchor: "menu"` and no `offset` the plane sits exactly on the menu center no matter where the icon is. That fully decouples the clickable region from the visible element.

### Offset axis convention

```java
new Vector(-offset.x * scale, offset.y * scale, offset.z * scale)
    .rotateAroundZ(Math.toRadians(roll))
    .rotateAroundX(Math.toRadians(pitch))
    .rotateAroundY(Math.toRadians(-facingYaw))
```

The axes are menu-relative. `+x` moves the plane to the viewing side right. `+y` moves it up. `+z` moves it away from that side. The plane basis receives the same roll, pitch and negated facing yaw. A fixed icon and its plane stay aligned. A following personal menu updates its yaw on turns. A followed panel resolves its configured rotation mode.

Worked example: offset `[0.5, -0.25, 0.75]` at scale 2, with the basis `right = (1,0,0)`, `up = (0,1,0)`, `normal = (0,0,-1)`, yields the translation `(-1, -0.5, 1.5)`. When the basis rotates, the translation rotates with it.

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

The `0.325` in the text center is `(2 * NAMETAG_SIZE) - (4.5 / 40)`. That correction puts the plane over the rendered text rather than over its anchor.

For image icons the line length is the rendered row width in characters. The plane width tracks image width. A one-row image is one line tall, not zero. Entity icons have no display style. Their planes use the declared `width` and `height`, which default to `1`, are bounded to `(0, 64]`, and are not multiplied by a style scale.

Automatic dimensions multiply by the icon `style.scaleX` and `style.scaleY`. **An explicitly sized hitbox does not.** `width` and `height` are authored plane dimensions. Only the effective scale applies to them.
## Hover highlighting

Highlighting runs once per tick per open clickable component:

1. The plane is re-oriented for the live eye position, following the icon billboard.
2. The ray test decides whether the component is selected.
3. Hover progress advances toward 1 while selected and retreats toward 0 after exit over `hoverDurationTicks`. Zero changes state instantly.
4. The selected easing curve converts that progress into visual travel: `plane.normal * highlightModifier * effectiveScale * easing(progress)`.

`highlightModifier` is authored in menu-local blocks at scale 1. Effective `uiScale`, including panel scale, is applied exactly once. The logical collision plane never follows the visual displacement, so hover cannot make its own target drift. Billboard icons recompute the travel direction from their current normal each tick. Item, block, text, image and living-entity icons all use the same visual motion. The four easing curves are linear, cubic ease-out, cubic ease-in/out and back-out overshoot. The shipped blank baseline demonstrates a seven-tick `back_out` nudge.

Selection is tick-driven presentation state only. It is not a prerequisite for a click. A click does not consult it.

## Click routing

### Which inputs reach components

The dispatcher listens on `PlayerInteractEvent` at `EventPriority.HIGHEST`. It ignores an event an earlier listener already cancelled.

| Main-hand input | Bukkit `Action` | Trigger |
|---|---|---|
| Left click, not sneaking | `LEFT_CLICK_AIR`, `LEFT_CLICK_BLOCK` | `left_click` |
| Right click, not sneaking | `RIGHT_CLICK_AIR`, `RIGHT_CLICK_BLOCK` | `right_click` |
| Left click, sneaking | `LEFT_CLICK_AIR`, `LEFT_CLICK_BLOCK` | `shift_left_click` |
| Right click, sneaking | `RIGHT_CLICK_AIR`, `RIGHT_CLICK_BLOCK` | `shift_right_click` |

Off-hand events and `PHYSICAL` are ignored. `any` is an action binding, not a physical interaction. It is never delivered as the trigger of a click. A packet-only living icon has a normal client interaction outline, so the client sends `INTERACT_ENTITY` instead of a Bukkit air click when it is targeted. Gloss recognizes only its own raw entity ids, cancels that packet and schedules the same event-time logical-plane dispatch on the player owning thread. Entity icons therefore activate buttons and toggles without bypassing hitboxes, obstruction or nearest-target arbitration.
### Obstruction

Before anything is dispatched, a block ray trace runs from the eye out to the winning distance. If it finds a block closer than that, the click is abandoned and the event is left alone. The player normal block interaction happens instead. Passable blocks and fluids do not obstruct. Entities never obstruct.

On Folia the ray trace is replaced by an exact voxel walk over blocks owned by the current region. A foreign-region voxel is treated as passable, so a menu crossing a region seam remains clickable; obstruction inside that foreign region is best-effort.

An unobstructed hit cancels the event before the API event and any actions run. The same input does not also perform its vanilla block interaction.
## Debug overlays

Menu particle layers are independent of these operator debug overlays. Their definitions live at
the menu top level, can target a component by its sanitized id, and are sent only to that menu or
panel viewer. Component geometry uses the current component plane and bounds after the menu or panel
transform. Text-only `line` and `span` targets require a text icon; a non-text component can still
use component bounds, lines, outlines, planes or cuboids. See
[Particle Layers](/gloss/25-particle-layers).

Two `gloss.toml` switches draw particle overlays. Both default to `false`. Both are applied live when `gloss.toml` is edited or `/gloss reload` runs. Both drive their own repeating task at 2 ticks.

| Key | What it draws |
|---|---|
| `[debug] hitbox` | For every clickable component of every open session: the four edges and four corners of its collision plane in blue, plus a red segment from the plane center out along the normal for two blocks |
| `[debug] position` | For every open session: the menu center in yellow, and each component's resolved location in orange |

Edges are drawn as interpolated points at ten steps along each side. Every point is five redstone dust particles at size 1.

Both overlays cover **personal menu sessions only**. Panel views are not drawn.

The particles are spawned into the world, not sent to one player. Everyone nearby sees them. Leave both switches off on a production server.

There is no hover outline in normal operation. Without `[debug] hitbox` the only feedback that a component is selected is its `highlightModifier` displacement.
