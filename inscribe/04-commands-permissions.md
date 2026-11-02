---
title: "Inscribe: Commands and permissions"
description: "Commands and access for players and operators"
published: true
date: 2026-11-02T00:00:00.000Z
tags: "inscribe, commands, permissions"
editor: markdown
dateCreated: 2026-10-08T00:00:00.000Z
---

Run `/inscribe` or its alias `/ins` for paginated help. Help and completion show the commands the sender can use.

| Command | Purpose | Permission |
| --- | --- | --- |
| `/inscribe`, `/inscribe help` | Command help | `inscribe.command` |
| `/inscribe config`, `/inscribe settings` | In-game settings editor | `inscribe.config` |
| `/inscribe status` | Settings, prices, open menus, services, and compatibility | `inscribe.command` |
| `/inscribe debug` | Diagnostic command help | `inscribe.command` or `inscribe.debug` |
| `/inscribe debug version`, `/inscribe version` | Installed plugin version | `inscribe.command` |
| `/inscribe debug dump [upload=false]` | Save a report, and upload it only when requested and allowed | `inscribe.debug` |
| `/inscribe language` | Language controls | Personal or administrative language access |
| `/inscribe language self <locale>` | Set your language | `inscribe.language.self` and `volmit.language.self` |
| `/inscribe language self reset` | Follow the server language | Personal language access |
| `/inscribe language server <locale>` | Set the server language | `inscribe.config` or `volmit.language.admin` |
| `/inscribe language server edit [locale]` | Edit messages in game | `inscribe.config` or `volmit.language.admin` |
| `/inscribe language update` | Check the language repository and merge changes into installed translations, at most once every five minutes | `inscribe.config` or `volmit.language.admin` |
| `/volmit plugins updates` | Shared release status and links | `inscribe.update` or `volmit.update` for Inscribe |

`/inscribe version` does not appear in help. Abbreviated or misspelled subcommands, such as `/inscribe conf`, still require the full command's permission.

## Access

| Permission | Default | Grants |
| --- | --- | --- |
| `inscribe.command` | everyone | Help, status, and version |
| `inscribe.extract` | everyone | Extracting enchantments into a book |
| `inscribe.apply` | everyone | Applying enchanted books |
| `inscribe.language.self` | everyone | Choosing a personal language |
| `inscribe.config` | operators | The settings editor, server language, message editing, language updates, and hot reload notices |
| `inscribe.debug` | operators | Diagnostic reports and uploads |
| `inscribe.update` | operators | Shared update notices and the update report |
| `inscribe.*` | operators | Every permission above |

The inventory editors require a player. The console can use server-language selection, status, version, diagnostics, and shared update reports. `/volmit plugins languages` provides suite language controls.

## Related pages

- [Languages and editors *Translations and message editing*](/inscribe/05-languages-editors)
- [Integrations and diagnostics *Reports and release notices*](/inscribe/06-integrations-diagnostics)
{.links-list}
