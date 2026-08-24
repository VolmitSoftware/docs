---
title: "API - Player Data, XP & World"
description: "Adapt documentation: API - Player Data, XP & World"
published: true
date: 2026-08-23T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Adapt lets you look up an online player's progression and award them XP, knowledge, and wisdom. It does not offer a general persistence API. The objects behind those lookups, `PlayerData` and `PlayerSkillLine`, are the live mutable runtime state Adapt itself ticks, saves, and publishes. Reading them is fine. Writing to them is not.

The three things you will actually use are `AdaptServer` for lookup, the `XP` / `Skill` / `Adaptation` helpers for rewards, and `WorldData` for block-scoped storage. Everything else on this page is documented so that public visibility is not mistaken for a promise.

Almost all of it is thread-bound. Adapt runs a player's data on the thread that owns them, the main thread on Paper and the owning region thread on Folia. The reward pipeline touches inventories, effects, and the HUD. Call these on the player's owning thread.

## Looking up online state

Get the server through `Adapt.instance.getAdaptServer()`, or through the checked plugin lookup shown in [42 - API - Skills & Adaptations](/adapt/42-api-skills-adaptations), once Adapt has enabled.

Two lookups are easy to mix up. `getPlayerData(UUID)` reads the in-memory player map and never touches storage. That map retains a retired wrapper for about 60 seconds after quit, so use `getOnlineAdaptPlayer(UUID)` when online membership matters. `peekData(UUID)` is an inspection read, not the fenced login path. It checks the purge guard and in-memory state, may reuse a stable prefetch, then inspects a pending local queue operation, direct SQL or local JSON as applicable. It never claims SQL ownership or performs a Redis handoff. A failed SQL inspection can return preserved local data with its save guard set, and a missing profile returns a fresh empty `PlayerData`. Keep `peekData` off tick paths.

`AdaptPlayer` is the online wrapper. Read `getPlayer()`, `getData()`, `getSkillLine(name)`, `hasAdaptation(id)`, `hasSkill(skill)`, `isBusy()`, the food-charge queries, and `saveNow()` when you need an immediate flush. Do not construct one. Do not call its runtime, tick, login, or unregister methods. Do not use its random or recency XP routing from outside Adapt. Its nested `FxPosition` and `FoodCharge` records are plain value results.

`PlayerData` and `PlayerSkillLine` are safe to read and unsafe to write. Their
setters, clear methods, XP and knowledge writes, and adaptation writes all
bypass those controls. JSON methods, update methods, and raw collection getters
do the same. The controls are transaction ordering, integrity checks, snapshot
publication, and persistence ownership. Use `AdaptationLearningTransaction` to
change learned levels and the reward helpers below to change XP.

## Awarding progression

There are three entry points and they are not equivalent.

`Skill.xp(player, ...)` and `Skill.xpS(player, location, ...)` run the full
production path. They apply skill-enabled and runtime-player checks and the
novelty multiplier for the reward key and location. They then apply the region
XP policy from the installed `RegionPolicySource`, a telemetry record, and the
handoff to `XP`. The visible form also fires the XP particle burst when the
payout is large enough and the config allows it.

`Skill.xpSilent(player, ...)` skips novelty and region policy. It still records telemetry. It still runs the multiplier and monotony logic inside the skill line. Use it when the reward is not tied to a place, for example a periodic tick payout.

`XP.xp(...)` and `XP.xpSilent(...)` are the raw calls both of the above end in. They apply the player's multiplier (permission multipliers plus global and per-skill boosts), the monotony multiplier, and pooled payout batching if it is enabled. They apply no novelty, no region policy, and no telemetry. Use them only when you deliberately want to bypass the location-aware integrity checks.

`Adaptation.xp(...)` and `Adaptation.xpSilent(...)` forward to the owning skill after rewriting the reward key to `adaptation:<adaptation-id>:<your key>`. They fall back to `adaptation:<adaptation-id>:use` when you pass none. Pass a stable `rewardKey` for a repeated source. Novelty scoring uses it to tell one source of XP from another. A shared or missing key makes two unrelated grinds look like the same one.

`XP` also carries `knowledge(...)`, `wisdom(...)`, `boostXP(...)`, and `spatialXP(...)` for a delayed reward claimable inside a radius. Boost durations are `long` milliseconds throughout `XP`, `AdaptPlayer`, `PlayerData`, and `PlayerSkillLine`; expiry saturates instead of overflowing. It also carries pure curve helpers converting between XP, level, and progress. `XpNovelty` and `XpProvenance` are the anti-farm layer behind those multipliers. They can be called directly for the same numbers. `XpNoveltyListener` and `XpProvenanceListener` are Adapt-owned Bukkit listeners. Registering either a second time double-counts every event.

## World-scoped data

`WorldData.of(world)` returns Adapt's live per-world store. It attaches typed values to individual blocks and drives the anti-farm earnings bookkeeping on top of that. `Earnings` and `PlacementStamp` are the stored unit types behind it and behind `XpProvenance`. Their nested matter serializers are implementation detail. Use the higher-level provenance methods instead of instantiating serializers.

## Reference

### AdaptServer lookups

| Call | Result |
|------|--------|
| `AdaptPlayer getOnlineAdaptPlayer(UUID)` | Live `AdaptPlayer`, or `null` when the player is not online and loaded |
| `AdaptPlayer getPlayer(Player)` | Live wrapper for an online Bukkit player. Creates and starts one with a warning if it is missing. Owning thread only |
| `Optional<PlayerData> getPlayerData(UUID)` | In-memory data only. May include the wrapper retained for about 60 seconds after quit. Performs no storage work |
| `PlayerData peekData(UUID)` | Unfenced inspection through the purge guard, in-memory state, safe prefetch, pending local operation, direct SQL, and local fallback. It does not claim ownership or request Redis transfer data. Returns a new empty `PlayerData` when nothing is found, never `null`. Not a tick-path query |
| `int getOnlineAdaptationLevel(UUID, String skillName, String adaptationName)` | Stored online learned level for that adaptation, `0` when the player is offline or their runtime is not ready. The `skillName` argument is accepted and never read |
| `boolean hasOnlineLearner(String adaptationName)` | Whether any online player has learned it |
| `boolean hasOnlineLearner(UUID, String adaptationName)` | Whether that specific online player has learned it |
| `List<AdaptPlayer> getLearnedAdaptPlayerSnapshot(String adaptationName)` | Cached immutable snapshot of the online learners of that adaptation |

`AdaptServer` constructors, lifecycle, event handlers, data reset, GUI opening, global boost, and persistence methods are not general API.

### Reward calls

| Call | Novelty | Region XP policy | Telemetry |
|------|---------|------------------|-----------|
| `Skill.xp(Player, double[, key])`, `Skill.xp(Player, Location, double[, key])` | yes | yes | yes |
| `Skill.xpS(Player, Location, double[, key])`, silent but keeps visuals | yes | yes | yes |
| `Skill.xpSilent(Player, double[, key])` | no | no | yes |
| `Adaptation.xp(...)` / `Adaptation.xpSilent(...)`, keyed `adaptation:<id>:<key>` | as the `Skill` call it forwards to | | |
| `XP.xp(...)`, `XP.xpSilent(...)` | no | no | no |

Other rewards: `Skill.knowledge(Player, long)`, `Skill.xp(Location, double, int radius, long duration)` and `XP.spatialXP(Location, Skill, double, int radius, long duration)` for a spatial pulse, and `XP.knowledge(...)` / `XP.wisdom(...)` / `XP.boostXP(...)`.

Every path applies the player's XP multiplier (permission multipliers plus global and per-skill boosts) and the monotony multiplier inside `PlayerSkillLine.giveXP`. It honors pooled payout batching when `xpIntegrity.pooledPayoutEnabled` is on.

### Curves, multipliers and integrity helpers

| Type | Contract |
|------|----------|
| `Curves` | The configured curve enum. `getCurve()` returns its `NewtonCurve` |
| `NewtonCurve` | Low-level curve conversion. Adapt's public `XP.getXpForLevel` and `XP.getLevelForXp` helpers clamp every curve family to `experienceMaxLevel` and fall back to the balanced curve if a configured curve produces a non-finite result |
| `XPMultiplier` | Mutable timed multiplier record stored inside player data |
| `SpatialXP` | Adapt-owned pending spatial reward. Create it through `XP.spatialXP`, never by constructing one and offering it to `AdaptServer` |
| `XpNovelty` | `noveltyMultiplier(player, location, rewardKey)`, `adjacencyBonusMultiplier(player, placedBlock)`, `fieldCycleMultiplier(player, cropBlock)`, `clear(uuid)`. Owning region thread only |
| `XpProvenance` | Records placed, broken, piston-moved, replaced and bonemealed blocks and returns `placeXpMultiplier`, `breakXpMultiplier`, `harvestXpMultiplier` from that history. Owning region thread only |

### WorldData

`WorldData.of(world)` gives the live store. `get(Block, Class<T>)`, `set(Block, T)`, and `remove(Block, Class<T>)` are the typed block-attached accessors. `getEarningsMultiplier(Block)` reads the current anti-farm multiplier. `reportEarnings(Block)` records an earning and returns the resulting multiplier. All of them are region-thread-bound. `stop()`, `unregister()`, `onTick()`, and the world save and unload handlers are Adapt-owned lifecycle.

### Types that are not contracts

| Type | Runtime role and restriction |
|------|------------------------------|
| `PlayerData` | Live mutable progression record. Reads such as `getLevel()`, `getMaxPower()`, `getUsedPower()`, `getAvailablePower()`, `hasPowerAvailable(...)`, `getStat(...)`, `getSkillLine(...)` and `getMutationData()` are fine. All writes bypass transaction, integrity, publication and persistence ownership |
| `PlayerSkillLine` | Live mutable skill line. Level, XP, knowledge, multiplier, progress, learned adaptation level and recent-earn reads are fine. Writes are not |
| `PlayerAdaptation` | Mutable serialized adaptation record. `REGION_GRANTED_KEY`, `isRegionGranted()` and `setRegionGranted(...)` belong to region-grant reconciliation |
| `FencedPlayerSnapshot` | Exact player, owner, epoch, sequence and JSON transfer/persistence value. It is not an external save API |
| `AdaptServerData`, `AdaptStatTracker`, `AdvancementHandler`, `Discovery<T>` | First-party server and player state plus advancement helpers, not lifecycle contracts |
| `AdaptPlayerTracker` | An empty public class with no members and no behavior |
| `PlayerDataPersistenceQueue` | Owns local save/delete journals plus fenced SQL save, reset, purge, recovery, retries, batching, and shutdown flush. A second queue can race or resurrect data |
| `PlayerDataPurgeGuard` | Global tombstone set that stops queued writes landing after a deletion. Adapt owns mark, clear and reset |
| `AdaptComponent` | Large first-party convenience interface for item classification, server and player access, value, FX and event helpers. Some signatures use relocated or version-specific types |
| `AdaptDebugMode` | Global operator debug-bypass state. Use `/adapt debug mode`. Setting it externally bypasses normal authorization |

## See also

- [02 - Concepts](/adapt/02-concepts)
- [05 - Configuration Math](/adapt/05-configuration-math)
- [38 - Runtime Architecture](/adapt/38-runtime-architecture)
- [42 - API - Skills & Adaptations](/adapt/42-api-skills-adaptations)
- [48 - API - Mutations](/adapt/48-api-mutations)
