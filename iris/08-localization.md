---
title: "Localization"
description: "Iris documentation: Localization"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Iris's server default is the `language` key in `iris.json`. Overrides live in the platform data
directory under `languages/`.

See [Languages](/languages) for the picker, permissions, the full locale list, fallback rules, and how to edit or translate messages.

## Client language assets

The Minecraft client reads its own lang files from `assets/irisworldgen/lang/<mc_code>.json` inside the mod jar. These are not the server catalogs and are not affected by `general.language`. They currently define only the keybind category and the three key names:

| Key | English |
|---|---|
| `key.categories.irisworldgen.iris` | Iris |
| `key.irisworldgen.toggle_pregen_hud` | Toggle Pregen HUD |
| `key.irisworldgen.open_vision_map` | Open Iris Vision Map |
| `key.irisworldgen.toggle_what_overlay` | Toggle Iris What Overlay |

`en_us.json` is required. Every bundled locale has a translated file. The Minecraft code is the server locale id with `-` replaced by `_` and lowercased, so `ja-JP` becomes `ja_jp`.

Everything else the client draws resolves through `IrisLanguage` and `ClientUiMessages` on whichever process renders it. That includes HUD stats, Vision map labels, What overlay rows, and toasts. It does not use these four keys. That is why a translated boss bar and an English keybind label can coexist.

## Platforms

Localization uses the same file format and resolution order on Bukkit-family and Fabric/Forge/NeoForge. Bukkit omits modded and client-only catalog classes. Loader builds register those catalogs during initialization. The modded command tree uses `ModdedCommandMessages`/`ModdedHelpMessages`. The Bukkit tree uses the Bukkit catalogs. Downloaded translations select the active catalog keys. Keybind lang assets apply only where the client mod is installed. See [30 - Platform Differences](/iris/30-platform-differences).
