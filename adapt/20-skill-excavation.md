---
title: "Skill - Excavation"
description: "Excavation XP sources, adaptations, controls, and configuration"
published: true
date: 2026-09-28T18:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Excavation gains XP from breaking blocks or dealing damage with a shovel, and block XP scales with material value, hardness, and blast resistance. Its 12 adaptations add faster digging, direct inventory drops, area excavation, downward burrowing, knock-up attacks, ore detection, treasure, safer landings, and OMNI - T.O.O.L.

## Adaptations

### Hasty Excavator (`excavation-haste`)

3 levels · 3 knowledge, then 2 per level

Starting to break any block, not only shovel blocks, adds a block-break speed modifier of `0.20 * level` (`BLOCK_BREAK_SPEED` as `ADD_SCALAR`, not the Haste effect) for `hasteDurationTicks`.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `hasteDurationTicks` | `100` | Ticks the speed bonus lasts after a block break starts. Clamped to 40-600. |

### Super-Seeing Spelunker! (`excavation-spelunker`)

5 levels · 10 knowledge, then 5 per level

Sneak with glow berries in the main hand and one ore block in the off hand to outline matching ore from the player's position, visible only to that player and colored from the ore name, within `rangeMultiplier * level` blocks clamped to 1 through 32. One glow berry is consumed only after a scan that finds ore; finding nothing, or swapping items before the scan finishes, keeps the berry.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `cooldown` | `6.0` | Seconds between scans. |
| `rangeMultiplier` | `5` | Blocks of scan radius per adaptation level. |
| `maxBlockChecks` | `8192` | Block samples one scan may take. Clamped to 8192. |
| `denseScanRadius` | `8` | Radius searched exhaustively before remaining samples are spread over the full range. |
| `maxHighlights` | `16` | Ore markers one scan may create. Clamped to 16. |
| `highlightDurationTicks` | `100` | Ticks a marker stays visible. Clamped to 20-600. |
| `displayViewRange` | `1.0` | Client render distance multiplier for markers. Clamped to 0.5-2.0. |

### OMNI - T.O.O.L. (`excavation-omnitool`)

5 levels · 3 knowledge, then 10 per level

The main-hand item recognized by `Leatherman` in its lore swaps to an axe on wood, a shovel on dirt, a sword on webs and similar, a hoe on crops and farmland, flint and steel on burnable blocks, and a pickaxe otherwise, and refuses a head at 2 or less durability. Capacity is `startingSlots + level`; sneak-dropping returns the component tools with their names, enchantments, and damage, breaks and attacks are cancelled while the adaptation is inactive, and shift-left-click never merges because the cursor is empty, though that click is still cancelled when the tool already holds more components than the slot budget.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `startingSlots` | `1` | Component slots granted before adaptation levels are added. |

### Shovel Drop-To-Inventory (`excavation-drop-to-inventory`)

1 level · 3 knowledge

Blocks broken with a shovel send their drops to the inventory and pay 2 skill XP per item caught. Protection-denied items stay on the ground, overflow drops at the feet, and there are no adaptation-specific config keys.

### Seismic Ping (`excavation-seismic-ping`)

5 levels · 4 knowledge

Breaking a block while holding an item whose name ends in `_SHOVEL` or `_PICKAXE` can reveal one nearby `ANCIENT_DEBRIS`, block whose name ends in `_ORE`, or nearest HiddenOre vein for two seconds, visible only to that player. Range is `round(scanRangeBase + levelPercent * scanRangeFactor)` clamped to 6 through 32, chance is `min(maxPingChance, pingChanceBase + levelPercent * pingChanceFactor)`, and cooldown `max(350, round(cooldownMillisBase - levelPercent * cooldownMillisFactor))` ms starts when the reveal window closes.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `scanRangeBase` | `11` | Scan radius in blocks at level 0 progress. |
| `scanRangeFactor` | `18` | Blocks of scan radius added at full level. |
| `maxBlockChecks` | `1024` | Block samples one ping may take. Clamped to 2048. |
| `denseScanRadius` | `5` | Radius searched exhaustively before remaining samples are spread over the full range. |
| `pingChanceBase` | `0.14` | Chance a break triggers a ping at level 0 progress, 0-1. |
| `pingChanceFactor` | `0.37` | Extra ping chance added at full level, 0-1. |
| `maxPingChance` | `0.6` | Hard ceiling on ping chance, 0-1. |
| `cooldownMillisBase` | `2600` | Milliseconds between pings at level 0 progress. |
| `cooldownMillisFactor` | `1850` | Milliseconds removed from that cooldown at full level. |
| `xpPerPing` | `8` | Flat Excavation skill XP per successful ping. |
| `targetValueXpMultiplier` | `0.5` | Extra skill XP per point of the revealed ore's material value. |

### Tunneler (`excavation-tunneler`)

5 levels · 5 knowledge

Sneaking with a shovel, breaking a shovel-friendly block also breaks up to `max(1, min(8, floor(levelPercent * bonusBlocksMax)))` of the eight surrounding cells one tick later, on a horizontal plane when pitch is 50 degrees or steeper and otherwise on a vertical plane perpendicular to yaw. The sweep stops if the shovel would break, a denied block is skipped at no cost, and shovel-friendly blocks are clay, dirt, coarse dirt, rooted dirt, farmland, grass block, dirt path, gravel, mycelium, podzol, sand, red sand, soul sand, soul soil, snow, snow block, mud, and muddy mangrove roots.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `bonusBlocksMax` | `8` | Bonus blocks broken at full level. Hard-capped at 8. |
| `durabilityCostPerBonusBlock` | `1` | Durability points spent per bonus block. |
| `xpPerBonusBlock` | `1.5` | Excavation skill XP per bonus block broken. |

### Treasure Hunter (`excavation-treasure-hunter`)

5 levels · 4 knowledge

Breaking `SAND`, `RED_SAND`, `GRAVEL`, `MUD`, or `CLAY` with a shovel can roll the loot table at `min(maxTreasureChance, treasureChanceBase + levelPercent * treasureChanceFactor)`. Entries with weight 6 or lower count as rare and play an extra effect.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `treasureChanceBase` | `0.01` | Treasure chance per eligible block at level 0 progress, 0-1. |
| `treasureChanceFactor` | `0.05` | Extra treasure chance added at full level, 0-1. |
| `maxTreasureChance` | `0.06` | Hard ceiling on treasure chance, 0-1. |
| `lootTable` | `["BONE:30:1:2", "FLINT:30:1:2", "CLAY_BALL:15:1:3", "ANGLER_POTTERY_SHERD:6:1:1", "ARMS_UP_POTTERY_SHERD:6:1:1", "SKULL_POTTERY_SHERD:4:1:1", "EMERALD:3:1:1"]` | Weighted drops as `MATERIAL:weight:min:max`. Unparsable or zero-weight rows are dropped. |
| `xpPerTreasure` | `12` | Excavation skill XP per treasure found. |

### Soft Fall (`excavation-soft-fall`)

5 levels · 3 knowledge

Only `FALL` damage is reduced, by `min(maxReduction, reductionBase + levelPercent * reductionFactor)`, when the block landed in or the block under it is dirt or a dirt variant, grass, podzol, mycelium, path, farmland, sand, red sand, gravel, clay, mud, muddy mangrove roots, soul sand, soul soil, or snow.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `reductionBase` | `0.15` | Fraction of fall damage removed at level 0 progress, 0-1. |
| `reductionFactor` | `0.85` | Extra fraction removed at full level, 0-1. |
| `maxReduction` | `1.0` | Hard ceiling on the removed fraction, 0-1. |
| `xpPerDamagePrevented` | `3.0` | Excavation skill XP per half-heart of damage prevented. |

### Earth Mover (`excavation-earth-mover`)

5 levels · 7 knowledge, then 6 per level

Sneak-right-click with a shovel, in air or on a block, to damage hostile mobs, launch them, and slow them, using base shovel damage of 2.5 for wood and gold, 3.5 for stone and copper, 4.5 for iron, 5.5 for diamond, and 6.5 for netherite, times `max(0, damageMultiplierBase + levelPercent * damageMultiplierFactor)`. A mob that takes no damage is not launched; neutral species stay excluded even when provoked; cooldown is `max(500, round((cooldownMillisBase - levelPercent * cooldownMillisFactor) * cooldownScale))` ms.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `ignorePassiveMobs` | `false` | Exclude neutral enemy species from the shockwave. Passive animals are always excluded. |
| `radiusBase` | `3` | Horizontal wave radius in blocks at level 0 progress. |
| `radiusFactor` | `5` | Blocks of radius added at full level. |
| `verticalRange` | `3` | Blocks above and below the caster that the wave reaches. |
| `forceBase` | `0.6` | Horizontal knockback velocity at level 0 progress. |
| `forceFactor` | `1.0` | Knockback velocity added at full level. |
| `damageMultiplierBase` | `0.75` | Multiplier on the held shovel's base damage at level 0 progress. |
| `damageMultiplierFactor` | `0.75` | Extra damage multiplier at full level. |
| `liftVelocity` | `0.35` | Upward velocity applied to launched mobs. |
| `slowTicksBase` | `40` | Slowness duration in ticks at level 0 progress. |
| `slowTicksFactor` | `60` | Ticks of slowness added at full level. |
| `slowAmplifierMax` | `2` | Slowness amplifier at full level. 0 at no progress. |
| `cooldownMillisBase` | `16000` | Pre-scale cooldown in milliseconds at level 0 progress. |
| `cooldownMillisFactor` | `8000` | Milliseconds removed from that cooldown at full level. |
| `cooldownScale` | `0.5` | Multiplier applied after level scaling. Clamped to 0-1. |
| `hungerCost` | `2` | Food points spent per wave. 0 disables the cost. |
| `xpPerMobHit` | `6` | Excavation skill XP per mob that actually took damage. |
| `maxCandidatesPerActivation` | `16` | Mobs inspected per wave. Clamped to 32. |
| `maxAffectedPerActivation` | `12` | Mobs launched per wave. Clamped to 16. |
| `maxTargetFxPerActivation` | `8` | Launched mobs that get their own particle burst. Clamped to 12. |

### Burrow (`excavation-burrow`)

5 levels · 6 knowledge, then 5 per level

Sneak-right-click a Tunneler shovel-friendly block with a shovel to dig `max(2, round(depthBase + levelPercent * depthFactor))` blocks straight down, breaking the first immediately and spending no hunger or cooldown if that break fails. The shaft also stops at `worldMinHeight + safeFloorMargin`, at lava directly below, at a two-block air gap, at a non-shovel-friendly block, or at a denied block, and each later block is authorized again; cooldown is `max(2000, round(cooldownMillisBase - levelPercent * cooldownMillisFactor))` ms.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `depthBase` | `3` | Blocks dug per activation at level 0 progress. |
| `depthFactor` | `13` | Blocks of depth added at full level. |
| `ticksPerBlock` | `2` | Server ticks between each block in the shaft. |
| `safeFloorMargin` | `16` | Blocks above the world floor where the shaft stops. |
| `durabilityCostPerBlock` | `1` | Durability points spent per block dug. |
| `hungerCost` | `1` | Food points spent per activation. 0 disables the cost. |
| `cooldownMillisBase` | `14000` | Milliseconds between burrows at level 0 progress. |
| `cooldownMillisFactor` | `7000` | Milliseconds removed from that cooldown at full level. |
| `xpPerBlock` | `2` | Excavation skill XP per block dug. |

### Grave Digger (`excavation-grave-digger`)

5 levels · 4 knowledge

Digging `DIRT`, `GRASS_BLOCK`, `COARSE_DIRT`, `ROOTED_DIRT`, `PODZOL`, `MYCELIUM`, or `DIRT_PATH` with a shovel rolls loot and a grave independently. A grave spawns a zombie or skeleton that is already targeting the player and tagged `adapt:excavation_grave_mob`.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `lootChanceBase` | `0.008` | Loot chance per eligible block at level 0 progress, 0-1. |
| `lootChanceFactor` | `0.035` | Extra loot chance added at full level, 0-1. |
| `maxLootChance` | `0.045` | Hard ceiling on loot chance, 0-1. |
| `graveChanceBase` | `0.001` | Grave spawn chance at level 0 progress, 0-1. |
| `graveChanceFactor` | `0.004` | Extra grave chance added at full level, 0-1. |
| `maxGraveChance` | `0.005` | Hard ceiling on grave chance, 0-1. |
| `graveCooldownMillis` | `45000` | Minimum milliseconds between grave spawns for one player. |
| `lootTable` | `["BONE:40:1:2", "BONE_MEAL:25:2:4", "ROTTEN_FLESH:20:1:2", "BONE_BLOCK:6:1:1", "SKELETON_SKULL:2:1:1"]` | Weighted drops as `MATERIAL:weight:min:max`. |
| `xpPerLoot` | `8` | Excavation skill XP per loot drop. |
| `xpPerGrave` | `35` | Excavation skill XP per disturbed grave. |

### Mudlark (`excavation-mudlark`)

5 levels · 3 knowledge

Breaking `CLAY`, `MUD`, `MUDDY_MANGROVE_ROOTS`, `SOUL_SAND`, or `SOUL_SOIL` with a shovel can drop an extra clay ball, mud, mud, soul sand, or soul soil respectively, at `min(maxBonusChance, bonusChanceBase + levelPercent * bonusChanceFactor)`. Standing in water, or under open sky during a storm, also adds `BLOCK_BREAK_SPEED` as an `ADD_SCALAR` of `0.20 * (amplifier + 1)`, where amplifier is `round(levelPercent * (maxHasteLevel - 1))`.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `bonusChanceBase` | `0.05` | Bonus drop chance at level 0 progress, 0-1. |
| `bonusChanceFactor` | `0.2` | Extra bonus drop chance added at full level, 0-1. |
| `maxBonusChance` | `0.25` | Hard ceiling on bonus drop chance, 0-1. |
| `maxHasteLevel` | `3` | Displayed haste steps at full level. Drives the break-speed scalar. |
| `hasteDurationTicks` | `60` | Ticks the wet-dig speed bonus lasts. 0 or less disables it. |
| `xpPerBonusDrop` | `3` | Excavation skill XP per bonus drop. |

## Reference

### Skill XP and stats

Two sources, both spaced by `cooldownDelay`:

Block value is `MaterialValue * valueXPMultiplier + min(maxHardnessBonus, hardness) + min(maxBlastResistanceBonus, blastResistance)`.

| Stat key | Recorded |
|----------|----------|
| `excavation.blocks.broken` | 1 per block broken with a shovel |
| `excavation.blocks.value` | Computed block value per break |
| `excavation.gravel` | 1 per `GRAVEL`, `SAND`, `RED_SAND`, `CLAY`, `SOUL_SAND`, or `SOUL_SOIL` broken |
| `excavation.damage` | Damage dealt with a shovel |

### Skill configuration defaults

Written to `plugins/Adapt/skills/excavation.toml` on first load.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `enabled` | `true` | Turns the whole skill and its adaptations off when false. |
| `skillColor` | `"&e"` | Legacy ampersand color code used for this skill in menus and text. |
| `getXpForAttackingWithTools` | `true` | Allows shovel melee damage to award Excavation XP at all. |
| `maxHardnessBonus` | `9` | Cap on the block-hardness term added to a block's XP value. |
| `maxBlastResistanceBonus` | `10` | Cap on the blast-resistance term added to a block's XP value. |
| `challengeExcavationReward` | `1200` | Base knowledge reward for the Excavation milestones. |
| `valueXPMultiplier` | `0.6` | Multiplier on the base material value before the hardness terms are added. |
| `cooldownDelay` | `1250` | Minimum milliseconds between skill XP awards. |
| `axeDamageXPMultiplier` | `4.0` | Skill XP per point of melee damage dealt with a shovel. The key name says axe. The code uses it for shovels. |

### Shared knobs

| Key | Behavior |
|-----|----------|
| `baseCost`, `costFactor`, `maxLevel`, `initialCost` | Knowledge cost curve and level cap. Defaults per adaptation below. |

In the formulas below, `levelPercent` is the learned level divided by `maxLevel`, clamped to 0 through 1.

### Challenges

| Challenge | Threshold | Reward knob |
|---|---|---|
| `challenge_excavate_1k` | 1000 | `challengeExcavationReward` |
| `challenge_excavate_5k` | 5000 | `challengeExcavationReward` |
| `challenge_excavate_50k` | 50000 | `challengeExcavationReward` |
| `challenge_dig_damage_1k` | 1000 | `challengeExcavationReward` |
| `challenge_dig_damage_10k` | 10000 | `challengeExcavationReward` * 2 |
| `challenge_dig_value_5k` | 5000 | `challengeExcavationReward` |
| `challenge_dig_value_50k` | 50000 | `challengeExcavationReward` * 2 |
| `challenge_dig_gravel_500` | 500 | `challengeExcavationReward` |
| `challenge_dig_gravel_5k` | 5000 | `challengeExcavationReward` * 2 |

## See also

Catalog: [Skills](/adapt/10-skills-catalog). Rules: [Concepts](/adapt/02-concepts).
