---
title: "Skill - Discovery"
description: "Discovery XP sources, adaptations, controls, and configuration"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Discovery awards XP once for each new block state, item, food, recipe, enchantment, entity, player, effect, biome, dimension, and world. It also scans the targeted block and mirrors collected vanilla experience into Discovery XP.

Its 14 adaptations add block and entity details, structure guidance, chest detection, archaeology rewards, armor, damage resistance, villager discounts, and faster mending.

## Adaptations

All of this needs the adaptation learned to level 1 or higher, the skill and the adaptation enabled in config, the `adapt.use` permission, and protection and region policy that allow the action.

### Experimental Unity (`discovery-unity`)

7 levels · 3 knowledge, then 2 per level

Every experience orb you pick up gets spread around. You gain a little Discovery XP and one of your existing skill lines, picked at random, gets a fresh XP grant on top. It is the passive that keeps the skills you are not actively using from falling behind. Goes to seven levels.

It grants a flat 5 Discovery XP per orb pickup. It then picks one random skill
line and gives it `amount * xpGainedMultiplier * levelPercent` fresh XP.
`amount` is a random 1 to 3.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `xpGainedMultiplier` | `8` | Scales the XP handed to the randomly chosen skill line. |

### World Armor (`discovery-world-armor`)

3 levels · 3 knowledge, then 2 per level

Standing on and near hard blocks makes you tougher. The bonus armor is derived from the hardness of the blocks around you. It pays
out in stone and deepslate. It gives you nothing in a field.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `maxPlayersPerPass` | `16` | Players whose surroundings are sampled per scheduler pass. |

### Experimental Resistance (`discovery-xp-resist`)

5 levels · 3 knowledge, then 5 per level

An emergency brake tied to your experience bar. It fires only when a hit would drop you below five hearts or kill you outright, judged on the damage that would actually land after armor. It then spends vanilla levels, shows a `-N XP Levels` notice, and cuts the damage. Without the levels it fails with a red puff and the hit lands in full. Higher adaptation levels cut more damage and cost fewer levels.

Damage reduction is `min(maxEffectiveness, levelPercent^2 + effectivenessBase)`. The vanilla level cost is `max(1, round(levelCostAdd * amplifier - level * levelDrain))`, charged as `VANILLA_EXPERIENCE` under `experience-levels`. A successful save grants 5 Discovery XP and starts a fixed 15-second cooldown.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `effectivenessBase` | `0.15` | Fraction of damage removed at level 0, before the level curve. |
| `maxEffectiveness` | `0.95` | Ceiling on the fraction of damage removed. |
| `levelDrain` | `2` | Vanilla levels shaved off the cost per adaptation level. |
| `levelCostAdd` | `12` | Base vanilla level cost per save before the amplifier and drain. |
| `amplifier` | `1.0` | Multiplier on the base level cost. |
| `triggerHealthThreshold` | `10.0` | Health in points below which a hit is treated as critical (2 points = 1 heart). |

### Villager Attraction (`discovery-villager-att`)

5 levels · 5 knowledge, then 1 per level

Right-clicking a villager has a chance to rewrite the trades in your favour, paid for with vanilla levels. When you cannot afford it the villager shakes its head at you. The chance improves as the adaptation levels.

**How to use it**

1. Keep some vanilla levels banked.
2. Right-click a villager with your main hand. If it procs, the offers you open are improved by a temporary Hero of the Village effect, and your previous effect comes back when the screen closes.

Proc chance is `min(clamp(maxEffectiveness, 0, 1), levelPercent^2 + effectivenessBase)`. The vanilla level cost is `max(1, ceil(levelCostAdd * amplifier - level * levelDrain))`.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `effectivenessBase` | `0.005` | Proc chance at level 0, 0-1. |
| `maxEffectiveness` | `100` | Ceiling on the proc chance. The code clamps it to 1.0, so the default means no cap. |
| `levelDrain` | `2` | Vanilla levels shaved off the cost per adaptation level. |
| `levelCostAdd` | `10` | Base vanilla level cost per improved trade before the amplifier and drain. |
| `amplifier` | `1.0` | Multiplier on the base level cost. |

### Better Mending (`discovery-better-mending`)

6 levels · 4 knowledge

Mending normally waits for you to pick up orbs. This spends your banked experience directly into the damaged Mending item in your hand, on demand. There is a cap on how much you can dump per click and a short item cooldown afterwards.

**How to use it**

1. Hold a damaged item with Mending in your main hand.
2. Sneak and left-click, air or block.

Nothing happens if the item is undamaged, if you have no experience, or if the item is still on cooldown.

The cost is XP points, not XP levels. On the defaults, repair is `2 + levelPercent * 4` durability per point, the maximum spend is `14 + levelPercent * 130` points, and the cooldown is `max(6, round(38 - levelPercent * 26))` ticks.

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

6 levels · 4 knowledge

Brushing suspicious sand and suspicious gravel to completion can pay out twice. Ordinary sand and gravel do not qualify. On top of the vanilla find there is a chance at something common and a smaller chance at something rare. Both climb with level, and the cooldown between rewards shrinks as you level.

**How to use it**

1. Brush a suspicious block the normal way.

Only `SUSPICIOUS_SAND` and `SUSPICIOUS_GRAVEL` qualify, and a reward is considered only after brushing completes. Common rewards are brick, clay balls, bones, flint, string, and coal. Rare rewards are diamonds, emeralds, gold ingots, and amethyst shards.

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

Points your compass at the nearest structure and draws a private glowing line toward it, so you can follow the direction instead of guessing. Each pulse costs food and puts you on a long cooldown, and the search range is enormous, hundreds of blocks even at level 1.

**How to use it**

1. Hold a compass in your main hand.
2. Sneak and right-click.

Not enough food, still on cooldown, or nothing found in range and you get a smoke puff instead.

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

Insight adds details to the creature you look at through [Gloss entity overlays](/gloss/20-entity-overlays). Its extra lines show species, movement speed, jump strength, armor toughness, knockback resistance, and detection range when those attributes exist. Animals affected by Stable Hand also show that state. Gloss supplies the name, segmented health bar, hit response, attack, armor, and React stack count.

Install Gloss and enable its entity overlays, then learn Insight and look at a creature. Nearby Gloss overlays remain available to everyone by default. Set `restrictGlossToInsight = true` in the Insight adaptation config to show entity overlays only for each learner's inspected target. This restriction does not enable a disabled Gloss feature. Without Gloss, Insight produces no display or inspection XP.

Insight needs a Gloss build with the entity-overlay API. On an older Gloss, Adapt reports the installed version once and Insight stays unavailable until you update and restart. Gloss owns the layout, health segments, and display limits through its own entity-overlay config.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `rangeBase` | `6` | Inspection range in blocks at level 0. |
| `rangeFactor` | `18` | Additional inspection range in blocks across the level range. |
| `restrictGlossToInsight` | `false` | Restricts Gloss entity overlays to each active Insight learner's inspected target when true. False keeps nearby Gloss overlays and adds Insight details to the selected target. |
| `xpPerInspection` | `3` | Discovery XP per inspection. |
| `xpCooldownMs` | `10000` | Milliseconds between inspection XP grants for one player. |
| `maxPlayersPerPass` | `32` | Viewers refreshed per scheduler tick, capped internally at 32. |

### Trailblazer (`discovery-trailblazer`)

5 levels · 3 knowledge, then 2 per level

The first time you set foot in each biome or structure type you get a burst of
skill XP and a short speed boost. Exploring actually moves you along. Structure discoveries pay considerably more than biome discoveries. The XP is paid at discovery time, so the ordinary XP action-bar ticker appears then, if the global `actionbarNotifyXp` setting is enabled.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `firstVisitXpBase` | `40` | Skill XP for a first visit at level 0. |
| `firstVisitXpFactor` | `160` | Additional first-visit XP unlocked across the level range. |
| `structureXpMultiplier` | `2.5` | Multiplier applied when the first visit is a structure type rather than a biome. |
| `speedDurationTicksBase` | `80` | Speed duration in ticks at level 0. |
| `speedDurationTicksFactor` | `120` | Additional speed duration in ticks across the level range. |
| `speedAmplifier` | `1` | Speed tier granted on a fresh discovery. 0 is +20% movement speed and each tier adds another +20%. |

### Field Notes (`discovery-field-notes`)

5 levels · 4 knowledge, then 3 per level

The first kill of each mob species pays a large XP bounty. Every kill after that
banks a small permanent damage bonus against that species up to a per-species
cap. Over time you become measurably better at killing the things you kill often.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `firstKillXpBase` | `120` | Skill XP for a first kill of a species at level 0. |
| `firstKillXpFactor` | `240` | Additional first-kill XP unlocked across the level range. |
| `bonusPerKill` | `0.15` | Damage bonus banked against a species per kill, until the cap. |
| `perSpeciesCapBase` | `0.5` | Cap on the banked bonus per species at level 0. |
| `perSpeciesCapFactor` | `2.5` | Additional per-species cap unlocked across the level range. |

### Polymath (`discovery-polymath`)

5 levels · 4 knowledge, then 3 per level

Rewards breadth. Every skill line you have pushed past a threshold level contributes a small bonus to all your XP gain, up to a combined ceiling. Someone with ten skills at level 5 gets far more out of this than someone with one skill at level 50.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `perSkillBonusBase` | `0.015` | Global XP bonus contributed by each qualifying skill at level 0. |
| `perSkillBonusFactor` | `0.045` | Additional per-skill bonus unlocked across the level range. |
| `skillThreshold` | `5` | Level a skill line must reach to count as qualifying. |
| `maxTotalBonus` | `1.0` | Ceiling on the combined bonus across all qualifying skills. |

### Relic Appraiser (`discovery-relic-appraiser`)

5 levels · 3 knowledge, then 2 per level

Turns rare junk into XP. Heads, music discs, armor trim templates, and pottery sherds can be appraised for Discovery XP scaled by how rare the category is. Each successful appraisal also grants a bounded random XP payout to one enabled, permitted non-Discovery skill. An appraised item is stamped so it cannot be appraised twice. Placing and breaking an appraised head or skull preserves the exact stamped item data and lore.

**How to use it**

1. Hold the head, disc, trim template, or sherd in your main hand.
2. Sneak and right-click, air or block.

Already-appraised items just puff smoke.

An appraised item carries a lore tag and is refused on a second attempt. The random payout goes to one enabled, permitted skill other than Discovery. With no eligible skill, or both bounds at zero, only the Discovery XP is granted.

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

A compact navigator above the hotbar. It tracks the nearest supported generated structure within its level-scaled range, up to 500 blocks, showing a structure symbol, its name or type, an eight-way compass direction, and rounded distance. A short private direction line appears when a nearer target is acquired, and the cue clears while you are inside a supported structure. While it is active the experience bar visually fills as you close on the target. That is a client-side display only and your stored XP is never touched.

Each pulse searches one of 16 structure families, so each player works through them independently. `JIGSAW` covers villages, pillager outposts, and other jigsaw structures. Searches include generated structures whether visited or not and never generate or load chunks. The cue reads `{symbol} {structure} {direction} {distance}m`, with directions N, NE, E, SE, S, SW, W, or NW. It holds the center of the shared action bar, with XP gains to its left and notices to its right, and is never pushed to a boss bar.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `detectionRangeBase` | `48` | Structure detection radius in blocks at level 0. |
| `detectionRangeFactor` | `452` | Additional detection radius in blocks across the level range, reaching 500 at max level with the default ceiling. |
| `maxDetectionRange` | `500` | Configured ceiling for the search and HUD radius. Runtime hard-capped at 500 blocks. |
| `pulseIntervalMillis` | `4000` | Milliseconds between structure searches for one player. Runtime-clamped to 2000-60000. Cached HUD guidance refreshes on the 2000 ms adaptation tick between searches. |

### Keen Eye (`discovery-keen-eye`)

5 levels · 3 knowledge, then 2 per level

Chests and spawners inside your line of sight briefly light up as private glowing outlines. Only you see them. It has a forward-view cone rather than full radius. You have to be roughly facing what you want to spot. Only a handful of containers light up per scan.

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

Each adaptation has its own file at `plugins/Adapt/adaptations/<id>.toml`. Alongside the keys listed above it carries `enabled`, `permanent`, `showParticles`, `showSounds`, and its learn costs (`maxLevel`, `initialCost`, `baseCost`, `costFactor`). Every file is generated with a comment on each key and values are clamped on load.

## See also

- [02 - Concepts](/adapt/02-concepts)
- [03 - Player Usage](/adapt/03-player-usage)
- [10 - Skills Catalog](/adapt/10-skills-catalog)
- [04 - Commands & Permissions](/adapt/04-commands-permissions)
