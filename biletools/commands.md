---
title: BileTools — Commands & Permissions
description: The /bile command tree
published: true
date: 2026-08-09T00:00:00.000Z
tags: biletools, commands, permissions
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

## Commands

Root command `/biletools`, aliases `bile`, `bi`, `b`, `volmit`, `vomit`, `vom`.
Notation: `<required>`, `[optional]`.

| Command | Description |
|---|---|
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

> `/bile uninstall` deletes the jar from disk. With `archive-plugins: true` (the default) a
> copy is archived first, but this is still a destructive filesystem operation.
{.is-warning}

Manual `/bile load|unload|reload` **always bypasses** the `watcher.ignore` and `watcher.only`
filters. Those only govern automatic watcher-driven reloads.

## Permissions

| Node | Default | Description |
|---|---|---|
| `bile.use` | `op` | Gives access to BileTools |

One node covers the entire command tree. There is no read-only subset, and no separate node
for the destructive `uninstall` subcommand.
