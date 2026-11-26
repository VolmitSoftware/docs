---
title: "Upgrades - Pickaxes"
description: "Pickaxes upgraded adaptations for mutated skills"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These upgrades are available only after you mutate Pickaxes (see [Mutations](/adapt/35-mutations)), and they replace the original adaptations of [Pickaxes](/adapt/25-skill-pickaxes).

## Upgrades

### Motherlode (`upgraded-pickaxe-motherlode`)

3 levels · 13, 13 and 16 knowledge · Fuses Veinminer, Autosmelt and Ore Chisel

Breaking an ore, obsidian or ancient debris with a pickaxe also breaks the connected blocks of the same vein, with no sneak or gesture needed. Stone and deepslate variants of an ore count as one vein. The vein reaches 4 blocks from the first block at level 1, 5 at level 2 and 6 at level 3, up to 64 blocks, and skips any block you are not allowed to break. A vein of 3 or more natural ores, the first block included, drops one bonus item at the first block: an ingot for iron, gold or copper ore, the ore's usual drop for coal, diamond, emerald, lapis, redstone, quartz and Nether gold ore, and nothing for obsidian or ancient debris. Ores you placed yourself do not count toward the 3, and a pickaxe with Silk Touch never drops the bonus. You earn 2 skill XP per extra natural block.

Iron, gold and copper ore mined with the right pickaxe drop ingots instead of raw metal, with a 1.25% chance per level of one extra ingot, except for an ore you placed yourself. Silk Touch turns the smelting off.

From level 2, a spawner mined while sneaking with a pickaxe without Silk Touch drops as an item that keeps its mob, for 200 pickaxe durability. A pickaxe with less durability left cannot keep it; without sneaking the spawner breaks as usual and nothing is charged. A kept spawner gives no XP, and a spawner a player placed never gives XP. Silk Touch spawners are left to the kept Silk Spawner, and trial spawners never drop. From level 3, the dropped spawner names its mob in its lore and can be placed only where the player placing it may build.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `veinRadiusBase` | `3` | Vein reach in blocks before the level is added. |
| `maxBlocks` | `64` | Most blocks one vein can break. |
| `bonusOres` | `1` | Bonus items dropped for each vein. |
| `bonusVeinSize` | `3` | Natural ores a vein needs, the first block included, before it drops the bonus. |
| `xpPerOre` | `2` | Skill XP for each extra natural block in the vein. |
| `spawnerLevel` | `2` | Level from which a spawner mined while sneaking without Silk Touch drops itself. |
| `spawnerDurability` | `200` | Pickaxe durability each kept spawner costs. |
| `spawnerDisplayLevel` | `3` | Level from which a kept spawner names its mob and can be placed only where the placer may build. |

### Earthshaker (`upgraded-pickaxe-earthshaker`)

3 levels · 15, 14 and 18 knowledge · Fuses Tunnel Bore, Deep Core and Obsidian Rush

Breaking stone, cobblestone, mossy cobblestone, tuff, calcite, andesite, diorite, granite, any deepslate block or deepslate ore with a pickaxe also breaks the 3 by 3 face around it, at every level. Obsidian and crying obsidian join that list when you hold a diamond or netherite pickaxe. The face is upright in front of you, or flat when you look more than 60 degrees up or down. Only the listed blocks in the face break, each extra block costs 1 more durability, and each natural one pays 0.5 skill XP.

Hitting deepslate blocks, or obsidian with a diamond or netherite pickaxe, raises your break speed toward the speed of stone for 3 seconds after each swing. Level 1 closes 34% of the gap, level 2 closes 68% and level 3 mines them at stone speed. The speed needs the break speed attribute, so it is off on versions without it; the bore and the charges work on every version.

Earthshaker also unlocks Prospector's Charges, crafted shapeless from gunpowder, a copper ingot and a clay ball, one charge per craft, stacking to 16. Right-click stone, deepslate or an ore with a charge and it sets; 3 seconds later it opens a rough sphere around that block with a radius of 2 at level 1, 3 at level 2 and 4 at level 3. Hold a pickaxe when the charge goes off: it breaks every block for real, so ores drop as they would for that pickaxe (smelted by Motherlode, kept whole by Silk Touch) and each block costs 1 durability. Switching away from the pickaxe stops the blast. The sphere opens stone, deepslate and ores, plus obsidian from level 3 with a diamond or netherite pickaxe. It never opens blocks a player placed, spawners, containers or bedrock, skips protected blocks, and hurts no one. Ores within 2 blocks outside the sphere glow for you for 10 seconds. Each natural block opened pays 0.5 skill XP. Sneak-right-click with the charges to switch between dropping and discarding the stone they open; ores always drop. You can have one charge set at a time. If the charge cannot go off (no pickaxe in hand, another world, the upgrade gone), you get it back.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `speedSharePerLevel` | `0.34` | Share of the gap to stone speed closed per level, capped at the full gap. |
| `boostDurationTicks` | `60` | How long the speed lasts after each swing, in ticks. |
| `durabilityPerBonusBlock` | `1` | Extra pickaxe durability lost for each block in the face. |
| `xpPerBlock` | `0.5` | Skill XP for each natural block in the face. |
| `chargeRadiusBase` | `1` | Charge radius in blocks before the level is added. |
| `chargeFuseTicks` | `60` | Ticks between setting a charge and its blast. |
| `chargeBlocksPerTick` | `12` | Blocks a blast breaks per tick. |
| `chargeGlowTicks` | `200` | How long ores just outside the sphere glow, in ticks. |
| `chargeObsidianLevel` | `3` | Level from which a charge also opens obsidian, with a diamond or netherite pickaxe. |

### Eternal Pick (`upgraded-pickaxe-eternal-pick`)

3 levels · 13, 13 and 16 knowledge · Fuses Unbreakable Pact, Repair Rhythm and Stone Skin

Your pickaxe never breaks: damage that would break it leaves it at 1 durability instead. Each block you mine with the right pickaxe has a 40% chance at level 1, 55% at level 2 and 70% at level 3 to restore 2 durability. Only the block you swing at counts: blocks you placed yourself and the extra blocks a vein or Earthshaker breaks restore nothing and add no stacks.

Every counted block adds a stack, and every 4 stacks raise your Resistance by one tier. Resistance tops out at I at level 1, II at level 2 and III at level 3. Each block keeps the effect for 4 seconds, and the stacks reset after 6 seconds without mining.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `repairChanceBase` | `0.25` | Repair chance per mined block before the level is added. |
| `repairChancePerLevel` | `0.15` | Repair chance added per level. |
| `restorePerRepair` | `2` | Durability restored by each repair. |
| `blocksPerStack` | `4` | Blocks mined for each Resistance tier. |
| `stackDurationMs` | `6000` | How long stacks last without mining, in milliseconds. |
| `effectDurationTicks` | `80` | How long Resistance lasts after each block, in ticks. |
| `maxAmplifier` | `2` | Highest Resistance amplifier the stacks reach (2 is Resistance III). |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Pickaxes](/adapt/25-skill-pickaxes).
