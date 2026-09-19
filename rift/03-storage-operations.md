---
title: "Rift: Storage and Operations"
description: "Managed profiles, quarantine manifests, protection, backups, and recovery"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "rift, storage, quarantine, restore, operations"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Rift keeps its metadata under `plugins/Rift/` and world data in the server's world container. Every write is atomic.

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
| `<primary-world>/dimensions/rift/<key>/` | Rift-created world directory on Paper 26.1 and newer |
| `<primary-world>/dimensions/minecraft/<key>/` | Existing Paper world directory that Rift can import and manage in place |
| `<world-container>/.rift-trash/<id>/` | Recoverable quarantined world directory |

Rift 2.0 reads the TOML paths above and does not migrate older JSON files.

On Paper 26.1 and newer, a new world gets a `rift:<key>` identity under the primary world's `dimensions/rift/` directory; the key is lowercase even when you name the world with capitals. Older Bukkit implementations use standalone world directories.

Rift imports standalone worlds and Paper `dimensions/minecraft/` worlds in place, and never relocates an existing world just because it was imported or loaded.

## Unload

Rift refuses to unload the primary world family, a protected managed world, or the configured evacuation world. It moves every player to the configured loaded evacuation world, or the primary loaded world when the setting is empty, then checks Bukkit's unload result.

Use `/rift protect <name> true` for worlds that other plugins assume remain loaded. Use `/rift autoload <name> false` when a managed world should remain on disk but not load during the next Rift startup.

## Externally removed worlds

At startup, Rift retires the profile of an unloaded, unprotected world only when its recorded path and every supported same-name storage location are missing. Restoring the directory does not reactivate the profile; run `/rift import <name>` again.

Protected profiles and ambiguous filesystem results remain managed for operator review. Rift stops enabling if its active profile directory is unreadable or invalid.

## Quarantine and restore

`/rift delete <name>` applies these gates before moving data:

1. `allowWorldDeletion` must be `true`.
2. The world's stored location must be inside a supported world-container layout.
3. The world must be managed, unprotected, not the primary world, and have valid storage markers.
4. The same sender must repeat the same command within `deleteConfirmationSeconds`.
5. Rift then evacuates and unloads it, moves its directory into `.rift-trash`, and replaces its profile with a restore manifest.

Rift never recursively deletes the quarantined directory. `/rift restore <id>` moves it back, but only when no loaded world, profile, or directory already holds that name. A step that fails is rolled back, with the full stack trace in the console.

Quarantine has no automatic expiry. Operators control retention by restoring an entry or, with the server stopped and a verified backup, manually removing both its manifest and matching quarantine directory.

## Backup and recovery

Before lifecycle changes to valuable worlds, back up the world container and `plugins/Rift/` together. A profile or manifest alone does not contain chunks, entities, or player data.

If a manual config, language, or profile edit is invalid, Rift logs the validation failure and keeps the last valid in-memory state. Correct the current file and save it again; Rift automatically retries when the stable content changes and does not replace invalid current files with defaults.

Debug reports stay on disk until you remove them. Disable public upload globally with `debugUploadEnabled`, or for one run with `/rift debug dump false`.

Next: [Configuration and localization](/rift/04-configuration-localization)
