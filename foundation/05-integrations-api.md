---
title: "Vault, PlaceholderAPI, and Service API"
description: "Foundation optional integrations, placeholder keys, and Bukkit service access"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "foundation, vault, placeholderapi, api"
editor: markdown
dateCreated: 2026-08-28T00:00:00.000Z
---

Foundation has no required integration plugin. Optional bridges are registered only after their target plugin is enabled and are removed during target disable, module disable, Foundation shutdown, or BileTools pre-unload.

## Vault

When the economy module, `economy.vaultProvider`, and Vault are all enabled, Foundation registers a Vault economy provider. It supports UUID-backed player accounts and reports that bank operations are unsupported. The provider unregisters before the economy service is discarded.

Legacy name-based Vault calls remain implemented because they are part of Vault's `Economy` interface. Foundation resolves them through the server's offline-player contract and routes their storage through the same checked economy service.

## PlaceholderAPI

Set `integrations.placeholderApi` to control publication. Player placeholders return `---` when the UUID has no loaded Foundation profile, preventing a placeholder read from performing disk I/O.

| Placeholder | Value |
|---|---|
| `%foundation_available%` | `true` while the expansion is active |
| `%foundation_afk%` | Player AFK state |
| `%foundation_vanished%` | Foundation-owned vanish state |
| `%foundation_muted%` | Active Foundation mute state |
| `%foundation_jailed%` | Active Foundation jail state |
| `%foundation_accepting.messages%` | Private-message acceptance |
| `%foundation_accepting.payments%` | Payment acceptance |
| `%foundation_accepting.teleports%` | Teleport-request acceptance |
| `%foundation_mail.unread%` | Unread mailbox count |
| `%foundation_cosmetic.particle%` | Selected personal particle key or `default` |
| `%foundation_homes.count%` | Number of homes |
| `%foundation_homes.names%` | Comma-separated home names |
| `%foundation_balance%` | Numeric balance, or `---` when economy is unavailable |
| `%foundation_balance.formatted%` | Configured currency formatting |
| `%foundation_modules.active%` | Active module count |
| `%foundation_modules.total%` | Registered module count |
| `%foundation_language%` | Active locale such as `en_US` |
| `%foundation_worth.entries%` | Number of registered item prices |
| `%foundation_worth.<material>%` | Numeric unit price, including zero for disabled sales |
| `%foundation_module.<id>%` | Whether the named module is active |

## Volmit suite cooperation

Foundation declares the Volmit suite plugins as optional load-before integrations and does not require them to start. Adapt, React, and Foundation publish action-bar segments and title claims through VolmLib's shared HUD metadata; their purposes, priorities, slots, and lifetimes are composed rather than overwritten. Foundation owns only its `foundation:teleport` purpose and boss-bar lane. Other suite plugins can consume the Bukkit service API and PlaceholderAPI state without touching Foundation's JSON files or forcing profile disk loads.

## Bukkit service API

Foundation registers `art.arcane.foundation.api.FoundationApi` with Bukkit's `ServicesManager` at normal priority. Consumers compile against the Foundation plugin jar and declare Foundation as a dependency or soft dependency.

```java
FoundationApi api = Bukkit.getServicesManager().load(FoundationApi.class);
if (api != null && api.moduleActive("homes")) {
    Optional<FoundationApi.PlayerSnapshot> snapshot = api.player(playerId);
}
```

The API exposes the plugin version, immutable module-state maps, active-module checks, immutable loaded-player snapshots, and an optional balance. Player snapshots include homes, AFK, vanish, acceptance preferences, active mute and jail state, unread mail, personal cosmetic particle, and seen timestamps. Player and balance calls only use already loaded profiles and therefore do not introduce synchronous disk access.
