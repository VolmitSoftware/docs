---
title: "Cache: Feature reference"
description: "Kit, key and delivery capabilities and where to use them"
published: true
date: 2026-11-06T12:00:00.000Z
tags: "cache, kits, features"
editor: markdown
dateCreated: 2026-10-13T12:00:00.000Z
---

<nav class="doc-breadcrumb" aria-label="Breadcrumb"><a href="/cache">Cache</a><span aria-hidden="true">/</span><span aria-current="page">Feature reference</span></nav>

Cache delivers kits through ordinary claims, staff grants, starter grants, keys and crates. Every path saves its selected rewards before delivery.

| Capability | Where to use it |
|---|---|
| Browse kits by category, search and page | `/kits` |
| Preview rewards and their chances | `/previewkit <kit>` or the browser |
| Claim a kit, with paid-claim confirmation | `/kit <kit>` or the preview's claim button |
| Explain why a kit is unavailable | `/cache why <kit>` |
| Timed, shared and once-only cooldowns | `cooldownSeconds` and `cooldownGroup` in the kit file |
| Restrict kits by permission, world and visibility | `permission`, `worlds` and `hidden` in the kit file |
| Item, money, experience and console-command rewards | `[[rewards]]` entries or the kit editor |
| Independent reward chances with at least one reward per roll | `chance` on each reward |
| Saved hotbar, storage, armor and offhand destinations | `slot` on item rewards or the editor's destination picker |
| Capture an inventory as a new kit | `/cache create <kit>` |
| Edit kits and rewards in-game | `/cache edit <kit>` |
| Restore a previous revision | `/cache rollback <kit> <revision>` |
| Grant a kit to online players or an offline UUID | `/cache give <kit> <target>` |
| Grant a kit on first join | `general.starterKit` |
| Issue targeted or any-kit keys in `ROLL` or `ALL` mode | `/cache key` |
| Issue named reusable crates | `crates/<id>.toml` and `/cache crate` |
| Bind preview, claim or key actions to a block | `/cache display bind` |
| Retry or cancel a pending delivery | `/cache retry` and `/cache cancel` |
| Review history and reconcile uncertain deliveries | `/cache history` and `/cache resolve` |
| Reset a cooldown group for a player | `/cache reset <uuid> <kit>` |
| Show a reel and receipt after delivery | `presentation.animateClaims` |
| Edit settings and languages in-game | `/cache config` and `/cache language` |
| Choose a personal language | `/cache language` |
| Read kit counts, cooldowns and claim state in other plugins | PlaceholderAPI `%cache_...%` values |
| Approve, refuse or observe claims from another plugin | `CachePreClaimEvent` and `CacheClaimCompleteEvent` |
| Inspect runtime state | `/cache status` and `/cache debug` |
{.dense}

See [Kits and rewards](/cache/03-kits-rewards) for kit fields and [Delivery and recovery](/cache/06-delivery-recovery) for claim states.
