---
title: Static - Installation and configuration
description: Runtime files, editable settings, and tracking filters
published: true
date: 2026-09-10T00:00:00.000Z
tags: static, configuration
editor: markdown
dateCreated: 2026-09-10T00:00:00.000Z
---

Install `Static.jar` on a Bukkit-compatible Minecraft 1.20.1+ server. Static targets Java 17 bytecode; use the Java version required by the server itself. VolmLib is included in the jar, and no database or companion plugin is required.

The plugin directory contains:

```text
Static/
  config.toml
  data/players.json
  languages/en_US.toml
  languages/<selected-locale>.toml
  languages/language-preferences.properties
  debug/
```

Only `en_US.toml` is generated at startup. Additional language files appear when installed from the repository or supplied by the operator. The preference file is created when a personal selection is saved. The statistics file is written asynchronously during operation and at shutdown. Diagnostic files are created on request.

Open `/static config` to edit settings. Boolean settings toggle on click; numeric settings accept left/right adjustments, Shift multipliers, and exact chat input. Text/list settings accept private chat input with `cancel` and a 60-second timeout. Lists use commas; `none` clears a list.

| TOML setting | Default | Behavior |
|---|---|---|
| `general.enabled` | `true` | Enables counters and eligible online time; stored profiles remain readable when disabled |
| `general.language` | `en_US` | Server default for players without personal selections |
| `tracking.autosaveSeconds` | `60` | Clamped to 10–3600 seconds |
| `tracking.leaderboardLimit` | `10` | Entries per ranking page; clamped to 1–25 |
| `tracking.excludedWorlds` | `[]` | Case-insensitive world names excluded from tracking |
| `tracking.trackCreative` | `false` | Permits tracking in creative mode |
| `tracking.trackSpectator` | `false` | Permits tracking in spectator mode |
| `hotReload.enabled` | `true` | Applies stable external config and installed-language edits |
| `hotReload.pollIntervalMillis` | `1000` | Poll interval, clamped to 250–60000 ms |
| `hotReload.cooldownMillis` | `1500` | Quiet period, clamped to 250–60000 ms |
| `hotReload.notifyOperators` | `true` | Sends action-bar feedback to permitted operators |
| `presentation.splashScreen` | `true` | Prints the startup banner |
| `presentation.commandSounds` | `true` | Enables brief success/failure sounds |
| `debug.uploadEnabled` | `true` | Allows explicit diagnostic uploads to mclo.gs |

Invalid configuration syntax or structure keeps the last valid runtime settings active during reload. Saving an editor change validates the candidate and replaces the file atomically. Back up `data/players.json` while the server is stopped; do not edit it while Static is saving.

[Commands and languages](/static/02-commands-languages) · [Statistics](/static/03-statistics)
