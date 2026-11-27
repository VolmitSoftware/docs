---
title: "Concepts"
description: "Skill XP, knowledge, master level, and ability power"
published: true
date: 2026-11-26T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Playing awards skill XP. A skill level awards knowledge for that skill and master XP. Master level sets ability power. An adaptation level costs knowledge; holding the adaptation uses one power at any level.

An adaptation runs only when all of these hold:

- it is learned, and the skill and adaptation are enabled
- the world is not listed in `blacklistedWorlds`
- the game mode is survival or adventure. Creative runs only when `allowAdaptationsInCreative` is true. Spectator never runs
- protectors allow the action
- the player has the adaptation's `adapt.use` node
- no learned id in `adaptationUsageConflicts` blocks it
- no ability-use policy denies it

Active level is 0 when any check fails, and the effect does not run. Other plugins can deny or reprice a use. They cannot grant an adaptation the player has not learned. See [Ability policy, costs and protection](/adapt/50-api-abilities-protection).

## Skills

A skill id is `<namespace>:<name>`, such as `adapt:agility`. Built-in skills are in the `adapt` namespace; addons bring their own. Commands and config entries accept a bare name such as `agility` for `adapt` content. A skill's file is `plugins/Adapt/skills/<namespace>/<name>.toml`, such as `skills/adapt/agility.toml`. Level comes from skill XP through `xpCurve`. The default, `ADAPT_BALANCED`, needs `100 * L^2 + 1200 * L` XP to reach level `L`. Lookups clamp at `experienceMaxLevel`.

Each enabled skill has one advancement tab.

## Adaptations

An adaptation id is `<namespace>:<skill>/<name>`, such as `adapt:agility/air_dash`, and a bare `agility/air_dash` means the same. Its file is `plugins/Adapt/adaptations/<namespace>/<skill>/<name>.toml`, such as `adaptations/adapt/agility/air_dash.toml`. Level 0 is unlearned. The cap is `maxLevel`.

One level costs `max(1, baseCost + baseCost * level * costFactor)` knowledge. Level 1 also costs `initialCost`. A multi-level purchase sums each step. A refund reverses those steps. `hardcoreNoRefunds` returns nothing. Players cannot unlearn a `permanent` adaptation.

`requires` lists adaptations a player must learn first, each written as `<adaptation id>@<level>`, for example `requires = ["adapt:rift/blink@2"]`; a bare id such as `rift/blink@2` is in the `adapt` namespace. Entries may name adaptations from any skill. Learning or leveling is refused until every entry is met by levels the player bought; region-granted levels do not count. An entry naming an unknown adaptation can never be met and is logged as a warning at load. Malformed entries are ignored with a warning. While a learned adaptation requires another, players cannot unlearn the required one below that level. A forced removal also removes the learned adaptations whose requirement it breaks, then any that required those, and logs each removal. A requirement that was already unmet, or that names an unknown adaptation or one in a disabled skill, never causes a removal.

Holding an adaptation uses 1 power at any level; raising it further costs knowledge only. Region-granted adaptations use none. A purchase that fails charges nothing.

Every adaptation file also has `enabled`, `permanent`, `requires`, `showParticles`, and `showSounds`.

## Knowledge

Reaching a skill level pays knowledge: level 1 pays nothing, levels 2 to 5 pay 3 each, levels 6 to 30 pay 2 each, and every level from 31 on pays 3. A skill at level 5 has earned 12 knowledge, at level 15 32, and at level 25 52. See [Progression and costs](/adapt/38-progression-costs) for the full table.

## Master level and power

Each skill level crossed adds master XP:

```
playerXpPerSkillLevelUpBase + i * playerXpPerSkillLevelUpLevelMultiplier
```

`i` is the level just left. Master level uses the same `xpCurve`.

```
maxPower  = max(0, floor(maxPowerScale * sqrt(masterLevel)) + regionPowerBonus)
usedPower = number of learned adaptations that are not region-granted
```

Learning a new adaptation that would exceed `maxPower` fails; raising one you already hold never needs power. If max power drops below used power, Adapt removes whole learned adaptations until used power fits, with no refund. It removes adaptations no other learned adaptation requires first, then the lowest-level ones, breaking ties by skill id and then adaptation id; removing a prerequisite also removes the adaptations whose requirement it breaks. Region grants are not removed.

`regionPowerBonus` is the current WorldGuard `adapt-power-bonus`. It is not saved. See [Protection and region policy](/adapt/08-protection-region-policy).

## Wisdom

On the one-second tick, XP past `experienceMaxLevel` grants 1 wisdom and sets that skill's XP back to one level under the cap. Clear commands clear wisdom.

## Storage

Adapt stores one JSON file per player under `data/players/` unless `sql.enabled` is true. SQL stores the profile in `ADAPT_DATA` and the ownership fence in `ADAPT_DATA_FENCE`. If a profile cannot be loaded, the player still joins and Adapt stays inactive for that player until the profile loads.

With advancements enabled, local advancement progress lives in `data/advancements.db`. SQL mode stores it in `ADAPT_ADVANCEMENT_TEAMS`, `ADAPT_ADVANCEMENT_PLAYERS`, `ADAPT_ADVANCEMENT_PROGRESS`, and `ADAPT_ADVANCEMENT_UNREDEEMED` in the configured schema. `ADAPT_ADVANCEMENT_MIGRATIONS` prevents completed startup imports from repeating; include it when backing up or restoring advancement data. See [SQL and Redis](/adapt/01-installation-configuration#sql-and-redis) for import behavior.

Curves, multipliers, and the key tables are in [Configuration math](/adapt/05-configuration-math).
