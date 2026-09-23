---
title: "Multiverse"
description: "Iris documentation: Multiverse"
published: true
date: 2026-09-23T11:12:42.385Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-20T00:00:00.000Z
---
Multiverse-Core can list, inspect, teleport to, and configure Iris worlds. Use Iris commands to create or remove Iris worlds. Multiverse cannot create, delete, regenerate, or clone them.

## Requirements

Use Multiverse-Core 5.8.0 with Iris.

## World names and storage

Iris worlds live under `<level>/dimensions/iris/<key>/`. Back up the complete world, including its `iris/generation` directory. Use Iris commands for creation and removal; Multiverse's create, clone, regenerate, and delete operations are blocked.

Use the Bukkit world name `<level>_iris_<key>` with Multiverse commands, rather than the dimension key `iris:<key>`. An Iris world showing `Environment: CUSTOM` in `/mv info` is expected.

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
| `/mv delete` | **Refused.** Use `/iris remove world=<level>_iris_<key> delete=true`, which clears the folder, the `bukkit.yml` entry, the Iris registry entry, and the Multiverse entry in one step |
| `/mv regen` | **Refused.** Use Iris commands for world management |
| `/mv clone` | **Refused**, both as source and as destination |
| `/mv create -g Iris` | **Refused.** Use `/iris create <name> type=<pack>`. Iris registers the finished world with Multiverse itself, so it appears in `/mv list` without importing |
| `/mv import -g Iris` | **Refused** unless the folder already holds Iris world storage |

A refusal prints the reason and the command to use instead. Nothing is modified when a command is refused.

## Settings Iris controls

Iris sets these values for its worlds at startup. Leave them unchanged.

| Setting | Value | Reason |
|---|---|---|
| `auto-load` | `false` | Iris manages world loading |
| `adjust-spawn` | `false` | Multiverse would otherwise relocate the spawn point it considers unsafe and persist the change |
| `generator` | `Iris:<pack>` | Multiverse must record the generator that actually produced the world |

You can leave Multiverse's `world.auto-import-3rd-party-worlds` option enabled.

## Restart requirements

Keep the default plugin load order. Restart the server fully after updating Iris; plugin-manager hot reloads are unsupported.

Use `/iris remove` for intentional removal rather than deleting a world folder by hand. `/mv remove` only removes the Multiverse entry, so the world returns on the next restart.

See also [28 - Integrations](/iris/28-integrations) and [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle).
