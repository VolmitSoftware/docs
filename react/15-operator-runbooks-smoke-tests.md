---
title: "Operator Runbooks & Smoke Tests"
description: "React documentation: Operator Runbooks & Smoke Tests"
published: true
date: 2026-08-25T00:00:00.000Z
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

Edit one reversible setting and confirm it reloads. Invalid TOML must leave the previous working settings active. If React reports that an old task or ticker did not stop during reload, restart the server.

## Destructive test commands

`/react test run`, `/react dev verify`, `/react dev test-all`, and `/react test loadtest` can create entities, generate load, purge data, or alter test areas. Run them only on a disposable world or after making a backup.

## Common checks

- `%react_available%` should resolve when PlaceholderAPI is installed.
- `/react bridge status` shows whether bridge-dependent features can run.
- Named or tamed mobs should remain protected with the default entity settings.
- After changing a performance feature, compare MSPT and behavior before keeping the change.
