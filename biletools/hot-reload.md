---
title: "BileTools — Hot Reload Behaviour"
description: "What hot reload does, what it cannot do, and how to tell when it failed"
published: true
date: 2026-08-09T00:00:00.000Z
tags: "biletools"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

## What happens on a change

1. The watcher polls the plugins directory — every `20` ticks idle, `5` ticks after activity.
2. A changed jar's fingerprint must hold steady for `8` ticks before anything happens, so
   partial writes from a build are ignored.
3. Changes within the `10`-tick coalesce window are batched into one dependency-aware flush,
   so a multi-module build produces one reload rather than several.
4. The plugin is unloaded and reloaded through Paper's public PluginManager path.
5. With `lifecycle.health-check` on, BileTools verifies the plugin actually came back enabled
   and registered. If not, the reload is reported as failed.

New jars appearing in the folder are hot-dropped rather than reloaded.

All lifecycle mutations run on the global/main thread — never on PluginOps or network threads.

## What it cannot do

Hot-unload is best-effort on every platform, because the JVM does not guarantee class
unloading. A plugin that does any of the following can leave residue behind:

- Registers static state that outlives its own classloader
- Spawns threads it does not stop in `onDisable`
- Holds NMS or reflection references into server internals
- Registers protocol listeners through ProtocolLib or packetevents

Symptoms of a failed unload are duplicated event handlers, stale command registrations,
listeners firing twice, and memory climbing across successive reloads. When you see those,
restart. Hot reload is an iteration convenience, not a substitute for a clean boot before
testing anything seriously.

Runtime hot-load also cannot recreate Paper's startup provider graph. BileTools loads missing
`BEFORE`, `AFTER` and `OMIT` dependencies first so the public PluginManager can validate the
target, but the result is not identical to a real startup.

## Folia and Canvas

- Classic `Bukkit.getScheduler()` is never used — it throws `UnsupportedOperationException`
  on regionized servers. BileTools uses the GlobalRegionScheduler.
- Player sounds and messages that touch entities are routed through the entity scheduler.
- Third-party plugins without `folia-supported: true` may still fail when hot-loaded.
- Reloading on a regionized server is inherently riskier than on single-threaded Paper.

## Spigot

`paper-plugin.yml`-only jars are rejected outright. Jars shipping both descriptors load
through `plugin.yml`.

## Excluding a plugin

Add its name to `watcher.ignore`, or set `watcher.only` to an allowlist. Manual
`/bile load|unload|reload` bypasses both filters, so you can still act on an ignored plugin
deliberately.
