---
title: "Integrations"
description: "Optional plugin integrations and their runtime behavior"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Adapt detects thirteen optional plugins at startup. Missing integrations do not stop Adapt from enabling, but an unusable configured integration may produce a warning.

Restart after installing, removing, enabling, or disabling an integration. Protection plugins can deny adaptation actions. The other integrations add economy charges, placeholders, or support for specific abilities.

## PlaceholderAPI

If PlaceholderAPI is enabled when Adapt enables, Adapt registers a persistent expansion under the identifier `adapt`. Placeholder paths are dot-separated segments after `%adapt_`. You get things like `%adapt_player.level%`, `%adapt_skill.agility.level%` and `%adapt_mutation.slot-1%`.

Values come from a snapshot, not a live read. That keeps placeholder-heavy scoreboards off Adapt's data structures. Each ready online player's snapshot is republished about once per second on that player's owning thread. When a player leaves normally, their last snapshot stays readable for sixty seconds and then resolves to `---`. When a profile cannot be loaded safely or loses its SQL fence, the snapshot is removed immediately: `%adapt_available%` is `false` and per-player values are `---` while the Minecraft session remains connected. The complete key and result table is in [47 - API - PlaceholderAPI](/adapt/47-api-placeholderapi).

## Vault

Vault lets you charge economy currency for learning adaptations in addition to knowledge.

1. Install Vault and an economy provider.
2. Set `learningEconomy.enabled = true` in `adapt.toml`.
3. Set `learningEconomy.moneyPerKnowledge` to the price per point of knowledge.
4. Set `learningEconomy.refundPercent` to how much of that comes back on unlearn, or `0` for none.

Adapt withdraws `knowledgeCost * moneyPerKnowledge` before spending knowledge. A failed withdrawal rejects the purchase.

Each level bought stores its own refund receipt on the skill line. A normal unlearn pays back `refundPercent` of the receipts covering the levels being dropped, unless `hardcoreNoRefunds` is on. If the deposit itself fails, the amount is parked on the skill line and paid out by the next learn or unlearn that player performs.

If Vault is missing, or Vault has no active economy provider, learning stays knowledge-only. Adapt warns once when prices are enabled with no provider available. It stops warning as soon as one appears.

## HiddenOre

The HiddenOre bridge only activates when Bukkit reports HiddenOre as enabled. Once it is, hidden veins stop being invisible to Adapt. Breaking one awards Pickaxes XP from the same material-value table normal ores use. Several pickaxe and excavation adaptations start seeing veins as real targets.

Autosmelt turns raw iron, gold and copper drops into ingots. Drop to Inventory asks HiddenOre to deliver straight to the player's inventory. Pickaxe Veinminer chains through HiddenOre vein siblings. Quarry Sense and Excavation's Seismic Ping both include hidden veins in what they detect. Trophy Polish does not run through HiddenOre because hidden veins are not rare trophies.

If HiddenOre is installed but disabled, Adapt logs a warning and runs without the bridge.

## Iris

Iris controls whether the `axe-iris-feller` adaptation exists at all. Adapt only registers it when Iris is enabled. The adaptation reports itself disabled if Iris goes away.

Iris handles tree recognition and felling through `IrisTreeFellerService`. Adapt handles hunger, durability preservation, cooldowns, stopping, and refunds. Other axe veinminers ignore breaks owned by that service. Adapt has no general Iris biome integration.

## AdvancedChests

When AdvancedChests is enabled, `rift-access` checks the block it is about to open remotely through `AdvancedChestsAPI`. If that block is an AdvancedChests container, Adapt opens page 1 of that chest instead of a plain Bukkit inventory.

A failed lookup is logged with a stack trace. The remote open fails safely rather than falling through to the vanilla inventory. Normal protection and active-adaptation checks still run either way. The remote session only activates once the API has actually replaced the player's top inventory.

## MagicCosmetics

Several Adapt abilities scale off how much armor a player is wearing. MagicCosmetics puts cosmetic items in the helmet and chestplate slots where they would otherwise read as real armor. When MagicCosmetics is enabled and reports an equipped `HAT` or `BAG`, Adapt drops the matching slot from its armor-value sum. Cosmetic carriers contribute nothing.

## Protection plugins

WorldGuard and six claim or container plugins are registered whenever they are present at enable. The `protectorSupport.*` keys then pick which of those registered protectors are active by default. Factions defaults off. The rest default on.

Indirect Rift container use and transfers from live item entities also dispatch Bukkit's normal interaction or pickup events before committing. Event-driven protection plugins can deny the same action that way without implementing anything Adapt-specific. The registered protectors stay active as an extra gate.

Flags, exact config names, per-adaptation overrides and failure behavior are in [08 - Protection & Region Policy](/adapt/08-protection-region-policy).

## Cross-server SQL and Redis

Adapt needs no proxy plugin. SQL-backed backends use Redis directly during pre-login to request a response correlated to the exact preceding owner token and epoch. SQL remains authoritative, unsolicited payloads are ignored, and stale owners cannot overwrite a newer fence. A failed claim never rejects the Minecraft login: Adapt stays inactive and makes bounded online retries without creating a fallback profile. Installation, the `Adapt:data:v2` hard break, and operational limits are in [39 - Cross-Server SQL & Redis](/adapt/39-velocity-cross-server).

## Third-party Java API

Other Bukkit plugins can register `AbilityUsePolicy`, `AbilityCostProvider`, `Protector` and region-policy services. They can listen to Adapt's events. Registering a provider never grants an unlearned adaptation. See docs `41` through `50`.

## Reference

### Bukkit soft dependencies

Detected when Adapt starts.

| Plugin | Runtime behavior |
|---|---|
| PlaceholderAPI | Registers the persistent `adapt` placeholder expansion |
| WorldGuard | Registers region flags, the region policy source, and a protector |
| Factions | Registers the Factions claim protector |
| ChestProtect | Registers its container protector |
| Residence | Registers its residence protector |
| GriefDefender | Registers its claim protector |
| GriefPrevention | Registers its claim protector |
| LockettePro | Registers its lock/sign protector |
| Vault | Resolves the active economy provider for learning charges and refunds |
| HiddenOre | Connects hidden veins to mining XP and applicable pickaxe/excavation adaptations |
| Iris | Enables `axe-iris-feller` against Iris-managed trees |
| AdvancedChests | Lets `rift-access` open an AdvancedChests container |
| MagicCosmetics | Keeps cosmetic hat and bag equipment out of Adapt's armor-value sum |

Protection registration and default-enable settings are defined in [08 - Protection & Region Policy](/adapt/08-protection-region-policy).

### PlaceholderAPI behavior

| Item | Value |
|---|---|
| Identifier | `adapt` |
| Author / version | `Volmit Software` / `1.0.0` |
| Persistent | Yes, survives a PlaceholderAPI reload |
| Player snapshot refresh | About once per second, on the player's owning thread |
| Offline grace before eviction | 60000 ms |
| Value when the snapshot is missing, or the resolver throws | `---` |
| Value for a key the expansion does not publish | `null`, so PlaceholderAPI leaves the placeholder text unchanged |

### Vault settings

| Key | Default | What it does |
|---|---|---|
| `learningEconomy.enabled` | `false` | Turns on Vault charges for learning. With it off, learning is knowledge-only |
| `learningEconomy.moneyPerKnowledge` | `1.0` | Currency charged per point of knowledge. Values at or below zero, or non-finite, disable the charge |
| `learningEconomy.refundPercent` | `100.0` | Percentage of the recorded receipts returned on unlearn, capped at 100 |
| `hardcoreNoRefunds` | `false` | When true, unlearning refunds neither knowledge nor currency |

Skill-line storage keys used by the economy: `vault-learning-refund-<adaptation>-level-<n>` for per-level receipts, and `vault-learning-pending-refund` for a deposit that failed and is awaiting retry.

### HiddenOre bridge

The bridge listens to `HiddenOreDropsEvent` and applies Autosmelt, Drop to Inventory, and the ore XP award in that order. Autosmelt covers `RAW_IRON`, `RAW_GOLD` and `RAW_COPPER`. The XP award uses the vein's display material against the Pickaxes value table, credited at the block's location. The bridge records `pickaxe.autosmelt.ores-smelted`; it has no Trophy Polish reward path.

Outside that event the bridge also answers nearest-vein and vein-radius queries for Quarry Sense and Seismic Ping. It also answers vein-sibling lookups for Pickaxe Veinminer.

### Iris tree feller

`axe-iris-feller` is registered only when Iris is enabled, and delegates to `art.arcane.iris.api.tree.IrisTreeFellerService` from the Bukkit services manager. Max level 3, tick interval 6127 ms, durability preservation chance 0% / 25% / 75% by level. It triggers on `BlockBreakEvent` at `HIGH` priority and ignores cancelled events. It skips any break that is already vein-mined or already managed by the Iris service.

## See also

- [01 - Installation & Configuration](/adapt/01-installation-configuration)
- [08 - Protection & Region Policy](/adapt/08-protection-region-policy)
- [39 - Cross-Server SQL & Redis](/adapt/39-velocity-cross-server)
- [47 - API - PlaceholderAPI](/adapt/47-api-placeholderapi)
