---
title: "BileTools — Hot Reload Behavior"
description: "What hot-reload does, what it cannot do, and how to tell when it failed"
published: true
date: 2026-08-22T00:00:00.000Z
tags: "biletools"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
BileTools watches the server's `plugins/` folder. Adding, replacing, or deleting a jar loads, reloads, or unloads that plugin after the file stops changing.

Dependencies reload in the correct order. Manual `/bile load`, `/bile unload`, and `/bile reload` commands run immediately.

## When to restart

Hot reload cannot safely clean up every plugin. Restart the server if you see duplicate listeners or commands, stale behavior, growing memory use, or an incomplete reload.

Plugins that keep static state, leave threads running, hold server-internal references, or register packet hooks are poor reload candidates. BileTools ignores several common examples by default.

Paper plugin dependency ordering cannot be recreated perfectly at runtime. Use a clean restart before production testing.

## Platform notes

Folia is supported when the plugin being reloaded also supports Folia. On Spigot, the target plugin must support Spigot.

## Exclude plugins

Add plugin names to `watcher.ignore`, or use `watcher.only` as an allowlist. Manual commands bypass both lists.
