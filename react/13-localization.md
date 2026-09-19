---
title: "Localization"
description: "Server and React Web language settings"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

React's server default is the `language` key in `plugins/React/react.toml`. Its own permission node
is `react.language.self`, and server selection accepts `react.use` or `volmit.language.admin`.

See [Languages](/languages) for the picker, permissions, the full locale list, fallback rules, and how to edit or translate messages.

## React Web locale selection

The language button switches React Web without reloading the page. The browser stores the choice under `reactor.locale`. On the first visit, it tries a supported browser language, then `REACTOR_LANGUAGE`, then `en_US`. This choice does not change the server setting.

`he_IL` uses right-to-left page direction. Commands, pairing codes, and technical values remain left-to-right.

Complete browser catalogs live at `react-web/web/languages/<locale>.json`. The optional `reactor-language.json` overlay applies only to `REACTOR_LANGUAGE`. React Web validates a catalog before switching and keeps the previous language if loading fails.
