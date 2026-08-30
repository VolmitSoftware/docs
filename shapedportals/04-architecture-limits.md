---
title: "Shaped Portals: Developer Reference"
description: "Geometry, persistence, region ownership, and build instructions"
published: true
date: 2026-08-30T00:00:00.000Z
tags: "shapedportals, architecture, physics, limits"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

<style>
.sp-reference { max-width: 1120px; margin: 0 auto; line-height: 1.7; }
.sp-reference h2 { margin-top: 2.4rem; padding-bottom: .5rem; border-bottom: 1px solid rgba(127,127,127,.25); font-size: 1.5rem; scroll-margin-top: 5rem; }
.sp-reference h3 { margin-top: 1.6rem; scroll-margin-top: 5rem; }
.sp-reference .sp-nav { display: flex; flex-wrap: wrap; gap: .4rem; margin: 0 0 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(127,127,127,.25); }
.sp-reference .sp-nav a { display: block; padding: .4rem .75rem; border: 1px solid transparent; border-radius: 6px; text-decoration: none; color: inherit; font-size: .9rem; }
.sp-reference .sp-nav a:hover, .sp-reference .sp-nav a[aria-current="page"] { background: rgba(146,93,198,.12); border-color: rgba(146,93,198,.35); }
.sp-reference a:focus-visible, .sp-reference summary:focus-visible { outline: 3px solid #a66bdd; outline-offset: 3px; }
.sp-reference table { width: 100%; display: table; table-layout: fixed; border-collapse: collapse; font-size: .93rem; }
.sp-reference th, .sp-reference td { padding: .8rem; vertical-align: top; text-align: left; overflow-wrap: anywhere; border: 1px solid rgba(127,127,127,.22); }
.sp-reference th:first-child { width: 32%; }
.sp-reference .sp-commands th:first-child { width: 35%; }
.sp-reference .sp-commands th:last-child { width: 20%; }
.sp-reference .sp-permissions th:first-child { width: 40%; }
.sp-reference .sp-permissions th:nth-child(2) { width: 18%; }
.sp-reference .sp-settings th:first-child { width: 35%; }
.sp-reference .sp-settings th:nth-child(2) { width: 22%; }
.sp-reference th { background: rgba(146,93,198,.09); }
.sp-reference td code { white-space: normal; overflow-wrap: anywhere; }
.sp-reference pre { max-width: 100%; overflow-x: auto; }
.sp-reference .sp-media { min-height: 170px; margin: 1.3rem 0; padding: 1.5rem; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: .4rem; border: 1px dashed rgba(127,127,127,.5); border-radius: 8px; background: rgba(146,93,198,.04); text-align: center; }
.sp-reference .sp-media span { max-width: 42rem; font-size: .9rem; }
.sp-reference blockquote, .sp-reference .sp-caution { margin: 1.3rem 0; padding: .9rem 1.1rem; border: 1px solid rgba(127,127,127,.35); border-radius: 6px; background: rgba(127,127,127,.05); color: inherit; }
.sp-reference blockquote p, .sp-reference .sp-caution p { margin: 0; }
.sp-reference details { margin: 1rem 0; padding: .85rem 1rem; border: 1px solid rgba(127,127,127,.3); border-radius: 6px; }
.sp-reference summary { cursor: pointer; font-weight: 600; }
.sp-reference details[open] summary { margin-bottom: .8rem; }
.sp-reference .sp-related { margin-top: 2.5rem; padding-top: 1rem; border-top: 1px solid rgba(127,127,127,.25); }
@media (max-width: 600px) {
  .sp-reference table, .sp-reference tbody { display: block; }
  .sp-reference thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
  .sp-reference tr { display: block; margin: .7rem 0; padding: .3rem 0; border: 1px solid rgba(127,127,127,.25); border-radius: 6px; }
  .sp-reference td { display: block; width: auto; padding: .4rem .8rem; border: 0; font-size: .92rem; }
  .sp-reference td:first-child { font-weight: 600; }
  .sp-reference td::before { font-weight: 600; }
  .sp-reference .sp-commands td:nth-child(3)::before { content: "Run from: "; }
  .sp-reference .sp-permissions td:nth-child(2)::before, .sp-reference .sp-settings td:nth-child(2)::before { content: "Default: "; }
  .sp-reference .sp-nav { gap: .15rem; }
  .sp-reference .sp-nav a { padding: .4rem .5rem; }
}
</style>

<div class="sp-reference">
<nav class="sp-nav" aria-label="Shaped Portals guides"><a href="/shapedportals">Home</a><a href="/shapedportals/00-overview">Build &amp; commands</a><a href="/shapedportals/01-installation-configuration">Configuration</a><a href="/shapedportals/02-portal-behavior-events">Portal behavior</a><a href="/shapedportals/03-compatibility-operations">Server setup</a></nav>

Shaped Portals separates geometry, region-owned world access, configuration, and persistent portal records. This page explains those boundaries for developers and integrations.

[Geometry](#geometry-engine) · [Persistence](#why-portal-records-are-required) · [Threading](#thread-and-region-model) · [Build](#build-from-source)

## Geometry engine

The scanner classifies integer plane coordinates as interior, frame, blocked, or unowned. It uses an iterative `ArrayDeque` traversal and hash sets rather than recursion. Inclusive limits stop the search before it can grow beyond the configured bounds.

Both vertical axes are tested independently. A valid result contains immutable interior and frame-coordinate sets. A shape valid in both axes is rejected.

| Constraint | Reason |
|---|---|
| Vertical X or Z plane | Native Nether portal blocks only support these axes |
| One connected interior | Diagonal contact does not form a connected portal surface |
| Bounded area, width, and height | Keeps scanning and block changes finite |
| One owning Folia region | There is no atomic multi-region block commit |
| Second scan after the creation event | Rejects changes made while integrations inspect the proposal |

The [creation event contract](/shapedportals/02-portal-behavior-events#ignition-and-protection-plugins) lets protection plugins cancel a portal before any blocks are placed.

## Why portal records are required

`NETHER_PORTAL` is not a tile state and cannot hold a persistent data container. Runtime block metadata also does not survive restart. Scanning after startup cannot reliably distinguish managed portals from vanilla or other plugins' blocks.

The registry records ownership. Events mark nearby records for checks, and a periodic sweep reconciles loaded records. The plugin never relies on globally cancelling `BlockPhysicsEvent` to preserve an unusual shape.

See [Persistent ownership](/shapedportals/02-portal-behavior-events#persistent-ownership) for the stored fields and recovery rules.

## Thread and region model

| Work | Execution context |
|---|---|
| Automatic file reloads, GUI reloads, and GUI writes | Off the gameplay thread |
| Registry persistence | Dedicated asynchronous writer |
| Configuration and language activation | Atomic snapshot replacement |
| Shape scans, portal placement, repairs, and removal | Owning region |
| GUI results and player feedback | Player's owning scheduler |
| Teleport chunk preparation | Asynchronous where available, otherwise on the owning region |
| Landing checks | Destination region |
| Player teleport completion | Entity scheduler |

Integrity checks skip unloaded chunks. Administrative teleportation can prepare the portal and nearby landing chunks. Creation refuses shapes that span independently owned regions.

## Native mechanics boundary

The plugin uses Bukkit `Orientable` block data for the portal axis. It does not need NMS, packets, or version adapters.

Minecraft controls destination search, coordinate scaling, and generated destination frames. Horizontal portals, 3D surfaces, exact pairing, and custom destinations require a separate display or teleport system.

No event set covers every possible external block mutation, which is why the periodic integrity sweep remains necessary.

## Shared systems

VolmLib supplies TOML handling, file watching, localization, validated translation downloads, command/help presentation, HUD coordination, and scheduling.

Shaped Portals owns geometry, registry policy, integrity decisions, commands, presentation settings, and its categorized configuration editor. Optional React integration reads concurrent counts without accessing live world state during sampling.

## Build from source

The Gradle wrapper uses Java 25 and produces Java 17 bytecode.

```text
./gradlew build
```

The shaded artifact is `build/libs/ShapedPortals-2.0.0.jar`. The build also exports the React pack to `build/distributions/react-api-packs/`.

Build checks cover tests, Spigot 1.20.1 and current Paper/Spigot API compilation, Java 17 class compatibility, VolmLib relocation, and the remote-language manifest. The manifest lists the 17 repository translations and follows `main`; locale TOML files are downloaded when needed rather than bundled in the jar.

`./gradlew publishToMavenLocal` runs the checks and publishes the shaded plugin and sources as `com.volmit:shapedportals:2.0.0`. The repository's build and local-publication tasks also refresh its configured staging jar.

<div class="sp-related"><a href="/shapedportals">Shaped Portals home</a> · <a href="/shapedportals/02-portal-behavior-events">Portal behavior &amp; events</a> · <a href="https://github.com/VolmitSoftware/ShapedPortals">Source repository</a></div>

</div>
