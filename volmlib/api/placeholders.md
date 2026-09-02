---
title: "Placeholders"
description: "VolmLib documentation: PlaceholderAPI plumbing"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "volmlib, api"
editor: markdown
dateCreated: 2026-08-12T00:00:00.000Z
---

Use `art.arcane.volmlib.util.bukkit.papi` to expose values without reading Bukkit state from PlaceholderAPI's calling thread.

## Setup

PlaceholderAPI is compile-only:

```groovy
repositories {
    maven { url = uri('https://repo.extendedclip.com/content/repositories/placeholderapi/') }
}

dependencies {
    compileOnly('me.clip:placeholderapi:2.11.6') { transitive = false }
}
```

Declare PlaceholderAPI as optional. Paper plugins that extend `PlaceholderExpansion` also need `join-classpath: true`.

## Define an expansion

Declare keys once, including the required `available` key:

```java
public final class ExampleExpansion extends VolmitPlaceholderExpansion {
    public ExampleExpansion(PlaceholderSnapshot<State> state, Logger logger) {
        super("example", "Example", "1.0.0", "ExamplePlugin", registry(state), logger);
    }

    private static PlaceholderKeyRegistry registry(PlaceholderSnapshot<State> state) {
        return PlaceholderKeyRegistry.builder()
            .key(PlaceholderKeyRegistry.AVAILABLE, playerId -> state.available())
            .key("players", playerId -> {
                State current = state.get();
                return current == null
                    ? PlaceholderValues.UNAVAILABLE
                    : PlaceholderValues.count(current.players());
            })
            .build();
    }
}
```

Register on enable and unregister on disable:

```java
private PlaceholderRegistration placeholders;

@Override
public void onEnable() {
    placeholders = new PlaceholderRegistration(getLogger());
    placeholders.register(() -> new ExampleExpansion(state, getLogger()));
}

@Override
public void onDisable() {
    placeholders.unregister();
}
```

## Threading

Placeholder resolvers may run on any thread. They must only read immutable snapshots and return strings. Do not read players, worlds, chunks, inventories, files, or networks in a resolver.

Publish server-wide data with `PlaceholderSnapshot<T>` and per-player data with `PlayerSnapshotStore<T>`. Publish immutable records from the correct server thread.

```java
state.publish(new State(Bukkit.getOnlinePlayers().size()));
```

## Keys and values

Keys use lowercase `a-z`, digits, hyphens, and dots. Group resolvers receive the remaining path. A player UUID may be `null` when no player context exists.

| Helper | Output |
|---|---|
| `PlaceholderValues.bool(value)` | `true` or `false` |
| `PlaceholderValues.count(value)` | integer text |
| `PlaceholderValues.num(value)` | two decimals |
| `PlaceholderValues.percent(value)` | percentage number without `%` |
| `PlaceholderValues.text(value)` | plain text without formatting |
| `PlaceholderValues.UNAVAILABLE` | `---` |

Return `---` for a known value that is temporarily unavailable. Return `null` only for an unknown key.

## Resolve placeholders in text

```java
String rendered = Placeholders.setPlaceholders(player, template);
```

Call this from the thread that owns the player because other plugins' expansions may access Bukkit state.
