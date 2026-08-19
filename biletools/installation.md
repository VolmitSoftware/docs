---
title: "BileTools — Installation"
description: "Requirements and first-run setup"
published: true
date: 2026-08-19T00:00:00.000Z
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
| Purpur | Primary | Paper-family. Same load and unload paths |
| Leaf | Primary | Paper-family fork. Treated like Paper |
| Folia | Supported | GlobalRegionScheduler only. Hot-reload is best-effort |
| Canvas | Supported | Folia fork. Same regionized scheduling rules |
| Spigot | Best-effort | `paper-plugin.yml`-only jars are rejected. Dual-descriptor jars load via `plugin.yml` |

## Install

1. Copy `BileTools-x.x.x.jar` into `plugins/`.
2. Restart the server. BileTools writes `plugins/BileTools/config.yml` and
   `language.yml` on first run.
3. Build a plugin into `plugins/`.
4. Watch the console for the reload.

## Verifying it works

Build any plugin directly into the server's `plugins/` folder. BileTools unloads
and reloads it within one or two seconds. If nothing happens, check
[Configuration](/biletools/configuration). The plugin may be in
`watcher.ignore`. `watcher.only` may be an allowlist that excludes the plugin.

## Language

Set `locale` in `language.yml`. Bundled locales: German, Spanish, Finnish,
French, Hebrew, Italian, Japanese, Korean, Lithuanian, Dutch, Polish,
Portuguese, Russian, Turkish, Vietnamese, Simplified Chinese, Traditional
Chinese.

Canonical English lives in the Java catalog at
`src/main/java/com/volmit/bile/localization/BileMessages.java`. There is no
English bundle file. Entries in `language.yml` are sparse overrides. Omitted
entries resolve from the selected bundle, then from code-owned English.

## Building from source

```
git clone https://github.com/VolmitSoftware/BileTools.git
cd BileTools
./gradlew build
```

Gradle must run on Java 25 or newer. If the JVM is older, the build fails
immediately.
