---
title: "Integrations"
description: "Optional plugin integrations and their runtime behavior"
published: true
date: 2026-09-28T18:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Every integration is optional. Install, remove, enable, or disable one, then restart. A missing plugin does not stop Adapt. A configured integration that cannot run logs a warning.

| Plugin | What it adds |
|---|---|
| PlaceholderAPI | `%adapt_...%` placeholders |
| WorldGuard | Region flags, region policy, and a protector |
| Factions | Claim protector. Off unless `protectorSupport.factionsClaim` is true |
| ChestProtect | Container protector |
| Residence | Residence protector |
| GriefDefender | Claim protector |
| GriefPrevention | Claim protector |
| LockettePro | Lock protector |
| Vault | Currency charge and refund when learning |
| HiddenOre | Hidden-vein mining XP and the pickaxe and excavation adaptations that target veins |
| Iris | Registers `axe-iris-feller` |
| AdvancedChests | `rift-access` can open an AdvancedChests container |
| MagicCosmetics | Cosmetic hat and bag slots are left out of armor-value math |

Protector names and defaults: [Protection and region policy](/adapt/08-protection-region-policy).

## PlaceholderAPI

The expansion id is `adapt`. Paths are dot-separated, as in `%adapt_player.level%` and `%adapt_skill.agility.level%`. Values refresh about once a second. After a player leaves, the last values stay readable for 60 seconds, then become `---`. If the profile cannot load, `%adapt_available%` is `false` and every value is `---`. An unknown key is left unchanged. Keys: [PlaceholderAPI](/adapt/47-api-placeholderapi).

## Vault

With `learningEconomy.enabled` and an economy provider, the charge is `knowledge cost * moneyPerKnowledge`. A failed withdrawal rejects the purchase. Each bought level stores receipt `vault-learning-refund-<adaptation>-level-<n>`. Unlearn pays `refundPercent` of those receipts unless `hardcoreNoRefunds` is true. A failed deposit is stored as `vault-learning-pending-refund` and paid on the next learn or unlearn on that line. No provider means learning stays knowledge-only.

| Key | Default | What it does |
|---|---|---|
| `learningEconomy.enabled` | `false` | Vault charges for learning |
| `learningEconomy.moneyPerKnowledge` | `1.0` | Currency per knowledge point. Zero, negative, or non-finite disables the charge |
| `learningEconomy.refundPercent` | `100.0` | Percent of the recorded receipts returned on unlearn, capped at 100 |
| `hardcoreNoRefunds` | `false` | Unlearn returns neither knowledge nor currency |

## HiddenOre

HiddenOre must be enabled. Breaking a hidden vein pays Pickaxes XP from the same material value as the matching ore. Autosmelt converts raw iron, gold, and copper drops to ingots. Drop to Inventory asks HiddenOre to deliver to the inventory. Pickaxe Veinminer chains through vein siblings. Quarry Sense and Seismic Ping include hidden veins. Trophy Polish does not. Blast-mining rewards pay no Pickaxes XP, are not smelted, and are not sent to the inventory.

## Iris

`axe-iris-feller` is registered only while Iris is enabled. Iris recognizes and fells the tree. Adapt applies hunger, durability preservation, cooldowns, stopping, and refunds. Other axe veinminers skip breaks that service already owns. Max level 3. Tick interval 6127 ms. Durability preservation is 0%, 25%, and 75% by level.

## AdvancedChests and MagicCosmetics

When the block `rift-access` is about to open is an AdvancedChests container, Adapt opens page 1 of that chest. A failed lookup logs the error and the remote open stops. Protection checks still run.

MagicCosmetics `HAT` and `BAG` slots are omitted from Adapt's armor-value sum.

## Cross-server storage

SQL remains the authority. Redis carries the handoff when both are enabled. There is no proxy plugin. See [Cross-server SQL and Redis](/adapt/39-velocity-cross-server).

Other plugins can register ability policies, costs, and protectors. Registering one does not grant an unlearned adaptation. See [API](/adapt/41-api-getting-started).
