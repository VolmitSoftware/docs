---
title: "API - Metric Publishing"
description: "React documentation: API - Metric Publishing"
published: true
date: 2026-08-25T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Use `art.arcane.react.api.metric` to publish numbers to React monitors, maps, history, PlaceholderAPI, and React Web.

## Declare metrics

Register a `ReactMetricSource` through Bukkit's `ServicesManager`:

```java
public final class PetMetrics implements ReactMetricSource {
    public static final String SOURCE = "example.pets";

    @Override
    public String sourceId() {
        return SOURCE;
    }

    @Override
    public Collection<ReactMetric> metrics() {
        return List.of(
            ReactMetric.gauge("live", "Live Pets").withUnit("pets"),
            ReactMetric.rate("summons", "Summons").withUnit("/s")
        );
    }
}
```

## Publish values

```java
if (ReactMetrics.accepting(PetMetrics.SOURCE)) {
    ReactMetrics.publish(PetMetrics.SOURCE, "live", livePets);
    ReactMetrics.publish(PetMetrics.SOURCE, "summons", summonsPerSecond);
}
```

Publishing and withdrawing are safe from any thread:

```java
ReactMetrics.withdraw(PetMetrics.SOURCE, "live");
```

Publish at least once every 15 seconds. Older readings display as unavailable.

Metric keys use lowercase letters, digits, dots, hyphens, and underscores. Keep source IDs namespaced to your plugin.

## Read React metrics

```java
if (ReactMetrics.hostMetricAvailable("tick-time")) {
    double mspt = ReactMetrics.readHostMetric("tick-time");
}
```

`readHostMetric` returns `Double.NaN` when a value is unavailable. Cache readings used in hot paths.

Published metrics also appear as `%react_sampler.<sampler-id>%`. React forms the sampler ID from the source and metric key using lowercase hyphenated text.
