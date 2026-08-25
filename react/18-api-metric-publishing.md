---
title: "API - Metric Publishing"
description: "React documentation: API - Metric Publishing"
published: true
date: 2026-08-25T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
The `art.arcane.react.api.metric` package lets another plugin publish numbers to React monitors, maps, sampler graphs, and PlaceholderAPI. React creates and manages a sampler from each accepted metric declaration.

The integration has three parts:

- A source **declares** each metric's key, kind, unit, display name, icon, and decimal places.
- The owning plugin **publishes** values as they become available.
- React **synthesizes the sampler**. Third-party plugins do not implement React's internal `Sampler` type.

---

## Depending on React

See [16 - API - Getting Started.md](/react/16-api-getting-started) for `plugin.yml` / `paper-plugin.yml` and the compile classpath. Nothing in this package needs anything beyond Bukkit's `Material` and `java.*`.

---

## Sampler boundary

`art.arcane.react.api.sampler.Sampler` is React's internal measurement type. It is not implementable from outside, by design and by construction:

- It extends React's `Registered`, which loads a TOML config file from React's data folder using a shaded reflection library. It also extends `ReactRenderer`, which draws onto a Minecraft map canvas.
- Its members mention `art.arcane.volmlib.util.format.Form`, `art.arcane.curse.Curse`, `com.google.common.util.concurrent.AtomicDouble`, `net.kyori.adventure.text.Component` and React's own color and graph types. In the shipped jar the first two are relocated under `art.arcane.react.util.arcane.*`. Those names exist only inside React.
- The controller that registers samplers is not reachable from any API type.

Compiling a class against `Sampler` from outside React therefore fails at build time or at runtime with `NoClassDefFoundError` on a relocated name. `ReactMetric` is the supported boundary. A source declares a descriptor, publishes a `double`, and React creates the sampler used for rendering, graphs, formatting, caching, and retirement.

---

## The lifecycle

```
you register a ReactMetricSource with the ServicesManager
   |
   |  React polls the ServicesManager every 5 seconds
   v
sourceId() is read and validated
   |
   |  refused - and re-refused every cycle - if it is invalid or reserved
   v
metrics() is called on the server tick thread
   |
   |  faulted if it throws or returns null
   v
descriptors are sanitized, capped and stored; one sampler is created per surviving metric
   |
   v
you call ReactMetrics.publish(sourceId, key, value) whenever you have a number
   |
   |  a reading is live for 15 seconds, then the sampler shows "---"
   v
you unregister, or your plugin disables
   |
   v
within 5 seconds React retires the samplers and drops the readings
```

`metrics()` is re-read when the registered instance changes. Otherwise it is re-read every 60 seconds. Returning a different list from a later call adds and removes samplers accordingly. Unchanged declarations retain their latest readings, while changed descriptors update their existing sampler in place. A metric set that depends on which of your features are enabled works without re-registering.

---

## Threading

| Call                                         | Where you may call it                                                        |
|----------------------------------------------|-------------------------------------------------------------------------------|
| `ReactMetricSource.sourceId()` / `metrics()`  | Called **by React** on the server tick thread — the main thread on Paper, the global region thread on Folia. Must not block, must not do I/O, must not schedule and wait |
| `ReactMetrics.publish` / `withdraw`           | **Any thread**, including your own async workers. The store behind them is a `ConcurrentHashMap` with atomic counters. Publishing touches no world state, no entity and no chunk, and never blocks |
| `ReactMetrics.available` / `accepting` / `publishedSourceIds` | Any thread                                                  |
| `ReactMetrics.hostMetricKeys` / `readHostMetric` / `hostMetricAvailable` | Any thread. React also makes this call from its sampler ticker, which is not the server thread. Samplers cache their value for 50 ms to 5 seconds. Most samplers that need main-thread or world state refresh behind the read instead of blocking. A value may be one or two samples old. See the caveat below before you call this on a latency-sensitive path |

The publishing half accepts calls from any thread. Nothing in `publish`, `withdraw`, `accepting`, or `publishedSourceIds` reads Folia-owned state. The constraint that matters on Folia is different. **The value you publish must be safe for you to compute wherever you compute it.** Counting your own `ConcurrentHashMap` is fine anywhere. Walking `world.getEntities()` is not. React will not save you from that.

`readHostMetric` is the one call with a cost you do not control. It reaches into React's sampler. When that sampler's cache has expired, the refresh happens inside your call. Most samplers hand the expensive part to another thread and return the previous value.

The shared entity census (`entities-animals`, `entities-hostile`, `villagers`, `projectiles`, `physics-entities`, `ground-items`, and `entity-ai-active-count`) never waits in `readHostMetric`. Counts are maintained from entity lifecycle events. Paper and Spigot reconcile at most 128 weakly referenced entities per world during each two-second refresh; their progressive startup repair reads one loaded coordinate and at most 256 entities per tick. Folia takes at most 32 immutable coordinates from the observer index and reconciles no more than 128 entities per owned chunk in the background. The caller immediately receives the latest value. The coordinate rotation includes loaded chunks without players and retains no `Chunk` handles after its bounded startup seed waves. After Folia startup seeding, nominal chunk coverage is `ceil(loaded chunks / 32) * 2 seconds`, multiplied by `ceil(densest chunk entities / 128)` for complete dense-chunk coverage. Latency-sensitive callers should still cache host readings on their own timer instead of resolving them inside a tick or packet path.

---

## Worked example

A plugin publishes four numbers about its pets. The numbers are live count, summon rate, tick duration, and cache size.

### The descriptors

```java
package com.example.pets;

import art.arcane.react.api.metric.ReactMetric;
import art.arcane.react.api.metric.ReactMetricKind;
import art.arcane.react.api.metric.ReactMetricSource;
import org.bukkit.Material;

import java.util.List;

public final class PetMetrics implements ReactMetricSource {
    public static final String SOURCE_ID = "guardianpets";
    public static final String LIVE = "guardianpets.pets.live";
    public static final String SUMMON_RATE = "guardianpets.summons.rate";
    public static final String TICK_MS = "guardianpets.tick.ms";
    public static final String CACHE_BYTES = "guardianpets.cache.bytes";

    @Override
    public String sourceId() {
        return SOURCE_ID;
    }

    @Override
    public List<ReactMetric> metrics() {
        return List.of(
            ReactMetric.gauge(LIVE, "Live Pets", "pets").withIcon(Material.BONE),
            ReactMetric.rate(SUMMON_RATE, "Summons", "/s").withIcon(Material.SKELETON_SKULL),
            ReactMetric.millis(TICK_MS, "Pet Tick").withIcon(Material.CLOCK),
            new ReactMetric(CACHE_BYTES, ReactMetricKind.BYTES, "B", "Pet Cache", Material.CHEST, 0));
    }
}
```

`ReactMetricKind.BYTES` has no static factory, so the fourth metric uses the canonical constructor. Its component order is `(key, kind, unit, displayName, icon, decimals)`.

### The publisher

```java
package com.example.pets;

import art.arcane.react.api.metric.ReactMetrics;

public final class PetMetricPublisher implements Runnable {
    private final PetIndex index;

    public PetMetricPublisher(PetIndex index) {
        this.index = index;
    }

    @Override
    public void run() {
        if (!ReactMetrics.accepting(PetMetrics.SOURCE_ID)) {
            return;
        }

        ReactMetrics.publish(PetMetrics.SOURCE_ID, PetMetrics.LIVE, index.livePets());
        ReactMetrics.publish(PetMetrics.SOURCE_ID, PetMetrics.SUMMON_RATE, index.summonsPerSecond());
        ReactMetrics.publish(PetMetrics.SOURCE_ID, PetMetrics.TICK_MS, index.lastTickMillis());
        ReactMetrics.publish(PetMetrics.SOURCE_ID, PetMetrics.CACHE_BYTES, index.cacheBytes());
    }
}
```

`PetIndex` is your class. The `accepting` check is the cheap way to skip the work entirely. Use it when React is absent, not yet started, or has not read your declaration yet. It returns `true` only once React holds a declaration for your source id.

### Registration

```java
package com.example.pets;

import art.arcane.react.api.metric.ReactMetricSource;
import org.bukkit.plugin.ServicePriority;
import org.bukkit.plugin.java.JavaPlugin;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public final class PetPlugin extends JavaPlugin {
    private final ScheduledExecutorService publisher = Executors.newSingleThreadScheduledExecutor();
    private PetIndex index;

    @Override
    public void onEnable() {
        index = new PetIndex();
        getServer().getServicesManager().register(
            ReactMetricSource.class, new PetMetrics(), this, ServicePriority.Normal);
        publisher.scheduleAtFixedRate(
            new PetMetricPublisher(index), 1L, 1L, TimeUnit.SECONDS);
    }

    @Override
    public void onDisable() {
        publisher.shutdownNow();
    }
}
```

A plain executor is used here on purpose. `BukkitScheduler` does not exist on Folia. Folia's own `AsyncScheduler` is not on a Spigot compile classpath. Publishing is thread-safe and non-blocking, so any timer you already have works. Use a `BukkitTask` on Paper, `Bukkit.getAsyncScheduler()` on Folia, or your own executor everywhere. What matters is only that computing your numbers is legal on whatever thread you pick.

Once a second is the right cadence. React's synthesized sampler caches for one second. Any reading older than 15 seconds is treated as absent. Publishing faster gains nothing. Publishing slower than every 15 seconds makes the metric flicker to `---`.

Bukkit unregisters the service when your plugin disables. React notices within 5 seconds and retires the samplers.

---

## The minimum

Two methods, no descriptors beyond one line:

```java
getServer().getServicesManager().register(ReactMetricSource.class, new ReactMetricSource() {
    @Override
    public String sourceId() {
        return "guardianpets";
    }

    @Override
    public List<ReactMetric> metrics() {
        return List.of(ReactMetric.gauge("guardianpets.pets.live", "Live Pets", "pets"));
    }
}, this, ServicePriority.Normal);
```

`ReactMetricSource` has two abstract methods, so it cannot be a lambda. There is no default `sourceId()` and no fallback. React refuses a source whose id it cannot validate, every cycle, with a log line.

---

## Naming rules

React enforces both naming rules on every declaration cycle. Invalid descriptors are dropped. Verbose logging reports only the accepted declaration count.

**Source id.** Stripped and lowercased before validation, then it must be:

- 2 to 32 characters
- only `a`–`z`, `0`–`9`, `_`, `-`
- first character `a`–`z` or `0`–`9`
- not one of the reserved ids: `react`, `iris`, `adapt`, `wormholes`, `gloss`, `hiddenore`, `biletools`

**Metric key.** Not lowercased for you. Write it lowercase.

- Must start with your source id followed by a literal `.`
- At most 64 characters in total
- After the prefix: `a`–`z` and `0`–`9`, with single `.`, `_` or `-` characters as separators
- No two separators in a row, and it may not end with one

`guardianpets.pets.live` is valid. `GuardianPets.Live`, `guardianpets..live`, `guardianpets.live-` and `pets.live` are all rejected.

**Sampler id.** React derives it by lowercasing your key and replacing every non-alphanumeric character with `-`. `guardianpets.pets.live` becomes the sampler `guardianpets-pets-live`. That is the id an operator sees. That is the id you use in [`%react_sampler.guardianpets-pets-live%`](/react/19-api-placeholderapi).

---

## What the descriptor controls

```java
public record ReactMetric(
    String key,
    ReactMetricKind kind,
    String unit,
    String displayName,
    Material icon,
    int decimals)
```

| Component     | Effect                                                                                                        |
|---------------|----------------------------------------------------------------------------------------------------------------|
| `key`         | Identity. Also derives the sampler id and the placeholder                                                       |
| `kind`        | Chooses the unit suffix when `unit` is blank and describes the series to React renderers                       |
| `unit`        | Suffix shown after the number. Stripped, control characters and `§` removed, truncated to 16 characters. Blank falls back to the kind default |
| `displayName` | Label on monitors and maps. Same sanitizing, truncated to 48 characters. Blank falls back to `key`             |
| `icon`        | Item icon in the monitor picker. `null` becomes `Material.SLIME_BALL`                                           |
| `decimals`    | Decimal places when formatting. Clamped to 0–4                                                                  |

Factories, and the decimals they pick:

| Factory                             | Kind      | Unit      | Decimals |
|-------------------------------------|-----------|-----------|----------|
| `ReactMetric.gauge(key, name, unit)` | `GAUGE`   | yours     | 0        |
| `ReactMetric.counter(key, name, unit)` | `COUNTER` | yours   | 0        |
| `ReactMetric.rate(key, name, unit)` | `RATE`    | yours     | 1        |
| `ReactMetric.percent(key, name)`    | `PERCENT` | `%`       | 1        |
| `ReactMetric.millis(key, name)`     | `MILLIS`  | `ms`      | 2        |

`withIcon`, `withDecimals`, `withDisplayName` and `withUnit` each return a new record.

### `ReactMetricKind`

| Constant  | Meaning                                  | Suffix when `unit` is blank |
|-----------|------------------------------------------|------------------------------|
| `GAUGE`   | A level that goes up and down            | none                         |
| `COUNTER` | A total that only grows                  | none                         |
| `RATE`    | Something per second                     | `/s`                         |
| `PERCENT` | 0–100                                    | `%`                          |
| `MILLIS`  | A duration in milliseconds               | `ms`                         |
| `BYTES`   | A size in bytes                          | `B`                          |

React does not transform your value to match the kind. A `PERCENT` metric published as `0.42` displays as `0.42 %`, not `42 %`. Publish the number you want shown.

The enum may gain constants. Write a `default` arm in any `switch` expression over it.

---

## Publishing

```java
public static boolean available();
public static boolean accepting(String sourceId);
public static boolean publish(String sourceId, String key, double value);
public static boolean publish(String sourceId, String key, double value, long sampledAtMillis);
public static void withdraw(String sourceId, String key);
public static Set<String> publishedSourceIds();
```

`publish` returns `false` and increments a drop counter. It never throws. It does this when any of these is true:

- React's runtime is not installed
- the key was never declared, or the source is not currently declared
- the key does not belong to the source id you passed
- the value is `NaN` or infinite
- `sampledAtMillis` is `0` or negative
- `sampledAtMillis` is more than 5 seconds in the future
- `sampledAtMillis` is more than 15 seconds in the past

The three-argument overload stamps `System.currentTimeMillis()` for you. Use the four-argument one only when you sampled at a known earlier instant, and only within that 15-second window. A batch of readings replayed from a queue after a lag spike will be rejected. That is intended.

`withdraw` clears the current reading without removing the declaration. The sampler stays registered and displays `---` until you publish again. To remove the metric entirely, stop returning it from `metrics()`.

### Staleness is a display state, not a numeric one

When a reading goes stale, React's **monitors and maps** show `---`. Stale means 15 seconds with no publish, or an explicit `withdraw`. The **numeric** value does not become `NaN` or reset to zero. The synthesized sampler holds the last value it saw and keeps returning it. Anything that reads the number rather than the rendered string sees a frozen value, not an absent one. That includes [`%react_sampler.…%`](/react/19-api-placeholderapi) and `ReactMetrics.readHostMetric`.

A synthesized sampler returns `0` only before its first ever reading. If you need consumers to tell "stopped" from "genuinely zero", publish an explicit heartbeat metric alongside the one that matters.

---

## Reading React's own numbers

The same facade reads React's samplers. Another plugin can consume React's tick-time and other host metrics without a separate integration.

```java
public static Set<String> hostMetricKeys();
public static double readHostMetric(String key);
public static boolean hostMetricAvailable(String key);
```

The keys are React's sampler ids. Examples are `tick-time`, `ticks-per-second`, `entities`, `chunks`, `memory-used`, and the rest. That set includes samplers synthesized from other plugins' published metrics. See [19 - API - PlaceholderAPI.md](/react/19-api-placeholderapi) for the catalog.

```java
double mspt = ReactMetrics.readHostMetric("tick-time");

if (Double.isFinite(mspt) && mspt > 45D) {
    scheduler.shedLoad();
}
```

`readHostMetric` returns `Double.NaN` when React is absent, when the key is `null` or blank, and when no sampler has that id. `hostMetricAvailable` is exactly `Double.isFinite(readHostMetric(key))`. There is no exception path.

Sampler ids are React's internal names. They are not part of this contract in the way metric keys are. Guard with `hostMetricAvailable` rather than assuming an id exists.

React also publishes the same public global samplers through its VolmLib `IntegrationServiceContract`. Each descriptor uses the key `react.sampler.<sampler-id>`, numeric type `DOUBLE`, and `scope=global`. `sampleMetrics(Set<String>)` reads only the registered sampler keys in that request, gives the batch one timestamp, and reports missing, failed, or non-finite sampler reads as unavailable. It does not call `Sampler.sample(Chunk)` or introduce player-context sampling, and it omits the internal `unknown` fallback. Synthesized metric keys normalize punctuation to hyphens for their sampler id, so `guardianpets.pets.live` is available to Gloss as `metric('react.sampler.guardianpets-pets-live', 0)`; see [Gloss Expressions & Placeholders](/gloss/13-expressions-placeholders#conditional-documents).

---

## Failure policy

| Misbehavior                              | What React does                                                                  |
|-------------------------------------------|-----------------------------------------------------------------------------------|
| `sourceId()` throws                       | Refused this cycle, logged. `metrics()` is never called                           |
| `sourceId()` is invalid or reserved       | Refused this cycle, logged, and refused again every cycle                          |
| `metrics()` throws                        | Counted as a fault, logged with the exception type. Previously declared metrics keep working |
| `metrics()` returns `null`                | Counted as a fault. Same outcome                                                   |
| `metrics()` returns `null` elements       | Skipped silently                                                                   |
| More than 64 metrics                      | Truncated at 64 with one log line — and then at 24 by the store                    |
| More than 24 valid metrics                | The first 24 unique valid keys are kept. The rest are dropped silently             |
| A 17th source registers                   | Every metric is dropped. React holds declarations for at most 16 sources. The only trace is a verbose line saying it declared `0/N` metrics |
| Two metrics with the same key             | The first wins, the duplicate is dropped                                            |
| A key that fails validation               | Dropped from the declaration. `publish` for it then returns `false`                 |
| Two services with the same source id      | The first one discovered wins. The other is ignored silently                        |
| The derived sampler id is already taken   | Warned, and **no sampler is created for that metric**. Readings are still accepted but nothing displays them. Rename the key |
| `metrics()` takes 5 ms or more            | One warning per source naming your plugin. Never changes the outcome                |
| 5 faults from one source                  | The source is **quarantined**                                                       |

**Quarantine stops React re-reading your declaration. It does not stop you publishing.** Metrics declared before the faults keep their samplers and keep accepting values. What you lose is the ability to change the metric set. Re-registering the same source id does not clear it. `/react reload` or a server restart does, because they rebuild React's controllers. Registering under a different source id also works.

Nothing you pass in is echoed to players without sanitizing. Unit and display name have control characters and section signs stripped. They are length-capped before React shows them anywhere.

---

## Configuration

The metric API has no configuration. It is always on. Its limits are fixed.

React accepts 16 sources and 24 metrics per source. It reads at most 64 metrics per declaration. Freshness is 15 seconds. Future tolerance is 5 seconds.

Quarantine starts after 5 faults. A slow warning fires at 5 ms. Discovery runs every 5 seconds. Re-declaration runs every 60 seconds.

`verbose = false` in `plugins/React/react.toml` hides most `[metric]` diagnostics. Enable it when a source is not appearing to see source refusals, faults, accepted declaration counts, and withdrawal notices. Invalid individual metric descriptors are omitted from the accepted declaration rather than logged one by one. Sampler-id collisions and failed reconcile passes are warnings regardless of verbose mode.

---

## Where a published metric shows up

| Surface                    | How to see it                                                     |
|----------------------------|---------------------------------------------------------------------|
| Monitor picker and HUD     | `/react monitor`, then choose your sampler by its display name       |
| Map graph                  | `/react map <sampler-id>`                                           |
| PlaceholderAPI             | `%react_sampler.<sampler-id>%` — see [19 - API - PlaceholderAPI.md](/react/19-api-placeholderapi) |
| Another plugin             | `ReactMetrics.readHostMetric("<sampler-id>")`                        |

All four use the derived sampler id, not the metric key.
