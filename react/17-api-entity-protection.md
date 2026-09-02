---
title: "API - Entity Protection"
description: "React documentation: API - Entity Protection"
published: true
date: 2026-08-24T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Use `art.arcane.react.api.protect` to keep React from stacking, trimming, purging, sleeping, or despawning your entities.

## Protect one entity

Call this on the entity's owning thread:

```java
boolean protectedEntity = ReactProtection.protect(
    entity,
    this,
    ReactOperation.STACK,
    ReactOperation.TRIM,
    ReactOperation.PURGE
);
```

Release your claim when you no longer own the entity:

```java
ReactProtection.release(entity, this);
```

Useful methods:

```java
ReactProtection.available();
ReactProtection.isProtected(entity, ReactOperation.TRIM);
ReactProtection.operationsFor(entity);
ReactProtection.ownerOf(entity);
```

## Protect a category

Register a `ReactProtectionProvider` through Bukkit's `ServicesManager` when entities can be identified by type, world, scoreboard tag, persistent-data key, or spawn reason.

```java
public final class PetProtection implements ReactProtectionProvider {
    @Override
    public String id() {
        return "example.pets";
    }

    @Override
    public List<ReactProtectionRule> rules() {
        return List.of(ReactProtectionRule.builder("pets")
            .persistentDataKey("example:pet")
            .operations(ReactOperations.all())
            .build());
    }
}
```

Register and unregister the provider with your plugin lifecycle. Build the returned rule list before `rules()` is called; do not read Bukkit objects from that method.

## Operations

| Operation | Protects against |
|---|---|
| `STACK` | Mob merging |
| `TRIM` | Budget-based entity removal |
| `PURGE` | Explicit cleanup actions |
| `SLEEP` | AI pausing |
| `DESPAWN` | Accelerated removal |
| `SPAWN_CAP` | React spawn limits |

`ReactEntityGuardEvent` can veto individual `TRIM` and operator `PURGE` decisions. Use rules or direct claims for every other path.

Direct entity calls must run on the entity's owner on Folia. `available()` and `invalidate()` are safe from any thread.
