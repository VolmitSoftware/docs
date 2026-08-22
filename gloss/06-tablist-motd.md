---
title: "Tablist & Server List MOTD"
description: "Gloss documentation: Tablist & Server List MOTD"
published: true
date: 2026-08-22T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

The tablist header, footer and per-group list names live in the single document `plugins/Gloss/tablist.json`. The server list MOTD lives in `plugins/Gloss/motd.json`. Both are enveloped JSON. Both hot-reload from disk. Neither has any content left in `config.toml`. The only tablist knob still in the config file is its refresh interval.

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

This is a single file at the root of the data folder. It is not a folder of documents. It is extracted when missing, while `[features] tablist` is on. `/gloss tablist reset` rewrites it from the shipped copy (permission `gloss.tablist.reset`).

If the file is missing or fails to parse at startup, Gloss falls back to
built-in defaults. Those defaults are `useHeaderFooter` true, header
`&d&lGloss`, and footer `&7VolmitSoftware.com`. They also include
`groupListNames` true, plus `nameFormats` of `default` to `$player` and
`_op` to `&6$player`. If a runtime edit fails to parse, the last good
document stays live. Either way the failure is logged as
`tablist/tablist.json: <reason>`. That prefix is the document kind and
file name, not the path on disk. The path on disk is
`plugins/Gloss/tablist.json`.

> `nameFormats` keys are trimmed and **lowercased when the document loads**. A key written as `Moderator` or `ADMIN` becomes `moderator` and `admin` on load. Vault group names are also lowercased before the match. A mixed-case key still matches. Write keys in lowercase so that what is on disk matches what is in memory. Blank keys are dropped entirely.
{.is-info}

### List name resolution

For each player, `TablistService.chooseListName` picks exactly one template, in this order:

1. **`_op`** — if the player is an operator **and** `nameFormats` contains the key `_op`. This is checked before any group. It is keyed off the server own op flag. It works with no permissions plugin installed.
2. **The player's group** — the player Vault primary group, lowercased, if `nameFormats` contains that key. Skipped when the player has no primary group. See [Scoreboards & Groups](/gloss/05-scoreboards-groups).
3. **`default`** — if `nameFormats` contains the key `default`.
4. **`$player`** — the built-in fallback when there is no `default` key at all.

An operator whose group also has a format never sees the group format. `_op` wins. Remove the `_op` key if you want operators to follow their group.

Once a template is picked, `$player` and `$group` are substituted literally. The result is then run through the full text pipeline (functions, PlaceholderAPI, emoji, colors) with the player as the resolution context.

| Token | Substituted with |
|---|---|
| `$player` | The player's name |
| `$group` | The resolved group name — but see below |

When the `_op` branch is taken, `$group` substitutes to the literal string `_op`. It does not substitute to the player real group. When the `default` branch or the built-in fallback is taken, `$group` substitutes to the player group if they have one. It substitutes to an empty string if they do not.

A template that renders to blank clears the player list name back to vanilla. List names are only re-sent to the client when the rendered value actually changed.

### Header and footer

The header and footer are rendered per player through the same pipeline. PlaceholderAPI placeholders resolve for the viewer. They are re-sent only when the rendered pair changes.

`$player` and `$group` are **not** substituted in `header` or `footer`. Those tokens exist only in `nameFormats`. Use a PlaceholderAPI placeholder such as `%player_name%` instead.

Other plugins can override both per player through `GlossAPI.setTab(player, header, footer)` and clear the override with `resetTab(player)`. An override replaces the document header and footer as a pair. It is only consulted while `useHeaderFooter` is true. Overrides are dropped when the player quits. See [API: Getting Started](/gloss/21-api-getting-started).

### Configuration and lifecycle

| Key | Default | Range |
|---|---|---|
| `[features] tablist` | `true` | Enables header/footer and list-name management |
| `[tablist] updateIntervalTicks` | `40` | 1..400 |

Every cycle the driver walks the online players and applies to each one on that player own region thread. It is Folia-safe. If you change the interval, Gloss restarts the driver on reload. Header, footer and list-name expressions are sampled once per cycle, so the default can show one new time-driven frame every two seconds; `floor(time.seconds / 2)` advances one list entry per default refresh.

If you turn things off, Gloss cleans up after itself:

- `[features] tablist = false` stops the driver. On reload it resets any header/footer Gloss applied to empty. It resets any list name it applied back to vanilla.
- `useHeaderFooter: false` resets applied headers and footers on the next document reload.
- `groupListNames: false` resets applied list names on the next document reload.
- On plugin disable, headers and footers are cleared. List names are reset for every online player.

If you edit `tablist.json` on disk, the change applies without a reload. `[features] tablist` and `[tablist] updateIntervalTicks` live in `config.toml`. That file also hot-reloads. An on-disk config edit restarts the driver on its own. `/gloss reload` does the same.

The web editor can author and export the tablist document. It is not a live-sync subject, so install
the exported file manually or edit it on disk. `/gloss tablist reset` restores the shipped copy.

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

The two-line limit is the client's, not a style choice. The vanilla server list shows exactly two lines. An entry lines are joined with a newline when it is sent. There is no `\n`-in-a-string form any more. Write two array elements.

A document that violates either rule is refused as a whole. At startup that leaves the built-in default (a single entry reading `&dA glossy server`) live. At runtime it leaves the last good document live. The failure is logged as `motd/motd.json: motd entry requires 1 to 2 lines`. The prefix is the document kind and file name rather than the path on disk. The path on disk is `plugins/Gloss/motd.json`.

`/gloss motd reset` restores the shipped document (permission `gloss.motd.reset`).

### How a ping is answered

`[features] motd` defaults to **`false`**. The shipped `motd.json` is only written to disk once the feature is on, so a stock data folder has no MOTD document at all and the built-in default stands. Gloss watches and hot-reloads the file either way, and only registers the ping listener when the feature is on. Turning the feature on extracts the document on that reload.

With the feature on, Gloss listens on `ServerListPingEvent` at `EventPriority.LOWEST`. It picks one entry uniformly at random on every ping. A multi-entry document rotates naturally with no timer. Because it runs at the lowest priority, any other MOTD plugin that also handles the event runs later and wins.

The chosen text is rendered **statically**:

| Stage | Applies |
|---|---|
| `\|function\|` tokens, including `\|animation.<id>\|` | Yes |
| Inline `{{ expression }}` blocks using time and server values | Yes |
| Native server aliases through `papi(...)` / `papiNumber(...)` | Yes |
| Inline player values or external PAPI expansions | **No** |
| PlaceholderAPI placeholders | **No** |
| Emoji replacement | Yes |
| Colors — `[RRGGBB]` bracket hex, then `&` codes | Yes |

PlaceholderAPI is not resolved at ping time because there is no player to resolve it against. A server list ping is answered before anyone joins. The client behind it is not a `Player` on this server. PlaceholderAPI needs a player to expand `%...%` against. `MotdService` therefore calls `TextRenderer.renderStatic`. That runs the pipeline with a null viewer. The pipeline placeholder stage is skipped whenever the viewer is null. Placeholder tokens written into an MOTD entry are sent to the client verbatim.

The same request's round-trip ping cannot control that MOTD. The server sends the status response,
including the MOTD, before the protocol performs its ping/pong measurement. There is therefore no
current latency value to branch on. MOTD expressions may branch on time, online count, maximum
players, native `server.tps`, integration metrics and the native `server_online`, `server_max_players`
and `server_tps` PAPI aliases instead. A player-backed PAPI key is only safe with an explicit fallback,
for example `papi('player_name', 'Visitor')`; it cannot reveal the unjoined client.

Animation functions ignore the viewer and resolve from wall-clock time. `|animation.rainbow|` does
work in an MOTD and samples a new color between common three-second status polls. A custom animation
whose complete cycle exactly matches a poller's interval can repeatedly sample the same frame; use a
different `frameIntervalMs` when that happens. See [Emoji, Text & Animations](/gloss/07-emoji-text-animations).

If rendering throws, Gloss logs `MOTD render failed: <reason>` once and leaves that ping MOTD untouched. The warning is armed again by the next reload.

If you edit `motd.json`, the change applies without a reload. If you flip `[features] motd`, that is a config change. It hot-reloads on its own or on `/gloss reload`. Gloss then re-registers or unregisters the listener.

## Coming from the pre-merge layout

`/gloss import legacy` folds the old shapes into these two documents:

- Each `groups/<name>.yml` with a non-blank `tablist-name` becomes a `nameFormats` entry keyed by the lowercased file name. Existing keys in `tablist.json` are kept. The absorbed ones are merged over them. The document `revision` is bumped.
- `config.yml` `motd.texts` list becomes `entries`. Each string is split on newlines. Any entry longer than two lines is truncated. This runs **only** when `motd.json` is still byte-identical to the shipped default. A customized `motd.json` is left alone. The import records `motd.json was already customized; config.yml motd texts not applied`.

The originals are kept under `import-backups/<timestamp>/`. Full details are in [Data Files & Hot Reload](/gloss/03-data-files).
