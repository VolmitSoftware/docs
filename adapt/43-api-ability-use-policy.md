---
title: "API - Ability Use Policy"
description: "Adapt documentation: API - Ability Use Policy"
published: true
date: 2026-08-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Register an `AbilityUsePolicy` to deny selected Adapt abilities. A policy can refuse a use; it cannot grant an ability.

```java
public final class JailPolicy implements AbilityUsePolicy {
    @Override
    public String id() {
        return "example.jail";
    }

    @Override
    public AbilityUseDecision decide(AbilityContext context) {
        return jailedPlayers.contains(context.playerId())
            ? AbilityUseDecision.deny("Abilities are disabled while jailed.")
            : AbilityUseDecision.allow();
    }
}
```

Register it with Bukkit:

```java
Bukkit.getServicesManager().register(
    AbilityUsePolicy.class,
    new JailPolicy(),
    this,
    ServicePriority.Normal
);
```

Adapt unregisters the service when your plugin disables.

## Context

`AbilityContext` provides the player UUID, skill ID, adaptation ID, learned level, phase, world identity, and ability status. Use `AbilityScope` when the policy applies only to selected skills or adaptations.

Policies may be called from player-owning or worker threads. Read immutable data only. Do not access Bukkit players, worlds, chunks, or inventories from `decide`.

Return a short denial reason suitable for chat. The first denial wins; every other Adapt permission, protection, and availability check still applies.
