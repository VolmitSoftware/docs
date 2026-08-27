---
title: "Rift — Overview"
description: "What Rift 2.0.2 manages and how its world lifecycle works"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "rift, legacy, world-management"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Rift wraps Bukkit's `WorldCreator` and world unload APIs in a small Brigadier
command tree. It also remembers imported worlds in JSON files and attempts to
load them during the next server startup.

## What Rift manages

Rift recognizes three useful categories when `/rift list` runs:

| Label | Meaning |
|---|---|
| `Managed` | The world is loaded and has `plugins/Rift/worlds/<name>.json` |
| `bukkit.yml` | The loaded world is listed under `worlds:` in `bukkit.yml` |
| `Loaded` | Bukkit has the world loaded, but Rift has no record for it |
| `Not Loaded` | A server-root directory contains `level.dat`, but Bukkit has not loaded it |

`create` and `import` produce a managed record. `load` only loads a world; it
does not make that world managed. `unload` preserves a managed record, while
`delete` attempts to remove both the directory and its record.

## Generator strings

The generator argument is passed to Bukkit as a generator identifier. Rift also
recognizes `flat`, `amplified`, and `largebiomes` when choosing a `WorldType`;
everything else uses `NORMAL`. A plugin generator may use a value such as
`Iris:overworld` if that generator plugin is already installed and compatible.

Rift can display potential generator names with `/rift generators`. Detection is
best-effort: it asks each installed plugin for a default generator using the
dummy world name `testworld`.

## Startup lifecycle

On enable, Rift:

1. Reads every `plugins/Rift/worlds/*.json` file.
2. Tries to resume paths recorded in `plugins/Rift/config.json` for deletion.
3. Calls `WorldCreator` for each managed record.
4. Reads the `worlds:` section of `bukkit.yml` and loads entries not already loaded.
5. Registers `/rift` directly with Minecraft's internal Brigadier dispatcher.

The implementation has defects in steps 2, 3, and 5. Stored seed, environment,
and type are not faithfully restored, the deletion queue can turn `config.json`
into JSON `null`, and command registration is hard-bound to `v1_19_R1`. See the
[code audit](/rift/04-code-audit) before relying on restart recovery.

## Operational boundaries

- Treat every world argument as a simple server-root world name, not a path.
- Stop the server before copying, moving, or manually deleting world folders.
- Keep a full backup outside the server directory.
- Do not hot-reload Rift or the server.
- Do not grant its permissions to routine moderators or players.
- Do not assume a success message proves a world unloaded or a directory deleted;
  several Bukkit and filesystem return values are ignored.

Next: [Installation & Compatibility](/rift/01-installation-compatibility)
