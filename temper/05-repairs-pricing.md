---
title: "Temper: Repairs and pricing"
description: "Quotes, payment methods, profiles, and repair kits"
published: true
date: 2026-10-24T00:00:00.000Z
tags: "temper, repairs, pricing"
editor: markdown
dateCreated: 2026-10-15T00:00:00.000Z
---

Quotes cover one item, inventory, armor, or all equipped items. Partial repairs restore a percentage of the missing durability. Confirmation rechecks the items, permissions, settings revision, and price before payment.

## Payments

| Method | Payment |
|---|---|
| XP | Experience points, calculated from the player's current level and progress |
| Money | One Vault withdrawal for the quote total |
| Items | Eligible plain materials from inventory storage |
| Kit | One tagged offhand kit for one equipment item |

Bulk quotes show each item and a combined total. Selected equipment is never used as payment. Named or custom ingredients are not supported as ordinary material currency.

## Pricing settings

| Setting | Default | What it changes |
|---|---|---|
| `pricing.defaultMode` | `XP` | Initial payment choice |
| `pricing.enabledModes` | `XP`, `MONEY`, `ITEMS` | Available normal payment modes |
| `pricing.experienceFormula` | `ceil(damage / maxDurability * 30)` | XP-point cost |
| `pricing.moneyFormula` | `xpCost * 5` | Vault amount |
| `pricing.itemFormula` | `ceil(damage / maxDurability * 4)` | Ingredient count |
| `pricing.enchantedMultiplier` | `2` | Enchanted-item price multiplier |
| `pricing.minimumCost` | `1` | Per-item price floor |
| `pricing.maximumCost` | `1000000` | Per-item price cap |
| `pricing.tierMaterials` | `true` | Choose ingredients by equipment tier |
| `pricing.genericMaterial` | `IRON_INGOT` | Ingredient when tier selection is disabled |
| `pricing.allowEconomyOnFolia` | `false` | Opt in to money with a Folia-suitable provider |
| `pricing.profiles` | Empty | Per-material price and ingredient overrides |
| `pricing.permissions` | Empty | Permission discounts and cooldown overrides |

Formulas accept `damage`, `maxDurability`, `durability`, `percent`, and `xpCost`, arithmetic, and `ceil`, `floor`, `round`, `min`, and `max`. `damage` is the amount being repaired. XP and material charges round upward to whole units.

## Profiles and kits

A material belongs to one pricing profile. Omitted profile values inherit the defaults. Permission profiles do not stack: highest priority wins, then alphabetical profile ID. Discounts and cooldown overrides are rechecked at confirmation.

Kits support `FULL`, `PERCENT`, and `POINTS`. Kit percentage uses the item's maximum durability, capped at the damage remaining. The default `field_repair` kit is paper, restores 25 percent of maximum durability, and requires `temper.kit.use`.

Create and edit profiles and kits in `/temper config`. Give a kit with `/temper kit give field_repair`, put it in the offhand, then use `/temper kit use hand` and confirm.

## Payment failures

Money transactions are recorded before withdrawal. An uncertain outcome blocks further money withdrawals for that player until an operator checks the provider and resolves the ledger record. Resolution acknowledges the review; it neither refunds nor repeats a withdrawal.

Completed, cancelled, and resolved money transactions are archived. Configure their age and count limits under `ledger`; unresolved transactions are retained regardless of those limits. See [repair history settings](/temper/03-configuration#repair-history).

## Related pages

- [Commands *Repair, kit, and ledger commands*](/temper/02-commands-permissions)
- [Stations *Owned repair anvils*](/temper/06-stations)
- [Integrations *Vault and custom items*](/temper/07-integrations)
{.links-list}
