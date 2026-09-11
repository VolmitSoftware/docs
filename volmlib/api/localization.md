---
title: "Shared localization"
description: "Language downloads, server defaults, player preferences, and the in-game picker"
published: true
date: 2026-09-11T01:50:00.000Z
tags: "volmlib, api, localization"
editor: markdown
dateCreated: 2026-09-02
---

Volmit plugins share language downloads and player preferences through VolmLib. English message catalogs remain compiled into each plugin; bulk translation files stay in the source repository and download when requested. Each plugin retains its own message schema and validates translations before activation.

## Per-plugin language selection

Each plugin's `/[plugin] language` command opens its language controls. The `self` scope changes one player's choice; `server` changes that plugin's default.

| Command | Result |
|---|---|
| `/adapt language` | Open Adapt's language picker |
| `/adapt language self fr_FR` | Save French for the current player in Adapt |
| `/biletools language self reset` | Remove the caller's BileTools override and follow its server default |
| `/iris language server de_DE` | Set German as Iris's server default |
| `/sp language self en_US` | Select English for the current player in ShapedPortals |
| `/sp language server edit` | Open ShapedPortals' locale list in the inventory editor |
| `/iris language server edit fr_FR` | Edit Iris's French messages without changing language selections |

Every Bukkit provider accepts `/[plugin] language self <locale|reset>` and `/[plugin] language server <locale>`.

Personal selection requires both `volmit.language.self` and the selected plugin's permission below. All personal language permissions default to `true`. Denying either permission blocks the personal picker, direct locale selection, and `self reset`.

| Bukkit plugin | Personal language permission |
|---|---|
| Adapt | `adapt.language.self` |
| BileTools | `biletools.language.self` |
| Gloss | `gloss.language.self` |
| HiddenOre | `hiddenore.language.self` |
| Iris | `iris.language.self` |
| React | `react.language.self` |
| Rift | `rift.language.self` |
| ShapedPortals | `shapedportals.language.self` |
| Wormholes | `wormholes.language.self` |

Server selection requires `volmit.language.admin` (default `op`) or the selected plugin's existing server-language administration permission. Console senders can change server defaults. Iris on Fabric, Forge, and NeoForge retains its native permission model; Bukkit permission nodes do not apply there.

## Per-language message editor

Every Bukkit plugin provides `/[plugin] language server edit [locale]`. Omitting the locale opens a language list; specifying one opens its messages. The server-language picker also has editor links. Editing requires the same server-language administration permission as selection, or `volmit.language.admin`; personal language permissions do not grant editing access.

The editor groups messages by ID and shows 45 message entries per page by default. Adapt uses 36 left-aligned entries across the first four rows, with skill and adaptation icons from its gameplay menus. Search and navigation remain available in both layouts. Select a text message to replace it through private chat. Multiline and plural messages open one line or form at a time. Use `\n` for a newline, `\\` for a literal backslash, or `cancel` to stop; the TOML codec preserves that distinction when the edited catalog is read again. Input is limited to 512 characters and expires after 60 seconds.

Shared English editor chrome uses classic ampersand formatting. Plugin catalogs may override it with any formatting accepted by their renderer. Translation completeness checks should require every shared string containing natural-language text to be translated while allowing formatting-and-placeholder-only layouts to remain language-neutral.

Inventory titles resolve `language.editor.title`, whose shared default is `{plugin} › {section}`, and strip formatting so Minecraft applies its native container-header text color. Plugin catalogs can override that template to use an editable name. The plugin's Director theme continues to color chat and item text.

When a plugin overrides a shared message definition, the switcher and editor use serialized MiniMessage from its configured `DirectorTextResolver` if direct snapshot resolution cannot apply that definition. This preserves custom placeholders and formatting, including editable prefixes, with the viewing player's language context active. Missing definitions still use shared English defaults. Shared feedback parses template formatting before substituting untrusted values, strips section color codes from those values, and applies its theme without parsing the rendered text again.

The editor validates message shape, variables, and file format before saving. It rejects stale or invalid edits. Saving refreshes users of that locale without changing server or personal language choices. If Folia retires a player or rejects an editor continuation, VolmLib discards the associated prompt, pending work, and menu ownership instead of leaving a stale session. During plugin disable, open editor inventories are closed on their player owners before the owning plugin becomes unavailable; this does not depend on another Volmit plugin remaining enabled.

Adapt, BileTools, Gloss, HiddenOre, React, Rift, ShapedPortals, and Wormholes edit `languages/<locale>.toml` directly. These plugins generate an editable `en_US.toml` file on startup when it is missing and preserve existing files. Repository catalogs, generated English, and editor saves use grouped TOML sections. Their translated headers follow the same order: file editing, prefix, formatting, and variable definitions. ShapedPortals also provides a Languages tile in its configuration GUI. Iris retains its JSON locale editor. English editing works offline. The inventory frontend applies to Bukkit-family servers; Iris mod loaders retain their native command interface.

## Shared plugin tools

`/volmit plugins` opens the shared language and diagnostic tools. The menu lists the providers currently registered with Bukkit.

### Server defaults across plugins

`/volmit plugins languages` opens a shared locale picker for every enabled language provider. `/volmit plugins languages <lang>` changes all of their server defaults to that locale. For example, `/volmit plugins languages de_DE` selects German across the registered plugins. This command preserves every player's personal overrides; players with an override continue using it until they change or reset that plugin's own preference.

The picker offers only locales available to every enabled provider. Access requires `volmit.language.admin` or each provider's server-language permission. A denied permission leaves all defaults unchanged. Catalog failures fall back to English for that provider without undoing successful selections elsewhere.

## Unavailable downloads

If a plugin's catalog loader reports a preparation failure, the shared service uses built-in English for the requested scope and saves `en_US`. A loader may instead supply an English-backed snapshot for the requested locale. Missing or invalid entries in a successfully loaded snapshot do not change the selected locale. Invalid command syntax and unknown locales do not change the selection.

Preference or server-default write failures remain errors. A rejected edit never installs partial messages.

## Persistence and rendering

The default preference store writes UUID choices to the path supplied by the plugin. Adapt, BileTools, Gloss, HiddenOre, React, Rift, ShapedPortals, and Wormholes use `languages/language-preferences.properties`. A plugin may supply another `LanguagePreferenceStore`, such as Foundation's JSON-backed store. A locale is prepared before the choice is written. Resetting removes the personal choice.

Rendering uses immutable snapshots. An uncached personal locale loads asynchronously, with the server language used until it is ready. Missing messages use English. Console and global output use the server default.

## Download and packaging contract

`RemoteLanguageCatalog` reads a small properties manifest containing `revision`, comma-separated `locales`, and optional `sha256.<locale>` checksums. Its `Options` supplies the product name, repository URL, source directory, extension, manifest resource, and resource class loader. The plugin supplies a destination file and a parser-backed validator for each installation. Build tasks exclude bulk translation resources from distributable jars while retaining the manifest.

`readOrInstall` installs a missing editable language file and validates an existing file without replacing it. This method blocks and belongs on a worker, never a gameplay thread. `requestInstallIfMissing` schedules asynchronous installation only when the destination is missing. Downloads have timeouts, size limits, strict UTF-8 decoding, validation before publication, atomic file publication, and a retry cooldown. Installed files work offline. Invalid downloaded content is rejected before publication; an interactive preparation failure selects validated built-in English for the requested scope.

Translation completeness is separate from file validity. Adapt, BileTools, Gloss, HiddenOre, React, Rift, ShapedPortals, and Wormholes accept partial catalogs and retain valid translations when another entry has an invalid type, placeholder set, or message format. Missing or rejected entries resolve through English. Transport failures, invalid UTF-8, and unreadable document syntax remain file-level failures.

The shared selection service accepts these partial snapshots without changing the selected locale to `en_US`. Server defaults and personal preferences retain the requested locale even when some messages resolve from English.

Downloads stage validated bytes outside the publication lock. Final editable-file installation checks the captured catalog lifecycle under that lock. `close()` invalidates pending publication without waiting for a network fetch or validator to finish; a request that completes afterward cannot install its file or deliver a success callback. A file whose publication finished before closure remains installed.

## Service integration

`LocalizationValidator.validValues(catalog, overlay)` returns the known entries that satisfy the catalog's message shapes, required and optional variables, line structure, and plural forms. Runtime loaders can pass this filtered overlay to `LocalizationSnapshot.create` for per-message fallback. `LocalizationValidator.validate` and snapshot creation remain strict for callers that need rejection, including editor validation. Parsers must discard malformed values individually before constructing their `TextValue`, `LinesValue`, or `PluralValue`.

`TomlLanguageParser.parseValidValues(raw, catalog)` reads grouped text, line-list, and plural messages and filters individual entries against the catalog. `parseValidText(raw, catalog)` returns the text entries only. Both skip unknown keys, wrong value shapes, malformed placeholders, and placeholder mismatches, preserve valid strings including empty decorative prefixes, and throw for unreadable TOML. The existing `parseText` methods retain strict type checking for validation workflows.

`TomlLanguageWriter.render(values, headerLines)` serializes typed messages under shared TOML sections with short assignment keys; `renderText` and `renderJson` accept string maps and parsed objects. A scalar message and its child messages can coexist using quoted relative keys in their nearest shared section. `LanguageReferenceRenderer.render` uses the same writer for code-owned English. `LanguageFileHeader.render(Options)` produces localized section labels, editing instructions, prefix and formatting guidance, and sorted per-variable definitions supplied by the plugin.

Construct `PluginLanguageService` with typed `Options`: a `LanguagePreferenceStore`, locale supplier, current default locale and snapshot suppliers, a `SnapshotLoader`, a `DefaultSelection` writer, and a logger. The convenience constructor accepting a preference path uses `PropertiesLanguagePreferenceStore`. The loader returns a complete validated snapshot; the writer persists the plugin's default and installs the prepared snapshot. Selection work runs on the service's worker. `selectDefault(...)` and `selectPlayer(...)` complete their `CompletableFuture<Void>` after applying and saving the requested locale or validated English fallback. A normal completion may therefore represent an English fallback. Closing the service marks it closed and interrupts its worker before waiting for the serialized commit boundary, so an interruptible default writer cannot deadlock shutdown; a writer that has already committed still retains its completed result.

Use `snapshot(UUID)` for a known recipient, or `snapshot()` inside `LanguageAudience.run`, `call`, or an `open` scope. Scopes restore the previous audience even when an action fails. Shared entity scheduling and inventory callbacks establish their player's audience. Explicitly scope custom command dispatch, menu construction, and other deferred player rendering too. Use `invalidate()` after reloading overlays and `cache(locale, snapshot)` after editing an already prepared locale.

`commitUpdate(CommitUpdate<T>)` serializes a plugin-owned configuration or catalog publication with default-language selection and service closure. Its callback can return a value or throw `IOException`. Acquire this boundary before plugin-owned language locks, and keep file preparation on a worker when the callback performs I/O. Do not wait for queued selection futures inside the callback: those selections need the same commit boundary to finish.

On Bukkit platforms, `BukkitLanguageSwitcher.register(plugin, service, options)` registers the provider, player-join listener, and inventory editor. Its typed `Options` contains the plugin's root command without a slash, administration permission, existing `DirectorMiniMenu.Theme`, current `DirectorTextResolver`, and `PluginLanguageEditor.Options`. Plugins may also supply `LanguageEditFeedback` to replace the default framed save result with one plugin-owned `ComponentText`; the callback receives a typed `LanguageEditChange` containing locale, key, previous value, and new value. The switcher derives the personal permission from the lowercase plugin name followed by `.language.self` and registers it with default `true` when the plugin descriptor does not already define it.

`PluginLanguageEditor.Options` supplies a preparation-only `SnapshotLoader` and a `MessageWriter`. The writer receives an `Edit` containing locale, key, expected value, and replacement value; it validates and atomically persists the native file, installs a matching active server snapshot, and returns the saved snapshot. The shared editor serializes its asynchronous work, rejects stale values, and refreshes personal caches after saves. `LanguageFileEditor.update` provides strict UTF-8, size bounds, regular-path checks, external-write detection, and atomic file publication around a typed preparation callback. The switcher closes its editor during shutdown.

Plugins can pass a fourth `BukkitLanguageEditorPresentation` argument to `BukkitLanguageSwitcher.register` to choose the editor layout and message icons. `Layout.CENTERED` uses centered categories and 45 message entries per page; `Layout.FOUR_ROWS` uses 36 left-aligned category or message entries in the first four rows. The icon resolver receives a category or full message ID and returns an optional item stack; the editor clones it before applying localized names and lore, preserving custom-model metadata. Empty results use the standard category or paper icon, and navigation remains on the bottom row.

`TomlLanguageEditor.upsert` accepts typed text, line, and plural values and preserves literal dotted message IDs. Serialization uses the grouped writer, retains leading instructions and unrelated file values, and preserves plural table boundaries. Removing a scalar message preserves independent child message IDs.

Plugins using `ConfigHotloadEngine` can wrap an internal file save in `write(file, FileWrite<T>)`. The callback returns `Written<T>(content, value)` after committing the bytes; the engine records those bytes and returns the value. The transaction serializes with hotload application for that file, suppresses notifications for the plugin's own write, and invalidates older captured snapshots. `StableContentSnapshot` contains the file, signature, normalized content, and `selfWriteRevision`; apply snapshots returned by the engine without replacing their revision. `noteSelfWrite(file, content)` acknowledges an already completed write but does not serialize the preceding file operation. Release application locks before invoking callbacks that acquire a language-service commit boundary.

Call `configure(pollIntervalMs, hotloadCooldownMs, watchedFiles, watchedDirectories)` when initializing the watch set; it resets tracked contents and establishes a baseline from disk. After settings change, use `updateTiming(pollIntervalMs, hotloadCooldownMs)` to adjust scan cadence and the cooldown without replacing that baseline, pending edits, queued snapshots, or self-write revisions. Both timing values have a 100 ms minimum. The next poll reconciles the existing watch set; the new cooldown applies from the previous completed application or emission rather than starting a new cooldown window. The consuming plugin remains responsible for scheduling polls at its configured interval.

While language providers are registered, the shared switcher automatically maintains one `/volmit` command for `/volmit plugins`, `/volmit plugins languages [lang]`, and `/volmit plugins debug [plugin] [upload=true|false]`. If the owning plugin closes, ownership passes to another registered provider; no additional command configuration is required. Language and debug providers use separate service protocols, so a plugin's debug report remains discoverable without coupling it to another plugin's locale implementation.

The plugin owns its local language command registration. `open(sender)` opens its picker; `command(sender, arguments)` and `complete(sender, arguments)` handle the arguments after `language`. Route this subcommand before a root administration check so players can reach their personal preferences. Providers exchange only JDK types through Bukkit's services registry, so separately relocated VolmLib copies can coordinate without sharing plugin classes. Close both the switcher and service during shutdown.

Platform-neutral consumers such as Iris modded adapters can use `PluginLanguageService`, `LanguageAudience`, and `RemoteLanguageCatalog` without loading the Bukkit switcher.
