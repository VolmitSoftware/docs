---
title: "Shaped Portals — Portal Behavior & Events"
description: "Creation events, managed persistence, integrity repairs, and troubleshooting"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "shapedportals, portals, events, persistence"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Shaped Portals preserves the normal Bukkit creation contract while maintaining
the non-rectangular native blocks that vanilla shape checks may later remove.
It never globally cancels block physics.

## Ignition and protection plugins

`BlockPlaceEvent` handles player-placed fire because Bukkit documents that path
separately from `BlockIgniteEvent`. Other configured causes, including fire
charges, use `BlockIgniteEvent`. Both listeners run at `MONITOR` with
`ignoreCancelled = true`, so denied ignition never begins a shaped scan.

Before any blocks change, the plugin fires:

```text
PortalCreateEvent(proposedStates, world, creator, FIRE)
```

A protection or integration plugin may inspect or cancel that event. After it
returns, the complete frame is scanned again. Cancellation or any geometry
change aborts without applying portal blocks or playing the success sound.

## Persistent ownership

Each successful portal receives a UUID and an entry in `portals.json` containing:

- world UUID and last known world name;
- axis and anchor;
- every absolute interior coordinate;
- every frame-boundary coordinate;
- creation time and creator label; and
- data schema version.

The store is system-owned JSON and is replaced atomically by a dedicated
persistence worker. Do not edit it while the server is running. An invalid or
unsupported store prevents safe plugin enable and is preserved for recovery.

## Repair-based integrity

Native portal blocks do not carry restart-safe ownership metadata, and Bukkit
does not guarantee that cancelling `BlockPhysicsEvent` preserves impossible
states. The registry is therefore authoritative.

Block changes, physics, pistons, explosions, entity changes, fire transitions,
fluid movement, bucket actions, and chunk loads mark nearby records dirty with
constant-time indexes. A delayed owning-region audit then:

1. skips unloaded records without loading their chunks;
2. verifies every frame coordinate against the active frame materials;
3. verifies every existing portal cell has the recorded axis;
4. refills a missing cell only when its current material is configured as
   replaceable; or
5. removes only managed portal cells and deletes the record when the frame is
   broken or an interior was deliberately occupied.

A bounded periodic sweep catches direct API or WorldEdit changes that do not
have one universal Bukkit event. Creation never crosses independently owned
Folia regions, because an atomic multi-region block commit is not available.

## Troubleshooting

### The frame does nothing

- Run `/sp status` and confirm creation is enabled.
- Confirm the world passes `allowedWorlds` and `deniedWorlds`.
- Confirm the player has `shapedportals.create` when required.
- Confirm the ignition cause is listed in `portal.ignitionCauses`.
- Ensure every edge uses a configured frame material.
- Remove nonreplaceable interior blocks.
- Check size, width, and height limits.
- Review `PortalCreateEvent` cancellations from protection plugins.
- On Folia, keep the complete shape within one currently owned region.

### A portal disappears or is refilled

With integrity enabled, removing frame blocks deactivates the record. Missing
native portal cells are refilled only while the recorded frame is valid and the
cell remains replaceable. Inspect the console for persistence or region-owner
failures and confirm all record chunks are loaded.

### Travel creates a rectangle elsewhere

Destination generation remains vanilla. A shaped source can lead to a normal
rectangular return portal. Use a dedicated routing or portal-network plugin if
fixed pairing is required.

Next: [Compatibility & Operations](/shapedportals/03-compatibility-operations)
