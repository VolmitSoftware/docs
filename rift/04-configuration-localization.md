---
title: "Rift: Configuration and Localization"
description: "TOML settings, automatic hot reload, in-game editing, and language files"
published: true
date: 2026-10-09T23:55:00.000Z
tags: "rift, configuration, hot-reload, localization, gui"
editor: markdown
dateCreated: 2026-08-28T00:00:00.000Z
---

Rift writes `config.toml` on first start and reloads valid external edits automatically. Invalid or incomplete saves leave the current settings active.

## Settings

| Setting | Default | Range or effect |
|---|---:|---|
| `language` | `en_US` | Safe locale identifier selecting the server-default `languages/<locale>.toml` |
| `hotReloadPollMillis` | `1000` | Clamped to 250–10,000 ms |
| `hotReloadCooldownMillis` | `1500` | Clamped to 250–30,000 ms |
| `autoLoadManagedWorlds` | `false` | Load profiles whose `autoLoad` field is true during startup; missing-profile reconciliation still runs when disabled |
| `evacuationWorld` | empty | Managed command name or full key of a loaded destination; empty selects the primary world |
| `firstJoinDestination` | empty | Loaded destination on a player's first join; empty keeps normal joining behavior |
| `loginDestination` | empty | Loaded destination on later logins; empty keeps the saved location |
| `allowWorldDeletion` | `true` | Permit confirmed quarantine operations |
| `deleteConfirmationSeconds` | `30` | Clamped to 10–300 seconds |
| `splashScreen` | `true` | Print the two-tone Rift startup banner; the separate ready-duration line always prints after successful startup |
| `titlePopups` | `true` | Show title/subtitle feedback for enabled event groups |
| `actionBarPopups` | `true` | Publish feedback through VolmLib's shared HUD arbitration |
| `sounds` | `true` | Play the configured feedback sounds |
| `worldLifecycleFeedback` | `true` | Feedback for create, import, load, unload, quarantine, and restore |
| `teleportFeedback` | `true` | Feedback after a successful teleport |
| `failureFeedback` | `true` | Feedback after a failed operation |
| `worldLifecycleSound` | `block.beacon.activate` | Namespaced sound key for lifecycle success |
| `teleportSound` | `entity.enderman.teleport` | Namespaced sound key for teleport success |
| `failureSound` | `block.note_block.bass` | Namespaced sound key for failure |
| `soundVolume` | `0.8` | Clamped to 0–4 |
| `soundPitch` | `1.0` | Clamped to 0.5–2 |
| `titleFadeInTicks` | `10` | Clamped to 0–200 ticks |
| `titleStayTicks` | `40` | Clamped to 1–1,200 ticks |
| `titleFadeOutTicks` | `10` | Clamped to 0–200 ticks |
| `verbose` | `false` | Log successful lifecycle and hot-reload details |
| `debugUploadEnabled` | `true` | Permit `/rift debug dump` and shared debug requests to upload after saving locally; a command may still pass `upload=false` |
| `bstatsEnabled` | `true` | Submit standard anonymous usage metrics for bStats plugin id `33701`; the global bStats opt-out also applies |

Saving config, the active locale, a world profile, or a quarantine manifest triggers automatic reload. Automatic reload cannot be disabled. Invalid files leave the previous runtime state active.

Rift does not overwrite HUD or title feedback from Adapt, React, or other supported Volmit plugins.

## Global policies

The `[globalPolicy]` table controls world-wide rules shared by Rift and the Multiverse configuration API. Values are validated before the configuration becomes active.

| Setting | Default | Effect |
|---|---:|---|
| `enforceAccess` | `true` | Check managed-world access permissions. Lifecycle-owner availability is always required |
| `enforceGameMode` | `true` | Apply and enforce each world's explicit game mode |
| `enforceFlight` | `true` | Apply and enforce each world's explicit flight rule |
| `gamemodeAndFlightEnforceDelay` | `0` | Delay player policy application by 0–1,200 ticks |
| `applyEntitySpawnRate` | `true` | Apply configured world spawn intervals |
| `applyEntitySpawnLimit` | `true` | Apply configured world spawn limits |
| `firstSpawnOverride` | `true` | Enable the global first-join destination |
| `firstSpawnLocation` | empty | Override `firstJoinDestination` with a loaded world selector |
| `enableJoinDestination` | `true` | Enable the global login destination |
| `joinDestination` | empty | Override `loginDestination` with a loaded world selector |
| `useFinerTeleportPermissions` | `true` | Require destination-specific teleport permissions when checking teleport permission |
| `safeLocationHorizontalSearchRadius` | `2` | Nearby safe-location search radius, 0–8 blocks |
| `safeLocationVerticalSearchRadius` | `8` | Nearby safe-location vertical range, 0–32 blocks |
| `teleportCooldownMillis` | `1000` | Cooldown used by the Multiverse 4 player-session API, 0–300,000 milliseconds |
| `messageCooldownMillis` | `5000` | Cooldown used by the Multiverse messaging API, 0–300,000 milliseconds |

Per-world first-join and login destinations take precedence over global destinations. Disabling a global destination also disables its top-level fallback setting.

The integration API reports which additional global policy families have runtime support. Setters for unavailable families return failures and leave canonical settings unchanged. Automatic world import and generator discovery are disabled; integration calls cannot enable startup scans.

## In-game editor

`/rift config` opens the settings dashboard. General → Global World Policies opens the supported world-enforcement, spawn-application, and join-destination controls. Click booleans to toggle them, use left or right click for numbers, shift-click for larger changes, or press Q to enter an exact value. Text settings use a private chat prompt. Valid changes save and apply immediately.

Changing `bstatsEnabled` takes effect immediately and still honors `plugins/bStats/config.yml`. Rift does not register custom charts.

The Language setting opens the server-default picker. `/rift language` manages a player's language, the server default, and message files. Personal choices affect that player only; console and players without a choice use the server default.

Languages and Messages opens the shared editor. It groups message IDs, supports search, and shows the allowed placeholders for each message.

Message input is limited to 512 characters. Use `\n` for a line break, `\\` for a backslash, or `cancel` to stop. Saves are atomic, stale edits are rejected, and opening a locale does not select it.

Enter `primary` or `none` for the evacuation world to clear the explicit destination. Locale changes apply immediately.

## Language overrides

Rift's server default is the `language` setting above. `runtime.prefix` sets the displayed plugin
name and its formatting per locale; remove `{prefix}` from a message to hide the label there.

See [Languages](/languages).

