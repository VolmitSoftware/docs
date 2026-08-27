---
title: "BileTools — Installation"
description: "Requirements and first-run setup"
published: true
date: 2026-08-27T00:00:00.000Z
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
2. Restart the server. BileTools writes `plugins/BileTools/biletools.yml` and
   `language.yml` on first run.
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
`src/main/java/com/volmit/bile/localization/BileMessages.java`. There is no
English bundle file. `language.yml` is an overrides-only file. Omitted
entries resolve from the selected bundle, then from code-owned English.

Automatic `language.yml` changes drain native events without reading the file
on each coordinator pass. A daemon IO worker captures immutable bytes after an
event and runs an exact-content fallback every 2.5 seconds, including for a
same-metadata save missed by native watching. Successful automatic reloads use
the same three-second minimum cadence and queue the newest snapshot while a
reload is pending. Invalid intermediate files are retried, and a temporary
missing file is left untouched rather than being replaced during an atomic or
FTP save. Startup or an explicit reload still creates the default when the file
is genuinely absent. The watcher and its IO worker close when BileTools is
disabled or reloaded.

The former top-level `locale` key is rejected. Move that selection to `language` in `biletools.yml`; to reset the override file, delete `plugins/BileTools/language.yml`, which permanently removes its local message overrides, and restart BileTools to regenerate it. No locale key is migrated.

## Building from source

```
git clone https://github.com/VolmitSoftware/BileTools.git
cd BileTools
./gradlew build
```

Gradle must run on Java 25 or newer. If the JVM is older, the build fails
immediately. In the VolmitSoftware workspace, `./gradlew buildPsychoLT` keeps
the renamed `BileTools.jar` deployment in the managed test-server drop-ins and
also copies the versioned runtime jar to `../PluginOuts/`.
