---
title: "Sigil: Commands and permissions"
description: "Player, editor and operator commands"
published: true
date: 2026-10-28T00:00:00.000Z
tags: "sigil, commands, permissions"
editor: markdown
dateCreated: 2026-10-15T00:00:00.000Z
---

Run `/sigil` for paginated help. `/sg` and `/vouchers` are aliases. Help and command completion show commands you have permission to use. Examples below use named parameters; replace values in angle brackets before running them.

## Player commands

| Command | Purpose |
|---|---|
| `/sigil list page=1` | List definitions and open their previews |
| `/sigil preview voucher=<id>` | View rewards without claiming them |
| `/sigil redeem` | Redeem the voucher in the main hand |
| `/sigil inspect` | Show the held voucher's serial, issue time, expiry and binding |
| `/sigil language` | Open the personal language selector |

Voucher commands require `sigil.use`, granted by default. Preview, redeem, inspect and language selection require a player.

## Editing and issuance

| Command | Permission | Purpose |
|---|---|---|
| `/sigil config` | `sigil.config` | Open the in-game editor |
| `/sigil create voucher=<id>` | `sigil.config` | Create a disabled definition |
| `/sigil clone source=<id> target=<new-id>` | `sigil.config` | Clone a definition, initially disabled |
| `/sigil capture voucher=<id>` | `sigil.config` | Append the held item as a reward |
| `/sigil edit target=<id-or-config> field=<path> value=<value>` | `sigil.config` | Change a validated field |
| `/sigil delete voucher=<id> confirm=true` | `sigil.config` | Delete a definition |
| `/sigil give player=<name> voucher=<id> amount=1` | `sigil.give` | Issue physical vouchers to an online player |
| `/sigil giveall voucher=<id> amount=1` | `sigil.give` | Issue vouchers to online players |
| `/sigil force player=<name> voucher=<id>` | `sigil.force` | Start a reward claim without a held voucher |
| `/sigil forceall voucher=<id>` | `sigil.force` | Start claims for online players |

`config` and `capture` require a player. Giving to an offline player is unsupported. The GUI reload button and automatic file reload apply settings; there is no standalone `/sigil reload` command.

Within `/sigil config`, **Voucher appearance** edits the voucher item and **Edit rewards** manages reward steps and weighted groups. Both require `sigil.config`. Use **Use held item appearance** for the voucher's appearance template; `/sigil capture` appends the held item as a guaranteed reward. The reward editor's capture control adds a draft to the selected guaranteed list or group. See [configuration](/sigil/02-installation-configuration) for the full workflow.

## Operations

| Command | Permission | Purpose |
|---|---|---|
| `/sigil status` | `sigil.audit` | Show definitions, scheduling and journal counts |
| `/sigil history target=<voucher-id-or-player> page=1` | `sigil.audit` | Read recent history; a player can be an online name or UUID |
| `/sigil revoke serial=<uuid>` | `sigil.audit` | Revoke an issued voucher |
| `/sigil recover` | `sigil.audit` | List unresolved deliveries |
| `/sigil recover redemption=<uuid>` | `sigil.audit` | Inspect one delivery and its actions |
| `/sigil recover redemption=<uuid> resolution=<outcome>` | `sigil.audit` | Record an operator resolution; see [recovery](/sigil/05-operations#interrupted-deliveries) |
| `/sigil debug version` | `sigil.debug` | Show the installed version |
| `/sigil version` | `sigil.debug` | Hidden alias of `debug version` |
| `/sigil debug dump upload=false` | `sigil.debug` | Save a local diagnostic report |

`sigil.admin` grants the configuration, issuance, force, audit, debug and update-notice permissions. Each administrative permission defaults to operators. Additional voucher-specific permissions are configured per definition. `sigil.update` controls shared update notices and report visibility; see [integrations](/sigil/04-languages-integrations).

[Back to Sigil](/sigil)
