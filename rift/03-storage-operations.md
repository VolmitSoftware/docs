---
title: "Rift: Storage and Operations"
description: "Managed profiles, quarantine manifests, protection, backups, and recovery"
published: true
date: 2026-10-09T17:25:00.000Z
tags: "rift, storage, quarantine, restore, operations"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Rift keeps its metadata under `plugins/Rift/` and world data in the server's world container. Configuration and profile writes are atomic.

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
| `<primary-world>/dimensions/rift/<key>/` | Rift-created world directory on Paper 26.1 and newer |
| `<primary-world>/dimensions/<namespace>/<key>/` | Existing worlds, including `minecraft:*` and `iris:*`, imported in place |
| `<primary-world>/` | Primary `minecraft:overworld` storage |
| `<world-container>/.rift-trash/<id>/` | Recoverable quarantined world directory |

Profiles contain the full `worldKey`, `worldUuid`, relative `directory`, and `lifecycleOwner`. The command `name` must be unique; `displayAlias` changes presentation only. UUID and key checks prevent an unrelated replacement directory from taking over a profile.

New native worlds use `rift:<key>` under the primary world's `dimensions/rift/` directory. Imported current Paper worlds retain their namespace and directory. Existing-world loading reads only the recorded canonical location and requires matching Paper metadata.

Iris worlds keep `iris` as their lifecycle owner. Iris must be enabled and registered before Rift can load or unload them. Other lifecycle providers can register through the [integration API](/rift/99-integration-api).

## Unload

Rift refuses to unload the primary world family, a protected managed world, or the configured evacuation world. It moves every player to the configured loaded evacuation world, or the primary loaded world when the setting is empty, then waits for its lifecycle owner to finish unloading.

Use `/rift protect <name> true` for worlds that other plugins assume remain loaded. Use `/rift autoload <name> false` when a managed world should remain on disk but not load during the next Rift startup.

## Clone and regeneration

Unload a native source before running `/rift clone <source> <target>`. The target can be a new world name or a full namespaced key. The clone receives a new UUID and keeps the saved seed and chunks. Existing targets are refused. All four optional flags default to `true`; use `load=false` to leave the clone unloaded. Resetting game rules or the border requires loading the clone.

`/rift regenerate <name>` replaces a loaded, unprotected world while retaining its complete original storage and profile in quarantine. Enable `allowWorldDeletion`, then repeat the same command with the same options within `deleteConfirmationSeconds`. Use `seed=keep`, `seed=random`, or a signed 64-bit integer. The replacement receives a new UUID. Policies, current game rules, and the current border are kept by default; disable each with its `keep-policies`, `keep-game-rules`, or `keep-border` flag.

Regeneration reports the original quarantine ID. Restoring that original requires first unloading and quarantining the replacement so its key and directory are free. If replacement creation fails, Rift restores the original storage and profile without loading it. Any partial replacement files remain in `.rift-failed-regeneration` for operator recovery. Providers that do not implement cloning or regeneration refuse those operations.

## Externally removed worlds

At startup, Rift retires the profile of an unloaded, unprotected world only when its exact recorded canonical path is missing. Restoring the directory does not reactivate the profile; run `/rift import <full-key>` again.

Protected profiles and ambiguous filesystem results remain managed for operator review. Rift stops enabling if its active profile directory is unreadable or invalid.

## Quarantine and restore

`/rift delete <name>` applies these gates before moving data:

1. `allowWorldDeletion` must be `true`.
2. The world's stored location must be inside a supported world-container layout.
3. The world must be managed, unprotected, not the primary world, and have valid storage markers.
4. The same sender must repeat the same command within `deleteConfirmationSeconds`.
5. Rift then evacuates and unloads it, moves its directory into `.rift-trash`, and replaces its profile with a restore manifest.

Rift never recursively deletes the quarantined directory. `/rift restore <id>` moves it back, but only when the command name, full key, UUID, and destination directory are free. Restoration validates the stored UUID and preserves every policy field. The restored world remains unloaded. A failed move is rolled back, with the full stack trace in the console.

Quarantine has no automatic expiry. Operators control retention by restoring an entry or, with the server stopped and a verified backup, manually removing both its manifest and matching quarantine directory.

## Backup and recovery

Before lifecycle changes to valuable worlds, back up the world container and `plugins/Rift/` together. A profile or manifest alone does not contain chunks, entities, or player data.

If a manual config, language, or profile edit is invalid, Rift logs the validation failure and keeps the last valid in-memory state. Correct the current file and save it again; Rift automatically retries when the stable content changes and does not replace invalid current files with defaults.

Debug reports stay on disk until you remove them. Disable public upload globally with `debugUploadEnabled`, or for one run with `/rift debug dump false`.

Next: [Configuration and localization](/rift/04-configuration-localization)
