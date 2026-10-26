---
title: Coffer installation and compatibility
description: Requirements, first start, files, updates, diagnostics, and reload limits
published: true
date: 2026-10-25T00:00:00.000Z
tags: coffer, installation
editor: markdown
dateCreated: 2026-10-17T00:00:00.000Z
---

This page covers Coffer's requirements, what happens on first start, the files it creates, update notices, diagnostics, and its reload limits. Runtime validation for each version is recorded in the [feature map](/coffer/04-feature-map).

## Requirements

| Item | Value |
| --- | --- |
| Minecraft | 26.1 through 26.3, including patch releases |
| Java | 25 or newer |
| Server software | Paper, Purpur, Leaf, Folia, and Canvas |
| Folia | Supported; player and vault work runs on the owning region or entity scheduler |

| Platform | Supported | Reason |
| --- | --- | --- |
| Paper | Yes | |
| Purpur | Yes | |
| Leaf | Yes | |
| Folia | Yes | |
| Canvas | Yes | |
| Spigot | No | Coffer uses Paper item byte serialization, entity serialization flags, Paper events, and entity schedulers. |

Coffer checks the server before it loads anything else. On another Minecraft version, or on Java older than 25, the plugin constructor throws `Coffer requires Minecraft 26.1 through 26.3 (including patch releases) on Java 25 or newer; found Minecraft <version> and Java <version>.` and the server does not enable it.

## Install

1. Stop the server.
2. Place the Coffer jar in `plugins/`. The build produces `coffer-<version>-26.1-26.3.jar` in `build/libs/` and stages the same jar as `BUILDS/Coffer.jar`.
3. Start the server, then run `/coffer status`.

VolmLib is bundled inside the jar and is not installed as a separate plugin.

## First start

The first start downloads Coffer's runtime libraries through SlimJar. The console logs `Loading libraries...` and then `Libraries loaded.`; later starts reuse the downloaded cache.

When `presentation.splashScreen` is `true`, Coffer prints a splash with its version, server, supported Minecraft range, Java version, and date. With `presentation.alternateSplashes` also `true`, about one start in ten uses alternate art. If enable fails, the standard splash prints, the full exception is logged, and Coffer disables itself.

Coffer refuses to enable while players are online. Local storage opens asynchronously after enable. When it is ready the console logs `Coffer ready in <ms> ms with <scheduler> scheduling and <n> live vaults.`, where the scheduler is `Folia region` or `Bukkit main-thread`. A storage failure logs the full exception and disables Coffer.

## Files

| Path under `plugins/Coffer/` | Contents |
| --- | --- |
| `config.toml` | Settings; see [configuration and languages](/coffer/03-configuration-languages) |
| `languages/en_US.toml` | Editable English messages, written on first start |
| `languages/<locale>.toml` | Locale files an operator installs |
| `languages/language-preferences.properties` | Players' personal language selections |
| `storage/` | Vault records, journals, receipts, fences, and recovery decisions; see [local storage](/coffer/06-local-storage) |
| `debug/` | Reports written by `/coffer debug dump` |

Live transfers also write native player checkpoints to `players/data` under the server's main level directory, which must be writable. An exclusive lock stops two Coffer processes from opening the same `storage/` root.

## Updates

Operators and players with `coffer.update` get a notice on join when a newer Coffer release exists on GitHub. Coffer checks once when it starts, nothing is downloaded or installed, and `general.updateNotifications` turns checks off. `/volmit plugins updates` shows the shared report and checks again at most once every 5 minutes. Coffer has no public repository or release yet, so the checker reports its version as unknown.

To update, stop the server, replace the jar, and start the server again. Keep the complete stopped server together with the [coordinated backup tool](/coffer/09-backup-restore) before replacing the jar. The tool runs from the same jar with `java -jar Coffer.jar backup help` without starting the server or downloading libraries.

## Diagnostics

`/coffer status` shows the version, the compatibility line (Java version, Bukkit range, scheduler), storage state and queued writes, live, deleted, and damaged vault counts, the metrics, update check, and hot reload states, and active transfers.

`/coffer debug dump` writes a report to `plugins/Coffer/debug/coffer-v<version>-debugdump-<time>.txt`. Coffer's section lists the bytecode and runtime Java versions, the supported Minecraft range, the scheduler, the server language and whether translation downloads are published, whether vaults are enabled, storage state, edit sessions, guarded transfers and recoveries, metrics state, the update notice and hot reload settings, and the effective configuration. It contains no credentials or tokens. The upload parameter defaults to `true`: the report is also uploaded to mclo.gs when `debug.uploadEnabled` is `true`, and `/coffer debug dump upload=false` keeps it local. A failed upload never removes the local file. `/volmit plugins debug` includes Coffer.

Coffer submits anonymous usage statistics to bStats under plugin ID 34915 while `metrics.enabled` is `true`. The global `plugins/bStats/config.yml` opt-out still applies.

## Integrations

Coffer registers the VolmLib integration service, which React, Gloss, and BileTools read. It publishes three metrics: `coffer.active-transfers`, `coffer.open-sessions`, and `coffer.storage-queue`.

## Reloading and restarts

Configuration and language files reload from disk without a command. BileTools can reload Coffer only while no players are online and no transfers are active. Otherwise it refuses with `Coffer reloads only while no players are online; restart the server instead` or `Coffer is completing item transfers`. Other plugin unloaders are not supported; use a full restart. See [live transfers and recovery](/coffer/08-live-transfers) for shutdown draining and the limits on other plugins writing player state.

## Related pages

- [Commands and permissions](/coffer/02-commands-permissions)
- [Configuration and languages](/coffer/03-configuration-languages)
- [Feature map](/coffer/04-feature-map)
- [Local storage](/coffer/06-local-storage)
- [Coordinated backup and restore](/coffer/09-backup-restore)
{.links-list}
