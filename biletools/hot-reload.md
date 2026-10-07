---
title: "BileTools: Hot Reload Behavior"
description: "What hot-reload does, what it cannot do, and how to tell when it failed"
published: true
date: 2026-10-07T14:11:48.233Z
tags: "biletools"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

BileTools watches the server's `plugins/` folder. Adding, replacing, or deleting a jar loads, reloads, or unloads that plugin after the file stops changing. Manual lifecycle commands enter the operation queue without the watcher's file-stability delay.

## Reload operations

BileTools checks replacement jars, required dependencies, and plugin identities before calling cooperative preparation or unloading the running group. Missing required dependencies, required-dependency cycles, self-dependencies, and conflicting plugin names or provided aliases refuse the operation. Dependents unload first and load after their dependencies. Plugins implementing the [cooperative reload API](/volmlib/api/reloading) can finish asynchronous work or refuse the operation before teardown begins.

A refused preparation leaves the group loaded and cancels completed preparations. Once committed cleanup starts, a failure can require rebuilding the group from its recovery copies. Client command suggestions refresh after the operation; command ownership determines which aliases are removed.

A fresh load cannot claim a plugin name that an already loaded plugin provides as an alias. Reloading an existing plugin uses its own identity and includes its affected dependents.

A failed automatic load or reload pauses further automatic replacements for that plugin, even when recovery restores its previous version. Deploy a working jar and complete `/bile reload PluginName`, or `/bile load PluginName` if it is unloaded, to resume automatic replacements.

Use `/bile inspect <plugin>` to view the plugin's enabled state, affected dependents, recovery-copy availability, cooperative reload support, and teardown capability. Inspection does not load or unload the plugin.

## Recovery copies

BileTools retains copies of running plugin jars for the current server session. Replacing a plugin requires recovery copies for the entire affected group. If replacement fails after teardown starts, BileTools attempts to restore that group's previous versions and reports any restoration failures.

Recovery restores plugin code, dependency relationships, and provided plugin aliases. It cannot undo database migrations, configuration writes, world edits, network requests, or other effects performed by a plugin. It also leaves the deployed source jars on disk unchanged; replace a failed deployment with working jars before restarting the server.

Continue replacing jars at their original `plugins/` paths after recovery or a BileTools self-reload. Subsequent operations use those source paths, including for plugins that Paper has remapped.

A lifecycle operation has a 120-second deadline on Bukkit servers. An expired queued operation never starts. If a running asynchronous preparation or cleanup exceeds its deadline, BileTools reports failure and refuses further lifecycle operations until that work settles and cancellation or recovery finishes. A callback that never finishes requires a server restart.

## Platform support

Spigot loads Bukkit plugins through `plugin.yml`. Its staged runtime jars use symbolic links to the existing plugin data directories, so the server process must be permitted to create those links; BileTools checks this before teardown. Source jars and plugin data remain in their normal locations. Folia requires a target plugin that supports Folia and performs its own entity and region cleanup on the correct owning threads.

On Paper, a dual-descriptor plugin can reload through its authored `plugin.yml`. This route does not replay its Paper bootstrapper or custom classpath loader. If the running instance uses Paper's native classloader, teardown also requires the tested Paper build below; other builds require a restart even when the jar has both descriptors. A Paper-only plugin needs the explicit native-runtime contract below; otherwise installation or replacement requires a restart.

Plugins retaining static state, private threads, server-internal references, or packet hooks need their own cleanup. Reloading Gloss disconnects existing players because its bundled packet library closes their connections during initialization; reconnect after the reload finishes. Changing startup-only registries or dependency arrangements that require server boot also requires a restart.

## Experimental native Paper loading

Native runtime loading is limited to the exact Paper 26.3 build 142 runtime. Other Paper builds, forks, Spigot, and Folia do not use this path. This is an experimental capability gate, not a compatibility guarantee for every plugin on that build.

The plugin author opts in through `paper-plugin.yml`:

```yaml
biletools:
  runtime-load: true
  runtime-bootstrap: true
  runtime-classpath: true
```

`runtime-load` is required. `runtime-bootstrap` is additionally required when the plugin declares a bootstrapper, and `runtime-classpath` when it declares a custom loader. These declarations assert that the corresponding work can run repeatedly after startup. A plugin without either entrypoint can omit its corresponding flag.

Native runtime plugins may register the Paper `COMMANDS` lifecycle event. Other lifecycle event registrations require a restart. An opt-in does not make startup registry mutations reversible or make a startup-only bootstrapper suitable for hot loading. See [Plugin integration API](/biletools/api) for the author contract.

## Exclude plugins

Add plugin names to `watcher.ignore`, or use `watcher.only` as an allowlist. These lists control automatic operations; manual commands bypass them. Capability checks and cooperative refusal still apply to manual commands.

## Velocity proxies

The proxy edition has its own lifecycle events, recovery copies, and timeout setting. It cannot reload itself. See [Velocity proxy](/biletools/velocity).
