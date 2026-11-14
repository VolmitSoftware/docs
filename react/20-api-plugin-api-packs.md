---
title: "API - Plugin API Packs"
description: "Folder-backed community metric definitions for React"
published: true
date: 2026-09-30T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-28T00:00:00.000Z
---

Plugin API packs add React metrics without Java code. Put each trusted `.toml` file in `plugins/React/plugin-apis/`.

## Install a pack

1. Review its target plugin, versions, sources, and `trusted` setting.
2. Copy it to `plugins/React/plugin-apis/`, or add it in React Web under **Plugins** > **API packs** (see below).
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

`targetVersions` patterns are matched against the `version` in the target plugin's `plugin.yml` or `paper-plugin.yml`. A pack that fails during collection is reported once in the console until it collects successfully again, and the remaining packs keep sampling.

Each metric becomes `plugin-api-<pack-id>-<metric-id>` and is available in monitors, history, React Web, and `%react_sampler.<id>%`.

Use `trusted = true` only for a pack you have reviewed. It allows source types with broader access.

## Manage packs in React Web

Admins see **Plugins** > **API packs** on each server page. The list shows every installed pack with its state, its target plugin and how many of its metrics report. Files that failed to load are listed above it with the reason.

- **New pack** opens an editor with a starting template. **Validate** checks the TOML, and **Install pack** validates again and saves it to the server's pack folder.
- **Edit** opens an installed pack in the same editor; there the last button reads **Save**.
- **Delete** asks before it removes the pack from that server.

In Advanced mode the page also lists every pack metric with its sampler id and whether it is reporting, or why not.
