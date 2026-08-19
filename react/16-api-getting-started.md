---
title: "API - Getting Started"
description: "React documentation: API - Getting Started"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
React exposes third-party Java APIs for entity protection and metric publishing, plus read-only PlaceholderAPI keys. This document covers dependency setup, current relocation boundaries, and the line between public API and internal runtime types.

| You want to…                                            | Read                                 |
|---------------------------------------------------------|--------------------------------------|
| stop React stacking, trimming, purging, sleeping or despawning your entities | [17 - API - Entity Protection.md](/react/17-api-entity-protection) |
| show your plugin's numbers on React's monitors, maps and PlaceholderAPI | [18 - API - Metric Publishing.md](/react/18-api-metric-publishing) |
| print React's numbers in a scoreboard, hologram or chat format | [19 - API - PlaceholderAPI.md](/react/19-api-placeholderapi) |

The current public signatures use Bukkit, `java.*`, and React API types only. React's API-surface test rejects internal, relocated, shaded, and Adventure types in those signatures.

---

## Depending on React

React ships a `plugin.yml`, so it participates in the legacy Bukkit plugin classloader chain. Declare a dependency to see `art.arcane.react.api.*`.

Bukkit plugin (`plugin.yml`):

```yaml
softdepend: [React]
```

Paper plugin (`paper-plugin.yml`):

```yaml
dependencies:
  server:
    React:
      load: BEFORE
      required: false
      join-classpath: true
```

`join-classpath: true` is mandatory on Paper. Paper plugin classloaders are isolated. Without it you get `NoClassDefFoundError` on `art.arcane.react.api.*`. The classes still ship unrelocated.

### Compile classpath

React does not publish a Maven artifact. Compile against the plugin jar you already deploy:

```gradle
dependencies {
    compileOnly files('libs/React-2.0.0-26.2.jar')
}
```

Maven has no first-class equivalent of a file dependency. Install the jar into your local repository under coordinates you choose. Depend on it with `<scope>provided</scope>`.

Scope is compile-only in every case. The jar must not end up inside yours. Never shade React classes into your plugin. Two copies of `ReactProtection` send your calls to a facade with no binding. Every call then returns `false` with no error.

The version suffix tracks the Minecraft API version React was built against. `2.0.0-26.2` is React 2.0.0 for Minecraft 26.2. It does not by itself state API compatibility with another React build.

---

## What relocation means for you

React's shaded jar rewrites these packages at build time:

| Original            | Inside the React jar                        |
|---------------------|---------------------------------------------|
| `art.arcane.volmlib` | `art.arcane.react.util.arcane.volmlib`     |
| `art.arcane.chrono`  | `art.arcane.react.util.arcane.chrono`      |
| `art.arcane.curse`   | `art.arcane.react.util.arcane.curse`       |
| `art.arcane.multiburst` | `art.arcane.react.util.arcane.multiburst` |
| `net.bytebuddy`      | `art.arcane.react.util.arcane.bytebuddy`   |
| `io.github.slimjar`  | `art.arcane.react.util.arcane.slimjar`     |

Three consequences:

- **You do not need VolmLib to use React's API.** No public API type takes or returns a VolmLib type. If you depend on VolmLib yourself, your copy and React's copy are different classes with different names. They cannot collide.
- **You cannot pass a VolmLib object to React.** React cannot pass one to you. Anything that looks like it should cross that line is internal.
- **Reflection into React by original package name fails.** `Class.forName("art.arcane.volmlib.…")` will not find React's copy. Nothing in the documented API requires reflection.

`art.arcane.react.api.protect` and `art.arcane.react.api.metric` are not relocated in the current shaded build. A build test fails if any current public member of those packages mentions a relocated, shaded, internal, or Adventure type.

---

## Detecting React at runtime

Both facades are static and inert. `ReactProtection` and `ReactMetrics` return `false`, `0`, `""`, or an empty set when React's runtime is not installed. `readHostMetric` returns `Double.NaN` in that state. Those calls do not touch your entity.

```java
if (ReactProtection.available()) {
    ReactProtection.protect(entity, this, ReactOperations.all());
}
```

That covers React being **installed but not started**. That includes your `onEnable` if you load first, a `/react reload`, or React after it shut itself down.

It does **not** cover React being absent from the server entirely. In that case the classes do not exist. The JVM throws `NoClassDefFoundError` the moment it links a method of yours that mentions one. With a `softdepend`, keep every React-touching statement inside its own class. Load that class only after this check:

```java
@Override
public void onEnable() {
    if (getServer().getPluginManager().isPluginEnabled("React")) {
        new ReactBridge(this).install();
    }
}
```

`ReactBridge` is your class. It is the only one that imports `art.arcane.react.api.*`.

---

## What is not API

Only `art.arcane.react.api.protect` and `art.arcane.react.api.metric` are contracts. Everything else under `art.arcane.react` is React's own runtime and changes without notice:

- **Any package named `internal`.** `api.protect.internal` and `api.metric.internal` hold the binding that React installs into the facade at startup. They are public only because React installs them from another package. Do not import them. A test in React's build asserts that no published API type can reach the binding. Code that reaches around it will break.
- **`art.arcane.react.api.sampler`.** `Sampler`, `ReactCachedSampler`, `ReactCachedRateSampler` and `ReactTickedSampler` are React's internal measurement types. They extend React's registry and map-renderer interfaces. Their members use relocated and shaded types, so a third-party plugin cannot implement or extend them. Publish a metric instead. React builds the sampler for you. See [18 - API - Metric Publishing.md](/react/18-api-metric-publishing).
- **`api.feature`, `api.tweak`, `api.action`, `api.monitor`, `api.rendering`, `api.entity`, `api.benchmark`,
  `api.test`.** React's own content model, renderers, and self-test harness. They are wired to React's registries and shaded dependencies.
- **`art.arcane.react.api.event`.** `ReactEvent` and `ReactCancellableEvent` are base classes that hold the `HandlerList` for every subclass. All of React's internal layer events funnel through two shared lists. Some of them fire every tick from a reused instance. `ReactEntityGuardEvent` does **not** extend either of them and owns its own `HandlerList`. It is the only React event a third party should register for.

---

## Versioning

`ReactOperation`, `ReactMetricKind` and every other enum in the API may gain constants in a future release. A `switch` **expression** over an enum is exhaustive. It stops compiling when a constant is added. An already-compiled jar then throws `IncompatibleClassChangeError`.

Always write a `default` arm in third-party code:

```java
String verb = switch (event.getOperation()) {
    case STACK -> "stack";
    case TRIM, PURGE -> "delete";
    default -> "touch";
};
```

Construct `ReactProtectionRule` and `ReactMetric` through their static factories and `with…` methods. Those are the documented construction surface. The canonical record constructors are not.
