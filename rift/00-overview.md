---
title: "Rift — Overview"
description: "World states, lifecycle behavior, and the Rift safety model"
published: true
date: 2026-09-03T00:00:00.000Z
tags: "rift, world-management, lifecycle, safety"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Rift creates, imports, loads, unloads, protects, and safely removes worlds.

## World states

| State | Meaning |
|---|---|
| Loaded | The server currently has the world open |
| Managed | Rift has a profile for it |
| On disk | A valid world exists but may not be loaded or managed |
| Quarantined | Rift moved it to `.rift-trash` and can restore it |

Use the paged Director menu at `/rift list [page]` for every known world and `/rift info <name>` for one world's status, generator, seed, auto-load, and protection settings. `/rift status` uses the same Director framing for server, Java, platform, locale, storage, and world-count health.

## Managed worlds

`/rift create` makes a managed world. `/rift import` adds a profile to an existing world. `/rift load` can open a world without making it managed.

The built-in `void` generator creates an empty world with a small bedrock spawn platform.

`/rift language` provides separate personal and server-default locale controls plus the shared in-game message editor. Personal choices persist by UUID under `plugins/Rift/languages/`, and Rift participates in `/volmit plugins languages` alongside the other enabled Volmit language providers.

During startup, Rift stops managing an unloaded, unprotected world when both supported storage locations are conclusively absent. Its profile is moved to `plugins/Rift/worlds/retired/` instead of deleted. Loaded or protected worlds remain managed, and existing but incomplete, inaccessible, conflicting, or unsafe storage is preserved for operator review with the full failure logged.

## Diagnostics

`/rift debug dump` creates a timestamped support report under `plugins/Rift/debug/`; `/rift debug` opens its help page. The report combines VolmLib's shared server diagnostics with Rift service health, scheduler and hot-reload state, locale and remote-catalog state, detailed per-world storage checks, configuration, managed-file hashes, JVM and JIT data, bounded memory totals, CPU, garbage collectors, filesystems, and artifact identity. Per-thread state, locks, and stack traces are excluded. Rift also registers with `/volmit plugins debug`. Public mclo.gs publishing is enabled by default; set `debugUploadEnabled` to `false` globally or pass `upload=false` for one local-only report.

## Safe removal

Rift quarantines managed worlds instead of permanently deleting them. Run the same delete command twice within the confirmation window, then use `/rift restore <id>` if you need the world back.

Rift will not unload or quarantine:

- the primary world or its Nether and End
- the configured evacuation world
- a protected profile
- a path outside the server's world storage

Folia does not currently support dynamic world creation, loading, or unloading. Rift's listing, diagnostics, configuration, and teleport tools remain available there.

Next: [Installation & Compatibility](/rift/01-installation-compatibility)
