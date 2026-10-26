---
title: Titles installation and configuration
description: Runtime requirements, configuration files, and title policies
published: true
date: 2026-10-24T00:00:00.000Z
tags: titles
editor: markdown
dateCreated: 2026-10-15T00:00:00.000Z
---

Titles requires Minecraft 26.1 through 26.3 and Java 25 or newer. Install the built `Titles.jar` in the server's plugins directory and restart. VolmLib is included; Gson, TOML, Adventure, and bStats base libraries download during dependency bootstrap. An empty library cache requires network access. Missing required libraries prevent startup; installed libraries can be reused.

## Files

All paths below are relative to `plugins/Titles`.

| Path | Purpose |
| --- | --- |
| `config/settings.toml` | Runtime settings |
| `titles/<id>.toml` | Title definitions |
| `categories/<id>.toml` | Optional category labels, icons, and order |
| `titles-locales/<locale>/<id>.toml` | Partial title translations |
| `category-locales/<locale>/<id>.toml` | Category label translations |
| `languages/<locale>.toml` | Interface translations |
| `languages/language-preferences.properties` | Saved personal language choices |
| `data/players/<uuid>.json` | Selection, colors, favorites, grants, denials, acquisition metadata, initialization state, and operation history |
| `.libs/` | Downloaded runtime libraries and privately relocated copies |

First startup creates an unlocked `adventurer` title and a locked `pathfinder` title. Configuration edits and hot reload validate a complete candidate before publishing it. A failed reload retains the last valid runtime state. Profile writes are asynchronous and atomic; malformed profiles are preserved and rejected.

## Settings

| Setting | Default | Meaning |
| --- | --- | --- |
| `enabled` | `true` | Permit selection/clear and selected-title output |
| `language` | `en_US` | Default interface language |
| `splash` | `true` | Print startup artwork and runtime details |
| `hotReload` | `true` | Watch supported TOML files |
| `selectionCooldownSeconds` | `2` | Delay between successful selections, from 0 to 300 seconds |
| `showLocked` | `true` | Permit discovery of titles visible while locked |
| `allowColors` | `true` | Permit personal color overrides |
| `prefix` / `suffix` | Dark-gray square brackets | MiniMessage wrappers around formatted title output |
| `debugUpload` | `false` | Permit an explicitly requested diagnostic upload |
| `browseSort` | `configured` | `configured`, `name`, `recent`, `favorite`, or `expiry` |
| `defaultTitle` | Empty | Optional title considered once for a new profile |
| `unavailableSelection` | `empty` | `empty` or `fallback` output for an unavailable saved selection |
| `fallbackTitle` | Empty | Existing title ID required by fallback mode |
| `updateNotifications` | `true` | Check GitHub releases and notify permitted operators |
| `metricsEnabled` | `true` | Allow metrics when a registered Titles ID is configured |
| `bstatsPluginId` | `0` | Zero keeps metrics inactive |

Disabling Titles through `enabled` leaves browsing, preview, favorites, and permitted recoloring available. Default selection never grants access. An unavailable preferred title remains saved while an accessible fallback is displayed; restored access restores its output. Explicit clear stays empty. Revocation clears a matching selection.

## Definitions and access

A title contains `id`, `display`, `description`, `category`, `icon`, `permission`, `sortOrder`, `enabled`, `randomReward`, `defaultUnlocked`, `rarity`, `acquisitionHint`, `collectionDescription`, `allowColors`, `colorPermission`, and `visibleWhileLocked`. IDs use 1–64 lowercase letters, digits, underscores, or hyphens, beginning with a letter or digit. The ID must match the filename.

Display text permits 512 characters. Description permits 12 lines of 256 characters. Rarity permits 64 characters; `acquisitionHint` and `collectionDescription` permit 512 each. Permission nodes permit 128 characters. Icons must resolve to non-air item materials. Title categories use stable IDs. Configuration files are limited to 2 MiB, catalogs to 10,000 title files, and serialized profiles to 1 MiB.

An enabled title is accessible through `defaultUnlocked`, a saved grant, an explicitly assigned `titles.title.<id>` node, `titles.all`, or its optional permission. Explicit denial overrides these sources. Timed grant expiry does not remove independent permission or default access. `visibleWhileLocked=false` hides inaccessible titles from public discovery.

Use `/titles config` for settings and catalog editing. Title editors also expose localized text, category data, visibility, and recoloring policy. Personal colors accept one hex color or a two-color gradient, such as `#FFD56A:#F1A43C`.

Open collection browsers and category counts refresh when access changes, including timed expiry, while retaining the current inventory and filters. Hidden favorites use a generic removal control without their display text or description. Typing `cancel` in an input prompt returns to the previous menu when the session, permissions, and configuration remain valid. Input from a replaced prompt or an earlier menu is discarded.

## Saved operation history

Each player profile retains the latest 256 accepted explicit selection, grant, and revocation operations. Profile changes and their receipts are saved together atomically before success is reported. A receipt records the operation ID, player UUID, title ID, action, expiry, actor, source, reason, timestamp, and whether the saved state changed. An accepted operation that leaves state unchanged still receives a receipt.

Default-title initialization, color edits, and favorite edits do not create these receipts. Failed or rejected operations do not appear in history. Use `/titles history <player or UUID> [page]` to read retained entries. See [Commands and permissions](/titles/02-commands-permissions) and [Public API](/titles/05-public-api) for command metadata and integration retries.
