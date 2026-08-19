---
title: "Getting Started"
description: "Gloss documentation: Getting Started"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-18T00:00:00.000Z
---
Drop the Gloss jar into `plugins/`, start the server once, and the whole data tree is written with
working defaults. Settings live in `plugins/Gloss/config.toml`; content lives in JSON documents beside
it. Both hot-reload from disk while the server runs, so most changes need no restart and no command.

## Requirements

| Item | Value |
|---|---|
| Server | Paper, Purpur, Leaf, Folia, Canvas or Spigot |
| Minecraft | `26.1.2 - 26.2` (the range `/gloss version` reports) |
| Java | 25 |
| Plugin version | `3.0.0-26.2`, api-version `26.1` |

Nothing else is required. Gloss soft-depends on PlaceholderAPI, Vault, ProtocolLib, ProtocolSupport,
ViaVersion, ViaBackwards, ViaRewind, Geyser-Spigot, CraftEngine, ItemsAdder, Oraxen, Nexo, MMOItems,
ExecutableItems, EcoItems, Slimefun, MythicMobs, HeadDatabase and WorldGuard. Each of those loads
before Gloss when it is installed and is simply skipped when it is not: without PlaceholderAPI,
`%...%` tokens stay raw; without Vault, no player resolves a group.

On Paper-family servers Gloss loads at `STARTUP` from `paper-plugin.yml`, which also declares
`folia-supported: true`. On Spigot it loads at `POSTWORLD` from `plugin.yml`. Both descriptors declare
the same permission tree and the same three root commands: `/gloss` (aliases `gl`, `glo`, `gg`),
`/hologram` (`holo`, `h`) and `/board` (`sb`, `bd`).

## Install

1. Put the Gloss jar in `plugins/`.
2. Start the server. Gloss creates `plugins/Gloss/`, writes `config.toml`, extracts the shipped
   default documents and prints a splash banner ending in a startup status. `READY` means every
   service enabled. `DEGRADED` means one did not, and a `Startup error: <exception>` warning follows
   naming the cause; the plugin stays loaded with the failed services shut down.
3. Edit `config.toml`. Saving it reloads Gloss in place. `/gloss reload` (permission `gloss.admin`)
   does the same thing on demand.

Setting `splashScreen = false` suppresses the banner for clean startups only. A failed enable always
prints it, because that is where the `DEGRADED` status and the error line come from.

## What the first boot creates

```
plugins/Gloss/
├── config.toml            every runtime knob, commented, clamped and hot-reloading
├── holograms/             one JSON per persistent hologram (nothing shipped)
├── boards/                one JSON per scoreboard sidebar (default.json shipped)
├── panels/                one JSON per world-anchored panel (nothing shipped)
├── menus/                 hologram menu documents; the path under menus/ is the menu id
├── images/                image files referenced by image icons
├── previews/              container preview documents (13 shipped)
├── emoji/                 one JSON per emoji (67 shipped)
├── animations/            one JSON per text animation (rainbow.json shipped)
├── bubbles/               one JSON per chat bubble style (default.json shipped)
├── tablist.json           tablist header, footer and per-group list-name formats
├── motd.json              server list MOTD entries
└── language.yml           locale selection and message overrides
```

`tablist.json` and `motd.json` sit at the root of the data folder, not inside a `tablist/` or `motd/`
folder. `panels/` is only created when `[features] panels` is on.

Several more paths can appear later, never on a first boot:

| Path | Written when |
|---|---|
| `preview-scales.json` | Shutdown, and whenever a player finishes adjusting a preview scale. Holds every per-player scale that is not 1.0 |
| `bubble-styles.json` | A player picks a personal chat bubble style |
| `editor-sync-sessions.json` | A web editor sync session is created. Session secrets — never copied by an importer |
| `custom-items.json` | `/gloss item export` runs. Regenerable, so nothing preserves it |
| `holoui-import.json` | The HoloUi importer runs. Its presence is what stops the boot-time import re-running |
| `import-backups/<timestamp>/` | The in-place legacy migration rewrites at least one file |

## Shipped defaults

Default documents are extracted only where the target file is missing, so an edited file is never
overwritten and a deleted file comes back on the next boot. What ships:

| Folder | Documents |
|---|---|
| `emoji/` | 67 |
| `animations/` | `rainbow.json` |
| `boards/` | `default.json` |
| `bubbles/` | `default.json` |
| `previews/` | 13 |
| `tablist.json` | one singleton document |
| `motd.json` | one singleton document |

Nothing ships for `holograms/`, `panels/`, `menus/` or `images/` — those start empty. The blank
hologram and blank menu baselines used by `/gloss hologram create` and `/gloss menu new` are read from
inside the jar and are never written to disk. Details and the per-kind reset commands are on
[Data Files & Hot Reload](/gloss/03-data-files).

## Feature toggles

`[features]` in `config.toml` gates each subsystem. Turning one off stops that subsystem from
rendering or listening; its documents still load and its commands still edit them.

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
| `menus` | `true` | Holographic menus |
| `panels` | `true` | World-anchored panels |
| `previews` | `true` | Look-at container previews |
| `motd` | `false` | The custom server list MOTD |

`motd` is the only feature that ships off. Turn it on and the shipped `motd.json` takes over the
server list ping immediately; see [Tablist & Server List MOTD](/gloss/06-tablist-motd).

## Coming from HoloUi

HoloUi is merged into Gloss. If a `plugins/holoui` (or `plugins/HoloUi`) folder still exists beside
the Gloss data folder on first boot, Gloss copies its data across automatically. The source folder is
never modified, the copy runs exactly once, and session secrets are never copied. The import writes
`holoui-import.json` listing every path it touched.

Commands, permissions and placeholders all moved: `/holoui ...` is gone in favour of the `/gloss`
subtrees, `holoui.*` permissions became `gloss.*`, `%holoui_*%` placeholders became `%gloss_*%`, and
HoloUi "boards" (world-anchored hologram menus) are now called panels. Gloss keeps the name "board"
for scoreboards. The full import contract is on [Data Files & Hot Reload](/gloss/03-data-files).

## Where to go next

- [Configuration *Every knob in config.toml, with defaults and ranges*](/gloss/02-configuration)
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
- [Localization *17 shipped locales and how to override them*](/gloss/19-localization)
- [Runtime Architecture *How the pieces fit together*](/gloss/20-runtime-architecture)
- [API: Getting Started *Driving Gloss from another plugin*](/gloss/21-api-getting-started)
{.links-list}
