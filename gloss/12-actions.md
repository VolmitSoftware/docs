---
title: "Actions"
description: "Run commands, sounds, messages, teleports, proxy transfers, and menu navigation"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Buttons and toggles run actions in the order written. Menus and panels support commands, sounds, messages, teleports, proxy transfers and page navigation.

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

A missing or unknown `type` rejects the menu file. Unknown extra keys inside a valid action are ignored. A missing action list is empty, and one action object can be used where a list is expected.

## The click trigger

`trigger` is shared by all six types. Omission and an explicit `null` both resolve to `any`.

| JSON value | Matches |
|---|---|
| `any` | Every accepted main-hand interaction |
| `left_click` | Left click while not sneaking |
| `right_click` | Right click while not sneaking |
| `shift_left_click` | Left click while sneaking |
| `shift_right_click` | Right click while sneaking |

Values are exact and case-sensitive, and the four physical values are mutually exclusive: a shift-left-click does **not** match a `left_click` binding. Off-hand interactions are ignored.

## `command`

```json
{ "type": "command", "source": "player", "command": "/spawn", "trigger": "right_click" }
```

| Key | Required | Default | Meaning |
|---|---|---|---|
| `command` | yes | none | The command line. One leading slash is optional; `%player%` and `%player_name%` become the clicking player's name |
| `source` | no | `player` | `player` or `server` |

`player` runs the command as the clicker, with their own permissions, exactly as if they had typed it. `server` dispatches it from the console, with full console authority and no permission check, and can finish after later actions. A blank command is logged and dropped. Other PlaceholderAPI tokens are not expanded.

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

`message` is required and must contain non-whitespace text. On click, `%player%` becomes the clicking player's name, PlaceholderAPI expands any installed tokens, legacy `&` and `§` codes are rewritten as MiniMessage tags, and the result is parsed and sent to that player alone. Click and insertion events are stripped; formatting, gradients, decorations and hover text remain.

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

An omitted `mode` defaults to `push`. A `push` or `replace` with no non-blank `target` is warned once and dropped. Targets are exact, case-sensitive menu ids, including folder paths such as `shops/confirm`.

History is per viewer: a stack of menu ids plus the root, which is the first page opened in the flow. `close` ends a personal session, or dismisses that panel view for the viewer.

`back` with an empty history and `home` with no recorded root both do nothing and report no history. A `back` or `home` whose recorded id no longer names a loaded menu leaves the current page up and sends the "menu unavailable" message — that is what you see after a menu file is renamed mid-flow.

### Permissions and gates

`push` and `replace` require the viewer to hold `gloss.open.<target>` on top of whatever let them open the flow. A denial sends the permission message and leaves the current page up, as does a cancelled API open event.

Panels make one exception: navigating to the panel's own **root** menu skips the `gloss.open.<menuId>` check, since a viewer who can see the panel is already looking at that menu. Every other target on a panel is checked normally. See [Panels](/gloss/16-panels).

With `[features] menus = false`, every navigation mode except `close` is denied.

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
