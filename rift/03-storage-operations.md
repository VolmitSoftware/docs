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
| `plugins/Rift/languages/<locale>.yml` | The selected editable catalog, created on demand from English or one of 17 bundled translations |
| `plugins/Rift/worlds/<name>.toml` | One validated managed-world profile |
| `plugins/Rift/trash/<id>.toml` | Quarantine manifest and restorable profile fields |
| `plugins/Rift/debug/rift-debug-<UTC timestamp>.txt` | Detailed report created by `/rift debug` |
| `<world-container>/<name>/` | Standalone world directory used by older Bukkit implementations |
| `<primary-world>/dimensions/<namespace>/<key>/` | Standard Paper 26.1+ world directory |
| `<world-container>/.rift-trash/<id>/` | Recoverable quarantined world directory |

Old Rift JSON files are not migrated or interpreted. The 3.0 format is a hard break: only the current TOML and YAML paths are active. Managed profiles record their validated storage location relative to the world container; profiles created before this field was introduced are resolved from either supported layout and canonicalized after a successful load. Bukkit or Paper selects the world directory when `WorldCreator` runs. [Paper 26.1+ intentionally stores API-created worlds below the primary world's `dimensions` tree](https://papermc.io/news/26-1/) and maps a simple `WorldCreator("name")` call to `minecraft:name`, which produces `dimensions/minecraft/<name>`. A custom `rift:name` key changes the Bukkit-visible identity to `rift_name` and is unavailable on the supported Spigot floor, so Rift keeps the simple world name other plugins expect and records the server's authoritative location instead of relocating it. Unmanaged primary dimension keys and other plugins' custom namespaces are excluded from Rift's simple-name discovery.

## Unload

Rift refuses to unload the primary world family, a protected managed world, or the configured evacuation world. It moves every player to the configured loaded evacuation world, or the primary loaded world when the setting is empty, then checks Bukkit's unload result.

Use `/rift protect <name> true` for worlds that other plugins assume remain loaded. Use `/rift autoload <name> false` when a managed world should remain on disk but not load during the next Rift startup.

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

Debug reports are not automatically deleted. Operators control local retention. Public upload is enabled by default and can be disabled before running `/rift debug`; when enabled, mclo.gs controls the remote report's retention and Rift does not store or log the service's one-time deletion token.

Next: [Configuration & Localization](/rift/04-configuration-localization)
