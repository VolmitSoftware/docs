---
title: "API - Plugin API Packs"
description: "Folder-backed community metric definitions for React"
published: true
date: 2026-08-28T07:55:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-28T00:00:00.000Z
---

Plugin API packs add React metrics without Java code. Put each trusted `.toml` file in `plugins/React/plugin-apis/`.

## Install a pack

1. Review its target plugin, versions, sources, and `trusted` setting.
2. Copy it to `plugins/React/plugin-apis/` or add it through React Web.
3. Run `/react plugin-api reload`.
4. Check `/react plugin-api status`.

Invalid edits leave the previous valid pack active.

## Minimal pack

```toml
schema = "react.plugin-api/v1"
id = "community.example"
version = "1.0.0"
name = "Example Metrics"
authors = ["Example Author"]
enabled = true
trusted = false
targetPlugin = "ExamplePlugin"
targetVersions = ["1.*"]

[[metrics]]
id = "players"
displayName = "Players"
kind = "gauge"
unit = "players"
source = "placeholderapi"
placeholder = "%example_players%"
```

Supported sources are:

- React integration metrics already published by the target plugin
- numeric PlaceholderAPI placeholders
- supported Oraxen queries
- public Bukkit event counters

Packs cannot call arbitrary fields or methods.

Each metric becomes `plugin-api-<pack-id>-<metric-id>` and is available in monitors, history, React Web, and `%react_sampler.<id>%`.

Use `trusted = true` only for a pack you have reviewed. It allows source types with broader access.
