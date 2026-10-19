---
title: "Concepts"
description: "Skill XP, knowledge, master level, and ability power"
published: true
date: 2026-10-18T01:55:01.954Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Playing awards skill XP. A skill level awards knowledge for that skill and master XP. Master level sets ability power. An adaptation level costs knowledge and one power.

An adaptation runs only when all of these hold:

- it is learned, and the skill and adaptation are enabled
- the world is not listed in `blacklistedWorlds`
- the game mode is survival or adventure. Creative runs only when `allowAdaptationsInCreative` is true. Spectator never runs
- protectors allow the action
- the player has the adaptation's `adapt.use` node
- no learned id in `adaptationUsageConflicts` blocks it
- no ability-use policy denies it

Active level is 0 when any check fails, and the effect does not run. Other plugins can deny or reprice a use. They cannot grant an adaptation the player has not learned. See [Ability use policy](/adapt/43-api-ability-use-policy).

## Skills

A skill id is a name such as `agility` or `pickaxe`. Its file is `plugins/Adapt/skills/<id>.toml`. Level comes from skill XP through `xpCurve`. The default, `ADAPT_BALANCED`, needs `100 * L^2 + 1200 * L` XP to reach level `L`. Lookups clamp at `experienceMaxLevel`.

Each enabled skill has one advancement tab.

## Adaptations

An adaptation id is kebab-case and starts with the skill name, such as `agility-air-dash`. Its file is `plugins/Adapt/adaptations/<id>.toml`. Level 0 is unlearned. The cap is `maxLevel`.

One level costs `max(1, baseCost + baseCost * level * costFactor)` knowledge. Level 1 also costs `initialCost`. A multi-level purchase sums each step. A refund reverses those steps. `hardcoreNoRefunds` returns nothing. Players cannot unlearn a `permanent` adaptation.

`requires` lists adaptations a player must learn first, each written as `adaptationId:level`, for example `requires = ["rift-blink:2"]`. Entries may name adaptations from any skill. Learning or leveling is refused until every entry is met by levels the player bought; region-granted levels do not count. An entry naming an unknown adaptation can never be met and is logged as a warning at load. Malformed entries are ignored with a warning. While a learned adaptation requires another, players cannot unlearn the required one below that level. A forced removal also removes the learned adaptations whose requirement it breaks, then any that required those, and logs each removal. A requirement that was already unmet, or that names an unknown adaptation or one in a disabled skill, never causes a removal.

Holding level `L` costs `L` power. Region-granted levels cost none. A purchase that fails charges nothing.

Every adaptation file also has `enabled`, `permanent`, `requires`, `showParticles`, and `showSounds`.

## Knowledge

Crossing skill level `i` pays `(i / 13) + 1` knowledge, using integer division. `i` is the level just left. Levels 1 through 12 pay 1. Levels 13 through 25 pay 2.

## Master level and power

Each skill level crossed adds master XP:

```
playerXpPerSkillLevelUpBase + i * playerXpPerSkillLevelUpLevelMultiplier
```

`i` is the level just left. Master level uses the same `xpCurve`.

```
maxPower  = max(0, floor(masterLevel * powerPerLevel) + regionPowerBonus)
usedPower = sum of learned adaptation levels that are not region-granted
```

A purchase that would exceed `maxPower` fails. If max power drops below used power, Adapt removes learned levels, lowest first, until used power fits. It takes levels that no other learned adaptation requires before prerequisite levels; if a prerequisite level must still drop, the adaptations whose requirement it breaks are removed too. Those levels are not refunded. Region grants are not removed.

`regionPowerBonus` is the current WorldGuard `adapt-power-bonus`. It is not saved. See [Protection and region policy](/adapt/08-protection-region-policy).

## Wisdom

On the one-second tick, XP past `experienceMaxLevel` grants 1 wisdom and sets that skill's XP back to one level under the cap. Clear commands clear wisdom.

## Storage

Adapt stores one JSON file per player under `data/players/` unless `sql.enabled` is true. SQL stores the profile in `ADAPT_DATA` and the ownership fence in `ADAPT_DATA_FENCE`. If a profile cannot be loaded, the player still joins and Adapt stays inactive for that player until the profile loads.

With advancements enabled, local advancement progress lives in `data/advancements.db`. SQL mode stores it in `ADAPT_ADVANCEMENT_TEAMS`, `ADAPT_ADVANCEMENT_PLAYERS`, `ADAPT_ADVANCEMENT_PROGRESS`, and `ADAPT_ADVANCEMENT_UNREDEEMED` in the configured schema. `ADAPT_ADVANCEMENT_MIGRATIONS` prevents completed startup imports from repeating; include it when backing up or restoring advancement data. See [SQL and Redis](/adapt/01-installation-configuration#sql-and-redis) for import behavior.

Curves, multipliers, and the key tables are in [Configuration math](/adapt/05-configuration-math).
