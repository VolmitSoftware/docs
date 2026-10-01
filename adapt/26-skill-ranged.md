---
title: "Skill - Ranged"
description: "Ranged XP sources, adaptations, controls, and configuration"
published: true
date: 2026-10-01T09:06:18.722Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Ranged gains XP from firing arrows, spectral arrows, or tridents and from projectile hits, with distance and damage increasing hit XP. Its 12 adaptations change projectile speed, damage, piercing, recovery, and ricochets, and add trajectory preview, item retrieval, snares, slows, lifts, and guided shots.

## Earning XP

Firing an arrow, spectral arrow, or trident pays flat XP and counts a shot. A projectile hit on a valid target pays XP from damage dealt plus distance traveled. Snowballs and fishing hooks do not count as hits. Shots and hits share one cooldown. Hits over 30 blocks count as longshots and use their own challenge chain. A kill counts when a bow or crossbow is in hand as the target dies. In addition, Ricochet Bolt pays per bounce, Fetch Shot pays per item, Floaters and Pinning Shot pay per proc, and Heartseeker pays per seeking shot and per hit.

## Player preferences

Every adaptation has an enable switch in the bottom settings row of its level screen. Server policy controls which choices are available; settings change only your player profile. Defaults preserve the standard behavior.

| Adaptation | Personal controls |
| --- | --- |
| Force Shot, Arrow Piercing, Heavy Draw | Restrict enhanced shots to all supported projectiles, bow arrows, crossbow arrows, arrows, tridents, or other thrown projectiles. Unsupported categories have no effect. |
| Fetch Shot | Require sneaking at launch; collect all permitted drops, blocks, food, or valuable minerals. |
| Floaters | Require sneaking at launch; target all permitted entities, hostile mobs, or non-player entities. |
| Heartseeker | Require sneaking to lock; restrict targets, ignore passive mobs, and toggle the private target glow. |
| Lunge Shot | Require sneaking at launch. |
| Pinning Shot | Require sneaking at launch; toggle the optional velocity dampening. The pin duration remains unchanged. |
| Ricochet Bolt | Select projectile categories; restrict the server's optional non-arrow ricochets. |
| Trajectory Sight | Preview while drawing, while sneaking, or either; toggle target glow, trajectory trail, and impact markers independently. |
| Web Snare | Require sneaking before throwing a crafted snare. |

Arrow Recovery has the enable switch. Heavy Draw's launch-speed penalty and damage bonus stay coupled for a shot already in flight. Trajectory Sight follows the player's active Force Shot, Ricochet Bolt, and Heartseeker preferences. Valuable-mineral collection includes ores, raw metals, ingots, diamond, emerald, coal, redstone, and lapis.

## Adaptations

Projectile changes do not apply to Heartseeker seeking arrows. Those shots use their own flight and damage.

### Force Shot (`ranged-force`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/ranged/ranged-force-pov.webm" muted loop playsinline controls preload="none"></video>
<video src="/adapt-assets/demos/ranged/ranged-force-observer.webm" muted loop playsinline controls preload="none"></video>
</div>

7 levels · 5 knowledge, then 2 per level

Launch speed is multiplied by `1 + (levelPercent * speedFactor)`. Each hit pays 5 Ranged XP, and the first hit past 30 blocks of ground distance grants the Long Shot advancement.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `speedFactor` | `1.135` | Extra launch speed at max level, as a fraction of the normal velocity. |
| `challengeRewardLongShotReward` | `2000` | One-time XP granted with the Long Shot advancement. |

### Arrow Piercing (`ranged-piercing`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/ranged/ranged-piercing-pov.webm" muted loop playsinline controls preload="none"></video>
<video src="/adapt-assets/demos/ranged/ranged-piercing-observer.webm" muted loop playsinline controls preload="none"></video>
</div>

5 levels · 8 knowledge, then 3 per level

Arrows gain pierce levels equal to the adaptation level, applied once at launch, and each launch pays 5 Ranged XP. `ranged.piercing.extra-hits` counts only the second and later hits of an arrow.

### Arrow Recovery (`ranged-recovery`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/ranged/ranged-recovery-pov.webm" muted loop playsinline controls preload="none"></video>
<video src="/adapt-assets/demos/ranged/ranged-recovery-observer.webm" muted loop playsinline controls preload="none"></video>
</div>

8 levels · 5 knowledge

An arrow fired from a bow without Infinity, on hitting a living target, can return an arrow to the inventory, or to the feet if the inventory is full.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `hitChance` | `[10, 20, 30, 40, 50, 60, 70, 80]` | Recovery chance per level, in percent. Entry index is the level, clamped to the last entry. |

### Lunge Shot (`ranged-lunge-shot`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/ranged/ranged-lunge-shot-pov.webm" muted loop playsinline controls preload="none"></video>
<video src="/adapt-assets/demos/ranged/ranged-lunge-shot-observer.webm" muted loop playsinline controls preload="none"></video>
</div>

3 levels · 8 knowledge, then 3 per level

Firing an arrow or trident while airborne subtracts the look direction times `levelPercent * factor` from velocity.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `factor` | `0.935` | Recoil speed at max level, in blocks per tick. |

### Web Snare (`ranged-webshot`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/ranged/ranged-webshot-pov.webm" muted loop playsinline controls preload="none"></video>
<video src="/adapt-assets/demos/ranged/ranged-webshot-observer.webm" muted loop playsinline controls preload="none"></video>
</div>

5 levels · 1 knowledge, then 5 per level

Learning it registers a recipe of eight cobwebs around a snowball. The throw places a cobweb above the impact and on its six neighbors for `level * 20` ticks; those webs cannot be broken, exploded, or pushed by pistons, each must pass a block-place check, and webs still present at restart are removed.

### Trajectory Sight (`ranged-trajectory-sight`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/ranged/ranged-trajectory-sight-pov.webm" muted loop playsinline controls preload="none"></video>
<video src="/adapt-assets/demos/ranged/ranged-trajectory-sight-observer.webm" muted loop playsinline controls preload="none"></video>
</div>

5 levels · 4 knowledge

Drawing a bow, or sneaking with a bow, crossbow, trident, snowball, egg, ender pearl, splash potion, lingering potion, or experience bottle in either hand, draws the predicted path; release, an item change, a drop, or standing up ends it. Learned Force Shot and Ricochet Bolt change that preview, a Heartseeker lock shows the seeking curve, and a kill with the preview active is tracked for a challenge.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `segmentsBase` | `18` | Simulation steps in the previewed path before the level bonus. |
| `segmentsFactor` | `26` | Simulation steps added at max level. |
| `velocityBase` | `1.0` | Multiplier on the simulated launch speed before the level bonus. |
| `velocityFactor` | `0.18` | Extra launch speed multiplier at max level. |
| `gravityStep` | `0.05` | Downward speed added per simulation step for arrows and tridents, in blocks per tick. |
| `dragFactor` | `0.99` | Fraction of speed kept per simulation step for arrows and tridents. |
| `lightProjectileDragFactor` | `0.99` | Speed kept per step for snowballs, eggs, and pearls. |
| `heavyProjectileDragFactor` | `0.99` | Speed kept per step for potions and experience bottles. |
| `lightProjectileGravityStep` | `0.03` | Downward speed added per step for snowballs, eggs, and pearls. |
| `heavyProjectileGravityStep` | `0.05` | Downward speed added per step for potions and experience bottles. |
| `crossbowVelocity` | `3.15` | Simulated crossbow launch speed, in blocks per tick. |
| `tridentVelocity` | `2.5` | Simulated trident launch speed, in blocks per tick. |
| `thrownProjectileVelocity` | `1.5` | Simulated launch speed for snowballs, eggs, and pearls. |
| `thrownPotionVelocity` | `0.5` | Simulated launch speed for potions and experience bottles. |
| `heavyProjectilePitchDrop` | `0.12` | Extra downward aim offset applied to heavy thrown previews. |
| `fallbackVelocity` | `1.6` | Simulated launch speed for anything not matched above. |
| `sneakPreviewChargeTicks` | `16` | Bow charge assumed when previewing while sneaking without drawing, in ticks. |
| `particleSize` | `0.18` | Dust size of the preview dots at the viewer. |
| `particleSizePerBlock` | `0.008` | Dust size added per block of distance from the viewer. |
| `maxParticleSize` | `0.55` | Cap on preview dot size. |
| `impactParticleCount` | `2` | Particles drawn at the predicted impact point. |
| `previewPointSpacing` | `0.7` | Distance between preview dots, in blocks. |
| `impactRingRadius` | `0.35` | Radius of the ring drawn where the shot would land, in blocks. |
| `minPreviewDistanceFromEye` | `1.6` | Distance from the eye before preview dots start drawing, in blocks. |
| `previewStartOffset` | `0.55` | Distance forward from the eye where the simulation starts, in blocks. |
| `glowPredictedTarget` | `true` | Highlights the predicted hit entity with a glow only the aiming player sees. |
| `previewRenderIntervalMillis` | `75` | Minimum milliseconds between renders when aim and context have not changed. |
| `activeSessionIntervalMillis` | `100` | Milliseconds between aiming-session refreshes, clamped to 75-100. |
| `previewYawDeltaDegrees` | `1.2` | Yaw change that forces an early recompute, in degrees. |
| `previewPitchDeltaDegrees` | `1.2` | Pitch change that forces an early recompute, in degrees. |
| `previewPositionDeltaSquared` | `0.0125` | Squared movement distance that forces an early recompute. |
| `minimumRenderedSegments` | `8` | Floor on rendered simulation segments. |
| `maxRenderedSegments` | `36` | Cap on rendered simulation segments. |
| `previewHighLoadPercent` | `42` | Ticker load percentage above which segment count is scaled down. |
| `previewHighLoadSegmentScale` | `0.7` | Segment multiplier applied while high-load shedding is active. |

### Floaters (`ranged-floaters`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/ranged/ranged-floaters-pov.webm" muted loop playsinline controls preload="none"></video>
<video src="/adapt-assets/demos/ranged/ranged-floaters-observer.webm" muted loop playsinline controls preload="none"></video>
</div>

6 levels · 4 knowledge

A projectile hit can apply Levitation, using the level and owner stamped on that shot at launch. Protected targets and the shooter's tamed animals are skipped.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `chanceBase` | `0.12` | Levitation chance before the level bonus, 0-1. |
| `chanceFactor` | `0.58` | Levitation chance added at max level, 0-1. |
| `maxChance` | `0.8` | Cap on the levitation chance, 0-1. |
| `durationTicksBase` | `26.0` | Levitation duration before the level bonus, in ticks. |
| `durationTicksFactor` | `110.0` | Levitation ticks added at max level. Applied duration is at least 20 ticks. |
| `maxAmplifier` | `1.0` | Highest Levitation amplifier. Amplifier is `floor(levelPercent * maxAmplifier)`, so Levitation I below max level and Levitation II at max level. |
| `skillXpOnProc` | `8.0` | Ranged XP granted to the shooter each time levitation lands. |

### Pinning Shot (`ranged-pinning-shot`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/ranged/ranged-pinning-shot-pov.webm" muted loop playsinline controls preload="none"></video>
<video src="/adapt-assets/demos/ranged/ranged-pinning-shot-observer.webm" muted loop playsinline controls preload="none"></video>
</div>

6 levels · 4 knowledge

A hit can apply a hardcoded movement-speed modifier of `-min(1.0, 0.15 * (amplifier + 1))`, not a Slowness effect; that 0.15 is separate from `horizontalVelocityFactor`. Protected targets and the shooter's tamed animals are skipped.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `dampenVelocityOnProc` | `true` | When true, the target's horizontal velocity is cut the moment the pin lands. |
| `procChanceBase` | `0.12` | Pin chance before the level bonus, 0-1. |
| `procChanceFactor` | `0.42` | Pin chance added at max level, 0-1. |
| `maxProcChance` | `0.65` | Cap on the pin chance, 0-1. |
| `durationTicksBase` | `30` | Pin duration before the level bonus, in ticks. |
| `durationTicksFactor` | `90` | Pin ticks added at max level. Applied duration is at least 20 ticks. |
| `amplifierBase` | `1` | Slow amplifier before the level bonus. |
| `amplifierFactor` | `2` | Slow amplifier added at max level. |
| `reapplyCooldownMillisBase` | `5000` | Milliseconds before the same target can be pinned again, before the level reduction. |
| `reapplyCooldownMillisFactor` | `2800` | Milliseconds removed from the reapply cooldown at max level. Floor is 1000. |
| `horizontalVelocityFactor` | `0.15` | Multiplier applied to the target's X and Z velocity on the proc. |
| `cleanupThreshold` | `128` | Tracked targets before expired pin timestamps are swept. |
| `entryTtlMillis` | `60000` | Age at which a tracked pin timestamp is dropped during a sweep, in milliseconds. |
| `xpOnProc` | `12` | Ranged XP granted to the shooter each time a pin lands. |

### Ricochet Bolt (`ranged-ricochet-bolt`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/ranged/ranged-ricochet-bolt-pov.webm" muted loop playsinline controls preload="none"></video>
<video src="/adapt-assets/demos/ranged/ranged-ricochet-bolt-observer.webm" muted loop playsinline controls preload="none"></video>
</div>

5 levels · 4 knowledge

A block hit bounces the projectile and adds speed and flat damage on the next hit. XP per bounce is `xpPerRicochet + (count * xpPerRicochetStep)`.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `maxRicochetsBase` | `1` | Bounces allowed before the level bonus. |
| `maxRicochetsFactor` | `3` | Bounces added at max level. Hard cap is 12. |
| `speedBonusPerRicochetBase` | `0.08` | Speed added per bounce before the level bonus, as a fraction. |
| `speedBonusPerRicochetFactor` | `0.27` | Speed per bounce added at max level, as a fraction. |
| `maxSpeedBonusPerRicochet` | `0.4` | Cap on the speed gained per bounce, as a fraction. |
| `damageBonusPerRicochetBase` | `0.55` | Damage added per bounce before the level bonus, in health points (2 = 1 heart). |
| `damageBonusPerRicochetFactor` | `2.55` | Damage per bounce added at max level, in health points. |
| `maxDamageBonusPerRicochet` | `3.65` | Cap on the damage gained per bounce, in health points. |
| `minRicochetVelocitySquared` | `0.09` | Squared impact speed below which a projectile no longer bounces. |
| `minimumLiveVelocitySquared` | `0.0004` | Squared speed below which a bounced projectile is treated as dead. |
| `minimumPostBounceSpeed` | `0.45` | Floor applied to speed after a bounce, in blocks per tick. |
| `spawnOffsetFromSurface` | `0.22` | Distance off the struck face where the bounced projectile respawns, in blocks. |
| `spawnOffsetAlongDirection` | `0.14` | Extra distance along the new heading where it respawns, in blocks. |
| `sparkParticleCount` | `18` | Spark particles emitted at a bounce. |
| `sparkSpread` | `0.18` | Spread of the bounce spark particles, in blocks. |
| `critParticleCount` | `10` | Crit particles emitted at a bounce. |
| `critSpread` | `0.14` | Spread of the bounce crit particles, in blocks. |
| `bouncePitchBase` | `1.35` | Pitch of the anvil bounce sound on the first bounce. |
| `bouncePitchDropPerRicochet` | `0.08` | Pitch removed from the bounce sound per accumulated bounce. |
| `sparkPitchBase` | `1.05` | Pitch of the spark sound on the first bounce. |
| `sparkPitchRaisePerRicochet` | `0.07` | Pitch added to the spark sound per accumulated bounce. |
| `xpPerRicochet` | `6` | Ranged XP granted per bounce. |
| `xpPerRicochetStep` | `2` | Extra XP per bounce already made by that projectile. |
| `applyToAllProjectiles` | `true` | When true, snowballs and eggs bounce as well. Arrows always bounce. |

### Fetch Shot (`ranged-fetch-shot`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/ranged/ranged-fetch-shot-pov.webm" muted loop playsinline controls preload="none"></video>
<video src="/adapt-assets/demos/ranged/ranged-fetch-shot-observer.webm" muted loop playsinline controls preload="none"></video>
</div>

3 levels · 4 knowledge, then 3 per level

A projectile impact moves nearby dropped items into the inventory. Fish hooks and Heartseeker arrows never fetch, and items that do not fit or that the player could not pick up stay on the ground.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `radiusBase` | `1.6` | Fetch radius before the level bonus, in blocks. |
| `radiusFactor` | `2.4` | Fetch radius added at max level, in blocks. |
| `xpPerItemFetched` | `3` | Ranged XP granted per item entity pulled in. |
| `maxCandidatesPerActivation` | `16` | Item entities inspected per impact. Hard cap 32. |
| `maxAffectedPerActivation` | `8` | Item entities transferred per impact. Hard cap 16, and never above the candidate limit. |
| `maxTargetFxPerActivation` | `3` | Successful fetches that get their own trail effect. Hard cap 8. |

### Heavy Draw (`ranged-heavy-draw`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/ranged/ranged-heavy-draw-pov.webm" muted loop playsinline controls preload="none"></video>
<video src="/adapt-assets/demos/ranged/ranged-heavy-draw-observer.webm" muted loop playsinline controls preload="none"></video>
</div>

5 levels · 6 knowledge, then 4 per level

Arrow, trident, snowball, and egg launches interpolate a speed penalty and a damage bonus from the level-1 values to the max-level values. Damage is multiplied by `1 + damageBonus`, and for arrows other than tridents that multiplier is divided by the velocity factor so the slowdown does not cancel the bonus.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `velocityPenaltyStart` | `0.5` | Fraction of launch speed removed at level 1. |
| `velocityPenaltyEnd` | `0.1` | Fraction of launch speed removed at max level. |
| `damageBonusStart` | `0.1` | Damage bonus at level 1, as a fraction of base damage. |
| `damageBonusEnd` | `1.5` | Damage bonus at max level, as a fraction of base damage. |
| `xpPerHeavyHit` | `4` | Ranged XP granted per heavy hit landed. |

### Heartseeker (`ranged-heartseeker`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/ranged/ranged-heartseeker-pov.webm" muted loop playsinline controls preload="none"></video>
<video src="/adapt-assets/demos/ranged/ranged-heartseeker-observer.webm" muted loop playsinline controls preload="none"></video>
</div>

5 levels · 8 knowledge, then 6 per level

Right-clicking to draw a bow that is not on cooldown, while looking at a creature within range, locks it; tridents never seek. Arrow Piercing, or remaining Ricochet Bolt bounces, chains the arrow through the target toward another nearby one, or straight ahead if none is found; a block hit keeps that ricochet's reflection, speed, damage, and payout, and provoked neutral mobs stay excluded when `ignore passiveMobs` is true.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `ignorePassiveMobs` | `false` | Exclude passive and neutral mobs from automatic acquisition, chain targets, and seeking-arrow damage. |
| `lockRange` | `32` | Maximum distance at which drawing a bow can lock a creature, in blocks. |
| `lockTimeoutMillis` | `6000` | Milliseconds a lock stays valid before the shot. |
| `turnDegreesPerTick` | `10` | Maximum degrees the arrow turns toward its target per tick. |
| `lungeTurnDegreesPerTick` | `18` | Maximum degrees per tick during the final approach. |
| `initialArcControlDistance` | `8` | Distance ahead of the shooter used as the control point for the launch arc, in blocks. |
| `initialArcDistance` | `12` | Distance flown before the launch arc hands over to full homing, in blocks. |
| `lungeRadius` | `2.5` | Distance at which the arrow commits to a straight lunge, in blocks. |
| `maxFlightTicksPerPass` | `160` | Maximum ticks one seeking pass may fly before giving up. |
| `reseekRadius` | `12` | Radius searched for the next target after a target is lost or hit, in blocks. |
| `stuckTicks` | `25` | Ticks without closing distance before the arrow retargets or gives up. |
| `trailSpacing` | `0.35` | Distance between trail particles along the flight path, in blocks. |
| `trailCoreSize` | `1.6` | Dust size of the core trail particles. |
| `maxTrailPointsPerUpdate` | `20` | Trail points emitted per steering update. |
| `rayLookahead` | `10` | Distance checked ahead for block avoidance, in blocks. |
| `maxAvoidanceRays` | `4` | Alternate avoidance rays tested after the direct path is blocked. |
| `avoidanceStrength` | `1.15` | Width of the avoidance cone used when the path meets a block. |
| `avoidanceHoldUpdates` | `4` | Steering updates that keep the chosen route around an obstacle. |
| `avoidanceClearChecks` | `2` | Consecutive clear-path checks needed before dropping a remembered route. |
| `targetRefreshMillis` | `50` | Milliseconds between target position snapshots. |
| `maxCandidatesPerReseek` | `24` | Nearby entities inspected during one reseek. |
| `maxCandidateHandoffsPerReseek` | `8` | Candidate snapshot handoffs during one reseek. |
| `maxChainPasses` | `8` | Chained seeking passes inherited from Piercing and Ricochet Bolt. |
| `continuationExitDistance` | `8` | Distance a chained arrow flies past a struck target before it may turn, in blocks. |
| `continuationExitOffset` | `0.35` | Distance beyond the struck target's hitbox where a chained arrow reappears, in blocks. |
| `cooldownTicksStart` | `60` | Bow cooldown after a seeking shot at level 1, in ticks. |
| `cooldownTicksEnd` | `10` | Bow cooldown after a seeking shot at max level, in ticks. |
| `xpPerSeek` | `8` | Ranged XP granted when a seeking shot is admitted. |
| `xpPerHit` | `4` | Ranged XP granted per seeking arrow connection. |

## Reference

### Skill configuration defaults

Written to `plugins/Adapt/skills/ranged.toml` on first load.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `enabled` | `true` | Turns the whole Ranged skill off when false. |
| `skillColor` | `"&2"` | Legacy ampersand color code used for this skill in menus and text. |
| `shootXP` | `5` | XP granted per arrow, spectral arrow, or trident launched. |
| `cooldownDelay` | `1250` | Milliseconds between XP awards from shots and hits. |
| `hitDamageXPMultiplier` | `1.75` | XP granted per point of projectile damage dealt. |
| `hitDistanceXPMultiplier` | `1.2` | XP granted per block of distance between shooter and target on a hit. |
| `challengeRangedReward` | `500` | Base XP reward for the shots-fired challenge chain. |
| `challengeRangedDmgReward` | `500` | Base XP reward for the projectile-damage challenge chain. |
| `challengeRangedDistReward` | `500` | Base XP reward for the hit-distance challenge chain. |
| `challengeRangedKillsReward` | `500` | Base XP reward for the ranged-kills challenge chain. |
| `challengeRangedLongshotReward` | `500` | Base XP reward for the longshot challenge chain. |

### Challenges

| Challenge | Threshold | Reward knob |
|---|---|---|
| `challenge_ranged_100` | 100 | `challengeRangedReward` |
| `challenge_ranged_1k` | 1000 | `challengeRangedReward` x 2 |
| `challenge_ranged_10k` | 10000 | `challengeRangedReward` x 5 |
| `challenge_ranged_dmg_1k` | 1000 | `challengeRangedDmgReward` |
| `challenge_ranged_dmg_10k` | 10000 | `challengeRangedDmgReward` x 3 |
| `challenge_ranged_dist_5k` | 5000 | `challengeRangedDistReward` |
| `challenge_ranged_dist_50k` | 50000 | `challengeRangedDistReward` x 3 |
| `challenge_ranged_kills_50` | 50 | `challengeRangedKillsReward` |
| `challenge_ranged_kills_500` | 500 | `challengeRangedKillsReward` x 3 |
| `challenge_longshot_25` | 25 | `challengeRangedLongshotReward` |
| `challenge_longshot_250` | 250 | `challengeRangedLongshotReward` x 3 |

## See also

Catalog: [Skills](/adapt/10-skills-catalog). Rules: [Concepts](/adapt/02-concepts).
