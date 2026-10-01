---
title: "Skill - Crafting"
description: "Crafting XP sources, adaptations, recipes, and configuration"
published: true
date: 2026-10-01T09:26:23.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Crafting gains XP from crafted output and nearby furnaces, scaled by material value, and both paths use cooldowns. Its 14 adaptations add recipes, salvage, bulk crafting, portable workstations, a bound compactor, backpacks, material refunds, equipment improvements, and food bonuses, five of which are permanent by default.

## Player controls

Every adaptation has an Enabled control in its level screen. These controls change only your player data; the server controls permitted values, defaults and locks. Personal settings never bypass learned levels, permissions, costs, cooldowns or server limits.

| Adaptation | Additional controls |
|---|---|
| A Boutilier's Backpacks! (`crafting-backpacks`) | `storage`: New backpack storage; `mode-switch`: Allow storage mode switching |
| Artisan's Signature (`crafting-signature`) | `signature-lore`: Visible signature lore |
| Bulk Artisan (`crafting-bulk-artisan`) | `materials`: Allowed material categories; `batch-limit`: Extra batch limit; `ingredient-reserve`: Ingredient reserve |
| Compactor (`crafting-compactor`) | `materials`: Allowed material categories; `batch-limit`: Compaction batch limit; `loose-reserve`: Loose ingredient reserve |
| Deconstruction (`crafting-deconstruction`) | `materials`: Allowed material categories; `confirmation`: Confirm named or enchanted salvage |
| Masterwork (`crafting-masterwork`) | `durability`: Durability bonus; `enchantments`: Enchantment bonus; `attributes`: Attribute bonus |
| Portable Tables! (`crafting-stations`) | `sneak`: Require sneak to open; `workbench`: Crafting table; `grindstone`: Grindstone; `anvil`: Anvil; `stonecutter`: Stonecutter; `cartography`: Cartography table; `loom`: Loom |

Material filters select supported result or ingredient categories; they never enable a new recipe. Batch limits apply only to bonus production. Ingredient reserves keep 0, 8 or 32 matching items; Compactor leaves that loose reserve before compressing. Masterwork opt-outs suppress the selected bonus without another roll. Backpack preferences apply to newly crafted bags; existing bags retain their storage and contents, and mode conversion still requires an empty bag. Disabling Backpacks closes and saves its open container. Confirmations require repeating the same action on the same items within five seconds.

Toggle defaults preserve existing behavior. Size and rate presets default to Full; material, ore and structure filters default to their existing selection. Confirmation, additional gesture restrictions and reserves are off by default. Server policies are configured as `[playerPreferences.<control-id>]` in the adaptation’s TOML file.

## Adaptations

### Deconstruction (`crafting-deconstruction`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/crafting/crafting-deconstruction-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/crafting/crafting-deconstruction-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

1 level · 8 knowledge

Sneak-right-click a pickup-allowed dropped item with shears in the main hand to return 50 percent of the ingredient that occupies the most slots, adjusted for output count, as one or more stacks. Armor must be fully repaired, enchantments and other metadata do not hide the vanilla recipe, empty grid cells do not count, the recipe with the most occupied slots wins, a salvage worth at least as much as the source is rejected, and a denied pickup leaves the item, the shears, XP, and stats unchanged.

### Crafting XP (`crafting-xp`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/crafting/crafting-xp-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/crafting/crafting-xp-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

7 levels · 3 knowledge, then 2 per level

Taking a committed craft whose result fits the player's storage can spawn one vanilla XP orb of `min(maximumXpPerCraft, vanillaXpAtLevelOne + (level - 1) * vanillaXpPerAdditionalLevel)` points, which is 1 through 7 on the defaults. The amount does not scale with crafted stack size.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `vanillaXpAtLevelOne` | `1` | Vanilla XP points granted at adaptation level one. |
| `vanillaXpPerAdditionalLevel` | `1` | XP points added for every level after level one. |
| `maximumXpPerCraft` | `16` | Hard cap on one craft reward. |
| `cooldownMillis` | `30000` | Minimum milliseconds between rewards for one player. |

### Craftable Leather (`crafting-leather`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/crafting/crafting-leather-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/crafting/crafting-leather-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

1 level · 2 knowledge

Right-click a campfire with rotten flesh to cook it into leather (`crafting-leather`: `ROTTEN_FLESH` to `LEATHER`, 100 ticks, 1 vanilla experience). Without the adaptation, that click is cancelled.

### Craftable Skulls (`crafting-skulls`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/crafting/crafting-skulls-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/crafting/crafting-skulls-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

1 level · 2 knowledge

Five shaped recipes place eight of a ring material around one `BONE_BLOCK`: `crafting-skeletonskull` maps `BONE` to `SKELETON_SKULL`, `crafting-witherskeletonskull` maps `NETHER_BRICK` to `WITHER_SKELETON_SKULL`, `crafting-zombieskull` maps `ROTTEN_FLESH` to `ZOMBIE_HEAD`, `crafting-creeperhead` maps `GUNPOWDER` to `CREEPER_HEAD`, and `crafting-dragonhead` maps `DRAGON_BREATH` to `DRAGON_HEAD`.

### Backpacks (`crafting-backpacks`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/crafting/crafting-backpacks-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/crafting/crafting-backpacks-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

1 level · 2 knowledge

Right-click a backpack crafted from `LEATHER` and `CHEST` to open its inventory. A shapeless single-`BUNDLE` recipe consumes exactly one backpack and returns one, cycling storage mode.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `slots` | `9` | Backpack capacity. Only container-representable sizes are valid: 9, 18, 27, 36, 45, and 54. Any other value snaps to the nearest valid size, and anything under 9 or over 54 clamps to 9 or 54. In slot mode this is the number of slots and every slot holds one ordinary stack, so 9 slots is 9 stacks. In bundle mode it is how many stacks worth of weight the backpack holds, using vanilla bundle weights where an item that stacks to 64 costs 1, an item that stacks to 16 costs 4, and an unstackable item costs 64. |
| `defaultStorageMode` | `"SLOTS"` | Mode a newly crafted backpack starts in. `SLOTS` gives one ordinary stack per slot in one view. `BUNDLE` gives vanilla bundle weight semantics with a paged view. Any other value falls back to `SLOTS`. |
| `allowModeToggle` | `true` | Lets a player switch a backpack between modes by crafting it alone in a grid. The backpack has to be empty first. |
| `maxStoredBytes` | `262144` | Maximum serialized size in bytes of one backpack's contents. Deposits that would exceed it are refused, and anything already over is handed back to the player rather than dropped. |
| `denyNestedContainers` | `true` | Refuses deposits of a shulker box or vanilla bundle that itself contains an Adapt backpack. A backpack can never go directly inside another backpack regardless of this setting. |

### Portable Tables (`crafting-stations`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/crafting/crafting-stations-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/crafting/crafting-stations-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

1 level · 2 knowledge

Right-click air, left-click air, or left-click a block with the station in the main hand to open it: `CRAFTING_TABLE` opens `WORKBENCH`, `GRINDSTONE` opens `GRINDSTONE`, `ANVIL` opens `ANVIL`, `STONECUTTER` opens `STONECUTTER`, `CARTOGRAPHY_TABLE` opens `CARTOGRAPHY`, and `LOOM` opens `LOOM`. Items left inside are lost when it closes.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `cooldown` | `125` | Vanilla item cooldown applied to the station item after an open, in server ticks (20 ticks = 1 second). |
| `hungerCost` | `2` | Food points spent per open. The open is refused if your food level is below this. |

### Ore Reconstruction (`crafting-reconstruction`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/crafting/crafting-reconstruction-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/crafting/crafting-reconstruction-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

1 level · 2 knowledge

Nineteen shapeless recipes turn eight drops plus one host into one ore: `STONE` hosts `IRON_INGOT`, `GOLD_INGOT`, `COPPER_INGOT`, `LAPIS_LAZULI`, `REDSTONE`, `EMERALD`, `DIAMOND`, and `COAL` into the matching ore, `DEEPSLATE` hosts those eight into the matching `DEEPSLATE_*` ore, and `NETHER_BRICKS` hosts `GOLD_INGOT` into `NETHER_GOLD_ORE`, `QUARTZ` into `NETHER_QUARTZ_ORE`, and `NETHERITE_SCRAP` into `ANCIENT_DEBRIS`. In-game lore still says scraps, quartz, and emeralds are excluded; emerald ore, deepslate emerald ore, nether quartz ore, and ancient debris have working recipes.

### Bulk Artisan (`crafting-bulk-artisan`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/crafting/crafting-bulk-artisan-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/crafting/crafting-bulk-artisan-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge, then 3 per level

Shift-clicking a crafting result pulls matching ingredients from the inventory and crafts extra items up to the batch cap.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `batchCapBase` | `32` | Bonus items a shift-craft can add at level 1. |
| `batchCapFactor` | `96` | Additional bonus items unlocked across the level range. |
| `xpPerBatchItem` | `0.5` | Skill XP per bonus item produced. |
| `throttleMs` | `250` | Minimum milliseconds between bulk batches for one player. |

### Thrifty Hands (`crafting-thrifty-hands`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/crafting/crafting-thrifty-hands-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/crafting/crafting-thrifty-hands-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge, then 3 per level

Each craft can return one ingredient.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `refundChanceBase` | `0.15` | Chance to refund an ingredient at level 1, 0-1. |
| `refundChanceFactor` | `0.5` | Additional refund chance gained across the level range. |
| `refundChanceMax` | `0.6` | Ceiling on the refund chance. |

### Masterwork (`crafting-masterwork`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/crafting/crafting-masterwork-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/crafting/crafting-masterwork-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 5 knowledge, then 4 per level

Each crafted tool or armor output rolls independently, including every item in a shift-click batch, and a success adds a random fraction of base durability shown as `+N Masterwork`; on 528 base durability the top of that roll is `+264 Masterwork`, not a fixed bonus. Masterwork does not refund ingredients.

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

<div class="adapt-demo">
<video src="/adapt-assets/demos/crafting/crafting-compactor-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/crafting/crafting-compactor-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

1 level · 4 knowledge

Sneak and press swap-hands while looking at a `CRAFTING_TABLE` within 5 blocks, with no container open, to compact every supported material that totals at least 64 plain units anywhere in the inventory, including stacks split across slots. Iron, gold, coal, redstone, copper, lapis lazuli, raw iron, raw gold, raw copper, diamond, emerald, and netherite compact at 9:1, and glowstone dust at 4:1, leaving the remainder; neither hand has to hold an item.

### Tinkerer (`crafting-tinkerer`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/crafting/crafting-tinkerer-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/crafting/crafting-tinkerer-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 5 knowledge, then 4 per level

Combining two damaged tools of the same type writes the higher level of each enchantment from either input onto the current craft result, keeps a maximum-level enchantment even when the preserve roll fails, and composes with earlier result changes such as Masterwork instead of replacing them.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `preserveChanceBase` | `0.4` | Chance to keep every enchantment at level 1, 0-1. When the roll fails, one random enchantment is dropped instead. |
| `preserveChanceFactor` | `0.6` | Additional preservation chance gained across the level range. |

### Provisioner (`crafting-provisioner`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/crafting/crafting-provisioner-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/crafting/crafting-provisioner-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge, then 3 per level

Crafting food, or smelting food, can add extra portions to the normal output.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `bonusChanceBase` | `0.25` | Chance of bonus portions at level 1, 0-1. |
| `bonusChanceFactor` | `0.5` | Additional bonus chance gained across the level range. |
| `bonusChanceMax` | `0.75` | Ceiling on the bonus chance. |
| `bonusPortionsBase` | `1` | Bonus portions granted per activation at level 1. |
| `bonusPortionsFactor` | `2` | Additional bonus portions unlocked across the level range. |
| `cookingRadius` | `8.0` | Blocks searched around a furnace for a player to credit. |

### Artisan's Signature (`crafting-signature`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/crafting/crafting-signature-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/crafting/crafting-signature-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge, then 3 per level

Crafted items gain a lore line and a persistent-data crafter UUID. Interacting with a villager while carrying that player's signed items applies `HERO_OF_THE_VILLAGE` unless that effect is already present.

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

## See also

Catalog: [Skills](/adapt/10-skills-catalog). Rules: [Concepts](/adapt/02-concepts).
