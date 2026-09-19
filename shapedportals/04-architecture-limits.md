---
title: "Shaped Portals: Developer reference"
description: "Geometry constraints, the portal registry, the Wormholes handoff, and building from source"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "shapedportals, architecture, physics, limits"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

<nav class="doc-breadcrumb" aria-label="Breadcrumb"><a href="/shapedportals">Shaped Portals</a><span aria-hidden="true">/</span><span aria-current="page">Developer reference</span></nav>

## Geometry constraints

| Constraint | Reason |
|---|---|
| Vertical X/Z or horizontal X/Z plane | Nether blocks use a vertical axis; End blocks are always horizontal |
| One connected interior | Diagonal contact does not form a connected portal surface |
| Bounded area, width, and height | Keeps scanning and block changes finite |
| One owning Folia region | There is no atomic multi-region block commit |
| Revalidation before commit | Rejects changes made while integrations inspect the proposal |

Nether ignition tests both vertical axes independently; a shape valid in both is rejected as ambiguous. End activation tests the horizontal X/Z plane from the completed eye frame.

For standalone Nether portals, the [creation event contract](/shapedportals/02-portal-behavior-events#ignition-and-protection-plugins) lets protection plugins cancel the proposal before any block is placed. End portals start from the accepted Eye of Ender placement and fire `BlockCanBuildEvent` for each proposed cell before revalidating the frame.

## Why portal records are required

Neither `NETHER_PORTAL` nor `END_PORTAL` is a tile state that can hold a persistent data container, and runtime block metadata does not survive a restart. Scanning the world after startup cannot tell a managed portal from a vanilla one.

So Shaped Portals keeps its own registry. Deleting it orphans the portals. Vertical axes `X` and `Z` identify Nether portals; axis `Y` identifies a horizontal End portal, which keeps both types in one schema.

Events mark nearby records for checking and a periodic sweep reconciles loaded records. The plugin never globally cancels `BlockPhysicsEvent` to hold a shape together.

See [Persistent ownership](/shapedportals/02-portal-behavior-events#persistent-ownership) for the stored fields and recovery rules.

## Native mechanics boundary

Shaped Portals uses Bukkit `Orientable` block data for Nether portal axes and ordinary `END_PORTAL` data for horizontal End surfaces. No NMS, packets, or version adapters.

Minecraft controls destination search, coordinate scaling, and generated destination frames. End surfaces are horizontal because the block is. Vertical End surfaces, 3D surfaces, exact pairing, and custom destinations need a separate display or teleport system.

No event set covers every external block mutation, which is why the periodic integrity sweep exists.

## Shared systems

VolmLib supplies TOML handling, file watching, localization, command and help presentation, HUD coordination, scheduling, and [diagnostic report collection](/volmlib/api/diagnostics). Shaped Portals owns geometry, registry policy, integrity decisions, commands, presentation settings, and its configuration editor.

Optional React integration reads concurrent counts without touching live world state.

`LanguageService.render`, `renderPrefixed`, and `renderWithoutPrefix` all return `ComponentText`. Send that straight through `ComponentMessenger`; use `.legacy()`, `.plain()`, or `.miniMessage()` only when an output API demands one, and never re-parse a rendered message.

## Wormholes geometry handoff

Shaped Portals submits Nether interior block positions and their vertical axis through the Wormholes `NetherPortalShapes` service. An accepted shape belongs to Wormholes: it does not enter the Shaped Portals registry or repair loop. See [Wormholes API](/wormholes/20-api-getting-started#nether-portal-shapes).

## Build from source

The Gradle wrapper uses Java 25 and produces Java 17 bytecode.

Build the sibling Wormholes API first with `./gradlew apiJar` from `WormholesPlugin/`. Shaped Portals compiles against `../WormholesPlugin/build/libs/Wormholes-2.0.6-26.2-api.jar`; pass `-PwormholesApiJar=/path/to/Wormholes-api.jar` to use another location. The API is not bundled.

```text
./gradlew build
```

The shaded artifact lands in `build/libs/ShapedPortals-<version>.jar`, and the build also exports the React pack to `build/distributions/react-api-packs/`.

`./gradlew publishToMavenLocal` publishes the shaded plugin and sources as `com.volmit:shapedportals:<version>`. See [Workspace builds](/volmlib/api/building).

## Related pages

- [Shaped Portals home *Feature summary and documentation index*](/shapedportals)
- [Portal behavior *Integrity, protection plugins, and event details*](/shapedportals/02-portal-behavior-events)
- [Compatibility and operations *Platforms, diagnostics, and React metrics*](/shapedportals/03-compatibility-operations)
- [Source repository *Plugin code, build files, and issue tracker*](https://github.com/VolmitSoftware/ShapedPortals)
{.links-list}
