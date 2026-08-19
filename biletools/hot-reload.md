---
title: "BileTools — Hot Reload Behavior"
description: "What hot-reload does, what it cannot do, and how to tell when it failed"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "biletools"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

## What happens on a change

1. The watcher polls the plugins directory every `20` ticks when idle, and every
   `5` ticks after activity.
2. A changed jar's fingerprint must stay stable for `8` ticks. BileTools
   ignores partial writes from a build.
3. BileTools batches changes in the `10`-tick coalesce window into one
   dependency-aware flush. A multi-module build produces one reload, not
   several.
4. BileTools unloads and reloads the plugin through Paper's public
   PluginManager path.
5. If `lifecycle.health-check` is on, BileTools verifies the plugin is enabled
   and registered. If the check fails, BileTools reports the reload as failed.

BileTools hot-drops new jars in the folder. BileTools does not reload them.

BileTools runs all lifecycle mutations on the global/main thread. BileTools
never runs them on PluginOps or network threads.

## What it cannot do

Hot-unload is best-effort on every platform. The JVM does not guarantee class
unloading. A plugin that does any of the following can leave residue behind:

- Registers static state that outlives its own classloader
- Spawns threads it does not stop in `onDisable`
- Holds NMS or reflection references into server internals
- Registers protocol listeners through ProtocolLib or packetevents

Symptoms of a failed unload are duplicated event handlers, stale command
registrations, listeners firing twice, and memory climbing across successive
reloads. When you see those, restart. Hot-reload is for iteration. It is not a
substitute for a clean boot before serious tests.

Runtime hot-load also cannot recreate Paper's startup provider graph. BileTools
loads missing `BEFORE`, `AFTER`, and `OMIT` dependencies first. The public
PluginManager can then validate the target. The result is not identical to a
real startup.

## Folia and Canvas

- BileTools never uses classic `Bukkit.getScheduler()`. That call throws
  `UnsupportedOperationException` on regionized servers. BileTools uses the
  GlobalRegionScheduler.
- BileTools routes player sounds and messages that touch entities through the
  entity scheduler.
- Third-party plugins without `folia-supported: true` may still fail when
  hot-loaded.
- Reload on a regionized server is riskier than on single-threaded Paper.

## Spigot

BileTools rejects `paper-plugin.yml`-only jars. Jars with both descriptors load
through `plugin.yml`.

## Excluding a plugin

Add the plugin name to `watcher.ignore`. You can also set `watcher.only` to an
allowlist. Manual `/bile load|unload|reload` bypasses both filters. You can
still act on an ignored plugin deliberately.
