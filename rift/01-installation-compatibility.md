---
title: "Rift: Installation and Compatibility"
description: "Server range, Java requirements, installation, and Folia limits"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "rift, installation, compatibility, java, folia"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Rift `2.0.0-1.20.1-26.2` uses Java 17 bytecode and supports Spigot-compatible servers from 1.20.1 through 26.2.

## Requirements

| Component | Requirement |
|---|---|
| Server API | Spigot-compatible API 1.20.1 or newer |
| Java | The Java version required by the server, never lower than 17 |
| VolmLib | Shaded into the Rift artifact |
| Generator plugin | Optional for external generators; `vanilla` and `void` are built in |
| Filesystem | Rift data folder and world container must be writable |
| Network | HTTPS access to GitHub when installing a missing selected translation, to bStats when anonymous metrics remain enabled, and to mclo.gs when the default public debug upload setting remains enabled |

Java 17 is the plugin's bytecode floor, not a promise that every server release runs on Java 17. Use the Java release required by Paper, Spigot, Purpur, or Folia for the selected Minecraft version; newer JVMs can load Rift's Java 17 classes.

## Install

1. Stop the server and back up its worlds and `plugins/Rift/`.
2. Put the Rift jar in `plugins/`.
3. Start the server.
4. Run `/rift status`.
5. Test world creation and recovery with a disposable world before managing production worlds.

Rift does not require a separate VolmLib jar. Do not use `/reload` or a generic plugin hot-loader for world lifecycle validation.

## Build from source

The build uses a JDK 25 toolchain and emits Java 17 class files with `-parameters`:

```text
git clone https://github.com/VolmitSoftware/Rift.git
cd Rift
./gradlew clean build
```

On Windows, run `gradlew.bat clean build`. The artifact is written under `build/libs/`. Translation TOML files remain in the source repository and are not bundled into the plugin jar.

When Rift is next to the VolmitSoftware `VolmLib` repository, Gradle uses that local composite build. Pass `-PuseLocalVolmLib=false` only when remote resolution is intentional.

## Folia

Folia supports Rift's listing, information, teleport, configuration, diagnostics, auto-load settings, and protection settings.

Folia does not currently support the dynamic world APIs required for create, import, load, unload, quarantine, or restore. Rift disables those commands there.

Next: [Commands and permissions](/rift/02-commands-permissions)
