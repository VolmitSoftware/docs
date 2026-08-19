---
title: "API: Previews"
description: "Gloss documentation: API: Previews"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---
Container previews expose two integration points in `art.arcane.gloss.api`.
`PreviewStateProvider` contributes named variables that preview documents read.
`GlossContainerPreviewAccessEvent` is the last gate before Gloss builds a preview for a viewer.

This page defines those contracts. The document format and the expression language they feed are
in [Container Previews](/gloss/15-container-previews) and
[Expressions & Placeholders](/gloss/13-expressions-placeholders).

## `PreviewStateProvider`

```java
package art.arcane.gloss.api;

public interface PreviewStateProvider {
  String namespace();
  Map<String, Object> snapshot(Block block, Entity entity, Player player);
}
```

`Block`, `Entity` and `Player` are `org.bukkit.block.Block`, `org.bukkit.entity.Entity` and
`org.bukkit.entity.Player`. Every entry a provider returns is published to preview expressions as
`namespace() + "." + entryKey`. A provider with namespace `"adapt"` returning `{"level": 12}`
publishes `adapt.level`.

Contract, as implemented in `PreviewStateContext#mergeProviders`:

- `snapshot` runs on the region thread that owns the preview target, at most once per game tick per
  preview — the snapshot map is cached by tick. Bukkit access is safe. Expensive work is not.
- `block` is null when previewing an entity or a bare inventory. `entity` is null when previewing a block
  or a bare inventory. `player` is null when the preview has no viewer context, which includes the
  target-less `statics` context used for locked previews and document validation.
- Values are narrowed to the expression runtime's types: `Double`, `String` and `Boolean` pass through,
  any other `Number` becomes a `Double`, and anything else is dropped. A null key or a null narrowed value
  is dropped.
- Returning `null` or an empty map contributes nothing.
- A namespace that is null, blank, or reserved by a built-in is dropped whole — not partially merged — and
  warned about once.
- A provider that throws a `RuntimeException` from `namespace()` or `snapshot()` is skipped for that
  sample. Gloss warns about it once, keyed by namespace. If `namespace()` itself threw, the key is
  the implementing class name. It cannot take a preview down.

Providers are iterated in registration order and merged flat into one map. Two providers claiming
the same namespace and key silently overwrite each other. Last registration wins. Namespace your
keys with your own plugin id.

### Gloss registers providers here too

The integration bridge is itself a consumer of this SPI. For every plugin publishing the shared
Volmit integration contract on the `ServicesManager`, it registers one provider. That provider's
namespace is the first segment of that plugin's metric keys — `adapt`, `iris`, `react`,
`wormholes`, `hiddenore`, `biletools`. It publishes each metric under its native dotted name.

If your plugin already publishes integration metrics, do not register a second provider on the same
namespace. The bridge's registration and yours would overwrite each other key by key. Providers are
re-registered whenever a plugin enables or disables. The bridge's providers are always the most
recent registrations for their namespaces. See
[Runtime Architecture](/gloss/20-runtime-architecture).

### Reserved namespaces

`PreviewStateAdapters.RESERVED_NAMESPACES` holds `vars`, every full built-in variable name, and the
first segment of every dotted built-in name. A provider whose namespace is in that set is dropped
whole, with one `WARNING` per namespace:

```
Preview provider namespace '<name>' is reserved by a built-in variable; provider ignored.
```

| Group | Reserved names |
|---|---|
| Injected variables | `vars` |
| Universal | `time`, `blockType`, `customName` |
| Inventory | `inventory.size`, `inventory.occupied`, and the prefix `inventory` |
| Furnace | `cookTime`, `cookTimeTotal`, `burnTime`, `fuelSeconds`, `bankedXp`, `lit`, `surge.active`, `surge.gain`, and the prefix `surge` |
| Brewing | `brewTime`, `brewTotal`, `fuelLevel`, `maxFuel`, `surge.active`, `surge.gain` |
| Beehive | `bees`, `maxBees`, `honey`, `maxHoney` |
| Cauldron | `level`, `maxLevel`, `fluid` |
| Jukebox | `playing`, `record` |

The set is derived from the built-in catalog at class load. It grows whenever a built-in variable
is added. A namespace equal to your plugin id will not collide with any of it.

## `PreviewStateProviders`

```java
package art.arcane.gloss.api;

public final class PreviewStateProviders {
  public static void register(PreviewStateProvider provider);
  public static void unregister(PreviewStateProvider provider);
  public static List<PreviewStateProvider> all();
}
```

| Method | Behavior |
|---|---|
| `register` | `addIfAbsent` on the backing list, so registering the same instance twice is a no-op. A null provider throws `NullPointerException("provider")` |
| `unregister` | Removes the instance. A null argument and an unknown instance are both ignored |
| `all()` | Unmodifiable view, in registration order. Iterated on region threads during every preview snapshot |

The registry is a `static` `CopyOnWriteArrayList` on the `PreviewStateProviders` class. It lives
for the lifetime of the JVM and is not tied to any plugin. Gloss does not and cannot clear your
entry when your plugin disables.

> **Unregister on disable.** A provider left registered retains your instance, and through it your
> classloader, across every reload of your plugin. This is the one thing a Gloss consumer must clean up.
> Menus need no cleanup, because Gloss listens for `PluginDisableEvent` and closes every session whose
> owner name matches the disabling plugin.
{.is-warning}

Registration timing is otherwise free. The registry is a plain static field. It accepts a provider
before Gloss has enabled. It keeps it after Gloss disables. A provider registered while Gloss is
absent simply contributes nothing until Gloss comes back. There is no ordering requirement against
Gloss's own enable.

```java
package com.example.charge;

import art.arcane.gloss.api.PreviewStateProvider;
import org.bukkit.block.Block;
import org.bukkit.entity.Entity;
import org.bukkit.entity.Player;

import java.util.Map;

public final class ChargeProvider implements PreviewStateProvider {

  @Override
  public String namespace() {
    return "myplugin";
  }

  @Override
  public Map<String, Object> snapshot(Block block, Entity entity, Player player) {
    if (block == null) {
      return Map.of();
    }

    return Map.of("charge", (double) block.getBlockPower());
  }
}
```

```java
package com.example.charge;

import art.arcane.gloss.api.PreviewStateProviders;
import org.bukkit.plugin.java.JavaPlugin;

public final class ChargePlugin extends JavaPlugin {
  private final ChargeProvider chargeProvider = new ChargeProvider();

  @Override
  public void onEnable() {
    PreviewStateProviders.register(chargeProvider);
  }

  @Override
  public void onDisable() {
    PreviewStateProviders.unregister(chargeProvider);
  }
}
```

## Sampling cadence and threading

`PreviewStateContext` is the scope a preview document is evaluated against. It is constructed on
whichever thread opened the preview. It is sampled from the region thread that owns the target.

The snapshot is sampled lazily on the first variable lookup. It is re-sampled whenever the tick
changes. One refresh reads each Bukkit getter and calls each provider exactly once, no matter how
many expressions reference them. The tick is `world.getGameTime()`, or
`System.currentTimeMillis() / 50` when the context has no world.

The tick and the map it produced are published together in one immutable record behind a single
`volatile` field. A reader can never pair one sample's tick with another sample's map. Concurrent
sampling is last-writer-wins and benign. Both writers read the same target at the same game tick.

| Loop | Interval | What it does |
|---|---|---|
| Preview content refresh | every 4 ticks (`ContainerPreview.REFRESH_INTERVAL`) | Re-reads dynamic values, which is what re-samples the context |
| Access re-check | every 10 ticks (`ContainerPreview.ACCESS_RECHECK_INTERVAL`) | Re-runs the access gate, including `GlossContainerPreviewAccessEvent` |
| Preview session tick | every tick | Anchor, scale and visibility only. No provider work |

A refresh will not start while a previous one is still in flight. Block targets run the read on the
region that owns the block. An ender chest hops to the viewer's entity scheduler, because the
inventory belongs to the player rather than the block.

A provider is called at most once per game tick per open preview. A viewer looking at one
container costs at most one `snapshot` call per tick. In practice it is one per four ticks, because
that is when a refresh polls. Do not treat that as a budget for I/O. The call sits on a region
thread that also ticks every entity in the region.

## How provider values reach a document

Names in a preview expression resolve in this order:

1. A repeat element wraps the context in a `RepeatScope`, which answers its own loop variable name exactly
   and delegates everything else to the parent.
2. Names beginning with `vars.` read the document's injected constant map — `match.vars` with the first
   matching variant's `vars` merged over it. Variables are reachable only under that prefix, so a `vars.`
   name can never shadow, or be shadowed by, a state name.
3. Everything else reads the sampled snapshot: the built-in adapter variables, plus every registered
   provider's entries merged flat as `<namespace>.<key>`.

Compile-time name checking, in `PreviewDocumentParser#checkVariableName`:

| Reference | Result |
|---|---|
| A cataloged built-in name | Accepted |
| `vars.<declared>` | Accepted |
| `vars.<undeclared>` | Compile error `unknown variable: vars.<name>` |
| A bare name in the enclosing repeat scope | Accepted |
| Any other bare name | Compile error `unknown variable: <name>` |
| A dotted name whose prefix is reserved | Compile error `unknown variable: <name>` |
| A dotted name whose prefix is not reserved | `WARNING` `<document>: <path> references provider namespace '<name>', not verifiable at parse time`. Compiled, resolved at runtime |

A document referencing `myplugin.charge` therefore compiles with a warning even when your plugin is
absent. The parser cannot know whether a provider will register later. At render, an unresolved
name throws `unknown variable: myplugin.charge` from the evaluator.

A preview never takes a frame down. An element whose build-time expressions fail is skipped. The
rest of the document still renders. A live closure that fails renders transparent for a cell color
and empty for a label. Every such failure logs at most once per document per minute. The
alternative is a line every four ticks for as long as the player looks at the block.

Preview expressions never resolve PlaceholderAPI. The lexer has no `%…%` form. A bare `%` is the
modulo operator. `PreviewStateProvider` is the only route for external data into a preview. See
[API: Placeholders](/gloss/23-api-placeholders) for where placeholders do apply.

## `GlossContainerPreviewAccessEvent`

```java
package art.arcane.gloss.api;

public final class GlossContainerPreviewAccessEvent extends Event implements Cancellable {
  public GlossContainerPreviewAccessEvent(Player player, Block block);
  public GlossContainerPreviewAccessEvent(Player player, Entity entity);
  public Player getPlayer();
  public Block getBlock();
  public Entity getEntity();
  public boolean isCancelled();
  public void setCancelled(boolean cancel);
  public HandlerList getHandlers();
  public static HandlerList getHandlerList();
}
```

The event extends `org.bukkit.event.Event` directly with its own `HandlerList`. It is constructed
with the no-arg `Event()` superconstructor. It is a synchronous event. On Folia that means "on
whichever region thread fired it", not "on the main thread".

**Block and entity are exclusive.** The block constructor sets `entity` to null. The entity
constructor sets `block` to null. Exactly one of `getBlock()` / `getEntity()` is non-null in every
dispatch. Both constructors reject a null `player`. Each rejects a null target, with
`NullPointerException`.

### The gates that precede it

The event is fired from `ContainerProtectionService#canAccess`. That is the last step of
`ContainerPreviewAccess.canOpen`. It runs on the region thread that owns the target. Everything
before it must already have allowed the request:

1. The viewer holds `gloss.preview` and previews are enabled (`ContainerPreviewAccess.PERMISSION`, captured
   into a `ViewerAccess` snapshot alongside the viewer's game mode and main-hand item).
2. For a block target, the block is physically openable and unlocked, and a double chest's other half
   passes both checks as well.
3. The installed container protection provider allows it. WorldGuard is installed reflectively when it is
   present and removed again if it disables.

Only then is the event dispatched. The full gate order and the WorldGuard behavior are in
[Container Previews](/gloss/15-container-previews).

### Cancelling

Cancelling denies the preview. Gloss builds the `locked` document instead of the container's
contents. The viewer sees the padlock card and no inventory contents. Locked previews are
constructed with contents disabled. That card renders even for a viewer who could not open the
container.

Access is re-checked every 10 ticks. If the decision flips while the viewer is looking, the session
drops its contents state. The look loop rebuilds it down the other path on a later tick.

Gloss performs every one of these checks before it builds any preview document or reads a single
inventory slot. It never synthesizes player-interact or inventory-open events while a player looks
at a container.

### Deny on throw

`canAccess` wraps the provider call and the event dispatch in one `try`. A
`ReflectiveOperationException`, `RuntimeException` or `LinkageError` from either logs once and
**returns false**, denying the preview. The log latch is a single `AtomicBoolean`. A persistent
failure produces one line rather than one per look.

```java
package com.example.protection;

import art.arcane.gloss.api.GlossContainerPreviewAccessEvent;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;

public final class PreviewGate implements Listener {
  private final MyProtection myProtection;

  public PreviewGate(MyProtection myProtection) {
    this.myProtection = myProtection;
  }

  @EventHandler(ignoreCancelled = true)
  public void onPreviewAccess(GlossContainerPreviewAccessEvent event) {
    if (event.getBlock() != null && myProtection.denies(event.getPlayer(), event.getBlock())) {
      event.setCancelled(true);
    }
  }
}
```

`ContainerProtectionProvider` is internal and has no registration API.
`GlossContainerPreviewAccessEvent` is the supported extension point. The installed provider runs
first. An event listener can deny access that the provider allowed. It cannot override a provider
denial.

## Related pages

- [Container Previews](/gloss/15-container-previews) — the document format, the built-in variable catalog and the access rules
- [Expressions & Placeholders](/gloss/13-expressions-placeholders) — the expression grammar these variables are read from
- [API: Getting Started](/gloss/21-api-getting-started) — dependency, entry points and the full event list
{.links-list}
