---
title: Static - API and placeholders
description: Statistics snapshots, completion listeners, and PlaceholderAPI keys
published: true
date: 2026-10-16T00:00:00.000Z
tags: static, api, placeholderapi
editor: markdown
dateCreated: 2026-09-10T00:00:00.000Z
---

Static registers `com.volmit.staticstats.api.StaticStatistics` with Bukkit's services manager while enabled. Consumers should declare `depend: [Static]`, or handle an absent service when using `softdepend`. Compile against Static without shading its API classes into your plugin.

```java
StaticStatistics statistics = Bukkit.getServicesManager().load(StaticStatistics.class);
Optional<PlayerStatsSnapshot> profile = statistics.snapshot(playerId);
```

## Java API

| Methods | Purpose |
|---|---|
| `snapshot(UUID)` and `snapshot(UUID, StatsPeriod)` | Immutable profile values, including current eligible session time |
| `find(String)` and `find(String, StatsPeriod)` | Recorded name or UUID lookup without network access |
| `periodSnapshot`, `history`, `sessions`, `historyZone`, `activityRecordedSince` | Calendar history, retained sessions, timezone, and coverage |
| `ranking`, `cachedRanking`, `leaderboard` | Base/derived rankings and cached results |
| `details`, `detailRanking`, `cachedDetailRanking` | Selected lifetime detailed counters and their rankings |
| `personalBests` | Recorded day, week, month, and session bests |
| `participation`, `cachedParticipation` | Retained-session participation for a calendar window |
| `milestones`, `milestoneCompletions`, `onMilestoneCompletion` | Current thresholds, saved completions, and subscriptions |
| `seasons`, `season`, `seasonSnapshot`, `seasonRanking`, `onSeasonCompletion` | Event definitions, progress, rankings, and completion subscriptions |
| `playerCount` | Recorded profile count |
| `add(UUID, StatKey, double)` | Nonnegative finite base-counter increments |
| `addDetail(UUID, DetailKey, long)` | Nonnegative selected detailed-counter increments |
| `flushAsync()` | Completes after the queued durable save, exceptionally on failure |

Ranking and participation request methods return futures. Cached variants return an optional snapshot and do not wait for a rebuild. Avoid synchronous large rankings on a game thread. Completion subscriptions return an `AutoCloseable`; close it when the consumer disables, and schedule any world or player mutations on their owning thread.

Snapshots include coverage as well as values. `PlayerStatsSnapshot` exposes `uuid`, `name`, immutable base `values`, `updatedAt`, `recordedSince`, and `value(StatKey)` for calculated values. Derived counters cannot be incremented directly. Recorded-name reuse resolves to the latest updated profile, then UUID for a stable tie.

Increments respect recording settings and available player tracking context. API consumers must not edit the live JSON files. The service is a trusted plugin API and does not apply viewer permissions or privacy filtering; consumers must enforce access before publishing records.

## PlaceholderAPI

For custom plugin statistics, use the separate `ExtensionStatistics` Bukkit service. [Tracking modules](/static/08-tracking-modules) documents registration, types, lifecycle, storage, and access rules. Module values do not have PlaceholderAPI keys.

Static registers its expansion when PlaceholderAPI is available. The basic form is `%static_<statistic>%`; append `_formatted` for readable durations, distances, or percentages. Unknown identifiers return no replacement. A known statistic without a profile returns zero; private player values return an empty string.

Add `day_`, `week_`, or `month_` immediately after `static_` for the current calendar period. Omitting the prefix selects lifetime totals.

| Example | Result |
|---|---|
| `%static_blocks_broken%` | Raw block count |
| `%static_week_online_time_formatted%` | Eligible time this week |
| `%static_arrow_accuracy%` | Fraction from zero to one |
| `%static_arrow_accuracy_formatted%` | Percentage |
| `%static_recorded_since%` | Recording start in epoch milliseconds |
| `%static_day_recorded_since_formatted%` | Readable coverage date for today |
| `%static_rank_blocks_broken%` | Player's shared rank |
| `%static_position_blocks_broken%` | Player's distinct list position |
| `%static_gap_blocks_broken%` | Value needed to reach the next higher entry |
| `%static_gap_online_time_formatted%` | Formatted gap |
| `%static_top_blocks_broken_1_name%` | Name at list position 1 |
| `%static_ranking_blocks_broken_ready%` | Whether a cached ranking is available |
| `%static_qualification_kill_death_ratio_remaining%` | Additional denominator sample required |

Top entries also support `uuid`, `value`, `value_formatted`, and `rank` in place of `name`. Ranking metadata supports `updated` (epoch milliseconds) and `size`. Qualification fields are `qualified`, `numerator`, `denominator`, `minimum`, and `remaining`.

Ranking placeholders read cached snapshots and omit private profiles. Until a requested ranking is cached, entry values are empty, readiness is `false`, and metadata counts/timestamps are zero. Formatting uses the requesting player's selected language where available.

[Statistic identifiers](/static/03-statistics) · [Commands](/static/02-commands-languages) · [Privacy](/static/07-dashboard-privacy)
