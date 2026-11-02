---
title: "Localization"
description: "Iris documentation: Localization"
published: true
date: 2026-11-01T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Set Iris's server language with `general.language` in `iris.json`. Installed translations and custom languages are TOML files under `languages/` in the platform data directory: `plugins/Iris/languages/` on Bukkit-family servers and `config/iris/languages/` on Fabric, Forge, and NeoForge.

See [Languages](/languages) for the picker, permissions, the full locale list, fallback rules, and how to edit or translate messages.

## Language files

English is built in. The 17 other repository locales install on demand from the `master` branch of the Iris repository the first time a player or the server selects them. A configured `general.language` that is not installed yet downloads in the background and Iris reloads its messages when the file lands. Missing or invalid entries use English.

Installed translations merge repository changes at startup and whenever an operator runs `/iris language update`. New and changed messages arrive, keys you edited by hand stay as you wrote them, and retired keys you never touched are removed. `en_US.toml` gains new catalog keys the same way when Iris updates. Checks run at startup and on the update command, at most once per five minutes; a restart or a repeated command inside that window skips the request and the command reports the remaining wait. A check that fails, including one blocked by the GitHub rate limit, leaves the installed files and the selected language as they were. The console logs one line per updated locale with its counts, or one line naming the repository branch and revision when nothing changed.

The pristine copies used for that comparison live in `languages/.upstream/` with the stored revision and check time; leave that directory alone. Iris's own writes there and to installed files do not trigger a settings hot reload.

Any other `languages/<name>.toml` whose name uses 2 to 32 letters, digits, `_` or `-` is a custom language. It appears in the picker and the message editor, and updates never change it. An optional `[meta]` table sets the display name and a locale to use before English for keys the file leaves out:

```toml
[meta]
name = "Pirate Speak"
base = "de_DE"
```

A `base` locale can name its own `base`, up to four levels. Without a `name`, the picker shows the standard locale name, or the file name for a custom language. On Bukkit, `/iris debug dump` reports the selected language, the repository source, the stored revision, and the last check time and error.

## Client language assets

The Minecraft client reads keybind labels from `assets/irisworldgen/lang/<mc_code>.json` inside the mod jar. The server's `general.language` setting does not change these labels. These files define the keybind category and three key names:

| Key | English |
|---|---|
| `key.categories.irisworldgen.iris` | Iris |
| `key.irisworldgen.toggle_pregen_hud` | Toggle Pregen HUD |
| `key.irisworldgen.open_vision_map` | Open Iris Vision Map |
| `key.irisworldgen.toggle_what_overlay` | Toggle Iris What Overlay |

`en_us.json` is required. Every bundled locale has a translated file. The Minecraft code is the server locale id with `-` replaced by `_` and lowercased, so `ja-JP` becomes `ja_jp`.

HUD stats, Vision labels, What overlay text, and notifications use the Iris message catalogs. Translate those through the [Languages](/languages) workflow, separately from Minecraft keybind labels.

## Platforms

Localization uses the same file format and fallback rules on Bukkit-family and Fabric/Forge/NeoForge servers. Available messages depend on the platform. `/iris language update` requires `iris.all` or `volmit.language.admin` on Bukkit and gamemaster level 2 on Fabric, Forge, and NeoForge. Keybind translations apply only where the client mod is installed. See [30 - Platform Differences](/iris/30-platform-differences).
