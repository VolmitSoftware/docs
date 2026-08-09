---
title: React
description: React performance monitoring plugin — overview
published: true
date: 2026-08-09T00:00:00.000Z
tags: react
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

React measures where server time actually goes and gives you tools to act on it. It is a
monitoring plugin first and an optimisation plugin second.

**Root command:** `/react` (alias `re`)
**Authors:** NextdoorPsycho, Cyberpwn

## What it does

- **Samplers.** Over thirty live metrics covering ticks, memory, chunks, entities, events,
  redstone, fluids, hoppers, physics, and React's own job queue.
- **Actions.** Bulk cleanup — purge entities or unload chunks in a defined region, force GC.
- **Features.** Opt-in optimisations: entity trimming, mob stacking, item super-stacking,
  dynamic view distance, fast leaf decay, fast explosions, minecart tethering.
- **Benchmarks.** CPU, drive, and memory benchmarks for comparing hardware.
- **Monitor.** A live action-bar readout of chosen metrics.

## Where to go next

| Page | Covers |
|---|---|
| [Installation](/react/installation) | Requirements and setup |
| [Commands](/react/commands) | The complete `/react` tree |
| [Samplers & Features](/react/samplers) | What each metric and optimisation does |

## Support

[Discord](https://discord.gg/volmit) · [Source](https://github.com/VolmitSoftware/React)
