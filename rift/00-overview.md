---
title: "Rift — Overview"
description: "World states, lifecycle behavior, and the Rift safety model"
published: true
date: 2026-08-28T00:00:00.000Z
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

## Safe removal

Rift quarantines managed worlds instead of permanently deleting them. Run the same delete command twice within the confirmation window, then use `/rift restore <id>` if you need the world back.

Rift will not unload or quarantine:

- the primary world or its Nether and End
- the configured evacuation world
- a protected profile
- a path outside the server's world storage

Folia does not currently support dynamic world creation, loading, or unloading. Rift's listing, diagnostics, configuration, and teleport tools remain available there.

Next: [Installation & Compatibility](/rift/01-installation-compatibility)
