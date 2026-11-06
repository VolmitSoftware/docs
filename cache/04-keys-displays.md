---
title: "Cache: Keys, displays and integrations"
description: "Persisted keys, crate definitions, block bindings, economy and placeholders"
published: true
date: 2026-11-06T12:00:00.000Z
tags: "cache, keys, crates, integrations"
editor: markdown
dateCreated: 2026-10-15T12:00:00.000Z
---

<nav class="doc-breadcrumb" aria-label="Breadcrumb"><a href="/cache">Cache</a><span aria-hidden="true">/</span><span aria-current="page">Keys and integrations</span></nav>

Keys authorize a limited number of kit deliveries. Crates use the same persisted token ledger with configurable appearance and right-click redemption. Copying an item does not create additional uses: copies share the token's remaining balance.

## Key modes

```text
/cache key trail Alex uses=3 mode=ROLL
/cache key trail Alex uses=1 mode=ALL
/cache key * Alex uses=1 mode=ALL
```

`ROLL` tests each configured reward's independent chance. `ALL` guarantees every entry whose chance is above zero; zero-chance entries remain disabled. The server ledger stores the mode, target and remaining uses. Editing item lore or metadata cannot change those authoritative values.

Hold a key in the main hand and use `/cache redeem`. Any-kit keys require `/cache redeem kit=<id>`. Key claims bypass ordinary claim permissions, price and cooldown checks, but still require enabled definitions, an allowed world, valid delivery conditions and integration approval. Each use redeems a complete selected reward set.

A key issued by command holds 1 to 1,000,000 uses. A claim reserves one use before delivery. A READY retry keeps that reservation and the same rewards; cancellation releases the reservation. Completed delivery refreshes the held key's count or removes one item when exhausted. If the recipient's inventory is full or they leave before the key item is placed, the new token is revoked and the recipient is told to ask again. Issuance targets one online player; there is no bulk or offline key delivery command.

## Crate definitions

Create `crates/provisions.toml`:

```toml
id = "provisions"
kit = "trail"
uses = 1
mode = "ROLL"
material = "CHEST"
name = "Provision crate"
```

The filename must match `id`. `kit` must be an existing kit ID or `*`, `uses` is 1–64, and `material` must be a usable item material. `mode` defaults to `ROLL`. A fresh crate directory receives a provisions example when the trail kit exists.

Issue it with `/cache crate provisions Alex`. Right-click a targeted crate in the main hand to redeem it; an any-kit crate asks the player to choose a kit through the redeem command. Crate items cannot be placed as blocks. Named definitions allow different appearances and use counts.

## Block bindings

Look at a solid block within six blocks and run one of:

```text
/cache display bind trail action=PREVIEW
/cache display bind trail action=CLAIM
/cache display bind trail action=KEY
```

Left-click previews the bound kit. Right-click performs the selected action: open preview, start an ordinary claim, or redeem the held key for that kit. Main-hand interaction is handled once. Use `/cache edit <kit>` to edit its definition. Remove a binding with `/cache display remove` before removing its protected block.

Bindings persist under `displays/` using world UUID and block coordinates. They protect bound positions from breaking, explosions and piston movement. Lookup does not scan worlds or load chunks.

## Economy

Vault and an available economy provider are required for prices and money rewards. Cache charges a price for each ordinary claim, with confirmation controlled by `claims.confirmPaidClaims`. Staff grants and key claims have no ordinary claim price. Folia economy calls require explicit `claims.allowEconomyOnFolia = true` and a provider compatible with that execution context.

A purchase URL is external fulfillment guidance. It refuses ordinary claiming even if the player has the kit permission; there is no store callback or persistent purchase ownership. Uncertain economy results enter staff review rather than being retried blindly.

## PlaceholderAPI

The optional expansion registers as `cache` and reads in-memory claim state.

| Placeholder | Result |
|---|---|
| `%cache_kits%`, `%cache_count%` | Loaded kit count |
| `%cache_pending_total%` | Number of players with unresolved claims |
| `%cache_pending%` | `1` or `0` for the player |
| `%cache_cooldown_<kit>%` | Remaining seconds, rounded up; `0` when elapsed and `-1` for once-only state |
| `%cache_claimed_<kit>%` | `true` or `false` for recorded prior completion |
{.dense}

Cooldown values reflect the persisted group state, not permission bypasses or complete availability. Claimed state is not permanent purchase ownership. Reward names and lore do not expand PlaceholderAPI variables.

## Related pages

- [Kits and rewards *Reward odds and saved item destinations*](/cache/03-kits-rewards)
- [Delivery recovery *Reservations, retry and reconciliation*](/cache/06-delivery-recovery)
- [Developer API *Cancellable events and completion receipts*](/cache/08-api)
{.links-list}
