---
title: "Shared localization"
description: "Language downloads, upstream sync, server defaults, player preferences, and the in-game picker"
published: true
date: 2026-11-01T00:00:00.000Z
tags: "volmlib, api, localization"
editor: markdown
dateCreated: 2026-09-02
---

VolmLib provides language downloads and player preferences for Volmit plugins. English message catalogs are compiled into each plugin. Plugins using remote catalogs download translations from their source repository when requested; plugins on the branch-tracking source also merge later repository changes into installed files. Each plugin defines its message schema and validates translations before activation.

On Paper and Spigot, client command suggestions reflect a shared `/volmit` owner change on the next server tick.

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
| `/sp language update` | Check the ShapedPortals repository and merge changed translations into installed files |

Every Bukkit provider accepts `/[plugin] language self <locale|reset>` and `/[plugin] language server <locale>`. A provider registered with an update action also accepts `/[plugin] language update`, which runs a repository check on a worker and reports the result in chat; ShapedPortals is the first plugin with this subcommand. Running it requires the same server-language administration permission as `server <locale>`, or `volmit.language.admin`.

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

Server selection requires `volmit.language.admin` (default `op`) or the selected plugin's own server-language administration permission. Console senders can change server defaults. Iris on Fabric, Forge, and NeoForge retains its native permission model; Bukkit permission nodes do not apply there.

## Per-language message editor

Every Bukkit plugin provides `/[plugin] language server edit [locale]`. Omitting the locale opens a language list; specifying one opens its messages. The server-language picker also has editor links. Editing requires the same server-language administration permission as selection, or `volmit.language.admin`; personal language permissions do not grant editing access.

The editor groups messages by ID and shows 45 message entries per page by default. Adapt uses 36 left-aligned entries across the first four rows, with skill and adaptation icons from its gameplay menus. Search and navigation remain available in both layouts. Select a text message to replace it through private chat. Multiline and plural messages open one line or form at a time. Use `\n` for a newline, `\\` for a literal backslash, or `cancel` to stop; the TOML codec preserves that distinction when the edited catalog is read again. Input is limited to 512 characters and expires after 60 seconds.

Sending a player command silently cancels pending input, including a reply queued for processing, even if another plugin cancels the command. The abandoned prompt cannot save an edit or reopen its menu. This cancellation does not open or close inventories; an ordinary editor menu with no pending input stays active.

Shared English editor chrome uses classic ampersand formatting. Plugin catalogs may override it with any formatting accepted by their renderer. Translation completeness checks should require every shared string containing natural-language text to be translated while allowing formatting-and-placeholder-only layouts to remain language-neutral.

Inventory titles resolve `language.editor.title`, whose shared default is `{plugin} › {section}`, and strip formatting so Minecraft applies its native container-header text color. Plugin catalogs can override that template to use an editable name. The plugin's Director theme continues to color chat and item text.

Update feedback resolves `language.usage.update`, `language.update.checking`, `language.update.unchanged`, `language.update.applied` with `{locale}`, `{added}`, `{updated}`, and `{kept}`, `language.update.locale-failed` with `{locale}` and `{reason}`, and `language.update.failed` with `{reason}`. Plugin catalogs translate these shared keys like the rest of the picker and editor text.

When a plugin overrides a shared message definition, the switcher and editor use serialized MiniMessage from its configured `DirectorTextResolver` if direct snapshot resolution cannot apply that definition. This preserves custom placeholders and formatting, including editable prefixes, with the viewing player's language context active. Missing definitions still use shared English defaults. Shared feedback parses template formatting before substituting untrusted values, strips section color codes from those values, and applies its theme without parsing the rendered text again.

The editor validates message shape, variables, and file format before saving. It rejects stale or invalid edits. Saving refreshes users of that locale without changing server or personal language choices. If Folia retires a player or rejects an editor continuation, VolmLib discards the associated prompt and pending edit instead of leaving a stale session.

Close the switcher with `closeAsync()` while its plugin remains enabled, and await successful completion before disabling the plugin or releasing its tasks and listeners. The returned future includes editor inventory closures and openings already in progress. `close()` also schedules owner cleanup while enabled, but only logs failure and does not provide a completion barrier. Failed managed closure retains tracked views and click/drag protection for retry or normal player closure. Forced plugin disable has only an owner-only fallback and cannot guarantee closure in other regions. See [inventory shutdown](/volmlib/api/inventory-views#close-menus-before-disabling-a-plugin) for retry and lifecycle requirements.

Adapt, BileTools, Gloss, HiddenOre, Iris, React, Rift, ShapedPortals, and Wormholes edit `languages/<locale>.toml` directly. These plugins generate an editable `en_US.toml` file on startup when it is missing and preserve existing files. Repository catalogs, generated English, and editor saves use grouped TOML sections. Their translated headers follow the same order: file editing, prefix, formatting, and variable definitions. ShapedPortals also provides a Languages tile in its configuration GUI. English editing works offline. The inventory frontend applies to Bukkit-family servers; Iris mod loaders retain their native command interface.

## Shared plugin tools

`/volmit plugins` opens the shared language, diagnostic, and update tools. The menu lists providers registered with Bukkit. `/volmit plugins updates` checks permitted update providers and produces one report; see [GitHub release checks](/volmlib/api/github-releases).

### Server defaults across plugins

`/volmit plugins languages` opens a shared locale picker for every enabled language provider. `/volmit plugins languages <lang>` changes all of their server defaults to that locale. For example, `/volmit plugins languages de_DE` selects German across the registered plugins. This command preserves every player's personal overrides; players with an override continue using it until they change or reset that plugin's own preference.

The picker offers only locales available to every enabled provider. Access requires `volmit.language.admin` or each provider's server-language permission. A denied permission leaves all defaults unchanged. Catalog failures fall back to English for that provider without undoing successful selections elsewhere.

## Unavailable downloads

If a plugin's catalog loader reports a preparation failure, the shared service uses built-in English for the requested scope and saves `en_US`. A loader may instead supply an English-backed snapshot for the requested locale. Missing or invalid entries in a successfully loaded snapshot do not change the selected locale. Invalid command syntax and unknown locales do not change the selection.

Preference or server-default write failures remain errors. A rejected edit never installs partial messages.

## Persistence and rendering

The default preference store writes UUID choices to the path supplied by the plugin. Adapt, BileTools, Gloss, HiddenOre, Iris, React, Rift, ShapedPortals, and Wormholes use `languages/language-preferences.properties`. A plugin may supply another `LanguagePreferenceStore`, such as Foundation's JSON-backed store. A locale is prepared before the choice is written. Resetting removes the personal choice.

Rendering uses immutable snapshots. An uncached personal locale loads asynchronously, with the server language used until it is ready. Missing messages use English. Console and global output use the server default.

## Download and packaging contract

Two language sources exist. The branch-tracking source, made of `LanguageSourceManifest`, `LanguageDirectory`, `GitHubLanguageSource`, `LanguageUpstreamStore`, `LanguageCatalogMerge`, and `LanguageUpstreamSync`, follows a repository branch and merges its changes into installed files; ShapedPortals uses it. `RemoteLanguageCatalog` installs a missing file once from a pinned revision and remains in use by every plugin that has not migrated.

### Branch-tracking source

`LanguageSourceManifest` reads a properties manifest containing `repository` as `owner/name`, `branch`, `path` with the default `src/main/resources/languages`, `extension` with the default `.toml`, and comma-separated `locales`. It rejects `revision`, `mode`, and `sha256.<locale>` keys. `LanguageDirectory` owns the plugin's `languages/` directory: it lists top-level `.toml` files whose stem matches `[A-Za-z0-9_-]{2,32}`, skips symbolic links and files over 2 MiB, and resolves the sidecar directory.

The `languages/.upstream/` sidecar holds the pristine upstream copy of each merged locale, the generated English reference last written, and `upstream.properties` with `repository`, `branch`, `revision`, `etag`, `checked`, and one `sha256.<locale>` entry per stored file. `LanguageUpstreamStore` reads and writes it atomically, and discards stored state whose repository or branch differs from the manifest. Hot-reload scans skip the dot directory. Operators do not edit it.

`LanguageUpstreamSync` checks the repository once at plugin startup and whenever an operator runs `/[plugin] language update`. There is no periodic timer, and startup never blocks on the check. Each check sends one `GET /repos/{owner}/{repo}/commits?sha={branch}&path={path}&per_page=1` request to the GitHub API with the stored etag in `If-None-Match`. A `304` response means unchanged and does not count against the unauthenticated rate limit. The first commit's `sha` becomes the stored revision, and every file is then fetched from `raw.githubusercontent.com` at that revision, so one check yields one consistent snapshot. `403` and `429` responses honour `Retry-After`; other failures log once and set a 30 second cooldown before the next attempt. Requests use a 3 second connect timeout, a 10 second API timeout, a 5 second file timeout, a 2 MiB cap, strict UTF-8 decoding, and no redirects.

A check merges every installed repository locale plus English, whose upstream is the generated reference, so English merges work offline. Missing repository locales still install on demand when selected, from the stored revision. Custom files are never touched by a check. `checkAsync(forced)` returns a future with the per-locale report, `install(locale)` blocks and belongs on the sync worker, `status()` exposes the revision, last check, and last error for diagnostics, and `close()` interrupts the worker.

### Merge rules

`LanguageCatalogMerge` compares the local file, the previous upstream copy from the sidecar, and the next upstream copy key by key against the build's `MessageCatalog`:

| Case | Result |
|---|---|
| Key in next upstream, absent locally | add |
| Local equals previous upstream | take next upstream |
| Local differs from previous upstream | keep local (manual edit) |
| Key in previous upstream but gone from next, local equals previous | remove |
| Local key not in the catalog (`[meta]` table, operator extras) | keep |
| Next upstream entry invalid for this build (bad placeholders, wrong shape) | ignore that entry |

The merged file takes the next upstream's leading comment block and is rendered through `TomlLanguageWriter`. Nothing is written when the merged content equals the local content. The result reports added, updated, kept, and removed counts per locale. Writes go through `LanguageFileEditor.update` inside the service's commit boundary, so a concurrent external edit is detected, and the plugin's self-write listener keeps hot reload from treating the merge as an operator edit.

### Custom language files

Any `languages/<name>.toml` whose stem matches the locale pattern is listed in every picker and the editor. An optional `[meta]` table carries `name`, the display name shown in menus, up to 64 characters, and `base`, another locale layered between the custom file and English. A `base` equal to the file's own locale is ignored; base chains resolve at most four levels deep with a cycle guard. `LanguageMeta.parse` reads the table, and `TomlLanguageEditor.upsert` preserves it on save.

### Pinned source

`RemoteLanguageCatalog` reads a properties manifest containing `revision`, comma-separated `locales`, and optional `sha256.<locale>` checksums. Its `Options` supplies the product name, repository URL, source directory, extension, manifest resource, and resource class loader. The plugin supplies a destination file and a parser-backed validator for each installation.

`mode=remote` downloads missing catalogs from the configured repository; it is also the default when mode is omitted. `mode=bundled` reads `languages/<locale><extension>` from the supplied class loader and never falls back to HTTP. Bundled files use the same size, UTF-8, checksum, validation, and atomic-publication checks. Bundle translations when no public repository is available; remote releases can exclude them while retaining the manifest.

`readOrInstall` installs a missing editable language file and validates an existing file without replacing it. This method blocks and belongs on a worker, never a gameplay thread. `requestInstallIfMissing` schedules asynchronous installation only when the destination is missing. Downloads have timeouts, size limits, strict UTF-8 decoding, validation before publication, atomic file publication, and a retry cooldown. Installed files work offline and are never updated by this source. Invalid downloaded content is rejected before publication; an interactive preparation failure selects validated built-in English for the requested scope.

Translation completeness is separate from file validity. Adapt, BileTools, Gloss, HiddenOre, Iris, React, Rift, ShapedPortals, and Wormholes accept partial catalogs and retain valid translations when another entry has an invalid type, placeholder set, or message format. Missing or rejected entries resolve through English. Transport failures, invalid UTF-8, and unreadable document syntax remain file-level failures.

The shared selection service accepts these partial snapshots without changing the selected locale to `en_US`. Server defaults and personal preferences retain the requested locale even when some messages resolve from English.

Downloads stage validated bytes outside the publication lock. Final editable-file installation checks the captured catalog lifecycle under that lock. `close()` invalidates pending publication without waiting for a network fetch or validator to finish; a request that completes afterward cannot install its file or deliver a success callback. A file whose publication finished before closure remains installed.

## Service integration

`LocalizationValidator.validValues(catalog, overlay)` returns the known entries that satisfy the catalog's message shapes, required and optional variables, line structure, and plural forms. Runtime loaders can pass this filtered overlay to `LocalizationSnapshot.create` for per-message fallback. `LocalizationValidator.validate` and snapshot creation remain strict for callers that need rejection, including editor validation. Parsers must discard malformed values individually before constructing their `TextValue`, `LinesValue`, or `PluralValue`.

`TomlLanguageParser.parseValidValues(raw, catalog)` reads grouped text, line-list, and plural messages and filters individual entries against the catalog. `parseValidText(raw, catalog)` returns the text entries only. Both skip unknown keys, wrong value shapes, malformed placeholders, and placeholder mismatches, preserve valid strings including empty decorative prefixes, and throw for unreadable TOML. The `parseText` methods keep strict type checking for validation workflows.

`TomlLanguageWriter.render(values, headerLines)` serializes typed messages under shared TOML sections with short assignment keys; `renderText` and `renderJson` accept string maps and parsed objects. A scalar message and its child messages can coexist using quoted relative keys in their nearest shared section. `LanguageReferenceRenderer.render` uses the same writer for code-owned English. `LanguageFileHeader.render(Options)` produces localized section labels, editing instructions, prefix and formatting guidance, and sorted per-variable definitions supplied by the plugin.

Construct `PluginLanguageService` with typed `Options`: a `LanguagePreferenceStore`, locale supplier, current default locale and snapshot suppliers, a `SnapshotLoader`, a `DefaultSelection` writer, and a logger. The convenience constructor accepting a preference path uses `PropertiesLanguagePreferenceStore`. The loader returns a complete validated snapshot; the writer persists the plugin's default and installs the prepared snapshot. Selection work runs on the service's worker. `selectDefault(...)` and `selectPlayer(...)` complete their `CompletableFuture<Void>` after applying and saving the requested locale or validated English fallback. A normal completion may therefore represent an English fallback. Closing the service marks it closed and interrupts its worker before waiting for the serialized commit boundary, so an interruptible default writer cannot deadlock shutdown; a writer that has already committed still retains its completed result.

Use `snapshot(UUID)` for a known recipient, or `snapshot()` inside `LanguageAudience.run`, `call`, or an `open` scope. Scopes restore the previous audience even when an action fails. Shared entity scheduling and inventory callbacks establish their player's audience. Explicitly scope custom command dispatch, menu construction, and other deferred player rendering too. Use `invalidate()` after reloading overlays and `cache(locale, snapshot)` after editing an already prepared locale.

`commitUpdate(CommitUpdate<T>)` serializes a plugin-owned configuration or catalog publication with default-language selection and service closure. Its callback can return a value or throw `IOException`. Acquire this boundary before plugin-owned language locks, and keep file preparation on a worker when the callback performs I/O. Do not wait for queued selection futures inside the callback: those selections need the same commit boundary to finish.

On Bukkit platforms, `BukkitLanguageSwitcher.register(plugin, service, options)` registers the provider, player-join listener, and inventory editor. Its typed `Options` contains the plugin's root command without a slash, administration permission, existing `DirectorMiniMenu.Theme`, current `DirectorTextResolver`, and `PluginLanguageEditor.Options`. Plugins may also supply `LanguageEditFeedback` to replace the default framed save result with one plugin-owned `ComponentText`; the callback receives a typed `LanguageEditChange` containing locale, key, previous value, and new value. `Options` also accepts a `LanguageUpdateAction` as `updateAction` and a `LocaleDisplayNames` resolver as `displayNames`; the shorter constructors pass `null` for both. With an update action, `update` appears in tab completion, `language update` runs the action off the main thread after the server-scope permission check, and the switcher reports through the `language.update.*` keys. With a display-name resolver, the picker and editor show its names instead of the canonical suite locale names. The switcher derives the personal permission from the lowercase plugin name followed by `.language.self` and registers it with default `true` when the plugin descriptor does not already define it.

`PluginLanguageEditor.Options` supplies a preparation-only `SnapshotLoader` and a `MessageWriter`. The writer receives an `Edit` containing locale, key, expected value, and replacement value; it validates and atomically persists the native file, installs a matching active server snapshot, and returns the saved snapshot. The shared editor serializes its asynchronous work, rejects stale values, and refreshes personal caches after saves. `LanguageFileEditor.update` provides strict UTF-8, size bounds, regular-path checks, external-write detection, and atomic file publication around a typed preparation callback. The switcher closes its editor during shutdown.

Plugins can pass a fourth `BukkitLanguageEditorPresentation` argument to `BukkitLanguageSwitcher.register` to choose the editor layout and message icons. `Layout.CENTERED` uses centered categories and 45 message entries per page; `Layout.FOUR_ROWS` uses 36 left-aligned category or message entries in the first four rows. The icon resolver receives a category or full message ID and returns an optional item stack; the editor clones it before applying localized names and lore, preserving custom-model metadata. Empty results use the standard category or paper icon, and navigation remains on the bottom row.

`TomlLanguageEditor.upsert` accepts typed text, line, and plural values and preserves literal dotted message IDs. Serialization uses the grouped writer, retains leading instructions and unrelated file values, and preserves plural table boundaries. Removing a scalar message preserves independent child message IDs.

Plugins using `ConfigHotloadEngine` can wrap an internal file save in `write(file, FileWrite<T>)`. The callback returns `Written<T>(content, value)` after committing the bytes; the engine records those bytes and returns the value. The transaction serializes with hotload application for that file, suppresses notifications for the plugin's own write, and invalidates older captured snapshots. `StableContentSnapshot` contains the file, signature, normalized content, and `selfWriteRevision`; apply snapshots returned by the engine without replacing their revision. `noteSelfWrite(file, content)` acknowledges an already completed write but does not serialize the preceding file operation. Release application locks before invoking callbacks that acquire a language-service commit boundary.

Call `configure(pollIntervalMs, hotloadCooldownMs, watchedFiles, watchedDirectories)` when initializing the watch set; it resets tracked contents and establishes a baseline from disk. After settings change, use `updateTiming(pollIntervalMs, hotloadCooldownMs)` to adjust scan cadence and the cooldown without replacing that baseline, pending edits, queued snapshots, or self-write revisions. Both timing values have a 100 ms minimum. The next poll reconciles the existing watch set; the new cooldown applies from the previous completed application or emission rather than starting a new cooldown window. The consuming plugin remains responsible for scheduling polls at its configured interval.

While language providers are registered, the shared switcher automatically maintains one `/volmit` command for `/volmit plugins`, `/volmit plugins languages [lang]`, `/volmit plugins debug [plugin] [upload=true|false]`, and `/volmit plugins updates`. If the owning plugin closes, ownership passes to another registered provider; no additional command configuration is required. Language, debug, and update providers use separate service protocols. A current command implementation can take ownership from a recognized older Volmit command and restore it on close if its provider remains loaded.

The plugin owns its local language command registration. `open(sender)` opens its picker; `command(sender, arguments)` and `complete(sender, arguments)` handle the arguments after `language`. Route this subcommand before a root administration check so players can reach their personal preferences. Providers exchange only JDK types through Bukkit's services registry, so separately relocated VolmLib copies can coordinate without sharing plugin classes. Close both the switcher and service during shutdown.

Platform-neutral consumers such as Iris modded adapters can use `PluginLanguageService`, `LanguageAudience`, `RemoteLanguageCatalog`, and `LanguageUpstreamSync` without loading the Bukkit switcher.
