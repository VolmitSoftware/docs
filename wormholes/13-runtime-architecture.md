---
title: "Runtime Architecture"
description: "Startup, shutdown, storage, scheduling, hot reload, and runtime components"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Wormholes starts as a Paper/Folia Java plugin
(`art.arcane.wormholes.Wormholes`). It loads schema-3 TOML settings. It then
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

1. `resetForEnable` clears stale listeners, integration, and placeholders.
   Reset drain flags.
2. When the server is not Paper, Wormholes prepares the Spigot pocket datapack
   (`doors.prepareSpigotPocketDatapack`).
3. Preload JSON persistence classes.
4. `WormholesSettings.loadAll(dataFolder)` → `Settings.refresh`.
5. `VaultEconomy`, `WormholesLocalization`, then localization reload from
   settings.
6. Wormholes installs the scheduler bridge
   (`SchedulerRuntime` / FoliaScheduler), the region-task provider, chunk lease
   registry, chunk pre-send provider, and `ChunkSendRateTuner`.
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
11. The RTP attendance sweep starts (20t).
12. `network.bootstrap(settings)` starts the remote registry, `NetworkManager`,
    import/export, portal sync, and traversal service. It also starts the remote
    view cache, view subscriptions, view server, message and peer sinks, the
    transfer channel, and network start.
13. The arrival warmer sweep (40t) and vanilla dimensional-frame validation
    (40t) start.
14. `WormholesCommandService.register()`.
15. `WormholesIntegrationService.register()`.
16. When PlaceholderAPI is present, the PlaceholderAPI expansion registers.
17. `TraversalCostGateway` from traversal API settings.
18. The hotload manager starts. It registers a filesystem watcher for
    `wormholes.toml` and keeps content-digest reconciliation as a
    fallback.
19. Diagnostics start. Network capture runtime start.
20. The splash screen prints. On failure, Wormholes tears down fully and
    self-disables.

### Disable / pre-unload

`tearDownBeforeDrain` runs in this order:

1. Invalidate hotload admission, close the filesystem watcher, and join its
   worker thread.
2. Unregister integration and placeholders.
3. Shut portal sync, including inbound portal-settings application.
4. Shut the door manager and pocket world, close RTP, and drain pending
   cross-server traversals.
5. Shut the portal manager so no new local traversal can start.
6. Wait up to 2s for active traversal-cost evaluations, give existing callbacks
   500ms to publish an outcome, then drain owner settlements for up to 2s on
   traveler entity owners.
7. Retire accepted region tasks. This remains after traversal rollback so RTP
   and source-region recovery can finish first.
8. Shut down projection, the view server, the arrival warmer, chunk pre-send,
   chunk leases, and effects.
9. Cancel plugin and Folia tasks.
10. Drain remaining runtime and static state.

BileTools `onPreUnload` uses the same tear-down path.

## Storage layout (`plugins/Wormholes/`)

| Path | Contents |
|------|----------|
| `wormholes.toml` | Consolidated settings schema **3**: top-level `language`, `metrics`, `language-fallbacks`, `schema`, and `quality`, followed by `[main]`, `[recipes]`, `[network]`, `[projection]`, and `[render]`. Wormholes writes this file in canonical form on load and save. |
| `portals/` | Local portal JSON files in a nested UUID layout (`portals/<segment>/<segment>/<uuid>.json`). |
| `doors/` | Dimensional door store: `doors/state.json`, per-player return tickets under `doors/state.json.tickets/`, and replayable resize intents under `doors/pending-resizes/<space-id>.json`. |
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
- Region-task callbacks are retired exactly once if their world unloads, the
  plugin shuts down, or the scheduler rejects or throws while submitting them.
  Submission exceptions include the world, chunk, delay, and full stacktrace in
  the server log.
- **Projection:** A global tick admits a bounded, fairly rotating subset of
  observer frames with `FoliaScheduler.runEntity`. The default shared cap is 64
  player-owner frames per tick across normal projection and surface skins;
  packet and claim work then run on the observer entity thread. On Folia, world sampling uses
  `RegionSnapshotWorldViewProvider`. Other platforms use live views. Projected
  entity animation and hurt forwarding uses exact entity-to-projector
  membership, coalesces duplicate work into one owner task per observer, and
  drains at most 256 distinct entities from that observer queue per task.
  Venticular visibility first removes solid samples buried by their neighbors,
  then uses hierarchical accepted-block occupancy cubes to skip
  exact empty ray segments. Each constant-time jump is conservatively anchored
  before the next occupied cube boundary so floating-point rounding cannot step
  past a blocker; sparse rays query that hierarchy before exact blocker-set
  membership. The cell scan computes normal-plane depth once per slab, carries
  transformed remote keys beside observer targets, and bypasses observer-ray
  filtering when a pass produced no blocker geometry. Venticular removes rear
  cells whose complete set of eye-facing faces is covered by accepted adjacent
  opaque cells before consuming long-range ray budget when the reveal guard is
  zero. The default one-degree angular guard expands hidden proofs so camera
  movement exposes buffered geometry before an occluder edge crosses it. Cells left unresolved by
  the bounded ray pass remain fail-open but persist as the priority worklist for
  subsequent passes instead of bypassing future occlusion checks. Buried-cell sampling
  visits the 6 unique distance-one and 18 unique distance-two shell cells once
  instead of repeating memo lookups. Exact target-to-blocker proofs are retained across passes,
  geometrically revalidated after observer movement, and discarded when their
  blocker leaves the active projection geometry. Budget-limited visibility
  cells remain unresolved and are retried before new visibility work. Projection
  reuse waits until that unresolved set is empty. Destination samples survive
  camera-only view-cell rebuilds and are bounded by the fitted candidate volume. Dense
  multi-block sections are ordered by state and position for per-packet
  compression. Projection updates, fluid-skin claims, stale-portal releases, and
  client-chunk retries share the observer claim frame, so overlapping cell
  ownership is resolved once from the final frame state and its section packets
  are flushed together rather than exposing transient intermediate winners.
  Before portal work is scheduled, a conservative front-to-back aperture pass
  retires any farther projector whose complete view is geometrically covered by
  one nearer rectangular portal; partial and irregular overlaps remain active.
  Non-fluid display skins also flush once per portal on
  that observer task, with uncertain partial spawns retained for owner-thread
  cleanup before any retry. Blackout remeshes close transparent far, ceiling,
  floor, and side boundaries, retain pane entity IDs, and move and resize them
  in place before retiring surplus panes. Local-entity
  occlusion likewise unions retained
  claims from every portal for that observer before applying visibility changes
  and searches the complete fitted projection depth. It requires the complete
  expanded physical, name, and display envelope to fit inside the portal
  frustum, preserving partially exposed entities. Venticular projected entities
  reuse a separate 16,384-step bounded pass over the accepted destination
  blocker geometry; their complete conservative envelope must resolve hidden
  before the synthetic entity is withheld, so partial or uncertain visibility
  fails open.
  Entity teardown skips packet-channel lookup and flush work when no projected
  entity or client-side name-team state exists.
- Placed-rune animation does not inspect players while no runes are tracked;
  otherwise it admits at most 64 player entity tasks per nine-tick pass and
  rotates fairly through the online population. Portal-tool validation admits
  at most 64 tasks per three-tick scan, prioritizes dirty inventory state and
  confirmed holders, and reserves capacity for fallback discovery. Retired or
  rejected tasks keep their work eligible for retry, and player quit or plugin
  shutdown removes their scheduler state.
- When work is not already on the portal source region, portal RTP settings
  apply on that region.
- Settings received from a remote gateway are coalesced per portal and applied
  on that portal's owning region. Open menu refreshes run on each viewer's
  entity scheduler. Rejected region/global submissions retain and retry the
  latest update.
- Due portal updates on Folia are grouped by exact world and portal-center chunk,
  so portals with the same owner share one region task without combining work
  across ownership boundaries.
- Network traversal maintenance is global-scheduled. The view subscription sweep
  is async-repeating, retries scheduler rejection, and rechecks a concurrent
  subscription while releasing an idle loop. A failed partial initial bulk
  subscription is reset and retried instead of being marked ready, with its
  cancellation handle published before scheduling can execute or reject it. Initial
  subscriptions share one fair global pump that starts at most eight chunk-column
  captures every two ticks instead of multiplying that allowance per session.
  Ongoing entity snapshots use a separate fair global queue with at most eight
  new captures and eight captures in flight every two-tick maintenance pass.
  Dirty replication chunks rotate through a global limit of 64 drains per tick;
  Folia admits at most one owner-region task per chunk until that drain retires,
  and a rejected global drain cycle retries after one second.
- Dimensional-door visuals share one two-tick maintenance loop. Attendance is
  spread across 20 buckets, with at most 64 overlay entity-owner tasks admitted
  and 64 in flight per pass; teardown retires queued and active leases exactly.
- Eventless dimensional-door objects share one owner-dispatched chain and one
  entity-array read per reached chunk each tick. Door memberships are combined
  within that chunk. Rejected owner chains retain their memberships and retry;
  unloaded target chunks pause without recurring work and resume on chunk load.
- Chunk leases and the arrival warmer hold destination chunks without projecting
  them.

## Hot reload

| Trigger | Behavior |
|---------|----------|
| `/wh reload` | Permission `wormholes.admin.reload`. Immediately loads and canonicalizes `wormholes.toml`, prepares localization, and applies on the global scheduler next tick. It is not subject to the automatic cooldown and invalidates older queued automatic work. |
| File hotload | A cheap 200 ms loop drains native create/modify/delete events for only `wormholes.toml`. Full snapshot reads occur on an event, pending stability verification, or 2.5-second exact-content reconciliation. A candidate must remain byte-identical for 350 ms. Passive parsing does not canonicalize or write the file. |

Idle event polls do not read or hash the config. When a read is due, the watcher reads at most 8 MiB into an immutable snapshot and validates that
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

`plugin.yml` softdepend: **PlaceholderAPI**, **Iris**, **Vault**, **Citizens**.

Paper plugin dependencies (optional, `load: BEFORE`, join-classpath):

| Plugin | Role |
|--------|------|
| PlaceholderAPI | `%wormholes_…%` expansion (`WormholesPlaceholders`). |
| Iris | Terrain/probe integration for RTP and worldgen-aware features where present. |
| Vault | Economy for travel costs via `VaultEconomy`. |
| Citizens | Keeps projected local-entity occlusion authoritative when Citizens attempts to relink a standard tracked NPC. |

WorldGuard is discovered reflectively rather than declared as a soft dependency.
When available, its `ENTRY` flag participates in RTP destination admission.

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
