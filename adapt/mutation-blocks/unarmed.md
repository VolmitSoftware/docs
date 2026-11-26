---
title: "Mutation Blocks - Unarmed"
description: "What Unarmed brings to every mutation it joins"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These six pieces are what Unarmed brings to every [mutation](/adapt/35-mutations) it joins. The Mutations page shows which mutated adaptations use which piece.

## Blocks

### Unarmed Trigger (`block-unarmed-trigger`)

Sets off on every third bare-hand melee hit in a row, then the count starts over. Each hit must come within 2 seconds of the one before. A hit with an item in your main hand resets the count, and so does a swing that hits nothing, unless it comes within 0.28 seconds of your last hit. It counts as a fight action, and the fight Strike lands on the target of the third hit. A hit on a mob from a spawner, spawn egg, bucket or breeding, a minion, a grave mob or one of your own pets still sets it off, but pieces that hand out drops, healing or other rewards do nothing for it.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `hitsInARow` | `3` | Bare-hand hits in a row that set the Trigger off. |
| `comboWindowMillis` | `2000` | Longest gap between two hits of the same combo, in milliseconds. |
| `missGraceMillis` | `280` | How long after a hit a missed swing is still forgiven, in milliseconds. |

### Unarmed Fight Strike (`block-unarmed-strike-fight`)

Knocks the target away from you and weakens it for 3 seconds. The knockback is 0.8 at the first level of the mutated adaptation and 1.4 at its top level; the effect is Weakness I at the first level and Weakness II at the top level. It affects only targets you are allowed to damage.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `durationMillis` | `3000` | How long the target stays weakened, in milliseconds. |
| `knockbackAtFirstLevel` | `0.8` | Knockback strength at the first level. |
| `knockbackAtTopLevel` | `1.4` | Knockback strength at the top level. |
| `weaknessAmplifierAtFirstLevel` | `0` | Weakness amplifier at the first level; 0 is Weakness I. |
| `weaknessAmplifierAtTopLevel` | `1` | Weakness amplifier at the top level. |

### Unarmed Work Strike (`block-unarmed-strike-work`)

Readies a meditation for 30 seconds. Start sneaking within that time and stay still with both hands empty for 3 seconds to get Absorption: 2 hearts for 1 minute at the first level of the mutated adaptation, rising to 6 hearts for 2 minutes at its top level. One meditation every 30 seconds; while that cooldown runs the strike does nothing and costs nothing. It does not fire from a farmed action, such as a bone-mealed harvest.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `absorptionAmplifierAtFirstLevel` | `0` | Absorption amplifier at the first level; 0 is 2 hearts, 1 is 4, 2 is 6. |
| `absorptionAmplifierAtTopLevel` | `2` | Absorption amplifier at the top level. |
| `absorptionMillisAtFirstLevel` | `60000` | How long the absorption lasts at the first level, in milliseconds. |
| `absorptionMillisAtTopLevel` | `120000` | How long the absorption lasts at the top level, in milliseconds. |
| `readyMillis` | `30000` | How long the meditation stays ready after the strike, in milliseconds. |
| `stillTicks` | `60` | How long you must sneak still, in ticks. |
| `stationaryEpsilonSquared` | `0.01` | Most squared movement still counted as still. |
| `cooldownMillis` | `30000` | Time between meditations, in milliseconds. |

### Unarmed Boon (`block-unarmed-boon`)

Regeneration for 3 seconds: Regeneration I at the first level of the mutated adaptation and Regeneration II at its top level. For the next 15 seconds each bare-hand kill restores 2 food at the first level and 4 at its top level, 1.5 saturation, and the same regeneration again. Kills of players and of farmed mobs (spawner, egg, bred and other farm mobs, your own pets) restore nothing. A kill the boon pays for does not also pay the kept Second Wind.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `durationMillis` | `3000` | How long each regeneration lasts, in milliseconds. |
| `amplifierAtFirstLevel` | `0` | Regeneration amplifier at the first level; 0 is Regeneration I. |
| `amplifierAtTopLevel` | `1` | Regeneration amplifier at the top level. |
| `windMillis` | `15000` | How long bare-hand kills restore food after the boon, in milliseconds. |
| `foodAtFirstLevel` | `2` | Food points a bare-hand kill restores at the first level. |
| `foodAtTopLevel` | `4` | Food points a bare-hand kill restores at the top level. |
| `saturation` | `1.5` | Saturation a bare-hand kill restores. |

### Unarmed Fuel (`block-unarmed-fuel`)

Costs 1 point of hunger.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `hunger` | `1` | Hunger points taken per use. |

### Unarmed State (`block-unarmed-state`)

Holds while both your hands are empty and you hit, or were hit by, a living thing in the last 6 seconds. Convergences that ask whether you "landed a bare-hand hit" in the last 4 seconds hold only when you landed a melee hit with an empty main hand within those 4 seconds.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `combatMillis` | `6000` | How long after hitting or being hit you count as in combat, in milliseconds. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Unarmed](/adapt/33-skill-unarmed).
