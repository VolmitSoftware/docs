---
title: HoloUI
description: HoloUI holographic UI framework — overview
published: true
date: 2026-08-09T00:00:00.000Z
tags: holoui
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

HoloUI is a holographic UI framework for Paper and Folia. It renders in-world menus and
container previews as packet-only display entities visible to a single viewer, driven by JSON
files that you author by hand or with the companion web editor, and it exposes a public Java
API for other plugins.

**Root command:** `/holoui` (aliases `holo`, `hui`, `holou`, `hu`)
**Author:** CrazyDev22
**Web editor:** [holoui.volmitsoftware.com](https://holoui.volmitsoftware.com)

## Documentation

| Page | Covers |
|---|---|
| [Overview](/holoui/00-overview) | Feature map, first steps, project layout |
| [Installation & Configuration](/holoui/01-installation-configuration) | Install, data folder, every `settings.json` key |
| [Commands & Permissions](/holoui/02-commands-permissions) | Every command, argument, and permission node |
| [Menu File Format](/holoui/03-menu-file-format) | Menu JSON structure and examples |
| [Components & Hitboxes](/holoui/04-components-hitboxes) | Component types and click planes |
| [Icons](/holoui/05-icons) | Text, item, image, and animated icons |
| [Actions](/holoui/06-actions) | Click-triggered commands and sounds |
| [Expressions & Placeholders](/holoui/07-expressions-placeholders) | PlaceholderAPI and the expression language |
| [Custom Items & Item Providers](/holoui/08-custom-items-item-providers) | ItemsAdder, Oraxen, Nexo, MMOItems and others |
| [Container Previews](/holoui/09-container-previews) | Holographic content cards for containers |
| [Localization](/holoui/10-localization) | 17 bundled locales and overrides |
| [Runtime Architecture](/holoui/11-runtime-architecture) | How rendering and scheduling work |
| [Web Editor & Schemas](/holoui/12-web-editor-schemas) | The browser-based menu builder |
| [API — Getting Started](/holoui/13-api-getting-started) | `HoloUiService` from the ServicesManager |
| [API — Menus](/holoui/14-api-menus) | Building, opening, and updating menus in code |
| [API — Placeholders](/holoui/15-api-placeholders) | Registering your own placeholders |
| [API — Previews](/holoui/16-api-previews) | Extending container previews |

## Support

[Discord](https://discord.gg/volmit) · [Source](https://github.com/VolmitSoftware/HoloUI)
