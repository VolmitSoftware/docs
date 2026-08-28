---
title: "Shaped Portals — Compatibility & Operations"
description: "Supported API range, Java floors, Folia constraints, and validation status"
published: true
date: 2026-08-28T00:00:00.000Z
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

## Operational checklist

Before production use, test on the exact server build:

- startup, `/sp`, `/sp status`, `/sp reload`, and clean shutdown;
- valid concave shapes in both axes;
- exact maximum and maximum-plus-one shapes;
- open, blocked, ambiguous, and cross-region frames;
- player flint and steel, placed fire, and dispenser fire-charge ignition;
- cancelled ignition and cancelled `PortalCreateEvent` protection paths;
- GUI edits and external TOML hot reload, including invalid-file rollback;
- portal survival across restart and chunk unload/load;
- frame break, piston, explosion, fluid, and WorldEdit integrity behavior;
- native travel, destination creation, and return travel; and
- console evidence with no scheduler ownership or persistence exceptions.

Mineflayer can prove command, placement, travel, block, and position outcomes on
supported protocols. It does not prove exact portal rendering, sound, client
camera behavior, or visual feel; those require a real client.

Next: [Architecture & Limits](/shapedportals/04-architecture-limits)
