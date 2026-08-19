---
title: "HiddenOre — Installation"
description: "Requirements and first-run setup"
published: true
date: 2026-08-19T00:00:00.000Z
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

1. Copy `HiddenOre-x.x.x.jar` into `plugins/`.
2. Restart the server. HiddenOre writes `config.yml` and `language.yml` on first
   run.
3. Read [Configuration](/hiddenore/configuration) **before** you let players
   mine.

## Two decisions to make first

**Generation mode.** You can switch between `seeded` and `pure_random` later.
Seeded vein positions stay stable when you reorder `drops:`. Adding or removing
an unrelated rule leaves retained layouts unchanged except where the rules
overlap. Changing an item rule's material or spatial generation fields changes
its undiscovered layout. Changing only Fortune behavior, tool tiers, or
experience does not.

**Ore removal.** `ore-removal.enabled` is `false` by default. Vanilla ore still
generates. If you set it to `true`, only newly generated chunks change. Existing
terrain keeps its ore.

## Language

Set `locale` in `language.yml`. Bundled locales: German, Spanish, Finnish,
French, Hebrew, Italian, Japanese, Korean, Lithuanian, Dutch, Polish,
Portuguese, Russian, Turkish, Vietnamese, Simplified Chinese, Traditional
Chinese.

Canonical English lives in
`art/arcane/hiddenore/util/common/Messages.java`. There is no English bundle
file. Entries in `language.yml` are sparse overrides. Sound settings live in the
same file.
