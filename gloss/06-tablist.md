---
title: "Tablist"
description: "Configure the in-game player list"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Player-list text lives in `plugins/Gloss/tablist.json` and reloads automatically. Behind a proxy, see [Velocity Proxy](/gloss/27-velocity) — the page below covers the server edition.

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

## Visibility

The tablist document, `headerFooter`, and `listNames` each accept `show`, defaulting to `true`.
Both the document and section conditions must pass, alongside `enabled`. Conditions run for the
player being formatted on refresh. False clears headers and footers, including API overrides, or
restores the plain list name. The presentation returns when the condition becomes true. See [Show conditions](/gloss/13-expressions-placeholders#show-conditions).

## List name resolution

Gloss chooses the matching list-name variant with the highest priority; ties use the lexicographically smallest ID. If none match, it uses the base presentation. Conditions are documented in [Expressions & Placeholders](/gloss/13-expressions-placeholders).

Once a template is picked, `$player` and `$group` are substituted literally. The result is then run through the full text pipeline (functions, PlaceholderAPI, emoji, colors) with the player as the resolution context.

| Token | Substituted with |
|---|---|
| `$player` | The player's name |
| `$group` | The player's current Vault primary group, or an empty string when unavailable. Vault is queried only when the selected format uses this token |

A blank result restores the vanilla list name.

## Header and footer

Headers and footers render per player. The highest-priority matching variant wins, with the base presentation as the fallback.

`$player` and `$group` are **not** substituted in `header` or `footer`. Those tokens exist only in list-name formats. Use a PlaceholderAPI placeholder such as `%player_name%` instead.

Other plugins can override both per player through `GlossAPI.setTab(player, header, footer)` and clear the override with `resetTab(player)`. An override replaces the selected document header and footer as a pair. It is only displayed while `headerFooter.enabled`, document `show`, and `headerFooter.show` are true. Overrides are dropped when the player quits. See [API: Getting Started](/gloss/21-api-getting-started).

## Configuration and lifecycle

| Key | Default | Range |
|---|---|---|
| `[features] tablist` | `true` | Enables header/footer and list-name management |
| `[tablist] updateIntervalTicks` | `40` | 1..400 |

Content refreshes every `updateIntervalTicks`. A list-name format containing a clock expression or a named animation updates every tick instead. Joins, respawns, world changes and document edits refresh that player immediately.

Turning tablist off restores vanilla headers and names. That holds for `[features] tablist = false`,
for `headerFooter.enabled: false` and `listNames.enabled: false` individually, and for disabling the
plugin.

Edits to `tablist.json` and to `gloss.toml` both apply automatically.

The web editor can edit, export and live-sync the tablist document. Open it alone with
`/gloss web edit tablist tablist`, or include it in `/gloss web workspace`. `/gloss tablist reset`
restores the default copy.

Gloss ignores schema-1 tablist files. Rewrite them as schema 2, or reset to the bundled
document. See [Data Files & Hot Reload](/gloss/03-data-files) and [Server List MOTD](/gloss/06b-server-list-motd).
