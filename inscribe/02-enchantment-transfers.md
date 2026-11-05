---
title: "Inscribe: Enchantment transfers"
description: "Extract selected enchantments and apply compatible book upgrades"
published: true
date: 2026-11-05T00:00:00.000Z
tags: "inscribe, enchantments, pricing"
editor: markdown
dateCreated: 2026-10-08T00:00:00.000Z
---

Transfers use right-clicks inside the player's inventory. Items dropped into the world are not involved.

Inscribe reacts only when a transfer is possible: transfers are enabled, the player has the permission, the clicked item is allowed and not stacked, and at least one enchantment can move. Creative-mode players also need `transfers.allowCreative`. Any other right-click with a book behaves as in vanilla, including swapping the cursor and the clicked item. Clicks count in the main inventory and hotbar, not in armor or offhand slots.

## Extract enchantments

1. Pick up an ordinary book on the inventory cursor.
2. Right-click enchanted equipment.
3. Select the enchantments to move. Each entry shows its price.
4. Check the total price and confirm.

Selected entries appear as glinting enchanted books and unselected entries as plain books, in both the extraction and application menus. The enchantment name and level use the player's game language.

One book receives the selected enchantments. Unselected enchantments stay on the equipment. Extracted books carry no lore unless `transfers.bookLore` sets it.

## Apply an enchanted book

1. Pick up an enchanted book on the inventory cursor.
2. Right-click compatible equipment.
3. Deselect any enchantment to keep in the book. All applicable enchantments start selected, and each entry shows the item's current level when it already has that enchantment.
4. Check the price and confirm.

Enchantments left unselected or unusable stay in the book.

Inscribe applies only improvements and never lowers an existing level. With `transfers.mergeEqualLevels` on, a book level equal to the item's level raises it by one, such as Sharpness III and Sharpness III becoming Sharpness IV, up to the vanilla maximum. With it off, equal levels stay in the book. With `transfers.increaseRepairCost` on, each application raises the item's repair cost to twice the higher of the item's and the book's repair cost, plus one, as an anvil does.

Material applicability and enchantment conflicts always apply. `transfers.allowUnsafe` permits levels above the normal maximum only. With it off, an enchantment stored above its normal maximum stays in the book instead of being applied at a lower level. Disabled enchantment policies block both extraction and application. Curse of Binding and Curse of Vanishing are disabled in the default policy.

## The menu and your items

Opening either menu moves the cursor book into the first empty inventory slot, so a free slot is required. Cancelling leaves the book there and the equipment unchanged. A stack of books needs a second free slot, because the finished book or the leftover enchantments go to a separate slot from the rest of the stack.

Before changing items, Inscribe rechecks the items, settings, permissions, space, and payment. Changed items or settings cancel the transfer.

## Payments

Extraction charges each selected enchantment using its [policy](/inscribe/03-configuration#enchantment-policies), or the `pricing` defaults when it has no rule. A per-level price multiplies by that enchantment's level. The application fee uses `pricing.currency` and is charged once per transfer, unless per-level application multiplies it by the sum of applied levels.

`EXPERIENCE` charges raw experience points, not player levels, and removes exactly the quoted points across level boundaries. A total above the supported player experience balance is unaffordable and stops the transfer before any payment, including the money part of a mixed-currency extraction.

`MONEY` uses the installed Vault economy provider. Without an available provider, a transfer with a money price does not run.

Both menus recheck their session after a money withdrawal. If the economy provider closes or replaces the menu, Inscribe stops the transfer and requests a refund without changing items or experience. A replacement menu from another plugin stays open. If a refund fails, an operator needs to reconcile the provider balance before the player retries.

## Related pages

- [Configuration *Prices, materials, and policies*](/inscribe/03-configuration)
- [Integrations and diagnostics *Economy and refunds*](/inscribe/06-integrations-diagnostics)
{.links-list}
