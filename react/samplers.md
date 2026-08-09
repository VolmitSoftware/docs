---
title: React — Samplers & Features
description: The metrics React collects and the optimisations it offers
published: true
date: 2026-08-09T00:00:00.000Z
tags: react
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

## Samplers

Samplers are live metrics. They feed the monitor, the map renderer, and the chunk sampler.

### Ticks and scheduling
| Sampler | Measures |
|---|---|
| `TicksPerSecond` | Server TPS |
| `TickTime` | Time spent per tick |
| `EventTime` | Time spent dispatching Bukkit events |
| `EventHandlesPerTick` | Event handler invocations per tick |
| `EventListeners` | Registered listener count |

### Memory
| Sampler | Measures |
|---|---|
| `MemoryUsed` | Heap in use |
| `MemoryFree` | Heap available |
| `MemoryUsedAfterGC` | Live set after collection — the number that matters for sizing |
| `MemoryGarbage` | Garbage generated |
| `MemoryPressure` | Allocation pressure |

### World load
| Sampler | Measures |
|---|---|
| `Chunks` / `ChunksLoaded` / `ChunksGenerated` | Chunk counts and generation rate |
| `Entities` / `EntitySpawns` | Entity population and spawn rate |
| `Players` | Online players |

### Subsystem tick cost
| Sampler | Measures |
|---|---|
| `RedstoneTickTime` / `RedstoneUpdates` | Redstone cost and update volume |
| `FluidTickTime` / `FluidUpdates` | Fluid cost and update volume |
| `HopperTickTime` / `HopperUpdates` | Hopper cost and update volume |
| `PhysicsTickTime` / `PhysicsUpdates` | Block physics cost and update volume |

### Host
| Sampler | Measures |
|---|---|
| `ProcessorProcessLoad` | CPU used by the server process |
| `ProcessorSystemLoad` | CPU used across the whole system |
| `ProcessorOutsideLoad` | CPU used by everything *other than* the server |

`ProcessorOutsideLoad` is the one to watch on shared or oversubscribed hosts — a high value
means your neighbours are the problem, not your plugins.

### React internals
`ReactSyncTickTime`, `ReactAsyncTickTime`, `ReactJobBudget`, `ReactJobQueueTime`, and
`ReactJobsQueue` report React's own overhead. If these climb, React itself is contending for
time and its own workload should be reduced.

## Features

Features are opt-in optimisations. Each changes gameplay behaviour to some degree — read
before enabling on a live server.

| Feature | Effect | Gameplay impact |
|---|---|---|
| `EntityTrimmer` | Culls entities above configured thresholds | Removes mobs and items players may consider theirs |
| `MobStacking` | Merges nearby identical mobs into stacks | Visible; alters farm rates |
| `ItemSuperStacker` | Merges dropped item stacks beyond vanilla limits | Visible; affects item despawn behaviour |
| `DynamicViewDistance` | Adjusts view distance against load | Players see render distance change |
| `FastLeafDecay` | Accelerates leaf decay | Cosmetic, generally welcome |
| `FastExplosions` | Cheaper explosion calculation | May alter block-breaking edge cases |
| `MinecartTether` | Reduces minecart tick cost | Affects minecart-heavy builds |
| `CircuitManager` | Manages redstone circuit load | Can throttle clocks players rely on |
| `ChunkSamplerMap` | Feeds per-chunk sampling data | Diagnostic only |

> Enable one feature at a time and re-measure. Turning on five at once makes it impossible to
> tell which one helped and which one broke a player's farm.

## Actions

| Action | Effect |
|---|---|
| `/react action purge-entities` | Kills all entities in the given region |
| `/react action purge-chunks` | Unloads chunks in the given region |
| `/react action collect-garbage` | Runs a JVM GC |

> `purge-entities` is destructive and does not discriminate between mob-farm mobs and a
> player's named pets or item frames. Announce it first.
