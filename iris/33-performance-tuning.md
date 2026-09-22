---
title: "Performance Tuning"
description: "Iris documentation: Performance Tuning"
published: true
date: 2026-09-21T08:02:24.888Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Pregenerate your world's playable area before opening it to players. Use [Pregeneration](/iris/07-pregeneration) for the start, status, pause, and stop commands.

Performance and pregeneration settings are in `iris.json`. Stop an active pregeneration before changing settings, and change one setting at a time. The full reference is in [Configuration](/iris/03-configuration).

## Iris settings

| Setting | Default | User effect |
|---|---|---|
| `performance.objectLoaderCacheSize` | `4096` | Larger values reduce repeated loading of objects and images but use more memory |
| `performance.resourceLoaderCacheSize` | `1024` | Larger values reduce repeated loading of pack resources but use more memory |
| `performance.noiseCacheSize` | `1024` | Larger values reuse more terrain samples but use more memory |
| `pregen.saveIntervalMs` | `30000` | Milliseconds between pregeneration saves; shorter intervals save progress more often and increase disk activity |
| `pregen.moddedPregenInFlight` | `0` | Mod loaders only: maximum concurrent chunk requests; `0` selects automatically. Lower values reduce generation concurrency |

Keep `pregen.runtimeSchedulerMode` and `pregen.paperLikeBackendMode` at `AUTO` unless you need a specific supported platform mode.

## Optional vector support

To enable vector support, keep `performance.simdKernels` set to `true` and add this flag before `-jar` in the server's Java command:

```text
--add-modules jdk.incubator.vector
```

The benefit depends on the hardware. Iris also runs without this flag.

## Server configuration

On Paper-compatible servers, chunk worker settings are in `config/paper-global.yml` under `chunk-system.worker-threads`. Restart the server after changing them. Run large pregenerations when player activity is low.

On LEAF 26.2-99 with the faster random generator disabled, set `world-settings.default.settings.entity.shared-random` to `false` in `purpur.yml` before parallel pregeneration, then restart. This prevents duplicate entity UUIDs during generation. Check any world-specific override of this setting.
