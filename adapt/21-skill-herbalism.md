---
title: "Skill - Herbalism"
description: "Herbalism XP sources, adaptations, controls, and configuration"
published: true
date: 2026-09-28T18:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Herbalism gains XP from harvesting and planting crops, shearing, composting, and eating. Its 15 adaptations cover crop growth, replanting, area sowing, direct inventory drops, composting, food bonuses, farming drops, hunger-based defense, farmland protection, and recipes for mycelium, grass blocks, mushroom blocks, and cobwebs.

## Adaptations

Herbalist's Myconid, Herbalist's Terralid, Mushroom Maker, Webby Creator, and Rooted Footing default to `permanent = true`. The first purchase asks for confirmation, normal players cannot unlearn them, and an administrative bypass can lower them without a refund.

### Growth Aura (`herbalism-growth-aura`)

7 levels · 12 knowledge, then 8 per level

Each pulse samples `ceil(clamp(radius * radius, 3, 256))` blocks inside radius `levelPercent * radiusFactor` and, a second or two later, advances a crop that is not fully grown by `level * strengthFactor` age steps, capped by the crop's remaining age. Food per step interpolates from `maxFoodCost` at no progress to `minFoodCost` at full level.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `surfaceOnly` | `true` | Only grows crops sitting directly on top of the highest block in their column. |
| `minFoodCost` | `0.05` | Food points per age step at full level. |
| `maxFoodCost` | `0.4` | Food points per age step at no level progress. |
| `radiusFactor` | `18` | Aura radius in blocks at full level. |
| `strengthFactor` | `0.75` | Age steps granted per adaptation level on a successful hit. |

### Harvest & Replant (`herbalism-replant`)

3 levels · 4 knowledge, then 6 per level

Right-click a fully grown crop with a hoe that is not on cooldown, off hand checked first, to drop its loot, take one seed from that loot, and reset the crop to age 0, or remove the crop when the loot has no seed. Radius is `level - radiusSub` (0 harvests only the clicked crop; above that, `floor(radius)` vertically and `round(radius)` horizontally over the following ticks); tool damage is `1 + ((level - 1) * 7)`; cooldown is `cooldownLvl1` ticks at level 1, otherwise `(baseCooldown - cooldownFactor * levelPercent) + bonusCooldown` ticks; XP is `harvestPerAgeXP * age` plus `plantCropSeedsXP` when a seed is reclaimed; Hoe Drop-To-Inventory sends the loot to the inventory.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `cooldownLvl1` | `2` | Hoe cooldown in ticks while the adaptation is at level 1. |
| `baseCooldown` | `30` | Starting hoe cooldown in ticks above level 1. |
| `cooldownFactor` | `30` | Ticks removed from that cooldown at full level. |
| `bonusCooldown` | `20` | Flat ticks added to the scaled cooldown. |
| `radiusSub` | `1` | Levels subtracted before the level becomes a block radius. |

### Hungry Shield (`herbalism-hungry-shield`)

5 levels · 10 knowledge, then 7 per level

Damage is reduced by moving `min(damage * effectiveness, max(0, foodLevel + saturation - 6))` into food and saturation, where effectiveness is `min(maxEffectiveness, levelPercent^2 + effectivenessBase)`, and skill XP equals the amount absorbed. The last 6 food points are never spent, unabsorbed damage lands normally, and damage over time (fire, fire tick, lava, campfire, hot floor, poison, wither, drowning, freeze) charges at most once per `dotChargeIntervalMs`.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `effectivenessBase` | `0.15` | Fraction of damage moved to hunger at no level progress, 0-1. |
| `maxEffectiveness` | `0.95` | Hard ceiling on that fraction, 0-1. |
| `basicsUnlockLevel` | `1` | Level needed for contact, cramming, drowning, suffocation, wall, magma, and freeze. |
| `meleeUnlockLevel` | `2` | Level needed for melee, sweep, and thorns. |
| `fireUnlockLevel` | `3` | Level needed for fire, fire tick, lava, and campfire. |
| `burstUnlockLevel` | `4` | Level needed for projectile, explosion, falling block, and lightning. |
| `magicUnlockLevel` | `5` | Level needed for magic, poison, wither, dragon breath, and sonic boom. |
| `dotChargeIntervalMs` | `1000` | Milliseconds between hunger charges for damage-over-time sources. |

### Herbalist's Hippo (`herbalism-hippo`)

7 levels · 3 knowledge, then 8 per level

Eating anything on the food list adds `2 + level` food, capped at 20, and the same amount of saturation, capped at the new food value, plus 5 skill XP. Golden apples, enchanted golden apples, and golden carrots use that same bonus, and there are no adaptation-specific config keys.

### Hoe Drop-To-Inventory (`herbalism-drop-to-inventory`)

1 level · 2 knowledge

In survival, blocks broken with a hoe in the main hand send their drops to the inventory and pay 2 skill XP per item caught. Protection-denied items stay dropped, overflow drops at the feet, and there are no adaptation-specific config keys.

### Herbalist's Luck (`herbalism-luck`)

7 levels · 3 knowledge, then 8 per level

Breaking grass can drop melon seeds, pumpkin seeds, or cocoa beans, and breaking a flower can drop a potato, carrot, beetroot, or apple, for 100 skill XP per lucky drop. Chance is `min(highChance, level * level + lowChance)` out of 100, using the raw adaptation level rather than level percent.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `lowChance` | `0.0` | Flat percentage added to the level-squared chance, 0-100. |
| `highChance` | `90` | Hard ceiling on the drop chance, 0-100. |

### Herbalist's Myconid (`herbalism-myconid`)

1 level · 3 knowledge

Shapeless recipe `adapt:herbalism-dirt-myconid` turns `DIRT` + `RED_MUSHROOM` + `BROWN_MUSHROOM` into one `MYCELIUM`. It is active without learning and has no adaptation-specific config keys.

### Herbalist's Terralid (`herbalism-terralid`)

1 level · 3 knowledge

Shaped recipe `adapt:herbalism-dirt-terralid`, `SSS` over `DDD` with `S` = `WHEAT_SEEDS` and `D` = `DIRT`, produces three `GRASS_BLOCK`. It is active without learning and has no adaptation-specific config keys.

### Mushroom Maker (`herbalism-mushroom-blocks`)

1 level · 2 knowledge

Four recipes: `adapt:herbalism-redmushblock` and `adapt:herbalism-brownmushblock` are 2x2 mushrooms to one matching mushroom block, and `adapt:herbalism-mushstemred` and `adapt:herbalism-mushstembrown` convert either mushroom block into one `MUSHROOM_STEM`. The stat counts only the two block recipes; the recipes are active without learning and have no adaptation-specific config keys.

### Webby Creator (`herbalism-cobweb`)

1 level · 2 knowledge

Shaped recipe `adapt:herbalism-cobwebblock` turns a 3x3 of `STRING` into one `COBWEB`. It is active without learning and has no adaptation-specific config keys.

### Seed Sower (`herbalism-seed-sower`)

5 levels · 3 knowledge

Sneak-right-click with wheat seeds, carrots, potatoes, beetroot seeds, melon seeds, pumpkin seeds, torchflower seeds, or nether wart to plant empty tiles above `FARMLAND`, or `SOUL_SAND` for nether wart, on the clicked block's plane or on the looked-at block within 5 blocks when the click is air, up to the crop cap and the held seed count. Radius is `max(1, round(baseRadius + levelPercent * radiusFactor))`, the cap is `max(1, round(baseCropCount + levelPercent * cropCountFactor))`, and the seed-item cooldown is `max(2, round(cooldownTicksBase - levelPercent * cooldownTicksReduction))` ticks; a partial failure rolls the crops back and refunds the seeds, and creative mode does not consume them.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `baseRadius` | `1` | Plant radius in blocks at no level progress. |
| `radiusFactor` | `2` | Blocks of radius added at full level. |
| `baseCropCount` | `3` | Crops planted per use at no level progress. |
| `cropCountFactor` | `10` | Crops added to that cap at full level. |
| `cooldownTicksBase` | `60` | Seed cooldown in ticks at no level progress. |
| `cooldownTicksReduction` | `42` | Ticks removed from that cooldown at full level. |
| `xpPerCrop` | `1.45` | Herbalism skill XP per crop planted. |

### Compost Cascade (`herbalism-compost-cascade`)

6 levels · 4 knowledge

Sneak-right-click a composter, or one looked at within 5 blocks, to pull in nearby ground items, harvest and replant mature crops, strip leaves when `consumeLeaves` is true, feed compostable inventory items, spend the new compost on immature crops, drop bone meal at the composter, and roll a valuable drop only when the composter is full. The item budget is 40 percent field scan, 20 percent inventory, and the rest loose drops, and those drops are tagged so a later cascade ignores them; maturation attempts are `min(configuredAttempts, levelGains + overflowFills)`; bone meal is `baseBoneMeal + (itemsConsumed / itemsPerBoneMeal) + overflowBoneMeal`, plus the ready bonus the first time the composter reaches level 8, capped at a stack; full-composter weights are honeycomb 45 percent, glow berries 25, amethyst shards 18, emerald 9, and diamond 3; XP is `(itemsConsumed * xpPerItemConsumed) + (levelGains * xpPerLevelGain) + (cropsMatured * xpPerCropMatured)`.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `consumeLeaves` | `false` | Lets the cascade break and compost leaf blocks in range. |
| `radiusBase` | `5.0` | Cascade radius in blocks at no level progress. |
| `radiusFactor` | `12.0` | Blocks of radius added at full level. |
| `maxItemsBase` | `80.0` | Items processed per cascade at no level progress. |
| `maxItemsFactor` | `240.0` | Items added to that budget at full level. |
| `fillChanceBase` | `0.5` | Chance one composted item adds a compost level, 0-1. |
| `fillChanceFactor` | `0.42` | Extra fill chance at full level, 0-1. |
| `maxFillChance` | `0.98` | Hard ceiling on fill chance, 0-1. |
| `leafCompostBurstsBase` | `3` | Leaf items credited per broken leaf block at no level progress. |
| `leafCompostBurstsFactor` | `9` | Extra leaf items credited at full level. |
| `leafFillChanceMultiplierBase` | `1.35` | Multiplier on fill chance for leaves at no level progress. |
| `leafFillChanceMultiplierFactor` | `0.7` | Extra leaf multiplier at full level. Result is capped at 1.0. |
| `cooldownTicksBase` | `36.0` | Composter cooldown in ticks at no level progress. |
| `cooldownTicksReduction` | `28.0` | Ticks removed from that cooldown at full level. |
| `boneMealBase` | `2.0` | Bone meal dropped per cascade at no level progress. |
| `boneMealFactor` | `6.0` | Extra bone meal at full level. |
| `readyBonusBoneMealBase` | `2.0` | Extra bone meal when the composter first fills, at no level progress. |
| `readyBonusBoneMealFactor` | `8.0` | Extra fill bonus at full level. |
| `itemsPerBoneMealBase` | `20.0` | Items consumed per extra bone meal at no level progress. |
| `itemsPerBoneMealReduction` | `14.0` | Items removed from that ratio at full level. |
| `overflowFillsPerBoneMeal` | `4` | Fills wasted on an already-full composter that convert to one bone meal. |
| `maturationAttemptsBase` | `6` | Crop maturation attempts at level one. |
| `maturationAttemptsPerLevel` | `6` | Extra maturation attempts per level above one. |
| `valuableChanceBase` | `0.01` | Chance per roll of a valuable drop at no level progress, 0-1. |
| `valuableChanceFactor` | `0.09` | Extra valuable chance at full level, 0-1. |
| `maxValuableChance` | `0.12` | Hard ceiling on valuable chance, 0-1. |
| `valuableRollsBase` | `1` | Valuable rolls per full composter at no level progress. |
| `valuableRollsFactor` | `3` | Extra rolls at full level. |
| `xpPerItemConsumed` | `1.2` | Herbalism skill XP per item composted. |
| `xpPerLevelGain` | `2.8` | Herbalism skill XP per compost level gained. |
| `xpPerCropMatured` | `2.0` | Herbalism skill XP per crop pushed forward a stage. |

### Rooted Footing (`herbalism-rooted-footing`)

1 level · 3 knowledge

Walking or jumping on `FARMLAND` does not trample it, and part of fall damage on farmland, grass block, moss block, mycelium, dirt, or rooted dirt directly underneath is paid from food. The absorb cap is `damage * min(maxAbsorbPercent, absorbBase + levelPercent * absorbFactor)` and the amount taken is `min(absorbCap, usableFood / foodPerDamage)`; covering the whole fall cancels it, and the adaptation is active without learning.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `absorbBase` | `0.28` | Fraction of fall damage eligible for conversion at no level progress, 0-1. |
| `absorbFactor` | `0.12` | Extra fraction at full level, 0-1. |
| `maxAbsorbPercent` | `0.45` | Hard ceiling on that fraction, 0-1. |
| `foodPerDamage` | `1.8` | Food points spent per point of damage absorbed. |

### Bee Shepherd (`herbalism-bee-shepherd`)

5 levels · 3 knowledge

Holding any flower in either hand, including tulip, dandelion, poppy, blue orchid, allium, azure bluet, oxeye daisy, cornflower, lily of the valley, wither rose, sunflower, lilac, rose bush, peony, torchflower, and pink petals, pulses growth while the player has enough food and pulls at most 8 nearby bees, clearing their attack targets. Radius is `radiusBase + levelPercent * radiusFactor`, attempts are `round(growthAttemptsBase + levelPercent * growthAttemptsFactor)` times `1 + min(bees, maxBonusBees) * growthBonusPerBee`, the age step is `round(growthStepBase + levelPercent * growthStepFactor)`, food is `max(1, round(foodCostBase - levelPercent * foodCostFactor))` charged once per pulse at the first committed growth, and pulse spacing is `max(250, round(pulseMillisBase - levelPercent * pulseMillisFactor))` ms.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `showGrowthParticles` | `true` | Emits the per-crop growth particles. |
| `radiusBase` | `7` | Pulse radius in blocks at no level progress. |
| `radiusFactor` | `12` | Blocks of radius added at full level. |
| `growthAttemptsBase` | `10` | Growth attempts per pulse at no level progress. |
| `growthAttemptsFactor` | `18` | Extra attempts at full level. |
| `growthBonusPerBee` | `0.15` | Fraction of base attempts added per herded bee. |
| `maxBonusBees` | `5` | Herded bees that count toward the bonus. |
| `growthStepBase` | `1` | Age stages per successful growth at no level progress. |
| `growthStepFactor` | `2.0` | Extra age stages at full level. |
| `foodCostBase` | `1` | Food points per pulse at no level progress. |
| `foodCostFactor` | `1.2` | Food points removed from that cost at full level. Minimum is 1. |
| `pulseMillisBase` | `900` | Milliseconds between pulses at no level progress. |
| `pulseMillisFactor` | `650` | Milliseconds removed from that spacing at full level. |
| `beePullStrengthBase` | `0.07` | Velocity applied to herded bees at no level progress. |
| `beePullStrengthFactor` | `0.14` | Extra pull velocity at full level. |
| `xpPerGrowth` | `0.9` | Herbalism skill XP per crop grown. |

### Spore Bloom (`herbalism-spore-bloom`)

5 levels · 4 knowledge

Sneak-placing `RED_MUSHROOM` or `BROWN_MUSHROOM` on `MYCELIUM` or `PODZOL` cancels the placement and blooms that surface outward through dirt, grass block, coarse dirt, rooted dirt, mycelium, and podzol; warm-colored flowers become red mushrooms, cool-colored flowers become brown, and any other flower follows the held mushroom when `swapFlowersToMushrooms` is true. Attempts are `round(bloomAttemptsBase + levelPercent * bloomAttemptsFactor) + (level - 1) * bloomAttemptsPerLevel`, radius is `bloomRadiusBase + levelPercent * bloomRadiusFactor` and at level 5 is at least 6 with the first 6 rings filled, mushroom cost is `sporeCostBase + (level - 1) * sporeCostPerLevel`, cooldown is `max(250, round(cooldownMillisBase - levelPercent * cooldownMillisFactor))` ms, and mushrooms and hunger are charged only after the first block converts.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `swapFlowersToMushrooms` | `true` | Lets the bloom replace flowers with mushrooms. |
| `bloomAttemptsBase` | `26` | Blocks visited per bloom at no level progress. |
| `bloomAttemptsFactor` | `58` | Extra blocks visited at full level. |
| `bloomAttemptsPerLevel` | `12` | Extra blocks visited per level above one. |
| `sporeCostBase` | `1` | Mushrooms consumed by a level one bloom. |
| `sporeCostPerLevel` | `1` | Extra mushrooms consumed per level above one. |
| `bloomRadiusBase` | `5` | Bloom radius in blocks at no level progress. |
| `bloomRadiusFactor` | `10` | Blocks of radius added at full level. |
| `spokesBase` | `6` | Spokes used to build the ring pattern at no level progress. Sectors are three times this, clamped to 8-48. |
| `spokesFactor` | `7` | Extra spokes at full level. |
| `blocksPerPulseBase` | `2` | Blocks converted per pulse at no level progress. |
| `blocksPerPulseFactor` | `4` | Extra blocks per pulse at full level. |
| `spreadIntervalTicksBase` | `3` | Server ticks between pulses at no level progress. |
| `spreadIntervalTicksFactor` | `1.6` | Ticks removed from that interval at full level. |
| `foodCostBase` | `2` | Food points per bloom at no level progress. |
| `foodCostFactor` | `1.2` | Food points removed from that cost at full level. Minimum is 1. |
| `cooldownMillisBase` | `1700` | Milliseconds between blooms at no level progress. |
| `cooldownMillisFactor` | `1100` | Milliseconds removed from that cooldown at full level. |
| `xpPerMushroomPlaced` | `1.4` | Herbalism skill XP per block the bloom converts. |

## Reference

### Skill XP and stats

| What you do | XP awarded | Cooldown-gated |
|---|---|---|
| Eat food (not a potion) | `foodConsumeXP` | Yes |
| Shear an entity | `shearXP` | No |
| Harvest or break a crop | `harvestPerAgeXP` × crop age × anti-farm multipliers | Yes |
| Plant a crop | Same formula, but a new seed is age 0, so this pays nothing | Yes |
| Use a composter | See below | No |

Only `Ageable` blocks pay — breaking a non-crop block awards nothing. `plantCropSeedsXP` is what
actually pays for replanting, and only Harvest & Replant uses it.

Composter XP is checked one tick after the interaction. If the composter level rose, or dropped from above zero to zero, the award is `composterBaseXP + (newLevel * composterLevelXPMultiplier) + (newLevel == 0 ? composterEmptyBonus : composterNonZeroLevelBonus)`.

### Skill configuration defaults

Written to `plugins/Adapt/skills/herbalism.toml` on first load.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `enabled` | `true` | Turns the whole skill and its adaptations off when false. |
| `harvestXpCooldown` | `3500` | Minimum milliseconds between cooldown-gated XP awards. |
| `foodConsumeXP` | `35` | Skill XP for eating one non-potion item. |
| `shearXP` | `35` | Skill XP for one shear. |
| `harvestPerAgeXP` | `5.0` | Skill XP per age step of the harvested or placed crop. |
| `plantCropSeedsXP` | `4.0` | Skill XP that Harvest & Replant pays for each crop it replants. |
| `composterBaseXP` | `2.5` | Flat skill XP for a composter interaction that changed its level. |
| `composterLevelXPMultiplier` | `1.25` | Extra skill XP per compost level the composter now holds. |
| `composterNonZeroLevelBonus` | `25` | Bonus skill XP when the composter ends above level zero. |
| `composterEmptyBonus` | `5` | Bonus skill XP when the composter empties after producing bone meal. |
| `challengeEat100Reward` | `1250` | Knowledge reward for `challenge_eat_100`. |
| `challengeEat1kReward` | `6250` | Knowledge reward for `challenge_eat_1000`. The 10000 tier pays this times 5. |
| `challengeHarvest100Reward` | `1250` | Knowledge reward for `challenge_harvest_100`. |
| `challengeHarvest1kReward` | `6250` | Knowledge reward for `challenge_harvest_1000`. |
| `challengePlant100Reward` | `1250` | Knowledge reward for `challenge_plant_100`. |
| `challengePlant1kReward` | `6250` | Knowledge reward for `challenge_plant_1k`. |
| `challengePlant5kReward` | `25000` | Knowledge reward for `challenge_plant_5k`. |
| `challengeCompost50Reward` | `1250` | Knowledge reward for `challenge_compost_50`. |
| `challengeCompost500Reward` | `6250` | Knowledge reward for `challenge_compost_500`. |
| `challengeShear50Reward` | `1250` | Knowledge reward for `challenge_shear_50`. |
| `challengeShear250Reward` | `6250` | Knowledge reward for `challenge_shear_250`. |
| `skillColor` | `"&a"` | Legacy ampersand color code used for this skill in menus and text. |

### Shared knobs

| Key | Behavior |
|-----|----------|
| `baseCost`, `costFactor`, `maxLevel`, `initialCost` | Knowledge cost curve and level cap. Defaults per adaptation below. |

In the formulas below, `levelPercent` is the learned level divided by `maxLevel`, clamped to 0 through 1.

### Challenges

| Challenge | Threshold | Reward knob |
|---|---|---|
| `challenge_eat_100` | 100 | `challengeEat100Reward` |
| `challenge_eat_1000` | 1000 | `challengeEat1kReward` |
| `challenge_eat_10000` | 10000 | `challengeEat1kReward` * 5 |
| `challenge_harvest_100` | 100 | `challengeHarvest100Reward` |
| `challenge_harvest_1000` | 1000 | `challengeHarvest1kReward` |
| `challenge_plant_100` | 100 | `challengePlant100Reward` |
| `challenge_plant_1k` | 1000 | `challengePlant1kReward` |
| `challenge_plant_5k` | 5000 | `challengePlant5kReward` |
| `challenge_compost_50` | 50 | `challengeCompost50Reward` |
| `challenge_compost_500` | 500 | `challengeCompost500Reward` |
| `challenge_shear_50` | 50 | `challengeShear50Reward` |
| `challenge_shear_250` | 250 | `challengeShear250Reward` |

## See also

Catalog: [Skills](/adapt/10-skills-catalog). Rules: [Concepts](/adapt/02-concepts).
