---
title: "Brimstone: Commands and permissions"
description: "Command syntax and access controls"
published: true
date: 2026-11-05T00:00:00.000Z
tags: "brimstone, commands, permissions"
editor: markdown
dateCreated: 2026-10-08T00:00:00.000Z
---

`/brim` is an alias for `/brimstone`. Run either one for help, which lists only the commands you may use and pages through longer lists.

## Commands

| Command | What it does | Run from |
|---|---|---|
| `/brimstone` | Show help | Player or console |
| `/brimstone list` | List configured launcher IDs | Player or console |
| `/brimstone status` | Show the main settings, launcher count, active TNT and secondary effects, compatibility, and integration state | Player or console |
| `/brimstone give <id> <player> [amount]` | Give 1 to 2304 launchers to an online player; items that do not fit drop at their feet | Player or console |
| `/brimstone clear` | Remove owned TNT and secondary effects | Player or console |
| `/brimstone config` | Open the settings editor | Player |
| `/brimstone language` | Open language selection | Player |
| `/brimstone language self [locale\|reset]` | Show or choose your own language, or follow the server default again | Player |
| `/brimstone language server [locale]` | Show or change the server default language | Player or console |
| `/brimstone language server edit [locale]` | Open the translation editor | Player |
| `/brimstone language update` | Check the language repository and merge changes into installed locales | Player or console |
| `/brimstone debug` | Show diagnostic help | Player or console |
| `/brimstone debug dump [upload=false]` | Save a report and optionally request an upload | Player or console |
| `/brimstone debug version` | Show the plugin version | Player or console |
{.dense}

`give` also accepts `amount=<number>`, and language lists accept `page=<number>`. `/brimstone version` is a hidden alias for `debug version`. Uploads need both `debug.uploadEnabled = true` and `upload=true`.

Subcommands may be abbreviated, typed in any case, or slightly misspelled, so `/brimstone clea` runs `clear`. Permissions are checked against the command that actually runs, and tab completion applies the same check.

There is no reload command. Brimstone applies saved changes to `brimstone.toml` and language files on its own; see [file watching](/brimstone/03-configuration#file-watching).

## Shared Volmit commands

VolmLib registers `/volmit plugins [languages|debug|updates]` for tools shared by installed Volmit plugins. See [Languages](/languages) for the language commands they share.

## Permissions

`Everyone` means the node defaults to true, `Operators` means it defaults to op, and `Nobody` means it defaults to false, including for operators.

| Permission | Default | Allows |
|---|---|---|
| `brimstone.command` | Everyone | Help, list, status, and version |
| `brimstone.launch` | Everyone | Launching any launcher the per-type node allows |
| `brimstone.launch.<id>` | Everyone | Launching that launcher |
| `brimstone.craft` | Everyone | Crafting any launcher the per-type node allows |
| `brimstone.craft.<id>` | Everyone | Crafting that launcher |
| `brimstone.give` | Operators | `/brimstone give` |
| `brimstone.clear` | Operators | `/brimstone clear` |
| `brimstone.config` | Operators | Settings editor, server language, translation editor, `language update`, and file-change notices |
| `brimstone.language.self` | Everyone | Personal language selection, and the `/brimstone language` command itself |
| `brimstone.debug` | Operators | Diagnostic reports |
| `brimstone.update` | Operators | Update notices and this plugin's entry in the shared update report |
| `brimstone.bypass.cooldown` | Nobody | Launching without waiting for the cooldown |
| `brimstone.bypass.fuel` | Nobody | Launching without spending fuel |
| `brimstone.bypass.access` | Nobody | Skipping configured world rules and per-type nodes |
| `volmit.language.self` | Everyone | Shared node also required for personal language selection |
| `volmit.language.admin` | Operators | Server language, translation editing, and `language update` across Volmit plugins |
| `volmit.update` | Operators | Update report for all participating Volmit plugins |
{.dense}

Per-type nodes are registered for each configured launcher. Deny one to restrict that launcher while allowing the others.

Every `/brimstone language` subcommand checks `brimstone.language.self` first, so denying it also blocks the server-language commands under that path. `/brimstone debug` opens with either `brimstone.command` or `brimstone.debug`.

`brimstone.bypass.access` does not skip `brimstone.launch`, `brimstone.craft`, or WorldGuard. Skipping fuel still consumes the launcher item.

## Related pages

- [Configuration *Settings the commands change*](/brimstone/03-configuration)
- [Integrations *WorldGuard rules and its bypass*](/brimstone/06-integrations)
- [Languages *Shared language commands*](/languages)
{.links-list}
