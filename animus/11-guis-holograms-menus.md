---
title: "Animus: GUIs, Holograms and Menus"
description: "Chest GUIs, holograms, holographic menus and text animations in the Gloss formats"
published: true
date: 2026-11-09T00:00:00.000Z
tags: "animus, gui, holograms, menus, gloss"
editor: markdown
dateCreated: 2026-11-05T00:00:00.000Z
---

Animus opens chest windows, shows holograms and opens holographic menus from JSON files. The files use the Gloss formats: the same field names, the same `schemaVersion` numbers and the same actions. Animus reads and runs them itself, so Gloss does not need to be installed. A file that uses only features both plugins share works in both.

| Kind | Gloss format | Animus folder | Section |
| --- | --- | --- | --- |
| Chest GUI | `inventories/`, `schemaVersion` 1 | `gui/inventories/` | [Chest GUIs](#chest-guis) |
| Hologram | `holograms/`, `schemaVersion` 3 | `gui/holograms/` | [Holograms](#holograms) |
| Holographic menu | `menus/`, no version | `gui/menus/` | [Holographic menus](#holographic-menus) |
| Text animation | `animations/`, `schemaVersion` 1 | `gui/text-animations/` | [Text animations](#text-animations) |

## Chest GUIs

Files live in `plugins/Animus/gui/inventories/` (`config/animus/gui/inventories/` on mod servers). A file at `town/menu.json` has the id `town:menu`. Files must be in a namespace folder.

To start one in game, `/animus gui create town:board rows=4 title="&8Notice board"` writes an empty chest window of that size and reloads the GUIs. Fill it in the file or the [web editor](/animus/14-web-editor#gui-editors), and bind it to NPCs with the toolkit's **GUIs** screen.

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "title": "&8Bakery counter",
  "resolution": "9x3",
  "mask": ["#########", "#  B H  #", "####X####"],
  "keys": {
    "#": {"type": "decoration", "icon": {"type": "item", "item": "minecraft:brown_stained_glass_pane", "name": " "}},
    "B": {"type": "button", "icon": {"type": "item", "item": "minecraft:bread", "name": "&eBrowse the bakery"},
          "actions": [{"type": "animus:open-shop", "shop": "shop:bakery"}]},
    "H": {"type": "button", "icon": {"type": "item", "item": "minecraft:clock", "name": "&fIt is {{ time.hour }}:00"},
          "actions": [{"type": "message", "message": "&7Hello, {{ viewer.name }}."}]},
    "X": {"type": "button", "icon": {"type": "item", "item": "minecraft:barrier", "name": "&cClose"}, "actions": [{"type": "close"}]}
  }
}
```

Open a GUI with `/animus gui open <id> [player=]`, with the behavior action `animus:open-gui`, from an NPC click (see [NPC bindings](#npc-bindings)), or from another GUI, a hologram or a menu with an `inventory` or `navigate` action. An id without a namespace, such as `"id": "shop"`, names a file in the same namespace as the document that uses it, so a folder copied from Gloss keeps its links.

### Chest GUI fields

| Field | Meaning |
| --- | --- |
| `schemaVersion` | Must be 1. Any other version is refused by name. |
| `revision` | 1 or more. |
| `title` | Window title. `&` color codes, `&#RRGGBB` and common MiniMessage color and style tags such as `<red>` and `<bold>` work. `{{ expr }}` holes are filled for each viewer. |
| `resolution` | `9x1` to `9x6`, `5x1` (hopper) or `3x3` (dropper). Mod servers draw only the `9xN` sizes; a `5x1` or `3x3` window does not open there. |
| `mask`, `keys` | One row of characters per window row; each character draws the key with that name. A space is empty. |
| `slots` | Slot number to component. Explicit slots draw over the mask. |
| `list` | Fills the slots of one mask character with pages of a template. `var` names each entry, `source` is an expression that gives a list, `pageSize` defaults to the area, `refreshTicks` re-reads the source. List cells draw over everything else, as in Gloss. A shop that uses the GUI as its [layout](/animus/10-shops#layout-guis) fills the list with its offers instead. |
| `refresh` | `titleTicks` and `slotsTicks` redraw the window on a timer. `0` turns a timer off. |
| `show` | A condition. When false, the GUI does not open for that viewer. |
| `variants` | Replacement title, mask, keys or slots, chosen by the highest `priority` whose `when` is true. Nothing merges. |
| `actions` | Named action lists for `call`. Calls must exist and must not loop. |
| `closeOnTeleport` | Default true. |
| `select` | Read and checked, but not used: Animus opens a GUI by id. |
| `preset` | Refused. Gloss presets are not available; copy the fields in. |

Components are `button` (an icon and actions), `decoration` (an icon) and `toggle` (shows `trueIcon` and runs `trueActions` when `condition` gives `expectedValue`, otherwise the false side). Every component can have `show`. Icons are `item` (`item`, `count`, `customModelValue`, `name`, `lore`) and `playerHead` (`player`, `name`, `lore`); a head shows the player's skin only on Bukkit and only for an online player. Holographic menu components (`list`, `slider`, `field`, `tabs`) and icons (`text`, `textImage`, `block`, `entity`) have no meaning in a chest window and are refused. `customItem` icons are refused.

## Actions

Chest GUIs, holograms and menus share these actions. Every action may have `trigger` (`any`, `left_click`, `right_click`, `shift_left_click`, `shift_right_click`), `when` (a condition) and `cooldownTicks`.

| Action | What it does |
| --- | --- |
| `message`, `actionbar`, `title`, `sound` | Sends text, an action bar, a title or a sound to the viewer. |
| `command` | Runs a command as the server or, with `"source": "player"`, as the viewer. |
| `close` | Closes the window. |
| `navigate` | `mode` `page` moves the list (`next`, `prev` or a number); `push` and `replace` open another GUI by id; `back` and `home` go through the history; `close` closes. |
| `inventory` | Opens another GUI by `id` with `args`, readable as `args.*`. |
| `setSession` | Stores a value for the viewer, readable as `session.*` until the window closes. |
| `give`, `take` | Gives or takes items. `take` without a name or lore matches the item type only; when it cannot take the amount it sends `denyMessage` and stops the list. |
| `economy` | `withdraw`, `deposit` or `has` money. Without an economy it fails, sends `denyMessage` and stops the list. |
| `delay`, `sequence` | Waits, or runs steps at `atTicks`. Waiting work stops when the window closes. |
| `if`, `switch`, `chance`, `cooldown`, `stop`, `call` | Flow control, as in Gloss. |
| `parallel` | Runs each list in `branches` side by side. A `delay` or `stop` in one branch affects only that branch; the list goes on once every branch has started. |
| `repeat` | Runs `steps` up to `times` times, `everyTicks` apart (0 runs them all at once). `while` is checked before each pass; false ends the loop. |
| `teleport` | Moves the viewer to `world` (a key such as `minecraft:the_nether`), `x`, `y`, `z`, `yaw` and `pitch`. A world that is not loaded stops the list. |
| `bossbar` | Shows a boss bar named `id` for `ticks` (default 100; 0 hides the bar with that `id`), with `title`, `progress` (0 to 1), `color` (default `pink`) and `style`. A new bar with the same `id` replaces the old one. `priority` is read and checked; Animus shows every bar. |
| `broadcast` | Sends `message` to the whole server, the viewer's world or a `radius` around the viewer (`scope` `server`, `world` or `radius`), optionally only to players with `permission`. |
| `effect` | Gives the viewer the potion `effect` for `ticks` at `amplifier`. An unknown effect stops the list. |
| `particle` | Spawns `count` particles that only the viewer sees, spread by `offset`, at the viewer or, for holograms and menus, `"at": "location"`. |
| `animus:open-shop` | Opens a [shop](/animus/10-shops) by `shop` id. `back` returns to this GUI. |

Gloss actions that have no meaning in Animus are refused when the file loads, with the exact field, for example `$.keys.X.actions[1].type: action 'camera' is not available in Animus`. These are `connect`, `surface`, `prompt`, `dialog`, `book`, `emit`, `setState`, `addState`, `clearState`, `sky`, `camera` and `glow`, and the cutscene fields `once`, `skippable` and `onSkip` of `sequence`. The `subject` and `source` targets of `effect` and `particle` belong to Gloss behaviors and are refused too. Animus-only actions start with `animus:`. Nothing is skipped silently: a file with any problem is refused as a whole, and the previously loaded files keep working.

A GUI that runs `command` anywhere needs its id or namespace on the same allow-list as the [`animus:command`](/animus/07-behaviors#commands) behavior action (`commandBehaviors` or `commandNamespaces` under `[behaviors.actions]`). Without it the file is refused with that reason.

A command run as the server takes each `{{ }}` hole only when its text is letters, digits and `_ . : + -`; otherwise the command does not run and the rest of that action list stops. A command run as the viewer (`"source": "player"`) takes any text, since it runs with the viewer's own permissions. The web editor changes a GUI that runs commands, gives items or changes money (`command`, `give` or `economy` actions) only with the [`apply:commands`](/animus/14-web-editor#console-commands) scope.

## Expressions

`{{ expr }}` in text, and the `show`, `when`, `condition`, `on`, `source` and `amount` fields, use the Gloss expression grammar: numbers, quoted strings, colors (`#RGB`, `#RRGGBB`, `#AARRGGBB`), `true` and `false`, arrays, `!`, `-`, `* / %`, `+ -`, comparisons, `== !=`, `&&`, `||` and `a ? b : c`.

The functions are `clamp`, `lerp`, `min`, `max`, `floor`, `ceil`, `round`, `abs`, `mod`, `pow`, `smoothstep`, `sin`, `cos`, `rgb`, `argb`, `alpha`, `mix`, `palette`, `select`, `number`, `bar`, `hex`, `str`, `fixed`, `plain`, `readable` and `align`, plus `len`, `contains`, `lower` and `upper`, and Gloss's text animation functions `marquee`, `timeline`, `typewriter`, `flash`, `wipe`, `scanner`, `scramble`, `odometer` and `wave`. An expression is at most 512 characters and 256 levels deep. An unknown name or function refuses the file at load; a failure while running shows `?` in text and counts as false in a condition. PlaceholderAPI's `papi(...)` function is not supported; write the placeholder itself, such as `%player_level%`, in the text. A Gloss import rewrites it for you (see [With and without Gloss](#with-and-without-gloss)). With PlaceholderAPI installed it is filled for each viewer after the `{{ }}` holes, in titles, item names, lore, hologram lines and menu text; see [`[placeholders]`](/animus/03-configuration#placeholders).

| Name | Value |
| --- | --- |
| `viewer.name`, `viewer.uuid` | The viewer. `player.*` is the same. |
| `viewer.world`, `viewer.world_key` | The viewer's world. `viewer.world` is the world name on Bukkit, such as `world_nether`, and the dimension key on mod servers, the same value as the `player.world` behavior fact. `viewer.world_key` is the dimension key, such as `minecraft:the_nether`, on both. |
| `viewer.health`, `viewer.level`, `viewer.food`, `viewer.sneaking`, `viewer.x`, `viewer.y`, `viewer.z` | The viewer's state. Bukkit also has `viewer.op`, `viewer.flying` and `viewer.gamemode`. |
| `server.online`, `server.max` | Player counts. |
| `time.hour`, `time.minute`, `time.second`, `time.day`, `time.month`, `time.year`, `time.weekday`, `time.millis` | The server clock. `time.ms`, `time.seconds` and `time.ticks` count from 1970 in milliseconds, seconds and 50 ms steps, as in Gloss. |
| `args.*`, `session.*` | Values passed by `inventory` and stored by `setSession`. |
| `npc.name`, `npc.id`, `npc.uuid`, `npc.spawned`, `npc.health` | The NPC that opened the window or menu, or the NPC a hologram follows. |
| `page`, `pages` | The list page, counted from 1, and the page count. On a hologram, its page. |

## Safety

The server decides everything. Every click and drag in an Animus window is cancelled, so no item ever moves into or out of it. Only left, right, shift-left and shift-right clicks on the window's own slots reach the GUI, and they run on the next tick, outside the click itself. Number keys, the offhand key, drops, double clicks, middle clicks and shift clicks from the player's inventory do nothing.

A window closes when the player logs out, dies, changes world or respawns, teleports (unless `closeOnTeleport` is false), when the NPC that opened it despawns, and when Animus stops.

## Holograms

<div class="animus-demo">
<p><strong>GUIs and holograms</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/27-guis-holograms-ingame.webm" aria-label="Showing a hologram over the greeter and binding a chest GUI to it" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

A hologram file in `gui/holograms/<namespace>/` is a Gloss hologram. Animus shows it to every player within `viewDistance` of its anchor, drawn with display entities that exist only in that player's client. No entity is created on the server, and each player can see a different page, variant or text.

To make one where you stand, run `/animus hologram create town:welcome text="&6Welcome to town"`. It writes a hologram with that one line, anchored 1.5 blocks above your feet and facing your way, and shows it at once. Add lines, pages and actions in the file or the web editor afterwards.

```json
{
  "schemaVersion": 3,
  "revision": 1,
  "anchor": {"world": "world", "position": [12.5, 66, -4.5]},
  "lines": ["&6Town board", "&7Hello, {{ viewer.name }}", {"item": {"type": "item", "item": "minecraft:map"}, "scale": 0.6}, "&e|animation.blink|"],
  "actions": [{"type": "inventory", "id": "notices", "trigger": "right_click"}],
  "style": {"backgroundArgb": "#40000000"},
  "viewDistance": 32
}
```

| Field | Meaning |
| --- | --- |
| `anchor` | `world` (a world name or key) and `position`. The bottom of the text sits on the anchor. |
| `lines` | Rows from top to bottom. A string is a text row. An object has one of `text`, `item` (an item icon), `head` (a player name), `block` (a block id) or `entity` (an entity type), with optional `show` and `scale` (the row height of an object, in blocks). All text rows share one text display; an object takes blank rows of its height. A hidden text row keeps its space while the hologram has object lines. |
| `pages` | Pages of `id`, `lines` and `show`, instead of `lines`. Each player reads one page. `navigate` with `mode` `page` and `target` `next`, `prev` or a page id moves them, and wraps around. |
| `variants` | `id`, `priority`, `when` and `presentation` (`lines`, `style`). The first variant that matches, by priority and then id, replaces those fields. |
| `actions` | Up to 32 actions that run on a click. Animus puts an interaction box over the text (`hitbox`: `width`, `height` per row, `perLine`). A click counts only when the player is in the hologram's world (for a hologram bound to an NPC, the NPC's world), within 8 blocks and looking at the box. A hologram has no window, so `close`, `call` and navigate modes other than `page` are refused. |
| `style` | The Gloss display style: `billboard` (default `center`), `shadow`, `seeThrough` (default true), `textAlignment`, `backgroundArgb`, `textOpacity`, `lineWidth`, `blockLight` with `skyLight`, `viewRange`, `shadowRadius`, `shadowStrength`, `glowColor` and `scaleX`, `scaleY`, `scaleZ`. `cullingWidth` and `cullingHeight` are checked, but the client does its own culling. |
| `show`, `viewDistance`, `yaw`, `pitch` | Who sees it, from how far (4 to 128, default 48), and its rotation. |
| `refreshTicks`, `refresh` | How often the text is drawn again and `show` is checked: `refreshTicks` (default 10), or `refresh.contentTicks` and `refresh.visibilityTicks`. |

`preset`, an enabled `box` and non-empty `particleLayers` are refused by name. A player sees at most 64 holograms at a time.

## Holographic menus

A menu file in `gui/menus/<namespace>/` is a Gloss menu. A file at `lobby/main.json` has the id `lobby:main`. It opens in front of the player. The menu's `offset` is measured from the player's feet, with x to their right, y up and z the way they face. Each component's `offset` is measured from that center.

Open a menu with `/animus gui menu <id> [player=]`, with `animus:open-gui` and `"kind": "menu"`, with an [NPC binding](#npc-bindings), or with `navigate` from another menu.

```json
{
  "offset": [0, 1.4, 2.5],
  "components": [
    {"id": "title", "offset": [0, 0.7, 0], "data": {"type": "decoration", "icon": {"type": "text", "text": "&6&lMarket"}}},
    {"id": "buy", "offset": [-0.8, 0, 0], "data": {"type": "button", "highlightModifier": 0.08, "icon": {"type": "item", "item": "minecraft:bread"},
      "actions": [{"type": "animus:open-shop", "shop": "bakery"}]}},
    {"id": "close", "offset": [0.8, 0, 0], "data": {"type": "button", "icon": {"type": "text", "text": "&cClose"}, "actions": [{"type": "close"}]}}
  ]
}
```

| Field | Meaning |
| --- | --- |
| `offset`, `components`, `show`, `vars`, `actions` | The center, the components, who sees the menu, the first `session.*` values (constant expressions) and named action lists for `call`. |
| `followPlayer`, `lockPosition` | Move the menu with the player, or keep the player in place while the menu is open. |
| `maxDistance`, `closeOnDeath`, `closeOnTeleport` | When the menu closes. Without `closeOnTeleport`, a teleport moves the menu to where the player arrives. A menu also closes when the player changes world or respawns, and when it opens a chest GUI or a shop. |
| `button` | `icon`, `actions`, `highlightModifier` (how far the button moves toward the player while it is hovered), `hoverDurationTicks`, `hoverEasing`, `hitbox` (`width`, `height`, `offset`, `anchor`) and `tooltip` (`delayTicks`, `lines`, `style`). |
| `decoration` | An `icon` that cannot be clicked. |
| `toggle` | Starts from `condition` compared with `expectedValue`. A click runs `trueActions` to turn it on or `falseActions` to turn it off, and swaps the icon unless the actions stopped. |
| `list` | Draws `template` for each entry of `source`, `pageSize` at a time (default 6), on the grid `flow` (`columns`, `spacingX`, `spacingY`, `x`, `y`). `navigate` with `mode` `page` moves the lists. |
| `tabs` | One label for each tab, `spacing` apart. A click writes the tab id to `session.<var>`. |
| `slider` | A left click adds `step` and a right click subtracts it; shift multiplies the step by 5. The value stays between `min` and `max`, in `session.<var>`. |
| `motion` | `x`, `y`, `z` and `scale` as numbers or expressions, read every tick and eased by the client over `ticks`. |

Icons are `text`, `item`, `playerHead`, `block` and `entity`. Animus finds the hovered component every tick from where the player looks. Each clickable component has an interaction box. The server accepts a click only when the player's line of sight hits a clickable component of their own open menu, and it uses the nearest one. `navigate` with `push` or `replace` opens another menu and keeps this one for `back` and `home`. `field`, `textImage`, `animatedTextImage`, `customItem`, an enabled `box` and non-empty `particleLayers` are refused by name.

## Text animations

A text animation file in `gui/text-animations/<namespace>/` is a Gloss animation: `schemaVersion` 1, `revision`, `show`, `mode` (`ascend`, `descend`, `ascend_descend` or `random`), `frameIntervalMs` and `frames`. Text in holograms and menus shows the current frame with `|animation.<id>|`. An id without a namespace is found in the namespace of the document that uses it. All players see the same frame at the same time, and the `{{ }}` holes in a frame are filled for each player. A hologram or menu that shows an animation that did not load is refused. Chest GUIs refuse `|animation.` tokens.

Gloss's `[RRGGBB]` color shorthand works, so frames such as those of Gloss's rainbow animation color the text that follows them.

## NPC bindings

An NPC definition can open a chest GUI, menu, shop or Gloss menu when the NPC is clicked, and can carry a hologram that follows the NPC:

```json
"modules": {"animus:gui": {"open": {"kind": "menu", "id": "town:hall", "openOn": "right"},
                           "hologram": {"id": "town:sign", "offset": [0, 2.4, 0]}}}
```

`kind` is `inventory` (default), `menu`, `shop` or `gloss`. `openOn` is `right` (default), `left` or `both`. A sneaking player with `animus.admin` selects the NPC instead. The hologram's anchor becomes the NPC's position plus `offset` (by default, just above the NPC's head), and `npc.*` reads that NPC. All other fields of the hologram still apply.

## Commands

All of these need `animus.gui`, which `animus.admin` grants; the imports need `animus.import`; see [commands](/animus/02-commands-permissions#shops-and-guis) for the full list. The ones you use most:

```none
/animus gui create <id> [rows=3] [title=]
/animus hologram create <id> [text=]
/animus gui open <gui> [player=]
/animus import gloss live <kind> [document=all] [namespace=gloss] [replace=false]
/animus gui export file <name> [format=]
```

`<kind>` is `inventory`, `menu`, `hologram`, `animation` or `all`. `import gloss live` copies documents from Gloss's folders on this server. `gui export file` writes `exports/gui/<name>/` or, with `format=bundle`, `exports/gui/<name>.json`.

## With and without Gloss

Everything on this page works without Gloss, on Bukkit, Paper, Spigot, Folia, Fabric, NeoForge and Forge. Animus draws holograms and menus with its own packets. On Folia, the region that owns a player draws that player's holograms and menu.

When Gloss is installed on a Bukkit server, Animus finds it at startup through Gloss's public API, by name only, so Animus has no dependency on Gloss. Then:

- `animus:open-gui` and NPC bindings with `"kind": "gloss"` open Gloss menus by their Gloss id. Without Gloss they refuse with `gloss-unavailable`.
- `import gloss live` reads Gloss's `inventories/`, `menus/`, `holograms/` and `animations/` folders. A Gloss id becomes `<namespace>:<id>` (namespace `gloss` by default), lowercased, with other characters changed to `-`. Each document is checked exactly as Animus would load it, and a hologram or menu may show an animation that the same import brings. A newer `schemaVersion` or a Gloss-only feature refuses that document with the field, and nothing is written for it. Gloss's folders do not change. An Animus file that already exists with other content is kept unless you add `replace=true`.
- `gui export gloss` writes Animus documents into Gloss's folders, where Gloss's file watcher loads them. A document in namespace `gloss` keeps its id; other documents become `<namespace>.<path>`. Documents with `animus:` actions are listed and skipped. A Gloss file that already exists with other content is kept unless you add `replace=true`. Documents that name another document with a namespace are reported, because Gloss does not know Animus namespaces.

Without Gloss on the same server, move documents as files. `gui export file` writes the `/gloss export documents` layout (`<kind>/<id>.json` and `workspace.json`) or, with `format=bundle`, a `gloss-editor-workspace` bundle that Gloss Web opens. `import gloss file` reads either form, including bundles saved from Gloss Web. Bundle documents of kinds that Animus does not adopt are listed and skipped.

Both imports rewrite Gloss's PlaceholderAPI calls into placeholders. A `{{ }}` hole that holds only `papi('vault_prefix')`, `papi('vault_prefix', 'Member')`, `papiNumber('player_ping', 0)` or `papi('viewer', 'player_name', '')` becomes `%vault_prefix%`, `%player_ping%` or `%player_name%`, and the import lists how many calls it rewrote in each document. The fallback is dropped: when PlaceholderAPI has no value, the placeholder shows as written. A call inside a larger expression, such as `{{ papiNumber('player_ping') < 80 ? '&a' : '&c' }}`, or for the `sender` or `subject` role, is not rewritten, and the document is refused with `unknown function 'papi'`. Write that hole without `papi` and import it again.

The web editor's **Export Gloss bundle** writes each document's Animus id as its Gloss title, so the same bundle imports back to the same ids in the editor. `import gloss file` and `import gloss live` map ids from the Gloss id alone: `town:menu` leaves as `town.menu` and returns as `gloss:town-menu`.
