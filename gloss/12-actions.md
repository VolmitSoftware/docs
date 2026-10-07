---
title: "Actions"
description: "Author menu actions, input flows, screen notices, item transactions, state, and world effects"
published: true
date: 2026-10-07T21:45:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Buttons and toggles run actions in the order written. Menus and panels can open input flows, update session values, give items, display notices, and run conditional or timed action lists.

## The action model

Every action is a JSON object with a required `type` discriminator and an optional `trigger`. Actions live in a button's `actions` list or a toggle's `trueActions` and `falseActions`. A decoration has none.

| `type` | Effect |
|---|---|
| `command` | Runs a command as the clicking player or as the console |
| `sound` | Plays a sound to the clicking player |
| `message` | Sends sanitized MiniMessage to the clicking player |
| `teleport` | Teleports the clicking player through the async path |
| `connect` | Requests a BungeeCord-compatible proxy transfer |
| `navigate` | Changes that viewer's menu page stack |
| `prompt` | Requests sign, anvil, or chat input and runs continuation actions |
| `dialog` | Opens a native Java dialog with validated inputs and button actions |
| `call` | Runs a named action list declared by the menu or inventory |
| `title`, `actionbar`, `bossbar`, `surface` | Displays a screen notice or submits an authored surface |
| `close`, `inventory`, `book` | Closes the flow or opens another client interface |
| `setSession` | Writes a value used by the current menu session |
| `give`, `take`, `economy` | Gives or removes items, or uses a Vault economy provider |
| `delay`, `sequence`, `parallel`, `repeat` | Schedules or repeats nested actions |
| `if`, `switch`, `chance`, `cooldown` | Selects a nested action branch |
| `broadcast`, `effect`, `particle` | Sends messages or applies a visible world effect |
| `stop` | Ends the current action program |
| `setState`, `addState`, `clearState` | Updates a declared persistent state key |
| `sky`, `glow` | Changes the viewer's sky or an entity outline |

A missing or unknown `type` rejects the menu file. Unknown extra keys inside a valid action are ignored. A missing action list is empty, and one action object can be used where a list is expected.

## The click trigger

`trigger` is shared by action types. Omission and an explicit `null` both resolve to `any`.

| JSON value | Matches |
|---|---|
| `any` | Every accepted main-hand interaction |
| `left_click` | Left click while not sneaking |
| `right_click` | Right click while not sneaking |
| `shift_left_click` | Left click while sneaking |
| `shift_right_click` | Right click while sneaking |

Values are exact and case-sensitive, and the four physical values are mutually exclusive: a shift-left-click does **not** match a `left_click` binding. Off-hand interactions are ignored.

Actions also accept `when`, a boolean condition evaluated for the click context, and `cooldownTicks`, a nonnegative delay before the same action may run again for that viewer. An unmet condition or active cooldown skips the action. For `if`, `when` chooses its `then` or `else` branch instead of skipping the action.

## Named actions

Menus and inventories can declare an `actions` object at the document root. Each key names an ordinary action array. Use `call` from a button, toggle, list template, variant, or nested action to run it in the same viewer, arguments, list-entry, and session scope. Conditions, triggers, delays, and terminal actions retain their usual behavior.

```json
{
  "actions": {
    "saved": [
      {"type": "message", "message": "<green>Saved.</green>"},
      {"type": "sound", "sound": "ui.button.click"}
    ]
  }
}
```

Place `{"type":"call","action":"saved","when":"true","cooldownTicks":20}` in an action list. Names use 1–64 letters, digits, underscores, or hyphens. A document supports up to 256 named lists and 32 nested calls. Missing names, cycles, and expansion above 100,000 JSON nodes reject the document. Calls remain named references when saved; common lists can also come from a document preset. Other document kinds do not accept `call`.

## `dialog`

Native dialogs require both the Java client and server to support Minecraft 1.21.6 or newer. A dialog ends its originating action chain; put follow-up work in its buttons. `unsupported` runs when a native dialog cannot open. Native dialogs use Minecraft's fixed layout and controls. They do not provide arbitrary custom screens, and the client controls the server-dialog warning and screen styling. See the [Minecraft dialog specification](https://www.minecraft.net/en-us/article/minecraft-java-edition-1-21-6).

```json
{
  "type": "dialog",
  "kind": "confirmation",
  "title": "Choose a label",
  "body": [{"text": "Enter the label to save.", "width": 240}],
  "inputs": [{"key": "label", "type": "text", "label": "Label", "maxLength": 32}],
  "buttons": [
    {"label": "Save", "actions": [{"type": "setSession", "var": "label", "value": "input.label"}]},
    {"label": "Cancel", "actions": []}
  ],
  "timeoutTicks": 1200,
  "unsupported": [{"type": "prompt", "kind": "chat", "var": "label", "label": "Enter a label"}]
}
```

| Field | Meaning |
|---|---|
| `title` | Rendered dialog title |
| `kind` | `notice` has one button; `confirmation` has two; `multi_action` has 1–64 |
| `body` | Up to 64 text objects with `text` and `width` (1–1024, default 200) |
| `inputs` | Up to 64 native controls, described below |
| `buttons` | Objects with `label`, optional `tooltip`, `width` (1–1024, default 150), and `actions`; omission creates an OK button |
| `exitButton` | Optional button for `multi_action` only |
| `columns` | `multi_action` button columns, 1–64, default 2 |
| `escape` | Allows Escape to close, default true; a notice runs its only button, confirmation runs its second button, and multi-action uses its exit button when present |
| `timeoutTicks` | Lifetime from opening, 1–72,000 ticks, default 1,200 |
| `onTimeout` | Actions when the current unanswered dialog expires |
| `unsupported` | Actions when native dialogs cannot open |

Each input requires a unique `key` of 1–64 letters, digits, or underscores. Submitted values are available as `input.<key>` throughout button actions, including delayed actions. Every response is checked against the declared keys, types, choices, length, and numeric range before actions run.

| Input `type` | Fields and submitted value |
|---|---|
| `text` | `label`, `width` (default 200), `labelVisible` (default true), string `initial`, `maxLength` (1–4096, default 32); returns a string. `maxLines` (1–4096) or `height` (1–512) enables multiline input |
| `boolean` | `label`, boolean `initial` (default false); returns a boolean |
| `single_option` | `label`, `width`, `labelVisible`, 1–64 `options` with unique `id` (1–256 characters) and optional `label`; string `initial` names an option. Returns the selected id |
| `number_range` | `label`, `width`, distinct finite `start` and `end`, optional numeric `initial` within the range, optional positive `step`, and `labelFormat` (default `options.generic_value`); returns a number. Steps are relative to the initial value, which defaults to the range midpoint |

Input widths are 1–1024. The combined input length budget is 16,000 characters: text contributes its `maxLength`, other controls contribute 256 each. Dialogs close after a button is selected, and each response runs at most once. Opening another form replaces the previous form. A replaced dialog, foreign dialog, world reset, disconnect, or service reload invalidates its response. Timed-out dialogs close only while Gloss still owns that screen. Actions from a replaced menu or inventory session do not mutate the new session.

## `prompt`

<div class="gloss-demo" data-demo="prompt-chat-pov">
<p><strong>Chat input and continuation</strong> Minecraft client. Silent capture.</p>
<video src="/gloss-assets/demos/prompt-chat-pov.webm" aria-label="Chat input and continuation, first person" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

<div class="gloss-demo" data-demo="prompt-anvil-pov">
<p><strong>Anvil input and continuation</strong> Minecraft client. Silent capture.</p>
<video src="/gloss-assets/demos/prompt-anvil-pov.webm" aria-label="Anvil input and continuation, first person" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

<div class="gloss-demo" data-demo="prompt-sign-pov">
<p><strong>Sign input and continuation</strong> Minecraft client. Silent capture.</p>
<video src="/gloss-assets/demos/prompt-sign-pov.webm" aria-label="Sign input and continuation, first person" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

A `prompt` action accepts `kind` (`sign`, `anvil`, or `chat`), `label`, `initial`, `var`, `then`,
and `timeoutTicks`. The label describes the requested input; the initial value seeds the sign or
anvil editor, or appears as a clickable chat suggestion. A sign uses the first four newline-separated
initial lines and closes without an answer when the player changes worlds or respawns. The next prompt can open immediately. The anvil uses the label as its window title.

The answer is written to `var` when set and is available as `input.value` to the `then` actions.
Provide a variable or at least one continuation action. The prompt ends the current action chain;
use `then` for work that depends on the answer.

## `command`

```json
{ "type": "command", "source": "player", "command": "/spawn", "trigger": "right_click" }
```

| Key | Required | Default | Meaning |
|---|---|---|---|
| `command` | yes | none | The command line. One leading slash is optional; `%player%` and `%player_name%` become the clicking player's name |
| `source` | no | `player` | `player` or `server` |

`player` runs the command as the clicker, with their own permissions, exactly as if they had typed it. `server` dispatches it from the console, with full console authority and no permission check, and can finish after later actions. Expressions such as `{{ session.quantity }}` resolve against the clicking session, including a list entry variable inside a repeated component. A blank command is logged and dropped. Other PlaceholderAPI tokens are not expanded. Console commands containing `;`, a newline, a carriage return, or `/` after substitution are refused.

> A `server` command is console authority handed to whoever can click the button. Gate the button with a `gloss.open.<menuId>` permission, or put the privileged step behind a command that does its own checks.
{.is-warning}

## `sound`

```json
{
  "type": "sound",
  "sound": "ui.button.click",
  "source": "master",
  "volume": 1,
  "pitch": 1
}
```

| Key | Required | Default | Meaning |
|---|---|---|---|
| `sound` | yes | none | Bukkit sound registry key |
| `source` | no | `master` | `master`, `music`, `record`, `weather`, `block`, `hostile`, `neutral`, `player`, `ambient`, `voice` |
| `volume` | no | `1` | Volume and audible-distance multiplier |
| `pitch` | no | `1` | Playback pitch |

Playback is positioned at the clicking player and heard only by them. A volume of `0` is silent and values above `1` extend the audible distance; neither volume nor pitch is range-checked. An unknown sound key is logged and the action dropped.

## `message`

```json
{
  "type": "message",
  "message": "<gold>Hello <white>%player%</white></gold>"
}
```

`message` is required and must contain non-whitespace text. On click, `%player%` becomes the clicking player's name and `{{ ... }}` expressions can read the session and the current list entry. PlaceholderAPI expands installed tokens, legacy `&` and `§` codes are rewritten as MiniMessage tags, and the result is parsed and sent to that player alone. Click and insertion events are stripped; formatting, gradients, decorations and hover text remain.

## `teleport`

```json
{
  "type": "teleport",
  "world": "minecraft:overworld",
  "x": 12.5,
  "y": 70,
  "z": -8,
  "yaw": 90,
  "pitch": 0
}
```

| Key | Required | Validation |
|---|---|---|
| `world` | yes | Explicit lowercase `namespace:key`, at most 255 characters. There is no default namespace here |
| `x`, `y`, `z` | yes | Finite JSON numbers |
| `yaw`, `pitch` | yes | Finite JSON numbers, in degrees |

All six destination fields are required; if any is missing or non-finite the action is warned once and dropped, and the rest of the list is kept. The world must already be loaded — Gloss never creates a world, loads a chunk, or falls back to the player's current world. Later actions can run before the teleport finishes, and menu teleport and distance rules still apply at the destination.

## `connect`

```json
{ "type": "connect", "server": "lobby-1" }
```

`server` is the exact logical server name configured on a BungeeCord-compatible proxy. It must be 1 to 64 characters, start with a letter or digit, and otherwise contain only letters, digits, `.`, `_` and `-`; anything else is warned once and dropped. Authors cannot supply a host, port, URL or custom payload. Without a compatible proxy the request does nothing and the player stays put.

## `navigate`

```json
{ "type": "navigate", "mode": "push", "target": "shops/confirm" }
```

| Mode | `target` | Effect |
|---|---|---|
| `push` | required | Opens the target and pushes the current page onto history |
| `replace` | required | Opens the target without adding the current page to history |
| `back` | ignored | Opens the newest history entry and pops it |
| `home` | ignored | Opens the flow root and clears history |
| `close` | ignored | Closes the current flow |
| `page` | `next`, `prev`, or a zero-based page number | Changes a paged inventory list |

An omitted `mode` defaults to `push`. A `push` or `replace` with no non-blank `target` is warned once and dropped. Targets are exact, case-sensitive menu ids, including folder paths such as `shops/confirm`.

In [Inventory Menus](/gloss/09b-inventory-menus), navigation opens another inventory document and `page` changes the current list page. Inventory navigation has a separate history from in-world menus.

History is per viewer: a stack of menu ids plus the root, which is the first page opened in the flow. `close` ends a personal session, or dismisses that panel view for the viewer.

`back` with an empty history and `home` with no recorded root both do nothing and report no history. A `back` or `home` whose recorded id no longer names a loaded menu leaves the current page up and sends the "menu unavailable" message — that is what you see after a menu file is renamed mid-flow.

### Permissions and gates

`push` and `replace` require the viewer to hold `gloss.open.<target>` on top of whatever let them open the flow. A denial sends the permission message and leaves the current page up, as does a cancelled API open event.

Panels make one exception: navigating to the panel's own **root** menu skips the `gloss.open.<menuId>` check, since a viewer who can see the panel is already looking at that menu. Every other target on a panel is checked normally. See [Panels](/gloss/16-panels).

With `[features] menus = false`, every navigation mode except `close` is denied.

## Session and client interfaces

<div class="gloss-demo" data-demo="book-reading-pov">
<p><strong>Written book action</strong> Minecraft client. Silent capture.</p>
<video src="/gloss-assets/demos/book-reading-pov.webm" aria-label="Written book action, first person" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

`setSession` accepts a `var` name and a string `value` expression. Other components read the result as `session.<name>`. `close` ends the current flow. `inventory` accepts an inventory document `id` and optional `args` object:

```json
[
  { "type": "setSession", "var": "quantity", "value": "2" },
  { "type": "inventory", "id": "shop", "args": { "category": "tools" } }
]
```

`book` accepts `title`, `author`, and `pages`, an array of up to 100 text pages of 1,024 characters each. Its default title is `Book` and author is `Server`; opening it leaves the menu session in place.

## Camera rides

`camera` follows a spline in the viewer's current world. Each `path` node supplies `x`, `y`, and `z`, with optional `yaw`, `pitch`, and `durationTicks` (default `20`). `skippable` defaults to `true`; sneaking ends a skippable ride. `letterbox` requests the configured title provider's bars and defaults to `false`. `[camera] maxRideSeconds` limits the path duration.

```json
{
  "type": "camera",
  "path": [
    { "x": 0, "y": 80, "z": 0, "yaw": 0, "pitch": 10, "durationTicks": 80 },
    { "x": 0, "y": 80, "z": 20, "yaw": 90, "pitch": 10, "durationTicks": 0 }
  ],
  "skippable": true,
  "letterbox": false
}
```

The viewer enters spectator mode while following the camera carrier. Ending the ride returns them to their saved position, game mode, flight settings, and velocity. A transfer already in progress finishes before restoration begins. A player cannot begin another ride while a previous ride still needs restoration.

Recovery state is saved before the ride begins and retained until the return teleport and player-state restoration succeed. If the player disconnects or restoration cannot complete during shutdown, recovery is retried on their next join or respawn. The saved world must be available for that return. A camera action ends its click action list; inside a timed sequence, later cues still run.

## Screen notices

```json
[
  { "type": "title", "title": "<gold>Welcome", "subtitle": "Choose a destination", "fadeInTicks": 10, "stayTicks": 40, "fadeOutTicks": 10 },
  { "type": "actionbar", "text": "Destination selected", "ticks": 60, "slots": ["center"] },
  { "type": "bossbar", "id": "journey", "title": "Preparing departure", "progress": "0.75", "color": "blue", "style": "solid", "ticks": 100 }
]
```

`{"type":"surface","surface":"notice","audience":{"scope":"server","when":"viewer.op"}}` submits an authored `surfaces/notice.json` through its configured delivery policy. Audience scope defaults to `viewer`; `server`, `world`, and `radius` select recipients, with a positive `radius` of at most 4096 blocks required for radius scope. The audience condition evaluates per recipient. See [event and scheduled announcements](/gloss/06c-screen-surfaces#event-and-scheduled-announcements) for queues, cooldowns, expiration, and behavior schedules.

These notices accept a surface `priority`, defaulting to `notice`. Action-bar slots are `left`, `center`, and `right`. Boss-bar `progress` is a numeric string from `0` to `1`; `ticks: 0` removes that bar. See [Screen Surfaces](/gloss/06c-screen-surfaces) for priorities, colors, and styles.

## Items and economy

`give` and `take` accept an `item` using the shared [item icon](/gloss/11-icons) shape, and an `amount` expression string, defaulting to `"1"`. `give.dropIfFull` defaults to `true`; `take.denyMessage` supplies the rejection text when the player lacks the items. A failed take stops subsequent actions.

```json
[
  { "type": "take", "item": { "type": "item", "item": "minecraft:emerald" }, "amount": "3", "denyMessage": "You need three emeralds." },
  { "type": "give", "item": { "type": "item", "item": "minecraft:iron_sword" }, "amount": "1", "dropIfFull": true }
]
```

`economy` requires Vault and an installed economy provider. Its `op` is `withdraw` (default), `deposit`, or `has`; `amount` is an expression string. A failed balance check or withdrawal sends the optional `denyMessage` and ends the action list.

## Branches and timing

| Action | Fields |
|---|---|
| `delay` | Positive `ticks` before the remaining actions resume |
| `sequence` | `steps` containing actions with optional `atTicks` cues relative to the start; optional `skippable`, `onSkip`, and player boolean `once` key |
| `parallel` | `branches`, an array of action lists started together |
| `repeat` | `times`, `steps`, optional `everyTicks` and `while` condition |
| `if` | `when` condition, `then` and optional `else` action lists |
| `switch` | `on` expression, `cases` mapping string values to lists, and optional `default` list |
| `chance` | `percent` from `0` to `100`, `then`, and optional `else` |
| `cooldown` | Named `key`, positive `ticks`, `then`, and optional `else` when still cooling down |
| `stop` | No effect fields; ends the running action program |

```json
{
  "type": "if",
  "when": "session.quantity > 0",
  "then": [
    { "type": "message", "message": "Preparing your order" },
    { "type": "delay", "ticks": 20 },
    { "type": "message", "message": "Order ready" }
  ],
  "else": [{ "type": "message", "message": "Choose a quantity first" }]
}
```

Sequence steps without `atTicks` use the previous cue. A skippable sequence ends when its viewer sneaks and runs `onSkip`; `once` records completion for that player. Repeats accept `1`–`100000` iterations; repeats without a tick interval are limited to 1,024 iterations.

## Messages and effects

`broadcast` accepts `message`, a `scope` of `server`, `world`, or `radius`, optional receiver `permission`, and a positive `radius` for radius scope. `effect` accepts an effect registry key, positive `ticks`, an `amplifier` starting at `0`, and `target` (`viewer` or `subject`). In menu clicks both roles refer to the clicker.

```json
[
  { "type": "effect", "effect": "minecraft:speed", "ticks": 100, "amplifier": 0, "target": "viewer" },
  { "type": "particle", "particle": "minecraft:end_rod", "count": 12, "offset": 0.3, "at": "viewer" }
]
```

Particle `count` defaults to `1` and clamps to `1`–`1024`; `offset` defaults to `0`. Its `at` is `viewer`, `subject`, `source`, or `location`.

## Persistent state actions

Declare a key through the [state API](/gloss/21-api-getting-started#persistent-state) before using these actions. `setState` writes a `value` expression, `addState` adds a numeric `value`, and `clearState` restores the declared default. Each takes a `key` and optional `target`, defaulting to `viewer`; the declaration chooses player, world, or global scope.

```json
[
  { "type": "setState", "key": "quest.points", "value": "10" },
  { "type": "addState", "key": "quest.points", "value": "5" },
  { "type": "clearState", "key": "quest.points" }
]
```

## Sky and glow

<div class="gloss-demo" data-demo="sky-transition-pov">
<p><strong>Per-viewer sky transition</strong> Minecraft client. Silent capture.</p>
<video src="/gloss-assets/demos/sky-transition-pov.webm" aria-label="Per-viewer sky transition, first person" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

`sky` changes time, weather, or the world border for the clicker under a required `purpose`. Time is a tick-count string modulo `24000`; weather can be `clear` or `rain`. `fadeTicks` controls the transition, up to `72000` ticks. A `border` object accepts `centerX`, `centerZ`, `size`, and `warningBlocks`.

```json
[
  { "type": "sky", "purpose": "shop-preview", "time": "6000", "weather": "clear", "fadeTicks": 20 },
  { "type": "glow", "target": "viewer", "color": "aqua", "purpose": "shop-preview", "priority": 10, "ticks": 100 }
]
```

Release that sky purpose with `{ "type": "sky", "purpose": "shop-preview", "time": "reset" }`. Sky purposes compose time, weather, and border independently: releasing a time-only purpose preserves another purpose's weather. Updates are queued per viewer and save recovery state before changing the player; release or shutdown clears that state only after restoration succeeds. `[sky]` sets fade cadence and admission limits. Glow accepts `viewer`, `subject`, or an entity UUID as `target`, a named text `color`, and optional `purpose`, `priority`, and `ticks`. A glow lifetime of `0` persists until removed by its owner. Other plugins can create outlines and beams through the [public API](/gloss/21-api-getting-started).

## Execution order

Gloss walks the action list in declaration order, skipping any entry whose trigger is neither `any` nor the exact interaction.

A matching `navigate` **terminates** the list, whether or not the navigation succeeded — a denied permission, a missing menu, a cancelled open event and an empty history all still stop the remaining actions. Because the skip test runs first, a `navigate` bound to an exact trigger only terminates that one click type. A toggle whose chain reaches a `navigate` returns before swapping its icon, so a navigating toggle never changes appearance.

An action failure is logged with the menu, component and player, and stops the remaining actions in that component.

When a menu and a panel overlap, the nearer unobstructed component gets the click. Gloss fires the cancellable API click event before JSON actions, and API menu handlers run after them; a cancelled event runs neither.

## Invalid entries

Invalid action data drops only that action and keeps the rest of the order. Gloss reports these warnings when the menu loads; a malformed `type` rejects the whole file instead.

| Action | Dropped when |
|---|---|
| `command` | The command is missing, blank, or a lone slash |
| `sound` | The sound key is missing, malformed, or absent from the registry |
| `message` | The message is missing or blank |
| `teleport` | The world key is malformed, or any of the six destination numbers is missing or non-finite |
| `connect` | The server name fails the fixed pattern |
| `navigate` | `push` or `replace` has no non-blank target |

An action `type` the runtime does not recognize in memory is warned and skipped the same way.

## Related

- [Hologram Menus](/gloss/09-menus): menu documents and ids
- [Components & Hitboxes](/gloss/10-components-hitboxes): clickable components and targeting
- [Icons](/gloss/11-icons): component visuals
- [Panels](/gloss/16-panels): world-anchored menus
- [Commands & Permissions](/gloss/17-commands-permissions): access nodes
- [Web Editor & Sync](/gloss/18-web-editor): `schema/gloss.schema.json` describes these fields for the editor and is advisory
