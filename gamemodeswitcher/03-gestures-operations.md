---
title: "GamemodeSwitcher: Gestures and operations"
description: "Default key gestures, event handling, and troubleshooting"
published: true
date: 2026-10-14T00:00:00.000Z
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

In Spectator, press sneak three times to reach `gestures.spectator-exit` (Creative by default), or the previous mode when the tracked session enables restoration. Releases do not count, and each press must land within `gestures.sneak-tap-millis` of the last one.

A double tap swaps your hands twice, so your hands end up as they started. A single or expired tap is just an ordinary swap.

`/gsw toggle` persists a personal gesture opt-out. It does not disable direct commands or the selector. The server's global enable setting and disabled-world list govern every plugin mode change. The empty-hands setting affects gestures only.

## Changing gesture keys

Each player can change the physical keys through Minecraft's controls, as described in the [official controls guide](https://www.minecraft.net/en-us/article/minecraft-controls).

1. Open Options, then Controls, then Key Binds.
2. Change Swap Item With Offhand (F by default) and Sneak (Left Shift by default) to your preferred keys, resolving any conflicting bindings.
3. Use the same gestures with those keys: double-tap the offhand key, hold your sneak key while double-tapping for alternate destinations, or enter sneak three separate times to leave Spectator.

For example, bind Swap Item With Offhand to G, then double-tap G or hold sneak and double-tap G. This changes Minecraft's ordinary swap control too and takes effect immediately. Separate plugin-only keyboard bindings require a client mod.

## Spectator sessions

Enable `spectator.restore-previous-mode` to remember the previous mode, `spectator.return-to-origin` to return to the entry location, or both. Both settings default to off and are captured when GSW starts a session. `/gsw return` uses that session; leaving Spectator through another GSW mode selection also returns to the saved location when origin return is enabled.

Sessions survive reconnects and restarts in `data/spectator-sessions.toml`. Death or an external mode change ends the session. Changes to the two session settings affect new sessions. `spectator.allow-unsafe-return` defaults to `true` and applies to existing sessions immediately; set it to `false` to require clear air, solid ground, and a destination inside the world border. These checks are conservative and can reject slabs, stairs, or vegetation.

A missing world, blocked world, cancelled teleport, or failed safety check keeps the player in Spectator with the session available to retry. Return attempts recheck permissions before changing mode. A failure after teleporting may leave the player at the origin in Spectator.

## Other plugins

Mode changes go through Bukkit's normal API, so another plugin can cancel one. Feedback, sound, creative flight, and the cooldown only happen if the mode actually changed. Leaving creative does not strip flight another plugin granted.

Gesture and cooldown state clears on logout, death, world change, and a successful configuration reload. A queued gesture is dropped if another plugin changes your mode first.

See [Switch feedback](/gamemodeswitcher/01-installation-configuration#switch-feedback) for the chat, action bar, title, and sound settings.

## Diagnostics

`/gsw debug dump` saves a report and uploads it to mclo.gs by default. Use `upload=false` for a local-only report, or set `diagnostics.upload-enabled = false` to block uploads server-wide. Reports cover platform and runtime details, active settings, configured transitions, transient gesture/cooldown counts, language availability, and bStats state. They do not provide a history of failed switches or individual Spectator session details. The personal preference file is not included. See [Shared diagnostic reports](/volmlib/api/diagnostics).

bStats uses plugin ID `33967` and respects both `metrics.enabled` and the shared `plugins/bStats/config.yml` opt-out.

If gestures fail, run `/gsw status` and check your personal gesture toggle, permissions, world restrictions, empty-hand requirement, timing, and cooldown. Try `/gsw set creative`: if that works, check the gesture settings; if it fails, check the displayed reason and other plugins that control gamemodes. Reload and persistence failures include stacktraces in the console.

[Installation and configuration](/gamemodeswitcher/01-installation-configuration) · [Commands and permissions](/gamemodeswitcher/02-commands-permissions)
