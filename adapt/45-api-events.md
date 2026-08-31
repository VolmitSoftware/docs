---
title: "API - Events"
description: "Adapt documentation: API - Events"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Adapt fires Bukkit events for ability use, adaptation teleports, charged activations, and completed brewing recipes.

## Deny an adaptation

```java
@EventHandler
public void onUse(AdaptAdaptationUseEvent event) {
    if (blocked.contains(event.getPlayer().getUniqueId())) {
        event.setCancelled(true);
    }
}
```

`AdaptAdaptationUseEvent` fires before an adaptation runs. Cancelling it prevents the effect, cooldown, XP, and cost.

## Deny a teleport

```java
@EventHandler
public void onTeleport(AdaptAdaptationTeleportEvent event) {
    if (!claims.canEnter(event.getPlayer(), event.getTo())) {
        event.setCancelled(true);
    }
}
```

This event is only for teleports initiated by Adapt.

## Brewing

`AdaptBrewCompleteEvent` reports a completed Adapt brewing recipe and provides the brewer, block, recipe, and result. It is observational.

## Ability cost events

- `AdaptAbilityActivateEvent` can cancel a pending charged activation.
- `AdaptAbilityActivatedEvent` reports the final outcome.

Events run on the thread that owns the affected player or block. Avoid blocking work in listeners.
