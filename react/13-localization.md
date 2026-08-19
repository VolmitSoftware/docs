---
title: "Localization"
description: "React documentation: Localization"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
React uses a typed code-owned English catalog, optional bundled locale overlays, and an optional server-local override. Locale changes and override edits can hotload without a React restart.

## Server locale selection

- Global config key: `language` (default `en_US`) on `ReactConfiguration`.
- Missing keys fall back from the selected bundle to code-owned English.
- Optional overrides live in `plugins/React/languages/overrides/<locale>.toml`. Only listed keys are replaced. The filename must match the configured locale id exactly.
- If no bundle exists for a valid locale id, React warns. It then uses code-owned English plus any matching local override.

## Bundled locales

Bundled locale ids are `de_DE`, `es_ES`, `fi_FI`, `fr_FR`, `he_IL`, `it_IT`, `ja-JP`, `ko_KR`, `lt_LT`, `nl_NL`, `pl_PL`, `pt_PT`, `ru_RU`, `tr_TR`, `vi_VI`, `zh_CN`, and `zh_TW`. Locale ids accept letters, digits, `_`, and `-`. Japanese uses `ja-JP` on purpose.

## Catalogs

Server messages are typed Java catalogs under `art.arcane.react.localization.catalog`. Examples are command, runtime, action, and config messages. Feature and tweak display strings and `@ConfigDoc` English are separate from player-facing command chat. Catalogs apply to that command chat.

## Validation

An overlay may contain nested TOML string values or arrays of strings. The file limit is 2 MiB. Templates use strict MiniMessage. Message placeholders cannot appear inside MiniMessage tags. Hotload rejects a null value, a non-string scalar, or an invalid array member. It also rejects an invalid template, invalid placeholder placement, an oversized file, or an invalid locale name.

Hotload validates the complete candidate before it swaps the locale in. On rejection React keeps the current active locale. It reports up to 12 validation errors. It prints the underlying failure stack trace when present. Missing translated keys are warnings. They resolve through the selected bundle and then code-owned English.

Localization tests and completeness gates live in the React test suites. Add new server-visible strings to the typed English catalog. Locale overlays may omit them and use fallback.
