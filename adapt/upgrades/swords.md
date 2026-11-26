---
title: "Upgrades - Swords"
description: "Swords upgraded adaptations for mutated skills"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These upgrades are available only after you [mutate](/adapt/35-mutations) Swords, and they replace the original [Swords](/adapt/30-skill-swords) adaptations they fuse. Each one needs a sword in the main hand.

## Upgrades

### Witherblade (`upgraded-swords-witherblade`)

3 levels · 13, 13 and 16 knowledge · Fuses Poisoned Blade and Bloody Blade

A sword hit on an eligible target applies Wither, starts a bleed and stops the target from regaining health from any source until the effect ends. The effect lasts 3, 4 and 5 seconds at levels 1, 2 and 3. Wither is level I at levels 1 and 2 and level II at level 3. The bleed deals 0.5, 0.75 and 1 magic damage every 5 ticks for the same duration, ignores armor, never hits your own tamed pets, and stops if the target becomes protected or you lose the upgrade. The cooldown between applications is 3.5, 2.5 and 1.5 seconds.

Overcharge: when the bleed starts and you can pay the other mutated skill's Fuel, it is spent and the Wither and no-healing duration grow by half (`overchargeStrength` in `[mutations]`).

Personal controls: Eligible targets (All permitted/Hostile mobs/Non-player targets), Overcharge (On/Off).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `durationMillisBase` | `2000` | Wither, bleed and no-healing duration in milliseconds before level scaling. |
| `durationMillisPerLevel` | `1000` | Milliseconds of duration added per level. |
| `bleedDamageBase` | `0.5` | Bleed damage per pulse at level 1. |
| `bleedDamagePerLevel` | `0.25` | Bleed damage per pulse added for each level after the first. |
| `witherAmplifierAtMaxLevel` | `1` | Wither amplifier at the top level. Lower levels use amplifier 0. |
| `cooldownMillisBase` | `4500` | Cooldown in milliseconds before level scaling. |
| `cooldownMillisPerLevel` | `1000` | Milliseconds of cooldown removed per level. |
| `minimumCooldownMillis` | `1500` | Shortest cooldown in milliseconds at any level. |

### Tempest Flow (`upgraded-swords-tempest-flow`)

3 levels · 15, 14 and 18 knowledge · Fuses Blade Flow and Crimson Cyclone

Each sword hit adds a flow stack and gives 10% attack speed per stack. Stacks cap at 3, 4 and 5 at levels 1, 2 and 3, and the flow lapses 4.5 seconds after your last hit. Taking any damage ends the flow at once.

A critical hit while the flow is full releases a crimson slash, at most once every 6 seconds. The struck target takes 3.5, 5 and 6.5 extra damage, and every other eligible living entity within 3.5, 4 and 4.5 blocks of it takes the same amount. The slash also makes every target it hits bleed for 0.6 damage every 5 ticks for 5 seconds. Releasing the slash does not spend the stacks. One slash hits at most 12 targets and never hits your own tamed pets.

From level 2 you can craft a Whetstone from a flint, an iron ingot and a stick. The shape picks the grind: flint, iron and stick in a column makes Serrated; iron, flint and stick in a column makes Weighted; the three in a row makes Keen. Hold the whetstone and put a sword in your off hand, then use it: the whetstone is used up, the sword loses 10 durability and carries the grind for 10 minutes of combat. Each hit spends the time since your previous hit, at most 5 seconds. One grind at a time; a new one replaces the old.

- Serrated: every hit starts a bleed of 0.5, 0.7 and 0.9 damage every 5 ticks for 3 seconds at Witherblade levels 1, 2 and 3 (level 1 without Witherblade). A target bleeds from one grind at a time.
- Weighted: a hit staggers the target and locks a player's shield for 1.5, 2 and 2.5 seconds at Tempest Flow levels 1, 2 and 3, at most once every 3 seconds per target.
- Keen: critical hits deal 20%, 30% and 40% more at Duelist's Verdict levels 1, 2 and 3 (level 1 without it).

A ground sword does nothing for anyone without Tempest Flow at level 2. Grinding is refused and grinds do nothing while Whetstone Ritual's sharpness is running.

Personal controls: Ignore passive mobs (on/off); Bleed particles (on/off).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `stackCapBase` | `2` | Stacks needed for a full flow, before the level is added. |
| `windowMillis` | `4500` | Milliseconds a stack lasts without a new hit. |
| `slashDamageBase` | `2.0` | Slash damage before level scaling. |
| `slashDamagePerLevel` | `1.5` | Slash damage added per level. |
| `slashRadiusBase` | `3.0` | Slash radius in blocks before level scaling. |
| `slashRadiusPerLevel` | `0.5` | Slash radius in blocks added per level. |
| `slashCooldownMillis` | `6000` | Milliseconds between two slashes. |
| `bleedDamagePerProc` | `0.6` | Bleed damage per pulse on every target the slash hits. |
| `bleedTicks` | `100` | Bleed duration in ticks on every target the slash hits. |
| `ignorePassiveMobs` | `false` | Leaves passive and neutral mobs out of the slash and its bleed, so they do not use up the target limits. |
| `maxCandidatesPerActivation` | `16` | Most nearby living entities one slash checks. Clamped to 32. |
| `maxAffectedPerActivation` | `12` | Most targets one slash hits, the struck target included. Clamped to 16. |
| `maxTargetFxPerActivation` | `9` | Most hit targets that show their own spark effect. Clamped to 12. |
| `xpPerStack` | `3` | Skill XP for each stack built on a natural mob or a player. |
| `xpPerTargetHit` | `10` | Skill XP for each natural mob or player the slash hits. |
| `whetstoneDurabilityCost` | `10` | Sword durability one grind costs. |
| `whetstoneCombatMillis` | `600000` | Combat time one grind lasts, in milliseconds. |
| `whetstoneMillisPerHit` | `5000` | Most combat time one hit spends from a grind, in milliseconds. |
| `serratedBleedBase` | `0.3` | Serrated bleed damage per pulse before Witherblade level scaling. |
| `serratedBleedPerLevel` | `0.2` | Serrated bleed damage per pulse added per Witherblade level. |
| `serratedBleedMillis` | `3000` | How long one Serrated bleed lasts, in milliseconds. |
| `weightedTicksBase` | `20` | Weighted stagger and shield lockout in ticks before Tempest Flow level scaling. |
| `weightedTicksPerLevel` | `10` | Weighted stagger and shield lockout in ticks added per Tempest Flow level. |
| `weightedSlownessAmplifier` | `0` | Slowness amplifier of the Weighted stagger; 0 is Slowness I. |
| `weightedCooldownMillis` | `3000` | Milliseconds before the same target can be staggered again. |
| `keenBonusBase` | `0.10` | Keen critical damage bonus before Duelist's Verdict level scaling. |
| `keenBonusPerLevel` | `0.10` | Keen critical damage bonus added per Duelist's Verdict level. |

### Duelist's Verdict (`upgraded-swords-duelists-verdict`)

3 levels · 13, 13 and 16 knowledge · Fuses Duelist's Focus and Executioner's Edge

You are in a duel when exactly one monster or other player is within 7 blocks of you. In a duel, your sword hits deal 25%, 35% and 45% more damage at levels 1, 2 and 3. A hit on a target at or under 30% of its maximum health adds a further 35%, 50% and 65%. While you hold a sword in a duel, damage you take from any entity is reduced by 17%, 24% and 31%, capped at 40%.

Name a sword at an anvil to awaken it for yourself. Only your newest awakened sword is awake; awakening another puts the old one to sleep until you rename it again, and a sword awakened by someone else starts over for you. Kills of natural mobs dealt by your own hand with the awake sword bank on it; players, spawner, egg, bred and other farmed mobs never count. Each kill adds 0.01 damage to its hits, capped at 1, 2 and 3 at levels 1, 2 and 3 (an heirloom bonus on the same sword counts toward the cap). Banked kills wake three techniques on that sword:

- 100 kills, Riposte: blocking a hit with a shield while holding the sword makes your next hit with it within 1.5 seconds a critical hit. While the original Riposte is active for you, that block arms the original instead, so one block never arms both.
- 300 kills, Lunge: swinging at a target 3 to 7 blocks away while sprinting lunges you toward it, once every 3 seconds.
- 800 kills, Verdict: a hit on a mob under 30% health ends it. Bosses and players are exempt.

To anyone without the upgrade the sword is an ordinary named sword.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `engageRadius` | `7` | Radius in blocks used to count monsters and players near you. |
| `bonusDamageBase` | `0.15` | Duel damage bonus before level scaling. |
| `bonusDamagePerLevel` | `0.10` | Duel damage bonus added per level. |
| `reductionBase` | `0.10` | Duel damage reduction before level scaling. |
| `reductionPerLevel` | `0.07` | Duel damage reduction added per level. |
| `maxReduction` | `0.40` | Highest duel damage reduction at any level. |
| `finishingThreshold` | `0.30` | Health fraction at or under which the finishing bonus applies. |
| `finishingBonusBase` | `0.20` | Finishing bonus before level scaling. |
| `finishingBonusPerLevel` | `0.15` | Finishing bonus added per level. |
| `xpPerFocusedHit` | `4` | Skill XP for each sword hit landed in a duel on a natural mob or a player. |
| `riposteKills` | `100` | Natural kills with the awakened sword that wake Riposte. |
| `lungeKills` | `300` | Natural kills with the awakened sword that wake Lunge. |
| `verdictKills` | `800` | Natural kills with the awakened sword that wake Verdict. |
| `bladeBonusPerKill` | `0.01` | Flat damage the awakened sword banks per natural kill. |
| `bladeBonusCapPerLevel` | `1.0` | Most flat damage the awakened sword can bank, per level. |
| `riposteWindowMillis` | `1500` | Milliseconds a shield block keeps the guaranteed critical ready. |
| `attackReach` | `3.0` | Your normal reach in blocks; Lunge fires only on targets beyond it. |
| `lungeBlocks` | `4.0` | Extra blocks Lunge closes past your reach. |
| `lungeSurgePerBlock` | `0.3` | Forward push per block of distance to the target. |
| `lungeStopShort` | `1.5` | Blocks short of the target the lunge aims to stop. |
| `lungeMaxSurge` | `1.6` | Hard cap on the lunge push. |
| `lungeVerticalBoost` | `0.2` | Upward hop added to the lunge. |
| `lungeCooldownMillis` | `3000` | Milliseconds between two lunges. |
| `verdictThreshold` | `0.30` | Health fraction under which a hit from the awakened sword ends a non-boss mob. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Swords](/adapt/30-skill-swords).
