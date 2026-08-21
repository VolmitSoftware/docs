---
title: "Runtime Architecture"
description: "Wormholes documentation: Runtime Architecture"
published: true
date: 2026-08-20T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Wormholes starts as a Paper/Folia Java plugin
(`art.arcane.wormholes.Wormholes`). It loads schema-2 TOML settings. It then
builds managers for portals, projection, RTP, dimensional doors, and optional
cross-server networking. This page covers enable order, storage layout, Folia
scheduling, hot reload, and soft-dependency load order.

Operator procedures live in
[14 - Operator Runbooks & Smoke Tests](/wormholes/14-operator-runbooks-smoke-tests).
Config keys live in
[01 - Installation & Configuration](/wormholes/01-installation-configuration).

## Boot and enable order

### Constructor / onLoad

1. SlimJar bootstraps dependencies in the plugin constructor.
2. `onLoad` sets `INSTANCE`/`instance`.
3. `onLoad` calls PacketEvents `load()`.

### onEnable (success path)

Order from `Wormholes.onEnable`, then network bootstrap:

1. `resetForEnable` — clear stale listeners, integration, and placeholders.
   Reset drain flags.
2. When the server is not Paper, Wormholes prepares the Spigot pocket datapack
   (`doors.prepareSpigotPocketDatapack`).
3. Preload JSON persistence classes.
4. `WormholesSettings.loadAll(dataFolder)` → `Settings.refresh`.
5. `VaultEconomy`, `WormholesLocalization`, then localization reload from
   settings.
6. Wormholes installs the scheduler bridge
   (`SchedulerRuntime` / FoliaScheduler), the chunk lease registry, and
   `ChunkSendRateTuner`.
7. PacketEvents `init()`. Audience and HUD services start.
8. Core managers:
   - `BlockManager`
   - `EffectManager`
   - `ConstructionManager`
   - `WandSelectionManager`
   - `VanillaTravelCostCapture`
   - `PortalManager`
   - `TraversableManager`
   - `ProjectionManager` (with PacketEvents projection chunk tracker)
   - `ProjectionWorldChangeTracker`
   - `ArrivalWarmer`
   - `BukkitRtpRuntime` via `BukkitRtpEnvironment`, wired into projection as
     the RTP projection provider
9. When `[main] dimensional-doors-enabled` is true and the datapack is ready,
   `doors.applySetting(settings)` starts dimensional doors and the pocket world.
10. Register listeners for block, effect, construction, wand, vanilla travel
    cost, portal skins, portal manager, and traversable. Also register
    projection, projection change, vanilla portal replacer, and chat input.
11. Repeating tasks start: RTP attendance sweep (20t), arrival warmer sweep
    (40t), vanilla dimensional-frame validation (40t).
12. `network.bootstrap(settings)` starts the remote registry, `NetworkManager`,
    import/export, portal sync, and traversal service. It also starts the remote
    view cache, view subscriptions, view server, message and peer sinks, the
    transfer channel, and network start.
13. `WormholesCommandService.register()`.
14. `WormholesIntegrationService.register()`.
15. When PlaceholderAPI is present, the PlaceholderAPI expansion registers.
16. `TraversalCostGateway` from traversal API settings.
17. The hotload manager starts. It registers a filesystem watcher for
    `config/wormholes.toml` and keeps content-digest reconciliation as a
    fallback.
18. Diagnostics start. Network capture runtime start.
19. The splash screen prints. On failure, Wormholes tears down fully and
    self-disables.

### Disable / pre-unload

`tearDownBeforeDrain` runs in this order:

1. Invalidate hotload admission, close the filesystem watcher, and join its
   worker thread.
2. Unregister integration and placeholders.
3. Shut the traversal cost gateway.
4. Shut the door manager, then the pocket world.
5. Close RTP.
6. Shut down projection.
7. Shut the view server.
8. Shut the arrival warmer.
9. Release chunk leases.
10. Shut effects.
11. Cancel plugin and Folia tasks.
12. Drain remaining static state.

BileTools `onPreUnload` uses the same tear-down path.

## Storage layout (`plugins/Wormholes/`)

| Path | Contents |
|------|----------|
| `config/wormholes.toml` | Consolidated settings schema **2**: `schema`, `quality`, `[main]`, `[network]`, `[projection]`, `[render]`. Wormholes writes this file in canonical form on load and save. |
| `portals/` | Local portal JSON files in a nested UUID layout (`portals/<segment>/<segment>/<uuid>.json`). |
| `doors/` | Dimensional door store: `doors/state.json` plus per-player return tickets under `doors/state.json.tickets/`. |
| `languages/` | Optional per-locale TOML overrides (`<locale>.toml`). Bundled locales ship in the jar. English is owned by the code catalog. |
| `routes/` | Cross-server route data for imported peers and portals. |
| `trust/` | Peer trust keys (`PeerTrustStore`). |
| `identity/` | Local network identity material. Reset deletes this tree. |
| `dict/` | Persisted Zstd dictionaries and training state for the sideband transport. |
| `uds/` | Default Unix-domain socket location when UDS transport is enabled and no custom directory is set. |
| `wormholes-stats.txt` | Operator snapshot overwritten on an interval unless `[network.stats] path-override` overrides it. |

Full plugin reset (`/wh admin deleteeverything`) deletes `config`, `identity`,
`routes`, `trust`, `portals`, and `doors`. It then writes a new door snapshot
and keeps the retired pocket slot counter. It reloads defaults. The command
refuses while players are inside or mid-transit in a pocket dimension.

## Folia and scheduling

- The plugin declares `folia-supported: true` (Paper plugin metadata).
- World and entity work uses VolmLib `FoliaScheduler` region, entity, and global
  runners. It does not use raw Bukkit async world mutation.
- **Projection:** A global tick schedules observer frames with
  `FoliaScheduler.runEntity` on each observer. Packet and claim work then run on
  the observer entity thread. On Folia, world sampling uses
  `RegionSnapshotWorldViewProvider`. Other platforms use live views.
- When work is not already on the portal source region, portal RTP settings
  apply on that region.
- Network traversal maintenance is global-scheduled. The view subscription sweep
  is async-repeating.
- Chunk leases and the arrival warmer hold destination chunks without projecting
  them.

## Hot reload

| Trigger | Behavior |
|---------|----------|
| `/wh reload` | Permission `wormholes.admin.reload`. Immediately loads and canonicalizes `wormholes.toml`, prepares localization, and applies on the global scheduler next tick. It is not subject to the automatic cooldown and invalidates older queued automatic work. |
| File hotload | Native create/modify/delete events plus periodic SHA-256 reconciliation watch only `config/wormholes.toml`. A candidate must remain byte-identical for 350 ms. Passive parsing does not canonicalize or write the file. |

The watcher reads at most 8 MiB into an immutable snapshot and validates that
the file did not change during the read. This detects atomic replacement and
same-size/same-timestamp edits while ignoring unrelated temporary files. A
temporary missing or empty target is held as an incomplete FTP/editor save; a
recreated stable file is considered normally.

Automatic applications are single-flight and latest-wins. The three-second
cooldown begins when an application completes. Changes during an in-flight
application or cooldown replace the trailing candidate, and only the exact
snapshot that was parsed and successfully applied is acknowledged. A refused
global task or subsystem application failure keeps the snapshot pending with
bounded exponential retry. A malformed snapshot is rejected until its content
changes. Startup, successful manual reload, and full reset start the watcher
against the exact canonical bytes applied to the runtime; any newer disk bytes
already present are reconciled as pending work rather than baselined away.

`applyReloadedState` refreshes `Settings` and syncs debug telemetry. It notifies
`BlockManager` of language and re-applies dimensional-doors enable or disable.
It notifies `ProjectionManager` and `ViewServer` of projection setting changes.
It invalidates the command cache. It applies network config and
replication/capture settings, then restarts the stats snapshot writer.

An invalid language reload keeps the previous localization snapshot. An invalid
config parse keeps the previous live settings and never reaches the global
application path. Manager notification and runtime reconfiguration failures
propagate to the watcher, emit their full stacktrace, and prevent acknowledgment
so the candidate can retry.

## Soft depends and load order

`plugin.yml` softdepend: **PlaceholderAPI**, **Iris**, **Vault**.

Paper plugin dependencies (optional, `load: BEFORE`, join-classpath):

| Plugin | Role |
|--------|------|
| PlaceholderAPI | `%wormholes_…%` expansion (`WormholesPlaceholders`). |
| Iris | Terrain/probe integration for RTP and worldgen-aware features where present. |
| Vault | Economy for travel costs via `VaultEconomy`. |

Wormholes load uses Paper metadata `load: STARTUP`. Legacy `plugin.yml` uses
`POSTWORLD`. Soft depends are not required. Missing plugins skip their
integrations. See [15 - Integrations](/wormholes/15-integrations).

## Major runtime components

| Component | Role |
|-----------|------|
| `PortalManager` / registry storage | Load, save, and tick attendance for local portals. |
| `ProjectionManager` | Observer interest, budgets, freeze/flush, and projectors. |
| `BukkitRtpRuntime` | RTP search, leases, projection views, and attendance. |
| `DimensionalDoorManager` / `PocketWorldService` | Survival doors and the pocket dimension. |
| `NetworkManager` + view/replication stack | Cross-server codes, peers, remote views, and handoff. |
| `ArrivalWarmer` | Destination chunk prewarm on projection interest. |
| `TraversalCostGateway` | Public traversal pricing API. |

## Cross-references

- Installation and TOML:
  [01 - Installation & Configuration](/wormholes/01-installation-configuration)
- Projection settings:
  [05 - Projection Modes & Settings](/wormholes/05-projection-modes-settings)
- RTP: [06 - Random Teleport Portals](/wormholes/06-random-teleport-portals)
- Networking:
  [10 - Cross-Server Networking](/wormholes/10-cross-server-networking)
- Operator checklists:
  [14 - Operator Runbooks & Smoke Tests](/wormholes/14-operator-runbooks-smoke-tests)
