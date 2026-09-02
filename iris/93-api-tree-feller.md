---
title: "API - Tree Feller"
description: "Iris documentation: API - Tree Feller"
published: true
date: 2026-08-24T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

`IrisTreeFellerService` lets another plugin start an Iris tree-felling run and charge a custom per-log cost.

## Get the service

```java
RegisteredServiceProvider<IrisTreeFellerService> registration =
    Bukkit.getServicesManager().getRegistration(IrisTreeFellerService.class);
```

## Start a run

Call `tryFell` from the `BlockBreakEvent` thread:

```java
@EventHandler(priority = EventPriority.HIGH, ignoreCancelled = true)
public void onBreak(BlockBreakEvent event) {
    IrisTreeFellerService feller = service();
    if (feller == null || feller.isManagedBreak(event)) {
        return;
    }

    feller.tryFell(
        event,
        TreeFellerOptions.integrationOverride(20, TreeFellerRunHooks.NONE)
    );
}
```

The number `20` is the percent chance that a removed log costs no durability.

## Custom cost

Implement `TreeFellerRunHooks` when each log should consume stamina, mana, or another resource:

```java
void onActivationAccepted();
boolean reserveLogCost();
void commitLogCost();
void refundLogCost();
```

`reserveLogCost` decides whether the next log may be removed. Commit only finalizes a reserved cost; refund returns it when that removal fails. Make these methods safe to retry.

```java
boolean tryFell(BlockBreakEvent event, TreeFellerOptions options);
boolean isManagedBreak(BlockBreakEvent event);
boolean isTreeBlock(Block block);
```

`isTreeBlock` may read Iris storage. Do not call it in a large synchronous scan.
