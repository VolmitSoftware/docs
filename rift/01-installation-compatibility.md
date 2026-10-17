---
title: "Rift: Installation and Compatibility"
description: "Minecraft and Java requirements, installation, builds, and Folia limits"
published: true
date: 2026-10-16T00:00:00.000Z
tags: "rift, installation, compatibility, java, folia"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Rift supports Paper for Minecraft 26.1 through 26.3, including patch releases, on Java 25 only. Folia has the lifecycle restrictions below.

## Requirements and installation

| Component | Requirement |
|---|---|
| Server | Paper 26.1, 26.2, or 26.3, including patch releases |
| Java | 25 |
| VolmLib | Included in the Rift distribution; no separate plugin required |
| External generator | Optional; required when a world uses its generator |
| PlaceholderAPI | Optional separate plugin for `%rift_...%` values; no expansion download required |
| Filesystem | Writable plugin data folder and world container |
| Network | Dependency downloads; optional language, update, metrics, and debug-upload requests |

Rift checks the Minecraft release and Java major version before library downloads or world initialization. Other Minecraft release lines, previews, and Java majors are unsupported. An older JVM can reject the Java 25 bytecode before Rift displays a message.

1. Stop the server and back up worlds and `plugins/Rift/`.
2. Place the Rift distribution jar in `plugins/`.
3. Start the server and run `/rift status`.

Restart to update the plugin jar. Configuration, profiles, and installed languages hot-load separately; do not use Bukkit `/reload` or plugin hot-loaders.

## Builds and downloads

Build with JDK 25:

```shell
./gradlew clean build
```

Use `gradlew.bat clean build` on Windows. The verified distribution goes to `build/libs/` and `../BUILDS/Rift.jar`. `-PbuildsDirectory=<path>` changes staging. `buildSwiftSwamp` uses the same verified staging workflow. Neither workflow installs the jar on a server.

Gradle uses a sibling VolmLib composite build when available. Set `-PuseLocalVolmLib=false` to use the published coordinate.

The distribution relocates and shrinks the required VolmLib code. SlimJar downloads and relocates Gson, TOML, and Adventure runtime dependencies instead of bundling them into the main jar. The bootstrap code and reflection-dependent fields remain available after shrinking.

Build checks compile against the minimum and maximum supported Paper APIs, verify Java 25 bytecode, and check required and forbidden distribution entries. A failed check leaves the previously staged jar unchanged.

English messages are generated locally. The other locale catalogs remain in the GitHub source repository and download on selection. See [Configuration and localization](/rift/04-configuration-localization) for language, metrics, update, and upload controls.

## Folia

Folia uses the same Minecraft and Java bounds. Listing, information, configuration, diagnostics, teleporting, and profile flag editing remain available.

Create, import, load, unload, quarantine, and restore are disabled because Rift cannot use dynamic world lifecycle operations there. Auto-load does not bypass that restriction. Unmanage retires a profile without unloading or moving its world.

## Verification scope

The October 16, 2026 build passed 220 tests, minimum/maximum Paper API compilation, Java 25 dependency checks, and distribution validation. The verified distribution is 976,838 bytes. PlaceholderAPI remains external to the distribution.

The October 16 runtime checks covered Paper 26.1.2 build 74 and 26.3 build 200 with Temurin 25.0.1. Rift started without PlaceholderAPI and with PlaceholderAPI 2.12.3. Paper 26.3 passed cold-library startup, cached restart, expansion registration, and graceful shutdown; its startup also logged host Windows performance-counter warnings.

The admission-policy distribution also passed a separate Paper 26.3 cold-library start, cached restart, and graceful shutdown. Rift reported ready in 1,146 ms on the cold start and 451 ms with cached libraries. Both test-server processes exited and the disposable instance was removed.

Ten admission-policy gameplay checks passed on Paper 26.1.2 build 74 using Mineflayer's 26.1 protocol (775). They covered capacity, independent entry/exit restrictions, same-world teleports, first-ever versus returning login placement, full-destination fallback, profile hot-loading, and all five new editor controls and resets. Three checks after a cached restart confirmed saved login routing, restoration of all five non-default policy values, and managed-world loading with permitted travel. This verifies protocol-visible behavior, not real-client rendering or sound.

Player assertions on 26.1.2 with the 26.1 bot protocol passed placeholder values and counts, expansion persistence through `/papi reload`, world creation in `dimensions/rift`, game mode, flight permission restoration, native Creative flight, rain-level transitions, all five policy choice editors and resets, and local diagnostics. A separate restart run verified managed-world loading and profile edits applying to the player without a reload command. The baseline configuration and version-command checks also passed.

Natural-spawn classification and cancellation are unit-tested; the player test confirms commands can still summon animals while natural spawning is denied. The October 14 checks covered language download, hot-loading, edited prefixes, and English fallback. Paper 26.2 build 123 last passed startup/restart/shutdown on October 13. The installed bot harness does not support 26.2 or 26.3; Folia and real-client rendering/sound were not tested in this pass.

Next: [Commands and permissions](/rift/02-commands-permissions)
