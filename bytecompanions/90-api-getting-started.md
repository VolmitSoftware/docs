---
title: "ByteCompanions: API getting started"
description: "Compiling a plugin against the public API, reading player state, and listening to companion events"
published: true
date: 2026-10-15T00:00:00.000Z
tags: "bytecompanions, api"
editor: markdown
dateCreated: 2026-10-08T00:00:00.000Z
---

Other plugins read companion state and react to companion events through the public types under `com.volmit.bytecompanions.api`. This page shows how to compile against the API, obtain it at runtime, and which events exist.

## Dependency

The API is the `api` Gradle module of the ByteCompanions repository. A published Maven coordinate is pending until the repository is released; until then compile against the module or a local copy of its jar.

```kotlin
dependencies {
    compileOnly(project(":api"))
}
```

Declare the plugin dependency so your plugin loads after ByteCompanions:

```yaml
depend: [ByteCompanions]
```

Do not shade the API, Bukkit or Paper classes, or another Adventure copy into your plugin. Paper provides Adventure from the server; on Spigot, ByteCompanions loads it through the plugin library loader, and both plugins must resolve the same `Component` class.

## Obtaining the API

```java
import com.volmit.bytecompanions.api.access.ByteCompanions;
import com.volmit.bytecompanions.api.access.ByteCompanionsProvider;
import com.volmit.bytecompanions.api.user.CompanionPlayer;
import org.bukkit.entity.Player;

import java.util.List;

List<String> equippedCompanions(Player player) {
    if (!ByteCompanionsProvider.hasInstance() || !player.isOnline()) {
        return List.of();
    }
    CompanionPlayer state = ByteCompanions.getAPI().getCompanionPlayerOrNull(player);
    return state == null ? List.of() : List.copyOf(state.companions().keySet());
}
```

`ByteCompanions.getAPI()` throws until the plugin has enabled and set its provider; `ByteCompanionsProvider.hasInstance()` checks first. A player's `CompanionPlayer` exists only after their data has loaded from storage, so a `null` result means not ready, not empty. Listen for `CompanionPlayerLoadEvent` instead of polling.

The API offers `configurationSettings()`, `typeRegistry()`, `companionManager()`, `animationRegistry()`, and lookups by companion ID, `Player`, or `UUID`. Treat `companions()` as read only; equip and unequip through `companionManager()` on the player's owning thread.

## Threading

Call the API on the thread that owns the player: the main thread on Bukkit servers, the entity scheduler on Folia and Canvas. Do not keep `Companion`, `CompanionPlayer`, or registry objects across a runtime reload; look them up again when a callback runs, and check that the player is still online.

## Events

All events live in `com.volmit.bytecompanions.api.bukkit.event` and fire on the owning thread of the player involved.

| Event | When it fires | Cancellable |
|---|---|---|
| `CompanionPlayerLoadEvent` | A player's companion data finished loading | No |
| `CompanionPlayerUnloadEvent` | A player's companion data is released, on quit or reload | No |
| `CompanionEquipEvent` | Before a companion is equipped; `preflight()` is `true` for outfit checks that may not change anything | Yes |
| `CompanionUnequipEvent` | Before a companion is removed; `preflight()` as above | Yes |
| `CompanionSpawnEvent` | A companion's visual is created | No |
| `CompanionDespawnEvent` | A companion's visual is removed | No |
| `CompanionSelectionChangedEvent` | After a batch selection change, such as wearing an outfit; carries `previousIds()` | No |
| `CompanionPlayerInteractEvent` | A player clicked a companion, only with `performance.dispatchInteractEvent` on | No |

`CompanionPlayerInteractEvent` fires on the companion owner's thread, which may differ from the clicking player's. Read the clicker from the immutable `actor()` snapshot; `player()` is live and must be used on that player's own thread. `CompanionSelectionChangedEvent` can precede the database write, so it is not a receipt that the selection was saved.

`Companion.behavior()` exposes the cosmetic actions: `act(CompanionAction)` with `PET`, `WAVE`, `SIT`, `STAY`, or `CALL` returns `APPLIED`, `COOLDOWN`, or `DISABLED`; `mode()` reports `FOLLOW`, `STAY`, or `SIT`.

## Related pages

- [Integrations *PlaceholderAPI keys for plugins that only need text*](/bytecompanions/09-integrations)
- [Configuration *The `performance.dispatchInteractEvent` key*](/bytecompanions/03-configuration#performance)
{.links-list}
