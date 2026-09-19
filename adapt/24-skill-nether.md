---
title: "Skill - Nether"
description: "Nether XP sources, adaptations, controls, and configuration"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Nether gains XP from wither damage, damaging or killing the Wither, killing wither skeletons, and breaking wither roses. Many adaptations also award XP for their own actions.

Its 14 adaptations add fire, ghast, wither, and magma protection; lava and soul-sand movement; strider control; netherrack mining; piglin barter bonuses; Nether foods; wither loot; fire-based recovery; and thrown wither skulls.

## Adaptations

All of this needs the adaptation learned to level 1 or higher, the skill and the adaptation enabled in config, the `adapt.use.*` permission (or the matching per-adaptation node), and protection and region policy that allow the action.

Several of these only work while you are in a Nether-environment world. Those
are Lava Walker, Ghast Ward, Netherrack Mason, and the meal half of Crimson
Feast. The rest work anywhere. Soul Strider speeds you across soul sand in the overworld too.

### Wither Resistance (`nether-wither-resist`)

3 levels · 5 knowledge, then 3 per level

Each piece of netherite armor you are wearing gives you a chance to shrug off wither damage entirely. The chances add up across the four slots and grow with level. A full netherite
set at max level negates the wither effect every time.

Chance per netherite piece is `basePieceChance + chanceAddition * level`, summed over helmet, chestplate, leggings, and boots, then clamped to 100 percent. Full netherite at level 3 reaches 100 percent and plays an extra mastery effect.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `basePieceChance` | `10` | Percentage points contributed by each netherite piece before level scaling. |
| `chanceAddition` | `5` | Percentage points added per piece per adaptation level. |

### Wither Skull Throw (`nether-skull-toss`)

3 levels · 5 knowledge, then 10 per level

Wither skeleton skulls become ammunition. Right-click while holding one and you launch a real wither skull. It flies where
you are looking and explodes on impact, same as the boss fires. The skull is consumed (except in creative), and there is a cooldown that gets much shorter as you level. Landing a kill from 40 blocks or more unlocks a hidden challenge.

**How to use it**

1. Hold a wither skeleton skull in your main hand.
2. Right-click. Look where you want it to go first. The skull follows your aim.

Cooldown is `max(1, baseCooldown - levelCooldown * level)` seconds, so 10 seconds at level 1 and 1 second at level 3, shown as an item cooldown on the skull. The projectile is an uncharged, non-bouncing `WitherSkull`, and throwing it pays 100 Nether XP. The skull is never placed as a block.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `baseCooldown` | `15` | Seconds between throws at level 0. |
| `levelCooldown` | `5` | Seconds removed from the cooldown per adaptation level, floored at 1 second. |

### Fire Resistance (`nether-fire-resist`)

3 levels · 6 knowledge, then 4 per level

Every tick of fire damage has a chance to be cancelled outright. The chance climbs steeply with level, so a maxed version means you rarely notice standing in flames at all. It covers burning only, not lava.

Negation chance is `fireResistBase + fireResistFactor * level` using the raw
level, not a level percentage. It is 35 percent at level 1 and 85 percent at
level 3.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `fireResistBase` | `0.10` | Chance to cancel burn damage at level 0, 0 to 1. |
| `fireResistFactor` | `0.25` | Chance added per adaptation level, 0 to 1. |

### Lava Walker (`nether-lava-walker`)

5 levels · 4 knowledge

In the Nether, walking into lava pushes you forward across the surface instead of sinking. Each stride cancels your fall distance, puts out your fire, gives you a moment of fire resistance, and costs food. Higher levels stride farther, cost less food, and re-arm sooner. It does nothing if your food bar is empty, and it will not run while flying, gliding, or riding.

**How to use it**

1. Be in the Nether with food in your bar.
2. Walk into the lava, facing the direction you want to go. Keep looking where you want to end up. Each stride follows your view direction.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `strideBase` | `0.18` | Horizontal push per stride at level 0, in blocks per tick. |
| `strideFactor` | `0.6` | Extra push added across levels. |
| `hungerCostBase` | `3` | Food points removed per stride at level 0. |
| `hungerCostFactor` | `2` | Food points subtracted from that cost across levels, floored at 1. |
| `cooldownMillisBase` | `900` | Milliseconds between strides at level 0. |
| `cooldownMillisFactor` | `700` | Milliseconds removed from the gap across levels, floored at 100. |
| `fireResistTicks` | `80` | Fire Resistance duration granted per stride, in ticks. |
| `xpPerStride` | `3.5` | Nether XP per stride. |

### Ghast Ward (`nether-ghast-ward`)

6 levels · 4 knowledge

In the Nether, ghast fireballs hit you for much less, and getting hit by one also caps how long you burn afterward. Arrows from wither skeletons are cut down too, and so is any explosion damage while you are in the dimension. You earn Nether XP for every point of damage the ward removed.

Only applies in a Nether-environment world.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `ghastProjectileReductionBase` | `0.14` | Fraction of ghast fireball damage removed at level 0, 0 to 1. |
| `ghastProjectileReductionFactor` | `0.54` | Extra ghast reduction across levels. |
| `maxGhastProjectileReduction` | `0.8` | Ceiling on ghast reduction. |
| `explosionReductionBase` | `0.08` | Fraction of explosion damage removed at level 0, 0 to 1. |
| `explosionReductionFactor` | `0.42` | Extra explosion reduction across levels. |
| `maxExplosionReduction` | `0.65` | Ceiling on explosion reduction. |
| `witherSkeletonReductionBase` | `0.1` | Fraction of wither skeleton arrow damage removed at level 0, 0 to 1. |
| `witherSkeletonReductionFactor` | `0.4` | Extra arrow reduction across levels. |
| `maxWitherSkeletonReduction` | `0.55` | Ceiling on arrow reduction. |
| `maxFireTicksBase` | `80` | Burn ticks you are clamped to after a ghast fireball, at level 0. |
| `maxFireTicksFactor` | `70` | Ticks subtracted from that clamp across levels, floored at 0. |
| `xpPerMitigatedDamage` | `4.2` | Nether XP per point of damage the ward removed. |

### Blaze Leech (`nether-blaze-leech`)

5 levels · 3 knowledge

Fire feeds you. Whenever you take fire, lava, or magma-block damage there is a chance to trigger
a leech. Landing a hit on something that is currently burning also has that
chance. The leech grants food, saturation, and a burst of Regeneration. Higher levels raise the trigger chance, lengthen the regen, restore more food, and shorten the internal cooldown.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `triggerChanceBase` | `0.16` | Chance to leech at level 0, 0 to 1. |
| `triggerChanceFactor` | `0.34` | Extra trigger chance across levels. |
| `maxTriggerChance` | `0.7` | Ceiling on trigger chance. |
| `regenTicksBase` | `28` | Regeneration duration in ticks at level 0. The result is floored at 20. |
| `regenTicksFactor` | `42` | Extra regeneration ticks across levels. |
| `regenAmplifierBase` | `0` | Regeneration amplifier at level 0 (0 is Regeneration I). |
| `regenAmplifierFactor` | `1` | Extra amplifier across levels, floored to a whole number. |
| `foodRestoreBase` | `1` | Food points restored per proc at level 0. |
| `foodRestoreFactor` | `2` | Extra food points restored across levels. |
| `saturationRestore` | `0.6` | Saturation points restored per proc, flat. |
| `cooldownMillisBase` | `1400` | Milliseconds between procs at level 0. |
| `cooldownMillisFactor` | `900` | Milliseconds removed from the gap across levels, floored at 100. |
| `xpOnDefensiveProc` | `6` | Nether XP when the proc came from damage you took. |
| `xpOnOffensiveProc` | `5` | Nether XP when the proc came from hitting a burning target. |

### Piglin Broker (`nether-piglin-broker`)

5 levels · 4 knowledge

Any piglin bartering near you pays better. When a barter resolves, the nearest player with this adaptation gets credited. There is a chance for a duplicated and enlarged roll of whatever came out. There is a smaller chance for a separate bonus item from a fixed premium pool. You do not have to be the one who threw the gold.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `brokerRange` | `18` | Blocks from the piglin searched for an eligible broker. |
| `extraRollChanceBase` | `0.1` | Chance to duplicate one outcome item at level 0, 0 to 1. |
| `extraRollChanceFactor` | `0.45` | Extra duplication chance across levels. |
| `maxExtraRollChance` | `0.6` | Ceiling on duplication chance. |
| `rareBonusChanceBase` | `0.03` | Chance for a premium bonus item at level 0, 0 to 1. |
| `rareBonusChanceFactor` | `0.2` | Extra premium chance across levels. |
| `maxRareBonusChance` | `0.25` | Ceiling on premium chance. |
| `amountMultiplierBase` | `1.0` | Stack size multiplier on the duplicated item at level 0, floored at 1. |
| `amountMultiplierFactor` | `0.5` | Extra stack multiplier across levels. The result is capped by the item's max stack size. |
| `xpOnBoostedBarter` | `12` | Nether XP when a barter was improved. |

### Soul Strider (`nether-soul-strider`)

5 levels · 3 knowledge

Soul sand and soul soil stop slowing you down. You move across them at full speed and then some. At max level, stepping back onto soul ground after a short gap also fires a short soul-speed burst. Works anywhere, not only in the Nether.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `strideSpeedBase` | `0.20` | Reference stride speed. The movement speed bonus is `(levelPercent * factor) / base`. |
| `strideSpeedFactor` | `0.10` | Extra stride speed across levels. |
| `burstTicks` | `60` | Soul-speed burst duration in ticks. |
| `burstAmplifier` | `1` | Burst strength. The speed multiplier is `0.2 * (amplifier + 1)`. |
| `burstGapMillis` | `600` | Milliseconds you must be off soul ground before stepping back on can fire a burst. |
| `burstCooldownMillis` | `3000` | Milliseconds between bursts. |
| `xpPerStride` | `2.0` | Nether XP per XP interval while striding. |
| `xpIntervalMillis` | `1500` | Milliseconds between stride XP awards. |

### Magma Skin (`nether-magma-skin`)

4 levels · 4 knowledge, then 3 per level

Only active while you are on fire. Anyone who melees you catches fire, and your own melee swings deal bonus damage and set the target burning. Combines well with anything that keeps you lit, since being on fire is the requirement rather than the problem.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `reflectFireTicksBase` | `40` | Ticks an attacker is set alight at level 0. |
| `reflectFireTicksFactor` | `60` | Extra attacker burn ticks across levels. |
| `bonusDamageBase` | `0.5` | Flat damage added to your melee hits at level 0, in half-hearts. |
| `bonusDamageFactor` | `2.5` | Extra flat damage across levels. |
| `bonusFireTicksBase` | `40` | Ticks your target is set alight at level 0. |
| `bonusFireTicksFactor` | `40` | Extra target burn ticks across levels. |
| `xpOnReflect` | `6` | Nether XP each time an attacker is ignited. |
| `xpPerBonusDamage` | `3` | Nether XP per point of bonus damage dealt. |

### Netherrack Mason (`nether-netherrack-mason`)

4 levels · 3 knowledge

In the Nether, starting to mine netherrack, basalt, or blackstone gives you a block-breaking speed boost that refreshes as you keep working. Every one of those blocks you break pays Nether XP. Some of them drop an extra item. Usually that is a second copy of what you mined. Sometimes it is gold nuggets, quartz, iron nuggets, or nether brick.

Eligible blocks: `NETHERRACK`, `BASALT`, `POLISHED_BASALT`, `SMOOTH_BASALT`, `BLACKSTONE`, `POLISHED_BLACKSTONE`, `GILDED_BLACKSTONE`, `CHISELED_POLISHED_BLACKSTONE`, `POLISHED_BLACKSTONE_BRICKS`, `CRACKED_POLISHED_BLACKSTONE_BRICKS`. The boost is a block-break-speed attribute modifier of `0.20 * tier`, not the Haste potion effect.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `hasteTierBase` | `1` | Mining speed tier at level 0, floored at 1. |
| `hasteTierFactor` | `1.5` | Extra tier across levels, rounded to a whole number. |
| `hasteDurationTicks` | `120` | How long each mining speed application lasts, in ticks. |
| `hasteRefreshMillis` | `4000` | Milliseconds before the modifier is reapplied. |
| `bonusDropChanceBase` | `0.08` | Chance of a bonus drop per block at level 0, 0 to 1. |
| `bonusDropChanceFactor` | `0.35` | Extra bonus drop chance across levels. |
| `maxBonusDropChance` | `0.4` | Ceiling on bonus drop chance. |
| `premiumDropChance` | `0.25` | Chance that a bonus drop is a premium item (gold nugget, quartz, iron nugget, or nether brick) instead of a copy of the mined block. |
| `xpPerBlock` | `1.5` | Nether XP per eligible block broken. |
| `xpOnBonusDrop` | `5` | Extra Nether XP when a bonus drop lands. |

### Strider Bond (`nether-strider-bond`)

4 levels · 4 knowledge, then 3 per level

Striders you ride stop shivering and move faster, including when they step out of lava. From level 2 up, dismounting over lava triggers a rescue. The adaptation looks
for solid safe ground nearby and teleports you there instead of letting you fall
in. The first successful rescue unlocks a hidden challenge.

**How to use it**

1. Saddle a strider and ride it with a warped fungus on a stick, as normal.
2. The speed applies while you ride. If you get thrown off over lava at level 2 or higher, the rescue handles it.

The strider speed modifier is `0.2 * (amplifier + 1)` applied to the strider, not to you.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `striderSpeedAmplifierBase` | `0` | Speed amplifier at level 0. |
| `striderSpeedAmplifierFactor` | `1.5` | Extra amplifier across levels, rounded to a whole number. |
| `speedTicks` | `60` | How long each speed application lasts, in ticks. |
| `safetyUnlockLevel` | `2` | Adaptation level required before the lava dismount rescue works. |
| `searchRadiusBase` | `4` | Blocks searched outward for safe ground at level 0. |
| `searchRadiusFactor` | `4` | Extra search radius across levels. |
| `searchRadiusMax` | `8` | Hard cap on the search radius, keeping the scan local. |
| `xpPerRide` | `2` | Nether XP per XP interval while riding. |
| `xpIntervalMillis` | `1500` | Milliseconds between riding XP awards. |
| `xpPerRescue` | `30` | Nether XP for a successful lava rescue. |

### Crimson Feast (`nether-crimson-feast`)

4 levels · 3 knowledge, then 2 per level

Nether flora becomes food. Right-click while holding a crimson or warped fungus, roots, nether sprouts, weeping vines, or twisting vines to eat it for food and saturation. On top of that, eating anything at all while in the Nether gives you fire resistance for a few seconds. Both halves pay XP.

**How to use it**

1. Hold any nether fungus, roots, sprouts, or vines.
2. Right-click to eat. If your food bar is already full you have to sneak to force it down.
3. Eat any normal food while in the Nether for the fire resistance buff.

Eligible flora: `CRIMSON_FUNGUS`, `WARPED_FUNGUS`, `CRIMSON_ROOTS`, `WARPED_ROOTS`, `NETHER_SPROUTS`, `WEEPING_VINES`, `TWISTING_VINES`.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `floraFoodBase` | `2` | Food points restored per flora item at level 0, floored at 1. |
| `floraFoodFactor` | `4` | Extra food points across levels. |
| `floraSaturationBase` | `1.5` | Saturation restored per flora item at level 0. |
| `floraSaturationFactor` | `3` | Extra saturation across levels. |
| `resistTicksBase` | `60` | Fire Resistance duration in ticks at level 0. |
| `resistTicksFactor` | `140` | Extra Fire Resistance ticks across levels. |
| `eatCooldownMillis` | `350` | Milliseconds between flora bites. |
| `xpPerFungus` | `4` | Nether XP per flora item eaten. |
| `xpPerNetherMeal` | `3` | Nether XP for eating anything else while in the Nether. |

### Ashwalker (`nether-ashwalker`)

3 levels · 4 knowledge, then 3 per level

Magma blocks stop hurting you from the moment you learn it. From level 2 up, campfires stop hurting you too. Those hits are cancelled outright and your fire ticks cleared, and the extinguish cue is silent by default. At max level soul fire is only reduced rather than cancelled, so you still feel it. You earn XP for every point it takes off.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `campfireUnlockLevel` | `2` | Adaptation level required before campfire burns are cancelled. |
| `soulFireReduction` | `0.8` | Fraction of soul fire damage removed at max level, 0 to 1. |
| `soulFireMaxFireTicks` | `20` | Burn ticks you are clamped to after soul fire damage. |
| `immunitySoundVolume` | `0.0` | Volume of Ashwalker's extinguish cue after fully cancelling magma or campfire damage, clamped to 0-1. 0 is silent. |
| `xpPerNegatedDamage` | `3` | Nether XP per point of damage cancelled or reduced. |

### Wither Harvest (`nether-wither-harvest`)

4 levels · 4 knowledge, then 3 per level

Every wither skeleton you kill drops extra bones and coal, and gets a better chance at dropping its skull. The skull roll is skipped if the mob already dropped one on its own, so it never doubles up.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `bonusBonesBase` | `1` | Extra bones dropped at level 0, floored at 1. |
| `bonusBonesFactor` | `2` | Extra bones added across levels. |
| `bonusCoalBase` | `0.5` | Extra coal dropped at level 0, floored at 1. |
| `bonusCoalFactor` | `2` | Extra coal added across levels. |
| `skullChanceBase` | `0.03` | Chance to add a wither skeleton skull at level 0, 0 to 1. |
| `skullChanceFactor` | `0.12` | Extra skull chance across levels. |
| `maxSkullChance` | `0.15` | Ceiling on skull chance. |
| `xpPerHarvest` | `12` | Nether XP per harvested wither skeleton. |
| `xpOnSkull` | `40` | Extra Nether XP when the roll adds a skull. |

## Reference

### Skill configuration defaults

Written to `plugins/Adapt/skills/nether.toml` on first load.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `skillColor` | `"&8"` | Legacy ampersand color code used for Nether in menus and text. |
| `enabled` | `true` | Turns the whole Nether skill on or off. |
| `witherDamageXp` | `26.0` | XP for taking a tick of Wither effect damage that did not come from a block source. |
| `witherDamageXpCooldown` | `1500` | Milliseconds between wither-damage XP awards. |
| `witherAttackXp` | `15` | XP for landing a melee hit on a Wither boss. |
| `witherAttackXpCooldown` | `1500` | Milliseconds between wither-attack XP awards. |
| `witherSkeletonKillXp` | `225` | XP for killing a wither skeleton. |
| `witherKillXp` | `900` | XP for killing the Wither. |
| `witherRoseBreakXp` | `125` | XP for breaking a wither rose. |
| `witherRoseBreakCooldown` | `1200` (written as `60 * 20`) | Ticks between wither-rose payouts, converted to milliseconds at 50 ms per tick, so 60 seconds. |
| `challengeNetherReward` | `500` | Base XP for the Nether kill-count challenges. Later tiers pay 2x and 5x. |
| `challengeWitherDmgReward` | `500` | Base XP for the wither-damage challenges. The second tier pays 2x. |
| `challengeWitherSkelReward` | `500` | Base XP for the wither-skeleton challenges. The second tier pays 2x. |
| `challengeWitherBossReward` | `1000` | Base XP for the Wither boss challenges. The second tier pays 2x. |
| `challengeRosesReward` | `500` | Base XP for the wither-rose challenges. The second tier pays 2x. |

### Challenges

| Challenge | Threshold | Reward knob |
|---|---|---|
| `challenge_nether_50` | 50 | `challengeNetherReward` |
| `challenge_nether_500` | 500 | `challengeNetherReward` x2 |
| `challenge_nether_5k` | 5000 | `challengeNetherReward` x5 |
| `challenge_wither_dmg_500` | 500 | `challengeWitherDmgReward` |
| `challenge_wither_dmg_5k` | 5000 | `challengeWitherDmgReward` x2 |
| `challenge_wither_skel_25` | 25 | `challengeWitherSkelReward` |
| `challenge_wither_skel_250` | 250 | `challengeWitherSkelReward` x2 |
| `challenge_wither_boss_1` | 1 | `challengeWitherBossReward` |
| `challenge_wither_boss_10` | 10 | `challengeWitherBossReward` x2 |
| `challenge_roses_10` | 10 | `challengeRosesReward` |
| `challenge_roses_100` | 100 | `challengeRosesReward` x2 |

Each adaptation has its own file at `plugins/Adapt/adaptations/<id>.toml`. Alongside the keys listed above it carries `enabled`, `permanent`, `showParticles`, `showSounds`, and its learn costs (`maxLevel`, `initialCost`, `baseCost`, `costFactor`). Every file is generated with a comment on each key and values are clamped on load.

## See also

- [02 - Concepts](/adapt/02-concepts)
- [03 - Player Usage](/adapt/03-player-usage)
- [10 - Skills Catalog](/adapt/10-skills-catalog)
- [04 - Commands & Permissions](/adapt/04-commands-permissions)
