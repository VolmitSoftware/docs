---
title: "Brimstone: Installation"
description: "Requirements, first start, file locations, updating, and removal"
published: true
date: 2026-11-02T00:00:00.000Z
tags: "brimstone, installation"
editor: markdown
dateCreated: 2026-10-08T00:00:00.000Z
---

This page covers what Brimstone needs, what happens on first start, where its files live, and how to update or remove it.

## Requirements

| Item | Value |
|---|---|
| Minecraft | 26.1 through 26.3, including patch releases |
| Java | 25 or newer |
| Server software | Spigot, Paper, Purpur, Leaf, Folia, and Canvas |
| Network | Needed on first start to download runtime libraries |
| Optional plugin | [WorldGuard](/brimstone/06-integrations) |

The same jar runs on every listed platform. On Folia and Canvas, Brimstone uses region and entity scheduling. On any other Minecraft version or an older Java release, it stops before downloading libraries and logs the version it found.

## Install

1. Stop the server and back up its worlds and plugin data.
2. Place `Brimstone.jar` in `plugins/`, replacing any previous jar.
3. Start the server. Check the console for `Brimstone ready`, then run `/brimstone status`.

A separate VolmLib plugin is not required.

## First start

Brimstone downloads its runtime libraries, and later starts reuse that cache. It then writes `config.toml` with default settings and `languages/en_US.toml` from its built-in English messages. Other languages download when [first selected](/brimstone/04-languages).

## Files

All paths are relative to `plugins/Brimstone/`.

| Path | Purpose |
|---|---|
| `config.toml` | Server settings and launcher definitions |
| `languages/<locale>.toml` | Editable messages for one locale |
| `languages/.upstream/` | Last downloaded copy of each repository locale, managed by the plugin |
| `languages/language-preferences.properties` | Saved personal language choices |
| `debug/` | Local diagnostic reports |

## Updating

Stop the server, replace the jar, and start it again. Your `config.toml` and language edits stay in place, and new English messages are added to `languages/en_US.toml`. Prefer a full restart over unloading the plugin while the server runs.

When a newer release exists on GitHub, players with `brimstone.update` are told at startup. See [update notices](/brimstone/07-diagnostics#update-notices).

## Removing

Stop the server and delete `Brimstone.jar`. Delete `plugins/Brimstone/` as well to remove settings and language files. Launcher items already in inventories stay as named TNT and behave as ordinary TNT without the plugin.

## Related pages

- [Configuration *Every setting and how file changes apply*](/brimstone/03-configuration)
- [Brimstone languages *Language files and custom locales*](/brimstone/04-languages)
- [Diagnostics *Status, reports, and console messages*](/brimstone/07-diagnostics)
{.links-list}
