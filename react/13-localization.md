---
title: "Localization"
description: "React documentation: Localization"
published: true
date: 2026-09-03T07:33:50.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
React and React Web use separate locale selections over the same 18-language set. The server uses a
typed code-owned English catalog, downloaded overlays and an optional server-local override. The
browser uses JSON catalogs and remembers its own choice locally.

## Server locale selection

- Global config key: `language` (default `en_US`) on `ReactConfiguration`.
- Missing keys fall back from the selected downloaded catalog to code-owned English.
- Optional overrides live in `plugins/React/languages/overrides/<locale>.toml`. Only listed keys are replaced. The filename must match the configured locale id exactly.
The Bukkit picker uses React's Director menu theme, header, clickable controls, and pagination. Tab completion includes the `self` and `server` scopes, available locales, and personal reset according to the sender's permissions.

- `/react language` opens the clickable personal picker. `/react language server` changes the default in `react.toml`; `/react language self reset` restores the default for that player. The config editor's language field opens the server picker.
- Player command feedback, inventory GUI labels and action-bar output use the recipient's choice. Shared server outputs use the server default.

VolmLib downloads a selected non-English catalog on demand, validates its templates and placeholders, and installs it atomically. Locale files are excluded from the plugin jar. Installed catalogs are reused offline, and English defaults remain in Java.

If a requested download fails, is incomplete, or fails catalog preparation, the selected personal or server scope uses validated built-in English. The selected personal preference or server default is saved as `en_US`. The unavailable locale is never activated or saved, and the command reports that the language is unavailable and English is being used. Invalid command syntax and unlisted locales are rejected without changing the selection.

Player preferences are stored by UUID in `language-preferences.properties` in the plugin data folder. `self reset` removes a personal override. The server default applies to console output and players without an override. Sparse local message overrides remain active above the downloaded catalog.

React installs catalogs to `plugins/React/languages/<locale>.toml`. Selecting a language prepares the catalog on a worker before it becomes active. Locale-specific files in `languages/overrides` take precedence and hotloading an override refreshes the player catalog cache.

Personal language selection requires both `react.language.self` and `volmit.language.self`, each granted by default (`true`). Denying either permission blocks the personal picker, direct locale selection, and `self reset`. React server selection requires `react.use` or `volmit.language.admin` (default `op`).

`/volmit plugins languages` opens the picker for every enabled provider's server default; `/volmit plugins languages de_DE` changes those defaults to German. It preserves all personal overrides and offers only locales common to every provider. Access requires `volmit.language.admin` (default `op`) or each enabled plugin's server-language administration permission. If any required permission is denied, no defaults change.

## In-game message editor

Run `/react language server edit` to choose a locale, or `/react language server edit de_DE` to edit German directly. The server language picker also offers an Edit link for each locale. The inventory editor requires `react.use` or `volmit.language.admin` and is available only to players.

Saving writes that locale's message to `plugins/React/languages/overrides/<locale>.toml`, including `en_US`, after validating the message shape, placeholders, and complete candidate catalog. Invalid edits or messages changed since opening are rejected without replacing the file. The edited locale refreshes for players already using it and for the server when it is the active default; editing never changes server or personal language choices. Existing incomplete catalogs can be opened for repair without selecting them.

## Supported locales

The server and browser support `en_US`, `de_DE`, `es_ES`, `fi_FI`, `fr_FR`, `he_IL`, `it_IT`,
`ja-JP`, `ko_KR`, `lt_LT`, `nl_NL`, `pl_PL`, `pt_PT`, `ru_RU`, `tr_TR`, `vi_VI`, `zh_CN`, and
`zh_TW`. These ids are literal fleet identifiers: Japanese uses `ja-JP`, and Vietnamese uses
`vi_VI`.

## React Web locale selection

The language button in the top-right command bar switches the complete browser interface without
reloading the page. React Web stores the selected id under `reactor.locale` in browser local
storage. On a first visit it tries a supported browser language, including a base-language match,
then the build-time `REACTOR_LANGUAGE` value, then `en_US`. Browser languages are considered in
preference order. A valid stored choice wins on later visits. The browser choice does not change
the React server's `language` setting.

The page writes the matching BCP 47 language to the HTML document. `he_IL` uses right-to-left
document direction; every other supported locale uses left-to-right direction. Commands, pairing
codes and other technical values remain left-to-right. The document title, description, social
metadata and install manifest switch with the interface language.

English defaults remain typed in Dart. Editable complete catalogs live at
`react-web/web/languages/<locale>.json`, including `en_US.json`. The optional deployment-wide
`react-web/web/reactor-language.json` overlay is applied only when the selected locale matches the
build-time `REACTOR_LANGUAGE` locale, so it cannot leak one language into another picker choice.
Each switch loads and validates the complete candidate before publishing it. A fetch, JSON,
unknown-key or placeholder failure keeps the previous active language and does not persist the
rejected choice. At initial startup, English remains active when the preferred catalog cannot load.
Localized files under `react-web/web/manifests/` are generated from each catalog's app title and
description; translators edit only the JSON catalog.

## Server catalogs

Server messages are typed Java catalogs under `art.arcane.react.localization.catalog`. Examples are command, runtime, action, and config messages. Feature and tweak display strings and `@ConfigDoc` English are separate from player-facing command chat. Catalogs apply to that command chat.

React sends catalog components through VolmLib for command chat, action bars, clickable output, and plugin logging. Paper-family players and component-aware consoles retain RGB, decorations, and click or hover events; operator-visible component logs keep one `[React]` discriminator with dark-grey brackets and the React name in aqua. Plain Bukkit, unsupported console APIs, RCON, and Java-logger fallbacks receive destination-safe text, so supported formatting remains visible without exposing raw `§` markers in operator consoles.

## Validation

An overlay may contain nested TOML string values or arrays of strings. The file limit is 2 MiB. Templates use strict MiniMessage. Message placeholders cannot appear inside MiniMessage tags. Hotload rejects a null value, a non-string scalar, or an invalid array member. It also rejects an invalid template, invalid placeholder placement, an oversized file, or an invalid locale name.

Hotload validates the complete candidate before it swaps the locale in. On rejection React keeps the current active locale. It reports up to 12 validation errors. An underlying failure is logged as a contextual React error with its complete exception diagnostics. Missing translated keys are warnings. They resolve through the downloaded catalog and then code-owned English.

Localization tests and completeness gates live in the React test suites. Add new server-visible strings to the typed English catalog. Locale overlays may omit them and use fallback.
