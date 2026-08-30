---
title: "Shaped Portals — Portal Behavior & Events"
description: "Creation events, managed persistence, integrity repairs, and troubleshooting"
published: true
date: 2026-08-29T04:30:00.000Z
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

Before permissions, deduplication, scheduling, feedback, or statistics, the
plugin walks downward from the ignition cell through configured interior
materials. The walk must reach a configured frame material within the maximum
portal height. This necessary, bounded candidate check quietly ignores ordinary
fires on dirt, stone, grass, and other terrain while preserving ignition at any
height inside a valid or recognizably incomplete frame.

Before any blocks change, the plugin fires:

```text
PortalCreateEvent(proposedStates, world, creator, FIRE)
```

A protection or integration plugin may inspect or cancel that event. After it
returns, the complete frame is scanned again. Cancellation or any geometry
change aborts without applying portal blocks or playing the success sound.

Player success and rejection notices use the configured presentation channels.
The default action-bar channel composes with Adapt, React, and other VolmLib HUD
publishers instead of directly replacing their line. Optional titles respect
the shared title claim, and optional boss bars are isolated and removed after
their configured lifetime.

## Persistent ownership

Each successful portal receives a UUID and an entry in `portals.json` containing:

- world UUID and last known world name;
- axis and anchor;
- every absolute interior coordinate;
- every frame-boundary coordinate;
- the material recorded at every frame-boundary coordinate;
- creation time and creator label; and
- data schema version.

The store is system-owned JSON and is replaced atomically by a dedicated
persistence worker. Do not edit it while the server is running. An invalid or
unsupported store prevents safe plugin enable and is preserved for recovery.

## Portal listing and navigation

`/sp portals [page]` sorts every registry record by world, anchor, creation
time, and UUID. Each portal is a clickable three-line card: identifier and world,
then location, axis, and interior size, followed by creator and creation time.
When its frame snapshot contains a material no longer accepted for new portals,
a localized fourth line identifies that material without invalidating the record.
Creation time uses the server's local time through whole seconds
(`yyyy-MM-dd HH:mm:ss`) without fractional seconds.
Four cards fit on each player page so every entry has room for the optional note.
The list uses Director's shared content-menu
renderer, including clamped page requests, an unnumbered banner, arrow-marked
rows, and a previous/next footer matching command help. Console output remains
flat and includes every portal
instead of selecting one player page. Each hover
shows the full UUID on its first line and the teleport action on its second line. Players with
`shapedportals.teleport` can click a row or use `/sp teleport <UUID/prefix>`;
prefixes must contain at least eight characters and resolve uniquely.

Navigation resolves the current record and world, prepares the destination
chunk, verifies the anchor is still a native portal block with the recorded
axis, and searches both portal normals at the interior level and one block below
for empty feet and head space over a solid floor. Candidate chunks are prepared
and inspected on their own Folia regions, including valid positions across the
anchor's chunk boundary. It fails without moving the player when the record disappeared,
the world is unavailable, the portal is inactive, no safe landing exists, or
another plugin cancels the command teleport. Inactive records are queued for
the normal integrity decision.

When no safe landing exists, a player with both `shapedportals.teleport` and
`shapedportals.teleport.unsafe` receives a 10-second confirmation warning.
Clicking the same portal again during that window reruns the safe search first,
then uses the nearest in-bounds candidate without requiring empty feet, empty
head, or a solid floor. The confirmation is one-use, portal-specific, and does
not bypass a missing world, inactive record, failed chunk preparation, revoked
permission, scheduler failure, or teleport cancellation by another plugin.

## Repair-based integrity

Native portal blocks do not carry restart-safe ownership metadata, and Bukkit
does not guarantee that cancelling `BlockPhysicsEvent` preserves impossible
states. The registry is therefore authoritative.

Block changes, physics, pistons, explosions, entity changes, fire transitions,
fluid movement, bucket actions, and chunk loads mark nearby records dirty with
constant-time indexes. A delayed owning-region audit then:

1. skips unloaded records without loading their chunks;
2. verifies every frame coordinate is still occupied by a real boundary block,
   independently of the active new-portal whitelist, and refreshes the recorded
   material snapshot when an intact boundary changes material;
3. verifies every existing portal cell has the recorded axis;
4. refills a missing cell only when its current material is configured as
   replaceable; or
5. removes only managed portal cells and deletes the record when the frame is
   broken or an interior was deliberately occupied.

A bounded periodic sweep catches direct API or WorldEdit changes that do not
have one universal Bukkit event. Creation never crosses independently owned
Folia regions, because an atomic multi-region block commit is not available.
Snapshot updates, including records that predate the field, persist atomically
after an owning-region audit.

## Troubleshooting

### The frame does nothing

- Run `/sp status` and confirm creation is enabled.
- Confirm the world passes `allowedWorlds` and `deniedWorlds`.
- Confirm the player has `shapedportals.create` when required. Direct ignition,
  placed fire, and player-launched fireballs use the responsible player's permission.
- Confirm the ignition cause is listed in `portal.ignitionCauses`.
- Ensure every edge uses a configured frame material.
- Remove nonreplaceable interior blocks.
- Check size, width, and height limits.
- Review `PortalCreateEvent` cancellations from protection plugins.
- On Folia, keep the complete shape within one currently owned region.

### A portal disappears or is refilled

With integrity enabled, opening a frame boundary deactivates the record. Changing
an occupied boundary from one solid material to another refreshes its snapshot;
removing a material only from `portal.frameMaterials` does not affect existing
portals, and allowing it again removes the portal-list note. Missing
native portal cells are refilled only while the recorded frame is valid and the
cell remains replaceable. Inspect the console for persistence or region-owner
failures and confirm all record chunks are loaded.

### Travel creates a rectangle elsewhere

Destination generation remains vanilla. A shaped source can lead to a normal
rectangular return portal. Use a dedicated routing or portal-network plugin if
fixed pairing is required.

Next: [Compatibility & Operations](/shapedportals/03-compatibility-operations)
