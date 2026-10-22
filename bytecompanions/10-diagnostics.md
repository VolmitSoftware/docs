---
title: "ByteCompanions: Diagnostics"
description: "The status entries, debug dump, report upload, bStats, update notices, and common failures"
published: true
date: 2026-10-16T00:00:00.000Z
tags: "bytecompanions, diagnostics"
editor: markdown
dateCreated: 2026-10-08T00:00:00.000Z
---

This page explains what `/bytecompanions status` and `/bytecompanions debug dump` report, how uploads, statistics, and update notices are controlled, and what the common startup failures look like in the console.

## Status

`/bytecompanions status` needs `bytecompanions.command` and prints five entries.

| Entry | Contents |
|---|---|
| Configuration | `general.enabled`, the server language, and whether hot reload is on |
| Runtime | Registered companion definitions, loaded players, and equipped companions |
| Features and storage | The enabled feature packs, or `none`, and the `storage.backend` value |
| Integrations | PlaceholderAPI, WorldGuard, Vault, Nexo, and ItemsAdder, each `ready` or `absent` |
| Compatibility | Java major version, the supported Minecraft range, `Folia region` or `Bukkit main-thread` scheduling, and the selected native adapter |

## Debug dump

`/bytecompanions debug dump` needs `bytecompanions.debug` and writes a report under `plugins/ByteCompanions/debug/`. With `upload=true` (the default) and `debug.uploadEnabled` on, the report is also posted to mclo.gs and the link is sent back; `upload=false` keeps it local. The file is written either way.

The shared part of the report covers the server, JVM, and plugin list. The ByteCompanions section adds:

| Line | Meaning |
|---|---|
| Active, Generation | Whether the runtime is up and how many times it has been replaced |
| Native adapter, Storage type | The selected adapter family and `storage.backend` |
| Companion definitions, Loaded players | Current counts |
| Update interval, Viewer refresh delay, View distance | The `performance` values in use |
| Configuration source, Default language | Where the configuration came from and `general.language` |
| Active decorations, Player load failures | Decoration count and failed player loads |
| Player tick tasks, Active player companions, Completed player ticks, Player tick failures | Companion tick scheduler counters |
| Storage queue `<name>` active players, pending operations, failures, closed | One group per storage queue |
| Particle batches, packet entries, viewer deliveries, packet deliveries | Cumulative particle traffic since the plugin loaded |
| Feature `<name>` | Each feature pack and its state |

Credentials, JDBC URLs, player names, and configuration contents are not included.

## Statistics

`metrics.enabled` (default `true`) submits anonymous usage statistics to bStats under plugin ID 34587. The global `plugins/bStats/config.yml` opt-out overrides it. Changing the key applies on the next hot reload.

## Update notices

`general.updateNotifications` (default `true`) checks the GitHub releases of `VolmitSoftware/ByteCompanions` once per hour. Operators and players with `bytecompanions.update` get one chat line on join when a newer release exists. Nothing is downloaded or installed. Until the first release is published the check reports `Version unknown`.

`/volmit plugins [languages|debug|updates]` is shared by every Volmit plugin: it lists them, changes their server language together, writes one combined debug report, and shows the update report for all of them.

## Common failures

| Console line | Cause and fix |
|---|---|
| `ByteCompanions requires Minecraft 26.1-26.3 (including patch releases) on Java 25; found Minecraft <version> on Java <major>.` | Unsupported server or Java version. Run a 26.1 through 26.3 server on Java 25. |
| A library download error on first start, naming the library and the network error | The server could not reach the download repository. Check connectivity or a proxy, then restart; the plugin resumes from the cache in `.libs/`. |
| `storage.mysql.username must not be blank when backend is mysql` | `storage.backend` is `mysql` without credentials. Fill in `storage.mysql.host`, `database`, `username`, and `password`. |
| `Rejected ByteCompanions file changes; the last known good settings remain active.` | A saved file failed validation. The lines above it name the file and the key; fix the file and save again. |
| `WorldGuard companion restrictions failed for <world>; visuals and bonuses are suspended` | WorldGuard region data could not be read. Companions and bonuses stay off in that world until the next successful query. |

## Related pages

- [Installation *First start and the ready line*](/bytecompanions/01-installation)
- [Configuration *The `debug`, `metrics`, and `general` sections*](/bytecompanions/03-configuration)
- [Commands and permissions *The `debug` and `status` commands*](/bytecompanions/02-commands-permissions)
{.links-list}
