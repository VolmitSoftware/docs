---
title: React — Commands
description: Full /react command tree
published: true
date: 2026-08-09T00:00:00.000Z
tags: react, commands
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

React registers the root command `/react`, aliased `re`. Argument notation: `<required>`, `[optional]`.

## /react action

*This is the root action command, it contains all current actions*

Aliases: `act`, `a`

| Command | Description |
|---|---|
| `/react action purge-entities [radius]` | this Kills/Deletes all entities in the specified region *(alias: pe)* |
| `/react action purge-chunks` | this unloads chunks in the specified region, if applicable in the specified world *(alias: pc)* |
| `/react action collect-garbage` | Run a system gc, unnecessary on most systems, but may help on some. use with caution. *(alias: gc)* |

## /react benchmark

*These are the benchmark commands, please note that the numbers are never accurate and are only meant to be used as a relative comparison.*

Aliases: `bench`

| Command | Description |
|---|---|
| `/react benchmark cpu-benchmark` | Benchmark the CPU *(alias: cpu)* |
| `/react benchmark drive-benchmark` | Benchmark the Hard-Drive *(alias: drive)* |
| `/react benchmark memory-benchmark` | Benchmark the Memory *(alias: mem)* |

## /react chunk

*This is the root chunk command, it contains all current chunk commands*

Aliases: `c`

| Command | Description |
|---|---|
| `/react chunk sample` | Get the current player-chunk sampled data |
| `/react chunk worst` | Get the worst chunk on the server/world *(alias: w)* |

## /react config

*This is the place to configure Itemized Settings.*

Aliases: `cfg`, `c`

| Command | Description |
|---|---|
| `/react config monitor` | Configure the monitor *(alias: m, mon)* |

## /react debug

*This is the Debugging command for Various things.*

| Command | Description |
|---|---|
| `/react debug entity-data` | Show Entity Data for the entity looked at *(alias: ed)* |

## /react environment

*This is the place to benchmark your system and get information about your system.*

Aliases: `env`

| Command | Description |
|---|---|
| `/react environment info` | Print the environment details! *(alias: i)* |

## /react

*The root react command*

| Command | Description |
|---|---|
| `/react monitor` | Monitor the server via action bar *(alias: m, mon)* |
| `/react set-player-view-distance` | Visualize the via glow blocks *(alias: vd, view-distance)* |
| `/react map` | Visualize the via glow blocks |
| `/react reload` | Reload React *(alias: rl)* |
| `/react version` | Get React version |


## Permissions

React declares no permission nodes in `plugin.yml`; command access defaults to operator.
Gate `/react` through your permissions plugin if you need non-op access.
