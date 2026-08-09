---
title: BileTools — Commands & Permissions
description: BileTools command tree and permission node
published: true
date: 2026-08-09T00:00:00.000Z
tags: biletools, commands
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

BileTools registers the root command `/biletools`, with the aliases `bile`, `bi`, `b`, `volmit`, `vomit`, and `vom`.

Argument notation: `<required>`, `[optional]`.

## Commands

| Command | Description |
|---|---|
| `/bile load <plugin>` | Load a plugin jar from the plugins directory |
| `/bile unload <plugin>` | Unload an installed plugin |
| `/bile reload <plugin>` | Reload an installed plugin |
| `/bile uninstall <plugin>` | Delete a plugin jar from the plugins directory |
| `/bile install <plugin> [version]` | Install a plugin from the Bile library |
| `/bile library [plugin]` | List library plugins or versions for one plugin |

### Parameters

**`/bile load`**

| Parameter | Default | Description |
|---|---|---|
| `plugin` | *required* | Installed plugin name |

**`/bile unload`**

| Parameter | Default | Description |
|---|---|---|
| `plugin` | *required* | Installed plugin name |

**`/bile reload`**

| Parameter | Default | Description |
|---|---|---|
| `plugin` | *required* | Installed plugin name |

**`/bile uninstall`**

| Parameter | Default | Description |
|---|---|---|
| `plugin` | *required* | Installed plugin name |

**`/bile install`**

| Parameter | Default | Description |
|---|---|---|
| `plugin` | *required* | Library plugin name |
| `version` | `latest` | Library plugin version |

**`/bile library`**

| Parameter | Default | Description |
|---|---|---|
| `plugin` | `*` | Library plugin name |


## Permissions

| Node | Default | Description |
|---|---|---|
| `bile.use` | `op` | Gives access to BileTools |

A single node covers the whole command tree. Because BileTools can load, unload, and delete
plugin jars, treat `bile.use` as equivalent to server-operator access and do not grant it broadly.
