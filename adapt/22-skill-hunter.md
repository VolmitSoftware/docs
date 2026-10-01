---
title: "Skill - Hunter"
description: "Hunter XP sources, adaptations, controls, and configuration"
published: true
date: 2026-10-01T06:36:54.441Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Hunter gains XP from killing mobs, scaled by maximum health, with separate adjustments for creepers and spawner mobs, and an ender dragon, wither, elder guardian, or warden kill advances a boss challenge. Its 14 adaptations add hunger-funded combat buffs, low-health bonuses, focused-target damage, boss loot, extra drops, blood trails, snares, and direct inventory collection.

## Player preferences

Every adaptation has an enable switch in the bottom settings row of its level screen. Server policy controls which choices are available; settings change only your player profile. Defaults preserve the standard behavior.

| Adaptation | Personal controls |
| --- | --- |
| Blood Trail | Show or hide the private trail; choose blood red, white, cyan, or gold. |
| Jump Boost, Luck, Regeneration, Resistance, Speed, Strength, Invisibility | Require 0, 5, 10, or 15 hunger before a new activation. This does not reduce consumable costs or existing hunger, poison, and unluck penalties. |
| Drop to Inventory | Toggle mob and block drop collection independently; collect all items, food, blocks, or crafting drops. The crafting preset contains leather, feathers, bones, string, gunpowder, spider eyes, slime balls, ender pearls, and blaze rods. |
| Snare Line | Require sneaking before placing a crafted snare. |

Adrenaline, Big Game Hunter, Predator Focus, and Trophy Skinner have the enable switch. Turning off Blood Trail clears that player's visible trail. Turning off Snare Line removes the owner's placed snares; it does not refund the crafted items.

## Adaptations

The seven struck buffs fire on most damage, but not on fall, void, lava, hot floor, suffocation, cramming, melting, wither damage, thorns, sonic boom, flying into a wall, or `/kill`. They stay quiet while Hunger is already present, which `preventHunterSkillsWhenHungerApplied` in the main Adapt config controls; with food left they apply the buff and Hunger, and with an empty food bar they apply Poison and no buff.

### Adrenaline (`hunter-adrenaline`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/hunter/hunter-adrenaline-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/hunter/hunter-adrenaline-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 8 knowledge, then 4 per level

Melee damage, not bow damage, rises as health falls, from nothing at full health to the configured maximum at zero health, so half health applies half of that maximum. Kills below 35 percent health count toward its challenges.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `damageBase` | `0.12` | Damage bonus fraction at 0 health before level scaling. |
| `damageFactor` | `0.21` | Extra bonus fraction added across levels, so the level 5 maximum is 0.33. |

### Hunter's Regen (`hunter-regen`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/hunter/hunter-regen-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/hunter/hunter-regen-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 8 knowledge, then 4 per level

Taking a hit applies Regeneration.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `useConsumable` | `false` | See shared struck-buff keys. |
| `poisonPenalty` | `true` | See shared struck-buff keys. |
| `stackHungerPenalty` | `false` | See shared struck-buff keys. |
| `stackPoisonPenalty` | `false` | See shared struck-buff keys. |
| `stackBuff` | `false` | See shared struck-buff keys. |
| `baseEffectbyLevel` | `30` | Regeneration lasts 30 ticks per level (1.5s at level 1, 7.5s at level 5), amplifier equal to level. |
| `baseHungerFromLevel` | `10` | Hunger amplifier is 10 minus your level. |
| `baseHungerDuration` | `50` | Hunger lasts 50 ticks per level. Poison lasts a flat 50 ticks. |
| `basePoisonFromLevel` | `6` | Poison amplifier is 6 minus your level. |
| `consumable` | `"ROTTEN_FLESH"` | Item eaten per activation when `useConsumable` is true. |

### Vanishing Step (`hunter-invis`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/hunter/hunter-invis-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/hunter/hunter-invis-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 8 knowledge, then 4 per level

Taking a hit applies Invisibility.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `useConsumable` | `false` | See shared struck-buff keys. |
| `poisonPenalty` | `true` | See shared struck-buff keys. |
| `stackHungerPenalty` | `false` | See shared struck-buff keys. |
| `stackPoisonPenalty` | `false` | See shared struck-buff keys. |
| `stackBuff` | `false` | See shared struck-buff keys. |
| `baseEffectbyLevel` | `100` | Invisibility lasts 100 ticks per level (5s at level 1, 25s at level 5), amplifier equal to level. |
| `baseHungerFromLevel` | `10` | Hunger amplifier is 10 minus your level. |
| `baseHungerDuration` | `50` | Hunger lasts 50 ticks per level. Poison lasts a flat 50 ticks. |
| `basePoisonFromLevel` | `6` | Poison amplifier is 6 minus your level. |
| `consumable` | `"ROTTEN_FLESH"` | Item eaten per activation when `useConsumable` is true. |

### Hunter's Heights (`hunter-jumpboost`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/hunter/hunter-jumpboost-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/hunter/hunter-jumpboost-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 8 knowledge, then 4 per level

Taking a hit adds jump strength `+0.1 * (level + 1)` and safe fall distance `+(level + 1)` blocks, using attributes rather than a Jump Boost effect. It does not apply while a Jump Boost effect is present or either attribute is missing.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `useConsumable` | `false` | See shared struck-buff keys. |
| `poisonPenalty` | `true` | See shared struck-buff keys. |
| `stackHungerPenalty` | `false` | See shared struck-buff keys. |
| `stackPoisonPenalty` | `false` | See shared struck-buff keys. |
| `stackBuff` | `false` | See shared struck-buff keys. |
| `baseEffectbyLevel` | `100` | Modifier duration in ticks per level (5s at level 1, 25s at level 5). |
| `baseHungerFromLevel` | `10` | Hunger amplifier is 10 minus your level. |
| `baseHungerDuration` | `50` | Hunger lasts 50 ticks per level. Poison lasts a flat 50 ticks. |
| `basePoisonFromLevel` | `6` | Poison amplifier is 6 minus your level. |
| `consumable` | `"ROTTEN_FLESH"` | Item eaten per activation when `useConsumable` is true. |

### Hunter's Luck (`hunter-luck`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/hunter/hunter-luck-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/hunter/hunter-luck-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 8 knowledge, then 4 per level

Taking a hit adds Luck `+(level + 1)`, which affects fishing and chest loot rolls. An empty food bar instead adds Luck `-(basePoisonFromLevel - level + 1)` for `baseHungerDuration` ticks, and death clears both timers.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `useConsumable` | `false` | See shared struck-buff keys. |
| `poisonPenalty` | `true` | Also gates the negative Luck penalty, not just Poison. |
| `stackHungerPenalty` | `false` | See shared struck-buff keys. |
| `stackPoisonPenalty` | `false` | Also controls whether the negative Luck penalty extends itself. |
| `stackBuff` | `false` | See shared struck-buff keys. |
| `baseEffectbyLevel` | `100` | Luck modifier duration in ticks per level (5s at level 1, 25s at level 5). |
| `baseHungerFromLevel` | `10` | Hunger amplifier is 10 minus your level. |
| `baseHungerDuration` | `50` | Hunger lasts 50 ticks per level. Poison and the Luck penalty last a flat 50 ticks. |
| `basePoisonFromLevel` | `6` | Poison amplifier is 6 minus your level, and sets the size of the Luck penalty. |
| `consumable` | `"ROTTEN_FLESH"` | Item eaten per activation when `useConsumable` is true. |

### Hunter's Speed (`hunter-speed`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/hunter/hunter-speed-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/hunter/hunter-speed-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 8 knowledge, then 4 per level

Taking a hit accelerates horizontal velocity toward `min(maxHorizontalSpeed, baseHorizontalSpeed * (1 + (level + 1) * 0.2))` blocks per tick while a movement key is held, and brakes when it is released. The burst stops when the adaptation is disabled or unlearned. Knockback without movement input does not steer it. This is not the Speed effect.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `useConsumable` | `false` | See shared struck-buff keys. |
| `poisonPenalty` | `true` | See shared struck-buff keys. |
| `stackHungerPenalty` | `false` | See shared struck-buff keys. |
| `stackPoisonPenalty` | `false` | See shared struck-buff keys. |
| `stackBuff` | `false` | When true, a new burst may overlap one still running. |
| `baseEffectbyLevel` | `100` | Burst duration in ticks per level (5s at level 1, 25s at level 5). |
| `baseHungerDuration` | `50` | Hunger lasts 50 ticks per level. Poison lasts a flat 50 ticks. |
| `baseHungerFromLevel` | `10` | Hunger amplifier is 10 minus your level. |
| `basePoisonFromLevel` | `6` | Poison amplifier is 6 minus your level. |
| `baseHorizontalSpeed` | `0.13` | Blocks per tick target speed before the level scalar is applied. |
| `maxHorizontalSpeed` | `0.32` | Hard cap on burst speed in blocks per tick. |
| `accelPerTick` | `0.045` | How much of the gap to the target speed is closed each tick. |
| `brakePerTick` | `0.08` | How fast the burst decays once you stop steering. |
| `stopThreshold` | `0.01` | Horizontal speed below this counts as stopped. |
| `hardStopOnInvalidState` | `true` | Force-clears burst velocity when the player enters a state the burst cannot run in. |
| `fallbackInputVelocityThreshold` | `0.0008` | Movement threshold used to infer steering on runtimes without the player input API. |
| `consumable` | `"ROTTEN_FLESH"` | Item eaten per activation when `useConsumable` is true. |

### Hunter's Strength (`hunter-strength`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/hunter/hunter-strength-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/hunter/hunter-strength-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 8 knowledge, then 4 per level

Taking a hit adds attack damage `+3.0 * (level + 1)` unless a Strength effect is already present.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `useConsumable` | `false` | See shared struck-buff keys. |
| `poisonPenalty` | `true` | See shared struck-buff keys. |
| `stackHungerPenalty` | `false` | See shared struck-buff keys. |
| `stackPoisonPenalty` | `false` | See shared struck-buff keys. |
| `stackBuff` | `false` | See shared struck-buff keys. |
| `baseEffectbyLevel` | `25` | Modifier duration in ticks per level (1.25s at level 1, 6.25s at level 5). |
| `baseHungerFromLevel` | `10` | Hunger amplifier is 10 minus your level. |
| `basePoisonFromLevel` | `6` | Poison amplifier is 6 minus your level. |
| `baseHungerDuration` | `50` | Hunger lasts 50 ticks per level. Poison lasts a flat 50 ticks. |
| `consumable` | `"ROTTEN_FLESH"` | Item eaten per activation when `useConsumable` is true. |

### Hunter's Resistance (`hunter-resistance`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/hunter/hunter-resistance-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/hunter/hunter-resistance-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 8 knowledge, then 4 per level

Taking a hit applies Resistance.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `useConsumable` | `false` | See shared struck-buff keys. |
| `poisonPenalty` | `true` | See shared struck-buff keys. |
| `stackHungerPenalty` | `false` | See shared struck-buff keys. |
| `stackPoisonPenalty` | `false` | See shared struck-buff keys. |
| `stackBuff` | `false` | See shared struck-buff keys. |
| `baseEffectbyLevel` | `10` | Resistance lasts 10 ticks per level (0.5s at level 1, 2.5s at level 5), amplifier equal to level. |
| `baseHungerFromLevel` | `10` | Hunger amplifier is 10 minus your level. |
| `baseHungerDuration` | `50` | Hunger lasts 50 ticks per level. Poison lasts a flat 50 ticks. |
| `basePoisonFromLevel` | `6` | Poison amplifier is 6 minus your level. |
| `consumable` | `"ROTTEN_FLESH"` | Item eaten per activation when `useConsumable` is true. |

### Items Drop-To-Inventory (`hunter-drop-to-inventory`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/hunter/hunter-drop-to-inventory-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/hunter/hunter-drop-to-inventory-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

1 level · 2 knowledge

Drops from any mob kill go to the inventory regardless of the held item; block drops route only while a sword is in the main hand. Protection-denied pickups stay on the ground, overflow drops at the feet, the level cap is 1, and there are no adaptation-specific config keys.

### Trophy Skinner (`hunter-trophy-skinner`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/hunter/hunter-trophy-skinner-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/hunter/hunter-trophy-skinner-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 5 knowledge

A kill is clean when the shot covered the minimum range or the killing blow was dealt while sneaking, and a clean kill rolls trophy materials and a head. Materials are `GUNPOWDER`, `BONE`, `ROTTEN_FLESH`, `STRING`, `BLAZE_POWDER`, `ENDER_PEARL`, `REDSTONE`, `PORKCHOP`, or `LEATHER` as the fallback; heads exist only for creepers, skeletons, strays, bogged, wither skeletons, zombies, husks, drowned, zombified piglins, piglins, and piglin brutes.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `dropChanceBase` | `0.14` | Trophy chance at level 0, 0 to 1. |
| `dropChanceFactor` | `0.3` | Trophy chance added across levels, 0 to 1. |
| `maxDropChance` | `0.5` | Ceiling on trophy chance, 0 to 1. |
| `headChanceBase` | `0.015` | Head chance at level 0, 0 to 1. |
| `headChanceFactor` | `0.08` | Head chance added across levels, 0 to 1. |
| `maxHeadChance` | `0.12` | Ceiling on head chance, 0 to 1. |
| `trophyAmountBase` | `1` | Trophy stack size at level 0, before rounding. |
| `trophyAmountFactor` | `2` | Extra stack size added across levels. A projectile kill adds 1 more, and the stack is capped at 8. |
| `minimumRangeBase` | `18` | Blocks a shot must cover at level 0 to count as precise. |
| `minimumRangeFactor` | `10` | Blocks subtracted from that requirement across levels, floored at 4. |
| `xpPerTrophy` | `16` | Hunter XP paid per trophy drop. |

### Predator Focus (`hunter-predator-focus`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/hunter/hunter-predator-focus-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/hunter/hunter-predator-focus-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 6 knowledge, then 5 per level

Melee hits on the same target add `perStackBonus * (stacks - 1)` damage after the first hit, which sets one stack and adds nothing, up to `rampCapBase + round(levelPercent * rampCapFactor)` stacks. A different target, or a gap longer than `decayMillis`, resets the ramp to one stack.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `perStackBonus` | `0.07` | Melee damage added per stack past the first, as a fraction. |
| `rampCapBase` | `3` | Stack cap at level 0. |
| `rampCapFactor` | `6` | Extra stack cap gained across levels. |
| `decayMillis` | `3500` | Milliseconds of no hits before the ramp resets to one stack. |
| `xpPerRampedHit` | `2` | Silent Hunter XP per hit that actually gained a bonus. |

### Big Game Hunter (`hunter-big-game`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/hunter/hunter-big-game-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/hunter/hunter-big-game-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 7 knowledge, then 6 per level

Melee damage increases against `RAVAGER`, `IRON_GOLEM`, `WARDEN`, `WITHER`, `ENDER_DRAGON`, and `ELDER_GUARDIAN`. Any credited kill of those mobs can duplicate items already in the drop list.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `bonusDamageBase` | `0.15` | Melee damage bonus fraction at level 0. |
| `bonusDamageFactor` | `0.45` | Bonus fraction added across levels, reaching 0.6 at max level. |
| `extraDropChanceBase` | `0.15` | Chance per existing drop to be duplicated, at level 0. |
| `extraDropChanceFactor` | `0.45` | Duplication chance added across levels. |
| `maxExtraDropChance` | `0.75` | Ceiling on duplication chance, 0 to 1. |
| `maxExtraDropsPerKill` | `6` | Hard cap on duplicated stacks from one kill. |
| `xpPerBigGameKill` | `45` | Hunter XP paid per big-game kill. |

### Blood Trail (`hunter-blood-trail`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/hunter/hunter-blood-trail-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/hunter/hunter-blood-trail-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 5 knowledge, then 4 per level

A melee hit that leaves a mob at or below `woundHealthFraction` of max health starts a private trail along its path, redrawn four times a second, until the mob leaves tracking range, changes world, or the wound ends. Duration is `trailDurationTicksBase + round(levelPercent * trailDurationTicksFactor)` ticks and range is `rangeBase + levelPercent * rangeFactor` blocks.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `trailDurationTicksBase` | `100` | Wound lifetime in ticks at level 0. |
| `trailDurationTicksFactor` | `200` | Extra wound lifetime in ticks across levels. |
| `rangeBase` | `16` | Blocks you can be from the mob and still see the trail, at level 0. |
| `rangeFactor` | `32` | Extra tracking range in blocks across levels. |
| `woundHealthFraction` | `0.5` | Fraction of max health the hit must leave the target at or below. |
| `maxTrackedWounds` | `64` | Cap on simultaneously tracked wounds. Also the per-tick render budget. |
| `trailThickness` | `0.06` | Width of each drawn trail segment, in blocks. |
| `displayDurationTicks` | `30` | How long each drawn segment stays visible, in ticks. |
| `xpPerWound` | `3` | Silent Hunter XP the first time you wound a given target. |

### Snare Line (`hunter-snare-line`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/hunter/hunter-snare-line-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/hunter/hunter-snare-line-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 6 knowledge, then 5 per level

Learning it adds shaped recipe `hunter-snare` (`S S` / `SIS` / `S S`, `S` = `STRING`, `I` = `IRON_INGOT`) producing 2 tripwire hooks named Hunter's Snare and tagged `adapt:hunter-snare-item`; only a tagged item places a snare one block above a right-clicked block top and consumes one item. `Monster` entities in range are rooted, with momentum cleared, by a movement-speed multiplier of `-min(1, 0.15 * (rootAmplifier + 1))`, mobs friendly to the owner are skipped, root duration is `max(1, rootDurationTicksBase + round(levelPercent * rootDurationTicksFactor))` ticks, and charges are `max(1, chargesBase + round(levelPercent * chargesFactor))`.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `rootDurationTicksBase` | `30` | Root duration in ticks at level 0. |
| `rootDurationTicksFactor` | `50` | Extra root duration in ticks across levels. |
| `chargesBase` | `3` | Trigger charges per snare at level 0. |
| `chargesFactor` | `5` | Extra trigger charges across levels. |
| `triggerRadius` | `1.6` | Blocks from the snare a monster must enter to trip it. |
| `rootAmplifier` | `6` | Slowness-equivalent amplifier. Each point is 15 percent speed reduction, capped at a full stop. |
| `rearmBufferMillis` | `500` | Extra milliseconds after a root ends before the same snare can re-trigger on that mob. |
| `snareLifetimeTicks` | `2400` | Ticks a placed snare survives before decaying (2 minutes). |
| `maxSnaresPerPlayer` | `4` | Snares one player may keep placed at once. Placing more plays a deny sound. |
| `maxActiveSnares` | `64` | Snares this server processes at once. Placement silently fails past this. |
| `maxTargetsPerScan` | `8` | Monsters one snare will schedule for rooting per scan. |
| `xpPerSnare` | `6` | Hunter XP paid per mob snared. |

## Reference

### Skill configuration defaults

Written to `plugins/Adapt/skills/hunter.toml` on first load.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `enabled` | `true` | Turns the whole Hunter skill on or off. |
| `skillColor` | `"&c"` | Legacy ampersand color code used for Hunter in menus and text. |
| `getXpForAttackingWithTools` | `true` | Master switch for the kill handler. False means no kill XP, no kill stats, and no boss celebration. |
| `creeperKillMultiplier` | `2` | Extra multiplier applied to XP from creeper kills only. |
| `killMaxHealthXPMultiplier` | `3.0` | XP per point of the victim's max health. |
| `cooldownDelay` | `1000` | Milliseconds that must pass between two kill XP awards for the same player. |
| `spawnerMobReductionXpMultiplier` | `0.3` | Multiplier applied when the victim spawned from a monster spawner. |
| `killsChallengeReward` | `500` | Base XP paid by the kill-count challenges. Some tiers pay 2x or 5x this. |
| `bossKillReward` | `1000` | Base XP paid by the boss challenges. The 10-boss tier pays 5x this. |

### Shared knobs

The seven struck buffs also share this knob set:

| Key | Behavior / units |
|-----|------------------|
| `useConsumable` | When true, activation eats one `consumable` item instead of applying Hunger. |
| `consumable` | Material name consumed when `useConsumable` is true. |
| `poisonPenalty` | When true, activating on an empty food bar applies Poison. |
| `stackHungerPenalty` | When true, repeat triggers raise the Hunger amplifier instead of refreshing it. |
| `stackPoisonPenalty` | When true, repeat starve triggers raise the Poison amplifier instead of refreshing it. |
| `stackBuff` | When true, repeat triggers extend or raise the buff while it is still running. |
| `baseEffectbyLevel` | Buff duration in ticks per adaptation level (20 ticks = 1 second). |
| `baseHungerFromLevel` | Hunger amplifier is this minus your level. |
| `baseHungerDuration` | Hunger duration in ticks per level. Also the flat Poison duration when starving. |
| `basePoisonFromLevel` | Poison amplifier is this minus your level. |

### Challenges

| Challenge | Threshold | Reward knob |
|---|---|---|
| `challenge_novice_hunter` | 100 | `killsChallengeReward` |
| `challenge_intermediate_hunter` | 500 | `killsChallengeReward` x2 |
| `challenge_advanced_hunter` | 5000 | `killsChallengeReward` x5 |
| `challenge_creeper_conqueror` | 50 | `killsChallengeReward` |
| `challenge_creeper_annihilator` | 200 | `killsChallengeReward` x2 |
| `challenge_kills_500` | 500 | `killsChallengeReward` |
| `challenge_kills_5k` | 5000 | `killsChallengeReward` x5 |
| `challenge_boss_1` | 1 | `bossKillReward` |
| `challenge_boss_10` | 10 | `bossKillReward` x5 |

## See also

Catalog: [Skills](/adapt/10-skills-catalog). Rules: [Concepts](/adapt/02-concepts).
