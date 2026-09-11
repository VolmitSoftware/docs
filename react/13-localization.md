---
title: "Localization"
description: "Server and React Web language settings"
published: true
date: 2026-09-10T06:12:13.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
React and React Web use separate choices from the same 18 languages. The server uses TOML catalogs; the browser uses JSON and stores its choice locally.

## Server locale selection

The `language` setting in `react.toml` selects the server default. `/react language` opens the personal picker, `/react language server` changes the default, and `/react language self reset` clears a personal choice. The plural `/react languages` is an alias for every form and shares the same tab completion. Player-facing output uses the recipient's choice; console and shared output use the server default.

On startup, React creates a complete `plugins/React/languages/en_US.toml` from its built-in English messages if that file is missing. Selected non-English catalogs download only when their local file is missing and work offline afterward. React validates templates and placeholders before use and preserves existing local edits.

Language selection and editor saves report their own result once. Automatic catalog creation and in-game language changes do not also produce operator hotload-diff notices. Manual file edits continue through normal validation and report changed keys when operator notifications are enabled.

Player preferences are stored by UUID in `languages/language-preferences.properties` in the plugin data folder. `self reset` removes a personal override. The server default applies to console output and players without an override.

Edit messages directly in `plugins/React/languages/<locale>.toml`. React automatically watches all language catalogs and refreshes an edited locale for both personal users and server-default output. Personal locales refresh even when they differ from the server default. A saved catalog refresh takes precedence over an older locale load already in progress. Generated English and repository catalogs begin with a comment reference that explains formatting and each message variable in the catalog's language. Keep placeholder names and executable command syntax unchanged when translating or editing the text.

Personal language selection requires both `react.language.self` and `volmit.language.self`, each granted by default (`true`). Denying either permission blocks the personal picker, direct locale selection, and `self reset`. React server selection requires `react.use` or `volmit.language.admin` (default `op`).

`/volmit plugins languages [locale]` manages the server default for all enabled Volmit language providers. It keeps personal choices and offers only locales shared by every provider.

## In-game message editor

Run `/react language server edit` to choose a locale, or `/react language server edit de_DE` to edit German directly. The server language picker also offers an Edit link for each locale. The inventory editor requires `react.use` or `volmit.language.admin` and is available only to players.

Saving writes to `plugins/React/languages/<locale>.toml` after validation. React rejects invalid or stale edits. Saving preserves the translated leading comment reference and refreshes the edited locale without changing anyone's language choice.

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

English and all 17 repository translations cover the same catalog, including language picker and editor controls, `/react debug dump` feedback, map checks, command help, and configuration descriptions. Debug-dump feedback resolves through React's language service; diagnostic report contents retain their technical identifiers.

VolmLib renders command chat, action bars, clickable output, and logs. Paper clients retain supported formatting and interactions; plain consoles and RCON receive readable text.

## Validation

Language files use grouped TOML sections: `[command.feedback]` with `saved = "..."` represents `command.feedback.saved`. Generated English and downloaded catalogs share four localized header sections: file editing, prefix behavior, formatting, and individual variable definitions. Editor saves keep the existing leading comments and group message keys; other valid local files are not rewritten just to change their layout.

A catalog may contain nested TOML string values or arrays of strings. The file limit is 2 MiB. Chat templates support classic ampersand color codes or strict MiniMessage. Use one format per message; messages containing MiniMessage tags do not convert ampersand codes. Message placeholders cannot appear inside MiniMessage tags. A null value, non-string scalar, invalid array member, invalid template or incorrect placeholder makes that message use English. Unknown keys are ignored. An invalid locale name or oversized file remains a file-level error.

English defaults and repository translations use `&0`–`&9` and `&a`–`&f` for colors, `&l` for bold, `&o` for italic, `&n` for underline, `&m` for strikethrough, `&k` for obfuscated text, and `&r` to reset formatting. RGB colors use `&#RRGGBB`. Color codes clear active styles, so bold aqua text is `&b&lText&r`. Use MiniMessage throughout a message when it needs advanced effects or click/hover tags.

Backslashes and angle brackets in plain-text variables remain literal, including Windows drive and network paths. They do not alter the message's formatting or escape its closing color tags.

Renderer text, configuration annotations, and test details are plain text; `test.result.*` messages support chat formatting. TOML escapes remain distinct: `\n` inserts a line break, while `\\n` displays the literal characters `\n` used in editor instructions.

Hotload validates entries independently before installing the resulting locale. Malformed TOML uses English and logs a contextual React error with its complete exception diagnostics. In-game edits still validate the replacement and reject invalid or stale values before writing.

Missing messages do not prevent personal or server locale selection. React renders those messages in built-in English while keeping the selected locale active and leaving the local file unchanged. Invalid individual templates or placeholders also fall back to English without rejecting the remaining translations. Malformed TOML uses English for the whole file until it is corrected.

Add new server-visible strings to the English Java catalog and every repository translation. Catalog tests check registered message definitions, literal message lookups, matching keys, required placeholders, formatting, and variable references. Local TOML catalogs may omit entries and use fallback.
