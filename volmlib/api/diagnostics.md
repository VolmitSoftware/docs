---
title: "Shared diagnostic reports"
description: "Debug dump commands, permissions, report contents, and the Bukkit diagnostics API"
published: true
date: 2026-09-03T05:03:58.777Z
tags: "volmlib, api, diagnostics"
editor: markdown
dateCreated: 2026-09-03T04:58:11.006Z
---

VolmLib provides a common diagnostic report service for the Bukkit versions of Adapt, BileTools, Gloss, HiddenOre, Iris, React, ShapedPortals, and Wormholes. Reports combine server and JVM information with plugin-owned diagnostic state, save a local file, and upload to public mclo.gs by default.

## Commands and permissions

Run a plugin's `debugdump` command to save and upload its report, or append `upload=false` to keep the report local. Both players and console can invoke the command. Each permission defaults to `op` and is checked independently of that plugin's root administration permission.

| Command | Permission |
|---|---|
| `/adapt debugdump [upload=true]` | `adapt.debugdump` |
| `/biletools debugdump [upload=true]` | `biletools.debugdump` |
| `/gloss debugdump [upload=true]` | `gloss.debugdump` |
| `/hiddenore debugdump [upload=true]` | `hiddenore.debugdump` |
| `/iris debugdump [upload=true]` | `iris.debugdump` |
| `/react debugdump [upload=true]` | `react.debugdump` |
| `/sp debugdump [upload=true]` | `shapedportals.debugdump` |
| `/wormholes debugdump [upload=true]` | `wormholes.debugdump` |

These commands use the Bukkit service; Iris's mod-loader command trees do not expose this service. Existing gameplay debug toggles and debug subcommands remain separate from report generation.

## Saving and uploading

The service writes a timestamped `.txt` report atomically under the plugin data folder's `debug/` directory before attempting upload. Players receive a control to copy the report's relative path. A successful upload returns controls to open and copy the report link; console receives the path and link as plain text. An upload failure leaves the saved report available locally and reports the failure in the console.

Uploads require both the command's `upload` flag and the service's `uploadEnabled` supplier to return `true`. The default service allows uploads. ShapedPortals connects that supplier to `debug.uploadEnabled`, so `/sp debugdump upload=true` cannot override a disabled setting. `/sp debugdump upload=false` suppresses upload for a single report.

Only one report per service can be prepared at a time. A concurrent request is rejected while the active report is being captured, written, or uploaded.

## Report contents

The shared report includes:

- Plugin identity and version, report timestamp, and sender type.
- Server implementation, Minecraft and Bukkit versions, scheduler type, selected server settings, player and world counts, and TPS/MSPT when supported.
- Installed plugin versions, enable states, entry classes, authors, load order, API versions, and dependencies.
- Java and operating-system versions, runtime, CPU, memory pools, garbage collectors, buffer pools, and storage capacity.
- Known configuration-file metadata and bounded SHA-256 hashes, plus plugin artifact filename, size, timestamp, and hash.
- Additional diagnostic state supplied by the plugin.

Known-file inspection reports relative names, sizes, modification times, and hashes; it does not copy file contents. `DebugDumpReport.describeFiles(...)` examines at most 32 supplied paths and hashes regular files up to 16 MiB each. Paths outside the supplied directory and symbolic links are not followed. Artifact hashing is bounded at 512 MiB. Plugin contributors may add selected effective settings and state separately from file inspection.

## Service integration

The entry point is `art.arcane.volmlib.util.diagnostics.BukkitDebugDump`.

| API | Contract |
|---|---|
| `BukkitDebugDump.create(plugin)` | Create the service with uploads enabled and no additional plugin details |
| `BukkitDebugDump.create(plugin, options)` | Create the service with typed upload policy and a diagnostic contributor |
| `new BukkitDebugDump.Options(uploadEnabled, contributor)` | Supply a `BooleanSupplier` and `DebugDumpContributor` |
| `request(sender, upload)` | Check the dedicated permission, capture state, then save and optionally upload a report |
| `permission()` | Return the plugin's lowercase name followed by `.debugdump` |
| `close()` | Close the service during plugin shutdown |

Creation registers the derived permission with default `OP` if the plugin descriptor does not already declare it. The plugin owns command registration and must route `debugdump` before applying its root administration gate. The report command should default its boolean `upload` argument to `true`; the service enforces the dedicated permission itself.

## Clipboard controls

`ComponentText.clickCopyToClipboard(text)` attaches a clipboard action to an immutable text component. `ComponentMessenger.sendCopyToClipboard(player, message, text, hover)` sends that action with hover text, using Paper rich messages or Spigot components as available. The player's client copies the supplied text when the player clicks the control; console output remains plain text.

## Capturing plugin details

`DebugDumpContributor.capture()` runs on the global scheduler and returns a `DebugDumpContributor.Report`. `Report.render()` runs on the asynchronous worker. Capture immutable values or copies of safely readable plugin state, then format those captured values in `render()`. Do not access live region-owned world or entity state from the global capture or asynchronous render callback.

The shared service captures Bukkit state on the global scheduler, performs formatting, hashing, file writes, and network upload off gameplay threads, and delivers player feedback through the player's entity scheduler. Contributor failures retain the common report with a failure marker and emit the full exception to the console. Call `close()` during shutdown to prevent new work and suppress later command feedback.
