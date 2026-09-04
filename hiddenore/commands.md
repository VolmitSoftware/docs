---
title: "HiddenOre: Commands and Permissions"
description: "The /hiddenore command tree and permission nodes"
published: true
date: 2026-09-04T00:00:00.000Z
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

`reload` reads `hiddenore.yml` and the language files again. If validation fails, HiddenOre logs the error and keeps the previous settings.

Reload does not migrate world data. In `seeded` mode, reordering `drops:` keeps
layouts stable. Adding or removing unrelated rules preserves each retained
rule's layout except at direct overlaps. Changing an item rule's material or
spatial generation fields gives that rule a new undiscovered layout. Changing
only Fortune, tool tiers, or experience does not.

`debug` is player-only and applies only to the player who runs it.

## Diagnostic reports

`/hiddenore debugdump` saves a report under `plugins/HiddenOre/debug/` and uploads it to mclo.gs by default. Add `upload=false` for a local-only report. See [Shared diagnostic reports](/volmlib/api/diagnostics).

## Language selection

`/hiddenore language` opens the personal picker in game and the server picker from console. Use `self reset` to return to the server default. If a selected catalog cannot be prepared, HiddenOre keeps English active.

HiddenOre server selection requires `hiddenore.admin` or `volmit.language.admin` (default `op`).

`/volmit plugins languages [locale]` manages the server default for all enabled Volmit language providers. It keeps personal choices and offers only locales shared by every provider.

`/hiddenore language server edit [locale]` opens the message editor. Editing requires `hiddenore.admin` or `volmit.language.admin` and does not change anyone's selected language. See [Configuration](/hiddenore/configuration) for file behavior.
