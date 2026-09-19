---
title: "Skill - Herbalism"
description: "Herbalism XP sources, adaptations, controls, and configuration"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Herbalism gains XP from harvesting and planting crops, shearing, composting, and eating.

Its 15 adaptations cover crop growth, replanting, area sowing, direct inventory drops, composting, food bonuses, farming drops, hunger-based defense, farmland protection, and recipes for mycelium, grass blocks, mushroom blocks, and cobwebs.

## Adaptations

All of this needs the adaptation learned to level 1 or higher, the skill and the adaptation enabled in config, an `adapt.use.` permission that has not been revoked, and protection and region policy that allow the action.

Five of them have `permanent = true` by default. They are purchased normally, and the first purchase asks for confirmation. Once learned, normal players cannot unlearn them; an administrative bypass can lower them without a refund. Those five are Herbalist's Myconid, Herbalist's Terralid, Mushroom Maker, Webby Creator, and Rooted Footing.

### Growth Aura (`herbalism-growth-aura`)

7 levels · 12 knowledge, then 8 per level

Crops near you grow on their own, paid for out of your hunger. Stand in a field and it ticks forward around you without any input.

Each pulse samples random blocks around you, and a crop below full growth steps forward a second or two later. Each step costs a fraction of a food point, so a big field drains you fast. Higher levels widen the radius, push more age steps per hit, and cost less food per step.

By default it only touches crops sitting on the surface, so it will not run a hidden underground farm for you.

Radius is `levelPercent * radiusFactor`. Samples per pulse are `ceil(clamp(radius * radius, 3, 256))`. Strength is `level * strengthFactor` age steps per hit, capped by the crop's remaining age. Food per step interpolates from `maxFoodCost` at no progress down to `minFoodCost` at full level.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `surfaceOnly` | `true` | Only grows crops sitting directly on top of the highest block in their column. |
| `minFoodCost` | `0.05` | Food points per age step at full level. |
| `maxFoodCost` | `0.4` | Food points per age step at no level progress. |
| `radiusFactor` | `18` | Aura radius in blocks at full level. |
| `strengthFactor` | `0.75` | Age steps granted per adaptation level on a successful hit. |

### Harvest & Replant (`herbalism-replant`)

3 levels · 4 knowledge, then 6 per level

Harvest a crop and put a seed back in the same motion, without breaking anything by hand. At higher levels it does the neighbors too.

How to use it:

1. Hold a hoe. Off hand is checked first, then main hand. The hoe cannot be on cooldown.
2. Right-click a fully grown crop.
3. The crop drops its loot, one seed is taken out of that loot, and the crop resets to age 0. If there is no seed in the drops, the crop is removed instead.
4. At level 2 and above, a cube of crops around the clicked one is harvested the same way over the next few ticks.

The hoe takes durability per use, more at higher levels, and goes on a short item cooldown. If you also have Hoe Drop-To-Inventory learned, the harvested loot goes straight into your inventory.

Radius is `level - radiusSub`, so level 1 harvests only the clicked crop. Above that the sweep is a cuboid expanded by `floor(radius)` vertically and `round(radius)` horizontally. Tool damage is `1 + ((level - 1) * 7)`. Item cooldown is `cooldownLvl1` ticks at level 1, otherwise `(baseCooldown - cooldownFactor * levelPercent) + bonusCooldown` ticks. XP per crop is `harvestPerAgeXP * age`, plus `plantCropSeedsXP` when a seed was reclaimed.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `cooldownLvl1` | `2` | Hoe cooldown in ticks while the adaptation is at level 1. |
| `baseCooldown` | `30` | Starting hoe cooldown in ticks above level 1. |
| `cooldownFactor` | `30` | Ticks removed from that cooldown at full level. |
| `bonusCooldown` | `20` | Flat ticks added to the scaled cooldown. |
| `radiusSub` | `1` | Levels subtracted before the level becomes a block radius. |

### Hungry Shield (`herbalism-hungry-shield`)

5 levels · 10 knowledge, then 7 per level

Damage is paid out of your food bar before it reaches your health.

Which damage types it covers depends on level. Level 1 covers the mundane ones: contact, cramming, drowning, suffocation, wall impacts, magma blocks, and freezing. Level 2 adds melee, sweep, and thorns. Level 3 adds fire, lava, and campfires. Level 4 adds projectiles, explosions, falling blocks, and lightning. Level 5 adds magic, poison, wither, dragon breath, and sonic boom.

It never eats your last six food points, so it will not starve you outright. When there is nothing left to spend, the shield makes a dull break sound and the damage lands normally. Damage-over-time sources only charge you once per second rather than per tick.

Effectiveness is `min(maxEffectiveness, levelPercent^2 + effectivenessBase)`. Absorbed damage is `min(damage * effectiveness, max(0, foodLevel + saturation - 6))`, so it never spends your last 6 food points, and skill XP equals the absorbed damage. Damage over time (fire, fire tick, lava, campfire, hot floor, poison, wither, drowning, freeze) charges at most once per `dotChargeIntervalMs`.

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

Eating anything on the food list gives you extra food and matching saturation on top of what the item normally restores.

Golden apples, enchanted golden apples, and golden carrots get a bigger visual, but the bonus itself is the same for every food.

Bonus is `2 + level`, applied to food (capped at 20) and to saturation (capped at the new food value). Flat 5 skill XP per meal. No adaptation-specific config knobs.

### Hoe Drop-To-Inventory (`herbalism-drop-to-inventory`)

1 level · 2 knowledge

Blocks you break with a hoe send their drops straight into your inventory. It works on its own once learned, and it is a single-level adaptation. Survival mode only.

Anything a protection plugin would stop you picking up is still stopped, and items that do not fit drop at your feet with a failure sound.

Requires survival mode and a hoe in the main hand. Awards a flat 2 skill XP per item caught. No adaptation-specific config knobs.

### Herbalist's Luck (`herbalism-luck`)

7 levels · 3 knowledge, then 8 per level

Breaking grass can drop a random seed. Breaking a flower can drop random food. It works on its own once learned, and it pays well, 100 skill XP per lucky drop.

The chance is the square of your adaptation level as a percentage. It climbs
steeply. Level 3 is about 9 percent. Level 7 is about 49 percent.

Chance is `min(highChance, level * level + lowChance)` out of 100, using the raw adaptation level rather than level percent. Each lucky drop awards 100 skill XP.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `lowChance` | `0.0` | Flat percentage added to the level-squared chance, 0-100. |
| `highChance` | `90` | Hard ceiling on the drop chance, 0-100. |

### Herbalist's Myconid (`herbalism-myconid`)

1 level · 3 knowledge

Unlocks a shapeless recipe: dirt plus one red mushroom plus one brown mushroom makes one mycelium. Active by default without learning it.

Recipe `adapt:herbalism-dirt-myconid`, shapeless, `DIRT` + `RED_MUSHROOM` + `BROWN_MUSHROOM` to one `MYCELIUM`. No adaptation-specific config knobs.

### Herbalist's Terralid (`herbalism-terralid`)

1 level · 3 knowledge

Unlocks a shaped recipe: three wheat seeds in a row over three dirt in a row makes three grass blocks. Active by default without learning it.

Recipe `adapt:herbalism-dirt-terralid`, shaped `SSS` over `DDD` where `S` is `WHEAT_SEEDS` and `D` is `DIRT`, producing three `GRASS_BLOCK`. No adaptation-specific config knobs.

### Mushroom Maker (`herbalism-mushroom-blocks`)

1 level · 2 knowledge

Unlocks four recipes. Four red mushrooms in a 2x2 make a red mushroom block. Four brown mushrooms in a 2x2 make a brown mushroom block. Either mushroom block alone converts to a mushroom stem. Active by default without learning it.

Recipes: `adapt:herbalism-redmushblock` and `adapt:herbalism-brownmushblock` are 2x2 mushrooms to one matching mushroom block. `adapt:herbalism-mushstemred` and `adapt:herbalism-mushstembrown` are shapeless conversions of either mushroom block to one `MUSHROOM_STEM`. The stat only counts the two block recipes. No adaptation-specific config knobs.

### Webby Creator (`herbalism-cobweb`)

1 level · 2 knowledge

Unlocks a shaped recipe: nine string fills the crafting grid and makes one cobweb. Active by default without learning it.

Recipe `adapt:herbalism-cobwebblock`, shaped 3x3 of `STRING` to one `COBWEB`. No adaptation-specific config knobs.

### Seed Sower (`herbalism-seed-sower`)

5 levels · 3 knowledge

Plants a whole patch of farmland in one gesture instead of clicking every tile.

How to use it:

1. Hold a stack of seeds. Wheat seeds, carrots, potatoes, beetroot seeds, melon seeds, pumpkin seeds, torchflower seeds, and nether wart all work.
2. Sneak and right-click. Clicking a block sets the plane you plant on. Clicking air uses the block you are looking at within 5 blocks.
3. Every empty tile above farmland within the radius gets planted, up to your per-use crop cap and the number of seeds you are holding.

Nether wart plants on soul sand instead of farmland. Seeds come out of the held stack, one per crop. If planting fails partway, the crops are rolled back and the seeds are refunded. The seed type goes on a short item cooldown afterward.

Valid base is `FARMLAND`, or `SOUL_SAND` for nether wart. Radius is `max(1, round(baseRadius + levelPercent * radiusFactor))`. Crop cap is `max(1, round(baseCropCount + levelPercent * cropCountFactor))`. Cooldown is `max(2, round(cooldownTicksBase - levelPercent * cooldownTicksReduction))` ticks on the seed item. Creative mode plants without consuming seeds.

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

One sneak-click that runs your whole farm cleanup. It sweeps three sources in order and turns the results into compost, bone meal, and crop growth.

How to use it:

1. Sneak and right-click a composter. Clicking air targets a composter within 5 blocks.
2. Loose items on the ground nearby get pulled in and composted.
3. Mature crops in range get harvested and replanted, and leaves get stripped too if `consumeLeaves` is turned on.
4. Compostable items in your inventory get fed in.
5. The compost you just built is spent maturing nearby crops that are not ready yet.
6. Bone meal drops at the composter. If the composter hit full, it also rolls for something valuable.

The item budget is split three ways: 40 percent to the field scan, 20 percent to your inventory, and the rest to loose drops. Rewards it drops are tagged so a second cascade does not eat its own output. Radius, item budget, fill chance, and cooldown all scale with level.

Maturation attempts are `min(configuredAttempts, levelGains + overflowFills)`. Bone meal is `baseBoneMeal + (itemsConsumed / itemsPerBoneMeal) + overflowBoneMeal`, plus the ready bonus the first time the composter reaches level 8, capped at a stack. Valuable rolls only happen at a full composter: honeycomb at 45 percent, glow berries at 25, amethyst shards at 18, emerald at 9, diamond at 3. Total XP is `(itemsConsumed * xpPerItemConsumed) + (levelGains * xpPerLevelGain) + (cropsMatured * xpPerCropMatured)`.

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

Two safety nets. You stop trampling farmland when you walk or jump on it. Part of your fall damage is paid out of your food bar as long as you land on natural ground. Active by default without learning it.

Natural ground means farmland, grass block, moss block, mycelium, dirt, or rooted dirt directly under you. The conversion is capped both by the absorb percentage and by how much food you actually have. If the absorbed amount covers the whole fall, the damage is cancelled outright.

Trample protection cancels the interaction on `FARMLAND`. Absorb cap is `damage * min(maxAbsorbPercent, absorbBase + levelPercent * absorbFactor)`, and the amount actually absorbed is `min(absorbCap, usableFood / foodPerDamage)`.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `absorbBase` | `0.28` | Fraction of fall damage eligible for conversion at no level progress, 0-1. |
| `absorbFactor` | `0.12` | Extra fraction at full level, 0-1. |
| `maxAbsorbPercent` | `0.45` | Hard ceiling on that fraction, 0-1. |
| `foodPerDamage` | `1.8` | Food points spent per point of damage absorbed. |

### Bee Shepherd (`herbalism-bee-shepherd`)

5 levels · 3 knowledge

Hold a flower and nearby crops start growing, while nearby bees drift toward you and stay near your field.

How to use it:

1. Hold any flower in your main hand or your off hand. Tulips, dandelion, poppy, blue orchid, allium, azure bluet, oxeye daisy, and cornflower all count. Lily of the valley, wither rose, sunflower, lilac, rose bush, peony, torchflower, and pink petals also count.
2. Stand near crops. Pulses fire on their own while you keep holding the flower and have enough food.
3. Each pulse spends food, makes a batch of growth attempts inside its radius, and tugs up to eight nearby bees toward you.

Bees you have herded add extra growth attempts, up to a configured cap, so keeping a swarm around pays off. Bees pulled this way have their attack target cleared.

Needs a flower in the main or off hand. Radius is `radiusBase + levelPercent * radiusFactor`. Growth attempts are `round(growthAttemptsBase + levelPercent * growthAttemptsFactor)`, multiplied by `1 + min(bees, maxBonusBees) * growthBonusPerBee`. Growth step is `round(growthStepBase + levelPercent * growthStepFactor)` age stages. Food cost is `max(1, round(foodCostBase - levelPercent * foodCostFactor))`, charged once per pulse at the first committed growth. Pulse spacing is `max(250, round(pulseMillisBase - levelPercent * pulseMillisFactor))` milliseconds, and at most 8 bees are pulled per pulse.

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

Turns a patch of ground into a mushroom field. The bloom spreads outward from where you clicked in rings. It converts
dirt-family soil into the surface you started from. It swaps flowers into
mushrooms as it goes.

How to use it:

1. Hold red or brown mushrooms.
2. Sneak and place one on top of mycelium or podzol. The placement itself is cancelled. The bloom happens instead.
3. Rings of ground convert outward over the next few seconds, a few blocks per pulse.

Mycelium seeds a mycelium bloom, podzol seeds a podzol bloom. Warm-colored flowers usually become red mushrooms, cool-colored ones usually become brown, and anything else follows whichever mushroom you were holding. Mushrooms and hunger are only charged once the first block actually converts, so a fully blocked bloom costs you nothing. Turn off `swapFlowersToMushrooms` to convert soil only and leave flowers alone.

Triggered by sneak-placing `RED_MUSHROOM` or `BROWN_MUSHROOM` on `MYCELIUM` or `PODZOL`. Convertible soil is dirt, grass block, coarse dirt, rooted dirt, mycelium, and podzol. Bloom attempts are `round(bloomAttemptsBase + levelPercent * bloomAttemptsFactor) + (level - 1) * bloomAttemptsPerLevel`. Radius is `bloomRadiusBase + levelPercent * bloomRadiusFactor`, floored at 6 once level 5 is reached, which also forces the first 6 rings to be filled. Mushroom cost is `sporeCostBase + (level - 1) * sporeCostPerLevel`. Cooldown is `max(250, round(cooldownMillisBase - levelPercent * cooldownMillisFactor))` milliseconds.

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

Each adaptation has its own file at `plugins/Adapt/adaptations/<id>.toml`. Alongside the keys listed above it carries `enabled`, `permanent`, `showParticles`, `showSounds`, and its learn costs (`maxLevel`, `initialCost`, `baseCost`, `costFactor`). Every file is generated with a comment on each key and values are clamped on load.

## See also

- [02 - Concepts](/adapt/02-concepts) for skills, adaptations, and knowledge
- [03 - Player Usage](/adapt/03-player-usage) for the Adapt menu and learning flow
- [10 - Skills Catalog](/adapt/10-skills-catalog) for the full skill list
- [04 - Commands & Permissions](/adapt/04-commands-permissions) for the `adapt.use` permission tree
