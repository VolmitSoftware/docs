---
title: "Skill - Kinetics"
description: "Kinetics XP sources, adaptations, controls, and configuration"
published: true
date: 2026-09-28T10:36:37.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Kinetics gains XP from mace smashes, spear charges, knockback, slime or bed bounces, piston launches, levitation, large survived falls, and falling anvils. Its 18 adaptations change movement, mace attacks, and spear combat; most combat hooks require Paper events, and a placed anvil stays tracked through piston movement and falling so the owner and nearby players are credited when the anvil hits.

## Adaptations

Every adaptation has an Enabled control at the bottom of its level screen. Personal choices are saved per player; the server can lock controls and restrict choices. Full, half and quarter settings only reduce the earned server value. Defaults retain ordinary behavior unless a shared gesture needs one adaptation to take priority.

A spear is any of the seven spear items, wooden through netherite, and a mace is the vanilla mace. Adaptations that use gravity, bounciness, air drag, or scale do nothing on a server version that lacks that attribute.

### Moon Jump (`kinetics-moon-jump`)

5 levels · 2 knowledge, then 4 per level

Jump height increases by half a block per level and stays applied while the adaptation is learned. A sneak-jump adds a separate low-gravity hop.

Personal controls: Base jump assistance (on/off); Floaty hop (While sneaking/Every jump/Disabled).

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `jumpBonusBase` | `0.06` | Extra jump strength on a sneak-jump at level 0. |
| `jumpBonusFactor` | `0.10` | Extra sneak-jump strength added across levels. |
| `gravityReductionBase` | `0.15` | Fraction of gravity removed during the float window at level 0, 0 to 1. |
| `gravityReductionFactor` | `0.30` | Extra gravity reduction across levels. |
| `floatWindowTicksBase` | `20` | Float window length in ticks at level 0. |
| `floatWindowTicksFactor` | `20` | Extra float window ticks across levels. |

### Rubber Soul (`kinetics-rubber-soul`)

5 levels · 2 knowledge, then 4 per level

Passive bounciness is always applied. Effective bounciness caps at 1.0, so a slime bounce does not go higher; sneaking and honey blocks suppress bouncing, but a honey landing still arms the soft-block bonus for the next other surface, including a landing with no horizontal movement.

Personal controls: Base landing bounce (on/off); Extra springy-block bounce (on/off). The base bounce switch controls ordinary landing bounciness; Springy landing bonus controls the additional springy-surface bounce.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `bouncinessBase` | `0.15` | Bounciness attribute added at all times, at level 0. |
| `bouncinessFactor` | `0.35` | Extra passive bounciness across levels. |
| `softBlockBonusBase` | `0.3` | Extra bounciness after landing on slime, honey, or a bed, at level 0. |
| `softBlockBonusFactor` | `0.5` | Extra bouncy-block bounciness across levels. |
| `bonusWindowTicks` | `40` | How long the bouncy-block bonus lasts, in ticks. |

### Soft Catch (`kinetics-soft-catch`)

5 levels · 2 knowledge, then 4 per level

Fall damage is reduced on slime, honey, any bed, a hay bale, powder snow, sponge, or wet sponge.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `reductionBase` | `0.35` | Fraction of fall damage removed at level 0, 0 to 1. |
| `reductionFactor` | `0.45` | Extra fall damage reduction across levels. |
| `postBounceGraceTicks` | `30` | Ticks after a bouncy landing during which any fall still gets the reduction. |
| `xpPerDamagePrevented` | `1.5` | Kinetics XP per half-heart of fall damage removed. |
| `xpPerEventCap` | `50` | Maximum XP from one softened fall. |

### Surface Skate (`kinetics-surface-skate`)

5 levels · 2 knowledge, then 4 per level

Sprinting cancels a fraction of the supporting surface's friction loss. Without the friction attribute, that same fraction of actual ground momentum is kept, vertical motion and stronger knockback stay, and the player is never accelerated from rest; a grounded sneak press brakes once rather than locking movement while sneak remains held, and on load `slideFrictionBase`, `slideFrictionFactor`, `gripFrictionBase`, and `gripFrictionFactor` are removed instead of kept as aliases.

Personal controls: Skating control (While sprinting/Always, sneak to brake). Armed mode enables eligible sliding without sprinting; sneak remains the brake.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `slidePercentBase` | `0.15` | Base percentage of each surface's friction loss cancelled while sprinting. Clamped to `0`-`1`. |
| `slidePercentFactor` | `0.35` | Additional percentage at max level. Clamped to `0` through `1 - slidePercentBase`, so the total never exceeds 100%. |
| `sneakBrakePercent` | `1.0` | Horizontal velocity removed on a grounded sneak press. Clamped to `0`-`1`. `1.0` is a complete stop and `0` disables the brake. |

### Terminal Toggle (`kinetics-terminal-toggle`)

3 levels · 2 knowledge, then 4 per level

While falling, each sneak press swaps dive and hang: dive cuts air drag and raises gravity, and hang does the opposite. Landing clears the mode.

Personal controls: Midair mode cycle (Dive then hang/Hang then dive/Dive only/Hang only); Switch gesture (Tap sneak/Double-tap sneak).

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `dragDeltaBase` | `0.2` | Air drag shift at level 0, as a scalar fraction. |
| `dragDeltaFactor` | `0.4` | Extra air drag shift across levels. |
| `gravityDeltaBase` | `0.2` | Gravity shift at level 0, as a scalar fraction. |
| `gravityDeltaFactor` | `0.4` | Extra gravity shift across levels. |
| `minAirTicks` | `6` | Ticks you must already be airborne before a sneak press can toggle a mode. |

### Heavy Frame (`kinetics-heavy-frame`)

5 levels · 2 knowledge, then 4 per level

Sneaking with a mace or spear in the main hand applies transient knockback resistance, explosion knockback resistance, and a movement-speed penalty until sneak is released or the held item changes. It is not a potion effect and shows no status icon.

Personal controls: Stance control (Hold sneak/Tap to toggle stance).

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `kbResistBase` | `0.3` | Knockback resistance added while planted, at level 0. |
| `kbResistFactor` | `0.5` | Extra knockback resistance across levels. |
| `explosionResistBase` | `0.3` | Explosion knockback resistance added while planted, at level 0. |
| `explosionResistFactor` | `0.5` | Extra explosion knockback resistance across levels. |
| `speedPenaltyBase` | `0.15` | Fraction of movement speed lost while planted, at level 0. |
| `speedPenaltyFactor` | `0.15` | Extra speed penalty across levels. |

### Mass Shift (`kinetics-mass-shift`)

3 levels · 5 knowledge, then 6 per level

Sneak plus swap-hands cancels the offhand swap and picks a form from pitch: above 25 degrees selects Titan, below 25 selects Pocket, and a level look selects Normal. Titan adds 20% attack damage and max health (`MULTIPLY_SCALAR_1`), step height +1.0, camera distance +2.0, and Slowness I; Pocket subtracts 20% damage and health and grants Speed I; health clamps to the new maximum, the form lasts until it is changed, death or logout resets it, and those modifiers are not config keys.

Personal controls: Form selection (Look direction/Cycle Titan, Pocket, normal).

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `titanScaleBase` | `0.25` | Scale attribute added in Titan form, at level 0. |
| `titanScaleFactor` | `0.35` | Extra Titan scale across levels. |
| `pocketScaleBase` | `0.25` | Scale attribute subtracted in Pocket form, at level 0. |
| `pocketScaleFactor` | `0.25` | Extra Pocket shrink across levels. |

### Meteor Cadence (`kinetics-meteor-cadence`)

5 levels · 2 knowledge, then 4 per level

Holding sneak while falling with a mace in the main hand dives until sneak is released or the player touches ground. The dive adds no damage of its own; smash damage still comes from fall distance.

Personal controls: Dive control (While sneaking/Every eligible fall).

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `gravityBoostBase` | `0.3` | Gravity increase while diving, at level 0, as a scalar fraction. |
| `gravityBoostFactor` | `0.6` | Extra gravity increase across levels. |
| `dragCutBase` | `0.2` | Air drag reduction while diving, at level 0. |
| `dragCutFactor` | `0.4` | Extra drag reduction across levels. |
| `downwardAccelerationBase` | `0.2` | Downward velocity added per tick while diving, at level 0. Clamped to 2.0. |
| `downwardAccelerationFactor` | `0.3` | Extra per-tick downward push across levels. |
| `terminalFallSpeed` | `3.5` | Fastest downward speed this dive will push you to, in blocks per tick. Clamped to 10. |

### Breachwright (`kinetics-breachwright`)

5 levels · 2 knowledge, then 4 per level

A landed mace smash removes armor and armor toughness from that target.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `armorShredBase` | `2` | Armor points removed at level 0. |
| `armorShredFactor` | `4` | Extra armor points removed across levels. |
| `toughnessShredBase` | `1` | Armor toughness removed at level 0. |
| `toughnessShredFactor` | `3` | Extra toughness removed across levels. |
| `shredTicksBase` | `80` | Shred duration in ticks at level 0. |
| `shredTicksFactor` | `60` | Extra shred duration in ticks across levels. |
| `targetCooldownMs` | `3000` | Milliseconds before the same target can be shredded again. |

### Windburst (`kinetics-windburst`)

5 levels · 2 knowledge, then 4 per level

A mace smash past the fall-distance requirement throws at most 16 nearby living entities and grants +1.0 explosion knockback resistance for 20 ticks. The player's pets and mobs protected as friendly are skipped.

Personal controls: Hostile targets only (on/off); Require sneak for shockwave (on/off).

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `radiusBase` | `2.5` | Shockwave radius in blocks at level 0. |
| `radiusFactor` | `2.5` | Extra radius in blocks across levels. |
| `forceBase` | `0.6` | Outward velocity applied to each target at level 0. |
| `forceFactor` | `0.8` | Extra outward velocity across levels. |
| `minFallDistanceBase` | `3` | Fall distance in blocks needed to trigger a burst at level 0. |
| `minFallDistanceFactor` | `-1` | Change to that requirement across levels. Negative means higher levels need less height. |
| `cooldownMs` | `4000` | Milliseconds between bursts. |
| `xpPerBurst` | `8` | Kinetics XP per burst. |

### Quake Guard (`kinetics-quake-guard`)

5 levels · 2 knowledge, then 4 per level

Each landed mace smash grants a short brace of knockback resistance, armor toughness, and extra safe fall distance.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `kbResistBase` | `0.3` | Knockback resistance granted after a smash, at level 0. |
| `kbResistFactor` | `0.5` | Extra knockback resistance across levels. |
| `toughnessBase` | `2` | Armor toughness granted after a smash, at level 0. |
| `toughnessFactor` | `4` | Extra toughness across levels. |
| `safeFallBase` | `2` | Safe fall distance in blocks granted after a smash, at level 0. |
| `safeFallFactor` | `4` | Extra safe fall distance across levels. |
| `braceTicksBase` | `40` | Brace duration in ticks at level 0. |
| `braceTicksFactor` | `40` | Extra brace duration in ticks across levels. |

### Rebound Anvil (`kinetics-rebound-anvil`)

3 levels · 4 knowledge, then 5 per level

After a mace smash, bounciness rises and fall damage is cut for a short window.

Personal controls: Rebound bounce (on/off); Landing cushion (on/off).

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `bouncinessBase` | `0.5` | Bounciness added during the window, at level 0. |
| `bouncinessFactor` | `0.6` | Extra bounciness across levels. |
| `fallReliefBase` | `0.4` | Fraction of the fall damage multiplier removed during the window, at level 0. |
| `fallReliefFactor` | `0.4` | Extra fall relief across levels. |
| `windowTicksBase` | `40` | Rebound window length in ticks at level 0. |
| `windowTicksFactor` | `30` | Extra window length in ticks across levels. |

### Phalanx Reach (`kinetics-phalanx-reach`)

5 levels · 2 knowledge, then 4 per level

Entity interaction range is higher while a spear is in the main hand, and it drops when that spear leaves the hand.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `reachBase` | `0.5` | Blocks of extra entity interaction range while holding a spear, at level 0. |
| `reachFactor` | `1.25` | Extra reach in blocks across levels. |

### Charge Lance (`kinetics-charge-lance`)

5 levels · 2 knowledge, then 4 per level

Spear damage scales with recent horizontal speed and does not apply while riding. Standing still or teleporting does not build that speed.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `speedDamageFactorBase` | `0.8` | Bonus damage fraction per block-per-tick of horizontal speed, at level 0. |
| `speedDamageFactorFactor` | `1.2` | Extra speed-to-damage conversion across levels. |
| `minSpeed` | `0.18` | Horizontal speed in blocks per tick below which no bonus applies. |
| `bonusCapBase` | `0.5` | Ceiling on the bonus damage fraction at level 0. |
| `bonusCapFactor` | `0.75` | Extra ceiling across levels. |
| `cooldownMs` | `1500` | Milliseconds between charge bonuses. |

### Impale Pin (`kinetics-impale-pin`)

5 levels · 2 knowledge, then 4 per level

A spear hit inside the distance band applies Slowness. Distance is measured from the eye to the nearest point on the target hitbox, so elevation and a large mob do not change the check.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `sweetMin` | `3.0` | Minimum distance in blocks for a hit to pin. |
| `sweetMaxBase` | `5.0` | Maximum distance in blocks at level 0. |
| `sweetMaxFactor` | `1.5` | Extra maximum distance across levels. |
| `slowTierBase` | `0` | Slowness amplifier at level 0 (0 is Slowness I). |
| `slowTierFactor` | `2` | Extra amplifier across levels, rounded to a whole number. |
| `durationTicksBase` | `40` | Slowness duration in ticks at level 0. The result is floored at 10. |
| `durationTicksFactor` | `50` | Extra slowness duration in ticks across levels. |
| `targetCooldownMs` | `2500` | Milliseconds before the same target can be pinned again. |

### Lunge Conductor (`kinetics-lunge-conductor`)

3 levels · 3 knowledge, then 4 per level

A spear lunge gains power and a forward dash. The dash is horizontal only, so existing vertical motion stays, and a lunge during the cooldown is unchanged.

Personal controls: Extra lunge travel (on/off).

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `powerBonusBase` | `1` | Lunge power added at level 0, rounded to a whole number. |
| `powerBonusFactor` | `2` | Extra lunge power across levels. |
| `dashBoostBase` | `0.2` | Forward velocity added when the lunge resolves, at level 0. |
| `dashBoostFactor` | `0.3` | Extra forward velocity across levels. |
| `cooldownMs` | `2500` | Milliseconds between boosted lunges. |

### Mounted Shock (`kinetics-mounted-shock`)

5 levels · 3 knowledge, then 4 per level

Spear hits while riding scale with the mount's speed, not the rider's, and stack with Taming mounted damage.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `mountSpeedFactorBase` | `1.0` | Bonus damage fraction per block-per-tick of mount speed, at level 0. |
| `mountSpeedFactorFactor` | `1.5` | Extra speed-to-damage conversion across levels. |
| `bonusCapBase` | `0.4` | Ceiling on the bonus damage fraction at level 0. |
| `bonusCapFactor` | `0.6` | Extra ceiling across levels. |
| `cooldownMs` | `2000` | Milliseconds between boosted mounted charges. |

### Dead Zone (`kinetics-dead-zone`)

3 levels · 4 knowledge, then 5 per level

An attacker inside the radius, while a spear is held, is shoved outward and slightly upward. That shove arms bonus damage on the next spear hit.

Personal controls: Hostile targets only (on/off); Require sneaking (on/off).

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `deadZoneRangeBase` | `2.0` | Radius in blocks inside which attackers get shoved, at level 0. |
| `deadZoneRangeFactor` | `1.0` | Extra radius in blocks across levels. |
| `shoveForceBase` | `0.5` | Outward velocity applied to the attacker at level 0. |
| `shoveForceFactor` | `0.6` | Extra shove force across levels. |
| `riposteWindowTicks` | `30` | Ticks the boosted counterattack stays armed after a shove. |
| `riposteBonusBase` | `0.2` | Bonus damage fraction on the riposte at level 0. |
| `riposteBonusFactor` | `0.4` | Extra riposte bonus across levels. |
| `cooldownMs` | `3000` | Milliseconds between shoves. |

## Reference

### Skill configuration defaults

Written to `plugins/Adapt/skills/kinetics.toml` on first load.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `enabled` | `true` | Turns the whole Kinetics skill on or off. |
| `skillColor` | `"&6"` | Legacy ampersand color code used for Kinetics in menus and text. |
| `cooldownDelay` | `1000` | Milliseconds between combat XP awards (smash, mace hit, spear jab, charge, mounted charge share one cooldown). |
| `smashHitXp` | `12` | XP for a mace smash attack that lands. |
| `plainMaceHitXp` | `3` | XP for an ordinary mace hit with no smash. |
| `spearJabXp` | `6` | XP for a spear hit inside the sweet range band. |
| `spearChargeXp` | `12` | XP for a spear hit that counts as charged. |
| `mountedChargeXp` | `14` | XP for a spear hit landed while riding a vehicle. |
| `sweetRangeMin` | `3.0` | Minimum distance in blocks for a spear jab reward. |
| `sweetRangeMax` | `6.0` | Maximum distance in blocks for a spear jab reward. |
| `chargeMinSpeed` | `0.18` | Horizontal speed in blocks per tick, while sprinting, that makes a spear hit count as charged. |
| `lungeChargeWindowMs` | `1200` | Milliseconds after a lunge during which any spear hit counts as charged regardless of speed. |
| `breakFallXpPerBlock` | `1.2` | XP per block of a survived fall of 3 blocks or more. |
| `breakFallCap` | `25` | Maximum XP from one broken fall. |
| `bounceXp` | `4` | XP for bouncing off a slime block, honey block, or bed. |
| `bounceChainBonus` | `2` | Extra XP per additional bounce in the same chain. |
| `bounceChainWindowMs` | `4000` | Milliseconds allowed between bounces to stay in one chain. |
| `bounceCap` | `20` | Maximum XP from one bounce. |
| `launchXp` | `4` | XP for being launched by a slime block or piston. |
| `launchMinDeltaY` | `0.6` | Upward movement in blocks, from a standstill or a fall, needed to count as a launch. |
| `motionRewardCooldownMs` | `1000` | Milliseconds between bounce or launch rewards. |
| `motionRewardMinDistance` | `1.5` | Horizontal blocks you must cover between bounce or launch rewards, which is what stops a fixed bounce farm. |
| `kbDealtBaseXp` | `3` | XP for knockback you deal at vanilla base magnitude. Scales with actual magnitude. |
| `kbTakenBaseXp` | `1.5` | XP for knockback you take at vanilla base magnitude. Scales with actual magnitude. |
| `kbMinMagnitude` | `0.25` | Knockback vector length below which nothing is paid. |
| `kbXpCap` | `12` | Maximum XP from one knockback event. |
| `kbCooldownMs` | `750` | Milliseconds between knockback rewards, shared by dealt and taken. |
| `selfKnockbackFactor` | `0.35` | Multiplier applied when you knocked yourself back. |
| `levitationReceiveXp` | `5` | Base XP when Levitation is applied to you. Scaled by amplifier and duration. |
| `levitationApplyXp` | `5` | Base XP per target when you apply Levitation with a splash potion or lingering cloud. |
| `levitationPulseXp` | `0.8` | XP per skill interval while you are levitating. |
| `levitationXpCap` | `15` | Maximum XP from one levitation award. |
| `levitationCooldownMs` | `1500` | Milliseconds between levitation rewards. |
| `anvilBaseXp` | `20` | Flat starting value of an anvil crush payout. |
| `anvilFallFactor` | `6` | XP added per block the anvil fell. |
| `anvilHealthFactor` | `0.6` | Scales the payout by the victim's max health (health x factor / 20 added as a multiplier). |
| `anvilKillBonusMultiplier` | `1.5` | Multiplier used when the anvil got the kill. A non-kill uses damage dealt over max health instead, floored at 0.1. |
| `anvilPerEventCap` | `250` | Maximum XP from one anvil crush. |
| `anvilCooldownMs` | `4000` | Milliseconds between anvil payouts for the same player, and between share payouts. |
| `anvilLocationCooldownMs` | `8000` | Milliseconds before the same block position can pay out again, which is what stops stacked-anvil farms. |
| `anvilShareRadius` | `8` | Blocks around the victim searched for players to share with. At most 8 recipients. |
| `anvilShareFactor` | `0.35` | Fraction of the owner's payout each nearby player receives. |
| `anvilLedgerTtlMs` | `120000` | Milliseconds a placed-anvil ownership record stays valid. |
| `anvilAdvancementMinFall` | `8` | Minimum anvil fall distance in blocks for a kill to count toward the challenge. |
| `anvilDropReward` | `500` | XP paid by the anvil-drop challenge. |

### Challenges

| Challenge | Threshold | Reward knob |
|---|---|---|
| `challenge_kinetics_anvil_drop` | 1 | `anvilDropReward` |

## See also

Catalog: [Skills](/adapt/10-skills-catalog). Rules: [Concepts](/adapt/02-concepts).
