---
title: "Skill - Nether"
description: "Nether XP sources, adaptations, controls, and configuration"
published: true
date: 2026-10-01T06:36:54.442Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Nether gains XP from wither damage, damaging or killing the Wither, killing wither skeletons, and breaking wither roses. Its 14 adaptations add fire, ghast, wither, and magma protection, lava and soul-sand movement, strider control, netherrack mining, piglin barter bonuses, Nether foods, wither loot, fire-based recovery, and thrown wither skulls, and many of those actions pay XP of their own.

## Adaptations

Every adaptation has an Enabled control at the bottom of its level screen. Personal choices are saved per player; the server can lock controls and restrict choices. Full, half and quarter settings only reduce the earned server value. Defaults retain ordinary behavior unless a shared gesture needs one adaptation to take priority.

Lava Walker, Ghast Ward, Netherrack Mason, and the meal half of Crimson Feast run only in a Nether-environment world. Every other adaptation works in any dimension.

### Wither Resistance (`nether-wither-resist`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/nether/nether-wither-resist-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/nether/nether-wither-resist-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

3 levels · 5 knowledge, then 3 per level

Each worn netherite piece adds `basePieceChance + chanceAddition * level` percentage points, summed across helmet, chestplate, leggings, and boots, then clamped to 100%. With the defaults, a full netherite set at level 3 reaches that clamp.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `basePieceChance` | `10` | Percentage points contributed by each netherite piece before level scaling. |
| `chanceAddition` | `5` | Percentage points added per piece per adaptation level. |

### Wither Skull Throw (`nether-skull-toss`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/nether/nether-skull-toss-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/nether/nether-skull-toss-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

3 levels · 5 knowledge, then 10 per level

A right-click with a wither skeleton skull in the main hand fires an uncharged, non-bouncing wither skull along the aim, shows the cooldown on that item, consumes the skull except in Creative, never places the skull, and pays 100 Nether XP. A kill from 40 or more blocks completes a hidden challenge, and neutral mobs stay out of the explosion even when provoked if `ignore passiveMobs` is true.

Personal controls: Require sneak to throw (on/off).

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `ignorePassiveMobs` | `false` | Exclude passive and neutral mobs from skull explosion damage; direct projectile hits are unchanged. |
| `baseCooldown` | `15` | Seconds between throws at level 0. |
| `levelCooldown` | `5` | Seconds removed from the cooldown per adaptation level, floored at 1 second. |

### Fire Resistance (`nether-fire-resist`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/nether/nether-fire-resist-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/nether/nether-fire-resist-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

3 levels · 6 knowledge, then 4 per level

Each burn tick is cancelled with chance `fireResistBase + fireResistFactor * level`, using the raw level rather than level progress. Lava damage is not covered.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `fireResistBase` | `0.10` | Chance to cancel burn damage at level 0, 0 to 1. |
| `fireResistFactor` | `0.25` | Chance added per adaptation level, 0 to 1. |

### Lava Walker (`nether-lava-walker`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/nether/nether-lava-walker-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/nether/nether-lava-walker-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge

Walking into lava moves the player along the look direction, cancels fall distance, and extinguishes fire. An empty food bar, flight, gliding, or riding blocks the stride.

Personal controls: Sneak to drop through (on/off); Food reserve (No reserve/Keep 4 food/Keep 8 food).

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

<div class="adapt-demo">
<video src="/adapt-assets/demos/nether/nether-ghast-ward-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/nether/nether-ghast-ward-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

6 levels · 4 knowledge

Ghast fireballs, other explosions, and wither-skeleton arrows deal less damage, and a ghast fireball also clamps remaining burn time.

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

<div class="adapt-demo">
<video src="/adapt-assets/demos/nether/nether-blaze-leech-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/nether/nether-blaze-leech-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 3 knowledge

Taking damage from fire, lava, or standing on magma blocks, or hitting a burning target, can restore food and saturation and apply Regeneration.

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

<div class="adapt-demo">
<video src="/adapt-assets/demos/nether/nether-piglin-broker-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/nether/nether-piglin-broker-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge

When a piglin barter resolves, the nearest player with this adaptation inside range is credited, even if that player did not throw the gold.

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

<div class="adapt-demo">
<video src="/adapt-assets/demos/nether/nether-soul-strider-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/nether/nether-soul-strider-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 3 knowledge

Soul sand and soul soil no longer slow movement in any dimension, and a speed bonus is applied. The soul-speed burst fires only at max level.

Personal controls: Soul-surface slow immunity (on/off); Mastery speed burst (on/off).

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

<div class="adapt-demo">
<video src="/adapt-assets/demos/nether/nether-magma-skin-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/nether/nether-magma-skin-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

4 levels · 4 knowledge, then 3 per level

While the player is on fire, a melee attacker is ignited, and this player's melee hits deal bonus damage and ignite the target.

Personal controls: Burning retaliation (on/off); Ignite struck targets (on/off).

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

<div class="adapt-demo">
<video src="/adapt-assets/demos/nether/nether-netherrack-mason-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/nether/nether-netherrack-mason-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

4 levels · 3 knowledge

Mining `NETHERRACK`, `BASALT`, `POLISHED_BASALT`, `SMOOTH_BASALT`, `BLACKSTONE`, `POLISHED_BLACKSTONE`, `GILDED_BLACKSTONE`, `CHISELED_POLISHED_BLACKSTONE`, `POLISHED_BLACKSTONE_BRICKS`, or `CRACKED_POLISHED_BLACKSTONE_BRICKS` applies `BLOCK_BREAK_SPEED` at `0.20 * tier`, not Haste.

Personal controls: Mining assistance (on/off); Bonus drops (on/off).

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

<div class="adapt-demo">
<video src="/adapt-assets/demos/nether/nether-strider-bond-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/nether/nether-strider-bond-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

4 levels · 4 knowledge, then 3 per level

The ridden strider stops shivering and gains speed `0.2 * (amplifier + 1)` on the strider itself, including outside lava. From `safetyUnlockLevel` upward, a dismount over lava teleports the rider to safe ground, including while still airborne above the strider, only if the adaptation remains learned and enabled, the dismount was not cancelled, the rider stays unmounted, and solid ground does not already separate the rider from the lava; on Folia the search uses only ground owned by the rider's region, and the first rescue completes a hidden challenge.

Personal controls: Mounted speed (on/off); Dismount protection (on/off).

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

<div class="adapt-demo">
<video src="/adapt-assets/demos/nether/nether-crimson-feast-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/nether/nether-crimson-feast-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

4 levels · 3 knowledge, then 2 per level

A right-click eats `CRIMSON_FUNGUS`, `WARPED_FUNGUS`, `CRIMSON_ROOTS`, `WARPED_ROOTS`, `NETHER_SPROUTS`, `WEEPING_VINES`, or `TWISTING_VINES` in any dimension; a full hunger bar requires sneak. Any other food eaten in a Nether-environment world grants Fire Resistance.

Personal controls: Require sneak to eat flora (on/off); Nether meal protection (on/off).

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

<div class="adapt-demo">
<video src="/adapt-assets/demos/nether/nether-ashwalker-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/nether/nether-ashwalker-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

3 levels · 4 knowledge, then 3 per level

Standing on magma blocks causes no damage at any learned level, and campfire damage is cancelled from `campfireUnlockLevel`; both also clear fire ticks. Soul fire is reduced only at max level, not cancelled.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `campfireUnlockLevel` | `2` | Adaptation level required before campfire burns are cancelled. |
| `soulFireReduction` | `0.8` | Fraction of soul fire damage removed at max level, 0 to 1. |
| `soulFireMaxFireTicks` | `20` | Burn ticks you are clamped to after soul fire damage. |
| `immunitySoundVolume` | `0.0` | Volume of Ashwalker's extinguish cue after fully cancelling magma or campfire damage, clamped to 0-1. 0 is silent. |
| `xpPerNegatedDamage` | `3` | Nether XP per point of damage cancelled or reduced. |

### Wither Harvest (`nether-wither-harvest`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/nether/nether-wither-harvest-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/nether/nether-wither-harvest-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

4 levels · 4 knowledge, then 3 per level

A wither skeleton kill adds extra bones and coal, and adds a skull only when that mob did not already drop one.

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

## See also

Catalog: [Skills](/adapt/10-skills-catalog). Rules: [Concepts](/adapt/02-concepts).
