---
title: "Temper: Overview"
description: "Repair equipment with quotes, materials, money, XP, or kits"
published: true
date: 2026-10-24T00:00:00.000Z
tags: "temper, repairs"
editor: markdown
dateCreated: 2026-10-15T00:00:00.000Z
---

Temper repairs damaged equipment through an inventory menu or commands. Players see the cost before confirming, and equipment stays in its original slot during the preview.

## First repair

1. Hold a damaged tool and run `/temper repair`.
2. Choose the item, payment method, and repair amount.
3. Review the quote and confirm it before it expires.

XP payments use experience points, not levels. Money needs Vault and an economy provider. Material payments consume eligible plain items; repair kits use one tagged item from the offhand.

## Common commands

| Command | What it does |
|---|---|
| `/tem repair` | Open the repair menu |
| `/tem quote hand 50` | Preview restoring half the missing durability |
| `/tem confirm` | Apply the current quote |
| `/tem config` | Open the operator settings editor |
| `/tem language` | Choose a language or edit messages |

## Related pages

- [Installation *Requirements and first start*](/temper/01-installation)
- [Commands *Syntax and permissions*](/temper/02-commands-permissions)
- [Repairs and pricing *Costs, kits, and confirmation rules*](/temper/05-repairs-pricing)
{.links-list}
