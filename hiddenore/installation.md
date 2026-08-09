---
title: HiddenOre — Installation
description: Requirements and setup for HiddenOre
published: true
date: 2026-08-09T00:00:00.000Z
tags: hiddenore, installation
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

## Requirements

| | |
|---|---|
| Java | 25 |
| API | Paper 26.1.2 – 26.2 |
| Server software | Paper, Purpur, Folia, or Spigot-compatible |
| Optional | PlaceholderAPI |

## Install

1. Drop `HiddenOre-x.x.x.jar` into `plugins/`.
2. Restart the server. `plugins/HiddenOre/config.yml` and `language.yml` are written on first run.
3. Review [Configuration](/hiddenore/configuration) **before** letting players mine.

## Before going live

HiddenOre changes how mining pays out, and in `seeded` mode it writes discovery state into
chunk persistent data. Two things to settle first:

1. **Pick your generation mode.** Switching between `seeded` and `pure_random` later is safe,
   but reordering the `drops:` list under `seeded` is not.
2. **Decide on ore removal.** `ore-removal.enabled` is `false` by default, meaning vanilla ore
   still generates. Turning it on only affects *newly generated* chunks — existing terrain
   keeps its ore.

## Language

Set `locale` in `language.yml`. Bundled locales: German, Spanish, Finnish, French, Hebrew,
Italian, Japanese, Korean, Lithuanian, Dutch, Polish, Portuguese, Russian, Turkish,
Vietnamese, Simplified Chinese, Traditional Chinese.

English is defined in code rather than shipped as a bundle. Entries you add to `language.yml`
act as sparse overrides; anything omitted falls back to the selected bundle and then to English.

## Reloading

```
/hiddenore reload
```

Re-reads `config.yml` and the language files. If the reload throws, HiddenOre logs it and
keeps the previous runtime configuration active rather than half-applying the new one.
