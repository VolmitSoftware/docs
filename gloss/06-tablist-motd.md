---
title: "Tablist & Server List MOTD"
description: "Configure player-list text and randomized server-list messages"
published: true
date: 2026-09-16T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

For proxy tablists, scoreboards, surfaces, connection messages, and MOTD management, see [Velocity Proxy](/gloss/27-velocity). The instructions below cover the server edition.

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

### Visibility

The tablist document, `headerFooter`, and `listNames` each accept `show`, defaulting to `true`.
Both the document and section conditions must pass, alongside `enabled`. Conditions run for the
player being formatted on refresh. False clears headers and footers, including API overrides, or
restores the plain list name. The presentation returns when the condition becomes true. See [Show conditions](/gloss/13-expressions-placeholders#show-conditions).

### List name resolution

Gloss chooses the matching list-name variant with the highest priority; ties use the lexicographically smallest ID. If none match, it uses the base presentation. Conditions are documented in [Expressions & Placeholders](/gloss/13-expressions-placeholders).

Once a template is picked, `$player` and `$group` are substituted literally. The result is then run through the full text pipeline (functions, PlaceholderAPI, emoji, colors) with the player as the resolution context.

| Token | Substituted with |
|---|---|
| `$player` | The player's name |
| `$group` | The player's current Vault primary group, or an empty string when unavailable. Vault is queried only when the selected format uses this token |

A blank result restores the vanilla list name.

### Header and footer

Headers and footers render per player. The highest-priority matching variant wins, with the base presentation as the fallback.

`$player` and `$group` are **not** substituted in `header` or `footer`. Those tokens exist only in list-name formats. Use a PlaceholderAPI placeholder such as `%player_name%` instead.

Other plugins can override both per player through `GlossAPI.setTab(player, header, footer)` and clear the override with `resetTab(player)`. An override replaces the selected document header and footer as a pair. It is only displayed while `headerFooter.enabled`, document `show`, and `headerFooter.show` are true. Overrides are dropped when the player quits. See [API: Getting Started](/gloss/21-api-getting-started).

### Configuration and lifecycle

| Key | Default | Range |
|---|---|---|
| `[features] tablist` | `true` | Enables header/footer and list-name management |
| `[tablist] updateIntervalTicks` | `40` | 1..400 |

Gloss normally refreshes tablist content every 40 ticks, spreading players across that interval. A list-name format with a clock expression or named animation updates every tick; that cadence is decided from the format itself, not from a player or group name substituted into it. Joins, respawns, world changes, document edits, and API overrides also refresh the affected player.

Disabling a surface restores its vanilla state:

- `[features] tablist = false` stops the driver. On reload it resets any header/footer Gloss applied to empty. It resets any list name it applied back to vanilla.
- `headerFooter.enabled: false` resets applied headers and footers on the next document reload.
- `listNames.enabled: false` resets applied list names on the next document reload.
- On plugin disable, headers and footers are cleared. List names are reset for every online player.

Edits to `tablist.json` on disk apply automatically. `[features] tablist` and `[tablist] updateIntervalTicks` live in `gloss.toml`. That file also hot-reloads. An on-disk config edit restarts the driver on its own.

The web editor can edit, export and live-sync the tablist document. Open it alone with
`/gloss web edit tablist tablist`, or include it in `/gloss web workspace`. `/gloss tablist reset`
restores the default copy.

## Server list MOTD

`plugins/Gloss/motd.json`:

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "favicon": "server.png",
  "entries": [
    { "lines": ["&dA glossy server"] },
    {
      "lines": ["&d&lMy Server", "&7Now with 100% more gloss"],
      "favicon": "event.png",
      "sample": ["&fEvent weekend", "&7Double drops until Sunday"],
      "online": "{{ server.online }}",
      "max": "200",
      "version": "My Server"
    }
  ],
  "links": [
    { "type": "website", "url": "https://volmitsoftware.com" },
    { "label": "Event rules", "url": "https://example.com/rules" }
  ]
}
```

| Key | Notes |
|---|---|
| `schemaVersion` | Must be `1`. Any other version is silently ignored |
| `revision` | `1` to `9007199254740991` |
| `favicon` | Optional. The server-list icon for every entry. Blank or absent keeps the vanilla `server-icon.png` |
| `entries` | At least one entry required, otherwise `motd document requires at least one entry` |
| `entries[].lines` | **1 or 2 lines. Zero lines or three or more is rejected outright** with `motd entry requires 1 to 2 lines` |
| `links` | Optional. Up to 16 pause-menu server links, otherwise `motd document declares more than 16 links` |

The vanilla server list supports at most two lines. Use two array entries rather than `\n` inside one string.

An invalid document is rejected as a whole. Gloss keeps the built-in or last valid document and logs the reason.

`/gloss motd reset` restores the included document (permission `gloss.motd.reset`).

The MOTD document also accepts `show`, defaulting to `true`. It is evaluated for each ping without
a viewer or world. False leaves the existing ping response unchanged, including its player limit.
Use server or calendar-time conditions here; see [Show conditions](/gloss/13-expressions-placeholders#show-conditions).

### Server icon

The top-level `favicon` is the server-list icon for every entry. An entry's own `favicon` replaces
it for that entry. Blank or absent at both levels leaves the vanilla `server-icon.png` in place.

Paths are relative to `plugins/Gloss/images/` and must stay inside that folder. The file must be a
PNG, recognised by its contents rather than its name, and decode to exactly 64×64 pixels. A JPEG or
a 128×128 PNG is refused even when the name ends in `.png`. A refused icon is logged once per
document change as `MOTD favicon "<path>" was refused: <reason>.`, the reason names the rule it
broke, and that entry falls back to the vanilla icon. The rest of the ping still answers.

Icons are decoded once per document change, never per ping. Replacing an image file on disk reaches
the server list after the next `motd.json` change.

### Ping fields

Besides its text, an entry can set the hover sample, the two player counts, and the version line.

| Key | Sets | Notes |
|---|---|---|
| `entries[].favicon` | The server-list icon for this entry | Overrides the document `favicon`. See [Server icon](#server-icon) |
| `entries[].sample` | The hover list under the player count | Up to 12 lines, otherwise `motd entry sample may not exceed 12 lines`. It replaces the real player sample |
| `entries[].online` | The count before the slash | Must render to a number |
| `entries[].max` | The count after the slash | Must render to a number |
| `entries[].version` | The version name a client shows when its protocol does not match | Free text. The protocol number is untouched |

These fields go through the same static render as the MOTD text, described below. `online` and `max`
are rendered and then read as a number; a value that does not render to one is skipped and logged
once as `MOTD count "<raw>" did not render to a number.`

An entry whose sample, counts, or version carries a `|function|` token or a `{{ expression }}` block
is re-rendered on every ping, so a live count stays live. Everything else is rendered once per
document revision.

Not every field reaches every server. On Spigot, only the MOTD text, the icon, and `max` are
applied. `sample`, `online`, and `version` need Paper's server-list ping event. A server without it
keeps those parts of the vanilla response.

### Server links

`links` publishes the server links that appear in the client's pause menu. It needs the Paper
`ServerLinks` API, which is Paper 1.21 or newer; elsewhere the list is ignored. Links are published
when the document loads and again whenever it changes, and Gloss removes only the ones it added when
the feature is turned off or the plugin disables.

Each link needs a `url` and either a `type` or a `label`. A link with neither is rejected with
`motd link requires a known type or a label: <url>`.

| Key | Notes |
|---|---|
| `links[].type` | Uses the client's built-in label. One of `report_bug`, `community_guidelines`, `support`, `status`, `feedback`, `community`, `website`, `forums`, `news`, `announcements`. Case does not matter |
| `links[].label` | Publishes a custom label instead. Used only when `type` is absent |
| `links[].url` | Required. Must be an `http` or `https` address with a host |

An unknown `type` or a non-web `url` rejects the whole document, so the previous one stays active.

While a Velocity Gloss proxy holds the MOTD claim, this server removes the links it published and publishes none; it republishes this list when the claim is released or expires. See [Velocity Proxy](/gloss/27-velocity).

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

If rendering throws, Gloss logs `MOTD render failed; keeping the server default.` with the stack trace once and leaves that ping untouched. The warning is armed again by the next reload.

Edits to `motd.json` apply automatically. Changing `[features] motd` in `gloss.toml` also hot-reloads. Gloss then re-registers or unregisters the listener.

The web editor can live-sync this singleton with `/gloss web edit motd motd`, or include it in
`/gloss web workspace`.

## Coming from the pre-merge layout

Gloss ignores schema-1 tablist files. Rewrite them as schema 2 or reset to the bundled document. MOTD remains schema 1. See [Data Files & Hot Reload](/gloss/03-data-files).
