---
title: "Rift — Commands & Permissions"
description: "Complete Rift 2.0.2 command syntax, permission behavior, and safety notes"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "rift, commands, permissions, legacy"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Rift registers its command directly with the Minecraft 1.19 Brigadier
dispatcher. The root is `/rift`; `/rft`, `/ri`, and `/rt` redirect to it.

## Permissions

| Node | Required for |
|---|---|
| `rift.admin` | The root and every subcommand, including `/rift to` |
| `rift.teleport` | An additional check for `/rift to <world>` |

The nodes are checked in code but are not declared in `plugin.yml`, so Rift does
not publish descriptions or explicit defaults. Grant nodes explicitly through
your permission manager. A user needs **both** nodes to use `/rift to` because
the `rift.admin` requirement is attached to the root command.

> `rift.admin` permits unchecked recursive filesystem deletion through
> `/rift delete`. Grant it only to trusted server owners with filesystem-level
> backup and recovery access.
{.is-danger}

## Command reference

| Command | Effect | Important behavior |
|---|---|---|
| `/rift` | Shows usage, version, and managed-world count | Requires `rift.admin` |
| `/rift create <name> <generator> [seed] [environment]` | Creates, loads, and records a world | Environment can only be supplied after a seed |
| `/rift load <name> [generator]` | Loads a world | Does not create a managed JSON record |
| `/rift import <name> <generator>` | Loads an existing directory and records it | Uses only the final directory name when calling Bukkit |
| `/rift unload <name>` | Teleports players away, saves chunks, and unloads | Does not remove the managed record |
| `/rift delete <name>` | Unloads, recursively deletes, and removes the record | Unsafe; see below |
| `/rift to <world>` | Teleports the executing player to world spawn | Console cannot be teleported |
| `/rift list` | Lists loaded, managed, configured, and discovered worlds | Discovery scans server-root directories for `level.dat` |
| `/rift generators` | Lists Bukkit world types and detected generator plugins | Plugin detection may have side effects or throw errors |

## Create examples

```text
/rift create resource normal
/rift create flat_build flat 12345
/rift create iris_world "Iris:overworld" 8675309 NORMAL
```

Environment matching is case-insensitive. Values come from Bukkit's
`World.Environment` enum, normally `NORMAL`, `NETHER`, `THE_END`, and `CUSTOM`.
An unknown value is silently ignored.

The values `flat`, `amplified`, and `largebiomes` choose matching Bukkit world
types. Other values choose `NORMAL` and are still passed to Bukkit as a custom
generator identifier.

## Load versus import

Use `load` to make a world available for the current server process. If the
generator argument is omitted, Rift looks for a managed record with the same
base name; otherwise it falls back to the string `normal`.

Use `import` to load the world and write
`plugins/Rift/worlds/<world>.json`. That record is what makes Rift attempt to
load the world again after restart.

Path-like arguments are inconsistent: Rift checks the supplied `File`, but
`WorldCreator` receives only its base name. Use plain world-folder names located
at the server root.

## Delete warning

`/rift delete <name>` resolves `<name>` as a filesystem path relative to the
server process. It does not require `level.dat`, constrain the target to the
server's world container, canonicalize the path, block `..`, or ask for
confirmation. It then recursively deletes every child it can reach.

Do not use this command on a production server. Follow the stopped-server
procedure in [Storage & Operations](/rift/03-storage-operations) instead.

Next: [Storage & Operations](/rift/03-storage-operations)
