---
title: "Temper: Integrations"
description: "Optional economy support and custom-item boundaries"
published: true
date: 2026-10-24T00:00:00.000Z
tags: "temper, integrations"
editor: markdown
dateCreated: 2026-10-15T00:00:00.000Z
---

Temper runs without an economy plugin. Its shared commands, scheduling, configuration, and language services come from the required parts of VolmLib packaged with Temper.

## Vault

| Integration | With it | Without it | Control |
|---|---|---|---|
| Vault plus an economy provider | Money repair mode | XP, materials, and kits still work | `pricing.enabledModes`, `temper.mode.money` |
| Folia economy provider | Money may be enabled after checking provider support | Money remains disabled | `pricing.allowEconomyOnFolia` |

Vault's presence does not establish that its provider is safe on Folia. Keep the opt-in disabled unless the installed provider supports the required player-thread operations.

## Custom items

`repair.allowCustomItems` permits normal Bukkit durability repairs on items carrying custom data. Metadata is preserved, and native maximum durability is respected. This is not an MMOItems custom-durability integration.

Custom item eligibility does not infer a provider from an item’s name or lore. Repairs use Bukkit durability; provider-specific durability must be managed by that provider.

Temper registers with the shared Volmit integration service for plugin discovery and storage-health reporting. It does not currently publish repair counters through that service.

## Gloss

Station labels use Gloss temporary holograms; selected-item previews use `GlossAPI.createTemporaryItem`. Install a Gloss build that exposes these APIs. Temper disables those optional displays when the APIs are unavailable, while repair menus, payments, sounds, and particles remain usable.

Gloss displays are cosmetic and viewer-specific. They do not move or spawn collectible copies of inventory equipment. Configure range, refresh, and preview lifetime under `stations.visuals`.

## Related pages

- [Repairs and pricing *Payment behavior*](/temper/05-repairs-pricing)
- [Diagnostics *Provider and transaction state*](/temper/08-diagnostics)
- [Capabilities *Repair and station controls*](/temper/09-feature-map)
{.links-list}
