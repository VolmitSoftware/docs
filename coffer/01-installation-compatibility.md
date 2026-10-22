---
title: Coffer installation and compatibility
description: Development build requirements and packaging
published: true
date: 2026-10-19T00:00:00.000Z
tags: coffer, installation
editor: markdown
dateCreated: 2026-10-17T00:00:00.000Z
---

Coffer targets Paper and Folia 26.1 on Java 25 or newer. Version 0.7.0 adds coordinated stopped-server snapshots and verified restoration into a new directory. Verify the version-specific evidence in the [feature map](/coffer/04-feature-map) before deployment.

Build with `./gradlew.bat build buildSwiftSwamp` from the project directory. The independent Gradle build discovers local VolmLib in parent directories and stages `Coffer.jar` in the workspace `BUILDS` directory. `buildsDirectory` overrides staging. VolmLib is included privately and is not installed as another plugin.

The first server start downloads relocated Gson, TOML, and Adventure dependencies through SlimJar. A populated dependency cache is reused on restart. Language catalogs are bundled in this initial version and do not require remote language downloads.

Start the server and run `/coffer status`. Initialization failures log the full exception and disable Coffer. Malformed configuration on initial startup prevents enablement; a malformed edit while running retains the active settings.

Local storage initializes asynchronously in `plugins/Coffer/storage`; the console announces readiness separately from plugin enablement. An exclusive filesystem lock prevents two Coffer processes from sharing that root. The [storage reference](/coffer/06-local-storage) explains directory-flush limitations, shutdown draining, and offline recovery boundaries. `/coffer debug` includes storage lifecycle, queue state, and session counts; `/coffer status` still reports the foundation's version, type count, and language. Shutdown drains accepted [session drafts](/coffer/07-items-sessions) before closing storage.

Only test deployments in isolated Multiplexor instances are part of the development workflow. No production server directory is a build or staging target.

Live transfers require writable native player storage at `players/data` under the server's main level directory. Use the [coordinated backup tool](/coffer/09-backup-restore) to capture the complete stopped server, including player data, world containers, and Coffer storage. The same JAR runs the offline tool through `java -jar Coffer.jar backup help` without starting Paper or downloading libraries. Use full server restarts; live plugin unloading is unsupported, and Coffer refuses enablement while players are online. See [live transfers and recovery](/coffer/08-live-transfers) for checkpoint publication, receipt checks, and constraints on other plugins writing player state.
