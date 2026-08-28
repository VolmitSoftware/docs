---
title: "Shaped Portals — Overview"
description: "Shape rules, managed portal lifecycle, commands, and permissions"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "shapedportals, portals, commands, permissions"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Shaped Portals runs only when vanilla has not already created a normal portal.
It tests both vertical axes, validates one closed connected interior, exposes a
cancelable Bukkit creation event, and registers the completed surface for later
integrity checks.

## Valid shapes

A shaped portal must have:

- one vertical surface in the X or Z plane;
- one orthogonally connected interior;
- a complete boundary made from configured frame materials;
- only configured replaceable materials in its interior;
- an interior within the configured block, width, and height limits; and
- all cells owned by one active Folia region during creation.

The outline may curve, step, widen, narrow, contain concave corners, or surround
frame-material islands. Diagonal contact does not connect interior cells. A
shape valid in both axes is rejected as ambiguous.

Default frames accept `OBSIDIAN` and `CRYING_OBSIDIAN`. Default interiors accept
air variants, fire, and soul fire. The default interior range is 2–256 blocks,
with independent 64-block width and height limits. Hard safety ceilings prevent
configuration from raising the search above 4,096 cells or 512 blocks per
dimension.

## Creation lifecycle

1. A permitted ignition cause produces fire inside a frame.
2. The plugin waits one tick so vanilla portal creation takes priority.
3. If the ignition block is already `NETHER_PORTAL`, no shaped attempt runs.
4. Both vertical planes are scanned iteratively on the owning region thread.
5. A `PortalCreateEvent` with reason `FIRE` is fired with the proposed blocks.
6. The shape is scanned again after the event to reject concurrent frame edits.
7. The portal is registered and the native portal blocks are placed without
   initial neighbor physics.
8. The registry is written asynchronously to `portals.json`.

Once active, vanilla handles collision, dimension travel, coordinate scaling,
destination search, and return-portal construction.

## Commands

| Command | Result |
|---|---|
| `/sp` | Open the localized, paginated help menu |
| `/sp status` | Show creation state, registry counts, attempt totals, and scheduler mode |
| `/sp reload` | Transactionally reload `config.toml` and the selected language file |
| `/sp config` | Open the in-game configuration editor |

The GUI covers the common creation, size, sound, feedback, hot-reload, and
integrity switches. Advanced material, world, ignition, timing, and effect
values remain in `config.toml`.

## Permissions

| Permission | Default | Purpose |
|---|---:|---|
| `shapedportals.create` | Everyone | Ignite shaped portals when permission enforcement is enabled |
| `shapedportals.command` | Everyone | View help and status |
| `shapedportals.reload` | Operators | Reload configuration and language files |
| `shapedportals.config` | Operators | Use the in-game editor |

Next: [Installation & Configuration](/shapedportals/01-installation-configuration)
