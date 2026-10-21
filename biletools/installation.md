---
title: "BileTools: Installation"
description: "Requirements and first-run setup"
published: true
date: 2026-10-21T00:00:00.000Z
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

## Building from source

Run `./gradlew build` (or `.\gradlew.bat build` on Windows) with Java 25. A sibling `VolmLib` checkout is used automatically. The selected `build/libs/BileTools-<version>-packed.jar` contains the server and Velocity editions. After registering the source workspace, `projects build biletools --target bukkit` in Multiplexor builds the same artifact in an isolated source copy. See [Project builds](/servermultiplexor/13-project-builds) for named export and deployment destinations.

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

Install the selected distribution jar as the only BileTools jar. Each build automatically selects the smaller ordinary or XZ package. If it selects XZ, startup verifies and extracts the bundled runtime to `plugins/BileTools/cache/runtime/`, which must be writable. Later starts reuse the verified cache. Extraction needs no network access. Downloads for other libraries and language files still apply.

1. Copy `BileTools v<version> [CraftBukkit] 1.20.1-26.3.jar` into `plugins/`.
2. Restart the server. BileTools writes `plugins/BileTools/biletools.yml` and
   `languages/en_US.toml` on first run.
3. Copy a built plugin jar into `plugins/`.
4. Watch the console for the reload.

## Velocity proxies

The same jar runs on a Velocity proxy 3.4 or newer, including 4.x. Copy it into the proxy's `plugins/` directory and start the proxy. Proxy settings live in `plugins/biletools/biletools.json`, not `biletools.yml`, and the proxy edition uses the libraries Velocity already provides. See [Velocity proxy](/biletools/velocity).

## Runtime libraries

BileTools downloads Gson, TOML, and Adventure on first start rather than bundling them, so that start needs access to the library repositories. They are cached under `plugins/BileTools/.libs/` and reused afterwards; keep that directory when moving an installation to a server without internet access. BileTools will not enable until they load.

## Automatic reload

BileTools waits for a jar in `plugins/` to stop changing before it reloads the plugin. If nothing happens, check `watcher.ignore` and `watcher.only` in [Configuration](/biletools/configuration).

Temporary `.jar.part` files are ignored. A brief delete and recreate has a three-second grace period.

## Language

Set `language` in `biletools.yml`. Editing a language file reloads it automatically; malformed TOML leaves the current messages active. See [Languages](/languages).

## Uninstalling

BileTools stores nothing in worlds, chunks, or player data. Plugin jars it loaded, reloaded, or received by remote deploy stay in `plugins/` and load normally without it.

> Deleting `plugins/BileTools/` also deletes the archived plugin jars in `library/`. Back up any you still need first.
{.is-warning}

1. Keep any archived jars you need. With `archive-plugins` enabled, BileTools copies each plugin jar into `plugins/BileTools/library/<plugin>/<version>.jar` at startup and before `/bile uninstall` deletes it. `/bile library` lists them.
2. If another server pushes jars to this one, remove this server from that server's `remote-deploy.master.master-deploy-to` list.
3. Stop the server or proxy.
4. Delete `BileTools v<version> [CraftBukkit] 1.20.1-26.3.jar` from `plugins/` on every server and Velocity proxy that has it.
5. Delete the folders BileTools created:

| Location | Contents |
|---|---|
| Server `plugins/BileTools/` | `biletools.yml`, `languages/`, `library/`, downloaded libraries in `.libs/`, `cache/runtime/`, `debug/` reports, and recovery and staging copies |
| Proxy `plugins/biletools/` | `biletools.json`, `archive/`, and recovery and staging copies |
| Proxy `plugins/BileTools/` | `cache/runtime/` extracted from an XZ jar |
| `plugins/bStats/` | Shared by every plugin that uses bStats. Delete it only when no remaining plugin uses bStats |
{.dense}

On Spigot, `plugins/BileTools/runtime-plugins/` can contain symbolic links to other plugins' data folders. Delete the links, not the folders they point to; `rm -r` removes links without following them.

### Starting fresh

1. Complete the steps above.
2. Copy the jar into `plugins/` and start the server. The first start downloads Gson, TOML, and Adventure into `plugins/BileTools/.libs/`. On a server without internet access, put a saved copy of `.libs/` back before starting.
