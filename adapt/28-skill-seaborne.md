---
title: "Skill - Seaborne"
description: "Seaborne XP sources, adaptations, controls, and configuration"
published: true
date: 2026-09-30T21:59:53.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Seaborne gains XP from swimming, fishing, reeling in a non-fish entity, underwater block breaks, drowned damage, and trident damage, and pays none for killing a drowned, guardian, or elder guardian. Its 14 adaptations add air, swim speed, underwater vision and mining, damage protection, escape tools, wreck salvage, coral growth, aquatic allies, trident upgrades, and burst movement.

## Adaptations

Every adaptation has an Enabled control at the bottom of its level screen. Personal choices are saved per player; the server can lock controls and restrict choices. Full, half and quarter settings only reduce the earned server value. Defaults retain ordinary behavior unless a shared gesture needs one adaptation to take priority.

### Organic Oxygen Tank (`seaborne-oxygen`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/seaborne/seaborne-oxygen-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/seaborne/seaborne-oxygen-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 5 knowledge, then 3 per level

Passive oxygen bonus is `level * airPerLevelTics / 75`, clamped to 1, and 1 is a bonus of 1024.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `airPerLevelTics` | `15` | Air ticks saved per level out of a 75 tick drowning pulse. The resulting fraction becomes the oxygen bonus attribute. |

### Dolphin's Grace (`seaborne-speed`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/seaborne/seaborne-speed-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/seaborne/seaborne-speed-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

7 levels · 2 knowledge, then 3 per level

Water movement efficiency is `level / maxLevel`, capped at 1, and sprint-swimming also applies Dolphin's Grace for `20 + round(levelPercent * 60)` ticks. Depth Strider boots force the adaptation inactive.

### Fisher's Fantasy (`seaborne-fishers-fantasy`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/seaborne/seaborne-fishers-fantasy-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/seaborne/seaborne-fishers-fantasy-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

7 levels · 2 knowledge, then 5 per level

Each committed fish catch makes one roll, with chance interpolated from `bonusChanceAtLevelOne` to `bonusChanceAtMaxLevel`. A success drops one extra random fishing item and vanilla XP of `min(maximumVanillaXpPerCatch, vanillaXpAtLevelOne + (level - 1) * vanillaXpPerAdditionalLevel)`.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `bonusChanceAtLevelOne` | `0.1` | Bonus-bundle chance at adaptation level one. |
| `bonusChanceAtMaxLevel` | `0.35` | Bonus-bundle chance at maximum adaptation level. |
| `vanillaXpAtLevelOne` | `2` | Vanilla XP points granted at adaptation level one. |
| `vanillaXpPerAdditionalLevel` | `1` | XP points added for every level after level one. |
| `maximumVanillaXpPerCatch` | `16` | Hard cap on one catch reward. |
| `skillXpOnSuccess` | `8` | Seaborne skill XP granted after a successful roll. |
| `cooldownMillis` | `5000` | Minimum milliseconds between successful reward bundles. |

### Turtle's Vision (`seaborne-turtles-vision`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/seaborne/seaborne-turtles-vision-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/seaborne/seaborne-turtles-vision-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

1 level · 3 knowledge

Night Vision stays on while the player is in water and is removed on surfacing only when it is this adaptation's own effect: non-ambient, particle-free, and amplifier 0. A Night Vision potion from another source is left in place.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `nightVisionDurationTicks` | `600` | Duration of the hidden-particle Night Vision refresh, clamped from 20 to 6000 ticks. |
| `nightVisionRefreshThresholdTicks` | `500` | Remaining duration at which Adapt reapplies its effect, clamped below the configured duration. |
| `refreshIntervalMillis` | `3000` | Underwater-state check interval, clamped from 250 to 10000 ms and applied immediately on hot reload. |

### Turtle Miner (`seaborne-turtles-mining-speed`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/seaborne/seaborne-turtles-mining-speed-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/seaborne/seaborne-turtles-mining-speed-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

1 level · 3 knowledge

In water, submerged mining speed is raised and stacks with Aqua Affinity; it is an attribute, not Haste, and it does not require Water Breathing. Off the ground, a separate break-speed modifier covers the airborne penalty, and both modifiers clear on surfacing.

Personal controls: Compensate floating penalty (on/off).

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `underwaterMiningSpeedMultiplier` | `1.4` | Effective submerged-mining multiplier, clamped from 1 to 10. |
| `compensateFloatingPenalty` | `true` | Also counter vanilla's separate airborne mining penalty while floating underwater. |
| `floatingMiningSpeedMultiplier` | `5.0` | Effective floating compensation multiplier, clamped from 1 to 10. Five cancels vanilla's one-fifth penalty. |
| `attributeDurationTicks` | `160` | Duration of each refreshed modifier, clamped from 20 to 1200 ticks. |
| `refreshIntervalMillis` | `3000` | Passive state-refresh interval, clamped from 250 to 10000 ms and applied immediately on hot reload. |

### Tidecaller (`seaborne-tidecaller`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/seaborne/seaborne-tidecaller-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/seaborne/seaborne-tidecaller-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge

Dash cooldown is displayed on the heart of the sea. Water means the player is in water, swimming, or has feet or eyes in liquid; rain means a storm with open sky above the player.

Personal controls: Sneak trigger (on/off); Attack trigger (on/off); Sneak required for attacks (on/off); Water required for attacks (on/off); Water dashes (on/off); Rain dashes (on/off); Horizontal direction (on/off). Hydro Jet’s Shared sneak priority decides which adaptation receives overlapping sneak input. Attack input is independent. Server requirements for sneak, water and horizontal direction still apply.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `dashDistanceBase` | `6` | Dash distance in blocks before level scaling. |
| `dashDistanceFactor` | `8` | Extra dash blocks added at max level. |
| `cooldownTicksBase` | `140` | Cooldown in server ticks before level scaling (20 ticks = 1 second). |
| `cooldownTicksFactor` | `80` | Cooldown ticks removed at max level. The result floors at 20 ticks. |
| `xpPerBurst` | `11` | Skill XP granted per successful dash. |
| `allowRainTrigger` | `true` | Allows dashing while exposed to a storm. |
| `allowWaterTrigger` | `true` | Allows dashing while in a water state. |
| `enableSneakTrigger` | `true` | Enables the sneak trigger. |
| `enableAttackTrigger` | `true` | Enables the arm swing trigger, with any item or empty hand. |
| `attackTriggerRequiresSneak` | `false` | When true the arm swing trigger only fires while sneaking. |
| `attackTriggerWaterOnly` | `true` | When true the arm swing trigger only fires in a water state, even if rain triggers are allowed. |
| `useVelocityDash` | `true` | True applies a velocity burst. False teleports to the farthest safe point along the look vector. |
| `flattenVelocityDashDirection` | `false` | True zeroes the pitch so the dash stays horizontal. |
| `velocityStrengthBase` | `1.05` | Forward velocity magnitude before level scaling. |
| `velocityStrengthFactor` | `0.85` | Extra forward velocity magnitude at max level. |
| `velocityVerticalBase` | `0.01` | Vertical velocity added before level scaling. |
| `velocityVerticalFactor` | `0.05` | Extra vertical velocity added at max level. |
| `velocityAdditive` | `true` | True adds the dash on top of current velocity. False sets a fresh vector. |
| `maxResultingVelocity` | `2.25` | Hard cap on the resulting velocity magnitude. |
| `blockDashWhenWallAhead` | `true` | Cancels the dash and fizzles when a ray trace finds a solid block ahead. |
| `wallCheckDistance` | `1.2` | Ray trace distance in blocks used for the wall check. |
| `applyForwardMomentumAfterDash` | `true` | Applies momentum after a teleport dash. Ignored when `useVelocityDash` is true. |
| `forwardMomentum` | `1.05` | Horizontal velocity magnitude applied after a teleport dash. |
| `verticalMomentum` | `0.02` | Vertical velocity added, or set, after a teleport dash. |
| `replaceVerticalMomentum` | `false` | True replaces current vertical velocity with `verticalMomentum` instead of adding it. |
| `preserveSwimmingAfterDash` | `true` | Re-applies the swimming pose after a dash when the player was swimming and is still in water. |

### Pressure Diver (`seaborne-pressure-diver`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/seaborne/seaborne-pressure-diver-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/seaborne/seaborne-pressure-diver-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

4 levels · 4 knowledge

Depth is sea level minus eye height. Crossing the depth threshold grants Resistance and a max-absorption pool that fills once per dive and grows only when the adaptation level rises; surfacing removes only that pool, the deep threshold raises Resistance to amplifier 1, Water Breathing is not granted, and Mining Fatigue is only partly offset because Aqua Affinity and Turtle Miner still cover the ordinary underwater and floating penalties.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `depthThresholdBase` | `10` | Blocks below sea level required for the buff, before level scaling. |
| `depthThresholdFactor` | `6` | Blocks removed from the depth requirement at max level. Floors at 2. |
| `deepThresholdBase` | `18` | Blocks below sea level required for the stronger Resistance tier, before level scaling. |
| `deepThresholdFactor` | `8` | Blocks removed from the deep tier requirement at max level. Floors at 4. |
| `damageReductionBase` | `0.12` | Damage reduction while deep, as a fraction 0-1, before level scaling. |
| `damageReductionFactor` | `0.26` | Extra damage reduction fraction gained at max level. |
| `maxDamageReduction` | `0.45` | Hard cap on the damage reduction fraction, 0-1. |
| `absorptionHealthBase` | `4` | Absorption health points granted at level 1. Two health points display as one heart. |
| `absorptionHealthFactor` | `8` | Additional absorption health points granted at level 4, for 12 points or six hearts total by default. |
| `fatigueTrimChanceBase` | `0.2` | Chance term, 0-1, feeding the fatigue cancellation math, before level scaling. |
| `fatigueTrimChanceFactor` | `0.45` | Extra chance term gained at max level. Total is clamped to 1. |
| `fatigueTrimAmountBase` | `1` | Mining Fatigue amplifier steps represented by each conceptual trim proc, before level scaling. |
| `fatigueTrimAmountFactor` | `1` | Extra amplifier steps per conceptual trim proc at max level. |
| `effectTicks` | `60` | Duration in ticks of each Resistance refresh, clamped from 20 to 1200, and the basis for the refresh cadence. |
| `fatigueCounterDurationTicks` | `80` | Maximum ticks the mining-speed counter lasts, clamped to the remaining Mining Fatigue duration and from 20 to 1200. Zero disables it. |
| `xpPerDepthPulse` | `6` | Skill XP granted per depth pulse. |
| `xpPulseCooldownMillis` | `3000` | Milliseconds between depth XP pulses. |

### Coral Gardener (`seaborne-coral-gardener`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/seaborne/seaborne-coral-gardener-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/seaborne/seaborne-coral-gardener-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 3 knowledge, then 4 per level

Placed coral is kept from fading out of water, up to 8192 tracked blocks with expired entries dropped first; only blocks tagged `CORAL_BLOCKS`, `CORALS`, or `WALL_CORALS` get that protection and count toward the stat, while prismarine, prismarine bricks, dark prismarine, sea lanterns, sponge, and wet sponge pay placement XP only. Bone meal on live coral can place tube, brain, bubble, fire, or horn coral in an adjacent water cell; Creative mode spends no bone meal, and a denied placement spends none.

Personal controls: Preserve placed coral (on/off); Bonemeal coral growth (on/off).

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `survivalSecondsBase` | `60` | Seconds placed coral is protected from fading, before level scaling. |
| `survivalSecondsFactor` | `240` | Extra protected seconds gained at max level. |
| `growthChanceBase` | `0.35` | Chance per bone meal click that growth is attempted, 0-1, before level scaling. |
| `growthChanceFactor` | `0.5` | Extra growth chance gained at max level. Total is clamped to 1. |
| `reefPlaceXp` | `8` | Skill XP granted per reef block placed. |
| `growthXp` | `14` | Skill XP granted per coral block grown with bone meal. |

### Deep Salvager (`seaborne-deep-salvager`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/seaborne/seaborne-deep-salvager-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/seaborne/seaborne-deep-salvager-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

4 levels · 4 knowledge

While the player is in water, at most 6 chests, trapped chests, or barrels inside the scan radius and within 3 blocks above or below the player are marked for that player only. Opening one while the player is in water and the container touches water on at least one face inserts loot into its current contents once, stamped `seaborne_salvaged`: nautilus shell at weight 2, prismarine shard at weight 3, prismarine crystals at weight 2, plus gold ingot, iron ingot, lapis lazuli, emerald, ink sac, glow ink sac, and tropical fish, in stacks of 1 to 3, or one heart of the sea.

Personal controls: Container outlines (on/off); Outlined containers (All treasure containers/Chests only/Barrels only); Outline color (Aqua/Gold/Purple). Container filters and colors affect private detection outlines; earned treasure rewards remain available for all eligible containers.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `detectionRangeBase` | `4` | Shimmer scan radius in blocks, before level scaling. |
| `detectionRangeFactor` | `5` | Extra scan radius gained at max level. The result is capped at 9 blocks. |
| `bonusRollsBase` | `1` | Bonus treasure rolls per container, before level scaling. |
| `bonusRollsFactor` | `3` | Extra treasure rolls gained at max level. Minimum is 1 roll. |
| `salvageXp` | `12` | Skill XP granted per bonus item that fit in the container. |
| `shimmerScanCooldownMillis` | `3000` | Milliseconds between shimmer scans per player, and the basis for how long a shimmer stays visible. |
| `enableShimmer` | `true` | Set to false to disable shimmer scanning while keeping the bonus loot. |

### Ink Veil (`seaborne-ink-veil`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/seaborne/seaborne-ink-veil-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/seaborne/seaborne-ink-veil-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge

Damage taken in water releases an ink cloud and blinds nearby monsters. That damage is not cancelled or reduced, and the player is not made invisible.

Personal controls: Own ink density (full/half/quarter). Own ink density changes only your cloud particles. Other viewers receive the ordinary cloud; blindness and concealment are unchanged.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `cloudSizeBase` | `4` | Cloud radius in blocks, before level scaling. The final radius is clamped from 0.5 to 16. |
| `cloudSizeFactor` | `4` | Extra cloud radius gained at max level. The final radius is clamped from 0.5 to 16. |
| `cooldownMillisBase` | `12000` | Milliseconds between bursts, before level scaling. The final cooldown is clamped from 3000 to 3600000 ms. |
| `cooldownMillisReduction` | `8000` | Milliseconds removed from the cooldown at max level. The final cooldown is clamped from 3000 to 3600000 ms. |
| `concealmentTicksBase` | `40` | Drowned/guardian anti-target duration in ticks, before level scaling. The final duration is clamped from 1 to 1200. |
| `concealmentTicksFactor` | `40` | Extra concealment ticks gained at max level. The final duration is clamped from 1 to 1200. |
| `blindTicksBase` | `60` | Blindness duration in ticks applied to hostiles, before level scaling. The final duration is clamped from 1 to 1200. |
| `blindTicksFactor` | `60` | Extra blindness ticks gained at max level. The final duration is clamped from 1 to 1200. |
| `maxAffectedHostiles` | `24` | Maximum nearby monsters blinded by one burst, clamped from 0 to 128. |
| `cloudVisualTicks` | `10` | Number of ticks over which the visible ink cloud expands, clamped from 1 to 40. |
| `burstXp` | `10` | Skill XP granted per burst. |

### Trident Mastery (`seaborne-trident-mastery`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/seaborne/seaborne-trident-mastery-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/seaborne/seaborne-trident-mastery-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge, then 5 per level

A thrown trident stores the thrower's adaptation level under `seaborne_trident_mastery_level` and keeps that damage bonus after a gear change; a melee hit uses the current level and requires a trident in the main hand. Recall gives up after 120 ticks and stops within 1.6 blocks, and a trident stuck in a block is freed first.

Personal controls: Trident recall (on/off).

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `damageBonusBase` | `0.15` | Bonus trident damage as a fraction of base damage, before level scaling. |
| `damageBonusFactor` | `0.45` | Extra damage fraction gained at max level. |
| `recallSpeedBase` | `0.8` | Velocity magnitude applied to a homing trident, before level scaling. |
| `recallSpeedFactor` | `1.2` | Extra homing velocity gained at max level. |
| `flightGraceTicksBase` | `50` | Ticks a trident flies freely before recall takes over, before level scaling. |
| `flightGraceTicksReduction` | `30` | Grace ticks removed at max level. The result floors at 10 ticks. |
| `recallDelayTicks` | `5` | Ticks after launch before the first recall evaluation. Minimum 2. |
| `enableRecall` | `true` | Set to false to keep the damage bonus without the homing return. |

### Fish Whisperer (`seaborne-fish-whisperer`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/seaborne/seaborne-fish-whisperer-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/seaborne/seaborne-fish-whisperer-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 3 knowledge, then 4 per level

Luck equal to the adaptation level is applied at all times. In water or while swimming, at most 12 fish that are more than a block away are nudged per pulse, and a hit sends at most 8 nearby dolphins and axolotls at the victim.

Personal controls: Attract fish (on/off); Animal combat assistance (on/off); Fishing luck (on/off).

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `schoolRangeBase` | `6` | Radius in blocks that fish are pulled from, before level scaling. |
| `schoolRangeFactor` | `8` | Extra schooling radius gained at max level. |
| `schoolPullBase` | `0.12` | Velocity magnitude of the pull applied to each fish, before level scaling. |
| `schoolPullFactor` | `0.18` | Extra pull magnitude gained at max level. |
| `assistRangeBase` | `8` | Radius in blocks around the victim searched for dolphins and axolotls, before level scaling. |
| `assistRangeFactor` | `8` | Extra assist radius gained at max level. |
| `dolphinChargeStrength` | `0.9` | Velocity magnitude dolphins use to charge the victim. 0 disables the charge motion. |

### Hydro Jet (`seaborne-hydro-jet`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/seaborne/seaborne-hydro-jet-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/seaborne/seaborne-hydro-jet-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 3 knowledge, then 4 per level

A sneak press while sprint-swimming, rather than while only floating in water, launches the player along the look direction, blending 40% of current velocity into the burst and capping the result at 2.6. An empty food bar cancels the jet without spending a charge, and charges refill in fractions of a charge.

Personal controls: Jet gesture (Single sneak/Double sneak); Food reserve (No reserve/Keep 4 food/Keep 8 food); Shared sneak priority (Hydro Jet first/Tidecaller first). Double sneak means two presses within 350 ms. Hydro Jet wins shared sneak input by default while swimming; choose Tidecaller first to reserve that gesture for an enabled, learned Tidecaller in its permitted environment. The selected winner keeps the gesture even while recharging.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `burstForceBase` | `0.9` | Velocity magnitude of the burst, before level scaling. |
| `burstForceFactor` | `0.9` | Extra burst magnitude gained at max level. |
| `maxChargesBase` | `2` | Stored charges, before level scaling. |
| `maxChargesFactor` | `3` | Extra stored charges gained at max level. Minimum is 1. |
| `chargeRegenMillis` | `2500` | Milliseconds to regenerate one charge. 0 or less refills instantly. |
| `hungerCost` | `2.0` | Exhaustion added per jet. |
| `jetXp` | `6` | Skill XP granted per jet. |

### Brine Skin (`seaborne-brine-skin`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/seaborne/seaborne-brine-skin-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/seaborne/seaborne-brine-skin-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 3 knowledge

In water, while swimming, or under open sky in a storm, Regeneration is applied at amplifier `floor(levelPercent * 3)`, capped at 2 (Regeneration III), and incoming damage is reduced. Both effects last through the linger after that wet state ends.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `damageReductionBase` | `0.06` | Damage reduction while wet as a fraction 0-1, before level scaling. |
| `damageReductionFactor` | `0.14` | Extra damage reduction fraction gained at max level. |
| `maxDamageReduction` | `0.25` | Hard cap on the damage reduction fraction, 0-1. |
| `lingerSecondsBase` | `3` | Seconds the wet state persists after leaving water, before level scaling. |
| `lingerSecondsFactor` | `4` | Extra linger seconds gained at max level. |

## Reference

### Skill XP sources

| Trigger | Award | Notes |
|---------|-------|-------|
| Passive swim pulse (every `2120` ms) | `swimXP` scaled by elapsed time over the interval | With Water Breathing or Conduit Power you must have moved in water within the last `2500` ms and the award is multiplied by `1 + waterBreathingSwimXpBonusMultiplier`. Without either effect you must be in water or swimming with air below maximum. |
| `CAUGHT_FISH` | `fishCaughtXp` | Rate-limited by `fishXpCooldown`. The `seaborne.fish.caught` stat is added before the rate limit, so the stat always counts. |
| `CAUGHT_ENTITY` | `entityCaughtXp` | Rate-limited by `fishXpCooldown`. |
| Breaking a block while in water or swimming | `10` for a sea pickle broken while swimming with air below maximum, otherwise `3` | Rate-limited by `seaPickleCooldown`, which gates all underwater block XP, not only sea pickles. |
| Damaging a drowned | `damagedrownxpmultiplier` times the damage dealt, capped at the victim's base max health | Rate-limited by `drownedDamageXpCooldown`. |
| Damaging with a trident, thrown or held in the main hand | `tridentxpmultiplier` times the damage dealt, capped at the victim's base max health | Rate-limited by `tridentDamageXpCooldown`. |
| Killing a drowned, guardian, or elder guardian | No XP | Adds the kill stat and plays effects only. |

### Skill configuration defaults

Written to `plugins/Adapt/skills/seaborne.toml` on first load.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `seaPickleCooldown` | `60000` | Milliseconds between underwater block-break XP awards and `seaborne.underwater.blocks` stat increments, per player. |
| `drownedDamageXpCooldown` | `1500` | Milliseconds between XP awards for damaging drowned. |
| `tridentDamageXpCooldown` | `1500` | Milliseconds between XP awards for trident damage. |
| `fishCaughtXp` | `250` | XP for reeling in a fish. |
| `entityCaughtXp` | `10` | XP for reeling in an entity instead of a fish. |
| `fishXpCooldown` | `5000` | Milliseconds between fishing XP awards. |
| `tridentxpmultiplier` | `4.0` | Multiplier applied to trident damage when converting it to XP. |
| `damagedrownxpmultiplier` | `3` | Multiplier applied to damage dealt to drowned when converting it to XP. |
| `enabled` | `true` | Set to false to disable the whole skill. |
| `skillColor` | `"&9"` | Legacy ampersand color code used for this skill in menus and text. |
| `challengeSwim1nmReward` | `750` | XP paid for `challenge_swim_1nm`, and also for the first tier of the fish, drowned, guardian, and underwater-block challenges. Their second tiers pay double this value. |
| `challengeSwim5kReward` | `1500` | XP paid for `challenge_swim_5k`. |
| `challengeSwim20kReward` | `3750` | XP paid for `challenge_swim_20k`. |
| `swimXP` | `0.4` | Base passive swim XP per interval, before cadence scaling and the Water Breathing bonus. |
| `waterBreathingSwimXpBonusMultiplier` | `1.0` | Extra passive swim XP multiplier while moving in water with Water Breathing or Conduit Power. `1.0` doubles the award, `0` disables the bonus. |

### Challenges

| Challenge | Threshold | Reward knob |
|---|---|---|
| `challenge_swim_1nm` | 1852 | `challengeSwim1nmReward` |
| `challenge_swim_5k` | 5000 | `challengeSwim5kReward` |
| `challenge_swim_20k` | 20000 | `challengeSwim20kReward` |
| `challenge_fish_25` | 25 | `challengeSwim1nmReward` |
| `challenge_fish_250` | 250 | `challengeSwim1nmReward` x2 |
| `challenge_drowned_25` | 25 | `challengeSwim1nmReward` |
| `challenge_drowned_250` | 250 | `challengeSwim1nmReward` x2 |
| `challenge_guardian_10` | 10 | `challengeSwim1nmReward` |
| `challenge_guardian_100` | 100 | `challengeSwim1nmReward` x2 |
| `challenge_underwater_blocks_100` | 100 | `challengeSwim1nmReward` |
| `challenge_underwater_blocks_1k` | 1000 | `challengeSwim1nmReward` x2 |

## See also

Catalog: [Skills](/adapt/10-skills-catalog). Rules: [Concepts](/adapt/02-concepts).
