---
title: "Tablist & Server List MOTD"
description: "Configure player-list text and randomized server-list messages"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Player-list text lives in `plugins/Gloss/tablist.json`; server-list messages live in `plugins/Gloss/motd.json`. Both files reload automatically.

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
| `schemaVersion` | required | Must be `2`. Any other version is silently ignored |
| `revision` | required | `1` to `9007199254740991` |
| `headerFooter.enabled` | `true` | When false, Gloss never touches the header or footer |
| `headerFooter.presentation` | required | Complete base `header` and `footer` pair |
| `headerFooter.variants` | `[]` | Complete conditional presentations with `id`, `priority` and `when` |
| `listNames.enabled` | `true` | When false, Gloss never touches list names and restores any it applied |
| `listNames.presentation.format` | required | Base list-name template |
| `listNames.variants` | `[]` | Complete conditional formats with `id`, `priority` and `when` |

This is a single file at the root of the data folder. It is not a folder of documents. It is extracted when missing, while `[features] tablist` is on. `/gloss tablist reset` rewrites it from the default copy (permission `gloss.tablist.reset`).

If the file is missing at startup, Gloss uses its built-in default. If a live edit is invalid, the last valid document stays active and Gloss logs the reason.

### List name resolution

Gloss chooses the matching list-name variant with the highest priority; ties use the lexicographically smallest ID. If none match, it uses the base presentation. Conditions are documented in [Expressions & Placeholders](/gloss/13-expressions-placeholders).

Once a template is picked, `$player` and `$group` are substituted literally. The result is then run through the full text pipeline (functions, PlaceholderAPI, emoji, colors) with the player as the resolution context.

| Token | Substituted with |
|---|---|
| `$player` | The player's name |
| `$group` | The player's current Vault primary group, or an empty string when unavailable |

A blank result restores the vanilla list name.

### Header and footer

Headers and footers render per player. The highest-priority matching variant wins, with the base presentation as the fallback.

`$player` and `$group` are **not** substituted in `header` or `footer`. Those tokens exist only in list-name formats. Use a PlaceholderAPI placeholder such as `%player_name%` instead.

Other plugins can override both per player through `GlossAPI.setTab(player, header, footer)` and clear the override with `resetTab(player)`. An override replaces the selected document header and footer as a pair. It is only consulted while `headerFooter.enabled` is true. Overrides are dropped when the player quits. See [API: Getting Started](/gloss/21-api-getting-started).

### Configuration and lifecycle

| Key | Default | Range |
|---|---|---|
| `[features] tablist` | `true` | Enables header/footer and list-name management |
| `[tablist] updateIntervalTicks` | `40` | 1..400 |

Gloss normally refreshes tablist content every 40 ticks. Clock expressions and named animations can update every tick. Joins, respawns, world changes, document edits, and API overrides also refresh the affected player.

Disabling a surface restores its vanilla state:

- `[features] tablist = false` stops the driver. On reload it resets any header/footer Gloss applied to empty. It resets any list name it applied back to vanilla.
- `headerFooter.enabled: false` resets applied headers and footers on the next document reload.
- `listNames.enabled: false` resets applied list names on the next document reload.
- On plugin disable, headers and footers are cleared. List names are reset for every online player.

If you edit `tablist.json` on disk, the change applies without a reload. `[features] tablist` and `[tablist] updateIntervalTicks` live in `gloss.toml`. That file also hot-reloads. An on-disk config edit restarts the driver on its own. `/gloss reload` does the same.

The web editor can edit, export and live-sync the tablist document. Open it alone with
`/gloss web edit tablist tablist`, or include it in `/gloss web workspace`. `/gloss tablist reset`
restores the default copy.

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
| `schemaVersion` | Must be `1`. Any other version is silently ignored |
| `revision` | `1` to `9007199254740991` |
| `entries` | At least one entry required, otherwise `motd document requires at least one entry` |
| `entries[].lines` | **1 or 2 lines. Zero lines or three or more is rejected outright** with `motd entry requires 1 to 2 lines` |

The vanilla server list supports at most two lines. Use two array entries rather than `\n` inside one string.

An invalid document is rejected as a whole. Gloss keeps the built-in or last valid document and logs the reason.

`/gloss motd reset` restores the included document (permission `gloss.motd.reset`).

### How a ping is answered

`[features] motd` defaults to `false`. Turning it on extracts the bundled file and starts using it without a restart.

Gloss chooses one entry at random for each server-list request. Another MOTD plugin may override it if that plugin handles the event later.

The chosen text is rendered **statically**:

| Stage | Applies |
|---|---|
| `\|function\|` tokens, including `\|animation.<id>\|` | Yes |
| Inline `{{ expression }}` blocks using time and server values | Yes |
| Native server aliases through `papi(...)` / `papiNumber(...)` | Yes |
| Inline player values or external PAPI expansions | **No** |
| PlaceholderAPI placeholders | **No** |
| Emoji replacement | Yes |
| Colors: `[RRGGBB]` bracket hex, then `&` codes | Yes |

Player PlaceholderAPI values do not resolve because a server-list request has no player context. Raw player tokens remain visible.

The current request latency is also unavailable. MOTD expressions can use time, server counts, TPS, and integration metrics. Use a fallback for any player-backed value.

Animations use server time and work in the MOTD. See [Emoji, Text & Animations](/gloss/07-emoji-text-animations).

If rendering throws, Gloss logs `MOTD render failed: <reason>` once and leaves that ping MOTD untouched. The warning is armed again by the next reload.

If you edit `motd.json`, the change applies without a reload. If you flip `[features] motd`, that is a config change. It hot-reloads on its own or on `/gloss reload`. Gloss then re-registers or unregisters the listener.

The web editor can live-sync this singleton with `/gloss web edit motd motd`, or include it in
`/gloss web workspace`.

## Coming from the pre-merge layout

Gloss ignores schema-1 tablist files. Rewrite them as schema 2 or reset to the bundled document. MOTD remains schema 1. See [Data Files & Hot Reload](/gloss/03-data-files).
