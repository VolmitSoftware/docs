---
title: "Shared diagnostic reports"
description: "Debug dump commands, permissions, report contents, and the Bukkit diagnostics API"
published: true
date: 2026-09-04T04:53:00.000Z
tags: "volmlib, api, diagnostics"
editor: markdown
dateCreated: 2026-09-03T04:58:11.006Z
---

VolmLib provides a common diagnostic report service for the Bukkit versions of Adapt, BileTools, Gloss, HiddenOre, Iris, React, Rift, ShapedPortals, and Wormholes. Reports combine server and JVM information with plugin-owned diagnostic state, save a local file, and upload to public mclo.gs by default.

## Commands and permissions

Run a plugin's report command to save and upload its report, or append `upload=false` to keep the report local. Both players and console can invoke the command. Each permission defaults to `op` and is checked independently of that plugin's root administration permission.

| Command | Permission |
|---|---|
| `/adapt debugdump [upload=true]` | `adapt.debugdump` |
| `/biletools debugdump [upload=true]` | `biletools.debugdump` |
| `/gloss debugdump [upload=true]` | `gloss.debugdump` |
| `/hiddenore debugdump [upload=true]` | `hiddenore.debugdump` |
| `/iris debugdump [upload=true]` | `iris.debugdump` |
| `/react debugdump [upload=true]` | `react.debugdump` |
| `/rift debug dump [upload=true]` | `rift.debug` |
| `/sp debug dump [upload=true]` | `shapedportals.debug` |
| `/wormholes debugdump [upload=true]` | `wormholes.debugdump` |

These commands use the Bukkit service; Iris's mod-loader command trees do not expose this service. Existing gameplay debug toggles and debug subcommands remain separate from report generation.

`/volmit plugins debug` opens a Director-styled list of every enabled shared debug provider the sender may use. Click or run `/volmit plugins debug <plugin> [upload=true|false]` to request that plugin's report. `/volmit plugins debug all [upload=true|false]` takes one provider snapshot and prepares every permitted report in tandem; providers the sender cannot use are not included. The command waits for those providers and displays one Director result page with every local path first, followed by every upload link and then any notices or failures. The bottom of that page provides newline-separated Copy All actions for uploaded mclo.gs URLs when present and for every saved local path. Copied upload lines use `<plugin> - <url>` so each report remains identifiable outside Minecraft. One provider failing does not stop the others. The list, hover text, pagination, Back navigation, and tab completion are built from the currently registered providers rather than a fixed plugin list. `/volmit plugins` links this selector beside the shared language selector and provides Back navigation through the shared tool pages.

## Saving and uploading

The service writes the report atomically under the plugin data folder's `debug/` directory before attempting upload. Filenames use `<plugin>-v<version>-debugdump-yyyy-MM-dd-HH-mm-ss.txt` in UTC; they contain neither milliseconds nor a UUID suffix. Players receive the full absolute path and a control that copies it. A successful upload returns one Open control with the public URL visible in its label; its hover shows the URL directly without labeling it as a command. Console receives the path and link as plain text. Public uploads carry `VolmitSoftware - <Plugin> - v<version>` as both their mclo.gs source label and visible report metadata. The create-log API has no title field, so mclo.gs may still derive `Unknown Log` as its page heading when the diagnostic format does not match a known log type. An upload failure leaves the saved report available locally and reports the failure in the console.

Plugins may supply a `BukkitDebugDump.Presentation` to wrap preparation, save, failure, and upload feedback in their own Director theme. Rift and ShapedPortals use this option for their nested debug-command results; providers that omit it retain compact component output.

Uploads require both the command's `upload` flag and the service's `uploadEnabled` supplier to return `true`. The default service allows uploads. Rift and ShapedPortals connect that supplier to their own debug-upload setting, so a command cannot override a disabled setting. Passing `upload=false` suppresses upload for one report.

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
| `new BukkitDebugDump.Options(uploadEnabled, contributor)` | Supply a `BooleanSupplier` and `DebugDumpContributor` with compact default feedback |
| `new BukkitDebugDump.Options(uploadEnabled, contributor, presentation)` | Add a plugin-owned Director command, parent command, theme, and text resolver for result menus |
| `request(sender, upload)` | Check the dedicated permission, capture state, then save and optionally upload a report |
| `permission()` | Return an existing `<plugin>.debug` permission, or derive `<plugin>.debugdump` when none is declared |
| `close()` | Unregister the provider and close the service during plugin shutdown |

Creation registers the permission with default `OP` if the plugin descriptor does not already declare it, then publishes a cross-classloader-safe provider through Bukkit's services registry. The provider exposes the normal request callback and a silent asynchronous result callback made only from JDK and Bukkit types. The latter lets `/volmit plugins debug all` collect reports from separately shaded VolmLib copies and render one result page. The plugin may also keep its own debug command; it should default its boolean `upload` argument to `true`, and the service enforces the dedicated permission itself.

## Clipboard controls

`ComponentText.clickCopyToClipboard(text)` attaches a clipboard action to an immutable text component. `ComponentMessenger.sendCopyToClipboard(player, message, text, hover)` sends that action with hover text, using Paper rich messages or Spigot components as available. The player's client copies the supplied text when the player clicks the control; console output remains plain text.

## Capturing plugin details

`DebugDumpContributor.capture()` runs on the global scheduler and returns a `DebugDumpContributor.Report`. `Report.render()` runs on the asynchronous worker. Capture immutable values or copies of safely readable plugin state, then format those captured values in `render()`. Do not access live region-owned world or entity state from the global capture or asynchronous render callback.

The shared service captures Bukkit state on the global scheduler, performs formatting, hashing, file writes, and network upload off gameplay threads, and delivers player feedback through the player's entity scheduler. Contributor failures retain the common report with a failure marker and emit the full exception to the console. Call `close()` during shutdown to prevent new work and suppress later command feedback.
