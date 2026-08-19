---
title: React — Commands
description: Full /react command tree
published: true
date: 2026-08-19T00:00:00.000Z
tags: react, commands
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

React registers the root command `/react`. The alias is `re`. Argument notation is `<required>` and `[optional]`.

## /react action

This is the root action command. It contains all current actions.

Aliases: `act`, `a`

| Command | Description |
|---|---|
| `/react action purge-entities [radius]` | Kills all entities in the specified region *(alias: pe)* |
| `/react action purge-chunks` | Unloads chunks in the specified region, if applicable in the specified world *(alias: pc)* |
| `/react action collect-garbage` | Run a system GC. Most systems do not need this. Use with caution. *(alias: gc)* |

## /react benchmark

These are the benchmark commands. The numbers are never accurate. Use them only as a relative comparison.

Aliases: `bench`

| Command | Description |
|---|---|
| `/react benchmark cpu-benchmark` | Benchmark the CPU *(alias: cpu)* |
| `/react benchmark drive-benchmark` | Benchmark the hard drive *(alias: drive)* |
| `/react benchmark memory-benchmark` | Benchmark the memory *(alias: mem)* |

## /react chunk

This is the root chunk command. It contains all current chunk commands.

Aliases: `c`

| Command | Description |
|---|---|
| `/react chunk sample` | Get the current player-chunk sampled data |
| `/react chunk worst` | Get the worst chunk on the server or world *(alias: w)* |

## /react config

This is the place to configure itemized settings.

Aliases: `cfg`, `c`

| Command | Description |
|---|---|
| `/react config monitor` | Configure the monitor *(alias: m, mon)* |

## /react debug

This is the debug command for various things.

| Command | Description |
|---|---|
| `/react debug entity-data` | Show entity data for the entity looked at *(alias: ed)* |

## /react environment

This is the place to benchmark your system and get information about your system.

Aliases: `env`

| Command | Description |
|---|---|
| `/react environment info` | Print the environment details *(alias: i)* |

## /react

The root React command.

| Command | Description |
|---|---|
| `/react monitor` | Monitor the server via action bar *(alias: m, mon)* |
| `/react set-player-view-distance` | Visualize the via glow blocks *(alias: vd, view-distance)* |
| `/react map` | Visualize the via glow blocks |
| `/react reload` | Reload React *(alias: rl)* |
| `/react version` | Get React version |


## Permissions

React declares no permission nodes in `plugin.yml`. Command access defaults to operator. Gate `/react` through your permissions plugin if you need non-op access.
