---
title: "API - Getting Started"
description: "Depend on the API jar, acquire services, and follow the threading contract"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Wormholes exposes APIs for traversal costs and events, PlaceholderAPI values, and metrics.

| Goal | Guide |
|---|---|
| Charge or deny portal travel | [Traversal Cost & Events](/wormholes/21-api-traversal-cost-events) |
| Read nearby portal values | [PlaceholderAPI](/wormholes/22-api-placeholderapi) |
| Read runtime metrics | [Metrics](/wormholes/23-api-metrics-integration-contract) |

## Add Wormholes to your project

Compile against `Wormholes-<version>-api.jar` without bundling it:

```groovy
dependencies {
    compileOnly files('libs/Wormholes-<version>-api.jar')
}
```

Declare Wormholes as optional. Paper plugins that import its API need `join-classpath: true`.

Check that Wormholes is enabled before loading your integration class:

```java
Plugin plugin = getServer().getPluginManager().getPlugin("Wormholes");
if (plugin != null && plugin.isEnabled()) {
    WormholesBridge.register(this);
}
```

Traversal callbacks run on the traveler's owning thread. Placeholder and metric reads use snapshots and may run from any thread.

## Nether portal shapes

Load `art.arcane.wormholes.api.portal.NetherPortalShapes` from Bukkit’s services manager after Wormholes enables. Call `submit(World, Set<BlockVector>, Axis, Entity)` on the region that owns the complete shape. Positions are absolute interior block coordinates in a single vertical plane; use `Axis.X` or `Axis.Z` to describe the direction along the opening. Supply the responsible entity when available so player creation permissions and placement policies apply.

An `ACCEPTED` result transfers ownership to Wormholes, including pending destination creation. Do not place native portal blocks or run a repair loop for an accepted shape. `UNAVAILABLE` means the integration cannot accept the shape, such as when replacement is disabled, no paired world exists, or the cells are outside the current region. `REJECTED` means permissions, placement policy, overlap checks, or a cancelled `PortalCreateEvent` denied creation; do not fall back to placing a native portal. `owns(World, Set<BlockVector>)` checks whether one managed Nether portal or pending request owns the exact cell set. Wormholes persists accepted portals and manages their frames, projection, and bidirectional traversal.
