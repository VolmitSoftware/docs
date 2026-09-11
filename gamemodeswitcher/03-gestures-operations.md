---
title: "GamemodeSwitcher: Gestures and operations"
description: "Default key gestures, event handling, and troubleshooting"
published: true
date: 2026-09-10T21:30:27.164Z
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

## Compatibility verification

The initial September 10, 2026 migration validation used isolated instances with the following results. Lifecycle checks include plugin enablement, console status, configuration application, local diagnostics, and graceful shutdown.

| Platform | Minecraft version | Java used | Verification |
| --- | --- | --- | --- |
| Spigot | 1.20.1 | 17 | Gameplay and lifecycle |
| Paper | 26.1.2 | 25 | Gameplay and lifecycle |
| Paper | 26.2 | 25 | Lifecycle |
| Purpur | 26.2 | 25 | Lifecycle |
| Leaf | 26.2 | 25 | Lifecycle |
| Folia | 1.21.11 | 25 | Gameplay and lifecycle |
| Canvas | 26.2 | 25 | Lifecycle |

Gameplay checks covered mode transitions, tap timing, spectator exit, permission denial, personal preferences across restart, inventory actions, configuration and translation editing, invalid-config retention, and English-only fallback. The installed Mineflayer harness connected with protocols 1.20.1, 1.21.11, and 26.1; it rejected 26.2 before connecting. That limits automated gameplay evidence for the 26.2 servers.

The subsequent automatic-reload, language-download, and bStats update passed 47 unit tests and 52 runtime checks across Spigot 1.20.1 on Java 17 and Folia 1.21.11. These checks verified English-only startup, language headers, current command completion, gestures, editors, automatic configuration and language updates, English fallback, and live plugin/shared bStats opt-outs, including a shared opt-out while plugin TOML was invalid. Successful production GitHub downloads require the repository catalogs to be published on `main`; bStats initialization and reconfiguration checks do not establish backend receipt of telemetry.

The menu update passed 49 plugin tests, 28 shared editor and text tests, and 46 Mineflayer checks across Spigot 1.20.1 on Java 17 and Folia 1.21.11. Checks covered filled inventory layouts, selected and unavailable modes, category and language-editor navigation, live boolean and timer changes, exact chat input and cancellation, item-movement protection, permission changes while a menu was open, and title/name/lore metadata without stray formatting tags. The shared catalog change also passed HiddenOre's language-header regression test.

The configuration-help update passed 49 plugin tests, 13 shared editor tests, and 36 gameplay checks on Spigot 1.20.1 with Java 17 and Folia 1.21.11. These verified world-name examples in tooltips and chat prompts, automatic world-list application, cancellation, clearing restrictions with `[]`, and preservation of every configuration comment through editor saves.

The switch-feedback update passed 59 plugin tests, 76 shared editor/HUD tests, and 36 gameplay checks: 18 on Spigot 1.20.1 with Java 17 and 18 on Folia 1.21.11 with Java 25, using matching bot protocols. Packet checks verified chat suppression, title and action-bar content and duration, immediate clearing of active popups, configured sound keys/volume/pitch, decimal sound edits from integer TOML values, and rejected-switch feedback. Inventory checks verified feedback editor controls and preservation of other menus, including an inventory opened by another plugin during a cancelled mode change. Both test instances shut down normally and were removed.

Protocol tests can verify gamemode changes, inventories, commands, gestures, and title/sound packets. Minecraft rendering, text layout under resource packs, audible playback, and key-binding feel need a real-client check.

The default-popup regression passed 59 plugin tests and 16 additional gameplay checks on Spigot 1.20.1/Java 17 and Folia 1.21.11/Java 25 with matching bot protocols. Fresh configurations enabled titles and action bars. Command switches, ordinary double-swap gestures, and sneaking double-swap gestures sent both HUD notifications without opening an inventory. Each notification toggle changed only its own setting, and the manual selector and an already-open configuration editor remained usable.

[Installation and configuration](/gamemodeswitcher/01-installation-configuration) · [Commands and permissions](/gamemodeswitcher/02-commands-permissions)
