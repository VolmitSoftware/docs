---
title: "Gloss"
description: "Gloss display suite: holograms, menus, panels, container previews, scoreboards, tablist, chat"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-18T00:00:00.000Z
---

Gloss draws holograms, holographic menus, and world-anchored panels. It also draws look-at container previews, scoreboards, tablist text, emoji chat, chat bubbles, damage and heal indicators, dropped-item labels, and a randomized server-list MOTD.

| | |
|---|---|
| Commands | `/gloss` (`gl`, `glo`, `gg`), `/hologram` (`holo`, `h`), `/board` (`sb`, `bd`) |
| Servers | Paper, Purpur, Leaf, Folia, Canvas, Spigot — Minecraft 26.1.2 – 26.2 |
| Java | 25 |
| Folia | Supported (`folia-supported: true` in `paper-plugin.yml`) |
| Configuration | `plugins/Gloss/config.toml`, commented and hot-reloading |
| Content | JSON documents under `plugins/Gloss/`, with shipped defaults |
| Web editor | [Web Editor & Sync](/gloss/18-web-editor) |
| Integrations | PlaceholderAPI, Vault, WorldGuard, ten item plugins, and live metrics from the other Volmit plugins — all optional |

> **HoloUI is part of Gloss.** Menus, panels (former HoloUI "boards"), container previews, custom item icons, and the web editor live in this plugin. The `/holoui` command, the `holoui.*` permissions, and `plugins/holoui/` are gone. Gloss imports an existing `plugins/holoui/` folder on first start. [Commands & Permissions](/gloss/17-commands-permissions) lists the command and permission map.
{.is-info}

> Gloss ships two descriptors. Paper-family servers read `paper-plugin.yml` and load at `STARTUP`. Spigot reads `plugin.yml` and loads at `POSTWORLD`.
{.is-info}

### Getting started

- [Getting Started](/gloss/01-getting-started)
- [Configuration](/gloss/02-configuration)
- [Data Files & Hot Reload](/gloss/03-data-files)
{.links-list}

### Display systems

- [Holograms](/gloss/04-holograms)
- [Scoreboards & Groups](/gloss/05-scoreboards-groups)
- [Tablist & Server List MOTD](/gloss/06-tablist-motd)
{.links-list}

### Chat and text

- [Emoji, Text & Animations](/gloss/07-emoji-text-animations)
- [Chat Bubbles, Indicators & Drops](/gloss/08-bubbles-indicators-drops)
{.links-list}

### Menus, panels and previews

- [Hologram Menus](/gloss/09-menus)
- [Components & Hitboxes](/gloss/10-components-hitboxes)
- [Icons](/gloss/11-icons)
- [Actions](/gloss/12-actions)
- [Expressions & Placeholders](/gloss/13-expressions-placeholders)
- [Custom Items & Item Providers](/gloss/14-custom-items)
- [Container Previews](/gloss/15-container-previews)
- [Panels](/gloss/16-panels)
{.links-list}

### Reference

- [Commands & Permissions](/gloss/17-commands-permissions)
- [Web Editor & Sync](/gloss/18-web-editor)
- [Localization](/gloss/19-localization)
- [Runtime Architecture](/gloss/20-runtime-architecture)
{.links-list}

### Developer API

- [API: Getting Started](/gloss/21-api-getting-started)
- [API: Menus](/gloss/22-api-menus)
- [API: Placeholders](/gloss/23-api-placeholders)
- [API: Previews](/gloss/24-api-previews)
{.links-list}


## Support

- [Discord *Support and development chat*](https://volmitsoftware.com/discord)
- [GitHub *Source and issue tracker*](https://github.com/VolmitSoftware/Gloss)
{.links-list}
