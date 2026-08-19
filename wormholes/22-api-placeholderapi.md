---
title: "API - PlaceholderAPI"
description: "Wormholes documentation: API - PlaceholderAPI"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Wormholes publishes `%wormholes_…%` through PlaceholderAPI without requiring a
Wormholes compile dependency. Full operator key tables, selection rules,
vocabularies, formats, and failure matrix are in
[12 - PlaceholderAPI](/wormholes/12-placeholderapi). This page covers integrator
lifecycle, threading, and compile notes only.

## Compile and dependency

- Depend on PlaceholderAPI the usual way (`softdepend: [PlaceholderAPI]` or
  Paper optional dependency).
- Do **not** put Wormholes or `Wormholes-*-api.jar` on the classpath for
  placeholders alone.
- When Wormholes is absent, keys do not resolve. PlaceholderAPI leaves the
  original text.

## Lifecycle

1. If PlaceholderAPI is already enabled, Wormholes attempts registration during
   enable.
2. A `PluginEnableEvent` listener registers the expansion when PlaceholderAPI
   enables later.
3. Values stay `---` / `available=false` until the portal attendance pass
   publishes snapshots (~1 Hz).
4. Disable and unload unregister the expansion and clear snapshots.
5. Expansion `persist()` is set. `/papi reload` does not remove it.

Discover keys at runtime: `/papi info wormholes`.

## Threading

`PlaceholderAPI.setPlaceholders` for Wormholes keys may run on any thread.
Resolvers only read a `volatile` immutable server snapshot or a concurrent
player map of immutable records. They never touch `Player`, entities, worlds,
blocks, or chunks.

Caveats:

- Other expansions in the same string are not necessarily thread-safe. If you
  resolve off-region, resolve Wormholes keys alone.
- After resolve, writing a scoreboard, boss bar, or title still follows Folia
  entity/region ownership for that write.

Publish runs on the Wormholes attendance task. Consumers never schedule it.

## Consumption pattern

1. Check `%wormholes_portal.available%` first (`true`/`false` only).
2. Treat `---` as a first-class unavailable value. Examples: unlinked
   destination vs no portal.
3. The batch `setPlaceholders(player, List.of(...))` overload keeps reads
   adjacent. It is not an atomic multi-key snapshot. Server and player records
   may publish between individual resolutions.
4. Switch on enum keys (`portal.state`, `rtp.state`, `peers.link`) with a
   `default` arm. Vocabularies can grow. `---` is always possible for player and
   RTP keys.

Minimal resolve:

```java
String state = PlaceholderAPI.setPlaceholders(player, "%wormholes_portal.state%");
```

Adjacent multi-key HUD read:

```java
List<String> values = PlaceholderAPI.setPlaceholders(player, List.of(
    "%wormholes_portal.available%",
    "%wormholes_portal.name%",
    "%wormholes_portal.state%",
    "%wormholes_portal.distance%"
));

if (!Boolean.parseBoolean(values.get(0))) {
    return;
}
String name = values.get(1);
String state = values.get(2);
String distance = values.get(3);
```

The list call reduces consumer-side repetition. It is still not an atomic
snapshot. Tolerate a nearby portal changing between fields. Refresh on the next
HUD interval.

## Not an API jar surface

Placeholder types live under `art.arcane.wormholes.papi` and VolmLib helpers.
They are **not** in `Wormholes-*-api.jar`. Integrators only need PlaceholderAPI
at runtime. For numeric metrics without string parsing, use
[23 - API - Metrics & Integration Contract](/wormholes/23-api-metrics-integration-contract).
