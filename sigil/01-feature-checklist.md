---
title: "Sigil: Features"
description: "Voucher rules, rewards, editing and administration"
published: true
date: 2026-10-24T00:00:00.000Z
tags: "sigil, features"
editor: markdown
dateCreated: 2026-10-13T00:00:00.000Z
---

Sigil provides signed voucher items, configurable reward steps and persistent claim records. Use the editor for voucher settings and previews, and TOML for structured reward lists.

## Voucher features

| Area | Available behavior |
|---|---|
| Voucher identity | Signed serials, expiry, player binding and revocation |
| Eligibility | Required/denied permissions, world and game-mode restrictions, empty-slot checks, per-player/global limits |
| Reuse | One-time or reusable items; persistent voucher, group and global cooldowns |
| Redemption | Main-hand checks, confirmation, preview, repeated eligibility checks and recorded claims |
| Rewards | Guaranteed steps, exactly one weighted group, ordinary/captured items, commands, experience, health, food, potions, messages and effects |
| Authoring | TOML, validated field edits, create/clone/delete, held-item reward capture and hot reload |
| Operations | SQLite history, per-action outcomes, inspection, manual recovery and diagnostic dumps |
| Languages | Built-in English, 17 translation sources, local edits and persistent personal selections |
| Suite services | Shared update notifier, configurable bStats, hidden version alias and amber/copper startup banner |
| Item protection | Direct-item checks in common player-use, crafting, workstation, furnace and brewing paths |

## Configuration and administration

[Getting started](/sigil/00-overview) explains issuance and redemption. [Configuration](/sigil/02-installation-configuration) lists settings and reward formats. [Commands and permissions](/sigil/03-commands-permissions) covers player commands, editing and administration.

Sigil closes its menus before a managed BileTools reload or unload. It refuses preparation while deliveries are active so those deliveries can finish. See [lifecycle operations](/sigil/05-operations#reload-and-shutdown).

[Back to Sigil](/sigil)
