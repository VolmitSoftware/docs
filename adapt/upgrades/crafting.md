---
title: "Upgrades - Crafting"
description: "Crafting upgraded adaptations for mutated skills"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These upgrades are available only after you mutate Crafting (see [Mutations](/adapt/35-mutations)), and they replace the original adaptations of [Crafting](/adapt/17-skill-crafting).

## Upgrades

Grand Artisan and Field Workshop work through the originals they fuse, and Unmaker does for two of its three. While you hold the upgrade, each of those originals works for you at its own top level when the upgrade is at level 3, one level lower for each upgrade level below 3, and never below level 1. The originals keep their own personal controls and config keys, and any recipe a fused original unlocks stays available to you.

### Grand Artisan (`upgraded-crafting-grand-artisan`)

3 levels · 13, 13 and 16 knowledge · Fuses Masterwork, Tinkerer and Thrifty Hands

While you hold Grand Artisan, Masterwork, Tinkerer and Thrifty Hands work for you at level 3 at upgrade level 1, level 4 at upgrade level 2 and level 5 at upgrade level 3.

[Masterwork](/adapt/17-skill-crafting#masterwork-crafting-masterwork) gives crafted tools and armor a chance at bonus durability, and sometimes an enchantment or an attribute bonus. Grand Artisan raises Masterwork's roll chance, durability bonus, enchantment chance and attribute chance by 25% at level 1, 40% at level 2 and 55% at level 3; each chance still stops at 100%. [Tinkerer](/adapt/17-skill-crafting#tinkerer-crafting-tinkerer) keeps the best enchantments of both inputs when you combine two damaged tools of the same type. [Thrifty Hands](/adapt/17-skill-crafting#thrifty-hands-crafting-thrifty-hands) can return one ingredient from a recipe that uses at least three different materials.

Grand Artisan also reforges gear at a smithing table. Put a tool, weapon or armor piece in the base slot and one of its own base material in the addition slot, with the template slot empty: planks for wooden gear, cobblestone, cobbled deepslate or blackstone for stone, iron ingots for iron and chainmail, gold ingots, diamonds, netherite ingots, leather, copper ingots, or a scute for a turtle shell. The result shows 1, 2 or 3 reforged rolls at levels 1, 2 and 3 and the cost. Click the result to take the first roll, or press the number key of another. A reforge costs the material and 5, 4 or 3 experience levels. It rerolls the Masterwork bonus durability and, where Masterwork runs at its top level, the Masterwork Edge attribute, with Masterwork's own bonus pool and caps. Plain gear, such as pieces crafted before the mutation, gains a Masterwork bonus this way once and cannot be reforged again. A reforge never adds or removes enchantments, and the durability left on the piece stays the same. A piece always offers the same rolls until it is reforged, so taking it out and putting it back does not reroll it. From level 3 the Reforge lock control keeps the bonus durability or the Masterwork Edge and rerolls only the other.

Personal controls: enable switch; `reforge-lock` keeps nothing, the durability bonus or the Masterwork Edge (from level 3).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `masterworkBonusBase` | `0.10` | Share added to Masterwork's roll chance, durability bonus and enchantment and attribute chances, before the level is added. |
| `masterworkBonusPerLevel` | `0.15` | Share added to that boost per level. |
| `reforgeChoicesBase` | `1` | Reforge rolls offered to pick from at level 1. |
| `reforgeChoicesPerLevel` | `1` | Reforge rolls added per level after the first. |
| `reforgeLevelsBase` | `5` | Experience levels a reforge costs at level 1. |
| `reforgeLevelsPerLevel` | `1` | Experience levels removed from the reforge cost per level after the first. |
| `lockLevel` | `3` | Upgrade level from which a reforge can keep the durability bonus or the Masterwork Edge. |

### Unmaker (`upgraded-crafting-unmaker`)

3 levels · 13, 13 and 16 knowledge · Fuses Deconstruction, Ore Reconstruction and Compactor

While you hold Unmaker, [Deconstruction](/adapt/17-skill-crafting#deconstruction-crafting-deconstruction) and [Ore Reconstruction](/adapt/17-skill-crafting#ore-reconstruction-crafting-reconstruction) work for you at all three upgrade levels. Deconstruction salvages half of a dropped item's main ingredient when you sneak-right-click it with shears. Ore Reconstruction's recipes turn eight drops and a host block back into an ore.

Unmaker compacts on its own, anywhere, with no crafting table nearby. Sneak and press the swap-hands key with no container open to turn every supported material you carry in amounts of 64 or more into blocks, leaving the remainder: iron, gold, copper and netherite ingots, raw iron, raw gold and raw copper, coal, redstone, lapis lazuli, diamonds and emeralds at 9 to 1, and glowstone dust at 4 to 1. Sneak and swap hands only takes over the key when something compacts; with nothing to compact, your hands swap as usual. Compacting has a cooldown of 3, 2 or 1 seconds at levels 1, 2 and 3 and pays no skill XP.

Personal controls: enable switch; `materials` limits compacting to all, minerals, blocks, equipment or food categories; `batch-limit` compacts the full, half or a quarter of the eligible amount; `loose-reserve` keeps 0, 8 or 32 loose items of each material.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `cooldownMillisBase` | `4000` | Time between compactions before level scaling, in milliseconds. |
| `cooldownMillisPerLevel` | `1000` | Cooldown removed per level, in milliseconds. |

### Field Workshop (`upgraded-crafting-field-workshop`)

3 levels · 15, 14 and 18 knowledge · Fuses Portable Tables, A Boutilier's Backpacks and Bulk Artisan

While you hold Field Workshop, Portable Tables and A Boutilier's Backpacks work for you at all three upgrade levels, and Bulk Artisan works at level 3 at upgrade level 1, level 4 at upgrade level 2 and level 5 at upgrade level 3.

[Portable Tables](/adapt/17-skill-crafting#portable-tables-crafting-stations) opens a crafting table, grindstone, anvil, stonecutter, cartography table or loom held in your main hand. [A Boutilier's Backpacks](/adapt/17-skill-crafting#a-boutiliers-backpacks-crafting-backpacks) unlocks the backpack recipe and lets you open backpacks. [Bulk Artisan](/adapt/17-skill-crafting#bulk-artisan-crafting-bulk-artisan) crafts extra items from your inventory when you shift-click a craft, up to a batch cap that grows with level.

Field Workshop also hands out the Artisan's Ledger, crafted from a book, a leather and a crafting table. Without Field Workshop it is an inert written book. Right-click it to open its pages: 4, 8 or 12 at levels 1, 2 and 3.

- Store: carry a crafted item on the cursor and click an empty page. The page keeps the item's recipes; the item stays on the cursor. Carry a crafting table, grindstone, anvil, stonecutter, cartography table or loom instead to keep a station page.
- Craft: click a recipe page to craft it once straight from your inventory and the backpacks in it, with no table. Sneak-click to craft as many as the materials allow, up to a stack plus Bulk Artisan's batch. The page lists what is missing. Parts that another page holds are crafted on the way, 1, 2 or 3 steps deep at levels 1, 2 and 3, so planks become sticks and then a pickaxe.
- Station: click a station page to open that station while you carry one in your inventory or a backpack. Each open costs 1 food and is refused when your food is lower, and the same station cannot be opened again for 3 seconds.
- Clear: right-click a page.

The Ledger runs only shaped and shapeless recipes with a plain result that you could craft at a table: recipes Adapt gates behind an adaptation still need it, and recipes for mutation tools never run. Named, enchanted or otherwise changed items are never used as ingredients. Buckets and bottles come back as they do at a table. Thrifty Hands' refund chance applies to each craft when you hold Grand Artisan, Bulk Artisan sets the batch, and Ledger crafts pay no skill XP. Smithing and stonecutter recipes cannot be stored yet; keep a stonecutter page instead. Backpacks need a server version with bundles; without them the Ledger uses your inventory only.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `cooldownTicks` | `60` | Ticks before the same workstation can be opened from a Ledger page again. |
| `hungerCost` | `1` | Food points taken each time a workstation opens from a Ledger page; 0 makes it free. |
| `pagesBase` | `4` | Ledger pages at level 1. |
| `pagesPerLevel` | `4` | Ledger pages added per level after the first. |
| `chainDepthBase` | `1` | Steps of stored parts a Ledger craft makes on the way at level 1. |
| `chainDepthPerLevel` | `1` | Chain steps added per level after the first. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Crafting](/adapt/17-skill-crafting).
