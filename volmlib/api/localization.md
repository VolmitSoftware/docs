---
title: "Shared localization"
description: "Language downloads, server defaults, player preferences, and the in-game picker"
published: true
date: 2026-09-03T19:15:00.000Z
tags: "volmlib, api, localization"
editor: markdown
dateCreated: 2026-09-02
---

Volmit plugins share language downloads and player preferences through VolmLib. English message catalogs remain compiled into each plugin; bulk translation files stay in the source repository and download when requested. Each plugin retains its own message schema and validates translations before activation.

## Per-plugin language selection

Each plugin's `/[plugin] language` command opens its clickable language picker. It uses that plugin's existing Director header, colors, hover controls, and pagination. Choose **Your preference** or **Server default**, then a locale. The `self` and `server` scopes apply only to the plugin whose command you ran.

Picker labels use English; Director pagination and plugin messages use the current player's selected locale where translations exist. Tab completion offers `self`, `server`, available locales, and personal reset according to the sender's permissions. A bare language command opens the personal picker for players and the server picker for console senders.

| Command | Result |
|---|---|
| `/adapt language` | Open Adapt's language picker |
| `/adapt language self fr_FR` | Save French for the current player in Adapt |
| `/biletools language self reset` | Remove the caller's BileTools override and follow its server default |
| `/iris language server de_DE` | Set German as Iris's server default |
| `/sp language self en_US` | Select English for the current player in ShapedPortals |
| `/sp language server edit` | Open ShapedPortals' locale list in the inventory editor |
| `/iris language server edit fr_FR` | Edit Iris's French messages without changing language selections |

The other command roots are `/gloss language`, `/hiddenore language`, `/react language`, and `/wormholes language`. Every Bukkit provider accepts `/[plugin] language self <locale|reset>` and `/[plugin] language server <locale>`.

Personal selection requires both `volmit.language.self` and the selected plugin's permission below. All personal language permissions default to `true`. Denying either permission blocks the personal picker, direct locale selection, and `self reset`.

| Bukkit plugin | Personal language permission |
|---|---|
| Adapt | `adapt.language.self` |
| BileTools | `biletools.language.self` |
| Gloss | `gloss.language.self` |
| HiddenOre | `hiddenore.language.self` |
| Iris | `iris.language.self` |
| React | `react.language.self` |
| ShapedPortals | `shapedportals.language.self` |
| Wormholes | `wormholes.language.self` |

Server selection requires `volmit.language.admin` (default `op`) or the selected plugin's existing server-language administration permission. Console senders can change server defaults. Iris on Fabric, Forge, and NeoForge retains its native permission model; Bukkit permission nodes do not apply there.

## Per-language message editor

Every Bukkit plugin provides `/[plugin] language server edit [locale]`. Omitting the locale opens a language list; specifying one opens its messages. The server-language picker also has editor links. Editing requires the same server-language administration permission as selection, or `volmit.language.admin`; personal language permissions do not grant editing access.

The inventory shows 45 entries per page, with search, refresh, back, and page controls. Click a text message to enter its replacement privately in chat. Multiline messages open their individual lines, and plural messages open their individual forms; editing one preserves the others. The prompt shows the current template and its variables; `\n` inserts a newline, `\\` inserts a literal backslash, and `cancel` returns without writing. Input is limited to 512 characters and expires after 60 seconds. Permissions are checked again when input is submitted. The editor supports both the legacy Bukkit inventory-view ABI and Paper's 26.x interface ABI, including creative-mode inventory events.

The editor validates message shape, required variables, and each plugin's format before an atomic save. Stale edits and invalid files are rejected without overwriting them. Installed incomplete catalogs can be edited using English for missing entries; opening the editor never selects a locale or applies selection fallback. Successful edits refresh that locale's personal snapshots and its active server snapshot, while preserving every server and personal language choice. Already-rendered items refresh through their owning feature's normal lifecycle.

ShapedPortals edits `languages/<locale>.toml` and keeps its configuration GUI's Languages tile as another entrypoint. Adapt and React use `languages/overrides/<locale>.toml`; Iris uses `.json`; BileTools, Gloss, and HiddenOre use `.yml`; Wormholes uses `.toml`. These per-locale overrides take precedence over the existing global overrides or downloaded catalogs. English editing works offline. The inventory frontend applies to Bukkit-family servers; Iris mod loaders retain their native command interface.

## Server defaults across plugins

`/volmit plugins languages` opens a shared locale picker for every enabled language provider. `/volmit plugins languages <lang>` changes all of their server defaults to that locale. For example, `/volmit plugins languages de_DE` selects German across the registered plugins. This command preserves every player's personal overrides; players with an override continue using it until they change or reset that plugin's own preference.

The picker and completion offer only locales available to every enabled provider. Access requires the existing `volmit.language.admin` permission (default `op`), or the existing server-language administration permission for each enabled provider. Permissions are checked across every target before selection begins; a denied permission leaves all defaults unchanged. After permission checks pass, each provider prepares its own catalog: providers with an unavailable download use English, while successful providers select the requested locale. Download failures are handled per provider, so they do not roll back successful selections. Personal overrides remain unchanged.

## Unavailable downloads

If a requested download fails, is incomplete, or fails catalog preparation, the selected personal or server scope uses validated built-in English. The selected personal preference or server default is saved as `en_US`. The unavailable locale is never activated or saved, and the command reports that the language is unavailable and English is being used. Invalid command syntax and unlisted locales are rejected without changing the selection.

The fallback applies only to catalog preparation failures. Preference writes, server-default writes, and lifecycle failures remain errors with full console diagnostics. Local override editing and hotload retain their own validation behavior; a rejected edit does not install partial messages.

## Persistence and rendering

Each plugin stores personal preferences by UUID in `language-preferences.properties` under its data directory. Successful selection prepares the complete locale before atomically writing the preference. Server selection updates that plugin's normal language configuration. Player preferences survive disconnects and restarts; resetting a preference removes it from disk.

Rendering reads immutable snapshots without waiting for file or network operations. After restart or plugin reload, an uncached personal locale loads asynchronously, with the server language used until it is ready. Missing translated messages use their English catalog values. Player-specific text follows the current audience; console text and global content without a player audience use the server default. Already rendered items and menus change when their owning plugin rebuilds them.

## Download and packaging contract

`RemoteLanguageCatalog` reads a small properties manifest containing `revision`, comma-separated `locales`, and optional `sha256.<locale>` checksums. The plugin supplies its repository URL, source directory, extension, cache directory, and a parser-backed validator. Build tasks exclude bulk translation resources from distributable jars while retaining the manifest.

`readOrDownload` validates a revision cache and fetches missing or invalid content. `readOrInstall` installs a missing editable language file and validates an existing file without replacing it. Both methods are blocking and belong on a worker, never a gameplay thread. Downloads have timeouts, size limits, strict UTF-8 decoding, validation before publication, atomic file publication, and a retry cooldown. Existing asynchronous request APIs use the same downloader. Installed files work offline. Invalid downloaded content is rejected before publication; an interactive preparation failure selects validated built-in English for the requested scope.

## Service integration

Construct `PluginLanguageService` with typed `Options`: preference path, locale supplier, current default locale and snapshot suppliers, a `SnapshotLoader`, a `DefaultSelection` writer, and a logger. The loader returns a complete validated snapshot; the writer persists the plugin's default and installs the prepared snapshot. Selection work runs on the service's worker. `selectDefault(...)` and `selectPlayer(...)` complete their `CompletableFuture<Void>` after applying and saving the requested locale or validated English fallback. A normal completion may therefore represent an English fallback.

Use `snapshot(UUID)` for a known recipient, or `snapshot()` inside `LanguageAudience.run`, `call`, or an `open` scope. Scopes restore the previous audience even when an action fails. Shared entity scheduling and inventory callbacks establish their player's audience. Explicitly scope custom command dispatch, menu construction, and other deferred player rendering too. Use `invalidate()` after reloading overlays and `cache(locale, snapshot)` after editing an already prepared locale.

On Bukkit platforms, `BukkitLanguageSwitcher.register(plugin, service, options)` registers the provider, player-join listener, and inventory editor. Its typed `Options` contains the plugin's root command without a slash, administration permission, existing `DirectorMiniMenu.Theme`, current `DirectorTextResolver`, and `PluginLanguageEditor.Options`. The switcher derives the personal permission from the lowercase plugin name followed by `.language.self` and registers it with default `true` when the plugin descriptor does not already define it.

`PluginLanguageEditor.Options` supplies a preparation-only `SnapshotLoader` and a `MessageWriter`. The writer receives an `Edit` containing locale, key, expected value, and replacement value; it validates and atomically persists the native file, installs a matching active server snapshot, and returns the saved snapshot. The shared editor serializes its asynchronous work, rejects stale values, and refreshes personal caches after saves. `LanguageFileEditor.update` provides strict UTF-8, size bounds, regular-path checks, external-write detection, and atomic file publication around a typed preparation callback. The switcher closes its editor during shutdown.

`TomlLanguageEditor.upsert` accepts typed text, line, and plural values and preserves literal dotted message IDs. Native serialization retains plural table boundaries and unrelated file values.

While language providers are registered, the shared switcher automatically maintains one `/volmit` command for `/volmit plugins languages [lang]`. If the owning plugin closes, ownership passes to another registered provider; no additional plugin configuration is required.

The plugin owns its local language command registration. `open(sender)` opens its picker; `command(sender, arguments)` and `complete(sender, arguments)` handle the arguments after `language`. Route this subcommand before a root administration check so players can reach their personal preferences. Providers exchange only JDK types through Bukkit's services registry, so separately relocated VolmLib copies can coordinate without sharing plugin classes. Close both the switcher and service during shutdown.

Platform-neutral consumers such as Iris modded adapters can use `PluginLanguageService`, `LanguageAudience`, and `RemoteLanguageCatalog` without loading the Bukkit switcher.
