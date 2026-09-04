---
title: "BileTools: Installation"
description: "Requirements and first-run setup"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "biletools, installation"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

## Requirements

| | |
|---|---|
| Runtime JVM | Java 17+ |
| Compile target | Bukkit/Paper API 1.20.1 |
| `api-version` | `1.20` |

## Platform support

| Runtime | Support | Notes |
|---|---|---|
| Paper | Primary | Public PluginManager load path |
| Purpur | Primary | Paper-family. Same load and unload paths |
| Leaf | Primary | Paper-family fork. Treated like Paper |
| Folia | Supported | GlobalRegionScheduler only. Hot-reload is best-effort |
| Canvas | Supported | Folia fork. Same regionized scheduling rules |
| Spigot | Best-effort | The target plugin must support Spigot |

## Install

1. Copy `BileTools-x.x.x.jar` into `plugins/`.
2. Restart the server. BileTools writes `plugins/BileTools/biletools.yml` and
   `languages/en_US.toml` on first run.
3. Build a plugin into `plugins/`.
4. Watch the console for the reload.

Older `plugins/BileTools/config.yml` files are not migrated. Copy any settings you still need, remove the old file, and restart to generate `biletools.yml`.

## Verifying it works

Build a plugin into the server's `plugins/` folder and watch the console. BileTools waits for the jar to stop changing before it reloads. If nothing happens, check `watcher.ignore` and `watcher.only` in [Configuration](/biletools/configuration).

Temporary `.jar.part` files are ignored. A brief delete and recreate has a three-second grace period.

## Language

Set `language` in `biletools.yml`. Bundled locales: German, Spanish, Finnish,
French, Hebrew, Italian, Japanese, Korean, Lithuanian, Dutch, Polish,
Portuguese, Russian, Turkish, Vietnamese, Simplified Chinese, Traditional
Chinese.

English is generated as `languages/en_US.toml`. Missing entries use the built-in English text. Valid edits to the active locale reload automatically; invalid edits leave the current messages active.

Current language files use TOML. Older `language.yml`, YAML catalogs, and `languages/overrides/` files are ignored.
