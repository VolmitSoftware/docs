---
title: "HiddenOre: Installation"
description: "Requirements and first-run setup"
published: true
date: 2026-09-20T02:20:00.000Z
tags: "hiddenore, installation"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

| | |
|---|---|
| Server software | Paper, Purpur, or Folia for Minecraft 26.1.2 through 26.2; Paper 26.3 |
| Java | 25 |
| Main command | `/hiddenore` |
| Config file | `plugins/HiddenOre/hiddenore.toml` |
| Optional plugins | PlaceholderAPI, Adapt, Iris |

Folia 26.3 support awaits a published server build.

## Install

1. Put the HiddenOre jar in `plugins/`.
2. Start the server once.
3. Edit `plugins/HiddenOre/hiddenore.toml`.
4. Save, and check the console for validation errors.

Saved edits apply without a restart. An invalid file leaves the previous settings active, so check the console if a change seems to do nothing.

## Next

Decide whether HiddenOre replaces ore drops, adds bonus drops, or leaves vanilla drops alone, and set each ore up in [Configuration](/hiddenore/configuration).

If you run [Iris](/iris), set `hideOresForHiddenOre` on the Iris dimension instead of enabling `[ore-removal]`. See [Iris worlds](/hiddenore/configuration#iris-worlds).

Set the server language with the `language` key, or see [Languages](/languages).
