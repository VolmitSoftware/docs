---
title: "Projection Modes and Settings"
description: "Projection ON/OFF, PanOptic vs Venticular, budgets, render, and ClientView"
published: true
date: 2026-10-07T11:54:34.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Through-portal projection changes what one player's client sees inside a portal
aperture. It can show destination blocks, supported entities, and optional
lighting without moving the player. Traversal is a separate system.

Per-portal mode and render mode combine with global `[projection]` and
`[render]` keys in `wormholes.toml` (schema 3), under `plugins/Wormholes/` on Bukkit or `config/wormholes/` on native loaders.

Projection is one player's client view through the aperture. It does not move blocks or players. A destination change retires the current view. Player reflections use the skin the server has, and a local mirror refreshes when that skin changes.

Players running the Wormholes client mod can receive [ClientView](#clientview) instead, where their client computes the projection from its own camera.

## ProjectionMode (ON / OFF)

<div class="wormholes-demo" data-demo="projection-toggle">
<p><strong>Projection on and off</strong> Toggle standard projection; native client views remain active.</p>
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="/wormholes-assets/demos/projection-toggle-standard-pov.webm" aria-label="No client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Client mod</p>
<video src="/wormholes-assets/demos/projection-toggle-clientview-pov.webm" aria-label="Client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
</div>

| Value | Meaning |
|-------|---------|
| `ON` | Portal may project for interested observers (default for new portals). |
| `OFF` | Projection is disabled for that portal. |

Toggle this from the portal home menu.

## ProjectionRenderMode

<div class="wormholes-demo" data-demo="render-panoptic">
<p><strong>PanOptic: full volume</strong> Standard projection is frozen for the rear comparison. ClientView remains clipped to the aperture and does not expose the block volume.</p>
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="/wormholes-assets/demos/render-panoptic-standard-pov.webm" aria-label="No client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/wormholes-assets/demos/render-panoptic-standard-observer.webm" aria-label="No client mod, third person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Client mod</p>
<video src="/wormholes-assets/demos/render-panoptic-clientview-pov.webm" aria-label="Client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/wormholes-assets/demos/render-panoptic-clientview-observer.webm" aria-label="Client mod, third person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
</div>

<div class="wormholes-demo" data-demo="render-venticular">
<p><strong>Venticular: culled surfaces</strong> Standard projection is frozen for the rear comparison. ClientView remains clipped to the aperture and does not expose the block volume.</p>
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="/wormholes-assets/demos/render-venticular-standard-pov.webm" aria-label="No client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/wormholes-assets/demos/render-venticular-standard-observer.webm" aria-label="No client mod, third person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Client mod</p>
<video src="/wormholes-assets/demos/render-venticular-clientview-pov.webm" aria-label="Client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/wormholes-assets/demos/render-venticular-clientview-observer.webm" aria-label="Client mod, third person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
</div>

Default for new portals: **VENTICULAR**.

| Mode | Display | Buried cell culling | Observer occlusion | Notes |
|------|---------|---------------------|--------------------|-------|
| `VENTICULAR` | Venticular | Yes | Yes | Default. Removes buried solids and destination cells hidden from the observer. |
| `PANOPTIC` | PanOptic | No | No | Fuller capture of the destination volume. More cells and cost. |

Stored as `renderMode` on the portal JSON. Toggled from the portal settings
menu.

`occlusion-reveal-margin-degrees` sets how early Venticular reveals geometry around edges.

To inspect the difference, view a destination with hills or overlapping structures, then run `/wh admin freeze seconds=120`. Standard projection retains the blocks already shown to that viewer while the camera moves around to inspect their rear. PanOptic retains the fuller projected volume; Venticular omits geometry hidden from the original viewing position. Run `/wh admin freeze seconds=0` to resume updates. Freezing pauses server projection updates for all viewers; ClientView continues rendering from the moving local camera and clipping the view to the aperture, so it does not become a frozen volume of local blocks.

## Held cells

With `hold-invisible-claims = true` (default), a projected cell the observer can no longer see stays on the client instead of reverting. This covers cells that leave the projection cone behind a local wall and cells that become hidden behind nearer destination blocks. Held cells cost no packets. They revert to the real blocks when the portal closes, the local wall changes, the destination or RTP route changes, another portal's projection displaces the cells in front of them, or the observer crosses the portal plane.

`max-held-cells-per-portal` (default `65536`) caps held cells per portal and observer; the oldest revert first. `0` disables holding. Held cells apply on Bukkit and native loaders.

## Interest and view AABB

The view AABB is the portal area expanded by its activation range. A player must be inside it to receive a projection.

When `foveated-unrendering` is false, everyone inside the view AABB is interested. When true, the player must also meet these checks:

- stable portal-side facing with absolute normal dot ≥ `side-grace-dot`
  (default `0.12`)
- look direction toward the portal center with direction dot ≥
  `observer-interest-dot` (default `-0.2`)

`interest-grace-ticks` keeps an existing view open briefly after interest is lost.

## Budgets

Budgets from `[projection]`:

| Key | Default | Clamp | Role |
|-----|---------|-------|------|
| `max-projectors-per-tick` | `24` | 1–512 | Total block-update projector slots per tick across all observers. |
| `max-portals-per-observer-tick` | `4` | 1–64 | Cap on portals one observer may block-update in one frame. |
| `max-frame-micros` | `30000` | 0–1000000 | Soft rendering time budget per execution thread and manager tick, including observer-frame claim flushing. `0` disables the time limit. |
| `max-new-observer-scans-per-tick` | `64` | 1–4096 | Shared cap on player-owner reconciliation frames per tick across normal projection and surface skins. |
| `max-projected-cells` | `250000` | 0–50000000 | Candidate block positions scanned for one portal pass. `0` disables the ceiling. |

If a view exceeds `max-projected-cells`, Wormholes reduces side padding first and then depth. A view that still cannot fit remains empty. A nearer portal can temporarily hide a fully covered portal behind it.

A geometry scan that runs out of time resumes on a later tick. Under load, that view's block updates arrive less often. With `finish-in-slot = true` (default), a scan that completes while frame budget remains also filters occlusion and sends its blocks in the same tick.

### Gaze priority

Each observer's portals are ranked by where the player looks before they take block-update slots.

| Portal position | Refresh |
|-----------------|---------|
| Inside `gaze-fov-degrees` (default `110`), or entering it within `gaze-lookahead-ticks` (default `3`) at the current turn speed | Every block tick while the observer changes position, budget permitting. Larger on-screen portals go first |
| In view, observer standing where the portal was last scanned | Less often |
| Up to 35 degrees outside the view | Less often |
| Behind the camera | Keeps its current image |

A portal that has gone `gaze-max-starve-ticks` (default `20`) without a refresh refreshes next, wherever the observer looks. Closing views take priority, and unfinished scans stay eligible wherever the observer looks.

### Tick headroom governor

`tick-headroom-target-millis` (default `0`, off) sets how much server tick time, in milliseconds, projection work tries to leave free. While it is off, `max-frame-micros` alone limits projection work each tick. When it is set above `0` on Paper or Purpur, the per-tick projection budget shrinks while the previous tick left less free time than the target and grows back toward `max-frame-micros` while it left more. `tick-headroom-min-frame-micros` (default `5000`) is the smallest budget it may shrink to. The governor stays off on Folia, Fabric, Forge, and NeoForge, and when `max-frame-micros` is `0`. A chunk load triggered by a projection pass cannot be interrupted, so a single tick can still exceed the budget.

## Blackout background

| Setting | Default | Notes |
|---------|---------|-------|
| `blackoutBackground` | `false` | Per-portal. Seals transparent cells at the far boundary; side, top, and bottom blocks stay outside the visible portal opening. |
| `blackoutColor` | `BLACK` | One of 16 concrete colors: `WHITE`, `ORANGE`, `MAGENTA`, `LIGHT_BLUE`, `YELLOW`, `LIME`, `PINK`, `GRAY`, `LIGHT_GRAY`, `CYAN`, `PURPLE`, `BLUE`, `BROWN`, `GREEN`, `RED`, `BLACK`. |

Each color maps to the matching concrete block. Shell cells are ordinary projected blocks: they arrive with the block updates of the same pass, work for Bedrock viewers, and are resampled as soon as a cell stops being part of the boundary. Opaque destination blocks on the boundary are never replaced. In `full` atmosphere mode with `[atmosphere] fog-plate = true`, the shell uses the destination dimension's fog block instead of the concrete color.

Side, top, and bottom shell blocks use the padded outer edge of the projection. A block is omitted if any part of its projected footprint overlaps the opening from the current viewing position. Clearance follows portal size and viewing angle without a fixed two-block cutoff. Irregular portals conservatively protect the full opening bounds. Tight render limits, zero aperture padding, or steep viewing angles can leave local scenery visible around the sides; the far background remains sealed.

## Entity spoofing (`[render]`)

| Key | Default | Clamp | Role |
|-----|---------|-------|------|
| `entity-spoofing` | `true` | Boolean | Show destination-side entities in projections. |
| `entity-spoof-range` | `48.0` | 1–256 | Range for spoofed entities. |
| `entity-update-interval-ticks` | `1` | 1–20 | Entity refresh cadence. |
| `entity-candidate-cache-ticks` | `3` | 1–40 | Candidate cache lifetime. |
| `max-spoofed-entities` | `24` | 0–256 | Hard cap of spoofed entities per context. |
| `capture-zone-radius` | `8.0` | 1–64 | Capture zone radius used by render capture logic. Applies on reload. |

Venticular hides a projected entity only when it is fully blocked. PanOptic keeps the full-volume behavior.

## Visual quality profiles

Top-level `quality` in `wormholes.toml`: `auto`, `performance`, `balanced`, or
`cinematic` (`VisualQualityProfile`). Defaults to `auto`. Profiles apply after
the raw config values on Bukkit, Fabric, Forge, and NeoForge. Saving another setting preserves the configured values; switching back to `auto` restores them.

| Profile | Effect |
|---------|--------|
| `AUTO` | No extra clamps. Raw config values remain. |
| `PERFORMANCE` | Forces `lighting-fidelity` and `entity-spoofing` off. `range` ≤ 32. `depth-blocks` ≤ 48. `max-projectors-per-tick` ≤ 12. `max-portals-per-observer-tick` ≤ 2. `max-new-observer-scans-per-tick` ≤ 32. |
| `BALANCED` | `lighting-refresh-interval-ticks` ≥ 6. `entity-update-interval-ticks` ≥ 2. `max-spoofed-entities` ≤ 16. `max-projectors-per-tick` ≤ 20. `max-new-observer-scans-per-tick` ≤ 64. |
| `CINEMATIC` | `range` ≥ 64. `depth-blocks` ≥ 96. `max-projectors-per-tick` ≥ 32. `max-new-observer-scans-per-tick` ≥ 128. `lighting-refresh-interval-ticks` ≤ 2. `lighting-max-sections-per-pass` ≥ 4. `entity-spoof-range` ≥ 64. `max-spoofed-entities` ≥ 48. |

## Global `[projection]` keys

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
| `stable-cell-resample-interval-ticks` | `4` | Ticks between resamples of already-projected cells after a destination block change near the area the view reads. |
| `client-view-distance-cap` | `true` | Cap scans to client view distance. |
| `foveated-unrendering` | `false` | Look/side interest filter (`observer-interest-dot` and `side-grace-dot`). |
| `observer-interest-dot` | `-0.2` | Look-at-portal threshold when foveated. |
| `side-grace-dot` | `0.12` | Minimum absolute side-of-portal normal dot when foveated. |
| `max-projectors-per-tick` | `24` | See budgets. |
| `max-portals-per-observer-tick` | `4` | See budgets. |
| `max-frame-micros` | `30000` | See budgets. |
| `max-new-observer-scans-per-tick` | `64` | See budgets. |
| `interest-grace-ticks` | `5` | Interest grace after losing live interest. |
| `initial-resend-passes` | `1` | Full startup projection sends after a view is created. |
| `max-projected-cells` | `250000` | See budgets. |
| `hold-invisible-claims` | `true` | See held cells. |
| `max-held-cells-per-portal` | `65536` | See held cells. Clamped 0–50000000. |
| `gaze-fov-degrees` | `110.0` | Horizontal field of view whose portals refresh first; the vertical extent follows a 16:9 screen. Clamped 30–170. See gaze priority. |
| `gaze-lookahead-ticks` | `3` | Head-turn prediction window. Clamped 0–20. |
| `gaze-max-starve-ticks` | `20` | Longest a portal goes without a refresh. Clamped 1–200. |
| `finish-in-slot` | `true` | Finish occlusion filtering and send blocks in the tick a scan completes when frame budget remains. |
| `shared-plate` | `true` | Build destination sampling, block-state transforms, and buried-cell culling once per portal and share them between observers. Off samples per observer. |
| `plate-max-bytes` | `33554432` | Memory shared view plates may hold; the oldest plate is evicted first. A plate predicted or measured larger than this limit is not cached and is retried after the portal's projection settings change, the portal is invalidated, the RTP route changes, or settings reload. Clamped 1048576–1073741824. |
| `plate-workers` | `2` | Worker threads that build shared view plates. Clamped 1–16. |
| `rtp-plates` | `true` | Build shared view plates for RTP portals, keyed by destination route. Requires `shared-plate`. Off samples RTP destinations per observer. |
| `plate-lateral-clamp-blocks` | `40` | Widest a shared plate extends past the aperture sideways, capped by the portal's own lateral pad. Cells outside the plate are sampled per observer. Clamped 0–64. |
| `plate-capture-chunks-per-tick` | `8` | Destination chunks copied per tick for plates built off the main thread. Clamped 1–256. |
| `plate-urgent-capture-chunks-per-tick` | `32` | Destination chunks copied per tick for plates a ClientView player is waiting on to show a portal for the first time. Uses its own budget, so it never slows the captures `plate-capture-chunks-per-tick` paces. Clamped 1–256. |
| `section-cache` | `true` | Section cache on Paper, Purpur, and native loaders. See primary, recursive, and remote views. |
| `section-cache-max-mb` | `64` | Section cache memory; the least recently read sections are evicted first. Clamped 1–4096. |
| `section-cache-chunks-per-tick` | `16` | Chunks the section cache may capture per tick. Sections over budget are read from the live world until a later tick captures them. Clamped 1–1024. |
| `section-cache-ttl-ticks` | `200` | Ticks before a cached section is captured again on its next read. Clamped 20–72000. |
| `tick-headroom-target-millis` | `0` | See tick headroom governor. `0` is off. Clamped 0–50. |
| `tick-headroom-min-frame-micros` | `5000` | Governor floor. Clamped 1000–`max-frame-micros`. |

## Global `[render]` keys

| Key | Default | Notes |
|-----|---------|-------|
| `lighting-fidelity` | `false` | Send destination lighting with standard projected blocks. Native ClientView always receives destination block and sky light. |
| `entity-spoofing` | `true` | See entity spoofing. |
| `lighting-refresh-interval-ticks` | `4` | Lighting refresh cadence. |
| `lighting-max-sections-per-pass` | `2` | Lighting sections per pass. |
| `adaptive-lighting` | `true` | Adaptive lighting behavior. |
| `entity-update-interval-ticks` | `1` | Entity update cadence. |
| `entity-spoof-range` | `48.0` | Entity spoof range. |
| `entity-candidate-cache-ticks` | `3` | Candidate cache ticks. |
| `max-spoofed-entities` | `24` | Entity cap. |
| `capture-zone-radius` | `8.0` | Capture zone radius. Applies on reload. |
| `rtp-rim-interval-ticks` | `5` | Ticks between RTP rim particle refreshes while the rim color is unchanged. Color and phase changes refresh at once. Clamped 1–100. |
| `entity-velocity-epsilon` | `0.005` | Smallest per-axis velocity change that sends a projected entity a new velocity packet. Stopping always sends. Clamped 0–1. |
| `ambient-particle-interval-ticks` | `1` | Ticks between `SPARKS` ambient bursts. Each burst is one particle packet carrying the sparks of every skipped tick, so average density is unchanged. Clamped 1–40. |

## Optional destination colors and lighting

<div class="wormholes-demo" data-demo="atmosphere">
<p><strong>Destination atmosphere</strong> Compare atmosphere modes with different destination colors, lighting, and weather.</p>
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="/wormholes-assets/demos/atmosphere-standard-pov.webm" aria-label="No client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Client mod</p>
<video src="/wormholes-assets/demos/atmosphere-clientview-pov.webm" aria-label="Client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
</div>

Standard projection leaves the viewer's biome colors and lighting unchanged by default. `[atmosphere]` defaults to `mode-default = "off"`, `biome-tint = false`, and `sky-light = false`; `[render] lighting-fidelity` also defaults to `false`.

To enable destination biome colors, set `[atmosphere] biome-tint = true` and select `tint`, `tint_light`, or `full` atmosphere mode. To enable destination sky lighting through atmosphere mode, set `sky-light = true` and select `tint_light` or `full`. `[render] lighting-fidelity = true` enables projected lighting independently. Existing explicit settings remain in effect.

Choose the mode for one portal in **Settings → More settings → Fidelity → Atmosphere**. Shift-left-click restores the server's `mode-default`.

| Mode | Atmosphere channels |
|------|---------------------|
| `off` | No atmosphere colors, sky lighting, fog, or weather. Independently enabled projected lighting still applies. |
| `tint` | Destination biome colors when `biome-tint` is enabled. |
| `tint_light` | Biome colors plus destination sky lighting when `sky-light` is enabled. |
| `full` | Adds fog when `fog-plate` is enabled and destination weather when `weather` is enabled. |

Standard projection presents relayed weather within the projected view. For ClientView, full atmosphere can also change the nearby viewer's sky and, for overworld destinations, its time; see [ClientView](/wormholes/05-projection-modes-settings#clientview). The Fidelity menu also controls relayed sounds and block-entity contents, described in [Fidelity menu](/wormholes/04-portal-types-menus-settings#fidelity-menu).

## Per-portal activation range

| Field | Default | Behavior |
|-------|---------|----------|
| `activationRange` | `0` | `0` means use global `Settings.PROJECTION_RANGE` (from `[projection].range`, default **48** after load). Positive values are clamped to **8–256** blocks. |

Effective range drives the view AABB. The portal menu shows “global (N)” when
unset, or the explicit block value when set. Menu steps: ±8, shift ±32.
Dropping below 8 clears back to global (`0`).

## Primary, recursive, and remote views

<div class="wormholes-demo" data-demo="nested-views">
<p><strong>Nested portal views</strong> Look through a second portal at the destination, then cross both portals.</p>
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="/wormholes-assets/demos/nested-views-standard-pov.webm" aria-label="No client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/wormholes-assets/demos/nested-views-standard-observer.webm" aria-label="No client mod, third person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Client mod</p>
<video src="/wormholes-assets/demos/nested-views-clientview-pov.webm" aria-label="Client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/wormholes-assets/demos/nested-views-clientview-observer.webm" aria-label="Client mod, third person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
</div>

For standard projection, primary block and entity
depth comes from the portal's `networkViewDepth` setting (default 64), including
settings replicated from the linked gateway. Dedicated [ClientView](/wormholes/05-projection-modes-settings#clientview)
uses the player's Minecraft render distance, clamped to 2–32 chunks; entity
range and count remain limited by `[render]`.
The global `depth-blocks` value extends the search bound for recursive portal
candidates. `recursive-portal-depth` limits how many nested portal steps may be
sampled. Recursive sampling follows portals that are open and projecting. It
masks cycles and non-traversable hits, and it does not turn a closed or
unlinked portal into a view.

On Paper, Purpur, Fabric, Forge, and NeoForge, local tunnels read destination blocks
from a shared cache of 16×16×16 sections (`section-cache`). On Paper and Purpur, block
changes from players, pistons, explosions, fluids, and growth, and players toggling
doors, trapdoors, fence gates, levers, and buttons, refresh the affected section at
once. Changes that raise no block event, such as redstone power or edits by other
plugins, can appear later. On Fabric, Forge, and NeoForge, every block change the
server sends to players refreshes the affected section at once. Other changes appear
when a cached section is captured again on its first read after `section-cache-ttl-ticks`.
Unloaded destination chunks load asynchronously, and their cells show nothing until
the chunk arrives. With `section-cache = false`, local tunnels sample the destination
world directly. RTP portals share one view plate per destination route (`rtp-plates`).
Folia captures immutable chunk snapshots on the owning region. Active snapshots update entity
motion at a 250 ms cadence and refresh metadata, equipment, and map contents
every 500 ms. Block snapshots are reused until a tracked chunk change or a
60-second safety refresh. Motion captures do not postpone either content
refresh. Each block scan shares local chunk readiness and requests across all
cells in that chunk, then checks them again on the next scan.

Cross-server gateways use
the replicated remote block and entity stream. Cells not yet present in that
stream use the portal's configured `networkViewFallbackBlock` (air by default).
Remote subscriptions, heartbeat, grace, and compression are in
[10 - Cross-Server Networking](/wormholes/10-cross-server-networking).

## Surface and entity rendering

<div class="wormholes-demo" data-demo="live-views" data-observer-label="Destination view">
<p><strong>Live destination views</strong> A player at the destination lures a sheep with wheat while the other watches through the portal.</p>
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="/wormholes-assets/demos/live-views-standard-pov.webm" aria-label="No client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/wormholes-assets/demos/live-views-standard-observer.webm" aria-label="No client mod, destination view demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Client mod</p>
<video src="/wormholes-assets/demos/live-views-clientview-pov.webm" aria-label="Client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/wormholes-assets/demos/live-views-clientview-observer.webm" aria-label="Client mod, destination view demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
</div>

A configured surface skin is rendered even when the portal itself is closed or
projection is off. Water and lava use client block claims. Other skins use
client-side display panes. Opaque skins suppress through-projection.
Transparent skins can remain in front of it.

Entity projection covers players, living entities, and supported non-living
entities, including dropped items and world-backed ItemDisplay, BlockDisplay, and TextDisplay entities. Native ClientView shows their contents, transforms, and billboard orientation even when the destination lies outside locally loaded chunks. Enhanced dropped-item visuals from Gloss use these display entities and retain their configured viewer visibility. Projection carries position, pose, velocity, metadata, equipment, passengers,
leash relationships, animations, hurt state, item-frame contents, and map data
where the platform supports them. Range, refresh cadence, and the entity cap come from `[render]`. Partially exposed entities remain visible. Local entities behind a standard projection are hidden only when their full bounds are covered by the aperture view; gaps and holes in irregular openings keep them visible.

Player reflections and projected living entities show main-hand and off-hand swings and hurt animations on Minecraft 26.1.2, 26.2, and 26.3.

Standard projection also shows entities through nested local portal views. Their position and motion follow each linked frame, and visibility is restricted by the apertures along the view. Nested views share the primary view's entity cap and follow `recursive-portal-depth`.

## ClientView

ClientView gives players with the Wormholes client mod a dedicated portal renderer. Destination blocks use the client's block models and textures in a view clipped to the portal's exact opening, including irregular apertures. Players without the mod keep the standard projection described above. Installation and client settings: [Client mod](/wormholes/01-installation-configuration#client-mod). Server keys: [`[client-view]`](/wormholes/01-installation-configuration#client-view). The F3 connection line shows `Wormholes: Connected` when ClientView is active, `Wormholes: Mismatch` for incompatible protocol or Minecraft versions, and `Wormholes: Disconnected` otherwise.

With an Iris shader pack enabled, ClientView renders each destination with the selected pack, including terrain, entities, sky, lighting, and postprocessing. Destination dimension, time, weather, biome, and eye medium determine the view's appearance. Terrain textures, water, cutout foliage, and held items follow the active pack's rendering and filtering rules, including at angled views through the aperture. Depth-based shader effects use the current view after portal preparation, crossing, and window resizing. Geometry in front of the destination aperture is clipped from the view. Linked views and mirror reflections keep their own shader histories. Primary shader views use the full framebuffer resolution. Nested views use smaller captures while retaining their reflection levels. The 1.5 GiB budget applies to cached inactive views; active portals can exceed it. Shader views prepare on demand across successive frames, including their postprocessing and shadows. A new view appears once its shader pipeline is ready. On connection and reconnection, terrain prepares during shader compilation, and the first visible capture uses the selected shader pack. Reopening a cached view resumes unfinished shader preparation or reuses its ready pipeline. Destination terrain arrives progressively as sections become available. Available sections use the shader pack’s normal atmospheric fog without an additional chunk fade. Portals have no fixed root-count limit; additional views prepare as needed. Distant Horizons continues to render distant terrain around the observer; portal terrain follows the portal's configured view depth.

### Travel with the client mod

On Fabric, Forge, and NeoForge servers and in singleplayer, a player with the client mod crosses frame portals and dimensional doors without a teleport, respawn, or loading screen. While the player is near an open portal, the server streams the destination's terrain and entities to the client ahead of time, and the client keeps that destination loaded beside the current world within `resident-level-memory-mb`. The client predicts the crossing as the player passes through the opening and the server confirms it. Movement, view direction, and momentum continue through the linked frames, and the view back through the portal is already present on arrival. Same-world and cross-dimension destinations both cross this way. The crossing must pass through the opening from the front. Travel direction, access, costs, the teleport cooldown, and the destination chosen by Nexus routing or the traversal API apply exactly as for a crossing the server detects itself; a rejected crossing returns the player to the source side. Riding, carrying a passenger, random teleport portals, gateways to other servers, and non-player entities use the ordinary transition. `[client-view] seamless-travel = false` turns this off and keeps the prepared arrival described next. `remote-view-routes`, `remote-view-chunks-per-tick`, and `remote-view-bytes-per-tick` limit how many destinations stream ahead for each player and how fast; see [`[client-view]`](/wormholes/01-installation-configuration#client-view).

On Paper, Purpur, and Folia, the client mod prepares the arrival instead. Within the portal's activation range the client loads and renders the destination's arrival area ahead of the crossing, following the server-limited render distance up to 15 chunks plus a neighboring chunk border. A ready crossing carries movement, view direction, and momentum through the linked frames without a loading screen, Wormholes travel sound, or darkness mask; the server still teleports the player and remains authoritative for permissions, costs, and safety checks. Unready or unsupported arrivals and cross-server transfers use the normal transition. Managed Nether portal openings suppress the vanilla purple overlay and distortion; ordinary Nether portals keep their effects. Loaded chunks near the source portal remain available for return trips within the same connection, and with Sodium and Iris the compatible terrain renderers and shader pipelines are kept across them. Shader or resource changes invalidate retained rendering.

With Iris Shaders enabled on either kind of server, destination terrain, sky, held-item rendering, postprocessing, and shader views for both directions prepare while the route is active; world login does not prepare portal destinations. Nearby arrival terrain stays visible while any remaining terrain finishes loading.

For a ClientView player:

- The view follows the camera every frame. Its target depth follows the player's Minecraft render distance, clamped to 2–32 chunks, independently of the portal's standard projection depth and lateral plate limit.
- Visible destination sections arrive progressively across the full requested distance. Nearby sections arrive first, including a neighborhood around the aperture. Changing the viewing angle or side retains unchanged destination sections while newly visible sections load. During the same connection, retained destination contents can also be reused when revisiting a dimension. Both server and client must support cached-content reuse to avoid downloading retained sections again. Cached contents may appear immediately while the server validates them; changed contents replace them. When a view reaches its section limit, incoming server sections can displace temporary previews while confirmed destination sections remain available. Changes to nearby downloaded sections take priority while new and more distant sections continue loading. The client retains them within `max-plate-memory-mb`, shared across attended portals. Sections that have not arrived remain unavailable; validated unchanged section contents are not downloaded again while retained. Overlapping views reuse unchanged destination snapshots; block, lighting, biome, and block-entity changes refresh the affected contents, including changes received while another dimension is active.
- The renderer clips models at the aperture without replacing blocks in the local world. Blocks intersecting the portal plane retain the visible part of their model. Frame rotations turn destination models, fluids, entities, and block entities in three dimensions, including sideways slabs and stairs. Standard projection budgets, held cells, `max-projected-cells`, and Venticular buried-block omission do not limit the dedicated destination mesh.
- Destination entities arrive through `entity-frames`, with range and cap from `[render]`. Dropped items interpolate their destination motion, and living entities retain independent body and head rotation. Living copies advance their animations once per client tick, including when destination chunks are not locally loaded. Main-hand and off-hand swings and hurt animations follow destination events; mirror reflections follow the player’s eating, blocking, charging, hurt, and death poses and return to idle after a swing. In linked views of the player’s current world, their own projected body uses their current local skin and pose. Other players retain their destination appearance and motion. Projected copies are visual and do not collide with or push local players, including player copies from multiple open views. Entity visibility follows each portal’s viewpoint, while shader shadows use their own light-facing view. Partially visible models, extended display bounds, leashes, names, scores, and glowing outlines remain supported; the configured projection range is unchanged. Native portal sections include destination block light, sky light, and biome colors, including biome-tinted foliage. These use the destination even when standard projection lighting options are disabled; local world lighting remains unchanged.
- The portal view uses the destination dimension's sky, time, weather, fog, clouds, and lighting, sampled from the saved destination biome at the mapped camera position. Rotated portals and mirrors transform the clouds with the destination view. This does not require replacing the viewer's local sky. Portal animations, particles, RTP rims, and relayed destination sounds play on the client. Visual effects suspend while the game is paused or unfocused and resume without replaying accumulated bursts. Portal effect displays and wand previews are temporary and are not saved with the world. In `full` atmosphere mode with `[atmosphere] weather = true`, nearby local-sky takeover remains controlled separately by `atmosphere-dominance-blocks`; set it to `0` to keep the local sky.

Native mode retains native rendering when a destination capture, memory allocation, or render attempt fails. The affected view retries without switching to projected world blocks; other views remain active. Increasing render distance increases the requested view. The memory budget bounds retained data and does not silently shorten the native view distance. Select `renderer = "block-packets"` explicitly to use standard projection with the mod installed.

`/wormholes clientview` lists sessions and switches ClientView at runtime; see [ClientView commands](/wormholes/09-commands-permissions#clientview-commands).

### Singleplayer

Singleplayer worlds use ClientView by default and read `[client-view]` from `config/wormholes/wormholes.toml` in the game folder. The dedicated renderer receives progressive sections from the integrated server, as modded LAN guests do from the host. Portal and door crossings in singleplayer are seamless under the same `[client-view]` keys as a Fabric, Forge, or NeoForge server.

### Mirrors

Mirrors use the same native model rendering, per-frame camera updates, and aperture clipping as linked portals. Blackout has no effect on these views. Mirrors use blocks, lighting, biomes, block entities, and entities already loaded in the current client world, with the same render-distance and memory limits as other portals. Local block, lighting, and block-entity updates refresh the reflection. Placed and removed blocks take priority over neighboring section refreshes. Directional block models, including mushroom cap and stem faces, follow the mirror rotation; sloped water surfaces retain their reflected shading with shaders enabled. Unavailable contents arrive from the server; matching native peers avoid resending contents supplied locally. Entities and the player’s own reflection follow the mirror’s full rotation. The player sees their own reflection unless `self-reflection = false`. Reflections do not intercept local clicks or block breaking and do not physically collide with players or other entities. With `client-recursion` enabled at both ends, mirrors, linked portals, and active dimensional doors visible inside another view show their own destinations across worlds, including repeated reflections. Each nested aperture retains its own viewpoint and recursion depth. A native mirror chain stops after four reflections, including the first mirror. Linked portals follow each portal's recursion depth up to three nested steps. Each primary view has at most 16 nested views.


## Arrival warmer vs chunk pre-send

These are separate systems:

| System | Config keys (`[main]`) | Default | Behavior |
|--------|------------------------|---------|----------|
| **Arrival warmer** | `arrival-prewarm-on-interest`, `arrival-warm-radius-chunks`, `arrival-warm-max-radius-chunks`, `arrival-warm-hold-millis`, `arrival-warm-throttle-millis` | prewarm **true**. Radius **4**. Max radius **10**. Hold **5000** ms. Throttle **1000** ms | When an observer is live-interested in a linked local destination, holds destination chunks via chunk leases so arrival geometry is warmer. Also used for imminent warm with view-distance-aware radius. |
| **Chunk pre-send** | `chunk-pre-send-enabled`, `chunk-pre-send-radius-chunks`, `chunk-pre-send-max-chunks`, `chunk-pre-send-budget-micros` | **enabled true**. Radius **3**. Max **32**. Budget **2000** µs | Immediately before a same-world local, RTP, or dimensional-door player teleport, sends already-loaded destination chunks from the destination-owned task within a microsecond budget, then initiates movement on the traveler entity owner. It does not load chunks. A rejected traveler dispatch restores the source view and refunds traversal cost through owner-safe recovery; if the source scheduler has retired, Wormholes consumes the transaction instead of running rollback off-owner. Cross-world and cross-server travel skip it. Prepared arrivals and seamless crossings with the client mod work separately. |

Related transition mask: `arrival-transition-mask` default **true**,
`arrival-transition-mask-ticks` default **25**. Chunk send rate tuner
(`chunk-send-rate-tuner`, targets) is a separate startup raise of Paper chunk
send/load rates. It is not projection rendering.
`chunk-send-rate-target` / `chunk-load-rate-target` of `<=0` or `>10000` is
unlimited.

## Operator controls

| Command | Permission | Effect |
|---------|------------|--------|
| `/wh admin freeze [seconds=30]` | `wormholes.admin.projection` | Pause server projection updates for all viewers for 5–300 s (default 30), retaining standard projection blocks. `seconds=0` resumes. ClientView camera rendering continues. |
| `/wh admin flush` | `wormholes.admin.projection` | Revert every observer’s projected blocks to ground truth and rebuild. |

Pre-send also skips when the packet bridge is unsupported, the player is offline, the destination region is not owned, or the destination centre chunk is not loaded.
