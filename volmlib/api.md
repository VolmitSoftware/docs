---
title: "VolmLib API"
description: "VolmLib documentation: API overview for plugin developers"
published: true
date: 2026-08-29T18:12:56.000Z
tags: "volmlib, api"
editor: markdown
dateCreated: 2026-08-12T00:00:00.000Z
---

VolmLib is the shared library behind the Volmit plugins. It is a **library, not a plugin**.
The published artifact contains only classes under `art.arcane.volmlib`. Nothing loads it on
the server, and each plugin compiles and shades it into its jar.

| Document | Covers |
|---|---|
| This file | How to depend on VolmLib, and the relocation rule |
| [placeholders](/volmlib/api/placeholders) | `art.arcane.volmlib.util.bukkit.papi` and `Placeholders` |

---

## What is in it

| Package | What lives there |
|---|---|
| `util.scheduling` | `FoliaScheduler` (global, region, and entity dispatch on Paper and Folia), `SchedulerRuntime`, `Looper`, `ChronoLatch`, `SlidingWindowRateLimiter` (N events per rolling window), `PrecisionStopwatch`, `IrisLock` |
| `util.bukkit` | `Events`, `WorldIdentity`, `ChunkPositionSet`, `Placeholders` |
| `util.bukkit.papi` | The shared PlaceholderAPI expansion base and its key registry. See [placeholders](/volmlib/api/placeholders) |
| `util.director` | The Director command framework: annotations, parameter handlers, help display, tab completion |
| `util.localization` | `LocalizationManager`, prepared snapshot installation, `MessageCatalog`, locale overlays, plural selection, catalog validation, sectioned TOML language parsing/reference rendering, optional decorative placeholders, canonical Volmit locale identifiers and display names through `VolmitLocales`, and `RemoteLanguageCatalog` for pinned verified repository catalogs |
| `util.format` | `Form` (durations, memory sizes, wrapping, capitalization, `prettyEnumName`), `ColorFormatter`, `MemoryMonitor` |
| `util.plugin` | `ComponentText` (one immutable rich-text value with MiniMessage, legacy, and plain serializers), `ComponentMessenger` (chat, action-bar, and title delivery), `ComponentLog` (Paper component logging with severity-aware Java-logger fallback), `SplashScreenSupport` (shared console-splash metadata), `CancellableTask` |
| `util.board` | Scoreboard sidebar management (`BoardManager`, `BoardProvider`, `BoardSettings`). `BoardSettings` has a configurable `updateIntervalTicks` (default 20). A board exposes its first complete frame with the provider's real title: at most 15 single-line rows, a 32-UTF-16-unit title, and 16-unit team prefix plus 16-unit suffix per row with active colours carried forward. Line breaks collapse to spaces and fitting never splits a surrogate, legacy colour pair, or complete legacy RGB run. `BoardProvider.hideScoreNumbers(Player)` defaults to `true`; VolmLib applies the native blank number format when the server supports it and otherwise keeps the numbered sidebar without failing. Providers may override the policy per player. Packet scoreboards use detached objective state, isolated objective ids, and cross-plugin ownership arbitration so region-threaded servers such as Canvas can render safely and shaded VolmLib consumers such as Iris and Gloss cannot overwrite one another. `BoardManager` updates through a Folia-safe scheduler on regionized runtimes |
| `util.inventorygui` | Chest menus |
| `util.nbt`, `util.nbt.mca` | NBT tags, and reading and writing Anvil region files |
| `util.hunk`, `util.matter`, `util.mantle` | Three-dimensional chunk-shaped buffers, palette-backed storage, and the persistent world-data layer |
| `util.noise`, `util.interpolation`, `util.stream` | Noise generators, interpolators, and composable procedural streams |
| `util.collection`, `util.cache`, `util.data` | `KList`/`KMap`/`KSet`, chunk caches, palettes, cuboids, varint helpers |
| `util.io`, `util.json` | IO adapters, native-plus-reconciled file/folder watchers, reactive folder batching, and the JSON implementation |
| `util.config` | Typed TOML parsing, canonical writing, generated field and section documentation, and configuration load policy |
| `util.hotload` | `ConfigHotloadEngine`, which stabilizes and coalesces configuration changes before a host applies them |
| `util.network` | Downloads, metered streams, download progress reporting |
| `integration` | The cross-plugin metric handshake types. Read the relocation rule below before you touch these |

`BSupport` material listings expose current Bukkit materials only. `BSupport` excludes
legacy `Material` aliases before block-data inspection or item-name publication. Registry
discovery does not initialize CraftLegacy support. Its placement-support contract classifies
cactus as a decorant and permits cactus only on sand, red sand, or another cactus.

`FileWatcher` and `FolderWatcher` consume native `WatchService` events and reconcile filesystem state, including atomic replacements, overflow, directory deletion/recreation, and watcher-key loss. Their `checkModifiedEvents()` methods drain native events without checking unchanged leaf metadata while complete registrations are active and fall back to state scanning when native watching is unavailable or only partially registered; `checkModified()` still performs full state reconciliation. A folder watch created before its missing root appears registers that new tree after fallback discovery. Event-only callers should still run periodic full reconciliation. The folder watcher does not follow directory symlinks. Both own operating-system resources and must be closed when their host is replaced or disabled.

`IO.lock` reports a blocked file-channel lock once after five seconds with a
`[VolmLib/IO]` warning, then stays quiet until its 60-second timeout. The thrown
timeout retains the final wait duration for the host plugin's failure logger.
VolmLib-owned runtime and default failure sinks use `[VolmLib/<component>]`
records with the original throwable attached. Expected interruption and
reflection-probe diagnostics use `FINE`; actionable shared-service failures use
`WARNING` or `SEVERE`.

## Components and colors

`ComponentText` is the common boundary between authored text and a destination. Use `markup(...)` only for trusted MiniMessage or mixed MiniMessage/legacy templates; it accepts standard `&` and `§` codes, `&#RRGGBB`, compact or expanded `&x` RGB, and `[RRGGBB]` bracket hex. A backslash escapes an ampersand or bracket color marker. `normalizeMarkup(...)` exposes the same conversion when a localization service must normalize a trusted template before inserting untrusted arguments. Use `legacy(...)` for authored legacy text, `section(...)` for text whose `§` formatting has already been resolved, `literal(...)` for untrusted plain text, and `component(Object)` when a plugin already owns an Adventure component. `append(...)` keeps sibling styles and events isolated, `hover(...)` attaches another `ComponentText` as safe rich hover content, and `clickOpenUrl(...)` accepts only HTTP or HTTPS URIs with a host. The public API intentionally exposes `ComponentText`, not Kyori types, so shaded consumers do not couple their signatures to one Adventure classloader.

`ComponentMessenger.send(...)` uses the server's rich-message path when available. Its plain Bukkit fallback serializes components to legacy text only for players; consoles, RCON, command blocks, and custom non-player senders receive plain text with no raw `§` markers. `sendRunCommand(...)` and `sendOpenUrl(...)` emit colored hoverable command or web-link options through the Spigot component bridge so click actions remain available on the complete supported server range. The action-bar and title methods retain player colors and RGB. `ComponentLog.discriminator(...)` builds the common dark-bracketed, reset-terminated prefix with a plugin-supplied legacy or RGB brand accent. `ComponentLog` prepends that styled discriminator exactly once, sends the combined component through Paper's component logger when available, and otherwise uses the supplied Java logger with formatting removed while retaining the requested severity and throwable.

`ReactiveFolder` adds bounded rolling content reconciliation, temporary-artifact filtering, delete grace, and a completion-anchored 3-second latest-state queue to a recursive folder watch. It drains events on ordinary checks, runs a full membership reconciliation about every 5 seconds, and starts exact SHA-256 reconciliation about every 2.5 seconds. Each exact-content slice advances at most 8 MiB or 32 files and yields between files after roughly 10 milliseconds. `ConfigHotloadEngine.configure(pollIntervalMs, hotloadCooldownMs, watchedFiles, watchedDirectories)` provides the same completion-anchored queue with a host-supplied interval; Volmit hosts use 3 seconds. It also provides self-write suppression and periodic content reconciliation for silent or same-metadata saves. `ConfigHotloadEngine` likewise continues exact reconciliation across polls and yields between files after 8 MiB, 32 files, or roughly 10 milliseconds. Snapshot enumeration, full watcher scans, and one individual read sit outside those between-file limits. Exact-content capture is capped at 2 MiB per file; larger targets remain visible to metadata reconciliation but are not eligible for an automatic content apply. A failed host apply remains pending for retry; `clear()` closes all watcher resources and discards pending work.

`ConfigFileSupport.load(..., overwriteOnReadFailure=false, ...)` is a passive load: it parses and normalizes in memory but never canonicalizes, migrates, deletes, or creates files. Startup and explicit migration paths opt into writes by passing `true`.

`ConfigFileSupport.parseSnapshot(...)` validates a stable in-memory config capture without rereading a file that may still be changing. `AtomicFileIO.writeString(...)` writes UTF-8 through a same-directory temporary file and atomically replaces the target when the filesystem supports atomic moves.
`TomlCodec` emits an explicit `@ConfigDoc` attached to a nested POJO field immediately above that
section header; unannotated sections retain the generated `Settings for <section>` fallback.

`LocalizationManager.install(preparedSnapshot)` atomically installs the exact immutable `LocalizationSnapshot` a caller already created and validated. Hotload hosts can therefore parse, validate, and compile a localization candidate on an I/O worker, then perform only the prepared reference swap on their authoritative server thread.

`VolmitLocales.all()` provides the immutable suite locale order, while
`VolmitLocales.displayName(locale)` returns the curated full English name for a
bundled locale. Unknown or custom identifiers return an empty optional so each
plugin can supply context-appropriate custom-locale wording.

`RemoteLanguageCatalog` loads a locale manifest from the consumer jar. A manifest
may use an immutable commit with per-locale SHA-256 values or a validated mutable
reference such as `main` without checksums. It reads reference-scoped caches
synchronously and downloads missing catalogs on one daemon worker. Fetches are
bounded to 2 MiB with three-second connect and five-second read timeouts, require
HTTP 200 and strict UTF-8, run a caller-supplied complete-catalog validator, and
require atomic publication. Pinned entries receive checksum verification; mutable
entries rely on transport security plus the caller's semantic validator.
`requestInstallIfMissing(...)` uses the same verification pipeline to atomically
install a repository locale at a caller-selected flat path without creating a
revision cache and without replacing a file that already exists or appears while
the transfer is active. This supports one locally editable language file; a
configured checksum is enforced only on its incoming publisher bytes.
Checksum, decoding, validation, transport, and publication failures leave the
previous target untouched. Transport errors identify the locale and complete
source URI. A failed locale enters a 30-second retry cooldown so repeated reload
or editor events do not immediately repeat the same request or warning.
Concurrent requests for one locale coalesce onto the active transfer and each
registered completion receives the same result. The caller owns logging and schedules any Bukkit
activation after a successful completion callback; closing the catalog fences
late lifecycle completions.

`LanguageReferenceRenderer.render(catalog, headerLines)` emits deterministic nested TOML for the complete typed catalog, including text, line-list, and plural values. `TomlLanguageEditor` canonicalizes message tables while preserving a language file's leading instruction and placeholder comment block.

`TomlLanguageParser.parseText(raw)` flattens a sectioned text-only TOML catalog
into message IDs. Its accepted-key overload projects a sparse local file onto
the current catalog, ignores retired keys without rewriting the file, and still
rejects a wrong type for a current key. `TextKey.ofOptional(...)` identifies
decorative placeholders that an overlay may remove; undeclared, required, and
unexpected placeholders retain strict validation.

Everything else under `art.arcane.volmlib` is scaffolding for the Volmit plugins. Those types
are public because Java has no better word for "visible to the plugins in this repository".
They carry no compatibility promise. Only the surfaces in this directory stay stable across
VolmLib versions. Anything else can change signature without notice. The Volmit plugins
update together because they build against the same source tree.

`Mantle.saveIdleTectonicPlates(regionIds)` saves and unloads each requested plate only when
it can be sealed immediately. It returns the region IDs that were busy. It leaves those
plates open, resident, and unchanged. A caller can keep its dirty state and retry on a later
save. The method never waits for active chunk users. Final shutdown save must run only after
the caller has drained its producers.

## Director completion

`DirectorMiniMenu.resolveHelp(engine, args)` owns the shared player layout and displays at most 19 command entries between its banner and navigation footer. `DirectorMiniMenu.ContentMenu` applies the same page clamping, banner, and previous/next footer to plugin-owned content rows while accepting an explicit page size for taller entries. `banner(title, theme)` renders an unnumbered header, while the retained `banner(title, contentPage, theme)` and `ContentPage.title(title)` contracts append the page fraction for consumers that expose it. Sender-aware delivery keeps both help and content menus flat and unpaginated for console senders.

Director suggests canonical command names and keeps aliases executable without duplicating
them in completion lists. Every exposed command value completes as a canonical `name=value`
token, whether the parameter is required, optional, or a configurable contextual override.
Director emits known handler, enum, and boolean values as complete tokens. An open-ended
numeric or string value emits `name=`. Director keeps a value already typed after `=`.
Required parameters still accept their positional execution form, but completion and help
teach the keyed form.

Context-injected implementation parameters stay hidden. A contextual parameter that operators
may override must set `@Param(contextual = true, contextualOverride = true)`. Director then
presents it as an optional keyed value. Director still resolves the sender context when it is
omitted.

Normal `DirectorInvocation` execution treats its argument list as raw command-line fragments.
It joins and tokenizes quoted input before it maps parameters. A command adapter that has
already normalized several raw fragments into one semantic argument must instead use
`DirectorInvocation.pretokenized(sender, label, args)`. That factory preserves every supplied
list element exactly, including embedded spaces and quotes. A keyed trailing value such as
`text=Say "hello" to everyone` cannot be split or rewritten a second time.

## Bracket-grouped values

Write a multi-word keyed value with brackets. `key=[...]` joins every space-separated token
up to a token-final `]` into one value. It strips the outer brackets.
`addline id=123 text=[This is an example.]` binds `text` to `This is an example.`.

Grouping starts only when the value starts with `[`. The closing `]` must be the final
character of its token. Everything the group consumes is part of the value. Director never
parses that text as a key, even when it contains `=`.

Three exceptions keep existing inputs working. A value whose `]` sits mid-token with
characters after it stays literal. `text=[ff0000]Red` still binds `[ff0000]Red`. Inline hex
colors keep working.

A single-token value whose bracket content is exactly six hex digits stays literal. A bare
color code like `text=[ff0000]` stays unstripped. A value that already contains spaces is
never grouped. That includes quoted input and a `pretokenized` argument.

Double the brackets to escape them. `key=[[literal brackets]]` binds `[literal brackets]`.
Director strips exactly one outer level. `key=[]` binds the empty string. Positional tokens
are untouched. Only `key=[` starts grouping.

A group with no token-final `]` before the end of the line is a parse error. The error names
the key (`director.runtime.error.unclosed_group`). Tab completion inside an open group
suggests nothing. It does not misread the value as keys.

---

## Depending on VolmLib

VolmLib is published to JitPack and shaded into the consuming plugin.

```groovy
repositories {
    mavenCentral()
    maven {
        url = uri('https://repo.papermc.io/repository/maven-public/')
    }
    maven {
        url = uri('https://jitpack.io')
    }
}

dependencies {
    implementation('com.github.VolmitSoftware:VolmLib:master-SNAPSHOT') {
        changing = true
        transitive = false
    }
}
```

Three details in that block are required:

- **`implementation`, not `compileOnly`.** Nothing on the server provides these classes. If
  you do not shade them you get `NoClassDefFoundError: art/arcane/volmlib/...` the first time
  your code touches VolmLib.
- **`transitive = false`.** VolmLib compiles against Gson, Guava, fastutil, Caffeine,
  commons-lang3, concurrentlinkedhashmap-lru and lz4-java. A transitive pull adds a second
  copy of libraries the server or your other dependencies already ship. Add back by hand only
  what you actually call.
- **`changing = true`** on a `-SNAPSHOT` coordinate. Gradle then re-resolves instead of
  serving a week-old jar. Pin a commit hash (`com.github.VolmitSoftware:VolmLib:<sha>`) for
  reproducible builds.

VolmLib builds with a **Java 25 toolchain**, emits **Java 17 bytecode**, and compiles its
shipped source against Paper 1.20.1. The same source is gated against Spigot 1.20.1, Paper
26.1.2, and Spigot 26.2. Consuming plugins therefore require Java 17 or newer. Packages that
name Paper-only types remain Paper-specific.

### Building against a local checkout

Every Volmit plugin resolves VolmLib from a sibling directory when one is present. It uses a
Gradle composite build. The consumer's `settings.gradle` does the substitution:

```groovy
includeBuild('../VolmLib') {
    dependencySubstitution {
        substitute(module('com.github.VolmitSoftware:VolmLib')).using(project(':shared'))
        substitute(module('com.github.VolmitSoftware.VolmLib:shared')).using(project(':shared'))
        substitute(module('com.github.VolmitSoftware.VolmLib:volmlib-shared')).using(project(':shared'))
    }
}
```

You must substitute all three spellings. All three can appear in a resolved graph:

- the whole-repository JitPack form (`com.github.VolmitSoftware:VolmLib`)
- the subproject form from the Gradle project name (`com.github.VolmitSoftware.VolmLib:shared`)
- the subproject form from the Maven publication `artifactId` `volmlib-shared`
  (`com.github.VolmitSoftware.VolmLib:volmlib-shared`)

If you substitute only some of them, you compile against a local checkout. Runtime can still
resolve something else. That result is worse than substituting none.

---

## The relocation rule

This rule is the most important fact on this page.

VolmLib classes live inside your jar. Some plugins shade them under `art.arcane.volmlib`
unchanged. Others rewrite the package during shading so their copy cannot collide with anyone
else's. In this suite, both shapes are in production at once:

| Plugin | Package its copy of VolmLib ends up in |
|---|---|
| Iris | `art.arcane.volmlib` |
| Wormholes | `art.arcane.volmlib` |
| Gloss | `art.arcane.volmlib` |
| HiddenOre | `art.arcane.volmlib` |
| BileTools | `art.arcane.volmlib` |
| Adapt | `art.arcane.adapt.util.arcane.volmlib` |
| React | `art.arcane.react.util.arcane.volmlib` |
| ShapedPortals | `com.volmit.shapedportals.libs.volmlib` |

`art.arcane.volmlib.util.bukkit.papi.PlaceholderValues` and
`art.arcane.adapt.util.arcane.volmlib.util.bukkit.papi.PlaceholderValues` are different
classes, in different classloaders, with separate static state. They are not assignable to
one another and never will be. That fact gives this rule.

> A VolmLib type is safe only if every reference stays inside one plugin's own
> jar. It is also safe if it travels through a third-party type that is not
> relocated.

Nothing else is safe. It does not "usually work". It does not work because both
plugins share a version. Plugin A writes a class name. Plugin B must resolve it.
If either plugin rewrites that name at build time, the link fails.

### Why the placeholder base class is safe

PlaceholderAPI is a separate plugin. It calls into `VolmitPlaceholderExpansion`, a VolmLib
type. The type satisfies the rule because of what sits at the boundary:

```
your jar                                  PlaceholderAPI's jar
--------                                  --------------------
YourExpansion
  extends VolmitPlaceholderExpansion
    extends PlaceholderExpansion  ------>  me.clip.placeholderapi.expansion.PlaceholderExpansion
      onRequest(OfflinePlayer, String) : String
```

The only name that crosses the jar boundary is `PlaceholderExpansion`. That type belongs to
PlaceholderAPI. Nobody relocates it. Every consuming build declares it with a compile-only
scope (`compileOnly`, or `compileOnlyApi` when the type appears in that plugin's own API). It
is never shaded. The PlaceholderAPI plugin provides it at runtime.

Everything on your side of that arrow is your own copy. That copy includes your subclass, the
base class, the registry, and the value formatter. PlaceholderAPI stores your object as a
`PlaceholderExpansion`. It calls `onRequest`. It gets a `java.lang.String`. Every type in the
signature is a PlaceholderAPI type, a Bukkit type, or a JDK type.

Adapt and Wormholes can both register a placeholder expansion on the same server. Both
expansions use the same base class. One jar relocates the class. The other does not. Neither
plugin notices the other.

### What is not safe

| Pattern | What goes wrong |
|---|---|
| Registering a VolmLib type with `ServicesManager` for another plugin to load | Provider and consumer look up different `Class` objects. `load()` returns `null`, silently |
| A Bukkit event with a getter that returns a VolmLib type | The listener cannot name the return type without a `NoClassDefFoundError` |
| A public API method on your plugin taking or returning `KList`, `KMap`, `Cuboid`, or any other VolmLib type | Any caller that relocates differently gets `NoClassDefFoundError` at the call site |
| `instanceof` or a cast against a VolmLib type on an object from another plugin | The cast never matches. On a shared supertype you get `ClassCastException` |
| Assuming static state in VolmLib is server-global | Each relocated copy has its own statics. A cache filled in Adapt's copy is invisible to Iris's copy |
| Serializing a VolmLib type into a PDC value, plugin message or metadata for another plugin to read | The reader cannot resolve the class name that was written |

The `art.arcane.volmlib.integration` package is this hazard in production. Several plugins
register an `IntegrationServiceContract` implementation with Bukkit's `ServicesManager` under
their own copy of that interface. A straightforward consumer sees nothing:

```java
import art.arcane.volmlib.integration.IntegrationServiceContract;
import org.bukkit.Bukkit;

IntegrationServiceContract contract = Bukkit.getServicesManager().load(IntegrationServiceContract.class);
```

That call returns `null` for every provider whose jar relocated VolmLib differently from
yours. It returns a provider only when both jars chose the same shading. It never throws. The
failure looks like "the other plugin is not installed".

### Crossing a boundary on purpose

If a value must move between plugins, one of these must be true at the boundary:

1. **The type is a JDK or Bukkit type.** `String`, `UUID`, `Map<String, String>`, `Location`,
   `ItemStack`. This is the right answer almost every time.
2. **The type is a third-party type nobody relocates.** The plugin that owns it provides it at
   runtime. `PlaceholderExpansion` is the example above.
3. **The type is declared in your own plugin's package and you never relocate your own
   package.** Publish it from your jar. Consumers compile against your jar.
4. **Nothing is named at all.** The consumer works reflectively.

Option 4 for services finds every provider, regardless of shading. It matches on the simple
name and calls through `java.lang.reflect`:

```java
package com.example.claims;

import org.bukkit.Bukkit;
import org.bukkit.plugin.RegisteredServiceProvider;
import org.bukkit.plugin.ServicesManager;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

public final class ForeignIntegrationLookup {
    private static final String CONTRACT_SIMPLE_NAME = "IntegrationServiceContract";

    private ForeignIntegrationLookup() {
    }

    public static List<Object> providers() {
        ServicesManager services = Bukkit.getServicesManager();
        List<Object> found = new ArrayList<>();

        for (Class<?> service : services.getKnownServices()) {
            if (!CONTRACT_SIMPLE_NAME.equals(service.getSimpleName())) {
                continue;
            }

            for (RegisteredServiceProvider<?> registration : services.getRegistrations(service)) {
                found.add(registration.getProvider());
            }
        }

        return found;
    }

    public static String pluginIdOf(Object provider) {
        try {
            Method pluginId = provider.getClass().getMethod("pluginId");
            Object value = pluginId.invoke(provider);
            return value instanceof String text ? text : null;
        } catch (ReflectiveOperationException failure) {
            return null;
        }
    }
}
```

The providers come back as `Object`. Every method you call on them returns a JDK type or you
unwrap it with reflection. You trade compile-time checking for the ability to talk to a jar
that renamed its classes. Call `providers()` on the main (global region) thread.
`ServicesManager` is not documented as thread-safe. The providers you get may not be either.

`IntegrationMetricSchema.shapedPortalsKeys()` defines the canonical six-key
ShapedPortals metric set for this reflective path: managed portals, interior
cells, creation attempts, created portals, rejected attempts, and creation
success percentage. The descriptors retain their numeric type, unit, plugin,
and domain after React unwraps the relocated provider records.

### Recognizing the failure

| Symptom | Cause |
|---|---|
| `NoClassDefFoundError: art/arcane/volmlib/...` at your own call site | You depended on VolmLib with `compileOnly`, or your shade step dropped it |
| `NoClassDefFoundError: art/arcane/volmlib/...` inside another plugin's stack | You exposed a VolmLib type in your public API |
| `ServicesManager.load(...)` returns `null` with the provider clearly enabled | Provider and consumer relocated VolmLib differently |
| `ClassCastException` between two identically-named classes | Two copies of the same VolmLib type, one relocated |
| State written through VolmLib in one plugin is invisible in another | Per-copy statics, exactly as designed |

---

## Threading

Everything in this suite runs on Folia as well as Paper, so "the main thread" is not a place.
Region threads own worlds and chunks. Entity schedulers own entities. The global region
thread owns everything that belongs to no region.

VolmLib does not hide this. `art.arcane.volmlib.util.scheduling.FoliaScheduler` exposes the
dispatch you need. It behaves correctly on both server types:

| Method | Runs the task where |
|---|---|
| `runGlobal(Plugin, Runnable)` / `runGlobal(Plugin, Runnable, long)` | Global region thread on Folia, main thread on Paper |
| `runRegion(Plugin, Location, Runnable[, long])` | The region owning that location |
| `runRegion(Plugin, World, int, int, Runnable[, long])` | The region owning that chunk |
| `runEntity(Plugin, Entity, Runnable[, long])` | The entity's scheduler. Runs inline when you already own the entity and asked for no delay |
| `runEntity(Plugin, Entity, Runnable, long, Runnable)` | The same, with a retired callback run instead when the entity is gone |

Each method returns `boolean`. `true` means the task was scheduled or run. `false` means it
could not be. Causes include a disabled plugin, a null argument, a location with no world, or
a retired entity. A `false` return is not an exception. It does not retry. Check it if the
work matters.

On the five-argument `runEntity` the retired callback runs whenever the entity is gone. That
is true on both sides of the boolean. `true` means the call was already on the entity's own
thread and could see the entity was retired. `false` means the entity scheduler rejected the
task. Do the cleanup in the callback, not in the `false` branch.

`FoliaScheduler.isFolia(Server)`, `isFoliaThreading(Server)`, `isPrimaryThread()` and the
`isOwnedByCurrentRegion(...)` overloads answer "may I touch this from here" without
scheduling anything.

Everything else in VolmLib states its own threading contract, or has none. Treat a type with
no contract as single-threaded. The one surface in this directory that is safe from any
thread is the placeholder snapshot machinery.
[placeholders](/volmlib/api/placeholders) explains why.

---

## Diagnostic publishing

`art.arcane.volmlib.util.web.MclogsClient` publishes bounded diagnostic text to the fixed `https://api.mclo.gs/1/log` endpoint. Call `publish(content, source, userAgent)` from an asynchronous task; it returns the canonical public `https://mclo.gs/<id>` URI or throws `IOException`/`InterruptedException`.

The client uses JSON, disallows redirects, applies five-second connect and ten-second request timeouts, limits content to 512 KiB and 5,000 lines, and limits the response to 64 KiB. It validates the service's alphanumeric report id and canonical URL and never returns or logs the one-time deletion token. Callers remain responsible for sanitizing report contents and obtaining operator consent before sending data to this external public service. See the [official mclo.gs API documentation](https://api.mclo.gs/).

---

## HUD coordination

`art.arcane.volmlib.util.hud` coordinates the two shared player display surfaces across every
plugin that ships this package, including copies relocated into different namespaces. The
action bar is **cooperative**. Plugins publish text segments. Every copy composes the same
single merged line. The title (title + subtitle + times, one atomic surface) stays
**exclusive** and is arbitrated by bid. Boss bars are neither. Iris uses them only for
persistent background pregeneration status through `HudBossBarLane`; transient foreground
progress never falls back to them.

Coordination never crosses a plugin boundary through a VolmLib type. Each copy posts an
encoded String into Bukkit player metadata. Every copy runs the same deterministic layout or
winner function over all posted values.

### Action bar: `HudActionBar`

A plugin publishes with
`hudBar.publish(player, new HudSegment(purpose, priority, ttlMillis, slots, text))`. It
withdraws with `clear(player, purpose)`. A disconnected-player cleanup uses
`retire(playerId, purpose)` to drop only that local segment, or `retire(playerId)` to drop
every local segment. `text` is a legacy `§` string. `slots` is an ordered `HudSlot`
preference list (`LEFT`, `CENTER`, `RIGHT`).

Every publish re-encodes the plugin's live segments under one metadata value. It then
composes **all** plugins' live segments into one line and sends it. The fastest publisher
keeps everyone's content fresh. A cleared or expired segment disappears on the next compose.
Clearing the last visible segment wipes the bar.

| Piece | Value |
|---|---|
| Metadata key | `volmit.hud.segments` |
| Segment encoding | version `2`, records split by `U+001E`, fields by `U+001F`, text last |
| Layout order | highest priority, then smallest `sinceMillis`, then plugin name, then purpose |
| Slot assignment | first empty preferred slot. Otherwise the segment stacks into its last preference |
| Lane render | `LEFT` then `CENTER` then `RIGHT`. Native claimants before spilled joiners |
| Budget | segments past 150 visible characters are skipped for that frame, best-first |
| Expiry | a segment is dead when `now - assertedMillis > ttlMillis` |

Priorities also set placement rank: `HudPriority` AMBIENT 10, NOTICE 30, STATUS 40, PROGRESS
60, INTERACTIVE 80, MODAL 100, PINNED 1000. `PINNED` is reserved for the one always-centered
ambient HUD (the React monitor). Persistent feature HUDs like Adapt's Sixth Sense line sit at
`STATUS`. Transient notices flank them instead of displacing them. One-shot notices publish
once. The TTL retires them.

### Title: `HudTitleService`

A consumer opens a `HudTitleClaim` with
`titles.open(player, purpose, priority, ttlMillis)`. It calls `resolve()` from its update
loop. `true` means it may render the title this frame, in its own text pipeline.

The bid protocol is unchanged from v1. Metadata key: `volmit.hud.title`. Encoding:
`1\|priority\|sinceMillis\|assertedMillis\|ttlMillis\|purpose`. Winner by highest priority,
then smallest `sinceMillis`, then plugin name, then purpose. Re-asserting keeps `sinceMillis`
stable. That lets a holder keep an equal-priority slot. `release()` withdraws the bid. Iris
foreground progress, Wormholes prompts, and React's monitor edit mode use this surface.

### Threading and retirement

`publish`, `clear`, `resolve`, `release`, and boss-bar `show`/`hide` touch the Bukkit player
and must run on that player's owning scheduler. An entity-scheduler retirement callback
instead calls `HudActionBar.retire(playerId, purpose)`, `HudTitleClaim.retire()`, or
`HudBossBarLane.retire(playerId, laneId)`. Use `HudActionBar.retire(playerId)` only when every
local action-bar purpose belongs to the retiring lifecycle. Those UUID-only operations drop
local state. They do not touch the retired player or its metadata. Segments and bids from a
crashed or disabled plugin expire by TTL. No service registration, election, or reflection
is involved.
