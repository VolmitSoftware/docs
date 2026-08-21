---
title: "BileTools — Hot Reload Behavior"
description: "What hot-reload does, what it cannot do, and how to tell when it failed"
published: true
date: 2026-08-20T00:00:00.000Z
tags: "biletools"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

## What happens on a change

1. A native directory watcher receives direct `.jar` create, modify, and delete
   events. A reconciliation scan runs every 2.5 seconds to recover from missed
   or overflowed events, unavailable native watching, and deletion or
   recreation of the `plugins/` directory.
2. A changed jar's file stamp must remain stable for the configured fingerprint
   checks. BileTools then copies the bytes off-thread into an immutable staged
   jar, computes its SHA-256 fingerprint, validates its descriptor, and retries
   if the source changed while it was being copied. Non-jar temporary files,
   including `.jar.part`, are ignored.
3. Automatic changes are generation-ordered and coalesced by plugin. After a
   batch finishes, another automatic batch cannot start for three seconds. Only
   one batch runs at a time, and changes that arrive during it become one
   latest-wins trailing batch instead of being discarded.
4. A removed jar becomes a three-second deletion tombstone. Recreating the same
   path or plugin during that grace period cancels the unload.
5. Each batch unloads dependents before their dependencies, then loads or
   reloads dependencies before their dependents. Plugin lifecycle work runs on
   the global/main thread from the accepted immutable snapshot.
6. If `lifecycle.health-check` is on, BileTools verifies the plugin is enabled
   and registered. If the check fails, BileTools reports the reload as failed.

A new jar is hot-loaded, an existing plugin is reloaded, and a removed plugin is
unloaded after the deletion grace period. Manual `/bile load`, `/bile unload`,
and `/bile reload` operations remain immediate and are not subject to the
automatic three-second cadence.

BileTools runs all lifecycle mutations on the global/main thread. BileTools
never runs them on PluginOps or network threads.

## Snapshot and filename behavior

BileTools loads from a retained runtime copy of the accepted snapshot. The
authoritative jar in `plugins/` therefore remains replaceable by builds, FTP
uploads, and atomic rename workflows even while the plugin is active.
BileTools preloads every loadable startup-archive class, including nested
watcher records, and caches all bundled language resources before it starts the
watcher. A complete valid BileTools jar can therefore be copied directly over
the live authoritative path without making the active instance resolve a lazy
class or locale resource from partially replaced bytes.

Remote deploy sends the same accepted snapshot under the authoritative source
filename. Internal staging names are never installed as plugin filenames.

If a jar changes its declared plugin name, BileTools treats that as an identity
replacement rather than an independent unload and load. The new descriptor must
list the old name and every prior provided alias in `provides`; BileTools then
correlates same-path and renamed-jar deployments, swaps the provider atomically,
and reloads its unchanged dependents from retained runtime copies. Without those
explicit aliases, the old provider remains loaded and a full restart is required.
For copy-new-then-delete-old deployments, the staged replacement waits until the
old source disappears. Replacing more than one loaded canonical plugin identity
with one jar is restart-only.

Before BileTools reloads itself, it writes an atomic watcher handoff containing
the last applied fingerprints, tracked plugin names, and pending paths. The new
instance compares that baseline with current jar content and requeues creations,
updates, or deletions that occurred during either automatic or manual self-reload.
An automatic self-reload keeps the replacement queue gated while BileTools
reloads its dependents and verifies health, then starts the full three-second
cooldown only after that complete reload call returns. If the server refuses
either the direct or remote-deploy self-reload handoff task, the exact staged
jar remains queued.

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
