---
title: "HiddenOre — Installation"
description: "Requirements and first-run setup"
published: true
date: 2026-08-24T00:00:00.000Z
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
2. Restart the server. HiddenOre writes `hiddenore.yml` and `language.yml` on first
   run.
3. Read [Configuration](/hiddenore/configuration) **before** you let players
   mine.

Upgrading is a hard break. Back up any values you need, delete the obsolete
`plugins/HiddenOre/config.yml` file, and restart the server to generate
`plugins/HiddenOre/hiddenore.yml`; deleting the old file removes its local
changes. Reapply required values manually. HiddenOre does not read or migrate
`config.yml`.

The old `locale:` entry in `plugins/HiddenOre/language.yml` is also invalid.
Remove that line, or back up any overrides, delete `language.yml`, and restart to
regenerate it; deleting the file removes its message and sound customizations.
HiddenOre does not migrate the old locale entry.

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

Set `language` at the start of `hiddenore.yml`. Bundled locales: German, Spanish, Finnish,
French, Hebrew, Italian, Japanese, Korean, Lithuanian, Dutch, Polish,
Portuguese, Russian, Turkish, Vietnamese, Simplified Chinese, Traditional
Chinese.

Canonical English lives in
`art/arcane/hiddenore/util/common/Messages.java`. There is no English bundle
file. Entries in `language.yml` are sparse overrides and do not select the
locale. Sound settings live in the
same file.

## Operator logging

HiddenOre runtime diagnostics use the plugin logger and retain the server's `[HiddenOre]` source
label. Normal `INFO` output is limited to dependency bootstrap, an enabled ore-replacement warning
and the BileTools pre-unload drain. Integration registration is a `FINE` diagnostic, while ordinary
mining, reward success and a player's offline reward retirement are silent.

Repeated scheduler and hot-reload handoff failures are grouped by category and emitted at most once
per minute. Integration-event faults and slow listeners retain their existing one-minute throttle.
Caught operational failures keep their stack traces. The only direct console send is the colored,
branded startup splash.
