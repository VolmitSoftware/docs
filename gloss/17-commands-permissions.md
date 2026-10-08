---
title: "Commands & Permissions"
description: "Quick reference for Gloss commands and permissions"
published: true
date: 2026-10-08T00:57:06Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Gloss uses `/gloss`, with `/hologram` and `/board` as shortcuts. Optional arguments use `name=value`. Put multi-word values in brackets: `text=[Hello world]`.

## Language selection

`/gloss language` picks a language. Personal selection needs `gloss.language.self`; server
selection needs `gloss.admin` or `volmit.language.admin`. See [Languages](/languages).

## Plugin version

`/gloss debug version` prints the installed version. `/gloss version` runs the same command and stays hidden from help.

## Diagnostic reports

`/gloss debug dump` writes `debug/` and uploads to mclo.gs. `upload=false` keeps the file local. Permission `gloss.debugdump` (default op). A failed upload keeps the file. Contents: [Shared diagnostic reports](/volmlib/api/diagnostics). Gloss includes configured and active scoreboard/tablist refresh schedules, panel cadences, temporary-display limits, integration provider sampling modes and demand usage, and transaction-backup retention counts, bytes, and protected overage. Tick schedules are configuration and runtime state, not measurements of wall-clock latency.

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

## Resource packs

`/gloss forge build`, `status`, `export`, `serve`, and `reset` manage glyph fonts and pack delivery. Build and export prepare their results in the background and send completion feedback. See [Resource Packs & Glyph Fonts](/gloss/28-resource-packs) for arguments and permissions.

## Menus, panels, and previews

| Command | Permission | Purpose |
|---|---|---|
| `/gloss menu list` | `gloss.menus.list` | List menus |
| `/gloss menu open <id>` | `gloss.menus.open` and `gloss.open.<id>` | Open a menu |
| `/gloss menu new <id>` | `gloss.menus.edit` | Create a menu document |
| `/gloss menu addrow <id> <text>` | `gloss.menus.edit` | Add a row |
| `/gloss menu seticon <id> <row> <type> <value>` | `gloss.menus.edit` | Set a row icon |
| `/gloss menu close` | `gloss.menus.close` | Close your menu |
| `/gloss inventory list` | `gloss.inventories` | List inventory menus |
| `/gloss inventory info <inventory>` | `gloss.inventories.info` | Inspect an inventory menu |
| `/gloss inventory open <inventory> [player=] [args=]` | `gloss.inventories.open` | Open an inventory menu |
| `/gloss inventory reset [name=*]` | `gloss.inventories.reset` | Restore shipped inventory menus |
| `/gloss panel list` | `gloss.panels` | List panels |
| `/gloss panel create <id> [menu=*]` | `gloss.panels` | Place a panel at your position |
| `/gloss panel edit <id>` | `gloss.panels` | Start editing a panel |
| `/gloss panel save` | `gloss.panels` | Save your staged edit |
| `/gloss panel cancel` | `gloss.panels` | Discard your staged edit |
| `/gloss preview list` | `gloss.previews` | List container previews |
| `/gloss preview reset [name=*]` | `gloss.previews.reset` | Restore default previews |

## Markers and waypoints

| Command | Permission | Purpose |
|---|---|---|
| `/gloss marker list` / `/gloss marker info <id>` | `gloss.markers.list` / `gloss.markers.info` | Inspect marker documents |
| `/gloss marker create <id> [label=]` | `gloss.markers.create` | Place a marker at your position |
| `/gloss marker remove <id>` | `gloss.markers.remove` | Remove a marker |
| `/gloss waypoint list` / `/gloss waypoint info <id>` | `gloss.waypoints.list` / `gloss.waypoints.info` | Inspect waypoint documents |
| `/gloss waypoint set <name>` / `/gloss waypoint remove <name>` | `gloss.waypoints.self` | Add or remove your locator waypoint |

## Content workflows

| Command | Permission | Purpose |
|---|---|---|
| `/gloss pack list` / `/gloss pack info <id>` | `gloss.packs` | Inspect installed packs |
| `/gloss pack install <source> [dry=true]` | `gloss.packs.install` | Preview or install a local or HTTPS pack |
| `/gloss pack update <id>` | `gloss.packs.update` | Update from the installation source |
| `/gloss pack remove <id>` | `gloss.packs.remove` | Remove unchanged pack files |
| `/gloss history list <kind> <id> [page=1]` | `gloss.history` | List saved versions |
| `/gloss restore document <kind> <id> <version>` | `gloss.history.restore` | Restore a saved version |
| `/gloss check workspace [kind=*] [id=*] [page=1]` | `gloss.check` | Check authored documents |
| `/gloss export documents [kind=*] [id=*] [dir=exports]` | `gloss.export` | Export JSON documents |
| `/gloss export bundle [dir=exports]` | `gloss.export` | Export a workspace bundle |

See [Data Files & Hot Reload](/gloss/03-data-files) for pack authoring and file handling. The server edition reloads content automatically; `/gloss reload` is a [Velocity command](/gloss/27-velocity).

## Player names and chat

| Command | Permission | Purpose |
|---|---|---|
| `/gloss nametag list` / `/gloss nametag info <id>` | Any Gloss command access | Inspect nametag documents |
| `/gloss nametag refresh` | `gloss.nametags.refresh` | Refresh assigned overhead tags |
| `/gloss nametag reset [name=*]` | `gloss.nametags.reset` | Restore shipped tags |
| `/gloss nameplate list` | `gloss.nameplates.list` | List nameplates |
| `/gloss nameplate info <id>` | `gloss.nameplates.info` | Inspect a nameplate |
| `/gloss nameplate refresh` | `gloss.nameplates.refresh` | Refresh player plates |
| `/gloss nameplate reset [name=*]` | `gloss.nameplates.reset` | Restore shipped plates |
| `/gloss channel list` / `/gloss channel info <id>` | `gloss.channels` | Inspect channels |
| `/gloss channel reset [name=*]` | `gloss.channels.reset` | Restore shipped channels |
| `/ch <channel>` / `/ch list` | `gloss.chat.channel` | Select or list available channels |
| `/msg <player> <message>` / `/r <message>` | `gloss.chat.msg` | Send or reply to a private message |

`gloss.chat.mention` lets a sender trigger mention highlighting and sound. `gloss.chat.item` lets a sender use the channel's held-item token. Both default to true. Nametag and nameplate assignment permissions are the arbitrary nodes configured in `select.permission` and `variants[].permission`; they do not grant administration commands.

## Other commands

| Command | Permission | Purpose |
|---|---|---|
| `/gloss debug version` | any Gloss command access | Show the installed plugin version |
| `/gloss debug dump [upload=true]` | `gloss.debugdump` | Save a diagnostic report, uploading by default |
| `/gloss status` | `gloss.admin` | Show feature counts, display admissions/refusals and cleanup, and image cache size, memory weight, pending loads and refusals |
| `/gloss emoji list` | `gloss.emoji.use` | List emoji |
| `/gloss bubbles style <style>` | `gloss.bubbles.style` | Choose a bubble style |
| `/gloss item status` | `gloss.items` | List custom-item providers |
| `/gloss item export` | `gloss.items.export` | Export the custom-item catalog |
| `/gloss surface list` / `/gloss surface info <id>` | Any Gloss command access | Inspect screen surfaces |
| `/gloss surface test <id> [player=]` | `gloss.surfaces.test` | Evaluate normal surface selection for a player |
| `/gloss surface reset [name=*]` | `gloss.surfaces.reset` | Restore shipped surfaces |
| `/gloss strings list` / `/gloss strings missing <locale>` | `gloss.strings` | Inspect content string catalogs |
| `/gloss strings reset [name=*]` | `gloss.strings.reset` | Restore shipped content strings |
| `/gloss web open` | `gloss.web.open` | Open the web editor |
| `/gloss web edit <kind> <id>` | `gloss.web.edit` | Edit one document |
| `/gloss web workspace` | `gloss.web.workspace` | Open the complete workspace |
| `/gloss import preview <source>` | `gloss.import` | Preview an import |
| `/gloss import apply <source>` | `gloss.import.apply` | Apply an import without overwriting existing Gloss data; document sources require your unchanged reviewed preview |
| `/gloss import holoui [mode=preview] [overwrite=false]` | `gloss.import` | Preview HoloUi conversion; `overwrite=true` includes replacement of customized destinations |
| `/gloss import holoui mode=apply` | `gloss.import.apply` | Apply your prepared HoloUi preview before its configured expiry |
| `/gloss import legacy [mode=preview]` | `gloss.import` | Preview an older Gloss data upgrade |
| `/gloss import legacy mode=apply` | `gloss.import.apply` | Apply the sender’s unchanged preview before its configured expiry, preserving originals and recording successful configuration conversion |

For `featherboard`, `animated-scoreboard` and `tab`, run `preview` before `apply` from the same player or console. Each preview expires according to `[imports] previewLifetimeSeconds`. Source edits, changed destinations or a changed project document collection require a new preview. The import preserves source files and validates all resulting Gloss documents before writing.

FeatherBoard and AnimatedScoreboard imports produce board and animation documents; imported boards require an explicit `select.when` before automatic selection. TAB imports global and per-group headers and footers. Other TAB features, per-world/per-server overrides and TAB-specific display conditions are reported as unsupported and require explicit Gloss configuration.

## Permissions

`gloss.*` grants Gloss permissions; personal language selection also requires the shared `volmit.language.self` permission. `gloss.debugdump` defaults to operators and authorizes diagnostic reports independently of `gloss.admin`. Most permissions default to operators. These are available to players by default:

- `gloss.emoji.use`
- `gloss.bubbles.send`
- `gloss.indicators.show`
- `gloss.language.self` (also requires `volmit.language.self`)
- `volmit.language.self` (shared personal language requirement)

Dynamic permissions are `gloss.open.<menuId>`, `gloss.bubbles.style.<styleId>`, and, when enabled, `gloss.emoji.<emojiId>`.

Each feature page contains the less common commands and accepted values.
