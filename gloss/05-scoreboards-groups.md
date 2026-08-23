---
title: "Scoreboards & Groups"
description: "Gloss documentation: Scoreboards & Groups"
published: true
date: 2026-08-23T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Scoreboards are enveloped JSON documents in `plugins/Gloss/boards/`. One file is one board. The file name is the board id. Each player gets at most one board. Gloss picks it from the board own `groups`, `permission` and `primary` fields. Groups are no longer files. Gloss reads the player primary group live from Vault and nothing else.

## The board document

`plugins/Gloss/boards/staff.json`:

```json
{
  "schemaVersion": 1,
  "revision": 7,
  "title": "&d&lStaff",
  "lines": [
    "&7Player: &f{{ player.name }}",
    "&7Online: &f{{ server.online }}/{{ server.maxPlayers }}",
    "&7TPS: &f{{ fixed(server.tps, 1) }}"
  ],
  "primary": false,
  "hideNumbers": true,
  "permission": "staff",
  "groups": ["admin", "moderator"]
}
```

| Key | Default | Notes |
|---|---|---|
| `schemaVersion` | required | Must be `1`. Anything else rejects the file with `unsupported boards schemaVersion: <n>` |
| `revision` | required | `1` to `9007199254740991`. Gloss owns this value and bumps it by one on every write it makes |
| `title` | `""` | An empty title falls back to the board id. Rendered per player, then fitted to 32 UTF-16 units without splitting a character or colour sequence |
| `lines` | `[]` | Sidebar lines. A `null` entry becomes an empty string. At most 15 render; each is a single non-wrapping row fitted into Minecraft's 16-unit team prefix and 16-unit suffix |
| `primary` | `false` | Marks this board as the last-resort board for everyone |
| `hideNumbers` | `false` | Uses Minecraft's blank number format so 1.20.3+ clients do not draw the red 15..1 score column |
| `permission` | `"default"` | Trimmed and lowercased. Empty or absent becomes `default`, which means ungated |
| `groups` | `[]` | Group names, trimmed, lowercased and de-duplicated in place |

There is no `id` key. The document id is the file name with `.json` removed. If you rename the file, you rename the board. Only files directly inside `boards/` are read. Subfolders are ignored.

A document that fails to parse is logged as `boards/<id>.json: <reason>` and skipped. The copy Gloss already holds stays live. A deleted file removes the board. Any player currently on it loses their sticky selection and is re-evaluated.

### Shipped defaults

`boards/default.json` and `boards/animation-showcase.json` are extracted when missing, and only
while `[features] boards` is on. With the feature off there is no `boards/` folder at all; turning
it on extracts both defaults on that reload. The ordinary default is:

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "title": "&d&lGloss",
  "lines": [
    "&fWelcome!",
    "&7Edit boards/default.json",
    "&7or create your own board."
  ],
  "primary": false,
  "permission": "default",
  "groups": []
}
```

Note `"primary": false`. Out of the box nothing selects this board. No player sees a sidebar until you set `primary`, add a `groups` entry or set a `permission` someone holds.

`animation-showcase.json` provides one bounded row for each shipped animation effect:

```json
{
  "schemaVersion": 1,
  "revision": 1,
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
    "{{ wave('WAVE', ['&a', '&7'], floor(time.seconds * 4)) }}"
  ],
  "primary": false,
  "hideNumbers": true,
  "permission": "default",
  "groups": []
}
```

The board is deliberately not primary. Its rainbow row uses compact legacy colors because a full
RGB prefix consumes a scoreboard team's carried suffix before any visible letters fit. Use `/gloss
board show animation-showcase` to inspect it without changing automatic selection, or edit its
selection fields normally.

`/gloss board reset [name=*]` rewrites shipped defaults over whatever is on disk. Use `default` or
`animation-showcase` for one file; `*` restores both. It requires `gloss.boards.edit`.

> `/gloss board reset` overwrites the selected shipped board files without a backup. Boards you created yourself are not shipped defaults. The command never touches them.
{.is-warning}

## Selection order

A player board is chosen by `BoardService.selectBoardId`. Gloss evaluates every loaded board sorted by document id:

1. **Group** — the first board whose `groups` array contains the player primary group. Skipped entirely when the player has no primary group (see [Groups](#groups)).
2. **Permission** — the first board whose `permission` is not `default` and whose node `gloss.board.<permission>` the player holds.
3. **Primary** — the first board with `"primary": true`.
4. Otherwise the player gets no sidebar.

Each step is a separate full pass over the sorted board list. A group match on a late-sorting board still beats a permission match on an early-sorting one.

`permission` gates every step, not just step 2. A board whose `permission` is not `default` is only ever handed to a player who holds `gloss.board.<permission>`. That is true whether it was reached through its group list, through the permission pass, or as the primary board. A candidate the player is not permitted to see is skipped. The pass continues to the next board. A board left at `permission: "default"` is ungated and therefore passes every step. It is never *selected* by step 2. Step 2 exists only to pick gated boards.

That makes the two restriction styles compose. List a board under `groups` to target it. Set `permission` to restrict it. Use both together to give one group a board that only its permitted members see. If a gated board is the only primary board, a player without the node gets no sidebar at all. Gloss does not show a board they are not entitled to.

> The gating node is `gloss.board.<permission>` — singular `board`. The command permissions are `gloss.boards.*` — plural. A grant of `gloss.boards` does not grant any board view gate. The `gloss.board.*` nodes are dynamic. They are not declared in `plugin.yml`.
{.is-warning}

Selection runs one tick after the plugin enables, on `PlayerJoinEvent`, on `PlayerChangedWorldEvent`, on `/gloss reload`, and whenever a board file is added, changed or removed. It does not run on a timer. A Vault group change mid-session does not move a player sidebar until one of those triggers fires. A relog is the simplest.

### Manual selection

`/gloss board show <id>` and `/gloss board hide` override the automatic pick and mark the player sticky. A sticky player is skipped by every later automatic re-selection. That includes world changes and file reloads. They are simply re-synced to what they already have. Sticky state is dropped when the player quits, or when the board they are showing is deleted. After that, automatic selection resumes.

`/gloss board hide` is also sticky. It leaves the player with no board and no automatic re-selection until they log out.

## Editing by command

```
/gloss board create scoreboard
/gloss board title scoreboard "&d&lMy Server"
/gloss board addline scoreboard "&7Online: &f%server_online%"
/gloss board permission scoreboard staff
/gloss board primary scoreboard false
```

| Node | Arguments | Permission |
|---|---|---|
| `create` | `<id>` | `gloss.boards.create` |
| `delete` | `<id>` | `gloss.boards.delete` |
| `title` | `<id> <text>` | `gloss.boards.edit` |
| `addline` | `<id> <text>` | `gloss.boards.edit` |
| `setline` | `<id> <line> <text>` | `gloss.boards.edit` |
| `removeline` | `<id> <line>` | `gloss.boards.edit` |
| `primary` | `<id> [enabled=true]` | `gloss.boards.edit` |
| `permission` | `<id> <node>` | `gloss.boards.edit` |
| `reset` | `[name=*]` | `gloss.boards.edit` |
| `show` | `<id>` | `gloss.boards.show` |
| `hide` | none | `gloss.boards.hide` |
| `list` | none | none |
| `info` | `<id>` | none |

Required arguments are positional in the order shown. Optional arguments must be written as `key=value`. Line numbers start at 1. An out-of-range number is rejected with the current line count. `show` and `hide` are player-only. Every node is reachable as `/gloss board ...`, through the aliases `/gloss boards`, `/gloss sb` and `/gloss bd`, and through the root command `/board` (aliases `sb`, `bd`).

`create` makes a board titled `&d<id>` with the single line `&7A fresh Gloss board`. Ids are trimmed and spaces become dashes. `/`, `\` and `..` are rejected.

`/gloss board permission <id> default` clears the gate. Any other value is stored lowercased and becomes the `gloss.board.<value>` requirement.

There is **no command that edits a board `groups` array**. Group assignment is a file-only field. Edit the JSON and the change hot-reloads. `/gloss board info` likewise reports the title, lines, `primary` and `permission`. It does not report `groups`.

Every command edit rewrites the document with `revision` bumped by one, through an atomic temp-file rename. The watcher compares each changed file SHA-256 against the hash Gloss just wrote. A command edit never bounces back through the hot-reload path. See [Data Files & Hot Reload](/gloss/03-data-files).

## Rendering

Ordinary sidebars use `[boards] updateIntervalTicks` (default 20, clamped 1..200). An actively selected board containing a clock-driven expression (`time.ms`, `time.seconds` or `time.ticks`) or a complete `|animation.<id>|` token moves to a separate every-tick driver, so it can display authored animation at up to 20 FPS. Static boards and boards containing only player, server, metric or PlaceholderAPI values stay on the ordinary driver even while another player watches an animated board. Rendered rows are change-deduplicated before they reach the client.

Title and lines both go through the full text pipeline with the viewing player as the resolution context. Functions, PlaceholderAPI placeholders, emoji and colors all work per player. Fitting happens after that pipeline: the title has a 32-UTF-16-unit wire limit, and each row uses a 16-unit team prefix plus a 16-unit suffix with its active colour state carried into the suffix. Colour codes consume that budget. CRLF, CR, LF and Unicode line separators become one space, so one JSON entry cannot wrap into multiple client rows. Surrogate pairs, legacy colour pairs and complete legacy RGB runs are never cut in half. At most 15 rows render; the rest are dropped.

`"hideNumbers": true` applies Minecraft's blank score number format per board on native 1.20.3+
servers and clients. It removes the red score column without changing the internal 15-to-1 values
that keep the rows ordered. On a server older than 1.20.3, ViaVersion's global
`hide-scoreboard-numbers: true` option provides the equivalent translation for 1.20.3+ clients;
that ViaVersion setting affects every scoreboard on the server rather than one Gloss document.

With `[features] boards = false` the driver is never created. No player sees a sidebar. Documents still load, hot-reload and stay editable by command. If the driver itself fails to construct, Gloss logs `Sidebar driver unavailable: <reason>` and runs without sidebars.

Boards are editable in the Gloss web editor. Its inspector exposes title, lines, selection rules and
the number-visibility toggle, and its Minecraft-style preview hides the score column when the
document does. Server sync carries the board JSON as a first-class document kind.

## Groups

Gloss has no group files. The `groups/` YAML directory is retired. There is no `/gloss group` command. Nothing about a group is configured inside Gloss. `GroupService` is a thin live resolver:

- With `[groups] useVault = true` (the default) and Vault installed, Gloss asks the registered Vault `Permission` provider for the player primary group. It trims it and lowercases it.
- The answer is cached per player for **5 seconds**, then re-asked. The cache entry is dropped when the player quits. The whole cache is cleared on `/gloss reload`.
- Any failure inside the Vault provider is swallowed and treated as "no group".

The resolved name is what board `groups` arrays and tablist `nameFormats` keys are matched against. That is why both are lowercased when they are loaded.

### Without Vault

If Vault is not installed, or `[groups] useVault = false`, or Vault has no permission provider registered, **no player has a group at all** — operators included. Concretely:

- Step 1 of board selection never matches. Boards fall through to their `permission` node and then to `primary`.
- Tablist `nameFormats` group keys never match. The `_op` key and then `default` decide the list name.

The `_op` key in the tablist document is the one operator-specific behavior that survives. It is keyed off the server own op flag rather than Vault. It keeps working with no permissions plugin at all. See [Tablist & Server List MOTD](/gloss/06-tablist-motd).

If Vault is present but the hook fails to construct, Gloss logs `Vault permission hook failed to initialize: <reason>` and behaves as though Vault were absent. If you enable `[groups] useVault` on a reload, Gloss re-attempts the hook. If you disable it, Gloss stops resolving groups at once. The already-hooked provider stays in place until the next restart.

## Coming from the pre-merge layout

`/gloss import legacy` retires `plugins/Gloss/groups/` in place. For each `groups/<name>.yml`:

- a non-blank `default-board` appends the lowercased group name to that board `groups` array, which is how per-group board assignment moved into the board document
- a non-blank `tablist-name` becomes a `nameFormats` entry in the tablist document. See [Tablist & Server List MOTD](/gloss/06-tablist-motd).

When every group file is absorbed cleanly the whole `groups/` directory is moved into `import-backups/<timestamp>/groups`. A file that errors leaves the directory in place so nothing is lost. Full details are in [Data Files & Hot Reload](/gloss/03-data-files).
