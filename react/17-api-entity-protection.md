---
title: "API - Entity Protection"
description: "React documentation: API - Entity Protection"
published: true
date: 2026-08-23T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
The `art.arcane.react.api.protect` package lets another plugin exclude owned entities from selected React operations. It supports compiled provider rules, direct per-entity claims, and a limited per-decision guard event.

Provider rules and direct claims cover different ownership models:

| Ownership model                                                 | API                                     |
|-----------------------------------------------------------------|-----------------------------------------|
| Entities identified by a persistent-data key, scoreboard tag, type, world, or spawn reason | `ReactProtectionProvider` through `ServicesManager` |
| A specific entity available to the caller                        | `ReactProtection.protect(entity, plugin, ops)` |

Provider rules apply to every matching entity, including entities that existed before the provider registered. Direct claims persist an operation mask on one entity.

---

## Rule model

The provider API is declarative. It has no `boolean isProtected(Entity)` callback. It does not query a provider immediately before React acts.

React reads declared rules, compiles them into a bitmask lookup, and evaluates that lookup on its entity paths. `ReactProtectionProvider.rules()` is called about every 30 seconds on a React worker thread. It is not called once per entity or operation. It is not called on the server thread.

Rules match entity type, world name, scoreboard tags, persistent-data keys, and spawn reason. Ownership that those fields cannot express can use a persistent-data marker written when the entity is created.

`ReactEntityGuardEvent` provides a per-decision veto for two of the six operations. It fires per entity on the same hot paths. See [Vetoing per entity with an event](#vetoing-per-entity-with-an-event).

---

## The operations

`ReactOperation` names the six things React does to entities. Protecting against one does not protect against the others.

| Constant    | What React does when it is *not* protected                                                                                                                                     |
|-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `STACK`     | React merges the entity into a nearby identical mob. React removes the merged entity with `Entity#remove()`. The survivor stack count increases by yours. The merged entity loses its UUID, persistent data, name, equipment, and AI state. React checks both sides. A protected entity is never absorbed and is never a merge target. |
| `TRIM`      | React deletes the entity to bring a world, chunk, or entity-type group under a configured budget. React selects the oldest and least valuable entities first. A trim can fire while the server is healthy. |
| `PURGE`     | React deletes the entity in a deliberate sweep. Sources are an operator action, an entity-crowd cull, or a hot-chunk quarantine. Purge does not rank candidates. The purge action, crowd prevention, and hot-chunk quarantine protect nonblank custom names by default; their explicit named-protection options can make those entities eligible. |
| `SLEEP`     | React stops the entity from thinking. React sets `Mob#setAware(false)` or pauses the entity when no player is within the activation range. React wakes it when a player returns. The entity still exists and still renders. Pathfinding, targeting, item pickup, and ticking behavior stop. |
| `DESPAWN`   | React removes the entity early through an accelerated-cleanup path. Those paths finish burning mobs out of player sight. They also dispose of bubbled entities instead of ticking them. |
| `SPAWN_CAP` | React refuses to let an entity of that kind exist. React cancels the spawn event when a chunk is over its entity budget. `SPAWN_CAP` protection exempts the spawn from the cap. The spawn then proceeds. |

`ReactOperations` packs them into an `int` bitmask:

```java
int everything = ReactOperations.all();
int deletion = ReactOperations.of(ReactOperation.TRIM, ReactOperation.PURGE, ReactOperation.DESPAWN);
boolean stacked = ReactOperations.covers(deletion, ReactOperation.STACK);
Set<ReactOperation> readable = ReactOperations.expand(deletion);
```

`of` is overloaded for a `Set<ReactOperation>` as well as varargs, so it round-trips with `expand`. `ReactOperations.NONE` is `0`. `sanitize(int)` drops bits that do not name a constant. React applies it to everything you pass in. A stale mask from an older React build cannot grant a permission that no longer exists.

**`SPAWN_CAP` is evaluated before an entity exists.** React answers it from entity type, world name, and spawn reason only. A rule that also declares marker keys or scoreboard tags is **skipped entirely** for spawn decisions. There is nothing to read those fields from. Keep spawn rules separate from entity rules.

**Not every spawn decision carries a reason.** React consults the cap from four events. Only `CreatureSpawnEvent` supplies a `SpawnReason`. The generic entity-spawn, player-item-drop, and breeding paths pass none. A rule that declares `spawnReasons` cannot match those three. Leave that dimension empty unless you mean creature spawns.

---

## Matching an entity

`ReactProtectionRule` is a record with five matcher dimensions. Within a rule, **every dimension you set must match** (AND). Within one dimension, **any value matches** (OR). A dimension you leave empty matches everything.

```java
public record ReactProtectionRule(
    String ruleId,
    int operations,
    Set<EntityType> entityTypes,
    Set<NamespacedKey> markerKeys,
    Set<String> scoreboardTags,
    Set<String> worldNames,
    Set<CreatureSpawnEvent.SpawnReason> spawnReasons)
```

| Dimension       | Builder                 | Matches when                                              | Cost                             |
|-----------------|-------------------------|-----------------------------------------------------------|----------------------------------|
| Marker keys     | `withMarkerKeys(NamespacedKey…)` | the entity's `PersistentDataContainer` **has** any of the keys, at any data type | re-read on every check, never cached |
| Entity types    | `withEntityTypes(EntityType…)`   | `entity.getType()` is any of them                        | free                             |
| Scoreboard tags | `withScoreboardTags(String…)`    | `entity.getScoreboardTags()` contains any of them        | read once, then cached           |
| Worlds          | `withWorlds(String…)`            | the entity's world name equals any of them, case-insensitively | read once, then cached      |
| Spawn reasons   | `withSpawnReasons(SpawnReason…)` | the `CreatureSpawnEvent.SpawnReason` is any of them — **`SPAWN_CAP` only** | free                    |

Marker keys are matched on **presence**, not value or type. React calls `PersistentDataContainer#has(key)` with no `PersistentDataType`. A `BYTE`, an `INTEGER`, or a `STRING` under that key all count.

Each `with…` method **replaces** its dimension rather than adding to it. Each is backed by `Set.of(…)`, which rejects `null` elements and duplicate values with an exception. Pass each dimension once, with distinct values.

### The common case: "this entity is mine, never touch it"

Stamp a key of your own onto anything you create. Declare one rule that matches it.

```java
package com.example.pets;

import art.arcane.react.api.protect.ReactOperations;
import art.arcane.react.api.protect.ReactProtectionProvider;
import art.arcane.react.api.protect.ReactProtectionRule;
import org.bukkit.NamespacedKey;
import org.bukkit.plugin.Plugin;

import java.util.List;

public final class PetProtection implements ReactProtectionProvider {
    public static final String ID = "example-pets";

    private final NamespacedKey petKey;

    public PetProtection(Plugin plugin) {
        this.petKey = new NamespacedKey(plugin, "pet");
    }

    public NamespacedKey petKey() {
        return petKey;
    }

    @Override
    public String providerId() {
        return ID;
    }

    @Override
    public List<ReactProtectionRule> rules() {
        return List.of(ReactProtectionRule
            .of("pets", ReactOperations.all())
            .withMarkerKeys(petKey));
    }
}
```

Register it in `onEnable`. Bukkit unregisters you automatically when your plugin disables. React notices within one of its ticks.

```java
getServer().getServicesManager().register(
    ReactProtectionProvider.class, new PetProtection(this), this, ServicePriority.Normal);
```

Mark the entity when you spawn it. `PetProtection#petKey()` is the same `NamespacedKey` the rule matches on:

```java
public Wolf spawnPet(PetProtection protection, World world, Location at) {
    Wolf wolf = world.spawn(at, Wolf.class);
    wolf.getPersistentDataContainer().set(protection.petKey(), PersistentDataType.BYTE, (byte) 1);
    return wolf;
}
```

The mark is persistent data. It survives chunk unloads, restarts, and world backups.

The **rule** does not. Bukkit unregisters your service when your plugin disables. React drops your rules on the next reconcile. While your plugin is off, marked entities are unprotected even though the mark is still on them. Protection returns when you enable again. If you need protection that holds while your plugin is disabled or uninstalled, write a claim instead. See [Claiming a single entity](#claiming-a-single-entity).

### A fuller provider

```java
package com.example.pets;

import art.arcane.react.api.protect.ReactOperation;
import art.arcane.react.api.protect.ReactOperations;
import art.arcane.react.api.protect.ReactProtectionProvider;
import art.arcane.react.api.protect.ReactProtectionRule;
import org.bukkit.NamespacedKey;
import org.bukkit.entity.EntityType;
import org.bukkit.event.entity.CreatureSpawnEvent;
import org.bukkit.plugin.Plugin;

import java.util.List;

public final class PetProtection implements ReactProtectionProvider {
    public static final String ID = "example-pets";

    private final NamespacedKey petKey;
    private final NamespacedKey summonKey;

    public PetProtection(Plugin plugin) {
        this.petKey = new NamespacedKey(plugin, "pet");
        this.summonKey = new NamespacedKey(plugin, "summon");
    }

    @Override
    public String providerId() {
        return ID;
    }

    @Override
    public List<ReactProtectionRule> rules() {
        ReactProtectionRule pets = ReactProtectionRule
            .of("pets", ReactOperations.all())
            .withMarkerKeys(petKey);

        ReactProtectionRule summons = ReactProtectionRule
            .of("summons", ReactOperation.STACK, ReactOperation.TRIM, ReactOperation.DESPAWN)
            .withMarkerKeys(summonKey)
            .withEntityTypes(EntityType.SKELETON, EntityType.ZOMBIE);

        ReactProtectionRule arena = ReactProtectionRule
            .of("arena-summons", ReactOperation.SPAWN_CAP)
            .withEntityTypes(EntityType.SKELETON)
            .withWorlds("arena")
            .withSpawnReasons(CreatureSpawnEvent.SpawnReason.CUSTOM);

        return List.of(pets, summons, arena);
    }
}
```

`summons` still allows `PURGE` and `SLEEP`. An operator sweep can clear them. Idle ones stop thinking. `arena` carries no marker key on purpose. A spawn rule that declares one never matches.

---

## The lifecycle

```
you register a ReactProtectionProvider with the ServicesManager
   |
   |  React marks itself dirty on ServiceRegisterEvent
   v
rules() is called once per reconcile, on a React worker thread
   |
   |  refused if providerId() is blank or throws
   |  faulted if rules() throws or returns null - last good rules stay in force
   v
rules are compiled: ids qualified as "providerId/ruleId", masks sanitized,
worlds lowercased, duplicates dropped, capped at 64 rules per provider
   |
   |  if the compiled set differs from the previous one, the entity mask cache is flushed
   v
React evaluates the compiled set per entity, on its own threads
```

Reconcile timing:

- On startup, once, after every controller has started.
- Whenever a `ReactProtectionProvider` service is registered or unregistered, or any plugin is disabled. React ticks its protection controller every 5 seconds and reconciles on the next tick.
- Otherwise every 30 seconds regardless. A provider whose rules change shape at runtime is picked up without re-registering.

Only the startup reconcile runs on the thread that enabled React. Every later one runs on a React worker thread. `rules()` must not read entities, worlds, chunks, or anything else the server owns. Return a list you built earlier.

`rules()` is therefore called repeatedly. It must be cheap and side-effect free. Build the list once in your constructor. Return the same instance if it never changes.

### The mask cache

React caches a per-entity bitmask keyed by entity UUID. What is cached and what is not decides whether a rule works or only appears to work.

| Fact                        | Freshness                                                                 |
|-----------------------------|---------------------------------------------------------------------------|
| Marker keys                 | **Live.** Re-read on every check as long as any compiled rule uses marker keys. Add or remove the key and the next check sees it. |
| Entity type, world          | Cached on first read                                                       |
| Scoreboard tags             | Cached on first read — adding a tag later is **not** seen                  |
| Claims written by `ReactProtection.protect` / `release` | Cached, and the cache is invalidated for you   |
| Claims you write into persistent data yourself | Cached — **not** seen until the cache entry goes    |

A cache entry goes when you call `ReactProtection.invalidate(entity)`. It also goes when the compiled rule set changes. It goes when the entity is entered again through a spawn or chunk-entities-load event. It also goes when the entry ages out. React sweeps every 30 seconds and evicts entries older than 5 minutes.

If you change anything other than a marker key, call `ReactProtection.invalidate(entity)`. It is cheap. It is one map removal. It is safe to call when React is absent.

```java
wolf.addScoreboardTag("example-pet");
ReactProtection.invalidate(wolf);
```

---

## Threading

Every read and write goes through the entity's `PersistentDataContainer`, its world, or its scoreboard tags. On Folia that state belongs to the region that owns the entity. React refuses to touch it from anywhere else.

| Call                                      | Where you may call it                                                   |
|-------------------------------------------|--------------------------------------------------------------------------|
| `ReactProtection.protect` / `release`     | The thread that owns the entity: the main thread on Paper, the owning region thread on Folia. On Folia, anywhere else it returns `false`, logs at verbose level and writes nothing |
| `ReactProtection.isProtected` / `operationsFor` / `ownerOf` | Same thread rule. On Folia off the owning region you get the cached mask if one exists. Otherwise you get `ReactOperations.NONE` and an empty owner string. Nothing is cached |
| `ReactProtection.invalidate`              | Any thread. It only removes a map entry and never reads entity state    |
| `ReactProtection.available()`             | Any thread                                                               |
| `ReactProtectionProvider.rules()`         | Called by React on one of its own worker threads, **not** the server thread. Do not touch Bukkit state from it, do not block, do not do I/O, do not schedule and wait |
| `ReactEntityGuardEvent` listener          | Called on whichever React thread is performing the operation — see below |

**Only Folia enforces the rule.** React's check is whether this is a Folia runtime and whether the current region owns this entity. On Paper and Spigot the answer is always yes. An off-main-thread `protect`, `release`, or `isProtected` is **not** refused and **not** logged. It still reaches the entity's `PersistentDataContainer`. No additional notification is emitted. Callers remain responsible for correct Paper thread ownership. React's refusal is a Folia-specific backstop, not a portable guard.

`ReactProtection.operationsFor` returning `NONE` off-region on Folia is the most common source of confusion. It looks exactly like "nothing protects this entity".

The cheapest fix is to read where you already own the entity. Read inside an entity event and keep the answer:

```java
package com.example.pets;

import art.arcane.react.api.protect.ReactOperation;
import art.arcane.react.api.protect.ReactProtection;
import org.bukkit.event.EventHandler;
import org.bukkit.event.EventPriority;
import org.bukkit.event.Listener;
import org.bukkit.event.entity.EntitySpawnEvent;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public final class PetAudit implements Listener {
    private final Map<UUID, Boolean> trimProtected = new ConcurrentHashMap<>();

    @EventHandler(priority = EventPriority.MONITOR, ignoreCancelled = true)
    public void onSpawn(EntitySpawnEvent event) {
        trimProtected.put(
            event.getEntity().getUniqueId(),
            ReactProtection.isProtected(event.getEntity(), ReactOperation.TRIM));
    }
}
```

If you must read from a task, dispatch that task to the entity's owner first. Use `Entity#getScheduler()` on Paper and Folia. Use `BukkitScheduler#runTask` on Spigot. Then call from inside it. `Entity#getScheduler()` is not on a plain Spigot compile classpath. That is why it is named here rather than shown as code.

---

## Claiming a single entity

When you have the entity in hand and no useful matcher, write a claim.

```java
boolean claimed = ReactProtection.protect(entity, this, ReactOperations.all());
boolean released = ReactProtection.release(entity, this);
```

The full facade:

```java
public static boolean available();
public static boolean protect(Entity entity, Plugin owner, ReactOperation... operations);
public static boolean protect(Entity entity, Plugin owner, int operations);
public static boolean release(Entity entity, Plugin owner);
public static boolean invalidate(Entity entity);
public static boolean isProtected(Entity entity, ReactOperation operation);
public static int operationsFor(Entity entity);
public static String ownerOf(Entity entity);
```

A claim is an `INTEGER` written into the entity's persistent data under `react:protect-<your-plugin-name>`. It holds your operation mask. Your plugin name is lowercased. Every character outside `[a-z0-9_.-]` becomes `_`. The name is truncated to 48 characters.

Consequences worth knowing before you rely on it:

- **Claims persist with the entity.** They are saved to the world. They survive restarts, chunk unloads, and your plugin being uninstalled. Nothing cleans them up but you.
- **Claims union across owners.** Two plugins claiming the same entity give it the OR of both masks. `release` only clears your own key. The other plugin's protection stands.
- **`protect` unions with your own previous claim.** Calling it twice with different masks gives the entity both. To narrow a claim, `release` then `protect` again.
- **`ownerOf(entity)` returns the claim owners**, comma-separated and sorted — `"plugina,pluginb"`. It is empty for protection that came from a rule. Rules are not claims and there is nobody to name.
- **Rule-derived protection cannot be released.** `release` only removes claims.
- **A mask of `ReactOperations.NONE`, a `null` entity or a `null` owner is refused** and returns `false`.

`operationsFor` returns the union of everything, rules and claims, as a bitmask. Feed it to `ReactOperations.expand` when you want to show it to a human.

---

## Vetoing per entity with an event

`ReactEntityGuardEvent` is the one place React asks per entity. It is deliberately narrow.

```java
public final class ReactEntityGuardEvent extends Event implements Cancellable {
    public ReactEntityGuardEvent(Entity entity, ReactOperation operation, boolean async);
    public Entity getEntity();
    public ReactOperation getOperation();
    public boolean isCancelled();
    public void setCancelled(boolean cancel);
    public HandlerList getHandlers();
    public static HandlerList getHandlerList();
}
```

```java
@EventHandler(ignoreCancelled = true)
public void onGuard(ReactEntityGuardEvent event) {
    if (index.isPet(event.getEntity())) {
        event.setCancelled(true);
    }
}
```

Cancelling means "do not perform this operation on this entity". React skips it and moves on.

Limitations:

- **It fires for `TRIM` and `PURGE` only.** Stacking, sleeping, despawning, and spawn caps consult the compiled rule set directly. They never fire an event. There is no per-entity veto for those four.
- **Not every `PURGE` fires it.** Only the operator purge action does. The hot-chunk quarantine action and the entity-crowd tweak call the compiled rule set directly. An entity they delete is never offered to your handler. `TRIM` fires from both of its paths. Rules and claims cover every path. The event does not.
- **It only fires at the moment of removal**, after React has already selected the entity as a candidate. Rule-based and claim-based protection is checked earlier. Those paths remove the entity from consideration entirely, which is cheaper.
- **It does not fire at all when nobody is listening.** React checks the `HandlerList` first.
- **The `async` flag is computed, not fixed.** React sets it from whether the calling thread is a server tick thread. On Folia the trim and purge paths run on region threads. Those region threads count as tick threads. The event is usually synchronous. You must not assume that. Treat the event as owning only the entity it names. Do not touch other entities, other chunks, or other worlds from the handler.
- **A handler that throws is a veto.** React catches `Throwable`, logs it, and treats the operation as refused. That is the opposite of the usual Bukkit behavior. It is deliberate. A broken listener must not cause deletions.
- **Re-entrancy is short-circuited.** If your handler causes React to evaluate another guard on the same thread, the nested call returns "allowed". It does not fire a second event.

The event has its own `HandlerList` and does not extend `ReactEvent` or `ReactCancellableEvent`. Registering for it gets you this event and nothing else.

---

## Relationship to the older `StackExclusion` flag

VolmLib ships `art.arcane.volmlib.util.entity.StackExclusion`. That type writes a `BYTE` under `volmit:no-stack` into an entity's persistent data. Plugins in this suite used it to opt out of mob stacking before React had an API.

React ships a built-in rule, `react/legacy-no-stack`, that matches the marker key `volmit:no-stack`. It grants `STACK`, `TRIM`, `PURGE`, `SLEEP`, and `DESPAWN`. It is compiled with every third-party rule and evaluated on the same path. Nothing you already wrote needs to change.

What it does not do:

- **No `SPAWN_CAP`.** The legacy flag lives on an entity that already exists. It can never answer a spawn-time question.
- **No per-operation control.** It is one flag granting five operations. You cannot say "stack is fine, do not trim".
- **No owner.** `ReactProtection.ownerOf` returns an empty string for a legacy-flagged entity. An operator cannot tell which plugin asked for it.
- **It is a VolmLib type.** Inside React's jar VolmLib is relocated. The class you call is your copy, not React's. React only ever sees the resulting `NamespacedKey`.

For new work, use `ReactProtection.protect(entity, plugin, ops)` or a rule with your own marker key. Both identify the owning plugin. Both support per-operation selection. Both do not require VolmLib. Existing `StackExclusion` use continues to resolve through the current built-in rule.

If you want the legacy behavior without a VolmLib dependency, the key is stable. You can write it yourself:

```java
entity.getPersistentDataContainer().set(
    new NamespacedKey("volmit", "no-stack"), PersistentDataType.BYTE, (byte) 1);
```

---

## Failure policy

React assumes a provider will throw, return null, hand back a hostile collection, or register twice.

| Misbehavior                                   | What React does                                                                    |
|------------------------------------------------|-------------------------------------------------------------------------------------|
| `providerId()` throws                          | Registration refused for this cycle, logged. `rules()` is never called               |
| `providerId()` is blank after trimming         | Registration refused for this cycle, logged                                          |
| `providerId()` is a lambda's synthetic name    | Accepted, with one warning naming your plugin. The name changes every restart, so an operator cannot recognize it. Implement `providerId()` |
| `rules()` throws                               | Counted as a fault, logged with the exception type. Your **last known good rules stay in force** |
| `rules()` returns `null`                       | Counted as a fault. Last known good rules stay in force                              |
| The returned list's `iterator()` throws        | Counted as a fault. React only iterates. It never calls `size()`, so a hostile `size()` is harmless |
| The list contains `null` elements              | Skipped silently                                                                     |
| More than 64 rules                             | The first 64 are taken, the rest ignored with one log line                            |
| An endless list                                | Drained no further than 64 entries                                                   |
| A rule with no operations, or a blank `ruleId` | Dropped silently at compile time                                                     |
| Two rules with the same `providerId/ruleId`    | The first wins, the rest are dropped silently                                        |
| `rules()` takes 5 ms or more                   | One warning per provider naming your plugin. Never changes the outcome               |
| 5 faults from one provider                     | The provider is **quarantined**                                                      |

**Quarantine is permanent for the React session.** A quarantined provider's last known good rules stay compiled and keep protecting entities. React stops calling `rules()` on it and will not pick up any change. Re-registering the same `providerId` does not clear it. `/react reload` clears it because it rebuilds React's controllers from scratch. A server restart also clears it. Registering under a different `providerId` also works, since quarantine is keyed by id.

`ReactProtection` itself never throws. Every method is null-tolerant. Each returns a neutral value when React's runtime is not installed.

There is no fail-open or fail-closed switch. A fault leaves your previous rules in place rather than dropping protection. That is the conservative choice. A stale rule over-protects. Over-protection costs entity count, not player data.

---

## Configuration

The protection API has no configuration of its own. It is always on and cannot be disabled. Its limits are fixed: 64 rules per provider, 5 faults before quarantine, a 5 ms slow warning, and a 5-minute mask retention.

Two operator settings affect integration behavior and diagnostics:

| File                              | Key       | Effect                                                                            |
|-----------------------------------|-----------|-----------------------------------------------------------------------------------|
| `plugins/React/config.toml`       | `verbose` | `false` by default. Every `[protect]` diagnostic that concerns your provider — refusals, faults, quarantine, slow-provider warnings, off-region write refusals — is verbose-level. Turn it on when your rules are not taking effect |
| `plugins/React/feature/*.toml`, `plugins/React/tweak/*.toml` | `enabled` | Turning off the feature that performs an operation removes that operation from the server entirely |

The following component files perform each operation:

| Operation   | Config files                                                                                              |
|-------------|-----------------------------------------------------------------------------------------------------------|
| `STACK`     | `feature/mob-stacking.toml`                                                                                |
| `TRIM`      | `feature/entity-trimmer.toml`, `action/action-trim-entities-by-age-priority.toml`                           |
| `PURGE`     | `action/purge-entities.toml`, `action/action-quarantine-hot-chunks.toml`, `tweak/entity-crowd-prevention.toml` |
| `SLEEP`     | `feature/adaptive-entity-sleep.toml`, `feature/dynamic-activation-range.toml`                               |
| `DESPAWN`   | `tweak/fast-entity-incineration.toml`, `tweak/entity-bubbler.toml`                                          |
| `SPAWN_CAP` | `tweak/entity-hardstop.toml`                                                                                |

---

## Enum reference

`ReactOperation` — `STACK`, `TRIM`, `PURGE`, `SLEEP`, `DESPAWN`, `SPAWN_CAP`. Ordinals are the bit positions in a `ReactOperations` mask. A mask is not portable across React versions if constants are reordered. Raw masks are not stable persistence values. Persist `ReactOperation` names instead.

The enum may gain constants. Write a `default` arm in any `switch` expression over it:

```java
String verb = switch (event.getOperation()) {
    case TRIM, PURGE -> "delete";
    case STACK -> "merge";
    default -> "touch";
};
```

`ReactOperations.all()` is computed from the enum at class initialization. It therefore includes constants added in a later release.
