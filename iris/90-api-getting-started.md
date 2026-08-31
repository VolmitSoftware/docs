---
title: "API - Getting Started"
description: "Iris documentation: API - Getting Started"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Iris exposes Bukkit APIs for terrain queries, world and pregeneration events, and tree felling.

| Goal | Guide |
|---|---|
| Query generated terrain | [Terrain](/iris/91-api-terrain) |
| Observe engine or pregeneration changes | [World Events](/iris/92-api-world-events) |
| Start or charge tree felling | [Tree Feller](/iris/93-api-tree-feller) |
| Integrate a Fabric, Forge, or NeoForge mod | [Modded API](/iris/94-api-modded) |

## Add Iris to your project

Compile against the Iris plugin jar without bundling it:

```groovy
dependencies {
    compileOnly files('libs/Iris-<version>.jar')
}
```

Declare Iris as an optional dependency. Paper plugins that import the API need `join-classpath: true`.

## Get a service

```java
RegisteredServiceProvider<IrisTerrainService> registration =
    Bukkit.getServicesManager().getRegistration(IrisTerrainService.class);

IrisTerrainService terrain = registration == null ? null : registration.getProvider();
```

Look up services when needed instead of keeping them across an Iris reload. Terrain reads are safe from any thread. Tree-feller calls must run on the thread delivering the block event. World and pregeneration events run on the server's global thread.

When switching over Iris enums, include a `default` branch so future values do not break your integration.
