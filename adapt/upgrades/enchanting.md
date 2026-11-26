---
title: "Upgrades - Enchanting"
description: "Enchanting upgraded adaptations for mutated skills"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These upgrades are available only after you mutate Enchanting (see [Mutations](/adapt/35-mutations)), and they replace the original adaptations of [Enchanting](/adapt/19-skill-enchanting).

## Upgrades

### Arcane Hand (`upgraded-enchanting-arcane-hand`)

3 levels · 13, 13 and 16 knowledge · Fuses Quick-Click Enchant, Infusion Transfer and Tome Rebinding

Everything happens in your inventory, with no anvil.

Left-click an enchanted book onto a single item to apply it. Each enchantment on the book that the item can take, does not already have and does not conflict with is added at the book's level; the rest stay on the book, and an emptied book is used up. The apply is refused when the item would end with more than 9 total enchantment levels at level 1, 12 at level 2 or 15 at level 3. Applying costs no experience levels.

Right-click an enchanted item onto another single item to move one enchantment: the source's highest-level enchantment that the target lacks, can take and holds nothing conflicting with, so Sharpness never joins Smite and Mending never joins Infinity. It moves at its level, up to that enchantment's maximum, and leaves the source. The move is refused, at no cost, when the target would end above the same total enchantment level limit as applying a book. A move costs 3 experience levels at level 1, 2 at level 2 and 1 at level 3.

Drop an enchanted book holding two or more enchantments while sneaking to split it into one book per enchantment, with nothing lost. A split costs 2 experience levels at level 1 and 1 at levels 2 and 3. Without enough levels the book drops whole.

Take a result from a grindstone to pull one enchantment of the ground item onto a book: 40% of the time at level 1, 60% at level 2 and 80% at level 3. It takes the item's highest-level enchantment that is not a curse, at up to that enchantment's maximum. A pull uses one plain book from your inventory and 3 experience levels at level 1, 2 at level 2 and 1 at level 3, both taken only when the book is made; without them the grind goes ahead with no book. After a book the grindstone rests for 5 seconds. An enchantment that came from such a book, applied by hand or moved onward, is never pulled again. While Arcane Hand runs for you, Grindstone Recovery makes no book, so one grind gives at most one.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `powerLimitBase` | `6` | Total enchantment levels an item may hold after a book is applied or an enchantment is moved, before the level is added. |
| `powerLimitPerLevel` | `3` | Enchantment level limit added per upgrade level. |
| `moveCostBase` | `4` | Experience levels a move costs before the level reduction. |
| `splitCostBase` | `3` | Experience levels a split costs before the level reduction. |
| `costReductionPerLevel` | `1` | Experience levels removed from both costs per upgrade level. |
| `minimumLevelCost` | `1` | Lowest experience level cost of a move, split or grindstone book; 0 makes them free at the top level. |
| `libraryChanceBase` | `0.2` | Chance a grind pulls one enchantment onto a book, before the level is added. |
| `libraryChancePerLevel` | `0.2` | Grindstone book chance added per level. |
| `libraryCostBase` | `4` | Experience levels a grindstone book costs before the level reduction. |
| `libraryCooldownTicks` | `100` | Grindstone rest after a book, in ticks. |

### Fate Weaver (`upgraded-enchanting-fate-weaver`)

3 levels · 13, 13 and 16 knowledge · Fuses Offer Reroll, Rune Sight and Bookshelf Attunement

Every enchanting table offer you see is raised as if extra bookshelves stood around the table: 9 power at level 1, 12 at level 2 and 15 at level 3. Each offer's level cost rises by that power, up to 30, and its enchantment rises by a third of that power (3, 4 or 5 levels), up to the enchantment's maximum. All offers, with their enchantment, level and cost, show on your action bar.

Sneak and right-click an enchanting table, or right-click while sneaking and looking at one within 5 blocks, to reroll its offers. A reroll costs 1 experience level and lapis lazuli from your inventory: 2 at level 1 and 1 at levels 2 and 3. You then wait 7.5 seconds at level 1, 5 at level 2 and 2.5 at level 3 before your next reroll. The new offers get the same raise.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `shelfPowerBase` | `6` | Bookshelf power before the level is added. |
| `shelfPowerPerLevel` | `3` | Bookshelf power added per level. |
| `lapisCostBase` | `3` | Lapis a reroll costs before the level reduction. |
| `lapisCostReductionPerLevel` | `1` | Lapis removed from the reroll cost per level; the cost never drops below 1. |
| `xpLevelCost` | `1` | Experience levels a reroll costs. |
| `cooldownTicksBase` | `200` | Time between rerolls before the level reduction, in ticks. |
| `cooldownTicksReductionPerLevel` | `50` | Cooldown ticks removed per level; the cooldown never drops below 20. |
| `revealThrottleMillis` | `400` | Shortest time between two offer readouts, in milliseconds. |

### Soulforged (`upgraded-enchanting-soulforged`)

3 levels · 13, 13 and 16 knowledge · Fuses Soul Link, Echo of Knowledge and Curse Cleansing

Sneak and right-click an anvil with an enchanted item or enchanted book in your main hand to link it. You have one linked item at a time, and linking another replaces it. After a link you wait 22 seconds at level 1, 14 at level 2 and 6 at level 3 before linking again. Linking removes Curse of Binding and Curse of Vanishing from the item.

When you die without keep inventory, checked after every other plugin has had its say, the linked item stays out of your drops and comes back when you respawn, or when you next join. Keeping it costs 4 experience levels at level 1, 2 at level 2 and 1 at level 3, taken from the experience you drop, or from your kept levels when the world keeps levels on death. With fewer levels than that, the item drops as usual.

Vanilla experience you collect charges the linked item while it is anywhere in your inventory: 3 charge per experience point at level 1, 4 at level 2 and 5 at level 3. Every 120 charge raises the item's first enchantment that is below its maximum by one level. Charging also removes any Curse of Binding or Curse of Vanishing.

Ascension: once charging has raised an enchantment of the linked item to its vanilla maximum, sneak and left-click an enchanting table with that item in your main hand to take it one level further, such as Sharpness VI or Protection V. It costs 30 experience levels at level 1, 25 at level 2 and 20 at level 3. One item holds 1 ascended enchantment at levels 1 and 2 and 2 at level 3, and the item lists each one. Sharpness, Smite, Bane of Arthropods, Efficiency, Unbreaking, Fortune, Looting, Power, Protection, Fire Protection, Blast Protection, Projectile Protection and Feather Falling can ascend; enchantments with a single level, such as Mending, Infinity and Silk Touch, never do. The extra level holds only while the item is with a player whose Soulforged level allows as many ascended enchantments as the item has: anyone else, any dropped copy and any copy left in a container when it closes gets the item at the vanilla maximum, and it rises again in a qualifying player's inventory within a second. A grindstone clears the ascension for good, and an anvil never copies an ascended level onto other gear.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `saveCostBase` | `6` | Experience levels it costs to keep the linked item through a death, before the level reduction. |
| `saveCostReductionPerLevel` | `2` | Experience levels removed from the save cost per level. |
| `minimumSaveCost` | `1` | Lowest save cost in experience levels; 0 makes the top level free. |
| `chargeRateBase` | `2` | Charge gained per vanilla experience point before the level is added. |
| `chargeRatePerLevel` | `1` | Charge rate added per level. |
| `chargeThreshold` | `120` | Charge needed to raise one enchantment a level. |
| `relinkCooldownMillisBase` | `30000` | Time before another item can be linked, before the level reduction, in milliseconds. |
| `relinkCooldownMillisReductionPerLevel` | `8000` | Relink wait removed per level, in milliseconds. |
| `minimumRelinkCooldownMillis` | `5000` | Shortest relink wait, in milliseconds. |
| `ascension` | `true` | Whether linked gear can ascend; false puts every ascended item at its vanilla maximum. |
| `ascendable` | Sharpness to Feather Falling, as listed above | Enchantment ids that may ascend. |
| `ascensionsBase` | `0.5` | Ascended enchantments one item may hold before the level is added, rounded down. |
| `ascensionsPerLevel` | `0.5` | Ascended enchantments added per level. |
| `ascensionCostBase` | `35` | Experience levels one ascension costs before the level reduction. |
| `ascensionCostReductionPerLevel` | `5` | Experience levels removed from the ascension cost per level. |
| `settleIntervalMillis` | `1000` | How often each online player's ascended gear is raised or lowered, in milliseconds. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Enchanting](/adapt/19-skill-enchanting).
