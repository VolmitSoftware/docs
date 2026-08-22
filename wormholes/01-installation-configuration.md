---
title: "Installation & Configuration"
description: "Install, data folder, wormholes.toml, and quality profiles"
published: true
date: 2026-08-22T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Copy the shaded Wormholes jar into `plugins/`. Start the server once so
Wormholes creates `plugins/Wormholes/`. Then edit `config/wormholes.toml`
(`schema = 2`). A missing optional plugin skips its bridge.

## Requirements

| Item | Value |
|------|--------|
| Runtime | Paper, Paper-compatible derivatives such as Purpur, and Folia (`folia-supported: true`) |
| Java | 25 (build toolchain and server launch) |
| Native access | Prefer `--enable-native-access=ALL-UNNAMED` so zstd-jni loads without restricted-access warnings |
| Soft depends | PlaceholderAPI, Iris, Vault (optional). Load them BEFORE when they are present |
| Artifact | Shaded plugin jar from `./gradlew shadowJar` (prefer over thin/api jars for runtime) |

## Install

1. Copy the shaded jar into `plugins/`.
2. Start the server. Wormholes creates the data folder and writes
   `config/wormholes.toml` if the file is missing.
3. Edit `plugins/Wormholes/config/wormholes.toml`. Wormholes rejects files that
   have no schema or a wrong schema. The file must use `schema = 2`.
4. Apply config changes with `/wormholes reload` or the config file watcher.

Direct edits to `languages/*.toml` need `/wormholes reload` or a config change.
Dimensional Doors pack and registry changes need a full server restart. See
[07 - Dimensional Doors](/wormholes/07-dimensional-doors).

## Data folder layout

```
plugins/Wormholes/
  config/wormholes.toml     consolidated settings (schema 2)
  portals/                  saved local portal files
  doors/                    dimensional door / pocket state (`state.json` plus `state.json.tickets/`)
  languages/                optional per-locale TOML overrides
  routes/peers.properties   learned peer routes (not in wormholes.toml)
  trust/peers.properties    trusted peer public keys
  identity/                 network key material (server.identity, keys)
  dict/                     persisted network compression dictionaries
  uds/                      default Unix-domain socket directory
  wormholes-stats.txt       default stats snapshot path (overridable)
```

Peers are not listed under `[network]` in TOML. Import and export write routes
and trust under `routes/` and `trust/`. See
[10 - Cross-Server Networking](/wormholes/10-cross-server-networking).

## Config path and schema

| Property | Value |
|----------|--------|
| Path | `plugins/Wormholes/config/wormholes.toml` |
| Schema | `schema = 2` (`WormholesConfigFile.CURRENT_SCHEMA`) |
| Quality key | top-level `quality` (not inside a table) |
| Sections | `[main]`, `[network]` (+ nested), `[projection]`, `[render]` |
| Key form | kebab-case from Java field names (`teleportCooldownMillis` → `teleport-cooldown-millis`) |

Startup and explicit `/wormholes reload` loads rewrite the file in canonical
form with every known key. Canonical rewriting removes custom comments and
unknown or misspelled keys. Passive file hotload parses an immutable byte
snapshot and never rewrites the watched file. Files with no schema, a wrong
schema, or a parse failure keep the previous live settings.

## Visual quality (`quality`)

| Value | Effect after clamps from `[projection]` / `[render]` are applied |
|-------|------------------------------------------------------------------|
| `auto` (default) | No profile clamps |
| `performance` | Forces `lighting-fidelity = false`, `entity-spoofing = false`. Caps range ≤ 32, depth ≤ 48, max projectors/tick ≤ 12, max portals/observer/tick ≤ 2, max new observer scans/tick ≤ 32 |
| `balanced` | Lighting refresh interval ≥ 6, entity update interval ≥ 2, max spoofed entities ≤ 16, max projectors/tick ≤ 20, max new observer scans/tick ≤ 64 |
| `cinematic` | Range ≥ 64, depth ≥ 96, max projectors/tick ≥ 32, and max new observer scans/tick ≥ 128. Lighting refresh ≤ 2, lighting max sections/pass ≥ 4, entity spoof range ≥ 64, and max spoofed entities ≥ 48 |

Unknown profile names fail the load. `enable-particles` remains an independent
global particle switch. `quality` controls the projection and render profile.

## Runtime clamps (`Settings.refresh`)

Wormholes clamps config values when it applies them to runtime. Canonical
rewriting happens before runtime clamps. An out-of-range source value can stay
on disk while the live value is bounded.

| Runtime field source | Clamp |
|----------------------|--------|
| `portal-collapse-speed` | 0.0–1.0 |
| `teleport-cooldown-millis` | 0–60000 |
| `portal-pushback-multiplier` | 0.0–4.0 (non-finite → 1.0) |
| `portal-sound-volume-multiplier` | 0.0–4.0 (non-finite → 1.0) |
| `chunk-pre-send-radius-chunks` | 0–16 |
| `chunk-pre-send-max-chunks` | 0–1024 |
| `chunk-pre-send-budget-micros` | 0–25000 |
| `arrival-warm-radius-chunks` | 0–12 |
| `arrival-warm-max-radius-chunks` | ≥ warm radius, ≤ 32 |
| `arrival-warm-hold-millis` / `arrival-warm-throttle-millis` | 0–60000 |
| `arrival-transition-mask-ticks` | 0–200 |
| `chunk-send-rate-target` / `chunk-load-rate-target` | 0.0–10000.0 (≤0 or >10000 treated as unlimited at Paper tuner) |
| `projection.range` | 1.0–256.0 |
| `near-plane-padding` | 0.0–16.0 |
| `aperture-padding-blocks` | 0.0–8.0 |
| `frustum-culling-ratio` | 0.0–1.0 |
| `refresh-interval-ticks` | 1–20 |
| `depth-blocks` | 1–256 |
| `recursive-portal-depth` | 3–64 |
| `stable-cell-resample-interval-ticks` | 1–200 |
| `observer-interest-dot` | −1.0–1.0 |
| `side-grace-dot` | 0.0–1.0 |
| `max-projectors-per-tick` | 1–512 |
| `max-portals-per-observer-tick` | 1–64 |
| `max-new-observer-scans-per-tick` | 1–4096 |
| `interest-grace-ticks` | 0–100 |
| `initial-resend-passes` | 0–20 |
| `max-projected-cells` | 0–50000000 (0 disables the ceiling) |
| `lighting-refresh-interval-ticks` | 1–40 |
| `lighting-max-sections-per-pass` | 1–64 |
| `entity-update-interval-ticks` | 1–20 |
| `entity-spoof-range` | 1.0–256.0 |
| `entity-candidate-cache-ticks` | 1–40 |
| `max-spoofed-entities` | 0–256 |
| `capture-zone-radius` | 1.0–64.0 |

## Top-level keys

| Key | Default | Notes |
|-----|---------|--------|
| `schema` | `2` | Must match exactly |
| `quality` | `auto` | `auto` \| `performance` \| `balanced` \| `cinematic` |

## `[main]`

| Key | Default | Notes |
|-----|---------|--------|
| `language` | `en_US` | Active locale name. See [11 - Localization](/wormholes/11-localization) |
| `language-fallbacks` | `""` | Comma-separated fallback locales. Code English is always final |
| `enable-particles` | `true` | Independent global particle switch |
| `replace-nether-and-end-portals` | `true` | Auto-link vanilla Nether/End frames as Wormholes portals |
| `dimensional-doors-enabled` | `true` | Full Dimensional Doors feature set. Live disable is allowed |
| `pocket-room-size` | `16` | Cube edge in blocks of a newly created pocket room, walls included. The default is a 16×16×16-block cube with a 14×14×14 interior. Clamped to 8–128. Existing pockets keep their own size |
| `pocket-shell-material` | `SMOOTH_STONE` | Wall, floor, and ceiling block of a newly created pocket. Must be solid and non-falling. Existing pockets keep their own material |
| `pocket-return-door-material` | `CRIMSON_DOOR` | Exit door of a newly created pocket. Must be hand-operable, so iron doors are rejected. Existing pockets keep their own door |

### Traversal API-related main keys

| Key | Role |
|-----|------|
| `traversal-api-enabled` | Master switch for third-party cost providers and traversal events |
| `traversal-api-provider-failure-policy` | `allow` vs `deny` on provider failure |
| `traversal-api-provider-fault-limit` | Session quarantine threshold |
| `traversal-api-slow-provider-millis` | Slow-call warning threshold |

API surface details:
[21 - API - Traversal Cost & Events](/wormholes/21-api-traversal-cost-events).


## `[recipes]`

One table per Dimensional Door product plus the two reskin toggles. Full
grammar, ingredient groups, and fallback behavior:
[07 - Dimensional Doors](/wormholes/07-dimensional-doors#configuring-recipes).

| Table | Keys | Default |
|-------|------|---------|
| `[recipes.pair-kit]` | `enabled`, `shape`, `ingredients` | `EDE\|ORO\| D ` |
| `[recipes.personal-door]` | `enabled`, `shape`, `ingredients` | ` R \|CDE` |
| `[recipes.public-door]` | `enabled`, `shape`, `ingredients` | `RDR\| E \| L ` |
| `[recipes.trapdoor-pair-kit]` | `enabled`, `shape`, `ingredients` | as the door kit, with `#trapdoors` |
| `[recipes.personal-trapdoor]` | `enabled`, `shape`, `ingredients` | as the personal door, with `#trapdoors` |
| `[recipes.public-trapdoor]` | `enabled`, `shape`, `ingredients` | as the public door, with `#trapdoors` |
| `[recipes.door-skin]` | `enabled` | `true` |
| `[recipes.trapdoor-skin]` | `enabled` | `true` |

The Portal Wand recipe is outside this block and is not configurable. Runes have
no recipe.

`enabled = false` removes that recipe from the server. A `shape` or
`ingredients` value that does not parse, or that names a block this server does
not have, is logged and falls back to the shipped recipe.
| `portal-collapse-speed` | `0.91` | Collapse animation factor |
| `verbose-logging` | `false` | Verbose console logs (`Settings.DEBUG`) |
| `debug-rendering` | `false` | Debug rendering aids |
| `teleport-cooldown-millis` | `1000` | Local teleport cooldown. Also floors cross-server handoff rate limit (min 1000 ms) |
| `portal-pushback-multiplier` | `1.0` | Rejected-traversal push scale. 0 mutes knockback |
| `portal-sound-volume-multiplier` | `1.0` | Portal/door/traversal sound scale. 0 mutes |
| `traversal-api-enabled` | `true` | If false, no cost provider runs and traversal events do not fire |
| `traversal-api-provider-failure-policy` | `allow` | `allow` (treat fault as free pass) or `deny` (close portal) on provider throw/misbehavior |
| `traversal-api-provider-fault-limit` | `5` | Faults before provider quarantine. `0` disables quarantine |
| `traversal-api-slow-provider-millis` | `5` | Warn when a provider call meets or exceeds this ms. `0` disables |
| `chunk-pre-send-enabled` | `false` | Pre-send destination chunks at traversal commit (off until verified) |
| `chunk-pre-send-radius-chunks` | `3` | Radius of pre-send |
| `chunk-pre-send-max-chunks` | `32` | Hard ceiling per traversal |
| `chunk-pre-send-budget-micros` | `2000` | Microseconds of the commit tick the pre-send may use |
| `arrival-prewarm-on-interest` | `true` | Pre-warm arrival chunks when observers show interest |
| `arrival-warm-radius-chunks` | `4` | Warm radius |
| `arrival-warm-max-radius-chunks` | `10` | Max warm radius |
| `arrival-warm-hold-millis` | `5000` | Hold warm state |
| `arrival-warm-throttle-millis` | `1000` | Throttle between warm actions |
| `arrival-transition-mask` | `true` | Transition mask at arrival |
| `arrival-transition-mask-ticks` | `25` | Mask duration |
| `chunk-send-rate-tuner` | `true` | Once at startup, raise Paper per-player chunk send/load rate caps (never lowers) |
| `chunk-send-rate-target` | `1000.0` | Target chunks/sec send. Paper default 75. `<=0` or `>10000` is unlimited |
| `chunk-load-rate-target` | `1000.0` | Target chunks/sec load. Paper default 100. `<=0` or `>10000` is unlimited |

## `[network]`

Cross-server networking. Default `enabled = false`. Import and export set
`enabled = true` and start the network when needed. See
[10 - Cross-Server Networking](/wormholes/10-cross-server-networking).

| Key | Default | Notes |
|-----|---------|--------|
| `enabled` | `false` | Cross-server portals / peers |
| `listen-enabled` | `true` | Accept inbound peer connections |
| `listen-port` | `8901` | Preferred raw-stream port. Bind scans this port through +50. Otherwise game-port sideband is used |
| `trust-on-first-use` | `true` | Trust unknown peer keys on first approved contact when no stored key |
| `entity-transfer-deny-types` | `""` | Comma-separated entity type names denied for entity transfer |
| `advertise-host-override` | `""` | Force advertised host in export codes |
| `server-name` | `""` | Local network name override (empty uses identity default) |
| `transfer-mode` | `auto` | `auto` \| `proxy` \| `direct` (see networking doc) |
| `handoff-timeout-ms` | `5000` | Admission / handoff deadline |
| `auto-accept-transfers` | `true` | Compatibility rewrite of TRANSFER handshakes to LOGIN when native `accepts-transfers` is not set |

Static `[[peers]]` are not written into this file. Peers live in
`routes/peers.properties`.

### `[network.transport]`

| Key | Default | Notes |
|-----|---------|--------|
| `compression-enabled` | `true` | Wire compression |
| `compression-level` | `3` | Runtime clamp 1–22 |
| `compression-dict-train-bytes` | `10485760` | Dictionary corpus budget. Runtime minimum 65536 bytes |
| `compression-dict-target-size` | `65536` | Dictionary size target |
| `compression-retrain-interval-sec` | `600` | Retrain interval. Runtime minimum 30 s. Applies on reload (reschedules the dictionary retrain task) |
| `uds-enabled` | `true` | Unix domain sockets when available |
| `uds-dir` | `""` | Empty uses `plugins/Wormholes/uds`. A relative override resolves from the JVM working directory |

### `[network.view]`

Entity delta rates for remote views:

A non-positive Hz value disables that distance band. Positive rates above 20 Hz
still schedule at most once per server tick.

| Key | Default |
|-----|---------|
| `entity-delta-enabled` | `true` |
| `entity-rate-near-range` | `16.0` |
| `entity-rate-mid-range` | `64.0` |
| `entity-rate-far-range` | `128.0` |
| `entity-rate-near-hz` | `20.0` |
| `entity-rate-mid-hz` | `10.0` |
| `entity-rate-far-hz` | `4.0` |
| `entity-rate-very-far-hz` | `1.0` |

### `[network.stats]`

| Key | Default | Notes |
|-----|---------|--------|
| `enabled` | `true` | Periodic stats snapshot file |
| `interval-sec` | `10` | Write interval. Runtime minimum 1 s |
| `path-override` | `""` | Empty → `wormholes-stats.txt`. Relative paths resolve under the data folder. Absolute paths are used as written |

### `[network.replication]`

| Key | Default | Notes |
|-----|---------|--------|
| `hash-probe-interval-sec` | `30` | Hash probe cadence. Runtime minimum 1 s |
| `hash-probe-chunks-per-tick` | `16` | Probe budget. Runtime minimum 1 |
| `diff-window-size` | `32` | Diff window. Runtime minimum 1 |
| `resync-timeout-sec` | `5` | Resync timeout. Runtime minimum 0 |
| `max-queued-diffs-per-peer` | `4096` | Queue cap |
| `capture-snapshot-interval-ticks` | `100` | Snapshot interval. Runtime minimum 20 ticks |
| `capture-max-queued-diffs-per-chunk` | `256` | Per-chunk queue. Runtime minimum 16 |
| `capture-light-enabled` | `true` | Capture light in replication |
| `capture-block-entity-enabled` | `false` | Block-entity NBT capture. Disabled by default (renderer does not consume it) |

## `[projection]`

| Key | Default | Notes |
|-----|---------|--------|
| `range` | `48.0` | Observer interest / projection range |
| `refresh-interval-ticks` | `1` | Projection refresh cadence |
| `near-plane-padding` | `2.0` | Near plane pad |
| `aperture-padding-blocks` | `0.75` | Extra outward pad past aperture edges. Raise if rim bleed-through |
| `frustum-culling-ratio` | `0.2` | Frustum cull ratio |
| `depth-blocks` | `64` | Extra search distance for recursive portal candidates. Primary view depth is per portal |
| `recursive-portal-depth` | `3` | Nested portal recursion (runtime min 3) |
| `stable-cell-resample-interval-ticks` | `4` | Stable cell resample |
| `client-view-distance-cap` | `true` | Cap to client view distance |
| `foveated-unrendering` | `false` | Look/side interest filter (`observer-interest-dot` and `side-grace-dot`). Off means any observer inside the view AABB is interested |
| `observer-interest-dot` | `-0.2` | Look-toward interest threshold |
| `side-grace-dot` | `0.12` | Portal-side grace |
| `max-projectors-per-tick` | `24` | Global projector budget |
| `max-portals-per-observer-tick` | `4` | Per-observer portal budget |
| `max-new-observer-scans-per-tick` | `64` | New observer scan budget |
| `interest-grace-ticks` | `5` | Ticks a projector stays open after live interest is lost (unrender-on-loss delay) |
| `initial-resend-passes` | `1` | Full sends after view create (raise only to diagnose packet loss) |
| `max-projected-cells` | `250000` | Hard scan ceiling. Budget drops lateral pad first then depth. `0` disables (not recommended) |

Projection behavior detail:
[05 - Projection Modes & Settings](/wormholes/05-projection-modes-settings).

## `[render]`

| Key | Default | Notes |
|-----|---------|--------|
| `lighting-fidelity` | `false` | Send destination lighting with projected blocks |
| `entity-spoofing` | `true` | Show destination-side entities in projections |
| `lighting-refresh-interval-ticks` | `4` | Lighting refresh |
| `lighting-max-sections-per-pass` | `2` | Lighting section budget |
| `adaptive-lighting` | `true` | Adaptive lighting |
| `entity-update-interval-ticks` | `1` | Entity spoof update cadence |
| `entity-spoof-range` | `48.0` | Spoof range |
| `entity-candidate-cache-ticks` | `3` | Candidate cache TTL |
| `max-spoofed-entities` | `24` | Cap per view |
| `capture-zone-radius` | `8.0` | Capture zone radius. Applies on reload (every local portal rebuilds its capture AABB) |

## Hot reload

| Path | Mechanism |
|------|-----------|
| `config/wormholes.toml` change | A cheap 200 ms loop drains native filesystem events without rereading idle content. It reads on an event, pending stability verification, or the 2.5-second exact-content reconciliation that catches missed events and content changes whose size and timestamp are unchanged |
| `languages/*.toml` change | Not watched directly. Use `/wormholes reload` or touch the config file |
| `/wormholes reload` | Immediate, unthrottled reload of configuration and language files (`wormholes.admin.reload`). It invalidates older queued automatic work before applying |
| Failed language load on reload | Config may still apply. Last valid language is kept. Console reports the cause |
| Network enable/peer changes | Import/export may start the network without a full restart |

Automatic hotload waits for one byte-identical snapshot to remain stable for
350 ms. Only one application can run at a time. After it completes, the next
automatic application cannot begin for three seconds; edits received during
that interval replace the queued candidate, so the final snapshot still runs.
Only the exact bytes parsed and successfully applied are acknowledged. A save
that lands during application remains queued. Startup, manual reload, and the
full reset seed watcher state from the exact canonical settings snapshot that
became live, so a newer disk save that lands before watching resumes remains a
candidate instead of becoming an unobserved baseline.

Temporary deletion or an empty intermediate file, as produced by some FTP
clients and editor save strategies, is treated as an incomplete save. Wormholes
waits for `wormholes.toml` to reappear as a stable regular file. Passive reads
are limited to 8 MiB. Invalid snapshots keep the last-known-good settings;
application failures retain the snapshot for bounded-backoff retry and report a
full console stacktrace.

Use `/wormholes admin deleteeverything` to wipe config, routes, trust,
identity, portals, and doors. That command needs `wormholes.admin.reset`.

## Related docs

- [09 - Commands & Permissions](/wormholes/09-commands-permissions) — reload, debug, stats, network commands
- [10 - Cross-Server Networking](/wormholes/10-cross-server-networking) — network keys in operation
- [11 - Localization](/wormholes/11-localization) — `language` / overrides
- [21 - API - Traversal Cost & Events](/wormholes/21-api-traversal-cost-events) — traversal API contract
