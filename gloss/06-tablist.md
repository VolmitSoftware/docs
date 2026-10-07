---
title: "Tablist"
description: "Configure the in-game player list"
published: true
date: 2026-10-07T16:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Player-list text lives in `plugins/Gloss/tablist.json` and reloads automatically. Behind a proxy, see [Velocity Proxy](/gloss/27-velocity) — the page below covers the server edition.

`plugins/Gloss/tablist.json`:

```json
{
  "schemaVersion": 3,
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
| `schemaVersion` | required | Must be `3`. Any other version is silently ignored |
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

Once a template is picked, `$player` expands to the selected nametag identity and `$group` to the primary group. Use `{{ player.username }}` when the account name must appear without the nametag. The result is then run through the full text pipeline (functions, PlaceholderAPI, emoji, colors) with the player as the resolution context.

| Token | Substituted with |
|---|---|
| `$player` | The player's selected nametag identity, or the account name when no nametag applies |
| `$group` | The player's current Vault primary group, or an empty string when unavailable. Vault is queried only when the selected format uses this token |

A blank result restores the vanilla list name.

## Sort order and layout cells

`sort: {"enabled": true, "weight": "subject.op ? 100 : 0"}` places higher weights first.
The expression sees the listed player as `subject` and the observer as `viewer`. Weights are
rounded to integers; equal weights in a layout sort by account name, case-insensitively.

Fixed layouts require Java 1.21.2 or later; older clients retain their ordinary tablist. A fixed layout uses `layout.enabled` and `entries` (1–80). Minecraft derives its columns as `ceil(entries / 20)` and rows as `ceil(entries / columns)`. Cells fill down each column before the next column. A partially filled final column has no cells beyond the entry count. Fixed slots and roster sections must fit those cells and cannot overlap.

```json
"layout": {
  "enabled": true,
  "entries": 40,
  "slots": [{"column": 0, "row": 0, "text": "&dOnline players", "hat": true}],
  "sections": [{
    "id": "members", "column": 1, "row": 1, "columns": 1, "rows": 19,
    "filter": "true", "overflow": "count",
    "sort": [
      {"expression": "subject.op ? 1 : 0", "type": "number", "direction": "descending"},
      {"expression": "subject.name", "type": "text", "direction": "ascending"}
    ]
  }]
}
```

Each `slots` entry has zero-based `column` and `row`, `text`, optional `skin`, optional `ping`, and `hat` (default `true`). Fixed text resolves expressions and placeholders for the viewer. Ping clamps to -1 through 10000 and defaults to 0.

Each roster section has a unique `id`, zero-based starting `column` and `row`, `columns` (1–4), `rows` (1–20), and a `filter` expression (default `true`). Conditions see the observer as `viewer` and the listed player as `subject`. Sections select independently, so a player may appear in several sections. `includeNpcs` defaults to `false` and applies to online Bukkit players carrying NPC metadata. Players hidden from the viewer remain hidden. Tab entries created by other plugins remain under those plugins’ control and can affect the client’s final geometry.

The optional section `format` overrides the selected `listNames` presentation and supports `$player`, `$group`, placeholders, and expressions. Without it, list-name variants apply per viewer and listed player. Each section can override `skin` and `hat`; otherwise rows use captured player skins and show the hat layer.

Section `sort` accepts up to 16 keys. Each key has `expression`, `type` (`number` or `text`, default `text`), and `direction` (`ascending` or `descending`, default `ascending`). Keys are evaluated in array order. Text comparison is case-sensitive. Equal keys fall back to account name, case-insensitively, then UUID. An empty sort list uses the document’s numeric `sort.weight` followed by the same stable fallback.

Sorting happens before truncation. With `overflow: "count"`, the final cell uses `overflowFormat` when players exceed capacity. The default `+{count}` inserts the number omitted from that section; colors, placeholders, and expressions also work. `"hide"` omits excess players. Subject values are captured on the subject’s owning region; a missing sample retains the previous layout until it is available.

`skins` maps names to `{ "value": "<base64 texture property>", "signature": "<optional signature>" }`. `skin` first resolves a named definition, then an online account’s captured texture. No profile lookup or network download is performed. Values and signatures each accept up to 16384 characters. An omitted or unresolved skin uses the client’s default skin. Hat visibility requires Java 1.21.4 or later; older clients keep their native appearance.

`layout.variants` selects complete layouts with `{ "id", "priority", "when", "presentation" }`. Presentations contain `entries`, `slots`, `sections`, and `skins`. Highest priority wins, then identifier; the base layout is the fallback. `layout.show` defaults to `"!viewer.bedrock"`. While a layout is visible, Gloss unlists ordinary player entries and restores only entries it still owns when the layout closes.

## Header and footer

<div class="gloss-demo" data-demo="boards-tablist-pov">
<p><strong>Scoreboard and tablist</strong> Minecraft client. Silent capture.</p>
<video src="/gloss-assets/demos/boards-tablist-pov.webm" aria-label="Scoreboard and tablist, first person" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

<div class="gloss-demo" data-demo="tablist-editor">
<p><strong>Tablist authoring</strong> Browser editor. Silent capture. Browser editing and previews; game rendering is shown in the Minecraft client clips.</p>
<video src="/gloss-assets/demos/tablist-editor.webm" aria-label="Tablist authoring, browser editor" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Headers and footers render per player. The highest-priority matching variant wins, with the base presentation as the fallback.

`$player` and `$group` are **not** substituted in `header` or `footer`. Those tokens exist only in list-name formats. Use a PlaceholderAPI placeholder such as `%player_name%` instead.

Other plugins can override both per player through `GlossAPI.setTab(player, header, footer)` and clear the override with `resetTab(player)`. An override replaces the selected document header and footer as a pair. It is only displayed while `headerFooter.enabled`, document `show`, and `headerFooter.show` are true. Overrides are dropped when the player quits. See [API: Getting Started](/gloss/21-api-getting-started).

## Configuration and lifecycle

| Key | Default | Range |
|---|---|---|
| `[features] tablist` | `true` | Enables header/footer and list-name management |
| `[tablist] updateIntervalTicks` | `40` | 1..400 |
| `[tablist] snapshotReadLimit` | `4096` | 16..65536 demanded values per sampled entity |

Content refreshes every `updateIntervalTicks`. A list-name format containing a clock expression or a named animation updates every tick instead. Joins, respawns, world changes and document edits refresh that player immediately.

Turning tablist off restores vanilla headers and names. That holds for `[features] tablist = false`,
for `headerFooter.enabled: false` and `listNames.enabled: false` individually, and for disabling the
plugin.

Edits to `tablist.json` and to `gloss.toml` both apply automatically.

The web editor can edit, export and live-sync the tablist document. Open it alone with
`/gloss web edit tablist tablist`, or include it in `/gloss web workspace`. `/gloss tablist reset`
restores the default copy.

The layout inspector edits the entry count, fixed cells, roster sections, named textures, and complete conditional presentations. Each section exposes its origin, dimensions, filter, ordered sort keys, format, overflow policy, NPC inclusion, skin, and hat visibility. The preview selects conditional presentations and applies sampled viewer and subject expressions, section filters, sorting, and overflow counts. Texture and hat appearance require an in-game client; the editor preserves their authored values through edits, export, and live sync.

Tablist documents use schema 3. Use the import preview to convert earlier formats; layouts needing extra blank cells to preserve their authored columns are reported as approximate conversions. See [Data Files & Hot Reload](/gloss/03-data-files) and [Server List MOTD](/gloss/06b-server-list-motd).
