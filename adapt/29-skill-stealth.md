---
title: "Skill - Stealth"
description: "Stealth XP sources, adaptations, controls, and configuration"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

The core Stealth adaptation checks whether nearby mobs or players can see you, then applies concealment and undetected melee damage. Other adaptations add sneaking speed, item collection, temporary protection, vision, trap detection, recovery, decoys, invisibility, teleporting, and smoke.

## Adaptations

All of this needs the adaptation learned to level 1 or higher, the skill and the adaptation enabled in config, the matching `adapt.use.*` permission, and protection and region policy that allow the action.

### Stealth (`stealth-silent-step`)

2 levels · 1 knowledge, then 2 per level

The core of the tree. Sneaking hides you from anything that is not looking your way. Being invisible, running a Shadow Decoy, or standing in a Smoke Pellet cloud hides you no matter who is looking.

While you are concealed, mobs that were hunting you let go, nothing new targets you, and you take no fall damage. While you are undetected your screen dims and nearby threats are outlined for you alone: red means it can see you, gray means it almost can.

Attacking while undetected multiplies your damage. Mobs take a bigger bonus than players. Land five backstabs inside ten seconds and you get the Unseen Blade advancement.

1. Sneak. The dim and the outlines tell you the session is live.
2. Stay out of the red outlines. Break line of sight or get behind them.
3. Melee an observer that has not spotted you. The hit lands with the backstab multiplier.

Warden, wither, phantom, and ender dragon ignore the targeting suppression by default. That list is a knob.

Menu stat lines: Mob Detection Suppression Radius. Mob Backstab Damage Bonus. Player Backstab Damage Bonus.

An observer at or above `detectionLookDotThreshold` with line of sight detects you; `almostLookDotMargin` below that is an almost-detect. While concealed you get `SAFE_FALL_DISTANCE` of `1024` on the `fall` slot, hence no fall damage, and `DARKNESS` at `dimAmplifier` while undetected. Backstabs pay `xpPerBonusDamage` per point of final damage and `xpPerTargetDrop` per mob that loses you.

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

3 levels · 5 knowledge, then 4 per level

Crouching stops being punishing. Each level adds sneaking speed, and at max level with default settings you sneak at full walk speed, which is the vanilla cap. Crawling on land gets a small extra multiplier.

It also gives you auto-stepping while active. Extra step height lets you walk up one-block ledges without jumping. An auto-step-down lets you drop off one-block edges while moving instead of stopping at the lip.

It runs while you sneak or crawl, on the ground, in survival or adventure mode. Riding, flying, gliding, and being in water all switch it off.

Menu stat line: Sneaking Speed.

Applies `SNEAKING_SPEED` as a `MULTIPLY_SCALAR_1` modifier on the `sneak` slot, plus `STEP_HEIGHT` on the `step` slot while auto-step-up is on. `requireGrounded` and `allowWhileInWater` relax the grounded and water conditions. Milestone: `challenge_stealth_speed_5k` on `stealth.speed.blocks-sneak-sprinted` at 5000, reward 400.

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

3 levels · 12 knowledge, then 4 per level

Sneak and dropped items within range fly into your inventory. It keeps pulling on a repeating pulse for as long as you stay crouched, so you can walk a mob-farm floor without clicking anything.

A full inventory is skipped rather than eaten, and anything you could not pick up by hand stays on the ground. Stacks arrive unchanged, with no bundle or backpack conversion.

1. Learn Item Snatch.
2. Stand near dropped items.
3. Hold sneak. Items pull in on each pulse until you stand up.

Menu stat line: Snatch Radius.

Each pulse inspects at most `128` nearby entities and takes at most `32` items, and a pulled item is held for `5000` ms so it is not pulled twice. Milestones: `challenge_stealth_snatch_2500` on `stealth.snatch.items-snatched` at 2500 (reward 400). `challenge_stealth_snatch_25k` at 25000 (reward 1500).

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `snatchRate` | `250` | Milliseconds between repeat snatch pulses while the player stays sneaking. |
| `radiusFactor` | `5.55` | Blocks of snatch radius gained at max level. Radius is `levelPercent * radiusFactor + 1`, clamped to 1-8 blocks. |

### Ghost's Armor (`stealth-ghost-armor`)

7 levels · 1 knowledge, then 3 per level

A recharging armor buffer. It ticks upward while you are alive and not being hit, adding armor points on top of whatever you are wearing. The next hit that armor would normally apply to eats the entire buffer at once and the buffer starts refilling from zero.

Damage that ignores armor in vanilla also ignores this, so it will not save you from the void or from starving. Learn it and let it charge.

Menu stat lines: Max Ghost Armor. Speed.

Applies `ARMOR` on the `armor` slot, clamped to 0-20. The ceiling and the per-refresh gain both scale between the min and max knobs by level. XP on consumption is `min(10, 2.5 * incoming damage)`. Milestones: `challenge_stealth_ghost_100` on `stealth.ghost-armor.armor-consumed` at 100 (reward 300). `challenge_stealth_ghost_500` at 500 (reward 1000).

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `maxArmor` | `16` | Armor points the buffer holds at max level. |
| `minArmor` | `2` | Armor points the buffer holds at level 1. |
| `maxArmorPerTick` | `3` | Armor points added per refresh at max level. |
| `minArmorPerTick` | `1` | Armor points added per refresh at level 1. |

### Stealth Vision (`stealth-vision`)

1 level · 5 knowledge

Three things happen while you sneak. You get Night Vision. Incoming Blindness is
refused outright. Any invisible player near you gets a private outline that only
you can see. Stand up and all three go away, including the Night Vision the adaptation applied.

It only cleans up its own Night Vision. A potion you drank yourself is left alone.

Menu stat lines: Gain a burst of night vision while sneaking. Blindness immunity while sneaking. Invisible players glow while sneaking.

Outlines are private glows on a `1500` ms lease refreshed about every `500` ms, so under load one can lapse for a moment. Range is the server view distance, at least `16` blocks and at most `160`, and each pass inspects at most `128` players. Milestone: `challenge_stealth_sight_sneak_1h` on `stealth.sight.sneaking-ticks` at 72000, reward 400.

No adaptation-specific config knobs.

### Enderveil (`stealth-enderveil`)

2 levels · 4 knowledge, then 6 per level

Endermen stop caring about you. At level 1 the protection applies while you are sneaking. At level 2 it applies always, so you can stare at them across an End highlands with no pumpkin on your head. At level 2 a slow portal particle orbits your head whenever an enderman is nearby.

Menu stat line: Prevent enderman attacks while sneaking at level 1, Prevent all enderman attacks at level 2.

Milestone: `challenge_stealth_ender_veil_200` on `stealth.ender-veil.stares-survived` at 200, reward 300.

No adaptation-specific config knobs.

### Shadow Decoy (`stealth-shadow-decoy`)

5 levels · 4 knowledge

Stop sneaking and you leave a copy of yourself behind, wearing your skin and your gear. Nearby mobs that were hunting you retarget onto the decoy. You go invisible for as long as the decoy lives, with your equipment hidden and a thin smoke trail marking where you actually are.

The decoy cannot be killed. Damage to it is cancelled, but it does react: hits knock it around and it plays a hurt sound, so an attacker keeps swinging.

1. Learn Shadow Decoy.
2. Sneak.
3. Stand up. The decoy spawns where you were standing.
4. Walk away while it holds aggro. It expires on its own, sooner at low level.
5. Wait out the cooldown, which shrinks as you level.

Menu stat lines: Decoy Duration. Decoy Attraction Radius. Decoy Cooldown.

If the fake player cannot be created and `legacyFallbackEnabled` is true, a visible armor stand stands in for it. No decoy spawns while you carry `adapt-mutation-exposed`. Aggro redirection leaves your tamed pets and anything else friendly to you alone. Milestones: `challenge_stealth_decoy_100` on `stealth.shadow-decoy.decoys-spawned` at 100 (reward 300). `challenge_stealth_decoy_distract_500` on `stealth.shadow-decoy.mobs-distracted` at 500 (reward 1000).

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

4 levels · 4 knowledge, then 5 per level

Hold a sneak while Stealth reports nobody can see you. After a short delay you
turn invisible. Mobs stop being able to target you. The delay is three seconds at level 1 and drops to a quarter second at max level.

The meld breaks the moment you do anything: attack, get hurt, interact with a block or entity, get spotted, or stand up.

1. Learn Stealth and Shadowmeld.
2. Sneak somewhere nobody has line of sight on you.
3. Hold it. The meld fires with a smoke burst and a sculk click.
4. Move if you want, but do not act. Attacking, taking damage, or right-clicking ends it.

Menu stat line: Undetected Sneak Delay.

Applies `INVISIBILITY`, and on a break keeps it only while a Smoke Pellet cloud still covers you. The delay runs from `meldDelayStartMillis` at level 1 down to `meldDelayEndMillis` at max level. Milestones: `challenge_stealth_shadowmeld_100` on `stealth.shadowmeld.melds` at 100 (reward 350). `challenge_stealth_shadowmeld_1k` at 1000 (reward 1500).

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `meldDelayStartMillis` | `3000` | Milliseconds of unbroken eligible sneaking before melding, at level 1. |
| `meldDelayEndMillis` | `250` | Milliseconds of unbroken eligible sneaking before melding, at max level. |
| `xpOnMeld` | `6` | Skill XP granted the moment you meld. |

### Smoke Pellet (`stealth-smoke-pellet`)

3 levels · 4 knowledge

Hold gunpowder and sneak. One gunpowder is spent and a smoke cloud is thrown along your aim. It stops at
the first block or living entity it hits, up to a long range. The cloud pulses for several seconds.

Everything living inside the cloud goes blind. Players inside go invisible and get a concealment lease that lasts a couple of seconds past each pulse. Mobs inside drop their target, and while the lease holds, mobs within 64 blocks of the cloud cannot reacquire a concealed player. Even a warden angry at a concealed player has that anger cleared.

1. Learn Smoke Pellet.
2. Put gunpowder in your main hand or off hand.
3. Aim where you want the cloud.
4. Press sneak. One gunpowder is consumed and the cloud lands.
5. Walk out of the fight while everything in the cloud is blind.

Menu stat lines: Cloud Radius. Cloud Duration.

Milestones: `challenge_stealth_smoke_100` on `stealth.smoke-pellet.thrown` at 100 (reward 400). `challenge_stealth_smoke_1k` at 1000 (reward 1500).

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

4 levels · 4 knowledge

Hit a pillager, vindicator, piglin, or piglin brute in melee while undetected and you may pick its pocket: a roll of its own loot table drops straight into your inventory, or onto the ground if you are full. The mob lives, and each mob can only be picked once. How the mob spawned does not matter.

Passive on top of the core check. Get behind the mob, hit it, keep the loot.

Menu stat lines: Steal Chance. Loot Stacks.

Targets are `PILLAGER`, `VINDICATOR`, `PIGLIN`, and `PIGLIN_BRUTE`, hit in direct melee. The roll uses the mob's own loot table with `lootQuality` as luck; only a non-empty result counts, and it stamps the mob with `cutpurse_picked` so it can never be picked again. Milestones: `challenge_stealth_cutpurse_100` on `stealth.cutpurse.pockets-picked` at 100 (reward 400). `challenge_stealth_cutpurse_1k` at 1000 (reward 1500).

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

4 levels · 3 knowledge

While you sneak, nearby trapped chests, tripwire, tripwire hooks, pressure plates, and sculk blocks are outlined for you alone. Sculk blocks glow teal, tripwire glows yellow, everything else glows red.

It also quiets your footsteps. Below max level there is a chance per movement vibration that a sculk sensor or
shrieker does not hear you at all. That chance only applies while sneaking. At max level every movement vibration you produce is suppressed, sneaking or not, and the block that would have heard you is outlined instead.

1. Learn Trap Sense.
2. Sneak as you enter an ancient city or a suspicious hallway.
3. Watch for the outlines and route around them.

Menu stat lines: Detection Range. Sculk Movement Suppression.

Revealed blocks are `TRAPPED_CHEST`, `TRIPWIRE`, `TRIPWIRE_HOOK`, `SCULK_SENSOR`, `CALIBRATED_SCULK_SENSOR`, `SCULK_SHRIEKER`, and any material whose name ends in `_PRESSURE_PLATE`. Markers are private block displays, coloured RGB `40, 220, 210` for sculk, `255, 220, 45` for tripwire and hooks, and `255, 70, 70` for everything else, at most `96` per scan. Suppressed vibrations are `STEP`, `SWIM`, `FLAP`, `HIT_GROUND`, `ELYTRA_GLIDE`, `SPLASH`, `BOUNCE` where present, `TELEPORT`, `ENTITY_MOUNT`, and `ENTITY_DISMOUNT`. Below max level the chance is `mercyMaxChance * (level / maxLevel)` and it only applies while sneaking. Milestones: `challenge_stealth_trap_500` on `stealth.trap-sense.traps-revealed` at 500 (reward 400). `challenge_stealth_trap_5k` at 5000 (reward 1500).

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `rangeBase` | `4.0` | Trap reveal radius in blocks, before level scaling. |
| `rangeFactor` | `4.0` | Extra reveal radius gained at max level. The result is clamped to 3-8 blocks. |
| `mercyMaxChance` | `0.7` | Suppression chance at max level, used as a ceiling. Effective chance below max level is this value scaled by `level / maxLevel`. |
| `scanIntervalMillis` | `500` | Milliseconds between trap scans while sneaking. Floors at 200 ms. |

### Assassinate (`stealth-assassinate`)

4 levels · 6 knowledge

A finisher. Hit an eligible mob while Stealth reports you undetected. The damage is replaced with exactly the mob's current health. The mob dies in one hit with no overkill number. It only works on mobs whose maximum health is under a level-scaled cap. It is on
a long cooldown that shortens as you level.

1. Learn Stealth and Assassinate.
2. Sneak up on a mob nobody has noticed you near.
3. Check that it is not a boss and not too tough for your level.
4. Melee it once.
5. Wait out the cooldown.

Menu stat lines: Executable Health Cap. Cooldown.

Excludes players, anything implementing `Boss`, and `WARDEN`. Milestones: `challenge_stealth_assassinate_50` on `stealth.assassinate.executions` at 50 (reward 500). `challenge_stealth_assassinate_500` at 500 (reward 2000).

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `healthCapBase` | `22.0` | Maximum health a target may have to be executable, before level scaling. |
| `healthCapFactor` | `38.0` | Extra executable health gained at max level. |
| `cooldownBase` | `40000` | Milliseconds between executions, before level scaling. |
| `cooldownFactor` | `20000` | Milliseconds removed from the cooldown at max level. Floors at 8000 ms. |
| `xpOnExecution` | `45` | Skill XP granted per execution. |

### Decoy Swap (`stealth-decoy-swap`)

3 levels · 4 knowledge

Needs Shadow Decoy learned. While your decoy is alive and inside range, double-tap sneak and you and the decoy trade places. The escape and the reposition are the same button.

1. Learn Shadow Decoy and Decoy Swap.
2. Sneak and stand up to drop a decoy.
3. Run. The decoy stays where it was.
4. Tap sneak twice quickly. You swap into the decoy's position and it takes yours.
5. Wait out the cooldown before the next swap.

Menu stat lines: Swap Range. Cooldown.

A swap is refused if the decoy is in another world or out of range, and a failed swap puts the decoy back where it was at no cooldown or XP cost. Milestones: `challenge_stealth_decoy_swap_100` on `stealth.decoy-swap.swaps` at 100 (reward 400). `challenge_stealth_decoy_swap_1k` at 1000 (reward 1500).

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `swapRangeBase` | `10.0` | Maximum distance in blocks to your decoy, before level scaling. |
| `swapRangeFactor` | `20.0` | Extra swap range gained at max level. |
| `cooldownBase` | `12000` | Milliseconds between swaps, before level scaling. |
| `cooldownFactor` | `8000` | Milliseconds removed from the cooldown at max level. Floors at 2000 ms. |
| `doubleTapWindowMillis` | `400` | Maximum milliseconds between the two sneak presses to count as a double tap. |
| `xpOnSwap` | `12` | Skill XP granted per successful swap. |

### Umbral Recovery (`stealth-umbral-recovery`)

4 levels · 3 knowledge, then 4 per level

Every kill you make while crouched feeds you and, if you are already invisible, extends that invisibility. It is what keeps a long stealth run going without eating or re-brewing. It does nothing if you are already at full hunger and not invisible. Kill while sneaking.

Menu stat lines: Hunger Refund. Invisibility Extension.

Saturation rises with the hunger refund but never above your new food level, and Invisibility only extends while one is already running. Milestones: `challenge_stealth_umbral_200` on `stealth.umbral-recovery.recoveries` at 200 (reward 400). `challenge_stealth_umbral_2k` at 2000 (reward 1500).

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

Each adaptation has its own file at `plugins/Adapt/adaptations/<id>.toml`. Alongside the keys listed above it carries `enabled`, `permanent`, `showParticles`, `showSounds`, and its learn costs (`maxLevel`, `initialCost`, `baseCost`, `costFactor`). Every file is generated with a comment on each key and values are clamped on load.

## See also

- [02 - Concepts](/adapt/02-concepts)
- [03 - Player Usage](/adapt/03-player-usage)
- [10 - Skills Catalog](/adapt/10-skills-catalog)
- [04 - Commands & Permissions](/adapt/04-commands-permissions)
