---
title: "ByteCompanions: Installation"
description: "Requirements, platform notes, first start, file locations, updating, and uninstalling"
published: true
date: 2026-10-25T00:00:00.000Z
tags: "bytecompanions, installation"
editor: markdown
dateCreated: 2026-10-08T00:00:00.000Z
---

This page covers what ByteCompanions needs, what happens on the first start, where its files live, and how to update or remove it.

## Requirements

| Item | Value |
|---|---|
| Minecraft | 26.1 through 26.3, including patch releases |
| Java | 25 or newer |
| Server software | Spigot, Paper, Purpur, Leaf, Folia, Canvas |
| Plugin `api-version` | `'26.1'` |
| Folia | `folia-supported: true`; companions, menus, and storage callbacks run on entity and region schedulers |

The plugin checks the server version and the Java version in its constructor, before it downloads any library. On anything else it refuses to start and logs the found version next to the supported range. See [Diagnostics](/bytecompanions/10-diagnostics#common-failures) for the exact line.

Native adapters are selected by family. Minecraft 26.1 and 26.2 share one Paper adapter and one Spigot adapter; 26.3 has its own pair. There is no setting for this.

## Platform notes

| Platform | Difference |
|---|---|
| Spigot | The general experience pickup buff (`vanilla.experience`) and the general `experience` booster channel need Paper events. With buffs or boosters enabled on Spigot, those entries must stay disabled or the file is rejected. The four source-specific experience channels work. Item names, lore, and inventory titles use Bukkit string conversion, so hover text and translatable components become plain colored text. |
| Folia and Canvas | Money costs need a Vault economy provider whose plugin declares Folia support. Without one, money purchases are unavailable; item and free costs still work. |

Paper, Purpur, and Leaf behave the same.

## Install

1. Stop the server.
2. Copy `bytecompanions-<version>-26.1-26.3.jar` into `plugins/`.
3. Optionally install PlaceholderAPI, WorldGuard with WorldEdit, Vault with an economy provider, Nexo, or ItemsAdder. They are soft dependencies. See [Integrations](/bytecompanions/09-integrations).
4. Start the server.

## First start

The first start downloads the plugin's libraries into `plugins/ByteCompanions/.libs/` and verifies each file. Later starts reuse the cache. A download failure stops the plugin; the console names the library and the network error.

After the libraries load, the plugin writes `config.toml`, the eight starter companion files, the feature files, `languages/en_US.toml`, and the `storage/` folder for the default `json` backend. Then it prints the splash (unless `presentation.splashScreen` is false) and this line:

```none
ByteCompanions ready in <ms> ms with <Folia region|Bukkit main-thread> scheduling and <N> companion definitions.
```

## File locations

All paths are relative to `plugins/ByteCompanions/`.

| Path | Contents |
|---|---|
| `config.toml` | Root settings. See [Configuration](/bytecompanions/03-configuration). |
| `languages/<locale>.toml` | Message catalogs, generated when a locale is first used. See [Languages](/bytecompanions/04-languages). |
| `languages/language-preferences.properties` | Personal language choices by player UUID. |
| `companions/<id>.toml` | One companion definition per file. Fresh installs receive `bee`, `copper`, `lantern`, `mushroom`, `myself`, `rainbow`, `scout`, and `warrior`. |
| `features/attributes/config.toml` | Attribute modifiers by companion. |
| `features/buffs/config.toml` | Experience, loot, and drop buffs by companion. |
| `features/decorations/config.toml` | Static decoration placements and their tick settings. |
| `features/effects/config.toml` | Potion effects by companion. |
| `features/particles/config.toml` | Particle text format and movement settling thresholds. |
| `features/particles/icons.toml` | Menu icons for the 34 particle effects. |
| `features/progression/config.toml` | Level thresholds, XP sources, upgrade tracks, level rewards, and boosters. |
| `storage/companions/`, `storage/collections/`, `storage/particles/`, `storage/progression/` | One JSON document per record when `storage.backend` is `json` (the default). |
| `storage/bytecompanions.db` | The SQLite database when `storage.backend` is `sqlite`. |
| `<storage.h2.directory>/storage.mv.db` | The embedded H2 database when `storage.backend` is `h2`. |
| `storage/progression-server-id.txt` | Installation ID used when progression `server-id` is `local`. |
| `.libs/` | Downloaded libraries, created on first start. |
| `debug/` | Diagnostic reports written by `/bytecompanions debug dump`. |

Back up `storage/` to keep player state; it holds every collection for the json, sqlite, and h2 backends.

## Updating

1. Stop the server.
2. Replace the jar in `plugins/`.
3. Start the server. Existing `config.toml`, companion, feature, and language files are kept. Unknown keys in `config.toml` are rejected, so remove any key the console reports.

Replacing or removing the jar always needs a restart. Hot reload covers the files under the data folder only.

With `general.updateNotifications` on, the plugin checks the GitHub releases of `VolmitSoftware/ByteCompanions` once when it starts and tells operators and players with `bytecompanions.update` on join when a newer release exists. Nothing is downloaded. `/volmit plugins updates` shows the shared report.

## Uninstalling

1. Stop the server.
2. Delete `plugins/bytecompanions-<version>-26.1-26.3.jar`.
3. Delete `plugins/ByteCompanions/` to remove settings, companion files, languages, and the stored player data of the json, sqlite, and h2 backends. Keep the folder to preserve them for a later install.
4. If you use MySQL, drop the ByteCompanions tables yourself; the plugin never deletes remote data.

## Related pages

- [Configuration *Every setting and the hot reload rules*](/bytecompanions/03-configuration)
- [Languages *Language files and the server default*](/bytecompanions/04-languages)
- [Diagnostics *Status, debug dump, and common failures*](/bytecompanions/10-diagnostics)
{.links-list}
