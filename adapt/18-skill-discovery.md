---
title: "Skill - Discovery"
description: "Discovery XP sources, adaptations, controls, and configuration"
published: true
date: 2026-10-01T09:26:23.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Discovery awards XP once for each new block state, item, food, recipe, enchantment, entity, player, effect, biome, dimension, and world, scans the targeted block, and mirrors collected vanilla experience into Discovery XP. Its 14 adaptations add block and entity details, structure guidance, chest detection, archaeology loot, armor, damage resistance, villager discounts, and faster mending.

## Player controls

Every adaptation has an Enabled control in its level screen. These controls change only your player data; the server controls permitted values, defaults and locks. Personal settings never bypass learned levels, permissions, costs, cooldowns or server limits.

| Adaptation | Additional controls |
|---|---|
| Better Mending (`discovery-better-mending`) | `xp-reserve`: XP point reserve; `repair-limit`: Maximum repaired durability |
| Cartographer Pulse (`discovery-cartographer-pulse`) | `structures`: Structure categories; `color`: Marker color; `direction-line`: Private direction line |
| Experimental Resistance (`discovery-xp-resist`) | `xp-reserve`: XP level reserve |
| Field Notes (`discovery-field-notes`) | `species-damage`: Species damage bonus |
| Insight (`discovery-insight`) | `full-details`: Full overlay details; `players`: Player targets; `hostile`: Hostile targets; `passive`: Passive targets |
| Keen Eye (`discovery-keen-eye`) | `color`: Marker color; `chests`: Chest markers; `spawners`: Spawner markers; `range`: Marker range |
| Relic Appraiser (`discovery-relic-appraiser`) | `confirmation`: Confirm rare item appraisal; `discs`: Music discs; `heads`: Heads; `trims`: Armor trims; `sherds`: Pottery sherds |
| Sixth Sense (`discovery-sixth-sense`) | `structures`: Structure categories; `hud`: Structure HUD; `full-details`: Full structure details; `cue-frequency`: Cue frequency |
| Trailblazer (`discovery-trailblazer`) | `speed-burst`: Discovery speed burst |
| Villager Attraction (`discovery-villager-att`) | `xp-reserve`: XP level reserve |

XP reserve choices retain 0, 5 or 10 points for Better Mending and levels for Resistance or villager benefits. Better Mending can stop at 100%, 50% or 25% durability. Marker colors offer default, aqua, gold and purple. Structure selection uses the server-permitted default, jigsaw-structure, mineshaft, monument, stronghold, fortress or End-city category; range and search limits remain unchanged. Compact Insight shows the species line, while compact Sixth Sense shows direction and distance. Lower cue frequency extends the existing interval. Disabling continuous displays removes that player’s markers or HUD; Polymath removes only its own XP multiplier grants.

Toggle defaults preserve existing behavior. Size and rate presets default to Full; material, ore and structure filters default to their existing selection. Confirmation, additional gesture restrictions and reserves are off by default. Server policies are configured as `[playerPreferences.<control-id>]` in the adaptation’s TOML file.

## Adaptations

### Experimental Unity (`discovery-unity`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/discovery/discovery-unity-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/discovery/discovery-unity-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

7 levels · 3 knowledge, then 2 per level

Picking up an experience orb grants 5 Discovery XP, then grants one existing skill line `amount * xpGainedMultiplier * levelPercent` XP, where `amount` is a random integer from 1 to 3.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `xpGainedMultiplier` | `8` | Scales the XP handed to the randomly chosen skill line. |

### World Armor (`discovery-world-armor`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/discovery/discovery-world-armor-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/discovery/discovery-world-armor-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

3 levels · 3 knowledge, then 2 per level

Bonus armor scales with the hardness of the surrounding blocks, including stone and deepslate, and is zero in a field.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `maxPlayersPerPass` | `16` | Players whose surroundings are sampled per scheduler pass. |

### Experimental Resistance (`discovery-xp-resist`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/discovery/discovery-xp-resist-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/discovery/discovery-xp-resist-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 3 knowledge, then 5 per level

A hit that would fall below `triggerHealthThreshold` after armor, or kill, spends `max(1, round(levelCostAdd * amplifier - level * levelDrain))` vanilla levels, charged as `VANILLA_EXPERIENCE` under `experience-levels`, and cuts damage by `min(maxEffectiveness, levelPercent^2 + effectivenessBase)`; missing the levels leaves the hit unchanged. A successful save grants 5 Discovery XP and starts a fixed 15-second cooldown.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `effectivenessBase` | `0.15` | Fraction of damage removed at level 0, before the level curve. |
| `maxEffectiveness` | `0.95` | Ceiling on the fraction of damage removed. |
| `levelDrain` | `2` | Vanilla levels shaved off the cost per adaptation level. |
| `levelCostAdd` | `12` | Base vanilla level cost per save before the amplifier and drain. |
| `amplifier` | `1.0` | Multiplier on the base level cost. |
| `triggerHealthThreshold` | `10.0` | Health in points below which a hit is treated as critical (2 points = 1 heart). |

### Villager Attraction (`discovery-villager-att`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/discovery/discovery-villager-att-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/discovery/discovery-villager-att-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 5 knowledge, then 1 per level

Right-clicking a villager with the main hand can apply a temporary Hero of the Village effect until the trade screen closes, then restore the previous effect, at `min(clamp(maxEffectiveness, 0, 1), levelPercent^2 + effectivenessBase)`. The vanilla level cost is `max(1, ceil(levelCostAdd * amplifier - level * levelDrain))`; if it cannot be paid, the trades stay unchanged.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `effectivenessBase` | `0.005` | Proc chance at level 0, 0-1. |
| `maxEffectiveness` | `100` | Ceiling on the proc chance. The code clamps it to 1.0, so the default means no cap. |
| `levelDrain` | `2` | Vanilla levels shaved off the cost per adaptation level. |
| `levelCostAdd` | `10` | Base vanilla level cost per improved trade before the amplifier and drain. |
| `amplifier` | `1.0` | Multiplier on the base level cost. |

### Better Mending (`discovery-better-mending`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/discovery/discovery-better-mending-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/discovery/discovery-better-mending-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

6 levels · 4 knowledge

Sneak-left-click air or a block with a damaged Mending item in the main hand to spend experience points, not levels, at `repairPerXpBase + levelPercent * repairPerXpFactor` durability per point, up to `maxXpSpendBase + levelPercent * maxXpSpendFactor` points, which is `2 + levelPercent * 4` and `14 + levelPercent * 130` on the defaults. Nothing happens if the item is undamaged, the player has no experience, or the item cooldown `max(6, round(cooldownTicksBase - levelPercent * cooldownTicksReduction))` ticks has not elapsed.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `repairPerXpBase` | `2.0` | Durability points restored per experience point at level 0. |
| `repairPerXpFactor` | `4.0` | Additional durability per experience point unlocked across the level range. |
| `maxXpSpendBase` | `14.0` | Experience points one click can spend at level 0. |
| `maxXpSpendFactor` | `130.0` | Additional experience per click unlocked across the level range. |
| `cooldownTicksBase` | `38.0` | Item cooldown after a mend at level 0, in server ticks (20 ticks = 1 second). |
| `cooldownTicksReduction` | `26.0` | Ticks removed from that cooldown across the level range. |
| `skillXpPerDurability` | `0.35` | Discovery XP per durability point restored. |

### Archaeologist (`discovery-archaeologist`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/discovery/discovery-archaeologist-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/discovery/discovery-archaeologist-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

6 levels · 4 knowledge

Brushing `SUSPICIOUS_SAND` or `SUSPICIOUS_GRAVEL` to completion can add a common reward (brick, clay ball, bone, flint, string, or coal) or a rare reward (diamond, emerald, gold ingot, or amethyst shard) on top of the vanilla find. Ordinary sand and gravel do not qualify, and the roll happens only after brushing completes.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `bonusRollChanceBase` | `0.12` | Chance of a bonus reward at level 0, 0-1. |
| `bonusRollChanceFactor` | `0.43` | Additional bonus chance unlocked across the level range. |
| `maxBonusRollChance` | `0.72` | Ceiling on the bonus chance. |
| `rareRewardChanceBase` | `0.04` | Chance the bonus is a rare reward at level 0, 0-1. |
| `rareRewardChanceFactor` | `0.24` | Additional rare chance unlocked across the level range. |
| `maxRareRewardChance` | `0.3` | Ceiling on the rare chance. |
| `cooldownMillisBase` | `1600` | Milliseconds between rewards at level 0. |
| `cooldownMillisFactor` | `1250` | Milliseconds removed from that cooldown across the level range. |
| `xpPerReward` | `10` | Flat Discovery XP per bonus reward. |
| `rewardValueXpMultiplier` | `0.45` | Multiplier on the reward item's value added to that XP. |

### Cartographer Pulse (`discovery-cartographer-pulse`)

4 levels · 4 knowledge

Sneak-right-click with a compass in the main hand to point it at the nearest structure in range and draw a private direction line. No structure in range does nothing.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `searchRangeBase` | `640` | Structure search radius in blocks at level 0. |
| `searchRangeFactor` | `768` | Additional search radius in blocks across the level range. |
| `cooldownMillisBase` | `26000` | Milliseconds between pulses at level 0. |
| `cooldownMillisFactor` | `14000` | Milliseconds removed from that cooldown across the level range. |
| `xpPerPulse` | `25` | Discovery XP per successful pulse. |
| `hungerCost` | `2` | Food points spent per pulse. The pulse is refused below this food level. |

### Insight (`discovery-insight`)

5 levels · 2 knowledge

Insight adds species, movement speed, jump strength, armor toughness, knockback resistance, and detection range, when those attributes exist, to [Gloss entity overlays](/gloss/20-entity-overlays) on the inspected creature, plus Stable Hand state on affected animals; Gloss still supplies the name, health bar, hit response, attack, armor, and React stack count. Without a Gloss build that has the entity-overlay API there is no display and no inspection XP, an older Gloss is reported once and Insight stays unavailable until that server is updated and restarted, and `restrictGlossToInsight` does not turn a disabled Gloss feature on.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `rangeBase` | `6` | Inspection range in blocks at level 0. |
| `rangeFactor` | `18` | Additional inspection range in blocks across the level range. |
| `restrictGlossToInsight` | `false` | Restricts Gloss entity overlays to each active Insight learner's inspected target when true. False keeps nearby Gloss overlays and adds Insight details to the selected target. |
| `xpPerInspection` | `3` | Discovery XP per inspection. |
| `xpCooldownMs` | `10000` | Milliseconds between inspection XP grants for one player. |
| `maxPlayersPerPass` | `32` | Viewers refreshed per scheduler tick, capped internally at 32. |

### Trailblazer (`discovery-trailblazer`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/discovery/discovery-trailblazer-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/discovery/discovery-trailblazer-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 3 knowledge, then 2 per level

The first visit to each biome or structure type grants skill XP at that moment and a Speed effect. The XP action-bar ticker shows then when global `actionbarNotifyXp` is enabled.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `firstVisitXpBase` | `40` | Skill XP for a first visit at level 0. |
| `firstVisitXpFactor` | `160` | Additional first-visit XP unlocked across the level range. |
| `structureXpMultiplier` | `2.5` | Multiplier applied when the first visit is a structure type rather than a biome. |
| `speedDurationTicksBase` | `80` | Speed duration in ticks at level 0. |
| `speedDurationTicksFactor` | `120` | Additional speed duration in ticks across the level range. |
| `speedAmplifier` | `1` | Speed tier granted on a fresh discovery. 0 is +20% movement speed and each tier adds another +20%. |

### Field Notes (`discovery-field-notes`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/discovery/discovery-field-notes-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/discovery/discovery-field-notes-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge, then 3 per level

The first kill of a mob species pays a skill XP bounty, and later kills of that species bank a permanent damage bonus up to the per-species cap.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `firstKillXpBase` | `120` | Skill XP for a first kill of a species at level 0. |
| `firstKillXpFactor` | `240` | Additional first-kill XP unlocked across the level range. |
| `bonusPerKill` | `0.15` | Damage bonus banked against a species per kill, until the cap. |
| `perSpeciesCapBase` | `0.5` | Cap on the banked bonus per species at level 0. |
| `perSpeciesCapFactor` | `2.5` | Additional per-species cap unlocked across the level range. |

### Polymath (`discovery-polymath`)

5 levels · 4 knowledge, then 3 per level

Each skill line at or above the threshold adds a bonus to all XP gain, up to the combined ceiling.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `perSkillBonusBase` | `0.015` | Global XP bonus contributed by each qualifying skill at level 0. |
| `perSkillBonusFactor` | `0.045` | Additional per-skill bonus unlocked across the level range. |
| `skillThreshold` | `5` | Level a skill line must reach to count as qualifying. |
| `maxTotalBonus` | `1.0` | Ceiling on the combined bonus across all qualifying skills. |

### Relic Appraiser (`discovery-relic-appraiser`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/discovery/discovery-relic-appraiser-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/discovery/discovery-relic-appraiser-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 3 knowledge, then 2 per level

Sneak-right-click a head, skull, music disc, armor trim template, or pottery sherd in the main hand to grant rarity-scaled Discovery XP and a bounded random XP payout to one enabled, permitted skill other than Discovery. The item is stamped with a lore tag and refused on a later attempt, placing and breaking an appraised head or skull keeps that data and lore, and with no eligible skill only the Discovery XP is granted.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `appraiseXpBase` | `60` | Discovery XP for an appraisal at level 0, before rarity weighting. |
| `appraiseXpFactor` | `180` | Additional appraisal XP unlocked across the level range. |
| `randomSkillXpMin` | `20` | Lower bound for the additional random non-Discovery skill XP payout. Values are clamped to `0`-`10000`. |
| `randomSkillXpMax` | `60` | Upper bound for the additional random non-Discovery skill XP payout. Values are clamped to `0`-`10000` and reordered when necessary. Both zero disables this payout. |
| `discRarityWeight` | `1.5` | Rarity multiplier for music discs. |
| `headRarityWeight` | `1.4` | Rarity multiplier for heads and skulls. |
| `trimRarityWeight` | `1.25` | Rarity multiplier for armor trim templates. |
| `sherdRarityWeight` | `1.0` | Rarity multiplier for pottery sherds. |

### Sixth Sense (`discovery-sixth-sense`)

5 levels · 3 knowledge, then 2 per level

The action-bar center shows `{symbol} {structure} {direction} {distance}m` (N, NE, E, SE, S, SW, W, or NW) for the nearest supported generated structure, with XP text on the left, notices on the right, and no boss bar; a nearer target adds a short private direction line, the cue clears inside a supported structure, and the experience bar fills visually without changing stored XP. Each pulse searches one of 16 structure families for that player, visited or not, never generates or loads chunks, and `JIGSAW` includes villages, pillager outposts, and other jigsaw structures.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `detectionRangeBase` | `48` | Structure detection radius in blocks at level 0. |
| `detectionRangeFactor` | `452` | Additional detection radius in blocks across the level range, reaching 500 at max level with the default ceiling. |
| `maxDetectionRange` | `500` | Configured ceiling for the search and HUD radius. Runtime hard-capped at 500 blocks. |
| `pulseIntervalMillis` | `4000` | Milliseconds between structure searches for one player. Runtime-clamped to 2000-60000. Cached HUD guidance refreshes on the 2000 ms adaptation tick between searches. |

### Keen Eye (`discovery-keen-eye`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/discovery/discovery-keen-eye-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/discovery/discovery-keen-eye-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 3 knowledge, then 2 per level

Chests and spawners in the forward view cone show a private glowing outline.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `rangeBase` | `10` | Line-of-sight range in blocks at level 0. |
| `rangeFactor` | `14` | Additional line-of-sight range in blocks across the level range. |
| `glimmerDurationTicksBase` | `12` | Ticks a highlight stays visible at level 0. |
| `glimmerDurationTicksFactor` | `28` | Additional highlight ticks across the level range. |
| `viewConeCos` | `0.55` | Minimum cosine of the angle between your look direction and the container for it to glimmer. |
| `maxHighlightsPerScan` | `6` | Containers highlighted per scan, capped internally at 8. |
| `scanIntervalMillis` | `1500` | Milliseconds between line-of-sight scans for one player. |

## Reference

### XP sources

Each discovery pays once. The record is kept per player per key.

| Trigger | Key recorded | XP | Stat |
|---------|--------------|----|------|
| Looking at a block, or clicking one | block data string | `discoverBlockBaseXP + value * discoverBlockValueXPMultiplier` | `discovery.blocks` |
| Any item seen (pickup, consume, or the material of a seen block) | `Material` | `discoverItemBaseXP + value * discoverItemValueXPMultiplier` | `discovery.items` |
| Enchantment on a seen item | enchantment name plus roman level | `discoverEnchantBaseXP + min(discoverEnchantMaxXP, level * discoverEnchantLevelXPMultiplier)` | none |
| Taking a craft result | recipe key | `discoverRecipeBaseXP` | none |
| Eating or drinking | `Material` | `discoverFoodTypeXP` | `discovery.foods` |
| Right-clicking an entity | `EntityType` | `discoverEntityTypeXP` | `discovery.mobs` |
| Right-clicking a player | that player's UUID | `discoverPlayerXP` | none |
| Active potion effect on an entity you right-click | effect type plus roman amplifier | `discoverPotionXP` | none |
| Looking at a block in a new biome | biome key | `discoverBiomeXP` | `discovery.biomes` |
| Changing world, 15 ticks after arrival | world identity plus seed | `discoverWorldXP` | none |
| The dimension of a newly seen world | `World.Environment` | `discoverEnvironmentXP` | none |
| Collecting vanilla experience | not a discovery | the raw vanilla amount | none |

The look-ahead check takes up to `maxTargetChecksPerPass` players per skill tick and looks five blocks ahead, ignoring fluids. Looking at the same block again is skipped.

Discoveries with a value of 24 or more play the rare-find timeline effect instead of the plain particle.

### Skill configuration defaults

Written to `plugins/Adapt/skills/discovery.toml` on first load.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `enabled` | `true` | Turns the whole skill on or off. |
| `skillColor` | `"&b"` | Legacy ampersand color code for this skill in menus and text. |
| `showParticles` | `true` | Plays the discovery particle and sound flourishes. |
| `discoverBiomeXP` | `15` | XP for a biome you have never been in. |
| `discoverPotionXP` | `36` | XP for a potion effect and amplifier pair you have never seen. |
| `discoverEntityTypeXP` | `125` | XP for an entity type you have never inspected. |
| `discoverFoodTypeXP` | `75` | XP the first time you consume a given food. |
| `discoverPlayerXP` | `125` | XP for a player you have never inspected. |
| `discoverEnvironmentXP` | `750` | XP for a dimension you have never entered. |
| `discoverWorldXP` | `750` | XP for a world you have never entered, keyed by identity and seed. |
| `discoverEnchantMaxXP` | `250` | Ceiling on the level-scaled part of an enchantment discovery. |
| `discoverEnchantLevelXPMultiplier` | `52` | XP per enchantment level, before the ceiling. |
| `discoverEnchantBaseXP` | `5` | Flat XP added to every enchantment discovery. |
| `discoverItemBaseXP` | `10` | Flat XP added to every item discovery. |
| `discoverRecipeBaseXP` | `15` | XP for a recipe you have never crafted. |
| `discoverItemValueXPMultiplier` | `1` | Multiplier applied to an item's value in an item discovery. |
| `discoverBlockBaseXP` | `3` | Flat XP added to every block discovery. |
| `discoverBlockValueXPMultiplier` | `0.333` | Multiplier applied to a block's value in a block discovery. |
| `maxTargetChecksPerPass` | `64` | Players given a look-ahead ray trace per skill tick, taken from a rotating cursor. |

### Challenges

| Challenge | Threshold | Reward knob |
|---|---|---|
| `challenge_discover_items_50` | 50 | 500 |
| `challenge_discover_items_250` | 250 | 2500 |
| `challenge_discover_blocks_50` | 50 | 500 |
| `challenge_discover_blocks_250` | 250 | 2500 |
| `challenge_discover_mobs_25` | 25 | 500 |
| `challenge_discover_mobs_75` | 75 | 2500 |
| `challenge_discover_biomes_10` | 10 | 500 |
| `challenge_discover_biomes_40` | 40 | 2500 |
| `challenge_discover_foods_10` | 10 | 500 |
| `challenge_discover_foods_30` | 30 | 2500 |

## See also

Catalog: [Skills](/adapt/10-skills-catalog). Rules: [Concepts](/adapt/02-concepts).
