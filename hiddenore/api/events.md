---
title: "events"
description: "HiddenOreBreakEvent and HiddenOreDropsEvent"
published: true
date: 2026-08-24T00:00:00.000Z
tags: "hiddenore, api"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
HiddenOre fires two events for managed block rewards.

| Event | Cancellable | Use |
|---|---|---|
| `HiddenOreBreakEvent` | yes | Refuse HiddenOre's reward before it is calculated |
| `HiddenOreDropsEvent` | no | Edit drops, experience, or inventory delivery |

Declare the dependency shown in [API Overview](/hiddenore/api) and register listeners only when HiddenOre is present.

## Cancel a reward

```java
@EventHandler(ignoreCancelled = true)
public void onHiddenOreBreak(HiddenOreBreakEvent event) {
    if (!canReceiveRewards(event.getPlayer(), event.getBlock())) {
        event.setCancelled(true);
    }
}
```

Cancellation stops HiddenOre's reward. It does not restore the broken block.

## Edit drops

```java
@EventHandler
public void onHiddenOreDrops(HiddenOreDropsEvent event) {
    event.getDrops().removeIf(ItemStack::isEmpty);
    event.setExperience(Math.max(0, event.getExperience()));
}
```

`getDrops()` returns the live mutable list. `getTool()` is a copy. `getVein()` may be `null`.

## Threading

Both events run synchronously on the thread that owns the broken block. Do not block or perform network or disk I/O in a listener.

The block has already been broken when either event fires. Use `getBrokenType()` for its former material.
