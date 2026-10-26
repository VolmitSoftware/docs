---
title: Titles compatibility and integrations
description: Supported runtime, placeholders, update checks, and metrics
published: true
date: 2026-10-24T00:00:00.000Z
tags: titles
editor: markdown
dateCreated: 2026-10-15T00:00:00.000Z
---

Titles accepts Minecraft 26.1, 26.2, and 26.3 patch releases on Java 25 or newer. The runtime gate rejects other or unrecognized versions before dependency bootstrap and configuration services initialize. Required libraries bootstrap in the constructor after that check.

## Platforms

Spigot, Paper, Purpur, Leaf, Folia, and Canvas are target platforms. Player operations use the owning entity scheduler where required. Titles uses shared Bukkit/Folia scheduling and does not require a Paper-only display API.

## PlaceholderAPI

PlaceholderAPI is optional. Its registration failure is logged while title management remains available. A chat formatter, tab-list, scoreboard, or hologram plugin must consume the placeholders to display titles outside Titles menus.

| Placeholder | Value |
| --- | --- |
| `%titles_title%` | Selected display with configured wrappers |
| `%titles_raw%` | Formatted display without wrappers |
| `%titles_plain%` | Display without formatting |
| `%titles_id%` | Effective displayed title ID |
| `%titles_owned%` | Accessible title count |
| `%titles_total%` | Player-visible title count |

Values come from cached online-player snapshots refreshed every 20 ticks. Placeholder reads perform no profile-file reads or live permission checks. Timed expiry is applied to cached output and counts; unavailable selections follow the configured fallback policy. Offline or unloaded players return empty title fields and zero counts. Unknown identifiers remain unresolved.

## Plugin API

Plugins can obtain `TitlesApi` through Bukkit ServicesManager for immutable catalog/profile views, asynchronous mutations, retained history, and change subscriptions. Use the separate API artifact as a compile-only dependency and declare a dependency on Titles. See [Public API](/titles/05-public-api) for access boundaries and threading requirements.

## Updates and metrics

GitHub update checks use `VolmitSoftware/Titles` through VolmLib's shared update service. `updateNotifications` controls checks; `titles.update` permits Titles update notifications. The shared language menu exposes update reporting for authorized senders. Updates are notifications, not automatic plugin installation.

Metrics use the official bStats base library. `metricsEnabled` defaults to `true`, but `bstatsPluginId=0` keeps collection inactive until the registered Titles ID is supplied. The shared `plugins/bStats/config.yml` opt-out is honored and its server UUID is retained. Collected values are aggregate server/runtime information and online player count, without names or profile contents.

## Building

From the Titles repository, run `.\gradlew.bat build buildSwiftSwamp` with Java 25. The build checks source tests, API compatibility, packaged contents, and serializers and command metadata in the final JAR. The final distribution stages to `../BUILDS/Titles.jar`; `-PbuildsDirectory=<path>` changes the staging directory.

For a release build, run `.\gradlew.bat buildRelease -PlanguageSourceRef=<40-character-commit-SHA>`. This requires published catalogs matching the local files and the registered Titles bStats ID in the default configuration. Ordinary `build` remains available with an unpublished manifest and inactive metrics.

After publishing the release, `.\gradlew.bat verifyPublishedRelease -PlanguageSourceRef=<commit-SHA> -PreleaseTag=<tag>` checks the stable GitHub release and its `Titles.jar` asset size, URL, and SHA-256 digest against the local build. The tag must match the project version, optionally prefixed with `v`. These tasks do not publish files or register services.

Required libraries must be available in the dependency cache for offline restarts.
