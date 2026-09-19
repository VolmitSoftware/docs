---
title: "Multiverse"
description: "Iris documentation: Multiverse"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-20T00:00:00.000Z
---
Multiverse-Core can list, inspect, teleport to, and configure Iris worlds. **It cannot create, delete, regenerate, or clone them** — the commands you would reach for first are the ones Iris refuses.

## Versions

| | |
|---|---|
| Tested and compiled against | Multiverse-Core **5.8.0** |
| Server | Paper and Leaf 26.2 |
| Multiverse 4.x | Not supported. Iris targets the Multiverse 5 API (`org.mvplugins.multiverse.core`) |

Parts of this integration use reflection because Multiverse 5 has no public setter for state Iris must correct. If a Multiverse update moves it, Iris logs one warning and carries on rather than failing. If you update Multiverse and world creation, removal, or listing starts behaving differently, check the startup log for that warning before changing anything in your packs.

## Why Iris worlds are not ordinary Multiverse worlds

Multiverse manages worlds as **folders**, and its create, clone, regenerate, and delete operations all work on a directory. An Iris world is a **dimension inside the level**, at `<level>/dimensions/iris/<key>/`, carrying a world-local generation history at `.../iris/generation` that holds the immutable packs, kernels, ownership, boundaries, and recorded facts making each coordinate reproducible. **Delete part of it and Iris refuses generation.**

Three consequences:

- Multiverse's folder operations would destroy generation history, so Iris blocks them.
- Iris worlds use the `CUSTOM` environment, which the server refuses to create through the normal world-creation call, so Multiverse cannot load one on its own. `/mv info` showing `Environment: CUSTOM` after the first restart is correct.
- An Iris world has two names: the Bukkit name `<level>_iris_<key>` and the level key `iris:<key>`. Use the `<level>_iris_<key>` form with Multiverse commands.

There is no Iris equivalent of `/mv clone` for a generated world. Create a second world from the same pack instead — two Iris worlds from one pack with the same seed generate the same terrain.

> Do not hand-edit Multiverse's `worlds.yml` for an Iris world. Iris re-asserts the entries it owns on every startup, so edits are overwritten and a wrong generator string there can stop the world loading.
{.is-warning}

## Command behavior

| Command | Behavior with an Iris world |
|---|---|
| `/mv list` | Works. Iris worlds appear and are shown as loaded |
| `/mv info` | Works |
| `/mv tp` | Works |
| `/mv gamerule` | Works |
| `/mv modify` | Works for ordinary properties. Generator, seed, biome, and environment are not editable; they are fixed at creation and changing them would not migrate existing terrain |
| `/mv unload` | Allowed. Nothing on disk is touched |
| `/mv load` | Works. Iris performs the load and hands the world back to Multiverse |
| `/mv remove` | Allowed. Removes the Multiverse entry only. The `bukkit.yml` entry stays, so the world returns on the next restart |
| `/mv delete` | **Refused.** It would delete world-local generation history. Use `/iris remove world=<level>_iris_<key> delete=true`, which clears the folder, the `bukkit.yml` entry, the Iris registry entry, and the Multiverse entry in one step |
| `/mv regen` | **Refused.** Same reason |
| `/mv clone` | **Refused**, both as source and as destination |
| `/mv create -g Iris` | **Refused.** Use `/iris create <name> type=<pack>`. Iris registers the finished world with Multiverse itself, so it appears in `/mv list` without importing |
| `/mv import -g Iris` | **Refused** unless the folder already holds Iris world storage |

A refusal prints the reason and the command to use instead. Nothing is modified when a command is refused.

## Settings Iris controls

Iris writes and re-asserts three values on its own worlds in Multiverse's config, on every startup.

| Setting | Value | Reason |
|---|---|---|
| `auto-load` | `false` | Iris loads its own worlds from `bukkit.yml` before Multiverse enables. If Multiverse also loaded them, the two would race |
| `adjust-spawn` | `false` | Multiverse would otherwise relocate the spawn point it considers unsafe and persist the change |
| `generator` | `Iris:<pack>` | Multiverse must record the generator that actually produced the world |

Multiverse imports third-party worlds on its own by default (`world.auto-import-3rd-party-worlds`), which is how an Iris world can appear in Multiverse with the wrong settings before Iris corrects them. Leaving that option enabled is fine.

## Load order

Iris declares `load: STARTUP` and `loadbefore: Multiverse-Core`. Iris enables first, loads its worlds during level preparation, and Multiverse enables afterwards and adopts them.

> Do not reorder this, and do not use a plugin manager to reload Iris. **Iris does not support hot reloading.** A reloaded Iris no longer recognizes the worlds the previous instance loaded and logs `World "iris:<key>" is loaded, but it is not an Iris world.` Restart the server fully after any Iris update.
{.is-warning}

## When something looks wrong

| Symptom | Cause |
|---|---|
| A world shows as `UNLOADED` in `/mv list` but works in game | Multiverse did not adopt it. Harmless. Check the log for an Iris warning about Multiverse |
| `/mv load` fails with `Illegal dimension (CUSTOM)` | Iris did not intercept the command. Confirm Iris is enabled and check for a Multiverse warning at startup |
| A world reappears after `/mv remove` | Expected. `/mv remove` clears only the Multiverse entry. Use `/iris remove` to remove the world |
| `World "iris:<key>" is loaded, but it is not an Iris world` | Iris was hot reloaded. Restart the server |
| A world is missing after you deleted its folder by hand | Iris reports it once at startup and leaves the `bukkit.yml` and Multiverse entries in place, so restoring the folder from a backup brings the world back. Use `/iris remove` if you meant to remove it |

See also [28 - Integrations](/iris/28-integrations) and [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle).
