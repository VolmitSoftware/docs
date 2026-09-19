---
title: Static - Compatibility and operations
description: Platform requirements, diagnostics, persistence, and integrations
published: true
date: 2026-09-19T00:00:00.000Z
tags: static, folia, diagnostics
editor: markdown
dateCreated: 2026-09-10T00:00:00.000Z
---

Static compiles against Spigot 1.20.1 and targets Java 17 bytecode. It runs on Spigot, Paper, Purpur, Leaf, Folia, and Canvas. Newer Minecraft servers may require Java 21 or 25 even though the plugin itself targets Java 17.

`/static status` reports the selected scheduling mode and profile count. `/static debug dump upload=false` writes a local diagnostic report. `upload=true` additionally requests publication to mclo.gs when allowed by config. Reports include server diagnostics, effective configuration, locale source state, integration availability, and persistence health. Review a report before sharing it.

`data/players.json` is replaced atomically. Autosave includes the live session's time, and shutdown finishes a final save.

> An invalid existing statistics file stops Static from enabling rather than overwriting player history.
{.is-warning}

PlaceholderAPI and Votifier are optional. A vote's username must match a recorded profile; an unrecognized one is not looked up against Mojang. Static stores profiles per server and does not sync between servers.

[Installation and configuration](/static/01-installation-configuration) · [API and placeholders](/static/90-api-placeholders)
