---
title: "Commands & Permissions"
description: "Gloss documentation: Commands & Permissions"
published: true
date: 2026-08-24
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Gloss uses `/gloss`, with `/hologram` and `/board` as shortcuts. Optional arguments use `name=value`. Put multi-word values in brackets: `text=[Hello world]`.

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

`gloss.*` grants every permission. Most permissions default to operators. These are available to players by default:

- `gloss.emoji.use`
- `gloss.bubbles.send`
- `gloss.indicators.show`

Dynamic permissions are `gloss.open.<menuId>`, `gloss.bubbles.style.<styleId>`, and, when enabled, `gloss.emoji.<emojiId>`.

Each feature page contains the less common commands and accepted values.
