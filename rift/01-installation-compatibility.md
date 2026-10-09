---
title: "Rift: Installation and Compatibility"
description: "Server range, Java requirements, installation, and Folia limits"
published: true
date: 2026-10-09T16:52:52.000Z
tags: "rift, installation, compatibility, java, folia"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Rift `2.0.1-26.x` requires Java 25 and Paper 26.x world storage. Folia supports administration and player policies with the lifecycle limits below.

## Requirements

| Component | Requirement |
|---|---|
| Server API | Paper 26.x |
| Java | Java 25 or newer |
| VolmLib | Shaded into the Rift artifact |
| Generator plugin | Optional for external generators; `vanilla` and `void` are built in |
| Filesystem | Rift data folder and world container must be writable |
| Network | HTTPS access to GitHub when installing a missing selected translation, to bStats when anonymous metrics remain enabled, and to mclo.gs when the default public debug upload setting remains enabled |

Install the generator or lifecycle provider required by each managed world before explicitly loading it. Iris retains control of its packs and world engine when Rift is installed. Rift establishes ownership of secondary `iris:*` worlds before world loading. Install both plugins before restarting; these worlds follow Rift's explicit loading and startup settings.

## Install

1. Stop the server and back up its worlds and `plugins/Rift/`.
2. Put the Rift jar in `plugins/`.
3. Start the server.
4. Run `/rift status`.

Rift does not require a separate VolmLib jar. Restart the server to update Rift and apply its bootstrap world ownership. Do not use `/reload` or other plugin hot-loaders.

## Build from source

The build uses a JDK 25 toolchain and emits Java 25 class files.

```none
git clone https://github.com/VolmitSoftware/Rift.git
cd Rift
./gradlew clean build
```

The artifact lands under `build/libs/`. Translations stay in the source repository and are not bundled into the jar.

If a `VolmLib` checkout sits next to Rift, Gradle uses it as a composite build. Pass `-PuseLocalVolmLib=false` to resolve VolmLib remotely instead.

In the Volmit workspace, `./build-psycho-lt.sh` includes Rift and ShapedPortals. ShapedPortals starts after the Wormholes API build completes. Rift's `./gradlew buildPsychoLT` runs verification before copying `Rift.jar` to the managed Minecraft test-server drop-ins and the versioned jar to `PluginOuts`. The root script's `--tests-only` mode runs Rift tests without exporting its jar.

## Folia

On Folia, listing, information, teleport, configuration, diagnostics, auto-load and protection all work.

Dynamic create, load, unload, and quarantine are disabled on Folia. Registration of existing storage, adoption of loaded worlds, unmanage, and restoration of unloaded quarantined storage remain available.

Next: [Commands and permissions](/rift/02-commands-permissions)
