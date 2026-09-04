---
title: "Shaped Portals: Portal behavior and troubleshooting"
description: "How portals are created, saved, repaired, and protected"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "shapedportals, portals, events, persistence"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

<nav class="doc-breadcrumb" aria-label="Breadcrumb"><a href="/shapedportals">Shaped Portals</a><span aria-hidden="true">/</span><span aria-current="page">Portal behavior and troubleshooting</span></nav>

Shaped Portals keeps track of the portals it creates so their unusual shapes can survive block updates and restarts. Minecraft still handles travel and destination portals.

- [Portal changes](#repair-based-integrity)
- [Saved data](#persistent-ownership)
- [Protection plugins](#ignition-and-protection-plugins)
- [Troubleshooting](#troubleshooting)
{.grid-list}

## Repair-based integrity

| What changes | What the plugin does |
|---|---|
| A portal block disappears | Refills it if the frame is intact and the missing cell is still replaceable |
| The frame is opened or broken | Removes the managed portal surface and its record |
| A nonreplaceable block occupies the interior | Deactivates the portal rather than removing that block |
| An intact boundary changes material | Refreshes the recorded material at that position |
| A material is removed from the creation whitelist | Keeps existing portals; adds a note to their portal-list entries |
| A portal's chunks are unloaded | Waits for them to load; integrity checks do not load chunks |
| Blocks change through an API or WorldEdit | A periodic check catches changes not covered by normal events |
{.dense}

Integrity must be enabled for repair and cleanup. It checks the recorded portal type, plane, and frame before refilling cells, and removes only portal blocks owned by the affected record. Managed End frames remain valid only while every recorded End Portal Frame is present and eyed.

Block changes, physics, pistons, explosions, entities, fire, fluids, buckets, and chunk loads trigger checks of nearby portals. A bounded periodic sweep catches other edits. See [Integrity settings](/shapedportals/01-installation-configuration#integrity) for timing and limits.

## Persistent ownership

Managed portals are saved in `plugins/ShapedPortals/portals.json`.

Each record stores its UUID, world identity, plane axis, anchor, interior and frame coordinates, frame-material snapshot, creation time, and creator. Axis `Y` identifies a horizontal End portal without changing the existing record schema.

> Back up the portal store alongside your worlds. Do not edit it while the server is running. An invalid or unsupported store prevents the plugin from enabling safely and is preserved for recovery.

## Portal listing and navigation

Use [the portal commands](/shapedportals/00-overview#find-and-visit-a-portal) to find or visit a managed portal.

Portal entries show the type, world, location, axis, size, creator, and creation time. Nether landing checks look beside the surface. End landing checks stand above the frame so the command does not send the player straight through the portal.

Teleportation fails if the portal or world is unavailable, no safe landing exists, or another plugin cancels it.

An unsafe landing requires a separate permission and confirmation. Read the [unsafe teleport warning](/shapedportals/00-overview#find-and-visit-a-portal) before using it.

## Ignition and protection plugins

Cancelled ignition events are ignored. Before a shaped Nether surface is placed, the plugin fires a cancellable `PortalCreateEvent` with reason `FIRE` and rechecks the frame. A cancelled event or changed frame stops creation.

Shaped End creation starts only after the final Eye of Ender placement is accepted. Vanilla 3×3 portals are left alone. Custom surfaces ask `BlockCanBuildEvent` about each proposed cell before the frame is checked again and filled. A protection plugin can stop creation through the eye-placement or build events.

Bukkit has no `PortalCreateEvent` reason for End-frame activation, so Shaped Portals does not emit one with an unrelated reason. Integrations that need End activation should watch the placement and build events. Creation of either portal type must remain inside one Folia-owned region.

## Troubleshooting

| Symptom | What to check |
|---|---|
| Lighting the frame does nothing | Run `/sp status`. Check creation is enabled, the world and ignition cause are allowed, and the player has creation permission |
| A frame is rejected | Close every edge, remove blocked interior cells, check the size limits, and keep it in one vertical plane |
| A shaped End frame does not activate | Make the boundary horizontal, use only End Portal Frames, insert every eye, keep the interior replaceable, and check the End-specific limits |
| A valid Nether frame is blocked in a protected area | Check the protection plugin's ignition and `PortalCreateEvent` rules |
| A valid End frame is blocked in a protected area | Check `BlockPlaceEvent`, `BlockMultiPlaceEvent`, and `BlockCanBuildEvent` handling |
| A frame fails on Folia | Keep the full shape inside one currently owned region |
| Missing portal blocks come back | This is normal repair behavior while the frame is valid and the cells are replaceable |
| A portal disappears | Check for a broken frame or occupied interior, then inspect the console for persistence or region errors |
| Changes are not being repaired | Check integrity is enabled and the portal's chunks are loaded |
| Teleport refuses to move you | Check the portal still exists, its world is available, a safe landing exists, and no plugin cancelled the move |
| The destination portal is a rectangle | This is normal: vanilla creates destination portals and decides where they go |
{.dense}

Shaped Portals does not pair portals or provide custom destinations. A dedicated routing plugin is needed for fixed links.

## Related pages

- [Configuration *Creation, integrity, presentation, and diagnostics settings*](/shapedportals/01-installation-configuration)
- [Compatibility and operations *Platforms, Folia, debug reports, and React*](/shapedportals/03-compatibility-operations)
- [Developer reference *Geometry, persistence, and event contracts*](/shapedportals/04-architecture-limits)
{.links-list}
