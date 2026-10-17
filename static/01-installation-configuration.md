---
title: Static - Installation and configuration
description: Runtime files, editable settings, and tracking filters
published: true
date: 2026-10-17T00:00:00.000Z
tags: static, configuration
editor: markdown
dateCreated: 2026-09-10T00:00:00.000Z
---

Install `Static.jar` in `plugins/` and restart the server. Static requires Minecraft 26.1 through 26.3 and Java 25 or newer.

| | |
|---|---|
| Minecraft | 26.1 through 26.3, including patch releases within those versions |
| Platform targets | Spigot, Paper, Purpur, Leaf, Folia, Canvas |
| Java | 25 or newer |
| Main command | `/static` |
| Config file | `plugins/Static/config.toml` |
| Required plugins | None. No database either |

Static rejects Minecraft versions earlier than 26.1 and versions 26.4 or newer before starting its services. Use Java 25 or newer for the server process.

The plugin directory contains:

```none
Static/
  .libs/
  config.toml
  storage/players.json
  storage/modules.json
  storage/profile-preferences.json
  storage/profile-visibility.json
  languages/en_US.toml
  languages/<selected-locale>.toml
  languages/language-preferences.properties
  dashboard/access-token
  debug/
```

Only `en_US.toml` is generated at startup. Other languages download when selected. Preference and visibility files appear when needed; the dashboard token appears when its listener is enabled. Static saves statistics asynchronously during operation and at shutdown. Diagnostic files are created on request.

The first start downloads Gson, TOML4J, and Adventure libraries into `.libs/`; later starts reuse that cache. Allow outbound access to the configured Maven repositories during initial installation. Library downloads and translation downloads are independent.

If a required library cannot download or load, Static does not enable. Check the console error and outbound access, then restart to retry; stored statistics are not replaced. A missing translation does not prevent plugin startup: missing or invalid messages use English, and an unavailable catalogue can be selected again after connectivity returns.

`/static config` edits settings in game. Click a boolean to toggle it; numbers take left and right clicks, Shift for bigger steps, or an exact value typed in chat. Text and list settings use a chat prompt with `cancel` and a 60-second timeout. Lists are comma-separated, and `none` clears one.

| TOML setting | Default | Behavior |
|---|---|---|
| `general.enabled` | `true` | Enables counters and eligible online time; stored profiles remain readable when disabled |
| `general.language` | `en_US` | Server default for players without personal selections |
| `general.updateCheckerEnabled` | `true` | Checks GitHub releases and notifies permitted operators; does not install updates |
| `general.metricsEnabled` | `false` | Enables bStats only when a registered positive plugin ID is configured |
| `general.bstatsPluginId` | `34591` | Static's registered ID; an explicit `0` disables reporting |
| `modules.enabled` | `true` | Accepts observations from registered plugin modules when global recording is enabled |
| `modules.disabledModules` | `[]` | Exact `plugin:module` IDs excluded from recording; saved values remain readable |
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

An invalid file keeps the last valid settings active. Settings for [ranking qualification and details](/static/03-statistics), [history retention](/static/05-history-records), [milestones and seasons](/static/06-milestones-seasons), and [web access](/static/07-dashboard-privacy) are described on their feature pages.

The release checker uses `VolmitSoftware/Static`. bStats uses ID `34591` and respects its global opt-out. Reporting is off by default. These settings apply through hot reload.

> Back up `plugins/Static/storage/` with the server stopped. Do not edit its files while Static is running.
{.is-warning}

## Uninstalling

Static keeps everything it records in `plugins/Static/`. It uses no database and does not write to worlds, items, or player data, so removing its folder removes all of its state.

1. If you may want the statistics later, stop the server and copy `plugins/Static/storage/` and `config.toml` somewhere safe.
2. Stop the server and delete `Static.jar` from `plugins/`.
3. Delete `plugins/Static/`. It holds the configuration, installed languages and language choices, every recorded statistic and history under `storage/`, the dashboard access token, and diagnostic reports.
4. Leave `plugins/bStats/` in place unless no remaining plugin on the server uses bStats; that folder is shared.
5. If you exposed the dashboard through a reverse proxy, remove that proxy route.
6. Remove `%static_…%` placeholders from other plugins' configuration. Without Static, PlaceholderAPI leaves them unreplaced.

> Deleting `plugins/Static/` permanently erases every player's statistics, sessions, personal bests, milestones, season results, and privacy choices. Back up `storage/` first if there is any chance you will need them.
{.is-danger}

To start fresh, stop the server, delete `plugins/Static/`, keep `Static.jar` in `plugins/`, and start the server. Static creates a new `config.toml` and English language file and starts with no recorded players. To clear all recorded player data but keep your settings and languages, delete only `plugins/Static/storage/`.

[Commands and languages](/static/02-commands-languages) · [Statistics](/static/03-statistics)
