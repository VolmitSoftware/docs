---
title: "GamemodeSwitcher: Installation and configuration"
description: "Install the plugin and configure gestures, switch feedback, languages, and diagnostics"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "gamemodeswitcher, configuration, languages"
editor: markdown
dateCreated: 2026-09-10T18:30:00.000Z
---

GamemodeSwitcher runs on Spigot 1.20.1 and newer, including Paper, Purpur, Leaf, Folia, and Canvas. The jar targets Java 17; use whatever Java your server release needs, as listed in the [Paper installation guide](https://docs.papermc.io/paper/getting-started/).

## Installation

Stop the server, put `GamemodeSwitcher.jar` in `plugins/`, and restart. Check the console, then run `/gsw status`. Everything it needs is bundled, so first startup works offline.

## Files

All runtime paths below are relative to `plugins/GamemodeSwitcher/`.

| Path | Purpose |
| --- | --- |
| `config.toml` | Server settings and gesture destinations |
| `languages/en_US.toml` | Editable English catalog, generated from built-in English |
| `languages/<locale>.toml` | Editable translated catalogs |
| `languages/language-preferences.properties` | Personal language selections |
| `data/player-preferences.toml` | Persistent personal gesture opt-outs |
| `debug/` | Local diagnostic reports |

## Configuration

`/gsw config` opens the configuration editor, with categories for General, Statistics, Gesture controls, World restrictions, Switch feedback, Diagnostics, and Languages.

Click a boolean to toggle it. Left-click increases numeric values, right-click decreases them, and Shift multiplies the adjustment by ten; adjustments stop at the setting's valid bounds. Gesture timers change by 50 milliseconds, popup duration by 10 ticks, and sound volume or pitch by 0.1. Press the drop-item key (Q by default) over a numeric setting to enter an exact value in private chat. Text and world lists also use chat input; type `cancel` to return without saving. The Server language setting opens the shared server language picker. A save is rejected if the file changed on disk after the editor opened.

Upgrades never rewrite an existing `config.toml`. A setting added in a newer version is not in your file, so it uses its default and does not appear in the editor until you copy it in from the template.

Disabled Worlds uses world names in both its tooltip and chat prompt. For example:

```toml
[restrictions]
disabled-worlds = ["world_nether", "world_the_end"]
```

Replace these examples with your server's world names. Letter case does not matter. Use `disabled-worlds = []` for no world restrictions.

| Setting | Default | Behavior |
| --- | --- | --- |
| `general.enabled` | `true` | Enables all plugin mode changes |
| `general.language` | `en_US` | Server language for players without an override |
| `metrics.enabled` | `true` | Enables bStats for plugin ID 33967, subject to the shared bStats opt-out |
| `gestures.double-tap-millis` | `600` | Maximum interval between swap taps, 100–3000 ms |
| `gestures.sneak-tap-millis` | `600` | Maximum interval between spectator sneak presses, 100–3000 ms |
| `gestures.cooldown-millis` | `500` | Minimum interval between successful changes, 0–60000 ms |
| `gestures.require-empty-hands` | `false` | Requires both hands empty for gestures; commands and selector remain usable |
| `gestures.spectator-exit` | `CREATIVE` | Destination after three spectator sneak presses |
| `gestures.normal.*` | See gesture table | Destination per starting gamemode for double swap |
| `gestures.sneaking.*` | See gesture table | Destination per starting gamemode for sneaking double swap |
| `restrictions.disabled-worlds` | `[]` | World names where all plugin mode changes are blocked, matched without case |
| `feedback.auto-fly-creative` | `true` | Starts creative flight if the server allows flight after the mode change |
| `feedback.chat-enabled` | `true` | Shows successful switches and the Spectator exit hint in chat; when off, failure reasons use the action bar |
| `feedback.action-bar-enabled` | `true` | Shows the new mode above the hotbar |
| `feedback.title-enabled` | `true` | Shows the new mode as a large title with a subtitle |
| `feedback.popup-duration-ticks` | `50` | Action-bar/title display time, 1–200 ticks; titles add a short fade in/out |
| `feedback.sound-enabled` | `true` | Plays the configured sound after successful mode changes |
| `feedback.sound` | `minecraft:ui.button.click` | Namespaced vanilla or resource-pack sound key |
| `feedback.sound-volume` | `0.7` | Playback volume, 0.0–1.0 |
| `feedback.sound-pitch` | `1.2` | Playback pitch, 0.5–2.0; 1.0 is normal |
| `diagnostics.upload-enabled` | `true` | Allows public mclo.gs uploads; diagnostic commands request upload by default |

Edits to `config.toml`, installed language catalogs, and `plugins/bStats/config.yml` apply automatically. An invalid file leaves the previous settings active and logs the failure. A successful reload clears pending gestures and cooldowns.

## Switch feedback

Chat, action bar, and title are independent; action bar and title are on by default. Turning all three off silences successful switches, and a blocked switch still explains itself above the hotbar. Sound has its own toggle. These are server-wide settings, but each player reads them in their own language.

Feedback never opens an inventory. Open the selector explicitly with `/gsw menu`.

For a title and a chime, edit the `[feedback]` section:

```toml
chat-enabled = false
title-enabled = true
sound = "minecraft:entity.experience_orb.pickup"
sound-volume = 0.7
sound-pitch = 1.0
```

In Spectator, the title subtitle and the action bar both explain the three-sneak exit gesture.

Sound keys must be lowercase and namespaced, such as `minecraft:block.note_block.pling`. A custom key needs a matching client resource pack; a sound the player does not have is simply silent and never blocks the mode change.

Action bars and titles go through the shared Volmit HUD priority system, so a higher-priority notice can take precedence.

## Languages

The server default is `general.language`. English is generated locally; the other 17 catalogs download from the GamemodeSwitcher repository when first selected, then stay on disk and work offline.

See [Languages](/languages).

[Commands and permissions](/gamemodeswitcher/02-commands-permissions) · [Gestures and operations](/gamemodeswitcher/03-gestures-operations)
