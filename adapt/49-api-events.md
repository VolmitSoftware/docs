---
title: "API - Events"
description: "Listening on Adapt's event bus: progress events, lifecycle events and platform events"
published: true
date: 2026-11-27T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-26T00:00:00.000Z
---

Adapt has one event bus on every platform. A listener is any object with `@Handle` methods that each take one event; the same listener works on Paper, Purpur, Folia, Spigot, Fabric, Forge and NeoForge.

## Subscribing

The example's `GeologyConsole` counts Geology's XP awards and learns for its status line, and `GeologyAddon` registers it with `registrar.listener(console)`. From `GeologyConsole.java`:

```java
private final AtomicInteger xpEvents = new AtomicInteger();
private final AtomicReference<String> lastXp = new AtomicReference<>("none");
private final AtomicInteger learnEvents = new AtomicInteger();

@Handle(priority = EventPriority.MONITOR)
public void on(SkillXpEvent event) {
  if (event.skill().equals(GeologyAddon.GEOLOGY)) {
    xpEvents.incrementAndGet();
    lastXp.set(event.source() + "=" + event.amount());
  }
}

@Handle(priority = EventPriority.MONITOR)
public void on(AdaptationLearnEvent event) {
  if (event.adaptation().namespace().equals(GeologyAddon.NAMESPACE)) {
    learnEvents.incrementAndGet();
  }
}
```

A handler at a lower priority may change the event instead, such as `event.setAmount(event.amount() * 2D)` on a `SkillXpEvent` or `event.setCancelled(true)` on an `AdaptationLearnEvent`.

| Where | Lifetime |
|---|---|
| `AdaptApi.events().subscribe(listener)` | Until `EventSubscription.unsubscribe()`. Available at any time, also before Adapt has started, and holds across core restarts |
| `ContentRegistrar.listener(listener)` | While the addon is installed |
| `@Handle` methods on a skill or adaptation | While that instance is live |

`subscribe` throws `IllegalArgumentException` when the object is already subscribed.

`AdaptApi.events().post(event)` posts an event an addon defines itself, a subclass of `AdaptEvent` in its own package, to every handler of that type on the calling thread, and returns it once they ran. Adapt's own events, those in the `art.arcane.adapt.api` and `art.arcane.adapt.platform` packages, are posted by Adapt alone: `post` throws `IllegalArgumentException` for them, so a handler can trust that a level-up or a block break really happened.

`@Handle` takes two settings:

| Setting | Default | Effect |
|---|---|---|
| `priority` | `NORMAL` | `LOWEST`, `LOW`, `NORMAL`, `HIGH`, `HIGHEST`, `MONITOR`, run lowest first. `MONITOR` handlers observe the final state and must not change it |
| `ignoreCancelled` | `true` | Set to `false` for a handler that must see cancelled events |

A handler of a skill or adaptation does not receive a cancelled event, whatever `ignoreCancelled` says, unless the method is also marked `@ReceiveCancelledEvents`. `PlayerInteractEvent` is the exception: Bukkit posts clicks in the air already cancelled, so a component's interact handler always receives cancelled interactions, and without the annotation it only skips those whose block or item use was denied. An adaptation's move and jump handlers only run for online players who learned it, unless marked `@RunsWithoutLearnedAdaptation`.

Events are mutable objects built for one dispatch. Change their fields and cancelled flag inside the handler, and never keep an event after the handler returns.

## Progress events

Fired on the thread that owns the player, before the change. Cancelling one stops the change, and the caller of the profile method gets a `CANCELLED` result.

| Event | Fired when | Mutable |
|---|---|---|
| `SkillXpEvent` | A player is about to gain XP in a skill, after multipliers and anti-farm rules | `setAmount`; a value that is not positive and finite cancels |
| `KnowledgeEvent` | Unspent knowledge is about to change outside learning: a level-up grant, a command, an API call | `setAmount` |
| `AdaptationLearnEvent` | A player is about to learn or raise an adaptation, after every rule passed and before payment | Cancel only |
| `AdaptationUnlearnEvent` | A player is about to unlearn or lower an adaptation | Cancel only |
| `AdaptationUseEvent` | An adaptation's code called `canUse(player)`; cancelling makes the call return false | Cancel only |
| `SkillMutateEvent`, `SkillUnmutateEvent` | A player is about to merge or split a mutation. Experimental | Cancel only |

`SkillXpEvent.skill()` is the line that receives the XP, the lead skill for a mutated line. `source()` is the reward key, `<skill id>:<source>` with `:<detail>` when the award gives one, such as `example:geology:stone:stone` when a player breaks stone, and `kind()` is the `XpAward.Kind`. XP that the rules reduced to nothing fires no event.

`AdaptationLearnEvent` carries the `adaptation`, its `skill`, `fromLevel`, the new `level`, the knowledge `cost`, and `forced()` for an admin command or a forced API call. `AdaptationUnlearnEvent` carries the `refund` instead of the cost.

`SkillLevelUpEvent` is fired after a skill reaches a new level, once per level, with the `level` and the `knowledge` it granted. It cannot be cancelled.

## Lifecycle events

| Event | Fired when |
|---|---|
| `AdaptStartedEvent` | A core finished starting and every installed addon was applied. The query accessors of `AdaptApi` work from here |
| `AdaptStoppingEvent` | The running core is about to stop. Player data is still loaded |
| `AddonInstalledEvent` | An addon's content was registered: at install, at each core start, and at the end of each refresh |
| `AddonUninstalledEvent` | An addon's content was removed: at uninstall, and at the start of each refresh |
| `CatalogChangedEvent` | Registered content changed: an addon was applied or removed, a reload enabled or disabled something, or a veto was placed or lifted. `revision()` is the catalog's new revision |

## Platform events

Gameplay events are Adapt's own types in `art.arcane.adapt.platform.event`, built from the native event of each platform. After the handlers run, Adapt applies their changes and cancelled flag to the native event.

| Package | Examples |
|---|---|
| `block` | `BlockBreakEvent`, `BlockPlaceEvent`, `BlockDropItemEvent`, `BlockGrowEvent`, `FurnaceSmeltEvent` |
| `entity` | `EntityDamageEvent`, `EntityDamageByEntityEvent`, `EntityDeathEvent`, `EntityShootBowEvent`, `ProjectileHitEvent` |
| `inventory` | `BrewEvent`, `CraftItemEvent`, `EnchantItemEvent`, `InventoryClickEvent`, `PrepareAnvilEvent` |
| `player` | `PlayerInteractEvent`, `PlayerItemConsumeEvent`, `PlayerMoveEvent`, `PlayerFishEvent`, `PlayerJoinEvent`, `PlayerQuitEvent` |
| `world` | `ChunkEvent`, `LightningStrikeEvent`, `WorldLifecycleEvent` |
| `server` | `ResourcesReloadedEvent`, and the experimental `PluginStateEvent` and `ServiceChangeEvent` |
| `adapt` | `AdaptBrewCompleteEvent`, when one of Adapt's brewing recipes finishes |

Each event's Javadoc says which fields a handler may change. A `PlayerInteractEvent` carries a `UseResult` for the block use and one for the item use, and every platform reads them the same way:

| `UseResult` | Block use | Item use of a right click on a block | Smash in `EntityAttemptSmashAttackEvent` |
|---|---|---|---|
| `DENY` | The block is not used | The item is not used | The attack does not smash |
| `DEFAULT` | Vanilla decides | Vanilla decides; when the block use is denied the item is not used on that block, while the plain item use that follows the click (eating, throwing) still happens | Vanilla decides |
| `ALLOW` | The same as `DEFAULT` | The same as `DEFAULT` | The attack smashes |

Text read from the world, such as `EntityRef.customName()`, `ItemRef.displayName()` and `lore()`, comes back with legacy section colours on every platform.

Protection checks fire some platform events only to ask other plugins whether an action is allowed; nothing happens in the world. `event.protectionProbe()` is true for those. Skills and adaptations never receive them; other listeners do, and should treat them as questions, not actions.

`dispatchId()` identifies the native event behind an object. On platforms that build a fresh event for each priority, all copies share the id, so handlers at different priorities can pair up their work for one occurrence.
