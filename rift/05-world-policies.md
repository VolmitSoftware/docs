---
title: "Rift: World Policies"
description: "Per-world player rules, travel, respawn, login, spawning, weather, and metadata"
published: true
date: 2026-10-09T23:55:00.000Z
tags: "rift, world-policies, permissions, spawning, respawn"
editor: markdown
dateCreated: 2026-10-09T00:00:00.000Z
---

Rift stores each world's policies in `plugins/Rift/worlds/<name>.toml`. Use `/rift policy edit [name]` to open the inventory editor, or `/rift policy show <name>` to inspect its saved settings. Policy changes apply to loaded worlds and persist for later loads.

## Editing policies

`rift.policy` or `rift.admin` permits policy editing. The inventory editor's **Gameplay Policies** page accepts values through chat; use the drop-item key on a setting to restore its default. Game rules, spawn, border, access, respawn, and tags have dedicated editors.

Use `/rift policy set <name> <setting> <value>` for the gameplay settings below. Lists use comma-separated entries; maps use comma-separated `key=value` pairs. `clear` restores the setting's default. Quoted command arguments can contain spaces.

```none
/rift policy set resource game-mode SURVIVAL
/rift policy set resource player-limit 24
/rift policy set resource denied-sources iris:build
/rift policy set resource denied-destinations iris:creative
/rift policy set resource spawn-policies MONSTER=DENY,ANIMAL=ALLOW
/rift policy set resource spawn-exceptions CREEPER
/rift policy set resource weather CLEAR
/rift policy set resource weather clear
```

`CLEAR` is the weather value for clear skies. Use `INHERIT` to remove a weather lock; the lowercase `clear` reset keyword restores the default `INHERIT` for every setting. For clear skies, enter uppercase `CLEAR` in the command, profile, or inventory editor. World selectors accept a managed command name or a full namespaced key, such as `iris:resource`; full keys distinguish worlds with matching names in different namespaces. Unique display aliases are accepted in teleport destinations. Management selectors use stored names or full world keys.

## Gameplay setting reference

The profile fields are the canonical TOML names. `INHERIT` stops Rift enforcing that setting. `ALLOW` permits ordinary server behavior; it does not override a denial from another plugin or a Minecraft game rule.

| Command setting | Profile field | Default | Values and effect |
|---|---|---|---|
| `game-mode` | `gameMode` | `INHERIT` | `SURVIVAL`, `CREATIVE`, `ADVENTURE`, or `SPECTATOR`; enforce the mode when entering and prevent other mode changes |
| `flight` | `flight` | `INHERIT` | `ALLOW` grants flight to survival/adventure players; `DENY` revokes it; leaving a managed flight policy restores the player's previous flight permission |
| `player-limit` | `playerLimit` | `-1` | Maximum players entering the world; -1 means unlimited and zero denies entry. Players joining directly into a full world are moved to an accessible world or disconnected |
| `allowed-sources` | `allowedSources` | empty list | Only the listed worlds may send players into this world; empty permits every source |
| `denied-sources` | `deniedSources` | empty list | Block these source worlds from entering this world, including sources otherwise allowed |
| `allowed-destinations` | `allowedDestinations` | empty list | Only the listed worlds may receive players leaving this world; empty permits every destination |
| `denied-destinations` | `deniedDestinations` | empty list | Block these destinations when leaving this world, including destinations otherwise allowed |
| `respect-beds` | `respawnRespectBeds` | `true` | Preserve a valid bed destination ahead of the configured respawn world |
| `respect-anchors` | `respawnRespectAnchors` | `true` | Preserve a valid respawn anchor destination ahead of the configured respawn world |
| `first-join` | `firstJoinWorld` | empty | Loaded destination for first-time players joining from this world |
| `login` | `loginWorld` | empty | Loaded destination for players logging in from this world |
| `hidden` | `hidden` | `false` | Hide the world from normal lists |
| `alias` | `displayAlias` | empty | Presentation alias; the managed command name and full world key stay unchanged |
| `hunger` | `hunger` | `INHERIT` | `DENY` prevents food-level decreases; `ALLOW` allows ordinary hunger |
| `healing` | `healing` | `INHERIT` | `DENY` blocks natural regeneration; potions and other magical healing remain available |
| `weather` | `weather` | `INHERIT` | `CLEAR`, `RAIN`, or `THUNDER` locks the corresponding weather |
| `spawn-policies` | `spawnPolicies` | empty map | Spawn category names mapped to `INHERIT`, `ALLOW`, or `DENY` |
| `spawn-exceptions` | `spawnExceptions` | empty list | Entity types permitted despite a denied spawn category |
| `spawn-denied-entities` | `spawnDeniedEntities` | empty list | Entity types denied regardless of their category or an entry in `spawnExceptions` |
| `spawn-limits` | `spawnLimits` | empty map | Spawn category names mapped to nonnegative natural-spawn population limits |
| `spawn-rates` | `spawnRates` | empty map | Spawn category names mapped to nonnegative tick intervals between natural spawning attempts |
| `keep-spawn-in-memory` | `keepSpawnInMemory` | `false` | Retain the 5 by 5 chunk area centered on world spawn while the world is loaded |
| `portal-formation` | `portalFormation` | `INHERIT` | `ALLOW`, `DENY`, `NETHER`, or `END`; the last two allow only that portal formation type |
| `metadata` | `metadata` | empty map | Operator-defined string values keyed by letters, digits, underscores, hyphens, periods, or colons |

Gameplay spawn categories are Bukkit `SpawnCategory` names, including `MONSTER`, `ANIMAL`, `WATER_ANIMAL`, `WATER_AMBIENT`, `WATER_UNDERGROUND_CREATURE`, `AXOLOTL`, and `AMBIENT`. `MISC` cannot have a natural-spawn limit or interval. Spawn exceptions and denials use Bukkit `EntityType` names such as `ZOMBIE` or `CREEPER`.

Category rules and entity exceptions apply to creature spawn events, including plugin-created creatures. Limits and rates affect natural spawning. An allowed category does not force spawning when the server has disabled it. To deny selected types within an allowed category, use `spawn-denied-entities`.

Portal formation governs nether portal creation and the End arrival platform. It does not choose portal travel destinations. Spawn retention moves to the new spawn area after a managed spawn change and releases its chunks when disabled, unmanaged, or unloaded.

The profile field `allowAdvancementGrant` defaults to `true`. Set it to `false` to prevent advancement criteria from being granted in that world. This controls advancement progress; it does not isolate each world's advancement state. Multiverse conversion preserves `allow-advancement-grant`.

## Difficulty, PvP, game rules, and locations

| Command | Effect |
|---|---|
| `/rift policy difficulty <name> <difficulty>` | `PEACEFUL`, `EASY`, `NORMAL`, `HARD`, or `INHERIT` |
| `/rift policy pvp <name> <policy>` | `ALLOW`, `DENY`, or `INHERIT`; use this setting for PvP instead of a separate PvP game rule entry |
| `/rift policy gamerule <name> <rule> <value>` | Set a current Minecraft game rule, or use `INHERIT` to remove its managed value |
| `/rift policy spawn <name>` | Store your current safe position as the world's spawn |
| `/rift policy spawn-clear <name>` | Stop enforcing a custom spawn |
| `/rift policy border <name> <size>` | Set the managed border diameter |
| `/rift policy border-center <name> <x> <z>` | Set the border center |
| `/rift policy border-warning <name> <distance> <seconds>` | Set the warning distance and duration |
| `/rift policy border-damage <name> <amount> <buffer>` | Set outside-border damage per block and the safe damage buffer |
| `/rift policy border-clear <name>` | Reset the border and stop managing it |
| `/rift policy access <name> <permission> [denied-message]` | Require a permission to enter; `clear` removes the requirement |
| `/rift policy respawn <name> <destination>` | Route deaths to another managed world; `default` or `clear` preserves native respawn selection |
| `/rift policy tag <name> <tag> <enabled>` | Add or remove an operator tag |

Access denial messages support `{world}` and `{permission}`. A player without access to the selected respawn world is routed to another accessible loaded world. Valid beds and anchors take precedence unless their respective `respect-*` setting is false. The post-respawn world applies its own player policies.

For first-time joins, Rift checks the world's `firstJoinWorld`, then global `firstJoinDestination`. If neither provides a destination, it checks the world's `loginWorld`, then global `loginDestination`. Later logins use the login destinations in that same world-first order. Empty destinations preserve ordinary server placement; a configured destination must be loaded and accessible.

## Bypass permissions

| Permission | Effect |
|---|---|
| `rift.access.bypass` | Ignore entry permission requirements |
| `rift.travel.bypass` | Ignore source and destination travel restrictions |
| `rift.capacity.bypass` | Ignore player limits |
| `rift.gamemode.bypass` | Keep and change your own game mode |
| `rift.flight.bypass` | Ignore managed flight grants and revocations |
| `rift.list.hidden` | See hidden worlds in lists |
| `rift.login.bypass` | Keep normal login placement despite a configured login destination |
| `rift.admin` | Grant all Rift capabilities and the listed bypasses |

Administrative evacuation can move players out of a world despite its travel restrictions. Destination access checks still apply.

Existing Multiverse permissions also work: `multiverse.core.modify` permits policy editing; `multiverse.access.<name>` and `rift.access.<name>` are equivalent entry permissions. `mv.bypass.gamemode.<name>`, `mv.bypass.playerlimit.<name>`, and `mv.bypass.joinlocation` retain their respective bypasses. Migrated worlds use their original Multiverse name for these world-specific nodes.

Next: [Integration API](/rift/99-integration-api)
