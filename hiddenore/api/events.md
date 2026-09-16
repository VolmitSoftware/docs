---
title: "Events"
description: "HiddenOreBreakEvent and HiddenOreDropsEvent"
published: true
date: 2026-09-16T00:00:00.000Z
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

The listener above must tolerate a `null` player: see [Explosions](#explosions).

## Edit drops

```java
@EventHandler
public void onHiddenOreDrops(HiddenOreDropsEvent event) {
    event.getDrops().removeIf(ItemStack::isEmpty);
    event.setExperience(Math.max(0, event.getExperience()));
}
```

`getDrops()` returns the live mutable list. `getTool()` is a copy. `getVein()` may be `null`.

For explosion rewards `getDrops()` holds only the hidden reward and never the `[blocks]` base drop
material. `setToInventory(true)` is ignored for those rewards, which always drop on the ground, and
`isToInventory()` always reads `false` for them.

## Explosions

When [blast mining](/hiddenore/configuration) is on, both events also fire for blocks destroyed by
an explosion. `getCause()` tells the two apart:

| `BreakCause` | `getPlayer()` | `getTool()` |
|---|---|---|
| `MINED` | the miner | the pickaxe used, as a copy |
| `EXPLODED` | the credited player, or `null` | always `null` |

A player is credited for the igniter of primed TNT and the shooter of a fireball. TNT minecarts,
creepers, beds, and redstone-fired charges credit nobody, so `getPlayer()` returns `null` there.

`HiddenOreBreakEvent` fires for every managed block the explosion destroyed, up to the per-explosion
cap, before the `yield` roll and whether or not the block was player-placed, so cancelling it refuses
a reward the same way it does for mining. `HiddenOreDropsEvent` fires only for the blocks that
actually paid.

```java
@EventHandler(ignoreCancelled = true)
public void onHiddenOreBreak(HiddenOreBreakEvent event) {
    if (event.getCause() == BreakCause.EXPLODED && event.getPlayer() == null) {
        return;
    }
    ...
}
```

A listener written against an older HiddenOre that assumed a non-null player or tool will throw on
explosion rewards. Guard both before reading them.

## Threading

Both events run synchronously on the thread that owns the broken block. Do not block or perform network or disk I/O in a listener. A single explosion fires `HiddenOreBreakEvent` once per managed block that passed the `yield` roll and `HiddenOreDropsEvent` once per block that actually paid, so keep explosion-path listeners cheap.

For `MINED` the block has already been broken when either event fires. For `EXPLODED` both events fire while the block is still standing, because HiddenOre runs at `MONITOR` on the explode event before the server clears the blocks. Use `getBrokenType()` for the material either way.
