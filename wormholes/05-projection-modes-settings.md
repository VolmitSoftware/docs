---
title: "Projection Modes & Settings"
description: "Projection ON/OFF, PanOptic vs Venticular, budgets, and render"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Through-portal projection changes what one player's client sees inside a portal
aperture. It can show destination blocks, supported entities, and optional
lighting without moving the player. Traversal is a separate system.

Per-portal mode and render mode combine with global `[projection]` and
`[render]` keys in `plugins/Wormholes/wormholes.toml` (schema 3).

## What projection does for a viewer

When projection is active for a portal, and an online player is inside that
portal’s view AABB, `ProjectionManager` builds a per-observer
`PortalProjector`. That projector samples destination (or mirror) geometry and
spoofs client blocks through the aperture. If entity spoofing is enabled,
Wormholes injects destination-side entities into the projected view. Those
entities stay inside configured ranges and caps. Projection does not move the
player. Traversal is a separate tunnel path.

## ProjectionMode (ON / OFF)

| Value | Meaning |
|-------|---------|
| `ON` | Portal may project for interested observers (default for new portals). |
| `OFF` | Projection is disabled for that portal. |

Toggled from the portal home menu. Stored on the portal as `projectionMode`.
Legacy mirror-style fields still resolve to ON/OFF via
`LocalPortalSettings.resolveProjectionMode`.

## ProjectionRenderMode

Default for new portals: **VENTICULAR**.

| Mode | Display | Buried cell culling | Observer occlusion | Notes |
|------|---------|---------------------|--------------------|-------|
| `VENTICULAR` | Venticular | Yes | Yes | Default. Removes buried solids and destination cells hidden from the observer. |
| `PANOPTIC` | PanOptic | No | No | Fuller capture of the destination volume. More cells and cost. |

Stored as `renderMode` on the portal JSON. Toggled from the portal settings
menu.

Use **Venticular** for normal play. It removes solid cells that are enclosed by
their neighbors, then checks remaining destination cells from the observer's
view. Reusable blocker proofs and an occupancy index reduce repeated ray work.
If the visibility budget ends during a pass, unresolved cells remain eligible
and receive priority on the next pass. A projector does not reuse an incomplete
frame as though its visibility work had finished.

Use **PanOptic** when you need the full sampled volume even when some of it is
buried or hidden. It is intentionally the more expensive mode.

Venticular removes a rear cell immediately when every block face oriented
toward the destination-side observer is covered by an accepted adjacent opaque
cell and the configured reveal margin is zero. Otherwise the visibility proof
expands the tested silhouette by `occlusion-reveal-margin-degrees` so movement
reveals geometry before it can bleed around an occluder.
Remaining ambiguous cells use the conservative ray proof and fail open when
visibility cannot be proven, so gaps and transparent openings remain visible.
Budget-unresolved cells stay visible for that pass but are carried ahead of
ordinary targets on the next projection pass until their visibility resolves;
the fail-open tail therefore does not become permanent client state.

## Interest and view AABB

**View AABB.** Each portal’s view volume is the portal structure area. Wormholes
expands that area by the effective activation range on every axis
(`LocalPortalGate.computeView`). An observer must have their location inside
that AABB to be considered for that portal.

**Live interest.** If `foveated-unrendering` is false (default), any observer
inside the view AABB is interested. If it is true, interest also needs:

- stable portal-side facing with absolute normal dot ≥ `side-grace-dot`
  (default `0.12`)
- look direction toward the portal center with direction dot ≥
  `observer-interest-dot` (default `-0.2`)

**Grace.** After live interest is established, `interest-grace-ticks` (default
`5`) keeps the projector open for that many projection ticks after interest is
lost. Brief head turns then do not tear down the view immediately. Grace
applies only if a projector already exists for that portal/observer pair.

## Budgets

Global per-tick budgets (from `[projection]`, refreshed into `Settings`):

| Key | Default | Clamp | Role |
|-----|---------|-------|------|
| `max-projectors-per-tick` | `24` | 1–512 | Total block-update projector slots per tick across all observers. |
| `max-portals-per-observer-tick` | `4` | 1–64 | Cap on portals one observer may block-update in one frame. |
| `max-new-observer-scans-per-tick` | `64` | 1–4096 | Shared cap on player-owner reconciliation frames per tick across normal projection and surface skins. |
| `max-projected-cells` | `250000` | 0–50000000 | Hard ceiling on candidate block positions scanned for one portal pass. `0` disables the ceiling (not recommended). |

Observer admission uses independent rotating lanes. Existing projector or skin
state receives most available slots so stale client state is removed promptly,
while discovery receives at least one slot whenever the budget is at least two;
a one-slot budget gives discovery every fourth tick. An observer with an
already-running owner task is skipped without consuming the frame cap, and a
rejected or retired owner task clears its in-flight lease so a later tick can
retry it. The same admitted owner task reconciles both projection and surface
skin state when both are active. A non-fluid skin writes every ordered display
spawn and metadata pair into one observer-local portal batch and flushes once.
Partial batches are destroyed before retry so failed sends cannot leave client
ghost panes.

Budget fitting shortens lateral padding first. Depth is reduced only if the
aperture-aligned scan still exceeds the cell ceiling. An aperture that cannot
fit even at zero depth stays empty rather than exceeding the ceiling.

Interested portals are resolved front to back for each observer. When one
nearer rectangular aperture provably covers every corner of a farther portal,
the farther projector and its block and entity claims are retired until any
part of its aperture becomes visible again. Partial overlaps and irregular
nearer apertures fail open so exposed edges and gaps retain their projections.

## Blackout background

| Setting | Default | Notes |
|---------|---------|-------|
| `blackoutBackground` | `false` | Per-portal. Builds a colored display shell around the far, top, bottom, and side boundaries of the sampled view. |
| `blackoutColor` | `BLACK` | One of 16 concrete colors: `WHITE`, `ORANGE`, `MAGENTA`, `LIGHT_BLUE`, `YELLOW`, `LIME`, `PINK`, `GRAY`, `LIGHT_GRAY`, `CYAN`, `PURPLE`, `BLUE`, `BROWN`, `GREEN`, `RED`, `BLACK`. |

Each color maps to `minecraft:<name>_concrete` (for example `BLACK` → black
concrete). The mesh closes transparent cells on the far cap and four lateral
boundaries while leaving the portal-facing side open. Opaque projected blocks
remain authoritative, so the shell does not replace real destination surfaces.
Its thin panels sit inside the sampled boundary cells to avoid depth fighting.
When observer movement changes or remeshes the shell, existing client entity
IDs are teleported and resized in place before obsolete panes are retired. If
its display packets cannot be maintained, the normal projection stays visible
without the shell.

## Entity spoofing (`[render]`)

| Key | Default | Clamp | Role |
|-----|---------|-------|------|
| `entity-spoofing` | `true` | Boolean | Show destination-side entities in projections. |
| `entity-spoof-range` | `48.0` | 1–256 | Range for spoofed entities. |
| `entity-update-interval-ticks` | `1` | 1–20 | Entity refresh cadence. |
| `entity-candidate-cache-ticks` | `3` | 1–40 | Candidate cache lifetime. |
| `max-spoofed-entities` | `24` | 0–256 | Hard cap of spoofed entities per context. |
| `capture-zone-radius` | `8.0` | 1–64 | Capture zone radius used by render capture logic. Applies on reload. |

Venticular applies its accepted opaque-block visibility proofs to projected
entities as well as blocks. Wormholes withholds an item, minecart, name label,
NPC, or Bukkit display entity only when every cell in a conservative visual
envelope is proven hidden; an exposed cell, missing destination data, changed
view revision, or exhausted visibility budget keeps the whole entity visible.
PanOptic intentionally keeps its unoccluded full-volume behavior.

## Visual quality profiles

Top-level `quality` in `wormholes.toml`: `auto`, `performance`, `balanced`, or
`cinematic` (`VisualQualityProfile`). Defaults to `auto`. Profiles apply after
the raw config values.

| Profile | Effect |
|---------|--------|
| `AUTO` | No extra clamps. Raw config values remain. |
| `PERFORMANCE` | Forces `lighting-fidelity` and `entity-spoofing` off. `range` ≤ 32. `depth-blocks` ≤ 48. `max-projectors-per-tick` ≤ 12. `max-portals-per-observer-tick` ≤ 2. `max-new-observer-scans-per-tick` ≤ 32. |
| `BALANCED` | `lighting-refresh-interval-ticks` ≥ 6. `entity-update-interval-ticks` ≥ 2. `max-spoofed-entities` ≤ 16. `max-projectors-per-tick` ≤ 20. `max-new-observer-scans-per-tick` ≤ 64. |
| `CINEMATIC` | `range` ≥ 64. `depth-blocks` ≥ 96. `max-projectors-per-tick` ≥ 32. `max-new-observer-scans-per-tick` ≥ 128. `lighting-refresh-interval-ticks` ≤ 2. `lighting-max-sections-per-pass` ≥ 4. `entity-spoof-range` ≥ 64. `max-spoofed-entities` ≥ 48. |

## Global `[projection]` keys (ProjectionConfig defaults)

| Key | Default | Notes |
|-----|---------|-------|
| `range` | `48.0` | Global projection / effective activation range when per-portal range is `0`. Clamped 1–256 on load. |
| `refresh-interval-ticks` | `1` | Block projection refresh interval. |
| `near-plane-padding` | `2.0` | Near-plane padding. |
| `aperture-padding-blocks` | `0.75` | How far the projected image extends past aperture edges. |
| `frustum-culling-ratio` | `0.2` | Frustum cull ratio. |
| `occlusion-reveal-margin-degrees` | `1.0` | Hot-reloadable Venticular guard angle. Higher values reveal blocks and entities earlier around occluder edges to absorb observer movement and packet latency, at the cost of retaining more geometry. Clamped 0–15; `0` uses exact silhouettes. |
| `depth-blocks` | `64` | Search distance used to find recursive portal candidates beyond the current view, not the primary portal's block depth. |
| `recursive-portal-depth` | `3` | Recursive portal depth (minimum clamp 3). |
| `stable-cell-resample-interval-ticks` | `4` | Stable-cell resample interval. |
| `client-view-distance-cap` | `true` | Cap scans to client view distance. |
| `foveated-unrendering` | `false` | Look/side interest filter (`observer-interest-dot` and `side-grace-dot`). |
| `observer-interest-dot` | `-0.2` | Look-at-portal threshold when foveated. |
| `side-grace-dot` | `0.12` | Minimum absolute side-of-portal normal dot when foveated. |
| `max-projectors-per-tick` | `24` | See budgets. |
| `max-portals-per-observer-tick` | `4` | See budgets. |
| `max-new-observer-scans-per-tick` | `64` | See budgets. |
| `interest-grace-ticks` | `5` | Interest grace after losing live interest. |
| `initial-resend-passes` | `1` | Full startup projection sends after a view is created. |
| `max-projected-cells` | `250000` | See budgets. |

## Global `[render]` keys (RenderConfig defaults)

| Key | Default | Notes |
|-----|---------|-------|
| `lighting-fidelity` | `false` | Send destination lighting with projected blocks. |
| `entity-spoofing` | `true` | See entity spoofing. |
| `lighting-refresh-interval-ticks` | `4` | Lighting refresh cadence. |
| `lighting-max-sections-per-pass` | `2` | Lighting sections per pass. |
| `adaptive-lighting` | `true` | Adaptive lighting behavior. |
| `entity-update-interval-ticks` | `1` | Entity update cadence. |
| `entity-spoof-range` | `48.0` | Entity spoof range. |
| `entity-candidate-cache-ticks` | `3` | Candidate cache ticks. |
| `max-spoofed-entities` | `24` | Entity cap. |
| `capture-zone-radius` | `8.0` | Capture zone radius. Applies on reload. |

## Per-portal activation range

| Field | Default | Behavior |
|-------|---------|----------|
| `activationRange` | `0` | `0` means use global `Settings.PROJECTION_RANGE` (from `[projection].range`, default **48** after load). Positive values are clamped to **8–256** blocks. |

Effective range drives the view AABB. The portal menu shows “global (N)” when
unset, or the explicit block value when set. Menu steps: ±8, shift ±32.
Dropping below 8 clears back to global (`0`).

## Primary, recursive, and remote views

The primary block and entity depth comes from the portal's `networkViewDepth`
setting (default 64), including settings replicated from the linked gateway.
The global `depth-blocks` value extends the search bound for recursive portal
candidates. `recursive-portal-depth` limits how many nested portal steps may be
sampled. Recursive sampling follows portals that are open and projecting. It
masks cycles and non-traversable hits, and it does not turn a closed or
unlinked portal into a view.

Local tunnels sample the destination world directly. Cross-server gateways use
the replicated remote block and entity stream. Cells not yet present in that
stream use the portal's configured `networkViewFallbackBlock` (air by default).
Remote subscriptions, heartbeat, grace, and compression are in
[10 - Cross-Server Networking](/wormholes/10-cross-server-networking).

## Surface and entity rendering

A configured surface skin is rendered even when the portal itself is closed or
projection is off. Water and lava use client block claims. Other skins use
client-side display panes. Opaque skins suppress through-projection.
Transparent skins can remain in front of it.

Plugin shutdown sends display teardown and fluid-claim release on each online
observer's entity owner before render state is cleared. At most the configured
observer reconciliation budget is in flight during that bounded drain; states
whose owner scheduler cannot complete before the shutdown deadline are retained
instead of being cleared off-owner.

Entity projection covers players, living entities, and supported non-living
entities. It carries position, pose, velocity, metadata, equipment, passengers,
leash relationships, animations, hurt state, item-frame contents, and map data
where the platform packet bridge supports them. Candidate range, refresh
cadence, and the hard entity cap come from `[render]`. Local entities on the
observer side may be hidden while their projected counterparts occupy the view.
For overlapping portals, Wormholes unions those local-hide claims per observer;
an entity is restored only after the last portal stops occluding it. Local-hide
discovery covers the full fitted projection depth independently of the shorter
destination entity-spoof range, and claims only entities whose complete
name/display-aware envelope is contained by the portal frustum. Partially
exposed entities remain visible.

## Arrival warmer vs chunk pre-send

These are separate systems:

| System | Config keys (`[main]`) | Default | Behavior |
|--------|------------------------|---------|----------|
| **Arrival warmer** | `arrival-prewarm-on-interest`, `arrival-warm-radius-chunks`, `arrival-warm-max-radius-chunks`, `arrival-warm-hold-millis`, `arrival-warm-throttle-millis` | prewarm **true**. Radius **4**. Max radius **10**. Hold **5000** ms. Throttle **1000** ms | When an observer is live-interested in a linked local destination, holds destination chunks via chunk leases so arrival geometry is warmer. Also used for imminent warm with view-distance-aware radius. |
| **Chunk pre-send** | `chunk-pre-send-enabled`, `chunk-pre-send-radius-chunks`, `chunk-pre-send-max-chunks`, `chunk-pre-send-budget-micros` | **enabled false**. Radius **3**. Max **32**. Budget **2000** µs | Immediately before a local, RTP, or dimensional-door player teleport, sends already-loaded destination chunks from the destination-owned task within a microsecond budget, then initiates movement on the traveler entity owner. It does not load chunks. A rejected traveler dispatch restores the source view and refunds traversal cost through owner-safe recovery; if the source scheduler has retired, Wormholes consumes the transaction instead of running rollback off-owner. Cross-server transfer skips it. |

Related transition mask: `arrival-transition-mask` default **true**,
`arrival-transition-mask-ticks` default **25**. Chunk send rate tuner
(`chunk-send-rate-tuner`, targets) is a separate startup raise of Paper chunk
send/load rates. It is not projection rendering.
`chunk-send-rate-target` / `chunk-load-rate-target` of `<=0` or `>10000` is
unlimited.

## Operator controls

| Command | Permission | Effect |
|---------|------------|--------|
| `/wh admin freeze [seconds]` | `wormholes.admin.projection` | Freeze all projections for 5–300 s (default 30). `0` resumes. |
| `/wh admin flush` | `wormholes.admin.projection` | Revert every observer’s projected blocks to ground truth and rebuild. |

See [09 - Commands & Permissions](/wormholes/09-commands-permissions) and
[14 - Operator Runbooks & Smoke Tests](/wormholes/14-operator-runbooks-smoke-tests).

## Behavior notes

- Config and static default projection `range` are **48**.
- Per-portal `activationRange` default **0** means “use global,” not zero
  blocks.
- Default render mode is **VENTICULAR** (buried culling + observer occlusion),
  not PANOPTIC.
- Default blackout is **off** with color **BLACK** if enabled later.
- `foveated-unrendering` defaults **false**. Interest is then purely
  view-AABB based.
- `chunk-pre-send-enabled` defaults **false**. Arrival prewarm on interest
  defaults **true**. Pre-send also skips when the packet bridge is unsupported,
  the player is offline, the destination region is not owned, or the destination
  centre chunk is not loaded.
- Quality profile `performance` forces `[render] entity-spoofing` and
  `lighting-fidelity` off in addition to its numeric clamps.
- `max-projected-cells = 0` disables the cell ceiling and can make a single
  pass extremely expensive.
