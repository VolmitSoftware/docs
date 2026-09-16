---
title: "BileTools: Installation"
description: "Requirements and first-run setup"
published: true
date: 2026-09-16T00:00:00.000Z
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
| Velocity | Supported | Proxies 3.4 and newer, including 4.x. Manages proxy plugins only |

## Install

1. Copy `BileTools-x.x.x.jar` into `plugins/`.
2. Restart the server. BileTools writes `plugins/BileTools/biletools.yml` and
   `languages/en_US.toml` on first run.
3. Build a plugin into `plugins/`.
4. Watch the console for the reload.

Older `plugins/BileTools/config.yml` files are not migrated. Copy any settings you still need, remove the old file, and restart to generate `biletools.yml`.

## Velocity proxies

The same jar runs on a Velocity proxy. Copy `BileTools-x.x.x.jar` into the proxy's `plugins/` directory and start the proxy; it needs Velocity 3.4 or newer, including 4.x, on the JVM that proxy build requires (Velocity 4.x runs on Java 25).

Proxy settings live in `plugins/biletools/biletools.json`, not in `biletools.yml`, and the proxy edition uses the libraries Velocity already provides instead of downloading its own. The proxy command set and its limits are on the [Velocity proxy](/biletools/velocity) page.

## Runtime libraries

BileTools downloads Gson, TOML, and Adventure before plugin startup instead of bundling them in its jar. The first start needs access to the library repositories. SlimJar caches the libraries under `plugins/BileTools/.libs/` and reuses them on later starts and self-reloads. Keep this directory when moving an installation to a server without internet access.

The libraries use BileTools-specific package names to avoid conflicts with server libraries and other plugins. Missing libraries must load successfully before BileTools can enable.

## Automatic reload

BileTools waits for a jar in `plugins/` to stop changing before it reloads the plugin. If nothing happens, check `watcher.ignore` and `watcher.only` in [Configuration](/biletools/configuration).

Temporary `.jar.part` files are ignored. A brief delete and recreate has a three-second grace period.

## Language

Set `language` in `biletools.yml`. Bundled locales: German, Spanish, Finnish,
French, Hebrew, Italian, Japanese, Korean, Lithuanian, Dutch, Polish,
Portuguese, Russian, Turkish, Vietnamese, Simplified Chinese, Traditional
Chinese.

English is created on startup as editable `languages/en_US.toml` when missing. Missing or invalid messages use the built-in English text. Changes to a readable active language file reload automatically; malformed TOML leaves the current messages active.
