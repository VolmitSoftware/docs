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

GitHub release notifications use `VolmitSoftware/Static` and never install updates. `static.update` or `volmit.update` permits player notifications. The shared updater's notices are currently English. bStats is disabled by default and uses Static's registered ID `34591`; reporting also respects bStats' global opt-out.

## Builds and libraries

Run `./gradlew build` or `.\gradlew.bat build` from the project root with Java 25. The build uses the shared Volmit packaging pipeline to retain reachable VolmLib code and the reflection metadata needed by commands, configuration, and persistence. bStats and the library bootstrap are relocated in the JAR; Gson, TOML4J, and Adventure download separately.

Packaged-artifact checks cover reflection, localization, persistence, required metadata, the 1.5 MB size limit, and exclusion of server APIs and downloaded libraries. `buildSwiftSwamp` verifies and stages `Static.jar` in the workspace `BUILDS` directory. `-PbuildsDirectory=<path>` changes that staging destination.

Release builds can set `-PlanguageSourceRevision=<published-40-character-commit-SHA>` to select the translation revision. Publish the catalogues before pinning a build to that commit.

## Verification status

Platform targets do not mean every platform/version combination has passed runtime testing. The build checks Java 25 bytecode, Spigot 26.1 compilation, separate Paper and Spigot 26.3 compilation, and the packaged distribution.

The October 17 distribution removes the built-in Volmit tracking integrations and their producer build dependencies. The generic module API, atomic batches, controls, and persistence remain available. Its full build passes 395 unit tests, five packaged-JAR tests, Java 25 checks, and both Paper/Spigot 26.3 compiler gates. The JAR is 1,174,241 bytes with SHA-256 `9D4CFD1223138878C495B7EEE36D527C0F932F2E7A7891AB3A2FA521DC31CEFE`. Gameplay was not rerun for this removal; earlier runtime evidence applies only to its recorded artifacts.

The earlier module artifact `40ADA0EFD69DFD60FD17E9961500B032016DDADF478AF4B13AEF2ECA92794538` passed 28 gameplay checks on Paper 26.1.2 build 74 and Folia 26.1.2 build 8 across initial startup and restart, using bot protocol 26.1. These cover provider registration, module types, exact values, player controls, permissions/privacy, recording policy, lifecycle, persistence, consumption, shearing, cancellation, and collection filters. Enchanting and taming have event-level unit coverage. Evidence is retained locally under `Static/build/qa/modules-20261016/`. Both temporary instances were stopped, process-checked, and deleted; all viewer feeds are closed.

The earlier October 14 distribution passed 355 tests and the selected workspace build. Its SHA-256 is `CB98B1A626F3C8C4FC11ACEC97E8896E58BB1EA6600DBB1F7CDA0FF94594848F`; the broader runtime results below apply to that artifact.

Spigot 4632, Paper 74, Purpur 2592, Leaf 3, Folia 8, and Canvas 876 on Minecraft 26.1.2 / Java 25 pass 96 gameplay checks across first startup and restart, using bot protocol 26.1. Paper 26.3 build 181 passes 24 console checks, including downloading a language and switching back to English. All seven targets reuse unchanged library caches on restart. Test instances were stopped and deleted; viewer sessions are closed.

Evidence is retained locally under `Static/build/qa/Suite-CB98B1A626F3/`. The actual bot connection to 26.3 failed before joining with `unsupported protocol version: 26.3`; its results prove server and console behavior only. Expanded-dashboard browser acceptance, real-client rendering, and fluent translation review remain open. The published German catalog still uses English for its invalid milestone heading until the corrected catalog is published.

[Installation and configuration](/static/01-installation-configuration) · [API and placeholders](/static/90-api-placeholders)
