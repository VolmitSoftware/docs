---
title: "Talon: Installation"
description: "Requirements, installation, downloaded files, and updates"
published: true
date: 2026-10-25T07:15:44.815Z
tags: "talon, installation"
editor: markdown
dateCreated: 2026-10-14T00:00:00.000Z
---

Talon supports Minecraft 26.1 through 26.3 on Java 25 or newer. The supported range includes patch releases.

## Requirements

| Item | Required value |
|---|---|
| Minecraft | 26.1 through 26.3, including patch releases |
| Java | 25 or newer |
| Platform targets | Spigot, Paper, Purpur, Leaf, Folia, Canvas |

World and container access on Folia and other region-threaded servers stays within loaded, owned regions. Extra mining skips unavailable blocks; Remote Loot leaves undeliverable items at their source. Talon does not load chunks to complete an ability.

On region-threaded servers such as Folia and Canvas, book recipes register during server startup. Changing recipe ingredients requires a full server restart; configuration reload and crafting permission/enable switches remain live. See [Configuration](/talon/03-configuration).

## Install

1. Stop the server and back up its files.
2. Place `Talon.jar` in `plugins/`, replacing any previous Talon jar.
3. Start the server with an internet connection for its first library download.
4. Run `/talon status`, then open `/talon config` in-game.

The first start downloads the required libraries. Keep the library cache for later offline restarts.

## Files

All paths are inside `plugins/Talon/`.

| Path | Purpose |
|---|---|
| `config.toml` | Server settings |
| `abilities.toml` | Per-ability limits, recipes, and optional patterns |
| `acquisition.toml` | Optional loot, trading, and enchanting book sources |
| `harvest.toml` | Optional crop harvesting |
| `progression.toml` | Optional paid book purchases |
| `.libs/` | Downloaded libraries and relocated copies |
| `cache/runtime/` | Extracted runtime from a packed distribution |
| `languages/en_US.toml` | Editable English messages |
| `languages/<locale>.toml` | Installed translations and custom languages |
| `languages/language-preferences.properties` | Saved personal language choices |
| `data/players/<uuid>.json` | Personal activation preferences |
| `data/purchases/<uuid>.json` | Latest purchase transaction and settlement stage |
| `debug/` | Local diagnostic reports |

Abilities, mining modes, and container links live on tool items. Keep player and world data in normal server backups.

## Update or remove

Stop the server, replace the Talon jar, and restart. Keep the data folder and library cache. For an offline installation, copy the complete data folder from a successful first start with the same distribution. Region-threaded servers reject managed Talon plugin reload/unload requests; use a server restart for those operations. Enabling Talon after server startup leaves book crafting unavailable until the next server restart.

To remove Talon, stop the server and remove its jar. Keep a backup of the data folder if you may reinstall it. Stored tool metadata remains on existing items but does not activate abilities without Talon.

## Related pages

- [Configuration *Settings and hot reload*](/talon/03-configuration)
- [Languages *Translations and personal selections*](/talon/04-languages)
- [Diagnostics *Status, update notices, and reports*](/talon/07-diagnostics)
{.links-list}
