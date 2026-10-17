---
title: "GamemodeSwitcher: Installation and configuration"
description: "Install the plugin and configure gestures, switch feedback, languages, and diagnostics"
published: true
date: 2026-10-17T00:00:00.000Z
tags: "gamemodeswitcher, configuration, languages"
editor: markdown
dateCreated: 2026-09-10T18:30:00.000Z
---

GamemodeSwitcher supports Minecraft 26.1 through 26.3, including patch releases, on Java 25. Other Minecraft and Java versions are rejected at startup before library downloads. It targets Spigot and compatible servers, including Paper, Purpur, Leaf, Folia, and Canvas.

## Installation

Stop the server, put `GamemodeSwitcher.jar` in `plugins/`, and restart. Check the console, then run `/gsw status`. First startup needs network access to download runtime libraries; cached libraries can be reused on later starts. VolmLib is included in the plugin jar and does not need a separate installation.

Gson, TOML, Adventure, and the official bStats library download into `.libs/`. The distribution keeps only the required VolmLib code and uses shrinking and compact packing. The startup banner uses the plugin's gold/mint colors and shows version, server, Minecraft support, Java, and date.

## Files

All runtime paths below are relative to `plugins/GamemodeSwitcher/`.

| Path | Purpose |
| --- | --- |
| `config.toml` | Server settings and gesture destinations |
| `.libs/` | Downloaded runtime dependencies and relocated cache |
| `languages/en_US.toml` | Editable English catalog, generated from built-in English |
| `languages/<locale>.toml` | Editable translated catalogs |
| `languages/language-preferences.properties` | Personal language selections |
| `data/player-preferences.toml` | Persistent gesture opt-outs and personal feedback mutes |
| `data/spectator-sessions.toml` | Previous modes and entry locations for tracked Spectator sessions |
| `debug/` | Local diagnostic reports |

## Configuration

`/gsw config` opens the configuration editor, including General, Statistics, Gesture controls, World restrictions, Switch feedback, Spectator return, and Diagnostics. Language controls open the shared language picker.

Click a boolean to toggle it. For numbers, left-click increases the value, right-click decreases it, and Shift multiplies the adjustment by ten. Gesture timers step by 50 milliseconds, popup duration by 10 ticks, and volume or pitch by 0.1. Values stay within their valid bounds.

Press the drop-item key (Q by default) over a number to enter an exact value in private chat. Text values also use chat input; type `cancel` to stop. Server language opens the language picker. If someone changes the file after you open the editor, reopen it before saving.

Missing settings use their defaults and appear in the editor. Saving one adds it to `config.toml`; upgrades leave the rest of your file intact. Saves show one prefixed change confirmation.

Disabled Worlds opens a world picker. It lists every loaded world by its dimension key and folder name; click a world to turn switching off or back on there. Disabled worlds that are not loaded stay in the list until you click them to remove them.

The setting stores dimension keys, not folder names:

```toml
[restrictions]
disabled-worlds = ["minecraft:the_nether", "minecraft:the_end"]
```

The default worlds are `minecraft:overworld`, `minecraft:the_nether`, and `minecraft:the_end`. Worlds added by other plugins use the key that plugin gives them; the picker shows it. Letter case does not matter. Use `disabled-worlds = []` for no world restrictions. A value that is not a `namespace:path` key is rejected and the previous settings stay active.

| Setting | Default | Behavior |
| --- | --- | --- |
| `general.enabled` | `true` | Enables all plugin mode changes |
| `general.update-notifications` | `true` | Checks for stable GitHub releases and joins shared Volmit notices; installs nothing |
| `general.language` | `en_US` | Server language for players without an override |
| `metrics.enabled` | `true` | Enables bStats for plugin ID 33967, subject to the shared bStats opt-out |
| `gestures.double-tap-millis` | `600` | Maximum interval between swap taps, 100–3000 ms |
| `gestures.sneak-tap-millis` | `600` | Maximum interval between spectator sneak presses, 100–3000 ms |
| `gestures.cooldown-millis` | `500` | Minimum interval between successful changes, 0–60000 ms |
| `gestures.require-empty-hands` | `false` | Requires both hands empty for gestures; commands and selector remain usable |
| `gestures.spectator-exit` | `CREATIVE` | Destination after three spectator sneak presses unless a tracked session restores its previous mode |
| `gestures.normal.*` | See gesture table | Destination per starting gamemode for double swap |
| `gestures.sneaking.*` | See gesture table | Destination per starting gamemode for sneaking double swap |
| `spectator.restore-previous-mode` | `false` | Remembers the previous mode for triple-Sneak and `/gsw return` |
| `spectator.return-to-origin` | `false` | Returns to the saved entry location before leaving a tracked session through GSW |
| `spectator.allow-unsafe-return` | `true` | Allows returns without solid ground or clear space and outside the world border; disable for conservative safety checks |
| `restrictions.disabled-worlds` | `[]` | Dimension keys, such as `minecraft:the_nether`, where all plugin mode changes are blocked |
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

Chat, action bar, and title are independent; all three are on by default. Turning all three off silences successful switch messages, and a blocked switch still explains itself above the hotbar. Sound has its own toggle. Players can mute individual channels, silence all, or restore server defaults through `/gsw menu` → Personal feedback. Personal choices cannot enable a channel disabled by the server.

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

The editor's switch sound control opens a preset picker. Left-click a preset to save it, right-click to preview it, or use Preview current. Custom accepts an exact sound key. Previews use the configured volume and pitch without changing game mode.

Action bars and titles go through the shared Volmit HUD priority system, so a higher-priority notice can take precedence.

## Languages

The server default is `general.language`. Startup creates English locally. The other 17 catalogs are requested from GitHub when selected, then remain on disk. Existing catalogs and local edits are preserved. A missing entry uses English, regardless of the server's selected language.

Catalogs cover English, Dutch, Finnish, French, German, Hebrew, Italian, Japanese, Korean, Lithuanian, Polish, Portuguese, Russian, Spanish, Turkish, Vietnamese, Simplified Chinese, and Traditional Chinese.

Downloads are pinned to published revision `fe6047e14d87e10da3b45b6e196da741496979d8`; all 17 catalog URLs were verified on October 14. Some published messages lag behind the local catalogs. Missing entries and support messages with outdated variables use the current English text; installed files and local edits are preserved. See [Translation updates](/gamemodeswitcher/04-feature-map#next-in-order).

See [Languages](/languages).

## Update notifications

`general.update-notifications` defaults to `true`. It checks stable GitHub releases from `VolmitSoftware/GamemodeSwitcher` and includes available updates in one shared Volmit join notice. Set it to `false` to stop this plugin's checks and notices. The change applies automatically.

`/volmit plugins updates` opens the shared report. Checks respect GitHub rate limits and retain cached release details if a request fails. Updates are never installed automatically. The shared report uses English; the config setting is translated.

[Commands and permissions](/gamemodeswitcher/02-commands-permissions) · [Gestures and operations](/gamemodeswitcher/03-gestures-operations)
