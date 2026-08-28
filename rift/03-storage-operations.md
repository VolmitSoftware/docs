---
title: "Rift — Storage & Operations"
description: "Managed profiles, quarantine manifests, protection, backups, and recovery"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "rift, storage, quarantine, restore, operations"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Rift keeps operational metadata under `plugins/Rift/` and world data in the server's configured world container. Configuration and profile writes use same-directory temporary files followed by atomic replacement when the filesystem supports it.

## Files and directories

| Path | Purpose |
|---|---|
| `plugins/Rift/config.toml` | Runtime settings |
| `plugins/Rift/language.yml` | Optional localized message overrides |
| `plugins/Rift/worlds/<name>.toml` | One validated managed-world profile |
| `plugins/Rift/trash/<id>.toml` | Quarantine manifest and restorable profile fields |
| `<world-container>/<name>/` | Active Bukkit world directory |
| `<world-container>/.rift-trash/<id>/` | Recoverable quarantined world directory |

Old Rift JSON files are not migrated or interpreted. The 3.0 format is a hard break: only the current TOML and YAML paths are active.

## Unload

Rift refuses to unload the primary world family, a protected managed world, or the configured evacuation world. It moves every player to the configured loaded evacuation world, or the primary loaded world when the setting is empty, then checks Bukkit's unload result.

Use `/rift protect <name> true` for worlds that other plugins assume remain loaded. Use `/rift autoload <name> false` when a managed world should remain on disk but not load during the next Rift startup.

## Quarantine and restore

`/rift delete <name>` applies these gates before moving data:

1. The feature must be enabled in `config.toml`.
2. The name must be portable and resolve directly under the world container.
3. The target must be a managed, unprotected, non-primary world with a regular `level.dat`.
4. The same sender must repeat the same command within the confirmation window.
5. Rift evacuates and unloads the world, then moves the directory into `.rift-trash` and replaces its profile with a manifest.

Rift does not recursively delete the quarantined directory. `/rift restore <id>` moves it back only when no loaded world, profile, or directory occupies the destination name. Filesystem and metadata steps attempt rollback when a later step fails, and failures include full stack traces in the server console.

Quarantine has no automatic expiry. Operators control retention by restoring an entry or, with the server stopped and a verified backup, manually removing both its manifest and matching quarantine directory.

## Backup and recovery

Before lifecycle changes to valuable worlds, back up the world container and `plugins/Rift/` together. A profile or manifest alone does not contain chunks, entities, or player data.

If a manual config, language, or profile edit is invalid, Rift logs the validation failure and keeps the last valid in-memory state. Correct the current file and save it again, or run `/rift reload`; Rift does not replace invalid current files with defaults.

Next: [Configuration & Localization](/rift/04-configuration-localization)
