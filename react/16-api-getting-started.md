---
title: "API - Getting Started"
description: "React documentation: API - Getting Started"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

React exposes APIs for protecting entities and publishing metrics.

| Goal | Guide |
|---|---|
| Keep React from modifying your entities | [Entity Protection](/react/17-api-entity-protection) |
| Publish values to React monitors and maps | [Metric Publishing](/react/18-api-metric-publishing) |
| Use React values in text | [PlaceholderAPI](/react/19-api-placeholderapi) |

## Add React to your project

Compile against the React jar without bundling it:

```gradle
dependencies {
    compileOnly files('libs/React-2.0.0-26.2.jar')
}
```

Declare React as an optional dependency. Paper plugins that directly import the API also need `join-classpath: true`.

```yaml
dependencies:
  server:
    React:
      load: BEFORE
      required: false
      join-classpath: true
```

Check that React is enabled before loading code that imports its API:

```java
if (getServer().getPluginManager().isPluginEnabled("React")) {
    new ReactBridge(this).install();
}
```

Keep React imports inside `ReactBridge` or another optional integration class. Use `ReactProtection.available()` or `ReactMetrics.available()` before each operation because React may be reloading.

Use the API factories and `with...` methods. When switching over React enums, include a `default` branch so new enum values do not break your integration.
