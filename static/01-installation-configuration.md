---
title: Static - Installation and configuration
description: Runtime files, editable settings, and tracking filters
published: true
date: 2026-09-19T00:00:00.000Z
tags: static, configuration
editor: markdown
dateCreated: 2026-09-10T00:00:00.000Z
---

| | |
|---|---|
| Server software | Any Bukkit-compatible server on Minecraft 1.20.1 or newer |
| Java | Whatever your server version needs, at least 17 |
| Main command | `/static` |
| Config file | `plugins/Static/config.toml` |
| Required plugins | None. No database either |

Put `Static.jar` in `plugins/` and restart.

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

`/static config` edits settings in game. Click a boolean to toggle it; numbers take left and right clicks, Shift for bigger steps, or an exact value typed in chat. Text and list settings use a chat prompt with `cancel` and a 60-second timeout. Lists are comma-separated, and `none` clears one.

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

An invalid file keeps the last valid settings active.

> Back up `data/players.json` with the server stopped. Do not edit it while Static is running.
{.is-warning}

[Commands and languages](/static/02-commands-languages) · [Statistics](/static/03-statistics)
