---
title: "Skill - Swords"
description: "Swords XP sources, adaptations, controls, and configuration"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Adaptations add dual-wield bonuses, low-health damage, counters, attack-speed chains, lunges, area attacks, poison, bleeding, slowing, absorption, duel bonuses, foliage clearing, temporary sharpening, and a named sword that gains damage from kills.

## Adaptations

All of this needs the adaptation learned to level 1 or higher, the skill and the adaptation enabled in config, the matching `adapt.use.*` permission, and protection and region policy that allow the action. Nearly every adaptation here also needs a sword in your main hand: wooden, stone, copper, iron, golden, diamond, or netherite.

### Machete (`sword-machete`)

3 levels · 7 knowledge, then 4 per level

Left-click with a sword and you cut a sphere of foliage in front of you. That
foliage includes grass, ferns, vines, flowers, leaves, bamboo, sugar cane,
seagrass, mushrooms, and crops. Blocks nearer the center are more likely to be cut, and each block cut chews a bit of durability off the sword.

Higher levels give a bigger radius, a shorter cooldown, and less wear per block. Every cut block pays skill XP, so clearing a jungle is a real levelling route.

1. Learn Machete.
2. Hold a sword.
3. Left-click at the foliage in front of you.
4. Wait for the item cooldown to clear before the next swing.

Each block still goes through a normal block break event, so a region plugin that would deny you the break denies the cut.

Menu stat lines: Slash Radius. Chop Cooldown. Tool Wear.

The cut sphere is centered 2.25 blocks along your look vector and half a block below eye level, and each block inside it is cut with probability `levelPercent * 2.8 / distanceSquared`, so the center is reliable and the edge is sparse. It cuts grass and tall grass, fern and large fern, dead bush, vine, cactus, sugar cane, bamboo and bamboo sapling, seagrass and tall seagrass, lily pad, cocoa, carrot, potato, nether wart, brown and red mushroom, the six small flowers plus dandelion, cornflower, chorus flower, sunflower, lilac, peony, rose bush and wither rose, and the six vanilla leaf types plus mangrove leaves. Skill XP is `11.25` per block cut, and durability taken is `damagePerBlock * blocksCut`.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `radiusBase` | `0.6` | Cut radius in blocks at level 0 percent. |
| `radiusFactor` | `2.36` | Extra cut radius in blocks gained at max level. |
| `cooldownTicksBase` | `7` | Floor of the item cooldown in ticks, reached at max level. |
| `cooldownTicksSlowest` | `35` | Extra cooldown ticks added at level 0 percent. Cooldown is `cooldownTicksBase + (1 - levelPercent) * cooldownTicksSlowest`. |
| `toolDamageBase` | `1` | Floor of the durability cost per cut block, reached at max level. |
| `toolDamageInverseLevelFactor` | `5` | Extra durability per cut block at level 0 percent. Cost is `toolDamageBase + toolDamageInverseLevelFactor * (1 - levelPercent)`. |

### Poisoned Blade (`sword-poison-blade`)

7 levels · 7 knowledge

Sword hits apply Poison III to the target and spray a blood-and-fern visual. Mobs that vanilla treats as poison-immune take a small damaging bleed instead.
Those mobs include zombies, skeletons, phantoms, wither, zoglin, giant, spiders,
and skeleton and zombie horses. The bleed keeps the adaptation doing something.

There is a cooldown between applications, so it is one proc per fight opener rather than a stack on every swing. Kills that happen while your poison is still on the target credit you a poison kill.

Menu stat lines: Striking a Living entity with your Sword causes Poison. Poison Duration. Poison Cooldown.

The applied potion effect is `POISON` at amplifier 2 for `50 * level` ticks. The menu's Poison Duration line instead shows `effectDuration * level`
milliseconds. The displayed duration and the applied potion duration are
computed from different numbers. They do not match at default settings. The cooldown is `max(cooldown, effectDuration * level)` milliseconds. Poison-immune targets take a bleed of 1 health per proc instead. A kill within `4000` ms of the poison expiring still credits a poison kill.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `cooldown` | `5000` | Minimum milliseconds between poison applications. The effective cooldown is the larger of this and the level-scaled effect duration. |
| `effectDuration` | `1000` | Milliseconds of effect duration granted per adaptation level. Drives the cooldown floor and the bleed visual length, and is what the menu duration line shows. |

### Bloody Blade (`sword-bloody-blade`)

7 levels · 7 knowledge

Sword hits start a bleed on the target that ticks damage every quarter second for a level-scaled duration. It ignores armor because it is direct damage, which makes it strong against heavily armored targets.

Every single bleed tick is re-authorized against your protection rules and your friendly-entity rules before it lands. A bleed cannot follow a target into a region where you are not allowed to hurt it. It never hurts your own tamed pets.

Menu stat lines: Striking a Living entity with your Sword causes Bleeding. Bleed Duration. Bleed Cooldown.

Bleed duration is `effectDuration * level` milliseconds and procs land every `5` ticks, so the proc count is `ceil(durationTicks / 5)` with a minimum of 1. The bleed damage stat records the health and absorption actually removed, and a kill within `4000` ms of the bleed expiring still credits a bleed kill.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `cooldown` | `5000` | Minimum milliseconds between bleed applications. The effective cooldown is the larger of this and the level-scaled bleed duration. |
| `damagePerBleedProc` | `0.5` | Health points dealt by each bleed proc (2 points = 1 heart). Floored at 0.01. |
| `effectDuration` | `1000` | Milliseconds of bleed duration granted per adaptation level. |

### Dual Wield Stance (`sword-dual-wield`)

5 levels · 5 knowledge

Hold a sword in your main hand and a sword in your off hand and every melee hit is multiplied. Two swords of the same material give the bigger multiplier. A mismatched pair gives a smaller one. Fill both hands.

Menu stat lines: Matching Sword Bonus. Mixed Sword Bonus.

Matching means the exact same material. The multiplier is clamped to a minimum of 1, so a base below 1 cannot reduce your damage. XP is the final damage times `xpPerDamage`.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `sameWeaponBase` | `1.12` | Damage multiplier with two identical swords, before level scaling. |
| `sameWeaponFactor` | `0.43` | Extra matching multiplier gained at max level. |
| `mixedWeaponBase` | `1.06` | Damage multiplier with two different swords, before level scaling. |
| `mixedWeaponFactor` | `0.28` | Extra mixed multiplier gained at max level. |
| `xpPerDamage` | `2.0` | Skill XP per point of final damage on a dual-wield hit. |

### Executioner's Edge (`sword-executioners-edge`)

6 levels · 4 knowledge, then 3 per level

Sword hits against a target already below a health threshold deal extra damage. Both the threshold and the bonus grow with level, and the threshold is capped so it never turns into a full-health execute.

Land five buffed hits inside ten seconds and you get an advancement.

Menu stat lines: Bonus Damage. Health Threshold.

The trigger is the target's current health over its maximum being at or below the threshold, and the stat counts every buffed hit, not only lethal ones. The `challenge_swords_execute_5in10` advancement comes from 5 buffed hits within 10 seconds and has no stat milestone.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `bonusDamageBase` | `0.08` | Bonus damage as a fraction of base damage, before level scaling. |
| `bonusDamageFactor` | `0.42` | Extra damage fraction gained at max level. |
| `thresholdBase` | `0.22` | Target health fraction at or below which the bonus applies, before level scaling. |
| `thresholdFactor` | `0.33` | Extra threshold fraction gained at max level. |
| `maxThreshold` | `0.65` | Hard cap on the health fraction threshold, 0-1. |
| `xpPerBuffedDamage` | `1.9` | Skill XP per point of buffed damage dealt. |

### Riposte Window (`sword-riposte-window`)

5 levels · 4 knowledge

Raise a shield, eat a hit, and you arm a short riposte. The next sword strike you land inside that window deals a large bonus. The window opens on the block itself, not on a perfect parry, so it rewards actually using the shield rather than timing a frame.

1. Learn Riposte Window.
2. Hold a shield in either hand and raise it.
3. Let an attack land on the shield. A gold ring shows the riposte is armed.
4. Swap to your sword and hit back before the window closes. The window is short at low level and roughly a second at max.

Land three ripostes inside five seconds and you get an advancement.

Menu stat lines: Riposte Window. Riposte Damage Bonus.

Arming needs a raised `SHIELD` in either hand, and the window is consumed on the first qualifying sword hit. The `challenge_swords_riposte_3in5` advancement comes from 3 ripostes within 5 seconds and has no stat milestone.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `windowMillisBase` | `350` | Milliseconds the riposte stays armed, before level scaling. Floored at 150 ms. |
| `windowMillisFactor` | `550` | Extra armed milliseconds gained at max level. |
| `damageBonusBase` | `0.22` | Riposte bonus as a fraction of base damage, before level scaling. |
| `damageBonusFactor` | `0.75` | Extra bonus fraction gained at max level. |
| `xpPerBuffedDamage` | `1.8` | Skill XP per point of riposte damage dealt. |

### Crimson Cyclone (`sword-crimson-cyclone`)

5 levels · 5 knowledge

Land a critical hit with a sword, which in vanilla means swinging while falling, and you erupt a bleeding slash around your target. The primary target eats extra damage on the same swing. Everything else in the
radius takes the cyclone damage. Every target it touches starts bleeding.

It is not free. Each cyclone costs hunger and sword durability, and it is on a long cooldown. Both costs get cheaper as you level and the cooldown gets shorter.

1. Learn Crimson Cyclone.
2. Hold a sword and fill your hunger bar.
3. Jump and hit a mob on the way down so the swing crits.
4. The cyclone fires automatically. Hit six or more targets in one activation for an advancement.
5. Wait out the cooldown.

Secondary targets are individually authorized against your PvP and PvE rules, and your own tamed pets are never hit.

Menu stat lines: Cyclone Radius. Cyclone Damage. Cyclone Cooldown.

The cyclone adds its damage to the triggering hit, then damages nearby living entities for the same amount and starts a bleed on each. Hitting 6 or more targets in one activation grants the `challenge_swords_cyclone_6` advancement, which has no stat milestone.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
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

5 levels · 4 knowledge

Sprint-attack with a sword and you get thrown forward into the blow. A brief
window of extra entity reach lets the swing that started the lunge connect at
longer range. It is a gap closer bolted onto an attack you were making anyway.

1. Learn Lunge Strike.
2. Sprint at a target with a sword out.
3. Attack while still sprinting. You surge forward and the reach bonus applies for the next few ticks.

There is a short cooldown so you cannot chain-fling yourself across the map.

Menu stat lines: Lunge Force. Bonus Reach.

The horizontal surge is `lungeForce + (bonusReach * reachVelocityFactor)` capped at `maxSurge`, added to your current velocity with `verticalBoost` as the Y component. Bonus reach is an `ENTITY_INTERACTION_RANGE` modifier on the `reach` slot.

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

5 levels · 5 knowledge

Every sword hit adds a flow stack and each stack adds ten percent attack speed. Stacks decay if you stop hitting for a few seconds, and any damage you take drops the whole stack immediately. Level raises the ceiling on how many stacks you can hold.

Passive, but it rewards not getting hit. Reach the stack cap once for an advancement.

Menu stat lines: Max Flow Stacks. Attack Speed / Stack.

Each stack is a fixed `0.10` of attack speed, applied as an `ADD_SCALAR` modifier on `ATTACK_SPEED` under the `flow` slot. Reaching the stack cap grants the `challenge_swords_flow_max` advancement, which has no stat milestone.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `stackCapBase` | `1.5` | Maximum flow stacks, before level scaling. Rounded, minimum 1. |
| `stackCapFactor` | `4.5` | Extra stack cap gained at max level. |
| `windowMillis` | `4000` | Milliseconds a stack survives without a new sword hit. |
| `xpPerStack` | `3` | Skill XP per stack gained. |

### Duelist's Focus (`sword-duelists-focus`)

5 levels · 5 knowledge

Works only in a one-on-one fight. If exactly one hostile mob or player is inside the engage radius, your sword damage goes up and incoming damage goes down. The attacker briefly glows so you can identify your duel partner. A second attacker inside that radius stops the effect. The defence half also needs a sword in your main hand.

Menu stat lines: Bonus Damage. Damage Reduction.

The count is `Monster` instances plus players inside `engageRadius`, and both halves need it to be exactly 1. The glow is a `GLOWING` effect on the attacker, or on a projectile's shooter, capped at 100 ticks and never shortening a longer glow.

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

5 levels · 5 knowledge

Grind a temporary attack damage buff into yourself at a grindstone. It costs sword durability and experience levels, and it is on a one minute cooldown by default. The grindstone GUI does not open when the ritual fires.

1. Learn Whetstone Ritual.
2. Hold the sword you want to grind in your main hand.
3. Stand at a grindstone with enough experience levels.
4. Sneak and right-click the grindstone. The sword takes durability, you lose the XP levels, and the buff starts.
5. Wait out the cooldown before grinding again.

The ritual refuses if you are short on XP levels, and it refuses if the durability cost would break the sword.

Menu stat lines: Sharpness Level. Buff Duration.

The buff is an `ATTACK_DAMAGE` modifier on the `sharp` slot worth `3.0 * (amplifier + 1)` health points. It is not the vanilla Sharpness enchantment and not the Strength potion. Running out of XP levels plays a fail effect, and a durability cost that would break the sword aborts silently.

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

5 levels · 5 knowledge

Every kill you land with a sword in your main hand hands you absorption hearts for a few seconds. It stacks up in a fight full of mobs, because each kill refreshes the guard rather than replacing it with something weaker. The tier and duration both grow with level. Kill with a sword.

Menu stat lines: Absorption Hearts. Guard Duration.

Applies `ABSORPTION` at the computed amplifier. An existing Absorption effect is never downgraded: the higher amplifier and the longer duration win, and an infinite effect stays infinite. Absorption points granted are `4 * (amplifier + 1)`, clamped to the player's max absorption attribute, and the player's absorption amount is only raised, never lowered.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `amplifierBase` | `0` | Absorption amplifier, before level scaling. Amplifier 0 grants 4 absorption points, which is 2 hearts. |
| `amplifierFactor` | `2` | Extra amplifier tiers gained at max level. |
| `durationTicksBase` | `120` | Guard duration in ticks, before level scaling. Floored at 20 ticks. |
| `durationTicksFactor` | `180` | Extra guard ticks gained at max level. |
| `xpPerGuard` | `8` | Skill XP per guarded kill. |

### Hamstring (`sword-hamstring`)

5 levels · 4 knowledge

Hit something that is running and you slow it hard. A sprinting player also has their sprint cancelled outright. Non-players count as fleeing when their horizontal speed crosses a threshold, so it lands on anything actually trying to leave.

The slow is a movement speed modifier rather than the Slowness potion. It does
not show in the effect list and cannot be milked off.

Menu stat lines: Slowness Tier. Slow Duration.

A target counts as fleeing when it is a sprinting player, or when its horizontal velocity is at or above `fleeSpeedThreshold`. The slow is a `MOVEMENT_SPEED` modifier on the `slow` slot with a `MULTIPLY_SCALAR_1` value of `-0.15 * (tier + 1)`, clamped to -1.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `slowTierBase` | `0` | Slow tier, before level scaling. Tier 0 is a 15 percent movement speed cut. |
| `slowTierFactor` | `2` | Extra slow tiers gained at max level. Each tier adds another 15 percent. |
| `durationTicksBase` | `40` | Slow duration in ticks, before level scaling. |
| `durationTicksFactor` | `80` | Extra slow ticks gained at max level. |
| `fleeSpeedThreshold` | `0.14` | Horizontal velocity at or above which a non-sprinting target counts as fleeing. |
| `xpPerHamstring` | `5` | Skill XP per hamstring. |

### Heirloom Edge (`sword-heirloom-edge`)

5 levels · 6 knowledge

Turn one sword into your sword. Name it at an anvil and it is stamped as an heirloom with a gold lore line. From then on, every few kills you make while holding it bank a small permanent
attack damage bonus straight onto the item. That bonus has a level-scaled cap.

The bonus lives on the item, not on you. The blade keeps it if you drop it,
store it, or hand it to someone else.

1. Learn Heirloom Edge.
2. Put a sword in an anvil and type any new name.
3. Take the result. It now carries the Heirloom Edge lore line.
4. Kill things while holding it. Every few kills banks another step of damage.
5. Keep going until the blade hits its cap. Raising the adaptation level raises the cap.

Menu stat lines: Damage Per Bank. Kills Per Bank. Banked Damage Cap.

The item carries five persistent keys: `heirloom_edge` (the flag), `heirloom_edge_kills`, `heirloom_edge_bonus`, `heirloom_edge_damage` (the attribute modifier), and `heirloom_edge_lore`. The banked bonus is an `ATTACK_DAMAGE` `ADD_NUMBER` modifier on the item's own mainhand slot, added on top of the sword's vanilla damage rather than replacing it. Once the bonus reaches the cap, banked kills stop accumulating.

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

Each adaptation has its own file at `plugins/Adapt/adaptations/<id>.toml`. Alongside the keys listed above it carries `enabled`, `permanent`, `showParticles`, `showSounds`, and its learn costs (`maxLevel`, `initialCost`, `baseCost`, `costFactor`). Every file is generated with a comment on each key and values are clamped on load.

## See also

- [02 - Concepts](/adapt/02-concepts)
- [03 - Player Usage](/adapt/03-player-usage)
- [10 - Skills Catalog](/adapt/10-skills-catalog)
- [04 - Commands & Permissions](/adapt/04-commands-permissions)
