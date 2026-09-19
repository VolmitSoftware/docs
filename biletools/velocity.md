---
title: "Velocity Proxy"
description: "Hot reload for proxy plugins on Velocity"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "biletools, velocity"
editor: markdown
dateCreated: 2026-09-16T00:00:00.000Z
---

The same BileTools jar runs on Bukkit servers and on Velocity proxies. On the proxy it loads, unloads, and reloads proxy plugins, either from the `/biletools` command or automatically when a plugin jar in the proxy's `plugins/` directory changes.

## Requirements

| | |
|---|---|
| Proxy | Velocity 3.4 or newer, including 4.x |
| Proxy JVM | Whatever the proxy build requires (Velocity 4.x runs on Java 25); the plugin is built for Java 17 and newer |
| Jar | The same `BileTools-x.x.x.jar` used on Bukkit servers |

## Install

1. Copy the jar into the proxy's `plugins/` directory.
2. Start the proxy. BileTools writes `plugins/biletools/biletools.json` on first run.
3. Build a proxy plugin into the same `plugins/` directory, or use `/bile reload <id>`.

Backend servers need nothing. A backend BileTools installation keeps its own separate settings, described in [Installation](/biletools/installation).

## What a reload does

Unloading sends the plugin a shutdown event scoped to it alone, then unregisters its listeners, cancels its tasks, removes its commands, drops it from the plugin manager, and closes its class loader. Loading registers it and sends a scoped initialize event. No other plugin sees either event.

Plugins that depend on the target are unloaded first and reloaded afterwards, in dependency order.

## Startup capability report

BileTools logs one summary line at startup saying which proxy internals it could resolve. If your proxy build is missing something it needs, the log names it and any operation that depends on it is refused outright rather than half-applied. Check that line first after updating the proxy.

## Commands

The root command is `/biletools`, with one alias, `bile`. Every subcommand requires `bile.use`.

| Command | Description |
|---|---|
| `/biletools load <jar or id>` | Load a plugin from the proxy's plugins directory |
| `/biletools unload <id>` | Unload a loaded plugin |
| `/biletools reload <id>` | Unload a loaded plugin and load it again |
| `/biletools list` | List loaded plugins and the watcher state |
| `/biletools version` | Show the installed BileTools version |
| `/biletools help` | List the proxy subcommands |

`biletools` and `bile` are the only two aliases on the proxy. A proxy command takes precedence over a backend command with the same name, so the short server-edition aliases are not registered there; they would shadow backend commands for every connected player.

Command results go to the proxy console. With `notifications.players` enabled, automatic reload results also reach every player holding `bile.use`.

## Settings

Proxy settings live in `plugins/biletools/biletools.json`. Missing keys are restored with their defaults on load.

| Key | Default | Effect |
|---|---|---|
| `watcher.enabled` | `true` | Watch the plugins directory and reload changed jars automatically |
| `watcher.idle-poll-millis` | `1000` | Check interval when no work is pending. Clamped to 100–60000 |
| `watcher.active-poll-millis` | `250` | Check interval while a change is being processed. Clamped to 50 up to the idle interval |
| `watcher.fingerprint-debounce-polls` | `8` | Consecutive unchanged checks required before a jar is staged. Clamped to 1–200 |
| `watcher.ignore` | `[]` | Plugin ids the watcher never manages automatically |
| `watcher.only` | `[]` | If non-empty, switches to allowlist mode: only these ids are managed automatically |
| `archive-plugins` | `true` | Move a plugin's working copy to `plugins/biletools/archive/` when it is unloaded instead of deleting it |
| `lifecycle.health-check` | `true` | Fail the operation if the plugin is not actually registered and running afterwards |
| `lifecycle.operation-timeout-seconds` | `120` | Give up on a plugin that never returns from its initialize or shutdown event. Clamped to 5–3600 |
| `observability.log-timings` | `true` | Log one timing line per load, unload, and reload |
| `notifications.players` | `true` | Send automatic reload results to players with `bile.use`, not just the console |
{.dense}

Plugin ids are matched without case. Manual commands ignore `watcher.ignore` and `watcher.only`; those two lists control only automatic work.

## How automatic reload behaves

Manual commands run immediately. Automatic work waits.

When a jar changes, BileTools waits for it to stop changing, then applies queued changes in one batch. A jar identical to what is already loaded is skipped. Deleting a jar unloads that plugin after a three-second grace period, unless the file reappears first.

A plugin whose automatic reload fails is marked dirty and left alone until a manual `/bile load`, `/bile unload`, or `/bile reload` succeeds, so a broken build is not retried on every save.

Jars without a `velocity-plugin.json` descriptor are ignored, including Bukkit-only jars left in the proxy's plugins directory.

BileTools loads each plugin from its own working copy under `plugins/biletools/runtime-plugins/`, so replacing the original jar never fights a file the JVM still holds open. Jars are copied to `plugins/biletools/watcher-stage/` while they are being inspected; those copies are removed once the batch is applied.

## Limits

BileTools cannot reload itself on the proxy. When its own jar changes it logs a notice asking for a proxy restart and does nothing else. `/bile reload biletools` is refused.

Remote deploy is not available on the proxy. The listener and the push side are server-edition features.

Proxy output is English only. There are no language files and no language commands.

Plugin message channels stay registered after their plugin unloads. Re-registering on load is harmless, so this costs nothing in practice.

A plugin that reads its shutdown event as "the proxy is stopping" can misbehave after a reload. Plugins holding static state, running threads, or hooking packets are poor reload candidates, the same as on a backend server.

## When to restart the proxy

Restart the proxy when:

- the BileTools jar itself changed;
- the capability report names a missing internal after a proxy update;
- an unload reported failures in the log, and the plugin was still dropped;
- a plugin's dependencies changed, since boot-time dependency ordering cannot be recreated at runtime;
- you see duplicate listeners or commands, stale behavior, or memory that keeps growing across reloads.

Related pages: [Commands and permissions](/biletools/commands), [Configuration](/biletools/configuration), [Hot reload behavior](/biletools/hot-reload).
