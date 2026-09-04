---
title: "Localization"
description: "Server and React Web language settings"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
React and React Web use separate choices from the same 18 languages. The server uses TOML catalogs; the browser uses JSON and stores its choice locally.

## Server locale selection

The `language` setting in `react.toml` selects the server default. `/react language` opens the personal picker, `/react language server` changes the default, and `/react language self reset` clears a personal choice. Player-facing output uses the recipient's choice; console and shared output use the server default.

Selected catalogs download when needed and work offline afterward. React validates templates and placeholders before use. A failed catalog falls back to English.

Player preferences are stored by UUID in `language-preferences.properties` in the plugin data folder. `self reset` removes a personal override. The server default applies to console output and players without an override. Sparse local message overrides remain active above the downloaded catalog.

React stores catalogs at `plugins/React/languages/<locale>.toml`. Files in `languages/overrides` take precedence.

Personal language selection requires both `react.language.self` and `volmit.language.self`, each granted by default (`true`). Denying either permission blocks the personal picker, direct locale selection, and `self reset`. React server selection requires `react.use` or `volmit.language.admin` (default `op`).

`/volmit plugins languages [locale]` manages the server default for all enabled Volmit language providers. It keeps personal choices and offers only locales shared by every provider.

## In-game message editor

Run `/react language server edit` to choose a locale, or `/react language server edit de_DE` to edit German directly. The server language picker also offers an Edit link for each locale. The inventory editor requires `react.use` or `volmit.language.admin` and is available only to players.

Saving writes to `plugins/React/languages/overrides/<locale>.toml` after validation. React rejects invalid or stale edits. Saving refreshes the edited locale without changing anyone's language choice.

## Supported locales

The server and browser support `en_US`, `de_DE`, `es_ES`, `fi_FI`, `fr_FR`, `he_IL`, `it_IT`,
`ja-JP`, `ko_KR`, `lt_LT`, `nl_NL`, `pl_PL`, `pt_PT`, `ru_RU`, `tr_TR`, `vi_VI`, `zh_CN`, and
`zh_TW`. These ids are literal fleet identifiers: Japanese uses `ja-JP`, and Vietnamese uses
`vi_VI`.

## React Web locale selection

The language button switches React Web without reloading the page. The browser stores the choice under `reactor.locale`. On the first visit, it tries a supported browser language, then `REACTOR_LANGUAGE`, then `en_US`. This choice does not change the server setting.

`he_IL` uses right-to-left page direction. Commands, pairing codes, and technical values remain left-to-right.

Complete browser catalogs live at `react-web/web/languages/<locale>.json`. The optional `reactor-language.json` overlay applies only to `REACTOR_LANGUAGE`. React Web validates a catalog before switching and keeps the previous language if loading fails.

## Server catalogs

Server messages are Java catalogs under `art.arcane.react.localization.catalog`. Feature and tweak labels and `@ConfigDoc` text are separate from player command messages.

VolmLib renders command chat, action bars, clickable output, and logs. Paper clients retain supported formatting and interactions; plain consoles and RCON receive readable text.

## Validation

An overlay may contain nested TOML string values or arrays of strings. The file limit is 2 MiB. Templates use strict MiniMessage. Message placeholders cannot appear inside MiniMessage tags. Hotload rejects a null value, a non-string scalar, or an invalid array member. It also rejects an invalid template, invalid placeholder placement, an oversized file, or an invalid locale name.

Hotload validates the complete candidate before it swaps the locale in. On rejection React keeps the current active locale. It reports up to 12 validation errors. An underlying failure is logged as a contextual React error with its complete exception diagnostics. Missing translated keys are warnings. They resolve through the downloaded catalog and then code-owned English.

Add new server-visible strings to the English catalog. Locale overlays may omit them and use fallback.
