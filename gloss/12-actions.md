---
title: "Actions"
description: "Run commands, sounds, messages, teleports, proxy transfers, and menu navigation"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Buttons and toggles run actions in the order written. Menus and panels support commands, sounds, messages, teleports, proxy transfers, and page navigation.

## The action model

Every action is a JSON object with a required `type` discriminator and an optional `trigger`. Actions appear in a button `actions` list or a toggle `trueActions` and `falseActions` lists. A decoration has no actions.

| `type` | Runtime data | Effect |
|---|---|---|
| `command` | `CommandActionData` | Runs a command as the clicking player or as the console |
| `sound` | `SoundActionData` | Plays a sound to the clicking player |
| `message` | `MessageActionData` | Sends sanitized MiniMessage to the clicking player |
| `teleport` | `TeleportActionData` | Teleports the clicking player through the async path |
| `connect` | `ConnectActionData` | Requests a BungeeCord-compatible proxy transfer |
| `navigate` | `NavigationActionData` | Changes that viewer's menu page stack |

Every action needs a recognized string `type`. A missing or unknown type rejects the menu file. Unknown extra keys inside a valid action are ignored.

A missing action list is empty. One action object can also be used where a list is expected.

## The click trigger

`trigger` is shared by all six types. Omission and an explicit `null` both resolve to `any`.

| JSON value | Matches |
|---|---|
| `any` | Every accepted main-hand interaction |
| `left_click` | Left click while not sneaking |
| `right_click` | Right click while not sneaking |
| `shift_left_click` | Left click while sneaking |
| `shift_right_click` | Right click while sneaking |

Values are exact and case-sensitive. The four physical values are mutually exclusive. A shift-left-click does **not** match a `left_click` binding. Only `any` matches everything.

Gloss accepts main-hand left and right clicks, with sneaking checked when the player clicks. Off-hand interactions are ignored.

## `command`

```json
{ "type": "command", "source": "player", "command": "/spawn", "trigger": "right_click" }
```

| Key | Required | Default | Meaning |
|---|---|---|---|
| `command` | yes | none | The command line. One leading slash is optional; `%player%` and `%player_name%` become the clicking player's name |
| `source` | no | `player` | `player` or `server` |

Gloss trims the command and removes one leading slash. A blank command is logged and dropped.

- `player` calls `Player#performCommand` inline on the player owning thread. The player own permissions apply, exactly as if they had typed it.
- `server` defers a console dispatch onto the global scheduler. This grants the command full console authority. It does **not** check the player permissions.

> A `server` command is console authority handed to whoever can click the button. Gate the button with a `gloss.open.<menuId>` permission, or put the privileged step behind a command that does its own checks.
{.is-warning}

Gloss replaces `%player%` and `%player_name%` with the clicker's name. Other PlaceholderAPI tokens are not expanded. Server commands may finish after later actions because they run on the global scheduler.

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

An unknown sound key is logged and the action is dropped without discarding the menu.

Playback is positioned at the clicking player and sent only to that player. An explicit volume of `0` is silent. Values above `1` extend the audible distance. Neither volume nor pitch is range-checked.

## `message`

```json
{
  "type": "message",
  "message": "<gold>Hello <white>%player%</white></gold>"
}
```

`message` is required and must contain non-whitespace text. On click,
Gloss applies these steps in order. The literal `%player%` becomes the
clicking player name. PlaceholderAPI expands any installed `%...%`
tokens. Legacy ampersand and section-sign codes are rewritten into
MiniMessage tags. The result is parsed as MiniMessage. The component is
sent to that player alone.

Gloss strips click and insertion events from the parsed message. Formatting, gradients, decorations, and hover text remain available.

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

All six destination fields are required. If any of them is missing, non-finite or malformed, the action is warned once per menu and component and dropped when actions are resolved. The rest of the list is kept.

The world must already be loaded. Gloss does not create a world, load a chunk, or fall back to the player's current world.

Gloss schedules the teleport on the player owner and uses Paper's asynchronous teleport path when available.

Later actions can run before the teleport finishes. Menu teleport and distance rules still apply at the destination.

## `connect`

```json
{ "type": "connect", "server": "lobby-1" }
```

`server` is the exact logical server name configured on a BungeeCord-compatible proxy. It must be 1 to 64 characters, start with a letter or digit, and otherwise contain only letters, digits, `.`, `_` and `-`. Anything else is warned once and dropped when actions are resolved.

Gloss sends a `Connect` request on the BungeeCord plugin channel. Authors cannot provide a host, port, URL, or custom payload.

Without a compatible proxy, the request does nothing and the player stays on the current server.

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

An omitted `mode` defaults to `push`. A `push` or `replace` with no non-blank `target` is warned once and dropped at resolution. `back`, `home` and `close` are always accepted.

Targets are exact, case-sensitive menu ids, including forward-slash folder paths such as `shops/confirm`. A menu id is its path under `menus/` with `.json` removed.

### The page stack

History is stored per viewer as a stack of menu IDs and one root.

- `push` records the page you are leaving, so `back` returns to it.
- `replace` swaps the page without recording anything, which is what you want for a refresh or a same-level tab switch.
- `back` reads the newest history entry, checks it still matches, opens it, and then pops it.
- `home` opens the remembered root and clears history. The root is the first page opened in the flow.
- `close` tears the flow down. For a personal menu the session ends. For a panel the viewer dismisses that panel view.

`back` with an empty history and `home` with no recorded root both do nothing and report no history. A `back` or `home` whose recorded id no longer names a loaded menu leaves the current page up and sends the "menu unavailable" message. That is what you see after a menu file is renamed mid-flow.

If you open a personal menu, Gloss closes the previous session and records it according to the mode. If you close a session without history, Gloss clears the stack and the root outright. A fresh open starts a fresh flow.

### Permissions and gates

`push` and `replace` require the viewer to hold `gloss.open.<target>` in addition to whatever permission let them open the flow in the first place. A denial sends the standard permission message and leaves the current page up. The API open event fires for each navigation. A cancelled event leaves the current page up as well.

Panels apply one deliberate exception. Navigating to the panel own **root** menu skips the `gloss.open.<menuId>` check. A viewer who can see the panel is already looking at that menu. Every other target on a panel is checked normally. See [Panels](/gloss/16-panels).

When `[features] menus` is `false` in `gloss.toml`, every navigation mode except `close` is denied.

A missing target menu sends the "menu unavailable" message. A denied permission sends the "permission denied" message. Both leave the flow exactly as it was.

## Execution order

Within one component Gloss walks the action list in declaration order. It skips any entry whose trigger is neither `any` nor the exact interaction. It executes the rest in their original order.

`command`, `sound`, `message`, `teleport` and `connect` all continue the list. A matching `navigate` **terminates** it, whether or not the navigation actually succeeded. A denied permission, a missing menu, a cancelled open event and an empty history all still stop the remaining actions. Because the skip test runs first, a `navigate` bound to an exact trigger only terminates that one click type. A `navigate` left at `any` terminates every click.

| Action path | Thread and timing |
|---|---|
| Player command, sound, message, connect | Inline on the clicking player's owning thread |
| Teleport | The player's entity scheduler, then the asynchronous teleport path |
| Server command | Deferred to the global scheduler |
| Navigation | Inline, through the current personal or panel viewer context |

An action failure is logged with the menu, component, and player. It stops the remaining actions in that component.

A toggle whose matching action chain reaches a `navigate` returns **before** swapping its icon and flipping its state. A navigating toggle never changes appearance.

## Which surface handled the click

When a personal menu and panel overlap, Gloss uses the nearest unobstructed component.

Gloss fires the cancellable API click event before JSON actions. API menu handlers run after those actions. A cancelled event runs neither.

## Invalid entries

Invalid action data drops only that action and keeps the remaining order.

| Action | Dropped when |
|---|---|
| `command` | The command is missing, blank, or a lone slash |
| `sound` | The sound key is missing, malformed, or absent from the registry |
| `message` | The message is missing or blank |
| `teleport` | The world key is malformed, or any of the six destination numbers is missing or non-finite |
| `connect` | The server name fails the fixed pattern |
| `navigate` | `push` or `replace` has no non-blank target |

An in-memory action type the runtime does not recognize is warned and skipped the same way.

Gloss reports these warnings when the menu loads. A malformed `type` rejects the entire file instead.

## Absent-key reference

| Action | Missing key | Result |
|---|---|---|
| Any | `trigger`, or `trigger: null` | Defaults to `any` |
| Any | `type` | The whole menu file fails to parse |
| `command` | `source` | Defaults to `player` |
| `command` | `command` | Action dropped |
| `sound` | `source`, `volume`, `pitch` | Default to `master`, `1`, `1` |
| `sound` | `sound` | Action dropped |
| `message` | `message` | Action dropped |
| `teleport` | Any of `world`, `x`, `y`, `z`, `yaw`, `pitch` | Action dropped |
| `connect` | `server` | Action dropped |
| `navigate` | `mode` | Defaults to `push`, which then requires `target` |
| `navigate` | `target` with `mode` of `back`, `home` or `close` | Accepted |
| `navigate` | `target` with `mode` of `push` or `replace` | Action dropped |

## Schema

`schema/gloss.schema.json` describes these action fields for the web editor.

The schema is advisory; the server remains the authority. See [Web Editor & Sync](/gloss/18-web-editor).

## Related

- [Hologram Menus](/gloss/09-menus): menu documents and IDs
- [Components & Hitboxes](/gloss/10-components-hitboxes): clickable components and targeting
- [Icons](/gloss/11-icons): component visuals
- [Panels](/gloss/16-panels): world-anchored menus
- [Commands & Permissions](/gloss/17-commands-permissions): access nodes
