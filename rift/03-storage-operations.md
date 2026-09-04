---
title: "Rift: Storage and Operations"
description: "Managed profiles, quarantine manifests, protection, backups, and recovery"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "rift, storage, quarantine, restore, operations"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Rift keeps operational metadata under `plugins/Rift/` and world data in the server's configured world container. Configuration and profile writes use same-directory temporary files followed by atomic replacement when the filesystem supports it.

## Files and directories

| Path | Purpose |
|---|---|
| `plugins/Rift/config.toml` | Runtime settings |
| `plugins/Rift/languages/<locale>.toml` | An installed editable catalog; English is generated locally and a missing selected repository translation is downloaded on demand |
| `plugins/Rift/languages/language-preferences.properties` | Atomic UUID-to-locale personal language selections |
| `plugins/Rift/worlds/<name>.toml` | One validated managed-world profile |
| `plugins/Rift/worlds/retired/<UTC timestamp>-<name>.toml` | Preserved profile for a world conclusively found missing during startup |
| `plugins/Rift/trash/<id>.toml` | Quarantine manifest and restorable profile fields |
| `plugins/Rift/debug/rift-v<version>-debugdump-<UTC timestamp>.txt` | Detailed report created by `/rift debug dump` or the shared `/volmit plugins debug` menu |
| `<world-container>/<name>/` | Standalone world directory used by older Bukkit implementations |
| `<primary-world>/dimensions/<namespace>/<key>/` | Standard Paper 26.1+ world directory |
| `<world-container>/.rift-trash/<id>/` | Recoverable quarantined world directory |

Rift 2.0 reads the current TOML paths and does not migrate older JSON files. Managed profiles record their validated storage location. [Paper 26.1+ stores API-created worlds below the primary world's `dimensions` tree](https://papermc.io/news/26-1/), while older Bukkit layouts use standalone world directories. Rift supports both layouts without relocating worlds.

## Unload

Rift refuses to unload the primary world family, a protected managed world, or the configured evacuation world. It moves every player to the configured loaded evacuation world, or the primary loaded world when the setting is empty, then checks Bukkit's unload result.

Use `/rift protect <name> true` for worlds that other plugins assume remain loaded. Use `/rift autoload <name> false` when a managed world should remain on disk but not load during the next Rift startup.

## Externally removed worlds

At startup, Rift retires the profile of an unloaded, unprotected world only when both supported storage locations are missing. Restoring the directory does not reactivate the profile; run `/rift import <name>` again.

Protected profiles and ambiguous filesystem results remain managed for operator review. Rift stops enabling if its active profile directory is unreadable or invalid.

## Quarantine and restore

`/rift delete <name>` applies these gates before moving data:

1. The feature must be enabled in `config.toml`.
2. The name must be portable and its stored location must remain inside a supported world-container layout.
3. The target must be a managed, unprotected, non-primary world with valid standalone-world or nested-dimension storage markers.
4. The same sender must repeat the same command within the confirmation window.
5. Rift asks the live Bukkit world for its authoritative folder, evacuates and unloads it, then moves that standalone or nested-dimension directory into `.rift-trash` and replaces its profile with a manifest containing the restore location.

Rift does not recursively delete the quarantined directory. `/rift restore <id>` moves it back only when no loaded world, profile, or directory occupies the destination name. Filesystem and metadata steps attempt rollback when a later step fails, and failures include full stack traces in the server console.

Quarantine has no automatic expiry. Operators control retention by restoring an entry or, with the server stopped and a verified backup, manually removing both its manifest and matching quarantine directory.

## Backup and recovery

Before lifecycle changes to valuable worlds, back up the world container and `plugins/Rift/` together. A profile or manifest alone does not contain chunks, entities, or player data.

If a manual config, language, or profile edit is invalid, Rift logs the validation failure and keeps the last valid in-memory state. Correct the current file and save it again; Rift automatically retries when the stable content changes and does not replace invalid current files with defaults.

Debug reports remain on disk until an operator removes them. Public upload can be disabled globally or for one run with `/rift debug dump false`.

Next: [Configuration and localization](/rift/04-configuration-localization)
