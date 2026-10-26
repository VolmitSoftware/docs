---
title: "Temper: Commands and permissions"
description: "Player repairs and operator commands"
published: true
date: 2026-10-24T00:00:00.000Z
tags: "temper, commands"
editor: markdown
dateCreated: 2026-10-15T00:00:00.000Z
---

Use `/temper` or `/tem`. Director help lists commands and parameters; the hidden `/temper version` alias produces the same version output as `/temper debug version`.

## Commands

| Command | What it does | Run from |
|---|---|---|
| `/temper` | Show help | Player or console |
| `/temper repair` | Open the repair menu | Player |
| `/temper quote [slot] [percent]` | Preview hand, numbered slot, inventory, armor, or all repairs; defaults to hand and 100 | Player |
| `/temper confirm` | Apply the current quote | Player |
| `/temper cancel` | Discard the current quote | Player |
| `/temper mode <xp\|money\|items>` | Choose payment method | Player |
| `/temper kit give <id> [target] [amount]` | Give kits; defaults to self and one | Player or console with a target |
| `/temper kit use [slot]` | Preview an offhand-kit repair; defaults to hand | Player |
| `/temper station give [target] [amount]` | Give station anvils; defaults to self and one | Player or console with a target |
| `/temper station edit` | Edit access and visual settings on the station being looked at | Player |
| `/temper station access <public\|private>` | Set access on the station being looked at | Player |
| `/temper ledger list [page]` | List money transactions | Player or console |
| `/temper ledger resolve <id>` | Acknowledge a reviewed transaction | Player or console |
| `/temper config` | Open the settings editor | Player |
| `/temper language` | Choose or edit language | Player or console |
| `/temper status` | Show runtime information | Player or console |
| `/temper debug` | Show diagnostic help | Player or console |
| `/temper debug version` | Show plugin version | Player or console |
| `/temper debug dump [upload]` | Create a report; upload also requires the config toggle | Player or console |
{.dense}

Configuration and installed language files hot-reload. There is no manual reload command. Shared language, update, and diagnostic menus are available under `/volmit plugins` through VolmLib.

## Permissions

Everyone means `true`; Operators means `op`.

| Permission | Default | Allows |
|---|---|---|
| `temper.command` | Everyone | Help, status, and version |
| `temper.language.self` | Everyone | Personal language selection |
| `temper.use` | Everyone | Repair menu and quotes |
| `temper.mode.xp` | Everyone | XP payment |
| `temper.mode.money` | Everyone | Vault money payment |
| `temper.mode.items` | Everyone | Material payment |
| `temper.repair.bulk` | Everyone | Bulk inventory repair |
| `temper.repair.armor` | Everyone | Armor and all-equipment batches |
| `temper.kit.use` | Everyone | Default kit use; kits may require another permission |
| `temper.kit.give` | Operators | Issue repair kits |
| `temper.station.place` | Operators | Place registered stations |
| `temper.station.give` | Operators | Issue station anvils |
| `temper.station.manage` | Everyone | Manage owned station access and visual settings |
| `temper.station.admin` | Operators | Override station ownership checks |
| `temper.config` | Operators | Settings and server language editing |
| `temper.debug` | Operators | Diagnostic dumps |
| `temper.update` | Operators | Update notices |
| `temper.ledger` | Operators | Inspect and resolve money transactions |
| `temper.admin` | Operators | Listed administration permissions |

## Related pages

- [Languages *Shared language commands*](/languages)
- [Repairs and pricing *What confirmation changes*](/temper/05-repairs-pricing)
- [Diagnostics *Uploads and transaction review*](/temper/08-diagnostics)
{.links-list}
