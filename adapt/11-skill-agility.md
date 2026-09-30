---
title: "Skill - Agility"
description: "Agility XP sources, adaptations, controls, and configuration"
published: true
date: 2026-09-30T14:39:19.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Agility gains XP from movement, sprinting, swimming, airtime, and climbing. Its 13 adaptations cover sprint speed, wall jumps, charged jumps, slides, air dashes, safer landings, projectile dodging, and movement protections.

## How you earn Agility XP

Every movement credits `move` and pays `moveXp passive` per block. That same distance is credited to exactly one of `move.sneak`, `move.fly`, `move.swim`, or `move.sprint`, checked in that order. Those four stats are what the challenge milestones count. Every 975 ms a pulse pays `sprintXp passive` for sprinting, `swimXp passive` for swimming, `jumpXp passive` while off the ground, and `climbXp passive` while climbing, scaled by elapsed time. Sneaking or flying blocks all four. Sprinting and swimming exclude each other.

## Adaptations

Every adaptation has an Enabled control at the bottom of its level screen. Personal choices are saved per player; the server can lock controls and restrict choices. Full, half and quarter settings only reduce the earned server value. Defaults retain ordinary behavior unless a shared gesture needs one adaptation to take priority.

### Wind Up (`agility-wind-up`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/agility/agility-wind-up-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/agility/agility-wind-up-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 8 knowledge, then 2 per level

Unbroken sprint builds toward a higher speed target. Sneak, flight, glide, a mount or dismount, or leaving Survival or Adventure resets the buildup.

Personal controls: Maximum speed (full/half/quarter).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `windupTicksSlowest` | `180` | Ticks of unbroken sprinting needed to reach top speed at the lowest level. 20 ticks = 1 second. |
| `windupTicksFastest` | `60` | Ticks needed to reach top speed at max level. |
| `windupSpeedBase` | `0.22` | Speed target reached at the lowest level, before the per-level bonus. |
| `windupSpeedLevelMultiplier` | `0.225` | Extra speed target added at max level. |
| `walkSpeedBonusScalar` | `0.75` | Fraction of the speed target converted into the relative movement-speed modifier. |
| `walkSpeedLerpPerTick` | `0.45` | How quickly the applied modifier eases toward its target each tick, 0-1. |
| `maxWalkSpeed` | `0.35` | Walk-speed ceiling measured against the 0.2 vanilla base. The relative bonus is capped at maxWalkSpeed / 0.2 - 1. |
| `movementVelocityThreshold` | `0.015` | Minimum horizontal speed before top-speed ticks count toward the milestone stat. |

### Wall Jump (`agility-wall-jump`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/agility/agility-wall-jump-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/agility/agility-wall-jump-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 8 knowledge, then 2 per level

Airborne beside a solid face, sneak latches and stops the fall. Release launches. Ground contact refills latches. A backward release adds a push. Latch clears fall distance; release starts a new fall. Level raises launch strength and latches per airtime.

Personal controls: Wall jump control (Hold then release sneak/Tap to latch and jump).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `maxJumpsLevelBonusDivisor` | `2` | Latches per airtime are level plus level divided by this number. Lower values give more latches. |
| `jumpHeightBase` | `0.625` | Launch strength off the wall at the lowest level. |
| `jumpHeightBonusLevelMultiplier` | `0.225` | Extra launch strength added at max level. |
| `backwardPushSpeed` | `0.22` | Horizontal speed pushing you away from the wall when you release while steering backward. |
| `backwardIntentDotThreshold` | `0.35` | How directly your steering must oppose your facing, as a dot product, to count as a backward release. |
| `inputMovementThreshold` | `0.0025` | Minimum horizontal movement in one move event before it is recorded as a steering input. |
| `inputWindowMs` | `450` | How long a recorded steering input stays valid, in milliseconds. |

### Super Jump (`agility-super-jump`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/agility/agility-super-jump-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/agility/agility-super-jump-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

4 levels · 5 knowledge, then 2 per level

Sneak applies a jump-strength bonus until release. A jump during that window uses the bonus.

Personal controls: Jump control (Sneak and jump/Every jump); Jump height (full/half/quarter).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `minimumJumpHeight` | `1.5` | Jump apex in blocks at level 1. Values below the vanilla jump height are clamped up. |
| `maximumJumpHeight` | `3.75` | Jump apex in blocks at the configured maximum level, three times the vanilla jump. |

### Armor-Up (`agility-armor-up`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/agility/agility-armor-up-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/agility/agility-armor-up-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 8 knowledge, then 2 per level

Sprinting builds temporary armor that drains after the sprint stops. Sneak, swim, flight, or glide stops the buildup.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `windupTicksSlowest` | `180` | Ticks of unbroken sprinting needed for full plating at the lowest level. |
| `windupTicksFastest` | `60` | Ticks needed for full plating at max level. |
| `windupArmorBase` | `0.22` | Plating target at the lowest level. Multiplied by 10 to get armor points, so this alone is 2.2 armor. |
| `windupArmorLevelMultiplier` | `0.525` | Extra plating target added at max level, also multiplied by 10 for armor points. |
| `decaySecondsBase` | `5.0` | Seconds for full plating to drain away at the lowest level. |
| `decaySecondsMaxLevelBonus` | `5.0` | Extra drain seconds added at max level, so the plating lingers longer. |

### Ladder Slide (`agility-ladder-slide`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/agility/agility-ladder-slide-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/agility/agility-ladder-slide-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

1 level · 1 knowledge

On vanilla `CLIMBABLE` blocks except `SCAFFOLDING`, look up to climb faster and look down to descend faster. Sneak stops directional movement. The first and last two blocks of a column stay on vanilla control.

Personal controls: Upward assistance (on/off); Downward assistance (on/off); Assistance speed (full/half/quarter); Look sensitivity (Normal/More deliberate/More responsive).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `descentSpeedBase` | `0.30` | Downward speed in blocks per tick before per-level scaling. |
| `descentSpeedPerLevel` | `0.30` | Extra downward speed granted at max level. |
| `climbAssistBase` | `0.28` | Upward speed in blocks per tick before per-level scaling. |
| `climbAssistPerLevel` | `0.22` | Extra upward speed granted at max level. |
| `lookActivationDegrees` | `30.0` | Degrees above or below the horizon at which gaze-directed movement switches on. |
| `lookReleaseDegrees` | `15.0` | Degrees at which an active gaze direction hands control back to vanilla. |
| `safeLanding` | `true` | Cancels fall damage that came directly out of a fast ladder descent. |

### Roll Landing (`agility-roll-landing`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/agility/agility-roll-landing-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/agility/agility-roll-landing-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 3 knowledge

While falling, sneak shortly before landing to absorb part of the fall damage as a food cost. The cooldown uses the `HAY_BLOCK` item cooldown slot. A fall of 30 blocks or more grants a hidden challenge.

Personal controls: Food reserve (No reserve/Keep 4 food/Keep 8 food).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `reductionBase` | `0.22` | Fraction of fall damage absorbed at the lowest level. |
| `reductionFactor` | `0.43` | Extra fraction absorbed at max level. |
| `maxReduction` | `0.8` | Hard cap on the absorbed fraction regardless of level. |
| `inputWindowMillisBase` | `450` | How long a crouch input stays armed before landing, in milliseconds, before level scaling. |
| `inputWindowMillisFactor` | `350` | Extra armed window in milliseconds granted at max level. |
| `hungerPerDamageBase` | `1.4` | Food points charged per point of damage absorbed, at the lowest level. |
| `hungerPerDamageReduction` | `0.75` | How much of that food cost is removed across the level range. |
| `cooldownTicksBase` | `22` | Ticks between rolls at the lowest level. 20 ticks = 1 second. |
| `cooldownTicksFactor` | `12` | Ticks removed from the roll cooldown at max level. |
| `maxVerticalVelocityForRollInput` | `-0.08` | You must be falling at least this fast for a crouch to arm a roll. |
| `proneTicksBase` | `4` | Ticks you stay prone after a roll at the lowest level. |
| `proneTicksFactor` | `5` | Extra prone ticks at max level. |
| `xpPerDamagePrevented` | `4.2` | Skill XP paid per point of fall damage absorbed. |

### Slipstream Slide (`agility-slipstream-slide`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/agility/agility-slipstream-slide-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/agility/agility-slipstream-slide-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

4 levels · 4 knowledge, then 3 per level

Sprint, then tap sneak, to drop prone and carry momentum with reduced ground friction. A sprint that ended within the last 350 ms still counts.

Personal controls: Slide control (Tap sneak/Hold sneak); Maximum slide duration (full/half/quarter).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `slideForceBase` | `0.5` | Horizontal slide velocity in blocks per tick before level scaling. |
| `slideForceFactor` | `0.45` | Extra slide velocity in blocks per tick at max level. |
| `cooldownMillisBase` | `4000` | Milliseconds between slides before level scaling. |
| `cooldownMillisReduction` | `2500` | Milliseconds removed from that cooldown at max level. |
| `cooldownMillisFloor` | `1300` | Shortest cooldown allowed after all reductions, in milliseconds. |
| `slideTicksBase` | `14` | Ticks the prone slide pose lasts before level scaling. |
| `slideTicksFactor` | `10` | Extra prone ticks granted at max level. |
| `slideFrictionReduction` | `0.9` | Fraction of ground friction removed while sliding, 0-1. |
| `hungerCost` | `1.8` | Saturation, then food points, charged per slide. |
| `slowAmplifier` | `1` | Slowness amplifier applied to mobs you slide through at max level. |
| `slowDurationTicks` | `40` | Duration in ticks of that max-level slow. |
| `xpPerSlide` | `3` | Skill XP paid per successful slide. |

### Air Dash (`agility-air-dash`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/agility/agility-air-dash-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/agility/agility-air-dash-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

4 levels · 5 knowledge, then 3 per level

A sprint-jump arms a dash along look direction. Left-click empty air to spend a charge. Landing rearms it. Flight, glide, swim, climb, riding, an empty food bar, or already being on the ground blocks it.

Personal controls: Dash trigger (Left click/While sneaking/Empty hand); Dash speed (full/half/quarter).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `dashForceBase` | `0.85` | Dash velocity in blocks per tick before level scaling. |
| `dashForceFactor` | `0.6` | Extra dash velocity in blocks per tick at max level. |
| `upwardLift` | `0.12` | Upward velocity added on a dash so you keep airtime. |
| `maxLevelCharges` | `2` | Dashes available per sprint-jump at max level. |
| `debounceMillis` | `250` | Minimum milliseconds between dash inputs, to swallow double clicks. |
| `hungerCost` | `2` | Saturation, then food points, charged per dash. |
| `xpPerDash` | `3` | Skill XP paid per successful dash. |

### Cat Reflexes (`agility-cat-reflexes`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/agility/agility-cat-reflexes-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/agility/agility-cat-reflexes-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge, then 3 per level

While sprinting, an incoming projectile can miss, cancelling the hit and applying a sideways nudge.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `dodgeChanceBase` | `0.08` | Chance to dodge a projectile while sprinting before level scaling, 0-1. |
| `dodgeChanceFactor` | `0.3` | Extra dodge chance granted at max level. |
| `maxDodgeChance` | `0.35` | Hard cap on dodge chance regardless of level. |
| `xpPerDodge` | `4` | Skill XP paid per dodged projectile. |

### Featherfoot (`agility-featherfoot`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/agility/agility-featherfoot-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/agility/agility-featherfoot-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

4 levels · 1 knowledge

Configured surfaces skip trampling, pressure-plate triggers, berry slow and damage, or powder-snow freeze. A surface whose minimum level is above `maxLevel` stays unreachable until one of those values changes.

Personal controls: Farmland protection (on/off); Pressure plate protection (on/off); Berry protection (on/off); Powder snow protection (on/off).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `requireSprint` | `true` | When true, none of the protections apply unless you are sprinting. |
| `farmlandEnabled` | `true` | Turns the farmland protection off entirely when false. |
| `farmlandMinLevel` | `1` | Level at which farmland stops being trampled. |
| `farmlandMaterials` | `["FARMLAND"]` | Blocks covered by the trample protection. |
| `pressurePlateEnabled` | `true` | Turns the pressure-plate protection off entirely when false. |
| `pressurePlateMinLevel` | `2` | Level at which pressure plates stop triggering under you. |
| `pressurePlateUseVanillaTag` | `true` | Also covers every block in the vanilla pressure plate tag. |
| `pressurePlateMaterials` | `[]` | Extra blocks treated as pressure plates. |
| `berryBushEnabled` | `true` | Turns the sweet-berry protection off entirely when false. |
| `berryBushMinLevel` | `3` | Level at which sweet-berry slowdown and contact damage are ignored. |
| `berryBushMaterials` | `["SWEET_BERRY_BUSH"]` | Blocks whose slowdown and contact damage are ignored. |
| `powderSnowEnabled` | `true` | Turns the powder-snow protection off entirely when false. |
| `powderSnowMinLevel` | `4` | Level at which powder-snow freezing is cleared on contact. |
| `powderSnowMaterials` | `["POWDER_SNOW"]` | Blocks whose freezing effect is cleared. |

### Vault (`agility-vault`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/agility/agility-vault-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/agility/agility-vault-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

1 level · 4 knowledge

While grounded, a fence in the path pre-arms a jump high enough to land on top. The vault effect does not scale if `maxLevel` is raised.

Personal controls: Vault trigger (Any jump/While sprinting/While sneaking).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `jumpHeight` | `1.75` | Jump apex in blocks when clearing a fence. Values below the built-in minimum are clamped up. |
| `xpPerVault` | `3` | Skill XP paid per successful vault. |

### Marathoner (`agility-marathoner`)

5 levels · 3 knowledge, then 2 per level

Sprint and sprint-jump exhaustion is reduced. Walking, attacks, and swimming keep their normal exhaustion. Movement speed is unchanged.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `drainReductionBase` | `0.15` | Fraction of sprint exhaustion removed before level scaling, 0-1. |
| `drainReductionFactor` | `0.45` | Extra fraction removed at max level. |
| `maxDrainReduction` | `0.6` | Hard cap on the removed fraction regardless of level. |
| `xpPerSaturationSaved` | `0.6` | Skill XP paid per unit of exhaustion saved. |

### Kip-Up (`agility-kip-up`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/agility/agility-kip-up-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/agility/agility-kip-up-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

4 levels · 4 knowledge, then 3 per level

After a hit from another entity, a jump inside the recovery window launches along current steering, or along look direction if there was no movement.

Personal controls: Recovery speed burst (on/off).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `recoveryWindowMillisBase` | `350` | Milliseconds after a hit during which a jump counts as a recovery, before level scaling. |
| `recoveryWindowMillisFactor` | `550` | Extra milliseconds of recovery window at max level. |
| `speedAmplifierBase` | `0` | Speed effect amplifier granted on a recovery before level scaling. |
| `speedAmplifierFactor` | `1.6` | Extra amplifier granted at max level. |
| `speedDurationTicks` | `40` | Duration in ticks of the recovery speed burst. |
| `recoverySpeed` | `0.5` | Horizontal velocity applied toward your intended direction on recovery. |
| `jumpVelocityThreshold` | `0.2` | Minimum upward velocity treated as a jump when checking for a recovery. |
| `cooldownMillis` | `3000` | Milliseconds between recoveries. |
| `xpPerRecovery` | `5` | Skill XP paid per successful recovery. |

## Reference

### Skill configuration defaults

Written to `plugins/Adapt/skills/agility.toml` on first load.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `enabled` | `true` | Turns the whole Agility line off when false. |
| `skillColor` | `"&a"` | Legacy ampersand color code used for Agility in menus and text. |
| `challengeMove1kReward` | `500` | Skill XP paid for completing `challenge_move_1k`. |
| `challengeSprint5kReward` | `2000` | Skill XP paid for `challenge_sprint_dist_5k`, the two swim challenges, the two fly challenges, and the two sneak challenges. The larger tier of each pair pays double this. |
| `challengeSprintMarathonReward` | `6500` | Skill XP paid for `challenge_sprint_marathon`. |
| `sprintXpPassive` | `0.35` | Skill XP per pulse while sprinting, scaled by elapsed time. |
| `swimXpPassive` | `0.4` | Skill XP per pulse while swimming, scaled by elapsed time. |
| `jumpXpPassive` | `0.15` | Skill XP per pulse while off the ground, scaled by elapsed time. |
| `climbXpPassive` | `0.4` | Skill XP per pulse while climbing, scaled by elapsed time. |
| `moveXpPassive` | `0.05` | Skill XP per block travelled, paid on every movement. |

### Challenges

| Challenge | Threshold | Reward knob |
|---|---|---|
| `challenge_move_1k` | 1000 | `challengeMove1kReward` |
| `challenge_sprint_marathon` | 42195 | `challengeSprintMarathonReward` |
| `challenge_sprint_dist_5k` | 5000 | `challengeSprint5kReward` |
| `challenge_sprint_dist_50k` | 50000 | `challengeSprint5kReward` x 2 |
| `challenge_agility_swim_1k` | 1000 | `challengeSprint5kReward` |
| `challenge_agility_swim_10k` | 10000 | `challengeSprint5kReward` x 2 |
| `challenge_fly_1k` | 1000 | `challengeSprint5kReward` |
| `challenge_fly_10k` | 10000 | `challengeSprint5kReward` x 2 |
| `challenge_agility_sneak_500` | 500 | `challengeSprint5kReward` |
| `challenge_agility_sneak_5k` | 5000 | `challengeSprint5kReward` x 2 |

## See also

Catalog: [Skills](/adapt/10-skills-catalog). Rules: [Concepts](/adapt/02-concepts).
