---
title: "GamemodeSwitcher: Gestures and operations"
description: "Default key gestures, event handling, and troubleshooting"
published: true
date: 2026-09-14T00:37:05.831Z
tags: "gamemodeswitcher, gestures, operations, folia"
editor: markdown
dateCreated: 2026-09-10T18:30:00.000Z
---

GamemodeSwitcher listens for the swap-hands key and sneak presses. The default swap-hands key is F; the player's Minecraft key bindings determine the actual key. Gestures do not require a client mod.

## Default gestures

| Starting mode | Double swap | Sneak + double swap |
| --- | --- | --- |
| Survival | Creative | Adventure |
| Creative | Survival | Spectator |
| Adventure | Creative | Survival |

In spectator, press sneak three times to return to creative. Releases do not count. Each press must occur within the configured interval after the previous press. This avoids depending on swap-hands packets that spectator clients may not send.

Both ordinary hand swaps retain Minecraft's normal behavior, so a complete double tap restores the original hand arrangement. A single or expired tap remains an ordinary swap. Changing the starting mode or switching between normal and sneaking gestures starts a new sequence. Cancelled swap and sneak events do not trigger mode changes.

`/gsw toggle` persists a personal gesture opt-out. It does not disable direct commands or the selector. The server's global enable setting and disabled-world list govern every plugin mode change. The empty-hands setting affects gestures only.

## Changing gesture keys

Each player can change the physical keys through Minecraft's controls, as described in the [official controls guide](https://www.minecraft.net/en-us/article/minecraft-controls).

1. Open Options, then Controls, then Key Binds.
2. Change Swap Item With Offhand (F by default) and Sneak (Left Shift by default) to your preferred keys, resolving any conflicting bindings.
3. Use the same gestures with those keys: double-tap the offhand key, hold your sneak key while double-tapping for alternate destinations, or enter sneak three separate times to leave Spectator.

For example, if you bind Swap Item With Offhand to G, double-tap G for the normal action and hold your sneak key while double-tapping G for the alternate action. This also changes Minecraft's ordinary offhand swap control. GamemodeSwitcher receives the resulting swap and sneak actions, so no server restart or plugin setting change is needed. Independent plugin-only keyboard bindings require a client modification.

## Other plugins and lifecycle

Mode changes use Bukkit's normal API and respect cancellation by another plugin. Success feedback, sounds, creative-flight activation, and cooldown only occur when the destination actually becomes active. GamemodeSwitcher does not forcibly remove another plugin's flight permission when leaving creative.

The [Switch feedback settings](/gamemodeswitcher/01-installation-configuration#switch-feedback) choose chat, action bars, and titles, plus the success sound, volume, and pitch. Titles and action bars are enabled by default; feedback never opens the selector. Use `/gsw menu` to open it explicitly. Turn chat feedback off to keep switching messages out of chat; unsuccessful attempts explain their reason above the hotbar. Every feedback setting applies automatically after saving.

Gesture and cooldown state uses UUIDs and clears on logout, death, world changes, and successful configuration reloads. Queued gestures are also invalidated when another plugin changes the player's mode, including a change away and back before the scheduled action executes. Player operations run on their owning entity thread on Folia. Preferences save through a separate writer and finish during shutdown; configuration and language editing use validated atomic file replacement.

## Diagnostics

`/gsw debug dump` saves a report through the shared VolmLib diagnostic service and requests a public mclo.gs upload by default. Use `/gsw debug dump upload=false` to keep a report local, or set `diagnostics.upload-enabled=false` to block uploads server-wide. The shared `/volmit` diagnostic picker also exposes GamemodeSwitcher. Reports include platform/runtime details, active settings, transitions, language availability, bStats state, and transient state counts. They do not include the personal gesture preference file.

bStats uses plugin ID `33967` and respects both `metrics.enabled` and the shared `plugins/bStats/config.yml` opt-out. Changes to either file apply automatically. Invalid shared bStats configuration retains the previous metrics state and logs the failure.

If gestures do not work, check `/gsw status`, personal opt-out, both required permissions, world restrictions, empty-hand requirements, timing, and the cooldown. Use `/gsw set creative` to distinguish gesture recognition from permission or mode-change cancellation. Check the console for failed reload or persistence stacktraces.

[Installation and configuration](/gamemodeswitcher/01-installation-configuration) · [Commands and permissions](/gamemodeswitcher/02-commands-permissions)
