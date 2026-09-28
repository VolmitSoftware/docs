---
title: "Skill - TragOul"
description: "TragOul XP sources, adaptations, controls, and configuration"
published: true
date: 2026-09-28T18:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
TragOul gains XP from taking damage and awards extra XP for surviving at low health. Its 14 adaptations add reflected damage, healing, corpse attacks, skeleton servants, armor fueled by bones, debuffs, and lethal-hit protection; some abilities cost health, maximum health, or items, and `takeAwaySkillsOnDeath` removes TragOul XP and one level from each TragOul adaptation on death.

## How you earn TragOul XP

When an entity damages you, the skill adds 1 to `trag.hitsrecieved` and the raw damage to `trag.damage`, then pays `damageReceivedXpMultiplier` times that damage. XP awards wait on `cooldownDelay`; those two stat counters still increment during the cooldown.

A survived hit that leaves you at 4 hearts or less also pays `lowHealthSurvivalXP`.

Nothing is credited if you are already dead, invulnerable, or blocking with a shield.

If Adapt's global hardcore reset is on, death wipes all skill data. Otherwise, when `takeAwaySkillsOnDeath` is on, death removes up to `deathXpLoss` TragOul XP, never below zero, and drops every learned TragOul adaptation by one level.

## Adaptations

### Thorns (`tragoul-thorns`)

5 levels · 4 knowledge

A hit, including a projectile, reflects `damageMultiplierPerLevel` times the learned level back to the attacker or the shooter, at most once per 1.5 seconds. With `ignore passiveMobs`, passive and neutral mobs stay excluded when provoked, including reflections from skeletal servants, while hostile mobs and players still follow normal combat protection.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `damageMultiplierPerLevel` | `1.75` | Health points reflected per learned level. |
| `ignorePassiveMobs` | `false` | Exclude passive and neutral mobs from reflected damage. |

### Globe of Pain (`tragoul-globe`)

5 levels · 4 knowledge

A melee hit is split as `originalDamage / (sharedTargets + 1)` plus the per-level bonus across the struck mob and nearby valid mobs, then armor and resistance apply per mob. Share radius caps at 24 blocks and shared targets cap at 8.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `cooldown` | `1` | Seconds between activations for one player, floored at 0.5 seconds. |
| `rangePerLevel` | `3.0` | Blocks of share radius added per learned level. |
| `initalRange` | `5.0` | Base share radius in blocks. The misspelling is the real key name. |
| `bonusDamagePerLevel` | `1` | Health points of extra damage per learned level, added to every share. |
| `ignorePassiveMobs` | `false` | Exclude passive and neutral mobs from secondary shared damage, even when provoked. |

### Will of Pain (`tragoul-healing`)

5 levels · 4 knowledge

A living attacker that damages you loses a fixed amount of health, and you are healed for what it actually lost, capped by your missing health. Your skeletal servants cannot be drained.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `drainDamageStart` | `0.5` | Health points drained from each attacker at level 1. |
| `drainDamageEnd` | `2.0` | Health points drained at max level. Levels in between interpolate. |

### Corpse Lances (`tragoul-lance`)

5 levels · 4 knowledge

A kill launches a lance from the corpse at the nearest valid target other than you, dealing the killing blow's final damage times `seekerDamageMultiplier`, and also times `unarmoredDamageMultiplier` when you wear no armor, on a 5 second player cooldown with only one chain at a time. Search radius is `min(32, 5 + 4 x level)`, chain length is `min(6, level)` with each hop at half the previous damage, each connecting lance costs you mitigated health, and when `ignore passiveMobs` is on a nearer protected mob does not block a farther eligible target; direct attacks and player targeting stay unchanged.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `seekerDelay` | `12` | Ticks between launch and impact, clamped to 1 - 40. |
| `seekerDamageMultiplier` | `1.0` | Multiplier on the killing blow's damage, clamped to 0 - 4. |
| `selfDamageAtFirstLevel` | `6.0` | Health points you take per connecting lance at level 1. |
| `selfDamageAtMaxLevel` | `2.0` | Health points you take at max level. Never higher than the level-1 value. |
| `unarmoredDamageMultiplier` | `3.0` | Extra multiplier while no armor is equipped, clamped to 1 - 10. |
| `ignorePassiveMobs` | `false` | Exclude passive and neutral mobs from seeking lances and chain hits. |

### Blood Pact (`tragoul-blood-pact`)

5 levels · 4 knowledge

A hit at or above the damage trigger can grant a random set of Speed, Regeneration, Resistance, Fire Resistance, Absorption, Jump Boost, and Night Vision; Speed and Jump Boost are hidden attributes with no icon, and milk does not remove them. Absorption lasts 20 ticks less, floored at 40, and amplifiers step to 1 at level percent 0.85 for Absorption, Resistance, and Regeneration and at 0.7 for the rest.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `minDamageTriggerHearts` | `2.0` | Hearts of final damage required to roll a proc. Doubled internally into health points. |
| `procChanceBase` | `0.12` | Proc chance at level percent 0, 0-1. |
| `procChanceFactor` | `0.38` | Extra proc chance at full level percent. |
| `maxProcChance` | `0.5` | Ceiling on the proc chance, 0-1. |
| `procCooldownMillisBase` | `18000` | Milliseconds between procs at level percent 0. |
| `procCooldownMillisFactor` | `12000` | Milliseconds removed at full level percent, floored at 500 ms. |
| `effectDurationTicksBase` | `100` | Buff duration in ticks at level percent 0. |
| `effectDurationTicksFactor` | `150` | Extra duration in ticks at full level percent, floored at 40 ticks. |
| `buffCountBase` | `1` | Buffs granted at level percent 0. |
| `buffCountFactor` | `2` | Extra buffs at full level percent. One more is added when the hit was 1.6x the trigger threshold. |
| `bonusBuffChanceBase` | `0.08` | Chance of one extra buff at level percent 0, 0-1. |
| `bonusBuffChanceFactor` | `0.34` | Extra chance at full level percent, capped at 0.9. |
| `xpPerProc` | `24` | TragOul XP per proc. |

### Bone Harvest (`tragoul-bone-harvest`)

5 levels · 4 knowledge

A kill can drop an owner-locked globe, chosen at random, tagged `adapt:tragoul-globe`: `MAGMA_CREAM` for blood or `SNOWBALL` for bone. Walk over it to collect; hoppers cannot take it.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `globeChanceBase` | `0.16` | Chance per kill of a globe at level percent 0, 0-1. |
| `globeChanceFactor` | `0.42` | Extra chance at full level percent. |
| `maxGlobeChance` | `0.7` | Ceiling on the globe chance, 0-1. |
| `globeLifetimeTicksBase` | `120` | Ticks a globe survives at level percent 0. |
| `globeLifetimeTicksFactor` | `220` | Extra ticks at full level percent, floored at 20 ticks. |
| `bloodBuffTicks` | `80` | Regeneration duration in ticks from a blood globe. |
| `bloodBuffAmplifier` | `1` | Regeneration amplifier from a blood globe. |
| `boneBuffTicks` | `100` | Duration in ticks of every buff from a bone globe. |
| `boneBuffAmplifier` | `0` | Amplifier of bone globe buffs. Absorption gets one more at level percent 0.75 and up. |
| `boneBuffCountBase` | `1` | Buffs from a bone globe at level percent 0. |
| `boneBuffCountFactor` | `2` | Extra buffs at full level percent, drawn from the same seven-effect pool as Blood Pact. |
| `xpPerGlobeSpawned` | `8` | TragOul XP paid when a globe spawns. |

### Corpse Explosion (`tragoul-corpse-explosion`)

5 levels · 4 knowledge

Every mob you or a servant kills damages nearby hostile mobs for a flat amount plus a share of the dead mob's max health. Radius caps at 16 blocks, each victim is stamped `adapt:tragoul_nova_stamp`, and neutrals stay excluded when provoked if `ignore passiveMobs` is true.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `ignorePassiveMobs` | `false` | Exclude neutral enemy species from corpse novas, including servant-triggered novas. Passive animals are always excluded. |
| `radiusBase` | `3.0` | Nova radius in blocks at level percent 0. |
| `radiusFactor` | `3.5` | Extra radius in blocks at full level percent. |
| `baseDamage` | `3.0` | Flat health points of nova damage to every hostile mob hit. |
| `victimHealthFractionBase` | `0.10` | Share of the dead mob's max health added to nova damage at level percent 0. |
| `victimHealthFractionFactor` | `0.40` | Extra share at full level percent. |
| `maxDamage` | `24.0` | Ceiling on nova damage per mob, in health points. |
| `maxTargets` | `12` | Hostile mobs damaged per nova, hard-capped at 16. |
| `chainSuppressionMillis` | `5000` | Milliseconds a nova-damaged mob is barred from starting its own nova. |
| `xpPerMobHit` | `6` | TragOul XP per mob the nova actually damaged. |

### Soul Siphon (`tragoul-soul-siphon`)

5 levels · 4 knowledge

Damage you are credited for heals you, including melee, arrows, TNT you lit, lingering clouds you threw, and evoker fangs. The heal is the smallest of the damage share, the remaining per-second cap, and your missing health, and damage past the victim's remaining health plus absorption does not count.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `healPercentBase` | `0.05` | Share of the final damage returned as health at level percent 0, 0-1. |
| `healPercentFactor` | `0.32` | Extra share at full level percent. |
| `healCapPerSecondBase` | `2.0` | Health points per second you may heal at level percent 0. |
| `healCapPerSecondFactor` | `6.5` | Extra per-second cap at full level percent, floored at 0.5. |
| `xpPerHeal` | `3` | TragOul XP per siphon heal. |

### Skeletal Servant (`tragoul-skeletal-servant`)

5 levels · 5 knowledge

Sneak-right-click air or a block with bones in the main hand to raise a skeleton at your feet that takes your current mark; item-use protection blocks the summon, and block-use protection blocks it on that block. Servants are tagged `adapt:tragoul_servant_owner`, do not burn in daylight, drop nothing, cannot damage you, inherit your other TragOul effects, including siphon, curse, and plague, and wear leather, chainmail, iron, or diamond plus a sword or bow, and creative mode skips the bone cost.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `boneCostBase` | `8` | Bones per summon at level percent 0. |
| `boneCostReduction` | `5` | Bones removed from that cost at full level percent, floored at 1. |
| `durationTicksBase` | `400` | Servant lifetime in ticks at level percent 0. |
| `durationTicksFactor` | `800` | Extra lifetime ticks at full level percent, floored at 100. |
| `cooldownMillisBase` | `10000` | Milliseconds between summons at level percent 0. |
| `cooldownMillisFactor` | `9000` | Milliseconds removed at full level percent, floored at 1000. |
| `servantCapPerLevel` | `1.0` | Living servants allowed per learned level, hard-capped at 16 per owner. |
| `replaceOldestAtCap` | `true` | True recycles your oldest servant when summoning at the cap. False refuses the summon. |
| `playerThreatWindowMillis` | `5000` | Milliseconds the last thing you hit or that hit you stays the pack's mark. |
| `gearChancePerPiece` | `0.55` | Chance per armor slot that a new servant spawns wearing something, 0-1. |
| `enchantChanceBase` | `0.0` | Chance an equipped piece is enchanted at level percent 0, 0-1. |
| `enchantChanceFactor` | `0.45` | Extra enchant chance at full level percent. |
| `bowChance` | `0.3` | Chance a servant spawns with a bow instead of a sword, 0-1. |
| `healthBonusPerLevel` | `3.0` | Health points of max health added to a servant per learned level. |
| `attackBonusPerLevel` | `1.0` | Health points of attack damage added to a servant per learned level. |
| `retargetIntervalTicks` | `20` | Ticks between retarget pulses, floored at 10. |
| `targetSearchRadius` | `12` | Blocks a servant scans for hostile mobs, capped at 24. |
| `xpPerSummon` | `30` | TragOul XP per summon. |
| `healthCostEnabled` | `true` | True applies the owner max-health upkeep while servants live. |
| `healthCostPerMinion` | `2.0` | Health points removed from your max health per living servant. |
| `minimumOwnerMaxHealth` | `4.0` | Lowest max health the upkeep can push you to. |

### Marrow Armor (`tragoul-marrow-armor`)

5 levels · 4 knowledge

A hit at or above the trigger consumes one bone from your inventory and removes a share of that hit. With no bones, nothing is absorbed.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `minDamageToTrigger` | `2.0` | Health points of final damage required before a bone is spent. |
| `absorbPercentBase` | `0.20` | Share of the hit removed at level percent 0, 0-1. |
| `absorbPercentFactor` | `0.30` | Extra share at full level percent. |
| `maxAbsorbPercent` | `0.6` | Ceiling on the absorbed share, 0-1. |
| `internalCooldownMillisBase` | `4000` | Milliseconds between absorbs at level percent 0. |
| `internalCooldownMillisFactor` | `2000` | Milliseconds removed at full level percent, floored at 500. |
| `xpPerAbsorb` | `8` | TragOul XP per absorbed hit. |

### Curse of Frailty (`tragoul-curse-of-frailty`)

5 levels · 4 knowledge

An attacker gains Weakness, and Slowness once it is unlocked; the Weakness amplifier steps to 1 at level percent 0.8. Your pets, marker armor stands, invulnerable entities, NPCs, and skeletal servants are never cursed.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `curseDurationTicksBase` | `60` | Curse duration in ticks at level percent 0. |
| `curseDurationTicksFactor` | `100` | Extra duration in ticks at full level percent, floored at 40. |
| `slownessUnlockPercent` | `0.6` | Level percent at which Slowness is added to the curse. |
| `slownessAmplifier` | `0` | Amplifier of the Slowness component, clamped to 0 - 4. |
| `perAttackerCooldownMillis` | `4000` | Milliseconds before the same attacker can be cursed again, floored at 250. |
| `xpPerCurse` | `5` | TragOul XP per curse applied. |

### Death Sense (`tragoul-death-sense`)

5 levels · 3 knowledge

Wounded damageable entities and players inside the radius glow through walls for you only. Color follows remaining health: dark red at 0.25 and below, red at 0.5, gold at 0.75, and yellow above that.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `radiusBase` | `8` | Sense radius in blocks at level percent 0. |
| `radiusFactor` | `8` | Extra radius in blocks at full level percent. |
| `maxRadius` | `32` | Ceiling on the sense radius, itself capped at 32 blocks. |
| `healthThresholdStart` | `0.5` | Health fraction at or below which a target is sensed, at level 1. |
| `healthThresholdEnd` | `0.9` | Same threshold at max level. |
| `maxOwnersPerTick` | `24` | Learned owners refreshed per scheduler tick, hard-capped at 24. |
| `maxTargetInspectionsPerTick` | `48` | Tracked targets inspected per scheduler tick, hard-capped at 48. |
| `maxMarksPerTick` | `12` | Per-owner glows refreshed per scheduler tick, hard-capped at 12. |

### Plague Bearer (`tragoul-plague-bearer`)

5 levels · 4 knowledge

Poison or Wither you applied, including a splash plus your own hit, jumps to nearby mobs when the mob dies with the effect still on it, and Wither is used if both are present. Marks are `adapt:tragoul_plague_owner`, `adapt:tragoul_plague_generation`, and `adapt:tragoul_plague_stamp`; radius caps at 24 blocks, and neutrals stay excluded when provoked if `ignore passiveMobs` is true.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `ignorePassiveMobs` | `false` | Exclude passive and neutral mobs from poison and wither spread; directly applied effects are unchanged. |
| `spreadRadiusStart` | `8` | Spread radius in blocks at level 1. |
| `spreadRadiusEnd` | `20` | Spread radius in blocks at max level. |
| `spreadDurationTicksBase` | `80` | Effect duration in ticks on infected mobs at level percent 0. |
| `spreadDurationTicksFactor` | `120` | Extra duration in ticks at full level percent, floored at 40. |
| `maxGenerations` | `3` | How many times one affliction may re-spread, hard-capped at 4. |
| `maxSpreadTargets` | `6` | Mobs infected per death, hard-capped at 8. |
| `amplifierBonus` | `1` | Amplifier levels added when the affliction jumps. |
| `afflictionFreshnessMillis` | `15000` | Milliseconds a mark stays valid, clamped to 1000 - 60000. |
| `xpPerInfection` | `6` | TragOul XP per infected mob. |

### Last Rites (`tragoul-last-rites`)

5 levels · 6 knowledge

A hit that would kill you is refused: you are set to 1 HP and gain Invisibility plus Resistance, and hostile mobs in range that were targeting you lose that target.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `spiritDurationTicks` | `60` | Ticks of Invisibility and Resistance after death is refused. |
| `resistanceAmplifier` | `3` | Amplifier of the Resistance effect during the spirit state. |
| `targetClearRadius` | `12` | Blocks searched for mobs targeting you, whose target is cleared. |
| `cooldownMillisBase` | `600000` | Milliseconds between saves at level percent 0. |
| `cooldownMillisFactor` | `300000` | Milliseconds removed at full level percent, floored at 30000. |
| `xpPerSave` | `120` | TragOul XP per death defied. |

## Reference

### Skill configuration defaults

Written to `plugins/Adapt/skills/tragoul.toml` on first load.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `deathXpLoss` | `250` | TragOul XP removed on death when `takeAwaySkillsOnDeath` is true, clamped so XP never goes below zero. |
| `takeAwaySkillsOnDeath` | `false` | True makes death cost TragOul XP and drop every learned TragOul adaptation by one level. |
| `enabled` | `true` | Turns the whole TragOul skill on or off. |
| `skillColor` | `"&b"` | Legacy ampersand color code used for TragOul in menus and text. |
| `showParticles` | `true` | Emits the skill's own damage and death particle effects. Sounds still play. |
| `cooldownDelay` | `450` | Milliseconds between XP awards for taking damage. |
| `damageReceivedXpMultiplier` | `4.8` | Skill XP per point of damage you take. |
| `lowHealthSurvivalXP` | `28` | Extra skill XP when a survived hit leaves you at 8 health (4 hearts) or less. |
| `challengeTragReward` | `500` | Knowledge paid by the TragOul challenges. |

### Challenges

| Challenge | Threshold | Reward knob |
|---|---|---|
| `challenge_trag_1k` | 1000 | `challengeTragReward` |
| `challenge_trag_10k` | 10000 | `challengeTragReward` x 2 |
| `challenge_trag_100k` | 100000 | `challengeTragReward` x 5 |
| `challenge_trag_hits_500` | 500 | `challengeTragReward` |
| `challenge_trag_hits_5k` | 5000 | `challengeTragReward` x 2 |

## See also

Catalog: [Skills](/adapt/10-skills-catalog). Rules: [Concepts](/adapt/02-concepts).
