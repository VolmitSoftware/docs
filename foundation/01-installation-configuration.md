---
title: "Installation and Configuration"
description: "Foundation requirements, the TOML settings, the worth catalog, and the in-game editor"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "foundation, installation, configuration"
editor: markdown
dateCreated: 2026-08-28T00:00:00.000Z
---

## Requirements

| Item | Value |
|---|---|
| Java | 17 or newer, subject to the server version's own requirement |
| Servers | Paper, Spigot, and Folia on Minecraft 1.20.1 through 26.x |
| Folia | Supported |
| Required plugins | None |
| Optional plugins | Vault, PlaceholderAPI, Adapt, and Wormholes |

Put the Foundation jar in `plugins/` and start the server. Foundation creates `plugins/Foundation/foundation.toml`, `worth.toml`, `languages/en_US.toml`, and its data directories.

Foundation downloads Gson, Toml4j, and Adventure on first start instead of bundling them, so that start needs outbound HTTPS access to Maven Central.

## Configuration lifecycle

Edits to `foundation.toml` reload automatically while `runtime.hotReload` is on. An invalid edit is rejected and the current settings stay active.

If `foundation.toml` is invalid at startup, Foundation falls back to `foundation.toml.last-good` and logs the failure. If neither file is valid, Foundation does not enable.

Sound and particle settings accept namespaced registry keys such as `minecraft:block.amethyst_block.chime` and `minecraft:end_rod`, or the uppercase Bukkit constant names `BLOCK_AMETHYST_BLOCK_CHIME` and `END_ROD`. Particles must use the `Void` data type.

`branding.splashScreen` prints the startup banner. It reports `READY` when every enabled module started, and `DEGRADED` with the active and available module totals otherwise.

`playerData.maximumNameIndexProfiles` bounds the offline-player name index from 100 through 1,000,000 profiles and defaults to 100,000. Changing it rebuilds the index in the background.

`warps.requirePerWarpPermissions` is off by default, so `foundation.warp.use` reaches every shared warp. Turning it on filters warp use, listing, and completion through `foundation.warp.<lowercase-name>` or `foundation.warp.*`. Management completion stays unfiltered so operators can still edit every warp.

## Languages

The top-level `language = "en_US"` key sets the server default. Personal choices are stored in `languages/language-preferences.json`, with `.last-good` kept alongside it.

Message values accept MiniMessage, legacy `&` codes, `&#RRGGBB`, and escaped line breaks. The `#35E0A1` primary and `#47A7FF` secondary tokens follow your configured branding colors at render time.

See [Languages](/languages) for the picker, the locale list, permissions, and the message editor.

## Worth catalog

`worth.toml` holds item prices, separately from the economy settings, and reloads on its own. The generated catalog lists every non-air, non-legacy item the running server exposes, filed under building, natural, minerals, food, drops, tools, armor, transport, magic, decoration, or miscellaneous.

Up to 17 common commodities get a positive default price. Everything else starts at `0` and is unsellable, including spawn eggs and operator-only items. Prices are capped at `1,000,000,000,000`.

Identifiers belonging to a newer server version are kept in their category and ignored for sales rather than erased. An invalid `worth.toml` falls back to `worth.toml.last-good`; if both are invalid Foundation keeps a default catalog active in read-only mode rather than overwriting your prices.

## In-game editor

Run `/foundation config`, or open `/foundation` and select **Configuration Editor**. It needs `foundation.admin.config` and can edit:

- boolean toggles;
- bounded numbers, by increment or by typing an exact value;
- enum pickers;
- strings, with `reset` and `cancel`;
- the language, through a click-to-select chat picker;
- text lists, with add, replace, delete, and reorder;
- every scalar and list setting except the read-only schema version.

Chat input expires after 60 seconds. The reload-from-disk tile needs `foundation.admin.reload`; without it the tile names the permission and does nothing.

If the file changes on disk while you are editing, the save is rejected and nothing is written. Reopen the editor after the external change has reloaded, then retry.

## Configuration sections

| Section | Settings |
|---|---|
| `runtime` | Hot reload, poll interval, verbose diagnostics |
| `playerData` | Bounded asynchronous offline-player name indexing |
| `debug` | Enabled-by-default mclo.gs upload for local-first support reports |
| `branding` | Splash toggle, menus, sounds, particles, colors, feedback registry keys, volumes, pitches, and particle count |
| `modules` | One enable switch for every runtime module |
| `commands` | Canonical direct command names to disable independently of their modules |
| `teleport` | Shared travel-engine warmup, cooldown, cancellation and safe-landing policy; request expiry, back-history limits, and opt-in external capture |
| `homes` | Default limit, accepted name expression, default home name |
| `warps` | Disabled-by-default per-warp access filtering |
| `spawn` | Foundation-anchor-only first-join and respawn routing plus the configurable first-join yield |
| `social` | Social spy availability, ignore enforcement, vanished-target policy |
| `utilities` | Maximum speed and world-change flight recheck |
| `economy` | Starting and maximum balance, negatives, currency names, display decimals, the bounded in-memory account cap, leaderboard snapshot/cache limits, and Vault publication mode |
| `playerState` | Automatic AFK delay, activity clearing, persisted vanish |
| `information` | `/near` limits and the editable rules list |
| `integrations` | PlaceholderAPI publication |
| `hud` | Independent title, shared action-bar, boss-bar, timing, and boss-bar color switches |
| `gameplay` | Confirmation lifetime and maximum weather duration |
| `administration` | Mass-teleport cap, sightline distance, `/sudo` length, and blocked command roots |
| `moderation` | Default and maximum durations, warning and reason caps, jailed and muted command allowlists |
| `items` | Grant cap, unsafe-enchantment policy, disposal size |
| `mail` | Mailbox size, message length, join notification |
| `kits` | Kit-count, cooldown, and per-kit non-empty-stack caps plus overflow policy; `maximumItemsPerKit` defaults to 41 and cannot exceed 54 |
| `cosmetics` | Selectable particle list, celebration cooldown, burst count, and spread |

Messages are not in `foundation.toml`; they live in the locale file.

Continue with [Commands and permissions](/foundation/02-commands-permissions).
