---
title: "Rift: Commands and Permissions"
description: "Rift command syntax, help behavior, aliases, and granular permission nodes"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "rift, commands, permissions, help"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Use `/rift` or `/rft`. Run `/rift help` for syntax and completion.

## Commands

Arguments in brackets have defaults.

| Command | Permission | Effect |
|---|---|---|
| `/rift help` | `rift.command` | Show the contextual help menu |
| `/rift create <name> [environment] [generator] [seed] [type]` | `rift.create` | Create, load, and manage a new world |
| `/rift import <name> [generator] [auto-load]` | `rift.import` | Validate an existing world directory, load it, and create a profile |
| `/rift load <name> [generator]` | `rift.load` | Load a managed or discovered world; the optional generator applies to unmanaged worlds |
| `/rift unload <name> [save]` | `rift.unload` | Evacuate players, save if requested, and unload |
| `/rift delete <name>` | `rift.delete` | Confirm twice, then move a managed world into quarantine |
| `/rift restore <id>` | `rift.restore` | Restore a quarantined directory and managed profile |
| `/rift tp <world>` | `rift.teleport` | Teleport the executing player to world spawn |
| `/rift send <player> <world>` | `rift.teleport.others` | Teleport another online player to world spawn |
| `/rift list [page]` | `rift.list` | Browse loaded, managed, discovered, and quarantined worlds in a paged Director menu |
| `/rift info <name>` | `rift.info` | Show detailed state for one world |
| `/rift generators [page]` | `rift.generators` | Browse Bukkit world types and configured generator identifiers in a paged Director menu |
| `/rift config` | `rift.config` | Open the in-game configuration editor |
| `/rift language` | Scope-dependent | Open the personal, server-default, reset, and message-editor menu |
| `/rift language self [locale\|reset]` | `volmit.language.self` and `rift.language.self` | List or select a personal locale without changing the server default, or clear that preference |
| `/rift language server [locale]` | `volmit.language.admin` or `rift.config` | List or select the server-default locale |
| `/rift language server edit [locale]` | `volmit.language.admin` or `rift.config` | Open the in-game message editor, optionally at one locale |
| `/rift status` | `rift.status` | Show platform, Java, paths, locale, and world counts in a Director menu |
| `/rift debug` | None | Open the diagnostic-tools help page |
| `/rift debug dump [upload]` | `rift.debug` | Save a detailed report; `upload` defaults to `true` and may be set to `false` for this run |
| `/rift autoload <name> <enabled>` | `rift.config` | Change a managed profile's startup auto-load flag |
| `/rift protect <name> <enabled>` | `rift.config` | Change a managed profile's protection flag |

Aliases include `teleport` for `tp` and `editor` for `config`. Config, active server language, and managed-profile changes reload automatically; Rift has no manual reload command or inventory reload control. The Language setting opens the shared server picker, while the Languages category opens the shared message editor.

`/volmit plugins languages [locale]` changes the server default for every enabled Volmit language provider that supports it. `/volmit plugins debug` also includes Rift.

## Create arguments

| Argument | Default | Values |
|---|---|---|
| `environment` | `NORMAL` | Bukkit `World.Environment` value |
| `generator` | `vanilla` | `vanilla`, built-in `void`, or `PluginName[:generator-id]` |
| `seed` | `random` | `random` or a signed 64-bit integer |
| `type` | `NORMAL` | Bukkit `WorldType` value |

Examples:

```text
/rift create resource
/rift create flat_build NORMAL vanilla 12345 FLAT
/rift create empty_build NORMAL void 8675309 NORMAL
/rift import old_world vanilla true
```

The built-in `void` generator creates empty `THE_VOID` biome chunks and a bedrock spawn platform. An external generator's owner plugin must already be enabled; Rift validates the owner portion before asking Bukkit to create or import the world.

## Permission defaults

`rift.command`, `rift.language.self`, and the dynamically registered `volmit.language.self` default to everyone. Every operational node, `rift.config`, `rift.debug`, the dynamically registered `volmit.language.admin`, and `rift.admin` default to operators. The Bukkit command registration does not impose a second root-permission gate: a specifically granted subcommand node is sufficient. `rift.admin` grants all Rift capabilities.

`/rift debug dump` writes `plugins/Rift/debug/rift-v<version>-debugdump-<UTC timestamp>.txt`. Upload requires both `debugUploadEnabled` and the command's `upload` argument. Review reports before sharing them when world names or server layout are private.

Next: [Storage and operations](/rift/03-storage-operations)
