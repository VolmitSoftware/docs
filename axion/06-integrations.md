---
title: "Axion: Integrations"
description: "Economy, protection, and storage integration behavior"
published: true
date: 2026-10-29T05:23:20.000Z
tags: "axion, automation"
editor: "markdown"
dateCreated: 2026-10-15T00:00:00.000Z
---

Axion runs without optional plugins. Optional plugin names in its descriptor control loading order; they do not imply a dedicated API integration.

## Vault

| Item | Behavior |
| --- | --- |
| Enables | Paid tier upgrades when Vault and an economy provider are available |
| Without it | Experience upgrades remain available; paid upgrades are unavailable |
| Access | `settings.moneyUpgrades`, `axion.upgrade.money`, and the next tier's `money` price |
| Folia scheduling | Paid upgrades are disabled |

## Protection plugins

Live actions emit relevant Bukkit protection events. WorldGuard, GriefPrevention, Lands, Towny, and Residence can cancel events they recognize; Axion does not currently provide dedicated read-only claim adapters for preview.

Live actions stop when callbacks invalidate the controller inventory or move the owner outside the executing region. Preview checks native spawn protection and local policy. Treat its output as an estimate when another plugin controls building or interaction.

Button activation emits `PlayerInteractEvent` and a rising `BlockRedstoneEvent`. Denying block interaction or preventing the rising power change rejects the press without charging fuel for it. Button release follows Minecraft's ordinary scheduled behavior.

Direct monster-kill collection captures the drop list when Axion's `HIGHEST` death handler runs. Changes made by earlier handlers are included. Drops added by later handlers remain ordinary world drops. Cancelled deaths on platforms that support them are not collected. Unrelated damage and later ignition deaths retain ordinary death behavior.

## Storage and automation

Controllers use native barrel, dropper, or dispenser storage. Axion blocks native dispensing and dropper pushes from its controllers.

Hoppers skip plain configured fuel before selecting a source slot, so a fuel stack in the first slot does not block output from later slots. The same item rules determine whether a stack can be burned or reserved: items with names or other custom metadata are not fuel. Seeds remain eligible for export unless their material is configured as fuel. Fuel insertion and manual withdrawals are allowed.

Configured fuels such as logs, planks, coal, and charcoal stay in the controller even when produced by the machine. Remove the corresponding `[fuels.MATERIAL]` table to export those ordinary items. Container remainders such as empty buckets are eligible for export unless configured as fuel themselves.

## Related pages

- [Machines and routes *Protection, storage, and work modes*](/axion/05-machines-routes)
- [Configuration *Access and upgrade settings*](/axion/03-configuration)
{.links-list}
