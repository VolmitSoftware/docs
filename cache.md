---
title: "Cache"
description: "Player kits, inventory previews, redeemable keys and delivery recovery"
published: true
date: 2026-11-06T12:00:00.000Z
tags: "cache, kits, rewards, folia"
editor: markdown
dateCreated: 2026-10-14T12:00:00.000Z
---

Cache provides player kits with item, money, experience and command rewards. Players browse and preview kits, check cooldowns and redeem keys; staff edit definitions in-game and inspect pending deliveries.

## At a glance

| | |
|---|---|
| Minecraft | 26.1 through 26.3 |
| Java | 25 or newer |
| Server software | Spigot, Paper, Purpur, Leaf, Folia and Canvas |
| Main command | `/cache` (`/ck`); `/kits` opens the kit browser |
| Config file | `plugins/Cache/config.toml` |
| Kit definitions | `plugins/Cache/kits/<id>.toml` |
| Claim records | `plugins/Cache/storage/claims/` |

## Start here

- [Installation and compatibility *Dependencies and server requirements*](/cache/01-installation-compatibility)
- [Commands and permissions *Browse, create, claim and administer kits*](/cache/02-commands-permissions)
- [Kits and rewards *Definitions, odds, editing and inventory destinations*](/cache/03-kits-rewards)
{.links-list}

## Reference

- [Keys and displays *Reusable crates, block bindings, Vault and placeholders*](/cache/04-keys-displays)
- [Configuration and languages *TOML settings, editors, translations and update notices*](/cache/05-configuration-languages)
- [Delivery and recovery *Retry pending claims and reconcile uncertain outcomes*](/cache/06-delivery-recovery)
- [Feature reference *Capabilities and where to use them*](/cache/07-feature-map)
- [Developer API *Claim events, cancellation and availability*](/cache/08-api)
{.links-list}

## First kit

Use `/kits` to browse the default Trail supplies kit. To create a kit, arrange your inventory, run `/cache create supplies`, then open `/cache edit supplies`. Capture copies the items; it does not remove them from your inventory. Preview the result with `/previewkit supplies` before making it available to players.

Prices apply to each ordinary claim. Folia refuses command rewards and requires explicit opt-in for economy paths; see [compatibility](/cache/01-installation-compatibility) for platform differences.
