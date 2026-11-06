---
title: "Bastion: Capabilities"
description: "Claiming, protection, property, and administration controls"
published: true
date: 2026-11-06T00:00:00.000Z
tags: bastion, features
editor: markdown
dateCreated: 2026-10-10T11:07:00.000Z
---

Bastion protects land claims that cover the full world height. Each X/Z column costs one claim block, whatever its height, and players manage their land through inventory menus.

| Area | Available controls |
| --- | --- |
| Claiming | Rectangle, chunk and circle selections with previews; reviewed creation, expansion and release; automatic chunk claiming while moving |
| Allowances | Claim-block allowances, claim blocks earned during play, Vault purchases, administrator adjustments and a balance ledger |
| Claim changes | Rename, reviewed ownership transfer, adjacent merges and splits of disconnected land |
| Trust | Custom roles, invitations, temporary membership, bans and entry locks |
| Protection | Building, containers, interaction, combat, environment, spawning, travel and item rules, with world and wilderness defaults, permission conditions and `/bastion why` explanations |
| Child plots | Separate trust and protection, sales, fixed-term rentals, renewals, refundable deposits and resale |
| Power | Size-based upkeep, remaining-time estimates, low-power warnings, item fuel, economy purchases and barrel anchors with optional hopper refueling |
| Travel | Saved homes with safe-landing checks, an escape command for trapped players, and claim flight where the platform supports it |
| Communication | Welcome messages, a saved notification inbox, a public directory with owner-approved visits, and claim icons |
| Maps | Nearby claim map, boundary display, inspection, and optional Dynmap and BlueMap layers |
| Server land | Staff-owned claims and plots with their own protection and optional game-mode zones |
| Administration | Hot-reloadable TOML, configuration and policy editors, claim activity history, `/bastion status` and local debug reports |
| Languages | Built-in English, 17 repository translations, custom locales and personal language choices |
| Integrations | PlaceholderAPI, WorldGuard admission checks, Vault payments, claim lifecycle events and protection-rule extensions |
| Releases and metrics | GitHub release notices and bStats service `34917`, both off by default |

## Limits

- Claims with no power stay owned and protected. With upkeep enabled, they cannot expand. Upkeep is off by default.
- Vault payments, claim flight and Dynmap publication are unavailable on region-threaded servers such as Folia and Canvas.
- Child plots can be sold and rented. Whole claims can be transferred but not sold.
- Server land charges no player allowance and pays no upkeep. It cannot be sold, rented, merged, split, fueled or given an anchor.
- Claim activity records claim changes, not individual block edits, and does not roll back blocks.
- The public directory lists only claims their owners publish. Approving a visit does not grant trust.

## Related pages

- [Protection settings *Rules, defaults and inheritance*](/bastion/04-protection-settings)
- [Commands and permissions *Player and staff access*](/bastion/02-commands)
- [Java integration *Snapshots, lifecycle events and protection rules*](/bastion/09-api)
{.links-list}
