---
title: "Operator Runbooks & Smoke Tests"
description: "React documentation: Operator Runbooks & Smoke Tests"
published: true
date: 2026-09-10T04:12:59.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Use these checks after installing or updating React.

## Basic health check

1. Start the server and confirm React enables without errors.
2. Run `/react version`, `/react action audit`, `/react integration status`, and `/react bridge status`.
3. Join with `react.use`, enable `/react monitor`, and confirm values update.
4. Open `/react map` and confirm a selected sampler renders.
5. Stop the server normally and check the console for save or shutdown errors.

## Configuration changes

Edit one reversible setting, save its TOML file, and confirm the change applies automatically. Invalid configuration must leave the previous working settings active. File watching runs whenever React is enabled.

For web settings, confirm a valid `web.toml` edit applies while the server is running; an invalid file or failed reconfiguration must leave the previous web runtime available. Toggle `metrics` and confirm reporting starts or stops without restarting. Edit a locale used by a player's personal preference and confirm their next message uses the saved text, even when the server default is another locale.

Enabling `unsafeBytecode` can attach instrumentation live. Attached instrumentation remains until the server JVM restarts. Disable the setting before restarting to prevent React's general agent from attaching again; versioned NMS features can still attach their own instrumentation. If React reports that an old task or ticker did not stop during a lifecycle reload, restart the server.

## Destructive test commands

`/react test run`, `/react dev verify`, `/react dev test-all`, and `/react test loadtest` can create entities, generate load, purge data, or alter test areas. Run them only on a disposable world or after making a backup.

## Common checks

- `%react_available%` should resolve when PlaceholderAPI is installed.
- `/react bridge status` shows whether bridge-dependent features can run.
- Named or tamed mobs should remain protected with the default entity settings.
- After changing a performance feature, compare MSPT and behavior before keeping the change.
