---
title: "Shaped Portals: Feature map"
description: "Current capabilities, verification limits, and proposed operator tools"
published: true
date: 2026-10-14T00:00:00.000Z
tags: "shapedportals, features, roadmap, verification"
editor: markdown
dateCreated: 2026-10-14T00:00:00.000Z
---

<nav class="doc-breadcrumb" aria-label="Breadcrumb"><a href="/shapedportals">Shaped Portals</a><span aria-hidden="true">/</span><span aria-current="page">Feature map</span></nav>

This map separates implemented behavior from delivery gaps and proposed work. Implemented means the capability exists in the source; platform and gameplay validation are separate. Proposed entries are unimplemented and have no scheduled release.

## Implemented

| Capability | Scope |
|---|---|
| Portal geometry | Connected, bounded vertical Nether shapes and horizontal End shapes; configurable materials and limits |
| Persistent integrity | Saved records, location indexes, repair of replaceable cells, and deactivation when the frame or interior becomes invalid |
| Folia ownership | Region-owned creation and world access; cross-region shapes are rejected and unloaded chunks defer integrity checks |
| Protection events | Native Nether creation events, accepted End eye placement, and build checks before placing End surfaces |
| Administration | Paginated lists, UUID/prefix selection, safe teleportation, and a separately permitted unsafe confirmation |
| Configuration and languages | Typed TOML, inventory editors, live reload, personal locale choices, English fallback, and 17 repository translations |
| Failure feedback | Fifteen complete localized creation-failure messages; unrelated fires and incomplete End frames remain silent |
| Update notices | Shared GitHub release checks, permission-filtered join notices and reports, and a configuration opt-out; installation remains manual |
| Integrations and diagnostics | Wormholes ownership handoff, optional React metrics, bStats controls, and local debug reports with optional upload |
{.dense}

## Delivery and verification gaps

| Area | Status | Completion criterion |
|---|---|---|
| Shared update text | Partial: the combined VolmLib join notice and report use English | Localize shared update text in VolmLib and verify per-player language selection |
| Supported platform matrix | Runtime verification is separate from API compilation | Record startup, dependency-cache reuse, reload, shutdown, and portal gameplay results for the declared Minecraft 26.1 through 26.3 targets on Java 25 |
{.dense}

Repository translations install from a published pinned revision. Existing locale files are never replaced automatically; missing entries use built-in English until the operator merges the updated entries. This preserves local edits. The current published catalogs still label compatibility as `26.1+`; repository catalogs use `26.1-26.3`. Publish those catalog changes and refresh the pin before release so new downloads display the bounded support range.

## Build verification

The October 14, 2026 distribution passed 119 tests, the configured API compilation checks through Paper 26.3, packaging checks, and Java 25 entry-point verification. The packed jar is 835,352 bytes; the staged jar has the same SHA-256 (`0abe270356079e2c8617aeb1467aa6dd4913bebdddc23a2ca2e029f0c0aa37f9`).

This build used the explicit Wormholes API path because building the current sibling API stopped at its missing `sh` executable. The canonical default now points to `../Wormholes`; that project's API must be built first when no override is supplied.

## Runtime verification

The same artifact passed six protocol checks on Paper 26.1.2 with Java 25.0.1 and a Minecraft 26.1 bot: the hidden root version shortcut, debug version, supported-range status, local debug dump, configuration inventory, and language menu. Empty-library-cache startup and cached restarts also succeeded. Paper 26.3 build 181 enabled the plugin and shut down cleanly, but the installed bot harness rejected protocol 26.3; gameplay on that version remains unverified. Both isolated instances were stopped and deleted, and all viewer feeds closed. These checks do not establish rendering, sound, real-client interaction quality, or the full Folia/platform matrix.

## Proposed operator tools

These proposals follow a suggested implementation order. Each needs its own behavior review, documentation, and observable acceptance checks before becoming an implemented feature.

| ID | Proposal | Completion criterion |
|---|---|---|
| SP-001 | Portal inspector | Report identity, type, axis, dimensions, applicable limits, and failing positions or rules; distinguish invalid geometry from unavailable chunks or region ownership |
| SP-002 | Temporary outline | Show the selected frame and interior only to the requesting player, with bounded duration and particle count and no chunk loading |
| SP-003 | Extinguish and remove | Preview and confirm removal, clear the managed surface, preserve its frame, and prevent queued repair from restoring it |
| SP-004 | Names and list filters | Persist optional names while retaining UUID identity; filter by world, portal type, name, and observed health |
| SP-005 | Record-only removal | Explicitly remove management without changing blocks and explain that remaining native portal blocks may still function |
| SP-006 | Portal lifecycle API | Publish immutable creation, removal, and repair data with defined event timing and cancellation only where supported |
| SP-007 | Health and repair history | Record bounded audit outcomes, repairs, deactivations, and deferrals per portal and expose persistence failures |
| SP-008 | Per-portal maintenance pause | Pause and resume one portal's repair, show its state in inspection and lists, and keep maintenance state distinct from travel behavior |
{.dense}

Pairing, custom destinations, economy costs, travel actions, and proxy transport require separate product decisions. Through-portal rendering belongs to Wormholes. Automatic discovery of unmanaged portals would need explicit adoption and bounded scanning.

## Related pages

- [Getting started *Portal creation, commands, and permissions*](/shapedportals/00-overview)
- [Portal behavior *Persistence, repair, protection, and failures*](/shapedportals/02-portal-behavior-events)
- [Compatibility and operations *Platform boundaries and diagnostics*](/shapedportals/03-compatibility-operations)
- [Developer reference *Geometry, integration boundaries, and builds*](/shapedportals/04-architecture-limits)
{.links-list}
