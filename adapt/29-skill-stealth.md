---
title: "Skill - Stealth"
description: "Stealth XP sources, adaptations, controls, and configuration"
published: true
date: 2026-10-01T16:35:58.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

The core Stealth adaptation checks whether nearby mobs or players can see you, then applies concealment and undetected melee damage. Other adaptations add sneaking speed, item collection, temporary protection, vision, trap detection, recovery, decoys, invisibility, teleporting, and smoke.

## Adaptations

Every adaptation has an Enabled control at the bottom of its level screen. Personal choices are saved per player; the server can lock controls and restrict choices. Full, half and quarter settings only reduce the earned server value. Defaults retain ordinary behavior unless a shared gesture needs one adaptation to take priority.

### Stealth (`stealth-silent-step`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/stealth/stealth-silent-step-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/stealth/stealth-silent-step-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

2 levels · 1 knowledge, then 2 per level

Sneaking conceals you from observers that are not looking at you; invisibility, an active Shadow Decoy, or a Smoke Pellet cloud conceals you regardless of facing. While concealed, current hunters drop you, new targeting is suppressed, and fall damage is removed (`SAFE_FALL_DISTANCE` 1024); an undetected melee hit is a backstab, with a larger multiplier against mobs than against players.

Personal controls: Private threat outlines (on/off); Private detection status (on/off).

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `radiusBase` | `6` | Mob scan radius in blocks, before level scaling. Clamped to 1-16. |
| `radiusFactor` | `8` | Extra mob scan radius gained at max level. |
| `playerDetectionRadiusBase` | `10` | Player scan radius in blocks, before level scaling. Clamped to 1-24. |
| `playerDetectionRadiusFactor` | `14` | Extra player scan radius gained at max level. |
| `dimDurationTicksBase` | `20` | Darkness duration in ticks, before level scaling. The result is floored at a hard minimum of 160 ticks, so this default has no effect. |
| `dimDurationTicksFactor` | `20` | Extra Darkness ticks gained at max level. Also floored out by the 160 tick minimum at these defaults. |
| `dimAmplifier` | `0` | Amplifier of the Darkness effect applied while undetected. |
| `mobBackstabBase` | `1.5` | Damage multiplier against mobs, before level scaling. |
| `mobBackstabFactor` | `0.5` | Extra damage multiplier against mobs at max level. |
| `playerBackstabBase` | `1.25` | Damage multiplier against players, before level scaling. |
| `playerBackstabFactor` | `0.35` | Extra damage multiplier against players at max level. |
| `xpPerTargetDrop` | `2` | Skill XP per mob that dropped you as its target during a scan. |
| `xpPerBonusDamage` | `3.0` | Skill XP per point of final backstab damage. |
| `showThreatGlows` | `true` | Shows per-viewer glowing on nearby threats while sneaking. Red means can detect, gray means almost. |
| `almostLookDotMargin` | `0.2` | How far below the detection threshold still counts as an almost-detect. Clamped to 0-2. |
| `detectionLookDotThreshold` | `0.2` | Dot product of the observer's look vector toward you at or above which the observer detects you. Clamped to -1 to 1. |
| `allMobsAffectStealthVisibility` | `true` | True lets every nearby mob, passive included, break your hidden state with line of sight. False restricts that to blacklisted types. |
| `targetingBlacklistTypes` | `["WARDEN", "WITHER", "PHANTOM", "ENDER_DRAGON"]` | Entity types exempt from targeting suppression. These keep hunting you. |
| `threatScanIntervalMillis` | `250` | Milliseconds between threat-awareness scans while sneaking. |
| `maxTargetDropEntitiesPerScan` | `32` | Maximum mobs inspected by each target-drop scan. |
| `maxThreatEntitiesPerScan` | `32` | Maximum mobs and players inspected by each threat-awareness scan. |
| `threatScanCompletionDelayTicks` | `2` | Ticks a scan waits for per-entity checks before applying a partial result. Clamped to 1-4. |

### Sneak Speed (`stealth-speed`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/stealth/stealth-speed-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/stealth/stealth-speed-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

3 levels · 5 knowledge, then 4 per level

Sneaking or crawling on the ground in survival or adventure raises sneak speed, including while you stand still, and can apply auto-step. Riding, flying, and gliding turn it off.

Personal controls: Automatic step up (on/off); Automatic step down (on/off); Soul particles (on/off); Maximum stealth speed (full/half/quarter).

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `setInterval` | `50` | Milliseconds between refresh passes. Also the adaptation's registered tick interval. |
| `baselineWalkSpeed` | `0.2` | Walk speed used as the reference when the player's live walk speed is effectively zero. |
| `maxSpeedBonus` | `0.4666666666666667` | Walk-speed-equivalent bonus at max level. The default lands max level exactly on the vanilla sneak-speed cap. |
| `crawlBonusMultiplier` | `1.15` | Multiplier applied to the bonus while crawling on land. |
| `minWalkSpeed` | `-1` | Lower clamp on the walk speed used in the scalar math. |
| `maxWalkSpeed` | `1` | Upper clamp on the walk speed used in the scalar math. |
| `enableAutoStep` | `true` | Master switch for both auto-step behaviors. |
| `enableAutoStepUp` | `true` | Applies the step height modifier so one-block ledges are walked up. |
| `stepHeightBonus` | `0.4` | Extra step height in blocks applied while active. |
| `enableAutoStepDown` | `true` | Allows stepping down one block while moving. |
| `autoStepProbeDistance` | `0.45` | Forward probe distance in blocks for the step-down check. |
| `autoStepForwardPush` | `0.36` | Horizontal push applied during each step-down teleport. |
| `autoStepUseInput` | `true` | Uses raw movement input for step-down direction when the server exposes it. |
| `autoStepVelocityThreshold` | `0.01` | Minimum horizontal velocity before step-down runs. |
| `autoStepCooldownMs` | `90` | Minimum milliseconds between step-down teleports. |
| `doubleHeadroomHeightThreshold` | `1.7` | Bounding box height above which a step-down destination needs two blocks of headroom. |
| `crawlHeightMax` | `0.61` | Bounding box height at or below which the player counts as crawling on land. |
| `requireGrounded` | `true` | Requires the player to be on the ground for the boost to run. |
| `allowWhileInWater` | `false` | Allows the boost while in water or swimming. |
| `movementVelocityThreshold` | `0.005` | Minimum horizontal velocity to count as moving for particles and stat credit. |
| `showSoulParticles` | `true` | Shows a soul or ash particle at the player's feet while active. |
| `soulParticleChance` | `0.3` | Chance per refresh pass to spawn that particle, 0-1. |
| `soulParticleYOffset` | `0.02` | Vertical offset in blocks for the particle. |
| `activationSoundVolume` | `1.6` | Volume of the activation sound. |
| `activationSoundPitch` | `0.9` | Pitch of the activation sound. |
| `activationSoundCooldownMs` | `250` | Minimum milliseconds between activation sounds. |
| `statIntervalMs` | `200` | Minimum milliseconds between stat increments while moving. |

### Item Snatch (`stealth-snatch`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/stealth/stealth-snatch-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/stealth/stealth-snatch-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

3 levels · 12 knowledge, then 4 per level

While you sneak, nearby drops you could pick up by hand move into your inventory on a repeating pulse; a full inventory is skipped and stacks are not converted. Each pulse inspects at most 128 entities, takes at most 32 items, and holds a pulled item for 5000 ms so it is not pulled twice.

Personal controls: Collection control (While sneaking/Automatic collection); Collected items (All eligible items/Blocks only/Food only). Automatic collection stays armed until its mode or Enabled control is changed.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `snatchRate` | `250` | Milliseconds between repeat snatch pulses while the player stays sneaking. |
| `radiusFactor` | `5.55` | Blocks of snatch radius gained at max level. Radius is `levelPercent * radiusFactor + 1`, clamped to 1-8 blocks. |

### Ghost's Armor (`stealth-ghost-armor`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/stealth/stealth-ghost-armor-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/stealth/stealth-ghost-armor-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

7 levels · 1 knowledge, then 3 per level

While you are alive and not being hit, a bonus armor buffer refills; the next hit that armor would reduce consumes the whole buffer. Armor-ignoring damage, including the void and starvation, ignores it, applied armor is clamped to 0-20, and consumption pays `min(10, 2.5 * incoming damage)` XP.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `maxArmor` | `16` | Armor points the buffer holds at max level. |
| `minArmor` | `2` | Armor points the buffer holds at level 1. |
| `maxArmorPerTick` | `3` | Armor points added per refresh at max level. |
| `minArmorPerTick` | `1` | Armor points added per refresh at level 1. |

### Stealth Vision (`stealth-vision`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/stealth/stealth-vision-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/stealth/stealth-vision-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

1 level · 5 knowledge

While you sneak you gain Night Vision, incoming Blindness is refused, and invisible players get a private outline; standing up removes all three, including only the Night Vision this adaptation applied. Outlines use a 1500 ms lease refreshed about every 500 ms, range is the server view distance clamped to 16-160 blocks, each pass inspects at most 128 players, and there are no adaptation-specific config keys.

Personal controls: Night vision (on/off); Prevent blindness (on/off); Invisible player outlines (on/off).

### Enderveil (`stealth-enderveil`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/stealth/stealth-enderveil-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/stealth/stealth-enderveil-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

2 levels · 4 knowledge, then 6 per level

Endermen cannot target you while you sneak at level 1, and cannot target you at all at level 2. There are no adaptation-specific config keys.

### Shadow Decoy (`stealth-shadow-decoy`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/stealth/stealth-shadow-decoy-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/stealth/stealth-shadow-decoy-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge

Stopping a sneak leaves a copy of you that nearby hunters approach and attack, while you stay invisible with equipment hidden for the decoy's life. Damage to the decoy is cancelled, Adapt area and chain attacks skip decoys even when passive-mob protection is off, and aggro redirection skips your tamed pets and other friendlies.

Personal controls: Decoy gesture (Release sneak/Double sneak/Empty-hand right-click then release sneak). Armed release requires an empty-main-hand right-click in air while sneaking, followed by releasing sneak. Double sneak uses a 350 ms window. When an existing decoy can be swapped by double sneak, that gesture takes priority and does not replace the decoy.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `cooldownMillisBase` | `18000` | Milliseconds between decoys, before level scaling. |
| `cooldownMillisFactor` | `12000` | Milliseconds removed from the cooldown at max level. Floors at 1000 ms. |
| `decoyTicksBase` | `60` | Decoy lifetime in ticks, before level scaling. |
| `decoyTicksFactor` | `80` | Extra lifetime ticks gained at max level. Floors at 20 ticks. |
| `decoyRadiusBase` | `8` | Aggro redirect radius in blocks, before level scaling. |
| `decoyRadiusFactor` | `10` | Extra redirect radius gained at max level. |
| `decoyEyeHeight` | `1.62` | Eye height used when facing the fake player at viewers. |
| `tabListRemoveDelayTicks` | `40` | Ticks before the skinned fake player is pulled from the tab list. |
| `legacyFallbackEnabled` | `true` | Falls back to a visible armor stand when packet NPC creation fails. |
| `ownerInvisibilityRefreshTicks` | `30` | Duration in ticks of each owner Invisibility refresh. |
| `ownerInvisibilityAmplifier` | `0` | Amplifier of the owner Invisibility effect. |
| `ownerTrailParticles` | `5` | Smoke particles spawned around the invisible owner per burst. |
| `ownerTrailHorizontalSpread` | `0.18` | Horizontal spread in blocks of the owner smoke trail. |
| `ownerTrailVerticalSpread` | `0.05` | Vertical spread in blocks of the owner smoke trail. |
| `ownerTrailYOffset` | `0.1` | Vertical offset in blocks of the trail spawn point. |
| `ownerTrailSpeed` | `0.01` | Particle speed of the owner smoke trail. |
| `ownerTrailIntervalMillis` | `75` | Milliseconds between owner trail bursts. Floors at 25 ms. |
| `ownerEquipmentHideResendMillis` | `250` | Milliseconds between resends of the owner equipment-hide packets. |
| `aggroRedirectIntervalMillis` | `150` | Milliseconds between aggro redirect scans. Floors at 25 ms. |
| `maxAggroEntitiesPerScan` | `32` | Maximum mobs dispatched by each redirect scan. |
| `maxPacketViewers` | `64` | Maximum players sent decoy and equipment packets for one decoy. |
| `maxViewerAddsPerRefresh` | `8` | Maximum newly tracked viewers initialized per refresh. |
| `maxViewerLookUpdatesPerRefresh` | `16` | Maximum viewer-facing rotations sent per refresh. |
| `decoyHitKnockback` | `0.28` | Horizontal knockback applied to the decoy when hit. |
| `decoyHitLift` | `0.08` | Vertical lift applied to the decoy when hit. |
| `decoySwingDetectionReach` | `4.5` | Ray distance in blocks used to detect swings at the decoy. |
| `decoySkinLayerMask` | `127` | Bitmask of visible skin layers on the fake player. |
| `xpOnDecoy` | `18` | Skill XP granted per decoy spawned. |

### Shadowmeld (`stealth-shadowmeld`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/stealth/stealth-shadowmeld-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/stealth/stealth-shadowmeld-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

4 levels · 4 knowledge, then 5 per level

After you keep sneaking while Stealth reports you undetected, you turn invisible and mobs cannot target you. Attacking, taking damage, interacting, being spotted, or standing up breaks it, and Invisibility remains only while a Smoke Pellet cloud still covers you.

Personal controls: Meld activation (Eligible sneaking/Double sneak to arm). Double sneak means two presses within 350 ms; ordinary concealment and stillness requirements still apply.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `meldDelayStartMillis` | `3000` | Milliseconds of unbroken eligible sneaking before melding, at level 1. |
| `meldDelayEndMillis` | `250` | Milliseconds of unbroken eligible sneaking before melding, at max level. |
| `xpOnMeld` | `6` | Skill XP granted the moment you meld. |

### Smoke Pellet (`stealth-smoke-pellet`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/stealth/stealth-smoke-pellet-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/stealth/stealth-smoke-pellet-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

3 levels · 4 knowledge

Sneak while holding gunpowder in either hand to spend one and throw a cloud along your aim; it stops at the first block or living entity. Living entities inside go blind, players inside turn invisible with a concealment lease that lasts a couple of seconds past each pulse, mobs drop their target, and while the lease holds mobs within 64 blocks cannot reacquire a concealed player, including an angry warden.

Personal controls: Gunpowder hand (Either hand/Main hand/Off hand); Smoke gesture (Single sneak/Double sneak); Gunpowder reserve in selected hand (No reserve/Keep 1 gunpowder/Keep 4 gunpowder). Double sneak means two presses within 350 ms. The reserve is the minimum gunpowder left in the selected hand after spending.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `radiusBase` | `2.5` | Cloud radius in blocks, before level scaling. |
| `radiusFactor` | `2.5` | Extra cloud radius gained at max level. |
| `radiusMax` | `6.0` | Hard cap on the cloud radius after scaling. |
| `pulsesBase` | `8` | Number of 10-tick cloud pulses, before level scaling. |
| `pulsesFactor` | `10` | Extra pulses gained at max level. Minimum 1. |
| `raycastRange` | `24.0` | Maximum throw distance in blocks. Clamped to 2-64. |
| `cooldownMillis` | `1500` | Milliseconds between throws. |
| `xpOnThrow` | `10` | Skill XP granted per pellet thrown. |

### Cutpurse (`stealth-cutpurse`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/stealth/stealth-cutpurse-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/stealth/stealth-cutpurse-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

4 levels · 4 knowledge

An undetected direct melee hit on a pillager, vindicator, piglin, or piglin brute can roll that mob's own loot table into your inventory, or onto the ground if you are full. The mob survives, spawn method does not matter, only a non-empty result counts, and the mob is stamped `cutpurse_picked` so it cannot be picked again.

Personal controls: Eligible targets (All eligible mobs/Illagers/Piglins).

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `stealChanceBase` | `0.25` | Chance per qualifying hit that a steal is attempted, 0-1, before level scaling. |
| `stealChanceFactor` | `0.4` | Extra steal chance gained at max level. |
| `stealChanceMax` | `0.9` | Hard cap on the steal chance, 0-1. |
| `lootQualityBase` | `0.0` | Luck value passed to the loot table roll, before level scaling. |
| `lootQualityFactor` | `2.0` | Extra luck gained at max level. |
| `lootStacksBase` | `1` | Item stacks taken per successful steal, before level scaling. |
| `lootStacksFactor` | `2` | Extra stacks gained at max level. Minimum 1. |
| `xpOnSteal` | `15` | Skill XP granted per successful steal. |

### Trap Sense (`stealth-trap-sense`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/stealth/stealth-trap-sense-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/stealth/stealth-trap-sense-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

4 levels · 3 knowledge

While you sneak, nearby `TRAPPED_CHEST`, `TRIPWIRE`, `TRIPWIRE_HOOK`, `SCULK_SENSOR`, `CALIBRATED_SCULK_SENSOR`, `SCULK_SHRIEKER`, and any `*_PRESSURE_PLATE` are outlined for you only, at most 96 markers per scan: sculk RGB `40, 220, 210`, tripwire and hooks RGB `255, 220, 45`, everything else RGB `255, 70, 70`. Below max level, sneaking can suppress movement vibrations (`STEP`, `SWIM`, `FLAP`, `HIT_GROUND`, `ELYTRA_GLIDE`, `SPLASH`, `BOUNCE` where present, `TELEPORT`, `ENTITY_MOUNT`, `ENTITY_DISMOUNT`); at max level every movement vibration is suppressed even while not sneaking, and the block that would have heard you is outlined.

Personal controls: Private trap outlines (on/off); Trapped chests (on/off); Tripwires (on/off); Pressure plates (on/off); Sculk traps (on/off). Filters and the outline switch affect sensing only. Earned sculk movement protection remains active while the adaptation is enabled.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `rangeBase` | `4.0` | Trap reveal radius in blocks, before level scaling. |
| `rangeFactor` | `4.0` | Extra reveal radius gained at max level. The result is clamped to 3-8 blocks. |
| `mercyMaxChance` | `0.7` | Suppression chance at max level, used as a ceiling. Effective chance below max level is this value scaled by `level / maxLevel`. |
| `scanIntervalMillis` | `500` | Milliseconds between trap scans while sneaking. Floors at 200 ms. |

### Assassinate (`stealth-assassinate`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/stealth/stealth-assassinate-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/stealth/stealth-assassinate-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

4 levels · 6 knowledge

An undetected melee hit on a mob whose max health is within the cap deals exactly that mob's current health, so it dies with no overkill. Players, wardens, and mobs that implement the boss interface are excluded.

Personal controls: Require sneaking (on/off); Eligible targets (All eligible mobs/Hostile monsters/Animals).

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `healthCapBase` | `22.0` | Maximum health a target may have to be executable, before level scaling. |
| `healthCapFactor` | `38.0` | Extra executable health gained at max level. |
| `cooldownBase` | `40000` | Milliseconds between executions, before level scaling. |
| `cooldownFactor` | `20000` | Milliseconds removed from the cooldown at max level. Floors at 8000 ms. |
| `xpOnExecution` | `45` | Skill XP granted per execution. |

### Decoy Swap (`stealth-decoy-swap`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/stealth/stealth-decoy-swap-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/stealth/stealth-decoy-swap-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

3 levels · 4 knowledge

Requires Shadow Decoy: while your decoy is alive and in range, a sneak double-tap swaps your position with it. The swap is refused in another world or out of range, and a failure puts the decoy back with no cooldown or XP cost.

Personal controls: Swap gesture (Double sneak/Sneak and swap hands). The alternate gesture is sneak plus swap hands. Double sneak reserves an existing decoy from Shadow Decoy’s release or double-sneak creation; creating a new decoy never swaps it in the same input event.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `swapRangeBase` | `10.0` | Maximum distance in blocks to your decoy, before level scaling. |
| `swapRangeFactor` | `20.0` | Extra swap range gained at max level. |
| `cooldownBase` | `12000` | Milliseconds between swaps, before level scaling. |
| `cooldownFactor` | `8000` | Milliseconds removed from the cooldown at max level. Floors at 2000 ms. |
| `doubleTapWindowMillis` | `400` | Maximum milliseconds between the two sneak presses to count as a double tap. |
| `xpOnSwap` | `12` | Skill XP granted per successful swap. |

### Umbral Recovery (`stealth-umbral-recovery`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/stealth/stealth-umbral-recovery-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/stealth/stealth-umbral-recovery-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

4 levels · 3 knowledge, then 4 per level

A kill while crouched restores hunger and, if Invisibility is already active, extends it; nothing happens when hunger is already full and you are visible. Saturation rises with the hunger refund but never above the new food level.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `refundBase` | `2` | Food points restored per sneaking kill, before level scaling. |
| `refundFactor` | `4` | Extra food points restored at max level. Minimum 1. |
| `extensionTicksBase` | `40` | Ticks added to an active Invisibility per sneaking kill, before level scaling. |
| `extensionTicksFactor` | `120` | Extra extension ticks gained at max level. |
| `maxInvisibilityTicks` | `1200` | Ceiling on the Invisibility duration reachable through extension. |
| `xpOnRecovery` | `8` | Skill XP granted per recovery. |

## Reference

### Skill XP sources

| Trigger | Award | Notes |
|---------|-------|-------|
| Passive sneak pulse (every `1412` ms) | `sneakXP` scaled by elapsed time over the interval | Requires sneaking and not swimming, sprinting, flying, or gliding, in survival or adventure mode. |
| Damaging any valid living entity while sneaking | Damage dealt times `sneakCombatXPMultiplier` | Rate-limited by `sneakCombatXpCooldown`. The `stealth.damage.sneaking` stat is added before the rate limit, so the stat always counts. Parrots and the invalid-damageable entity listing are excluded. |
| Killing while sneaking | `sneakKillXP` | Tragoul skeletal servants and Excavation grave mobs are excluded. |
| Launching a projectile while sneaking | No XP | Adds `stealth.arrows.sneaking` only. |

### Skill configuration defaults

Written to `plugins/Adapt/skills/stealth.toml` on first load.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `enabled` | `true` | Set to false to disable the whole skill. |
| `skillColor` | `"&8"` | Legacy ampersand color code used for this skill in menus and text. |
| `challengeSneak1kReward` | `1750` | XP paid for `challenge_sneak_1k`. |
| `challengeSneak5kReward` | `3500` | XP paid for `challenge_sneak_5k`. |
| `challengeSneak20kReward` | `8750` | XP paid for `challenge_sneak_20k`. |
| `sneakXP` | `0.4` | Base passive sneak XP per interval, before cadence scaling. |
| `sneakCombatXPMultiplier` | `3.0` | Multiplier applied to damage dealt while sneaking when converting it to XP. |
| `sneakCombatXpCooldown` | `1250` | Milliseconds between XP awards for sneaking combat damage. |
| `sneakKillXP` | `15` | XP for a kill made while sneaking. |
| `challengeStealthDmg500Reward` | `1500` | XP paid for `challenge_stealth_dmg_500`. |
| `challengeStealthDmg5kReward` | `5000` | XP paid for `challenge_stealth_dmg_5k`. |
| `challengeStealthKills10Reward` | `1000` | XP paid for `challenge_stealth_kills_10`. |
| `challengeStealthKills100Reward` | `5000` | XP paid for `challenge_stealth_kills_100`. |
| `challengeStealthArrows50Reward` | `1250` | XP paid for `challenge_stealth_arrows_50`. |
| `challengeStealthArrows500Reward` | `5000` | XP paid for `challenge_stealth_arrows_500`. |

### Challenges

| Challenge | Threshold | Reward knob |
|---|---|---|
| `challenge_sneak_1k` | 1000 | `challengeSneak1kReward` |
| `challenge_sneak_5k` | 5000 | `challengeSneak5kReward` |
| `challenge_sneak_20k` | 20000 | `challengeSneak20kReward` |
| `challenge_stealth_dmg_500` | 500 | `challengeStealthDmg500Reward` |
| `challenge_stealth_dmg_5k` | 5000 | `challengeStealthDmg5kReward` |
| `challenge_stealth_kills_10` | 10 | `challengeStealthKills10Reward` |
| `challenge_stealth_kills_100` | 100 | `challengeStealthKills100Reward` |
| `challenge_stealth_arrows_50` | 50 | `challengeStealthArrows50Reward` |
| `challenge_stealth_arrows_500` | 500 | `challengeStealthArrows500Reward` |

## See also

Catalog: [Skills](/adapt/10-skills-catalog). Rules: [Concepts](/adapt/02-concepts).
