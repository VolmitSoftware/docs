---
title: "Temper: Installation"
description: "Server requirements, library downloads, and data locations"
published: true
date: 2026-11-02T00:00:00.000Z
tags: "temper, installation"
editor: markdown
dateCreated: 2026-10-15T00:00:00.000Z
---

Temper targets Minecraft 26.1 through 26.3 on Java 25 or newer. Startup checks the runtime before downloading libraries. Versions outside that range are rejected.

## Platforms

| Platform | Requirement |
|---|---|
| Spigot, Paper, Purpur, Leaf, Canvas | Minecraft 26.1 through 26.3; Java 25 or newer |
| Folia | Same range; Vault money remains disabled unless the operator enables it for a suitable economy provider |

## Install and update

1. Stop the server and back up its worlds and plugin data.
2. Place the distribution `Temper.jar` in `plugins/` and remove the previous Temper jar.
3. Start the server with network access for library downloads.
4. Check `/temper status` and open `/temper config`.

Downloaded libraries are cached for later starts. Vault is optional; without it, XP, materials, and kits remain available. To uninstall, stop the server and remove the plugin jar. Keep its data folder if transaction records or station ownership may be needed later.

## Files

Paths below are relative to `plugins/Temper/`.

| Path | Contents |
|---|---|
| `config.toml` | Settings and repair profiles |
| `languages/` | Editable English, installed, and custom language catalogs |
| `languages/.upstream/` | Record of the last repository download, used to merge updates; do not edit |
| `languages/players/preferences.properties` | Saved player language selections |
| `storage/` | Station records and transaction ledger |
| `debug/` | Local diagnostic reports |

Update notices are disabled by default. The jar carries English only; other languages download from the `VolmitSoftware/Temper` repository when selected. Gloss is optional; station holograms and floating item previews require its temporary display APIs. Without those APIs, repairs and configurable sound/particle effects remain available.

## Related pages

- [Configuration *Defaults and hot reload*](/temper/03-configuration)
- [Languages *Catalog installation and editing*](/temper/04-languages)
- [Diagnostics *Status and debug reports*](/temper/08-diagnostics)
{.links-list}
