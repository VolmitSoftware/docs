---
title: "Tablist & Server List MOTD"
description: "Gloss documentation: Tablist & Server List MOTD"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---
The tablist header, footer and per-group list names live in the single document
`plugins/Gloss/tablist.json`. The server list MOTD lives in `plugins/Gloss/motd.json`. Both are enveloped
JSON, both hot-reload from disk, and neither has any content left in `config.toml` — the only tablist knob
still in the config file is its refresh interval.

## The tablist document

`plugins/Gloss/tablist.json`:

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "useHeaderFooter": true,
  "header": "&d&lGloss",
  "footer": "&7VolmitSoftware.com",
  "groupListNames": true,
  "nameFormats": {
    "default": "$player",
    "_op": "&6$player",
    "moderator": "&9[Mod] &f$player"
  }
}
```

| Key | Default | Notes |
|---|---|---|
| `schemaVersion` | required | Must be `1`. Anything else rejects the file with `unsupported tablist schemaVersion: <n>` |
| `revision` | required | `1` to `9007199254740991` |
| `useHeaderFooter` | `true` | When false, Gloss never touches the header or footer |
| `header` | `""` | Rendered per player through the text pipeline |
| `footer` | `""` | Rendered per player through the text pipeline |
| `groupListNames` | `true` | When false, Gloss never touches list names and restores any it applied |
| `nameFormats` | `{}` | Map of group key to list-name template |

This is a single file at the root of the data folder, not a folder of documents. It is extracted on first
run when missing, and `/gloss tablist reset` rewrites it from the shipped copy (permission
`gloss.tablist.reset`).

If the file is missing or fails to parse at startup, Gloss falls back to built-in defaults:
`useHeaderFooter` true, header `&d&lGloss`, footer `&7VolmitSoftware.com`, `groupListNames` true, and
`nameFormats` of `default` to `$player` and `_op` to `&6$player`. If a runtime edit fails to parse, the
last good document stays live. Either way the failure is logged as `tablist/tablist.json: <reason>` —
that prefix is the document kind and file name, not the path on disk, which is
`plugins/Gloss/tablist.json`.

> `nameFormats` keys are trimmed and **lowercased when the document loads**. A key written as `Moderator`
> or `ADMIN` becomes `moderator` and `admin` on load. Vault group names are also lowercased before the
> match, so a mixed-case key still matches — but write keys in lowercase so that what is on disk matches
> what is in memory. Blank keys are dropped entirely.
{.is-info}

### List name resolution

For each player, `TablistService.chooseListName` picks exactly one template, in this order:

1. **`_op`** — if the player is an operator **and** `nameFormats` contains the key `_op`. This is checked
   before any group and is keyed off the server's own op flag, so it works with no permissions plugin
   installed.
2. **The player's group** — the player's Vault primary group, lowercased, if `nameFormats` contains that
   key. Skipped when the player has no primary group; see
   [Scoreboards & Groups](/gloss/05-scoreboards-groups).
3. **`default`** — if `nameFormats` contains the key `default`.
4. **`$player`** — the built-in fallback when there is no `default` key at all.

An operator whose group also has a format never sees the group format: `_op` wins. Remove the `_op` key if
you want operators to follow their group.

Once a template is picked, `$player` and `$group` are substituted literally, and the result is then run
through the full text pipeline (functions, PlaceholderAPI, emoji, colors) with the player as the
resolution context.

| Token | Substituted with |
|---|---|
| `$player` | The player's name |
| `$group` | The resolved group name — but see below |

When the `_op` branch is taken, `$group` substitutes to the literal string `_op`, not to the player's real
group. When the `default` branch or the built-in fallback is taken, `$group` substitutes to the player's
group if they have one and to an empty string if they do not.

A template that renders to blank clears the player's list name back to vanilla. List names are only re-sent
to the client when the rendered value actually changed.

### Header and footer

The header and footer are rendered per player through the same pipeline, so PlaceholderAPI placeholders
resolve for the viewer. They are re-sent only when the rendered pair changes.

`$player` and `$group` are **not** substituted in `header` or `footer`. Those tokens exist only in
`nameFormats`. Use a PlaceholderAPI placeholder such as `%player_name%` instead.

Other plugins can override both per player through `GlossAPI.setTab(player, header, footer)` and clear the
override with `resetTab(player)`. An override replaces the document's header and footer as a pair and is
only consulted while `useHeaderFooter` is true. Overrides are dropped when the player quits. See
[API: Getting Started](/gloss/21-api-getting-started).

### Configuration and lifecycle

| Key | Default | Range |
|---|---|---|
| `[features] tablist` | `true` | Enables header/footer and list-name management |
| `[tablist] updateIntervalTicks` | `40` | 1..400 |

Every cycle the driver walks the online players and applies to each one on that player's own region
thread, so it is Folia-safe. Changing the interval restarts the driver on reload.

Turning things off cleans up after itself:

- `[features] tablist = false` stops the driver and, on reload, resets any header/footer Gloss applied to
  empty and any list name it applied back to vanilla.
- `useHeaderFooter: false` resets applied headers and footers on the next document reload.
- `groupListNames: false` resets applied list names on the next document reload.
- On plugin disable, headers and footers are cleared and list names are reset for every online player.

Editing `tablist.json` on disk applies without a reload. `[features] tablist` and
`[tablist] updateIntervalTicks` live in `config.toml`, which also hot-reloads, so an on-disk config edit
restarts the driver on its own; `/gloss reload` does the same.

The tablist document is not part of the web editor — it is edited by file or restored by
`/gloss tablist reset`.

## Server list MOTD

`plugins/Gloss/motd.json`:

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "entries": [
    { "lines": ["&dA glossy server"] },
    { "lines": ["&d&lMy Server", "&7Now with 100% more gloss"] }
  ]
}
```

| Key | Notes |
|---|---|
| `schemaVersion` | Must be `1`. Anything else rejects the file with `unsupported motd schemaVersion: <n>` |
| `revision` | `1` to `9007199254740991` |
| `entries` | At least one entry required, otherwise `motd document requires at least one entry` |
| `entries[].lines` | **1 or 2 lines. Zero lines or three or more is rejected outright** with `motd entry requires 1 to 2 lines` |

The two-line limit is the client's, not a style choice: the vanilla server list shows exactly two lines.
An entry's lines are joined with a newline when it is sent. There is no `\n`-in-a-string form any more;
write two array elements.

A document that violates either rule is refused as a whole. At startup that leaves the built-in default
(a single entry reading `&dA glossy server`) live; at runtime it leaves the last good document live. The
failure is logged as `motd/motd.json: motd entry requires 1 to 2 lines`, where the prefix is the document
kind and file name rather than the path on disk, which is `plugins/Gloss/motd.json`.

`/gloss motd reset` restores the shipped document (permission `gloss.motd.reset`).

### How a ping is answered

`[features] motd` defaults to **`false`**. Gloss extracts and hot-reloads `motd.json` either way, but it
only registers the ping listener when the feature is on.

With the feature on, Gloss listens on `ServerListPingEvent` at `EventPriority.LOWEST` and picks one entry
uniformly at random on every ping, so a multi-entry document rotates naturally without any timer. Because
it runs at the lowest priority, any other MOTD plugin that also handles the event runs later and wins.

The chosen text is rendered **statically**:

| Stage | Applies |
|---|---|
| `\|function\|` tokens, including `\|animation.<id>\|` | Yes |
| PlaceholderAPI placeholders | **No** |
| Emoji replacement | Yes |
| Colors — `[RRGGBB]` bracket hex, then `&` codes | Yes |

PlaceholderAPI is not resolved at ping time because there is no player to resolve it against. A server
list ping is answered before anyone joins; the client behind it is not a `Player` on this server, and
PlaceholderAPI needs a player to expand `%...%` against. `MotdService` therefore calls
`TextRenderer.renderStatic`, which runs the pipeline with a null viewer, and the pipeline's placeholder
stage is skipped whenever the viewer is null. Placeholder tokens written into an MOTD entry are sent to
the client verbatim.

Animation functions ignore the viewer and resolve from wall-clock time, so `|animation.rainbow|` does work
in an MOTD and will visibly cycle between pings. See
[Emoji, Text & Animations](/gloss/07-emoji-text-animations).

If rendering throws, Gloss logs `MOTD render failed: <reason>` once and leaves that ping's MOTD untouched.
The warning is armed again by the next reload.

Editing `motd.json` applies without a reload. Flipping `[features] motd` is a config change, which
hot-reloads on its own or on `/gloss reload`, and re-registers or unregisters the listener.

## Coming from the pre-merge layout

`/gloss import legacy` folds the old shapes into these two documents:

- Each `groups/<name>.yml` with a non-blank `tablist-name` becomes a `nameFormats` entry keyed by the
  lowercased file name. Existing keys in `tablist.json` are kept and the absorbed ones are merged over
  them, and the document's `revision` is bumped.
- `config.yml`'s `motd.texts` list becomes `entries`, splitting each string on newlines and truncating any
  entry longer than two lines. This runs **only** when `motd.json` is still byte-identical to the shipped
  default; a customised `motd.json` is left alone and the import records
  `motd.json was already customized; config.yml motd texts not applied`.

The originals are kept under `import-backups/<timestamp>/`. Full details are in
[Data Files & Hot Reload](/gloss/03-data-files).
