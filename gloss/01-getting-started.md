---
title: "Getting Started"
description: "Gloss documentation: Getting Started"
published: true
date: 2026-08-25
tags: "gloss"
editor: markdown
dateCreated: 2026-08-18T00:00:00.000Z
---

Put the Gloss jar in `plugins/` and start the server once. Gloss writes the data tree with working defaults. Settings live in `plugins/Gloss/gloss.toml`. Content lives in JSON documents beside that file. Both reload from disk while the server runs. Scoreboards, tablist text, bubble styles, indicators and real drops can select presentations with the same player, world, event, PlaceholderAPI and metric conditions. Most changes need no restart and no command.

## Requirements

| Item | Value |
|---|---|
| Server | Paper, Purpur, Leaf, Folia, Canvas or Spigot |
| Minecraft | `26.1.2 - 26.2` |
| Java | 25 |
| Plugin version | `3.0.0-26.2`, api-version `26.1` |

Gloss works without optional dependencies. PlaceholderAPI enables `%...%` tokens, Vault enables groups, and supported item plugins enable their item providers.

## Install

1. Put the Gloss jar in `plugins/`.
2. Start the server. Gloss creates `plugins/Gloss/` and its default files.
3. Edit `gloss.toml`. A save reloads Gloss in place. `/gloss reload` (permission `gloss.admin`) does the same thing on demand.

## What the first boot creates

Gloss never creates a folder it has nothing to put in. A first boot writes the config, the language
file and the defaults of the features that are enabled. Nothing else exists yet:

```
plugins/Gloss/
├── gloss.toml            every runtime knob, commented, clamped and hot-reloading
├── language.yml           sparse message overrides; locale selection stays in gloss.toml
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

`tablist.json` sits at the root of the data folder. It does not sit inside a `tablist/` folder, and
neither does `motd.json` when it appears.

Every other path is created the first time something is actually written into it. An empty folder is
never left lying around. Deleting one does not bring it back on the next hot-reload pass. It
returns when a document is saved:

| Path | Written when |
|---|---|
| `holograms/` | The first hologram is saved |
| `images/` | You put an image file in |
| `panels/` | The first panel is created |
| `motd.json` | `[features] motd` is turned on |
| `preview-scales.json` | Shutdown, and whenever a player finishes adjusting a preview scale. Holds every per-player scale that is not 1.0 |
| `bubble-styles.json` | A player picks a personal chat bubble style |
| `editor-sync-sessions.json` | A web editor sync session is created. Session secrets — never copied by an importer |
| `editor-sync-transactions/` | A web editor publication is in flight |
| `editor-sync-backups/<id>/` | A web editor publication replaced at least one file |
| `custom-items.json` | `/gloss item export` runs. Regenerable, so nothing preserves it |
| `holoui-import.json` | The HoloUi importer runs. Its presence is what stops the boot-time import re-running |
| `import-backups/<timestamp>/` | An explicit `/gloss import legacy` rewrites at least one file |

## Defaults

Gloss extracts default documents only where the target file is missing. An edited file is never overwritten. A deleted file comes back on the next boot. The bundled defaults are:

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

Turning `motd`, `tablist`, `emoji`, `animations`, `boards`,
`chatBubbles`, `damageIndicators`, `realDrops` or `menus` on extracts its defaults on the config reload, without a restart. `previews` is the
exception: the preview registry is only built during enable, so turning that feature on takes a
restart before `previews/` appears.

Gloss includes no defaults for `holograms/`, `panels/` or `images/`; boot-seeding a hologram or panel would place content into a real world, while an image is an operator asset. The safe menu baseline is `menus/default.json`, which is also the source for `/gloss menu new`. Details and the per-kind reset commands are on [Data Files & Hot Reload](/gloss/03-data-files).

## Feature toggles

`[features]` in `gloss.toml` gates each subsystem. An effective off state stops that subsystem
from rendering or listening. Most document-backed features keep their documents loaded and editable;
`emoji` and `animations` shut down their loaders completely but can restart on reload. Panels and
previews are selected during enable, so enabling either after it was disabled at startup requires a
restart to construct that subsystem.

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

`motd` is the only feature disabled by default. If you turn it on, the bundled `motd.json` takes over the server list ping at once. See [Tablist & Server List MOTD](/gloss/06-tablist-motd).

## Coming from HoloUi

HoloUi is merged into Gloss. If a `plugins/holoui` (or `plugins/HoloUi`) folder still exists beside the Gloss data folder on first boot, Gloss copies its data across. The source folder is never modified. The copy runs exactly once. Session secrets are never copied. The import writes `holoui-import.json` and lists every path it touched.

Commands, permissions and placeholders all moved. `/holoui ...` is gone. Use the `/gloss` subtrees. `holoui.*` permissions became `gloss.*`. `%holoui_*%` placeholders became `%gloss_*%`. HoloUi "boards" (world-anchored hologram menus) are now called panels. Gloss keeps the name "board" for scoreboards. The full import contract is on [Data Files & Hot Reload](/gloss/03-data-files).

## Current conditional document versions

Boards use schema 2, tablist uses schema 2, bubble styles use schema 3, damage indicators use schema 2 and real drops use schema 2. These are hard breaks: Gloss silently ignores documents on any other schema and does not migrate them during startup. Rewrite custom files to the current format or use the relevant reset command for a default. `/gloss import legacy` does not translate old boards, groups or tablist formats. The condition language is documented on [Expressions & Placeholders](/gloss/13-expressions-placeholders#conditional-documents).

## Where to go next

- [Configuration *Every knob in gloss.toml, with defaults and ranges*](/gloss/02-configuration)
- [Data Files & Hot Reload *The JSON document system, importers and reset commands*](/gloss/03-data-files)
- [Holograms *Persistent text displays*](/gloss/04-holograms)
- [Scoreboards & Groups *Sidebars and Vault group resolution*](/gloss/05-scoreboards-groups)
- [Tablist & Server List MOTD *Header, footer, list names and ping text*](/gloss/06-tablist-motd)
- [Emoji, Text & Animations *The text pipeline*](/gloss/07-emoji-text-animations)
- [Chat Bubbles, Indicators & Drops *Temporary hologram effects*](/gloss/08-bubbles-indicators-drops)
- [Hologram Menus *Interactive in-world menus*](/gloss/09-menus)
- [Components & Hitboxes *What a menu is built from*](/gloss/10-components-hitboxes)
- [Icons *Text, item, image and head icons*](/gloss/11-icons)
- [Actions *What a click does*](/gloss/12-actions)
- [Expressions & Placeholders *Dynamic values in documents*](/gloss/13-expressions-placeholders)
- [Custom Items & Item Providers *Icons sourced from other item plugins*](/gloss/14-custom-items)
- [Container Previews *Look-at chest and furnace previews*](/gloss/15-container-previews)
- [Panels *World-anchored menus*](/gloss/16-panels)
- [Commands & Permissions *The whole command tree*](/gloss/17-commands-permissions)
- [Web Editor & Sync *The hosted builder and the sync relay*](/gloss/18-web-editor)
- [Localization *17 included locales and how to override them*](/gloss/19-localization)
- [API: Getting Started *Driving Gloss from another plugin*](/gloss/21-api-getting-started)
{.links-list}
