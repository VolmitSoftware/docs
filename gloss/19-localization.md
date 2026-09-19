---
title: "Localization"
description: "Select server and player languages and edit message files"
published: true
date: 2026-09-19T00:00:00.000Z
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
