---
title: "Localization"
description: "Select server and player languages and edit message files"
published: true
date: 2026-10-03T14:29:43.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Gloss's server default is the `language` key in `plugins/Gloss/gloss.toml`. Its own permission node
is `gloss.language.self`, and server selection accepts `gloss.admin` or `volmit.language.admin`.

See [Languages](/languages) for the picker, permissions, the full locale list, fallback rules, and how to edit or translate messages.

The web editor keeps a separate, browser-local language. It does not read or change the server or
player settings.

## Key names

Key ids are dot-delimited and map onto TOML sections with short leaf keys. For example, `[gloss.message.menu]` with `unavailable = "&cMenu indisponible: {menu}"` defines `gloss.message.menu.unavailable`. Where a message key is also the parent of other keys, dotted leaf names stay quoted within the same section.

| Prefix | Contents |
|---|---|
| `director.*` | Director's own help navigation labels and runtime errors |
| `language.*` | Shared language picker, selection feedback and message editor |
| `command.help.*` | Command, subcommand and parameter descriptions shown in `/gloss help` |
| `command.*` (other) | Hologram and scoreboard command feedback, permission and usage errors |
| `gloss.message.*` | Chat feedback for menus, panels, previews, items, sync, imports and preview scaling |
| `gloss.preview.*` | Container preview status lines, statistic lines and card titles |
| `gloss.error.*` | Argument validation errors raised while parsing a command |

Use `command.help.*` to change command and parameter descriptions.

## Authored content strings

<div class="gloss-demo" data-demo="strings-editor">
<p><strong>Content string authoring</strong> Browser editor. Silent capture. Browser editing and previews; game rendering is shown in the Minecraft client clips.</p>
<video src="/gloss-assets/demos/strings-editor.webm" aria-label="Content string authoring, browser editor" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Use `strings/<locale>.json` for text shared by your own menus, holograms, and other documents. These catalogs are separate from Gloss's operator messages in `languages/*.toml`.

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "locale": "en_US",
  "fallback": "",
  "entries": {
    "shop.title": "<gold>Supplies</gold>",
    "shop.welcome": "Welcome, {name}"
  }
}
```

Reference entries with `lang('shop.title')` or `lang('shop.welcome', player.name)`. Positional arguments fill placeholders in their first appearance order, and inserted values cannot add color codes. Keys use lowercase letters, digits, dots, underscores, and hyphens, beginning with a letter or digit. A catalog accepts up to 8,192 entries and each value up to 4,096 characters.

Locale ids use `language_COUNTRY`, such as `fr_FR`; hyphenated and differently cased ids normalize to that form. Content selection uses the player's explicit language, then their client locale, then the server language. Resolution follows the selected catalog's `fallback` chain, then `en_US`, then Gloss's own message catalog, and finally the key itself. Save a translated catalog with the same entry keys and its own `locale` and optional `fallback`.

`/gloss strings list` lists loaded catalogs, and `/gloss strings missing <locale>` lists keys absent from a translation; both require `gloss.strings`. `/gloss strings reset [name=*]` restores shipped catalogs and requires `gloss.strings.reset`. Catalog edits reload automatically.

## Preview documents reference the catalog

Container previews use the same catalog through `lang(key, ...)`:

```json
{ "text": "lang('gloss.preview.state.smelting_item', item, percent)" }
```

Arguments fill the English template's placeholders in declaration order. With
`Smelting {item} {percent}%`, the example renders `Smelting Iron Ore 42%`. Extra arguments are
ignored, and inserted values cannot add color codes.

The `gloss.preview.*` keys split into `gloss.preview.state.*` for status lines,
`gloss.preview.stat.*` for statistic lines, and `gloss.preview.theme.title.*` for card titles.
Retranslating them changes every included preview card at once. No document edit is needed.

A `lang()` key the catalog does not declare is a build error for that document. It is surfaced by
`/gloss preview dump <name>` as `lang: Unknown message key: <id>`. See
[Container Previews](/gloss/15-container-previews).
