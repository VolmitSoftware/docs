---
title: "HiddenOre — Commands & Permissions"
description: "The /hiddenore command tree and permission nodes"
published: true
date: 2026-09-03T07:34:52.375Z
tags: "hiddenore, commands, permissions"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

## Commands

| Command | Description |
|---|---|
| `/hiddenore language` | Open the clickable language picker |
| `/hiddenore language self <locale\|reset>` | Select or reset your personal HiddenOre language |
| `/hiddenore language server <locale>` | Change the HiddenOre server default |
| `/hiddenore language server edit [locale]` | Open the per-language message editor in game |
| `/volmit plugins languages [lang]` | Open the shared picker or change every enabled provider's server default |
| `/hiddenore debugdump [upload=true]` | Save a diagnostic report, uploading by default |
| `/hiddenore reload` | Reload HiddenOre configuration and language files |
| `/hiddenore debug` | Toggle ore debug mode for yourself |

`reload` and `debug` require `hiddenore.admin`. Personal language selection requires both `hiddenore.language.self` and `volmit.language.self`, each granted by default (`true`). Denying either permission blocks the personal picker, direct locale selection, and `self reset`.

## Permissions

| Node | Default | Description |
|---|---|---|
| `hiddenore.admin` | `op` | Reload HiddenOre, toggle debug, and change the server language |
| `hiddenore.debugdump` | `op` | Save and optionally upload diagnostic reports |
| `hiddenore.language.self` | `true` | Choose or reset your HiddenOre language; also requires `volmit.language.self` |
| `volmit.language.self` | `true` | Shared requirement for personal language selection |

## Notes

**`reload`** reads `hiddenore.yml` and the language files again. It rebuilds the
runtime configuration. If the reload throws, HiddenOre logs the failure.
HiddenOre keeps the previous runtime configuration. It does not leave the server
half-applied.

Reload does not migrate world data. In `seeded` mode, reordering `drops:` keeps
layouts stable. Adding or removing unrelated rules preserves each retained
rule's layout except at direct overlaps. Changing an item rule's material or
spatial generation fields gives that rule a new undiscovered layout. Changing
only Fortune, tool tiers, or experience does not.

**`debug`** is per-player and player-only. You cannot toggle it from console.

## Diagnostic reports

`/hiddenore debugdump` saves a diagnostic report and uploads it to the public mclo.gs service by default. Use `/hiddenore debugdump upload=false` to save it locally without uploading. The command requires `hiddenore.debugdump` (default `op`), independently of the root administration permission.

Reports are written atomically under the plugin data folder's `debug/` directory before upload. An upload failure retains the local file. Players receive controls to copy the relative report path and open or copy the upload link; console receives plain text. See [Shared diagnostic reports](/volmlib/api/diagnostics) for report contents.

## Language selection

The Bukkit picker uses HiddenOre's Director menu theme, header, clickable controls, and pagination. Tab completion includes the `self` and `server` scopes, available locales, and personal reset according to the sender's permissions.

`/hiddenore language` opens the personal picker in game and the server picker from console. `/hiddenore language server de_DE` changes the server default; `/hiddenore language self de_DE` sets a personal preference; `/hiddenore language self reset` returns to the default. Missing locale catalogs download before the selection is applied. If a requested download fails, is incomplete, or fails catalog preparation, the selected personal or server scope uses validated built-in English. The selected personal preference or server default is saved as `en_US`. The unavailable locale is never activated or saved, and the command reports that the language is unavailable and English is being used. Invalid command syntax and unlisted locales are rejected without changing the selection.

HiddenOre server selection requires `hiddenore.admin` or `volmit.language.admin` (default `op`).

`/volmit plugins languages` opens the picker for every enabled provider's server default; `/volmit plugins languages de_DE` changes those defaults to German. It preserves all personal overrides and offers only locales common to every provider. Access requires `volmit.language.admin` (default `op`) or each enabled plugin's server-language administration permission. If any required permission is denied, no defaults change.

`/hiddenore language server edit` opens the language list; add a locale to open its message editor directly. Editing requires `hiddenore.admin` or `volmit.language.admin` and does not change any personal preference or server default. See [Configuration](/hiddenore/configuration) for override files and editing behavior.
