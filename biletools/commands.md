---
title: "BileTools: Commands and Permissions"
description: "The /bile command tree"
published: true
date: 2026-09-04T00:00:00.000Z
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
| `/bile config` | Open the complete in-game settings and language editor |
| `/biletools debug dump [upload=true]` | Save a diagnostic report, uploading by default |
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
| `bile.use` | `op` | Manage plugins |
| `biletools.config` | `op` | Open the settings editor and change the server language |
| `biletools.debug` | `op` | Save and optionally upload diagnostic reports |
| `biletools.language.self` | `true` | Choose or reset your BileTools language; also requires `volmit.language.self` |
| `volmit.language.self` | `true` | Shared requirement for personal language selection |

`bile.use` covers plugin-management commands. There is no read-only subset or separate node for the destructive `uninstall` subcommand.

## Diagnostic reports

`/biletools debug dump` saves a report under `plugins/BileTools/debug/` and uploads it to mclo.gs by default. Add `upload=false` for a local-only report. Secrets and target passwords are redacted. See [Shared diagnostic reports](/volmlib/api/diagnostics).

## Configuration editor

`/bile config` opens the settings editor. Changes are validated, saved to `biletools.yml`, and applied without a reload. Boolean, numeric, and non-secret list settings can be edited in game.

The receiver secret and password-bearing deployment target list are deliberately read-only in the GUI. Edit those two values directly in `biletools.yml`, then reload BileTools or restart the server; they are never copied into inventory lore or chat prompts.

## Language selection

`/bile language` opens the personal picker in game and the server picker from console. Use `self reset` to return to the server default. If a selected catalog cannot be prepared, BileTools keeps English active.

Personal language selection requires both `biletools.language.self` and `volmit.language.self`, each granted by default (`true`). Denying either permission blocks the personal picker, direct locale selection, and `self reset`. BileTools server selection requires `biletools.config` or `volmit.language.admin` (default `op`).

`/volmit plugins languages [locale]` manages the server default for all enabled Volmit language providers. It keeps personal choices and offers only locales shared by every provider.

`/bile language server edit [locale]` opens the message editor. Editing requires `biletools.config` or `volmit.language.admin` and does not change anyone's selected language. See [Configuration](/biletools/configuration) for file behavior.
