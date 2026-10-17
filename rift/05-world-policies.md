---
title: "Rift: World Policies"
description: "World settings, player limits, travel, join placement, and respawn"
published: true
date: 2026-10-16T00:00:00.000Z
tags: "rift, world-policies, permissions, respawn"
editor: markdown
dateCreated: 2026-10-09T00:00:00.000Z
---

Rift stores policies in `plugins/Rift/worlds/<name>.toml`. Changes persist for later loads and apply to loaded worlds. Use `/rift policy edit name=<world>` for the editor or `/rift policy show <name>` to inspect saved values. Omitting `name` opens the managed-world selector.

## Editor controls

The 54-slot editor shows current and default values. Choices use selection menus, booleans toggle, and numbers use left/right click to increase/decrease with shift-click for larger steps. The drop-item key resets a setting. Access messages and tags use chat input.

Spawn coordinates are edited as a draft and validated when saved. Game rules, borders, spawn, access, respawn, and tags have their own controls. `rift.policy` or `rift.admin` permits editing.

## Commands

| Command | Values or effect |
|---|---|
| `/rift policy difficulty <name> <value>` | `PEACEFUL`, `EASY`, `NORMAL`, `HARD`, or `INHERIT` |
| `/rift policy pvp <name> <value>` | `ALLOW`, `DENY`, or `INHERIT` |
| `/rift policy gamemode <name> <value>` | `SURVIVAL`, `CREATIVE`, `ADVENTURE`, `SPECTATOR`, or `INHERIT` |
| `/rift policy flight <name> <value>` | `ALLOW`, `DENY`, or `INHERIT` |
| `/rift policy weather <name> <value>` | `CLEAR`, `RAIN`, `THUNDER`, or `INHERIT` |
| `/rift policy natural-animals <name> <value>` | `ALLOW`, `DENY`, or `INHERIT` |
| `/rift policy natural-monsters <name> <value>` | `ALLOW`, `DENY`, or `INHERIT` |
| `/rift policy player-limit <name> <limit>` | Non-negative player limit; `0` means unlimited |
| `/rift policy travel-entry <name> <value>` | Cross-world entry: `ALLOW`, `DENY`, or `INHERIT` |
| `/rift policy travel-exit <name> <value>` | Cross-world departures: `ALLOW`, `DENY`, or `INHERIT` |
| `/rift policy first-join <name> <destination>` | First-ever join destination; `default` removes the override |
| `/rift policy login <name> <destination>` | Login destination; `default` removes the override |
| `/rift policy gamerule <name> <rule> <value>` | A supported game-rule value, or `INHERIT` |
| `/rift policy spawn <name>` | Save your current safe location as spawn |
| `/rift policy spawn-clear <name>` | Stop enforcing a custom spawn |
| `/rift policy border <name> <size>` | Set border diameter |
| `/rift policy border-center <name> <x> <z>` | Set border center |
| `/rift policy border-warning <name> <distance> <seconds>` | Set warning distance and time |
| `/rift policy border-damage <name> <amount> <buffer>` | Set outside-border damage and buffer |
| `/rift policy border-clear <name>` | Reset the border and stop managing it |
| `/rift policy access <name> <permission> [denied-message]` | Require entry permission; `clear` removes the requirement |
| `/rift policy respawn <name> <destination>` | Select another managed world; `default` or `clear` removes the override |
| `/rift policy tag <name> <tag> <enabled>` | Add or remove a tag |

`INHERIT` stops enforcing difficulty, PvP, or the selected game rule. It does not restore an earlier server value.

## Defaults

| Profile field | Default |
|---|---|
| `difficulty`, `pvp` | `INHERIT` |
| `gameMode`, `flight`, `weather`, `naturalAnimals`, `naturalMonsters` | `INHERIT` |
| `playerLimit` | `0` (unlimited) |
| `travelEntry`, `travelExit` | `INHERIT` |
| `firstJoinWorld`, `loginWorld` | Empty (server placement, unless another join override applies) |
| `gameRules` | Empty |
| `customSpawn` | `false` |
| `spawnX`, `spawnY`, `spawnZ`, `spawnYaw` | `0.5`, `64`, `0.5`, `0` |
| `managedBorder` | `false` |
| `borderSize` | `59999968` |
| `borderCenterX`, `borderCenterZ` | `0`, `0` |
| `borderWarningDistance`, `borderWarningTime` | `5` blocks, `15` seconds |
| `borderDamageAmount`, `borderDamageBuffer` | `0.2`, `5` |
| `accessPermission`, `accessDeniedMessage`, `respawnWorld` | Empty |
| `tags` | Empty |

## Game mode and flight

Game mode applies when a player joins, enters the world, respawns, or the configured mode changes. Rift does not override another plugin's cancelled game-mode change or repeatedly overwrite a mode set during the player's stay. `INHERIT` stops assigning a mode; it does not restore an earlier one.

Flight `ALLOW` grants permission to fly without starting flight. `DENY` removes that permission in Survival and Adventure but preserves native Creative and Spectator flight. When Rift releases its override, it restores the previous permission only if the current permission still matches its last write and the game mode has not changed. This cannot detect another plugin writing the same value. Restoring permission never starts flight automatically.

On Folia, plugin shutdown cannot safely restore flight for players owned by another region. Rift logs that limitation rather than changing their state from the wrong thread. Use a server restart for plugin updates, not plugin hot-unloading.

## Weather and natural spawning

Weather policies hold the world at clear, rain, or thunder. `INHERIT` returns control to the normal weather cycle without restoring an earlier storm.

Natural spawning policies use the `NATURAL` spawn reason. The animal setting covers Bukkit `Animals`; the monster setting covers the `MONSTER` spawn category, including ghasts and slimes. `DENY` cancels those spawns; it does not remove existing entities, including entities created with newly generated chunks. Spawners, eggs, breeding, commands, and other spawn reasons are unchanged. `ALLOW` removes Rift's restriction, but does not override vanilla rules or another plugin's cancellation.

All five settings default to `INHERIT`. Their editor screens list available choices, the current value, and the default. The drop-item key resets them to `INHERIT`.

## Player limits and travel

`playerLimit` caps admissions to a world. Players already inside can teleport within that world, and lowering the limit does not remove current occupants. Incoming reservations count toward capacity so simultaneous arrivals cannot claim the same last slot. Players with `rift.limit.bypass` may enter a full world, but still count as occupants.

Cancelled transfers release their reservations. A transfer started by another plugin that reports neither cancellation nor arrival keeps its reservation until a later accepted cross-world transfer or disconnect; Rift does not guess completion from a timeout.

`travelEntry=DENY` blocks travel into the world from another world. `travelExit=DENY` blocks travel out of it. Both apply to cross-world teleports and portals, including travel initiated by other plugins. Same-world teleports are unchanged. `ALLOW` and `INHERIT` impose no Rift travel restriction; neither overrides access permissions, capacity, or another plugin's cancellation.

`rift.travel.bypass` bypasses entry/exit restrictions, not capacity or access permissions. Both new bypass permissions default to false and are not granted by `rift.admin`. Operators must receive them explicitly. Departure restrictions do not prevent respawn or login recovery.

The editor adjusts the limit by 1 with left/right click, or 10 with shift-click. Zero is unlimited; the drop-item key resets it to zero. Entry and exit use choice menus with `INHERIT` as the default.

## First-join and login placement

These destinations belong to the profile of the world Minecraft would normally place the player in. They are not global destinations selected from every profile. For example, setting `firstJoinWorld` on the primary world routes new players whose initial spawn belongs to that world. Setting `loginWorld` on a resource world routes players who log back into that world.

Destinations must name managed worlds. Rift uses their loaded spawn points and does not load a world to place a player. First-ever joins prefer `firstJoinWorld`, then `loginWorld`; returning players use `loginWorld`. Empty destinations keep the server selection when no other override applies. The selection is one hop, so destinations do not recursively redirect to each other.

An unavailable first-join destination falls back to the login destination. When the selected destination denies access or is full, Rift tries the login destination, the original server placement, then accessible loaded spawns with capacity. A cross-world alternative must allow entry. If no destination works, Rift disconnects the player with an editable message. Normal login to the original world is not cross-world travel, but still checks access and capacity.

Rift selects the requested spawn during connection configuration and checks player permissions and capacity on the player's owning thread at join. It respects the final location selected by later spawn handlers. Another plugin can cancel Rift's recovery teleport or disconnect; Rift does not force through those cancellations.

The first-join and login editors list managed worlds, show the current destination and server default, and allow clearing the override with the default button or drop-item key. Existing custom spawn controls determine the destination's spawn.

## Access and respawn

Access denial messages support `{world}` and `{permission}`. `rift.access.bypass` bypasses the permission requirement. Rift respects cancelled teleport events and checks destination access.

A configured respawn world must be managed. If it is loaded, Rift considers its spawn instead of the server-selected respawn. Admission checks access, capacity, and cross-world entry restrictions, selecting an accessible loaded fallback if necessary. Same-world residents are not displaced by a lowered player limit, and departure restrictions do not block respawn. This setting does not load worlds.

Tags are operator labels. Use them with `/rift list tag=<tag>` and `/rift check-all tag=<tag>`.

Next: [Teleporting](/rift/06-destinations)
