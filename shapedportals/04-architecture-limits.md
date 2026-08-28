---
title: "Shaped Portals — Architecture & Limits"
description: "Geometry, persistence, physics, versioning, and native portal boundaries"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "shapedportals, architecture, physics, limits"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

The rewrite separates pure geometry, owned-region world access, validated
runtime state, persistence, commands, and presentation. This keeps the portal
hot path bounded and makes failure behavior explicit.

## Geometry engine

The scanner works on integer plane coordinates and classifies each cell as
interior, frame, blocked, or unowned. An `ArrayDeque` and hash sets provide an
iterative linear-time traversal instead of recursive depth-first search and
linear list membership. Limits are inclusive and checked before growth can
exceed the configured bounds.

Both axes are evaluated independently. A valid result contains immutable sets
of interior and frame coordinates. Tests cover concave shapes, exact and
over-limit sizes, open frames, region boundaries, width, and height.

## Why portal records are required

`NETHER_PORTAL` is not a tile state and cannot hold a persistent data container.
Runtime block metadata does not survive restart. Scanning portal blocks after
startup cannot distinguish vanilla blocks, other plugins, or cells already
removed by vanilla validation.

`BlockPhysicsEvent` is only a dirty signal. Its Bukkit contract does not promise
an event for every adjacent state change, and cancellation may leave an
inconsistent world. The plugin records ownership, observes many change signals,
and reconciles loaded records instead of attempting a blanket physics veto.

## Thread and region model

- Hot-reload file watching and parsing, plus registry writes, run off the
  gameplay thread. Explicit command and GUI reloads validate on their invoking
  scheduler context.
- Immutable config and localization snapshots swap atomically.
- Shape reads, portal commits, repairs, and deactivation run on the owning
  region through VolmLib's reflection-backed scheduler.
- Player feedback and GUI work run on the player owner.
- The service never force-loads chunks and refuses a creation spanning
  independently owned Folia regions.

## Native mechanics boundary

Public Bukkit `Orientable` block data supplies the X or Z portal axis, so no NMS,
packets, or version adapters are needed. Native blocks still impose boundaries:

- only vertical X/Z planes are supported;
- destination search and generated destination frames remain vanilla;
- horizontal or three-dimensional surfaces need a separate display, collision,
  and teleport system;
- exact client rendering and sound require real-client validation; and
- no event set can guarantee every external plugin mutation, so the bounded
  periodic sweep remains necessary.

## Shared systems

VolmLib supplies the Java 17-compatible typed TOML codec, file-watch engine,
localization catalog and validation, Director command/help framework, rich-text
fallbacks, product theme, and Folia scheduler bridge. ShapedPortals owns portal
geometry, registry policy, integrity decisions, commands, and its curated GUI.

Return to [Shaped Portals](/shapedportals).
