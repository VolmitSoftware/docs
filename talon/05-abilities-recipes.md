---
title: "Talon: Abilities and recipes"
description: "Ability levels, crafting ingredients, and mining limits"
published: true
date: 2026-10-25T07:15:44.815Z
tags: "talon, abilities, recipes"
editor: markdown
dateCreated: 2026-10-15T00:00:00.000Z
---

Each ability has three levels. `/talon books` shows tool compatibility and each recipe; `/talon recipe <ability> [level]` also lists ingredients in chat.

## Abilities

| Ability | Level I | Level II | Level III |
|---|---|---|---|
| Multi Tool | Switch between pickaxe and shovel | Also switch to axe | Also switch to hoe |
| Remote Loot | Container range up to 16 blocks | Up to 32 blocks | Up to 64 blocks |
| Blast | 3 by 3 face, one block deep | Two blocks deep | Three blocks deep |
| Vein Miner | Connected ore, up to 16 extra blocks | Up to 32 extra blocks | Up to 64 extra blocks |
| Excavation | Same-material blocks within radius 1 | Radius 2 | Radius 3 |

Mining limits also apply to the selected ability. Vein Miner follows face-connected ore; Excavation can reach disconnected blocks of the same material inside its cube. Multi Tool preserves the tool's material tier. Server block tags decide which tool type fits the block.

Only one of Blast, Vein Miner, and Excavation runs at a time. `/talon mode` cycles through the abilities present on the held tool and single-block mode. Extra breaks use the server's normal player-break path for drops, durability, and protection events.

## Personal activation

`/talon activation <mode>` saves when your abilities should activate: `server` follows the server default, `sneak` requires sneaking, `stand` requires not sneaking, `always` adds no personal restriction, and `off` pauses abilities. Every mode still follows server restrictions. `sneak` cannot be selected while the server's `sneakToDisable` setting is enabled; an already saved sneak-only choice remains inactive if that setting is enabled later.

Preferences are stored in `data/players/<uuid>.json`. Abilities wait until your preference loads. A failed load leaves them inactive until a successful reconnect. Changes apply immediately; a failed save is reported and retried on a later save, quit, or shutdown.

Rejected activation choices report the reason and retain the previous choice. 

## Optional mining patterns

When enabled in `abilities.toml`, Blast also supports `tunnel`, `staircase_up`, and `staircase_down`. Select one with `/talon pattern <mode>` or cycle with `/talon mode`. The tool needs Blast and the corresponding pattern permission.

Patterns follow the player's horizontal facing direction. Tunnels are one block wide and two blocks high. Staircases are one block wide with three blocks of headroom and rise or descend one block per step. Blast levels I, II, and III select depths of 3, 6, and 9 blocks before normal mining limits apply. The original target marks the foot level; patterns remove blocks and do not place stairs or supports.

## Tool appearance

Applying an ability preserves the tool's existing glint. Run `/talon glint true` with the tool held to enable ability glint, or `/talon glint false` to restore its original glint setting. This per-tool choice does not add or remove enchantments.

Talon refreshes its matching ability-lore block when tool settings or workstation results change. Other lore lines and manually edited blocks stay intact.

## Repairing and upgrading tools

Anvil renaming and material repairs, smithing upgrades, grindstones, and two-tool crafting repairs preserve Talon abilities, identity, settings, and the saved Remote Loot link. The vanilla result controls the name, damage, and ordinary enchantments; a grindstone still removes ordinary enchantments.

Combining two tools keeps every compatible ability at the higher existing level. It does not promote equal levels. The result keeps the left Talon tool's identity, settings, and link, or the right tool's when only that input has Talon abilities.

Talon rejects results with incompatible abilities or materials and results containing more than one tool. Ability books cannot be consumed by vanilla workstations; apply them by dragging the book onto a compatible tool. Other crafting recipes and automated crafters cannot consume Talon tools. Result claims are checked again for normal clicks, shift-clicks, and hotbar swaps.

Custom ability data survives these operations even when its provider is absent. Its stored allowed materials still restrict which results are valid.

## Recipes

By default, all fifteen recipes use this shape in a crafting table. Servers can edit or disable individual recipes in `abilities.toml`. Recipe displays and crafting checks use the same registered ingredients. On region-threaded servers, ingredient changes wait for a server restart and the menu shows a notice; recipe enable switches and permissions still apply immediately.

```none
C A C
A B A
C A C
```

| Ingredient | Level I | Level II | Level III |
|---|---|---|---|
| B: centre | Book | Same ability's level I Talon book | Same ability's level II Talon book |
| C: corners | Lapis lazuli | Diamond | Netherite scrap |

The four A slots use iron ingots for Multi Tool, ender pearls for Remote Loot, gunpowder for Blast, raw gold for Vein Miner, or copper ingots for Excavation. Materials must be plain items; upgrade books must have the expected Talon identity. Automated crafters cannot produce these books.

## Optional book sources

Servers can enable additional sources in `acquisition.toml`. Each eligible event rolls once and can produce at most one book, chosen from the source's configured abilities and levels. Disabled abilities and levels above their configured cap are excluded.

- Chest loot adds a book to native `minecraft:chests/` loot-table results. Plugin-generated loot and entity drops are excluded; existing loot remains.
- Trading can replace a newly generated librarian enchanted-book offer with a Talon book for the configured emerald price plus one ordinary book. Existing trades are unchanged.
- Enchanting an ordinary book can award a separate bonus Talon book when the offer meets the configured level requirement and the player has `talon.use`. Vanilla enchanting stays unchanged. Cancelled enchanting grants nothing; the bonus goes to inventory, with overflow dropped at the player's location.

## Paid books

When paid progression is enabled, `/talon buy <ability> [level]` buys a single book through Vault, defaulting to level I. Levels II and III require one book of that ability at the previous level, which is consumed only when the purchase is delivered. Buying requires `talon.buy`, `talon.use`, and the ability's use permission. A purchase needs an empty inventory slot, except when the consumed previous-level book occupies a slot by itself.

Only one purchase per player runs at a time. A changed inventory or applicable setting cancels delivery. If payment already succeeded, Talon attempts a refund through the same provider. A rejected or uncertain refund, an unknown payment, or an uncertain inventory outcome stops further purchases for administrator review. Talon never retries an uncertain transfer automatically.

Purchase records are stored in `data/purchases/<uuid>.json`. Records include the transaction ID, player, ability, level, price, provider, and stage. Unfinished records survive restarts and continue to block new purchases until reconciled. An unreadable record also blocks purchases; Talon does not replace it or restore an older transaction automatically. The previous book remains untouched when delivery has not started.

## Remote Loot

Left-click a chest, trapped chest, or barrel without sneaking while holding an enabled Remote Loot tool to link it. The link belongs to the player who made it. Linking selects container delivery; `/talon loot inventory` selects the player's inventory while keeping the saved link. `/talon unlink` removes the link.

The configured range caps every level. Containers must be loaded, in the same world, within range, and accessible from the current region. Locked or denied containers reject delivery. Items that do not fit stay at their drop location. Experience is not transported.

Block-drop collection waits for drop-event listeners to finish and respects their final cancellation state. Captured drops retain their final material, amount, and metadata, and cannot merge with nearby items while collection is pending. Items removed from the event are skipped; item entities added after Talon's listener are not collected by Remote Loot.

Remote Loot also collects drops from non-player mobs killed by the player. Custom mob drops must be supplied before Talon's death listener runs. See [drop integration ordering](/talon/06-integrations#mob-drops) when combining Talon with a custom mob or drop plugin.

`/talon inspect` includes the last Remote Loot check: destination, position, free storage slots, result, and the age of that check. Inspection uses saved observations and does not open or probe a container. A destination is unverified until linking or delivery checks it. Empty slots do not guarantee room for every item; compatible partial stacks can still accept items when there are no empty slots.

Unavailable, denied, locked, out-of-range, and full destinations produce rate-limited feedback. Partial delivery leaves the remaining items at their source. Checks and free-slot counts describe the last action, rather than live container contents.

## Mining preview

Hold an active mining tool, look at a supported block within eight blocks, and run `/talon preview`. The preview shows the bounded selection and estimates extra block count and durability use before Unbreaking. It does not break blocks or reserve access; protection rules and later world changes can reduce the actual result.

Mining feedback reports completed extra breaks and skipped candidates. Interrupted jobs report a reason: cancellation, a changed tool or mode, disabled abilities, leaving the allowed area, timeout, a reached block limit, or an unavailable original block.

## Optional crop harvesting

With harvesting enabled, hold a Multi Tool III hoe, aim at a mature crop, and run `/talon harvest`. Talon checks a square at the target's height, starting with the nearest crops. Wheat, carrots, potatoes, beetroot, and nether wart are supported; immature plants are left alone.

Keep plain seeds or planting items in your inventory: wheat seeds, carrots, potatoes, beetroot seeds, or nether wart. Talon skips a crop without its planting item. Each crop follows the server's player-break process, so normal drops and break protection remain in effect. Replanting raises a placement event and consumes one planting item only when accepted. If placement is denied after a successful break, the crop remains harvested and the seed remains in inventory. Talon does not create replacement drops.

The action stops when the tool or mode changes, the player interacts or changes inventory selection, abilities become unavailable, the player moves too far away, the budget is reached, or ten seconds pass. Unloaded chunks and foreign regions are skipped. Verdant takes precedence for the entire feature whenever it is enabled; Talon then declines harvest commands and stops queued harvest work.

## Mining boundaries

Jobs stop when the held tool or its material changes, the mode changes, the player leaves the world or moves more than 32 blocks from the origin, or ten seconds pass. A Multi Tool form change also stops its queued mining. Talon never loads chunks for an ability. Region-threaded servers skip blocks outside the current owned region.

The durability reserve applies before each extra break. The player's original block break still follows normal server behavior. Material and tag filters apply to extra mining; deny rules take precedence over allow rules.

## Related pages

- [Configuration *Mining and loot controls*](/talon/03-configuration)
- [Integrations *Container protection*](/talon/06-integrations)
{.links-list}
