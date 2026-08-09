---
title: BileTools — Installation
description: Setup and safe use of BileTools
published: true
date: 2026-08-09T00:00:00.000Z
tags: biletools, installation
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

> **BileTools is a development tool.** It watches the plugins directory and reloads jars that
> change on disk, and its commands can delete plugin jars outright. Do not install it on a
> production server, and do not grant `bile.use` to anyone you would not give console access.

## Requirements

| | |
|---|---|
| Java | 25+ |
| API | Paper 26.2 |
| Server software | Paper, Purpur, Leaf, Folia, or Canvas; Spigot best-effort |

## Install

1. Drop `BileTools-x.x.x.jar` into `plugins/`.
2. Restart the server.
3. Build a plugin into `plugins/` and watch it load without a reload.

## Hot-reload limits

Hot-unload is best-effort on every platform. Java class unloading is not guaranteed, and a
plugin that registers static state, spawns its own threads, or holds NMS references may leave
residue behind after an unload.

Symptoms of a failed unload are duplicated event handlers, stale command registrations, and
climbing memory across reloads. When you see those, restart. Hot reload is a convenience for
iteration, not a substitute for a clean boot before testing anything seriously.

### Folia and Canvas

Third-party plugins that do not declare `folia-supported` are subject to the same regionized
scheduling constraints as any other Folia plugin. BileTools routes player sounds and messages
that touch entities through the entity scheduler, and runs lifecycle mutations on the global
region scheduler.

## Language

Set `locale` in `language.yml`. Bundled locales: German, Spanish, Finnish, French, Hebrew,
Italian, Japanese, Korean, Lithuanian, Dutch, Polish, Portuguese, Russian, Turkish,
Vietnamese, Simplified Chinese, Traditional Chinese. English is defined in code.
