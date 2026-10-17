---
title: "Rift: Configuration and Localization"
description: "Settings, hot loading, language selection, and message editing"
published: true
date: 2026-10-14T00:00:00.000Z
tags: "rift, configuration, hot-reload, localization, gui"
editor: markdown
dateCreated: 2026-08-28T00:00:00.000Z
---

Rift creates `plugins/Rift/config.toml` on first start. Valid saved changes apply automatically; invalid or incomplete saves leave the last valid settings active.

## Settings

| Setting | Default | Effect or bounds |
|---|---|---|
| `language` | `en_US` | Server-default locale |
| `updateNotifications` | `true` | GitHub release checks and combined Volmit notices |
| `hotReloadPollMillis` | `1000` | File polling interval, 250-10,000 ms |
| `hotReloadCooldownMillis` | `1500` | Combine rapid saves, 250-30,000 ms |
| `autoLoadManagedWorlds` | `true` | Load profiles whose `autoLoad` flag is true at startup |
| `evacuationWorld` | Empty | Loaded evacuation destination; empty selects the primary world |
| `allowWorldDeletion` | `true` | Allow confirmed quarantine operations |
| `deleteConfirmationSeconds` | `30` | Confirmation window, 10-300 seconds |
| `splashScreen` | `true` | Print the two-color startup banner |
| `titlePopups` | `true` | Title/subtitle feedback |
| `actionBarPopups` | `true` | Feedback through shared HUD coordination |
| `sounds` | `true` | Play feedback sounds |
| `worldLifecycleFeedback` | `true` | Create, import, load, unload, quarantine, and restore feedback |
| `teleportFeedback` | `true` | Successful teleport feedback |
| `failureFeedback` | `true` | Failed-operation feedback |
| `worldLifecycleSound` | `block.beacon.activate` | Lifecycle success sound |
| `teleportSound` | `entity.enderman.teleport` | Teleport sound |
| `failureSound` | `block.note_block.bass` | Failure sound |
| `soundVolume` | `0.8` | 0-4 |
| `soundPitch` | `1.0` | 0.5-2 |
| `titleFadeInTicks` | `10` | 0-200 ticks |
| `titleStayTicks` | `40` | 1-1,200 ticks |
| `titleFadeOutTicks` | `10` | 0-200 ticks |
| `verbose` | `false` | Additional lifecycle and hot-load logging |
| `debugUploadEnabled` | `true` | Permit public mclo.gs uploads after a report is saved |
| `bstatsEnabled` | `true` | Standard anonymous bStats metrics, plugin ID `33701` |

Configuration, installed active language files, world profiles, and quarantine manifests hot-load. There is no manual reload command. The ready-duration console message prints after successful startup even with the splash disabled.

## In-game editors

`/rift config` opens a 54-slot dashboard with centered categories and controls. Every persisted plugin setting has a control. Click booleans to toggle them. Left/right click increases/decreases numbers; shift-click uses a larger step, and the drop-item key opens exact-value input. Text settings use a private chat prompt. Saves apply immediately and send a short change confirmation.

The Language setting opens a clickable server-default picker in the Director chat layout. The Languages and Messages section opens the shared grouped, searchable 54-slot message editor. World Policies opens `/rift policy edit`.

Message edits allow 512 characters. Use `\n` for a line break, `\\` for a backslash, or `cancel` to stop. Saves are atomic, and stale edits are rejected. Opening a locale for editing does not select it.

## Language files

English is generated locally. Other supported languages download from GitHub only when selected or opened for editing. Rift does not install every catalog at startup.

Downloads use the release's pinned Git revision, not a moving branch. Missing translated message keys use the local English catalog. The current published revision predates the update-notification setting label, so that label uses English until a catalog update is published and selected for a later build.

Supported locales are `en_US`, `de_DE`, `es_ES`, `fi_FI`, `fr_FR`, `he_IL`, `it_IT`, `ja-JP`, `ko_KR`, `lt_LT`, `nl_NL`, `pl_PL`, `pt_PT`, `ru_RU`, `tr_TR`, `vi_VI`, `zh_CN`, and `zh_TW`.

Files live at `plugins/Rift/languages/<locale>.toml`. Their headers describe formatting and placeholders. `runtime.prefix` controls the shared label; remove `{prefix}` from an individual message to hide it there.

`/rift language self` selects a personal locale without changing the server default. `/rift language self reset` removes that preference. Console and players without a preference use the server default. See [Languages](/languages) for the shared commands and editing workflow.

## Metrics, reports, and updates

Changing `bstatsEnabled` applies immediately and still honors the global `plugins/bStats/config.yml` opt-out. Rift uses the official bStats runtime without custom charts.

Debug uploads require the global setting and the request's upload flag. Use `/rift debug dump upload=false` to save locally. Reports can contain server paths, world names, and plugin information; review them before sharing.

Update notifications check stable releases from `VolmitSoftware/Rift`. `/volmit plugins updates` shows the shared report. Checks cache results, respect GitHub rate limits, and never install updates. Disabling `updateNotifications` stops Rift's checks and notices.

Next: [World policies](/rift/05-world-policies)
