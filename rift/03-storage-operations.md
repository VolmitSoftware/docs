---
title: "Rift: Storage and Operations"
description: "World directories, profiles, quarantine, and recovery"
published: true
date: 2026-10-14T00:00:00.000Z
tags: "rift, storage, quarantine, restore, operations"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Rift keeps plugin data under `plugins/Rift/` and world data inside the server's world container. Configuration and profile writes are atomic.

## Files

| Path | Contents |
|---|---|
| `plugins/Rift/config.toml` | Runtime settings |
| `plugins/Rift/languages/<locale>.toml` | Installed message catalog |
| `plugins/Rift/languages/language-preferences.properties` | Personal locale choices by player UUID |
| `plugins/Rift/worlds/<name>.toml` | Managed-world profile |
| `plugins/Rift/worlds/retired/` | Retired profiles |
| `plugins/Rift/trash/<id>.toml` | Quarantine manifest and saved profile |
| `plugins/Rift/debug/` | Saved support reports |
| `<primary-world>/dimensions/rift/<key>/` | Rift-created dimension storage |
| `<world-container>/.rift-trash/<id>/` | Quarantined world storage |

New worlds use `rift:<key>` with a lowercase key. They share the primary world's `dimensions` parent directory, but have a separate `rift` namespace rather than `minecraft`.

A profile stores its command name, relative directory, generator, environment, seed, type, flags, and policies. Discovery supports the current Paper storage layout. Names are case insensitive for profile lookup and allow letters, numbers, dots, dashes, and underscores, up to 64 characters. Path traversal, reserved device names, and symbolic-link world directories are refused.

## Unload and unmanage

Before unloading, Rift sends players to the configured loaded `evacuationWorld`, or the primary world when that setting is empty. It refuses the operation for the primary world family, protected profiles, and the evacuation world itself.

`/rift unmanage <name>` retires an unprotected profile without unloading its world or moving its storage. Use `/rift import <name>` to manage the existing world again.

## Externally removed worlds

Startup reconciliation retires an unloaded, unprotected profile when Rift can establish that its storage is missing. It preserves the profile in `worlds/retired/`. Protected profiles and uncertain filesystem results remain managed for review.

Restoring files alone does not reactivate a retired profile. Import the world again after restoring its storage. Do not recreate a missing world before deciding whether you intend to recover the original.

## Quarantine and restore

`/rift delete <name>` requires `allowWorldDeletion=true`, a managed unprotected world, valid storage inside the supported layout, and confirmation by the same sender within `deleteConfirmationSeconds`. Rift evacuates and unloads the world, moves its directory into `.rift-trash`, and saves a restore manifest.

`/rift restore <id>` refuses occupied destinations, restores the saved storage and profile, and leaves the world unloaded. Failures log a full stack trace; check the console before retrying.

Quarantine has no automatic expiry. Rift does not permanently delete its contents. To remove an entry manually, stop the server, verify a backup, and remove both its manifest and matching quarantine directory.

## Backups and invalid edits

Back up the world container and `plugins/Rift/` together. Profiles and manifests do not contain world chunks.

Invalid config, language, profile, or manifest edits leave the last valid runtime state active. Correct the file and save again. Rift logs validation failures instead of replacing invalid files with defaults.

Next: [Configuration and localization](/rift/04-configuration-localization)
