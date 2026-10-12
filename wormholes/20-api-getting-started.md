---
title: "API - Getting Started"
description: "Depend on the API jar, acquire services, and follow the threading contract"
published: true
date: 2026-10-12T01:06:17.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Wormholes exposes APIs for portal creation, links, projection controls, traversal costs and events, PlaceholderAPI values, and metrics.

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

## Portal and projection controls

Load `WormholesApi` from Bukkit's services manager after Wormholes enables:

```java
WormholesApi api = Bukkit.getServicesManager().load(WormholesApi.class);
```

`portals()` returns immutable portal snapshots that refresh once a second. `mutations()` creates, links, unlinks, destroys, and renames local portals. These calls return futures and run on the portal's owning region. The calling plugin decides which users may request changes.

Call `api.mutations().projection(portalId, enabled)` to enable or disable a local portal's destination view and save the setting. The future returns false when the portal does not exist. `PortalSnapshot.projectionEnabled()` reports the saved setting after the next snapshot refresh. Remote snapshots report false because projection controls apply to local portals.

Listen for `PortalProjectionChangedEvent` to observe a changed projection setting. The event carries the current `PortalSnapshot`. Wormholes emits the event when its next snapshot detects the change.

## Nether portal shapes

Load `art.arcane.wormholes.api.portal.NetherPortalShapes` from Bukkit’s services manager after Wormholes enables. Call `submit(World, Set<BlockVector>, Axis, Entity)` on the region that owns the complete shape. Positions are absolute interior block coordinates in a single vertical plane. Use `Axis.X` or `Axis.Z` to describe the direction along the opening. Supply the responsible entity when available so player creation permissions and placement policies apply.

An `ACCEPTED` result transfers ownership to Wormholes, including pending destination creation. Do not place native portal blocks or run a repair loop for an accepted shape. `UNAVAILABLE` means the integration cannot accept the shape, such as when replacement is disabled, no paired world exists, or the cells are outside the current region. `REJECTED` means permissions, placement policy, overlap checks, or a canceled `PortalCreateEvent` denied creation. Do not fall back to placing a native portal. `owns(World, Set<BlockVector>)` checks whether one managed Nether portal or pending request owns the exact cell set. Wormholes persists accepted portals and manages their frames, projection, and bidirectional traversal.

## Fabric, Forge, and NeoForge integrations

Compile against the matching Wormholes loader artifact. Once the logical server is running, obtain `MinecraftWormholesApi.forServer(MinecraftServer)` from `art.arcane.wormholes.modded`. The returned optional is empty before startup and after shutdown.

`portals()` returns the shared `PortalQuery`, and `network()` returns `NetworkQuery`. Their immutable snapshots refresh once a second and can be read from any thread. The `create`, `link`, `unlink`, `destroy`, and `rename` methods return futures and schedule changes on the server thread. The caller owns permission checks. Pending futures fail if Wormholes stops.

Call `projection(UUID, boolean)` to save a local portal's projection setting. The future returns false for an unknown portal. Read the setting through `PortalSnapshot.projectionEnabled()` after the next snapshot refresh.

Call `gravityRotation(UUID, boolean)` to save whether a local portal rotates the traveler's gravity frame during traversal. The future returns false for an unknown portal. `gravityRotation(UUID)` returns a future with the current setting, or an empty optional when the portal does not exist. Both calls run on the logical server thread.

Gravity rotation uses Optics `GravityFrame` and the portal pair's proper quarter-turn transform. It supports all six cardinal gravity directions on native loaders with matching client mods. [Apertures and Crossing](/optics/05-apertures-and-crossing#directional-gravity-and-traveller-state) describes local angles, scale percentages and model transforms. The Bukkit mutation API does not enable directional gravity.

`registerDestinationResolver(DestinationResolver)` returns an `AutoCloseable` registration. Resolvers receive a shared `PortalSnapshot` and traveler UUID on the server thread. The first resolvable destination wins. An empty answer leaves normal routing in place. Close the registration when the integrating mod stops.

`listen(Consumer<MinecraftWormholesApi.Event>)` registers a server-thread lifecycle listener and returns an `AutoCloseable`. Close the registration when the integrating mod stops. Wormholes clears registrations at shutdown.

Event kinds are `PORTAL_CREATED`, `PORTAL_LINKED`, `PORTAL_DESTROYED`, `PORTAL_PROJECTION_CHANGED`, `PEER_CONNECTED`, `PEER_DISCONNECTED`, `HANDOFF_ADMITTED`, `HANDOFF_DENIED`, and `HANDOFF_COMPLETED`. Each event carries the applicable traveler, portal, peer, reason, or snapshot fields. Other fields are null. Listener failures are logged, and other listeners continue.

Register teleport admission and completion callbacks through `listenTraversal(MinecraftTravelCosts.Listener)`. Register and close this subscription on the logical server thread. Wormholes delivers pending shutdown refunds before closing these subscriptions. [Traversal Cost & Events](/wormholes/21-api-traversal-cost-events) describes the callbacks and completion states.
