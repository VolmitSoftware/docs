---
title: "BileTools — Installation"
description: "Requirements and first-run setup"
published: true
date: 2026-09-04T04:02:05.398Z
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

The configuration rename is a hard break. Delete the obsolete `plugins/BileTools/config.yml` before upgrading, which permanently removes its local settings, then restart the server to generate `plugins/BileTools/biletools.yml`. BileTools does not migrate the old file.

## Verifying it works

Build any plugin directly into the server's `plugins/` folder. BileTools waits
for the jar to become stable and stages an immutable copy. After an automatic
reload batch finishes, the next automatic batch waits at least three seconds. A
burst of changes is queued into a latest-wins trailing batch. If nothing happens, check
[Configuration](/biletools/configuration). The plugin may be in
`watcher.ignore`. `watcher.only` may be an allowlist that excludes the plugin.

Build and FTP workflows may write to a temporary name and atomically rename it
to `.jar`. BileTools ignores `.jar.part` files. A brief delete-and-recreate of a
known jar is protected by a three-second deletion grace period.

## Language

Set `language` in `biletools.yml`. Bundled locales: German, Spanish, Finnish,
French, Hebrew, Italian, Japanese, Korean, Lithuanian, Dutch, Polish,
Portuguese, Russian, Turkish, Vietnamese, Simplified Chinese, Traditional
Chinese.

Canonical English lives in the Java catalog at
`src/main/java/com/volmit/bile/localization/BileMessages.java`. BileTools generates
`languages/en_US.toml` from it on first run. Omitted entries in any locale file
resolve from code-owned English.

Every repository language file and the generated English file document each case-sensitive placeholder by purpose. BileTools-owned keys use the direct TOML sections `command`, `parameter`, `error`, `message`, and `gui`; shared keys use `director` and `language`, and there is no outer `bile` table.

The active `languages/<locale>.toml` reloads automatically after a complete valid save. Invalid edits leave the current messages active.

Language files now use direct TOML catalogs. Retired `language.yml`, YAML locale catalogs, and `languages/overrides/` files are ignored. Move wanted values into the matching `languages/<locale>.toml` file before upgrading.
