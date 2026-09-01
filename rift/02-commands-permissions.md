---
title: "Rift — Commands & Permissions"
description: "Rift command syntax, help behavior, aliases, and granular permission nodes"
published: true
date: 2026-09-01T00:00:00.000Z
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
| `/rift list` | `rift.list` | List loaded, managed, discovered, and quarantined worlds |
| `/rift info <name>` | `rift.info` | Show detailed state for one world |
| `/rift generators` | `rift.generators` | Show Bukkit world types and configured generator identifiers |
| `/rift config` | `rift.config` | Open the in-game configuration editor |
| `/rift language <locale>` | `rift.config` | Select an available locale; a missing repository translation is downloaded and validated before activation |
| `/rift doctor` | `rift.doctor` | Report platform, Java, paths, locale, and world counts |
| `/rift debug` | `rift.debug` | Save a detailed support report and, when enabled, publish a clickable mclo.gs link |
| `/rift autoload <name> <enabled>` | `rift.config` | Change a managed profile's startup auto-load flag |
| `/rift protect <name> <enabled>` | `rift.config` | Change a managed profile's protection flag |

Aliases include `teleport` for `tp`, `editor` for `config`, and `status` for `doctor`. Config, active language, and managed-profile changes reload automatically; Rift has no manual reload command. The language command is also the click target used by the configuration editor's chat picker.

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

`rift.command` defaults to everyone so explicitly granted subcommand nodes are usable. Every operational node and `rift.admin` defaults to operators. `rift.admin` grants all Rift capabilities.

`/rift doctor` is a compact local chat summary. `/rift debug` performs one report at a time: it captures Bukkit state on the global scheduler, performs JVM inspection, hashing, disk writes, and HTTP off-thread, then writes `plugins/Rift/debug/rift-debug-<UTC timestamp>.txt`. The `debugUploadEnabled` setting is enabled by default; set it to `false` before running the command when the report must remain local.

When upload is enabled, the same local report is sent to the fixed HTTPS mclo.gs API and Rift returns a clickable public URL. The report includes plugin metadata, Rift world names and storage state, active configuration values, runtime details, thread stacks, and managed-file hashes, so review the local file before sharing when server topology is confidential.

Next: [Storage & Operations](/rift/03-storage-operations)
