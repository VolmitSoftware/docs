---
title: Static - API and placeholders
description: Read-only snapshots, controlled increments, and PlaceholderAPI identifiers
published: true
date: 2026-09-10T00:00:00.000Z
tags: static, api, placeholderapi
editor: markdown
dateCreated: 2026-09-10T00:00:00.000Z
---

Static registers `com.volmit.staticstats.api.StaticStatistics` with Bukkit's services manager while enabled. Dependent plugins should declare `depend: [Static]` or handle an absent service when using `softdepend`. Compile against Static without shading its API classes into the consumer.

```java
StaticStatistics statistics = Bukkit.getServicesManager().load(StaticStatistics.class);
Optional<PlayerStatsSnapshot> profile = statistics.snapshot(playerId);
```

| Method | Contract |
|---|---|
| `snapshot(UUID)` | Returns an immutable recorded snapshot including current eligible session time |
| `find(String)` | Resolves recorded names or UUIDs without network access; reused names select the most recently updated profile, then UUID for a stable tie |
| `leaderboard(StatKey, offset, limit)` | Returns sorted immutable snapshots; run large rankings asynchronously |
| `playerCount()` | Number of recorded profiles |
| `add(UUID, StatKey, double)` | Adds finite nonnegative amounts to base counters, respecting tracking filters; unknown UUIDs create profiles named by their UUID until they join |
| `flushAsync()` | Completes after the queued durable save, exceptionally on failure |

`PlayerStatsSnapshot` exposes `uuid`, `name`, immutable base `values`, `updatedAt`, and `value(StatKey)` for base or derived values. Derived counters cannot be directly incremented. The service owns the storage writer; API consumers must not edit the live JSON file.

When PlaceholderAPI is present, `%static_<statistic>%` returns a raw number for the requested player's UUID, including recorded offline players. `%static_<statistic>_formatted%` returns display formatting. Unknown identifiers return no replacement; a known identifier without a recorded profile returns zero.

Examples:

- `%static_blocks_broken%`: raw block count.
- `%static_online_time%`: eligible milliseconds.
- `%static_online_time_formatted%`: days, hours, minutes, or seconds.
- `%static_arrow_accuracy%`: raw fraction from zero to one.
- `%static_arrow_accuracy_formatted%`: percentage.
- `%static_distance_traveled_formatted%`: metres or kilometres.

[Statistic identifiers](/static/03-statistics) · [Commands and languages](/static/02-commands-languages)
