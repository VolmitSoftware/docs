---
title: GlacialRush operator guide
description: Installation, arena setup, commands, equipment, and settings
published: true
date: 2026-10-28T00:00:00.000Z
tags: glacialrush, configuration, equipment
editor: markdown
dateCreated: 2026-10-28T00:00:00.000Z
---

GlacialRush runs three-faction conquest rounds in configured worlds. Players receive arena equipment while their original inventory is saved for return after leaving.

## Installation

Run Paper or Folia for Minecraft 26.1 through 26.3 with Java 25. Place the plugin jar in the server's `plugins/` directory and start the server. The first start requires network access to download runtime libraries and creates `plugins/GlacialRush/config.toml`.

Use `/grush config` to edit the main configuration and `/grush language` to choose a language. Administrators can also edit server translations through the language editor. Missing translations use English.

## Create an arena

1. Stand in the arena world and run `/grush arena create glacier`.
2. Stand at each faction's spawn and run `/grush arena spawn glacier omni`, `/grush arena spawn glacier enigma`, and `/grush arena spawn glacier cryptic` at their respective positions.
3. Stand at each objective and run `/grush arena point glacier <point>`, using a distinct identifier for every point.
4. Link neighboring objectives with `/grush arena link glacier <first> <second>`. Every point must be connected to the arena's objective network.
5. Open `/grush arena config glacier` to set capacity, countdowns, capture rules, and round limits.
6. Run `/grush arena start glacier` to open the arena for joins.

Arena and point identifiers use 1 to 48 lowercase letters, numbers, hyphens, or underscores, starting with a letter or number. Capture areas must not overlap. Every playable arena needs all three faction spawns and at least one capture point.

Players join with `/grush join glacier`. The arena waits for `match.minPlayers`, starts a countdown, and deploys participants when the countdown ends. A countdown cancels if the population falls below the minimum. Players can join a running round if capacity remains. `/grush arena stop glacier` closes the arena and returns participants.

Arena files live at `plugins/GlacialRush/arenas/<arena>.toml`; the file name must match its `id`. Stop the arena before editing its configuration.

| Arena setting | Default | Meaning |
|---|---|---|
| `captureSeconds` | `20` | Time to capture an uncontested objective |
| `roundSeconds` | `1800` | Round time limit in seconds |
| `scoreToWin` | `600` | Winning faction score |
| `captureRadius` | `8` | Capture distance in blocks |
| `match.minPlayers` | `3` | Players needed to begin the countdown |
| `match.maxPlayers` | `60` | Maximum enrollment, including pending joins |
| `match.countdownSeconds` | `15` | Countdown before deployment |
| `match.intermissionSeconds` | `15` | Delay between automatic rounds |
| `match.emptyGraceSeconds` | `30` | Time an empty round remains open before stopping |
| `match.automaticRestart` | `true` | Retain participants for another round after intermission |

## Loadouts and equipment

Select a role with `/grush loadout <vanguard|scout|medic>`. Choose an upgrade and rune with `/grush kit <balanced|assault|guardian> <none|vitality|reserve>`. Choices persist across connections and apply on the next deployment. Change them outside an arena or while its round is idle. Changing a choice does not replenish an active kit.

| Loadout | Unlock rank | Melee weapon | Ranged weapon | Armor |
|---|---|---|---|---|
| Vanguard | 1 | Iron sword | Crossbow | Iron |
| Scout | 2 | Stone sword | Bow | Leather |
| Medic | 3 | Iron sword | Bow | Chainmail |

Each kit includes an offhand shield, 32 arrows, two healing injectables, two grenades, one grapple, and one EMP charge. Kit equipment is unbreakable. Deploying or respawning replaces the arena inventory with a full kit and selects the melee weapon.

| Upgrade or rune | Unlock rank | Effect |
|---|---|---|
| `balanced` | 1 | No bonus weapon or armor enchantments |
| `assault` | 4 | Sharpness I on the melee weapon and Power I when the role uses a bow |
| `guardian` | 4 | Protection I on the chestplate |
| `none` | 1 | Standard consumable quantities |
| `vitality` | 5 | Three healing injectables instead of two |
| `reserve` | 5 | 48 arrows instead of 32 |

## Combat tools

Use the right mouse button with a tool in hand during a running round. Tools are unavailable during spawn protection, and each tool has its own cooldown.

| Hotbar slot | Tool | Behavior | Cooldown |
|---|---|---|---|
| 3 | Healing injectable | Restores four health points, capped at maximum health; consumes one charge only when healing succeeds | 3 seconds |
| 4 | Grenade | Throws a projectile with damage falling from six points at its impact center to zero at five blocks; affects enemy participants without breaking blocks or creating fire | 3 seconds |
| 5 | Grapple | Fires toward a solid block and pulls the player toward an anchor within 24 blocks; the grapple remains in the inventory | 4 seconds |
| 6 | EMP pulse | Throws a projectile that disables enemy tools and abilities within seven blocks of impact for five seconds; consumes one charge | 8 seconds |

`/grush ability` activates the selected role's ability using its energy and cooldown. An EMP also prevents ability activation while its disruption remains active.

## Inventory and return behavior

Join while alive in survival or adventure mode, with an empty inventory cursor and crafting grid. GlacialRush saves all 43 player inventory slots, including armor, offhand, body, and saddle slots, along with the selected hotbar slot and return location, before replacing the inventory with arena equipment.

Arena participants cannot drop or pick up items, move items through inventory interfaces, swap the offhand, consume ordinary food, or gain ordinary experience. Commands outside `/grush` and `/glacialrush`, including their plugin-qualified forms, are blocked while participating or while inventory recovery is pending.

Death during a round clears arena drops and equips a fresh kit after respawn. Leaving or stopping an arena returns the original inventory and location. Disconnecting removes the participant; reconnecting resumes any pending return. Players cannot join another arena until recovery completes.

On Folia, the player-state loop detects completed respawns and returns the player to the faction spawn. Combat remains blocked until that deployment finishes.

The plugin stores pending equipment returns under `plugins/GlacialRush/equipment-recovery/`. Keep this directory with the server's player data when backing up or restoring a server.

Combat and projectile launches remain blocked while recovery is pending. Replace or remove the plugin with the server stopped; live plugin unloading on Folia cannot restore online inventories. Pending returns resume at the player's next login after a server restart.

## Commands and permissions

Both `/grush` and `/glacialrush` accept the following subcommands.

| Command | Purpose | Permission |
|---|---|---|
| `join <arena>` | Join an open arena | `glacialrush.play` |
| `leave` | Leave and recover the original inventory and location | Available to participants |
| `status` | Show arena status or personal progression | `glacialrush.play` |
| `loadout <name>` | Select a role for the next deployment | `glacialrush.play` |
| `kit <upgrade> <rune>` | Select equipment upgrades and supply runes | `glacialrush.play` |
| `ability` | Activate the selected role ability | `glacialrush.play` |
| `arena list` | List configured arenas | Public |
| `arena create <arena>` | Create an arena in the current world | `glacialrush.admin` |
| `arena spawn <arena> <faction>` | Set a faction spawn at the current position | `glacialrush.admin` |
| `arena point <arena> <point>` | Set a capture point at the current position | `glacialrush.admin` |
| `arena link <arena> <first> <second>` | Connect two objectives | `glacialrush.admin` |
| `arena config <arena>` | Open the arena configuration editor | `glacialrush.admin` |
| `arena start <arena>` | Open the arena for players | `glacialrush.admin` |
| `arena stop <arena>` | Stop the arena and return participants | `glacialrush.admin` |
| `config` | Open the main configuration editor | `glacialrush.config` |
| `reload` | Reload configuration and languages | `glacialrush.config` |
| `language` | Select a personal language | Public; server translation editing requires `glacialrush.config` |
| `debug version` | Show the installed version and supported runtime | Public |
| `version` | Hidden alias for the version display | Public |
| `debug dump [upload]` | Save a diagnostic report; `true` also requests an upload to mclo.gs | `glacialrush.debug` |

`glacialrush.play` is granted by default. Administrative, configuration, debug, and release-notification permissions default to operators.

## Main configuration

Edit `plugins/GlacialRush/config.toml` or use `/grush config`. Stable file changes apply automatically when hot reload is enabled; `/grush reload` requests a reload explicitly.

| Setting | Default | Meaning |
|---|---|---|
| `general.enabled` | `true` | Allow arena joins and running rounds |
| `general.language` | `en_US` | Default server language |
| `general.splashScreen` | `true` | Show the startup banner |
| `hotReload.enabled` | `true` | Apply stable configuration and translation edits automatically |
| `hotReload.pollMillis` | `1000` | File polling interval, clamped to 250 through 60000 milliseconds |
| `debug.uploadEnabled` | `true` | Allow requested public debug uploads |
| `metrics.enabled` | `true` | Allow anonymous bStats metrics when a service ID is configured |
| `metrics.serviceId` | `0` | Registered bStats ID; zero leaves reporting inactive |
| `updates.enabled` | `false` | Enable GitHub release notifications |
| `updates.repository` | `VolmitSoftware/GlacialRush-REPLACE-ME` | GitHub `owner/repository`; replace the placeholder before enabling release checks |

The global bStats opt-out also applies. Release notifications require `glacialrush.update`.
