---
title: "Leaderboards"
description: "Rank players by a statistic, placeholder or metric and show the rows in any text"
published: true
date: 2026-11-04T00:46:11.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-11-03T22:20:00.000Z
---

A leaderboard ranks players by a number that Gloss samples while they are online. Each file in `plugins/Gloss/leaderboards/` is one board, and its file name is the board's id. Boards draw nothing themselves. Holograms, scoreboards and other text read their rows through expressions.

## Document

`plugins/Gloss/leaderboards/playtime.json` ships with Gloss:

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "source": { "type": "statistic", "statistic": "PLAY_ONE_MINUTE" },
  "size": 10,
  "order": "desc",
  "reset": "monthly",
  "includeOffline": true,
  "format": {
    "value": "{{ fixed(value / 72000, 1) }}h",
    "name": "{{ name }}"
  },
  "sample": { "playersPerTick": 8 }
}
```

| Key | Required | Default | Notes |
|---|---|---|---|
| `schemaVersion` | yes | | Must be `1` |
| `revision` | yes | | Increase it when you edit the file |
| `source` | yes | | Where the number comes from |
| `size` | no | `10` | Rows ranked, clamped to `1`–`1000` and to `[leaderboards] maxEntries` (default `100`) |
| `order` | no | `desc` | `desc` puts the highest value first, `asc` the lowest |
| `reset` | no | `never` | `never`, `hourly`, `daily`, `weekly` or `monthly` |
| `includeOffline` | no | `true` | `false` ranks only players online at the last update |
| `format.value` | no | `{{ value }}` | Template for each row's `formatted` text |
| `format.name` | no | `{{ name }}` | Template for each row's `name` text |
| `sample.playersPerTick` | no | `8` | Players sampled per tick, clamped to `1`–`64`. The highest value across all boards applies |

## Sources

| `type` | Keys | Value |
|---|---|---|
| `statistic` | `statistic`, plus `material` or `entity` when the statistic needs one | A Bukkit `Statistic` for the player |
| `papi` | `placeholder` | A PlaceholderAPI value read as a number |
| `metric` | `key` | A per-player metric from an integration |

A misspelt statistic, or a metric without per-player values, logs `Leaderboard <id> was not loaded` and the board stays unloaded. A sample that takes more than 5 ms three times pauses that board for five minutes and logs a warning.

## Sampling and resets

Gloss samples every online player each `[leaderboards] sampleIntervalTicks` (default `1200`). Rows change when a sampling pass ends or when `/gloss leaderboard sample` runs. Players who have not been sampled are not ranked.

Resets follow UTC. A week starts on Monday and a month on the first. A reset clears the period values that rank the board and keeps all-time totals. Values are saved in `plugins/Gloss/leaderboards/state/<id>.json`.

`[features] leaderboards = false` stops sampling and leaves every variable below empty.

## Reading rows

These variables work in any `{{ }}` expression, `show` condition or `when` condition:

| Variable | Value |
|---|---|
| `leaderboard.<id>.<rank>.name` | The row's `format.name` text |
| `leaderboard.<id>.<rank>.value` | The row's number |
| `leaderboard.<id>.<rank>.formatted` | The row's `format.value` text |
| `leaderboard.<id>.<rank>.uuid` | The player's UUID |
| `leaderboard.<id>.<rank>.rank` | The rank itself |
| `leaderboard.<id>.size` | Rows currently ranked |
| `leaderboard.<id>.resetAt` | The next reset, in epoch seconds. `0` when the board never resets |
| `leaderboard.<id>.me.rank` | The viewer's rank, or `0` when they are not ranked |
| `leaderboard.<id>.me.value` | The viewer's number, or `0` when they are not ranked |
| `leaderboard.<id>.me.formatted` | The viewer's `format.value` text, or empty |
| `leaderboard.<id>.me.name` | The viewer's `format.name` text, or empty |
| `leaderboard.<id>.me.uuid` | The viewer's UUID |

Ranks start at `1`. A rank past the end of the board reads as empty text, and its `value` and `rank` read as `0`. `me.*` needs a viewer, so a hologram line that uses it renders per viewer. See [Expressions & Placeholders](/gloss/13-expressions-placeholders).

```json
{
  "lines": [
    "&6&lTop players",
    "&e#1 &f{{ leaderboard.playtime.1.name }} &7{{ leaderboard.playtime.1.formatted }}",
    "&e#2 &f{{ leaderboard.playtime.2.name }} &7{{ leaderboard.playtime.2.formatted }}",
    "&7Your rank: &b{{ leaderboard.playtime.me.rank }}"
  ]
}
```

The same values exist as text functions, such as `|leaderboard.playtime.1.name|` and `|leaderboard.playtime.me.rank|`. Gloss registers ranked functions up to the same limit as the rows.

## Format templates

`format.value` and `format.name` run once per update, not once per viewer. They can read `name` and `value` plus the viewerless text variables such as `server.online`. They have no viewer, so `player.*` and `viewer.*` are empty there.

## Commands

| Command | Permission | Does |
|---|---|---|
| `/gloss leaderboard list` | `gloss.leaderboards` | Lists loaded boards and their row counts |
| `/gloss leaderboard info <id>` | `gloss.leaderboards` | Shows a board's source, order and rows |
| `/gloss leaderboard reset <id> [current\|all]` | `gloss.leaderboards.reset` | Clears the current period, or with `all` every value the board holds |
| `/gloss leaderboard sample <id>` | `gloss.leaderboards.sample` | Samples every online player now |
