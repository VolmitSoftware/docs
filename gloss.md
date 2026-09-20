---
title: Gloss
description: Set up Gloss displays, menus, chat effects, scoreboards, and server text
published: true
date: 2026-09-20T02:38:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-21T00:31:30.433Z
---

For proxy tablists, scoreboards, surfaces, connection messages, and MOTD management, see [Velocity Proxy](/gloss/27-velocity). The instructions below cover the server edition.

Gloss draws text, menus, and item displays in the world and on the HUD: holograms, panels, scoreboards, tablists, chat effects, and the server-list MOTD.

<section class="volmit-headliner" aria-labelledby="gloss-editor-headline">
  <p class="volmit-headliner__kicker">Gloss / Web editor</p>
  <h2 id="gloss-editor-headline">Build and preview Gloss layouts in the browser.</h2>
  <p>Edit menus, panels, holograms, scoreboards, and other Gloss documents with forms, JSON tools, and visual previews.</p>
  <nav class="volmit-headliner__actions" aria-label="Gloss web editor">
    <a href="https://gloss.volmitsoftware.com/">Open Gloss Editor</a>
    <a href="/gloss/18-web-editor-tutorial">Editor tutorial</a>
  </nav>
</section>

## At a glance

| Requirement | Value |
|---|---|
| Server | Minecraft 26.1.2 through 26.3; see [Getting Started](/gloss/01-getting-started) for server-platform requirements |
| Java | 25 |
| Commands | `/gloss`, `/hologram`, and `/board` |
| Files | `plugins/Gloss/gloss.toml` and JSON documents under `plugins/Gloss/` |

> HoloUI is part of Gloss. Its menus, boards, previews, and item icons now use Gloss commands, permissions, and files. Gloss imports an existing `plugins/holoui/` folder on first start.
{.is-info}

## Start here

- [Velocity Proxy *Install proxy tablists, scoreboards, surfaces, connection messages, and MOTD management*](/gloss/27-velocity)
- [Getting Started *Install Gloss and check the generated files*](/gloss/01-getting-started)
- [Configuration *Change feature switches and runtime settings*](/gloss/02-configuration)
- [Commands & Permissions *Find commands and access nodes*](/gloss/17-commands-permissions)
{.links-list}

## Display and server text

- [Holograms](/gloss/04-holograms)
- [Scoreboards & Groups](/gloss/05-scoreboards-groups)
- [Tablist](/gloss/06-tablist)
- [Server List MOTD](/gloss/06b-server-list-motd)
- [Connection Messages](/gloss/26-connection-messages)
- [Emoji, Text & Animations](/gloss/07-emoji-text-animations)
- [Chat Bubbles](/gloss/08-chat-bubbles)
- [Damage Indicators](/gloss/08b-damage-indicators)
- [Drop Labels](/gloss/08c-drop-labels)
- [Entity Overlays](/gloss/20-entity-overlays)
{.links-list}

## Menus and previews

- [Hologram Menus](/gloss/09-menus)
- [Components & Hitboxes](/gloss/10-components-hitboxes)
- [Icons](/gloss/11-icons)
- [Actions](/gloss/12-actions)
- [Expressions & Placeholders](/gloss/13-expressions-placeholders)
- [Custom Items & Item Providers](/gloss/14-custom-items)
- [Container Previews](/gloss/15-container-previews)
- [Panels](/gloss/16-panels)
{.links-list}

## Server administration

- [Data Files & Hot Reload](/gloss/03-data-files)
- [Web Editor & Sync](/gloss/18-web-editor)
- [Web editor tutorial](/gloss/18-web-editor-tutorial)
- [Localization](/gloss/19-localization)
- [Particle Layers](/gloss/25-particle-layers)
{.links-list}

## Developer API

- [API: Getting Started](/gloss/21-api-getting-started)
- [API: Menus](/gloss/22-api-menus)
- [API: Placeholders](/gloss/23-api-placeholders)
- [API: Previews](/gloss/24-api-previews)
{.links-list}

## Support

- [Discord *Support and development chat*](https://volmitsoftware.com/discord)
- [GitHub *Source and issue tracker*](https://github.com/VolmitSoftware/Gloss)
{.links-list}
