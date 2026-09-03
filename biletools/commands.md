---
title: "BileTools — Commands & Permissions"
description: "The /bile command tree"
published: true
date: 2026-09-03T07:34:52.375Z
tags: "biletools, commands, permissions"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

## Commands

The root command is `/biletools`. The aliases are `bile`, `bi`, `b`, `vomit`, and `vom`. Notation: `<required>`, `[optional]`.

| Command | Description |
|---|---|
| `/bile language` | Open the clickable language picker |
| `/bile language self <locale\|reset>` | Select or reset your personal BileTools language |
| `/bile language server <locale>` | Change the BileTools server default |
| `/bile language server edit [locale]` | Open the per-language message editor in game |
| `/volmit plugins languages [lang]` | Open the shared picker or change every enabled provider's server default |
| `/biletools debugdump [upload=true]` | Save a diagnostic report, uploading by default |
| `/bile load <plugin>` | Load a plugin jar from the plugins directory |
| `/bile unload <plugin>` | Unload an installed plugin |
| `/bile reload <plugin>` | Reload an installed plugin |
| `/bile uninstall <plugin>` | Delete a plugin jar from the plugins directory |
| `/bile install <plugin> [version]` | Install a plugin from the Bile library |
| `/bile library [plugin]` | List library plugins, or versions for one plugin |

### Parameters

| Command | Parameter | Default | Notes |
|---|---|---|---|
| `load` / `unload` / `reload` / `uninstall` | `plugin` | *required* | Tab-completes from installed plugins |
| `install` | `plugin` | *required* | Tab-completes from the Bile library |
| `install` | `version` | `latest` | Tab-completes from available library versions |
| `library` | `plugin` | `*` | Omit or pass `*` to list everything |
{.dense}

> `/bile uninstall` deletes the jar from disk. If `archive-plugins` is `true`
> (the default), BileTools archives a copy first. This is still a destructive
> filesystem operation.
{.is-warning}

Manual `/bile load|unload|reload` **always bypasses** the `watcher.ignore` and
`watcher.only` filters. Those filters control only automatic watcher reloads.

## Permissions

| Node | Default | Description |
|---|---|---|
| `bile.use` | `op` | Manage plugins and change the BileTools server language |
| `biletools.debugdump` | `op` | Save and optionally upload diagnostic reports |
| `biletools.language.self` | `true` | Choose or reset your BileTools language; also requires `volmit.language.self` |
| `volmit.language.self` | `true` | Shared requirement for personal language selection |

`bile.use` covers plugin-management commands. There is no read-only subset or separate node for the destructive `uninstall` subcommand.

## Diagnostic reports

`/biletools debugdump` saves a diagnostic report and uploads it to the public mclo.gs service by default. Use `/biletools debugdump upload=false` to save it locally without uploading. The command requires `biletools.debugdump` (default `op`), independently of the root administration permission.

Reports are written atomically under the plugin data folder's `debug/` directory before upload. An upload failure retains the local file. Players receive controls to copy the relative report path and open or copy the upload link; console receives plain text. See [Shared diagnostic reports](/volmlib/api/diagnostics) for report contents.

## Language selection

The Bukkit picker uses BileTools's Director menu theme, header, clickable controls, and pagination. Tab completion includes the `self` and `server` scopes, available locales, and personal reset according to the sender's permissions.

`/bile language` opens the personal picker in game and the server picker from console. `/bile language server de_DE` changes the server default; `/bile language self de_DE` sets a personal preference; `/bile language self reset` returns to the default. Missing locale catalogs download before the selection is applied. If a requested download fails, is incomplete, or fails catalog preparation, the selected personal or server scope uses validated built-in English. The selected personal preference or server default is saved as `en_US`. The unavailable locale is never activated or saved, and the command reports that the language is unavailable and English is being used. Invalid command syntax and unlisted locales are rejected without changing the selection.

Personal language selection requires both `biletools.language.self` and `volmit.language.self`, each granted by default (`true`). Denying either permission blocks the personal picker, direct locale selection, and `self reset`. BileTools server selection requires `bile.use` or `volmit.language.admin` (default `op`).

`/volmit plugins languages` opens the picker for every enabled provider's server default; `/volmit plugins languages de_DE` changes those defaults to German. It preserves all personal overrides and offers only locales common to every provider. Access requires `volmit.language.admin` (default `op`) or each enabled plugin's server-language administration permission. If any required permission is denied, no defaults change.

`/bile language server edit` opens the language list; add a locale to open its message editor directly. Editing requires `bile.use` or `volmit.language.admin` and does not change any personal preference or server default. See [Configuration](/biletools/configuration) for override files and editing behavior.
