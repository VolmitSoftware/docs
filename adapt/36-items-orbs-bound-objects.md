---
title: "Items, Orbs & Bound Objects"
description: "Experience orbs, backpacks, bound items, and stored item data"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Adapt stores custom data on ordinary Minecraft items. That data may contain a target, owner, plan, or serialized inventory.

Most items require their owning adaptation and still check level, permission, world, and protection rules. Experience and knowledge orbs are the exception: they apply their stored reward to the player who throws them.

## Experience and knowledge orbs

Both orbs are snowballs with a skill-to-amount map written on them. If you throw one, the thrower gets everything in that map at once. An orb made for another player still works in your own hand.

How to use them:

1. Run `/adapt experience <skill|all|random> [amount] [player]` or `/adapt knowledge <skill|all|random> [amount] [player]`. Both need `adapt.cheatitem`.
2. The orb goes to the target player, or to you if you left the player argument off. From console the player argument is required.
3. Throw it. Experience orbs award XP to each listed skill line. Knowledge orbs award knowledge points.

`all` writes one entry per registered enabled skill onto a single orb. `random` picks one skill. Anything else has to be a real skill id. `master` is not one. Master level is derived from skill XP. It is not a skill of its own.

## Items that belong to an adaptation

These items keep their data in the persistent data container, so it survives drops, chests, and restarts. Most use a hidden Curse of Binding for the enchantment glint. The bound redstone torch and bound eye of ender use separate cooldown groups, leaving ordinary versions unaffected.

Binding, crafting, cooldowns, range, and protection rules live with the owning
adaptation. See [12 - Skill - Architect](/adapt/12-skill-architect),
[14 - Skill - Blocking](/adapt/14-skill-blocking), and
[16 - Skill - Chronos](/adapt/16-skill-chronos). Also see
[17 - Skill - Crafting](/adapt/17-skill-crafting),
[20 - Skill - Excavation](/adapt/20-skill-excavation),
[26 - Skill - Ranged](/adapt/26-skill-ranged), and
[27 - Skill - Rift](/adapt/27-skill-rift).

## Omni Tool and Multi Armor

Both work the same way. One visible item carries the others serialized inside it. Switching rotates a stored item into the visible slot. If you destroy the combined item, everything inside goes with it.

Omni Tool:

1. Learn Excavation's Omni Tool.
2. Shift-left-click one tool onto another in your inventory to merge them.
3. Use it normally. It rotates a suitable tool into hand for the block or action you are doing.
4. Sneak and drop it to split it back into separate tools.

Multi Armor:

1. Learn Blocking's Multi Armor.
2. Left-click an elytra onto a chestplate, or the reverse, to merge them.
3. It swaps itself as you move. It becomes the chestplate once you are on the ground. It becomes the elytra once you have fallen more than four blocks.
4. Sneak and drop it to split it back apart.

## Backpacks

Crafting's Backpacks adaptation registers a shaped recipe of leather in all eight outer cells around a chest. The result is a bundle-skinned item. It opens its own storage window on right-click for a player who can use the adaptation.

A backpack stays in one of two modes unless you cycle it. `SLOTS` is a plain container where every slot holds one ordinary stack. `BUNDLE` uses vanilla bundle weights with a paged view. A 64-stackable item costs one weight unit. A 16-stackable costs four. An unstackable costs 64. New backpacks start in whatever `defaultStorageMode` says. To change it, craft an empty backpack alone in a grid. A shapeless recipe hands the same backpack back with its mode cycled. A backpack with anything in it will not cycle. `allowModeToggle` turns the whole thing off.

Deposits have three guards. A backpack can never go directly inside another backpack. With `denyNestedContainers` on, a shulker box or vanilla bundle holding a backpack is refused too. The scan is four levels deep. And `maxStoredBytes` refuses any deposit that would push the serialized contents past the ceiling. If the backing item disappears or cannot take a write-back while its window is
open, Adapt hands the recoverable contents back. It does not drop them.

## Data that is not an item

Some persistent Adapt data looks item-shaped but is never held by a player. `ScaffoldMatter` in `content/block` stores temporary scaffold data. `BrewingStandOwner` with `BrewingStandOwnerMatter` in `content/matter` record brewing-stand ownership for the custom brewing workflow. None are giveable items.

## Reference

### Orbs

| Implementation | Base material | Command | Permission | Payload |
|---|---|---|---|---|
| `ExperienceOrb` | `SNOWBALL` | `/adapt experience <skill\|all\|random> [amount=10] [player]` | `adapt.cheatitem` | Skill to XP map, applied to the thrower |
| `KnowledgeOrb` | `SNOWBALL` | `/adapt knowledge <skill\|all\|random> [amount=10] [player]` | `adapt.cheatitem` | Skill to knowledge map, applied to the thrower |

Both apply on projectile launch, to the player who threw the orb, with no adaptation or learning requirement.

### Adaptation-owned items

| Implementation | Base material | Owning adaptations | Stored data |
|---|---|---|---|
| `BackpackItem` | `BUNDLE` | Crafting: Backpacks. Read by Architect: Supply Line. | Backpack id, mode, capacity, used amount, plus the serialized contents under a separate key |
| `BoundEnderPearl` | `ENDER_PEARL` | Rift: Ender Taglock, Rift Access, Rift Pearls | Target block |
| `BoundEyeOfEnder` | `ENDER_EYE` | Rift: Rift Gate | Bound location |
| `BoundRedstoneTorch` | `REDSTONE_TORCH` | Architect: Wireless Redstone | Target location and block face |
| `BoundSnowBall` | `SNOWBALL` | Ranged: Web Bomb | Bound player |
| `ChalkWandItem` | `STICK` | Architect: Chalk Line, Chalk Geometry | Tool id, world, up to 32 control points, plane |
| `ChronoTimeBombItem` | `LINGERING_POTION` | Chronos: Time Bomb. Checked by Chronos: Instant Recall. | Creation timestamp. Legacy `CLOCK` bombs are still recognized. |
| `ChronoTimeBottle` | `POTION` | Chronos: Time in a Bottle | Stored seconds |
| `OmniTool` | The visible tool | Excavation: Omni Tool | Serialized remaining tools |
| `MultiArmor` | The visible piece | Blocking: Multi Armor | Serialized remaining pieces |

`BoundRedstoneTorch` and `BoundEyeOfEnder` declare item cooldown groups. `OmniTool` and `MultiArmor` both implement the shared `MultiItem` container.

### Backpack config (`CraftingBackpacks`)

| Key | Default | What it does |
|---|---|---|
| `slots` | `9` | Capacity in stacks. Snapped to 9, 18, 27, 36, 45, or 54, and clamped into that range. In `SLOTS` mode it is the slot count. In `BUNDLE` mode it is the weight budget in stacks. |
| `defaultStorageMode` | `SLOTS` | Mode a newly crafted backpack starts in. Anything unrecognized falls back to `SLOTS`. |
| `allowModeToggle` | `true` | Allows cycling an empty backpack's mode by crafting it alone |
| `maxStoredBytes` | `262144` | Serialized-contents ceiling per backpack, in bytes. Raised to 4,096 if configured lower. |
| `denyNestedContainers` | `true` | Refuses depositing a shulker box or vanilla bundle that itself contains a backpack, scanned 4 levels deep |

Bundle weight units use a 64-weight budget per stack. A 64-stackable item costs
1 per item. A 16-stackable item costs 4. An unstackable item costs 64.

## See also

- [03 - Player Usage](/adapt/03-player-usage)
- [04 - Commands & Permissions](/adapt/04-commands-permissions)
- [37 - Recipes, Brewing & Value](/adapt/37-recipes-brewing-value)
