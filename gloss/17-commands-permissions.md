---
title: "Commands & Permissions"
description: "Quick reference for Gloss commands and permissions"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Gloss uses `/gloss`, with `/hologram` and `/board` as shortcuts. Optional arguments use `name=value`. Put multi-word values in brackets: `text=[Hello world]`.

## Language selection

`/gloss language` opens the shared picker. `/gloss language self <locale>` sets your language, and `self reset` returns to the server default. Personal language selection requires both `gloss.language.self` and `volmit.language.self`, each granted by default (`true`). Denying either permission blocks the personal picker, direct locale selection, and `self reset`. `/gloss language server <locale>` changes the default with `gloss.admin` or `volmit.language.admin`.

`/gloss language server edit [locale]` opens the inventory message editor with `gloss.admin` or `volmit.language.admin`. Omit the locale to choose one. Edits update that locale without changing any server default or player preference; see [Localization](/gloss/19-localization) for storage and validation.

`/volmit plugins languages` opens the picker for every enabled provider's server default; `/volmit plugins languages de_DE` changes those defaults to German. It preserves all personal overrides and offers only locales common to every provider. Access requires `volmit.language.admin` (default `op`) or each enabled plugin's server-language administration permission. If any required permission is denied, no defaults change. See [Localization](/gloss/19-localization) for persistence and downloaded files.

## Diagnostic reports

`/gloss debugdump` saves a diagnostic report and uploads it to the public mclo.gs service by default. Use `/gloss debugdump upload=false` to save it locally without uploading. The command requires `gloss.debugdump` (default `op`), independently of the root administration permission.

Reports are written atomically under the plugin data folder's `debug/` directory before upload. An upload failure retains the local file. Players receive controls to copy the relative report path and open or copy the upload link; console receives plain text. See [Shared diagnostic reports](/volmlib/api/diagnostics) for report contents.

## Holograms

| Command | Permission | Purpose |
|---|---|---|
| `/hologram create <id>` | `gloss.holograms.create` | Create a hologram at your position |
| `/hologram addline <id> <text>` | `gloss.holograms.edit` | Add a line |
| `/hologram setline <id> <line> <text>` | `gloss.holograms.edit` | Replace a line |
| `/hologram removeline <id> <line>` | `gloss.holograms.edit` | Remove a line |
| `/hologram movehere <id>` | `gloss.holograms.move` | Move it to you |
| `/hologram tp <id>` | `gloss.holograms.teleport` | Teleport to it |
| `/hologram delete <id>` | `gloss.holograms.delete` | Delete it |
| `/hologram list` | any Gloss command access | List holograms |

## Scoreboards

| Command | Permission | Purpose |
|---|---|---|
| `/board create <id>` | `gloss.boards.create` | Create a scoreboard |
| `/board title <id> <text>` | `gloss.boards.edit` | Set its title |
| `/board addline <id> <text>` | `gloss.boards.edit` | Add a line |
| `/board setline <id> <line> <text>` | `gloss.boards.edit` | Replace a line |
| `/board select <id> <priority> <when>` | `gloss.boards.edit` | Set its automatic selection rule |
| `/board show <id>` | `gloss.boards.show` | Show it to yourself |
| `/board hide` | `gloss.boards.hide` | Hide your scoreboard |
| `/board delete <id>` | `gloss.boards.delete` | Delete it |

## Menus, panels, and previews

| Command | Permission | Purpose |
|---|---|---|
| `/gloss menu list` | `gloss.menus.list` | List menus |
| `/gloss menu open <id>` | `gloss.menus.open` and `gloss.open.<id>` | Open a menu |
| `/gloss menu new <id>` | `gloss.menus.edit` | Create a menu document |
| `/gloss menu addrow <id> <text>` | `gloss.menus.edit` | Add a row |
| `/gloss menu seticon <id> <row> <type> <value>` | `gloss.menus.edit` | Set a row icon |
| `/gloss menu close` | `gloss.menus.close` | Close your menu |
| `/gloss panel list` | `gloss.panels` | List panels |
| `/gloss panel create <id> [menu=*]` | `gloss.panels` | Place a panel at your position |
| `/gloss panel edit <id>` | `gloss.panels` | Start editing a panel |
| `/gloss panel save` | `gloss.panels` | Save your staged edit |
| `/gloss panel cancel` | `gloss.panels` | Discard your staged edit |
| `/gloss preview list` | `gloss.previews` | List container previews |
| `/gloss preview reset [name=*]` | `gloss.previews.reset` | Restore default previews |

## Other commands

| Command | Permission | Purpose |
|---|---|---|
| `/gloss debugdump [upload=true]` | `gloss.debugdump` | Save a diagnostic report, uploading by default |
| `/gloss status` | `gloss.admin` | Show feature counts |
| `/gloss reload` | `gloss.admin` | Reload Gloss |
| `/gloss emoji list` | `gloss.emoji.use` | List emoji |
| `/gloss bubbles style <style>` | `gloss.bubbles.style` | Choose a bubble style |
| `/gloss item status` | `gloss.items` | List custom-item providers |
| `/gloss item export` | `gloss.items.export` | Export the custom-item catalog |
| `/gloss web open` | `gloss.web.open` | Open the web editor |
| `/gloss web edit <kind> <id>` | `gloss.web.edit` | Edit one document |
| `/gloss web workspace` | `gloss.web.workspace` | Open the complete workspace |
| `/gloss import preview <source>` | `gloss.import` | Preview an import |
| `/gloss import apply <source>` | `gloss.import.apply` | Apply an import without overwriting existing Gloss data |

## Permissions

`gloss.*` grants Gloss permissions; personal language selection also requires the shared `volmit.language.self` permission. `gloss.debugdump` defaults to operators and authorizes diagnostic reports independently of `gloss.admin`. Most permissions default to operators. These are available to players by default:

- `gloss.emoji.use`
- `gloss.bubbles.send`
- `gloss.indicators.show`
- `gloss.language.self` (also requires `volmit.language.self`)
- `volmit.language.self` (shared personal language requirement)

Dynamic permissions are `gloss.open.<menuId>`, `gloss.bubbles.style.<styleId>`, and, when enabled, `gloss.emoji.<emojiId>`.

Each feature page contains the less common commands and accepted values.
