---
title: "Rift: Destinations and Anchors"
description: "World, coordinate, anchor, player, bed, cannon, and provider destinations"
published: true
date: 2026-10-09T16:52:52.000Z
tags: "rift, destinations, anchors, teleportation, permissions"
editor: markdown
dateCreated: 2026-10-09T00:00:00.000Z
---

Use `/rift tp <destination>` to teleport yourself, or `/rift send <player> <destination>` to teleport an online player. A destination can select a world spawn, coordinates, a named anchor, an online player, or a valid personal respawn point. Rift resolves destinations in loaded worlds; these commands do not load or create worlds.

## Destination syntax

| Destination | Meaning | Example |
| --- | --- | --- |
| `<world>` or `w:<world>` | The world's configured spawn | `w:rift:resource` |
| `w:<world>:<direction>` | Spawn facing a cardinal direction | `w:rift:resource:north` |
| `e:<world>:<x>,<y>,<z>[:<pitch>:<yaw>]` | Exact coordinates and optional rotation | `e:rift:resource:12.5,72,-8.5:0:90` |
| `e:@here` | The command sender's current location | `/rift send ExamplePlayer e:@here` |
| `a:<name>` | A saved anchor | `a:arrival` |
| `pl:<player>` | An online player's current location | `pl:ExamplePlayer` |
| `b:<player>` | An online player's valid bed or respawn anchor | `b:ExamplePlayer` |
| `b:playerbed` | The teleportee's valid personal respawn point | `/rift tp b:playerbed` |
| `ca:<world>:<x>,<y>,<z>:<pitch>:<yaw>:<speed>` | Coordinates followed by launch velocity | `ca:rift:resource:12.5,72,-8.5:0:90:1.5` |
| `<prefix>:<value>` | A destination supplied by another plugin | `p:arrival` when a portal provider is registered |

World selectors accept the exact namespaced key, the world's unique command name, or an unambiguous display alias. A display alias shared by multiple worlds cannot select a destination. Full keys also distinguish worlds with the same path name in different namespaces.

Coordinate destinations accept `~` offsets on each coordinate and on pitch and yaw. Offsets use the teleportee's position and rotation when the operation begins. For example, `/rift tp e:rift:resource:~2,~,~-3:~:~90` uses the selected world with those offsets. `e:@here` uses the sender, so `/rift send` can bring another player to you. Pitch precedes yaw in destination strings.

Bed destinations validate the actual respawn block and space around it. Missing beds, depleted anchors, obstructed respawn points, offline owners, and unavailable worlds refuse the operation. Looking up a respawn anchor does not consume its charges. `b:playerbed` requires a player teleportee.

## Safe teleporting

Native teleport commands search the requested location and nearby existing chunks for a standing position with sufficient body space and a safe supporting block. They reject hazards such as lava, fire, magma, cactus, powder snow, and portal blocks. The search respects the destination world's border and height limits. It never generates chunks or recreates missing storage.

`globalPolicy.safeLocationHorizontalSearchRadius` controls the horizontal search radius from 0 to 8 blocks. `globalPolicy.safeLocationVerticalSearchRadius` controls the vertical search range from 0 to 32 blocks. Their defaults are 2 and 8. Preparation stops after ten seconds; a refused server teleport remains a failure. Entry permissions, travel restrictions, player limits, and other world policies still apply to the final teleport.

`globalPolicy.passengerMode` selects how commands handle passengers and vehicles. The native API also accepts `DETACH`, `RETAIN_PASSENGERS`, `RETAIN_VEHICLE`, or `RETAIN_BOTH` for each request. Retained entities must belong to the source region and fit at the destination.

## Anchors

| Command | Action | Permission |
| --- | --- | --- |
| `/rift anchor list` | List saved anchor names | `rift.anchor.list` |
| `/rift anchor info <name>` | Show coordinates and rotation | `rift.anchor.list` |
| `/rift anchor set <name> [destination=<destination>]` | Save or replace an anchor | `rift.anchor.set` |
| `/rift anchor remove <name>` | Remove an anchor | `rift.anchor.remove` |

The default destination for `anchor set` is `e:@here`. Use the `destination=` argument to select another location. Console can supply absolute coordinates, a loaded world spawn, or another anchor. Player senders can also use relative coordinates, player locations, personal respawn points, or provider destinations. Anchor creation saves a position without teleporting anyone.

```none
/rift anchor set arrival
/rift anchor set overlook destination=e:rift:resource:12.5,92,-8.5:15:90
/rift tp a:arrival
/rift anchor info overlook
/rift anchor remove overlook
```

Anchor names are trimmed and case insensitive, with a maximum of 128 characters. Quote names or aliases that contain spaces. Rift stores anchors in `plugins/Rift/anchors.toml`; each position carries the exact world key and UUID. An anchor cannot silently target a replacement world with a different UUID. Atomic writes preserve the last valid saved state when a write fails. Stable edits reload automatically; invalid current-format edits preserve the active anchor list.

## Teleport permissions

`rift.teleport` grants self teleports; `rift.teleport.others` grants teleports of other entities. A scoped permission can grant one destination: `rift.teleport.<type>.<target>` or `rift.teleport.others.<type>.<target>`.

| Type | Target suffix |
| --- | --- |
| `w`, `e`, `ca` | The world's unique command name |
| `a` | The canonical anchor name |
| `pl` | The online player's name |
| `b` | The respawn owner's name, or `playerbed` |
| Provider prefix | The provider's destination value |

Examples are `rift.teleport.w.resource`, `rift.teleport.a.arrival`, and `rift.teleport.others.pl.ExamplePlayer`. Completion respects destination scope and hidden-world permissions. World access and travel policy remain separate from teleport command permissions.

Existing Multiverse nodes also work: `multiverse.teleport.self.<type>[.<target>]` and `multiverse.teleport.other.<type>[.<target>]`. World suffixes retain the migrated Multiverse world name. With `globalPolicy.useFinerTeleportPermissions = true`, an explicit false exact Multiverse node overrides its coarse grant. With finer permissions disabled, Multiverse coarse destination nodes apply. Native scoped permissions remain available in both modes.

Anchor administration accepts the sister nodes `multiverse.core.anchor.list`, `multiverse.core.anchor.create`, and `multiverse.core.anchor.delete` for list, set, and remove respectively.

## Integration API

Load `RiftTeleportManager` from Bukkit's services manager after Rift enables. Parse supported strings with `parse`, or construct a typed `WorldDestination`. Supply the actor, actual entity, destination, and `TeleportOptions` in a `TeleportRequest`; `teleport` returns a `CompletionStage<TeleportResult>` with the actual arrival after completion. `resolve` prepares and validates a destination without moving the entity.

`resolveNow` is an immediate snapshot query for `UNCHECKED` options. `teleportNow` performs a real synchronous teleport and reports the server's final result. Both require the correct entity and destination ownership context; synchronous teleporting uses loaded chunks only. Use the asynchronous API for travel across Folia regions.

Use `findAnchor`, `anchors`, `setAnchor`, and `removeAnchor` for canonical anchor storage. Mutations complete after persistence. Register extension destinations with `registerDestinationProvider(plugin, provider)`. A provider supplies a unique namespaced key, a unique non-core prefix, and asynchronous resolution to an exact `WorldPosition`. Its registrations are removed when its plugin disables. See [Integration API](/rift/99-integration-api) for dependency and lifecycle registration.
