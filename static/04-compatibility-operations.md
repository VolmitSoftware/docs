---
title: Static - Compatibility and operations
description: Platform requirements, diagnostics, persistence, and integrations
published: true
date: 2026-10-17T00:00:00.000Z
tags: static, folia, diagnostics
editor: markdown
dateCreated: 2026-09-10T00:00:00.000Z
---

Static requires Java 25 or newer and Minecraft 26.1 through 26.3, including patch releases within those lines. It targets Spigot, Paper, Purpur, Leaf, Folia, and Canvas. The version check runs before statistics, configuration, and dashboard services start; unsupported or unrecognized versions stop startup.

## Diagnostics

`/static status` reports the scheduling mode, recording state, profile count, and save interval. `/static debug version` shows the installed version; `/static version` is its hidden alias.

`/static debug dump` writes a local report under `plugins/Static/debug/`. Add `upload=true` to publish it to mclo.gs when `debug.uploadEnabled` allows uploads. Reports include effective configuration, locale sources, integrations, dependency state, and persistence health. Review a report before sharing it.

The startup banner uses Static's amber and cream colors and the shared Volmit layout. Disable it with `presentation.splashScreen=false`; hot reload does not replay it.

## Storage and integrations

Static atomically replaces `storage/players.json`, autosaves live eligible session time, and finishes a final save at shutdown. Back up the entire `plugins/Static/storage/` directory with the server stopped, together with configuration and language customizations. Do not edit live storage files.

An invalid existing statistics file stops Static from enabling rather than overwriting player history. A failed visibility load restricts other-player access until the data is available.

PlaceholderAPI and Votifier/NuVotifier are optional. Votes require a recorded player name; Static does not look up unknown names against Mojang. Statistics stay on the current server and do not synchronize across a network.

GitHub release notifications use `VolmitSoftware/Static` and never install updates. `static.update` or `volmit.update` permits player notifications. The shared updater's notices are in English. bStats is disabled by default and uses Static's registered ID `34591`; reporting also respects bStats' global opt-out.

## Builds and libraries

Run `./gradlew build` or `.\gradlew.bat build` from the project root with Java 25. The build uses the shared Volmit packaging pipeline to retain reachable VolmLib code and the reflection metadata needed by commands, configuration, and persistence. bStats and the library bootstrap are relocated in the JAR; Gson, TOML4J, and Adventure download separately.

Packaged-artifact checks cover reflection, localization, persistence, required metadata, the 1.5 MB size limit, and exclusion of server APIs and downloaded libraries. `buildSwiftSwamp` verifies and stages `Static.jar` in the workspace `BUILDS` directory. `-PbuildsDirectory=<path>` changes that staging destination.

Release builds can set `-PlanguageSourceRevision=<published-40-character-commit-SHA>` to select the translation revision.

[Installation and configuration](/static/01-installation-configuration) · [API and placeholders](/static/90-api-placeholders)
