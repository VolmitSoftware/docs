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
| On disk | The world is loaded, has a legacy standalone folder with `level.dat`, or has a modern nested dimension folder under the primary world |
| Quarantined | The directory was moved to `<world-container>/.rift-trash/<id>` and has a matching manifest |

`/rift list` combines these sources. `/rift info <name>` shows loaded, managed, on-disk, generator, seed, auto-load, protection, and active-operation state for one world. Hover a list entry or detail line in game for an explanation of the state.

The doctor summary counts all Bukkit-loaded worlds separately from Rift-managed profiles. A “missing managed world” is a profile whose world is neither loaded nor backed by a valid directory; newly created loaded worlds are never classified as missing while the filesystem scan catches up.

`/rift debug` creates a timestamped support report under `plugins/Rift/debug/`. It expands the local doctor view with service health, scheduler and hot-reload state, detailed per-world storage checks, plugin metadata, the active configuration, managed-file hashes, JVM and JIT data, CPU, memory pools, threads and locks, garbage collectors, filesystems, and Rift artifact identity. Public mclo.gs publishing is enabled by default; set `debugUploadEnabled` to `false` for local-only reports.

## Anonymous usage metrics

Rift uses the official bStats Bukkit single-file runtime with plugin id `33701`. The enabled-by-default `bstatsEnabled` setting can be changed through `config.toml` or the in-game editor and applies immediately; disabling it shuts down Rift's metrics scheduler. The global `plugins/bStats/config.yml` opt-out remains authoritative and Rift never removes or overrides it.

Rift registers no custom charts. The standard bStats payload contains the anonymous server UUID maintained by bStats, player count, online-mode flag, Bukkit implementation and version, Rift version, Java version, operating-system name/version/architecture, logical core count, and bStats runtime version. It does not contain player names, player UUIDs, network addresses, world names, or Rift configuration values. bStats receives the request source address and documents its use for country statistics and rate limiting; review the [official bStats server-owner documentation](https://bstats.org/docs/server-owners) before enabling metrics on a restricted network.

## Managed profiles

Creating or importing a world writes a profile containing its canonical name, environment, generator, world type, recorded seed, relative Bukkit storage directory, startup auto-load flag, and protection flag. The relative directory comes from `World#getWorldFolder()` because the server owns world placement: older Bukkit implementations commonly use `<world-container>/<name>`, while Paper 26.1+ maps `WorldCreator("name")` to `minecraft:name` and stores it under `<primary-world>/dimensions/minecraft/<name>`. A Paper `rift:name` key would instead expose the Bukkit world as `rift_name`, and the supported Spigot APIs have no equivalent custom-key facility, so Rift retains the simple interoperable world name and never relocates live server-owned storage. Rift validates all profiles before replacing the active in-memory profile set; an invalid hot reload leaves the previous valid set active.

The built-in `void` generator creates empty `THE_VOID` biome chunks and a 5×5 bedrock spawn platform at Y 63. It uses public Bukkit generator APIs and does not depend on or manage another world-generation plugin.

`/rift load` can load a discovered on-disk world without making it managed. Use `/rift import` when the world should receive a profile and optional startup loading.

## Safety model

- World arguments are names, never paths. Names are limited to a portable character set; stored relative locations must remain inside the configured world container and match either a standalone-world or nested-dimension layout.
- Rift rejects traversal, path separators, symbolic-link world storage, operating-system device names, and folders without the markers required by their storage layout.
- The primary world, its Nether and End companions, the configured evacuation world, and protected profiles cannot be unloaded or quarantined.
- Only managed worlds can be quarantined. The same sender must issue the same delete command twice within the configured confirmation window.
- Quarantine moves the authoritative Bukkit world folder rather than recursively deleting it. `/rift restore <id>` returns it to the same standalone or nested-dimension location when the destination is clear.
- A per-world operation lock prevents overlapping lifecycle or profile changes for the same world.

## Schedulers and platform behavior

Disk parsing and profile writes run asynchronously. World creation, loading, unloading, and movement are sent through the server's global scheduler, while player messages, menus, and teleport completion return through entity schedulers.

Folia currently does not implement the dynamic Bukkit world create/load/unload APIs needed by a world manager. Rift declares Folia support so its read, diagnostics, editor, profile, and teleport features can load, but it rejects create, import, load, unload, quarantine, and restore before calling those unsupported APIs.

Next: [Installation & Compatibility](/rift/01-installation-compatibility)
