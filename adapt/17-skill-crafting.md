---
title: "Skill - Crafting"
description: "Crafting XP sources, adaptations, recipes, and configuration"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Crafting gains XP from crafted output and nearby furnaces. Craft rewards scale with material value, while both reward paths use cooldowns.

Its 14 adaptations add recipes, salvage, bulk crafting, portable workstations, a bound compactor, backpacks, material refunds, equipment improvements, and food bonuses. Five adaptations are permanent by default.

## Adaptations

All of this needs the adaptation learned to level 1 or higher, the skill and the adaptation enabled in config, the `adapt.use` permission, and protection and region policy that allow the action.

### Deconstruction (`crafting-deconstruction`)

1 level · 8 knowledge

Shears that work backwards. Point them at an item lying on the ground and you get back half of the recipe's most-used component. Armor has to be fully repaired first, and enchantments or other metadata do not hide the vanilla recipe.

**How to use it**

1. Drop the item you want to break down.
2. Hold shears in your main hand, sneak, and right-click the dropped item.

The dropped item has to be one you are allowed to pick up. If anything denies that, the item, your shears, your XP, and your stats are all left alone.

Adapt picks the material occupying the most slots in the recipe, adjusts for the recipe's output count, and returns 50 percent. Where an item has several recipes, the one with the most occupied slots wins, and a recipe whose salvage is not worth less than the source is rejected. Large outputs come out as several stacks.

### Crafting XP (`crafting-xp`)

7 levels · 3 knowledge, then 2 per level

Taking a committed craft result can produce a bounded vanilla XP orb. The default reward is one point at level one plus one point per additional adaptation level, for 1-7 points, with a 30-second per-player cooldown. The nominal result must fit the player's storage and the reward does not scale with crafted stack size.

The vanilla XP reward is `min(maximumXpPerCraft, vanillaXpAtLevelOne + (level - 1) * vanillaXpPerAdditionalLevel)`.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `vanillaXpAtLevelOne` | `1` | Vanilla XP points granted at adaptation level one. |
| `vanillaXpPerAdditionalLevel` | `1` | XP points added for every level after level one. |
| `maximumXpPerCraft` | `16` | Hard cap on one craft reward. |
| `cooldownMillis` | `30000` | Minimum milliseconds between rewards for one player. |

### Craftable Leather (`crafting-leather`)

1 level · 2 knowledge

Rotten flesh becomes useful. Cook it on a campfire and you get leather. Zombie farms turn into a leather supply.

**How to use it**

1. Hold rotten flesh.
2. Right-click a campfire to put it on.

Without the adaptation the click is cancelled and the campfire hisses at you.

Recipe key `crafting-leather`, campfire: `ROTTEN_FLESH` to `LEATHER`, cook time 100 ticks, 1 vanilla experience.

### Craftable Skulls (`crafting-skulls`)

1 level · 2 knowledge

Unlocks shaped recipes for mob heads. Every one is a ring of eight of one material around a bone block. Bones make a skeleton skull. Nether bricks make a wither skeleton skull. Rotten flesh makes a zombie head. Gunpowder makes a creeper head. Dragon breath makes a dragon head. Decorating no longer requires a charged creeper or a dead dragon.

Five shaped recipes each use eight of a ring material around one `BONE_BLOCK`.
`crafting-skeletonskull` maps `BONE` to `SKELETON_SKULL`.
`crafting-witherskeletonskull` maps `NETHER_BRICK` to `WITHER_SKELETON_SKULL`.
`crafting-zombieskull` maps `ROTTEN_FLESH` to `ZOMBIE_HEAD`.
`crafting-creeperhead` maps `GUNPOWDER` to `CREEPER_HEAD`. `crafting-dragonhead`
maps `DRAGON_BREATH` to `DRAGON_HEAD`.

### Backpacks (`crafting-backpacks`)

1 level · 2 knowledge

A craftable container you carry. It opens as its own inventory rather than taking a slot per item, and it has two storage modes. Slot mode gives you one ordinary stack per slot and shows everything in one view. Bundle mode uses vanilla bundle weights, where a 64-stackable item costs 1 and an unstackable item costs 64, and pages the view.

You can flip a backpack between modes by crafting it alone in a grid, as long as it is empty. Backpacks cannot be nested, and by default a shulker box or vanilla bundle holding a backpack cannot be put inside one either.

**How to use it**

1. Craft it from leather and a chest.
2. Right-click with it in hand to open it.
3. Craft it alone in a grid to switch storage modes, while it is empty.

Two registered recipes: a shaped craft from `LEATHER` and `CHEST`, and a shapeless single-`BUNDLE` recipe for the mode cycle, which consumes exactly one backpack and returns one.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `slots` | `9` | Backpack capacity. Only container-representable sizes are valid: 9, 18, 27, 36, 45, and 54. Any other value snaps to the nearest valid size, and anything under 9 or over 54 clamps to 9 or 54. In slot mode this is the number of slots and every slot holds one ordinary stack, so 9 slots is 9 stacks. In bundle mode it is how many stacks worth of weight the backpack holds, using vanilla bundle weights where an item that stacks to 64 costs 1, an item that stacks to 16 costs 4, and an unstackable item costs 64. |
| `defaultStorageMode` | `"SLOTS"` | Mode a newly crafted backpack starts in. `SLOTS` gives one ordinary stack per slot in one view. `BUNDLE` gives vanilla bundle weight semantics with a paged view. Any other value falls back to `SLOTS`. |
| `allowModeToggle` | `true` | Lets a player switch a backpack between modes by crafting it alone in a grid. The backpack has to be empty first. |
| `maxStoredBytes` | `262144` | Maximum serialized size in bytes of one backpack's contents. Deposits that would exceed it are refused, and anything already over is handed back to the player rather than dropped. |
| `denyNestedContainers` | `true` | Refuses deposits of a shulker box or vanilla bundle that itself contains an Adapt backpack. A backpack can never go directly inside another backpack regardless of this setting. |

### Portable Tables (`crafting-stations`)

1 level · 2 knowledge

Open a station straight out of your hand instead of placing it. Anvil, crafting table, grindstone, stonecutter, cartography table, and loom all work. Each open costs food, and the item goes on a short cooldown afterwards, so it is convenience rather than a free workshop.

**How to use it**

1. Hold the station block in your main hand.
2. Right-click the air, left-click the air, or left-click a block.

Anything left inside a portable station is lost when it closes. Not enough food and the click just puffs smoke.

Recognized held items and the inventory each opens follow. `CRAFTING_TABLE`
opens `WORKBENCH`. `GRINDSTONE` opens `GRINDSTONE`. `ANVIL` opens `ANVIL`.
`STONECUTTER` opens `STONECUTTER`. `CARTOGRAPHY_TABLE` opens `CARTOGRAPHY`.
`LOOM` opens `LOOM`. Main hand only.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `cooldown` | `125` | Vanilla item cooldown applied to the station item after an open, in server ticks (20 ticks = 1 second). |
| `hungerCost` | `2` | Food points spent per open. The open is refused if your food level is below this. |

### Ore Reconstruction (`crafting-reconstruction`)

1 level · 2 knowledge

Turns drops back into ore blocks. Every recipe is shapeless: eight of the drop plus one host block gives one ore. The host is whatever the ore is normally encased in. Stone is used for overworld ores. Deepslate is used for the deepslate variants. Nether bricks are used for nether gold, nether quartz, and ancient debris.

The in-game lore says scraps, quartz, and emeralds are excluded. That text is out of date. Emerald ore, deepslate emerald ore, nether quartz ore, and ancient debris from netherite scraps all have working recipes.

Nineteen shapeless recipes, each one host block plus eight drops. `STONE` hosts `IRON_INGOT`, `GOLD_INGOT`, `COPPER_INGOT`, `LAPIS_LAZULI`, `REDSTONE`, `EMERALD`, `DIAMOND`, and `COAL` into the matching plain ore. `DEEPSLATE` hosts the same eight into the matching `DEEPSLATE_*` ore. `NETHER_BRICKS` hosts `GOLD_INGOT` into `NETHER_GOLD_ORE`, `QUARTZ` into `NETHER_QUARTZ_ORE`, and `NETHERITE_SCRAP` into `ANCIENT_DEBRIS`.

### Bulk Artisan (`crafting-bulk-artisan`)

5 levels · 4 knowledge, then 3 per level

Shift-clicking a result normally only crafts what is already in the grid. With this, the shift-click reaches into your inventory, pulls out matching ingredients, and crafts a much bigger batch in one action. The batch cap grows with level.

**How to use it**

1. Set up the recipe in a crafting grid.
2. Shift-click the result.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `batchCapBase` | `32` | Bonus items a shift-craft can add at level 1. |
| `batchCapFactor` | `96` | Additional bonus items unlocked across the level range. |
| `xpPerBatchItem` | `0.5` | Skill XP per bonus item produced. |
| `throttleMs` | `250` | Minimum milliseconds between bulk batches for one player. |

### Thrifty Hands (`crafting-thrifty-hands`)

5 levels · 4 knowledge, then 3 per level

Every craft has a chance to hand one ingredient back. It is small at level 1 and climbs toward a cap, and over a long crafting session it adds up to real material saved.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `refundChanceBase` | `0.15` | Chance to refund an ingredient at level 1, 0-1. |
| `refundChanceFactor` | `0.5` | Additional refund chance gained across the level range. |
| `refundChanceMax` | `0.6` | Ceiling on the refund chance. |

### Masterwork (`crafting-masterwork`)

5 levels · 5 knowledge, then 4 per level

Tools and armor you craft can come out better than they should. Every output rolls independently, including each item in a shift-click batch. A successful masterwork adds a randomized fraction of the item's base durability, half to all of the bonus available at your level, so +25-50 percent at full level. `+264 Masterwork` is the top of that roll on an item with 528 base durability, not a fixed bonus.

Each successful masterwork also has a 10-percent chance at one compatible, positive level-one vanilla enchantment, and at full level a separate 15-percent chance at +1 attack damage on a tool or +1 armor on armor. Masterwork never refunds ingredients. That roll belongs to Thrifty Hands.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `rollChanceBase` | `0.2` | Chance a crafted tool or armor piece rolls masterwork at level 1, 0-1. |
| `rollChanceFactor` | `0.55` | Additional roll chance gained across the level range. |
| `rollChanceMax` | `0.75` | Ceiling on the masterwork roll chance. |
| `bonusPercentBase` | `0.1` | Fraction of base durability added by a masterwork roll at level 1. |
| `bonusPercentFactor` | `0.4` | Additional durability fraction gained across the level range. |
| `bonusRollMinimumFraction` | `0.5` | Minimum fraction of the level-scaled maximum durability bonus used by each successful random roll, 0-1. |
| `enchantmentChance` | `0.1` | Chance a successful masterwork also gains one compatible beneficial level-one enchantment, 0-1. |
| `attributeChance` | `0.15` | Chance a full-level masterwork roll also grants an attribute bonus, 0-1. |
| `attackDamageBonus` | `1.0` | Attack damage added by that bonus on a tool. |
| `armorBonus` | `1.0` | Armor added by that bonus on an armor piece. |

### Compactor (`crafting-compactor`)

1 level · 4 knowledge

A one-gesture way to squash loose materials into blocks. Look at a crafting table, sneak, and tap swap hands: every supported material with at least 64 plain units across your inventory gets compacted. Neither hand needs to hold anything.

**How to use it**

1. Stand within 5 blocks of a crafting table and look at it, with no container open.
2. Sneak and press the swap-hands key (F by default).

Activation needs you sneaking, no container open beyond your own inventory, and a `CRAFTING_TABLE` as the exact target block within 5 blocks.

Iron, gold, coal, redstone, copper, lapis lazuli, raw iron, raw gold, raw copper, diamond, emerald, and netherite compact into blocks at 9:1, and glowstone dust into glowstone at 4:1, leaving any remainder in your inventory. A material needs at least 64 plain units across the inventory, and they may be split across slots.

### Tinkerer (`crafting-tinkerer`)

5 levels · 5 knowledge, then 4 per level

Grid-repairing two damaged tools of the same type normally throws away most of the enchantments. Tinkerer merges the highest level of every enchantment from either input into the actual current craft result. There is a chance to keep all of them. When the roll fails you only lose one enchantment at random rather than the lot, and maximum level is always lossless.

Its enchantments compose with earlier craft-result changes such as Masterwork rather than replacing them.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `preserveChanceBase` | `0.4` | Chance to keep every enchantment at level 1, 0-1. When the roll fails, one random enchantment is dropped instead. |
| `preserveChanceFactor` | `0.6` | Additional preservation chance gained across the level range. |

### Provisioner (`crafting-provisioner`)

5 levels · 4 knowledge, then 3 per level

Food multiplies. Crafting food or smelting it in a furnace has a chance to produce bonus portions on top of the normal output. Cooked food looks for a nearby player to credit, so you have to be somewhere near the furnace.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `bonusChanceBase` | `0.25` | Chance of bonus portions at level 1, 0-1. |
| `bonusChanceFactor` | `0.5` | Additional bonus chance gained across the level range. |
| `bonusChanceMax` | `0.75` | Ceiling on the bonus chance. |
| `bonusPortionsBase` | `1` | Bonus portions granted per activation at level 1. |
| `bonusPortionsFactor` | `2` | Additional bonus portions unlocked across the level range. |
| `cookingRadius` | `8.0` | Blocks searched around a furnace for a player to credit. |

### Artisan's Signature (`crafting-signature`)

5 levels · 4 knowledge, then 3 per level

Items you craft get stamped with your name in their lore and a hidden signature. Walk up to a villager while carrying your own signed goods and you get Hero of
the Village for a moment. That effect is what makes the trades cheaper.

**How to use it**

1. Craft something. It is signed automatically.
2. Carry signed goods and right-click a villager before trading.

The effect is skipped if you already have Hero of the Village from any source.

The signature is a persistent-data string holding the crafter's UUID, plus a lore line. The trade bonus is a `HERO_OF_THE_VILLAGE` effect applied on villager interaction.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `amplifierBase` | `0` | Hero of the Village amplifier at level 1. |
| `amplifierFactor` | `1` | Additional amplifier gained across the level range. |
| `amplifierMax` | `1` | Ceiling on the amplifier. |
| `tradeDurationTicks` | `200` | Duration in ticks of the effect applied on villager interaction. |

## Reference

### XP sources

Taking a craft result pays `amount * itemValue * craftingValueXPMultiplier + baseCraftingXP`, gated by `cooldownDelay` per player. It adds to `crafted.items` and `crafted.value`, plus `crafting.tools` for pickaxes, axes, shovels, hoes, and swords, or `crafting.armor` for helmets, chestplates, leggings, and boots.

Smelting pays `furnaceBaseXP + resultValue * furnaceValueXPMultiplier`, granted spatially within `furnaceXPRadius` for `furnaceXPDuration`, and sets no stats. It is gated by `furnaceXpCooldown` per furnace block, keyed by world and coordinates.

### Skill configuration defaults

Written to `plugins/Adapt/skills/crafting.toml` on first load.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `enabled` | `true` | Turns the whole skill on or off. |
| `skillColor` | `"&e"` | Legacy ampersand color code for this skill in menus and text. |
| `furnaceBaseXP` | `30` | Flat XP granted for a furnace smelt, before item value. |
| `furnaceValueXPMultiplier` | `4` | Multiplier applied to the smelted result's value when adding to furnace XP. |
| `furnaceXPRadius` | `32` | Blocks from the furnace within which players receive the XP. |
| `cooldownDelay` | `3000` | Minimum milliseconds between craft XP awards for one player. |
| `furnaceXPDuration` | `10000` | Milliseconds the furnace XP pulse stays claimable by players in range. |
| `furnaceXpCooldown` | `10000` | Milliseconds before the same furnace block can pay out again. |
| `craftingValueXPMultiplier` | `2.0` | Multiplier applied to crafted item value for both XP and the `crafted.value` stat. |
| `baseCraftingXP` | `3.0` | Flat XP added on top of value XP for every paying craft. |
| `challengeCraft1kReward` | `1200` | Base knowledge reward for the Crafting challenge chains. |

### Challenges

| Challenge | Threshold | Reward knob |
|---|---|---|
| `challenge_craft_1k` | 1000 | `challengeCraft1kReward` |
| `challenge_craft_5k` | 5000 | `challengeCraft1kReward` |
| `challenge_craft_50k` | 50000 | `challengeCraft1kReward` |
| `challenge_craft_value_10k` | 10000 | `challengeCraft1kReward` |
| `challenge_craft_value_100k` | 100000 | `challengeCraft1kReward` x2 |
| `challenge_craft_tools_25` | 25 | `challengeCraft1kReward` |
| `challenge_craft_tools_250` | 250 | `challengeCraft1kReward` x2 |
| `challenge_craft_armor_25` | 25 | `challengeCraft1kReward` |
| `challenge_craft_armor_250` | 250 | `challengeCraft1kReward` x2 |

Each adaptation has its own file at `plugins/Adapt/adaptations/<id>.toml`. Alongside the keys listed above it carries `enabled`, `permanent`, `showParticles`, `showSounds`, and its learn costs (`maxLevel`, `initialCost`, `baseCost`, `costFactor`). Every file is generated with a comment on each key and values are clamped on load.

## See also

- [02 - Concepts](/adapt/02-concepts)
- [03 - Player Usage](/adapt/03-player-usage)
- [10 - Skills Catalog](/adapt/10-skills-catalog)
- [04 - Commands & Permissions](/adapt/04-commands-permissions)
- [37 - Recipes, Brewing & Value](/adapt/37-recipes-brewing-value)
