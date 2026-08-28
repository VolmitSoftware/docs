---
title: "Rift — Commands & Permissions"
description: "Rift command syntax, help behavior, aliases, and granular permission nodes"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "rift, commands, permissions, help"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Rift registers `/rift` through `plugin.yml` and routes the single `/rft` alias through the same executor and permission checks. The VolmLib Director command runtime supplies typed parsing, contextual help, and tab completion.

## Commands

Arguments in brackets have defaults.

| Command | Permission | Effect |
|---|---|---|
| `/rift help` | `rift.command` | Show the contextual help menu |
| `/rift create <name> [environment] [generator] [seed] [type]` | `rift.create` | Create, load, and manage a new world |
| `/rift import <name> [generator] [auto-load]` | `rift.import` | Validate an existing world directory, load it, and create a profile |
| `/rift load <name>` | `rift.load` | Load a managed or discovered world |
| `/rift unload <name> [save]` | `rift.unload` | Evacuate players, save if requested, and unload |
| `/rift delete <name>` | `rift.delete` | Confirm twice, then move a managed world into quarantine |
| `/rift restore <id>` | `rift.restore` | Restore a quarantined directory and managed profile |
| `/rift to <world>` | `rift.teleport` | Teleport the executing player to world spawn |
| `/rift send <player> <world>` | `rift.teleport.others` | Teleport another online player to world spawn |
| `/rift list` | `rift.list` | List loaded, managed, discovered, and quarantined worlds |
| `/rift info <name>` | `rift.info` | Show detailed state for one world |
| `/rift generators` | `rift.generators` | Show Bukkit world types and configured generator identifiers |
| `/rift reload` | `rift.reload` | Reload config, language, profiles, and trash manifests |
| `/rift config` | `rift.config` | Open the in-game configuration editor |
| `/rift doctor` | `rift.doctor` | Report platform, Java, paths, locale, and world counts |
| `/rift autoload <name> <enabled>` | `rift.config` | Change a managed profile's startup auto-load flag |
| `/rift protect <name> <enabled>` | `rift.config` | Change a managed profile's protection flag |

Aliases include `teleport` for `to`, `editor` for `config`, and `status` for `doctor`.

## Create arguments

| Argument | Default | Values |
|---|---|---|
| `environment` | `NORMAL` | Bukkit `World.Environment` value |
| `generator` | `vanilla` | `vanilla` or `PluginName[:generator-id]` |
| `seed` | `random` | `random` or a signed 64-bit integer |
| `type` | `NORMAL` | Bukkit `WorldType` value |

Examples:

```text
/rift create resource
/rift create flat_build NORMAL vanilla 12345 FLAT
/rift create iris_world NORMAL Iris:overworld 8675309 NORMAL
/rift import old_world vanilla true
```

A custom generator's owner plugin must already be enabled. Rift validates the owner portion before asking Bukkit to create or import the world.

## Permission defaults

`rift.command` defaults to everyone so explicitly granted subcommand nodes are usable. Every operational node and `rift.admin` defaults to operators. `rift.admin` grants all Rift capabilities.

The command service checks the requested path before Director executes it, and each handler repeats its capability check. Aliases do not register a second command path and cannot bypass the root executor.

Next: [Storage & Operations](/rift/03-storage-operations)
