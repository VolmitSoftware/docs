---
title: "Skill - Kinetics"
description: "Kinetics XP sources, adaptations, controls, and configuration"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Kinetics gains XP from mace smashes, spear charges, knockback, slime or bed bounces, piston launches, levitation, large survived falls, and falling anvils.

Its 18 adaptations change movement, mace attacks, and spear combat. Most combat hooks require Paper events. Adapt tracks placed anvils through piston movement and falling, then credits the owner and nearby players when one hits a target.

## Adaptations

All of this needs the adaptation learned to level 1 or higher, the skill and the adaptation enabled in config, the `adapt.use.*` permission (or the matching per-adaptation node), and protection and region policy that allow the action. Several of these lean on modern attributes (gravity, bounciness, air drag, scale) and silently do nothing on a server version that lacks them.

"Spear" means any of the seven spear items, wooden through netherite. "Mace" means the vanilla mace.

### Moon Jump (`kinetics-moon-jump`)

5 levels · 2 knowledge, then 4 per level

Every jump gets higher, half a block per level, and it stays applied as long as you have the adaptation. Sneak-jumping adds a short extra hop with reduced gravity on top, which turns the peak of the jump into a slow float. Good for getting around, and it pairs with the mace adaptations because height is what a smash attack needs.

**How to use it**

1. Jump normally for the passive height.
2. Hold sneak and jump for the floaty low-gravity hop.

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

Your boots stay springy all the time, so every landing keeps more of your momentum. Landing on a slime block, honey block, or bed adds a bigger springload bonus for a couple of seconds on top.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `bouncinessBase` | `0.15` | Bounciness attribute added at all times, at level 0. |
| `bouncinessFactor` | `0.35` | Extra passive bounciness across levels. |
| `softBlockBonusBase` | `0.3` | Extra bounciness after landing on slime, honey, or a bed, at level 0. |
| `softBlockBonusFactor` | `0.5` | Extra bouncy-block bounciness across levels. |
| `bonusWindowTicks` | `40` | How long the bouncy-block bonus lasts, in ticks. |

### Soft Catch (`kinetics-soft-catch`)

5 levels · 2 knowledge, then 4 per level

Landing on something soft cuts most of the fall damage and pays Kinetics XP for the damage you avoided. Soft surfaces are slime, honey, any bed, hay bale, powder snow, sponge, and wet sponge. Bouncing off a springy block also opens a short grace window, so the landing after a bounce is protected even if you come down on stone.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `reductionBase` | `0.35` | Fraction of fall damage removed at level 0, 0 to 1. |
| `reductionFactor` | `0.45` | Extra fall damage reduction across levels. |
| `postBounceGraceTicks` | `30` | Ticks after a bouncy landing during which any fall still gets the reduction. |
| `xpPerDamagePrevented` | `1.5` | Kinetics XP per half-heart of fall damage removed. |
| `xpPerEventCap` | `50` | Maximum XP from one softened fall. |

### Surface Skate (`kinetics-surface-skate`)

5 levels · 2 knowledge, then 4 per level

Sprint on any ground surface and Surface Skate cancels a level-scaled percentage of that surface's normal friction loss. With the defaults, level 1 cancels 22% and level 5 cancels 50%. Stone, ice, soul sand, and every other supporting surface keep their own character. All become proportionally slicker. Pressing sneak while grounded applies a separate horizontal brake: its default 100% setting immediately sets X/Z motion to zero without changing Y motion. This is a one-time brake on the sneak press, not a movement lock while sneak remains held.

Servers with the friction attribute use a native `MULTIPLY_SCALAR_1` modifier. Servers without it get the same percentage through a velocity fallback that never accelerates you from rest and never touches vertical motion.

**How to use it**

1. Sprint to slide.
2. Press sneak while grounded to brake immediately.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `slidePercentBase` | `0.15` | Base percentage of each surface's friction loss cancelled while sprinting. Clamped to `0`-`1`. |
| `slidePercentFactor` | `0.35` | Additional percentage at max level. Clamped to `0` through `1 - slidePercentBase`, so the total never exceeds 100%. |
| `sneakBrakePercent` | `1.0` | Horizontal velocity removed on a grounded sneak press. Clamped to `0`-`1`. `1.0` is a complete stop and `0` disables the brake. |

On load the old `slideFrictionBase`, `slideFrictionFactor`, `gripFrictionBase`, and `gripFrictionFactor` keys are removed from the config rather than kept as aliases.

### Terminal Toggle (`kinetics-terminal-toggle`)

3 levels · 2 knowledge, then 4 per level

While falling, sneaking flips you between two midair modes. Dive cuts air drag
and increases gravity to get you down fast. Hang does the opposite and turns the
fall into a drift. Each sneak press swaps modes. You need to have been airborne for a moment before the toggle arms, and landing clears the mode.

**How to use it**

1. Get airborne and wait a fraction of a second.
2. Tap sneak to enter dive. Tap it again to switch to hang, and again to go back to dive.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `dragDeltaBase` | `0.2` | Air drag shift at level 0, as a scalar fraction. |
| `dragDeltaFactor` | `0.4` | Extra air drag shift across levels. |
| `gravityDeltaBase` | `0.2` | Gravity shift at level 0, as a scalar fraction. |
| `gravityDeltaFactor` | `0.4` | Extra gravity shift across levels. |
| `minAirTicks` | `6` | Ticks you must already be airborne before a sneak press can toggle a mode. |

### Heavy Frame (`kinetics-heavy-frame`)

5 levels · 2 knowledge, then 4 per level

Sneak while holding a mace or a spear and you plant your feet. You get heavy
knockback resistance, blast resistance, and a movement speed penalty for as long
as you hold it. This is a passive transient-attribute stance, not a potion effect, so there is no status icon. A short chain sound and particle ring confirm entry and exit. Stand up or switch to a different item and it drops immediately.

**How to use it**

1. Hold a mace or spear in your main hand.
2. Hold sneak. The stance stays up until you stop sneaking or change item.

The stance uses transient `KNOCKBACK_RESISTANCE`, `EXPLOSION_KNOCKBACK_RESISTANCE`, and `MOVEMENT_SPEED` modifiers rather than a potion effect.

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

Three persistent body forms you switch between with a gesture. Titan makes you bigger. It adds 20 percent to your attack damage and max health. It gives you a taller step height and a pulled-back camera. It saddles you with Slowness I. Pocket makes you smaller, takes 20 percent off damage and health, and gives you Speed I. Normal is normal. The form survives until you change it. It resets on death or logout.

**How to use it**

1. Hold sneak.
2. Look up and press the swap-hands key (F by default) for Titan, look down for Pocket, or look level to go back to Normal. The offhand swap itself is cancelled while you do this.

None of this is exposed in config. The 20 percent applies to attack damage and max health as `MULTIPLY_SCALAR_1`, Titan also gets step height `+1.0` and camera distance `+2.0`, and the look threshold is 25 degrees of pitch. Health is clamped to the new maximum on every form change.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `titanScaleBase` | `0.25` | Scale attribute added in Titan form, at level 0. |
| `titanScaleFactor` | `0.35` | Extra Titan scale across levels. |
| `pocketScaleBase` | `0.25` | Scale attribute subtracted in Pocket form, at level 0. |
| `pocketScaleFactor` | `0.25` | Extra Pocket shrink across levels. |

### Meteor Cadence (`kinetics-meteor-cadence`)

5 levels · 2 knowledge, then 4 per level

Hold sneak while falling with a mace and you drop like a rock. You get extra
gravity, less air drag, and a hard downward push added every tick up to a
terminal speed. Fall distance is what powers vanilla mace smash damage, so this is a setup move rather than a separate damage source. Releasing sneak or touching ground ends it.

**How to use it**

1. Get airborne with a mace in your main hand.
2. Hold sneak while you are moving downward. Aim at what you want to hit.

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

Landing a mace smash strips armor points and armor toughness off the target for several seconds, so your follow-up swings land much harder. One target can only be shredded once every few seconds.

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

A smash landed after a big enough fall sets off a shockwave that throws every nearby living thing away from you. Your own pets and mobs protected as friendly are skipped. You also get a moment of full explosion knockback resistance so the burst does not throw you. Higher levels widen the radius, add force, and lower the fall distance needed. Works on its own once learned, though you have to be falling to trigger it.

At most 16 entities are thrown by one burst, and you get `+1.0` explosion knockback resistance for 20 ticks.

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

Every smash you land braces you for a couple of seconds: knockback resistance, extra armor toughness, and extra safe fall distance. It is the adaptation that lets you smash into a crowd without immediately being knocked out of it.

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

After a smash, your legs stay coiled for a short window: your bounciness goes way up and fall damage is cut. Land inside that window and you spring back up, ready to line up the next dive.

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

While a spear is in your main hand, your entity interaction range grows. You hit
things from farther away than the person swinging back at you. Drop the spear and the reach goes away.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `reachBase` | `0.5` | Blocks of extra entity interaction range while holding a spear, at level 0. |
| `reachFactor` | `1.25` | Extra reach in blocks across levels. |

### Charge Lance (`kinetics-charge-lance`)

5 levels · 2 knowledge, then 4 per level

Spear hits scale with how fast you are actually moving. Below a minimum speed there is no bonus at all. This rewards hitting at the end
of a sprint or a lunge rather than standing still and poking. Does not apply while you are riding something. That is what Mounted Shock is for.

**How to use it**

1. Hold a spear.
2. Hit the target while sprinting or right out of a lunge.

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

Land a spear hit in the sweet band, not point-blank and not at the edge of your
reach. The target gets heavy Slowness plus a chain-and-particle confirmation. Distance is measured from your eye to the nearest point on the target's hitbox. Elevation and large mobs do not distort the range check. Higher levels widen the band, raise the slowness tier, and hold the pin longer. The same target cannot be re-pinned for a couple of seconds.

**How to use it**

1. Hold a spear and keep the target a few blocks away.
2. Hit them from inside the sweet band shown in the menu.

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

Your spear lunges hit with more power and carry you farther forward. The assist is horizontal only, so existing vertical motion is preserved. By default only one lunge every 2.5 seconds is boosted and the rest stay vanilla.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `powerBonusBase` | `1` | Lunge power added at level 0, rounded to a whole number. |
| `powerBonusFactor` | `2` | Extra lunge power across levels. |
| `dashBoostBase` | `0.2` | Forward velocity added when the lunge resolves, at level 0. |
| `dashBoostFactor` | `0.3` | Extra forward velocity across levels. |
| `cooldownMs` | `2500` | Milliseconds between boosted lunges. |

### Mounted Shock (`kinetics-mounted-shock`)

5 levels · 3 knowledge, then 4 per level

Spear hits from the saddle scale with your mount's speed rather than your own. A galloping horse turns a jab into a real charge. This stacks with the Taming skill's mounted damage, which is why the bonus is capped.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `mountSpeedFactorBase` | `1.0` | Bonus damage fraction per block-per-tick of mount speed, at level 0. |
| `mountSpeedFactorFactor` | `1.5` | Extra speed-to-damage conversion across levels. |
| `bonusCapBase` | `0.4` | Ceiling on the bonus damage fraction at level 0. |
| `bonusCapFactor` | `0.6` | Extra ceiling across levels. |
| `cooldownMs` | `2000` | Milliseconds between boosted mounted charges. |

### Dead Zone (`kinetics-dead-zone`)

3 levels · 4 knowledge, then 5 per level

Something attacks you at knife range while you hold a spear and it gets shoved out and slightly up, back to where your spear works. The shove also arms a short riposte window: your next spear hit inside that window does bonus damage.

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

Each adaptation has its own file at `plugins/Adapt/adaptations/<id>.toml`. Alongside the keys listed above it carries `enabled`, `permanent`, `showParticles`, `showSounds`, and its learn costs (`maxLevel`, `initialCost`, `baseCost`, `costFactor`). Every file is generated with a comment on each key and values are clamped on load.

## See also

- [02 - Concepts](/adapt/02-concepts)
- [03 - Player Usage](/adapt/03-player-usage)
- [10 - Skills Catalog](/adapt/10-skills-catalog)
- [04 - Commands & Permissions](/adapt/04-commands-permissions)
