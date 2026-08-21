---
title: "HiddenOre API"
description: "Developer API index"
published: true
date: 2026-08-20T00:00:00.000Z
tags: "hiddenore, api"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

HiddenOre hides rewards behind ordinary blocks. Visible ore is gone from world
generation.

The API lets another plugin:

- Ask where a block came from
- Find hidden veins in a seeded world
- Refuse a reward before HiddenOre computes it
- Edit a reward before HiddenOre delivers it

The six contract types at the end of this page expose Bukkit types, `java.*`
types, and their own types only. They do not expose VolmLib, Adventure, or
shaded types. You can compile against a plain Spigot or Paper classpath.

That guarantee covers those six types, not all of `art.arcane.hiddenore.api`.
The implementation class next to them references VolmLib. Hold the interface.
Do not hold the implementation.

The `HiddenOreDropsEvent` accessors carry JetBrains nullability annotations.
Those annotations are class-retained. They need no extra dependency.

| You want to…                                                     | Read                                    |
|------------------------------------------------------------------|-----------------------------------------|
| ask where a block came from, or where the veins are               | [service](/hiddenore/api/service)                |
| refuse a reward, or add to one                                    | [events](/hiddenore/api/events)                  |
| show HiddenOre state on a scoreboard or in chat                   | [placeholders](/hiddenore/api/placeholders)      |

Two entry points exist. They are not interchangeable:

- **`HiddenOreService`** (ServicesManager) answers questions. It never changes
  anything. Every question about a block is answered only on the thread that
  owns that block's region.
- **`HiddenOreBreakEvent` / `HiddenOreDropsEvent`** fire during a break. The
  first is cancellable. Use it to refuse. The second is not cancellable. Use it
  to edit.

---

## Depending on HiddenOre

Bukkit plugin (`plugin.yml`):

```yaml
softdepend: [HiddenOre]
```

Paper plugin (`paper-plugin.yml`):

```yaml
dependencies:
  server:
    HiddenOre:
      load: BEFORE
      required: false
      join-classpath: true
```

`join-classpath: true` is mandatory on Paper. Plugin classloaders are isolated.
Without it you get `NoClassDefFoundError` on `art.arcane.hiddenore.api.*` even
though the classes ship unrelocated.

HiddenOre relocates only `io.github.slimjar`, `org.bstats` and `net.kyori`.
Nothing under `art.arcane.hiddenore` is relocated. The class names you compile
against are the class names at runtime.

HiddenOre publishes no Maven artifact. Compile against the jar:

```groovy
dependencies {
    compileOnly files("libs/HiddenOre.jar")
}
```

A HiddenOre build produces two jars. The unclassified
`HiddenOre-<version>.jar` is the thin compile-facing artifact. It contains
HiddenOre's own classes and nothing else. The
`HiddenOre-<version>-plugin.jar` is the shaded deployable that goes in
`plugins/`. Either jar satisfies the compiler. Prefer the thin jar so your
build cannot resolve a shaded internal type.

HiddenOre requires Java 25 and a Paper API 26.1.2 - 26.2 server. It declares
`folia-supported: true`. Its classes are Java 25 bytecode. Your build needs
JDK 25 or newer to read them, whatever release level you target.

---

## Acquiring the service

```java
package com.example.quarryguard;

import art.arcane.hiddenore.api.HiddenOreService;
import org.bukkit.plugin.RegisteredServiceProvider;
import org.bukkit.plugin.java.JavaPlugin;

public final class QuarryGuard extends JavaPlugin {
    private HiddenOreService hiddenOre;

    @Override
    public void onEnable() {
        hiddenOre = resolveHiddenOre();

        if (hiddenOre == null) {
            getLogger().info("HiddenOre is not installed; provenance checks are disabled");
            return;
        }

        getServer().getPluginManager().registerEvents(new QuarryListener(hiddenOre), this);
    }

    public HiddenOreService hiddenOre() {
        return hiddenOre;
    }

    private HiddenOreService resolveHiddenOre() {
        RegisteredServiceProvider<HiddenOreService> registration =
            getServer().getServicesManager().getRegistration(HiddenOreService.class);

        return registration == null ? null : registration.getProvider();
    }
}
```

`getRegistration` returns `null` when HiddenOre is absent, failed to enable, or
has already drained. There is exactly one registration, at
`ServicePriority.Normal`. HiddenOre never registers a second provider. No other
plugin is expected to.

Events do not need the service. They do need the classes. **Keep every
HiddenOre listener in a class of its own. Register it only when HiddenOre is
present.**

`registerEvents` resolves the parameter types of your handler methods.
Registering a listener that mentions `HiddenOreBreakEvent` on a server without
HiddenOre throws `NoClassDefFoundError`. A `softdepend` makes the plugin
optional. It does not make the classes optional.

The non-null service lookup above is one presence check.
`getServer().getPluginManager().isPluginEnabled("HiddenOre")` is the other. Use
the second when you want events and no service.

---

## The lifecycle, in order

1. **HiddenOre enables.** It declares `load: STARTUP`, so it enables before
   worlds load. It reads `config.yml` and `language.yml`. It publishes one
   immutable runtime configuration.
2. **HiddenOre registers the service** with the ServicesManager at
   `ServicePriority.Normal`. The console gets a line that names the
   registration.
3. **Your plugin enables.** With `softdepend`/`load: BEFORE`, this happens
   after step 2. Acquiring the service in your `onEnable` is safe.
4. **During play**, the service answers questions. The two events fire on the
   region thread that owns the broken block.
5. **A configuration reload** (`/hiddenore reload`, or the config file watcher)
   validates the new file. It swaps the runtime configuration in one
   assignment.
6. **Drain** — plugin disable, or a hot unload by a development tool —
   unregisters the service and the PlaceholderAPI expansion.

The watcher consumes exact operating-system events and also compares bounded
SHA-256 signatures for `config.yml` and `language.yml` about once a second.
It waits 250 ms for stable bytes, tolerates atomic and FTP replacement gaps,
and collapses bursts into one latest-state reload no more than once every 3
seconds. A silent bind-mount write still reaches a finished save. Files over
8 MiB require the immediate manual reload path. Startup and manual reload bind
the watcher baseline to the exact config-and-language pair that was parsed and
published; a disk edit that lands before watcher admission resumes remains a
new candidate rather than being silently adopted as the baseline.

Your `HiddenOreService` reference stays valid. Its answers can change.
`isSeeded()` can flip. A material can stop being managed. The seeded vein
layout is recomputed.

If the new configuration is invalid, HiddenOre rejects the reload. The previous
runtime configuration stays live. Nothing you hold changes.

A cached `HiddenOreService` reference still works after drain. It does not
throw. It degrades to "no data". See the failure table in
[service](/hiddenore/api/service). Re-acquire on `PluginEnableEvent`. Do not
hold a reference across a reload of HiddenOre itself.

---

## Threading, in one line

Every method that names a `Block`, `Chunk` or `Location` must run on the thread
that owns that position's region. Several methods throw `IllegalStateException`
if the thread is wrong. `ownsRegion(World, int, int)` is the probe you branch
on. On Paper and Spigot that thread is the main thread. On Folia it is one
specific region thread. [service](/hiddenore/api/service) states this per method
and shows the branch.

---

## What is not part of the contract

| Type                                                   | Why it is not documented here                                                |
|--------------------------------------------------------|------------------------------------------------------------------------------|
| `art.arcane.hiddenore.api.HiddenOreAPI`                | The implementation class. It implements `HiddenOreService` and behaves identically, but reaching it through the plugin main class drags `art.arcane.volmlib` onto your compile classpath. Use the service interface |
| `art.arcane.volmlib.integration.IntegrationServiceContract` | HiddenOre registers a provider for this VolmLib service so that React can read its telemetry. It is a VolmLib contract, versioned by VolmLib, and requires VolmLib on your classpath |
| Everything under `art.arcane.hiddenore.rules`, `.vein`, `.listeners`, `.service`, `.generation`, `.util` | Public Java classes for HiddenOre's own use. They reference shaded and VolmLib types, and they change without notice |

A regression test in the HiddenOre build asserts the contract types. No method,
constructor, or field of `HiddenOreService`, `ChunkProvenance`, `BlockOrigin`,
`HiddenVein`, `HiddenOreBreakEvent`, or `HiddenOreDropsEvent` may mention a
type outside `java.*`, `org.bukkit.*`, and `art.arcane.hiddenore.api.*`. Those
six types are the contract.
