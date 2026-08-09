---
title: "BileTools — Installation"
description: "Requirements and setup"
published: true
date: 2026-08-09T00:00:00.000Z
tags: "biletools, installation"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

## Requirements

| | |
|---|---|
| Runtime JVM | Java 25+ |
| Compile target | Paper API 26.2 |
| `api-version` | `26.2` |

## Platform support

| Runtime | Support | Notes |
|---|---|---|
| Paper | Primary | Public PluginManager load path |
| Purpur | Primary | Paper-family, same load and unload paths |
| Leaf | Primary | Paper-family fork, treated like Paper |
| Folia | Supported | GlobalRegionScheduler only; hot-reload is best-effort |
| Canvas | Supported | Folia fork, same regionized scheduling rules |
| Spigot | Best-effort | `paper-plugin.yml`-only jars are rejected; dual-descriptor jars load via `plugin.yml` |

## Install

1. Drop `BileTools-x.x.x.jar` into `plugins/`.
2. Restart the server. `plugins/BileTools/config.yml` and `language.yml` are written on first run.
3. Build a plugin into `plugins/` and watch the console for the reload.

## Verifying it works

Build any plugin directly into the server's `plugins/` folder. Within a second or two you
should see BileTools unload and re-load it. If nothing happens, check
[Configuration](/biletools/configuration) — the plugin may be in `watcher.ignore`, or
`watcher.only` may be set to an allowlist that excludes it.

## Language

Set `locale` in `language.yml`. Bundled locales: German, Spanish, Finnish, French, Hebrew,
Italian, Japanese, Korean, Lithuanian, Dutch, Polish, Portuguese, Russian, Turkish,
Vietnamese, Simplified Chinese, Traditional Chinese.

Canonical English lives in the Java catalog at
`src/main/java/com/volmit/bile/localization/BileMessages.java`; there is no English bundle
file. Entries you add to `language.yml` are sparse overrides — anything omitted resolves from
the selected bundle, then from code-owned English.

## Building from source

```
git clone https://github.com/VolmitSoftware/BileTools.git
cd BileTools
./gradlew build
```

Gradle must run on Java 25 or newer; the build fails fast otherwise.
