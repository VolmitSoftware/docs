---
title: "Rift: Commands and Permissions"
description: "Command syntax, aliases, and permission nodes"
published: true
date: 2026-10-21T00:00:00.000Z
tags: "rift, commands, permissions, help"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Use `/rift` or `/rft`. The Director help menu shows command descriptions and argument completion. Supply optional arguments as `argument=value`, such as `/rift debug dump upload=false`.

Rift accepts abbreviated and slightly misspelled subcommands, such as `/rift delet lobby`. The permission checked is always that of the command the input runs, and tab completion suggests commands and arguments only for commands you have permission to use.

## World commands

| Command | Permission | Effect |
|---|---|---|
| `/rift create <name> [environment] [generator] [seed] [type]` | `rift.create` | Create, load, and manage a world |
| `/rift import <name> [generator] [auto-load]` | `rift.import` | Manage existing storage, loading it if necessary |
| `/rift load <name> [generator]` | `rift.load` | Load a managed or discovered world |
| `/rift unload <name> [save]` | `rift.unload` | Evacuate players and unload; save defaults to true |
| `/rift delete <name>` | `rift.delete` | Confirm twice, then quarantine a managed world |
| `/rift restore <id>` | `rift.restore` | Restore quarantined storage and its profile without loading |
| `/rift unmanage <name>` | `rift.unmanage` | Retire a profile without unloading or moving the world |
| `/rift tp <world>` | `rift.teleport` | Teleport yourself to a loaded world's spawn |
| `/rift send <player> <world>` | `rift.teleport.others` | Teleport an online player to a loaded world's spawn |
| `/rift autoload <name> <enabled>` | `rift.config` | Set a profile's startup flag |
| `/rift protect <name> <enabled>` | `rift.config` | Set a profile's protection flag |

`teleport` is an alias for `tp`. World names use letters, numbers, dots, dashes, and underscores; full namespaced keys are not command-name substitutes.

### Creation options

| Argument | Default | Values |
|---|---|---|
| `environment` | `NORMAL` | Bukkit world environment |
| `generator` | `vanilla` | `vanilla`, `void`, or `PluginName[:generator-id]` |
| `seed` | `random` | `random` or a signed 64-bit integer |
| `type` | `NORMAL` | Bukkit world type |

```none
/rift create resource
/rift create flat_build seed=12345 type=FLAT
/rift create empty_build generator=void
/rift import resource auto-load=false
```

The void generator uses `THE_VOID` biomes and a small bedrock spawn platform. External generators must be enabled when creating, importing, or loading their worlds. Import's `auto-load` argument defaults to true.

## Inspection and settings

| Command | Permission | Effect |
|---|---|---|
| `/rift list [page] [tag] [group]` | `rift.list` | Browse known worlds and quarantine |
| `/rift info <name>` | `rift.info` | Inspect one world |
| `/rift check <name> [page]` | `rift.check` | Run read-only readiness checks |
| `/rift check-all [page] [tag] [group]` | `rift.check` | Check matching worlds |
| `/rift status` | `rift.status` | Show platform, storage, language, and counts |
| `/rift generators [page]` | `rift.generators` | Show world types and configured generators |
| `/rift config` | `rift.config` | Open the 54-slot settings editor |
| `/rift policy edit [name]` | `rift.policy` | Open the 54-slot world-policy editor |
| `/rift policy show <name>` | `rift.policy` | Inspect a saved policy profile |

Pages default to 1, tags to `all`, and grouping to false. For example, `/rift check-all tag=resource group=true` checks worlds carrying that tag. `editor` is an alias for `config`. There is no reload command; valid file changes hot-load.

See [World policies](/rift/05-world-policies) for the policy mutation commands.

## Languages and diagnostics

| Command | Permission | Effect |
|---|---|---|
| `/rift language` | Depends on selected action | Open the language menu |
| `/rift language self [locale\|reset]` | `volmit.language.self` and `rift.language.self` | Choose or reset a personal locale |
| `/rift language server [locale]` | `volmit.language.admin` or `rift.config` | Choose the server default |
| `/rift language server edit [locale]` | `volmit.language.admin` or `rift.config` | Edit message text |
| `/rift debug` | None | Open diagnostic help |
| `/rift debug version` | `rift.command` | Show the plugin version |
| `/rift debug dump [upload]` | `rift.debug` | Save a report; upload defaults to true |

`/rift version` is a hidden alias for `/rift debug version`. Reports are saved under `plugins/Rift/debug/`. Public upload requires both `debugUploadEnabled=true` and the command's upload argument; use `/rift debug dump upload=false` for a local-only report.

Shared menus are available through `/volmit plugins languages`, `/volmit plugins debug`, and `/volmit plugins updates`.

## Permission defaults

`rift.command` and personal-language permissions default to everyone. Operational permissions default to operators. `rift.admin` grants Rift's administrative commands and access bypass; `rift.access.bypass` bypasses world-entry requirements.

`rift.limit.bypass` bypasses world player limits. `rift.travel.bypass` bypasses cross-world entry and departure restrictions. These two permissions default to false, including for operators, and are not children of `rift.admin`. Neither grants the other or bypasses world-access permissions.

`rift.update` permits Rift update notices and its shared report entry. `volmit.update` permits the combined update report. Update checks notify only; they do not install a jar.

Next: [Storage and operations](/rift/03-storage-operations)
