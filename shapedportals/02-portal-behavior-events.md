---
title: "Shaped Portals — Portal Behavior & Events"
description: "Frame discovery, Bukkit event interoperability, sounds, and troubleshooting"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "shapedportals, portals, events, troubleshooting"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Shaped Portals is a fallback after vanilla creation, not a replacement for the
Nether portal system. It watches a player fire placement, gives vanilla one tick
to create a normal portal, and scans for a shaped frame only if that did not
happen.

## How orientation is selected

Starting below the fire, the plugin scans down to the world's minimum height for
the first obsidian or allowed crying-obsidian block. It examines neighboring
frame blocks to infer whether the portal lies north–south or east–west. If the
first frame block does not reveal either direction, creation stops.

The interior search then walks up, down, and sideways in that one vertical
plane. Encountering frame material closes an edge. Encountering another solid
material invalidates the candidate. An opening into the world keeps expanding
until the size guard rejects the candidate.

## Bukkit event interoperability

Before changing blocks, the plugin builds a list of proposed `BlockState`
objects and fires:

```text
PortalCreateEvent(states, world, player, FIRE)
```

It applies the portal blocks only when the event remains uncancelled. A plugin
that correctly handles `PortalCreateEvent` can therefore inspect or cancel the
custom portal proposal.

There are two compatibility caveats in version 1.0:

- The initial `BlockPlaceEvent` handler runs at `MONITOR` and does not skip
  cancelled events. A protection plugin cancelling fire placement may not stop
  Shaped Portals from beginning its fallback workflow.
- The sound listener also runs at `MONITOR`, does not skip cancelled portal
  events, and plays before the final cancellation outcome is guaranteed.

Test claims, regions, spawn protection, and fire-prevention plugins explicitly.

## Sounds

When `creationSounds` is enabled, any portal creation event containing at least
one block can play `BLOCK_END_PORTAL_SPAWN` at volume `0.6` and pitch `0.67`.
This is only an effect; it does not indicate that a custom portal was ultimately
accepted or applied.

## Troubleshooting

### The frame does nothing

- Confirm `enablePortals` is `true` and the JSON is valid.
- Confirm the ignition action actually produces a Bukkit `BlockPlaceEvent` whose
  placed material is `FIRE`; other ignition event paths are not handled.
- Ensure the frame is vertical, planar, connected, and fully enclosed.
- Remove solid blocks from the entire proposed interior.
- Reduce the interior below `maxNetherPortalBlocks`.
- If crying obsidian is present, enable `allowCryingObsidian`.
- Review protection-plugin and `PortalCreateEvent` cancellation logs.

### Small or unusual shapes fail

The plugin needs to infer an axis from frame blocks around the first frame block
it finds below the fire. Ambiguous corners and frames whose lower section does
not expose a clear horizontal direction may not be recognized.

### The portal creates but travel is wrong

Shaped Portals does not choose destinations. Investigate vanilla Nether scaling,
world borders, destination obstructions, and any separate portal-routing plugin.

Next: [Compatibility & Operations](/shapedportals/03-compatibility-operations)
