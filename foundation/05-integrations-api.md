---
title: "Vault, PlaceholderAPI, and Service API"
description: "Foundation optional integrations, placeholder keys, and Bukkit service access"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "foundation, vault, placeholderapi, api"
editor: markdown
dateCreated: 2026-08-28T00:00:00.000Z
---

Foundation integrates with Vault and PlaceholderAPI when they are installed.

## Vault

Foundation provides an economy service. Use normal Vault economy calls; balances are stored per player.

## PlaceholderAPI

Use `%foundation_balance%` for the player's formatted balance. It returns `---` when no player is available.

## Java API

Look up the economy through Vault:

```java
RegisteredServiceProvider<Economy> registration =
    Bukkit.getServicesManager().getRegistration(Economy.class);

if (registration != null) {
    Economy economy = registration.getProvider();
    double balance = economy.getBalance(player);
}
```

Do not cache the provider across plugin reloads. Check Vault's `EconomyResponse` after deposits and withdrawals.
