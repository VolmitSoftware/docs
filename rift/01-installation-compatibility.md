---
title: "Rift: Installation and Compatibility"
description: "Server range, Java requirements, installation, and Folia limits"
published: true
date: 2026-09-19T00:00:00.000Z
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

Java 17 is the plugin's bytecode floor, not a promise that every server release runs on Java 17. Use whatever Java your server version needs; a newer JVM loads Rift fine.

## Install

1. Stop the server and back up its worlds and `plugins/Rift/`.
2. Put the Rift jar in `plugins/`.
3. Start the server.
4. Run `/rift status`.

Rift does not require a separate VolmLib jar. Restart the server to update Rift; do not use `/reload` or a generic plugin hot-loader.

## Build from source

The build uses a JDK 25 toolchain and emits Java 17 class files.

```text
git clone https://github.com/VolmitSoftware/Rift.git
cd Rift
./gradlew clean build
```

The artifact lands under `build/libs/`. Translations stay in the source repository and are not bundled into the jar.

If a `VolmLib` checkout sits next to Rift, Gradle uses it as a composite build. Pass `-PuseLocalVolmLib=false` to resolve VolmLib remotely instead.

## Folia

On Folia, listing, information, teleport, configuration, diagnostics, auto-load and protection all work.

Folia has no dynamic world API, so create, import, load, unload, quarantine and restore are disabled there.

Next: [Commands and permissions](/rift/02-commands-permissions)
