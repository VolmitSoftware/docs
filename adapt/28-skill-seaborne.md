---
title: "Skill - Seaborne"
description: "Seaborne XP sources, adaptations, controls, and configuration"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Adaptations add air, swim speed, underwater vision and mining, damage protection, escape tools, wreck salvage, coral growth, aquatic allies, trident upgrades, and burst movement.

## Adaptations

All of this needs the adaptation learned to level 1 or higher, the skill and the adaptation enabled in config, the matching `adapt.use.*` permission, and protection and region policy that allow the action.

### Organic Oxygen Tank (`seaborne-oxygen`)

5 levels · 5 knowledge, then 3 per level

Raises your maximum air underwater by adding an oxygen bonus attribute. At high levels you can stay under for a very long time before the bar starts moving. It works on its own once learned, no gesture needed.

Menu stat line: Oxygen Capacity Increase.

Applies `OXYGEN_BONUS` on the `oxygen` slot. The bonus is the saved-air fraction `level * airPerLevelTics / 75` clamped to 1, where 1 is the maximum bonus of `1024`.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `airPerLevelTics` | `15` | Air ticks saved per level out of a 75 tick drowning pulse. The resulting fraction becomes the oxygen bonus attribute. |

### Dolphin's Grace (`seaborne-speed`)

7 levels · 2 knowledge, then 3 per level

Gives you a water movement efficiency bonus that scales with level, so you cut through water faster. When you are actually sprint-swimming, it also applies the real Dolphin's Grace potion effect, which lingers longer as the level climbs.

It refuses to run if your boots have Depth Strider. Take the enchantment off if you want this adaptation to work. This is deliberate, and the menu lore says so. Just get in the water.

Applies `WATER_MOVEMENT_EFFICIENCY` on the `swim` slot at `level / maxLevel`, capped at 1, plus `DOLPHINS_GRACE` for `20 + round(levelPercent * 60)` ticks while sprint-swimming. Depth Strider boots drop it to level 0, fully inactive.

No adaptation-specific config knobs.

### Fisher's Fantasy (`seaborne-fishers-fantasy`)

7 levels · 2 knowledge, then 5 per level

Every committed fish catch makes one bounded reward roll. The chance scales from 10% at level one to 35% at level seven. A success drops one extra random fishing item, spawns 2-8 vanilla XP, pays 8 Seaborne skill XP, and starts a five-second success cooldown.

Menu stat line: Chance for one bonus fishing reward bundle.

The chance interpolates from `bonusChanceAtLevelOne` to `bonusChanceAtMaxLevel`, and the vanilla XP is `min(maximumVanillaXpPerCatch, vanillaXpAtLevelOne + (level - 1) * vanillaXpPerAdditionalLevel)`.

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

1 level · 3 knowledge

Gives you Night Vision the whole time you are in water, and takes it away when you surface. It is refreshed before it runs out, so the displayed duration stays high instead of counting down. It only removes the effect if it was the one that applied it, so a Night Vision potion you drank yourself is left alone.

Menu stat line: Gain continuously refreshed Night Vision while underwater.

Applies `NIGHT_VISION` for `600` ticks and refreshes it at `500` ticks remaining. Only a non-ambient, particle-free amplifier 0 effect counts as its own and gets removed.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `nightVisionDurationTicks` | `600` | Duration of the hidden-particle Night Vision refresh, clamped from 20 to 6000 ticks. |
| `nightVisionRefreshThresholdTicks` | `500` | Remaining duration at which Adapt reapplies its effect, clamped below the configured duration. |
| `refreshIntervalMillis` | `3000` | Underwater-state check interval, clamped from 250 to 10000 ms and applied immediately on hot reload. |

### Turtle Miner (`seaborne-turtles-mining-speed`)

1 level · 3 knowledge

Adds 40 percent to submerged mining speed and stacks with Aqua Affinity rather than replacing it. Floating normally carries a separate vanilla one-fifth airborne mining penalty. Turtle Miner now compensates for that penalty while you are off the ground. It
works at the same effective rate whether you stand on the seabed or float. It uses attributes rather than a Haste potion and has no Water Breathing prerequisite.

Menu stat line: Boosts submerged mining speed, stacks with Aqua Affinity, and compensates for the floating mining penalty.

In water it applies `SUBMERGED_MINING_SPEED`, and while you are also off the ground a separate `BLOCK_BREAK_SPEED` multiplier covers vanilla's airborne penalty. Both clear when you surface.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `underwaterMiningSpeedMultiplier` | `1.4` | Effective submerged-mining multiplier, clamped from 1 to 10. |
| `compensateFloatingPenalty` | `true` | Also counter vanilla's separate airborne mining penalty while floating underwater. |
| `floatingMiningSpeedMultiplier` | `5.0` | Effective floating compensation multiplier, clamped from 1 to 10. Five cancels vanilla's one-fifth penalty. |
| `attributeDurationTicks` | `160` | Duration of each refreshed modifier, clamped from 20 to 1200 ticks. |
| `refreshIntervalMillis` | `3000` | Passive state-refresh interval, clamped from 250 to 10000 ms and applied immediately on hot reload. |

### Tidecaller (`seaborne-tidecaller`)

5 levels · 4 knowledge

A dash. You point where you want to go and surge, leaving a splash trail behind. Default settings put you on a velocity burst rather than a teleport, so walls stop you instead of letting you blink through them.

Out of the box you can trigger it two ways, and it works in water or in the rain. The dash is on a cooldown that shows on the Heart of the Sea item cooldown, and it shortens as you level.

1. Get into water, or stand out in the open during a storm.
2. Look where you want to go.
3. Tap sneak, or swing your arm (left click) while in water.
4. Wait out the cooldown before the next one. A fizzle sound means a wall is in front of you, or the cooldown is still running.

Operators can turn either trigger off, require sneak for the swing trigger, restrict triggers to water only, or switch back to the old teleport dash.

Menu stat lines: Surge Distance. Surge Cooldown. Plus a generated Trigger line per enabled trigger and an Environment line.

The cooldown shows on the `HEART_OF_THE_SEA` item cooldown and floors at `20` ticks, with a ready ping when it clears. Water means in water, swimming, or standing with feet or eyes in liquid. Rain means a storm with open sky above you.

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

4 levels · 4 knowledge

Rewards going deep. Once your eyes are far enough below sea level, you gain visible absorption hearts, refreshed Resistance, and direct incoming-damage reduction. Go deeper still and the Resistance steps up a tier. The required depth shrinks as you level, so higher levels get the protection nearer the surface. Pressure Diver does not grant Water Breathing. Organic Oxygen Tank remains the oxygen adaptation.

Absorption runs from two hearts at level 1 to six at level 4 on the defaults. It fills once when the buff starts and adds more only when your level rises, so hearts you spend on damage stay spent until you surface and dive again. Surfacing takes back only its own capacity, not absorption from anything else.

It also pushes back on Mining Fatigue, adding a submerged mining speed modifier sized to partly cancel the amplifier you are carrying. The ordinary underwater and floating penalties are Turtle Miner's and Aqua Affinity's job, not this one's.

Menu stat lines: Minimum Depth Requirement. Depth Damage Reduction. Mining Fatigue Reduction Chance. Depth Absorption Hearts.

Depth is sea level minus your eye Y. At the depth threshold you get `RESISTANCE` for `effectTicks` plus a `MAX_ABSORPTION` capacity modifier granting that capacity as absorption health; past the deep threshold Resistance steps to amplifier 1. It never applies `WATER_BREATHING`. The depth threshold floors at 2 blocks and the deep threshold at 4.

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

5 levels · 3 knowledge, then 4 per level

Coral you place stops dying the moment it leaves water. The adaptation remembers the blocks you placed and cancels their fade for a set time, minutes at low level and much longer at high level. Placing coral or other reef blocks (prismarine, sea lanterns, sponge) also pays skill XP.

The second half is bone meal farming. Right-click live coral with bone meal and it may grow a new random coral block into an adjacent water cell.

1. Learn Coral Gardener.
2. Place coral or reef blocks anywhere. XP is paid on placement.
3. Hold bone meal in your main hand.
4. Right-click a coral block that has water next to it.
5. On a success a new coral block appears in that water cell and one bone meal is consumed.

Growth is authorized like a normal block place, so a region plugin that blocks you gets the last word, and a denied placement costs you no bone meal.

Menu stat lines: Coral Survival Time. Bonemeal Growth Chance.

Reef blocks are anything tagged `CORAL_BLOCKS`, `CORALS`, or `WALL_CORALS`, plus `PRISMARINE`, `PRISMARINE_BRICKS`, `DARK_PRISMARINE`, `SEA_LANTERN`, `SPONGE`, and `WET_SPONGE`. Only tagged coral gets fade protection and counts toward the stat. Growth picks at random from `TUBE_CORAL_BLOCK`, `BRAIN_CORAL_BLOCK`, `BUBBLE_CORAL_BLOCK`, `FIRE_CORAL_BLOCK`, and `HORN_CORAL_BLOCK` and fills an adjacent water cell. Creative mode skips the bone meal cost. At most `8192` protected coral blocks are tracked at once, expired entries dropped first.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `survivalSecondsBase` | `60` | Seconds placed coral is protected from fading, before level scaling. |
| `survivalSecondsFactor` | `240` | Extra protected seconds gained at max level. |
| `growthChanceBase` | `0.35` | Chance per bone meal click that growth is attempted, 0-1, before level scaling. |
| `growthChanceFactor` | `0.5` | Extra growth chance gained at max level. Total is clamped to 1. |
| `reefPlaceXp` | `8` | Skill XP granted per reef block placed. |
| `growthXp` | `14` | Skill XP granted per coral block grown with bone meal. |

### Deep Salvager (`seaborne-deep-salvager`)

4 levels · 4 knowledge

While you are in water, the adaptation quietly scans nearby blocks. It paints
chests, trapped chests, and barrels with an aqua glow that only you can see. Up to six show at a time, within a capped radius, and only within three blocks of your own height.

Opening one of those containers while you are in water and the container is touching water pays out bonus treasure. The roll uses an ocean loot table (nautilus shells, prismarine, ingots, lapis, emeralds, ink sacs, tropical fish, heart of the sea). Each container pays once, ever. The container is stamped so nobody double-dips.

1. Learn Deep Salvager.
2. Swim into a shipwreck, ruin, or any flooded structure.
3. Look for containers glowing aqua.
4. Open one while you are still in the water. The bonus items appear in the container.

Menu stat lines: Detection Range (blocks). Bonus Treasure Rolls.

Shimmers are private block displays tinted RGB `70, 230, 235` on `CHEST`, `TRAPPED_CHEST`, and `BARREL`, at most `6` at a time, within `9` blocks and 3 blocks above or below you.

To salvage you must be in water and the container must touch water on at least one face. Each container is stamped `seaborne_salvaged` and pays out once, ever. The pool is `NAUTILUS_SHELL` at x2 weight, `PRISMARINE_SHARD` at x3, and `PRISMARINE_CRYSTALS` at x2, plus `GOLD_INGOT`, `IRON_INGOT`, `LAPIS_LAZULI`, `EMERALD`, `INK_SAC`, `GLOW_INK_SAC`, and `TROPICAL_FISH`. `HEART_OF_THE_SEA` always comes as a stack of 1; other stacks are 1 to 3. XP is `salvageXp` per item that fit.

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

5 levels · 4 knowledge

When you take damage while in water, a visible squid-ink cloud expands around you and nearby hostiles get Blindness. Drowned, guardians, and elder guardians drop you as their target and cannot reacquire you during the short concealment window. The player is not given Invisibility, so held items and equipment do not remain visible as a chest-like silhouette. The cooldown shortens as you level, down to a floor of three seconds. Learn it and take a hit underwater.

Menu stat lines: Ink Cloud Size (blocks). Ink Burst Cooldown.

Emits a `SQUID_INK` cloud and applies `BLINDNESS` to nearby `Monster` entities. The burst does not cancel or reduce the damage that triggered it.

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

5 levels · 4 knowledge, then 5 per level

Tridents hit harder, both thrown and swung in melee. When you throw one, the trident is stamped with your level at launch, so it keeps the bonus even if you switch gear mid-flight.

It also brings the trident back. After a short flight grace the trident turns around and homes to you at a velocity that scales with level. A trident stuck in a block frees itself and comes home too. Higher levels start the return sooner. Operators can turn the return off and keep only the damage. Throw or swing a trident.

Menu stat lines: Bonus Trident Damage. Recall Speed.

Thrown tridents carry the thrower's level in `seaborne_trident_mastery_level` and keep that bonus. Melee hits use your current level and need a `TRIDENT` in the main hand. Recall gives up after `120` ticks and stops within `1.6` blocks of you, freeing a stuck trident first.

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

5 levels · 3 knowledge, then 4 per level

Three things at once. You carry a permanent Luck bonus equal to your level, which means better fishing results without an enchantment. While you are in water, nearby fish get nudged toward you, which makes them easy to bucket or spear. And when you hit a mob, nearby dolphins charge it and nearby axolotls retarget onto it.

Menu stat lines: Luck of the Sea Tier. Creature Affinity Range (blocks).

Applies `LUCK` on the `luck` slot at `level`. Schooling only runs while you are in water or swimming, nudges at most `12` fish per pulse, and ignores fish already within a block. One hit recruits at most `8` dolphins and axolotls.

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

5 levels · 3 knowledge, then 4 per level

A charge-based burst for swimmers. Tap sneak while sprint-swimming and you launch in the direction you are looking. Charges refill over time, and each jet costs exhaustion, so it drains hunger if you spam it. Out of charges or out of food gives you a fizzle instead of a burst.

1. Learn Hydro Jet.
2. Sprint-swim so you are in the swimming pose, not just floating in water.
3. Look where you want to go.
4. Tap sneak.
5. Repeat until your charges run out, then wait for them to refill.

Menu stat lines: Burst Force. Jet Charges.

An empty food bar fizzles without spending a charge. The jet blends 40 percent of your current velocity with the burst and caps the result at `2.6`. Charges refill continuously, in fractions of a charge.

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

5 levels · 3 knowledge

While you are wet you get Regeneration and take reduced damage. Wet means in water or swimming, or out in the open during a storm. Both effects hang around for a few seconds after you leave the water, which covers the moment you climb out of a fight.

The Regeneration tier climbs with level to a maximum of Regeneration III. Damage reduction is capped so it stays modest.

Menu stat lines: Brine Regeneration Tier. Damage Reduction While Wet.

Wet means in water, swimming, or under open sky in a storm. Regeneration runs at amplifier `floor(levelPercent * 3)`, capped at 2. Damage reduction also holds through the linger window after you leave the water.

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

Each adaptation has its own file at `plugins/Adapt/adaptations/<id>.toml`. Alongside the keys listed above it carries `enabled`, `permanent`, `showParticles`, `showSounds`, and its learn costs (`maxLevel`, `initialCost`, `baseCost`, `costFactor`). Every file is generated with a comment on each key and values are clamped on load.

## See also

- [02 - Concepts](/adapt/02-concepts)
- [03 - Player Usage](/adapt/03-player-usage)
- [10 - Skills Catalog](/adapt/10-skills-catalog)
- [04 - Commands & Permissions](/adapt/04-commands-permissions)
