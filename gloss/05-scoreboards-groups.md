---
title: "Scoreboards & Groups"
description: "Gloss documentation: Scoreboards & Groups"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---
Scoreboards are enveloped JSON documents in `plugins/Gloss/boards/`, one file per board, and the file
name is the board id. Each player gets at most one board, picked automatically from the board's own
`groups`, `permission` and `primary` fields. Groups are no longer files: Gloss reads the player's
primary group live from Vault and nothing else.

## The board document

`plugins/Gloss/boards/staff.json`:

```json
{
  "schemaVersion": 1,
  "revision": 7,
  "title": "&d&lStaff",
  "lines": [
    "&7Online: &f%server_online%",
    "&7World: &f%player_world%"
  ],
  "primary": false,
  "permission": "staff",
  "groups": ["admin", "moderator"]
}
```

| Key | Default | Notes |
|---|---|---|
| `schemaVersion` | required | Must be `1`. Anything else rejects the file with `unsupported boards schemaVersion: <n>` |
| `revision` | required | `1` to `9007199254740991`. Gloss owns this value and bumps it by one on every write it makes |
| `title` | `""` | An empty title falls back to the board id. Rendered per player, then truncated to 32 characters |
| `lines` | `[]` | Sidebar lines. A `null` entry becomes an empty string. At most 15 render |
| `primary` | `false` | Marks this board as the last-resort board for everyone |
| `permission` | `"default"` | Trimmed and lowercased. Empty or absent becomes `default`, which means ungated |
| `groups` | `[]` | Group names, trimmed, lowercased and de-duplicated in place |

There is no `id` key. The document id is the file name with `.json` removed, so renaming the file renames
the board. Only files directly inside `boards/` are read; subfolders are ignored.

A document that fails to parse is logged as `boards/<id>.json: <reason>` and skipped, and the copy Gloss
already holds stays live. A file that is deleted removes the board; any player currently on it loses their
sticky selection and is re-evaluated.

### The shipped default

`boards/default.json` is extracted on first run when it is missing:

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

Note `"primary": false`. Out of the box nothing selects this board, so no player sees a sidebar until you
set `primary`, add a `groups` entry or set a `permission` someone holds.

`/gloss board reset [name=*]` rewrites the shipped defaults over whatever is on disk. `default` is the
only board Gloss ships, so `*` and `default` do the same thing. It requires `gloss.boards.edit`.

> `/gloss board reset` overwrites `boards/default.json` without a backup. Boards you created yourself are
> not shipped defaults and are never touched by it.
{.is-warning}

## Selection order

A player's board is chosen by `BoardService.selectBoardId`, evaluated against every loaded board sorted
by document id:

1. **Group** — the first board whose `groups` array contains the player's primary group. Skipped entirely
   when the player has no primary group (see [Groups](#groups)).
2. **Permission** — the first board whose `permission` is not `default` and whose node
   `gloss.board.<permission>` the player holds.
3. **Primary** — the first board with `"primary": true`.
4. Otherwise the player gets no sidebar.

Each step is a separate full pass over the sorted board list, so a group match on a late-sorting board
still beats a permission match on an early-sorting one.

`permission` gates every step, not just step 2. A board whose `permission` is not `default` is only
ever handed to a player holding `gloss.board.<permission>`, whether it was reached through its group
list, through the permission pass, or as the primary board — a candidate the player is not permitted
to see is skipped and the pass continues to the next board. A board left at `permission: "default"` is
ungated and therefore passes every step, but is never *selected* by step 2, which exists only to pick
gated boards.

That makes the two restriction styles compose: list a board under `groups` to target it, set
`permission` to restrict it, and use both together to give one group a board that only its permitted
members see. If a gated board is the only primary board, a player without the node gets no sidebar at
all rather than being shown a board they are not entitled to.

> The gating node is `gloss.board.<permission>` — singular `board`. The command permissions are
> `gloss.boards.*` — plural. Granting `gloss.boards` does not grant any board's view gate, and the
> `gloss.board.*` nodes are dynamic, so they are not declared in `plugin.yml`.
{.is-warning}

Selection runs one tick after the plugin enables, on `PlayerJoinEvent`, on `PlayerChangedWorldEvent`, on
`/gloss reload`, and whenever a board file is added, changed or removed. It does not run on a timer, so a
Vault group change mid-session does not move a player's sidebar until one of those triggers fires — a
relog is the simplest.

### Manual selection

`/gloss board show <id>` and `/gloss board hide` override the automatic pick and mark the player sticky.
A sticky player is skipped by every later automatic re-selection, including world changes and file
reloads; they are simply re-synced to what they already have. Sticky state is dropped when the player
quits, or when the board they are showing is deleted, after which automatic selection resumes.

`/gloss board hide` is also sticky. It leaves the player with no board and no automatic re-selection until
they log out.

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

Required arguments are positional in the order shown; optional arguments must be written as `key=value`.
Line numbers start at 1 and an out-of-range number is rejected with the current line count. `show` and
`hide` are player-only. Every node is reachable as `/gloss board ...`, through the aliases
`/gloss boards`, `/gloss sb` and `/gloss bd`, and through the root command `/board` (aliases `sb`, `bd`).

`create` makes a board titled `&d<id>` with the single line `&7A fresh Gloss board`. Ids are trimmed and
spaces become dashes; `/`, `\` and `..` are rejected.

`/gloss board permission <id> default` clears the gate. Any other value is stored lowercased and becomes
the `gloss.board.<value>` requirement.

There is **no command that edits a board's `groups` array**. Group assignment is a file-only field — edit
the JSON and the change hot-reloads. `/gloss board info` likewise reports the title, lines, `primary` and
`permission`, but not `groups`.

Every command edit rewrites the document with `revision` bumped by one, through an atomic temp-file
rename. The watcher compares each changed file's SHA-256 against the hash Gloss just wrote, so a command
edit never bounces back through the hot-reload path. See
[Data Files & Hot Reload](/gloss/03-data-files).

## Rendering

The sidebar is driven by VolmLib's board manager on the `[boards] updateIntervalTicks` cadence (default
20, clamped 1..200). Changing that interval on reload tears down the driver and rebuilds it.

Title and lines both go through the full text pipeline with the viewing player as the resolution context,
so functions, PlaceholderAPI placeholders, emoji and colors all work per player. The rendered title is
then truncated to 32 characters; color codes count toward that limit. At most 15 lines render and the
rest are dropped.

With `[features] boards = false` the driver is never created and no player sees a sidebar. Documents still
load, hot-reload and are still editable by command. If the driver itself fails to construct, Gloss logs
`Sidebar driver unavailable: <reason>` and runs without sidebars.

Boards are not part of the web editor. `EditorSyncKind` only carries `menu` and `panel`, so boards are
edited by command or by file.

## Groups

Gloss has no group files. The `groups/` YAML directory is retired, there is no `/gloss group` command,
and nothing about a group is configured inside Gloss. `GroupService` is a thin live resolver:

- With `[groups] useVault = true` (the default) and Vault installed, Gloss asks the registered Vault
  `Permission` provider for the player's primary group, trims it and lowercases it.
- The answer is cached per player for **5 seconds**, then re-asked. The cache entry is dropped when the
  player quits, and the whole cache is cleared on `/gloss reload`.
- Any failure inside the Vault provider is swallowed and treated as "no group".

The resolved name is what board `groups` arrays and tablist `nameFormats` keys are matched against, which
is why both are lowercased when they are loaded.

### Without Vault

If Vault is not installed, or `[groups] useVault = false`, or Vault has no permission provider registered,
**no player has a group at all** — operators included. Concretely:

- Step 1 of board selection never matches, so boards fall through to their `permission` node and then to
  `primary`.
- Tablist `nameFormats` group keys never match, so the `_op` key and then `default` decide the list name.

The `_op` key in the tablist document is the one operator-specific behaviour that survives, and it is
keyed off the server's own op flag rather than Vault, so it keeps working with no permissions plugin at
all. See [Tablist & Server List MOTD](/gloss/06-tablist-motd).

If Vault is present but the hook fails to construct, Gloss logs
`Vault permission hook failed to initialize: <reason>` and behaves as though Vault were absent. Enabling
`[groups] useVault` on a reload re-attempts the hook; disabling it stops resolving groups immediately but
leaves the already-hooked provider in place until the next restart.

## Coming from the pre-merge layout

`/gloss import legacy` retires `plugins/Gloss/groups/` in place. For each `groups/<name>.yml`:

- a non-blank `default-board` appends the lowercased group name to that board's `groups` array, which is
  how per-group board assignment moved into the board document;
- a non-blank `tablist-name` becomes a `nameFormats` entry in the tablist document — see
  [Tablist & Server List MOTD](/gloss/06-tablist-motd).

When every group file is absorbed cleanly the whole `groups/` directory is moved into
`import-backups/<timestamp>/groups`. A file that errors leaves the directory in place so nothing is lost.
Full details are in [Data Files & Hot Reload](/gloss/03-data-files).
