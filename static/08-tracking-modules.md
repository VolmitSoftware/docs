---
title: Static - Tracking modules
description: Plugin-owned statistics, player views, collection controls, and persistence
published: true
date: 2026-10-17T00:00:00.000Z
tags: static, integrations, statistics
editor: markdown
dateCreated: 2026-10-16T00:00:00.000Z
---

Other plugins can register lifetime statistics with Static and submit observations through its Java API. Modules have their own identifiers, definitions, and storage. Installing an unrelated plugin does not automatically start collecting its data; that plugin or a dedicated integration must register a module.

## Viewing modules

`/static modules [page]` lists registered modules and retained modules whose providers are unavailable. `/static module <module> [player] [page]` opens a player's values, or prints them for console callers. The inventory has previous/next, refresh, back, and close controls.

`/static moduletop <module> <stat>` shows the top ten visible positive values. Equal values share competition ranks, such as 1, 1, 3; UUID order resolves display ties. Durations use milliseconds. An unobserved value is shown as not recorded, separately from an observed zero.

Players need `static.modules` for their own records. Other-player records and module rankings also require `static.modules.others`, which defaults to operators. Profile visibility still applies; viewing a private profile requires ownership or the separate privacy bypass permission. Module data is not exposed by public web pages.

Player detail views require an existing Static player profile. A provider can record an otherwise unknown UUID through the API; that UUID may appear in module rankings, but its detail view becomes available once Static has recorded the player.

## Collection controls

```toml
[modules]
enabled = true
disabledModules = []
```

These settings are available in the Modules configuration category and support hot reload. Add exact IDs from `/static modules`, such as `quests:daily`, to disable individual providers. `general.enabled=false` also stops new module observations. Disabling recording or removing a provider preserves existing values and definitions.

Modules can report offline activity. They do not automatically inherit world, game-mode, or AFK filters: the provider owns those rules and must apply them before submitting observations. Module totals do not contribute to built-in counters, calendar reports, personal bests, seasons, or milestones. They have no web reports or PlaceholderAPI keys.

## Registering a provider

Compile against Static without bundling or relocating its classes. Declare `depend: [Static]`, or use `softdepend` and handle service availability. Registration belongs in the provider's enable lifecycle; close handles on disable. Static also invalidates handles when the owning plugin disables.

The following example runs inside a `JavaPlugin` subclass. It creates `<your-plugin-name>:quests`; the namespace is derived from the owning plugin, not supplied by another caller.

```java
ExtensionStatistics statistics = getServer().getServicesManager().load(ExtensionStatistics.class);
ExtensionModule quests = statistics.register(this, new ExtensionModuleDefinition(
        "quests", "Quests", List.of(
                new ExtensionStatisticDefinition("completed", "Quests completed", ExtensionStatisticType.COUNTER),
                new ExtensionStatisticDefinition("longest_streak", "Longest streak", ExtensionStatisticType.MAXIMUM),
                new ExtensionStatisticDefinition("time_spent", "Quest time", ExtensionStatisticType.DURATION))));

boolean accepted = quests.record(playerId, "completed", 1L);
```

The extension types are in `com.volmit.staticstats.extensions`; `List` is `java.util.List`. Keep the returned handle for later observations and call `close()` during provider shutdown. With optional dependencies, handle a null service before registration and discard handles when Static disables; acquire a fresh service and register again after it enables.

| Type | Meaning of `record(UUID, statisticId, value)` |
|---|---|
| `COUNTER` | Add a nonnegative integer increment |
| `DURATION` | Add a nonnegative elapsed duration in milliseconds; Static does not start or stop a timer |
| `MAXIMUM` | Retain the largest nonnegative observation |

Values use exact Java `long` integers. Negative values and unknown statistic IDs are rejected; overflow throws without changing the stored value. `record` returns `false` when recording is disabled, the handle is inactive, or a storage-count limit prevents a new entry. Providers should handle that result without retrying every tick.

`record(UUID, Map<String, Long>)` submits several observations atomically. Every value is validated and calculated before any changes are applied; overflow, invalid keys, or storage limits cannot leave a partial event. An empty batch creates no player record.

Registration rejects duplicate active module IDs. A later registration may add statistics or update labels, but cannot change an existing statistic's type. Omitted definitions remain readable; only statistics declared by the current handle can receive new observations. Closing an old handle cannot close a newer registration.

`modules()`, `module(id)`, and `player(id, uuid)` return immutable snapshots. `leaderboard(module, statistic, limit, visible)` accepts limits from 1 to 100 and applies its UUID visibility predicate before selecting rows. Run larger ranking queries away from game threads. These APIs are trusted plugin access: consumers must enforce their own permissions and privacy before publishing results.

## Persistence and limits

`storage/modules.json` contains definitions and per-player values. Static writes asynchronously every 30 seconds when changed, uses atomic file replacement, and flushes at shutdown. `flush()` returns a future covering the observations accepted before that call; do not wait on it from a game thread. Recording and snapshot reads perform no disk I/O and access no Bukkit player or world state.

The service accepts up to 64 retained modules, 64 retained statistics per module, 100,000 players per module, and 1,000,000 stored player/statistic values overall. Identifiers use 1–48 lowercase letters, digits, dots, underscores, or hyphens and begin with a letter or digit. Labels contain 1–96 visible characters and are displayed as text, not formatting instructions.

An invalid storage file stops Static from enabling rather than replacing the records. Failed saves retain dirty data for a later attempt and log the failure. Back up the storage directory while the server is stopped; do not edit live files.

[Commands](/static/02-commands-languages) · [Built-in statistics](/static/03-statistics) · [API and placeholders](/static/90-api-placeholders)
