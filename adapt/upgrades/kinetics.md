---
title: "Upgrades - Kinetics"
description: "Kinetics upgraded adaptations for mutated skills"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These upgrades are available only after you merge Kinetics into a mutated skill ([Mutations](/adapt/35-mutations)), and they replace the original [Kinetics](/adapt/23-skill-kinetics) adaptations. Comet needs the mace and is unavailable on Minecraft 1.20.1. Lancer uses spears on Minecraft 26.1 and later and the trident on 1.21.1, where spears do not exist.

## Upgrades

### Comet (`upgraded-kinetics-comet`)

3 levels · 13, 13 and 16 knowledge · Fuses Meteor Cadence, Windburst and Breachwright

Holding sneak while falling with a mace in your main hand starts a dive that lasts until you release sneak or touch the ground. During a dive your gravity rises by 65, 80 or 95 percent at levels 1, 2 and 3, half your air drag is removed, and you gain 0.4, 0.5 or 0.6 blocks per tick of downward speed each tick, up to 4 blocks per tick. The dive needs the gravity attribute and does nothing on server versions without it.

A mace smash that lands strips 5, 7 or 9 armor and 2, 3 or 4 armor toughness from the target for 5.5, 7 or 8.5 seconds. The same target can be stripped by a direct smash at most once every 2 seconds. If you fell at least 2.5 blocks, the smash also releases a shockwave that throws up to 16 living entities within 5.5, 7 or 8.5 blocks with knockback force 0.9, 1.1 or 1.3, deals 4, 6 or 8 damage to each of them, and strips their armor the same way. Each natural mob or player it hits pays 4 skill XP. Its damage counts as a hit from you, so it follows the same PvP and protection rules as your own attacks. The shockwave recharges in 3 seconds.

Mass Shift form: sneak and swap hands while standing on the ground. Looking up takes Titan form, looking down takes Pocket form, and looking level returns you to normal size. Titan form makes you 15, 20 or 25 percent larger at levels 1, 2 and 3, adds 1, 1.5 or 2 blocks to the shockwave radius, and raises the shockwave's damage and knockback by the same 15, 20 or 25 percent. It also raises your step height by 1 block and pulls the camera back 2 blocks. Pocket form makes you 15, 20 or 25 percent smaller, strengthens the dive's gravity and downward pull by that share, and removes 30, 40 or 50 percent of fall damage. Each switch costs 2 hunger, and you can switch once every 10 seconds; the form is kept through logouts and deaths until you switch again. A Comet form replaces any Mass Shift form you already have. Size changes need the scale attribute and do nothing without it.

Personal controls: Dive control (While sneaking/Every eligible fall); Hostile targets only (on/off), which limits the shockwave.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `radiusBase` | `4.0` | Shockwave radius before level scaling, in blocks. |
| `radiusPerLevel` | `1.5` | Shockwave radius added per level, in blocks. |
| `forceBase` | `0.7` | Shockwave knockback force before level scaling. |
| `forcePerLevel` | `0.2` | Shockwave knockback force added per level. |
| `waveDamageBase` | `2` | Shockwave damage before level scaling. |
| `waveDamagePerLevel` | `2` | Shockwave damage added per level. |
| `minFallDistance` | `2.5` | Fall distance in blocks a smash needs to release the shockwave. |
| `waveCooldownMillis` | `3000` | Time between two shockwaves, in milliseconds. |
| `armorShredBase` | `3` | Armor points removed before level scaling. |
| `armorShredPerLevel` | `2` | Armor points removed per level. |
| `toughnessShredBase` | `1` | Armor toughness removed before level scaling. |
| `toughnessShredPerLevel` | `1` | Armor toughness removed per level. |
| `shredTicksBase` | `80` | Armor removal duration before level scaling, in ticks. |
| `shredTicksPerLevel` | `30` | Armor removal duration added per level, in ticks. |
| `targetCooldownMillis` | `2000` | Time before a direct smash can strip the same target again, in milliseconds. |
| `gravityBoostBase` | `0.5` | Gravity multiplier bonus while diving before level scaling. |
| `gravityBoostPerLevel` | `0.15` | Gravity multiplier bonus added per level. |
| `dragCut` | `0.5` | Share of air drag removed while diving. |
| `downwardAccelerationBase` | `0.3` | Downward speed added each tick while diving, before level scaling. |
| `downwardAccelerationPerLevel` | `0.1` | Downward speed per tick added per level. |
| `terminalFallSpeed` | `4.0` | Fastest fall speed the dive can reach, in blocks per tick. |
| `xpPerTargetHit` | `4` | Skill XP for each natural mob or player a shockwave hits. |
| `formSizeBase` | `0.10` | Size change of Titan and Pocket form before level scaling, as a share. |
| `formSizePerLevel` | `0.05` | Size change of the forms added per level. |
| `titanRadiusBase` | `0.5` | Extra shockwave radius in Titan form before level scaling, in blocks. |
| `titanRadiusPerLevel` | `0.5` | Extra Titan shockwave radius added per level, in blocks. |
| `pocketLandingCutPerSize` | `2.0` | Share of fall damage removed in Pocket form for each point of size change. |
| `formSwitchHunger` | `2` | Hunger points a form switch costs. |
| `formSwitchCooldownMillis` | `10000` | Time between two form switches, in milliseconds. |

### Lancer (`upgraded-kinetics-lancer`)

3 levels · 13, 13 and 16 knowledge · Fuses Charge Lance, Phalanx Reach and Impale Pin

While you hold a spear in your main hand (a trident on Minecraft 1.21.1), your entity reach grows by 1.5, 2 or 2.5 blocks at levels 1, 2 and 3. It returns to normal when the weapon leaves your hand. Thrown tridents do not count.

A melee spear hit gains bonus damage from your horizontal speed when you move at least 0.12 blocks per tick and are not riding. The bonus is your speed in blocks per tick times 1.6, 2.0 or 2.4, capped at +100, +125 or +150 percent. Every spear hit also pins the target with Slowness II at levels 1 and 2 and Slowness III at level 3, for 2.25, 3 or 3.75 seconds. The same target can be pinned at most once every 2.5 seconds.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `reachBase` | `1.0` | Extra reach in blocks while holding a spear, before level scaling. |
| `reachPerLevel` | `0.5` | Extra reach in blocks added per level. |
| `minSpeed` | `0.12` | Horizontal speed in blocks per tick a hit needs before speed adds damage. |
| `speedDamageFactorBase` | `1.2` | Bonus damage share per block per tick of speed, before level scaling. |
| `speedDamageFactorPerLevel` | `0.4` | Bonus damage share per block per tick added per level. |
| `bonusCapBase` | `0.75` | Largest speed bonus before level scaling, as a share of the hit. |
| `bonusCapPerLevel` | `0.25` | Largest speed bonus added per level. |
| `pinTicksBase` | `30` | Pin duration before level scaling, in ticks. |
| `pinTicksPerLevel` | `15` | Pin duration added per level, in ticks. |
| `pinTierBase` | `0` | Pin Slowness amplifier before level scaling. |
| `pinTierPerLevel` | `0.7` | Pin Slowness amplifier added per level, rounded. |
| `pinCooldownMillis` | `2500` | Time before the same target can be pinned again, in milliseconds. |

### Featherweight (`upgraded-kinetics-featherweight`)

3 levels · 13, 13 and 16 knowledge · Fuses Moon Jump, Rubber Soul and Soft Catch

Every jump rises 1, 1.5 or 2 blocks higher at levels 1, 2 and 3, and for 1.5 seconds after each jump your gravity is reduced by 30, 40 or 50 percent for a floaty peak. You also gain 0.35, 0.45 or 0.55 bounciness at all times. Landing on slime, honey or a bed adds another 0.65, 0.8 or 0.95 bounciness for 2 seconds.

Fall damage is cancelled on any block at every level.

Jumps need the jump strength and gravity attributes, and the bounce needs the bounciness attribute. On a server version without one of them, that part does nothing; fall protection works everywhere.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `extraJumpHeightBase` | `0.5` | Blocks added to every jump before level scaling. |
| `extraJumpHeightPerLevel` | `0.5` | Blocks added to every jump per level. |
| `hopBonus` | `0.08` | Jump strength added to each jump on top of the height bonus. |
| `gravityReductionBase` | `0.2` | Share of gravity removed after a jump before level scaling. |
| `gravityReductionPerLevel` | `0.1` | Share of gravity removed per level; the total stops at 0.9. |
| `floatWindowTicks` | `30` | How long the reduced gravity lasts after each jump, in ticks. |
| `bouncinessBase` | `0.25` | Constant bounciness before level scaling. |
| `bouncinessPerLevel` | `0.1` | Constant bounciness added per level. |
| `springloadBonusBase` | `0.5` | Extra bounciness after landing on a bouncy block, before level scaling. |
| `springloadBonusPerLevel` | `0.15` | Extra bouncy-block bounciness added per level. |
| `springloadTicks` | `40` | How long the bouncy-block bonus lasts, in ticks. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Kinetics](/adapt/23-skill-kinetics).
