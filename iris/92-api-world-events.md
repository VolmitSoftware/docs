---
title: "API - World Events"
description: "Iris documentation: API - World Events"
published: true
date: 2026-08-19T00:00:00.000Z
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

## Pregeneration

```java
@EventHandler
public void onPregen(IrisPregenerationEvent event) {
    IrisPregenProgress progress = event.getProgress();
    updateBar(progress.completedChunks(), progress.totalChunks());
}
```

Pregeneration phases report start, progress, completion, cancellation, and failure. The progress record includes the world, job ID, chunk totals, rate, elapsed time, and estimated remaining time.

Both event types are observational and run on the server's global thread. Keep handlers short and move network or file work elsewhere.
