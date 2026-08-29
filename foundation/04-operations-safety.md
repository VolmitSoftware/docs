---
title: "Operations, Storage, and Recovery"
description: "Foundation diagnostics, persistence safety, reload behavior, and build gates"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "foundation, operations, storage, recovery"
editor: markdown
dateCreated: 2026-08-28T00:00:00.000Z
---

Foundation treats configuration and player data as recoverable state. Operator-visible failures retain the previous valid runtime where possible and emit full contextual stack traces without flooding repeated hot-path failures.

## Files

| Path under `plugins/Foundation/` | Contents |
|---|---|
| `foundation.toml` | Canonical typed configuration |
| `foundation.toml.last-good` | Previous valid configuration bytes |
| `worth.toml` | Complete categorized item price catalog |
| `worth.toml.last-good` | Previous worth catalog bytes |
| `languages/<locale>.toml` | Complete editable locale selected by `language`; new defaults merge without replacing custom values |
| `debug/foundation-debug-<timestamp>-<id>.txt` | Locally retained sanitized support report |
| `data/locations.json` | Spawn, shared warps, and named jails |
| `data/locations.json.last-good` | Previous location store |
| `data/players/<uuid>.json` | Per-player profile |
| `data/players/<uuid>.json.last-good` | Previous per-player profile |
| `data/kits.yml` | Bukkit item snapshots and kit cooldown definitions |
| `data/kits.yml.last-good` | Previous kit store |

Writes use a temporary file in the destination directory followed by atomic replacement where the filesystem supports it. Existing symbolic links and non-regular targets are rejected.

## Player-data recovery

Profile reads cap files at 1 MiB. If the primary profile is invalid, Foundation attempts the last-good file and queues the recovered profile for a fresh save. If both files are invalid, the UUID enters read-only safety mode; commands may read the in-memory empty state, but mutations fail instead of overwriting the damaged evidence.

Automatic flushes run asynchronously. A failed save remains dirty for retry and is logged through a per-profile throttle.

Profile name lookups and economy leaderboards have explicit scan limits. Offline mail, warnings, mutes, and logout-location lookups run away from the server tick thread, while all resulting player or world access returns through the owning entity or global scheduler.

## Diagnostics

- `/foundation status` shows the plugin version, Java version, and active module count.
- `/foundation modules` shows every module state and failure reason.
- `/foundation doctor` lists only blocked or failed modules.
- `/foundation debug` captures Foundation, platform, loaded plugin, world, JVM, CPU, memory, thread, garbage collector, and filesystem state into a new local report.
- `debug.uploadToMclogs` is disabled by default. When enabled, Foundation uses VolmLib's bounded fixed-HTTPS client and returns the validated `https://mclo.gs/<id>` link; local report creation does not depend on upload success.
- Debug reports omit player names, UUIDs, network addresses, environment variables, JVM arguments, raw configuration, credentials, and the mclo.gs deletion token.
- `runtime.verboseDiagnostics` enables additional non-hot-path lifecycle detail.
- The console splash reports `READY` only when the core and every enabled module start without an isolated failure.
- The splash includes the active/available total for all 17 registered modules and is printed even when startup degrades, so a failed enable still leaves a clear console signature.
- Invalid or temporarily unavailable cosmetic registry values are throttled, logged, and replaced by safe defaults; feedback failures do not propagate into the command or GUI action that requested them.

## Shutdown and code reload

Foundation implements VolmLib's `ReloadAware` contract for BileTools. Pre-unload and normal disable share one atomic drain: configuration, language, and worth watching stop; GUI, input, and cooperative HUD sessions close; PlaceholderAPI unregisters; the public service unregisters; modules drain in reverse order; JSON profile and location stores flush; listeners unregister; and remaining Folia tasks are cancelled.

## Build verification

`./gradlew build` compiles Java 25 sources, runs tests, compiles the shared source against Spigot 26.2, creates the shaded runtime jar, and inspects it. Artifact verification requires both descriptors, Foundation's main and API classes, the unrelocated VolmLib reload contract, and relocated dependency-loading runtime; it rejects unresolved descriptor tokens, bundled server API classes, invalid class files, and class versions newer than Java 25.
