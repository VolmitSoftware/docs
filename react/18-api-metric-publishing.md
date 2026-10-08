---
title: "API - Metric Publishing"
description: "React documentation: API - Metric Publishing"
published: true
date: 2026-10-08T01:00:00Z
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

For repeated integration reads, discover React's Bukkit `IntegrationServiceContract` registration and check for `metric-snapshots-v1`. `IntegrationSnapshotProvider.snapshotMetrics(keys)` returns immutable cached samples under `react.sampler.<sampler-id>` and registers demand for React's next one-second integration cycle. A first request can return an empty publication. Published, remote, API-pack, and cached sampler readings retain their original capture timestamps, so consumers can apply their own maximum sample age.

Demand expires after 30 seconds without another request. `integrationSnapshotMaxMetrics` bounds retained demand and the size of each request; oversized requests are rejected, and least recently requested keys are evicted when distinct requests fill the limit. A limit change or provider shutdown clears publications. The existing `sampleMetrics(keys)` API remains supported. See [Configuration](/react/01-installation-configuration).

Published metrics also appear as `%react_sampler.<sampler-id>%`. React forms the sampler ID from the source and metric key using lowercase hyphenated text.
