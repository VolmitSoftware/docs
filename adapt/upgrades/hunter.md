---
title: "Upgrades - Hunter"
description: "Hunter upgraded adaptations for mutated skills"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These upgrades are available only after you merge Hunter into a mutated skill ([Mutations](/adapt/35-mutations)), and they replace the original [Hunter](/adapt/22-skill-hunter) adaptations.

## Upgrades

### Blood Frenzy (`upgraded-hunter-blood-frenzy`)

3 levels · 13, 13 and 16 knowledge · Fuses Adrenaline, Hunter's Strength, Hunter's Speed and Hunter's Regen

Taking damage grants three buffs at once: extra attack damage, a speed burst, and Regeneration. It fires on the same damage causes as the original Hunter struck buffs. At full health the attack damage bonus is 6, 9 or 12 points at levels 1, 2 and 3 and lasts 2, 4 or 6 seconds; the speed burst lasts 3, 6 or 9 seconds and grows stronger with level; Regeneration has an amplifier equal to the level and lasts 2, 4 or 6 seconds.

The lower your health, the stronger and longer the frenzy. Near death the damage bonus and every duration are multiplied by up to 1.75, 2.0 or 2.25 at levels 1, 2 and 3, scaling evenly with missing health. A buff that is already running is not refreshed: the damage bonus skips while you have Strength or a previous bonus, and Regeneration skips while you are already regenerating.

Each frenzy that grants at least one buff costs one Hunger effect with amplifier 10 minus the level, lasting 2.5 seconds per level. Nothing fires while you already have Hunger if the main Adapt config sets `preventHunterSkillsWhenHungerApplied`. Struck with an empty food bar, you get Poison with amplifier 6 minus the level for 2.5 seconds and no buffs.

Personal controls: Minimum hunger to activate (No extra reserve/At least 5 hunger/At least 10 hunger/At least 15 hunger).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `strengthTicksPerLevel` | `40` | Damage bonus duration per level at full health, in ticks. |
| `speedTicksPerLevel` | `60` | Speed burst duration per level at full health, in ticks. |
| `regenTicksPerLevel` | `40` | Regeneration duration per level at full health, in ticks. |
| `lowHealthBoostBase` | `0.5` | Extra multiplier on the damage bonus and every duration near death, before level scaling. |
| `lowHealthBoostPerLevel` | `0.25` | Near-death multiplier added per level. |
| `hungerAmplifierBase` | `10` | Hunger amplifier before the level is subtracted. |
| `hungerDurationTicks` | `50` | Hunger duration per level for each frenzy, in ticks. |
| `poisonAmplifierBase` | `6` | Poison amplifier before the level is subtracted, applied when struck with no food left. |
| `poisonDurationTicks` | `50` | Poison duration when struck with no food left, in ticks. |
| `baseHorizontalSpeed` | `0.13` | Base horizontal speed of the burst before amplifier scaling. |
| `maxHorizontalSpeed` | `0.32` | Highest horizontal speed the burst can force. |
| `accelPerTick` | `0.045` | How fast the burst accelerates toward its target speed each tick. |
| `brakePerTick` | `0.08` | How fast burst velocity decays once you stop pressing movement keys. |
| `stopThreshold` | `0.01` | Horizontal velocity treated as fully stopped. |
| `hardStopOnInvalidState` | `true` | Clears burst velocity when you start flying, swimming, riding or similar. |
| `fallbackInputVelocityThreshold` | `0.0008` | Movement threshold used on servers that cannot read movement keys. |

### Apex Predator (`upgraded-hunter-apex-predator`)

3 levels · 15, 14 and 18 knowledge · Fuses Predator Focus and Big Game Hunter

Consecutive melee hits on the same target build ramp stacks. The first hit sets one stack and adds nothing; each stack after it adds 8, 10 or 12 percent damage at levels 1, 2 and 3, up to a cap of 6, 8 or 10 stacks. At the cap that is +40, +70 or +108 percent damage. Ravagers, iron golems, wardens, withers, ender dragons, elder guardians and any boss mob gain 2 stacks per hit. Hitting a different target, or going 3.5 seconds without a hit, resets the ramp to one stack. Sword sweep hits on nearby mobs neither add stacks nor reset the ramp.

Killing one of those large mobs or a boss gives a 30, 50 or 70 percent chance at levels 1, 2 and 3 of one more roll of the mob's own loot table, added to its drops. Each mob rolls at most once. Spawner, egg, bred and other farmed mobs, golems built by players and withers summoned by players never roll.

Apex Predator also unlocks the Tracker's Compass, crafted from a compass, a leather and a bone. Right-click a creature with it, or right-click while you can see one of your Stalker's Trail blood trails, to track that kind; each time costs 1 hunger. Sneak and right-click to pick a kind from the ones this compass has killed, and right-click the air to switch between remembered kinds. While you hold it, the compass shows the direction and distance of the nearest living one of that kind within 64, 128 or 192 blocks and 48 blocks up or down and draws a short line toward it. It remembers 1, 3 or 6 kinds. It searches loaded chunks only and never tracks players. Bosses and named mobs are skipped until level 3, where the compass also tracks the last 4 bosses and named mobs you hit. For anyone without Apex Predator the compass does nothing.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `perStackBonusBase` | `0.06` | Bonus damage per stack before level scaling. |
| `perStackBonusPerLevel` | `0.02` | Bonus damage per stack added per level. |
| `rampCapBase` | `4` | Stack cap before level scaling. |
| `rampCapPerLevel` | `2` | Stack cap added per level. |
| `bigGameStacksPerHit` | `2` | Stacks gained per hit on large and boss mobs. |
| `decayMillis` | `3500` | Milliseconds without a hit before the ramp resets. |
| `xpPerRampedHit` | `2` | Silent Hunter XP for each hit on a natural mob or a player that gained bonus damage. |
| `extraRollChanceBase` | `0.1` | Chance of one more roll of a large or boss mob's own drops before level scaling. |
| `extraRollChancePerLevel` | `0.2` | Extra roll chance added per level. |
| `compassRangePerLevel` | `64` | Tracker's Compass range per level, in blocks. |
| `kindsRememberedByLevel` | `[1, 3, 6]` | Kinds one Tracker's Compass remembers, from level 1 upward. |
| `quarryLevel` | `3` | Level from which the compass tracks bosses and named mobs you have hit. |
| `maxQuarries` | `4` | Bosses and named mobs remembered per player for the compass. |
| `maxKilledKinds` | `18` | Killed kinds a compass offers in its menu. |
| `setHungerCost` | `1` | Hunger points paid each time the compass is set to a kind. |

### Stalker's Trail (`upgraded-hunter-stalkers-trail`)

3 levels · 13, 13 and 16 knowledge · Fuses Blood Trail, Snare Line and Trophy Skinner

A melee hit that leaves a mob at or below half its maximum health starts a private blood trail along its path. The trail lasts 15, 20 or 25 seconds at levels 1, 2 and 3 and stays visible while you are within 40, 48 or 56 blocks of the mob.

Right-clicking the top of a block with a Hunter's Snare places a snare there, up to 4 at a time, each lasting 2 minutes. Snare Line's snare recipe stays craftable while you hold this upgrade. A monster within 1.6 blocks of a snare is rooted for 4.5, 6 or 7.5 seconds, and each snare catches 5, 6 or 7 monsters before it is used up.

An animal or neutral mob that walks into a snare is caught alive and the snare is used up. It is held in place for 30, 60 or 120 seconds at levels 1, 2 and 3. Come within 6 blocks and it is tied to you with a lead, so you can lead it home. The lead slips if you get more than 12 blocks apart, if the game breaks it, if the creature ends up where you may not hunt or interact, or when you log out. You can hold or lead 4 creatures at once. Villagers, wandering traders, bosses, hostiles, tamed animals and animals already on a lead are never caught, and nothing is caught where you may not interact. The lead costs no item and never drops one, and no creature is ever made.

A precise kill rolls for trophies. A kill is precise when you were sneaking, or when your own projectile killed from at least 12, 10 or 8 blocks away. A precise kill drops the mob's trophy material with a 40, 50 or 60 percent chance, 3, 4 or 5 items at a time (one more for a projectile kill, at most 8), and its head with a 7, 10 or 13 percent chance. Materials and heads follow the same mob list as Trophy Skinner. Spawner, bred and other farmed mobs drop no trophies or heads.

Personal controls: Private blood trail (on/off); Blood trail color (Blood red/White/Cyan/Gold); Require sneaking (on/off), which applies to placing snares.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `woundHealthFraction` | `0.5` | Share of maximum health a target must fall to or below to leave a trail. |
| `trailDurationTicksBase` | `200` | Trail duration before level scaling, in ticks. |
| `trailDurationTicksPerLevel` | `100` | Trail duration added per level, in ticks. |
| `trackingRangeBase` | `32` | Distance a trail stays visible before level scaling, in blocks. |
| `trackingRangePerLevel` | `8` | Tracking distance added per level, in blocks. |
| `maxTrackedWounds` | `64` | Most trails tracked at once on the server. |
| `trailThickness` | `0.06` | Width of each trail segment. |
| `displayDurationTicks` | `30` | How long each trail segment stays, in ticks. |
| `xpPerWound` | `3` | Silent Hunter XP when a new natural mob or player starts bleeding. |
| `rootDurationTicksBase` | `60` | Snare root duration before level scaling, in ticks. |
| `rootDurationTicksPerLevel` | `30` | Snare root duration added per level, in ticks. |
| `chargesBase` | `4` | Monsters one snare catches before level scaling. |
| `chargesPerLevel` | `1` | Snare catches added per level. |
| `triggerRadius` | `1.6` | Distance from a snare that sets it off, in blocks. |
| `rootAmplifier` | `6` | Slowness-equivalent strength of the root; each step removes 15 percent speed, up to a full stop. |
| `rearmBufferMillis` | `500` | Milliseconds a rooted mob cannot set off the same snare again after its root ends. |
| `snareLifetimeTicks` | `2400` | How long a placed snare lasts, in ticks. |
| `maxSnaresPerPlayer` | `4` | Most snares one player can keep placed. |
| `maxActiveSnares` | `64` | Most snares placed with this upgrade on the server. |
| `maxTargetsPerScan` | `8` | Most mobs one snare roots per scan. |
| `xpPerSnare` | `6` | Hunter XP for each natural mob snared. |
| `trophyChanceBase` | `0.3` | Trophy chance on a precise kill before level scaling. |
| `trophyChancePerLevel` | `0.1` | Trophy chance added per level. |
| `headChanceBase` | `0.04` | Head chance on a precise kill before level scaling. |
| `headChancePerLevel` | `0.03` | Head chance added per level. |
| `trophyAmountBase` | `2` | Trophy items per drop before level scaling. |
| `trophyAmountPerLevel` | `1` | Trophy items added per level. |
| `minimumRangeBase` | `14` | Shortest projectile-kill distance that counts as precise before level scaling, in blocks. |
| `minimumRangePerLevel` | `2` | Precise-kill distance removed per level, in blocks; never below 4. |
| `xpPerTrophy` | `16` | Hunter XP for each trophy drop from a natural mob. |
| `captureHoldTicksBase` | `600` | How long a snare holds a caught animal at level 1, in ticks; it doubles each level. |
| `leadRange` | `6` | Distance at which a caught animal is tied to you with a lead, in blocks. |
| `leadBreakRange` | `12` | Distance at which a led animal slips its lead, in blocks. |
| `maxCaptivesPerPlayer` | `4` | Most caught animals one player can hold or lead at once. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Hunter](/adapt/22-skill-hunter).
