---
title: "Rift: Overview"
description: "World states, everyday commands, and safe removal"
published: true
date: 2026-10-16T00:00:00.000Z
tags: "rift, world-management, lifecycle, safety"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Rift manages server worlds and their policies. It creates worlds in the `rift` dimension namespace and moves confirmed deletions into recoverable quarantine.

## First commands

```none
/rift create resource
/rift tp resource
/rift list
/rift info resource
/rift policy edit name=resource
```

Use `/rift config` for plugin settings and `/rift help` for the command menu. Settings and managed profiles reload when valid changes are saved.

## World states

| State | Meaning |
|---|---|
| Loaded | The server has the world open |
| Managed | Rift has a saved profile for it |
| On disk | Rift found its world storage |
| Missing | A managed profile has no available storage |
| Quarantined | The world is in `.rift-trash` and can be restored |

These counts overlap: a world can be loaded, managed, and on disk at once. `/rift status` shows totals; `/rift check <name>` explains one world's readiness without changing it.

`/rift create` creates and manages a world. `/rift import` manages an existing world and loads it if necessary. `/rift load` opens an existing managed or discovered world; loading an unmanaged world does not create a profile.

Startup auto-loading is enabled by default. Both `autoLoadManagedWorlds` and a profile's `autoLoad` must be true for that world to load. Missing unprotected profiles are retired during startup; protected or uncertain cases stay available for review.

## Removal and recovery

Run `/rift unmanage <name>` to retire a profile while keeping world files and any loaded world. Run `/rift delete <name>` twice within the confirmation window to quarantine a managed world. `/rift restore <id>` restores it without loading it.

Primary, protected, and evacuation worlds cannot be unloaded or quarantined. Back up valuable worlds before lifecycle changes: quarantine protects against removal mistakes but is not a separate backup.

Folia disables create, import, load, unload, delete, and restore. Read [Installation and compatibility](/rift/01-installation-compatibility) before choosing a server platform.
