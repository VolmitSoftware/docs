---
title: "Scoreboards & Groups"
description: "Gloss documentation: Scoreboards & Groups"
published: true
date: 2026-08-25T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Scoreboards are schema-2 JSON documents in `plugins/Gloss/boards/`. One file is one board and the
file name is its id. Each document contains its own automatic-selection condition, one fallback
presentation and complete conditional variants. Groups are not files; a condition can read the
player's live Vault primary group like any other player property.

`/gloss web edit scoreboard <id>` opens one board in a restricted live editor session;
`/gloss web workspace` includes every board.

## The board document

`plugins/Gloss/boards/staff.json`:

```json
{
  "schemaVersion": 2,
  "revision": 7,
  "select": {
    "priority": 100,
    "when": "inGroup('viewer', 'staff') || hasPermission('viewer', 'gloss.staff')"
  },
  "presentation": {
    "title": "&d&lStaff",
    "lines": [
      "&7Player: &f{{ player.name }}",
      "&7Online: &f{{ server.online }}/{{ server.maxPlayers }}"
    ],
    "hideNumbers": true
  },
  "variants": [
    {
      "id": "critical-health",
      "priority": 200,
      "when": "viewer.health < 5",
      "presentation": {
        "title": "&c&lDANGER",
        "lines": ["&fHealth: &c{{ fixed(player.health, 1) }}"],
        "hideNumbers": true
      }
    }
  ]
}
```

| Key | Default | Notes |
|---|---|---|
| `schemaVersion` | required | Must be `2` |
| `revision` | required | `1` to `9007199254740991`. Gloss owns this value and bumps it by one on every write it makes |
| `select.priority` | `0` | Outer board-selection priority. Higher wins; equal priorities use the smaller board id |
| `select.when` | `"false"` | Required boolean condition. False keeps the board out of automatic selection |
| `presentation` | empty | Complete fallback title, lines and number-visibility policy |
| `variants` | `[]` | Complete alternate presentations, each with unique `id`, integer `priority`, `when`, and `presentation` |

Every presentation has `title`, `lines` and `hideNumbers`. An empty base title falls back to the
board id. At most 15 lines render. A variant presentation is complete and never inherits a title,
line or number policy from the base.

There is no `id` key. The document id is the file name with `.json` removed. If you rename the file, you rename the board. Only files directly inside `boards/` are read. Subfolders are ignored.

A document that fails to parse is logged as `boards/<id>.json: <reason>` and skipped. The copy Gloss already holds stays live. A deleted file removes the board. Any player currently on it loses their sticky selection and is re-evaluated.

### Shipped defaults

`boards/default.json` and `boards/animation-showcase.json` are extracted when missing, and only
while `[features] boards` is on. With the feature off there is no `boards/` folder at all; turning
it on extracts both defaults on that reload. The ordinary default is:

```json
{
  "schemaVersion": 2,
  "revision": 1,
  "select": {"priority": 0, "when": "false"},
  "presentation": {
    "title": "&d&lGloss",
    "lines": ["&fWelcome!", "&7Edit boards/default.json", "&7or create your own board."],
    "hideNumbers": false
  },
  "variants": []
}
```

Note `"when": "false"`. Out of the box nothing selects this board. Give it a real condition, or
use `"true"`, before it can appear automatically.

`animation-showcase.json` is a complete paste-ready board with one row for every shipped animation
effect, one obfuscated-text row, and one row for each alignment:

```json
{
  "schemaVersion": 2,
  "revision": 1,
  "select": {"priority": 0, "when": "false"},
  "presentation": {
    "title": "&d&lANIMATION LAB",
    "lines": [
      "{{ select(['&c', '&6', '&e', '&a', '&b', '&d'], floor(time.seconds * 4)) }}&lRAINBOW",
      "&b{{ marquee('MARQUEE', 7, floor(time.seconds * 4)) }}",
      "{{ timeline([['&aTIMELINE', 2], ['&eNEXT SCENE', 2]], time.seconds) }}",
      "&f{{ typewriter('TYPEWRITER', floor(time.seconds * 4) + 9, 1) }}",
      "{{ flash('&d&lFLASH', '&7FLASH', floor(time.seconds * 4)) }}",
      "&d{{ wipe('WIPE', floor(time.seconds * 4) + 4) }}",
      "{{ scanner('SCANNER', '&7', '&a', floor(time.seconds * 4)) }}",
      "&5{{ scramble('DECODE', floor(time.seconds * 4)) }}",
      "&6ODO {{ odometer(0, 999, mod(time.seconds, 10) / 10, 3) }}",
      "{{ wave('WAVE', ['&a', '&7'], floor(time.seconds * 4)) }}",
      "&d&kMAGIC&r",
      "&a{{ align('GLOSS', 20, 'left') }}",
      "&e{{ align('GLOSS', 20, 'center') }}",
      "&c{{ align('GLOSS', 20, 'right') }}"
    ],
    "hideNumbers": true
  },
  "variants": []
}
```

The board is deliberately not selected. Use `/gloss board show animation-showcase` to inspect it
without changing automatic selection, or edit its `select` block normally. `middle` is an alias for
`center`, so the shipped board demonstrates the three distinct layouts without spending a duplicate
row.

`/gloss board reset [name=*]` rewrites shipped defaults over whatever is on disk. Use `default` or
`animation-showcase` for one file; `*` restores both. It requires `gloss.boards.edit`.

> `/gloss board reset` overwrites the selected shipped board files without a backup. Boards you created yourself are not shipped defaults. The command never touches them.
{.is-warning}

## Selection order

Every loaded board whose `select.when` is true is a candidate. Greatest `select.priority` wins;
equal priorities use the lexicographically smallest board id. No candidate means no sidebar. Once a
board is chosen, its matching variant with the greatest priority and then smallest variant id wins;
no variant match uses the base presentation.

Selection and the active variant are evaluated on the player's entity-owning thread every
`[boards] updateIntervalTicks` (default 20), as well as after join, world change, reload and document
changes. Health, world, permission, group, time and demanded metric conditions therefore update
without a relog. See [Expressions & Placeholders](/gloss/13-expressions-placeholders#conditional-documents)
for the full language and variable catalog.

### Manual selection

`/gloss board show <id>` and `/gloss board hide` override the automatic board id and mark the player
sticky. A shown board still re-evaluates its own variants on the ordinary selection pass. Sticky
state is dropped when the player quits, or when the board they are showing is deleted.

`/gloss board hide` is also sticky. It leaves the player with no board and no automatic re-selection until they log out.

## Editing by command

```
/gloss board create scoreboard
/gloss board title scoreboard "&d&lMy Server"
/gloss board addline scoreboard "&7Online: &f%server_online%"
/gloss board select scoreboard 100 "viewer.world == 'world' && viewer.health >= 5"
```

| Node | Arguments | Permission |
|---|---|---|
| `create` | `<id>` | `gloss.boards.create` |
| `delete` | `<id>` | `gloss.boards.delete` |
| `title` | `<id> <text>` | `gloss.boards.edit` |
| `addline` | `<id> <text>` | `gloss.boards.edit` |
| `setline` | `<id> <line> <text>` | `gloss.boards.edit` |
| `removeline` | `<id> <line>` | `gloss.boards.edit` |
| `select` | `<id> <priority> <when>` | `gloss.boards.edit` |
| `reset` | `[name=*]` | `gloss.boards.edit` |
| `show` | `<id>` | `gloss.boards.show` |
| `hide` | none | `gloss.boards.hide` |
| `list` | none | none |
| `info` | `<id>` | none |

Required arguments are positional in the order shown. Optional arguments must be written as `key=value`. Line numbers start at 1. An out-of-range number is rejected with the current line count. `show` and `hide` are player-only. Every node is reachable as `/gloss board ...`, through the aliases `/gloss boards`, `/gloss sb` and `/gloss bd`, and through the root command `/board` (aliases `sb`, `bd`).

`create` makes a board titled `&d<id>` with the single line `&7A fresh Gloss board`. Ids are trimmed and spaces become dashes. `/`, `\` and `..` are rejected.

`select` compiles the condition before writing. Quote an expression containing spaces. `/gloss board
info` reports the selection priority, condition, variant count, title and lines. Variants remain a
JSON/editor surface so their complete presentations can be edited atomically.

Command edits save the document and increment its revision. See [Data Files & Hot Reload](/gloss/03-data-files).

## Rendering

Ordinary sidebars use `[boards] updateIntervalTicks` (default 20, clamped 1..200). An actively selected board containing a clock-driven expression (`time.ms`, `time.seconds` or `time.ticks`) or a complete `|animation.<id>|` token moves to a separate every-tick driver, so it can display authored animation at up to 20 FPS. Static boards and boards containing only player, server, metric or PlaceholderAPI values stay on the ordinary driver even while another player watches an animated board. Rendered rows are change-deduplicated before they reach the client.

Packet objective state is detached from the server scoreboard. Canvas and Folia therefore render and update a selected board entirely from the player's owning region thread without invoking global-scoreboard mutations.

Title and lines both go through the full text pipeline with the viewing player as the resolution context. Functions, PlaceholderAPI placeholders, emoji and colors all work per player. VolmLib sends each rendered title and row as one complete modern component without a character limit or truncation. CRLF, CR, LF and Unicode line separators become one space, so one JSON entry cannot wrap into multiple client rows. Minecraft still exposes at most 15 sidebar rows; the rest are dropped.

Use `align(text, width, mode)` to pad visible text to an explicit number of character cells. `mode` is `left`, `center`, `middle` or `right`; `middle` and `center` are equivalent. Formatting codes do not consume cells, and content longer than `width` is returned whole rather than terminated. This is character-cell alignment, not pixel-perfect alignment for proportional or custom fonts. Resolve PlaceholderAPI content with `papi(...)` inside the call when its rendered width must participate in alignment.

`"hideNumbers": true` applies Minecraft's blank score number format per board on native 1.20.3+
servers and clients. It removes the red score column without changing the internal 15-to-1 values
that keep the rows ordered. On a server older than 1.20.3, ViaVersion's global
`hide-scoreboard-numbers: true` option provides the equivalent translation for 1.20.3+ clients;
that ViaVersion setting affects every scoreboard on the server rather than one Gloss document.

With `[features] boards = false` the driver is never created. No player sees a sidebar. Documents still load, hot-reload and stay editable by command. If the driver itself fails to construct, Gloss logs `Sidebar driver unavailable: <reason>` and runs without sidebars.

Boards are editable in the Gloss web editor. Its inspector exposes the selection condition, base
presentation and complete variants, and its simulator resolves the same priority/id rules as the
plugin. Server sync carries the board JSON as a first-class document kind.

## Groups

Gloss has no group files. The `groups/` YAML directory is retired. There is no `/gloss group` command. Nothing about a group is configured inside Gloss. `GroupService` is a thin live resolver:

- With `[groups] useVault = true` (the default) and Vault installed, Gloss asks the registered Vault `Permission` provider for the player primary group. It trims it and lowercases it.
- The answer is cached per player for **5 seconds**, then re-asked. The cache entry is dropped when the player quits. The whole cache is cleared on `/gloss reload`.
- Vault provider reads run on the player's entity-owning thread. A direct board, tablist or bubble selection fills a cold cache there; cache-only refreshes are dispatched to the same owner rather than an asynchronous worker.
- Any failure inside the Vault provider is swallowed and treated as "no group".

The resolved name is exposed as `viewer.group`, `subject.group`, `source.group` where that role is a
player, and through `inGroup(role, name)`.

### Without Vault

If Vault is not installed, or `[groups] useVault = false`, or Vault has no permission provider
registered, the group value is empty and `inGroup` is false. Other conditions such as `viewer.op`,
permissions, world and health are unaffected.

If Vault is present but the hook fails to construct, Gloss logs `Vault permission hook failed to initialize: <reason>` and behaves as though Vault were absent. If you enable `[groups] useVault` on a reload, Gloss re-attempts the hook. If you disable it, Gloss stops resolving groups at once. The already-hooked provider stays in place until the next restart.

## Coming from the pre-merge layout

Board schema 2 is a hard format break. Gloss silently ignores schema-1 board documents and does not migrate them.
Rewrite custom files to the shape above or use `/gloss board reset` for a shipped default. The legacy
import command is not a board-schema upgrader. Full document behavior is in
[Data Files & Hot Reload](/gloss/03-data-files).
