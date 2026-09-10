---
title: "API - World Events"
description: "Iris documentation: API - World Events"
published: true
date: 2026-09-09T08:45:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Listen for Iris engine lifecycle and pregeneration progress with ordinary Bukkit listeners.

## World engine

```java
@EventHandler
public void onEngine(IrisWorldEngineEvent event) {
    switch (event.getPhase()) {
        case ENGINE_READY, ENGINE_HOTLOADED -> refresh(event.getWorld(), event.getInfo());
        case ENGINE_CLOSING -> remove(event.getWorld().getUID());
        default -> { }
    }
}
```

| Phase | Meaning |
|---|---|
| `ENGINE_READY` | Terrain queries are available |
| `ENGINE_HOTLOADED` | Pack-derived data changed |
| `ENGINE_CLOSING` | Drop cached data for the world |

`getInfo()` may be empty. Do not query terrain from a closing handler.

`Engine.isShuttingDown()` identifies teardown rather than temporary generation quiescence. `IrisEngine` returns true in `CLOSING`, `CLOSED`, or `FAILED`, and after closure; `HOTLOADING` remains false even when `isClosing()` is true while generation drains. Use lifecycle admission for terrain reads; this predicate does not acquire a generation session.

## Pregeneration

```java
@EventHandler
public void onPregen(IrisPregenerationEvent event) {
    IrisPregenProgress progress = event.getProgress();
    updateBar(progress.generatedChunks(), progress.totalChunks());
}
```

Pregeneration phases are `STARTED`, `TICK`, `PAUSED`, `RESUMED`, `SAVING`, `COMPLETED`, and `CANCELLED`. The progress record includes world name and identity, generated, total, remaining and failed chunk counts. It also includes percentage, rate, elapsed time, ETA, method, and pause state.

The terminal event includes chunks completed while active requests finish during shutdown. `COMPLETED` means the generated count reached the requested total. An incomplete run reports `CANCELLED`. Inspect `failedChunks()` for chunk failures.

Both event types are observational and run on the server's global thread. Keep handlers short and move network or file work elsewhere.
