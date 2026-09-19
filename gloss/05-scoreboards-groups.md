---
title: "Scoreboards & Groups"
description: "Create conditional scoreboards and select them by player or Vault group"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

For proxy tablists, scoreboards, surfaces, connection messages, and MOTD management, see [Velocity Proxy](/gloss/27-velocity). The instructions below cover the server edition.

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
| `show` | `true` | Boolean or boolean expression; gates automatic and sticky visibility |
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

`animation-showcase.json` demonstrates every included text animation and alignment helper as a
board line:

```json
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
  "&a{{ align('GLOSS', 20, 'left') }}"
]
```

Use `/gloss board show animation-showcase` to inspect it, or edit its `select` condition to show it automatically. `middle` is an alias for `center`.

`/gloss board reset [name=*]` rewrites defaults over whatever is on disk. Use `default` or
`animation-showcase` for one file; `*` restores both. It requires `gloss.boards.edit`.

> `/gloss board reset` overwrites the selected included board files without a backup. Boards you created yourself are not defaults. The command never touches them.
{.is-warning}

## Selection order

Every board with true `show` and `select.when` conditions is a candidate. The highest priority wins; ties use the lexicographically smallest ID. The same rule selects a presentation variant. If no board matches, the player sees no Gloss sidebar.

Gloss reevaluates selection every `[boards] updateIntervalTicks` (default 20) and after relevant player or document changes. See [Expressions & Placeholders](/gloss/13-expressions-placeholders#conditional-documents) for condition syntax.

### Manual selection

`/gloss board show <id>` pins a board until the player logs out; `/gloss board hide` pins no board.
Pinning bypasses `select.when` but not `show`, and the pinned board still re-evaluates its `show`
condition and variants on each selection pass. The pin is also dropped if that board is deleted. See
[Show conditions](/gloss/13-expressions-placeholders#show-conditions).

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

Sidebars update at `[boards] updateIntervalTicks` (default 20). On a board with a clock expression or named animation, only the rows carrying one update every tick; the other dynamic rows keep the configured interval.

Titles and lines support functions, PlaceholderAPI, emoji, colors, and viewer expressions. Minecraft displays at most 15 sidebar rows. Newlines inside one JSON row become spaces.

Use `align(text, width, mode)` for character-cell alignment. Modes are `left`, `center`, `middle`, and `right`; `middle` is an alias for `center`. Formatting codes do not count toward width.

`"hideNumbers": true` removes the red score column without changing the internal 15-to-1 values that
keep the rows ordered.

With `[features] boards = false`, no Gloss sidebar renders. Board documents remain editable.

The web editor can edit board selection, the base presentation, and complete variants.

## Groups

Gloss has no group files or `/gloss group` command. It reads the player's current primary group from
Vault, trimmed and lowercased, and exposes it as `viewer.group`, `subject.group`, `source.group`
where that role is a player, and through `inGroup(role, name)`.

Without Vault, with `[groups] useVault = false` (default `true`), or with no Vault permission
provider registered, the group value is empty and `inGroup` is false. Other conditions such as
`viewer.op`, permissions, world and health are unaffected. Changing `[groups] useVault` applies on
reload.

Gloss ignores schema-1 board documents: rewrite custom files as schema 2, or use `/gloss board reset`
for a bundled default. See [Data Files & Hot Reload](/gloss/03-data-files).
