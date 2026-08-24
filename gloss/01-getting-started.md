---
title: "Getting Started"
description: "Gloss documentation: Getting Started"
published: true
date: 2026-08-23T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-18T00:00:00.000Z
---

Put the Gloss jar in `plugins/` and start the server once. Gloss writes the data tree with working defaults. Settings live in `plugins/Gloss/config.toml`. Content lives in JSON documents beside that file. Both reload from disk while the server runs. Most changes need no restart and no command.

## Requirements

| Item | Value |
|---|---|
| Server | Paper, Purpur, Leaf, Folia, Canvas or Spigot |
| Minecraft | `26.1.2 - 26.2` |
| Java | 25 |
| Plugin version | `3.0.0-26.2`, api-version `26.1` |

Nothing else is required. Gloss soft-depends on PlaceholderAPI, Vault, ProtocolLib, ProtocolSupport, ViaVersion, ViaBackwards, ViaRewind, Geyser-Spigot, CraftEngine, ItemsAdder, Oraxen, Nexo, MMOItems, ExecutableItems, EcoItems, Slimefun, MythicMobs, HeadDatabase and WorldGuard. Each of those loads before Gloss when it is installed. Gloss skips a missing one. Without PlaceholderAPI, `%...%` tokens stay raw. Without Vault, no player resolves a group.

On Paper-family servers Gloss loads at `STARTUP` from `paper-plugin.yml`. That file also declares `folia-supported: true`; the three root commands are registered through Paper's `LifecycleEvents.COMMANDS` registrar. On Spigot it loads at `POSTWORLD` and binds the commands declared in `plugin.yml`: `/gloss` (aliases `gl`, `glo`, `gg`), `/hologram` (`holo`, `h`) and `/board` (`sb`, `bd`). Both descriptors declare the same permission tree.

## Install

1. Put the Gloss jar in `plugins/`.
2. Start the server. Gloss creates `plugins/Gloss/`, writes `config.toml`, extracts the shipped default documents, and prints a splash banner that ends in a startup status. `READY` means every service enabled. If any enable step throws, Gloss prints the failed startup status, tears down everything already started, and rethrows so the server disables the plugin instead of leaving a partial runtime loaded.
3. Edit `config.toml`. A save reloads Gloss in place. `/gloss reload` (permission `gloss.admin`) does the same thing on demand.

If you set `splashScreen = false`, Gloss hides the banner for clean startups only. A failed enable always prints the banner and the startup error before the exception is propagated.

## What the first boot creates

Gloss never creates a folder it has nothing to put in. A first boot writes the config, the language
file and the shipped defaults of the features that are enabled. Nothing else exists yet:

```
plugins/Gloss/
├── config.toml            every runtime knob, commented, clamped and hot-reloading
├── language.yml           locale selection and message overrides
├── tablist.json           tablist header, footer and per-group list-name formats
├── boards/                one JSON per scoreboard sidebar (default.json and animation-showcase.json shipped)
├── emoji/                 one JSON per emoji (67 shipped)
├── animations/            one JSON per text animation (10 effects shipped)
├── bubbles/               one JSON per chat bubble style (default.json shipped)
├── real-drops/             display-backed drop settings (default.json shipped)
└── previews/              container preview documents (14 shipped)
```

`tablist.json` sits at the root of the data folder. It does not sit inside a `tablist/` folder, and
neither does `motd.json` when it appears.

Every other path is created the first time something is actually written into it. An empty folder is
never left lying around, and deleting one does not bring it back on the next hot-reload pass — it
returns when a document is saved:

| Path | Written when |
|---|---|
| `holograms/` | The first hologram is saved |
| `menus/` | The first menu document is written |
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
| `import-backups/<timestamp>/` | The in-place legacy migration rewrites at least one file |

## Shipped defaults

Gloss extracts default documents only where the target file is missing. An edited file is never overwritten. A deleted file comes back on the next boot. What ships:

| Folder | Documents | Extracted while |
|---|---|---|
| `emoji/` | 67 | `[features] emoji` |
| `animations/` | `rainbow`, `marquee`, `timeline`, `typewriter`, `flash`, `wipe`, `scanner`, `decode`, `odometer`, `wave` | `[features] animations` |
| `boards/` | `default.json`, `animation-showcase.json` | `[features] boards` |
| `bubbles/` | `default.json` | `[features] chatBubbles` |
| `real-drops/` | `default.json` | `[features] realDrops` |
| `previews/` | 14 | `[features] previews` |
| `tablist.json` | one singleton document | `[features] tablist` |
| `motd.json` | one singleton document | `[features] motd` |

A feature that is off ships nothing, which is why a stock first boot has no `motd.json` — `motd` is
the one feature that defaults to `false`. Turning `motd`, `tablist`, `emoji`, `animations`, `boards`,
`chatBubbles` or `realDrops` on extracts its defaults on the config reload, without a restart. `previews` is the
exception: the preview registry is only built during enable, so turning that feature on takes a
restart before `previews/` appears.

Nothing ships for `holograms/`, `panels/`, `menus/` or `images/`. Those folders do not exist until you put something in them. The blank hologram and blank menu baselines used by `/gloss hologram create` and `/gloss menu new` are read from inside the jar. They are never written to disk. Details and the per-kind reset commands are on [Data Files & Hot Reload](/gloss/03-data-files).

## Feature toggles

`[features]` in `config.toml` gates each subsystem. An effective off state stops that subsystem
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

`motd` is the only feature that ships off. If you turn it on, the shipped `motd.json` takes over the server list ping at once. See [Tablist & Server List MOTD](/gloss/06-tablist-motd).

## Coming from HoloUi

HoloUi is merged into Gloss. If a `plugins/holoui` (or `plugins/HoloUi`) folder still exists beside the Gloss data folder on first boot, Gloss copies its data across. The source folder is never modified. The copy runs exactly once. Session secrets are never copied. The import writes `holoui-import.json` and lists every path it touched.

Commands, permissions and placeholders all moved. `/holoui ...` is gone. Use the `/gloss` subtrees. `holoui.*` permissions became `gloss.*`. `%holoui_*%` placeholders became `%gloss_*%`. HoloUi "boards" (world-anchored hologram menus) are now called panels. Gloss keeps the name "board" for scoreboards. The full import contract is on [Data Files & Hot Reload](/gloss/03-data-files).

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
