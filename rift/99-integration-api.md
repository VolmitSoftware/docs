---
title: "Rift: Integration API"
description: "World identity, lifecycle services, providers, and completion events"
published: true
date: 2026-10-09T23:55:00.000Z
tags: "rift, api, integrations"
editor: markdown
dateCreated: 2026-10-09T00:00:00.000Z
---

Use the separate `rift-api` artifact to integrate a Bukkit plugin with Rift. Keep it as a compile-only dependency. Declare Rift as an optional dependency with access to its plugin classpath.

## Find the service

After Rift enables, obtain the service from Bukkit:

```java
RiftWorldManager manager = Bukkit.getServicesManager().load(RiftWorldManager.class);
```

Handle an absent service when Rift is optional. Obtain it again after a plugin restart. Do not retain a provider from a disabled Rift instance.

## World identity

`WorldIdentity` contains the exact `NamespacedKey`, UUID, and absolute storage directory. `WorldRegistration` adds a unique command name, lifecycle owner, generator identifier, environment, seed, type, and startup/protection flags.

Use the full key for API operations. Different namespaces can contain the same leaf name. A profile cannot reuse another managed world's UUID or directory.

## Lifecycle operations

| Method | Contract |
|---|---|
| `adoptWorld(registration)` | Register an already loaded world after checking its key, UUID, and directory. Never load or create it |
| `importExisting(request)` | Register canonical existing storage using its saved UUID and seed, without loading it or invoking its generator |
| `create(request)` | Explicitly create a new world through its owner. Refuse existing storage or managed identity |
| `cloneWorld(request)` | Copy an unloaded native dimension, assign a new UUID, retain its seed and chunks, and optionally load it |
| `loadExisting(key)` | Load only managed, valid existing storage. Refuse missing storage, mismatched UUIDs, and unavailable owners |
| `unload(request)` | Evacuate players and wait for the owning provider to finish unloading |
| `forgetWorld(key)` | Retire management while keeping world files and any loaded world |
| `quarantineWorld(key)` | Unload through the owner, then move storage into recoverable quarantine |
| `restoreWorld(id)` | Restore storage and its complete profile without loading the world |
| `find(key)` | Return the managed registration, if present |

Operations return `CompletionStage<WorldOperationResult>`. Inspect `status()`, `message()`, and `world()`, or use `succeeded()`. Completion can occur outside the calling thread. Schedule Bukkit mutations on the correct global, region, or entity thread.

`WorldImportRequest.ImportOptions` declares the command name, lifecycle owner, generator identifier, environment, world type, startup flag, and optional fixed biome. The storage determines the UUID and seed. Loading an imported world requires a separate `loadExisting(key)` call.

`WorldCreateRequest.CreateOptions` adds `WorldGenerationOptions` and `WorldSpawnOptions` to the environment, generator, optional seed, and world type. Generation options select structures, bonus chest, generator settings, and an optional registered fixed biome. Spawn options select an optional absolute position with yaw and pitch, and whether to search nearby for a safe spawn. Creation may generate chunks for that search. Existing-world loading preserves the saved world generation settings.

`WorldCloneRequest` requires the complete source identity, a distinct target key, and options for loading the clone and keeping policies, game rules, and the world border. Native cloning requires an unloaded source stored as a single current Paper dimension. It refuses existing targets and leaves the source unchanged. Resetting copied game rules or the border requires loading the clone. A lifecycle provider can implement `cloneWorld(request)` for its own worlds; providers that do not support cloning refuse the operation.

`executeSynchronously(operation)` accepts typed lifecycle operations on the Paper server thread and returns their completed result. It refuses Folia, other threads, and providers that require asynchronous work. Providers can implement `SynchronousWorldLifecycleProvider` to expose completed synchronous create, load, and unload operations.

Synchronous operations also include `Clone(WorldCloneRequest)` and `Regenerate(WorldRegenerateRequest)`. Cloning requires an unloaded native source, creates a new UUID, and can retain policies, game rules, and the border. Regeneration requires a loaded source, replaces its UUID, and keeps the previous world recoverable in quarantine.

Protected, primary, and evacuation worlds cannot be unloaded or quarantined. Dynamic lifecycle operations return `REFUSED` on unsupported platforms, including Folia.

## Register a lifecycle owner

Implement `WorldLifecycleProvider` and register it with `registerProvider(plugin, provider)`. Each provider has a unique identifier and claims exact world keys through `owns(key)`. Two enabled providers cannot claim the same world.

Keep `create(request)` separate from `loadExisting(request)`. Existing-world loading must attach the saved generator and validate storage without creating missing data. A provider must report success only after the operation finishes.

`existingWorlds()` supplies registrations for loaded worlds. Rift adopts these without generator discovery. Unregister the provider when its plugin disables.

Iris registers the `iris` provider. Iris owns packs, generation, attachment, and engine shutdown. Rift owns profiles, policies, access, and administration.

## Completion events

Listen for `WorldLifecycleEvent` to receive successful operations on the global scheduler. Its operation is `CREATED`, `CLONED`, `ADOPTED`, `IMPORTED`, `LOADED`, `UNLOADED`, `UNMANAGED`, `QUARANTINED`, or `RESTORED`. The event includes the world identity.

The event reports completion and cannot cancel an operation. An unloaded or quarantined world is not available through Bukkit after its event. Use its recorded identity for bookkeeping.

## Multiverse configuration API

The MV5 `MultiverseCoreApi.get().getCoreConfig()` exposes the published configuration method signatures. It reads and updates the canonical `[globalPolicy]` settings in `config.toml`; it does not read Multiverse configuration files at runtime. `load()` reloads Rift's canonical configuration, and `save()` saves managed state.

| Multiverse configuration methods | Canonical setting or behavior |
|---|---|
| `get/setEnforceAccess`, `get/setEnforceGameMode`, `get/setEnforceFlight` | `globalPolicy.enforceAccess`, `enforceGameMode`, `enforceFlight` |
| `get/setGamemodeAndFlightEnforceDelay` | `globalPolicy.gamemodeAndFlightEnforceDelay` |
| `get/setApplyEntitySpawnRate`, `get/setApplyEntitySpawnLimit` | `globalPolicy.applyEntitySpawnRate`, `applyEntitySpawnLimit` |
| First-spawn and join-destination getters/setters | Global first-join and login controls documented in [Configuration](/rift/04-configuration-localization) |
| `getStringPropertyHandle()` | Published dotted Multiverse property names route to the same typed configuration methods |
| `getConfig()` | Live property view backed by canonical settings; known property writes use the same validation and capability checks |
| Automatic import and generator-detection getters | Always `false`; attempts to enable them return a failed `Try` |
| Legacy Bukkit/server-properties path getters/setters | Unsupported operations; they do not fabricate or alter server configuration paths |

Additional configuration setters require the corresponding runtime capability. Unavailable features, including chat-prefix handling, custom portal searches, command confirmation modes, and dynamic listener priorities, return failed `Try` values instead of storing ineffective settings. Check every returned `Try`; a published method signature does not imply an unavailable operation succeeded.

Multiverse clone and regeneration methods use these completed synchronous operations. Clone options retain their policy, game-rule, and border flags. Regeneration refuses a nonempty `keepFiles` list before mutation; selective file retention is unavailable. Cloning a loaded source without a flush is also unavailable.

World-manager `importWorld(options)` resolves canonical existing storage, preserves its saved UUID and seed, registers it, and explicitly loads it. It returns the actual loaded world only after successful completion. It refuses missing or invalid storage and owners that cannot finish synchronously on the Paper server thread.

The MV4 `getMVConfig()` interface uses the same canonical settings. Its teleport and message cooldowns are measured in milliseconds. `getPlayerSession(player)` checks the teleport cooldown, and `getMessaging()` enforces per-player message cooldowns. Permission queries use Rift and Multiverse sister nodes. Unsupported configuration operations throw instead of writing inactive values.

`WorldEntryCheckerProvider`, available through the MV5 service locator, creates read-only access, player-limit, incoming-blacklist, and affordability checks. Check the returned `Result` or `ResultChain`; checks do not load worlds, transfer players, or charge fees.

## Economy API

Obtain `RiftEconomyManager` from Bukkit's services manager after Rift enables. `registerProvider(plugin, provider)` selects an enabled native `EconomyProvider`; one native provider can own monetary transactions at a time. When no native provider is registered, Rift uses an enabled economy service supplied through Vault. Removing or disabling a native provider removes its registration.

`EconomyAmount` contains a nonnegative finite amount and a currency material. `Material.AIR` selects money; an item material selects a whole item count. `canAfford`, `withdraw`, and `deposit` operate on the executing player's account or inventory. `balance` and `setBalance` accept an optional world for providers with world-specific accounts. Inspect each `EconomyResult` instead of assuming that a transaction succeeded.

`format(amount)` formats a validated amount. `formatPrice(value, currency)` also accepts finite signed values and fractional item prices for display, without changing an account or inventory.

Transactions require the Paper server thread and refuse Folia. Item withdrawal refuses insufficient inventory without changing slots. Item deposit refuses an inventory that cannot hold the whole amount. Missing monetary providers and provider failures return explicit failure results. These account operations do not teleport a player.

The Multiverse 4 and 5 economist APIs use the same native service. Signed prices retain their original formatting. Nonpositive affordability checks succeed, and fractional item transactions truncate to a whole count before native validation. Transaction failures throw from the legacy void methods.

The MV5 `payEntryFee(player, world)` method prepays through a world-specific native reservation. The next matching admission uses that reservation rather than charging again; failed or abandoned entry refunds it. The amount-and-currency overload performs an explicit account transaction, with a negative price depositing a reward.
