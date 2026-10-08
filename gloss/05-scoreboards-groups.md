---
title: "Scoreboards & Groups"
description: "Create conditional scoreboards and select them by player or Vault group"
published: true
date: 2026-10-08T14:17:00Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

For proxy tablists, scoreboards, surfaces, connection messages, and MOTD management, see [Velocity Proxy](/gloss/27-velocity). The instructions below cover the server edition.

Each schema-2 JSON file in `plugins/Gloss/boards/` defines one scoreboard. Conditions select a board and its presentation for each player. Vault group names are available to those conditions when Vault is installed.

For conditional action bars, boss bars, and titles, see [Screen Surfaces](/gloss/06c-screen-surfaces).

`/gloss web edit scoreboard <id>` opens one board in a restricted live editor session;
`/gloss web workspace` includes every board.

In the editor, expand **Row settings** beneath a row to set its stable ID, visibility condition, score value, score format, or section reference. Editing the label preserves these settings. Use **Reusable sections** to add, rename, or remove named row lists; renaming updates references throughout that presentation. **Rotating pages** edits each page’s ID, condition, duration, title inheritance, rows, and rotation order. Removing a referenced section leaves a validation error until its references are updated. **Layout policy** selects truncation or overflow rejection and overrides title, text, and value intervals independently. These controls are available for the default presentation and every variant. **Native objectives** enables and configures player-list and below-name slots, including viewer and subject conditions, formats, refresh intervals, and conflict policies. Unknown properties survive editing, export, and undo. The sidebar preview expands sections and rotates eligible pages against the selected viewer context and the browser clock. Native player-list and below-name placement is controlled by Minecraft and is not rendered in the sidebar preview.

## The board document

<div class="gloss-demo" data-demo="scoreboard-editor">
<p><strong>Scoreboard authoring</strong> Browser editor. Silent capture. Browser editing and previews; game rendering is shown in the Minecraft client clips.</p>
<video src="/gloss-assets/demos/scoreboard-editor.webm" aria-label="Scoreboard authoring, browser editor" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

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
| `objectives` | `{}` | Optional native `playerList` and `belowName` score displays for the selected board |

Every presentation has `title`, `lines`, `hideNumbers`, and optional `layout`. An explicitly empty title stays blank.
At most 15 visible lines render. A variant presentation is complete and never inherits a title,
line or number policy from the base.

There is no `id` key. The document id is the file name with `.json` removed. If you rename the file, you rename the board. Only files directly inside `boards/` are read. Subfolders are ignored.

If an edit is invalid, Gloss logs the reason and keeps the last valid version active. Deleting a file removes that board.

### Per-line score formats

A line may be a text string or an object such as
`{"text": "Balance", "value": "&a$100", "format": "fixed"}`. The `text` and `value` fields use
the text pipeline. Values refresh even when the label and row order stay unchanged. Explicit line
formats override `hideNumbers` for that row; removing a line format restores the presentation's
number-visibility policy.

| `format` | Score column |
|---|---|
| `blank` | Empty |
| `fixed` | The rendered `value` text |
| `styled` | The numeric row score with the formatting from `value`, for example `"&c"` for red |
| `number` | The numeric row score with default formatting |

Without an explicit format, an object with a `value` uses `fixed`; a plain line follows the
presentation's `hideNumbers` setting. The numeric row score determines line order; `styled` and
`number` do not replace it with the contents of `value`.

### Conditional rows, sections, and pages

Object rows also accept `id` and `show`. Give a row a unique `id` to keep its client entry stable
when earlier rows disappear or the same row moves between pages. Without an ID, identity follows
its expanded position before visibility filtering; hiding a preceding row does not change that identity.
`show` defaults to `true`; use `true` or `false` for fixed visibility, or the same viewer conditions
as board selection for changing visibility. Hidden rows consume no sidebar space.

`presentation.layout.sections` defines reusable lists within that presentation. Insert one with
`{"section":"account"}`; a reference may also have `show`, which gates all its rows. References
cannot declare their own text, value, format, or ID. Sections may reference other sections, but
cycles, unknown references, and duplicate explicit row IDs within an expanded page are rejected.

```json
{
  "title": "&dOverview",
  "hideNumbers": true,
  "lines": [{"section": "account"}],
  "layout": {
    "sections": {
      "account": [
        {"id": "name", "text": "&f{{ player.name }}"},
        {"id": "balance", "text": "Balance", "value": "%vault_eco_balance_formatted%"},
        {"id": "staff", "text": "&6Staff online", "show": "viewer.op"}
      ]
    },
    "pages": [
      {"id": "account", "durationTicks": 100, "lines": [{"section": "account"}]},
      {"id": "server", "title": "&bServer", "durationTicks": 60,
       "show": "viewer.world == 'world'", "lines": ["Online: {{ server.online }}"]}
    ],
    "overflow": "truncate",
    "refresh": {"titleTicks": 20, "textTicks": 20, "valueTicks": 5}
  }
}
```

Pages rotate in authored order through the pages whose `show` conditions match. Each page has a
unique `id`, `lines`, optional `title`, and `durationTicks` (default 100; range 1–72000). An omitted
page title uses the presentation title. Timing follows the server's running clock; viewers with
the same eligible pages see the same rotation. If no page matches, the presentation's base lines
appear. Pages inherit the presentation's sections, number policy, overflow policy, and refresh
intervals. Variants keep their own complete layouts.

| Layout key | Default | Behavior |
|---|---|---|
| `sections` | `{}` | Up to 64 named reusable line lists |
| `pages` | `[]` | Up to 64 timed pages; no pages uses the base lines |
| `overflow` | `"truncate"` | `truncate` shows the first 15 visible rows. `error` rejects a document with more than 15 expanded rows on any page, including conditional rows |
| `refresh.titleTicks` | automatic | Independent title sampling interval, 1–72000 ticks |
| `refresh.textTicks` | automatic | Independent row-label sampling interval, 1–72000 ticks |
| `refresh.valueTicks` | automatic | Independent score-value sampling interval, 1–72000 ticks |

A line list may contain at most 256 entries and each page may expand to at most 256 rows. Row,
section, and page IDs contain 1–64 letters, digits, dots, underscores, or hyphens and start with a
letter or digit. The same explicit row ID may appear on different pages. An explicit refresh
interval also controls animated text in that column. With no override, animated text updates each
tick and other dynamic text uses `[boards] updateIntervalTicks`. Static text does not need repeated
placeholder evaluation. Conditional rows and rotating pages update each tick.

### Native player-list and below-name scores

Add `objectives.playerList` or `objectives.belowName` beside `presentation` to display native
scores for online players. Minecraft provides one player-list objective and one below-name
objective per viewer, alongside the sidebar. Scores use real player usernames as entries.
The client controls their placement, visibility distance, and rendering; below-name scores are
attached to player nameplates, and player-list scores appear in the tab overlay.

```json
"objectives": {
  "playerList": {
    "title": "Points",
    "value": "papiNumber('subject', '%points_total%', 0)",
    "renderType": "integer",
    "format": "number",
    "show": true,
    "subjects": "hasPermission('subject', 'example.scores.visible')",
    "refreshTicks": 20,
    "conflict": "yield"
  },
  "belowName": {
    "title": "Health",
    "value": "subject.health",
    "renderType": "hearts",
    "refreshTicks": 5,
    "conflict": "yield"
  }
}
```

| Objective key | Default | Behavior |
|---|---|---|
| `title` | `""` | Title text, rendered for the viewer; the native display slot determines where it is visible |
| `value` | `"subject.health"` | Numeric expression evaluated for each online subject; rounds to the nearest integer and clamps to the signed 32-bit score range |
| `renderType` | `"integer"` | Native `integer` or `hearts` rendering; the client controls support and appearance in each slot |
| `format` | `"number"` | `number`, `blank`, `fixed`, or `styled`, with the same number-format meanings as sidebar rows |
| `valueText` | `""` | Text for `fixed` or styling for `styled`, rendered for the subject |
| `show` | `true` | Viewer condition controlling whether this objective is displayed |
| `subjects` | `true` | Condition evaluated for each subject; false removes that subject's score |
| `refreshTicks` | `20` | Subject-value and viewer-title sampling interval, 1–72000 ticks |
| `conflict` | `"yield"` | `yield` leaves an occupied native display slot alone; `override` explicitly replaces it and restores the last observed foreign objective on release if it still exists |

Subject expressions and `valueText` use that subject as the player context. Scores are sampled
independently of viewers, so they do not vary by viewer. Use `show` to vary objective visibility and
`subjects` to control which players publish values. Identical sources share sampling across boards.
Invalid or nonfinite subject values are logged and that subject's score is removed until a valid
sample arrives. Scores disappear when their subjects disconnect.

Native objectives follow the selected board, including its visibility and proxy ownership. Hiding
or replacing that board releases its native objectives. If the platform cannot report an existing
slot and Gloss has not observed a display-slot packet, `yield` waits until ownership is known.
`override` can claim that slot, but an unobserved prior objective cannot be restored. Objective
definitions remain independent of sidebar presentation variants and pages.

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

Command edits save the document and increment its revision. Changes to inherited values in `presets.json` also update active sidebars, including titles, without changing the board document's revision. Rows with unchanged IDs retain their scoreboard slots across these updates. See [Data Files & Hot Reload](/gloss/03-data-files).

## Rendering

Sidebars update at `[boards] updateIntervalTicks` (default 20). Without explicit layout refresh intervals, a board with a clock expression or named animation refreshes that text every tick; other dynamic text keeps the configured interval. Title, label, and value intervals can be set separately in the presentation layout. Pages, row conditions, explicit refresh intervals and native objectives retain their cadence when text functions are disabled.

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
