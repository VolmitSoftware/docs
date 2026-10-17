---
title: 10 - Island Contracts
description: Rotating delivery orders, consumed materials, configurable rewards and interrupted hand-ins
published: true
date: 2026-10-10T09:50:21.111Z
tags: skyprime, contracts, progression, rewards
editor: markdown
dateCreated: 2026-10-09T05:00:00.000Z
---

Each island has a saved board of delivery orders. A teammate completes an order by confirming the removal of all required ordinary items from their storage inventory before its deadline. Completion awards island-bank credits and queues personal item, XP or console-command rewards for the delivering player.

## Board and delivery

Open `/is contracts`, then select an offer or use `/is contract deliver <id>`. The confirmation shows the materials that will be consumed, credits and personal rewards. Confirm within 30 seconds or before the board deadline, whichever comes first, using the menu or `/is contract confirm`; cancel with `/is contract cancel`. Closing the menu retains the quote until expiry, while quitting clears it.

An order consumes only plain items without custom metadata from the 36 storage slots. Armor, offhand, cursor items and contents nested inside containers do not count. SkyPrime rechecks inventory, permission, island membership, level and deadline before applying the hand-in. Survival and Adventure players can deliver; creative, spectator and starter-preview sessions cannot.

Every order completes once per island per board. Teammates share completion state, but each hand-in takes the whole order from one player. There are no partial contributions. Credit rewards go to the island; other rewards go to the delivering player's persistent inbox, collected through `/is rewards`. Contract credits are fixed and are not multiplied by mission-credit boosters.

## Configuration

`plugins/SkyPrime/config/contracts.toml` is hot reloadable. Existing scalar fields are editable through the configuration editor; add or remove definitions in TOML. Invalid reloads retain the prior configuration.

| Field | Default | Meaning |
| --- | --- | --- |
| `enabled` | `true` | Permit new deliveries |
| `rotationSeconds` | `86400` | Window length, 60–604800 seconds |
| `anchorMillis` | `0` | Nonnegative Unix-millisecond anchor for aligned UTC windows |
| `offersPerTier` | `1` | Select 1–3 available definitions per difficulty, up to nine offers total |
| `definitions` | Six presets | Up to 128 keyed definitions |

Selection uses the island identity and rotation window, weighted without replacement within each tier. A tier with too few enabled definitions supplies only the available offers. Level-locked offers remain visible rather than rerolling as the island's level changes. The board is saved when first accessed; no world scan or repeating per-island timer is required.

| Definition field | Meaning |
| --- | --- |
| ID | 1–32 lowercase letters, digits, underscores or hyphens |
| `enabled` | Eligible for selection on future boards |
| `presentation` | Configurable name, inventory icon and description using the shared progression presentation format |
| `difficulty` | `EASY`, `MEDIUM` or `HARD` |
| `weight` | Relative selection weight within the tier, 1–1000000 |
| `requiredLevel` | Minimum current island level, zero or greater |
| `requirements` | 1–16 distinct item-material names with positive quantities; the complete order must fit 36 slots using normal stack limits |
| `credits` | Nonnegative island-credit payment |
| `rewards` | Shared progression reward bundle: items with optional metadata, experience and console commands |

At least one credit or personal reward is required. Personal rewards use the same validation, capacity limits, metadata and collection journal as [mission rewards](/skyprime/03-islands-progression#personal-mission-rewards).

| Preset | Difficulty / level | Delivery | Credits | Personal reward |
| --- | --- | --- | --- | --- |
| `timber_shipment` | Easy / 0 | 64 oak logs | 150 | 4 oak saplings, 25 XP |
| `stone_shipment` | Easy / 0 | 128 cobblestone | 200 | 2 iron ingots, 25 XP |
| `farm_supplies` | Medium / 10 | 256 wheat, 128 carrots | 1000 | 2 emeralds, 100 XP |
| `workshop_supplies` | Medium / 10 | 64 iron ingots, 128 oak logs | 800 | 4 gold ingots, 100 XP |
| `gem_shipment` | Hard / 50 | 16 diamonds, 128 gold ingots | 3000 | 8 emeralds, 300 XP |
| `redstone_shipment` | Hard / 50 | 512 redstone, 256 lapis lazuli | 2500 | 4 diamonds, 300 XP |

## Reloads, resets and timing

Each saved board freezes the selected definitions, requirements, rewards and deadline. Editing definitions or rotation settings does not rewrite an active board. The next eligible access after expiry creates a new board from the current settings. Setting `enabled = false` blocks new hand-ins immediately; operator recovery remains available.

Reset and ownership transfer retain the board and completed offers. Restart does not renew the deadline. An order whose input has already been removed can finish committing after expiry; expiry never discards an unresolved receipt. Backward wall-clock movement does not reopen completed orders.

## Permissions

| Permission | Default | Use |
| --- | --- | --- |
| `skyprime.contracts` | Everyone | View the board |
| `skyprime.contracts.deliver` | Everyone | Confirm deliveries; also requires `skyprime.use` and island action `CONTRACTS` |
| `skyprime.contracts.admin` | Operators | List and resolve interrupted deliveries |

The default member role includes `CONTRACTS`. Custom roles can grant or deny it independently. The browser and confirmation messages are included in all 18 bundled language catalogs; configured offer names and descriptions use their configured text.

## Interrupted deliveries

Before removing items, SkyPrime saves a delivery receipt and, when the order includes personal rewards, reserves reward capacity with a `HELD` parcel. Credit-only orders do not create a personal parcel. The owning player scheduler then applies and saves the inventory change. Completion saves the offer ID, credit payment and queued reward together. Held parcels cannot be collected.

Player inventory storage and plugin storage are separate transactions. If removal may have happened but completion is uncertain, the receipt becomes `REVIEW`; startup also places unfinished deliveries in review. SkyPrime does not automatically consume again or refund potentially untouched items.

Use `/is contract pending` to inspect unresolved receipts. After checking the player's inventory and saved records, use `/is contract resolve <receipt UUID> consumed` to complete the frozen payment, or `cancel` when inputs were not consumed. Cancellation releases the reservation without restoring items. Both actions require an exact unresolved review receipt and cannot pay the same receipt twice.

While a receipt is pending, that island cannot start another delivery, mutate its bank, reset, delete or change its team. Resolve the receipt before those operations. Back up the full plugin storage directory together with island terrain; boards and input receipts use island schema 9 and output receipts use reward schema 2. See [recovery](/skyprime/04-operations-recovery#contract-delivery-recovery).
