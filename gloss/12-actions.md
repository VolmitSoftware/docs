---
title: "Actions"
description: "Gloss documentation: Actions"
published: true
date: 2026-08-24
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Clickable menu components run an ordered list of typed actions. Gloss supports player and console commands, sounds, sanitized MiniMessage messages, Folia-safe teleports, proxy connect requests and native page-stack navigation. The same six-type contract drives menus opened by command, menus rendered on a panel, and menus opened through the API.

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

The shared union adapter removes `type` and binds the remaining keys to the matching record. A missing `type`, a non-string `type` and an unknown `type` all abort parsing of the whole menu file with `Missing type`, `Type must be a string` or `Unknown type: <value>`. A non-string or unknown non-null `trigger` rejects the file too. It does not silently change what a button does. Unknown extra keys inside a recognized action are ignored by the runtime.

An omitted or `null` action list becomes an empty list. The JSON codec also accepts one action object where a list is expected and wraps it as a one-element list. `"actions": {"type":"sound", ...}` is legal.

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

Gloss accepts left and right clicks from the main hand only. It samples sneak state at the moment of the event. Off-hand interactions and every other action type are ignored before any action work begins.

## `command`

```json
{ "type": "command", "source": "player", "command": "/spawn", "trigger": "right_click" }
```

| Key | Required | Default | Meaning |
|---|---|---|---|
| `command` | yes | none | The command line. One leading slash is optional; `%player%` and `%player_name%` become the clicking player's name |
| `source` | no | `player` | `player` or `server` |

The command is trimmed and exactly one leading slash is removed. A missing, blank or slash-only command is warned once and dropped when the actions are resolved.

- `player` calls `Player#performCommand` inline on the player owning thread. The player own permissions apply, exactly as if they had typed it.
- `server` defers a console dispatch onto the global scheduler. This grants the command full console authority. It does **not** check the player permissions.

> A `server` command is console authority handed to whoever can click the button. Gate the button with a `gloss.open.<menuId>` permission, or put the privileged step behind a command that does its own checks.
{.is-warning}

Before either dispatch path, Gloss replaces every literal `%player%` and `%player_name%` token with the clicking player's Minecraft name. This makes a privileged action such as `{ "type": "command", "source": "server", "command": "give %player% minecraft:obsidian 1" }` target the clicker without requiring that player to have command permission. Other PlaceholderAPI tokens are not expanded and reach the target command literally. A deferred `server` command may run after later inline actions in the same list, because the scheduler hop returns immediately.

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

The sound key is resolved once and cached process-wide when the action is built. An unknown or malformed key is warned once per menu, component and key. The action is dropped without discarding the menu.

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

Gloss then recursively strips click events and insertion events from the parsed component before delivery. Formatting, gradients, decorations and ordinary hover presentation all remain available. A message can never become an `open_url`, `run_command`, `suggest_command`, clipboard or insertion action. There is no general URL or arbitrary network action anywhere in the menu contract.

Delivery prefers the Adventure audience path. It falls back to a legacy serialized string on servers where the player is not an audience.

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

At click time the world must already be loaded. It must match a loaded world namespaced key. Gloss does not create a world, load a chunk, or fall back to the player current world. An unloaded but well-formed world is warned once per menu, component and world key at click time rather than at load time. If you load that world later, the same action works without touching the menu file.

The teleport is marshalled onto the clicking player entity scheduler and then issued through Paper asynchronous teleport method. That is what makes it safe across Folia regions. If the running server does not expose that method, Gloss falls back to an ordinary synchronous teleport on the scheduled task. Spigot behaves correctly but without the async path.

The completion is not awaited. Later non-terminal actions in the same list can run while the teleport is still in flight. A refused or failed teleport is logged with menu, component, player and world context. The menu own `closeOnTeleport`, world and range rules still apply once the player arrives.

## `connect`

```json
{ "type": "connect", "server": "lobby-1" }
```

`server` is the exact logical server name configured on a BungeeCord-compatible proxy. It must be 1 to 64 characters, start with a letter or digit, and otherwise contain only letters, digits, `.`, `_` and `-`. Anything else is warned once and dropped when actions are resolved.

Gloss registers the outgoing `BungeeCord` plugin channel while it is enabled and unregisters it on shutdown. On click it sends exactly two UTF fields through the clicking player: the fixed subchannel `Connect`, then the validated server name. Authors cannot select another subchannel, host, port, URL or payload.

Delivery is a request, not a confirmation. Without a compatible proxy configuration the plugin message goes nowhere. The player stays where they are. No error is shown to them.

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

History is per viewer, not per menu. It is a stack of menu ids plus one remembered root.

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

Component dispatch catches exceptions, logs the full stack with menu, component and player context, and then continues normal click handling outside that component. A thrown inline action aborts the remaining actions in its own list. A deferred console command that fails does so later inside its scheduler task. It is not caught by the click-time guard.

A toggle whose matching action chain reaches a `navigate` returns **before** swapping its icon and flipping its state. A navigating toggle never changes appearance.

## Which surface handled the click

A single interact event can be a candidate for both an open personal menu and a nearby panel. Gloss ray-tests the open personal-menu clickables and the panel clickables in range. It takes the nearest hit across both. It checks that no solid block sits between the eye and that hit. If the click is unobstructed the interact event is cancelled and exactly one component is dispatched.

Personal-menu clicks fire the cancellable API click event before the JSON actions. When the menu came from the API and its handle is still live, they invoke the registered API handler after them. Panel clicks fire the same cancellable event with no owner name and no API handler. Either way, a cancelled event means no JSON action runs at all.

## Invalid entries

Bad action data does not discard a valid menu. Action resolution removes only the invalid entry and keeps the surviving declaration order intact. The neighbours on either side still run. They still run in the order they were written.

| Action | Dropped when |
|---|---|
| `command` | The command is missing, blank, or a lone slash |
| `sound` | The sound key is missing, malformed, or absent from the registry |
| `message` | The message is missing or blank |
| `teleport` | The world key is malformed, or any of the six destination numbers is missing or non-finite |
| `connect` | The server name fails the fixed pattern |
| `navigate` | `push` or `replace` has no non-blank target |

An in-memory action type the runtime does not recognize is warned and skipped the same way.

Resolution runs when a menu document is parsed, not only when a component is first built. These warnings appear at load time and again nowhere else. Each one is deduplicated for the life of the server process by menu id, component id and — for sounds and teleport worlds — the offending value. If you re-save the same broken menu, Gloss will not print the same warning twice.

By contrast, a malformed `type` discriminator is a parse failure. That happens earlier. It stops the entire menu file from registering.

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

`schema/gloss.schema.json` defines `$defs.action` as the union above
and requires `type`. Each branch has its own constraints. A command must
be non-blank with no leading slash. Sound sources are the ten listed
values. A message must be non-blank. Teleport requires all six fields
and the lowercase world-key pattern. Connect uses the proxy server name
pattern. Navigate allows the five modes, and `target` is required unless
the mode is `back`, `home` or `close`.

The schema is advisory. It is not read at runtime. No JSON Schema validator runs in the loader. It describes what the web editor enforces rather than what the server enforces. See [Web Editor & Sync](/gloss/18-web-editor).

## Related

- [Hologram Menus](/gloss/09-menus) — where actions live in a menu document, and menu ids
- [Components & Hitboxes](/gloss/10-components-hitboxes) — which components are clickable, and how a click is aimed
- [Icons](/gloss/11-icons) — the visual half of a component
- [Panels](/gloss/16-panels) — world-anchored menus and their own page stack
- [Commands & Permissions](/gloss/17-commands-permissions) — `gloss.open.<menuId>` and the rest of the tree
- [Runtime Architecture](/gloss/20-runtime-architecture) — scheduler and session ownership
