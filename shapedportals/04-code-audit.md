---
title: "Shaped Portals — Code Audit"
description: "Source-level threading, event, configuration, compatibility, and boundary findings"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "shapedportals, audit, threading, legacy"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

This is a static source and build review of Shaped Portals 1.0 at commit
[`30e3b4e`](https://github.com/VolmitSoftware/ShapedPortals/tree/30e3b4eea5852ffa879d8371d556cd4b9b9fdbe7),
performed 27 August 2026. The repository contains one runtime Java class and no
automated tests. `gradlew clean build` completed successfully with JDK 11; the
resulting jar contained the plugin classes and expanded `plugin.yml`.

No live Minecraft functional or load test was performed.

## Findings

| ID | Severity | Finding | Impact |
|---|---|---|---|
| SP-01 | High | The asynchronous fallback calls `World#getBlockAt`, `Block#getRelative`, `Block#getType`, and other Bukkit world APIs | Data races, async-access failures, and incompatibility with Folia or stricter server implementations |
| SP-02 | High | `BlockPlaceEvent` is handled at `MONITOR` without checking cancellation | The plugin can begin portal creation after another plugin denied the initiating placement, undermining protection-plugin expectations |
| SP-03 | High | Configuration parse/write errors are swallowed; JSON `null` produces a null config | Operators receive no diagnostic and later event handling can fail with null-pointer exceptions |
| SP-04 | Medium | The only trigger is `BlockPlaceEvent` with placed material exactly `FIRE` | Ignition paths represented by other Bukkit events are outside the feature and can make activation inconsistent |
| SP-05 | Medium | The size check uses `blocks.size() > max` before adding and the flood fill is recursive | The effective boundary is off by one; high limits can cause deep recursion or stack exhaustion |
| SP-06 | Medium | Portal and sound listeners at `MONITOR` do not skip cancelled events | A cancelled portal may still produce sound, and event ordering with protection plugins is surprising |
| SP-07 | Low | Sound selection multiplies by `size - 1` | For lists larger than one, the final block is never selected as the sound location |
| SP-08 | Medium | The build and metadata target 1.17-era APIs and declare no Folia support | Modern-server compatibility is unverified and the current implementation is not region-thread-safe |

## Remediation priorities

### 1. Keep world access on an owning server thread

For Bukkit/Paper, perform discovery and state capture synchronously or use an
explicit supported snapshot API. For Folia, schedule work on the owning region
and avoid crossing region boundaries without coordination. Revalidate every
captured block immediately before applying changes.

### 2. Respect event cancellation and priority contracts

Use an appropriate non-`MONITOR` priority for logic that may cause a world
change, set `ignoreCancelled = true`, and confirm the initiating block is still
valid before discovery. Keep the custom `PortalCreateEvent` on the correct
thread and apply no state after cancellation.

### 3. Validate configuration

Reject JSON `null`, restore missing fields deliberately, validate a reasonable
positive maximum, log parse/write failures with file paths, and write via a
temporary file plus atomic replace. A YAML configuration using Bukkit's normal
save/load path would also improve operator diagnostics.

### 4. Make discovery bounded and iterative

Use a queue or stack data structure rather than Java call-stack recursion. Check
the limit before adding each new cell and define precisely whether the maximum
is inclusive. Detect a missing orientation before beginning the fill.

### 5. Add tests and supported-version metadata

Cover cancelled ignition, cancelled portal creation, both axes, concave shapes,
crying obsidian, exact size boundaries, open frames, invalid interiors, corrupt
config, and concurrent world changes. Test actual supported server versions and
publish a narrow compatibility matrix.

The source contains only Nether-portal creation. Documentation or product copy
must not claim End-portal support unless a separate implementation is added and
tested.

Return to [Shaped Portals](/shapedportals).
