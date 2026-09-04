---
title: "Getting Started"
description: "Install Gloss, check its files, and choose which features to enable"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-18T00:00:00.000Z
---

Put the Gloss jar in `plugins/` and start the server once. Settings live in `plugins/Gloss/gloss.toml`; display content lives in JSON files under `plugins/Gloss/`. Most edits reload automatically.

## Requirements

| Item | Value |
|---|---|
| Server | Paper, Purpur, Leaf, Folia, Canvas or Spigot |
| Minecraft | `26.1.2 - 26.2` |
| Java | 25 |
| Plugin version | `3.0.1-26.2`, api-version `26.1` |

Gloss works without optional dependencies. PlaceholderAPI adds `%...%` tokens, Vault adds group conditions, and supported item plugins provide custom item icons.

## Install

1. Put the Gloss jar in `plugins/`.
2. Start the server. Gloss creates `plugins/Gloss/` and its default files.
3. Edit `gloss.toml`. A save reloads Gloss in place. `/gloss reload` (permission `gloss.admin`) does the same thing on demand.

## What the first boot creates

The first boot creates the config, language file, and defaults for enabled features:

```
plugins/Gloss/
├── gloss.toml            every runtime knob, commented, clamped and hot-reloading
├── language.yml           sparse message overrides
├── languages/             translations installed when selected
├── language-preferences.properties  persistent player language choices
├── tablist.json           conditional tablist header, footer and list-name presentations
├── boards/                conditional scoreboard sidebars (default.json and animation-showcase.json included)
├── emoji/                 one JSON per emoji (67 included)
├── animations/            one JSON per text animation (10 effects included)
├── bubbles/               conditional chat bubble styles (default.json included)
├── damage-indicators/     conditional damage and healing presentations (default.json included)
├── real-drops/            conditional display-backed drop presentation (default.json included)
├── menus/                 inert starter menu (default.json included)
└── previews/              container preview documents (14 included)
```

`tablist.json` and `motd.json` sit at the root of the data folder.

Other paths appear only when Gloss has data to store:

| Path | Written when |
|---|---|
| `holograms/` | The first hologram is saved |
| `images/` | You put an image file in |
| `panels/` | The first panel is created |
| `motd.json` | `[features] motd` is turned on |
| `preview-scales.json` | Shutdown, and whenever a player finishes adjusting a preview scale. Holds every per-player scale that is not 1.0 |
| `bubble-styles.json` | A player picks a personal chat bubble style |
| `editor-sync-sessions.json` | A web editor sync session is created. Importers never copy session secrets |
| `editor-sync-transactions/` | A web editor publication is in flight |
| `editor-sync-backups/<id>/` | A web editor publication replaced at least one file |
| `custom-items.json` | `/gloss item export` runs. Regenerable, so nothing preserves it |
| `holoui-import.json` | The HoloUi importer runs. Its presence is what stops the boot-time import re-running |
| `import-backups/<timestamp>/` | An explicit `/gloss import legacy` rewrites at least one file |

## Defaults

Gloss extracts a bundled default only when its target file is missing. Existing files are not overwritten during startup.

| Folder | Documents | Extracted while |
|---|---|---|
| `emoji/` | 67 | `[features] emoji` |
| `animations/` | `rainbow`, `marquee`, `timeline`, `typewriter`, `flash`, `wipe`, `scanner`, `decode`, `odometer`, `wave` | `[features] animations` |
| `boards/` | `default.json`, `animation-showcase.json` | `[features] boards` |
| `bubbles/` | `default.json` | `[features] chatBubbles` |
| `damage-indicators/` | `default.json` | `[features] damageIndicators` |
| `real-drops/` | `default.json` | `[features] realDrops` |
| `menus/` | `default.json` | `[features] menus` |
| `previews/` | 14 | `[features] previews` |
| `tablist.json` | one singleton document | `[features] tablist` |
| `motd.json` | one singleton document | `[features] motd` |

Enabling a document-backed feature extracts its defaults on reload. Enabling `previews` requires a restart before `previews/` appears.

Gloss does not create default holograms, panels, or images. Reset commands are listed on [Data Files & Hot Reload](/gloss/03-data-files).

## Feature toggles

The `[features]` table in `gloss.toml` controls each subsystem. Most changes apply on reload. Enabling `panels` or `previews` after startup requires a restart.

| Key | Default | Gates |
|---|---|---|
| `holograms` | `true` | The hologram engine |
| `boards` | `true` | Scoreboard sidebars |
| `tablist` | `true` | Tablist header/footer and list-name management |
| `emoji` | `true` | Emoji replacement in chat and rendered content |
| `animations` | `true` | Text animations |
| `chatBubbles` | `true` | Chat bubbles above players |
| `damageIndicators` | `true` | Floating damage and heal indicators |
| `drops` | `true` | Custom names on dropped item stacks |
| `realDrops` | `true` | Display-backed dropped-item models, motion and labels |
| `menus` | `true` | Holographic menus |
| `panels` | `true` | World-anchored panels |
| `previews` | `true` | Look-at container previews |
| `motd` | `false` | The custom server list MOTD |

`motd` is the only feature disabled by default. See [Tablist & Server List MOTD](/gloss/06-tablist-motd) before enabling it alongside another MOTD plugin.

## Coming from HoloUi

On first boot, Gloss can copy data from `plugins/holoui` or `plugins/HoloUi`. It does not change the source folder or copy session secrets. The one-time result is recorded in `holoui-import.json`.

Use `/gloss`, `gloss.*`, and `%gloss_*%` instead of the old HoloUI names. HoloUI boards are called panels; Gloss uses "board" for scoreboards. See [Data Files & Hot Reload](/gloss/03-data-files).

## Current conditional document versions

Boards and tablist use schema 2, bubble styles use schema 4, and damage indicators and real drops use schema 3. Gloss ignores other schema versions. Rewrite custom files or restore a bundled default with its reset command. `/gloss import legacy` does not translate old boards, groups, or tablist files. See [Expressions & Placeholders](/gloss/13-expressions-placeholders#conditional-documents).

## Next steps

- [Configuration](/gloss/02-configuration)
- [Data Files & Hot Reload](/gloss/03-data-files)
- [Commands & Permissions](/gloss/17-commands-permissions)
{.links-list}
