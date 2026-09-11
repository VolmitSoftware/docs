---
title: "HiddenOre: Commands and Permissions"
description: "The /hiddenore command tree and permission nodes"
published: true
date: 2026-09-11T01:30:00.000Z
tags: "hiddenore, commands, permissions"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

## Commands

| Command | Description |
|---|---|
| `/hiddenore config` | Open the in-game configuration editor |
| `/hiddenore language` | Open the clickable language picker |
| `/hiddenore language self <locale\|reset>` | Select or reset your personal HiddenOre language |
| `/hiddenore language server <locale>` | Change the HiddenOre server default |
| `/hiddenore language server edit [locale]` | Open the per-language message editor in game |
| `/volmit plugins languages [lang]` | Open the shared picker or change every enabled provider's server default |
| `/hiddenore debug dump [upload=true]` | Save a diagnostic report, uploading by default |
| `/hiddenore debug mode` | Toggle ore debug mode for yourself |
| `/hiddenore debug version` | Show `HiddenOre v<version>` using the help title gradient |

`config` and `debug mode` require `hiddenore.admin`. Personal language selection requires both `hiddenore.language.self` and `volmit.language.self`, each granted by default (`true`). Denying either permission blocks the personal picker, direct locale selection, and `self reset`.

## Permissions

Version is listed under `/hiddenore debug` in help. `/hiddenore version` provides the same output and is hidden from help and completion. Both paths require `hiddenore.admin` and work for players and console without a message prefix.

| Node | Default | Description |
|---|---|---|
| `hiddenore.admin` | `op` | Edit configuration, toggle debug, show the version, and change the server language |
| `hiddenore.debugdump` | `op` | Save and optionally upload diagnostic reports |
| `hiddenore.language.self` | `true` | Choose or reset your HiddenOre language; also requires `volmit.language.self` |
| `volmit.language.self` | `true` | Shared requirement for personal language selection |

## Notes

Save `hiddenore.toml` or a `languages/<locale>.toml` file to apply changes automatically. See [Configuration](/hiddenore/configuration) for update timing, validation, and message formatting.

Configuration updates do not migrate world data. In `seeded` mode, reordering `[[drops]]` tables keeps
layouts stable. Adding or removing unrelated rules preserves each retained
rule's layout except at direct overlaps. Changing an item rule's material or
spatial generation fields gives that rule a new undiscovered layout. Changing
only Fortune, tool tiers, or experience does not.

`debug mode` is player-only and applies only to the player who runs it.

## Configuration editor

`/hiddenore config` is player-only. Browse nested tables and drop rules, click booleans to toggle them, and edit text, numbers, or primitive lists through private chat. Use `cancel` or wait 60 seconds to cancel input. Saves preserve surrounding comments and formatting, reject invalid or stale edits, and apply through the automatic file watcher. See [Configuration](/hiddenore/configuration) for editor scope and list syntax.

## Diagnostic reports

`/hiddenore debug dump` saves a report under `plugins/HiddenOre/debug/` and uploads it to mclo.gs by default. Add `upload=false` for a local-only report. See [Shared diagnostic reports](/volmlib/api/diagnostics).

## Language selection

`/hiddenore language` opens the personal picker in game and the server picker from console. Use `self reset` to return to the server default. If a selected catalog cannot be prepared, HiddenOre displays English and keeps the requested language choice saved.

HiddenOre server selection requires `hiddenore.admin` or `volmit.language.admin` (default `op`).

Changing the server default preserves comments and surrounding formatting in `hiddenore.toml`.

`/volmit plugins languages [locale]` manages the server default for all enabled Volmit language providers. It keeps personal choices and offers only locales shared by every provider.

`/hiddenore language server edit [locale]` opens the message editor. Editing requires `hiddenore.admin` or `volmit.language.admin` and does not change anyone's selected language. See [Configuration](/hiddenore/configuration) for file behavior.
