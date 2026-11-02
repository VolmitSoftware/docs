---
title: "VolmLib API"
description: "VolmLib documentation: API overview for plugin developers"
published: true
date: 2026-10-28T00:00:00.000Z
tags: "volmlib, api"
editor: markdown
dateCreated: 2026-08-12T00:00:00.000Z
---

VolmLib is a Java library used by Volmit plugins. Add only the modules your plugin uses and bundle VolmLib with your plugin.

For the shared build script, concurrency controls, and tests-only runs, see [Workspace builds](/volmlib/api/building).

## Common packages

| Package | Use |
|---|---|
| `util.scheduling` | Paper/Folia-safe global, region, and entity tasks |
| `util.parallel` | Batched background work and executor lifecycle |
| `util.event` | Shared permission-check interaction events |
| `util.bukkit` | Inventory-view access, experience awards, and entity initialization |
| `util.bukkit.papi` | PlaceholderAPI expansions and snapshot stores |
| `util.director` | Commands, help, and completion |
| `util.localization` | Message catalogs, on-demand translations, and player language preferences |
| `util.diagnostics` | Shared Bukkit diagnostic reports, plugin snapshots, uploads, and container memory snapshots |
| `util.plugin` | Rich text, messages, titles, and logging |
| `util.board` | Scoreboard sidebars |
| `nativelib` | Versioned native capabilities from the optional native modules |
| `util.inventorygui` | Inventory menus |
| `util.config` | Typed TOML configuration |
| `util.io` | File and directory change detection |
| `util.nbt` / `util.nbt.mca` | NBT and region files |
| `util.noise` / `util.interpolation` / `util.stream` | Seeded procedural fields and interpolation |
| `util.hunk` / `util.math` | Three-dimensional storage, coordinates, and rarity selection |
| `integration` | Cooperative plugin reload, integration metrics, and Vault economy operations |
| `projection` | Active virtual viewpoints shared by portal renderers and presentation plugins |

For the canonical procedural APIs, see [Noise and procedural streams](/volmlib/api/noise) and [Hunks and coordinate math](/volmlib/api/hunks).

## Cooperative plugin reload

`ReloadAware` lets Bukkit plugins report asynchronous readiness, refuse an unload, resume cancelled preparation, and complete committed cleanup before BileTools tears down their registrations. The explicit contract works across separate classloaders and relocated VolmLib packages. See [Cooperative plugin reload](/volmlib/api/reloading) for signatures and scheduling rules.

## Projection viewpoints

Create one `ProjectionViewRegistry(plugin)` for a portal renderer. Call `publish(viewerId, viewId, destinationWorldId, eyeX, eyeY, eyeZ)` with the virtual destination viewpoint of each active, admitted view. Renew it while the view remains active; entries expire after two seconds. Call `removeView(viewerId, viewId)` when a view closes, `removeViewer(viewerId)` when the viewer leaves, and `close()` when the plugin stops.

Presentation plugins create one `ProjectionViewAccess(plugin)` and close it when their service stops. `viewers(worldId, x, y, z, range)` returns each nearby viewer UUID mapped to its closest squared distance. `distanceSquared(viewerId, worldId, x, y, z)` returns the closest active virtual distance, or positive infinity when none exists. Queries use immutable coordinate snapshots and can run outside the viewer's owning thread; evaluate player conditions and change visibility on the viewer's owning thread. Apply existing audience conditions and budgets to virtual viewers.

`ProjectionViewProvider` is registered with Bukkit's service manager. Access discovers providers once and follows service registration events, including providers shaded into other plugin classloaders. Its methods exchange only JDK types.

## Startup splash helpers

`art.arcane.volmlib.util.plugin.SplashScreenSupport` supplies `javaMajorVersion()`, `startupDate()`, `releaseTrain(String version)`, and `serverVersionWithoutMcSuffix(String serverVersion)`. Pass the platform's server description explicitly; Bukkit callers can pass `Bukkit.getVersion()`. The server helper removes a trailing Minecraft version description beginning with ` (MC:`.

These helpers are available in both `volmlib-shared` and the Bukkit-free `volmlib-localization` artifact. Mod loaders can use the localization artifact for splash, typed configuration, and atomic file APIs without bundling Bukkit classes. The [Husk template](/husk) demonstrates these APIs across the supported server platforms.

## File replacement

`util.io.AtomicFileIO.writeString(target, content)` writes UTF-8 content to a forced temporary file and replaces the destination; `replace(source, target)` publishes an already-staged file. Replacement is atomic where the filesystem supports it and uses ordinary replacement only when atomic moves are unsupported.

On Windows, access-denied replacements make up to 50 attempts with 10-millisecond waits, allowing brief reader locks to clear. Persistent denial propagates the filesystem exception; an interrupted wait preserves the interrupt flag and raises `InterruptedIOException`. Run these blocking operations on an IO worker.

## Background work

`util.parallel.MultiBurstSupport` runs batches on a reusable worker pool. Its workers use the concrete executor class’s classloader as their context loader, including after `close()` and `reopen()`, so tasks can resolve resources and services bundled with the owning plugin or mod. Background tasks do not acquire ownership of world or entity state; schedule gameplay changes on the appropriate platform thread.

## Chunk loading

`art.arcane.volmlib.util.scheduling.WorldChunks.load(plugin, world, x, z, generate)` returns a `CompletableFuture<Chunk>`. Set `generate` to `false` to request only existing terrain; a missing chunk completes with `null`. Paper and Folia use the asynchronous chunk-loading API; servers without it execute the load on the chunk's owning scheduler. Scheduling rejection and loading failures complete the future exceptionally.

Future completion does not grant ownership of world or entity state. Schedule any chunk inspection or mutation on its region, and recheck that the target world and chunk are still available. Canceling the returned future does not guarantee that a server load already requested will stop.

## Strict JSON input

`art.arcane.volmlib.util.json.StrictJsonReader` wraps a `Reader` and rejects uppercase JSON literals, raw control characters in strings, and invalid string or Unicode escapes with `IOException`. Use it with a parser configured for strict JSON; it validates lexical rules and leaves document structure to that parser. Closing it closes the supplied reader. This supports strict input validation when the host supplies Gson 2.10.

## Block-state NBT

`MCABlockStateCodecSupport.encodeBlockState` and `decodeBlockStateString` require an explicit `Format`. Use `CAPITALIZED` for the `Name` and `Properties` fields used through Minecraft 26.2, or `LOWERCASE` for the `id` and `properties` fields used by Minecraft 26.3. Select the format from the target server version when writing and the source data version when reading.

Decoders and MCA palette reader functions accept `Tag<?>`. The `LOWERCASE` format also reads propertyless states stored as strings, including the empty-key wrappers used in mixed palettes. Encoding returns a compound tag in the selected format.

`NBTWorldSupport.blockStateCodec` accepts a `BlockStateCodecOptions` record containing the resolver, fallback supplier, block-data string function, material-key function, and format. Each codec caches encoded states for its selected format; use separate codec instances for different formats.

## Region access and interruption

Mantle region access reports a failed load and propagates its original cause. A failed request does not retry recursively. A later explicit request can retry after the cause is resolved. Asynchronous access releases acquired maintenance permits once, including when lookup or load setup throws. Canceling its returned future does not release permits until the underlying load finishes or prevent their later release. The region loader also recovers corrupt files.

`HyperLockSupport.lock` preserves the thread interrupt flag and throws `IllegalStateException` with the original `InterruptedException` when acquisition is interrupted. Protected work does not run without an acquired lock. The long-wait warning still reports successful lock acquisition after contention. `hasQueuedThreads(x, z)` reports whether threads are currently queued for an existing coordinate lock without creating one. Its result is advisory and does not acquire the lock.

## Dependency

```groovy
repositories {
    maven { url = uri('https://jitpack.io') }
}

dependencies {
    implementation('com.github.VolmitSoftware:VolmLib:<version>')
}
```

Relocate `art.arcane.volmlib` to a package owned by your plugin when shading. Do not expose VolmLib types in a public API shared with another plugin; each plugin normally has its own relocated copy.

## Text

Use `ComponentText.markup(...)` for trusted MiniMessage templates and `ComponentText.literal(...)` for player or external text. Send it with `ComponentMessenger`. `clickOpenUrl(...)` accepts HTTP and HTTPS URLs.

`ComponentMessenger` uses native rich messages where available. Its Spigot player delivery preserves RGB gradients, nested click actions, and hover text through Bukkit's Bungee component API. Director help and language menus use this delivery path for Bukkit senders; generic non-Bukkit sinks use their plain text fallback. Action-bar delivery also preserves translatable components, their arguments, and RGB colors through this API; consumers without the optional JSON serializer retain legacy text delivery.

`art.arcane.volmlib.util.bukkit.BukkitCommandMaps.commandMap(server)` returns the runtime command map on Paper and Spigot. `knownCommands(map)` returns its live registration table for exact command ownership checks and removal. Call these on the server thread. Access failures throw `IllegalStateException` with the reflective cause; callers must retain foreign registrations and unregister only their own commands.

`BukkitComponents` in the same package reads and writes component display names and lore, and creates inventories with component titles. Paper receives the original components; Spigot uses its legacy text setters, preserving supported colors and styles but converting translation keys and custom fonts to text. Server-side setter failures propagate rather than switching to a different representation. `BukkitProfiles.textureValue(base64)` and `textureId(id)` build profiles through Bukkit profile APIs, retaining skin URLs, classic/slim models, and cape URLs. They preserve appearance, not texture-property signatures or timestamps. `BukkitProfiles.forPlayer(player)` reads the current server profile without reconstructing or updating it, resolving the accessor at runtime because Paper and Spigot declare different return types.

Plugins that disable VolmLib's transitive dependencies must include `net.kyori:adventure-text-serializer-gson:4.26.1` and its runtime dependencies when shading rich Spigot menus. Relocate `net.kyori` with the plugin's other Adventure classes. If the JSON serializer is absent, Spigot delivery retains legacy colored text, with click and hover actions unavailable; Paper's native rich-message path does not require that serializer.

`LegacyLoreLayout.wrap(legacyText, columns)` wraps item lore while preserving legacy colors and formatting across lines. It keeps surrogate pairs and combining marks together and conservatively counts wide Unicode characters as two columns. Plugins choose the column budget for their inventory layout.

## Scoreboard text

`BoardProvider.getTextFormat()` defaults to `BoardTextFormat.LEGACY`, preserving section-code strings and literal markup. Return `BoardTextFormat.MINI_MESSAGE` to render trusted MiniMessage titles and rows, including namespaced resource-pack fonts and mixed legacy colors. Rich text uses the native packet sidebar and requires an available native scoreboard provider; it is not flattened into legacy Bukkit strings. Unchanged rows retain the normal board update cache.

`ScoreboardPackets.newObjectiveJson` and `sendTeamPacketJson` accept serialized Minecraft text components for objective display names and team prefixes/suffixes. The string methods accept legacy text.

## Commands

Director accepts keyed values such as `player=Alex`. Use brackets for spaces:

```none
/example announce text=[Server restarts in five minutes]
```

Aliases remain executable, while help and completion show canonical command names.

## Block support

`NativeAdapters.require(SpawnProtectionAccess.class).create(server)` creates native spawn-protection checks. `check(player, block)` reports `ALLOWED`, `PROTECTED`, or `UNSUPPORTED`. Consumers retain region-ownership and third-party protection checks. See [Native spawn protection](/volmlib/api/spawn-protection) for the decision contract and [Native server access](/volmlib/api/native-access) for dependencies and version selection.

`BSupport.isUpdatable(...)` recognizes exposed pointed-dripstone and sulfur-spike tips through the server’s speleothem API; body and merged-tip segments are excluded. On the supported Bukkit 26.1.2 boundary, pointed-dripstone detection uses that version’s API.

`BSupport.decodeBlockData(key)` on Bukkit and `NativeBlockResolver.decode(key)` on modded platforms load saved block-state keys without applying generation defaults such as leaf persistence. They preserve explicit state properties and registered custom-content resolution; invalid native properties throw `IllegalArgumentException`. Use the ordinary block lookup methods for pack configuration.

## Protection checks

`art.arcane.volmlib.util.event.ProtectionProbe.blockInteract(player, block, hand)` and `entityInteract(player, entity)` create permission-check events. Dispatch them through Bukkit on the thread owning the player and target, then inspect their cancellation and use results. They retain the standard interaction handler lists, so protection listeners receive them.

Gameplay listeners should return early when `ProtectionProbe.isProbe(event)` is true. Protection listeners must still evaluate the request. The marker works across separately shaded VolmLib copies, allowing preview and remote-access checks to run without activating held items or menus.

## Item snapshots

`art.arcane.volmlib.util.bukkit.ItemStackCodec.encode(item)` captures a non-air stack of 1 to 99 items into a versioned string. It normalizes Bukkit material, amount and serializable item metadata, restores a copy on the running server, and rejects a differing amount or `isSimilar` result. `decode(encoded)` returns a fresh `ItemStack` and rejects data captured on a newer Minecraft data version. Call both methods on the owning thread when working with a live inventory; they perform no scheduling or file I/O.

`validate(encoded)` checks the envelope, typed values, item structure and resource limits without accessing Bukkit runtime state, so configuration readers can call it off-thread. Runtime restoration is still required before using a validated snapshot. Unsupported, malformed, lossy or oversized data throws `IllegalArgumentException`; `encode(null)` throws `NullPointerException`.

`MAX_ENCODED_LENGTH` is 131,072 characters. The codec also bounds nesting, collection sizes, node counts and compressed metadata expansion, accepts only supported Bukkit serialization aliases, and refuses plugin-supplied alias replacements. It does not use Java object deserialization. Nested item templates are normalized recursively. Capture verifies fidelity on the current runtime; transferring snapshots between forks or upgrading Minecraft still requires consumer validation of the restored result.

## Registry lookup

`RegistryUtil.findByEnum(type, keys)` resolves public static constants by their lowercase Minecraft keys. Field-name normalization uses `Locale.ROOT`, so the JVM's default locale cannot make constants containing `I`, including sound names, unavailable.

## Threading

`BukkitInventoryViews.top(view)` and `BukkitInventoryViews.player(view)` provide reusable access to a view's top inventory and human entity across the `InventoryView` class-to-interface change. They require an existing view on its owning thread. See [Inventory-view access](/volmlib/api/inventory-views) for method contracts and failure behavior.

`UIWindow.inventoryViewTopInventory(view)` returns the top inventory through the shared reflective Bukkit boundary. Plugins compiled against 1.20.1 can use it across the later `InventoryView` class-to-interface change without emitting an incompatible direct invocation. A null view returns null; callers must still access a player's view on the owning thread.

Use `FoliaScheduler` for Bukkit work. Entity and player state belongs on the entity scheduler; world and block state belongs on the owning region; global tasks use the global scheduler. Keep file and network I/O off those threads. Inventory-window clicks and close continuations stay on the viewing player's entity scheduler; when that owner retires or rejects a continuation, VolmLib discards the callback and runs only its retirement cleanup instead of retrying player work on the global scheduler.

For a cancellable one-shot delay, call `FoliaScheduler.scheduleGlobal(plugin, options)` or `scheduleEntity(plugin, entity, options)`. Pass `new FoliaScheduler.DelayedTask(delayTicks, action, retired)`; delays are at least one tick. The methods return a `SchedulerUtils.TaskHandle`, or `null` when scheduling is refused. Entity actions preserve the player's localization audience.

Keep the handle while the task is pending and call `cancel()` during owner cleanup. It cancels the native Bukkit or Paper task. The action and retirement paths are mutually exclusive; successful cancellation or entity retirement invokes retirement cleanup at most once, while an already executing action finishes normally. A cancellation that cannot finish immediately waits for the callback to drain. Unexpected cancellation failures throw and leave retirement pending; callers must log the failure and keep any capacity reservation until retirement or execution occurs.

Retirement cleanup can run on the thread that requests cancellation. Keep it limited to thread-safe bookkeeping or explicitly schedule entity/world mutations onto their owner. Handle a `null` scheduling result as refusal, and make caller-side refusal cleanup idempotent because retirement may already have run.

## Integration metric snapshots

Register providers under `IntegrationServiceContract` and retain `sampleMetrics(Set<String>)` for consumers that use synchronous sampling. To offer cached metrics, also implement `IntegrationSnapshotProvider` and advertise `IntegrationSnapshotProvider.CAPABILITY` (`metric-snapshots-v1`) in capabilities and accepted handshake responses.

`snapshotMetrics(Set<String>)` records demand and returns an `IntegrationMetricSnapshot` containing already captured values. It must not collect metrics, wait for collection, submit a job per request, or access Bukkit state. Collect demanded metrics on a provider-owned cadence; use the correct global, region, or entity owner for Bukkit reads, then publish immutable numeric values. Return an empty or unavailable result while a requested metric is warming up.

`IntegrationMetricSnapshot(generation, capturedAtMs, samples)` uses a nonnegative capture sequence that increases for each publication within a provider instance. Repeated reads of one publication preserve its generation and timestamps. Keep each sample's actual capture time, including older samples carried into a newer publication; it cannot exceed the publication's capture time. Sample map keys must match their descriptors. Consumers use these timestamps for freshness and retain their previous successful value only within their configured age and unavailable-retention limits.

`IntegrationMetricPublisher(capacity, demandTtlMs)` supplies bounded demand tracking and immutable publication. Delegate snapshot requests to `snapshotMetrics(keys, nowMs)`. During collection, obtain `Demand` from `demandedKeys(nowMs)`, collect its `keys()`, and call `publish(demand, capturedAtMs, samples)`. Publishing accepts only keys from that demand. Call `clear()` on disable or reload to invalidate both current values and captures still using an older demand epoch; rejected publication returns `false`. A capture older than the latest publication is also rejected. `reconfigureCapacity(capacity)` clears demand and publication when capacity changes, invalidating pending captures while preserving the increasing capture sequence. Choose a capacity sufficient for supported consumers: oversized individual requests or publications throw, while multiple consumers share a least-recently-requested demand limit, reported by `evictions()`.

Providers without `IntegrationSnapshotProvider` are sampled synchronously. A consumer cannot make arbitrary provider code safe to run asynchronously or interrupt a blocking provider call by applying a timeout after it returns.

## Economy

`VaultEconomy` requires enabled Vault and an enabled plugin owning the economy registration. On region-threaded servers, that registration owner must also declare Folia support in its plugin metadata. Missing or unsupported providers report `PROVIDER_UNAVAILABLE` without invoking their economy methods; ordinary Bukkit servers do not require the Folia declaration.

Call economy operations from the correct gameplay thread. A successful withdrawal returns a charge that can be committed or refunded once; refunds use the original provider. A failed refund can be retried, and provider exceptions retain their console stack traces. These settlement objects are in memory, so consuming plugins remain responsible for durable transaction records and recovery.

`VaultEconomy.transferProvider()` returns an optional `TransferProvider` bound to the selected registration, economy instance and owning plugin. `identity()` is the captured `<plugin name>/<economy name>`; `available()` checks the captured provider's enabled state and Folia declaration, while `current()` additionally requires the same registration to remain selected. These handles do not switch providers automatically.

`supportsPrecision(int scale)` checks the current provider's declared `fractionalDigits()` before a consumer offers a payment at that scale. It accepts scales from 0 through 18 and returns true only when the declaration is `-1` (no rounding) or at least the requested scale, with the registration still current after the check. Invalid scales, stale registrations and provider exceptions return false; exceptions retain their console stack traces. Consumers must repeat this check when confirming a review. It does not round amounts or certify the provider's internal accounting.

`transfer(player, new TransferRequest(direction, amount, context))` accepts `DEPOSIT` or `WITHDRAW` and a finite positive amount. It checks the captured registration, account existence and, for withdrawals, available funds before invoking the payment method. The result is `SUCCESS` only for a successful response reporting the exact requested amount, `REJECTED` for validation failures or a failed response reporting zero transferred, and `UNKNOWN` for missing, malformed, partial or inconsistent responses or exceptions during the payment call.

The transfer API supplies no persistence, scheduling, precision policy, retry or compensation. Callers must persist intent before payment, run the transfer on the correct owner thread, retain uncertain outcomes for reconciliation and avoid automatically repeating them. The charge/refund API behaves independently of transfers.

## Experience awards

Call `BukkitExperience.award(player, points)` on the player's owning thread to grant positive vanilla experience. It publishes one `PlayerExpChangeEvent`, then grants and returns its final positive amount. Zero or negative inputs publish no event; a listener that sets the amount to zero or below suppresses the grant. The helper does not schedule work or apply Mending. Use ordinary balance setters and deduction or refund methods for bookkeeping, so restoring a balance does not publish a reward.

## Entity initialization

`BukkitEntitySpawns.spawn(region, location, entityType, initializer)` calls the server's public spawn method with an initializer that runs before the entity enters the world. It resolves the Bukkit callback on 1.20.1 and the Java callback on newer APIs without linking callers to the removed callback type. This permits private displays to set visibility and persistence before being added. Call it on the region's owning thread; it does not schedule work or prevent chunk loading on behalf of the caller.

`FoliaScheduler.isStopping(Server)` reports terminal shutdown when the server exposes that capability; it returns false for an unavailable capability or a null server. On Folia, shutdown can report entity ownership after the region world-data context is gone. Consumers can use this check to skip removal of nonpersistent visual entities during terminal shutdown while retaining normal reload and plugin-disable cleanup.

## Matter slice identifiers

Register slice codecs before reading or writing their data. `IrisMatter.registerSliceType(String id, MatterSlice<?> slice)` binds one stored identifier to a payload type and codec. Keep that identifier stable when source packages change. The overload without an ID uses the payload type's canonical Java name. Built-in types have stable identifiers.

Repeated registration of the same ID, payload type, and codec has no effect. Conflicting IDs, payload types, or codecs fail registration. IDs must be nonempty, contain no whitespace or control characters, and fit the UTF header limit of 65,535 encoded bytes.

Readers resolve IDs through this registry and skip unregistered slices using their declared byte length. Writers reject payload types without a registered codec. The stored format does not change when an explicit ID retains the existing value.

`RawMatter<T>` subclasses register medium-specific codecs through `registerWriter(Class<W>, MatterWriter<W, T>)` and `registerReader(Class<W>, MatterReader<W, T>)`. Retrieve them with `writeInto(Class<W>)` and `readFrom(Class<W>)`; an unregistered medium returns `null`. Registering the same medium again replaces its codec for that slice instance.

## Mantle storage

Runtime mantle lookups return `null` for an absent section, and removals leave absent sections unallocated. Use `getOrCreate(sectionY)` explicitly when allocating section storage.

`Mantle.hasLoadedFlag(x, z, flag)` checks a chunk flag without loading or creating data. `withLoadedChunk(x, z, action)` runs a short action on an existing chunk, returning `false` when it is unavailable or its region is busy, otherwise the action's result. The action runs with the chunk and region protected from concurrent cleanup and eviction; do not load, save, or close mantle data from it, or use the chunk after the action returns.

`Mantle.saveOldestIdleTectonicPlate()` saves and unloads at most one resident plate, choosing the oldest eligible last-use timestamp. Plates whose last recorded use is less than 250 ms old, pinned by active work, or locked by another operation are skipped. A plate requested by waiting threads during its save remains resident for those requests, and the method can try another eligible plate. The method returns `true` only when a plate was unloaded; write failures propagate and retain the live plate for retry.

`Mantle.saveAll()` and `close()` propagate region write failures after reporting the original exception. Failed writes retain their live region and chunk data for retry. A failed close keeps the mantle open and preserves its region locks; only a successful flush and region-IO close complete shutdown. An IO-close failure can be retried without rewriting regions already saved. Consumers must drain generation before closing storage and retain the mantle when close fails.

## File watching

`FileWatcher` and `FolderWatcher` combine filesystem snapshots with native watch events. A full scan reports each create or delete transition once, including on Windows where the native delete notification may arrive after the scan has already observed the missing path. Native modification events still detect writes whose size, timestamp, and file identity remain unchanged.

`ReactiveFolder` debounces changes and checks file stability before invoking its callback. A detected save can be delivered while an unrelated content-reconciliation scan is still running. Silent content changes remain batched until their scan finishes, and a failed callback retains pending changes for retry.

## TOML configuration

`TomlCodec.toToml(...)` writes collections and arrays of objects as TOML arrays of tables (`[[rewards]]`), including nested tables and quoted keys. Both the typed-object and JSON-tree overloads support this structure; primitive lists remain inline arrays. A table array must contain only objects, and `fromToml(...)` reconstructs the typed list or array.

## JSON optional booleans

`JSONObject.optBoolean(key, defaultValue)` returns the default without logging when the key is absent. Present values accept booleans and case-insensitive `"true"` or `"false"` strings. Other values, including JSON null, retain the default and report the conversion exception with its stack trace. `getBoolean(key)` still throws for missing or invalid values.

For PlaceholderAPI, see [Placeholders](/volmlib/api/placeholders).

For downloads, jar packaging, server defaults, player preferences, and the per-language inventory editor, see [Shared localization](/volmlib/api/localization).

For the `debugdump` command, report contents, permissions, and plugin contributors, see [Shared diagnostic reports](/volmlib/api/diagnostics).

For release checks, join notices, `/volmit plugins updates`, and per-plugin update settings, see [Update notifications](/volmlib/api/github-releases).

For Linux container memory limits, usage, pressure, and remaining headroom, see [Container memory](/volmlib/api/diagnostics#container-memory).
