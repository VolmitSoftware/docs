---
title: "API - Skills & Adaptations"
description: "Read Adapt skills and adaptations or change learned levels"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
`Skill` represents one of the 23 progression lines. `Adaptation` represents a purchasable ability inside a skill. Use the supported read-only members listed below, and use `AdaptationLearningTransaction` to change a player's learned level.

Some unsupported accessors expose relocated VolmLib collections and bind that package path into your jar. See [Adapt relocates VolmLib](/adapt/41-api-getting-started#adapt-relocates-volmlib).

## Getting the registry

Get the registry from an enabled Adapt instance. Do not request it from `onLoad`.

```java
Plugin plugin = Bukkit.getPluginManager().getPlugin("Adapt");
if (plugin instanceof Adapt adapt && adapt.isEnabled()) {
    SkillRegistry registry = adapt.getAdaptServer().getSkillRegistry();
    Skill<?> skill = registry.getSkill("rift");
}
```

`getSkill(String)` finds enabled skills only. `getAnySkill(String)` also sees skills Adapt knows about but has disabled. Both accept the id in any casing. `getSkills()` and `getAllSkills()` hand back a fresh snapshot each call, declared as `List<Skill<?>>`. Iterating one is safe while the catalogue changes underneath you. If you cache anything derived from the catalogue, key the cache on `getCatalogRevision()`. It changes whenever a skill or adaptation is registered, unregistered, or hot-reloaded.

Registration, hot reload, advancement and recipe synchronization, the registry's own event handlers, and `unregister()` are Adapt lifecycle operations. Calling them from outside is not supported.

## Reading a skill or an adaptation

Supported accessors return a `String`, `int`, `boolean`, `Material`, or another Bukkit type. Two methods need extra care.

`Skill.getLocalizedName()` does not resolve the localization catalogue despite the name. It capitalizes the registry id. `rift` becomes `Rift` in every locale. Use `getDisplayName()` for player-facing text.

On `Adaptation`, `getLevel(Player)` is the stored learned level and nothing else. `getActiveLevel(Player)` runs the whole gate: learned level, world blacklist, game mode, protection, `adapt.use` permission, usage conflicts, `AdaptAdaptationUseEvent`, and every registered `AbilityUsePolicy`. It returns `0` the moment any of them says no. If you want to know whether an ability would actually fire right now, that is the one to call.

Everything else on these interfaces is first-party authoring code. That includes storage, XP, scheduling, damage and projectile helpers, GUI, recipes, advancements, models, ticking, registration, and config mutation. Some of it names relocated types. All of it mutates Adapt-owned runtime state.

## Learning and unlearning

`AdaptationLearningTransaction` is the only supported way to change a learned level. Each of its two statics is a complete transaction. It clamps the target. It checks power and knowledge. It runs the Vault charge or refund when the learning economy is on. It honors permanent-adaptation rules and the hardcore no-refunds setting. It converts a region-granted level into a paid one.

```java
AdaptationLearningTransaction.Result result =
    AdaptationLearningTransaction.learn(adaptation, player, 3, false);
```

Call it on the tick thread that owns the player. Pass the level the player should end up at rather than a delta. `learn` clamps to the adaptation's max level. `unlearn` clamps at zero. Pass `bypassCosts = true` only for an administrative action you have already authorised. It skips the power, knowledge, and money checks. On `unlearn` it also overrides the permanent-adaptation refusal and pays nothing back. The returned `Result` is the complete outcome. Do not also write `PlayerSkillLine` yourself. A `RuntimeException` thrown part way through `learn` rolls back the level, the knowledge, and any Vault charge before it propagates.
## Reference

### Supported `SkillRegistry` members

| Member | Returns | Notes |
|---|---|---|
| `getSkill(String)` | `Skill<?>` | Enabled skills only. `null` when unknown |
| `getAnySkill(String)` | `Skill<?>` | Also sees known disabled skills |
| `getSkills()` | `List<Skill<?>>` | Snapshot of enabled skills |
| `getAllSkills()` | `List<Skill<?>>` | Snapshot of every known skill |
| `getCatalogRevision()` | `long` | Cache-invalidation key |

### Supported read-only `Skill` members

| Member | Returns |
|---|---|
| `getName()` | `String`, the registry id, for example `rift` |
| `isEnabled()` | `boolean` |
| `getIcon()` | `Material` |
| `getDescription()` | `String` |
| `getDisplayName()`, `getDisplayName(int)`, `getShortName()` | `String` |
| `getLocalizedName()` | `String`, the capitalized registry id, not a translation |
| `getConfigurationClass()` | `Class<T>` |
| `getConfig()` | `T`, when the consumer already knows the config type |

Do not call `getAdaptations()`, `getRecipes()`, `getStatTrackers()`, `getModel()`, the registration or XP helpers, or the tick methods. Those either return a relocated `KList` or mutate Adapt-owned state. `Skill.getId()` comes from the ticker and is a random UUID with a suffix, not the skill key.

### Supported read-only `Adaptation` members

| Member | Returns |
|---|---|
| `getName()` | `String`, the adaptation id, for example `rift-blink` |
| `getSkill()` | `Skill<?>` |
| `getIcon()` | `Material` |
| `getDescription()`, `getDisplayName()`, `getDisplayName(int)` | `String` |
| `getMaxLevel()`, `getBaseCost()`, `getInitialCost()` | `int` |
| `getCostFactor()` | `double` |
| `getCostFor(int)`, `getCostFor(int, int)`, `getRefundCostFor(int, int)`, `getPowerCostFor(int, int)` | `int` |
| `getLevel(Player)` | `int`, the stored learned level |
| `getActiveLevel(Player)` | `int`, `0` unless every gate passes |
| `isEnabled()`, `isPermanent()`, `canUse(Player)` | `boolean` |

`canUse(Player)` is public and fires `AdaptAdaptationUseEvent` plus every `AbilityUsePolicy` on its own, without the learned-level test. It is the one path that can present a policy with `level() == 0`.

### `AdaptationConfig` fields

The base TOML shape for a first-party adaptation. External code may read these but must not replace a live config object.

| Key | Type | Default | What it does |
|---|---|---|---|
| `enabled` | boolean | `true` | Turns the adaptation off without removing files |
| `permanent` | boolean | `false` | Purchases normally; once learned, normal unlearning is refused. Administrative bypass can lower it without a refund |
| `showParticles` | boolean | `true` | Plays this adaptation's particle effects |
| `showSounds` | boolean | `true` | Plays this adaptation's sound effects |
| `baseCost` | int | `4` | Knowledge charged per level before the scaling factor |
| `costFactor` | double | `0.45` | Growth applied to each level above the first |
| `maxLevel` | int | `5` | Highest level a player can reach |
| `initialCost` | int | `2` | Knowledge charged for level 1 |

### `AdaptationLearningTransaction.Result`

| Constant | Meaning |
|---|---|
| `LEARNED` | The level was raised |
| `UNLEARNED` | The level was lowered |
| `NO_CHANGE` | The target matched or was worse than the current paid level |
| `SKILL_LINE_UNAVAILABLE` | The player has no skill line for the owning skill |
| `INSUFFICIENT_POWER` | Not enough power for the requested levels |
| `INSUFFICIENT_KNOWLEDGE` | Not enough knowledge, or the knowledge spend failed |
| `INSUFFICIENT_FUNDS` | Vault refused the withdrawal for lack of balance |
| `ECONOMY_UNAVAILABLE` | Vault or its economy provider is missing |
| `ECONOMY_FAILED` | Vault accepted the call and reported a failure |
| `PERMANENT` | `unlearn` refused because the adaptation is permanent |
## See also

- [41 - API - Getting Started](/adapt/41-api-getting-started)
- [43 - API - Ability Use Policy](/adapt/43-api-ability-use-policy)
- [44 - API - Ability Cost](/adapt/44-api-ability-cost)
- [45 - API - Events](/adapt/45-api-events)
- [10 - Skills Catalog](/adapt/10-skills-catalog)
