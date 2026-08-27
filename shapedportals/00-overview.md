---
title: "Shaped Portals — Overview"
description: "How Shaped Portals 1.0 recognizes and creates custom Nether portals"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "shapedportals, portals, legacy"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Shaped Portals extends vanilla Nether-portal ignition. Vanilla still handles
ordinary rectangular portals first. When vanilla does not create a portal, the
plugin searches the frame's two-dimensional interior and, if it is valid, fills
that interior with `NETHER_PORTAL` blocks.

## Valid portal shape

A custom frame must be:

- vertical, in either the X or Z plane;
- one connected interior region;
- completely enclosed by obsidian or, when enabled, crying obsidian;
- filled only with air, cave air, void air, fire, or soul fire; and
- within the configured interior-block limit.

The frame may curve, step, widen, narrow, or form another non-rectangular outline.
Every open interior cell must connect orthogonally—up, down, left, or right—in
the selected plane. Diagonal contact alone does not connect two cells.

`maxNetherPortalBlocks` counts the open cells that will become portal blocks,
not the surrounding frame blocks. The default is 32. The audited code has an
off-by-one boundary defect, so treat the configured maximum as approximate.

## Creation flow

1. A player places a block reported by Bukkit's `BlockPlaceEvent` as `FIRE`.
2. Shaped Portals waits one server tick to let vanilla portal creation run.
3. If vanilla emitted a matching `PortalCreateEvent`, the plugin stops.
4. Otherwise it searches downward for frame orientation and flood-fills the interior.
5. Back on the main thread, it creates a Bukkit `PortalCreateEvent` containing
   the proposed portal block states.
6. If that event is not cancelled, the states are applied to the world.

Once the blocks exist, vanilla Minecraft controls portal collision, travel,
destination search, and return portals. The plugin does not customize routing.

## Feature boundaries

Shaped Portals has no commands, permissions, database, per-world rules, reload
command, portal registry, destination links, or public API. Configuration is
global for the entire server.

The code contains no End-portal material or activation logic. End portals shown
or described elsewhere are outside version 1.0's audited implementation.

Next: [Installation & Configuration](/shapedportals/01-installation-configuration)
