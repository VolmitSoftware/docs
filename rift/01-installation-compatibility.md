---
title: "Rift — Installation & Compatibility"
description: "Server range, Java requirements, source build, and Folia capability limits"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "rift, installation, compatibility, java, folia"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Rift 3.0 is compiled as Java 17 bytecode against the public Spigot API. Its build verifies the 1.20.1 API floor, current Paper 26.1, and current Spigot 26.2, and rejects accidental CraftBukkit or NMS references in Rift classes.

## Requirements

| Component | Requirement |
|---|---|
| Server API | Spigot-compatible API 1.20.1 or newer |
| Java | The Java version required by the server, never lower than 17 |
| VolmLib | Shaded into the Rift artifact |
| Generator plugin | Optional; must be enabled before its generator is used |
| Filesystem | Rift data folder and world container must be writable |

Java 17 is the plugin's bytecode floor, not a promise that every server release runs on Java 17. Use the Java release required by Paper, Spigot, Purpur, or Folia for the selected Minecraft version; newer JVMs can load Rift's Java 17 classes.

## Install

1. Stop the server and make a recoverable backup of its worlds and `plugins/Rift/`.
2. Place the shaded Rift jar in `plugins/`.
3. Start the server and confirm Rift 3.0.0 enables without an exception.
4. Run `/rift doctor` and review the detected platform, Java runtime, world-container path, write access, and dynamic-lifecycle capability.
5. Test create, unload, quarantine, restore, and restart behavior with a disposable world before using production worlds.

Rift does not require a separate VolmLib jar. Do not use `/reload` or a generic plugin hot-loader for world lifecycle validation.

## Build from source

The build uses a JDK 25 toolchain and emits Java 17 class files with `-parameters`:

```text
git clone https://github.com/VolmitSoftware/Rift.git
cd Rift
./gradlew clean build
```

On Windows, run `gradlew.bat clean build`. The build includes unit tests, a shaded-jar bytecode and NMS scan, and compilation against the floor plus current Paper and Spigot APIs. The artifact is under `build/libs/`.

When Rift is next to the VolmitSoftware `VolmLib` repository, Gradle uses that local composite build. Pass `-PuseLocalVolmLib=false` only when remote resolution is intentional.

## Folia

Rift loads on Folia and uses VolmLib's global, entity, and asynchronous scheduler bridge. These commands remain available: help, list, info, generators, teleport, send, reload, config, doctor, autoload, and protect.

Create, import, load, unload, delete, and restore are disabled on Folia because Folia's dynamic world lifecycle API is not implemented. Startup auto-loading is also skipped. `/rift doctor` reports this capability explicitly instead of allowing an unsupported call to fail at runtime.

Next: [Commands & Permissions](/rift/02-commands-permissions)
