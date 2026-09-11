---
title: "GamemodeSwitcher: Installation and configuration"
description: "Install the plugin and configure gestures, switch feedback, languages, and diagnostics"
published: true
date: 2026-09-10T21:30:27.164Z
tags: "gamemodeswitcher, configuration, languages"
editor: markdown
dateCreated: 2026-09-10T18:30:00.000Z
---

GamemodeSwitcher targets Spigot 1.20.1 and newer compatible servers, including Paper, Purpur, Leaf, Folia, and Canvas. Its complete shaded jar targets Java 17; run the Java version required by your particular server release, as listed in the [Paper installation guide](https://docs.papermc.io/paper/getting-started/). Folia uses entity scheduling for player operations.

## Installation

Stop the server, place `GamemodeSwitcher.jar` in its plugin directory, and restart. Confirm enablement in the console, then run `/gsw status`. Libraries and built-in English are bundled, so a default first startup works offline. Only English is generated initially; other languages download from GitHub when selected.

Build from source with JDK 25 and `.\gradlew.bat build` on Windows or `./gradlew build` elsewhere. Java compilation uses `--release 17`. The build checks every class in the shaded artifact and compiles against current Spigot and Paper APIs. Outputs are `build/libs/GamemodeSwitcher-2.0.0.jar` and the workspace `BUILDS/GamemodeSwitcher.jar`.

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

`/gsw config` opens the suite's 54-slot configuration editor, with centered categories for General, Statistics, Gesture controls, World restrictions, Switch feedback, Diagnostics, and Languages. Settings have translated names, descriptions, and current values. Back returns to the parent category or the gamemode selector; Close exits the editor. Languages opens the translation editor and returns to configuration through its Back control.

Click a boolean to toggle it. Left-click increases numeric values, right-click decreases them, and Shift multiplies the adjustment by ten; adjustments stop at the setting's valid bounds. Gesture timers change by 50 milliseconds, popup duration by 10 ticks, and sound volume or pitch by 0.1. Press the drop-item key (Q by default) over a numeric setting to enter an exact value in private chat. Text and world lists also use chat input; type `cancel` to return without saving. The Server language setting opens the shared server language picker. Saves validate the full configuration and reject stale edits when the file changed after the editor opened.

The default `config.toml` includes short comments explaining each setting, time units, valid destinations, world names, and Minecraft key rebinding. Existing configuration files are preserved when upgrading. Add new settings from the updated template to make them available in an existing file's editor; omitted settings use their defaults. Copy the accompanying comments if you want them in the existing file.

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

The watcher always runs, polls every second, and waits for stable content. Configuration, installed language catalogs, and the shared `plugins/bStats/config.yml` apply edits automatically. Invalid configuration leaves the previous settings active and logs the complete failure. A successful settings reload clears pending gestures and cooldowns. The startup banner always prints.

## Switch feedback

In `/gsw config`, open Switch feedback to choose chat, an action bar, and a title. Titles and action bars are enabled by default and can be used independently or together. These settings apply server-wide; message text follows each player's selected language. Turn Chat messages off to keep successful switches and the Spectator hint out of chat. Blocked switches still explain the reason above the hotbar. Turning all three display options off silences successful switches; sound has its own toggle.

Switch feedback never opens an inventory. Open the selector explicitly with `/gsw menu` or `/gamemodeswitcher menu`. Existing files retain their saved title and action-bar settings; set both to `true` to use the current defaults in an existing configuration.

For a title and a chime, edit these entries inside the existing `[feedback]` section:

```toml
chat-enabled = false
title-enabled = true
sound = "minecraft:entity.experience_orb.pickup"
sound-volume = 0.7
sound-pitch = 1.0
```

The title shows the new mode. In Spectator, its subtitle explains the three-sneak exit gesture; an enabled action bar includes the same hint. Switching from an already-open selector refreshes that selector once, provided another plugin has not opened a different inventory during the change. Action bars and titles use the shared Volmit HUD priority system, so higher-priority notices can take precedence.

Sound names must use lowercase namespaced keys, such as `minecraft:block.note_block.pling`. Custom keys work with a matching client resource pack. A sound unavailable on a player's version or resource pack may be silent; it does not prevent the mode change. Volume also follows the player's Minecraft sound settings. Cancelled and rejected switches do not play the success sound or open success popups.

## Languages

The plugin provides English plus German, Spanish, Finnish, French, Hebrew, Italian, Japanese, Korean, Lithuanian, Dutch, Polish, Portuguese, Russian, Turkish, Vietnamese, Simplified Chinese, and Traditional Chinese. Locale codes match the shared suite: `en_US`, `de_DE`, `es_ES`, `fi_FI`, `fr_FR`, `he_IL`, `it_IT`, `ja-JP`, `ko_KR`, `lt_LT`, `nl_NL`, `pl_PL`, `pt_PT`, `ru_RU`, `tr_TR`, `vi_VI`, `zh_CN`, and `zh_TW`.

English is generated as `languages/en_US.toml`. The other 17 catalogs remain in the repository and download from `https://raw.githubusercontent.com/VolmitSoftware/GamemodeSwitcher/main/src/main/resources/languages/<locale>.toml` when needed. Downloaded files stay local for later use and editing. The files must exist on GitHub for downloads to succeed. Missing configured catalogs use built-in English; failed picker selections retain the previous choice and create no language file.

Missing or invalid messages fall back to built-in English, even when the server default is another language. Valid neighboring messages in partial catalogs remain usable. Existing files are preserved. An unreadable selected catalog uses English and logs its failure without replacing the file. Each catalog begins with comments explaining message variables and supported formatting.

Use `/gsw language` for personal selection, `/gsw language self <locale>` to choose directly, and `/gsw language self reset` to return to the server default. Operators select the server default with `/gsw language server <locale>` and edit translations with `/gsw language server edit <locale>`. Changes validate placeholders and formatting before an atomic save. Personal choices persist inside the nested language directory, and the shared `/volmit` tools can select languages across installed suite plugins.

[Commands and permissions](/gamemodeswitcher/02-commands-permissions) · [Gestures and operations](/gamemodeswitcher/03-gestures-operations)
