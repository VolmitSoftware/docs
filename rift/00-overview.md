---
title: "Rift — Overview"
description: "World states, lifecycle behavior, and the Rift safety model"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "rift, world-management, lifecycle, safety"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Rift separates a Bukkit world's live state, filesystem state, and managed profile. This lets operators inspect missing or unloaded worlds without treating every directory as safe to mutate.

## World states

| State | Meaning |
|---|---|
| Loaded | Bukkit currently exposes the world |
| Managed | `plugins/Rift/worlds/<name>.toml` contains a validated Rift profile |
| On disk | A direct child of the server world container contains a regular `level.dat` |
| Quarantined | The directory was moved to `<world-container>/.rift-trash/<id>` and has a matching manifest |

`/rift list` combines these sources. `/rift info <name>` shows loaded, managed, on-disk, generator, seed, auto-load, protection, and active-operation state for one world.

## Managed profiles

Creating or importing a world writes a profile containing its canonical name, environment, generator, world type, recorded seed, startup auto-load flag, and protection flag. Rift validates all profiles before replacing the active in-memory profile set; an invalid manual reload leaves the previous valid set active.

`/rift load` can load a discovered on-disk world without making it managed. Use `/rift import` when the world should receive a profile and optional startup loading.

## Safety model

- World arguments are names, never paths. Names are limited to a portable character set and must resolve to one direct child of the configured world container.
- Rift rejects traversal, path separators, symbolic-link world directories, operating-system device names, and directories without a regular `level.dat`.
- The primary world, its Nether and End companions, the configured evacuation world, and protected profiles cannot be unloaded or quarantined.
- Only managed worlds can be quarantined. The same sender must issue the same delete command twice within the configured confirmation window.
- Quarantine moves the directory rather than recursively deleting it. `/rift restore <id>` returns the directory and profile when the destination is clear.
- A per-world operation lock prevents overlapping lifecycle or profile changes for the same world.

## Schedulers and platform behavior

Disk parsing and profile writes run asynchronously. World creation, loading, unloading, and movement are sent through the server's global scheduler, while player messages, menus, and teleport completion return through entity schedulers.

Folia currently does not implement the dynamic Bukkit world create/load/unload APIs needed by a world manager. Rift declares Folia support so its read, diagnostics, editor, profile, and teleport features can load, but it rejects create, import, load, unload, quarantine, and restore before calling those unsupported APIs.

Next: [Installation & Compatibility](/rift/01-installation-compatibility)
