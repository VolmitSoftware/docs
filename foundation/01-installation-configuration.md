---
title: "Installation and Configuration"
description: "Foundation requirements, typed TOML settings, hot reload, and in-game editor"
published: true
date: 2026-09-06T03:30:00.000Z
tags: "foundation, installation, configuration"
editor: markdown
dateCreated: 2026-08-28T00:00:00.000Z
---

Foundation targets Minecraft 1.20.1 through 26.x on Paper, Spigot, and Folia without NMS or CraftBukkit implementation references. The distributed jar uses Java 17 bytecode; run it with the Java version required by the selected server, such as Java 17 for a 1.20.1 server or Java 25 for a 26.x server. Building the project requires JDK 25 because the verification gate compiles against baseline and current Paper and Spigot APIs, resolves every packaged Bukkit/Paper method and field reference against all four API jars, and rejects class-to-interface linkage mismatches across Foundation and its shaded VolmLib runtime.

## Requirements

| Item | Value |
|---|---|
| Java | 17 or newer, subject to the server version's own requirement |
| Servers | Paper, Spigot, and Folia on Minecraft 1.20.1 through 26.x |
| Folia | Supported |
| Required plugins | None |
| Optional plugins | Vault, PlaceholderAPI, Adapt, and Wormholes |

Put the Foundation jar in `plugins/` and start the server. Foundation creates `plugins/Foundation/foundation.toml`, `worth.toml`, `languages/en_US.toml`, and its data directories as they are needed. Vault, PlaceholderAPI, Adapt, and Wormholes are optional load-order integrations; none is required for Foundation to start.

The distribution uses SlimJar metadata for its Gson, Toml4j, and Adventure runtime libraries instead of embedding duplicate copies. A server starting Foundation for the first time therefore needs outbound HTTPS access to Maven Central unless those artifacts are already present in its SlimJar cache. Repository-language downloads separately require access to GitHub's raw-content host only when an uninstalled listed locale is selected or opened for editing.

The Gradle build provides `build`, `shadowJar`, and `publishToMavenLocal`. A successful build or local publication also stages the inspected shaded plugin as `C:/VolmitSoftware/BUILDS/Foundation.jar` while retaining the versioned artifact under `build/libs/`.

## Configuration lifecycle

`foundation.toml` is a typed, canonical TOML file with a 2 MiB read limit. Changes reload automatically when `runtime.hotReload` is enabled; validation and parsing run away from the gameplay thread, and the accepted result is applied through the server scheduler. An invalid edit leaves the current snapshot active.

`playerData.maximumNameIndexProfiles` bounds the asynchronous offline-player name index from 100 through 1,000,000 JSON profiles and defaults to 100,000. Changing the bound through TOML or the in-game editor schedules a generation-guarded rebuild; gameplay threads never build or wait for this index.

`warps.requirePerWarpPermissions` is disabled by default, preserving access to every shared warp for players with `foundation.warp.use`. Enabling it filters warp use, listing, and player-facing completion through `foundation.warp.<lowercase-name>` or `foundation.warp.*`; management completion remains unfiltered so operators can still replace or delete every stored warp.

Initial startup creates the file when absent. If the primary file is invalid, Foundation tries `foundation.toml.last-good`, republishes the recovered canonical configuration, and logs the complete primary failure. Enablement fails when neither copy is valid. Existing symbolic links and non-regular files are rejected.

Module reconciliation follows the accepted configuration in dependency order. A module that cannot start enters a failed or blocked state and releases the resources from that activation without taking unrelated active modules down.

Sound settings use canonical namespaced registry keys such as `minecraft:block.amethyst_block.chime`; particle settings use keys such as `minecraft:end_rod`. Uppercase Bukkit constant names, including `BLOCK_AMETHYST_BLOCK_CHIME` and `END_ROD`, are also accepted. Configured particles must use the `Void` data type because Foundation does not supply an additional particle payload.

`branding.splashScreen` controls the Volmit-style console splash after configuration has loaded. When enabled, it reports `READY` only if core startup and every enabled module succeeded; otherwise it reports `DEGRADED` with the active and available module totals.

## Languages

The top-level `language = "en_US"` value selects the server default from `languages/<locale>.toml`. Foundation creates the complete English catalog only when `languages/en_US.toml` is absent. The repository contains 17 additional catalogs: `de_DE`, `es_ES`, `fi_FI`, `fr_FR`, `he_IL`, `it_IT`, `ja-JP`, `ko_KR`, `lt_LT`, `nl_NL`, `pl_PL`, `pt_PT`, `ru_RU`, `tr_TR`, `vi_VI`, `zh_CN`, and `zh_TW`.

Gradle derives the supported-locale manifest from those repository TOML files but excludes the translations themselves from the plugin jar. The manifest points at Foundation's `main` branch language directory. Selecting or opening an uninstalled listed locale downloads only that file, validates its bounded UTF-8, TOML, message, formatting, and placeholder contract, then publishes it atomically only if the local file is still absent. Existing local catalogs are never replaced, installed locales continue to work offline, and a failed download creates no partial locale file. A valid custom locale code that is not in the manifest is scaffolded from the English reference when first opened for editing. Missing known entries fall back to code-owned English in memory, while unknown entries remain untouched and are ignored by the current runtime.

Locale files are regular files limited to 2 MiB. Names contain 2–32 letters, digits, underscores, or hyphens and use the exact lowercase `.toml` extension. Hyphen and underscore spellings identify the same locale for selection, so ambiguous duplicate filenames such as `fr-FR.toml` and `fr_FR.toml` are excluded until only one remains. The generated reference groups every runtime message ID into TOML sections and documents formatting plus message placeholders. Values accept MiniMessage, legacy ampersand codes, `&#RRGGBB`, escaped line breaks, and the exact placeholders declared for each message. Formatting belongs to the locale template; player names, typed input, failure details, and other untrusted placeholder values are rendered literally and cannot inject any supported color syntax. The built-in primary `#35E0A1` and secondary `#47A7FF` tokens follow the configured branding colors at render time. Invalid startup content falls back to English and marks language health unavailable. An invalid hot edit, a removed active file, or an edit with missing required placeholders retains the last valid in-memory snapshot.

Players may select an available personal locale without changing the server default; a listed repository locale is installed on its first successful preparation. Preferences are stored by UUID in atomic JSON at `languages/language-preferences.json`; its last valid revision is retained in `languages/language-preferences.json.last-good` and restored when the primary is missing or invalid. If neither copy validates, the store remains read-only so damaged evidence is not overwritten. `reset` returns a player to the server locale. `/foundation language` opens the language tools, `/foundation language <locale>` selects the personal locale for a player or the server locale from console, and the explicit `self`, `server`, and `server edit` forms are documented in [Commands and permissions](/foundation/02-commands-permissions).

A direct personal or server picker request follows the shared VolmLib selection contract: if a listed locale cannot be prepared, that scope selects validated `en_US` and reports the fallback. A language change made through the configuration editor is transactional instead; failed preparation rejects that edit and leaves the existing configuration and active snapshot in place.

The configuration editor's `language` row starts a 60-second chat picker that lists every installed, repository, and valid custom locale as clickable suggestions. Clicking an option consumes the active editor session, prepares an uninstalled locale when necessary, applies the same revision-checked configuration mutation as typed input, and returns to the language setting after completion; typing a listed locale follows that same path. The control center's **Language Studio** opens the personal/server selectors on left click and the 54-slot message editor on right click for an authorized administrator. That editor groups messages by the first key segment, supports 45-entry pages and cross-category search, previews rendered formatting and required placeholders, and commits a chat edit only after placeholder, file, and stale-value validation. Opening a locale for editing does not select it.

Language downloads and file preparation run outside the state lock used to activate a prepared locale or close the language service. Shutdown rejects unfinished preparation, and an older watcher result cannot replace a newer published language edit. Repository translations use the shared ampersand color/reset spelling for language-editor chrome while preserving their translated text; installed operator files are not rewritten.

## Worth catalog

`worth.toml` stores item prices separately from the economy settings. Its generated catalog discovers every non-air, non-legacy item exposed by the running server and arranges it under building, natural, minerals, food, drops, tools, armor, transport, magic, decoration, or miscellaneous. Foundation gives up to 17 conservative commodity entries a positive default when those materials exist on that server version and leaves every other discovered item represented at `0` and unsellable, including spawn eggs and operator-only or unobtainable items. Values are bounded at `1,000,000,000,000`.

The catalog has a 4 MiB limit and reloads independently. Startup and valid hot reloads complete missing current items and atomically write the canonical catalog. Canonical `minecraft:` identifiers that belong to a newer server version are retained in their category, ignored for runtime sales on the current server, and counted in the worth GUI instead of invalidating or erasing the catalog. Known non-item identifiers, duplicate entries, unknown categories, invalid prices, and malformed structure are rejected. An invalid primary uses `worth.toml.last-good`; if both are invalid, Foundation keeps a complete default catalog active in read-only mode rather than overwriting the evidence. A rejected hot reload retains the current catalog.

## In-game editor

Open `/foundation` and select **Configuration Editor**, or run `/foundation config`. The editor requires `foundation.admin.config` and provides:

- boolean toggles;
- bounded numeric increments plus exact chat input;
- enum pickers and typed selection;
- string input with `reset` and `cancel` controls;
- a discovered language picker with typed and click-to-select chat input;
- paged text-list addition, replacement, deletion, and reordering;
- every scalar and list setting except the read-only schema version.

Chat input expires after 60 seconds and returns to its originating editor when that module remains available. While Foundation is preparing its bounded player-data preload, the control center remains informational but module, configuration, language-editing, cosmetics, and worth controls cannot mutate state. Closing an inventory, opening another one, starting another Foundation GUI action, entering the separate language editor, quitting, or shutting the plugin down retires the prior interaction. Delayed clicks from a closed or replaced menu are ignored, and a delayed parse or save result may only send feedback and reopen its menu while it still owns the player's newest interaction generation. Every save rechecks runtime readiness, `foundation.admin.config`, the active configuration revision, and the current disk hash. The editor writes a temporary file, refreshes `.last-good`, replaces the primary, and commits the runtime snapshot. Runtime application is transactional across the active configuration, locale and worth watchers, modules, PlaceholderAPI publication, and profile limits; an exception restores their previous configuration before the edit reports failure. Foundation restores the previous file only while the disk still matches the editor's own write, so it cannot erase a newer external edit.

After candidate validation, the configuration editor checks the disk revision again before writing. An external edit made during validation, including a missing-locale download, rejects the pending save without changing the primary file, its backup, or the active configuration. Reopen the editor after the external change has reloaded before retrying.

The reload-from-disk tile remains visible for orientation but is actionable only with `foundation.admin.reload`; otherwise its lore names the required permission and clicking it does nothing.

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

Language messages are intentionally absent from `foundation.toml`: they belong to the selected locale file. The editor shows the exact required placeholders for each message; translations must retain them for validation to succeed.

Continue with [commands and permissions](/foundation/02-commands-permissions).
