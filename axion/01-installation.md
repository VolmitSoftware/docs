---
title: "Axion: Installation"
description: "Server requirements, installation, and data files"
published: true
date: 2026-10-28T00:00:00.000Z
tags: "axion, automation"
editor: "markdown"
dateCreated: 2026-10-15T00:00:00.000Z
---

Axion requires Minecraft 26.1 through 26.3 on Java 25 or newer. Its supported server software is Spigot, Paper, Purpur, Leaf, Folia, and Canvas.

## Requirements

| Item | Requirement |
| --- | --- |
| Minecraft | 26.1 through 26.3, including patch releases |
| Java | 25 or newer |
| Server software | Spigot, Paper, Purpur, Leaf, Folia, Canvas |
| First start | Network access for runtime library downloads |

| Platform | Operating limits |
| --- | --- |
| Spigot, Paper, Purpur, Leaf | World changes use the server scheduler; owners must be online |
| Folia, Canvas | Work stops at unowned regions; paid Vault upgrades are disabled when Folia scheduling is active |

Native spawn-protection availability also depends on the server implementation. An unavailable protection decision pauses affected block changes unless a verified native-protection bypass applies.

## Install

1. Stop the server and put `Axion.jar` in its `plugins` directory.
2. Start the server. Axion checks the runtime, downloads its libraries, then creates its configuration and language files.
3. Run `/axion status`, then `/axion config` in game to adjust settings.

Gson, TOML, and Adventure libraries are downloaded separately from the plugin. The plugin includes the SlimJar loader and the VolmLib classes it uses. Available cached dependencies are reused on later starts.

## Files

All paths below are relative to `plugins/Axion/`.

| Path | Contents |
| --- | --- |
| `config.toml` | Operator settings |
| `languages/<locale>.toml` | Editable messages |
| `languages/language-preferences.properties` | Player language choices |
| `storage/machines.index` | Registered controller locations |
| `storage/pending-output.bin` | Retained output awaiting delivery or review |
| `storage/auth.key` | Secret used to authenticate portable machine items |
| `debug/` | Local diagnostic reports |

Keep the complete data folder when updating, including `storage/auth.key`. Restore that key only from a trusted backup of this server.

## Update or remove

Stop the server and back up its worlds and Axion data folder before replacing the jar. `general.updateNotifications` controls release notices. The notifier does not install updates.

Before removing Axion, empty and collect placed controllers. Stop the server, remove the jar, and keep a backup of its data folder and affected worlds.

## Related pages

- [Configuration *Settings and hot reload*](/axion/03-configuration)
- [Languages *Catalog installation and local edits*](/axion/04-languages)
- [Diagnostics *Startup and protection failures*](/axion/07-diagnostics)
{.links-list}
