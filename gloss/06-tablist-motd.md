---
title: "Tablist & Server List MOTD"
description: "Gloss documentation: Tablist & Server List MOTD"
published: true
date: 2026-08-24
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

The conditional tablist header, footer and list-name format live in the single document `plugins/Gloss/tablist.json`. The server list MOTD lives in `plugins/Gloss/motd.json`. Both are enveloped JSON and hot-reload from disk. Neither has any content left in `gloss.toml`; the only tablist knob still in the config file is its refresh interval.

## The tablist document

`plugins/Gloss/tablist.json`:

```json
{
  "schemaVersion": 2,
  "revision": 1,
  "headerFooter": {
    "enabled": true,
    "presentation": {
      "header": "&d&lGloss",
      "footer": "&7VolmitSoftware.com"
    },
    "variants": [
      {
        "id": "critical-health",
        "priority": 100,
        "when": "viewer.health < 5",
        "presentation": {
          "header": "&c&lCritical health",
          "footer": "&7Find safety now"
        }
      }
    ]
  },
  "listNames": {
    "enabled": true,
    "presentation": { "format": "$player" },
    "variants": [
      {
        "id": "operator",
        "priority": 100,
        "when": "subject.op",
        "presentation": { "format": "&6$player" }
      },
      {
        "id": "moderator",
        "priority": 50,
        "when": "subject.group == 'moderator'",
        "presentation": { "format": "&9[Mod] &f$player" }
      }
    ]
  }
}
```

| Key | Default | Notes |
|---|---|---|
| `schemaVersion` | required | Must be `2`. Anything else rejects the file with `unsupported tablist schemaVersion: <n>` |
| `revision` | required | `1` to `9007199254740991` |
| `headerFooter.enabled` | `true` | When false, Gloss never touches the header or footer |
| `headerFooter.presentation` | required | Complete base `header` and `footer` pair |
| `headerFooter.variants` | `[]` | Complete conditional presentations with `id`, `priority` and `when` |
| `listNames.enabled` | `true` | When false, Gloss never touches list names and restores any it applied |
| `listNames.presentation.format` | required | Base list-name template |
| `listNames.variants` | `[]` | Complete conditional formats with `id`, `priority` and `when` |

This is a single file at the root of the data folder. It is not a folder of documents. It is extracted when missing, while `[features] tablist` is on. `/gloss tablist reset` rewrites it from the shipped copy (permission `gloss.tablist.reset`).

If the file is missing or fails to parse at startup, Gloss falls back to
built-in defaults. Those defaults enable `headerFooter` with header
`&d&lGloss` and footer `&7VolmitSoftware.com`, and enable `listNames` with
base format `$player`. The shipped operator appearance is an ordinary
variant with priority `100` and condition `subject.op`. If a runtime edit fails to parse, the last good
document stays live. Either way the failure is logged as
`tablist/tablist.json: <reason>`. That prefix is the document kind and
file name, not the path on disk. The path on disk is
`plugins/Gloss/tablist.json`.

### List name resolution

For each player, Gloss evaluates every `listNames.variants[]` condition. The matching variant with the greatest `priority` wins; equal priorities sort by lexical `id`. If none match, the base `listNames.presentation` wins. `_op`, `default` and group keys have no special meaning in schema 2. Conditions can test operator state, Vault group, world, health, permissions, regions, PlaceholderAPI values, React metrics and the other values listed in [Expressions & Placeholders](/gloss/13-expressions-placeholders).

Once a template is picked, `$player` and `$group` are substituted literally. The result is then run through the full text pipeline (functions, PlaceholderAPI, emoji, colors) with the player as the resolution context.

| Token | Substituted with |
|---|---|
| `$player` | The player's name |
| `$group` | The player's current Vault primary group, or an empty string when unavailable |

A template that renders to blank clears the player list name back to vanilla. List names are only re-sent to the client when the rendered value actually changed.

### Header and footer

The header and footer are rendered per player through the same pipeline. Gloss independently evaluates `headerFooter.variants[]` with the viewer as the condition subject. The matching variant with the greatest priority wins, equal priorities sort by lexical id, and the complete base presentation is the fallback. PlaceholderAPI placeholders resolve for the viewer. The pair is re-sent only when its rendered value changes.

`$player` and `$group` are **not** substituted in `header` or `footer`. Those tokens exist only in list-name formats. Use a PlaceholderAPI placeholder such as `%player_name%` instead.

Other plugins can override both per player through `GlossAPI.setTab(player, header, footer)` and clear the override with `resetTab(player)`. An override replaces the selected document header and footer as a pair. It is only consulted while `headerFooter.enabled` is true. Overrides are dropped when the player quits. See [API: Getting Started](/gloss/21-api-getting-started).

### Configuration and lifecycle

| Key | Default | Range |
|---|---|---|
| `[features] tablist` | `true` | Enables header/footer and list-name management |
| `[tablist] updateIntervalTicks` | `40` | 1..400 |

Every ordinary cycle the driver walks the online players and evaluates both conditional surfaces on each player's own region thread. It is Folia-safe. The configured 40-tick default remains the ordinary cadence for conditions, static text, PlaceholderAPI, metrics, and player or server expressions. A clock-driven expression (`time.ms`, `time.seconds` or `time.ticks`) or complete `|animation.<id>|` token in the selected header or footer switches that shared surface to every-tick sampling for all recipients. An animated selected list-name format instead places only that player on the fast cohort. Animated API header/footer overrides use that same selected-player cohort. Repeated requests for one player collapse into one latest owner-thread update, so a stalled region cannot accumulate a refresh task for every elapsed animation tick.

Rendered values are change-deduplicated. Unchanged headers and footers are the exception: Gloss sends a staggered anti-entropy heartbeat after long idle periods so a dropped packet, proxy reset or stale client tab overlay does not remain frozen indefinitely. At most 64 heartbeat packets are admitted per ordinary cycle, and first deadlines are distributed by player UUID rather than bursting for the whole server. List names are not heartbeat-broadcast because that would scale quadratically; Gloss instead compares its memo with the server's current list name and repairs only an actual overwrite. Join, respawn and world changes invalidate the player's presentation immediately. Hot document edits, condition outcomes and API override changes reconcile without a reload; changing the configured interval restarts the ordinary driver on config reload.

If you turn things off, Gloss cleans up after itself:

- `[features] tablist = false` stops the driver. On reload it resets any header/footer Gloss applied to empty. It resets any list name it applied back to vanilla.
- `headerFooter.enabled: false` resets applied headers and footers on the next document reload.
- `listNames.enabled: false` resets applied list names on the next document reload.
- On plugin disable, headers and footers are cleared. List names are reset for every online player.

If you edit `tablist.json` on disk, the change applies without a reload. `[features] tablist` and `[tablist] updateIntervalTicks` live in `gloss.toml`. That file also hot-reloads. An on-disk config edit restarts the driver on its own. `/gloss reload` does the same.

The web editor can author, export and live-sync the tablist document. Open it alone with
`/gloss web edit tablist tablist`, or include it in `/gloss web workspace`. `/gloss tablist reset`
restores the shipped copy.

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

The web editor can live-sync this singleton with `/gloss web edit motd motd`, or include it in
`/gloss web workspace`.

## Coming from the pre-merge layout

Tablist schema 2 is a hard break. Schema 1 files are rejected and Gloss does not translate old group YAML or legacy tablist formats. Rewrite custom tablist content into complete base presentations and conditional variants, or reset it to the shipped schema 2 document. `/gloss import legacy` does not convert boards, groups or tablists. MOTD remains schema 1; its supported legacy import behavior is documented in [Data Files & Hot Reload](/gloss/03-data-files).
