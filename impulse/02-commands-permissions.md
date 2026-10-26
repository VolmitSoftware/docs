---
title: "Impulse commands and permissions"
description: "Command syntax and access rules"
published: true
date: 2026-10-23T00:00:00.000Z
tags: "impulse"
editor: markdown
dateCreated: 2026-10-22T00:00:00.000Z
---

Use `/impulse` or `/imp` to open Director help. Help entries follow the sender's permissions.

## Commands

| Command | Purpose | Permission |
| --- | --- | --- |
| `/impulse help` | Show command help | `impulse.command` |
| `/impulse status` | Show loaded machine counts and service state | `impulse.command` |
| `/impulse give <player> <type> [amount] [level]` | Give tagged machines to an online player | `impulse.give` |
| `/impulse config` | Open the configuration editor | `impulse.config` |
| `/impulse trust add <player>` | Let an online player use the targeted machine | `impulse.use` and owner/admin access |
| `/impulse trust remove <player-or-uuid>` | Remove trusted access | `impulse.use` and owner/admin access |
| `/impulse trust list` | List trusted player UUIDs | `impulse.use` and owner/admin access |
| `/impulse transfer <player>` | Offer ownership to a nearby online player | `impulse.use` and owner/admin access |
| `/impulse accept` | Accept a pending ownership offer | `impulse.use` |
| `/impulse language` | Open language help and selection | `impulse.language.self` for personal selection |
| `/impulse debug version` | Show the installed version | `impulse.command` |
| `/impulse version` | Hidden alias for debug version | `impulse.command` |
| `/impulse debug dump [upload=true]` | Save a diagnostic report and optionally upload it | `impulse.debug` |

Machine types are `harvester`, `grinder`, `launcher`, `collector`, `breaker`, `placer`, `shearer`, and `chopper`. Amount defaults to 1 and accepts 1 through 64. Level defaults to 1 and must exist in that machine type's tier configuration. The recipient needs room for the complete gift.

Use `/impulse language server edit <locale>` to edit a server message catalog with `impulse.config`.

## Gameplay permissions

| Permission | Default | Purpose |
| --- | --- | --- |
| `impulse.use` | Everyone | Open machine controls |
| `impulse.place` | Everyone | Place machines |
| `impulse.place.<type>` | Through `impulse.place` | Place a specific machine type |
| `impulse.craft` | Everyone | Grant crafting permissions for all machine types |
| `impulse.craft.<type>` | Through `impulse.craft` | Craft a specific machine type |
| `impulse.upgrade` | Everyone | Grants both upgrade payment permissions |
| `impulse.upgrade.xp` | Through the parent | Buy upgrades with experience levels |
| `impulse.upgrade.economy` | Through the parent | Buy upgrades through Vault |
| `impulse.update` | Operators | Receive update notices |
| `impulse.admin` | Operators | Manage other owners' machines and grant administrator commands |

Owners, trusted players, and administrators can use machine controls. Only owners and administrators can manage trust, offer ownership, or break a machine. [Machine controls](/impulse/05-machines) show only the payment options available to the player.

Up to 16 players can be trusted per machine. A trusted player pays for upgrades with their own experience or money. Trust remains with the placed dispenser; recovered cores do not carry an owner or trusted list.

Ownership offers expire after 30 seconds and require the recipient to run `/impulse accept`. Both players must remain within eight blocks of the machine and, on Folia, in its owning region. A changed, unloaded, or replaced machine invalidates the offer. Accepting clears existing trusted access.
