---
title: "Upgrades - Unarmed"
description: "Unarmed upgraded adaptations for mutated skills"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These upgrades are available only after you [mutate](/adapt/35-mutations) Unarmed, and they replace the original [Unarmed](/adapt/33-skill-unarmed) adaptations they fuse. A bare-hand hit is one made with no axe, pickaxe, hoe, shovel, sword, trident, spear or mace in either hand.

## Upgrades

### Titan Fists (`upgraded-unarmed-titan-fists`)

3 levels · 13, 13 and 16 knowledge · Fuses Unarmed Power, Iron Fists, Glass Cannon, Sucker Punch and Battering Charge

A bare-hand hit takes all three originals at their top levels, in their order: the damage is multiplied by 3.57 (Unarmed Power), then Glass Cannon's rule applies, then Iron Fists adds 3. With no armor worn Glass Cannon multiplies by 5.05 and adds 1.75; with armor worn the damage is cut by your armor value instead, but never drops below what it was. The total is then raised by 10%, 20% and 30% at levels 1, 2 and 3, so a full-strength naked punch deals about 25.1, 27.3 and 29.6, against about 22.8 from the three maxed originals.

A bare-hand hit while sprinting is a sprint punch, once every 6, 5 and 4 seconds at levels 1, 2 and 3, for 1 hunger. It shoves the target away with a force of 1.4, breaks up to 3 soft blocks (hardness 0.8 or lower) at its feet and head height in the 3 blocks behind it, and knocks a raised shield down for 5 seconds. The breaks are real breaks that drop as usual and need permission to break there; blocks a player placed are never broken. With no food the sprint punch does not happen.

With an empty main hand, blocks with hardness 0.8 or lower break on the first hit, where you are allowed to interact.

Personal controls: Unarmed damage bonus (on/off); Faster soft block breaking (on/off).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `powerMultiplier` | `3.57` | Attack damage multiplier of Unarmed Power at its top level. |
| `nakedFactor` | `5.05` | Glass Cannon's no-armor damage multiplier at its top level. |
| `flatBonus` | `1.75` | Glass Cannon's flat damage at its top level. |
| `ironBonus` | `3.0` | Iron Fists' flat damage at its top level. |
| `bonusPerLevel` | `0.1` | Share of damage added on top of the maxed originals per level. |
| `softBlockMaxHardness` | `0.8` | Hardest block that still breaks instantly by hand. |
| `sprintCooldownMillisBase` | `7000` | Sprint punch cooldown in milliseconds before level scaling. Never below 1000. |
| `sprintCooldownMillisPerLevel` | `1000` | Milliseconds of sprint punch cooldown removed per level. |
| `sprintHunger` | `1` | Hunger points a sprint punch costs. 0 removes the cost. |
| `sprintKnockback` | `1.4` | Push of a sprint punch. |
| `sprintBlocksBroken` | `3` | Most soft blocks a sprint punch breaks behind the target. |
| `sprintReach` | `3` | How far behind the target, in blocks, a sprint punch looks for soft blocks. |
| `shieldLockTicks` | `100` | Ticks a raised shield stays down after a sprint punch. |
| `xpPerHit` | `3` | Skill XP for each punch on a natural target. |
| `xpPerSoftBlock` | `0.5` | Skill XP for each natural soft block broken by hand. |

### Unbroken Combo (`upgraded-unarmed-unbroken-combo`)

3 levels · 13, 13 and 16 knowledge · Fuses Combo Chain, Pressure Point and Disarm

Each hit with no tool or weapon in the main hand adds a combo stack and deals bonus damage equal to the stacks times 0.55, 0.7 and 0.85 at levels 1, 2 and 3. Combos hold up to 6, 8 and 10 stacks and last 2.6, 3 and 3.4 seconds after your last hit. Taking damage restarts that window instead of breaking the combo. A swing that misses more than 280 ms after your last hit, or a hit with a tool or weapon, drops the combo.

Every combo hit also raises the target's Slowness by one level for 3 seconds. Slowness never exceeds one level below your current stack count, and tops out at Slowness II, III and IV.

A sneaking bare-hand hit at full stacks is a finisher, once every 8 seconds. It spends every stack and deals bonus damage equal to the stacks spent times 0.8, 1.1 and 1.4 at levels 1, 2 and 3, gives the target Weakness I, II and II for 5 seconds, and disarms it. A finisher never also grabs for Seismic Throw. A mob drops what it holds in its main hand, or a shield from its off hand, unless it came from a spawner, egg, breeding or another farm, when the item is only taken. A player never drops anything: the item moves to a free slot of their own inventory, or swaps with the next hotbar slot when the inventory is full.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `maxStacksBase` | `4` | Most combo stacks before level scaling. |
| `maxStacksPerLevel` | `2` | Most combo stacks added per level. |
| `damagePerStackBase` | `0.4` | Bonus damage per stack before level scaling. |
| `damagePerStackPerLevel` | `0.15` | Bonus damage per stack added per level. |
| `comboWindowMillisBase` | `2200` | Milliseconds a combo lasts without a hit, before level scaling. Being hit restarts it. |
| `comboWindowMillisPerLevel` | `400` | Combo window in milliseconds added per level. |
| `missResetGraceMillis` | `280` | Milliseconds after the last hit before a missed swing drops the combo. |
| `maxSlownessAmplifierBase` | `0` | Highest Slowness amplifier before the level is added. |
| `slownessDurationTicks` | `60` | Slowness duration in ticks per hit. |
| `xpPerBonusDamage` | `4` | Skill XP per point of bonus damage to a natural target. |
| `finisherDamagePerStackBase` | `0.5` | Finisher damage per stack spent before level scaling. |
| `finisherDamagePerStackPerLevel` | `0.3` | Finisher damage per stack spent added per level. |
| `finisherWeaknessMaxAmplifier` | `1` | Highest Weakness amplifier a finisher applies; 0 is Weakness I. |
| `finisherWeaknessTicks` | `100` | Weakness duration in ticks after a finisher. |
| `finisherCooldownMillis` | `8000` | Milliseconds between finishers. |
| `disarmPickupDelayTicks` | `60` | Ticks before a mob can pick its dropped item up again. |

### Seismic Throw (`upgraded-unarmed-seismic-throw`)

3 levels · 13, 13 and 16 knowledge · Fuses Grapple and Shockwave Clap

Sneak and land a bare-hand hit to grab the target. Bosses cannot be grabbed. The grab holds for 5 seconds; your next bare-hand hit, or letting go of sneak, hurls the target the way you face with a force of 1.6, 1.9 and 2.2 at levels 1, 2 and 3 and an upward boost of 0.6. The target must still be within 6 blocks. Each throw costs 2 exhaustion and starts a cooldown of 7.5, 6 and 4.5 seconds.

When the thrown target lands, a shockwave pushes up to 12 other living entities within 3.75, 4.5 and 5.25 blocks away from it with a force of 1, 1.2 and 1.4 and a small upward lift, and deals 3.5, 5 and 6.5 damage to each of them. Its damage counts as a hit from you, so it follows the same PvP and protection rules as your own attacks, but no upgrade treats it as a punch. The shockwave never hurts or moves you or the thrown target. A landing is only caught within 3 seconds of the throw.

Personal controls: Eligible targets (All permitted targets/Hostile mobs/Non-player targets); Release grabbed target (Release sneak or punch again/Punch again only).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `forceBase` | `1.3` | Hurl force before level scaling. |
| `forcePerLevel` | `0.3` | Hurl force added per level. |
| `upwardBoost` | `0.6` | Upward part of the hurl. |
| `maxHurlRange` | `6` | Farthest in blocks a grabbed target can be from you when hurled. |
| `grabTimeoutMillis` | `5000` | Milliseconds before an unused grab expires. |
| `cooldownMillisBase` | `9000` | Throw cooldown in milliseconds before level scaling. Never below 1000. |
| `cooldownMillisPerLevel` | `1500` | Milliseconds of cooldown removed per level. |
| `exhaustionPerThrow` | `2.0` | Exhaustion added per throw. 0 removes the cost. |
| `maxFlightTicks` | `60` | Longest in ticks a thrown target is watched for its landing. |
| `waveRangeBase` | `3.0` | Shockwave radius in blocks before level scaling. |
| `waveRangePerLevel` | `0.75` | Shockwave radius in blocks added per level. |
| `waveForceBase` | `0.8` | Shockwave knockback before level scaling. |
| `waveForcePerLevel` | `0.2` | Shockwave knockback added per level. |
| `waveUpwardForce` | `0.35` | Upward part of the shockwave knockback. |
| `waveDamageBase` | `2` | Shockwave damage before level scaling. |
| `waveDamagePerLevel` | `1.5` | Shockwave damage added per level. |
| `maxCandidatesPerActivation` | `16` | Most nearby living entities one shockwave checks. Clamped to 32. |
| `maxAffectedPerActivation` | `12` | Most targets one shockwave pushes. Clamped to 16. |
| `maxTargetFxPerActivation` | `8` | Most pushed targets that show their own cloud effect. Clamped to 12. |
| `xpPerTargetHit` | `10` | Skill XP for each natural target the shockwave pushes. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Unarmed](/adapt/33-skill-unarmed).
