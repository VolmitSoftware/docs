---
title: "GamemodeSwitcher: Commands and permissions"
description: "Command syntax, player controls, and operator permissions"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "gamemodeswitcher, commands, permissions"
editor: markdown
dateCreated: 2026-09-10T18:30:00.000Z
---

`/gsw` aliases `/gamemodeswitcher`. The root command opens help. A mode change only ever affects the player who ran it.

| Command | Behavior |
| --- | --- |
| `/gsw` | Command help |
| `/gsw status` | Active settings, scheduler, personal gesture state, and current mode |
| `/gsw menu` | Gamemode selector with gesture toggle, language, and configuration shortcuts |
| `/gsw set <mode>` | Select `survival`, `creative`, `adventure`, or `spectator` |
| `/gsw toggle` | Reverse the personal gesture setting |
| `/gsw toggle enabled=false` | Disable gestures while keeping commands and the selector usable |
| `/gsw toggle enabled=true` | Enable gestures |
| `/gsw config` | Complete shared TOML configuration editor |
| `/gsw language` | Shared personal/server language picker |
| `/gsw language self <locale>` | Choose a personal locale |
| `/gsw language self reset` | Clear the personal override and use the server default |
| `/gsw language server <locale>` | Select the server default language |
| `/gsw language server edit <locale>` | Edit a catalog in-game |
| `/gsw debug dump upload=false` | Save a local diagnostic report |
| `/gsw debug version` | Show `GamemodeSwitcher v<version>` using the help title gradient |
| `/gsw debug dump upload=true` | Save a report and request upload if server configuration permits it |

`/gsw set mode=creative` and positional values such as `/gsw toggle false` also work. `/gsw version` is the same as `/gsw debug version` but hidden from help. Console can use help, status, language administration, and diagnostics; the rest needs a player.

| Permission | Default | Allows |
| --- | --- | --- |
| `gamemodeswitcher.command` | Everyone | Help, status, and version |
| `gamemodeswitcher.use` | Operators | Gestures, the selector, and personal mode/toggle controls |
| `gamemodeswitcher.mode.survival` | Operators | Enter survival |
| `gamemodeswitcher.mode.creative` | Operators | Enter creative |
| `gamemodeswitcher.mode.adventure` | Operators | Enter adventure |
| `gamemodeswitcher.mode.spectator` | Operators | Enter spectator |
| `gamemodeswitcher.mode.*` | Operators | All four mode permissions |
| `gamemodeswitcher.config` | Operators | Configuration, server language selection, translation editor |
| `gamemodeswitcher.language.self` | Everyone | Personal language selection |
| `volmit.language.self` | Everyone | Shared permission also required for personal language selection |
| `volmit.language.admin` | Operators | Server language selection and editing across suite plugins |
| `gamemodeswitcher.debug` | Operators | Diagnostic reports |

A player needs both `gamemodeswitcher.use` and permission for the destination mode. The selector shows destinations you cannot use and rechecks permission when you click.

`general.enabled`, `restrictions.disabled-worlds`, and `gestures.cooldown-millis` apply to commands and the selector too, not just gestures.

See [Languages](/languages) for the language commands and their permissions.

[Installation and configuration](/gamemodeswitcher/01-installation-configuration) · [Gestures and operations](/gamemodeswitcher/03-gestures-operations)
