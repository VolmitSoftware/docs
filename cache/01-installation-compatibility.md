---
title: "Cache: Installation and compatibility"
description: "Java 25 or newer, dependency loading and Minecraft 26.1 through 26.3 support"
published: true
date: 2026-11-06T12:00:00.000Z
tags: "cache, installation, compatibility, operations"
editor: markdown
dateCreated: 2026-10-14T12:00:00.000Z
---

<nav class="doc-breadcrumb" aria-label="Breadcrumb"><a href="/cache">Cache</a><span aria-hidden="true">/</span><span aria-current="page">Installation and compatibility</span></nav>

Cache supports Minecraft 26.1 through 26.3, including their patch releases, on Java 25 or newer. It checks both versions before loading runtime dependencies and rejects Minecraft versions outside that range and Java versions older than 25. The plugin descriptor declares minimum API 26.1.

## Install

1. Stop the server and back up its plugin data.
2. Place the Cache distribution jar in `plugins/`, replacing the previous jar, and select Java 25 or newer.
3. Provide network access for the first dependency download. Install Vault and an economy provider for priced kits or money rewards; PlaceholderAPI is optional.
4. Start the server and inspect Cache's startup output. Run `/cache status`, then open `/cache config`.

The six-row startup splash shows Cache's name, version, authors, server/support range, Java and date. Disable it through `presentation.splashScreen` if desired. Use `/cache debug version` for the installed version and `/cache debug dump upload=false` for a local diagnostic report.

## Runtime dependencies

The distribution carries the plugin classes and a SlimJar bootstrap. SlimJar downloads the required libraries into `plugins/Cache/.libs/` on first start and reuses them on later starts. A library download failure prevents normal startup. Language downloads are separate: a translation download failure keeps English active.

## Server software

| Server | Notes |
|---|---|
| Spigot | Supported for 26.1 through 26.3 |
| Paper, Purpur and Leaf | Supported for 26.1 through 26.3 |
| Folia | Region and entity scheduling; command rewards are refused and economy paths need opt-in |
| Canvas | Scheduler capabilities are detected at startup |
{.dense}

## Platform differences

Inventory and menu work uses the player's owning scheduler. Folia refuses console-command rewards and disables economy paths unless `claims.allowEconomyOnFolia` is enabled with a compatible provider. Captured item serialization can differ between versions and server platforms.

## Building from source

Use Java 25 and the repository's Gradle wrapper:

```powershell
.\gradlew.bat build buildSwiftSwamp
```

The build resolves a sibling VolmLib checkout automatically, compiles against each supported API target, shrinks the distribution and verifies packaging. The versioned artifact is `build/libs/cache-1.0.0-26.1-26.3.jar`; successful staging writes `../BUILDS/Cache.jar`. Use `-PbuildsDirectory=<path>` to override staging.

## Related pages

- [Commands *Status, settings and diagnostics*](/cache/02-commands-permissions)
- [Configuration and languages *Local files and download fallback*](/cache/05-configuration-languages)
- [Feature reference *Capabilities and where to use them*](/cache/07-feature-map)
{.links-list}
