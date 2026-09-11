---
title: "GamemodeSwitcher: Commands and permissions"
description: "Command syntax, player controls, and operator permissions"
published: true
date: 2026-09-11T01:30:00.000Z
tags: "gamemodeswitcher, commands, permissions"
editor: markdown
dateCreated: 2026-09-10T18:30:00.000Z
---

`/gsw` aliases `/gamemodeswitcher`. The root command opens localized Director help; commands support tab completion. Mode changes affect the invoking player only.

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

`/gsw set mode=creative` and positional boolean values such as `/gsw toggle false` also work. Omitting the debug upload argument requests an upload by default; use `upload=false` to save only locally. Console users can use help, status, language administration, and diagnostics; player controls require a player. Settings and installed language files apply changes automatically; use `/gsw status` to inspect the active settings.

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

A player needs both `gamemodeswitcher.use` and permission for the destination mode. The menu displays unavailable destinations and checks permissions again when clicked. Global disable, world restrictions, and successful-change cooldowns also apply to commands and the selector.

The selector uses the same 54-slot filled frame as the configuration editor. Its four gamemodes occupy one row, with the current mode marked by a check and a Selected label. Gesture, language, and configuration controls form a second row; the configuration control appears only with its permission. Close stays in the bottom-right corner. Configuration and translation-editor Back controls return through their parent menus.

Version is listed under `/gsw debug` in help. `/gsw version` and `/gamemodeswitcher version` provide the same output and are hidden from help and completion. Both paths require `gamemodeswitcher.command` and work for players and console without a message prefix.

[Installation and configuration](/gamemodeswitcher/01-installation-configuration) · [Gestures and operations](/gamemodeswitcher/03-gestures-operations)
