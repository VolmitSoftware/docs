---
title: "GamemodeSwitcher: Gestures and operations"
description: "Default key gestures, event handling, and troubleshooting"
published: true
date: 2026-09-19T00:00:00.000Z
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

In spectator, press sneak three times to return to creative; releases do not count, and each press must land within `gestures.sneak-tap-millis` of the last one.

A double tap swaps your hands twice, so your hands end up as they started. A single or expired tap is just an ordinary swap.

`/gsw toggle` persists a personal gesture opt-out. It does not disable direct commands or the selector. The server's global enable setting and disabled-world list govern every plugin mode change. The empty-hands setting affects gestures only.

## Changing gesture keys

Each player can change the physical keys through Minecraft's controls, as described in the [official controls guide](https://www.minecraft.net/en-us/article/minecraft-controls).

1. Open Options, then Controls, then Key Binds.
2. Change Swap Item With Offhand (F by default) and Sneak (Left Shift by default) to your preferred keys, resolving any conflicting bindings.
3. Use the same gestures with those keys: double-tap the offhand key, hold your sneak key while double-tapping for alternate destinations, or enter sneak three separate times to leave Spectator.

For example, if you bind Swap Item With Offhand to G, double-tap G for the normal action and hold your sneak key while double-tapping G for the alternate action. This also changes Minecraft's ordinary offhand swap control. GamemodeSwitcher receives the resulting swap and sneak actions, so no server restart or plugin setting change is needed. Independent plugin-only keyboard bindings require a client modification.

## Other plugins and lifecycle

Mode changes go through Bukkit's normal API, so another plugin can cancel one. Feedback, sound, creative flight, and the cooldown only happen if the mode actually changed. Leaving creative does not strip flight another plugin granted.

Gesture and cooldown state clears on logout, death, world change, and a successful configuration reload. A queued gesture is dropped if another plugin changes your mode first.

See [Switch feedback](/gamemodeswitcher/01-installation-configuration#switch-feedback) for the chat, action bar, title, and sound settings.

## Diagnostics

`/gsw debug dump` saves a report and uploads it to mclo.gs by default. Use `upload=false` for a local-only report, or set `diagnostics.upload-enabled = false` to block uploads server-wide. Reports cover platform and runtime details, active settings, transitions, language availability, and bStats state. They never include the personal gesture preference file. See [Shared diagnostic reports](/volmlib/api/diagnostics).

bStats uses plugin ID `33967` and respects both `metrics.enabled` and the shared `plugins/bStats/config.yml` opt-out.

If gestures do not work, check `/gsw status`, personal opt-out, both required permissions, world restrictions, empty-hand requirements, timing, and the cooldown. Use `/gsw set creative` to distinguish gesture recognition from permission or mode-change cancellation. Check the console for failed reload or persistence stacktraces.

[Installation and configuration](/gamemodeswitcher/01-installation-configuration) · [Commands and permissions](/gamemodeswitcher/02-commands-permissions)
