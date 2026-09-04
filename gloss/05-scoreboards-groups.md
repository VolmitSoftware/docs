---
title: "Scoreboards & Groups"
description: "Create conditional scoreboards and select them by player or Vault group"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Each schema-2 JSON file in `plugins/Gloss/boards/` defines one scoreboard. Conditions select a board and its presentation for each player. Vault group names are available to those conditions when Vault is installed.

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

If an edit is invalid, Gloss logs the reason and keeps the last valid version active. Deleting a file removes that board.

### Defaults

When boards are enabled, Gloss extracts `boards/default.json` and `boards/animation-showcase.json` if they are missing. The default board is:

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

The default has `"when": "false"`, so it does not appear automatically. Replace that condition or use `"true"`.

`animation-showcase.json` demonstrates the included text animations and alignment helpers:

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

Use `/gloss board show animation-showcase` to inspect it, or edit its `select` condition to show it automatically. `middle` is an alias for `center`.

`/gloss board reset [name=*]` rewrites defaults over whatever is on disk. Use `default` or
`animation-showcase` for one file; `*` restores both. It requires `gloss.boards.edit`.

> `/gloss board reset` overwrites the selected included board files without a backup. Boards you created yourself are not defaults. The command never touches them.
{.is-warning}

## Selection order

Every board with a true `select.when` condition is a candidate. The highest priority wins; ties use the lexicographically smallest ID. The same rule selects a presentation variant. If no board matches, the player sees no Gloss sidebar.

Gloss reevaluates selection every `[boards] updateIntervalTicks` (default 20) and after relevant player or document changes. See [Expressions & Placeholders](/gloss/13-expressions-placeholders#conditional-documents) for condition syntax.

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

Ordinary sidebars update at `[boards] updateIntervalTicks` (default 20). A selected board with a clock expression or named animation can update every tick. Gloss sends rows only when their rendered value changes.

Titles and lines support functions, PlaceholderAPI, emoji, colors, and viewer expressions. Minecraft displays at most 15 sidebar rows. Newlines inside one JSON row become spaces.

Use `align(text, width, mode)` for character-cell alignment. Modes are `left`, `center`, `middle`, and `right`; `middle` is an alias for `center`. Formatting codes do not count toward width.

`"hideNumbers": true` applies Minecraft's blank score number format per board on native 1.20.3+
servers and clients. It removes the red score column without changing the internal 15-to-1 values
that keep the rows ordered. On a server older than 1.20.3, ViaVersion's global
`hide-scoreboard-numbers: true` option provides the equivalent translation for 1.20.3+ clients;
that ViaVersion setting affects every scoreboard on the server rather than one Gloss document.

With `[features] boards = false`, no Gloss sidebar renders. Board documents remain editable.

The web editor can edit board selection, the base presentation, and complete variants.

## Groups

Gloss has no group files or `/gloss group` command. It reads the player's current primary group from Vault:

- `[groups] useVault` defaults to `true`.
- Group names are trimmed, lowercased, and cached for 5 seconds.
- A failed lookup behaves as though the player has no group.

The resolved name is exposed as `viewer.group`, `subject.group`, `source.group` where that role is a
player, and through `inGroup(role, name)`.

### Without Vault

If Vault is not installed, or `[groups] useVault = false`, or Vault has no permission provider
registered, the group value is empty and `inGroup` is false. Other conditions such as `viewer.op`,
permissions, world and health are unaffected.

If the Vault hook fails, Gloss logs the reason and treats group values as empty. Changing `[groups] useVault` applies on reload.

## Coming from the pre-merge layout

Gloss ignores schema-1 board documents. Rewrite custom files to schema 2 or use `/gloss board reset` for a bundled default. See [Data Files & Hot Reload](/gloss/03-data-files).
