---
title: "Getting Started"
description: "Install Gloss, check its files, and choose which features to enable"
published: true
date: 2026-09-20T02:20:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-18T00:00:00.000Z
---

For proxy tablists, scoreboards, surfaces, connection messages, and MOTD management, see [Velocity Proxy](/gloss/27-velocity). The instructions below cover the server edition.

Put the Gloss jar in `plugins/` and start the server once. Settings live in `plugins/Gloss/gloss.toml`; display content lives in JSON files under `plugins/Gloss/`. Most edits reload automatically.

## Requirements

| Item | Value |
|---|---|
| Server | Paper, Purpur, Leaf, Folia, Canvas or Spigot |
| Minecraft | `26.1.2 - 26.3` |
| Java | 25 |
| Plugin version | `3.0.3-26.2`, api-version `26.1` |

Use a build of your chosen server software that supports your Minecraft version.

Gloss works without optional dependencies. PlaceholderAPI adds `%...%` tokens, Vault adds group conditions, and supported item plugins provide custom item icons.

## Install

1. Put the Gloss jar in `plugins/`.
2. Start the server. Gloss creates `plugins/Gloss/` and its default files.
3. Edit `gloss.toml`. A save reloads Gloss in place.

The first start needs internet access to download Gloss's own libraries.

## What the first boot creates

The first boot creates the config, language file, and defaults for enabled features:

```
plugins/Gloss/
├── gloss.toml            every runtime knob, commented, clamped and hot-reloading
├── languages/             translations installed when selected
│   ├── en_US.toml          editable English messages, generated at startup
│   └── language-preferences.properties  persistent player language choices
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

Enabling a document-backed feature extracts its defaults on reload; `previews` needs a restart before `previews/` appears. Gloss creates no default holograms, panels or images. Document paths, schema versions and reset commands are on [Data Files & Hot Reload](/gloss/03-data-files).

## Feature toggles

The `[features]` table in `gloss.toml` switches each subsystem on or off. `motd` and `connections`
are the only features off by default, and enabling `panels` or `previews` after startup requires a
restart. The full table is on [Configuration](/gloss/02-configuration). Read
[Server List MOTD](/gloss/06b-server-list-motd) before enabling `motd` alongside another MOTD
plugin.

## Coming from HoloUi

On first boot, Gloss can import menus, images, panels, preview definitions, preview scales and settings from `plugins/holoui` or `plugins/HoloUi`. It does not change the source folder or copy session secrets.

Use `/gloss`, `gloss.*` and `%gloss_*%` instead of the old HoloUi names. HoloUi boards are called panels; Gloss uses "board" for scoreboards. See [Data Files & Hot Reload](/gloss/03-data-files).

## Next steps

- [Configuration](/gloss/02-configuration)
- [Data Files & Hot Reload](/gloss/03-data-files)
- [Commands & Permissions](/gloss/17-commands-permissions)
{.links-list}
