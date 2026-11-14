---
title: "Localization"
description: "Server and React Web language settings"
published: true
date: 2026-11-01T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

React's server default is the `language` key in `plugins/React/react.toml`. Its own permission node
is `react.language.self`, and server selection accepts `react.use` or `volmit.language.admin`.

Configuration descriptions use the selected locale. The Language tile in `/react config` shows the locale ID and its display name.

## Repository catalogs

English ships inside React. The seventeen translated catalogs come from the `master` branch of [VolmitSoftware/React](https://github.com/VolmitSoftware/React) under `React/src/main/resources/languages`. Selecting a locale that is not installed downloads it at the branch revision React last checked. A server default in `react.toml` that is not installed downloads in the background; English stays active until the file arrives, then React reloads the language.

Installed catalogs merge repository changes at startup and whenever an operator runs `/react language update`. New and changed messages arrive, messages you edited by hand stay as you wrote them, and retired messages you never touched are removed. English merges new messages from the built-in catalog the same way after a React update. The pristine copies used for that comparison live in `languages/.upstream/`; leave that directory alone. Checks run at most once every five minutes; a restart or a repeated command inside that window skips the request and the command reports the remaining wait. A failed check, including one blocked by the GitHub rate limit, leaves the installed files and the selected language unchanged. The console logs one line per updated locale with its counts, or `React languages match VolmitSoftware/React@master (<revision>).` when nothing changed. `/react debugdump` reports the source, revision, last check time, and last error.

## Custom languages

Any other `languages/<id>.toml` whose ID is 2 to 32 letters, digits, `_`, or `-` is a custom language. It appears in the picker, the message editor, and `/react language server`, and updates never change it. Setting `language` in `react.toml` to a custom ID that has no file creates one from the English reference, with `[meta]` naming it after the ID and basing it on `en_US`. An optional `[meta]` table sets the display name and a locale to use before English for messages the file leaves out:

```toml
[meta]
name = "Pirate Speak"
base = "de_DE"
```

A base can name another custom language, up to four levels deep; a base that loops back is ignored. Without `[meta]`, the picker shows the file name and missing messages use English directly.

See [Languages](/languages) for the picker, permissions, the full locale list, fallback rules, and how to edit or translate messages.

## React Web locale selection

**Select language** in the top bar's **...** menu switches React Web without reloading the page, and so does **Settings** > **General** > **Language**. The browser stores the choice under `reactor.locale`. On the first visit, it tries a supported browser language, then `REACTOR_LANGUAGE`, then `en_US`. This choice does not change the server setting.

`he_IL` uses right-to-left page direction. Commands, pairing links, and technical values remain left-to-right.

Complete browser catalogs live at `react-web/web/languages/<locale>.json`. The optional `reactor-language.json` overlay applies only to `REACTOR_LANGUAGE`. React Web validates a catalog before switching and keeps the previous language if loading fails.
