---
title: "Components & Hitboxes"
description: "Gloss documentation: Components & Hitboxes"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---
A menu's `components` array holds the individual elements a player sees and clicks. This page covers the
three component types, their JSON keys and runtime behaviour, the collision-plane hitbox system including
the optional `hitbox` object on buttons, how main-hand clicks are routed to the nearest component, and the
two debug overlays. The document that contains them is described in
[Hologram Menus](/gloss/09-menus); the icon payloads are in [Icons](/gloss/11-icons) and the action
payloads in [Actions](/gloss/12-actions).

## The component entry

Every entry of `components` is an object with three keys.

| Key | Type | Required | Notes |
|---|---|---|---|
| `id` | string | yes | Identifier within this menu. Used as the key for API icon updates and click handlers, and in click and error log lines |
| `offset` | `vector3` | yes | Offset from the menu centre |
| `data` | object | yes | The type-discriminated component body |

`vector3` is always a three-element JSON array of numbers, `[x, y, z]`. The object form is not accepted.

All three keys are required at open time, not at load time. A component missing `offset` or `data`
registers with the file and throws when a player opens the menu.

Each component keeps its raw offset and resolves it through the session transform. The transform mirrors X,
multiplies all three axes by the effective scale, then applies roll around Z, pitch around X, and the
negated menu facing yaw around Y:

```java
Vector worldOffset = new Vector(-offset.getX() * scale, offset.getY() * scale, offset.getZ() * scale)
    .rotateAroundZ(Math.toRadians(roll))
    .rotateAroundX(Math.toRadians(pitch))
    .rotateAroundY(Math.toRadians(-facingYaw));
Location componentPosition = menuOrigin.clone().add(worldOffset);
```

The effective scale is `[menus] uiScale` for a personal session, and the panel's own scale multiplied by
`uiScale` for a panel view. A positive `offset[0]` therefore puts the component to the viewing side's
right. Personal sessions have zero pitch and roll; panels can use all three rotations. The resulting
location carries the display yaw (`facingYaw + 180`) and the transform pitch, and the click plane also
carries the roll.

The menu-level `offset` is mirrored on X the same way but is **not** scaled. Only component offsets, icon
geometry and hitbox geometry scale.

### Duplicate ids

Duplicate `id` values do not reject the file. When the session is constructed the components go into an
insertion-ordered map with a first-wins insert, so the first component with a given id is kept and every
later one is dropped with

```
Menu "<menuId>" declares duplicate component id "<componentId>"; keeping the first component.
```

A dropped duplicate does not render, does not tick and cannot be clicked.

### The `data` discriminator

`data` is decoded on its `type` string. The adapter removes `type` from the object before handing the
remainder to the concrete body, so `type` never collides with a payload key, and re-inserts it on
serialisation. Matching is exact and case sensitive.

| Failure | Message |
|---|---|
| No `type` key | `Missing type` |
| `type` is not a string | `Type must be a string` |
| Unrecognised `type` | `Unknown type: <value>` |

Any of the three aborts the whole file, which is then skipped with a logged stack trace.

| `type` | Java record | Clickable |
|---|---|---|
| `button` | `ButtonComponentData` | yes |
| `decoration` | `DecoComponentData` | no |
| `toggle` | `ToggleComponentData` | yes |

The JSON spelling is `decoration`; the enum constant is `DECO`.

The same mechanism runs at two further levels nested inside `data`: the icon `type`, on `data.icon` for
buttons and decorations and on `data.trueIcon` and `data.falseIcon` for toggles, and the action `type`, on
each entry of `data.actions`, `data.trueActions` and `data.falseActions`.

## Button

```json
{
  "id": "confirm",
  "offset": [0.5, 0.0, 0.0],
  "data": {
    "type": "button",
    "highlightModifier": 0.05,
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
| `icon` | icon object | yes in the schema | `null` |
| `actions` | array of action objects | yes in the schema | `null` |
| `hitbox` | hitbox object | no | `null`, meaning a fully automatic hitbox |

The `Required` column reflects `schema/gloss.schema.json`, which is advisory. The Gson records enforce
nothing, so a button decoded with no `hitbox` simply has a null hitbox.

`actions` are resolved when the document is parsed and again when the component is built. An action whose
payload is unusable — an empty command, an unresolvable sound, a teleport with no destination, a connect
with no server name, a navigate with no target — is dropped with a one-time warning naming the menu and
component; the rest of the list still runs. A null or absent `actions` list yields an empty list and the
button does nothing when clicked.

`icon` is resolved through the icon factory. A failure logs the exception and falls back to the built-in
"missing" icon — an eight-row black and magenta checkerboard — rather than dropping the component.

### Click behaviour

A click scans the resolved actions in list order and executes only those whose `trigger` is `any`, which
is the default, or exactly the interaction that occurred. There is no per-component cooldown, debounce or
re-entrancy guard. A `navigate` action stops the remainder of the chain.

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

A decoration is not clickable. It has no collision plane, is never ray-tested, never enters the selected
state, has no highlight, is skipped when the click candidate list is built, and accepts neither
`highlightModifier` nor `hitbox`. Its open, tick and close hooks are no-ops.

It still ticks its icon, so animated images advance and text placeholders refresh, and it still accepts API
icon replacement.

## Toggle

```json
{
  "id": "flight",
  "offset": [-0.5, 0.0, 0.0],
  "data": {
    "type": "toggle",
    "highlightModifier": 0.05,
    "condition": "%player_gamemode%",
    "expectedValue": "CREATIVE",
    "trueIcon": { "type": "text", "text": "&aOn" },
    "falseIcon": { "type": "text", "text": "&cOff" },
    "trueActions": [{ "type": "command", "command": "gamemode creative", "source": "server" }],
    "falseActions": [{ "type": "command", "command": "gamemode survival", "source": "server" }]
  }
}
```

| Key | Type | Required | Default when absent |
|---|---|---|---|
| `highlightModifier` | number | no | `0.0` |
| `condition` | string | yes in the schema | `null` |
| `expectedValue` | string | yes in the schema | `null` |
| `trueActions` | array of action objects | yes in the schema | `null` |
| `falseActions` | array of action objects | yes in the schema | `null` |
| `trueIcon` | icon object | yes in the schema | `null` |
| `falseIcon` | icon object | yes in the schema | `null` |

`ToggleComponentData` has no `hitbox` field and the schema's toggle definition does not declare one. The
component passes `null` as its hitbox unconditionally, so a toggle's click plane is always icon-derived and
always centred on the icon. Toggles cannot carry a custom hitbox.

### State

State is a single transient boolean on the component instance. It is per player and per session: the
component is built when the session is built and discarded when the session closes. It is not persisted
anywhere — no PDC, no file, no database — and it is never written back to the placeholder named in
`condition`. Reopening the menu re-evaluates the initial state from scratch.

The initial state is evaluated once, in the constructor:

```java
state = Placeholders.setPlaceholders(session.getPlayer(), condition).equalsIgnoreCase(expected);
```

`condition` is expanded through PlaceholderAPI against the viewing player and compared case-insensitively
to `expectedValue`. It is never re-evaluated on tick, so an external change to the underlying placeholder
does not update an open toggle.

> Omitting `condition` throws while the session is being constructed and aborts the whole open, because
> there is nothing to compare. Omitting only `expectedValue` is survivable: the comparison returns false
> and the toggle starts in the false state.
{.is-warning}

### Click behaviour

```java
if (state) { falseActions...; swapIcon(falseIcon); state = false; }
else       { trueActions...;  swapIcon(trueIcon);  state = true; }
```

`trueActions` and `trueIcon` belong to the state being **entered**, not the state being left. Clicking a
toggle that is currently false runs `trueActions` and shows `trueIcon`.

Both icons are constructed eagerly in the constructor and both are teleported whenever the component moves,
so the inactive one stays positionally in sync without being spawned. The icon swap removes the current
icon's display entities, teleports the replacement, rebuilds the collision plane from the new icon's
bounding box, and spawns the replacement.

Like buttons, toggles have no cooldown. Reaching a matching `navigate` action returns before the icon and
state change, so the toggle does not flip; navigation bound to a different trigger is skipped and does not
block the transition.

## The hitbox system

Every clickable component owns a `CollisionPlane`: a rectangle with a centre, a width, a height and a
basis of up, right and normal vectors. Hover selection and click targeting are both ray tests against that
rectangle. The plane is derived from the icon's bounding box unless a `hitbox` object overrides it.

### `hitbox` keys

`hitbox` is accepted on `button` only. The schema constrains it with `minProperties: 1`,
`additionalProperties: false`, and a mutual `dependentRequired` binding between `width` and `height`.

| Key | Type | Required | Default when absent |
|---|---|---|---|
| `width` | number | no; required if `height` is present | `null`, meaning automatic sizing from the icon |
| `height` | number | no; required if `width` is present | `null`, meaning automatic sizing from the icon |
| `offset` | `vector3` | no | `null`, treated as `[0, 0, 0]` |
| `anchor` | `"button"` or `"menu"` | no | `null`, treated as `button` |

`width` and `height` are blocks at scale 1 and are multiplied by the live effective scale when the plane is
built. `offset` is likewise a pre-scale value and goes through the same local-vector transform as
everything else.

Validation runs in the record's compact constructor and throws during deserialisation, which aborts the
file:

| Condition | Message |
|---|---|
| Exactly one of `width` / `height` supplied | `Button hitbox width and height must be supplied together.` |
| `width` non-finite or `<= 0` | `Button hitbox width must be finite and greater than zero.` |
| `height` non-finite or `<= 0` | `Button hitbox height must be finite and greater than zero.` |
| Any component of `offset` non-finite | `Button hitbox offset must contain only finite values.` |

A hitbox object carrying only `offset` and/or `anchor` keeps the automatic icon-derived dimensions while
relocating the plane. Round-tripping is symmetric: `offset` serialises back to a three-element array and
`anchor` back to its lowercase form.

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
| `button` | The centre of the collision plane the icon produced at this component's location. Moves with the component |
| `menu` | The menu origin resolved through the session's current anchor, facing and offset. Independent of where the icon is drawn |

A button-anchored plane translates when the button origin moves; a menu-anchored plane's centre does not.
With `anchor: "menu"` and no `offset` the plane sits exactly on the menu centre no matter where the icon
is, which fully decouples the clickable region from the visible element.

### Offset axis convention

```java
new Vector(-offset.x * scale, offset.y * scale, offset.z * scale)
    .rotateAroundZ(Math.toRadians(roll))
    .rotateAroundX(Math.toRadians(pitch))
    .rotateAroundY(Math.toRadians(-facingYaw))
```

The axes are menu-relative: `+x` moves the plane to the viewing side's right, `+y` up and `+z` away from
that side. The plane basis receives the same roll, pitch and negated facing yaw, so a fixed icon and its
plane stay aligned. A following personal menu updates its yaw on turns; a followed panel resolves its
configured rotation mode.

Worked example: offset `[0.5, -0.25, 0.75]` at scale 2, with the basis `right = (1,0,0)`, `up = (0,1,0)`,
`normal = (0,0,-1)`, yields the translation `(-1, -0.5, 1.5)`. When the basis rotates, the translation
rotates with it.

### Automatic sizing

When `hitbox` is absent, or present without `width`, the plane's dimensions and centre come entirely from
the icon's bounding box. With `S` the effective scale, `X = style.scaleX`, `Y = style.scaleY` and
`NAMETAG_SIZE = 3.5 / 16 = 0.21875`, so that `lineWidth = NAMETAG_SIZE * S * X` and
`lineHeight = NAMETAG_SIZE * S * Y`:

| Icon type | Plane width | Plane height | Plane centre |
|---|---|---|---|
| `text` | `max over lines of (plainTextLength * lineWidth / 2)` | `lineCount * lineHeight` | `location - (0, 0.325 * S * Y, 0)` |
| `textImage` | same formula, over the rendered rows | `rowCount * lineHeight` | same as `text` |
| `animatedTextImage` | same formula, over the first frame | `firstFrameRowCount * lineHeight` | same as `text` |
| `item`, `customItem`, `itemStack` | `0.75 * S * X` | `0.75 * S * Y` | `location - (0, 0.05 * S, 0)` |
| `block` | `0.75 * S * X` | `0.75 * S * Y` | `location - (0, 0.05 * S, 0)` |
| `entity` | `width * S` | `height * S` | `location + (0, (height / 2) * S, 0)` |

The `0.325` in the text centre is `(2 * NAMETAG_SIZE) - (4.5 / 40)`, the correction that puts the plane
over the rendered text rather than over its anchor.

For image icons the line length is the rendered row width in characters, so the plane width tracks image
width. A one-row image is one line tall, not zero. Entity icons have no display style, so their planes use
the declared `width` and `height` — both defaulting to `1`, both bounded to `(0, 64]` — and are not
multiplied by any style scale.

Automatic dimensions multiply by the icon's `style.scaleX` and `style.scaleY`. **An explicitly sized
hitbox does not**: `width` and `height` are authored plane dimensions and only the effective scale applies
to them.

### When the plane is rebuilt

The plane is rebuilt on open, on every icon change including toggle swaps and API icon updates, whenever
the session transform changes through follow, manual movement or a scale refresh, and whenever a dynamic
icon reports that its geometry changed — a text icon whose refreshed placeholder produced different text,
for instance. Each rebuild reads the current icon, records the fresh bounding-box centre as the button
origin, applies the configured size when one is present, repositions the plane if a `hitbox` object exists,
re-orients it for the viewer, and re-applies the highlight displacement if the component is currently
selected.

Repositioning is a no-op when `hitbox` is null, which is why an unconfigured button and every toggle keep a
plane centred exactly on the icon bounding box.

### Billboard-aware orientation

Before every hover test, and again at the event-time click test, the plane is re-oriented to match how the
icon actually faces the viewer. The behaviour follows the icon's `style.billboard`, which defaults to
`fixed`:

| Billboard | Plane behaviour |
|---|---|
| `fixed` | Keeps the transform basis. Roll, pitch and facing yaw apply; the plane does not track the viewer |
| `vertical` | Turns around world Y to face the viewer, keeping world up |
| `horizontal` | Keeps the current right axis and pitches toward the viewer |
| `center` | Faces the viewer on both axes |

Degenerate cases are ignored rather than producing a broken basis: a viewer standing exactly at the plane
centre, a `vertical` plane whose horizontal offset is zero, and a `center` plane looked at from directly
above or below all leave the previous basis in place.

Because the plane is re-oriented against the event-time eye, a moving viewer never clicks against a stale
billboard plane.

### The ray test

```java
Vector offset = center - origin;
double proj = normal.dot(direction);
if (abs(proj) < 1.0E-9) return empty;
double distance = normal.dot(offset) / proj;
if (distance < 0.0) return empty;
Vector intersect = origin + direction * distance - center;
return abs(right.dot(intersect)) < width / 2 && abs(up.dot(intersect)) < height / 2
    ? distance : empty;
```

Behaviour that follows from this:

- Callers pass the player's eye position and a unit direction vector, so `distance` is in blocks.
- The parallel-ray epsilon is `1.0E-9`. The rectangle bound check has no tolerance and uses a strict `<`
  against the exact half-extents, so the outermost edge is not clickable.
- The test is not distance limited. Any non-negative distance qualifies, so a component stays hover- and
  click-selectable at arbitrary range. The menu's `maxDistance` is a separate movement rule, and the
  event-time obstruction check is what actually bounds a click.
- The test is two-sided. Nothing rejects a hit on the back face; only a strictly negative distance, meaning
  the plane is behind the eye, is rejected.
- The plane test itself does not inspect occlusion. Occlusion is handled once, at dispatch.

## Hover highlighting

Highlighting runs once per tick per open clickable component:

1. The plane is re-oriented for the live eye position, following the icon's billboard.
2. The ray test decides whether the component is selected.
3. On the transition from not selected to selected, the icon is displaced by
   `plane.normal * highlightModifier`. A positive value moves it toward the plane's current viewing side.
4. On the transition from selected to not selected, the icon is teleported back to the component location.

`highlightModifier` is the entire hover feedback. There is no colour change, no scale change and no sound.
The default of `0.0` means a button that is otherwise fully functional gives no visual response at all;
`0.05` is a reasonable nudge and is what the shipped blank baseline uses. The selected flag is cleared on
close.

Selection is tick-driven presentation state only. It is not a prerequisite for a click, and a click does
not consult it.

## Click routing

### Which inputs reach components

The dispatcher listens on `PlayerInteractEvent` at `EventPriority.HIGHEST` and ignores an event an earlier
listener already cancelled.

| Main-hand input | Bukkit `Action` | Trigger |
|---|---|---|
| Left click, not sneaking | `LEFT_CLICK_AIR`, `LEFT_CLICK_BLOCK` | `left_click` |
| Right click, not sneaking | `RIGHT_CLICK_AIR`, `RIGHT_CLICK_BLOCK` | `right_click` |
| Left click, sneaking | `LEFT_CLICK_AIR`, `LEFT_CLICK_BLOCK` | `shift_left_click` |
| Right click, sneaking | `RIGHT_CLICK_AIR`, `RIGHT_CLICK_BLOCK` | `shift_right_click` |

Off-hand events and `PHYSICAL` are ignored. `any` is an action binding, not a physical interaction: it is
never delivered as the trigger of a click.

### Nearest-hit arbitration

The handler recomputes every open personal-menu plane against the event-time eye position and direction and
keeps the smallest positive intersection distance. Independently it asks the panel runtime for the nearest
clickable panel component the player can reach. If neither surface produced a hit, the event passes through
untouched.

- Click targeting is independent of the previous hover tick.
- Only the smallest distance fires. Within one menu an exact tie keeps the first declared component,
  because the comparison is a strict `<`.
- Panel candidates are limited by each panel's interaction range and visibility. The nearest panel
  candidate is compared against the personal candidate, and an exact tie goes to the personal menu.
- Decorations and closed clickables produce no intersection at all.

### Obstruction

Before anything is dispatched, a block ray trace runs from the eye out to the winning distance. If it finds
a block closer than that, the click is abandoned and the event is left alone, so the player's normal block
interaction happens instead. Passable blocks and fluids do not obstruct. Entities never obstruct.

On Folia the ray trace is replaced by a stepped march in 0.1-block increments that stops at the first
non-passable block, and also treats a sample outside the current region as obstructed rather than reaching
across a region boundary.

An unobstructed hit cancels the event before the API event and any actions run, so the same input does not
also perform its vanilla block interaction.

### Winning-component dispatch

The one winning component receives the exact trigger:

1. A cancellable click event is fired for the plugin API. Cancelling it skips both the component's JSON
   actions and any API handler.
2. The component's own click handling runs the matching JSON actions inside a try/catch. A thrown exception
   is logged with the component, menu and player.
3. For a menu opened through the plugin API, if the handle is still live and has a click handler registered
   for that component id, the handler runs behind the API click guard.

The guard applies only to third-party API handlers, never to JSON actions. It skips owners that are
quarantined or inactive, quarantines an owner after 5 thrown handler calls — their menus stay open but stop
receiving clicks — and logs at most one slow-handler warning per owner per minute when a handler exceeds
5 ms.

No stage of this path imposes a click cooldown or rate limit on JSON-defined components.

## Debug overlays

Two `config.toml` switches draw particle overlays. Both default to `false`, both are applied live when
`config.toml` is edited or `/gloss reload` runs, and both drive their own repeating task at 2 ticks.

| Key | What it draws |
|---|---|
| `[debug] hitbox` | For every clickable component of every open session: the four edges and four corners of its collision plane in blue, plus a red segment from the plane centre out along the normal for two blocks |
| `[debug] position` | For every open session: the menu centre in yellow, and each component's resolved location in orange |

Edges are drawn as interpolated points at ten steps along each side. Every point is five redstone dust
particles at size 1.

Both overlays cover **personal menu sessions only**. Panel views are not drawn.

The particles are spawned into the world, not sent to one player, so everyone nearby sees them. Leave both
switches off on a production server.

There is no hover outline in normal operation. Without `[debug] hitbox` the only feedback that a component
is selected is its `highlightModifier` displacement.

## Runtime notes

- Duplicate component ids do not reject the file. The first wins and later ones are dropped with a warning.
- A toggle's state is never written back to the placeholder in `condition`, and the condition is never
  re-evaluated while the menu is open.
- Menu-level `offset` is not scaled; component offsets, icon geometry and hitbox geometry are.
- Automatic hitboxes multiply by the icon's `style.scaleX` and `style.scaleY`; an explicitly sized hitbox
  does not.
- Hitbox planes are two-sided and the hover ray is unoccluded and unbounded in range. Only the event-time
  click checks for a closer block.
- `anchor: "menu"` fully decouples the click plane from the drawn icon, which produces a clickable region
  with nothing visible under it. That is occasionally useful and very easy to do by accident.
