---
title: "Bukkit metrics"
description: "bStats reporting through the shared Bukkit and Folia scheduler"
published: true
date: 2026-10-15T00:00:00.000Z
tags: "volmlib, api, metrics"
editor: markdown
dateCreated: 2026-10-15T00:00:00.000Z
---

`BukkitMetrics` connects the official bStats reporting library to VolmLib's global scheduler. Server data is collected on the Bukkit main thread or Folia global region; bStats handles submission asynchronously.

## Lifecycle

Construct `art.arcane.volmlib.util.metrics.BukkitMetrics` with the owning `JavaPlugin` and its assigned positive bStats service ID. An ID of zero or below is rejected before reading or creating files. Keep an unassigned integration inactive until its ID is available.

`enabled()` reports whether the instance can report. `close()` stops the reporter and prevents queued collection callbacks from touching the server. Repeated close calls are safe. A plugin's live metrics toggle should create or close this instance when its configuration changes.

The constructor reads the shared `plugins/bStats/config.yml`. It respects `enabled: false`, preserves the existing server UUID, and creates a missing UUID only when reporting is enabled. Malformed YAML raises `IOException` without replacing the file. The bStats switches `logFailedRequests`, `logSentData`, and `logResponseStatusText` retain their normal meanings.

## Data and packaging

The collector reports online player count, authentication mode, server name and version, Java version, operating system details, processor count, and the plugin version. It sends no player names, UUIDs, inventories, or world locations.

Consumers provide `org.bstats:bstats-base:3.2.1` at runtime and relocate it into their private library namespace alongside their VolmLib copy. VolmLib declares the dependency as compile-only. The Bukkit-specific bStats wrapper is unnecessary because VolmLib supplies the scheduler and collector.

[VolmLib](/volmlib) · [API overview](/volmlib/api)
