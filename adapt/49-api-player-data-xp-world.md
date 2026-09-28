---
title: "API - Player Data, XP & World"
description: "Read player data, award XP, and work with world data"
published: true
date: 2026-09-28T10:36:37.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Lookups and rewards run on the thread that owns the player. On Folia that is the player's region thread. A connected player can have no Adapt runtime while the profile is loading, failed validation, or lost its SQL fence. Reward calls do nothing in that state and do not create a profile.

Read `PlayerData` and `PlayerSkillLine`. Do not call their setters. Change levels with `AdaptationLearningTransaction`. Change XP with the reward calls below.

Get the server from `Adapt.instance.getAdaptServer()` after Adapt has enabled. The lookup in [Skills and adaptations](/adapt/42-api-skills-adaptations) is the checked form.

`getPlayerData(UUID)` reads memory only. It can still return the wrapper kept for about 60 seconds after quit, and it is empty while an online player's runtime is unavailable. `getOnlineAdaptPlayer(UUID)` and `getPlayer(Player)` return the current ready session, or `null`. `peekData(UUID)` inspects memory, a pending local write, SQL, or the JSON file. It does not claim SQL ownership or use Redis. A missing offline profile returns an empty `PlayerData`. Do not call `peekData` from a tick.

On `AdaptPlayer`, read `getPlayer()`, `getData()`, `getSkillLine(name)`, `hasAdaptation(id)`, `hasSkill(skill)`, `isBusy()`, the food-charge queries, and `saveNow()`. Do not construct an `AdaptPlayer`, and do not call its tick, login, or unregister methods.

## Awarding progression

| Call | Novelty | Region policy | Telemetry |
|---|---|---|---|
| `Skill.xp`, `Skill.xpS` | yes | yes | yes |
| `Skill.xpSilent` | no | no | yes |
| `XP.xp`, `XP.xpSilent` | no | no | no |

`Skill.xpS` keeps the XP visuals. `Skill.xpSilent` still applies the line multiplier and monotony. `XP.xp` is the raw call under both. It applies the player multiplier, monotony, and pooled payout, and skips location checks. Use it only when that bypass is intentional.

`Adaptation.xp` and `Adaptation.xpSilent` forward to the owning skill with reward key `adaptation:<id>:<key>`, or `adaptation:<id>:use` when no key is passed. Novelty treats one key as one activity.

`XP` also has `knowledge`, `wisdom`, `boostXP`, and `spatialXP`. Boost durations are milliseconds. `XpNovelty` and `XpProvenance` return the same multipliers the award path uses. Do not register `XpNoveltyListener` or `XpProvenanceListener`. Adapt already does.

## Player preferences

`PlayerData.getPreferences()` keeps skill and adaptation choices independently of learned levels. Skill values occupy a separate scope, so resetting a skill switch preserves child adaptation choices. Preferences survive level changes and unlearning and use the same local/SQL player-data persistence as progression. Apply live changes through the validated operations in [Player preference controls](/adapt/42-api-skills-adaptations#player-preference-controls).

## World data

`WorldData.of(world)` is the block store. Use its get, set, remove, and provenance methods on the region thread. `stop`, `unregister`, `onTick`, and the save and unload handlers belong to Adapt.

## Reference

### AdaptServer lookups

| Call | Result |
|------|--------|
| `AdaptPlayer getOnlineAdaptPlayer(UUID)` | Current ready `AdaptPlayer`, or `null` when the player is offline or Bukkit-online with Adapt unavailable |
| `AdaptPlayer getPlayer(Player)` | Lookup-only wrapper for that exact current, ready Bukkit session, or `null`. It never loads data or creates a runtime. Owning thread only |
| `Optional<PlayerData> getPlayerData(UUID)` | In-memory data only. Empty for an online unavailable player; otherwise may include the wrapper retained for about 60 seconds after a normal quit. Performs no storage work |
| `PlayerData peekData(UUID)` | Unfenced inspection through the purge guard, in-memory state, safe prefetch, pending local operation, direct SQL, and local JSON as applicable. It does not claim ownership or request Redis transfer data, never caches load-failed data, and returns an empty value immediately for an online unavailable player. Returns a new empty `PlayerData` when no offline profile is found, never `null`. Not a tick-path query |
| `int getOnlineAdaptationLevel(UUID, String skillName, String adaptationName)` | Online learned level after global and personal skill/adaptation enable checks, or `0` when unavailable. The named adaptation must belong to the named enabled skill. This lookup does not run action-specific protection or permission checks |
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

Other rewards: `Skill.knowledge(Player, long)`, `Skill.xp(Location, double, int radius, long duration)` and `XP.spatialXP(Location, Skill, double, int radius, long duration)` for a spatial pulse, and `XP.knowledge(...)` / `XP.wisdom(...)` / `XP.boostXP(...)`. Player-targeted application is inert unless the exact current session has a ready Adapt runtime.

Every path applies the player's XP multiplier (permission multipliers plus global and per-skill boosts) and the monotony multiplier inside `PlayerSkillLine.giveXP`. It honors pooled payout batching when `xpIntegrity.pooledPayoutEnabled` is on.

### Curves, multipliers and integrity helpers

| Type | Contract |
|------|----------|
| `Curves` | The configured curve enum. `getCurve()` returns its `NewtonCurve` |
| `NewtonCurve` | Low-level curve conversion. Adapt's public `XP.getXpForLevel` and `XP.getLevelForXp` helpers clamp every curve family to `experienceMaxLevel` and fall back to the balanced curve if a configured curve produces a non-finite result |
| `XPMultiplier` | Mutable timed multiplier record stored inside player data. `XPMultiplier.owned(source, bonus, durationMillis)` retains its source through persistence. Add it with `PlayerData.globalXPMultiplier(multiplier)` and remove only that source with `removeGlobalXPMultipliers(source)` on the player owner thread. Unowned multipliers and other sources remain intact. |
| `SpatialXP` | Adapt-owned pending spatial reward. Create it through `XP.spatialXP`, never by constructing one and offering it to `AdaptServer` |
| `XpNovelty` | `noveltyMultiplier(player, location, rewardKey)`, `adjacencyBonusMultiplier(player, placedBlock)`, `fieldCycleMultiplier(player, cropBlock)`, `clear(uuid)`. Owning region thread only |
| `XpProvenance` | Records placed, broken, piston-moved, replaced and bonemealed blocks and returns `placeXpMultiplier`, `breakXpMultiplier`, `harvestXpMultiplier` from that history. Owning region thread only |

### WorldData

`WorldData.of(world)` gives the live store. `get(Block, Class<T>)`, `set(Block, T)`, and `remove(Block, Class<T>)` are the typed block-attached accessors. `getEarningsMultiplier(Block)` reads the current anti-farm multiplier. `reportEarnings(Block)` records an earning and returns the resulting multiplier. All of them are region-thread-bound. `stop()`, `unregister()`, `onTick()`, and the world save and unload handlers are Adapt-owned lifecycle.

## See also

- [02 - Concepts](/adapt/02-concepts)
- [05 - Configuration Math](/adapt/05-configuration-math)
- [42 - API - Skills & Adaptations](/adapt/42-api-skills-adaptations)
