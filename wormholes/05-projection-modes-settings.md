---
title: "Projection Modes & Settings"
description: "Wormholes documentation: Projection Modes & Settings"
published: true
date: 2026-08-12T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Through-portal projection sends destination or mirror block data and optional entity packets to an observer near a portal so the other side appears without crossing. Looking toward the aperture is required only when foveated unrendering is enabled; by default, the portal's view AABB determines interest. Per-portal mode and render mode combine with global `[projection]` and `[render]` keys in `plugins/Wormholes/config/wormholes.toml` (schema 2).

## What projection does for a viewer

When projection is active for a portal and an online player is inside that portal’s view AABB, `ProjectionManager` builds a per-observer `PortalProjector` that samples destination (or mirror) geometry and spoofs client blocks through the aperture. Entity spoofing (when enabled) injects destination-side entities into the projected view within configured ranges and caps. Projection does not move the player; traversal is a separate tunnel path.

## ProjectionMode (ON / OFF)

| Value | Meaning |
|-------|---------|
| `ON` | Portal may project for interested observers (default for new portals). |
| `OFF` | Projection is disabled for that portal. |

Toggled from the portal home menu. Stored on the portal as `projectionMode`. Legacy mirror-style fields still resolve to ON/OFF via `LocalPortalSettings.resolveProjectionMode`.

## ProjectionRenderMode

Default for new portals: **VENTICULAR**.

| Mode | Display | Buried cell culling | Observer occlusion | Notes |
|------|---------|---------------------|--------------------|-------|
| `VENTICULAR` | Venticular | Yes | Yes | Default. Drops buried cells and applies observer occlusion during cell scan. |
| `PANOPTIC` | PanOptic | No | No | Fuller capture of the destination volume; more cells and cost. |

Stored as `renderMode` on the portal JSON. Toggled from the portal settings menu.

## Interest and view AABB

**View AABB.** Each portal’s view volume is the portal structure area expanded by the effective activation range on every axis (`LocalPortalGate.computeView`). An observer must have their location inside that AABB to be considered for that portal.

**Live interest.** When `foveated-unrendering` is false (default), any observer inside the view AABB is interested. When true, interest also requires:

- stable portal-side facing with absolute normal dot ≥ `side-grace-dot` (default `0.12`);
- look direction toward the portal center with direction dot ≥ `observer-interest-dot` (default `-0.2`).

**Grace.** After live interest is established, `interest-grace-ticks` (default `5`) keeps the projector open for that many projection ticks after interest is lost, so brief head turns do not tear down the view immediately. Grace only applies if a projector already exists for that portal/observer pair.

## Budgets

Global per-tick budgets (from `[projection]`, refreshed into `Settings`):

| Key | Default | Clamp | Role |
|-----|---------|-------|------|
| `max-projectors-per-tick` | `24` | 1–512 | Total block-update projector slots per tick across all observers. |
| `max-portals-per-observer-tick` | `4` | 1–64 | Cap on portals one observer may block-update in one frame. |
| `max-new-observer-scans-per-tick` | `64` | 1–4096 | How many players may be scanned as new/continuing observers per tick. |
| `max-projected-cells` | `250000` | 0–50000000 | Hard ceiling on candidate block positions scanned for one portal pass. `0` disables the ceiling (not recommended). |

Budget fitting shortens lateral padding first; depth is reduced only if the aperture-aligned scan still exceeds the cell ceiling. An aperture that cannot fit even at zero depth stays empty rather than exceeding the ceiling.

## Blackout background

| Setting | Default | Notes |
|---------|---------|-------|
| `blackoutBackground` | `false` | Per-portal; builds a colored far-slice display seal behind the sampled view. |
| `blackoutColor` | `BLACK` | One of 16 concrete colors: `WHITE`, `ORANGE`, `MAGENTA`, `LIGHT_BLUE`, `YELLOW`, `LIME`, `PINK`, `GRAY`, `LIGHT_GRAY`, `CYAN`, `PURPLE`, `BLUE`, `BROWN`, `GREEN`, `RED`, `BLACK`. |

Each color maps to `minecraft:<name>_concrete` (for example `BLACK` → black concrete). The mesh is built from the farthest valid projected slice and fails open: if its display packets cannot be maintained, the normal projection remains visible without the seal.

## Entity spoofing (`[render]`)

| Key | Default | Clamp | Role |
|-----|---------|-------|------|
| `entity-spoofing` | `true` | — | Show destination-side entities in projections. |
| `entity-spoof-range` | `48.0` | 1–256 | Range for spoofed entities. |
| `entity-update-interval-ticks` | `1` | 1–20 | Entity refresh cadence. |
| `entity-candidate-cache-ticks` | `3` | 1–40 | Candidate cache lifetime. |
| `max-spoofed-entities` | `24` | 0–256 | Hard cap of spoofed entities per context. |
| `capture-zone-radius` | `8.0` | 1–64 | Capture zone radius used by render capture logic. Applies on reload. |

## Visual quality profiles

Top-level `quality` in `wormholes.toml`: `auto`, `performance`, `balanced`, or `cinematic` (`VisualQualityProfile`). Defaults to `auto`. Profiles apply after the raw config values.

| Profile | Effect |
|---------|--------|
| `AUTO` | No extra clamps; raw config values remain. |
| `PERFORMANCE` | Forces `lighting-fidelity` and `entity-spoofing` off; `range` ≤ 32; `depth-blocks` ≤ 48; `max-projectors-per-tick` ≤ 12; `max-portals-per-observer-tick` ≤ 2; `max-new-observer-scans-per-tick` ≤ 32. |
| `BALANCED` | `lighting-refresh-interval-ticks` ≥ 6; `entity-update-interval-ticks` ≥ 2; `max-spoofed-entities` ≤ 16; `max-projectors-per-tick` ≤ 20; `max-new-observer-scans-per-tick` ≤ 64. |
| `CINEMATIC` | `range` ≥ 64; `depth-blocks` ≥ 96; `max-projectors-per-tick` ≥ 32; `max-new-observer-scans-per-tick` ≥ 128; `lighting-refresh-interval-ticks` ≤ 2; `lighting-max-sections-per-pass` ≥ 4; `entity-spoof-range` ≥ 64; `max-spoofed-entities` ≥ 48. |

## Global `[projection]` keys (ProjectionConfig defaults)

| Key | Default | Notes |
|-----|---------|-------|
| `range` | `48.0` | Global projection / effective activation range when per-portal range is `0`. Clamped 1–256 on load. |
| `refresh-interval-ticks` | `1` | Block projection refresh interval. |
| `near-plane-padding` | `2.0` | Near-plane padding. |
| `aperture-padding-blocks` | `0.75` | How far the projected image extends past aperture edges. |
| `frustum-culling-ratio` | `0.2` | Frustum cull ratio. |
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

Effective range drives the view AABB and is exposed in the portal menu as “global (N)” when unset, or the explicit block value when set. Menu steps: ±8, shift ±32; dropping below 8 clears back to global (`0`).

## Primary, recursive, and remote views

The primary block and entity depth comes from the portal's `networkViewDepth` setting (default 64), including settings replicated from the linked gateway. The global `depth-blocks` value extends the search bound for recursive portal candidates; `recursive-portal-depth` limits how many nested portal steps may be sampled. Recursive sampling follows portals that are open and projecting, masks cycles and non-traversable hits, and does not turn a closed or unlinked portal into a view.

Local tunnels sample the destination world directly. Cross-server gateways use the replicated remote block and entity stream; cells not yet present in that stream use the portal's configured `networkViewFallbackBlock` (air by default). Remote subscriptions, heartbeat, grace, and compression are described in [10 - Cross-Server Networking](/wormholes/10-cross-server-networking).

## Surface and entity rendering

A configured surface skin is rendered even when the portal itself is closed or projection is off. Water and lava use client block claims; other skins use client-side display panes. Opaque skins suppress through-projection, while transparent skins can remain in front of it.

Entity projection covers players, living entities, and supported non-living entities. It carries position, pose, velocity, metadata, equipment, passengers, leash relationships, animations, hurt state, item-frame contents, and map data where the platform packet bridge supports them. Candidate range, refresh cadence, and the hard entity cap come from `[render]`; local entities on the observer side may be hidden while their projected counterparts occupy the view.

## Arrival warmer vs chunk pre-send

These are separate systems:

| System | Config keys (`[main]`) | Default | Behavior |
|--------|------------------------|---------|----------|
| **Arrival warmer** | `arrival-prewarm-on-interest`, `arrival-warm-radius-chunks`, `arrival-warm-max-radius-chunks`, `arrival-warm-hold-millis`, `arrival-warm-throttle-millis` | prewarm **true**; radius **4**; max radius **10**; hold **5000** ms; throttle **1000** ms | When an observer is live-interested in a linked local destination, holds destination chunks via chunk leases so arrival geometry is warmer. Also used for imminent warm with view-distance-aware radius. |
| **Chunk pre-send** | `chunk-pre-send-enabled`, `chunk-pre-send-radius-chunks`, `chunk-pre-send-max-chunks`, `chunk-pre-send-budget-micros` | **enabled false**; radius **3**; max **32**; budget **2000** µs | At traversal commit, optionally pre-sends destination chunks to the traveler within a microsecond budget. Off by default until verified on a live server. |

Related transition mask: `arrival-transition-mask` default **true**, `arrival-transition-mask-ticks` default **25**. Chunk send rate tuner (`chunk-send-rate-tuner`, targets) is a separate startup raise of Paper chunk send/load rates; it is not projection rendering. `chunk-send-rate-target` / `chunk-load-rate-target` of `<=0` or `>10000` is unlimited.

## Operator controls

| Command | Permission | Effect |
|---------|------------|--------|
| `/wh admin freeze [seconds]` | `wormholes.admin.projection` | Freeze all projections for 5–300 s (default 30). `0` resumes. |
| `/wh admin flush` | `wormholes.admin.projection` | Revert every observer’s projected blocks to ground truth and rebuild. |

See [09 - Commands & Permissions](/wormholes/09-commands-permissions) and [14 - Operator Runbooks & Smoke Tests](/wormholes/14-operator-runbooks-smoke-tests).

## Behavior notes

- Config and static default projection `range` are **48**.
- Per-portal `activationRange` default **0** deliberately means “use global,” not zero blocks.
- Default render mode is **VENTICULAR** (buried culling + observer occlusion), not PANOPTIC.
- Default blackout is **off** with color **BLACK** if enabled later.
- `foveated-unrendering` defaults **false**; interest is then purely view-AABB based.
- `chunk-pre-send-enabled` defaults **false**; arrival prewarm on interest defaults **true**.
- Quality profile `performance` forces `[render] entity-spoofing` and `lighting-fidelity` off in addition to its numeric clamps.
- `max-projected-cells = 0` disables the cell ceiling and can make a single pass extremely expensive.
