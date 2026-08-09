---
title: "HiddenOre — Installation"
description: "Requirements and first-run setup"
published: true
date: 2026-08-09T00:00:00.000Z
tags: "hiddenore, installation"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

## Requirements

| | |
|---|---|
| Runtime JVM | Java 25 |
| Paper API | 26.1.2 – 26.2 |
| Server software | Paper, Purpur, Folia, or Spigot-compatible |
| Optional | PlaceholderAPI |

## Install

1. Drop `HiddenOre-x.x.x.jar` into `plugins/`.
2. Restart. `config.yml` and `language.yml` are written on first run.
3. Read [Configuration](/hiddenore/configuration) **before** letting players mine.

## Two decisions to make first

**Generation mode.** Switching between `seeded` and `pure_random` later is safe. Reordering
the `drops:` list under `seeded` is not.

**Ore removal.** `ore-removal.enabled` is `false` by default, so vanilla ore still generates.
Turning it on affects only newly generated chunks — existing terrain keeps its ore.

## Language

Set `locale` in `language.yml`. Bundled: German, Spanish, Finnish, French, Hebrew, Italian,
Japanese, Korean, Lithuanian, Dutch, Polish, Portuguese, Russian, Turkish, Vietnamese,
Simplified Chinese, Traditional Chinese.

Canonical English lives in `art/arcane/hiddenore/util/common/Messages.java`; there is no
English bundle file. Entries in `language.yml` are sparse overrides. Sound settings live in
the same file.
