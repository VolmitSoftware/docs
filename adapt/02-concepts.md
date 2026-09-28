---
title: "Concepts"
description: "Skill XP, knowledge, master level, and ability power"
published: true
date: 2026-09-28T18:00:00.000Z
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

One level costs `max(1, baseCost + baseCost * level * costFactor)` knowledge. Level 1 also costs `initialCost`. A multi-level purchase sums each step. A refund reverses those steps. `hardcoreNoRefunds` returns nothing. `permanent` blocks a player unlearn.

Holding level `L` costs `L` power. Region-granted levels cost none. A purchase that fails charges nothing.

Every adaptation file also has `enabled`, `permanent`, `showParticles`, and `showSounds`.

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

A purchase that would pass `maxPower` fails. If max power drops below used power, the lowest learned adaptation levels are removed until it fits. Those levels are not refunded. Region grants are not removed.

`regionPowerBonus` is the current WorldGuard `adapt-power-bonus`. It is not saved. See [Protection and region policy](/adapt/08-protection-region-policy).

## Wisdom

On the one-second tick, XP past `experienceMaxLevel` grants 1 wisdom and sets that skill's XP back to one level under the cap. Clear commands clear wisdom.

## Mutations

Mutations are a separate track: two slots, no knowledge cost, off until enabled. See [Mutations](/adapt/34-mutations-overview).

## Storage

One JSON file per player under `data/players/`, unless `sql.enabled`. SQL stores the profile in `ADAPT_DATA` and the ownership fence in `ADAPT_DATA_FENCE`. If a profile cannot be loaded, the player still joins and Adapt stays inactive for that player until the profile loads.

Curves, multipliers, and the key tables are in [Configuration math](/adapt/05-configuration-math).
