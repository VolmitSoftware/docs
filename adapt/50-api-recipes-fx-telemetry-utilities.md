---
title: "API - Recipes, FX, Telemetry & Utilities"
description: "Recipe, effect, telemetry, projectile, item, and HUD APIs"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
The remaining `art.arcane.adapt.api` surface covers recipes, brewing, FX, telemetry, projectile ownership, material value, data items, and the HUD queue. Skills, adaptations, abilities, events, protection, and player data have separate API pages.

The FX engine draws particle shapes and plays sounds with viewer snapshotting, per-emitter and per-viewer caps, and a global packet budget. That budget sheds low-priority effects when the server is under load, preventing the traffic a raw `World.spawnParticle` loop can generate.

Other APIs include a recipe builder with an Adapt level gate, a recipe-book planner, projectile ownership claims, and a cached material value calculator.

The last two sections list types that are Java-public because Adapt's own content needs them across packages. They are documented so nobody mistakes visibility for a compatibility promise. Several expose relocated or version-specific classes and will break on you.

## Recipes and brewing

`AdaptRecipe` builds Bukkit recipes with an Adapt level requirement attached. Static factories cover shaped, shapeless, smithing, stonecutting, smoking, blasting, furnace, and campfire forms. Every recipe carries a key, a result, and a required level. It answers `register`, `unregister`, and `is(Recipe)`. Registration mutates Bukkit's global recipe registry. Run it on the server thread. `MaterialChar` is the character-to-material, tag, or item-choice mapping the shaped builder uses.

`AdaptRecipeBook` is the discovery half. `plan(...)` is pure. Give it your `Unlock` bindings and a function that resolves a player's level for an adaptation. It returns an immutable `Plan` of recipe keys to discover and keys to undiscover. Any key in both lists is resolved in favor of discovery. `synchronize(player, plan)` applies that plan on the player's owning thread.

`BrewingRecipe` describes an Adapt brewing recipe. `PotionBuilder` builds the potion item stacks, including vanilla base potions, custom color, effects, and Adventure names and lore. `AdaptBrewCompleteEvent` is the observation event. It is documented in [45 - API - Events](/adapt/45-api-events). The rest of the potion package belongs to Adapt. `BrewingManager` owns the global recipe list and the brew and click listeners. `BrewingTask` owns one live brewing-stand transaction. `AdaptPotionRegistry` tracks and removes effects Adapt applied.

## FX

`Fx.now(source, target, priority)` starts an immediate effect. The source is an `Adaptation`, a `Skill`, or a `MutationType`. That is what lets Adapt honor that source's own particle and sound toggles. The target is a `Location` or an `Entity`. The returned `FxEmitter` chains shapes and sounds:

```java
Fx.now(this, player.getLocation(), FxPriority.COMBAT)
  .ring(Particle.CRIT, 1.5, 24, 0.1)
  .sound(Sound.ENTITY_PLAYER_ATTACK_CRIT, 0.6f, 1.4f);
```

The emitter snapshots nearby viewers once and enforces three limits. Those
limits are a per-emitter particle cap, a per-viewer emission cap, and a shared
global packet budget. That budget starts shedding by `FxPriority` when the
server falls behind. `Fx.targeted(...)` is the single-viewer escape hatch for
one particle effect. It still respects global and per-player effect settings.

`FxTimeline` is the multi-frame version. `at(source, location)` pins it in place. `follow(source, entity)` tracks a moving target. Set a duration in ticks, a priority, a cull radius, and a `Frame` callback. Then `start()` on the owning thread and `cancel()` to stop it. `FxPresets` holds the built-in sequences Adapt's own content uses. `FxViewers.dispatch(...)` is the low-level helper underneath. It runs your action for a supplied collection of players or for everyone inside a world radius. What gets sent is up to your action.

`ViewerDisplayDirector` owns per-viewer fake block and line displays keyed by channel and key. It admits at most 4,096 live or reserved displays globally and 128 per viewer; a `show...` call returns `false` when ingress is stopped, the bound is full, or owner dispatch is rejected. Repeated pending requests for the same viewer, channel, key, and block position coalesce to the latest request. Pick a channel name unique to your plugin and clear that channel on disable. Channel, viewer, and keyed clears use scoped indexes and invalidate already-dispatched stale work.

`ViewerGlowCoordinator` owns private per-viewer glow layers over GlowingEntities. The live instance is `Adapt.instance.getViewerGlowCoordinator()`. You must pick a specific `Layer`. Every successful `set(...)` needs a matching `unset(...)` or `clearLayer(...)`. Never construct a second coordinator.

`FxDirector` is Adapt's timeline ticker and lifecycle owner, not an integration point. `FxDispatch` is package-private and deliberately absent from the public surface.

## Telemetry

Two classes expose read-only counters. Both take `System.currentTimeMillis()`
as their `now` argument. `AbilityCheckTelemetry` covers ability-check rates,
cache hit and miss rates, and average uncached guard-check time. Its
`estimatedTimingMillisPerSecond` is the guard-check time accumulated over the
rolling 60-second window divided by 60. `timingBudgetPercent` expresses that
value against a 50 ms/s budget, so `100` means guard checks averaged 50
milliseconds of work per second. Operation rates remain throughput telemetry;
they do not by themselves establish performance impact. The class also exposes
an immutable `AbilitySnapshot` per ability. `AdaptRuntimeTelemetry` covers XP
per minute, XP payout count, provenance operation count, and event-handler
operation count over the current minute.

Their `record...`, `beginExecution`, `endExecution`, and `clear` methods are Adapt-owned instrumentation. Calling them corrupts the numbers your own dashboard is reading. `AdaptTelemetryClock` is the ticker-refreshed clock feeding those counters. Read the wall clock yourself. Never call `refresh()`.

## Projectile ownership

When an adaptation launches or repurposes a projectile it stamps an ownership key on the projectile's persistent data container. Anything that clones, redirects, or replaces projectiles has to refuse ones carrying a foreign key. Otherwise it hijacks another system's arrow mid-flight.

`ProjectileClaims.isUnclaimed(projectile, ownedKeys...)` is the check. Pass every `NamespacedKey` your plugin owns. A `true` result means the projectile carries no key you do not own. Nobody else has claimed it.

`ProjectileReplacementRegistry` transfers that ownership when one projectile entity is swapped for another. `register` installs a one-shot claim. `begin` removes it and hands back a `Ticket` that must be completed or cancelled exactly once.

## Data items and material value

`DataItem<T>` is a Bukkit item with a typed JSON payload in its persistent data. You implement four methods. The interface handles storage, lore, meta, and cooldown stamping. The persistent-data key is derived from Adapt's namespace and the hash of the payload class's canonical name. Renaming or moving the payload class orphans every item already in a player's inventory. Declaring a cooldown group keeps the vanilla cooldown sweep on your item rather than on every stack of the same material.

`MaterialValue.getValue(material)` returns Adapt's cached computed value for a material. `debugValue(material)` logs how that value was expanded from recipes. Config reload invalidates the cache. Later reads pick up new value settings. Persisted values only last for the current server process.

## Notifications and HUD

`Notification` is a queued player-facing message with a total queue duration and a group. Adapt includes action bar, title, sound, and advancement kinds. Action-bar and title notifications also carry `displayDurationMillis`, which controls the compositor segment lifetime independently of queue spacing. The title kind delivers as an action-bar notice rather than a screen title. `Notifier` owns a player's queue and its XP aggregation and tick lifecycle. One queued batch may contain an ordered sound-and-popup sequence under one group; a later batch with that group replaces the older pending sequence. Adapt constructs the notifier. You do not.

`AdaptHud` publishes messages as segments into the shared cooperative action-bar compositor. Adapt's XP ticker, ability status lines, and notices merge onto one line beside other plugins' content instead of fighting for the surface. Adapt never writes the title area or boss bars. Call it on the player's owning thread.

## Reference

### Recipes and brewing

| Type | Contract |
|------|----------|
| `AdaptRecipe` | Static builders `shaped()`, `shapeless()`, `smithing()`, `stonecutter()`, `smoker()`, `blast()`, `furnace()`, `campfire()`. Each recipe answers `getKey()`, `getNSKey()`, `getResult()`, `getRequiredLevel()`, `register()`, `unregister()`, `is(Recipe)`. `register` and `unregister` mutate Bukkit's recipe registry and need the server thread |
| `MaterialChar` | Shaped-recipe character to material, tag, or `RecipeChoice` mapping |
| `AdaptRecipeBook` | `plan(Collection<Unlock>, ToIntFunction<Adaptation<?>>)` is pure and returns `Plan(discover, undiscover)`. Keys landing in both are kept only in `discover`. `synchronize(Player, Plan)` calls `undiscoverRecipes` then `discoverRecipes` on the owning thread. `Unlock` is `record(NamespacedKey key, Adaptation<?> adaptation, int requiredLevel)` |
| `BrewingRecipe` | Builder over `id`, `ingredient`, `basePotion`, `result`, `brewingTime`, `fuelCost` |
| `PotionBuilder` | `vanilla(Type, PotionType)`, `of(Type)`, `of(ItemStack)`, then `setColor`, `addEffect`, `setName`, `addLore`, `setLore`, `setBaseItem`, `setBaseType`, `build()`. `Type` is the item form |
| `BrewingManager`, `BrewingTask`, `AdaptPotionRegistry` | Adapt-owned. Do not register a second manager or task, and do not call `record`, `forget`, `strip`, `retainActive` or `reset` |

### FX

| Type | Contract |
|------|----------|
| `Fx` | `now(Adaptation / Skill / MutationType, Location / Entity, FxPriority)` returns an `FxEmitter`. `targeted(Player, Particle, Location, count, spreadX, spreadY, spreadZ, speed)` sends one effect to one viewer |
| `FxEmitter` | `particle`, `ring`, `arc`, `helix`, `line`, `burst`, `column`, `dome`, `trail`, `dustRing`, `dustBurst`, `dustHelix` (each with an optional `Color`), `sound`, and two- and three-note `chord` |
| `FxTimeline` | `at(Adaptation / Skill, Location)`, `follow(Adaptation / Skill, Entity)`, then `duration(ticks)`, `priority(FxPriority)`, `cullRadius(double)`, `frame(Frame)`, `onComplete(Runnable)`, `start()`, `cancel()` |
| `FxPresets` | `chargeRing`, `shockwave`, `impact`, `successShimmer`, `failFizzle`, `streakTrail`, `readyPing`, `levelUpBurst`, `learnCelebration` |
| `FxPriority` | `GAMEPLAY`, `COMBAT`, `TRANSITION`, `TRAIL`, `AMBIENT`, listed highest priority first |
| `FxViewers` | `dispatch(Collection<Player>, Consumer<Player>)`, `dispatch(World, x, y, z, radius, Consumer<Player>)`. `DEFAULT_CULL_RADIUS` `24.0`, `MAX_CULL_RADIUS` `48.0` |
| `ViewerDisplayDirector` | `showBlock`, `showPersistentBlock`, `showLine`, `isShowing`, `clearViewerKey`, `clearViewer`, `clearChannel`, `retireViewer`, `purgeOrphans`, `clearAll` |
| `ViewerGlowCoordinator` | `isAvailable`, `set(Layer, Entity, Player, ChatColor)`, `unset`, `clearLayer`, `discardViewer`. `Layer`: `STEALTH_SIGHT`, `TRAGOUL_DEATH_SENSE`, `RANGED_TRAJECTORY_SIGHT`, `STEALTH_THREAT`, `MUTATION_UMBRAL_ECHO`, `TAMING_ALPHAS_COMMAND`, `RANGED_HEARTSEEKER` |
| `FxDirector` | Adapt's timeline ticker and lifecycle owner. Not an integration contract |

### FX budget

| Constant or read | Value |
|------------------|-------|
| `FxBudget.GLOBAL_PACKET_BUDGET` | `10000` particle-times-viewer packets per tick, reset by `FxDirector`. Each priority gets a share of it: `GAMEPLAY` 100%, `COMBAT` 95%, `TRANSITION` 80%, `TRAIL` 65%, `AMBIENT` 50% |
| `FxBudget.PER_EMITTER_PARTICLE_CAP` | `256` particles per emitter call |
| `FxBudget.PER_VIEWER_EMISSION_CAP` | `64` emissions per viewer |
| `FxBudget.usedPackets()` | Packets consumed so far this tick. Read-only diagnostics |
| `FxBudget.shedBand()` | Which shed band the TPS sampler has settled on, `0` for none. Read-only diagnostics |
| `FxBudget.densityScalar(FxPriority)` | The particle-count scalar for that priority in the current shed band |
| `FxBudget.tryConsume(FxPriority, int)` | Consumes the shared budget. Adapt-owned. Calling it from unrelated code starves real effects |

### Telemetry reads

Every read takes `now` in epoch milliseconds.

`AbilityCheckTelemetry`: `checksPerMinute`, `successfulChecksPerMinute`, `checksPerSecond`, `successfulChecksPerSecond`, `cacheHitsPerMinute`, `cacheMissesPerMinute`, `cacheHitRatio`, `averageCheckMicros`, `estimatedTimingMillisPerSecond`, `timingBudgetPercent`, `checksPerTick`, `abilityIds`, `abilitySnapshots`.

`AdaptRuntimeTelemetry`: `xpPerMinute`, `xpPayoutOpsPerMinute`, `provenanceOpsPerMinute`, `eventHandlerOpsPerMinute`.

`AdaptTelemetryClock.millis()` is the ticker-refreshed clock. `refresh()` is Adapt-owned, as are `record...`, `beginExecution`, `endExecution`, and `clear` on both telemetry classes.

### Projectiles, items and value

| Type | Contract |
|------|----------|
| `ProjectileClaims` | `isUnclaimed(Projectile, NamespacedKey...)`, `isUnclaimedContainer(PersistentDataContainer, NamespacedKey...)`. `false` for a null container. `true` for an empty one |
| `ProjectileReplacementRegistry` | `register(Projectile, Claim)`, `begin(Projectile)` returning a `Ticket`, `unregister(UUID)`. `Ticket.complete(replacement)` or `cancel()` exactly once. `clear()` is Adapt shutdown only |
| `DataItem<T>` | Implement `getMaterial`, `getType`, `applyLore`, and `applyMeta`. Optionally implement `getCooldownGroup`. Provided: `blank`, `withData`, `setData`, `getData`, `hasData`, `ensureCooldownGroup`. The persistent-data key comes from Adapt's namespace plus the payload class canonical name's hash |
| `PotionItem` and its nested `Data` | The built-in potion-item base, not a registered public item type |
| `MaterialValue` | `getValue(Material)` reads the cached computed value. `debugValue(Material)` logs the recipe expansion. `get()`, `save()` and `invalidateCache()` are Adapt-owned singleton and cache lifecycle |
| `MaterialCount`, `MaterialRecipe` | Mutable material-and-amount and inputs-and-output pairs used by the calculator. Neither registers Bukkit recipes |

### Notifications and HUD

`Notification` declares `getTotalDuration()`, `play(AdaptPlayer)`, and `getGroup()`, which defaults to `"default"`. `ActionBarNotification`, `TitleNotification`, `SoundNotification`, and `AdvancementNotification` implement it. `SoundNotification.withXP(double)` attaches an XP payload. `Notifier` owns a player's queue, XP aggregation, and tick lifecycle and is constructed by Adapt.

`AdaptHud` exposes `actionBar(Player, String)`, `xpTicker(Player, String)`, `ambientStatus(Player, purpose, String)` / `clearAmbientStatus(Player, purpose)`, `title(Player, title, subtitle)`, `guiTitle(Player, title, subtitle)`, and `clear(Player)`, all on the owning thread. Every one of them publishes an action-bar segment. `title`/`guiTitle` are notice deliveries, not screen titles. `start(Adapt)` and `stop()` are plugin lifecycle.
## See also

- [37 - Recipes, Brewing & Value](/adapt/37-recipes-brewing-value)
- [41 - API - Getting Started](/adapt/41-api-getting-started)
- [45 - API - Events](/adapt/45-api-events)
- [49 - API - Player Data, XP & World](/adapt/49-api-player-data-xp-world)
