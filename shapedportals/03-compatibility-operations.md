---
title: "Shaped Portals — Compatibility & Operations"
description: "Supported API range, Java floors, Folia constraints, and validation status"
published: true
date: 2026-08-29T04:30:00.000Z
tags: "shapedportals, compatibility, java, folia"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Shaped Portals 2.0 is NMS-free and emits Java 17 bytecode. Its declared Bukkit
API floor is 1.20 because the complete shared VolmLib surface used by commands,
localization, configuration, and scheduling is compatibility-compiled against
Spigot 1.20.1.

## Platform matrix

| Platform | Status |
|---|---|
| Spigot 1.20.1 | Baseline source compile gate passes |
| Paper 1.20.1 | VolmLib baseline compile target; runtime pass still required |
| Paper 1.20.2–1.21.11 | One NMS-free artifact is expected to link; certify exact production builds |
| Paper 26.1.2 | Current source compile gate passes |
| Spigot 26.2 | Current source compile gate passes |
| Folia 26.1.2 | Region-owned implementation and metadata present; isolated runtime pass still required |
| Folia 26.2 | Experimental upstream line; do not treat as a stable certification target |

Compile success proves API linkage, not server behavior. No isolated Minecraft
runtime or Mineflayer gameplay pass was available in the Windows workspace used
for the 28 August 2026 rewrite, so operators must complete the runtime checklist
below before production deployment.

## Java runtime floors

The plugin itself requires Java 17 or newer. The server may require more:

| Minecraft server range | Runtime floor |
|---|---:|
| 1.20.1–1.20.4 | Java 17 for this plugin artifact |
| 1.20.5–1.21.11 | Java 21 |
| 26.1–26.2 | Java 25 |

See the [Minecraft 1.20.5 release notes](https://www.minecraft.net/article/minecraft-java-edition-1-20-5)
and [Paper system requirements](https://docs.papermc.io/paper/getting-started/)
for upstream runtime changes.

## Why the floor is not 1.17

The portal code itself uses stable Bukkit APIs, but Java bytecode compatibility
does not prove every linked shared-library class is compatible with an older
Bukkit ABI. Honest 1.17 support requires a first-class minimal VolmLib plugin
core compiled as a complete closure against Spigot 1.17.1, plus representative
runtime tests. Version 2.0 does not claim that work prematurely.

## React Plugin API Pack

ShapedPortals always registers a lightweight VolmLib integration provider after
its portal registry and creation counters are ready. React discovers the
relocated service reflectively, so ShapedPortals has no compile-time or runtime
dependency on React and retains its Java 17 bytecode target. The provider reads
only concurrent registry sizes and session counters; it does not touch worlds,
chunks, entities, or inventories during sampling.

ShapedPortals' included `shapedportals-runtime.toml` pack exposes these samplers:

| React sampler | ShapedPortals source |
|---|---|
| Managed Portals | `shapedportals.managed-portals` |
| Portal Interior Cells | `shapedportals.interior-cells` |
| Portal Creation Attempts | `shapedportals.creation-attempts-total`, transformed to attempts per second |
| Created Portals | `shapedportals.created-portals-total`, transformed to portals per second |
| Rejected Portal Attempts | `shapedportals.rejected-attempts-total`, transformed to attempts per second |
| Portal Creation Success | `shapedportals.creation-success-percent` |

The three totals and success percentage cover the current ShapedPortals process
and reset when ShapedPortals restarts. Success percentage is unavailable until
the first attempt instead of reporting a fabricated zero. React's rate
transforms need two samples after pack activation or reload before reporting a
value. Unrelated terrain fire is excluded before attempt and rejection counters;
only candidates with a lower configured frame boundary enter those totals.

The pack is stored at `react-api-packs/shapedportals-runtime.toml` inside the
ShapedPortals jar, and local builds also place a standalone copy under
`build/distributions/react-api-packs/`. Copy it to `plugins/React/plugin-apis/` or install it once
through React Web, then run `/react plugin-api reload`.
See [React Plugin API Packs](/react/20-api-plugin-api-packs) for pack status,
validation, and containment behavior.

## Operational checklist

Before production use, test on the exact server build:

- startup splash, `/sp`, `/sp status`, bare and explicit-locale `/sp language`, `/sp debug`, `/sp portals`, `/sp teleport`, automatic file reload, and clean shutdown;
- valid concave shapes in both axes;
- exact maximum and maximum-plus-one shapes;
- open, blocked, ambiguous, and cross-region frames;
- player flint and steel, placed fire, and dispenser fire-charge ignition;
- ordinary fire on terrain remaining absent from attempt and rejection totals;
- cancelled ignition and cancelled `PortalCreateEvent` protection paths;
- every GUI category, typed chat prompt, clickable locale selection, prompt
  cancellation and expiry, plus external config and language-file hot reload
  with invalid-file rollback;
- action-bar coexistence with another VolmLib publisher, title-claim loss,
  boss-bar replacement and cleanup, and command sound enable/disable behavior;
- `metrics.enabled` hot disable and re-enable, plus the authoritative global
  opt-out in `plugins/bStats/config.yml`;
- React provider discovery, all six ShapedPortals Runtime samplers, first-sample
  rate availability, and clean provider retirement during shutdown;
- portal survival across restart and chunk unload/load;
- portal-list pagination, clickable full-UUID commands, unique-prefix lookup,
  same-world and cross-world safe landing, unloaded destinations, broken
  records, teleport cancellation, unsafe-landing first warning, same-portal
  confirmation, confirmation expiry, permission revocation, and console/player
  permission boundaries;
- all 18 locale choices, one command and GUI smoke test per selected locale,
  verified direct-file installation, offline reuse, English fallback after
  HTTP/hash/TOML failure, confirmation that unselected catalogs are not written,
  stale-key tolerance, and preservation of customized files after reload and restart;
- frame break, piston, explosion, fluid, and WorldEdit integrity behavior;
- native travel, destination creation, and return travel; and
- console evidence with no scheduler ownership or persistence exceptions.

For `/sp debug`, confirm the command returns immediately, creates a timestamped
file under `plugins/ShapedPortals/debug/`, refuses a concurrent second run, and
contains the expected portal, creation-rejection, portal-world-reference,
language-source, React-provider, service, file-hash, artifact, process, scheduler, and server
sections. With the default `debug.uploadEnabled = true`,
verify the returned mclo.gs link. Set the option to `false` and repeat the command
when local-only reporting is part of the server's operating policy.

Mineflayer can prove command, placement, travel, block, and position outcomes on
supported protocols. It does not prove exact portal rendering, sound, client
camera behavior, or visual feel; those require a real client.

## Build and local publication

Run `./gradlew build` for the complete Java 17, Paper, Spigot, test, and shaded
artifact gate. The deployable jar is
`build/libs/ShapedPortals-2.0.0.jar`; `build/distributions/react-api-packs/`
contains the standalone React pack. Every successful `build` also refreshes
`C:/VolmitSoftware/BUILDS/ShapedPortals.jar` through the standard
`buildSwiftSwamp` staging task.

`./gradlew publishToMavenLocal` runs the same checks and publishes the shaded
plugin plus sources as `com.volmit:shapedportals:2.0.0`. IntelliJ exposes this
task under the Gradle publishing group when the project is imported through its
wrapper; successful local publication also refreshes the shared `BUILDS` jar.

Next: [Architecture & Limits](/shapedportals/04-architecture-limits)
