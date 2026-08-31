---
title: "API - Getting Started"
description: "Depend on the API jar, acquire services, and follow the threading contract"
published: true
date: 2026-08-28T00:00:00.000Z
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
