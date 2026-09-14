---
title: Static - Compatibility and operations
description: Platform requirements, diagnostics, persistence, and integrations
published: true
date: 2026-09-14T00:37:05.832Z
tags: static, folia, diagnostics
editor: markdown
dateCreated: 2026-09-10T00:00:00.000Z
---

Static compiles against Spigot 1.20.1 and targets Java 17 bytecode. It uses Bukkit events and VolmLib scheduling to support Spigot, Paper, Purpur, Leaf, Folia, and Canvas where they expose the corresponding Bukkit behavior. Newer Minecraft servers may require Java 21 or Java 25 even though the plugin itself targets Java 17.

Player inventories, sounds, and other player-bound operations run through entity scheduling. Regionized runtimes are detected by capability checks. Background workers process file I/O, ranking calculations, and language downloads; event handlers update UUID-based data without database or network calls.

`/static status` reports the selected scheduling mode and profile count. `/static debug dump upload=false` writes a local diagnostic report. `upload=true` additionally requests publication to mclo.gs when allowed by config. Reports include server diagnostics, effective configuration, locale source state, integration availability, and persistence health. Review a report before sharing it.

Statistics use atomic replacement of `data/players.json`, with forced file contents before publication. Autosave includes live session time, and shutdown finishes a final save. Failed reads or writes emit full console stack traces. An invalid existing statistics file prevents enablement rather than overwriting player history.

The plugin supports installed PlaceholderAPI and Votifier as optional integrations. If either is absent, the remaining plugin features continue. Vote usernames must match a recorded profile; unrecognized users are not resolved through blocking Mojang requests. Static stores server-local profiles and does not synchronize several servers.

[Installation and configuration](/static/01-installation-configuration) · [API and placeholders](/static/90-api-placeholders)
