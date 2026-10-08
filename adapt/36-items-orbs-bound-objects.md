---
title: "Items, Orbs & Bound Objects"
description: "Experience orbs, backpacks, bound items, and stored item data"
published: true
date: 2026-10-08T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Adapt stores custom data on ordinary items. Most of these items require the owning adaptation and still check level, permission, world, and protection. Experience and knowledge orbs do not: the player using them receives the stored reward.

## Orbs

Both orbs default to snowballs. Their material, model, and optional head texture are configurable through `items.experience-orb` and `items.knowledge-orb` in [models.toml](/adapt/06-gui-customization#modelstoml-format). `/adapt experience` and `/adapt knowledge` need `adapt.cheatitem`. From console the player argument is required. `all` writes every enabled skill. `random` picks one skill. Any other argument must be a skill id. `master` is not a skill id.

Right-click with an orb in either hand to receive its reward. Successful use consumes one orb, including in Creative mode, and suppresses the base item's placement or projectile action. Existing orbs remain usable after appearance configuration changes; new orbs use the current appearance. Names and lore are editable through [Localization](/adapt/07-localization).

| Orb | Command | Payload |
|---|---|---|
| Experience | `/adapt experience <skill\|all\|random> [amount=10] [player]` | Skill XP |
| Knowledge | `/adapt knowledge <skill\|all\|random> [amount=10] [player]` | Knowledge |

## Bound items

Item data survives drops, chests, and restarts. Trigger, cooldown, range, and recipe rules are on the owning skill page.

| Item | Base | Owning adaptation | Stored data |
|---|---|---|---|
| Backpack | `BUNDLE` | Crafting: Backpacks. Read by Architect: Supply Line | Id, mode, capacity, used amount, serialized contents |
| Bound ender pearl | `ENDER_PEARL` | Rift: Ender Taglock, Rift Access, Rift Pearls | Target block |
| Bound eye of ender | `ENDER_EYE` | Rift: Rift Gate | Bound location |
| Bound redstone torch | `REDSTONE_TORCH` | Architect: Wireless Redstone | Target location and face |
| Bound snowball | `SNOWBALL` | Ranged: Web Bomb | Bound player |
| Chalk wand | `STICK` | Architect: Chalk Line, Chalk Geometry | Tool id, world, up to 32 control points, plane |
| Time bomb | `LINGERING_POTION` | Chronos: Time Bomb. Checked by Instant Recall | Creation timestamp |
| Time bottle | `POTION` | Chronos: Time in a Bottle | Stored seconds |
| Omni Tool | The visible tool | Excavation: Omni Tool | Serialized remaining tools |
| Multi Armor | The visible piece | Blocking: Multi Armor | Serialized remaining pieces |

The bound redstone torch and bound eye of ender use their own cooldown groups.

Omni Tool swaps the visible tool for the block or action in progress. Sneak-drop splits it back into the stored tools. Shift-left-click does not merge tools: that click leaves the cursor empty, so the merge never runs. The same click is cancelled when the tool already holds more components than its slot budget. Destroying the combined item destroys the stored tools.

Multi Armor: left-click an elytra onto a chestplate, or the reverse, to merge. On the ground it is the chestplate. After a fall of more than four blocks it is the elytra. Sneak-drop splits them. Destroying the combined item destroys the stored pieces.

## Backpacks

The recipe is leather in the eight outer cells around a chest. Right-click opens the storage for a player who can use the adaptation.

`SLOTS` is one ordinary stack per slot. `BUNDLE` uses vanilla bundle weights on a paged view: a 64-stackable item costs 1, a 16-stackable costs 4, an unstackable costs 64, against a 64-weight budget per stack. New backpacks use `defaultStorageMode`. Crafting one empty backpack alone cycles the mode when `allowModeToggle` is true. A backpack with contents does not cycle.

A backpack cannot be placed directly inside another backpack. With `denyNestedContainers`, a shulker box or vanilla bundle that contains a backpack is also refused, scanned four levels deep. `maxStoredBytes` refuses a deposit past that size. If the item cannot accept a write-back while its window is open, Adapt returns the recoverable contents to the player.

| Key | Default | What it does |
|---|---|---|
| `slots` | `9` | Capacity in stacks. Snapped to 9, 18, 27, 36, 45, or 54. Slot count in `SLOTS`. Weight budget in stacks in `BUNDLE` |
| `defaultStorageMode` | `SLOTS` | Mode of a newly crafted backpack. Anything unrecognized is `SLOTS` |
| `allowModeToggle` | `true` | Crafting an empty backpack alone cycles its mode |
| `maxStoredBytes` | `262144` | Serialized-contents ceiling in bytes. Values below 4,096 are raised to 4,096 |
| `denyNestedContainers` | `true` | Refuses a shulker or vanilla bundle that contains a backpack, four levels deep |

Recipes: [Recipes, brewing, and value](/adapt/37-recipes-brewing-value).
