---
title: "Skill - Pickaxes"
description: "Pickaxes XP sources, adaptations, controls, and configuration"
published: true
date: 2026-10-01T09:26:23.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Pickaxes (`pickaxe`) gains XP from mining stone or ore and from damage dealt with a pickaxe. Its 13 adaptations add autosmelting, inventory drops, repairs, break protection, deepslate and obsidian speed, vein mining, tunnel excavation, ore detection, and extra drops at a durability cost.

## Earning XP

Breaking a block with a pickaxe pays from that block's material value, plus hardness and blast resistance, both capped, plus an ore bonus that is multiplied again for deepslate ore, then scaled by a fixed factor. Those config values are relative weights, not raw XP. Silk Touch skips that formula and pays a flat 5 XP. Blocks the anti-farm system has already devalued, including placed blocks and repeatedly farmed areas, pay nothing. Hitting a valid mob with a pickaxe pays XP from the damage dealt, counts toward the `pickaxe.damage` challenges, and shares one cooldown with block-break XP.

## Player preferences

Every adaptation has an enable switch in the bottom settings row of its level screen. Server policy controls which choices are available; settings change only your player profile. Defaults preserve the standard behavior.

| Adaptation | Personal controls |
| --- | --- |
| Autosmelt | Sneak to bypass; restrict materials to all, ores/minerals, iron, gold, copper, diamond/emerald, or stone/deepslate. The adaptation's normal smelting list remains the outer limit. |
| Drop to Inventory | Sneak to bypass; use the same material presets for collected drops. |
| Chisel | Require sneaking; retain at least 0%, 10%, 25%, or 50% tool durability after the full chisel cost. |
| Silk Spawner | Add a sneak requirement to the existing server requirements. |
| Quarry Sense | Scan while sneaking, while not sneaking, or always; restrict ore types; choose ore colors, white, cyan, or gold outlines. Ordinary interactive blocks and active Chisel take precedence over a non-sneaking scan. |
| Tunnel Bore | Choose the sneak gesture and material preset; cap the learned tunnel at its full size, 3 by 2, or 1 by 2. |
| Veinminer | Choose the sneak gesture and material preset, including HiddenOre mineral displays. |
| Unbreakable Pact | Show a rate-limited notice at 10% remaining durability. |

Deep Core, Obsidian Rush, Repair Rhythm, Stone Skin, and Gem Polish have the enable switch. Ore/mineral presets include ores, raw metals, ingots, coal, diamond, emerald, redstone, lapis, quartz, and ancient debris; the narrower gem preset excludes tools and armor. A preference never expands the adaptation's normal block or item list.

## Adaptations

### Ore Chisel (`pickaxe-chisel`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/pickaxe/pickaxe-chisel-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/pickaxe/pickaxe-chisel-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

7 levels · 5 knowledge, then 6 per level

A right-click on a vanilla ore with a main-hand pickaxe that has neither Silk Touch nor Mending, or a right-click on air aimed at an ore within 5 blocks, chisels that ore; if the break is not allowed, nothing is spent. Drops are coal, raw copper, raw gold from gold or Nether gold ore, raw iron, diamond, lapis lazuli, emerald, quartz, or redstone, and deepslate variants drop the same item.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `cooldownTime` | `5` | Item cooldown put on the held pickaxe after a chisel, in ticks. |
| `dropChanceBase` | `0.07` | Extra-ore chance before the level bonus, 0-1. |
| `dropChanceFactor` | `0.22` | Extra-ore chance added at max level, scaled by level progress, 0-1. |
| `breakChance` | `0.25` | Chance the chiselled block breaks normally, 0-1. Level does not change it. |
| `damagePerBlockBase` | `1` | Durability charged on every chisel. |
| `damageFactorInverseMultiplier` | `2` | Extra durability charged at level 1, falling to 0 at max level. |

### Veinminer (`pickaxe-veinminer`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/pickaxe/pickaxe-veinminer-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/pickaxe/pickaxe-veinminer-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge, then 6 per level

Sneak-breaking ore, obsidian, or ancient debris with a pickaxe also breaks connected blocks of the same family: any material ending in `_ORE`, with `DEEPSLATE_*_ORE` grouped with its base ore, plus `OBSIDIAN` and `ANCIENT_DEBRIS`. Each extra block breaks normally, so enchantments and Autosmelt apply per block, drops are not merged, and HiddenOre veins chain the same way.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `baseRange` | `2` | Blocks added to the vein search radius. Radius is level plus this value. |
| `maxBlocks` | `64` | Cap on blocks collected by one vein, counting the block you broke. |

### Autosmelt (`pickaxe-autosmelt`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/pickaxe/pickaxe-autosmelt-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/pickaxe/pickaxe-autosmelt-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

4 levels · 4 knowledge, then 6 per level

Iron, gold, and copper ore, including deepslate variants, drop ingots when the pickaxe is the correct tool and lacks Silk Touch. The extra-ingot chance is `level * 1.25%` and is not a config key.

### Pickaxe Drop-To-Inventory (`pickaxe-drop-to-inventory`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/pickaxe/pickaxe-drop-to-inventory-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/pickaxe/pickaxe-drop-to-inventory-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

1 level · 3 knowledge

Pickaxe breaks put drops into the inventory. Overflow falls at the player's feet, and a drop that a protection plugin would block picking up stays on the ground.

### Pickaxe Silk-Spawner (`pickaxe-silk-spawner`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/pickaxe/pickaxe-silk-spawner-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/pickaxe/pickaxe-silk-spawner-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

2 levels · 4 knowledge, then 6 per level

A spawner broken with the correct pickaxe drops a spawner item that keeps only the mob type, so timers and other block state are not copied and matching mob types stack. Level 1 requires Silk Touch, level 2 requires sneak and no Silk Touch, and a later cancelled drop event removes the spawner item.

### Quarry Sense (`pickaxe-quarry-sense`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/pickaxe/pickaxe-quarry-sense-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/pickaxe/pickaxe-quarry-sense-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge

A sneak-right-click with an iron, diamond, or netherite pickaxe consumes the click and shows the scanning player private outlines colored by ore type, including HiddenOre veins. Only one scan runs at a time; radius is clamped to 4-32 blocks and markers to 16, whatever the config says.

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

<div class="adapt-demo">
<video src="/adapt-assets/demos/pickaxe/pickaxe-tunnel-bore-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/pickaxe/pickaxe-tunnel-bore-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

3 levels · 4 knowledge, then 5 per level

Sneaking and breaking `STONE`, `COBBLESTONE`, `MOSSY_COBBLESTONE`, `DEEPSLATE`, `COBBLED_DEEPSLATE`, `TUFF`, `CALCITE`, `ANDESITE`, `DIORITE`, or `GRANITE` with a pickaxe also breaks a facing-aligned face one tick later: 1 by 2 at level 1, 3 by 2 at level 2, and 3 by 3 at level 3. Pitch past 60 degrees lays that face flat, and only those block types inside the face break.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `durabilityPerBonusBlock` | `1` | Durability charged per bonus block broken, on top of the normal break. |

### Deep Core (`pickaxe-deep-core`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/pickaxe/pickaxe-deep-core-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/pickaxe/pickaxe-deep-core-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

3 levels · 3 knowledge, then 4 per level

Hitting `DEEPSLATE`, `COBBLED_DEEPSLATE`, `POLISHED_DEEPSLATE`, `DEEPSLATE_BRICKS`, `DEEPSLATE_TILES`, or any `DEEPSLATE_*_ORE` with a pickaxe refreshes a `BLOCK_BREAK_SPEED` modifier, not Haste. Amplifier is `min(maxAmplifier, amplifierBase + level - 1)`.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `amplifierBase` | `2` | Amplifier at level 1. Speed bonus is 20% per amplifier step plus 20%. |
| `maxAmplifier` | `5` | Cap on the amplifier, worth +120% break speed. |
| `durationTicks` | `60` | How long the speed bonus lasts after each hit on deepslate, in ticks. |

### Obsidian Rush (`pickaxe-obsidian-rush`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/pickaxe/pickaxe-obsidian-rush-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/pickaxe/pickaxe-obsidian-rush-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

3 levels · 4 knowledge, then 5 per level

Hitting `OBSIDIAN` or `CRYING_OBSIDIAN` with a diamond or netherite pickaxe refreshes a `BLOCK_BREAK_SPEED` modifier. Any other pickaxe does nothing.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `amplifierBase` | `3` | Amplifier added on top of the adaptation level. Speed bonus is 20% per amplifier step plus 20%. |
| `maxAmplifier` | `7` | Cap on the amplifier, worth +160% break speed. |
| `durationTicks` | `120` | How long the burst lasts after each hit on obsidian, in ticks. |

### Unbreakable Pact (`pickaxe-unbreakable-pact`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/pickaxe/pickaxe-unbreakable-pact-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/pickaxe/pickaxe-unbreakable-pact-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 5 knowledge, then 6 per level

A durability hit that would break the pickaxe stops at 1 remaining durability. Ignore chance is `min(maxIgnoreChance, level * ignoreChancePerLevel)`.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `ignoreChancePerLevel` | `0.04` | Chance per level to cancel a durability hit outright, 0-1. |
| `maxIgnoreChance` | `0.25` | Cap on the ignore chance, 0-1. |

### Repair Rhythm (`pickaxe-repair-rhythm`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/pickaxe/pickaxe-repair-rhythm-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/pickaxe/pickaxe-repair-rhythm-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge, then 5 per level

Any block broken with a pickaxe, not only stone, can cancel that break's durability loss and restore durability, but only when the tool is already damaged. Chance is `min(maxChance, chanceBase + level * chancePerLevel)`.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `chanceBase` | `0.05` | Repair chance before the level bonus, 0-1. |
| `chancePerLevel` | `0.06` | Repair chance added per level, 0-1. |
| `maxChance` | `0.5` | Cap on the repair chance, 0-1. |
| `restoreMin` | `1` | Fewest durability points restored per proc. |
| `restoreMax` | `2` | Most durability points restored per proc. |

### Trophy Polish (`pickaxe-gem-polish`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/pickaxe/pickaxe-gem-polish-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/pickaxe/pickaxe-gem-polish-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge, then 6 per level

Breaking a naturally generated skeleton, wither skeleton, zombie, player, creeper, dragon, or piglin head or skull, including wall forms, or a dragon egg, with a pickaxe spawns one vanilla XP orb of `min(maximumXpPerTrophy, vanillaXpAtLevelOne + (level - 1) * vanillaXpPerAdditionalLevel)` and does not duplicate the trophy. Ores and amethyst never qualify, and a piston, gravity, or teleport move pays nothing.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `headsEnabled` | `true` | Allows naturally generated standing and wall heads or skulls. |
| `dragonEggEnabled` | `true` | Allows naturally generated dragon egg blocks. |
| `rejectPlayerModifiedBlocks` | `true` | Permanently rejects player-placed or previously player-modified trophies. |
| `vanillaXpAtLevelOne` | `7` | Vanilla XP points granted at adaptation level one. |
| `vanillaXpPerAdditionalLevel` | `3` | XP points added for every level after level one. |
| `maximumXpPerTrophy` | `24` | Hard cap on one trophy reward. |

### Stone Skin (`pickaxe-stone-skin`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/pickaxe/pickaxe-stone-skin-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/pickaxe/pickaxe-stone-skin-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

4 levels · 4 knowledge, then 5 per level

Each break of a Tunnel Bore block adds one stack and refreshes Resistance. Amplifier is `stacks / blocksPerStack`, capped at `min(level, maxAmplifier + 1)`.

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

## See also

Catalog: [Skills](/adapt/10-skills-catalog). Rules: [Concepts](/adapt/02-concepts).
