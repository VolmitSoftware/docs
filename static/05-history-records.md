---
title: Static - History and records
description: Calendar totals, sessions, personal bests, and participation reports
published: true
date: 2026-10-14T00:00:00.000Z
tags: static, history, statistics
editor: markdown
dateCreated: 2026-10-14T00:00:00.000Z
---

Static keeps lifetime totals alongside retained day, week, month, and session records. Coverage dates show when observation began; missing activity is not reconstructed from lifetime totals.

## Calendar periods and sessions

Use `/stats Alex week` or `/leaderboard blocks_broken 1 month` to select a period. Calendar windows use `history.timeZone`, which defaults to `UTC`; weeks begin Monday. Choose the timezone before recording history. Changes require a restart, and stored history must use the same zone.

| Setting under `history` | Default | Allowed range |
|---|---|---|
| `afkSeconds` | 300 | 5–86400 seconds |
| `retainedDays` | 35 | 1–366 periods |
| `retainedWeeks` | 12 | 1–104 periods |
| `retainedMonths` | 12 | 1–120 periods |
| `sessionsPerPlayer` | 20 | 1–100 sessions |

Retention includes the current period. Raising a limit cannot restore pruned data. `/static sessions [player]` shows retained sessions and whether they ended with a quit, server shutdown, or interruption. An interrupted session ends at its last saved checkpoint.

Eligible time is split into active and AFK time using observed activity. Both remain part of `online_time`; excluded worlds and disallowed game modes accumulate none of these times. AFK status is a timing estimate, not a measure of player intent.

## Personal bests

`/static bests [player] [period]` shows the highest recorded positive value for each supported statistic. Day, week, and month records cover base counters. Session records cover online, active, and AFK time.

Records include their window, coverage, and observation dates. Current windows can hold an in-progress record; recovered records identify their retained-history source. Best values survive ordinary history pruning. Ratios and other calculated statistics are not record targets.

## Participation

`/static participation week 1` reports the previous calendar week; offset `0` selects the current window. This operator report counts unique, new, returning, and unknown-cohort players from retained sessions.

Median session duration uses eligible time for sessions that ended with a normal quit inside the selected window. Open, interrupted, and shutdown sessions are counted separately. Reports mark limited retention and unknown coverage; their totals are not a complete historical attendance record once sessions have been pruned.

[Statistics](/static/03-statistics) · [Milestones and seasons](/static/06-milestones-seasons)
