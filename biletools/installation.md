---
title: "BileTools: Installation"
description: "Requirements and first-run setup"
published: true
date: 2026-09-20T02:20:00.000Z
tags: "biletools, installation"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

## Requirements

| | |
|---|---|
| Runtime JVM | Java 17+; Minecraft 26.1 through 26.3 requires Java 25 |
| Compile target | Bukkit/Paper API 1.20.1 |
| `api-version` | `1.20` |

## Platform support

| Runtime | Support | Notes |
|---|---|---|
| Paper | Primary | Minecraft 1.20.1 through 26.3; public PluginManager load path |
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

The same jar runs on a Velocity proxy 3.4 or newer, including 4.x. Copy it into the proxy's `plugins/` directory and start the proxy. Proxy settings live in `plugins/biletools/biletools.json`, not `biletools.yml`, and the proxy edition uses the libraries Velocity already provides. See [Velocity proxy](/biletools/velocity).

## Runtime libraries

BileTools downloads Gson, TOML, and Adventure on first start rather than bundling them, so that start needs access to the library repositories. They are cached under `plugins/BileTools/.libs/` and reused afterwards; keep that directory when moving an installation to a server without internet access. BileTools will not enable until they load.

## Automatic reload

BileTools waits for a jar in `plugins/` to stop changing before it reloads the plugin. If nothing happens, check `watcher.ignore` and `watcher.only` in [Configuration](/biletools/configuration).

Temporary `.jar.part` files are ignored. A brief delete and recreate has a three-second grace period.

## Language

Set `language` in `biletools.yml`. Editing a language file reloads it automatically; malformed TOML leaves the current messages active. See [Languages](/languages).
