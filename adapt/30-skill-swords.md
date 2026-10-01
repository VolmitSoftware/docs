---
title: "Skill - Swords"
description: "Swords XP sources, adaptations, controls, and configuration"
published: true
date: 2026-10-01T09:26:23.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Adaptations add dual-wield bonuses, low-health damage, counters, attack-speed chains, lunges, area attacks, poison, bleeding, slowing, absorption, duel bonuses, foliage clearing, temporary sharpening, and a named sword that gains damage from kills.

## Player preferences

Every adaptation has an enable switch in the bottom settings row of its level screen. Server policy controls which choices are available; settings change only your player profile. Defaults preserve the standard behavior.

| Adaptation | Personal controls |
| --- | --- |
| Bloody Blade, Poisoned Blade | Affect all permitted targets, hostile mobs, or non-player targets. |
| Crimson Cyclone | Require sneaking during the critical hit; ignore passive secondary targets; toggle bleed particles. |
| Duelist's Focus | Toggle the focused attacker's glow separately from combat bonuses. |
| Heirloom Edge | Grow all renamed swords or only diamond, netherite, or both. Existing banked item bonuses and records remain on the item. |
| Lunge Strike | Require an airborne sprint attack. |
| Machete | Require sneaking; cut all supported foliage, leaves, grass/ferns, or vines. |
| Whetstone Ritual | Keep 0%, 25%, or 50% durability and 0, 5, 10, or 30 experience levels after the full ritual cost. |

Blade Flow, Crescent Guard, Dual Wield, Executioner's Edge, Hamstring, and Riposte Window have the enable switch. Reserve checks reject the entire ritual before either resource is spent.

## Adaptations

Nearly every adaptation needs a sword in the main hand: wooden, stone, copper, iron, golden, diamond, or netherite.

### Machete (`sword-machete`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/swords/sword-machete-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/swords/sword-machete-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

3 levels · 7 knowledge, then 4 per level

Left-click with a sword to cut foliage in a sphere centered 2.25 blocks along your look and half a block below eye level; each block is cut with probability `levelPercent * 2.8 / distanceSquared`, pays 11.25 skill XP, and still fires a normal block-break, so a denied break denies the cut. It cuts grass and tall grass, fern and large fern, dead bush, vine, cactus, sugar cane, bamboo and bamboo sapling, seagrass and tall seagrass, lily pad, cocoa, carrot, potato, nether wart, brown and red mushroom, the six small flowers plus dandelion, cornflower, chorus flower, sunflower, lilac, peony, rose bush and wither rose, and the six vanilla leaf types plus mangrove leaves.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `radiusBase` | `0.6` | Cut radius in blocks at level 0 percent. |
| `radiusFactor` | `2.36` | Extra cut radius in blocks gained at max level. |
| `cooldownTicksBase` | `7` | Floor of the item cooldown in ticks, reached at max level. |
| `cooldownTicksSlowest` | `35` | Extra cooldown ticks added at level 0 percent. Cooldown is `cooldownTicksBase + (1 - levelPercent) * cooldownTicksSlowest`. |
| `toolDamageBase` | `1` | Floor of the durability cost per cut block, reached at max level. |
| `toolDamageInverseLevelFactor` | `5` | Extra durability per cut block at level 0 percent. Cost is `toolDamageBase + toolDamageInverseLevelFactor * (1 - levelPercent)`. |

### Poisoned Blade (`sword-poison-blade`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/swords/sword-poison-blade-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/swords/sword-poison-blade-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

7 levels · 7 knowledge

Sword hits apply Poison at amplifier 2 for `50 * level` ticks; the menu duration instead shows `effectDuration * level` milliseconds, and those two durations do not match at the defaults. Poison-immune mobs (zombies, skeletons, phantoms, wither, zoglin, giant, spiders, and skeleton and zombie horses) take 1 health instead, and a kill within 4000 ms of the poison expiring still counts as a poison kill.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `cooldown` | `5000` | Minimum milliseconds between poison applications. The effective cooldown is the larger of this and the level-scaled effect duration. |
| `effectDuration` | `1000` | Milliseconds of effect duration granted per adaptation level. Drives the cooldown floor and the bleed visual length, and is what the menu duration line shows. |

### Bloody Blade (`sword-bloody-blade`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/swords/sword-bloody-blade-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/swords/sword-bloody-blade-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

7 levels · 7 knowledge

Sword hits start an armor-ignoring bleed that procs every 5 ticks, `ceil(durationTicks / 5)` times with a minimum of 1. Each proc is rechecked against protection and friendly rules, never hits your tamed pets, records the health and absorption actually removed, and a kill within 4000 ms of expiry still counts as a bleed kill.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `cooldown` | `5000` | Minimum milliseconds between bleed applications. The effective cooldown is the larger of this and the level-scaled bleed duration. |
| `damagePerBleedProc` | `0.5` | Health points dealt by each bleed proc (2 points = 1 heart). Floored at 0.01. |
| `effectDuration` | `1000` | Milliseconds of bleed duration granted per adaptation level. |

### Dual Wield Stance (`sword-dual-wield`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/swords/sword-dual-wield-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/swords/sword-dual-wield-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 5 knowledge

A sword in each hand multiplies melee damage: the exact same material uses the matching multiplier, different materials use the mixed multiplier, and the result is clamped to at least 1.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `sameWeaponBase` | `1.12` | Damage multiplier with two identical swords, before level scaling. |
| `sameWeaponFactor` | `0.43` | Extra matching multiplier gained at max level. |
| `mixedWeaponBase` | `1.06` | Damage multiplier with two different swords, before level scaling. |
| `mixedWeaponFactor` | `0.28` | Extra mixed multiplier gained at max level. |
| `xpPerDamage` | `2.0` | Skill XP per point of final damage on a dual-wield hit. |

### Executioner's Edge (`sword-executioners-edge`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/swords/sword-executioners-edge-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/swords/sword-executioners-edge-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

6 levels · 4 knowledge, then 3 per level

A sword hit deals bonus damage when the target's current health over its maximum is at or below the threshold, and the stat counts every buffed hit, not only kills.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `bonusDamageBase` | `0.08` | Bonus damage as a fraction of base damage, before level scaling. |
| `bonusDamageFactor` | `0.42` | Extra damage fraction gained at max level. |
| `thresholdBase` | `0.22` | Target health fraction at or below which the bonus applies, before level scaling. |
| `thresholdFactor` | `0.33` | Extra threshold fraction gained at max level. |
| `maxThreshold` | `0.65` | Hard cap on the health fraction threshold, 0-1. |
| `xpPerBuffedDamage` | `1.9` | Skill XP per point of buffed damage dealt. |

### Riposte Window (`sword-riposte-window`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/swords/sword-riposte-window-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/swords/sword-riposte-window-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge

Blocking a hit with a raised shield in either hand arms a riposte; the window starts when the block lands, not on a timed parry, and the first sword hit inside it consumes the window.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `windowMillisBase` | `350` | Milliseconds the riposte stays armed, before level scaling. Floored at 150 ms. |
| `windowMillisFactor` | `550` | Extra armed milliseconds gained at max level. |
| `damageBonusBase` | `0.22` | Riposte bonus as a fraction of base damage, before level scaling. |
| `damageBonusFactor` | `0.75` | Extra bonus fraction gained at max level. |
| `xpPerBuffedDamage` | `1.8` | Skill XP per point of riposte damage dealt. |

### Crimson Cyclone (`sword-crimson-cyclone`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/swords/sword-crimson-cyclone-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/swords/sword-crimson-cyclone-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 5 knowledge

A falling sword swing adds cyclone damage to that hit, damages other living entities in the radius for the same amount, and bleeds each of them. Secondary targets are checked against PvP and PvE, your tamed pets are never hit, and provoked neutrals stay excluded when `ignore passiveMobs` is true.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `ignorePassiveMobs` | `false` | Exclude passive and neutral mobs from secondary cyclone damage and bleed; the directly struck target is unchanged. |
| `showBleedParticles` | `true` | Shows the crimson roots bleed particle on hit targets. |
| `radiusBase` | `2.6` | Cyclone radius in blocks, before level scaling. |
| `radiusFactor` | `2.4` | Extra radius gained at max level. |
| `baseDamage` | `2.0` | Cyclone damage in health points, before level scaling. |
| `damageFactor` | `4.0` | Extra cyclone damage gained at max level. |
| `bleedTicksBase` | `40` | Bleed duration in ticks, before level scaling. Floored at 20 ticks. |
| `bleedTicksFactor` | `90` | Extra bleed ticks gained at max level. |
| `bleedDamagePerProcBase` | `0.35` | Health points per bleed proc, before level scaling. Floored at 0.01. |
| `bleedDamagePerProcFactor` | `0.45` | Extra bleed damage per proc gained at max level. |
| `hungerCostBase` | `2` | Food points spent per cyclone at level 0 percent. |
| `hungerCostFactor` | `2` | Food points removed from the cost at max level. The cost falls as you level and floors at 1. |
| `durabilityCostBase` | `3` | Sword durability spent per cyclone at level 0 percent. |
| `durabilityCostFactor` | `1.5` | Durability removed from the cost at max level. The cost falls as you level and floors at 1. |
| `cooldownTicksBase` | `320` | Cooldown in ticks at level 0 percent (20 ticks = 1 second). |
| `cooldownTicksFactor` | `160` | Cooldown ticks removed at max level. Floors at 40 ticks. |
| `xpPerTargetHit` | `10` | Skill XP per target hit by the cyclone. |
| `maxCandidatesPerActivation` | `16` | Maximum living entities inspected per activation. Hard cap 32. |
| `maxAffectedPerActivation` | `12` | Maximum targets damaged per activation, including the primary. Hard cap 16. |
| `maxTargetFxPerActivation` | `9` | Maximum targets that get individual spark effects. Hard cap 12. |

### Lunge Strike (`sword-lunge-strike`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/swords/sword-lunge-strike-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/swords/sword-lunge-strike-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge

A sprinting sword attack lunges you forward and grants bonus entity reach for the swing that started it. Horizontal surge is `lungeForce + (bonusReach * reachVelocityFactor)`, capped at `maxSurge`, added to your current velocity with `verticalBoost` on Y; reach is an `ENTITY_INTERACTION_RANGE` modifier on the `reach` slot.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `forceBase` | `0.35` | Forward velocity magnitude, before level scaling. |
| `forceFactor` | `0.45` | Extra forward velocity gained at max level. |
| `reachBase` | `0.8` | Bonus entity interaction range in blocks, before level scaling. |
| `reachFactor` | `1.8` | Extra bonus reach gained at max level. |
| `reachVelocityFactor` | `0.12` | How much of the bonus reach is folded back into the lunge velocity. |
| `verticalBoost` | `0.18` | Vertical velocity component of the lunge. |
| `reachWindowTicks` | `12` | Ticks the bonus reach modifier lasts. Floored at 5. |
| `maxSurge` | `1.1` | Hard cap on total horizontal lunge velocity. |
| `cooldownMillis` | `350` | Minimum milliseconds between lunges. |
| `xpPerLunge` | `6` | Skill XP per lunge. |

### Blade Flow (`sword-blade-flow`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/swords/sword-blade-flow-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/swords/sword-blade-flow-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 5 knowledge

Each sword hit adds a flow stack worth 0.10 attack speed, applied as `ADD_SCALAR` on `ATTACK_SPEED` in the `flow` slot, and any damage you take clears the stack.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `stackCapBase` | `1.5` | Maximum flow stacks, before level scaling. Rounded, minimum 1. |
| `stackCapFactor` | `4.5` | Extra stack cap gained at max level. |
| `windowMillis` | `4000` | Milliseconds a stack survives without a new sword hit. |
| `xpPerStack` | `3` | Skill XP per stack gained. |

### Duelist's Focus (`sword-duelists-focus`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/swords/sword-duelists-focus-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/swords/sword-duelists-focus-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 5 knowledge

While exactly one hostile mob or player is inside the engage radius, sword damage rises and incoming damage falls; a second one stops both, and the defence half also requires a sword in the main hand. The attacker, or a projectile's shooter, receives Glowing that never shortens a longer existing glow.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `bonusDamageBase` | `0.10` | Bonus damage as a fraction of base damage, before level scaling. |
| `bonusDamageFactor` | `0.35` | Extra damage fraction gained at max level. |
| `reductionBase` | `0.08` | Incoming damage reduction fraction, before level scaling. |
| `reductionFactor` | `0.30` | Extra reduction fraction gained at max level. |
| `maxReduction` | `0.40` | Hard cap on the reduction fraction, 0-1. |
| `engageRadius` | `7` | Radius in blocks searched for engaged monsters and players. |
| `threatGlowTicks` | `30` | Ticks the current threat glows after it hits you. Clamped to 1-100. |
| `xpPerFocusedHit` | `4` | Skill XP per focused hit. |

### Whetstone Ritual (`sword-whetstone-ritual`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/swords/sword-whetstone-ritual-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/swords/sword-whetstone-ritual-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 5 knowledge

Sneak-right-click a grindstone with a sword in the main hand to apply an `ATTACK_DAMAGE` modifier on the `sharp` slot worth `3.0 * (amplifier + 1)` health; it is not the Sharpness enchantment and not the Strength potion, and the grindstone GUI does not open. Missing XP levels plays a fail effect and aborts, and a durability cost that would break the sword aborts with no effect.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `strengthBase` | `0` | Buff amplifier before level scaling. Amplifier 0 is one tier. |
| `strengthFactor` | `2` | Extra amplifier tiers gained at max level. |
| `durationTicksBase` | `200` | Buff duration in ticks, before level scaling. Floored at 40 ticks. |
| `durationTicksFactor` | `400` | Extra buff ticks gained at max level. |
| `durabilityCost` | `15` | Durability taken from the sword per ritual. |
| `xpCost` | `2` | Vanilla experience levels spent per ritual. |
| `cooldownMillis` | `60000` | Minimum milliseconds between rituals. |
| `skillXpOnRitual` | `14` | Skill XP per ritual. |

### Crescent Guard (`sword-crescent-guard`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/swords/sword-crescent-guard-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/swords/sword-crescent-guard-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 5 knowledge

A kill with a sword in the main hand grants Absorption, and a later kill never replaces a higher amplifier, a longer duration, or an infinite effect. Points granted are `4 * (amplifier + 1)`, clamped to the max-absorption attribute, and current absorption only rises.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `amplifierBase` | `0` | Absorption amplifier, before level scaling. Amplifier 0 grants 4 absorption points, which is 2 hearts. |
| `amplifierFactor` | `2` | Extra amplifier tiers gained at max level. |
| `durationTicksBase` | `120` | Guard duration in ticks, before level scaling. Floored at 20 ticks. |
| `durationTicksFactor` | `180` | Extra guard ticks gained at max level. |
| `xpPerGuard` | `8` | Skill XP per guarded kill. |

### Hamstring (`sword-hamstring`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/swords/sword-hamstring-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/swords/sword-hamstring-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge

A sword hit slows a sprinting player or any other target at or above the flee speed, and a sprinting player's sprint is cancelled. The slow is a `MOVEMENT_SPEED` modifier on the `slow` slot (`MULTIPLY_SCALAR_1` of `-0.15 * (tier + 1)`, clamped to -1), not the Slowness potion, so it has no effect icon and milk does not remove it.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `slowTierBase` | `0` | Slow tier, before level scaling. Tier 0 is a 15 percent movement speed cut. |
| `slowTierFactor` | `2` | Extra slow tiers gained at max level. Each tier adds another 15 percent. |
| `durationTicksBase` | `40` | Slow duration in ticks, before level scaling. |
| `durationTicksFactor` | `80` | Extra slow ticks gained at max level. |
| `fleeSpeedThreshold` | `0.14` | Horizontal velocity at or above which a non-sprinting target counts as fleeing. |
| `xpPerHamstring` | `5` | Skill XP per hamstring. |

### Heirloom Edge (`sword-heirloom-edge`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/swords/sword-heirloom-edge-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/swords/sword-heirloom-edge-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 6 knowledge

Renaming a sword in an anvil stamps Heirloom Edge lore on that item, and kills while you hold it bank permanent attack damage onto the item, which keeps that bonus if dropped, stored, or given away. The item stores `heirloom_edge`, `heirloom_edge_kills`, `heirloom_edge_bonus`, `heirloom_edge_damage`, and `heirloom_edge_lore`; the bonus is an `ATTACK_DAMAGE` `ADD_NUMBER` on the item's mainhand slot, added on top of vanilla damage, and kills stop banking once the cap is reached.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `growthBase` | `0.15` | Attack damage added per bank, before level scaling. |
| `growthFactor` | `0.6` | Extra damage per bank gained at max level. |
| `capBase` | `1.0` | Ceiling on the total banked attack damage, before level scaling. |
| `capFactor` | `4.0` | Extra cap gained at max level. |
| `killsPerBank` | `5` | Kills with the heirloom in hand required to bank one growth step. Minimum 1. |
| `xpPerBank` | `12` | Skill XP per banked step. |

## Reference

Adapt treats `WOODEN_SWORD`, `STONE_SWORD`, `COPPER_SWORD`, `IRON_SWORD`, `GOLDEN_SWORD`, `DIAMOND_SWORD`, and `NETHERITE_SWORD` as swords.

### Skill XP sources

| Trigger | Award | Notes |
|---------|-------|-------|
| Damaging a valid living entity with a sword in the main hand | `damageXPMultiplier` times the damage dealt | Rate-limited by `cooldownDelay`. Stats are added before the rate limit, so `sword.hits` and `sword.damage` always count. Parrots and the invalid-damageable entity listing are excluded. |
| Killing with a sword in the main hand | No XP | Adds `sword.kills` only. |

A hit counts as critical for `sword.critical` when the attacker's fall distance is above 0 and the attacker is not on the ground. A hit counts as heavy for `sword.heavy.hits` when the event damage is above 8.

### Skill configuration defaults

Written to `plugins/Adapt/skills/swords.toml` on first load.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `enabled` | `true` | Set to false to disable the whole skill. |
| `skillColor` | `"&e"` | Legacy ampersand color code used for this skill in menus and text. |
| `cooldownDelay` | `1250` | Milliseconds between sword damage XP awards, per player. |
| `damageXPMultiplier` | `4.5` | Multiplier applied to sword damage dealt when converting it to XP. |
| `challengeSwordReward` | `500` | XP paid for `challenge_sword_100`. The 1k tier pays double and the 10k tier pays five times this value. |
| `challengeSwordDmgReward` | `500` | XP paid for `challenge_sword_dmg_1k`. The 10k tier pays triple. |
| `challengeSwordKillsReward` | `500` | XP paid for `challenge_sword_kills_50`. The 500 tier pays triple. |
| `challengeSwordCritReward` | `500` | XP paid for `challenge_sword_crit_50`. The 500 tier pays triple. |
| `challengeSwordHeavyReward` | `500` | XP paid for `challenge_sword_heavy_25`. The 250 tier pays triple. |

### Challenges

| Challenge | Threshold | Reward knob |
|---|---|---|
| `challenge_sword_100` | 100 | `challengeSwordReward` |
| `challenge_sword_1k` | 1000 | `challengeSwordReward` x2 |
| `challenge_sword_10k` | 10000 | `challengeSwordReward` x5 |
| `challenge_sword_dmg_1k` | 1000 | `challengeSwordDmgReward` |
| `challenge_sword_dmg_10k` | 10000 | `challengeSwordDmgReward` x3 |
| `challenge_sword_kills_50` | 50 | `challengeSwordKillsReward` |
| `challenge_sword_kills_500` | 500 | `challengeSwordKillsReward` x3 |
| `challenge_sword_crit_50` | 50 | `challengeSwordCritReward` |
| `challenge_sword_crit_500` | 500 | `challengeSwordCritReward` x3 |
| `challenge_sword_heavy_25` | 25 | `challengeSwordHeavyReward` |
| `challenge_sword_heavy_250` | 250 | `challengeSwordHeavyReward` x3 |

## See also

Catalog: [Skills](/adapt/10-skills-catalog). Rules: [Concepts](/adapt/02-concepts).
