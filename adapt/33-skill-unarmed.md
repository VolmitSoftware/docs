---
title: "Skill - Unarmed"
description: "Unarmed XP sources, adaptations, controls, and configuration"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Unarmed gains XP from attacks made without a melee tool in the main hand. Axes, pickaxes, hoes, shovels, swords, tridents, spears, and maces disable the skill; other items still count. Some adaptations also require an empty off hand.

Its 12 adaptations add punch damage, sprint charges, combos, disarms, slowing, shockwaves, block breaking, grappling, recovery, and meditation. Glass Cannon and Meditation also reward fighting without armor.

## How you earn Unarmed XP

Every hit you land with a non-melee main hand counts. The skill adds 1 to `unarmed.hits` and the raw damage to `unarmed.damage`. Then it pays `damageXPMultiplier` times that damage, subject to a `cooldownDelay` cooldown between payouts.

Two extra counters track style. A hit landed while falling (fall distance above zero and not on the ground) adds to `unarmed.critical`. Any hit above 6 damage adds to `unarmed.heavy`. Killing anything while not holding a melee tool adds to `unarmed.kills`. Killing a boss that way plays a small celebration.

Nothing is credited when the victim is already dead or invulnerable, or when you are invulnerable.

## Adaptations

All of this needs the adaptation learned to level 1 or higher from the Adapt menu (`/adapt`), the skill and the adaptation enabled in config, the `adapt.use` permission, and protection and region policy that allow the action.

"Bare hands" means neither hand holds a melee tool. Blocks and other junk items are fine.

### Sucker Punch (`unarmed-sucker-punch`)

5 levels · 4 knowledge, then 2 per level

A sprinting punch with an empty main hand multiplies your damage. Killing a full-health target in one such punch counts toward a knockout milestone, complete with a flash and a shockwave ring.

How to use it:

1. Empty your main hand completely. Any item at all disables it.
2. Sprint.
3. Punch.

Menu lore: "Damage", "Requires an empty main hand while sprinting".

Stats and milestones: `unarmed.sucker-punch.sucker-punches` at 500 (reward 400). `unarmed.sucker-punch.one-punch-kills` at 50 (reward 1000), credited when the killing blow's final damage was at least the victim's max health.

XP is hardcoded: 6.221 times the resulting damage per punch, plus 0.42 times the damage again when the punch exceeds 5. The main hand must be `AIR` exactly.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `baseDamage` | `0.2` | Fraction added to your damage at level percent 0, applied as a multiplier of 1 plus this value. |
| `damageFactor` | `0.55` | Extra fraction at full level percent. |

### Unarmed Power (`unarmed-power`)

7 levels · 6 knowledge, then 3 per level

A flat percentage boost to your attack damage while neither hand holds a tool. The bonus is a timed attribute modifier that is reapplied whenever your hands change, so it comes and goes as you swap items. Nothing to press.

Menu lore: "Damage".

Stats and milestones: `unarmed.power.unarmed-kills` at 500 (reward 400) and 5000 (reward 1500).

The bonus is an attack-damage `MULTIPLY_SCALAR_1` modifier of level percent times `damageFactor`. XP per hit is hardcoded at 0.321 times level percent times damage.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `damageFactor` | `2.57` | Attack-damage multiplier reached at full level percent. |

### Glass Cannon (`unarmed-glass-cannon`)

7 levels · 6 knowledge, then 3 per level

Punching hurts far more when you are naked. With zero armor equipped your damage is multiplied several times over. Wearing armor scales that bonus down toward nothing. The result never drops
below your normal damage. It is purely upside with a large reward for going
without.

Menu lore: "x Damage at 0 armor", "PerLevel Bonus Damage".

Stats and milestones: `unarmed.glass-cannon.naked-kills` at 100 (reward 300) and 500 (reward 1000).

Armor value here is Adapt's own fraction, summed across the four slots. A
leather helmet is 0.04. An iron helmet is 0.08. A diamond helmet is 0.12. With zero armor the damage becomes `damage x (maxDamageFactor + level x maxDamagePerLevelMultiplier)` plus the flat bonus. With any armor it becomes `damage - (damage x armor)` plus the flat bonus. Both branches take the higher of the result and your original damage, so this never reduces a hit.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `perLevelBonusMultiplier` | `0.25` | Flat health points of bonus damage per learned level, added in both branches. |
| `maxDamageFactor` | `4.0` | Damage multiplier at zero armor before the per-level term. |
| `maxDamagePerLevelMultiplier` | `0.15` | Extra zero-armor multiplier per learned level. |

### Battering Charge (`unarmed-battering-charge`)

5 levels · 4 knowledge

Sprint into something and the hit lands as an impact: extra damage plus a shove in the direction you are looking. A shield in either hand works as well as bare fists. While the charge is primed you leave a small dust trail so you can see it is ready.

How to use it:

1. Have both hands empty, or hold a shield in either hand.
2. Sprint, and keep actually moving. Standing still while the sprint flag is on does not count.
3. Hit something.

Using a shield puts the cooldown on the shield itself as a visible item cooldown. With fists it is an internal cooldown instead. Riding anything disables the charge.

Menu lore: "Impact Damage Bonus", "Impact Knockback", "Charge Cooldown".

Stats and milestones: `unarmed.battering-charge.charges` at 300 (reward 400). `unarmed.battering-charge.charge-kills` at 100 (reward 1000).

The movement sample must be under 750 ms old to count, which is why standing still with the sprint flag on does nothing.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `damageBase` | `0.5` | Flat health points added to the impact at level percent 0. |
| `damageFactor` | `4.2` | Extra flat damage at full level percent. |
| `knockbackBase` | `0.5` | Velocity added to the target along your look direction at level percent 0. |
| `knockbackFactor` | `1.2` | Extra knockback velocity at full level percent. |
| `cooldownTicksBase` | `80` | Ticks between charges at level percent 0. |
| `cooldownTicksFactor` | `50` | Ticks removed at full level percent, floored at 10. |
| `minimumVelocitySquared` | `0.05` | Squared horizontal blocks per tick you must actually be moving. Sprinting is roughly 0.08. |
| `xpPerDamage` | `3.3` | Unarmed XP per point of the resulting hit damage. |
| `primedTrailIntervalMillis` | `120` | Milliseconds between dust puffs while the charge is primed. |

### Combo Chain (`unarmed-combo-chain`)

6 levels · 4 knowledge, then 3 per level

Consecutive punches stack up, and each stack adds damage to the next hit. Stacks reset if you go too long between hits, and swinging at nothing after the grace window drops the whole chain with a low note. Bigger chains have their own advancements at 10 and 25 stacks.

Menu lore: "Max Combo Stacks", "Damage Per Stack", "Combo Window".

Stats and milestones: `unarmed.combo-chain.total-combo-hits` at 5000 (reward 400). One-off advancements `challenge_unarmed_combo_10` and `challenge_unarmed_combo_25` at 10 and 25 stacks.

Only the main hand is checked here. Dropping a combo below 3 stacks plays no effect.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `maxStacksBase` | `2` | Stack ceiling at level percent 0. |
| `maxStacksFactor` | `8` | Extra stack ceiling at full level percent. |
| `damagePerStackBase` | `0.2` | Flat health points of bonus damage per stack at level percent 0. |
| `damagePerStackFactor` | `0.85` | Extra damage per stack at full level percent. |
| `comboWindowMillisBase` | `1300` | Milliseconds allowed between hits at level percent 0. |
| `comboWindowMillisFactor` | `1400` | Extra window milliseconds at full level percent, floored at 250. |
| `missResetGraceMillis` | `280` | Milliseconds after a hit during which a whiffed swing does not break the chain. |
| `xpPerBonusDamage` | `4.1` | Unarmed XP per point of combo bonus damage dealt. |

### Disarm (`unarmed-disarm`)

5 levels · 5 knowledge, then 4 per level

Bare-hand hits can knock a target's held item to the ground. It takes the main-hand item, or an off-hand shield if the main hand is empty. Mobs can also lose one worn armor piece on the same disarm. The dropped item gets a pickup delay so the victim cannot instantly snatch it
back. Each target has its own cooldown to stop chain-disarming. Skeletal servants are never disarmed.

Menu lore: "Disarm Chance", "Per-Target Cooldown", "chance a disarmed mob also drops a worn armor piece".

Stats and milestones: `unarmed.disarm.disarms` at 100 (reward 400) and 1000 (reward 1500).

Players never lose armor.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `allowDisarmPlayers` | `true` | False limits disarms to mobs. |
| `mobArmorDropChance` | `0.5` | Chance a successful disarm on a mob also knocks off one worn armor piece, 0-1. |
| `chanceBase` | `0.04` | Disarm chance per hit at level percent 0, 0-1. |
| `chanceFactor` | `0.18` | Extra chance at full level percent, capped at 1. |
| `pickupDelayTicks` | `60` | Ticks before anyone can pick the knocked item back up. |
| `targetCooldownMillis` | `8000` | Milliseconds before the same target can be disarmed again. |
| `xpPerDisarm` | `28` | Unarmed XP per successful disarm. |

### Pressure Point (`unarmed-pressure-point`)

5 levels · 4 knowledge, then 3 per level

Bare-hand hits apply Slowness that stacks up one amplifier at a time toward a level-based cap. Past a certain level, Weakness stacks on the same way. Good for softening something you cannot outrun.

Menu lore: "Max Slowness Stacks", "Max Weakness Stacks", and "Weakness unlocks at higher levels" while it is still locked.

Stats and milestones: `unarmed.pressure-point.pressure-strikes` at 500 (reward 400) and 5000 (reward 1500).

Each hit raises the existing amplifier by one, up to the cap, and refreshes the duration.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `maxSlownessAmplifierBase` | `0` | Highest Slowness amplifier at level percent 0. |
| `maxSlownessAmplifierFactor` | `2` | Extra amplifier headroom at full level percent. |
| `slownessDurationTicks` | `60` | Ticks of Slowness applied per strike. |
| `weaknessUnlockPercent` | `0.6` | Level percent at which Weakness starts being applied too. |
| `maxWeaknessAmplifier` | `1` | Highest Weakness amplifier once unlocked. |
| `weaknessDurationTicks` | `50` | Ticks of Weakness applied per strike. |
| `xpPerStrike` | `3.1` | Unarmed XP per strike. |

### Shockwave Clap (`unarmed-shockwave-clap`)

5 levels · 6 knowledge, then 5 per level

Clap your hands and everything in a cone in front of you gets thrown backward and upward. No damage, just displacement, which makes it an escape tool and a way to break up a pile of mobs.

How to use it:

1. Keep both hands free of tools.
2. Sneak.
3. Left-click the air or a block.

Each clap costs hunger and fails with a dull cue if you are on cooldown or too hungry. Your own pets are never thrown.

Menu lore: "Shockwave Range", "Knockback Force", "Clap Cooldown", "Hunger Cost".

Stats and milestones: `unarmed.shockwave-clap.mobs-clapped` at 250 (reward 400) and 2500 (reward 1500). Every activation also increments `unarmed.shockwave-clap.claps`, which has no milestone.

Hunger is spent on activation, before targets are resolved.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `rangeBase` | `3.5` | Cone reach in blocks at level percent 0. |
| `rangeFactor` | `3` | Extra reach in blocks at full level percent. |
| `forceBase` | `0.8` | Outward velocity applied to each target at level percent 0. |
| `forceFactor` | `1.2` | Extra outward velocity at full level percent. |
| `upwardForceBase` | `0.25` | Upward velocity component at level percent 0. |
| `upwardForceFactor` | `0.2` | Extra upward velocity at full level percent. |
| `coneDotThreshold` | `0.45` | Dot product against your look direction a target must exceed. Lower widens the cone. |
| `cooldownMillisBase` | `10000` | Milliseconds between claps at level percent 0. |
| `cooldownMillisFactor` | `6000` | Milliseconds removed at full level percent, floored at 1000. |
| `hungerCost` | `2` | Food points spent per clap. The clap fails if you have less. |
| `xpPerTargetHit` | `14` | Unarmed XP per target actually knocked back. |
| `maxCandidatesPerActivation` | `16` | Nearby living entities inspected per clap, hard-capped at 32. |
| `maxAffectedPerActivation` | `12` | Targets knocked back per clap, hard-capped at 16 and by the candidate limit. |
| `maxTargetFxPerActivation` | `8` | Knocked-back targets that get their own cloud particles, hard-capped at 12. |

### Iron Fists (`unarmed-iron-fists`)

5 levels · 4 knowledge, then 3 per level

You deal flat extra damage on every bare-hand hit. Punching soft blocks such as
dirt, sand, leaves, or anything under the hardness threshold gives you a short
mining-speed buff. Nothing to activate.

Menu lore: "Flat Punch Damage", "Soft Block Punch Haste".

Stats and milestones: `unarmed.iron-fists.iron-hits` at 1000 (reward 400) and 10000 (reward 1500).

The mining buff is a block-break-speed modifier of 0.2 x (amplifier + 1), not a Haste potion effect.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `damageBase` | `0.5` | Flat health points added per hit at level percent 0. |
| `damageFactor` | `2.5` | Extra flat damage at full level percent. |
| `softBlockMaxHardness` | `0.8` | Highest block hardness that still counts as soft. |
| `hasteDurationTicks` | `25` | Ticks the mining buff lasts after each punch. 0 disables it. |
| `hasteAmplifierFactor` | `2` | Amplifier reached at full level percent. |
| `xpPerHit` | `2.4` | Unarmed XP per bare-hand hit. |

### Grapple (`unarmed-grapple`)

5 levels · 6 knowledge, then 5 per level

Grab something with a sneak-punch, then throw it where you are looking. Works on players too, subject to PVP policy, but bosses cannot be grabbed.

How to use it:

1. Keep both hands free of tools.
2. Sneak and punch a target. A line of particles connects you to it.
3. Punch again, or release sneak, to hurl it.

The grab expires on its own after a few seconds. Each throw adds exhaustion, so grappling a crowd will make you hungry, and the target must still be within throwing range when the hurl resolves.

Menu lore: "Hurl Force", "Grapple Cooldown", "Hit again or release sneak to hurl", "Exhaustion per Throw".

Stats and milestones: `unarmed.grapple.hurled-mobs` at 100 (reward 400) and 1000 (reward 1500).

The cooldown is marked on the hurl, not the grab, and you get one hurl per second.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `forceBase` | `0.9` | Throw velocity along your look direction at level percent 0. |
| `forceFactor` | `1.4` | Extra throw velocity at full level percent. |
| `upwardBoost` | `0.2` | Upward velocity component at level percent 0. |
| `upwardBoostFactor` | `0.25` | Extra upward component at full level percent. |
| `maxHurlRange` | `6` | Blocks the target may be from you when the hurl resolves, or it is cancelled. |
| `grabTimeoutMillis` | `5000` | Milliseconds an unused grab stays held. |
| `cooldownMillisBase` | `9000` | Milliseconds between grapples at level percent 0. |
| `cooldownMillisFactor` | `5000` | Milliseconds removed at full level percent, floored at 1000. |
| `exhaustionPerThrow` | `2.0` | Exhaustion added to you per throw. 0 disables the cost. |
| `xpPerHurl` | `32` | Unarmed XP per throw. |

### Second Wind (`unarmed-second-wind`)

5 levels · 4 knowledge, then 3 per level

Killing a non-player mob with a direct bare-hand hit gives back some hunger and saturation and starts a short regeneration burst. It has its own cooldown so a fast kill chain does not turn into infinite food.

Menu lore: "Hunger Restored", "Regeneration Duration".

Stats and milestones: `unarmed.second-wind.second-winds` at 100 (reward 400) and 1000 (reward 1500).

Friendly targets, including your own pets, are skipped. Food is clamped to 20 and saturation to your current food level.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `foodRestoreBase` | `1` | Food points restored per kill at level percent 0. |
| `foodRestoreFactor` | `4` | Extra food points at full level percent. |
| `saturationRestore` | `1.5` | Saturation restored per kill. |
| `regenDurationTicksBase` | `40` | Ticks of Regeneration at level percent 0. |
| `regenDurationTicksFactor` | `80` | Extra ticks at full level percent, floored at 20. |
| `regenAmplifier` | `0` | Amplifier of the Regeneration burst. |
| `cooldownMillis` | `3000` | Milliseconds between triggers. |
| `xpPerSecondWind` | `18` | Unarmed XP per trigger. |

### Meditation (`unarmed-meditation`)

5 levels · 5 knowledge, then 4 per level

Sit still and build absorption hearts. It is slow, but it stacks up to a real buffer over a minute or two of downtime.
It pairs well with Glass Cannon since absorption is not armor.

How to use it:

1. Empty both hands completely.
2. Stay out of combat for the lockout window.
3. Sneak and stand still. Absorption ticks up once per second until you hit the cap.

Moving, unsneaking, picking anything up, or taking or dealing a hit ends the session immediately.

Menu lore: "Max Absorption", "Absorption Per Pulse", "Combat Lockout".

Stats and milestones: `unarmed.meditation.absorption-gained` at 500 (reward 400) and 5000 (reward 1500).

Both hands must be completely empty, not merely free of tools. XP from pulses is silent, so there is no XP popup.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `absorptionCapBase` | `2` | Absorption health points you can hold at level percent 0. |
| `absorptionCapFactor` | `10` | Extra absorption cap at full level percent. |
| `gainPerPulse` | `0.5` | Absorption health points gained each second while meditating. |
| `combatLockoutMillis` | `8000` | Milliseconds after any combat before meditation can resume. |
| `stationaryEpsilonSquared` | `0.01` | Squared blocks of drift per pulse still treated as standing still. |
| `xpPerPulse` | `1.2` | Silent Unarmed XP per pulse. |

## Reference

### Skill configuration defaults

Written to `plugins/Adapt/skills/unarmed.toml` on first load.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `enabled` | `true` | Turns the whole Unarmed skill on or off. |
| `skillColor` | `"&e"` | Legacy ampersand color code used for Unarmed in menus and text. |
| `damageXPMultiplier` | `4.5` | Skill XP per point of damage you deal without a melee tool. |
| `cooldownDelay` | `1250` | Milliseconds between XP awards for unarmed damage. |
| `challengeUnarmedReward` | `500` | Knowledge paid by the hit-count challenges. |
| `challengeUnarmedDmgReward` | `500` | Knowledge paid by the damage challenges. |
| `challengeUnarmedKillsReward` | `750` | Knowledge paid by the kill challenges. |
| `challengeUnarmedCritReward` | `750` | Knowledge paid by the falling-hit challenges. |
| `challengeUnarmedHeavyReward` | `750` | Knowledge paid by the heavy-hit challenges. |

### Challenges

| Challenge | Threshold | Reward knob |
|---|---|---|
| `challenge_unarmed_100` | 100 | `challengeUnarmedReward` |
| `challenge_unarmed_1k` | 1000 | `challengeUnarmedReward` x 2 |
| `challenge_unarmed_10k` | 10000 | `challengeUnarmedReward` x 5 |
| `challenge_unarmed_dmg_1k` | 1000 | `challengeUnarmedDmgReward` |
| `challenge_unarmed_dmg_10k` | 10000 | `challengeUnarmedDmgReward` x 3 |
| `challenge_unarmed_kills_25` | 25 | `challengeUnarmedKillsReward` |
| `challenge_unarmed_kills_250` | 250 | `challengeUnarmedKillsReward` x 3 |
| `challenge_unarmed_crit_25` | 25 | `challengeUnarmedCritReward` |
| `challenge_unarmed_crit_250` | 250 | `challengeUnarmedCritReward` x 3 |
| `challenge_unarmed_heavy_25` | 25 | `challengeUnarmedHeavyReward` |
| `challenge_unarmed_heavy_250` | 250 | `challengeUnarmedHeavyReward` x 3 |

Each adaptation has its own file at `plugins/Adapt/adaptations/<id>.toml`. Alongside the keys listed above it carries `enabled`, `permanent`, `showParticles`, `showSounds`, and its learn costs (`maxLevel`, `initialCost`, `baseCost`, `costFactor`). Every file is generated with a comment on each key and values are clamped on load.

## See also

- [02 - Concepts](/adapt/02-concepts) for levels, knowledge, and how adaptations are learned.
- [03 - Player Usage](/adapt/03-player-usage) for the Adapt menu and general play.
- [10 - Skills Catalog](/adapt/10-skills-catalog) for the full skill list.
- [04 - Commands & Permissions](/adapt/04-commands-permissions) for the `adapt.use` nodes.
