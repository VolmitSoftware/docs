---
title: BileTools
description: BileTools developer utility — overview
published: true
date: 2026-08-09T00:00:00.000Z
tags: biletools
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

BileTools is a development utility. Its purpose is removing the reload step from the plugin
development loop.

**Root command:** `/biletools` (aliases `bile`, `bi`, `b`, `volmit`, `vomit`, `vom`)
**Folia:** supported

## What it does

- **Hot reload on write.** Any plugin jar modified while the server is running — by a Maven
  build, a Gradle export, or a drag-and-drop — is automatically reloaded. Hit build in your
  IDE and it is already in game.
- **Hot drop.** New jars added to the plugins folder are loaded without a restart.
- **Plugman equivalent.** Load, unload, reload, install, and uninstall plugins by command.

## Compatibility

| Runtime | Support | Notes |
|---|---|---|
| Paper | Primary | Public PluginManager load path; hot-unload is best-effort |
| Purpur | Primary | Paper-family, same load and unload paths |
| Leaf | Primary | Paper-family fork, treated like Paper |
| Folia | Supported | GlobalRegionScheduler only; hot-reload is best-effort |
| Canvas | Supported | Folia fork, same regionized scheduling rules |
| Spigot | Best-effort | `paper-plugin.yml`-only jars are rejected; dual-descriptor jars load via `plugin.yml` |

- `api-version`: `26.2`
- Compile target: Paper API `26.2`
- Runtime JVM: Java 25+
- Lifecycle mutations always run on the global/main thread, never on plugin-ops or network threads

## Where to go next

| Page | Covers |
|---|---|
| [Installation](/biletools/installation) | Setup and the production warning |
| [Commands & Permissions](/biletools/commands) | The `/bile` tree |

## Support

[Discord](https://discord.gg/volmit) · [Source](https://github.com/VolmitSoftware/BileTools)
