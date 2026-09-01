---
title: "Rift — Overview"
description: "World states, lifecycle behavior, and the Rift safety model"
published: true
date: 2026-09-01T00:00:00.000Z
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

Use `/rift list` for every known world and `/rift info <name>` for one world's status, generator, seed, auto-load, and protection settings.

## Managed worlds

`/rift create` makes a managed world. `/rift import` adds a profile to an existing world. `/rift load` can open a world without making it managed.

The built-in `void` generator creates an empty world with a small bedrock spawn platform.

## Diagnostics

`/rift debug` creates a timestamped support report under `plugins/Rift/debug/`. It expands the local doctor view with service health, scheduler and hot-reload state, active locale file and remote-language catalog state, detailed per-world storage checks, plugin metadata, the active configuration, managed-file hashes, JVM and JIT data, CPU, memory pools, threads and locks, garbage collectors, filesystems, and Rift artifact identity. Public mclo.gs publishing is enabled by default; set `debugUploadEnabled` to `false` for local-only reports.

## Safe removal

Rift quarantines managed worlds instead of permanently deleting them. Run the same delete command twice within the confirmation window, then use `/rift restore <id>` if you need the world back.

Rift will not unload or quarantine:

- the primary world or its Nether and End
- the configured evacuation world
- a protected profile
- a path outside the server's world storage

Folia does not currently support dynamic world creation, loading, or unloading. Rift's listing, diagnostics, configuration, and teleport tools remain available there.

Next: [Installation & Compatibility](/rift/01-installation-compatibility)
