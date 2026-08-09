---
title: "Integrations"
description: "Adapt documentation: Integrations"
published: true
date: 2026-08-09T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Adapt discovers optional Bukkit integrations during plugin enable. Missing integrations are skipped; installing, removing, enabling, or disabling one requires a server restart so Bukkit load order and Adapt's registries are rebuilt.

## Bukkit soft dependencies

| Plugin | Runtime behavior |
|---|---|
| PlaceholderAPI | Registers the `adapt` placeholder expansion |
| WorldGuard | Registers region flags, region policy, and a protector |
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
| MagicCosmetics | Prevents cosmetic hat and bag equipment from being counted as normal armor by Adapt |

Protection registration and default-enable settings are defined in [Protection & Region Policy](/adapt/08-protection-region-policy).

## PlaceholderAPI

When PlaceholderAPI is enabled before Adapt, Adapt registers its persistent `adapt` expansion. Placeholder paths use dot-separated segments after `%adapt_`; representative keys are `%adapt_player.level%`, `%adapt_skill.agility.level%`, and `%adapt_mutation.slot-1%`.

Online snapshots refresh approximately once per second on each player's owning thread. An offline player's last snapshot remains available for sixty seconds and then resolves to `---`. The complete key and result table is in [API - PlaceholderAPI](/adapt/47-api-placeholderapi).

## Vault

`learningEconomy.enabled = true` enables Vault-backed learning when Vault has an economy provider. Adapt withdraws `knowledgeCost * moneyPerKnowledge` before changing the adaptation and stores committed per-level receipts; normal unlearning refunds `refundPercent` of those receipts unless `hardcoreNoRefunds` is enabled.

A failed withdrawal rejects the learning transaction without spending knowledge. A failed refund is recorded on the skill line and retried by a later learning transaction. If Vault or its provider is unavailable, learning remains knowledge-only.

## HiddenOre

The HiddenOre bridge activates only when Bukkit reports HiddenOre enabled. It provides these behaviors:

- Hidden-vein blocks award Pickaxes XP from the configured material-value calculation.
- Gem Polish can add gem drops and bonus experience.
- Autosmelt converts raw iron, gold, and copper drops to ingots.
- Drop to Inventory can request direct inventory delivery.
- Pickaxe Veinminer includes HiddenOre vein siblings.
- Quarry Sense and Excavation Seismic Ping include HiddenOre vein targets.

If HiddenOre is installed but disabled, Adapt logs a warning and continues without the bridge.

## Iris

Iris availability controls registration and runtime enablement of `axe-iris-feller`. The adaptation delegates tree recognition and erosion to `IrisTreeFellerService`; Adapt supplies hunger reservation, durability preservation, cooldown, and stop/refund hooks. Other Adapt axe veinminers ignore breaks already owned by the Iris tree-feller service. There is no general Iris biome bridge.

## AdvancedChests

When AdvancedChests is enabled, `rift-access` checks the selected remote block through `AdvancedChestsAPI` and opens page 1 of that chest instead of a Bukkit inventory. Lookup failures are logged with a stack trace and the remote-open attempt fails safely. Normal protection and active-adaptation checks still apply.

## MagicCosmetics

Adapt's shared armor-value calculation normally counts the player's vanilla armor items. When MagicCosmetics is enabled and reports an equipped `HAT` or `BAG`, Adapt excludes the corresponding helmet or chestplate slot from that calculation so cosmetic carriers do not add armor value to abilities.

## Protection plugins

WorldGuard and the six claim/container plugins are registered whenever present. `protectorSupport.*` chooses the default-active subset; Factions defaults off and the other built-in protectors default on. See [Protection & Region Policy](/adapt/08-protection-region-policy) for flags, exact config names, overrides, and failure behavior.

## Velocity and Redis

The Velocity companion publishes a Redis data request before a player connects to a backend. SQL-enabled backends publish and cache player JSON for one minute; SQL remains authoritative. Installation, configuration, and operational limits are in [Velocity & Cross-Server](/adapt/39-velocity-cross-server).

## Third-party Java API

Other Bukkit plugins can register `AbilityUsePolicy`, `AbilityCostProvider`, `Protector`, and region-policy services and listen to Adapt's events. API consumers cannot grant an unlearned adaptation merely by registering a provider. See docs `41`–`50`.

## See also

- [Installation & Configuration](/adapt/01-installation-configuration)
- [Protection & Region Policy](/adapt/08-protection-region-policy)
- [Velocity & Cross-Server](/adapt/39-velocity-cross-server)
- [API - PlaceholderAPI](/adapt/47-api-placeholderapi)
