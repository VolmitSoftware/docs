---
title: "Skill - Pickaxes"
description: "Pickaxes XP sources, adaptations, controls, and configuration"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Pickaxes gains XP from mining stone or ore and from dealing damage with a pickaxe. The skill id is `pickaxe`, and it has 13 adaptations.

Adaptations add autosmelting, direct inventory drops, repairs, break protection, deepslate and obsidian speed, vein mining, tunnel excavation, ore detection, and extra drops at a durability cost. Challenges track blocks, ores, material value, and pickaxe damage.

## Earning XP

Breaking a block with a pickaxe awards XP based on what the block was. Each block starts from its configured material value. Then it picks up its hardness and blast resistance (both capped). Then an ore bonus if it is an ore. Deepslate ore variants get their bonus multiplied. The whole thing is then scaled down by a fixed factor. The numbers in the config are relative weights rather than raw XP.

Silk Touch skips all of that and pays a flat 5 XP. The block you get back is worth mining again. Blocks that the anti-farm system has already devalued (placed blocks, repeatedly farmed areas) pay nothing.

Hitting a valid mob with a pickaxe awards XP scaled from the damage dealt. It counts toward the `pickaxe.damage` challenges. Both XP paths share one cooldown. Spamming breaks or hits faster than that window does not multiply your income.

## Adaptations

All of this needs the adaptation learned to level 1 or higher from the Adapt menu (`/adapt`), the skill and the adaptation enabled, a world and game mode that are not blocked, and the `adapt.use.<adaptation>` permission. See [08 - Protection & Region Policy](/adapt/08-protection-region-policy) and [04 - Commands & Permissions](/adapt/04-commands-permissions).

### Ore Chisel (`pickaxe-chisel`)

7 levels · 5 knowledge, then 6 per level

Chisel lets you work an exposed ore without mining it out, popping loose extra material for heavy tool wear. There is also a flat chance the ore block gives up and breaks normally, so you never fully waste the swing. It refuses to work with Silk Touch or Mending on the pickaxe, because both would trivialize it.

1. Hold a pickaxe with no Silk Touch and no Mending in your main hand.
2. Right-click a vanilla ore block. Right-clicking air works too, targeting whatever ore you are looking at within 5 blocks.
3. Wait out the short item cooldown before the next chisel.

Each chisel costs durability. Cost is worst at low levels and cheapest at max
level. It rolls two separate chances: one for the bonus drop, one for the block
breaking outright.

Chiselable ores and their drops follow. Coal ore drops coal. Copper ore drops
raw copper. Gold and Nether gold ore drop raw gold. Iron ore drops raw iron.
Diamond ore drops diamond. Lapis ore drops lapis lazuli. Emerald ore drops
emerald. Nether quartz ore drops quartz. Redstone ore drops redstone. Deepslate variants use the same drop.

The ore has to pass a normal block-break check first, so nothing is spent where you are not allowed to mine.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `cooldownTime` | `5` | Item cooldown put on the held pickaxe after a chisel, in ticks. |
| `dropChanceBase` | `0.07` | Extra-ore chance before the level bonus, 0-1. |
| `dropChanceFactor` | `0.22` | Extra-ore chance added at max level, scaled by level progress, 0-1. |
| `breakChance` | `0.25` | Chance the chiselled block breaks normally, 0-1. Level does not change it. |
| `damagePerBlockBase` | `1` | Durability charged on every chisel. |
| `damageFactorInverseMultiplier` | `2` | Extra durability charged at level 1, falling to 0 at max level. |

### Veinminer (`pickaxe-veinminer`)

5 levels · 4 knowledge, then 6 per level

Veinminer follows an ore vein instead of making you chase it block by block. It groups deepslate variants with their normal counterparts. A mixed deepslate and stone iron vein still counts as one vein. It also works on obsidian and ancient debris.

1. Learn it, then hold a pickaxe.
2. Sneak.
3. Break any ore, obsidian, or ancient debris. Connected blocks of the same family within range break with it.

Every sibling block goes through your normal break, so drops, enchantments, and other adaptations like Autosmelt apply to each one individually. Drops are not merged into a single stack. If HiddenOre is installed, its hidden veins chain the same way.

Vein search radius is `level + baseRange`. Eligible blocks are any material ending in `_ORE`, plus `OBSIDIAN` and `ANCIENT_DEBRIS`. `DEEPSLATE_*_ORE` is treated as the same family as its base ore.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `baseRange` | `2` | Blocks added to the vein search radius. Radius is level plus this value. |
| `maxBlocks` | `64` | Cap on blocks collected by one vein, counting the block you broke. |

### Autosmelt (`pickaxe-autosmelt`)

4 levels · 4 knowledge, then 6 per level

Iron, gold, and copper ore come out of the ground as ingots instead of raw chunks. Higher levels add a small chance of one extra ingot on top. Silk Touch turns it off, and the pickaxe has to be the correct tool for the block.

Converted ores: iron ore to iron ingot, gold ore to gold ingot, copper ore to copper ingot, including deepslate variants. Extra-drop chance is `level * 1.25%`, hardcoded and not configurable.

### Pickaxe Drop-To-Inventory (`pickaxe-drop-to-inventory`)

1 level · 3 knowledge

Blocks you break with a pickaxe put their drops straight into your inventory instead of on the ground. Anything that does not fit falls at your feet, and anything a protection plugin would stop you picking up stays on the ground.

### Pickaxe Silk-Spawner (`pickaxe-silk-spawner`)

2 levels · 4 knowledge, then 6 per level

Spawners drop as spawners, keeping only the mob type they were set to. Spawn timers and other block state are not copied, so two drops of the same mob type stack. The pickaxe has to be the right tool for the block.

1. At level 1, break the spawner with a Silk Touch pickaxe.
2. At level 2, sneaking while you break it is enough, no Silk Touch needed.

If anything cancels the drop event afterward, the spawner item is removed again and you get a puff of smoke instead.

### Quarry Sense (`pickaxe-quarry-sense`)

5 levels · 4 knowledge

Quarry Sense is an ore scan. It marks nearby ore with glowing block outlines that only you can see, colored
per ore type. It pays Pickaxes XP for every ore it finds. It costs a slice of your pickaxe's durability per scan and puts the pickaxe on a short cooldown.

1. Learn it and hold an iron, diamond, or netherite pickaxe.
2. Sneak and right-click. The right-click is consumed, so the block you clicked does not activate.
3. Wait for the scan to finish, then follow the outlines before they fade.

The scan is budgeted rather than exhaustive. It searches a close-in radius fully. Then it spreads the remaining samples across the whole range. It finds ore reliably up close and opportunistically far out. Only one scan can run at a time per player. Leveling widens the radius, shows more markers, keeps them up longer, and lowers both the cooldown and the durability cost. Hidden ore veins from HiddenOre are included.

Scan radius is clamped to 4-32 blocks and markers to 16, whatever the config says. Only iron, diamond, and netherite pickaxes qualify.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `costsReduceMaxDurability` | `false` | When true, a scan lowers the pickaxe's maximum durability instead of damaging it. |
| `scanRadiusBase` | `10` | Scan radius in blocks before the level bonus. |
| `scanRadiusFactor` | `18` | Blocks added to the scan radius at max level. |
| `maxBlockChecks` | `2048` | World block samples budgeted per scan. |
| `denseScanRadius` | `6` | Radius in blocks searched exhaustively before the remaining samples spread over the full radius. |
| `maxHighlightsBase` | `6` | Ore markers shown before the level bonus. |
| `maxHighlightsFactor` | `10` | Extra markers at max level. |
| `highlightTicksBase` | `90` | Marker lifetime in ticks before the level bonus. |
| `highlightTicksFactor` | `90` | Extra marker ticks at max level. |
| `cooldownTicksBase` | `60` | Pickaxe cooldown in ticks before the level reduction. |
| `cooldownTicksFactor` | `40` | Cooldown ticks removed at max level. |
| `durabilityCostPercentBase` | `0.006` | Fraction of max durability charged per scan before the level reduction, 0-1. |
| `durabilityCostPercentFactor` | `0.0045` | Fraction subtracted from the scan cost at max level. |
| `minDurabilityCostPercent` | `0.001` | Floor for the scan cost fraction, 0-1. |
| `xpPerFoundOre` | `6` | Pickaxes XP granted per ore revealed by a successful scan. |

### Tunnel Bore (`pickaxe-tunnel-bore`)

3 levels · 4 knowledge, then 5 per level

Tunnel Bore turns stone digging into tunnel digging. Break one stone-type block while sneaking and the surrounding face goes with it, oriented by the direction you are facing. Looking sharply up or down flips the face flat so you can sink or raise a shaft.

1. Learn it and hold a pickaxe.
2. Sneak.
3. Mine stone, cobblestone, deepslate, tuff, calcite, andesite, diorite, or granite. The bonus face breaks one tick later.

The face is 1 wide by 2 tall at level 1, 3 by 2 at level 2, and 3 by 3 at level 3. Only bore-eligible blocks in that face are taken, and each bonus block costs extra durability.

Eligible block types are `STONE`, `COBBLESTONE`, `MOSSY_COBBLESTONE`, `DEEPSLATE`, `COBBLED_DEEPSLATE`, `TUFF`, `CALCITE`, `ANDESITE`, `DIORITE`, and `GRANITE`. The face is vertical and perpendicular to your facing, or horizontal when your pitch is beyond 60 degrees up or down.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `durabilityPerBonusBlock` | `1` | Durability charged per bonus block broken, on top of the normal break. |

### Deep Core (`pickaxe-deep-core`)

3 levels · 3 knowledge, then 4 per level

Deepslate normally digs about twice as slow as stone. Deep Core gives you a block break speed bonus the moment you start hitting any deepslate block. The bonus is refreshed on every hit. The deep world stops feeling like a wall. It works on its own once learned, as long as you are holding a pickaxe.

The bonus is a timed `BLOCK_BREAK_SPEED` attribute modifier, not a Haste potion effect. Amplifier is `min(maxAmplifier, amplifierBase + level - 1)` and the speed bonus is `20% * (amplifier + 1)`, so +60% at level 1 and +100% at level 3 with the defaults. Trigger blocks: `DEEPSLATE`, `COBBLED_DEEPSLATE`, `POLISHED_DEEPSLATE`, `DEEPSLATE_BRICKS`, `DEEPSLATE_TILES`, and every `DEEPSLATE_*_ORE`.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `amplifierBase` | `2` | Amplifier at level 1. Speed bonus is 20% per amplifier step plus 20%. |
| `maxAmplifier` | `5` | Cap on the amplifier, worth +120% break speed. |
| `durationTicks` | `60` | How long the speed bonus lasts after each hit on deepslate, in ticks. |

### Obsidian Rush (`pickaxe-obsidian-rush`)

3 levels · 4 knowledge, then 5 per level

Same idea as Deep Core but aimed at obsidian, and much stronger. Start hitting obsidian or crying obsidian with a diamond or netherite pickaxe.
You get a big break speed burst that lasts a few seconds past each hit. Lesser pickaxes get nothing.

Also a timed `BLOCK_BREAK_SPEED` modifier. Amplifier is `min(maxAmplifier, amplifierBase + level)` and the bonus is `20% * (amplifier + 1)`, so +100% at level 1 and +140% at level 3 with the defaults. Only `DIAMOND_PICKAXE` and `NETHERITE_PICKAXE` qualify. Targets are `OBSIDIAN` and `CRYING_OBSIDIAN`.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `amplifierBase` | `3` | Amplifier added on top of the adaptation level. Speed bonus is 20% per amplifier step plus 20%. |
| `maxAmplifier` | `7` | Cap on the amplifier, worth +160% break speed. |
| `durationTicks` | `120` | How long the burst lasts after each hit on obsidian, in ticks. |

### Unbreakable Pact (`pickaxe-unbreakable-pact`)

5 levels · 5 knowledge, then 6 per level

Your pickaxe stops at 1 durability instead of shattering. On top of that, each durability hit has a chance to be ignored completely, which scales with level up to a cap.

Ignore chance is `min(maxIgnoreChance, level * ignoreChancePerLevel)`. When the roll fails and the hit would destroy the pickaxe, its damage is clamped to one point below the maximum instead.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `ignoreChancePerLevel` | `0.04` | Chance per level to cancel a durability hit outright, 0-1. |
| `maxIgnoreChance` | `0.25` | Cap on the ignore chance, 0-1. |

### Repair Rhythm (`pickaxe-repair-rhythm`)

5 levels · 4 knowledge, then 5 per level

Every block you break with a pickaxe has a chance to cancel that block's durability wear and give one or two additional points back. It only triggers on a damaged tool, and it stacks well with Unbreakable Pact for a pickaxe that basically maintains itself.

Repair chance is `min(maxChance, chanceBase + level * chancePerLevel)`. It applies to any block broken with a pickaxe, not only stone, and does nothing if the tool is already at full durability.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `chanceBase` | `0.05` | Repair chance before the level bonus, 0-1. |
| `chancePerLevel` | `0.06` | Repair chance added per level, 0-1. |
| `maxChance` | `0.5` | Cap on the repair chance, 0-1. |
| `restoreMin` | `1` | Fewest durability points restored per proc. |
| `restoreMax` | `2` | Most durability points restored per proc. |

### Trophy Polish (`pickaxe-gem-polish`)

5 levels · 4 knowledge, then 6 per level

Mining a naturally generated standing or wall head, skull, or dragon egg with a pickaxe drops a bounded vanilla XP orb. Ores and amethyst never qualify, and the adaptation never duplicates the trophy. Player-placed or previously player-modified trophies are permanently rejected by default, so moving the same head or egg cannot become an XP loop. Only breaking it yourself qualifies — collecting a dragon egg with a piston, gravity, or a teleport pays nothing.

Eligible heads are skeleton, wither skeleton, zombie, player, creeper, dragon, and piglin heads or skulls, including their wall forms, plus `DRAGON_EGG`. The orb is `min(maximumXpPerTrophy, vanillaXpAtLevelOne + (level - 1) * vanillaXpPerAdditionalLevel)`, or 7-19 points at defaults.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `headsEnabled` | `true` | Allows naturally generated standing and wall heads or skulls. |
| `dragonEggEnabled` | `true` | Allows naturally generated dragon egg blocks. |
| `rejectPlayerModifiedBlocks` | `true` | Permanently rejects player-placed or previously player-modified trophies. |
| `vanillaXpAtLevelOne` | `7` | Vanilla XP points granted at adaptation level one. |
| `vanillaXpPerAdditionalLevel` | `3` | XP points added for every level after level one. |
| `maximumXpPerTrophy` | `24` | Hard cap on one trophy reward. |

### Stone Skin (`pickaxe-stone-skin`)

4 levels · 4 knowledge, then 5 per level

Mining stone builds stacks that turn into Resistance. Every few stone blocks adds a tier, each break refreshes the effect, and the stacks decay if you stop mining. It is a caving survival tool: by the time something ambushes you in a tunnel, you are already armored.

Trigger blocks are the same list Tunnel Bore uses. One stack per qualifying break. The Resistance amplifier is `stacks / blocksPerStack`, capped at `min(level, maxAmplifier + 1)` tiers, so 4 levels of the adaptation reach Resistance IV after 16 stone blocks. Every break reapplies the effect for `effectDurationTicks`, and stacks reset if you go longer than `stackDurationMs` without a qualifying break.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `blocksPerStack` | `4` | Stone blocks broken per Resistance tier. |
| `stackDurationMs` | `6000` | Milliseconds of no mining before built stacks reset. |
| `effectDurationTicks` | `80` | Resistance duration reapplied on each qualifying break, in ticks. |
| `maxAmplifier` | `3` | Cap on the Resistance amplifier, worth Resistance IV. |

## Reference

### Skill configuration defaults

Written to `plugins/Adapt/skills/pickaxe.toml` on first load.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `enabled` | `true` | Turns the whole Pickaxes skill off when false. |
| `skillColor` | `"&6"` | Legacy ampersand color code used for this skill in menus and text. |
| `getXpForAttackingWithTools` | `true` | When false, hitting mobs with a pickaxe grants no Pickaxes XP. |
| `damageXPMultiplier` | `6.0` | XP granted per point of damage dealt with a pickaxe. |
| `blockValueMultiplier` | `0.125` | Scales the configured material value before hardness and ore bonuses are added. |
| `maxHardnessBonus` | `9` | Cap on the block hardness added to a block's mining value. |
| `maxBlastResistanceBonus` | `10` | Cap on the block blast resistance added to a block's mining value. |
| `coalBonus` | `18` | Value added for coal ore. |
| `copperBonus` | `22` | Value added for copper ore. |
| `ironBonus` | `30` | Value added for iron ore. |
| `goldBonus` | `38` | Value added for gold ore. |
| `redstoneBonus` | `55` | Value added for redstone ore. |
| `lapisBonus` | `75` | Value added for lapis ore. |
| `netherGoldBonus` | `105` | Value added for Nether gold ore. |
| `netherQuartzBonus` | `125` | Value added for Nether quartz ore. |
| `diamondBonus` | `175` | Value added for diamond ore. |
| `emeraldBonus` | `210` | Value added for emerald ore, and the base unit for every Pickaxes milestone reward. |
| `debrisBonus` | `210` | Value added for ancient debris. |
| `deepslateMultiplier` | `1.35` | Multiplier applied to the ore bonus of deepslate ore variants. |
| `cooldownDelay` | `1250` | Milliseconds between XP awards from mining or pickaxe damage. |

### Challenges

| Challenge | Threshold | Reward knob |
|---|---|---|
| `challenge_pickaxe_1k` | 1000 | `emeraldBonus` x 2 |
| `challenge_pickaxe_5k` | 5000 | `emeraldBonus` x 5 |
| `challenge_pickaxe_50k` | 50000 | `emeraldBonus` x 10 |
| `challenge_pick_damage_1k` | 1000 | `emeraldBonus` |
| `challenge_pick_damage_10k` | 10000 | `emeraldBonus` x 2 |
| `challenge_pick_value_5k` | 5000 | `emeraldBonus` |
| `challenge_pick_value_50k` | 50000 | `emeraldBonus` x 2 |
| `challenge_pick_ores_500` | 500 | `emeraldBonus` |
| `challenge_pick_ores_5k` | 5000 | `emeraldBonus` x 2 |

Each adaptation has its own file at `plugins/Adapt/adaptations/<id>.toml`. Alongside the keys listed above it carries `enabled`, `permanent`, `showParticles`, `showSounds`, and its learn costs (`maxLevel`, `initialCost`, `baseCost`, `costFactor`). Every file is generated with a comment on each key and values are clamped on load.

## See also

- [02 - Concepts](/adapt/02-concepts)
- [03 - Player Usage](/adapt/03-player-usage)
- [10 - Skills Catalog](/adapt/10-skills-catalog)
- [04 - Commands & Permissions](/adapt/04-commands-permissions)
