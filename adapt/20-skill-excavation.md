---
title: "Skill - Excavation"
description: "Excavation XP sources, adaptations, controls, and configuration"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Excavation gains XP from breaking blocks or dealing damage with a shovel. Block rewards scale with material value, hardness, and blast resistance.

Its 12 adaptations add faster digging, direct inventory drops, area excavation, downward burrowing, knock-up attacks, ore detection, treasure, safer landings, and the multi-tool item OMNI - T.O.O.L.

## Adaptations

All of this needs the adaptation learned to level 1 or higher, the skill and the adaptation enabled in config, an `adapt.use.` permission that has not been revoked, and protection and region policy that allow the action.

Most of these also require a shovel in your main hand. Several restrict themselves to shovel-friendly blocks. Where that matters it is called out.

### Hasty Excavator (`excavation-haste`)

3 levels · 3 knowledge, then 2 per level

Starting to break a block gives you a block-break speed bonus that lasts long
enough to finish the block. Mining speed does not stutter partway through a slow
dig.

The boost is an attribute modifier, not the vanilla Haste effect: `BLOCK_BREAK_SPEED` as an `ADD_SCALAR` of `0.20 * level`, lasting `hasteDurationTicks` clamped to 40 through 600 ticks. It applies to any block you start breaking, not only shovel work.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `hasteDurationTicks` | `100` | Ticks the speed bonus lasts after a block break starts. Clamped to 40-600. |

### Super-Seeing Spelunker! (`excavation-spelunker`)

5 levels · 10 knowledge, then 5 per level

Scans the ground around you for one specific ore type and outlines every hit with a glowing block so you can see them through terrain. You pick the ore by holding a sample of it.

How to use it:

1. Put the ore block you want to find in your off hand.
2. Hold glow berries in your main hand.
3. Sneak. The scan fires from where you stand.
4. Matching ore lights up in an ore-appropriate color for a few seconds. Only you can see the markers.

One glow berry is consumed per successful scan. If the scan finds nothing, or you swap items before it finishes, you keep the berry and get a dull click. Scan radius grows with level and is capped at 32 blocks.

Scan radius is `rangeMultiplier * level`, clamped to 1 through 32 blocks. Markers are shown only to you, in a glow color chosen from the ore name.

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

Combines several tools into one item that switches heads based on what you are aiming at. Axe on wood. Shovel on dirt. Sword on webs and similar. Pickaxe on everything else. Hoe on crops. Flint and steel on burnable blocks. The merged item is identified by its "Leatherman" lore.

How to use it:

1. Learn it, then merge tools together in your inventory. Merged tools keep their names, enchantments, and damage values.
2. Carry the merged item in your main hand and use it normally. It swaps heads on its own when you start breaking a block or right-click one.
3. To take it apart, sneak and drop the merged item. It bursts into its component tools.

Component tools do not break. A component at two durability from breaking is refused instead, and the action is cancelled with a puff of smoke. The merged item is also inert if you do not have the adaptation active: block breaks and attacks with it are cancelled outright.

Merging is wired to a shift-left-click that reads the second tool from your cursor, but a shift-click leaves the cursor empty, so in practice the merge never runs. What does run is the capacity check, which cancels the shift-click with a failure sound when the clicked tool already holds more components than your slot budget allows.

Merged items are recognized by `Leatherman` appearing in their lore. Component capacity is `startingSlots + level`. It picks an axe, shovel or sword to match the block and falls back to a pickaxe, swaps to a hoe on farmland and to flint and steel on burnable blocks, and refuses to use a head with two or less durability left.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `startingSlots` | `1` | Component slots granted before adaptation levels are added. |

### Shovel Drop-To-Inventory (`excavation-drop-to-inventory`)

1 level · 3 knowledge

Blocks you break with a shovel send their drops straight into your inventory instead of onto the ground. It works on its own once learned, and it is a single-level adaptation.

Anything a protection plugin would stop you picking up stays on the ground, and items that do not fit drop at your feet with a failure sound.

Awards a flat 2 skill XP per item caught. No adaptation-specific config knobs.

### Seismic Ping (`excavation-seismic-ping`)

5 levels · 4 knowledge

While you dig, the ground occasionally answers back. One nearby ore block lights
up for two seconds in a color matched to the ore. Only you can see it. The ping sound is pitched by distance, so a high chime means the ore is close.

Works with a shovel or a pickaxe in your main hand. Scan range grows with level, capped at 32 blocks. XP is paid per ping and scales with how valuable the revealed ore is. If HiddenOre is installed, its hidden veins are included as scan targets.

Triggers on any block broken while holding an item whose name ends in `_SHOVEL` or `_PICKAXE`. Targets are `ANCIENT_DEBRIS` and anything ending in `_ORE`, plus the nearest HiddenOre vein when that plugin is present. Scan range is `round(scanRangeBase + levelPercent * scanRangeFactor)` clamped to 6 through 32. Ping chance is `min(maxPingChance, pingChanceBase + levelPercent * pingChanceFactor)`. Cooldown is `max(350, round(cooldownMillisBase - levelPercent * cooldownMillisFactor))` milliseconds and only starts once the reveal window closes.

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

Turns a single dig into a whole plane. The plane is oriented off where you are looking: flat if you are looking up or down, vertical and aligned to your facing otherwise.

How to use it:

1. Hold a shovel and sneak.
2. Break a shovel-friendly block: dirt, sand, gravel, clay, mud, snow, and their variants.
3. One tick later the surrounding blocks in the plane break too, up to your bonus block budget.

Each bonus block costs extra durability, and the sweep stops early if the shovel would break. Bonus blocks are re-checked against protection plugins individually, so anything denied is skipped and costs you nothing.

Bonus blocks are `max(1, min(8, floor(levelPercent * bonusBlocksMax)))` taken from the eight cells around the origin. The plane is horizontal when your pitch is at or beyond 50 degrees up or down, otherwise vertical and perpendicular to your yaw. Shovel-friendly blocks are clay, dirt, coarse dirt, rooted dirt, farmland, grass block, dirt path, gravel, mycelium, podzol, sand, red sand, soul sand, soul soil, snow, snow block, mud, and muddy mangrove roots.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `bonusBlocksMax` | `8` | Bonus blocks broken at full level. Hard-capped at 8. |
| `durabilityCostPerBonusBlock` | `1` | Durability points spent per bonus block. |
| `xpPerBonusBlock` | `1.5` | Excavation skill XP per bonus block broken. |

### Treasure Hunter (`excavation-treasure-hunter`)

5 levels · 4 knowledge

Digging sand, red sand, gravel, mud, or clay with a shovel sometimes turns up something buried. The table is mostly bones, flint, and clay, with pottery sherds and the odd emerald as the rare pulls.

Rare finds get their own sparkle and level-up chime, so you know when something good came out.

Eligible blocks are `SAND`, `RED_SAND`, `GRAVEL`, `MUD`, and `CLAY`. Chance is `min(maxTreasureChance, treasureChanceBase + levelPercent * treasureChanceFactor)`. Entries with weight 6 or lower are treated as rare and get an extra effect burst.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `treasureChanceBase` | `0.01` | Treasure chance per eligible block at level 0 progress, 0-1. |
| `treasureChanceFactor` | `0.05` | Extra treasure chance added at full level, 0-1. |
| `maxTreasureChance` | `0.06` | Hard ceiling on treasure chance, 0-1. |
| `lootTable` | `["BONE:30:1:2", "FLINT:30:1:2", "CLAY_BALL:15:1:3", "ANGLER_POTTERY_SHERD:6:1:1", "ARMS_UP_POTTERY_SHERD:6:1:1", "SKULL_POTTERY_SHERD:4:1:1", "EMERALD:3:1:1"]` | Weighted drops as `MATERIAL:weight:min:max`. Unparsable or zero-weight rows are dropped. |
| `xpPerTreasure` | `12` | Excavation skill XP per treasure found. |

### Soft Fall (`excavation-soft-fall`)

5 levels · 3 knowledge

Landing on ground you could have dug reduces the fall damage, and at high levels removes it entirely.

Soft ground is dirt and its variants, grass, podzol, mycelium, path, farmland, sand, red sand, gravel, clay, mud, muddy mangrove roots, soul sand, soul soil, and snow. Either the block you land in or the block beneath it qualifies, and XP is paid per point of damage prevented, so long falls onto sand pay well.

Only `FALL` damage counts. Reduction is `min(maxReduction, reductionBase + levelPercent * reductionFactor)`.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `reductionBase` | `0.15` | Fraction of fall damage removed at level 0 progress, 0-1. |
| `reductionFactor` | `0.85` | Extra fraction removed at full level, 0-1. |
| `maxReduction` | `1.0` | Hard ceiling on the removed fraction, 0-1. |
| `xpPerDamagePrevented` | `3.0` | Excavation skill XP per half-heart of damage prevented. |

### Earth Mover (`excavation-earth-mover`)

5 levels · 7 knowledge, then 6 per level

Slams the ground and sends a ring of dirt outward, damaging every hostile mob in range, throwing them up and away, and slowing them. Damage comes from the tier of shovel you are holding, so a netherite shovel hits noticeably harder than a wooden one.

How to use it:

1. Hold a shovel and sneak.
2. Right-click. Air or a block both work.
3. Hunger is spent, the wave renders, and hostile mobs inside the radius are hit.

Mobs that take no actual damage, for example because something absorbed it, are not launched and do not pay XP.

Targets are hostile mobs (`Enemy`). Base shovel damage is 2.5 wooden and golden, 3.5 stone and copper, 4.5 iron, 5.5 diamond, and 6.5 netherite, multiplied by `max(0, damageMultiplierBase + levelPercent * damageMultiplierFactor)`. Cooldown is `max(500, round((cooldownMillisBase - levelPercent * cooldownMillisFactor) * cooldownScale))` milliseconds.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
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

Digs a shaft straight down under you, one block every couple of ticks, and stops before it drops you into something bad. It refuses to break into lava and stops when there is a two-block air gap below.
You do not open a cave ceiling under your feet.

How to use it:

1. Hold a shovel and sneak.
2. Right-click the soft block you want to dig through.
3. The first block breaks immediately. If that fails, no hunger or cooldown is spent.
4. The rest of the shaft digs itself out below you.

Each block costs durability and the whole activation costs hunger. The dig stops at a safety margin above the world floor. Every delayed block is re-authorized before it breaks, so a protection plugin can stop the shaft partway.

Depth is `max(2, round(depthBase + levelPercent * depthFactor))`. Cooldown is `max(2000, round(cooldownMillisBase - levelPercent * cooldownMillisFactor))` milliseconds. Planning stops at `worldMinHeight + safeFloorMargin`, at lava directly below,
and at a two-block air gap below. It also stops at any non shovel-friendly block
and at any block a protection plugin refuses. Shovel-friendly blocks match Tunneler's list.

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

Digging dirt, grass, coarse dirt, rooted dirt, podzol, mycelium, or dirt path with a shovel can turn up bone loot. Much more rarely it disturbs a grave and a zombie or skeleton claws out of the hole, already targeting you.

Grave mobs are tagged in persistent data, so their deaths get a soul-and-ash effect. Grave spawns have their own cooldown independent of the loot roll.

Eligible blocks are `DIRT`, `GRASS_BLOCK`, `COARSE_DIRT`, `ROOTED_DIRT`, `PODZOL`, `MYCELIUM`, and `DIRT_PATH`. Loot and grave rolls are independent. Grave mobs are a zombie or skeleton chosen at random, spawned already targeting you and tagged with `adapt:excavation_grave_mob` in persistent data.

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

Two things at once. Breaking clay, mud, muddy mangrove roots, soul sand, or soul soil with a shovel can drop an extra copy of that block's material. Separately, digging while wet gives you a block-break speed bonus.

Wet means standing in water, or standing under open sky during a storm. The bonus is an Adapt attribute modifier at 20 percent per amplifier step, not the vanilla Haste effect.

Bonus-drop blocks and their extra drop: `CLAY` gives a clay ball, `MUD` and `MUDDY_MANGROVE_ROOTS` give mud, `SOUL_SAND` gives soul sand, `SOUL_SOIL` gives soul soil. Bonus chance is `min(maxBonusChance, bonusChanceBase + levelPercent * bonusChanceFactor)`. The wet-dig bonus is `BLOCK_BREAK_SPEED` as an `ADD_SCALAR` of `0.20 * (amplifier + 1)`, where amplifier is `round(levelPercent * (maxHasteLevel - 1))`.

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

Each adaptation has its own file at `plugins/Adapt/adaptations/<id>.toml`. Alongside the keys listed above it carries `enabled`, `permanent`, `showParticles`, `showSounds`, and its learn costs (`maxLevel`, `initialCost`, `baseCost`, `costFactor`). Every file is generated with a comment on each key and values are clamped on load.

## See also

- [02 - Concepts](/adapt/02-concepts) for skills, adaptations, and knowledge
- [03 - Player Usage](/adapt/03-player-usage) for the Adapt menu and learning flow
- [10 - Skills Catalog](/adapt/10-skills-catalog) for the full skill list
- [04 - Commands & Permissions](/adapt/04-commands-permissions) for the `adapt.use` permission tree
